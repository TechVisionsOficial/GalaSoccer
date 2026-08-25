"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const updateStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELED"]),
});

export async function updateOrderStatus(formData: FormData) {
  const parsed = updateStatusSchema.parse({
    orderId: formData.get("orderId"),
    status: formData.get("status"),
  });

  await prisma.order.update({
    where: { id: parsed.orderId },
    data: { status: parsed.status },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${parsed.orderId}`);
}
