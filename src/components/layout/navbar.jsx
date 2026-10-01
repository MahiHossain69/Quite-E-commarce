"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Search, ShoppingBag, Menu, User, Heart, X } from "lucide-react";
import { useEffect } from "react";
import { siteConfig } from "@/config/site";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useSiteConfigStore } from "@/store/site-config-store";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { SearchModal } from "@/components/layout/search-modal";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const openCart = useCartStore((state) => state.openCart);
  const totalCount = useCartStore((state) => state.getTotalCount());
  const { user, isAuthenticated } = useAuthStore();
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const { config, initialize: initConfig } = useSiteConfigStore();

  useEffect(() => {
    initConfig();
  }, [initConfig]);

  const announcement = config?.announcement;

  return (
    <>
      {/* Top Announcement Bar from CMS */}
      {!announcementDismissed && announcement?.enabled && announcement?.text && (
        <div className="w-full bg-black text-white font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] py-2 px-4 border-b border-white/10 flex items-center justify-center gap-2 relative">
          <span>{announcement.text}</span>
          {announcement.linkText && (
            <Link
              href={announcement.linkUrl || "/shop"}
              className="no-underline font-bold text-emerald-400 hover:text-emerald-300 ml-1 transition-colors"
            >
              {announcement.linkText} →
            </Link>
          )}
          <button
            onClick={() => setAnnouncementDismissed(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white transition-colors cursor-pointer"
            aria-label="Dismiss announcement"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full z-40 bg-transparent pt-4 sm:pt-5 pb-4 px-6 md:px-8 lg:px-16"
      >
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <div className="flex-1 flex items-center justify-start">
            <Link
              href="/"
              className="font-mono text-sm sm:text-base font-semibold tracking-[0.28em] text-[#111111] hover:opacity-80 transition-opacity select-none"
            >
              {siteConfig.name}
            </Link>
          </div>

          <nav className="hidden lg:flex items-center justify-center gap-7 xl:gap-12">
            {siteConfig.navLinks
              .filter((link) => {
                // Hide LOGIN link entirely from main nav when authenticated
                if (link.label === "LOGIN" && isAuthenticated) return false;
                return true;
              })
              .map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative font-mono text-[11px] xl:text-xs font-normal tracking-[0.2em] text-[#111111] hover:text-black transition-colors group py-1"
                >
                  <span>{link.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
          </nav>

          <div className="flex-1 flex items-center justify-end gap-4 sm:gap-6 md:gap-7">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 font-mono text-[11px] xl:text-xs font-normal tracking-[0.18em] text-[#111111] hover:opacity-70 transition-opacity cursor-pointer"
              aria-label="Search catalog"
            >
              <Search className="w-3.5 h-3.5 stroke-[1.6]" />
              <span className="hidden sm:inline">SEARCH</span>
            </button>

            {isAuthenticated ? (
              <>
                {/* Single unified account link — shows user's first name */}
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 sm:gap-2 font-mono text-[11px] xl:text-xs font-normal tracking-[0.18em] text-[#111111] hover:opacity-70 transition-opacity cursor-pointer"
                  aria-label="Your Account"
                >
                  <User className="w-3.5 h-3.5 stroke-[1.6]" />
                  <span className="hidden sm:inline">
                    {user?.name ? user.name.split(" ")[0].toUpperCase() : "ACCOUNT"}
                  </span>
                </Link>

                {/* Wishlist heart */}
                <Link
                  href="/account"
                  className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] xl:text-xs font-normal tracking-[0.18em] text-[#111111] hover:opacity-70 transition-opacity cursor-pointer relative"
                  aria-label="View Wishlist"
                >
                  <div className="relative flex items-center">
                    <Heart className="w-3.5 h-3.5 stroke-[1.6]" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[8px] font-mono w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Admin badge — only shown for admin/superuser */}
                {(user?.role === "admin" || user?.role === "superuser") && (
                  <Link
                    href="/QuiteadminPan"
                    className="hidden sm:flex items-center gap-1 font-mono text-[10px] xl:text-[10.5px] font-bold tracking-[0.18em] text-emerald-600 hover:text-emerald-700 transition-colors bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg"
                    aria-label="Admin Panel"
                  >
                    <span>ADMIN</span>
                  </Link>
                )}
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 sm:gap-2 font-mono text-[11px] xl:text-xs font-normal tracking-[0.18em] text-[#111111] hover:opacity-70 transition-opacity cursor-pointer"
                aria-label="Login to your account"
              >
                <User className="w-3.5 h-3.5 stroke-[1.6]" />
                <span className="hidden sm:inline">LOGIN</span>
              </Link>
            )}

            <button
              onClick={openCart}
              className="flex items-center gap-1.5 sm:gap-2 font-mono text-[11px] xl:text-xs font-normal tracking-[0.18em] text-[#111111] hover:opacity-70 transition-opacity cursor-pointer relative"
              aria-label="Shopping bag"
            >
              <div className="relative flex items-center">
                <ShoppingBag className="w-3.5 h-3.5 stroke-[1.6]" />
                {totalCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#111111] text-white text-[8px] font-mono w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {totalCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">BAG</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-[#111111] hover:opacity-70 transition-opacity p-1 cursor-pointer"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
