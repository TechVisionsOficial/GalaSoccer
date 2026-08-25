import { SiteHeader } from "@/components/site-header";
import { SiteFooterCompact } from "@/components/site-footer-compact";
import { OrderStatusCard } from "@/components/order-status-card";
import { prisma } from "@/lib/prisma";
import { syncPaymentFromMercadoPago } from "@/lib/order-sync";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string; order?: string }>;
}) {
  const params = await searchParams;
  let orderId = params.order;

  if (params.payment_id) {
    try {
      const syncedOrderId = await syncPaymentFromMercadoPago(
        params.payment_id,
      );
      if (syncedOrderId) orderId = syncedOrderId;
    } catch (err) {
      console.error("Erro ao sincronizar pagamento:", err);
    }
  }

  const order = orderId
    ? await prisma.order.findUnique({ where: { id: orderId } })
    : null;

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col bg-white">
        <OrderStatusCard
          tone="success"
          title="Pagamento aprovado!"
          message="Seu pedido foi confirmado e já está sendo preparado."
          order={order}
        />
      </main>
      <SiteFooterCompact />
    </>
  );
}
