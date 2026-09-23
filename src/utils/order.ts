import { MIN_ORDER_QUANTITY } from '../data/menu'

export interface MinimumOrderStatus {
  /** Total de marmitas no carrinho */
  quantity: number
  /** Quantidade mínima exigida */
  minimum: number
  /** Quantas ainda faltam (0 quando atingido) */
  missing: number
  /** Percentual de progresso até o mínimo (0 a 100) */
  progress: number
  /** Se o pedido já pode ser finalizado */
  reached: boolean
}

export function getMinimumOrderStatus(quantity: number): MinimumOrderStatus {
  const missing = Math.max(0, MIN_ORDER_QUANTITY - quantity)
  return {
    quantity,
    minimum: MIN_ORDER_QUANTITY,
    missing,
    progress: Math.min(100, Math.round((quantity / MIN_ORDER_QUANTITY) * 100)),
    reached: missing === 0,
  }
}

export function pluralMarmitas(n: number): string {
  return `${n} ${n === 1 ? 'marmita' : 'marmitas'}`
}
