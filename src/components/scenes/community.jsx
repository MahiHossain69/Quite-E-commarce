"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Community({ className }) {
  const communityData = siteConfig.community || {
    tag: "COMMUNITY",
    seasonTag: "FW25 — SILENT COLLECTION",
    image: "/images/community-model.jpg",
  };

  const q1 = {
    text: "I DON'T DRESS FOR ANYONE. I DRESS LIKE I ALREADY KNOW WHO I AM",
    author: "— WORN QUIET",
  };
  const q2 = {
    text: "NOTHING HERE TRIES TO PROVE ITSELF. THAT IS EXACTLY THE POINT",
    author: "— WORN QUIET",
  };
  const q3 = {
    text: "THIS IS THE ONE PIECE THAT NEEDS NO STORY ATTACHED TO IT",
    author: "— WORN QUIET",
  };
  const q4 = {
    text: "NOTHING HERE SCREAMS FOR ATTENTION. THAT'S WHY I CHOSE IT",
    author: "— WORN QUIET",
  };

  return (
    <section
      id="community"
      className={cn(
        "relative w-full bg-[#000000] text-white select-none overflow-hidden",
        "min-h-[85vh] lg:min-h-[92vh] flex flex-col justify-between",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-[10] overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[920px] h-full min-h-[600px] lg:min-h-[750px]"
        >
          <Image
            src={communityData.image}
            alt="QUIET Community Lookbook"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 65vw"
            className="object-contain lg:object-cover object-center filter contrast-[1.08] brightness-[0.88]"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black opacity-85" />
        </motion.div>
      </div>

      <div className="hidden md:flex relative z-20 w-full max-w-[1780px] mx-auto min-h-[80vh] md:min-h-[85vh] lg:min-h-[92vh] flex-col justify-between py-8 md:py-10 lg:py-14 px-6 md:px-8 lg:px-16 pointer-events-none">
        <div className="w-full flex items-start justify-between">
          <div className="space-y-8 md:space-y-12 lg:space-y-16 max-w-[280px] md:max-w-[320px] lg:max-w-[420px] pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="font-mono text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.25em] text-neutral-500">
                {communityData.tag}
              </span>
            </motion.div>

            {/* Quote 1 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="space-y-2 group cursor-default"
            >
              <h3 className="font-sans font-normal text-[13px] sm:text-[15px] md:text-[16px] lg:text-[21px] xl:text-[23px] tracking-tight uppercase leading-[1.12] text-white transition-opacity duration-300 group-hover:opacity-80">
                <span>I DON&apos;T DRESS FOR ANYONE. I DRESS</span>
                <span className="block">LIKE I ALREADY KNOW WHO I AM</span>
              </h3>
              <span className="font-mono text-[8.5px] md:text-[9px] xl:text-[10px] uppercase tracking-[0.2em] text-neutral-500 block">
                {q1.author}
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[280px] md:max-w-[320px] lg:max-w-[440px] pt-6 md:pt-10 text-left pointer-events-auto space-y-2 group cursor-default"
          >
            <h3 className="font-sans font-normal text-[13px] sm:text-[15px] md:text-[16px] lg:text-[21px] xl:text-[23px] tracking-tight uppercase leading-[1.12] text-white transition-opacity duration-300 group-hover:opacity-80">
              <span>NOTHING HERE TRIES TO PROVE</span>
              <span className="block">ITSELF. THAT IS EXACTLY THE POINT</span>
            </h3>
            <span className="font-mono text-[8.5px] md:text-[9px] xl:text-[10px] uppercase tracking-[0.2em] text-neutral-500 block">
              {q2.author}
            </span>
          </motion.div>
        </div>

        <div className="w-full flex items-end justify-between pt-10 md:pt-14 lg:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[280px] md:max-w-[320px] lg:max-w-[420px] pointer-events-auto space-y-2 group cursor-default"
          >
            <h3 className="font-sans font-normal text-[13px] sm:text-[15px] md:text-[16px] lg:text-[21px] xl:text-[23px] tracking-tight uppercase leading-[1.12] text-white transition-opacity duration-300 group-hover:opacity-80">
              <span>NOTHING HERE SCREAMS FOR</span>
              <span className="block">
                ATTENTION. THAT&apos;S WHY I CHOSE IT
              </span>
            </h3>
            <span className="font-mono text-[8.5px] md:text-[9px] xl:text-[10px] uppercase tracking-[0.2em] text-neutral-500 block">
              {q4.author}
            </span>
          </motion.div>

          <div className="flex flex-col items-end gap-6 md:gap-10 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.45,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="max-w-[280px] md:max-w-[320px] lg:max-w-[440px] text-left space-y-2 group cursor-default"
            >
              <h3 className="font-sans font-normal text-[13px] sm:text-[15px] md:text-[16px] lg:text-[21px] xl:text-[23px] tracking-tight uppercase leading-[1.12] text-white transition-opacity duration-300 group-hover:opacity-80">
                <span>THIS IS THE ONE PIECE THAT</span>
                <span className="block">NEEDS NO STORY ATTACHED TO IT</span>
              </h3>
              <span className="font-mono text-[8.5px] md:text-[9px] xl:text-[10px] uppercase tracking-[0.2em] text-neutral-500 block">
                {q3.author}
              </span>
            </motion.div>

            {/* Season Tag */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="text-right"
            >
              <span className="font-mono text-[9px] md:text-[9.5px] uppercase tracking-[0.22em] text-neutral-500">
                {communityData.seasonTag}
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          MOBILE RESPONSIVE LAYOUT (md:hidden)
          Exact match to the mobile phone mockup:
          - Top-Left: "COMMUNITY"
          - Stacked staggered quotes down the screen
          - Bottom-Right: "FW25 — SILENT COLLECTION"
          ==================================================================== */}
      <div className="md:hidden relative z-20 w-full px-5 py-8 flex flex-col justify-between min-h-[660px]">
        {/* Mobile Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-neutral-500">
            {communityData.tag}
          </span>
        </motion.div>

        {/* 4 Quotes Staggered Flow */}
        <div className="my-auto py-8 space-y-9">
          {/* Quote 1: Top-Left */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-left max-w-[280px] space-y-1.5"
          >
            <h3 className="font-sans font-normal text-[13.5px] tracking-tight uppercase leading-[1.2] text-white">
              <span>I DON&apos;T DRESS FOR ANYONE. I DRESS</span>
              <span className="block">LIKE I ALREADY KNOW WHO I AM</span>
            </h3>
            <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-neutral-500 block">
              {q1.author}
            </span>
          </motion.div>

          {/* Quote 2: Mid-Right */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-right max-w-[290px] ml-auto space-y-1.5"
          >
            <h3 className="font-sans font-normal text-[13.5px] tracking-tight uppercase leading-[1.2] text-white">
              <span>NOTHING HERE TRIES TO PROVE</span>
              <span className="block">ITSELF. THAT IS EXACTLY THE POINT</span>
            </h3>
            <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-neutral-500 block">
              {q2.author}
            </span>
          </motion.div>

          {/* Quote 3: Mid-Left */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-left max-w-[280px] space-y-1.5"
          >
            <h3 className="font-sans font-normal text-[13.5px] tracking-tight uppercase leading-[1.2] text-white">
              <span>THIS IS THE ONE PIECE THAT</span>
              <span className="block">NEEDS NO STORY ATTACHED TO IT</span>
            </h3>
            <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-neutral-500 block">
              {q3.author}
            </span>
          </motion.div>

          {/* Quote 4: Bottom-Right */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-right max-w-[290px] ml-auto space-y-1.5"
          >
            <h3 className="font-sans font-normal text-[13.5px] tracking-tight uppercase leading-[1.2] text-white">
              <span>NOTHING HERE SCREAMS FOR</span>
              <span className="block">
                ATTENTION. THAT&apos;S WHY I CHOSE IT
              </span>
            </h3>
            <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-neutral-500 block">
              {q4.author}
            </span>
          </motion.div>
        </div>

        {/* Mobile Season Tag */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-right pt-2"
        >
          <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-neutral-500">
            {communityData.seasonTag}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
