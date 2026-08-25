"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { createReview } from "@/app/produtos/[slug]/actions";

const inputClass =
  "rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-primary";

export function ReviewForm({
  productId,
  productSlug,
}: {
  productId: string;
  productSlug: string;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [state, formAction, isPending] = useActionState(createReview, null);

  if (state && "success" in state) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        Avaliação enviada, obrigado!
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4"
    >
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="productSlug" value={productSlug} />
      <input type="hidden" name="rating" value={rating} />

      <span className="text-sm font-medium text-neutral-700">
        Deixe sua avaliação
      </span>
      <p className="text-xs text-neutral-400">
        Só quem comprou e já recebeu o produto pode avaliar.
      </p>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
          >
            <Star
              width={22}
              height={22}
              className={
                star <= (hoverRating || rating)
                  ? "fill-brand-accent text-brand-accent"
                  : "fill-neutral-200 text-neutral-200"
              }
            />
          </button>
        ))}
      </div>

      <input
        name="email"
        type="email"
        required
        placeholder="E-mail usado na compra"
        className={inputClass}
      />
      <textarea
        name="comment"
        rows={3}
        placeholder="Conte como foi sua experiência (opcional)"
        className={inputClass}
      />

      {state && "error" in state && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={rating === 0 || isPending}
        className="self-start rounded-md bg-brand-primary px-5 py-2 text-sm font-medium text-brand-foreground transition hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPending ? "Enviando..." : "Enviar avaliação"}
      </button>
    </form>
  );
}
