import type { TeamCategory, ProductType } from "@/generated/prisma/enums";

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
