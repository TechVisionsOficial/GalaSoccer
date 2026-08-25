import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { ProductGrid } from "@/components/product-grid";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Hero />
        <div id="catalogo">
          <ProductGrid />
        </div>
      </main>
    </>
  );
}
