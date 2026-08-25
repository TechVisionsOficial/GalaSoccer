import { createHmac, timingSafeEqual } from "node:crypto";
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

export function isMercadoPagoConfigured() {
  return Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN);
}

function getClient() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado");
  }
  return new MercadoPagoConfig({ accessToken });
}

export function getPreferenceClient() {
  return new Preference(getClient());
}

export function getPaymentClient() {
  return new Payment(getClient());
}

/** Mapeamento best-effort: o enum PaymentMethod é enxuto (Pix/boleto/cartão),
 * mas o Mercado Pago tem mais granularidade (débito, conta MP, etc). */
export function mapPaymentTypeToMethod(
  paymentTypeId: string | undefined,
): "PIX" | "BOLETO" | "CREDIT_CARD" | null {
  switch (paymentTypeId) {
    case "bank_transfer":
      return "PIX";
    case "ticket":
      return "BOLETO";
    case "credit_card":
    case "debit_card":
      return "CREDIT_CARD";
    default:
      return null;
  }
}

export function mapMpStatusToPaymentStatus(
  status: string | undefined,
): "APPROVED" | "REJECTED" | "PENDING" {
  if (status === "approved") return "APPROVED";
  if (status === "rejected" || status === "cancelled") return "REJECTED";
  return "PENDING";
}

/**
 * Confere a assinatura do webhook do Mercado Pago (header `x-signature`),
 * pra garantir que a notificação veio deles de verdade e não foi forjada.
 * Formato documentado: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/webhooks
 *
 * Se `MERCADOPAGO_WEBHOOK_SECRET` não estiver configurado, a validação é
 * pulada (retorna true) — mesmo padrão de degradação graciosa que usamos
 * pro resto da integração, até a credencial ser configurada.
 */
export function verifyMercadoPagoSignature({
  signatureHeader,
  requestId,
  dataId,
}: {
  signatureHeader: string | null;
  requestId: string | null;
  dataId: string;
}): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return true;

  if (!signatureHeader || !requestId) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((pair) => {
      const [key, value] = pair.split("=");
      return [key?.trim(), value?.trim()];
    }),
  );
  const ts = parts.ts;
  const receivedHash = parts.v1;
  if (!ts || !receivedHash) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`;
  const expectedHash = createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  const expected = Buffer.from(expectedHash, "utf8");
  const received = Buffer.from(receivedHash, "utf8");
  if (expected.length !== received.length) return false;

  return timingSafeEqual(expected, received);
}
