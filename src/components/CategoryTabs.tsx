import {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react'
import { CATEGORIES } from '../data/menu'
import type { CategoryId } from '../types'
import { formatCurrency } from '../utils/format'
import { ChevronLeftIcon, ChevronRightIcon } from './Icons'

interface CategoryTabsProps {
  active: CategoryId
  onChange: (id: CategoryId) => void
}

/** Abaixo deste valor o seletor vira carrossel (celular e tablet). */
const CAROUSEL_MAX_WIDTH = 1023

function isCarousel() {
  return window.matchMedia(`(max-width: ${CAROUSEL_MAX_WIDTH}px)`).matches
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const scrollTimer = useRef<number | null>(null)
  const activeIndex = CATEGORIES.findIndex((c) => c.id === active)

  // Rola o card ativo para o centro quando a categoria muda (só no carrossel)
  useEffect(() => {
    if (!isCarousel()) return
    const el = trackRef.current?.querySelector<HTMLElement>(`#tab-${active}`)
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [active])

  /** Retorna a categoria cujo card está mais perto do centro da faixa. */
  const findNearest = useCallback((): CategoryId | null => {
    const track = trackRef.current
    if (!track) return null
    const center = track.scrollLeft + track.clientWidth / 2
    let nearest: { id: CategoryId; dist: number } | null = null
    for (const child of Array.from(track.children) as HTMLElement[]) {
      const id = child.dataset.category as CategoryId | undefined
      if (!id) continue
      const childCenter = child.offsetLeft + child.offsetWidth / 2
      const dist = Math.abs(childCenter - center)
      if (!nearest || dist < nearest.dist) nearest = { id, dist }
    }
    return nearest?.id ?? null
  }, [])

  /** Centraliza o card mais próximo, selecionando-o se for outro. */
  const snapToNearest = useCallback(() => {
    const id = findNearest()
    if (!id) return
    if (id !== active) {
      onChange(id)
      return
    }
    trackRef.current
      ?.querySelector<HTMLElement>(`#tab-${id}`)
      ?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [active, onChange, findNearest])

  // Ao terminar o deslize por toque, seleciona o card mais próximo do centro
  const handleScroll = useCallback(() => {
    if (!isCarousel() || drag.current.active) return
    if (scrollTimer.current) window.clearTimeout(scrollTimer.current)
    scrollTimer.current = window.setTimeout(() => {
      const id = findNearest()
      if (id && id !== active) onChange(id)
    }, 120)
  }, [active, onChange, findNearest])

  // ---- Arrastar com o mouse (o toque já rola nativamente) ----
  const drag = useRef({ active: false, moved: false, startX: 0, startScroll: 0 })

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !isCarousel()) return
    const track = trackRef.current
    if (!track) return
    drag.current = { active: true, moved: false, startX: e.clientX, startScroll: track.scrollLeft }
    track.classList.add('is-dragging')
    track.setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current
    if (!d.active) return
    const dx = e.clientX - d.startX
    if (Math.abs(dx) > 6) d.moved = true
    if (trackRef.current) trackRef.current.scrollLeft = d.startScroll - dx
  }

  function handlePointerEnd(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current
    if (!d.active) return
    d.active = false
    const track = trackRef.current
    if (track) {
      if (track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId)
      track.classList.remove('is-dragging')
    }
    if (d.moved) snapToNearest()
  }

  // Se houve arrasto, o clique que o navegador dispara em seguida é descartado
  function handleClickCapture(e: MouseEvent<HTMLDivElement>) {
    if (!drag.current.moved) return
    drag.current.moved = false
    e.preventDefault()
    e.stopPropagation()
  }

  useEffect(() => {
    return () => {
      if (scrollTimer.current) window.clearTimeout(scrollTimer.current)
    }
  }, [])

  function go(delta: number) {
    const next = CATEGORIES[activeIndex + delta]
    if (next) onChange(next.id)
  }

  // Setas do teclado navegam entre as abas (padrão WAI-ARIA para tablist)
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const delta = e.key === 'ArrowLeft' ? -1 : 1
    const next = CATEGORIES[(activeIndex + delta + CATEGORIES.length) % CATEGORIES.length]
    onChange(next.id)
    document.getElementById(`tab-${next.id}`)?.focus()
  }

  return (
    <nav className="tabs" aria-label="Categorias do cardápio">
      <div className="container tabs__inner">
        <button
          type="button"
          className="tabs__arrow tabs__arrow--prev"
          onClick={() => go(-1)}
          disabled={activeIndex === 0}
          aria-label="Cardápio anterior"
        >
          <ChevronLeftIcon />
        </button>

        <div
          className="tabs__track"
          role="tablist"
          ref={trackRef}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onClickCapture={handleClickCapture}
        >
          {CATEGORIES.map((category) => {
            const from = Math.min(
              category.prices['350g'].avista,
              category.prices['400g'].avista,
            )
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                id={`tab-${category.id}`}
                data-category={category.id}
                aria-selected={active === category.id}
                aria-controls={`panel-${category.id}`}
                tabIndex={active === category.id ? 0 : -1}
                className="tab"
                onClick={() => onChange(category.id)}
              >
                <span className="tab__name">{category.name}</span>
                <span className="tab__meta">
                  <span className="tab__tagline">{category.tagline}</span>
                  <span className="tab__price">a partir de {formatCurrency(from)}</span>
                </span>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          className="tabs__arrow tabs__arrow--next"
          onClick={() => go(1)}
          disabled={activeIndex === CATEGORIES.length - 1}
          aria-label="Próximo cardápio"
        >
          <ChevronRightIcon />
        </button>
      </div>

      <div className="tabs__dots" aria-hidden="true">
        {CATEGORIES.map((category) => (
          <span
            key={category.id}
            className={`tabs__dot${active === category.id ? ' tabs__dot--active' : ''}`}
          />
        ))}
      </div>
    </nav>
  )
}
