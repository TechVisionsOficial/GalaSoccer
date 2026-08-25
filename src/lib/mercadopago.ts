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
