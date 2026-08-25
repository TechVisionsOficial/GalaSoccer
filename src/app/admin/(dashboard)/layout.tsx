import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, LogOut, Shirt, Users2, Receipt } from "lucide-react";
import { getCurrentAdmin } from "@/lib/current-admin";
import { signOutAdmin } from "../login/actions";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produtos", icon: Shirt },
  { href: "/admin/teams", label: "Times", icon: Users2 },
  { href: "/admin/orders", label: "Pedidos", icon: Receipt },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="flex w-60 shrink-0 flex-col border-r border-neutral-200 bg-brand-primary text-brand-foreground">
        <div className="px-6 py-5">
          <span className="text-lg font-bold text-brand-accent">
            Gala Soccer
          </span>
          <p className="text-xs text-brand-foreground/60">Painel admin</p>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-brand-foreground/85 transition hover:bg-white/10 hover:text-brand-foreground"
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 px-6 py-4 text-xs text-brand-foreground/50">
          <span className="text-brand-foreground/70">{admin.name}</span>
          <form action={signOutAdmin}>
            <button
              type="submit"
              className="flex items-center gap-1.5 hover:text-brand-accent-light"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={2} />
              Sair
            </button>
          </form>
          <Link href="/" className="hover:text-brand-accent-light">
            ← voltar para a loja
          </Link>
        </div>
      </aside>

      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
