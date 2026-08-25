import { categoryGradients } from "@/lib/category-visuals";

const categories = [
  {
    category: "NACIONAL" as const,
    label: "Nacional",
    description: "Camisas dos maiores clubes do futebol brasileiro.",
  },
  {
    category: "INTERNACIONAL" as const,
    label: "Internacional",
    description: "Os grandes clubes da Europa e do mundo.",
  },
  {
    category: "SELECAO" as const,
    label: "Seleções",
    description: "Vista as cores do seu país nos maiores torneios.",
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
              style={{ background: categoryGradients[category.category] }}
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
