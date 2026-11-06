/* ORBIT app: routing, views, modes, quiz, print card, presentation. Vanilla JS, no build step. */
(function () {
  'use strict';
  var O = window.ORBIT, A = O.art, esc = A.esc;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('orbit_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('orbit_' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  var SYS = { biliary: 'Biliary', appendix: 'Appendix', hernia: 'Hernia and abdominal wall', colorectal: 'Colon and rectum', foregut: 'Esophagus and diaphragm', bariatric: 'Bariatric', smallbowel: 'Small bowel and acute abdomen' };
  var KIND = { open: 'Open', lap: 'Laparoscopic', robotic: 'Robotic' };
  var MODES = [['res', 'Resident'], ['stu', 'Student'], ['nurse', 'OR nurse'], ['senior', 'Attending / teaching']];
  var SECS = {
    overview: 'Overview', anatomy: 'Anatomy', preop: 'Before surgery', setup: 'The OR', access: 'Access', steps: 'Operative steps',
    equipment: 'Equipment', pitfalls: 'Pitfalls and bail-out', postop: 'After surgery', compare: 'Compare approaches', quiz: 'Self-test', sources: 'Sources'
  };
  var MODE_SECS = {
    res: ['overview', 'anatomy', 'preop', 'setup', 'access', 'steps', 'equipment', 'pitfalls', 'postop', 'compare', 'quiz', 'sources'],
    stu: ['overview', 'anatomy', 'access', 'steps', 'postop', 'quiz', 'sources'],
    nurse: ['setup', 'access', 'equipment', 'steps', 'pitfalls', 'sources'],
    senior: ['overview', 'anatomy', 'setup', 'access', 'steps', 'pitfalls', 'compare', 'postop', 'sources']
  };
  var state = { mode: store.get('mode', 'res'), q: '', sys: '', kind: '', diff: 0 };
  if (!MODE_SECS[state.mode]) state.mode = 'res';
  var app = $('#app');

  var ICON = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
    print: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V3h12v6M6 18H4v-7h16v7h-2M8 14h8v7H8z"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z"/></svg>',
    table: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M10 4v16"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="8.5"/><ellipse cx="12" cy="12" rx="8.5" ry="3.2" transform="rotate(-28 12 12)"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></svg>',
    atlas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 5.5C7 4 9.5 4 12 5.5v14C9.5 18 7 18 4 19.5zM20 5.5C17 4 14.5 4 12 5.5v14c2.5-1.5 5-1.5 8 0z"/></svg>',
    live: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2.5 12.5h4l2-5 3.5 10 2.5-7 1.5 2h5.5"/></svg>',
    lab: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 20.5L13.5 10M13.5 10l2.2-5.6c.3-.8 1.4-.9 1.8-.1l.2.4M13.5 10l5.6-2.2c.8-.3.9-1.4.1-1.8l-.4-.2"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
    me: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="8.5" r="3.6"/><path d="M4.5 20c1.2-3.8 4-5.6 7.5-5.6s6.3 1.8 7.5 5.6"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 4h6v6M20 4l-9 9M18 14v5H5V6h5"/></svg>',
    full: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>'
  };

  /* ---------- helpers ---------- */
  function list(arr, cls) { if (!arr || !arr.length) return ''; return '<ul class="dots ' + (cls || '') + '">' + arr.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; }
  function diffDots(n) { var s = '<span class="diff" title="Difficulty ' + n + ' of 5">'; for (var i = 1; i <= 5; i++) s += '<i class="' + (i <= n ? 'on' : '') + '"></i>'; return s + '</span>'; }
  function kinds(p) { var k = {}; p.approaches.forEach(function (a) { if (a.status !== 'na') k[a.kind] = 1; }); return ['open', 'lap', 'robotic'].filter(function (x) { return k[x]; }); }
  function kindBadges(p) { return kinds(p).map(function (k) { return '<span class="badge k-' + k + '">' + KIND[k] + '</span>'; }).join(''); }
  function box(title, inner, ic) { return inner ? '<div class="card box"><h3>' + (ic ? '<span class="ic">' + ic + '</span>' : '') + esc(title) + '</h3>' + inner + '</div>' : ''; }
  function fig(svgStr, cap) { return '<div class="figwrap">' + svgStr + (cap ? '<div class="figcap">' + esc(cap) + '</div>' : '') + '</div>'; }
  function note(kind, k, text) { return text ? '<div class="note ' + kind + '"><span class="k">' + esc(k) + '</span><span>' + esc(text) + '</span></div>' : ''; }
  function sec(id, n, inner, sub) { return inner ? '<section class="sec" id="s-' + id + '"><h2><span class="n">' + n + '</span>' + SECS[id] + (sub ? ' <span class="sub">' + esc(sub) + '</span>' : '') + '</h2>' + inner + '</section>' : ''; }
  function parse() {
    var h = location.hash.replace(/^#\/?/, '');
    var qi = h.indexOf('?'), path = qi >= 0 ? h.slice(0, qi) : h, qs = qi >= 0 ? h.slice(qi + 1) : '';
    var params = {}; qs.split('&').forEach(function (kv) { if (!kv) return; var p = kv.split('='); params[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || ''); });
    return { parts: path.split('/').filter(Boolean), params: params };
  }
  function go(h) { if (location.hash !== h) location.hash = h; else route(); }

  /* merge an approach with the approach it inherits from */
  function resolve(p, ap) {
    if (!ap || !ap.inherit) return ap;
    var b = resolve(p, p.approaches.filter(function (x) { return x.key === ap.inherit; })[0]) || {};
    var m = {}; Object.keys(b).forEach(function (k) { m[k] = b[k]; }); Object.keys(ap).forEach(function (k) { m[k] = ap[k]; });
    m.inheritLabel = b.label;
    /* an inheriting approach may drop parent steps and add its own before/after */
    if (!ap.steps && (ap.skipSteps || ap.preSteps || ap.postSteps)) {
      var skip = ap.skipSteps || [];
      m.steps = (ap.preSteps || []).concat((b.steps || []).filter(function (x, i) { return skip.indexOf(i) < 0; }), ap.postSteps || []);
    }
    return m;
  }

  /* ---------- header ---------- */
  var NAV = [['', 'Home', 'home'], ['atlas', 'Procedures', 'atlas'], ['live', 'Live', 'live'], ['skills', 'Lab', 'lab'], ['me', 'Me', 'me']];
  var SX = '../index.html';
  function header() {
    var h = $('#top');
    h.innerHTML = '<div class="wrap"><a class="brand" href="#/" aria-label="ORBIT, home">' + A.emblem(38) +
      '<span><b>ORBIT</b><small>THE SURGICAL MENTOR</small></span></a><nav class="topnav" aria-label="Navigation">' +
      NAV.map(function (n) { return '<a href="#/' + n[0] + '" data-nav="' + n[0] + '">' + n[1] + '</a>'; }).join('') + '</nav><span class="sp"></span>' +
      '<a class="sxlink" href="' + SX + '" title="Surgery X">Surgery X ' + ICON.ext + '</a>' +
      '<button class="ibtn" id="theme" aria-label="Day or night mode">' + ICON.sun + '</button></div>';
    $('#theme', h).onclick = function () {
      var cur = document.documentElement.getAttribute('data-theme');
      var dark = cur ? cur === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
      var next = dark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next); store.set('theme', next);
    };
    var tb = document.createElement('nav'); tb.className = 'tabbar'; tb.setAttribute('aria-label', 'Main navigation');
    tb.innerHTML = NAV.map(function (n) { return '<a href="#/' + n[0] + '" data-nav="' + n[0] + '">' + ICON[n[2]] + '<span>' + n[1] + '</span></a>'; }).join('');
    document.body.appendChild(tb);
  }
  function navOn(k) { $$('[data-nav]').forEach(function (a) { if (a.dataset.nav === k) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); }); }
  function setMode(m) {
    state.mode = m; store.set('mode', m);
    route();
  }

  /* ---------- home ---------- */
  function filtered() {
    var q = state.q.trim().toLowerCase();
    return O.procs.filter(function (p) {
      if (state.sys && p.system !== state.sys) return false;
      if (state.kind && kinds(p).indexOf(state.kind) < 0) return false;
      if (state.diff && p.difficulty !== state.diff) return false;
      if (!q) return true;
      var hay = [p.title, p.title_en, p.organ, (p.tags || []).join(' '), SYS[p.system]].join(' ').toLowerCase();
      return q.split(/\s+/).every(function (w) { return hay.indexOf(w) >= 0; });
    });
  }
  function gridHtml() {
    var ps = filtered();
    if (!ps.length) return '<div class="empty">No procedures found. Try clearing the filters.</div>';
    return ps.map(function (p) {
      return '<a class="card pcard" href="#/p/' + p.id + '">' + A.cover(p.id, p.title) + '<div class="body"><h3>' + esc(p.title) + '</h3><div class="en">' + esc(p.title_en) + '</div>' +
        '<div class="meta"><span class="badge">' + esc(SYS[p.system] || '') + '</span>' + kindBadges(p) + diffDots(p.difficulty) + '</div></div></a>';
    }).join('');
  }
  function atlas() {
    document.title = 'Procedures · ORBIT';
    var nAp = 0, nSteps = 0;
    O.procs.forEach(function (p) { p.approaches.forEach(function (a) { if (a.status !== 'na') nAp++; if (a.steps) nSteps += a.steps.length; }); });
    var chip = function (k, v, l, cur) { return '<button class="chip" data-f="' + k + '" data-v="' + v + '" aria-pressed="' + (String(cur) === String(v)) + '">' + l + '</button>'; };
    app.innerHTML = pagehead('The atlas', 'Procedures', pl(O.procs.length, 'procedure') + ', ' + pl(nAp, 'approach', 'approaches') + ' and ' + pl(nSteps, 'step card') + '. Each procedure has anatomy, preparation, positioning and room setup, ports, steps, equipment, pitfalls and sources.', 'stomach') +
      '<div class="wrap"><div class="tools"><div class="search">' + ICON.search + '<input id="q" type="search" placeholder="Search: gallbladder, TAPP, sleeve, Nissen..." value="' + esc(state.q) + '" aria-label="Search procedures"></div>' +
      '<div class="chips" id="fsys"><span class="flabel">System</span>' + chip('sys', '', 'All', state.sys) + Object.keys(SYS).map(function (k) { return chip('sys', k, SYS[k], state.sys); }).join('') + '</div>' +
      '<div class="chips" id="fkind"><span class="flabel">Approach</span>' + chip('kind', '', 'All', state.kind) + ['open', 'lap', 'robotic'].map(function (k) { return chip('kind', k, KIND[k], state.kind); }).join('') +
      '<span class="flabel" style="margin-inline-start:10px">Difficulty</span>' + chip('diff', 0, 'All', state.diff) + [1, 2, 3, 4, 5].map(function (d) { return chip('diff', d, String(d), state.diff); }).join('') + '</div></div>' +
      '<div class="grid" id="grid">' + gridHtml() + '</div>' + disclaimer() + '</div>';
    O.mountMoves(app);
    $$('[data-live]', app).forEach(function (b) { b.onclick = function (e) { e.preventDefault(); e.stopPropagation(); go('#/live/' + b.dataset.live); }; });
    $$('[data-sim]', app).forEach(function (b) { b.onclick = function (e) { e.preventDefault(); e.stopPropagation(); go('#/sim/' + b.dataset.sim); }; });
    $('#q').oninput = function (e) { state.q = e.target.value; $('#grid').innerHTML = gridHtml(); };
    $$('.chip[data-f]').forEach(function (b) {
      b.onclick = function () {
        var f = b.dataset.f, v = f === 'diff' ? +b.dataset.v : b.dataset.v;
        state[f] = v;
        $$('.chip[data-f="' + f + '"]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        $('#grid').innerHTML = gridHtml();
      };
    });
  }
  function disclaimer() {
    return '<div class="disc"><b>Educational tool only.</b> ORBIT does not replace clinical judgment, supervision in the OR or your institution’s protocols. Content is rewritten in our own words and summarized from Current Surgical Therapy (14th ed.) and Sabiston (22nd ed.) and society guidelines, and does not replace them. No patient data. Illustrations are original and schematic.</div>';
  }

  /* ---------- the app pages: today, live, me ---------- */
  var LIVE = [['lap-chole', 'chole'], ['appendectomy', 'appendix'], ['inguinal-hernia', null]];
  var ROLES = [['res', 'Resident', 'Operate with your mentor. The decisions, the pitfalls and the complications.'], ['stu', 'Student', 'Identify the anatomy, follow the steps and answer questions.'], ['nurse', 'OR nurse', 'What to prepare, what to pass and what to anticipate at every step.'], ['senior', 'Attending / teaching', 'Teaching points, presentation mode and levels of independence.']];
  function leo(name, cls) { return '<img class="leo ' + (cls || '') + '" src="art/leo/' + name + '.webp" alt="" aria-hidden="true" loading="lazy">'; }
  function pagehead(kick, h, p, art) {
    return '<header class="pghead"><div class="wrap"><div class="kick">' + esc(kick) + '</div><h1>' + esc(h) + '</h1>' + (p ? '<p>' + esc(p) + '</p>' : '') + '</div>' + (art ? leo(art, 'pgart') : '') + '</header>';
  }
  function hist() { return store.get('live_hist', []); }
  function pl(n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); }
  function hello() { var h = new Date().getHours(); return h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : h < 21 ? 'Good evening' : 'Good night'; }
  function liveCard(id, big) {
    var p = O.byId(id), c = O.live && O.live[id]; if (!p) return '';
    var n = c ? c.cases.length : 0;
    return '<a class="lcard' + (c ? '' : ' soon') + (big ? ' big' : '') + '" href="' + (c ? '#/live/' + id : '#/p/' + id) + '">' + A.cover(id, p.title) +
      '<div class="lb"><div class="kick">' + (c ? 'Live · ' + pl(n, 'case') : 'Coming soon') + '</div><h3>' + esc(p.title) + '</h3><div class="en">' + esc(p.title_en) + '</div></div></a>';
  }
  function today() {
    document.title = 'ORBIT · The Surgical Mentor';
    var role = ROLES.filter(function (r) { return r[0] === state.mode; })[0], last = store.get('last', null), lp = last && O.byId(last);
    var H = hist(), day = Math.floor(Date.now() / 864e5), feat = O.procs[day % O.procs.length];
    app.innerHTML = '<section class="hero2">' + leo('vestorso', 'h2art') + leo('liver', 'h2art2') +
      '<div class="wrap"><div class="h2mark">' + A.emblem(92, 'big') + '</div><div class="h2word" dir="ltr">ORBIT</div><div class="h2acro" dir="ltr"><b>O</b>perating <b>R</b>oom <b>B</b>rain for <b>I</b>ntelligent <b>T</b>raining</div>' +
      '<h1>' + hello() + '. Let’s operate together today.</h1><p>A surgical mentor at your side, from the corridor through the first trocar to closure. Step by step, with voice, illustrations and sources.</p>' +
      '<a class="rolechip" href="#/me">' + ICON.me + '<span>' + esc(role[1]) + '</span></a></div></section>' +
      '<div class="wrap home2">' +
      '<section class="feat"><div class="fhead"><div><div class="kick">Live case</div><h2>James is waiting for you in the OR</h2><p>An attending surgeon and your mentor. He asks, you decide, and the case unfolds from your decisions: trocars on the abdominal wall, dissection, equipment and complications.</p></div><a class="btn pri" href="#/live">All cases ›</a></div>' +
      '<div class="lgrid">' + LIVE.map(function (x) { return liveCard(x[0]); }).join('') + '</div></section>' +
      (lp ? '<a class="cont card" href="#/p/' + lp.id + '"><span class="kick">Pick up where you left off</span><b>' + esc(lp.title) + '</b><span class="go">›</span></a>' : '') +
      '<section class="trio">' +
      '<a class="tcard" href="#/skills"><div class="tfig dark">' + O.movePlayer('hartmann') + '</div><div class="kick">Skills Lab</div><h3>Master the move before the tissue</h3><p>Grasping, traction, the hook, clips, the 30° scope and knowing your instruments.</p></a>' +
      '<a class="tcard" href="#/sim/lap-chole"><div class="tfig">' + leo('instr', 'tleo') + '</div><div class="kick">Guided simulator</div><h3>Cholecystectomy in ten stations</h3><p>Narration, decisions and the critical view of safety.</p></a>' +
      '<a class="tcard" href="#/p/' + feat.id + '"><div class="tfig">' + A.cover(feat.id, feat.title) + '</div><div class="kick">Procedure of the day</div><h3>' + esc(feat.title) + '</h3><p>' + esc(feat.title_en) + '</p></a></section>' +
      (H.length ? '<section class="mini"><div class="kick">Your recent cases</div>' + H.slice(-3).reverse().map(function (x) { return '<div class="hrow"><b>' + esc(x.title) + '</b><span>' + esc(x.out) + '</span><span class="sc">' + x.good + '/' + x.total + '</span></div>'; }).join('') + '</section>' : '') +
      '<footer class="foot2"><a href="' + SX + '">' + A.emblem(18) + ' Part of Surgery X ' + ICON.ext + '</a><a href="#/about">About and sources</a></footer>' + disclaimer() + '</div>';
    O.mountMoves(app);
  }
  function liveHub() {
    document.title = 'Live · ORBIT';
    var H = hist();
    app.innerHTML = pagehead('Live case', 'Operate with James', 'Just like a real day: meet your mentor in the corridor, go through the chart and walk into the OR. He asks what to do and how, and you answer with a button, in your own words or by voice. There isn’t always one right answer, and every decision changes how the case goes.', 'theatre') +
      '<div class="wrap"><div class="lgrid big">' + LIVE.map(function (x) { return liveCard(x[0], 1); }).join('') + '</div>' +
      '<section class="how"><div class="kick">How it works</div><ol class="steps3"><li><b>Corridor</b><span>A fictional case, a short chart and a check of what has already been done.</span></li><li><b>OR</b><span>Trocars on the wall, exposure, dissection, equipment. James stops you when he needs to.</span></li><li><b>Debrief</b><span>What you did well, where you got lucky, and the sources.</span></li></ol></section>' +
      (H.length ? '<section class="mini"><div class="kick">History</div>' + H.slice().reverse().map(function (x) { return '<div class="hrow"><b>' + esc(x.title) + '</b><span>' + esc(x.out) + '</span><span class="sc">' + x.good + '/' + x.total + '</span></div>'; }).join('') + '</section>' : '') +
      '<p class="muted">All cases are fictional. No patient data.</p></div>';
  }
  function mePage() {
    document.title = 'Me · ORBIT';
    var H = hist(), good = 0, tot = 0; H.forEach(function (x) { good += x.good; tot += x.total; });
    var standalone = appMode();
    app.innerHTML = pagehead('Me', 'My role', 'ORBIT adapts to whoever is holding the device: what you see, which questions you’re asked and what James says.', 'muscle1') +
      '<div class="wrap"><div class="roles">' + ROLES.map(function (r) { return '<button class="rcard" data-mode="' + r[0] + '" aria-pressed="' + (state.mode === r[0]) + '"><b>' + esc(r[1]) + '</b><span>' + esc(r[2]) + '</span></button>'; }).join('') + '</div>' +
      '<section class="stats3"><div><b>' + H.length + '</b><span>Live cases</span></div><div><b>' + (tot ? Math.round(good / tot * 100) + '%' : '·') + '</b><span>Recommended decisions</span></div><div><b>' + store.get('quiz_best', 0) + '</b><span>Best equipment quiz score</span></div></section>' +
      '<section class="set card"><h3>Settings</h3><label class="row"><span>Mentor voice</span><input type="checkbox" id="setvoice"' + (localStorage.getItem('orbit_live_voice') !== '0' ? ' checked' : '') + '></label><label class="row"><span>Night mode</span><input type="checkbox" id="setdark"' + (document.documentElement.getAttribute('data-theme') === 'dark' ? ' checked' : '') + '></label></section>' +
      (standalone ? '' : '<section class="set card"><h3>Install as an app</h3><p>On iPhone: in Safari, tap Share, then "Add to Home Screen". On Android and desktop: in the Chrome menu, choose "Install".</p></section>') +
      '<section class="set card"><h3>Surgery X</h3><p>ORBIT is a standalone app within Surgery X. It never reads or stores any patient data.</p><a class="btn" href="' + SX + '">Go to Surgery X ' + ICON.ext + '</a> <a class="btn" href="#/about">About and sources</a></section>' +
      '<p class="muted">ORBIT ' + esc(O.version) + '</p></div>';
    $$('.rcard', app).forEach(function (b) { b.onclick = function () { setMode(b.dataset.mode); }; });
    $('#setvoice').onchange = function (e) { try { localStorage.setItem('orbit_live_voice', e.target.checked ? '1' : '0'); } catch (x) {} };
    $('#setdark').onchange = function (e) { var t = e.target.checked ? 'dark' : 'light'; document.documentElement.setAttribute('data-theme', t); store.set('theme', t); };
  }

  /* ---------- procedure ---------- */
  function procView(p, params) {
    var aps = p.approaches;
    var raw = aps.filter(function (a) { return a.key === params.ap; })[0] || aps.filter(function (a) { return a.status !== 'na'; })[0] || aps[0];
    var ap = resolve(p, raw);
    var mode = state.mode;
    document.title = p.title + ' · ORBIT';
    var secs = MODE_SECS[mode].slice();
    var n = 0, body = '';
    secs.forEach(function (s) {
      var html = SECTION[s](p, ap, mode);
      if (html) { n++; body += sec(s, n, html, s === 'steps' || s === 'access' || s === 'setup' || s === 'equipment' ? ap.label : ''); }
    });
    var presentBtn = (O.sims && O.sims[p.id] ? '<a class="btn pri simbtn" href="#/sim/' + p.id + '">' + ICON.play + 'Step-by-step simulator</a>' : '') + (O.live && O.live[p.id] ? '<a class="btn simbtn" href="#/live/' + p.id + '">' + ICON.play + 'Live case</a>' : '') + '<button class="btn' + (O.sims && O.sims[p.id] ? '' : ' pri') + '" id="present">' + ICON.play + 'Presentation mode</button>';
    app.innerHTML = '<div class="phead"><div class="wrap"><div class="crumbs"><a href="#/atlas">All procedures</a> · ' + esc(SYS[p.system] || '') + '</div>' +
      '<div class="row">' + A.cover(p.id, p.title) + '<div><h1>' + esc(p.title) + '</h1><div class="en">' + esc(p.title_en) + '</div>' +
      '<div class="meta"><span class="badge">' + esc(SYS[p.system] || '') + '</span>' + kindBadges(p) + '<span class="badge">Difficulty ' + p.difficulty + '/5</span>' + (p.setting ? '<span class="badge">' + esc(p.setting) + '</span>' : '') + '</div></div></div>' +
      '<div class="actions">' + presentBtn + '<a class="btn" href="#/p/' + p.id + '/card?ap=' + ap.key + '">' + ICON.print + 'Procedure card</a><a class="btn" href="#/p/' + p.id + '/compare">' + ICON.table + 'Compare approaches</a></div>' +
      '<div class="aptabs" role="tablist" aria-label="Choose an approach">' + aps.map(function (a) {
        return '<button class="aptab' + (a.status === 'na' ? ' na' : '') + '" role="tab" aria-selected="' + (a.key === ap.key) + '" data-ap="' + a.key + '">' + esc(a.label) + '<small>' + KIND[a.kind] + (a.status === 'na' ? ' · not applicable' : '') + '</small></button>';
      }).join('') + '</div></div></div>' +
      '<nav class="secnav" aria-label="On this page"><div class="wrap"><div class="chips">' + secs.filter(function (s) { return body.indexOf('id="s-' + s + '"') >= 0; }).map(function (s) { return '<a class="chip" href="#s-' + s + '" data-sec="' + s + '">' + SECS[s] + '</a>'; }).join('') + '</div></div></nav>' +
      '<div class="wrap">' + (ap.status === 'na' ? '<div class="sec">' + note('info', 'Not applicable:', ap.naReason || 'This approach is not used for this procedure.') + '</div>' : '') + body + disclaimer() + '</div>';
    $$('.aptab').forEach(function (b) { b.onclick = function () { go('#/p/' + p.id + '?ap=' + b.dataset.ap); }; });
    $$('.secnav a').forEach(function (a) { a.onclick = function (e) { e.preventDefault(); var t = $('#s-' + a.dataset.sec); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }; });
    $('#present').onclick = function () { present(p, ap); };
    bindHotspots(); bindQuiz(p); bindChecklist(p, ap);
    $$('.mvchip').forEach(function (b) { b.onclick = function () { O.moveModal(b.dataset.move); }; });
    if (params.present === '1') present(p, ap);
  }

  function moveChips(s) { return (s.moves || []).filter(function (id) { return O.moves[id]; }).map(function (id) { return '<button class="btn mvchip" data-move="' + id + '">' + ICON.play + 'Watch the move: ' + esc(O.moves[id].t) + '</button>'; }).join(''); }

  var SECTION = {
    overview: function (p, ap, mode) {
      var o = p.overview || {};
      var facts = (o.facts || []).map(function (f) { return '<div class="card fact"><b>' + esc(f.v) + '</b><span>' + esc(f.l) + '</span></div>'; }).join('');
      if (mode === 'stu') {
        var s = p.student || {};
        return (s.summary ? '<p>' + esc(s.summary) + '</p>' : '') + '<div class="cols">' + box('Why we operate', list(o.indications), '✓') + box('Points to remember', list(s.points || o.choice), '★') + '</div>';
      }
      return (facts ? '<div class="facts">' + facts + '</div>' : '') + '<div class="cols">' + box('Indications', list(o.indications), '✓') + box('Contraindications', list(o.contraindications, 'red'), '✕') + box('What the choice of approach depends on', list(o.choice), '⇄') + '</div>' +
        (p.gaps && p.gaps.length && mode !== 'stu' ? '<div class="gapnote" style="margin-top:12px"><b>Known gaps in the content:</b> ' + esc(p.gaps.join(' · ')) + '</div>' : '');
    },
    anatomy: function (p, ap, mode) {
      var an = p.anatomy || {}; if (!an.figures) return '';
      var ak = A.aiOf(p.id), hero = ak ? '<div class="figwrap aiwrap" style="margin-bottom:14px">' + A.ai(ak) + '<div class="figcap">' + esc(A.AI[ak].t) + ' · 3D illustration for orientation, not to scale. The numbered diagram is below.</div></div>' : '';
      var figs = an.figures.map(function (f, fi) {
        var hs = (f.hotspots || []).map(function (h, i) { return '<button class="hsbtn" data-fig="' + fi + '" data-hs="' + i + '" aria-expanded="false"><span class="num">' + (i + 1) + '</span><div><b>' + esc(h.label) + '</b><span>' + esc(h.text) + '</span></div></button>'; }).join('');
        return '<div class="anat" data-figi="' + fi + '" style="margin-bottom:14px">' + fig(A.anatomy(f, { hotspots: true }), (O.bases[f.base] || {}).title + ' · original diagram, not to scale. Tap a number for details.') + '<div class="hslist">' + hs + '</div></div>';
      }).join('');
      var lm = an.landmarks && mode !== 'stu' ? box('Landmarks you must know', '<div class="pit">' + an.landmarks.map(function (l) { return '<div class="row"><b>' + esc(l.name) + '</b><span>' + esc(l.why) + '</span></div>'; }).join('') + '</div>', '◎') : '';
      return hero + figs + lm;
    },
    preop: function (p) {
      var o = p.preop || {};
      return '<div class="cols">' + box('Workup before surgery', list(o.workup), '🔎') + box('Informed consent points', list(o.consent), '✍') +
        box('Antibiotic prophylaxis', list(o.antibiotics), '℞') + box('VTE prophylaxis', list(o.vte), '⛑') + box('Bowel preparation', list(o.bowelPrep), '◐') + box('Special considerations', list(o.special), '!') + '</div>' +
        '<p class="figcap">General guidance only. Doses and regimens follow your institution’s protocol.</p>';
    },
    setup: function (p, ap, mode) {
      var su = ap.setup; if (!su || ap.status === 'na') return '';
      var press = (su.position && su.position.pressure || []).map(function (k) { return A.PRESSURE[k] || k; }).concat(su.pressureExtra || []);
      var staff = (su.room && su.room.staff || []).map(function (s) { return '<span><i class="lg-' + s.w + '">' + esc(s.w) + '</i>' + esc(A.WHO[s.w] || s.w) + '</span>'; }).join('');
      return '<div class="setup">' + fig(A.position(su.position), 'Side view of the position. Orange dots are pressure points to pad.') +
        '<div class="figwrap">' + A.room(su.room) + '<div class="legend">' + staff + '</div></div></div>' +
        '<div class="cols" style="margin-top:12px">' + box('Positioning and securing', list(su.notes), '⇲') + box('Arms', list(su.arms), '✋') + box('Pressure points to pad', list(press, 'red'), '●') + (mode === 'nurse' || mode === 'res' ? box('Team and equipment layout', list(su.team), '◫') : '') + '</div>';
    },
    access: function (p, ap) {
      var ac = ap.access; if (!ac || ap.status === 'na') return '';
      var rows = (ac.ports || []).map(function (pt, i) { return '<tr><td><span class="pn r-' + (pt.role || 'work') + '">' + esc(pt.n || (i + 1)) + '</span></td><td>' + esc(pt.mm ? pt.mm + ' mm' : '') + '</td><td>' + esc(pt.label || '') + '</td><td>' + esc(A.ROLE[pt.role] || '') + '</td></tr>'; }).join('');
      var inc = (ac.incisions || []).map(function (c) { return '<li>' + esc(c.label) + (c.note ? ' · ' + esc(c.note) : '') + (c.alt ? ' (alternative)' : '') + '</li>'; }).join('');
      return '<div class="access">' + fig(A.access(ac), ac.caption || 'Front view. The patient’s right is on the left of the drawing.') + '<div>' +
        (rows ? '<div class="card tscroll"><table class="t"><thead><tr><th>#</th><th>Size</th><th>Position</th><th>Role</th></tr></thead><tbody>' + rows + '</tbody></table></div>' : '') +
        (inc ? '<div class="card box" style="margin-top:10px"><h3>Incisions</h3><ul class="dots">' + inc + '</ul></div>' : '') +
        (ac.notes ? '<div class="card box" style="margin-top:10px"><h3>Key points</h3>' + list(ac.notes) + '</div>' : '') +
        (ac.docking ? '<div class="card box" style="margin-top:10px"><h3>Docking</h3>' + list(ac.docking) + '</div>' : '') + '</div></div>';
    },
    steps: function (p, ap, mode) {
      if (ap.status === 'na') return '';
      var st = ap.steps;
      var deltas = ap.deltas ? '<div class="card box deltas"><h3>What’s different in ' + esc(ap.label) + (ap.inheritLabel ? ' compared with ' + esc(ap.inheritLabel) : '') + '</h3>' + list(ap.deltas) + '</div>' : '';
      if (!st || !st.length) return deltas + '<div class="gapnote">Step cards for this approach haven’t been written yet.</div>';
      return deltas + '<div class="steps">' + st.map(function (s, i) {
        return '<article class="card step">' + (s.fig ? '<div class="figwrap">' + stepFig(s.fig, ap) + '</div>' : '') + '<div class="sb"><h3><span class="no">' + String(i + 1).padStart(2, '0') + '</span>' + esc(s.t) + '</h3><p>' + esc(s.d) + '</p>' +
          (mode !== 'stu' ? note('tip', 'Tip', s.tip) + note('warn', 'Danger', s.danger) : '') +
          (mode === 'nurse' && s.nurse ? '<div class="ninst"><b>Prepare:</b> ' + esc(s.nurse) + '</div>' : '') + moveChips(s) + '</div></article>';
      }).join('') + '</div>';
    },
    equipment: function (p, ap, mode) {
      var eq = ap.equipment; if (!eq || ap.status === 'na') return '';
      if (mode === 'nurse') {
        var key = 'chk_' + p.id + '_' + ap.key, saved = store.get(key, {}), total = 0, done = 0;
        var cards = eq.map(function (c, ci) {
          return '<div class="card box"><h3>' + esc(c.cat) + '</h3>' + c.items.map(function (it, ii) {
            var id = ci + '_' + ii; total++; if (saved[id]) done++;
            return '<label class="chk"><input type="checkbox" data-chk="' + id + '"' + (saved[id] ? ' checked' : '') + '><span>' + esc(it) + '</span></label>';
          }).join('') + (c.alt && c.alt.length ? '<div class="alt"><b>Alternatives: </b>' + esc(c.alt.join(' · ')) + '</div>' : '') + '</div>';
        }).join('');
        return '<div class="card box" style="margin-bottom:12px"><h3>Room preparation checklist</h3><div class="progress"><i id="chkbar" style="width:' + (total ? Math.round(100 * done / total) : 0) + '%"></i></div><span class="figcap" id="chktxt">' + done + ' of ' + total + ' ready</span> <button class="btn" id="chkreset" style="margin-top:6px">Reset</button></div><div class="eq">' + cards + '</div>';
      }
      return '<div class="eq">' + eq.map(function (c) {
        return '<div class="card box"><h3>' + esc(c.cat) + '</h3>' + list(c.items) + (c.alt && c.alt.length ? '<div class="alt"><b>Equipment options: </b>' + esc(c.alt.join(' · ')) + '</div>' : '') + '</div>';
      }).join('') + '</div>';
    },
    pitfalls: function (p, ap, mode) {
      var pf = (ap.pitfalls || []).concat(p.pitfalls || []);
      var rows = function (arr, a, b) { return arr.map(function (x) { return '<div class="row"><b>' + esc(x[a]) + '</b><span>' + esc(x[b]) + '</span></div>'; }).join(''); };
      var bail = p.bailout && p.bailout.length ? box('Bail-out ladder', '<ol class="ladder">' + p.bailout.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ol>', '⤴') : '';
      var intra = p.intraop && p.intraop.length ? box('Intraoperative complications and what to do', rows(p.intraop, 'c', 'do'), '⚠') : '';
      if (mode === 'nurse') return '<div class="pit">' + bail + intra + '</div>';
      return '<div class="pit">' + (pf.length ? box('Common pitfalls', rows(pf, 'p', 'fix'), '⚑') : '') + bail + intra + '</div>';
    },
    postop: function (p, ap, mode) {
      var po = p.postop || {};
      var comp = (po.complications || []).map(function (c) { return '<div class="row"><b>' + esc(c.c) + '</b><span>' + esc(c.d) + '</span></div>'; }).join('');
      return '<div class="cols">' + box('Care after surgery', list(mode === 'stu' ? (po.care || []).slice(0, 4) : po.care), '⟳') + (comp ? box('Common complications', '<div class="pit">' + comp + '</div>', '!') : '') + '</div>';
    },
    compare: function (p) { return compareTable(p); },
    quiz: function (p) {
      if (!p.quiz || !p.quiz.length) return '';
      return '<div class="quiz" id="quiz">' + p.quiz.map(function (q, i) {
        return '<div class="card q" data-q="' + i + '"><h4>' + (i + 1) + '. ' + esc(q.q) + '</h4><div class="opts">' + q.a.map(function (o, j) { return '<button class="opt" data-o="' + j + '">' + esc(o) + '</button>'; }).join('') + '</div><div class="why">' + esc(q.why) + '</div></div>';
      }).join('') + '<div class="card box"><span>Score: </span><span class="score" id="qscore">0 / ' + p.quiz.length + '</span> <button class="btn" id="qreset">Start over</button></div></div>';
    },
    sources: function (p) {
      var tag = { CST14: 'CST 14', SAB22: 'Sabiston 22', GL: 'Guideline' };
      return '<div class="card box"><ul class="dots src">' + (p.sources || []).map(function (s) { return '<li><span class="tag">' + (tag[s.b] || s.b) + '</span>' + esc(s.ref) + '</li>'; }).join('') + '</ul></div>';
    }
  };

  /* a step figure is an anatomy base, or the approach's own access map / position drawing */
  function stepFig(f, ap) {
    if (f.view === 'access') { var a = {}, src = ap.access || {}; Object.keys(src).forEach(function (k) { a[k] = src[k]; }); Object.keys(f.over || {}).forEach(function (k) { a[k] = f.over[k]; }); return A.access(a); }
    if (f.view === 'position') return A.position((ap.setup || {}).position);
    if (f.view === 'room') return A.room((ap.setup || {}).room);
    return A.anatomy(f);
  }
  function compareTable(p) {
    var c = p.compare; if (!c || !c.rows) return '';
    var aps = p.approaches.filter(function (a) { return a.status !== 'na' && (c.cols ? c.cols.indexOf(a.key) >= 0 : true); });
    return '<div class="card tscroll"><table class="t cmp"><thead><tr><th></th>' + aps.map(function (a) { return '<th>' + esc(a.label) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      c.rows.map(function (r) { return '<tr><td>' + esc(r.k) + '</td>' + aps.map(function (a) { var v = r.v[a.key]; return '<td' + (r.best === a.key ? ' class="best"' : '') + '>' + esc(v == null ? '·' : v) + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table></div>' + (c.note ? '<p class="figcap">' + esc(c.note) + '</p>' : '');
  }

  function bindHotspots() {
    $$('.anat').forEach(function (wrap) {
      var btns = $$('.hsbtn', wrap), dots = $$('.hs', wrap);
      function open(i) {
        btns.forEach(function (b, j) { b.setAttribute('aria-expanded', j === i && b.getAttribute('aria-expanded') !== 'true'); });
        dots.forEach(function (d, j) { d.classList.toggle('on', j === i); });
      }
      btns.forEach(function (b, i) { b.onclick = function () { open(i); }; });
      dots.forEach(function (d, i) {
        var f = function () { open(i); var b = btns[i]; if (b && b.scrollIntoView && innerWidth < 900) b.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); };
        d.addEventListener('click', f); d.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f(); } });
      });
    });
  }
  function bindQuiz(p) {
    var qz = $('#quiz'); if (!qz) return;
    var score = 0;
    $$('.q', qz).forEach(function (el) {
      var qi = +el.dataset.q, q = p.quiz[qi];
      $$('.opt', el).forEach(function (b) {
        b.onclick = function () {
          if (el.classList.contains('done')) return;
          el.classList.add('done');
          var j = +b.dataset.o;
          $$('.opt', el)[q.c].classList.add('ok');
          if (j !== q.c) b.classList.add('bad'); else score++;
          $('#qscore').textContent = score + ' / ' + p.quiz.length;
        };
      });
    });
    $('#qreset').onclick = function () { score = 0; $$('.q', qz).forEach(function (el) { el.classList.remove('done'); $$('.opt', el).forEach(function (b) { b.classList.remove('ok', 'bad'); }); }); $('#qscore').textContent = '0 / ' + p.quiz.length; };
  }
  function bindChecklist(p, ap) {
    var key = 'chk_' + p.id + '_' + ap.key, boxes = $$('[data-chk]'); if (!boxes.length) return;
    function upd() {
      var s = {}, d = 0; boxes.forEach(function (b) { if (b.checked) { s[b.dataset.chk] = 1; d++; } });
      store.set(key, s); $('#chkbar').style.width = Math.round(100 * d / boxes.length) + '%'; $('#chktxt').textContent = d + ' of ' + boxes.length + ' ready';
    }
    boxes.forEach(function (b) { b.onchange = upd; });
    $('#chkreset').onclick = function () { boxes.forEach(function (b) { b.checked = false; }); upd(); };
  }

  /* ---------- compare page ---------- */
  function comparePage(p) {
    document.title = 'Compare approaches · ' + p.title;
    app.innerHTML = '<div class="phead"><div class="wrap" style="padding-bottom:18px"><div class="crumbs"><a href="#/atlas">All procedures</a> · <a href="#/p/' + p.id + '">' + esc(p.title) + '</a></div><h1>Compare approaches</h1><div class="en">' + esc(p.title_en) + '</div></div></div>' +
      '<div class="wrap"><div class="sec">' + (compareTable(p) || '<div class="gapnote">There’s no comparison table for this procedure yet.</div>') + '</div>' +
      '<div class="sec"><h2>' + 'Approaches that don’t apply' + '</h2>' + (p.approaches.filter(function (a) { return a.status === 'na'; }).map(function (a) { return note('info', a.label + ':', a.naReason || ''); }).join('') || '<p class="figcap">All approaches apply.</p>') + '</div>' + disclaimer() + '</div>';
  }

  /* ---------- print card ---------- */
  function cardPage(p, params) {
    var raw = p.approaches.filter(function (a) { return a.key === params.ap; })[0] || p.approaches[0];
    var ap = resolve(p, raw), o = p.overview || {};
    document.title = 'Procedure card · ' + p.title;
    var li = function (arr, max) { return (arr || []).slice(0, max || 99).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join(''); };
    var steps = (ap.steps || []).map(function (s) { return '<li><b>' + esc(s.t) + '.</b> ' + esc(s.tip || s.d) + '</li>'; }).join('');
    var eq = (ap.equipment || []).map(function (c) { return '<li><b>' + esc(c.cat) + ':</b> ' + esc(c.items.join(', ')) + '</li>'; }).join('');
    var figs = (ap.setup ? A.position(ap.setup.position) + A.room(ap.setup.room) : '') + (ap.access ? A.access(ap.access) : '');
    app.innerHTML = '<div class="wrap"><div class="cardbar noprint"><a class="btn" href="#/p/' + p.id + '?ap=' + ap.key + '">Back to the procedure</a><button class="btn pri" onclick="window.print()">' + ICON.print + 'Print</button>' +
      p.approaches.filter(function (a) { return a.status !== 'na'; }).map(function (a) { return '<a class="btn" href="#/p/' + p.id + '/card?ap=' + a.key + '"' + (a.key === ap.key ? ' aria-current="page"' : '') + '>' + esc(a.label) + '</a>'; }).join('') + '</div>' +
      '<article class="cardpage"><div class="ch">' + A.emblem(30).replace('class="emblem"', 'class="emblem" style="background:#241E18;border-radius:8px;padding:2px"') + '<div><h1>' + esc(p.title) + '</h1><div style="font-size:12px;color:#5A6B7C;direction:ltr;text-align:left">' + esc(p.title_en) + '</div></div><span class="ap">' + esc(ap.label) + '</span></div>' +
      (ap.status === 'na' ? '<p>' + esc(ap.naReason || '') + '</p>' : '') +
      '<div class="figs">' + figs + '</div><div class="cg"><div><h3>Indications</h3><ul>' + li(o.indications, 5) + '</ul><h3>Preparation</h3><ul>' + li((p.preop || {}).antibiotics, 2) + li((p.preop || {}).vte, 1) + li((p.preop || {}).special, 3) + '</ul>' +
      '<h3>Positioning</h3><ul>' + li(ap.setup && ap.setup.notes, 4) + '</ul><h3>Equipment</h3><ul>' + eq + '</ul></div>' +
      '<div><h3>Steps and key points</h3><ol>' + steps + '</ol><h3>Bail-out</h3><ol>' + li(p.bailout, 5) + '</ol><h3>Pitfalls</h3><ul>' + ((ap.pitfalls || []).concat(p.pitfalls || [])).slice(0, 5).map(function (x) { return '<li>' + esc(x.p) + ': ' + esc(x.fix) + '</li>'; }).join('') + '</ul></div></div>' +
      '<div class="foot">ORBIT · Operating Room Brain for Intelligent Training · Educational tool, not a substitute for clinical judgment or institutional protocols. Sources: ' + esc((p.sources || []).slice(0, 3).map(function (s) { return s.ref; }).join(' | ')) + '</div></article></div>';
  }

  /* ---------- about ---------- */
  function about() {
    document.title = 'About · ORBIT';
    app.innerHTML = '<div class="wrap prose"><div class="sec"><h1>About ORBIT</h1><p dir="ltr" style="letter-spacing:.06em"><b>O</b>perating <b>R</b>oom <b>B</b>rain for <b>I</b>ntelligent <b>T</b>raining</p><p>ORBIT, the smart brain of the operating room, is a learning and planning tool for common general surgery procedures. It is built for residents, medical students and interns, OR nurses and the attendings who teach them. Each procedure is shown in up to three approaches where they apply: open, laparoscopic and robotic.</p>' +
      '<h2>Display modes</h2><ul class="dots"><li>Resident: the full picture, including pitfalls, bail-out and comparison.</li><li>Student: the essentials, with anatomy, steps and a short quiz.</li><li>OR nurse: positioning, room setup, ports and an equipment checklist.</li><li>Attending / teaching: a structure built for teaching, and full-screen presentation mode.</li></ul>' +
      '<h2>Sources</h2><p>The facts were checked against Current Surgical Therapy, 14th edition (Cameron, 2023) and Sabiston Textbook of Surgery, 22nd edition. The text is rewritten in our own words and summarized. No text or illustrations were copied from the books. Society guidelines are cited by name and year only.</p>' +
      '<h2>Illustrations</h2><p>The numbered diagrams are original vector drawings, not to scale. Some procedures also have an AI-generated 3D illustration for orientation, checked against the anatomy. They show no faces, no genitals and no patient photos.</p>' +
      '<h2>Adding a procedure</h2><p>Each procedure is one file in the <code>data/procedures</code> folder that calls <code>ORBIT.register</code>. The structure is documented in <code>CLAUDE.md</code>. After adding the file, add a script line to <code>index.html</code> and run <code>node tools/lint.js</code>.</p>' +
      disclaimer() + '</div></div>';
  }

  /* ---------- presentation ---------- */
  var P = { slides: [], i: 0, el: null };
  function buildSlides(p, ap) {
    var s = [], o = p.overview || {};
    s.push({ kicker: 'ORBIT · ' + ap.label, h: p.title, body: '<p style="opacity:.8;direction:ltr;text-align:left">' + esc(p.title_en) + '</p>' + list(o.indications), fig: A.cover(p.id, p.title), dark: true });
    var ak = A.aiOf(p.id);
    if (ak) s.push({ kicker: 'Anatomy', h: A.AI[ak].t, fig: A.ai(ak), dark: true, wide: true, body: '<ol style="padding-inline-start:20px">' + A.AI[ak].l.map(function (x) { return '<li>' + esc(x[2]) + '</li>'; }).join('') + '</ol>' });
    if (o.choice) s.push({ kicker: 'Choosing the approach', h: 'What the choice depends on', body: list(o.choice) });
    ((p.anatomy || {}).figures || []).forEach(function (f) { s.push({ kicker: 'Anatomy', h: (O.bases[f.base] || {}).title || '', fig: A.anatomy(f, { hotspots: true }), body: '<ol style="padding-inline-start:20px">' + (f.hotspots || []).map(function (h) { return '<li><b>' + esc(h.label) + '</b> · ' + esc(h.text) + '</li>'; }).join('') + '</ol>' }); });
    if (ap.setup) s.push({ kicker: 'The OR', h: 'Positioning and team layout', fig: A.room(ap.setup.room), body: A.position(ap.setup.position).replace('class="fig-pos"', 'class="fig-pos" style="background:#F8FAFB;border-radius:12px;width:100%"') + list(ap.setup.notes) });
    if (ap.access) s.push({ kicker: 'Access', h: ap.access.ports && ap.access.ports.length ? 'Port placement' : 'Incisions', fig: A.access(ap.access), body: list((ap.access.ports || []).map(function (pt, i) { return (pt.n || i + 1) + ' · ' + (pt.mm ? pt.mm + ' mm · ' : '') + (pt.label || ''); }).concat((ap.access.incisions || []).map(function (c) { return c.label; }))) });
    (ap.steps || []).forEach(function (st, i) { s.push({ kicker: 'Step ' + (i + 1) + ' of ' + ap.steps.length, h: st.t, fig: st.moves && O.moves[st.moves[0]] ? O.movePlayer(st.moves[0]) : st.fig ? stepFig(st.fig, ap) : '', dark: !!(st.moves && O.moves[st.moves[0]]), body: '<p>' + esc(st.d) + '</p>' + note('tip', 'Tip', st.tip) + note('warn', 'Danger', st.danger) }); });
    if (p.bailout) s.push({ kicker: 'When it’s hard', h: 'Bail-out ladder', body: '<ol class="ladder">' + p.bailout.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ol>' });
    s.push({ kicker: 'Wrap-up', h: 'Take-home points', body: list((p.student && p.student.points) || o.choice || []) + '<p style="opacity:.6;font-size:14px">Educational tool only. Not a substitute for clinical judgment or institutional protocols.</p>' });
    return s;
  }
  function present(p, ap) {
    P.slides = buildSlides(p, ap); P.i = 0; P.el = $('#presenter'); P.el.hidden = false; P.title = p.title + ' · ' + ap.label;
    document.body.style.overflow = 'hidden'; drawSlide();
  }
  function drawSlide() {
    var s = P.slides[P.i];
    P.el.innerHTML = '<div class="pbar"><button id="px" aria-label="Close">✕</button><span class="t">' + esc(P.title) + '</span><span>' + (P.i + 1) + ' / ' + P.slides.length + '</span><button id="pf" aria-label="Full screen">' + ICON.full.replace('<svg', '<svg width="18" height="18"') + '</button><button id="pp" aria-label="Previous">←</button><button id="pn" aria-label="Next">→</button></div>' +
      '<div class="slide' + (s.fig ? '' : ' txt') + (s.wide ? ' wide' : '') + '">' + (s.fig ? '<div class="sfig' + (s.dark ? ' dark' : '') + '">' + s.fig + '</div>' : '') + '<div><div class="kicker">' + esc(s.kicker) + '</div><h2>' + esc(s.h) + '</h2>' + (s.body || '') + '</div></div>' +
      '<div class="pfoot">' + P.slides.map(function (x, i) { return '<i class="' + (i === P.i ? 'on' : '') + '"></i>'; }).join('') + '</div>';
    $('#px').onclick = closePresent; $('#pn').onclick = function () { step(1); }; $('#pp').onclick = function () { step(-1); };
    O.mountMoves(P.el);
    $('#pf').onclick = function () { var d = document; if (d.fullscreenElement) d.exitFullscreen(); else if (P.el.requestFullscreen) P.el.requestFullscreen().catch(function () {}); };
  }
  function step(d) { var n = P.i + d; if (n < 0 || n >= P.slides.length) return; P.i = n; drawSlide(); }
  function closePresent() { if (!P.el || P.el.hidden) return; P.el.hidden = true; P.el.innerHTML = ''; document.body.style.overflow = ''; if (document.fullscreenElement) document.exitFullscreen().catch(function () {}); }
  document.addEventListener('keydown', function (e) {
    if (!P.el || P.el.hidden) return;
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); step(-1); }
    else if (e.key === 'Escape') closePresent();
  });
  var tx = null;
  document.addEventListener('touchstart', function (e) { if (P.el && !P.el.hidden) tx = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', function (e) { if (tx == null || !P.el || P.el.hidden) return; var dx = e.changedTouches[0].clientX - tx; tx = null; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); }, { passive: true });

  /* ---------- router ---------- */
  function route() {
    closePresent();
    var r = parse(), pr = r.parts;
    if (O.simClose && pr[0] !== 'sim') O.simClose();
    if (O.liveClose && pr[0] !== 'live') O.liveClose();
    if (pr[0] === 'p' && pr[1]) {
      var p = O.byId(pr[1]); if (p) store.set('last', p.id);
      if (!p) { app.innerHTML = '<div class="wrap empty">Procedure not found. <a href="#/">Back to home</a></div>'; return; }
      if (pr[2] === 'card') cardPage(p, r.params);
      else if (pr[2] === 'compare') comparePage(p);
      else procView(p, r.params);
    } else if (pr[0] === 'about') about();
    else if (pr[0] === 'sim' && pr[1] && O.byId(pr[1])) { procView(O.byId(pr[1]), {}); O.simOpen(pr[1], r.params.s); }
    else if (pr[0] === 'live' && pr[1] && O.byId(pr[1])) { liveHub(); if (!O.liveOpen(pr[1])) go('#/p/' + pr[1]); }
    else if (pr[0] === 'live') liveHub();
    else if (pr[0] === 'atlas') atlas();
    else if (pr[0] === 'me') mePage();
    else if (pr[0] === 'skills') { document.title = 'Skills Lab · ORBIT'; O.skillsPage(app, state.mode); }
    else today();
    navOn(pr[0] === 'p' || pr[0] === 'sim' ? 'atlas' : pr[0] === 'about' ? 'me' : (pr[0] || ''));
    if (!r.params.keep) window.scrollTo(0, 0);
  }
  /* opened as an installed app (Dock, home screen): fill the screen, and go true full screen on the first touch */
  function appMode() { return navigator.standalone || (window.matchMedia && (matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches)); }
  if (appMode()) {
    try { window.moveTo(0, 0); window.resizeTo(screen.availWidth, screen.availHeight); } catch (e) { /* the browser keeps its window size */ }
    var de = document.documentElement, fsOn = function () {
      if (!document.fullscreenElement && de.requestFullscreen) de.requestFullscreen({ navigationUI: 'hide' }).catch(function () {});
      document.removeEventListener('pointerdown', fsOn, true);
    };
    if (de.requestFullscreen) document.addEventListener('pointerdown', fsOn, true);
  }
  var th = store.get('theme', null); if (th) document.documentElement.setAttribute('data-theme', th);
  header();
  window.addEventListener('hashchange', route);
  route();
  O.app = { route: route, resolve: resolve, setMode: setMode };
})();
