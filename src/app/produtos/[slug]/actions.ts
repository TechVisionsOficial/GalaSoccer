"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const reviewSchema = z.object({
  productId: z.string().min(1),
  productSlug: z.string().min(1),
  authorName: z.string().trim().min(2, "Nome muito curto").max(80),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
});

export async function createReview(formData: FormData) {
  const parsed = reviewSchema.parse({
    productId: formData.get("productId"),
    productSlug: formData.get("productSlug"),
    authorName: formData.get("authorName"),
    rating: formData.get("rating"),
    comment: formData.get("comment") || undefined,
  });

  await prisma.review.create({
    data: {
      productId: parsed.productId,
      authorName: parsed.authorName,
      rating: parsed.rating,
      comment: parsed.comment || null,
    },
  });

  revalidatePath(`/produtos/${parsed.productSlug}`);
}
