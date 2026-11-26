/* Weekly Gridiron Board site bar: one strip across the top of every football page
   (the hub, both matchup dashboards, both value boards, Parlays, the Weekly Review and Recommended).
   Each page loads it with <script src="/site-bar.js"></script> as the first thing in <body>.
   It writes its own markup and styles, so a change here reaches every page at once.
   If it fails to load (a page opened from disk or a local server), the page is unchanged. */
(function () {
  "use strict";
  if (document.getElementById("wgb-bar")) return;

  /* Glossary hints (glossary.js): terms in headings and column headers get a dotted underline and
     show their Start here definition on hover or tap. Set to false to switch it off everywhere. */
  var GLOSSARY = true;
  if (GLOSSARY) {
    var gs = document.createElement("script");
    gs.src = "/glossary.js";
    gs.defer = true;
    document.head.appendChild(gs);
  }

  var LINKS = [
    ["CFB Matchups", "/cfb/index.html", "cfb"],
    ["NFL Matchups", "/nfl/index.html", "nfl"],
    ["College Value Board", "/fb-value-board/docs/cfb/", "vb-cfb"],
    ["NFL Value Board", "/fb-value-board/docs/", "vb-nfl"],
    ["Parlays", "/fb-value-board/docs/parlays.html", "parlays"],
    ["Weekly Review", "/fb-value-board/review/", "review"],
    ["Recommended", "/fb-value-board/docs/recommended/", "recommended"]
  ];

  function section(path) {
    if (path.indexOf("/cfb/") === 0) return "cfb";
    if (path.indexOf("/nfl/") === 0) return "nfl";
    if (path.indexOf("/fb-value-board/review/") === 0) return "review";
    if (path.indexOf("/fb-value-board/docs/parlays") === 0) return "parlays";
    if (path.indexOf("/fb-value-board/docs/recommended") === 0) return "recommended";
    if (path.indexOf("/fb-value-board/docs/cfb/") === 0) return "vb-cfb";
    if (path.indexOf("/fb-value-board/docs/manual/") === 0) return "";
    if (path.indexOf("/fb-value-board/docs/") === 0) return "vb-nfl";
    if (path === "/" || path === "/index.html") return "home";
    return "";
  }

  var here = section(location.pathname);

  var css =
    "#wgb-bar{display:flex;align-items:stretch;gap:0 22px;min-height:44px;margin:0;" +
    "padding:env(safe-area-inset-top,0px) 28px 0;background:#0e0f11;border-bottom:1px solid #353a42;" +
    "font-family:\"Archivo\",\"Helvetica Neue\",Arial,sans-serif;font-size:13px;line-height:1.2;" +
    "white-space:nowrap;overflow-x:auto;scrollbar-width:none;-webkit-font-smoothing:antialiased;box-sizing:border-box}" +
    "#wgb-bar::-webkit-scrollbar{display:none}" +
    "#wgb-bar a{flex:none;display:flex;align-items:center;min-height:44px;color:#9da2ab;text-decoration:none;" +
    "font-weight:400;border-top:2px solid transparent;border-bottom:2px solid transparent;box-sizing:border-box}" +
    "#wgb-bar a:hover{color:#f2f1ee}" +
    "#wgb-bar a:focus-visible{outline:2px solid #f2f1ee;outline-offset:-2px}" +
    "#wgb-bar a[aria-current=page]{color:#f2f1ee;border-bottom-color:#f2f1ee}" +
    "#wgb-bar .wgb-brand{color:#f2f1ee;font-weight:800;font-stretch:62%;font-size:18px;letter-spacing:.02em;" +
    "text-transform:uppercase;margin-right:10px}" +
    "#wgb-bar .wgb-side{margin-left:auto;padding-left:12px}" +
    "@media (max-width:820px){#wgb-bar{padding-left:16px;padding-right:16px;gap:0 18px}}" +
    "@media print{#wgb-bar{display:none !important}}";

  var style = document.createElement("style");
  style.id = "wgb-bar-style";
  style.textContent = css;
  document.head.appendChild(style);

  var nav = document.createElement("nav");
  nav.id = "wgb-bar";
  nav.className = "no-print";
  nav.setAttribute("aria-label", "Weekly Gridiron Board");

  function link(text, href, cls, current) {
    var a = document.createElement("a");
    a.href = href;
    a.textContent = text;
    if (cls) a.className = cls;
    if (current) a.setAttribute("aria-current", "page");
    nav.appendChild(a);
    return a;
  }

  link("Weekly Gridiron Board", "/", "wgb-brand", false);
  var current = null;
  LINKS.forEach(function (l) { var a = link(l[0], l[1], "", l[2] === here); if (l[2] === here) current = a; });
  link("Basketball", "/basketball/", "wgb-side", false);

  /* On a narrow screen the row scrolls sideways: start it at the current section. */
  function place() {
    document.body.insertBefore(nav, document.body.firstChild);
    if (current && nav.scrollWidth > nav.clientWidth) nav.scrollLeft = Math.max(0, current.offsetLeft - 16);
  }
  if (document.body) place();
  else document.addEventListener("DOMContentLoaded", place);
})();
