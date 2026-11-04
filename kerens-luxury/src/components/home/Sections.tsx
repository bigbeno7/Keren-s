"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { ArrowLeft, ArrowRight, ShieldCheck, ScanSearch, PackageCheck, Recycle } from "lucide-react";
import { Reveal } from "../Reveal";
import { ProductCard } from "../ProductCard";
import { DesignerName } from "../DesignerName";
import { ConditionMark } from "../ConditionMark";
import { WishButton } from "../WishButton";
import { useStore } from "../Store";
import { categories, designers } from "@/data/catalog";
import { products, newArrivals, getProduct } from "@/data/products";
import { formatPrice, cn } from "@/lib/format";
import { brand } from "@/config/brand";

/* Chapter heading — "פרק 01" editorial numbering */
export function Chapter({ n, en, title, children, light = false }: { n: string; en: string; title: React.ReactNode; children?: React.ReactNode; light?: boolean }) {
  return (
    <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className={cn("flex items-center gap-3 text-[0.78rem]", light ? "text-ivory/60" : "text-taupe")}>
          <span className="eyebrow-he">פרק {n}</span>
          <span className={cn("h-px w-8", light ? "bg-ivory/30" : "bg-espresso/20")} />
          <span className="eyebrow" dir="ltr">{en}</span>
        </p>
        <h2 className="display mt-4 text-[2.5rem] md:text-[3.6rem]">{title}</h2>
      </div>
      {children}
    </Reveal>
  );
}

/* ───────── Designer marquee ───────── */
export function DesignerMarquee() {
  const names = ["Chanel", "Hermès", "The Row", "Dior", "Bottega Veneta", "Max Mara", "Valentino", "Saint Laurent", "Loewe", "Cartier", "Alaïa", "Delvaux"];
  const row = (
    <div className="flex shrink-0 items-center">
      {names.map((n) => (
        <span key={n} className="flex items-center">
          <span className="latin px-7 text-[1.6rem] italic md:px-10 md:text-[2.1rem]">{n}</span>
          <span className="h-1 w-1 rotate-45 bg-champagne" />
        </span>
      ))}
    </div>
  );
  return (
    <section aria-label="בתי האופנה בבוטיק" className="overflow-hidden border-b border-espresso/10 bg-ivory py-6 md:py-8">
      <div dir="ltr" className="flex w-max animate-marquee text-espresso/85 hover:[animation-play-state:paused]">
        {row}
        {row}
      </div>
    </section>
  );
}

/* ───────── New arrivals rail ───────── */
export function NewArrivals() {
  const rail = useRef<HTMLDivElement>(null);
  const items = newArrivals();
  const scroll = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    // RTL: "next" moves toward the left
    el.scrollBy({ left: -dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  return (
    <section className="py-20 md:py-32" aria-labelledby="new-title">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <Chapter n="01" en="New Arrivals" title={<span id="new-title">הגיעו השבוע</span>}>
          <div className="flex items-center gap-6">
            <Link href="/collection?sort=new" className="link-luxe inline-flex items-center gap-2 text-[0.92rem]">
              לכל החידושים <ArrowLeft strokeWidth={1.25} className="h-4 w-4" />
            </Link>
            <div className="hidden gap-2 md:flex">
              <button type="button" onClick={() => scroll(-1)} aria-label="הקודם" className="grid h-11 w-11 place-items-center border border-espresso/20 transition-colors hover:border-espresso">
                <ArrowRight strokeWidth={1.25} className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => scroll(1)} aria-label="הבא" className="grid h-11 w-11 place-items-center border border-espresso/20 transition-colors hover:border-espresso">
                <ArrowLeft strokeWidth={1.25} className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Chapter>
      </div>
      <div
        ref={rail}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 md:mt-16 md:gap-6 md:scroll-px-12 md:px-12"
      >
        {items.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i, 4) * 0.08} className="w-[68vw] shrink-0 snap-start sm:w-[44vw] md:w-[30vw] lg:w-[23vw] 2xl:w-[340px]">
            <ProductCard p={p} sizes="(min-width: 1024px) 23vw, (min-width: 768px) 30vw, 68vw" />
          </Reveal>
        ))}
        <Link
          href="/collection?sort=new"
          className="group flex w-[68vw] shrink-0 snap-start flex-col items-center justify-center bg-cream text-center sm:w-[44vw] md:w-[30vw] lg:w-[23vw] 2xl:w-[340px]"
          style={{ aspectRatio: "4/5" }}
        >
          <span className="eyebrow text-taupe">Voir tout</span>
          <span className="display mt-3 text-3xl">לכל החידושים</span>
          <ArrowLeft strokeWidth={1} className="mt-6 h-6 w-6 transition-transform duration-500 group-hover:-translate-x-2" />
        </Link>
      </div>
    </section>
  );
}

/* ───────── Category mosaic ───────── */
export function CategoryMosaic() {
  const count = (id: string) => products.filter((p) => p.category === id).length;
  const layout = [
    "col-span-2 md:col-span-7 md:row-span-2 aspect-[4/5] md:aspect-auto",
    "col-span-2 md:col-span-5 aspect-[16/11] md:aspect-[5/4]",
    "col-span-1 md:col-span-5 aspect-[3/4] md:aspect-[5/4]",
    "col-span-1 md:col-span-6 aspect-[3/4] md:aspect-[16/10]",
    "col-span-2 md:col-span-6 aspect-[16/11] md:aspect-[16/10]",
  ];
  return (
    <section className="bg-cream py-20 md:py-32" aria-labelledby="cat-title">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <Chapter n="02" en="The Boutique" title={<span id="cat-title">לטייל בין המדפים</span>} />
        <div className="mt-12 grid grid-cols-2 gap-3 md:mt-16 md:grid-cols-12 md:gap-5">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.06} className={cn("relative", layout[i])}>
              <Link href={`/collection?category=${c.id}`} className="group absolute inset-0 block overflow-hidden bg-sand">
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes={i === 0 ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 768px) 42vw, 50vw"}
                  className="grade object-cover transition-transform duration-[1.8s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/5 to-transparent transition-opacity duration-700 group-hover:opacity-90" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-ivory md:p-8">
                  <div>
                    <p className="eyebrow text-ivory/75" dir="ltr">{c.en}</p>
                    <h3 className={cn("display mt-1", i === 0 ? "text-[2.6rem] md:text-[4rem]" : "text-[1.7rem] md:text-[2.6rem]")}>{c.he}</h3>
                    <p className={cn("mt-1 max-w-xs text-[0.9rem] text-ivory/80", i > 1 && "hidden md:block")}>{c.descriptionHe}</p>
                  </div>
                  <span className="hidden items-center gap-2 text-[0.82rem] text-ivory/80 md:inline-flex">
                    {count(c.id)} פריטים
                    <ArrowLeft strokeWidth={1.25} className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Brand story ───────── */
export function Story() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["22%", "-22%"]);
  return (
    <section id="story" ref={ref} className="overflow-hidden py-20 md:py-36" aria-labelledby="story-title">
      <div className="mx-auto grid max-w-[1600px] items-center gap-16 px-6 md:px-12 lg:grid-cols-12 lg:gap-10">
        <div className="relative lg:col-span-6 lg:col-start-7 lg:row-start-1">
          <motion.div style={{ y: y1 }} className="relative ms-auto aspect-[4/5] w-[82%] overflow-hidden bg-cream lg:w-[78%]">
            <Image src="/images/story-rack.jpg" alt="מתלה בגדים בגווני שמנת, חום וקרמל ליד קני סוף" fill sizes="(min-width: 1024px) 38vw, 82vw" className="grade object-cover" />
          </motion.div>
          <motion.div style={{ y: y2 }} className="absolute -bottom-10 right-0 aspect-[3/4] w-[44%] overflow-hidden border-[10px] border-ivory bg-cream md:w-[38%]">
            <Image src="/images/jw-pearls-d1.jpg" alt="מחרוזת פנינים בקופסה" fill sizes="(min-width: 1024px) 18vw, 44vw" className="grade object-cover" />
          </motion.div>
        </div>

        <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1">
          <Reveal>
            <p className="flex items-center gap-3 text-[0.78rem] text-taupe">
              <span className="eyebrow-he">פרק 03</span>
              <span className="h-px w-8 bg-espresso/20" />
              <span className="eyebrow" dir="ltr">Our Story</span>
            </p>
            <h2 id="story-title" className="display mt-5 text-[2.6rem] md:text-[3.8rem]">
              ארון פרטי,
              <br />
              <span className="italic text-mocha">שנאסף בסבלנות.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 space-y-5 text-[1.05rem] leading-[1.9] text-mocha">
              <p>
                <bdi className="latin text-espresso">{brand.name}</bdi> נולד מתוך אהבה לבגדים שיש להם עבר — מעיל שנלבש בערב אחד בפריז, תיק שעבר מיד ליד באהבה,
                עגילים שחיכו במגירה לרגע הנכון.
              </p>
              <p>אנחנו מחפשות, בודקות ובוחרות כל פריט בעצמנו. רק את מה שהיינו לובשות בעצמנו, רק במצב שהיינו גאות להעביר הלאה.</p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <blockquote className="mt-10 border-s border-champagne ps-6">
              <p className="display text-[1.6rem] italic leading-snug md:text-[1.9rem]">״יוקרה אמיתית לא נגמרת אצל הבעלים הראשונים.״</p>
              <footer className="mt-4 flex items-center gap-3 text-[0.85rem] text-taupe">
                <span className="display text-xl text-espresso">קרן</span> · מייסדת ואוצרת
              </footer>
            </blockquote>
          </Reveal>
          <Reveal delay={0.3}>
            <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-espresso/10 pt-8">
              {[
                ["1", "עותק מכל פריט"],
                ["48", "נקודות בדיקה"],
                ["4", "דרגות מצב שקופות"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="latin text-[2.6rem] leading-none">{n}</dd>
                  <dd className="mt-2 text-[0.82rem] text-taupe">{l}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────── Full-bleed campaign quote ───────── */
export function Campaign() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  return (
    <section ref={ref} className="relative h-[92svh] min-h-[560px] overflow-hidden bg-ink text-ivory" aria-label="קמפיין">
      <motion.div style={{ y }} className="absolute -inset-y-[14%] inset-x-0">
        <Image src="/images/campaign-arcade.jpg" alt="דמות במעיל ורוד עתיק בקולונדה של אבן" fill sizes="100vw" className="grade object-cover object-[50%_40%]" />
      </motion.div>
      <div className="absolute inset-0 bg-ink/40" />
      <div className="grain absolute inset-0" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <p className="eyebrow text-ivory/70" dir="ltr">Seconde Vie</p>
          <p className="display mx-auto mt-6 max-w-4xl text-[2.05rem] leading-[1.2] md:text-[4.4rem]">
            הפריטים היפים ביותר כבר נוצרו.
            <br />
            <span className="italic text-champagne-soft">אנחנו רק מוצאות להם בית חדש.</span>
          </p>
          <Link href="/collection" className="btn-outline btn-outline-light mt-10 border-ivory/60">לקולקציה המלאה</Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────── Keren's pick — spotlight ───────── */
export function Spotlight() {
  const p = getProduct("chanel-tweed-ruffle-coat")!;
  const { addToBag, inBag, setBagOpen, notify } = useStore();
  return (
    <section className="py-20 md:py-32" aria-labelledby="pick-title">
      <div className="mx-auto grid max-w-[1600px] items-center gap-10 px-6 md:grid-cols-2 md:gap-20 md:px-12">
        <Reveal className="relative">
          <Link href={`/product/${p.slug}`} className="group relative block aspect-[4/5] overflow-hidden bg-cream">
            <Image src={p.images[0]} alt={p.nameHe} fill sizes="(min-width: 768px) 50vw, 100vw" className="grade object-cover transition-transform duration-[1.8s] group-hover:scale-[1.04]" />
          </Link>
          <span className="latin absolute -top-5 left-6 bg-ivory px-3 text-[0.95rem] italic text-mocha md:-top-6 md:text-lg">N° {p.id.slice(2)}</span>
        </Reveal>
        <Reveal delay={0.1} className="md:max-w-lg">
          <p className="eyebrow text-taupe" dir="ltr" style={{ textAlign: "right" }}>The Curator’s Pick</p>
          <h2 id="pick-title" className="display mt-4 text-[2.4rem] md:text-[3.3rem]">הבחירה של קרן</h2>
          <div className="mt-8 border-t border-espresso/10 pt-8">
            <DesignerName slug={p.designer} className="text-[2rem] leading-none" />
            <p className="mt-2 text-lg text-mocha">{p.nameHe}</p>
            <p className="mt-6 leading-[1.9] text-mocha">{p.storyHe}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.9rem] text-taupe">
              <ConditionMark id={p.condition} long />
              <span>מידה <bdi>{p.size}</bdi></span>
              <span>שנת <bdi>{p.year}</bdi></span>
            </div>
            <p className="display mt-8 text-[1.8rem] tabular-nums">{formatPrice(p.price)}</p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="btn-primary flex-1"
                onClick={() => {
                  if (!inBag(p.id)) { addToBag(p.id); notify("נוסף לסל", "פריט לדוגמה · אינו זמין לרכישה"); }
                  setBagOpen(true);
                }}
              >
                {inBag(p.id) ? "צפייה בסל" : "הוספה לסל"}
              </button>
              <WishButton id={p.id} name={p.nameHe} variant="inline" />
            </div>
            <Link href={`/product/${p.slug}`} className="link-luxe mt-6 inline-flex items-center gap-2 text-[0.9rem]">
              לכל פרטי הפריט <ArrowLeft strokeWidth={1.25} className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────── Maisons index with cursor-following preview ───────── */
export function Maisons() {
  const featured = designers.filter((d) => products.some((p) => p.designer === d.slug)).slice(0, 12);
  const [hover, setHover] = useState<string | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 22 });
  const sy = useSpring(y, { stiffness: 180, damping: 22 });
  const box = useRef<HTMLDivElement>(null);
  const img = hover ? products.find((p) => p.designer === hover)?.images[0] : null;

  return (
    <section className="bg-espresso py-20 text-ivory md:py-32" aria-labelledby="maisons-title">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <Chapter light n="04" en="The Maisons" title={<span id="maisons-title">בתי האופנה</span>}>
          <Link href="/designers" className="link-luxe inline-flex items-center gap-2 text-[0.92rem] text-ivory/85">
            לכל בתי האופנה מא׳ עד ת׳ <ArrowLeft strokeWidth={1.25} className="h-4 w-4" />
          </Link>
        </Chapter>

        <div
          ref={box}
          className="relative mt-14 md:mt-20"
          onMouseMove={(e) => {
            const r = box.current!.getBoundingClientRect();
            x.set(e.clientX - r.left);
            y.set(e.clientY - r.top);
          }}
          onMouseLeave={() => setHover(null)}
        >
          <ul className="grid border-t border-ivory/15 md:grid-cols-2 md:gap-x-16">
            {featured.map((d, i) => {
              const n = products.filter((p) => p.designer === d.slug).length;
              return (
                <motion.li
                  key={d.slug}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: (i % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-ivory/15"
                >
                    <Link
                      href={`/collection?designer=${d.slug}`}
                      onMouseEnter={() => setHover(d.slug)}
                      className={cn("flex items-baseline justify-between py-5 transition-opacity duration-500 md:py-7", hover && hover !== d.slug && "md:opacity-35")}
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="latin text-[0.85rem] text-ivory/40 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                        <bdi dir="ltr" className="latin text-[1.9rem] leading-none md:text-[2.6rem]">{d.name}</bdi>
                      </span>
                      <span className="text-[0.8rem] text-ivory/50">{d.originHe} · {n} {n === 1 ? "פריט" : "פריטים"}</span>
                    </Link>
                </motion.li>
              );
            })}
          </ul>
          <AnimatePresence>
            {img && (
              <motion.div
                key={img}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                style={{ left: sx, top: sy }}
                className="pointer-events-none absolute z-10 hidden aspect-[4/5] w-56 -translate-x-1/2 -translate-y-1/2 overflow-hidden md:block"
              >
                <Image src={img} alt="" fill sizes="224px" className="grade object-cover" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ───────── Trust & authenticity ───────── */
export function Trust() {
  const pillars = [
    { icon: ShieldCheck, he: "אימות בידי מומחים", en: "Authentication", text: "כל פריט עובר בדיקה פיזית של חומרים, תפרים, חותמות ומספרים סידוריים לפני שהוא מגיע לבוטיק." },
    { icon: ScanSearch, he: "שקיפות מלאה במצב", en: "Condition", text: "דירוג בארבע דרגות, תיאור מילולי מדויק וצילומי תקריב של כל סימן — בלי הפתעות." },
    { icon: PackageCheck, he: "משלוח מבוטח ועטוף", en: "White-Glove Delivery", text: "אריזה בבד כותנה וקופסה חתומה. משלוח מבוטח עד הדלת או איסוף מהשואורום בתיאום." },
    { icon: Recycle, he: "מכירה בקונסיגנציה", en: "Consignment", text: "יש לך פריט שמחכה לפרק הבא? נצלם, נתמחר ונמצא לו בית חדש — את רק צריכה להחליט." },
  ];
  return (
    <section id="authenticity" className="bg-cream py-20 md:py-32" aria-labelledby="trust-title">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <Chapter n="05" en="Our Promise" title={<span id="trust-title">ההבטחה שלנו</span>} />
        <div className="mt-14 grid gap-px bg-espresso/10 sm:grid-cols-2 lg:grid-cols-4 md:mt-20">
          {pillars.map((p, i) => (
            <Reveal key={p.he} delay={i * 0.08} className="bg-cream p-8 md:p-10">
              <p.icon strokeWidth={0.9} className="h-9 w-9 text-mocha" />
              <p className="eyebrow mt-8 text-taupe" dir="ltr" style={{ textAlign: "right" }}>{p.en}</p>
              <h3 className="display mt-2 text-[1.7rem]">{p.he}</h3>
              <p className="mt-3 leading-[1.85] text-mocha">{p.text}</p>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-[0.8rem] text-taupe">
          באב-הטיפוס: התיאורים מציגים את השירות המתוכנן. הפריטים באתר הם לדוגמה בלבד ולא עברו אימות.
        </p>
      </div>
    </section>
  );
}

/* ───────── Consign CTA ───────── */
export function ConsignBand() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="sell-title">
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[4/3] md:aspect-auto">
          <Image src="/images/window-rack.jpg" alt="מתלה בגדים מאחורי חלון ראווה" fill sizes="(min-width: 768px) 50vw, 100vw" className="grade object-cover" />
        </div>
        <div className="flex flex-col justify-center bg-linen px-6 py-16 md:px-16 md:py-28 lg:px-24">
          <Reveal>
            <p className="eyebrow text-taupe" dir="ltr" style={{ textAlign: "right" }}>Consign with us</p>
            <h2 id="sell-title" className="display mt-4 text-[2.4rem] md:text-[3.3rem]">
              לכל פריט
              <br />
              <span className="italic text-mocha">מגיע פרק שני.</span>
            </h2>
            <p className="mt-6 max-w-md leading-[1.9] text-mocha">
              ספרי לנו על הפריט שלך — נחזור אלייך עם הערכת מחיר, נצלם אותו באולפן ונדאג לכל השאר. את מקבלת תשלום ברגע שהוא מוצא בית חדש.
            </p>
            <Link href="/sell" className="btn-primary mt-10">להתחיל למכור</Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
