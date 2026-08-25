import { isMercadoPagoConfigured } from "@/lib/mercadopago";
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

  try {
    await syncPaymentFromMercadoPago(String(paymentId));
  } catch (err) {
    // Sempre responde 200 pro Mercado Pago não ficar reenviando o webhook;
    // o erro fica registrado no log do servidor pra investigação manual.
    console.error("Erro ao processar webhook Mercado Pago:", err);
  }

  return new Response("ok", { status: 200 });
}
