"use client";

import { useState } from "react";
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

  return (
    <form
      action={createReview}
      className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4"
    >
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="productSlug" value={productSlug} />
      <input type="hidden" name="rating" value={rating} />

      <span className="text-sm font-medium text-neutral-700">
        Deixe sua avaliação
      </span>

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
        name="authorName"
        required
        placeholder="Seu nome"
        className={inputClass}
      />
      <textarea
        name="comment"
        rows={3}
        placeholder="Conte como foi sua experiência (opcional)"
        className={inputClass}
      />

      <button
        type="submit"
        disabled={rating === 0}
        className="self-start rounded-md bg-brand-primary px-5 py-2 text-sm font-medium text-brand-foreground transition hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        Enviar avaliação
      </button>
    </form>
  );
}
