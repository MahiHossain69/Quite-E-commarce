import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  isOpen: false,
  items: [
    {
      id: "prod-01",
      name: "ARCHITECTURAL OVERSIZED ZIP HOODIE",
      price: 480,
      size: "L",
      quantity: 1,
      image: "/images/hero-fashion.jpg",
      sku: "QT-2026-001"
    }
  ],

  // Actions
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  addItem: (item) => {
    const items = get().items;
    const existingIndex = items.findIndex(
      (i) => i.id === item.id && i.size === item.size
    );

    if (existingIndex > -1) {
      const newItems = [...items];
      newItems[existingIndex].quantity += item.quantity || 1;
      set({ items: newItems, isOpen: true });
    } else {
      set({
        items: [...items, { ...item, quantity: item.quantity || 1 }],
        isOpen: true
      });
    }
  },

  removeItem: (id, size) => {
    set((state) => ({
      items: state.items.filter((i) => !(i.id === id && i.size === size)),
    }));
  },

  updateQuantity: (id, size, delta) => {
    set((state) => {
      const newItems = state.items
        .map((i) => {
          if (i.id === id && i.size === size) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean);
      return { items: newItems };
    });
  },

  clearCart: () => set({ items: [] }),

  getTotalCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },
}));
