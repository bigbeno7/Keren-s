"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/types";
import { formatPrice, cn } from "@/lib/format";
import { DesignerName } from "./DesignerName";
import { ConditionMark } from "./ConditionMark";
import { WishButton } from "./WishButton";

export function ProductCard({ p, priority = false, sizes, className }: { p: Product; priority?: boolean; sizes?: string; className?: string }) {
  const isNew = p.addedDaysAgo <= 5;
  return (
    <article className={cn("group relative", className)}>
      <Link href={`/product/${p.slug}`} className="block" aria-label={`${p.nameHe} — ${formatPrice(p.price)}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-cream">
          <Image
            src={p.images[0]}
            alt={p.nameHe}
            fill
            priority={priority}
            sizes={sizes ?? "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"}
            className="grade object-cover transition-[transform,opacity] duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
          />
          {/* Second image cross-fades in on hover (desktop) */}
          <Image
            src={p.images[1]}
            alt=""
            aria-hidden
            fill
            sizes={sizes ?? "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"}
            className="grade hidden object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100 md:block"
          />
          {isNew && (
            <span className="absolute top-3 right-3 bg-ivory/85 px-2.5 py-1 text-[0.68rem] tracking-[0.08em] backdrop-blur-sm">
              חדש בבוטיק
            </span>
          )}
        </div>
        <div className="mt-4 space-y-1 pe-1">
          <DesignerName slug={p.designer} className="block text-[1.15rem] leading-tight font-medium tracking-[0.04em]" />
          <h3 className="line-clamp-1 text-[0.92rem] text-mocha">{p.nameHe}</h3>
          <div className="flex items-center justify-between gap-3 pt-1.5">
            <span className="text-[0.95rem] font-medium tabular-nums">{formatPrice(p.price)}</span>
            <ConditionMark id={p.condition} className="hidden sm:inline-flex" />
          </div>
        </div>
      </Link>
      <WishButton id={p.id} name={p.nameHe} className="absolute top-3 left-3" />
    </article>
  );
}
