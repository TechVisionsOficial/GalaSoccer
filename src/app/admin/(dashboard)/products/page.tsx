import Link from "next/link";
import { Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { typeLabels } from "@/lib/enum-labels";
import { formatPrice } from "@/lib/format";
import { ProductType } from "@/generated/prisma/enums";
import { deleteProduct } from "./actions";

const selectClass =
  "rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-primary";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const teamId = typeof params.time === "string" ? params.time : "";
  const type =
    typeof params.tipo === "string" &&
    (Object.values(ProductType) as string[]).includes(params.tipo)
      ? (params.tipo as ProductType)
      : undefined;
  const status = typeof params.status === "string" ? params.status : "";

  const [teams, products] = await Promise.all([
    prisma.team.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: {
        ...(teamId ? { teamId } : {}),
        ...(type ? { type } : {}),
        ...(status === "ativo"
          ? { active: true }
          : status === "inativo"
            ? { active: false }
            : {}),
      },
      orderBy: { createdAt: "desc" },
      include: { team: true, variants: true },
    }),
  ]);

  const hasFilters = Boolean(teamId || type || status);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Produtos</h1>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-brand-foreground transition hover:bg-brand-primary-dark"
        >
          + Novo produto
        </Link>
      </div>

      <form
        action="/admin/products"
        className="flex flex-wrap items-end gap-3"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="time" className="text-xs font-medium text-neutral-500">
            Time
          </label>
          <select
            id="time"
            name="time"
            defaultValue={teamId}
            className={selectClass}
          >
            <option value="">Todos</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
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
            defaultValue={type ?? ""}
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

        <div className="flex flex-col gap-1">
          <label
            htmlFor="status"
            className="text-xs font-medium text-neutral-500"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status}
            className={selectClass}
          >
            <option value="">Todos</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
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
            href="/admin/products"
            className="text-sm text-neutral-500 hover:text-neutral-700"
          >
            Limpar filtros
          </Link>
        )}
      </form>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Produto</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Preço</th>
              <th className="px-4 py-3 font-medium">Estoque</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const minPrice = Math.min(
                ...product.variants.map((v) => v.priceCents),
              );

              return (
                <tr
                  key={product.id}
                  className="border-b border-neutral-100 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {product.team.name}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {typeLabels[product.type]}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {product.variants.length > 0
                      ? formatPrice(minPrice)
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {product.variants.map((variant) => (
                        <span
                          key={variant.id}
                          className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                            variant.stock === 0
                              ? "bg-red-100 text-red-700"
                              : variant.stock <= 5
                                ? "bg-amber-100 text-amber-700"
                                : "bg-neutral-100 text-neutral-600"
                          }`}
                          title={`${variant.size}: ${variant.stock} em estoque`}
                        >
                          {variant.size}:{variant.stock}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        product.active
                          ? "bg-green-100 text-green-700"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {product.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-sm font-medium text-brand-primary hover:underline"
                      >
                        Editar
                      </Link>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={product.id} />
                        <button
                          type="submit"
                          className="text-neutral-400 transition hover:text-red-600"
                          aria-label={`Excluir ${product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-neutral-400"
                >
                  {hasFilters
                    ? "Nenhum produto encontrado com esses filtros."
                    : "Nenhum produto cadastrado ainda."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
