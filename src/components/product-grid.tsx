import { getActiveProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export async function ProductGrid() {
  const products = await getActiveProducts();

  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto w-full max-w-6xl px-6">
        <h2 className="mb-6 text-2xl font-bold text-neutral-900">
          Mais vendidas
        </h2>

        {products.length === 0 ? (
          <p className="rounded-md border border-neutral-200 bg-neutral-50 px-4 py-8 text-center text-neutral-500">
            Nenhum produto cadastrado ainda.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
