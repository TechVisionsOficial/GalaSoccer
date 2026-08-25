import Link from "next/link";
import { categoryLabels, typeLabels } from "@/lib/enum-labels";
import { categoryGradients } from "@/lib/category-visuals";
import { formatPrice, teamInitials } from "@/lib/format";
import type { ActiveProduct } from "@/lib/products";

export function ProductCard({ product }: { product: ActiveProduct }) {
  const availableSizes = product.variants.filter((v) => v.stock > 0);
  const minPriceCents = Math.min(
    ...product.variants.map((v) => v.priceCents),
  );

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-brand-primary/10 bg-white shadow-sm transition hover:shadow-md">
      <Link
        href={`/produtos/${product.slug}`}
        className="flex aspect-square items-center justify-center"
        style={{ background: categoryGradients[product.team.category] }}
      >
        <span className="text-4xl font-black tracking-widest text-white/90 drop-shadow-sm">
          {teamInitials(product.team.name)}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
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
          className="text-xs font-medium text-neutral-500 hover:text-brand-primary hover:underline"
        >
          {product.team.name}
        </Link>

        <Link href={`/produtos/${product.slug}`}>
          <h3 className="font-semibold text-neutral-900 hover:text-brand-primary">
            {product.name}
          </h3>
        </Link>

        <div className="flex flex-wrap gap-1">
          {product.variants.map((variant) => (
            <span
              key={variant.id}
              className={`rounded border px-1.5 py-0.5 text-xs ${
                variant.stock > 0
                  ? "border-neutral-200 text-neutral-600"
                  : "border-neutral-100 text-neutral-300 line-through"
              }`}
            >
              {variant.size}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-brand-primary">
            {formatPrice(minPriceCents)}
          </span>
          <Link
            href={`/produtos/${product.slug}`}
            className="rounded-md bg-brand-primary px-3 py-1.5 text-sm font-medium text-brand-foreground transition group-hover:bg-brand-primary-dark"
          >
            {availableSizes.length > 0 ? "Ver produto" : "Esgotado"}
          </Link>
        </div>
      </div>
    </div>
  );
}
