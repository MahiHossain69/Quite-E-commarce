"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ShopHeader } from "@/components/shop/shop-header";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ShopProductCard } from "@/components/shop/shop-product-card";
import { ShopEmptyState } from "@/components/shop/shop-empty-state";
import {
  categoriesList,
  gendersList,
  sizesList,
  colorsList,
  sortOptions,
} from "@/lib/dummyjson";
import { useProductStore } from "@/store/product-store";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";

// ──────────────────────────────────────────────────────────────
// Skeleton card shown while products load
// ──────────────────────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="w-full aspect-[3/3.8] bg-neutral-200 rounded-2xl" />
      <div className="space-y-2 px-0.5">
        <div className="h-2.5 w-3/4 bg-neutral-200 rounded" />
        <div className="h-2 w-1/2 bg-neutral-200 rounded" />
        <div className="h-3 w-1/3 bg-neutral-200 rounded" />
      </div>
    </div>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category")?.toUpperCase() || "ALL";
  const initialSearch   = searchParams.get("search") || "";

  // ── Product Store (Custom / Admin Created Products) ─────────
  const { customProducts, initialize: initCustomProducts } = useProductStore();

  useEffect(() => {
    initCustomProducts();
  }, [initCustomProducts]);

  // ── State ──────────────────────────────────────────────────
  const [apiProducts,    setApiProducts]    = useState([]);
  const [isLoading,      setIsLoading]      = useState(true);
  const [apiError,       setApiError]       = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedGender,   setSelectedGender]   = useState("ALL");
  const [selectedSizes,    setSelectedSizes]     = useState([]);
  const [selectedColors,   setSelectedColors]   = useState([]);
  const [priceRange,       setPriceRange]        = useState([0, 1500]);
  const [selectedSort,     setSelectedSort]      = useState("newest");
  const [searchQuery,      setSearchQuery]       = useState(initialSearch);
  const [viewMode,         setViewMode]          = useState(3);
  const [isDrawerOpen,     setIsDrawerOpen]      = useState(false);

  // ── Fetch real products from DummyJSON (via our API proxy) ─
  useEffect(() => {
    let cancelled = false;
    async function loadProducts() {
      setIsLoading(true);
      setApiError(null);
      try {
        const res = await fetch("/api/products?limit=100");
        if (!res.ok) throw new Error(`API responded ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setApiProducts(data.products || []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Shop: failed to load products", err);
          setApiError("Could not connect to the product catalog. Please try again.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    loadProducts();
    return () => { cancelled = true; };
  }, []);

  // ── Merge custom products created by admin with standard catalog ───
  const allProducts = useMemo(() => {
    const formattedCustom = (customProducts || []).map((cp) => ({
      id: cp.id,
      slug: cp.slug || cp.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: cp.name,
      price: cp.price,
      originalPrice: cp.originalPrice || null,
      category: cp.category || "TOPS",
      gender: cp.gender || "UNISEX",
      image: cp.images?.[0] || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
      secondaryImage: cp.images?.[1] || cp.images?.[0],
      gallery: cp.images || [],
      sizes: cp.sizes || ["S", "M", "L", "XL"],
      colors: cp.colors || [{ name: "Washed Black", hex: "#1C1C1C" }],
      isFeatured: !!cp.featured,
      tag: cp.tags?.[0] || (cp.featured ? "FEATURED PIECE" : "NEW DROP"),
      rating: cp.rating || 5.0,
      reviewsCount: cp.reviewCount || 16,
      description: cp.description,
      stock: cp.stock,
      isCustom: true,
    }));

    return [...formattedCustom, ...apiProducts];
  }, [customProducts, apiProducts]);

  // ── Filter toggle handlers ─────────────────────────────────
  const handleToggleSize = (size) =>
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );

  const handleToggleColor = (colorName) =>
    setSelectedColors((prev) =>
      prev.includes(colorName)
        ? prev.filter((c) => c !== colorName)
        : [...prev, colorName]
    );

  const handleResetFilters = () => {
    setSelectedCategory("ALL");
    setSelectedGender("ALL");
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 1500]);
    setSelectedSort("newest");
    setSearchQuery("");
  };

  // ── Count active filters ───────────────────────────────────
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "ALL") count++;
    if (selectedGender !== "ALL") count++;
    count += selectedSizes.length;
    count += selectedColors.length;
    if (priceRange[1] < 1500) count++;
    if (searchQuery.trim().length > 0) count++;
    return count;
  }, [selectedCategory, selectedGender, selectedSizes, selectedColors, priceRange, searchQuery]);

  // ── Client-side filter + sort on top of fetched data ──────
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (selectedCategory !== "ALL") {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedGender !== "ALL") {
      result = result.filter(
        (p) =>
          p.gender.toLowerCase() === selectedGender.toLowerCase() ||
          p.gender.toLowerCase() === "unisex"
      );
    }

    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        selectedSizes.some((s) => p.sizes.includes(s))
      );
    }

    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => selectedColors.includes(c.name))
      );
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
      );
    }

    switch (selectedSort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
      case "newest":
      default:
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return result;
  }, [
    allProducts,
    selectedCategory,
    selectedGender,
    selectedSizes,
    selectedColors,
    priceRange,
    searchQuery,
    selectedSort,
  ]);

  // ── Render ─────────────────────────────────────────────────
  return (
    <main className="relative w-full min-h-screen flex flex-col justify-between bg-[#FAFAFA] text-black">
      <div>
        <Navbar />

        <ShopHeader
          totalProducts={filteredProducts.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          activeFiltersCount={activeFiltersCount}
          onToggleFilterDrawer={() => setIsDrawerOpen(true)}
          isFilterDrawerOpen={isDrawerOpen}
        />

        <ShopFilters
          categoriesList={categoriesList}
          gendersList={gendersList}
          sizesList={sizesList}
          colorsList={colorsList}
          sortOptions={sortOptions}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedGender={selectedGender}
          onSelectGender={setSelectedGender}
          selectedSizes={selectedSizes}
          onToggleSize={handleToggleSize}
          selectedColors={selectedColors}
          onToggleColor={handleToggleColor}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          selectedSort={selectedSort}
          onSelectSort={setSelectedSort}
          onResetFilters={handleResetFilters}
          activeFiltersCount={activeFiltersCount}
          isDrawerOpen={isDrawerOpen}
          onCloseDrawer={() => setIsDrawerOpen(false)}
          totalCount={filteredProducts.length}
        />

        <section className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-20 py-8 sm:py-12 lg:py-16">

          {/* Loading skeleton */}
          {isLoading && (
            <div className={cn(
              "grid gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:gap-x-8 lg:gap-y-14",
              viewMode === 2 && "grid-cols-1 sm:grid-cols-2",
              viewMode === 3 && "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3",
              viewMode === 4 && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            )}>
              {Array.from({ length: 12 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          )}

          {/* API Error */}
          {!isLoading && apiError && (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
              <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                {apiError}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="font-mono text-[11px] uppercase tracking-widest border border-black px-4 py-2 hover:bg-black hover:text-white transition-all cursor-pointer"
              >
                RETRY
              </button>
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && !apiError && (
            <>
              {filteredProducts.length > 0 ? (
                <motion.div
                  layout
                  className={cn(
                    "grid gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:gap-x-8 lg:gap-y-14",
                    viewMode === 2 && "grid-cols-1 sm:grid-cols-2",
                    viewMode === 3 && "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3",
                    viewMode === 4 && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                  )}
                >
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product) => (
                      <ShopProductCard
                        key={product.id}
                        product={product}
                        viewMode={viewMode}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <ShopEmptyState
                  onResetFilters={handleResetFilters}
                  onSelectCategory={setSelectedCategory}
                />
              )}
            </>
          )}
        </section>
      </div>

      <Footer />
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-[#FAFAFA] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              LOADING CATALOG...
            </p>
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
