import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from '../src/App';
import { COPY } from '../src/copy';
import { content } from '../src/data';
import { Methodology } from '../src/pages';
import { RATING_SCALE } from '../src/ratings';
import { episodeLabel, viewClaim } from '../src/wording';

const ROUTES = [
  '#/',
  '#/person/andrew-huberman',
  '#/methodology',
  '#/corrections',
  '#/timeline',
  '#/reading',
];

function renderApp(hash: string): string {
  vi.stubGlobal('window', {
    location: { hash, pathname: '/', search: '' },
    history: { pushState() {}, replaceState() {} },
    addEventListener() {},
    removeEventListener() {},
  });
  vi.stubGlobal('document', {
    title: '',
    getElementById: () => null,
    addEventListener() {},
    removeEventListener() {},
  });
  return renderToStaticMarkup(createElement(App));
}

function noticeIsInTheShell(html: string): boolean {
  const notice = html.indexOf('class="shell-notice"');
  const mainStart = html.indexOf('<main');
  const mainEnd = html.lastIndexOf('</main>');
  return notice !== -1 && mainStart !== -1 && mainEnd !== -1 && (notice < mainStart || notice > mainEnd);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('M1 not advice in the shell', () => {
  it('shows COPY.notAdvice on every route, including the list and claim cards', () => {
    for (const hash of ROUTES) {
      const html = renderApp(hash);
      expect(html, hash).toContain(`>${COPY.notAdvice}<`);
      expect(noticeIsInTheShell(html), hash).toBe(true);
      expect(html.split(COPY.notAdvice), hash).toHaveLength(2);
    }
    const list = renderApp('#/');
    expect(list).toContain('class="people"');
    expect(list).not.toContain('data-claim=');
    const cards = renderApp('#/person/andrew-huberman');
    expect(cards).toContain('data-claim="hc01"');
    expect(cards).toContain('data-claim="hc09"');
  });
});

describe('M2 rating labels only', () => {
  it('shows the pack rating_scale labels and no authored definitions', () => {
    expect(RATING_SCALE.map((item) => item.label)).toEqual(content.rating_scale);
    expect(RATING_SCALE.map((item) => item.id)).toEqual(content.rating_scale);
    for (const item of RATING_SCALE) {
      expect(Object.keys(item).sort()).toEqual(['id', 'label']);
    }
    const html = renderToStaticMarkup(createElement(Methodology));
    expect(html).not.toContain('scale-copy');
    expect(html).not.toMatch(/agrees with what the listed research|extends past that result|at odds with the claim/);
    for (const label of content.rating_scale) {
      expect(html).toContain(`>${label}<`);
    }
  });
});

describe('M3 episode when the wording was not found', () => {
  it('shows unknown for hc09, hc10, and hc13', () => {
    for (const id of ['hc09', 'hc10', 'hc13']) {
      const claim = content.claims.find((item) => item.id === id);
      expect(claim, id).toBeTruthy();
      expect(episodeLabel(claim!), id).toBe('unknown');
      expect(viewClaim(claim!).episode, id).toBe('unknown');
    }
  });
});

describe('methodology rules stay on that page and stay short', () => {
  it('renders the wording, gap, and provisional lines only on methodology', () => {
    expect(COPY.wordingRule.length).toBeLessThan(120);
    expect(COPY.gapRule.length).toBeLessThan(80);
    expect(COPY.provisionalRule.length).toBeLessThan(90);
    const methodology = renderApp('#/methodology');
    expect(methodology).toContain(COPY.wordingRule);
    expect(methodology).toContain(COPY.gapRule);
    expect(methodology).toContain(COPY.provisionalRule);
    const list = renderApp('#/');
    expect(list).not.toContain(COPY.wordingRule);
    expect(list).not.toContain(COPY.gapRule);
    expect(list).not.toContain(COPY.provisionalRule);
    const cards = renderApp('#/person/andrew-huberman');
    expect(cards).not.toContain(COPY.wordingRule);
    expect(cards).not.toContain(COPY.provisionalRule);
  });
});
