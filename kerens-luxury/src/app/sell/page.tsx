import type { Metadata } from "next";
import { SellView } from "@/components/SellView";
export const metadata: Metadata = { title: "מכרי איתנו" };
export default function Page() {
  return <SellView />;
}
