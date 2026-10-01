"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { useSiteConfigStore } from "@/store/site-config-store";
import { cn } from "@/lib/utils";

export function NextDrop({ className }) {
  const { config, initialize } = useSiteConfigStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const customDrop = config?.nextDrop;
  const leftImg = customDrop?.teaserImage1 || "/images/drop-look-female.jpg";
  const rightImg = customDrop?.teaserImage2 || "/images/drop-look-male.jpg";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <section
      id="next-drop"
      className={cn(
        "relative w-full bg-[#050505] text-white select-none overflow-hidden",
        "py-12 sm:py-16 md:py-20 lg:py-24 px-6 md:px-8 lg:px-16 xl:px-20",
        className,
      )}
    >
      <div className="max-w-[1680px] mx-auto flex flex-col justify-between min-h-[75vh] md:min-h-[80vh] lg:min-h-[780px]">
        <div className="w-full relative mb-10 sm:mb-14 lg:mb-20">
          <div className="flex items-start justify-between">
            {/* Massive Editorial Stepped Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <h2 className="text-[28px] sm:text-[42px] md:text-[52px] lg:text-[76px] xl:text-[88px] font-normal uppercase leading-[0.92] tracking-[-0.03em] font-sans text-white">
                <span className="block">BE FIRST TO KNOW</span>
                <span className="block pl-6 sm:pl-12 md:pl-20 lg:pl-48 xl:pl-64 text-neutral-100">
                  ABOUT THE NEXT DROP
                </span>
              </h2>
            </motion.div>

            {/* Top Right "STAY QUIET" Brand Tag */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden sm:block shrink-0 pt-2 lg:pt-4"
            >
              <span className="font-mono text-[9.5px] sm:text-[10px] lg:text-[11px] uppercase tracking-[0.28em] text-neutral-400 font-medium">
                STAY QUIET
              </span>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center flex-1">
          {/* LEFT COLUMN: Female Model Portrait Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex lg:col-span-3 xl:col-span-3 justify-start"
          >
            <div className="group relative w-full max-w-[320px] xl:max-w-[350px] aspect-[3/4] rounded-2xl overflow-hidden bg-[#dedede] shadow-2xl border border-white/5">
              <Image
                src={leftImg}
                alt="QUIET Drop Look 01"
                fill
                sizes="(max-width: 1280px) 320px, 350px"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* CENTER COLUMN: Tagline & Subscription Form */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:col-span-5 xl:col-span-5 flex flex-col justify-center max-w-[540px] mx-auto lg:mx-0 lg:px-4"
          >
            {/* Subtitle / Promise */}
            <div className="mb-10 sm:mb-12">
              <p className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.18em] text-neutral-300 leading-relaxed">
                NO SPAM. JUST NEW ARRIVALS,
                <br />
                BEFORE ANYONE ELSE SEES THEM
              </p>
            </div>

            {/* Newsletter Subscription Form */}
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSubmit}
                  className="space-y-8 sm:space-y-10"
                >
                  {/* Field: Name */}
                  <div className="relative group">
                    <input
                      id="drop-name"
                      type="text"
                      placeholder="YOUR NAME"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-neutral-800 focus:border-white py-3 sm:py-3.5 text-sm sm:text-base font-mono uppercase tracking-[0.16em] text-white placeholder:text-neutral-500 placeholder:font-mono placeholder:text-xs sm:placeholder:text-[13px] placeholder:tracking-[0.2em] outline-none transition-colors duration-300"
                    />
                  </div>

                  {/* Field: Email */}
                  <div className="relative group">
                    <input
                      id="drop-email"
                      type="email"
                      required
                      placeholder="YOUR@EMAIL.COM"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-neutral-800 focus:border-white py-3 sm:py-3.5 text-sm sm:text-base font-mono uppercase tracking-[0.16em] text-white placeholder:text-neutral-500 placeholder:font-mono placeholder:text-xs sm:placeholder:text-[13px] placeholder:tracking-[0.2em] outline-none transition-colors duration-300"
                    />
                  </div>

                  {/* Field: Phone */}
                  <div className="relative group">
                    <input
                      id="drop-phone"
                      type="tel"
                      placeholder="YOUR PHONE NUMBER"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-neutral-800 focus:border-white py-3 sm:py-3.5 text-sm sm:text-base font-mono uppercase tracking-[0.16em] text-white placeholder:text-neutral-500 placeholder:font-mono placeholder:text-xs sm:placeholder:text-[13px] placeholder:tracking-[0.2em] outline-none transition-colors duration-300"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 sm:pt-6">
                    <button
                      id="drop-subscribe-btn"
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl sm:rounded-xl bg-[#EBEBEB] hover:bg-white text-black font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.18em] transition-all duration-300 active:scale-[0.98] shadow-lg hover:shadow-white/10 cursor-pointer disabled:opacity-50"
                    >
                      <span>{isLoading ? "PROCESSING..." : "SUBSCRIBE"}</span>
                      {!isLoading && (
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      )}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-8 text-left space-y-4"
                >
                  <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <h3 className="font-mono text-sm sm:text-base font-semibold uppercase tracking-wider text-white">
                    YOU ARE ON THE LIST
                  </h3>
                  <p className="font-mono text-xs text-neutral-400 uppercase tracking-widest leading-relaxed">
                    YOU WILL RECEIVE PRIVATE ACCESS 30 MINUTES BEFORE THE PUBLIC
                    DROP.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: "", email: "", phone: "" });
                    }}
                    className="font-mono text-[11px] uppercase tracking-wider text-neutral-400 hover:text-white transition-colors pt-2 cursor-pointer block"
                  >
                    ADD ANOTHER CONTACT
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT COLUMN: Male Model Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex lg:col-span-4 xl:col-span-4 justify-end"
          >
            <div className="group relative w-full max-w-[420px] xl:max-w-[460px] aspect-square rounded-2xl overflow-hidden bg-[#e0e0e0] shadow-2xl border border-white/5">
              <Image
                src={rightImg}
                alt="QUIET Drop Look 02"
                fill
                sizes="(max-width: 1280px) 420px, 460px"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
