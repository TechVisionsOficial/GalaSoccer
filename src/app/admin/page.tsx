import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [teamCount, productCount, orderCount] = await Promise.all([
    prisma.team.count(),
    prisma.product.count(),
    prisma.order.count(),
  ]);

  const stats = [
    { label: "Times cadastrados", value: teamCount, href: "/admin/teams" },
    { label: "Produtos", value: productCount, href: "/admin/products" },
    { label: "Pedidos", value: orderCount, href: "/admin/orders" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
    </div>
  );
}
