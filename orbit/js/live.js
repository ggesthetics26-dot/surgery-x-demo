/* ORBIT live case (#/live/<procId>): you operate with your mentor, a young senior who talks you through the case.
   The case lives in data/live/<id>.js as a graph of nodes. The graph decides; the mentor only voices it.
   Node kinds: choice (default), check (what was done before we start), place (tap the wall for trocars),
   spot (tap a structure), tap (where do you dissect: danger zones interrupt you), gear (pick from the tray), info.
   State: S.v numeric risks, S.f flags, S.st the scene drawing, S.t minutes. Risks turn into events by rolls.
   Fictional cases only, no patient data. */
(function () {
  'use strict';
  var O = window.ORBIT, A = O.art, esc = A.esc;
  O.live = O.live || {};
  O.liveCase = function (id, def) { O.live[id] = def; };

  var P = { el: null, c: null, id: '', S: null, node: null, nid: '', audio: null, voice: true, busy: false, taps: [], placed: null };
  try { P.voice = localStorage.getItem('orbit_live_voice') !== '0'; } catch (e) {}
  function role() { try { return JSON.parse(localStorage.getItem('orbit_mode')) || 'res'; } catch (e) { return 'res'; } }
  function $(s) { return P.el.querySelector(s); }
  function $$(s) { return [].slice.call(P.el.querySelectorAll(s)); }
  function val(x) { return typeof x === 'function' ? x(P.S) : x; }
  function pick(x) { x = val(x); return Array.isArray(x) ? x[Math.floor(Math.random() * x.length)] : x; }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }

  /* ---------- state ---------- */
  function fresh(cs) {
    var S = { v: { bleed: 0, risk: 0 }, f: {}, st: {}, t: 0, hist: [], cs: cs, role: role(), seed: Math.random() };
    Object.keys(P.c.base || {}).forEach(function (k) { S.st[k] = P.c.base[k]; });
    Object.keys(cs.st || {}).forEach(function (k) { S.st[k] = cs.st[k]; });
    Object.keys(cs.v || {}).forEach(function (k) { S.v[k] = cs.v[k]; });
    (cs.f || []).forEach(function (k) { S.f[k] = 1; });
    return S;
  }
  function apply(fx) {
    if (!fx) return; fx = val(fx); if (!fx) return; var S = P.S;
    Object.keys(fx).forEach(function (k) {
      var x = fx[k];
      if (k === 'st') Object.keys(x).forEach(function (j) { S.st[j] = x[j]; });
      else if (k === 'flag') [].concat(x).forEach(function (f) { S.f[f] = 1; });
      else if (k === 'unflag') [].concat(x).forEach(function (f) { delete S.f[f]; });
      else if (k === 't') S.t += x;
      else if (k === 'set') Object.keys(x).forEach(function (j) { S.v[j] = x[j]; });
      else if (typeof x === 'number') S.v[k] = (S.v[k] || 0) + x;
    });
    S.v.bleed = clamp(S.v.bleed || 0, 0, 3);
  }
  function safety() { return P.c.safety ? clamp(Math.round(P.c.safety(P.S)), 0, 100) : clamp(100 - (P.S.v.risk || 0), 0, 100); }
  function vitals() {
    var b = P.S.v.bleed || 0, h = P.S.v.hemo || 0, j = Math.sin(Date.now() / 7000 + P.S.seed * 9) * 3;
    return { hr: Math.round(74 + b * 16 + h * 12 + j), sys: Math.round(124 - b * 14 - h * 16 + j), dia: Math.round(76 - b * 8 - h * 9), sat: Math.round(99 - h * 3), co2: Math.round(36 + (P.S.v.co2 || 0) * 4 + j / 3) };
  }

  /* ---------- routing ---------- */
  function resolve(id, depth) {
    depth = depth || 0; var n = P.c.nodes[id];
    if (!n || depth > 12) return id;
    if (n.for && n.for.indexOf(P.S.role) < 0) return resolve(n.skip || n.to, depth + 1);
    var j;
    for (j = 0; n.when && j < n.when.length; j++) if (n.when[j].if(P.S)) return resolve(n.when[j].to, depth + 1);
    for (j = 0; n.roll && j < n.roll.length; j++) {
      var r = n.roll[j]; if (r.flag && P.S.f[r.flag]) continue;
      var p = val(r.p); if (Math.random() < p) { if (r.flag) P.S.f[r.flag] = 1; if (r.ev) P.S.hist.push({ id: id, ev: r.ev }); apply(r.fx); return resolve(r.to, depth + 1); }
      if (r.luck && p > .12) P.S.hist.push({ id: id, luck: r.luck });
    }
    return id;
  }
  function go(id) {
    stopVoice();
    id = resolve(id); var n = P.c.nodes[id];
    if (!n) return;
    P.nid = id; P.node = n; P.taps = []; P.placed = null;
    apply(n.fx); if (n.st) apply({ st: n.st });
    if (n.end) saveHist();
    var line = n.end ? '' : pick(n.say);
    if (line) P.S.hist.push({ id: id, say: line });
    draw(!!line);
    if (line) speak(id, n);
  }

  /* ---------- voice: recorded takes only, never a robotic fallback ---------- */
  function stopVoice() { if (P.audio) { P.audio.pause(); P.audio = null; } if (P.el) P.el.classList.remove('talk'); }
  function speak(keys, n) {
    if (n && n.audio) keys = val(n.audio);
    var man = O.liveAudio && O.liveAudio[P.id];
    keys = [].concat(keys || []).filter(function (k) { return man && man[k]; });
    if (!P.voice || !keys.length) return;
    stopVoice();
    var a = new Audio('audio/live/' + P.id + '/' + keys[0] + '.mp3'); P.audio = a;
    a.onplay = function () { P.el.classList.add('talk'); };
    a.onpause = function () { P.el.classList.remove('talk'); };
    a.onended = function () { P.el.classList.remove('talk'); if (P.audio === a && keys.length > 1) speak(keys.slice(1)); };
    a.play().catch(function () {});
  }

  /* ---------- the picture ---------- */
  /* Story views: the picture follows the talk. A node without a view keeps the previous picture.
     mentor:<corridor|scrub|or|tense|calm|ward|debrief>  James talking · photo:<key> any image in art/live
     chart (the patient's card) · consent · room · position · tray · img:<key> (imaging) · wall · scene · ai · move:<id> */
  var PLACE = { corridor: 'In the corridor outside the OR', scrub: 'At the sink, scrubbing in', or: 'In the OR', tense: 'In the OR', calm: 'In the OR', ward: 'Morning round on the ward', clinic: 'In clinic, at follow-up', debrief: 'In the staff room, after the case' };
  var PHOTO = { room: 'or-room', tray: 'scrub-table', consent: 'consent', chart: 'chart' };
  /* the images that exist in art/live (others show a sepia drawing instead of a broken request) */
  O.liveArt = O.liveArt || { 'james-corridor': 1, 'james-scrub': 1, 'james-or': 1, 'james-tense': 1, 'james-calm': 1, 'james-ward': 1, 'james-debrief': 1 };
  function photo(key, cap, extra) {
    if (!O.liveArt[key]) return '<figure class="lvph noimg"><div class="lvph-fb">' + leoFb(key) + '</div>' + (extra || '') + (cap ? '<figcaption>' + esc(cap) + '</figcaption>' : '') + '</figure>';
    return '<figure class="lvph"><img src="art/live/' + key + '.jpg" alt="" onerror="this.parentNode.classList.add(\'noimg\')">' +
      '<div class="lvph-fb">' + leoFb(key) + '</div>' + (extra || '') + (cap ? '<figcaption>' + esc(cap) + '</figcaption>' : '') + '</figure>';
  }
  function leoFb(key) { var d = /room|tray|scrub-table/.test(key) ? 'instr' : /chart|consent|us|img/.test(key) ? 'organs' : 'vestorso'; return '<img src="art/leo/' + d + '.webp" alt="">'; }
  function mentorView(k) {
    var tag = '<div class="lvtag">' + av() + '<span><b>' + esc(P.c.mentor.name) + '</b><small>' + esc(PLACE[k] || '') + '</small></span><i class="wave"><b></b><b></b><b></b><b></b></i></div>';
    return photo('james-' + (k === 'clinic' ? 'ward' : k), '', tag).replace('class="lvph"', 'class="lvph lvmentor m-' + k + '"');
  }
  function chartView() {
    var cs = P.S.cs || {}, ch = cs.chart || {}, rows = (ch.labs || []).map(function (r) { return '<tr' + (r[2] ? ' class="hi"' : '') + '><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td></tr>'; }).join('');
    var li = function (a) { return (a || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join(''); };
    return '<div class="lvchart"><div class="lvch-h"><small>Patient chart · fictional case</small><b>' + esc(cs.he || '') + '</b></div><p>' + esc(cs.story || '') + '</p>' +
      (ch.hx ? '<h4>History</h4><ul>' + li(ch.hx) + '</ul>' : '') + (rows ? '<h4>Labs</h4><table>' + rows + '</table>' : '') + (ch.img ? '<h4>Imaging</h4><p>' + esc(ch.img) + '</p>' : '') + '</div>';
  }
  function setupOf() { var pr = O.byId(P.c.proc || P.id), ap = pr && (pr.approaches || []).filter(function (a) { return a.kind === 'lap' && a.setup; })[0]; return ap ? ap.setup : null; }
  function viewOf(n) {
    var v = n.view || P.lastView || 'mentor:corridor', k = n.kind;
    if ((k === 'spot' || k === 'tap') && !/^(scene|ai)$/.test(v)) v = 'scene';
    if (k === 'place') v = 'wall';
    P.lastView = v; return v;
  }
  function sceneSvg(view) {
    var S = P.S, sc, n = P.node, su;
    if (view.indexOf('mentor:') === 0) return mentorView(view.slice(7));
    if (view.indexOf('photo:') === 0) return photo(view.slice(6), n.cap);
    if (view.indexOf('img:') === 0) return photo('img-' + view.slice(4), n.cap || (S.cs.chart && S.cs.chart.img));
    if (view === 'chart') return chartView();
    if ((view === 'position' || view === 'room') && (su = setupOf())) return '<div class="lvsetup">' + (view === 'position' ? A.position(su.position) : A.room(su.room)) + (n.cap ? '<p>' + esc(n.cap) + '</p>' : '') + '</div>';
    if (PHOTO[view]) return photo(PHOTO[view], n.cap);
    if (view === 'wall' && O.scenes && O.scenes.wall) return O.scenes.wall.draw(wallState());
    if (view && view.indexOf('move:') === 0) return '<div class="lvmv">' + O.movePlayer(view.slice(5)) + '</div>';
    if (view === 'ai' || !(O.scenes && (sc = O.scenes[P.c.scene]))) return A.ai(P.c.ai || 'chole', { labels: !!S.st.labels });
    return sc.draw(S.st);
  }
  function wallState() {
    var n = P.node, st = { drape: true, habitus: P.S.st.habitus, scars: P.S.st.scars || [], palmer: !!P.S.st.palmer };
    st.ports = P.taps.map(function (p, i) { return { x: p[0], y: p[1], size: p.size || 5, kind: i ? 'work' : 'cam', state: p.state || 'ok', n: String(i + 1) }; });
    if (n && P.placed) { st.zones = P.placed.zones; st.target = n.target; st.angle = !!n.target; st.under = true; }
    return st;
  }
  function paint() {
    var host = $('#lvvis'); if (!host) return;
    var lay = document.createElement('div'); lay.className = 'lvl'; lay.innerHTML = sceneSvg(viewOf(P.node));
    var prev = P.lastLayer;
    host.appendChild(lay);
    if (prev) { var keep = prev.cloneNode(true); keep.classList.add('on', 'out'); host.insertBefore(keep, lay); setTimeout(function () { if (keep.parentNode) keep.parentNode.removeChild(keep); }, 560); }
    P.lastLayer = lay.cloneNode(true);
    O.mountMoves(lay);
    requestAnimationFrame(function () { requestAnimationFrame(function () { lay.classList.add('on'); }); });
    var svg = lay.querySelector('svg');
    if (svg && /^(place|spot|tap)$/.test(P.node.kind || '')) { svg.classList.add('tapme'); svg.addEventListener('click', onTap); }
  }
  function svgPt(svg, e) {
    var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    var m = svg.getScreenCTM(); if (!m) return null; pt = pt.matrixTransform(m.inverse()); return [pt.x, pt.y];
  }
  function ripple(svg, p, cls) {
    var g = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    g.setAttribute('cx', p[0]); g.setAttribute('cy', p[1]); g.setAttribute('r', 14); g.setAttribute('class', 'lvtap ' + (cls || ''));
    svg.appendChild(g);
  }
  function dist(a, b) { var dx = a[0] - b[0], dy = a[1] - b[1]; return Math.sqrt(dx * dx + dy * dy); }
  function spots() { var sc = O.scenes && O.scenes[P.c.scene]; return sc && sc.spots ? sc.spots(P.S.st) : []; }
  function spotXY(id) { var s = spots().filter(function (x) { return x.id === id; })[0]; return s ? [s.x, s.y] : null; }
  function zoneXY(z) { return z.xy || (z.spot ? spotXY(z.spot) : null) || (z.lm && lmPt({ lm: z.lm, dx: z.dx, dy: z.dy })) || null; }

  /* ---------- answers ---------- */
  function answer(e) {
    var last = P.S.hist[P.S.hist.length - 1] || {};
    P.S.hist.push({ id: P.nid, ans: e.t, g: e.g, why: e.why });
    if (e.g) P.S.hist.push({ dec: 1, id: P.nid, t: e.t, g: e.g, why: e.why, refs: e.refs, caught: e.caught });
    apply(e.fx);
    P.S.t += val(P.node.dt) || 0;
    var reply = pick(e.reply), to = e.to || P.node.to;
    if (reply) {
      P.S.hist.push({ id: P.nid, say: reply, warn: e.warn });
      draw(false); if (e.audio) speak(e.audio);
      P.busy = true; lock(true);
      setTimeout(function () { P.busy = false; go(to); }, clamp(1100 + reply.length * 42, 1800, 6500) * (O.liveSpeed || 1));
    } else go(to);
    return last;
  }
  function lock(on) { var c = P.el && $('.lvctl'); if (c) c.classList.toggle('wait', on); }
  function opts() { return (P.node.opts || []).filter(function (o) { return !o.when || o.when(P.S); }); }
  function withKey(o) { var k = P.node.opts.indexOf(o); var e = {}; Object.keys(o).forEach(function (x) { e[x] = o[x]; }); e.audio = P.nid + '-o' + k; return e; }
  function choose(j) { if (P.busy) return; var o = opts()[j]; if (o) answer(withKey(o)); }

  function onTap(e) {
    if (P.busy) return; var svg = e.currentTarget, p = svgPt(svg, e), n = P.node; if (!p) return;
    if (n.kind === 'place') {
      if (P.placed) return;
      var bad = (n.danger || []).filter(function (z) { var c = zoneXY(z); return c && dist(p, c) < (z.r || 40); })[0];
      if (bad) { ripple(svg, p, 'bad'); P.S.hist.push({ id: P.nid, say: bad.say, warn: 1 }); P.S.hist.push({ dec: 1, id: P.nid, t: 'A port at ' + bad.he, g: 'b', why: bad.why, refs: bad.refs, caught: 1 }); apply(bad.fx); draw(false); speak(P.nid + '-d' + n.danger.indexOf(bad)); return; }
      p.size = (n.sizes || [])[P.taps.length] || 5; P.taps.push(p);
      if (P.taps.length >= n.ports) gradePlace(); else draw(false);
      return;
    }
    if (n.kind === 'spot') {
      var tgt = spotXY(n.target), all = spots();
      var near = all.slice().sort(function (a, b) { return dist(p, [a.x, a.y]) - dist(p, [b.x, b.y]); })[0];
      var ok = tgt && dist(p, tgt) < (n.r || 50);
      ripple(svg, p, ok ? 'ok' : 'bad');
      P.S.st.focus = n.target;
      answer({ t: ok ? 'That’s ' + n.he : 'I pointed at ' + (near ? near.he : 'somewhere else'), g: ok ? 'g' : 'b', why: ok ? '' : n.why, refs: n.refs, fx: ok ? n.fxOk : n.fxBad, reply: ok ? n.ok : n.bad, audio: P.nid + (ok ? '-ok' : '-bad'), to: n.to });
      return;
    }
    if (n.kind === 'tap') {
      var hit = null, bestD = 1e9;
      (n.zones || []).forEach(function (z) { var c = zoneXY(z); if (!c) return; var d = dist(p, c); if (d < (z.r || 50) && d < bestD) { bestD = d; hit = z; } });
      var zj = n.zones.indexOf(hit), zk = zj >= 0 ? 'z' + zj : 'zm';
      hit = hit || n.miss;
      if (!hit) { ripple(svg, p, ''); P.S.hist.push({ id: P.nid, say: n.missSay || 'Not there. Look again and pick a spot.' }); draw(false); speak(n.missSay ? P.nid + '-ms' : 'gen-miss'); return; }
      ripple(svg, p, hit.g === 'g' ? 'ok' : hit.g === 'b' ? 'bad' : '');
      if (hit.stop && !P.S.f['warned_' + P.nid]) {
        P.S.f['warned_' + P.nid] = 1; P.S.hist.push({ id: P.nid, say: hit.stop, warn: 1 }); P.S.hist.push({ dec: 1, id: P.nid, t: 'Nearly into ' + hit.he, g: 'b', why: hit.why, refs: hit.refs, caught: 1 });
        apply(hit.fxWarn); P.S.st.focus = hit.spot || P.S.st.focus; draw(false); speak(P.nid + '-s' + zj); return;
      }
      answer({ t: 'Here: ' + hit.he, g: hit.g, why: hit.why, refs: hit.refs, fx: hit.fx, reply: hit.reply, audio: P.nid + '-' + zk, to: hit.to || n.to });
    }
  }
  function lmPt(q) {
    if (Array.isArray(q)) return q;
    var W = O.scenes && O.scenes.wall, lm = W && (W.landmarks ? W.landmarks(P.S.st) : W.lm), b = lm && lm[q.lm];
    return b ? [b[0] + (q.dx || 0), b[1] + (q.dy || 0)] : [0, 0];
  }
  function gradePlace() {
    var n = P.node, best = null;
    n.layouts.forEach(function (L0) {
      var L = { id: L0.id, he: L0.he, pts: L0.pts.map(lmPt) };
      var used = [], err = 0, ds = [];
      P.taps.forEach(function (p) {
        var bi = -1, bd = 1e9; L.pts.forEach(function (q, i) { if (used.indexOf(i) < 0) { var d = dist(p, q); if (d < bd) { bd = d; bi = i; } } });
        if (bi >= 0) used.push(bi); err += bd; ds.push(bd);
      });
      if (!best || err < best.err) best = { L: L, err: err, ds: ds };
    });
    var tol = n.tol || 55, L = best.L;
    P.taps.forEach(function (p, i) { var d = best.ds[i]; p.state = d < tol ? 'ok' : d < tol * 2 ? 'warn' : 'bad'; });
    var bad = P.taps.filter(function (p) { return p.state === 'bad'; }).length, warn = P.taps.filter(function (p) { return p.state === 'warn'; }).length;
    var g = bad ? 'b' : warn ? 'o' : 'g';
    P.placed = { zones: L.pts.map(function (q) { return { x: q[0], y: q[1], r: tol * .6, kind: 'ideal', he: '' }; }) };
    var t = 'I placed ' + P.taps.length + (P.taps.length === 1 ? ' port' : ' ports') + (L.he && g !== 'b' ? ' (' + L.he + ')' : '');
    answer({ t: t, g: g, why: g === 'g' ? '' : n.why, refs: n.refs, fx: (n.fx || {})[g], reply: (n.reply || {})[g], audio: P.nid + '-' + g, to: n.to });
  }
  function checkDone() {
    var n = P.node, got = $$('.simq.multi .simo[aria-pressed="true"]').map(function (b) { return +b.dataset.j; });
    var miss = n.items.filter(function (it, j) { return it.need && got.indexOf(j) < 0; });
    var extra = n.items.filter(function (it, j) { return it.no && got.indexOf(j) >= 0; });
    var g = miss.length ? 'b' : extra.length ? 'o' : 'g';
    var said = miss.length ? miss : extra;
    var reply = said.length ? said.map(function (m) { return m.miss; }).join(' ') : pick(n.ok);
    var keys = said.length ? said.map(function (m) { return P.nid + '-m' + n.items.indexOf(m); }) : [P.nid + '-ok'];
    answer({ t: got.length ? got.map(function (j) { return n.items[j].t; }).join(' · ') : 'I didn’t mark anything', g: g, why: miss.length ? 'Missing: ' + miss.map(function (m) { return m.t; }).join(', ') : '', refs: n.refs, fx: (n.fx || {})[g], reply: reply, audio: keys, to: n.to });
  }
  function gearPick(id) {
    var n = P.node, ok = id === n.need, alt = (n.alt || []).indexOf(id) >= 0, e = O.equipList.filter(function (x) { return x.id === id; })[0];
    answer({ t: 'I asked for ' + (e ? e.n : id), g: ok ? 'g' : alt ? 'o' : 'b', why: ok ? '' : n.why, refs: n.refs, fx: ok ? n.fxOk : n.fxBad, reply: ok ? n.ok : alt ? (n.altReply || n.ok) : n.bad, audio: P.nid + (ok ? '-ok' : alt ? (n.altReply ? '-alt' : '-ok') : '-bad'), to: n.to });
  }

  /* ---------- free text and voice in ---------- */
  function norm(s) { return String(s).toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim(); }
  /* English: drop common endings so 'clipping', 'clipped' and 'clips' all meet 'clip' */
  function stem(w) { return w.length > 4 ? w.replace(/(ing|ed|es|s)$/, '') : w.length > 3 ? w.replace(/s$/, '') : w; }
  var STOP = ' the a an and or of to in on at for with by is it its im id ill we well lets let you your my me this that then just do go so be are was will would should can i ';
  function words(s) { return norm(s).split(' ').filter(function (w) { return w.length > 1 && STOP.indexOf(' ' + w + ' ') < 0; }).map(stem); }
  function freeText(txt) {
    if (P.busy || !txt.trim()) return;
    var n = P.node, list = opts();
    if (n.kind === 'gear') list = O.equipList.filter(function (e) { return n.pool.indexOf(e.id) >= 0; }).map(function (e) { return { t: e.n + ' ' + e.en, id: e.id, kw: e.kw }; });
    if (!list.length) return;
    var w = words(txt), sc = list.map(function (o, j) {
      var k = words(o.t).concat((o.kw || []).map(norm).map(stem)), s = 0;
      w.forEach(function (x) { if (k.indexOf(x) >= 0) s += x.length > 3 ? 2 : 1; else if (x.length > 2 && k.some(function (y) { return y.length > 3 && (y.indexOf(x) === 0 || x.indexOf(y) === 0); })) s += 1; });
      return { j: j, s: s };
    }).sort(function (a, b) { return b.s - a.s; });
    if (sc[0].s >= 2 && (!sc[1] || sc[0].s > sc[1].s)) {
      if (n.kind === 'gear') { gearPick(list[sc[0].j].id); return; }
      var o = withKey(list[sc[0].j]); o.t = txt; answer(o);
      return;
    }
    var top = sc.filter(function (x) { return x.s > 0; }).slice(0, 2);
    P.S.hist.push({ id: P.nid, mine: txt });
    P.S.hist.push({ id: P.nid, say: top.length ? 'Sorry, I’m not sure I followed. Did you mean one of these?' : 'Say it another way, or pick one of the options.' });
    draw(false); speak(top.length ? 'gen-unclear' : 'gen-again');
    top.forEach(function (x) { var b = $('.simo[data-j="' + x.j + '"]'); if (b) b.classList.add('hint'); });
  }
  var REC = window.SpeechRecognition || window.webkitSpeechRecognition;
  function listen(btn) {
    if (!REC || P.busy) return; var r = new REC(); r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 1;
    btn.classList.add('rec'); stopVoice();
    r.onresult = function (e) { var t = e.results[0][0].transcript; var inp = $('#lvin'); if (inp) inp.value = t; freeText(t); };
    r.onend = r.onerror = function () { btn.classList.remove('rec'); };
    try { r.start(); } catch (e) { btn.classList.remove('rec'); }
  }

  /* ---------- drawing ---------- */
  function hud() {
    var v = vitals(), s = safety();
    return '<div class="lvmon" aria-label="Monitor"><span class="hr"><i class="beat" style="animation-duration:' + (60 / v.hr).toFixed(2) + 's">♥</i>' + v.hr + '</span><span class="bp">' + v.sys + '/' + v.dia + '</span><span class="sat">SpO₂ ' + v.sat + '</span><span class="co2">EtCO₂ ' + v.co2 + '</span><span class="tm">⏱ ' + P.S.t + '′</span>' +
      '<span class="sf" title="Safety score">🛡 <i class="lvm ' + (s < 50 ? 'red' : s < 75 ? 'amber' : '') + '"><b style="width:' + s + '%"></b></i></span></div>';
  }
  function av() { return '<i class="av">' + esc(P.c.mentor.init) + '</i>'; }
  function chat() {
    return P.S.hist.map(function (x) {
      if (x.dec) return '';
      if (x.say) return '<div class="lvco' + (x.warn ? ' warn' : '') + '">' + av() + '<p>' + esc(x.say) + '</p></div>';
      if (x.mine) return '<div class="lvme"><p>' + esc(x.mine) + '</p></div>';
      if (x.ev) return '<div class="lvev">' + esc(x.ev) + '</div>';
      if (x.ans) return '<div class="lvme g-' + (x.g || 'n') + '"><p>' + esc(x.ans) + '</p>' + (x.why && x.g === 'b' ? '<small>' + esc(x.why) + '</small>' : '') + '</div>';
      return '';
    }).join('');
  }
  function tip() {
    var t = P.node.tip && P.node.tip[P.S.role]; if (!t) return '';
    var lbl = { nurse: 'For the nurse', stu: 'For students', senior: 'For teaching', res: 'Tip' }[P.S.role] || 'Tip';
    return '<div class="lvtip"><b>' + lbl + '</b> ' + esc(val(t)) + '</div>';
  }
  function controls() {
    var n = P.node, k = n.kind || 'choice';
    if (n.end) return debrief();
    if (k === 'cases') return casePicker();
    if (k === 'info') return '<div class="simq"><button class="btn pri" id="lvnext">' + esc(n.btn || 'Continue') + '</button></div>';
    if (k === 'check') return '<div class="simq multi">' + n.items.map(function (it, j) { return '<button class="simo" data-j="' + j + '" aria-pressed="false">' + esc(it.t) + '</button>'; }).join('') + '<button class="btn pri" id="lvchk">' + esc(n.btn || 'That’s what we’ll do') + '</button></div>';
    if (k === 'place') return '<div class="lvhint">Tap the abdominal wall where each port goes · <b>' + P.taps.length + '/' + n.ports + '</b>' + (P.taps.length && !P.placed ? ' <button class="btn sm" id="lvundo">Undo last</button>' : '') + '</div>';
    if (k === 'spot') return '<div class="lvhint">Tap the picture: <b>' + esc(n.he) + '</b></div>';
    if (k === 'tap') return '<div class="lvhint">' + esc(n.hint || 'Tap the picture where you’d start') + '</div>';
    if (k === 'gear') return '<div class="lvtray">' + O.equipList.filter(function (e) { return n.pool.indexOf(e.id) >= 0; }).map(function (e) { return '<button class="lveq" data-eq="' + e.id + '">' + O.eqSvg(e) + '<span>' + esc(e.n) + '</span></button>'; }).join('') + '</div>' + freeBox();
    return '<div class="simq">' + opts().map(function (o, j) { return '<button class="simo" data-j="' + j + '"><kbd>' + (j + 1) + '</kbd>' + esc(o.t) + '</button>'; }).join('') + '</div>' + freeBox();
  }
  function freeBox() {
    return '<form class="lvfree" id="lvform"><input id="lvin" autocomplete="off" placeholder="Or answer in your own words…" aria-label="Free answer">' + (REC ? '<button type="button" class="lvmic" id="lvmic" aria-label="Answer by voice">🎙</button>' : '') + '<button class="lvsend" aria-label="Send">↵</button></form>';
  }
  function casePicker() {
    return '<div class="lvcases">' + P.c.cases.map(function (c, j) { return '<button class="lvcase" data-c="' + j + '"><b>' + esc(c.he) + '</b><span>' + esc(c.story) + '</span>' + (c.lvl ? '<em>' + esc(c.lvl) + '</em>' : '') + '</button>'; }).join('') +
      '<button class="lvcase rnd" data-c="r"><b>Random case</b><span>You don’t know what’s waiting inside, just like real life.</span></button></div>';
  }
  function draw(typing) {
    var n = P.node;
    P.el.innerHTML = '<div class="simbar"><button class="simx" aria-label="Close">✕</button><div class="lvwho">' + av() + '<span><b>' + esc(P.c.mentor.name) + '</b><small>' + esc(P.c.mentor.role) + '</small></span><i class="wave"><b></b><b></b><b></b><b></b></i></div>' + hud() +
      '<button class="simv" aria-pressed="' + P.voice + '" aria-label="Voice">' + (P.voice ? '🔊' : '🔇') + '</button></div>' +
      '<div class="lvmain"><div class="lvvis" id="lvvis"></div><div class="lvside"><div class="lvcase-t">' + esc(P.c.title) + (P.S.cs.he ? ' · ' + esc(P.S.cs.he) : '') + '</div><div class="lvchat" id="lvchat">' + chat() + '</div>' + tip() + '<div class="lvctl">' + controls() + '</div>' + (n.refs && !n.end ? O.refList(n.refs) : '') + '</div></div>';
    paint(); wire();
    var ch = $('#lvchat'); ch.scrollTop = ch.scrollHeight;
    if (typing) {
      var msgs = ch.querySelectorAll('.lvco'), lastSay = msgs[msgs.length - 1];
      if (!lastSay) return;
      var dots = document.createElement('div'); dots.className = 'lvco typing'; dots.innerHTML = av() + '<p><b></b><b></b><b></b></p>';
      lastSay.style.display = 'none'; ch.appendChild(dots); ch.scrollTop = ch.scrollHeight;
      P.busy = true; lock(true);
      setTimeout(function () { if (dots.parentNode) dots.parentNode.removeChild(dots); lastSay.style.display = ''; lastSay.classList.add('pop'); P.busy = false; lock(false); ch.scrollTop = ch.scrollHeight; }, 700 * (O.liveSpeed || 1));
    }
  }
  function wire() {
    var n = P.node, x;
    $('.simx').onclick = close;
    $('.simv').onclick = function () { P.voice = !P.voice; try { localStorage.setItem('orbit_live_voice', P.voice ? '1' : '0'); } catch (e) {} if (!P.voice) stopVoice(); var b = $('.simv'); b.setAttribute('aria-pressed', P.voice); b.textContent = P.voice ? '🔊' : '🔇'; };
    $$('.simq:not(.multi) .simo').forEach(function (b) { b.onclick = function () { choose(+b.dataset.j); }; });
    $$('.simq.multi .simo').forEach(function (b) { b.onclick = function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); }; });
    if ((x = $('#lvchk'))) x.onclick = function () { if (!P.busy) checkDone(); };
    if ((x = $('#lvnext'))) x.onclick = function () { if (!P.busy) go(n.to); };
    if ((x = $('#lvundo'))) x.onclick = function () { P.taps.pop(); draw(false); };
    if ((x = $('#lvagain'))) x.onclick = function () { start(); };
    $$('.lveq').forEach(function (b) { b.onclick = function () { if (!P.busy) gearPick(b.dataset.eq); }; });
    $$('.lvcase').forEach(function (b) { b.onclick = function () { var j = b.dataset.c; begin(j === 'r' ? P.c.cases[Math.floor(Math.random() * P.c.cases.length)] : P.c.cases[+j], j === 'r'); }; });
    if ((x = $('#lvform'))) x.onsubmit = function (e) { e.preventDefault(); freeText($('#lvin').value); };
    if ((x = $('#lvmic'))) { var mic = x; mic.onclick = function () { listen(mic); }; }
  }

  /* ---------- debrief ---------- */
  function saveHist() {
    try {
      var S = P.S, out = P.c.outcome ? P.c.outcome(S) : { he: 'End of case' }, dec = S.hist.filter(function (x) { return x.dec; });
      var H = JSON.parse(localStorage.getItem('orbit_live_hist') || '[]');
      H.push({ id: P.id, title: P.c.title + (S.cs.he ? ' · ' + S.cs.he : ''), out: out.he, good: dec.filter(function (x) { return x.g === 'g'; }).length, total: dec.length, at: Date.now() });
      localStorage.setItem('orbit_live_hist', JSON.stringify(H.slice(-30)));
    } catch (e) { /* storage unavailable */ }
  }
  function debrief() {
    var S = P.S, out = P.c.outcome ? P.c.outcome(S) : { he: 'End of case', tone: 'ok' };
    var dec = S.hist.filter(function (x) { return x.dec; }), good = dec.filter(function (x) { return x.g === 'g'; }).length;
    var bad = dec.filter(function (x) { return x.g === 'b'; }), luck = S.hist.filter(function (x) { return x.luck; });
    var refs = []; dec.forEach(function (x) { (x.refs || []).forEach(function (r) { if (refs.indexOf(r) < 0) refs.push(r); }); });
    var talk = P.c.closing ? P.c.closing(S, out) : '';
    return '<div class="lvdeb ' + (out.tone || '') + '"><div class="kick">Debrief with ' + esc(P.c.mentor.name) + '</div><h2>' + esc(out.he) + '</h2>' + (talk ? '<p class="lvsum">' + esc(talk) + '</p>' : '') +
      '<div class="lvstats"><div><b>' + good + '/' + dec.length + '</b><span>Recommended decisions</span></div><div><b>' + S.t + '′</b><span>Operating time</span></div><div><b>' + safety() + '</b><span>Safety score</span></div></div>' +
      (bad.length ? '<h3>What to take from this case</h3><ul class="dots">' + bad.map(function (x) { return '<li><b>' + esc(x.t) + (x.caught ? ' (I stopped you)' : '') + '</b>' + (x.why ? ' · ' + esc(x.why) : '') + '</li>'; }).join('') + '</ul>' : '<p>Every critical decision was the right one.</p>') +
      (luck.length ? '<h3>Where you got lucky</h3><ul class="dots">' + luck.map(function (x) { return '<li>' + esc(x.luck) + '</li>'; }).join('') + '</ul>' : '') +
      (refs.length ? O.refList(refs.sort(function (a, b) { return a - b; })) : '') +
      '<div class="lvbtns"><button class="btn pri" id="lvagain">Another case</button><a class="btn" href="#/p/' + esc(P.c.proc || P.id) + '">This procedure in the atlas</a><a class="btn" href="#/skills">Skills Lab</a></div></div>';
  }

  /* ---------- open and close ---------- */
  function begin(cs) { P.S = fresh(cs); go(P.c.start); }
  function start() { P.S = fresh({}); P.taps = []; P.placed = null; P.lastLayer = null; P.nid = 'pick'; P.lastView = null; P.node = { kind: 'cases', view: 'mentor:corridor' }; P.S.hist.push({ id: 'pick', say: pick(P.c.hello) }); draw(true); speak('hello'); }
  function close() { O.liveClose(); if (location.hash.indexOf('#/live/') === 0) location.hash = '#/p/' + (P.c.proc || P.id); }
  /* for tools/live-play.js: drives cases end to end */
  O.liveDbg = { P: function () { return P; }, zoneXY: zoneXY, spotXY: spotXY, lmPt: lmPt };
  O.liveClose = function () { if (!P.el || P.el.hidden) return; stopVoice(); P.el.hidden = true; P.el.innerHTML = ''; document.body.style.overflow = ''; };
  document.addEventListener('keydown', function (e) {
    if (!P.el || P.el.hidden || !P.node) return;
    if (e.key === 'Escape') close();
    else if (/^[1-6]$/.test(e.key) && !(document.activeElement && document.activeElement.id === 'lvin') && (!P.node.kind || P.node.kind === 'choice')) choose(+e.key - 1);
  });
  setInterval(function () { if (P.el && !P.el.hidden && P.S) { var m = P.el.querySelector('.lvmon'); if (m) m.outerHTML = hud(); } }, 2500);
  O.liveOpen = function (id) {
    if (!O.live[id]) return false;
    P.el = document.getElementById('live');
    if (!P.el) { P.el = document.createElement('div'); P.el.id = 'live'; P.el.className = 'sim live'; P.el.setAttribute('role', 'dialog'); P.el.setAttribute('aria-label', 'Live case'); document.body.appendChild(P.el); }
    P.el.hidden = false; document.body.style.overflow = 'hidden'; P.id = id; P.c = O.live[id]; start();
    return true;
  };
})();
