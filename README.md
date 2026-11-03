# Weekly Gridiron Board

The landing page for Ryan's two football matchup dashboards, live at
**https://rhyman7.github.io/**.

It's a single page with two league cards, college first, then NFL. Each card links to its
dashboard's home page and to every page in that dashboard.

| Card | Dashboard | Repo |
|---|---|---|
| College Football: **CFB Matchups** | [rhyman7.github.io/cfb/](https://rhyman7.github.io/cfb/) | [rhyman7/cfb](https://github.com/rhyman7/cfb) |
| NFL: **NFL Matchups** | [rhyman7.github.io/nfl/](https://rhyman7.github.io/nfl/) | [rhyman7/nfl](https://github.com/rhyman7/nfl) |

Each card lists the same pages, with the dashboards' own names: How to Read Matchups, EPA,
EPA Explained, Ratings Explained, Weekly Edges, and Compare Any Two Teams.

## What's in this repo

| File | What it is |
|---|---|
| `index.html` | The whole page: markup, styles and the league cards in one file |
| `img/ncaa.png`, `img/nfl.png` | The league logos on the cards |
| `favicon.ico`, `favicon-192.png`, `apple-touch-icon.png` | The RH monogram favicon (the same three files are in every one of Ryan's football repos) |
| `CONVENTIONS.md` | The rules for changing this repo. Read it first |
| `.github/workflows/delete-merged-branches.yml` | A hand-run Action that deletes leftover branches already merged into `main` |

There's no build step and nothing to install: GitHub Pages serves `main` from the repo root.

## Where the data comes from

This page holds no data; it only links to the dashboards. Their data is refreshed by daily
scheduled updates in their own repos: NFL stats from nflverse plus Pro-Football-Reference
standings, college stats from cfbfastR, and weather from
[Open-Meteo](https://open-meteo.com/) (credited in the footer).

## Making a change

Follow [CONVENTIONS.md](CONVENTIONS.md). In short:

1. Work on a branch and open a pull request; `main` is the live site.
2. Test locally: run `python -m http.server 8000` in the repo root, open
   `http://localhost:8000/`, and check desktop and phone widths, with no page errors and
   no sideways scrolling.
3. Check every link points at a page that exists in the dashboards' repos.
4. Merge, then confirm the Pages deploy succeeded and the live page loads.

The page should stay styled like the dashboards: the same dark graphite colors, the
Archivo font and the same page names. If a dashboard page is added, renamed or removed,
update its card here in the same change.
