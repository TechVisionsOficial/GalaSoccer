import { mockProducts } from "@/lib/mock-products";
import { ProductCard } from "@/components/product-card";

export function ProductGrid() {
  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto w-full max-w-6xl px-6">
        <h2 className="mb-6 text-2xl font-bold text-neutral-900">
          Mais vendidas
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
