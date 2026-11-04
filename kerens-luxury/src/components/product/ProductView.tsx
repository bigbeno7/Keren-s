"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, X, ArrowLeft, ArrowRight, ShieldCheck, Truck, MessageCircle, Expand, Info } from "lucide-react";
import type { Product } from "@/data/types";
import { getCategory, getCondition, getDesigner, conditions } from "@/data/catalog";
import { formatPrice, cn } from "@/lib/format";
import { useStore } from "../Store";
import { WishButton } from "../WishButton";
import { DesignerName } from "../DesignerName";
import { ConditionMark } from "../ConditionMark";
import { ProductCard } from "../ProductCard";
import { Reveal } from "../Reveal";

const ease = [0.22, 1, 0.36, 1] as const;

function Gallery({ p }: { p: Product }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);
  const track = useRef<HTMLDivElement>(null);

  // Mobile: sync dots with native scroll-snap position (RTL-safe using abs()).
  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    setActive(Math.round(Math.abs(el.scrollLeft) / el.clientWidth));
  };
  const goTo = (i: number) => {
    setActive(i);
    const el = track.current;
    if (el && getComputedStyle(el).overflowX !== "visible") el.scrollTo({ left: -i * el.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    if (zoom === null) return;
    document.documentElement.style.overflow = "hidden";
    const on = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(null);
      if (e.key === "ArrowLeft") setZoom((z) => (z === null ? z : (z + 1) % p.images.length));
      if (e.key === "ArrowRight") setZoom((z) => (z === null ? z : (z - 1 + p.images.length) % p.images.length));
    };
    window.addEventListener("keydown", on);
    return () => { window.removeEventListener("keydown", on); document.documentElement.style.overflow = ""; };
  }, [zoom, p.images.length]);

  return (
    <div className="lg:flex lg:gap-5">
      {/* Desktop thumbnails (start side = right) */}
      <div className="hidden w-20 shrink-0 flex-col gap-3 lg:flex">
        {p.images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`תמונה ${i + 1}`}
            aria-current={active === i}
            className={cn("relative aspect-[4/5] overflow-hidden transition-opacity duration-500", active === i ? "opacity-100 outline outline-1 outline-offset-2 outline-espresso" : "opacity-55 hover:opacity-100")}
          >
            <Image src={src} alt="" fill sizes="80px" className="grade object-cover" />
          </button>
        ))}
      </div>

      <div className="relative flex-1">
        {/* Mobile: swipe track. Desktop: single cross-fading stage. */}
        <div
          ref={track}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto lg:hidden"
          aria-roledescription="קרוסלה"
          aria-label="גלריית תמונות"
        >
          {p.images.map((src, i) => (
            <button key={src} type="button" onClick={() => setZoom(i)} className="relative aspect-[4/5] w-full shrink-0 snap-center bg-cream" aria-label={`הגדלת תמונה ${i + 1}`}>
              <Image src={src} alt={i === 0 ? p.nameHe : `${p.nameHe} — פרט ${i}`} fill priority={i === 0} sizes="100vw" className="grade object-cover" />
            </button>
          ))}
        </div>

        <div className="relative hidden aspect-[4/5] overflow-hidden bg-cream lg:block">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.button
              key={active}
              type="button"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease }}
              onClick={() => setZoom(active)}
              className="group absolute inset-0 cursor-zoom-in"
              aria-label="הגדלת התמונה"
            >
              <Image src={p.images[active]} alt={active === 0 ? p.nameHe : `${p.nameHe} — פרט ${active}`} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="grade object-cover" />
              <span className="absolute bottom-5 left-5 grid h-10 w-10 place-items-center rounded-full bg-ivory/80 opacity-0 backdrop-blur transition-opacity duration-500 group-hover:opacity-100">
                <Expand strokeWidth={1.25} className="h-4 w-4" />
              </span>
            </motion.button>
          </AnimatePresence>
          <div className="absolute inset-y-0 right-0 flex items-center pe-0 ps-3">
            <button type="button" onClick={() => goTo((active - 1 + p.images.length) % p.images.length)} aria-label="התמונה הקודמת" className="grid h-11 w-11 place-items-center rounded-full bg-ivory/70 backdrop-blur transition-colors hover:bg-ivory">
              <ArrowRight strokeWidth={1.25} className="h-4 w-4" />
            </button>
          </div>
          <div className="absolute inset-y-0 left-0 flex items-center ps-0 pe-3">
            <button type="button" onClick={() => goTo((active + 1) % p.images.length)} aria-label="התמונה הבאה" className="grid h-11 w-11 place-items-center rounded-full bg-ivory/70 backdrop-blur transition-colors hover:bg-ivory">
              <ArrowLeft strokeWidth={1.25} className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile progress */}
        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5 lg:hidden" aria-hidden>
          {p.images.map((_, i) => (
            <span key={i} className={cn("h-[2px] transition-all duration-500", active === i ? "w-8 bg-espresso" : "w-4 bg-espresso/25")} />
          ))}
        </div>
        <WishButton id={p.id} name={p.nameHe} className="absolute top-4 left-4 lg:hidden" />
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {zoom !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="תצוגה מוגדלת"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-ivory"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={zoom} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0">
                <Image src={p.images[zoom]} alt="" fill sizes="100vw" className="grade object-contain" />
              </motion.div>
            </AnimatePresence>
            <button type="button" onClick={() => setZoom(null)} aria-label="סגירה" className="absolute top-[max(1rem,env(safe-area-inset-top))] left-4 grid h-12 w-12 place-items-center rounded-full bg-ivory/80 backdrop-blur">
              <X strokeWidth={1.25} className="h-5 w-5" />
            </button>
            <div className="absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] flex items-center justify-center gap-6">
              <button type="button" onClick={() => setZoom((zoom - 1 + p.images.length) % p.images.length)} aria-label="הקודמת" className="grid h-12 w-12 place-items-center rounded-full bg-ivory/80 backdrop-blur">
                <ArrowRight strokeWidth={1.25} className="h-5 w-5" />
              </button>
              <span className="latin text-lg tabular-nums" dir="ltr">{zoom + 1} / {p.images.length}</span>
              <button type="button" onClick={() => setZoom((zoom + 1) % p.images.length)} aria-label="הבאה" className="grid h-12 w-12 place-items-center rounded-full bg-ivory/80 backdrop-blur">
                <ArrowLeft strokeWidth={1.25} className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-espresso/10">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-full items-center justify-between py-5 text-[0.98rem]">
        {title}
        <ChevronDown strokeWidth={1.25} className={cn("h-4 w-4 transition-transform duration-500", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease }} className="overflow-hidden">
            <div className="pb-6 text-[0.95rem] leading-[1.85] text-mocha">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductView({ p, related }: { p: Product; related: Product[] }) {
  const { addToBag, inBag, setBagOpen, notify } = useStore();
  const d = getDesigner(p.designer);
  const c = getCondition(p.condition);
  const cat = getCategory(p.category);
  const added = inBag(p.id);
  const buyRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const add = () => {
    if (!added) {
      addToBag(p.id);
      notify("נוסף לסל", "פריט לדוגמה · אינו זמין לרכישה");
    }
    setBagOpen(true);
  };

  const specs: [string, React.ReactNode][] = [
    ["בית אופנה", <bdi key="d" dir="ltr" className="latin text-[1.05rem]">{d.name}</bdi>],
    ...(p.modelEn ? ([["דגם", <bdi key="m" dir="ltr" className="latin text-[1.05rem]">{p.modelEn}</bdi>]] as [string, React.ReactNode][]) : []),
    ["שנה", <bdi key="y">{p.year}</bdi>],
    ["צבע", p.colorHe],
    ["חומר", p.materialHe],
    ...(p.size ? ([["מידה", <bdi key="s" dir="ltr">{p.size}</bdi>]] as [string, React.ReactNode][]) : []),
    ...(p.measurementsHe ? ([["מידות", p.measurementsHe]] as [string, React.ReactNode][]) : []),
    ["מספר פריט", <bdi key="id" dir="ltr" className="latin">{p.id}</bdi>],
  ];

  return (
    <div className="pt-[calc(64px+34px)] md:pt-[calc(76px+34px)]">
      {/* Breadcrumb */}
      <nav aria-label="מיקום באתר" className="mx-auto hidden max-w-[1600px] px-12 pt-8 text-[0.82rem] text-taupe lg:block">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="link-luxe">דף הבית</Link></li>
          <li aria-hidden>/</li>
          <li><Link href={`/collection?category=${cat.id}`} className="link-luxe">{cat.he}</Link></li>
          <li aria-hidden>/</li>
          <li><Link href={`/collection?designer=${d.slug}`} className="link-luxe"><bdi dir="ltr">{d.name}</bdi></Link></li>
        </ol>
      </nav>

      <div className="mx-auto grid max-w-[1600px] gap-8 lg:grid-cols-12 lg:gap-16 lg:px-12 lg:pt-8">
        <div className="lg:col-span-7">
          <Gallery p={p} />
        </div>

        <div className="px-6 lg:col-span-5 lg:px-0">
          <div className="lg:sticky lg:top-[120px]">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease }}>
              <p className="inline-flex items-center gap-2 bg-cream px-3 py-1.5 text-[0.75rem] text-mocha">
                <Info strokeWidth={1.25} className="h-3.5 w-3.5" /> פריט לדוגמה · אב-טיפוס · אינו זמין לרכישה
              </p>
              <Link href={`/collection?designer=${d.slug}`} className="mt-6 block">
                <DesignerName slug={p.designer} className="text-[2.4rem] leading-none md:text-[2.8rem]" />
              </Link>
              <h1 className="display mt-3 text-[1.5rem] text-mocha md:text-[1.75rem]">{p.nameHe}</h1>

              <div className="mt-6 flex items-end justify-between border-b border-espresso/10 pb-6">
                <div>
                  <p className="display text-[2rem] tabular-nums">{formatPrice(p.price)}</p>
                  {p.estimatedRetail && (
                    <p className="mt-1 text-[0.8rem] text-taupe">מחיר קטלוגי משוער בחנות: <span className="tabular-nums">{formatPrice(p.estimatedRetail)}</span></p>
                  )}
                </div>
                <ConditionMark id={p.condition} long className="text-[0.88rem]" />
              </div>

              {p.size && (
                <div className="mt-6 flex items-center justify-between text-[0.92rem]">
                  <span>מידה: <bdi dir="ltr" className="font-medium">{p.size}</bdi></span>
                  <button type="button" onClick={() => notify("מדריך מידות — בקרוב", "יופיע בגרסה הבאה של האתר.")} className="link-luxe text-taupe">מדריך מידות</button>
                </div>
              )}

              <div ref={buyRef} className="mt-6 flex gap-3">
                <button type="button" onClick={add} className="btn-primary flex-1">
                  {added ? "בסל · צפייה בסל" : "הוספה לסל"}
                </button>
                <WishButton id={p.id} name={p.nameHe} variant="inline" />
              </div>
              <button
                type="button"
                onClick={() => notify("שיחה עם סטייליסטית — בקרוב", "בגרסה הסופית: קישור ישיר לווטסאפ של הבוטיק.")}
                className="mt-3 flex h-[52px] w-full items-center justify-center gap-2 border border-espresso/20 text-[0.9rem] transition-colors hover:border-espresso"
              >
                <MessageCircle strokeWidth={1.25} className="h-4 w-4" /> שאלה על הפריט? דברי איתנו
              </button>

              <ul className="mt-6 space-y-2 text-[0.85rem] text-mocha">
                <li className="flex items-center gap-3"><Truck strokeWidth={1.1} className="h-4 w-4" /> משלוח מבוטח עד הבית או איסוף מהשואורום</li>
                <li className="flex items-center gap-3"><ShieldCheck strokeWidth={1.1} className="h-4 w-4" /> תהליך אימות מקצועי (בשירות הסופי)</li>
              </ul>

              <p className="mt-8 text-[1.02rem] leading-[1.9] text-mocha">{p.storyHe}</p>

              <div className="mt-8 border-t border-espresso/10">
                <Accordion title="פרטי הפריט" defaultOpen>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2.5">
                    {specs.map(([k, v]) => (
                      <div key={k} className="contents">
                        <dt className="text-taupe">{k}</dt>
                        <dd className="text-espresso">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </Accordion>
                <Accordion title={`מצב: ${c.he}`}>
                  <p className="text-espresso">{p.conditionNotesHe}</p>
                  <ul className="mt-5 space-y-3">
                    {conditions.map((x) => (
                      <li key={x.id} className={cn("flex gap-3", x.id !== c.id && "opacity-50")}>
                        <ConditionMark id={x.id} className="w-28 shrink-0" />
                        <span className="text-[0.85rem]">{x.descriptionHe}</span>
                      </li>
                    ))}
                  </ul>
                </Accordion>
                <Accordion title="מה מגיע עם הפריט">
                  {p.includesHe.length ? (
                    <ul className="list-inside list-disc marker:text-champagne">
                      {p.includesHe.map((x) => <li key={x}>{x}</li>)}
                    </ul>
                  ) : (
                    <p>הפריט מגיע עטוף בבד כותנה ובקופסת <bdi>KEREN’S</bdi>, ללא אביזרים מקוריים.</p>
                  )}
                </Accordion>
                <Accordion title="אותנטיות">
                  <p>בשירות הסופי, כל פריט ייבדק פיזית לפני העלאתו לאתר: חומרים, תפרים, חותמות, מספרים סידוריים ואביזרי מתכת.</p>
                  <p className="mt-3 text-espresso">שימו לב: זהו פריט לדוגמה באב-טיפוס עיצובי. הוא לא נבדק ואינו מוצע למכירה.</p>
                </Accordion>
                <Accordion title="משלוחים והחזרות">
                  <p>משלוח מבוטח עד הבית בתוך 2–4 ימי עסקים, או איסוף מהשואורום בתל אביב בתיאום מראש. אפשרות להחזרה בתוך 14 יום בהתאם לחוק הגנת הצרכן.</p>
                  <p className="mt-3 text-[0.82rem] text-taupe">(נוסח לדוגמה — מדיניות סופית תיקבע בהמשך)</p>
                </Accordion>
              </div>

              <div className="mt-10 bg-cream p-6">
                <p className="eyebrow text-taupe" dir="ltr" style={{ textAlign: "right" }}>About the Maison</p>
                <p className="mt-2"><bdi dir="ltr" className="latin text-xl">{d.name}</bdi> <span className="text-taupe">· {d.originHe}, <bdi>{d.founded}</bdi></span></p>
                <p className="mt-2 text-[0.92rem] text-mocha">{d.noteHe}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-32" aria-labelledby="rel-title">
          <Reveal className="flex items-end justify-between">
            <div>
              <p className="eyebrow text-taupe" dir="ltr" style={{ textAlign: "right" }}>You May Also Love</p>
              <h2 id="rel-title" className="display mt-3 text-[2.2rem] md:text-[3rem]">אולי תאהבי גם</h2>
            </div>
            <Link href={`/collection?category=${p.category}`} className="link-luxe hidden items-center gap-2 text-[0.9rem] md:inline-flex">
              לכל ה{cat.he} <ArrowLeft strokeWidth={1.25} className="h-4 w-4" />
            </Link>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {related.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.06}>
                <ProductCard p={r} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Mobile sticky purchase bar */}
      <AnimatePresence>
        {showBar && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.5, ease }}
            className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t border-espresso/10 bg-ivory/95 px-5 pt-3 backdrop-blur-xl safe-bottom lg:hidden"
          >
            <div className="min-w-0 flex-1">
              <DesignerName slug={p.designer} className="block truncate text-[1.05rem] leading-tight" />
              <p className="text-[0.88rem] tabular-nums">{formatPrice(p.price)}</p>
            </div>
            <button type="button" onClick={add} className="btn-primary min-h-[46px] px-6">{added ? "צפייה בסל" : "הוספה לסל"}</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
