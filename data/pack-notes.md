# Health-claims content pack (v1, 2026-10-22)
## Schema
content.json: {pack, rating_scale, policy, claims[]}. Each claim has id, person, topic, claim, wording_status ("verified quote ..." or "paraphrase, unverified wording"), claim_sources[], research[] (facts {text, sources[], type}), rating, reasoning.
sources.json: same as the psychedelics pack.
## Counts
v2: 34 claims, 42 research facts, 55 sources. 6 claims have verified wording (hc01, hc02, hc04, hc07 spoken quotes with chapter timestamps; hc05 and hc14 written page text). 28 are paraphrases, 15 of them flagged ATTRIBUTION GAP. Ratings: 16 supported, 13 extrapolated beyond evidence, 5 unsupported. Every research fact is sourced (validated).
## Evidence, inference and uncertainty
- Paraphrases describe the general position attributed to the person. Episode and timestamp are NOT verified for these, and they must not be shown as quotes.
- Several guest claims (Panda, "various guests") cite only the Lex Fridman index. The specific episode is a GAP.
## Gaps
- Verify more exact quotes from transcripts (hubermanlab.com and foundmyfitness pages host transcripts).
- Rhonda Patrick claims are summarised from her topic pages, without episode timestamps.
- DOIs from known literature were not each re-opened. Run a link check before launch.

## Verification log (v2, 2026-10-22)
- All DOIs were checked via Crossref (title, author and year) and URLs fetched. Fixed: masters-2019 (the old DOI was a different metformin/aerobic paper) → 10.1111/acel.13039; magl-sleep (bad DOI) → 10.1186/s12906-021-03297-z; zone2 (bad DOI) → 2025 Sports Med review 10.1007/s40279-025-02261-y (abstract not retrieved; fact marked uncertain).
- 404s fixed: hl-light → the 'Using Light' episode transcript; hl-tongkat → the 'Optimize Testosterone & Estrogen' transcript.
- PubMed search links replaced or removed: nmn-review → SR/MA 10.1080/10408398.2024.2387324 (hc36 research rewritten to match its abstract). The ag1 and cgm-nondiab claims hc33 and hc35 were REMOVED because no specific review was found. The unused nasal-mouth source was removed.
- gil-cold (secondary transcript) was replaced by the primary Huberman Lab transcript. The hc02 quote was corrected to the exact primary wording. The earlier version had joined a different sentence, which the transcript doesn't contain as quoted.
- Upgraded to verified: hc04 (cold after hypertrophy training, 01:36:22), hc07 (evening blue blockers, 01:12:48; rating changed to extrapolated beyond evidence and claim reframed to the actual quote), hc05 (written episode-page protocol text), hc14 (FoundMyFitness sauna page text). hc01 now has its chapter time, 00:49:20.
- Not upgraded: hc08 alcohol ('no safe level'). The alcohol transcript was searched and that wording was not found, so it stays a paraphrase.
- Attribution gaps flagged: hc11, hc12, hc27 and hc28 had cited a testosterone-episode page that was unrelated, so their claim_sources are now empty. Guest claims citing generic index pages (Lex Fridman index, Attia podcast archive) are flagged. Lex Fridman transcripts were not searched in this pass.

## v3 changelog (2026-10-22)
Counts: 45 claims (34 → 45), 55 research facts, 11 timeline events, 9 further-reading items, 67 sources. Ratings: 21 supported, 17 extrapolated beyond evidence, 7 unsupported. Verified wording: 19 claims. ATTRIBUTION GAP: 14.
- New guests: David Sinclair, Robert Lustig and Anna Lembke, plus more Rhonda Patrick and Peter Attia claims.
- New verified-quote claims (hc37–hc47) are from Huberman Lab guest transcripts (Attia, Patrick, Sinclair, Lustig, Lembke) and Lex Fridman #435 (inline timestamps 00:38:38 and 01:15:41). Each quote was string-matched in the fetched transcript. Huberman Lab transcripts have no inline timestamps, so those claims cite the episode only.
- Upgraded to quotes: hc18 (Patrick on sulforaphane and Nrf2; rating changed to supported, with the reasoning scoped to the mechanism) and hc21 (Attia on apoB causality; attribution gap closed).
- hc20 research was rewritten from the Zone 2 review abstract, now verified via PubMed (Storoschuk et al. 2025).
- New research sources were Crossref-checked and abstract-read: Laukkanen 2016/17 (dementia), Fahey 1997, Strong 2013 (ITP), Ng 2012, Volkow 2001, Brown & Schuckit 1988. Baur 2006 was checked via PubMed.
- Added `timeline` and `further_reading` arrays.
- Lex Fridman: only 122 transcript pages exist, mostly for recent episodes. Searching the index found transcripts only for Huberman #393 and #435 among health guests. #393 had no health claims worth rating. Attia, Sinclair, Walker, Patrick and Johnson have no Lex transcripts.
- Joe Rogan: there are no official transcripts, so no Rogan claims were added. This is a GAP; third-party transcripts weren't used as verification.
- Lembke hc45: the referenced study is inferred to be Brown & Schuckit 1988.
- Sinclair hc40 is rated unsupported against published evidence. It may refer to unpublished data.
