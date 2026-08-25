import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { typeLabels, SIZES } from "@/lib/enum-labels";
import { updateProduct } from "../../actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, teams] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { variants: { orderBy: { size: "asc" } } },
    }),
    prisma.team.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const existingSizes = new Set(product.variants.map((v) => v.size));
  const missingSizes = SIZES.filter((s) => !existingSizes.has(s));

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
          Editar produto
        </h1>
      </div>

      <form action={updateProduct} className="flex flex-col gap-4">
        <input type="hidden" name="productId" value={product.id} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-neutral-700">
            Nome
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={product.name}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-primary"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="teamId" className="text-sm font-medium text-neutral-700">
            Time
          </label>
          <select
            id="teamId"
            name="teamId"
            required
            defaultValue={product.teamId}
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
            <label htmlFor="type" className="text-sm font-medium text-neutral-700">
              Tipo
            </label>
            <select
              id="type"
              name="type"
              required
              defaultValue={product.type}
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
            <label htmlFor="season" className="text-sm font-medium text-neutral-700">
              Temporada
            </label>
            <input
              id="season"
              name="season"
              defaultValue={product.season ?? ""}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            name="active"
            defaultChecked={product.active}
          />
          Produto ativo (visível na loja)
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-neutral-700">
            Preço e estoque por tamanho
          </span>
          <div className="rounded-md border border-neutral-200">
            {product.variants.map((variant) => (
              <div
                key={variant.id}
                className="grid grid-cols-[3rem_1fr_1fr] items-center gap-3 border-b border-neutral-100 px-3 py-2 last:border-0"
              >
                <input type="hidden" name="variantIds" value={variant.id} />
                <span className="text-sm font-medium text-neutral-700">
                  {variant.size}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-neutral-400">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name={`price_${variant.id}`}
                    defaultValue={(variant.priceCents / 100).toFixed(2)}
                    className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-neutral-400">Estoque</span>
                  <input
                    type="number"
                    min="0"
                    name={`stock_${variant.id}`}
                    defaultValue={variant.stock}
                    className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm outline-none focus:border-brand-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {missingSizes.length > 0 && (
          <div className="flex flex-col gap-2 rounded-md border border-dashed border-neutral-300 p-3">
            <span className="text-sm font-medium text-neutral-700">
              Adicionar novo tamanho
            </span>
            <div className="flex flex-wrap gap-3">
              {missingSizes.map((size) => (
                <label
                  key={size}
                  className="flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-1.5 text-sm has-[:checked]:border-brand-primary has-[:checked]:bg-brand-primary/5"
                >
                  <input type="checkbox" name="newSizes" value={size} />
                  {size}
                </label>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                step="0.01"
                min="0"
                name="newPrice"
                placeholder="Preço (R$)"
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-primary"
              />
              <input
                type="number"
                min="0"
                name="newStock"
                placeholder="Estoque"
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-primary"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="mt-2 self-start rounded-md bg-brand-primary px-5 py-2.5 text-sm font-medium text-brand-foreground transition hover:bg-brand-primary-dark"
        >
          Salvar alterações
        </button>
      </form>
    </div>
  );
}
