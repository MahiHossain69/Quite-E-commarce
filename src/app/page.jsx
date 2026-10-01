"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/scenes/hero";
import { NewArrivals } from "@/components/scenes/new-arrivals";
import { ProductSpotlight } from "@/components/scenes/product-spotlight";
import { ShopByCategory } from "@/components/scenes/shop-by-category";
import { Community } from "@/components/scenes/community";
import { WeBuild } from "@/components/scenes/we-build";
import { NextDrop } from "@/components/scenes/next-drop";
import { Footer } from "@/components/layout/footer";
import { siteConfig } from "@/config/site";
import { useSiteConfigStore } from "@/store/site-config-store";

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { config, initialize } = useSiteConfigStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const heroCfg = config?.hero;

  const images = [
    {
      id: "1",
      path: heroCfg?.heroImage1 || heroCfg?.heroImage || "/images/hero-fashion.jpg",
      label: "Campaign Cut 01",
    },
    {
      id: "2",
      path: heroCfg?.heroImage2 || "/images/hero-fashion-2.jpg",
      label: "Campaign Cut 02",
    },
    {
      id: "3",
      path: heroCfg?.heroImage3 || "/images/hero-fashion-3.jpg",
      label: "Campaign Cut 03",
    },
  ];

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <main className="relative w-full min-h-screen flex flex-col justify-start bg-[#FAFAFA]">
      <Navbar />

      <Hero image={images[currentImageIndex].path} ctaLink="#new-arrivals" />

      <NewArrivals />

      <WeBuild />

      <ShopByCategory />

      <Community />

      <ProductSpotlight />

      <NextDrop />

      <Footer />

      <div className="fixed bottom-4 right-4 z-40 hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-md border border-black/10 px-3 py-1.5 rounded-full shadow-sm">
        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 flex items-center gap-1.5">
          CAMPAIGN CUT ({currentImageIndex + 1}/{images.length})
        </span>
        <button
          onClick={handleNextImage}
          className="font-mono text-[10px] font-semibold uppercase tracking-wider bg-[#111111] text-white hover:bg-black px-2 py-0.5 rounded-full transition-colors cursor-pointer"
        >
          SWITCH LOOK
        </button>
      </div>
    </main>
  );
}
