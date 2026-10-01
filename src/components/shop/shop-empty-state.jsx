"use client";

import { motion } from "motion/react";
import { RotateCcw, FaceSlightlyFrowning, Ghost } from "lucide-react";

export function ShopEmptyState({ onResetFilters, onSelectCategory }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full py-24 sm:py-32 px-4 flex flex-col items-center justify-center text-center space-y-5"
    >
      <div className="w-12 h-12 rounded-full bg-neutral-200/70 border border-black/10 flex items-center justify-center text-neutral-600">
        <Ghost className="w-5 h-5 stroke-[1.5]" />
      </div>

      <div className="space-y-1.5 max-w-md">
        <h3 className="font-sans text-xl sm:text-2xl font-normal uppercase tracking-tight text-black">
          NO PIECES MATCH YOUR CRITERIA
        </h3>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-neutral-500 leading-relaxed">
          TRY ADJUSTING YOUR FILTERS, CLEARING SEARCH TERMS, OR BROWSING BY
          CATEGORY.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-mono text-xs font-bold uppercase tracking-[0.16em] hover:bg-neutral-800 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET ALL FILTERS</span>
        </button>

        <button
          onClick={() => {
            onResetFilters();
            onSelectCategory("HOODIES");
          }}
          className="px-5 py-3 rounded-full border border-black/15 bg-white text-black font-mono text-xs uppercase tracking-[0.16em] hover:border-black transition-colors cursor-pointer"
        >
          VIEW HOODIES
        </button>
      </div>
    </motion.div>
  );
}
