"use client";

import { create } from "zustand";

const PRODUCTS_DB_KEY = "quiet_custom_products_v1";

// Initial custom products added by admin if none exist
const DEFAULT_CUSTOM_PRODUCTS = [
  {
    id: "custom_p1",
    slug: "architectural-heavyweight-hoodie-v2",
    name: "ARCHITECTURAL HEAVYWEIGHT HOODIE V2",
    category: "HOODIES",
    gender: "UNISEX",
    price: 495,
    originalPrice: 620,
    rating: 4.9,
    reviewCount: 38,
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Washed Black", hex: "#1C1C1C" },
      { name: "Phantom Charcoal", hex: "#343434" },
    ],
    sizes: ["S", "M", "L", "XL"],
    tags: ["NEW ARRIVAL", "LIMITED DROP"],
    description:
      "Crafted from 520GSM French Terry cotton. Double-layered hood with seamless shoulder construction and heavy oxidized zipper hardware.",
    stock: 14,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "custom_p2",
    slug: "tailored-raw-wool-overcoat",
    name: "TAILORED RAW WOOL OVERCOAT",
    category: "OUTERWEAR",
    gender: "MEN",
    price: 890,
    originalPrice: 1100,
    rating: 5.0,
    reviewCount: 22,
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Raw Slate", hex: "#636971" },
      { name: "Washed Black", hex: "#1C1C1C" },
    ],
    sizes: ["M", "L", "XL"],
    tags: ["PIECE OF SEASON", "ARCHIVE"],
    description:
      "Double-breasted silhouette cut from virgin Australian raw wool. Features horn buttons and cupro lining.",
    stock: 8,
    featured: true,
    createdAt: new Date().toISOString(),
  },
];

function getStoredProducts() {
  if (typeof window === "undefined") return DEFAULT_CUSTOM_PRODUCTS;
  try {
    const raw = localStorage.getItem(PRODUCTS_DB_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_DB_KEY, JSON.stringify(DEFAULT_CUSTOM_PRODUCTS));
      return DEFAULT_CUSTOM_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading products DB:", err);
    return DEFAULT_CUSTOM_PRODUCTS;
  }
}

function saveProducts(products) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PRODUCTS_DB_KEY, JSON.stringify(products));
  } catch (err) {
    console.error("Error saving products DB:", err);
  }
}

export const useProductStore = create((set, get) => ({
  customProducts: [],
  isInitialized: false,

  initialize: () => {
    if (typeof window === "undefined") return;
    const products = getStoredProducts();
    set({ customProducts: products, isInitialized: true });
  },

  // Admin: Add new product
  addProduct: (productData) => {
    const current = getStoredProducts();
    const slug =
      productData.slug ||
      productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const newProd = {
      id: `custom_p_${Date.now()}`,
      slug,
      name: productData.name.trim(),
      category: productData.category || "TOPS",
      gender: productData.gender || "UNISEX",
      price: parseFloat(productData.price) || 100,
      originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
      rating: 5.0,
      reviewCount: 1,
      images: Array.isArray(productData.images) && productData.images.length > 0
        ? productData.images
        : ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop"],
      colors: productData.colors || [{ name: "Washed Black", hex: "#1C1C1C" }],
      sizes: productData.sizes || ["S", "M", "L", "XL"],
      tags: productData.tags || ["NEW ARRIVAL"],
      description: productData.description || "Bespoke piece engineered for the quiet aesthetic.",
      stock: parseInt(productData.stock) || 10,
      featured: !!productData.featured,
      createdAt: new Date().toISOString(),
    };

    const updated = [newProd, ...current];
    saveProducts(updated);
    set({ customProducts: updated });
    return { success: true, product: newProd };
  },

  // Admin: Update product
  updateProduct: (id, productData) => {
    const current = getStoredProducts();
    const updated = current.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          ...productData,
          price: productData.price ? parseFloat(productData.price) : p.price,
          stock: productData.stock !== undefined ? parseInt(productData.stock) : p.stock,
        };
      }
      return p;
    });

    saveProducts(updated);
    set({ customProducts: updated });
    return { success: true };
  },

  // Admin: Delete product
  deleteProduct: (id) => {
    const current = getStoredProducts();
    const updated = current.filter((p) => p.id !== id);
    saveProducts(updated);
    set({ customProducts: updated });
    return { success: true };
  },

  // Admin: Toggle featured
  toggleFeatured: (id) => {
    const current = getStoredProducts();
    const updated = current.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p));
    saveProducts(updated);
    set({ customProducts: updated });
  },
}));
