"use client";

import { create } from "zustand";

const USERS_DB_KEY = "quiet_users_db_v1";
const SESSION_KEY = "quiet_auth_session_v1";
const RECENTLY_VIEWED_KEY = "quiet_recently_viewed_v1";

// Initial seed users for demo convenience
const SEED_USERS = [
  {
    id: "usr_admin_01",
    name: "System Administrator",
    email: "admin@quiet.com",
    password: "admin@2026!",
    role: "superuser",
    phone: "+1 (800) 900-QUIET",
    avatar: "SA",
    createdAt: "2026-01-01T00:00:00.000Z",
    addresses: [],
    orders: [],
  },
  {
    id: "usr_01_maya",
    name: "Maya Lin",
    email: "maya.lin@quiet.studio",
    password: "password123",
    role: "user",
    phone: "+1 (555) 392-8810",
    avatar: "ML",
    createdAt: "2026-01-15T10:00:00.000Z",
    addresses: [
      {
        id: "addr_1",
        label: "Studio & Residence",
        fullName: "Maya Lin",
        street: "420 Mercer Street, Apt 7B",
        city: "New York",
        state: "NY",
        postalCode: "10013",
        country: "United States",
        phone: "+1 (555) 392-8810",
        isDefault: true,
      },
      {
        id: "addr_2",
        label: "Design Atelier",
        fullName: "Maya Lin",
        street: "88 Franklin Street, 4th Fl",
        city: "New York",
        state: "NY",
        postalCode: "10013",
        country: "United States",
        phone: "+1 (555) 392-8810",
        isDefault: false,
      },
    ],
    orders: [
      {
        id: "QT-90421",
        date: "2026-09-14",
        status: "DELIVERED",
        trackingNumber: "UPS-9948201994",
        carrier: "UPS Express Saver",
        estimatedDelivery: "Delivered on Sep 17, 2026",
        items: [
          {
            id: "prod-01",
            name: "ARCHITECTURAL OVERSIZED ZIP HOODIE",
            price: 480,
            quantity: 1,
            size: "L",
            color: "Washed Black",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
          },
          {
            id: "prod-04",
            name: "RAW SILHOUETTE PLEATED TROUSERS",
            price: 360,
            quantity: 1,
            size: "32",
            color: "Phantom Charcoal",
            image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
          },
        ],
        subtotal: 840,
        shipping: 0,
        tax: 67.2,
        total: 907.2,
        shippingAddress: {
          fullName: "Maya Lin",
          street: "420 Mercer Street, Apt 7B",
          city: "New York, NY 10013",
          country: "United States",
        },
      },
      {
        id: "QT-88172",
        date: "2026-08-22",
        status: "DELIVERED",
        trackingNumber: "DHL-781992011",
        carrier: "DHL Express",
        estimatedDelivery: "Delivered on Aug 25, 2026",
        items: [
          {
            id: "prod-08",
            name: "MINIMALIST CASHMERE TURTLENECK",
            price: 520,
            quantity: 1,
            size: "M",
            color: "Bone White",
            image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop",
          },
        ],
        subtotal: 520,
        shipping: 25,
        tax: 41.6,
        total: 586.6,
        shippingAddress: {
          fullName: "Maya Lin",
          street: "420 Mercer Street, Apt 7B",
          city: "New York, NY 10013",
          country: "United States",
        },
      },
    ],
  },
];

// Helper to safely get stored users
function getStoredUsers() {
  if (typeof window === "undefined") return SEED_USERS;
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    let users = SEED_USERS;
    if (raw) {
      users = JSON.parse(raw);
    }
    // Ensure seed admin user always exists and has the latest credentials & superuser role
    const adminIndex = users.findIndex((u) => u.email.toLowerCase() === "admin@quiet.com");
    if (adminIndex === -1) {
      users = [SEED_USERS[0], ...users];
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    } else {
      // Sync admin password & role to latest superuser credentials
      if (users[adminIndex].password !== "admin@2026!" || users[adminIndex].role !== "superuser") {
        users[adminIndex] = {
          ...users[adminIndex],
          password: "admin@2026!",
          role: "superuser",
        };
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
      }
    }
    return users;
  } catch (err) {
    console.error("Error loading users DB:", err);
    return SEED_USERS;
  }
}

// Helper to safely save users
function saveUsers(users) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch (err) {
    console.error("Error saving users DB:", err);
  }
}

// Helper to get active session
function getActiveSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  recentlyViewed: [],

  // Rehydrate on mount
  initialize: () => {
    if (typeof window === "undefined") return;
    const session = getActiveSession();
    const users = getStoredUsers();

    let currentUser = null;
    if (session && session.email) {
      // Find latest user data from DB
      currentUser = users.find((u) => u.email.toLowerCase() === session.email.toLowerCase()) || null;
    }

    // Load recently viewed
    let recents = [];
    try {
      const recentsRaw = localStorage.getItem(RECENTLY_VIEWED_KEY);
      if (recentsRaw) recents = JSON.parse(recentsRaw);
    } catch (e) {
      console.warn("Could not read recently viewed:", e);
    }

    set({
      user: currentUser,
      isAuthenticated: !!currentUser,
      isInitialized: true,
      recentlyViewed: recents,
    });
  },

  // Log in
  login: async ({ email, password, rememberMe = true }) => {
    const users = getStoredUsers();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const existingUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!existingUser) {
      return { success: false, error: "No account found with this email address." };
    }

    if (existingUser.password !== cleanPassword) {
      return { success: false, error: "Incorrect password. Please try again." };
    }

    // Set active session
    if (typeof window !== "undefined") {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          email: existingUser.email,
          id: existingUser.id,
          timestamp: Date.now(),
        })
      );
    }

    set({ user: existingUser, isAuthenticated: true });
    return { success: true, user: existingUser };
  },

  // Register
  register: async ({ name, email, password }) => {
    const users = getStoredUsers();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPassword = password.trim();

    // Check if email already registered
    const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return {
        success: false,
        error: "An account with this email already exists. Please sign in instead.",
      };
    }

    // Compute initials for avatar
    const initials = cleanName
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "Q";

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      phone: "",
      avatar: initials,
      createdAt: new Date().toISOString(),
      addresses: [],
      orders: [],
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);

    // Set session
    if (typeof window !== "undefined") {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          email: newUser.email,
          id: newUser.id,
          timestamp: Date.now(),
        })
      );
    }

    set({ user: newUser, isAuthenticated: true });
    return { success: true, user: newUser };
  },

  // Logout
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(SESSION_KEY);
    }
    set({ user: null, isAuthenticated: false });
  },

  // Update Profile
  updateProfile: ({ name, phone }) => {
    const state = get();
    if (!state.user) return { success: false, error: "Not logged in" };

    const users = getStoredUsers();
    const updatedUser = {
      ...state.user,
      name: name?.trim() || state.user.name,
      phone: phone?.trim() !== undefined ? phone.trim() : state.user.phone,
      avatar: name
        ? name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()
        : state.user.avatar,
    };

    const updatedUsers = users.map((u) => (u.id === state.user.id ? updatedUser : u));
    saveUsers(updatedUsers);
    set({ user: updatedUser });
    return { success: true, user: updatedUser };
  },

  // Change Password
  changePassword: ({ currentPassword, newPassword }) => {
    const state = get();
    if (!state.user) return { success: false, error: "Not logged in" };

    if (state.user.password !== currentPassword.trim()) {
      return { success: false, error: "Current password does not match." };
    }

    if (newPassword.trim().length < 6) {
      return { success: false, error: "New password must be at least 6 characters." };
    }

    const users = getStoredUsers();
    const updatedUser = { ...state.user, password: newPassword.trim() };
    const updatedUsers = users.map((u) => (u.id === state.user.id ? updatedUser : u));
    saveUsers(updatedUsers);
    set({ user: updatedUser });

    return { success: true };
  },

  // Add Address
  addAddress: (addressData) => {
    const state = get();
    if (!state.user) return;

    const newAddress = {
      id: `addr_${Date.now()}`,
      ...addressData,
      isDefault: state.user.addresses.length === 0 ? true : !!addressData.isDefault,
    };

    let updatedAddresses = [...state.user.addresses];
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
    }
    updatedAddresses.push(newAddress);

    const users = getStoredUsers();
    const updatedUser = { ...state.user, addresses: updatedAddresses };
    const updatedUsers = users.map((u) => (u.id === state.user.id ? updatedUser : u));
    saveUsers(updatedUsers);
    set({ user: updatedUser });
  },

  // Update Address
  updateAddress: (addressId, addressData) => {
    const state = get();
    if (!state.user) return;

    let updatedAddresses = state.user.addresses.map((a) => {
      if (a.id === addressId) {
        return { ...a, ...addressData };
      }
      return addressData.isDefault ? { ...a, isDefault: false } : a;
    });

    const users = getStoredUsers();
    const updatedUser = { ...state.user, addresses: updatedAddresses };
    const updatedUsers = users.map((u) => (u.id === state.user.id ? updatedUser : u));
    saveUsers(updatedUsers);
    set({ user: updatedUser });
  },

  // Delete Address
  deleteAddress: (addressId) => {
    const state = get();
    if (!state.user) return;

    const remaining = state.user.addresses.filter((a) => a.id !== addressId);
    // If deleted was default, make first remaining default
    if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
      remaining[0].isDefault = true;
    }

    const users = getStoredUsers();
    const updatedUser = { ...state.user, addresses: remaining };
    const updatedUsers = users.map((u) => (u.id === state.user.id ? updatedUser : u));
    saveUsers(updatedUsers);
    set({ user: updatedUser });
  },

  // Set Default Address
  setDefaultAddress: (addressId) => {
    const state = get();
    if (!state.user) return;

    const updatedAddresses = state.user.addresses.map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));

    const users = getStoredUsers();
    const updatedUser = { ...state.user, addresses: updatedAddresses };
    const updatedUsers = users.map((u) => (u.id === state.user.id ? updatedUser : u));
    saveUsers(updatedUsers);
    set({ user: updatedUser });
  },

  // Admin: Get all users
  getAllUsers: () => {
    return getStoredUsers();
  },

  // Admin: Get all orders across all users
  getAllOrders: () => {
    const users = getStoredUsers();
    const allOrders = [];
    users.forEach((u) => {
      if (Array.isArray(u.orders)) {
        u.orders.forEach((o) => {
          allOrders.push({
            ...o,
            userId: u.id,
            userEmail: u.email,
            userName: u.name,
          });
        });
      }
    });
    return allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  // Admin: Update order status & tracking
  updateOrderStatus: (orderId, { status, trackingNumber, carrier, estimatedDelivery }) => {
    const users = getStoredUsers();
    let updated = false;

    const updatedUsers = users.map((u) => {
      if (!Array.isArray(u.orders)) return u;
      const updatedOrders = u.orders.map((o) => {
        if (o.id === orderId) {
          updated = true;
          return {
            ...o,
            status: status || o.status,
            trackingNumber: trackingNumber !== undefined ? trackingNumber : o.trackingNumber,
            carrier: carrier !== undefined ? carrier : o.carrier,
            estimatedDelivery: estimatedDelivery !== undefined ? estimatedDelivery : o.estimatedDelivery,
          };
        }
        return o;
      });
      return { ...u, orders: updatedOrders };
    });

    if (updated) {
      saveUsers(updatedUsers);
      // If current user is modified, update local state
      const state = get();
      if (state.user) {
        const freshSelf = updatedUsers.find((u) => u.id === state.user.id);
        if (freshSelf) set({ user: freshSelf });
      }
    }
    return { success: updated };
  },

  // Admin: Toggle user role between 'user' and 'admin' (Superusers / Root admin cannot be demoted)
  toggleUserRole: (userId, newRole) => {
    const users = getStoredUsers();
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return { success: false, error: "User not found" };

    // Prevent demoting root superuser
    if (targetUser.email.toLowerCase() === "admin@quiet.com" || targetUser.role === "superuser") {
      return { success: false, error: "Superuser cannot be demoted." };
    }

    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        return { ...u, role: newRole || (u.role === "admin" ? "user" : "admin") };
      }
      return u;
    });
    saveUsers(updatedUsers);
    const state = get();
    if (state.user && state.user.id === userId) {
      const freshSelf = updatedUsers.find((u) => u.id === userId);
      set({ user: freshSelf });
    }
    return { success: true };
  },

  // Admin: Delete user account (Superusers / Root admin cannot be deleted)
  deleteUserAccount: (userId) => {
    const users = getStoredUsers();
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return { success: false, error: "User not found" };

    // Prevent deleting root superuser
    if (targetUser.email.toLowerCase() === "admin@quiet.com" || targetUser.role === "superuser") {
      return { success: false, error: "Superuser account cannot be deleted." };
    }

    const updatedUsers = users.filter((u) => u.id !== userId);
    saveUsers(updatedUsers);
    return { success: true };
  },

  // Recently Viewed Products tracking
  addRecentlyViewed: (product) => {
    if (!product || !product.id) return;
    const state = get();
    const current = state.recentlyViewed || [];
    const filtered = current.filter((p) => p.id !== product.id);
    const updated = [
      {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.image || (Array.isArray(product.images) ? product.images[0] : product.images),
        slug: product.slug,
        viewedAt: new Date().toISOString(),
      },
      ...filtered,
    ].slice(0, 12);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save recently viewed:", e);
      }
    }
    set({ recentlyViewed: updated });
  },

  // Place Order
  placeOrder: ({
    items,
    shippingAddress,
    billingAddress,
    shippingMethod = "standard",
    shippingCost = 0,
    discount = 0,
    paymentMethod = "CREDIT_CARD",
    notes = "",
  }) => {
    const state = get();
    const users = getStoredUsers();

    // Calculate subtotal and tax
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.max(0, subtotal - discount) + shippingCost + tax;

    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderId = `QT-${randomDigits}`;
    const today = new Date().toISOString().split("T")[0];

    let carrier = "UPS Express Saver";
    let estimatedDelivery = "3-5 business days";
    if (shippingMethod === "express") {
      carrier = "DHL Express Priority";
      estimatedDelivery = "1-2 business days";
    } else if (shippingMethod === "overnight") {
      carrier = "FedEx Priority Overnight";
      estimatedDelivery = "Next business day by 10:30 AM";
    }

    const newOrder = {
      id: orderId,
      date: today,
      status: "PROCESSING",
      trackingNumber: `TRK-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      carrier,
      estimatedDelivery,
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        size: i.size || "M",
        color: i.color || "Standard Edition",
        image: i.image || "",
      })),
      subtotal,
      discount,
      shipping: shippingCost,
      tax,
      total,
      shippingMethod,
      shippingAddress: {
        fullName: shippingAddress?.fullName || "Guest Customer",
        email: shippingAddress?.email || (state.user ? state.user.email : "guest@quiet.studio"),
        phone: shippingAddress?.phone || "",
        street: shippingAddress?.street || "",
        apartment: shippingAddress?.apartment || "",
        city: shippingAddress?.city || "",
        state: shippingAddress?.state || "",
        postalCode: shippingAddress?.postalCode || "",
        country: shippingAddress?.country || "United States",
      },
      paymentMethod,
      createdAt: new Date().toISOString(),
    };

    if (state.user) {
      const userOrders = Array.isArray(state.user.orders) ? [newOrder, ...state.user.orders] : [newOrder];
      const updatedUser = { ...state.user, orders: userOrders };
      const updatedUsers = users.map((u) => (u.id === state.user.id ? updatedUser : u));
      saveUsers(updatedUsers);
      set({ user: updatedUser });
    } else {
      const guestEmail = shippingAddress?.email?.toLowerCase().trim() || "guest@quiet.studio";
      const guestIndex = users.findIndex((u) => u.email.toLowerCase() === guestEmail);
      if (guestIndex > -1) {
        const existingGuest = users[guestIndex];
        const updatedOrders = [newOrder, ...(existingGuest.orders || [])];
        const updatedGuest = { ...existingGuest, orders: updatedOrders };
        users[guestIndex] = updatedGuest;
        saveUsers(users);
      } else {
        const guestUser = {
          id: `usr_guest_${Date.now()}`,
          name: shippingAddress?.fullName || "Guest Customer",
          email: guestEmail,
          password: "",
          role: "user",
          phone: shippingAddress?.phone || "",
          avatar: "G",
          createdAt: new Date().toISOString(),
          addresses: [
            {
              id: `addr_${Date.now()}`,
              label: "Shipping Address",
              ...(shippingAddress || {}),
              isDefault: true,
            },
          ],
          orders: [newOrder],
        };
        saveUsers([...users, guestUser]);
      }
    }

    return { success: true, order: newOrder };
  },

  clearRecentlyViewed: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(RECENTLY_VIEWED_KEY);
    }
    set({ recentlyViewed: [] });
  },
}));
