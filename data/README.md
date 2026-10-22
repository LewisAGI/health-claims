# Data

`content.json` and `sources.json` are the v3 content pack (checked 2026-10-22). They replace earlier packs. Schemas: `content.schema.json`, `sources.schema.json`. The pack notes are in `pack-notes.md`.

## Claims

A claim has `id`, `person`, `topic`, `claim`, `wording_status`, `claim_sources`, `research`, `rating`, and `reasoning`.

`wording_status` is the verified-wording field. A value that starts with `verified quote` or `verified wording` may render as a direct quote. Every other value renders as a labelled paraphrase, with quotation marks removed.

The episode line uses the location after the em dash in `wording_status`. Where that location is missing, or the status is an attribution gap, the episode is `unknown`.

`rating` is one of:

- `supported` — the stated claim agrees with the listed research, including limits those sources state.
- `extrapolated beyond evidence` — the listed research reports a related result, and the claim extends past it.
- `unsupported` — the listed research does not report the claim, or it reports a result at odds with the claim.

A rating describes that claim. People are not rated. A rating is marked provisional only when the pack flags it. This pack does not.

`claim_sources` may be empty when no episode was located. `research` still cites the evidence used for the rating. A source `year` may be null when the pack has no publication year; the site does not invent one.

## Timeline and further reading

`timeline` is `{ date, event, sources[] }`, in chronological order. `date` is a year.

`further_reading` is `{ source, why }`. `source` is an id in `sources.json`. `why` is the pack's note for that source.
