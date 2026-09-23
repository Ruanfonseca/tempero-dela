import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CartItem, MenuItem, Size } from '../types'

const STORAGE_KEY = 'tempero-dela:cart'

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as CartItem[]) : []
  } catch {
    return []
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((item: MenuItem, size: Size, quantity = 1) => {
    const key = `${item.id}:${size}`
    setItems((prev) => {
      const existing = prev.find((ci) => ci.key === key)
      if (existing) {
        return prev.map((ci) =>
          ci.key === key ? { ...ci, quantity: ci.quantity + quantity } : ci,
        )
      }
      return [...prev, { key, item, size, quantity }]
    })
  }, [])

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((ci) => ci.key !== key)
        : prev.map((ci) => (ci.key === key ? { ...ci, quantity } : ci)),
    )
  }, [])

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((ci) => ci.key !== key))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const totalQuantity = useMemo(
    () => items.reduce((sum, ci) => sum + ci.quantity, 0),
    [items],
  )

  return { items, addItem, updateQuantity, removeItem, clear, totalQuantity }
}

export type CartApi = ReturnType<typeof useCart>
