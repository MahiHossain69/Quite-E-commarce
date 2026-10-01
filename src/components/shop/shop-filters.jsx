"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, RotateCcw, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Default fallback lists (used if parent doesn't pass them as props)
const DEFAULT_CATEGORIES = [
  { id: "ALL", label: "ALL PIECES" },
  { id: "TOPS", label: "TOPS & SHIRTS" },
  { id: "DRESSES", label: "DRESSES" },
  { id: "FOOTWEAR", label: "FOOTWEAR" },
  { id: "ACCESSORIES", label: "ACCESSORIES" },
];
const DEFAULT_GENDERS   = [
  { id: "ALL", label: "ALL GENDERS" },
  { id: "UNISEX", label: "UNISEX" },
  { id: "MEN", label: "MEN" },
  { id: "WOMEN", label: "WOMEN" },
];
const DEFAULT_SIZES     = ["XS", "S", "M", "L", "XL", "XXL", "ONE SIZE"];
const DEFAULT_COLORS    = [
  { id: "black",   name: "Washed Black",     hex: "#1C1C1C" },
  { id: "charcoal",name: "Phantom Charcoal", hex: "#343434" },
  { id: "bone",    name: "Bone White",       hex: "#F3F1EC" },
  { id: "slate",   name: "Raw Slate",        hex: "#636971" },
  { id: "olive",   name: "Olive Drab",       hex: "#3C4035" },
];
const DEFAULT_SORT = [
  { id: "newest",     label: "NEWEST ARRIVALS" },
  { id: "featured",   label: "EDITORIAL PICKS" },
  { id: "popular",    label: "MOST POPULAR" },
  { id: "price-asc",  label: "PRICE: LOW TO HIGH" },
  { id: "price-desc", label: "PRICE: HIGH TO LOW" },
];

export function ShopFilters({
  // Data lists (can be overridden by parent for API-driven data)
  categoriesList = DEFAULT_CATEGORIES,
  gendersList    = DEFAULT_GENDERS,
  sizesList      = DEFAULT_SIZES,
  colorsList     = DEFAULT_COLORS,
  sortOptions    = DEFAULT_SORT,
  // State
  selectedCategory = "ALL",
  onSelectCategory,
  selectedGender = "ALL",
  onSelectGender,
  selectedSizes = [],
  onToggleSize,
  selectedColors = [],
  onToggleColor,
  priceRange = [0, 1500],
  onPriceChange,
  selectedSort = "newest",
  onSelectSort,
  onResetFilters,
  activeFiltersCount = 0,
  isDrawerOpen = false,
  onCloseDrawer,
  totalCount = 0,
}) {
  return (
    <>
      {/* ====================================================================
          CATEGORY PILLS BAR (Horizontal Scrollable Strip)
          ==================================================================== */}
      <div className="w-full border-b border-black/[0.06] bg-[#FAFAFA] sticky top-0 z-30 backdrop-blur-md bg-[#FAFAFA]/90">
        <div className="max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-20 py-3.5 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          {/* Categories Pill Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {categoriesList.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full font-mono text-[10.5px] uppercase tracking-[0.16em] transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-95",
                    isActive
                      ? "bg-black text-white shadow-sm font-semibold"
                      : "bg-white text-neutral-600 hover:text-black hover:bg-neutral-100 border border-black/8"
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown & Reset Action */}
          <div className="flex items-center gap-3 shrink-0">
            {activeFiltersCount > 0 && (
              <button
                onClick={onResetFilters}
                className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-neutral-500 hover:text-black cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>RESET ({activeFiltersCount})</span>
              </button>
            )}

            <Select value={selectedSort} onValueChange={onSelectSort}>
              <SelectTrigger className="w-[170px] sm:w-[190px] h-8 rounded-full border-black/10 bg-white px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-black shadow-2xs hover:border-black/30">
                <SelectValue placeholder="SORT BY" />
              </SelectTrigger>
              <SelectContent align="end" className="min-w-[190px]">
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ====================================================================
          EXPANDABLE FILTER DRAWER (Modal / Slide-over)
          ==================================================================== */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseDrawer}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            />

            {/* Slide-out Panel */}
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-screen max-w-md bg-white p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto"
              >
                <div className="space-y-8">
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-black/10">
                    <div className="flex items-center gap-2">
                      <h3 className="font-sans text-lg font-semibold uppercase tracking-tight text-black">
                        FILTERS
                      </h3>
                      {activeFiltersCount > 0 && (
                        <span className="font-mono text-[10px] bg-black text-white px-2 py-0.5 rounded-full">
                          {activeFiltersCount} ACTIVE
                        </span>
                      )}
                    </div>
                    <button
                      onClick={onCloseDrawer}
                      className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Filter Section: Gender */}
                  <div className="space-y-3">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-900 block">
                      GENDER
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {gendersList.map((g) => {
                        const isSelected = selectedGender === g.id;
                        return (
                          <button
                            key={g.id}
                            onClick={() => onSelectGender(g.id)}
                            className={cn(
                              "py-2 px-3 rounded-lg font-mono text-[11px] uppercase tracking-[0.14em] text-center border transition-all cursor-pointer",
                              isSelected
                                ? "bg-black text-white border-black font-semibold shadow-xs"
                                : "bg-white text-neutral-600 border-black/10 hover:border-black/30"
                            )}
                          >
                            {g.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Filter Section: Sizes */}
                  <div className="space-y-3">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-900 block">
                      AVAILABLE SIZES
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {sizesList.map((s) => {
                        const isSelected = selectedSizes.includes(s);
                        return (
                          <button
                            key={s}
                            onClick={() => onToggleSize(s)}
                            className={cn(
                              "py-2 font-mono text-[11px] font-semibold uppercase text-center rounded-lg border transition-all cursor-pointer",
                              isSelected
                                ? "bg-black text-white border-black shadow-xs"
                                : "bg-white text-neutral-700 border-black/10 hover:border-black/30"
                            )}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Filter Section: Colors */}
                  <div className="space-y-3">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-900 block">
                      PALETTE / COLOR
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {colorsList.map((c) => {
                        const isSelected = selectedColors.includes(c.name);
                        return (
                          <button
                            key={c.name}
                            onClick={() => onToggleColor(c.name)}
                            className={cn(
                              "flex items-center gap-2.5 p-2 rounded-lg border transition-all cursor-pointer text-left",
                              isSelected
                                ? "border-black bg-neutral-50 shadow-xs"
                                : "border-black/10 hover:border-black/25 bg-white"
                            )}
                          >
                            <span
                              className="w-4 h-4 rounded-full border border-black/20 flex items-center justify-center shrink-0"
                              style={{ backgroundColor: c.hex }}
                            >
                              {isSelected && (
                                <Check
                                  className={cn(
                                    "w-2.5 h-2.5",
                                    c.hex === "#F3F1EC" ? "text-black" : "text-white"
                                  )}
                                />
                              )}
                            </span>
                            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-neutral-800 truncate">
                              {c.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Filter Section: Price Range */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-900">
                        MAX PRICE
                      </span>
                      <span className="font-mono text-xs font-bold text-black">
                        ${priceRange[1]}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="1500"
                      step="50"
                      value={priceRange[1]}
                      onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
                      className="w-full accent-black cursor-pointer"
                    />
                    <div className="flex items-center justify-between font-mono text-[10px] text-neutral-400">
                      <span>$100</span>
                      <span>$750</span>
                      <span>$1,500+</span>
                    </div>
                  </div>
                </div>

                {/* Drawer Footer Actions */}
                <div className="pt-8 border-t border-black/10 mt-8 space-y-2">
                  <button
                    onClick={onCloseDrawer}
                    className="w-full py-3.5 bg-black text-white font-mono text-xs font-bold uppercase tracking-[0.18em] rounded-xl hover:bg-neutral-800 transition-colors shadow-lg cursor-pointer"
                  >
                    SHOW RESULTS ({totalCount})
                  </button>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={onResetFilters}
                      className="w-full py-2.5 text-neutral-500 hover:text-black font-mono text-[11px] uppercase tracking-[0.16em] cursor-pointer"
                    >
                      RESET ALL FILTERS
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
