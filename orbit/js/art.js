/* ORBIT art: generic, data-driven vector renderers.
   - torso port maps / incisions      (viewBox 0 0 300 380, anterior view, patient's right on viewer's LEFT)
   - patient position, side view      (viewBox 0 0 360 210, head on the LEFT)
   - OR room, top view                (viewBox 0 0 320 400, head at TOP, patient's right on viewer's LEFT)
   - anatomy bases + hotspots + marks (viewBox 0 0 400 300)
   - covers                           (viewBox 0 0 320 200)
   All original drawings. No faces, no genitals, no patient data. */
(function () {
  'use strict';
  var O = window.ORBIT;
  var A = O.art = {};
  var uid = 0;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  A.esc = esc;
  /* Hebrew labels inside LTR figures keep their own reading order */
  function rtl(t) { return /[\u0590-\u05FF]/.test(String(t || '')) ? ' direction="rtl" unicode-bidi="plaintext"' : ''; }
  A.rtl = rtl;

  function svg(vb, inner, cls, label) {
    return '<svg class="' + (cls || '') + '" viewBox="' + vb + '" role="img" aria-label="' + esc(label || '') + '" xmlns="http://www.w3.org/2000/svg">' + DEFS + inner + '</svg>';
  }
  var DEFS = '<defs>' +
    '<marker id="o-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="mk-ar-h"/></marker>' +
    '<marker id="o-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="mk-arr-h"/></marker>' +
    '<pattern id="o-mesh" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" class="mk-mesh-bg"/><path d="M0 0 L0 7 M0 0 L7 0" class="mk-mesh-ln"/></pattern>' +
    '<pattern id="o-grid" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0 L0 0 0 16" class="cv-grid"/></pattern>' +
    '</defs>';

  /* ---------------- torso (ports / incisions) ---------------- */
  var LM = {
    xiphoid: [150, 58], umbilicus: [150, 205], pubis: [150, 352],
    asisR: [62, 268], asisL: [238, 268], tubR: [130, 345], tubL: [170, 345]
  };
  A.LM = LM;
  var INCISIONS = {
    'midline-upper': 'M150 72 L150 196',
    'midline-full': 'M150 72 L150 196 M150 214 L150 330',
    'midline-lower': 'M150 214 L150 330',
    'midline-peri': 'M150 150 L150 196 M150 214 L150 262',
    'subcostal-R': 'M150 92 Q110 120 70 150',
    'subcostal-L': 'M150 92 Q190 120 230 150',
    'chevron': 'M70 150 Q110 120 150 92 Q190 120 230 150',
    'mcburney': 'M84 222 L112 262',
    'lanz': 'M80 250 Q98 256 116 252',
    'inguinal-R': 'M74 292 L124 322',
    'inguinal-L': 'M226 292 L176 322',
    'pfannenstiel': 'M112 330 Q150 342 188 330',
    'umbilical': 'M140 214 Q150 222 160 214',
    'transverse-RUQ': 'M150 168 L74 168',
    'left-iliac': 'M196 262 Q214 280 232 286'
  };
  A.INCISIONS = INCISIONS;
  function torsoBase() {
    return '<path class="t-body" d="M70 6 C52 60 44 120 48 180 C50 230 44 262 46 300 C48 330 70 352 104 366 L150 372 L196 366 C230 352 252 330 254 300 C256 262 250 230 252 180 C256 120 248 60 230 6 Z"/>' +
      '<path class="t-ln" d="M150 58 Q100 95 52 150 M150 58 Q200 95 248 150"/>' +
      '<path class="t-ln t-dash" d="M150 20 L150 345"/>' +
      '<path class="t-ln t-faint" d="M98 14 L98 250 M202 14 L202 250"/>' +
      '<path class="t-ln" d="M62 268 Q96 312 130 345 M238 268 Q204 312 170 345 M130 349 Q150 356 170 349"/>' +
      '<circle class="t-umb" cx="150" cy="205" r="4.5"/>' +
      '<circle class="t-lm" cx="62" cy="268" r="3"/><circle class="t-lm" cx="238" cy="268" r="3"/><circle class="t-lm" cx="150" cy="58" r="3"/>' +
      '<text class="t-tx" x="150" y="50" text-anchor="middle">xiphoid</text>' +
      '<text class="t-tx" x="98" y="12" text-anchor="middle">MCL</text><text class="t-tx" x="202" y="12" text-anchor="middle">MCL</text>' +
      '<text class="t-tx" x="62" y="284" text-anchor="middle">ASIS</text><text class="t-tx" x="238" y="284" text-anchor="middle">ASIS</text>' +
      '<text class="t-side" x="14" y="200" text-anchor="middle" transform="rotate(-90 14 200)">Patient right</text>' +
      '<text class="t-side" x="286" y="200" text-anchor="middle" transform="rotate(90 286 200)">Patient left</text>';
  }
  var ROLE = { camera: 'Camera', work: 'Working', assist: 'Assistant', robot: 'Robotic arm', extract: 'Extraction', stapler: 'Stapler', access: 'Access' };
  A.ROLE = ROLE;
  /* access: {ports:[{x,y,mm,role,label,n}], incisions:[{id|d,label,alt}], target:{x,y,rx,ry,label}} */
  A.access = function (acc) {
    acc = acc || {};
    var s = torsoBase();
    if (acc.target) {
      var t = acc.target;
      s += '<ellipse class="t-target" cx="' + t.x + '" cy="' + t.y + '" rx="' + (t.rx || 34) + '" ry="' + (t.ry || 24) + '"/>' +
        (t.label ? '<text class="t-tlbl"' + rtl(t.label) + ' x="' + t.x + '" y="' + (t.y + 4) + '" text-anchor="middle">' + esc(t.label) + '</text>' : '');
    }
    (acc.incisions || []).forEach(function (c) {
      var d = c.d || INCISIONS[c.id] || '';
      s += '<path class="t-inc' + (c.alt ? ' alt' : '') + '" d="' + d + '"/>';
      if (c.lx) s += '<text class="t-ilbl"' + rtl(c.label) + ' x="' + c.lx + '" y="' + c.ly + '" text-anchor="middle">' + esc(c.label || '') + '</text>';
    });
    (acc.ports || []).forEach(function (p, i) {
      var r = 5 + (p.mm || 5) * 0.55;
      s += '<g class="t-port r-' + (p.role || 'work') + '"><circle cx="' + p.x + '" cy="' + p.y + '" r="' + r.toFixed(1) + '"/>' +
        '<text x="' + p.x + '" y="' + (p.y + 3.5) + '" text-anchor="middle">' + esc(p.n || (i + 1)) + '</text>' +
        '<text class="t-mm" x="' + (p.x + r + 3) + '" y="' + (p.y - r + 2) + '">' + esc(p.mm ? p.mm : '') + '</text></g>';
    });
    return svg('0 0 300 380', s, 'fig-torso', 'Access map');
  };

  /* ---------------- position, side view ---------------- */
  /* pos: {kind:'supine'|'lithotomy'|'split', tilt:deg (+ head up), roll:'left'|'right'|'', legs, pressure:[...], label} */
  A.position = function (pos) {
    pos = pos || {};
    var tilt = pos.tilt || 0, cx = 180, cy = 130;
    var legs = pos.kind === 'lithotomy'
      ? '<path class="p-body" d="M244 98 L272 70 L300 88 L276 104 Z"/><path class="p-body" d="M268 74 L300 66 L304 78 L294 90 Z"/><rect class="p-stir" x="290" y="58" width="16" height="40" rx="3"/>'
      : '<rect class="p-body" x="236" y="100" width="92" height="17" rx="8"/>' + (pos.kind === 'split' ? '<rect class="p-body p-leg2" x="240" y="96" width="88" height="12" rx="6"/>' : '');
    var body = '<g transform="rotate(' + tilt + ' ' + cx + ' ' + cy + ')">' +
      '<rect class="p-table" x="40" y="118" width="290" height="10" rx="3"/>' +
      '<rect class="p-strap" x="248" y="96" width="8" height="26" rx="2"/>' +
      '<circle class="p-head" cx="62" cy="104" r="15"/>' +
      '<rect class="p-body" x="80" y="94" width="160" height="26" rx="12"/>' + legs +
      '<rect class="p-strap" x="196" y="90" width="8" height="32" rx="2"/>' +
      pressureDots(pos.pressure || []) +
      '</g>' +
      '<rect class="p-base" x="160" y="150" width="40" height="38" rx="4"/><rect class="p-base" x="120" y="186" width="120" height="8" rx="3"/>';
    var lbl = '';
    if (tilt) lbl += '<text class="p-tx" x="180" y="22" text-anchor="middle">' + (tilt > 0 ? 'Reverse Trendelenburg ' : 'Trendelenburg ') + Math.abs(tilt) + '°</text>';
    if (pos.roll) lbl += '<text class="p-tx" x="180" y="40" text-anchor="middle">Table rolled to patient ' + (pos.roll === 'left' ? 'left' : 'right') + '</text>';
    lbl += '<text class="p-tx2" x="62" y="206" text-anchor="middle">Head</text><text class="p-tx2" x="300" y="206" text-anchor="middle">Feet</text>';
    return svg('0 0 360 210', body + lbl, 'fig-pos', 'Patient position');
  };
  var PP = { occiput: [50, 112], scapula: [96, 118], sacrum: [212, 118], elbow: [140, 120], heel: [322, 116], knee: [282, 104], fibula: [276, 92], calf: [300, 112] };
  function pressureDots(list) {
    return list.map(function (k) { var p = PP[k]; return p ? '<circle class="p-press" cx="' + p[0] + '" cy="' + p[1] + '" r="5"/>' : ''; }).join('');
  }
  A.PRESSURE = { occiput: 'Occiput', scapula: 'Scapulae', sacrum: 'Sacrum', elbow: 'Elbows (ulnar nerve)', heel: 'Heels', knee: 'Knees', fibula: 'Fibular head (peroneal nerve)', calf: 'Calves', brachial: 'Brachial plexus (arm 90° or less)', face: 'Face and eyes (robot)' };

  /* ---------------- room, top view ---------------- */
  var SLOT = {
    head: [160, 30], RtHead: [74, 40], LtHead: [246, 40],
    Rt1: [82, 130], Rt2: [82, 196], Rt3: [82, 262], Lt1: [238, 130], Lt2: [238, 196], Lt3: [238, 262],
    legs: [160, 352], foot: [160, 382], RtFoot: [74, 360], LtFoot: [246, 360],
    RtFar1: [26, 120], RtFar2: [26, 200], RtFar3: [26, 290], LtFar1: [294, 120], LtFar2: [294, 200], LtFar3: [294, 290]
  };
  A.SLOT = SLOT;
  var WHO = { S: 'Surgeon', A: 'Assistant', C: 'Camera', N: 'Scrub nurse', AN: 'Anesthesia', B: 'Bedside' };
  A.WHO = WHO;
  /* room: {arms:{R:'out'|'tucked',L:..}, legs:'together'|'split'|'lithotomy', staff:[{w:'S',s:'Lt2'}], monitors:['RtFar1'], robot:{s:'Rt2'}, console:true} */
  A.room = function (rm) {
    rm = rm || {}; var arms = rm.arms || { R: 'out', L: 'out' };
    var s = '<rect class="r-floor" x="2" y="2" width="316" height="396" rx="14"/>' +
      '<rect class="r-table" x="124" y="64" width="72" height="272" rx="8"/>' +
      '<circle class="r-pt" cx="160" cy="86" r="16"/>' +
      '<rect class="r-pt" x="136" y="104" width="48" height="124" rx="18"/>';
    s += rm.legs === 'split' || rm.legs === 'lithotomy'
      ? '<path class="r-pt" d="M140 222 L122 330 L136 334 L156 228 Z"/><path class="r-pt" d="M180 222 L198 330 L184 334 L164 228 Z"/>'
      : '<rect class="r-pt" x="140" y="222" width="40" height="108" rx="14"/>';
    s += arms.R === 'tucked' ? '<rect class="r-pt" x="124" y="112" width="12" height="96" rx="6"/>' : '<rect class="r-pt" x="70" y="114" width="66" height="13" rx="6"/><rect class="r-arm" x="62" y="108" width="62" height="24" rx="4"/>';
    s += arms.L === 'tucked' ? '<rect class="r-pt" x="184" y="112" width="12" height="96" rx="6"/>' : '<rect class="r-pt" x="184" y="114" width="66" height="13" rx="6"/><rect class="r-arm" x="196" y="108" width="62" height="24" rx="4"/>';
    s += '<rect class="r-anes" x="118" y="8" width="84" height="20" rx="5"/><text class="r-tx" x="160" y="22" text-anchor="middle">Anesthesia</text>';
    (rm.monitors || []).forEach(function (m) {
      var p = SLOT[m]; if (!p) return;
      s += '<g class="r-mon"><rect x="' + (p[0] - 20) + '" y="' + (p[1] - 9) + '" width="40" height="18" rx="3"/><text x="' + p[0] + '" y="' + (p[1] + 4) + '" text-anchor="middle">Monitor</text></g>';
    });
    if (rm.robot) {
      var q = SLOT[rm.robot.s] || [294, 200];
      s += '<g class="r-robot"><rect x="' + (q[0] - 22) + '" y="' + (q[1] - 26) + '" width="44" height="52" rx="8"/><text x="' + q[0] + '" y="' + (q[1] + 4) + '" text-anchor="middle">Robot</text></g>';
    }
    if (rm.console) s += '<g class="r-cons"><rect x="232" y="356" width="80" height="34" rx="6"/><text x="272" y="377" text-anchor="middle">Console</text></g>';
    (rm.staff || []).forEach(function (st) {
      var p = SLOT[st.s]; if (!p) return;
      s += '<g class="r-who w-' + st.w + '"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="17"/><text x="' + p[0] + '" y="' + (p[1] + 5) + '" text-anchor="middle">' + esc(st.w) + '</text></g>';
    });
    s += '<text class="r-side" x="10" y="250" transform="rotate(-90 10 250)">Patient right</text><text class="r-side" x="310" y="150" transform="rotate(90 310 150)">Patient left</text>';
    return svg('0 0 320 400', s, 'fig-room', 'OR from above');
  };

  /* ---------------- anatomy base + hotspots + marks ---------------- */
  function marks(list) {
    return (list || []).map(function (m) {
      switch (m.t) {
        case 'clip': return '<g class="mk-clip" transform="translate(' + m.x + ' ' + m.y + ') rotate(' + (m.a || 0) + ')"><rect x="-2.6" y="-8" width="5.2" height="16" rx="1.6"/></g>';
        case 'cut': {
          var mx = (m.x1 + m.x2) / 2, my = (m.y1 + m.y2) / 2;
          return '<g class="mk-cut"><path d="M' + m.x1 + ' ' + m.y1 + ' L' + m.x2 + ' ' + m.y2 + '"/>' +
            '<g transform="translate(' + mx + ' ' + my + ')"><circle cx="-5" cy="-7" r="3.4"/><circle cx="5" cy="-7" r="3.4"/><path d="M-3 -4 L5 8 M3 -4 L-5 8"/></g></g>';
        }
        case 'staple': return '<g class="mk-staple"><path class="s1" d="' + (m.d || ('M' + m.pts.join(' L'))) + '"/><path class="s2" d="' + (m.d || ('M' + m.pts.join(' L'))) + '"/></g>';
        case 'arrow': return '<path class="mk-arrow' + (m.tone === 'danger' ? ' dg' : '') + '" d="M' + m.x1 + ' ' + m.y1 + (m.cx != null ? ' Q' + m.cx + ' ' + m.cy : ' L') + ' ' + m.x2 + ' ' + m.y2 + '" marker-end="url(#' + (m.tone === 'danger' ? 'o-arr' : 'o-ar') + ')"/>' +
          (m.label ? '<text class="mk-lbl"' + rtl(m.label) + ' x="' + (m.lx != null ? m.lx : m.x2) + '" y="' + (m.ly != null ? m.ly : m.y2 - 8) + '" text-anchor="middle">' + esc(m.label) + '</text>' : '');
        case 'zone': return '<ellipse class="mk-zone ' + (m.tone || 'safe') + '" cx="' + m.x + '" cy="' + m.y + '" rx="' + (m.rx || 26) + '" ry="' + (m.ry || 18) + '"' + (m.a ? ' transform="rotate(' + m.a + ' ' + m.x + ' ' + m.y + ')"' : '') + '/>' +
          (m.label ? '<text' + rtl(m.label) + ' class="mk-lbl ' + (m.tone || 'safe') + '" x="' + (m.lx != null ? m.lx : m.x) + '" y="' + (m.ly != null ? m.ly : m.y + 4) + '" text-anchor="middle">' + esc(m.label) + '</text>' : '');
        case 'label': return '<text' + rtl(m.text) + ' class="mk-lbl ' + (m.tone || '') + '" x="' + m.x + '" y="' + m.y + '" text-anchor="' + (m.anchor || 'middle') + '">' + esc(m.text) + '</text>';
        case 'mesh': return '<rect class="mk-mesh" x="' + m.x + '" y="' + m.y + '" width="' + m.w + '" height="' + m.h + '" rx="' + (m.r || 6) + '"' + (m.a ? ' transform="rotate(' + m.a + ' ' + (m.x + m.w / 2) + ' ' + (m.y + m.h / 2) + ')"' : '') + '/>';
        case 'stitch': {
          var n = m.n || 5, d = 'M' + m.x1 + ' ' + m.y1;
          for (var i = 1; i <= n; i++) { var f = i / n; d += ' L' + (m.x1 + (m.x2 - m.x1) * f + (i % 2 ? 6 : -6)) + ' ' + (m.y1 + (m.y2 - m.y1) * f + (i % 2 ? -6 : 6)); }
          return '<path class="mk-stitch" d="' + d + '"/>';
        }
        case 'dot': return '<circle class="mk-dot ' + (m.tone || '') + '" cx="' + m.x + '" cy="' + m.y + '" r="' + (m.r || 5) + '"/>';
        case 'path': return '<path class="mk-path ' + (m.tone || '') + '" d="' + m.d + '"/>';
        case 'x': return '<g class="mk-x"><path d="M' + (m.x - 7) + ' ' + (m.y - 7) + ' L' + (m.x + 7) + ' ' + (m.y + 7) + ' M' + (m.x + 7) + ' ' + (m.y - 7) + ' L' + (m.x - 7) + ' ' + (m.y + 7) + '"/></g>';
        default: return '';
      }
    }).join('');
  }
  A.marks = marks;
  /* fig: {base, hl:[keys], marks:[...], hotspots:[{x,y,label,text}]} ; opts.hotspots true => render numbered hotspots */
  A.anatomy = function (fig, opts) {
    opts = opts || {};
    var b = O.bases[fig.base];
    if (!b) return '<div class="fig-missing">Missing figure: ' + esc(fig.base) + '</div>';
    var inner = '<g class="a-base">' + b.fn() + '</g>' + marks(fig.marks);
    if (opts.hotspots && fig.hotspots) {
      inner += fig.hotspots.map(function (h, i) {
        return '<g class="hs" data-hs="' + i + '" tabindex="0" role="button" aria-label="' + esc(h.label) + '"><circle class="hs-pulse" cx="' + h.x + '" cy="' + h.y + '" r="13"/><circle class="hs-dot" cx="' + h.x + '" cy="' + h.y + '" r="10"/><text x="' + h.x + '" y="' + (h.y + 4) + '" text-anchor="middle">' + (i + 1) + '</text></g>';
      }).join('');
    }
    var focus = fig.hl && fig.hl.length;
    var out = svg('0 0 400 300', inner, 'fig-anat' + (focus ? ' focus' : ''), (b.title || ''));
    if (focus) {
      /* mark highlighted elements */
      fig.hl.forEach(function (k) { out = out.split('data-k="' + k + '"').join('data-k="' + k + '" data-on="1"'); });
    }
    return out;
  };

  /* ---------------- covers ---------------- */
  /* AI 3D illustrations (art/ai), labels in % of the frame; checked against the anatomy before use */
  A.AI = {
    chole: { t: 'Gallbladder and biliary tree', l: [[27, 47, 'Gallbladder'], [47, 25, 'Cystic duct'], [60, 62, 'Common bile duct'], [60, 33, 'Portal vein'], [77, 38, 'Hepatic artery'], [42, 86, 'Duodenum'], [24, 12, 'Liver']] },
    stomach: { t: 'The stomach and its blood supply', l: [[46, 9, 'Esophagus'], [55, 45, 'Stomach'], [16, 22, 'Liver'], [85, 38, 'Spleen'], [16, 72, 'Duodenum'], [72, 82, 'Gastroepiploic arcade']] },
    colon: { t: 'The colon and its mesentery', l: [[25, 40, 'Ascending colon'], [50, 5, 'Transverse colon'], [74, 40, 'Descending colon'], [27, 72, 'Cecum'], [47, 33, 'Mesenteric vessels'], [48, 94, 'Rectum']] },
    appendix: { t: 'The appendix and cecum', l: [[36, 46, 'Cecum'], [57, 82, 'Appendix'], [82, 30, 'Terminal ileum'], [52, 60, 'Mesoappendix'], [32, 10, 'Ascending colon']] }
  };
  A.AIMAP = { 'lap-chole': 'chole', 'appendectomy': 'appendix', 'sleeve-gastrectomy': 'stomach', 'gastric-bypass': 'stomach', 'hiatal-hernia': 'stomach', 'right-hemicolectomy': 'colon', 'sigmoid-colectomy': 'colon' };
  A.aiOf = function (id) { return A.AIMAP[id] || ''; };
  /* the illustration with numbered labels; labels:false for a clean cover */
  A.ai = function (key, opts) {
    var a = A.AI[key]; if (!a) return '';
    opts = opts || {};
    var lb = opts.labels === false ? '' : a.l.map(function (x, i) { return '<span class="ail" style="left:' + x[0] + '%;top:' + x[1] + '%"><i>' + (i + 1) + '</i><b>' + esc(x[2]) + '</b></span>'; }).join('');
    return '<div class="aifig' + (opts.cls ? ' ' + opts.cls : '') + '" role="img" aria-label="' + esc(a.t) + '"><img src="art/ai/' + key + '.jpg" alt="" loading="lazy">' + lb + '</div>';
  };

  A.cover = function (id, title) {
    var k = A.aiOf(id);
    if (k) return '<div class="fig-cover aicover" role="img" aria-label="' + esc(title || '') + '"><img src="art/ai/' + k + '.jpg" alt="" loading="lazy"></div>';
    var fn = O.covers[id];
    var inner = '<rect class="cv-bg" width="320" height="200"/><rect width="320" height="200" fill="url(#o-grid)"/>' +
      '<circle class="cv-orbit" cx="252" cy="44" r="70"/><circle class="cv-orbit2" cx="252" cy="44" r="40"/>' +
      (fn ? '<g class="cv-art">' + fn() + '</g>' : '');
    return svg('0 0 320 200', inner, 'fig-cover', title || '');
  };

  /* emblem: a Vitruvian study. Circle and square, two orbits, the core and one red-chalk satellite */
  A.emblem = function (size, cls) {
    return '<svg class="emblem ' + (cls || '') + '" width="' + size + '" height="' + size + '" viewBox="0 0 64 64" aria-hidden="true">' +
      '<rect x="13.5" y="13.5" width="37" height="37" class="em-sq"/>' +
      '<circle cx="32" cy="32" r="27" class="em-ring"/>' +
      '<path d="M32 1.5v4M32 58.5v4M1.5 32h4M58.5 32h4" class="em-tick"/>' +
      '<ellipse cx="32" cy="32" rx="27" ry="9.6" transform="rotate(28 32 32)" class="em-orb2"/>' +
      '<g class="em-spin"><ellipse cx="32" cy="32" rx="27" ry="9.6" transform="rotate(-28 32 32)" class="em-orb"/><circle cx="55.9" cy="23" r="2.3" class="em-sat"/></g>' +
      '<circle cx="32" cy="32" r="6.6" class="em-halo"/><circle cx="32" cy="32" r="3.6" class="em-core"/></svg>';
  };
})();
