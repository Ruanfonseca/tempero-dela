import { CartIcon, LeafIcon } from './Icons'

interface HeaderProps {
  cartCount: number
  onOpenCart: () => void
}

export function Header({ cartCount, onOpenCart }: HeaderProps) {
  return (
    <header className="header">
      <div className="container header__inner">
        <a className="brand" href="#top" aria-label="Tempero Dela - início">
          <LeafIcon className="brand__leaf" />
          <span className="brand__text">
            <span className="brand__name">
              Tempero <span>Dela</span>
            </span>
            <span className="brand__sub">Marmitas congeladas</span>
          </span>
        </a>

        <button
          type="button"
          className="cart-button"
          onClick={onOpenCart}
          aria-label={`Abrir carrinho com ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}`}
        >
          <CartIcon />
          <span className="cart-button__label">Meu pedido</span>
          <span className="cart-button__badge" aria-hidden="true">
            {cartCount}
          </span>
        </button>
      </div>
    </header>
  )
}
