// Dados fictícios só para validar o layout do catálogo antes do banco real
// estar conectado. Remover quando o Prisma/Supabase estiver alimentando a UI.

export type MockCategory = "NACIONAL" | "INTERNACIONAL" | "SELECAO";
export type MockProductType =
  | "TITULAR"
  | "RESERVA"
  | "TERCEIRA"
  | "RETRO"
  | "GOLEIRO";
export type MockSize = "P" | "M" | "G" | "GG" | "XG";

export const categoryLabels: Record<MockCategory, string> = {
  NACIONAL: "Nacional",
  INTERNACIONAL: "Internacional",
  SELECAO: "Seleção",
};

export const typeLabels: Record<MockProductType, string> = {
  TITULAR: "Titular",
  RESERVA: "Reserva",
  TERCEIRA: "Terceira",
  RETRO: "Retrô",
  GOLEIRO: "Goleiro",
};

export type MockProduct = {
  id: string;
  teamName: string;
  initials: string;
  category: MockCategory;
  type: MockProductType;
  season: string;
  priceCents: number;
  sizes: MockSize[];
  gradientFrom: string;
  gradientTo: string;
};

export const mockProducts: MockProduct[] = [
  {
    id: "1",
    teamName: "Flamengo",
    initials: "FLA",
    category: "NACIONAL",
    type: "TITULAR",
    season: "2025/26",
    priceCents: 29990,
    sizes: ["P", "M", "G", "GG"],
    gradientFrom: "#8a1c1c",
    gradientTo: "#2a2a2a",
  },
  {
    id: "2",
    teamName: "Palmeiras",
    initials: "PAL",
    category: "NACIONAL",
    type: "RETRO",
    season: "1999",
    priceCents: 34990,
    sizes: ["M", "G", "GG"],
    gradientFrom: "#0d5c2e",
    gradientTo: "#0a3d1f",
  },
  {
    id: "3",
    teamName: "Real Madrid",
    initials: "RMA",
    category: "INTERNACIONAL",
    type: "TITULAR",
    season: "2025/26",
    priceCents: 32990,
    sizes: ["P", "M", "G", "GG", "XG"],
    gradientFrom: "#e8e8e8",
    gradientTo: "#a8a8b8",
  },
  {
    id: "4",
    teamName: "Manchester City",
    initials: "MCI",
    category: "INTERNACIONAL",
    type: "RESERVA",
    season: "2025/26",
    priceCents: 32990,
    sizes: ["M", "G"],
    gradientFrom: "#6cabdd",
    gradientTo: "#1c3d5a",
  },
  {
    id: "5",
    teamName: "Brasil",
    initials: "BRA",
    category: "SELECAO",
    type: "TITULAR",
    season: "2026",
    priceCents: 34990,
    sizes: ["P", "M", "G", "GG"],
    gradientFrom: "#f2c400",
    gradientTo: "#0d5c2e",
  },
  {
    id: "6",
    teamName: "Argentina",
    initials: "ARG",
    category: "SELECAO",
    type: "GOLEIRO",
    season: "2026",
    priceCents: 31990,
    sizes: ["G", "GG"],
    gradientFrom: "#6cabdd",
    gradientTo: "#f5f1e6",
  },
];
