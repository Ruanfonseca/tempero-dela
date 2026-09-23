import { formatCurrency } from '../utils/format'
import { getMinimumOrderStatus, pluralMarmitas } from '../utils/order'
import { CartIcon } from './Icons'

interface FloatingCartProps {
  count: number
  total: number
  onOpen: () => void
}

export function FloatingCart({ count, total, onOpen }: FloatingCartProps) {
  if (count === 0) return null
  const minimum = getMinimumOrderStatus(count)

  return (
    <div className="floating-cart">
      <div className="floating-cart__info">
        <small>
          {minimum.reached
            ? `${pluralMarmitas(count)} • Entrega grátis`
            : `${count}/${minimum.minimum} marmitas • faltam ${minimum.missing}`}
        </small>
        <strong>{formatCurrency(total)}</strong>
      </div>
      <button type="button" className="btn btn--primary" onClick={onOpen}>
        <CartIcon />
        {minimum.reached ? 'Ver pedido' : 'Ver combo'}
      </button>
    </div>
  )
}
