import { CartIcon } from './Icons'

interface HeaderProps {
  cartCount: number
  onOpenCart: () => void
}

export function Header({ cartCount, onOpenCart }: HeaderProps) {
  return (
    <header className="header">
      <div className="container header__inner">
        <a className="brand" href="#top" aria-label="Tempero Dela - início">
          <img
            className="brand__logo"
            src="/images/brand/logo-tempero-dela.png"
            alt=""
            width={906}
            height={330}
          />
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
