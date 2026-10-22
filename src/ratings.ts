import { content } from './data';
import type { Rating } from './types';

export type { Rating };

export type RatingLabel = {
  id: Rating;
  label: string;
};

/** The pack's rating_scale. Labels are those strings, with no added definitions. */
export const RATING_SCALE: readonly RatingLabel[] = content.rating_scale.map((id) => ({
  id: id as Rating,
  label: id,
}));

export const RATING_IDS = RATING_SCALE.map((item) => item.id);

export function isRating(value: string): value is Rating {
  return (RATING_IDS as readonly string[]).includes(value);
}

export function ratingLabel(id: string): string {
  return RATING_SCALE.find((item) => item.id === id)?.label ?? id;
}
