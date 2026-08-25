"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().trim().email("E-mail inválido"),
  password: z.string().min(1, "Digite sua senha"),
});

export type AdminAuthFormState = { error: string } | null;

export async function signInAdmin(
  _prevState: AdminAuthFormState,
  formData: FormData,
): Promise<AdminAuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "E-mail ou senha incorretos." };
  }

  // Login no Supabase funcionou, mas só quem está cadastrado na tabela
  // Admin pode entrar no painel — qualquer cliente comum é barrado aqui,
  // e a sessão criada é encerrada na hora pra não deixar nada pairando.
  const admin = await prisma.admin.findUnique({
    where: { email: parsed.data.email },
  });

  if (!admin) {
    await supabase.auth.signOut();
    return { error: "Este e-mail não tem acesso ao painel administrativo." };
  }

  redirect("/admin");
}

export async function signOutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
