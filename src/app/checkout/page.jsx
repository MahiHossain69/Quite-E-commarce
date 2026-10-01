"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { ShadcnSelect } from "@/components/ui/shadcn-select";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Truck,
  CreditCard,
  ShoppingBag,
  Tag,
  Sparkles,
  Printer,
  Package,
  Clock,
  AlertCircle,
  Banknote,
  Smartphone,
} from "lucide-react";
import { motion } from "motion/react";

// Country Options
const COUNTRY_OPTIONS = [
  { value: "United States", label: "United States (US)" },
  { value: "United Kingdom", label: "United Kingdom (UK)" },
  { value: "France", label: "France (FR)" },
  { value: "Germany", label: "Germany (DE)" },
  { value: "Italy", label: "Italy (IT)" },
  { value: "Japan", label: "Japan (JP)" },
  { value: "Canada", label: "Canada (CA)" },
  { value: "Australia", label: "Australia (AU)" },
  { value: "Switzerland", label: "Switzerland (CH)" },
  { value: "United Arab Emirates", label: "United Arab Emirates (UAE)" },
  { value: "Singapore", label: "Singapore (SG)" },
  { value: "South Korea", label: "South Korea (KR)" },
];

// US States Options
const US_STATES = [
  { value: "NY", label: "New York (NY)" },
  { value: "CA", label: "California (CA)" },
  { value: "FL", label: "Florida (FL)" },
  { value: "TX", label: "Texas (TX)" },
  { value: "IL", label: "Illinois (IL)" },
  { value: "WA", label: "Washington (WA)" },
  { value: "MA", label: "Massachusetts (MA)" },
  { value: "PA", label: "Pennsylvania (PA)" },
  { value: "GA", label: "Georgia (GA)" },
  { value: "NC", label: "North Carolina (NC)" },
  { value: "OTHER", label: "Other / Outside US" },
];

// Shipping Methods
const SHIPPING_METHODS = [
  {
    id: "standard",
    value: "standard",
    label: "COMPLIMENTARY ARCHIVE SHIPPING (3-5 DAYS)",
    title: "Complimentary Standard Express",
    desc: "Carbon-neutral delivery in archival signature packaging",
    days: "3-5 Business Days",
    price: 0,
  },
  {
    id: "express",
    value: "express",
    label: "DHL PRIORITY AIR EXPRESS (1-2 DAYS) - $25.00",
    title: "DHL Priority Air Express",
    desc: "Air courier priority dispatch with live biometric tracking",
    days: "1-2 Business Days",
    price: 25,
  },
  {
    id: "overnight",
    value: "overnight",
    label: "FEDEX WHITE GLOVE OVERNIGHT - $50.00",
    title: "White Glove Priority Overnight",
    desc: "Guaranteed next morning delivery before 10:30 AM",
    days: "Next Business Day",
    price: 50,
  },
];

// Payment Method Options
const PAYMENT_OPTIONS = [
  { value: "CREDIT_CARD", label: "CREDIT / DEBIT CARD (VISA, MC, AMEX)" },
  { value: "CASH_ON_DELIVERY", label: "PAYMENT ON DELIVERY / CONCIERGE" },
  { value: "APPLE_PAY", label: "APPLE PAY / 1-CLICK BIOMETRIC" },
  { value: "BANK_WIRE", label: "PRIVATE BANK WIRE & CRYPTO (USDC/ETH)" },
];

// Month Options
const EXP_MONTHS = [
  { value: "01", label: "01 - January" },
  { value: "02", label: "02 - February" },
  { value: "03", label: "03 - March" },
  { value: "04", label: "04 - April" },
  { value: "05", label: "05 - May" },
  { value: "06", label: "06 - June" },
  { value: "07", label: "07 - July" },
  { value: "08", label: "08 - August" },
  { value: "09", label: "09 - September" },
  { value: "10", label: "10 - October" },
  { value: "11", label: "11 - November" },
  { value: "12", label: "12 - December" },
];

// Year Options
const EXP_YEARS = [
  { value: "2026", label: "2026" },
  { value: "2027", label: "2027" },
  { value: "2028", label: "2028" },
  { value: "2029", label: "2029" },
  { value: "2030", label: "2030" },
  { value: "2031", label: "2031" },
  { value: "2032", label: "2032" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user, isAuthenticated, placeOrder, initialize } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(1); // 1: Shipping & Contact, 2: Shipping Method, 3: Payment, 4: Success
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phone: "",
    street: "",
    apartment: "",
    city: "",
    state: "NY",
    postalCode: "",
    country: "United States",
    saveInfo: true,
  });

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD");

  // Card Info
  const [cardData, setCardData] = useState({
    holderName: "",
    cardNumber: "",
    expMonth: "12",
    expYear: "2028",
    cvv: "",
  });

  // Promo Code State
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoError, setPromoError] = useState("");

  // Validation errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Autofill if logged in
  useEffect(() => {
    if (user) {
      const defaultAddr = user.addresses?.find((a) => a.isDefault) || user.addresses?.[0];
      setFormData((prev) => ({
        ...prev,
        email: user.email || prev.email,
        fullName: defaultAddr?.fullName || user.name || prev.fullName,
        phone: defaultAddr?.phone || user.phone || prev.phone,
        street: defaultAddr?.street || prev.street,
        apartment: defaultAddr?.apartment || prev.apartment,
        city: defaultAddr?.city || prev.city,
        state: defaultAddr?.state || prev.state,
        postalCode: defaultAddr?.postalCode || prev.postalCode,
        country: defaultAddr?.country || prev.country,
      }));
      if (user.name) {
        setCardData((prev) => ({ ...prev, holderName: user.name.toUpperCase() }));
      }
    }
  }, [user]);

  // Handle Saved Address Selection via ShadcnSelect
  const savedAddressOptions =
    user?.addresses && user.addresses.length > 0
      ? [
          { value: "custom", label: "＋ Enter a new address" },
          ...user.addresses.map((addr) => ({
            value: addr.id,
            label: `${addr.label || "Saved Address"} (${addr.street}, ${addr.city})`,
          })),
        ]
      : [];

  const handleSavedAddressChange = (addrId) => {
    if (addrId === "custom") {
      setFormData((prev) => ({
        ...prev,
        street: "",
        apartment: "",
        city: "",
        postalCode: "",
      }));
      return;
    }
    const found = user?.addresses?.find((a) => a.id === addrId);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        fullName: found.fullName || prev.fullName,
        street: found.street || "",
        apartment: found.apartment || "",
        city: found.city || "",
        state: found.state || "NY",
        postalCode: found.postalCode || "",
        country: found.country || "United States",
        phone: found.phone || prev.phone,
      }));
    }
  };

  // Calculations
  const subtotal = getSubtotal();
  const selectedShippingOption = SHIPPING_METHODS.find((m) => m.value === shippingMethod) || SHIPPING_METHODS[0];
  const shippingCost = selectedShippingOption.price;

  // Promo Calculation
  let discountAmount = 0;
  if (promoApplied) {
    if (promoApplied.type === "percent") {
      discountAmount = (subtotal * promoApplied.val) / 100;
    } else if (promoApplied.type === "fixed") {
      discountAmount = Math.min(subtotal, promoApplied.val);
    }
  }

  const taxAmount = Math.round((subtotal - discountAmount) * 0.08 * 100) / 100;
  const grandTotal = Math.max(0, subtotal - discountAmount) + shippingCost + taxAmount;

  // Apply Promo
  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError("");
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (code === "ARCHIVE10" || code === "QUIET10") {
      setPromoApplied({ code, type: "percent", val: 10, label: "10% ARCHIVE PRIVILEGE" });
      setPromoInput("");
    } else if (code === "ARCHIVE20" || code === "QUIET20") {
      setPromoApplied({ code, type: "percent", val: 20, label: "20% RUNWAY VIP DISCOUNT" });
      setPromoInput("");
    } else if (code === "FREE100") {
      setPromoApplied({ code, type: "fixed", val: 100, label: "$100 EDITORIAL CREDIT" });
      setPromoInput("");
    } else {
      setPromoError("Invalid code. Try 'ARCHIVE10' or 'FREE100'");
    }
  };

  // Validate Step 1
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.email || !formData.email.includes("@")) newErrors.email = "Valid email is required";
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.street.trim()) newErrors.street = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";
    if (!formData.phone.trim()) newErrors.phone = "Contact phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 3 (Payment)
  const validateStep3 = () => {
    if (paymentMethod === "CREDIT_CARD") {
      const newErrors = {};
      if (!cardData.holderName.trim()) newErrors.holderName = "Name on card is required";
      if (!cardData.cardNumber.replace(/\s/g, "") || cardData.cardNumber.replace(/\s/g, "").length < 15) {
        newErrors.cardNumber = "Valid 16-digit card number required";
      }
      if (!cardData.cvv || cardData.cvv.length < 3) newErrors.cvv = "Valid 3-digit CVV required";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
    return true;
  };

  // Handle Form Proceed
  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  // Place Order Submit
  const handlePlaceOrder = async () => {
    if (!validateStep3()) return;

    setIsProcessing(true);

    // Simulate luxury transaction authorization
    setTimeout(() => {
      const result = placeOrder({
        items,
        shippingAddress: formData,
        shippingMethod,
        shippingCost,
        discount: discountAmount,
        paymentMethod,
      });

      if (result.success) {
        setCompletedOrder(result.order);
        clearCart();
        setCurrentStep(4);
      }
      setIsProcessing(false);
    }, 1200);
  };

  // If order complete -> Show Success Confirmation
  if (currentStep === 4 && completedOrder) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] text-[#111111] pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="bg-white border border-black/10 p-8 sm:p-12 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-black" />

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
              </div>

              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-400">
                  ORDER CONFIRMED • ARCHIVE ACQUISITION
                </span>
                <h1 className="text-2xl sm:text-3xl font-light tracking-tight mt-1">
                  Thank You for Your Order
                </h1>
              </div>

              <p className="font-mono text-xs text-neutral-600 max-w-md">
                Confirmation email and tracking receipt have been dispatched to{" "}
                <span className="font-semibold text-black">{completedOrder.shippingAddress.email}</span>
              </p>

              {/* Order Pill */}
              <div className="inline-flex items-center gap-4 px-6 py-3 bg-neutral-50 border border-black/10 rounded-full font-mono text-xs">
                <span>ORDER: <strong className="text-black font-bold">{completedOrder.id}</strong></span>
                <span className="text-black/20">|</span>
                <span>STATUS: <strong className="text-emerald-700 font-bold uppercase">{completedOrder.status}</strong></span>
              </div>
            </div>

            {/* Tracking Banner */}
            <div className="mt-8 p-5 bg-neutral-900 text-white rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-neutral-300 shrink-0" />
                <div>
                  <p className="font-semibold tracking-wider">{completedOrder.carrier}</p>
                  <p className="text-neutral-400 text-[11px]">TRACKING ID: {completedOrder.trackingNumber}</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-neutral-400 text-[10px] uppercase tracking-widest">ESTIMATED DELIVERY</p>
                <p className="text-emerald-400 font-semibold">{completedOrder.estimatedDelivery}</p>
              </div>
            </div>

            {/* Order Items Review */}
            <div className="mt-8 divide-y divide-black/10">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-neutral-500 pb-3">
                ACQUIRED PIECES ({completedOrder.items.length})
              </h3>
              {completedOrder.items.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-16 bg-neutral-100 overflow-hidden border border-black/5 shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                      ) : (
                        <Package className="w-6 h-6 m-auto text-neutral-400 mt-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-black">
                        {item.name}
                      </h4>
                      <p className="font-mono text-[11px] text-neutral-500">
                        SIZE: {item.size} • QTY: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="mt-6 pt-6 border-t border-black/10 space-y-2 font-mono text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>SUBTOTAL</span>
                <span>${completedOrder.subtotal.toFixed(2)}</span>
              </div>
              {completedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>PRIVILEGE DISCOUNT</span>
                  <span>-${completedOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>SHIPPING ({completedOrder.shippingMethod.toUpperCase()})</span>
                <span>{completedOrder.shipping === 0 ? "COMPLIMENTARY" : `$${completedOrder.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>ESTIMATED TAX</span>
                <span>${completedOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-black pt-3 border-t border-black/10">
                <span>TOTAL PAID</span>
                <span>${completedOrder.total.toFixed(2)} USD</span>
              </div>
            </div>

            {/* Shipping Address Summary */}
            <div className="mt-8 p-4 bg-neutral-50 border border-black/10 font-mono text-xs">
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mb-1">
                DELIVERY DESTINATION
              </p>
              <p className="font-semibold text-black">{completedOrder.shippingAddress.fullName}</p>
              <p className="text-neutral-600">{completedOrder.shippingAddress.street} {completedOrder.shippingAddress.apartment}</p>
              <p className="text-neutral-600">
                {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state} {completedOrder.shippingAddress.postalCode}
              </p>
              <p className="text-neutral-600">{completedOrder.shippingAddress.country}</p>
              <p className="text-neutral-500 mt-1">{completedOrder.shippingAddress.phone}</p>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <Button
                onClick={() => router.push("/shop")}
                className="w-full sm:flex-1 h-12 bg-black text-white hover:bg-neutral-800 font-mono text-xs uppercase tracking-[0.2em] cursor-pointer"
              >
                CONTINUE SHOPPING
              </Button>
              {isAuthenticated ? (
                <Button
                  onClick={() => router.push("/account")}
                  variant="outline"
                  className="w-full sm:flex-1 h-12 border-black/20 font-mono text-xs uppercase tracking-[0.2em] hover:bg-neutral-100 cursor-pointer"
                >
                  VIEW IN ACCOUNT
                </Button>
              ) : (
                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  className="w-full sm:flex-1 h-12 border-black/20 font-mono text-xs uppercase tracking-[0.2em] hover:bg-neutral-100 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  PRINT RECEIPT
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // If cart is empty and not on success step
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] text-[#111111] pt-32 pb-20 px-4 sm:px-6 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full border border-black/15 flex items-center justify-center mb-6 text-neutral-400">
          <ShoppingBag className="w-7 h-7 stroke-[1.2]" />
        </div>
        <h1 className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-500 mb-2">
          CHECKOUT UNAVAILABLE
        </h1>
        <p className="text-2xl font-light tracking-tight text-black mb-4">
          Your Shopping Bag is Currently Empty
        </p>
        <p className="text-xs text-neutral-500 max-w-sm mb-8">
          Please add items to your bag before proceeding to luxury checkout and bespoke delivery.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center px-8 py-3.5 bg-black text-white hover:bg-neutral-800 font-mono text-xs uppercase tracking-[0.2em] transition-all"
        >
          EXPLORE CATALOGUE
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#111111] pt-20 sm:pt-24 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-black/10 gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="p-2 -ml-2 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors flex items-center gap-1 font-mono text-xs uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>RETURN TO SHOP</span>
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="font-mono text-xs uppercase tracking-[0.25em] font-semibold text-black">
              CHECKOUT
            </span>
          </div>

          <div className="flex items-center gap-2 text-neutral-500 font-mono text-[11px] uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-neutral-700 font-medium">256-BIT ENCRYPTED LUXURY CHECKOUT</span>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-2 text-center font-mono text-[10.5px] uppercase tracking-[0.16em]">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`pb-2 border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                currentStep >= 1 ? "border-black text-black font-bold" : "border-transparent text-neutral-400"
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                currentStep >= 1 ? "bg-black text-white" : "bg-neutral-200 text-neutral-600"
              }`}>1</span>
              <span>1. SHIPPING</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (validateStep1()) setCurrentStep(2);
              }}
              className={`pb-2 border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                currentStep >= 2 ? "border-black text-black font-bold" : "border-transparent text-neutral-400"
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                currentStep >= 2 ? "bg-black text-white" : "bg-neutral-200 text-neutral-600"
              }`}>2</span>
              <span>2. DELIVERY</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (validateStep1()) setCurrentStep(3);
              }}
              className={`pb-2 border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                currentStep >= 3 ? "border-black text-black font-bold" : "border-transparent text-neutral-400"
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                currentStep >= 3 ? "bg-black text-white" : "bg-neutral-200 text-neutral-600"
              }`}>3</span>
              <span>3. PAYMENT</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Form Left (7 cols) + Summary Right (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT: Step Form */}
          <div className="lg:col-span-7 bg-white border border-black/10 p-6 sm:p-8 rounded-none shadow-xs">
            {/* Express Pay Pill Bar */}
            <div className="mb-8 pb-8 border-b border-black/10">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-neutral-400 font-semibold">
                  EXPRESS LUXURY CHECKOUT
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("APPLE_PAY");
                    setCurrentStep(3);
                  }}
                  className="py-3 px-2 bg-black text-white text-center rounded-xl font-mono text-xs font-semibold hover:bg-neutral-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Apple Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("CREDIT_CARD");
                    setCurrentStep(3);
                  }}
                  className="py-3 px-2 bg-[#5A31F4] text-white text-center rounded-xl font-mono text-xs font-semibold hover:opacity-90 transition-all cursor-pointer shadow-2xs"
                >
                  Shop Pay
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("BANK_WIRE");
                    setCurrentStep(3);
                  }}
                  className="py-3 px-2 bg-neutral-100 text-black border border-black/10 text-center rounded-xl font-mono text-xs font-semibold hover:bg-neutral-200 transition-all cursor-pointer shadow-2xs"
                >
                  G Pay
                </button>
              </div>

              <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-black/10"></div>
                <span className="flex-shrink mx-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                  OR ENTER DETAILS BELOW
                </span>
                <div className="flex-grow border-t border-black/10"></div>
              </div>
            </div>

            {/* STEP 1: Shipping & Contact */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-mono text-xs uppercase tracking-[0.25em] font-semibold text-black mb-1">
                    CONTACT INFORMATION
                  </h2>
                  <p className="text-xs text-neutral-500">
                    We'll send order updates and shipping confirmation here.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10.5px] uppercase tracking-wider text-neutral-600">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: null });
                    }}
                    placeholder="e.g. alexander@quiet.studio"
                    className={`w-full px-4 py-3 rounded-xl border font-mono text-xs text-black bg-white focus:outline-none focus:ring-1 focus:ring-black transition-all ${
                      errors.email ? "border-red-500 bg-red-50/20" : "border-black/15 hover:border-black/40"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] font-mono text-red-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* If Logged In: Show Saved Address Selector via ShadcnSelect */}
                {user && user.addresses && user.addresses.length > 0 && (
                  <div className="pt-2">
                    <label className="font-mono text-[10.5px] uppercase tracking-wider text-neutral-600 block mb-1.5">
                      CHOOSE SAVED ADDRESS (SHADCN SELECT)
                    </label>
                    <ShadcnSelect
                      options={savedAddressOptions}
                      placeholder="Select a saved address..."
                      onValueChange={handleSavedAddressChange}
                    />
                  </div>
                )}

                <div className="pt-4 border-t border-black/10">
                  <h2 className="font-mono text-xs uppercase tracking-[0.25em] font-semibold text-black mb-1">
                    SHIPPING DESTINATION
                  </h2>
                  <p className="text-xs text-neutral-500 mb-4">
                    Architectural shipping with complimentary global tracking.
                  </p>
                </div>

                {/* Country - Using ShadcnSelect */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[10.5px] uppercase tracking-wider text-neutral-600">
                    COUNTRY / REGION (SHADCN SELECT) *
                  </label>
                  <ShadcnSelect
                    value={formData.country}
                    options={COUNTRY_OPTIONS}
                    onValueChange={(val) => setFormData({ ...formData, country: val })}
                    placeholder="Select Country..."
                  />
                </div>

                {/* Full Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10.5px] uppercase tracking-wider text-neutral-600">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: null });
                      }}
                      placeholder="e.g. Alexander Vance"
                      className={`w-full px-4 py-3 rounded-xl border font-mono text-xs text-black bg-white focus:outline-none focus:ring-1 focus:ring-black transition-all ${
                        errors.fullName ? "border-red-500 bg-red-50/20" : "border-black/15 hover:border-black/40"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-[11px] font-mono text-red-600 mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[10.5px] uppercase tracking-wider text-neutral-600">
                      PHONE NUMBER *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: null });
                      }}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full px-4 py-3 rounded-xl border font-mono text-xs text-black bg-white focus:outline-none focus:ring-1 focus:ring-black transition-all ${
                        errors.phone ? "border-red-500 bg-red-50/20" : "border-black/15 hover:border-black/40"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-[11px] font-mono text-red-600 mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Street Address */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[10.5px] uppercase tracking-wider text-neutral-600">
                    STREET ADDRESS *
                  </label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => {
                      setFormData({ ...formData, street: e.target.value });
                      if (errors.street) setErrors({ ...errors, street: null });
                    }}
                    placeholder="e.g. 742 Evergreen Terrace"
                    className={`w-full px-4 py-3 rounded-xl border font-mono text-xs text-black bg-white focus:outline-none focus:ring-1 focus:ring-black transition-all ${
                      errors.street ? "border-red-500 bg-red-50/20" : "border-black/15 hover:border-black/40"
                    }`}
                  />
                  {errors.street && (
                    <p className="text-[11px] font-mono text-red-600 mt-1">{errors.street}</p>
                  )}
                </div>

                {/* Apartment / Suite */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[10.5px] uppercase tracking-wider text-neutral-600">
                    APARTMENT, SUITE, STUDIO (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    value={formData.apartment}
                    onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                    placeholder="e.g. Penthouse 8B"
                    className="w-full px-4 py-3 rounded-xl border border-black/15 font-mono text-xs text-black bg-white hover:border-black/40 focus:outline-none focus:ring-1 focus:ring-black transition-all"
                  />
                </div>

                {/* City, State, Zip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10.5px] uppercase tracking-wider text-neutral-600">
                      CITY *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => {
                        setFormData({ ...formData, city: e.target.value });
                        if (errors.city) setErrors({ ...errors, city: null });
                      }}
                      placeholder="New York"
                      className={`w-full px-4 py-3 rounded-xl border font-mono text-xs text-black bg-white focus:outline-none focus:ring-1 focus:ring-black transition-all ${
                        errors.city ? "border-red-500 bg-red-50/20" : "border-black/15 hover:border-black/40"
                      }`}
                    />
                    {errors.city && (
                      <p className="text-[11px] font-mono text-red-600 mt-1">{errors.city}</p>
                    )}
                  </div>

                  {/* State Select */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10.5px] uppercase tracking-wider text-neutral-600">
                      STATE / PROV (SHADCN) *
                    </label>
                    <ShadcnSelect
                      value={formData.state}
                      options={US_STATES}
                      onValueChange={(val) => setFormData({ ...formData, state: val })}
                      placeholder="Select state..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[10.5px] uppercase tracking-wider text-neutral-600">
                      POSTAL CODE *
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => {
                        setFormData({ ...formData, postalCode: e.target.value });
                        if (errors.postalCode) setErrors({ ...errors, postalCode: null });
                      }}
                      placeholder="10013"
                      className={`w-full px-4 py-3 rounded-xl border font-mono text-xs text-black bg-white focus:outline-none focus:ring-1 focus:ring-black transition-all ${
                        errors.postalCode ? "border-red-500 bg-red-50/20" : "border-black/15 hover:border-black/40"
                      }`}
                    />
                    {errors.postalCode && (
                      <p className="text-[11px] font-mono text-red-600 mt-1">{errors.postalCode}</p>
                    )}
                  </div>
                </div>

                {/* Continue button */}
                <div className="pt-6">
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="w-full h-12 bg-black text-white hover:bg-neutral-800 font-mono text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    CONTINUE TO DELIVERY METHOD
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Shipping Method */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-mono text-xs uppercase tracking-[0.25em] font-semibold text-black mb-1">
                    SELECT DELIVERY SERVICE
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Choose your preferred courier speed and architectural handling.
                  </p>
                </div>

                {/* Shipping Method Dropdown Selector (ShadcnSelect) */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[10.5px] uppercase tracking-wider text-neutral-600">
                    SHIPPING COURIER SPEED (SHADCN SELECT)
                  </label>
                  <ShadcnSelect
                    value={shippingMethod}
                    options={SHIPPING_METHODS.map((m) => ({
                      value: m.value,
                      label: m.label,
                    }))}
                    onValueChange={(val) => setShippingMethod(val)}
                  />
                </div>

                {/* Interactive Radio Cards for Shipping */}
                <div className="space-y-3 pt-2">
                  {SHIPPING_METHODS.map((method) => {
                    const isSelected = shippingMethod === method.value;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setShippingMethod(method.value)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                          isSelected
                            ? "border-black bg-neutral-50/80 ring-1 ring-black shadow-xs"
                            : "border-black/15 hover:border-black/30 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-4 h-4 mt-0.5 rounded-full border flex items-center justify-center ${
                              isSelected ? "border-black bg-black text-white" : "border-black/30 bg-white"
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <div>
                            <p className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                              {method.title}
                            </p>
                            <p className="text-[11px] text-neutral-500 mt-0.5">{method.desc}</p>
                            <span className="inline-flex items-center gap-1 mt-1.5 font-mono text-[10px] text-neutral-600 bg-neutral-200/60 px-2 py-0.5 rounded">
                              <Clock className="w-3 h-3" /> {method.days}
                            </span>
                          </div>
                        </div>

                        <div className="text-right font-mono text-xs font-semibold">
                          {method.price === 0 ? (
                            <span className="text-emerald-700 font-bold">FREE</span>
                          ) : (
                            <span>+${method.price.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Back / Continue Buttons */}
                <div className="pt-6 flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="h-12 px-6 border-black/20 font-mono text-xs uppercase tracking-[0.16em] hover:bg-neutral-100 cursor-pointer"
                  >
                    BACK
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 h-12 bg-black text-white hover:bg-neutral-800 font-mono text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    CONTINUE TO PAYMENT
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Payment */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-mono text-xs uppercase tracking-[0.25em] font-semibold text-black mb-1">
                    PAYMENT SELECTION
                  </h2>
                  <p className="text-xs text-neutral-500">
                    All transactions are encrypted with bank-grade 256-bit protocol.
                  </p>
                </div>

                {/* Payment Method Selector via ShadcnSelect */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[10.5px] uppercase tracking-wider text-neutral-600">
                    SELECT PAYMENT METHOD (SHADCN SELECT)
                  </label>
                  <ShadcnSelect
                    value={paymentMethod}
                    options={PAYMENT_OPTIONS}
                    onValueChange={(val) => setPaymentMethod(val)}
                  />
                </div>

                {/* Card Fields Form if Credit Card selected */}
                {paymentMethod === "CREDIT_CARD" && (
                  <div className="p-5 bg-neutral-50 border border-black/10 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-700">
                        CARD DETAILS
                      </span>
                      <div className="flex items-center gap-2 text-neutral-400">
                        <CreditCard className="w-4 h-4" />
                        <span className="font-mono text-[10px]">VISA / MC / AMEX</span>
                      </div>
                    </div>

                    {/* Cardholder Name */}
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10.5px] uppercase tracking-wider text-neutral-600">
                        NAME ON CARD *
                      </label>
                      <input
                        type="text"
                        value={cardData.holderName}
                        onChange={(e) => {
                          setCardData({ ...cardData, holderName: e.target.value });
                          if (errors.holderName) setErrors({ ...errors, holderName: null });
                        }}
                        placeholder="ALEXANDER VANCE"
                        className={`w-full px-4 py-2.5 rounded-xl border font-mono text-xs uppercase bg-white focus:outline-none focus:ring-1 focus:ring-black ${
                          errors.holderName ? "border-red-500" : "border-black/15"
                        }`}
                      />
                      {errors.holderName && (
                        <p className="text-[10px] font-mono text-red-600">{errors.holderName}</p>
                      )}
                    </div>

                    {/* Card Number */}
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10.5px] uppercase tracking-wider text-neutral-600">
                        CARD NUMBER *
                      </label>
                      <input
                        type="text"
                        maxLength={19}
                        value={cardData.cardNumber}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                          setCardData({ ...cardData, cardNumber: v });
                          if (errors.cardNumber) setErrors({ ...errors, cardNumber: null });
                        }}
                        placeholder="4532 •••• •••• 8890"
                        className={`w-full px-4 py-2.5 rounded-xl border font-mono text-xs bg-white tracking-widest focus:outline-none focus:ring-1 focus:ring-black ${
                          errors.cardNumber ? "border-red-500" : "border-black/15"
                        }`}
                      />
                      {errors.cardNumber && (
                        <p className="text-[10px] font-mono text-red-600">{errors.cardNumber}</p>
                      )}
                    </div>

                    {/* Expiry and CVV using ShadcnSelect for Month & Year */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10.5px] uppercase tracking-wider text-neutral-600">
                          EXP MONTH (SHADCN)
                        </label>
                        <ShadcnSelect
                          value={cardData.expMonth}
                          options={EXP_MONTHS}
                          onValueChange={(val) => setCardData({ ...cardData, expMonth: val })}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10.5px] uppercase tracking-wider text-neutral-600">
                          EXP YEAR (SHADCN)
                        </label>
                        <ShadcnSelect
                          value={cardData.expYear}
                          options={EXP_YEARS}
                          onValueChange={(val) => setCardData({ ...cardData, expYear: val })}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10.5px] uppercase tracking-wider text-neutral-600">
                          SECURITY CVC *
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardData.cvv}
                          onChange={(e) => {
                            setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, "") });
                            if (errors.cvv) setErrors({ ...errors, cvv: null });
                          }}
                          placeholder="889"
                          className={`w-full px-4 py-2.5 rounded-xl border font-mono text-xs bg-white text-center tracking-widest focus:outline-none focus:ring-1 focus:ring-black ${
                            errors.cvv ? "border-red-500" : "border-black/15"
                          }`}
                        />
                        {errors.cvv && (
                          <p className="text-[10px] font-mono text-red-600">{errors.cvv}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Cash on Delivery Notice */}
                {paymentMethod === "CASH_ON_DELIVERY" && (
                  <div className="p-5 bg-neutral-50 border border-black/10 rounded-xl space-y-2 font-mono text-xs">
                    <div className="flex items-center gap-2 font-bold text-black uppercase">
                      <Banknote className="w-4 h-4" />
                      <span>CONCIERGE PAYMENT ON ARRIVAL</span>
                    </div>
                    <p className="text-neutral-600 text-[11px] leading-relaxed">
                      You will pay directly to our white-glove courier via contactless terminal or certified cash upon safe arrival and personal inspection of the package.
                    </p>
                  </div>
                )}

                {/* Apple Pay Notice */}
                {paymentMethod === "APPLE_PAY" && (
                  <div className="p-5 bg-neutral-900 text-white rounded-xl space-y-2 font-mono text-xs text-center">
                    <Smartphone className="w-6 h-6 mx-auto text-neutral-300 mb-1" />
                    <p className="font-bold tracking-wider">BIOMETRIC 1-CLICK AUTHENTICATION READY</p>
                    <p className="text-neutral-400 text-[11px]">
                      Clicking "PLACE ORDER" below will prompt FaceID / TouchID authorization.
                    </p>
                  </div>
                )}

                {/* Bank Wire Notice */}
                {paymentMethod === "BANK_WIRE" && (
                  <div className="p-5 bg-neutral-50 border border-black/10 rounded-xl space-y-2 font-mono text-xs">
                    <p className="font-bold text-black uppercase">SWIFT / IBAN & CRYPTO INSTRUCTIONS</p>
                    <p className="text-neutral-600 text-[11px]">
                      Deposit coordinates and smart contract escrow address will be generated on your order receipt immediately after checkout.
                    </p>
                  </div>
                )}

                {/* Review & Place Order Button */}
                <div className="pt-6 flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                    className="h-12 px-6 border-black/20 font-mono text-xs uppercase tracking-[0.16em] hover:bg-neutral-100 cursor-pointer"
                  >
                    BACK
                  </Button>
                  <Button
                    type="button"
                    disabled={isProcessing}
                    onClick={handlePlaceOrder}
                    className="flex-1 h-12 bg-black text-white hover:bg-neutral-800 font-mono text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        AUTHORIZING TRANSACTION...
                      </span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        PLACE ORDER (${grandTotal.toFixed(2)} USD)
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT: Order Summary (Sticky) */}
          <div className="lg:col-span-5 bg-white border border-black/10 p-6 sm:p-8 sticky top-28 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-black/10">
              <h3 className="font-mono text-xs uppercase tracking-[0.25em] font-semibold text-black">
                ORDER SUMMARY ({items.reduce((s, i) => s + i.quantity, 0)})
              </h3>
              <Link
                href="/shop"
                className="font-mono text-[10px] text-neutral-400 hover:text-black uppercase tracking-wider"
              >
                EDIT BAG
              </Link>
            </div>

            {/* Item List */}
            <div className="divide-y divide-black/5 max-h-72 overflow-y-auto py-2">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-14 bg-neutral-100 border border-black/5 overflow-hidden shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                      ) : (
                        <Package className="w-5 h-5 text-neutral-400 m-auto mt-4" />
                      )}
                      <span className="absolute bottom-0 right-0 bg-black text-white font-mono text-[9px] px-1 font-bold">
                        x{item.quantity}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-black truncate max-w-[180px]">
                        {item.name}
                      </h4>
                      <p className="font-mono text-[10px] text-neutral-500">
                        SIZE: {item.size}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-black">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="pt-4 border-t border-black/10">
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value);
                      if (promoError) setPromoError("");
                    }}
                    placeholder="PROMO (e.g. ARCHIVE10)"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-black/15 font-mono text-[11px] uppercase bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <Button
                  type="submit"
                  variant="outline"
                  className="px-4 border-black/20 font-mono text-[10.5px] uppercase tracking-wider hover:bg-neutral-100 cursor-pointer"
                >
                  APPLY
                </Button>
              </form>

              {promoError && (
                <p className="text-[10px] font-mono text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {promoError}
                </p>
              )}

              {promoApplied && (
                <div className="mt-2.5 p-2 bg-emerald-50 border border-emerald-200 rounded-md flex items-center justify-between font-mono text-[10.5px] text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{promoApplied.label}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPromoApplied(null)}
                    className="text-emerald-700 hover:text-black font-bold uppercase underline text-[9px] cursor-pointer"
                  >
                    REMOVE
                  </button>
                </div>
              )}
            </div>

            {/* Live Pricing Breakdown */}
            <div className="pt-4 mt-4 border-t border-black/10 space-y-2 font-mono text-xs">
              <div className="flex justify-between text-neutral-500">
                <span>SUBTOTAL</span>
                <span className="text-black font-medium">${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>DISCOUNT ({promoApplied?.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-500">
                <span>SHIPPING</span>
                <span>{shippingCost === 0 ? "COMPLIMENTARY" : `$${shippingCost.toFixed(2)}`}</span>
              </div>

              <div className="flex justify-between text-neutral-500">
                <span>ESTIMATED TAX (8%)</span>
                <span className="text-black font-medium">${taxAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-black pt-3 border-t border-black/10">
                <span>ESTIMATED TOTAL</span>
                <span>${grandTotal.toFixed(2)} USD</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t border-black/10 space-y-2 text-[10.5px] font-mono text-neutral-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                <span>100% Guaranteed Authentic Archive Pieces</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-black" />
                <span>Complimentary Carbon-Neutral Courier Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-black" />
                <span>Encrypted PCI-DSS Compliant Authorization</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
