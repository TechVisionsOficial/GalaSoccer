"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-provider";

export function CartLink() {
  const { totalItems } = useCart();

  return (
    <Link href="/carrinho" className="relative flex items-center">
      <ShoppingBag className="h-5 w-5" strokeWidth={2} />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-accent px-1 text-[10px] font-bold text-brand-primary-dark">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
