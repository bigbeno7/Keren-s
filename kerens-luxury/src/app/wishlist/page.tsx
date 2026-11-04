import type { Metadata } from "next";
import { WishlistView } from "@/components/WishlistView";
export const metadata: Metadata = { title: "רשימת משאלות" };
export default function Page() {
  return <WishlistView />;
}
