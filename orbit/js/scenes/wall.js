/* ORBIT scene: the anterior abdominal wall of a supine patient, seen from above as the surgeon sees the draped field.
   For trocar placement: the user taps where a port goes, and lm/landmarks() give real landmark coordinates for grading.
   viewBox 0 0 600 760, head at TOP, patient's right on the viewer's LEFT. About 13 px per cm (lm.k).
   Original vector drawing. No face, no genitals, no patient data. */
(function () {
  'use strict';
  var O = window.ORBIT = window.ORBIT || {};
  O.scenes = O.scenes || {};

  var K = 13; /* px per cm */
  var CX = 300;
  function f(n) { return Math.round(n * 10) / 10; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function rtl(t) { return /[\u0590-\u05FF]/.test(String(t || '')) ? ' direction="rtl" unicode-bidi="plaintext"' : ''; }
  function mir(p) { return [2 * CX - p[0], p[1]]; }
  function mirAll(a) { return a.map(mir); }
  /* Catmull-Rom through points, as cubic Bezier */
  function smooth(p, closed) {
    var n = p.length, d = 'M' + f(p[0][0]) + ' ' + f(p[0][1]), i, p0, p1, p2, p3;
    var last = closed ? n : n - 1;
    for (i = 0; i < last; i++) {
      p0 = p[closed ? (i - 1 + n) % n : Math.max(i - 1, 0)];
      p1 = p[i]; p2 = p[(i + 1) % n];
      p3 = p[closed ? (i + 2) % n : Math.min(i + 2, n - 1)];
      d += 'C' + f(p1[0] + (p2[0] - p0[0]) / 6) + ' ' + f(p1[1] + (p2[1] - p0[1]) / 6) + ' ' +
        f(p2[0] - (p3[0] - p1[0]) / 6) + ' ' + f(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + f(p2[0]) + ' ' + f(p2[1]);
    }
    return d + (closed ? 'Z' : '');
  }
  function line(p) { return 'M' + p.map(function (q) { return f(q[0]) + ' ' + f(q[1]); }).join('L'); }
  /* y of a polyline at x (polyline sorted along x in either direction) */
  function yAt(poly, x) {
    for (var i = 0; i < poly.length - 1; i++) {
      var a = poly[i], b = poly[i + 1];
      if ((x - a[0]) * (x - b[0]) <= 0 && a[0] !== b[0]) return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
    }
    return null;
  }
  function xAt(poly, y) {
    for (var i = 0; i < poly.length - 1; i++) {
      var a = poly[i], b = poly[i + 1];
      if ((y - a[1]) * (y - b[1]) <= 0 && a[1] !== b[1]) return a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]);
    }
    return null;
  }

  /* ---------------- geometry per body habitus ---------------- */
  var HAB = {
    normal: { fs: 1, fb: 1, umb: 410, pub: 642, bulge: 0, win: 206 },
    obese: { fs: 1.2, fb: 1.05, umb: 462, pub: 652, bulge: 34, win: 222 },
    thin: { fs: 0.88, fb: 0.97, umb: 402, pub: 638, bulge: -8, win: 176 }
  };
  var cache = {};
  function geo(h) {
    h = HAB[h] ? h : 'normal';
    if (cache[h]) return cache[h];
    var H = HAB[h];
    function sx(x) { return CX + (x - CX) * H.fs; }   /* soft tissue lateral scale */
    function bx(x) { return CX + (x - CX) * H.fb; }   /* bone lateral scale */
    function sp(a) { return a.map(function (p) { return [sx(p[0]), p[1]]; }); }
    function bp(a) { return a.map(function (p) { return [bx(p[0]), p[1]]; }); }
    var g = { h: h, H: H, k: K };
    g.xiphoid = [CX, 186];
    g.umb = [CX, H.umb];
    g.pubis = [CX, H.pub];
    g.costalR = bp([[289, 168], [263, 194], [233, 226], [205, 260], [181, 290], [159, 316], [139, 336], [116, 352]]);
    g.costalL = mirAll(g.costalR);
    g.asisR = [bx(146), 552];
    g.asisL = mir(g.asisR);
    g.crestR = bp([[146, 552], [128, 530], [114, 500], [104, 466]]);
    g.crestL = mirAll(g.crestR);
    g.tubR = [bx(268), H.pub - 4];
    g.tubL = mir(g.tubR);
    g.mclR = bx(182); g.mclL = 2 * CX - g.mclR;
    g.aalR = sx(122); g.aalL = 2 * CX - g.aalR;
    g.ingR = [(g.asisR[0] + CX) / 2, (g.asisR[1] + g.pubis[1]) / 2];  /* mid-inguinal point */
    g.ingL = mir(g.ingR);
    var u = H.umb, arc = u + (H.pub - u) * 0.42;
    /* linea semilunaris: lateral rectus border, from the 9th costal cartilage to the pubic tubercle */
    g.semiR = sp([[203, 262], [196, 330], [198, u], [212, arc], [240, H.pub - 52], [266, H.pub - 8]]);
    g.semiL = mirAll(g.semiR);
    /* inferior epigastric: from the external iliac at the mid-inguinal point, superomedially, into the sheath at the arcuate line */
    g.ieaR = sp([[g.ingR[0] + 2, g.ingR[1] + 6], [236, H.pub - 74], [245, arc + 4], [236, (arc + u) / 2], [232, u], [237, u - 60], [245, u - 112]]);
    g.ieaL = mirAll(g.ieaR);
    g.seaR = sp([[270, 190], [263, 232], [254, 276], [245, u - 112]]);
    g.seaL = mirAll(g.seaR);
    g.arcuate = arc;
    g.liver = bp([[96, 372], [140, 364], [182, 340], [228, 302], [266, 266], [300, 244], [346, 220], [392, 198], [430, 176]]);
    g.gb = [bx(196), yAt(g.liver, bx(196)) + 4];
    g.mcb = [g.asisR[0] + (CX - g.asisR[0]) / 3, g.asisR[1] + (H.umb - g.asisR[1]) / 3];
    var cm = yAt(g.costalL, g.mclL);
    g.costalAtMclR = [g.mclR, yAt(g.costalR, g.mclR)];
    g.costalAtMclL = [g.mclL, cm];
    g.palmer = [g.mclL, cm + 3 * K];
    g.aortaBif = [CX + 6, 404];  /* L4: a bony level, so in obesity it sits above the (lower) umbilicus */
    g.supra = [CX, H.pub - 4 * K];
    var ya = yAt(g.costalR, g.aalR);
    g.costalAtAalR = [g.aalR, ya == null ? 350 : ya];
    g.costalAtAalL = mir(g.costalAtAalR);
    /* body half width by y */
    var hw = [[0, 238], [120, 236], [240, 230], [330, 223], [400, 218], [470, 221], [530, 229], [600, 237], [680, 241], [760, 237]];
    var R = [], L = [];
    hw.forEach(function (q) {
      var y = q[1] ? q[0] : q[0], w = q[1] * H.fs;
      if (H.bulge) w += H.bulge * Math.exp(-Math.pow((y - 480) / 120, 2));
      R.push([CX - w, y]); L.push([CX + w, y]);
    });
    g.edgeR = R; g.edgeL = L;
    g.body = smooth(R.slice().concat([[CX - 230 * H.fs, 800], [CX + 230 * H.fs, 800]]).concat(L.slice().reverse()), false) + 'Z';
    var w0 = H.win;
    g.win = [CX - w0, 124, CX + w0, 688];
    cache[h] = g;
    return g;
  }

  function lmOf(g) {
    return {
      k: K, habitus: g.h,
      xiphoid: g.xiphoid, umb: g.umb, pubis: g.pubis, asisR: g.asisR, asisL: g.asisL,
      tubercleR: g.tubR, tubercleL: g.tubL, costalR: g.costalR, costalL: g.costalL,
      costalAtMclR: g.costalAtMclR, costalAtMclL: g.costalAtMclL, costalAtAalR: g.costalAtAalR, costalAtAalL: g.costalAtAalL,
      mclR: g.mclR, mclL: g.mclL, aalR: g.aalR, aalL: g.aalL,
      palmer: g.palmer, mcburney: g.mcb, midInguinalR: g.ingR, midInguinalL: g.ingL,
      semilunarisR: g.semiR, semilunarisL: g.semiL, epigastricR: g.ieaR, epigastricL: g.ieaL,
      supEpigastricR: g.seaR, supEpigastricL: g.seaL, arcuateY: g.arcuate,
      liverEdge: g.liver, gallbladder: g.gb, aortaBif: g.aortaBif, suprapubic: g.supra, field: g.win
    };
  }

  /* ---------------- painting ---------------- */
  var STYLE =
    '.wl-t{font-family:Inter,Assistant,system-ui,sans-serif;font-size:12.5px;font-weight:600;fill:#13222F;paint-order:stroke;stroke:rgba(255,248,242,.94);stroke-width:3.4px;stroke-linejoin:round}' +
    '.wl-t.s{font-size:11px;font-weight:500}' +
    '.wl-t.u{fill:#3B1E1A}' +
    '.wl-d{font-family:Inter,Assistant,system-ui,sans-serif;font-size:11.5px;font-weight:600;fill:rgba(236,247,250,.78);letter-spacing:.02em}' +
    '.wl-n{font-family:Inter,Assistant,system-ui,sans-serif;font-size:11px;font-weight:700;fill:#fff}' +
    '.wl-mm{font-family:Inter,Assistant,system-ui,sans-serif;font-size:10px;font-weight:600;fill:#13222F;paint-order:stroke;stroke:rgba(255,248,242,.9);stroke-width:3px}' +
    '.wl-breath{animation:wlBr 5.2s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}' +
    '@keyframes wlBr{0%,100%{opacity:.82;transform:translateY(0)}50%{opacity:1;transform:translateY(-1.4px)}}' +
    '.wl-pop{animation:wlPop .42s cubic-bezier(.2,1.5,.4,1) both;transform-box:fill-box;transform-origin:50% 50%}' +
    '@keyframes wlPop{0%{opacity:0;transform:scale(.35)}100%{opacity:1;transform:scale(1)}}' +
    '.wl-pulse{animation:wlPu 2.2s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}' +
    '@keyframes wlPu{0%,100%{opacity:.95;transform:scale(1)}50%{opacity:.45;transform:scale(1.18)}}' +
    '@media (prefers-reduced-motion:reduce){.wl-breath,.wl-pop,.wl-pulse{animation:none}}';

  function defs(id, g) {
    var u = g.umb[1];
    return '<defs><style>' + STYLE + '</style>' +
      '<filter id="' + id + 'b" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>' +
      '<filter id="' + id + 'b2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.2"/></filter>' +
      '<filter id="' + id + 'b3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.3"/></filter>' +
      '<radialGradient id="' + id + 'sk" cx="50%" cy="' + Math.round(u / 7.6) + '%" r="62%" fx="47%" fy="' + Math.round(u / 8.6) + '%">' +
      '<stop offset="0" stop-color="#F3D3BA"/><stop offset=".52" stop-color="#E7BC9C"/><stop offset=".82" stop-color="#C99375"/><stop offset="1" stop-color="#9E6C55"/></radialGradient>' +
      '<linearGradient id="' + id + 'cyl" x1="0" x2="1"><stop offset="0" stop-color="#5C3324" stop-opacity=".55"/><stop offset=".2" stop-color="#5C3324" stop-opacity=".1"/>' +
      '<stop offset=".5" stop-color="#5C3324" stop-opacity="0"/><stop offset=".8" stop-color="#5C3324" stop-opacity=".1"/><stop offset="1" stop-color="#5C3324" stop-opacity=".55"/></linearGradient>' +
      '<radialGradient id="' + id + 'um" cx="50%" cy="38%" r="60%"><stop offset="0" stop-color="#4A2418"/><stop offset=".55" stop-color="#7A4230"/><stop offset="1" stop-color="#B57A5E" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="' + id + 'dr" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="#2E7189"/><stop offset=".5" stop-color="#2A6880"/><stop offset="1" stop-color="#215A70"/></linearGradient>' +
      '<linearGradient id="' + id + 'tw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A90A7"/><stop offset="1" stop-color="#3B7F96"/></linearGradient>' +
      '<linearGradient id="' + id + 'tb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3F4E5C"/><stop offset="1" stop-color="#2B3946"/></linearGradient>' +
      '<radialGradient id="' + id + 'tr" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#D7DEE4"/><stop offset="1" stop-color="#8F9BA6"/></radialGradient>' +
      '<radialGradient id="' + id + 'zi"><stop offset="0" stop-color="#14B8A6" stop-opacity=".42"/><stop offset=".7" stop-color="#14B8A6" stop-opacity=".2"/><stop offset="1" stop-color="#14B8A6" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + id + 'zo"><stop offset="0" stop-color="#E3A632" stop-opacity=".42"/><stop offset=".7" stop-color="#E3A632" stop-opacity=".2"/><stop offset="1" stop-color="#E3A632" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + id + 'zd"><stop offset="0" stop-color="#D2402F" stop-opacity=".45"/><stop offset=".7" stop-color="#D2402F" stop-opacity=".22"/><stop offset="1" stop-color="#D2402F" stop-opacity="0"/></radialGradient>' +
      '<filter id="' + id + 'gr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="7"/>' +
      '<feColorMatrix values="0 0 0 0 .35  0 0 0 0 .18  0 0 0 0 .1  0 0 0 -1.6 1.05"/><feComposite in2="SourceGraphic" operator="in"/></filter>' +
      '<clipPath id="' + id + 'cb"><path d="' + g.body + '"/></clipPath>' +
      '</defs>';
  }

  function winPath(g) {
    var w = g.win, x0 = w[0], y0 = w[1], x1 = w[2], y1 = w[3];
    /* towel edges, slightly irregular like folded cloth */
    return 'M' + x0 + ' ' + (y0 + 10) + 'Q' + (x0 + 2) + ' ' + y0 + ' ' + (x0 + 12) + ' ' + y0 +
      'C' + (x0 + 120) + ' ' + (y0 + 5) + ' ' + (x1 - 140) + ' ' + (y0 - 3) + ' ' + (x1 - 12) + ' ' + (y0 + 1) +
      'Q' + (x1 - 1) + ' ' + y0 + ' ' + x1 + ' ' + (y0 + 12) +
      'C' + (x1 + 4) + ' ' + (y0 + 180) + ' ' + (x1 - 4) + ' ' + (y1 - 200) + ' ' + (x1 + 1) + ' ' + (y1 - 12) +
      'Q' + x1 + ' ' + y1 + ' ' + (x1 - 12) + ' ' + y1 +
      'C' + (x1 - 140) + ' ' + (y1 - 4) + ' ' + (x0 + 130) + ' ' + (y1 + 3) + ' ' + (x0 + 12) + ' ' + (y1 - 1) +
      'Q' + x0 + ' ' + y1 + ' ' + (x0 - 1) + ' ' + (y1 - 12) +
      'C' + (x0 - 4) + ' ' + (y1 - 190) + ' ' + (x0 + 3) + ' ' + (y0 + 170) + ' ' + x0 + ' ' + (y0 + 10) + 'Z';
  }

  function skin(id, g, st) {
    var H = g.H, u = g.umb[1], p = g.pubis[1], s = '', thin = g.h === 'thin', obese = g.h === 'obese';
    s += '<path d="' + g.body + '" fill="url(#' + id + 'sk)"/>';
    s += '<g clip-path="url(#' + id + 'cb)">';
    s += '<rect x="0" y="0" width="600" height="760" fill="url(#' + id + 'cyl)"/>';
    s += '<rect x="0" y="0" width="600" height="760" fill="#000" filter="url(#' + id + 'gr)" opacity=".1"/>';
    /* lower chest: rib cage is a ridge; subcostal hollow below the costal margins */
    var cr = g.costalR, cl = g.costalL;
    s += '<path d="' + smooth([[CX, 120]].concat(cr.slice(1)).concat([[60, 340], [60, 100], [CX, 100]]), true) + '" fill="#FBE3D0" opacity=".18" filter="url(#' + id + 'b)"/>';
    s += '<path d="' + smooth([[CX, 120]].concat(cl.slice(1)).concat([[540, 340], [540, 100], [CX, 100]]), true) + '" fill="#FBE3D0" opacity=".18" filter="url(#' + id + 'b)"/>';
    s += '<path d="' + smooth(cr.map(function (q) { return [q[0] + 3, q[1] + 13]; }), false) + '" fill="none" stroke="#6A3A28" stroke-width="16" opacity="' + (thin ? '.26' : obese ? '.08' : '.15') + '" filter="url(#' + id + 'b)"/>';
    s += '<path d="' + smooth(cl.map(function (q) { return [q[0] - 3, q[1] + 13]; }), false) + '" fill="none" stroke="#6A3A28" stroke-width="16" opacity="' + (thin ? '.26' : obese ? '.08' : '.15') + '" filter="url(#' + id + 'b)"/>';
    s += '<path d="' + smooth(cr, false) + '" fill="none" stroke="#FFF1E4" stroke-width="3" opacity=".2" filter="url(#' + id + 'b3)"/>';
    s += '<path d="' + smooth(cl, false) + '" fill="none" stroke="#FFF1E4" stroke-width="3" opacity=".2" filter="url(#' + id + 'b3)"/>';
    if (thin) {
      /* lower ribs show through */
      [[[112, 300], [150, 262], [196, 226]], [[108, 262], [150, 222], [200, 190]], [[114, 226], [156, 186], [206, 156]]].forEach(function (r) {
        s += '<path d="' + smooth(r, false) + '" fill="none" stroke="#7A4632" stroke-width="7" opacity=".14" filter="url(#' + id + 'b2)"/>';
        s += '<path d="' + smooth(mirAll(r), false) + '" fill="none" stroke="#7A4632" stroke-width="7" opacity=".14" filter="url(#' + id + 'b2)"/>';
      });
    }
    /* epigastric hollow under the xiphoid */
    s += '<ellipse cx="' + CX + '" cy="' + (g.xiphoid[1] + 18) + '" rx="26" ry="30" fill="#6A3A28" opacity=".16" filter="url(#' + id + 'b)"/>';
    /* breathing highlights: rectus bulges and the lower abdomen */
    s += '<g class="wl-breath">';
    var rw = 52 * H.fs;
    s += '<ellipse cx="' + f(CX - rw) + '" cy="' + f((u + 250) / 2 + 30) + '" rx="' + f(36 * H.fs) + '" ry="' + f((p - 250) / 2.1) + '" fill="#FFE9D8" opacity="' + (thin ? '.42' : '.3') + '" filter="url(#' + id + 'b)"/>';
    s += '<ellipse cx="' + f(CX + rw) + '" cy="' + f((u + 250) / 2 + 30) + '" rx="' + f(36 * H.fs) + '" ry="' + f((p - 250) / 2.1) + '" fill="#FFE9D8" opacity="' + (thin ? '.42' : '.3') + '" filter="url(#' + id + 'b)"/>';
    if (obese) s += '<ellipse cx="' + CX + '" cy="' + (u + 40) + '" rx="190" ry="120" fill="#FFE6D2" opacity=".26" filter="url(#' + id + 'b)"/>';
    s += '</g>';
    /* linea alba groove, xiphoid to umbilicus, fading below */
    s += '<path d="M' + CX + ' ' + (g.xiphoid[1] + 8) + 'L' + CX + ' ' + (u - 16) + '" stroke="#6A3A28" stroke-width="' + (thin ? 6 : 5) + '" opacity="' + (obese ? '.08' : thin ? '.24' : '.15') + '" filter="url(#' + id + 'b2)"/>';
    s += '<path d="M' + CX + ' ' + (u + 16) + 'L' + CX + ' ' + (p - 40) + '" stroke="#6A3A28" stroke-width="4" opacity=".06" filter="url(#' + id + 'b2)"/>';
    if (thin) {
      /* tendinous intersections and lateral rectus border */
      [u - 130, u - 62, u].forEach(function (y, i) {
        var w = 56 - i * 3;
        s += '<path d="M' + (CX - 8) + ' ' + y + 'Q' + (CX - w / 2) + ' ' + (y + 9) + ' ' + (CX - w) + ' ' + (y - 2) + '" stroke="#6A3A28" stroke-width="6" fill="none" opacity=".08" filter="url(#' + id + 'b2)"/>';
        s += '<path d="M' + (CX + 8) + ' ' + y + 'Q' + (CX + w / 2) + ' ' + (y + 9) + ' ' + (CX + w) + ' ' + (y - 2) + '" stroke="#6A3A28" stroke-width="6" fill="none" opacity=".08" filter="url(#' + id + 'b2)"/>';
      });
      s += '<path d="' + smooth(g.semiR, false) + '" fill="none" stroke="#6A3A28" stroke-width="6" opacity=".14" filter="url(#' + id + 'b2)"/>';
      s += '<path d="' + smooth(g.semiL, false) + '" fill="none" stroke="#6A3A28" stroke-width="6" opacity=".14" filter="url(#' + id + 'b2)"/>';
    }
    /* flanks: waist shadow */
    s += '<path d="' + smooth(g.edgeR.slice(2, 8).map(function (q) { return [q[0] + 6, q[1]]; }), false) + '" fill="none" stroke="#4A2618" stroke-width="44" opacity=".16" filter="url(#' + id + 'b)"/>';
    s += '<path d="' + smooth(g.edgeL.slice(2, 8).map(function (q) { return [q[0] - 6, q[1]]; }), false) + '" fill="none" stroke="#4A2618" stroke-width="44" opacity=".16" filter="url(#' + id + 'b)"/>';
    /* iliac crests and ASIS bumps, groin crease */
    var a = g.asisR, b = g.asisL, ao = obese ? '.1' : thin ? '.5' : '.32';
    s += '<ellipse cx="' + f(a[0] + 2) + '" cy="' + f(a[1] - 4) + '" rx="13" ry="10" fill="#FFF0E2" opacity="' + ao + '" filter="url(#' + id + 'b2)"/>';
    s += '<ellipse cx="' + f(b[0] - 2) + '" cy="' + f(b[1] - 4) + '" rx="13" ry="10" fill="#FFF0E2" opacity="' + ao + '" filter="url(#' + id + 'b2)"/>';
    s += '<path d="' + smooth(g.crestR, false) + '" fill="none" stroke="#FFEBDC" stroke-width="7" opacity="' + ao + '" filter="url(#' + id + 'b2)"/>';
    s += '<path d="' + smooth(g.crestL, false) + '" fill="none" stroke="#FFEBDC" stroke-width="7" opacity="' + ao + '" filter="url(#' + id + 'b2)"/>';
    s += '<path d="' + smooth([[a[0] + 18, a[1] + 6], [(a[0] + g.tubR[0]) / 2 + 6, (a[1] + g.tubR[1]) / 2 + 18], [g.tubR[0], g.tubR[1] + 16]], false) + '" fill="none" stroke="#5A2E1F" stroke-width="12" opacity=".14" filter="url(#' + id + 'b2)"/>';
    s += '<path d="' + smooth([[b[0] - 18, b[1] + 6], [(b[0] + g.tubL[0]) / 2 - 6, (b[1] + g.tubL[1]) / 2 + 18], [g.tubL[0], g.tubL[1] + 16]], false) + '" fill="none" stroke="#5A2E1F" stroke-width="12" opacity=".14" filter="url(#' + id + 'b2)"/>';
    if (obese) {
      /* pannus: a deep suprapubic skin fold */
      var py = p - 30;
      s += '<path d="M' + (CX - 200) + ' ' + (py - 50) + 'Q' + CX + ' ' + (py + 40) + ' ' + (CX + 200) + ' ' + (py - 50) + '" fill="none" stroke="#4A2214" stroke-width="10" opacity=".4" filter="url(#' + id + 'b2)"/>';
      s += '<path d="M' + (CX - 196) + ' ' + (py - 56) + 'Q' + CX + ' ' + (py + 30) + ' ' + (CX + 196) + ' ' + (py - 56) + '" fill="none" stroke="#FFE7D4" stroke-width="5" opacity=".45" filter="url(#' + id + 'b3)"/>';
      s += '<path d="M' + (CX - 120) + ' ' + (u + 56) + 'Q' + CX + ' ' + (u + 80) + ' ' + (CX + 120) + ' ' + (u + 56) + '" fill="none" stroke="#5A2A1A" stroke-width="5" opacity=".1" filter="url(#' + id + 'b2)"/>';
    }
    s += '<ellipse cx="' + CX + '" cy="' + f(u + (p - u) * .45) + '" rx="' + f(150 * H.fs) + '" ry="' + f((p - u) * .42) + '" fill="#FFE8D6" opacity=".16" filter="url(#' + id + 'b)"/>';
    /* suprapubic shading */
    s += '<ellipse cx="' + CX + '" cy="' + (p + 20) + '" rx="120" ry="34" fill="#6A3A28" opacity=".14" filter="url(#' + id + 'b)"/>';
    /* the umbilicus: a deep fold, skin rim lit from above */
    var ur = obese ? 12 : 9.5;
    s += '<ellipse cx="' + CX + '" cy="' + (u + 1) + '" rx="' + (ur + 9) + '" ry="' + (ur + 11) + '" fill="#6A3A28" opacity=".16" filter="url(#' + id + 'b2)"/>';
    s += '<ellipse cx="' + CX + '" cy="' + u + '" rx="' + ur + '" ry="' + f(ur * 1.12) + '" fill="url(#' + id + 'um)"/>';
    s += '<path d="M' + (CX - ur + 1) + ' ' + (u - 2) + 'Q' + CX + ' ' + f(u - ur * 1.5) + ' ' + (CX + ur - 1) + ' ' + (u - 2) + '" fill="none" stroke="#3B1A10" stroke-width="2.2" opacity=".55"/>';
    s += '<path d="M' + (CX - ur - 1) + ' ' + f(u + ur * .5) + 'Q' + CX + ' ' + f(u + ur * 1.55) + ' ' + (CX + ur + 1) + ' ' + f(u + ur * .5) + '" fill="none" stroke="#FFEADA" stroke-width="2" opacity=".55"/>';
    s += '<path d="M' + (CX - 2) + ' ' + f(u + 2) + 'q2 -4 4 0" stroke="#2C120A" stroke-width="1.6" fill="none" opacity=".7"/>';
    s += '</g>';
    return s;
  }

  function tint(id, g) {
    var w = g.win;
    var vg = '<path d="' + winPath(g) + '" fill="none" stroke="#4A2416" stroke-width="70" opacity=".2" filter="url(#' + id + 'b)"/>';
    /* antiseptic prep: a warm wash with soft brushed edges */
    return vg + '<g opacity=".9"><path d="' + winPath(g) + '" fill="#D7843F" opacity=".1"/>' +
      '<path d="M' + (w[0] + 30) + ' ' + (w[1] + 40) + 'C' + (CX - 60) + ' ' + (w[1] + 20) + ' ' + (CX + 80) + ' ' + (w[1] + 70) + ' ' + (w[2] - 30) + ' ' + (w[1] + 40) +
      'M' + (w[0] + 20) + ' ' + (w[3] - 60) + 'C' + (CX - 80) + ' ' + (w[3] - 30) + ' ' + (CX + 60) + ' ' + (w[3] - 80) + ' ' + (w[2] - 20) + ' ' + (w[3] - 50) +
      '" fill="none" stroke="#C9742F" stroke-width="40" opacity=".05" filter="url(#' + id + 'b)"/></g>';
  }

  function drape(id, g) {
    var w = g.win, x0 = w[0], y0 = w[1], x1 = w[2], y1 = w[3], s = '', hole = winPath(g);
    s += '<path fill-rule="evenodd" d="M-10 -10H610V770H-10Z' + hole + '" fill="url(#' + id + 'dr)"/>';
    /* fabric: tapered tension folds fan out from the window corners, soft sags along the long sides */
    function wedge(x, y, ang, len, w) {
      var c = Math.cos(ang), sn = Math.sin(ang), nx = -sn, ny = c;
      var ex = x + c * len, ey = y + sn * len;
      return 'M' + f(x) + ' ' + f(y) + 'Q' + f(x + c * len * .5 + nx * w) + ' ' + f(y + sn * len * .5 + ny * w) + ' ' + f(ex + nx * w * .6) + ' ' + f(ey + ny * w * .6) +
        'L' + f(ex - nx * w * .6) + ' ' + f(ey - ny * w * .6) + 'Q' + f(x + c * len * .5 - nx * w * .2) + ' ' + f(y + sn * len * .5 - ny * w * .2) + ' ' + f(x) + ' ' + f(y) + 'Z';
    }
    [[x0 - 30, y0 - 30, -2.4, 1], [x0 - 30, y0 - 30, -2.0, .7], [x1 + 30, y0 - 30, -0.75, 1], [x1 + 30, y0 - 30, -1.1, .7],
      [x0 - 30, y1 + 30, 2.35, 1], [x0 - 30, y1 + 30, 1.95, .6], [x1 + 30, y1 + 30, 0.8, 1], [x1 + 30, y1 + 30, 1.2, .6]].forEach(function (q) {
      s += '<path d="' + wedge(q[0], q[1], q[2], 150 * q[3], 14 * q[3]) + '" fill="#0F3A4C" opacity=".42" filter="url(#' + id + 'b2)"/>';
      s += '<path d="' + wedge(q[0] - 4, q[1] - 4, q[2], 140 * q[3], 6 * q[3]) + '" fill="#9AD6E4" opacity=".16" filter="url(#' + id + 'b3)" transform="translate(-5 -3)"/>';
    });
    [[x0 - 52, x0 - 56], [x1 + 54, x1 + 50]].forEach(function (q) {
      s += '<path d="M' + q[0] + ' ' + (y0 + 60) + 'C' + (q[1] - 10) + ' ' + (y0 + 220) + ' ' + (q[1] + 8) + ' ' + (y1 - 220) + ' ' + q[0] + ' ' + (y1 - 60) + '" fill="none" stroke="#0F3A4C" stroke-width="18" opacity=".26" filter="url(#' + id + 'b)"/>';
    });
    s += '<path d="M' + (CX - 170) + ' ' + (y1 + 60) + 'Q' + CX + ' ' + (y1 + 90) + ' ' + (CX + 170) + ' ' + (y1 + 60) + '" fill="none" stroke="#0F3A4C" stroke-width="16" opacity=".22" filter="url(#' + id + 'b)"/>';
    /* towels framing the window, then their shadow on the skin */
    s += '<path fill-rule="evenodd" d="M' + (x0 - 30) + ' ' + (y0 - 30) + 'H' + (x1 + 30) + 'V' + (y1 + 30) + 'H' + (x0 - 30) + 'Z' + hole + '" fill="url(#' + id + 'tw)"/>';
    s += '<path d="M' + (x0 - 30) + ' ' + (y0 - 30) + 'H' + (x1 + 30) + 'V' + (y1 + 30) + 'H' + (x0 - 30) + 'Z" fill="none" stroke="#0E3646" stroke-width="5" opacity=".35" filter="url(#' + id + 'b2)"/>';
    s += '<path d="M' + (x0 - 14) + ' ' + (y0 - 30) + 'V' + (y1 + 30) + 'M' + (x1 + 14) + ' ' + (y0 - 30) + 'V' + (y1 + 30) + 'M' + (x0 - 30) + ' ' + (y0 - 13) + 'H' + (x1 + 30) + 'M' + (x0 - 30) + ' ' + (y1 + 14) + 'H' + (x1 + 30) + '" stroke="#1D5266" stroke-width="1.4" opacity=".55"/>';
    s += '<path d="M' + (x0 - 14) + ' ' + (y0 - 30) + 'V' + (y1 + 30) + 'M' + (x1 + 14) + ' ' + (y0 - 30) + 'V' + (y1 + 30) + 'M' + (x0 - 30) + ' ' + (y0 - 13) + 'H' + (x1 + 30) + 'M' + (x0 - 30) + ' ' + (y1 + 14) + 'H' + (x1 + 30) + '" stroke="#A8DDEA" stroke-width="1" opacity=".3" transform="translate(1.2 1.2)"/>';
    s += '<path d="' + hole + '" fill="none" stroke="#2A1408" stroke-width="10" opacity=".32" filter="url(#' + id + 'b2)" transform="translate(2 3)"/>';
    s += '<path d="' + hole + '" fill="none" stroke="#B6E4EE" stroke-width="1.3" opacity=".6"/>';
    /* towel clips at the corners */
    [[x0 - 14, y0 - 13], [x1 + 14, y0 - 13], [x0 - 14, y1 + 14], [x1 + 14, y1 + 14]].forEach(function (c) {
      s += '<g opacity=".9"><circle cx="' + c[0] + '" cy="' + c[1] + '" r="5" fill="none" stroke="#C9D3DB" stroke-width="2"/><circle cx="' + c[0] + '" cy="' + c[1] + '" r="1.6" fill="#8796A2"/></g>';
    });
    s += '<text class="wl-d" x="' + CX + '" y="' + (y0 - 42) + '" text-anchor="middle">▲ Head</text>';
    s += '<text class="wl-d" x="' + (x0 - 46) + '" y="400" text-anchor="middle" transform="rotate(-90 ' + (x0 - 46) + ' 400)">Patient’s right</text>';
    s += '<text class="wl-d" x="' + (x1 + 46) + '" y="400" text-anchor="middle" transform="rotate(90 ' + (x1 + 46) + ' 400)">Patient’s left</text>';
    return s;
  }

  function nodrape(id, g) {
    return '<path d="M0 0H600V74C450 92 150 64 0 82Z" fill="url(#' + id + 'tw)"/><path d="M0 82C150 64 450 92 600 74" fill="none" stroke="#2A1408" stroke-width="8" opacity=".28" filter="url(#' + id + 'b2)" transform="translate(0 4)"/>' +
      '<path d="M0 ' + (g.pubis[1] + 26) + 'C150 ' + (g.pubis[1] + 14) + ' 450 ' + (g.pubis[1] + 34) + ' 600 ' + (g.pubis[1] + 22) + 'V760H0Z" fill="url(#' + id + 'tw)"/>' +
      '<path d="M0 ' + (g.pubis[1] + 26) + 'C150 ' + (g.pubis[1] + 14) + ' 450 ' + (g.pubis[1] + 34) + ' 600 ' + (g.pubis[1] + 22) + '" fill="none" stroke="#2A1408" stroke-width="8" opacity=".3" filter="url(#' + id + 'b2)" transform="translate(0 -3)"/>' +
      '<text class="wl-d" x="' + CX + '" y="40" text-anchor="middle">▲ Head</text>' +
      '<text class="wl-d" x="20" y="400" text-anchor="middle" transform="rotate(-90 20 400)">Patient’s right</text>' +
      '<text class="wl-d" x="580" y="400" text-anchor="middle" transform="rotate(90 580 400)">Patient’s left</text>';
  }

  function under(id, g) {
    var s = '<g>', u = g.umb[1], p = g.pubis[1];
    s += '<path d="' + g.body + '" fill="#F4F7FA" opacity=".2"/>';
    /* liver and gallbladder fundus */
    var lv = g.liver;
    s += '<path d="' + smooth(lv.concat([[452, 150], [400, 118], [300, 104], [170, 104], [96, 146], [80, 260]]), true) + '" fill="#9C3F37" opacity=".15"/>';
    s += '<path d="' + smooth(lv, false) + '" fill="none" stroke="#8A3530" stroke-width="1.8" opacity=".75"/>';
    s += '<ellipse cx="' + f(g.gb[0]) + '" cy="' + f(g.gb[1]) + '" rx="10" ry="14" transform="rotate(-24 ' + f(g.gb[0]) + ' ' + f(g.gb[1]) + ')" fill="#5E9E68" opacity=".55" stroke="#3E7A4A" stroke-width="1.2"/>';
    /* falciform ligament and ligamentum teres, umbilicus to the liver */
    var lt = [[CX - 1, u - 10], [CX - 5, (u + 250) / 2], [CX - 9, yAt(lv, CX - 9) + 2]];
    s += '<path d="' + smooth(lt, false) + '" fill="none" stroke="#E8D3A0" stroke-width="5" opacity=".85"/>';
    s += '<path d="' + smooth(lt, false) + '" fill="none" stroke="#9F8450" stroke-width="1" opacity=".8"/>';
    s += '<path d="M' + f(CX - 9) + ' ' + f(yAt(lv, CX - 9) + 2) + 'Q' + (CX - 8) + ' 210 ' + (CX - 2) + ' 150" fill="none" stroke="#C9B07A" stroke-width="1.4" stroke-dasharray="3 3" opacity=".8"/>';
    /* aorta and iliac arteries: bifurcation at L4 */
    var bf = g.aortaBif;
    s += '<path d="M' + bf[0] + ' 150 L' + bf[0] + ' ' + bf[1] + 'M' + bf[0] + ' ' + bf[1] + 'Q' + (bf[0] - 30) + ' ' + (bf[1] + 50) + ' ' + f(g.ingR[0] + 4) + ' ' + f(g.ingR[1] + 4) + 'M' + bf[0] + ' ' + bf[1] + 'Q' + (bf[0] + 30) + ' ' + (bf[1] + 50) + ' ' + f(g.ingL[0] - 4) + ' ' + f(g.ingL[1] + 4) +
      '" fill="none" stroke="#C0392B" stroke-width="9" opacity=".2" stroke-linecap="round"/>';
    s += '<path d="M' + bf[0] + ' 150 L' + bf[0] + ' ' + bf[1] + '" stroke="#C0392B" stroke-width="1" stroke-dasharray="4 3" opacity=".55"/>';
    /* rectus abdominis in its sheath, with tendinous intersections */
    function rect(side) {
      var sg = side < 0 ? g.semiR : g.semiL, m = 4 * side;
      var pts = sg.slice().concat([[CX + 10 * side, p - 4], [CX + m, u + 60], [CX + m, u], [CX + m, 190], [CX + 34 * side, 176]]);
      var d = smooth(sg, false) + 'L' + (CX + 10 * side) + ' ' + (p - 4) + 'L' + (CX + m) + ' ' + (u + 60) + 'L' + (CX + m) + ' 196L' + (CX + 40 * side) + ' 182Z';
      var o = '<path d="' + d + '" fill="#B84A44" opacity=".11" stroke="#8E3A36" stroke-width="1" stroke-opacity=".35"/>';
      [u - 130, u - 64, u - 4].forEach(function (y) {
        var xo = xAt(sg, y);
        if (xo != null) o += '<path d="M' + (CX + m) + ' ' + y + 'Q' + f((CX + xo) / 2) + ' ' + (y + 6) + ' ' + f(xo) + ' ' + (y - 3) + '" fill="none" stroke="#F4EADD" stroke-width="2.4" opacity=".7"/>';
      });
      return o;
    }
    s += rect(-1) + rect(1);
    /* linea alba and arcuate line */
    s += '<path d="M' + CX + ' 190 L' + CX + ' ' + (p - 2) + '" stroke="#FFFFFF" stroke-width="3.2" opacity=".75"/>';
    s += '<path d="M' + f(xAt(g.semiR, g.arcuate) + 4) + ' ' + f(g.arcuate) + 'Q' + CX + ' ' + f(g.arcuate - 22) + ' ' + f(xAt(g.semiL, g.arcuate) - 4) + ' ' + f(g.arcuate) + '" fill="none" stroke="#F4EADD" stroke-width="1.3" stroke-dasharray="5 4" opacity=".85"/>';
    /* linea semilunaris */
    s += '<path d="' + smooth(g.semiR, false) + '" fill="none" stroke="#F9F1E6" stroke-width="2.2" opacity=".8"/>';
    s += '<path d="' + smooth(g.semiL, false) + '" fill="none" stroke="#F9F1E6" stroke-width="2.2" opacity=".8"/>';
    /* epigastric vessels: artery with paired veins */
    [[g.ieaR, g.seaR], [g.ieaL, g.seaL]].forEach(function (v) {
      var d1 = smooth(v[0], false), d2 = smooth(v[1], false);
      s += '<path d="' + d1 + '" fill="none" stroke="#3E6FC2" stroke-width="4.6" opacity=".5" transform="translate(2.4 0)"/>';
      s += '<path d="' + d1 + '" fill="none" stroke="#C8322A" stroke-width="2.6" opacity=".9"/>';
      s += '<path d="' + d2 + '" fill="none" stroke="#3E6FC2" stroke-width="3.6" opacity=".42" transform="translate(2 0)"/>';
      s += '<path d="' + d2 + '" fill="none" stroke="#C8322A" stroke-width="2" opacity=".75"/>';
    });
    /* bladder behind the pubis */
    s += '<ellipse cx="' + CX + '" cy="' + (p - 22) + '" rx="36" ry="26" fill="#E9D98A" opacity=".32" stroke="#B49B3E" stroke-width="1" stroke-opacity=".6"/>';
    /* bone: lower ribs, costal cartilage, xiphoid, pelvis */
    function bone(d, w) { return '<path d="' + d + '" fill="none" stroke="#F7F1E3" stroke-width="' + w + '" stroke-linecap="round" opacity=".9"/><path d="' + d + '" fill="none" stroke="#7D6A4E" stroke-width="' + (w + 2.2) + '" stroke-linecap="round" opacity=".18"/>'; }
    var cr = g.costalR, cl = g.costalL;
    [[[84, 262], [116, 286], [140, 312], [159, 316]], [[84, 214], [124, 240], [160, 270], [181, 290]], [[86, 166], [130, 196], [176, 232], [205, 260]], [[96, 122], [150, 152], [204, 192], [233, 226]]].forEach(function (r) {
      r = r.map(function (q) { return [CX + (q[0] - CX) * g.H.fb, q[1]]; });
      s += '<path d="' + smooth(r, false) + '" fill="none" stroke="#EFE6D2" stroke-width="7" opacity=".42" stroke-linecap="round"/>';
      s += '<path d="' + smooth(mirAll(r), false) + '" fill="none" stroke="#EFE6D2" stroke-width="7" opacity=".42" stroke-linecap="round"/>';
    });
    s += bone(smooth(cr, false), 5) + bone(smooth(cl, false), 5);
    s += '<path d="M' + (CX - 9) + ' 150L' + (CX + 9) + ' 150L' + (CX + 6) + ' ' + (g.xiphoid[1] - 6) + 'Q' + CX + ' ' + (g.xiphoid[1] + 4) + ' ' + (CX - 6) + ' ' + (g.xiphoid[1] - 6) + 'Z" fill="#F7F1E3" opacity=".85" stroke="#7D6A4E" stroke-opacity=".35"/>';
    s += bone(smooth(g.crestR.slice().reverse().concat([[g.asisR[0] + 4, g.asisR[1] + 20]]), false), 6) + bone(smooth(g.crestL.slice().reverse().concat([[g.asisL[0] - 4, g.asisL[1] + 20]]), false), 6);
    s += bone('M' + f(g.tubR[0] - 10) + ' ' + f(g.tubR[1] + 6) + 'Q' + CX + ' ' + f(p - 6) + ' ' + f(g.tubL[0] + 10) + ' ' + f(g.tubL[1] + 6), 5);
    /* inguinal ligaments */
    s += '<path d="M' + f(g.asisR[0]) + ' ' + f(g.asisR[1]) + 'Q' + f((g.asisR[0] + g.tubR[0]) / 2 + 6) + ' ' + f((g.asisR[1] + g.tubR[1]) / 2 + 14) + ' ' + f(g.tubR[0]) + ' ' + f(g.tubR[1]) +
      'M' + f(g.asisL[0]) + ' ' + f(g.asisL[1]) + 'Q' + f((g.asisL[0] + g.tubL[0]) / 2 - 6) + ' ' + f((g.asisL[1] + g.tubL[1]) / 2 + 14) + ' ' + f(g.tubL[0]) + ' ' + f(g.tubL[1]) + '" fill="none" stroke="#F4EADD" stroke-width="2" opacity=".85"/>';
    s += '</g>';
    return s;
  }

  function scars(g, list) {
    var s = '', u = g.umb[1], p = g.pubis[1], x = g.xiphoid[1];
    function scar(d, w) {
      return '<path d="' + d + '" fill="none" stroke="#8C5A4A" stroke-width="' + (w + 3) + '" stroke-linecap="round" opacity=".28"/>' +
        '<path d="' + d + '" fill="none" stroke="#F1D2C6" stroke-width="' + w + '" stroke-linecap="round" opacity=".95"/>' +
        '<path d="' + d + '" fill="none" stroke="#FFF6F0" stroke-width="' + Math.max(1, w - 2.6) + '" stroke-linecap="round" opacity=".7" stroke-dasharray="1 7"/>';
    }
    var um = 'M' + CX + ' ' + (u - 18) + 'Q' + (CX + 20) + ' ' + u + ' ' + CX + ' ' + (u + 18);
    (list || []).forEach(function (k) {
      if (k === 'midline') s += scar('M' + CX + ' ' + (x + 6) + 'L' + CX + ' ' + (u - 18) + 'Q' + (CX + 20) + ' ' + u + ' ' + CX + ' ' + (u + 18) + 'L' + CX + ' ' + (p - 22), 3.6);
      else if (k === 'upper-midline') s += scar('M' + CX + ' ' + (x + 6) + 'L' + CX + ' ' + (u - 18) + 'Q' + (CX + 14) + ' ' + (u - 8) + ' ' + (CX + 12) + ' ' + (u - 2), 3.6);
      else if (k === 'kocher') s += scar(smooth(g.costalR.slice(1, 7).map(function (q) { return [q[0] + 4, q[1] + 2.5 * K]; }), false), 3.6);
      else if (k === 'pfannenstiel') s += scar('M' + (CX - 78) + ' ' + (p - 30) + 'Q' + CX + ' ' + (p - 10) + ' ' + (CX + 78) + ' ' + (p - 30), 3.4);
      else if (k === 'mcburney') {
        var m = g.mcb, dx = 0.55, dy = 0.84; /* perpendicular to the ASIS-umbilicus line */
        s += scar('M' + f(m[0] - dx * 40) + ' ' + f(m[1] - dy * 40) + 'L' + f(m[0] + dx * 40) + ' ' + f(m[1] + dy * 40), 3.4);
      } else if (k === 'lap') {
        s += scar('M' + (CX - 9) + ' ' + (u + 16) + 'Q' + CX + ' ' + (u + 22) + ' ' + (CX + 9) + ' ' + (u + 16), 3);
        s += scar('M' + (CX - 9) + ' ' + (x + 30) + 'L' + (CX + 9) + ' ' + (x + 34), 3);
        var a = [g.mclR, yAt(g.costalR, g.mclR) + 2.5 * K], b = [g.aalR + 6, yAt(g.costalR, g.aalR + 6) + 4 * K];
        s += scar('M' + f(a[0] - 6) + ' ' + f(a[1] - 2) + 'L' + f(a[0] + 6) + ' ' + f(a[1] + 2), 2.6);
        s += scar('M' + f(b[0] - 6) + ' ' + f(b[1] - 2) + 'L' + f(b[0] + 6) + ' ' + f(b[1] + 2), 2.6);
      }
    });
    return s;
  }

  function zones(id, list) {
    return (list || []).map(function (z) {
      var k = z.kind === 'danger' ? 'zd' : z.kind === 'ok' ? 'zo' : 'zi', c = z.kind === 'danger' ? '#B3271A' : z.kind === 'ok' ? '#A8700E' : '#0B7A6D';
      var r = z.r || 30;
      return '<g><circle cx="' + z.x + '" cy="' + z.y + '" r="' + r + '" fill="url(#' + id + k + ')"/>' +
        '<circle cx="' + z.x + '" cy="' + z.y + '" r="' + r + '" fill="none" stroke="' + c + '" stroke-width="1.2" stroke-dasharray="4 4" opacity=".55"/>' +
        (z.he ? '<text class="wl-t s" x="' + z.x + '" y="' + f(z.y + r + 13) + '" text-anchor="middle" style="fill:' + c + '"' + rtl(z.he) + '>' + esc(z.he) + '</text>' : '') + '</g>';
    }).join('');
  }

  var RING = { ok: '#1F9D63', warn: '#E0A030', bad: '#C23B2B' };
  var TAG = { cam: '#0A2236', work: '#0C8F80', assist: '#5A6B7C' };
  function trocar(id, p, i) {
    var sz = p.size || 5, r = 7 + sz * 0.95, x = p.x, y = p.y, ring = RING[p.state] || RING.ok, tag = TAG[p.kind] || TAG.work;
    var s = '<g class="wl-pop" style="animation-delay:' + (i * 70) + 'ms">';
    s += '<ellipse cx="' + f(x + 5) + '" cy="' + f(y + 7) + '" rx="' + f(r + 3) + '" ry="' + f(r + 1) + '" fill="#2A1408" opacity=".38" filter="url(#' + id + 'b2)"/>';
    /* skin incision peeking out under the housing */
    var il = sz * 1.25 + 6;
    s += '<path d="M' + f(x - il / 2 - r * .45) + ' ' + f(y + r * .62) + 'l' + f(il) + ' ' + f(-il * .35) + '" stroke="#7A2A1E" stroke-width="2.2" stroke-linecap="round"/>';
    s += '<circle cx="' + x + '" cy="' + y + '" r="' + f(r + 4.2) + '" fill="none" stroke="' + ring + '" stroke-width="3"/>';
    /* stopcock for insufflation on 10 and 12 mm ports */
    if (sz >= 10) s += '<g transform="rotate(-35 ' + x + ' ' + y + ')"><rect x="' + f(x + r - 2) + '" y="' + f(y - 3.2) + '" width="' + f(r * .75) + '" height="6.4" rx="2" fill="#C9D1D8" stroke="#6B7884" stroke-width=".8"/>' +
      '<rect x="' + f(x + r * 1.6) + '" y="' + f(y - 4.5) + '" width="5" height="9" rx="1.5" fill="#2F7FC0"/></g>';
    s += '<circle cx="' + x + '" cy="' + y + '" r="' + f(r) + '" fill="url(#' + id + 'tr)" stroke="#5C6873" stroke-width="1"/>';
    s += '<circle cx="' + x + '" cy="' + y + '" r="' + f(r * .62) + '" fill="#26313B"/>';
    s += '<circle cx="' + x + '" cy="' + y + '" r="' + f(r * .62) + '" fill="none" stroke="#9AA7B2" stroke-width="1"/>';
    s += '<path d="M' + f(x - r * .4) + ' ' + y + 'H' + f(x + r * .4) + 'M' + x + ' ' + f(y - r * .4) + 'V' + f(y + r * .4) + '" stroke="#5E6B76" stroke-width="1.1"/>';
    s += '<circle cx="' + f(x - r * .35) + '" cy="' + f(y - r * .42) + '" r="' + f(r * .22) + '" fill="#fff" opacity=".7"/>';
    var tx = x + r * .78 + 6, ty = y - r * .78 - 6;
    s += '<circle cx="' + f(tx) + '" cy="' + f(ty) + '" r="9" fill="' + tag + '" stroke="#fff" stroke-width="1.6"/>';
    s += '<text class="wl-n" x="' + f(tx) + '" y="' + f(ty + 3.8) + '" text-anchor="middle">' + esc(p.n || (i + 1)) + '</text>';
    s += '<text class="wl-mm" x="' + f(x) + '" y="' + f(y + r + 17) + '" text-anchor="middle">' + sz + '</text>';
    return s + '</g>';
  }

  function workAngle(st) {
    var w = (st.ports || []).filter(function (p) { return p.kind === 'work'; });
    if (!st.target || w.length < 2) return null;
    var t = st.target, dz = (st.depth == null ? 7 : st.depth) * K;
    var a = [w[0].x - t[0], w[0].y - t[1], dz], b = [w[1].x - t[0], w[1].y - t[1], dz];
    var c = (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.sqrt((a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) * (b[0] * b[0] + b[1] * b[1] + b[2] * b[2]));
    return { deg: Math.round(Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI), a: w[0], b: w[1] };
  }

  function aim(id, st) {
    var t = st.target, s = '';
    if (!t) return '';
    (st.ports || []).forEach(function (p) {
      if (p.kind === 'assist') return;
      s += '<path d="M' + p.x + ' ' + p.y + 'L' + t[0] + ' ' + t[1] + '" stroke="' + (p.kind === 'cam' ? '#0A2236' : '#0A6F64') + '" stroke-width="1.6" stroke-dasharray="' + (p.kind === 'cam' ? '2 4' : '6 4') + '" opacity=".75" fill="none"/>';
    });
    s += '<g class="wl-pulse"><circle cx="' + t[0] + '" cy="' + t[1] + '" r="13" fill="none" stroke="#0A2236" stroke-width="1.6"/></g>';
    s += '<circle cx="' + t[0] + '" cy="' + t[1] + '" r="4" fill="#0A2236"/><path d="M' + (t[0] - 20) + ' ' + t[1] + 'h12M' + (t[0] + 8) + ' ' + t[1] + 'h12M' + t[0] + ' ' + (t[1] - 20) + 'v12M' + t[0] + ' ' + (t[1] + 8) + 'v12" stroke="#0A2236" stroke-width="1.4"/>';
    var an = st.angle ? workAngle(st) : null;
    if (an) {
      var a1 = Math.atan2(an.a.y - t[1], an.a.x - t[0]), a2 = Math.atan2(an.b.y - t[1], an.b.x - t[0]), R = 30;
      var d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      var good = an.deg >= 45 && an.deg <= 90, col = good ? '#0C8F80' : '#C98712';
      var p1 = [t[0] + R * Math.cos(a1), t[1] + R * Math.sin(a1)], p2 = [t[0] + R * Math.cos(a1 + d), t[1] + R * Math.sin(a1 + d)];
      var mid = a1 + d / 2, lx = t[0] + (R + 22) * Math.cos(mid), ly = t[1] + (R + 22) * Math.sin(mid);
      s += '<path d="M' + t[0] + ' ' + t[1] + 'L' + f(p1[0]) + ' ' + f(p1[1]) + 'A' + R + ' ' + R + ' 0 0 ' + (d > 0 ? 1 : 0) + ' ' + f(p2[0]) + ' ' + f(p2[1]) + 'Z" fill="' + col + '" opacity=".18"/>';
      s += '<path d="M' + f(p1[0]) + ' ' + f(p1[1]) + 'A' + R + ' ' + R + ' 0 0 ' + (d > 0 ? 1 : 0) + ' ' + f(p2[0]) + ' ' + f(p2[1]) + '" fill="none" stroke="' + col + '" stroke-width="2.4"/>';
      s += '<g><rect x="' + f(lx - 21) + '" y="' + f(ly - 11) + '" width="42" height="21" rx="10.5" fill="' + col + '"/><text class="wl-n" x="' + f(lx) + '" y="' + f(ly + 4) + '" text-anchor="middle" style="font-size:12.5px">' + an.deg + '°</text></g>';
    }
    return s;
  }

  function palmer(g) {
    var p = g.palmer, c = g.costalAtMclL;
    return '<path d="M' + f(c[0]) + ' ' + f(c[1] + 3) + 'V' + f(p[1] - 9) + '" stroke="#0A2236" stroke-width="1.2" stroke-dasharray="2 2.5"/>' +
      '<path d="M' + f(c[0] - 5) + ' ' + f(c[1] + 3) + 'h10M' + f(c[0] - 5) + ' ' + f(p[1] - 9) + 'h10" stroke="#0A2236" stroke-width="1.2"/>' +
      '<g class="wl-pulse"><circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="9" fill="none" stroke="#0C8F80" stroke-width="2"/></g>' +
      '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="4.2" fill="#0C8F80" stroke="#fff" stroke-width="1.4"/>' +
      '<text class="wl-t s" x="' + f(p[0] + 14) + '" y="' + f((c[1] + p[1]) / 2 + 4) + '">~3 cm</text>';
  }

  /* label whose LEFT edge sits at x (al='l'), right edge (al='r') or centred */
  function T(x, y, txt, al, cls) {
    var w = String(txt).length * 6.3;
    var cx = al === 'l' ? x + w / 2 : al === 'r' ? x - w / 2 : x;
    return '<text class="wl-t' + (cls ? ' ' + cls : '') + '" x="' + f(cx) + '" y="' + f(y) + '" text-anchor="middle"' + rtl(txt) + '>' + esc(txt) + '</text>';
  }
  function dot(p, r) { return '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="' + (r || 3) + '" fill="#13222F" stroke="#fff" stroke-width="1.2"/>'; }

  function labels(g, st) {
    var s = '', w = g.win, top = st.drape === false ? 70 : w[1] + 26, bot = st.drape === false ? 690 : w[3] - 14;
    /* reference lines */
    [g.mclR, g.mclL].forEach(function (x) { s += '<path d="M' + f(x) + ' ' + top + 'V' + bot + '" stroke="#0A2236" stroke-width="1" stroke-dasharray="7 6" opacity=".38"/>'; });
    [g.aalR, g.aalL].forEach(function (x) { s += '<path d="M' + f(x) + ' ' + top + 'V' + bot + '" stroke="#0A2236" stroke-width="1" stroke-dasharray="2 5" opacity=".42"/>'; });
    var vy = 178, va = 236;
    s += '<text class="wl-t s" x="' + f(g.mclR - 6) + '" y="' + vy + '" text-anchor="middle" transform="rotate(-90 ' + f(g.mclR - 6) + ' ' + vy + ')">Midclavicular</text>';
    s += '<text class="wl-t s" x="' + f(g.mclL + 6) + '" y="' + vy + '" text-anchor="middle" transform="rotate(90 ' + f(g.mclL + 6) + ' ' + vy + ')">Midclavicular</text>';
    s += '<text class="wl-t s" x="' + f(g.aalR + 10) + '" y="' + va + '" text-anchor="middle" transform="rotate(-90 ' + f(g.aalR + 10) + ' ' + va + ')">Anterior axillary</text>';
    s += '<text class="wl-t s" x="' + f(g.aalL - 10) + '" y="' + va + '" text-anchor="middle" transform="rotate(90 ' + f(g.aalL - 10) + ' ' + va + ')">Anterior axillary</text>';
    /* landmarks */
    s += dot(g.xiphoid) + T(CX, g.xiphoid[1] - 12, 'Xiphoid');
    s += dot([CX + 16, g.umb[1]], 2.4) + T(CX + 24, g.umb[1] + 4, 'Umbilicus', 'l');
    s += dot(g.pubis) + T(CX, g.pubis[1] - 10, 'Pubis');
    s += dot(g.asisR) + T(g.asisR[0] + 4, g.asisR[1] + 24, 'ASIS', null, 's');
    s += dot(g.asisL) + T(g.asisL[0] - 4, g.asisL[1] + 24, 'ASIS', null, 's');
    var cm = g.costalR[4];
    s += T(cm[0] + 14, cm[1] + 20, 'Costal margin', 'l');
    var cm2 = g.costalL[4];
    s += T(cm2[0] - 14, cm2[1] + 20, 'Costal margin', 'r');
    if (st.under) {
      var iy = g.umb[1] + 34, ix = xAt(g.ieaL, iy);
      s += T(ix + 10, iy + 4, 'Epigastric vessels', 'l', 's u');
      var lv = g.liver[1];
      s += T(lv[0], lv[1] + 24, 'Liver edge', null, 's u');
      s += T(g.gb[0] + 16, g.gb[1] + 4, 'Gallbladder', 'l', 's u');
      s += T(CX - 12, (g.umb[1] + 250) / 2 + 30, 'Round ligament', 'r', 's u');
      var sy = (g.umb[1] + g.arcuate) / 2;
      s += T(xAt(g.semiR, sy) - 8, sy + 4, 'Linea semilunaris', 'r', 's u');
      s += T(CX, g.pubis[1] - 30, 'Bladder', null, 's u');
      s += T(g.aortaBif[0] + 14, g.aortaBif[1] - 22, 'Aortic bifurcation', 'l', 's u');
    }
    if (st.palmer) s += T(g.palmer[0] + 14, g.palmer[1] + 20, 'Palmer’s point', 'l');
    return s;
  }

  function spotList(g) {
    return [
      { id: 'xiphoid', he: 'Xiphoid', x: g.xiphoid[0], y: g.xiphoid[1] },
      { id: 'umb', he: 'Umbilicus', x: g.umb[0], y: g.umb[1] },
      { id: 'pubis', he: 'Pubic symphysis', x: g.pubis[0], y: g.pubis[1] },
      { id: 'asisR', he: 'Right anterior superior iliac spine', x: g.asisR[0], y: g.asisR[1] },
      { id: 'asisL', he: 'Left anterior superior iliac spine', x: g.asisL[0], y: g.asisL[1] },
      { id: 'costalR', he: 'Right costal margin, midclavicular line', x: f(g.costalAtMclR[0]), y: f(g.costalAtMclR[1]) },
      { id: 'costalL', he: 'Left costal margin, midclavicular line', x: f(g.costalAtMclL[0]), y: f(g.costalAtMclL[1]) },
      { id: 'aalR', he: 'Right anterior axillary line, below the costal margin', x: f(g.costalAtAalR[0]), y: f(g.costalAtAalR[1] + 2 * K) },
      { id: 'aalL', he: 'Left anterior axillary line, below the costal margin', x: f(g.costalAtAalL[0]), y: f(g.costalAtAalL[1] + 2 * K) },
      { id: 'palmer', he: 'Palmer’s point', x: f(g.palmer[0]), y: f(g.palmer[1]) },
      { id: 'mcburney', he: 'McBurney’s point', x: f(g.mcb[0]), y: f(g.mcb[1]) },
      { id: 'gb', he: 'Gallbladder fundus', x: f(g.gb[0]), y: f(g.gb[1]) },
      { id: 'epigR', he: 'Right epigastric vessels', x: f(xAt(g.ieaR, g.umb[1] + 40)), y: g.umb[1] + 40 },
      { id: 'epigL', he: 'Left epigastric vessels', x: f(xAt(g.ieaL, g.umb[1] + 40)), y: g.umb[1] + 40 },
      { id: 'ingR', he: 'Right mid-groin', x: f(g.ingR[0]), y: f(g.ingR[1]) },
      { id: 'ingL', he: 'Left mid-groin', x: f(g.ingL[0]), y: f(g.ingL[1]) },
      { id: 'supra', he: 'Above the pubis (bladder)', x: g.supra[0], y: g.supra[1] }
    ];
  }

  O.scenes.wall = {
    vb: [600, 760],
    draw: function (st) {
      st = st || {};
      var id = (st.id || 'wl') + '-', g = geo(st.habitus), dr = st.drape !== false;
      var s = '<svg class="scene-wall" viewBox="0 0 600 760" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Anterior abdominal wall seen from above">' + defs(id, g);
      s += dr ? '<rect width="600" height="760" fill="url(#' + id + 'dr)"/>' : '<rect width="600" height="760" fill="url(#' + id + 'tb)"/>';
      s += skin(id, g, st);
      if (dr) s += tint(id, g);
      if (st.under) s += under(id, g);
      s += scars(g, st.scars);
      s += dr ? drape(id, g) : nodrape(id, g);
      s += zones(id, st.zones);
      if (st.palmer) s += palmer(g);
      if (st.labels) s += labels(g, st);
      s += aim(id, st);
      (st.ports || []).forEach(function (p, i) { s += trocar(id, p, i); });
      if (st.focus) {
        var sp = spotList(g).filter(function (q) { return q.id === st.focus; })[0];
        if (sp) s += '<g class="wl-pulse"><circle cx="' + sp.x + '" cy="' + sp.y + '" r="15" fill="#14B8A6" fill-opacity=".18" stroke="#14B8A6" stroke-width="2.4"/></g>' +
          T(sp.x, sp.y - 22, sp.he);
      }
      return s + '</svg>';
    },
    spots: function (st) { return spotList(geo((st || {}).habitus)); },
    landmarks: function (st) { return lmOf(geo((st || {}).habitus)); },
    lm: lmOf(geo('normal')),
    states: {
      drape: 'bool, default true: sterile field between drapes. false: the whole torso on the table',
      habitus: "'normal' | 'obese' (wide, umbilicus lower and the aortic bifurcation above it) | 'thin'",
      scars: "array of 'midline' | 'upper-midline' | 'kocher' | 'pfannenstiel' | 'mcburney' | 'lap'",
      under: 'bool: transparent anatomy layer (ribs, rectus muscles, linea alba, linea semilunaris, epigastric vessels, liver edge, round ligament, bladder, aorta)',
      zones: "[{x, y, r, kind: 'ideal'|'ok'|'danger', he}]",
      ports: "[{x, y, size: 5|10|12, kind: 'cam'|'work'|'assist', state: 'ok'|'warn'|'bad', n}]",
      target: '[x, y]: lines from the camera and the working ports',
      angle: 'bool: angle between the first two working ports, computed in 3D at depth',
      depth: 'target depth in cm below the wall, default 7 (0 = flat angle on the page)',
      palmer: 'bool: Palmer’s point, 3 cm below the left costal margin in the midclavicular line',
      labels: 'bool: labels and reference lines',
      focus: 'spot id from spots()',
      id: 'unique prefix for ids inside the SVG'
    }
  };
})();
