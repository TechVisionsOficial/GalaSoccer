import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { typeLabels } from "@/lib/mock-products";
import { createProduct } from "../actions";

const SIZES = ["P", "M", "G", "GG", "XG"] as const;

export default async function NewProductPage() {
  const teams = await prisma.team.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <div>
        <Link
          href="/admin/products"
          className="text-sm text-neutral-500 hover:text-neutral-700"
        >
          ← Produtos
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-neutral-900">
          Novo produto
        </h1>
      </div>

      {teams.length === 0 ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Cadastre um{" "}
          <Link href="/admin/teams/new" className="font-medium underline">
            time
          </Link>{" "}
          antes de criar um produto.
        </p>
      ) : (
        <form action={createProduct} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-sm font-medium text-neutral-700"
            >
              Nome
            </label>
            <input
              id="name"
              name="name"
              required
              placeholder="Camisa Flamengo Titular 2025/26"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="teamId"
              className="text-sm font-medium text-neutral-700"
            >
              Time
            </label>
            <select
              id="teamId"
              name="teamId"
              required
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-primary"
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="type"
                className="text-sm font-medium text-neutral-700"
              >
                Tipo
              </label>
              <select
                id="type"
                name="type"
                required
                defaultValue="TITULAR"
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-primary"
              >
                {Object.entries(typeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="season"
                className="text-sm font-medium text-neutral-700"
              >
                Temporada
              </label>
              <input
                id="season"
                name="season"
                placeholder="2025/26"
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="price"
                className="text-sm font-medium text-neutral-700"
              >
                Preço (R$)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="299.90"
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="stock"
                className="text-sm font-medium text-neutral-700"
              >
                Estoque (por tamanho)
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                required
                defaultValue={10}
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-neutral-700">
              Tamanhos disponíveis
            </span>
            <div className="flex flex-wrap gap-3">
              {SIZES.map((size) => (
                <label
                  key={size}
                  className="flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-1.5 text-sm has-[:checked]:border-brand-primary has-[:checked]:bg-brand-primary/5"
                >
                  <input
                    type="checkbox"
                    name="sizes"
                    value={size}
                    defaultChecked={size === "M" || size === "G"}
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" name="active" defaultChecked />
            Produto ativo (visível na loja)
          </label>

          <button
            type="submit"
            className="mt-2 self-start rounded-md bg-brand-primary px-5 py-2.5 text-sm font-medium text-brand-foreground transition hover:bg-brand-primary-dark"
          >
            Salvar produto
          </button>
        </form>
      )}
    </div>
  );
}
