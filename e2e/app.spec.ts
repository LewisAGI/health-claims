import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.locator('#root[data-ready="true"]').waitFor();
});

test('lists people and does not rate them', async ({ page }) => {
  const huberman = page.getByRole('link', { name: 'Andrew Huberman', exact: true });
  await expect(huberman).toBeVisible();
  await expect(huberman).not.toContainText(/supported|unsupported|extrapolated/i);
  await expect(page.getByRole('link', { name: 'David Sinclair (frequent guest)' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Anna Lembke (frequent guest)' })).toBeVisible();
  await expect(page.locator('.stage')).not.toContainText(/click|tap the|try a filter/i);
});

test('filters from icon pop-outs', async ({ page }) => {
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('Sinclair');
  await expect(page.getByRole('link', { name: 'David Sinclair (frequent guest)' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Rhonda Patrick', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Clear search' }).click();
  await page.getByRole('button', { name: 'Topic' }).click();
  await page.getByRole('button', { name: 'Caffeine' }).click();
  await expect(page.getByRole('link', { name: 'Andrew Huberman', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Rhonda Patrick', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Rating' }).click();
  await page.getByRole('button', { name: 'Unsupported' }).click();
  await expect(page.getByRole('link', { name: 'Andrew Huberman', exact: true })).toBeVisible();
});

test('quotes verified wording and labels every other claim as a paraphrase', async ({ page }) => {
  await page.getByRole('link', { name: 'Andrew Huberman', exact: true }).click();
  const quote = page.locator('[data-claim="hc01"]');
  await expect(quote).toHaveAttribute('data-wording', 'quote');
  await expect(quote.locator('.wording-label')).toHaveText('Quote');
  await expect(quote.locator('.claim-text')).toHaveText(
    '“I\'ll sort of delay caffeine by a little while, usually 90 minutes to two hours.”',
  );
  await expect(quote.locator('.episode-value')).toContainText('00:49:20');
  await expect(quote.locator('[data-source="hl-walker"] time')).toHaveText('2024');

  const paraphrase = page.locator('[data-claim="hc03"]');
  await expect(paraphrase).toHaveAttribute('data-wording', 'paraphrase');
  await expect(paraphrase.locator('.wording-label')).toHaveText('Paraphrase');
  await expect(paraphrase.locator('.claim-text')).toHaveText('Cold-induced dopamine increase is comparable to cocaine.');
  await expect(paraphrase.locator('.claim-text')).not.toContainText(/["“”‘’]/);
  await expect(paraphrase.locator('.episode-value')).toHaveText('unknown');

  const gap = page.locator('[data-claim="hc11"]');
  await expect(gap.locator('.episode-value')).toHaveText('unknown');
  await expect(gap.locator('h2', { hasText: 'Source' })).toHaveCount(0);

  await page.goto('/#/person/various-guests');
  const hc36 = page.locator('[data-claim="hc36"]');
  await expect(hc36).toHaveAttribute('data-wording', 'paraphrase');
  await expect(hc36).toHaveAttribute('data-provisional', 'false');
  await expect(hc36.locator('.episode-value')).toHaveText('unknown');
  await expect(hc36.locator('.provisional')).toHaveCount(0);
});

test('opens the timeline and further reading', async ({ page }) => {
  await page.getByRole('link', { name: 'Timeline' }).click();
  await expect(page.getByRole('heading', { name: 'Timeline' })).toBeVisible();
  await expect(page.locator('.timeline time').first()).toHaveText('2000');
  await expect(page.locator('.timeline time').last()).toHaveText('2025');
  await expect(page.getByText('Šrámek et al. cold-immersion study')).toBeVisible();

  await page.getByRole('link', { name: 'Further reading' }).click();
  await expect(page.getByRole('heading', { name: 'Further reading' })).toBeVisible();
  await expect(page.getByText('Primary sauna cohort')).toBeVisible();
  await expect(page.locator('.reading a').first()).toHaveAttribute('href', /^https?:\/\//);
});

test('methodology and corrections stay claim-level', async ({ page }) => {
  await page.getByRole('link', { name: 'Methodology' }).click();
  await expect(page.getByRole('heading', { name: 'Methodology' })).toBeVisible();
  await expect(page.getByText('Supported', { exact: true })).toBeVisible();
  await expect(page.getByText('Extrapolated beyond evidence')).toBeVisible();
  await expect(page.getByText('Unsupported', { exact: true })).toBeVisible();
  await expect(page.getByText(/shown as unknown/)).toBeVisible();
  await expect(page.getByText(/not a rating of a person/)).toBeVisible();

  await page.getByRole('link', { name: 'Corrections' }).click();
  await expect(page.getByRole('link', { name: 'LewisAGI/health-claims issues' })).toHaveAttribute(
    'href',
    'https://github.com/LewisAGI/health-claims/issues',
  );
});

test('icon controls have no visible text', async ({ page }) => {
  const buttons = page.locator('.icon-button');
  const count = await buttons.count();
  expect(count).toBeGreaterThan(4);
  for (let index = 0; index < count; index += 1) {
    await expect(buttons.nth(index)).toHaveText('');
  }
});

test('a fine pointer shows the hover label', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'hover labels are for fine pointers');
  const search = page.getByRole('button', { name: 'Search' });
  await search.hover();
  const content = await search.evaluate((element) => getComputedStyle(element, '::after').content);
  expect(content).toContain('Search');
});

test('a long press shows the label', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'desktop', 'long-press labels are for coarse pointers');
  const search = page.getByRole('button', { name: 'Search' });
  await search.dispatchEvent('pointerdown', { pointerType: 'touch', bubbles: true });
  await page.waitForTimeout(700);
  await expect(search).toHaveClass(/is-long-tip/);
  const content = await search.evaluate((element) => getComputedStyle(element, '::after').content);
  expect(content).toContain('Search');
});
