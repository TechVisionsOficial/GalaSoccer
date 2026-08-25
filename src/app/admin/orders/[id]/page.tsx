import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { updateOrderStatus } from "../actions";

const statusOptions = [
  { value: "PENDING", label: "Pendente" },
  { value: "PAID", label: "Pago" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregue" },
  { value: "CANCELED", label: "Cancelado" },
];

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      address: true,
      payment: true,
      items: { include: { product: true, productVariant: true } },
    },
  });

  if (!order) notFound();

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <Link
          href="/admin/orders"
          className="text-sm text-neutral-500 hover:text-neutral-700"
        >
          ← Pedidos
        </Link>
        <h1 className="mt-1 font-mono text-2xl font-bold text-neutral-900">
          Pedido {order.id.slice(0, 8)}
        </h1>
        <p className="text-sm text-neutral-500">
          Feito em {order.createdAt.toLocaleString("pt-BR")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 p-5">
          <h2 className="mb-3 text-sm font-semibold text-neutral-900">
            Cliente
          </h2>
          <p className="text-sm text-neutral-700">{order.customer.name}</p>
          <p className="text-sm text-neutral-500">{order.customer.email}</p>
          <p className="text-sm text-neutral-500">{order.customer.phone}</p>
        </div>

        <div className="rounded-lg border border-neutral-200 p-5">
          <h2 className="mb-3 text-sm font-semibold text-neutral-900">
            Endereço de entrega
          </h2>
          {order.address ? (
            <p className="text-sm text-neutral-700">
              {order.address.street}, {order.address.number}
              {order.address.complement ? ` - ${order.address.complement}` : ""}
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
      </div>

      <div className="rounded-lg border border-neutral-200 p-5">
        <h2 className="mb-3 text-sm font-semibold text-neutral-900">Itens</h2>
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

      <div className="rounded-lg border border-neutral-200 p-5">
        <h2 className="mb-3 text-sm font-semibold text-neutral-900">
          Pagamento
        </h2>
        <p className="text-sm text-neutral-700">
          Status: {order.payment?.status ?? "—"}
          {order.payment?.method ? ` · ${order.payment.method}` : ""}
        </p>
        {order.payment?.mercadoPagoPaymentId && (
          <p className="text-xs text-neutral-400">
            ID Mercado Pago: {order.payment.mercadoPagoPaymentId}
          </p>
        )}
      </div>

      <div className="rounded-lg border border-neutral-200 p-5">
        <h2 className="mb-3 text-sm font-semibold text-neutral-900">
          Status do pedido
        </h2>
        <form action={updateOrderStatus} className="flex items-center gap-3">
          <input type="hidden" name="orderId" value={order.id} />
          <select
            name="status"
            defaultValue={order.status}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-primary"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-brand-foreground transition hover:bg-brand-primary-dark"
          >
            Atualizar
          </button>
        </form>
      </div>
    </div>
  );
}
