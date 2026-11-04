import { getCondition } from "@/data/catalog";
import type { ConditionId } from "@/data/types";
import { cn } from "@/lib/format";

/** Four-dot condition scale — quieter than a badge. */
export function ConditionMark({ id, className, long = false }: { id: ConditionId; className?: string; long?: boolean }) {
  const c = getCondition(id);
  return (
    <span className={cn("inline-flex items-center gap-2 text-[0.8rem] text-mocha", className)}>
      <span className="inline-flex gap-[3px]" aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={cn("h-[5px] w-[5px] rounded-full border border-mocha/60", i <= c.grade && "bg-mocha")} />
        ))}
      </span>
      <span>{long ? c.he : c.short}</span>
    </span>
  );
}
