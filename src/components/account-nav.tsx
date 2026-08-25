import Link from "next/link";

export function AccountNav({ active }: { active: "profile" | "orders" }) {
  const tabClass = (tab: "profile" | "orders") =>
    `border-b-2 px-1 pb-2 text-sm font-medium ${
      active === tab
        ? "border-brand-primary text-brand-primary"
        : "border-transparent text-neutral-500 hover:text-neutral-700"
    }`;

  return (
    <nav className="mb-6 flex gap-6 border-b border-neutral-200">
      <Link href="/account" className={tabClass("profile")}>
        Meus dados
      </Link>
      <Link href="/account/orders" className={tabClass("orders")}>
        Meus pedidos
      </Link>
    </nav>
  );
}
