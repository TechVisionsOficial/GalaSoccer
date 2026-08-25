"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

const teamSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto"),
  category: z.enum(["NACIONAL", "INTERNACIONAL", "SELECAO"]),
  crestUrl: z
    .union([
      z.literal(""),
      z
        .string()
        .trim()
        .url()
        .refine(
          (url) => url.startsWith("http://") || url.startsWith("https://"),
          "URL precisa começar com http:// ou https://",
        ),
    ])
    .optional(),
});

export async function createTeam(formData: FormData) {
  const parsed = teamSchema.parse({
    name: formData.get("name"),
    category: formData.get("category"),
    crestUrl: formData.get("crestUrl") ?? "",
  });

  await prisma.team.create({
    data: {
      name: parsed.name,
      slug: slugify(parsed.name),
      category: parsed.category,
      crestUrl: parsed.crestUrl || null,
    },
  });

  revalidatePath("/admin/teams");
  redirect("/admin/teams");
}

export async function deleteTeam(formData: FormData) {
  const id = z.string().min(1).parse(formData.get("id"));
  await prisma.team.delete({ where: { id } });
  revalidatePath("/admin/teams");
}
