import { DELIVERY_FEE, WHATSAPP_NUMBER, getCategory, getItemPrices } from '../data/menu'
import type { CartItem, CustomerData, PaymentMethod } from '../types'
import { formatCurrency } from './format'

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  avista: 'À vista (Pix ou dinheiro)',
  credito: 'Cartão de crédito',
}

export function getUnitPrice(cartItem: CartItem, payment: PaymentMethod): number {
  return getItemPrices(cartItem.item)[cartItem.size][payment]
}

export function getCartTotal(items: CartItem[], payment: PaymentMethod): number {
  return items.reduce((sum, ci) => sum + getUnitPrice(ci, payment) * ci.quantity, 0)
}

export function buildOrderMessage(
  items: CartItem[],
  customer: CustomerData,
  payment: PaymentMethod,
): string {
  const lines: string[] = []

  lines.push('*NOVO PEDIDO - Tempero Dela*')
  lines.push('')

  lines.push('*Itens do pedido:*')
  const grouped = new Map<string, CartItem[]>()
  for (const ci of items) {
    const key = ci.item.categoryId
    grouped.set(key, [...(grouped.get(key) ?? []), ci])
  }
  for (const [categoryId, list] of grouped) {
    const category = getCategory(categoryId as CartItem['item']['categoryId'])
    lines.push(`_${category.name}_`)
    for (const ci of list) {
      const unit = getUnitPrice(ci, payment)
      lines.push(
        `• ${ci.quantity}x ${ci.item.number}. ${ci.item.name} (${ci.size}) - ${formatCurrency(unit * ci.quantity)}`,
      )
    }
  }

  const totalQty = items.reduce((s, ci) => s + ci.quantity, 0)
  lines.push('')
  lines.push(`*Total de marmitas:* ${totalQty}`)
  lines.push(`*Subtotal:* ${formatCurrency(getCartTotal(items, payment))}`)
  lines.push(`*Entrega:* ${DELIVERY_FEE === 0 ? 'Grátis' : formatCurrency(DELIVERY_FEE)}`)
  lines.push(`*Valor total:* ${formatCurrency(getCartTotal(items, payment) + DELIVERY_FEE)}`)
  lines.push(`*Pagamento (na entrega):* ${PAYMENT_LABELS[payment]}`)
  lines.push('')

  lines.push('*Dados do cliente:*')
  lines.push(`Nome: ${customer.name.trim()}`)
  lines.push(`Telefone: ${customer.phone}`)
  lines.push('')

  lines.push('*Endereço de entrega:*')
  lines.push(`CEP: ${customer.cep}`)
  const street = `${customer.street.trim()}, ${customer.number.trim()}`
  lines.push(
    customer.complement.trim() ? `${street} - ${customer.complement.trim()}` : street,
  )
  lines.push(`Bairro: ${customer.neighborhood.trim()}`)
  lines.push(`Cidade: ${customer.city.trim()}`)

  if (customer.notes.trim()) {
    lines.push('')
    lines.push(`*Observações:* ${customer.notes.trim()}`)
  }

  return lines.join('\n')
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
