import type { Claim } from './types';

export type ClaimView = {
  kind: 'quote' | 'paraphrase';
  text: string;
  aside: string;
  episode: string;
  provisional: boolean;
};

/**
 * The pack records verified wording in `wording_status`
 * ("verified quote …" or "verified wording …"). Only those claims may render as quotes.
 */
export function isVerifiedWording(claim: Pick<Claim, 'wording_status'>): boolean {
  return /^verified\b/.test(claim.wording_status);
}

export function isAttributionGap(claim: Pick<Claim, 'wording_status'>): boolean {
  return /ATTRIBUTION GAP/i.test(claim.wording_status);
}

/** Provisional only when the pack itself flags the rating. */
export function isProvisional(claim: Claim): boolean {
  const record = claim as Claim & { provisional?: boolean };
  if (record.provisional === true) return true;
  const haystack = [
    claim.rating,
    claim.reasoning,
    claim.wording_status,
    ...claim.research.flatMap((item) => [item.type, item.text]),
  ].join('\n');
  return /\bprovisional\b/i.test(haystack);
}

/** Remove quotation marks. Apostrophes inside words stay. */
export function stripQuoteMarks(text: string): string {
  const withoutDoubles = text.replace(/["“”«»„‟]/g, '');
  return withoutDoubles
    .replace(/(^|[\s(\[])['‘]([^'’]+)['’](?=$|[\s).,;:\]])/g, '$1$2')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

/** A located episode or page sits after the em dash. Otherwise the episode is unknown. */
export function episodeLabel(claim: Pick<Claim, 'wording_status'>): string {
  if (isAttributionGap(claim)) return 'unknown';
  const parts = claim.wording_status.split(/\s—\s/);
  if (parts.length < 2) return 'unknown';
  const located = stripQuoteMarks(parts.slice(1).join(' — '));
  return located.length > 0 ? located : 'unknown';
}

export function presentClaim(claim: Pick<Claim, 'claim' | 'wording_status'>): {
  kind: 'quote' | 'paraphrase';
  quote: string;
  aside: string;
  text: string;
} {
  if (isVerifiedWording(claim)) {
    const match = claim.claim.match(/^"([^"]*)"\s*([\s\S]*)$/);
    if (match && match[1].trim().length > 0) {
      const quote = match[1];
      const aside = stripQuoteMarks(match[2]);
      return { kind: 'quote', quote, aside, text: `\u201C${quote}\u201D` };
    }
    const quote = stripQuoteMarks(claim.claim);
    return { kind: 'quote', quote, aside: '', text: `\u201C${quote}\u201D` };
  }
  return { kind: 'paraphrase', quote: '', aside: '', text: stripQuoteMarks(claim.claim) };
}

export function viewClaim(claim: Claim): ClaimView {
  const presented = presentClaim(claim);
  return {
    kind: presented.kind,
    text: presented.text,
    aside: presented.aside,
    episode: episodeLabel(claim),
    provisional: isProvisional(claim),
  };
}
