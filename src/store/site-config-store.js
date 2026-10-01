"use client";

import { create } from "zustand";

const SITE_CONFIG_KEY = "quiet_site_custom_config_v1";

export const DEFAULT_SITE_CONFIG = {
  announcement: {
    enabled: true,
    text: "COMPLIMENTARY WORLDWIDE COURIER DELIVERY ON ORDERS OVER $400 — DROP 07 LIVE",
    linkText: "EXPLORE ARCHIVE",
    linkUrl: "/shop",
  },
  hero: {
    badge: "COLLECTION FW26 — SILENT LUXURY",
    headlineLine1: "ARCHITECTURAL",
    headlineLine2: "PRECISION",
    subheading: "ENGINEERED SILHOUETTES & MONOCHROME MINIMALISM CUT FROM VIRGIN JAPANESE AND PORTUGUESE TEXTILES.",
    primaryButtonText: "EXPLORE NEW ARRIVALS",
    primaryButtonUrl: "/shop",
    secondaryButtonText: "VIEW DROP 07 ARCHIVE",
    secondaryButtonUrl: "/QuiteadminPan",
    heroImage: "/images/hero-fashion.jpg",
    heroImage1: "/images/hero-fashion.jpg",
    heroImage2: "/images/hero-fashion-2.jpg",
    heroImage3: "/images/hero-fashion-3.jpg",
  },
  newArrivals: {
    sectionTitle: "SELECTED PIECES",
    sectionSubtitle: "AUTUMN / WINTER 2026 ARCHIVE",
    bannerImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
    featuredPieceId: "jeans-01",
    featuredPieceImage: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop",
  },
  spotlight: {
    tagline: "PIECE OF THE SEASON",
    productName: "LATCH-FRONT WIDE JEANS",
    price: 92,
    originalPrice: 140,
    description: "Five silver D-ring latches with sun-faded tonal variation from deep black to charcoal. Relaxed architectural silhouette engineered to drape effortlessly.",
    primaryImage: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop",
    detailImage1: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=800&auto=format&fit=crop",
    detailImage2: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
  },
  nextDrop: {
    dropNumber: "DROP 08",
    dropName: "RAW MONOLITH ARCHIVE",
    tagline: "WINTER CAPSULE · 12 BESPOKE SILHOUETTES",
    countdownDate: "2026-11-15T18:00:00.000Z",
    teaserImage1: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop",
    teaserImage2: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop",
    stealthMode: false,
  },
};

function getStoredSiteConfig() {
  if (typeof window === "undefined") return DEFAULT_SITE_CONFIG;
  try {
    const raw = localStorage.getItem(SITE_CONFIG_KEY);
    if (!raw) {
      localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(DEFAULT_SITE_CONFIG));
      return DEFAULT_SITE_CONFIG;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SITE_CONFIG, ...parsed };
  } catch (e) {
    console.error("Error reading site config:", e);
    return DEFAULT_SITE_CONFIG;
  }
}

function saveStoredSiteConfig(config) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error("Error saving site config:", e);
  }
}

export const useSiteConfigStore = create((set, get) => ({
  config: DEFAULT_SITE_CONFIG,
  isInitialized: false,

  initialize: () => {
    if (typeof window === "undefined") return;
    const cfg = getStoredSiteConfig();
    set({ config: cfg, isInitialized: true });
  },

  updateSection: (sectionKey, newSectionData) => {
    const state = get();
    const updated = {
      ...state.config,
      [sectionKey]: {
        ...state.config[sectionKey],
        ...newSectionData,
      },
    };
    saveStoredSiteConfig(updated);
    set({ config: updated });
    return { success: true };
  },

  resetSection: (sectionKey) => {
    const state = get();
    const updated = {
      ...state.config,
      [sectionKey]: DEFAULT_SITE_CONFIG[sectionKey],
    };
    saveStoredSiteConfig(updated);
    set({ config: updated });
    return { success: true };
  },

  resetAllToDefault: () => {
    saveStoredSiteConfig(DEFAULT_SITE_CONFIG);
    set({ config: DEFAULT_SITE_CONFIG });
    return { success: true };
  },
}));
