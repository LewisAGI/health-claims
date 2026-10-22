import { isRating, type Rating } from './ratings';

export type Route =
  | { name: 'list' }
  | { name: 'person'; slug: string }
  | { name: 'methodology' }
  | { name: 'corrections' }
  | { name: 'timeline' }
  | { name: 'reading' };

export type ParsedFilters = {
  query: string;
  topic: string | null;
  rating: string | null;
};

export type LocationState = {
  route: Route;
  filters: {
    query: string;
    topic: string | null;
    rating: Rating | null;
  };
};

export function parseHash(hash: string): { route: Route; filters: ParsedFilters } {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  const splitAt = raw.indexOf('?');
  const path = splitAt === -1 ? raw : raw.slice(0, splitAt);
  const search = splitAt === -1 ? '' : raw.slice(splitAt + 1);
  const params = new URLSearchParams(search);
  const topic = params.get('topic');
  const rating = params.get('rating');
  const parts = path.split('/').filter(Boolean).map((part) => decodeURIComponent(part));
  let route: Route = { name: 'list' };
  if (parts[0] === 'methodology') route = { name: 'methodology' };
  else if (parts[0] === 'corrections') route = { name: 'corrections' };
  else if (parts[0] === 'timeline') route = { name: 'timeline' };
  else if (parts[0] === 'reading') route = { name: 'reading' };
  else if (parts[0] === 'person' && parts[1]) route = { name: 'person', slug: parts[1] };
  return {
    route,
    filters: {
      query: params.get('q') ?? '',
      topic: topic && topic.length > 0 ? topic : null,
      rating: rating && rating.length > 0 ? rating : null,
    },
  };
}

export function sanitizeFilters(
  filters: ParsedFilters,
  topics: readonly string[],
): LocationState['filters'] {
  return {
    query: filters.query,
    topic: filters.topic && topics.includes(filters.topic) ? filters.topic : null,
    rating: filters.rating && isRating(filters.rating) ? filters.rating : null,
  };
}

export function hrefFor(route: Route, filters: LocationState['filters']): string {
  const params = new URLSearchParams();
  if (filters.query) params.set('q', filters.query);
  if (filters.topic) params.set('topic', filters.topic);
  if (filters.rating) params.set('rating', filters.rating);
  const query = params.toString();
  let path = '/';
  if (route.name === 'person') path = `/person/${encodeURIComponent(route.slug)}`;
  else if (route.name === 'methodology') path = '/methodology';
  else if (route.name === 'corrections') path = '/corrections';
  else if (route.name === 'timeline') path = '/timeline';
  else if (route.name === 'reading') path = '/reading';
  return `#${path}${query ? `?${query}` : ''}`;
}

export function readLocation(hash: string, topics: readonly string[]): LocationState {
  const parsed = parseHash(hash);
  return { route: parsed.route, filters: sanitizeFilters(parsed.filters, topics) };
}
