"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export function ShadcnSelect({
  value,
  onValueChange,
  options = [],
  placeholder = "Select an option",
  className,
  id,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || {
    label: value || placeholder,
    value,
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)} id={id}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border font-mono text-xs text-black bg-white transition-all cursor-pointer",
          isOpen
            ? "border-black ring-1 ring-black shadow-xs"
            : "border-black/15 hover:border-black/40 hover:bg-neutral-50/50",
        )}
      >
        <span className="truncate font-semibold">{selectedOption.label || placeholder}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-neutral-500 transition-transform duration-200 shrink-0 ml-2",
            isOpen && "rotate-180 text-black",
          )}
        />
      </button>

      {/* Popover Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 left-0 right-0 mt-1.5 p-1 bg-white border border-black/10 rounded-xl shadow-xl max-h-60 overflow-y-auto font-mono text-xs"
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onValueChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer",
                    isSelected
                      ? "bg-black text-white font-bold"
                      : "text-neutral-700 hover:bg-neutral-100 hover:text-black",
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 ml-2 shrink-0 text-white" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
