"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { categories, designers } from "@/data/catalog";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/format";

const steps = [
  { n: "01", he: "מספרות לנו", text: "ממלאות טופס קצר עם פרטי הפריט ותמונות מהטלפון." },
  { n: "02", he: "הערכה אישית", text: "קרן חוזרת אלייך תוך 48 שעות עם הערכת מחיר ושיחה." },
  { n: "03", he: "צילום ואימות", text: "אנחנו אוספות, בודקות ומצלמות את הפריט באולפן." },
  { n: "04", he: "בית חדש", text: "ברגע שהפריט נמכר — התשלום מועבר אלייך." },
];

const field = "h-14 w-full border-b border-espresso/25 bg-transparent transition-colors focus:border-espresso focus:outline-none";

export function SellView() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const err: Record<string, boolean> = {};
    ["name", "phone", "category", "designer"].forEach((k) => { if (!String(f.get(k) ?? "").trim()) err[k] = true; });
    setErrors(err);
    if (Object.keys(err).length === 0) {
      setSent(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="pt-[calc(64px+34px)] md:pt-[calc(76px+34px)]">
      <section className="relative grid lg:grid-cols-2">
        <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[86svh]">
          <Image src="/images/story-atelier.jpg" alt="בגדים תלויים על מתלה עץ בסטודיו מואר" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="grade object-cover" />
        </div>
        <div className="flex flex-col justify-center px-6 py-14 md:px-16 lg:px-20">
          <p className="eyebrow text-taupe" dir="ltr" style={{ textAlign: "right" }}>Consign with KEREN’S</p>
          <h1 className="display mt-4 text-[2.9rem] md:text-[4.6rem]">
            מכרי איתנו.
            <br />
            <span className="italic text-mocha">בלי להתעסק.</span>
          </h1>
          <p className="mt-6 max-w-md text-[1.05rem] leading-[1.9] text-mocha">
            לפריטים שאהבת מגיע פרק שני. אנחנו דואגות לצילום, לתמחור, לאימות ולמשלוח — את רק בוחרת מה מוכן להמשיך הלאה.
          </p>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2">
            {steps.map((s) => (
              <li key={s.n} className="border-t border-espresso/15 pt-4">
                <span className="latin text-xl text-champagne">{s.n}</span>
                <p className="mt-1 font-medium">{s.he}</p>
                <p className="mt-1 text-[0.9rem] text-mocha">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-cream px-6 py-20 md:py-28">
        <div className="mx-auto max-w-2xl">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="ok" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center" role="status">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-espresso"><Check strokeWidth={1} className="h-7 w-7" /></span>
                <h2 className="display mt-6 text-[2.4rem]">תודה, קיבלנו.</h2>
                <p className="mx-auto mt-3 max-w-md text-mocha">בגרסה הסופית קרן הייתה חוזרת אלייך תוך 48 שעות. באב-הטיפוס הפרטים לא נשלחו ולא נשמרו.</p>
                <button type="button" onClick={() => setSent(false)} className="btn-outline mt-8">שליחת פריט נוסף</button>
              </motion.div>
            ) : (
              <motion.form key="form" exit={{ opacity: 0 }} noValidate onSubmit={submit}>
                <Reveal>
                  <h2 className="display text-[2.2rem] md:text-[2.8rem]">ספרי לנו על הפריט</h2>
                  <p className="mt-2 text-mocha">טופס הדגמה — הנתונים אינם נשלחים.</p>
                </Reveal>
                <div className="mt-10 grid gap-x-8 gap-y-6 md:grid-cols-2">
                  <label className="block">
                    <span className="text-[0.85rem] text-taupe">שם מלא *</span>
                    <input name="name" autoComplete="name" className={cn(field, errors.name && "border-[#b07a62]")} aria-invalid={errors.name} />
                  </label>
                  <label className="block">
                    <span className="text-[0.85rem] text-taupe">טלפון *</span>
                    <input name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" className={cn(field, "text-right", errors.phone && "border-[#b07a62]")} aria-invalid={errors.phone} />
                  </label>
                  <label className="block">
                    <span className="text-[0.85rem] text-taupe">סוג הפריט *</span>
                    <select name="category" defaultValue="" className={cn(field, "appearance-none", errors.category && "border-[#b07a62]")} aria-invalid={errors.category}>
                      <option value="" disabled>בחרי…</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.he}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-[0.85rem] text-taupe">בית אופנה *</span>
                    <input name="designer" list="designer-list" dir="auto" className={cn(field, errors.designer && "border-[#b07a62]")} aria-invalid={errors.designer} />
                    <datalist id="designer-list">{designers.map((d) => <option key={d.slug} value={d.name} />)}</datalist>
                  </label>
                  <label className="block md:col-span-2">
                    <span className="text-[0.85rem] text-taupe">ספרי לנו עוד (שנה, מצב, אביזרים)</span>
                    <textarea name="notes" rows={3} className="w-full resize-none border-b border-espresso/25 bg-transparent py-3 focus:border-espresso focus:outline-none" />
                  </label>
                  <label className="flex cursor-pointer items-center justify-center gap-3 border border-dashed border-espresso/30 py-8 text-[0.9rem] text-mocha transition-colors hover:border-espresso md:col-span-2">
                    <input type="file" accept="image/*" multiple className="sr-only" />
                    + הוספת תמונות מהטלפון (הדגמה)
                  </label>
                </div>
                {Object.keys(errors).length > 0 && <p className="mt-6 text-[0.88rem] text-[#9a6650]" role="alert">נא למלא את השדות המסומנים בכוכבית.</p>}
                <button type="submit" className="btn-primary mt-10 w-full md:w-auto">שליחה להערכה</button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
