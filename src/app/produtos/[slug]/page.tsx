import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SizeSelector } from "@/components/size-selector";
import { StarRating } from "@/components/star-rating";
import { ReviewForm } from "@/components/review-form";
import { RecommendedProducts } from "@/components/recommended-products";
import { getProductBySlug, getRecommendedProducts } from "@/lib/products";
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

  const recommended = await getRecommendedProducts(
    product.id,
    product.teamId,
    product.team.category,
  );

  const reviewCount = product.reviews.length;
  const averageRating =
    reviewCount > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;

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

              <Link
                href={`/times/${product.team.slug}`}
                className="text-sm font-medium text-neutral-500 hover:text-brand-primary hover:underline"
              >
                {product.team.name}
              </Link>

              <h1 className="text-3xl font-bold text-neutral-900">
                {product.name}
              </h1>

              {reviewCount > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating rating={averageRating} />
                  <span className="text-sm text-neutral-500">
                    {averageRating.toFixed(1)} ({reviewCount} avaliação
                    {reviewCount > 1 ? "ões" : ""})
                  </span>
                </div>
              )}

              <p className="text-neutral-600">
                Camisa {typeLabels[product.type].toLowerCase()} do{" "}
                {product.team.name}
                {product.season ? `, temporada ${product.season}` : ""}.
                Produto licenciado, tecido de alta performance.
              </p>

              <SizeSelector
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  teamName: product.team.name,
                }}
                variants={product.variants.map((v) => ({
                  id: v.id,
                  size: v.size,
                  priceCents: v.priceCents,
                  stock: v.stock,
                }))}
              />
            </div>
          </div>

          <section className="mt-16 grid grid-cols-1 gap-10 border-t border-neutral-100 pt-10 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-neutral-900">
                Avaliações {reviewCount > 0 && `(${reviewCount})`}
              </h2>

              {reviewCount === 0 ? (
                <p className="text-sm text-neutral-500">
                  Ainda não há avaliações para este produto. Seja o primeiro a
                  avaliar!
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {product.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-neutral-100 pb-4 last:border-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-900">
                          {review.authorName}
                        </span>
                        <span className="text-xs text-neutral-400">
                          {review.createdAt.toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <StarRating rating={review.rating} size={14} />
                      {review.comment && (
                        <p className="mt-1 text-sm text-neutral-600">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <ReviewForm productId={product.id} productSlug={product.slug} />
          </section>
        </div>

        <div className="mx-auto w-full max-w-6xl px-6">
          <RecommendedProducts products={recommended} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
