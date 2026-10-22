import type { Claim } from './types';

export type PersonGroup = {
  name: string;
  slug: string;
  claims: Claim[];
};

export function personSlug(person: string): string {
  return person
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function topicLabel(topic: string): string {
  return topic.charAt(0).toUpperCase() + topic.slice(1);
}

export function topicsInOrder(claims: readonly Claim[]): string[] {
  const seen = new Set<string>();
  const topics: string[] = [];
  for (const claim of claims) {
    if (seen.has(claim.topic)) continue;
    seen.add(claim.topic);
    topics.push(claim.topic);
  }
  return topics;
}

/** People stay in pack order. A person has no rating. */
export function groupPeople(claims: readonly Claim[]): PersonGroup[] {
  const order: string[] = [];
  const grouped = new Map<string, Claim[]>();
  for (const claim of claims) {
    const existing = grouped.get(claim.person);
    if (existing) existing.push(claim);
    else {
      grouped.set(claim.person, [claim]);
      order.push(claim.person);
    }
  }
  return order.map((name) => ({
    name,
    slug: personSlug(name),
    claims: grouped.get(name) ?? [],
  }));
}
