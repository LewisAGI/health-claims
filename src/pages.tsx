import { Cite } from './cards';
import { content } from './data';
import { COPY } from './copy';
import { RATING_SCALE } from './ratings';

export function Methodology() {
  return (
    <article className="page">
      <h1 id="page-title" tabIndex={-1}>
        {COPY.methodologyTitle}
      </h1>
      <p>{content.policy}</p>
      <p>{COPY.notPeople}</p>
      <ul className="scale">
        {RATING_SCALE.map((item) => (
          <li key={item.id}>
            <span className="swatch" data-rating={item.id} />
            <span className="rating-name">{item.label}</span>
          </li>
        ))}
      </ul>
      <p>{COPY.provisionalRule}</p>
      <p>{COPY.wordingRule}</p>
      <p>{COPY.gapRule}</p>
      <p className="checked">
        Pack {content.version}, checked {content.verified}.
      </p>
    </article>
  );
}

export function Timeline() {
  return (
    <article className="page">
      <h1 id="page-title" tabIndex={-1}>
        {COPY.timelineTitle}
      </h1>
      <ol className="timeline">
        {content.timeline.map((item) => (
          <li key={`${item.date}-${item.event}`}>
            <time dateTime={item.date}>{item.date}</time>
            <p>{item.event}</p>
            {item.sources.map((id, index) => (
              <Cite key={`${id}-${index}`} id={id} />
            ))}
          </li>
        ))}
      </ol>
    </article>
  );
}

export function FurtherReading() {
  return (
    <article className="page">
      <h1 id="page-title" tabIndex={-1}>
        {COPY.readingTitle}
      </h1>
      <ul className="reading">
        {content.further_reading.map((item) => (
          <li key={item.source}>
            <p>{item.why}</p>
            <Cite id={item.source} />
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Corrections() {
  return (
    <article className="page">
      <h1 id="page-title" tabIndex={-1}>
        {COPY.correctionsTitle}
      </h1>
      <p>{COPY.notPeople}</p>
      <p>{COPY.correctionsLead}</p>
      <p>
        <a href={COPY.correctionsUrl} rel="noreferrer noopener" target="_blank">
          {COPY.correctionsContact}
        </a>
      </p>
      <p>{COPY.correctionsHow}</p>
    </article>
  );
}
