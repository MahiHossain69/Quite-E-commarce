"use client";

import { create } from "zustand";

const WISHLIST_PREFIX = "quiet_wishlist_v1_";

// Seed wishlist for initial demo user
const SEED_WISHLIST = [
  {
    id: "prod-02",
    name: "STRUCTURAL WOOL OVERCOAT",
    price: 890,
    category: "TOPS",
    gender: "UNISEX",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop",
    slug: "structural-wool-overcoat",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Charcoal", hex: "#343434" }],
  },
  {
    id: "prod-05",
    name: "ASYMMETRICAL DRAPED SILK DRESS",
    price: 640,
    category: "DRESSES",
    gender: "WOMEN",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop",
    slug: "asymmetrical-draped-silk-dress",
    sizes: ["XS", "S", "M"],
    colors: [{ name: "Bone White", hex: "#F3F1EC" }],
  },
  {
    id: "prod-07",
    name: "SCULPTED LEATHER CHELSEA BOOTS",
    price: 540,
    category: "FOOTWEAR",
    gender: "UNISEX",
    image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800&auto=format&fit=crop",
    slug: "sculpted-leather-chelsea-boots",
    sizes: ["40", "41", "42", "43", "44"],
    colors: [{ name: "Washed Black", hex: "#1C1C1C" }],
  },
];

function getStorageKey(userId) {
  return `${WISHLIST_PREFIX}${userId || "guest"}`;
}

function loadWishlistFromStorage(userId) {
  if (typeof window === "undefined") return [];
  try {
    const key = getStorageKey(userId);
    const raw = localStorage.getItem(key);
    if (!raw) {
      if (userId === "usr_01_maya") {
        localStorage.setItem(key, JSON.stringify(SEED_WISHLIST));
        return SEED_WISHLIST;
      }
      return [];
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load wishlist:", e);
    return [];
  }
}

function saveWishlistToStorage(userId, items) {
  if (typeof window === "undefined") return;
  try {
    const key = getStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save wishlist:", e);
  }
}

export const useWishlistStore = create((set, get) => ({
  items: [],
  currentUserId: null,
  isInitialized: false,

  // Initialize or sync wishlist with the logged-in user
  syncUser: (userId) => {
    const targetUserId = userId || null;
    const loadedItems = loadWishlistFromStorage(targetUserId);
    set({
      items: loadedItems,
      currentUserId: targetUserId,
      isInitialized: true,
    });
  },

  // Toggle item in wishlist
  toggleWishlist: (product) => {
    if (!product || !product.id) return;
    const { items, currentUserId } = get();
    const exists = items.some((i) => i.id === product.id);

    let updated;
    if (exists) {
      updated = items.filter((i) => i.id !== product.id);
    } else {
      // Normalize product structure to ensure real image, name, price, slug, etc.
      const normalized = {
        id: product.id,
        name: product.name || product.title || "QUIET PIECE",
        price: Number(product.price) || 0,
        category: product.category || "COLLECTION",
        gender: product.gender || "UNISEX",
        image: product.image || product.thumbnail || "/images/hero-fashion.jpg",
        slug: product.slug || product.id,
        sizes: product.sizes || ["S", "M", "L"],
        colors: product.colors || [{ name: "Black", hex: "#111111" }],
      };
      updated = [normalized, ...items];
    }

    saveWishlistToStorage(currentUserId, updated);
    set({ items: updated });
    return !exists; // returns true if added, false if removed
  },

  // Explicit Add
  addToWishlist: (product) => {
    if (!product || !product.id) return;
    const { items, currentUserId } = get();
    if (items.some((i) => i.id === product.id)) return;

    const normalized = {
      id: product.id,
      name: product.name || product.title || "QUIET PIECE",
      price: Number(product.price) || 0,
      category: product.category || "COLLECTION",
      gender: product.gender || "UNISEX",
      image: product.image || product.thumbnail || "/images/hero-fashion.jpg",
      slug: product.slug || product.id,
      sizes: product.sizes || ["S", "M", "L"],
      colors: product.colors || [{ name: "Black", hex: "#111111" }],
    };
    const updated = [normalized, ...items];
    saveWishlistToStorage(currentUserId, updated);
    set({ items: updated });
  },

  // Explicit Remove
  removeFromWishlist: (productId) => {
    const { items, currentUserId } = get();
    const updated = items.filter((i) => i.id !== productId);
    saveWishlistToStorage(currentUserId, updated);
    set({ items: updated });
  },

  // Check if wishlisted
  isWishlisted: (productId) => {
    return get().items.some((i) => i.id === productId);
  },

  // Clear
  clearWishlist: () => {
    const { currentUserId } = get();
    saveWishlistToStorage(currentUserId, []);
    set({ items: [] });
  },
}));
