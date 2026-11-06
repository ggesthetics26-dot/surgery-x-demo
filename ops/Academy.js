/**
 * Surgery X · Academy (האקדמיה)
 * All the teaching of the department in one place, in four worlds: the department, the residents (Forge), the interns (Stage)
 * and the students (Campus). Campus runs the students' six-week rotation: a syllabus with an approval flow, lecturers,
 * attendance, a daily report, evening shifts in the ER, and a personal app for each student (?s=) and each lecturer (?l=).
 * Everything here is invented demo data of the fictional "Ofek Medical Center".
 *
 * Keys:
 *   acad:rot    { id, name, start (a Sunday), weeks, groups: [{ id, name, uni, students: [{ id, name, tk }] }] }
 *   acad:syl    { list: [{ id, w 1..6, day 0..4, from, to, t, kind, disc, lect (pid | 'g:<id>'), deck, mine {by, at}, pro {lid, at, ok, note}, pub, notes [{ t, by, at, done }] }] }
 *   acad:lect   { guests: [{ id, name, title, disc, tk }], unav: { <lid>: [{ d, why }] } }
 *   acad:att    { <date>: { <sid>: 'v' | 'x' | 'e' } }
 *   acad:me:<sid> { rep: { <date>: { st 'v'|'p'|'x', why, act [], learn, at } }, log: [{ id, d, t, role 'w'|'h'|'d', with, note }], rate: { <cid>: 1..5 }, shfb: { <date>: { l, i, r, t } } }
 *   acad:shift  { cfg: { from, to, cap, where, bring }, days: { <date>: { ids [sid], res (pid), att { sid: 'v'|'x' } } } }
 *   acad:lib    { list: [{ id, w 'd'|'r'|'i'|'s', sec, g, kind, t, by, d, disc, deck, at }] }
 *   acad:cfg    { goals: [{ t }], inn: [{ t }], news }
 * No patient details anywhere: a student's log holds the procedure, the date and who taught, nothing else.
 */
const ACAD_SEE_ = ['owner', 'director', 'deputy', 'chief', 'students', 'viewer'];
const ACAD_ED_ = ['owner', 'director', 'students'];
const ACAD_DISC_ = [['gen', 'כירורגיה כללית', '#2C5F6E'], ['hpb', 'כבד, לבלב ודרכי מרה', '#9A7B4F'], ['crc', 'קולורקטלית', '#B08A45'], ['breast', 'שד', '#A86A6A'], ['endo', 'אנדוקרינית', '#5E7A80'], ['trauma', 'טראומה', '#A3402E'], ['bari', 'בריאטרית', '#7A8F5C'], ['imaging', 'דימות', '#3E5960'], ['vasc', 'כלי דם', '#6B4E71']];
const ACAD_KIND_ = { lec: 'הרצאה', case: 'דיון מקרה', skill: 'סדנת מיומנות', sim: 'סימולציה', exam: 'מבחן' };
const ACAD_ACTS_ = ['ביקור בוקר', 'חדר ניתוח', 'מרפאה', 'מיון', 'טרום ניתוח', 'מפגש לימוד'];
const ACAD_PROCS_ = ['כריתת תוספתן', 'כריתת כיס מרה', 'תיקון בקע מפשעתי', 'תיקון בקע טבורי', 'כריתת מעי', 'ניקוז מורסה', 'הכנסת זונדה', 'הכנסת קטטר לשלפוחית', 'תפירת חתך', 'הוצאת סיכות', 'החלפת חבישה', 'עירוי ודגימת דם', 'אולטרסאונד ליד המיטה', 'כריתת בלוטת התריס', 'ניתוח שד'];
// the six weeks: one teaching session a day, Sunday to Thursday. Topics only, our own wording; [title, kind, discipline, sample deck]
const ACAD_SYL_ = [
  [['היכרות עם המערך ובטיחות בחדר הניתוח', 'skill', 'gen'], ['שטיפה, לבישה ושדה סטרילי', 'skill', 'gen', 'scrub-in'], ['הצגת מטופל בביקור', 'lec', 'gen', 'present'], ['הבטן החריפה: גישה ראשונית', 'lec', 'gen'], ['סדנת תפירה וקשירה', 'skill', 'gen']],
  [['נוזלים ומלחים אחרי ניתוח', 'lec', 'gen'], ['דלקת התוספתן', 'case', 'gen'], ['כיס המרה ודרכי המרה', 'lec', 'hpb'], ['המטופל הטראומטי: הסקר הראשוני', 'sim', 'trauma'], ['דיון מקרה: כאב ברום הבטן הימני', 'case', 'hpb']],
  [['בקע מפשעתי ובקע בדופן הבטן', 'lec', 'gen'], ['חסימת מעי', 'case', 'crc'], ['גוש בשד: גישה ובירור', 'lec', 'breast'], ['אולטרסאונד ליד המיטה', 'skill', 'imaging'], ['מבחן אמצע הסבב', 'exam', 'gen']],
  [['דימום ממערכת העיכול', 'lec', 'crc'], ['סרטן המעי הגס: מהאבחון לניתוח', 'lec', 'crc'], ['בלוטת התריס והפאראתירואיד', 'lec', 'endo'], ['סימולציית לפרוסקופיה', 'sim', 'gen'], ['דיון מקרה: חום ביום השלישי אחרי ניתוח', 'case', 'gen']],
  [['ניתוחים בריאטריים', 'lec', 'bari'], ['גושים בכבד ובלבלב', 'lec', 'hpb'], ['כוויות ופצעים', 'lec', 'trauma'], ['זיהום באתר הניתוח', 'lec', 'gen'], ['דימות בבטן החריפה', 'case', 'imaging']],
  [['איסכמיה חריפה של גפה', 'lec', 'vasc'], ['טראומה חודרת', 'sim', 'trauma'], ['המטופל המבוגר בכירורגיה', 'lec', 'gen'], ['חזרה לקראת הבחינה', 'case', 'gen'], ['מבחן סיום ומשוב על הסבב', 'exam', 'gen']]
];
const ACAD_GUESTS_ = [['imaging', 'ד״ר נועה ליבנה', 'מכון הדימות · אורחת'], ['vasc', 'ד״ר עדי שגב', 'כירורגיית כלי דם · אורח'], ['gen', 'אחות ענבל רום', 'אחות אחראית חדר ניתוח · אורחת']];

const acadAdd_ = (d, n) => addD_(d, n);
const acadId_ = p => p + Utilities.getUuid().replace(/-/g, '').slice(0, 8);
const acadTok_ = () => Utilities.getUuid().replace(/-/g, '').slice(0, 24);
function acadClean_(s, n) { return String(s == null ? '' : s).replace(/[<>]/g, '').trim().slice(0, n || 200); }
function acadPeople_() { return (get_('people') || []).filter(p => p.active !== false); }
// the date of a session: the rotation starts on a Sunday, week w (1..6), day 0..4
function acadDate_(R, x) { return acadAdd_(R.start, (x.w - 1) * 7 + x.day); }
function acadWeekOf_(R, d) { const n = Math.floor((new Date(d + 'T12:00:00') - new Date(R.start + 'T12:00:00')) / 864e5); return n < 0 ? 0 : Math.floor(n / 7) + 1; }
function acadStudents_(R) { return [].concat(...(R.groups || []).map(g => (g.students || []).map(s => Object.assign({ grp: g.id, gname: g.name }, s)))); }
function acadLectName_(lid, P, L) {
  if (!lid) return '';
  if (String(lid).indexOf('g:') === 0) { const g = ((L || {}).guests || []).find(x => 'g:' + x.id === lid); return g ? g.name : ''; }
  const p = P.find(x => x.id === lid); return p ? (p.full || p.name) : '';
}
// the stage of a session in the approval flow
function acadStage_(x) { if (!x.lect) return 'nolect'; if (x.pub) return 'pub'; if (!x.mine) return 'mine'; if (x.pro && !x.pro.ok) return 'pro'; return 'ready'; }

/* ---------------- the demo seed: a rotation in its third week, with everything already moving ---------------- */
function acadSeed_() {
  if (get_('acad:rot') && get_('acad:syl')) return;
  // the demo can open a student's or a lecturer's link before anyone signed in: the invented department is created first
  if (!get_('people') && typeof window !== 'undefined' && window.__SXDEMO) { set_('people', seedPeople_(), 'seed'); set_('settings', seedSettings_(), 'seed'); }
  try { mentorSeed_(); } catch (e) {}
  const P = acadPeople_(), today = todayIso_(); if (!P.length) return;
  let seed = 7331; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, pick = a => a[Math.floor(rnd() * a.length)];
  const by = last => (P.find(p => p.name === last) || {}).id || '', sun = d => { const x = new Date(d + 'T12:00:00'); return acadAdd_(d, -x.getDay()); };
  const start = acadAdd_(sun(today), -14), owner = 'אחראי הסטודנטים', now = new Date().toISOString();
  // the students: the groups of stud:roster when there are any, as a rotation of their own
  const ro = (get_('stud:roster') || {}).groups || [];
  const groups = (ro.length ? ro : studSeed_().groups).map((g, i) => ({ id: 'g' + (i + 1), name: g.name, uni: g.uni, students: String(g.students || '').split('\n').map(s => s.trim()).filter(Boolean).map((n, k) => ({ id: 's' + (i + 1) + String(k + 1).padStart(2, '0'), name: n, tk: acadTok_() })) }));
  const R = { id: 'r' + start.replace(/-/g, '').slice(2), name: 'סבב הכירורגיה · ' + ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'][+start.slice(5, 7) - 1] + ' ' + start.slice(0, 4), start: start, weeks: 6, groups: groups };
  const guests = ACAD_GUESTS_.map((g, i) => ({ id: 'q' + (i + 1), disc: g[0], name: g[1], title: g[2], tk: acadTok_() }));
  const lead = { gen: ['קדוש', 'וייס', 'דיין', 'לביא', 'מזרחי'], hpb: ['לנדאו', 'אלקיים'], crc: ['כספי', 'רוטמן'], breast: ['פרידמן'], endo: ['פרלמן'], trauma: ['אשכנזי', 'גולן'], bari: ['ברודסקי'], imaging: [], vasc: [] };
  const res = ['ברנע', 'נבון', 'סגל', 'ביטון', 'ספיר', 'קרסנוב'];
  const list = [], STEPS = ['היכרות', 'מושגי יסוד', 'דיון', 'סיכום'];
  ACAD_SYL_.forEach((wk, wi) => wk.forEach((s, di) => {
    const w = wi + 1, disc = s[2];
    let lect = '';
    if (s[1] === 'skill' || s[1] === 'sim') lect = by(pick(res));
    else if (disc === 'imaging') lect = 'g:q1'; else if (disc === 'vasc') lect = 'g:q2';
    else lect = by(pick(lead[disc] && lead[disc].length ? lead[disc] : lead.gen));
    if (wi === 0 && di === 0) lect = 'g:q3';
    if ((w === 5 && di === 3) || (w === 6 && (di === 0 || di === 2))) lect = '';
    const x = { id: 'c' + w + di, w: w, day: di, from: '13:00', to: '14:30', t: s[0], kind: s[1], disc: disc, lect: lect, deck: s[3] || 'auto', notes: [], steps: STEPS };
    if (s[1] === 'exam') { x.from = '12:00'; x.to = '14:00'; x.deck = ''; }
    if (w <= 3 && lect) { x.mine = { by: owner, at: now }; x.pro = { lid: lect, at: now, ok: now }; x.pub = now; }
    if (w === 4 && lect) { x.mine = { by: owner, at: now }; if (di % 2) x.pro = { lid: lect, at: acadAdd_(today, -6) + 'T09:00:00Z' }; else { x.pro = { lid: lect, at: now, ok: now, note: 'עברתי. עדכנתי שקף אחד' }; if (di === 0) x.pub = now; } }
    if (w === 5 && disc === 'hpb') x.lect = lect = by('לנדאו');
    if (w === 5 && lect) { x.mine = { by: owner, at: now }; x.pro = { lid: lect, at: acadAdd_(today, -2) + 'T09:00:00Z' }; }
    list.push(x);
  }));
  const nt = (id, t, done) => { const x = list.find(y => y.id === id); if (x) x.notes.push({ t: t, by: owner, at: now, done: done ? { at: now, by: owner } : null }); };
  nt('c21', 'להוסיף שקף על ההבדל בין ילדים למבוגרים', 1); nt('c32', 'הסטודנטים ביקשו עוד תמונות של בדיקה גופנית', 0); nt('c41', 'לקצר את החלק על הסטטיסטיקה', 0); nt('c13', 'מצוין. להשאיר כמו שהוא', 1);
  // attendance and the students' own records for the days that passed
  const S = acadStudents_(R), att = {}, days = [];
  for (let k = 0; k < 42; k++) { const d = acadAdd_(start, k), dw = new Date(d + 'T12:00:00').getDay(); if (dw <= 4 && d < today) days.push(d); }
  const LEARN = ['איך בודקים בטן בצורה מסודרת', 'ההבדל בין כאב קרבי לכאב פריאטלי', 'למה מסמנים צד לפני ניתוח', 'איך מציגים מטופל בשלוש דקות', 'סדר הפעולות בשטיפת ידיים', 'מתי מזמינים CT ומתי אולטרסאונד', 'איך נראית רשת בתיקון בקע', 'חשיבות הניוד המוקדם אחרי ניתוח', 'איך מודדים מאזן נוזלים', 'סימני אזהרה אחרי ניתוח מעי', 'קשר כירורגי ביד אחת', 'כמה זמן צום לפני ניתוח'];
  S.forEach((s, si) => {
    const me = { rep: {}, log: [], rate: {}, shfb: {} };
    days.forEach((d, k) => {
      const r = rnd(), a = r < .08 ? 'x' : r < .13 ? 'e' : 'v'; (att[d] = att[d] || {})[s.id] = a;
      // most write the daily report; a few skip the last days, so the dashboard has someone to remind
      if ((si % 7 === 3 && k >= days.length - 2) || rnd() < .06) return;
      const acts = ACAD_ACTS_.filter(() => rnd() < .45); if (!acts.length) acts.push('ביקור בוקר');
      me.rep[d] = a === 'x' ? { st: 'x', why: pick(['מחלה', 'מבחן בפקולטה', 'סיבה אישית']), act: [], learn: '', at: d + 'T17:30:00Z' } : { st: a === 'e' ? 'p' : 'v', why: a === 'e' ? 'יצאתי מוקדם' : '', act: acts, learn: pick(LEARN), at: d + 'T17:' + String(10 + si).slice(-2) + ':00Z' };
      if (a !== 'x' && rnd() < .55) me.log.push({ id: acadId_('l'), d: d, t: pick(ACAD_PROCS_), role: pick(['w', 'w', 'h', 'd']), with: 'ד״ר ' + pick(['ברנע', 'נבון', 'לנדאו', 'כספי', 'וייס', 'ספיר']), note: '' });
    });
    list.filter(x => acadDate_(R, x) < today && x.kind !== 'exam').forEach(x => { if (rnd() < .7) me.rate[x.id] = 3 + Math.floor(rnd() * 2.7); });
    set_('acad:me:' + s.id, me, 'seed');
  });
  // evening shifts in the ER: two students an evening, Sunday to Thursday, a resident in charge
  const R2 = P.filter(p => p.role === 'resident'), sh = { cfg: { from: '16:00', to: '22:00', cap: 2, where: 'המיון הכירורגי, עמדת הרופאים', bring: 'חלוק, סטטוסקופ, פנקס, תעודת סטודנט' }, days: {} };
  let si = 0;
  for (let k = 0; k < 42; k++) {
    const d = acadAdd_(start, k), dw = new Date(d + 'T12:00:00').getDay(); if (dw > 4) continue;
    const empty = d > today && (k % 9 === 4), ids = empty ? [] : [S[si % S.length].id, S[(si + 1) % S.length].id]; si += ids.length;
    const day = { ids: ids, res: (d > acadAdd_(today, 3) && k % 5 === 2) ? '' : (R2[k % R2.length] || {}).id || '', att: {} };
    if (d < today) ids.forEach((id, j) => { day.att[id] = (k + j) % 11 === 5 ? 'x' : 'v'; if (day.att[id] === 'v') { const m = get_('acad:me:' + id); if (m && rnd() < .7) { m.shfb[d] = { l: 3 + Math.floor(rnd() * 2.6), i: 3 + Math.floor(rnd() * 2.6), r: 3 + Math.floor(rnd() * 2.6), t: pick(['ראיתי בטן חריפה מההתחלה ועד חדר הניתוח', 'למדתי לתפור חתך קטן', 'התורן הסביר כל החלטה', 'ערב שקט, עברנו על צילומים']) }; set_('acad:me:' + id, m, 'seed'); } } });
    sh.days[d] = day;
  }
  // unavailability that the lecturers reported
  const unav = {}; const l1 = by('לנדאו'), l2 = by('אשכנזי');
  if (l1) unav[l1] = [{ d: acadAdd_(start, 30), why: 'כנס בחו״ל' }]; if (l2) unav[l2] = [{ d: acadAdd_(start, 36), why: 'כוננות טראומה' }];
  // the library of the four worlds
  const lib = [], L = (w, sec, g, kind, t, who, d, disc, deck) => lib.push({ id: 'b' + (lib.length + 1), w: w, sec: sec, g: g, kind: kind, t: t, by: who, d: d, disc: disc || 'gen', deck: deck === undefined ? 'auto' : deck, at: d + 'T08:00:00Z' });
  const d0 = n => acadAdd_(today, -n);
  L('d', 'meet', 'jc', 'jc', 'ג׳ורנל קלאב · ERAS בניתוחי מעי: מה באמת עובד', by('רוטמן'), d0(12), 'crc');
  L('d', 'meet', 'jc', 'jc', 'ג׳ורנל קלאב · ניהול שמרני של דלקת תוספתן', by('ספיר'), d0(26), 'gen');
  L('d', 'meet', 'jc', 'jc', 'ג׳ורנל קלאב · רשת או תפר בבקע טבורי קטן', by('נבון'), d0(40), 'gen');
  L('d', 'meet', 'mm', 'mm', 'M&M · סיכום החודש שעבר', by('גרינברג'), d0(5), 'gen');
  L('d', 'meet', 'mm', 'mm', 'M&M · דליפה מהחיבור: מה למדנו', by('כספי'), d0(33), 'crc');
  L('d', 'meet', 'meet', 'meet', 'ישיבת המערך · נוהל חדש לניתוחים דחופים בלילה', by('שמואלי'), d0(8), 'gen');
  L('d', 'meet', 'meet', 'meet', 'ישיבת המערך · יעדי השנה והמדדים', by('שחר'), d0(21), 'gen');
  L('d', 'research', 'res', 'res', 'המחקר במערך · זמני המתנה לכריתת כיס מרה', by('לנדאו'), d0(15), 'hpb');
  L('d', 'research', 'res', 'res', 'המחקר במערך · ניוד מוקדם אחרי ניתוחי מעי', by('כספי'), d0(44), 'crc');
  L('d', 'research', 'inn', 'inn', 'יזמות וחדשנות · ORBIT: תכנון ניתוח לפי ההנחיות', by('וייס'), d0(3), 'gen');
  L('d', 'research', 'inn', 'inn', 'יזמות וחדשנות · מדבקת דגימה שנסרקת בטלפון', by('רז'), d0(18), 'gen');
  L('r', 'teach', 'sem', 'sem', 'סמינר מתמחים · גישה לטראומה חודרת', by('ביטון'), d0(9), 'trauma');
  L('r', 'teach', 'sem', 'sem', 'סמינר מתמחים · פנקראטיטיס חריפה', by('קרסנוב'), d0(23), 'hpb');
  L('r', 'teach', 'sem', 'sem', 'סמינר מתמחים · דיברטיקוליטיס מסובכת', by('סגל'), d0(37), 'crc');
  L('r', 'teach', 'rev', 'jc', 'סקירת ספרות · ניהול חסימת מעי דק בבטן מנותחת', by('אדלר'), d0(16), 'crc');
  L('r', 'teach', 'rev', 'jc', 'סקירת ספרות · אנטיביוטיקה מונעת בניתוחים נקיים', by('שמש'), d0(30), 'gen');
  L('r', 'teach', 'skill', 'skill', 'סדנה · אנסטומוזה במעי על מודל', by('ברנע'), d0(11), 'gen');
  L('r', 'teach', 'skill', 'skill', 'סדנה · תפירה לפרוסקופית תוך גופית', by('נבון'), d0(29), 'gen');
  L('r', 'teach', 'guest', 'sem', 'הרצאת אורח · עקרונות בכירורגיה של כלי דם', 'ד״ר עדי שגב', d0(19), 'vasc');
  ['אנטומיה כירורגית של הבטן', 'פיזיולוגיה של המטופל הכירורגי', 'זיהומים בכירורגיה', 'טראומה', 'מערכת העיכול העליונה', 'המעי הדק והגס', 'כבד, לבלב ודרכי מרה', 'שד ואנדוקרינית', 'דופן הבטן ובקעים', 'כלי דם'].forEach((t, i) => L('r', 'stagea', 'topic', 'topic', 'שלב א׳ · ' + t, by(['גרינברג', 'לנדאו', 'קדוש', 'אשכנזי', 'דיין', 'כספי', 'לנדאו', 'פרידמן', 'וייס', 'דיין'][i]), d0(50 + i * 4), ['gen', 'gen', 'gen', 'trauma', 'gen', 'crc', 'hpb', 'breast', 'gen', 'vasc'][i], i < 6 ? 'auto' : ''));
  L('r', 'stageb', 'case', 'case', 'שלב ב׳ · מקרה לתרגול: כאב בטן וחום', by('גרינברג'), d0(14), 'gen');
  L('r', 'stageb', 'case', 'case', 'שלב ב׳ · מקרה לתרגול: גוש בצוואר', by('פרלמן'), d0(28), 'endo');
  L('i', 'intro', 'intro', 'intro', 'ברוכים הבאים לסבב: איך בנוי היום במערך', by('רז'), d0(25), 'gen');
  L('i', 'intro', 'intro', 'intro', 'התורנות הראשונה: מה עושים ואת מי מעירים', by('ברנע'), d0(25), 'gen');
  L('i', 'sem', 'sem', 'sem', 'סמינר סטאז׳רים · המטופל הכירורגי הדחוף', by('דיין'), d0(20), 'gen');
  L('i', 'sem', 'sem', 'sem', 'סמינר סטאז׳רים · סדנת תפירה', by('נבון'), d0(13), 'gen');
  L('i', 'sem', 'sem', 'sem', 'סמינר סטאז׳רים · דלקת התוספתן', by('וייס'), d0(6), 'gen');
  L('i', 'sem', 'sem', 'sem', 'סמינר סטאז׳רים · הלם, נוזלים ואלקטרוליטים', by('גרינברג'), d0(1), 'gen');
  L('s', 'intro', 'intro', 'intro', 'פתיחת הסבב: המערך, האגפים והאנשים', by('קדוש'), start, 'gen');
  L('s', 'intro', 'intro', 'intro', 'מה מצופה מסטודנט/ית בסבב', by('קדוש'), start, 'gen');
  L('s', 'files', 'file', 'file', 'מפת המערך וחדרי הניתוח', by('קדוש'), start, 'gen', '');
  L('s', 'files', 'file', 'file', 'נוהל לבוש והתנהגות בחדר הניתוח', by('קדוש'), start, 'gen', '');
  L('s', 'files', 'file', 'file', 'רשימת קריאה מומלצת לסבב', by('קדוש'), start, 'gen', '');
  set_('acad:rot', R, 'seed');
  set_('acad:syl', { list: list }, 'seed');
  set_('acad:lect', { guests: guests, unav: unav }, 'seed');
  set_('acad:att', att, 'seed');
  set_('acad:shift', sh, 'seed');
  set_('acad:lib', { list: lib }, 'seed');
  set_('acad:cfg', { goals: [{ t: 'כל מתמחה מציג/ה מאמר אחד ברבעון' }, { t: 'משוב על כל מפגש של הסטודנטים תוך שבוע' }, { t: 'כל מצגת עוברת אישור מקצועי לפני שהיא מגיעה לסטודנטים' }], inn: [{ t: 'ORBIT: תכנון ניתוח לפי ההנחיות, ישר מבנק הניתוחים' }, { t: 'סימולציית לפרוסקופיה פתוחה לסטודנטים בימי חמישי' }], news: true }, 'seed');
}

/* ---------------- the dashboard: everything in one call ---------------- */
function ops_acadAll(code) {
  const u = me_(code); if (ACAD_SEE_.indexOf(u.role) < 0) throw new Error('אין הרשאה');
  acadSeed_();
  const today = todayIso_(), R = get_('acad:rot'), Y = (get_('acad:syl') || {}).list || [], L = get_('acad:lect') || { guests: [], unav: {} }, P = acadPeople_();
  const S = acadStudents_(R), me = {}; S.forEach(s => { const m = get_('acad:me:' + s.id) || {}; me[s.id] = { rep: m.rep || {}, log: (m.log || []).length, logs: (m.log || []).slice(-40), rate: m.rate || {}, shfb: m.shfb || {} }; });
  const mo = today.slice(0, 7), mo2 = monAdd_(mo, 1), curr = [mo, mo2].map(k => ({ mo: k, c: get_('curr:' + k) || { items: [] }, att: get_('teachatt:' + k) || {} })), prev = monAdd_(mo, -1);
  curr.unshift({ mo: prev, c: get_('curr:' + prev) || { items: [] }, att: get_('teachatt:' + prev) || {} });
  const syl = Y.map(x => Object.assign({ date: acadDate_(R, x), stage: acadStage_(x), lname: acadLectName_(x.lect, P, L), pname: x.pro ? acadLectName_(x.pro.lid, P, L) : '' }, x));
  const out = { today: today, me: { role: u.role, name: u.name }, ed: ACAD_ED_.indexOf(u.role) >= 0, shiftEd: ACAD_ED_.concat(['chief']).indexOf(u.role) >= 0, libEd: ACAD_ED_.concat(['chief', 'deputy']).indexOf(u.role) >= 0, owner: u.role === 'owner',
    rot: R, students: S.map(s => ({ id: s.id, name: s.name, grp: s.grp, gname: s.gname, tk: ACAD_ED_.indexOf(u.role) >= 0 ? s.tk : '' })), syl: syl, lect: { guests: L.guests.map(g => ({ id: g.id, name: g.name, title: g.title, disc: g.disc, tk: ACAD_ED_.indexOf(u.role) >= 0 ? g.tk : '' })), unav: L.unav || {} },
    att: get_('acad:att') || {}, mine: me, shift: get_('acad:shift') || { cfg: {}, days: {} }, lib: (get_('acad:lib') || {}).list || [], cfg: get_('acad:cfg') || { goals: [], inn: [], news: true }, curr: curr, disc: ACAD_DISC_, kinds: ACAD_KIND_, acts: ACAD_ACTS_ };
  // a staff lecturer's personal page opens with his own link (owner and the students' coordinator only)
  if (out.ed) out.ltk = P.filter(p => p.role === 'senior' || p.role === 'resident' || p.role === 'house').reduce((o, p) => { o[p.id] = p.token; return o; }, {});
  return out;
}
function ops_acadSave(code, kind, x) {
  const u = me_(code), ed = ACAD_ED_.indexOf(u.role) >= 0; x = x || {};
  acadSeed_();
  const who = u.name, now = new Date().toISOString();
  if (['sess', 'mine', 'send', 'pub', 'note', 'notedone', 'gen', 'add', 'del'].indexOf(kind) >= 0) {
    if (!ed) throw new Error('רק אחראי הסטודנטים, מנהל המערך והבעלים עורכים את הסילבוס');
    const Y = get_('acad:syl') || { list: [] };
    if (kind === 'gen') { (x.list || []).slice(0, 40).forEach(g => { const s = Y.list.find(y => y.id === g.id); if (s && !s.lect) s.lect = String(g.lect || ''); }); set_('acad:syl', Y, who); return { ok: true }; }
    if (kind === 'add') { const s = { id: acadId_('c'), w: Math.max(1, Math.min(6, +x.w || 1)), day: Math.max(0, Math.min(4, +x.day || 0)), from: '13:00', to: '14:30', t: acadClean_(x.t, 120) || 'מפגש חדש', kind: ACAD_KIND_[x.kind] ? x.kind : 'lec', disc: x.disc || 'gen', lect: '', deck: 'auto', notes: [] }; Y.list.push(s); set_('acad:syl', Y, who); return s; }
    const s = Y.list.find(y => y.id === x.id); if (!s) throw new Error('המפגש לא נמצא');
    if (kind === 'del') { Y.list = Y.list.filter(y => y.id !== x.id); set_('acad:syl', Y, who); return { ok: true }; }
    if (kind === 'sess') {
      if ('t' in x) s.t = acadClean_(x.t, 120) || s.t; if ('kind' in x && ACAD_KIND_[x.kind]) s.kind = x.kind; if ('disc' in x && ACAD_DISC_.some(d => d[0] === x.disc)) s.disc = x.disc;
      if ('w' in x) s.w = Math.max(1, Math.min(6, +x.w)); if ('day' in x) s.day = Math.max(0, Math.min(4, +x.day)); if ('from' in x && /^\d\d:\d\d$/.test(x.from)) s.from = x.from; if ('to' in x && /^\d\d:\d\d$/.test(x.to)) s.to = x.to;
      if ('lect' in x && x.lect !== s.lect) { s.lect = String(x.lect || ''); if (s.pro && s.pro.lid !== s.lect) delete s.pro; }
    }
    if (kind === 'mine') { if (x.on) s.mine = { by: who, at: now }; else { delete s.mine; delete s.pub; } }
    if (kind === 'send') { if (!x.lid) throw new Error('צריך לבחור מרצה'); s.pro = { lid: String(x.lid), at: now }; }
    if (kind === 'pub') { if (x.on) { if (!s.lect) throw new Error('אין עדיין מלמד/ת'); s.pub = now; } else delete s.pub; }
    if (kind === 'note') { const t = acadClean_(x.t, 400); if (!t) throw new Error('ההערה ריקה'); (s.notes = s.notes || []).push({ t: t, by: who, at: now, done: null }); }
    if (kind === 'notedone') { const n = (s.notes || [])[+x.i]; if (!n) throw new Error('ההערה לא נמצאה'); n.done = x.on ? { by: who, at: now } : null; }
    set_('acad:syl', Y, who); return s;
  }
  if (kind === 'att') {
    if (!ed) throw new Error('אין הרשאה'); if (!/^\d{4}-\d\d-\d\d$/.test(x.d || '')) throw new Error('תאריך לא תקין');
    const A = get_('acad:att') || {}; A[x.d] = A[x.d] || {}; if (['v', 'x', 'e'].indexOf(x.v) >= 0) A[x.d][x.sid] = x.v; else delete A[x.d][x.sid]; set_('acad:att', A, who); return A[x.d];
  }
  if (kind === 'shift' || kind === 'shcfg') {
    if (ACAD_ED_.concat(['chief']).indexOf(u.role) < 0) throw new Error('אין הרשאה');
    const H = get_('acad:shift') || { cfg: {}, days: {} };
    if (kind === 'shcfg') { ['from', 'to', 'where', 'bring'].forEach(k => { if (k in x) H.cfg[k] = acadClean_(x[k], 160); }); if ('cap' in x) H.cfg.cap = Math.max(1, Math.min(6, +x.cap || 2)); }
    else { if (!/^\d{4}-\d\d-\d\d$/.test(x.d || '')) throw new Error('תאריך לא תקין'); const D = H.days[x.d] = H.days[x.d] || { ids: [], res: '', att: {} }; if (u.role === 'chief') { D.res = String(x.res || ''); } else { if (x.ids) D.ids = x.ids.slice(0, 6).map(String); if ('res' in x) D.res = String(x.res || ''); if (x.att) D.att = x.att; } }
    set_('acad:shift', H, who); return H;
  }
  if (kind === 'lib' || kind === 'libdel') {
    if (ACAD_ED_.concat(['chief', 'deputy']).indexOf(u.role) < 0) throw new Error('אין הרשאה');
    const B = get_('acad:lib') || { list: [] };
    if (kind === 'libdel') B.list = B.list.filter(b => b.id !== x.id);
    else { const t = acadClean_(x.t, 140); if (!t) throw new Error('צריך כותרת'); B.list.unshift({ id: acadId_('b'), w: ['d', 'r', 'i', 's'].indexOf(x.w) >= 0 ? x.w : 'd', sec: acadClean_(x.sec, 20), g: acadClean_(x.g, 20), kind: acadClean_(x.kind, 12) || 'sem', t: t, by: acadClean_(x.by, 60), d: /^\d{4}-\d\d-\d\d$/.test(x.d || '') ? x.d : todayIso_(), disc: x.disc || 'gen', deck: 'auto', at: now }); }
    set_('acad:lib', B, who); return B.list;
  }
  if (kind === 'guest') {
    if (!ed) throw new Error('אין הרשאה'); const L = get_('acad:lect') || { guests: [], unav: {} }, n = acadClean_(x.name, 60); if (!n) throw new Error('צריך שם');
    L.guests.push({ id: acadId_('q'), name: n, title: acadClean_(x.title, 80), disc: x.disc || 'gen', tk: acadTok_() }); set_('acad:lect', L, who); return L.guests;
  }
  if (kind === 'cfg') {
    if (u.role !== 'owner') throw new Error('רק הבעלים משנים את הפס הרץ');
    const rd = a => (a || []).slice(0, 12).map(t => ({ t: acadClean_(t, 160) })).filter(g => g.t);
    set_('acad:cfg', { goals: rd(x.goals), inn: rd(x.inn), news: x.news !== false }, who); return get_('acad:cfg');
  }
  throw new Error('פעולה לא מוכרת');
}

/* ---------------- the student's app (?s=<token>) ---------------- */
function acadStudByTok_(tk) {
  tk = String(tk || ''); acadSeed_();
  const R = get_('acad:rot'); if (!R) throw new Error('אין עדיין סבב');
  const S = acadStudents_(R);
  // the demo opens the first student with ?s=demo, or student n with ?s=demo<n>
  const dm = /^demo(\d*)$/.exec(tk); if (dm && typeof window !== 'undefined' && window.__SXDEMO) return { R: R, s: S[Math.max(0, Math.min(S.length - 1, (+dm[1] || 1) - 1))] };
  if (tk.length < 16) throw new Error('הקישור לא תקין');
  const s = S.find(x => x.tk === tk); if (!s) throw new Error('הקישור לא נמצא. בקשו קישור חדש מאחראי הסטודנטים');
  return { R: R, s: s };
}
function ops_acadStud(tk) {
  const o = acadStudByTok_(tk), R = o.R, s = o.s, today = todayIso_(), P = acadPeople_(), L = get_('acad:lect') || { guests: [] };
  const Y = ((get_('acad:syl') || {}).list || []).map(x => ({ id: x.id, w: x.w, day: x.day, date: acadDate_(R, x), from: x.from, to: x.to, t: x.t, kind: x.kind, disc: x.disc, lname: acadLectName_(x.lect, P, L), deck: x.pub ? x.deck : '' }));
  const H = get_('acad:shift') || { cfg: {}, days: {} }, mine = get_('acad:me:' + s.id) || { rep: {}, log: [], rate: {}, shfb: {} };
  const shifts = Object.keys(H.days).filter(d => (H.days[d].ids || []).indexOf(s.id) >= 0).sort().map(d => { const D = H.days[d], rp = P.find(p => p.id === D.res); return { d: d, res: rp ? (rp.full || rp.name) : '', with: D.ids.filter(i => i !== s.id).map(i => (acadStudents_(R).find(x => x.id === i) || {}).name || ''), att: (D.att || {})[s.id] || '' }; });
  const A = get_('acad:att') || {}, att = {}; Object.keys(A).forEach(d => { if (A[d][s.id]) att[d] = A[d][s.id]; });
  const files = ((get_('acad:lib') || {}).list || []).filter(b => b.w === 'i' ? false : b.w === 's').map(b => ({ id: b.id, t: b.t, sec: b.sec, deck: b.deck }));
  const kd = P.find(p => /סטודנטים/.test(p.title || ''));
  return { today: today, me: { id: s.id, name: s.name, first: s.name.split(' ')[0], gname: s.gname }, rot: { name: R.name, start: R.start, weeks: R.weeks, week: acadWeekOf_(R, today) }, syl: Y, shifts: shifts, shcfg: H.cfg, att: att, mine: mine, files: files, acts: ACAD_ACTS_, procs: ACAD_PROCS_, kinds: ACAD_KIND_, disc: ACAD_DISC_, contact: kd ? (kd.full || kd.name) + ' · ' + (kd.title || '') : '' };
}
function ops_acadStudSave(tk, kind, x) {
  const o = acadStudByTok_(tk), R = o.R, s = o.s, today = todayIso_(), key = 'acad:me:' + s.id, m = get_(key) || { rep: {}, log: [], rate: {}, shfb: {} }; x = x || {};
  ['rep', 'log', 'rate', 'shfb'].forEach(k => { if (!m[k]) m[k] = k === 'log' ? [] : {}; });
  const inRot = d => /^\d{4}-\d\d-\d\d$/.test(d || '') && d >= R.start && d <= acadAdd_(R.start, R.weeks * 7) && d <= today;
  if (kind === 'rep') {
    if (!inRot(x.d)) throw new Error('אפשר לדווח רק על ימים של הסבב שכבר היו');
    if (x.d < acadAdd_(today, -5)) throw new Error('אפשר לדווח עד 5 ימים אחורה');
    if (['v', 'p', 'x'].indexOf(x.st) < 0) throw new Error('בחרו: הייתי, חלקית או לא הייתי');
    m.rep[x.d] = { st: x.st, why: x.st === 'v' ? '' : acadClean_(x.why, 120), act: x.st === 'x' ? [] : (x.act || []).filter(a => ACAD_ACTS_.indexOf(a) >= 0), learn: acadClean_(x.learn, 160), at: new Date().toISOString() };
  } else if (kind === 'log') {
    if (!inRot(x.d)) throw new Error('תאריך מחוץ לסבב'); const t = acadClean_(x.t, 80); if (!t) throw new Error('מה היה הניתוח או הפעולה?');
    m.log.push({ id: acadId_('l'), d: x.d, t: t, role: ['w', 'h', 'd'].indexOf(x.role) >= 0 ? x.role : 'w', with: acadClean_(x.with, 60), note: acadClean_(x.note, 160) }); m.log = m.log.slice(-300);
  } else if (kind === 'logdel') { m.log = m.log.filter(l => l.id !== x.id); }
  else if (kind === 'rate') {
    const c = ((get_('acad:syl') || {}).list || []).find(y => y.id === x.id); if (!c) throw new Error('המפגש לא נמצא');
    if (acadDate_(R, c) > today) throw new Error('אפשר לדרג רק מפגש שכבר היה'); const n = +x.n; if (!(n >= 1 && n <= 5)) throw new Error('דירוג 1 עד 5'); m.rate[c.id] = n;
  } else if (kind === 'shfb') {
    const H = get_('acad:shift') || { days: {} }, D = H.days[x.d]; if (!D || (D.ids || []).indexOf(s.id) < 0) throw new Error('זו לא משמרת שלך'); if (x.d > today) throw new Error('אפשר למלא רק אחרי המשמרת');
    const r = k => Math.max(1, Math.min(5, +x[k] || 3)); m.shfb[x.d] = { l: r('l'), i: r('i'), r: r('r'), t: acadClean_(x.t, 160) };
  } else throw new Error('פעולה לא מוכרת');
  set_(key, m, '');
  return m;
}

/* ---------------- the lecturer's page (?l=<token>): a staff doctor by his personal link, a guest by his own ---------------- */
function acadLectByTok_(tk) {
  tk = String(tk || ''); acadSeed_();
  const L = get_('acad:lect') || { guests: [], unav: {} }, P = acadPeople_();
  const dm = /^as-(.+)$/.exec(tk); if (dm && typeof window !== 'undefined' && window.__SXDEMO) { const p = P.find(x => x.name === decodeURIComponent(dm[1])); if (p) return { lid: p.id, name: p.full || p.name, title: p.title || '', staff: true, role: p.role }; }
  if (tk.length < 16) throw new Error('הקישור לא תקין');
  const g = (L.guests || []).find(x => x.tk === tk); if (g) return { lid: 'g:' + g.id, name: g.name, title: g.title || '', staff: false, disc: g.disc };
  const p = P.find(x => x.token === tk); if (p) return { lid: p.id, name: p.full || p.name, title: p.title || '', staff: true, role: p.role };
  throw new Error('הקישור לא נמצא');
}
function ops_acadLect(tk) {
  const me = acadLectByTok_(tk), R = get_('acad:rot'), today = todayIso_(), Y = (get_('acad:syl') || {}).list || [], L = get_('acad:lect') || { guests: [], unav: {} }, P = acadPeople_(), S = acadStudents_(R);
  // the ratings of my sessions, without names
  const rate = id => { const v = S.map(s => ((get_('acad:me:' + s.id) || {}).rate || {})[id]).filter(n => n > 0); return { n: v.length, avg: v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length * 10) / 10 : 0 }; };
  const sess = x => ({ id: x.id, w: x.w, day: x.day, date: acadDate_(R, x), from: x.from, to: x.to, t: x.t, kind: x.kind, disc: x.disc, deck: x.deck, lname: acadLectName_(x.lect, P, L), mine: x.lect === me.lid, pro: x.pro && x.pro.lid === me.lid ? x.pro : null, notes: (x.notes || []).filter(n => !n.done).map(n => n.t) });
  const review = Y.filter(x => x.pro && x.pro.lid === me.lid).map(sess), mineS = Y.filter(x => x.lect === me.lid).map(x => Object.assign(sess(x), { r: acadDate_(R, x) < today ? rate(x.id) : null }));
  const discs = {}; mineS.concat(review).forEach(x => discs[x.disc] = 1); if (me.disc) discs[me.disc] = 1;
  const H = get_('acad:shift') || { days: {} }, shifts = me.staff ? Object.keys(H.days).filter(d => H.days[d].res === me.lid).sort().map(d => ({ d: d, students: (H.days[d].ids || []).map(i => (S.find(s => s.id === i) || {}).name || '') })) : [];
  return { today: today, me: me, rot: { name: R.name, start: R.start, weeks: R.weeks, week: acadWeekOf_(R, today) }, review: review, mine: mineS, all: Y.map(sess), unav: (L.unav || {})[me.lid] || [], shifts: shifts, lib: ((get_('acad:lib') || {}).list || []).filter(b => discs[b.disc] && b.w !== 's').slice(0, 12), disc: ACAD_DISC_, kinds: ACAD_KIND_ };
}
function ops_acadLectSave(tk, kind, x) {
  const me = acadLectByTok_(tk); x = x || {}; const now = new Date().toISOString();
  if (kind === 'ok' || kind === 'note') {
    const Y = get_('acad:syl') || { list: [] }, s = Y.list.find(y => y.id === x.id); if (!s || !s.pro || s.pro.lid !== me.lid) throw new Error('המצגת הזו לא נשלחה אליך');
    if (kind === 'ok') { s.pro.ok = now; s.pro.note = acadClean_(x.note, 300); }
    else { const t = acadClean_(x.t, 400); if (!t) throw new Error('ההערה ריקה'); (s.notes = s.notes || []).push({ t: t, by: me.name, at: now, done: null }); }
    set_('acad:syl', Y, me.name); return ops_acadLect(tk);
  }
  if (kind === 'unav') {
    const L = get_('acad:lect') || { guests: [], unav: {} }; L.unav = L.unav || {};
    L.unav[me.lid] = (x.list || []).slice(0, 30).filter(u => /^\d{4}-\d\d-\d\d$/.test(u.d || '')).map(u => ({ d: u.d, why: acadClean_(u.why, 80) }));
    set_('acad:lect', L, me.name); return ops_acadLect(tk);
  }
  throw new Error('פעולה לא מוכרת');
}

/* ---------------- Pulse: what needs a hand in the Academy ---------------- */
function acadOrbit_(M, al, today) {
  acadSeed_();
  const R = get_('acad:rot'), Y = (get_('acad:syl') || {}).list || [], H = get_('acad:shift') || { days: {} }, S = acadStudents_(R); if (!R || !Y.length) return;
  const wk = acadWeekOf_(R, today), soon = Y.filter(x => { const d = acadDate_(R, x); return d >= today && d <= acadAdd_(today, 10); });
  const noL = soon.filter(x => !x.lect), late = Y.filter(x => x.pro && !x.pro.ok && x.pro.at.slice(0, 10) <= acadAdd_(today, -5)), ready = Y.filter(x => acadStage_(x) === 'pub' || acadStage_(x) === 'ready');
  const noRes = Object.keys(H.days).filter(d => d >= today && d <= acadAdd_(today, 7) && !H.days[d].res);
  let yd = acadAdd_(today, -1); while (new Date(yd + 'T12:00:00').getDay() > 4) yd = acadAdd_(yd, -1);
  const miss = yd >= R.start ? S.filter(s => !((get_('acad:me:' + s.id) || {}).rep || {})[yd]) : [];
  M.acad = { score: Y.length ? Math.round(ready.length / Y.length * 100) : 100, k: [[wk > 0 && wk <= R.weeks ? wk + '/' + R.weeks : '—', 'שבוע בסבב'], [noL.length, 'מפגשים בלי מלמד/ת']] };
  if (noL.length) al(2, 'acad', `${noL.length === 1 ? 'מפגש אחד' : noL.length + ' מפגשים'} של הסטודנטים ב־10 הימים הקרובים בלי מלמד/ת`, noL.map(x => x.t).slice(0, 3).join(' · '), 'acad');
  if (noRes.length) al(2, 'acad', `${noRes.length === 1 ? 'משמרת ערב אחת' : noRes.length + ' משמרות ערב'} במיון השבוע בלי מתמחה אחראי/ת`, '', 'acad');
  if (late.length) al(1, 'acad', `${late.length === 1 ? 'מצגת אחת מחכה' : late.length + ' מצגות מחכות'} לאישור מקצועי יותר מ־5 ימים`, late.map(x => x.t).slice(0, 2).join(' · '), 'acad');
  if (miss.length) al(1, 'acad', `${miss.length === 1 ? 'סטודנט/ית אחד/ת לא מילא/ה' : miss.length + ' סטודנטים לא מילאו'} את הדיווח היומי של אתמול`, miss.slice(0, 3).map(s => s.name).join(' · '), 'acad');
}
