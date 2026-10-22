import { describe, expect, it } from 'vitest';
import { content } from '../src/data';
import { episodeLabel, isVerifiedWording, stripQuoteMarks, viewClaim } from '../src/wording';

const QUOTE_IDS = [
  'hc01',
  'hc02',
  'hc04',
  'hc05',
  'hc07',
  'hc14',
  'hc18',
  'hc21',
  'hc37',
  'hc38',
  'hc39',
  'hc40',
  'hc41',
  'hc42',
  'hc43',
  'hc44',
  'hc45',
  'hc46',
  'hc47',
];

describe('verified wording', () => {
  it('quotes only claims the pack marks as verified', () => {
    const quoted = content.claims.filter((claim) => viewClaim(claim).kind === 'quote').map((claim) => claim.id);
    const flagged = content.claims.filter((claim) => isVerifiedWording(claim)).map((claim) => claim.id);
    expect(quoted).toEqual(flagged);
    expect(quoted).toEqual(QUOTE_IDS);
    expect(quoted).toHaveLength(19);
  });

  it('renders verified claims in quotation marks and paraphrases without them', () => {
    for (const claim of content.claims) {
      const view = viewClaim(claim);
      if (view.kind === 'quote') {
        expect(view.text.startsWith('\u201C'), claim.id).toBe(true);
        expect(view.text.endsWith('\u201D'), claim.id).toBe(true);
        expect(view.text.slice(1, -1)).not.toMatch(/["“”«»„‟]/);
      } else {
        expect(view.text, claim.id).not.toMatch(/["“”«»„‟‘’]/);
        expect(view.text, claim.id).not.toMatch(/(^|\s)'|'(\s|$)/);
        expect(view.text.length, claim.id).toBeGreaterThan(0);
      }
    }
    const hc26 = content.claims.find((claim) => claim.id === 'hc26');
    expect(viewClaim(hc26!).text).toBe(
      'Why We Sleep claims (e.g. sleep loss epidemic statements) are fully accurate.',
    );
    expect(stripQuoteMarks("don't")).toBe("don't");
  });

  it('keeps the checked quote for the caffeine delay and the Lex timestamp', () => {
    const hc01 = content.claims.find((claim) => claim.id === 'hc01')!;
    expect(viewClaim(hc01).text).toBe(
      '\u201CI\'ll sort of delay caffeine by a little while, usually 90 minutes to two hours.\u201D',
    );
    expect(viewClaim(hc01).episode).toContain('00:49:20');
    const hc46 = content.claims.find((claim) => claim.id === 'hc46')!;
    expect(viewClaim(hc46).kind).toBe('quote');
    expect(viewClaim(hc46).episode).toContain('00:38:38');
    expect(viewClaim(hc46).text).toContain('delay their caffeine');
  });
});

describe('episode', () => {
  it('shows unknown wherever no episode was found', () => {
    const unknown = content.claims.filter((claim) => viewClaim(claim).episode === 'unknown').map((claim) => claim.id);
    expect(unknown).toEqual([
      'hc03',
      'hc06',
      'hc08',
      'hc09',
      'hc10',
      'hc11',
      'hc12',
      'hc13',
      'hc15',
      'hc16',
      'hc17',
      'hc19',
      'hc20',
      'hc22',
      'hc23',
      'hc24',
      'hc25',
      'hc26',
      'hc27',
      'hc28',
      'hc29',
      'hc30',
      'hc31',
      'hc32',
      'hc34',
      'hc36',
    ]);
    for (const claim of content.claims) {
      const episode = viewClaim(claim).episode;
      expect(episode.length, claim.id).toBeGreaterThan(0);
      expect(episode, claim.id).not.toMatch(/["“”‘’]/);
      if (episode !== 'unknown') expect(episode).not.toMatch(/(^|\s)'|'(\s|$)/);
    }
  });

  it('shows unknown when the pack says the exact wording was not found', () => {
    for (const id of ['hc09', 'hc10', 'hc13']) {
      const claim = content.claims.find((item) => item.id === id);
      expect(claim, id).toBeTruthy();
      expect(claim!.wording_status).toMatch(/exact claim wording not (?:found|verified)/i);
      expect(episodeLabel(claim!), id).toBe('unknown');
      expect(viewClaim(claim!).episode, id).toBe('unknown');
    }
  });
});

describe('provisional ratings', () => {
  it('marks a rating provisional only when the pack flags it', () => {
    expect(content.claims.filter((claim) => viewClaim(claim).provisional)).toEqual([]);
    const hc36 = content.claims.find((claim) => claim.id === 'hc36')!;
    expect(viewClaim(hc36).provisional).toBe(false);
    expect(viewClaim(hc36).kind).toBe('paraphrase');
    expect(
      viewClaim({ ...hc36, reasoning: 'Rating provisional pending a specific review.' }).provisional,
    ).toBe(true);
  });
});
