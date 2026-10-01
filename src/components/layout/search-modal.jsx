"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, ArrowUpRight, X, ArrowRight, Tag, TrendingUp, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { useProductStore } from "@/store/product-store";

// Trending search terms that match DummyJSON fashion categories
const TRENDING_TERMS = [
  { label: "TOPS",       query: "shirt"   },
  { label: "SUNGLASSES", query: "glasses" },
  { label: "DRESSES",    query: "dress"   },
  { label: "SHOES",      query: "shoes"   },
  { label: "BAGS",       query: "bag"     },
  { label: "WATCHES",    query: "watch"   },
];

export function SearchModal({ isOpen, onClose }) {
  const [query,      setQuery]      = useState("");
  const [results,    setResults]    = useState([]);
  const [isSearching,setIsSearching]= useState(false);
  const [hasSearched,setHasSearched]= useState(false);
  const [totalPieces,setTotalPieces]= useState(null);

  const inputRef  = useRef(null);
  const debounceRef = useRef(null);
  const router    = useRouter();
  const addItem   = useCartStore((state) => state.addItem);

  // Fetch total catalog size once on mount
  useEffect(() => {
    fetch("/api/products?limit=1")
      .then((r) => r.json())
      .then((d) => {
        // We need the true total — re-fetch with limit=200 to count
        return fetch("/api/products?limit=200");
      })
      .then((r) => r.json())
      .then((d) => setTotalPieces(d.total ?? d.products?.length ?? null))
      .catch(() => {});
  }, []);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  const { customProducts } = useProductStore();

  // Real-time search with debounce (300ms) against API and custom store
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      const q = query.trim().toLowerCase();
      
      // Filter custom products
      const customMatches = (customProducts || [])
        .filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
        .map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          price: p.price,
          category: p.category,
          gender: p.gender,
          image: p.images?.[0] || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
          sizes: p.sizes || ["S", "M", "L", "XL"],
          colors: p.colors || [{ name: "Washed Black", hex: "#1C1C1C" }],
          tag: p.tags?.[0] || "FEATURED",
          rating: p.rating || 5.0,
        }));

      try {
        const res = await fetch(
          `/api/products?search=${encodeURIComponent(query.trim())}&limit=20`
        );
        const data = await res.json();
        setResults([...customMatches, ...(data.products || [])]);
        setHasSearched(true);
      } catch {
        setResults(customMatches);
        setHasSearched(true);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, customProducts]);

  const handleClose = useCallback(() => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
    setIsSearching(false);
    onClose();
  }, [onClose]);

  const handleTrendingClick = (term) => {
    setQuery(term.query);
  };

  const handleQuickAdd = (product) => {
    addItem({
      id:    product.id,
      name:  product.name,
      price: product.price,
      size:  product.sizes?.[0] || "M",
      image: product.image,
    });
    handleClose();
  };

  const handleViewAllResults = () => {
    router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    handleClose();
  };

  const handleProductClick = () => {
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl bg-[#FAFAFA] border border-black/10 p-0 overflow-hidden gap-0">
        <DialogHeader className="border-b border-black/10 px-6 py-4">
          <DialogTitle className="font-mono text-[10px] uppercase tracking-[0.28em] text-neutral-400">
            CATALOG SEARCH
          </DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="px-6 py-4 border-b border-black/[0.06]">
          <div className="relative flex items-center border-b-2 border-black focus-within:border-black transition-colors">
            {isSearching ? (
              <Loader2 className="w-5 h-5 text-neutral-400 mr-3 stroke-[1.5] shrink-0 animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-neutral-400 mr-3 stroke-[1.5] shrink-0" />
            )}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim()) {
                  handleViewAllResults();
                }
              }}
              placeholder="SEARCH SHIRTS, DRESSES, SHOES..."
              className="w-full bg-transparent py-3 text-sm md:text-base font-mono uppercase tracking-wider text-[#111111] placeholder:text-neutral-400 placeholder:font-sans placeholder:normal-case placeholder:tracking-normal focus:outline-none"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-neutral-400 hover:text-black p-1 transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="px-6 py-5 max-h-[420px] overflow-y-auto">
          {/* Trending Suggestions — shown when not searching */}
          {!hasSearched && !isSearching && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-3 h-3 text-neutral-400 stroke-[1.8]" />
                <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-neutral-400">
                  TRENDING SEARCHES
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TERMS.map((term) => (
                  <button
                    key={term.label}
                    type="button"
                    onClick={() => handleTrendingClick(term)}
                    className="px-3 py-1.5 border border-black/10 hover:border-black font-mono text-[11px] uppercase tracking-wider transition-all bg-white hover:bg-neutral-50 cursor-pointer"
                  >
                    {term.label}
                  </button>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-4 border-t border-black/[0.06] flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-neutral-400" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                    {totalPieces !== null
                      ? `${totalPieces} REAL PIECES IN CATALOG`
                      : "LOADING CATALOG..."}
                  </span>
                </div>
                <Link
                  href="/shop"
                  onClick={handleClose}
                  className="font-mono text-[10px] uppercase tracking-wider text-black hover:opacity-60 transition-opacity ml-auto"
                >
                  BROWSE ALL →
                </Link>
              </div>
            </div>
          )}

          {/* Loading spinner while searching */}
          {isSearching && query.trim().length >= 2 && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
            </div>
          )}

          {/* Search Results */}
          {hasSearched && !isSearching && (
            <div className="space-y-2">
              {/* Results header */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-neutral-400">
                  RESULTS ({results.length})
                </p>
                {results.length > 0 && query.trim() && (
                  <button
                    type="button"
                    onClick={handleViewAllResults}
                    className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-black hover:opacity-60 transition-opacity cursor-pointer"
                  >
                    VIEW ALL IN SHOP
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {results.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-1">
                    NO PIECES FOUND
                  </p>
                  <p className="font-mono text-[10px] text-neutral-400">
                    Try &ldquo;shirt&rdquo;, &ldquo;dress&rdquo;, or &ldquo;shoes&rdquo;
                  </p>
                </div>
              ) : (
                results.slice(0, 6).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 border border-black/[0.06] hover:border-black/20 bg-white transition-all group"
                  >
                    {/* Product Info — navigates to product page */}
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={handleProductClick}
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <div className="relative w-11 h-14 bg-neutral-100 overflow-hidden shrink-0 rounded-sm">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform duration-300"
                          sizes="44px"
                          unoptimized={product.image?.startsWith("http")}
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#111111] truncate">
                          {product.name}
                        </h4>
                        <p className="font-mono text-[10px] text-neutral-500 mt-0.5">
                          ${product.price} USD
                          <span className="mx-1.5 text-neutral-300">•</span>
                          {product.category}
                          {product.tag && (
                            <>
                              <span className="mx-1.5 text-neutral-300">•</span>
                              <span className="text-neutral-400">{product.tag}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </Link>

                    {/* Quick Add */}
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(product)}
                      className="inline-flex items-center gap-1 ml-2 px-3 py-1.5 bg-[#111111] text-white hover:bg-black font-mono text-[10px] uppercase tracking-widest transition-colors cursor-pointer shrink-0 rounded-sm"
                    >
                      ADD
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}

              {/* "View All" footer if more than 6 results */}
              {results.length > 6 && (
                <button
                  type="button"
                  onClick={handleViewAllResults}
                  className="w-full mt-3 py-3 border border-black/10 hover:border-black bg-white font-mono text-[11px] uppercase tracking-widest text-black hover:bg-neutral-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  VIEW ALL {results.length} RESULTS IN SHOP
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-6 py-3 border-t border-black/[0.06] bg-neutral-50/60">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
            PRESS ENTER TO VIEW ALL RESULTS IN SHOP — ESC TO CLOSE
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
