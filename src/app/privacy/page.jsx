"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "motion/react";
import { ShieldCheck, Lock, Eye, FileText, Bell, Sparkles } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  const lastUpdated = "OCTOBER 2026";

  const sections = [
    {
      id: "collection",
      icon: Eye,
      title: "1. Information We Collect",
      content: [
        "At QUIET, we treat your personal privacy with the same rigor as our craft. When you browse our digital storefront, create an account, or place a commission order, we collect essential telemetry required to deliver our service.",
        "• Identity Data: Full name, account credentials, and communication preferences.",
        "• Contact Data: Shipping destination, billing address, phone number, and email.",
        "• Financial Telemetry: Encrypted tokenized transaction identifiers (we never store raw credit card credentials).",
        "• Technical Telemetry: IP addresses, browser fingerprinting, timezone settings, and device access logs.",
      ],
    },
    {
      id: "usage",
      icon: FileText,
      title: "2. How Your Data Is Utilized",
      content: [
        "Your data powers the quiet infrastructure behind every drop and delivery. Specifically, we utilize your information to:",
        "• Process, dispatch, and track your limited-edition garments.",
        "• Authenticate your account access and synchronize your persistent wishlist across devices.",
        "• Notify you of upcoming drop countdowns, private archive access, and bespoke order updates.",
        "• Enhance website performance through anonymous UX interaction metrics.",
      ],
    },
    {
      id: "security",
      icon: Lock,
      title: "3. Cryptographic Security & Vault",
      content: [
        "We implement enterprise-grade TLS 1.3 encryption across all communication layers. Password hashes are salted and processed using industry-standard bcrypt encryption.",
        "We never sell, rent, or lease your personal telemetry to third-party ad brokers or data aggregators. Data sharing is limited strictly to authorized logistics fulfillment partners (e.g., DHL Express, FedEx) to complete delivery.",
      ],
    },
    {
      id: "cookies",
      icon: ShieldCheck,
      title: "4. Cookies & Session Storage",
      content: [
        "QUIET uses minimal local storage and essential session cookies to remember active shopping bags, persistent user authentication states, and locale preferences.",
        "You can configure your browser to reject cookies, though certain bespoke storefront features (such as persistent guest bags and auto-fill checkout) may be limited.",
      ],
    },
    {
      id: "rights",
      icon: Bell,
      title: "5. Your Data Rights & Sovereignty",
      content: [
        "You maintain complete sovereignty over your data under global privacy standards (including GDPR and CCPA):",
        "• Access & Export: Request a machine-readable archive of all personal data held by QUIET.",
        "• Rectification: Update or correct your profile information directly from your Account Dashboard.",
        "• Erasure ('Right to be Forgotten'): Request total deletion of your profile and historical records by contacting concierge@quiet-archive.com.",
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
            <span>LEGAL ARCHIVE • STMT-01</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-sans uppercase tracking-tight text-black">
            PRIVACY POLICY
          </h1>
          <div className="flex items-center justify-between flex-wrap gap-4 mt-4 font-mono text-xs text-neutral-500">
            <p>REVISION DATE: {lastUpdated}</p>
            <p className="tracking-widest">
              DATA PROTECTION OFFICERS • QUIET ARCHIVE
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
            PREAMBLE
          </h2>
          <p className="text-sm sm:text-base text-neutral-800 leading-relaxed font-sans">
            QUIET (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is
            committed to protecting your personal privacy. This Privacy Policy
            details our transparent approach to collecting, storing, protecting,
            and utilizing your personal data across our digital ecosystem.
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
          <p>HAVE QUESTIONS REGARDING YOUR DATA?</p>
          <Link
            href="/terms"
            className="text-black font-semibold uppercase tracking-wider hover:opacity-70 transition-opacity"
          >
            VIEW TERMS OF SERVICE →
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
