/* Weekly Gridiron Board site bar: one strip across the top of every page
   (the hub, both matchup dashboards, both value boards, Parlays, the Weekly Review, Recommended, the
   manual, Prop Ladder and the basketball pages).
   Each page loads it with <script src="/site-bar.js"></script> as the first thing in <body>.
   It writes its own markup and styles, so a change here reaches every page at once.
   If it fails to load (a page opened from disk or a local server), the page is unchanged. */
(function () {
  "use strict";
  if (document.getElementById("wgb-bar")) return;
  var SELF = document.currentScript;

  /* Glossary hints (glossary.js): terms in headings and column headers get a dotted underline and
     show their Start here definition on hover or tap. Set to false to switch it off everywhere. */
  var GLOSSARY = true;
  if (GLOSSARY) {
    var gs = document.createElement("script");
    gs.src = "/glossary.js";
    gs.defer = true;
    document.head.appendChild(gs);
  }


  /* ---- The site as an installed phone app (Nov 26, 2026). manifest.webmanifest at the site's root
     makes the whole of rhyman7.github.io installable as one full-screen app. Every page that loads
     this script gets the manifest link, the bar color and the iPhone tags from here, so a page
     needs nothing of its own. An installed app has no browser buttons, so when the page is running
     as one (display-mode standalone, or iPhone's navigator.standalone) the bar gains a Back arrow
     and a Reload button. In an ordinary browser tab neither is added and the bar is unchanged. */
  (function () {
    var head = document.head;
    function tag(name, attrs, sel) {
      if (head.querySelector(sel)) return;
      var e = document.createElement(name);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      head.appendChild(e);
    }
    tag("link", { rel: "manifest", href: "/manifest.webmanifest" }, 'link[rel="manifest"]');
    tag("meta", { name: "theme-color", content: "#0e0f11" }, 'meta[name="theme-color"]');
    tag("meta", { name: "mobile-web-app-capable", content: "yes" }, 'meta[name="mobile-web-app-capable"]');
    tag("meta", { name: "apple-mobile-web-app-capable", content: "yes" }, 'meta[name="apple-mobile-web-app-capable"]');
    tag("meta", { name: "apple-mobile-web-app-status-bar-style", content: "black" }, 'meta[name="apple-mobile-web-app-status-bar-style"]');
    tag("meta", { name: "apple-mobile-web-app-title", content: "Gridiron" }, 'meta[name="apple-mobile-web-app-title"]');
  })();
  var IN_APP = false;
  try { IN_APP = navigator.standalone === true || (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches); } catch (e) {}
  var APP_CSS =
    "#wgb-bar .wgb-app{flex:none;display:flex;align-items:center;justify-content:center;width:44px;min-height:44px;padding:0;background:transparent;" +
    "border:0;color:#f2f1ee;cursor:pointer}#wgb-bar .wgb-app:focus-visible{outline:2px solid #f2f1ee;outline-offset:-2px}" +
    "#wgb-bar .wgb-app.wgb-back{margin-left:-12px}#wgb-bar .wgb-app.wgb-reload{margin-left:auto}#wgb-bar .wgb-app.wgb-reload + .wgb-menu-btn{margin-left:0}";
  function appButton(kind) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "wgb-app wgb-" + kind;
    b.setAttribute("aria-label", kind === "back" ? "Back" : "Reload this page");
    b.innerHTML = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
      (kind === "back" ? '<path d="M15 5l-7 7 7 7"></path>' : '<path d="M20 11a8 8 0 1 0-2.3 6.3"></path><path d="M20 4v7h-7"></path>') + "</svg>";
    b.addEventListener("click", function () {
      if (kind === "reload") { location.reload(); return; }
      if (history.length > 1) history.back(); else location.href = "/";
    });
    return b;
  }
  function onBasketball(path) { return /^\/(basketball|nba|cbb|bb-value-board)\//.test(path); }

  /* ---- The one-site bar (Nov 25, 2026). A page opts in with
     <script src="/site-bar.js" data-shell="2"></script>; a page without the attribute keeps the
     earlier one-row bar (below) until its site is moved over. Two rows on a wide screen: the
     sections, the same on every page, then the pages of the section you are in. On a phone the
     rows fold into one menu. SECTIONS is the whole site map: change it here and every page follows. */
  var SECTIONS = [
    { id: "matchups", name: "Matchups",
      leagues: { cfb: ["College", "/cfb/"], nfl: ["NFL", "/nfl/"] },
      pages: [["This Week", "index.html"], ["How to Read", "how-to-read.html"], ["EPA", "epa.html"], ["EPA Explained", "epa-explained.html"],
              ["Weekly Edges", "edges.html"], ["Compare", { cfb: "dashboard.html", nfl: "compare.html" }], ["Ratings Explained", "ratings.html"]] },
    { id: "boards", name: "Value Boards",
      leagues: { cfb: ["College", "/fb-value-board/docs/cfb/"], nfl: ["NFL", "/fb-value-board/docs/"] },
      pages: [["Games", "#games"], ["Best bets", "#bestbets"], ["Model leans", "#leans"], ["Players", "#players"], ["Props", "#props"],
              ["Past weeks", "#history"], ["Team ratings", "#ratings"], ["Model record", "#model"]] },
    { id: "tools", name: "Tools", pages: [["Parlays", "/fb-value-board/docs/parlays.html"], ["Prop Ladder", "/prop-ladder/"]] },
    { id: "record", name: "Record", pages: [["Recommended", "/fb-value-board/docs/recommended/"], ["Weekly Review", "/fb-value-board/review/"], ["What's live", "/fb-value-board/docs/whats-live/"]] },
    { id: "help", name: "Help", pages: [["Start here", "/start/"], ["Manual", "/fb-value-board/docs/manual/"]] }
  ];

  function shell() {
    var path = location.pathname, league = null, sec = null;
    function starts(p) { return path.indexOf(p) === 0; }
    if (starts("/cfb/")) { sec = "matchups"; league = "cfb"; }
    else if (starts("/nfl/")) { sec = "matchups"; league = "nfl"; }
    else if (starts("/fb-value-board/docs/parlays") || starts("/prop-ladder/")) sec = "tools";
    else if (starts("/fb-value-board/docs/recommended") || starts("/fb-value-board/review/") || starts("/fb-value-board/docs/whats-live")) sec = "record";
    else if (starts("/start/") || starts("/fb-value-board/docs/manual/")) sec = "help";
    else if (starts("/fb-value-board/docs/cfb/")) { sec = "boards"; league = "cfb"; }
    else if (starts("/fb-value-board/docs/")) { sec = "boards"; league = "nfl"; }
    var last = "cfb";
    try { if (league) localStorage.setItem("wgb-league", league); else last = localStorage.getItem("wgb-league") || "cfb"; } catch (e) {}
    if (last !== "nfl") last = "cfb";

    function href(s, page, lg) {
      var h = typeof page[1] === "string" ? page[1] : page[1][lg];
      return s.leagues ? (h.charAt(0) === "#" ? s.leagues[lg][1] + h : s.leagues[lg][1] + h) : h;
    }
    function isCurrent(s, page) {
      var h = typeof page[1] === "string" ? page[1] : page[1][league];
      if (h.charAt(0) === "#") { var now = location.hash || "#games"; return now === h || (h === "#games" && !/^#(bestbets|leans|players|props|history|ratings|model|matchups|manual)/.test(now)); }
      if (s.leagues) { var file = path.slice(s.leagues[league][1].length) || "index.html"; return file === h; }
      return path === h || path === h + "index.html";
    }

    var css =
      "#wgb-bar{margin:0;background:#0e0f11;border-bottom:1px solid #353a42;font-family:\"Archivo\",\"Helvetica Neue\",Arial,sans-serif;" +
      "font-size:14px;line-height:1.2;-webkit-font-smoothing:antialiased;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px)}" +
      "#wgb-bar *{box-sizing:border-box}" +
      "#wgb-bar .wgb-row{display:flex;align-items:stretch;gap:0 4px;max-width:1280px;margin:0 auto;padding:0 22px;white-space:nowrap}" +
      "#wgb-bar .wgb-two{background:#131416;border-top:1px solid #24272c}" +
      "#wgb-bar .wgb-two .wgb-row{overflow-x:auto;scrollbar-width:none}#wgb-bar .wgb-two .wgb-row::-webkit-scrollbar{display:none}" +
      "#wgb-bar a{flex:none;display:flex;align-items:center;min-height:44px;padding:0 12px;color:#9da2ab;text-decoration:none;font-weight:600;" +
      "border-bottom:2px solid transparent;border-top:2px solid transparent}" +
      "#wgb-bar .wgb-two a{min-height:40px;padding:0 11px;font-size:13.5px;font-weight:500}" +
      "#wgb-bar a:hover{color:#f2f1ee}#wgb-bar a:focus-visible,#wgb-bar button:focus-visible,#wgb-bar summary:focus-visible{outline:2px solid #f2f1ee;outline-offset:-2px}" +
      "#wgb-bar .wgb-row > a[aria-current]{color:#f2f1ee;border-bottom-color:#f2f1ee}" +
      "#wgb-bar .wgb-two a[aria-current]{color:#f2f1ee;font-weight:700;border-bottom-color:transparent}" +
      "#wgb-bar a.wgb-brand{color:#f2f1ee;font-weight:800;font-stretch:85%;font-size:15px;letter-spacing:.04em;text-transform:uppercase;padding-left:0;margin-right:14px}" +
      "#wgb-bar .wgb-side{margin-left:auto;font-weight:500;font-size:13.5px}" +
      "#wgb-bar .wgb-switch{display:flex;align-self:center;gap:2px;padding:3px;border:1px solid #353a42;border-radius:999px;margin-right:10px}" +
      "#wgb-bar .wgb-switch a{min-height:26px;padding:0 12px;border:0;border-radius:999px;font-size:13px;font-weight:700}" +
      "#wgb-bar .wgb-switch a[aria-current]{background:#f2f1ee;color:#131416}" +
      "#wgb-bar .wgb-menu-btn{display:none;width:44px;height:44px;margin-left:auto;background:transparent;border:0;color:#f2f1ee;cursor:pointer;align-items:center;justify-content:center}" +
      "#wgb-bar .wgb-drawer{display:none;border-top:1px solid #353a42;max-height:calc(100vh - 60px);overflow-y:auto}" +
      "#wgb-bar details{border-bottom:1px solid #353a42}#wgb-bar summary{display:flex;justify-content:space-between;align-items:center;min-height:50px;padding:0 18px;" +
      "font-weight:700;font-size:16px;color:#f2f1ee;cursor:pointer;list-style:none}#wgb-bar summary::-webkit-details-marker{display:none}" +
      "#wgb-bar summary::after{content:\"+\";color:#9da2ab;font-weight:400}#wgb-bar details[open] summary::after{content:\"\\2212\"}" +
      "#wgb-bar .wgb-drawer a{min-height:44px;padding:0 18px 0 32px;font-size:15px;font-weight:500;border:0}" +
      "#wgb-bar .wgb-drawer a[aria-current]{color:#f2f1ee;font-weight:700}" +
      "#wgb-bar .wgb-drawer .wgb-lg{padding:10px 18px 4px 32px;font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:#6b717c;font-weight:650}" +
      "#wgb-bar .wgb-drawer > a{padding-left:18px;min-height:50px;color:#9da2ab}" +
      "@media (max-width:760px){#wgb-bar .wgb-one > a:not(.wgb-brand),#wgb-bar .wgb-two{display:none}#wgb-bar .wgb-menu-btn{display:flex}" +
      "#wgb-bar .wgb-row{padding:0 6px 0 16px}#wgb-bar.wgb-open .wgb-drawer{display:block}}" +
      "@media print{#wgb-bar{display:none !important}}";
    var style = document.createElement("style");
    style.id = "wgb-bar-style"; style.textContent = css + (IN_APP ? APP_CSS : ""); document.head.appendChild(style);

    var nav = document.createElement("nav");
    nav.id = "wgb-bar"; nav.className = "no-print wgb-shell"; nav.setAttribute("aria-label", "Weekly Gridiron Board");
    function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
    function a(text, to, cls, cur) { var x = el("a", cls, text); x.href = to; if (cur) x.setAttribute("aria-current", "page"); return x; }

    var one = el("div", "wgb-row wgb-one");
    if (IN_APP) one.appendChild(appButton("back"));
    one.appendChild(a("Weekly Gridiron Board", "/", "wgb-brand", false));
    SECTIONS.forEach(function (s) { one.appendChild(a(s.name, href(s, s.pages[0], league || last), "", s.id === sec)); });
    one.appendChild(a("Basketball", "/basketball/", "wgb-side", onBasketball(path)));
    if (IN_APP) one.appendChild(appButton("reload"));
    var btn = el("button", "wgb-menu-btn");
    btn.type = "button"; btn.setAttribute("aria-label", "Menu"); btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>';
    one.appendChild(btn);
    nav.appendChild(one);

    var here = null, rowTwo = null, subLinks = [];
    SECTIONS.forEach(function (s) { if (s.id === sec) here = s; });
    if (here) {
      var two = el("div", "wgb-two"); rowTwo = el("div", "wgb-row");
      if (here.leagues) {
        var sw = el("div", "wgb-switch");
        ["cfb", "nfl"].forEach(function (lg) { sw.appendChild(a(here.leagues[lg][0], here.leagues[lg][1] + (here.id === "boards" ? (location.hash && !/^#\d/.test(location.hash) && /^#[a-z]+$/.test(location.hash) ? location.hash : "") : ""), "", lg === league)); });
        rowTwo.appendChild(sw);
      }
      here.pages.forEach(function (p) { var x = a(p[0], href(here, p, league), "", false); x._page = p; subLinks.push(x); rowTwo.appendChild(x); });
      two.appendChild(rowTwo); nav.appendChild(two);
    }

    var drawer = el("div", "wgb-drawer");
    SECTIONS.forEach(function (s) {
      var d = el("details"); if (s.id === sec) d.open = true;
      d.appendChild(el("summary", "", s.name));
      (s.leagues ? ["cfb", "nfl"] : [null]).forEach(function (lg) {
        if (lg) d.appendChild(el("div", "wgb-lg", s.leagues[lg][0]));
        s.pages.forEach(function (p) { var x = a(p[0], href(s, p, lg), "", false); x._page = p; x._sec = s; x._lg = lg; subLinks.push(x); d.appendChild(x); });
      });
      drawer.appendChild(d);
    });
    drawer.appendChild(a("Basketball", "/basketball/", "", onBasketball(path)));
    nav.appendChild(drawer);
    btn.addEventListener("click", function () { var open = !nav.classList.contains("wgb-open"); nav.classList.toggle("wgb-open", open); btn.setAttribute("aria-expanded", open ? "true" : "false"); });
    drawer.addEventListener("click", function (e) { if (e.target.closest && e.target.closest("a")) { nav.classList.remove("wgb-open"); btn.setAttribute("aria-expanded", "false"); } });

    function mark() {
      subLinks.forEach(function (x) {
        var s = x._sec || here, on = s === here && (x._lg == null || x._lg === league) && isCurrent(s, x._page);
        if (on) x.setAttribute("aria-current", "page"); else x.removeAttribute("aria-current");
      });
    }
    if (here) { mark(); window.addEventListener("hashchange", mark); }

    function place() {
      document.body.insertBefore(nav, document.body.firstChild);
      document.documentElement.classList.add("wgb-shell-on");
      var cur = rowTwo && rowTwo.querySelector("a[aria-current]:not(.wgb-switch a)");
      if (cur && rowTwo.scrollWidth > rowTwo.clientWidth) rowTwo.scrollLeft = Math.max(0, cur.offsetLeft - 120);
    }
    if (document.body) place(); else document.addEventListener("DOMContentLoaded", place);
  }
  if (SELF && SELF.getAttribute("data-shell") === "2") { shell(); return; }

  /* ---- The earlier one-row bar, for pages not yet moved to the bar above. */
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
  style.textContent = css + (IN_APP ? APP_CSS + "#wgb-bar .wgb-app{position:sticky;z-index:1;background:#0e0f11}#wgb-bar .wgb-app.wgb-back{left:0;margin:0 -10px 0 -28px}#wgb-bar .wgb-app.wgb-reload{right:0;margin:0 -28px 0 0}" +
    "@media (max-width:820px){#wgb-bar .wgb-app.wgb-back{margin-left:-16px}#wgb-bar .wgb-app.wgb-reload{margin-right:-16px}}" : "");
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

  if (IN_APP) nav.appendChild(appButton("back"));
  link("Weekly Gridiron Board", "/", "wgb-brand", false);
  var current = null;
  LINKS.forEach(function (l) { var a = link(l[0], l[1], "", l[2] === here); if (l[2] === here) current = a; });
  link("Basketball", "/basketball/", "wgb-side", onBasketball(location.pathname));
  if (IN_APP) nav.appendChild(appButton("reload"));

  /* On a narrow screen the row scrolls sideways: start it at the current section. */
  function place() {
    document.body.insertBefore(nav, document.body.firstChild);
    if (current && nav.scrollWidth > nav.clientWidth) nav.scrollLeft = Math.max(0, current.offsetLeft - (IN_APP ? 56 : 16));
  }
  if (document.body) place();
  else document.addEventListener("DOMContentLoaded", place);
})();
