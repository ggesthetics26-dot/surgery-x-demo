/* ORBIT simulator (#/sim/<procId>): the operation as a guided walk, one station at a time.
   Each station: a big visual (AI anatomy, a move animation or a vector figure), one line of text, a voice
   track (audio/sim/<id>-NN.mp3, only when O.simAudio[<id>] says it is recorded), a decision where it matters, and the sources behind it (O.refs). */
(function () {
  'use strict';
  var O = window.ORBIT, A = O.art, esc = A.esc;
  var S = O.sims = {};

  S['lap-chole'] = {
    title: 'Laparoscopic cholecystectomy', ap: 'lap',
    st: [
      { k: 'The field', h: 'Know the anatomy', l: 'Identify with certainty, and only then cut.', vis: { ai: 'chole' }, refs: [1, 2] },
      { k: 'Access', h: 'Four ports', l: 'Camera at the umbilicus, three more ports under vision.', vis: { access: 1 }, refs: [9] },
      { k: 'Exposure', h: 'Fundus over the liver', l: 'Toward the right shoulder: the liver lifts and the hilum comes into view.', vis: { move: 'fundus' }, refs: [1, 3, 24] },
      { k: 'Decision', h: 'Which way do you pull Hartmann’s pouch?', vis: { move: 'hartmann' }, refs: [1, 2, 21],
        q: { a: ['Up, toward the head, with the fundus', 'Lateral and down, away from the liver', 'Medial, toward the common duct'], c: 1, ok: 'Right. Lateral and downward traction opens the triangle and moves the cystic duct away from the common duct.', no: 'That traction lines up the cystic duct and the common duct, and that illusion is behind most serious injuries.' } },
      { k: 'Dissection', h: 'Lift, look, then energy', l: 'High on the gallbladder, above Rouvière’s sulcus.', vis: { move: 'hook' }, refs: [5, 17, 25, 26] },
      { k: 'The key moment', h: 'Critical view of safety (CVS)', vis: { ai: 'chole', plain: 1 }, refs: [1, 2, 3, 19],
        cvs: { a: ['Hepatocystic triangle cleared of fat and tissue', 'Common duct seen along its full length', 'Lower third of the gallbladder off the liver bed', 'Only two structures enter the gallbladder', 'Cystic duct looks long and wide'], c: [0, 2, 3], ok: 'Strasberg’s three criteria. Now take a photo from the front and from behind, for the record.' } },
      { k: 'Decision', h: 'When does the first clip go on?', vis: { move: 'clip' }, refs: [1, 2, 29],
        q: { a: ['When the duct looks clear from one view', 'After CVS and a short pause to confirm out loud', 'As soon as the artery is exposed'], c: 1, ok: 'Right. CVS, then a short pause: the best-supported principle in this whole step.', no: 'A structure that looks like the cystic duct is exactly the trap. CVS first, then a pause to confirm.' } },
      { k: 'Division', h: 'Cold scissors, between the clips', l: 'No energy, then check the stump.', vis: { move: 'cut' }, refs: [25, 26] },
      { k: 'When it’s hard', h: 'Long dissection, still no CVS', vis: { ai: 'chole', plain: 1, dim: 1 }, refs: [3, 5, 6],
        q: { a: ['Clip the structure that looks like the cystic duct', 'Stop and choose a bailout: call for help, cholangiogram, fundus first or subtotal cholecystectomy', 'Keep dissecting deeper, below the sulcus'], c: 1, ok: 'Right. That isn’t failure, it’s a decision. The Tokyo Guidelines 2018 and the 2020 guideline define the bailout options.', no: 'This is exactly when injuries happen. Stop and choose a safe way out.' } },
      { k: 'Finish', h: 'That’s the foundation', l: 'Every step here rests on sources you can check.', vis: { ai: 'chole', plain: 1 }, refs: [47, 14, 42], end: 1 }
    ]
  };

  var P = { el: null, sim: null, i: 0, score: 0, asked: 0, done: {}, voice: true, audio: null, id: '' };
  try { P.voice = localStorage.getItem('orbit_sim_voice') !== '0'; } catch (e) {}

  function vis(st) {
    var v = st.vis || {};
    if (v.move) return O.movePlayer(v.move, { cls: 'big' });
    if (v.ai) return '<div class="simai' + (v.dim ? ' dim' : '') + '">' + A.ai(v.ai, { labels: !v.plain }) + '</div>';
    if (v.access) { var p = O.byId(P.id), ap = O.app.resolve(p, p.approaches.filter(function (a) { return a.key === P.sim.ap; })[0]); return '<div class="simfig">' + A.access(ap.access) + '</div>'; }
    return '';
  }
  /* the Hebrew takes are gone; stay silent until O.simAudio[<id>] marks a recorded (English) track */
  function hasAudio() { return !!(O.simAudio && O.simAudio[P.id]); }
  function play(i) {
    if (P.audio) { P.audio.pause(); P.audio = null; }
    if (!P.voice || !hasAudio()) return;
    var a = new Audio('audio/sim/' + P.id + '-' + String(i + 1).padStart(2, '0') + '.mp3');
    P.audio = a; a.play().catch(function () {});
  }
  function draw() {
    var sim = P.sim, st = sim.st[P.i], n = sim.st.length, gate = (st.q || st.cvs) && !P.done[P.i];
    var body = st.l ? '<p class="siml">' + esc(st.l) + '</p>' : '';
    if (st.q) body += '<div class="simq">' + st.q.a.map(function (a, j) { return '<button class="simo" data-j="' + j + '">' + esc(a) + '</button>'; }).join('') + '</div><div class="simfb" hidden></div>';
    if (st.cvs) body += '<div class="simq cvs">' + st.cvs.a.map(function (a, j) { return '<button class="simo" data-j="' + j + '" aria-pressed="false">' + esc(a) + '</button>'; }).join('') + '<button class="btn pri simchk">Check</button></div><div class="simfb" hidden></div>';
    if (st.end) body += '<div class="simend"><b>' + P.score + ' / ' + P.asked + '</b><span>right calls along the way</span><a class="btn" href="#/p/' + P.id + '">Full procedure page</a><a class="btn" href="#/skills">Skills lab</a><button class="btn pri" id="simagain">Start over</button></div>';
    P.el.innerHTML = '<div class="simbar"><button class="simx" aria-label="Close">✕</button><span class="simt">ORBIT · ' + esc(sim.title) + '</span>' +
      '<div class="simdots">' + sim.st.map(function (x, j) { return '<i class="' + (j < P.i ? 'past' : j === P.i ? 'on' : '') + '" title="' + esc(x.k) + '"></i>'; }).join('') + '</div>' +
      (hasAudio() ? '<button class="simv" aria-pressed="' + P.voice + '" aria-label="Narration">' + (P.voice ? '🔊' : '🔇') + '</button>' : '') + '</div>' +
      '<div class="simmain"><div class="simvis">' + vis(st) + '</div><div class="simtxt"><div class="kick">' + (P.i + 1) + ' / ' + n + ' · ' + esc(st.k) + '</div><h2>' + esc(st.h) + '</h2>' + body + O.refList(st.refs) + '</div></div>' +
      '<div class="simnav"><button class="btn" id="simprev"' + (P.i ? '' : ' disabled') + '>← Back</button>' + (hasAudio() ? '<button class="btn" id="simrep">↻ Play again</button>' : '') + '<button class="btn pri" id="simnext"' + (P.i < n - 1 && !gate ? '' : ' disabled') + '>Next →</button></div>';
    O.mountMoves(P.el);
    var $ = function (s) { return P.el.querySelector(s); };
    $('.simx').onclick = function () { close(); };
    if ($('.simv')) $('.simv').onclick = function () { P.voice = !P.voice; try { localStorage.setItem('orbit_sim_voice', P.voice ? '1' : '0'); } catch (e) {} if (!P.voice && P.audio) P.audio.pause(); draw(); if (P.voice) play(P.i); };
    $('#simprev').onclick = function () { go(P.i - 1); };
    $('#simnext').onclick = function () { go(P.i + 1); };
    if ($('#simrep')) $('#simrep').onclick = function () { var v = P.voice; P.voice = true; play(P.i); P.voice = v; };
    if (st.end) $('#simagain').onclick = function () { P.score = 0; P.asked = 0; P.done = {}; go(0); };
    var fb = $('.simfb');
    if (st.q) [].forEach.call(P.el.querySelectorAll('.simo'), function (b) {
      b.onclick = function () {
        if (P.done[P.i]) return;
        var j = +b.dataset.j, ok = j === st.q.c; P.done[P.i] = 1; P.asked++; if (ok) P.score++;
        [].forEach.call(P.el.querySelectorAll('.simo'), function (x) { x.disabled = true; if (+x.dataset.j === st.q.c) x.classList.add('ok'); else if (x === b) x.classList.add('bad'); });
        fb.hidden = false; fb.className = 'simfb ' + (ok ? 'ok' : 'bad'); fb.textContent = ok ? st.q.ok : st.q.no + ' ' + st.q.ok.replace(/^Right\. /, '');
        $('#simnext').disabled = false;
      };
    });
    if (st.cvs) {
      [].forEach.call(P.el.querySelectorAll('.simo'), function (b) { b.onclick = function () { if (P.done[P.i]) return; b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); }; });
      $('.simchk').onclick = function () {
        if (P.done[P.i]) return;
        var pick = [].filter.call(P.el.querySelectorAll('.simo'), function (b) { return b.getAttribute('aria-pressed') === 'true'; }).map(function (b) { return +b.dataset.j; }).sort().join(',');
        var ok = pick === st.cvs.c.join(','); P.done[P.i] = 1; P.asked++; if (ok) P.score++;
        [].forEach.call(P.el.querySelectorAll('.simo'), function (x) { x.disabled = true; x.classList.add(st.cvs.c.indexOf(+x.dataset.j) >= 0 ? 'ok' : (x.getAttribute('aria-pressed') === 'true' ? 'bad' : 'off')); });
        fb.hidden = false; fb.className = 'simfb ' + (ok ? 'ok' : 'bad'); fb.textContent = (ok ? 'Good. ' : 'Nearly. The three marked in green are the criteria. ') + st.cvs.ok;
        $('.simchk').disabled = true; $('#simnext').disabled = false;
      };
    }
  }
  function go(i) { if (i < 0 || i >= P.sim.st.length) return; P.i = i; draw(); play(i); }
  function close(quiet) { if (!P.el || P.el.hidden) return; if (P.audio) P.audio.pause(); P.audio = null; P.el.hidden = true; P.el.innerHTML = ''; document.body.style.overflow = ''; if (quiet !== true && location.hash.indexOf('#/sim/') === 0) location.hash = '#/p/' + P.id; }
  O.simClose = function () { close(true); };
  document.addEventListener('keydown', function (e) {
    if (!P.el || P.el.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') { var b = P.el.querySelector('#simnext'); if (b && !b.disabled) go(P.i + 1); }
    else if (e.key === 'ArrowLeft') go(P.i - 1);
  });
  O.simOpen = function (id, at) {
    if (!S[id]) return false;
    P.el = document.getElementById('simulator');
    if (!P.el) { P.el = document.createElement('div'); P.el.id = 'simulator'; P.el.className = 'sim'; P.el.setAttribute('role', 'dialog'); P.el.setAttribute('aria-label', 'Simulator'); document.body.appendChild(P.el); }
    P.el.hidden = false; document.body.style.overflow = 'hidden';
    P.id = id; P.sim = S[id]; P.score = 0; P.asked = 0; P.done = {};
    go(Math.max(0, Math.min((+at || 1) - 1, P.sim.st.length - 1)));
    return true;
  };
})();
