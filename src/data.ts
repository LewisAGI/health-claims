import contentJson from '../data/content.json';
import sourcesJson from '../data/sources.json';
import { groupPeople, topicsInOrder } from './people';
import type { ContentPack, Source } from './types';

export const content = contentJson as ContentPack;
export const sources = sourcesJson as Source[];

export const sourceById: ReadonlyMap<string, Source> = new Map(sources.map((source) => [source.id, source]));

export const people = groupPeople(content.claims);
export const topics = topicsInOrder(content.claims);
