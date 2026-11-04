import type { Metadata } from "next";
import { DesignersView } from "@/components/DesignersView";
export const metadata: Metadata = { title: "בתי אופנה" };
export default function Page() {
  return <DesignersView />;
}
