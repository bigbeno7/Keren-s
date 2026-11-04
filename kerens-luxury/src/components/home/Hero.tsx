"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { brand } from "@/config/brand";

const ease = [0.22, 1, 0.36, 1] as const;

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span className="block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1.4, delay, ease }}>
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[620px] overflow-hidden bg-ink text-ivory" aria-label="קמפיין פתיחה">
      <motion.div style={{ y }} className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.14, opacity: 0.4 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.8, ease }}
        >
          <Image
            src="/images/hero-golden.jpg"
            alt="דמות בחולצת משי בגוון שנהב, באור שקיעה זהוב ליד קיר אבן"
            fill
            priority
            sizes="100vw"
            className="grade object-cover object-[50%_35%] md:object-[50%_12%]"
          />
        </motion.div>
      </motion.div>
      <div className="grain absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-ink/35" />

      <motion.div style={{ opacity: fade }} className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] md:px-12 md:pb-16">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="eyebrow mb-6 flex items-center gap-4 text-ivory/90"
          dir="ltr"
          style={{ justifyContent: "flex-end" }}
        >
          <span className="hidden md:inline">Saison I — {brand.established}</span>
          <span className="hidden h-px w-10 bg-ivory/50 md:inline-block" />
          <span>{brand.descriptorEn} · {brand.cityEn}</span>
        </motion.p>

        <h1 className="display text-[3.35rem] leading-[1.02] sm:text-[4.5rem] md:text-[6.2rem] lg:text-[7.6rem]">
          <Line delay={0.35}>פריטי יוקרה.</Line>
          <Line delay={0.55}>
            <span className="italic text-champagne-soft">סיפור</span> חדש.
          </Line>
        </h1>

        <div className="mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.1, ease }}
            className="max-w-[26rem] text-[1.02rem] leading-relaxed text-ivory/85 md:text-[1.08rem]"
          >
            בוטיק פרטי לאופנת יוקרה יד שנייה. כל פריט נבחר בידי קרן, נבדק בקפידה — ומחכה לפרק הבא שלו.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.3, ease }}
            className="flex gap-3"
          >
            <Link href="/collection" className="btn-primary flex-[1.4] bg-ivory px-4 text-espresso hover:bg-champagne-soft md:flex-none md:px-8">
              לגלות את הקולקציה
            </Link>
            <Link href="/sell" className="btn-outline btn-outline-light flex-1 border-ivory/60 px-4 md:flex-none md:px-8">
              מכרי איתנו
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        aria-hidden
      >
        <span className="relative h-14 w-px overflow-hidden bg-ivory/25">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-ivory"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
