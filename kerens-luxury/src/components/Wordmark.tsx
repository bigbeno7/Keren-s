import { brand } from "@/config/brand";
import { cn } from "@/lib/format";

/** The KEREN’S wordmark — wide-tracked Cormorant capitals. Always LTR. */
export function Wordmark({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" | "xl" }) {
  const sizes = {
    sm: "text-[1.15rem] tracking-[0.34em]",
    md: "text-[1.5rem] md:text-[1.7rem] tracking-[0.36em]",
    lg: "text-[2.6rem] md:text-[3.4rem] tracking-[0.3em]",
    xl: "text-[17vw] md:text-[13.5vw] tracking-[0.06em] leading-[0.8]",
  } as const;
  return (
    <span
      dir="ltr"
      lang="en"
      className={cn("latin inline-block font-medium uppercase select-none", sizes[size], className)}
      style={{ marginRight: size === "xl" ? 0 : "-0.34em" /* optically re-center tracked text */ }}
    >
      {brand.name}
    </span>
  );
}
