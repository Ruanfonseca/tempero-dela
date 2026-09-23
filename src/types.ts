export type CategoryId = 'fitness' | 'lowcarb'

export type Size = '350g' | '400g'

export type PaymentMethod = 'avista' | 'credito'

export interface SizePricing {
  avista: number
  credito: number
}

export interface Category {
  id: CategoryId
  name: string
  tagline: string
  prices: Record<Size, SizePricing>
}

export interface MenuItem {
  id: string
  number: number
  categoryId: CategoryId
  name: string
  /** Caminho da foto ilustrativa (relativo à pasta public) */
  image: string
}

export interface CartItem {
  key: string
  item: MenuItem
  size: Size
  quantity: number
}

export interface CustomerData {
  name: string
  phone: string
  cep: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  notes: string
}
