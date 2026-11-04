import type { Metadata, Viewport } from "next";
import { Frank_Ruhl_Libre, Assistant, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/Store";
import { Header } from "@/components/Header";
import { MobileMenu, SearchOverlay, BagDrawer, Toasts } from "@/components/Overlays";
import { Footer } from "@/components/Footer";
import { brand } from "@/config/brand";

const frank = Frank_Ruhl_Libre({ subsets: ["hebrew", "latin"], weight: ["300", "400", "500"], variable: "--font-frank", display: "swap" });
const assistant = Assistant({ subsets: ["hebrew", "latin"], weight: ["300", "400", "500", "600"], variable: "--font-assistant", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${brand.nameAscii} — ${brand.taglineHe}`, template: `%s · ${brand.nameAscii}` },
  description: "בוטיק ישראלי לאופנת יוקרה יד שנייה: תיקים, ביגוד, נעליים ותכשיטים של בתי האופנה הגדולים, שנבחרו אחד־אחד. אב-טיפוס עיצובי.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f8f4ed",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${frank.variable} ${assistant.variable} ${cormorant.variable}`}>
      <body>
          <StoreProvider>
            <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:right-2 focus:z-[100] focus:bg-espresso focus:px-4 focus:py-2 focus:text-ivory">
              דילוג לתוכן
            </a>
            <Header />
            <MobileMenu />
            <SearchOverlay />
            <BagDrawer />
            <main id="main">{children}</main>
            <Footer />
            <Toasts />
          </StoreProvider>
      </body>
    </html>
  );
}
