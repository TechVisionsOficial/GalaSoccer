"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

import { SIZES } from "@/lib/enum-labels";

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

const updateProductSchema = z.object({
  productId: z.string().min(1),
  name: z.string().trim().min(2, "Nome muito curto"),
  teamId: z.string().min(1, "Selecione um time"),
  type: z.enum(["TITULAR", "RESERVA", "TERCEIRA", "RETRO", "GOLEIRO"]),
  season: z.string().trim().optional(),
  active: z.boolean(),
  variantIds: z.array(z.string().min(1)),
  newSizes: z.array(z.enum(SIZES)),
  newPrice: z.coerce.number().nonnegative().optional(),
  newStock: z.coerce.number().int().nonnegative().optional(),
});

export async function updateProduct(formData: FormData) {
  const variantIds = formData.getAll("variantIds").map(String);

  const parsed = updateProductSchema.parse({
    productId: formData.get("productId"),
    name: formData.get("name"),
    teamId: formData.get("teamId"),
    type: formData.get("type"),
    season: formData.get("season") ?? "",
    active: formData.get("active") === "on",
    variantIds,
    newSizes: formData.getAll("newSizes"),
    newPrice: formData.get("newPrice") || undefined,
    newStock: formData.get("newStock") || undefined,
  });

  const slug = slugify(parsed.name);

  const variantUpdates = variantIds.map((id) => {
    const price = Number(formData.get(`price_${id}`));
    const stock = Number(formData.get(`stock_${id}`));
    return { id, priceCents: Math.round(price * 100), stock };
  });

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: parsed.productId },
      data: {
        name: parsed.name,
        slug,
        teamId: parsed.teamId,
        type: parsed.type,
        season: parsed.season || null,
        active: parsed.active,
      },
    });

    for (const variant of variantUpdates) {
      await tx.productVariant.update({
        where: { id: variant.id },
        data: { priceCents: variant.priceCents, stock: variant.stock },
      });
    }

    if (parsed.newSizes.length > 0 && parsed.newPrice && parsed.newStock !== undefined) {
      const newPriceCents = Math.round(parsed.newPrice * 100);
      await tx.productVariant.createMany({
        data: parsed.newSizes.map((size) => ({
          productId: parsed.productId,
          size,
          priceCents: newPriceCents,
          stock: parsed.newStock!,
          sku: `${slug}-${size}`.toUpperCase(),
        })),
      });
    }
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}
