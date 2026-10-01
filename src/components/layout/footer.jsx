"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Footer({ className }) {
  const footerData = siteConfig.footer || {
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
      { label: "CONTACT", href: "/contact" },
      { label: "DELIVERY", href: "#delivery" },
    ],
    followLinks: [
      { label: "INSTAGRAM", href: "https://instagram.com" },
      { label: "TWITTER (X)", href: "https://x.com" },
    ],
    copyright: "© 2026 QUIET. ALL RIGHTS RESERVED.",
    privacyHref: "/privacy",
    termsHref: "/terms",
  };

  return (
    <footer
      id="footer"
      className={cn(
        "relative w-full bg-[#050505] text-white select-none overflow-hidden",
        "pt-16 sm:pt-20 lg:pt-28 pb-0",
        className,
      )}
    >
      <div className="w-full max-w-[1780px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 flex flex-col justify-between">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-10 md:gap-8 lg:gap-12 items-start">
          {/* COLUMN 1: Brand Identifier & Go to Store */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-1 md:col-span-1 lg:col-span-3 flex flex-col justify-between min-h-[140px] sm:min-h-[160px]"
          >
            <div>
              <Link
                href="/"
                className="font-mono text-xs sm:text-[30px] font-semibold tracking-[0.25em] text-white hover:text-neutral-300 transition-colors inline-block"
              >
                {footerData.brand}
              </Link>
            </div>

            <div className="pt-8 sm:pt-12">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 font-mono text-[10.5px] sm:text-[11.5px] uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors duration-200"
              >
                <span>{footerData.tagline}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[1.8] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* COLUMN 2: SHOP Categories */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-1 md:col-span-1 lg:col-span-3 space-y-4"
          >
            <h4 className="font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.25em] text-neutral-200 font-semibold">
              SHOP
            </h4>
            <ul className="space-y-2.5">
              {footerData.shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-neutral-400 hover:text-white transition-colors duration-200 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* COLUMN 3: DETAILS */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-1 md:col-span-1 lg:col-span-3 space-y-4"
          >
            <h4 className="font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.25em] text-neutral-200 font-semibold">
              DETAILS
            </h4>
            <ul className="space-y-2.5">
              {footerData.detailLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-neutral-400 hover:text-white transition-colors duration-200 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* COLUMN 4: FOLLOW Socials */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-1 md:col-span-1 lg:col-span-3 space-y-4"
          >
            <h4 className="font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.25em] text-neutral-200 font-semibold">
              FOLLOW
            </h4>
            <ul className="space-y-2.5">
              {footerData.followLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-neutral-400 hover:text-white transition-colors duration-200 block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 sm:mt-24 lg:mt-32 pb-4 sm:pb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-4 items-center text-neutral-400 font-mono text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.2em]"
        >
          {/* Copyright text (Left) */}
          <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-4">
            <p className="leading-none">{footerData.copyright}</p>
          </div>

          {/* Creator Credit (Center) */}
          <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-4">
            <p className="leading-none text-neutral-400">
              {footerData.credit || "CREATED WITH PASSION BY MAHI HOSSAIN"}
            </p>
          </div>

          {/* Privacy Link */}
          <div className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2">
            <Link
              href={footerData.privacyHref}
              className="hover:text-white transition-colors duration-200 block"
            >
              PRIVACY
            </Link>
          </div>

          {/* Terms & Admin Links */}
          <div className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2 flex items-center gap-4 text-left">
            <Link
              href={footerData.termsHref}
              className="hover:text-white transition-colors duration-200 block"
            >
              TERMS
            </Link>
            <span>•</span>
            <Link
              href="/QuiteadminPan"
              className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors duration-200 block"
            >
              ADMIN
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="w-full overflow-hidden leading-none select-none pointer-events-none text-center pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-8 lg:pb-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans font-bold uppercase text-white tracking-[-0.035em] whitespace-nowrap leading-none text-[22vw] sm:text-[21vw] md:text-[20.5vw] lg:text-[20vw]"
        >
          {footerData.brand}
        </motion.h2>
      </div>
    </footer>
  );
}
