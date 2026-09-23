import type { PaymentMethod } from '../types'

interface PaymentSelectorProps {
  value: PaymentMethod
  onChange: (value: PaymentMethod) => void
}

const OPTIONS: Array<{ id: PaymentMethod; title: string; description: string }> = [
  { id: 'avista', title: 'À vista', description: 'Pix ou dinheiro na entrega' },
  { id: 'credito', title: 'Crédito', description: 'Cartão na entrega' },
]

export function PaymentSelector({ value, onChange }: PaymentSelectorProps) {
  return (
    <div className="payment">
      <span className="payment__label" id="payment-label">
        Forma de pagamento (na entrega)
      </span>
      <div className="payment__options" role="radiogroup" aria-labelledby="payment-label">
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={value === opt.id}
            className="payment__option"
            onClick={() => onChange(opt.id)}
          >
            <strong>{opt.title}</strong>
            <small>{opt.description}</small>
          </button>
        ))}
      </div>
      <p className="payment__hint">
        O valor das marmitas muda conforme a forma de pagamento. Nenhuma cobrança é feita
        pelo site.
      </p>
    </div>
  )
}
