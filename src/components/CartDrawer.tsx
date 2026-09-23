import { useCallback, useEffect, useRef, useState } from 'react'
import { DELIVERY_FEE } from '../data/menu'
import type { CartApi } from '../hooks/useCart'
import type { CustomerData, PaymentMethod } from '../types'
import { formatCurrency } from '../utils/format'
import { getMinimumOrderStatus, pluralMarmitas } from '../utils/order'
import { buildOrderMessage, buildWhatsAppUrl, getCartTotal } from '../utils/whatsapp'
import { CartList } from './CartList'
import { CheckoutForm } from './CheckoutForm'
import { BackIcon, CheckIcon, CloseIcon, EmptyBoxIcon, WhatsAppIcon } from './Icons'
import { MinimumOrderProgress } from './MinimumOrderProgress'
import { PaymentSelector } from './PaymentSelector'

type Step = 'cart' | 'checkout' | 'success'

interface CartDrawerProps {
  open: boolean
  cart: CartApi
  payment: PaymentMethod
  onPaymentChange: (p: PaymentMethod) => void
  onClose: () => void
}

export function CartDrawer({ open, cart, payment, onPaymentChange, onClose }: CartDrawerProps) {
  const [step, setStep] = useState<Step>('cart')
  const [lastUrl, setLastUrl] = useState<string | null>(null)
  const drawerRef = useRef<HTMLElement>(null)

  // Fecha e volta para o passo inicial
  const close = useCallback(() => {
    setStep('cart')
    setLastUrl(null)
    onClose()
  }, [onClose])

  // Fecha no ESC, bloqueia scroll do body e move o foco para o drawer
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    drawerRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, close])

  if (!open) return null

  const total = getCartTotal(cart.items, payment)
  const isEmpty = cart.items.length === 0
  const minimum = getMinimumOrderStatus(cart.totalQuantity)

  function handleSubmit(customer: CustomerData) {
    // Guarda final: o pedido mínimo é validado de novo no envio
    if (!minimum.reached) {
      setStep('cart')
      return
    }
    const message = buildOrderMessage(cart.items, customer, payment)
    const url = buildWhatsAppUrl(message)
    setLastUrl(url)
    window.open(url, '_blank', 'noopener,noreferrer')
    cart.clear()
    setStep('success')
  }

  const title =
    step === 'cart' ? 'Meu pedido' : step === 'checkout' ? 'Finalizar pedido' : 'Pedido enviado'

  const subtitle =
    step === 'cart'
      ? `${pluralMarmitas(cart.totalQuantity)} no combo`
      : step === 'checkout'
        ? 'Dados para entrega'
        : 'Obrigado pela preferência'

  return (
    <>
      <div className="drawer-backdrop" onClick={close} aria-hidden="true" />
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        ref={drawerRef}
        tabIndex={-1}
      >
        <header className="drawer__header">
          {step === 'checkout' && (
            <button
              type="button"
              className="icon-btn"
              onClick={() => setStep('cart')}
              aria-label="Voltar para o carrinho"
            >
              <BackIcon />
            </button>
          )}
          <h2 className="drawer__title" id="drawer-title">
            {title}
            <small>{subtitle}</small>
          </h2>
          <button type="button" className="icon-btn" onClick={close} aria-label="Fechar">
            <CloseIcon />
          </button>
        </header>

        <div className="drawer__body">
          {step === 'cart' &&
            (isEmpty ? (
              <div className="empty">
                <EmptyBoxIcon />
                <h3>Monte seu combo</h3>
                <p>
                  Escolha qualquer combinação de sabores e tamanhos. O pedido mínimo é de{' '}
                  {pluralMarmitas(minimum.minimum)} e a entrega é grátis.
                </p>
              </div>
            ) : (
              <>
                <MinimumOrderProgress status={minimum} />
                <CartList
                  items={cart.items}
                  payment={payment}
                  onUpdateQuantity={cart.updateQuantity}
                  onRemove={cart.removeItem}
                />
                <PaymentSelector value={payment} onChange={onPaymentChange} />
              </>
            ))}

          {step === 'checkout' && (
            <CheckoutForm items={cart.items} payment={payment} onSubmit={handleSubmit} />
          )}

          {step === 'success' && (
            <div className="success">
              <div className="success__icon">
                <CheckIcon />
              </div>
              <h3>Pedido enviado!</h3>
              <p>
                Abrimos o WhatsApp com a mensagem do seu pedido. Se a janela não abriu, use o
                botão abaixo.
              </p>
              {lastUrl && (
                <a
                  className="btn btn--green btn--block btn--lg"
                  href={lastUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon />
                  Abrir WhatsApp novamente
                </a>
              )}
            </div>
          )}
        </div>

        {step === 'cart' && !isEmpty && (
          <footer className="drawer__footer">
            <div className="summary">
              <div className="summary__row">
                <span>Marmitas</span>
                <span>{cart.totalQuantity}</span>
              </div>
              <div className="summary__row">
                <span>Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="summary__row">
                <span>Entrega</span>
                <span className="summary__free">Grátis</span>
              </div>
              <div className="summary__row summary__row--total">
                <span>Total</span>
                <span>{formatCurrency(total + DELIVERY_FEE)}</span>
              </div>
            </div>
            {!minimum.reached && (
              <p className="summary__warning" role="status">
                Faltam {pluralMarmitas(minimum.missing)} para atingir o pedido mínimo de{' '}
                {minimum.minimum}.
              </p>
            )}
            <button
              type="button"
              className="btn btn--primary btn--block btn--lg"
              onClick={() => setStep('checkout')}
              disabled={!minimum.reached}
              aria-disabled={!minimum.reached}
            >
              {minimum.reached
                ? 'Continuar para entrega'
                : `Adicione mais ${pluralMarmitas(minimum.missing)}`}
            </button>
            <button type="button" className="btn btn--ghost btn--block" onClick={close}>
              {minimum.reached ? 'Adicionar mais itens' : 'Voltar ao cardápio'}
            </button>
          </footer>
        )}

        {step === 'success' && (
          <footer className="drawer__footer">
            <button type="button" className="btn btn--ghost btn--block" onClick={close}>
              Voltar ao cardápio
            </button>
          </footer>
        )}
      </aside>
    </>
  )
}
