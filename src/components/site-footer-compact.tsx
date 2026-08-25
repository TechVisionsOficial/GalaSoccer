export function SiteFooterCompact() {
  return (
    <footer className="w-full border-t border-neutral-200 bg-white px-6 py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 text-xs text-neutral-500 sm:flex-row">
        <span>
          © {new Date().getFullYear()} Gala Soccer. Todos os direitos
          reservados.
        </span>
        <span>Pagamento via Pix, boleto e cartão (Mercado Pago)</span>
      </div>
    </footer>
  );
}
