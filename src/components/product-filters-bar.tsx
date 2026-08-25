import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { categoryLabels, typeLabels } from "@/lib/enum-labels";
import type { ProductFilters } from "@/lib/products";

const selectClass =
  "rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-primary";

export async function ProductFiltersBar({
  filters,
}: {
  filters: ProductFilters;
}) {
  const teams = await prisma.team.findMany({ orderBy: { name: "asc" } });
  const hasFilters = Boolean(
    filters.category || filters.teamSlug || filters.type,
  );

  return (
    <form
      action="/"
      className="mb-6 flex flex-wrap items-end gap-3 border-b border-neutral-100 pb-6"
    >
      <div className="flex flex-col gap-1">
        <label
          htmlFor="categoria"
          className="text-xs font-medium text-neutral-500"
        >
          Categoria
        </label>
        <select
          id="categoria"
          name="categoria"
          defaultValue={filters.category ?? ""}
          className={selectClass}
        >
          <option value="">Todas</option>
          {Object.entries(categoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="time" className="text-xs font-medium text-neutral-500">
          Time
        </label>
        <select
          id="time"
          name="time"
          defaultValue={filters.teamSlug ?? ""}
          className={selectClass}
        >
          <option value="">Todos</option>
          {teams.map((team) => (
            <option key={team.id} value={team.slug}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="tipo" className="text-xs font-medium text-neutral-500">
          Tipo
        </label>
        <select
          id="tipo"
          name="tipo"
          defaultValue={filters.type ?? ""}
          className={selectClass}
        >
          <option value="">Todos</option>
          {Object.entries(typeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-brand-foreground transition hover:bg-brand-primary-dark"
      >
        Filtrar
      </button>

      {hasFilters && (
        <Link
          href="/#catalogo"
          className="text-sm text-neutral-500 hover:text-neutral-700"
        >
          Limpar filtros
        </Link>
      )}
    </form>
  );
}
