"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Check, Heart, Eye } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";

export function ShopProductCard({ product, viewMode = 3 }) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "M");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || null);
  const [isAdded, setIsAdded] = useState(false);
  const [showQuickSizes, setShowQuickSizes] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const isFavorite = useWishlistStore((state) => state.isWishlisted(product.id));
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

  const handleQuickAdd = (e, sizeToUse) => {
    e.preventDefault();
    e.stopPropagation();

    const size = sizeToUse || selectedSize;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: size,
      image: product.image,
      sku: `QT-${product.id.toUpperCase()}-${size}`,
      color: selectedColor?.name,
      quantity: 1,
    });

    setIsAdded(true);
    setShowQuickSizes(false);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col justify-between select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickSizes(false);
      }}
    >
      {/* Product Image Container */}
      <div className="relative w-full aspect-[3/3.8] bg-[#EDEDED] overflow-hidden rounded-xl sm:rounded-2xl border border-black/[0.04] transition-all duration-500 group-hover:shadow-xl group-hover:border-black/10">
        <Link
          href={`/product/${product.slug}`}
          className="block w-full h-full relative"
        >
          {/* Primary Product Image */}
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={cn(
              "object-cover object-center transition-all duration-700 ease-out",
              product.secondaryImage && isHovered
                ? "opacity-0 scale-105"
                : "opacity-100 scale-100"
            )}
            priority={false}
            unoptimized
          />

          {/* Alternate Hover Lookbook Image */}
          {product.secondaryImage && (
            <Image
              src={product.secondaryImage}
              alt={`${product.name} alternate view`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={cn(
                "object-cover object-center absolute inset-0 transition-all duration-700 ease-out",
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-105"
              )}
              unoptimized
            />
          )}

          {/* Subtle dark vignette on bottom edge for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </Link>

        {/* Top Badges: Tag / Category */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <div className="flex flex-wrap items-center gap-1.5">
            {product.tag && (
              <span
                className={cn(
                  "font-mono text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-md font-semibold backdrop-blur-md shadow-sm",
                  product.tag === "BESTSELLER" || product.tag === "PIECE OF SEASON"
                    ? "bg-black text-white"
                    : product.tag === "NEW ARRIVAL"
                    ? "bg-white/95 text-black border border-black/10"
                    : "bg-neutral-900/80 text-white"
                )}
              >
                {product.tag}
              </span>
            )}
            <span className="font-mono text-[8.5px] uppercase tracking-[0.16em] px-1.5 py-0.5 rounded bg-black/40 text-white backdrop-blur-md hidden sm:inline-block">
              {product.gender}
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleFavorite}
            aria-label="Save to wishlist"
            className="pointer-events-auto w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-md border border-black/10 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300 shadow-sm cursor-pointer active:scale-90"
          >
            <Heart
              className={cn(
                "w-3.5 h-3.5 transition-colors",
                isFavorite ? "fill-red-500 text-red-500" : "text-black group-hover/btn:text-white"
              )}
            />
          </button>
        </div>

        {/* Quick Add Overlay Bar (Slides Up on Hover) */}
        <div className="absolute bottom-3 inset-x-3 z-20 pointer-events-auto">
          <AnimatePresence mode="wait">
            {showQuickSizes ? (
              <motion.div
                key="sizes"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="bg-white/95 backdrop-blur-md p-2 rounded-xl border border-black/10 shadow-lg flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between px-1">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500">
                    SELECT SIZE
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowQuickSizes(false);
                    }}
                    className="font-mono text-[9px] text-neutral-400 hover:text-black uppercase cursor-pointer"
                  >
                    CLOSE
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={(e) => handleQuickAdd(e, s)}
                      className="py-1.5 text-center font-mono text-[10px] font-semibold uppercase border border-black/10 rounded-md hover:bg-black hover:text-white transition-colors cursor-pointer bg-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="btn"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  y: isHovered ? 0 : 10,
                }}
                transition={{ duration: 0.2 }}
                className="hidden sm:block"
              >
                <button
                  onClick={(e) => {
                    if (product.sizes.length > 1) {
                      e.preventDefault();
                      setShowQuickSizes(true);
                    } else {
                      handleQuickAdd(e, product.sizes[0]);
                    }
                  }}
                  className={cn(
                    "w-full py-2.5 px-4 rounded-xl font-mono text-[11px] font-bold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-all duration-300 shadow-md cursor-pointer active:scale-[0.98]",
                    isAdded
                      ? "bg-emerald-600 text-white"
                      : "bg-[#111111] hover:bg-black text-white hover:shadow-black/20"
                  )}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>ADDED TO BAG</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 stroke-[2]" />
                      <span>QUICK ADD</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Instant Add Button (Always visible on mobile) */}
          <div className="sm:hidden">
            <button
              onClick={(e) => handleQuickAdd(e, product.sizes[0])}
              className={cn(
                "w-full py-2 px-3 rounded-lg font-mono text-[10px] font-bold uppercase tracking-[0.14em] flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95",
                isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-white/95 text-black border border-black/10 backdrop-blur-md"
              )}
            >
              {isAdded ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>ADDED</span>
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3" />
                  <span>ADD TO BAG</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Product Metadata / Info Section */}
      <div className="pt-3.5 pb-1 space-y-1.5">
        {/* Category & Color Swatches Preview */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-neutral-500 font-medium truncate">
            {product.category}
          </span>

          {/* Color swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedColor(c);
                  }}
                  title={c.name}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full border transition-all cursor-pointer",
                    selectedColor?.name === c.name
                      ? "border-black scale-125 shadow-xs"
                      : "border-black/20 hover:scale-110"
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Title */}
        <Link href={`/product/${product.slug}`} className="block group/link">
          <h3 className="font-sans text-[13px] sm:text-[14px] font-medium uppercase tracking-tight text-[#111111] leading-snug line-clamp-1 group-hover/link:text-neutral-500 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price & Sizes Preview */}
        <div className="flex items-baseline justify-between pt-0.5 font-mono">
          <span className="text-xs sm:text-[13px] font-bold text-black tracking-[0.12em]">
            {product.currency}
            {product.price}
          </span>

          <span className="text-[9px] uppercase tracking-widest text-neutral-400">
            {product.sizes.length} SIZES
          </span>
        </div>
      </div>
    </motion.div>
  );
}
