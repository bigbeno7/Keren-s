"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { SlidersHorizontal, X, ChevronDown, Check, Rows2, Grid2x2 } from "lucide-react";
import { products } from "@/data/products";
import { categories, conditions, designers, getCategory, getDesigner } from "@/data/catalog";
import type { CategoryId, ConditionId } from "@/data/types";
import { ProductCard } from "../ProductCard";
import { cn } from "@/lib/format";

const ease = [0.22, 1, 0.36, 1] as const;

const priceBuckets = [
  { id: "u3", he: "עד 3,000 ₪", test: (n: number) => n <= 3000 },
  { id: "3-8", he: "3,000–8,000 ₪", test: (n: number) => n > 3000 && n <= 8000 },
  { id: "8-15", he: "8,000–15,000 ₪", test: (n: number) => n > 8000 && n <= 15000 },
  { id: "o15", he: "מעל 15,000 ₪", test: (n: number) => n > 15000 },
];

const sorts = [
  { id: "curated", he: "בחירת האוצרת" },
  { id: "new", he: "החדשים ביותר" },
  { id: "price-asc", he: "מחיר: מהנמוך לגבוה" },
  { id: "price-desc", he: "מחיר: מהגבוה לנמוך" },
];

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);

export function CollectionView() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const category = (params.get("category") as CategoryId | null) ?? null;
  const designerSel = list(params.get("designer"));
  const conditionSel = list(params.get("condition")) as ConditionId[];
  const priceSel = list(params.get("price"));
  const q = params.get("q") ?? "";
  const sort = params.get("sort") ?? "curated";

  const [sheet, setSheet] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [dense, setDense] = useState(true);

  useEffect(() => {
    document.documentElement.style.overflow = sheet ? "hidden" : "";
  }, [sheet]);

  const update = (key: string, value: string | string[] | null) => {
    const next = new URLSearchParams(params.toString());
    const v = Array.isArray(value) ? value.join(",") : value;
    if (v) next.set(key, v);
    else next.delete(key);
    router.replace(`${pathname}${next.toString() ? `?${next}` : ""}`, { scroll: false });
  };
  const toggleIn = (key: string, arr: string[], v: string) => update(key, arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const clearAll = () => router.replace(category ? `${pathname}?category=${category}` : pathname, { scroll: false });

  // Base set: category + search; facet counts are computed against this.
  const base = useMemo(() => {
    const t = q.trim().toLowerCase();
    return products.filter((p) => {
      if (category && p.category !== category) return false;
      if (t) {
        const hay = [p.nameHe, getDesigner(p.designer).name, p.colorHe, p.materialHe, getCategory(p.category).he, p.modelEn ?? ""].join(" ").toLowerCase();
        if (!hay.includes(t)) return false;
      }
      return true;
    });
  }, [category, q]);

  const results = useMemo(() => {
    const r = base.filter(
      (p) =>
        (!designerSel.length || designerSel.includes(p.designer)) &&
        (!conditionSel.length || conditionSel.includes(p.condition)) &&
        (!priceSel.length || priceBuckets.some((b) => priceSel.includes(b.id) && b.test(p.price))),
    );
    if (sort === "new") r.sort((a, b) => a.addedDaysAgo - b.addedDaysAgo);
    if (sort === "price-asc") r.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r.sort((a, b) => b.price - a.price);
    return r;
  }, [base, designerSel, conditionSel, priceSel, sort]);

  const designerFacets = designers
    .map((d) => ({ ...d, n: base.filter((p) => p.designer === d.slug).length }))
    .filter((d) => d.n > 0 || designerSel.includes(d.slug))
    .sort((a, b) => a.name.localeCompare(b.name));

  const activeCount = designerSel.length + conditionSel.length + priceSel.length;
  const cat = category ? getCategory(category) : null;
  const title = q ? <>תוצאות עבור <bdi>„{q}”</bdi></> : cat ? cat.he : sort === "new" ? "חדש בבוטיק" : "הקולקציה";
  const enTitle = q ? "Search" : cat ? cat.en : sort === "new" ? "New Arrivals" : "The Collection";

  const Filters = (
    <div className="space-y-2">
      <FacetGroup title="בתי אופנה" count={designerSel.length} defaultOpen>
        <ul className="max-h-[320px] space-y-0.5 overflow-y-auto pe-1">
          {designerFacets.map((d) => (
            <li key={d.slug}>
              <CheckRow checked={designerSel.includes(d.slug)} onChange={() => toggleIn("designer", designerSel, d.slug)} count={d.n}>
                <bdi dir="ltr" className="latin text-[1.08rem]">{d.name}</bdi>
              </CheckRow>
            </li>
          ))}
        </ul>
      </FacetGroup>
      <FacetGroup title="מצב הפריט" count={conditionSel.length} defaultOpen>
        <ul className="space-y-0.5">
          {conditions.map((c) => (
            <li key={c.id}>
              <CheckRow checked={conditionSel.includes(c.id)} onChange={() => toggleIn("condition", conditionSel, c.id)} count={base.filter((p) => p.condition === c.id).length}>
                {c.he}
              </CheckRow>
            </li>
          ))}
        </ul>
      </FacetGroup>
      <FacetGroup title="טווח מחירים" count={priceSel.length} defaultOpen>
        <ul className="space-y-0.5">
          {priceBuckets.map((b) => (
            <li key={b.id}>
              <CheckRow checked={priceSel.includes(b.id)} onChange={() => toggleIn("price", priceSel, b.id)} count={base.filter((p) => b.test(p.price)).length}>
                {b.he}
              </CheckRow>
            </li>
          ))}
        </ul>
      </FacetGroup>
    </div>
  );

  return (
    <div className="pt-[calc(64px+34px)] md:pt-[calc(76px+34px)]">
      {/* Page header */}
      <header className="mx-auto max-w-[1600px] px-6 pb-8 pt-12 md:px-12 md:pb-12 md:pt-20">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="eyebrow text-taupe" dir="ltr" style={{ textAlign: "right" }}>
          {enTitle}
        </motion.p>
        <motion.h1 key={String(enTitle) + q} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="display mt-3 text-[2.9rem] md:text-[5rem]">
          {title}
        </motion.h1>
        <p className="mt-3 max-w-xl text-mocha">
          {cat ? cat.descriptionHe : "פריטים יחידים במינם מבתי האופנה הגדולים, נבחרו אחד־אחד."}
          <span className="text-taupe"> · מלאי לדוגמה</span>
        </p>
      </header>

      {/* Category tabs */}
      <nav aria-label="קטגוריות" className="sticky top-16 z-30 border-y border-espresso/10 bg-ivory/92 backdrop-blur-xl md:top-[76px]">
        <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-6 md:px-12">
          <ul className="no-scrollbar -mx-1 flex flex-1 gap-1 overflow-x-auto py-1">
            {[{ id: null, he: "הכל" }, ...categories].map((c) => {
              const on = (c.id ?? null) === category;
              return (
                <li key={c.he} className="shrink-0">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      const next = new URLSearchParams();
                      if (c.id) next.set("category", c.id);
                      if (sort !== "curated") next.set("sort", sort);
                      router.replace(`${pathname}${next.toString() ? `?${next}` : ""}`, { scroll: false });
                    }}
                    className={cn("relative px-3 py-3 text-[0.92rem] transition-colors", on ? "text-espresso" : "text-taupe hover:text-espresso")}
                  >
                    {c.he}
                    {on && <motion.span layoutId="cat-underline" className="absolute inset-x-3 bottom-1.5 h-px bg-espresso" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="mx-auto max-w-[1600px] px-6 pb-24 pt-6 md:px-12 md:pt-10">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setSheet(true)} className="inline-flex h-11 items-center gap-2 border border-espresso/20 px-4 text-[0.88rem] lg:hidden">
              <SlidersHorizontal strokeWidth={1.25} className="h-4 w-4" /> סינון
              {activeCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-espresso px-1 text-[0.7rem] text-ivory">{activeCount}</span>}
            </button>
            <p className="hidden text-[0.88rem] text-taupe lg:block" aria-live="polite">
              {results.length} פריטים
            </p>
          </div>
          <div className="flex items-center gap-1">
            <p className="me-2 text-[0.85rem] text-taupe lg:hidden" aria-live="polite">{results.length} פריטים</p>
            <button
              type="button"
              onClick={() => setDense(!dense)}
              className="grid h-11 w-11 place-items-center md:hidden"
              aria-label={dense ? "תצוגת פריט אחד בשורה" : "תצוגת שני פריטים בשורה"}
            >
              {dense ? <Rows2 strokeWidth={1.25} className="h-[18px] w-[18px]" /> : <Grid2x2 strokeWidth={1.25} className="h-[18px] w-[18px]" />}
            </button>
            <div className="relative">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
                onClick={() => setSortOpen(!sortOpen)}
                className="inline-flex h-11 items-center gap-2 text-[0.88rem]"
              >
                <span className="hidden text-taupe sm:inline">מיון:</span> {sorts.find((s) => s.id === sort)?.he}
                <ChevronDown strokeWidth={1.25} className={cn("h-4 w-4 transition-transform", sortOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setSortOpen(false)} aria-hidden />
                    <motion.ul
                      role="listbox"
                      aria-label="מיון"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="absolute left-0 top-full z-40 mt-1 w-60 border border-espresso/10 bg-ivory py-2 shadow-[0_24px_60px_-24px_rgba(28,19,13,0.35)]"
                    >
                      {sorts.map((s) => (
                        <li key={s.id} role="option" aria-selected={s.id === sort}>
                          <button
                            type="button"
                            onClick={() => { update("sort", s.id === "curated" ? null : s.id); setSortOpen(false); }}
                            className="flex w-full items-center justify-between px-5 py-2.5 text-start text-[0.9rem] hover:bg-cream"
                          >
                            {s.he}
                            {s.id === sort && <Check strokeWidth={1.25} className="h-4 w-4" />}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Active filter pills */}
        <AnimatePresence initial={false}>
          {(activeCount > 0 || q) && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="flex flex-wrap items-center gap-2 pt-4">
                {q && <Pill onRemove={() => update("q", null)}>חיפוש: <bdi>{q}</bdi></Pill>}
                {designerSel.map((d) => (
                  <Pill key={d} onRemove={() => toggleIn("designer", designerSel, d)}><bdi dir="ltr" className="latin text-[1rem]">{getDesigner(d)?.name}</bdi></Pill>
                ))}
                {conditionSel.map((c) => (
                  <Pill key={c} onRemove={() => toggleIn("condition", conditionSel, c)}>{conditions.find((x) => x.id === c)?.he}</Pill>
                ))}
                {priceSel.map((b) => (
                  <Pill key={b} onRemove={() => toggleIn("price", priceSel, b)}>{priceBuckets.find((x) => x.id === b)?.he}</Pill>
                ))}
                <button type="button" onClick={() => { clearAll(); }} className="link-luxe ms-2 text-[0.82rem] text-mocha">ניקוי הכל</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 grid gap-12 lg:grid-cols-[250px_1fr] lg:gap-14">
          <aside className="hidden lg:block" aria-label="סינון">
            <div className="sticky top-[150px]">{Filters}</div>
          </aside>

          <div>
            {results.length === 0 ? (
              <div className="flex flex-col items-center py-24 text-center">
                <p className="display text-3xl">לא נמצאו פריטים</p>
                <p className="mt-3 max-w-sm text-mocha">אולי כדאי להרחיב את הסינון? פריטים חדשים מגיעים לבוטיק בכל שבוע.</p>
                <button type="button" onClick={clearAll} className="btn-outline mt-8">ניקוי הסינון</button>
              </div>
            ) : (
              <motion.ul layout className={cn("grid gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-14 xl:grid-cols-4", dense ? "grid-cols-2" : "grid-cols-1")}>
                <AnimatePresence mode="popLayout">
                  {results.map((p, i) => (
                    <motion.li
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.7, delay: Math.min(i, 8) * 0.04, ease }}
                    >
                      <ProductCard p={p} priority={i < 4} sizes={dense ? "(min-width: 1280px) 20vw, (min-width: 768px) 28vw, 50vw" : "(min-width: 768px) 28vw, 100vw"} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter sheet */}
      <AnimatePresence>
        {sheet && (
          <motion.div className="fixed inset-0 z-[60] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-ink/35" onClick={() => setSheet(false)} aria-hidden />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="סינון פריטים"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.6, ease }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => info.offset.y > 120 && setSheet(false)}
              className="absolute inset-x-0 bottom-0 flex max-h-[88svh] flex-col rounded-t-[18px] bg-ivory"
            >
              <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-espresso/15" aria-hidden />
              <div className="flex items-center justify-between px-6 pb-2 pt-3">
                <h2 className="display text-2xl">סינון</h2>
                <button type="button" onClick={() => setSheet(false)} aria-label="סגירה" className="-me-3 grid h-11 w-11 place-items-center">
                  <X strokeWidth={1.25} className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 pb-4">{Filters}</div>
              <div className="flex gap-3 border-t border-espresso/10 px-6 pt-4 safe-bottom">
                <button type="button" onClick={clearAll} className="btn-outline flex-1 px-4">ניקוי</button>
                <button type="button" onClick={() => setSheet(false)} className="btn-primary flex-[2] px-4">הצגת {results.length} פריטים</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FacetGroup({ title, count, children, defaultOpen = false }: { title: string; count: number; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-espresso/10 pb-2">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between py-4 text-[0.95rem] font-medium">
        <span>
          {title}
          {count > 0 && <span className="ms-2 text-taupe">({count})</span>}
        </span>
        <ChevronDown strokeWidth={1.25} className={cn("h-4 w-4 transition-transform duration-500", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }} className="overflow-hidden">
            <div className="pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckRow({ checked, onChange, count, children }: { checked: boolean; onChange: () => void; count: number; children: React.ReactNode }) {
  return (
    <label className={cn("flex min-h-10 cursor-pointer items-center gap-3 py-1 text-[0.92rem]", count === 0 && !checked && "opacity-40")}>
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} />
      <span className="grid h-[18px] w-[18px] shrink-0 place-items-center border border-espresso/40 transition-colors peer-checked:border-espresso peer-checked:bg-espresso peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2">
        {checked && <Check strokeWidth={2} className="h-3 w-3 text-ivory" />}
      </span>
      <span className="flex-1">{children}</span>
      <span className="text-[0.78rem] text-taupe tabular-nums">{count}</span>
    </label>
  );
}

function Pill({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <motion.button
      layout
      type="button"
      onClick={onRemove}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex h-9 items-center gap-2 bg-cream px-3 text-[0.85rem] transition-colors hover:bg-linen"
      aria-label="הסרת מסנן"
    >
      {children}
      <X strokeWidth={1.25} className="h-3.5 w-3.5" />
    </motion.button>
  );
}

