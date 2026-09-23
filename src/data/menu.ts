import type { Category, CategoryId, MenuItem } from '../types'

export const WHATSAPP_NUMBER = '5521969232991'
export const WHATSAPP_DISPLAY = '+55 21 96923-2991'

/** Quantidade mínima de marmitas por pedido (qualquer combinação de sabores e tamanhos). */
export const MIN_ORDER_QUANTITY = 10

/** Valor do frete. Entrega gratuita. */
export const DELIVERY_FEE = 0

export const CATEGORIES: Category[] = [
  {
    id: 'fitness',
    name: 'Cardápio Fitness',
    tagline: 'Refeições equilibradas com arroz integral e proteínas magras',
    prices: {
      '350g': { avista: 22, credito: 23 },
      '400g': { avista: 23, credito: 25 },
    },
  },
  {
    id: 'lowcarb',
    name: 'Cardápio Low Carb',
    tagline: 'Menos carboidratos, mais legumes e purês naturais',
    prices: {
      '350g': { avista: 23, credito: 24 },
      '400g': { avista: 24, credito: 25 },
    },
  },
]

const fitness: Array<[number, string]> = [
  [1, 'Macarrão integral à bolonhesa'],
  [2, 'Hamburguinho de carne, arroz integral e purê de inhame'],
  [3, 'Strogonoff de frango e arroz integral'],
  [4, 'Strogonoff de carne e arroz integral'],
  [5, 'Arroz integral com brócolis e cubinhos de frango'],
  [6, 'Cubinhos de frango, arroz integral e repolho refogado'],
  [9, 'Peito de frango grelhado, abobrinha refogada e arroz integral'],
  [10, 'Carne de panela, couve-flor, brócolis e arroz integral'],
  [11, 'Carne moída, purê de abóbora e mix de legumes'],
  [12, 'Frango com alho-poró e creme de leite, arroz integral e brócolis'],
  [13, 'Cubinhos de frango, purê de batata-doce e brócolis'],
  [14, 'Panqueca integral de frango, arroz e mix de legumes'],
  [15, 'Panqueca integral de carne, arroz e berinjela'],
]

const lowcarb: Array<[number, string]> = [
  [1, 'Purê de inhame, cubinhos de carne, brócolis e couve-flor'],
  [2, 'Purê de batata-baroa, carne moída e mix de legumes'],
  [3, 'Hamburguinhos, purê de inhame e mix de legumes'],
  [4, 'Cubinhos de frango, purê de batata-doce e brócolis'],
  [5, 'Almôndegas, purê de abóbora e brócolis'],
  [6, 'Panqueca de carne com farinha de aveia e mix de legumes'],
  [7, 'Panqueca de espinafre com recheio de frango ao molho branco'],
  [8, 'Carne de panela com purê de grão-de-bico e mix de legumes'],
  [9, 'Frango com creme de leite e alho-poró e purê de batata-doce'],
  [10, 'Cubinhos de carne, brócolis, couve-flor e mix de legumes'],
  [11, 'Carne moída, purê de abóbora e couve'],
  [12, 'Carne moída, purê de batata-baroa e couve'],
  [13, 'Nhoque de batata-doce com frango'],
  [14, 'Nhoque de batata-doce com carne'],
]

function build(categoryId: CategoryId, rows: Array<[number, string]>): MenuItem[] {
  return rows.map(([number, name]) => ({
    id: `${categoryId}-${number}`,
    number,
    categoryId,
    name,
    image: `/images/dishes/${categoryId}-${number}.jpg`,
  }))
}

export const MENU_ITEMS: MenuItem[] = [
  ...build('fitness', fitness),
  ...build('lowcarb', lowcarb),
]

export function getCategory(id: CategoryId): Category {
  const category = CATEGORIES.find((c) => c.id === id)
  if (!category) throw new Error(`Categoria desconhecida: ${id}`)
  return category
}
