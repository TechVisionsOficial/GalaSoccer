import { ShieldCheck, Truck, Zap } from "lucide-react";

const trustItems = [
  { icon: ShieldCheck, label: "Times oficiais" },
  { icon: Zap, label: "Pagamento via Pix" },
  { icon: Truck, label: "Envio para todo o Brasil" },
];

export function Hero() {
  return (
    <div className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-brand-primary px-6 text-center text-brand-foreground lg:min-h-[90vh]">
      {/* camada de textura sutil */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 14px)",
        }}
      />

      {/* blobs de cor animados, dando profundidade e energia */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -top-24 -left-16 h-96 w-96 rounded-full bg-brand-accent/25 blur-3xl" />
        <div className="animate-blob-delayed absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full bg-red-700/20 blur-3xl" />
        <div className="animate-blob-slow absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
      </div>

      {/* vinheta pra dar contraste ao conteúdo central */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/40 via-transparent to-brand-primary" />

      <div className="relative flex flex-col items-center gap-6">
        <span className="rounded-full border border-brand-accent/40 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-brand-accent-light uppercase backdrop-blur-sm">
          Nacional · Internacional · Seleções
        </span>

        <h1 className="max-w-3xl text-5xl leading-tight font-black tracking-tight sm:text-6xl lg:text-7xl">
          Vista a paixão
          <br />
          pelo <span className="text-shine">futebol</span>
        </h1>

        <p className="max-w-xl text-lg text-brand-foreground/80">
          Camisetas oficiais dos maiores clubes e seleções do mundo, com
          entrega rápida e pagamento facilitado.
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#catalogo"
            className="rounded-full bg-brand-accent px-8 py-3 text-sm font-bold text-brand-primary-dark shadow-lg shadow-brand-accent/20 transition hover:bg-brand-accent-light"
          >
            Ver coleção
          </a>
          <a
            href="#catalogo"
            className="rounded-full border border-brand-foreground/30 px-8 py-3 text-sm font-semibold text-brand-foreground transition hover:border-brand-accent hover:text-brand-accent-light"
          >
            Como funciona
          </a>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-brand-foreground/70">
          {trustItems.map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-brand-accent" strokeWidth={2} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
