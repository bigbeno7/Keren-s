import type { Metadata } from "next";
import { Suspense } from "react";
import { CollectionView } from "@/components/collection/CollectionView";

export const metadata: Metadata = { title: "הקולקציה" };

export default function CollectionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CollectionView />
    </Suspense>
  );
}
