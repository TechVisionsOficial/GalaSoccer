import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { orderStatusLabels, orderStatusStyles } from "@/lib/enum-labels";

export default async function AdminDashboard() {
  const [
    teamCount,
    productCount,
    orderCount,
    pendingOrderCount,
    revenue,
    recentOrders,
    lowStockVariants,
  ] = await Promise.all([
    prisma.team.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({
      where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
      _sum: { totalCents: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { customer: true },
    }),
    prisma.productVariant.findMany({
      where: { stock: { lte: 5 } },
      orderBy: { stock: "asc" },
      take: 8,
      include: { product: true },
    }),
  ]);

  const stats = [
    {
      label: "Faturamento (pedidos pagos)",
      value: formatPrice(revenue._sum.totalCents ?? 0),
      href: "/admin/orders",
    },
    {
      label: "Pedidos pendentes",
      value: pendingOrderCount,
      href: "/admin/orders",
    },
    { label: "Produtos", value: productCount, href: "/admin/products" },
    { label: "Times cadastrados", value: teamCount, href: "/admin/teams" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-500">
          {orderCount} pedido{orderCount === 1 ? "" : "s"} no total
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-lg border border-neutral-200 bg-white p-6 transition hover:border-brand-primary"
          >
            <p className="text-sm text-neutral-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-brand-primary">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-900">
              Últimos pedidos
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-medium text-brand-primary hover:underline"
            >
              Ver todos
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="py-6 text-center text-sm text-neutral-400">
              Nenhum pedido ainda.
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-neutral-100">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between py-2.5 text-sm hover:bg-neutral-50"
                >
                  <div>
                    <p className="font-medium text-neutral-900">
                      {order.customer.name}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {order.createdAt.toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-neutral-900">
                      {formatPrice(order.totalCents)}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${orderStatusStyles[order.status]}`}
                    >
                      {orderStatusLabels[order.status]}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-900">
              Estoque baixo
            </h2>
            <Link
              href="/admin/products"
              className="text-xs font-medium text-brand-primary hover:underline"
            >
              Ver produtos
            </Link>
          </div>
          {lowStockVariants.length === 0 ? (
            <p className="py-6 text-center text-sm text-neutral-400">
              Nenhum tamanho com estoque baixo.
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-neutral-100">
              {lowStockVariants.map((variant) => (
                <Link
                  key={variant.id}
                  href={`/admin/products/${variant.productId}/edit`}
                  className="flex items-center justify-between py-2.5 text-sm hover:bg-neutral-50"
                >
                  <span className="text-neutral-700">
                    {variant.product.name} ({variant.size})
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      variant.stock === 0
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {variant.stock} em estoque
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
