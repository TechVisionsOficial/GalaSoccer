import Link from "next/link";
import { ChevronDown, Filter, Shirt, Tag, X } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { categoryLabels, typeLabels } from "@/lib/enum-labels";
import type { ProductFilters } from "@/lib/products";

function FilterField({
  id,
  label,
  icon: Icon,
  defaultValue,
  children,
}: {
  id: string;
  label: string;
  icon: typeof Tag;
  defaultValue: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-brand-primary/70 uppercase"
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          name={id}
          defaultValue={defaultValue}
          className="appearance-none rounded-full border border-brand-primary/20 bg-white py-2 pr-9 pl-4 text-sm text-neutral-900 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-accent/30"
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2 text-brand-primary/50"
          strokeWidth={2}
        />
      </div>
    </div>
  );
}

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
    <div className="mb-8 rounded-2xl border border-brand-primary/15 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 p-5">
      <form action="/" className="flex flex-wrap items-end gap-4">
        <FilterField
          id="categoria"
          label="Categoria"
          icon={Tag}
          defaultValue={filters.category ?? ""}
        >
          <option value="">Todas</option>
          {Object.entries(categoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </FilterField>

        <FilterField
          id="time"
          label="Time"
          icon={Shirt}
          defaultValue={filters.teamSlug ?? ""}
        >
          <option value="">Todos</option>
          {teams.map((team) => (
            <option key={team.id} value={team.slug}>
              {team.name}
            </option>
          ))}
        </FilterField>

        <FilterField
          id="tipo"
          label="Tipo"
          icon={Filter}
          defaultValue={filters.type ?? ""}
        >
          <option value="">Todos</option>
          {Object.entries(typeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </FilterField>

        <button
          type="submit"
          className="flex items-center gap-2 rounded-full bg-brand-primary px-6 py-2 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-primary-dark"
        >
          <Filter className="h-3.5 w-3.5" strokeWidth={2} />
          Filtrar
        </button>

        {hasFilters && (
          <Link
            href="/#catalogo"
            className="flex items-center gap-1 rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-800"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2} />
            Limpar
          </Link>
        )}
      </form>
    </div>
  );
}
