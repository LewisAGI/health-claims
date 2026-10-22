import { describe, expect, it } from 'vitest';
import bridge from '../bridge.json';
import contentSchema from '../data/content.schema.json';
import { content, people, sourceById, sources } from '../src/data';
import { COPY } from '../src/copy';
import { RATING_SCALE } from '../src/ratings';
import { personSlug } from '../src/people';

const claimSchema = contentSchema.$defs.claim as { properties: { rating: { enum: string[] } } };

describe('content pack', () => {
  it('is version 3 with the published counts', () => {
    expect(content.pack).toBe('health-claims');
    expect(content.version).toBe(3);
    expect(content.claims).toHaveLength(45);
    expect(sources).toHaveLength(67);
    expect(content.timeline).toHaveLength(11);
    expect(content.further_reading).toHaveLength(9);
    expect(content.claims.reduce((sum, claim) => sum + claim.research.length, 0)).toBe(55);
    expect(content.claims.map((claim) => claim.id)).not.toContain('hc33');
    expect(content.claims.map((claim) => claim.id)).not.toContain('hc35');
  });

  it('keeps ids unique and ratings inside the documented scale', () => {
    const ids = new Set<string>();
    const counts: Record<string, number> = {};
    for (const claim of content.claims) {
      expect(ids.has(claim.id), claim.id).toBe(false);
      ids.add(claim.id);
      expect(claim.id).toMatch(/^hc[0-9]{2}$/);
      expect(content.rating_scale).toContain(claim.rating);
      expect(claim.claim.length).toBeGreaterThan(0);
      expect(claim.person.length).toBeGreaterThan(0);
      expect(claim.reasoning.length).toBeGreaterThan(0);
      expect(claim.research.length).toBeGreaterThan(0);
      counts[claim.rating] = (counts[claim.rating] ?? 0) + 1;
      expect(claim).not.toHaveProperty('person_rating');
    }
    expect(counts).toEqual({
      supported: 21,
      'extrapolated beyond evidence': 17,
      unsupported: 7,
    });
    expect(claimSchema.properties.rating.enum).toEqual([...content.rating_scale]);
    expect(RATING_SCALE.map((item) => item.id)).toEqual(content.rating_scale);
  });

  it('resolves every citation, including the timeline and further reading', () => {
    const used = new Set<string>();
    const expectSource = (id: string) => {
      expect(sourceById.get(id), id).toBeTruthy();
      used.add(id);
    };
    for (const claim of content.claims) {
      for (const id of claim.claim_sources) expectSource(id);
      for (const fact of claim.research) {
        expect(fact.text.length).toBeGreaterThan(0);
        expect(fact.sources.length).toBeGreaterThan(0);
        expect(['evidence', 'uncertain']).toContain(fact.type);
        for (const id of fact.sources) expectSource(id);
      }
    }
    const years: string[] = [];
    for (const event of content.timeline) {
      expect(event.date).toMatch(/^[0-9]{4}$/);
      expect(event.event.length).toBeGreaterThan(0);
      expect(event.sources.length).toBeGreaterThan(0);
      years.push(event.date);
      for (const id of event.sources) expectSource(id);
    }
    expect([...years].sort()).toEqual(years);
    for (const item of content.further_reading) {
      expect(item.why.length).toBeGreaterThan(0);
      expectSource(item.source);
    }
    for (const source of sources) {
      expect(source.id).toMatch(/^[a-z0-9-]+$/);
      expect(source.title.length).toBeGreaterThan(0);
      expect(source.url).toMatch(/^https?:\/\//);
      if (source.year != null) {
        expect(source.year).toBeGreaterThanOrEqual(1900);
        expect(source.year).toBeLessThanOrEqual(2100);
      }
    }
    expect(used.size).toBe(sources.length);
  });

  it('does not rate people', () => {
    const slugs = new Set<string>();
    for (const person of people) {
      expect(slugs.has(person.slug), person.name).toBe(false);
      slugs.add(person.slug);
      expect(person.slug).toBe(personSlug(person.name));
      expect(person).not.toHaveProperty('rating');
      expect(person.claims.length).toBeGreaterThan(0);
    }
  });

  it('keeps our own wording neutral', () => {
    const banned = /liar|fraud|quack|scam|grifter|charlatan|dishonest|incompetent|snake oil/i;
    const ours = [...Object.values(COPY), ...RATING_SCALE.flatMap((item) => [item.label, item.definition])].join('\n');
    expect(ours).not.toMatch(banned);
  });

  it('names the Pages project the HOHM bridge publishes', () => {
    expect(bridge.bridge).toBe('hohm');
    expect(bridge.cloudflarePagesProject).toBe('health-claims');
    expect(bridge.install).toBe('npm ci');
    expect(bridge.build).toBe('npm run build');
    expect(bridge.output).toBe('dist');
  });
});
