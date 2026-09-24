import type {
  Category,
  CategoryId,
  MenuItem,
  Size,
  SizePricing,
} from "../types";

export const WHATSAPP_NUMBER = "5521977187591";
export const WHATSAPP_DISPLAY = "+55 21 96923-2991";

/** Quantidade mínima de marmitas por pedido (qualquer combinação de sabores e tamanhos). */
export const MIN_ORDER_QUANTITY = 10;

/** Valor do frete. Entrega gratuita. */
export const DELIVERY_FEE = 0;

/** Preço especial dos itens 24 a 26 do Cardápio Comum (camarão e parmegiana). */
const COMUM_PREMIUM_PRICES: Record<Size, SizePricing> = {
  "350g": { avista: 26, credito: 27 },
  "400g": { avista: 27, credito: 28 },
};

export const CATEGORIES: Category[] = [
  {
    id: "comum",
    name: "Cardápio Comum",
    tagline: "Arroz, feijão e os clássicos do dia a dia",
    prices: {
      "350g": { avista: 22, credito: 23 },
      "400g": { avista: 23, credito: 24 },
    },
    note: "Itens 24 a 26 (camarão e parmegiana) têm preço especial: 350g R$ 26,00 e 400g R$ 27,00 à vista.",
  },
  {
    id: "fitness",
    name: "Cardápio Fitness",
    tagline: "Refeições equilibradas com arroz integral e proteínas magras",
    prices: {
      "350g": { avista: 22, credito: 23 },
      "400g": { avista: 23, credito: 25 },
    },
  },
  {
    id: "lowcarb",
    name: "Cardápio Low Carb",
    tagline: "Menos carboidratos, mais legumes e purês naturais",
    prices: {
      "350g": { avista: 23, credito: 24 },
      "400g": { avista: 24, credito: 25 },
    },
  },
];

type Row = [number, string] | [number, string, Record<Size, SizePricing>];

const comum: Row[] = [
  [1, "Carne moída, arroz, feijão e purê"],
  [2, "Carne moída, arroz, feijão e quiabo"],
  [3, "Cubinhos de carne, arroz, feijão e couve"],
  [4, "Cubinhos de carne, arroz, feijão branco e couve"],
  [5, "Frango refogado na cebola, arroz e feijão"],
  [6, "Panqueca com carne e arroz"],
  [7, "Panqueca com frango e arroz"],
  [8, "Strogonoff de carne e arroz"],
  [9, "Strogonoff de frango e arroz"],
  [10, "Escondidinho com carne e arroz"],
  [11, "Escondidinho com frango e arroz"],
  [12, "Filé de peixe ao molho de tomate, arroz e purê"],
  [13, "Filé de sobrecoxa, arroz, feijão e legumes"],
  [24, "Espaguete com camarão ao molho branco e mussarela", COMUM_PREMIUM_PRICES],
  [25, "Espaguete com camarão ao molho de tomate, mussarela e brócolis", COMUM_PREMIUM_PRICES],
  [26, "Filé à parmegiana com grão-de-bico", COMUM_PREMIUM_PRICES],
];

const fitness: Row[] = [
  [1, "Macarrão integral à bolonhesa"],
  [2, "Hamburguinho de carne, arroz integral e purê de inhame"],
  [3, "Strogonoff de frango e arroz integral"],
  [4, "Strogonoff de carne e arroz integral"],
  [5, "Arroz integral com brócolis e cubinhos de frango"],
  [6, "Cubinhos de frango, arroz integral e repolho refogado"],
  [9, "Peito de frango grelhado, abobrinha refogada e arroz integral"],
  [10, "Carne de panela, couve-flor, brócolis e arroz integral"],
  [11, "Carne moída, purê de abóbora e mix de legumes"],
  [12, "Frango com alho-poró e creme de leite, arroz integral e brócolis"],
  [13, "Cubinhos de frango, purê de batata-doce e brócolis"],
  [14, "Panqueca integral de frango, arroz e mix de legumes"],
  [15, "Panqueca integral de carne, arroz e berinjela"],
];

const lowcarb: Row[] = [
  [1, "Purê de inhame, cubinhos de carne, brócolis e couve-flor"],
  [2, "Purê de batata-baroa, carne moída e mix de legumes"],
  [3, "Hamburguinhos, purê de inhame e mix de legumes"],
  [4, "Cubinhos de frango, purê de batata-doce e brócolis"],
  [5, "Almôndegas, purê de abóbora e brócolis"],
  [6, "Panqueca de carne com farinha de aveia e mix de legumes"],
  [7, "Panqueca de espinafre com recheio de frango ao molho branco"],
  [8, "Carne de panela com purê de grão-de-bico e mix de legumes"],
  [9, "Frango com creme de leite e alho-poró e purê de batata-doce"],
  [10, "Cubinhos de carne, brócolis, couve-flor e mix de legumes"],
  [11, "Carne moída, purê de abóbora e couve"],
  [12, "Carne moída, purê de batata-baroa e couve"],
  [13, "Nhoque de batata-doce com frango"],
  [14, "Nhoque de batata-doce com carne"],
];

function build(categoryId: CategoryId, rows: Row[]): MenuItem[] {
  return rows.map(([number, name, prices]) => ({
    id: `${categoryId}-${number}`,
    number,
    categoryId,
    name,
    image: `/images/dishes/${categoryId}-${number}.jpg`,
    ...(prices ? { prices } : {}),
  }));
}

export const MENU_ITEMS: MenuItem[] = [
  ...build("comum", comum),
  ...build("fitness", fitness),
  ...build("lowcarb", lowcarb),
];

export function getCategory(id: CategoryId): Category {
  const category = CATEGORIES.find((c) => c.id === id);
  if (!category) throw new Error(`Categoria desconhecida: ${id}`);
  return category;
}

/** Tabela de preços efetiva de um item (preço próprio ou o da categoria). */
export function getItemPrices(item: MenuItem): Record<Size, SizePricing> {
  return item.prices ?? getCategory(item.categoryId).prices;
}
