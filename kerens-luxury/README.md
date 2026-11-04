# KEREN’S — Pre-Owned Luxury Boutique · Design Prototype

**פריטי יוקרה. סיפור חדש.**

A Hebrew-first, RTL, mobile-first design prototype for KEREN’S, a curated Israeli boutique for pre-owned luxury fashion.
All products, prices and copy are **sample inventory**. There is no backend, checkout or authentication.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

**On a phone (same Wi-Fi):**

```bash
npm run dev:phone    # binds to 0.0.0.0
# find your Mac's IP: ipconfig getifaddr en0
# then open http://<that-ip>:3000 in Safari on the iPhone
```

Production build: `npm run build && npm start`.

To share a public link, deploy for free with Vercel: `npx vercel` (no config needed).

## Stack
Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Motion · Lucide · next/font (Frank Ruhl Libre, Assistant, Cormorant Garamond).

## Structure

```
src/
  config/brand.ts        ← brand name, tagline, contact details (change the brand here)
  data/catalog.ts        ← categories, condition grades, designers
  data/products.ts       ← 31 sample products (structured mock data)
  app/                   ← routes: / , /collection , /product/[slug] , /designers , /wishlist , /sell
  components/            ← Header, overlays (menu/search/bag/toasts), ProductCard, Footer…
  components/home/       ← Hero + editorial home sections
public/images/           ← self-hosted photography (Unsplash License)
```

## Design system
- **Palette** (tokens in `src/app/globals.css`): ivory `#F8F4ED`, cream `#F0E8DB`, linen, sand `#D6C6AE`, taupe, mocha, espresso `#2A1D15`, champagne `#C6AB7E`.
- **Type:** Frank Ruhl Libre (Hebrew display) · Assistant (Hebrew body) · Cormorant Garamond (wordmark, designer names, Latin eyebrows).
- **Editorial device:** numbered chapters (פרק 01…05), hairline rules, Latin small caps beside Hebrew, a warm unifying photo grade (`.grade`).
- **RTL:** `<html dir="rtl" lang="he">`, logical spacing utilities, English names isolated with `<bdi dir="ltr">`, drawers and arrows mirrored.

## Functional vs. demo

| Works in the prototype | Demo only / not implemented |
|---|---|
| Navigation, sticky header, mobile menu | Customer accounts / login (shows a “coming soon” notice) |
| Live search overlay → collection results | Real checkout and payments (button shows a notice) |
| Collection filters (category, designer, condition, price), sort, URL-synced | Inventory, backend, CMS |
| Product gallery (swipe, thumbnails, fullscreen zoom) | Size guide, WhatsApp/stylist chat |
| Wishlist and bag (saved in the browser’s localStorage) | Newsletter and consignment form submission (validated, nothing is sent) |
| Designers A–Z index with search | Legal and policy pages |

## Imagery
All photography follows a strict modest-fashion standard: covered shoulders, arms past the elbow, legs below the knee, no low necklines, sheer or fitted styling. Accessories, bags, shoes and jewellery are shown as product-only shots.

Model photography (Unsplash License): Marian Oleksyn (hero), amin naderloei (campaign), Brunxs, Laura Chouette, David Todd McCarty, Nassim Boughazi, Margo Evardson, Brynden, Esra Korkmaz.

Photographs are from [Unsplash](https://unsplash.com) under the Unsplash License, self-hosted for speed. Product images are illustrative and do not depict the named designers’ actual products. Designer names are used for illustration only and imply no affiliation.
