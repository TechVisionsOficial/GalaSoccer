import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/";
  // Só aceita caminho interno (começando com "/", mas não "//" — evita
  // redirecionamento pra fora do site via URL protocol-relative).
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user?.email) {
      const email = data.user.email;
      const name =
        (data.user.user_metadata?.full_name as string | undefined) ??
        (data.user.user_metadata?.name as string | undefined) ??
        email;

      await prisma.customer.upsert({
        where: { email },
        update: { supabaseUserId: data.user.id },
        create: { email, name, supabaseUserId: data.user.id },
      });

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
