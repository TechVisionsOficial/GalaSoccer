import { prisma } from "@/lib/prisma";

export function getTeamBySlug(slug: string) {
  return prisma.team.findUnique({
    where: { slug },
    include: {
      products: {
        where: { active: true },
        include: { team: true, variants: { orderBy: { size: "asc" } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}
