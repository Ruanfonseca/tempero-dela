import { CATEGORIES } from '../data/menu'
import type { CategoryId } from '../types'

interface CategoryTabsProps {
  active: CategoryId
  onChange: (id: CategoryId) => void
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <nav className="tabs" aria-label="Categorias do cardápio">
      <div className="container tabs__inner" role="tablist">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            role="tab"
            id={`tab-${category.id}`}
            aria-selected={active === category.id}
            aria-controls={`panel-${category.id}`}
            className="tab"
            onClick={() => onChange(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </nav>
  )
}
