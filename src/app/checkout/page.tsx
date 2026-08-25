"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";
import { createOrder } from "./actions";

const inputClass =
  "rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-primary";

export default function CheckoutPage() {
  const { items, subtotalCents, clear } = useCart();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);

    const payload = {
      customer: {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
      },
      address: {
        street: String(formData.get("street") ?? ""),
        number: String(formData.get("number") ?? ""),
        complement: String(formData.get("complement") ?? "") || undefined,
        district: String(formData.get("district") ?? ""),
        city: String(formData.get("city") ?? ""),
        state: String(formData.get("state") ?? ""),
        zipCode: String(formData.get("zipCode") ?? ""),
      },
      items: items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    };

    startTransition(async () => {
      try {
        await createOrder(payload);
      } catch (err) {
        const digest = (err as { digest?: string })?.digest;
        if (digest?.startsWith("NEXT_REDIRECT")) {
          // createOrder termina com redirect(), que sempre lança — se
          // chegou aqui é porque o pedido foi criado com sucesso.
          clear();
          throw err;
        }
        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível finalizar o pedido. Tente novamente.",
        );
      }
    });
  }

  if (items.length === 0) {
    return (
      <>
        <SiteHeader />
        <main className="flex flex-1 flex-col bg-white">
          <div className="mx-auto w-full max-w-4xl px-6 py-16 text-center">
            <p className="text-neutral-600">
              Seu carrinho está vazio — adicione produtos antes de finalizar a
              compra.
            </p>
            <Link
              href="/#catalogo"
              className="mt-4 inline-block rounded-md bg-brand-primary px-5 py-2.5 text-sm font-medium text-brand-foreground transition hover:bg-brand-primary-dark"
            >
              Ver camisetas
            </Link>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col bg-white">
        <div className="mx-auto w-full max-w-4xl px-6 py-10">
          <h1 className="mb-6 text-2xl font-bold text-neutral-900">
            Checkout
          </h1>

          <form action={handleSubmit} className="flex flex-col gap-8 lg:flex-row">
            <div className="flex flex-1 flex-col gap-6">
              <fieldset className="flex flex-col gap-3">
                <legend className="mb-1 text-sm font-semibold text-neutral-900">
                  Seus dados
                </legend>
                <input
                  name="name"
                  required
                  placeholder="Nome completo"
                  className={inputClass}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="E-mail"
                    className={inputClass}
                  />
                  <input
                    name="phone"
                    required
                    placeholder="Telefone"
                    className={inputClass}
                  />
                </div>
              </fieldset>

              <fieldset className="flex flex-col gap-3">
                <legend className="mb-1 text-sm font-semibold text-neutral-900">
                  Endereço de entrega
                </legend>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    name="zipCode"
                    required
                    placeholder="CEP"
                    className={`col-span-1 ${inputClass}`}
                  />
                  <input
                    name="street"
                    required
                    placeholder="Rua"
                    className={`col-span-2 ${inputClass}`}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    name="number"
                    required
                    placeholder="Número"
                    className={inputClass}
                  />
                  <input
                    name="complement"
                    placeholder="Complemento (opcional)"
                    className={`col-span-2 ${inputClass}`}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    name="district"
                    required
                    placeholder="Bairro"
                    className={inputClass}
                  />
                  <input
                    name="city"
                    required
                    placeholder="Cidade"
                    className={inputClass}
                  />
                  <input
                    name="state"
                    required
                    maxLength={2}
                    placeholder="UF"
                    className={inputClass}
                  />
                </div>
              </fieldset>

              {error && (
                <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="rounded-md bg-brand-primary px-6 py-3 text-sm font-bold text-brand-foreground transition hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Processando..." : "Ir para pagamento"}
              </button>
            </div>

            <div className="flex w-full flex-col gap-3 self-start rounded-lg border border-neutral-200 p-6 lg:w-72">
              <h2 className="text-sm font-semibold text-neutral-900">
                Resumo do pedido
              </h2>
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex justify-between text-sm text-neutral-600"
                >
                  <span>
                    {item.productName} ({item.size}) x{item.quantity}
                  </span>
                  <span>{formatPrice(item.priceCents * item.quantity)}</span>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-neutral-200 pt-3 text-sm font-semibold text-neutral-900">
                <span>Total</span>
                <span>{formatPrice(subtotalCents)}</span>
              </div>
            </div>
          </form>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
