import { topicLabel } from './people';
import type { Claim, Source } from './types';
import type { Rating } from './types';
import { viewClaim } from './wording';

export type Filters = {
  query: string;
  topic: string | null;
  rating: Rating | null;
};

export function claimHaystack(claim: Claim, sources: ReadonlyMap<string, Source>): string {
  const view = viewClaim(claim);
  const sourceIds = [...claim.claim_sources, ...claim.research.flatMap((item) => item.sources)];
  const sourceText = sourceIds.flatMap((id) => {
    const source = sources.get(id);
    return source
      ? [source.title, source.authors, ...(source.year != null ? [String(source.year)] : [])]
      : [id];
  });
  return [
    claim.id,
    claim.person,
    claim.topic,
    topicLabel(claim.topic),
    claim.rating,
    claim.reasoning,
    view.text,
    view.episode,
    ...claim.research.map((item) => item.text),
    ...sourceText,
  ]
    .join('\n')
    .toLowerCase();
}

export function claimMatches(claim: Claim, filters: Filters, sources: ReadonlyMap<string, Source>): boolean {
  if (filters.topic && claim.topic !== filters.topic) return false;
  if (filters.rating && claim.rating !== filters.rating) return false;
  const query = filters.query.trim().toLowerCase();
  if (!query) return true;
  return claimHaystack(claim, sources).includes(query);
}

export function filterClaims(claims: readonly Claim[], filters: Filters, sources: ReadonlyMap<string, Source>): Claim[] {
  return claims.filter((claim) => claimMatches(claim, filters, sources));
}
