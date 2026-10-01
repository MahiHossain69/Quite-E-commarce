"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, Heart, Loader2, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useAuthStore } from "@/store/auth-store";
import { useProductStore } from "@/store/product-store";
import { cn } from "@/lib/utils";

function ProductSkeleton() {
  return (
    <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-18 pt-6 sm:pt-10 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 animate-pulse">
        <div className="lg:col-span-4 space-y-6">
          <div className="h-14 bg-neutral-200 rounded w-3/4" />
          <div className="h-14 bg-neutral-200 rounded w-1/2" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-3 bg-neutral-200 rounded w-full" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="w-full aspect-[3/4.2] bg-neutral-200 rounded-2xl" />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square bg-neutral-200 rounded-xl" />
            <div className="aspect-square bg-neutral-200 rounded-xl" />
          </div>
          <div className="h-8 bg-neutral-200 rounded w-1/3" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 bg-neutral-200 rounded-md" />
            ))}
          </div>
          <div className="h-12 bg-neutral-200 rounded-lg w-full" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [product, setProduct] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isAdded, setIsAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const isWishlisted = useWishlistStore((state) =>
    state.isWishlisted(product?.id),
  );
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const addRecentlyViewed = useAuthStore((state) => state.addRecentlyViewed);

  const { customProducts, initialize: initCustomProducts } = useProductStore();

  useEffect(() => {
    initCustomProducts();
  }, [initCustomProducts]);

  // ── Fetch product from real API or custom store ──────────
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      setNotFound(false);

      // Check custom products first
      const formattedCustom = (customProducts || []).map((cp) => ({
        id: cp.id,
        slug: cp.slug || cp.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: cp.name,
        price: cp.price,
        originalPrice: cp.originalPrice || null,
        category: cp.category || "TOPS",
        gender: cp.gender || "UNISEX",
        image:
          cp.images?.[0] ||
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
        secondaryImage: cp.images?.[1] || cp.images?.[0],
        gallery:
          cp.images?.length > 0
            ? cp.images
            : [
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
              ],
        sizes: cp.sizes || ["S", "M", "L", "XL"],
        colors: cp.colors || [{ name: "Washed Black", hex: "#1C1C1C" }],
        isFeatured: !!cp.featured,
        tag: cp.tags?.[0] || (cp.featured ? "FEATURED PIECE" : "NEW DROP"),
        rating: cp.rating || 5.0,
        reviewsCount: cp.reviewCount || 16,
        description: cp.description,
        stock: cp.stock,
        details: [
          "Bespoke archival garment construction",
          "Engineered with premium textile finishes",
          "Relaxed silhouette with clean hems",
          "Dry clean or cold wash recommended",
        ],
        isCustom: true,
      }));

      const customMatch = formattedCustom.find(
        (p) => p.slug === slug || p.id === slug,
      );

      if (customMatch) {
        if (!cancelled) {
          setProduct(customMatch);
          setSelectedImage(customMatch.gallery?.[0] || customMatch.image);
          setSelectedSize(customMatch.sizes?.[0] || "M");
          if (typeof addRecentlyViewed === "function") {
            addRecentlyViewed(customMatch);
          }
          setRelatedItems(
            formattedCustom.filter((p) => p.id !== customMatch.id).slice(0, 5),
          );
          setIsLoading(false);
        }
        return;
      }

      try {
        // 1. Try to find by slug in the full catalog
        const res = await fetch(`/api/products?limit=100`);
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data = await res.json();
        const all = [...formattedCustom, ...(data.products || [])];

        let found = all.find((p) => p.slug === slug);

        // 2. Fallback: if slug has a dj- prefix in the id, search by id
        if (!found) {
          found = all.find((p) => p.id === slug || p.id === `dj-${slug}`);
        }

        if (!cancelled) {
          if (found) {
            setProduct(found);
            setSelectedImage(found.gallery?.[0] || found.image);
            setSelectedSize(found.sizes?.[1] || found.sizes?.[0] || "M");
            if (typeof addRecentlyViewed === "function") {
              addRecentlyViewed(found);
            }
            // Pick related products from the same category (excluding self)
            const related = all
              .filter((p) => p.category === found.category && p.id !== found.id)
              .slice(0, 5);
            setRelatedItems(related);
          } else {
            setNotFound(true);
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error("ProductDetail: failed to load", err);
        if (!cancelled) {
          setNotFound(true);
          setIsLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug, customProducts, addRecentlyViewed]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.image,
      sku: product.sku || `QT-${product.id}-${selectedSize}`,
      quantity: 1,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  // ── Loading ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <main className="relative w-full min-h-screen flex flex-col bg-[#FAFAFA] text-black">
        <Navbar />
        <ProductSkeleton />
        <Footer />
      </main>
    );
  }

  // ── Not found ──────────────────────────────────────────
  if (notFound || !product) {
    return (
      <main className="relative w-full min-h-screen flex flex-col justify-between bg-[#FAFAFA] text-black">
        <div>
          <Navbar />
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              PRODUCT NOT FOUND
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-black border border-black px-5 py-3 hover:bg-black hover:text-white transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              BACK TO SHOP
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // ── Gallery setup ──────────────────────────────────────
  const gallery =
    product.gallery?.length >= 2
      ? product.gallery
      : [product.image, product.secondaryImage || product.image];

  // ── Title split ────────────────────────────────────────
  const nameParts = product.name.includes(" ")
    ? [
        product.name.substring(0, product.name.indexOf(" ")),
        product.name.substring(product.name.indexOf(" ") + 1),
      ]
    : [product.name, ""];

  const detailsAndFitList = product.detailsAndFit || [
    "STANDARD FIT",
    `AVAILABLE IN ${product.sizes.join(", ")}`,
    `SKU: ${product.sku || product.id}`,
    "SEE SIZE GUIDE FOR DETAILS",
  ];

  return (
    <main className="relative w-full min-h-screen flex flex-col justify-between bg-[#FAFAFA] text-black select-none">
      <div>
        <Navbar />

        <section className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-18 pt-6 sm:pt-10 pb-16 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-start">
            <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-8 lg:space-y-12 pt-2">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Brand badge */}
                {product.brand && (
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-neutral-400 mb-3">
                    {product.brand}
                  </p>
                )}
                <h1 className="text-[32px] sm:text-[44px] md:text-[50px] lg:text-[54px] xl:text-[60px] font-normal uppercase leading-[0.92] tracking-tight font-sans text-black">
                  <span className="block">{nameParts[0]}</span>
                  {nameParts[1] && (
                    <span className="block">{nameParts[1]}</span>
                  )}
                </h1>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={cn(
                            "text-xs",
                            i < Math.round(product.rating)
                              ? "text-black"
                              : "text-neutral-300",
                          )}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="font-mono text-[10px] text-neutral-500">
                      {product.rating} ({product.reviewsCount} reviews)
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Details & Fit Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="space-y-4 max-w-[420px]"
              >
                <h2 className="font-mono text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-[#555555]">
                  DETAILS & FIT
                </h2>

                {/* Product description */}
                <p className="font-mono text-[10px] text-neutral-600 leading-relaxed">
                  {product.description}
                </p>

                <ul className="space-y-2.5 font-mono text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.14em] text-[#333333] leading-relaxed">
                  {detailsAndFitList.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-black shrink-0">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Product details */}
                {product.details && (
                  <ul className="space-y-1.5 font-mono text-[9.5px] text-neutral-500 leading-relaxed pt-2">
                    {product.details.map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="shrink-0 text-neutral-300">·</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="pt-4">
                  <div className="w-full h-[1px] bg-black/80" />
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-4 flex justify-center"
            >
              <div className="relative w-full max-w-[460px] lg:max-w-[480px] aspect-[3/4.2] rounded-2xl overflow-hidden bg-[#E8E8E8] shadow-sm border border-black/[0.04] p-6 sm:p-8 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={selectedImage}
                        alt={product.name}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 35vw"
                        className="object-contain object-center transition-all duration-500 ease-out filter contrast-[1.02]"
                        unoptimized={selectedImage?.startsWith("http")}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Tag badge */}
                {product.tag && (
                  <div className="absolute top-4 left-4">
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] px-2 py-1 bg-black text-white rounded-md shadow-sm">
                      {product.tag}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            <div className="lg:col-span-4 flex flex-col justify-between space-y-8 lg:space-y-10">
              {/* Top Gallery Thumbnails */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="grid grid-cols-2 gap-4 max-w-[360px]"
              >
                {gallery.slice(1, 3).map((thumbUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(thumbUrl)}
                    className={cn(
                      "relative aspect-square rounded-xl overflow-hidden bg-[#E8E8E8] p-3 border transition-all duration-300 cursor-pointer hover:shadow-md",
                      selectedImage === thumbUrl
                        ? "border-black shadow-sm scale-[1.02]"
                        : "border-black/5 hover:border-black/20",
                    )}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={thumbUrl}
                        alt={`${product.name} view ${idx + 2}`}
                        fill
                        sizes="180px"
                        className="object-contain object-center"
                        unoptimized={thumbUrl?.startsWith("http")}
                      />
                    </div>
                  </button>
                ))}
              </motion.div>

              {/* Price & Purchase Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="space-y-5 max-w-[360px]"
              >
                {/* Price */}
                <div>
                  <span className="font-sans text-2xl sm:text-[28px] font-medium tracking-tight text-black">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  {product.stock !== undefined && (
                    <span
                      className={cn(
                        "ml-3 font-mono text-[10px] uppercase tracking-wider",
                        product.stock < 10
                          ? "text-red-500"
                          : "text-neutral-400",
                      )}
                    >
                      {product.stock < 10
                        ? `ONLY ${product.stock} LEFT`
                        : "IN STOCK"}
                    </span>
                  )}
                </div>

                {/* Size Selector */}
                <div className="space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                    SIZE
                  </span>
                  <div className="flex items-center flex-wrap gap-2">
                    {product.sizes.map((s) => {
                      const isSelected = selectedSize === s;
                      return (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={cn(
                            "min-w-[40px] h-10 px-2 rounded-md font-mono text-[11px] font-semibold uppercase flex items-center justify-center transition-all duration-200 cursor-pointer",
                            isSelected
                              ? "bg-black text-white shadow-sm"
                              : "bg-[#EDEDED] text-black hover:bg-neutral-300 border border-black/5",
                          )}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color swatches */}
                {product.colors?.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                      COLOR
                    </span>
                    <div className="flex gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          title={c.name}
                          className="w-6 h-6 rounded-full border-2 border-black/20 hover:scale-110 transition-transform cursor-pointer"
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleAddToCart}
                    className={cn(
                      "flex-1 py-3.5 px-6 rounded-lg font-mono text-xs font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md active:scale-[0.98] cursor-pointer",
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-[#181818] hover:bg-black text-white hover:shadow-black/20",
                    )}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>ADDED TO BAG</span>
                      </>
                    ) : (
                      <>
                        <span>ADD TO BAG</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => product && toggleWishlist(product)}
                    aria-label="Save to favorites"
                    className="w-12 h-12 rounded-lg bg-[#EDEDED] hover:bg-black hover:text-white border border-black/5 flex items-center justify-center text-black transition-all duration-300 cursor-pointer active:scale-90"
                  >
                    <Heart
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isWishlisted ? "fill-red-500 text-red-500" : "",
                      )}
                    />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {relatedItems.length > 0 && (
          <section className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-18 py-12 sm:py-16 lg:py-20 border-t border-black/[0.06]">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8 sm:mb-12"
            >
              <span className="font-mono text-[10px] font-medium tracking-[0.2em] text-[#666666] uppercase block mb-1">
                SELECTED PIECES
              </span>
              <h2 className="text-[24px] sm:text-[28px] font-normal tracking-tight text-black uppercase font-sans">
                YOU MAY ALSO LIKE
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 items-start">
              {relatedItems.map((piece, idx) => (
                <motion.div
                  key={piece.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  className="group flex flex-col space-y-2.5"
                >
                  <Link
                    href={`/product/${piece.slug}`}
                    className="block relative w-full aspect-[3/3.8] rounded-xl overflow-hidden bg-[#E8E8E8] p-5 sm:p-6 border border-black/[0.04] transition-all duration-500 group-hover:shadow-lg group-hover:border-black/15 flex items-center justify-center"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={piece.image}
                        alt={piece.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-contain object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        unoptimized={piece.image?.startsWith("http")}
                      />
                    </div>
                  </Link>

                  <div className="flex items-center justify-between text-black pt-1 px-0.5">
                    <Link
                      href={`/product/${piece.slug}`}
                      className="font-sans text-[11px] sm:text-[12px] font-medium uppercase tracking-tight hover:text-neutral-500 transition-colors truncate mr-2"
                    >
                      {piece.name}
                    </Link>
                    <span className="font-mono text-[11px] sm:text-[12px] font-bold shrink-0">
                      ${piece.price}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
