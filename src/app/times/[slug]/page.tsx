import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { getTeamBySlug } from "@/lib/teams";
import { categoryLabels } from "@/lib/enum-labels";
import { categoryGradients } from "@/lib/category-visuals";
import { teamInitials } from "@/lib/format";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const team = await getTeamBySlug(slug);

  if (!team) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col bg-white">
        <div
          className="flex flex-col items-center gap-3 px-6 py-16 text-center text-brand-foreground"
          style={{ background: categoryGradients[team.category] }}
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-2xl font-black">
            {teamInitials(team.name)}
          </span>
          <h1 className="text-3xl font-bold">{team.name}</h1>
          <span className="rounded-full border border-brand-foreground/30 px-3 py-1 text-xs font-medium tracking-wide uppercase">
            {categoryLabels[team.category]}
          </span>
        </div>

        <div className="mx-auto w-full max-w-6xl px-6 py-12">
          <Link
            href="/#catalogo"
            className="mb-6 inline-block text-sm text-neutral-500 hover:text-neutral-700"
          >
            ← Todos os produtos
          </Link>

          <h2 className="mb-6 text-xl font-bold text-neutral-900">
            Camisetas do {team.name}
          </h2>

          {team.products.length === 0 ? (
            <p className="rounded-md border border-neutral-200 bg-neutral-50 px-4 py-8 text-center text-neutral-500">
              Nenhum produto disponível para este time no momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
