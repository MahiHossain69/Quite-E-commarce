"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";

export function CartSheet() {
  const router = useRouter();
  const {
    isOpen,
    closeCart,
    items,
    updateQuantity,
    removeItem,
    getSubtotal,
    getTotalCount,
  } = useCartStore();

  const subtotal = getSubtotal();
  const totalCount = getTotalCount();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="flex flex-col w-full sm:max-w-md bg-[#FAFAFA] border-l border-black/10 p-6 md:p-8"
      >
        <SheetHeader className="border-b border-black/10 pb-4">
          <div className="flex items-center justify-between pr-8">
            <SheetTitle className="font-mono text-xs uppercase tracking-[0.25em] text-[#111111]">
              SHOPPING BAG ({totalCount})
            </SheetTitle>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 rounded-full border border-black/10 flex items-center justify-center mb-4 text-black/40">
              <ShoppingBag className="w-6 h-6 stroke-[1.2]" />
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#111111] mb-2">
              YOUR BAG IS EMPTY
            </p>
            <p className="text-xs text-neutral-500 max-w-[240px] mb-6">
              Explore the latest editorial drop and curated architectural
              garments.
            </p>
            <Button
              variant="default"
              onClick={closeCart}
              className="font-mono text-xs uppercase tracking-[0.18em]"
            >
              EXPLORE COLLECTION
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto divide-y divide-black/5 py-4 -mx-2 px-2">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="py-4 flex gap-4"
                >
                  <div className="relative w-20 h-24 bg-neutral-200/70 overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#111111] leading-snug">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id, item.size)}
                          className="text-neutral-400 hover:text-black transition-colors p-1 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-1 font-mono">
                        SIZE: {item.size}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-black/15 bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, -1)}
                          className="p-1.5 hover:bg-neutral-100 transition-colors text-neutral-600"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 font-mono text-[11px] font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, 1)}
                          className="p-1.5 hover:bg-neutral-100 transition-colors text-neutral-600"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-mono text-xs font-semibold tracking-wider text-[#111111]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-black/10 pt-4 space-y-4">
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-neutral-500">
                  <span>SHIPPING</span>
                  <span>COMPLIMENTARY</span>
                </div>
                <div className="flex justify-between text-sm font-semibold tracking-wider text-[#111111] pt-2 border-t border-black/5">
                  <span>ESTIMATED TOTAL</span>
                  <span>${subtotal.toFixed(2)} USD</span>
                </div>
              </div>

              <Button
                className="w-full h-12 bg-[#111111] text-white hover:bg-black font-mono text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-[0.99]"
                onClick={() => {
                  closeCart();
                  router.push("/checkout");
                }}
              >
                PROCEED TO CHECKOUT
                <ArrowRight className="w-4 h-4" />
              </Button>

              <p className="text-[10px] text-center font-mono uppercase tracking-widest text-neutral-400">
                TAXES CALCULATED AT CHECKOUT • WORLDWIDE EXPRESS
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
