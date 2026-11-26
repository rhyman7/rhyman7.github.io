# Conventions: Weekly Gridiron Board

Read this before changing anything in this repo, and update it in the same pull request
whenever a convention changes.

- Live site: https://rhyman7.github.io/ (GitHub Pages, branch `main`, repo root): the hub page
  `index.html`, the site bar `site-bar.js`, and the logos in `img/`.
- It's the hub for all of Ryan's football pages (one site, Ryan's call Nov 20, 2026): the matchup
  dashboards and the value boards, Parlays and Weekly Review in
  [rhyman7/fb-value-board](https://github.com/rhyman7/fb-value-board). The dashboards have their own repos and
  CONVENTIONS.md: [rhyman7/nfl](https://github.com/rhyman7/nfl) (served at `/nfl/`),
  [rhyman7/cfb](https://github.com/rhyman7/cfb) (served at `/cfb/`) and
  [rhyman7/nba](https://github.com/rhyman7/nba) (served at `/nba/`).

## How changes get made

- **Pull requests, merged after checks.** Don't push hand edits straight to `main`: `main`
  is the live site. Open a pull request (one topic per PR), run the checks in "Testing a
  change", and merge it yourself once they pass (squash, delete the branch). Then tell Ryan in
  a line or two what went live, with the PR link. If a check fails, don't merge: fix it, or
  leave the PR open and tell Ryan why.
- **Branches.** The repo deletes a pull request's branch when it merges (Settings, Nov 3,
  2026). For leftovers, run the **Delete merged branches** Action (`delete-merged-branches.yml`)
  by hand: dry run first (the default), then untick it. It only deletes branches with nothing
  that isn't on `main`, never one with an open pull request.
- **After merging**, confirm the Pages deploy for the merge commit succeeded and load the
  live page. If something broke, revert right away (a revert PR, merged the same way) and
  tell Ryan.
- **Ask first** if anything is unclear or a change could break the live site.
- **Out of scope here:** prediction and betting-model work belongs in the separate CFB/NFL
  Model project.

## Page

- **Stay styled like the dashboards:** the same graphite palette (CSS custom properties on
  `:root`), Archivo from Google Fonts, and the dashboards' page names. If the dashboards'
  look or page names change, update this page in the same change.
- **Site bar (`site-bar.js`).** One script that writes the strip across the top of every football
  page: Weekly Gridiron Board (home) | CFB Matchups | NFL Matchups | College Value Board | NFL Value
  Board | Parlays | Weekly Review | Recommended (added Nov 20, 2026), with Basketball as a side link on the right. Every page in this
  repo's hub, rhyman7/nfl, rhyman7/cfb and rhyman7/fb-value-board loads it as the first thing in
  `<body>` (`<script src="/site-bar.js"></script>`), so a change here reaches every page at once.
  It marks the current section from the page's path (`section()`), carries its own styles (fixed
  graphite colors, so it looks the same above the value boards' own theme), scrolls sideways on a
  phone and is hidden in print. If a section is added, renamed or moved, update `LINKS` and
  `section()`. The basketball pages, Prop Ladder and the value boards' manual load the one-site bar below (Nov 26, 2026).
- **The one-site bar (Nov 25, 2026).** `site-bar.js` now holds two bars. A page that loads it as
  `<script src="/site-bar.js" data-shell="2"></script>` gets the new one; a page without the
  attribute keeps the one-row bar above until its site is moved over. The new bar has two rows on
  a wide screen: the sections, the same on every page (**Matchups, Value Boards, Tools, Record,
  Help**, with Basketball on the right), then the pages of the section you are in, with a
  College / NFL switch on Matchups and Value Boards. At 760px and under both rows fold into one
  menu button. `SECTIONS` in the script is the whole site map: a page added, renamed or moved is
  changed there and nowhere else. Value Boards' pages are the boards' own `#` views. The hub,
  Start here and the status page use the new bar; the other sites move one at a time, each
  removing its own menu in the same change (plan: Project doc
  `claude/plan-one-site-redesign-2026-11-25.md`). It remembers the last league visited
  (`localStorage` `wgb-league`) so Matchups and Value Boards open on it.
- **Installable app (Nov 26, 2026).** The whole site installs to a phone's home screen as one app,
  "Gridiron". `manifest.webmanifest` (scope `/`, opens the hub, no browser chrome) and the icons
  `favicon-192.png`, `icon-512.png` and `icon-maskable-512.png` live in the repo root. The two 512px
  icons are rendered from `img/rh-monogram.svg`, an outline traced from the 192px art (Nov 26, 2026), so
  they are sharp at full size; redraw them from that file, not by enlarging a PNG. `site-bar.js`
  adds the manifest link and the phone app tags to every page that loads it, so a new page needs
  nothing extra; the hub also carries them in its own `<head>`. Opened from the home screen
  (`IN_APP`), both bars add a Back arrow on the left and a Reload button on the right, because the
  app has no browser buttons; in a normal browser neither shows. A page that doesn't load
  `site-bar.js` has no Back arrow in the app, so every page on the site must load it. There is no
  service worker and no offline copy: pages always load fresh (plan: Project doc
  `claude/plan-installable-app-2026-11-26.md`). The bar marks Basketball as the current section on
  `/basketball/`, `/nba/`, `/cbb/` and `/bb-value-board/`, and `glossary.js` skips those pages.
- **Hub sections,** in this order: **Matchups and stats** (CFB Matchups, NFL Matchups, under the
  logos), **Value boards** (College Value Board, NFL Value Board; each card lists Best Bets (PDF),
  Model Leans, not bets (PDF) and the boards' seven sections after Manual) and **Tools and record**
  (Parlays with its tabs; Weekly Review with each league and its Season Patterns; Recommended, the value boards' record of picks under fixed rules, `/fb-value-board/docs/recommended/`). College is always
  on the left. If a board section, Parlays tab or Review route is added, renamed or removed, update
  its card. The page keeps the betting disclaimer above the footer.
- Two landing pages: football at `/` (college then NFL) and basketball at `/basketball/`
  (college then NBA, with `img/ncaa-basketball.png` and `img/nba.png` above the cards at the football logos' size). Each links to the other once, below its cards.
  Each card links to its dashboard's home (`/cfb/index.html`, `/nfl/index.html`,
  `/nba/index.html`, `/cbb/index.html`) and to each of its pages, using the same page names as
  the dashboards' nav. If a dashboard page is added, renamed or removed, update its card.
- Links are root-relative (`/nfl/…`, `/cfb/…`, `img/…`).
- Logos: `img/ncaa.png` and `img/nfl.png`. The value boards' landing page uses copies of
  these, so keep the file names.
- Keep the footer credit for weather data (Open-Meteo).
- **Favicon:** the RH monogram, as `favicon.ico`, `favicon-192.png` and `apple-touch-icon.png` at the repo root (the same three files in rhyman7/nfl, rhyman7/cfb, rhyman7.github.io and rhyman7/fb-value-board). Every page links all three in `<head>`, right after the viewport meta; a new page gets the same three lines.

## Start here (`start/index.html`, added Nov 25, 2026)

- `/start/` is the page for someone new: a "Where to go" list of the sections, and a glossary of
  the terms the whole site uses (Typical, rung, closing line value, EPA and so on), grouped by
  where they appear, with a find box. The hub links to it under its heading. It is not in the
  site bar.
- **Each term says what it means on this site**, in one or two plain sentences, with a number
  where a number helps. Every term has an id from its name (`/start/#typical`), so other pages can
  link straight to it.
- **Keep it in step:** when a page starts using a new term or changes what one means (a new tier,
  a renamed section, a new stat), add or fix the entry in the same change. When a section is
  added, renamed or removed, update "Where to go" with the hub cards. The fuller explanations stay
  where they are (EPA Explained, Ratings Explained, How to Read Matchups, the value boards'
  manual); this page defines and points.

## Glossary hints (`glossary.js`, added Nov 25, 2026)

- `site-bar.js` loads `glossary.js` on every football page. Where one of about 35 site terms
  (Typical, CLV, No-vig, Rung, EPA / play, SRS, ATS and so on) appears in a heading, a column
  header or a label, it gets a dotted underline; hovering, focusing or tapping it shows the
  term's definition and a link to `/start/`. **The definitions are read from `/start/`**, so
  that page is the only place a definition is written.
- **It marks, it never links, and it stops no click**, so click-to-sort headers keep working.
  It leaves links, buttons, form controls and table cells alone (apart from a heading inside a
  cell, such as a player's detail card), marks each term at most eight
  times a page, and does nothing on `/start/` and `/status/`. Pages that don't load the site bar
  (Prop Ladder, the manual, basketball) don't get it.
- **To add a term:** add its entry to `/start/` first, then a line to `TERMS` in `glossary.js`
  with that entry's id. Keep everyday words (Total, Spread, Edge, Unit) out: they would be
  underlined everywhere. A pattern for a whole label starts with `^`.
- **A page can mark a spot itself:** `<span data-glossary="typical">typical</span>` is marked
  wherever it sits, whatever its wording or case (the value boards' Players note does this for
  "typical" and "floor"). The value is the entry's id on `/start/`.
- **To switch it off everywhere:** set `GLOSSARY = false` in `site-bar.js`.
- **After changing it,** load one page from each section (a dashboard matchup page, the EPA page,
  both value boards' Games and Model record views, Recommended) and check: terms are underlined,
  a hint opens and closes, a sortable header still sorts, and there are no page errors.

## Status page (`status/index.html`, added Nov 25, 2026)

- `/status/` answers one question: is every page running on current data? It is for Ryan, so it
  is **not linked** from the hub or the site bar and carries `noindex`. It is still a public
  address (GitHub Pages has no private pages), so it shows only what the site already publishes:
  build times, week numbers and counts. Never put keys, licensed (PFF) data or bets on it.
- It keeps nothing: on each load the browser reads the small files each site publishes
  (dashboards' `data.json`, `epa.json`, `injuries.json`, college `availability.json` and
  `overrides/qb_starters.json`; the value boards' `docs/feed/*.json`, `docs/moves.json`,
  `docs/recommended/*.js`, `review/data/*/index.json`; Prop Ladder's `results.json`) and the
  latest run of each GitHub Action from GitHub's public API (five requests a load, 60 an hour
  allowed without signing in). It never loads the value boards' own multi-megabyte `data.json`.
- Each row is green, amber or red from rules in the page's `build()`: a file's age against how
  often its job runs, and week numbers that must agree (the board feed's `week` against the
  dashboard's, the EPA file's against the stats, the quarterback list's against the stats). The
  Claude scheduled tasks can't be read from a web page, so each shows through the file it writes.
- **Keep it in step:** if a data file, a field it reads (`generatedAt`, `week`, `throughWeek`,
  `currentWeek`, `generated`, `built`, `lines_as_of`, `fetched`, `checked`, `updatedAt`) or a job's
  schedule changes in any of the repos, update the row here in the same change. A new job that
  writes a file the pages depend on gets a row.

## Testing a change

- **Smoke test (added Nov 25, 2026).** `python scripts/smoke.py` loads the pages listed in
  `smoke.json` in headless Chromium, from this checkout, and fails on a script error, a missing
  script or stylesheet, a table with too few rows, or "undefined"/"NaN" showing on a page. The
  **Smoke test** Action (`smoke.yml`) runs it on every pull request and on `main` when a merge
  changes page code; data-only commits don't start it. A red run on a pull request means don't
  merge. If a page is added, renamed or removed, or an element it checks is renamed, update
  `smoke.json` in the same change. The counts are set for the season; out of season, lower any
  that an empty schedule would trip. `scripts/smoke.py` is the same file in rhyman7/nfl,
  rhyman7/cfb, rhyman7/fb-value-board and rhyman7.github.io: change it in all four.
- Serve the repo root (`python -m http.server 8000`) and load `index.html` at desktop and
  phone widths with no page errors and no horizontal scroll.
- Check every link points at a page that exists in the dashboards' and the value boards' repos
  (their `main`).
- After changing `status/index.html`, load it on the live data: every row fills in, no row says
  "undefined", and no page errors. Then make one file look wrong (old or a different week) and
  confirm its row turns red.
- After changing `site-bar.js`, load one page from each section (hub, a dashboard, a value board,
  Parlays, the Weekly Review) at desktop and phone widths: the bar shows, the right link is marked
  and nothing scrolls sideways because of it.
