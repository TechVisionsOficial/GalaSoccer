"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/components/cart-provider";

type Variant = {
  id: string;
  size: string;
  priceCents: number;
  stock: number;
};

type Product = {
  id: string;
  slug: string;
  name: string;
  teamName: string;
};

export function SizeSelector({
  product,
  variants,
}: {
  product: Product;
  variants: Variant[];
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const firstAvailable = variants.find((v) => v.stock > 0);
  const [selectedId, setSelectedId] = useState<string | null>(
    firstAvailable?.id ?? null,
  );
  const [added, setAdded] = useState(false);

  const selected = variants.find((v) => v.id === selectedId);
  const fallbackPrice = Math.min(...variants.map((v) => v.priceCents));

  function handleAddToCart() {
    if (!selected) return;
    addItem({
      variantId: selected.id,
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      teamName: product.teamName,
      size: selected.size,
      priceCents: selected.priceCents,
      maxStock: selected.stock,
    });
    setAdded(true);
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-3xl font-bold text-brand-primary">
        {formatPrice(selected?.priceCents ?? fallbackPrice)}
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-700">Tamanho</span>
        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => {
            const isSelected = variant.id === selectedId;
            const isOut = variant.stock === 0;
            return (
              <button
                key={variant.id}
                type="button"
                disabled={isOut}
                onClick={() => {
                  setSelectedId(variant.id);
                  setAdded(false);
                }}
                className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
                  isSelected
                    ? "border-brand-primary bg-brand-primary text-brand-foreground"
                    : isOut
                      ? "cursor-not-allowed border-neutral-200 text-neutral-300 line-through"
                      : "border-neutral-300 text-neutral-700 hover:border-brand-primary"
                }`}
              >
                {variant.size}
              </button>
            );
          })}
        </div>
        {selected && selected.stock <= 5 && (
          <span className="text-xs text-amber-600">
            Últimas {selected.stock} unidades
          </span>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          disabled={!selected}
          onClick={handleAddToCart}
          className="flex-1 rounded-md bg-brand-primary px-6 py-3 text-sm font-bold text-brand-foreground transition hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          {added ? "Adicionado ✓" : "Adicionar ao carrinho"}
        </button>
        {added && (
          <button
            type="button"
            onClick={() => router.push("/carrinho")}
            className="rounded-md border border-brand-primary px-6 py-3 text-sm font-bold text-brand-primary transition hover:bg-brand-primary/5"
          >
            Ver carrinho
          </button>
        )}
      </div>
    </div>
  );
}
