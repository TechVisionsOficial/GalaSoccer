import Link from "next/link";
import { categoryLabels } from "@/lib/mock-products";
import { createTeam } from "../actions";

export default function NewTeamPage() {
  return (
    <div className="flex max-w-lg flex-col gap-6">
      <div>
        <Link
          href="/admin/teams"
          className="text-sm text-neutral-500 hover:text-neutral-700"
        >
          ← Times
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-neutral-900">
          Novo time
        </h1>
      </div>

      <form action={createTeam} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-neutral-700">
            Nome
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="Flamengo"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-primary"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="category"
            className="text-sm font-medium text-neutral-700"
          >
            Categoria
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue="NACIONAL"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-primary"
          >
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="crestUrl"
            className="text-sm font-medium text-neutral-700"
          >
            URL do escudo (opcional)
          </label>
          <input
            id="crestUrl"
            name="crestUrl"
            type="url"
            placeholder="https://..."
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-primary"
          />
        </div>

        <button
          type="submit"
          className="mt-2 self-start rounded-md bg-brand-primary px-5 py-2.5 text-sm font-medium text-brand-foreground transition hover:bg-brand-primary-dark"
        >
          Salvar time
        </button>
      </form>
    </div>
  );
}
