"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Plus, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { siteConfig } from "@/config/site";
import { useCartStore } from "@/store/cart-store";
import { useProductStore } from "@/store/product-store";
import { useSiteConfigStore } from "@/store/site-config-store";
import { cn } from "@/lib/utils";

export function NewArrivals({ className }) {
  const { customProducts, initialize: initProducts } = useProductStore();
  const { config, initialize: initConfig } = useSiteConfigStore();

  useEffect(() => {
    initProducts();
    initConfig();
  }, [initProducts, initConfig]);

  const rawPieces = siteConfig.selectedPieces || [];
  
  // Combine with custom created products
  const pieces = [...(customProducts || []).map(cp => ({
    id: cp.id,
    name: cp.name,
    titleLine1: cp.name.split(" ")[0],
    titleLine2: cp.name.split(" ").slice(1).join(" "),
    price: cp.price,
    category: cp.category,
    image: cp.images?.[0] || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
    slug: cp.slug,
    sizes: cp.sizes,
  })), ...rawPieces];

  const addItem = useCartStore((state) => state.addItem);
  const [addedId, setAddedId] = useState(null);

  // Dynamic override from CMS if available
  const newArrConfig = config?.newArrivals;
  const customBanner = newArrConfig?.bannerImage;
  const customFeaturedImg = newArrConfig?.featuredPieceImage;

  const jeans = pieces.find((p) => p.id === "jeans-01") || pieces[0];
  if (customFeaturedImg && jeans) {
    jeans.image = customFeaturedImg;
  }
  const tee = pieces.find((p) => p.id === "tee-01") || pieces[1] || pieces[0];
  const croppedHoodie = pieces.find((p) => p.id === "hoodie-01") || pieces[2] || pieces[0];
  const cargoPants = pieces.find((p) => p.id === "cargo-01") || pieces[3] || pieces[0];
  const oversizedHoodie = pieces.find((p) => p.id === "hoodie-02") || pieces[4] || pieces[0];

  const handleQuickAdd = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      size: item.sizes ? item.sizes[0] : "M",
      image: item.image,
      sku: `QT-${item.id.toUpperCase()}`,
      quantity: 1,
    });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <section
      id="new-arrivals"
      className={cn(
        "relative w-full bg-[#FAFAFA] select-none text-black",
        "py-10 sm:py-14 lg:py-18",
        className,
      )}
    >
      <div className="w-full max-w-[1590px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden lg:grid grid-cols-[1.1fr_1.1fr_1.6fr_1.1fr_1.1fr] gap-4 xl:gap-6 items-stretch min-h-[520px] xl:min-h-[580px]">
          <div className="flex flex-col justify-between h-full">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="pt-1"
            >
              <span className="font-mono text-[10px] xl:text-[11px] font-medium tracking-[0.18em] text-[#666666] uppercase block mb-1">
                SELECTED PIECES
              </span>
              <h2 className="text-[22px] xl:text-[26px] font-normal tracking-tight text-black leading-none uppercase font-sans">
                NEW ARRIVALS
              </h2>
            </motion.div>

            {croppedHoodie && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-full mt-auto"
              >
                <ProductCard
                  item={croppedHoodie}
                  aspectClass="aspect-square"
                  onQuickAdd={handleQuickAdd}
                  isAdded={addedId === croppedHoodie.id}
                />
              </motion.div>
            )}
          </div>

          <div className="flex flex-col justify-start h-full pt-1">
            {tee && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: 0.22,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-full"
              >
                <ProductCard
                  item={tee}
                  aspectClass="aspect-square"
                  onQuickAdd={handleQuickAdd}
                  isAdded={addedId === tee.id}
                />
              </motion.div>
            )}
          </div>

          <div className="flex flex-col justify-center h-full px-0.5">
            {jeans && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.9,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-full h-full flex flex-col"
              >
                <ProductCard
                  item={jeans}
                  aspectClass="aspect-[3/4.2] h-full"
                  imagePadding="p-5 xl:p-7"
                  isHero
                  onQuickAdd={handleQuickAdd}
                  isAdded={addedId === jeans.id}
                />
              </motion.div>
            )}
          </div>

          <div className="flex flex-col justify-end h-full">
            {oversizedHoodie && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: 0.28,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-full mt-auto"
              >
                <ProductCard
                  item={oversizedHoodie}
                  aspectClass="aspect-square"
                  onQuickAdd={handleQuickAdd}
                  isAdded={addedId === oversizedHoodie.id}
                />
              </motion.div>
            )}
          </div>

          <div className="flex flex-col justify-between h-full pt-1">
            {cargoPants && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: 0.34,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-full"
              >
                <ProductCard
                  item={cargoPants}
                  aspectClass="aspect-square"
                  onQuickAdd={handleQuickAdd}
                  isAdded={addedId === cargoPants.id}
                />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="mt-auto pt-4 text-right"
            >
              <Link
                href="/shop"
                className="group inline-flex items-center gap-1.5 font-mono text-[10px] xl:text-[11px] font-medium tracking-[0.16em] uppercase text-black hover:opacity-60 transition-opacity"
              >
                <span>VIEW ALL</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[1.7] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="lg:hidden flex flex-col space-y-7 max-w-lg md:max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="pt-1 flex items-end justify-between"
          >
            <div>
              <span className="font-mono text-[10px] font-medium tracking-[0.18em] text-[#666666] uppercase block mb-0.5">
                SELECTED PIECES
              </span>
              <h2 className="text-[24px] sm:text-[26px] font-normal tracking-tight text-black leading-none uppercase font-sans">
                NEW ARRIVALS
              </h2>
            </div>
            <Link
              href="#new-arrivals"
              className="group inline-flex items-center gap-1.5 font-mono text-[10px] font-medium tracking-[0.16em] uppercase text-black hover:opacity-60 transition-opacity"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="w-3 h-3 stroke-[1.7] transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {jeans && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="w-full"
            >
              <ProductCard
                item={jeans}
                aspectClass="aspect-[3/3.8]"
                imagePadding="p-5"
                isHero
                onQuickAdd={handleQuickAdd}
                isAdded={addedId === jeans.id}
              />
            </motion.div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-1">
            {croppedHoodie && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.18 }}
              >
                <ProductCard
                  item={croppedHoodie}
                  aspectClass="aspect-square"
                  onQuickAdd={handleQuickAdd}
                  isAdded={addedId === croppedHoodie.id}
                />
              </motion.div>
            )}

            {oversizedHoodie && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.24 }}
              >
                <ProductCard
                  item={oversizedHoodie}
                  aspectClass="aspect-square"
                  onQuickAdd={handleQuickAdd}
                  isAdded={addedId === oversizedHoodie.id}
                />
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {cargoPants && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <ProductCard
                  item={cargoPants}
                  aspectClass="aspect-[3/3.7]"
                  imagePadding="p-5"
                  onQuickAdd={handleQuickAdd}
                  isAdded={addedId === cargoPants.id}
                />
              </motion.div>
            )}

            {tee && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="w-full"
              >
                <ProductCard
                  item={tee}
                  aspectClass="aspect-square"
                  onQuickAdd={handleQuickAdd}
                  isAdded={addedId === tee.id}
                />
              </motion.div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 pb-2 border-t border-black/5">
            <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
              AUTUMN / WINTER 2026
            </span>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-[0.16em] uppercase text-black hover:opacity-60 transition-opacity"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[1.7]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  item,
  aspectClass = "aspect-square",
  imagePadding = "p-3.5 xl:p-4",
  isHero = false,
  onQuickAdd,
  isAdded,
}) {
  const productSlug =
    item.id === "jeans-01" ? "latch-front-wide-jeans" : item.slug || item.id;

  return (
    <div className="group flex flex-col w-full cursor-pointer">
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-[14px] xl:rounded-[18px]",
          "bg-[#EAECEE] hover:bg-[#E4E7EA] transition-colors duration-300",
          aspectClass,
          imagePadding,
        )}
      >
        <Link
          href={`/product/${productSlug}`}
          className="relative w-full h-full flex items-center justify-center block"
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes={
              isHero
                ? "(max-width: 1024px) 100vw, 32vw"
                : "(max-width: 1024px) 50vw, 18vw"
            }
            priority={isHero}
            className="object-contain object-center filter contrast-[1.02] transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            unoptimized
          />
        </Link>

        <button
          onClick={(e) => onQuickAdd(item, e)}
          className={cn(
            "absolute bottom-2.5 right-2.5 z-10",
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full",
            "bg-black/90 text-white font-mono text-[9px] uppercase tracking-wider",
            "opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0",
            "transition-all duration-300 shadow-sm backdrop-blur-sm cursor-pointer",
            isAdded && "opacity-100 translate-y-0 bg-neutral-900",
          )}
          aria-label={`Add ${item.name} to bag`}
        >
          {isAdded ? (
            <>
              <Check className="w-3 h-3 text-white stroke-[2.5]" />
              <span>ADDED</span>
            </>
          ) : (
            <>
              <Plus className="w-3 h-3 stroke-[2]" />
              <span>ADD</span>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between pt-2 px-0.5 text-black">
        <Link
          href={`/product/${productSlug}`}
          className="font-sans font-medium text-[10.5px] xl:text-[11.5px] tracking-tight uppercase leading-none truncate pr-1.5 hover:text-neutral-500 transition-colors"
        >
          {item.name}
        </Link>
        <span className="font-sans font-medium text-[10.5px] xl:text-[11.5px] tracking-tight leading-none shrink-0">
          ${item.price}
        </span>
      </div>
    </div>
  );
}
