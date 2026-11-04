"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { useStore } from "./Store";
import { brand } from "@/config/brand";

export function Newsletter({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  const dark = tone === "dark";

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {state === "done" ? (
          <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-2" role="status">
            <p className="display text-[1.9rem]">תודה, ברוכה הבאה למעגל.</p>
            <p className={dark ? "mt-2 text-ivory/65" : "mt-2 text-mocha"}>
              זו הדגמה בלבד — הכתובת לא נשמרה ולא תישלח אלייך הודעה.
            </p>
            <button type="button" onClick={() => { setState("idle"); setEmail(""); }} className="link-luxe mt-4 text-sm">
              הרשמה בכתובת אחרת
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            exit={{ opacity: 0, y: -10 }}
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              setState(valid ? "done" : "error");
            }}
          >
            <label htmlFor={`nl-${tone}`} className={dark ? "eyebrow-he text-ivory/60" : "eyebrow-he text-taupe"}>
              כתובת אימייל
            </label>
            <div className={`mt-2 flex items-center border-b ${dark ? "border-ivory/40 focus-within:border-ivory" : "border-espresso/30 focus-within:border-espresso"} transition-colors`}>
              <input
                id={`nl-${tone}`}
                type="email"
                inputMode="email"
                autoComplete="email"
                dir="ltr"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (state === "error") setState("idle"); }}
                placeholder="name@example.com"
                aria-invalid={state === "error"}
                aria-describedby={`nl-${tone}-hint`}
                className={`latin h-14 w-full bg-transparent text-right text-lg placeholder:opacity-40 focus:outline-none ${dark ? "text-ivory" : ""}`}
              />
              <button type="submit" aria-label="הרשמה למכתב" className="grid h-12 w-12 shrink-0 place-items-center transition-transform duration-500 hover:-translate-x-1">
                <ArrowLeft strokeWidth={1.25} className="h-5 w-5" />
              </button>
            </div>
            <p id={`nl-${tone}-hint`} className={`mt-3 text-[0.78rem] ${state === "error" ? "text-[#c2876c]" : dark ? "text-ivory/45" : "text-taupe"}`}>
              {state === "error" ? "נראה שחסר משהו בכתובת. נסי שוב?" : "פעם בחודש · ללא ספאם · אפשר להסיר בכל רגע"}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

const cols = [
  {
    title: "הבוטיק",
    links: [
      { he: "חדש בבוטיק", href: "/collection?sort=new" },
      { he: "תיקים", href: "/collection?category=bags" },
      { he: "ביגוד", href: "/collection?category=ready-to-wear" },
      { he: "תכשיטים", href: "/collection?category=jewelry" },
      { he: "בתי אופנה", href: "/designers" },
    ],
  },
  {
    title: "שירות",
    links: [
      { he: "מכרי איתנו", href: "/sell" },
      { he: "תהליך האימות", href: "/#authenticity" },
      { he: "משלוחים והחזרות", href: "#demo" },
      { he: "קביעת פגישה בשואורום", href: "#demo" },
    ],
  },
  {
    title: "KEREN’S",
    links: [
      { he: "הסיפור שלנו", href: "/#story" },
      { he: "המכתב החודשי", href: "/#letter" },
      { he: "תנאי שימוש", href: "#demo" },
      { he: "מדיניות פרטיות", href: "#demo" },
    ],
  },
];

export function Footer() {
  const { notify } = useStore();
  return (
    <footer id="contact" className="relative overflow-hidden bg-espresso text-ivory">
      <div className="mx-auto max-w-[1600px] px-6 pt-20 md:px-12 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-champagne">The Letter</p>
            <h2 className="display mt-4 text-[2.2rem] md:text-[2.8rem]">מכתב חודשי מקרן</h2>
            <p className="mt-3 max-w-md text-ivory/65">הצצה ראשונה לפריטים לפני שהם עולים לאתר, סיפורים מאחורי בתי האופנה, והזמנות לערבי שואורום פרטיים.</p>
            <div id="letter" className="mt-8 max-w-md scroll-mt-32"><Newsletter /></div>
          </div>
          <nav aria-label="קישורי תחתית" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            {cols.map((c) => (
              <div key={c.title}>
                <h3 className="eyebrow-he text-ivory/50"><bdi>{c.title}</bdi></h3>
                <ul className="mt-5 space-y-3 text-[0.95rem]">
                  {c.links.map((l) => (
                    <li key={l.he}>
                      {l.href === "#demo" ? (
                        <button type="button" className="link-luxe text-ivory/85 hover:text-ivory" onClick={() => notify(`${l.he} — בקרוב`, "העמוד הזה ייכתב בשלב הבא של הפרויקט.")}>
                          {l.he}
                        </button>
                      ) : (
                        <Link href={l.href} className="link-luxe text-ivory/85 hover:text-ivory">{l.he}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-2 sm:col-span-3 grid gap-2 text-[0.9rem] text-ivory/70 sm:grid-cols-3">
              <p>{brand.showroomHe}</p>
              <p>טלפון: <bdi dir="ltr">{brand.phone}</bdi> <span className="text-ivory/40">(לדוגמה)</span></p>
              <p dir="ltr" className="latin text-right">{brand.instagramHandle}</p>
            </div>
          </nav>
        </div>
      </div>

      <div className="mt-20 select-none overflow-hidden text-center md:mt-28" aria-hidden>
        <Wordmark size="xl" className="translate-y-[12%] text-ivory/[0.07]" />
      </div>

      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-6 py-6 text-[0.75rem] text-ivory/45 md:flex-row md:items-center md:justify-between md:px-12">
          <p>© 2026 <bdi>{brand.name}</bdi> · אב-טיפוס עיצובי. כל הפריטים לדוגמה בלבד.</p>
          <p>
            צילום: <bdi dir="ltr">Unsplash</bdi> (רישיון <bdi dir="ltr">Unsplash</bdi>) · שמות בתי האופנה מוזכרים לצורכי המחשה בלבד ואינם מעידים על שיתוף פעולה.
          </p>
        </div>
      </div>
    </footer>
  );
}
