"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

const SIZES = ["P", "M", "G", "GG", "XG"] as const;

const productSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto"),
  teamId: z.string().min(1, "Selecione um time"),
  type: z.enum(["TITULAR", "RESERVA", "TERCEIRA", "RETRO", "GOLEIRO"]),
  season: z.string().trim().optional(),
  price: z.coerce.number().positive("Preço precisa ser maior que zero"),
  stock: z.coerce.number().int().nonnegative(),
  sizes: z.array(z.enum(SIZES)).min(1, "Selecione ao menos um tamanho"),
  active: z.boolean(),
});

export async function createProduct(formData: FormData) {
  const parsed = productSchema.parse({
    name: formData.get("name"),
    teamId: formData.get("teamId"),
    type: formData.get("type"),
    season: formData.get("season") ?? "",
    price: formData.get("price"),
    stock: formData.get("stock"),
    sizes: formData.getAll("sizes"),
    active: formData.get("active") === "on",
  });

  const slug = slugify(parsed.name);
  const priceCents = Math.round(parsed.price * 100);

  await prisma.product.create({
    data: {
      name: parsed.name,
      slug,
      teamId: parsed.teamId,
      type: parsed.type,
      season: parsed.season || null,
      active: parsed.active,
      variants: {
        create: parsed.sizes.map((size) => ({
          size,
          priceCents,
          stock: parsed.stock,
          sku: `${slug}-${size}`.toUpperCase(),
        })),
      },
    },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  const id = z.string().min(1).parse(formData.get("id"));
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}
