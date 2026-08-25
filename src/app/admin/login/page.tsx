"use client";

import { useActionState } from "react";
import { signInAdmin } from "./actions";

const inputClass =
  "rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-primary";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(signInAdmin, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-6">
        <div className="mb-6 text-center">
          <span className="text-lg font-bold text-brand-primary">
            Gala Soccer
          </span>
          <h1 className="mt-1 text-xl font-bold text-neutral-900">
            Painel administrativo
          </h1>
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

          {state?.error && (
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
      </div>
    </div>
  );
}
