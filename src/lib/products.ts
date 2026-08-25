import { prisma } from "@/lib/prisma";
import type {
  TeamCategory,
  ProductType,
} from "@/generated/prisma/enums";

export type ProductFilters = {
  category?: TeamCategory;
  teamSlug?: string;
  type?: ProductType;
};

export function getActiveProducts(filters: ProductFilters = {}) {
  return prisma.product.findMany({
    where: {
      active: true,
      ...(filters.type ? { type: filters.type } : {}),
      team: {
        ...(filters.category ? { category: filters.category } : {}),
        ...(filters.teamSlug ? { slug: filters.teamSlug } : {}),
      },
    },
    include: {
      team: true,
      variants: { orderBy: { size: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      team: true,
      variants: { orderBy: { size: "asc" } },
      images: { orderBy: { position: "asc" } },
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { customer: { select: { name: true } } },
      },
    },
  });
}

/** Prioriza produtos do mesmo time; completa com produtos da mesma categoria
 * se o time não tiver outros produtos suficientes. */
export async function getRecommendedProducts(
  productId: string,
  teamId: string,
  category: "NACIONAL" | "INTERNACIONAL" | "SELECAO",
  limit = 4,
) {
  const sameTeam = await prisma.product.findMany({
    where: { active: true, teamId, id: { not: productId } },
    include: { team: true, variants: { orderBy: { size: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  if (sameTeam.length >= limit) return sameTeam;

  const excludeIds = [productId, ...sameTeam.map((p) => p.id)];
  const sameCategory = await prisma.product.findMany({
    where: {
      active: true,
      id: { notIn: excludeIds },
      team: { category },
    },
    include: { team: true, variants: { orderBy: { size: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: limit - sameTeam.length,
  });

  return [...sameTeam, ...sameCategory];
}

export type ActiveProduct = Awaited<
  ReturnType<typeof getActiveProducts>
>[number];

export type ProductDetail = NonNullable<
  Awaited<ReturnType<typeof getProductBySlug>>
>;
