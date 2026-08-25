"use client";

import { useActionState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterCompact } from "@/components/site-footer-compact";
import { GoogleAuthButton } from "@/components/google-auth-button";
import { signInWithPassword } from "./actions";

const inputClass =
  "rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-primary";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    signInWithPassword,
    null,
  );

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center bg-white px-6 py-16">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Entrar</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Acesse sua conta Gala Soccer.
            </p>
          </div>

          <GoogleAuthButton />

          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <div className="h-px flex-1 bg-neutral-200" />
            ou
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          <form action={formAction} className="flex flex-col gap-3">
            <input
              name="email"
              type="email"
              required
              placeholder="E-mail"
              className={inputClass}
            />
            <input
              name="password"
              type="password"
              required
              placeholder="Senha"
              className={inputClass}
            />

            {state && "error" in state && (
              <p className="text-sm text-red-600">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-brand-primary px-5 py-2.5 text-sm font-medium text-brand-foreground transition hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-500">
            Não tem conta?{" "}
            <Link
              href="/signup"
              className="font-medium text-brand-primary hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </main>
      <SiteFooterCompact />
    </>
  );
}
