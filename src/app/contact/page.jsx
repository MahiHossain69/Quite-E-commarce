"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  Globe,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [topic, setTopic] = useState("concierge"); // "concierge" | "order" | "press" | "wholesale"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderNumber: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const topics = [
    {
      id: "concierge",
      label: "VIP CONCIERGE",
      subtitle: "Bespoke styling & drops",
    },
    {
      id: "order",
      label: "ORDER ASSISTANCE",
      subtitle: "Tracking, returns & exchanges",
    },
    {
      id: "press",
      label: "PRESS & MEDIA",
      subtitle: "Editorial & sample loans",
    },
    { id: "wholesale", label: "WHOLESALE", subtitle: "Boutique partnerships" },
  ];

  const studios = [
    {
      city: "NEW YORK",
      role: "HEADQUARTERS & ATELIER",
      address: "542 WEST 28TH STREET, SUITE 400",
      district: "CHELSEA ART DISTRICT, NY 10001",
      hours: "MON–FRI • 09:00 - 18:00 EST",
      gmt: "UTC-5",
    },
    {
      city: "PARIS",
      role: "EUROPEAN SHOWROOM",
      address: "18 RUE VILLEHARDOUIN",
      district: "3RD ARRONDISSEMENT (LE MARAIS), 75003",
      hours: "MON–FRI • 10:00 - 19:00 CET",
      gmt: "UTC+1",
    },
    {
      city: "TOKYO",
      role: "ARCHIVE & LAB",
      address: "5-7-22 MINAMIAOYAMA",
      district: "MINATO-KU, TOKYO 107-0062",
      hours: "MON–SAT • 11:00 - 20:00 JST",
      gmt: "UTC+9",
    },
  ];

  const faqs = [
    {
      q: "HOW FAST DOES THE QUIET CONCIERGE RESPOND?",
      a: "Our dedicated concierge team monitors communications 24/7. Standard inquiries receive a response within 2 to 4 hours. VIP Account holders receive priority response within 30 minutes.",
    },
    {
      q: "CAN I RESERVE LIMITED DROP PIECES IN ADVANCE?",
      a: "Drop allocations are reserved on a first-come, first-served basis. However, registered account holders receive 15-minute priority drop countdown access prior to public releases.",
    },
    {
      q: "DO YOU OFFER BESPOKE FITTING AND TAILORING APPOINTMENTS?",
      a: "Yes. Private consultations are available at our New York and Paris ateliers by appointment. Contact concierge@quiet-archive.com with your requested date and sizing preferences.",
    },
    {
      q: "WHAT SHOULD I DO IF MY TRACKING IS NOT UPDATING?",
      a: "Carrier telemetry can take up to 24 hours to refresh after dispatch. If your package tracking remains static for more than 48 hours, select 'ORDER ASSISTANCE' above and submit your order number.",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        orderNumber: "",
        subject: "",
        message: "",
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111111] flex flex-col font-sans overflow-hidden select-none">
      <Navbar />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 sm:px-10 lg:px-16 pt-10 sm:pt-14 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 pb-10 border-b border-black/10"
        >
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-400 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>GLOBAL CONCIERGE & ATELIER DIRECT</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-sans uppercase tracking-tight text-black leading-[0.95]">
            INITIATE CONTACT
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 max-w-2xl font-sans leading-relaxed">
            Have a question regarding an upcoming drop release, bespoke sizing,
            or order tracking? Connect directly with our atelier team below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT COLUMN: INTERACTIVE FORM */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 bg-white border border-black/8 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden"
          >
            {/* Topic Selector Tabs */}
            <div className="mb-8">
              <label className="block font-mono text-[10.5px] uppercase tracking-[0.2em] text-neutral-400 font-semibold mb-3">
                SELECT INQUIRY TOPIC
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {topics.map((t) => {
                  const active = topic === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTopic(t.id)}
                      className={cn(
                        "text-left p-3.5 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden",
                        active
                          ? "bg-black text-white border-black shadow-xs"
                          : "bg-neutral-50/70 border-black/8 text-neutral-700 hover:bg-neutral-100 hover:border-black/15",
                      )}
                    >
                      <p className="font-mono text-[11px] font-bold uppercase tracking-wider block">
                        {t.label}
                      </p>
                      <p
                        className={cn(
                          "text-[10px] mt-0.5 truncate font-mono",
                          active ? "text-neutral-400" : "text-neutral-500",
                        )}
                      >
                        {t.subtitle}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FORM CONTAINER */}
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="py-16 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-8 h-8 stroke-[1.8]" />
                  </div>
                  <h3 className="text-2xl font-bold font-sans uppercase tracking-tight text-black">
                    COMMUNICATION DISPATCHED
                  </h3>
                  <p className="text-xs sm:text-sm font-mono text-neutral-600 max-w-md mx-auto leading-relaxed">
                    Thank you. Your inquiry has been logged in our queue. A
                    member of our concierge team will review your dispatch and
                    follow up shortly.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-2.5 bg-black text-white rounded-xl font-mono text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      DISPATCH ANOTHER MESSAGE
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form key="form" onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-mono text-[10.5px] uppercase tracking-[0.2em] text-neutral-500 mb-2">
                        YOUR FULL NAME *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mahi Hossain"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-neutral-50/70 border border-black/10 rounded-xl font-sans text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10.5px] uppercase tracking-[0.2em] text-neutral-500 mb-2">
                        EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="mahi@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-neutral-50/70 border border-black/10 rounded-xl font-sans text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Order Number (Conditional/Optional) */}
                  {topic === "order" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block font-mono text-[10.5px] uppercase tracking-[0.2em] text-neutral-500 mb-2">
                        ORDER ID (OPTIONAL)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. QT-892401"
                        value={formData.orderNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            orderNumber: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-neutral-50/70 border border-black/10 rounded-xl font-sans text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-all"
                      />
                    </motion.div>
                  )}

                  {/* Subject */}
                  <div>
                    <label className="block font-mono text-[10.5px] uppercase tracking-[0.2em] text-neutral-500 mb-2">
                      SUBJECT
                    </label>
                    <input
                      type="text"
                      placeholder="Brief title of your inquiry"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-neutral-50/70 border border-black/10 rounded-xl font-sans text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-all"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block font-mono text-[10.5px] uppercase tracking-[0.2em] text-neutral-500">
                        MESSAGE DISPATCH *
                      </label>
                      <span className="font-mono text-[10px] text-neutral-400">
                        {formData.message.length} CHARS
                      </span>
                    </div>
                    <textarea
                      required
                      rows={5}
                      placeholder="Detail your request, garment sizing questions, or specific drop inquiries..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-neutral-50/70 border border-black/10 rounded-xl font-sans text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-black text-white hover:bg-neutral-800 rounded-2xl font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        DISPATCHING...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>SEND DISPATCH</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT COLUMN: DIRECT CHANNELS & ATELIER INFRASTRUCTURE */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Concierge Channels Card */}
            <div className="bg-black text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-md relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-bold font-sans text-base uppercase tracking-wider text-white">
                    DIRECT CHANNELS
                  </h3>
                  <p className="font-mono text-[10.5px] text-neutral-400">
                    Priority response queue for registered clients
                  </p>
                </div>
              </div>

              <div className="space-y-4 font-mono text-xs pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <Mail className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">
                      EMAIL CONCIERGE
                    </span>
                    <a
                      href="mailto:concierge@quiet-archive.com"
                      className="font-semibold text-white hover:text-neutral-300 transition-colors"
                    >
                      concierge@quiet-archive.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <Phone className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">
                      VIP ATELIER DIRECT
                    </span>
                    <span className="font-semibold text-white">
                      +1 (800) 984-0129
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <Clock className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">
                      RESPONSE GUARANTEE
                    </span>
                    <span className="text-emerald-400 font-semibold text-[11px]">
                      AVERAGE &lt; 2 HOURS DISPATCH
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Link Card */}
            <div className="bg-white border border-black/8 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
              <h3 className="font-bold font-sans text-sm uppercase tracking-wider text-black flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                NEED RAPID ANSWERS?
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                Check our self-service order lookup or explore our active return
                &amp; exchange policies.
              </p>
              <div className="pt-2 flex flex-col gap-2 font-mono text-xs">
                <Link
                  href="/account"
                  className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-black/5 transition-colors group"
                >
                  <span className="font-semibold uppercase tracking-wider text-black">
                    TRACK AN ORDER
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/privacy"
                  className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-black/5 transition-colors group"
                >
                  <span className="font-semibold uppercase tracking-wider text-black">
                    PRIVACY &amp; SECURITY
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 pt-16 border-t border-black/10"
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-neutral-400 mb-1">
                <Globe className="w-3.5 h-3.5" />
                <span>PHYSICAL INFRASTRUCTURE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-sans uppercase tracking-tight text-black">
                GLOBAL SHOWROOMS &amp; LABS
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {studios.map((st, idx) => (
              <motion.div
                key={st.city}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white border border-black/8 rounded-3xl p-6 shadow-2xs hover:border-black/25 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 font-semibold bg-neutral-100 px-2.5 py-1 rounded-md">
                    {st.gmt}
                  </span>
                  <Building2 className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
                </div>
                <h3 className="text-xl font-bold font-sans uppercase tracking-tight text-black">
                  {st.city}
                </h3>
                <p className="font-mono text-[10.5px] uppercase tracking-wider text-neutral-500 mt-0.5 mb-4">
                  {st.role}
                </p>

                <div className="space-y-1.5 font-mono text-xs text-neutral-700 pt-4 border-t border-black/5">
                  <p className="font-semibold text-black">{st.address}</p>
                  <p className="text-neutral-500 text-[11px]">{st.district}</p>
                  <p className="text-[10.5px] text-neutral-400 pt-2">
                    {st.hours}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 pt-16 border-t border-black/10 max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold font-sans uppercase tracking-tight text-black">
              FREQUENTLY ASKED INQUIRIES
            </h2>
            <p className="font-mono text-xs text-neutral-500 mt-2 uppercase tracking-wider">
              Essential knowledge regarding drops, bespoke fittings &amp;
              logistics.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-black/8 rounded-2xl overflow-hidden shadow-2xs transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-black">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-300",
                        isOpen ? "rotate-180 text-black" : "",
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-0 font-sans text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-black/5">
                          <p className="pt-3">{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
