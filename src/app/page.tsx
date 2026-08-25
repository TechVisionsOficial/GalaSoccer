import { SiteHeader } from "@/components/site-header";
import { ProductGrid } from "@/components/product-grid";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <div className="flex flex-col items-center justify-center gap-4 bg-brand-primary px-6 py-16 text-center text-brand-foreground">
          <h1 className="text-4xl font-bold text-brand-accent sm:text-5xl">
            Gala Soccer
          </h1>
          <p className="max-w-xl text-brand-foreground/80">
            Camisetas de times nacionais, internacionais e seleções.
          </p>
        </div>
        <ProductGrid />
      </main>
    </>
  );
}
