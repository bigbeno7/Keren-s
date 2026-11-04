"use client";

import { MotionConfig } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type Toast = { id: number; title: string; body?: string };

interface StoreState {
  wishlist: string[];
  bag: string[];
  toggleWish: (id: string) => boolean;
  isWished: (id: string) => boolean;
  addToBag: (id: string) => void;
  removeFromBag: (id: string) => void;
  inBag: (id: string) => boolean;
  toasts: Toast[];
  notify: (title: string, body?: string) => void;
  dismiss: (id: number) => void;
  bagOpen: boolean;
  setBagOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
}

const Ctx = createContext<StoreState | null>(null);

const read = (key: string): string[] => {
  try {
    const v = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};
const write = (key: string, v: string[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* private mode — keep in memory */
  }
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [bag, setBag] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const tid = useRef(0);

  useEffect(() => {
    setWishlist(read("kerens:wishlist"));
    setBag(read("kerens:bag"));
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) write("kerens:wishlist", wishlist); }, [wishlist, hydrated]);
  useEffect(() => { if (hydrated) write("kerens:bag", bag); }, [bag, hydrated]);

  // Lock page scroll while any overlay is open (iOS-safe enough for a prototype)
  const anyOpen = bagOpen || searchOpen || menuOpen;
  useEffect(() => {
    const el = document.documentElement;
    el.style.overflow = anyOpen ? "hidden" : "";
    return () => { el.style.overflow = ""; };
  }, [anyOpen]);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const notify = useCallback((title: string, body?: string) => {
    const id = ++tid.current;
    setToasts((t) => [...t.slice(-2), { id, title, body }]);
    setTimeout(() => dismiss(id), 4200);
  }, [dismiss]);

  const toggleWish = useCallback((id: string) => {
    let added = false;
    setWishlist((w) => {
      added = !w.includes(id);
      return added ? [...w, id] : w.filter((x) => x !== id);
    });
    return !wishlist.includes(id);
  }, [wishlist]);

  const value = useMemo<StoreState>(() => ({
    wishlist, bag, toasts, notify, dismiss,
    toggleWish,
    isWished: (id) => wishlist.includes(id),
    addToBag: (id) => setBag((b) => (b.includes(id) ? b : [...b, id])),
    removeFromBag: (id) => setBag((b) => b.filter((x) => x !== id)),
    inBag: (id) => bag.includes(id),
    bagOpen, setBagOpen, searchOpen, setSearchOpen, menuOpen, setMenuOpen,
  }), [wishlist, bag, toasts, notify, dismiss, toggleWish, bagOpen, searchOpen, menuOpen]);

  return (
    <MotionConfig reducedMotion="user">
      <Ctx.Provider value={value}>{children}</Ctx.Provider>
    </MotionConfig>
  );
}

export const useStore = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore outside StoreProvider");
  return c;
};
