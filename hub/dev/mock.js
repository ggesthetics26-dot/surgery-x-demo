/* Local test harness: stands in for google.script.run with realistic data.
   Never pushed (see .claspignore). Open dev/out/dash.html or dev/out/intern.html?t=<key> */
(function () {
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const pick = a => a[Math.floor(rnd() * a.length)];
  const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const P = new URLSearchParams(location.search);
  if (P.get('today')) { const RD = Date, shift = new RD(P.get('today') + 'T' + (P.get('time') || new RD().toTimeString().slice(0, 8))).getTime() - RD.now(); window.Date = class extends RD { constructor(...a) { if (!a.length) super(RD.now() + shift); else super(...a); } static now() { return RD.now() + shift; } }; }
  const TODAY = P.get('today') || iso(new Date());
  const addD = (s, n) => { const p = s.split('-'); const d = new Date(+p[0], +p[1] - 1, +p[2], 12); d.setDate(d.getDate() + n); return iso(d); };
  const dow = s => { const p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2], 12).getDay(); };
  const HM = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
  const tp = TODAY.split('-'), CUR = HM[+tp[1] - 1] + ' ' + tp[0], NEXT = HM[(+tp[1]) % 12] + ' ' + (+tp[1] === 12 ? +tp[0] + 1 : tp[0]);
  const MS = tp[0] + '-' + tp[1] + '-01';
  const MEND = iso(new Date(+tp[0], +tp[1], 0, 12));
  const N = Math.max(0, Math.min(16, Number(P.get('n') || 16)));
  const PEOPLE = [
    ['נועה כהן', 'women/44', 'אוניברסיטת המרכז', 'רגיל', 'צפון'],
    ['איתי לוי', 'men/32', 'אוניברסיטת ההר', 'אלקטיב', 'דרום'],
    ['אריאל חזן', 'men/75', 'בית הספר לרפואה ע״ש הגליל', 'רגיל', 'צפון'],
    ['רוני עמית', 'women/65', 'אוניברסיטת אוניברסיטת השרון', 'רגיל', 'דרום'],
    ['יעל ברק', 'women/26', 'אוניברסיטת אוניברסיטת הנגב המערבי', 'רגיל', 'צפון'],
    ['אלעד סער', 'men/52', 'אוניברסיטת המרכז', 'רגיל', 'דרום'],
    ['שירה מזרחי-גולדנברג', 'women/90', 'אוניברסיטת אוניברסיטת השומרון', 'סלקטיב', ''],
    ['דניאל אברהם', 'men/11', 'אוניברסיטת ההר', 'רק תורנויות', ''],
    ['תמר שושן', 'women/3', 'בית הספר לרפואה ע״ש הגליל', 'רגיל', 'צפון'],
    ['עומר נחמיאס', 'men/41', 'אוניברסיטת אוניברסיטת השרון', 'אלקטיב', 'דרום'],
    ['ליאור פרץ', 'women/57', 'אוניברסיטת המרכז', 'רגיל', 'צפון'],
    ['סהר חורב', 'men/86', 'אוניברסיטת אוניברסיטת הנגב המערבי', 'רגיל', 'דרום'],
    ['הדר שמעוני', 'women/12', 'אוניברסיטת המרכז', 'רגיל', 'צפון'],
    ['לינוי שרון', 'women/71', 'בית הספר לרפואה ע״ש הגליל', 'רגיל', 'דרום'],
    ['גיא בר־און', 'men/45', 'אוניברסיטת ההר', 'אלקטיב', 'צפון'],
    ['רון אדלר', 'men/18', 'אוניברסיטת אוניברסיטת השומרון', 'רק תורנויות', '']
  ];
  const sk = base => [0, 1, 2, 3, 4, 5].map(() => Math.max(1, Math.min(5, Math.round(base + rnd() * 1.6 - .8))));
  const interns = [];
  PEOPLE.slice(0, N).forEach((p, k) => {
    const email = 'intern' + k + '@example.com', key = email + '|' + CUR;
    const noPhoto = k === 5;
    interns.push({ key, email, month: CUR, name: p[0], phone: '05' + (2 + k % 7) + '-' + String(1234567 + k * 1111).slice(0, 7), inst: p[2], imonth: String(1 + (k * 5) % 12), interest: pick(['כירורגיה כללית', 'אורתופדיה', 'עדיין לא יודע/ת', 'כירורגיית כלי דם']),
      expect: 'ללמוד לכתוב קבלה טובה, להיות בחדר ניתוח ולהרגיש חלק מהצוות.', photoId: noPhoto ? '' : 'ph' + k,
      start: sk(2.2), mid: k % 3 === 2 ? null : sk(3.1), end: null, midSat: 4, works: k % 3 === 2 ? '' : 'הצוות מאוד מלמד ומכיל', improve: k % 4 === 0 ? 'יותר זמן בחדר ניתוח' : '',
      sat: null, seminar: null, recommend: null, consider: '', free: '', staff: k === 1 ? { skills: sk(4), prof: 5, cand: 'כן', summary: 'מצוין', by: 'ד״ר איתן רז', date: '10/10/2026 12:00' } : k === 4 ? { skills: sk(3), prof: 4, cand: '', summary: '', by: 'ד״ר טל', date: '12/10/2026 12:00' } : null,
      stages: { 'פתיחה': true, 'אמצע': k % 3 !== 2 }, blocked: [addD(MS, 3 + k), addD(MS, 11 + k)], dutyNote: k === 2 ? 'מעדיף לא בשבת' : '', track: p[3], thuFri: p[3] === 'רק תורנויות', extra: p[3] === 'רק תורנויות' ? false : k % 2 === 0, absPlan: k === 4 ? 'חופש 20-21 בחודש' : '',
      link: location.origin + location.pathname.replace('dash.html', 'intern.html') + '?t=' + encodeURIComponent(key), wing: p[4], manual: false, edited: false, photoUrl: noPhoto ? '' : '../../avatars/' + p[1].replace('/', '-') + '.jpg' });
  });
  const nextInterns = [['גל אורן', 'men/22'], ['מאיה רוזן', 'women/33'], ['ים חן', 'women/68'], ['אסף ביטון', 'men/61']].map((p, k) => ({ key: 'next' + k + '@example.com|' + NEXT, email: 'next' + k + '@example.com', month: NEXT, name: p[0], phone: '0501112233', inst: 'אוניברסיטת המרכז', interest: '', expect: '', photoId: 'nx' + k, photoUrl: '../../avatars/' + p[1].replace('/', '-') + '.jpg', start: sk(2), mid: null, end: null, staff: null, stages: { 'פתיחה': true }, blocked: [], track: k === 3 ? 'סלקטיב' : k === 1 ? 'אלקטיב' : 'רגיל', extra: false, wing: k % 2 ? 'דרום' : 'צפון', link: '' }));
  const ALLI = interns.concat(nextInterns);
  const photoMap = {}; ALLI.forEach(i => { if (i.photoId) photoMap[i.photoId] = i.photoUrl; });

  const stations = [
    { id: 'north', name: 'מחלקה – אגף צפון', short: 'צפון', color: '#1F4E79', days: [0, 1, 2, 3, 4], min: 1, wing: 'צפון' },
    { id: 'south', name: 'מחלקה – אגף דרום', short: 'דרום', color: '#8E4F12', days: [0, 1, 2, 3, 4], min: 1, wing: 'דרום' },
    { id: 'or', name: 'חדר ניתוח', short: 'חדר ניתוח', color: '#187A5C', days: [0, 1, 2, 3, 4], min: 1, wing: '' },
    { id: 'preop', name: 'מרפאת טרום ניתוח', short: 'טרום ניתוח', color: '#8D6E3F', days: [2, 3], min: 1, wing: 'לפי יום', dw: ['', '', 'צפון', 'דרום', ''], addon: true },
    { id: 'er', name: 'מיון כירורגי', short: 'מיון', color: '#A3402E', days: [0, 1, 2, 3, 4], min: 1, wing: '' },
    { id: 'trauma', name: 'יחידת הטראומה', short: 'טראומה', color: '#2C6E6A', days: [0, 1, 2, 3, 4], min: 1, wing: '', trauma: true }
  ];
  const duties = [], fmorn = [];
  const regs = interns.filter(i => i.track !== 'סלקטיב');
  if (interns.length) for (let d = MS, k = 0; d <= MEND; d = addD(d, 1), k++) {
    const a = interns[(k * 3) % interns.length], b = interns[(k * 3 + 1) % interns.length];
    duties.push({ month: CUR, date: d, key: a.key, name: a.name, locked: false, slot: 'dept' });
    if (k % 4 !== 3) duties.push({ month: CUR, date: d, key: b.key, name: b.name, locked: false, slot: 'er' });
    if (dow(d) === 5 && regs.length) { const f = regs[(k * 5) % regs.length]; fmorn.push({ month: CUR, date: d, key: f.key, name: f.name, slot: 'fm' }); }
  }
  const assigns = [], absences = [];
  const sun0 = addD(TODAY, -dow(TODAY));
  for (let w = -2; w <= 1; w++) for (let k = 0; k < 5; k++) {
    const d = addD(sun0, w * 7 + k); if (d < MS) continue;
    interns.forEach((i, j) => {
      const post = duties.some(x => x.key === i.key && x.date === addD(d, -1));
      if (post) return;
      if (j === 4 && w === 0 && k === 1) { absences.push({ date: d, key: i.key, name: i.name, reason: 'מחלה' }); return; }
      const st = ['north', 'south', 'or', 'er'][(j + k + w) % 4];
      assigns.push({ date: d, key: i.key, name: i.name, station: i.wing === 'דרום' && st === 'north' ? 'south' : i.wing === 'צפון' && st === 'south' ? 'north' : st, locked: false });
      if ((k === 2 || k === 3) && j % 4 === 0) assigns.push({ date: d, key: i.key, name: i.name, station: 'preop', locked: true });
    });
  }
  const weekState = {}; weekState[addD(sun0, -14)] = { pub: '01/10 08:00', pubTs: 2, draft: '01/10', draftTs: 1 }; weekState[addD(sun0, -7)] = { pub: '08/10 08:00', pubTs: 2, draft: '', draftTs: 1 }; weekState[sun0] = { pub: '13/10 20:00', pubTs: 2, draftTs: 1, draft: 'x' }; weekState[addD(sun0, 7)] = { draft: '15/10 21:00', draftTs: 5 };
  const DL = [['morning','השתתפתי בישיבת הבוקר'],['teach','השתתפתי בישיבת לימודים'],['round','השתתפתי בביקור'],['pres','הצגתי מטופל בביקור'],['blood','לקחתי דמים'],['iv','הכנסתי וונפלונים'],['ecg','ביצעתי אק״ג'],['adm','כתבתי קבלה'],['dis','כתבתי מכתב שחרור'],['er','עבדתי במיון'],['preop','עבדתי בטרום ניתוח'],['or','הייתי בחדר ניתוח'],['proc','ביצעתי פעולה או תפירה'],['clinic','הייתי במרפאה או בייעוץ']];
  const daylogs = [];
  interns.forEach((i, j) => {
    for (let d = MS; d <= TODAY; d = addD(d, 1)) {
      if (dow(d) > 4) continue;
      if (duties.some(x => x.key === i.key && x.date === addD(d, -1))) continue;
      if (d === TODAY && j % 2) continue;
      if (j === 3 && rnd() < .45) continue;
      if (rnd() < .08) continue;
      const ab = absences.find(a => a.key === i.key && a.date === d);
      const tasks = DL.filter(() => rnd() < .38).map(t => t[0]);
      const thu = dow(d) === 4;
      daylogs.push({ date: d, key: i.key, name: i.name, month: CUR, kind: thu ? 'שבועי' : 'יומי', present: !ab, status: ab ? ab.reason : 'עבדתי', reason: ab ? ab.reason : '', tasks: ab ? [] : tasks, note: '',
        exposure: thu ? pick(['לפרוסקופיה של כיס מרה', 'ניקוז אבצס במיון', 'קבלה מלאה של חולה עם חסימת מעי']) : '', eff: thu ? 2 + Math.floor(rnd() * 4) : 0, prog: thu ? 3 + Math.floor(rnd() * 3) : 0, belong: thu ? (j === 3 ? 2 : 3 + Math.floor(rnd() * 3)) : 0, teach: thu ? 3 + Math.floor(rnd() * 3) : 0,
        feel: thu ? pick(['מרגיש/ה חלק מהצוות', 'עמוס אבל מעניין', 'הייתי רוצה יותר הדרכה בבוקר']) : '', improve: thu && j === 3 ? 'קשה לי להשתלב בביקור' : '', skills: null, sat: 0, seminar: 0, recommend: 0, consider: '', free: '', at: d + ' 16:30' });
    }
  });
  const feedback = [
    { date: '14/10/2026 18:22', month: CUR, name: interns[0] ? interns[0].name : 'אנונימי', text: 'הסמינר על אבחנה מבדלת של בטן חריפה היה מעולה. אפשר עוד כאלה?', topic: 'הוראה ולמידה', mood: 5 },
    { date: '12/10/2026 21:05', month: CUR, name: 'אנונימי', text: 'בימים עמוסים קשה להשתלב בביקור. אולי לחלק תפקידים מראש?', topic: 'עומס עבודה', mood: 3 },
    { date: '09/10/2026 15:40', month: CUR, name: interns[2] ? interns[2].name : 'אנונימי', text: 'תודה לצוות חדר הניתוח, נתנו לי לתפור לראשונה!', topic: 'חדר ניתוח', mood: 5 },
    { date: '06/10/2026 19:12', month: CUR, name: interns[3] ? interns[3].name : 'אנונימי', text: 'מרגישה קצת אבודה בשבוע הראשון.', topic: 'כללי', mood: 2 }
  ];
  const content = [
    { id: 'm1', type: 'הודעה', month: CUR, target: 'all', title: 'ברוכים הבאים לסבב!', body: 'ישיבת פתיחה ביום ראשון ב-07:15 בחדר הישיבות של המערך.', day: null, date: '', time: '', link: '', tag: '', by: 'ד״ר איתן רז', updated: '01/10/2026 08:00', pinned: true },
    { id: 'm2', type: 'הודעה', month: CUR, target: 'all', title: 'סמינר מחר ב-10:00', body: 'נושא: טיפול בנוזלים ואלקטרוליטים אחרי ניתוח.', day: null, date: '', time: '', link: '', tag: '', by: 'ד״ר טל', updated: '14/10/2026 17:00', pinned: false },
    { id: 'm3', type: 'הודעה', month: CUR, target: interns[0] ? interns[0].key : 'all', title: 'כל הכבוד על הקבלה אתמול', body: 'קבלה מסודרת ומלאה. ממשיכים ככה!', day: null, date: '', time: '', link: '', tag: '', by: 'ד״ר איתן רז', updated: '15/10/2026 09:30', pinned: false },
    { id: 's1', type: 'מפגש', month: 'כל החודשים', target: 'all', title: 'ישיבת בוקר', body: '', day: 0, date: '', time: '07:15', link: '', tag: 'meet', by: '', updated: '', pinned: false },
    { id: 's2', type: 'מפגש', month: 'כל החודשים', target: 'all', title: 'ישיבה אקדמית', body: 'ג׳ורנל קלאב, M&M', day: 2, date: '', time: '07:00', link: '', tag: 'study', by: '', updated: '', pinned: false },
    { id: 's3', type: 'מפגש', month: 'כל החודשים', target: 'all', title: 'סמינר סטאז׳רים', body: 'רופא בכיר מלמד נושא מעשי', day: 3, date: '', time: '10:00', link: '', tag: 'you', by: '', updated: '', pinned: false },
    { id: 's4', type: 'מפגש', month: CUR, target: 'all', title: 'סדנת תפירה', body: 'במעבדת הסימולציה', day: null, date: addD(TODAY, 2), time: '13:00', link: '', tag: 'event', by: '', updated: '', pinned: false },
    { id: 'l1', type: 'ספרות', month: 'כל החודשים', target: 'all', title: 'ספרון הסטאז׳רים', body: 'נהלים, תבניות קבלה ושחרור', day: null, date: '', time: '', link: 'https://example.com/booklet', tag: 'ספרון', by: '', updated: '', pinned: false },
    { id: 'l1p', type: 'ספרות', month: 'כל החודשים', target: 'all', title: 'טרום ניתוח: הסבר וקבלות לדוגמה', body: 'איך כותבים קבלה ושלוש קבלות לדוגמה', day: null, date: '', time: '', link: 'site/academy/preop.pdf', tag: 'טיוטה', by: '', updated: '', pinned: false },
    { id: 'l2', type: 'ספרות', month: 'כל החודשים', target: 'all', title: 'Sabiston Textbook of Surgery', body: 'פרקי הבטן החריפה', day: null, date: '', time: '', link: '', tag: 'ספר', by: '', updated: '', pinned: false },
    { id: 'sm1', type: 'סמינר', month: 'כל החודשים', target: 'all', title: 'המטופל הכירורגי הדחוף', body: 'גישה ראשונית, בטן חריפה, בדיקת בטן וספסיס', day: null, date: '', time: '', link: 'https://example.com/1', tag: '1', by: '', updated: '', pinned: false },
    { id: 'sm2', type: 'סמינר', month: 'כל החודשים', target: 'all', title: 'סדנת תפירה', body: 'מכשירים, להבים, חוטים וחתכים ותרגול התפרים הבסיסיים', day: null, date: '', time: '', link: 'https://example.com/2', tag: '2', by: '', updated: '', pinned: false },
    { id: 'sm3', type: 'סמינר', month: 'כל החודשים', target: 'all', title: 'אפנדיציטיס', body: 'מהתהליך הדלקתי לאבחנה, הדמיה וטיפול', day: null, date: '', time: '', link: '', tag: '3', by: '', updated: '', pinned: false },
    { id: 'sm4', type: 'סמינר', month: 'כל החודשים', target: 'all', title: 'שוק, נוזלים ואלקטרוליטים', body: 'מה באמת חשוב לדעת על החייאה ומשק המים והמלחים', day: null, date: '', time: '', link: '', tag: '4', by: '', updated: '', pinned: false },
    { id: 'v1', type: 'וידאו', month: 'כל החודשים', target: 'all', title: 'WebSurg', body: 'ספריית סרטוני ניתוח', day: null, date: '', time: '', link: 'https://websurg.com', tag: 'חינם', by: '', updated: '', pinned: false },
    { id: 'g1', type: 'מדריך', month: 'כל החודשים', target: 'all', title: 'מדריך לסטאז׳רים', body: 'איך משתמשים בפורטל', day: null, date: '', time: '', link: '', tag: 'סטאז׳רים', by: '', updated: '', pinned: false },
    { id: 'g2', type: 'מדריך', month: 'כל החודשים', target: 'all', title: 'מדריך למנהלים', body: 'ניהול הסבב מהדשבורד', day: null, date: '', time: '', link: 'https://example.com/g', tag: 'מנהלים', by: '', updated: '', pinned: false },
  ];
  const requests = interns.length > 3 ? [
    { id: 'r1', type: 'החלפת תורנות', status: 'ממתינה', key: interns[1].key, name: interns[1].name, month: CUR, p: { date: addD(TODAY, 3), withName: interns[2].name, withDate: addD(TODAY, 6), note: 'יש לי מבחן' }, at: '15/10 10:00' },
    { id: 'r2', type: 'בקשת היעדרות', status: 'ממתינה', key: interns[3].key, name: interns[3].name, month: CUR, p: { reason: 'כנס / קורס', from: addD(TODAY, 5), to: addD(TODAY, 6) }, at: '15/10 12:00' },
    { id: 'r3', type: 'בקשת היעדרות', status: 'אושרה', key: interns[0].key, name: interns[0].name, month: CUR, p: { reason: 'חופש', from: addD(TODAY, -4), to: addD(TODAY, -4) }, at: '05/10 12:00', by: 'ד״ר איתן רז' },
    { id: 'r4', type: 'בקשת היעדרות', status: 'ממתינה', key: interns[4].key, name: interns[4].name, month: CUR, p: { reason: 'מטופס ההרשמה', from: addD(TODAY, 1), to: addD(TODAY, 2), dates: [addD(TODAY, 1), addD(TODAY, 2)], note: 'אבקש להיעדר ביומיים הראשונים לסבב בגלל חתונה של אח שלי', src: 'טופס ההרשמה', srcId: 'f|x', auto: 1 }, at: '18/10 09:00' },
    { id: 'r5', type: 'אילוץ תורנות', status: 'ממתינה', key: interns[2].key, name: interns[2].name, month: CUR, p: { reason: 'מהודעה באפליקציה', from: addD(TODAY, 8), to: addD(TODAY, 8), dates: [addD(TODAY, 8)], note: 'לא אוכל תורנות ב-' + addD(TODAY, 8).slice(8) + '/10, יש לי מבחן', src: 'הודעה באפליקציה', srcId: 'm|x', auto: 1 }, at: '18/10 11:00' },
    { id: 'r6', type: 'בקשת היעדרות', status: 'אושרה', key: interns[6].key, name: interns[6].name, month: CUR, p: { reason: 'מילואים', from: addD(TODAY, 9), to: addD(TODAY, 10) }, at: '16/10 08:00', by: 'ד״ר איתן רז' }
  ] : [];
  const roster = ALLI.map(i => ({ month: i.month, name: i.name, phone: i.phone, email: i.email, wing: i.wing, note: '' })).concat([{ month: CUR, name: 'רון אלמוג', phone: '0549998877', email: 'ron@example.com', wing: '', note: '' }]);
  const flags = {}; if (interns[3]) flags[interns[3].key] = { warn: true, note: 'קושי להשתלב בביקור, לתת ליווי צמוד', by: 'ד״ר איתן רז', at: '14/10/2026' };
  const DATA = { months: [CUR, NEXT], skills: ['כתיבת קבלות ושחרורים', 'כתיבת מעקב רפואי בביקור', 'לקיחת דמים והכנסת וונפלון', 'ביצוע ופענוח אק״ג', 'תפירה וקשירות', 'עזרה בחדר ניתוח'],
    interns: nextInterns.concat(interns), feedback, content, deletedInterns: [], roster, settings: { template: '', groups: {} }, duties, fmorn, daylogs, dlActs: DL, dutyBlocks: [], requests, portalFb: [], assigns, assignsDraft: assigns.slice(), weekState, absences, stations, flags, formUrl: 'https://example.com/form', sheetUrl: 'https://example.com/sheet' };
  const SIGS = {}, fmtD2 = d => d.slice(8, 10) + '/' + d.slice(5, 7) + '/' + d.slice(0, 4);
  DATA.talks = interns[1] ? [{ date: addD(TODAY, -2), key: interns[1].key, name: interns[1].name, month: interns[1].month, kind: 'שיחת אמצע', by: 'ד״ר יעל טל', text: 'משתלב טוב בצוות ומציג מטופלים בביטחון. מבקש יותר חשיפה לחדר הניתוח. קבלות טובות, צריך לקצר את המעקבים.', goals: 'שבוע הבא: יומיים בחדר ניתוח. להציג מקרה בישיבת הבוקר של יום רביעי.', at: '', id: 'tk1', form: { c1: 5, c2: 3, c3: 4, c4: 4, c5: 5, c6: 4, str: 'תקשורת מצוינת עם מטופלים ומשפחות', imp: 'לקצר את המעקבים ולהעמיק בפענוח צילומים', ftx: 'מבקש יותר חדר ניתוח' } }] : [];
  const ROLE = P.get('role') || 'owner';
  const ME = { name: ROLE === 'owner' ? 'ד״ר איתן רז' : ROLE === 'director' ? 'פרופ׳ אלמוג' : 'ד״ר טל', role: ROLE, p: P.get('fresh') ? {} : { seen: 1, prefix: 'ד״ר', first: 'איתן', last: 'רז', status: 'מומחה', role: 'אחראי הסטאז׳רים', phone: '0501234567', email: 'team@surgeryx.example', show: true, photo: '' } };
  const MMOCK = { me: 'm1', people: [{ id: 'm1', name: 'ד״ר איתן רז', role: 'owner' }, { id: 'm2', name: 'ד״ר יעל טל', role: 'viewer' }, { id: 'm3', name: 'ד״ר עידן סגל', role: 'viewer' }, { id: 'm4', name: 'פרופ׳ דניאל אלמוג', role: 'director' }],
    msgs: [{ id: 'a', at: '17/10/2026 20:10', from: 'm2', fromName: 'ד״ר יעל טל', to: 'all', text: 'הסטאז׳רים של נובמבר נרשמים יפה. מחר אעבור על הלוח.', mine: false, unread: true }, { id: 'b', at: '17/10/2026 20:30', from: 'm1', fromName: 'ד״ר איתן רז', to: 'm2', text: 'מעולה, תודה!', mine: true, unread: false }] };
  const STAFF = [{ name: 'ד״ר איתן רז', status: 'מומחה', role: 'אחראי הסטאז׳רים', phone: '0501234567', email: 'team@surgeryx.example', photo: '' }, { name: 'ד״ר יעל טל', status: 'מתמחה', role: 'מתמחה מלווה · חלוקת משימות והדרכה', phone: '0500000002', email: '', photo: '' }, { name: 'ד״ר עידן סגל', status: 'מתמחה', role: '', phone: '0547000000', email: 'n@example.com', photo: '' }];
  let EMB = '';
  const ADM = [{ name: ME.name, role: ROLE, code: '1234' }], AUTO = { on: true, owner: 'team@surgeryx.example', cfg: {}, log: [] };
  function mockUsage(){
    const out = {}, td = new Date(), iso = n => { const d = new Date(td); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };
    DATA.interns.forEach((i, k) => { if (k % 3 === 2) return; const u = { o: 0, f: '', l: '', d: {}, t: { home: 6 + k, sched: k, duty: 3, learn: k % 2 ? 2 : 0, team: 1 }, k: k % 2 ? { 'המטופל הכירורגי הדחוף': 2, 'ספרון סטאז׳ר': 1 } : {} };
      for (let n = 0; n < 7; n++) if ((n + k) % 3) { u.d[iso(n)] = 1 + (k % 2); u.o += 1 + (k % 2); }
      const ld = iso(k % 4); u.l = ld.slice(8, 10) + '/' + ld.slice(5, 7) + '/' + ld.slice(0, 4) + ' 1' + (k % 9) + ':2' + k % 6; u.f = u.l; out[i.key] = u; });
    const r = {}; DATA.interns.forEach(i => { r[i.month] = out; }); return r;
  }
  const api = {
    // the managers' actions that used to fall through to a generic answer: each now changes the demo data the way the server does
    wa_saveEval: (c, ev) => { const i = ALLI.find(x => x.email === ev.email && x.month === ev.month) || ALLI.find(x => x.name === ev.name && x.month === ev.month); if (i) i.staff = { date: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toTimeString().slice(0, 5), by: ME.name, skills: ev.skills, prof: ev.prof, cand: ev.cand ? 'כן' : '', summary: ev.summary || '' }; return DATA; },
    wa_setWing: (c, it) => { const r = DATA.roster.find(x => x.month === it.month && ((it.email && x.email === it.email) || (it.phone && x.phone === it.phone))); if (r) r.wing = it.wing || ''; else DATA.roster.push({ month: it.month, name: it.name, phone: it.phone, email: it.email, wing: it.wing || '', note: '' }); const i = ALLI.find(x => x.month === it.month && ((it.email && x.email === it.email) || x.name === it.name)); if (i) i.wing = it.wing || ''; return DATA.roster; },
    wa_saveSetting: (c, k, v) => { const st = DATA.settings = DATA.settings || { template: '', groups: {} }; st.groups = st.groups || {}; v = String(v || ''); if (k === 'OPEN_TPL') st.template = v; else if (k === 'OPEN_TPL_SEL') st.templateSel = v; else if (String(k).indexOf('GROUP_') === 0) { if (v && v.indexOf('https:' + '/' + '/chat.whatsapp.com/') !== 0) throw new Error('קישור הקבוצה צריך להתחיל ב-https://chat.whatsapp.com'); if (v) st.groups[k.slice(6)] = v; else delete st.groups[k.slice(6)]; } else throw new Error('הגדרה לא מוכרת'); return st; },
    wa_saveStations: (c, list) => { const L = (list || []).filter(x => x && x.id && x.name); if (!L.length) throw new Error('צריך לפחות עמדה אחת'); stations.splice(0, stations.length, ...L); DATA.stations = stations; return stations; },
    wa_saveAdmins: (c, list) => { const L = (list || []).map(a => ({ name: String(a.name || '').trim(), role: ['owner', 'director', 'viewer'].indexOf(a.role) >= 0 ? a.role : 'admin', code: String(a.code || '').trim() })).filter(a => a.name && /^[0-9]{4,8}$/.test(a.code)); if (!L.some(a => a.role === 'owner')) throw new Error('חייב להישאר בעל מערכת אחד'); if (new Set(L.map(a => a.code)).size !== L.length) throw new Error('לכל מנהל צריך קוד אחר'); ADM.splice(0, ADM.length, ...L); return ADM; },
    wa_saveAuto: (c, cfg) => { AUTO.cfg = Object.assign({}, AUTO.cfg, cfg || {}); return AUTO; },
    wa_setupAutomation: () => { AUTO.on = true; return AUTO; },
    wa_testMail: (c, kind) => 'נשלח מייל בדיקה אל team@surgeryx.example',
    wa_sendWelcome: (c, key) => { const i = ALLI.find(x => x.key === key); if (!i) throw new Error('הסטאז׳ר/ית לא נמצא/ה'); if (!i.email) throw new Error('אין כתובת מייל'); return 'המייל נשלח אל ' + i.email; },
    wa_uploadPhoto: (c, b64, mime) => { if (!b64) throw new Error('לא התקבלה תמונה'); const id = 'up' + Date.now(); photoMap[id] = 'data:' + (mime || 'image/jpeg') + ';base64,' + b64; return { id }; },
    wa_deleteIntern: (c, key, restore) => { if (restore) { const d = DATA.deletedInterns.find(x => x.key === key); if (d) { DATA.deletedInterns = DATA.deletedInterns.filter(x => x !== d); DATA.interns.push(d); } } else { const i = DATA.interns.find(x => x.key === key); if (i) { DATA.interns = DATA.interns.filter(x => x !== i); DATA.deletedInterns.push(i); } } return DATA; },
    wa_resetIntern: () => DATA,
    wa_portalFb: () => ({ ok: true }),
    wa_stageFeedback: (t, stage, f) => { const i = ALLI.find(x => x.key === t); if (i && !i[stage]) i[stage] = new Date().toISOString().slice(0, 10); return api.wa_intern(t); },
    wa_clientErr: () => true,
    wa_setup: () => true,
    wa_staffPhoto: () => '',
    wa_news: () => ({ at: new Date(Date.now() - 3 * 3600e3).toISOString(), def: ['annsurg', 'jamasurg', 'bjs'], all: [{ k: 'annsurg', ta: 'Ann Surg', name: 'Annals of Surgery' }, { k: 'jamasurg', ta: 'JAMA Surg', name: 'JAMA Surgery' }, { k: 'bjs', ta: 'Br J Surg', name: 'British Journal of Surgery' }],
      res: [['Ann Surg', 'Pan-European Training Program for Robotic Pancreatoduodenectomy (LEARNBOT): Prospective Multicenter Study'], ['JAMA Surg', 'Use of a Genetic Expression Profile to Discharge Patients With Melanoma From Surgical Clinics'], ['Br J Surg', 'Patient-reported outcomes and quality of life before and after inguinal hernia repair'], ['Ann Surg', 'Association Between Travel Distance and Outcomes for Common Pediatric Surgical Procedures']].map((x, i) => ({ j: x[0], t: x[1], au: ['Jones LR', 'Kozuma K', 'Smith A', 'Collins RA'][i], n: 5, d: '2026-10-' + (20 - i), u: 'https://pubmed.ncbi.nlm.nih.gov/' })),
      inn: [{ j: 'JAMA Surg', t: 'Artificial Intelligence for Intraoperative Decision Support in Laparoscopic Cholecystectomy', au: 'Lee M', n: 4, d: '2026-10-15', u: 'https://pubmed.ncbi.nlm.nih.gov/' }],
      dev: [{ k: 'K262931', d: '2026-10-10', t: 'Absorbable Hernia Mesh', co: 'Example Medical', kind: 'Surgical mesh', u: 'https://www.accessdata.fda.gov/' }] }),
    wa_completeIntake: (token, f) => Object.assign({}, api.wa_intern(token), { start: f.start, inst: f.inst, extra: f.extra }),
    wa_mgrMsgs: () => MMOCK,
    wa_mgrSend: (code, to, text) => { MMOCK.msgs.push({ id: 'n' + Date.now(), at: '18/10/2026 21:00', from: 'm1', fromName: ME.name, to: to === 'all' ? 'all' : to.join(','), text, mine: true, unread: false }); return MMOCK; },
    wa_mgrRead: () => true,
    wa_saveMyProfile: (code, o, pic) => { Object.assign(ME.p, o, { seen: 1 }); if (pic) ME.p.photo = pic; if (o.first) ME.name = [o.prefix, o.first, o.last].filter(Boolean).join(' '); return { name: ME.name, role: ME.role, p: ME.p }; },
    wa_boot: () => (DATA.usage = DATA.usage || mockUsage(), { state: 'ok', me: ME, admins: ADM, data: DATA, auto: ROLE === 'owner' ? AUTO : null }),
    wa_photo: (c, id) => photoMap[id] || '',
    wa_emblem: () => EMB,
    wa_formLink: () => 'https://example.com/form?m',
    wa_setFlag: (c, key, f) => { console.log('setFlag', key, f); if (f && f.warn) DATA.flags[key] = Object.assign({ by: ME.name, at: '16/10/2026' }, f); else delete DATA.flags[key]; return DATA.flags; },
    wa_saveContent: (c, it) => { const i = DATA.content.findIndex(x => x.id === it.id); const o = Object.assign({ by: ME.name, updated: '16/10/2026 23:00' }, it, { id: it.id || 'n' + Date.now() }); if (i >= 0) DATA.content[i] = o; else DATA.content.push(o); return DATA.content; },
    wa_deleteContent: (c, id) => { DATA.content = DATA.content.filter(x => x.id !== id); return DATA.content; },
    wa_saveDuties: (c, m, list, po) => { (window.__savePo = window.__savePo || []).push(po || null); DATA.duties = DATA.duties.filter(x => x.month !== m).concat(list.filter(x => x.slot !== 'fm').map(x => Object.assign({ month: m }, x))); DATA.dutyDraft = (DATA.dutyDraft || []).filter(x => x.month !== m); return DATA.duties; },
    wa_setDeckLive: (c, on) => { DATA.deckLive = !!on; return DATA.deckLive; },
    wa_notifyPub: (c, kind, m, f, o) => { (window.__notify = window.__notify || []).push([kind, o || {}]); return { sent: 5, same: 1, failed: 0, noMail: ['ניסיון בלי מייל'] }; },
    wa_track: (t, p) => { (window.__trk = window.__trk || []).push(p); return true; },
    wa_devToken: () => { (window.__dev = window.__dev || []).push('token'); return 'devtok' + 'x'.repeat(60); },
    wa_devLogin: t => { (window.__dev = window.__dev || []).push('login'); return t && t.length >= 40 ? '1234' : null; },
    wa_devForget: () => { (window.__dev = window.__dev || []).push('forget'); return true; },
    wa_saveDutyDraft: (c, m, list) => { DATA.dutyDraft = (DATA.dutyDraft || []).filter(x => x.month !== m).concat(list.map(x => Object.assign({ month: m, at: '19/10/2026 21:40', by: 'ד״ר איתן רז' }, x))); return DATA.dutyDraft; },
    wa_saveWeek: (c, f, t, as, ab, pub, po) => { (window.__weekPo = window.__weekPo || []).push(po || null); if (pub) { DATA.weekState = DATA.weekState || {}; DATA.weekState[f] = Object.assign({}, DATA.weekState[f], { pub: '21/10/2026 12:00' }); } DATA.assigns = DATA.assigns.filter(a => a.date < f || a.date > t).concat(as); DATA.absences = DATA.absences.filter(a => a.date < f || a.date > t).concat(ab); return { assigns: DATA.assigns, absences: DATA.absences, assignsDraft: DATA.assigns, weekState: DATA.weekState }; },
    wa_saveIntern: (c, key, d) => { const i = ALLI.find(x => x.key === key); if (i) Object.assign(i, d); return { key, data: DATA }; },
    wa_saveRoster: (c, m, rows) => { DATA.roster = DATA.roster.filter(r => r.month !== m).concat(rows.map(r => Object.assign({ month: m, note: '' }, r))); return DATA.roster; },
    wa_internPhoto: (t, url) => { const i = ALLI.find(x => x.key === t); i.photoId = 'up' + Date.now(); photoMap[i.photoId] = url; return url; },
    wa_teamPhoto: (t, k) => { const me = ALLI.find(x => x.key === t); const L = ALLI.filter(x => x.month === me.month).sort((a, b) => a.name.localeCompare(b.name, 'he')); const i = L[Number(k)]; return i ? photoMap[i.photoId] || '' : ''; },
    wa_intern: (token) => {
      const i = ALLI.find(x => x.key === token); if (!i) return { ok: false };
      const c = DATA.content, okM = x => x.month === 'כל החודשים' || x.month === i.month, okT = x => x.target === 'all' || x.target === i.key || x.target === 'wing:' + i.wing;
      const mates = ALLI.filter(x => x.month === i.month);
      return { ok: true, staff: STAFF, key: i.key, name: i.name, month: i.month, inst: i.inst, imonth: i.imonth, start: i.start, mid: i.mid, end: i.end, stages: [!!i.start, !!i.mid, !!i.end], photo: photoMap[i.photoId] || '', daylog: DATA.daylogs.filter(x => x.key === i.key), today: TODAY, dlActs: DL, wing: i.wing, track: i.track, skills: DATA.skills,
        assigns: DATA.assigns.filter(a => a.key === i.key), absences: DATA.absences.filter(a => a.key === i.key), stations,
        team: { assigns: DATA.assigns.filter(a => mates.some(m => m.key === a.key)).map(a => ({ date: a.date, name: a.name, station: a.station, mine: a.key === i.key })), absences: DATA.absences.filter(a => mates.some(m => m.key === a.key)).map(a => ({ date: a.date, name: a.name, reason: a.reason, mine: a.key === i.key })) },
        fmorn: DATA.fmorn.filter(x => x.month === i.month).map(x => ({ date: x.date, name: x.name, mine: x.key === i.key })),
        duties: DATA.duties.filter(x => x.month === i.month).map(x => ({ date: x.date, name: x.name, mine: x.key === i.key, slot: x.slot })),
        requests: DATA.requests.filter(r => r.key === i.key), portalFb: false, mates: mates.filter(x => x.key !== i.key).map(x => x.name),
        crew: mates.slice().sort((a, b) => a.name.localeCompare(b.name, 'he')).map((x, k) => ({ id: k, name: x.name, inst: x.inst, wing: x.wing, track: x.track || 'רגיל', photo: !!x.photoId, me: x.key === i.key })),
        formUrl: DATA.formUrl, sessions: c.filter(x => x.type === 'מפגש' && okM(x) && okT(x)), messages: c.filter(x => x.type === 'הודעה' && okM(x) && okT(x)).map(x => Object.assign({}, x, { personal: x.target !== 'all' && x.target.indexOf('wing:') !== 0 })),
        literature: c.filter(x => x.type === 'ספרות' && okM(x) && x.tag !== 'טיוטה'), seminars: c.filter(x => x.type === 'סמינר'), videos: c.filter(x => x.type === 'וידאו'), guides: c.filter(x => x.type === 'מדריך' && x.tag !== 'מנהלים'), deckLive: !!DATA.deckLive || /[?&]deck=1/.test(location.search), pubs: /[?&]pub=1/.test(location.search) ? { duty: 1792550000000, weeks: Object.fromEntries([...new Set((DATA.assigns || []).map(x => x.date))].map(d => { const t = new Date(d + 'T12:00:00Z'); t.setUTCDate(t.getUTCDate() - t.getUTCDay()); return [t.toISOString().slice(0, 10), 1792550000000]; })) } : { duty: 0, weeks: {} } };
    },
    wa_saveBlocks: (c, m, list) => { DATA.dutyBlocks = (DATA.dutyBlocks || []).filter(b => b.month !== m).concat((list || []).map(x => ({ month: m, key: x.key, date: x.date }))); return DATA.dutyBlocks; },
    wa_decideRequest: (c, id, ok, note, edit) => { const r = DATA.requests.find(x => x.id === id); if (!r) throw new Error('הבקשה לא נמצאה'); if (edit) { r.p.from = edit.from; r.p.to = edit.to; delete r.p.dates; } r.status = ok ? 'אושרה' : 'נדחתה'; r.by = 'ד״ר איתן רז'; r.note = note;
      const days = []; if (ok && r.type !== 'החלפת תורנות') { for (let d = r.p.from; d <= (r.p.to || r.p.from); d = addD(d, 1)) days.push(d); (r.p.dates || days).forEach(d => r.type === 'אילוץ תורנות' ? DATA.dutyBlocks.push({ month: r.month, key: r.key, date: d }) : DATA.absences.push({ date: d, key: r.key, name: r.name, reason: r.p.reason })); }
      return { requests: DATA.requests, duties: DATA.duties, fmorn: DATA.fmorn, absences: DATA.absences, dutyBlocks: DATA.dutyBlocks }; },
    wa_saveTalk: (c, t) => { const i = ALLI.find(x => x.key === t.key); const row = { date: t.date, key: t.key, name: i.name, month: i.month, kind: t.kind, by: 'ד״ר איתן רז', text: t.text, goals: t.goals, form: t.form || null, at: '', id: t.id || 'tk' + Date.now() }; DATA.talks = DATA.talks.filter(x => x.id !== row.id).concat([row]); return DATA.talks; },
    wa_deleteTalk: (c, id) => { DATA.talks = DATA.talks.filter(x => x.id !== id); return DATA.talks; },
    wa_saveDutyPrefs: (c, m, p) => { DATA.dutyPrefs = Object.assign({}, DATA.dutyPrefs || {}, { [m]: p }); return DATA.dutyPrefs; },
    wa_internFeedback: () => true, wa_dayLog: () => ({ daylog: [] }), wa_request: () => ({ requests: [] })
  };
  const fallback = name => (...a) => { console.log('[mock] ' + name, a); return S_DATA_FALLBACK(name); };
  const S_DATA_FALLBACK = () => DATA;
  function runner(ok, fail) {
    return new Proxy({}, { get(_, k) {
      if (k === 'withSuccessHandler') return f => runner(f, fail);
      if (k === 'withFailureHandler') return f => runner(ok, f);
      return (...a) => setTimeout(() => { try { const r = (api[k] || fallback(k))(...a); ok && ok(r); } catch (e) { console.error(e); fail && fail(e); } }, 120 + Math.random() * 200);
    } });
  }
  window.google = { script: { run: runner(null, null), url: { getLocation: cb => cb({ parameter: Object.fromEntries(P) }) } } };
  // the emblem comes from the same file as the server's (WebApp.js · wa_emblem)
  fetch('../../WebApp.js').then(r => r.text()).then(t => { const m = /function wa_emblem\(\) \{ return '([^']+)'/.exec(t); if (m) EMB = m[1]; }).catch(() => {});
  window.__MOCK = DATA;
})();
