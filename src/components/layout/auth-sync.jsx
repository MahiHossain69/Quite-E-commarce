"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useWishlistStore } from "@/store/wishlist-store";

export function AuthSync() {
  const initializeAuth = useAuthStore((s) => s.initialize);
  const user = useAuthStore((s) => s.user);
  const syncWishlistUser = useWishlistStore((s) => s.syncUser);

  // Initialize auth session on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Sync wishlist whenever user changes (login / logout)
  useEffect(() => {
    syncWishlistUser(user?.id);
  }, [user?.id, syncWishlistUser]);

  return null;
}
