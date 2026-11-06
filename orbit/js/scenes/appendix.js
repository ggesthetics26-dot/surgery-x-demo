/* ORBIT scene: laparoscopic appendectomy field, an original 2D vector painting driven by case state.
   Camera: 30-degree scope from the umbilicus toward the right lower quadrant, head-down and left-tilt.
   Patient's right is on the viewer's LEFT: lateral wall and paracolic gutter at the left edge, caecum and
   ascending colon left-centre, terminal ileum from the right, pelvic brim and right iliac vessels at the bottom.
   viewBox 0 0 960 600. Original drawing, no patient material. Motion is transform/opacity only and stops
   under prefers-reduced-motion. */
(function () {
  'use strict';
  var O = window.ORBIT = window.ORBIT || {};
  O.scenes = O.scenes || {};

  var ID = 'apx';
  /* camera: the painting is drawn in scene units and framed by this zoom (spots are reported in screen units) */
  var CAM = { k: 1.12, tx: -52.8, ty: -146.4 };
  function cam(p) { return [p[0] * CAM.k + CAM.tx, p[1] * CAM.k + CAM.ty]; }
  function u(n) { return ID + '-' + n; }
  function url(n) { return 'url(#' + u(n) + ')'; }
  function f(x) { return Math.round(x * 10) / 10; }
  function P(p) { return f(p[0]) + ' ' + f(p[1]); }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function L2(p, q, k) { return [lerp(p[0], q[0], k), lerp(p[1], q[1], k)]; }
  function add(p, q, k) { k = k == null ? 1 : k; return [p[0] + q[0] * k, p[1] + q[1] * k]; }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function rng(s) { s = s % 2147483647; if (s <= 0) s += 2147483646; return function () { s = s * 16807 % 2147483647; return (s - 1) / 2147483646; }; }

  /* cubic bezier helpers: c = [p0, p1, p2, p3] */
  function bz(c, t) {
    var v = 1 - t, a = v * v * v, b = 3 * v * v * t, d = 3 * v * t * t, e = t * t * t;
    return [a * c[0][0] + b * c[1][0] + d * c[2][0] + e * c[3][0], a * c[0][1] + b * c[1][1] + d * c[2][1] + e * c[3][1]];
  }
  function tan(c, t) {
    var v = 1 - t, x = 3 * (v * v * (c[1][0] - c[0][0]) + 2 * v * t * (c[2][0] - c[1][0]) + t * t * (c[3][0] - c[2][0])),
      y = 3 * (v * v * (c[1][1] - c[0][1]) + 2 * v * t * (c[2][1] - c[1][1]) + t * t * (c[3][1] - c[2][1])), l = Math.sqrt(x * x + y * y) || 1;
    return [x / l, y / l];
  }
  function nor(c, t) { var d = tan(c, t); return [-d[1], d[0]]; }
  function split(c, t) {
    var a = L2(c[0], c[1], t), b = L2(c[1], c[2], t), d = L2(c[2], c[3], t), e = L2(a, b, t), g = L2(b, d, t), m = L2(e, g, t);
    return [[c[0], a, e, m], [m, g, d, c[3]]];
  }
  function part(c, t0, t1) { var l = split(c, t1)[0]; return t0 <= 0 ? l : split(l, t0 / t1)[1]; }
  function shift(c, d) { return c.map(function (p) { return add(p, d); }); }
  function cd(c) { return 'M' + P(c[0]) + 'C' + P(c[1]) + ' ' + P(c[2]) + ' ' + P(c[3]); }
  function quad(a, k, b, t) { var v = 1 - t; return [v * v * a[0] + 2 * v * t * k[0] + t * t * b[0], v * v * a[1] + 2 * v * t * k[1] + t * t * b[1]]; }

  /* ---------- palette ---------- */
  var COL = {
    bowel: { dk: '#B4675D', md: '#E39A8B', lt: '#FAD0C2' },
    bowelFar: { dk: '#9A554C', md: '#CF8676', lt: '#EDB9AA' },
    app: [
      { dk: '#9C5246', md: '#DC9481', lt: '#F7CBB6', ves: '#B5443A', vo: .45 },
      { dk: '#7E2019', md: '#C4412F', lt: '#F0866C', ves: '#8E120F', vo: .8 },
      { dk: '#5E1A20', md: '#A6393A', lt: '#DA7866', ves: '#7A0F12', vo: .85 },
      { dk: '#561820', md: '#9C3436', lt: '#D47062', ves: '#700E10', vo: .85 }
    ]
  };

  /* ---------- static anatomy (viewBox coords) ---------- */
  var CEC0 = [[[196, -12], [190, 120], [162, 230], [172, 330]], [[172, 330], [182, 420], [240, 480], [320, 478]], [[320, 478], [392, 476], [440, 432], [446, 372]], [[446, 372], [452, 322], [434, 290], [422, 250]], [[422, 250], [406, 180], [394, 90], [394, -12]]];
  var CREASE = [52, 128, 204, 278, 350];
  /* outline with haustral sacculations: the wall bulges between the creases and pinches at them */
  var CEC = (function () {
    var pts = [];
    CEC0.forEach(function (c, j) {
      for (var i = (j ? 1 : 0); i <= 18; i++) {
        var t = i / 18, p = bz(c, t), n = nor(c, t), y = p[1], amp = 0;
        if (y < 372 && (j === 0 || j >= 3)) {
          var k = 0, a = -40, b = CREASE[0];
          for (k = 0; k < CREASE.length; k++) { if (y < CREASE[k]) { b = CREASE[k]; a = k ? CREASE[k - 1] : -76; break; } a = CREASE[k]; b = a + 76; }
          var fr = clamp((y - a) / (b - a), 0, 1);
          amp = 7 * Math.pow(Math.sin(Math.PI * fr), .7) * (y > 300 ? .6 : 1);
        }
        pts.push(add(p, n, j === 0 ? amp : amp));
      }
    });
    return 'M' + pts.map(P).join(' L') + ' Z';
  })();
  var ILEUM = [[1010, 396], [830, 374], [610, 262], [418, 300]];
  var ICJ = [440, 306];
  var EIA = 'M722 500 C620 532 470 584 300 690';
  var CIA = 'M930 404 C866 446 796 478 722 500';
  var IIA = 'M722 500 C748 540 770 590 800 700';
  var EIV = 'M770 522 C660 562 500 610 360 700';
  var URE = 'M640 386 C670 440 700 482 714 504 C728 532 752 590 774 700';
  function gonad(fem) { return fem ? 'M600 430 C612 470 636 510 676 552' : 'M600 430 C604 470 590 510 562 560 C548 590 540 640 532 700'; }
  var OVARY = [716, 574];
  var TL = [[300, -12], [300, 130], [308, 280], [344, 382]];
  var TL2 = [[344, 382], [358, 420], [370, 438], [388, 452]];
  var TO = 'M208 -12 C202 120 180 240 188 330 C196 410 252 466 330 474 C356 474 374 464 388 452';
  var TM = 'M386 -12 C386 100 402 196 420 262 C434 320 424 404 388 452';

  /* ---------- geometry from state ---------- */
  function geo(st) {
    var g = { st: st };
    var v = st.variant || 'pelvic', ex = !!st.exposed, inf = clamp(st.inflam | 0, 0, 3);
    g.v = v; g.ex = ex; g.inf = inf;
    g.mob = ex && v === 'retrocecal';
    if (ex) { g.c = [[392, 448], [420, 510], [580, 440], [700, 392]]; g.sb = .15; g.R = [470, 572]; g.K = [640, 540]; }
    else if (v === 'retrocecal') { g.c = [[388, 446], [326, 478], [226, 420], [236, 236]]; g.sb = .06; g.R = null; }
    else if (v === 'subserosal') { g.c = [[388, 448], [352, 482], [262, 472], [226, 382]]; g.sb = .06; g.R = null; }
    else { g.c = [[388, 446], [404, 534], [520, 556], [650, 548]]; g.sb = .085; g.R = [520, 490]; g.K = [618, 500]; }
    g.w = (inf ? (inf === 1 ? 32 : 34) : 23) * (ex ? 1.1 : 1);
    g.B = bz(g.c, g.sb);
    g.T = g.c[3];
    g.cut = !!st.cut;
    g.sc = g.sb + .13;
    g.off = ex ? [44, -40] : [34, 26];
    g.spec = g.cut ? shift(part(g.c, g.sc + .02, 1), g.off) : null;
    g.A = function (s) { return bz(g.c, s); };
    g.tipNow = g.cut ? add(g.T, g.off) : g.T;
    g.F = g.R ? function (s) { return quad(g.R, g.K, g.T, s); } : null;
    g.omen = !!st.omentum || (inf === 3 && !ex);
    return g;
  }

  /* organic mottling: tileable value noise painted once on a canvas (browser only), reused as a pattern */
  var NOISE = null;
  function noise() {
    if (NOISE !== null) return NOISE;
    NOISE = '';
    try {
      var N = 128, cv = document.createElement('canvas'); cv.width = cv.height = N;
      var cx = cv.getContext('2d'), img = cx.createImageData(N, N), r = rng(77), oct = [[4, .55], [8, .3], [16, .15]], grids = [], D = img.data;
      oct.forEach(function (o) { var g = []; for (var i = 0; i < o[0] * o[0]; i++) g.push(r()); grids.push(g); });
      for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
        var v = 0;
        for (var k = 0; k < oct.length; k++) {
          var m = oct[k][0], gx = x / N * m, gy = y / N * m, x0 = Math.floor(gx), y0 = Math.floor(gy), fx = gx - x0, fy = gy - y0, g = grids[k];
          fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
          var a = g[(y0 % m) * m + x0 % m], b = g[(y0 % m) * m + (x0 + 1) % m], c = g[((y0 + 1) % m) * m + x0 % m], d = g[((y0 + 1) % m) * m + (x0 + 1) % m];
          v += (a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy) * oct[k][1];
        }
        var j = (y * N + x) * 4, al = clamp((v - .45) * 2.2, 0, 1);
        D[j] = 64; D[j + 1] = 14; D[j + 2] = 8; D[j + 3] = Math.round(al * 255);
      }
      cx.putImageData(img, 0, 0);
      NOISE = cv.toDataURL('image/png');
    } catch (e) { NOISE = ''; }
    return NOISE;
  }

  /* ---------- defs ---------- */
  function defs() {
    return '<defs>' +
      '<linearGradient id="' + u('bg') + '" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#C98272"/><stop offset=".5" stop-color="#B86A5C"/><stop offset="1" stop-color="#7E3A33"/></linearGradient>' +
      '<radialGradient id="' + u('pel') + '" cx="800" cy="660" r="330" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2A0C0A" stop-opacity=".85"/><stop offset=".55" stop-color="#4A1712" stop-opacity=".45"/><stop offset="1" stop-color="#4A1712" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="' + u('wall') + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B9786A"/><stop offset=".55" stop-color="#E7B4A2"/><stop offset=".9" stop-color="#D99B88"/><stop offset="1" stop-color="#9C5A4D"/></linearGradient>' +
      '<radialGradient id="' + u('cec') + '" cx="285" cy="300" r="250" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#F2C2AC"/><stop offset=".45" stop-color="#E0A08A"/><stop offset=".8" stop-color="#BF7867"/><stop offset="1" stop-color="#8A4339"/></radialGradient>' +
      '<radialGradient id="' + u('fat') + '" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#FFF0B8"/><stop offset=".45" stop-color="#EDC769"/><stop offset="1" stop-color="#BE8A35"/></radialGradient>' +
      '<radialGradient id="' + u('lob') + '" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#F8E29A" stop-opacity=".9"/><stop offset=".65" stop-color="#E6BD62" stop-opacity=".5"/><stop offset="1" stop-color="#C99A45" stop-opacity=".25"/></radialGradient>' +
      '<linearGradient id="' + u('fatB') + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9C066"/><stop offset="1" stop-color="#B98436"/></linearGradient>' +
      '<radialGradient id="' + u('pus') + '" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="#EDE0B0"/><stop offset=".55" stop-color="#C9B474"/><stop offset="1" stop-color="#8E7C44"/></radialGradient>' +
      '<radialGradient id="' + u('fae') + '" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="#C9B66A"/><stop offset=".55" stop-color="#8E7A34"/><stop offset="1" stop-color="#5A4A1C"/></radialGradient>' +
      '<radialGradient id="' + u('bld') + '" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#C21D22"/><stop offset=".6" stop-color="#8A0B10"/><stop offset="1" stop-color="#4E0507"/></radialGradient>' +
      '<radialGradient id="' + u('fec') + '" cx="38%" cy="32%" r="70%"><stop offset="0" stop-color="#A88A5E"/><stop offset=".6" stop-color="#6E5132"/><stop offset="1" stop-color="#3C2A18"/></radialGradient>' +
      '<radialGradient id="' + u('ova') + '" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#F1DDD2"/><stop offset=".6" stop-color="#D9B5A8"/><stop offset="1" stop-color="#A57C70"/></radialGradient>' +
      '<radialGradient id="' + u('gang') + '"><stop offset="0" stop-color="#22101E" stop-opacity=".95"/><stop offset=".6" stop-color="#3E1730" stop-opacity=".7"/><stop offset="1" stop-color="#5A1E36" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + u('phl') + '"><stop offset="0" stop-color="#C2281C" stop-opacity=".55"/><stop offset="1" stop-color="#C2281C" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + u('red') + '"><stop offset="0" stop-color="#D1301F" stop-opacity=".5"/><stop offset="1" stop-color="#D1301F" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + u('glw') + '"><stop offset="0" stop-color="#5CE0CF" stop-opacity=".0"/><stop offset=".55" stop-color="#5CE0CF" stop-opacity=".55"/><stop offset=".75" stop-color="#14B8A6" stop-opacity=".35"/><stop offset="1" stop-color="#14B8A6" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + u('glwG') + '"><stop offset="0" stop-color="#C8A96A" stop-opacity="0"/><stop offset=".6" stop-color="#E8D3A2" stop-opacity=".28"/><stop offset="1" stop-color="#C8A96A" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + u('dng') + '"><stop offset="0" stop-color="#FF8A6B" stop-opacity=".9"/><stop offset="1" stop-color="#FF8A6B" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="' + u('met') + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4F7F9"/><stop offset=".45" stop-color="#A2ADB5"/><stop offset="1" stop-color="#58626A"/></linearGradient>' +
      '<radialGradient id="' + u('vig') + '" cx="480" cy="300" r="566" gradientUnits="userSpaceOnUse"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset=".8" stop-color="#05080A" stop-opacity=".45"/><stop offset=".93" stop-color="#000" stop-opacity=".93"/><stop offset="1" stop-color="#000"/></radialGradient>' +
      '<radialGradient id="' + u('lamp') + '" cx="470" cy="300" r="420" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFF6EA" stop-opacity=".14"/><stop offset="1" stop-color="#FFF6EA" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="' + u('mfg') + '" gradientUnits="userSpaceOnUse" x1="0" y1="330" x2="40" y2="560"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<mask id="' + u('mfm') + '" maskUnits="userSpaceOnUse" x="-20" y="-200" width="1000" height="900"><rect x="-20" y="-200" width="1000" height="900" fill="' + url('mfg') + '"/></mask>' +
      (noise() ? '<pattern id="' + u('tx') + '" patternUnits="userSpaceOnUse" width="384" height="384"><image href="' + noise() + '" width="384" height="384"/></pattern>' : '') +
      '<clipPath id="' + u('cc') + '"><path d="' + CEC + '"/></clipPath>' +
      '<filter id="' + u('b1') + '" filterUnits="userSpaceOnUse" x="-80" y="-220" width="1120" height="1000"><feGaussianBlur stdDeviation="1.1"/></filter>' +
      '<filter id="' + u('b3') + '" filterUnits="userSpaceOnUse" x="-80" y="-220" width="1120" height="1000"><feGaussianBlur stdDeviation="3"/></filter>' +
      '<filter id="' + u('b7') + '" filterUnits="userSpaceOnUse" x="-80" y="-220" width="1120" height="1000"><feGaussianBlur stdDeviation="7"/></filter>' +
      '<filter id="' + u('b16') + '" filterUnits="userSpaceOnUse" x="-80" y="-220" width="1120" height="1000"><feGaussianBlur stdDeviation="16"/></filter>' +
      '</defs>';
  }

  var CSS = '<style>' +
    '.oxa-peri{animation:oxaPeri 7.5s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}' +
    '.oxa-peri2{animation:oxaPeri 9s ease-in-out -3s infinite;transform-box:fill-box;transform-origin:50% 50%}' +
    '@keyframes oxaPeri{0%,100%{transform:translate(0,0) scale(1,1)}50%{transform:translate(-1.5px,-1px) scale(1.006,1.018)}}' +
    '.oxa-cec{animation:oxaCec 11s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0}' +
    '@keyframes oxaCec{0%,100%{transform:scale(1,1)}50%{transform:scale(1.004,1.008)}}' +
    '.oxa-puls{animation:oxaPuls 1.05s ease-in-out infinite}' +
    '@keyframes oxaPuls{0%,100%{opacity:.15}12%{opacity:1}38%{opacity:.3}}' +
    '.oxa-sp{animation:oxaSp .95s cubic-bezier(.2,.6,.4,1) infinite}' +
    '@keyframes oxaSp{0%{transform:translate(0,0) scale(.5);opacity:0}6%{opacity:1}55%{transform:translate(-40px,-38px) scale(1)}100%{transform:translate(-78px,4px) scale(.7);opacity:0}}' +
    '.oxa-blink{animation:oxaBlink 1.05s linear infinite}' +
    '@keyframes oxaBlink{0%,100%{opacity:.15}20%{opacity:1}55%{opacity:.5}}' +
    '.oxa-drip{animation:oxaDrip 2.8s ease-in infinite}' +
    '@keyframes oxaDrip{0%{transform:translate(0,0);opacity:0}12%{opacity:.95}100%{transform:translate(0,38px);opacity:0}}' +
    '.oxa-shim{animation:oxaShim 4.5s ease-in-out infinite}' +
    '@keyframes oxaShim{0%,100%{opacity:.3}50%{opacity:.85}}' +
    '.oxa-glow{animation:oxaGlow 1.9s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}' +
    '@keyframes oxaGlow{0%,100%{opacity:.45;transform:scale(.88)}50%{opacity:1;transform:scale(1.08)}}' +
    '.oxa-dash{animation:oxaShim 2.2s ease-in-out infinite}' +
    '@media (prefers-reduced-motion:reduce){.oxa *{animation:none!important}}' +
    '</style>';

  /* ---------- painters ---------- */
  /* a wet tube: soft cast shadow, dark rim, body, light core, broken specular streak */
  function tube(c, w, C, o) {
    o = o || {};
    var d = cd(c), s = '';
    if (!o.noShadow) s += '<path d="' + d + '" stroke="#2A0806" stroke-opacity="' + (o.sh || .5) + '" stroke-width="' + f(w + 10) + '" fill="none" stroke-linecap="round" transform="translate(' + (o.sx || 4) + ' ' + (o.sy || 9) + ')" filter="' + url('b7') + '"/>';
    s += '<path d="' + d + '" stroke="' + C.dk + '" stroke-width="' + f(w) + '" fill="none" stroke-linecap="round"/>' +
      '<path d="' + d + '" stroke="' + C.md + '" stroke-opacity=".55" stroke-width="' + f(w * .92) + '" fill="none" stroke-linecap="round"/>' +
      '<path d="' + d + '" stroke="' + C.md + '" stroke-width="' + f(w * .8) + '" fill="none" stroke-linecap="round"/>';
    var tr = ' transform="translate(' + f(-w * .1) + ' ' + f(-w * .2) + ')"';
    s += '<g filter="' + url('b3') + '"><path d="' + d + '" stroke="' + C.lt + '" stroke-opacity=".6" stroke-width="' + f(w * .42) + '" fill="none" stroke-linecap="round" transform="translate(' + f(-w * .06) + ' ' + f(-w * .1) + ')"/>' +
      (o.noSpec ? '' : '<path d="' + d + '" stroke="#FFF8EE" stroke-opacity=".5" stroke-width="' + f(Math.max(3, w * .2)) + '" fill="none" stroke-linecap="round" stroke-dasharray="' + (o.da || (f(w * 2.2) + ' ' + f(w * 1.1) + ' ' + f(w * .9) + ' ' + f(w * 1.7))) + '"' + tr + '/>') + '</g>';
    if (!o.noSpec) {
      var r = rng(Math.round(c[0][0] * 7 + c[3][1] * 13 + w)), gl = '';
      for (var i = 0; i < 6; i++) {
        var t = .08 + r() * .84, p = add(add(bz(c, t), [-w * .1, -w * .2]), nor(c, t), (r() - .5) * w * .12), dd = tan(c, t);
        gl += '<ellipse cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" rx="' + f(w * (.05 + r() * .1)) + '" ry="' + f(.7 + r() * .7) + '" transform="rotate(' + f(Math.atan2(dd[1], dd[0]) * 180 / Math.PI) + ' ' + P(p) + ')" fill="#fff" opacity="' + f(.5 + r() * .4) + '"/>';
      }
      s += gl;
    }
    return s;
  }

  function lobules(r, n, x, y, w, h, rmin, rmax, op) {
    var s = '';
    for (var i = 0; i < n; i++) {
      var cx = x + r() * w, cy = y + r() * h, rr = rmin + r() * (rmax - rmin);
      s += '<ellipse cx="' + f(cx) + '" cy="' + f(cy) + '" rx="' + f(rr) + '" ry="' + f(rr * (.7 + r() * .3)) + '" transform="rotate(' + f(r() * 180) + ' ' + f(cx) + ' ' + f(cy) + ')" fill="' + url('lob') + '" stroke="#B5852F" stroke-opacity=".28" stroke-width=".8"/>';
      if (r() < .1) s += '<ellipse cx="' + f(cx - rr * .3) + '" cy="' + f(cy - rr * .35) + '" rx="' + f(rr * .22) + '" ry="' + f(rr * .1) + '" fill="#FFFBEA" opacity=".75"/>';
    }
    return op ? '<g opacity="' + op + '">' + s + '</g>' : s;
  }
  function glints(r, n, x, y, w, h) {
    var s = '';
    for (var i = 0; i < n; i++) s += '<ellipse cx="' + f(x + r() * w) + '" cy="' + f(y + r() * h) + '" rx="' + f(1.2 + r() * 2.6) + '" ry="' + f(.8 + r() * 1.2) + '" fill="#FFFDF4" opacity="' + f(.55 + r() * .4) + '"/>';
    return s;
  }
  /* smooth irregular closed blob (puddles, omentum cuffs) through jittered polar points */
  function blob(cx, cy, rx, ry, seed, n, jit) {
    var r = rng(seed), pts = [], i;
    n = n || 9; jit = jit == null ? .28 : jit;
    for (i = 0; i < n; i++) { var a = i / n * 6.2832, k = 1 + (r() - .5) * jit * 2; pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
    return smooth(pts, true);
  }
  function smooth(pts, closed) {
    var n = pts.length, d = 'M' + P(pts[0]), i;
    for (i = 0; i < (closed ? n : n - 1); i++) {
      var p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      if (!closed) { p0 = pts[Math.max(i - 1, 0)]; p3 = pts[Math.min(i + 2, n - 1)]; }
      d += 'C' + P([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]) + ' ' + P([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]) + ' ' + P(p2);
    }
    return d + (closed ? 'Z' : '');
  }
  /* a glossy fluid puddle: rim, body, meniscus light, moving reflection */
  function puddle(cx, cy, rx, ry, seed, kind) {
    var d = blob(cx, cy, rx, ry, seed, 14, .26), g = kind === 'b' ? 'bld' : kind === 'f' ? 'fae' : 'pus';
    var rim = kind === 'b' ? '#3A0204' : kind === 'f' ? '#4A3A12' : '#7A6A2A';
    return '<path d="' + d + '" fill="' + rim + '" opacity=".3" transform="translate(0 3)" filter="' + url('b7') + '"/>' +
      '<path d="' + d + '" fill="' + url(g) + '" opacity=".78" filter="' + url('b3') + '"/>' +
      '<path d="' + blob(cx, cy, rx * .9, ry * .8, seed, 12, .16) + '" fill="' + url(g) + '" opacity=".6" filter="' + url('b1') + '"/>' +
      '<path d="' + blob(cx - rx * .1, cy - ry * .2, rx * .7, ry * .45, seed + 3, 8, .2) + '" fill="#fff" opacity=".12" filter="' + url('b3') + '"/>' +
      '<ellipse class="oxa-shim" cx="' + f(cx - rx * .25) + '" cy="' + f(cy - ry * .35) + '" rx="' + f(rx * .35) + '" ry="' + f(Math.max(2, ry * .12)) + '" fill="#FFFDF2" opacity=".7" filter="' + url('b1') + '"/>' +
      '<ellipse cx="' + f(cx + rx * .3) + '" cy="' + f(cy - ry * .2) + '" rx="' + f(rx * .08) + '" ry="1.6" fill="#fff" opacity=".85"/>';
  }
  /* lobulated outline: the smooth shape through pts, with small fat lobules bulging outward along the edge */
  function scallop(pts, step, amp, seed) {
    var r = rng(seed), n = pts.length, cx = 0, cy = 0, i, dense = [];
    pts.forEach(function (p) { cx += p[0] / n; cy += p[1] / n; });
    for (i = 0; i < n; i++) {
      var p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      var c = [p1, [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6], p2];
      var L = Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2)), m = Math.max(1, Math.round(L / step));
      for (var j = 0; j < m; j++) dense.push(bz(c, j / m));
    }
    var d = 'M' + P(dense[0]);
    for (i = 0; i < dense.length; i++) {
      var a = dense[i], b = dense[(i + 1) % dense.length], mid = L2(a, b, .5), ox = mid[0] - cx, oy = mid[1] - cy, ol = Math.sqrt(ox * ox + oy * oy) || 1;
      var k = amp * (.4 + r() * .8);
      d += 'Q' + P([mid[0] + ox / ol * k, mid[1] + oy / ol * k]) + ' ' + P(b);
    }
    return d + 'Z';
  }
  function vessel(d, w, col, op) {
    return '<path d="' + d + '" stroke="' + (col || '#9E2A24') + '" stroke-width="' + w + '" stroke-opacity="' + (op == null ? .8 : op) + '" fill="none" stroke-linecap="round"/>';
  }

  /* background: posterior parietal peritoneum, retroperitoneal structures under a wet translucent veil */
  function retro(st, g) {
    var fem = !!st.female;
    var s = '<rect x="-20" y="-200" width="1000" height="900" fill="' + url('bg') + '"/>';
    var r = rng(7);
    s += '<g filter="' + url('b16') + '" opacity=".55">' +
      '<ellipse cx="600" cy="200" rx="260" ry="150" fill="#D9958A"/><ellipse cx="520" cy="500" rx="200" ry="70" fill="#D89484"/><ellipse cx="300" cy="560" rx="120" ry="50" fill="#9A4E42"/><ellipse cx="880" cy="560" rx="180" ry="90" fill="#5A221C"/></g>';
    /* fine subperitoneal vessels */
    var vs = '';
    for (var i = 0; i < 14; i++) {
      var x = 430 + r() * 520, y = 360 + r() * 240, a = r() * 6.28, l = 30 + r() * 60;
      vs += 'M' + f(x) + ' ' + f(y) + ' q' + f(Math.cos(a) * l * .5 + 8) + ' ' + f(Math.sin(a) * l * .5 - 6) + ' ' + f(Math.cos(a) * l) + ' ' + f(Math.sin(a) * l);
    }
    s += '<path d="' + vs + '" stroke="#8E2A24" stroke-width="1" stroke-opacity=".35" fill="none"/>';
    /* iliac vessels, ureter, gonadal: seen through peritoneum */
    var dop = st.danger ? 1 : .8;
    s += '<g opacity="' + dop + '">' +
      '<g filter="' + url('b3') + '">' +
      '<path d="' + EIV + '" stroke="#3D3F78" stroke-width="30" fill="none" stroke-linecap="round" opacity=".75"/>' +
      '<path d="' + CIA + ' ' + EIA.replace('M722 500', '') + '" stroke="#B4473C" stroke-width="22" fill="none" stroke-linecap="round" opacity=".85"/>' +
      '<path d="' + IIA + '" stroke="#A8443A" stroke-width="15" fill="none" stroke-linecap="round" opacity=".75"/>' +
      '</g>' +
      '<path d="' + CIA + ' ' + EIA.replace('M722 500', '') + '" stroke="#E7907F" stroke-width="5" fill="none" stroke-linecap="round" opacity=".55" transform="translate(-3 -5)" filter="' + url('b3') + '"/>' +
      '<path d="' + EIV + '" stroke="#8C90C4" stroke-width="6" fill="none" opacity=".35" transform="translate(-3 -6)" filter="' + url('b3') + '"/>' +
      '<path class="oxa-puls" d="' + CIA + ' ' + EIA.replace('M722 500', '') + '" stroke="#FFB2A0" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5" filter="' + url('b3') + '"/>' +
      '<g filter="' + url('b3') + '"><path d="' + gonad(fem) + '" stroke="#4E4F8C" stroke-width="8" fill="none" stroke-linecap="round" opacity=".6"/>' +
      '<path d="' + gonad(fem) + '" stroke="#B94A40" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6" transform="translate(5 0)"/>' +
      '<path d="' + URE + '" stroke="#B59E7A" stroke-width="15" fill="none" stroke-linecap="round" opacity=".7"/></g>' +
      '<path d="' + URE + '" stroke="#EADCBE" stroke-width="7" fill="none" stroke-linecap="round" opacity=".5" filter="' + url('b1') + '"/>' +
      '</g>';
    /* the veil: glossy translucent peritoneum */
    s += '<path d="M300 470 C460 430 700 390 980 370 V720 H260 Z" fill="#F2D2C4" opacity=".2" filter="' + url('b16') + '"/>' +
      '<path d="M380 560 C520 520 700 470 940 440" stroke="#FFF8F0" stroke-width="10" stroke-opacity=".18" fill="none" filter="' + url('b7') + '"/>';
    s += '<rect x="-20" y="-200" width="1000" height="900" fill="' + url('pel') + '"/>';
    return s;
  }

  function ovary() {
    var x = OVARY[0], y = OVARY[1], r = rng(19), fol = '';
    for (var i = 0; i < 9; i++) { var a = r() * 6.28, d = 4 + r() * 16; fol += '<ellipse cx="' + f(x + Math.cos(a) * d * 1.5) + '" cy="' + f(y + Math.sin(a) * d * .8) + '" rx="' + f(3 + r() * 4) + '" ry="' + f(2.6 + r() * 3) + '" fill="#F6E6DC" opacity=".5"/>'; }
    var tube = 'M1000 440 C950 446 910 470 880 500 C860 520 846 512 830 520 C808 532 790 540 768 540';
    return '<g>' +
      '<path d="M1000 460 C940 480 860 520 ' + (x + 30) + ' ' + (y - 6) + ' L' + (x + 10) + ' ' + (y + 6) + ' C860 540 940 500 1000 490 Z" fill="#E3B3A6" opacity=".45" filter="' + url('b1') + '"/>' +
      '<ellipse cx="' + (x + 6) + '" cy="' + (y + 14) + '" rx="46" ry="22" fill="#2A0806" opacity=".45" filter="' + url('b7') + '"/>' +
      '<ellipse cx="' + x + '" cy="' + y + '" rx="42" ry="25" transform="rotate(-14 ' + x + ' ' + y + ')" fill="' + url('ova') + '" stroke="#9E7468" stroke-width="1"/>' +
      '<g transform="rotate(-14 ' + x + ' ' + y + ')" filter="' + url('b1') + '">' + fol + '</g>' +
      '<ellipse cx="' + (x + 14) + '" cy="' + (y - 4) + '" rx="7" ry="5.5" fill="#D9D2E6" opacity=".55"/><ellipse cx="' + (x + 12) + '" cy="' + (y - 6) + '" rx="2.4" ry="1.4" fill="#fff" opacity=".8"/>' +
      '<ellipse cx="' + (x - 20) + '" cy="' + (y + 6) + '" rx="5" ry="4" fill="#D9D2E6" opacity=".45"/>' +
      '<ellipse cx="' + (x - 10) + '" cy="' + (y - 11) + '" rx="16" ry="4" transform="rotate(-14 ' + x + ' ' + y + ')" fill="#fff" opacity=".45" filter="' + url('b1') + '"/>' +
      '<path d="' + tube + '" stroke="#2A0806" stroke-width="20" fill="none" stroke-linecap="round" opacity=".35" transform="translate(3 9)" filter="' + url('b3') + '"/>' +
      '<path d="' + tube + '" stroke="#A8625A" stroke-width="21" fill="none" stroke-linecap="round"/>' +
      '<path d="' + tube + '" stroke="#E0A093" stroke-width="16" fill="none" stroke-linecap="round" filter="' + url('b1') + '"/>' +
      '<path d="' + tube + '" stroke="#FFF2EA" stroke-width="2.4" stroke-opacity=".5" fill="none" transform="translate(-1 -4)" filter="' + url('b1') + '"/>' +
      '<path d="' + scallop([[776, 526], [760, 524], [744, 532], [738, 548], [748, 562], [766, 562], [780, 550]], 6, 4, 23) + '" fill="#D9877A" stroke="#A85A50" stroke-width=".8" opacity=".95"/>' +
      '<path d="M776 532 l-22 4 M776 538 l-26 14 M778 544 l-16 16 M770 530 l-20 -2" stroke="#B4655A" stroke-width="1" opacity=".6"/>' +
      '</g>';
  }
  /* lateral abdominal wall and right paracolic gutter */
  function wall(st, g) {
    var s = '<path d="M-30 -200 H190 C178 -60 150 140 124 300 C116 360 132 400 150 420 C168 500 150 600 126 720 H-30 Z" fill="' + url('wall') + '"/>';
    s += '<path d="M10 40 C40 160 30 300 60 440 C70 520 60 600 50 720 M40 0 C70 140 66 320 92 470 C100 560 90 640 80 720 M80 20 C100 150 98 300 118 430" stroke="#A85E52" stroke-width="2" stroke-opacity=".18" fill="none"/>' +
      '<path d="M120 0 C100 160 86 300 112 440 C124 520 110 620 96 720" stroke="#FFF6EE" stroke-width="9" stroke-opacity=".25" fill="none" filter="' + url('b7') + '"/>' +
      '<path d="M150 -10 C128 150 108 300 136 430 C150 500 140 600 124 720" stroke="#5E231C" stroke-width="16" stroke-opacity=".45" fill="none" filter="' + url('b7') + '"/>';
    /* white line of Toldt along the lateral colon */
    var tol = 'M186 -10 C180 130 160 240 166 330 C172 400 196 446 236 468';
    if (g.mob) {
      var raw = 'M146 -40 C136 140 116 260 132 352 C146 436 200 494 262 504 L312 488 C240 472 192 432 178 342 C168 250 188 130 196 -40 Z';
      s += '<path d="' + raw + '" fill="#E2BE98" opacity=".9" filter="' + url('b3') + '"/>' +
        '<path d="' + raw + '" fill="' + url('lob') + '" opacity=".35"/>' +
        '<path d="M146 -40 C136 140 116 260 132 352 C146 436 200 494 262 504" stroke="#FFF2E6" stroke-width="3" fill="none" opacity=".7" filter="' + url('b1') + '"/>' +
        '<path d="M146 -40 C136 140 116 260 132 352 C146 436 200 494 262 504" stroke="#8E3A2E" stroke-width="1.2" fill="none" opacity=".6" transform="translate(-3 2)"/>';
      var r = rng(31), sk = '';
      for (var i = 0; i < 16; i++) { var y = 20 + i * 28, x = 150 + Math.sin(i * .5) * 10 - (y > 300 ? (y - 300) * -.1 : 0); sk += 'M' + f(x) + ' ' + f(y) + ' q' + f(10 + r() * 10) + ' ' + f(-6 + r() * 12) + ' ' + f(22 + r() * 10) + ' ' + f(-4 + r() * 8); }
      s += '<path d="' + sk + '" stroke="#FFF8EE" stroke-width="1" stroke-opacity=".55" fill="none" filter="' + url('b1') + '"/>';
    } else s += '<path d="' + tol + '" stroke="#FFF4EA" stroke-width="3" stroke-opacity=".55" fill="none" filter="' + url('b1') + '"/>';
    return s;
  }

  /* small-bowel loops packed toward the upper abdomen, on their mesentery */
  function upper(st, g) {
    var s = '<path d="M360 -10 H970 V420 C880 400 800 380 720 352 C640 324 560 300 470 300 C420 260 380 120 360 -10 Z" fill="#9A6A3A"/>';
    var r = rng(11);
    s += lobules(r, 120, 380, -10, 590, 360, 9, 20, .8);
    s += '<path d="M360 -10 H970 V420 C880 400 800 380 720 352 C640 324 560 300 470 300 C420 260 380 120 360 -10 Z" fill="#3A140C" opacity=".35"/>';
    s += '<path d="M700 200 C690 240 650 270 600 290 M840 250 C820 290 790 320 740 340" stroke="#A3352B" stroke-width="2.2" stroke-opacity=".5" fill="none"/>';
    s += '<g>' +
      tube([[1030, 150], [880, 250], [760, 40], [655, 54]], 70, COL.bowelFar, { sh: .6 }) +
      tube([[372, 60], [520, -100], [760, 210], [1030, 40]], 76, COL.bowelFar, { sh: .6 }) +
      tube([[372, 226], [480, 130], [620, 310], [1030, 300]], 68, COL.bowelFar, { sh: .6 }) + '</g>';
    if (st.meckel) {
      var mc = [[420, 170], [600, 110], [800, 270], [1030, 190]];
      var tm = .36, mp = bz(mc, tm), mn = [-.78, .62], td = [.62, .78], mt = add(mp, mn, 70);
      s += '<g class="oxa-peri">' + tube(mc, 54, COL.bowel) +
        tube([add(mp, mn, 4), add(mp, mn, 36), add(mt, td, 4), mt], 34, COL.bowel, { sh: .45 }) +
        '<ellipse cx="' + f(add(mp, mn, 14)[0]) + '" cy="' + f(add(mp, mn, 14)[1]) + '" rx="22" ry="15" transform="rotate(' + f(Math.atan2(mn[1], mn[0]) * 180 / Math.PI) + ' ' + P(add(mp, mn, 14)) + ')" fill="' + COL.bowel.md + '" filter="' + url('b3') + '"/>' +
        '<path d="M' + P(add(mp, mn, 22)) + ' Q' + P(add(add(mp, mn, 46), td, 5)) + ' ' + P(add(mt, mn, -8)) + '" stroke="#A3352B" stroke-width="1.4" fill="none" opacity=".6"/></g>';
      g.meckel = add(mp, mn, 50);
    }
    return s;
  }

  /* mesentery of the terminal ileum with ileocolic vessels */
  function mesIleum(st, g) {
    var r = rng(23);
    var s = '<g mask="' + url('mfm') + '"><path d="M420 318 C520 318 610 296 710 330 C810 362 900 398 1000 416 V580 C880 550 760 506 650 476 C570 456 500 440 446 410 Z" fill="' + url('fatB') + '"/>' +
      lobules(r, 70, 440, 330, 560, 220, 8, 16, .9) + '</g>';
    s += '<path d="M446 404 C500 432 570 448 650 468 C760 498 880 540 1000 570" stroke="#5A2216" stroke-width="22" stroke-opacity=".22" fill="none" filter="' + url('b16') + '"/>' +
      '<g filter="' + url('b1') + '" opacity=".75"><path d="M985 482 C860 460 720 432 610 404 C560 392 512 380 470 366" stroke="#45468A" stroke-width="7" fill="none" opacity=".5"/>' +
      '<path d="M980 470 C860 448 720 420 610 392 C560 380 510 368 466 352" stroke="#8E241C" stroke-width="6" fill="none"/>' +
      '<path d="M980 468 C860 446 720 418 610 390 C560 378 510 366 466 350" stroke="#E0675A" stroke-width="1.6" fill="none"/></g>' +
      '<path d="M840 444 C830 410 820 390 800 372 C780 360 760 360 740 352 M720 420 C716 392 700 370 680 350 C660 340 640 336 620 326 M610 392 C606 370 590 350 570 336 C560 330 546 328 530 326 M800 372 C790 356 790 350 800 340 M680 350 C672 340 672 332 680 322 M570 336 C560 326 560 320 566 312" stroke="#B5362C" stroke-width="1.8" fill="none" opacity=".7"/>';
    s += '<g mask="' + url('mfm') + '">' + lobules(r, 26, 450, 340, 520, 120, 7, 13, .5) + '</g>';
    s += '<path d="M440 360 C540 350 640 360 760 400" stroke="#FFF8E4" stroke-width="6" stroke-opacity=".25" fill="none" filter="' + url('b3') + '"/>';
    return s;
  }

  /* mesoappendix: triangle between appendix, root and free edge; the appendicular artery runs in the free edge */
  function meso(st, g) {
    if (!g.R) return '';
    var k = clamp(+st.meso || 0, 0, 1), sCut = 1 - k * (1 - g.sb);
    var N = 16, edge = [], i, s0;
    for (i = 0; i <= N; i++) {
      s0 = g.sb + (1 - g.sb) * i / N;
      var a = g.A(s0), fr = g.F((s0 - g.sb) / (1 - g.sb));
      edge.push(s0 > sCut + 1e-6 ? L2(a, fr, .24) : a);
    }
    var fe = [];
    for (i = N; i >= 0; i--) fe.push(g.F(i / N));
    var rc = add(L2(g.B, g.R, .5), [26, -6]);
    var poly = 'M' + P(g.B) + ' L' + edge.map(P).join(' ') + ' L' + fe.map(P).join(' ') + ' Q' + P(rc) + ' ' + P(g.B) + ' Z';
    var s = '<path d="' + poly + '" fill="#2A0806" opacity=".35" transform="translate(6 10)" filter="' + url('b7') + '"/>' +
      '<path d="' + poly + '" fill="#E4B862" fill-opacity="' + (g.ex ? .82 : .75) + '" stroke="#FFF2CC" stroke-opacity=".5" stroke-width="1"/>';
    var r = rng(41), lb = '';
    for (i = 0; i < (g.ex ? 26 : 10); i++) {
      var a1 = r(), b1 = r(); if (a1 + b1 > 1) { a1 = 1 - a1; b1 = 1 - b1; }
      var mid = g.A(g.sb + (1 - g.sb) * (.15 + .8 * r()));
      var p = add(add(g.B, [g.T[0] - g.B[0], g.T[1] - g.B[1]], a1 * .9), [g.R[0] - g.B[0], g.R[1] - g.B[1]], b1 * .9);
      p = L2(p, mid, .15);
      lb += '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="' + f(5 + r() * 9) + '" fill="' + url('lob') + '"/>';
    }
    s += '<g clip-path="url(#' + u('mc') + ')"><clipPath id="' + u('mc') + '"><path d="' + poly + '"/></clipPath>' + lb +
      '<path d="M' + P(L2(g.B, g.R, .3)) + ' Q' + P(L2(g.B, g.T, .5)) + ' ' + P(L2(g.T, g.K, .2)) + '" stroke="#FFF9E6" stroke-width="10" stroke-opacity=".3" fill="none" filter="' + url('b7') + '"/></g>';
    /* artery along the free edge, branches to the appendix */
    var art = 'M' + P(g.R) + ' Q' + P(g.K) + ' ' + P(g.T);
    var full = k >= .999, bl = '';
    var inner = []; for (i = 0; i <= 12; i++) inner.push(add(g.F(i / 12), [(g.B[0] - g.F(i / 12)[0]) * .06, (g.B[1] - g.F(i / 12)[1]) * .06]));
    var artIn = 'M' + inner.map(P).join(' L');
    var dead = full ? .55 : .9;
    s += '<path d="' + artIn + '" stroke="#6E120F" stroke-width="5.5" fill="none" stroke-linecap="round" opacity="' + dead + '"/>' +
      '<path d="' + artIn + '" stroke="' + (full ? '#C98A7E' : '#D63A2E') + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
    if (!full) s += '<path class="oxa-puls" d="' + artIn + '" stroke="#FF9D86" stroke-width="2" fill="none" stroke-linecap="round" filter="' + url('b1') + '"/>';
    s += '<path d="' + artIn + '" stroke="#5A5CA0" stroke-width="2" fill="none" opacity=".55" transform="translate(3 4)"/>';
    for (i = 1; i <= 4; i++) {
      var sa = g.sb + (1 - g.sb) * (i / 5), q = inner[Math.round(i / 5 * 12)], ap = g.A(sa);
      var cut = sa > sCut;
      var endp = cut ? L2(ap, g.F((sa - g.sb) / (1 - g.sb)), .3) : ap;
      bl += '<path d="M' + P(q) + ' Q' + P(add(L2(q, endp, .5), nor(g.c, sa), 10)) + ' ' + P(endp) + '" stroke="' + (full ? '#C98A7E' : '#B8342A') + '" stroke-width="1.4" fill="none" opacity=".6"/>';
      if (cut) bl += '<circle cx="' + f(endp[0]) + '" cy="' + f(endp[1]) + '" r="2.6" fill="#3A1A10"/>';
    }
    s += bl;
    /* sealed edge along the divided meso */
    if (k > 0) {
      var se = []; for (i = 0; i <= N; i++) { s0 = g.sb + (1 - g.sb) * i / N; if (s0 >= sCut - 1e-6) se.push(edge[i]); }
      if (se.length > 1) s += '<path d="M' + se.map(P).join(' L') + '" stroke="#4A2614" stroke-width="3.2" fill="none" stroke-linecap="round" opacity=".9"/>' +
        '<path d="M' + se.map(P).join(' L') + '" stroke="#C9A27A" stroke-width="1" fill="none" stroke-dasharray="2 3" opacity=".8"/>';
    }
    if (full) {
      var c1 = g.F(.12), c2 = g.F(.2), tn = tan([g.R, g.K, g.K, g.T], .1), nn = [-tn[1], tn[0]];
      s += clipMark(c1, nn, 13) + clipMark(add(c1, tn, -10), nn, 13) + '<circle cx="' + f(c2[0]) + '" cy="' + f(c2[1]) + '" r="5" fill="#3A1A10" opacity=".75"/>';
    }
    g.art = g.F(.45); g.mesoP = L2(L2(g.B, g.T, .55), g.R, .38);
    return s;
  }

  function clipMark(p, n, l) {
    var a = Math.atan2(n[1], n[0]) * 180 / Math.PI;
    return '<g transform="translate(' + P(p) + ') rotate(' + f(a) + ')"><rect x="' + f(-l / 2) + '" y="-2.4" width="' + l + '" height="4.8" rx="1.8" fill="' + url('met') + '" stroke="#3E474E" stroke-width=".6"/><rect x="' + f(-l / 2 + 1) + '" y="-1.6" width="' + f(l - 2) + '" height="1.2" fill="#fff" opacity=".7"/></g>';
  }

  /* the appendix: tube with serosal vessels, fibrin, gangrene; segment c */
  function appendix(st, g, c, specimen) {
    var C = COL.app[g.inf], w = g.w, s = '';
    s += tube(c, w, C, { sh: .55, da: f(w * 1.2) + ' ' + f(w * .7) + ' ' + f(w * .4) + ' ' + f(w * 1.8) });
    /* serosal vessels: fine branches from the mesenteric side */
    var r = rng(specimen ? 77 : 53), vv = '';
    var nV = g.inf ? 14 : 9;
    for (var i = 0; i < nV; i++) {
      var t = .04 + .92 * i / nV + r() * .02, p = bz(c, t), n = nor(c, t), dd = tan(c, t), side = (r() > .5 ? 1 : -1);
      var p0 = add(p, n, side * w * .44), p1 = add(add(p, n, side * w * .2), dd, (r() - .5) * w * .5), p2 = add(add(p, n, side * w * (r() * .1 - .05)), dd, (r() - .5) * w * .7);
      vv += 'M' + P(p0) + ' Q' + P(p1) + ' ' + P(p2);
    }
    s += '<path d="' + vv + '" stroke="' + C.ves + '" stroke-width="' + (g.inf ? 1.4 : .8) + '" stroke-opacity="' + (g.inf ? C.vo : .3) + '" fill="none" stroke-linecap="round"/>';
    if (g.inf) {
      var fb = '';
      for (i = 0; i < 3 + g.inf * 2; i++) {
        var tt = .15 + r() * .8, pp = add(bz(c, tt), nor(c, tt), (r() - .5) * w * .7), an = Math.atan2(tan(c, tt)[1], tan(c, tt)[0]) * 180 / Math.PI;
        fb += '<ellipse cx="' + f(pp[0]) + '" cy="' + f(pp[1]) + '" rx="' + f(4 + r() * 7) + '" ry="' + f(1.6 + r() * 2.4) + '" transform="rotate(' + f(an + (r() - .5) * 40) + ' ' + P(pp) + ')" fill="#F1E6BE" opacity="' + f(.3 + r() * .3) + '"/>';
      }
      s += '<g filter="' + url('b1') + '">' + fb + '</g>';
    }
    if (g.inf >= 2) {
      var gg = '', spots = [[.72, .1, 1.1], [.86, -.15, 1.3], [.95, .05, .9], [.6, -.2, .6]];
      spots.forEach(function (q) { if (q[0] < (specimen ? 0 : 0)) return; var pp = add(bz(c, q[0]), nor(c, q[0]), q[1] * w); gg += '<ellipse cx="' + f(pp[0]) + '" cy="' + f(pp[1]) + '" rx="' + f(w * .62 * q[2]) + '" ry="' + f(w * .4 * q[2]) + '" fill="' + url('gang') + '"/>'; });
      s += gg;
    }
    return s;
  }

  /* devices at the base: endoloops, staple line, polymer clips */
  function loopMark(c, t, w, col) {
    var p = bz(c, t), n = nor(c, t), a = Math.atan2(n[1], n[0]) * 180 / Math.PI, kn = add(p, n, w * .55);
    return '<g><ellipse cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" rx="' + f(w * .56) + '" ry="3.2" transform="rotate(' + f(a) + ' ' + P(p) + ')" fill="none" stroke="#2A1240" stroke-width="3.6" opacity=".55"/>' +
      '<ellipse cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" rx="' + f(w * .56) + '" ry="3.2" transform="rotate(' + f(a) + ' ' + P(p) + ')" fill="none" stroke="' + col + '" stroke-width="2.4"/>' +
      '<circle cx="' + f(kn[0]) + '" cy="' + f(kn[1]) + '" r="3.4" fill="' + col + '" stroke="#2A1240" stroke-width=".8"/>' +
      '<path d="M' + P(kn) + ' l' + f(n[0] * 9 + 3) + ' ' + f(n[1] * 9 + 2) + ' M' + P(kn) + ' l' + f(n[0] * 8 - 3) + ' ' + f(n[1] * 8 + 3) + '" stroke="' + col + '" stroke-width="1.6" stroke-linecap="round"/></g>';
  }
  function polyClip(c, t, w) {
    var p = bz(c, t), n = nor(c, t), a = Math.atan2(n[1], n[0]) * 180 / Math.PI, l = w * 1.5;
    return '<g transform="translate(' + P(p) + ') rotate(' + f(a) + ')"><rect x="' + f(-l / 2 - 2) + '" y="-3.6" width="' + f(l + 4) + '" height="7.2" rx="3" fill="#2B1446" opacity=".5" transform="translate(2 3)"/>' +
      '<rect x="' + f(-l / 2) + '" y="-3.4" width="' + f(l) + '" height="6.8" rx="3" fill="#7C4FC0" stroke="#3B2167" stroke-width=".8"/>' +
      '<rect x="' + f(-l / 2 + 2) + '" y="-2.4" width="' + f(l - 6) + '" height="1.4" fill="#E2D2FF" opacity=".8"/><circle cx="' + f(l / 2 - 2) + '" cy="0" r="2.2" fill="#E9E0FA"/></g>';
  }
  function stapleLine(p, n, l, two) {
    var a = Math.atan2(n[1], n[0]) * 180 / Math.PI, s = '<g transform="translate(' + P(p) + ') rotate(' + f(a) + ')">';
    s += '<rect x="' + f(-l / 2) + '" y="' + (two ? -7 : -4) + '" width="' + l + '" height="' + (two ? 14 : 8) + '" rx="3" fill="#8A4A3C" opacity=".55"/>';
    var rows = two ? [-5, -2, 2, 5] : [-2.4, 0, 2.4], st = '';
    rows.forEach(function (y, j) { for (var x = -l / 2 + 3 + (j % 2) * 2.5; x < l / 2 - 2; x += 5) st += 'M' + f(x) + ' ' + y + 'h3'; });
    s += '<path d="' + st + '" stroke="#E8EEF2" stroke-width="1.3" stroke-linecap="round"/><path d="' + st + '" stroke="#5E6870" stroke-width=".5" transform="translate(0 .8)"/></g>';
    return s;
  }

  function baseDevices(st, g) {
    var b = st.base, s = '', c = g.c, w = g.w, sb = g.sb;
    if (!b) return '';
    if (b === 'loops') {
      var leak = g.cut && st.stump === 'leak';
      if (!leak) s += loopMark(c, sb + .02, w, '#8A63D2') + loopMark(c, sb + .07, w, '#8A63D2');
      else {
        s += loopMark(c, sb + .02, w, '#8A63D2');
        var lp = add(g.B, [60, 70]);
        s += '<path d="M' + P(lp) + ' c14 -10 34 -8 40 4 c4 10 -16 16 -30 10 c-10 -4 -14 -10 -10 -14" stroke="#8A63D2" stroke-width="2.4" fill="none"/>';
      }
      if (!g.cut) s += loopMark(c, sb + .2, w, '#8A63D2');
      else s += loopMark(g.spec, .03, w, '#8A63D2');
    } else if (b === 'clips') {
      s += polyClip(c, sb + .02, w) + polyClip(c, sb + .07, w);
      s += g.cut ? polyClip(g.spec, .03, w) : polyClip(c, sb + .2, w);
    } else if (b === 'stapler') {
      var p = bz(c, sb - .005), n = nor(c, sb);
      if (st.stump !== 'leak' || !g.cut) s += stapleLine(add(p, tan(c, sb), -4), n, w * 1.9, g.cut);
      if (g.cut) s += stapleLine(add(g.spec[0], tan(g.spec, 0), 3), nor(g.spec, 0), w * 1.4, false);
    }
    return s;
  }

  /* cut end: mucosa ring and lumen */
  function cutEnd(p, d, w, open) {
    var a = Math.atan2(d[1], d[0]) * 180 / Math.PI;
    return '<g transform="translate(' + P(p) + ') rotate(' + f(a) + ')"><ellipse rx="' + f(w * .2) + '" ry="' + f(w * .46) + '" fill="#E58C84" stroke="#7E2019" stroke-width="1"/>' +
      '<ellipse rx="' + f(w * .1) + '" ry="' + f(w * (open ? .28 : .16)) + '" fill="#3A0E0C"/>' +
      '<ellipse cx="-2" rx="' + f(w * .2) + '" ry="' + f(w * .46) + '" fill="none" stroke="#3A1A10" stroke-width="1.6" opacity=".6"/></g>';
  }

  function stumpAndLeak(st, g) {
    if (!g.cut) return '';
    var s = '', c = g.c, w = g.w, tc = g.sc, p = bz(c, tc), d = tan(c, tc);
    if (st.stump === 'leak') {
      var q = bz(c, g.sb + .03), pool = add(q, [34, 96]);
      s += puddle(pool[0], pool[1], 70, 14, 61, 'f');
      var sm = smooth([add(q, [-10, 2]), add(q, [12, 0]), add(q, [16, 34]), add(q, [30, 70]), add(pool, [14, -6]), add(pool, [-30, -8]), add(q, [-4, 58]), add(q, [-14, 26])], true);
      s += '<path d="' + sm + '" fill="#4A3A12" opacity=".5" transform="translate(2 4)" filter="' + url('b3') + '"/>' +
        '<path d="' + sm + '" fill="' + url('fae') + '" opacity=".88" filter="' + url('b1') + '"/>' +
        '<path class="oxa-shim" d="M' + P(add(q, [2, 14])) + ' q-2 20 8 40 q6 14 18 22" stroke="#FFF6CC" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".6"/>';
      s += cutEnd(q, tan(c, g.sb + .03), w * 1.15, true);
      [[6, 30], [14, 52], [22, 72]].forEach(function (o, i) { s += '<g transform="translate(' + P(add(q, o)) + ')"><ellipse class="oxa-blink" style="animation-delay:' + f(-i * .6) + 's" rx="' + f(3.4 - i * .4) + '" ry="' + f(2.4 - i * .3) + '" fill="#E6D27E"/></g>'; });
      g.leakP = add(q, [8, 40]);
    } else if (st.base !== 'stapler') s += cutEnd(p, d, w, false);
    return s;
  }
  /* omentum: lobulated apron coming down from above, adherent to the appendix */
  function omentum(st, g) {
    if (!g.omen) return '';
    var s = '', r = rng(97), T = g.tipNow, path, i;
    if (g.ex) {
      /* swept up and medially, the adhesions to the appendix divided */
      path = scallop([[600, -170], [610, 30], [660, 140], [740, 196], [840, 186], [930, 120], [1000, -20], [960, -170]], 22, 9, 5);
      g.omP = [760, 130];
    } else {
      /* a tongue of omentum hanging down over the ileum and wrapping the distal appendix */
      var a2 = g.A(.88);
      path = scallop([[520, -170], [530, 20], [580, 120], [640, 200], [670, 300], [a2[0] + 4, a2[1] - 30], [a2[0] - 8, a2[1] + 6], [a2[0] + 6, a2[1] + 30], [T[0] + 16, T[1] + 32], [T[0] + 50, T[1] + 4], [T[0] + 46, T[1] - 44], [760, 370], [820, 340], [900, 372], [960, 340], [1010, 350], [1010, -170]], 18, 9, 9);
      g.omP = [800, 120];
    }
    var lob = '';
    for (i = 0; i < (g.ex ? 120 : 260); i++) {
      var x = 480 + r() * 540, y = -170 + r() * 790, rr = 6 + r() * 9;
      lob += '<ellipse cx="' + f(x) + '" cy="' + f(y) + '" rx="' + f(rr) + '" ry="' + f(rr * .75) + '" transform="rotate(' + f(r() * 180) + ' ' + f(x) + ' ' + f(y) + ')" fill="' + url('lob') + '" stroke="#B5852F" stroke-opacity=".3" stroke-width=".7"/>';
      if (r() < .1) lob += '<ellipse cx="' + f(x - rr * .3) + '" cy="' + f(y - rr * .35) + '" rx="' + f(rr * .25) + '" ry="' + f(rr * .1) + '" fill="#FFFBEA" opacity=".8"/>';
    }
    s += '<path d="' + path + '" fill="#2A0806" opacity=".5" transform="translate(6 12)" filter="' + url('b7') + '"/>' +
      '<path d="' + path + '" fill="#D9A84E"/>' +
      '<g clip-path="url(#' + u('oc') + ')"><clipPath id="' + u('oc') + '"><path d="' + path + '"/></clipPath>' + lob +
      '<path d="M560 -170 C566 40 560 200 590 340 C604 420 620 470 640 530 M640 -170 C650 60 640 220 650 340 M690 -170 C684 40 690 200 676 330 M780 -170 C790 0 820 100 880 160" stroke="#9E2A24" stroke-width="2.2" stroke-opacity=".5" fill="none"/>' +
      '<path d="M560 -170 C566 40 560 200 590 340 M780 -170 C790 0 820 100 880 160" stroke="#4E4F8C" stroke-width="2" stroke-opacity=".3" fill="none" transform="translate(5 0)"/>' +
      '<path d="M540 -100 C550 60 546 200 576 320" stroke="#FFF8DC" stroke-width="16" stroke-opacity=".22" fill="none" filter="' + url('b7') + '"/>' +
      '</g>';
    if (g.ex) s += '<g fill="#8E2A1A" opacity=".7">' + [[668, 152], [700, 178], [734, 194]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.4"/>'; }).join('') + '</g>';
    if (g.inf && !g.ex) { var tp = g.A(.85); s += '<ellipse cx="' + f(tp[0]) + '" cy="' + f(tp[1]) + '" rx="70" ry="44" fill="' + url('phl') + '" opacity=".5"/>'; }
    return s;
  }
  /* acute changes around the tip: phlegmon, perforation, faecolith, abscess */
  function acute(st, g) {
    var s = '';
    if (g.inf >= 1 && !g.cut) {
      var tp = g.A(.75);
      s += '<ellipse cx="' + f(tp[0]) + '" cy="' + f(tp[1]) + '" rx="' + (60 + g.inf * 20) + '" ry="' + (44 + g.inf * 14) + '" fill="' + url('phl') + '" opacity="' + (g.inf === 1 ? .5 : .8) + '"/>';
    }
    return s;
  }
  function perforation(st, g) {
    if (g.inf < 3) return '';
    var c = g.cut ? g.spec : g.c, t = g.cut ? .72 : .8, p = bz(c, t), n = nor(c, t), w = g.w;
    if (n[0] < 0) n = [-n[0], -n[1]];
    var h = add(p, n, w * .18), a = Math.atan2(tan(c, t)[1], tan(c, t)[0]) * 180 / Math.PI;
    var fe = add(p, n, w * 1.25 + 8);
    var s = '<ellipse cx="' + f(h[0]) + '" cy="' + f(h[1]) + '" rx="' + f(w * .3) + '" ry="' + f(w * .2) + '" transform="rotate(' + f(a) + ' ' + P(h) + ')" fill="#2A0A0C" stroke="#E6D27E" stroke-width="2.2"/>' +
      '<path d="M' + P(h) + ' q' + f(n[0] * 18 + 4) + ' ' + f(n[1] * 18 + 10) + ' ' + f(n[0] * 26) + ' ' + f(n[1] * 26 + 26) + ' q-14 6 -20 -4 Z" fill="' + url('pus') + '" opacity=".95"/>' +
      '<g transform="translate(' + P(fe) + ')"><ellipse cx="3" cy="5" rx="12" ry="9" fill="#2A0806" opacity=".5" filter="' + url('b3') + '"/>' +
      '<path d="M-10 -2 C-9 -9 -1 -10 5 -8 C11 -6 12 2 9 7 C5 11 -4 10 -8 6 C-11 3 -11 1 -10 -2 Z" fill="' + url('fec') + '" stroke="#2E1E10" stroke-width=".8"/>' +
      '<ellipse cx="-3" cy="-4" rx="3.6" ry="1.8" fill="#fff" opacity=".6"/></g>';
    s += '<g transform="translate(' + P(add(h, n, 6)) + ')"><circle class="oxa-drip" r="3" fill="#D8C66E"/></g>';
    g.perf = h; g.fec = fe;
    return s;
  }

  function pools(st, g) {
    var s = '';
    function gutter(kind, seed) {
      /* fluid lying along the right paracolic gutter, between the wall and the colon */
      var d = smooth([[160, 380], [172, 420], [178, 480], [176, 540], [166, 600], [154, 560], [152, 480], [154, 420]], true);
      var gg = kind === 'b' ? 'bld' : 'pus';
      return '<path d="' + d + '" fill="' + url(gg) + '" opacity=".6" filter="' + url('b7') + '"/>' +
        '<path d="' + d + '" fill="' + url(gg) + '" opacity=".45" filter="' + url('b1') + '" transform="translate(166 480) scale(.7 .9) translate(-166 -480)"/>' +
        '<path d="M164 400 C170 450 170 510 164 570" stroke="#FFFBEA" stroke-width="2" fill="none" opacity=".5" class="oxa-shim" filter="' + url('b1') + '"/>';
    }
    if (st.pus || g.inf === 3) {
      s += gutter('p') + puddle(650, 640, 150, 26, 17, 'p');
      g.pusP = [620, 628]; g.pusG = [166, 480];
    }
    if (st.bleed === 2 || st.bleed === '2') {
      s += gutter('b') + puddle(580, 636, 150, 30, 29, 'b');
      s += '<g fill="#3A0204" opacity=".6" filter="' + url('b1') + '">' + [[520, 630, 12, 5], [610, 640, 16, 6], [660, 624, 9, 4]].map(function (q) { return '<ellipse cx="' + q[0] + '" cy="' + q[1] + '" rx="' + q[2] + '" ry="' + q[3] + '"/>'; }).join('') + '</g>';
      g.bldP = [580, 626];
    }
    return s;
  }
  function spurt(st, g) {
    if (!(st.bleed === 1 || st.bleed === '1')) return '';
    var src = g.art || add(g.B, [60, 60]);
    g.bleedP = src;
    var arc = [src, add(src, [-26, -46]), add(src, [-74, -56]), add(src, [-110, -10])];
    var s = puddle(src[0] - 70, src[1] + 40, 46, 16, 37, 'b');
    s += '<path d="' + cd(arc) + '" stroke="#7A060A" stroke-width="7" fill="none" stroke-linecap="round" opacity=".55" filter="' + url('b1') + '"/>' +
      '<path class="oxa-puls" d="' + cd(arc) + '" stroke="#D6161E" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="80 400"/>' +
      '<path class="oxa-puls" d="' + cd(arc) + '" stroke="#FF8A80" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-dasharray="60 400" transform="translate(-1 -2)"/>';
    for (var i = 0; i < 9; i++) {
      var t = .15 + i * .1, p = bz(arc, t);
      s += '<g transform="translate(' + P(p) + ')"><circle class="oxa-blink" style="animation-delay:' + f(-1.05 + t * .9) + 's" r="' + f(4.8 - t * 2.5) + '" fill="#C8141C"/><circle class="oxa-blink" style="animation-delay:' + f(-1.05 + t * .9) + 's" cx="-1.2" cy="-1.2" r="1.2" fill="#FFB0A8"/></g>';
    }
    s += '<circle cx="' + f(src[0]) + '" cy="' + f(src[1]) + '" r="6" fill="#9A0E12"/><circle class="oxa-puls" cx="' + f(src[0]) + '" cy="' + f(src[1]) + '" r="13" fill="#E0242A" opacity=".6" filter="' + url('b3') + '"/>';
    return s;
  }
  /* laparoscopic atraumatic grasper */
  function grasper(tip, from) {
    var d = [tip[0] - from[0], tip[1] - from[1]], l = Math.sqrt(d[0] * d[0] + d[1] * d[1]), a = Math.atan2(d[1], d[0]) * 180 / Math.PI;
    var s = '<g transform="translate(' + P(tip) + ') rotate(' + f(a) + ')">' +
      '<rect x="' + f(-l) + '" y="-6" width="' + f(l - 26) + '" height="20" rx="4" fill="#000" opacity=".35" transform="translate(6 14)" filter="' + url('b7') + '"/>' +
      '<rect x="' + f(-l) + '" y="-11" width="' + f(l - 30) + '" height="22" rx="3" fill="#1C2226"/>' +
      '<rect x="' + f(-l) + '" y="-8" width="' + f(l - 30) + '" height="5" fill="#59646C" opacity=".8"/>' +
      '<rect x="' + f(-l) + '" y="-6.5" width="' + f(l - 30) + '" height="1.6" fill="#E9EEF1" opacity=".55"/>' +
      '<rect x="-34" y="-8" width="10" height="16" rx="2" fill="url(#' + u('met') + ')"/>' +
      '<path d="M-26 -7 L2 -4 C5 -3 5 -1 2 -1 L-26 -1 Z" fill="url(#' + u('met') + ')" stroke="#3E474E" stroke-width=".6"/>' +
      '<path d="M-26 7 L2 4 C5 3 5 1 2 1 L-26 1 Z" fill="url(#' + u('met') + ')" stroke="#3E474E" stroke-width=".6"/>' +
      '<path d="M-22 -4 h18 M-22 4 h18" stroke="#3E474E" stroke-width=".8" stroke-dasharray="2 2"/>' +
      '</g>';
    return s;
  }

  /* caecum and ascending colon: haustra, taeniae, epiploic appendages, wet highlights */
  function caecum(st, g) {
    var s = '<path d="' + CEC + '" fill="#2A0806" opacity=".55" transform="translate(10 16)" filter="' + url('b16') + '"/>';
    s += '<g><path d="' + CEC + '" fill="' + url('cec') + '"/>';
    s += '<g clip-path="url(#' + u('cc') + ')">';
    if (g.inf) s += '<ellipse cx="380" cy="440" rx="120" ry="90" fill="' + url('red') + '" opacity="' + (.35 + g.inf * .2) + '"/>';
    /* lateral and medial curvature shading */
    s += '<path d="M180 -10 C172 140 150 260 176 360 C196 440 260 486 330 484" stroke="#6E2E26" stroke-width="34" stroke-opacity=".45" fill="none" filter="' + url('b16') + '"/>' +
      '<path d="M410 -10 C414 120 440 260 448 360" stroke="#7A3A30" stroke-width="22" stroke-opacity=".35" fill="none" filter="' + url('b16') + '"/>';
    /* haustral sacculations: crease shadow + bulge light, interrupted at the taenia */
    /* [y, sag, offset of the medial half, how far the lateral crease reaches] */
    var H = [[52, 30, 14, 0], [128, 34, -10, 20], [204, 30, 16, 6], [278, 24, -8, 30], [350, 14, 8, 50]], hs = '', hl = '';
    H.forEach(function (h, j) {
      var y = h[0], sag = h[1], y2 = y + h[2], x0 = 160 + h[3], tx = 300 + (y / 380) * 40;
      hs += 'M' + x0 + ' ' + f(y - 14) + ' Q' + f((x0 + tx) / 2) + ' ' + f(y + sag) + ' ' + f(tx - 12) + ' ' + f(y + 6) + ' M' + f(tx + 12) + ' ' + f(y2 + 6) + ' Q' + f((tx + 460) / 2) + ' ' + f(y2 + sag * .8) + ' 460 ' + f(y2 - 20);
      hl += 'M' + (x0 + 10) + ' ' + f(y - 24) + ' Q' + f((x0 + tx) / 2) + ' ' + f(y + sag - 18) + ' ' + f(tx - 18) + ' ' + f(y - 14) + ' M' + f(tx + 18) + ' ' + f(y2 - 14) + ' Q' + f((tx + 450) / 2) + ' ' + f(y2 + sag - 18) + ' 450 ' + f(y2 - 28);
    });
    s += '<path d="' + hs + '" stroke="#5E2018" stroke-width="16" stroke-opacity=".3" fill="none" filter="' + url('b7') + '"/>' +
      '<path d="' + hs + '" stroke="#5E2018" stroke-width="4" stroke-opacity=".22" fill="none" filter="' + url('b3') + '"/>' +

      '<path d="' + hl + '" stroke="#FFE6D8" stroke-width="18" stroke-opacity=".22" fill="none" filter="' + url('b7') + '"/>';
    /* serosal vessels on the colon */
    var r = rng(5), vs = '';
    /* vasa recta of the colon: from the medial (mesocolic) side, circling round each sacculation */
    var vt = '';
    H.forEach(function (h, j) {
      var y = h[0] + 30;
      if (y > 400) return;
      var x0 = 420 + (y / 380) * 20;
      vs += 'M' + f(x0) + ' ' + f(y + 4) + ' C' + f(x0 - 40) + ' ' + f(y + 16 + r() * 6) + ' ' + f(x0 - 80) + ' ' + f(y + 10) + ' ' + f(x0 - 108 - r() * 20) + ' ' + f(y + 8 + r() * 6);
      vt += 'M' + f(x0 - 60) + ' ' + f(y + 13) + ' q-10 -12 -26 -14 M' + f(x0 - 90) + ' ' + f(y + 11) + ' q-6 10 -20 14';
      vs += ' M196 ' + f(y - 4) + ' C214 ' + f(y + 8) + ' 236 ' + f(y + 14) + ' ' + f(262 + r() * 10) + ' ' + f(y + 12);
    });
    s += '<path d="' + vs + '" stroke="#9A2E26" stroke-width="1.6" stroke-opacity=".38" fill="none" stroke-linecap="round" filter="' + url('b1') + '"/>' +
      '<path d="' + vt + '" stroke="#9A2E26" stroke-width=".8" stroke-opacity=".45" fill="none" stroke-linecap="round"/>';
    /* taeniae */
    s += '<path d="' + TO + '" stroke="#F6D9C8" stroke-width="10" stroke-opacity=".12" fill="none" filter="' + url('b3') + '"/>' +
      '<path d="' + TM + '" stroke="#F6D9C8" stroke-width="10" stroke-opacity=".12" fill="none" filter="' + url('b3') + '"/>' +
      '<path d="' + cd(TL) + ' C' + P(TL2[1]) + ' ' + P(TL2[2]) + ' ' + P(TL2[3]) + '" stroke="#8E4A3E" stroke-width="20" stroke-opacity=".25" fill="none" filter="' + url('b3') + '"/>' +
      '<path d="' + cd(TL) + ' C' + P(TL2[1]) + ' ' + P(TL2[2]) + ' ' + P(TL2[3]) + '" stroke="#EFC7B4" stroke-width="13" stroke-opacity=".55" fill="none" filter="' + url('b1') + '"/>' +
      '<path d="' + cd(TL) + ' C' + P(TL2[1]) + ' ' + P(TL2[2]) + ' ' + P(TL2[3]) + '" stroke="#F9E2D4" stroke-width="5" stroke-opacity=".35" fill="none" stroke-dasharray="40 14 22 18" transform="translate(-3 0)" filter="' + url('b1') + '"/>';
    /* subserosal appendix bulge under the caecal serosa */
    if (g.v === 'subserosal' && !g.ex) {
      var c = g.c, w = g.w;
      s += '<path d="' + cd(c) + '" stroke="#7E3A30" stroke-width="' + f(w + 6) + '" stroke-opacity=".35" fill="none" stroke-linecap="round" filter="' + url('b3') + '" transform="translate(2 4)"/>' +
        '<path d="' + cd(c) + '" stroke="' + COL.app[g.inf].md + '" stroke-width="' + f(w) + '" stroke-opacity=".3" fill="none" stroke-linecap="round" filter="' + url('b3') + '"/>' +
        '<path d="' + cd(c) + '" stroke="#FFE8DA" stroke-width="' + f(w * .3) + '" stroke-opacity=".45" fill="none" stroke-linecap="round" transform="translate(-2 -4)" filter="' + url('b3') + '"/>';
    }
    if (g.v === 'retrocecal' && !g.ex) {
      s += '<path d="' + cd(g.c) + '" stroke="#FFE8DA" stroke-width="' + f(g.w + 10) + '" stroke-opacity=".12" fill="none" stroke-linecap="round" filter="' + url('b7') + '"/>';
      if (st.labels || st.danger || st.focus === 'appendix' || st.focus === 'tip') s += '<path d="' + cd(g.c) + '" stroke="#5CE0CF" stroke-width="2" stroke-dasharray="6 6" fill="none" opacity=".75"/>';
    }
    /* wet highlights */
    s += '<g filter="' + url('b3') + '" fill="#FFF8F0">' +
      '<ellipse cx="262" cy="88" rx="26" ry="6" transform="rotate(-6 262 88)" opacity=".5"/><ellipse cx="360" cy="76" rx="14" ry="4" opacity=".45"/>' +
      '<ellipse cx="250" cy="166" rx="30" ry="7" transform="rotate(-4 250 166)" opacity=".45"/><ellipse cx="366" cy="240" rx="20" ry="5" transform="rotate(8 366 240)" opacity=".4"/>' +
      '<ellipse cx="248" cy="318" rx="42" ry="11" transform="rotate(-14 248 318)" opacity=".5"/><ellipse cx="320" cy="420" rx="34" ry="8" transform="rotate(18 320 420)" opacity=".42"/></g>' +
      '<g fill="#FFFFFF">' + glints(rng(3), 12, 200, 40, 220, 400) + '</g>';
    s += '</g>';
    /* epiploic appendages along the taeniae of the ascending colon */
    var ep = [[318, 44, 24], [214, 120, -156]], es = '';
    ep.forEach(function (e) {
      es += '<g transform="translate(' + e[0] + ' ' + e[1] + ') rotate(' + e[2] + ')"><ellipse cx="14" cy="6" rx="18" ry="9" fill="#2A0806" opacity=".35" filter="' + url('b3') + '"/>' +
        '<path d="M0 0 C8 -12 22 -16 34 -11 C44 -7 46 4 40 10 C34 16 26 13 20 15 C12 17 4 10 0 0 Z" fill="' + url('fat') + '" stroke="#A8762C" stroke-width=".7" opacity=".92"/>' +
        '<path d="M14 -4 c4 -5 10 -5 14 0 M24 6 c4 -4 9 -3 11 1" stroke="#C99A45" stroke-width=".8" fill="none" opacity=".6"/>' +
        '<path d="M12 -4 q6 -2 10 1" stroke="#FFFBEA" stroke-width="1.6" fill="none" opacity=".7"/></g>';
    });
    s += es + '<path d="' + CEC + '" fill="none" stroke="#6A2A22" stroke-width="1.2" stroke-opacity=".55"/></g>';
    return s;
  }

  /* overlays: the three taeniae converging on the base; at-risk structures */
  function taeniaOverlay(g) {
    var tl = cd(TL) + ' C' + P(TL2[1]) + ' ' + P(TL2[2]) + ' ' + P(TL2[3]);
    var s = '<g class="oxa-dash">' +
      '<path d="' + tl + '" stroke="#5CE0CF" stroke-width="5" fill="none" stroke-linecap="round" filter="' + url('b3') + '"/>' +
      '<path d="' + tl + '" stroke="#E6FFFB" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<path d="' + TO + '" stroke="#5CE0CF" stroke-width="2.4" fill="none" stroke-dasharray="8 6" opacity=".85"/>' +
      '<path d="' + TM + '" stroke="#5CE0CF" stroke-width="2.4" fill="none" stroke-dasharray="8 6" opacity=".85"/></g>' +
      '<circle class="oxa-glow" cx="388" cy="452" r="26" fill="' + url('glw') + '"/>' +
      '<circle cx="388" cy="452" r="6" fill="#E6FFFB" stroke="#0A2236" stroke-width="1.2"/>';
    return s;
  }
  function dangerOverlay(st) {
    var fem = !!st.female;
    var s = '<g opacity=".95">' +
      '<path class="oxa-shim" d="' + URE + '" stroke="#FFB27A" stroke-width="18" fill="none" stroke-linecap="round" opacity=".5" filter="' + url('b7') + '"/>' +
      '<path d="' + URE + '" stroke="#FFF1DA" stroke-width="5" fill="none" stroke-dasharray="10 6" stroke-linecap="round"/>' +
      '<path d="' + EIA + '" stroke="#FF6B5A" stroke-width="3" fill="none" stroke-dasharray="10 6"/>' +
      '<path d="' + EIV + '" stroke="#8FA0FF" stroke-width="3" fill="none" stroke-dasharray="10 6"/>' +
      '<path d="' + gonad(fem) + '" stroke="#C7B8FF" stroke-width="2" fill="none" stroke-dasharray="6 5"/>' +
      '<circle class="oxa-glow" cx="714" cy="504" r="30" fill="' + url('dng') + '" opacity=".7"/>' +
      '</g>';
    return s;
  }

  /* ---------- spots ---------- */
  function spotsOf(st, g) {
    var S = [];
    function add1(id, he, p, lx, ly) { if (!p) return; var q = cam(p), l = [lx, ly]; S.push({ id: id, he: he, x: Math.round(q[0]), y: Math.round(q[1]), lx: l[0], ly: l[1] }); }
    var hidden = g.v === 'retrocecal' && !g.ex;
    var app = g.cut ? null : (hidden ? null : g.A(.55));
    add1('cecum', 'Cecum', [268, 360], 95, 190);
    add1('colon', 'Ascending colon', [300, 120], 95, 60);
    add1('taenia', 'Anterior taenia', bz(TL, .72), 470, 24);
    add1('ileum', 'Terminal ileum', bz(ILEUM, .45), 800, 133);
    add1('icj', 'Ileocecal junction', ICJ, 560, 150);
    add1('mesentery', 'Small bowel mesentery', [800, 450], 860, 330);
    if (app) add1('appendix', 'Appendix', app, g.ex ? 650 : 330, g.ex ? 190 : 560);
    if (!g.cut && !hidden) add1('tip', 'Appendix tip', g.ex ? g.A(.94) : g.T, g.ex ? 860 : 760, g.ex ? 220 : 560);
    if (!g.cut) add1('base', 'Appendix base', g.B, 300, 400);
    if (g.cut) add1('stump', 'Appendix stump', bz(g.c, g.sb + .04), 300, 400);
    if (g.cut && g.spec) add1('specimen', 'Resected appendix', bz(g.spec, .55), g.ex ? 680 : 700, g.ex ? 190 : 560);
    if (g.R && (g.ex || st.meso)) add1('meso', 'Mesoappendix', g.mesoP, 330, 490);
    if (g.R && g.ex) add1('artery', 'Appendicular artery', g.F(.55), 640, 545);
    if (g.omen) add1('omentum', 'Omentum', g.omP, 860, 60);
    add1('gutter', 'Paracolic gutter', [146, 470], 80, 480);
    if (g.v === 'retrocecal') add1('toldt', 'White line of Toldt', [168, 300], 100, 110);
    add1('ureter', 'Right ureter', [700, 480], 890, 400);
    add1('eia', 'External iliac artery', [560, 556], 500, 578);
    add1('eiv', 'External iliac vein', [640, 552], 800, 578);
    if (st.danger) add1('gonadal', 'Gonadal vessels', st.female ? [640, 508] : [588, 500], 900, 450);
    if (st.female) { add1('ovary', 'Right ovary', OVARY, 870, 545); add1('tube', 'Right fallopian tube', [850, 508], 880, 360); }
    if (st.meckel && g.meckel) add1('meckel', 'Meckel’s diverticulum', g.meckel, 800, 30);
    if (g.perf) add1('perf', 'Perforation', g.perf, 840, 380);
    if (g.fec) add1('fecalith', 'Fecalith', g.fec, 850, 430);
    if (g.pusP) { add1('pus', 'Pus in the pelvis', g.pusP, 640, 578); }
    if (g.bleedP) add1('bleed', 'Bleeding source', g.bleedP, 430, 250);
    if (g.leakP) add1('leak', 'Stump leak', g.leakP, 260, 560);
    return S;
  }

  function labels(S, st) {
    var boxes = [], s = '<g font-family="Inter, Arial, sans-serif" font-size="15" font-weight="500">';
    var skip = { mesentery: 1, colon: 1, eiv: 1, gonadal: !st.danger, ureter: !st.danger, eia: !st.danger, icj: 1 };
    S.forEach(function (p) {
      if (skip[p.id]) return;
      var w = p.he.length * 7.4 + 24, x = clamp(p.lx, w / 2 + 14, 946 - w / 2), y = clamp(p.ly, 22, 582);
      for (var k = 0; k < 12; k++) {
        var hit = false;
        for (var j = 0; j < boxes.length; j++) { var b = boxes[j]; if (Math.abs(b.x - x) < (b.w + w) / 2 + 6 && Math.abs(b.y - y) < 28) { hit = true; break; } }
        if (!hit) break;
        y = y + (y > 300 ? -30 : 30); y = clamp(y, 22, 582);
      }
      boxes.push({ x: x, y: y, w: w });
      s += '<path d="M' + p.x + ' ' + p.y + ' L' + f(x) + ' ' + f(y) + '" stroke="#0A2236" stroke-width="3" stroke-opacity=".5"/><path d="M' + p.x + ' ' + p.y + ' L' + f(x) + ' ' + f(y) + '" stroke="#E6FFFB" stroke-width="1.2"/>' +
        '<circle cx="' + p.x + '" cy="' + p.y + '" r="4" fill="#E6FFFB" stroke="#0A2236" stroke-width="1.4"/>' +
        '<rect x="' + f(x - w / 2) + '" y="' + f(y - 13) + '" width="' + f(w) + '" height="26" rx="13" fill="#0A2236" fill-opacity=".82" stroke="#5CE0CF" stroke-opacity=".55"/>' +
        '<text x="' + f(x) + '" y="' + f(y + 5) + '" text-anchor="middle" fill="#F2FBFA">' + esc(p.he) + '</text>';
    });
    return s + '</g>';
  }

  /* ---------- realistic layer ----------
     A repainted laparoscope photo per keyframe (art/real/appendix/<key>.jpg, 16:9, mapped on -53.333 0 1066.667 600).
     Only keys listed in REAL.keys have a photo; any other state falls back to the vector painting.
     Exposed frames are grouped by inflammation: 0-2 share the inflamed set, 3 has its own (necrotic, pus in the pelvis). */
  var REAL = {
    dir: 'art/real/appendix/',
    keys: [],
    all: ['normal', 'inflamed', 'retro', 'perf', 'female', 'female0', 'meckel', 'meckel1',
      'exposed', 'exposed3', 'retro_mob', 'meso', 'meso3', 'loops', 'loops_cut', 'stapler', 'stapler_cut',
      'stapler3', 'stapler3_cut', 'clips', 'clips_cut', 'leak'],
    key: function (st) {
      st = st || {};
      var v = st.variant || 'pelvic', inf = clamp(st.inflam | 0, 0, 3), hi = inf === 3, k;
      if (v === 'subserosal') return null;
      if (st.exposed || st.cut) {
        if (st.cut) k = st.stump === 'leak' ? 'leak' : st.base === 'stapler' ? (hi ? 'stapler3_cut' : 'stapler_cut') : st.base === 'clips' ? 'clips_cut' : 'loops_cut';
        else if (st.base) k = st.base === 'stapler' ? (hi ? 'stapler3' : 'stapler') : st.base === 'clips' ? 'clips' : 'loops';
        else if (st.meso >= 1) k = hi ? 'meso3' : 'meso';
        else if (v === 'retrocecal' && !hi) k = 'retro_mob';
        else k = hi ? 'exposed3' : 'exposed';
      } else if (v === 'retrocecal') k = 'retro';
      else if (hi) k = 'perf';
      else if (st.meckel) k = inf ? 'meckel1' : 'meckel';
      else if (st.female) k = inf ? 'female' : 'female0';
      else k = inf ? 'inflamed' : 'normal';
      return REAL.keys.indexOf(k) >= 0 ? k : null;
    }
  };
  /* photos already carry pus when the appendix is perforated */
  function realPus(k) { return k === 'perf' || /3/.test(k); }

  var GOLD = '#C8A96A';
  function realTaenia() {
    var tl = cd(TL) + ' C' + P(TL2[1]) + ' ' + P(TL2[2]) + ' ' + P(TL2[3]);
    return '<g fill="none" stroke-linecap="round">' +
      '<path d="' + tl + '" stroke="' + GOLD + '" stroke-width="6" stroke-opacity=".18" filter="' + url('b3') + '"/>' +
      '<path class="oxa-dash" d="' + tl + '" stroke="' + GOLD + '" stroke-width="1.3"/>' +
      '<path d="' + TO + '" stroke="' + GOLD + '" stroke-width="1" stroke-dasharray="5 7" opacity=".7"/>' +
      '<path d="' + TM + '" stroke="' + GOLD + '" stroke-width="1" stroke-dasharray="5 7" opacity=".7"/></g>' +
      '<circle class="oxa-glow" cx="388" cy="452" r="24" fill="' + url('glwG') + '"/>' +
      '<circle cx="388" cy="452" r="4.5" fill="#F4EBDD" stroke="' + GOLD + '" stroke-width="1.2"/>';
  }
  function realDanger(st) {
    var hl = function (d, w, o, da) { return '<path d="' + d + '" stroke="' + GOLD + '" stroke-width="' + w + '" fill="none" stroke-linecap="round" opacity="' + o + '"' + (da ? ' stroke-dasharray="' + da + '"' : '') + '/>'; };
    return '<g>' +
      '<path class="oxa-shim" d="' + URE + '" stroke="#E8D3A2" stroke-width="12" fill="none" stroke-linecap="round" opacity=".22" filter="' + url('b7') + '"/>' +
      hl(URE, 1.6, .95) + hl(EIA, 1.1, .75, '7 6') + hl(EIV, 1.1, .55, '3 6') + hl(gonad(!!st.female), .9, .5, '2 5') +
      '<circle class="oxa-glow" cx="714" cy="504" r="22" fill="' + url('glwG') + '"/></g>';
  }
  function realLabels(S, st) {
    var boxes = [], s = '<g font-family="Inter, Arial, sans-serif" font-size="13" font-weight="400" letter-spacing=".2">';
    var skip = { mesentery: 1, colon: 1, eiv: 1, gonadal: !st.danger, ureter: !st.danger, eia: !st.danger, icj: 1 };
    S.forEach(function (p) {
      if (skip[p.id]) return;
      var w = p.he.length * 6.4 + 14, x = clamp(p.lx, w / 2 + 14, 946 - w / 2), y = clamp(p.ly, 22, 582);
      for (var k = 0; k < 12; k++) {
        var hit = false;
        for (var j = 0; j < boxes.length; j++) { var b = boxes[j]; if (Math.abs(b.x - x) < (b.w + w) / 2 + 6 && Math.abs(b.y - y) < 24) { hit = true; break; } }
        if (!hit) break;
        y = y + (y > 300 ? -26 : 26); y = clamp(y, 22, 582);
      }
      boxes.push({ x: x, y: y, w: w });
      var ey = y + (p.y > y ? 9 : -11);
      s += '<path d="M' + p.x + ' ' + p.y + ' L' + f(x) + ' ' + f(ey) + '" stroke="#000" stroke-width="2.2" stroke-opacity=".28"/>' +
        '<path d="M' + p.x + ' ' + p.y + ' L' + f(x) + ' ' + f(ey) + '" stroke="' + GOLD + '" stroke-width=".9"/>' +
        '<circle cx="' + p.x + '" cy="' + p.y + '" r="3" fill="#F4EBDD" stroke="' + GOLD + '" stroke-width="1"/>' +
        '<path d="M' + f(x - w / 2 + 4) + ' ' + f(y + 8) + ' H' + f(x + w / 2 - 4) + '" stroke="' + GOLD + '" stroke-width=".8" opacity=".8"/>' +
        '<text x="' + f(x) + '" y="' + f(y + 4) + '" text-anchor="middle" fill="#F4EBDD" stroke="#0B1418" stroke-opacity=".55" stroke-width="3" paint-order="stroke">' + esc(p.he) + '</text>';
    });
    return s + '</g>';
  }
  function drawReal(st, g, k) {
    /* run the painters for positions only (spots, bleeding source), then paint the effects that stay vector */
    upper(st, g); meso(st, g); perforation(st, g); pools(st, g); omentum(st, g); stumpAndLeak(st, g);
    var fx = '', gp = { inf: 0 };
    fx += pools({ bleed: st.bleed, pus: !!st.pus && !realPus(k) }, gp);
    fx += spurt(st, g);
    if (st.danger) fx += realDanger(st);
    if (st.taenia) fx += realTaenia();
    var S = spotsOf(st, g), lab = '';
    if (st.focus) S.forEach(function (p) {
      if (p.id === st.focus) lab += '<circle class="oxa-glow" cx="' + p.x + '" cy="' + p.y + '" r="44" fill="' + url('glwG') + '"/>' +
        '<circle cx="' + p.x + '" cy="' + p.y + '" r="28" fill="none" stroke="' + GOLD + '" stroke-width="1.2" opacity=".9"/>' +
        '<circle cx="' + p.x + '" cy="' + p.y + '" r="33" fill="none" stroke="' + GOLD + '" stroke-width=".6" stroke-dasharray="2 5" opacity=".7"/>';
    });
    if (st.labels) lab += realLabels(S, st);
    return '<svg class="oxa oxa-real" viewBox="0 0 960 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Laparoscopic field: appendectomy">' +
      CSS + defs() +
      '<image href="' + REAL.dir + k + '.jpg" x="-53.333" y="0" width="1066.667" height="600" preserveAspectRatio="none"/>' +
      '<g id="' + u('c') + '"><g transform="translate(' + CAM.tx + ' ' + CAM.ty + ') scale(' + CAM.k + ')">' + fx + '</g></g>' + lab + '</svg>';
  }

  /* ---------- draw ---------- */
  function draw(st) {
    st = st || {};
    ID = String(st.id || 'apx').replace(/[^\w-]/g, '');
    var g = geo(st), s = '';
    var rk = st.real !== false ? REAL.key(st) : null;
    if (rk) return drawReal(st, g, rk);
    s += retro(st, g);
    if (st.danger) s += dangerOverlay(st);
    s += wall(st, g);
    s += pools(st, g);
    s += upper(st, g);
    s += mesIleum(st, g);
    if (st.female) s += ovary();
    s += acute(st, g);
    s += meso(st, g);
    var hidden = g.v === 'retrocecal' && !g.ex;
    if (g.v !== 'subserosal' || g.ex) s += appendix(st, g, g.cut ? part(g.c, 0, g.sc) : g.c, false);
    s += '<g class="oxa-peri">' + tube(ILEUM, 54, COL.bowel, { sy: 12 }) +
      '<path d="M' + P(bz(ILEUM, .1)) + ' Q' + P(bz(ILEUM, .4)) + ' ' + P(bz(ILEUM, .85)) + '" stroke="#B5362C" stroke-width="1" stroke-opacity=".5" fill="none" transform="translate(0 20)"/></g>';
    s += caecum(st, g);
    s += stumpAndLeak(st, g);
    if (g.cut) s += appendix(st, g, g.spec, true);
    s += baseDevices(st, g);
    s += perforation(st, g);
    s += omentum(st, g);
    s += spurt(st, g);
    if (g.ex) s += grasper(g.cut ? bz(g.spec, .95) : g.A(.95), [1010, 250]);
    if (st.taenia) s += taeniaOverlay(g);
    if (noise()) s += '<rect x="-20" y="-200" width="1000" height="900" fill="' + url('tx') + '" opacity=".5"/>';
    var S = spotsOf(st, g), lab = '';
    if (st.focus) S.forEach(function (p) { if (p.id === st.focus) lab += '<circle class="oxa-glow" cx="' + p.x + '" cy="' + p.y + '" r="46" fill="' + url('glw') + '"/><circle cx="' + p.x + '" cy="' + p.y + '" r="30" fill="none" stroke="#5CE0CF" stroke-width="2" stroke-dasharray="5 5" opacity=".9"/>'; });
    if (st.labels) lab += labels(S, st);
    var out = '<svg class="oxa" viewBox="0 0 960 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Laparoscopic field: appendectomy">' +
      CSS + defs() +
      '<g id="' + u('c') + '"><g transform="translate(' + CAM.tx + ' ' + CAM.ty + ') scale(' + CAM.k + ')">' + s + '</g></g>' +
      '<rect width="960" height="600" fill="' + url('lamp') + '"/><rect width="960" height="600" fill="' + url('vig') + '"/>' + lab + '</svg>';
    g = null;
    return out;
  }

  function spots(st) {
    st = st || {};
    var g = geo(st);
    /* run the painters that compute positions (meso, perforation, pools, spurt, omentum) */
    ID = String(st.id || 'apx').replace(/[^\w-]/g, '');
    upper(st, g); meso(st, g); perforation(st, g); pools(st, g); omentum(st, g); stumpAndLeak(st, g); spurt(st, g);
    return spotsOf(st, g).map(function (p) { return { id: p.id, he: p.he, x: p.x, y: p.y }; });
  }

  /* paint the noise tile at load time so the first draw stays fast */
  if (typeof document !== 'undefined') noise();

  O.scenes.appendix = {
    draw: draw,
    spots: spots,
    real: REAL,
    viewBox: '0 0 960 600',
    states: {
      variant: "'pelvic' (default) | 'retrocecal' | 'subserosal'",
      inflam: '0 normal | 1 inflamed | 2 gangrenous | 3 perforated (pus, fecalith, wrapping omentum)',
      omentum: 'omentum stuck around the appendix',
      exposed: 'appendix lifted and mesoappendix spread (with graspers)',
      meso: '0..1 mesoappendix divided from tip to base; at 1 the artery is clipped and divided',
      base: "null | 'loops' | 'stapler' | 'clips'",
      cut: 'appendix divided, stump visible',
      stump: "'ok' | 'leak'",
      bleed: '0 | 1 (arterial jet) | 2 (pooled blood)',
      pus: 'pus in the pelvis and gutter',
      danger: 'ureter, iliac and gonadal vessels marked',
      taenia: 'the three taeniae converge on the base',
      female: 'right ovary and fallopian tube',
      meckel: 'Meckel’s diverticulum on a small bowel loop',
      labels: 'labels',
      focus: 'spot id to highlight',
      id: 'unique prefix for SVG ids',
      real: 'false forces the vector drawing; otherwise a realistic image when it has a key in real.keys'
    }
  };
})();
