import { RefreshCw, ShieldCheck, Truck, Zap } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Pix na hora",
    description: "Aprovação instantânea, sem burocracia.",
  },
  {
    icon: Truck,
    title: "Entrega rápida",
    description: "Envio para todo o Brasil com rastreio.",
  },
  {
    icon: RefreshCw,
    title: "Troca garantida",
    description: "7 dias para trocar em caso de tamanho errado.",
  },
  {
    icon: ShieldCheck,
    title: "Times oficiais",
    description: "Produtos licenciados, qualidade garantida.",
  },
];

export function Benefits() {
  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-primary/10">
              <Icon className="h-5 w-5 text-brand-primary" strokeWidth={2} />
            </div>
            <h3 className="font-semibold text-neutral-900">{title}</h3>
            <p className="text-sm text-neutral-500">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
