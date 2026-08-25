"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getPreferenceClient, isMercadoPagoConfigured } from "@/lib/mercadopago";

const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2, "Nome muito curto"),
    email: z.string().trim().email("E-mail inválido"),
    phone: z.string().trim().min(8, "Telefone inválido"),
  }),
  address: z.object({
    street: z.string().trim().min(2, "Endereço inválido"),
    number: z.string().trim().min(1, "Número inválido"),
    complement: z.string().trim().optional(),
    district: z.string().trim().min(2, "Bairro inválido"),
    city: z.string().trim().min(2, "Cidade inválida"),
    state: z.string().trim().length(2, "UF inválida"),
    zipCode: z.string().trim().min(8, "CEP inválido"),
  }),
  items: z
    .array(
      z.object({
        variantId: z.string().min(1),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, "Carrinho vazio"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export async function createOrder(input: CheckoutInput) {
  const parsed = checkoutSchema.parse(input);

  // Preço e estoque sempre vêm do banco — nunca do que o cliente mandou.
  const variantIds = parsed.items.map((i) => i.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: true },
  });
  const variantMap = new Map(variants.map((v) => [v.id, v]));

  for (const item of parsed.items) {
    if (!variantMap.has(item.variantId)) {
      throw new Error("Um dos produtos do carrinho não existe mais.");
    }
  }

  const totalCents = parsed.items.reduce((sum, item) => {
    const variant = variantMap.get(item.variantId)!;
    return sum + variant.priceCents * item.quantity;
  }, 0);

  const order = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.upsert({
      where: { email: parsed.customer.email },
      update: { name: parsed.customer.name, phone: parsed.customer.phone },
      create: parsed.customer,
    });

    const address = await tx.address.create({
      data: { ...parsed.address, customerId: customer.id },
    });

    const createdOrder = await tx.order.create({
      data: {
        customerId: customer.id,
        addressId: address.id,
        totalCents,
        status: "PENDING",
        items: {
          create: parsed.items.map((item) => {
            const variant = variantMap.get(item.variantId)!;
            return {
              productId: variant.productId,
              productVariantId: variant.id,
              quantity: item.quantity,
              unitPriceCents: variant.priceCents,
            };
          }),
        },
        payment: {
          create: { amountCents: totalCents, status: "PENDING" },
        },
      },
    });

    // Checagem + decremento atômicos: o WHERE com stock >= quantity garante
    // que, sob concorrência, só um comprador consegue levar a última
    // unidade — evita vender estoque negativo (condição de corrida).
    for (const item of parsed.items) {
      const variant = variantMap.get(item.variantId)!;
      const { count } = await tx.productVariant.updateMany({
        where: { id: item.variantId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });
      if (count === 0) {
        throw new Error(
          `Estoque insuficiente para ${variant.product.name} (${variant.size}).`,
        );
      }
    }

    return createdOrder;
  });

  let redirectUrl = `/checkout/pendente?order=${order.id}`;

  if (isMercadoPagoConfigured()) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    try {
      const preference = await getPreferenceClient().create({
        body: {
          items: parsed.items.map((item) => {
            const variant = variantMap.get(item.variantId)!;
            return {
              id: variant.id,
              title: `${variant.product.name} - ${variant.size}`,
              quantity: item.quantity,
              unit_price: variant.priceCents / 100,
              currency_id: "BRL",
            };
          }),
          payer: { name: parsed.customer.name, email: parsed.customer.email },
          external_reference: order.id,
          back_urls: {
            success: `${baseUrl}/checkout/sucesso`,
            failure: `${baseUrl}/checkout/erro`,
            pending: `${baseUrl}/checkout/pendente`,
          },
          auto_return: "approved",
          notification_url: `${baseUrl}/api/webhooks/mercadopago`,
        },
      });
      if (preference.init_point) {
        redirectUrl = preference.init_point;
      }
    } catch (err) {
      console.error("Erro ao criar preferência Mercado Pago:", err);
      redirectUrl = `/checkout/erro?order=${order.id}`;
    }
  }

  redirect(redirectUrl);
}
