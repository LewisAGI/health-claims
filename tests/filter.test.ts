import { describe, expect, it } from 'vitest';
import { content, sourceById } from '../src/data';
import { filterClaims } from '../src/filter';
import { groupPeople } from '../src/people';
import { hrefFor, parseHash, readLocation, sanitizeFilters } from '../src/route';

const topics = [...new Set(content.claims.map((claim) => claim.topic))];

describe('filters', () => {
  it('filters by topic, rating, and search without scoring a person', () => {
    const caffeine = filterClaims(content.claims, { query: '', topic: 'caffeine', rating: null }, sourceById);
    expect(caffeine.map((claim) => claim.id)).toEqual(['hc01', 'hc46']);
    const unsupportedCaffeine = filterClaims(
      content.claims,
      { query: '', topic: 'caffeine', rating: 'unsupported' },
      sourceById,
    );
    expect(unsupportedCaffeine.map((claim) => claim.id)).toEqual(['hc01', 'hc46']);
    const panda = filterClaims(content.claims, { query: 'Panda', topic: null, rating: null }, sourceById);
    expect(panda.map((claim) => claim.person)).toEqual(['Satchin Panda (frequent guest)']);
    const sinclair = filterClaims(content.claims, { query: 'resveratrol', topic: null, rating: null }, sourceById);
    expect(sinclair.map((claim) => claim.id)).toContain('hc40');
    const people = groupPeople(unsupportedCaffeine);
    expect(people.map((person) => person.name)).toEqual(['Andrew Huberman']);
    expect(people[0]).not.toHaveProperty('rating');
  });
});

describe('routes', () => {
  it('reads timeline, reading, and filters from the hash', () => {
    expect(parseHash('#/timeline').route).toEqual({ name: 'timeline' });
    expect(parseHash('#/reading').route).toEqual({ name: 'reading' });
    const parsed = parseHash('#/person/david-sinclair-frequent-guest?topic=resveratrol&rating=unsupported&q=mice');
    expect(parsed.route).toEqual({ name: 'person', slug: 'david-sinclair-frequent-guest' });
    expect(sanitizeFilters(parsed.filters, topics)).toEqual({
      query: 'mice',
      topic: 'resveratrol',
      rating: 'unsupported',
    });
    expect(sanitizeFilters({ query: '', topic: 'nope', rating: 'nope' }, topics)).toEqual({
      query: '',
      topic: null,
      rating: null,
    });
    const filters = { query: 'mice', topic: 'resveratrol', rating: 'unsupported' as const };
    const href = hrefFor({ name: 'reading' }, filters);
    expect(readLocation(href, topics)).toEqual({ route: { name: 'reading' }, filters });
  });
});
