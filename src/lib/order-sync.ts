import { prisma } from "@/lib/prisma";
import {
  getPaymentClient,
  mapMpStatusToPaymentStatus,
  mapPaymentTypeToMethod,
} from "@/lib/mercadopago";

/** Busca o pagamento no Mercado Pago e atualiza Order/Payment no banco.
 * Usado pelo webhook (produção) e pela página de retorno (dev, sem
 * webhook público alcançável). */
export async function syncPaymentFromMercadoPago(mpPaymentId: string) {
  const payment = await getPaymentClient().get({ id: mpPaymentId });
  const orderId = payment.external_reference;
  if (!orderId) return null;

  const status = mapMpStatusToPaymentStatus(payment.status);
  const method = mapPaymentTypeToMethod(payment.payment_type_id);

  await prisma.payment.update({
    where: { orderId },
    data: {
      status,
      method: method ?? undefined,
      mercadoPagoPaymentId: String(payment.id),
    },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status:
        status === "APPROVED"
          ? "PAID"
          : status === "REJECTED"
            ? "CANCELED"
            : "PENDING",
    },
  });

  return orderId;
}
