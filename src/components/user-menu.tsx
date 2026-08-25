"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function UserMenu() {
  const router = useRouter();
  const [name, setName] = useState<string | null>();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      setName(
        user
          ? ((user.user_metadata?.full_name as string | undefined) ??
              user.email ??
              null)
          : null,
      );
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const user = session?.user;
        setName(
          user
            ? ((user.user_metadata?.full_name as string | undefined) ??
                user.email ??
                null)
            : null,
        );
      },
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (name === undefined) {
    return <span className="h-5 w-5" />;
  }

  if (!name) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-1.5 text-sm hover:text-brand-accent-light"
      >
        <User className="h-4 w-4" strokeWidth={2} />
        Entrar
      </Link>
    );
  }

  const firstName = name.split(" ")[0];

  return (
    <div className="flex items-center gap-3 text-sm">
      <Link href="/account" className="hover:text-brand-accent-light">
        {firstName}
      </Link>
      <button
        type="button"
        onClick={handleSignOut}
        className="text-brand-foreground/70 hover:text-brand-accent-light"
      >
        Sair
      </button>
    </div>
  );
}
