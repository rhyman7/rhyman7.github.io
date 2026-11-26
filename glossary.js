/* Weekly Gridiron Board glossary hints. Loaded by site-bar.js on every football page.
   Where one of the site's own terms (Typical, CLV, Rung, EPA / play, SRS ...) appears in a heading,
   a column header or a label, it gets a dotted underline; hovering, focusing or tapping it shows the
   term's definition from the Start here page (/start/), with a link to the full glossary.

   - The definitions are READ FROM /start/, so that page is the only place they are written.
   - Nothing is turned into a link and no click is stopped: click-to-sort headers keep working.
   - Table cells, links, buttons and form controls are left alone, so a term is marked where it is
     introduced (the header), not on every row.
   - To switch it off everywhere, set GLOSSARY = false in site-bar.js.
   To add a term: add it to /start/ first, then add a line to TERMS with that entry's id. */
(function () {
  "use strict";
  if (window.__wgbGlossary) return;
  window.__wgbGlossary = true;
  var path = location.pathname;
  if (path.indexOf("/start/") === 0 || path.indexOf("/status/") === 0) return;

  /* [pattern, id of the entry on /start/]. Order matters: the first pattern that matches a label wins. */
  var TERMS = [
    [/\bRecord-adjusted EV\b/i, "record-adjusted-ev"],
    [/\bTypical\b/, "typical"],
    [/\bFloors?\b/, "floor"],
    [/\bCLV\b|\bClosing line value\b/i, "closing-line-value-clv"],
    [/\bNo-vig\b/i, "no-vig-chance"],
    [/\bHaircut\b/i, "haircut"],
    [/\bBucket stakes?\b/i, "bucket-stake"],
    [/\bKelly\b/, "kelly"],
    [/\bLive record\b/, "live-record"],
    [/\bWithdrawn\b/, "kept-and-withdrawn"],
    [/\bModel leans\b/, "model-leans"],
    [/\bBest bets\b/i, "best-bets"],
    [/\bLine movement\b/, "line-movement"],
    [/^(Missed|Partly gone)$/, "line-movement"],
    [/\bOpening (line|spread|total)\b/i, "opening-line"],
    [/\bRungs?\b/, "rung"],
    [/\bTrue prob(ability)?\b/i, "true-probability"],
    [/\bFair odds\b/i, "fair-odds"],
    [/\bEPA \/ dropback\b/, "epa-per-dropback"],
    [/\bEPA \/ play\b/, "epa-per-play"],
    [/\bSuccess (%|rate)/, "success-rate"],
    [/\bCPOE\b/, "cpoe"],
    [/\b[OD]SRS\b/, "osrs-and-dsrs"],
    [/\bSRS\b/, "srs"],
    [/\bSoS\b/, "sos"],
    [/\bImplied\b/, "implied-total"],
    [/\bATS\b/, "ats"],
    [/\bBrier\b/, "brier-score"],
    [/\bProfit boost\b/i, "profit-boost"],
    [/\bTeasers?\b/, "teaser"],
    [/\bWOPR\b/, "wopr"],
    [/\bOn trial\b/, "track"],
    [/^(Met|Short)$/, "met-and-short"],
    [/\bBacktest\b/, "backtest"],
    [/\bEV\b/, "expected-value-ev"],
    [/\bEPA\b/, "epa"]
  ];
  var ANY = new RegExp(TERMS.map(function (t) { return t[0].source; }).join("|"), "i");
  /* Where a term may be marked: headings, headers and labels. Never inside these: */
  var SKIP = "td, a, button, select, option, input, textarea, svg, script, style, code, pre, nav, #wgb-bar, .wgb-term, #wgb-tip, [contenteditable]";
  var HOSTS = "th, h1, h2, h3, h4, h5, dt, legend, caption, summary, label, [class*='label'], [class*='lbl'], [class*='title'], [class*='head'], [class*='tile'], [class*='chip'], [class*='badge'], [class*='key'], [class*='pre'], [class*='tag']";
  var MAX_TEXT = 60, MAX_MARKS = 300, MAX_EACH = 8;   /* a term repeated on every card is marked on the first few only */

  var counts = {};
  var defs = null, tip = null, shownFor = null, hideTimer = 0, marks = 0, observer = null, pending = 0;

  function style() {
    var s = document.createElement("style");
    s.textContent =
      ".wgb-term{text-decoration:underline dotted;text-decoration-thickness:1px;text-underline-offset:3px;cursor:help}" +
      ".wgb-term:focus-visible{outline:2px solid currentColor;outline-offset:2px;border-radius:2px}" +
      "#wgb-tip{position:fixed;z-index:2147483000;max-width:min(340px,calc(100vw - 24px));padding:10px 12px 11px;border-radius:8px;" +
      "background:#1b1d21;color:#f2f1ee;border:1px solid #4a505a;box-shadow:0 8px 24px rgba(0,0,0,.35);" +
      "font:400 13.5px/1.45 Archivo,'Helvetica Neue',Arial,sans-serif;text-align:left;text-transform:none;letter-spacing:0;white-space:normal}" +
      "#wgb-tip b{display:block;font-weight:700;margin-bottom:3px}" +
      "#wgb-tip a{display:inline-block;margin-top:6px;color:#f2f1ee;font-weight:600;text-underline-offset:3px}" +
      "@media print{.wgb-term{text-decoration:none}#wgb-tip{display:none}}";
    document.head.appendChild(s);
  }

  function hide() { if (tip) tip.hidden = true; shownFor = null; }
  function show(el) {
    var d = defs[el.getAttribute("data-term")];
    if (!d) return;
    clearTimeout(hideTimer);
    if (!tip) {
      tip = document.createElement("div");
      tip.id = "wgb-tip";
      tip.setAttribute("role", "tooltip");
      tip.addEventListener("mouseenter", function () { clearTimeout(hideTimer); });
      tip.addEventListener("mouseleave", hide);
      document.body.appendChild(tip);
    }
    tip.textContent = "";
    var b = document.createElement("b"), p = document.createElement("span"), a = document.createElement("a");
    b.textContent = d.term; p.textContent = d.def;
    a.href = "/start/#" + el.getAttribute("data-term"); a.textContent = "Glossary";
    tip.appendChild(b); tip.appendChild(p); tip.appendChild(document.createElement("br")); tip.appendChild(a);
    tip.hidden = false;
    var r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
    var left = Math.min(Math.max(12, r.left), window.innerWidth - w - 12);
    var top = r.bottom + 8 + h > window.innerHeight ? Math.max(8, r.top - h - 8) : r.bottom + 8;
    tip.style.left = left + "px"; tip.style.top = top + "px";
    shownFor = el;
  }

  function mark(node) {
    var text = node.nodeValue, parent = node.parentElement;
    if (!parent || text.length > MAX_TEXT || !ANY.test(text)) return;
    if (parent.closest(SKIP) || !parent.closest(HOSTS)) return;
    var whole = text.trim();
    for (var i = 0; i < TERMS.length; i++) {
      var m = TERMS[i][0].exec(TERMS[i][0].source.charAt(0) === "^" ? whole : text);
      if (!m || !defs[TERMS[i][1]]) continue;
      if ((counts[TERMS[i][1]] || 0) >= MAX_EACH) return;
      var start = TERMS[i][0].source.charAt(0) === "^" ? text.indexOf(whole) : m.index;
      var span = document.createElement("span");
      span.className = "wgb-term"; span.setAttribute("data-term", TERMS[i][1]); span.tabIndex = 0;
      var mid = node.splitText(start); mid.splitText(m[0].length);
      parent.insertBefore(span, mid); span.appendChild(mid);
      if (parent.tagName === "SPAN" && parent.title) parent.removeAttribute("title");   /* the page's own hover text would double up */
      marks++; counts[TERMS[i][1]] = (counts[TERMS[i][1]] || 0) + 1;
      return;
    }
  }
  function scan() {
    pending = 0;
    if (marks >= MAX_MARKS) return;
    if (observer) observer.disconnect();
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null), nodes = [], n;
    while ((n = walker.nextNode())) if (n.nodeValue.length <= MAX_TEXT && n.nodeValue.length > 1) nodes.push(n);
    for (var i = 0; i < nodes.length && marks < MAX_MARKS; i++) mark(nodes[i]);
    if (observer) observer.observe(document.body, { childList: true, subtree: true });
  }
  function later() { if (!pending) pending = setTimeout(scan, 350); }

  function start(html) {
    var doc = new DOMParser().parseFromString(html, "text/html");
    defs = {};
    doc.querySelectorAll(".term[id]").forEach(function (t) {
      var dt = t.querySelector("dt"), dd = t.querySelector("dd");
      if (dt && dd) defs[t.id] = { term: dt.textContent, def: dd.textContent };
    });
    if (!Object.keys(defs).length) return;
    style();
    document.addEventListener("mouseover", function (e) { var t = e.target.closest && e.target.closest(".wgb-term"); if (t) show(t); });
    document.addEventListener("mouseout", function (e) { if (e.target.closest && e.target.closest(".wgb-term")) hideTimer = setTimeout(hide, 250); });
    document.addEventListener("focusin", function (e) { var t = e.target.closest && e.target.closest(".wgb-term"); if (t) show(t); });
    document.addEventListener("focusout", function (e) { if (e.target.closest && e.target.closest(".wgb-term")) hideTimer = setTimeout(hide, 250); });
    document.addEventListener("click", function (e) {
      var t = e.target.closest && e.target.closest(".wgb-term");
      if (t) { if (shownFor === t && e.detail === 0) hide(); else show(t); }
      else if (!(e.target.closest && e.target.closest("#wgb-tip"))) hide();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") hide(); });
    window.addEventListener("scroll", hide, { passive: true, capture: true });
    observer = new MutationObserver(function () {
      var live = document.querySelectorAll(".wgb-term"); marks = live.length; counts = {};
      for (var i = 0; i < live.length; i++) { var k = live[i].getAttribute("data-term"); counts[k] = (counts[k] || 0) + 1; }
      later();
    });
    scan();
  }

  function go() {
    fetch("/start/", { credentials: "omit" }).then(function (r) { return r.ok ? r.text() : ""; }).then(function (t) { if (t) start(t); }).catch(function () {});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();
