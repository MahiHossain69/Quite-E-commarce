"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function WeBuild({ className }) {
  return (
    <section
      id="philosophy"
      className={cn(
        "relative w-full bg-[#080808] text-white select-none overflow-hidden",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-[5]
                   grid grid-cols-3 grid-rows-8 md:grid-cols-6 md:grid-rows-6"
      >
        {Array.from({ length: 36 }).map((_, idx) => (
          <div
            key={idx}
            className="border-r border-b border-white/[0.045] w-full h-full"
          />
        ))}
      </div>

      <div className="hidden md:flex relative z-10 max-w-[1780px] mx-auto min-h-[820px] md:min-h-[880px] lg:min-h-[1050px] flex-col justify-between py-10 md:py-14 lg:py-20 px-6 md:px-8 lg:px-16">
        {/* Top Header Row */}
        <div className="w-full relative z-30">
          <div className="flex items-center justify-between mb-2">
            <div />
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-neutral-400">
              PHILOSOPHY
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[1200px]"
            >
              <h2 className="text-[26px] sm:text-[32px] md:text-[38px] lg:text-[52px] xl:text-[64px] font-normal tracking-tight uppercase leading-[0.95] text-white">
                <span className="block">WE BUILD FOR PEOPLE WHO ALREADY</span>
                <span className="block md:pl-12 lg:pl-32 text-neutral-200">
                  KNOW WHO THEY ARE NOW
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="shrink-0 pt-2"
            >
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full
                           bg-white text-black font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider
                           hover:bg-neutral-200 transition-all duration-300 shadow-xl active:scale-[0.98]"
              >
                <span>SHOP THE DROP</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Desktop Center Model Image */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-[15] overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[55vw] md:w-[48vw] lg:w-[45vw] xl:w-[38vw] h-[550px] md:h-[650px] lg:h-[820px] max-w-[650px] mt-8"
          >
            <Image
              src="/images/we-build-model.jpg"
              alt="QUIET Philosophy - We Build"
              fill
              priority
              sizes="(max-width: 1200px) 50vw, 40vw"
              className="object-contain object-center filter contrast-[1.06] brightness-[0.98]"
            />
          </motion.div>
        </div>

        {/* Desktop Center Editorial Layer & Technical Data */}
        <div className="relative z-25 w-full my-auto py-8 md:py-12 lg:py-16">
          <div className="grid grid-cols-12 gap-4 items-start">
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="col-span-6 md:col-span-5 lg:col-span-4"
            >
              <p className="font-mono text-[9.5px] md:text-[10px] lg:text-[11px] uppercase tracking-[0.14em] text-neutral-400 leading-relaxed max-w-[320px]">
                BUILT THROUGH SUBTRACTION, NOT ADDITION — WE WORKED IT OVER,
                PIECE BY PIECE, UNTIL THE PERSON INSIDE THE CLOTHES WAS THE ONLY
                THING LEFT WORTH NOTICING
              </p>
            </motion.div>
          </div>

          <div className="w-full my-8 md:my-12 lg:my-18 space-y-3 md:space-y-4 lg:space-y-6">
            <motion.h3
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.9,
                delay: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-[24px] sm:text-[30px] md:text-[38px] lg:text-[48px] xl:text-[58px] font-normal tracking-tight uppercase text-white leading-none text-left"
            >
              AUTHENTICITY OVER AESTHETIC
            </motion.h3>

            <motion.h3
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.9,
                delay: 0.45,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-[24px] sm:text-[30px] md:text-[38px] lg:text-[48px] xl:text-[58px] font-normal tracking-tight uppercase text-white leading-none text-right lg:pr-12"
            >
              FUNCTION OVER FORM
            </motion.h3>
          </div>

          <div className="grid grid-cols-12 gap-4 lg:gap-6 items-end">
            <div className="col-span-3 space-y-4 md:space-y-6">
              <div className="space-y-0.5 md:space-y-1">
                <span className="font-mono text-[9px] md:text-[10px] text-neutral-500 uppercase tracking-widest block">
                  — QUIET. FW26
                </span>
                <span className="font-mono text-[8px] md:text-[9px] text-neutral-600 uppercase tracking-widest block">
                  CRAFT
                </span>
              </div>

              <div>
                <span className="text-lg md:text-xl lg:text-2xl font-mono font-bold text-white block">
                  100%
                </span>
                <span className="font-mono text-[8px] md:text-[9px] text-neutral-400 uppercase tracking-widest block">
                  COTTON / DENIM
                </span>
              </div>
            </div>

            <div className="col-span-3">
              <span className="text-lg md:text-xl lg:text-2xl font-mono font-bold text-white block">
                &lt; 50
              </span>
              <span className="font-mono text-[8px] md:text-[9px] text-neutral-400 uppercase tracking-widest block">
                UNITS PER DROP
              </span>
            </div>

            <div className="col-span-6 flex flex-col items-end text-right space-y-4 md:space-y-6">
              <p className="font-mono text-[9.5px] md:text-[10px] lg:text-[11px] uppercase tracking-[0.14em] text-neutral-400 leading-relaxed max-w-[340px]">
                EVERY PIECE COMES FROM SMALL BATCHES OF FEWER THAN 50, CUT AND
                FINISHED BY HAND. NO SHORTCUTS. NO MASS PRODUCTION — JUST TIME
                SPENT DOING IT PROPERLY
              </p>

              <div className="flex items-center gap-6 md:gap-8">
                <div>
                  <span className="text-base md:text-lg lg:text-xl font-mono font-bold text-white block">
                    HAND
                  </span>
                  <span className="font-mono text-[8px] md:text-[9px] text-neutral-400 uppercase tracking-widest block">
                    FINISHED SEAMS
                  </span>
                </div>

                <div>
                  <span className="text-lg lg:text-xl font-mono font-bold text-white block">
                    FW26
                  </span>
                  <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest block">
                    CURRENT SEASON
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Bottom Giant Headline */}
        <div className="w-full relative z-30 pt-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <h2 className="font-display font-black text-white text-[6vw]! sm:text-[14vw] md:text-[6vw] lg:text-[6vw]  leading-[0.85] tracking-[-0.04em] uppercase select-none">
              <span className="block">NOT MADE</span>
              <span className="block">FOR EVERYONE</span>
            </h2>
          </motion.div>

          <div className="pt-4 flex justify-between items-center text-neutral-600 font-mono text-[9px] uppercase tracking-widest">
            <span>NO TWO SEAMS ALIKE</span>
            <span>QUIET STUDIOS © 2026</span>
          </div>
        </div>
      </div>

      <div className="md:hidden flex flex-col w-full px-5 py-8 space-y-16">
        {/* -- MOBILE SCREEN 1 (Upper Half) ----------------------------------- */}
        <div className="relative min-h-[580px] flex flex-col justify-between pt-2 pb-4">
          {/* Top Title */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="z-20"
          >
            <h2 className="text-[15px] sm:text-[17px] font-normal tracking-tight text-white uppercase leading-tight">
              <span>WE BUILD FOR PEOPLE WHO ALREADY</span>
              <span className="block text-neutral-200">
                KNOW WHO THEY ARE NOW
              </span>
            </h2>
          </motion.div>

          {/* Subtraction Manifesto (Right-aligned) */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="z-20 text-right mt-6 mb-auto"
          >
            <p className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-neutral-400 leading-snug max-w-[230px] ml-auto">
              BUILT THROUGH SUBTRACTION, NOT ADDITION — WE WORKED IT OVER, PIECE
              BY PIECE, UNTIL THE PERSON INSIDE THE CLOTHES WAS THE ONLY THING
              LEFT WORTH NOTICING
            </p>
          </motion.div>

          {/* Background Model Pose */}
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-[10] overflow-hidden"
          >
            <div className="relative w-[85vw] h-[480px] max-w-[340px] opacity-85">
              <Image
                src="/images/we-build-model.jpg"
                alt="Philosophy Look"
                fill
                sizes="85vw"
                className="object-contain object-center filter contrast-[1.08] brightness-[0.92]"
              />
            </div>
          </div>

          {/* Centered CTA Pill Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="z-20 my-6 w-full flex justify-center"
          >
            <Link
              href="/shop"
              className="w-full max-w-[300px] h-11 rounded-full bg-white text-black
                         flex items-center justify-center gap-2
                         font-mono text-[11px] font-bold tracking-wider uppercase
                         hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-xl"
            >
              <span>SHOP THE DROP</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </Link>
          </motion.div>

          {/* Lower Sub-Statement */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="z-20 text-left pt-2"
          >
            <h3 className="text-[13px] font-normal tracking-tight text-white uppercase leading-tight">
              <span className="block">AUTHENTICITY OVER AESTHETIC</span>
              <span className="block text-neutral-300">FUNCTION OVER FORM</span>
            </h3>
          </motion.div>
        </div>

        {/* -- MOBILE SCREEN 2 (Continuation Half) ----------------------------- */}
        <div className="relative min-h-[580px] flex flex-col justify-between pt-4 pb-2 border-t border-white/[0.06]">
          {/* Top Right Small Batch Text */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="z-20 text-right mb-6"
          >
            <p className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-neutral-400 leading-snug max-w-[240px] ml-auto">
              EVERY PIECE COMES FROM SMALL BATCHES OF FEWER THAN 50, CUT AND
              FINISHED BY HAND. NO SHORTCUTS. NO MASS PRODUCTION — JUST TIME
              SPENT DOING IT PROPERLY
            </p>
          </motion.div>

          {/* Scattered Technical Specs Grid */}
          <div className="z-20 grid grid-cols-2 gap-y-8 gap-x-4 my-auto py-6">
            {/* Top Center-Left: < 50 UNITS PER DROP */}
            <div className="col-span-2 text-center pb-2">
              <span className="text-xl font-mono font-bold text-white block">
                &lt; 50
              </span>
              <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest block">
                UNITS PER DROP
              </span>
            </div>

            {/* Mid-Left: HAND FINISHED SEAMS */}
            <div className="text-left">
              <span className="text-lg font-mono font-bold text-white block">
                HAND
              </span>
              <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest block">
                FINISHED SEAMS
              </span>
            </div>

            {/* Mid-Right: 100% COTTON / DENIM */}
            <div className="text-right">
              <span className="text-lg font-mono font-bold text-white block">
                100%
              </span>
              <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest block">
                COTTON / DENIM
              </span>
            </div>

            {/* Lower-Right: FW26 CURRENT SEASON */}
            <div className="col-span-2 text-right pt-2">
              <span className="text-lg font-mono font-bold text-white block">
                FW26
              </span>
              <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest block">
                CURRENT SEASON
              </span>
            </div>
          </div>

          {/* Bottom Left Huge Headline: NOT MADE FOR EVERYONE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="z-20 pt-8"
          >
            <h2 className="font-display font-black text-white text-[6vw]! sm:text-[6vw]! md:text-[6vw]! lg:text-[6vw]! leading-[0.88] tracking-[-0.035em] uppercase text-left">
              <span className="block">NOT MADE</span>
              <span className="block">FOR EVERYONE</span>
            </h2>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
