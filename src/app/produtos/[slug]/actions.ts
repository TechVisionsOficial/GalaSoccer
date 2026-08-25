"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const reviewSchema = z.object({
  productId: z.string().min(1),
  productSlug: z.string().min(1),
  email: z.string().trim().email("E-mail inválido"),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
});

export type ReviewFormState = { error: string } | { success: true } | null;

export async function createReview(
  _prevState: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const parsed = reviewSchema.safeParse({
    productId: formData.get("productId"),
    productSlug: formData.get("productSlug"),
    email: formData.get("email"),
    rating: formData.get("rating"),
    comment: formData.get("comment") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { productId, productSlug, email, rating, comment } = parsed.data;

  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer) {
    return {
      error:
        "Não encontramos nenhuma compra com esse e-mail. Só quem comprou e recebeu o produto pode avaliar.",
    };
  }

  const deliveredOrderWithProduct = await prisma.order.findFirst({
    where: {
      customerId: customer.id,
      status: "DELIVERED",
      items: { some: { productId } },
    },
  });

  if (!deliveredOrderWithProduct) {
    return {
      error:
        "Só é possível avaliar depois de receber o produto. Não encontramos um pedido entregue com esse item para esse e-mail.",
    };
  }

  const existingReview = await prisma.review.findUnique({
    where: { productId_customerId: { productId, customerId: customer.id } },
  });
  if (existingReview) {
    return { error: "Você já avaliou este produto." };
  }

  await prisma.review.create({
    data: {
      productId,
      customerId: customer.id,
      rating,
      comment: comment || null,
    },
  });

  revalidatePath(`/produtos/${productSlug}`);
  return { success: true };
}
