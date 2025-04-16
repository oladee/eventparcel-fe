import { toast } from 'react-toastify'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CartItem = {
  _id: string
  packageTitle: string
  packagePrice: number
  quantity: number
  packagePriceCurrency: string
}

type CartState = {
  currency: () => string | null
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  updateQuantity: (id: string, quantity: number) => void
  increaseQuantity: (id: string) => void
  decreaseQuantity: (id: string) => void
  total: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item) => {
        if (item.quantity <= 0) return // Ignore if 0

        const currentItems = get().items

        if (currentItems.length > 0) {
          const existingCurrency = currentItems[0].packagePriceCurrency
          const newItemCurrency = item.packagePriceCurrency

          if (existingCurrency !== newItemCurrency) {
            toast.error(
              `Cannot mix currencies in cart. You're trying to add ${newItemCurrency} to a ${existingCurrency} cart.`
            )
            return
          }
        }

        const existing = currentItems.find((i) => i._id === item._id)

        if (existing) {
          const newQuantity = existing.quantity + item.quantity
          if (newQuantity <= 0) {
            set({ items: currentItems.filter((i) => i._id !== item._id) })
          } else {
            set({
              items: currentItems.map((i) =>
                i._id === item._id ? { ...i, quantity: newQuantity } : i
              ),
            })
          }
        } else {
          set({ items: [...currentItems, item] })
        }
      },

      removeFromCart: (id) => {
        set({ items: get().items.filter((item) => item._id !== id) })
      },

      clearCart: () => {
        set({ items: [] })
      },

      updateQuantity: (id, quantity) => {
        const currentItems = get().items
        if (quantity <= 0) {
          set({ items: currentItems.filter((item) => item._id !== id) })
          return
        }

        set({
          items: currentItems.map((item) =>
            item._id === id ? { ...item, quantity } : item
          ),
        })
      },

      increaseQuantity: (id) => {
        const item = get().items.find((i) => i._id === id)
        if (item) {
          get().updateQuantity(id, item.quantity + 1)
        }
      },

      decreaseQuantity: (id) => {
        const item = get().items.find((i) => i._id === id)
        if (item) {
          const newQty = item.quantity - 1
          get().updateQuantity(id, newQty)
        }
      },

      currency: () => {
        const items = get().items
        return items.length > 0 ? items[0].packagePriceCurrency : null
      },

      total: () =>
        get().items.reduce(
          (acc, item) => acc + item.packagePrice * item.quantity,
          0
        ),
    }),
    {
      name: 'cart-storage', // stored in localStorage
    }
  )
)
