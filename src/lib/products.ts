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
    },
  });
}

export type ActiveProduct = Awaited<
  ReturnType<typeof getActiveProducts>
>[number];

export type ProductDetail = NonNullable<
  Awaited<ReturnType<typeof getProductBySlug>>
>;
