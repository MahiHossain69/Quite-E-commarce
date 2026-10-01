"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { siteConfig } from "@/config/site";
import { useSiteConfigStore } from "@/store/site-config-store";
import { cn } from "@/lib/utils";

export function Hero({
  image: propImage,
  alt: propAlt,
  headline: propHeadline,
  eyebrow: propEyebrow,
  description: propDescription,
  ctaText: propCtaText,
  ctaLink: propCtaLink,
  secondaryTextTop: propSecondaryTextTop,
  secondaryTextBottom: propSecondaryTextBottom,
  className,
}) {
  const { config, initialize } = useSiteConfigStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const dynamicHero = config?.hero;

  // propImage is the actively selected campaign cut from page.jsx — always prefer it
  const image = propImage || dynamicHero?.heroImage || siteConfig.hero.image;
  const alt = propAlt || siteConfig.hero.alt;
  const headline = dynamicHero?.headlineLine1 ? `${dynamicHero.headlineLine1}\n${dynamicHero.headlineLine2 || ""}` : (propHeadline || siteConfig.hero.headline);
  const eyebrow = dynamicHero?.badge || propEyebrow || siteConfig.hero.eyebrow;
  const description = dynamicHero?.subheading || propDescription || siteConfig.hero.description;
  const ctaText = dynamicHero?.primaryButtonText || propCtaText || siteConfig.hero.ctaText;
  const ctaLink = dynamicHero?.primaryButtonUrl || propCtaLink || siteConfig.hero.ctaLink;
  const secondaryTextTop = propSecondaryTextTop || siteConfig.hero.secondaryTextTop;
  const secondaryTextBottom = propSecondaryTextBottom || siteConfig.hero.secondaryTextBottom;

  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position tracking for interactive X-ray cursor lens
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative w-full bg-[#FAFAFA] select-none overflow-hidden",
        "min-h-[100dvh] flex flex-col",
        "md:block md:min-h-[calc(100vh-80px)] md:overflow-hidden",
        className,
      )}
    >
      {/* Background Architectural Grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-10
                   grid grid-cols-3 grid-rows-4
                   md:grid-cols-4 md:grid-rows-3"
      >
        {Array.from({ length: 12 }).map((_, idx) => (
          <div
            key={idx}
            className="border-r border-b border-black/[0.055] w-full h-full"
          />
        ))}
      </div>

      {/* Interactive X-Ray Cursor Lens (mix-blend-difference) */}
      <motion.div
        aria-hidden="true"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? 1 : 0,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="hidden md:block pointer-events-none absolute z-40 w-44 h-44 rounded-full bg-white blur-xl mix-blend-difference"
      />

      {/* Desktop Image (Absolute, Centered) */}
      <div
        aria-hidden="true"
        className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none z-[15] overflow-hidden"
      >
        <motion.div
          initial={{ y: "50vh", opacity: 0.2 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.19, 1, 0.22, 1] }}
          className="relative w-[75vw] md:w-[62vw] lg:w-[56vw] xl:w-[50vw] h-[68vh] md:h-[72vh] lg:h-[76vh] max-h-[820px] max-w-[950px] -mt-2 md:-mt-4"
        >
          <Image
            src={image}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1200px) 70vw, 55vw"
            className="object-contain object-center filter contrast-[1.03]"
            unoptimized
          />
        </motion.div>
      </div>

      {/* Desktop Bottom White Gradient Overlay */}
      <div
        aria-hidden="true"
        className="hidden md:block absolute bottom-0 inset-x-0 pointer-events-none z-20
                   h-40 md:h-48 lg:h-52 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/90 to-transparent"
      />

      {/* Mobile Top Content */}
      <div className="md:hidden flex-none relative z-30 px-5 pt-3 flex flex-col items-end gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="w-full text-right flex flex-col items-end gap-1"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111111] font-semibold leading-snug max-w-[240px]">
            {eyebrow}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#444444] font-normal leading-snug max-w-[240px]">
            {description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.35, ease: [0.19, 1, 0.22, 1] }}
          className="w-full"
        >
          <Link
            href={ctaLink}
            className="w-full py-3.5 px-6 bg-[#181818] hover:bg-black text-white
                       rounded-[5px] font-mono text-[11px] uppercase tracking-[0.2em]
                       flex items-center justify-center gap-3
                       transition-all duration-300 active:scale-[0.98]"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4 stroke-[1.8]" />
          </Link>
        </motion.div>
      </div>

      {/* Mobile Image */}
      <div className="md:hidden flex-1 relative overflow-hidden z-[15] mt-3">
        <motion.div
          initial={{ y: "18vh", opacity: 0.1 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.19, 1, 0.22, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={image}
            alt={alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top filter contrast-[1.02]"
          />
        </motion.div>

        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-32 z-10
                     bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/70 to-transparent"
        />
      </div>

      {/* Mobile Headline */}
      <div className="md:hidden absolute bottom-3 inset-x-0 z-30 text-center pointer-events-none">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.55, ease: [0.19, 1, 0.22, 1] }}
          className="font-display font-black uppercase text-[#111111]
                     tracking-[-0.03em] leading-none select-none
                     text-[13.5vw]"
        >
          {headline}
        </motion.h1>
      </div>

      {/* Desktop Main Content Container */}
      <div
        className="hidden md:flex relative z-[25] w-full h-full
                   min-h-[calc(100vh-80px)] flex-col justify-between
                   max-w-[1920px] mx-auto px-8 md:px-10 lg:px-16 pt-5 sm:pt-6 pb-5"
      >
        <div className="grid grid-cols-12 gap-4 lg:gap-6 items-start">
          {/* Top Left Description & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="col-span-6 lg:col-span-4 space-y-3 sm:space-y-4 z-30"
          >
            <div className="space-y-1 max-w-[340px]">
              <p className="font-mono text-[10.5px] sm:text-[11px] lg:text-[11.5px] uppercase tracking-[0.14em] text-[#111111] font-semibold leading-relaxed">
                {eyebrow}
              </p>
              <p className="font-mono text-[10.5px] sm:text-[11px] lg:text-[11.5px] uppercase tracking-[0.14em] text-[#222222] font-normal leading-relaxed">
                {description}
              </p>
            </div>
            <div className="pt-1">
              <Link
                href={ctaLink}
                className="group inline-flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5
                           bg-[#161616] hover:bg-black text-white rounded-[4px]
                           font-mono text-[10.5px] sm:text-[11px] tracking-[0.18em] uppercase
                           transition-all duration-300 shadow-sm active:scale-[0.98]"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300 stroke-[1.8]" />
              </Link>
            </div>
          </motion.div>

          <div className="hidden lg:block lg:col-span-4 pointer-events-none" />

          {/* Top Right Editorial Secondary Copy */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.0,
              delay: 0.55,
              ease: [0.19, 1, 0.22, 1],
            }}
            className="col-span-6 lg:col-span-4 flex justify-end text-right z-30"
          >
            <div className="space-y-0.5 border-r-2 border-black/80 pr-3">
              <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#111111] font-semibold">
                {secondaryTextTop}
              </p>
              <p className="font-mono text-[10.5px] sm:text-xs uppercase tracking-[0.2em] text-neutral-500 font-normal">
                {secondaryTextBottom}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Desktop Bottom Headline: SPEAK QUIET */}
        <div className="relative z-30 w-full text-center pointer-events-none pt-8 pb-1 flex justify-center items-end overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="font-display font-black uppercase text-[#111111]
                       tracking-[-0.035em] leading-[0.88] select-none whitespace-nowrap
                       text-[12vw] sm:text-[10vw] md:text-[8.2vw] lg:text-[clamp(3.8rem,7.6vw,9.8rem)]"
          >
            {headline}
          </motion.h1>
        </div>
      </div>
    </section>
  );
}
