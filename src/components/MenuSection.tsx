import { MENU_ITEMS } from '../data/menu'
import type { Category, MenuItem, PaymentMethod, Size } from '../types'
import { formatCurrency } from '../utils/format'
import { MenuItemCard } from './MenuItemCard'

interface MenuSectionProps {
  category: Category
  payment: PaymentMethod
  onAdd: (item: MenuItem, size: Size, quantity: number) => void
}

export function MenuSection({ category, payment, onAdd }: MenuSectionProps) {
  const items = MENU_ITEMS.filter((i) => i.categoryId === category.id)

  return (
    <section
      className="menu"
      data-theme={category.id}
      id={`panel-${category.id}`}
      role="tabpanel"
      aria-labelledby={`tab-${category.id}`}
    >
      <div className="container">
        <div className="menu__head">
          <div>
            <h2 className="menu__title">{category.name}</h2>
            <p className="menu__tagline">{category.tagline}</p>
          </div>
          <div className="menu__prices" aria-label="Preços por tamanho">
            {(['350g', '400g'] as Size[]).map((size) => (
              <span className="menu__price-chip" key={size}>
                {size} <small>a partir de</small>{' '}
                {formatCurrency(category.prices[size].avista)}
              </span>
            ))}
          </div>
        </div>

        <div className="menu__grid">
          {items.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              category={category}
              payment={payment}
              onAdd={onAdd}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
