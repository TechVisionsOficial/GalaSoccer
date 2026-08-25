"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const signupSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto"),
  email: z.string().trim().email("E-mail inválido"),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
});

export type SignupFormState =
  | { error: string }
  | { success: true; message: string }
  | null;

export async function signUpWithPassword(
  _prevState: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { name, email, password } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });

  if (error) {
    return {
      error:
        error.code === "user_already_exists"
          ? "Já existe uma conta com esse e-mail."
          : error.message,
    };
  }

  if (!data.user) {
    return { error: "Não foi possível criar a conta. Tente novamente." };
  }

  await prisma.customer.upsert({
    where: { email },
    update: { name, supabaseUserId: data.user.id },
    create: { name, email, supabaseUserId: data.user.id },
  });

  if (!data.session) {
    return {
      success: true,
      message: "Conta criada! Confira seu e-mail para confirmar o cadastro.",
    };
  }

  redirect("/");
}
