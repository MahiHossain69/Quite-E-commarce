"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { NeuralAccessLogin } from "@/components/ui/neural-access-login";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const user = useAuthStore((s) => s.user);

  // If already authenticated, redirect based on role
  useEffect(() => {
    if (isInitialized && isAuthenticated && user) {
      const isAdmin = user.role === "admin" || user.role === "superuser";
      router.push(isAdmin ? "/QuiteadminPan" : "/account");
    }
  }, [isInitialized, isAuthenticated, user, router]);

  const handleAuth = async (authData) => {
    let result;
    if (authData.mode === "register") {
      result = await register({
        name: authData.name,
        email: authData.email,
        password: authData.password,
      });
    } else {
      result = await login({
        email: authData.email,
        password: authData.password,
        rememberMe: authData.rememberMe,
      });
    }

    if (result.success) {
      // Redirect based on role — admins go to the admin panel
      const isAdmin =
        result.user?.role === "admin" || result.user?.role === "superuser";
      setTimeout(() => router.push(isAdmin ? "/QuiteadminPan" : "/account"), 800);
    }

    return result;
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* ── Back-to-site link ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="fixed top-5 left-6 z-50"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 group"
          aria-label="Back to store"
        >
          <ArrowLeft
            className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors duration-300"
            strokeWidth={1.8}
          />
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              transition: "color 0.3s",
            }}
            className="group-hover:!text-white"
          >
            QUIET STORE
          </span>
        </Link>
      </motion.div>

      {/* ── Right-side editorial panel (desktop only) ──────────────── */}
      <div
        className="hidden lg:block fixed right-0 top-0 h-full w-[48%] z-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Deep left-to-right fade overlay that melts into the dark background */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to right, #050505 0%, rgba(5,5,5,0.95) 15%, rgba(5,5,5,0.6) 45%, rgba(5,5,5,0.2) 75%, transparent 100%)",
          }}
        />

        {/* Feathered left edge seam blender */}
        <div
          className="absolute top-0 bottom-0 left-0 w-36 z-20"
          style={{
            background: "linear-gradient(to right, #050505 0%, rgba(5,5,5,0.8) 50%, transparent 100%)",
          }}
        />

        {/* Top and bottom subtle vignette */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5,5,5,0.7) 0%, transparent 20%, transparent 80%, #050505 100%)",
          }}
        />

        {/* Atmospheric moody tint */}
        <div className="absolute inset-0 bg-[#050505]/25 z-10" />

        <Image
          src="https://images.pexels.com/photos/14202107/pexels-photo-14202107.jpeg"
          alt="QUIET editorial fashion"
          fill
          className="object-cover object-center scale-105"
          priority
          unoptimized
        />

        {/* Editorial text watermark */}
        <div className="absolute bottom-10 right-10 z-20 text-right">
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              lineHeight: 2,
            }}
          >
            COLLECTION FW26
            <br />
            SILENT LUXURY
            <br />
            ARCHITECTURAL CUTS
          </p>
        </div>
      </div>

      {/* ── Main login panel ────────────────────────────────────────── */}
      <div className="relative z-10 min-h-screen lg:w-[55%] flex flex-col">
        <NeuralAccessLogin
          onSubmit={handleAuth}
          brandName="QUIET"
          defaultMode="login"
        />
      </div>
    </div>
  );
}
