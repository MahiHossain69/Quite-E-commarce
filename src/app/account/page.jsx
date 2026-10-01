"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  Truck,
  ArrowRight,
  Clock,
  ShieldCheck,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";

export default function AccountPage() {
  const router = useRouter();

  // Stores
  const {
    user,
    isAuthenticated,
    isInitialized,
    logout,
    updateProfile,
    changePassword,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    recentlyViewed,
  } = useAuthStore();

  const { items: wishlistItems, removeFromWishlist } = useWishlistStore();
  const { addItem: addToCart, openCart } = useCartStore();

  // Active Tab
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "orders" | "wishlist" | "addresses" | "settings"

  // UI States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Profile Form State
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Address Form State
  const [addrLabel, setAddrLabel] = useState("");
  const [addrFullName, setAddrFullName] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrPostal, setAddrPostal] = useState("");
  const [addrCountry, setAddrCountry] = useState("United States");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrDefault, setAddrDefault] = useState(false);

  // Auth Protection: Redirect to /login if unauthenticated
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/login");
    }
  }, [isInitialized, isAuthenticated, router]);

  // Sync profile form inputs with user
  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setProfilePhone(user.phone || "");
    }
  }, [user]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setProfileSaving(true);
    const res = updateProfile({ name: profileName, phone: profilePhone });
    setProfileSaving(false);
    if (res.success) {
      showToast("Profile details updated successfully.");
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    setPasswordSaving(true);
    const res = changePassword({ currentPassword, newPassword });
    setPasswordSaving(false);

    if (res.success) {
      setPasswordSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("Password updated successfully.");
    } else {
      setPasswordError(res.error || "Failed to change password.");
    }
  };

  const openNewAddressModal = () => {
    setEditingAddress(null);
    setAddrLabel("Home");
    setAddrFullName(user?.name || "");
    setAddrStreet("");
    setAddrCity("");
    setAddrState("");
    setAddrPostal("");
    setAddrCountry("United States");
    setAddrPhone(user?.phone || "");
    setAddrDefault(user?.addresses?.length === 0);
    setAddressModalOpen(true);
  };

  const openEditAddressModal = (addr) => {
    setEditingAddress(addr);
    setAddrLabel(addr.label || "Address");
    setAddrFullName(addr.fullName || "");
    setAddrStreet(addr.street || "");
    setAddrCity(addr.city || "");
    setAddrState(addr.state || "");
    setAddrPostal(addr.postalCode || "");
    setAddrCountry(addr.country || "United States");
    setAddrPhone(addr.phone || "");
    setAddrDefault(addr.isDefault || false);
    setAddressModalOpen(true);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const data = {
      label: addrLabel,
      fullName: addrFullName,
      street: addrStreet,
      city: addrCity,
      state: addrState,
      postalCode: addrPostal,
      country: addrCountry,
      phone: addrPhone,
      isDefault: addrDefault,
    };

    if (editingAddress) {
      updateAddress(editingAddress.id, data);
      showToast("Address updated successfully.");
    } else {
      addAddress(data);
      showToast("New address saved.");
    }
    setAddressModalOpen(false);
  };

  const handleMoveToBag = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: product.sizes?.[0] || "M",
      image: product.image,
      quantity: 1,
      sku: `QT-${product.id}`,
    });
    showToast(`Added "${product.name}" to shopping bag.`);
  };

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        size: item.size || "M",
        image: item.image,
        quantity: item.quantity || 1,
        sku: `QT-${item.id}`,
      });
    });
    openCart();
    showToast(`Items from order #${order.id} added to bag.`);
  };

  // Loading skeleton while verifying session
  if (!isInitialized || !user) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              Loading account archive...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const orders = user.orders || [];
  const addresses = user.addresses || [];
  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] flex flex-col justify-between">
      <Navbar />

      {/* Floating Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white px-5 py-3 rounded-lg shadow-2xl font-mono text-xs flex items-center gap-3 border border-white/10"
          >
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pt-28 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* ── Top Header / User Profile Welcome Banner ──────────────── */}
        <section className="bg-white border border-black/8 rounded-2xl p-6 sm:p-8 md:p-10 mb-8 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black text-white flex items-center justify-center font-mono font-bold text-xl sm:text-2xl tracking-wider shadow-sm">
                {user.avatar || "QT"}
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black font-sans uppercase">
                    {user.name}
                  </h1>
                  {/* <span className="font-mono text-[9px] uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 border border-black/10 font-semibold">
                    VIP CLIENT
                  </span> */}
                </div>
                <p className="text-xs sm:text-sm text-neutral-500 font-mono mt-1">
                  {user.email}
                </p>
                <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                  MEMBER SINCE{" "}
                  {new Date(user.createdAt || Date.now())
                    .toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                    .toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
              {(user.role === "admin" || user.role === "superuser") && (
                <Link
                  href="/QuiteadminPan"
                  className="px-4 py-2.5 bg-black text-white hover:bg-neutral-800 rounded-xl font-mono text-[11px] uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-sm font-semibold"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ADMIN PANEL</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
              <Link
                href="/shop"
                className="px-4 py-2.5 border border-black/10 rounded-xl font-mono text-[11px] uppercase tracking-wider text-neutral-800 hover:bg-neutral-50 transition-colors inline-flex items-center gap-2"
              >
                <span>EXPLORE SHOP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 bg-neutral-100 hover:bg-red-50 hover:text-red-600 rounded-xl font-mono text-[11px] uppercase tracking-wider text-neutral-700 transition-colors inline-flex items-center gap-2 cursor-pointer"
                title="Log out of your account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>SIGN OUT</span>
              </button>
            </div>
          </div>

          {(user.role === "admin" || user.role === "superuser") && (
            <div className="mt-6 p-4 rounded-xl bg-neutral-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Administrator Privileges Active
                  </p>
                  <p className="text-[12px] text-neutral-400">
                    You have full access to store telemetry, inventory
                    management, orders, and user permissions.
                  </p>
                </div>
              </div>
              <Link
                href="/QuiteadminPan"
                className="px-4 py-2 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-200 transition-colors inline-flex items-center gap-2 shrink-0"
              >
                <span>Go to Admin Panel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-black/5">
            <button
              onClick={() => setActiveTab("orders")}
              className="text-left p-3.5 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer group"
            >
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">
                TOTAL ORDERS
              </span>
              <span className="text-2xl font-bold font-sans text-black">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("wishlist")}
              className="text-left p-3.5 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer group"
            >
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">
                SAVED IN WISHLIST
              </span>
              <span className="text-2xl font-bold font-sans text-black">
                {wishlistItems.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className="text-left p-3.5 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer group"
            >
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">
                ADDRESSES
              </span>
              <span className="text-2xl font-bold font-sans text-black">
                {addresses.length}
              </span>
            </button>

            <div className="p-3.5 rounded-xl bg-neutral-50/70 border border-black/5">
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">
                TIER STATUS
              </span>
              <span className="text-xs font-mono font-bold text-neutral-800 uppercase tracking-wider block mt-1">
                BLACK ARCHIVE ACCESS
              </span>
            </div>
          </div>
        </section>

        {/* ── Main Navigation Tabs ──────────────────────────────────── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-black/8 scrollbar-none">
          {[
            { id: "overview", label: "OVERVIEW", icon: User },
            { id: "orders", label: `ORDERS (${orders.length})`, icon: Package },
            {
              id: "wishlist",
              label: `WISHLIST (${wishlistItems.length})`,
              icon: Heart,
            },
            {
              id: "addresses",
              label: `ADDRESSES (${addresses.length})`,
              icon: MapPin,
            },
            { id: "settings", label: "SETTINGS", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-[11px] uppercase tracking-[0.16em] whitespace-nowrap transition-all cursor-pointer",
                  isActive
                    ? "bg-black text-white shadow-sm font-semibold"
                    : "bg-white text-neutral-600 hover:text-black hover:bg-neutral-100 border border-black/8",
                )}
              >
                <Icon
                  className={cn(
                    "w-3.5 h-3.5",
                    isActive ? "text-white" : "text-neutral-400",
                  )}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-10">
            {/* Recent Orders Section */}
            <section className="bg-white border border-black/8 rounded-2xl p-6 sm:p-8 shadow-2xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold uppercase tracking-tight text-black font-sans">
                    RECENT ORDERS
                  </h2>
                  <p className="text-xs text-neutral-500 font-mono mt-0.5">
                    Track shipments, view invoices, and reorder past purchases.
                  </p>
                </div>
                {orders.length > 0 && (
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="font-mono text-xs uppercase tracking-wider text-black hover:opacity-70 transition-opacity cursor-pointer"
                  >
                    VIEW ALL ({orders.length})
                  </button>
                )}
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-black/10 rounded-xl">
                  <Package className="w-10 h-10 text-neutral-300 mx-auto mb-3 stroke-[1.2]" />
                  <p className="text-sm font-medium text-neutral-700">
                    No orders placed yet
                  </p>
                  <p className="text-xs text-neutral-400 font-mono mt-1 mb-4">
                    Explore the seasonal collection and place your first order.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl font-mono text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                  >
                    START SHOPPING
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 2).map((order) => (
                    <div
                      key={order.id}
                      className="border border-black/8 rounded-xl p-5 hover:border-black/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-black tracking-wider">
                            #{order.id}
                          </span>
                          <span
                            className={cn(
                              "font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full font-semibold",
                              order.status === "DELIVERED"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : order.status === "IN TRANSIT"
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200",
                            )}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 font-mono">
                          Placed on{" "}
                          {new Date(order.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          • {order.items?.length}{" "}
                          {order.items?.length === 1 ? "item" : "items"}
                        </p>
                      </div>

                      {/* Items Thumbnails */}
                      <div className="flex items-center gap-2">
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="relative w-12 h-14 rounded-lg overflow-hidden border border-black/10 bg-neutral-100 shrink-0"
                            title={item.name}
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ))}
                      </div>

                      {/* Total & Action */}
                      <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-black/5">
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                            TOTAL
                          </span>
                          <span className="font-mono font-bold text-sm text-black">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-4 py-2 border border-black/15 hover:border-black rounded-lg font-mono text-[10.5px] uppercase tracking-wider text-black hover:bg-black hover:text-white transition-all cursor-pointer"
                        >
                          DETAILS
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Wishlist Preview Section */}
            <section className="bg-white border border-black/8 rounded-2xl p-6 sm:p-8 shadow-2xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold uppercase tracking-tight text-black font-sans">
                    WISHLIST PREVIEW
                  </h2>
                  <p className="text-xs text-neutral-500 font-mono mt-0.5">
                    Pieces you have archived for upcoming drops and
                    acquisitions.
                  </p>
                </div>
                {wishlistItems.length > 0 && (
                  <button
                    onClick={() => setActiveTab("wishlist")}
                    className="font-mono text-xs uppercase tracking-wider text-black hover:opacity-70 transition-opacity cursor-pointer"
                  >
                    VIEW ALL ({wishlistItems.length})
                  </button>
                )}
              </div>

              {wishlistItems.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-black/10 rounded-xl">
                  <Heart className="w-8 h-8 text-neutral-300 mx-auto mb-2 stroke-[1.2]" />
                  <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                    Your wishlist is empty
                  </p>
                  <p className="text-xs text-neutral-400 font-mono mt-1 mb-3">
                    Click the heart on any piece to save it here.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block px-4 py-2 bg-black text-white rounded-lg font-mono text-[10.5px] uppercase tracking-wider"
                  >
                    BROWSE PIECES
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {wishlistItems.slice(0, 3).map((product) => (
                    <div
                      key={product.id}
                      className="group border border-black/8 rounded-xl p-3 hover:border-black/20 transition-all flex gap-3.5 bg-neutral-50/40"
                    >
                      <Link
                        href={`/product/${product.slug || product.id}`}
                        className="relative w-20 h-24 rounded-lg overflow-hidden bg-neutral-200 shrink-0"
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      </Link>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block">
                            {product.category}
                          </span>
                          <Link
                            href={`/product/${product.slug || product.id}`}
                            className="font-sans text-xs font-bold text-black uppercase hover:opacity-70 transition-opacity line-clamp-1"
                          >
                            {product.name}
                          </Link>
                          <span className="font-mono text-xs font-semibold text-black block mt-1">
                            ${product.price}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleMoveToBag(product)}
                            className="px-2.5 py-1 bg-black text-white hover:bg-neutral-800 rounded font-mono text-[9.5px] uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            + BAG
                          </button>
                          <button
                            onClick={() => removeFromWishlist(product.id)}
                            className="p-1 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Primary Address & Activity Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Address */}
              <div className="bg-white border border-black/8 rounded-2xl p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold font-sans text-sm uppercase tracking-wider text-black">
                    PRIMARY SHIPPING ADDRESS
                  </h3>
                  <button
                    onClick={() => setActiveTab("addresses")}
                    className="font-mono text-[10.5px] uppercase tracking-wider text-black hover:opacity-70 transition-opacity cursor-pointer"
                  >
                    MANAGE
                  </button>
                </div>
                {defaultAddress ? (
                  <div className="p-4 rounded-xl bg-neutral-50/70 border border-black/5 font-mono text-xs space-y-1 text-neutral-700">
                    <p className="font-bold text-black">
                      {defaultAddress.fullName}
                    </p>
                    <p>{defaultAddress.street}</p>
                    <p>
                      {defaultAddress.city}, {defaultAddress.state}{" "}
                      {defaultAddress.postalCode}
                    </p>
                    <p>{defaultAddress.country}</p>
                    {defaultAddress.phone && (
                      <p className="text-neutral-500 pt-1">
                        {defaultAddress.phone}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-black/10 rounded-xl">
                    <p className="font-mono text-xs text-neutral-400 mb-2">
                      No addresses saved
                    </p>
                    <button
                      onClick={openNewAddressModal}
                      className="px-3 py-1.5 bg-black text-white rounded font-mono text-[10px] uppercase tracking-wider cursor-pointer"
                    >
                      + ADD ADDRESS
                    </button>
                  </div>
                )}
              </div>

              {/* Recently Viewed */}
              {recentlyViewed && recentlyViewed.length > 0 && (
                <div className="bg-white border border-black/8 rounded-2xl p-6 shadow-2xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold font-sans text-sm uppercase tracking-wider text-black flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      RECENTLY VIEWED
                    </h3>
                    <span className="font-mono text-[10px] text-neutral-400">
                      {recentlyViewed.length} ITEM
                      {recentlyViewed.length !== 1 ? "S" : ""}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
                    {recentlyViewed.slice(0, 6).map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug || product.id}`}
                        className="group block"
                      >
                        <div className="aspect-[3/4] relative overflow-hidden rounded-xl bg-neutral-100 mb-2">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <ShoppingBag className="w-6 h-6 text-neutral-300" />
                            </div>
                          )}
                        </div>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-black truncate">
                          {product.name}
                        </p>
                        <p className="font-mono text-[10px] text-neutral-500 mt-0.5">
                          $
                          {product.price?.toFixed
                            ? product.price.toFixed(2)
                            : product.price}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Account Security Overview */}
              <div className="bg-white border border-black/8 rounded-2xl p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold font-sans text-sm uppercase tracking-wider text-black">
                    SECURITY & RECOVERY
                  </h3>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className="font-mono text-[10.5px] uppercase tracking-wider text-black hover:opacity-70 transition-opacity cursor-pointer"
                  >
                    EDIT
                  </button>
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50/70 border border-black/5">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Account Encryption</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50/70 border border-black/5">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-neutral-500" />
                      <span>Last Session Login</span>
                    </div>
                    <span className="text-[10px] text-neutral-500">
                      Just Now
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <section className="bg-white border border-black/8 rounded-2xl p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tight text-black font-sans">
                  ORDER ARCHIVE ({orders.length})
                </h2>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">
                  Detailed logs of all past commissions and purchases.
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-black/10 rounded-xl">
                <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3 stroke-[1.2]" />
                <h3 className="font-bold text-base text-neutral-800">
                  No orders found
                </h3>
                <p className="text-xs text-neutral-400 font-mono mt-1 mb-5">
                  When you place an order, it will appear here with real-time
                  tracking.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl font-mono text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                >
                  START SHOPPING
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-black/10 rounded-2xl overflow-hidden hover:border-black/25 transition-all shadow-2xs"
                  >
                    {/* Header */}
                    <div className="bg-neutral-50/80 px-6 py-4 border-b border-black/5 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div>
                          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                            ORDER PLACED
                          </span>
                          <span className="font-mono text-xs font-semibold text-black">
                            {new Date(order.date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="hidden sm:block w-px h-6 bg-black/10" />
                        <div>
                          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                            ORDER NUMBER
                          </span>
                          <span className="font-mono text-xs font-bold text-black">
                            #{order.id}
                          </span>
                        </div>
                        <div className="hidden sm:block w-px h-6 bg-black/10" />
                        <div>
                          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                            TOTAL AMOUNT
                          </span>
                          <span className="font-mono text-xs font-bold text-black">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "font-mono text-[9.5px] uppercase tracking-widest px-3 py-1 rounded-full font-bold",
                            order.status === "DELIVERED"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800",
                          )}
                        >
                          {order.status}
                        </span>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3.5 py-1.5 bg-white border border-black/15 hover:border-black rounded-lg font-mono text-[10px] uppercase tracking-wider text-black transition-colors cursor-pointer"
                        >
                          VIEW INVOICE
                        </button>
                      </div>
                    </div>

                    {/* Items inside order */}
                    <div className="p-6 divide-y divide-black/5">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-neutral-100 border border-black/10 shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm font-sans uppercase text-black">
                                {item.name}
                              </h4>
                              <p className="font-mono text-xs text-neutral-500 mt-1">
                                Size: {item.size} • Color:{" "}
                                {item.color || "Standard"} • Qty:{" "}
                                {item.quantity}
                              </p>
                              <span className="font-mono text-xs font-semibold text-black block mt-1">
                                ${item.price} each
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-center">
                            <Link
                              href={`/shop`}
                              className="px-3 py-1.5 border border-black/10 hover:border-black rounded-lg font-mono text-[10px] uppercase tracking-wider text-neutral-700 transition-colors"
                            >
                              BUY AGAIN
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tracking & Carrier Info */}
                    {order.trackingNumber && (
                      <div className="bg-neutral-50/50 px-6 py-3 border-t border-black/5 flex items-center justify-between text-xs font-mono text-neutral-600 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Truck className="w-3.5 h-3.5 text-neutral-500" />
                          <span>
                            {order.carrier}:{" "}
                            <strong className="text-black">
                              {order.trackingNumber}
                            </strong>
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-500">
                          {order.estimatedDelivery}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "wishlist" && (
          <section className="bg-white border border-black/8 rounded-2xl p-6 sm:p-8 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tight text-black font-sans">
                  SAVED WISHLIST ({wishlistItems.length})
                </h2>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">
                  Items persist under your account across logins and devices.
                </p>
              </div>

              {wishlistItems.length > 0 && (
                <button
                  onClick={() => {
                    wishlistItems.forEach(handleMoveToBag);
                    openCart();
                  }}
                  className="px-4 py-2.5 bg-black text-white rounded-xl font-mono text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors inline-flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>ADD ALL TO BAG</span>
                </button>
              )}
            </div>

            {wishlistItems.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-black/10 rounded-xl">
                <Heart className="w-12 h-12 text-neutral-300 mx-auto mb-3 stroke-[1.2]" />
                <h3 className="font-bold text-base text-neutral-800">
                  Your wishlist is empty
                </h3>
                <p className="text-xs text-neutral-400 font-mono mt-1 mb-5">
                  Explore our seasonal drops and save pieces for later.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl font-mono text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                >
                  EXPLORE SHOP
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((product) => (
                  <div
                    key={product.id}
                    className="group border border-black/8 rounded-2xl overflow-hidden bg-white hover:border-black/25 transition-all shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      {/* Product Image */}
                      <div className="relative aspect-3/4 bg-neutral-100 overflow-hidden">
                        <Link href={`/product/${product.slug || product.id}`}>
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            unoptimized
                          />
                        </Link>
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          aria-label="Remove from wishlist"
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-black/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block mb-1">
                          {product.category} • {product.gender}
                        </span>
                        <Link
                          href={`/product/${product.slug || product.id}`}
                          className="font-sans font-bold text-sm text-black uppercase hover:opacity-70 transition-opacity line-clamp-1 block"
                        >
                          {product.name}
                        </Link>
                        <span className="font-mono text-sm font-bold text-black block mt-1.5">
                          ${product.price}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 pt-0">
                      <button
                        onClick={() => handleMoveToBag(product)}
                        className="w-full py-2.5 bg-black text-white hover:bg-neutral-800 rounded-xl font-mono text-[10.5px] uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>MOVE TO BAG</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "addresses" && (
          <section className="bg-white border border-black/8 rounded-2xl p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tight text-black font-sans">
                  SAVED ADDRESSES ({addresses.length})
                </h2>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">
                  Manage shipping destinations for swift bespoke delivery.
                </p>
              </div>

              <button
                onClick={openNewAddressModal}
                className="px-4 py-2.5 bg-black text-white rounded-xl font-mono text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>ADD ADDRESS</span>
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-black/10 rounded-xl">
                <MapPin className="w-12 h-12 text-neutral-300 mx-auto mb-3 stroke-[1.2]" />
                <h3 className="font-bold text-base text-neutral-800">
                  No saved addresses
                </h3>
                <p className="text-xs text-neutral-400 font-mono mt-1 mb-5">
                  Save your home or studio address for rapid 1-click checkout.
                </p>
                <button
                  onClick={openNewAddressModal}
                  className="px-5 py-2.5 bg-black text-white rounded-xl font-mono text-xs uppercase tracking-wider cursor-pointer"
                >
                  ADD FIRST ADDRESS
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={cn(
                      "border rounded-2xl p-6 relative transition-all",
                      addr.isDefault
                        ? "border-black bg-neutral-50/50 shadow-xs"
                        : "border-black/10 bg-white hover:border-black/25",
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                        {addr.label || "Address"}
                      </span>
                      {addr.isDefault ? (
                        <span className="font-mono text-[9px] uppercase tracking-widest bg-black text-white px-2.5 py-0.5 rounded-full font-bold">
                          DEFAULT
                        </span>
                      ) : (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 hover:text-black transition-colors cursor-pointer"
                        >
                          SET AS DEFAULT
                        </button>
                      )}
                    </div>

                    <div className="font-mono text-xs text-neutral-700 space-y-1 mb-6">
                      <p className="font-bold text-black">{addr.fullName}</p>
                      <p>{addr.street}</p>
                      <p>
                        {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                      <p>{addr.country}</p>
                      {addr.phone && (
                        <p className="text-neutral-500 pt-1">
                          Tel: {addr.phone}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-black/8">
                      <button
                        onClick={() => openEditAddressModal(addr)}
                        className="font-mono text-[11px] uppercase tracking-wider text-neutral-700 hover:text-black inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>EDIT</span>
                      </button>
                      <span className="text-neutral-300">•</span>
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="font-mono text-[11px] uppercase tracking-wider text-red-500 hover:text-red-700 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>REMOVE</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="bg-white border border-black/8 rounded-2xl p-6 sm:p-8 shadow-2xs">
              <h2 className="text-lg font-bold uppercase tracking-tight text-black font-sans mb-1">
                PERSONAL PROFILE
              </h2>
              <p className="text-xs text-neutral-500 font-mono mb-6">
                Update your identity information and contact details.
              </p>

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-neutral-50 border border-black/10 rounded-xl px-4 py-2.5 text-sm text-black font-sans focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5">
                    EMAIL ADDRESS (AUTHENTICATION ID)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full bg-neutral-100 border border-black/10 rounded-xl px-4 py-2.5 text-sm text-neutral-500 font-mono cursor-not-allowed"
                  />
                  <span className="text-[10px] font-mono text-neutral-400 mt-1 block">
                    Email address cannot be modified once verified.
                  </span>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5">
                    PHONE NUMBER
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full bg-neutral-50 border border-black/10 rounded-xl px-4 py-2.5 text-sm text-black font-mono focus:outline-none focus:border-black"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="px-6 py-2.5 bg-black text-white rounded-xl font-mono text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {profileSaving ? "SAVING..." : "SAVE PROFILE"}
                  </button>
                </div>
              </form>
            </section>

            {/* Change Password Form */}
            <section className="bg-white border border-black/8 rounded-2xl p-6 sm:p-8 shadow-2xs">
              <h2 className="text-lg font-bold uppercase tracking-tight text-black font-sans mb-1">
                SECURITY & PASSWORD
              </h2>
              <p className="text-xs text-neutral-500 font-mono mb-6">
                Ensure your account is protected with a secure password.
              </p>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 font-mono text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 font-mono text-xs">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5">
                    CURRENT PASSWORD
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-neutral-50 border border-black/10 rounded-xl px-4 py-2.5 text-sm text-black font-mono focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5">
                    NEW PASSWORD
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-neutral-50 border border-black/10 rounded-xl px-4 py-2.5 text-sm text-black font-mono focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5">
                    CONFIRM NEW PASSWORD
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-neutral-50 border border-black/10 rounded-xl px-4 py-2.5 text-sm text-black font-mono focus:outline-none focus:border-black"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="px-6 py-2.5 bg-black text-white rounded-xl font-mono text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {passwordSaving ? "UPDATING..." : "UPDATE PASSWORD"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </main>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-black/15 max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-black/10 flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block">
                  ORDER INVOICE
                </span>
                <h3 className="font-bold text-lg font-sans uppercase text-black">
                  ORDER #{selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Status and Date */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-neutral-50 border border-black/5 font-mono text-xs">
                <div>
                  <span className="text-neutral-400 text-[10px] block uppercase">
                    STATUS
                  </span>
                  <span className="font-bold text-black">
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block uppercase">
                    DATE PLACED
                  </span>
                  <span className="text-black">{selectedOrder.date}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block uppercase">
                    SHIPPING
                  </span>
                  <span className="text-black">
                    {selectedOrder.carrier || "Standard"}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h4 className="font-mono text-xs uppercase tracking-wider text-black font-bold">
                  COMMISSIONED PIECES
                </h4>
                <div className="divide-y divide-black/5">
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-neutral-100 border border-black/10 shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <p className="font-bold text-xs uppercase font-sans text-black">
                            {item.name}
                          </p>
                          <p className="font-mono text-[11px] text-neutral-500">
                            Size: {item.size} • Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-black">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div className="border-t border-black/10 pt-4">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-black font-bold mb-2">
                    DESTINATION
                  </h4>
                  <div className="font-mono text-xs text-neutral-600 space-y-0.5">
                    <p className="text-black font-medium">
                      {selectedOrder.shippingAddress.fullName}
                    </p>
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.city}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="border-t border-black/10 pt-4 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>SUBTOTAL</span>
                  <span>${selectedOrder.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>SHIPPING</span>
                  <span>
                    {selectedOrder.shipping === 0
                      ? "COMPLIMENTARY"
                      : `$${selectedOrder.shipping?.toFixed(2)}`}
                  </span>
                </div>
                {selectedOrder.tax > 0 && (
                  <div className="flex justify-between text-neutral-500">
                    <span>ESTIMATED TAX</span>
                    <span>${selectedOrder.tax?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-black font-bold text-sm pt-2 border-t border-black/5">
                  <span>TOTAL PAID</span>
                  <span>${selectedOrder.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 border-t border-black/10 flex items-center justify-end gap-3">
              <button
                onClick={() => handleReorder(selectedOrder)}
                className="px-4 py-2 bg-black text-white rounded-xl font-mono text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                REORDER ALL ITEMS
              </button>
            </div>
          </div>
        </div>
      )}

      {addressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-black/15 max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-black/10 flex items-center justify-between">
              <h3 className="font-bold text-lg font-sans uppercase text-black">
                {editingAddress ? "EDIT ADDRESS" : "ADD NEW ADDRESS"}
              </h3>
              <button
                onClick={() => setAddressModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddressSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">
                    LABEL
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Home, Studio, etc."
                    value={addrLabel}
                    onChange={(e) => setAddrLabel(e.target.value)}
                    className="w-full bg-neutral-50 border border-black/10 rounded-xl px-3 py-2 text-xs font-sans focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">
                    RECIPIENT NAME
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={addrFullName}
                    onChange={(e) => setAddrFullName(e.target.value)}
                    className="w-full bg-neutral-50 border border-black/10 rounded-xl px-3 py-2 text-xs font-sans focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">
                  STREET ADDRESS
                </label>
                <input
                  type="text"
                  required
                  placeholder="Street and apt/suite"
                  value={addrStreet}
                  onChange={(e) => setAddrStreet(e.target.value)}
                  className="w-full bg-neutral-50 border border-black/10 rounded-xl px-3 py-2 text-xs font-sans focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">
                    CITY
                  </label>
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="w-full bg-neutral-50 border border-black/10 rounded-xl px-3 py-2 text-xs font-sans focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">
                    STATE / PROV
                  </label>
                  <input
                    type="text"
                    required
                    value={addrState}
                    onChange={(e) => setAddrState(e.target.value)}
                    className="w-full bg-neutral-50 border border-black/10 rounded-xl px-3 py-2 text-xs font-sans focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">
                    POSTAL CODE
                  </label>
                  <input
                    type="text"
                    required
                    value={addrPostal}
                    onChange={(e) => setAddrPostal(e.target.value)}
                    className="w-full bg-neutral-50 border border-black/10 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">
                    COUNTRY
                  </label>
                  <input
                    type="text"
                    required
                    value={addrCountry}
                    onChange={(e) => setAddrCountry(e.target.value)}
                    className="w-full bg-neutral-50 border border-black/10 rounded-xl px-3 py-2 text-xs font-sans focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">
                    PHONE NUMBER
                  </label>
                  <input
                    type="tel"
                    placeholder="Optional phone"
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    className="w-full bg-neutral-50 border border-black/10 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-neutral-700">
                  <input
                    type="checkbox"
                    checked={addrDefault}
                    onChange={(e) => setAddrDefault(e.target.checked)}
                    className="accent-black w-4 h-4 rounded"
                  />
                  <span>Set as default shipping address</span>
                </label>
              </div>

              <div className="pt-4 border-t border-black/10 flex items-center justify-end gap-3 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="px-4 py-2 text-neutral-500 hover:text-black transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-black text-white rounded-xl font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                >
                  {editingAddress ? "SAVE CHANGES" : "ADD ADDRESS"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
