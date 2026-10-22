import type { Rating } from './types';

export type { Rating };

export type RatingDefinition = {
  id: Rating;
  label: string;
  definition: string;
};

/** The pack scale. A rating describes one claim against the sources on its card. */
export const RATING_SCALE: readonly RatingDefinition[] = [
  {
    id: 'supported',
    label: 'Supported',
    definition:
      'The stated claim agrees with what the listed research reports, including the limits those sources state.',
  },
  {
    id: 'extrapolated beyond evidence',
    label: 'Extrapolated beyond evidence',
    definition:
      'The listed research reports a related result. The stated claim extends past that result, for example to another group, a larger effect, or a cause the sources do not establish.',
  },
  {
    id: 'unsupported',
    label: 'Unsupported',
    definition:
      'The listed research does not report the stated claim, or it reports a result at odds with the claim.',
  },
];

export const RATING_IDS = RATING_SCALE.map((item) => item.id);

export function isRating(value: string): value is Rating {
  return (RATING_IDS as readonly string[]).includes(value);
}

export function ratingLabel(id: string): string {
  return RATING_SCALE.find((item) => item.id === id)?.label ?? id;
}
