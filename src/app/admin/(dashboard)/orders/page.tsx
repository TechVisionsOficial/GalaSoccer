import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { orderStatusLabels, orderStatusStyles } from "@/lib/enum-labels";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true, payment: true, items: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Pedidos</h1>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Pedido</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Itens</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Pagamento</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-neutral-100 last:border-0"
              >
                <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                  {order.id.slice(0, 8)}
                </td>
                <td className="px-4 py-3 text-neutral-900">
                  {order.customer.name}
                  <div className="text-xs text-neutral-400">
                    {order.customer.email}
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {order.items.reduce((sum, i) => sum + i.quantity, 0)}
                </td>
                <td className="px-4 py-3 font-medium text-neutral-900">
                  {formatPrice(order.totalCents)}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {order.payment?.status ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${orderStatusStyles[order.status]}`}
                  >
                    {orderStatusLabels[order.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {order.createdAt.toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-sm font-medium text-brand-primary hover:underline"
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-neutral-400"
                >
                  Nenhum pedido ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
