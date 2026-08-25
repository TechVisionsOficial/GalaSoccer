const categories = [
  {
    label: "Nacional",
    description: "Camisas dos maiores clubes do futebol brasileiro.",
    gradient: "linear-gradient(135deg, #1a4d2e, #0a1f14)",
  },
  {
    label: "Internacional",
    description: "Os grandes clubes da Europa e do mundo.",
    gradient: "linear-gradient(135deg, #2b3a67, #0f172a)",
  },
  {
    label: "Seleções",
    description: "Vista as cores do seu país nos maiores torneios.",
    gradient: "linear-gradient(135deg, #6b3a1f, #2b1710)",
  },
];

export function CategoryShowcase() {
  return (
    <section className="w-full bg-neutral-50 py-16">
      <div className="mx-auto w-full max-w-6xl px-6">
        <h2 className="mb-6 text-2xl font-bold text-neutral-900">
          Explore por categoria
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {categories.map((category) => (
            <a
              key={category.label}
              href="#catalogo"
              className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-xl p-6 text-brand-foreground shadow-sm transition hover:shadow-lg"
              style={{ background: category.gradient }}
            >
              <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/0" />
              <div className="relative">
                <h3 className="text-xl font-bold text-brand-accent-light">
                  {category.label}
                </h3>
                <p className="mt-1 text-sm text-brand-foreground/80">
                  {category.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
