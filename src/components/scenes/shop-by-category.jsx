"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function ShopByCategory({ className }) {
  const categories = siteConfig.categories || [];

  const hoodies = categories.find((c) => c.id === "hoodies") || {
    name: "HOODIES",
    image: "/images/categories/hoodies.jpg",
    href: "#hoodies",
  };

  const pants = categories.find((c) => c.id === "pants") || {
    name: "PANTS",
    image: "/images/categories/pants.jpg",
    href: "#pants",
  };

  const accessories = categories.find((c) => c.id === "accessories") || {
    name: "ACCESSORIES",
    image: "/images/categories/accessories.jpg",
    href: "#accessories",
  };

  const tshirts = categories.find((c) => c.id === "t-shirts") || {
    name: "T-SHIRTS",
    image: "/images/categories/t-shirts.jpg",
    href: "#t-shirts",
  };

  return (
    <section
      id="categories"
      className={cn(
        "relative w-full bg-[#FAFAFA] select-none text-black",
        "py-10 sm:py-14 lg:py-20",
        className,
      )}
    >
      <div className="w-full max-w-[1590px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 sm:mb-8 lg:mb-10"
        >
          <h2 className="text-[22px] sm:text-[26px] lg:text-[28px] font-normal tracking-tight text-black leading-none uppercase font-sans">
            SHOP BY CATEGORY
          </h2>
        </motion.div>

        <div className="hidden lg:grid grid-cols-12 gap-x-6 xl:gap-x-8 items-stretch min-h-[580px] xl:min-h-[640px]">
          {/* COLUMN 1-4: HOODIES Card (Full Height Left) */}
          <div className="col-span-4 h-full flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              <CategoryCard
                category={hoodies}
                aspectClass="aspect-[3/4.1] xl:aspect-[3/4.15] h-full w-full"
                priority
              />
            </motion.div>
          </div>

          {/* COLUMN 5-12: Right Section (Pants, Taglines, Accessories, T-Shirts) */}
          <div className="col-span-8 flex flex-col justify-between h-full space-y-6 xl:space-y-8">
            {/* TOP ROW: PANTS Card + Far Right Tagline */}
            <div className="flex items-start justify-between gap-6">
              {/* Spacer matching the mid caption column */}
              <div className="w-16 xl:w-24 shrink-0" />

              {/* Center-Top: PANTS Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-[360px] xl:w-[420px] shrink-0"
              >
                <CategoryCard
                  category={pants}
                  aspectClass="aspect-[16/9.5] xl:aspect-[16/9.2] w-full"
                />
              </motion.div>

              {/* Far Top-Right Tagline */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="shrink-0 text-right pt-2 pl-4 max-w-[200px]"
              >
                <p className="font-mono text-[9.5px] xl:text-[10px] uppercase tracking-[0.14em] text-[#666666] leading-relaxed">
                  FORM EVERY PIECE,
                  <br />
                  SLIGHTLY DIFFERENT.
                </p>
              </motion.div>
            </div>

            {/* BOTTOM ROW: Hoodies Caption + ACCESSORIES + T-SHIRTS */}
            <div className="flex items-end justify-between gap-5 xl:gap-7 mt-auto">
              {/* Caption beside Hoodies */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="w-32 xl:w-36 shrink-0 pb-14 xl:pb-18"
              >
                <p className="font-mono text-[9px] xl:text-[9.5px] uppercase tracking-[0.14em] text-[#666666] leading-relaxed">
                  HOODIES — BUILT FOR EVERYDAY,
                  <br />
                  OVERSIZED BY DESIGN
                </p>
              </motion.div>

              {/* Center-Bottom: ACCESSORIES Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex-1 max-w-[270px] xl:max-w-[310px]"
              >
                <CategoryCard
                  category={accessories}
                  aspectClass="aspect-[3/3.5] xl:aspect-[3/3.3] w-full"
                />
              </motion.div>

              {/* Right-Bottom: T-SHIRTS Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: 0.35,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex-1 max-w-[370px] xl:max-w-[430px]"
              >
                <CategoryCard
                  category={tshirts}
                  aspectClass="aspect-[4/3] xl:aspect-[1.35/1] w-full"
                />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="lg:hidden flex flex-col space-y-4 sm:space-y-6 max-w-lg sm:max-w-2xl mx-auto">
          {/* 1. HOODIES (Tall Portrait Card) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full"
          >
            <CategoryCard
              category={hoodies}
              aspectClass="aspect-[3/3.7] sm:aspect-[3/3.5]"
              priority
            />
          </motion.div>

          {/* 2. PANTS (Wide Horizontal Card) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="w-full"
          >
            <CategoryCard
              category={pants}
              aspectClass="aspect-[16/9.5] sm:aspect-[16/9]"
            />
          </motion.div>

          {/* 3. ACCESSORIES (Portrait Card) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="w-full"
          >
            <CategoryCard
              category={accessories}
              aspectClass="aspect-[3/3.5] sm:aspect-[3/3.2]"
            />
          </motion.div>

          {/* 4. T-SHIRTS (Portrait Card) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.24 }}
            className="w-full"
          >
            <CategoryCard
              category={tshirts}
              aspectClass="aspect-[3/3.5] sm:aspect-[3/3.2]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * Reusable Category Card Component
 */
function CategoryCard({
  category,
  aspectClass = "aspect-square",
  priority = false,
}) {
  return (
    <Link
      href={category.href || "#"}
      className="group relative block w-full h-full cursor-pointer select-none overflow-hidden rounded-[16px] sm:rounded-[20px] bg-[#EAECEE] transition-all duration-300 hover:shadow-md"
    >
      <div className={cn("relative w-full overflow-hidden", aspectClass)}>
        <Image
          src={category.image}
          alt={category.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 35vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />

        {/* Subtle hover shade */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.03] transition-colors duration-300" />

        {/* Category Label at bottom left */}
        <div className="absolute bottom-3.5 left-4 sm:bottom-4 sm:left-5 z-20 pointer-events-none">
          <span className="font-sans font-bold text-[13px] sm:text-[14px] lg:text-[15px] tracking-tight uppercase text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] leading-none inline-block transition-transform duration-300 group-hover:translate-x-0.5">
            {category.name}
          </span>
        </div>
      </div>
    </Link>
  );
}
