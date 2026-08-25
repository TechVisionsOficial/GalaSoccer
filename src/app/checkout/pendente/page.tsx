import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { OrderStatusCard } from "@/components/order-status-card";
import { prisma } from "@/lib/prisma";
import { isMercadoPagoConfigured } from "@/lib/mercadopago";
import { syncPaymentFromMercadoPago } from "@/lib/order-sync";

export default async function CheckoutPendingPage({
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

  const message = isMercadoPagoConfigured()
    ? "Seu pagamento está sendo processado. Você vai receber uma confirmação assim que for aprovado."
    : "Pedido registrado, mas o pagamento ainda não pode ser processado — as credenciais do Mercado Pago não foram configuradas neste ambiente.";

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col bg-white">
        <OrderStatusCard
          tone="pending"
          title="Pedido pendente"
          message={message}
          order={order}
        />
      </main>
      <SiteFooter />
    </>
  );
}
