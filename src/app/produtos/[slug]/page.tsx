import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SizeSelector } from "@/components/size-selector";
import { getProductBySlug } from "@/lib/products";
import { categoryLabels, typeLabels } from "@/lib/enum-labels";
import { categoryGradients } from "@/lib/category-visuals";
import { teamInitials } from "@/lib/format";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
          <Link
            href="/#catalogo"
            className="text-sm text-neutral-500 hover:text-neutral-700"
          >
            ← Voltar ao catálogo
          </Link>

          <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div
              className="flex aspect-square items-center justify-center rounded-xl"
              style={{ background: categoryGradients[product.team.category] }}
            >
              <span className="text-6xl font-black tracking-widest text-white/90 drop-shadow-sm">
                {teamInitials(product.team.name)}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 font-medium text-brand-primary">
                  {categoryLabels[product.team.category]}
                </span>
                <span className="text-neutral-500">
                  {typeLabels[product.type]}
                  {product.season ? ` · ${product.season}` : ""}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-neutral-900">
                {product.name}
              </h1>

              <p className="text-neutral-600">
                Camisa {typeLabels[product.type].toLowerCase()} do{" "}
                {product.team.name}
                {product.season ? `, temporada ${product.season}` : ""}.
                Produto licenciado, tecido de alta performance.
              </p>

              <SizeSelector
                variants={product.variants.map((v) => ({
                  id: v.id,
                  size: v.size,
                  priceCents: v.priceCents,
                  stock: v.stock,
                }))}
              />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
