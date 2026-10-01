"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { motion } from "motion/react";
import { useSiteConfigStore } from "@/store/site-config-store";
import { cn } from "@/lib/utils";

export function ProductSpotlight({ className }) {
  const { config, initialize } = useSiteConfigStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const customSpotlight = config?.spotlight;

  const spotlight = {
    eyebrow: "SINGLE PRODUCT SPOTLIGHT",
    title: customSpotlight?.tagline || "THE PIECE OF THE SEASON",
    taglineTop: customSpotlight?.productName || "FIVE LATCHES. ONE SILHOUETTE.",
    taglineBottom: customSpotlight?.description
      ? `${customSpotlight.description.slice(0, 60)}...`
      : "NOTHING ELSE NEEDED SAYING.",
    hardware: {
      title: "HARDWARE",
      description: "FIVE SILVER D-RING LATCHES,\nBRUSHED FINISH",
      image: customSpotlight?.detailImage1 || "/images/spotlight-hardware.jpg",
    },
    silhouette: {
      title: customSpotlight?.productName || "SILHOUETTE",
      description:
        customSpotlight?.description ||
        "WIDE-LEG, CUT TO MOVE\nWITHOUT LOSING STRUCTURE.",
      image:
        customSpotlight?.primaryImage ||
        "/images/products/latch-front-jeans.jpg",
    },
    wash: {
      title: "WASH",
      description: "SUN-FADED TONAL VARIATION,\nDEEP BLACK TO CHARCOAL",
      image: customSpotlight?.detailImage2 || "/images/spotlight-washh.jpg",
    },
  };

  return (
    <section
      id="spotlight"
      className={cn(
        "relative w-full bg-[#FAFAFA] select-none text-black",
        "py-10 sm:py-14 lg:py-20",
        className,
      )}
    >
      <div className="w-full max-w-[1590px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 sm:mb-10 lg:mb-12">
          {/* Left Title Block */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-mono text-[10px] xl:text-[11px] font-medium tracking-[0.18em] text-[#666666] uppercase block mb-1">
              {spotlight.eyebrow}
            </span>
            <h2 className="text-[22px] sm:text-[26px] lg:text-[28px] font-normal tracking-tight text-black leading-none uppercase font-sans">
              {spotlight.title}
            </h2>
          </motion.div>

          {/* Right Tagline */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="sm:text-right"
          >
            <p className="font-mono text-[9px] xl:text-[10px] uppercase tracking-[0.14em] text-[#666666] leading-relaxed">
              {spotlight.taglineTop}
              <br />
              {spotlight.taglineBottom}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 xl:gap-8 items-start">
          {/* COLUMN 1: HARDWARE (Left) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-4 flex flex-col group cursor-default"
          >
            <div className="relative w-full aspect-[4/3.8] xl:aspect-[1.05/1] overflow-hidden rounded-[16px] sm:rounded-[20px] bg-[#EAECEE] transition-all duration-300 hover:shadow-md">
              <Image
                src={spotlight.hardware.image}
                alt={spotlight.hardware.title}
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className="object-cover object-center filter contrast-[1.04] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                unoptimized
              />
            </div>

            {/* Description */}
            <div className="pt-3.5 px-0.5 space-y-1">
              <h3 className="font-sans font-semibold text-[13px] sm:text-[14px] uppercase tracking-tight text-black leading-none">
                {spotlight.hardware.title}
              </h3>
              <p className="font-mono text-[9.5px] sm:text-[10px] uppercase tracking-[0.12em] text-[#555555] leading-relaxed whitespace-pre-line">
                {spotlight.hardware.description}
              </p>
            </div>
          </motion.div>

          {/* COLUMN 2: SILHOUETTE (Centerpiece) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-4 flex flex-col group cursor-pointer"
          >
            <Link
              href="/product/latch-front-wide-jeans"
              className="relative w-full aspect-[3/4.2] xl:aspect-[3/4] overflow-hidden rounded-[16px] sm:rounded-[20px] bg-[#EAECEE] p-6 sm:p-8 flex items-center justify-center transition-all duration-300 hover:shadow-md block"
            >
              <div className="relative w-full h-full">
                <Image
                  src={spotlight.silhouette.image}
                  alt={spotlight.silhouette.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 35vw"
                  className="object-contain object-center filter contrast-[1.03] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  unoptimized
                />
              </div>
            </Link>

            {/* Description */}
            <div className="pt-3.5 px-0.5 space-y-1">
              <Link
                href="/product/latch-front-wide-jeans"
                className="font-sans font-semibold text-[13px] sm:text-[14px] uppercase tracking-tight text-black leading-none hover:text-neutral-500 transition-colors block"
              >
                {spotlight.silhouette.title}
              </Link>
              <p className="font-mono text-[9.5px] sm:text-[10px] uppercase tracking-[0.12em] text-[#555555] leading-relaxed whitespace-pre-line">
                {spotlight.silhouette.description}
              </p>
            </div>
          </motion.div>

          {/* COLUMN 3: WASH (Right) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-4 flex flex-col group cursor-default"
          >
            <div className="relative w-full aspect-[4/3.8] xl:aspect-[1.05/1] overflow-hidden rounded-[16px] sm:rounded-[20px] bg-[#EAECEE] transition-all duration-300 hover:shadow-md">
              <Image
                src={spotlight.wash.image}
                alt={spotlight.wash.title}
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className="object-cover object-center filter contrast-[1.04] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                unoptimized
              />
            </div>

            {/* Description */}
            <div className="pt-3.5 px-0.5 space-y-1">
              <h3 className="font-sans font-semibold text-[13px] sm:text-[14px] uppercase tracking-tight text-black leading-none">
                {spotlight.wash.title}
              </h3>
              <p className="font-mono text-[9.5px] sm:text-[10px] uppercase tracking-[0.12em] text-[#555555] leading-relaxed whitespace-pre-line">
                {spotlight.wash.description}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
