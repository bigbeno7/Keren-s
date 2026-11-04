import { getDesigner } from "@/data/catalog";
import { cn } from "@/lib/format";

/** English designer names isolated from the RTL flow so punctuation never flips. */
export function DesignerName({ slug, className }: { slug: string; className?: string }) {
  return (
    <bdi lang="en" dir="ltr" className={cn("latin", className)}>
      {getDesigner(slug).name}
    </bdi>
  );
}

export function En({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <bdi lang="en" dir="ltr" className={className}>
      {children}
    </bdi>
  );
}
