"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { designers } from "@/data/catalog";
import { products } from "@/data/products";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/format";

const ease = [0.22, 1, 0.36, 1] as const;

export function DesignersView() {
  const [q, setQ] = useState("");
  const withCounts = useMemo(
    () =>
      designers
        .map((d) => ({ ...d, items: products.filter((p) => p.designer === d.slug) }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );
  const filtered = withCounts.filter((d) => d.name.toLowerCase().includes(q.trim().toLowerCase()));
  const letters = Array.from(new Set(filtered.map((d) => d.name[0].toUpperCase())));
  const featured = withCounts.filter((d) => ["chanel", "the-row", "bottega-veneta"].includes(d.slug));

  return (
    <div className="pt-[calc(64px+34px)] md:pt-[calc(76px+34px)]">
      <header className="mx-auto max-w-[1600px] px-6 pb-10 pt-12 md:px-12 md:pt-20">
        <p className="eyebrow text-taupe" dir="ltr" style={{ textAlign: "right" }}>The Maisons · A–Z</p>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="display mt-3 text-[2.9rem] md:text-[5rem]">
          בתי האופנה
        </motion.h1>
        <p className="mt-3 max-w-xl text-mocha">מהבתים ההיסטוריים של פריז ועד הקולות השקטים של ניו יורק — כל המעצבים שתמצאי אצלנו.</p>
      </header>

      {/* Featured maisons */}
      <section className="mx-auto grid max-w-[1600px] gap-3 px-6 md:grid-cols-3 md:gap-5 md:px-12" aria-label="בתי אופנה נבחרים">
        {featured.map((d, i) => (
          <Reveal key={d.slug} delay={i * 0.08}>
            <Link href={`/collection?designer=${d.slug}`} className="group relative block aspect-[4/5] overflow-hidden bg-cream md:aspect-[3/4]">
              <Image src={d.items[0].images[0]} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="grade object-cover transition-transform duration-[1.8s] group-hover:scale-[1.05]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-ivory">
                <bdi dir="ltr" className="latin block text-[2.4rem] leading-none">{d.name}</bdi>
                <p className="mt-2 text-[0.9rem] text-ivory/80">{d.noteHe}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </section>

      <section className="mx-auto max-w-[1600px] px-6 pb-28 pt-20 md:px-12" aria-labelledby="az-title">
        <div className="flex flex-col gap-6 border-b border-espresso pb-4 md:flex-row md:items-end md:justify-between">
          <h2 id="az-title" className="display text-[2rem]">כל בתי האופנה</h2>
          <label className="flex items-center gap-3 md:w-80">
            <Search strokeWidth={1.25} className="h-5 w-5 text-taupe" />
            <span className="sr-only">חיפוש בית אופנה</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="חיפוש מעצב…"
              className="h-11 w-full bg-transparent focus:outline-none"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-1" dir="ltr" aria-label="אינדקס אותיות">
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => {
            const on = letters.includes(l);
            return (
              <a
                key={l}
                href={on ? `#letter-${l}` : undefined}
                aria-disabled={!on}
                className={cn("latin grid h-9 w-9 place-items-center text-lg transition-colors", on ? "hover:bg-espresso hover:text-ivory" : "pointer-events-none text-sand")}
              >
                {l}
              </a>
            );
          })}
        </div>

        <div className="mt-10 space-y-12">
          {letters.map((l) => (
            <div key={l} id={`letter-${l}`} className="grid scroll-mt-32 gap-4 md:grid-cols-[120px_1fr]">
              <p className="latin text-[3.4rem] leading-none text-sand" dir="ltr">{l}</p>
              <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
                {filtered
                  .filter((d) => d.name[0].toUpperCase() === l)
                  .map((d) => (
                    <li key={d.slug} className="border-b border-espresso/10">
                      <Link href={`/collection?designer=${d.slug}`} className="group flex items-baseline justify-between py-4">
                        <bdi dir="ltr" className="latin text-[1.6rem] transition-transform duration-500 group-hover:-translate-x-1">{d.name}</bdi>
                        <span className="text-[0.8rem] text-taupe">{d.items.length > 0 ? `${d.items.length} ${d.items.length === 1 ? "פריט" : "פריטים"}` : "בקרוב"}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
          {letters.length === 0 && <p className="text-mocha">לא מצאנו בית אופנה בשם הזה — אבל אפשר לבקש שנחפש עבורך.</p>}
        </div>
      </section>
    </div>
  );
}
