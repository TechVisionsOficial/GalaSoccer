import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

/** Retorna o Customer vinculado ao usuário logado (Supabase Auth), ou null
 * se não estiver logado. Não lança — quem chama decide o que fazer (redirect
 * pra /login, etc). */
export async function getCurrentCustomer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  return prisma.customer.findUnique({ where: { email: user.email } });
}
