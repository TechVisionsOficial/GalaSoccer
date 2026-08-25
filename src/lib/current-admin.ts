import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

/** Retorna o Admin vinculado ao usuário logado (Supabase Auth), ou null se
 * não estiver logado OU se o e-mail logado não estiver na tabela Admin —
 * ou seja, um cliente comum logado nunca passa aqui, só quem foi
 * explicitamente cadastrado como administrador. */
export async function getCurrentAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  return prisma.admin.findUnique({ where: { email: user.email } });
}
