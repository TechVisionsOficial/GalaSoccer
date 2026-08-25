import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProfileForm } from "@/components/profile-form";
import { getCurrentCustomer } from "@/lib/current-customer";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { orderStatusLabels, orderStatusStyles } from "@/lib/enum-labels";

export default async function AccountPage() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { customerId: customer.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col bg-white">
        <div className="mx-auto w-full max-w-4xl px-6 py-10">
          <h1 className="mb-6 text-2xl font-bold text-neutral-900">
            Minha conta
          </h1>

          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="w-full max-w-sm rounded-lg border border-neutral-200 p-5">
              <h2 className="mb-3 text-sm font-semibold text-neutral-900">
                Seus dados
              </h2>
              <ProfileForm
                name={customer.name}
                phone={customer.phone}
                email={customer.email}
              />
            </div>

            <div className="flex-1">
              <h2 className="mb-3 text-sm font-semibold text-neutral-900">
                Meus pedidos
              </h2>

              {orders.length === 0 ? (
                <p className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-500">
                  Você ainda não fez nenhum pedido.
                </p>
              ) : (
                <div className="flex flex-col divide-y divide-neutral-100 rounded-lg border border-neutral-200">
                  {orders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/account/orders/${order.id}`}
                      className="flex items-center justify-between px-4 py-3 text-sm hover:bg-neutral-50"
                    >
                      <div>
                        <p className="font-mono text-xs text-neutral-400">
                          Pedido {order.id.slice(0, 8)}
                        </p>
                        <p className="text-neutral-600">
                          {order.items.reduce(
                            (sum, i) => sum + i.quantity,
                            0,
                          )}{" "}
                          item(ns) ·{" "}
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
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
