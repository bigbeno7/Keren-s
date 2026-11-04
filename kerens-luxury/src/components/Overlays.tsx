"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, ArrowLeft, Search, Lock } from "lucide-react";
import { useStore } from "./Store";
import { navLinks } from "./Header";
import { products } from "@/data/products";
import { designers, getDesigner, getCategory } from "@/data/catalog";
import { formatPrice } from "@/lib/format";
import { DesignerName } from "./DesignerName";
import { brand } from "@/config/brand";

const ease = [0.22, 1, 0.36, 1] as const;

function useEscape(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const on = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [open, close]);
}

/* ───────────────────────── Mobile menu ───────────────────────── */
export function MobileMenu() {
  const { menuOpen, setMenuOpen, notify } = useStore();
  const close = () => setMenuOpen(false);
  useEscape(menuOpen, close);
  const items = [...navLinks, { href: "/sell", he: "מכרי איתנו", en: "Consign" }];

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="תפריט"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease }}
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ivory pt-[104px] lg:hidden"
        >
          <nav aria-label="ניווט במובייל" className="px-6">
            <ul>
              {items.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.8, ease }}
                  className="border-b border-espresso/10"
                >
                  <Link href={l.href} onClick={close} className="flex items-baseline justify-between py-[0.9rem]">
                    <span className="display text-[2rem]">{l.he}</span>
                    <span className="eyebrow text-taupe" dir="ltr">{l.en}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.8 }}
            className="mt-auto space-y-6 px-6 pt-10 safe-bottom"
          >
            <Link href="/product/chanel-tweed-ruffle-coat" onClick={close} className="flex items-center gap-4 bg-cream p-3">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden">
                <Image src="/images/rtw-coat.jpg" alt="" fill sizes="64px" className="grade object-cover" />
              </div>
              <div className="text-sm">
                <p className="eyebrow text-taupe">The Edit</p>
                <p className="mt-1">הבחירה של קרן לשבוע הזה</p>
              </div>
              <ArrowLeft strokeWidth={1.25} className="ms-auto h-4 w-4" />
            </Link>
            <div className="flex items-center justify-between text-[0.82rem] text-mocha">
              <button type="button" onClick={() => notify("אזור אישי — בקרוב", "התחברות לקוחות אינה חלק מאב-הטיפוס.")} className="link-luxe">
                התחברות
              </button>
              <a href="#contact" onClick={close} className="link-luxe">שירות לקוחות</a>
              <span dir="ltr" className="latin">{brand.instagramHandle}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────────── Search ───────────────────────── */
const suggestions = ["Chanel", "תיק ערב", "מעיל", "פנינים", "The Row", "וינטג׳"];

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const close = () => setSearchOpen(false);
  useEscape(searchOpen, close);

  useEffect(() => {
    if (searchOpen) setTimeout(() => input.current?.focus(), 350);
    else setQ("");
  }, [searchOpen]);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return products
      .filter((p) => {
        const d = getDesigner(p.designer);
        return [p.nameHe, d.name, p.colorHe, p.materialHe, getCategory(p.category).he, p.modelEn ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(t);
      })
      .slice(0, 6);
  }, [q]);
  const designerHits = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? designers.filter((d) => d.name.toLowerCase().includes(t)).slice(0, 4) : [];
  }, [q]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    close();
    router.push(`/collection?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div className="fixed inset-0 z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={close} aria-hidden />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="חיפוש בבוטיק"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.7, ease }}
            className="relative max-h-[100svh] overflow-y-auto bg-ivory px-5 pb-10 pt-6 md:px-12 md:pb-14"
          >
            <div className="mx-auto max-w-5xl">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-taupe">Search</span>
                <button type="button" onClick={close} aria-label="סגירת החיפוש" className="grid h-11 w-11 place-items-center -me-3">
                  <X strokeWidth={1.25} className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={submit} role="search" className="mt-4 flex items-center gap-4 border-b border-espresso pb-3">
                <Search strokeWidth={1.25} className="h-6 w-6 shrink-0 text-mocha" />
                <label htmlFor="site-search" className="sr-only">חיפוש פריטים, מעצבים וקטגוריות</label>
                <input
                  ref={input}
                  id="site-search"
                  type="search"
                  enterKeyHint="search"
                  autoComplete="off"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="מה תרצי לגלות?"
                  className="display w-full bg-transparent text-[1.75rem] placeholder:text-taupe/60 focus:outline-none md:text-[2.6rem]"
                />
              </form>

              {!q && (
                <div className="mt-8">
                  <p className="eyebrow-he text-taupe">חיפושים נפוצים</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button key={s} type="button" onClick={() => setQ(s)} className="border border-espresso/20 px-4 py-2 text-sm transition-colors hover:border-espresso">
                        <bdi>{s}</bdi>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {q && (
                <div className="mt-8" aria-live="polite">
                  {designerHits.length > 0 && (
                    <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2">
                      {designerHits.map((d) => (
                        <Link key={d.slug} href={`/collection?designer=${d.slug}`} onClick={close} className="latin link-luxe text-2xl">
                          <bdi dir="ltr">{d.name}</bdi>
                        </Link>
                      ))}
                    </div>
                  )}
                  {results.length > 0 ? (
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-6">
                      {results.map((p, i) => (
                        <motion.li key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                          <Link href={`/product/${p.slug}`} onClick={close} className="group block">
                            <div className="relative aspect-[4/5] overflow-hidden bg-cream">
                              <Image src={p.images[0]} alt={p.nameHe} fill sizes="200px" className="grade object-cover transition-transform duration-700 group-hover:scale-105" />
                            </div>
                            <DesignerName slug={p.designer} className="mt-2 block text-base" />
                            <p className="line-clamp-1 text-[0.8rem] text-mocha">{p.nameHe}</p>
                            <p className="text-[0.82rem] tabular-nums">{formatPrice(p.price)}</p>
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    designerHits.length === 0 && (
                      <p className="text-mocha">
                        לא מצאנו פריט שמתאים ל־<bdi>„{q}”</bdi>. נסי שם מעצב, צבע או סוג פריט.
                      </p>
                    )
                  )}
                  {results.length > 0 && (
                    <button type="button" onClick={submit} className="link-luxe mt-8 inline-flex items-center gap-2 text-sm">
                      לכל התוצאות בקולקציה <ArrowLeft strokeWidth={1.25} className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────────── Bag drawer ───────────────────────── */
export function BagDrawer() {
  const { bagOpen, setBagOpen, bag, removeFromBag, notify } = useStore();
  const close = () => setBagOpen(false);
  useEscape(bagOpen, close);
  const items = bag.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products;
  const subtotal = items.reduce((s, p) => s + p.price, 0);

  return (
    <AnimatePresence>
      {bagOpen && (
        <motion.div className="fixed inset-0 z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]" onClick={close} aria-hidden />
          {/* RTL: drawer slides in from the left (inline-end) edge */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="סל הקניות"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.7, ease }}
            className="absolute inset-y-0 left-0 flex w-full max-w-[440px] flex-col bg-ivory"
          >
            <div className="flex items-center justify-between border-b border-espresso/10 px-6 py-5">
              <div>
                <h2 className="display text-2xl">הסל שלך</h2>
                <p className="text-[0.8rem] text-taupe">{items.length === 0 ? "ריק לעת עתה" : `${items.length} ${items.length === 1 ? "פריט" : "פריטים"} · כל פריט יחיד במינו`}</p>
              </div>
              <button type="button" onClick={close} aria-label="סגירת הסל" className="grid h-11 w-11 place-items-center -me-3">
                <X strokeWidth={1.25} className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="display text-[1.6rem]">הסל מחכה לפריט הראשון</p>
                  <p className="mt-2 max-w-[18rem] text-sm text-mocha">כל פריט בבוטיק קיים בעותק אחד בלבד. כשמשהו מדבר אלייך — אל תחכי יותר מדי.</p>
                  <Link href="/collection" onClick={close} className="btn-outline mt-8">לגלות את הקולקציה</Link>
                </div>
              ) : (
                <ul className="divide-y divide-espresso/10">
                  <AnimatePresence initial={false}>
                    {items.map((p) => (
                      <motion.li key={p.id} layout exit={{ opacity: 0, height: 0 }} className="flex gap-4 py-5">
                        <Link href={`/product/${p.slug}`} onClick={close} className="relative h-[120px] w-24 shrink-0 overflow-hidden bg-cream">
                          <Image src={p.images[0]} alt={p.nameHe} fill sizes="96px" className="grade object-cover" />
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <DesignerName slug={p.designer} className="text-lg leading-tight" />
                          <p className="text-[0.85rem] text-mocha">{p.nameHe}</p>
                          {p.size && <p className="text-[0.78rem] text-taupe">מידה: <bdi>{p.size}</bdi></p>}
                          <div className="mt-auto flex items-end justify-between">
                            <span className="tabular-nums">{formatPrice(p.price)}</span>
                            <button type="button" onClick={() => removeFromBag(p.id)} className="link-luxe text-[0.78rem] text-mocha">הסרה</button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-espresso/10 px-6 pt-5 safe-bottom">
                <div className="flex items-baseline justify-between">
                  <span className="text-mocha">סכום ביניים</span>
                  <span className="display text-2xl tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                <p className="mt-1 text-[0.78rem] text-taupe">משלוח מבוטח עד הבית ללא עלות · אפשרות לאיסוף מהשואורום</p>
                <button
                  type="button"
                  className="btn-primary mt-5 w-full"
                  onClick={() => notify("תשלום אינו פעיל באב-הטיפוס", "בגרסה הסופית כאן יופיע תהליך רכישה מאובטח.")}
                >
                  <Lock strokeWidth={1.25} className="h-4 w-4" /> מעבר לתשלום מאובטח
                </button>
                <p className="mt-3 text-center text-[0.72rem] text-taupe">אב-טיפוס · לא יתבצע חיוב</p>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────────── Toasts ───────────────────────── */
export function Toasts() {
  const { toasts, dismiss } = useStore();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex flex-col items-center gap-2 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:items-start md:px-8" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, ease }}
            className="pointer-events-auto flex w-full max-w-sm items-start gap-4 bg-espresso px-5 py-4 text-ivory shadow-[0_20px_60px_-20px_rgba(28,19,13,0.5)]"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-champagne" />
            <div className="flex-1">
              <p className="text-[0.92rem]">{t.title}</p>
              {t.body && <p className="mt-0.5 text-[0.8rem] text-ivory/65">{t.body}</p>}
            </div>
            <button type="button" onClick={() => dismiss(t.id)} aria-label="סגירה" className="-m-1 p-1 text-ivory/60 hover:text-ivory">
              <X strokeWidth={1.25} className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
