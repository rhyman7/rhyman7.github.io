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
  Board | Parlays | Weekly Review, with Basketball as a side link on the right. Every page in this
  repo's hub, rhyman7/nfl, rhyman7/cfb and rhyman7/fb-value-board loads it as the first thing in
  `<body>` (`<script src="/site-bar.js"></script>`), so a change here reaches every page at once.
  It marks the current section from the page's path (`section()`), carries its own styles (fixed
  graphite colors, so it looks the same above the value boards' own theme), scrolls sideways on a
  phone and is hidden in print. If a section is added, renamed or moved, update `LINKS` and
  `section()`. The basketball pages don't load it.
- **Hub sections,** in this order: **Matchups and stats** (CFB Matchups, NFL Matchups, under the
  logos), **Value boards** (College Value Board, NFL Value Board; each card lists Best Bets (PDF),
  Model Leans, not bets (PDF) and the boards' seven sections after Manual) and **Tools and record**
  (Parlays with its tabs; Weekly Review with each league and its Season Patterns). College is always
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

## Testing a change

- Serve the repo root (`python -m http.server 8000`) and load `index.html` at desktop and
  phone widths with no page errors and no horizontal scroll.
- Check every link points at a page that exists in the dashboards' and the value boards' repos
  (their `main`).
- After changing `site-bar.js`, load one page from each section (hub, a dashboard, a value board,
  Parlays, the Weekly Review) at desktop and phone widths: the bar shows, the right link is marked
  and nothing scrolls sideways because of it.
