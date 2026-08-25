import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { slugify } from "../src/lib/slugify";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const teams = [
  { name: "Flamengo", category: "NACIONAL" as const },
  { name: "Palmeiras", category: "NACIONAL" as const },
  { name: "Corinthians", category: "NACIONAL" as const },
  { name: "Real Madrid", category: "INTERNACIONAL" as const },
  { name: "Manchester City", category: "INTERNACIONAL" as const },
  { name: "Brasil", category: "SELECAO" as const },
  { name: "Argentina", category: "SELECAO" as const },
];

type SeedVariant = { size: "P" | "M" | "G" | "GG" | "XG"; stock: number };

const products = [
  {
    team: "Flamengo",
    name: "Camisa Flamengo Retrô 1981",
    type: "RETRO" as const,
    season: "1981",
    priceCents: 34990,
    variants: [
      { size: "M", stock: 8 },
      { size: "G", stock: 6 },
      { size: "GG", stock: 3 },
    ] satisfies SeedVariant[],
  },
  {
    team: "Palmeiras",
    name: "Camisa Palmeiras Titular",
    type: "TITULAR" as const,
    season: "2025/26",
    priceCents: 29990,
    variants: [
      { size: "P", stock: 12 },
      { size: "M", stock: 20 },
      { size: "G", stock: 18 },
      { size: "GG", stock: 4 },
    ] satisfies SeedVariant[],
  },
  {
    team: "Palmeiras",
    name: "Camisa Palmeiras Retrô 1999",
    type: "RETRO" as const,
    season: "1999",
    priceCents: 34990,
    variants: [
      { size: "M", stock: 5 },
      { size: "G", stock: 0 },
    ] satisfies SeedVariant[],
  },
  {
    team: "Corinthians",
    name: "Camisa Corinthians Titular",
    type: "TITULAR" as const,
    season: "2025/26",
    priceCents: 29990,
    variants: [
      { size: "P", stock: 10 },
      { size: "M", stock: 15 },
      { size: "G", stock: 15 },
      { size: "GG", stock: 7 },
    ] satisfies SeedVariant[],
  },
  {
    team: "Real Madrid",
    name: "Camisa Real Madrid Titular",
    type: "TITULAR" as const,
    season: "2025/26",
    priceCents: 32990,
    variants: [
      { size: "P", stock: 9 },
      { size: "M", stock: 22 },
      { size: "G", stock: 20 },
      { size: "GG", stock: 10 },
      { size: "XG", stock: 2 },
    ] satisfies SeedVariant[],
  },
  {
    team: "Real Madrid",
    name: "Camisa Real Madrid Reserva",
    type: "RESERVA" as const,
    season: "2025/26",
    priceCents: 32990,
    variants: [
      { size: "M", stock: 6 },
      { size: "G", stock: 6 },
    ] satisfies SeedVariant[],
  },
  {
    team: "Manchester City",
    name: "Camisa Manchester City Titular",
    type: "TITULAR" as const,
    season: "2025/26",
    priceCents: 32990,
    variants: [
      { size: "M", stock: 14 },
      { size: "G", stock: 11 },
    ] satisfies SeedVariant[],
  },
  {
    team: "Brasil",
    name: "Camisa Brasil Titular",
    type: "TITULAR" as const,
    season: "2026",
    priceCents: 34990,
    variants: [
      { size: "P", stock: 16 },
      { size: "M", stock: 30 },
      { size: "G", stock: 25 },
      { size: "GG", stock: 12 },
    ] satisfies SeedVariant[],
  },
  {
    team: "Brasil",
    name: "Camisa Brasil Goleiro",
    type: "GOLEIRO" as const,
    season: "2026",
    priceCents: 31990,
    variants: [
      { size: "G", stock: 4 },
      { size: "GG", stock: 1 },
    ] satisfies SeedVariant[],
  },
  {
    team: "Argentina",
    name: "Camisa Argentina Titular",
    type: "TITULAR" as const,
    season: "2026",
    priceCents: 34990,
    variants: [
      { size: "P", stock: 8 },
      { size: "M", stock: 17 },
      { size: "G", stock: 14 },
    ] satisfies SeedVariant[],
  },
];

async function main() {
  const teamIdByName = new Map<string, string>();

  for (const team of teams) {
    const slug = slugify(team.name);
    const created = await prisma.team.upsert({
      where: { slug },
      update: {},
      create: { name: team.name, slug, category: team.category },
    });
    teamIdByName.set(team.name, created.id);
  }

  for (const product of products) {
    const teamId = teamIdByName.get(product.team)!;
    const slug = slugify(product.name);

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      console.log(`Já existe, pulando: ${product.name}`);
      continue;
    }

    await prisma.product.create({
      data: {
        name: product.name,
        slug,
        teamId,
        type: product.type,
        season: product.season,
        active: true,
        variants: {
          create: product.variants.map((v) => ({
            size: v.size,
            priceCents: product.priceCents,
            stock: v.stock,
            sku: `${slug}-${v.size}`.toUpperCase(),
          })),
        },
      },
    });
    console.log(`Criado: ${product.name}`);
  }
}

main()
  .then(() => console.log("Seed concluído."))
  .catch((err) => {
    console.error("Erro no seed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
