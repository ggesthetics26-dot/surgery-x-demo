/* ORBIT instrument plates: the twelve basic instruments as catalog-style drawings (viewBox 0 0 640 200).
   The whole instrument in side view (handle on the left, tip on the right) with lit metal, insulation and
   a soft table shadow, and a magnified view of the tip in the circle, the way a catalog shows it.
   Original vector drawings, no brand, no product copied. Used by the Skills Lab, the quiz and the live tray.
   Shafts are drawn thicker than true scale (a 5 mm shaft is 10 units) so the parts read on a phone. */
(function () {
  'use strict';
  var O = window.ORBIT = window.ORBIT || {};
  var Y = 104, TX = 600, IC = [548, 49, 43];

  function r(n) { return Math.round(n * 10) / 10; }
  function cyl(x0, x1, cy, d, fill, rx) { return '<rect x="' + r(x0) + '" y="' + r(cy - d / 2) + '" width="' + r(x1 - x0) + '" height="' + r(d) + '" rx="' + (rx == null ? Math.min(2, d / 2) : rx) + '" fill="url(#' + fill + ')"/>'; }
  function line(x0, y0, x1, y1, c, w, o) { return '<path d="M' + r(x0) + ' ' + r(y0) + ' L' + r(x1) + ' ' + r(y1) + '" stroke="' + c + '" stroke-width="' + w + '"' + (o ? ' opacity="' + o + '"' : '') + ' stroke-linecap="round" fill="none"/>'; }
  function ridges(x0, x1, cy, d, step) { var s = ''; for (var x = x0 + 2; x < x1 - 1; x += step) s += line(x, cy - d / 2 + 2, x, cy + d / 2 - 2, '#14181c', 1.1, .55) + line(x + 1, cy - d / 2 + 2, x + 1, cy + d / 2 - 2, '#9aa6b1', .5, .35); return s; }
  function shadow(x0, x1, y, h) { return '<rect x="' + x0 + '" y="' + y + '" width="' + (x1 - x0) + '" height="' + h + '" rx="' + h / 2 + '" fill="#3a2e1c" opacity=".28" filter="url(#iqBlur)"/>'; }
  /* a thick rounded arm or a ring: dark body, a lighter edge on top */
  function arm(d, w) { w = w * 1.25; return '<path d="' + d + '" stroke="#20262b" stroke-width="' + w + '" stroke-linecap="round" fill="none"/><path d="' + d + '" stroke="#5f6a74" stroke-width="' + r(w * .22) + '" stroke-linecap="round" fill="none" transform="translate(-.6 -' + r(w * .26) + ')" opacity=".9"/>'; }
  function ring(cx, cy, rr, w) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + rr + '" stroke="#20262b" stroke-width="' + w + '" fill="none"/><circle cx="' + cx + '" cy="' + cy + '" r="' + rr + '" stroke="#6b7782" stroke-width="1.6" fill="none" stroke-dasharray="' + r(rr * 2.2) + ' ' + r(rr * 6) + '" transform="rotate(200 ' + cx + ' ' + cy + ')"/>'; }

  var DEFS = '<defs>' +
    '<linearGradient id="iqSteel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4b545b"/><stop offset=".3" stop-color="#dde3e7"/><stop offset=".44" stop-color="#fbfcfd"/><stop offset=".62" stop-color="#a3adb4"/><stop offset="1" stop-color="#394147"/></linearGradient>' +
    '<linearGradient id="iqBlack" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050607"/><stop offset=".26" stop-color="#394047"/><stop offset=".38" stop-color="#6f7881"/><stop offset=".55" stop-color="#1f2429"/><stop offset="1" stop-color="#030404"/></linearGradient>' +
    '<linearGradient id="iqPlast" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#46515b"/><stop offset=".28" stop-color="#85919c"/><stop offset=".5" stop-color="#525d67"/><stop offset="1" stop-color="#191e23"/></linearGradient>' +
    '<linearGradient id="iqGrip" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#15191c"/><stop offset=".4" stop-color="#3c444b"/><stop offset=".62" stop-color="#262c31"/><stop offset="1" stop-color="#0f1214"/></linearGradient>' +
    '<linearGradient id="iqGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4720"/><stop offset=".42" stop-color="#e6c97c"/><stop offset=".7" stop-color="#a8853f"/><stop offset="1" stop-color="#47371a"/></linearGradient>' +
    '<linearGradient id="iqTi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6c7277"/><stop offset=".5" stop-color="#eef1f3"/><stop offset="1" stop-color="#787f84"/></linearGradient>' +
    '<linearGradient id="iqTan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a5f30"/><stop offset=".4" stop-color="#d6b779"/><stop offset="1" stop-color="#6b5229"/></linearGradient>' +
    '<linearGradient id="iqClear" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c7d3d9" stop-opacity=".25"/><stop offset=".35" stop-color="#ffffff" stop-opacity=".55"/><stop offset="1" stop-color="#8ea0a9" stop-opacity=".2"/></linearGradient>' +
    '<radialGradient id="iqBg" cx=".45" cy=".42" r=".8"><stop offset="0" stop-color="#FBF8F2"/><stop offset=".65" stop-color="#EDE6D8"/><stop offset="1" stop-color="#D9CFBD"/></radialGradient>' +
    '<radialGradient id="iqIn" cx=".45" cy=".4" r=".75"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E4DCCD"/></radialGradient>' +
    '<radialGradient id="iqLens" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#9fd6f5"/><stop offset=".35" stop-color="#244a66"/><stop offset="1" stop-color="#04090e"/></radialGradient>' +
    '<filter id="iqBlur" x="-10%" y="-300%" width="120%" height="700%"><feGaussianBlur stdDeviation="4.5"/></filter>' +
    '<clipPath id="iqClip"><circle cx="' + IC[0] + '" cy="' + IC[1] + '" r="' + IC[2] + '"/></clipPath>' +
    '</defs>';

  /* ---------- tips: drawn with the very end at x 0, pointing right, shaft axis on y 0 (a 5 mm shaft is 10 units) ---------- */
  function collar() { return cyl(-36, -26, 0, 11, 'iqSteel', 1.5) + line(-31, -5.2, -31, 5.2, '#2d3439', .7, .8); }
  function teeth(x0, x1, y, up) { var s = 'M' + x0 + ' ' + y; for (var x = x0; x < x1; x += 2) s += ' L' + r(x + 1) + ' ' + r(y + (up ? -1.3 : 1.3)) + ' L' + r(x + 2) + ' ' + y; return '<path d="' + s + '" stroke="#30373c" stroke-width=".6" fill="none"/>'; }
  function jaw(len, h, curve, fen, up) {
    /* one jaw from the hinge (x -26) to its nose (x 0), outer edge bulging, inner edge at y 0 */
    var k = up ? -1 : 1, c = curve || 0;
    var d = 'M-26 0 L-26 ' + r(k * h * .7) + ' Q-14 ' + r(k * h * 1.05) + ' ' + r(-len * .25) + ' ' + r(k * h + c * 2) + ' Q-1 ' + r(k * h * .7 + c * 4) + ' 0 ' + r(c * 5) + ' Q-2 ' + r(c * 4.2) + ' -6 ' + r(c * 2.4) + ' L-26 0 Z';
    var s = '<path d="' + d + '" fill="url(#iqSteel)" stroke="#3e464c" stroke-width=".6"/>';
    if (fen) s += '<rect x="-19" y="' + r(up ? -h * .72 : h * .22) + '" width="10" height="' + r(h * .5) + '" rx="' + r(h * .25) + '" fill="#15120e" stroke="#59626a" stroke-width=".4"/>';
    return s + teeth(-22, -5, 0, !up);
  }
  function hinge(open, up, lo) { return '<g transform="rotate(' + r(-open) + ' -26 0)">' + up + '</g><g transform="rotate(' + r(open) + ' -26 0)">' + lo + '</g><circle cx="-24" cy="0" r="1.6" fill="#59636b" stroke="#2a3035" stroke-width=".5"/>'; }
  var TIPS = {
    grasp: function () { return hinge(9, jaw(26, 5.2, 0, true, true), jaw(26, 5.2, 0, true, false)) + collar(); },
    maryland: function () {
      var up = '<path d="M-26 0 L-26 -4.6 Q-12 -6 -4 -9 Q1 -11 2 -15 Q3 -12 0 -8 Q-5 -3 -10 -1.4 L-26 0 Z" fill="url(#iqSteel)" stroke="#3e464c" stroke-width=".6"/>' + teeth(-22, -10, -.4, false);
      var lo = '<path d="M-26 0 L-26 4.4 Q-14 4 -8 1.4 Q-2 -2 1 -8 Q1 -4 -3 0 Q-10 4.4 -26 0 Z" fill="url(#iqSteel)" stroke="#3e464c" stroke-width=".6"/>';
      return hinge(5, up, lo) + collar();
    },
    scis: function () {
      var bl = function (up) { var k = up ? -1 : 1; return '<path d="M-26 0 L-26 ' + 4.6 * k + ' Q-12 ' + 4.2 * k + ' -4 ' + (k * 2.2 - 3) + ' Q0 ' + (k * 1 - 6.5) + ' 2 -8 Q-4 ' + (k * .2 - 3.5) + ' -26 0 Z" fill="url(#iqSteel)" stroke="#3e464c" stroke-width=".6"/>' + line(-22, k * 1.6, -4, k * .4 - 3, '#ffffff', .6, .7); };
      return hinge(8, bl(true), bl(false)) + collar();
    },
    hook: function () {
      return cyl(-40, -14, 0, 8, 'iqBlack', 1.5) + '<path d="M-15 -2 L-3 -2 Q-.5 -2 -.5 -4.5 L-.5 -12 Q-.5 -14 1.5 -14 Q3.5 -14 3.5 -12 L3.5 -1.5 Q3.5 2 0 2 L-15 2 Z" fill="url(#iqSteel)" stroke="#3e464c" stroke-width=".6"/>' + line(-14, -3.2, -14, 3.2, '#c9a93a', 1.2, .9);
    },
    clip: function () {
      var j = function (up) { var k = up ? -1 : 1; return '<path d="M-30 0 L-30 ' + 6.8 * k + ' L-4 ' + 6 * k + ' Q-1 ' + 5.8 * k + ' -1 ' + 3.6 * k + ' L-1 ' + 2.6 * k + ' L-30 ' + 2.2 * k + ' Z" fill="url(#iqBlack)" stroke="#111" stroke-width=".6"/>'; };
      var clip = '<path d="M-24 -2.4 L-1 -2.4 Q2.6 -2.4 2.6 0 Q2.6 2.4 -1 2.4 L-24 2.4" stroke="#8b9399" stroke-width="2.4" fill="none"/><path d="M-24 -2.4 L-1 -2.4 Q2.6 -2.4 2.6 0 Q2.6 2.4 -1 2.4 L-24 2.4" stroke="#f4f6f7" stroke-width="1" fill="none"/>' + [-18, -12, -6].map(function (x) { return line(x, -3.2, x, -1.6, '#6c7277', .5) + line(x, 1.6, x, 3.2, '#6c7277', .5); }).join('');
      return '<g transform="rotate(-5 -30 0)">' + j(true) + '</g><g transform="rotate(5 -30 0)">' + j(false) + '</g>' + clip + cyl(-42, -30, 0, 15, 'iqSteel', 1.5);
    },
    suct: function () {
      return '<path d="M-44 -5 L-3 -5 Q0 -5 0 0 Q0 5 -3 5 L-44 5 Z" fill="url(#iqSteel)" stroke="#3e464c" stroke-width=".5"/>' +
        [-8, -16, -24].map(function (x) { return '<ellipse cx="' + x + '" cy="-1" rx="2.2" ry="1.6" fill="#0d0f10" stroke="#59636b" stroke-width=".4"/>'; }).join('') +
        '<ellipse cx="-.6" cy="0" rx=".9" ry="3" fill="#0d0f10"/>';
    },
    trocar: function () {
      /* cannula end with a fixation rib, and the clear bladeless obturator tip */
      return '<path d="M-24 -13 L-46 -13 L-46 13 L-28 13 Z" fill="url(#iqBlack)"/>' +
        '<path d="M-27 -10 Q-8 -8 0 0 Q-8 8 -27 10 Z" fill="url(#iqClear)" stroke="#aebcc4" stroke-width=".8"/>' + line(-22, -6, -6, -2.2, '#ffffff', .7, .8) + line(-22, 6, -10, 3, '#5d6b73', .6, .6);
    },
    veress: function () {
      return '<path d="M-44 -2.6 L-12 -2.6 L0 0 L-12 2.6 L-44 2.6 Z" fill="url(#iqSteel)" stroke="#3e464c" stroke-width=".4"/>' +
        '<path d="M-12 -2.6 L0 0" stroke="#ffffff" stroke-width=".5"/>' +
        '<path d="M-14 -1.3 L-3 -1.3 Q-1.2 -1.3 -1.2 0 Q-1.2 1.3 -3 1.3 L-14 1.3 Z" fill="#c7ced3" stroke="#59636b" stroke-width=".35"/><ellipse cx="-6" cy="-.4" rx="1.3" ry=".7" fill="#0d0f10"/>';
    },
    scope: function () {
      return '<path d="M-44 -6 L-3.5 -6 L3.5 6 L-44 6 Z" fill="url(#iqSteel)" stroke="#3e464c" stroke-width=".5"/>' +
        '<path d="M-3.5 -6 L3.5 6" stroke="#20262b" stroke-width="1.4"/>' +
        '<ellipse cx="0" cy="0" rx="1.6" ry="4.6" transform="rotate(-30 0 0)" fill="url(#iqLens)"/>' +
        '<path d="M-2.6 -4.6 L-1.8 -3.2 M2.3 3.6 L2.9 4.6" stroke="#f3e6b8" stroke-width=".9"/>';
    },
    stapler: function () {
      var slots = ''; for (var i = 0; i < 14; i++) { var x = -86 + i * 5.4; slots += line(x, 2.6, x + 2.4, 2.6, '#3a2c14', .7, .8); }
      return '<path d="M-96 -9 L-6 -6.5 Q0 -6 1 -3.4 L-96 -2 Z" fill="url(#iqSteel)" stroke="#3e464c" stroke-width=".6"/>' +
        '<path d="M-96 1 L-3 1 Q2 1.5 2 5 Q2 9 -5 9.5 L-96 10.5 Z" fill="url(#iqTan)" stroke="#5a4522" stroke-width=".6"/>' + slots +
        '<path d="M2 -3.4 Q6 -2 6.5 1 Q6 3.4 2 5" fill="url(#iqSteel)" stroke="#3e464c" stroke-width=".5"/>' + cyl(-108, -96, 0, 18, 'iqBlack', 2);
    },
    sealer: function () {
      var up = '<path d="M-28 0 L-28 -4.6 Q-12 -5.4 -4 -4 Q1 -3 2 -.8 L-28 -.8 Z" fill="url(#iqSteel)" stroke="#3e464c" stroke-width=".6"/>';
      var lo = '<path d="M-28 0 L-28 4.2 Q-12 4.4 -3 3 Q1 2.2 2 .8 L-28 .8 Z" fill="#e9e4d8" stroke="#8e887b" stroke-width=".6"/>' + line(-26, 1.6, -3, 1.6, '#bdb6a6', .5, .9);
      return '<g transform="rotate(-4 -28 0)">' + up + '</g><g transform="rotate(4 -28 0)">' + lo + '</g>' + cyl(-40, -27, 0, 11, 'iqBlack', 1.5);
    }
  };

  /* ---------- handles ---------- */
  function ringHandle(post) {
    var s = arm('M150 ' + (Y + 8) + ' C148 ' + (Y + 30) + ' 136 ' + (Y + 42) + ' 128 ' + (Y + 52), 12) + ring(120, Y + 66, 16, 9) +
      arm('M140 ' + (Y + 6) + ' C122 ' + (Y + 14) + ' 96 ' + (Y + 24) + ' 80 ' + (Y + 36), 11) + ring(66, Y + 48, 16, 9) +
      '<path d="M98 ' + (Y + 42) + ' L126 ' + (Y + 34) + '" stroke="#2a3035" stroke-width="3"/>' + line(100, Y + 41.4, 124, Y + 34.4, '#6b7782', .7, .8);
    s += '<rect x="128" y="' + (Y - 14) + '" width="50" height="28" rx="9" fill="url(#iqPlast)"/>' + line(134, Y - 10.5, 172, Y - 10.5, '#b7c2cb', 1, .5);
    s += '<rect x="178" y="' + (Y - 18) + '" width="24" height="36" rx="6" fill="url(#iqPlast)"/>' + ridges(178, 202, Y, 36, 3);
    s += '<path d="M202 ' + (Y - 12) + ' L216 ' + (Y - 6) + ' L216 ' + (Y + 6) + ' L202 ' + (Y + 12) + ' Z" fill="url(#iqPlast)"/>';
    if (post) s += '<rect x="146" y="' + (Y - 27) + '" width="8" height="14" rx="2" fill="url(#iqGold)"/><rect x="144" y="' + (Y - 16) + '" width="12" height="3" rx="1" fill="#2a3035"/>';
    return s;
  }
  function pistol(o) {
    o = o || {};
    var b = o.big ? 1.06 : 1;
    var body = '<path d="M116 ' + (Y - 17) + ' L232 ' + (Y - 17) + ' Q242 ' + (Y - 17) + ' 242 ' + (Y - 7) + ' L242 ' + (Y + 9) + ' Q242 ' + (Y + 17) + ' 233 ' + (Y + 18) + ' L168 ' + (Y + 21) + ' L152 ' + (Y + 80) + ' Q148 ' + (Y + 90) + ' 136 ' + (Y + 88) + ' L122 ' + (Y + 84) + ' Q112 ' + (Y + 80) + ' 115 ' + (Y + 68) + ' L127 ' + (Y + 18) + ' L118 ' + (Y + 14) + ' Q108 ' + (Y + 8) + ' 110 ' + (Y - 6) + ' Q112 ' + (Y - 17) + ' 116 ' + (Y - 17) + ' Z" fill="url(#iqPlast)" stroke="#161a1e" stroke-width="1"/>';
    var grip = '<path d="M131 ' + (Y + 24) + ' L160 ' + (Y + 26) + ' L148 ' + (Y + 78) + ' Q145 ' + (Y + 84) + ' 137 ' + (Y + 83) + ' L126 ' + (Y + 80) + ' Q119 ' + (Y + 77) + ' 121 ' + (Y + 69) + ' Z" fill="url(#iqGrip)"/>';
    for (var i = 0; i < 6; i++) grip += line(130 - i * 1.6, Y + 34 + i * 8, 154 - i * 1.4, Y + 36 + i * 8, '#0b0d0f', 1, .6);
    var trig = '<path d="M180 ' + (Y + 22) + ' Q197 ' + (Y + 40) + ' 191 ' + (Y + 70) + ' Q188 ' + (Y + 81) + ' 177 ' + (Y + 78) + ' Q182 ' + (Y + 52) + ' 170 ' + (Y + 23) + ' Z" fill="url(#iqGrip)" stroke="#0e1113" stroke-width=".8"/>' + line(181, Y + 30, 189, Y + 62, '#68737d', 1, .6);
    var top = line(120, Y - 13, 232, Y - 13, '#c2ccd4', 1.2, .45);
    var nose = '<rect x="242" y="' + (Y - 15) + '" width="22" height="30" rx="5" fill="url(#iqPlast)"/>' + ridges(242, 264, Y, 30, 3) + '<path d="M264 ' + (Y - 10) + ' L276 ' + (Y - 6) + ' L276 ' + (Y + 6) + ' L264 ' + (Y + 10) + ' Z" fill="url(#iqPlast)"/>';
    var extra = '';
    if (o.buttons) extra += '<rect x="200" y="' + (Y + 16) + '" width="14" height="7" rx="3" fill="#8f949a" stroke="#2a3035" stroke-width=".6"/><rect x="216" y="' + (Y + 15) + '" width="14" height="7" rx="3" fill="#6d7379" stroke="#2a3035" stroke-width=".6"/>' + '<path d="M118 ' + (Y + 2) + ' C90 ' + (Y + 6) + ' 60 ' + (Y + 30) + ' 0 ' + (Y + 40) + '" stroke="#8e979c" stroke-width="5" fill="none"/><path d="M118 ' + (Y + 1) + ' C90 ' + (Y + 5) + ' 60 ' + (Y + 29) + ' 0 ' + (Y + 39) + '" stroke="#eef2f3" stroke-width="1.4" fill="none"/>';
    if (o.big) extra += '<path d="M236 ' + (Y - 17) + ' L246 ' + (Y - 32) + ' L256 ' + (Y - 32) + ' L252 ' + (Y - 15) + ' Z" fill="url(#iqPlast)" stroke="#161a1e" stroke-width=".8"/>' + '<rect x="196" y="' + (Y - 13) + '" width="26" height="10" rx="3" fill="#2a3138"/>' + line(200, Y - 8, 218, Y - 8, '#7d8892', .8, .8);
    if (o.clip) extra += '<rect x="198" y="' + (Y - 12) + '" width="30" height="8" rx="3" fill="#2a3138"/>' + [0, 1, 2, 3, 4].map(function (k) { return '<rect x="' + (201 + k * 5) + '" y="' + (Y - 10.5) + '" width="3" height="5" rx="1" fill="url(#iqTi)"/>'; }).join('');
    var g = body + grip + trig + top + nose + extra;
    return b === 1 ? g : '<g transform="translate(' + r(276 - 276 * b) + ' ' + r(Y - Y * b) + ') scale(' + b + ')">' + g + '</g>';
  }

  /* ---------- the plates ---------- */
  function shaft(x0, x1, d, fill) { d = d || 10; return cyl(x0, x1, Y, d, fill || 'iqBlack', 1.5) + line(x0 + 4, Y - d * .2, x1 - 4, Y - d * .2, '#ffffff', .6, .18); }
  function tipAt(id, k) { return '<g transform="translate(' + TX + ' ' + Y + ') scale(' + (k || 1) + ')">' + TIPS[id]() + '</g>'; }
  function inset(id, s, cx) {
    var x = IC[0] - (cx || -18) * s, y = IC[1];
    return '<path d="M' + (TX - 6) + ' ' + (Y - 8) + ' L' + r(IC[0] + IC[2] * .62) + ' ' + r(IC[1] + IC[2] * .78) + '" stroke="#9A7B4F" stroke-width=".9" opacity=".8"/>' +
      '<g clip-path="url(#iqClip)"><circle cx="' + IC[0] + '" cy="' + IC[1] + '" r="' + IC[2] + '" fill="url(#iqIn)"/><g transform="translate(' + r(x) + ' ' + y + ') scale(' + s + ')">' + TIPS[id]() + '</g></g>' +
      '<circle cx="' + IC[0] + '" cy="' + IC[1] + '" r="' + IC[2] + '" fill="none" stroke="#9A7B4F" stroke-width="1.3"/><circle cx="' + IC[0] + '" cy="' + IC[1] + '" r="' + (IC[2] + 3) + '" fill="none" stroke="#9A7B4F" stroke-width=".5" opacity=".6"/>';
  }
  var PLATES = {
    grasp: function () { return shadow(60, 600, Y + 18, 10) + ringHandle(true) + shaft(214, TX - 30) + tipAt('grasp') + inset('grasp', 2.6, -17); },
    maryland: function () { return shadow(60, 600, Y + 18, 10) + ringHandle(true) + shaft(214, TX - 30) + tipAt('maryland') + inset('maryland', 2.6, -14); },
    scis: function () { return shadow(60, 600, Y + 18, 10) + ringHandle(true) + shaft(214, TX - 30) + tipAt('scis') + inset('scis', 2.6, -14); },
    hook: function () {
      return shadow(40, 600, Y + 16, 10) + '<path d="M78 ' + (Y + 2) + ' C50 ' + (Y + 8) + ' 30 ' + (Y + 30) + ' 0 ' + (Y + 46) + '" stroke="#8e979c" stroke-width="5" fill="none"/><path d="M78 ' + (Y + 1) + ' C50 ' + (Y + 7) + ' 30 ' + (Y + 29) + ' 0 ' + (Y + 45) + '" stroke="#eef2f3" stroke-width="1.3" fill="none"/>' +
        cyl(70, 86, Y, 12, 'iqPlast', 4) + cyl(84, 232, Y, 22, 'iqPlast', 11) + line(96, Y - 7, 222, Y - 7, '#c2ccd4', 1.2, .4) +
        '<rect x="160" y="' + (Y - 15) + '" width="18" height="7" rx="3" fill="#c9a93a" stroke="#4a3d14" stroke-width=".6"/><rect x="184" y="' + (Y - 15) + '" width="18" height="7" rx="3" fill="#2c6e8f" stroke="#12303f" stroke-width=".6"/>' +
        '<path d="M232 ' + (Y - 9) + ' L246 ' + (Y - 4) + ' L246 ' + (Y + 4) + ' L232 ' + (Y + 9) + ' Z" fill="url(#iqPlast)"/>' + cyl(244, TX - 30, Y, 8, 'iqBlack', 1.5) + tipAt('hook') + inset('hook', 2.8, -10);
    },
    clip: function () { return shadow(80, 600, Y + 18, 12) + pistol({ clip: true }) + shaft(276, TX - 40, 15) + tipAt('clip') + inset('clip', 2.3, -18); },
    suct: function () {
      var hose = function (y0, y1) { return '<path d="M128 ' + y0 + ' C100 ' + y0 + ' 60 ' + y1 + ' 0 ' + (y1 + 10) + '" stroke="#7f949d" stroke-width="9" fill="none" opacity=".55"/><path d="M128 ' + (y0 - 2) + ' C100 ' + (y0 - 2) + ' 60 ' + (y1 - 2) + ' 0 ' + (y1 + 8) + '" stroke="#ffffff" stroke-width="1.2" fill="none" opacity=".45"/>'; };
      return shadow(40, 600, Y + 16, 10) + hose(Y + 4, Y + 46) + hose(Y - 4, Y + 26) +
        '<rect x="120" y="' + (Y - 14) + '" width="118" height="28" rx="8" fill="url(#iqPlast)"/>' + line(126, Y - 10, 232, Y - 10, '#c2ccd4', 1.2, .4) +
        '<rect x="148" y="' + (Y - 40) + '" width="16" height="28" rx="4" fill="url(#iqPlast)"/><rect x="146" y="' + (Y - 46) + '" width="20" height="9" rx="4" fill="#8a3b2e"/>' +
        '<rect x="190" y="' + (Y - 40) + '" width="16" height="28" rx="4" fill="url(#iqPlast)"/><rect x="188" y="' + (Y - 46) + '" width="20" height="9" rx="4" fill="#2C5F6E"/>' +
        '<path d="M238 ' + (Y - 10) + ' L252 ' + (Y - 5) + ' L252 ' + (Y + 5) + ' L238 ' + (Y + 10) + ' Z" fill="url(#iqPlast)"/>' + cyl(250, TX - 40, Y, 10, 'iqSteel', 1.5) + tipAt('suct') + inset('suct', 2.4, -18);
    },
    trocar: function () {
      var ribs = ''; for (var x = 384; x < 520; x += 7) ribs += line(x, Y - 12, x + 3, Y + 12, '#0a0b0c', 1.4, .8) + line(x + 1, Y - 12, x + 4, Y + 12, '#6f7881', .5, .5);
      return shadow(130, 600, Y + 22, 12) +
        '<path d="M150 ' + (Y - 18) + ' Q132 ' + (Y - 18) + ' 132 ' + Y + ' Q132 ' + (Y + 18) + ' 150 ' + (Y + 18) + ' L176 ' + (Y + 18) + ' L176 ' + (Y - 18) + ' Z" fill="url(#iqPlast)"/>' + line(138, Y - 10, 172, Y - 10, '#c2ccd4', 1, .45) +
        cyl(176, 292, Y, 48, 'iqPlast', 9) + '<rect x="184" y="' + (Y - 20) + '" width="100" height="40" rx="6" fill="url(#iqClear)" opacity=".5"/>' + line(186, Y - 15, 282, Y - 15, '#e2e8ec', 1.2, .5) +
        '<rect x="246" y="' + (Y - 40) + '" width="12" height="18" rx="2" fill="url(#iqSteel)"/><path d="M236 ' + (Y - 44) + ' L270 ' + (Y - 44) + ' Q274 ' + (Y - 44) + ' 274 ' + (Y - 40) + ' L274 ' + (Y - 38) + ' L236 ' + (Y - 38) + ' Z" fill="#2C5F6E"/>' +
        '<path d="M292 ' + (Y - 20) + ' L312 ' + (Y - 13) + ' L312 ' + (Y + 13) + ' L292 ' + (Y + 20) + ' Z" fill="url(#iqPlast)"/>' + cyl(312, TX - 46, Y, 26, 'iqBlack', 2) + ribs + tipAt('trocar') + inset('trocar', 1.9, -23);
    },
    veress: function () {
      var spring = 'M168 ' + Y; for (var i = 0; i < 9; i++) spring += ' L' + (172 + i * 5) + ' ' + (Y + (i % 2 ? 5 : -5));
      return shadow(80, 600, Y + 14, 8) +
        '<rect x="96" y="' + (Y - 6) + '" width="24" height="12" rx="3" fill="url(#iqSteel)"/><path d="M104 ' + (Y - 6) + ' L104 ' + (Y - 22) + ' L112 ' + (Y - 22) + ' L112 ' + (Y - 6) + ' Z" fill="#2C5F6E"/>' +
        cyl(120, 226, Y, 26, 'iqPlast', 8) + '<rect x="160" y="' + (Y - 8) + '" width="56" height="16" rx="3" fill="url(#iqClear)" stroke="#9fb0b8" stroke-width=".5"/><path d="' + spring + '" stroke="#e2e8ec" stroke-width="1.3" fill="none"/>' +
        '<path d="M226 ' + (Y - 8) + ' L240 ' + (Y - 3) + ' L240 ' + (Y + 3) + ' L226 ' + (Y + 8) + ' Z" fill="url(#iqPlast)"/>' + cyl(240, TX - 44, Y, 5.2, 'iqSteel', 1) + tipAt('veress') + inset('veress', 3.1, -14);
    },
    scope: function () {
      return shadow(50, 600, Y + 16, 10) +
        '<path d="M58 ' + (Y - 22) + ' L96 ' + (Y - 13) + ' L96 ' + (Y + 13) + ' L58 ' + (Y + 22) + ' Q52 ' + Y + ' 58 ' + (Y - 22) + ' Z" fill="url(#iqGrip)"/><ellipse cx="58" cy="' + Y + '" rx="4" ry="21" fill="#0b0d0f" stroke="#3c444b" stroke-width="1"/>' +
        cyl(96, 176, Y, 26, 'iqSteel', 5) + line(104, Y - 4, 168, Y - 4, '#ffffff', 1.2, .5) +
        cyl(148, 160, Y - 24, 22, 'iqSteel', 2) + '<rect x="144" y="' + (Y - 44) + '" width="20" height="9" rx="2" fill="url(#iqSteel)"/><rect x="146" y="' + (Y - 47) + '" width="16" height="4" rx="1.5" fill="#2a3035"/>' +
        '<path d="M176 ' + (Y - 10) + ' L190 ' + (Y - 6) + ' L190 ' + (Y + 6) + ' L176 ' + (Y + 10) + ' Z" fill="url(#iqSteel)"/>' + cyl(190, TX - 44, Y, 12, 'iqSteel', 1.5) + tipAt('scope') + inset('scope', 3.2, -12);
    },
    stapler: function () { return shadow(80, 600, Y + 20, 14) + pistol({ big: true }) + shaft(282, TX - 108, 18) + tipAt('stapler') + inset('stapler', 1.15, -46); },
    sealer: function () { return shadow(80, 600, Y + 18, 12) + pistol({ buttons: true }) + shaft(276, TX - 40, 11) + tipAt('sealer') + inset('sealer', 2.5, -14); },
    bag: function () {
      return shadow(40, 600, Y + 40, 14) + ring(60, Y, 13, 7) + cyl(72, 160, Y, 6, 'iqSteel', 1) + cyl(160, 176, Y, 22, 'iqPlast', 4) + cyl(176, 390, Y, 16, 'iqBlack', 2) +
        '<path d="M390 ' + (Y - 4) + ' Q470 ' + (Y - 56) + ' 556 ' + (Y - 40) + ' Q612 ' + (Y - 26) + ' 610 ' + (Y + 6) + ' Q604 ' + (Y + 52) + ' 530 ' + (Y + 64) + ' Q450 ' + (Y + 70) + ' 392 ' + (Y + 6) + ' Z" fill="url(#iqClear)" stroke="#b7c6cd" stroke-width="1.2"/>' +
        '<path d="M392 ' + (Y - 3) + ' Q480 ' + (Y - 50) + ' 560 ' + (Y - 36) + '" stroke="url(#iqSteel)" stroke-width="2.6" fill="none"/>' +
        '<path d="M430 ' + (Y + 30) + ' Q500 ' + (Y + 52) + ' 580 ' + (Y + 26) + '" stroke="#ffffff" stroke-width="1" fill="none" opacity=".35"/>' +
        '<path d="M176 ' + (Y + 3) + ' L394 ' + (Y + 3) + '" stroke="#e9e4d8" stroke-width="1" stroke-dasharray="1 0"/>';
    }
  };

  O.instrSvg = function (id, label) {
    var p = PLATES[id]; if (!p) return '';
    return '<svg viewBox="0 0 640 200" class="eqart iq" role="img" aria-label="' + String(label || id).replace(/"/g, '') + '" xmlns="http://www.w3.org/2000/svg">' + DEFS +
      '<rect width="640" height="200" fill="url(#iqBg)"/>' + p() + '</svg>';
  };
})();
