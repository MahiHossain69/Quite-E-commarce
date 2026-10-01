"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Search, SlidersHorizontal, Grid2X2, Grid3X3, LayoutGrid, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ShopHeader({
  totalProducts = 0,
  searchQuery = "",
  onSearchChange,
  viewMode = 3,
  onViewModeChange,
  activeFiltersCount = 0,
  onToggleFilterDrawer,
  isFilterDrawerOpen = false,
}) {
  return (
    <div className="w-full border-b border-black/[0.08] bg-[#FAFAFA] pt-8 sm:pt-12 pb-6 px-4 sm:px-8 lg:px-16 xl:px-20">
      <div className="max-w-[1780px] mx-auto space-y-6 sm:space-y-8">
        {/* Top Breadcrumb & Season Eyebrow */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-neutral-400">
            <Link href="/" className="hover:text-black transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span className="text-black font-semibold">COLLECTION ARCHIVE</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[9.5px] sm:text-[10px] uppercase tracking-[0.25em] text-neutral-500 bg-neutral-200/60 px-2.5 py-1 rounded-full border border-black/5">
              SEASON FW26 — SILENT LUXURY
            </span>
          </div>
        </div>

        {/* Massive Editorial Headline & Realtime Counter */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-[32px] sm:text-[48px] md:text-[56px] lg:text-[68px] font-normal uppercase leading-[0.92] tracking-[-0.035em] text-black font-sans"
            >
              ALL PIECES
            </motion.h1>
            <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] text-neutral-500 mt-2">
              ARCHITECTURAL CUTS, MINIMALIST STRUCTURES & UNCOMPROMISING FORM
            </p>
          </div>

          {/* Search Bar & Total Counter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* Live Search Input */}
            <div className="relative flex-1 sm:w-72 md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 stroke-[1.6]" />
              <input
                type="text"
                placeholder="SEARCH PIECES, FABRICS, SIZES..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-black/10 rounded-xl font-mono text-[11px] uppercase tracking-[0.14em] text-black placeholder:text-neutral-400 placeholder:tracking-[0.14em] outline-none focus:border-black transition-colors shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Drawer Trigger (Mobile/Tablet) */}
            <button
              onClick={onToggleFilterDrawer}
              className={cn(
                "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition-all cursor-pointer shadow-xs active:scale-95",
                isFilterDrawerOpen || activeFiltersCount > 0
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black/10 hover:border-black/30"
              )}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.8]" />
              <span>FILTERS</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-black text-[9px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Desktop Grid Switcher (2, 3, 4 cols) */}
            <div className="hidden md:flex items-center bg-white border border-black/10 p-1 rounded-xl shadow-xs">
              <button
                onClick={() => onViewModeChange(2)}
                title="2 Columns"
                className={cn(
                  "p-1.5 rounded-lg transition-colors cursor-pointer",
                  viewMode === 2
                    ? "bg-black text-white"
                    : "text-neutral-400 hover:text-black"
                )}
              >
                <Grid2X2 className="w-4 h-4 stroke-[1.8]" />
              </button>
              <button
                onClick={() => onViewModeChange(3)}
                title="3 Columns"
                className={cn(
                  "p-1.5 rounded-lg transition-colors cursor-pointer",
                  viewMode === 3
                    ? "bg-black text-white"
                    : "text-neutral-400 hover:text-black"
                )}
              >
                <Grid3X3 className="w-4 h-4 stroke-[1.8]" />
              </button>
              <button
                onClick={() => onViewModeChange(4)}
                title="4 Columns"
                className={cn(
                  "p-1.5 rounded-lg transition-colors cursor-pointer",
                  viewMode === 4
                    ? "bg-black text-white"
                    : "text-neutral-400 hover:text-black"
                )}
              >
                <LayoutGrid className="w-4 h-4 stroke-[1.8]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
