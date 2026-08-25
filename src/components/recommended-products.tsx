import { ProductCard } from "@/components/product-card";
import type { ActiveProduct } from "@/lib/products";

export function RecommendedProducts({
  products,
}: {
  products: ActiveProduct[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-neutral-100 py-12">
      <h2 className="mb-6 text-xl font-bold text-neutral-900">
        Você também pode gostar
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
