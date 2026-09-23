import { useEffect, useRef, useState, type FormEvent } from 'react'
import { DELIVERY_FEE, WHATSAPP_DISPLAY } from '../data/menu'
import type { CartItem, CustomerData, PaymentMethod } from '../types'
import {
  formatCurrency,
  isValidCep,
  isValidPhone,
  maskCep,
  maskPhone,
  onlyDigits,
} from '../utils/format'
import { PAYMENT_LABELS, getCartTotal } from '../utils/whatsapp'
import { NoteIcon, PinIcon, UserIcon, WhatsAppIcon } from './Icons'

interface CheckoutFormProps {
  items: CartItem[]
  payment: PaymentMethod
  onSubmit: (data: CustomerData) => void
}

type Errors = Partial<Record<keyof CustomerData, string>>

const EMPTY: CustomerData = {
  name: '',
  phone: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  notes: '',
}

const STORAGE_KEY = 'tempero-dela:customer'

function loadCustomer(): CustomerData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<CustomerData>) }
  } catch {
    return EMPTY
  }
}

interface ViaCepResponse {
  erro?: boolean
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
}

function validate(data: CustomerData): Errors {
  const errors: Errors = {}
  if (data.name.trim().length < 3) errors.name = 'Informe seu nome completo.'
  if (!isValidPhone(data.phone)) errors.phone = 'Informe um celular válido com DDD.'
  if (!isValidCep(data.cep)) errors.cep = 'CEP deve ter 8 dígitos.'
  if (!data.street.trim()) errors.street = 'Informe a rua.'
  if (!data.number.trim()) errors.number = 'Informe o número.'
  if (!data.neighborhood.trim()) errors.neighborhood = 'Informe o bairro.'
  if (!data.city.trim()) errors.city = 'Informe a cidade.'
  return errors
}

export function CheckoutForm({ items, payment, onSubmit }: CheckoutFormProps) {
  const [data, setData] = useState<CustomerData>(loadCustomer)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof CustomerData, boolean>>>({})
  const [cepStatus, setCepStatus] = useState<'idle' | 'loading' | 'found' | 'notfound' | 'error'>(
    'idle',
  )
  const lastCepLookup = useRef<string>('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  // Busca automática do endereço pelo CEP (ViaCEP)
  useEffect(() => {
    const digits = onlyDigits(data.cep)
    if (digits.length !== 8 || digits === lastCepLookup.current) return
    lastCepLookup.current = digits

    const controller = new AbortController()
    setCepStatus('loading')

    fetch(`https://viacep.com.br/ws/${digits}/json/`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Falha na consulta')
        return res.json() as Promise<ViaCepResponse>
      })
      .then((json) => {
        if (json.erro) {
          setCepStatus('notfound')
          return
        }
        setCepStatus('found')
        setData((prev) => ({
          ...prev,
          street: json.logradouro || prev.street,
          neighborhood: json.bairro || prev.neighborhood,
          city: json.localidade
            ? `${json.localidade}${json.uf ? ` - ${json.uf}` : ''}`
            : prev.city,
        }))
        setErrors((prev) => ({
          ...prev,
          street: undefined,
          neighborhood: undefined,
          city: undefined,
        }))
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setCepStatus('error')
      })

    return () => controller.abort()
  }, [data.cep])

  function setField<K extends keyof CustomerData>(field: K, value: CustomerData[K]) {
    setData((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validate({ ...data, [field]: value })[field] }))
    }
  }

  function handleBlur(field: keyof CustomerData) {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors((prev) => ({ ...prev, [field]: validate(data)[field] }))
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const nextErrors = validate(data)
    setErrors(nextErrors)
    setTouched({
      name: true,
      phone: true,
      cep: true,
      street: true,
      number: true,
      neighborhood: true,
      city: true,
    })
    const firstError = (Object.keys(nextErrors) as Array<keyof CustomerData>)[0]
    if (firstError) {
      const el = document.getElementById(`field-${firstError}`)
      el?.focus()
      return
    }
    onSubmit(data)
  }

  const total = getCartTotal(items, payment)
  const totalQty = items.reduce((s, ci) => s + ci.quantity, 0)

  const cepHint = (() => {
    switch (cepStatus) {
      case 'loading':
        return { text: 'Buscando endereço...', className: 'field__hint field__hint--loading' }
      case 'found':
        return { text: 'Endereço preenchido automaticamente. Confira e informe o número.', className: 'field__hint' }
      case 'notfound':
        return { text: 'CEP não encontrado. Preencha o endereço manualmente.', className: 'field__hint' }
      case 'error':
        return { text: 'Não foi possível consultar o CEP. Preencha manualmente.', className: 'field__hint' }
      default:
        return null
    }
  })()

  return (
    <form className="form" onSubmit={handleSubmit} noValidate id="checkout-form">
      <section className="form__section" aria-labelledby="sec-customer">
        <h3 className="form__section-title" id="sec-customer">
          <UserIcon /> Seus dados
        </h3>

        <div className="field">
          <label htmlFor="field-name">Nome completo</label>
          <input
            id="field-name"
            name="name"
            autoComplete="name"
            value={data.name}
            onChange={(e) => setField('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'err-name' : undefined}
            placeholder="Como devemos te chamar?"
            required
          />
          {errors.name && (
            <p className="field__error" id="err-name" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="field-phone">Celular (WhatsApp)</label>
          <input
            id="field-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            value={data.phone}
            onChange={(e) => setField('phone', maskPhone(e.target.value))}
            onBlur={() => handleBlur('phone')}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'err-phone' : undefined}
            placeholder="(21) 99999-9999"
            maxLength={15}
            required
          />
          {errors.phone && (
            <p className="field__error" id="err-phone" role="alert">
              {errors.phone}
            </p>
          )}
        </div>
      </section>

      <section className="form__section" aria-labelledby="sec-address">
        <h3 className="form__section-title" id="sec-address">
          <PinIcon /> Endereço de entrega
        </h3>

        <div className="form__row form__row--cep">
          <div className="field">
            <label htmlFor="field-cep">CEP</label>
            <input
              id="field-cep"
              name="cep"
              inputMode="numeric"
              autoComplete="postal-code"
              value={data.cep}
              onChange={(e) => setField('cep', maskCep(e.target.value))}
              onBlur={() => handleBlur('cep')}
              aria-invalid={Boolean(errors.cep)}
              aria-describedby={errors.cep ? 'err-cep' : cepHint ? 'hint-cep' : undefined}
              placeholder="00000-000"
              maxLength={9}
              required
            />
            {errors.cep ? (
              <p className="field__error" id="err-cep" role="alert">
                {errors.cep}
              </p>
            ) : (
              cepHint && (
                <p className={cepHint.className} id="hint-cep" aria-live="polite">
                  {cepHint.text}
                </p>
              )
            )}
          </div>

          <div className="field">
            <label htmlFor="field-city">Cidade</label>
            <input
              id="field-city"
              name="city"
              autoComplete="address-level2"
              value={data.city}
              onChange={(e) => setField('city', e.target.value)}
              onBlur={() => handleBlur('city')}
              aria-invalid={Boolean(errors.city)}
              aria-describedby={errors.city ? 'err-city' : undefined}
              placeholder="Rio de Janeiro - RJ"
              required
            />
            {errors.city && (
              <p className="field__error" id="err-city" role="alert">
                {errors.city}
              </p>
            )}
          </div>
        </div>

        <div className="form__row form__row--num">
          <div className="field">
            <label htmlFor="field-street">Rua</label>
            <input
              id="field-street"
              name="street"
              autoComplete="address-line1"
              value={data.street}
              onChange={(e) => setField('street', e.target.value)}
              onBlur={() => handleBlur('street')}
              aria-invalid={Boolean(errors.street)}
              aria-describedby={errors.street ? 'err-street' : undefined}
              placeholder="Nome da rua"
              required
            />
            {errors.street && (
              <p className="field__error" id="err-street" role="alert">
                {errors.street}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="field-number">Número</label>
            <input
              id="field-number"
              name="number"
              inputMode="numeric"
              value={data.number}
              onChange={(e) => setField('number', e.target.value)}
              onBlur={() => handleBlur('number')}
              aria-invalid={Boolean(errors.number)}
              aria-describedby={errors.number ? 'err-number' : undefined}
              placeholder="123"
              required
            />
            {errors.number && (
              <p className="field__error" id="err-number" role="alert">
                {errors.number}
              </p>
            )}
          </div>
        </div>

        <div className="field">
          <label htmlFor="field-complement">
            Complemento <span className="optional">(opcional)</span>
          </label>
          <input
            id="field-complement"
            name="complement"
            autoComplete="address-line2"
            value={data.complement}
            onChange={(e) => setField('complement', e.target.value)}
            placeholder="Apto, bloco, casa, referência..."
          />
        </div>

        <div className="field">
          <label htmlFor="field-neighborhood">Bairro</label>
          <input
            id="field-neighborhood"
            name="neighborhood"
            autoComplete="address-level3"
            value={data.neighborhood}
            onChange={(e) => setField('neighborhood', e.target.value)}
            onBlur={() => handleBlur('neighborhood')}
            aria-invalid={Boolean(errors.neighborhood)}
            aria-describedby={errors.neighborhood ? 'err-neighborhood' : undefined}
            placeholder="Bairro"
            required
          />
          {errors.neighborhood && (
            <p className="field__error" id="err-neighborhood" role="alert">
              {errors.neighborhood}
            </p>
          )}
        </div>
      </section>

      <section className="form__section" aria-labelledby="sec-notes">
        <h3 className="form__section-title" id="sec-notes">
          <NoteIcon /> Observações <span className="optional" style={{ fontWeight: 400 }}>(opcional)</span>
        </h3>
        <div className="field">
          <label htmlFor="field-notes" className="sr-only">
            Observações
          </label>
          <textarea
            id="field-notes"
            name="notes"
            value={data.notes}
            onChange={(e) => setField('notes', e.target.value)}
            placeholder="Horário preferido para entrega, ponto de referência, alergias..."
            maxLength={300}
          />
        </div>
      </section>

      <div className="review">
        <h4 className="review__title">Resumo</h4>
        <ul>
          <li>
            <span>Marmitas</span>
            <span>{totalQty}</span>
          </li>
          <li>
            <span>Pagamento</span>
            <span>{PAYMENT_LABELS[payment]}</span>
          </li>
          <li>
            <span>Subtotal</span>
            <span>{formatCurrency(total)}</span>
          </li>
          <li>
            <span>Entrega</span>
            <span className="summary__free">Grátis</span>
          </li>
          <li>
            <span>Total</span>
            <span>{formatCurrency(total + DELIVERY_FEE)}</span>
          </li>
        </ul>
      </div>

      <div className="notice">
        Ao enviar, o WhatsApp será aberto com o pedido pronto para o número{' '}
        <strong>{WHATSAPP_DISPLAY}</strong>. Basta confirmar o envio da mensagem.
      </div>

      <button type="submit" className="btn btn--green btn--block btn--lg">
        <WhatsAppIcon />
        Enviar pedido pelo WhatsApp
      </button>
    </form>
  )
}
