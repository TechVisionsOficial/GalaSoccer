import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { CategoryShowcase } from "@/components/category-showcase";
import { ProductGrid } from "@/components/product-grid";
import { Benefits } from "@/components/benefits";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Hero />
        <CategoryShowcase />
        <div id="catalogo">
          <ProductGrid />
        </div>
        <Benefits />
      </main>
      <SiteFooter />
    </>
  );
}
