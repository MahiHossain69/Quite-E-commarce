"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { ArrowRight, Search, ShoppingBag, X, User } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";

export function MobileMenu({ isOpen, onClose, onOpenSearch }) {
  const openCart = useCartStore((state) => state.openCart);
  const totalCount = useCartStore((state) => state.getTotalCount());

  const handleNavClick = () => {
    onClose();
  };

  const handleSearchClick = () => {
    onClose();
    onOpenSearch();
  };

  const handleCartClick = () => {
    onClose();
    openCart();
  };

  const { user, isAuthenticated } = useAuthStore();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-[#0A0A0A] text-white border-l border-white/10 flex flex-col justify-between p-6 sm:p-8"
      >
        <div>
          <SheetHeader className="border-b border-white/10 pb-6 text-left">
            <div className="flex items-center justify-between pr-8">
              <SheetTitle className="font-mono text-sm tracking-[0.3em] font-semibold text-white">
                {siteConfig.name}
              </SheetTitle>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSearchClick}
                  className="text-white/80 hover:text-white transition-colors p-1"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4 stroke-[1.5]" />
                </button>
                <button
                  onClick={handleCartClick}
                  className="text-white/80 hover:text-white transition-colors p-1 relative"
                  aria-label="Bag"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                  {totalCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 bg-white text-black text-[8px] font-mono w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                      {totalCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </SheetHeader>

          <nav className="mt-10 flex flex-col divide-y divide-white/[0.07]">
            {siteConfig.navLinks.map((link, idx) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={handleNavClick}
                className="group flex items-center justify-between
                           font-mono text-[1.6rem] sm:text-[1.8rem]
                           tracking-[0.1em] font-light
                           text-white/90 hover:text-white
                           transition-colors
                           py-5 sm:py-6"
              >
                <span className="uppercase">{link.label}</span>
                <span className="flex items-center gap-2.5 font-mono text-[11px] text-neutral-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200">
                  0{idx + 1}
                  <span className="text-base leading-none">→</span>
                </span>
              </Link>
            ))}
            {(user?.role === "admin" || user?.role === "superuser") && (
              <Link
                href="/QuiteadminPan"
                onClick={handleNavClick}
                className="group flex items-center justify-between
                           font-mono text-[1.6rem] sm:text-[1.8rem]
                           tracking-[0.1em] font-bold
                           text-emerald-400 hover:text-emerald-300
                           transition-colors
                           py-5 sm:py-6"
              >
                <span className="uppercase">ADMIN PANEL</span>
                <span className="flex items-center gap-2.5 font-mono text-[11px] text-emerald-400 group-hover:translate-x-1 transition-all duration-200">
                  <span className="text-base leading-none">⚡</span>
                </span>
              </Link>
            )}
          </nav>

          <div className="mt-12 pt-8 border-t border-white/10 space-y-3.5">
            <button
              onClick={handleSearchClick}
              className="w-full flex items-center justify-between p-3.5 border border-white/15 hover:border-white font-mono text-xs uppercase tracking-[0.2em] text-white transition-colors text-left bg-white/5"
            >
              <span className="flex items-center gap-2.5">
                <Search className="w-4 h-4 stroke-[1.5]" />
                SEARCH CATALOG
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            <button
              onClick={handleCartClick}
              className="w-full flex items-center justify-between p-3.5 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] hover:bg-neutral-200 transition-colors text-left font-medium"
            >
              <span className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                SHOPPING BAG
              </span>
              <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded-full">
                {totalCount}
              </span>
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col space-y-4">
          <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 tracking-widest uppercase">
            <span>AUTUMN / WINTER 2026</span>
            <span>WORLDWIDE EXPRESS</span>
          </div>
          <p className="font-display font-black text-3xl uppercase tracking-[-0.04em] text-white/10 select-none">
            SPEAK QUIET
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
