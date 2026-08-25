function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const columns = [
  {
    title: "Categorias",
    links: ["Nacional", "Internacional", "Seleções"],
  },
  {
    title: "Institucional",
    links: ["Sobre a loja", "Trocas e devoluções", "Política de privacidade"],
  },
  {
    title: "Ajuda",
    links: ["Como comprar", "Formas de pagamento", "Fale conosco"],
  },
];

export function SiteFooter() {
  return (
    <footer className="w-full bg-brand-primary-dark px-6 py-12 text-brand-foreground/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="text-lg font-bold text-brand-accent">
              Gala Soccer
            </span>
            <p className="mt-2 text-sm">
              Camisetas de times nacionais, internacionais e seleções.
            </p>
            <a
              href="#"
              className="mt-4 inline-flex items-center gap-2 text-sm hover:text-brand-accent-light"
            >
              <InstagramIcon className="h-4 w-4" />
              @galasoccer
            </a>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="text-sm font-semibold text-brand-foreground">
                {column.title}
              </h4>
              <ul className="mt-3 flex flex-col gap-2 text-sm">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-brand-accent-light">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-brand-foreground/10 pt-6 text-xs sm:flex-row">
          <span>
            © {new Date().getFullYear()} Gala Soccer. Todos os direitos
            reservados.
          </span>
          <span>Pagamento via Pix, boleto e cartão (Mercado Pago)</span>
        </div>
      </div>
    </footer>
  );
}
