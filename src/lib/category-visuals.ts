import type { TeamCategory } from "@/generated/prisma/enums";

export const categoryGradients: Record<TeamCategory, string> = {
  NACIONAL: "linear-gradient(135deg, #1a4d2e, #0a1f14)",
  INTERNACIONAL: "linear-gradient(135deg, #2b3a67, #0f172a)",
  SELECAO: "linear-gradient(135deg, #6b3a1f, #2b1710)",
};
