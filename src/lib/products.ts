import { prisma } from "@/lib/prisma";

export function getActiveProducts() {
  return prisma.product.findMany({
    where: { active: true },
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
      reviews: { orderBy: { createdAt: "desc" } },
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
