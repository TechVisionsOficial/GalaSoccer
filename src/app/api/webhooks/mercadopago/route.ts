import {
  isMercadoPagoConfigured,
  verifyMercadoPagoSignature,
} from "@/lib/mercadopago";
import { syncPaymentFromMercadoPago } from "@/lib/order-sync";

export async function POST(request: Request) {
  if (!isMercadoPagoConfigured()) {
    return new Response("ok", { status: 200 });
  }

  const body = await request.json().catch(() => null);
  const paymentId = body?.data?.id;

  if (body?.type !== "payment" || !paymentId) {
    return new Response("ignored", { status: 200 });
  }

  const isValid = verifyMercadoPagoSignature({
    signatureHeader: request.headers.get("x-signature"),
    requestId: request.headers.get("x-request-id"),
    dataId: String(paymentId),
  });

  if (!isValid) {
    console.error("Webhook Mercado Pago com assinatura inválida — ignorado.");
    return new Response("invalid signature", { status: 401 });
  }

  try {
    await syncPaymentFromMercadoPago(String(paymentId));
  } catch (err) {
    // Sempre responde 200 pro Mercado Pago não ficar reenviando o webhook;
    // o erro fica registrado no log do servidor pra investigação manual.
    console.error("Erro ao processar webhook Mercado Pago:", err);
  }

  return new Response("ok", { status: 200 });
}
