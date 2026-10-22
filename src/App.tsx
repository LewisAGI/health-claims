import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { ClaimCard, PersonList } from './cards';
import { COPY } from './copy';
import { people, sourceById, topics } from './data';
import { filterClaims } from './filter';
import {
  BackIcon,
  ClearIcon,
  CorrectionsIcon,
  MethodIcon,
  RatingIcon,
  ReadingIcon,
  SearchIcon,
  TimelineIcon,
  TopicGlyph,
  TopicIcon,
} from './icons';
import { topicLabel, type PersonGroup } from './people';
import { Corrections, FurtherReading, Methodology, Timeline } from './pages';
import { RATING_SCALE } from './ratings';
import { hrefFor, readLocation, type LocationState, type Route } from './route';

type PopoutName = 'search' | 'topic' | 'rating';

export function App() {
  const [state, setState] = useState<LocationState>(() => readLocation(window.location.hash, topics));
  const [open, setOpen] = useState<PopoutName | null>(null);

  useEffect(() => {
    document.getElementById('root')?.setAttribute('data-ready', 'true');
  }, []);

  useEffect(() => {
    const sync = () => setState(readLocation(window.location.hash, topics));
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, []);

  const commit = useCallback((next: LocationState, mode: 'push' | 'replace') => {
    const hash = hrefFor(next.route, next.filters);
    if (window.location.hash !== hash) {
      const url = `${window.location.pathname}${window.location.search}${hash}`;
      if (mode === 'replace') window.history.replaceState(null, '', url);
      else window.history.pushState(null, '', url);
    }
    setState(next);
  }, []);

  useEffect(() => {
    const base = COPY.siteTitle;
    const route = state.route;
    if (route.name === 'person') {
      const person = people.find((item) => item.slug === route.slug);
      document.title = person ? `${person.name} · ${base}` : base;
    } else if (state.route.name === 'methodology') document.title = `${COPY.methodologyTitle} · ${base}`;
    else if (state.route.name === 'corrections') document.title = `${COPY.correctionsTitle} · ${base}`;
    else if (state.route.name === 'timeline') document.title = `${COPY.timelineTitle} · ${base}`;
    else if (state.route.name === 'reading') document.title = `${COPY.readingTitle} · ${base}`;
    else document.title = base;
  }, [state]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null);
    };
    const onDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest('.popout, .rail')) return;
      setOpen(null);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  useEffect(() => {
    if (open !== 'search') return;
    document.getElementById('search-input')?.focus();
  }, [open]);

  const { route, filters } = state;
  const visiblePeople: PersonGroup[] = people
    .map((person) => ({ ...person, claims: filterClaims(person.claims, filters, sourceById) }))
    .filter((person) => person.claims.length > 0);
  const activePerson = route.name === 'person' ? people.find((person) => person.slug === route.slug) : undefined;
  const visibleClaims = activePerson ? filterClaims(activePerson.claims, filters, sourceById) : [];

  const toggle = (name: PopoutName) => setOpen((current) => (current === name ? null : name));

  const listHref = hrefFor({ name: 'list' }, filters);

  return (
    <>
      {route.name === 'list' ? (
        <h1 className="wordmark">
          <a href={listHref}>{COPY.siteTitle}</a>
        </h1>
      ) : (
        <a className="wordmark" href={listHref}>
          {COPY.siteTitle}
        </a>
      )}
      <footer className="shell-notice">{COPY.notAdvice}</footer>
      <main className="stage">
        {route.name === 'list' ? <PersonList people={visiblePeople} filters={filters} /> : null}
        {route.name === 'person' && activePerson ? (
          <div className="claims">
            <h1 id="page-title" tabIndex={-1}>
              {activePerson.name}
            </h1>
            {visibleClaims.map((claim) => (
              <ClaimCard key={claim.id} claim={claim} />
            ))}
          </div>
        ) : null}
        {route.name === 'methodology' ? <Methodology /> : null}
        {route.name === 'corrections' ? <Corrections /> : null}
        {route.name === 'timeline' ? <Timeline /> : null}
        {route.name === 'reading' ? <FurtherReading /> : null}
      </main>
      <div className="pager">
        <IconLink tip="Timeline" route={{ name: 'timeline' }} filters={filters} current={route.name === 'timeline'}>
          <TimelineIcon />
        </IconLink>
        <IconLink tip="Further reading" route={{ name: 'reading' }} filters={filters} current={route.name === 'reading'}>
          <ReadingIcon />
        </IconLink>
        <IconLink tip="Methodology" route={{ name: 'methodology' }} filters={filters} current={route.name === 'methodology'}>
          <MethodIcon />
        </IconLink>
        <IconLink tip="Corrections" route={{ name: 'corrections' }} filters={filters} current={route.name === 'corrections'}>
          <CorrectionsIcon />
        </IconLink>
      </div>
      <div className="rail">
        {route.name !== 'list' ? (
          <a className="icon-button" href={listHref} data-tip="Back" aria-label="Back">
            <BackIcon />
          </a>
        ) : null}
        <div className="rail-item">
          <button
            type="button"
            className="icon-button"
            data-tip="Search"
            aria-label="Search"
            aria-pressed={filters.query.length > 0}
            aria-expanded={open === 'search'}
            onClick={() => toggle('search')}
          >
            <SearchIcon />
          </button>
          <form
            className="popout search-popout"
            hidden={open !== 'search'}
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              id="search-input"
              aria-label="Search"
              value={filters.query}
              onChange={(event) =>
                commit({ route, filters: { ...filters, query: event.target.value } }, 'replace')
              }
            />
            {filters.query ? (
              <button
                type="button"
                className="icon-button"
                data-tip="Clear search"
                aria-label="Clear search"
                onClick={() => commit({ route, filters: { ...filters, query: '' } }, 'replace')}
              >
                <ClearIcon />
              </button>
            ) : null}
          </form>
        </div>
        <div className="rail-item">
          <button
            type="button"
            className="icon-button"
            data-tip="Topic"
            aria-label="Topic"
            aria-pressed={filters.topic !== null}
            aria-expanded={open === 'topic'}
            onClick={() => toggle('topic')}
          >
            <TopicIcon />
          </button>
          <div className="popout topic-popout" hidden={open !== 'topic'}>
            {topics.map((topic) => (
              <button
                key={topic}
                type="button"
                className="icon-button"
                data-tip={topicLabel(topic)}
                aria-label={topicLabel(topic)}
                aria-pressed={filters.topic === topic}
                onClick={() => {
                  commit(
                    { route, filters: { ...filters, topic: filters.topic === topic ? null : topic } },
                    'push',
                  );
                  setOpen(null);
                }}
              >
                <TopicGlyph topic={topic} />
              </button>
            ))}
          </div>
        </div>
        <div className="rail-item">
          <button
            type="button"
            className="icon-button"
            data-tip="Rating"
            aria-label="Rating"
            aria-pressed={filters.rating !== null}
            aria-expanded={open === 'rating'}
            onClick={() => toggle('rating')}
          >
            <RatingIcon />
          </button>
          <div className="popout rating-popout" hidden={open !== 'rating'}>
            {RATING_SCALE.map((item) => (
              <button
                key={item.id}
                type="button"
                className="icon-button"
                data-tip={item.label}
                aria-label={item.label}
                aria-pressed={filters.rating === item.id}
                onClick={() => {
                  commit(
                    {
                      route,
                      filters: { ...filters, rating: filters.rating === item.id ? null : item.id },
                    },
                    'push',
                  );
                  setOpen(null);
                }}
              >
                <span className="swatch" data-rating={item.id} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function IconLink({
  tip,
  route,
  filters,
  current,
  children,
}: {
  tip: string;
  route: Route;
  filters: LocationState['filters'];
  current: boolean;
  children: ReactNode;
}) {
  return (
    <a
      className="icon-button"
      href={hrefFor(route, filters)}
      data-tip={tip}
      aria-label={tip}
      aria-current={current ? 'page' : undefined}
    >
      {children}
    </a>
  );
}
