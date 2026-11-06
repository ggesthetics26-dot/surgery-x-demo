/* ORBIT scene · laparoscopic TAPP field, RIGHT groin, posterior view (viewBox 0 0 960 600).
   Camera: 30° scope at the umbilicus looking down at the right groin.
   Lateral (ASIS) = viewer's LEFT, midline / bladder = viewer's RIGHT,
   anterior abdominal wall = top of the image, pelvic brim and iliac vessels = bottom.
   One painting whose layers follow the case state (defect, flap, mesh, tacks, closure, bleeding).
   Original vectors drawn from anatomical relations only. No patient material. */
(function () {
  'use strict';
  var O = window.ORBIT = window.ORBIT || {};
  O.scenes = O.scenes || {};

  /* ---------------- small geometry kit ---------------- */
  function r1(x) { return Math.round(x * 10) / 10; }
  function P(p) { return r1(p[0]) + ' ' + r1(p[1]); }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function rng(seed) { var s = seed % 2147483647; if (s <= 0) s += 2147483646; return function () { s = s * 16807 % 2147483647; return (s - 1) / 2147483646; }; }

  /* curve = flat list of points: p0, c1, c2, p1, c1, c2, p2 ... (cubic chain) */
  function cpath(a) { var s = 'M' + P(a[0]) + ' C'; for (var i = 1; i < a.length; i++) s += P(a[i]) + (i < a.length - 1 ? ' ' : ''); return s; }
  function bz(p0, c1, c2, p1, t) {
    var u = 1 - t;
    return [u * u * u * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p1[0],
            u * u * u * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p1[1]];
  }
  var SCACHE = {};
  function sample(a, n, key) {
    if (key && SCACHE[key + n]) return SCACHE[key + n];
    var pts = [], segs = (a.length - 1) / 3;
    for (var s = 0; s < segs; s++) {
      var p0 = a[s * 3], c1 = a[s * 3 + 1], c2 = a[s * 3 + 2], p1 = a[s * 3 + 3];
      for (var i = (s ? 1 : 0); i <= n; i++) pts.push(bz(p0, c1, c2, p1, i / n));
    }
    for (var j = 0; j < pts.length; j++) {
      var q0 = pts[Math.max(0, j - 1)], q1 = pts[Math.min(pts.length - 1, j + 1)];
      var dx = q1[0] - q0[0], dy = q1[1] - q0[1], L = Math.sqrt(dx * dx + dy * dy) || 1;
      pts[j] = [pts[j][0], pts[j][1], -dy / L, dx / L];
    }
    if (key) SCACHE[key + n] = pts;
    return pts;
  }
  function at(a, t, key) { var s = sample(a, 24, key), i = Math.round(t * (s.length - 1)); return [s[i][0], s[i][1]]; }
  /* polyline offset along the normal */
  function off(pts, d, t0, t1) {
    var n = pts.length, i0 = Math.round((t0 || 0) * (n - 1)), i1 = Math.round((t1 == null ? 1 : t1) * (n - 1)), s = '';
    for (var i = i0; i <= i1; i++) s += (i === i0 ? 'M' : 'L') + r1(pts[i][0] + pts[i][2] * d) + ' ' + r1(pts[i][1] + pts[i][3] * d);
    return s;
  }
  /* tapered ribbon polygon, w(t) = width at t */
  function ribbon(pts, w0, w1, wm) {
    var n = pts.length, L = '', R = '';
    for (var i = 0; i < n; i++) {
      var t = i / (n - 1), w = (wm == null ? lerp(w0, w1, t) : (t < .5 ? lerp(w0, wm, t * 2) : lerp(wm, w1, t * 2 - 1))) / 2;
      L += (i ? 'L' : 'M') + r1(pts[i][0] + pts[i][2] * w) + ' ' + r1(pts[i][1] + pts[i][3] * w);
    }
    for (var j = n - 1; j >= 0; j--) {
      var t2 = j / (n - 1), w2 = (wm == null ? lerp(w0, w1, t2) : (t2 < .5 ? lerp(w0, wm, t2 * 2) : lerp(wm, w1, t2 * 2 - 1))) / 2;
      R += 'L' + r1(pts[j][0] - pts[j][2] * w2) + ' ' + r1(pts[j][1] - pts[j][3] * w2);
    }
    return L + R + 'Z';
  }
  function pathOf(d, fill, extra) { return '<path d="' + d + '" fill="' + fill + '"' + (extra || '') + '/>'; }
  function stroke(d, col, w, extra) { return '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"' + (extra || '') + '/>'; }

  /* ---------------- the anatomy (fixed coordinates) ---------------- */
  /* Relations kept on purpose:
     - internal ring lateral to the inferior epigastric origin, its lower rim on the iliopubic tract
     - vas medial and gonadal vessels lateral, meeting at the ring: the triangle of doom holds the external iliac vessels
     - vas and gonadal vessels run on the peritoneal (camera) side of the tract, the iliac vessels pass deep to it
     - femoral ring below the tract, medial to the external iliac vein, lateral to the lacunar end of Cooper's ligament
     - triangle of pain: below the tract, lateral to the gonadal vessels (LFCN, femoral branch of the genitofemoral nerve)
     - Hesselbach: medial to the epigastrics, above the tract and Cooper, lateral to the rectus / medial umbilical fold */
  var RING = [392, 336];
  var C = {
    iev:   [[450, 418], [470, 356], [498, 286], [510, 226], [522, 166], [538, 80], [550, -12]],
    eia:   [[352, 612], [380, 548], [414, 474], [448, 398]],
    eiv:   [[420, 614], [444, 548], [470, 476], [500, 408]],
    ipt:   [[24, 286], [150, 312], [290, 350], [398, 378], [470, 396], [550, 414], [610, 430], [636, 437], [656, 444], [678, 454]],
    vas:   [[404, 350], [432, 368], [462, 404], [490, 444], [522, 490], [566, 546], [618, 614]],
    gon1:  [[384, 354], [374, 400], [362, 448], [350, 498], [340, 540], [326, 580], [310, 614]],
    gon2:  [[394, 356], [386, 404], [374, 452], [364, 500], [354, 540], [342, 580], [328, 614]],
    gonA:  [[389, 356], [381, 402], [369, 450], [358, 499], [347, 540], [334, 580], [318, 614]],
    cooper:[[514, 470], [600, 464], [700, 470], [790, 480], [830, 484], [866, 488], [900, 494]],
    corona:[[584, 418], [592, 446], [598, 472], [600, 502], [602, 532], [606, 566], [612, 612]],
    coronaA:[[594, 420], [600, 450], [604, 476], [607, 504], [609, 534], [613, 568], [619, 612]],
    medul: [[772, -12], [762, 120], [738, 238], [714, 336], [692, 428], [668, 512], [640, 612]],
    medulD:[[748, 204], [736, 282], [716, 360], [700, 430], [684, 492], [664, 542], [640, 606]],
    mul:   [[874, -12], [876, 150], [880, 330], [888, 476]],
    lfcn:  [[226, 614], [204, 546], [166, 452], [124, 330]],
    gfnf:  [[294, 614], [290, 540], [280, 470], [270, 362]],
    gfng:  [[282, 478], [314, 436], [350, 398], [378, 366]],
    incis: [[46, 214], [196, 192], [398, 176], [560, 180], [640, 182], [704, 192], [746, 204]]
  };
  var FEM = [540, 446];
  var HESS = [616, 318];
  var MESH = [[138, 126], [946, 102], [958, 566], [162, 580]];
  /* ---------------- definitions ---------------- */
  function defs(id) {
    var g = function (n) { return id + '-' + n; };
    return '<defs>' +
      '<linearGradient id="' + g('fat') + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C08A5E"/><stop offset=".4" stop-color="#D6A75E"/><stop offset=".75" stop-color="#CF9B50"/><stop offset="1" stop-color="#A9743A"/></linearGradient>' +
      '<radialGradient id="' + g('peri') + '" cx="50%" cy="46%" r="70%"><stop offset="0" stop-color="#F4D3C0"/><stop offset=".5" stop-color="#E7AF96"/><stop offset="1" stop-color="#BF7660"/></radialGradient>' +
      '<linearGradient id="' + g('wall') + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C4887A"/><stop offset=".45" stop-color="#DDB49E"/><stop offset=".8" stop-color="#E8CDB4"/><stop offset="1" stop-color="#E2C29E"/></linearGradient>' +
      '<radialGradient id="' + g('lob') + '" cx="38%" cy="34%" r="70%"><stop offset="0" stop-color="#FCE7A0"/><stop offset=".55" stop-color="#EBC165"/><stop offset="1" stop-color="#C8913D"/></radialGradient>' +
      '<radialGradient id="' + g('lobR') + '" cx="38%" cy="34%" r="70%"><stop offset="0" stop-color="#F9DC9A"/><stop offset=".6" stop-color="#DFAE62"/><stop offset="1" stop-color="#B5793A"/></radialGradient>' +
      '<linearGradient id="' + g('sac') + '" x1="0" y1="0" x2="1" y2=".3"><stop offset="0" stop-color="#E9BFAE"/><stop offset=".45" stop-color="#F6DDD0"/><stop offset="1" stop-color="#D9A08C"/></linearGradient>' +
      '<linearGradient id="' + g('flap') + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7E0D3"/><stop offset=".3" stop-color="#E8B9A6"/><stop offset="1" stop-color="#B9786A"/></linearGradient>' +
      '<linearGradient id="' + g('bone') + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4ECDA"/><stop offset=".35" stop-color="#D9C6A2"/><stop offset="1" stop-color="#8E7650"/></linearGradient>' +
      '<linearGradient id="' + g('psoas') + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B8675A"/><stop offset=".6" stop-color="#9C4E44"/><stop offset="1" stop-color="#6E3028"/></linearGradient>' +
      '<radialGradient id="' + g('hole') + '" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#0B0405"/><stop offset=".55" stop-color="#2A0F0C"/><stop offset=".85" stop-color="#6E3428"/><stop offset="1" stop-color="#B2725E" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + g('dip') + '" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#5C2A22" stop-opacity=".62"/><stop offset=".6" stop-color="#8C4A3A" stop-opacity=".28"/><stop offset="1" stop-color="#8C4A3A" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + g('bladder') + '" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#F0D3BE"/><stop offset=".6" stop-color="#DDAF92"/><stop offset="1" stop-color="#B98166"/></radialGradient>' +
      '<radialGradient id="' + g('ret') + '" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#3A1B12" stop-opacity=".55"/><stop offset="1" stop-color="#3A1B12" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + g('tack') + '" cx="38%" cy="32%" r="70%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".35" stop-color="#C9D1D6"/><stop offset=".75" stop-color="#7C878E"/><stop offset="1" stop-color="#3F474D"/></radialGradient>' +
      '<radialGradient id="' + g('blood') + '" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#C3161E"/><stop offset=".6" stop-color="#8A0B10"/><stop offset="1" stop-color="#4E0407"/></radialGradient>' +
      '<radialGradient id="' + g('vblood') + '" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#7E1420"/><stop offset=".6" stop-color="#52080F"/><stop offset="1" stop-color="#2B0306"/></radialGradient>' +
      '<radialGradient id="' + g('gut') + '" cx="40%" cy="30%" r="75%"><stop offset="0" stop-color="#F6C6B4"/><stop offset=".6" stop-color="#E29A84"/><stop offset="1" stop-color="#B66852"/></radialGradient>' +
      '<radialGradient id="' + g('gutI') + '" cx="40%" cy="30%" r="75%"><stop offset="0" stop-color="#B05A6A"/><stop offset=".6" stop-color="#7B2D44"/><stop offset="1" stop-color="#43132A"/></radialGradient>' +
      '<radialGradient id="' + g('glare') + '" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFF8F0" stop-opacity=".22"/><stop offset="1" stop-color="#FFF8F0" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + g('shade') + '" cx="50%" cy="44%" r="62%"><stop offset=".35" stop-color="#2A0C04" stop-opacity="0"/><stop offset=".8" stop-color="#2A0C04" stop-opacity=".32"/><stop offset="1" stop-color="#2A0C04" stop-opacity=".55"/></radialGradient>' +
      '<radialGradient id="' + g('vig') + '" cx="50%" cy="47%" r="62%"><stop offset=".64" stop-color="#000" stop-opacity="0"/><stop offset=".86" stop-color="#000" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity=".95"/></radialGradient>' +
      '<radialGradient id="' + g('edgeM') + '" cx="50%" cy="47%" r="60%"><stop offset=".6" stop-color="#000"/><stop offset=".92" stop-color="#fff"/></radialGradient>' +
      '<radialGradient id="' + g('focus') + '" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#5CE0CF" stop-opacity=".35"/><stop offset="1" stop-color="#5CE0CF" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="' + g('rmg') + '" gradientUnits="userSpaceOnUse" x1="720" y1="0" x2="840" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>' +
      '<mask id="' + g('rmask') + '" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="640"><rect width="1000" height="640" fill="url(#' + g('rmg') + ')"/></mask>' +
      '<mask id="' + g('edge') + '" maskUnits="userSpaceOnUse" x="0" y="0" width="960" height="600"><rect width="960" height="600" fill="url(#' + g('edgeM') + ')"/></mask>' +
      '<pattern id="' + g('knit') + '" width="12" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-3)">' +
        '<path d="M0 5 Q3 1.2 6 0 Q9 1.2 12 5 Q9 8.8 6 10 Q3 8.8 0 5 Z" fill="none" stroke="#FFFFFF" stroke-opacity=".7" stroke-width=".85"/>' +
        '<path d="M6 0 V10" stroke="#FFFFFF" stroke-opacity=".28" stroke-width=".6"/>' +
        '<circle cx="0" cy="5" r=".9" fill="#fff" fill-opacity=".85"/><circle cx="12" cy="5" r=".9" fill="#fff" fill-opacity=".85"/><circle cx="6" cy="0" r=".7" fill="#fff" fill-opacity=".7"/><circle cx="6" cy="10" r=".7" fill="#fff" fill-opacity=".7"/>' +
      '</pattern>' +
      '<pattern id="' + g('fib') + '" width="22" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">' +
        '<path d="M0 3 C6 1 14 5 22 3 M0 8 C7 6 15 9 22 7" fill="none" stroke="#FFF6EC" stroke-opacity=".22" stroke-width=".7"/>' +
      '</pattern>' +
      '<pattern id="' + g('rect') + '" width="9" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(4)"><path d="M2 0 C3 10 1 20 2 30 M6.5 0 C7.5 10 5.5 20 6.5 30" fill="none" stroke="#7A2A20" stroke-opacity=".35" stroke-width=".8"/></pattern>' +
      '<pattern id="' + g('musc') + '" width="16" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-62)">' +
        '<path d="M0 2 C5 1 11 3 16 2 M0 5.5 C5 4.5 11 6.5 16 5.5" fill="none" stroke="#5E1C18" stroke-opacity=".35" stroke-width=".8"/>' +
      '</pattern>' +
      '<filter id="' + g('soft') + '" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>' +
      '<filter id="' + g('soft2') + '" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2"/></filter>' +
      '<filter id="' + g('grain') + '" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".018 .03" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .16  0 0 0 0 .08  0 0 0 -1.1 .95"/></filter>' +
      '<filter id="' + g('dof') + '" x="0" y="0" width="100%" height="100%"><feGaussianBlur stdDeviation="2.6"/></filter>' +
      '</defs>';
  }

  function style(id) {
    var k = id.replace(/[^a-zA-Z0-9_-]/g, '');
    return '<style>' +
      '.' + k + '-br{animation:' + k + 'br 4.6s ease-in-out infinite}' +
      '@keyframes ' + k + 'br{0%,100%{transform:translate(0,0)}50%{transform:translate(.6px,2px)}}' +
      '.' + k + '-pa{animation:' + k + 'pa 1.05s ease-out infinite}' +
      '@keyframes ' + k + 'pa{0%{opacity:0}12%{opacity:.75}38%{opacity:.18}100%{opacity:0}}' +
      '.' + k + '-pv{animation:' + k + 'pv 4.6s ease-in-out infinite}' +
      '@keyframes ' + k + 'pv{0%,100%{opacity:.15}50%{opacity:.45}}' +
      '.' + k + '-gl{animation:' + k + 'gl 6s ease-in-out infinite}' +
      '@keyframes ' + k + 'gl{0%,100%{opacity:.75}50%{opacity:1}}' +
      '.' + k + '-fo{animation:' + k + 'fo 1.8s ease-in-out infinite;transform-box:fill-box;transform-origin:center}' +
      '@keyframes ' + k + 'fo{0%,100%{opacity:.95;transform:scale(1)}50%{opacity:.35;transform:scale(1.18)}}' +
      '.' + k + '-bt{animation:' + k + 'bt 1.2s ease-in-out infinite}' +
      '@keyframes ' + k + 'bt{0%,100%{opacity:1}50%{opacity:.25}}' +
      '.' + k + '-pool{animation:' + k + 'pool 7s ease-out forwards;transform-box:fill-box;transform-origin:50% 20%}' +
      '@keyframes ' + k + 'pool{0%{transform:scale(.35);opacity:.6}100%{transform:scale(1);opacity:1}}' +
      '.' + k + '-trk{animation:' + k + 'trk 9s ease-out forwards;stroke-dasharray:420;stroke-dashoffset:420}' +
      '@keyframes ' + k + 'trk{to{stroke-dashoffset:0}}' +
      '.' + k + '-well{animation:' + k + 'well 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}' +
      '@keyframes ' + k + 'well{0%,100%{transform:scale(.85);opacity:.7}50%{transform:scale(1.12);opacity:1}}' +
      '.' + k + '-dr{animation:' + k + 'dr .9s cubic-bezier(.2,.6,.5,1) infinite}' +
      '@media (prefers-reduced-motion: reduce){.' + k + '-br,.' + k + '-pa,.' + k + '-pv,.' + k + '-gl,.' + k + '-fo,.' + k + '-bt,.' + k + '-pool,.' + k + '-trk,.' + k + '-well,.' + k + '-dr{animation:none!important}.' + k + '-trk{stroke-dashoffset:0}.' + k + '-pa{opacity:.3}}' +
      '</style>';
  }

  /* ---------------- painters ---------------- */
  function shift(pts, d) { return pts.map(function (p) { return [p[0] + p[2] * d, p[1] + p[3] * d, p[2], p[3]]; }); }
  /* glistening tube: outline, body, shade and a wet highlight */
  function tubeP(s, w0, w1, col, dark, light, op, wm) {
    var o = op == null ? 1 : op, w = (w0 + w1) / 2;
    return '<g opacity="' + o + '">' +
      pathOf(ribbon(s, w0 + 2.2, w1 + 2.2, wm == null ? null : wm + 2.2), dark) +
      pathOf(ribbon(s, w0, w1, wm), col) +
      stroke(off(s, w * .2), dark, Math.max(1, w * .22), ' stroke-opacity=".3"') +
      stroke(off(s, -w * .2, .04, .96), light, Math.max(.8, w * .14), ' stroke-opacity=".75"') +
      '</g>';
  }
  function tube(a, key, w0, w1, col, dark, light, op, wm) { return tubeP(sample(a, 12, key), w0, w1, col, dark, light, op, wm); }

  /* irregular smooth blob (closed), quadratic through midpoints */
  function blob(seed, cx, cy, rx, ry, jit, n) {
    var R = rng(seed), pts = [], i;
    n = n || 12;
    for (i = 0; i < n; i++) { var a = i / n * Math.PI * 2, k = 1 + (R() - .5) * jit; pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
    var m = function (p, q) { return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; };
    var d = 'M' + P(m(pts[n - 1], pts[0]));
    for (i = 0; i < n; i++) d += ' Q' + P(pts[i]) + ' ' + P(m(pts[i], pts[(i + 1) % n]));
    return d + 'Z';
  }

  /* packed lobular fat: a mass with a soft shadow and glossy lobules */
  function fatCluster(seed, cx, cy, rx, ry, n, grad, op) {
    var R = rng(seed), s = '<g opacity="' + (op == null ? 1 : op) + '">', L = [];
    s += '<path d="' + blob(seed + 3, cx + 3, cy + 5, rx * 1.05, ry * 1.05, .35, 10) + '" fill="#5A3110" opacity=".22"/>';
    s += '<path d="' + blob(seed + 3, cx, cy, rx, ry, .35, 10) + '" fill="#B9842F"/>';
    for (var i = 0; i < n; i++) {
      var a = R() * Math.PI * 2, d = Math.sqrt(R()) * .85;
      L.push([cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d, lerp(6, 10, R()) * Math.min(1.4, Math.max(.6, rx / 40)), R()]);
    }
    L.sort(function (p, q) { return p[1] - q[1]; });
    L.forEach(function (l, i) {
      s += '<ellipse cx="' + r1(l[0]) + '" cy="' + r1(l[1]) + '" rx="' + r1(l[2]) + '" ry="' + r1(l[2] * (.72 + l[3] * .2)) + '" transform="rotate(' + Math.round(l[3] * 180) + ' ' + r1(l[0]) + ' ' + r1(l[1]) + ')" fill="url(#' + grad + ')" stroke="#FFF0C8" stroke-opacity=".45" stroke-width=".6"/>';
      if (l[3] > .6) s += '<ellipse cx="' + r1(l[0] - l[2] * .3) + '" cy="' + r1(l[1] - l[2] * .32) + '" rx="' + r1(l[2] * .26) + '" ry="' + r1(l[2] * .12) + '" fill="#FFFDF2" fill-opacity=".6"/>';
    });
    return s + '</g>';
  }

  /* evenly packed lobules over a box (clip it): omentum and fat pads */
  function lobuleField(seed, x0, y0, x1, y1, step, grad) {
    var R = rng(seed), s = '', row = 0;
    for (var y = y0; y < y1; y += step * .8, row++) {
      for (var x = x0 + (row % 2) * step * .5; x < x1; x += step) {
        var r = step * (.5 + R() * .22), px = x + (R() - .5) * step * .3, py = y + (R() - .5) * step * .3;
        s += '<ellipse cx="' + r1(px) + '" cy="' + r1(py) + '" rx="' + r1(r) + '" ry="' + r1(r * .86) + '" fill="url(#' + grad + ')" stroke="#FFF0C8" stroke-opacity=".35" stroke-width=".5"/>';
        if (R() > .72) s += '<ellipse cx="' + r1(px - r * .3) + '" cy="' + r1(py - r * .3) + '" rx="' + r1(r * .26) + '" ry="' + r1(r * .12) + '" fill="#FFFDF2" fill-opacity=".6"/>';
      }
    }
    return s;
  }

  /* fine capillaries seen through the peritoneum */
  function capillaries(seed, n, box, op) {
    var R = rng(seed), s = '<g opacity="' + (op == null ? 1 : op) + '">';
    for (var i = 0; i < n; i++) {
      var x = lerp(box[0], box[2], R()), y = lerp(box[1], box[3], R()), d = 'M' + r1(x) + ' ' + r1(y), a = R() * Math.PI * 2, br = '';
      var len = 5 + Math.floor(R() * 5);
      for (var j = 0; j < len; j++) {
        a += (R() - .5) * .9; var l = 8 + R() * 14; x += Math.cos(a) * l; y += Math.sin(a) * l; d += ' L' + r1(x) + ' ' + r1(y);
        if (R() > .7) { var b = a + (R() > .5 ? 1 : -1) * (.6 + R() * .6); br += 'M' + r1(x) + ' ' + r1(y) + ' l' + r1(Math.cos(b) * 14) + ' ' + r1(Math.sin(b) * 14) + ' l' + r1(Math.cos(b + .3) * 9) + ' ' + r1(Math.sin(b + .3) * 9); }
      }
      var col = R() > .45 ? '#B0443A' : '#7E4A72';
      s += stroke(d, col, (.7 + R() * .6).toFixed(2), ' stroke-opacity="' + (.22 + R() * .2).toFixed(2) + '"');
      if (br) s += stroke(br, col, .55, ' stroke-opacity=".25"');
    }
    return s + '</g>';
  }

  /* areolar "cobweb" strands */
  function cobwebs(seed, n, box, lenMin, lenMax) {
    var R = rng(seed), s = '';
    for (var i = 0; i < n; i++) {
      var x = lerp(box[0], box[2], R()), y = lerp(box[1], box[3], R()), a = -Math.PI / 2 + (R() - .5) * 1.2, l = lerp(lenMin, lenMax, R());
      var x2 = x + Math.cos(a) * l, y2 = y + Math.sin(a) * l, mx = (x + x2) / 2 + (R() - .5) * 14, my = (y + y2) / 2 + (R() - .5) * 8;
      s += stroke('M' + r1(x) + ' ' + r1(y) + ' Q' + r1(mx) + ' ' + r1(my) + ' ' + r1(x2) + ' ' + r1(y2), '#FFF8EE', (.45 + R() * .7).toFixed(2), ' stroke-opacity="' + (.3 + R() * .35).toFixed(2) + '"');
      if (R() > .55) s += stroke('M' + r1(mx) + ' ' + r1(my) + ' Q' + r1(mx + (R() - .5) * 20) + ' ' + r1(my + 6) + ' ' + r1(mx + (R() - .5) * 34) + ' ' + r1(my + (R() - .5) * 14), '#FFF8EE', .4, ' stroke-opacity=".32"');
    }
    return s;
  }

  function glints(list, cls) {
    var s = '<g class="' + cls + '" filter="url(#' + cls.replace(/-gl$/, '') + '-soft2)">';
    list.forEach(function (g) { s += '<ellipse cx="' + g[0] + '" cy="' + g[1] + '" rx="' + g[2] + '" ry="' + g[3] + '" transform="rotate(' + (g[4] || 0) + ' ' + g[0] + ' ' + g[1] + ')" fill="#fff" fill-opacity="' + (g[5] || .55) + '"/>'; });
    return s + '</g>';
  }

  function sz(st) { var v = +st.size || 2; return v < 1 ? 1 : v > 3 ? 3 : v; }

  /* lower border of the anterior wall: the iliopubic tract, then the top of Cooper's ligament */
  function wallPath() {
    var ip = sample(C.ipt, 10, 'ipt'), co = sample(C.cooper, 10, 'cooper'), d = 'M-20 -20 H980 V490 ', i;
    for (i = co.length - 1; i >= 0; i--) if (co[i][0] > 680) d += 'L' + r1(co[i][0]) + ' ' + r1(co[i][1] - 5) + ' ';
    for (i = ip.length - 1; i >= 0; i--) d += 'L' + r1(ip[i][0]) + ' ' + r1(ip[i][1]) + ' ';
    return d + 'L-20 282 Z';
  }

  function belowPath() {
    var ip = sample(C.ipt, 10, 'ipt'), co = sample(C.cooper, 10, 'cooper'), d = 'M-20 ' + r1(ip[0][1]) + ' ', i;
    for (i = 0; i < ip.length; i++) d += 'L' + r1(ip[i][0]) + ' ' + r1(ip[i][1] + 8) + ' ';
    for (i = 0; i < co.length; i++) if (co[i][0] > 680) d += 'L' + r1(co[i][0]) + ' ' + r1(co[i][1]) + ' ';
    return d + 'L990 490 L990 640 L-20 640 Z';
  }

  /* ---------------- deep (preperitoneal) anatomy ---------------- */
  function deep(st, id, k, opened) {
    var u = function (n) { return 'url(#' + id + '-' + n + ')'; }, s = '';
    /* base: preperitoneal fat */
    s += '<rect x="-20" y="-20" width="1000" height="640" fill="' + u('fat') + '"/>';
    /* iliacus (lateral fan) and psoas (along the brim), under their glossy fascia */
    var il = 'M-20 396 C70 382 170 386 236 404 C230 470 214 540 196 620 L-20 620 Z';
    var ps = 'M236 404 C290 418 334 446 352 490 C364 530 360 580 352 620 L196 620 C214 540 230 470 236 404 Z';
    s += pathOf(il, u('psoas'), ' opacity=".8"');
    s += pathOf(il, u('musc'));
    s += pathOf(ps, u('psoas'));
    s += pathOf(ps, u('musc'), ' transform="translate(4 0)"');
    s += '<g filter="url(#' + id + '-soft)">' + stroke('M232 410 C226 480 212 550 196 620', '#3A140C', 8, ' stroke-opacity=".35"') + stroke('M246 420 C300 440 338 470 350 520', '#FFF0E0', 10, ' stroke-opacity=".25"') + stroke('M-10 410 C80 396 170 400 226 414', '#FFF0E0', 12, ' stroke-opacity=".22"') + '</g>';
    s += pathOf(il, '#EED9C6', ' opacity=".2"');
    s += pathOf(ps, '#EED9C6', ' opacity=".16"');
    /* medial floor: pubic ramus with Cooper's ligament on its crest, the dark depth of Retzius and the bladder */
    s += '<path d="M470 520 C560 500 700 506 820 520 C900 528 960 530 990 532 L990 640 L470 640 Z" fill="#3A1A0C" opacity=".85" filter="url(#' + id + '-soft)"/>';
    s += '<ellipse cx="820" cy="590" rx="190" ry="60" fill="' + u('ret') + '"/>';
    s += pathOf('M520 476 C600 462 700 470 790 480 C850 486 910 490 990 490 L990 518 C930 530 870 538 800 540 C720 542 640 532 590 520 C556 512 532 498 520 476 Z', u('bone'));
    s += '<g filter="url(#' + id + '-soft2)">' + stroke('M540 510 C620 526 720 536 820 532 C900 528 950 520 990 516', '#4A2810', 6, ' stroke-opacity=".45"') + '</g>';
    s += stroke('M530 488 C600 478 700 486 800 496 C860 502 920 504 980 502', '#fff', 1.2, ' stroke-opacity=".4"');
    s += '<ellipse cx="640" cy="572" rx="60" ry="20" fill="#120502" opacity=".55" filter="url(#' + id + '-soft)"/>';
    s += '<path d="M700 640 C712 590 780 566 870 562 C920 560 960 566 990 572 L990 640 Z" fill="' + u('bladder') + '" filter="url(#' + id + '-soft2)"/>';
    s += stroke('M736 604 C772 582 830 572 900 572', '#fff', 2, ' stroke-opacity=".3"');
    s += fatCluster(61, 860, 586, 64, 16, 22, id + '-lob', .85);
    /* fat of the lower field */
    s += fatCluster(71, 520, 574, 50, 24, 26, id + '-lob');
    s += fatCluster(72, 566, 506, 18, 9, 8, id + '-lob', .9);
    s += fatCluster(73, 404, 596, 26, 14, 10, id + '-lob');
    s += fatCluster(74, 110, 600, 50, 14, 14, id + '-lob', .8);
    /* nerves of the triangle of pain on the iliacus and psoas */
    s += tube(C.lfcn, 'lfcn', 3.8, 4.6, '#F2E6B4', '#8E7C40', '#FFFDF0');
    s += tube(C.gfnf, 'gfnf', 2.8, 3.4, '#F0E3AA', '#8E7C40', '#FFFDF0');
    s += tube(C.gfng, 'gfng', 1.6, 2.2, '#F0E3AA', '#8E7C40', '#FFFDF0');
    s += pathOf(ps, '#F2E4D2', ' opacity=".1"');
    /* external iliac vein and artery under the iliac fascia */
    s += '<g filter="url(#' + id + '-soft)" opacity=".5">' + pathOf(ribbon(shift(sample(C.eiv, 12, 'eiv'), 6), 40, 34, 38), '#2A0E06') + pathOf(ribbon(shift(sample(C.eia, 12, 'eia'), 5), 28, 24, 26), '#2A0E06') + '</g>';
    s += '<g class="' + k + '-br">';
    s += tube(C.eiv, 'eiv', 32, 26, '#5A4F86', '#241C44', '#B9B2E0', 1, 30);
    s += stroke(off(sample(C.eiv, 12, 'eiv'), -4), '#9C92D2', 7, ' class="' + k + '-pv" stroke-opacity=".5"');
    s += tube(C.eia, 'eia', 20, 17, '#B9463E', '#561812', '#FFB3A4', 1, 19);
    s += stroke(off(sample(C.eia, 12, 'eia'), -1.5), '#F46A58', 9, ' class="' + k + '-pa"');
    s += '</g>';
    s += pathOf('M326 620 C350 540 390 470 424 404 L512 410 C488 470 462 540 444 620 Z', '#F2E2D2', ' opacity=".26"');
    /* corona mortis crossing Cooper's ligament */
    if (st.corona || st.bleed === 'corona') {
      s += tube(C.corona, 'corona', 5, 6, '#584E88', '#241C44', '#BDB6E4');
      s += tube(C.coronaA, 'coronaA', 2.8, 3.2, '#BE4A40', '#561812', '#FFC2B4');
    }
    /* anterior wall: transversalis fascia over the back of the rectus and transversus */
    var wall = wallPath();
    s += pathOf(wall, u('wall'));
    s += pathOf(wall, u('fib'));
    s += '<g clip-path="url(#' + id + '-cWall)">' +
      fatCluster(81, 300, 286, 60, 18, 16, id + '-lobR', .28) + fatCluster(82, 150, 266, 50, 14, 12, id + '-lobR', .25) +
      fatCluster(83, 650, 246, 50, 14, 12, id + '-lobR', .22) + fatCluster(84, 470, 380, 34, 12, 10, id + '-lobR', .7) + '</g>';
    /* rectus abdominis seen through the thin fascia, medial (no posterior sheath below the arcuate line) */
    s += '<g clip-path="url(#' + id + '-cWall)" mask="url(#' + id + '-rmask)"><rect x="700" y="150" width="300" height="340" fill="#B8604E" opacity=".3"/>' +
      '<rect x="700" y="150" width="300" height="340" fill="url(#' + id + '-rect)" opacity=".45"/></g>';
    /* Hesselbach's area: thin, slightly darker fascia */
    s += '<path d="' + blob(37, HESS[0] + 6, HESS[1] + 10, 70, 56, .35, 9) + '" fill="#8A5040" opacity=".1" filter="url(#' + id + '-soft)"/>';
    /* the medial umbilical ligament cord on the wall (seen once the space is open) */
    /* inferior epigastric pedicle in its fat on the back of the rectus */
    var ie = sample(C.iev, 12, 'iev');
    s += '<g class="' + k + '-br">';
    s += pathOf(ribbon(ie, 34, 20, 26), '#D9A75E', ' opacity=".5"');
    s += fatCluster(91, 470, 384, 16, 12, 6, id + '-lob', .9);
    s += tubeP(shift(ie, -7), 5, 3.6, '#5A4F86', '#241C44', '#BDB6E4');
    s += tubeP(shift(ie, 7.5), 5, 3.6, '#5A4F86', '#241C44', '#BDB6E4');
    s += tubeP(ie, 6.4, 4.2, '#BC453B', '#561812', '#FFB3A4');
    s += stroke(off(ie, -.6), '#FF8070', 3, ' class="' + k + '-pa" style="animation-delay:.08s"');
    s += '</g>';
    /* iliopubic tract */
    var ipts = sample(C.ipt, 10, 'ipt');
    s += '<g filter="url(#' + id + '-soft)">' + stroke(off(ipts, 9), '#2A0E06', 10, ' stroke-opacity=".45"') + '</g>';
    s += pathOf(ribbon(ipts, 9, 15, 17), '#B3A28A');
    s += pathOf(ribbon(ipts, 6.5, 11.5, 13), '#F1E9DA');
    s += stroke(off(ipts, -2.5, .03, .97), '#fff', 1.3, ' stroke-opacity=".85"');
    s += stroke(off(ipts, 3, .03, .97), '#A08C70', .8, ' stroke-opacity=".6"');
    /* Cooper's ligament: glistening white band on the pecten pubis */
    var cs = sample(C.cooper, 10, 'cooper');
    s += pathOf(ribbon(cs, 10, 14, 16), '#9C8866');
    s += pathOf(ribbon(cs, 8, 11, 13), '#F8F4EA');
    s += stroke(off(cs, -2.4, .04, .96), '#fff', 1.8, ' stroke-opacity=".95"');
    s += stroke(off(cs, 3.2, .04, .96), '#B5A386', 1, ' stroke-opacity=".7"');
    /* femoral ring: dark orifice medial to the vein, below the tract */
    var fz = st.defect === 'F' ? sz(st) : 0;
    s += '<ellipse cx="' + FEM[0] + '" cy="' + FEM[1] + '" rx="' + (11 + 5 * fz) + '" ry="' + (7 + 4 * fz) + '" fill="url(#' + id + '-hole)"/>';
    s += '<path d="M' + (FEM[0] - 11 - 5 * fz) + ' ' + FEM[1] + ' A' + (11 + 5 * fz) + ' ' + (7 + 4 * fz) + ' 0 0 1 ' + (FEM[0] + 11 + 5 * fz) + ' ' + FEM[1] + '" fill="none" stroke="#FFF4E6" stroke-opacity=".6" stroke-width="1.2"/>';
    return s;
  }

  /* cord structures (on the camera side of the tract), converging into the ring */
  function cord(st, id, k, op, skel) {
    var s = '<g opacity="' + (op == null ? 1 : op) + '">';
    s += tube(C.gon1, 'gon1', 4.4, 6.4, '#5E5390', '#241C44', '#C2BCE8');
    s += tube(C.gon2, 'gon2', 4, 5.8, '#564B88', '#241C44', '#C2BCE8');
    s += tube(C.gonA, 'gonA', 1.8, 2.2, '#C24A3E', '#651A12', '#FFC2B4');
    s += tube(C.vas, 'vas', 8, 10, '#F5F0E6', '#8C806C', '#FFFFFF');
    if (skel) {
      s += stroke(off(sample(C.vas, 12, 'vas'), -2, .04, .55), '#fff', 2, ' stroke-opacity=".85"');
      s += stroke(off(sample(C.gon2, 12, 'gon2'), -1.5, .04, .55), '#E6E2FF', 1.2, ' stroke-opacity=".7"');
    }
    return s + '</g>';
  }

  /* internal ring as seen once the fascia is exposed */
  function ringDeep(st, id) {
    var big = st.defect === 'L' ? 1 + sz(st) * .3 : 1, rx = 22 * big, ry = 16 * big;
    var s = '<ellipse cx="' + RING[0] + '" cy="' + (RING[1] - 2) + '" rx="' + r1(rx + 9) + '" ry="' + r1(ry + 7) + '" fill="#EEDCC6" opacity=".8"/>';
    s += '<ellipse cx="' + RING[0] + '" cy="' + RING[1] + '" rx="' + r1(rx) + '" ry="' + r1(ry) + '" fill="url(#' + id + '-hole)"/>';
    s += '<path d="M' + r1(RING[0] - rx - 2) + ' ' + RING[1] + ' A' + r1(rx + 2) + ' ' + r1(ry + 2) + ' 0 0 1 ' + r1(RING[0] + rx + 2) + ' ' + RING[1] + '" fill="none" stroke="#FFF6EA" stroke-opacity=".85" stroke-width="1.8"/>';
    return s;
  }

  /* ---------------- peritoneal surface ---------------- */
  function periSheet(id, op) {
    return '<rect x="-20" y="-20" width="1000" height="640" fill="url(#' + id + '-peri)" opacity="' + op + '"/>' +
      '<ellipse cx="300" cy="120" rx="220" ry="90" fill="#E8B9A2" opacity=".25" filter="url(#' + id + '-soft)"/>' +
      '<ellipse cx="660" cy="470" rx="200" ry="60" fill="#E2BE8A" opacity=".22" filter="url(#' + id + '-soft)"/>' +
      capillaries(7, 22, [0, 0, 960, 600], .9);
  }

  /* raised folds of the intact peritoneum, with the cord and vessels showing through */
  function folds(st, id, k) {
    var s = '';
    s += stroke(off(sample(C.eia, 12, 'eia'), -1.5), '#F46A58', 8, ' class="' + k + '-pa" opacity=".3"');
    s += '<g filter="url(#' + id + '-soft2)">' + stroke(off(sample(C.ipt, 10, 'ipt'), -2), '#FFF4EA', 7, ' stroke-opacity=".25"') + stroke(off(sample(C.vas, 12, 'vas'), 0), '#FFFFFF', 8, ' stroke-opacity=".38"') + stroke(off(sample(C.gon1, 12, 'gon1'), 3), '#6A5F98', 9, ' stroke-opacity=".3"') + '</g>';
    var ie = sample(C.iev, 12, 'iev').slice(5);
    s += pathOf(ribbon(ie, 30, 18, 24), '#F7E2D6', ' opacity=".35" filter="url(#' + id + '-soft2)"');
    s += '<g opacity=".45">' + tubeP(ie, 6.4, 4.2, '#C24E44', '#7A2A22', '#FFC6B8') + tubeP(shift(ie, -7), 4.4, 3, '#6A5F98', '#4A3F70', '#D2CCF0') + tubeP(shift(ie, 7.5), 4.4, 3, '#6A5F98', '#4A3F70', '#D2CCF0') + '</g>';
    s += stroke(off(ie, -12, .05, .95), '#fff', 2, ' stroke-opacity=".35"');
    /* medial umbilical fold: a tented ridge, lit on its lateral slope */
    var md = sample(C.medul, 12, 'medul');
    s += pathOf(ribbon(shift(md, 8), 30, 22, 28), '#7A3A2C', ' opacity=".32" filter="url(#' + id + '-soft)"');
    s += pathOf(ribbon(md, 34, 22, 28), '#F0CDBE', ' filter="url(#' + id + '-soft2)"');
    s += pathOf(ribbon(md, 24, 14, 18), '#F7DDD0');
    s += pathOf(ribbon(shift(md, -4), 8, 4, 6), '#FFF3EC', ' opacity=".8"');
    s += stroke(off(md, -6, .02, .98), '#fff', 1.8, ' stroke-opacity=".75"');
    s += stroke(off(md, 10, .02, .98), '#A15A48', 1.2, ' stroke-opacity=".35"');
    /* median umbilical fold (urachus) at the midline */
    var mu = sample(C.mul, 9, 'mul');
    s += pathOf(ribbon(shift(mu, 7), 26, 32), '#7A3A2C', ' opacity=".25" filter="url(#' + id + '-soft)"');
    s += pathOf(ribbon(mu, 26, 32), '#F0CDBE', ' filter="url(#' + id + '-soft2)"');
    s += pathOf(ribbon(mu, 16, 22), '#F7DDD0');
    s += stroke(off(mu, -5, .02, .98), '#fff', 1.8, ' stroke-opacity=".7"');
    return s;
  }

  /* shallow dimple at the internal ring (no indirect defect) */
  function ringDimple(id) {
    return '<ellipse cx="' + RING[0] + '" cy="' + (RING[1] + 2) + '" rx="34" ry="22" fill="url(#' + id + '-dip)"/>' +
      '<path d="M' + (RING[0] - 28) + ' ' + (RING[1] - 6) + ' Q' + RING[0] + ' ' + (RING[1] - 22) + ' ' + (RING[0] + 28) + ' ' + (RING[1] - 6) + '" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.6"/>';
  }

  /* ---------------- defects seen through intact peritoneum ---------------- */
  function orifice(id, cx, cy, rx, ry, seed, nf) {
    var s = '<ellipse cx="' + cx + '" cy="' + (cy + 6) + '" rx="' + r1(rx + 26) + '" ry="' + r1(ry + 18) + '" fill="url(#' + id + '-dip)"/>';
    var R = rng(seed), fl = '', hl = '';
    for (var i = 0; i < nf; i++) {
      var a = i / nf * Math.PI * 2 + R() * .25, x0 = cx + Math.cos(a) * (rx + 20 + R() * 14), y0 = cy + Math.sin(a) * (ry + 14 + R() * 8);
      var x1 = cx + Math.cos(a) * rx * .95, y1 = cy + Math.sin(a) * ry * .95, mx = (x0 + x1) / 2 + Math.sin(a) * 3, my = (y0 + y1) / 2;
      fl += 'M' + r1(x0) + ' ' + r1(y0) + ' Q' + r1(mx) + ' ' + r1(my) + ' ' + r1(x1) + ' ' + r1(y1) + ' ';
      if (i % 2) hl += 'M' + r1(x0 - 1.5) + ' ' + r1(y0 - 1.5) + ' Q' + r1(mx - 1.5) + ' ' + r1(my - 1.5) + ' ' + r1(x1 - 1) + ' ' + r1(y1 - 1) + ' ';
    }
    s += '<g filter="url(#' + id + '-soft2)">' + stroke(fl, '#7E3D2E', 3, ' stroke-opacity=".3"') + stroke(hl, '#fff', 1.6, ' stroke-opacity=".45"') + '</g>';
    s += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="url(#' + id + '-hole)"/>';
    s += '<path d="M' + (cx - rx) + ' ' + cy + ' A' + rx + ' ' + ry + ' 0 0 1 ' + (cx + rx) + ' ' + cy + '" fill="none" stroke="#FFF1E6" stroke-opacity=".9" stroke-width="2.2"/>';
    s += '<path d="M' + r1(cx - rx * .85) + ' ' + r1(cy + ry * .45) + ' A' + rx + ' ' + ry + ' 0 0 0 ' + r1(cx + rx * .85) + ' ' + r1(cy + ry * .45) + '" fill="none" stroke="#4A1A12" stroke-opacity=".5" stroke-width="1.4"/>';
    return s;
  }
  function defectIntact(st, id, k) {
    var s = '', d = st.defect, z = sz(st);
    if (d === 'L') {
      var rx = 18 + 10 * z, ry = 13 + 7 * z, cx = RING[0] - 4, cy = RING[1] - 2;
      s += orifice(id, cx, cy, rx, ry, 5, 16);
      s += content(st, id, k, cx, cy, rx, ry);
    } else if (d === 'M') {
      var mrx = 44 + 16 * z, mry = 36 + 13 * z;
      s += '<ellipse cx="' + HESS[0] + '" cy="' + HESS[1] + '" rx="' + mrx + '" ry="' + mry + '" fill="url(#' + id + '-dip)"/>';
      s += '<ellipse cx="' + (HESS[0] + 4) + '" cy="' + (HESS[1] + 8) + '" rx="' + r1(mrx * .55) + '" ry="' + r1(mry * .48) + '" fill="#3E140C" fill-opacity=".3" filter="url(#' + id + '-soft)"/>';
      s += '<path d="M' + r1(HESS[0] - mrx * .92) + ' ' + r1(HESS[1] - mry * .1) + ' Q' + HESS[0] + ' ' + r1(HESS[1] - mry * 1.15) + ' ' + r1(HESS[0] + mrx * .92) + ' ' + r1(HESS[1] - mry * .1) + '" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2.2"/>';
      s += '<path d="M' + r1(HESS[0] - mrx * .7) + ' ' + r1(HESS[1] + mry * .6) + ' Q' + HESS[0] + ' ' + r1(HESS[1] + mry * .95) + ' ' + r1(HESS[0] + mrx * .7) + ' ' + r1(HESS[1] + mry * .6) + '" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1.6"/>';
      if (st.content) s += content(st, id, k, HESS[0], HESS[1] + 4, mrx * .5, mry * .45);
    } else if (d === 'F') {
      var frx = 9 + 5 * z, fry = 6 + 4 * z;
      s += orifice(id, FEM[0], FEM[1], frx, fry, 9, 10);
      if (st.content) s += content(st, id, k, FEM[0], FEM[1], frx, fry);
    }
    return s;
  }

  /* sac content: omentum or a bowel loop sweeping down from the abdomen into the orifice */
  function content(st, id, k, cx, cy, rx, ry) {
    if (!st.content) return '';
    var s = '';
    if (st.content === 'omentum') {
      /* an apron of omentum narrowing into the orifice: a chain of lobed masses */
      var d = blob(44, cx - 40, -20, 160, 120, .25, 12) + ' ' + blob(45, cx - 22, cy - 160, 112, 96, .28, 11) + ' ' + blob(46, cx - 8, cy - 82, 74, 70, .26, 10) + ' ' + blob(47, cx, cy - 26, rx * .9, 44, .22, 9);
      s += '<path d="' + d + '" fill="#4A2410" opacity=".3" transform="translate(6 8)" filter="url(#' + id + '-soft)"/>';
      s += '<path d="' + d + '" fill="#D9A653"/>';
      s += '<defs><clipPath id="' + id + '-cOmS"><path d="' + d + '"/></clipPath></defs>';
      s += '<g clip-path="url(#' + id + '-cOmS)">' + lobuleField(45, cx - 200, -30, cx + 150, cy + 6, 18, id + '-lob') + '<path d="M' + r1(cx - 200) + ' ' + r1(cy - 60) + ' H' + r1(cx + 150) + ' V' + r1(cy + 10) + ' H' + r1(cx - 200) + ' Z" fill="#5A3410" opacity=".25" filter="url(#' + id + '-soft)"/></g>';
      s += '<g clip-path="url(#' + id + '-cOm)">' + stroke('M' + (cx - 30) + ' -20 C' + (cx - 34) + ' 80 ' + (cx - 10) + ' ' + (cy - 100) + ' ' + cx + ' ' + (cy - 20), '#9E3A30', 1.6, ' stroke-opacity=".6"') +
        stroke('M' + (cx + 40) + ' -20 C' + (cx + 30) + ' 90 ' + (cx + 10) + ' ' + (cy - 90) + ' ' + (cx + 6) + ' ' + (cy - 24), '#5A4F86', 1.6, ' stroke-opacity=".55"') + '</g>';
      s += '<ellipse cx="' + cx + '" cy="' + r1(cy + ry * .2) + '" rx="' + r1(rx * .75) + '" ry="' + r1(ry * .35) + '" fill="#120405" fill-opacity=".6" filter="url(#' + id + '-soft2)"/>';
    } else {
      var inc = !!st.incarc, g = id + '-' + (inc ? 'gutI' : 'gut'), edge = inc ? 'rgba(42,10,24,.45)' : 'rgba(138,68,52,.45)';
      /* two limbs of one loop entering the orifice side by side, the mesentery fanning between them */
      var a = [[cx - 210, -70], [cx - 170, -10], [cx - 120, cy - 170], [cx - 70, cy - 120], [cx - 40, cy - 80], [cx - rx * .55, cy - 36], [cx - rx * .3, cy - 2]];
      var b = [[cx + rx * .3, cy - 2], [cx + rx * .5, cy - 40], [cx + 40, cy - 96], [cx + 60, cy - 150], [cx + 84, cy - 210], [cx + 150, -10], [cx + 200, -70]];
      var s1 = sample(a, 9), s2 = sample(b, 9);
      s += '<path d="M' + r1(cx - 130) + ' -20 C' + r1(cx - 90) + ' ' + r1(cy - 200) + ' ' + r1(cx - 30) + ' ' + r1(cy - 110) + ' ' + r1(cx) + ' ' + r1(cy - 90) + ' C' + r1(cx + 30) + ' ' + r1(cy - 110) + ' ' + r1(cx + 80) + ' ' + r1(cy - 200) + ' ' + r1(cx + 110) + ' -20 Z" fill="#C99A48"/>';
      s += '<defs><clipPath id="' + id + '-cMes"><path d="M' + r1(cx - 130) + ' -20 C' + r1(cx - 90) + ' ' + r1(cy - 200) + ' ' + r1(cx - 30) + ' ' + r1(cy - 110) + ' ' + r1(cx) + ' ' + r1(cy - 90) + ' C' + r1(cx + 30) + ' ' + r1(cy - 110) + ' ' + r1(cx + 80) + ' ' + r1(cy - 200) + ' ' + r1(cx + 110) + ' -20 Z"/></clipPath></defs>';
      s += '<g clip-path="url(#' + id + '-cMes)">' + lobuleField(49, cx - 130, -20, cx + 110, cy - 80, 17, id + '-lob') + '</g>';
      s += stroke('M' + r1(cx - 20) + ' -20 C' + r1(cx - 20) + ' 60 ' + r1(cx - 10) + ' ' + r1(cy - 140) + ' ' + r1(cx - 4) + ' ' + r1(cy - 96), inc ? '#3A0A1E' : '#A5372D', 2.4, ' stroke-opacity=".6"');
      s += stroke('M' + r1(cx + 20) + ' -20 C' + r1(cx + 10) + ' 60 ' + r1(cx + 6) + ' ' + r1(cy - 140) + ' ' + r1(cx + 4) + ' ' + r1(cy - 98), inc ? '#2A0A28' : '#4E4682', 2.4, ' stroke-opacity=".6"');
      s += pathOf(ribbon(shift(s1, 8), 84, 40, 76), '#3A140C', ' opacity=".3" filter="url(#' + id + '-soft)"');
      s += pathOf(ribbon(shift(s2, 8), 40, 84, 76), '#3A140C', ' opacity=".3" filter="url(#' + id + '-soft)"');
      var rb2 = ribbon(s2, 40, 86, 78), rb1 = ribbon(s1, 86, 40, 78);
      s += pathOf(rb2, 'url(#' + g + ')', ' stroke="' + edge + '" stroke-width="1.3"') + rounded(id, rb2, inc ? '#14040A' : '#7A2E22', false);
      s += pathOf(rb1, 'url(#' + g + ')', ' stroke="' + edge + '" stroke-width="1.3"') + rounded(id, rb1, inc ? '#14040A' : '#7A2E22', false);
      s += stroke(off(s1, -18, .04, .9), '#fff', 6, ' stroke-opacity="' + (inc ? .16 : .32) + '"');
      s += stroke(off(s1, -22, .1, .7), '#fff', 2, ' stroke-opacity="' + (inc ? .3 : .7) + '"');
      s += stroke(off(s2, -16, .1, .96), '#fff', 5, ' stroke-opacity="' + (inc ? .16 : .3) + '"');
      s += stroke(off(s2, -20, .3, .9), '#fff', 2, ' stroke-opacity="' + (inc ? .3 : .65) + '"');
      /* serosal vessels at right angles to the bowel */
      for (var q = 1; q < s1.length - 3; q += 2) {
        var p = s1[q], w = lerp(38, 18, q / s1.length);
        s += stroke('M' + r1(p[0] + p[2] * w) + ' ' + r1(p[1] + p[3] * w) + ' q' + r1(-p[2] * 10 + p[3] * 4) + ' ' + r1(-p[3] * 10 - p[2] * 4) + ' ' + r1(-p[2] * w * .8) + ' ' + r1(-p[3] * w * .8), inc ? '#2A0716' : '#B4463A', 1.1, ' stroke-opacity=".5"');
      }
      for (var q2 = 3; q2 < s2.length - 1; q2 += 2) {
        var p2 = s2[q2], w2 = lerp(18, 38, q2 / s2.length);
        s += stroke('M' + r1(p2[0] - p2[2] * w2) + ' ' + r1(p2[1] - p2[3] * w2) + ' q' + r1(p2[2] * 10) + ' ' + r1(p2[3] * 10) + ' ' + r1(p2[2] * w2 * .8) + ' ' + r1(p2[3] * w2 * .8), inc ? '#2A0716' : '#B4463A', 1.1, ' stroke-opacity=".5"');
      }
      if (inc) {
        /* the constricting neck and dusky, congested serosa */
        s += '<ellipse cx="' + cx + '" cy="' + (cy - 8) + '" rx="' + r1(rx * .9) + '" ry="' + r1(ry * .5) + '" fill="#14040A" opacity=".5" filter="url(#' + id + '-soft2)"/>';
        s += '<path d="' + blob(17, cx - 70, cy - 120, 14, 10, .5, 8) + '" fill="#2A0716" opacity=".45"/>';
        s += '<path d="' + blob(19, cx + 76, cy - 150, 12, 9, .5, 8) + '" fill="#2A0716" opacity=".4"/>';
      }
      s += '<ellipse cx="' + cx + '" cy="' + r1(cy + ry * .2) + '" rx="' + r1(rx * .78) + '" ry="' + r1(ry * .34) + '" fill="#120405" fill-opacity=".6" filter="url(#' + id + '-soft2)"/>';
    }
    return s;
  }

  /* rounded look for a peritoneal or fatty tongue: inner edge shade and a central sheen, clipped to the shape */
  var SH = 0;
  function rounded(id, d, dark, sheen) {
    var c = id + '-rs' + (++SH);
    return '<defs><clipPath id="' + c + '"><path d="' + d + '"/></clipPath></defs><g clip-path="url(#' + c + ')">' +
      '<path d="' + d + '" fill="none" stroke="' + dark + '" stroke-width="18" stroke-opacity=".42" filter="url(#' + id + '-soft2)"/>' +
      (sheen ? '<path d="' + d + '" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-opacity=".35" transform="translate(-3 -2)"/>' : '') + '</g>';
  }

  /* ---------------- opened field: sacs, flaps ---------------- */
  function sacDeep(st, id, k, flap) {
    var s = '', d = st.defect, z = sz(st);
    if (d === 'L' && flap === 2) {
      /* the peritoneal sac still entering the ring, continuous with the lower flap */
      var big = 1 + z * .3, rx = 22 * big - 3, ry = 16 * big - 2;
      var sac = 'M' + r1(RING[0] - rx) + ' ' + (RING[1] + 2) + ' C' + r1(RING[0] - rx - 16) + ' ' + (RING[1] + 50) + ' ' + (RING[0] - 40) + ' ' + (RING[1] + 120) + ' ' + (RING[0] - 44) + ' ' + (RING[1] + 170) +
        ' C' + (RING[0] - 48) + ' ' + (RING[1] + 210) + ' ' + (RING[0] - 70) + ' 560 ' + (RING[0] - 80) + ' 590 L' + (RING[0] + 70) + ' 594 C' + (RING[0] + 46) + ' 560 ' + (RING[0] + 40) + ' ' + (RING[1] + 200) + ' ' + (RING[0] + 44) + ' ' + (RING[1] + 160) +
        ' C' + (RING[0] + 48) + ' ' + (RING[1] + 110) + ' ' + r1(RING[0] + rx + 14) + ' ' + (RING[1] + 50) + ' ' + r1(RING[0] + rx) + ' ' + (RING[1] + 2) + ' Z';
      s += '<path d="' + sac + '" fill="#3A140C" opacity=".3" transform="translate(6 6)" filter="url(#' + id + '-soft)"/>';
      s += '<path d="' + sac + '" fill="url(#' + id + '-sac)" fill-opacity=".86" stroke="#A86A56" stroke-opacity=".7" stroke-width="1.2"/>';
      s += '<g clip-path="url(#' + id + '-cSac)" filter="url(#' + id + '-soft2)">' + stroke('M' + r1(RING[0] - rx - 6) + ' ' + RING[1] + ' C' + r1(RING[0] - rx - 20) + ' ' + (RING[1] + 60) + ' ' + (RING[0] - 50) + ' ' + (RING[1] + 140) + ' ' + (RING[0] - 86) + ' 600', '#7A3A2C', 12, ' stroke-opacity=".45"') +
        stroke('M' + r1(RING[0] + rx + 6) + ' ' + RING[1] + ' C' + r1(RING[0] + rx + 18) + ' ' + (RING[1] + 60) + ' ' + (RING[0] + 50) + ' ' + (RING[1] + 140) + ' ' + (RING[0] + 76) + ' 600', '#7A3A2C', 10, ' stroke-opacity=".35"') +
        stroke('M' + (RING[0] - 10) + ' ' + (RING[1] + 20) + ' C' + (RING[0] - 16) + ' ' + (RING[1] + 100) + ' ' + (RING[0] - 22) + ' ' + (RING[1] + 180) + ' ' + (RING[0] - 30) + ' 590', '#FFF6F0', 8, ' stroke-opacity=".5"') + '</g>';
      s += '<defs><clipPath id="' + id + '-cSac"><path d="' + sac + '"/></clipPath></defs>';
      /* longitudinal folds and the cord seen through the sac wall */
      var R = rng(66);
      for (var i = 0; i < 6; i++) {
        var t = (i + .5) / 6, x0 = lerp(RING[0] - rx * .8, RING[0] + rx * .8, t), x1 = lerp(RING[0] - 70, RING[0] + 64, t);
        s += stroke('M' + r1(x0) + ' ' + (RING[1] + 10) + ' C' + r1(lerp(x0, RING[0], .5) + (R() - .5) * 10) + ' ' + (RING[1] + 90) + ' ' + r1(lerp(RING[0] - 40, RING[0] + 40, t)) + ' ' + (RING[1] + 170) + ' ' + r1(x1) + ' 588', i % 2 ? '#fff' : '#9A5A46', i % 2 ? 2 : 1.2, ' stroke-opacity="' + (i % 2 ? .45 : .3) + '"');
      }
      s += capillaries(67, 3, [RING[0] - 30, RING[1] + 60, RING[0] + 30, 560], .8);
      s += '<ellipse cx="' + RING[0] + '" cy="' + (RING[1] + 2) + '" rx="' + r1(rx + 4) + '" ry="' + r1(ry * .5) + '" fill="#1A0805" opacity=".55" filter="url(#' + id + '-soft2)"/>';
    } else if (d === 'M') {
      var mrx = 40 + 14 * z, mry = 32 + 11 * z;
      /* the attenuated transversalis fascia (pseudosac) in Hesselbach's triangle */
      s += '<ellipse cx="' + HESS[0] + '" cy="' + HESS[1] + '" rx="' + mrx + '" ry="' + mry + '" fill="url(#' + id + '-dip)"/>';
      s += '<path d="' + blob(57, HESS[0], HESS[1] + 2, mrx * .78, mry * .72, .18, 12) + '" fill="#F6EEE2" fill-opacity=".5" stroke="#FFFFFF" stroke-opacity=".55" stroke-width="1.2"/>';
      s += cobwebs(77, 16, [HESS[0] - mrx * .7, HESS[1] - mry * .3, HESS[0] + mrx * .7, HESS[1] + mry * .7], 8, 22);
      if (flap === 2) {
        /* the direct sac with its cap of preperitoneal fat, being drawn back out of the defect */
        var ds = blob(58, HESS[0] + 2, HESS[1] + 10, mrx * .72, mry * .7, .22, 10);
        s += '<path d="' + ds + '" fill="#3A140C" opacity=".3" transform="translate(5 7)" filter="url(#' + id + '-soft)"/>';
        s += '<path d="' + ds + '" fill="url(#' + id + '-sac)" stroke="#A86A56" stroke-opacity=".6"/>' + rounded(id, ds, '#7A3A2C', true);
        s += fatCluster(51, HESS[0] - mrx * .25, HESS[1] - mry * .35, mrx * .42, mry * .24, 14, id + '-lob', .95);
        s += capillaries(52, 3, [HESS[0] - mrx * .4, HESS[1], HESS[0] + mrx * .4, HESS[1] + mry * .5], .8);
        s += '<ellipse cx="' + (HESS[0] + 10) + '" cy="' + (HESS[1] + 18) + '" rx="' + r1(mrx * .22) + '" ry="' + r1(mry * .1) + '" fill="#fff" fill-opacity=".45" transform="rotate(-15 ' + (HESS[0] + 10) + ' ' + (HESS[1] + 18) + ')"/>';
      }
    } else if (d === 'F' && flap === 2) {
      /* preperitoneal fat plug drawn out of the femoral ring */
      var fs = 'M' + (FEM[0] - 12) + ' ' + FEM[1] + ' C' + (FEM[0] - 22) + ' ' + (FEM[1] + 50) + ' ' + (FEM[0] + 6) + ' 540 ' + (FEM[0] + 24) + ' 590 L' + (FEM[0] + 84) + ' 592 C' + (FEM[0] + 50) + ' 540 ' + (FEM[0] + 24) + ' ' + (FEM[1] + 40) + ' ' + (FEM[0] + 12) + ' ' + FEM[1] + ' Z';
      s += '<path d="' + fs + '" fill="#3A140C" opacity=".28" transform="translate(5 6)" filter="url(#' + id + '-soft)"/>';
      s += '<path d="' + fs + '" fill="#D9A653" stroke="#93622A" stroke-opacity=".6"/>' + rounded(id, fs, '#6A4010', false);
      s += fatCluster(53, FEM[0] + 12, FEM[1] + 50, 24, 30, 14, id + '-lob');
      s += fatCluster(54, FEM[0] + 34, 548, 30, 24, 12, id + '-lob');
    }
    return s;
  }

  /* lower peritoneal flap, peeled caudally: a rolled glistening sheet along the bottom */
  function lowerFlap(st, id, flap) {
    var y = flap >= 3 ? 580 : 562;
    var edge = 'M-20 ' + (y - 6) + ' C150 ' + (y + 6) + ' 360 ' + (y + 16) + ' 560 ' + (y + 18) + ' C720 ' + (y + 20) + ' 860 ' + (y + 12) + ' 980 ' + y;
    var s = '<path d="' + edge + ' L980 640 L-20 640 Z" fill="#3A140C" opacity=".4" transform="translate(0 -7)" filter="url(#' + id + '-soft)"/>';
    s += '<path d="' + edge + ' L980 640 L-20 640 Z" fill="url(#' + id + '-flap)"/>';
    s += '<path d="' + edge + '" fill="none" stroke="#FFFFFF" stroke-opacity=".85" stroke-width="2.6"/>';
    s += '<path d="' + edge + '" fill="none" stroke="#E9B860" stroke-opacity=".55" stroke-width="4" transform="translate(0 4)"/>';
    s += capillaries(91, 6, [0, y + 12, 960, 600], .8);
    return s;
  }

  /* region of the upper peritoneum left on the wall (above the incision) */
  function upperPath() {
    var cs = sample(C.incis, 10, 'incis'), d = 'M-20 -20 H980 V232 L' + r1(cs[cs.length - 1][0]) + ' ' + r1(cs[cs.length - 1][1]) + ' ';
    for (var i = cs.length - 1; i >= 0; i--) d += 'L' + r1(cs[i][0]) + ' ' + r1(cs[i][1]) + ' ';
    return d + 'L-20 216 Z';
  }

  function lowerPath() {
    var cs = sample(C.incis, 10, 'incis'), d = 'M-20 640 H980 V232 L' + r1(cs[cs.length - 1][0]) + ' ' + r1(cs[cs.length - 1][1]) + ' ';
    for (var i = cs.length - 1; i >= 0; i--) d += 'L' + r1(cs[i][0]) + ' ' + r1(cs[i][1]) + ' ';
    return d + 'L-20 216 Z';
  }

  /* ---------------- mesh, tacks, closure ---------------- */
  function meshPath() {
    var m = MESH;
    return 'M' + P(m[0]) + ' C' + P([m[0][0] + 260, m[0][1] - 18]) + ' ' + P([m[1][0] - 260, m[1][1] - 6]) + ' ' + P(m[1]) +
      ' C' + P([m[1][0] + 8, m[1][1] + 150]) + ' ' + P([m[2][0] + 6, m[2][1] - 150]) + ' ' + P(m[2]) +
      ' C' + P([m[2][0] - 260, m[2][1] + 18]) + ' ' + P([m[3][0] + 260, m[3][1] + 4]) + ' ' + P(m[3]) +
      ' C' + P([m[3][0] - 10, m[3][1] - 150]) + ' ' + P([m[0][0] - 6, m[0][1] + 150]) + ' ' + P(m[0]) + ' Z';
  }
  function meshLayer(st, id, k) {
    var d = meshPath();
    var s = '<path d="' + d + '" fill="#2A140C" opacity=".2" transform="translate(5 7)" filter="url(#' + id + '-soft)"/>';
    s += '<g clip-path="url(#' + id + '-cLowM)">';
    s += '<path d="' + d + '" fill="#EEF4F3" fill-opacity=".14"/>';
    s += '<path d="' + d + '" fill="url(#' + id + '-knit)"/>';
    /* drape: sheen where the mesh rides over Cooper, the tract and the vessels */
    s += '<g clip-path="url(#' + id + '-cMesh)">';
    s += stroke(off(sample(C.cooper, 10, 'cooper'), -6), '#fff', 14, ' stroke-opacity=".14"');
    s += stroke(off(sample(C.ipt, 10, 'ipt'), -6), '#fff', 12, ' stroke-opacity=".12"');
    s += stroke(off(sample(C.eiv, 12, 'eiv'), -10), '#fff', 10, ' stroke-opacity=".12"');
    s += '<ellipse cx="520" cy="300" rx="260" ry="120" fill="url(#' + id + '-glare)" opacity=".5"/>';
    s += '</g>';
    s += '<path d="' + d + '" fill="none" stroke="#FFFFFF" stroke-opacity=".9" stroke-width="2.6"/>';
    s += '<path d="' + d + '" fill="none" stroke="#6E7C80" stroke-opacity=".4" stroke-width=".8" transform="translate(1.6 1.6)"/>';
    /* orientation stripe near the medial edge */
    s += stroke('M900 128 C904 260 908 400 912 540', '#3C78C8', 2.2, ' stroke-opacity=".75" stroke-dasharray="10 6"');
    s += '</g>';
    /* the upper margin is tucked under the peritoneum above the incision: seen faintly through it */
    s += '<g clip-path="url(#' + id + '-cUp)" opacity=".3"><path d="' + d + '" fill="url(#' + id + '-knit)"/><path d="' + d + '" fill="none" stroke="#fff" stroke-width="2"/></g>';
    var cs = sample(C.incis, 10, 'incis');
    s += stroke(off(cs, -1), '#FFFFFF', 2, ' stroke-opacity=".8"');
    return s;
  }
  var TACK = { cooper: [[640, 470], [740, 478], [830, 486]], medial: [[796, 270], [690, 222]], 'lateral-high': [[200, 236], [318, 222]] };
  var BAD = { doom: [452, 520], pain: [214, 486] };
  function tackAt(p, id, bad, k) {
    var x = p[0], y = p[1];
    var s = '<g transform="translate(' + x + ' ' + y + ')">' +
      '<ellipse cx="2.5" cy="3.5" rx="11" ry="7" fill="#120806" opacity=".4" filter="url(#' + id + '-soft2)"/>' +
      '<circle r="9" fill="url(#' + id + '-tack)" stroke="#30373C" stroke-width=".9"/>' +
      '<path d="M-5.6 -1.4 A6 6 0 0 1 4.4 -4.4 M5.4 1.6 A6 6 0 0 1 -3.8 5.2 M-2.4 .4 A2.6 2.6 0 0 1 2.4 -.4" fill="none" stroke="#2A3035" stroke-width="1.2" stroke-opacity=".75"/>' +
      '<ellipse cx="-3" cy="-3.6" rx="2.8" ry="1.4" fill="#fff" fill-opacity=".9" transform="rotate(-20 -3 -3.6)"/>' +
      '</g>';
    if (bad) s += '<circle cx="' + x + '" cy="' + y + '" r="18" fill="none" stroke="#FF4B3A" stroke-width="2.6" class="' + k + '-bt"/>' +
      '<circle cx="' + x + '" cy="' + y + '" r="27" fill="none" stroke="#FF4B3A" stroke-opacity=".45" stroke-width="1.4" class="' + k + '-bt" style="animation-delay:.3s"/>';
    return s;
  }

  /* points at equal arc length along a sampled polyline (keeps normals) */
  function even(pts, step) {
    var out = [pts[0]], acc = 0;
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i], L = Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1])), t = 0;
      while (acc + L * (1 - t) >= step) { t += (step - acc) / L; acc = 0; out.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t), b[2], b[3]]); }
      acc += L * (1 - t);
    }
    return out;
  }
  function closure(st, id, k) {
    var cs = sample(C.incis, 10, 'incis'), s = '';
    s += periSheet(id, .86);
    s += folds(st, id, k);
    if (st.mesh) s += '<path d="' + meshPath() + '" fill="url(#' + id + '-knit)" opacity=".18"/><path d="' + meshPath() + '" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>';
    /* puckered suture line, running barbed suture */
    s += stroke(off(cs, 1), '#8E4A3A', 6, ' stroke-opacity=".22"');
    s += stroke(off(cs, -2), '#fff', 1.6, ' stroke-opacity=".6"');
    var R = rng(29), prev = null, eq = even(cs, 23);
    for (var i = 1; i < eq.length - 1; i++) {
      var p = eq[i], j = (R() - .5) * 2;
      var a = [p[0] + p[2] * 9 - p[3] * 4 + j, p[1] + p[3] * 9 + p[2] * 4], b = [p[0] - p[2] * 9 + p[3] * 4 + j, p[1] - p[3] * 9 - p[2] * 4];
      var mid = [p[0] + p[3] * 2, p[1] - p[2] * 2];
      s += '<path d="M' + P(a) + ' Q' + P([mid[0] + p[3] * 5, mid[1] - p[2] * 5]) + ' ' + P(b) + '" fill="none" stroke="#4E3383" stroke-width="2.6" stroke-linecap="round"/>';
      s += '<path d="M' + P(a) + ' Q' + P([mid[0] + p[3] * 5, mid[1] - p[2] * 5]) + ' ' + P(b) + '" fill="none" stroke="#B9A6E6" stroke-opacity=".6" stroke-width=".8" stroke-linecap="round"/>';
      s += '<circle cx="' + r1(a[0]) + '" cy="' + r1(a[1]) + '" r="2" fill="#6A2A1E" fill-opacity=".45"/><circle cx="' + r1(b[0]) + '" cy="' + r1(b[1]) + '" r="2" fill="#6A2A1E" fill-opacity=".45"/>';
      if (prev) s += '<path d="M' + P(prev) + ' L' + P(a) + '" stroke="#4E3383" stroke-opacity=".35" stroke-width="1.2" stroke-dasharray="2 3"/>';
      prev = b;
    }
    var e = cs[cs.length - 2];
    s += stroke('M' + P(e) + ' c10 -6 20 -14 34 -10 c10 3 16 10 26 6', '#4E3383', 2.2);
    return s;
  }

  /* ---------------- bleeding ---------------- */
  function bleedSrc(b) { return b === 'epigastric' ? at(C.iev, .55, 'ievAt') : b === 'corona' ? [601, 476] : [466, 492]; }
  function bleed(st, id, k, noPool) {
    var b = st.bleed; if (!b) return '';
    var venous = b === 'iliac', s = '', src = bleedSrc(b), px = src[0], py = src[1];
    var grad = 'url(#' + id + '-' + (venous ? 'vblood' : 'blood') + ')';
    /* pool: irregular film spreading down the field, glossy (left out when the photo already holds it) */
    var pr = venous ? [70, 44] : [50, 30];
    var pool = blob(b.length * 7 + 3, px - 8, py + pr[1] * .8, pr[0], pr[1], .55, 16);
    if (!noPool) s += '<g class="' + k + '-pool"><path d="' + pool + '" fill="' + grad + '" opacity=".93"/>' +
      '<path d="' + pool + '" fill="none" stroke="#2A0204" stroke-opacity=".4" stroke-width="1.2"/>' +
      '<path d="' + blob(b.length * 7 + 4, px - 16, py + pr[1] * .45, pr[0] * .35, pr[1] * .18, .4, 8) + '" fill="#fff" fill-opacity=".22"/>' +
      '<ellipse cx="' + (px - 14) + '" cy="' + r1(py + pr[1] * .4) + '" rx="7" ry="2.6" fill="#fff" fill-opacity=".7" transform="rotate(-20 ' + (px - 14) + ' ' + r1(py + pr[1] * .4) + ')"/></g>';
    if (!noPool) s += stroke('M' + px + ' ' + py + ' C' + (px + 8) + ' ' + (py + 60) + ' ' + (px - 6) + ' ' + (py + 120) + ' ' + (px + 6) + ' ' + (py + 200), venous ? '#4A0612' : '#8A0B10', 5, ' class="' + k + '-trk" stroke-opacity=".9"');
    if (venous) {
      s += '<circle cx="' + px + '" cy="' + py + '" r="15" fill="' + grad + '" class="' + k + '-well"/>';
      s += '<ellipse cx="' + (px - 4) + '" cy="' + (py - 5) + '" rx="5" ry="2.4" fill="#fff" fill-opacity=".55" class="' + k + '-well"/>';
    } else {
      var dx = b === 'epigastric' ? -80 : -70, dy = b === 'epigastric' ? 30 : -24;
      var kf = '@keyframes ' + k + 'sp{0%{transform:translate(0,0) scale(1);opacity:1}55%{transform:translate(' + r1(dx * .55) + 'px,' + r1(dy * .55 - 30) + 'px) scale(.9);opacity:1}100%{transform:translate(' + dx + 'px,' + (dy + 24) + 'px) scale(.6);opacity:0}}';
      s += '<style>' + kf + '.' + k + '-sp{animation:' + k + 'sp .85s cubic-bezier(.25,.6,.5,1) infinite;transform-box:fill-box;transform-origin:center}@media (prefers-reduced-motion: reduce){.' + k + '-sp{animation:none!important;opacity:0}}</style>';
      for (var i = 0; i < 10; i++) {
        var rr = 2 + (i % 3) * 1.2;
        s += '<circle cx="' + (px + (i % 2 ? 1 : -1)) + '" cy="' + py + '" r="' + rr + '" fill="#C0141C" class="' + k + '-sp" style="animation-delay:-' + (i * .085).toFixed(2) + 's"/>';
      }
      s += '<circle cx="' + px + '" cy="' + py + '" r="6.5" fill="' + grad + '" class="' + k + '-well"/>';
    }
    return s;
  }

  /* ---------------- zones ---------------- */
  function zones(st, id) {
    var s = '';
    var dp = 'M400 352 C430 370 462 404 490 444 C522 490 566 546 618 614 L310 614 C326 580 340 540 350 498 C362 448 374 400 400 352 Z';
    s += '<path d="' + dp + '" fill="#D2332A" fill-opacity=".28" stroke="#FF6A5A" stroke-width="2" stroke-dasharray="8 5"/>';
    var pp = 'M70 300 C150 316 290 352 384 376 C374 420 362 460 350 498 C340 540 326 580 310 614 L40 614 C34 520 44 400 70 300 Z';
    s += '<path d="' + pp + '" fill="#F2B632" fill-opacity=".22" stroke="#FFD46A" stroke-width="2" stroke-dasharray="8 5"/>';
    /* where fixation is acceptable: Cooper's ligament and above the tract, clear of the epigastrics */
    var lat = 'M86 226 C170 206 260 196 350 192 L352 300 C300 330 250 318 200 316 C150 308 110 300 86 296 Z';
    var med = 'M574 196 C640 194 700 198 744 210 C734 300 712 380 692 440 C650 434 600 422 560 410 C550 340 556 260 574 196 Z';
    s += '<path d="' + lat + '" fill="#1FBF8F" fill-opacity=".14" stroke="#5CE0B4" stroke-opacity=".7" stroke-width="1.4" stroke-dasharray="3 5"/>';
    s += '<path d="' + med + '" fill="#1FBF8F" fill-opacity=".14" stroke="#5CE0B4" stroke-opacity=".7" stroke-width="1.4" stroke-dasharray="3 5"/>';
    s += pathOf(ribbon(sample(C.cooper, 10, 'cooper'), 22, 26, 28), '#1FBF8F', ' fill-opacity=".22" stroke="#5CE0B4" stroke-opacity=".75" stroke-width="1.2"');
    s += cap(452, 548, 'Triangle of doom', '#FFE1DC', 18);
    s += cap(452, 568, 'Iliac vessels inside', '#FFE1DC', 13);
    s += cap(178, 520, 'Triangle of pain', '#FFF1C8', 18);
    s += cap(178, 540, 'Nerves: no energy, no fixation', '#FFF1C8', 13);
    s += cap(218, 262, 'Fix above the tract', '#D2FCEC', 13);
    s += cap(650, 300, 'Medial fixation', '#D2FCEC', 13);
    s += cap(780, 520, 'Fix to Cooper’s', '#D2FCEC', 13);
    return s;
  }
  function cap(x, y, t, col, fs) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-family="Inter,sans-serif" font-weight="700" font-size="' + fs + '" fill="' + col + '" stroke="#1A0A06" stroke-opacity=".75" stroke-width="3.4" paint-order="stroke">' + esc(t) + '</text>';
  }

  /* ---------------- labels ---------------- */
  /* label table: id → [text x, text y, align]; align 'r' = the text's right edge at x, 'l' = its left edge, 'c' = centred */
  var LBL = {
    mul: [850, 62, 'c'], medul: [700, 130, 'c'], iev: [420, 96, 'c'], ring: [300, 236, 'c'], vas: [640, 480, 'l'],
    gon: [330, 582, 'c'], iliac: [520, 566, 'c'], cooper: [800, 482, 'c'], ipt: [150, 352, 'c'], hessel: [640, 222, 'c'],
    femoral: [600, 372, 'l'], pubis: [905, 502, 'c'], lfcn: [130, 410, 'c'], gfnf: [190, 482, 'c'], corona: [700, 540, 'l'],
    retzius: [830, 300, 'c'], bogros: [150, 180, 'c'], psoas: [196, 546, 'c'], bladder: [880, 560, 'c'], mesh: [520, 150, 'c'],
    sac: [250, 420, 'c'], incis: [150, 150, 'c'], flap: [230, 590, 'c']
  };
  function label(sp) {
    var t = LBL[sp.id], tx, ty, al;
    if (sp.lx) { tx = sp.lx; ty = sp.ly; al = sp.la || 'c'; } else if (t) { tx = t[0]; ty = t[1]; al = t[2]; } else { tx = sp.x + 40; ty = sp.y - 34; al = 'l'; }
    var anchor = al === 'r' ? 'end' : al === 'l' ? 'start' : 'middle';
    /* leader ends at the near edge of the text */
    var ex = tx, ey = ty + (ty > sp.y ? -16 : 6);
    var s = '<g class="gr-lbl" data-k="' + esc(sp.id) + '">';
    s += '<path d="M' + r1(sp.x) + ' ' + r1(sp.y) + ' L' + r1(ex) + ' ' + r1(ey) + '" stroke="#0A1620" stroke-opacity=".5" stroke-width="3" fill="none"/>';
    s += '<path d="M' + r1(sp.x) + ' ' + r1(sp.y) + ' L' + r1(ex) + ' ' + r1(ey) + '" stroke="#FFFFFF" stroke-opacity=".92" stroke-width="1.1" fill="none"/>';
    s += '<circle cx="' + r1(sp.x) + '" cy="' + r1(sp.y) + '" r="3.6" fill="#fff" stroke="#0A1620" stroke-width="1.4"/>';
    s += '<text x="' + r1(tx) + '" y="' + r1(ty) + '" text-anchor="' + anchor + '" font-family="Inter,sans-serif" font-weight="600" font-size="15" fill="#FFFFFF" stroke="#0A1620" stroke-opacity=".8" stroke-width="3.6" paint-order="stroke">' + esc(sp.he) + '</text>';
    return s + '</g>';
  }

  /* ---------------- camera: the scope tilted caudally, a touch closer ---------------- */
  var CAM = { s: 1.06, x: -29, y: -72 };
  var CAMT = 'translate(' + CAM.x + ' ' + CAM.y + ') scale(' + CAM.s + ')';
  function cam(p) { return [p[0] * CAM.s + CAM.x, p[1] * CAM.s + CAM.y]; }

  /* ---------------- spots (visible structures) ---------------- */
  function spots(st) {
    st = st || {};
    var flap = +st.flap || 0, closed = !!st.closed, open = flap >= 2 && !closed, list = [];
    function add(id, he, p, extra) { p = cam(p); var o = { id: id, he: he, x: r1(p[0]), y: r1(p[1]) }; if (extra) for (var q in extra) o[q] = extra[q]; list.push(o); }
    add('mul', 'Median umbilical ligament', [876, 170]);
    add('medul', 'Medial umbilical ligament', open ? [742, 236] : [756, 150]);
    add('iev', 'Inferior epigastric vessels', at(C.iev, .72, 'ievL'));
    add('ring', 'Internal ring', [RING[0] - 24, RING[1] - 6]);
    add('vas', 'Vas deferens', at(C.vas, .62, 'vasAt'));
    add('gon', 'Testicular vessels', at(C.gon1, .78, 'gonAt'));
    add('iliac', 'External iliac artery and vein', [432, 536]);
    add('hessel', 'Hesselbach’s triangle', HESS);
    add('femoral', 'Femoral ring', FEM);
    if (open) {
      add('ipt', 'Iliopubic tract', at(C.ipt, .22, 'iptAt'));
      add('cooper', 'Cooper’s ligament', [760, 480]);
      add('pubis', 'Pubic bone', [880, 506]);
      add('doom', 'Triangle of doom', [452, 520]);
      add('pain', 'Triangle of pain', [190, 470]);
      add('lfcn', 'Lateral femoral cutaneous nerve', at(C.lfcn, .5, 'lfcnAt'));
      add('gfnf', 'Femoral branch, genitofemoral nerve', at(C.gfnf, .35, 'gfnAt'));
      add('psoas', 'Psoas muscle', [270, 590]);
      add('retzius', 'Space of Retzius', [800, 380]);
      add('bogros', 'Space of Bogros', [180, 272]);
      add('bladder', 'Bladder', [870, 566]);
      if (st.corona || st.bleed === 'corona') add('corona', 'Corona mortis', [603, 536]);
      if (flap === 2 && st.defect === 'L') add('sac', 'Indirect hernia sac', [RING[0] - 26, RING[1] + 110]);
      add('flap', 'Peritoneal flap', [230, 578]);
    }
    if (st.defect === 'L' && !(open && flap >= 3)) add('defect', 'Indirect hernia', [RING[0] + 26, RING[1] + 14], { lx: 300, ly: 420, la: 'r' });
    if (st.defect === 'M') add('defect', 'Direct hernia', [HESS[0] + 30, HESS[1] + 24], { lx: 700, ly: 372, la: 'l' });
    if (st.defect === 'F') add('defect', 'Femoral hernia', [FEM[0] + 8, FEM[1] + 6], { lx: 650, ly: 470, la: 'l' });
    if (flap === 1 && !closed) add('incis', 'Peritoneal incision', at(C.incis, .22, 'incAt'));
    if (st.mesh && !closed) add('mesh', 'Mesh', [520, 196]);
    if (st.mesh >= 2 && !closed && st.badTack && BAD[st.badTack]) add('tack', st.badTack === 'doom' ? 'Tack in the triangle of doom' : 'Tack in the triangle of pain', BAD[st.badTack], { lx: st.badTack === 'doom' ? 580 : 120, ly: st.badTack === 'doom' ? 440 : 420, la: st.badTack === 'doom' ? 'l' : 'r' });
    if (st.bleed) {
      var bp = bleedSrc(st.bleed);
      add('bleed', st.bleed === 'epigastric' ? 'Epigastric bleeding' : st.bleed === 'corona' ? 'Corona mortis bleeding' : 'Iliac vein bleeding', bp, { lx: bp[0] + 150, ly: bp[1] - 70, la: 'l' });
    }
    if (closed) list = list.filter(function (p) { return p.id !== 'flap'; });
    return list;
  }
  /* labels drawn when st.labels (doom/pain are named by the zone overlay instead when zones are on) */
  var LABEL_SKIP = { flap: 1, bladder: 1, pain: 1, doom: 1 };

  /* ---------------- realistic photo layer ----------------
     One repainted laparoscope photo per anatomical keyframe, at 16:9 over x -53.333..1013.333 so it sits exactly on the
     960x600 scene. Interaction (spots), labels, focus and dynamic effects stay vector on top. st.real === false, or a
     keyframe whose photo is not in REAL_KEYS yet, draws the vector scene as before. */
  var REAL_DIR = 'art/real/groin/';
  /* photos present in art/real/groin/ (add a key here once its jpg is checked) */
  var REAL_KEYS = [];
  /* photos that already hold the blood pool (only the spurts stay vector) */
  var REAL_POOL = { 'bleed-cor': 1, 'bleed-epi': 1 };
  function realWant(st) {
    var d = st.defect === 'M' ? 'dir' : st.defect === 'F' ? 'fem' : st.defect === 'L' ? 'ind' : 'none';
    var flap = +st.flap || 0;
    if (st.closed) return ['closed'];
    if (+st.mesh) return ['mesh'];
    if (d === 'none' && flap) return [];
    if (flap >= 3) return [d === 'ind' ? 'cv' : 'cv-' + d];
    if (flap === 2) return st.bleed === 'corona' ? ['bleed-cor', 'sac-' + d] : ['sac-' + d];
    if (flap === 1) return st.bleed === 'epigastric' && d === 'ind' ? ['bleed-epi', 'cut-ind'] : ['cut-' + d];
    if (d === 'fem' && st.content === 'bowel') return ['incarc'];
    if (d === 'dir' && st.content) return ['dir-om'];
    return [d];
  }
  function realKey(st) {
    if (!st || st.real === false) return null;
    var w = realWant(st);
    for (var i = 0; i < w.length; i++) if (REAL_KEYS.indexOf(w[i]) >= 0) return w[i];
    return null;
  }
  /* AR touch on the photo: thin gold hairlines, small type */
  var GOLD = '#C8A96A';
  function labelReal(sp) {
    var t = LBL[sp.id], tx, ty, al;
    if (sp.lx) { tx = sp.lx; ty = sp.ly; al = sp.la || 'c'; } else if (t) { tx = t[0]; ty = t[1]; al = t[2]; } else { tx = sp.x + 40; ty = sp.y - 34; al = 'l'; }
    var anchor = al === 'r' ? 'end' : al === 'l' ? 'start' : 'middle';
    var ex = tx, ey = ty + (ty > sp.y ? -14 : 5);
    var s = '<g class="gr-lbl" data-k="' + esc(sp.id) + '">';
    s += '<path d="M' + r1(sp.x) + ' ' + r1(sp.y) + ' L' + r1(ex) + ' ' + r1(ey) + '" stroke="#05080A" stroke-opacity=".35" stroke-width="2.2" fill="none"/>';
    s += '<path d="M' + r1(sp.x) + ' ' + r1(sp.y) + ' L' + r1(ex) + ' ' + r1(ey) + '" stroke="' + GOLD + '" stroke-opacity=".95" stroke-width=".9" fill="none"/>';
    s += '<circle cx="' + r1(sp.x) + '" cy="' + r1(sp.y) + '" r="2.6" fill="' + GOLD + '" stroke="#05080A" stroke-opacity=".5" stroke-width="1"/>';
    s += '<text x="' + r1(tx) + '" y="' + r1(ty) + '" text-anchor="' + anchor + '" font-family="Inter,sans-serif" font-weight="500" font-size="13.5" letter-spacing=".2" fill="#F6EFE2" stroke="#05080A" stroke-opacity=".55" stroke-width="3" paint-order="stroke">' + esc(sp.he) + '</text>';
    return s + '</g>';
  }
  function drawReal(st, id, rk) {
    var k = id, mesh = +st.mesh || 0, closed = !!st.closed, opened = (+st.flap || 0) >= 2 && !closed;
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 600" class="gr-scene gr-real" data-real="' + rk + '" role="img" aria-label="Laparoscopic view of the right groin" preserveAspectRatio="xMidYMid slice">';
    s += style(id) + defs(id);
    s += '<rect x="-60" width="1080" height="600" fill="#0A0503"/>';
    s += '<image href="' + REAL_DIR + rk + '.jpg" x="-53.333" y="0" width="1066.667" height="600" preserveAspectRatio="none"/>';
    var fx = '';
    if (mesh >= 2 && !closed) {
      (st.tacks || []).forEach(function (t) { (TACK[t] || []).forEach(function (p) { fx += tackAt(p, id, false, k); }); });
      if (st.badTack && BAD[st.badTack]) fx += tackAt(BAD[st.badTack], id, true, k);
    }
    fx += bleed(st, id, k, !!REAL_POOL[rk]);
    if (fx) s += '<g transform="' + CAMT + '">' + fx + '</g>';
    if (st.zones && opened) s += '<g transform="' + CAMT + '" opacity=".85">' + zones(st, id) + '</g>';
    var sp = spots(st);
    if (st.focus) sp.forEach(function (p) {
      if (p.id !== st.focus) return;
      s += '<circle cx="' + p.x + '" cy="' + p.y + '" r="46" fill="url(#' + id + '-rfocus)"/>';
      s += '<circle cx="' + p.x + '" cy="' + p.y + '" r="22" fill="none" stroke="' + GOLD + '" stroke-width="1.3" class="' + k + '-fo"/>';
      s += '<circle cx="' + p.x + '" cy="' + p.y + '" r="29" fill="none" stroke="' + GOLD + '" stroke-opacity=".35" stroke-width=".7" stroke-dasharray="2 5"/>';
    });
    if (st.labels) sp.forEach(function (p) {
      if (LABEL_SKIP[p.id] && !(p.id === st.focus)) return;
      if ((p.id === 'doom' || p.id === 'pain') && st.zones) return;
      s += labelReal(p);
    });
    s += '<defs><radialGradient id="' + id + '-rfocus"><stop offset="0" stop-color="#F3DFAE" stop-opacity=".22"/><stop offset=".6" stop-color="' + GOLD + '" stop-opacity=".08"/><stop offset="1" stop-color="' + GOLD + '" stop-opacity="0"/></radialGradient></defs>';
    return s + '</svg>';
  }

  /* ---------------- draw ---------------- */
  var N = 0;
  function draw(st) {
    st = st || {};
    var id = String(st.id || 'gr' + (++N)).replace(/[^a-zA-Z0-9_-]/g, '');
    var rk = realKey(st);
    if (rk) return drawReal(st, id, rk);
    var k = id;
    var flap = +st.flap || 0, mesh = +st.mesh || 0, closed = !!st.closed;
    var opened = flap >= 2 && !closed;
    var oc = st.defect === 'M' ? HESS : st.defect === 'F' ? FEM : RING;
    var clips = '<defs>' +
      '<clipPath id="' + id + '-cWall"><path d="' + wallPath() + '"/></clipPath>' +
      '<clipPath id="' + id + '-cMesh"><path d="' + meshPath() + '"/></clipPath>' +
      '<clipPath id="' + id + '-cUp"><path d="' + upperPath() + '"/></clipPath>' +
      '<clipPath id="' + id + '-cLowM"><path d="' + lowerPath() + '"/></clipPath>' +
      '<clipPath id="' + id + '-cOm"><path d="M' + (oc[0] - 170) + ' -20 H' + (oc[0] + 150) + ' V' + (oc[1] + 4) + ' H' + (oc[0] - 170) + ' Z"/></clipPath>' +
      '</defs>';

    var sc = '<g id="' + id + '-scene"><g transform="' + CAMT + '"><g class="' + k + '-br">';
    sc += deep(st, id, k, opened);
    if (opened) {
      sc += ringDeep(st, id);
      sc += cord(st, id, k, 1, flap >= 3);
      sc += fatCluster(95, 372, 404, 18, 12, 8, id + '-lob', .95);
      sc += sacDeep(st, id, k, flap);
      sc += '<g>' + cobwebs(31, 18, [60, 240, 900, 410], 16, 40) + cobwebs(33, 26, [60, 480, 900, 566], 12, 36) + '</g>';
      /* the medial umbilical ligament, kept and carried down with the flap */
      sc += lowerFlap(st, id, flap);
      /* peritoneum remaining on the anterior wall and its cut edge (underside shows fat) */
      sc += '<g clip-path="url(#' + id + '-cUp)">' + periSheet(id, .88) + '<g opacity=".8">' + folds(st, id, k) + '</g></g>';
      var cs = sample(C.incis, 10, 'incis');
      sc += '<g filter="url(#' + id + '-soft)">' + stroke(off(cs, 16), '#2A0E06', 14, ' stroke-opacity=".4"') + '</g>';
      sc += pathOf(ribbon(shift(cs, 4), 7, 7, 9), '#E3B464', ' opacity=".85"');
      sc += stroke(off(cs, -1), '#FFFFFF', 2.2, ' stroke-opacity=".9"');
      sc += stroke(off(cs, 8), '#7A3A28', 1.4, ' stroke-opacity=".4"');
    } else {
      sc += periSheet(id, .72);
      sc += '<path d="' + belowPath() + '" fill="url(#' + id + '-peri)" opacity=".5" filter="url(#' + id + '-soft)"/>';
      sc += folds(st, id, k);
      if (st.defect !== 'L') sc += ringDimple(id);
      sc += defectIntact(st, id, k);
      if (flap === 1 && !closed) {
        var c1 = sample(C.incis, 10, 'incis');
        sc += pathOf(ribbon(c1, 3, 3, 10), '#E7B862');
        sc += pathOf(ribbon(shift(c1, 1), 1.5, 1.5, 5), '#A86A2A', ' opacity=".7"');
        sc += stroke(off(c1, -4.2), '#FFFFFF', 1.6, ' stroke-opacity=".85"');
        sc += stroke(off(c1, 5), '#7A3A2C', 1.2, ' stroke-opacity=".45"');
        var e = c1[c1.length - 1];
        sc += '<circle cx="' + r1(e[0]) + '" cy="' + r1(e[1]) + '" r="2.6" fill="#8A1A12" fill-opacity=".7"/>';
      }
    }
    if (mesh && !closed) {
      sc += meshLayer(st, id, k);
      if (mesh >= 2) {
        (st.tacks || []).forEach(function (t) { (TACK[t] || []).forEach(function (p) { sc += tackAt(p, id, false, k); }); });
        if (st.badTack && BAD[st.badTack]) sc += tackAt(BAD[st.badTack], id, true, k);
      }
    }
    if (closed) sc += closure(st, id, k);
    sc += bleed(st, id, k);
    /* wet glints from the scope light */
    sc += glints(opened ? [[476, 310, 20, 4, -20, .35], [640, 468, 28, 3.4, 4, .55], [262, 352, 16, 3, 14, .4], [840, 548, 24, 4, 6, .35], [410, 330, 8, 3, -10, .5]] :
      [[480, 250, 36, 7, -20, .3], [640, 360, 26, 6, -6, .22], [300, 420, 30, 6, 10, .2], [758, 250, 14, 5, -75, .45]], k + '-gl');
    sc += '</g></g></g>';

    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 600" class="gr-scene" role="img" aria-label="Laparoscopic view of the right groin" preserveAspectRatio="xMidYMid slice">';
    s += style(id) + defs(id) + clips;
    s += '<rect width="960" height="600" fill="#140604"/>';
    s += sc;
    /* depth of field towards the rim: a blurred copy faded in by a radial mask */
    s += '<use href="#' + id + '-scene" filter="url(#' + id + '-dof)" mask="url(#' + id + '-edge)"/>';
    s += '<rect width="960" height="600" filter="url(#' + id + '-grain)" opacity=".35" pointer-events="none"/>';
    s += '<rect width="960" height="600" fill="url(#' + id + '-shade)" pointer-events="none"/>';
    s += '<ellipse cx="490" cy="290" rx="330" ry="210" fill="url(#' + id + '-glare)" opacity=".55"/>';
    if (st.zones && opened) s += '<g transform="' + CAMT + '">' + zones(st, id) + '</g>';
    var sp = spots(st);
    if (st.focus) sp.forEach(function (p) {
      if (p.id !== st.focus) return;
      s += '<circle cx="' + p.x + '" cy="' + p.y + '" r="54" fill="url(#' + id + '-focus)"/>';
      s += '<circle cx="' + p.x + '" cy="' + p.y + '" r="24" fill="none" stroke="#5CE0CF" stroke-width="2.4" class="' + k + '-fo"/>';
    });
    if (st.labels) sp.forEach(function (p) {
      if (LABEL_SKIP[p.id] && !(p.id === st.focus)) return;
      if ((p.id === 'doom' || p.id === 'pain') && st.zones) return;
      s += label(p);
    });
    s += '<rect width="960" height="600" fill="url(#' + id + '-vig)" pointer-events="none"/>';
    s += '</svg>';
    return s;
  }

  O.scenes.groin = {
    draw: draw,
    spots: spots,
    real: { dir: REAL_DIR, key: realKey, keys: REAL_KEYS, want: realWant },
    states: {
      view: 'Right groin, laparoscopic (posterior) view from the umbilicus. Lateral = left, midline = right, anterior wall = top.',
      defect: "'L' indirect (internal ring, lateral to the epigastrics) | 'M' direct (Hesselbach) | 'F' femoral (below the tract, medial to the vein) | 'none'",
      size: '1..3',
      content: "null | 'omentum' | 'bowel' (with incarc: true the loop is dusky and constricted)",
      flap: '0 intact | 1 incision above the ring | 2 preperitoneal space open | 3 sac reduced, cord parietalized',
      mesh: '0 | 1 laid flat over the MPO | 2 fixed (tacks)',
      tacks: "array of 'cooper' | 'medial' | 'lateral-high'",
      badTack: "'doom' | 'pain' (a tack in a danger triangle, flashing)",
      closed: 'peritoneum closed over the mesh with a running suture',
      bleed: "0 | 'epigastric' | 'corona' | 'iliac'",
      corona: 'show corona mortis', zones: 'danger and safe zones (opened field)', labels: 'Hebrew labels with leader lines',
      focus: 'spot id to highlight', id: 'unique SVG id prefix',
      real: 'false = always the vector painting; otherwise the keyframe photo from art/real/groin/ when it exists (see realWant)'
    }
  };
})();
