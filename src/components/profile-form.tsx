"use client";

import { useActionState } from "react";
import { updateProfile } from "@/app/account/actions";

const inputClass =
  "rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-primary";

export function ProfileForm({
  name,
  phone,
  email,
}: {
  name: string;
  phone: string | null;
  email: string;
}) {
  const [state, formAction, isPending] = useActionState(updateProfile, null);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700">
          E-mail
        </label>
        <input
          value={email}
          disabled
          className={`${inputClass} bg-neutral-50 text-neutral-400`}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-neutral-700">
          Nome
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={name}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="phone"
          className="text-sm font-medium text-neutral-700"
        >
          Telefone
        </label>
        <input
          id="phone"
          name="phone"
          required
          defaultValue={phone ?? ""}
          className={inputClass}
        />
      </div>

      {state && "error" in state && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
      {state && "success" in state && (
        <p className="text-sm text-green-700">Dados atualizados!</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-md bg-brand-primary px-5 py-2 text-sm font-medium text-brand-foreground transition hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}
