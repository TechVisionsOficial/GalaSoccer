import Link from "next/link";
import { CartLink } from "@/components/cart-link";
import { UserMenu } from "@/components/user-menu";

export function SiteHeader() {
  return (
    <header className="bg-brand-primary text-brand-foreground border-b border-brand-accent/30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-wide text-brand-accent"
        >
          Gala Soccer
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex gap-6 text-sm">
            <Link
              href="/?categoria=NACIONAL#catalogo"
              className="hover:text-brand-accent-light"
            >
              Nacional
            </Link>
            <Link
              href="/?categoria=INTERNACIONAL#catalogo"
              className="hover:text-brand-accent-light"
            >
              Internacional
            </Link>
            <Link
              href="/?categoria=SELECAO#catalogo"
              className="hover:text-brand-accent-light"
            >
              Seleções
            </Link>
          </nav>
          <UserMenu />
          <CartLink />
        </div>
      </div>
    </header>
  );
}
