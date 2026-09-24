import { useCallback, useEffect, useRef, useState } from 'react'
import { CartDrawer } from './components/CartDrawer'
import { CategoryTabs } from './components/CategoryTabs'
import { FloatingCart } from './components/FloatingCart'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { MenuSection } from './components/MenuSection'
import { Toast } from './components/Toast'
import { getCategory } from './data/menu'
import { useCart } from './hooks/useCart'
import type { CategoryId, MenuItem, PaymentMethod, Size } from './types'
import { getMinimumOrderStatus, pluralMarmitas } from './utils/order'
import { getCartTotal } from './utils/whatsapp'

const PAYMENT_KEY = 'tempero-dela:payment'

function loadPayment(): PaymentMethod {
  const saved = localStorage.getItem(PAYMENT_KEY)
  return saved === 'credito' ? 'credito' : 'avista'
}

export default function App() {
  const cart = useCart()
  const [activeCategory, setActiveCategory] = useState<CategoryId>('comum')
  const [payment, setPayment] = useState<PaymentMethod>(loadPayment)
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number | null>(null)

  useEffect(() => {
    localStorage.setItem(PAYMENT_KEY, payment)
  }, [payment])

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current)
    }
  }, [])

  const showToast = useCallback((message: string) => {
    setToast(message)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2800)
  }, [])

  const handleAdd = useCallback(
    (item: MenuItem, size: Size, quantity: number) => {
      cart.addItem(item, size, quantity)
      const status = getMinimumOrderStatus(cart.totalQuantity + quantity)
      const shortName = item.name.length > 28 ? `${item.name.slice(0, 28)}…` : item.name
      showToast(
        status.reached
          ? `${quantity}x ${shortName} (${size}) adicionado`
          : `${quantity}x ${shortName} adicionado. Faltam ${pluralMarmitas(status.missing)} para o mínimo.`,
      )
    },
    [cart, showToast],
  )

  const openCart = useCallback(() => setCartOpen(true), [])
  const closeCart = useCallback(() => setCartOpen(false), [])

  const category = getCategory(activeCategory)

  return (
    <>
      <Header cartCount={cart.totalQuantity} onOpenCart={openCart} />

      <main>
        <Hero activeCategory={activeCategory} />
        <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
        <MenuSection category={category} payment={payment} onAdd={handleAdd} />
      </main>

      <Footer />

      <FloatingCart
        count={cart.totalQuantity}
        total={getCartTotal(cart.items, payment)}
        onOpen={openCart}
      />

      <CartDrawer
        open={cartOpen}
        cart={cart}
        payment={payment}
        onPaymentChange={setPayment}
        onClose={closeCart}
      />

      <Toast message={toast} />
    </>
  )
}
