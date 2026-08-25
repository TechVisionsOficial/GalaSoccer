"use client";

import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterCompact } from "@/components/site-footer-compact";
import { useCart, type CartItem } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";

function CartRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 border-b border-neutral-100 py-4 last:border-0">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-brand-primary/10 text-xs font-bold text-brand-primary">
        {item.size}
      </div>

      <div className="flex-1">
        <p className="font-medium text-neutral-900">{item.productName}</p>
        <p className="text-sm text-neutral-500">
          {item.teamName} · Tamanho {item.size}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-300 text-neutral-600 hover:border-brand-primary"
          aria-label="Diminuir quantidade"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-6 text-center text-sm">{item.quantity}</span>
        <button
          type="button"
          disabled={item.quantity >= item.maxStock}
          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-300 text-neutral-600 hover:border-brand-primary disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Aumentar quantidade"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <span className="w-24 text-right font-medium text-neutral-900">
        {formatPrice(item.priceCents * item.quantity)}
      </span>

      <button
        type="button"
        onClick={() => removeItem(item.variantId)}
        className="text-neutral-400 hover:text-red-600"
        aria-label={`Remover ${item.productName}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function CartPage() {
  const { items, subtotalCents } = useCart();

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col bg-white">
        <div className="mx-auto w-full max-w-4xl px-6 py-10">
          <h1 className="mb-6 text-2xl font-bold text-neutral-900">
            Seu carrinho
          </h1>

          {items.length === 0 ? (
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
              <p className="text-neutral-600">Seu carrinho está vazio.</p>
              <Link
                href="/#catalogo"
                className="mt-4 inline-block rounded-md bg-brand-primary px-5 py-2.5 text-sm font-medium text-brand-foreground transition hover:bg-brand-primary-dark"
              >
                Ver camisetas
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-8 lg:flex-row">
              <div className="flex-1 rounded-lg border border-neutral-200 px-4">
                {items.map((item) => (
                  <CartRow key={item.variantId} item={item} />
                ))}
              </div>

              <div className="flex w-full flex-col gap-4 rounded-lg border border-neutral-200 p-6 lg:w-72">
                <div className="flex items-center justify-between text-sm text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-900">
                    {formatPrice(subtotalCents)}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Frete calculado no checkout.
                </p>
                <Link
                  href="/checkout"
                  className="rounded-md bg-brand-primary px-5 py-3 text-center text-sm font-bold text-brand-foreground transition hover:bg-brand-primary-dark"
                >
                  Finalizar compra
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooterCompact />
    </>
  );
}
