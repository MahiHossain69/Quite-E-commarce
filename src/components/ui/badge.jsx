import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "bg-[#111111] text-white",
    secondary: "bg-black/5 text-[#111111]",
    outline: "border border-black/20 text-[#111111]",
    editorial: "bg-[#111111] text-white text-[9px] tracking-widest px-1.5 py-0.5 rounded-full",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold transition-colors",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  );
}

export { Badge };
