"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "motion/react";
import {
  Scale,
  Truck,
  RotateCcw,
  AlertTriangle,
  ShieldAlert,
  Check,
} from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  const lastUpdated = "OCTOBER 2026";

  const sections = [
    {
      id: "scope",
      icon: Scale,
      title: "1. Agreement to Terms & Conditions",
      content: [
        "By accessing or using the QUIET storefront (quiet-archive.com) or purchasing products through our platform, you agree to be bound by these legal Terms of Service and all incorporated policies.",
        "If you do not agree with any portion of these terms, you are restricted from acquiring items or placing commissions on our platform.",
      ],
    },
    {
      id: "availability",
      icon: Check,
      title: "2. Limited Drops & Ordering Rules",
      content: [
        "• Drops & Allocation: All garments and accessories offered by QUIET are released in strictly limited batch runs. Placing an item in your bag does not reserve inventory until full payment is confirmed.",
        "• Order Acceptance: We reserve the explicit right to refuse or cancel any order for reasons including inventory stockouts, pricing errors, or suspected unauthorized reseller activity.",
        "• Purchase Limits: To preserve item integrity for true collectors, max quantity limits per customer apply to selected drop releases.",
      ],
    },
    {
      id: "shipping",
      icon: Truck,
      title: "3. Worldwide Express Shipping & Duties",
      content: [
        "• Dispatch Timelines: In-stock drop items are processed within 2–4 business days. Pre-orders or bespoke tailormade commissions carry custom lead times noted on the product display page.",
        "• Import Duties & Taxes: International shipments outside of domestic jurisdiction may incur local import taxes, customs duties, and handling fees assessed by your regional customs authority. The customer remains sole bearer of these charges.",
      ],
    },
    {
      id: "returns",
      icon: RotateCcw,
      title: "4. Returns, Exchanges & Archive Rules",
      content: [
        "• 14-Day Return Window: Unworn items with original tags and security seals intact may be submitted for return within 14 days of confirmed delivery.",
        "• Final Sale Items: Vault archive drops, customized/tailored garments, and select hygiene-sensitive accessories (e.g., jewelry, eyewear) are non-refundable.",
        "• Refund Processing: Refunds are issued to the original payment method minus original shipping charges once returned items complete inspection.",
      ],
    },
    {
      id: "ip",
      icon: ShieldAlert,
      title: "5. Intellectual Property & Brand Assets",
      content: [
        "All visual typography, garment silhouettes, editorial imagery, codebases, audio assets, and trade names (including 'QUIET') are exclusive intellectual property of QUIET.",
        "Reproduction, redistribution, reverse-engineering, or commercial exploitation of any site content without explicit written consent is strictly prohibited under international copyright law.",
      ],
    },
    {
      id: "liability",
      icon: AlertTriangle,
      title: "6. Limitation of Liability",
      content: [
        "QUIET operates on an 'as-is' and 'as-available' basis. To the maximum extent permitted by law, QUIET disclaims all indirect, incidental, or consequential damages resulting from site access, server downtime, or third-party carrier shipping delays.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111111] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 sm:px-10 lg:px-16 pt-10 sm:pt-14 pb-20">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 pb-8 border-b border-black/10"
        >
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-400 mb-3">
            <span>LEGAL ARCHIVE • STMT-02</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-sans uppercase tracking-tight text-black">
            TERMS OF SERVICE
          </h1>
          <div className="flex items-center justify-between flex-wrap gap-4 mt-4 font-mono text-xs text-neutral-500">
            <p>REVISION DATE: {lastUpdated}</p>
            <p className="tracking-widest font-mono">
              GOVERNING JURISDICTION • UNITED STATES
            </p>
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="bg-white border border-black/8 rounded-2xl p-6 sm:p-10 mb-12 shadow-2xs leading-relaxed"
        >
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400 font-bold mb-3">
            TERMS OVERVIEW
          </h2>
          <p className="text-sm sm:text-base text-neutral-800 leading-relaxed font-sans">
            Welcome to QUIET. These Terms of Service govern your relationship
            with our brand, website, and digital commerce platform. Please read
            them thoroughly prior to placing any orders or engaging with our
            service.
          </p>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-8">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <motion.section
                key={section.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="bg-white border border-black/8 rounded-2xl p-6 sm:p-8 shadow-2xs"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold font-sans uppercase tracking-tight text-black">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-3 font-sans text-xs sm:text-sm text-neutral-700 leading-relaxed pl-0 sm:pl-11">
                  {section.content.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>

        {/* Footer Note & Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-14 pt-8 border-t border-black/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-neutral-500"
        >
          <p>NEED ASSISTANCE WITH AN EXISTING ORDER?</p>
          <Link
            href="/privacy"
            className="text-black font-semibold uppercase tracking-wider hover:opacity-70 transition-opacity"
          >
            READ PRIVACY POLICY →
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
