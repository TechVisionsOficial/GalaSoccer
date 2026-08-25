export function SiteHeader() {
  return (
    <header className="bg-brand-primary text-brand-foreground border-b border-brand-accent/30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="text-xl font-bold tracking-wide text-brand-accent">
          Gala Soccer
        </span>
        <nav className="flex gap-6 text-sm">
          <a href="#" className="hover:text-brand-accent-light">
            Nacional
          </a>
          <a href="#" className="hover:text-brand-accent-light">
            Internacional
          </a>
          <a href="#" className="hover:text-brand-accent-light">
            Seleções
          </a>
        </nav>
      </div>
    </header>
  );
}
