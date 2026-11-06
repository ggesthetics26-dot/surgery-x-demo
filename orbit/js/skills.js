/* ORBIT Skills Lab (#/skills): the basic moves as short animations, equipment recognition with a quiz,
   and a track per role (student and intern, OR nurse, resident, senior). Original vector drawings. */
(function () {
  'use strict';
  var O = window.ORBIT, A = O.art, esc = A.esc;
  var T = O.moveArt.tool, D = O.moveArt.defs;

  function bar(x, w, fill) { return '<rect x="' + x + '" y="38" width="' + w + '" height="14" rx="3" fill="' + (fill || 'url(#mvMt)') + '"/>'; }
  /* equipment, drawn tip to the right in viewBox 0 0 320 90 */
  var EQ = [
    { id: 'grasp', n: 'Atraumatic grasper', en: 'Atraumatic grasper', use: 'Holds and retracts tissue without injuring it. Fenestrated jaws with fine teeth.', mm: '5 mm', art: function () { return T('grasp', [-60, 45], [290, 45], .55); } },
    { id: 'maryland', n: 'Maryland dissector', en: 'Maryland dissector', use: 'Fine dissection and isolating structures. Curved jaws, usually connected to energy too.', mm: '5 mm', art: function () { return '<g transform="translate(0 0)">' + T('grasp', [-60, 45], [282, 45], .35) + '</g><path d="M282 41 Q296 36 304 26" stroke="#9AA5AD" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M282 49 Q298 44 306 32" stroke="#6E7880" stroke-width="4" fill="none" stroke-linecap="round"/>'; } },
    { id: 'scis', n: 'Laparoscopic scissors', en: 'Laparoscopic scissors', use: 'Cuts tissue, sutures and a duct between clips. Can take energy, but never on a clipped duct.', mm: '5 mm', art: function () { return T('scis', [-60, 45], [292, 45], .6); } },
    { id: 'hook', n: 'Hook electrode', en: 'L-hook', use: 'Monopolar dissection: lift a thin layer of tissue, see the tip, then activate.', mm: '5 mm', art: function () { return T('hook', [-60, 50], [292, 50], 0); } },
    { id: 'clip', n: 'Clip applier', en: 'Clip applier', use: 'Closes ducts and small vessels. Load a clip before every use.', mm: '5 or 10 mm', art: function () { return T('clip', [-60, 45], [290, 45], .7, { loaded: true }); } },
    { id: 'suct', n: 'Suction-irrigator', en: 'Suction-irrigator', use: 'Suctions blood and fluid, and irrigates. Also a good blunt instrument for moving tissue.', mm: '5 mm', art: function () { return T('suct', [-60, 45], [292, 45], 0); } },
    { id: 'trocar', n: 'Trocar', en: 'Trocar', use: 'The way into the abdomen: a cannula with a valve that keeps the gas in, and a sharp or blunt obturator for insertion.', mm: '5 to 12 mm', art: function () { return '<rect x="40" y="34" width="70" height="22" rx="4" fill="#2F3A42"/><rect x="60" y="22" width="16" height="12" rx="2" fill="#4B5961"/><circle cx="68" cy="20" r="5" fill="#B08A45"/>' + bar(108, 160, 'url(#mvBk)') + '<path d="M268 38 L300 45 L268 52 Z" fill="#B9C2C8"/><rect x="10" y="40" width="34" height="10" rx="2" fill="#5E6870"/>'; } },
    { id: 'veress', n: 'Veress needle', en: 'Veress needle', use: 'Creates pneumoperitoneum in closed entry. A spring-loaded blunt stylet springs forward as the needle enters the cavity.', mm: '2 mm', art: function () { return '<rect x="30" y="34" width="60" height="22" rx="6" fill="#4B5961"/><rect x="40" y="26" width="10" height="8" fill="#B08A45"/><rect x="90" y="41" width="190" height="8" rx="2" fill="url(#mvMt)"/><path d="M280 41 L304 45 L280 49 Z" fill="#DCE2E6"/><rect x="284" y="43" width="14" height="4" rx="2" fill="#7D8890"/>'; } },
    { id: 'scope', n: '30° laparoscope', en: '30° laparoscope', use: 'The camera. The tip is angled, so rotating the light cable changes the direction of view.', mm: '5 or 10 mm', art: function () { return '<rect x="20" y="30" width="56" height="30" rx="6" fill="#2F3A42"/><rect x="76" y="34" width="22" height="22" rx="3" fill="#4B5961"/><rect x="104" y="18" width="10" height="20" rx="3" fill="#E7ECEF"/>' + bar(98, 196) + '<path d="M294 38 L304 38 L294 52 Z" fill="#9AA5AD"/><path d="M302 44 L318 34 L318 54 Z" fill="#D9C79E" fill-opacity=".35"/>'; } },
    { id: 'stapler', n: 'Endoscopic stapler', en: 'Endoscopic stapler', use: 'Cuts and seals in one go, with rows of staples. Cartridge color matches tissue thickness.', mm: '12 mm', art: function () { return bar(0, 210, 'url(#mvBk)') + '<rect x="206" y="28" width="96" height="12" rx="3" fill="#C9D0D4"/><rect x="206" y="48" width="96" height="16" rx="3" fill="#E9C46A"/><rect x="206" y="40" width="6" height="10" fill="#3B4349"/>'; } },
    { id: 'sealer', n: 'Advanced energy device', en: 'Advanced bipolar or ultrasonic device', use: 'Seals and divides vessels without clips. The tip stays hot for a few seconds after activation.', mm: '5 mm', art: function () { return bar(-20, 250, 'url(#mvBk)') + '<path d="M228 38 L300 40 Q306 42 300 45 L228 45 Z" fill="#9AA5AD"/><path d="M228 46 L298 48 Q304 50 298 53 L228 52 Z" fill="#5E6870"/>'; } },
    { id: 'bag', n: 'Retrieval bag', en: 'Retrieval bag', use: 'Removes an organ or tissue without touching the abdominal wall. Cinched with a string and pulled out through the port.', mm: '10 mm', art: function () { return bar(0, 150, 'url(#mvBk)') + '<path d="M150 30 Q230 6 290 40 Q300 60 260 78 Q200 92 160 62 Z" fill="#CFE7F0" fill-opacity=".45" stroke="#9CC9D8" stroke-width="2"/><circle cx="150" cy="45" r="15" fill="none" stroke="#5E6870" stroke-width="3"/>'; } }
  ];
  O.equipList = EQ;
  O.eqSvg = function (e) { return eqSvg(e); };
  function eqSvg(e) { if (O.instrSvg && O.instrSvg(e.id)) return O.instrSvg(e.id, e.n); return '<svg viewBox="0 0 320 90" class="eqart" role="img" aria-label="' + esc(e.n) + '" xmlns="http://www.w3.org/2000/svg">' + D + '<rect width="320" height="90" fill="#1A1611"/>' + e.art() + '</svg>'; }

  /* a track for each role: what to learn first */
  var TRACK = {
    stu: { h: 'Student and intern', p: 'In the OR you’ll usually hold the camera. Start with the camera, the triangle and the names of the instruments.', moves: ['camera30', 'triangle', 'fundus'], eq: 1 },
    nurse: { h: 'Scrub nurse', p: 'Know every instrument, prepare it right and pass it before it’s asked for. The moves help you anticipate what comes next.', moves: ['clip', 'camera30'], eq: 1 },
    res: { h: 'Resident', p: 'Every move in the order it comes in the operation, with the common error. Watch first, then practice, then do it in the OR.', moves: ['triangle', 'camera30', 'fundus', 'hartmann', 'hook', 'clip', 'cut'], eq: 0 },
    senior: { h: 'Teaching attending', p: 'The same moves, with a teaching point for each. Built around the stages of autonomy: show, coach, assist, then let them do it.', moves: ['fundus', 'hartmann', 'hook', 'clip', 'cut', 'camera30', 'triangle'], eq: 0 }
  };
  var ZW = [['Show and tell', 'The attending operates and explains every move.'], ['Active help', 'The learner operates, the attending says what to do at each step.'], ['Passive help', 'The learner leads, the attending assists and corrects only when needed.'], ['Supervision only', 'The learner operates alone, the attending is available and hands off.']];

  function moveCard(m, mode) {
    return '<article class="card skcard">' + O.movePlayer(m.id) + '<div class="sb"><h3>' + esc(m.t) + '</h3>' + (m.en && m.en !== m.t ? '<div class="en">' + esc(m.en) + '</div>' : '') + '' +
      '<ul class="dots">' + m.see.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' +
      (m.err && mode !== 'stu' ? '<div class="note warn"><span class="k">Common error</span><span>' + esc(m.err) + '</span></div>' : '') +
      (mode === 'nurse' && m.nurse ? '<div class="ninst"><b>Prepare:</b> ' + esc(m.nurse) + '</div>' : '') +
      (mode === 'senior' && m.teach ? '<div class="note tip"><span class="k">How to teach it</span><span>' + esc(m.teach) + '</span></div>' : '') +
      (m.conv ? '<div class="conv"><b>Convention, not evidence:</b> ' + esc(m.conv) + '</div>' : '') + refList(m.refs) +
      (m.proc && O.byId(m.proc) ? '<a class="sklink" href="#/p/' + m.proc + '#s-steps">In the operation: ' + esc(O.byId(m.proc).title) + ' ›</a>' : '') + '</div></article>';
  }
  function refList(ns) {
    if (!ns || !ns.length || !O.refs) return '';
    return '<details class="refs"><summary>' + ns.length + (ns.length === 1 ? ' source' : ' sources') + '</summary><ol>' + ns.map(function (n) { var r = O.refs[n]; if (!r) return ''; return '<li value="' + n + '"><a href="' + esc(r.u) + '" target="_blank" rel="noopener">' + esc(r.a) + (r.y ? ' ' + r.y : '') + '</a> · <span dir="ltr">' + esc(r.t) + (r.j ? ' · ' + esc(r.j) : '') + '</span></li>'; }).join('') + '</ol></details>';
  }
  O.refList = refList;
  function eqGrid() {
    return '<div class="eqgrid">' + EQ.map(function (e) { return '<div class="card eqc">' + eqSvg(e) + '<div class="sb"><h3>' + esc(e.n) + ' <span class="badge">' + esc(e.mm) + '</span></h3>' + (e.en && e.en !== e.n ? '<div class="en">' + esc(e.en) + '</div>' : '') + '<p>' + esc(e.use) + '</p></div></div>'; }).join('') + '</div>';
  }

  /* recognition quiz: a picture, four names */
  var Q = { i: 0, ok: 0, order: [], done: false };
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function quizStart() { Q.order = shuffle(EQ).slice(0, 8); Q.i = 0; Q.ok = 0; Q.done = false; quizDraw(); }
  function quizDraw() {
    var el = document.getElementById('eqquiz'); if (!el) return;
    if (Q.i >= Q.order.length) { el.innerHTML = '<div class="qend"><b>' + Q.ok + ' of ' + Q.order.length + '</b><span>' + (Q.ok >= 7 ? 'Very good. You know the tray.' : Q.ok >= 5 ? 'Nearly. Go over the cards once more.' : 'One more round with the cards, then try again.') + '</span><button class="btn pri" id="qagain">Another round</button></div>'; document.getElementById('qagain').onclick = quizStart; return; }
    var e = Q.order[Q.i], opts = shuffle([e].concat(shuffle(EQ.filter(function (x) { return x !== e; })).slice(0, 3)));
    el.innerHTML = '<div class="qhead">Question ' + (Q.i + 1) + ' of ' + Q.order.length + ' · Which instrument is this?</div>' + eqSvg(e) + '<div class="qopts">' + opts.map(function (o) { return '<button class="btn qo" data-id="' + o.id + '">' + esc(o.n) + '</button>'; }).join('') + '</div><div class="qwhy" hidden></div>';
    [].forEach.call(el.querySelectorAll('.qo'), function (b) {
      b.onclick = function () {
        var right = b.dataset.id === e.id; if (right) Q.ok++;
        [].forEach.call(el.querySelectorAll('.qo'), function (x) { x.disabled = true; if (x.dataset.id === e.id) x.classList.add('ok'); else if (x === b) x.classList.add('bad'); });
        var w = el.querySelector('.qwhy'); w.hidden = false; w.innerHTML = '<b>' + esc(e.n) + '.</b> ' + esc(e.use) + ' <button class="btn" id="qnext">Next ›</button>';
        document.getElementById('qnext').onclick = function () { Q.i++; quizDraw(); };
      };
    });
  }

  /* why learn this way: the evidence behind the format itself */
  function why() {
    var W = [['97%', 'of bile duct injuries came from a misperception, not a lack of skill', [21]], ['+', 'Training with animation built on task analysis improved performance in the OR', [47]], ['FLS', 'Box training to proficiency improved real laparoscopic cholecystectomy', [14]], ['VR', 'Simulation training cut operating time and reduced errors in the OR', [42, 46]]];
    return '<div class="skwhy">' + W.map(function (w) { return '<div class="card"><b>' + esc(w[0]) + '</b><span>' + esc(w[1]) + '</span>' + refList(w[2]) + '</div>'; }).join('') + '</div>';
  }
  O.skillsPage = function (app, mode) {
    var tr = TRACK[mode] || TRACK.res;
    var mine = tr.moves.map(function (id) { return O.moves[id]; }).filter(Boolean);
    var rest = O.moveList.filter(function (m) { return tr.moves.indexOf(m.id) < 0; });
    var eqSec = '<section class="sec" id="s-equip"><h2><span class="n">' + (tr.eq ? 1 : 2) + '</span>Know the instruments <span class="sub">' + EQ.length + ' basic instruments</span></h2>' +
      '<div class="card qcard"><div id="eqquiz"></div></div>' + eqGrid() + '</section>';
    var mvSec = '<section class="sec" id="s-moves"><h2><span class="n">' + (tr.eq ? 2 : 1) + '</span>My moves <span class="sub">' + esc(tr.h) + '</span></h2><div class="skgrid">' + mine.map(function (m) { return moveCard(m, mode); }).join('') + '</div>' +
      (rest.length ? '<h3 class="skmore">More moves</h3><div class="skgrid">' + rest.map(function (m) { return moveCard(m, mode); }).join('') + '</div>' : '') + '</section>';
    var zw = mode === 'senior' ? '<section class="sec"><h2><span class="n">3</span>Four stages of autonomy</h2><div class="zw">' + ZW.map(function (z, i) { return '<div class="card"><b>' + (i + 1) + ' · ' + esc(z[0]) + '</b><span>' + esc(z[1]) + '</span></div>'; }).join('') + '</div><p class="figcap">Based on the Zwisch model. Every move here has a teaching point.</p>' + refList([30, 31, 32]) + '</section>' : '';
    app.innerHTML = '<div class="skhero"><div class="wrap"><div class="kick">ORBIT · Skills lab</div><h1>Learn the move before you touch tissue</h1><p>' + esc(tr.p) + '</p>' +
      '<a class="btn pri skcta2" href="#/sim/lap-chole">Guided simulator: cholecystectomy ›</a>' + '<div class="sktabs">' + Object.keys(TRACK).map(function (k) { return '<button class="chip" aria-pressed="' + (k === mode) + '" data-mode="' + k + '">' + esc(TRACK[k].h) + '</button>'; }).join('') + '</div></div></div>' +
      '<div class="wrap">' + why() + (tr.eq ? eqSec + mvSec : mvSec + eqSec) + zw + '<p class="figcap" style="margin:18px 0 30px">Original schematic animations, not to scale. A learning tool, not a substitute for supervision in the OR or your institution’s policies.</p></div>';
    [].forEach.call(app.querySelectorAll('.sktabs .chip'), function (b) { b.onclick = function () { O.app.setMode(b.dataset.mode); }; });
    O.mountMoves(app); quizStart();
  };
})();
