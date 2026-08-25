import Link from "next/link";
import { LayoutDashboard, Shirt, Users2 } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produtos", icon: Shirt },
  { href: "/admin/teams", label: "Times", icon: Users2 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <div className="mt-auto px-6 py-4 text-xs text-brand-foreground/50">
          <Link href="/" className="hover:text-brand-accent-light">
            ← voltar para a loja
          </Link>
        </div>
      </aside>

      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
