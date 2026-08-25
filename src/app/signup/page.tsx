"use client";

import { useActionState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GoogleAuthButton } from "@/components/google-auth-button";
import { signUpWithPassword } from "./actions";

const inputClass =
  "rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-primary";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(
    signUpWithPassword,
    null,
  );

  if (state && "success" in state) {
    return (
      <>
        <SiteHeader />
        <main className="flex flex-1 flex-col items-center bg-white px-6 py-16">
          <div className="w-full max-w-sm rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            {state.message}
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center bg-white px-6 py-16">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              Criar conta
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Cadastre-se pra acompanhar seus pedidos.
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
              name="name"
              required
              placeholder="Nome completo"
              className={inputClass}
            />
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
              minLength={6}
              placeholder="Senha (mínimo 6 caracteres)"
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
              {isPending ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-500">
            Já tem conta?{" "}
            <Link
              href="/login"
              className="font-medium text-brand-primary hover:underline"
            >
              Entrar
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
