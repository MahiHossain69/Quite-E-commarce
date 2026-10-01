/**
 * DummyJSON Fashion API Integration
 * Fetches real, matched product data (images, title, price, description all belong
 * to the same actual product) from DummyJSON's fashion categories.
 *
 * API: https://dummyjson.com/docs/products
 * No API key required. Free & open.
 */

const DUMMYJSON_BASE = "https://dummyjson.com";

// Fashion-relevant categories mapped to our store's category system
const FASHION_CATEGORY_MAP = [
  { dj: "tops",             our: "TOPS",        gender: "UNISEX" },
  { dj: "mens-shirts",      our: "TOPS",        gender: "MEN"    },
  { dj: "womens-dresses",   our: "DRESSES",     gender: "WOMEN"  },
  { dj: "mens-shoes",       our: "FOOTWEAR",    gender: "MEN"    },
  { dj: "womens-shoes",     our: "FOOTWEAR",    gender: "WOMEN"  },
  { dj: "mens-watches",     our: "ACCESSORIES", gender: "MEN"    },
  { dj: "womens-watches",   our: "ACCESSORIES", gender: "WOMEN"  },
  { dj: "womens-bags",      our: "ACCESSORIES", gender: "WOMEN"  },
  { dj: "womens-jewellery", our: "ACCESSORIES", gender: "WOMEN"  },
  { dj: "sunglasses",       our: "ACCESSORIES", gender: "UNISEX" },
];

// Standard clothing sizes for fashion
const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const SHOE_SIZES     = ["39", "40", "41", "42", "43", "44", "45"];
const ONE_SIZE       = ["ONE SIZE"];

// Deterministic color palette — assigned by product id for consistency
const COLOR_PALETTE = [
  { name: "Washed Black",     hex: "#1C1C1C" },
  { name: "Phantom Charcoal", hex: "#343434" },
  { name: "Bone White",       hex: "#F3F1EC" },
  { name: "Raw Slate",        hex: "#636971" },
  { name: "Olive Drab",       hex: "#3C4035" },
  { name: "Raw Indigo",       hex: "#1E2638" },
  { name: "Earth Brown",      hex: "#382923" },
];

// Tags based on product index (deterministic, not random)
const PRODUCT_TAGS = [
  "NEW ARRIVAL", "BESTSELLER", "LIMITED DROP", "PIECE OF SEASON",
  "ESSENTIAL", "ARCHIVE", "HANDCRAFTED",
];

/**
 * Slugify a product title into a URL-safe slug.
 */
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Get sizes based on category.
 */
function getSizesForCategory(ourCategory, djCategory) {
  if (djCategory.includes("shoes")) return SHOE_SIZES;
  if (ourCategory === "ACCESSORIES")  return ONE_SIZE;
  return CLOTHING_SIZES;
}

/**
 * Get a deterministic subset of colors for a product (1–3 colors).
 */
function getColorsForProduct(id) {
  const count = (id % 3) + 1; // 1, 2, or 3 colors
  return Array.from({ length: count }, (_, i) =>
    COLOR_PALETTE[(id + i) % COLOR_PALETTE.length]
  );
}

/**
 * Transform a single DummyJSON product into our app's product schema.
 */
export function transformProduct(djProduct, categoryInfo, index = 0) {
  const { dj: djCategory, our: ourCategory, gender } = categoryInfo;
  const slug      = slugify(djProduct.title);
  const sizes     = getSizesForCategory(ourCategory, djCategory);
  const colors    = getColorsForProduct(djProduct.id);
  const tag       = PRODUCT_TAGS[djProduct.id % PRODUCT_TAGS.length];
  const isNew     = djProduct.id % 3 === 0;
  const isFeatured = djProduct.rating >= 4.0;

  // Use the full images array for gallery; fall back to thumbnail duplication
  const gallery = djProduct.images?.length >= 2
    ? djProduct.images.slice(0, 3)
    : [djProduct.thumbnail, djProduct.thumbnail];

  return {
    id:             `dj-${djProduct.id}`,
    slug,
    name:           djProduct.title.toUpperCase(),
    price:          parseFloat(djProduct.price.toFixed(2)),
    currency:       "$",
    category:       ourCategory,
    gender,
    image:          djProduct.thumbnail,
    secondaryImage: gallery[1] || djProduct.thumbnail,
    gallery,
    sizes,
    colors,
    tag,
    isNew,
    isFeatured,
    rating:         parseFloat(djProduct.rating.toFixed(1)),
    reviewsCount:   djProduct.reviews?.length ?? Math.floor(10 + (djProduct.id % 80)),
    description:    djProduct.description,
    brand:          djProduct.brand || "QUIET",
    stock:          djProduct.stock ?? 50,
    sku:            djProduct.sku || `QT-${djProduct.id}`,
    details: [
      `Brand: ${djProduct.brand || "QUIET"}`,
      djProduct.shippingInformation || "Ships in 2-5 business days",
      djProduct.returnPolicy || "30 days return policy",
      djProduct.warrantyInformation || "Standard warranty",
    ],
    detailsAndFit: [
      djProduct.availabilityStatus
        ? djProduct.availabilityStatus.toUpperCase()
        : "IN STOCK",
      `MINIMUM ORDER QUANTITY: ${djProduct.minimumOrderQuantity ?? 1}`,
      `SKU: ${djProduct.sku || `QT-${djProduct.id}`}`,
      "SHIPS WITH FULL DOCUMENTATION",
    ],
    // Source attribution
    _source: "dummyjson",
    _djId:   djProduct.id,
    _djCategory: djCategory,
  };
}

/**
 * Fetch all fashion products from DummyJSON.
 * Fetches from each fashion category and merges results.
 *
 * @param {object} options
 * @param {number} [options.limitPerCategory=6] - Max products per category
 * @returns {Promise<Array>} Transformed products
 */
export async function fetchFashionProducts({ limitPerCategory = 6 } = {}) {
  const fetchCategory = async (catInfo) => {
    const url = `${DUMMYJSON_BASE}/products/category/${catInfo.dj}?limit=${limitPerCategory}`;
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour (Next.js fetch cache)
    });
    if (!res.ok) throw new Error(`DummyJSON fetch failed for ${catInfo.dj}: ${res.status}`);
    const data = await res.json();
    return (data.products || []).map((p, i) => transformProduct(p, catInfo, i));
  };

  const results = await Promise.allSettled(
    FASHION_CATEGORY_MAP.map(fetchCategory)
  );

  const allProducts = results
    .filter((r) => r.status === "fulfilled")
    .flatMap((r) => r.value);

  // Deduplicate by slug in case same product appears in multiple queries
  const seen = new Set();
  return allProducts.filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });
}

/**
 * Fetch a single product by its slug.
 * Searches the full fashion catalog for the matching product.
 *
 * @param {string} slug
 * @returns {Promise<object|null>}
 */
export async function fetchProductBySlug(slug) {
  // Try DummyJSON's search endpoint using slug words
  const query = slug.replace(/-/g, " ");
  const searchRes = await fetch(
    `${DUMMYJSON_BASE}/products/search?q=${encodeURIComponent(query)}&limit=15`,
    { next: { revalidate: 3600 } }
  );
  if (searchRes.ok) {
    const data = await searchRes.json();
    const products = data.products || [];
    for (const djProduct of products) {
      const testSlug = slugify(djProduct.title);
      if (testSlug === slug) {
        const catInfo = FASHION_CATEGORY_MAP.find(
          (c) => c.dj === djProduct.category
        ) || { dj: djProduct.category, our: "TOPS", gender: "UNISEX" };
        return transformProduct(djProduct, catInfo);
      }
    }
  }
  return null;
}

/**
 * Fetch a single product by its DummyJSON numeric ID.
 *
 * @param {number|string} djId
 * @returns {Promise<object|null>}
 */
export async function fetchProductByDJId(djId) {
  const res = await fetch(`${DUMMYJSON_BASE}/products/${djId}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const djProduct = await res.json();
  const catInfo = FASHION_CATEGORY_MAP.find(
    (c) => c.dj === djProduct.category
  ) || { dj: djProduct.category, our: "TOPS", gender: "UNISEX" };
  return transformProduct(djProduct, catInfo);
}

/**
 * Search products by query string using DummyJSON search.
 *
 * @param {string} query
 * @param {number} [limit=20]
 * @returns {Promise<Array>}
 */
export async function searchFashionProducts(query, limit = 20) {
  if (!query || query.trim().length < 2) return [];

  const res = await fetch(
    `${DUMMYJSON_BASE}/products/search?q=${encodeURIComponent(query.trim())}&limit=${limit}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return [];
  const data = await res.json();

  return (data.products || [])
    .filter((p) => FASHION_CATEGORY_MAP.some((c) => c.dj === p.category))
    .map((p) => {
      const catInfo = FASHION_CATEGORY_MAP.find((c) => c.dj === p.category) ||
        { dj: p.category, our: "TOPS", gender: "UNISEX" };
      return transformProduct(p, catInfo);
    });
}

// Exported category/filter lists for the UI
export const categoriesList = [
  { id: "ALL",         label: "ALL PIECES"    },
  { id: "TOPS",        label: "TOPS & SHIRTS" },
  { id: "DRESSES",     label: "DRESSES"       },
  { id: "FOOTWEAR",    label: "FOOTWEAR"      },
  { id: "ACCESSORIES", label: "ACCESSORIES"   },
];

export const gendersList = [
  { id: "ALL",    label: "ALL GENDERS" },
  { id: "UNISEX", label: "UNISEX"      },
  { id: "MEN",    label: "MEN"         },
  { id: "WOMEN",  label: "WOMEN"       },
];

export const sizesList = ["XS", "S", "M", "L", "XL", "XXL", "39", "40", "41", "42", "43", "44", "45", "ONE SIZE"];

export const colorsList = COLOR_PALETTE;

export const sortOptions = [
  { id: "newest",     label: "NEWEST ARRIVALS"    },
  { id: "featured",   label: "EDITORIAL PICKS"    },
  { id: "popular",    label: "MOST POPULAR"       },
  { id: "price-asc",  label: "PRICE: LOW TO HIGH" },
  { id: "price-desc", label: "PRICE: HIGH TO LOW" },
];
