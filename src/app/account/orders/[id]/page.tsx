import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getCurrentCustomer } from "@/lib/current-customer";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { orderStatusLabels, orderStatusStyles } from "@/lib/enum-labels";

export default async function CustomerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const customer = await getCurrentCustomer();
  if (!customer) {
    redirect("/login");
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      address: true,
      payment: true,
      items: { include: { product: true, productVariant: true } },
    },
  });

  // Nunca mostrar pedido de outro cliente, mesmo que o ID seja adivinhado.
  if (!order || order.customerId !== customer.id) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col bg-white">
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
          <Link
            href="/account/orders"
            className="text-sm text-neutral-500 hover:text-neutral-700"
          >
            ← Meus pedidos
          </Link>

          <div className="mt-2 flex items-center justify-between">
            <h1 className="font-mono text-2xl font-bold text-neutral-900">
              Pedido {order.id.slice(0, 8)}
            </h1>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${orderStatusStyles[order.status]}`}
            >
              {orderStatusLabels[order.status]}
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            Feito em {order.createdAt.toLocaleString("pt-BR")}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-neutral-200 p-5">
              <h2 className="mb-3 text-sm font-semibold text-neutral-900">
                Endereço de entrega
              </h2>
              {order.address ? (
                <p className="text-sm text-neutral-700">
                  {order.address.street}, {order.address.number}
                  {order.address.complement
                    ? ` - ${order.address.complement}`
                    : ""}
                  <br />
                  {order.address.district} — {order.address.city}/
                  {order.address.state}
                  <br />
                  CEP {order.address.zipCode}
                </p>
              ) : (
                <p className="text-sm text-neutral-400">Sem endereço.</p>
              )}
            </div>

            <div className="rounded-lg border border-neutral-200 p-5">
              <h2 className="mb-3 text-sm font-semibold text-neutral-900">
                Pagamento
              </h2>
              <p className="text-sm text-neutral-700">
                Status: {order.payment?.status ?? "—"}
                {order.payment?.method ? ` · ${order.payment.method}` : ""}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-neutral-200 p-5">
            <h2 className="mb-3 text-sm font-semibold text-neutral-900">
              Itens
            </h2>
            <div className="flex flex-col divide-y divide-neutral-100">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <span className="text-neutral-700">
                    {item.product.name} ({item.productVariant.size}) x
                    {item.quantity}
                  </span>
                  <span className="font-medium text-neutral-900">
                    {formatPrice(item.unitPriceCents * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-neutral-200 pt-3 text-sm font-semibold text-neutral-900">
              <span>Total</span>
              <span>{formatPrice(order.totalCents)}</span>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
