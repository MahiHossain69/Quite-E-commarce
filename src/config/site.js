/**
 * Luxury Fashion Brand Site Configuration
 * All hero image paths, headlines, editorial copy, and navigation items are centralized here.
 * You can replace any text or image simply by changing values in this file.
 */

export const siteConfig = {
  name: "QUIET",
  title: "QUIET — Minimal Luxury Editorial",
  description:
    "Built for those who choose form over noise. High-end minimal luxury fashion campaign and lookbook.",

  // Navigation Links
  navLinks: [
    { label: "SHOP", href: "/shop" },
    { label: "CATEGORIES", href: "/#categories" },
    { label: "NEW ARRIVALS", href: "/#new-arrivals" },
    { label: "COMMUNITY", href: "/#community" },
    { label: "PHILOSOPHY", href: "/#philosophy" },
    { label: "CONTACT", href: "/contact" },
    { label: "LOGIN", href: "/login" },
  ],

  // Community Section Configuration
  community: {
    tag: "COMMUNITY",
    seasonTag: "FW25 — SILENT COLLECTION",
    image: "/images/community-model.jpg",
    quotes: [
      {
        id: "quote-1",
        text: "I DON'T DRESS FOR ANYONE. I DRESS LIKE I ALREADY KNOW WHO I AM",
        author: "— WORN QUIET",
        position: "top-left",
      },
      {
        id: "quote-2",
        text: "NOTHING HERE TRIES TO PROVE ITSELF. THAT IS EXACTLY THE POINT",
        author: "— WORN QUIET",
        position: "top-right",
      },
      {
        id: "quote-3",
        text: "THIS IS THE ONE PIECE THAT NEEDS NO STORY ATTACHED TO IT",
        author: "— WORN QUIET",
        position: "bottom-right",
      },
      {
        id: "quote-4",
        text: "NOTHING HERE SCREAMS FOR ATTENTION. THAT'S WHY I CHOSE IT",
        author: "— WORN QUIET",
        position: "bottom-left",
      },
    ],
  },

  // Single Product Spotlight Configuration
  spotlight: {
    eyebrow: "SINGLE PRODUCT SPOTLIGHT",
    title: "THE PIECE OF THE SEASON",
    taglineTop: "FIVE LATCHES. ONE SILHOUETTE.",
    taglineBottom: "NOTHING ELSE NEEDED SAYING.",
    hardware: {
      title: "HARDWARE",
      description: "FIVE SILVER D-RING LATCHES,\nBRUSHED FINISH",
      image: "/images/spotlight-hardware.jpg",
    },
    silhouette: {
      title: "SILHOUETTE",
      description: "WIDE-LEG, CUT TO MOVE\nWITHOUT LOSING STRUCTURE.",
      image: "/images/products/latch-front-jeans.jpg",
    },
    wash: {
      title: "WASH",
      description: "SUN-FADED TONAL VARIATION,\nDEEP BLACK TO CHARCOAL",
      image: "/images/spotlight-washh.jpg",
    },
  },

  // Next Drop Notification Configuration
  nextDrop: {
    headlineLine1: "BE FIRST TO KNOW",
    headlineLine2: "ABOUT THE NEXT DROP",
    badge: "STAY QUIET",
    subtitleLine1: "NO SPAM. JUST NEW ARRIVALS,",
    subtitleLine2: "BEFORE ANYONE ELSE SEES THEM",
    femaleModelImage: "/images/drop-look-female.jpg",
    maleModelImage: "/images/drop-look-male.jpg",
  },

  // Footer Configuration
  footer: {
    brand: "QUIET",
    tagline: "GO TO STORE",
    shopLinks: [
      { label: "HOODIES", href: "#hoodies" },
      { label: "PANTS", href: "#pants" },
      { label: "T-SHIRTS", href: "#t-shirts" },
      { label: "ACCESSORIES", href: "#accessories" },
    ],
    detailLinks: [
      { label: "ABOUT", href: "#philosophy" },
      { label: "CRAFT", href: "#philosophy" },
      { label: "CONTACT", href: "#next-drop" },
      { label: "DELIVERY", href: "#delivery" },
    ],
    followLinks: [
      { label: "INSTAGRAM", href: "https://instagram.com" },
      { label: "TWITTER (X)", href: "https://x.com" },
    ],
    copyright: "© 2026 QUIET. ALL RIGHTS RESERVED.",
    credit: "CREATED WITH PASSION BY MAHI HOSSAIN",
    privacyHref: "/privacy",
    termsHref: "/terms",
  },

  // Categories Section Configuration
  categories: [
    {
      id: "hoodies",
      name: "HOODIES",
      tagline: "HOODIES — BUILT FOR EVERYDAY,\nOVERSIZED BY DESIGN",
      image: "/images/categories/hoodies.jpg",
      href: "/shop?category=HOODIES",
      count: "12 PIECES",
    },
    {
      id: "pants",
      name: "PANTS",
      tagline: "FORM EVERY PIECE,\nSLIGHTLY DIFFERENT.",
      image: "/images/categories/pants.jpg",
      href: "/shop?category=BOTTOMS",
      count: "8 PIECES",
    },
    {
      id: "accessories",
      name: "ACCESSORIES",
      tagline: "TACTICAL DETAILS,\nENGINEERED DAILY.",
      image: "/images/categories/accessories.jpg",
      href: "/shop?category=ACCESSORIES",
      count: "15 PIECES",
    },
    {
      id: "t-shirts",
      name: "T-SHIRTS",
      tagline: "320GSM HEAVYWEIGHT,\nMINIMALIST SILHOUETTE.",
      image: "/images/categories/t-shirts.jpg",
      href: "/shop?category=TOPS",
      count: "10 PIECES",
    },
  ],

  // Hero Section Configuration
  hero: {
    // Primary hero image path - easily replaceable with any image in /public/images/
    image: "/images/hero-fashion.jpg",
    alt: "QUIET Luxury Campaign Lookbook Model",

    // Large display headline overlapping model
    headline: "SPEAK QUIET",

    // Top-left editorial block
    eyebrow: "QUIET IS BUILT FOR THOSE WHO",
    description:
      "CHOOSE FORM OVER NOISE — AND LET THE WORK SPEAK WHERE WORDS DON'T HAVE TO",

    // Call to Action
    ctaText: "SHOP THE DROP",
    ctaLink: "#shop",

    // Top-right / side editorial phrase
    secondaryTextTop: "FASHION WITHOUT",
    secondaryTextBottom: "THE SHOUT",

    // Alternative campaign images available for switching
    alternateImages: [
      {
        id: "campaign-1",
        path: "/images/hero-fashion.jpg",
        label: "Studio Cut 01",
      },
      {
        id: "campaign-2",
        path: "/images/hero-fashion-2.jpg",
        label: "Portrait Cut 02",
      },
      {
        id: "campaign-3",
        path: "/images/hero-fashion-3.jpg",
        label: "Full Silhouette 03",
      },
    ],
  },

  // Selected Pieces / New Arrivals collection matching the editorial design
  selectedPieces: [
    {
      id: "jeans-01",
      name: "LATCH-FRONT WIDE JEANS",
      price: 92,
      currency: "$",
      image: "/images/products/latch-front-jeans.jpg",
      isFeatured: true,
      category: "BOTTOMS",
      description: "Washed vintage black wide-leg denim trousers with metal latch and buckle closures down the front fly.",
      sizes: ["28", "30", "32", "34", "36"],
    },
    {
      id: "tee-01",
      name: "OVERSIZED TEE",
      price: 45,
      currency: "$",
      image: "/images/products/oversized-tee.jpg",
      category: "TOPS",
      description: "Heavyweight 320gsm compact cotton jersey oversized boxy crewneck t-shirt with drop shoulders.",
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: "hoodie-01",
      name: "CROPPED ZIP HOODIE",
      price: 88,
      currency: "$",
      image: "/images/products/cropped-zip-hoodie.jpg",
      category: "OUTERWEAR",
      description: "Sun-faded charcoal vintage wash cropped silhouette zip hoodie with elongated drawstrings.",
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: "cargo-01",
      name: "WIDE CARGO PANTS",
      price: 78,
      currency: "$",
      image: "/images/products/wide-cargo-pants.jpg",
      category: "BOTTOMS",
      description: "Curved balloon parachute cargo trousers with integrated utility webbing belt and red pull tag.",
      sizes: ["28", "30", "32", "34"],
    },
    {
      id: "hoodie-02",
      name: "OVERSIZED HOODIE",
      price: 65,
      currency: "$",
      image: "/images/products/oversized-hoodie.jpg",
      category: "OUTERWEAR",
      description: "Clean pitch black oversized zip-up hoodie crafted from premium french terry with silver hardware.",
      sizes: ["S", "M", "L", "XL"],
    },
  ],

  // Future e-commerce showcase items for preview & cart
  featuredItems: [
    {
      id: "prod-01",
      name: "ARCHITECTURAL OVERSIZED ZIP HOODIE",
      category: "OUTERWEAR",
      price: 480,
      currency: "$",
      image: "/images/hero-fashion.jpg",
      sizes: ["S", "M", "L", "XL"],
      description:
        "Heavyweight 600gsm custom milled cotton fleece with tactical hardware, asymmetric double zip and tailored drop shoulders.",
    },
    {
      id: "prod-02",
      name: "AERO CYBER SUNGLASSES",
      category: "ACCESSORIES",
      price: 290,
      currency: "$",
      image: "/images/hero-fashion-2.jpg",
      sizes: ["ONE SIZE"],
      description:
        "Handcrafted Italian acetate with polarized Zeiss lenses, aerodynamic silhouette and laser-etched quiet branding.",
    },
    {
      id: "prod-03",
      name: "TACTICAL CARGO TROUSERS",
      category: "BOTTOMS",
      price: 390,
      currency: "$",
      image: "/images/hero-fashion-3.jpg",
      sizes: ["28", "30", "32", "34"],
      description:
        "Water-repellent structured technical twill with magnetic closure utility pockets and adjustable ankle cinch.",
    },
  ],
};
