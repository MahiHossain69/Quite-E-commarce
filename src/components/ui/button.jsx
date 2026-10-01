import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const variants = {
      default: "bg-[#181818] text-white hover:bg-black active:scale-[0.98] shadow-sm",
      secondary: "bg-[#f0f0f2] text-[#111111] hover:bg-[#e4e4e7] active:scale-[0.98]",
      outline: "border border-[#111111]/15 bg-transparent hover:bg-black/5 active:scale-[0.98] text-[#111111]",
      ghost: "hover:bg-black/5 text-[#111111]",
      link: "text-[#111111] hover:opacity-70 transition-opacity",
      editorial: "bg-[#111111] text-white tracking-[0.16em] uppercase hover:bg-black transition-all duration-300 active:scale-[0.98]",
    };

    const sizes = {
      default: "h-10 px-5 py-2 text-xs",
      sm: "h-8 px-3 text-[11px]",
      lg: "h-12 px-7 text-xs tracking-[0.18em]",
      icon: "h-9 w-9 p-0 flex items-center justify-center",
      editorial: "h-11 px-6 text-xs",
    };

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[4px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
          variants[variant] || variants.default,
          sizes[size] || sizes.default,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
