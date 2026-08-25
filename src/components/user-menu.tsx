"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Package, User, UserCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/components/cart-provider";

export function UserMenu() {
  const router = useRouter();
  const { clear: clearCart } = useCart();
  const [name, setName] = useState<string | null>();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearCart();
    setOpen(false);
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
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm hover:text-brand-accent-light"
      >
        {firstName}
        <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-md border border-neutral-200 bg-white py-1 text-neutral-700 shadow-lg">
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-neutral-50"
          >
            <UserCircle className="h-4 w-4" strokeWidth={2} />
            Minha conta
          </Link>
          <Link
            href="/account/orders"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-neutral-50"
          >
            <Package className="h-4 w-4" strokeWidth={2} />
            Meus pedidos
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-neutral-50"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
