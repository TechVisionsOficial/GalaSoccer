import Link from "next/link";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { formatPrice } from "@/lib/format";

const toneConfig = {
  success: { icon: CheckCircle2, color: "text-green-600" },
  pending: { icon: Clock, color: "text-amber-600" },
  error: { icon: XCircle, color: "text-red-600" },
} as const;

export function OrderStatusCard({
  tone,
  title,
  message,
  order,
}: {
  tone: keyof typeof toneConfig;
  title: string;
  message: string;
  order?: { id: string; totalCents: number } | null;
}) {
  const { icon: Icon, color } = toneConfig[tone];

  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <Icon className={`mx-auto h-12 w-12 ${color}`} strokeWidth={1.5} />
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">{title}</h1>
      <p className="mt-2 text-neutral-600">{message}</p>

      {order && (
        <div className="mt-6 rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-600">
          <p>
            Pedido <span className="font-mono">{order.id.slice(0, 8)}</span>
          </p>
          <p className="mt-1 font-semibold text-neutral-900">
            {formatPrice(order.totalCents)}
          </p>
        </div>
      )}

      <Link
        href="/#catalogo"
        className="mt-8 inline-block rounded-md bg-brand-primary px-5 py-2.5 text-sm font-medium text-brand-foreground transition hover:bg-brand-primary-dark"
      >
        Voltar à loja
      </Link>
    </div>
  );
}
