import type { MinimumOrderStatus } from '../utils/order'
import { pluralMarmitas } from '../utils/order'
import { CheckIcon } from './Icons'

interface MinimumOrderProgressProps {
  status: MinimumOrderStatus
}

export function MinimumOrderProgress({ status }: MinimumOrderProgressProps) {
  return (
    <div className={`min-order${status.reached ? ' min-order--reached' : ''}`}>
      <div className="min-order__head">
        <strong>
          {status.reached ? (
            <>
              <CheckIcon /> Pedido mínimo atingido
            </>
          ) : (
            `Faltam ${pluralMarmitas(status.missing)}`
          )}
        </strong>
        <span>
          {Math.min(status.quantity, status.minimum)}/{status.minimum}
        </span>
      </div>
      <div
        className="min-order__bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={status.minimum}
        aria-valuenow={Math.min(status.quantity, status.minimum)}
        aria-label={`Progresso do pedido mínimo de ${status.minimum} marmitas`}
      >
        <span style={{ width: `${status.progress}%` }} />
      </div>
      <p className="min-order__hint">
        {status.reached
          ? 'Combo pronto! Você pode adicionar mais marmitas ou seguir para a entrega.'
          : `Monte seu combo com qualquer combinação de sabores e tamanhos. Mínimo de ${status.minimum} marmitas, entrega grátis.`}
      </p>
    </div>
  )
}
