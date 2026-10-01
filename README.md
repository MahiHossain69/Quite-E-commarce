<div align="center">

# ✦ Q U I E T  /  A R C H I V E ✦
### High-Fashion Avant-Garde & Architectural E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3.6-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand_5-443e38?style=for-the-badge)](https://github.com/pmndrs/zustand)
[![Framer Motion](https://img.shields.io/badge/Motion-Framer_Motion-F08?style=for-the-badge&logo=framer&logoColor=white)](https://motion.dev/)
[![Radix UI](https://img.shields.io/badge/Components-Shadcn_/_Radix-black?style=for-the-badge&logo=radix-ui&logoColor=white)](https://ui.shadcn.com/)

<br />

<p align="center">
  <strong>QUIET</strong> is a bespoke, luxury editorial e-commerce platform engineered for avant-garde fashion houses. Built on <strong>Next.js 16 (App Router & Turbopack)</strong> with custom <strong>Shadcn UI</strong> components, dynamic state persistence, real-time admin controls, and an encrypted end-to-end luxury checkout experience.
</p>

[Explore Storefront](#-key-features) • [Tech Stack & Materials](#-materials--technologies-used) • [Folder Structure](#-project-structure) • [Getting Started](#-getting-started) • [Admin Credentials](#-admin-credentials)

</div>

---

## ✦ Key Features

### 🛍️ Editorial Storefront
- **Dynamic Hero Look Switcher**: Interactive runway campaign looks with seamless crossfade animations and real-time customizer.
- **Architectural Product Spotlight**: Curated hardware close-ups, silhouette examinations, and fabric wash views.
- **Filterable Catalogue (`/shop`)**: Sort by categories, price ranges, gender, and live search indexing.
- **Wishlist & Shopping Bag**: Sliding luxury drawer with real-time subtotal calculation, quantity adjustment, and persistent state.

### 💳 Complete End-to-End Luxury Checkout (`/checkout`)
- **Multi-Step Flow**:
  - **Step 1: Contact & Destination**: Full international validation with custom **ShadcnSelect** dropdowns for Countries & States.
  - **Step 2: Courier Speed**: Carbon-neutral Standard Express (Complimentary), DHL Priority Air, and White Glove Overnight handling.
  - **Step 3: Encrypted Payment**: 256-Bit SSL card authorization, Concierge Pay-on-Delivery, Apple Pay 1-Click Biometric, and Private Bank Wire/Crypto coordinates.
  - **Step 4: Order Confirmation & Receipt**: Real-time receipt generator with unique `QT-XXXXX` order ID, tracking barcode, carrier dispatch timeline, and print actions.
- **Privilege Promo Engine**: Instant validation for vouchers (`ARCHIVE10`, `QUIET20`, `FREE100`) with live price recalculation.

### 🛡️ Neural Authentication & User Portal (`/account`)
- **Multi-Factor Luxury Auth**: Clean sign-in/registration with animated backdrop overlays.
- **Order Management**: Comprehensive tracking with status badges (`PROCESSING`, `DISPATCHED`, `DELIVERED`), courier tracking IDs, and itemized archives.
- **Address Book**: Multi-address management with default billing/shipping toggles.
- **Recently Viewed**: Chronological archive memory tracking viewed products.

### ⚙️ Admin Control Center (`/QuiteadminPan`)
- **Inventory Management**: Add, modify, or remove custom products with device image upload and URL import.
- **Hero Campaign Manager**: Configure 3 dedicated campaign cut images directly from your device with instant live preview.
- **Global Order Control**: Live status updates (`PROCESSING`, `IN_TRANSIT`, `DELIVERED`, `CANCELLED`) and courier assignment.
- **User Permission System**: Role escalation (`user` ↔ `admin`) and superuser security locks.

---

## ✦ Materials & Technologies Used

| Category | Technology | Purpose / Implementation |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16.3](https://nextjs.org/) | App Router, Server Components, Turbopack bundling, Fast Refresh |
| **UI Library** | [React 19](https://react.dev/) | Core UI rendering with Concurrent features |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | PostCSS engine, luxury minimal editorial palette, custom utility tokens |
| **UI Design System** | [Shadcn UI](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/) | Accessible primitives: `Dialog`, `Sheet`, `Select`, `Button`, `Badge` |
| **Custom Selects** | `ShadcnSelect` | Bespoke animated dark/light dropdowns built with Framer Motion |
| **Motion & FX** | [Motion (Framer Motion 12)](https://motion.dev/) | Smooth layout morphs, modal fades, lookbook transitions, micro-interactions |
| **Icons** | [Lucide React](https://lucide.dev/) | Minimalist vector iconography |
| **State Management** | [Zustand 5](https://github.com/pmndrs/zustand) | Ultra-lightweight reactive stores with `localStorage` persistence |
| **Form Handling** | [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) | Schema validation and input sanitation |
| **Typography** | Google Fonts | Sans-serif editorial headlines with mono labels (`JetBrains Mono` / `Geist Mono`) |

---

## ✦ Project Structure

```bash
fashion-ecom/
├── public/
│   └── images/
│       ├── categories/          # Category banners (accessories, hoodies, pants, etc.)
│       ├── products/            # High-resolution archive product photography
│       ├── hero-fashion.jpg     # Default campaign look 01
│       ├── hero-fashion-2.jpg   # Campaign look 02
│       └── hero-fashion-3.jpg   # Campaign look 03
├── src/
│   ├── app/
│   │   ├── QuiteadminPan/       # Superuser / Admin control dashboard
│   │   ├── account/             # Client account portal & order history
│   │   ├── checkout/            # Multi-step luxury checkout & receipt page
│   │   ├── contact/             # Concierge contact & inquiry form
│   │   ├── login/               # Luxury neural access & authentication
│   │   ├── privacy/             # Privacy & data security policy
│   │   ├── product/[slug]/      # Dynamic product detail & specification page
│   │   ├── shop/                # Complete catalog with faceted filters
│   │   ├── terms/               # Terms of service & archive acquisition
│   │   ├── globals.css          # Tailwind CSS v4 directives & theme variables
│   │   ├── layout.jsx           # Root layout with Navbar, CartSheet, & Footer
│   │   └── page.jsx             # Editorial home landing page
│   ├── components/
│   │   ├── layout/              # Navbar, MobileMenu, CartSheet, SearchModal, Footer
│   │   ├── scenes/              # Hero, NewArrivals, NextDrop, ProductSpotlight, WeBuild
│   │   ├── shop/                # ShopHeader, ShopFilters, ShopProductCard, EmptyState
│   │   └── ui/                  # Shadcn UI library & custom ShadcnSelect component
│   ├── config/                  # Site metadata, navigation links, constants
│   ├── data/                    # Seed product catalogues and archival specifications
│   ├── lib/                     # Utility helpers (cn, formatting, API helpers)
│   └── store/                   # Zustand global state stores
│       ├── auth-store.js        # User session, database, orders, and addresses
│       ├── cart-store.js        # Shopping bag items, quantities, subtotal calculations
│       ├── product-store.js     # Custom added products & inventory
│       ├── site-config-store.js # Dynamic hero campaign cut images & banner toggles
│       └── wishlist-store.js    # Client saved wishlist archive
├── .gitignore                   # Git exclusion rules (node_modules, .next, builds)
├── jsconfig.json                # Path aliasing (@/* mapping)
├── next.config.mjs              # Next.js optimization configuration
├── package.json                 # Project dependencies & scripts
├── postcss.config.mjs           # PostCSS Tailwind CSS v4 pipeline
└── README.md                    # Project documentation
```

---

## ✦ Getting Started

### Prerequisites
- **Node.js**: `v18.18.0` or higher (Node 20+ recommended)
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MahiHossain69/Quite-E-commarce.git
   cd Quite-E-commarce
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the storefront.

---

## ✦ Admin Credentials

For evaluation and administrative demonstration, default credentials are pre-seeded in local storage:

| Account Type | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Superuser / Admin** | `admin@quiet.com` | `admin@2026!` | Full access to `/QuiteadminPan`, Hero Look Customizer, Global Orders |
| **Demo User** | `maya.lin@quiet.studio` | `password123` | Pre-loaded order archives, saved New York delivery addresses |

---

## ✦ Promo Codes for Testing Checkout

You can test the checkout discount engine using any of the following voucher codes:

- `ARCHIVE10` — 10% Privilege Discount
- `QUIET20` — 20% Runway VIP Discount
- `FREE100` — $100.00 Instant Editorial Credit

---

## ✦ License & Archive Rights

Designed and built for avant-garde fashion e-commerce. All rights reserved. © 2026 **QUIET / ARCHIVE STUDIO**.
