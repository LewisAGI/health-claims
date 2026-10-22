export type Rating = 'supported' | 'extrapolated beyond evidence' | 'unsupported';

export type ResearchFact = {
  text: string;
  sources: string[];
  type: 'evidence' | 'uncertain';
};

export type Claim = {
  id: string;
  person: string;
  topic: string;
  claim: string;
  wording_status: string;
  claim_sources: string[];
  research: ResearchFact[];
  rating: Rating;
  reasoning: string;
};

export type TimelineEvent = {
  date: string;
  event: string;
  sources: string[];
};

export type FurtherReading = {
  source: string;
  why: string;
};

export type ContentPack = {
  pack: string;
  version: number;
  generated: string;
  verified: string;
  rating_scale: string[];
  policy: string;
  claims: Claim[];
  timeline: TimelineEvent[];
  further_reading: FurtherReading[];
};

export type Source = {
  id: string;
  title: string;
  authors: string;
  url: string;
  year: number | null;
  quality: string;
};
