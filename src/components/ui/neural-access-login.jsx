"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Eye, EyeOff, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function NeuralAccessLogin({
  onSubmit,
  brandName = "QUIET",
  defaultMode = "login", // "login" | "register"
  onModeChange,
}) {
  const [mode, setMode] = useState(defaultMode); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // Generate blob positions once on mount (stable, no hydration mismatch)
  const blobsData = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      size: 160 + ((i * 53) % 220),
      left: 8 + ((i * 15) % 82),
      top: 8 + ((i * 19) % 82),
      animationDelay: -(i * 3.5),
      animationDuration: 16 + ((i * 2.8) % 14),
    }));
  }, []);

  const blobRefs = useRef([]);

  // Mouse parallax on mercury blobs
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      blobRefs.current.forEach((blob, idx) => {
        if (blob) {
          const speed = (idx + 1) * 16;
          blob.style.marginLeft = `${(x - 0.5) * speed * 2}px`;
          blob.style.marginTop = `${(y - 0.5) * speed * 2}px`;
        }
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    onModeChange?.(newMode);
  };

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (mode === "register") {
      if (!name.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setIsLoading(true);

    try {
      const result = await onSubmit?.({
        mode,
        email,
        password,
        name: mode === "register" ? name : undefined,
        rememberMe,
      });

      if (result && result.success === false) {
        setError(result.error || "Authentication failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setSubmitted(true);
    } catch (err) {
      setError(err?.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(forgotEmail)) {
      return;
    }
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setForgotModalOpen(false);
      setForgotEmail("");
    }, 2500);
  };

  return (
    <div className={cn("mercury-login-root")}>
      {/* ── Injected keyframe + class styles ───────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

        .mercury-login-root {
          background-color: #050505;
          color: #ffffff;
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          -webkit-font-smoothing: antialiased;
        }

        /* ── Gooey blob stage ─────────────────────────────────── */
        .ml-stage {
          position: absolute;
          inset: 0;
          z-index: 0;
          filter: url('#ml-gooey');
          opacity: 0.55;
          pointer-events: none;
        }

        .ml-blob {
          position: absolute;
          background: linear-gradient(135deg, #e8e8e8, #606060);
          border-radius: 50%;
          filter: blur(24px);
          box-shadow:
            inset -12px -12px 24px rgba(0,0,0,0.6),
            12px 12px 32px rgba(255,255,255,0.18);
          animation: ml-float 22s infinite alternate ease-in-out;
          transition: margin 0.15s cubic-bezier(0.1, 1, 0.2, 1);
        }

        @keyframes ml-float {
          0%   { transform: translate(0, 0)       scale(1);   }
          33%  { transform: translate(8vw, 15vh)  scale(1.15); }
          66%  { transform: translate(-6vw, 8vh)  scale(0.85); }
          100% { transform: translate(4vw, -8vh)  scale(1.1);  }
        }

        /* ── Form inputs ──────────────────────────────────────── */
        .ml-form-group {
          position: relative;
          margin-bottom: 26px;
          transition: transform 0.35s cubic-bezier(0.2, 1, 0.3, 1);
        }

        .ml-form-group:focus-within {
          transform: translateX(6px);
        }

        .ml-label {
          display: block;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.48);
          margin-bottom: 8px;
        }

        .ml-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.12);
          color: #ffffff;
          padding: 10px 0;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.3s;
          caret-color: #ffffff;
        }

        .ml-input::placeholder {
          color: rgba(255,255,255,0.22);
          font-size: 14px;
        }

        .ml-input-glow {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 2px;
          background: #ffffff;
          box-shadow: 0 0 16px rgba(255,255,255,0.8);
          transition: width 0.5s cubic-bezier(0.2, 1, 0.3, 1);
        }

        .ml-form-group:focus-within .ml-input-glow {
          width: 100%;
        }

        /* ── Mercury submit button ────────────────────────────── */
        .ml-submit-wrap {
          margin-top: 36px;
          position: relative;
          filter: url('#ml-gooey');
        }

        .ml-btn {
          background: #ffffff;
          color: #000000;
          border: none;
          padding: 18px 36px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 3px;
          cursor: pointer;
          width: 100%;
          position: relative;
          z-index: 2;
          transition: letter-spacing 0.3s ease, opacity 0.3s, background-color 0.3s;
          font-family: 'Space Mono', monospace;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .ml-btn:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .ml-btn:not(:disabled):hover {
          letter-spacing: 4.5px;
        }

        .ml-mercury-drop {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          background: #e0e0e0;
          transform: translate(-50%, -50%);
          z-index: 1;
          border-radius: 40px;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          pointer-events: none;
        }

        .ml-submit-wrap:hover .ml-mercury-drop {
          transform: translate(-50%, -50%) scale(1.05, 1.22);
          filter: brightness(1.15);
        }

        /* ── SVG hidden ────────────────────────────────────────── */
        .ml-svg-hidden {
          position: absolute;
          width: 0;
          height: 0;
          overflow: hidden;
        }

        /* ── Success state ────────────────────────────────────── */
        .ml-success-ring {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          animation: ml-ring-in 0.5s cubic-bezier(0.2, 1, 0.3, 1) forwards;
        }

        @keyframes ml-ring-in {
          from { transform: scale(0.4); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }

        /* ── Tabs navigation ──────────────────────────────────── */
        .ml-tab-btn {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          padding: 8px 16px;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
      `}</style>

      {/* ── SVG Gooey filter definition ─────────────────────── */}
      <svg className="ml-svg-hidden" aria-hidden="true">
        <defs>
          <filter id="ml-gooey">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="12"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* ── Blob background ─────────────────────────────────── */}
      <div className="ml-stage" aria-hidden="true">
        {blobsData.map((data, i) => (
          <div
            key={i}
            ref={(el) => (blobRefs.current[i] = el)}
            className="ml-blob"
            style={{
              width: `${data.size}px`,
              height: `${data.size}px`,
              left: `${data.left}%`,
              top: `${data.top}%`,
              animationDelay: `${data.animationDelay}s`,
              animationDuration: `${data.animationDuration}s`,
            }}
          />
        ))}
      </div>

      {/* ── Soft fade overlay on the right edge so blobs dissolve smoothly into the dark split boundary ── */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 right-0 w-32 md:w-56 z-[1]"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, rgba(5,5,5,0.7) 60%, #050505 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Auth container ──────────────────────────────────── */}
      <main className="relative z-10 w-full px-6 py-12" style={{ maxWidth: 440 }}>
        {/* Top Mode Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-2">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={cn(
              "ml-tab-btn",
              mode === "login"
                ? "text-white font-bold"
                : "text-white/40 hover:text-white/70"
            )}
          >
            SIGN IN
            {mode === "login" && (
              <span className="absolute bottom-[-9px] left-0 w-full h-[2px] bg-white shadow-[0_0_10px_white]" />
            )}
          </button>
          <span className="text-white/20 font-mono text-xs">/</span>
          <button
            type="button"
            onClick={() => switchMode("register")}
            className={cn(
              "ml-tab-btn",
              mode === "register"
                ? "text-white font-bold"
                : "text-white/40 hover:text-white/70"
            )}
          >
            REGISTER
            {mode === "register" && (
              <span className="absolute bottom-[-9px] left-0 w-full h-[2px] bg-white shadow-[0_0_10px_white]" />
            )}
          </button>
        </div>

        {/* Header */}
        <header className="mb-10">
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
              display: "block",
              marginBottom: 10,
            }}
          >
            {brandName} ACCOUNT
          </span>
          <h1
            style={{
              fontWeight: 800,
              fontSize: "clamp(2.2rem, 7vw, 2.9rem)",
              lineHeight: 1.0,
              letterSpacing: "-1.5px",
              margin: 0,
            }}
          >
            {mode === "login" ? (
              <>
                WELCOME
                <br />
                BACK
              </>
            ) : (
              <>
                CREATE
                <br />
                ACCOUNT
              </>
            )}
          </h1>
          <p className="text-xs text-white/40 mt-3 font-normal leading-relaxed">
            {mode === "login"
              ? "Sign in to manage your orders, wishlist, and private drops."
              : "Register to unlock exclusive editorial drops and archive access."}
          </p>
        </header>

        {/* ── Success state ─────────────────────────────────── */}
        {submitted ? (
          <div className="text-center py-10">
            <div className="ml-success-ring">
              <Check className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#ffffff",
                marginBottom: 8,
              }}
            >
              {mode === "login" ? "AUTHENTICATION SUCCESSFUL" : "ACCOUNT CREATED"}
            </p>
            <p className="text-xs text-white/50 font-mono">
              Redirecting to quiet store...
            </p>
          </div>
        ) : (
          /* ── Form ───────────────────────────────────────── */
          <form autoComplete="off" onSubmit={handleSubmit} noValidate>
            {/* Full Name (Register mode only) */}
            {mode === "register" && (
              <div className="ml-form-group">
                <label className="ml-label">Full Name</label>
                <input
                  className="ml-input"
                  type="text"
                  placeholder="e.g. Maya Lin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <div className="ml-input-glow" />
              </div>
            )}

            {/* Email Address */}
            <div className="ml-form-group">
              <label className="ml-label">Email Address</label>
              <input
                className="ml-input"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="ml-input-glow" />
            </div>

            {/* Password */}
            <div className="ml-form-group">
              <div className="flex items-center justify-between">
                <label className="ml-label">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-white/40 hover:text-white transition-colors text-[10px] font-mono tracking-wider uppercase mb-2 flex items-center gap-1"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3 h-3" /> HIDE
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" /> SHOW
                    </>
                  )}
                </button>
              </div>
              <input
                className="ml-input"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="ml-input-glow" />
            </div>

            {/* Confirm Password (Register mode only) */}
            {mode === "register" && (
              <div className="ml-form-group">
                <label className="ml-label">Confirm Password</label>
                <input
                  className="ml-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <div className="ml-input-glow" />
              </div>
            )}

            {/* Extra options for login mode: Remember me & Forgot Password */}
            {mode === "login" && (
              <div className="flex items-center justify-between text-xs mt-2 mb-4 font-mono">
                <label className="flex items-center gap-2 cursor-pointer text-white/50 hover:text-white/80 transition-colors select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-white cursor-pointer w-3.5 h-3.5 rounded bg-transparent border border-white/20"
                  />
                  <span className="text-[10px] tracking-wider uppercase">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-[10px] tracking-wider uppercase text-white/40 hover:text-white transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Quick Demo Access Pills */}
            {mode === "login" && (
              <div className="mb-5 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                    QUICK DEMO ACCESS
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("admin@quiet.com");
                      setPassword("admin@2026!");
                      setError("");
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-mono text-[10px] tracking-wider uppercase flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <span>⚡ SUPERUSER</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("maya.lin@quiet.studio");
                      setPassword("password123");
                      setError("");
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white/80 font-mono text-[10px] tracking-wider uppercase flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <span>👤 CLIENT DEMO</span>
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  letterSpacing: "1px",
                  color: "#ff6b6b",
                  marginTop: -4,
                  marginBottom: 16,
                }}
              >
                {error}
              </p>
            )}

            {/* Mercury submit */}
            <div className="ml-submit-wrap">
              <div className="ml-mercury-drop" />
              <button type="submit" className="ml-btn" disabled={isLoading}>
                {isLoading ? (
                  mode === "login" ? "SIGNING IN..." : "CREATING..."
                ) : (
                  <>
                    <span>{mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Forgot password inline modal/sheet */}
        {forgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#111111] border border-white/15 p-6 md:p-8 max-w-sm w-full rounded-none shadow-2xl relative">
              <h3 className="font-bold text-lg text-white mb-2 tracking-tight">
                Reset Password
              </h3>
              <p className="text-xs text-white/60 mb-6 leading-relaxed">
                Enter your registered email address. We will send you instructions to reset your password.
              </p>

              {forgotSent ? (
                <div className="py-4 text-center">
                  <Check className="w-6 h-6 text-white mx-auto mb-2" />
                  <p className="text-xs font-mono text-white/90">
                    Reset link sent! Please check your inbox.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit}>
                  <div className="mb-6">
                    <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full bg-black/60 border border-white/20 px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(false)}
                      className="px-4 py-2 text-white/50 hover:text-white transition-colors"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-white text-black font-semibold hover:bg-neutral-200 transition-colors"
                    >
                      SEND LINK
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Footer Toggle */}
        <footer
          style={{
            marginTop: 36,
            textAlign: "center",
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            letterSpacing: "1.5px",
          }}
        >
          {mode === "login" ? (
            <p className="text-white/40">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("register")}
                className="text-white font-bold hover:text-white/80 transition-colors ml-1 cursor-pointer bg-transparent border-none p-0"
              >
                REGISTER
              </button>
            </p>
          ) : (
            <p className="text-white/40">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="text-white font-bold hover:text-white/80 transition-colors ml-1 cursor-pointer bg-transparent border-none p-0"
              >
                SIGN IN
              </button>
            </p>
          )}
        </footer>
      </main>
    </div>
  );
}
