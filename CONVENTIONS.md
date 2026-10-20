# Conventions: Weekly Gridiron Board

Read this before changing anything in this repo, and update it in the same pull request
whenever a convention changes.

- Live site: https://rhyman7.github.io/ (GitHub Pages, branch `main`, repo root). One page,
  `index.html`, plus the logos in `img/`.
- It's the landing page for the two matchup dashboards, which have their own repos and
  CONVENTIONS.md: [rhyman7/nfl](https://github.com/rhyman7/nfl) (served at `/nfl/`) and
  [rhyman7/cfb](https://github.com/rhyman7/cfb) (served at `/cfb/`).

## How changes get made

- **Pull requests, merged after checks.** Don't push hand edits straight to `main`: `main`
  is the live site. Open a pull request (one topic per PR), run the checks in "Testing a
  change", and merge it yourself once they pass (squash, delete the branch). Then tell Ryan in
  a line or two what went live, with the PR link. If a check fails, don't merge: fix it, or
  leave the PR open and tell Ryan why.
- **After merging**, confirm the Pages deploy for the merge commit succeeded and load the
  live page. If something broke, revert right away (a revert PR, merged the same way) and
  tell Ryan.
- **Ask first** if anything is unclear or a change could break the live site.
- **Out of scope here:** prediction and betting-model work belongs in the separate CFB/NFL
  Model project. The Weekly Value Boards (rhyman7/fb-value-board) are kept separate for now:
  don't link them from here until Ryan says otherwise.

## Page

- **Stay styled like the dashboards:** the same graphite palette (CSS custom properties on
  `:root`), Archivo from Google Fonts, and the dashboards' page names. If the dashboards'
  look or page names change, update this page in the same change.
- Two league cards, college first, then NFL. Each card links to its dashboard's home
  (`/cfb/index.html`, `/nfl/index.html`) and to each of its pages, using the same page names
  as the dashboards' nav. If a dashboard page is added, renamed or removed, update its card.
- Links are root-relative (`/nfl/…`, `/cfb/…`, `img/…`).
- Logos: `img/ncaa.png` and `img/nfl.png`. The value boards' landing page uses copies of
  these, so keep the file names.
- Keep the footer credit for weather data (Open-Meteo).

## Testing a change

- Serve the repo root (`python -m http.server 8000`) and load `index.html` at desktop and
  phone widths with no page errors and no horizontal scroll.
- Check every link points at a page that exists in the dashboards' repos (their `main`).
