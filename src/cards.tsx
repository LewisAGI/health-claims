import { sourceById } from './data';
import { COPY } from './copy';
import { hrefFor, type LocationState } from './route';
import { ratingLabel } from './ratings';
import type { Claim } from './types';
import { viewClaim } from './wording';
import type { PersonGroup } from './people';

export function Cite({ id }: { id: string }) {
  const source = sourceById.get(id);
  if (!source) return <p className="cite">{id}</p>;
  return (
    <p className="cite" data-source={id}>
      {source.year != null ? <time dateTime={String(source.year)}>{source.year}</time> : null}
      <a href={source.url} rel="noreferrer noopener" target="_blank">
        {source.title}
      </a>
      <span className="cite-meta">{source.authors}</span>
      <span className="cite-meta">{source.quality}</span>
    </p>
  );
}

export function ClaimCard({ claim }: { claim: Claim }) {
  const view = viewClaim(claim);
  return (
    <article
      className="card"
      data-claim={claim.id}
      data-wording={view.kind}
      data-rating={claim.rating}
      data-provisional={view.provisional ? 'true' : 'false'}
      data-episode={view.episode}
    >
      <p className="rating-line">
        <span className={view.provisional ? 'swatch is-provisional' : 'swatch'} data-rating={claim.rating} />
        <span className="rating-name">{ratingLabel(claim.rating)}</span>
        {view.provisional ? <span className="provisional">{COPY.provisionalLabel}</span> : null}
      </p>
      <p className="wording-label">{view.kind === 'quote' ? COPY.quoteLabel : COPY.paraphraseLabel}</p>
      <p className="claim-text">{view.text}</p>
      {view.aside ? <p className="claim-aside">{view.aside}</p> : null}
      <p className="episode">
        <span className="field-label">{COPY.episodeLabel}</span>
        <span className="episode-value">{view.episode}</span>
      </p>
      <p className="reasoning">{claim.reasoning}</p>
      {claim.claim_sources.length > 0 ? (
        <>
          <h2>{COPY.sourceHeading}</h2>
          {claim.claim_sources.map((id) => (
            <Cite key={id} id={id} />
          ))}
        </>
      ) : null}
      <h2>{COPY.researchHeading}</h2>
      {claim.research.map((item, index) => (
        <div className="research" key={`${claim.id}-research-${index}`}>
          {item.type === 'uncertain' ? <p className="field-label">{COPY.uncertainLabel}</p> : null}
          <p className="research-text">{item.text}</p>
          {item.sources.map((id, sourceIndex) => (
            <Cite key={`${id}-${sourceIndex}`} id={id} />
          ))}
        </div>
      ))}
      <p className="claim-id">{claim.id}</p>
    </article>
  );
}

export function PersonList({ people, filters }: { people: readonly PersonGroup[]; filters: LocationState['filters'] }) {
  return (
    <div className="people">
      {people.map((person) => (
        <a
          key={person.slug}
          className="person"
          data-person={person.slug}
          href={hrefFor({ name: 'person', slug: person.slug }, filters)}
        >
          {person.name}
        </a>
      ))}
    </div>
  );
}
