/* ORBIT scene: the hepatocystic field in laparoscopic cholecystectomy.
   One painted 2D vector scene whose anatomy changes with the case state (retraction, dissection,
   clips, bed, bleeding, bile, injuries, variants, inflammation, ICG and cholangiogram modes).
   Camera at the umbilicus: liver on top, patient's right on the viewer's LEFT (fundus top-left,
   CBD running down on the right toward the duodenum at the bottom right). viewBox 0 0 960 600.
   Original drawing, built from geometry in code. No patient material. */
(function () {
  'use strict';
  var O = window.ORBIT = window.ORBIT || {};
  O.scenes = O.scenes || {};
  var uid = 0;

  /* ---------------- math helpers ---------------- */
  function r1(x) { return Math.round(x * 10) / 10; }
  function cl(x, a, b) { return x < a ? a : x > b ? b : x; }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function lp(p, q, k) { return [lerp(p[0], q[0], k), lerp(p[1], q[1], k)]; }
  function lps(A, B, k) { var o = []; for (var i = 0; i < A.length; i++) o.push(lp(A[i], B[i], k)); return o; }
  function sm(x) { x = cl(x, 0, 1); return x * x * (3 - 2 * x); }
  function P(p) { return r1(p[0]) + ' ' + r1(p[1]); }
  function add(p, q, k) { k = k == null ? 1 : k; return [p[0] + q[0] * k, p[1] + q[1] * k]; }
  function sub(p, q) { return [p[0] - q[0], p[1] - q[1]]; }
  function len(v) { return Math.sqrt(v[0] * v[0] + v[1] * v[1]); }
  function nz(v) { var l = len(v) || 1; return [v[0] / l, v[1] / l]; }
  function hx(c) { return [parseInt(c.substr(1, 2), 16), parseInt(c.substr(3, 2), 16), parseInt(c.substr(5, 2), 16)]; }
  function mixc(a, b, k) {
    var x = hx(a), y = hx(b), s = '#';
    for (var i = 0; i < 3; i++) { var v = Math.round(lerp(x[i], y[i], cl(k, 0, 1))).toString(16); s += v.length < 2 ? '0' + v : v; }
    return s;
  }
  /* pick from a table of colours by a fractional index */
  function ramp(tab, f) { f = cl(f, 0, tab.length - 1); var i = Math.floor(f); if (i >= tab.length - 1) return tab[tab.length - 1]; return mixc(tab[i], tab[i + 1], f - i); }
  function rng(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

  /* Catmull-Rom: dense points through control points */
  function cr(pts, n) {
    var out = [];
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || pts[i + 1];
      for (var j = 0; j < n; j++) {
        var t = j / n, t2 = t * t, t3 = t2 * t;
        out.push([
          .5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          .5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
        ]);
      }
    }
    out.push(pts[pts.length - 1]);
    return out;
  }
  /* smooth SVG path through points (Catmull-Rom as cubic Bezier) */
  function sp(pts, closed) {
    var n = pts.length; if (n < 2) return '';
    var d = 'M' + P(pts[0]), m = closed ? n : n - 1;
    for (var i = 0; i < m; i++) {
      var p0 = closed ? pts[(i - 1 + n) % n] : pts[Math.max(i - 1, 0)], p1 = pts[i % n], p2 = pts[(i + 1) % n], p3 = closed ? pts[(i + 2) % n] : pts[Math.min(i + 2, n - 1)];
      d += 'C' + P([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]) + ' ' + P([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]) + ' ' + P(p2);
    }
    return d + (closed ? 'Z' : '');
  }
  function poly(pts) { var d = 'M' + P(pts[0]); for (var i = 1; i < pts.length; i++) d += 'L' + P(pts[i]); return d + 'Z'; }
  function normals(c) {
    var o = [];
    for (var i = 0; i < c.length; i++) { var a = c[Math.max(i - 1, 0)], b = c[Math.min(i + 1, c.length - 1)], t = nz(sub(b, a)); o.push([-t[1], t[0]]); }
    return o;
  }
  /* cumulative arc length, normalised */
  function arcs(c) { var s = [0], L = 0; for (var i = 1; i < c.length; i++) { L += len(sub(c[i], c[i - 1])); s.push(L); } for (i = 0; i < s.length; i++) s[i] = L ? s[i] / L : 0; s.L = L; return s; }
  function off(c, nr, d) { var o = []; for (var i = 0; i < c.length; i++) o.push(add(c[i], nr[i], typeof d === 'function' ? d(i) : d)); return o; }
  function slice(c, a, b) { var s = arcs(c), o = []; for (var i = 0; i < c.length; i++) if (s[i] >= a && s[i] <= b) o.push(c[i]); if (o.length < 2) o = [at(c, a), at(c, b)]; else { if (s[0] < a) o.unshift(at(c, a)); o.push(at(c, b)); } return dedupe(o); }
  function dedupe(o) { var r = [o[0]]; for (var i = 1; i < o.length; i++) if (len(sub(o[i], r[r.length - 1])) > .5) r.push(o[i]); return r; }
  function at(c, k) { var s = arcs(c); for (var i = 1; i < c.length; i++) if (s[i] >= k) { var f = (k - s[i - 1]) / ((s[i] - s[i - 1]) || 1); return lp(c[i - 1], c[i], f); } return c[c.length - 1]; }
  function dirAt(c, k) { var a = at(c, Math.max(k - .02, 0)), b = at(c, Math.min(k + .02, 1)); return nz(sub(b, a)); }
  function every(a, n) { var o = []; for (var i = 0; i < a.length; i += n) o.push(a[i]); if (o[o.length - 1] !== a[a.length - 1]) o.push(a[a.length - 1]); return o; }
  function inPoly(p, vs) { var x = p[0], y = p[1], ins = false; for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) { var xi = vs[i][0], yi = vs[i][1], xj = vs[j][0], yj = vs[j][1]; if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) ins = !ins; } return ins; }

  /* ---------------- state ---------------- */
  var RET = { none: [0, 0], good: [1, 1], bad: [1, -1] };
  function norm(st) {
    st = st || {};
    var r = RET[st.retract] || RET.none;
    var v = { variant: st.variant || 'normal', mode: st.mode || 'lap' };
    v.fu = st.fu != null ? st.fu : r[0];
    v.hm = st.hm != null ? st.hm : r[1];
    v.inflam = cl(+st.inflam || 0, 0, 3);
    if (v.variant === 'mirizzi') v.inflam = Math.max(v.inflam, 2);
    v.peel = cl(+st.peel || 0, 0, 3);
    v.bed = cl(+st.bed || 0, 0, 1);
    v.adh = !!st.adhesions;
    v.clips = !!st.clips; v.cut = !!st.cut;
    v.bleed = +st.bleed || 0; v.bile = !!st.bile; v.injury = st.injury || null; v.stones = !!st.stones;
    v.cbdStone = !!st.cbdStone; v.rouv = !!st.rouviere; v.labels = st.labels === 'all' ? 'all' : !!st.labels; v.focus = st.focus || null;
    v.id = st.id || ('chx' + (++uid));
    v.still = !!st.still;
    return v;
  }

  /* ---------------- geometry ---------------- */
  /* control points per retraction: GB spine (fundus..neck) and cystic duct (neck..junction) */
  var G = {
    none: { gb: [[322, 418], [392, 378], [452, 336], [506, 300], [548, 286]], cd: [[562, 292], [604, 320], [642, 354], [680, 390]] },
    good: { gb: [[236, 132], [316, 194], [390, 262], [436, 322], [486, 336]], cd: [[500, 326], [562, 341], [624, 358], [680, 390]] },
    bad: { gb: [[262, 92], [392, 136], [506, 182], [588, 226], [630, 266]], cd: [[640, 282], [656, 322], [668, 362], [681, 404]] }
  };
  var CBD = [[700, 236], [692, 300], [686, 390], [698, 458], [718, 520]];
  var LIV = [[-60, 500], [100, 506], [236, 486], [334, 456], [424, 410], [484, 352], [534, 298], [604, 262], [690, 238], [744, 272], [790, 330], [846, 370], [904, 382], [1000, 372]];
  var HDL = [[560, 400], [640, 372], [680, 300], [700, 246], [744, 278], [790, 338], [846, 378], [904, 390], [1010, 380], [1010, 480], [820, 500], [640, 520], [540, 480]];
  var EDGE = [[-60, 236], [80, 196], [220, 160], [380, 128], [560, 108], [760, 98], [1000, 84]];
  var FLAP = [[-20, 468], [150, 470], [262, 442], [330, 398], [430, 386], [560, 394], [680, 380], [790, 358], [890, 330], [980, 318]];

  function geo(v) {
    var A = G.none, B = lerpSet(G.bad, G.good, (v.hm + 1) / 2);
    var g = lerpSet(A, B, sm(v.fu));
    var gb = g.gb.map(function (p) { return p.slice(); }), cd = g.cd.map(function (p) { return p.slice(); });
    var J = cd[cd.length - 1];
    if (v.variant === 'short' || v.variant === 'mirizzi') {
      var k = v.variant === 'short' ? .5 : .62, dlt = sub(J, cd[0]);
      var w = [.08, .25, .55, .85, 1];
      for (var i = 0; i < gb.length; i++) gb[i] = add(gb[i], dlt, k * w[i]);
      for (i = 0; i < cd.length - 1; i++) cd[i] = lp(cd[i], J, k * (1 - i / (cd.length - 1)) + (i ? k * .3 : 0));
      cd[0] = add(gb[4], nz(sub(J, gb[4])), 14);
      cd[1] = lp(cd[0], J, .4); cd[2] = lp(cd[0], J, .72);
      cd[2][1] += 6;
    }
    var o = { gb: gb, cd: cd, J: J };
    o.cbd = CBD.map(function (p) { return p.slice(); });
    o.cbd[2] = [J[0] + 6, J[1] + 2];
    if (v.adh) o.cbd[4] = [712, 490];
    return o;
  }
  function lerpSet(a, b, k) { return { gb: lps(a.gb, b.gb, k), cd: lps(a.cd, b.cd, k) }; }

  /* gallbladder outline: spine with a widths profile, round fundus, Hartmann bulge toward the
     inferolateral side (n side), a neck that tapers into the cystic duct. */
  function gbShape(v, gs, detach, D) {
    var c = cr(gs, 12), s = arcs(c), Lg = s.L, nr = normals(c);
    var sw = 1 + .1 * v.inflam, mir = v.variant === 'mirizzi' ? 1 : 0;
    var R0 = 62 * sw, cap = Math.min(R0 / Lg, .2);
    var Ln = [], Rn = [], C = [], W = [];
    for (var i = 0; i < c.length; i++) {
      var t = s[i], w;
      if (t < cap) { var u = (cap - t) / cap; w = R0 * Math.sqrt(Math.max(0, 1 - u * u)); }
      else if (t < .36) w = lerp(R0, R0 * 1.04, sm((t - cap) / (.36 - cap)));
      else if (t < .7) w = lerp(R0 * 1.04, R0 * .62, sm((t - .36) / .34));
      else if (t < .86) w = lerp(R0 * .62, R0 * .5, sm((t - .7) / .16));
      else w = lerp(R0 * .5, 9 + 2 * v.inflam, sm((t - .86) / .14));
      var bump = Math.exp(-Math.pow((t - .79) / .07, 2));
      var wn = w * (1 + (.55 + .35 * mir) * bump), wp = w * (1 - .1 * bump);
      var dd = detach > 0 ? D * sm((t - (1 - detach)) / .22) : 0;
      var cc = add(c[i], nr[i], dd);
      C.push(cc); W.push(w);
      Ln.push(add(cc, nr[i], wn)); Rn.push(add(cc, nr[i], -wp));
    }
    var out = every(Ln, 2).slice(1).concat(every(Rn, 2).reverse());
    return { d: sp(out, true), c: C, c0: c, nr: nr, s: s, L: Lg, Ln: Ln, Rn: Rn, W: W, R0: R0 };
  }

  /* ---------------- painting helpers ---------------- */
  function tubeStroke(pts, w, col, o) {
    o = o || {};
    var c = cr(pts, 10), nr = normals(c), d = sp(every(c, 2)), s = '';
    var cap = o.cap || 'round';
    if (!o.noShadow) s += '<path d="' + d + '" fill="none" stroke="#000" stroke-opacity=".38" stroke-width="' + r1(w + 7) + '" stroke-linecap="' + cap + '" transform="translate(3 5)" filter="url(#' + o.id + '-b4)"/>';
    s += '<path d="' + d + '" fill="none" stroke="' + col[0] + '" stroke-width="' + r1(w + 2.4) + '" stroke-linecap="' + cap + '"/>' +
      '<path d="' + d + '" fill="none" stroke="' + col[1] + '" stroke-width="' + r1(w) + '" stroke-linecap="' + cap + '"/>' +
      '<path d="' + sp(every(off(c, nr, -w * .12), 2)) + '" fill="none" stroke="' + col[2] + '" stroke-width="' + r1(w * .52) + '" stroke-linecap="' + cap + '" stroke-opacity=".9"/>' +
      '<path d="' + sp(every(off(c, nr, w * .3), 2)) + '" fill="none" stroke="#000" stroke-opacity=".16" stroke-width="' + r1(w * .22) + '" stroke-linecap="' + cap + '"/>' +
      '<path class="' + (o.hlCls || '') + '" d="' + sp(every(off(c, nr, -w * .24), 2)) + '" fill="none" stroke="#fff" stroke-opacity="' + (o.spec || .75) + '" stroke-width="' + r1(Math.max(1.1, w * .13)) + '" stroke-linecap="round" stroke-dasharray="' + (o.dash || 'none') + '"/>';
    return s;
  }
  /* lobulated fat inside a polygon */
  function fat(id, polyPts, seed, n, rMin, rMax, keep, tone) {
    var R = rng(seed), xs = polyPts.map(function (p) { return p[0]; }), ys = polyPts.map(function (p) { return p[1]; });
    var x0 = Math.min.apply(0, xs), x1 = Math.max.apply(0, xs), y0 = Math.min.apply(0, ys), y1 = Math.max.apply(0, ys);
    var L = [], tries = 0;
    while (L.length < n && tries < n * 6) {
      tries++;
      var p = [lerp(x0, x1, R()), lerp(y0, y1, R())], rr = lerp(rMin, rMax, R()), a = R() * 180, e = .65 + R() * .35;
      if (!inPoly(p, polyPts)) continue;
      if (keep && !keep(p, R)) continue;
      L.push([p, rr, a, e]);
    }
    L.sort(function (a, b) { return a[0][1] - b[0][1]; });
    var g = tone === 'pale' ? id + '-fatp' : id + '-fat', s = '';
    for (var i = 0; i < L.length; i++) {
      var q = L[i];
      s += '<ellipse cx="' + r1(q[0][0]) + '" cy="' + r1(q[0][1]) + '" rx="' + r1(q[1]) + '" ry="' + r1(q[1] * q[3]) + '" transform="rotate(' + r1(q[2]) + ' ' + P(q[0]) + ')" fill="url(#' + g + ')" stroke="#8A5A18" stroke-opacity=".16" stroke-width=".6"/>';
      if (q[1] > rMin * 1.5 && (i % 3 === 0)) s += '<ellipse cx="' + r1(q[0][0] - q[1] * .3) + '" cy="' + r1(q[0][1] - q[1] * .35) + '" rx="' + r1(q[1] * .22) + '" ry="' + r1(q[1] * .09) + '" transform="rotate(-20 ' + P(q[0]) + ')" fill="#FFFBEA" fill-opacity=".6"/>';
    }
    return s;
  }
  function spec(pts, w, op, id) { return '<path d="' + sp(pts) + '" fill="none" stroke="#fff" stroke-opacity="' + op + '" stroke-width="' + w + '" stroke-linecap="round" filter="url(#' + id + '-b1)"/>'; }
  function clipBar(p, dir, Lc, id, big) {
    var a = Math.atan2(dir[1], dir[0]) * 180 / Math.PI + 90, h = big ? 7 : 6;
    return '<g transform="translate(' + P(p) + ') rotate(' + r1(a) + ')">' +
      '<rect x="' + r1(-Lc / 2 + 2) + '" y="' + r1(-h / 2 + 3) + '" width="' + Lc + '" height="' + h + '" rx="2.6" fill="#000" opacity=".35" filter="url(#' + id + '-b1)"/>' +
      '<rect x="' + r1(-Lc / 2) + '" y="' + r1(-h / 2) + '" width="' + Lc + '" height="' + h + '" rx="2.6" fill="url(#' + id + '-mt)" stroke="#3C454C" stroke-width=".7"/>' +
      '<path d="M' + r1(-Lc / 2 + 2) + ' ' + r1(-h / 2 + 1.4) + ' H' + r1(Lc / 2 - 2) + '" stroke="#fff" stroke-width="1.1" stroke-opacity=".85"/>' +
      '<path d="M' + r1(-Lc / 2 + 1.5) + ' 0 H' + r1(Lc / 2 - 1.5) + '" stroke="#5A646C" stroke-width=".6" stroke-dasharray="2 2"/></g>';
  }
  function lbl(x, y, t, anchor, sz) {
    return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + ({ start: 'end', end: 'start' }[anchor] || anchor || 'middle') + '" font-family="Inter, Arial, sans-serif" font-size="' + (sz || 17) + '" font-weight="600" fill="#F4F8FA" stroke="#06121C" stroke-opacity=".78" stroke-width="4.2" stroke-linejoin="round" paint-order="stroke">' + t + '</text>';
  }

  /* ---------------- defs ---------------- */
  function defs(id, v) {
    var gbT = [['#D2D8D2', '#97A49E', '#5F6B67', '#2C3533'], ['#D9CBC2', '#A6918C', '#735E62', '#47373B'], ['#BE6E66', '#933E42', '#622232', '#300E18'], ['#A0645E', '#73343A', '#4A1C28', '#240C14']];
    var f = v.inflam, gs = [0, 1, 2, 3].map(function (j) { return ramp(gbT.map(function (r) { return r[j]; }), f); });
    var fu = 'filterUnits="userSpaceOnUse" x="-40" y="-40" width="1040" height="680"';
    return '<defs>' +
      '<radialGradient id="' + id + '-bg" cx="52%" cy="46%" r="70%"><stop offset="0" stop-color="#4A1C14"/><stop offset=".6" stop-color="#2A0E0A"/><stop offset="1" stop-color="#110504"/></radialGradient>' +
      '<radialGradient id="' + id + '-liv" gradientUnits="userSpaceOnUse" cx="560" cy="330" r="560" fx="560" fy="320"><stop offset="0" stop-color="#A64A3C"/><stop offset=".3" stop-color="#8A3529"/><stop offset=".6" stop-color="#65231B"/><stop offset=".85" stop-color="#421410"/><stop offset="1" stop-color="#2A0C09"/></radialGradient>' +
      '<linearGradient id="' + id + '-dia" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="200"><stop offset="0" stop-color="#5A1E18"/><stop offset=".55" stop-color="#94402F"/><stop offset=".9" stop-color="#B65A47"/><stop offset="1" stop-color="#C46A55"/></linearGradient>' +
      '<linearGradient id="' + id + '-livE" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".78" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#1A0503" stop-opacity=".55"/></linearGradient>' +
      '<radialGradient id="' + id + '-flap" gradientUnits="userSpaceOnUse" cx="520" cy="330" r="560"><stop offset="0" stop-color="#B3584A"/><stop offset=".45" stop-color="#8D3A2F"/><stop offset=".85" stop-color="#5A1F19"/><stop offset="1" stop-color="#36110D"/></radialGradient>' +
      '<radialGradient id="' + id + '-gb" cx="38%" cy="34%" r="72%"><stop offset="0" stop-color="' + gs[0] + '"/><stop offset=".45" stop-color="' + gs[1] + '"/><stop offset=".82" stop-color="' + gs[2] + '"/><stop offset="1" stop-color="' + gs[3] + '"/></radialGradient>' +
      '<radialGradient id="' + id + '-fat" cx="40%" cy="36%" r="68%"><stop offset="0" stop-color="#F6DE8E"/><stop offset=".6" stop-color="#E3BC5E"/><stop offset="1" stop-color="#C39440"/></radialGradient>' +
      '<radialGradient id="' + id + '-fatp" cx="40%" cy="36%" r="68%"><stop offset="0" stop-color="#EBD2A8"/><stop offset=".65" stop-color="#DDBC8A"/><stop offset="1" stop-color="#C9A06C"/></radialGradient>' +
      '<radialGradient id="' + id + '-floor" gradientUnits="userSpaceOnUse" cx="600" cy="320" r="120"><stop offset="0" stop-color="#7E2E26"/><stop offset=".7" stop-color="#4E1915"/><stop offset="1" stop-color="#2C0D0A"/></radialGradient>' +
      '<linearGradient id="' + id + '-plate" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EBD6C6"/><stop offset=".5" stop-color="#D7B4A0"/><stop offset="1" stop-color="#B98A78"/></linearGradient>' +
      '<linearGradient id="' + id + '-du" gradientUnits="userSpaceOnUse" x1="0" y1="420" x2="0" y2="600"><stop offset="0" stop-color="#E2AE96"/><stop offset=".4" stop-color="#C98A72"/><stop offset=".8" stop-color="#8E5040"/><stop offset="1" stop-color="#5E2E24"/></linearGradient>' +
      '<linearGradient id="' + id + '-co" gradientUnits="userSpaceOnUse" x1="0" y1="470" x2="0" y2="610"><stop offset="0" stop-color="#C79A80"/><stop offset="1" stop-color="#6A3C2C"/></linearGradient>' +
      '<radialGradient id="' + id + '-hdl" gradientUnits="userSpaceOnUse" cx="720" cy="420" r="260"><stop offset="0" stop-color="#D2A878"/><stop offset=".6" stop-color="#B48659"/><stop offset="1" stop-color="#6E4A30"/></radialGradient>' +
      '<linearGradient id="' + id + '-mt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAFCFD"/><stop offset=".35" stop-color="#C5CDD3"/><stop offset=".7" stop-color="#7E8A93"/><stop offset="1" stop-color="#4D575F"/></linearGradient>' +
      '<radialGradient id="' + id + '-bl" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#B0141A"/><stop offset=".6" stop-color="#78080D"/><stop offset="1" stop-color="#3E0306"/></radialGradient>' +
      '<radialGradient id="' + id + '-bi" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#D6C04A"/><stop offset=".6" stop-color="#9A9228"/><stop offset="1" stop-color="#5A5A14"/></radialGradient>' +
      '<radialGradient id="' + id + '-st" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#E8D49A"/><stop offset=".5" stop-color="#9C7A3E"/><stop offset="1" stop-color="#3E2A12"/></radialGradient>' +
      '<radialGradient id="' + id + '-vig" cx="50%" cy="50%" r="62%"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset=".86" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity=".96"/></radialGradient>' +
      '<radialGradient id="' + id + '-hot" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFF6EC" stop-opacity=".22"/><stop offset="1" stop-color="#FFF6EC" stop-opacity="0"/></radialGradient>' +
      '<pattern id="' + id + '-lob" width="26" height="22.5" patternUnits="userSpaceOnUse" patternTransform="rotate(18)"><path d="M6.5 0 L19.5 0 L26 11.25 L19.5 22.5 L6.5 22.5 L0 11.25 Z" fill="none" stroke="#2A0806" stroke-width=".9"/><circle cx="13" cy="11.25" r="1.3" fill="#2A0806"/></pattern>' +
      '<pattern id="' + id + '-lobL" width="26" height="22.5" patternUnits="userSpaceOnUse" patternTransform="rotate(18)"><path d="M7.5 1.5 L18.5 1.5" stroke="#FFD9CC" stroke-width=".8"/></pattern>' +
      '<filter id="' + id + '-b1" ' + fu + '><feGaussianBlur stdDeviation="1.2"/></filter>' +
      '<filter id="' + id + '-b2" ' + fu + '><feGaussianBlur stdDeviation="2.4"/></filter>' +
      '<filter id="' + id + '-b4" ' + fu + '><feGaussianBlur stdDeviation="4.5"/></filter>' +
      '<filter id="' + id + '-b10" ' + fu + '><feGaussianBlur stdDeviation="10"/></filter>' +
      '<filter id="' + id + '-b22" ' + fu + '><feGaussianBlur stdDeviation="22"/></filter>' +
      '<filter id="' + id + '-nir" ' + fu + '><feColorMatrix type="matrix" values=".13 .2 .05 0 .01  .13 .22 .05 0 .02  .15 .24 .07 0 .04  0 0 0 1 0"/></filter>' +
      '<filter id="' + id + '-glow" ' + fu + '><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '<filter id="' + id + '-xr" ' + fu + '><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  .6 .6 0 0 -.38" result="g"/><feComposite in="g" in2="SourceGraphic" operator="in" result="gn"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="gn"/></feMerge></filter>' +
      '</defs>';
  }
  var CSS = '<style>' +
    '.chx-br{animation:chxBr 5.2s ease-in-out infinite}' +
    '.chx-br2{animation:chxBr2 5.2s ease-in-out infinite}' +
    '@keyframes chxBr{0%,100%{transform:translate(0,0)}50%{transform:translate(-.6px,-3.2px)}}' +
    '@keyframes chxBr2{0%,100%{transform:translate(0,0)}50%{transform:translate(0,-1.2px)}}' +
    '.chx-pu{animation:chxPu .86s ease-out infinite}' +
    '@keyframes chxPu{0%{opacity:.25}14%{opacity:1}60%{opacity:.35}100%{opacity:.25}}' +
    '.chx-pw{animation:chxPw .86s ease-out infinite}' +
    '@keyframes chxPw{0%{transform:translate(0,0)}14%{transform:translate(0,-.8px)}100%{transform:translate(0,0)}}' +
    '.chx-fo{animation:chxFo 1.6s ease-in-out infinite}' +
    '@keyframes chxFo{0%,100%{opacity:.35}50%{opacity:1}}' +
    '.chx-sp{animation:chxSp .86s cubic-bezier(.2,.7,.4,1) infinite}' +
    '@keyframes chxSp{0%{transform:translate(0,0) scale(.4);opacity:0}8%{opacity:1}35%{transform:translate(var(--dx1),var(--dy1)) scale(1)}70%{transform:translate(var(--dx2),var(--dy2)) scale(.9);opacity:.9}100%{transform:translate(var(--dx3),var(--dy3)) scale(.7);opacity:0}}' +
    '.chx-dr{animation:chxDr 2.6s linear infinite}' +
    '@keyframes chxDr{0%{transform:translate(0,0);opacity:0}10%{opacity:1}85%{opacity:.9}100%{transform:translate(var(--dx),var(--dy));opacity:0}}' +
    '.chx-sh{animation:chxSh 3.4s ease-in-out infinite}' +
    '@keyframes chxSh{0%,100%{opacity:.5}50%{opacity:.95}}' +
    '@media (prefers-reduced-motion: reduce){.chx-br,.chx-br2,.chx-pu,.chx-pw,.chx-fo,.chx-sp,.chx-dr,.chx-sh{animation:none!important}}' +
    '</style>';

  /* ---------------- the scene ---------------- */
  function build(st) {
    var v = norm(st), id = v.id;
    var g = geo(v), J = g.J;
    var detach = Math.max(v.bed, v.peel >= 3 ? .36 : v.peel >= 2 ? .14 : 0);
    var D = v.bed > .97 ? 74 : (v.peel >= 3 ? 20 : 12) + 50 * v.bed;
    var gb = gbShape(v, g.gb, detach, D);
    var neckDisp = detach > 0 ? D * sm((1 - (1 - detach)) / .22) : 0;
    var nrN = gb.nr[gb.nr.length - 1];
    var cd = g.cd.map(function (p, i) { return i === 0 ? add(p, nrN, neckDisp) : i === 1 ? add(p, nrN, neckDisp * .4) : p; });
    var cdc = cr(cd, 12);
    var cbdc = cr(g.cbd, 10);
    var mir = v.variant === 'mirizzi', frozen = mir || v.inflam >= 2.6;
    var neck = gb.c[gb.c.length - 1];
    /* triangle (hepatocystic): GB neck, liver edge, CHD, cystic duct */
    var gbTop = gb.Rn[Math.round(gb.Rn.length * .84)];
    var tri = [gbTop, [lerp(gbTop[0], 690, .35), lerp(gbTop[1], 244, .55) - 6], [lerp(gbTop[0], 690, .7), 248], [676, 244], [674, 300], [672, J[1] - 14]];
    var cdTop = off(cdc, normals(cdc), -8);
    for (var i = cdTop.length - 3; i > 0; i -= 3) tri.push(cdTop[i]);
    var open = cl(v.fu, 0, 1) * cl((v.hm + 1) / 2, 0, 1);
    /* arteries */
    var rha = [[700, 298], [664, 288], [616, 272], [566, 262]];
    var ca0 = [652, 286];
    var caEnd = add(gb.c[Math.round(gb.c.length * .9)], gb.nr[Math.round(gb.nr.length * .9)], -gb.W[Math.round(gb.W.length * .9)] * .7);
    var cam = lp(ca0, caEnd, .5); cam[1] += 10 * open - 4;
    var ca = [ca0, lp(ca0, cam, .55), cam, lp(cam, caEnd, .6), caEnd];
    if (v.hm < 0) { ca = [ca0, [640, 280], [626, 272], lp([626, 272], caEnd, .5), caEnd]; }
    var ca2 = [[768, 316], [722, 318], [688, 314], [650, 304], [610, 298], add(caEnd, [6, -16])];
    /* aberrant right posterior sectoral duct into the cystic duct */
    var abJ = at(cdc, .55), ab = [[lerp(gbTop[0], 690, .22), 262], [lerp(gbTop[0], 690, .25) + 6, 290], lp([lerp(gbTop[0], 690, .25) + 6, 290], abJ, .55), abJ];

    var s = '';
    /* ---------- background cavity ---------- */
    s += '<rect width="960" height="600" fill="url(#' + id + '-bg)"/>';
    /* hepatic flexure of the colon, lower left */
    var colon = 'M-60 468 C100 462 260 460 400 466 C480 472 540 490 590 520 L600 660 L-60 660 Z';
    s += '<g class="chx-br2">' +
      '<path d="' + colon + '" fill="url(#' + id + '-co)"/>' +
      '<path d="M60 500 C80 520 84 540 78 560 M190 504 C214 524 218 546 210 566 M320 512 C344 532 350 552 344 572 M440 526 C458 546 462 566 454 590" fill="none" stroke="#4A2418" stroke-opacity=".45" stroke-width="4" filter="url(#' + id + '-b1)"/>' +
      '<path d="M-60 512 C120 512 280 516 420 532" fill="none" stroke="#F2D0BC" stroke-opacity=".5" stroke-width="7" filter="url(#' + id + '-b2)"/>' +
      '<path d="M-60 524 C120 526 280 530 430 548" fill="none" stroke="#E9C59A" stroke-opacity=".55" stroke-width="5"/>' +
      '</g>';

    /* ---------- the hepatic group (breathes) ---------- */
    var h = '';
    var livD = sp(LIV, false) + 'L980 -20 L-20 -20 Z';
    /* inferior (visceral) surface of the liver */
    h += '<path d="' + livD + '" fill="url(#' + id + '-liv)"/>';
    h += '<path d="' + livD + '" fill="url(#' + id + '-lob)" opacity=".05"/>';
    h += '<path d="' + livD + '" fill="url(#' + id + '-livE)"/>';
    /* volume: segment IV dome on the right, segment V/VI on the left, soft shadow under the edge */
    h += '<ellipse cx="830" cy="250" rx="150" ry="70" fill="#C8705E" opacity=".22" filter="url(#' + id + '-b22)"/>' +
      '<ellipse cx="200" cy="360" rx="190" ry="80" transform="rotate(-10 200 360)" fill="#C06A58" opacity=".2" filter="url(#' + id + '-b22)"/>' +
      '<ellipse cx="560" cy="200" rx="200" ry="60" transform="rotate(-8 560 200)" fill="#2A0A08" opacity=".25" filter="url(#' + id + '-b22)"/>';
    /* the anterior edge, folded up by the retraction, and the diaphragmatic surface above it */
    var edgeK = sm(v.fu);
    if (edgeK > .02) {
      var E2 = EDGE.map(function (p) { return [p[0], p[1] + (1 - edgeK) * 120]; });
      var edD = sp(E2, false) + 'L1000 -40 L-60 -40 Z';
      h += '<g opacity="' + r1(edgeK * 100) / 100 + '">' +
        '<path d="' + sp(E2) + '" fill="none" stroke="#120302" stroke-opacity=".6" stroke-width="18" transform="translate(0 12)" filter="url(#' + id + '-b10)"/>' +
        '<path d="' + edD + '" fill="url(#' + id + '-dia)"/>' +
        '<path d="' + edD + '" fill="url(#' + id + '-lob)" opacity=".04"/>' +
        '<path d="' + sp(E2) + '" fill="none" stroke="#FFE2D6" stroke-opacity=".85" stroke-width="2" transform="translate(0 -2.5)" filter="url(#' + id + '-b1)"/>' +
        '<path d="' + sp(E2) + '" fill="none" stroke="#3A0F0B" stroke-opacity=".9" stroke-width="1.4"/>' +
        '<ellipse cx="640" cy="62" rx="190" ry="20" transform="rotate(-3 640 62)" fill="#FFEDE4" opacity=".28" filter="url(#' + id + '-b10)"/>' +
        '<path d="M520 70 C600 60 700 56 800 52" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2.4" stroke-linecap="round" filter="url(#' + id + '-b1)"/>' +
        '<path d="M150 148 C200 132 250 122 300 116" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="2" stroke-linecap="round" filter="url(#' + id + '-b1)"/>' +
        '</g>';
    }
    /* moist specular glints on the visceral surface */
    var R = rng(11);
    for (i = 0; i < 22; i++) {
      var hp = [40 + R() * 900, 150 + R() * 300];
      if (!inPoly(hp, LIV.concat([[1000, -40], [-60, -40]]))) continue;
      if (i % 2 || i > 12) continue;
      h += '<ellipse cx="' + r1(hp[0]) + '" cy="' + r1(hp[1]) + '" rx="' + r1(8 + R() * 18) + '" ry="' + r1(1.4 + R() * 1.6) + '" transform="rotate(' + r1(-18 + R() * 14) + ' ' + P(hp) + ')" fill="#FFE8DE" opacity="' + r1(.18 + R() * .25) + '" filter="url(#' + id + '-b1)"/>';
    }
    /* wet rim along the visible inferior border of the right lobe */
    h += '<path d="' + sp(LIV.slice(0, 6)) + '" fill="none" stroke="#FFD8CA" stroke-opacity=".5" stroke-width="2.2" transform="translate(0 -4)" filter="url(#' + id + '-b1)"/>';
    /* ligamentum teres and falciform fat on the right */

    /* Rouviere's sulcus: a cleft on the inferior surface of the right lobe */
    var rvA = [262, 452], rvB = [392, 414];
    var rvOp = cl((v.fu - .4) * 2, 0, 1);
    if (rvOp > 0) {
      var rvM = lp(rvA, rvB, .5);
      h += '<g opacity="' + r1(rvOp * 10) / 10 + '">' +
        '<path d="M' + P(rvA) + ' Q' + P([rvM[0], rvM[1] - 14]) + ' ' + P(rvB) + ' Q' + P([rvM[0] + 6, rvM[1] + 10]) + ' ' + P(rvA) + ' Z" fill="#0E0302" opacity=".75" filter="url(#' + id + '-b4)"/>' +
        '<path d="M' + P(rvA) + ' Q' + P([rvM[0], rvM[1] - 9]) + ' ' + P(rvB) + ' Q' + P([rvM[0] + 4, rvM[1] + 3]) + ' ' + P(rvA) + ' Z" fill="#180503"/>' +
        '<path d="M' + P([rvA[0] + 10, rvA[1] + 4]) + ' Q' + P([rvM[0] + 4, rvM[1] + 8]) + ' ' + P([rvB[0] - 4, rvB[1] + 6]) + '" fill="none" stroke="#E9A08E" stroke-opacity=".4" stroke-width="3" filter="url(#' + id + '-b1)"/>' +
        '<path d="M' + P([rvA[0] + 14, rvA[1] - 8]) + ' Q' + P([rvM[0], rvM[1] - 20]) + ' ' + P([rvB[0] - 6, rvB[1] - 10]) + '" fill="none" stroke="#FFD5C6" stroke-opacity=".3" stroke-width="1.4" filter="url(#' + id + '-b1)"/>' +
        '</g>';
    }
    /* hepatoduodenal ligament (fat under peritoneum) to the right of the CBD */
    var hdl = HDL; var HDL_ = [[560, 400], [640, 372], [680, 300], [700, 246], [744, 278], [790, 338], [846, 378], [904, 390], [1010, 380], [1010, 480], [820, 500], [640, 520], [540, 480]];
    h += '<path d="' + sp(hdl, true) + '" fill="url(#' + id + '-hdl)"/>';
    h += '<g opacity=".45" clip-path="url(#' + id + '-chdl)">' + fat(id, hdl, 77, 130, 8, 15, null, 'pale') + '</g>';
    /* proper hepatic artery faint under peritoneum */
    h += '<path d="M786 492 C778 440 770 380 748 300" fill="none" stroke="#C86E5E" stroke-width="10" stroke-opacity=".45" stroke-linecap="round"/>' +
      '<path class="chx-pu" d="M782 492 C774 440 766 380 744 300" fill="none" stroke="#FFD0C2" stroke-width="2" stroke-opacity=".5" stroke-linecap="round"/>' +
      '<path d="' + sp(hdl, true) + '" fill="#F0DEC4" fill-opacity=".45"/>' +
      '<path d="' + sp(hdl, true) + '" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="6" filter="url(#' + id + '-b4)"/>';

    h += '<path d="' + sp(LIV.slice(6)) + '" fill="none" stroke="#0E0302" stroke-opacity=".55" stroke-width="22" transform="translate(0 12)" filter="url(#' + id + '-b10)"/>';
    /* ---------- triangle floor (seen when cleared) ---------- */
    var triD = sp(tri, true);
    h += '<path d="' + triD + '" fill="url(#' + id + '-floor)"/>';
    h += '<path d="' + triD + '" fill="url(#' + id + '-lob)" opacity=".1"/>';
    /* ---------- cystic plate: the bed left on the liver where the GB came off ---------- */
    if (detach > 0.05) {
      var n0 = Math.round((gb.c0.length - 1) * (1 - detach)), n1 = Math.round((gb.c0.length - 1) * .93), mids = [], wids = [];
      for (i = n0; i <= n1; i++) {
        var kk = sm((gb.s[i] - (1 - detach)) / .22), wq = gb.W[i] * (1 - .1 * Math.exp(-Math.pow((gb.s[i] - .79) / .07, 2)));
        mids.push(add(gb.c0[i], gb.nr[i], -wq + D * kk * .5 - 2));
        wids.push(D * kk + 14);
      }
      if (mids.length > 2) {
        var mw = Math.max.apply(0, wids), md = sp(every(mids, 2));
        h += '<path d="' + md + '" fill="none" stroke="#C9A08E" stroke-width="' + r1(mw + 4) + '" stroke-linecap="round" filter="url(#' + id + '-b2)"/>' +
          '<path d="' + md + '" fill="none" stroke="#DDBFAE" stroke-width="' + r1(mw - 4) + '" stroke-linecap="round" filter="url(#' + id + '-b1)"/>' +
          '<path d="' + sp(every(off(mids, gb.nr.slice(n0), -mw * .22), 2)) + '" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.5" stroke-dasharray="18 10 6 12" stroke-linecap="round" filter="url(#' + id + '-b1)"/>';
        var Rp = rng(5);
        for (i = 1; i < mids.length - 1; i += 3) {
          var pq = add(mids[i], gb.nr[n0 + i], (Rp() - .5) * mw * .6);
          h += '<path d="M' + P(pq) + ' q' + r1(4 + Rp() * 6) + ' ' + r1(-2 + Rp() * 4) + ' ' + r1(10 + Rp() * 8) + ' ' + r1(Rp() * 4 - 2) + '" fill="none" stroke="#A04A3E" stroke-opacity=".45" stroke-width=".9"/>';
        }
      }
    }
    h += '<g clip-path="url(#' + id + '-cbl)">';
    /* ---------- right hepatic artery ---------- */
    var ART = ['#6E2420', '#C86A58', '#EBA18E'];
    var rhaVis = v.peel >= 2 ? 1 : .0;
    h += '<g opacity="' + (rhaVis ? 1 : .0) + '">' + tubeStroke(rha, 10, ART, { id: id, spec: .4 }) + '</g>';
    /* ---------- CHD / CBD ---------- */
    var DUC = ['#7E7440', '#D6CB92', '#F4EDC8'], DUB = ['#56604C', '#B4B898', '#DADDC6'];
    var cw = mir ? 28 : 25;
    var chdPts = g.cbd.slice(0, 3), cbdPts = g.cbd.slice(2);
    var cbdS = '';
    if (v.injury === 'cbdcut') {
      var cut1 = at(cbdc, .55), cut2 = at(cbdc, .63);
      cbdS += tubeStroke(slice(cbdc, 0, .55), cw, DUB, { id: id, cap: 'butt' }) + tubeStroke(slice(cbdc, .66, 1), cw, DUB, { id: id, cap: 'butt' });
      var dn = dirAt(cbdc, .58), dang = Math.atan2(dn[1], dn[0]) * 180 / Math.PI + 90;
      cbdS += '<ellipse cx="' + r1(cut1[0]) + '" cy="' + r1(cut1[1]) + '" rx="' + r1(cw * .5) + '" ry="4.5" transform="rotate(' + r1(dang - 90 + 90) + ' ' + P(cut1) + ')" fill="#3E4A14" stroke="#E9DFA8" stroke-width="1.6"/>';
      var c3 = at(cbdc, .66);
      cbdS += '<ellipse cx="' + r1(c3[0]) + '" cy="' + r1(c3[1]) + '" rx="' + r1(cw * .5) + '" ry="4.5" fill="#3E4A14" stroke="#E9DFA8" stroke-width="1.6"/>';
    } else {
      if (mir) {
        cbdS += tubeStroke(slice(cbdc, 0, .3), 32, DUC, { id: id }) + tubeStroke(slice(cbdc, .28, .42), 14, DUC, { id: id, noShadow: 1 }) + tubeStroke(slice(cbdc, .4, 1), 22, DUC, { id: id });
      } else cbdS += tubeStroke(cbdc, cw, DUB, { id: id, spec: .45 });
    }
    var cbdOut = '<g opacity="' + r1((.35 + .65 * sm(v.fu)) * 100) / 100 + '">' + cbdS + '</g>';
    /* ---------- aberrant duct ---------- */
    if (v.variant === 'aberrant') h += tubeStroke(ab, 9, DUC, { id: id, spec: .7 });
    /* ---------- cystic artery (+ second) ---------- */
    var caS = '';
    var cac = cr(ca, 10);
    if (v.cut) {
      caS += tubeStroke(slice(cac, 0, .5), 8, ART, { id: id, cap: 'butt' }) + tubeStroke(slice(cac, .62, 1), 8, ART, { id: id, cap: 'butt' });
    } else caS += '<g class="chx-pw">' + tubeStroke(ca, 8, ART, { id: id, hlCls: 'chx-pu', spec: .5 }) + '</g>';
    /* ---------- cystic duct ---------- */
    var cdw = 13 + (mir ? -3 : 0);
    var cdS = '';
    if (v.cut) {
      cdS += tubeStroke(slice(cdc, 0, .36), cdw, DUC, { id: id, cap: 'butt' }) + tubeStroke(slice(cdc, .48, 1), cdw, DUC, { id: id, cap: 'butt' });
    } else cdS += tubeStroke(cdc, cdw, DUC, { id: id });
    /* spiral valve hint */
    if (!v.cut) for (i = 1; i < 6; i++) {
      var kp = at(cdc, i / 7), kd = dirAt(cdc, i / 7), kn = [-kd[1], kd[0]];
      cdS += '<path d="M' + P(add(kp, kn, -cdw * .45)) + ' Q' + P(add(add(kp, kd, 3), kn, 0)) + ' ' + P(add(kp, kn, cdw * .45)) + '" fill="none" stroke="#8A7F48" stroke-opacity=".12" stroke-width="1"/>';
    }
    /* cystic lymph node (on the artery near the neck) */
    var nodeP = at(cac, .72); nodeP = [nodeP[0] + 2, nodeP[1] - 9];
    var nodeS = '<ellipse cx="' + r1(nodeP[0] + 2) + '" cy="' + r1(nodeP[1] + 4) + '" rx="12" ry="8" fill="#000" opacity=".3" filter="url(#' + id + '-b2)"/>' +
      '<ellipse cx="' + r1(nodeP[0]) + '" cy="' + r1(nodeP[1]) + '" rx="11" ry="7.5" transform="rotate(-18 ' + P(nodeP) + ')" fill="url(#' + id + '-fatp)" stroke="#8E6A48" stroke-width=".8"/>' +
      '<ellipse cx="' + r1(nodeP[0] - 3) + '" cy="' + r1(nodeP[1] - 3) + '" rx="3.5" ry="1.8" fill="#fff" opacity=".7"/>';
    h += '<g opacity="' + r1((.2 + .8 * sm(v.fu)) * 100) / 100 + '">' + cdS + '</g>' + cbdOut + caS + (v.peel >= 2 && !v.cut ? nodeS : '');
    /* ---------- triangle tissue: fat (peel), frozen fibrosis ---------- */
    var triFatN = v.fu < .35 ? 0 : v.peel < 1 ? 70 : v.peel < 2 ? 56 : v.peel < 3 ? 22 : 0;
    var cen = [0, 0]; tri.forEach(function (p) { cen[0] += p[0] / tri.length; cen[1] += p[1] / tri.length; });
    var bigTri = tri.map(function (p) { return add(cen, sub(p, cen), 1.14); });
    var cdBot = off(cdc, normals(cdc), 13), covTri = tri.slice(0, 4).concat([[712, 300], [710, J[1] + 6]]);
    for (i = cdBot.length - 2; i > 0; i -= 3) covTri.push(cdBot[i]);
    covTri = covTri.map(function (p) { return add(cen, sub(p, cen), 1.06); });
    if (frozen && v.peel < 3) {
      h += '<path d="' + sp(bigTri, true) + '" fill="#D9C2B4"/>' +
        '<path d="' + sp(bigTri, true) + '" fill="url(#' + id + '-lob)" opacity=".12"/>';
      var Rf = rng(3);
      for (i = 0; i < 26; i++) {
        var fp = [lerp(cen[0] - 80, cen[0] + 80, Rf()), lerp(cen[1] - 50, cen[1] + 50, Rf())];
        if (!inPoly(fp, bigTri)) continue;
        h += '<path d="M' + P(fp) + ' q' + r1(10 + Rf() * 16) + ' ' + r1(-4 + Rf() * 8) + ' ' + r1(22 + Rf() * 18) + ' ' + r1(-6 + Rf() * 12) + '" stroke="#FFF7F0" stroke-opacity=".55" stroke-width="' + r1(1 + Rf() * 2) + '" fill="none"/>' +
          '<path d="M' + P([fp[0], fp[1] + 6]) + ' q12 3 26 -2" stroke="#9C5A52" stroke-opacity=".35" stroke-width="1.4" fill="none"/>';
      }
      h += '<path d="' + sp(bigTri, true) + '" fill="#A33A34" opacity="' + r1((v.inflam - 1) * .08 * 10) / 10 + '"/>';
    } else if (triFatN) {
      var keep = v.peel >= 2 ? function (p, Rk) {
        /* fat left near the liver edge and around the CBD side */
        return p[1] < 270 + Rk() * 10 || p[0] > 650 || Rk() < .12;
      } : null;
      var fpoly = v.peel < 1 ? covTri : bigTri;
      if (v.peel < 2 && v.fu >= .35) h += '<path d="' + sp(fpoly, true) + '" fill="url(#' + id + '-fat)" opacity=".95"/>';
      h += fat(id, fpoly, 21, triFatN, 9, 17, keep);
    }
    h += '<path d="' + sp(LIV.slice(4, 12)) + '" fill="none" stroke="#0E0302" stroke-opacity=".7" stroke-width="14" transform="translate(0 7)" filter="url(#' + id + '-b4)"/></g>';
    /* ---------- adhesions-free GB first: shadow and body ---------- */
    var gbS = '';
    gbS += '<path d="' + gb.d + '" fill="#000" opacity=".5" transform="translate(9 14)" filter="url(#' + id + '-b10)"/>';
    gbS += '<path d="' + gb.d + '" fill="url(#' + id + '-gb)"/>';
    var lite = [], i2;
    for (i2 = Math.round(gb.c.length * .06); i2 < gb.c.length * .9; i2 += 2) lite.push(add(gb.c[i2], gb.nr[i2], -gb.W[i2] * .28));
    gbS += '<g clip-path="url(#' + id + '-cgb)">' +
      '<path d="' + gb.d + '" fill="none" stroke="' + mixc('#1E2C28', '#2A0A18', v.inflam / 3) + '" stroke-opacity=".75" stroke-width="' + r1(gb.R0 * .7) + '" filter="url(#' + id + '-b10)"/>' +
      '<path d="' + sp(lite) + '" fill="none" stroke="' + mixc('#EEF2EA', '#F6C8C4', v.inflam / 3) + '" stroke-opacity="' + r1((.38 - .08 * v.inflam) * 100) / 100 + '" stroke-width="' + r1(gb.R0 * .7) + '" stroke-linecap="round" filter="url(#' + id + '-b22)"/>' +
      '</g>';
    /* bile seen through a thin wall */
    var thin = cl(1 - v.inflam, 0, 1);
    if (thin > 0) {
      var inn = [];
      for (i = 0; i < gb.c.length; i += 2) inn.push(add(gb.c[i], gb.nr[i], gb.W[i] * .25));
      gbS += '<path d="' + sp(inn) + '" fill="none" stroke="#4A6A50" stroke-opacity="' + r1(.2 * thin * 100) / 100 + '" stroke-width="' + r1(gb.R0 * 1.1) + '" stroke-linecap="round" filter="url(#' + id + '-b22)"/>';
    }
    /* serosal vessels from the neck branching toward the fundus */
    var vc = mixc('#B8606A', '#D02030', v.inflam / 3), vop = .35 + .15 * v.inflam;
    var R2 = rng(9);
    for (i = 0; i < 3; i++) {
      var side = (i % 2 ? 1 : -1) * (.15 + R2() * .55), a0 = .92 - R2() * .05, a1 = .25 + R2() * .3, vp = [];
      for (var k2 = 0; k2 <= 8; k2++) {
        var tt = lerp(a0, a1, k2 / 8), ii = Math.round(tt * (gb.c.length - 1));
        vp.push(add(gb.c[ii], gb.nr[ii], gb.W[ii] * (side + Math.sin(k2 * 1.7 + i) * .06)));
      }
      gbS += '<path d="' + sp(vp) + '" fill="none" stroke="' + vc + '" stroke-opacity="' + r1(vop * 10) / 10 + '" stroke-width="' + r1(1.6 - i * .15 + v.inflam * .4) + '" stroke-linecap="round"/>';
      var mid = vp[4], br2 = add(mid, [R2() * 30 - 15, R2() * 24 - 12]);
      gbS += '<path d="M' + P(mid) + ' Q' + P(lp(mid, br2, .5).map(function (q, j) { return q + (j ? 4 : -4); })) + ' ' + P(br2) + '" fill="none" stroke="' + vc + '" stroke-opacity="' + r1(vop * .8 * 10) / 10 + '" stroke-width="1"/>';
    }
    /* oedema rim, fibrin and gangrene with inflammation */
    if (v.inflam >= 1.5) {
      var Rfb = rng(31), fo = cl(v.inflam - 1.4, 0, 1);
      /* mottled hyperaemia */
      for (i = 0; i < 6; i++) {
        var mi = Math.round((.15 + Rfb() * .7) * (gb.c.length - 1)), mp = add(gb.c[mi], gb.nr[mi], gb.W[mi] * (Rfb() * 1.2 - .6));
        gbS += '<ellipse cx="' + r1(mp[0]) + '" cy="' + r1(mp[1]) + '" rx="' + r1(14 + Rfb() * 18) + '" ry="' + r1(9 + Rfb() * 10) + '" fill="#5A1030" opacity="' + r1(.25 * fo + .1) + '" filter="url(#' + id + '-b4)"/>';
      }
      /* fibrinous exudate: creamy streaks along the wall */
      for (i = 0; i < 3; i++) {
        var fi = Math.round((.2 + i * .22 + Rfb() * .08) * (gb.c.length - 1)), fc = add(gb.c[fi], gb.nr[fi], gb.W[fi] * (i === 1 ? -.35 : .3)), tgf = [-gb.nr[fi][1], gb.nr[fi][0]], fpts = [], fr = 12 + Rfb() * 8;
        for (var k3 = 0; k3 < 9; k3++) { var fa2 = k3 / 9 * Math.PI * 2, ca = Math.cos(fa2) * fr * (2.2 + Rfb() * .6), sa2 = Math.sin(fa2) * fr * (.55 + Rfb() * .45); fpts.push([fc[0] + tgf[0] * ca + gb.nr[fi][0] * sa2, fc[1] + tgf[1] * ca + gb.nr[fi][1] * sa2]); }
        gbS += '<path d="' + sp(fpts, true) + '" fill="#E3CFA0" opacity="' + r1(fo * .55 * 100) / 100 + '" filter="url(#' + id + '-b2)"/>' +
          '<path d="' + sp(fpts, true) + '" fill="none" stroke="#F4E8C6" stroke-opacity="' + r1(fo * .5 * 100) / 100 + '" stroke-width="1" stroke-dasharray="1.5 3.5"/>';
      }
    }
    if (v.inflam >= 2.6) {
      [[.35, .3, 20], [.55, -.4, 15], [.22, -.1, 13]].forEach(function (q) {
        var gi = Math.round(q[0] * (gb.c.length - 1)), gp = add(gb.c[gi], gb.nr[gi], gb.W[gi] * q[1]);
        gbS += '<ellipse cx="' + r1(gp[0]) + '" cy="' + r1(gp[1]) + '" rx="' + r1(q[2] * 1.5) + '" ry="' + q[2] + '" fill="#4A1A3A" opacity=".55" filter="url(#' + id + '-b4)"/>' +
          '<ellipse cx="' + r1(gp[0]) + '" cy="' + r1(gp[1]) + '" rx="' + r1(q[2]) + '" ry="' + r1(q[2] * .65) + '" fill="#1F2A18" opacity=".85"/>';
      });
    }
    /* mirizzi: the stone tenting Hartmann's pouch */
    if (mir) {
      var si = Math.round(.8 * (gb.c.length - 1)), sp0 = add(gb.c[si], gb.nr[si], gb.W[si] * .25);
      gbS += '<ellipse cx="' + r1(sp0[0] + 4) + '" cy="' + r1(sp0[1] + 6) + '" rx="34" ry="30" fill="#2A0E14" opacity=".45" filter="url(#' + id + '-b4)"/>' +
        '<ellipse cx="' + r1(sp0[0]) + '" cy="' + r1(sp0[1]) + '" rx="30" ry="27" fill="#B98C7A" opacity=".55"/>' +
        '<ellipse cx="' + r1(sp0[0]) + '" cy="' + r1(sp0[1]) + '" rx="30" ry="27" fill="none" stroke="#3A1420" stroke-opacity=".5" stroke-width="2" filter="url(#' + id + '-b1)"/>' +
        '<ellipse cx="' + r1(sp0[0] - 9) + '" cy="' + r1(sp0[1] - 11) + '" rx="13" ry="6" transform="rotate(-30 ' + P(sp0) + ')" fill="#fff" opacity=".6" filter="url(#' + id + '-b1)"/>';
    }
    /* rim + specular highlights (wet serosa) */
    gbS += '<path d="' + gb.d + '" fill="none" stroke="' + mixc('#203434', '#3A1020', v.inflam / 3) + '" stroke-opacity=".7" stroke-width="1.4"/>';
    var hlA = [], hlB = [];
    for (i = Math.round(gb.c.length * .08); i < gb.c.length * .82; i += 2) { hlA.push(add(gb.c[i], gb.nr[i], -gb.W[i] * .55)); }
    for (i = Math.round(gb.c.length * .12); i < gb.c.length * .6; i += 2) { hlB.push(add(gb.c[i], gb.nr[i], -gb.W[i] * .62)); }
    gbS += spec(hlA, 7, .14, id);
    /* specular glints (wet serosa): soft blobs plus a few sharp points */
    var Rs = rng(41);
    for (i = Math.round(gb.c.length * .1); i < gb.c.length * .82; i += 3) {
      var gq = add(gb.c[i], gb.nr[i], -gb.W[i] * (.3 + Rs() * .45)), ga = Math.atan2(gb.nr[i][0], -gb.nr[i][1]) * 180 / Math.PI;
      if (Rs() < .5) gbS += '<ellipse cx="' + r1(gq[0]) + '" cy="' + r1(gq[1]) + '" rx="' + r1(6 + Rs() * 10) + '" ry="' + r1(2 + Rs() * 2.5) + '" transform="rotate(' + r1(ga) + ' ' + P(gq) + ')" fill="#fff" opacity="' + r1(.22 + Rs() * .2) + '" filter="url(#' + id + '-b2)"/>';
      if (Rs() < .35) gbS += '<ellipse cx="' + r1(gq[0] + 3) + '" cy="' + r1(gq[1] - 2) + '" rx="' + r1(1.6 + Rs() * 2.4) + '" ry="1" transform="rotate(' + r1(ga) + ' ' + P(gq) + ')" fill="#fff" opacity=".85"/>';
    }
    var f0 = gb.c[Math.round(gb.c.length * .12)];
    gbS += '<ellipse cx="' + r1(f0[0] - 10) + '" cy="' + r1(f0[1] - 18) + '" rx="22" ry="8" transform="rotate(-38 ' + P(f0) + ')" fill="#fff" opacity=".42" filter="url(#' + id + '-b2)"/>';
    /* perforation with stones */
    if (v.stones) {
      var pi = Math.round(.42 * (gb.c.length - 1)), pp = add(gb.c[pi], gb.nr[pi], gb.W[pi] * .55);
      gbS += '<ellipse cx="' + r1(pp[0]) + '" cy="' + r1(pp[1]) + '" rx="13" ry="8" transform="rotate(30 ' + P(pp) + ')" fill="#2C3A12" stroke="#7A2E3A" stroke-width="2.4"/>';
    }
    if (v.bleed >= 2) {
      var bc = at(cdc, .45), Rb = rng(71), pool = [];
      bc = [bc[0], bc[1] - 18];
      for (i = 0; i < 16; i++) { var an = i / 16 * Math.PI * 2, rr = (1 + (Rb() - .5) * .35); pool.push([bc[0] + Math.cos(an) * 128 * rr, bc[1] + Math.sin(an) * (an > 0 && an < Math.PI ? 78 : 56) * rr + (an > .3 && an < 1.4 ? 50 : 0)]); }
      var pd = sp(pool, true);
      h += '<path d="' + pd + '" fill="#1A0002" opacity=".55" transform="translate(2 6)" filter="url(#' + id + '-b4)"/>' +
        '<path d="' + pd + '" fill="#5A0408" filter="url(#' + id + '-b1)"/>' +
        '<path d="' + pd + '" fill="url(#' + id + '-bl)" transform="translate(' + r1(bc[0] * .08) + ' ' + r1(bc[1] * .08) + ') scale(.92)"/>' +
        '<path class="chx-sh" d="' + sp([[bc[0] - 90, bc[1] - 20], [bc[0] - 30, bc[1] - 40], [bc[0] + 40, bc[1] - 38], [bc[0] + 90, bc[1] - 18]]) + '" fill="none" stroke="#FFE4E0" stroke-opacity=".75" stroke-width="2.4" stroke-linecap="round" filter="url(#' + id + '-b1)"/>' +
        '<ellipse class="chx-sh" cx="' + r1(bc[0] - 20) + '" cy="' + r1(bc[1] + 4) + '" rx="46" ry="7" fill="#fff" opacity=".18" filter="url(#' + id + '-b2)"/>' +
        '<ellipse cx="' + r1(bc[0] + 60) + '" cy="' + r1(bc[1] + 30) + '" rx="8" ry="2" fill="#fff" opacity=".6"/>';
    }
    h += gbS;
    /* clips on duct and artery */
    function clipsOn(c, w, list) { var o = ''; list.forEach(function (k) { var p = at(c, k), dd = dirAt(c, k); o += clipBar(p, dd, w + 12, id); }); return o; }
    if (v.clips) {
      h += clipsOn(cdc, cdw, v.cut ? [.27, .54, .63] : [.27, .55, .64]);
      h += clipsOn(cac, 8, v.cut ? [.36, .7, .79] : [.36, .7, .8]);
    }
    if (v.cut) {
      [[cdc, .36, cdw, '#3E4A14', '#E2D8A0'], [cdc, .48, cdw, '#3E4A14', '#E2D8A0'], [cac, .5, 8, '#5A0E10', '#F2B0A0'], [cac, .62, 8, '#5A0E10', '#F2B0A0']].forEach(function (q) {
        var p = at(q[0], q[1]), dd = dirAt(q[0], q[1]), a = Math.atan2(dd[1], dd[0]) * 180 / Math.PI;
        h += '<ellipse cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" rx="2.6" ry="' + r1(q[2] * .48) + '" transform="rotate(' + r1(a) + ' ' + P(p) + ')" fill="' + q[3] + '" stroke="' + q[4] + '" stroke-width="1.2"/>';
      });
    }
    /* second cystic artery crossing in front of the CHD */
    if (v.variant === 'twoart' && v.peel >= 1) h += '<g class="chx-pw" opacity="' + (v.peel >= 2 ? 1 : .55) + '">' + tubeStroke(ca2, 7, ART, { id: id, hlCls: 'chx-pu' }) + '</g>';

    /* ---------- liver flap (unretracted liver covers the GB) ---------- */
    var flapOp = 1 - sm((v.fu - .2) / .6);
    if (flapOp > .01) {
      var fl = lps(FLAP, LIV.slice(0, FLAP.length).map(function (p, j) { return [FLAP[j][0], FLAP[j][1] - 170]; }), sm(v.fu));
      var flD = sp(fl, false) + 'L980 -20 L-20 -20 Z';
      h += '<g opacity="' + r1(flapOp * 100) / 100 + '">' +
        '<path d="' + sp(fl) + '" fill="none" stroke="#000" stroke-opacity=".55" stroke-width="16" transform="translate(4 10)" filter="url(#' + id + '-b10)"/>' +
        '<path d="' + flD + '" fill="url(#' + id + '-flap)"/>' +
        '<path d="' + flD + '" fill="url(#' + id + '-lob)" opacity=".04"/>' +
        '<path d="' + sp(fl) + '" fill="none" stroke="#FFD9CC" stroke-opacity=".7" stroke-width="2" transform="translate(0 -3)" filter="url(#' + id + '-b1)"/>' +
        '<path d="' + sp(fl) + '" fill="none" stroke="#3A0F0B" stroke-width="1.6"/>' +
        '<ellipse cx="520" cy="300" rx="190" ry="44" transform="rotate(-4 520 300)" fill="#FFE6DA" opacity=".13" filter="url(#' + id + '-b22)"/>' +
        '</g>';
    }

    /* ---------- peritoneum over the triangle ---------- */
    var pr = '';
    if (v.fu < .35) { pr = ''; } else if (v.peel < 1 && !frozen) {
      pr += '<path d="' + sp(bigTri, true) + '" fill="#FFF6EE" fill-opacity=".16" filter="url(#' + id + '-b2)"/>';
      var Rp2 = rng(17);
      for (i = 0; i < 9; i++) {
        var pp0 = [lerp(cen[0] - 70, cen[0] + 60, Rp2()), lerp(cen[1] - 35, cen[1] + 30, Rp2())];
        if (!inPoly(pp0, bigTri)) continue;
        pr += '<path d="M' + P(pp0) + ' q' + r1(18 + Rp2() * 20) + ' ' + r1(-6 - Rp2() * 6) + ' ' + r1(40 + Rp2() * 26) + ' ' + r1(-2 - Rp2() * 8) + '" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.4" stroke-linecap="round"/>';
      }
    } else if (v.peel < 3 && !frozen) {
      /* opened: rolled cut edges with cautery marks */
      var e1 = [add(gbTop, [10, 6]), add(gbTop, [22, 40]), at(cdc, .2)], e2 = [tri[1], tri[2], [668, 262]];
      pr += '<path d="' + sp(e1) + '" fill="none" stroke="#FFF2E6" stroke-opacity=".7" stroke-width="3.2" stroke-linecap="round"/>' +
        '<path d="' + sp(e2) + '" fill="none" stroke="#FFF2E6" stroke-opacity=".6" stroke-width="2.6" stroke-linecap="round"/>';
      var Rc = rng(23);
      for (i = 0; i < 10; i++) { var cp = lp(e1[Math.floor(Rc() * 2)], e1[Math.floor(Rc() * 2) + 1], Rc()); pr += '<circle cx="' + r1(cp[0] + Rc() * 6) + '" cy="' + r1(cp[1] + Rc() * 6) + '" r="' + r1(1 + Rc() * 1.5) + '" fill="#3A1A0E" opacity=".7"/>'; }
      if (v.peel >= 2) {
        /* posterior leaf opened too: thin strands bridging the window */
        for (i = 0; i < 3; i++) {
          var sa = lp(tri[1], tri[2], .2 + i * .3), sb = at(cdc, .25 + i * .2);
          pr += '<path d="M' + P(sa) + ' Q' + P([lerp(sa[0], sb[0], .5) + 8, lerp(sa[1], sb[1], .5)]) + ' ' + P(sb) + '" fill="none" stroke="#FFF6EE" stroke-opacity="' + (.3 - i * .06) + '" stroke-width="1.2"/>';
        }
      }
    }
    h += pr;
    /* peritoneal veil over the CBD in the ligament */
    if (v.bleed < 2 && v.fu > .3) h += '<g opacity="' + r1(sm((v.fu - .3) / .5) * 100) / 100 + '"><path d="M668 384 C664 430 672 480 684 505 L726 505 C716 470 712 430 708 384 Z" fill="#EADCC6" fill-opacity=".34" filter="url(#' + id + '-b2)"/>' +
      '<path d="M702 300 C700 400 706 450 716 500" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.6" filter="url(#' + id + '-b1)"/></g>';

    /* ---------- injuries ---------- */
    if (v.injury === 'cbdclip') { h += clipBar(at(cbdc, .52), dirAt(cbdc, .52), cw + 14, id, 1) + clipBar(at(cbdc, .6), dirAt(cbdc, .6), cw + 14, id, 1); if (v.cut) h += ''; }
    /* ---------- adhesions: omentum and duodenum stuck over the infundibulum ---------- */
    var adh = '', adhD = null;
    if (v.adh) {
      var ni = Math.round(.8 * (gb.c.length - 1)), ap0 = gb.c[ni];
      var ad = [[ap0[0] - 130, ap0[1] + 200], [ap0[0] - 100, ap0[1] + 80], [ap0[0] - 70, ap0[1] + 16], [ap0[0] - 30, ap0[1] - 22], [ap0[0] + 6, ap0[1] - 34], [ap0[0] + 42, ap0[1] - 20], [ap0[0] + 66, ap0[1] + 14], [ap0[0] + 96, ap0[1] + 40], [ap0[0] + 150, ap0[1] + 110], [ap0[0] + 130, ap0[1] + 240], [ap0[0] - 40, ap0[1] + 260]];
      var adD = sp(ad, true); adhD = adD;
      adh += '<path d="' + adD + '" fill="#000" opacity=".5" transform="translate(5 12)" filter="url(#' + id + '-b10)"/>' +
        '<path d="' + adD + '" fill="url(#' + id + '-fat)"/>' +
        '<g clip-path="url(#' + id + '-cadh)" opacity=".72">' + fat(id, ad, 61, 110, 9, 17, null) + '</g>' +
        '<path d="' + adD + '" fill="#F4E2B8" fill-opacity=".18"/>' +
        '<path d="' + sp(ad.slice(1, 8)) + '" fill="none" stroke="#FFF6DC" stroke-opacity=".55" stroke-width="2" filter="url(#' + id + '-b1)"/>';
      /* omental vessels */
      adh += '<path d="' + sp([[ap0[0] - 60, ap0[1] + 230], [ap0[0] - 30, ap0[1] + 140], [ap0[0] - 10, ap0[1] + 60], [ap0[0] + 14, ap0[1] - 6]]) + '" fill="none" stroke="#8E2A22" stroke-width="2.6" stroke-opacity=".65"/>' +
        '<path d="' + sp([[ap0[0] - 24, ap0[1] + 120], [ap0[0] + 30, ap0[1] + 80], [ap0[0] + 70, ap0[1] + 60]]) + '" fill="none" stroke="#8E2A22" stroke-width="1.6" stroke-opacity=".55"/>';
      /* fibrinous bands to the GB */
      for (i = 0; i < 5; i++) { var fa = [ap0[0] - 50 + i * 24, ap0[1] - 10 - Math.abs(2 - i) * 6]; adh += '<path d="M' + P(fa) + ' q' + (3 - i * 2) + ' -16 ' + (6 - i * 3) + ' -' + (22 + i * 3) + '" fill="none" stroke="#F7EBCB" stroke-opacity=".8" stroke-width="' + r1(3 - i * .3) + '" stroke-linecap="round"/>'; }
    }
    h += adh;

    /* ---------- fluids ---------- */
    var fl2 = '';
    if (v.stones) {
      var Rst = rng(57), spl = [[200, 350], [262, 392], [320, 430], [380, 478], [236, 446], [160, 412], [300, 508], [410, 520]];
      fl2 += '<path d="M150 380 C210 360 280 390 320 420 C360 450 420 480 450 520 C420 540 360 530 300 512 C230 486 170 450 150 380 Z" fill="#6E6A18" opacity=".35" filter="url(#' + id + '-b4)"/>';
      spl.forEach(function (q, j) {
        var rs = 9 + Rst() * 8, pts = [];
        for (var a = 0; a < 6; a++) { var an = a / 6 * Math.PI * 2 + Rst() * .4; pts.push([q[0] + Math.cos(an) * rs * (.8 + Rst() * .35), q[1] + Math.sin(an) * rs * (.75 + Rst() * .3)]); }
        fl2 += '<path d="' + poly(pts) + '" fill="#000" opacity=".4" transform="translate(2 4)" filter="url(#' + id + '-b1)"/>' +
          '<path d="' + poly(pts) + '" fill="' + (j % 3 === 2 ? '#2A2A1E' : 'url(#' + id + '-st)') + '" stroke="#2A1A0A" stroke-width=".8"/>' +
          '<path d="M' + P(lp(pts[3], q, .4)) + ' L' + P(lp(pts[4], q, .4)) + '" stroke="#fff" stroke-opacity=".75" stroke-width="1.4" stroke-linecap="round"/>';
      });
    }
    if (v.bile || v.injury === 'cbdcut') {
      var bsrc = v.injury === 'cbdcut' ? at(cbdc, .6) : v.cut ? at(cdc, .5) : v.bed > .3 ? at(gb.c0, .7) : at(cdc, .5);
      var bp = [bsrc, add(bsrc, [8, 30]), add(bsrc, [-6, 70]), add(bsrc, [10, 120])];
      var bpool = [add(bsrc, [-30, 118]), add(bsrc, [0, 108]), add(bsrc, [34, 114]), add(bsrc, [52, 130]), add(bsrc, [20, 142]), add(bsrc, [-18, 140]), add(bsrc, [-40, 130])];
      fl2 += '<path d="' + sp(bpool, true) + '" fill="#6A6A10" opacity=".55" filter="url(#' + id + '-b1)"/>' +
        '<path d="' + sp(bpool, true) + '" fill="url(#' + id + '-bi)" opacity=".75" transform="translate(1 -1)"/>' +
        '<path d="' + sp(bp) + '" fill="none" stroke="#6E6A14" stroke-opacity=".7" stroke-width="7" stroke-linecap="round" filter="url(#' + id + '-b1)"/>' +
        '<path d="' + sp(bp) + '" fill="none" stroke="#C2AE34" stroke-opacity=".85" stroke-width="3.6" stroke-linecap="round"/>' +
        '<path d="' + sp(bp.map(function (q) { return [q[0] - 1.2, q[1]]; })) + '" fill="none" stroke="#FFF6C0" stroke-opacity=".8" stroke-width="1" stroke-linecap="round"/>' +
        '<path d="' + sp([add(bsrc, [-14, 120]), add(bsrc, [8, 116]), add(bsrc, [30, 122])]) + '" fill="none" stroke="#FFF6C0" stroke-opacity=".7" stroke-width="1.6" stroke-linecap="round"/>';
      for (i = 0; i < 3; i++) fl2 += '<circle class="chx-dr" style="--dx:' + (8 + i * 2) + 'px;--dy:118px;animation-delay:' + (i * .85) + 's" cx="' + r1(bsrc[0]) + '" cy="' + r1(bsrc[1]) + '" r="3.2" fill="#D9C24A"/>';
    }
    if (v.bleed >= 1) {
      var bs = v.cut ? at(cac, .5) : at(cac, .45);
      fl2 += '<ellipse cx="' + r1(bs[0] - 4) + '" cy="' + r1(bs[1] + 22) + '" rx="34" ry="14" fill="url(#' + id + '-bl)" opacity=".95"/>' +
        '<ellipse cx="' + r1(bs[0] - 12) + '" cy="' + r1(bs[1] + 17) + '" rx="10" ry="2.4" fill="#fff" opacity=".55"/>';
      var drops = [[-60, -70, -110, -90, -150, -60], [-40, -84, -80, -110, -120, -96], [-70, -50, -130, -50, -170, -10], [-30, -60, -70, -80, -96, -60]];
      drops.forEach(function (q, j) {
        fl2 += '<circle class="chx-sp" style="--dx1:' + q[0] + 'px;--dy1:' + q[1] + 'px;--dx2:' + q[2] + 'px;--dy2:' + q[3] + 'px;--dx3:' + q[4] + 'px;--dy3:' + q[5] + 'px;animation-delay:' + (j * .07) + 's;transform-box:fill-box;transform-origin:center" cx="' + r1(bs[0]) + '" cy="' + r1(bs[1]) + '" r="' + (6 - j) + '" fill="#C8141C"/>';
      });
      fl2 += '<path class="chx-pu" d="M' + P(bs) + ' q-30 -50 -78 -66" fill="none" stroke="#D0181F" stroke-width="5" stroke-linecap="round"/>';
    }
    h += fl2;

    /* ---------- assemble hepatic group ---------- */
    s += '<g class="chx-br">' + h + '</g>';

    /* ---------- duodenum and omentum (front, bottom) ---------- */
    var bot = '';
    var duc = cr([[1010, 440], [900, 470], [800, 490], [700, 504], [610, 524], [540, 568], [500, 660]], 10);
    if (v.adh) duc = cr([[1010, 440], [900, 466], [800, 478], [690, 478], [590, 496], [520, 560], [480, 660]], 10);
    var dnr = normals(duc), dL = off(duc, dnr, 50), dR = off(duc, dnr, -46);
    var duD = sp(every(dL, 2).concat(every(dR, 2).reverse()), true);
    bot += '<path d="' + duD + '" fill="#000" opacity=".5" transform="translate(0 -10)" filter="url(#' + id + '-b10)"/>' +
      '<path d="' + duD + '" fill="url(#' + id + '-du)"/>' +
      '<path d="' + sp(every(off(duc, dnr, -26), 2)) + '" fill="none" stroke="#fff" stroke-opacity=".32" stroke-width="7" filter="url(#' + id + '-b2)"/>' +
      '<path d="' + sp(every(off(duc, dnr, -30), 2)) + '" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.6"/>';
    var Rd = rng(29);
    for (i = 2; i < duc.length - 2; i += 4) {
      var dp = duc[i], dq = dnr[i];
      var dt = [-dq[1], dq[0]], dv = [add(add(dp, dq, 46), dt, Rd() * 6), add(add(dp, dq, 20), dt, 4 + Rd() * 6), add(add(dp, dq, -10), dt, 2 + Rd() * 8)];
      if (i % 8 === 2) bot += '<path d="' + sp([dv[0], lp(dv[0], dv[2], .5), add(dv[2], dt, 14)]) + '" fill="none" stroke="#A44A3C" stroke-opacity=".18" stroke-width="1.2" stroke-linecap="round"/>';
    }
    /* omentum lower left */
    var om = [[-60, 540], [80, 526], [230, 520], [360, 510], [460, 506], [540, 530], [560, 600], [520, 660], [-60, 660]];
    bot += '<path d="' + sp(om, true) + '" fill="#000" opacity=".4" transform="translate(0 -8)" filter="url(#' + id + '-b10)"/>' +
      '<path d="' + sp(om, true) + '" fill="#B98C42"/>' + '<g opacity=".6">' + fat(id, om, 13, 160, 8, 17, null) + '</g><path d="' + sp(om, true) + '" fill="#F0DDB0" fill-opacity=".14"/><path d="' + sp(om.slice(0, 6)) + '" fill="none" stroke="#FFF2CC" stroke-opacity=".45" stroke-width="2" filter="url(#' + id + '-b1)"/>' +
      '<path d="M60 600 C90 570 130 556 180 552 M180 552 C200 540 230 538 260 548 M120 640 C130 610 160 590 200 586" fill="none" stroke="#A33A2E" stroke-opacity=".6" stroke-width="1.8"/>';
    s += '<g class="chx-br2">' + bot + '</g>';

    /* ---------- overlays ---------- */
    var ov = '';
    if (v.rouv && rvOp > 0) {
      var s4 = [772, 300], r0 = lp(rvA, rvB, .55), mid4 = lp(r0, s4, .5), ang4 = Math.atan2(s4[1] - r0[1], s4[0] - r0[0]) * 180 / Math.PI;
      ov += '<path d="M' + P(r0) + ' L' + P(s4) + '" stroke="#062A26" stroke-opacity=".6" stroke-width="6" stroke-linecap="round"/>' +
        '<path d="M' + P(r0) + ' L' + P(s4) + '" stroke="#5CE0CF" stroke-width="2.6" stroke-dasharray="12 8" stroke-linecap="round"/>' +
        '<circle cx="' + r1(r0[0]) + '" cy="' + r1(r0[1]) + '" r="6" fill="#5CE0CF" stroke="#062A26" stroke-width="2"/><circle cx="' + s4[0] + '" cy="' + s4[1] + '" r="6" fill="#5CE0CF" stroke="#062A26" stroke-width="2"/>' +
        '<g transform="translate(' + P(mid4) + ') rotate(' + r1(ang4) + ')">' +
        '<path d="M-60 -12 l0 -16 m-6 6 l6 -6 l6 6 M60 -12 l0 -16 m-6 6 l6 -6 l6 6" fill="none" stroke="#5CE0CF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
        lbl(0, 24, 'Stay above this line', 'middle', 15) + '</g>';
    }
    return { v: v, s: s, ov: ov, fl: fl2, geo: { gb: gb, cdc: cdc, cbdc: cbdc, cac: cac, ca2: ca2, rha: rha, ab: ab, tri: tri, neck: neck, J: J, rvA: rvA, rvB: rvB, nodeP: nodeP, rvOp: rvOp, adhD: adhD, open: open, detach: detach, duc: duc } };
  }

  /* ---------------- spots (visible structures) ---------------- */
  var HE = {
    liver: 'Liver', gb: 'Gallbladder', hartmann: 'Hartmann’s pouch', cduct: 'Cystic duct', cart: 'Cystic artery', cart2: 'Second cystic artery',
    chd: 'Common hepatic duct', cbd: 'Common bile duct', rha: 'Right hepatic artery', duod: 'Duodenum', oment: 'Omentum',
    rouv: 'Rouvière’s sulcus', seg4: 'Base of segment 4', plate: 'Cystic plate', node: 'Cystic lymph node', aberr: 'Aberrant duct',
    mstone: 'Stone impacted in Hartmann’s', spill: 'Spilled stones and bile', blood: 'Bleeding', bile: 'Bile leak', injury: 'Common duct injury',
    rhd: 'Right hepatic duct', lhd: 'Left hepatic duct', cath: 'Cystic duct catheter', defect: 'Filling defect: stone', leak: 'Contrast leak'
  };
  function spotsOf(b) {
    var v = b.v, g = b.geo, o = [], gb = g.gb, open = g.open;
    function add2(id, p, ok) { if (ok) o.push({ id: id, he: HE[id], x: Math.round(p[0]), y: Math.round(p[1]) }); }
    var vis = v.fu > .5;
    var fat = v.peel < 2 && !(v.variant === 'mirizzi');
    add2('liver', [880, 260], true);
    add2('gb', gb.c[Math.round(gb.c.length * .3)], true);
    add2('hartmann', add(gb.c[Math.round(gb.c.length * .8)], gb.nr[Math.round(gb.nr.length * .8)], gb.W[Math.round(gb.W.length * .8)] * .5), vis);
    add2('cduct', at(g.cdc, .3), vis && (v.peel >= 1 || open > .5));
    add2('cart', at(g.cac, .35), vis && v.peel >= 2);
    add2('cart2', at(cr(g.ca2, 6), .5), vis && v.variant === 'twoart' && v.peel >= 1);
    add2('chd', at(g.cbdc, .18), vis && v.peel >= 1);
    add2('cbd', at(g.cbdc, .6), vis);
    add2('rha', at(cr(g.rha, 6), .62), vis && v.peel >= 2);
    add2('duod', [800, 494], true);
    add2('oment', [300, 560], true);
    add2('rouv', lp(g.rvA, g.rvB, .5), g.rvOp > .5);
    add2('seg4', [772, 280], vis);
    add2('plate', (function () { var i = Math.min(gb.c0.length - 1, Math.round((gb.c0.length - 1) * (1 - g.detach * .5))); return add(gb.c0[i], gb.nr[i], -gb.W[i] - 2); })(), g.detach > .2);
    add2('node', g.nodeP, vis && v.peel >= 2 && !v.cut);
    add2('aberr', at(cr(g.ab, 6), .4), vis && v.variant === 'aberrant' && v.peel >= 2);
    add2('mstone', add(gb.c[Math.round(gb.c.length * .8)], gb.nr[Math.round(gb.nr.length * .8)], 10), v.variant === 'mirizzi');
    add2('spill', [240, 420], v.stones);
    add2('blood', at(g.cac, .45), v.bleed > 0);
    add2('bile', v.cut ? at(g.cdc, .5) : at(g.cdc, .5), v.bile);
    add2('injury', at(g.cbdc, .57), !!v.injury);
    if (fat && v.peel < 1) o.forEach(function (q) { if (q.id === 'cduct') q.covered = 1; });
    return o;
  }

  /* label placement: absolute text positions in the viewBox, [x, y, anchor]; leaders run to the structure */
  var LBL = {
    liver: [890, 150, 'm'], gb: [150, 52, 'm'], hartmann: [210, 398, 'e'], plate: [318, 112, 'm'], aberr: [430, 162, 'm'], cart: [540, 196, 'm'],
    rha: [650, 150, 'm'], node: [300, 520, 'm'], cduct: [430, 456, 'm'], chd: [790, 318, 's'], seg4: [800, 196, 's'], cbd: [790, 420, 's'],
    duod: [880, 520, 'm'], oment: [110, 548, 'm'], rouv: [150, 484, 'm'], cart2: [800, 330, 's'], mstone: [250, 470, 'm'], spill: [120, 300, 'm'],
    blood: [420, 120, 'm'], bile: [800, 470, 's'], injury: [800, 470, 's'], rhd: [300, 120, 'm'], lhd: [660, 110, 'm'], cath: [180, 400, 'm'],
    defect: [640, 470, 's'], leak: [660, 400, 's']
  };
  var MINOR = { node: 1, seg4: 1 };
  function labelsOf(sp2, all) {
    var s = '';
    sp2.forEach(function (q) {
      if (MINOR[q.id] && !all) return;
      var L = LBL[q.id] || [q.x + 60, q.y - 40, 's'], tx = L[0], ty = L[1], an = L[2] === 'e' ? 'start' : L[2] === 's' ? 'end' : 'middle';
      var ex = an === 'start' ? tx + 8 : an === 'end' ? tx - 8 : tx, ey = an === 'middle' ? (q.y > ty ? ty + 8 : ty - 22) : ty - 6;
      s += '<path d="M' + q.x + ' ' + q.y + ' L' + r1(ex) + ' ' + r1(ey) + '" stroke="#06121C" stroke-opacity=".5" stroke-width="3.4"/>' +
        '<path d="M' + q.x + ' ' + q.y + ' L' + r1(ex) + ' ' + r1(ey) + '" stroke="#F4F8FA" stroke-opacity=".92" stroke-width="1.3"/>' +
        '<circle cx="' + q.x + '" cy="' + q.y + '" r="4" fill="#F4F8FA" stroke="#06121C" stroke-width="1.4"/>' +
        lbl(tx, ty, q.he, an, 19);
    });
    return s;
  }

  /* focus: soft pulsing outline around one structure */
  function focusOf(b, idf) {
    var g = b.geo, id = b.v.id, d = null, w = 0;
    var tubes = { cduct: [g.cdc, 22], cart: [g.cac, 18], chd: [slice(g.cbdc, 0, .32), 32], cbd: [slice(g.cbdc, .3, .9), 32], rha: [cr(g.rha, 6), 20], aberr: [cr(g.ab, 6), 18], cart2: [cr(g.ca2, 6), 18] };
    if (tubes[idf]) { d = sp(every(tubes[idf][0], 2)); w = tubes[idf][1]; }
    var s = '';
    if (d) return '<g class="chx-fo"><path d="' + d + '" fill="none" stroke="#5CE0CF" stroke-width="' + (w + 10) + '" stroke-opacity=".35" stroke-linecap="round" filter="url(#' + id + '-b4)"/><path d="' + d + '" fill="none" stroke="#9FF5EA" stroke-width="' + w + '" stroke-opacity=".5" stroke-linecap="round" stroke-dasharray="1 0"/></g>';
    if (idf === 'gb' || idf === 'hartmann') return '<g class="chx-fo"><path d="' + g.gb.d + '" fill="none" stroke="#5CE0CF" stroke-width="10" stroke-opacity=".5" filter="url(#' + id + '-b4)"/><path d="' + g.gb.d + '" fill="none" stroke="#9FF5EA" stroke-width="2.2"/></g>';
    var sp2 = spotsOf(b), q = null; sp2.forEach(function (x) { if (x.id === idf) q = x; });
    if (!q) return '';
    s = '<g class="chx-fo"><circle cx="' + q.x + '" cy="' + q.y + '" r="34" fill="none" stroke="#5CE0CF" stroke-width="10" stroke-opacity=".45" filter="url(#' + id + '-b4)"/><circle cx="' + q.x + '" cy="' + q.y + '" r="30" fill="none" stroke="#9FF5EA" stroke-width="2"/></g>';
    return s;
  }

  /* ---------------- ICG fluorescence ---------------- */
  function icg(b) {
    var v = b.v, g = b.geo, id = v.id, depth = v.peel >= 3 ? 1 : v.peel >= 2 ? .85 : v.peel >= 1 ? .65 : .5;
    var G1 = '#7DFF6A', s = '<g filter="url(#' + id + '-glow)">';
    function glow(c, w, op) { var d = sp(every(c, 2)); return '<path d="' + d + '" fill="none" stroke="' + G1 + '" stroke-width="' + w + '" stroke-opacity="' + r1(op * 100) / 100 + '" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="#E8FFE0" stroke-width="' + r1(w * .35) + '" stroke-opacity="' + r1(op * .8 * 100) / 100 + '" stroke-linecap="round"/>'; }
    if (v.fu > .5) {
      if (v.injury === 'cbdcut') s += glow(slice(g.cbdc, 0, .55), 20, .9 * depth) + glow(slice(g.cbdc, .66, 1), 20, .7 * depth);
      else s += glow(g.cbdc, 20, .85 * depth);
      s += glow(g.cdc, 12, depth * (v.cut ? .6 : 1));
      if (v.variant === 'aberrant') s += glow(cr(g.ab, 6), 8, depth * .9);
      var cold = v.inflam >= 2 || v.variant === 'mirizzi';
      if (!cold) s += '<path d="' + g.gb.d + '" fill="' + G1 + '" fill-opacity=".16"/>';
    } else {
      s += '<path d="M686 390 C690 440 700 500 706 560" fill="none" stroke="' + G1 + '" stroke-width="18" stroke-opacity=".25" stroke-linecap="round"/>';
    }
    if (v.bile || v.injury === 'cbdcut') s += '<circle cx="' + r1(at(g.cbdc, .6)[0]) + '" cy="' + r1(at(g.cbdc, .6)[1] + 100) + '" r="26" fill="' + G1 + '" fill-opacity=".5"/>';
    s += '</g>';
    /* faint parenchymal glow of the liver */
    s = '<path d="' + sp(LIV, false) + 'L980 -20 L-20 -20 Z" fill="#3AFF4A" opacity=".06"/>' + s;
    return s;
  }

  /* ---------------- cholangiogram (fluoroscopy) ---------------- */
  function ioc(v) {
    var id = v.id, s = '';
    s += '<rect width="960" height="600" fill="#0B0B0B"/>';
    s += '<circle cx="480" cy="300" r="300" fill="#B9B9B4" filter="url(#' + id + '-xr)"/><g>';
    /* soft tissue and bone: ribs on the left, spine on the right */
    s += '<g opacity=".18" fill="none" stroke="#3A3A3A" stroke-width="18" stroke-linecap="round"><path d="M180 60 C300 80 380 130 420 190"/><path d="M160 140 C280 160 360 210 400 270"/><path d="M150 230 C260 250 330 300 370 360"/></g>';
    for (var i = 0; i < 6; i++) { var y = 30 + i * 96; s += '<rect x="740" y="' + y + '" width="110" height="78" rx="16" fill="#6E6E6A" opacity=".35"/><rect x="752" y="' + (y + 80) + '" width="86" height="14" rx="5" fill="#8A8A86" opacity=".25"/>'; }
    s += '<ellipse cx="380" cy="300" rx="220" ry="140" fill="#8A8A84" opacity=".18"/>';
    /* duodenum with contrast */
    var flow = !v.cbdStone && v.injury !== 'cbdclip' && v.injury !== 'cbdcut';
    s += '<path d="M520 470 C560 470 610 490 640 540 C660 580 650 620 640 640" fill="none" stroke="#2A2A28" stroke-opacity="' + (flow ? .55 : .15) + '" stroke-width="44" stroke-linecap="round"/>';
    if (flow) s += '<path d="M520 470 C560 470 610 490 640 540 C660 580 650 620 640 640" fill="none" stroke="#B9B9B4" stroke-opacity=".35" stroke-width="40" stroke-dasharray="3 6"/>';
    var C = '#1A1A18';
    function duct(d, w, op) { return '<path d="' + d + '" fill="none" stroke="' + C + '" stroke-width="' + (w + 3) + '" stroke-opacity=".25" stroke-linecap="round" stroke-linejoin="round" filter="url(#' + id + '-b1)"/><path d="' + d + '" fill="none" stroke="' + C + '" stroke-width="' + w + '" stroke-opacity="' + (op == null ? .82 : op) + '" stroke-linecap="round" stroke-linejoin="round"/><path d="' + d + '" fill="none" stroke="#000" stroke-width="' + r1(w * .4) + '" stroke-opacity=".35" stroke-linecap="round"/>'; }
    var cut = v.injury === 'cbdclip' || v.injury === 'cbdcut';
    /* cystic duct + catheter */
    s += duct('M330 340 C380 352 420 362 470 382', 10);
    /* CBD (J at 470,382) to papilla */
    s += duct('M478 384 C484 420 490 450 506 470', cut ? 11 : 14);
    s += duct('M506 470 L520 478', 6);
    if (!cut) {
      /* CHD + bifurcation + intrahepatic tree */
      s += duct('M478 384 C480 330 482 280 486 240', 13);
      var rh = 'M486 240 C460 220 430 200 400 186', lh = 'M486 240 C520 220 560 206 610 196';
      s += duct(lh, 10) + duct('M610 196 C640 186 670 170 700 150', 7) + duct('M560 206 C570 180 576 150 574 120', 6) + duct('M640 186 C650 210 668 226 690 236', 5) + duct('M680 160 C700 140 720 130 740 128', 4);
      if (v.variant === 'aberrant') {
        s += duct('M486 240 C470 210 450 180 430 150', 9) + duct('M430 150 C420 120 404 96 390 80', 6) + duct('M440 170 C410 160 380 150 350 150', 5);
        s += duct('M300 220 C330 260 360 300 400 356', 8) + duct('M300 220 C280 200 256 190 230 186', 5) + duct('M320 248 C296 250 270 258 248 270', 4);
      } else {
        s += duct(rh, 11) + duct('M400 186 C380 160 366 130 360 100', 7) + duct('M400 186 C370 184 330 190 300 204', 7) + duct('M360 110 C340 96 320 90 300 90', 4) + duct('M300 204 C280 220 262 236 250 256', 5) + duct('M330 192 C320 170 304 156 290 150', 4);
      }
    } else {
      s += '<path d="M474 384 L486 384" stroke="' + C + '" stroke-width="12"/>';
    }
    if (v.injury === 'cbdcut') s += '<ellipse cx="530" cy="430" rx="54" ry="34" fill="' + C + '" opacity=".45" filter="url(#' + id + '-b10)"/><ellipse cx="510" cy="420" rx="30" ry="18" fill="' + C + '" opacity=".4" filter="url(#' + id + '-b4)"/>';
    if (v.cbdStone) s += '<ellipse cx="499" cy="452" rx="7" ry="9.5" transform="rotate(-20 499 452)" fill="#B9B9B4"/><path d="M490 462 Q499 470 508 462" fill="none" stroke="' + C + '" stroke-width="2"/>';
    /* catheter and clamp, metal clips (radio-opaque) */
    s += '<path d="M120 330 C200 334 270 338 360 350" fill="none" stroke="#0A0A0A" stroke-width="4"/><circle cx="360" cy="350" r="2.6" fill="#000"/>';
    s += '<g transform="translate(300 346) rotate(12)"><rect x="-28" y="-6" width="56" height="4" rx="2" fill="#050505"/><rect x="-28" y="3" width="56" height="4" rx="2" fill="#050505"/><path d="M-28 -4 L-80 -40 M-28 5 L-80 40" stroke="#050505" stroke-width="5"/></g>';
    if (v.injury === 'cbdclip') s += '<rect x="472" y="396" width="28" height="5" rx="2" transform="rotate(-8 486 398)" fill="#000"/><rect x="474" y="408" width="28" height="5" rx="2" transform="rotate(-8 488 410)" fill="#000"/>';
    s += '</g>';
    s += '<circle cx="480" cy="300" r="300" fill="none" stroke="#000" stroke-width="30" filter="url(#' + id + '-b10)"/>';
    /* burned-in fluoroscopy annotations (neutral) */
    s += '<text x="200" y="64" font-family="monospace" font-size="15" fill="#E8E8E2" opacity=".75">R</text>';
    return s;
  }
  function iocSpots(v) {
    var o = [];
    function a(id, x, y, ok) { if (ok !== false) o.push({ id: id, he: HE[id], x: x, y: y }); }
    var cut = v.injury === 'cbdclip' || v.injury === 'cbdcut';
    a('cath', 200, 335); a('cduct', 420, 363); a('cbd', 492, 440); a('duod', 620, 540, !cut && !v.cbdStone);
    a('chd', 482, 310, !cut); a('rhd', 420, 194, !cut && v.variant !== 'aberrant'); a('lhd', 560, 206, !cut);
    a('aberr', 340, 280, v.variant === 'aberrant' && !cut); a('defect', 499, 452, v.cbdStone);
    a('injury', 488, 404, cut); a('leak', 530, 430, v.injury === 'cbdcut');
    return o;
  }

  /* ---------------- camera zoom (scene coordinates -> viewBox) ---------------- */
  var ZK = 1.2, ZX = 480 - ZK * 560, ZY = 300 - ZK * 330, ZT = 'matrix(' + ZK + ' 0 0 ' + ZK + ' ' + ZX + ' ' + ZY + ')';
  function zmap(list) { return list.map(function (q) { var o = {}; for (var k in q) o[k] = q[k]; o.x = Math.round(q.x * ZK + ZX); o.y = Math.round(q.y * ZK + ZY); return o; }); }

  /* ---------------- realistic photo layer ----------------
     Each visual keyframe has a repainted photo (art/real/chole/<key>.jpg, 16:9) made from a 16:9 render of the
     same state, so it lies exactly over the scene: x -53.333..1013.333, y 0..600 in viewBox units.
     The vector scene stays the fallback (st.real === false, or no photo for the state) and the source of spots.
     WANT lists every keyframe the case can ask for; HAVE lists the photos that exist. */
  var REAL_DIR = 'art/real/chole/';
  var REAL_WANT = ['start', 'bad', 'good', 'peel1', 'peel2', 'cvs', 'clips', 'cut', 'bed', 'free', 'bleed', 'cbdclip', 'cbdcut', 'inflam', 'inflamg', 'inflam2'];
  var REAL_HAVE = { start: 1, cvs: 1 };
  var GOLD = '#C8A96A';
  /* per-photo spot corrections in viewBox units (checked by overlaying the spots on each photo);
     the painted photos leave out the small cystic lymph node, so its spot is dropped in photo mode */
  var REAL_FIX = { start: { gb: [274, 400] } };
  var REAL_HIDE = { node: 1 };
  function realFix(list, rk) {
    if (!rk) return list;
    var f = REAL_FIX[rk] || {};
    return list.filter(function (q) { return !REAL_HIDE[q.id]; }).map(function (q) { if (f[q.id]) { q.x = f[q.id][0]; q.y = f[q.id][1]; } return q; });
  }
  function realWant(v) {
    if (v.mode === 'ioc' || v.variant !== 'normal') return null;
    if (v.fu < .5) return v.adh ? 'inflam' : 'start';
    if (v.injury === 'cbdcut') return 'cbdcut';
    if (v.injury === 'cbdclip') return 'cbdclip';
    if (v.bleed >= 1) return 'bleed';
    if (v.bed >= .85) return 'free';
    if (v.bed >= .2) return 'bed';
    if (v.cut) return 'cut';
    if (v.clips) return 'clips';
    if (v.adh) return 'inflamg';
    if (v.inflam >= 1.5 && v.peel < 2.5) return 'inflam2';
    if (v.hm < 0) return 'bad';
    return ['good', 'peel1', 'peel2', 'cvs'][Math.round(v.peel)];
  }
  function realKey(st) {
    if (st && st.real === false) return null;
    var k = realWant(norm(st));
    return k && REAL_HAVE[k] ? k : null;
  }
  /* AR-style focus: a soft gold glow and two hairlines along a tube, or a thin ring with ticks */
  function focusReal(b, idf, sp2) {
    var g = b.geo, id = b.v.id;
    var tubes = { cduct: [g.cdc, 16], cart: [g.cac, 12], chd: [slice(g.cbdc, 0, .32), 24], cbd: [slice(g.cbdc, .3, .9), 24], rha: [cr(g.rha, 6), 14], aberr: [cr(g.ab, 6), 12], cart2: [cr(g.ca2, 6), 12] };
    if (tubes[idf]) {
      var c = every(tubes[idf][0], 2), w = tubes[idf][1], nr = normals(c);
      return '<g class="chx-fo"><path d="' + sp(c) + '" fill="none" stroke="' + GOLD + '" stroke-width="' + (w + 14) + '" stroke-opacity=".22" stroke-linecap="round" filter="url(#' + id + '-b4)"/>' +
        '<path d="' + sp(off(c, nr, w / 2 + 3)) + '" fill="none" stroke="' + GOLD + '" stroke-width="1.2" stroke-opacity=".95"/>' +
        '<path d="' + sp(off(c, nr, -w / 2 - 3)) + '" fill="none" stroke="' + GOLD + '" stroke-width="1.2" stroke-opacity=".95"/></g>';
    }
    if ((idf === 'gb' || idf === 'hartmann') && b.v.fu >= .5) return '<g class="chx-fo"><path d="' + g.gb.d + '" fill="none" stroke="' + GOLD + '" stroke-width="12" stroke-opacity=".22" filter="url(#' + id + '-b4)"/><path d="' + g.gb.d + '" fill="none" stroke="' + GOLD + '" stroke-width="1.3" stroke-dasharray="10 5"/></g>';
    var q = null; sp2.forEach(function (x) { if (x.id === idf) q = { x: Math.round((x.x - ZX) / ZK), y: Math.round((x.y - ZY) / ZK) }; });
    if (!q) return '';
    var t = '';
    [0, 90, 180, 270].forEach(function (a) { t += '<path d="M' + q.x + ' ' + (q.y - 30) + ' v-8" transform="rotate(' + a + ' ' + q.x + ' ' + q.y + ')"/>'; });
    return '<g class="chx-fo" fill="none" stroke="' + GOLD + '"><circle cx="' + q.x + '" cy="' + q.y + '" r="30" stroke-width="10" stroke-opacity=".2" filter="url(#' + id + '-b4)"/><circle cx="' + q.x + '" cy="' + q.y + '" r="26" stroke-width="1.3"/><g stroke-width="1.3">' + t + '</g></g>';
  }
  /* labels over a photo: gold hairline leaders, small dot, small light type */
  function labelsReal(sp2, all) {
    var s = '';
    sp2.forEach(function (q) {
      if (MINOR[q.id] && !all) return;
      var L = LBL[q.id] || [q.x + 60, q.y - 40, 's'], tx = L[0], ty = L[1], an = L[2] === 'e' ? 'start' : L[2] === 's' ? 'end' : 'middle';
      var ex = an === 'start' ? tx + 6 : an === 'end' ? tx - 6 : tx, ey = an === 'middle' ? (q.y > ty ? ty + 7 : ty - 19) : ty - 5;
      s += '<path d="M' + q.x + ' ' + q.y + ' L' + r1(ex) + ' ' + r1(ey) + '" stroke="#000" stroke-opacity=".35" stroke-width="2.6"/>' +
        '<path d="M' + q.x + ' ' + q.y + ' L' + r1(ex) + ' ' + r1(ey) + '" stroke="' + GOLD + '" stroke-width="1"/>' +
        '<circle cx="' + q.x + '" cy="' + q.y + '" r="5.5" fill="none" stroke="' + GOLD + '" stroke-width="1"/><circle cx="' + q.x + '" cy="' + q.y + '" r="2" fill="' + GOLD + '"/>' +
        '<text x="' + r1(tx) + '" y="' + r1(ty) + '" text-anchor="' + ({ start: 'end', end: 'start' }[an] || an) + '" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="500" letter-spacing=".2" fill="#F3EBDD" stroke="#0A0806" stroke-opacity=".6" stroke-width="3" stroke-linejoin="round" paint-order="stroke">' + q.he + '</text>';
    });
    return s;
  }
  /* photo base + live overlays (bleeding, bile, spilled stones, the Rouviere line, ICG glow, focus) */
  function realBody(b, rk, sp2) {
    var v = b.v, id = v.id, icgOn = v.mode === 'icg';
    var s = '<image href="' + REAL_DIR + rk + '.jpg" x="-53.333" y="0" width="1066.667" height="600" preserveAspectRatio="none"' + (icgOn ? ' filter="url(#' + id + '-nir)"' : '') + '/>';
    var o = (b.fl || '') + b.ov;
    if (icgOn) o += icg(b);
    if (v.focus) o += focusReal(b, v.focus, sp2);
    return s + '<g transform="' + ZT + '">' + o + '</g>';
  }

  /* ---------------- public ---------------- */
  function draw(st) {
    var v = norm(st), id = v.id, body, sp2, extra = '', b0 = null, rk = null;
    if (v.mode === 'ioc') {
      body = ioc(v); sp2 = iocSpots(v);
    } else {
      var b = b0 = build(Object.assign({}, st || {}, { id: id }));
      sp2 = zmap(spotsOf(b));
      rk = realKey(st);
      sp2 = realFix(sp2, rk);
      if (rk) body = realBody(b, rk, sp2);
      else if (v.mode === 'icg') body = '<g filter="url(#' + id + '-nir)">' + b.s + '</g>' + icg(b);
      else body = b.s;
      if (!rk) {
        body += b.ov;
        if (v.focus) body += focusOf(b, v.focus);
        body = '<rect width="960" height="600" fill="#110504"/><g transform="' + ZT + '">' + body + '</g>' + (v.mode === 'icg' ? '' : '<rect width="960" height="600" fill="url(#' + id + '-hot)"/>');
      }
      b.v.id = id;
    }
    if (v.mode === 'ioc' && v.focus) { sp2.forEach(function (q) { if (q.id === v.focus) extra += '<g class="chx-fo"><circle cx="' + q.x + '" cy="' + q.y + '" r="30" fill="none" stroke="#14B8A6" stroke-width="3"/></g>'; }); }
    var vig = v.mode === 'ioc' || rk ? '' : '<rect width="960" height="600" fill="url(#' + id + '-vig)"/>';
    var labels = v.labels ? (rk ? labelsReal : labelsOf)(sp2.filter(function (q) { return !q.covered; }), v.labels === 'all') : '';
    var clips = '<clipPath id="' + id + '-cadh">' + (b0 && b0.geo.adhD ? '<path d="' + b0.geo.adhD + '"/>' : '<rect width="960" height="700"/>') + '</clipPath><clipPath id="' + id + '-cbl"><path d="' + sp(LIV, false) + 'L1000 700 L-60 700 Z"/></clipPath>' + (b0 ? '<clipPath id="' + id + '-cgb"><path d="' + b0.geo.gb.d + '"/></clipPath>' : '') + '<clipPath id="' + id + '-ctri"><rect width="960" height="600"/></clipPath><clipPath id="' + id + '-chdl"><path d="' + sp(HDL, true) + '"/></clipPath>';
    return '<svg class="chx' + (v.still ? ' chx-still' : '') + '" viewBox="0 0 960 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + (v.mode === 'ioc' ? 'Intraoperative cholangiogram' : 'Operative field in cholecystectomy') + '">' +
      CSS + defs(id, v).replace('</defs>', clips + '</defs>') + body + extra + vig + labels + '</svg>';
  }
  function spots(st) {
    var v = norm(st);
    if (v.mode === 'ioc') return iocSpots(v);
    return realFix(zmap(spotsOf(build(st))), realKey(st));
  }

  /* smooth transitions: tween the numeric parts of the state and redraw each frame */
  var NUM = ['fu', 'hm', 'peel', 'bed', 'inflam'];
  function numOf(st) { var v = norm(st), o = {}; NUM.forEach(function (k) { o[k] = v[k]; }); return o; }
  function mount(el, st, ms) {
    if (!el) return;
    st = st || {};
    var prev = el._chx, to = numOf(st), base = {};
    for (var k in st) if (Object.prototype.hasOwnProperty.call(st, k)) base[k] = st[k];
    base.id = (el._chxId = el._chxId || ('chm' + (++uid)));
    if (el._chxRaf) cancelAnimationFrame(el._chxRaf);
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prev || reduce || ms === 0) { el.innerHTML = draw(base); el._chx = to; el._chxRk = realKey(base); return; }
    /* photo mode: no geometric tween, crossfade the old frame out over the new one */
    var rk = realKey(base);
    if (rk || el._chxRk) {
      var old = el.innerHTML.split(base.id + '-').join(base.id + 'x-');
      el._chx = to; el._chxRk = rk;
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      el.innerHTML = draw(base) + '<div class="chx-xf" style="position:absolute;inset:0;pointer-events:none;opacity:1;transition:opacity ' + (ms || 900) + 'ms ease">' + old + '</div>';
      var xf = el.lastChild;
      requestAnimationFrame(function () { requestAnimationFrame(function () { xf.style.opacity = '0'; }); });
      setTimeout(function () { if (xf.parentNode === el) el.removeChild(xf); }, (ms || 900) + 80);
      return;
    }
    var from = prev, t0 = null, dur = ms || 900;
    function frame(ts) {
      if (t0 == null) t0 = ts;
      var k = sm((ts - t0) / dur), cur = {};
      for (var q in base) cur[q] = base[q];
      NUM.forEach(function (n) { cur[n] = lerp(from[n], to[n], k); });
      el.innerHTML = draw(cur); el._chx = cur;
      if (k < 1) el._chxRaf = requestAnimationFrame(frame); else { el._chx = to; el._chxRaf = 0; }
    }
    el._chxRaf = requestAnimationFrame(frame);
  }

  O.scenes.chole = {
    draw: draw,
    spots: spots,
    mount: mount,
    real: { dir: REAL_DIR, key: realKey, keys: Object.keys(REAL_HAVE), want: REAL_WANT },
    names: HE,
    states: {
      variant: "'normal' | 'short' (short cystic duct) | 'aberrant' (aberrant right posterior duct draining into the cystic duct) | 'twoart' (two arteries, one crossing in front of the hepatic duct) | 'mirizzi' (stone in Hartmann’s compressing the duct, frozen triangle)",
      inflam: '0..3 · 0 thin bluish wall, 1 mild, 2 TG II edematous red-purple with fibrin, 3 frozen and necrotic',
      adhesions: 'bool · omentum and duodenum stuck to the infundibulum',
      retract: "'none' | 'good' (fundus to the shoulder, Hartmann’s lateral and down: the triangle opens) | 'bad' (Hartmann’s cephalad: cystic duct and common duct in one line). fu 0..1 and hm -1..1 also work directly",
      peel: '0 peritoneum intact · 1 anterior leaf opened · 2 both leaves and fat cleared · 3 critical view of safety (CVS)',
      clips: 'bool · 2 clips on the patient side and 1 on the gallbladder side, on duct and artery', cut: 'bool · cut between the clips',
      bed: '0..1 · separation from the liver bed; 1 gallbladder free and cystic plate exposed',
      bleed: '0 | 1 pulsatile arterial bleeding | 2 blood covering the triangle', bile: 'bool · bile leak',
      injury: "null | 'cbdclip' (clips on the common duct) | 'cbdcut' (common duct divided, both ends leaking)",
      stones: 'bool · gallbladder perforated, stones and bile on the liver', mode: "'lap' | 'icg' (fluorescence) | 'ioc' (cholangiogram; cbdStone: filling defect)",
      cbdStone: 'bool · ioc only', rouviere: 'bool · Rouvière’s sulcus and the line to the base of segment 4', labels: 'bool · labels',
      real: "bool · false forces the vector drawing; otherwise a realistic image when it has a key (real.key)",
      focus: 'structure id to highlight', id: 'unique prefix for SVG ids',
      mount: 'mount(el, st, ms) · draws into an element and eases between states (retract, peel, bed, inflam)'
    }
  };
})();
