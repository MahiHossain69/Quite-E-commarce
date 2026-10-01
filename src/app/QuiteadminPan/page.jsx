"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Truck,
  Eye,
  Settings,
  Lock,
  Search,
  ChevronRight,
  AlertCircle,
  Clock,
  LogOut,
  RefreshCw,
  SlidersHorizontal,
  ArrowUpRight,
  Layers,
  ShoppingBag,
  Upload,
  Image as ImageIcon,
  X,
  Check,
} from "lucide-react";

import { useAuthStore } from "@/store/auth-store";
import { useProductStore } from "@/store/product-store";
import { useSiteConfigStore } from "@/store/site-config-store";
import { ShadcnSelect } from "@/components/ui/shadcn-select";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const router = useRouter();

  // Stores
  const {
    user,
    isAuthenticated,
    isInitialized,
    login,
    getAllUsers,
    getAllOrders,
    updateOrderStatus,
    toggleUserRole,
    deleteUserAccount,
  } = useAuthStore();

  const {
    customProducts,
    initialize: initProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleFeatured,
  } = useProductStore();

  // Active Tab: "overview" | "products" | "orders" | "users" | "settings"
  const [activeTab, setActiveTab] = useState("overview");

  // Local Data State
  const [usersList, setUsersList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // Modals & Form State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Product Form Input
  const [pName, setPName] = useState("");
  const [pCategory, setPCategory] = useState("HOODIES");
  const [pGender, setPGender] = useState("UNISEX");
  const [pPrice, setPPrice] = useState("");
  const [pOriginalPrice, setPOriginalPrice] = useState("");
  const [pStock, setPStock] = useState("20");
  const [pImage, setPImage] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pFeatured, setPFeatured] = useState(true);

  // Image Upload State
  const [imageInputMode, setImageInputMode] = useState("device"); // "device" | "url"
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // File Upload Helper (converts to base64 with canvas optimization for snappy localStorage)
  const handleFileUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (JPEG, PNG, WEBP, etc.).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawResult = e.target.result;
      const img = new window.Image();
      img.onload = () => {
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.88);
        setPImage(optimizedDataUrl);
        showToast("Image loaded from device.");
      };
      img.onerror = () => {
        setPImage(rawResult);
        showToast("Image loaded.");
      };
      img.src = rawResult;
    };
    reader.readAsDataURL(file);
  };

  // Order Status Edit Input
  const [orderStatus, setOrderStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");

  // Search / Filters
  const [userSearch, setUserSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("ALL");
  const [productSearch, setProductSearch] = useState("");

  // Auth Guard — redirect non-admins away
  useEffect(() => {
    if (!isInitialized) return;
    const isAdmin =
      user && (user.role === "admin" || user.role === "superuser");
    if (!isAuthenticated || !isAdmin) {
      router.replace("/login");
    }
  }, [isInitialized, isAuthenticated, user, router]);

  // Site Config Store (Storefront CMS)
  const {
    config: siteConfigData,
    initialize: initSiteConfig,
    updateSection: updateSiteConfigSection,
    resetSection: resetSiteConfigSection,
    resetAllToDefault: resetAllSiteConfig,
  } = useSiteConfigStore();

  useEffect(() => {
    initSiteConfig();
  }, [initSiteConfig]);

  // CMS Form States
  const [cmsHeroBadge, setCmsHeroBadge] = useState("");
  const [cmsHeroH1, setCmsHeroH1] = useState("");
  const [cmsHeroH2, setCmsHeroH2] = useState("");
  const [cmsHeroDesc, setCmsHeroDesc] = useState("");
  const [cmsHeroImage, setCmsHeroImage] = useState("");
  const [cmsHeroImage1, setCmsHeroImage1] = useState("");
  const [cmsHeroImage2, setCmsHeroImage2] = useState("");
  const [cmsHeroImage3, setCmsHeroImage3] = useState("");
  // Per-image input mode tracking ("device" | "url") for the 3 campaign cuts
  const [heroImgMode1, setHeroImgMode1] = useState("device");
  const [heroImgMode2, setHeroImgMode2] = useState("device");
  const [heroImgMode3, setHeroImgMode3] = useState("device");

  const [cmsNewArrTitle, setCmsNewArrTitle] = useState("");
  const [cmsNewArrImage, setCmsNewArrImage] = useState("");

  const [cmsSpotlightTitle, setCmsSpotlightTitle] = useState("");
  const [cmsSpotlightName, setCmsSpotlightName] = useState("");
  const [cmsSpotlightDesc, setCmsSpotlightDesc] = useState("");
  const [cmsSpotlightImage, setCmsSpotlightImage] = useState("");
  const [cmsSpotlightDetail1, setCmsSpotlightDetail1] = useState("");
  const [cmsSpotlightDetail2, setCmsSpotlightDetail2] = useState("");

  const [cmsNextDropTag, setCmsNextDropTag] = useState("");
  const [cmsNextDropName, setCmsNextDropName] = useState("");
  const [cmsNextDropLeftImg, setCmsNextDropLeftImg] = useState("");
  const [cmsNextDropRightImg, setCmsNextDropRightImg] = useState("");

  const [cmsAnnouncementText, setCmsAnnouncementText] = useState("");
  const [cmsAnnouncementEnabled, setCmsAnnouncementEnabled] = useState(true);

  // Sync CMS state with loaded config
  useEffect(() => {
    if (siteConfigData) {
      if (siteConfigData.hero) {
        setCmsHeroBadge(siteConfigData.hero.badge || "");
        setCmsHeroH1(siteConfigData.hero.headlineLine1 || "");
        setCmsHeroH2(siteConfigData.hero.headlineLine2 || "");
        setCmsHeroDesc(siteConfigData.hero.subheading || "");
        setCmsHeroImage(siteConfigData.hero.heroImage || "");
        setCmsHeroImage1(siteConfigData.hero.heroImage1 || "");
        setCmsHeroImage2(siteConfigData.hero.heroImage2 || "");
        setCmsHeroImage3(siteConfigData.hero.heroImage3 || "");
      }
      if (siteConfigData.newArrivals) {
        setCmsNewArrTitle(siteConfigData.newArrivals.sectionTitle || "");
        setCmsNewArrImage(siteConfigData.newArrivals.featuredPieceImage || "");
      }
      if (siteConfigData.spotlight) {
        setCmsSpotlightTitle(siteConfigData.spotlight.tagline || "");
        setCmsSpotlightName(siteConfigData.spotlight.productName || "");
        setCmsSpotlightDesc(siteConfigData.spotlight.description || "");
        setCmsSpotlightImage(siteConfigData.spotlight.primaryImage || "");
        setCmsSpotlightDetail1(siteConfigData.spotlight.detailImage1 || "");
        setCmsSpotlightDetail2(siteConfigData.spotlight.detailImage2 || "");
      }
      if (siteConfigData.nextDrop) {
        setCmsNextDropTag(siteConfigData.nextDrop.dropNumber || "");
        setCmsNextDropName(siteConfigData.nextDrop.dropName || "");
        setCmsNextDropLeftImg(siteConfigData.nextDrop.teaserImage1 || "");
        setCmsNextDropRightImg(siteConfigData.nextDrop.teaserImage2 || "");
      }
      if (siteConfigData.announcement) {
        setCmsAnnouncementText(siteConfigData.announcement.text || "");
        setCmsAnnouncementEnabled(!!siteConfigData.announcement.enabled);
      }
    }
  }, [siteConfigData]);

  // Rehydrate & Load Data
  useEffect(() => {
    initProducts();
  }, [initProducts]);

  const refreshAdminData = () => {
    setUsersList(getAllUsers());
    setOrdersList(getAllOrders());
  };

  useEffect(() => {
    if (isInitialized) {
      refreshAdminData();
    }
  }, [isInitialized]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Quick Superuser Escalation for Demo / Testing
  const handleElevateToSuperuser = async () => {
    const res = await login({
      email: "admin@quiet.com",
      password: "admin@2026!",
    });
    if (res.success) {
      refreshAdminData();
      showToast("Authenticated as Superuser (admin@quiet.com)");
    } else {
      showToast("Superuser elevation failed.");
    }
  };

  const isSuperUser =
    user && (user.role === "admin" || user.role === "superuser");

  // Product Form Handlers
  const openNewProductModal = () => {
    setEditingProduct(null);
    setPName("");
    setPCategory("HOODIES");
    setPGender("UNISEX");
    setPPrice("");
    setPOriginalPrice("");
    setPStock("20");
    setPImage("");
    setPDesc("");
    setPFeatured(true);
    setImageInputMode("device");
    setProductModalOpen(true);
  };

  const openEditProductModal = (prod) => {
    setEditingProduct(prod);
    setPName(prod.name || "");
    setPCategory(prod.category || "HOODIES");
    setPGender(prod.gender || "UNISEX");
    setPPrice(prod.price ? String(prod.price) : "");
    setPOriginalPrice(prod.originalPrice ? String(prod.originalPrice) : "");
    setPStock(prod.stock !== undefined ? String(prod.stock) : "20");
    setPImage(prod.images?.[0] || "");
    setPDesc(prod.description || "");
    setPFeatured(!!prod.featured);
    setImageInputMode(prod.images?.[0]?.startsWith("data:") ? "device" : "url");
    setProductModalOpen(true);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!pName || !pPrice) {
      showToast("Please provide product name and price.");
      return;
    }

    const payload = {
      name: pName,
      category: pCategory,
      gender: pGender,
      price: pPrice,
      originalPrice: pOriginalPrice || null,
      stock: pStock,
      images: pImage
        ? [pImage]
        : [
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
          ],
      description: pDesc,
      featured: pFeatured,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      showToast(`Updated product "${pName}"`);
    } else {
      addProduct(payload);
      showToast(`Created product "${pName}"`);
    }

    setProductModalOpen(false);
  };

  const handleDeleteProduct = (id, name) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
      showToast(`Deleted product "${name}"`);
    }
  };

  // Order Update Handlers
  const openOrderEditModal = (ord) => {
    setSelectedOrder(ord);
    setOrderStatus(ord.status || "PROCESSING");
    setTrackingNumber(ord.trackingNumber || "");
    setCarrier(ord.carrier || "DHL Express");
    setOrderModalOpen(true);
  };

  const handleOrderSave = (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    updateOrderStatus(selectedOrder.id, {
      status: orderStatus,
      trackingNumber,
      carrier,
    });

    refreshAdminData();
    showToast(`Updated Order ${selectedOrder.id} status to ${orderStatus}`);
    setOrderModalOpen(false);
  };

  // User Role Handlers
  const handleToggleRole = (userId, currentRole, userEmail) => {
    if (
      userEmail?.toLowerCase() === "admin@quiet.com" ||
      currentRole === "superuser"
    ) {
      showToast("Superuser permissions cannot be demoted.");
      return;
    }
    const res = toggleUserRole(userId);
    if (res.success) {
      refreshAdminData();
      showToast("User role updated successfully.");
    } else {
      showToast(res.error || "Failed to update role.");
    }
  };

  const handleDeleteUser = (userId, userName, userEmail, currentRole) => {
    if (
      userEmail?.toLowerCase() === "admin@quiet.com" ||
      currentRole === "superuser"
    ) {
      showToast("Superuser account cannot be deleted.");
      return;
    }
    if (confirm(`Delete account for ${userName}?`)) {
      const res = deleteUserAccount(userId);
      if (res.success) {
        refreshAdminData();
        showToast(`Deleted account for ${userName}`);
      } else {
        showToast(res.error || "Failed to delete user.");
      }
    }
  };

  // Compute Telemetry Stats
  const totalUsers = usersList.length;
  const totalOrders = ordersList.length;
  const totalRevenue = ordersList.reduce(
    (acc, curr) => acc + (curr.total || 0),
    0,
  );
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalProducts = customProducts.length;

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111111] flex flex-col font-sans select-none">
      <Navbar />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-black text-white px-5 py-3 rounded-2xl font-mono text-xs shadow-lg flex items-center gap-2 border border-white/20"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-[1780px] mx-auto w-full px-6 sm:px-10 lg:px-16 pt-8 pb-24">
        <div className="bg-black text-white rounded-3xl p-6 sm:p-8 mb-10 shadow-md relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.25em] text-neutral-400 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>QUIET ARCHIVE • COMMAND CENTER V1.0</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold font-sans uppercase tracking-tight text-white">
                SUPERUSER &amp; ADMIN PANEL
              </h1>
              <p className="text-xs sm:text-sm font-mono text-neutral-400 mt-1">
                Full authority over catalog, orders, user roles, system
                telemetry, and drop schedules.
              </p>
            </div>

            {/* Admin Authentication Status & Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {isSuperUser ? (
                <div className="flex items-center gap-3 bg-white/10 border border-white/15 px-4 py-2.5 rounded-2xl font-mono text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <span className="block font-bold text-white uppercase">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                      ROLE: {user.role?.toUpperCase() || "ADMIN"}
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleElevateToSuperuser}
                  className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs uppercase tracking-wider font-bold rounded-2xl transition-all shadow-sm cursor-pointer flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>LOGIN AS SUPERUSER</span>
                </button>
              )}

              <button
                onClick={refreshAdminData}
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-colors cursor-pointer"
                title="Refresh Telemetry"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6 mb-8 border-b border-black/8">
          {[
            { id: "overview", label: "TELEMETRY", icon: TrendingUp },
            {
              id: "products",
              label: `PRODUCTS (${totalProducts})`,
              icon: Package,
            },
            {
              id: "orders",
              label: `ORDERS (${totalOrders})`,
              icon: ShoppingBag,
            },
            { id: "users", label: `ACCOUNTS (${totalUsers})`, icon: Users },
            { id: "settings", label: "DROPS & CONFIG", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-[11px] uppercase tracking-[0.16em] whitespace-nowrap transition-all cursor-pointer",
                  active
                    ? "bg-black text-white shadow-sm font-semibold"
                    : "bg-white text-neutral-600 hover:text-black hover:bg-neutral-100 border border-black/8",
                )}
              >
                <Icon
                  className={cn(
                    "w-3.5 h-3.5",
                    active ? "text-white" : "text-neutral-400",
                  )}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white border border-black/8 rounded-2xl p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                    GROSS REVENUE
                  </span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-bold font-sans text-black">
                  $
                  {totalRevenue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="font-mono text-[10.5px] text-emerald-600 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+18.4% vs last drop release</span>
                </p>
              </div>

              <div className="bg-white border border-black/8 rounded-2xl p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                    TOTAL COMMISSIONS
                  </span>
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-bold font-sans text-black">
                  {totalOrders}
                </p>
                <p className="font-mono text-[10.5px] text-neutral-500 mt-1">
                  AVG VALUE: ${avgOrderValue.toFixed(2)}
                </p>
              </div>

              <div className="bg-white border border-black/8 rounded-2xl p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                    REGISTERED CLIENTS
                  </span>
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-bold font-sans text-black">
                  {totalUsers}
                </p>
                <p className="font-mono text-[10.5px] text-neutral-500 mt-1">
                  Includes{" "}
                  {
                    usersList.filter(
                      (u) => u.role === "admin" || u.role === "superuser",
                    ).length
                  }{" "}
                  Superusers
                </p>
              </div>

              <div className="bg-white border border-black/8 rounded-2xl p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                    CUSTOM CATALOG
                  </span>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-bold font-sans text-black">
                  {totalProducts}
                </p>
                <p className="font-mono text-[10.5px] text-neutral-500 mt-1">
                  Active Drop Products
                </p>
              </div>
            </div>

            {/* Recent Orders & Quick Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-white border border-black/8 rounded-2xl p-6 sm:p-8 shadow-2xs">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold font-sans uppercase tracking-tight text-black">
                      RECENT COMMISSIONS
                    </h3>
                    <p className="text-xs font-mono text-neutral-400">
                      Live feed of incoming transactions
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="font-mono text-xs uppercase tracking-wider text-black hover:opacity-70 transition-opacity cursor-pointer"
                  >
                    VIEW ALL →
                  </button>
                </div>

                {ordersList.length === 0 ? (
                  <p className="text-xs font-mono text-neutral-400 py-8 text-center">
                    No orders recorded yet.
                  </p>
                ) : (
                  <div className="divide-y divide-black/5 font-mono text-xs">
                    {ordersList.slice(0, 5).map((ord) => (
                      <div
                        key={ord.id}
                        className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                      >
                        <div>
                          <p className="font-bold text-black">
                            {ord.id} • {ord.userName || ord.userEmail}
                          </p>
                          <p className="text-[10.5px] text-neutral-400">
                            {ord.date} • {ord.items?.length} items
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-black block">
                            ${ord.total?.toFixed(2)}
                          </span>
                          <span className="text-[9.5px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* System Vault Log */}
              <div className="lg:col-span-4 bg-white border border-black/8 rounded-2xl p-6 sm:p-8 shadow-2xs">
                <h3 className="text-lg font-bold font-sans uppercase tracking-tight text-black mb-1">
                  SYSTEM STATUS
                </h3>
                <p className="text-xs font-mono text-neutral-400 mb-6">
                  Database telemetry log
                </p>

                <div className="space-y-4 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-black/5 flex items-center justify-between">
                    <span>LocalStorage Vault</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                      OPTIMAL
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-black/5 flex items-center justify-between">
                    <span>Auth Session Engine</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-black/5 flex items-center justify-between">
                    <span>Catalog API Sync</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                      SYNCHRONIZED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <section className="bg-white border border-black/8 rounded-2xl p-6 sm:p-8 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tight text-black font-sans">
                  CUSTOM PRODUCT CATALOG ({customProducts.length})
                </h2>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">
                  Create, update, or remove bespoke drop releases.
                </p>
              </div>

              <button
                onClick={openNewProductModal}
                className="px-4 py-2.5 bg-black text-white rounded-xl font-mono text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>ADD NEW PRODUCT</span>
              </button>
            </div>

            {customProducts.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-black/10 rounded-xl">
                <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3 stroke-[1.2]" />
                <h3 className="font-bold text-base text-neutral-800">
                  No custom products found
                </h3>
                <p className="text-xs text-neutral-400 font-mono mt-1 mb-5">
                  Add your first custom fashion product to start selling.
                </p>
                <button
                  onClick={openNewProductModal}
                  className="px-5 py-2.5 bg-black text-white rounded-xl font-mono text-xs uppercase tracking-wider cursor-pointer"
                >
                  CREATE FIRST PRODUCT
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border border-black/10 rounded-2xl overflow-hidden bg-white hover:border-black/25 transition-all shadow-2xs flex flex-col justify-between"
                  >
                    <div className="p-4 flex gap-4">
                      <div className="relative w-20 h-28 rounded-xl overflow-hidden bg-neutral-100 border border-black/10 shrink-0">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-neutral-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block mb-1">
                          {product.category} • {product.gender}
                        </span>
                        <h4 className="font-sans font-bold text-sm text-black uppercase truncate">
                          {product.name}
                        </h4>
                        <span className="font-mono text-sm font-bold text-black block mt-1">
                          ${product.price}
                        </span>
                        <span className="font-mono text-[10px] text-neutral-500 block mt-1">
                          STOCK:{" "}
                          <strong className="text-black">
                            {product.stock} UNITS
                          </strong>
                        </span>
                      </div>
                    </div>

                    <div className="p-4 pt-0 flex items-center justify-between border-t border-black/5 mt-3 pt-3">
                      <button
                        onClick={() => toggleFeatured(product.id)}
                        className={cn(
                          "px-2.5 py-1 rounded font-mono text-[9.5px] uppercase tracking-wider cursor-pointer",
                          product.featured
                            ? "bg-amber-100 text-amber-900 font-bold"
                            : "bg-neutral-100 text-neutral-600",
                        )}
                      >
                        {product.featured ? "FEATURED" : "STANDARD"}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditProductModal(product)}
                          className="p-2 text-neutral-600 hover:text-black transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteProduct(product.id, product.name)
                          }
                          className="p-2 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "orders" && (
          <section className="bg-white border border-black/8 rounded-2xl p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tight text-black font-sans">
                  GLOBAL COMMISSIONS ({ordersList.length})
                </h2>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">
                  Update status, tracking numbers, and delivery logs.
                </p>
              </div>
            </div>

            {ordersList.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-black/10 rounded-xl">
                <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3 stroke-[1.2]" />
                <h3 className="font-bold text-base text-neutral-800">
                  No orders placed yet
                </h3>
                <p className="text-xs text-neutral-400 font-mono mt-1">
                  Customer orders will automatically sync here in real time.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-black/10 text-neutral-400 text-[10px] uppercase tracking-wider">
                      <th className="py-3 px-4">ORDER ID</th>
                      <th className="py-3 px-4">CLIENT</th>
                      <th className="py-3 px-4">DATE</th>
                      <th className="py-3 px-4">TOTAL</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {ordersList.map((ord) => (
                      <tr
                        key={ord.id}
                        className="hover:bg-neutral-50/70 transition-colors"
                      >
                        <td className="py-4 px-4 font-bold text-black">
                          {ord.id}
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-black block">
                            {ord.userName}
                          </span>
                          <span className="text-neutral-400 text-[10.5px]">
                            {ord.userEmail}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-neutral-600">
                          {ord.date}
                        </td>
                        <td className="py-4 px-4 font-bold text-black">
                          ${ord.total?.toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-full font-bold text-[9.5px] uppercase tracking-widest bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => openOrderEditModal(ord)}
                            className="px-3 py-1.5 bg-black text-white rounded font-mono text-[10px] uppercase tracking-wider hover:bg-neutral-800 cursor-pointer"
                          >
                            UPDATE STATUS
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === "users" && (
          <section className="bg-white border border-black/8 rounded-2xl p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tight text-black font-sans">
                  REGISTERED ACCOUNTS ({usersList.length})
                </h2>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">
                  Elevate accounts to Superuser or manage permissions.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-black/10 text-neutral-400 text-[10px] uppercase tracking-wider">
                    <th className="py-3 px-4">USER</th>
                    <th className="py-3 px-4">EMAIL</th>
                    <th className="py-3 px-4">ROLE</th>
                    <th className="py-3 px-4">ORDERS</th>
                    <th className="py-3 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {usersList.map((u) => {
                    const isSuperUser =
                      u.role === "superuser" ||
                      u.email?.toLowerCase() === "admin@quiet.com";
                    const isAdmin = u.role === "admin" || isSuperUser;
                    const isSelf =
                      user &&
                      (user.id === u.id ||
                        user.email?.toLowerCase() === u.email?.toLowerCase());
                    const isProtected = isSuperUser || (isSelf && isAdmin);

                    return (
                      <tr
                        key={u.id}
                        className="hover:bg-neutral-50/70 transition-colors"
                      >
                        <td className="py-4 px-4 font-bold text-black flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {u.avatar || "QT"}
                          </div>
                          <div className="flex items-center gap-2">
                            <span>{u.name}</span>
                            {isSelf && (
                              <span className="font-mono text-[8.5px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/5 text-neutral-500 font-semibold">
                                YOU
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-neutral-600">
                          {u.email}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={cn(
                              "px-2.5 py-1 rounded-full font-bold text-[9.5px] uppercase tracking-widest inline-flex items-center gap-1",
                              isSuperUser
                                ? "bg-black text-emerald-400 border border-emerald-500/30 shadow-xs"
                                : isAdmin
                                  ? "bg-purple-100 text-purple-900 border border-purple-300"
                                  : "bg-neutral-100 text-neutral-700",
                            )}
                          >
                            {isSuperUser && (
                              <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            )}
                            {isSuperUser
                              ? "SUPERUSER"
                              : u.role
                                ? u.role.toUpperCase()
                                : "CLIENT"}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-bold text-black">
                          {u.orders?.length || 0}
                        </td>
                        <td className="py-4 px-4 text-right">
                          {isProtected ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-600 font-mono text-[10px] tracking-wider uppercase border border-black/5 select-none font-semibold">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>PROTECTED SUPERUSER</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  handleToggleRole(u.id, u.role, u.email)
                                }
                                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-black rounded-lg font-mono text-[10px] uppercase tracking-wider cursor-pointer font-semibold transition-colors"
                              >
                                {isAdmin ? "DEMOTE" : "PROMOTE ADMIN"}
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteUser(
                                    u.id,
                                    u.name,
                                    u.email,
                                    u.role,
                                  )
                                }
                                className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete User Account"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "settings" && (
          <div className="space-y-8">
            {/* Header / Intro */}
            <div className="bg-white border border-black/8 rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tight text-black font-sans flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-black" />
                  <span>STOREFRONT CMS &amp; VISUAL ASSETS</span>
                </h2>
                <p className="text-xs text-neutral-500 font-mono mt-1">
                  Customize hero typography, spotlight centerpieces, new
                  arrivals imagery, and drop countdowns in real-time.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (
                      confirm(
                        "Reset entire storefront styling and images to factory defaults?",
                      )
                    ) {
                      resetAllSiteConfig();
                      showToast("Storefront reset to factory defaults.");
                    }
                  }}
                  className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-mono text-[11px] uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  RESET DEFAULTS
                </button>
                <button
                  onClick={() => {
                    updateSiteConfigSection("hero", {
                      badge: cmsHeroBadge,
                      headlineLine1: cmsHeroH1,
                      headlineLine2: cmsHeroH2,
                      subheading: cmsHeroDesc,
                      heroImage: cmsHeroImage1 || cmsHeroImage,
                      heroImage1: cmsHeroImage1 || cmsHeroImage,
                      heroImage2: cmsHeroImage2,
                      heroImage3: cmsHeroImage3,
                    });
                    updateSiteConfigSection("newArrivals", {
                      sectionTitle: cmsNewArrTitle,
                      featuredPieceImage: cmsNewArrImage,
                    });
                    updateSiteConfigSection("spotlight", {
                      tagline: cmsSpotlightTitle,
                      productName: cmsSpotlightName,
                      description: cmsSpotlightDesc,
                      primaryImage: cmsSpotlightImage,
                      detailImage1: cmsSpotlightDetail1,
                      detailImage2: cmsSpotlightDetail2,
                    });
                    updateSiteConfigSection("nextDrop", {
                      dropNumber: cmsNextDropTag,
                      dropName: cmsNextDropName,
                      teaserImage1: cmsNextDropLeftImg,
                      teaserImage2: cmsNextDropRightImg,
                    });
                    updateSiteConfigSection("announcement", {
                      text: cmsAnnouncementText,
                      enabled: cmsAnnouncementEnabled,
                    });
                    showToast(
                      "Storefront changes published live across the site.",
                    );
                  }}
                  className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white font-mono text-[11px] uppercase tracking-wider font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SAVE &amp; PUBLISH LIVE</span>
                </button>
              </div>
            </div>

            {/* 1. HERO SECTION CONFIG */}
            <section className="bg-white border border-black/8 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-black/8">
                <div>
                  <h3 className="text-base font-bold font-sans uppercase text-black">
                    1. HERO EDITORIAL SECTION
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    Headline typography, collection tag, and main centerpiece
                    model image.
                  </p>
                </div>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded bg-black/5 text-neutral-600 font-bold uppercase tracking-wider">
                  HOMEPAGE TOP
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                <div className="space-y-4">
                  <div>
                    <label className="block text-neutral-500 uppercase mb-1">
                      COLLECTION BADGE
                    </label>
                    <input
                      type="text"
                      value={cmsHeroBadge}
                      onChange={(e) => setCmsHeroBadge(e.target.value)}
                      placeholder="COLLECTION FW26 — SILENT LUXURY"
                      className="w-full p-3 border border-black/10 rounded-xl focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-500 uppercase mb-1">
                        HEADLINE LINE 1
                      </label>
                      <input
                        type="text"
                        value={cmsHeroH1}
                        onChange={(e) => setCmsHeroH1(e.target.value)}
                        placeholder="ARCHITECTURAL"
                        className="w-full p-3 border border-black/10 rounded-xl focus:outline-none focus:border-black font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-500 uppercase mb-1">
                        HEADLINE LINE 2
                      </label>
                      <input
                        type="text"
                        value={cmsHeroH2}
                        onChange={(e) => setCmsHeroH2(e.target.value)}
                        placeholder="PRECISION"
                        className="w-full p-3 border border-black/10 rounded-xl focus:outline-none focus:border-black font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-500 uppercase mb-1">
                      SUBHEADING / MANIFESTO
                    </label>
                    <textarea
                      rows={3}
                      value={cmsHeroDesc}
                      onChange={(e) => setCmsHeroDesc(e.target.value)}
                      placeholder="ENGINEERED SILHOUETTES & MONOCHROME MINIMALISM..."
                      className="w-full p-3 border border-black/10 rounded-xl focus:outline-none focus:border-black resize-none"
                    />
                  </div>
                </div>

                {/* Hero Campaign Cut Images — 3 slots */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <label className="block text-neutral-500 uppercase text-[11px] font-bold tracking-wider">
                      CAMPAIGN CUTS (3 LOOKS)
                    </label>
                    <span className="font-mono text-[9.5px] px-2 py-0.5 rounded bg-black/5 text-neutral-500 uppercase">
                      SWITCH LOOK on homepage
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      {
                        label: "CUT 01 — Studio Look",
                        num: 1,
                        val: cmsHeroImage1,
                        set: setCmsHeroImage1,
                        mode: heroImgMode1,
                        setMode: setHeroImgMode1,
                      },
                      {
                        label: "CUT 02 — Portrait Look",
                        num: 2,
                        val: cmsHeroImage2,
                        set: setCmsHeroImage2,
                        mode: heroImgMode2,
                        setMode: setHeroImgMode2,
                      },
                      {
                        label: "CUT 03 — Full Silhouette",
                        num: 3,
                        val: cmsHeroImage3,
                        set: setCmsHeroImage3,
                        mode: heroImgMode3,
                        setMode: setHeroImgMode3,
                      },
                    ].map(({ label, num, val, set, mode, setMode }) => (
                      <div
                        key={num}
                        className="border border-black/10 rounded-2xl p-3.5 bg-neutral-50/40 space-y-2.5"
                      >
                        {/* Slot header */}
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[10.5px] uppercase text-black tracking-wide">
                            {label}
                          </span>
                          <div className="flex items-center gap-1 bg-black/5 rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => setMode("device")}
                              className={cn(
                                "px-2 py-0.5 rounded-md font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer",
                                mode === "device"
                                  ? "bg-black text-white"
                                  : "text-neutral-500 hover:text-black",
                              )}
                            >
                              Device
                            </button>
                            <button
                              type="button"
                              onClick={() => setMode("url")}
                              className={cn(
                                "px-2 py-0.5 rounded-md font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer",
                                mode === "url"
                                  ? "bg-black text-white"
                                  : "text-neutral-500 hover:text-black",
                              )}
                            >
                              URL
                            </button>
                          </div>
                        </div>

                        {/* Preview thumbnail */}
                        <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 border border-black/8 group">
                          {val ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={val}
                                alt={`Campaign Cut ${num} preview`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => set("")}
                                className="absolute top-1.5 right-1.5 p-1 bg-black/70 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove image"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-neutral-300">
                              <ImageIcon className="w-7 h-7" />
                              <span className="font-mono text-[9px] uppercase">
                                No image
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Upload from device */}
                        {mode === "device" && (
                          <label className="flex items-center justify-center gap-2 border border-dashed border-black/20 hover:border-black rounded-xl p-2.5 cursor-pointer bg-white hover:bg-neutral-50 transition-colors group">
                            <Upload className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black transition-colors" />
                            <span className="font-mono text-[10px] text-neutral-500 group-hover:text-black transition-colors uppercase">
                              Choose File
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  const file = e.target.files[0];
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    const rawResult = ev.target.result;
                                    const img = new window.Image();
                                    img.onload = () => {
                                      const maxDim = 1400;
                                      let w = img.width;
                                      let h = img.height;
                                      if (w > maxDim || h > maxDim) {
                                        if (w > h) {
                                          h = Math.round((h * maxDim) / w);
                                          w = maxDim;
                                        } else {
                                          w = Math.round((w * maxDim) / h);
                                          h = maxDim;
                                        }
                                      }
                                      const canvas =
                                        document.createElement("canvas");
                                      canvas.width = w;
                                      canvas.height = h;
                                      canvas
                                        .getContext("2d")
                                        .drawImage(img, 0, 0, w, h);
                                      const optimized = canvas.toDataURL(
                                        "image/jpeg",
                                        0.88,
                                      );
                                      set(optimized);
                                      showToast(
                                        `Campaign Cut 0${num} updated from device.`,
                                      );
                                    };
                                    img.onerror = () => {
                                      set(rawResult);
                                      showToast(`Campaign Cut 0${num} loaded.`);
                                    };
                                    img.src = rawResult;
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        )}

                        {/* Paste URL */}
                        {mode === "url" && (
                          <input
                            type="url"
                            value={val}
                            onChange={(e) => set(e.target.value)}
                            placeholder="https://..."
                            className="w-full p-2 border border-black/10 rounded-xl focus:outline-none focus:border-black text-[11px] font-mono"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 2. PRODUCT SPOTLIGHT CONFIG */}
            <section className="bg-white border border-black/8 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-black/8">
                <div>
                  <h3 className="text-base font-bold font-sans uppercase text-black">
                    2. PRODUCT SPOTLIGHT FEATURE
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    Spotlight product title, centerpiece model, hardware zoom,
                    and wash texture.
                  </p>
                </div>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded bg-black/5 text-neutral-600 font-bold uppercase tracking-wider">
                  HOMEPAGE CENTERPIECE
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
                {/* Text fields */}
                <div className="space-y-4 md:col-span-1">
                  <div>
                    <label className="block text-neutral-500 uppercase mb-1">
                      SPOTLIGHT TAGLINE
                    </label>
                    <input
                      type="text"
                      value={cmsSpotlightTitle}
                      onChange={(e) => setCmsSpotlightTitle(e.target.value)}
                      placeholder="THE PIECE OF THE SEASON"
                      className="w-full p-3 border border-black/10 rounded-xl focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 uppercase mb-1">
                      PRODUCT NAME
                    </label>
                    <input
                      type="text"
                      value={cmsSpotlightName}
                      onChange={(e) => setCmsSpotlightName(e.target.value)}
                      placeholder="LATCH-FRONT WIDE JEANS"
                      className="w-full p-3 border border-black/10 rounded-xl focus:outline-none focus:border-black font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 uppercase mb-1">
                      EDITORIAL DESCRIPTION
                    </label>
                    <textarea
                      rows={3}
                      value={cmsSpotlightDesc}
                      onChange={(e) => setCmsSpotlightDesc(e.target.value)}
                      placeholder="Five silver D-ring latches with sun-faded tonal variation..."
                      className="w-full p-3 border border-black/10 rounded-xl focus:outline-none focus:border-black resize-none"
                    />
                  </div>
                </div>

                {/* 3 Images */}
                <div className="space-y-4 md:col-span-2">
                  <label className="block text-neutral-500 uppercase">
                    SPOTLIGHT IMAGERY (3 SLOTS)
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Slot 1: Primary */}
                    <div className="border border-black/10 rounded-2xl p-3.5 bg-neutral-50/50 space-y-2.5">
                      <span className="font-bold text-[10.5px] uppercase block text-black">
                        1. Centerpiece Image
                      </span>
                      <label className="border border-dashed border-black/20 hover:border-black rounded-xl p-3 text-center cursor-pointer block bg-white transition-colors">
                        <Upload className="w-4 h-4 mx-auto mb-1 text-black" />
                        <span className="text-[10px] text-black font-semibold block">
                          Device Upload
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              const r = new FileReader();
                              r.onload = (ev) => {
                                setCmsSpotlightImage(ev.target.result);
                                showToast("Centerpiece image updated.");
                              };
                              r.readAsDataURL(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                      {cmsSpotlightImage && (
                        <div className="h-24 w-full rounded-xl overflow-hidden bg-neutral-200 border border-black/10 relative group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cmsSpotlightImage}
                            alt="Centerpiece"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <input
                        type="url"
                        value={cmsSpotlightImage}
                        onChange={(e) => setCmsSpotlightImage(e.target.value)}
                        placeholder="Image URL..."
                        className="w-full p-2 border border-black/10 rounded-lg text-[10px]"
                      />
                    </div>

                    {/* Slot 2: Hardware */}
                    <div className="border border-black/10 rounded-2xl p-3.5 bg-neutral-50/50 space-y-2.5">
                      <span className="font-bold text-[10.5px] uppercase block text-black">
                        2. Hardware Detail
                      </span>
                      <label className="border border-dashed border-black/20 hover:border-black rounded-xl p-3 text-center cursor-pointer block bg-white transition-colors">
                        <Upload className="w-4 h-4 mx-auto mb-1 text-black" />
                        <span className="text-[10px] text-black font-semibold block">
                          Device Upload
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              const r = new FileReader();
                              r.onload = (ev) => {
                                setCmsSpotlightDetail1(ev.target.result);
                                showToast("Hardware image updated.");
                              };
                              r.readAsDataURL(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                      {cmsSpotlightDetail1 && (
                        <div className="h-24 w-full rounded-xl overflow-hidden bg-neutral-200 border border-black/10 relative group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cmsSpotlightDetail1}
                            alt="Hardware"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <input
                        type="url"
                        value={cmsSpotlightDetail1}
                        onChange={(e) => setCmsSpotlightDetail1(e.target.value)}
                        placeholder="Image URL..."
                        className="w-full p-2 border border-black/10 rounded-lg text-[10px]"
                      />
                    </div>

                    {/* Slot 3: Wash Texture */}
                    <div className="border border-black/10 rounded-2xl p-3.5 bg-neutral-50/50 space-y-2.5">
                      <span className="font-bold text-[10.5px] uppercase block text-black">
                        3. Wash Texture
                      </span>
                      <label className="border border-dashed border-black/20 hover:border-black rounded-xl p-3 text-center cursor-pointer block bg-white transition-colors">
                        <Upload className="w-4 h-4 mx-auto mb-1 text-black" />
                        <span className="text-[10px] text-black font-semibold block">
                          Device Upload
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              const r = new FileReader();
                              r.onload = (ev) => {
                                setCmsSpotlightDetail2(ev.target.result);
                                showToast("Wash texture image updated.");
                              };
                              r.readAsDataURL(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                      {cmsSpotlightDetail2 && (
                        <div className="h-24 w-full rounded-xl overflow-hidden bg-neutral-200 border border-black/10 relative group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cmsSpotlightDetail2}
                            alt="Wash Texture"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <input
                        type="url"
                        value={cmsSpotlightDetail2}
                        onChange={(e) => setCmsSpotlightDetail2(e.target.value)}
                        placeholder="Image URL..."
                        className="w-full p-2 border border-black/10 rounded-lg text-[10px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. NEW ARRIVALS SHOWCASE & NEXT DROP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* New Arrivals Section */}
              <section className="bg-white border border-black/8 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-5">
                <div className="pb-3 border-b border-black/8">
                  <h3 className="text-base font-bold font-sans uppercase text-black">
                    3. NEW ARRIVALS SHOWCASE
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    Custom showcase title and featured piece image.
                  </p>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-neutral-500 uppercase mb-1">
                      SECTION TITLE
                    </label>
                    <input
                      type="text"
                      value={cmsNewArrTitle}
                      onChange={(e) => setCmsNewArrTitle(e.target.value)}
                      placeholder="SELECTED PIECES"
                      className="w-full p-3 border border-black/10 rounded-xl focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 uppercase mb-1">
                      FEATURED PIECE IMAGE
                    </label>
                    <div className="flex gap-3 items-center">
                      <label className="flex-1 border border-dashed border-black/20 hover:border-black rounded-xl p-3 text-center cursor-pointer bg-neutral-50 transition-colors block">
                        <Upload className="w-4 h-4 mx-auto mb-1 text-black" />
                        <span className="text-[10px] text-black font-semibold block">
                          Device Upload
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              const r = new FileReader();
                              r.onload = (ev) => {
                                setCmsNewArrImage(ev.target.result);
                                showToast(
                                  "New arrivals featured image updated.",
                                );
                              };
                              r.readAsDataURL(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                      {cmsNewArrImage && (
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-200 border border-black/10 shrink-0 relative group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cmsNewArrImage}
                            alt="New arrivals piece"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <input
                      type="url"
                      value={cmsNewArrImage}
                      onChange={(e) => setCmsNewArrImage(e.target.value)}
                      placeholder="Or image URL..."
                      className="w-full p-2.5 border border-black/10 rounded-xl mt-2 text-[11px]"
                    />
                  </div>
                </div>
              </section>

              {/* Next Drop Section */}
              <section className="bg-white border border-black/8 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-5">
                <div className="pb-3 border-b border-black/8">
                  <h3 className="text-base font-bold font-sans uppercase text-black">
                    4. NEXT DROP ARCHIVE
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    Drop release title and dual lookbook teaser images.
                  </p>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-500 uppercase mb-1">
                        DROP NUMBER
                      </label>
                      <input
                        type="text"
                        value={cmsNextDropTag}
                        onChange={(e) => setCmsNextDropTag(e.target.value)}
                        placeholder="DROP 08"
                        className="w-full p-3 border border-black/10 rounded-xl focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-500 uppercase mb-1">
                        DROP NAME
                      </label>
                      <input
                        type="text"
                        value={cmsNextDropName}
                        onChange={(e) => setCmsNextDropName(e.target.value)}
                        placeholder="RAW MONOLITH ARCHIVE"
                        className="w-full p-3 border border-black/10 rounded-xl focus:outline-none focus:border-black font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-500 uppercase mb-1">
                        LEFT LOOK TEASER
                      </label>
                      <label className="border border-dashed border-black/20 hover:border-black rounded-xl p-2.5 text-center cursor-pointer bg-neutral-50 block transition-colors">
                        <Upload className="w-3.5 h-3.5 mx-auto mb-1 text-black" />
                        <span className="text-[9.5px] text-black font-semibold block">
                          Device Upload
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              const r = new FileReader();
                              r.onload = (ev) => {
                                setCmsNextDropLeftImg(ev.target.result);
                                showToast("Left look teaser updated.");
                              };
                              r.readAsDataURL(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                      <input
                        type="url"
                        value={cmsNextDropLeftImg}
                        onChange={(e) => setCmsNextDropLeftImg(e.target.value)}
                        placeholder="URL..."
                        className="w-full p-2 border border-black/10 rounded-lg mt-1 text-[10px]"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-500 uppercase mb-1">
                        RIGHT LOOK TEASER
                      </label>
                      <label className="border border-dashed border-black/20 hover:border-black rounded-xl p-2.5 text-center cursor-pointer bg-neutral-50 block transition-colors">
                        <Upload className="w-3.5 h-3.5 mx-auto mb-1 text-black" />
                        <span className="text-[9.5px] text-black font-semibold block">
                          Device Upload
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              const r = new FileReader();
                              r.onload = (ev) => {
                                setCmsNextDropRightImg(ev.target.result);
                                showToast("Right look teaser updated.");
                              };
                              r.readAsDataURL(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                      <input
                        type="url"
                        value={cmsNextDropRightImg}
                        onChange={(e) => setCmsNextDropRightImg(e.target.value)}
                        placeholder="URL..."
                        className="w-full p-2 border border-black/10 rounded-lg mt-1 text-[10px]"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* 4. TOP ANNOUNCEMENT BAR */}
            <section className="bg-white border border-black/8 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-black/8">
                <div>
                  <h3 className="text-base font-bold font-sans uppercase text-black">
                    5. TOP ANNOUNCEMENT BANNER
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    Global notice displayed across the top bar of every page.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="annEnabled"
                    checked={cmsAnnouncementEnabled}
                    onChange={(e) =>
                      setCmsAnnouncementEnabled(e.target.checked)
                    }
                    className="w-4 h-4 accent-black rounded cursor-pointer"
                  />
                  <label
                    htmlFor="annEnabled"
                    className="text-black uppercase cursor-pointer font-bold text-[11px]"
                  >
                    {cmsAnnouncementEnabled ? "BANNER ACTIVE" : "BANNER HIDDEN"}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-neutral-500 uppercase mb-1">
                  ANNOUNCEMENT TEXT
                </label>
                <input
                  type="text"
                  value={cmsAnnouncementText}
                  onChange={(e) => setCmsAnnouncementText(e.target.value)}
                  placeholder="COMPLIMENTARY WORLDWIDE COURIER DELIVERY ON ORDERS OVER $400..."
                  className="w-full p-3 border border-black/10 rounded-xl focus:outline-none focus:border-black"
                />
              </div>
            </section>
          </div>
        )}
      </main>

      <AnimatePresence>
        {productModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-black/10"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/10">
                <h3 className="text-lg font-bold font-sans uppercase text-black">
                  {editingProduct ? "EDIT PRODUCT" : "CREATE NEW PRODUCT"}
                </h3>
                <button
                  onClick={() => setProductModalOpen(false)}
                  className="p-1 text-neutral-400 hover:text-black cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={handleProductSubmit}
                className="space-y-4 font-mono text-xs"
              >
                <div>
                  <label className="block text-neutral-500 uppercase mb-1">
                    PRODUCT TITLE *
                  </label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="e.g. ARCHITECTURAL OVERSIZED HOODIE"
                    className="w-full p-3 border border-black/10 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-500 uppercase mb-1">
                      CATEGORY
                    </label>
                    <ShadcnSelect
                      value={pCategory}
                      onValueChange={setPCategory}
                      options={[
                        { value: "HOODIES", label: "HOODIES & SWEATS" },
                        { value: "TOPS", label: "TOPS & TEES" },
                        { value: "PANTS", label: "PANTS & TROUSERS" },
                        { value: "OUTERWEAR", label: "OUTERWEAR & COATS" },
                        { value: "FOOTWEAR", label: "FOOTWEAR" },
                        { value: "ACCESSORIES", label: "ACCESSORIES" },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 uppercase mb-1">
                      GENDER
                    </label>
                    <ShadcnSelect
                      value={pGender}
                      onValueChange={setPGender}
                      options={[
                        { value: "UNISEX", label: "UNISEX" },
                        { value: "MEN", label: "MEN" },
                        { value: "WOMEN", label: "WOMEN" },
                      ]}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-neutral-500 uppercase mb-1">
                      PRICE ($) *
                    </label>
                    <input
                      type="number"
                      required
                      value={pPrice}
                      onChange={(e) => setPPrice(e.target.value)}
                      placeholder="480"
                      className="w-full p-3 border border-black/10 rounded-xl focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 uppercase mb-1">
                      ORIGINAL PRICE
                    </label>
                    <input
                      type="number"
                      value={pOriginalPrice}
                      onChange={(e) => setPOriginalPrice(e.target.value)}
                      placeholder="600"
                      className="w-full p-3 border border-black/10 rounded-xl focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 uppercase mb-1">
                      STOCK UNITS
                    </label>
                    <input
                      type="number"
                      value={pStock}
                      onChange={(e) => setPStock(e.target.value)}
                      placeholder="20"
                      className="w-full p-3 border border-black/10 rounded-xl focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                {/* ── Product Imagery (Device Upload / URL) ───────────── */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-neutral-500 uppercase">
                      PRODUCT IMAGE
                    </label>
                    <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg text-[10px]">
                      <button
                        type="button"
                        onClick={() => setImageInputMode("device")}
                        className={cn(
                          "px-2.5 py-1 rounded-md font-mono uppercase tracking-wider transition-all cursor-pointer",
                          imageInputMode === "device"
                            ? "bg-black text-white font-bold shadow-xs"
                            : "text-neutral-500 hover:text-black",
                        )}
                      >
                        Device Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageInputMode("url")}
                        className={cn(
                          "px-2.5 py-1 rounded-md font-mono uppercase tracking-wider transition-all cursor-pointer",
                          imageInputMode === "url"
                            ? "bg-black text-white font-bold shadow-xs"
                            : "text-neutral-500 hover:text-black",
                        )}
                      >
                        Image URL
                      </button>
                    </div>
                  </div>

                  {/* Hidden File Input for Device Upload */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />

                  {/* Device Drag & Drop Zone */}
                  {imageInputMode === "device" && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (e.dataTransfer.files?.[0]) {
                          handleFileUpload(e.dataTransfer.files[0]);
                        }
                      }}
                      className={cn(
                        "border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2",
                        isDragging
                          ? "border-black bg-neutral-100 scale-[0.99]"
                          : "border-black/15 hover:border-black hover:bg-neutral-50/70",
                      )}
                    >
                      <div className="w-10 h-10 rounded-xl bg-black/5 text-black flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-black text-[11px] uppercase tracking-wider">
                          Choose Image from Device
                        </p>
                        <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                          Drag & drop or browse from your computer (PNG, JPG,
                          WEBP)
                        </p>
                      </div>
                    </div>
                  )}

                  {/* URL Input */}
                  {imageInputMode === "url" && (
                    <input
                      type="url"
                      value={pImage}
                      onChange={(e) => setPImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full p-3 border border-black/10 rounded-xl focus:outline-none focus:border-black"
                    />
                  )}

                  {/* Live Thumbnail Preview */}
                  {pImage && (
                    <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-xl border border-black/8">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-neutral-200 overflow-hidden relative border border-black/10 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={pImage}
                            alt="Product preview"
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-black uppercase tracking-wider">
                            Image Ready
                          </p>
                          <p className="text-[9.5px] text-emerald-600 font-mono flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                            Preview verified
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPImage("");
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                        }}
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-neutral-500 uppercase mb-1">
                    DESCRIPTION
                  </label>
                  <textarea
                    rows={3}
                    value={pDesc}
                    onChange={(e) => setPDesc(e.target.value)}
                    placeholder="Crafted from 520GSM French Terry cotton..."
                    className="w-full p-3 border border-black/10 rounded-xl focus:outline-none focus:border-black resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="feat"
                    checked={pFeatured}
                    onChange={(e) => setPFeatured(e.target.checked)}
                    className="w-4 h-4 accent-black rounded cursor-pointer"
                  />
                  <label
                    htmlFor="feat"
                    className="text-black uppercase cursor-pointer"
                  >
                    FEATURE ON HOMEPAGE / SPOTLIGHT
                  </label>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setProductModalOpen(false)}
                    className="flex-1 py-3 bg-neutral-100 text-black rounded-xl uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-black text-white rounded-xl uppercase tracking-wider font-semibold cursor-pointer hover:bg-neutral-800"
                  >
                    {editingProduct ? "SAVE CHANGES" : "CREATE PRODUCT"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {orderModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-black/10 font-mono text-xs"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/10">
                <h3 className="text-base font-bold font-sans uppercase text-black">
                  UPDATE ORDER #{selectedOrder.id}
                </h3>
                <button
                  onClick={() => setOrderModalOpen(false)}
                  className="p-1 text-neutral-400 hover:text-black cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleOrderSave} className="space-y-4">
                <div>
                  <label className="block text-neutral-500 uppercase mb-1">
                    ORDER STATUS
                  </label>
                  <ShadcnSelect
                    value={orderStatus}
                    onValueChange={(val) => setOrderStatus(val)}
                    options={[
                      { value: "PROCESSING", label: "PROCESSING" },
                      { value: "IN TRANSIT", label: "IN TRANSIT" },
                      { value: "DELIVERED", label: "DELIVERED" },
                      { value: "CANCELLED", label: "CANCELLED" },
                    ]}
                    placeholder="Select status"
                  />
                </div>

                <div>
                  <label className="block text-neutral-500 uppercase mb-1">
                    TRACKING NUMBER
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. UPS-9948201994"
                    className="w-full p-3 border border-black/10 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-neutral-500 uppercase mb-1">
                    CARRIER NAME
                  </label>
                  <input
                    type="text"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    placeholder="e.g. DHL Express"
                    className="w-full p-3 border border-black/10 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderModalOpen(false)}
                    className="flex-1 py-3 bg-neutral-100 text-black rounded-xl uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-black text-white rounded-xl uppercase tracking-wider font-semibold cursor-pointer hover:bg-neutral-800"
                  >
                    UPDATE ORDER
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
