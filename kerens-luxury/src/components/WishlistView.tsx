"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useStore } from "./Store";
import { products } from "@/data/products";
import { ProductCard } from "./ProductCard";

export function WishlistView() {
  const { wishlist } = useStore();
  const items = products.filter((p) => wishlist.includes(p.id));
  return (
    <div className="mx-auto min-h-[70svh] max-w-[1600px] px-6 pb-28 pt-[calc(64px+34px+3rem)] md:px-12 md:pt-[calc(76px+34px+5rem)]">
      <p className="eyebrow text-taupe" dir="ltr" style={{ textAlign: "right" }}>Wishlist</p>
      <h1 className="display mt-3 text-[2.9rem] md:text-[4.5rem]">רשימת המשאלות</h1>
      <p className="mt-3 text-mocha">
        {items.length ? `${items.length} ${items.length === 1 ? "פריט שמור" : "פריטים שמורים"} · נשמר בדפדפן הזה בלבד` : "הלב הקטן על כל פריט שומר אותו כאן."}
      </p>
      {items.length === 0 ? (
        <div className="mt-16 flex flex-col items-start">
          <p className="display max-w-md text-[1.7rem] leading-snug">עדיין לא שמרת פריטים. משהו יתפוס לך את העין — מבטיחות.</p>
          <Link href="/collection" className="btn-primary mt-8">לגלות את הקולקציה</Link>
        </div>
      ) : (
        <motion.ul layout className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {items.map((p) => (
              <motion.li key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
                <ProductCard p={p} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
