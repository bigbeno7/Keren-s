"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Heart, ShoppingBag, User } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { useStore } from "./Store";
import { cn } from "@/lib/format";
import { prototypeNotice, prototypeNoticeShort } from "@/config/brand";

export const navLinks = [
  { href: "/collection?sort=new", he: "חדש בבוטיק", en: "New In" },
  { href: "/collection?category=bags", he: "תיקים", en: "Handbags" },
  { href: "/collection?category=ready-to-wear", he: "ביגוד", en: "Ready-to-Wear" },
  { href: "/collection?category=shoes", he: "נעליים", en: "Shoes" },
  { href: "/collection?category=jewelry", he: "תכשיטים", en: "Jewellery" },
  { href: "/designers", he: "בתי אופנה", en: "Maisons" },
];

function Burger({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3 w-6" aria-hidden>
      <span className={cn("absolute right-0 top-0 h-px bg-current transition-all duration-500", open ? "w-6 translate-y-[6px] rotate-45" : "w-6")} />
      <span className={cn("absolute right-0 bottom-0 h-px bg-current transition-all duration-500", open ? "w-6 -translate-y-[5px] -rotate-45" : "w-4")} />
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const { wishlist, bag, setBagOpen, setSearchOpen, menuOpen, setMenuOpen, notify } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setMenuOpen(false), [pathname, setMenuOpen]);

  const overHero = pathname === "/" && !scrolled && !menuOpen;
  const count = (n: number) =>
    mounted && n > 0 ? (
      <motion.span
        key={n}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          "absolute top-1 left-0.5 grid h-[16px] min-w-[16px] place-items-center rounded-full px-1 text-[0.62rem] font-semibold tabular-nums",
          overHero ? "bg-ivory text-espresso" : "bg-espresso text-ivory",
        )}
      >
        {n}
      </motion.span>
    ) : null;

  const iconBtn = "relative grid h-11 w-11 place-items-center transition-opacity duration-300 hover:opacity-60";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Prototype notice — collapses once the visitor starts scrolling */}
      <AnimatePresence initial={false}>
        {!scrolled && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden bg-espresso text-ivory/85"
          >
            <p className="px-4 py-2 text-center text-[0.7rem] leading-snug tracking-[0.04em] md:text-[0.74rem]">
              <span className="md:hidden">{prototypeNoticeShort}</span>
              <span className="hidden md:inline">{prototypeNotice}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={cn(
          "transition-[background-color,color,border-color,backdrop-filter] duration-700 ease-[cubic-bezier(.22,1,.36,1)] border-b",
          overHero ? "border-transparent bg-transparent text-ivory" : "border-espresso/10 bg-ivory/88 text-espresso backdrop-blur-xl backdrop-saturate-150",
        )}
      >
        <div className="mx-auto grid h-16 max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-3 md:h-[76px] md:px-8">
          {/* Start (right): burger on mobile, nav on desktop */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              className={cn(iconBtn, "lg:hidden")}
              aria-label={menuOpen ? "סגירת התפריט" : "פתיחת התפריט"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Burger open={menuOpen} />
            </button>
            <button type="button" className={cn(iconBtn, "lg:hidden")} aria-label="חיפוש" onClick={() => setSearchOpen(true)}>
              <Search strokeWidth={1.25} className="h-[19px] w-[19px]" />
            </button>
            <nav aria-label="ניווט ראשי" className="hidden lg:block">
              <ul className="flex items-center gap-7 xl:gap-9">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-luxe text-[0.88rem] tracking-[0.04em]">
                      {l.he}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <Link href="/" aria-label="KEREN’S — לדף הבית" className="px-2">
            <Wordmark size="md" />
          </Link>

          {/* End (left): utilities */}
          <div className="flex items-center justify-end gap-0.5 md:gap-1.5">
            <button type="button" className={cn(iconBtn, "hidden lg:grid")} aria-label="חיפוש" onClick={() => setSearchOpen(true)}>
              <Search strokeWidth={1.25} className="h-[19px] w-[19px]" />
            </button>
            <button
              type="button"
              className={cn(iconBtn, "hidden md:grid")}
              aria-label="החשבון שלי"
              onClick={() => notify("אזור אישי — בקרוב", "התחברות לקוחות אינה חלק מאב-הטיפוס.")}
            >
              <User strokeWidth={1.25} className="h-[19px] w-[19px]" />
            </button>
            <Link href="/wishlist" className={iconBtn} aria-label={`רשימת משאלות, ${wishlist.length} פריטים`}>
              <Heart strokeWidth={1.25} className="h-[19px] w-[19px]" />
              {count(wishlist.length)}
            </Link>
            <button type="button" className={iconBtn} aria-label={`סל קניות, ${bag.length} פריטים`} onClick={() => setBagOpen(true)}>
              <ShoppingBag strokeWidth={1.25} className="h-[19px] w-[19px]" />
              {count(bag.length)}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
