import { Star } from "lucide-react";

export function StarRating({
  rating,
  size = 16,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          width={size}
          height={size}
          className={
            star <= Math.round(rating)
              ? "fill-brand-accent text-brand-accent"
              : "fill-neutral-200 text-neutral-200"
          }
        />
      ))}
    </div>
  );
}
