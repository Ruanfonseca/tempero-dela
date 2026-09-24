import { getCategory } from '../data/menu'
import type { CartItem, PaymentMethod } from '../types'
import { formatCurrency } from '../utils/format'
import { getUnitPrice } from '../utils/whatsapp'

interface CartListProps {
  items: CartItem[]
  payment: PaymentMethod
  onUpdateQuantity: (key: string, quantity: number) => void
  onRemove: (key: string) => void
}

export function CartList({ items, payment, onUpdateQuantity, onRemove }: CartListProps) {
  return (
    <ul className="cart-list">
      {items.map((ci) => {
        const unit = getUnitPrice(ci, payment)
        const category = getCategory(ci.item.categoryId)
        return (
          <li className="cart-item" key={ci.key}>
            <img
              className="cart-item__thumb"
              src={ci.item.image}
              alt=""
              loading="lazy"
              width={56}
              height={56}
            />
            <div>
              <p className="cart-item__name">
                {ci.item.name}
              </p>
              <div className="cart-item__meta">
                <span className="pill">{ci.size}</span>
                <span>{category.name.replace('Cardápio ', '')}</span>
                <span>• {formatCurrency(unit)} un.</span>
              </div>
            </div>
            <div className="cart-item__price">{formatCurrency(unit * ci.quantity)}</div>
            <div className="cart-item__actions">
              <div className="qty qty--sm" role="group" aria-label="Quantidade">
                <button
                  type="button"
                  aria-label="Diminuir quantidade"
                  onClick={() => onUpdateQuantity(ci.key, ci.quantity - 1)}
                >
                  −
                </button>
                <output aria-live="polite">{ci.quantity}</output>
                <button
                  type="button"
                  aria-label="Aumentar quantidade"
                  onClick={() => onUpdateQuantity(ci.key, Math.min(99, ci.quantity + 1))}
                >
                  +
                </button>
              </div>
              <button type="button" className="link-danger" onClick={() => onRemove(ci.key)}>
                Remover
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
