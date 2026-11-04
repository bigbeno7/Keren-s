"use client";

import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useStore } from "./Store";
import { cn } from "@/lib/format";

export function WishButton({ id, name, className, variant = "float" }: { id: string; name: string; className?: string; variant?: "float" | "inline" }) {
  const { isWished, toggleWish, notify } = useStore();
  const on = isWished(id);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? `הסרת ${name} מרשימת המשאלות` : `הוספת ${name} לרשימת המשאלות`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const added = toggleWish(id);
        notify(added ? "נשמר ברשימת המשאלות" : "הוסר מרשימת המשאלות", added ? name : undefined);
      }}
      className={cn(
        "group/wish grid place-items-center transition-colors duration-500",
        variant === "float" ? "h-10 w-10 rounded-full bg-ivory/70 backdrop-blur-md hover:bg-ivory" : "relative h-[52px] w-[52px] border border-espresso/25 hover:border-espresso",
        className,
      )}
    >
      <motion.span key={String(on)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 18 }}>
        <Heart
          strokeWidth={1.25}
          className={cn("h-[18px] w-[18px] transition-colors duration-500", on ? "fill-espresso text-espresso" : "text-espresso")}
        />
      </motion.span>
      <AnimatePresence>
        {on && (
          <motion.span
            initial={{ scale: 0.4, opacity: 0.6 }}
            animate={{ scale: 1.9, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 rounded-full border border-champagne"
          />
        )}
      </AnimatePresence>
    </button>
  );
}
