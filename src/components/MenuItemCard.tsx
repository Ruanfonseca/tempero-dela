import { useState } from 'react'
import { getItemPrices } from '../data/menu'
import type { MenuItem, PaymentMethod, Size } from '../types'
import { formatCurrency } from '../utils/format'
import { CartIcon, LeafIcon } from './Icons'

interface MenuItemCardProps {
  item: MenuItem
  payment: PaymentMethod
  onAdd: (item: MenuItem, size: Size, quantity: number) => void
}

const SIZES: Size[] = ['350g', '400g']

export function MenuItemCard({ item, payment, onAdd }: MenuItemCardProps) {
  const [size, setSize] = useState<Size>('350g')
  const [quantity, setQuantity] = useState(1)
  const [imageFailed, setImageFailed] = useState(false)

  const pricing = getItemPrices(item)[size]
  const price = pricing[payment]
  const hasSpecialPrice = Boolean(item.prices)
  const otherLabel = payment === 'avista' ? 'crédito' : 'à vista'
  const otherPrice = payment === 'avista' ? pricing.credito : pricing.avista

  function handleAdd() {
    onAdd(item, size, quantity)
    setQuantity(1)
  }

  return (
    <article className="item" aria-labelledby={`item-${item.id}`}>
      <div className="item__media">
        {imageFailed ? (
          <div className="item__media-fallback" aria-hidden="true">
            <LeafIcon />
          </div>
        ) : (
          <img
            src={item.image}
            alt={`Foto ilustrativa: ${item.name}`}
            loading="lazy"
            decoding="async"
            width={640}
            height={420}
            onError={() => setImageFailed(true)}
          />
        )}
        {hasSpecialPrice && <span className="item__badge">Preço especial</span>}
        {!imageFailed && <span className="item__disclaimer">Imagem meramente ilustrativa</span>}
      </div>

      <h3 className="item__name" id={`item-${item.id}`}>
        {item.name}
      </h3>

      <div className="item__footer">
        <div
          className="segmented"
          role="group"
          aria-label={`Tamanho: ${item.name}`}
        >
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              className="segmented__option"
              aria-pressed={size === s}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="item__row">
          <div className="item__price">
            <strong>{formatCurrency(price)}</strong>
            <small>
              {formatCurrency(otherPrice)} no {otherLabel}
            </small>
          </div>

          <div className="qty" role="group" aria-label="Quantidade">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Diminuir quantidade"
              disabled={quantity <= 1}
            >
              −
            </button>
            <output aria-live="polite">{quantity}</output>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              aria-label="Aumentar quantidade"
            >
              +
            </button>
          </div>
        </div>

        <button type="button" className="btn btn--primary btn--block" onClick={handleAdd}>
          <CartIcon />
          Adicionar ao pedido
        </button>
      </div>
    </article>
  )
}
