/* ORBIT moves: short looping animations of the basic surgical maneuvers (Skills Lab).
   Every frame is a function of t (0..1), drawn as SVG in a laparoscopic view (viewBox 0 0 480 300,
   camera at the umbilicus: liver on top, patient's right on the viewer's LEFT).
   Original drawings, schematic, no patient material. */
(function () {
  'use strict';
  var O = window.ORBIT, A = O.art;
  var esc = A.esc;
  var M = O.moves = {};
  var LIST = O.moveList = [];

  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function seg(t, a, b) { return clamp((t - a) / (b - a)); }
  function ease(x) { x = clamp(x); return x * x * (3 - 2 * x); }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function r1(x) { return Math.round(x * 10) / 10; }
  function pt(p) { return r1(p[0]) + ' ' + r1(p[1]); }
  function add(p, q, k) { return [p[0] + q[0] * (k == null ? 1 : k), p[1] + q[1] * (k == null ? 1 : k)]; }

  var DEFS = '<defs>' +
    '<radialGradient id="mvV" cx="50%" cy="48%" r="64%"><stop offset="62%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".88"/></radialGradient>' +
    '<linearGradient id="mvLiv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7E3127"/><stop offset=".75" stop-color="#9C4636"/><stop offset="1" stop-color="#B85A46"/></linearGradient>' +
    '<linearGradient id="mvBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C79A57"/><stop offset="1" stop-color="#8E5B36"/></linearGradient>' +
    '<radialGradient id="mvGb" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#A9BE7E"/><stop offset=".6" stop-color="#6F8A4C"/><stop offset="1" stop-color="#4A6234"/></radialGradient>' +
    '<linearGradient id="mvDu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0A08C"/><stop offset="1" stop-color="#B9705E"/></linearGradient>' +
    '<linearGradient id="mvMt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2F5F7"/><stop offset=".45" stop-color="#9AA5AD"/><stop offset="1" stop-color="#5E6870"/></linearGradient>' +
    '<linearGradient id="mvBk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A535A"/><stop offset=".5" stop-color="#22282D"/><stop offset="1" stop-color="#121619"/></linearGradient>' +
    '<radialGradient id="mvSp"><stop offset="0" stop-color="#FFFBE8"/><stop offset=".35" stop-color="#FFE38A" stop-opacity=".9"/><stop offset="1" stop-color="#FFB13B" stop-opacity="0"/></radialGradient>' +
    '<filter id="mvSh" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4"/></filter>' +
    '</defs>';

  /* ---------- the hepatocystic scene ---------- */
  /* o: fx,fy fundus shift; nx,ny neck shift; tri 0..1 triangle opened; mem 0..1 peritoneum present;
        lift [x,y] point the peritoneum is lifted to; split 0..1 peritoneum divided; clips [k along duct]; cut k */
  var F0 = [150, 104], N0 = [284, 170], J = [374, 206];
  function duct(E, k) { var c = [lerp(E[0], J[0], .5), lerp(E[1], J[1], .5) + 12]; var u = 1 - k; return [u * u * E[0] + 2 * u * k * c[0] + k * k * J[0], u * u * E[1] + 2 * u * k * c[1] + k * k * J[1]]; }
  function scene(o) {
    o = o || {};
    var F = [F0[0] + (o.fx || 0), F0[1] + (o.fy || 0)], N = [N0[0] + (o.nx || 0), N0[1] + (o.ny || 0)];
    var dx = N[0] - F[0], dy = N[1] - F[1], L = Math.sqrt(dx * dx + dy * dy), u = [dx / L, dy / L], v = [-u[1], u[0]];
    var E = add(N, u, 18);
    var C = add(F, u, L * .28), rx = L * .42 + 24, ry = 34, ang = Math.atan2(u[1], u[0]) * 180 / Math.PI;
    var nk0 = add(C, u, rx * .55);
    var neck = 'M' + pt(add(nk0, v, 30)) + ' Q' + pt(add(add(N, u, -10), v, 20)) + ' ' + pt(add(N, v, 12)) + ' Q' + pt(add(E, v, 5)) + ' ' + pt(E) + ' Q' + pt(add(E, v, -5)) + ' ' + pt(add(N, v, -12)) + ' Q' + pt(add(add(N, u, -10), v, -20)) + ' ' + pt(add(nk0, v, -30)) + ' Z';
    var gb = '<path d="' + neck + '" fill="#62804A" stroke="#3E5229" stroke-width="1.2"/><ellipse cx="' + r1(C[0]) + '" cy="' + r1(C[1]) + '" rx="' + r1(rx) + '" ry="' + ry + '" transform="rotate(' + r1(ang) + ' ' + pt(C).replace(' ', ' ') + ')" fill="url(#mvGb)" stroke="#3E5229" stroke-width="1.2"/>';
    var dc = [lerp(E[0], J[0], .5), lerp(E[1], J[1], .5) + 12];
    var ductD = 'M' + pt(E) + ' Q' + pt(dc) + ' ' + pt(J);
    var s = '<rect width="480" height="300" fill="url(#mvBg)"/>' +
      '<path d="M0 230 C90 214 190 238 300 222 C380 210 440 226 480 220 V300 H0 Z" fill="#7A4A2E" opacity=".45"/>' +
      '<path d="M300 300 C318 258 404 246 480 258 V300 Z" fill="url(#mvDu)"/><path d="M318 290 C340 262 410 254 480 264" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="3"/>' +
      '<path d="M388 70 C384 140 380 210 376 300" fill="none" stroke="#C9AE62" stroke-width="15" stroke-linecap="round"/><path d="M384 76 C381 150 377 220 373 300" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="3"/>' +
      '<path d="M436 96 C410 120 380 140 ' + pt(add(N, v, 12)) + '" fill="none" stroke="#A8302A" stroke-width="5" stroke-linecap="round"/>';
    var lift = o.lift || [0, 0];
    s += '<path d="M0 0 H480 V64 C420 ' + r1(92 + lift[1] * .3) + ' 340 78 270 ' + r1(90 + (o.fy || 0) * .35) + ' C200 ' + r1(104 + (o.fy || 0) * .5) + ' 110 118 0 110 Z" fill="url(#mvLiv)"/>' +
      '<path d="M0 106 C110 114 200 100 270 86" fill="none" stroke="#fff" stroke-opacity=".13" stroke-width="3"/>';
    if (o.tri) s += '<path d="M' + pt([N[0] + 10, 92]) + ' L' + pt([386, 86]) + ' L' + pt(J) + ' Q' + pt(dc) + ' ' + pt(E) + ' Z" fill="#B08A45" fill-opacity="' + r1(.32 * o.tri * 10) / 10 + '" stroke="#D9C79E" stroke-opacity="' + r1(o.tri * 10) / 10 + '" stroke-dasharray="5 4" stroke-width="1.6"/>';
    if (o.cut != null) {
      var c1 = duct(E, o.cut - .06), c2 = duct(E, o.cut + .06);
      s += '<path d="M' + pt(E) + ' L' + pt(c1) + '" stroke="#C9AE62" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M' + pt(c2) + ' Q' + pt(dc) + ' ' + pt(J) + '" stroke="#C9AE62" stroke-width="9" stroke-linecap="round" fill="none"/>';
    } else s += '<path d="' + ductD + '" stroke="#C9AE62" stroke-width="9" stroke-linecap="round" fill="none"/><path d="' + ductD + '" stroke="#fff" stroke-opacity=".22" stroke-width="2" fill="none"/>';
    s += gb +
      '<path d="M' + pt(add(add(F, v, 22), u, -8)) + ' Q' + pt(add(add(F, u, L * .4), v, 22)) + ' ' + pt(add(add(N, v, 7), u, -18)) + '" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="5" stroke-linecap="round"/>';
    if (o.mem) {
      var m0 = add(add(N, v, 10), u, 6), m1 = [N[0] + 34, 96], mid = [lerp(m0[0], m1[0], .5) + 6, lerp(m0[1], m1[1], .5)];
      var pull = o.lift ? [mid[0] + lift[0], mid[1] + lift[1]] : mid;
      if (o.split > 0) {
        var g = 10 + o.split * 22;
        s += '<path d="M' + pt(m0) + ' Q' + pt([pull[0] - 4, pull[1] + g * .6]) + ' ' + pt([pull[0] - g * .4, pull[1] + g * .5]) + '" fill="none" stroke="#F8EBDD" stroke-opacity=".75" stroke-width="2.4"/>' +
          '<path d="M' + pt(m1) + ' Q' + pt([pull[0] + 4, pull[1] - g * .6]) + ' ' + pt([pull[0] + g * .4, pull[1] - g * .5]) + '" fill="none" stroke="#F8EBDD" stroke-opacity=".75" stroke-width="2.4"/>';
      } else s += '<path d="M' + pt(m0) + ' Q' + pt(pull) + ' ' + pt(m1) + '" fill="#F8EBDD" fill-opacity=".12" stroke="#F8EBDD" stroke-opacity="' + r1(.75 * o.mem * 10) / 10 + '" stroke-width="2.4"/>';
    }
    (o.clips || []).forEach(function (k) {
      var p = duct(E, k), q = duct(E, k + .02), a = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI;
      s += '<g transform="translate(' + pt(p) + ') rotate(' + r1(a) + ')"><rect x="-2.6" y="-13" width="5.2" height="26" rx="2" fill="url(#mvMt)" stroke="#4A545B" stroke-width=".6"/></g>';
    });
    return { svg: s, F: F, N: N, E: E, tipF: add(C, u, -rx + 12), u: u, v: v, duct: function (k) { return duct(E, k); } };
  }

  /* ---------- instruments ---------- */
  /* tool(kind, entry, tip, open 0..1, extra): shaft from the entry point to the tip, jaws at the tip */
  function tool(kind, e, tp, open, x) {
    x = x || {};
    var dx = tp[0] - e[0], dy = tp[1] - e[1], L = Math.sqrt(dx * dx + dy * dy) + 40, a = Math.atan2(dy, dx) * 180 / Math.PI, op = (open || 0);
    var dark = kind === 'hook' || kind === 'scis';
    var shaft = '<rect x="' + r1(-L) + '" y="-6.5" width="' + r1(L - 16) + '" height="13" rx="2" fill="url(#' + (dark ? 'mvBk' : 'mvMt') + ')"/><rect x="-20" y="-7.5" width="5" height="15" rx="1" fill="#3B4349"/>';
    var j = '';
    if (kind === 'grasp' || kind === 'clip') {
      var w = kind === 'clip' ? 6 : 4.5, len = kind === 'clip' ? 20 : 17, ang = op * (kind === 'clip' ? 16 : 26);
      var up = '<path d="M-15 0 L-15 ' + -w + ' L' + (len - 4) + ' ' + -w + ' Q' + len + ' ' + -w + ' ' + len + ' -1 L-15 -1 Z" fill="url(#mvMt)" stroke="#525C63" stroke-width=".6"/>' + (kind === 'grasp' ? '<rect x="-4" y="' + (-w + 1.4) + '" width="12" height="1.8" rx=".9" fill="#2A3035"/>' : '');
      var lo = up.replace(/-?\d+(\.\d+)? ?(?=[ "LQZ])/g, function (n) { return n; });
      j = '<g transform="translate(-15 0) rotate(' + r1(-ang) + ') translate(15 0)">' + up + '</g><g transform="translate(-15 0) rotate(' + r1(ang) + ') translate(15 0) scale(1 -1)">' + lo + '</g>';
      if (kind === 'clip' && x.loaded) j += '<rect x="' + r1(-6) + '" y="-2.6" width="24" height="5.2" rx="2" fill="#D9DEE2" stroke="#56606A" stroke-width=".6"/>';
    } else if (kind === 'scis') {
      var sa = op * 20;
      var bl = '<path d="M-15 0 L-15 -3.6 L17 -.6 L18 0 Z" fill="url(#mvMt)" stroke="#525C63" stroke-width=".6"/>';
      j = '<g transform="translate(-15 0) rotate(' + r1(-sa) + ') translate(15 0)">' + bl + '</g><g transform="translate(-15 0) rotate(' + r1(sa) + ') translate(15 0) scale(1 -1)">' + bl + '</g>';
    } else if (kind === 'hook') {
      j = '<path d="M-16 -2.2 L6 -2.2 L6 -11 L10.5 -11 L10.5 2.2 L-16 2.2 Z" fill="url(#mvMt)" stroke="#525C63" stroke-width=".6"/>';
    } else if (kind === 'suct') {
      j = '<rect x="-16" y="-5" width="22" height="10" rx="5" fill="url(#mvMt)"/><circle cx="-6" cy="0" r="1.6" fill="#2A3035"/><circle cx="1" cy="0" r="1.6" fill="#2A3035"/>';
    }
    var g = '<g transform="translate(' + pt(tp) + ') rotate(' + r1(a) + ')">' + shaft + j + '</g>';
    var sh = '<g transform="translate(' + pt([tp[0] + 7, tp[1] + 9]) + ') rotate(' + r1(a) + ')" filter="url(#mvSh)" opacity=".35"><rect x="' + r1(-L) + '" y="-6.5" width="' + r1(L) + '" height="13" fill="#000"/></g>';
    return sh + g;
  }
  function spark(p, k) { if (k <= 0) return ''; return '<circle cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="' + r1(10 + 14 * k) + '" fill="url(#mvSp)" opacity="' + r1(k * 10) / 10 + '"/>' + '<circle cx="' + r1(p[0] + 6) + '" cy="' + r1(p[1] - 14 - 20 * k) + '" r="' + r1(5 + 8 * k) + '" fill="#E8E2DA" opacity="' + r1((1 - k) * 4) / 10 + '"/>'; }
  function frame(inner) { return DEFS + inner + '<rect width="480" height="300" fill="url(#mvV)"/>'; }

  O.moveArt = { tool: tool, defs: DEFS };

  /* ---------- registry ---------- */
  function reg(m) { M[m.id] = m; LIST.push(m); }

  reg({
    id: 'fundus', t: 'Push the fundus to the right shoulder', en: 'Fundus retraction', proc: 'lap-chole', lv: ['res', 'senior', 'stu'], dur: 6,
    caps: [[0, 'The grasper reaches the tip of the fundus'], [.2, 'Open and grasp the wall, not the full thickness'], [.4, 'Push over the liver, toward the right shoulder'], [.74, 'Liver and gallbladder lifted: the hilum comes into view'], [.88, 'Release and withdraw']],
    see: ['The grasper comes in through the lateral port, the one farthest from the target.', 'Grasp the tip of the fundus, not the middle of the gallbladder, so it doesn’t tear.'],
    err: 'Weak traction, or traction in the wrong direction, leaves the triangle folded. When the assistant lets go halfway, the landmarks shift without anyone noticing.', refs: [1, 3, 24],
    teach: 'Ask the learner to say where they’re pushing before they push, and stop if the gallbladder is under too much tension.',
    draw: function (t) {
      var k = ease(seg(t, .4, .74)) * (1 - ease(seg(t, .88, 1))), s = scene({ fx: -30 * k, fy: -40 * k });
      var tip = s.tipF, e = [-30, 30], ap = ease(seg(t, 0, .2)) * (1 - ease(seg(t, .92, 1)));
      var tp = [lerp(60, tip[0], ap), lerp(60, tip[1], ap)];
      var op = seg(t, .2, .28) * (1 - seg(t, .3, .36)) + seg(t, .88, .92);
      return frame(s.svg + tool('grasp', e, tp, op));
    }
  });

  reg({
    id: 'hartmann', t: 'Pull Hartmann’s pouch lateral and down', en: 'Lateral traction of Hartmann pouch', proc: 'lap-chole', lv: ['res', 'senior'], dur: 6,
    caps: [[0, 'The fundus is already up'], [.14, 'Grasp Hartmann’s pouch, the gallbladder neck'], [.34, 'Pull lateral and down'], [.6, 'The angle between cystic duct and hepatic duct opens'], [.8, 'The triangle is open and ready for dissection']],
    see: ['Two hands in opposite directions: fundus up, Hartmann’s lateral and down.', 'For the anterior side pull lateral and down; for the posterior side, up and medial.'],
    err: 'Pulling Hartmann’s pouch toward the head lines up the cystic duct and the common duct. That visual illusion is behind most serious injuries: 97% of 252 injuries came from a misperception, not a lack of skill.', refs: [1, 2, 21],
    teach: 'Let the learner try both directions and see for themselves how the triangle closes and opens.',
    draw: function (t) {
      var k = ease(seg(t, .34, .62)) * (1 - ease(seg(t, .92, 1))), s = scene({ fx: -30, fy: -40, nx: -46 * k, ny: 34 * k, tri: ease(seg(t, .5, .8)) * (1 - ease(seg(t, .9, 1))) });
      var tip = add(s.N, s.v, -4), ap = ease(seg(t, 0, .14));
      var tp = [lerp(80, tip[0], ap), lerp(290, tip[1], ap)];
      var op = seg(t, .14, .22) * (1 - seg(t, .24, .3));
      return frame(s.svg + tool('grasp', [-30, 30], s.tipF, 0) + tool('grasp', [-40, 330], tp, op));
    }
  });

  reg({
    id: 'hook', t: 'Hook dissection: lift, look, then energy', en: 'Hook dissection', proc: 'lap-chole', lv: ['res', 'senior'], dur: 6,
    caps: [[0, 'The hook slips under the thin peritoneal layer'], [.28, 'Lift the layer, away from the structures'], [.48, 'Whole hook tip in view? Only then energy, briefly'], [.64, 'The layer opens'], [.82, 'Keep close to the gallbladder']],
    see: ['Start high on the gallbladder, above the line from the base of segment 4 to Rouvière’s sulcus.', 'Lift, see the whole tip, then activate in short bursts at low power.', 'Never activate while the hook touches metal: a clip or another instrument.'],
    err: 'Activating with the tip buried in tissue or out of view, and heat near the common duct. A thermal injury like that shows up only days later.', refs: [5, 17, 25, 26, 27],
    teach: 'Count it together: lift, look, activate. Stop any activation longer than a second.',
    draw: function (t) {
      var lk = ease(seg(t, .2, .44)) * (1 - ease(seg(t, .62, .72))), split = ease(seg(t, .6, .76)) * (1 - ease(seg(t, .95, 1)));
      var s = scene({ fx: -30, fy: -40, nx: -46, ny: 34, tri: .5, mem: 1, lift: [6 * lk, -26 * lk], split: split });
      var m0 = add(add(s.N, s.v, 10), s.u, 6), m1 = [s.N[0] + 34, 96], mid = [lerp(m0[0], m1[0], .5) + 6, lerp(m0[1], m1[1], .5)];
      var ap = ease(seg(t, 0, .2)) * (1 - ease(seg(t, .86, 1)));
      var tip = [lerp(330, mid[0] + 6 + 6 * lk, ap), lerp(-10, mid[1] + 6 - 26 * lk, ap)];
      var sp = seg(t, .48, .54) * (1 - seg(t, .58, .66));
      return frame(s.svg + tool('grasp', [-30, 30], s.tipF, 0) + tool('grasp', [-40, 330], add(s.N, s.v, -4), 0) + tool('hook', [330, -60], tip, 0) + spark([tip[0] - 2, tip[1] - 8], sp));
    }
  });

  reg({
    id: 'clip', t: 'Clip the cystic duct', en: 'Clip application', proc: 'lap-chole', lv: ['res', 'senior', 'nurse'], dur: 7,
    caps: [[0, 'Applier loaded: the clip sits between the jaws'], [.2, 'Perpendicular to the duct, tip beyond it'], [.3, 'Close: first clip, patient side'], [.42, 'Second clip, also patient side'], [.66, 'Third clip, gallbladder side'], [.84, 'Room to cut between the clips']],
    see: ['Clip only after the critical view of safety (CVS) and a short pause to confirm.', 'See both jaw tips beyond the duct, with the clip perpendicular to it.'],
    err: 'A clip on a structure that wasn’t identified with certainty, because it looked like the cystic duct.', refs: [1, 2, 21, 29], conv: 'The number of clips on each side and the spacing are a department default, not an evidence-based recommendation.',
    nurse: 'Load a clip before every pass and check it sits straight between the jaws. Ask ahead: 5 or 10 mm, and which clip size.',
    teach: 'Before every closure the learner says out loud: tip in view, perpendicular, nothing else in the jaws.',
    draw: function (t) {
      var pos = [.72, .56, .26], times = [.3, .54, .78], clips = [];
      times.forEach(function (tt, i) { if (t > tt + .04 && t < .97) clips.push(pos[i]); });
      var s = scene({ fx: -30, fy: -40, nx: -46, ny: 34, tri: .55, clips: clips });
      var idx = t < .4 ? 0 : t < .64 ? 1 : 2, target = s.duct(pos[idx]);
      var ap = ease(seg(t, 0, .18)) * (1 - ease(seg(t, .88, 1)));
      var mv = idx === 1 ? ease(seg(t, .42, .5)) : idx === 2 ? ease(seg(t, .66, .74)) : 1;
      var prev = idx ? s.duct(pos[idx - 1]) : target, cur = [lerp(prev[0], target[0], mv), lerp(prev[1], target[1], mv)];
      var tip = [lerp(cur[0] + 40, cur[0] + 2, ap), lerp(-40, cur[1] + 14, ap)];
      var tt = times[idx], close = seg(t, tt, tt + .04), loaded = !(t > tt + .04 && t < tt + .1);
      return frame(s.svg + tool('grasp', [-30, 30], s.tipF, 0) + tool('grasp', [-40, 330], add(s.N, s.v, -4), 0) + tool('clip', [cur[0] + 40, -120], tip, (1 - close) * (loaded ? 1 : .2), { loaded: loaded }));
    }
  });

  reg({
    id: 'cut', t: 'Divide between the clips', en: 'Division between clips', proc: 'lap-chole', lv: ['res', 'senior'], dur: 5,
    caps: [[0, 'Three clips in place'], [.18, 'The scissors open in the gap between the clips'], [.38, 'One cut, no energy'], [.56, 'Two clips stay on the patient side'], [.8, 'Check the clips haven’t moved']],
    see: ['Cold scissors, no energy, halfway between the clips.', 'Leave enough stump on the patient side, and look at the stump again after the cut.'],
    err: 'Cutting with energy, or an energized instrument touching a clip, carries heat into the stump. Cutting too close to the patient-side clip leaves a short stump.', refs: [25, 26], conv: 'The exact distance hasn’t been tested in a controlled trial. This card rests on the principles of energy safety.',
    teach: 'Pause before the cut and ask: what stays on the patient side, and what comes out with the gallbladder.',
    draw: function (t) {
      var cutDone = t > .42 && t < .97;
      var s = scene({ fx: -30, fy: -40 - (cutDone ? 6 : 0), nx: -46 - (cutDone ? 8 : 0), ny: 34, tri: .55, clips: [.72, .56, .26], cut: cutDone ? .4 : null });
      var c = s.duct(.4), ap = ease(seg(t, 0, .18)) * (1 - ease(seg(t, .7, .86)));
      var tip = [lerp(c[0] + 40, c[0] + 1, ap), lerp(-40, c[1] + 12, ap)];
      var op = seg(t, .18, .3) * (1 - seg(t, .38, .42));
      return frame(s.svg + tool('grasp', [-30, 30], s.tipF, 0) + tool('grasp', [-40, 330], add(s.N, s.v, -4), 0) + tool('scis', [c[0] + 40, -120], tip, op));
    }
  });

  reg({
    id: 'camera30', t: '30° scope: the light cable aims the view', en: '30° scope navigation', proc: '', lv: ['stu', 'res', 'nurse', 'senior'], dur: 8,
    caps: [[0, 'Light cable down: the view looks up'], [.25, 'Rotate only the light cable: the view moves, the scope stays put'], [.5, 'Light cable up: the view looks down'], [.75, 'Camera head stays level: the horizon doesn’t rotate']],
    see: ['Training measures three things: a level horizon, instruments centered, and a distance that suits the step.', 'Rotate the light cable with one hand and hold the camera head level with the other.'],
    err: 'A tilted horizon, a camera that chases the hand instead of the working area, and a fogged lens. In beginners the horizon is the slowest thing to improve.', refs: [10, 11, 12], conv: 'The rule "light cable opposite the view" is an accepted teaching convention. We found no study that tests the rule itself.',
    nurse: 'Connect the light cable and camera head, white balance, and warm the lens before going in.',
    teach: 'The camera holder is usually the student or intern: practice the rule with them before the case, not in the middle of it.',
    draw: function (t) {
      var th = t * Math.PI * 2, c = Math.cos(th), sn = Math.sin(th);
      var big = scene({ fx: -20, fy: -30, tri: 0 });
      var oy = -46 * c, ox = 40 * sn;
      var view = '<svg x="190" y="24" width="270" height="200" viewBox="' + r1(115 + ox) + ' ' + r1(58 + oy) + ' 243 180" preserveAspectRatio="xMidYMid slice"><g>' + big.svg + '</g></svg><rect x="190" y="24" width="270" height="200" rx="14" fill="none" stroke="#D9C79E" stroke-opacity=".5"/>';
      var cone = 30 * c;
      var scope = '<g transform="translate(20 124)"><rect x="0" y="-7" width="130" height="14" rx="3" fill="url(#mvMt)"/>' +
        '<path d="M130 -7 L' + r1(140) + ' ' + r1(-7 + 0) + ' L130 7 Z" fill="#9AA5AD"/>' +
        '<g transform="translate(138 0) rotate(' + r1(-cone) + ')"><path d="M0 0 L46 -16 L46 16 Z" fill="#D9C79E" fill-opacity=".22" stroke="#D9C79E" stroke-opacity=".7"/><line x1="0" y1="0" x2="48" y2="0" stroke="#D9C79E" stroke-dasharray="3 3"/></g>' +
        '<rect x="-6" y="-11" width="18" height="22" rx="3" fill="#3B4349"/>' +
        '<g transform="translate(22 0)"><line x1="0" y1="0" x2="0" y2="' + r1(26 * c) + '" stroke="#E7ECEF" stroke-width="6" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="' + r1(4 + 3 * Math.abs(sn)) + '" ry="8" fill="#5E6870"/></g>' +
        '<text x="24" y="' + r1(c > 0 ? 52 : -42) + '" fill="#E7ECEF" font-size="11" font-family="Inter, sans-serif" text-anchor="middle">Light cable</text></g>' +
        '<text x="88" y="70" fill="#9FB3C2" font-size="12" font-family="Inter, sans-serif" text-anchor="middle">Scope, side view</text><text x="325" y="16" fill="#9FB3C2" font-size="11" font-family="Inter, sans-serif" text-anchor="middle">What the screen shows</text>';
      return DEFS + '<rect width="480" height="300" fill="#1A1611"/>' + scope + view;
    }
  });

  reg({
    id: 'triangle', t: 'Triangulation: the angle between instruments', en: 'Triangulation', proc: '', lv: ['stu', 'res', 'senior'], dur: 7,
    caps: [[0, 'Ports too close: instruments almost parallel and clashing'], [.36, 'Move the ports apart'], [.62, '45° to 75° between instruments, 60° is best, camera in between'], [.84, 'Target at a comfortable distance from every port']],
    see: ['Camera in the middle, the two working instruments on either side at a similar angle to it.', 'As the angle between the instruments grows, increase the elevation angle too.'],
    err: 'Ports too close, or in line with the camera, or an angle of 90° or more: dissection and knot tying get slower and less precise.', refs: [9, 10],
    teach: 'Before the first incision, mark the target on the skin and ask the learner to draw the triangle.',
    draw: function (t) {
      var k = ease(seg(t, .3, .6)) * (1 - ease(seg(t, .94, 1))), half = lerp(7, 30, k) * Math.PI / 180;
      var Tg = [240, 62], cam = [240, 222], d = 160;
      var p1 = [Tg[0] - d * Math.sin(half), Tg[1] + d * Math.cos(half)], p2 = [Tg[0] + d * Math.sin(half), Tg[1] + d * Math.cos(half)];
      var col = k > .7 ? '#C8A96A' : k < .2 ? '#F07360' : '#E9C46A';
      var arc = 'M' + pt([Tg[0] - 40 * Math.sin(half), Tg[1] + 40 * Math.cos(half)]) + ' A40 40 0 0 0 ' + pt([Tg[0] + 40 * Math.sin(half), Tg[1] + 40 * Math.cos(half)]);
      var s = '<rect width="480" height="300" fill="#1A1611"/><path d="M60 40 Q240 -10 420 40 Q470 160 420 270 Q240 310 60 270 Q10 160 60 40 Z" fill="#12283A" stroke="#28465E"/>' +
        '<circle cx="240" cy="62" r="16" fill="#6F8A4C" opacity=".85"/><text x="240" y="34" fill="#CFE0EA" font-size="12" font-family="Inter, sans-serif" text-anchor="middle">Target</text>' +
        '<line x1="' + pt(cam).replace(' ', '" y1="') + '" x2="240" y2="78" stroke="#D9C79E" stroke-width="3" stroke-dasharray="6 5"/>' +
        '<line x1="' + r1(p1[0]) + '" y1="' + r1(p1[1]) + '" x2="' + r1(Tg[0] - 4) + '" y2="' + r1(Tg[1] + 8) + '" stroke="url(#mvMt)" stroke-width="7" stroke-linecap="round"/>' +
        '<line x1="' + r1(p2[0]) + '" y1="' + r1(p2[1]) + '" x2="' + r1(Tg[0] + 4) + '" y2="' + r1(Tg[1] + 8) + '" stroke="url(#mvMt)" stroke-width="7" stroke-linecap="round"/>' +
        '<path d="' + arc + '" fill="none" stroke="' + col + '" stroke-width="3"/>' +
        '<text x="240" y="' + r1(Tg[1] + 64) + '" fill="' + col + '" font-size="15" font-weight="700" font-family="Inter, sans-serif" text-anchor="middle">' + Math.round(2 * half * 180 / Math.PI) + '°</text>' +
        [p1, p2, cam].map(function (p, i) { return '<circle cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="9" fill="' + (i === 2 ? '#B08A45' : '#E7ECEF') + '" stroke="#1A1611" stroke-width="2"/>'; }).join('') +
        '<text x="290" y="226" fill="#9FB3C2" font-size="11" font-family="Inter, sans-serif" text-anchor="middle">Camera</text>';
      return DEFS + s;
    }
  });

  /* ---------- player ---------- */
  var live = [], raf = 0, reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  O.movePlayer = function (id, opts) {
    var m = M[id]; if (!m) return '';
    opts = opts || {};
    return '<div class="mv' + (opts.cls ? ' ' + opts.cls : '') + '" data-mv="' + id + '"><svg viewBox="0 0 480 300" role="img" aria-label="' + esc(m.t) + '" xmlns="http://www.w3.org/2000/svg">' + m.draw(.5) + '</svg>' +
      '<div class="mvcap"><span class="mvt"></span><i class="mvbar"><b></b></i></div><button class="mvpp" aria-label="Pause and play">❚❚</button></div>';
  };
  function tick(now) {
    live = live.filter(function (p) { return document.body.contains(p.el); });
    live.forEach(function (p) {
      if (p.paused || !p.vis) return;
      var m = M[p.id], t = ((now - p.t0) / 1000 / m.dur) % 1;
      p.svg.innerHTML = m.draw(t);
      var cap = ''; m.caps.forEach(function (c) { if (t >= c[0]) cap = c[1]; });
      if (cap !== p.cap) { p.cap = cap; p.txt.textContent = cap; }
      p.bar.style.width = r1(t * 100) + '%';
    });
    raf = live.length ? requestAnimationFrame(tick) : 0;
  }
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { live.forEach(function (p) { if (p.el === e.target) p.vis = e.isIntersecting; }); }); }) : null;
  O.mountMoves = function (root) {
    (root || document).querySelectorAll('.mv[data-mv]').forEach(function (el) {
      if (el._mv) return;
      var p = { el: el, id: el.dataset.mv, svg: el.querySelector('svg'), txt: el.querySelector('.mvt'), bar: el.querySelector('.mvbar b'), t0: performance.now(), vis: !io, paused: reduce };
      el._mv = p; live.push(p); if (io) io.observe(el);
      p.txt.textContent = M[p.id].caps[0][1];
      var b = el.querySelector('.mvpp'); b.textContent = p.paused ? '▶' : '❚❚';
      b.onclick = function () { p.paused = !p.paused; b.textContent = p.paused ? '▶' : '❚❚'; if (!p.paused) p.t0 = performance.now() - (parseFloat(p.bar.style.width) || 0) / 100 * M[p.id].dur * 1000; };
    });
    if (!raf && live.length) raf = requestAnimationFrame(tick);
  };
  O.moveModal = function (id) {
    var m = M[id]; if (!m) return;
    var d = document.createElement('div'); d.className = 'mvmodal'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', m.t);
    d.innerHTML = '<div class="mvbox"><button class="mvx" aria-label="Close">✕</button><h3>' + esc(m.t) + '</h3>' + O.movePlayer(id) + '<ul class="dots">' + m.see.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' + (m.err ? '<div class="note warn"><span class="k">Common error</span><span>' + esc(m.err) + '</span></div>' : '') + '</div>';
    document.body.appendChild(d);
    function close() { d.remove(); document.removeEventListener('keydown', key); }
    function key(e) { if (e.key === 'Escape') close(); }
    d.onclick = function (e) { if (e.target === d) close(); };
    d.querySelector('.mvx').onclick = close; document.addEventListener('keydown', key);
    O.mountMoves(d);
  };
})();
