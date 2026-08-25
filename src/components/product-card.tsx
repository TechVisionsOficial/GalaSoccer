import {
  categoryLabels,
  typeLabels,
  type MockProduct,
} from "@/lib/mock-products";

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function ProductCard({ product }: { product: MockProduct }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-brand-primary/10 bg-white shadow-sm transition hover:shadow-md">
      <div
        className="flex aspect-square items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${product.gradientFrom}, ${product.gradientTo})`,
        }}
      >
        <span className="text-4xl font-black tracking-widest text-white/90 drop-shadow-sm">
          {product.initials}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 font-medium text-brand-primary">
            {categoryLabels[product.category]}
          </span>
          <span className="text-neutral-500">
            {typeLabels[product.type]} · {product.season}
          </span>
        </div>

        <h3 className="font-semibold text-neutral-900">{product.teamName}</h3>

        <div className="flex flex-wrap gap-1">
          {product.sizes.map((size) => (
            <span
              key={size}
              className="rounded border border-neutral-200 px-1.5 py-0.5 text-xs text-neutral-600"
            >
              {size}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-brand-primary">
            {formatPrice(product.priceCents)}
          </span>
          <button
            type="button"
            className="rounded-md bg-brand-primary px-3 py-1.5 text-sm font-medium text-brand-foreground transition hover:bg-brand-primary-dark"
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}
