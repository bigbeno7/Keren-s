import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, getProduct } from "@/data/products";
import { getDesigner } from "@/data/catalog";
import { ProductView } from "@/components/product/ProductView";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return { title: `${getDesigner(p.designer).name} — ${p.nameHe}`, description: p.storyHe };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const related = [
    ...products.filter((x) => x.id !== p.id && x.designer === p.designer),
    ...products.filter((x) => x.id !== p.id && x.category === p.category && x.designer !== p.designer),
  ].slice(0, 4);
  return <ProductView p={p} related={related} />;
}
