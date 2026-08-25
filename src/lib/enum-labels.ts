import type {
  TeamCategory,
  ProductType,
  OrderStatus,
} from "@/generated/prisma/enums";

export const categoryLabels: Record<TeamCategory, string> = {
  NACIONAL: "Nacional",
  INTERNACIONAL: "Internacional",
  SELECAO: "Seleção",
};

export const typeLabels: Record<ProductType, string> = {
  TITULAR: "Titular",
  RESERVA: "Reserva",
  TERCEIRA: "Terceira",
  RETRO: "Retrô",
  GOLEIRO: "Goleiro",
};

export const SIZES = ["P", "M", "G", "GG", "XG"] as const;

export const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELED: "Cancelado",
};

export const orderStatusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-green-100 text-green-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-neutral-200 text-neutral-700",
  CANCELED: "bg-red-100 text-red-700",
};
