import Link from "next/link";
import { Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { categoryLabels } from "@/lib/mock-products";
import { deleteTeam } from "./actions";

export default async function TeamsPage() {
  const teams = await prisma.team.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Times</h1>
        <Link
          href="/admin/teams/new"
          className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-brand-foreground transition hover:bg-brand-primary-dark"
        >
          + Novo time
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Produtos</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-900">
                  {team.name}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {categoryLabels[team.category]}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {team._count.products}
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteTeam}>
                    <input type="hidden" name="id" value={team.id} />
                    <button
                      type="submit"
                      className="text-neutral-400 transition hover:text-red-600"
                      aria-label={`Excluir ${team.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {teams.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-neutral-400"
                >
                  Nenhum time cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
