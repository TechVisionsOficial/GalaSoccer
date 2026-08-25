"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/current-customer";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto"),
  phone: z.string().trim().min(8, "Telefone inválido"),
});

export type ProfileFormState = { error: string } | { success: true } | null;

export async function updateProfile(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const customer = await getCurrentCustomer();
  if (!customer) {
    return { error: "Você precisa estar logado." };
  }

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await prisma.customer.update({
    where: { id: customer.id },
    data: parsed.data,
  });

  revalidatePath("/account");
  return { success: true };
}
