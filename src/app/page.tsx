import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { CategoryShowcase } from "@/components/category-showcase";
import { ProductGrid } from "@/components/product-grid";
import { Benefits } from "@/components/benefits";
import { SiteFooter } from "@/components/site-footer";
import type { ProductFilters } from "@/lib/products";
import { TeamCategory, ProductType } from "@/generated/prisma/enums";

function parseFilters(searchParams: {
  [key: string]: string | string[] | undefined;
}): ProductFilters {
  const categoria = searchParams.categoria;
  const time = searchParams.time;
  const tipo = searchParams.tipo;

  const filters: ProductFilters = {};

  if (
    typeof categoria === "string" &&
    (Object.values(TeamCategory) as string[]).includes(categoria)
  ) {
    filters.category = categoria as TeamCategory;
  }
  if (typeof time === "string" && time) {
    filters.teamSlug = time;
  }
  if (
    typeof tipo === "string" &&
    (Object.values(ProductType) as string[]).includes(tipo)
  ) {
    filters.type = tipo as ProductType;
  }

  return filters;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const filters = parseFilters(await searchParams);

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Hero />
        <CategoryShowcase />
        <div id="catalogo">
          <ProductGrid filters={filters} />
        </div>
        <Benefits />
      </main>
      <SiteFooter />
    </>
  );
}
