/**
 * Surgery X · ניהול המערך (Ops)
 * One app for the general surgery department: weekly plan, residents' duty roster, seniors' on-call roster,
 * monthly preference links and the team. Data lives as JSON blobs in one sheet (key | json | updated | by).
 * Roles: owner (all), director (weekly plan), chief (duty roster), deputy (on-call roster), secretary (notes), viewer.
 */
const APP_TITLE = 'Surgery X';
// the home-screen wrapper on our own address: icon, Face ID and push. Personal links are built on it (?p=<token>)
const OPS_WRAP_URL = 'https://surgeryx.example/ops/';
const ROLES = { owner: 'בעלים', director: 'מנהל המערך', chief: 'צ׳יף המתמחים', deputy: 'סגן מנהל המערך', secretary: 'מזכירות', students: 'אחראי סטודנטים', viewer: 'צפייה' };
// who may write each kind of key (key prefix before ':')
const WRITE = { curr: ['owner', 'director', 'deputy', 'chief'], week: ['owner', 'director', 'chief', 'secretary'], duty: ['owner', 'chief'], oncall: ['owner', 'deputy'], notes: ['owner', 'director', 'secretary'], people: ['owner'], settings: ['owner'], prefsopen: ['owner', 'chief', 'deputy'], fixed: ['owner', 'chief', 'deputy'], meet: ['owner', 'director', 'chief', 'deputy'], stud: ['owner', 'director', 'students', 'chief'], sides: ['owner', 'director', 'chief'] };

function doGet(e) {
  const p = (e && e.parameter) || {};
  // a manager's personal link opens his portal (the dashboard, signed in by the link); doctor mode, a preview and links to a tab (requests, profile) open the doctor app
  const mgr = !!(p.p && !p.dm && !p.pv && !p.tab && !p.chat && mgrOfToken_(p.p)), app = !!p.p && !mgr;
  const t = HtmlService.createTemplateFromFile(app ? 'Prefs' : 'Index');
  t.token = String(p.p || '');
  return t.evaluate().setTitle(app ? 'SX · האפליקציה שלי' : APP_TITLE)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    // the SX icon also on Google's own address, so a page installed or bookmarked from there looks right
    .setFaviconUrl(OPS_WRAP_URL + 'icon-192.png')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/* ---------------- one link for a manager: his portal, signed in by his personal link ---------------- */
function mgrOfToken_(t) { t = String(t || ''); if (t.length < 16) return null; let p; try { p = personByToken_(t); } catch (e) { return null; } return (p && users_().find(u => u.pid === p.id)) || null; }
function ops_tokenLogin(t) {
  const u = mgrOfToken_(t); if (!u) throw new Error('הקישור הזה לא מוגדר כקישור של מנהל');
  try { seenMark_(u.pid, ''); } catch (e) {}
  return { code: u.code, boot: ops_boot(u.code) };
}
// a manager's invitation is the bare link (his portal); a doctor's opens the profile
const tabMe_ = p => users_().some(u => u.pid === p.id) ? '' : '&tab=me';

function include(name) { return HtmlService.createHtmlOutputFromFile(name).getContent(); }

/* ---------------- storage ---------------- */
function props_() { return PropertiesService.getScriptProperties(); }
function sheet_() {
  const pr = props_(); let id = pr.getProperty('SHEET_ID'), ss = null;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; } }
  if (!ss) { ss = SpreadsheetApp.create('מערך כירורגיה · ניהול · נתונים'); pr.setProperty('SHEET_ID', ss.getId()); }
  let sh = ss.getSheetByName('store');
  if (!sh) { sh = ss.getSheets()[0]; sh.setName('store'); sh.getRange(1, 1, 1, 4).setValues([['key', 'json', 'updated', 'by']]); sh.setFrozenRows(1); sh.getRange('A:A').setNumberFormat('@'); }
  return sh;
}
function rowOf_(sh, key) {
  const f = sh.getRange('A:A').createTextFinder(key).matchEntireCell(true).findNext();
  return f ? f.getRow() : 0;
}
function get_(key) {
  const c = CacheService.getScriptCache(), hit = c.get('k:' + key);
  if (hit !== null) return hit === '' ? null : JSON.parse(hit);
  const sh = sheet_(), r = rowOf_(sh, key);
  const v = r ? sh.getRange(r, 2).getValue() : '';
  try { c.put('k:' + key, String(v || ''), 21600); } catch (e) {}
  return v ? JSON.parse(v) : null;
}
function set_(key, val, by) {
  let old = null; const logIt = by && ['migrate', 'seed', 'push', 'auto', 'chat'].indexOf(by) < 0;
  if (logIt) { try { old = get_(key); } catch (e) { old = null; } }
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh = sheet_(), r = rowOf_(sh, key), json = val === null ? '' : JSON.stringify(val);
    if (json.length > 49000) throw new Error('הנתונים גדולים מדי לשמירה');
    const row = [[key, json, new Date(), by || '']];
    if (r) sh.getRange(r, 1, 1, 4).setValues(row); else sh.appendRow(row[0]);
    try { CacheService.getScriptCache().put('k:' + key, json, 21600); } catch (e) {}
  } finally { lock.releaseLock(); }
  if (logIt) { let what = ''; try { what = diffSum_(key, old, val); log_(by, key, what); } catch (e) { console.log('log: ' + e.message); }
    ownerPing_(by, (PING_KEYS_[String(key).split(':')[0]] || '✏️ ' + key) + ' · ' + by, what || 'שינוי במערכת'); }
}
/* ---------- the change log: every write, who and what, in a "log" tab of the data sheet (owner reads it) ---------- */
function logSheet_() { const ss = sheet_().getParent(); let sh = ss.getSheetByName('log'); if (!sh) { sh = ss.insertSheet('log'); sh.getRange(1, 1, 1, 4).setValues([['when', 'by', 'key', 'what']]); sh.setFrozenRows(1); } return sh; }
function log_(by, key, what) { logSheet_().appendRow([new Date(), String(by || ''), String(key || ''), String(what || '').slice(0, 900)]); }
function diffSum_(key, a, b) {
  const k = String(key).split(':')[0], names = {}; (get_('people') || []).forEach(p => { names[p.id] = p.name; });
  const HE = { rn: 'ביקור צפון', rs: 'ביקור דרום', consult: 'ייעוצים', erlead: 'אחראי מיון', er: 'מיון', day: 'אשפוז יום', preop: 'טרום ניתוח', clinic: 'מרפאות', clinicTx: 'מרפאות', meet: 'ישיבות', morning: 'ישיבת בוקר', study: 'לימודים', abs: 'לא נמצאים', er1: 'מיון 1', er2: 'מיון 2', dept: 'מחלקה', minor: 'מיינור', fm: 'שישי בוקר', wing: 'אגף', active: 'כונן פעיל', passive: 'כונן פסיבי', half: 'תורן חצי', absNote: 'הערת היעדרות' }, he = x => HE[x] || x;
  const nm = id => id ? (names[id] || id) : '—', dd = d => +String(d).slice(8, 10) + '/' + +String(d).slice(5, 7), out = [];
  a = a || {}; b = b || {};
  if (k === 'duty' || k === 'oncall') {
    const A = a.days || {}, B = b.days || {}; Object.keys(Object.assign({}, A, B)).sort().forEach(d => { const x = A[d] || {}, y = B[d] || {}; Object.keys(Object.assign({}, x, y)).forEach(s => { if (x[s] !== y[s]) out.push(dd(d) + ' ' + he(s) + ': ' + (s === 'wing' ? (x[s] || '—') + ' → ' + (y[s] || '—') : nm(x[s]) + ' → ' + nm(y[s]))); }); });
    if ((b.swaps || []).length > (a.swaps || []).length) out.unshift('חילוף: ' + nm(b.swaps[0].a.id) + ' ⇄ ' + nm(b.swaps[0].b.id));
  } else if (k === 'week') {
    const A = a.days || {}, B = b.days || {}, ids = v => (Array.isArray(v) ? v : []).map(x => x && x.id).filter(Boolean);
    Object.keys(Object.assign({}, A, B)).sort().forEach(d => { const x = A[d] || {}, y = B[d] || {};
      Object.keys(Object.assign({}, x, y)).forEach(l => { if (l === 'or') { const r = v => (v || []).map(o => o.n + ':' + ids(o.ids).join(',') + ':' + (o.proc || []).join(',')).join('|'); if (r(x.or) !== r(y.or)) out.push(dd(d) + ' חדרי ניתוח'); return; }
        if (Array.isArray(x[l]) || Array.isArray(y[l])) { const p = ids(x[l]), q = ids(y[l]), add = q.filter(i => p.indexOf(i) < 0), del = p.filter(i => q.indexOf(i) < 0); if (add.length || del.length) out.push(dd(d) + ' ' + he(l) + ': ' + add.map(i => '+' + nm(i)).concat(del.map(i => '−' + nm(i))).join(' ')); }
        else if (String(x[l] || '') !== String(y[l] || '')) out.push(dd(d) + ' ' + he(l) + ' (טקסט)'); }); });
  } else if (k === 'people') {
    const A = {}; (Array.isArray(a) ? a : []).forEach(p => { A[p.id] = p; });
    (Array.isArray(b) ? b : []).forEach(p => { const o = A[p.id]; if (!o) { out.push('נוסף/ה ' + p.name); return; } const f = Object.keys(Object.assign({}, o, p)).filter(f2 => f2 !== 'token' && JSON.stringify(o[f2]) !== JSON.stringify(p[f2])); if (f.length) out.push(p.name + ': ' + f.join(', ')); delete A[p.id]; });
    Object.keys(A).forEach(id => out.push('הוסר/ה ' + A[id].name));
  } else if (k === 'leavereq') {
    const A = {}; (Array.isArray(a) ? a : []).forEach(q => { A[q.id] = q; }); (Array.isArray(b) ? b : []).forEach(q => { const o = A[q.id]; if (!o) out.push('בקשת חופשה: ' + nm(q.pid) + ' ' + dd(q.f) + '–' + dd(q.t)); else if (o.st !== q.st) out.push((q.st === 'ok' ? 'אושרה' : 'נדחתה') + ' חופשה: ' + nm(q.pid) + (q.note ? ' · ' + q.note : '')); });
  } else if (k === 'curr') {
    const A = {}; (a.items || []).forEach(x => { A[x.id] = x; });
    (b.items || []).forEach(x => { const o = A[x.id]; if (!o) out.push('הרצאה ' + dd(x.d) + ': ' + (x.title || x.type || '')); else { if ((o.sen || '') !== (x.sen || '')) out.push(dd(x.d) + ' מרצה: ' + nm(x.sen)); if ((o.res || '') !== (x.res || '')) out.push(dd(x.d) + ' מתמחה: ' + nm(x.res)); if (o.title !== x.title || o.d !== x.d || o.time !== x.time) out.push(dd(x.d) + ' עודכן: ' + (x.title || '')); } delete A[x.id]; });
    Object.keys(A).forEach(id => out.push('נמחקה הרצאה ' + dd(A[id].d)));
    if (!a.apDep && b.apDep) out.push('✓ הסגן אישר את התוכנית'); if (!a.apChief && b.apChief) out.push('✓ הצ׳יף אישר את התוכנית');
  } else if (k === 'photo') out.push(b ? 'תמונה חדשה' : 'התמונה הוסרה');
  else out.push('עודכן');
  return out.slice(0, 8).join(' · ') + (out.length > 8 ? ' · ועוד ' + (out.length - 8) : '') || 'בלי שינוי';
}
function ops_log(code, n) {
  const u = me_(code); if (u.role !== 'owner') throw new Error('רק לבעלים');
  const sh = logSheet_(), last = sh.getLastRow(); if (last < 2) return [];
  const k = Math.min(Math.max(+n || 300, 20), 1500), from = Math.max(2, last - k + 1);
  return sh.getRange(from, 1, last - from + 1, 4).getValues().reverse().map(r => ({ at: new Date(r[0]).toISOString(), by: r[1], key: r[2], what: r[3] }));
}
function keysWith_(prefix) {
  const sh = sheet_(), n = sh.getLastRow(); if (n < 2) return [];
  return sh.getRange(2, 1, n - 1, 2).getValues().filter(r => String(r[0]).indexOf(prefix) === 0 && r[1]).map(r => ({ key: String(r[0]), val: JSON.parse(r[1]) }));
}

/* ---------------- users & auth ---------------- */
function users_() { try { return JSON.parse(props_().getProperty('USERS') || '[]'); } catch (e) { return []; } }
function me_(code) {
  code = String(code || '').trim(); if (!code) throw new Error('נדרש קוד כניסה');
  const u = users_().find(x => x.code === code);
  // a wrong code costs time, more after many wrong tries in a short while (guessing codes becomes impractical)
  if (!u) { const c = CacheService.getScriptCache(), n = +(c.get('badcode') || 0) + 1; try { c.put('badcode', String(n), 900); } catch (e) {} Utilities.sleep(n > 20 ? 4000 : 800); throw new Error('הקוד לא נמצא'); }
  return u;
}
function canWrite_(u, key) { const k = String(key).split(':')[0]; return (WRITE[k] || ['owner']).indexOf(u.role) >= 0; }
/** the personal links (tokens) go only to the owner; everyone else gets the team without them */
// personal links: the owner and the department head see all; the chief his residents and externs; the deputy his seniors (to invite and remind them); everyone else only his own
const LINK_SCOPE_ = { director: ['senior', 'resident', 'house', 'extern', 'pa', 'staff'], chief: ['resident', 'house', 'extern', 'pa'], deputy: ['senior'] };
const linkOk_ = (u, p) => !!u && (u.role === 'owner' || (u.pid && p.id === u.pid) || (LINK_SCOPE_[u.role] || []).indexOf(p.role) >= 0);
const safePeople_ = (u, L) => u && u.role === 'owner' ? L : (L || []).map(p => { const o = Object.assign({}, p); if (!linkOk_(u, p)) delete o.token; return o; });
function pub_(u) { return { id: u.id, name: u.name, role: u.role, pid: u.pid || '' }; }
/** one profile per doctor: a user with a code and no linked doctor is linked by name (only a single sure match) */
const ROLE_TITLE_ = { director: 'מנהל המערך', deputy: 'סגן מנהל המערך', chief: 'צ׳יף המתמחים', students: 'אחראי סטודנטים' };
const nameToks_ = t => String(t || '').replace(/ד["״']?ר|פרופ['׳]?|\./g, ' ').split(/[\s·,-]+/).filter(x => x.length > 1);
function linkUsers_(people) {
  const U = users_(); let ch = false;
  U.forEach(u => { if (u.pid && people.some(p => p.id === u.pid)) return; const t = nameToks_(u.name);
    const hit = !t.length ? [] : people.filter(p => p.active !== false && !U.some(y => y !== u && y.pid === p.id)).filter(p => { const pt = nameToks_(p.name + ' ' + (p.full || '')); return t.every(x => pt.indexOf(x) >= 0); });
    const free = p => p.active !== false && !U.some(y => y !== u && y.pid === p.id), byTitle = people.filter(p => free(p) && p.title && p.title === ROLE_TITLE_[u.role]);
    if (hit.length === 1) { u.pid = hit[0].id; ch = true; } else if (!hit.length && byTitle.length === 1) { u.pid = byTitle[0].id; ch = true; } });
  if (ch) props_().setProperty('USERS', JSON.stringify(U));
  return ch;
}

/** first run only: no users yet, the person who opens the app sets the owner code */
function ops_setupOwner(name, code) {
  if (users_().length) throw new Error('כבר הוגדר בעלים');
  code = String(code || '').trim(); if (code.length < 4) throw new Error('קוד של 4 תווים לפחות');
  const u = { id: 'u' + Utilities.getUuid().slice(0, 8), name: String(name || 'בעלים').slice(0, 40), role: 'owner', code: code };
  props_().setProperty('USERS', JSON.stringify([u]));
  return ops_boot(code);
}
function ops_needsSetup() { return users_().length === 0; }

/* ---------------- API ---------------- */
function ops_boot(code) {
  let u = me_(code);
  visitMark_('u:' + u.id, u.name, u.role === 'owner' ? '' : 'נכנס/ה לפורטל הניהול');
  let people = get_('people'), settings = get_('settings');
  if (!people) { people = seedPeople_(); set_('people', people, 'seed'); }
  if (!settings) { settings = seedSettings_(); set_('settings', settings, 'seed'); }
  if (!get_('stud:roster')) set_('stud:roster', studSeed_(), 'seed');
  if (migrate7_(people, settings)) { set_('people', people, 'migrate'); set_('settings', settings, 'migrate'); }
  if (migrate8_(people, settings)) { set_('people', people, 'migrate'); set_('settings', settings, 'migrate'); }
  if (users_().some(x => !x.pid) && linkUsers_(people)) u = me_(code);
  const out = { me: pub_(u), notif: (get_('notif') || []).slice(0, 40), roles: ROLES, write: WRITE, people: safePeople_(u, people), settings: settings, title: APP_TITLE, appUrl: props_().getProperty('APP_URL') || OPS_WRAP_URL };
  if (u.role === 'owner') { try { out.execUrl = ScriptApp.getService().getUrl(); } catch (e) {} }
  out.news = newsGet_(); out.nj = (get_('njsel') || {})[u.pid ? 'p:' + u.pid : 'u:' + u.id] || null;
  if (u.role === 'owner') out.users = users_().map(userOut_);
  if (u.role === 'owner' || LINK_SCOPE_[u.role]) { out.sentlog = get_('sentlog') || {}; out.seen = get_('seen') || {}; }
  return out;
}
function ops_get(code, keys) {
  const u = me_(code), out = {};
  (keys || []).slice(0, 40).forEach(k => { k = String(k); out[k] = k === 'people' ? safePeople_(u, get_(k)) : get_(k); });
  return out;
}
function ops_set(code, key, val) {
  const u = me_(code); key = String(key);
  if (!/^[a-z]+(:[0-9A-Za-z\-_:]+)?$/.test(key)) throw new Error('מפתח לא תקין');
  if (!canWrite_(u, key)) throw new Error('אין הרשאה לשמור כאן');
  if (u.role === 'chief' && key.indexOf('week:') === 0) weekGuard_(get_(key), val);
  if (u.role === 'secretary' && key.indexOf('week:') === 0) secGuard_(get_(key), val);
  if (u.role === 'chief' && key.indexOf('stud:') === 0) studGuard_(key, get_(key), val);
  if (key.indexOf('curr:') === 0) currGuard_(u, get_(key), val);
  set_(key, val, u.name);
  return { ok: true, at: new Date().toISOString() };
}
/** the teaching program: the deputy builds it and places the seniors; the chief places the residents; each approves for himself */
function currGuard_(u, a, b) {
  if (['owner', 'director'].indexOf(u.role) >= 0) return;
  a = a || { items: [] }; b = b || { items: [] };
  const strip = (w, f) => JSON.stringify((w.items || []).map(x => { const o = {}; Object.keys(x).sort().forEach(k => { if (f.indexOf(k) < 0) o[k] = x[k]; }); return o; }));
  if (u.role === 'chief') {
    if (strip(a, ['res']) !== strip(b, ['res'])) throw new Error('הצ׳יף משבץ את המתמחים. את ההרצאות, הנושאים והבכירים קובע סגן מנהל המערך');
    if (JSON.stringify(a.apDep || null) !== JSON.stringify(b.apDep || null)) throw new Error('האישור של הסגן שייך לסגן');
  }
  if (u.role === 'deputy') {
    (b.items || []).forEach(x => { const o = (a.items || []).find(y => y.id === x.id); if ((o ? o.res || '' : '') !== (x.res || '')) throw new Error('את המתמחים משבץ הצ׳יף'); });
    if (b.apChief && JSON.stringify(a.apChief || null) !== JSON.stringify(b.apChief)) throw new Error('האישור של הצ׳יף שייך לצ׳יף');
  }
}
function ops_saveUsers(code, list) {
  const u = me_(code); if (u.role !== 'owner') throw new Error('רק לבעלים');
  const old = users_(), seen = {};
  const clean = (list || []).map(x => ({ id: x.id || 'u' + Utilities.getUuid().slice(0, 8), name: String(x.name || '').trim().slice(0, 40), role: ROLES[x.role] ? x.role : 'viewer', code: String(x.code || '').trim(), pid: x.pid || (old.find(y => y.id === x.id) || {}).pid || '' }))
    .filter(x => x.name && x.code.length >= 4 && !seen[x.code] && (seen[x.code] = 1));
  if (!clean.some(x => x.role === 'owner')) throw new Error('חייב להישאר בעלים אחד לפחות');
  const L = get_('people') || [], dup = clean.find((x, i) => x.pid && clean.findIndex(y => y.pid === x.pid) !== i);
  if (dup) throw new Error('לרופא/ה ' + ((L.find(p => p.id === dup.pid) || {}).name || '') + ' יש כבר משתמש. לכל רופא פרופיל אחד וקוד אחד');
  props_().setProperty('USERS', JSON.stringify(clean));
  try { log_(u.name, 'users', 'משתמשים והרשאות: ' + clean.map(x => x.name + ' (' + x.role + ')').join(', ')); } catch (e) {}
  return clean;
}
/** team: one person at a time, saved at once (owner only) */
const PERSON_ROLES_ = ['senior', 'resident', 'house', 'extern', 'pa', 'staff'], POS_KEYS_ = ['er1', 'er2', 'dept', 'minor', 'fm', 'active', 'passive', 'half'];
function newToken_() { return (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '').slice(0, 40); }
function ops_personSave(code, x) {
  const u = me_(code); if (!canWrite_(u, 'people')) throw new Error('רק הבעלים עורך את הצוות');
  const L = get_('people') || [];
  const name = String(x.name || '').trim().slice(0, 30); if (!name) throw new Error('חסר שם');
  let p = x.id && L.find(y => y.id === x.id);
  if (!p) { p = { id: 'p' + Utilities.getUuid().replace(/-/g, '').slice(0, 8), token: newToken_() }; L.push(p); }
  p.name = name; p.full = String(x.full || '').trim().slice(0, 60); p.role = PERSON_ROLES_.indexOf(x.role) >= 0 ? x.role : 'resident';
  p.pos = (x.pos || []).filter(k => POS_KEYS_.indexOf(k) >= 0); p.active = x.active !== false;
  p.title = String(x.title || '').trim().slice(0, 40); p.spec = String(x.spec || '').trim().slice(0, 60); p.year = String(x.year || '').trim().slice(0, 12);
  p.units = String(x.units || '').trim().slice(0, 120); p.clinics = String(x.clinics || '').trim().slice(0, 160);
  p.phone = String(x.phone || '').replace(/[^\d+\-\s]/g, '').slice(0, 20); p.email = String(x.email || '').trim().slice(0, 80);
  // a resident from another department, here on rotation: base specialty, dates, requirements and skills to gain
  const r = x.rot || {}; p.rot = r.on ? { on: true, base: String(r.base || '').trim().slice(0, 60), home: String(r.home || '').trim().slice(0, 80), from: /^\d{4}-\d\d-\d\d$/.test(r.from) ? r.from : '', to: /^\d{4}-\d\d-\d\d$/.test(r.to) ? r.to : '', mentor: String(r.mentor || '').trim().slice(0, 40), reqs: String(r.reqs || '').slice(0, 1200), skills: String(r.skills || '').slice(0, 1200) } : undefined;
  if (!p.rot) delete p.rot;
  if (!p.token) p.token = newToken_();
  set_('people', L, u.name);
  return { people: L, id: p.id };
}
/** planned leave (vacation, a course, reserve duty): a list of date ranges on a person, marked by itself in every week.
 * The owner, the department head, the chief (residents only) and the secretaries may set it */
function ops_leaves(code, pid, list) {
  const u = me_(code); if (['owner', 'director', 'deputy', 'chief', 'secretary'].indexOf(u.role) < 0) throw new Error('אין הרשאה');
  const L = get_('people') || [], p = L.find(x => x.id === pid); if (!p) throw new Error('הרופא/ה לא נמצא/ה');
  if (u.role === 'chief' && p.role === 'senior') throw new Error('הצ׳יף מעדכן חופשות של מתמחים');
  if (u.role === 'deputy' && p.role !== 'senior') throw new Error('הסגן מעדכן חופשות של בכירים');
  const ok = d => /^\d{4}-\d\d-\d\d$/.test(d);
  p.leaves = (list || []).filter(x => ok(x.f)).map(x => ({ f: x.f, t: ok(x.t) && x.t >= x.f ? x.t : x.f, w: String(x.w || '').trim().slice(0, 40), by: x.by || u.name })).sort((a, b) => a.f.localeCompare(b.f)).slice(-40);
  set_('people', L, u.name); return { people: safePeople_(u, L) };
}
/* ---------- automations: scheduled messages by mail, push and the app (the chief, the deputy, the students' coordinator) ---------- */
// for now only the owner runs automations (owner, 23/10); the others' automations stay, managed by him
const AUTO_ROLES_ = ['owner'];
const AUTO_KINDS_ = ['prefs', 'pending', 'dutyTomorrow', 'callTomorrow', 'lecture', 'custom', 'invite'];
const tz_ = d => Utilities.formatDate(d, 'Asia/Jerusalem', 'yyyy-MM-dd');
const addD_ = (iso, n) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return tz_(d); };
const MONTHS_HE_ = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
const monthHe_ = m => MONTHS_HE_[+m.slice(5, 7) - 1] + ' ' + m.slice(0, 4);
function autoList_() { return get_('auto') || []; }
function autoClean_(u, r) {
  r = r || {}; const kind = AUTO_KINDS_.indexOf(r.kind) >= 0 ? r.kind : 'custom', w = r.when || {}, a = r.aud || {}, ch = r.ch || {};
  return { id: r.id || 'a' + Date.now().toString(36), by: r.by && u.role === 'owner' ? r.by : u.role, name: String(r.name || '').trim().slice(0, 60) || 'אוטומציה', kind: kind,
    when: { type: ['monthly', 'weekly', 'daily', 'once'].indexOf(w.type) >= 0 ? w.type : 'monthly', day: Math.min(28, Math.max(1, +w.day || 10)), dow: Math.min(6, Math.max(0, +w.dow || 0)), hour: Math.min(21, Math.max(6, +w.hour || 8)), date: /^\d{4}-\d\d-\d\d$/.test(w.date || '') ? w.date : '' },
    aud: { type: ['seniors', 'residents', 'all', 'pick'].indexOf(a.type) >= 0 ? a.type : 'all', ids: (a.ids || []).slice(0, 80).map(String) },
    ch: { mail: !!ch.mail, push: ch.push !== false, app: ch.app !== false, wa: !!ch.wa, waTo: ch.waTo === 'group' ? 'group' : 'each', wg: String(ch.wg || '').slice(0, 20) }, subj: String(r.subj || '').slice(0, 140), body: String(r.body || '').slice(0, 2000), on: r.on !== false, last: r.last || '', sent: r.sent || null };
}
function ops_autoGet(code) { const u = me_(code); if (AUTO_ROLES_.indexOf(u.role) < 0) throw new Error('אין הרשאה'); const L = autoList_(); return ['owner', 'director'].indexOf(u.role) >= 0 ? L : L.filter(r => r.by === u.role); }
function ops_autoSave(code, r) {
  const u = me_(code); if (AUTO_ROLES_.indexOf(u.role) < 0) throw new Error('אין הרשאה');
  const L = autoList_(), x = autoClean_(u, r), i = L.findIndex(y => y.id === x.id);
  if (i >= 0 && L[i].by !== u.role && u.role !== 'owner') throw new Error('אפשר לערוך רק אוטומציות שלך');
  if (i >= 0) { x.last = L[i].last; x.sent = L[i].sent; L[i] = x; } else L.push(x);
  set_('auto', L, u.name); return ops_autoGet(code);
}
function ops_autoDel(code, id) { const u = me_(code); const L = autoList_(), x = L.find(y => y.id === id); if (x && x.by !== u.role && u.role !== 'owner') throw new Error('אפשר למחוק רק אוטומציות שלך'); set_('auto', L.filter(y => y.id !== id), u.name); return ops_autoGet(code); }
function ops_autoRun(code, id) { const u = me_(code); const L = autoList_(), x = L.find(y => y.id === id); if (!x) throw new Error('לא נמצא'); if (x.by !== u.role && ['owner', 'director'].indexOf(u.role) < 0) throw new Error('אין הרשאה'); const n = autoSend_(x, tz_(new Date()), u.name); return { n: n, list: ops_autoGet(code) }; }
// who gets it, each with the words that fill the message
function autoTargets_(r, day) {
  const P = (get_('people') || []).filter(p => p.active !== false), byId = {}; P.forEach(p => { byId[p.id] = p; });
  const grp = t => P.filter(p => t === 'seniors' ? p.role === 'senior' : t === 'residents' ? ['resident', 'house'].indexOf(p.role) >= 0 : t === 'pick' ? r.aud.ids.indexOf(p.id) >= 0 : ['senior', 'resident', 'house', 'extern'].indexOf(p.role) >= 0);
  const next = addD_(day.slice(0, 7) + '-28', 7).slice(0, 7), tm = addD_(day, 1), out = [];
  const POSN = { er1: 'מיון 1', er2: 'מיון 2', dept: 'מחלקה', minor: 'מיינור טראומה', fm: 'שישי בוקר', active: 'כונן פעיל', passive: 'כונן פסיבי', half: 'תורן חצי' };
  if (r.kind === 'prefs') grp(r.aud.type).filter(p => !p.noRemind).forEach(p => out.push({ p: p, v: { 'חודש': monthHe_(next) } }));
  if (r.kind === 'invite') grp(r.aud.type).filter(p => !p.profAt).forEach(p => out.push({ p: p, v: { 'קישור': OPS_WRAP_URL + '?p=' + p.token + tabMe_(p) } }));
  if (r.kind === 'custom') grp(r.aud.type).forEach(p => out.push({ p: p, v: { 'חודש': monthHe_(next) } }));
  if (r.kind === 'pending') grp(r.aud.type).filter(p => !p.noRemind && !get_('pref:' + next + ':' + p.id)).forEach(p => out.push({ p: p, v: { 'חודש': monthHe_(next) } }));
  if (r.kind === 'dutyTomorrow' || r.kind === 'callTomorrow') { const R = (get_((r.kind === 'dutyTomorrow' ? 'duty:' : 'oncall:') + tm.slice(0, 7)) || {}).days || {}, D = R[tm] || {};
    Object.keys(D).forEach(k => { if (POSN[k] && byId[D[k]]) out.push({ p: byId[D[k]], v: { 'תפקיד': POSN[k], 'תאריך': +tm.slice(8) + '/' + +tm.slice(5, 7) } }); }); }
  if (r.kind === 'lecture') { const C = get_('curr:' + tm.slice(0, 7)) || {}; if (C.apDep && C.apChief) (C.items || []).filter(x => x.d === tm).forEach(x => [x.sen, x.res].forEach(id => { if (byId[id]) out.push({ p: byId[id], v: { 'נושא': x.title || 'הרצאה', 'שעה': x.time || '', 'תאריך': +tm.slice(8) + '/' + +tm.slice(5, 7) } }); })); }
  return out;
}
/** how we address a doctor: "ד״ר" and the last name exactly as he typed it in his profile; before that, the name we have, as it is */
function drAddr_(p) { if (!p) return ''; const n = String(p.last || p.name || '').trim(); if (!n || p.role === 'staff' || p.role === 'pa') return String(p.first || p.name || '').trim(); return /^(ד["״']?ר|פרופ)/.test(n) ? n : 'ד״ר ' + n; }
/** the invitation, the same words in mail, WhatsApp and the automation */
function inviteBody_(p, link) { const dw = p.role === 'senior' ? 'כוננויות' : p.role === 'staff' ? '' : 'תורנויות';
  return 'שלום ' + drAddr_(p) + ',\nשמחים להזמין אותך להצטרף למהפכה הטכנולוגית במערך הכירורגי באופק.\nזה הקישור שלך להצטרפות לפורטל של המערך הכירורגי:\n' + link + '\n\nבכניסה הראשונה משלימים פרופיל: פרטים אישיים, העדפות' + (dw ? ' ובקשות ל' + dw : '') + '. לוקח שתי דקות.\nשמרו את הקישור, ומומלץ להוסיף אותו למסך הבית.\n\nד״ר איתן רז'; }
function autoFill_(t, p, v) {
  const first = drAddr_(p), link = OPS_WRAP_URL + '?p=' + p.token + '&tab=req';
  return String(t || '').replace(/\{([^}]{1,12})\}/g, (m, k) => k === 'שם' ? first : k === 'שם מלא' ? (p.full || p.name) : k === 'קישור' ? (v[k] || link) : v[k] != null ? v[k] : m);
}
function autoSend_(r, day, by) {
  const T = autoTargets_(r, day); let mails = 0, pushes = 0; const pids = [];
  T.forEach(x => { const subj = autoFill_(r.subj || r.name, x.p, x.v), body = autoFill_(r.body, x.p, x.v); pids.push(x.p.id);
    if (r.ch.mail && x.p.email) { try { if (MailApp.getRemainingDailyQuota() > 5) { MailApp.sendEmail({ to: x.p.email, subject: subj, body: body, name: 'Surgery X', htmlBody: autoHtml_(subj, body) }); mails++; } } catch (e) { console.log('auto mail: ' + e.message); } }
    if (r.ch.push) { try { pushes += pushSend_({ title: subj, body: body, pids: [x.p.id] }); } catch (e) { console.log('auto push: ' + e.message); } } });
  if (r.ch.wa && T.length) waQueue_(r, T, by);
  if (r.ch.app && T.length) { const L = get_('notif') || [], one = T[0]; L.unshift({ id: 'n' + Date.now(), at: new Date().toISOString(), kind: 'msg', title: autoFill_(r.subj || r.name, { name: '', full: '' }, one.v).replace(/\s{2,}/g, ' ').trim(), body: autoFill_(r.body, { name: '', full: '', token: '' }, one.v).replace(/[^\n]*\?p=[^\s]*/g, '').slice(0, 600), aud: 'none', pids: pids, by: 'אוטומציה' }); set_('notif', L.slice(0, 60), 'auto'); }
  const L = autoList_(), x = L.find(y => y.id === r.id); if (x) { x.last = day; x.sent = { at: new Date().toISOString(), n: T.length, mails: mails, pushes: pushes, by: by || 'אוטומטי' }; set_('auto', L, 'auto'); }
  try { log_(by || 'אוטומציה', 'auto', r.name + ': נשלח ל-' + T.length + (mails ? ' · ' + mails + ' מיילים' : '')); } catch (e) {}
  return T.length;
}
function autoHtml_(subj, body) {
  const e = t => String(t).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
  const b = e(body).replace(/(https:\/\/[^\s]+)/g, '<a href="$1" style="display:inline-block;background:#00876F;color:#fff;text-decoration:none;font-weight:700;border-radius:10px;padding:10px 18px;margin:8px 0">פתיחה באפליקציה</a>').replace(/\n/g, '<br>');
  return '<div dir="rtl" style="font-family:Arial,sans-serif;background:#EEF3F1;padding:20px"><div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden"><div style="background:#0C2A35;color:#fff;padding:16px 20px"><div style="color:#7FD8A8;font-size:12px;letter-spacing:.1em">SURGERY X</div><div style="font-size:20px;font-weight:700;margin-top:4px">' + e(subj) + '</div></div><div style="padding:18px 20px;font-size:15px;line-height:1.7;color:#0C2A35">' + b + '</div><div style="padding:10px 20px 16px;color:#6B7B80;font-size:12px">מערך כירורגיה כללית · המרכז הרפואי אופק</div></div></div>';
}
/* interns: from 4 days before the 1st, the Hub's snapshot carries the "rotation starts in 4 days" WhatsApp message (OpsBridge opsPreWa_).
   At 08:00 on that day it goes to the WhatsApp outbox, once per rotation: one message per intern with the personal link,
   and one for the rotation's group or broadcast list, and the owner gets a push. Nothing is sent by itself */
function internsPreWa_(day, hour, force) {
  if (hour < 8 && !force) return ''; let S; try { S = ops_internsRaw_(); } catch (e) { return 'אין סיכום מה-Hub'; }
  const w = S && S.wa; if (!w || !w.each || !w.each.length) return 'אין סטאז׳רים לסבב הבא';
  if (!force && (day < w.due || day >= w.start)) return 'עוד לא הזמן: ' + w.due;
  const done = get_('preWa') || {}; if (done[w.month] && !force) return 'כבר הוכן';
  const g = waGroups_().find(x => /סטאז/.test(x.name)) || null, at = new Date().toISOString(), id = 'w' + Date.now().toString(36);
  const items = [{ id: id + 'p', at: at, auto: 'preWa', name: 'סטאז׳רים · עוד 4 ימים מתחיל הסבב · אישי', owner: 'owner', by: 'אוטומטי', to: 'each', done: [], msgs: w.each.map(x => ({ pid: 'i:' + x.key, name: x.name, phone: x.phone, text: x.text })) },
    { id: id + 'g', at: at, auto: 'preWa', name: 'סטאז׳רים · עוד 4 ימים מתחיל הסבב · לקבוצה', owner: 'owner', by: 'אוטומטי', to: 'group', done: [], g: g ? { id: g.id, name: g.name, kind: g.kind, link: g.link } : { name: 'קבוצת הסבב או רשימת תפוצה' }, text: w.group }];
  const N = items.concat(get_('waout') || []).slice(0, 30); while (N.length > 2 && JSON.stringify(N).length > 45000) N.pop();
  set_('waout', N, 'auto'); done[w.month] = at; set_('preWa', done, 'auto');
  try { pushSend_({ title: '📲 סטאז׳רים: הגיע הזמן לשלוח "עוד 4 ימים"', body: w.each.length + ' הודעות אישיות והודעה לקבוצה מוכנות בוואטסאפ · ' + w.month, uids: users_().filter(x => x.role === 'owner').map(x => x.id) }); } catch (e) { console.log('pre wa push: ' + e.message); }
  try { log_('אוטומציה', 'auto', 'סטאז׳רים · הודעת 4 ימים לפני הסבב הוכנה לשליחה (' + w.each.length + ')'); } catch (e) {}
  return 'הוכן: ' + w.each.length;
}
// the interns portal (the Hub) shows the same "what's new in surgery": the news goes, when it changes, to a hidden tab in the Hub's sheet
const HUB_NEWS = 'Surgery X · חדשות';
function hubNewsSync_() {
  const n = get_('news'); if (!n || !n.at) return; const ss = SpreadsheetApp.openById(HUB_SHEET); let sh = ss.getSheetByName(HUB_NEWS);
  if (!sh) { sh = ss.insertSheet(HUB_NEWS); try { sh.hideSheet(); } catch (e) {} }
  if (sh.getLastRow() >= 1 && String(sh.getRange(1, 1).getValue()) === n.at) return;
  const j = JSON.stringify({ at: n.at, res: n.res || [], inn: n.inn || [], dev: n.dev || [], def: n.def || [], all: n.all || [] });
  if (j.length < 49000) sh.getRange(1, 1, 1, 2).setNumberFormat('@').setValues([[n.at, j]]);
}
// errors from the screens of doctors and managers (message and screen only), for the morning health check
function ops_clientErr(app, where, msg) {
  const c = CacheService.getScriptCache(), n = Number(c.get('cerrN') || 0); if (n > 30) return false; c.put('cerrN', String(n + 1), 600);
  const L = get_('cerr') || []; L.unshift({ at: new Date().toISOString(), app: String(app || '').slice(0, 20), where: String(where || '').slice(0, 40), msg: String(msg || '').slice(0, 300) });
  set_('cerr', L.slice(0, 120), 'auto'); return true;
}
// events from the interns portal (requests, messages, registrations): the Hub writes them to a hidden tab, here they become one push to the owner
function hubEvents_() {
  const sh = SpreadsheetApp.openById(HUB_SHEET).getSheetByName('Surgery X · אירועים'); if (!sh || sh.getLastRow() < 1) return;
  const last = String(get_('hubEvAt') || ''), R = sh.getRange(1, 1, sh.getLastRow(), 3).getValues().filter(r => String(r[0]) > last);
  if (!R.length) return; set_('hubEvAt', String(R[R.length - 1][0]), 'auto');
  if (!last) return; // the first run only marks where we are, so old events do not arrive all at once
  const U = users_().filter(x => x.role === 'owner').map(x => x.id);
  try { pushSend_(R.length === 1 ? { title: String(R[0][1]), body: String(R[0][2]) + ' · פורטל הסטאז׳רים', uids: U } : { title: '🎓 ' + R.length + ' עדכונים מהסטאז׳רים', body: R.slice(-4).map(r => r[1] + ' ' + r[2]).join(' · ').slice(0, 180), uids: U }); } catch (e) { console.log('hub events push: ' + e.message); }
  R.forEach(r => { try { log_('סטאז׳רים', 'hub', r[1] + ' · ' + r[2]); } catch (e) {} });
}
// every morning at 07:00: open both systems the way a visitor gets them and check that each script compiles (Google's server can
// break a script that looked fine locally, 24/10/2026), that the interns bridge is fresh and how many screen errors there were.
// The owner gets a push only when something needs attention; the result is kept in 'health'
const HEALTH_ = [['פורטל הסטאז׳רים · מנהלים', 'DEMO_ID_0', ''], ['פורטל הסטאז׳רים · אפליקציית סטאז׳ר', 'DEMO_ID_0', '?t=x'],
  ['פורטל המערך · דשבורד', 'DEMO_ID_1', ''], ['פורטל המערך · אפליקציית רופא', 'DEMO_ID_1', '?p=x']];
function healthPage_(id, q) {
  const h = UrlFetchApp.fetch('https:' + '/' + '/script.google.com/macros/s/' + id + '/exec' + q, { muteHttpExceptions: true, followRedirects: true }).getContentText();
  const i = h.indexOf('goog.script.init('); if (i < 0) return 'הדף לא נטען';
  const j = i + 17, qc = h[j]; let k = j + 1; while (k < h.length) { if (h[k] === '\\') { k += 2; continue; } if (h[k] === qc) break; k++; }
  const u = (JSON.parse(new Function('return ' + h.slice(j, k + 1))()) || {}).userHtml || ''; if (u.length < 2000) return 'הדף ריק';
  const re = /<script>([\s\S]*?)<\/script>/g; let m, n = 0; while ((m = re.exec(u))) { n++; try { new Function(m[1]); } catch (e) { return 'שגיאה בסקריפט: ' + e.message; } }
  return n ? '' : 'אין סקריפט';
}
function healthCheck_(day) {
  const bad = [], at = new Date().toISOString(), since = new Date(Date.now() - 864e5).toISOString();
  HEALTH_.forEach(([name, id, q]) => { let r = ''; try { r = healthPage_(id, q); } catch (e) { r = 'לא נפתח: ' + e.message; } if (r) bad.push(name + ': ' + r); });
  let hubAt = '', hubErr = 0;
  try { const S = ops_internsRaw_(); hubAt = S && S.at || ''; if (!hubAt || Date.now() - new Date(hubAt).getTime() > 2 * 3600e3) bad.push('הגשר מפורטל הסטאז׳רים לא התעדכן מאז ' + (hubAt ? Utilities.formatDate(new Date(hubAt), 'Asia/Jerusalem', 'dd/MM HH:mm') : 'אף פעם')); } catch (e) { bad.push('הגשר מפורטל הסטאז׳רים: ' + e.message); }
  try { const sh = SpreadsheetApp.openById(HUB_SHEET).getSheetByName('Surgery X · שגיאות'); if (sh && sh.getLastRow()) hubErr = sh.getRange(1, 1, sh.getLastRow(), 1).getValues().filter(r => String(r[0]) > since).length; } catch (e) {}
  const opsErr = (get_('cerr') || []).filter(x => x.at > since).length;
  if (hubErr + opsErr >= 3) bad.push((hubErr + opsErr) + ' שגיאות במסכים ב-24 השעות האחרונות (סטאז׳רים ' + hubErr + ', מערך ' + opsErr + ')');
  set_('health', { day: day, at: at, ok: !bad.length, bad: bad, hubErr: hubErr, opsErr: opsErr, hubAt: hubAt }, 'auto');
  if (bad.length) { try { pushSend_({ title: '⚠️ בדיקת הבוקר: צריך לבדוק', body: bad.join(' · ').slice(0, 180), uids: users_().filter(x => x.role === 'owner').map(x => x.id) }); } catch (e) {} try { log_('בדיקת תקינות', 'health', bad.join(' · ')); } catch (e) {} }
  return bad;
}
function ops_health(code) { const u = me_(code); if (u.role !== 'owner') throw new Error('אין הרשאה'); return get_('health') || null; }
// weekly backup, Friday night: a new spreadsheet in the system account's Drive with a copy of every tab of both systems
// (the department's data and the interns'), named by date. Only spreadsheet access is needed; old backups stay until deleted by hand
function backupWeekly_(day) {
  const B = SpreadsheetApp.create('גיבוי · Surgery X · ' + day), first = B.getSheets()[0];
  [[sheet_().getParent(), 'מערך'], [SpreadsheetApp.openById(HUB_SHEET), 'סטאז׳רים']].forEach(([src, tag]) => src.getSheets().forEach(sh => {
    try { const c = sh.copyTo(B); c.setName((tag + ' · ' + sh.getName()).slice(0, 99)); } catch (e) { console.log('backup ' + sh.getName() + ': ' + e.message); } }));
  try { if (B.getSheets().length > 1) B.deleteSheet(first); } catch (e) {}
  set_('backup', { day: day, id: B.getId(), url: B.getUrl(), tabs: B.getSheets().length }, 'auto');
  try { log_('גיבוי', 'backup', 'גיבוי שבועי: ' + B.getSheets().length + ' לשוניות · ' + B.getUrl()); } catch (e) {}
  return B.getUrl();
}
// the hourly trigger: whatever is due today at this hour and has not gone out yet
function opsAutoTick() {
  try { hubNewsSync_(); } catch (e) { console.log('hub news: ' + e.message); }
  try { hubEvents_(); } catch (e) { console.log('hub events: ' + e.message); }
  try { const nw = new Date(), d0 = tz_(nw), h0 = +Utilities.formatDate(nw, 'Asia/Jerusalem', 'H'), B0 = get_('backup'); if (new Date(d0 + 'T12:00:00').getDay() === 5 && h0 >= 2 && h0 < 6 && (!B0 || B0.day !== d0)) backupWeekly_(d0); } catch (e) { console.log('backup: ' + e.message); }
  try { const nw = new Date(), d0 = tz_(nw), h0 = +Utilities.formatDate(nw, 'Asia/Jerusalem', 'H'), H0 = get_('health'); if (h0 >= 7 && (!H0 || H0.day !== d0)) healthCheck_(d0); } catch (e) { console.log('health: ' + e.message); }
  try { internsPreWa_(tz_(new Date()), +Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'H')); } catch (e) { console.log('interns pre wa: ' + e.message); }
  try { const n = get_('news'); if (!n || Date.now() - new Date(n.at).getTime() > 6 * 3600e3) newsRefresh_(); } catch (e) { console.log('news tick: ' + e.message); }
  const now = new Date(), day = tz_(now), hour = +Utilities.formatDate(now, 'Asia/Jerusalem', 'H'), dow = new Date(day + 'T12:00:00').getDay(), dom = +day.slice(8);
  autoList_().forEach(r => { if (!r.on || r.last === day || hour < r.when.hour) return;
    const due = r.when.type === 'daily' || (r.when.type === 'monthly' && dom === r.when.day) || (r.when.type === 'weekly' && dow === r.when.dow) || (r.when.type === 'once' && r.when.date === day);
    if (due) { try { autoSend_(r, day, 'אוטומטי'); } catch (e) { console.log('auto ' + r.id + ': ' + e.message); } } });
}
/* ---------- WhatsApp: WhatsApp does not let a system send from a personal account, so the automation prepares the
   message at its hour and the manager sends it in one click from WhatsApp Web (a group, a broadcast list or one by one) ---------- */
function waGroups_() { return get_('wagroups') || []; }
function ops_waGroupsSave(code, list) {
  const u = me_(code); if (AUTO_ROLES_.indexOf(u.role) < 0) throw new Error('אין הרשאה');
  const L = (list || []).slice(0, 30).map(g => ({ id: String(g.id || 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)).slice(0, 20), name: String(g.name || '').trim().slice(0, 60), kind: g.kind === 'list' ? 'list' : 'group', link: /^https:\/\/chat\.whatsapp\.com\/[\w-]{6,40}$/.test(String(g.link || '').trim()) ? String(g.link).trim() : '', all: !!g.all })).filter(g => g.name);
  set_('wagroups', L, u.name); return L;
}
// the words for a message that goes to a whole group: no personal name or link; {רשימה} is who it is about
function waGroupText_(r, T) {
  const v = Object.assign({}, T[0].v), names = T.map(x => x.v['תפקיד'] ? x.v['תפקיד'] + ': ' + x.p.name : x.p.name);
  const fill = t => String(t || '').replace(/\{([^}]{1,12})\}/g, (m, k) => k === 'שם' || k === 'שם מלא' ? '' : k === 'קישור' ? OPS_WRAP_URL : k === 'רשימה' ? names.join('\n') : v[k] != null ? v[k] : m)
    .replace(/שלום\s*,/g, 'שלום לכולם,').replace(/[ \t]{2,}/g, ' ');
  let body = fill(r.body); if (['pending', 'dutyTomorrow', 'callTomorrow', 'lecture'].indexOf(r.kind) >= 0) { if (String(r.body).indexOf('{רשימה}') < 0) body += '\n\n' + names.join('\n'); }
  return ('*' + fill(r.subj || r.name).trim() + '*\n' + body).trim();
}
function waQueue_(r, T, by) {
  const L = get_('waout') || [], g = r.ch.waTo === 'group' ? waGroups_().find(x => x.id === r.ch.wg) || null : null;
  const it = { id: 'w' + Date.now().toString(36), at: new Date().toISOString(), auto: r.id, name: r.name, owner: r.by, by: by || 'אוטומטי', to: r.ch.waTo === 'group' ? 'group' : 'each', done: [] };
  if (it.to === 'group') { it.g = g ? { id: g.id, name: g.name, kind: g.kind, link: g.link } : { name: 'לא נבחרה קבוצה' }; it.text = waGroupText_(r, T); }
  else it.msgs = T.map(x => ({ pid: x.p.id, name: x.p.name, phone: String(x.p.phone || '').replace(/\D/g, ''), text: autoFill_('*' + (r.subj || r.name) + '*\n' + r.body, x.p, x.v) }));
  const N = [it].concat(L).slice(0, 30); while (N.length > 1 && JSON.stringify(N).length > 45000) N.pop();
  set_('waout', N, 'auto');
  try { const U = users_().filter(x => x.role === 'owner').map(x => x.id);
    pushSend_({ title: '📲 וואטסאפ מוכן לשליחה', body: r.name + (it.to === 'group' ? ' · ' + it.g.name : ' · ' + it.msgs.length + ' הודעות'), uids: U }); } catch (e) { console.log('wa push: ' + e.message); }
}
function ops_waOut(code) { const u = me_(code); if (AUTO_ROLES_.indexOf(u.role) < 0) throw new Error('אין הרשאה'); const L = get_('waout') || []; return { out: ['owner', 'director'].indexOf(u.role) >= 0 ? L : L.filter(x => x.owner === u.role), groups: waGroups_() }; }
function ops_waDone(code, id, pid, undo) {
  const u = me_(code); if (AUTO_ROLES_.indexOf(u.role) < 0) throw new Error('אין הרשאה');
  const L = get_('waout') || [], x = L.find(y => y.id === id); if (!x) throw new Error('לא נמצא');
  const k = pid || '*'; x.done = (x.done || []).filter(d => d !== k); if (!undo) x.done.push(k);
  set_('waout', L, 'auto'); return ops_waOut(code);
}
function ops_waDel(code, id) { const u = me_(code); if (AUTO_ROLES_.indexOf(u.role) < 0) throw new Error('אין הרשאה'); set_('waout', (get_('waout') || []).filter(y => y.id !== id), 'auto'); return ops_waOut(code); }

/* ---------- what's new in surgery: the latest papers (PubMed) and device clearances (openFDA), refreshed every few hours ---------- */
const NEWS_J_ = [
  ['annsurg', 'Ann Surg', 'Annals of Surgery'], ['jamasurg', 'JAMA Surg', 'JAMA Surgery'], ['bjs', 'Br J Surg', 'British Journal of Surgery'], ['jacs', 'J Am Coll Surg', 'Journal of the American College of Surgeons'],
  ['nejm', 'N Engl J Med', 'New England Journal of Medicine'], ['lancet', 'Lancet', 'The Lancet'], ['surgendo', 'Surg Endosc', 'Surgical Endoscopy'], ['surgery', 'Surgery', 'Surgery'],
  ['aso', 'Ann Surg Oncol', 'Annals of Surgical Oncology'], ['dcr', 'Dis Colon Rectum', 'Diseases of the Colon & Rectum'], ['obes', 'Obes Surg', 'Obesity Surgery'], ['hpb', 'HPB (Oxford)', 'HPB'],
  ['wjs', 'World J Surg', 'World Journal of Surgery'], ['jtacs', 'J Trauma Acute Care Surg', 'Journal of Trauma and Acute Care Surgery'], ['soard', 'Surg Obes Relat Dis', 'Surgery for Obesity and Related Diseases'], ['hernia', 'Hernia', 'Hernia']
];
const NEWS_DEF_ = ['annsurg', 'jamasurg', 'bjs', 'jacs', 'surgendo', 'nejm'];
// only clearances that matter to a general surgeon (the panel also clears hair lasers and beauty devices)
const DEV_OK_ = /mesh|stapl|electrosurg|clip|laparoscop|endoscop|robot|trocar|hernia|suture|retract|ultrason|vessel|ligat|wound|hemosta|seal|camera|insufflat|anastomo|smoke evac/i, DEV_NO_ = /hair|light based|dermatolog|massag|aesthetic|tattoo|dental|over-the-counter|phototherapy|led therapy|laser/i;
function newsCfg_() { const c = get_('newscfg') || {}; return { j: (c.j && c.j.length ? c.j : NEWS_DEF_).filter(k => NEWS_J_.some(x => x[0] === k)) }; }
function ops_newsCfg(code, j) { const u = me_(code); if (u.role !== 'owner') throw new Error('רק לבעלים'); set_('newscfg', { j: (j || []).filter(k => NEWS_J_.some(x => x[0] === k)).slice(0, 16) }, u.name); const n = get_('news'); if (n) { n.def = newsCfg_().j; set_('news', n, 'auto'); } return { cfg: newsCfg_(), news: n }; }
function ops_newsList(code) { me_(code); return { all: NEWS_J_.map(x => ({ k: x[0], name: x[2] })), cfg: newsCfg_() }; }
function newsJson_(url) { const r = UrlFetchApp.fetch(url, { muteHttpExceptions: true, headers: { 'User-Agent': 'SurgeryX/1.0' } }); return r.getResponseCode() === 200 ? JSON.parse(r.getContentText()) : null; }
function pubmed_(term, n) {
  const E = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/', q = encodeURIComponent(term);
  const ids = ((newsJson_(E + 'esearch.fcgi?db=pubmed&retmode=json&sort=pub_date&retmax=' + n + '&term=' + q) || {}).esearchresult || {}).idlist || [];
  if (!ids.length) return []; Utilities.sleep(350);
  const R = (newsJson_(E + 'esummary.fcgi?db=pubmed&retmode=json&id=' + ids.join(',')) || {}).result || {};
  return ids.map(id => R[id]).filter(Boolean).map(x => { const doi = ((x.articleids || []).find(a => a.idtype === 'doi') || {}).value || '';
    return { id: x.uid, j: x.source, t: String(x.title || '').replace(/<[^>]+>/g, '').slice(0, 260), d: x.sortpubdate ? x.sortpubdate.slice(0, 10).replace(/\//g, '-') : '', pd: x.pubdate || '', au: ((x.authors || [])[0] || {}).name || '', n: (x.authors || []).length, doi: doi, u: 'https://pubmed.ncbi.nlm.nih.gov/' + x.uid + '/' }; });
}
function newsRefresh_() {
  const cfg = newsCfg_(), J = NEWS_J_, out = { at: new Date().toISOString(), res: [], inn: [], dev: [], def: cfg.j, all: NEWS_J_.map(x => ({ k: x[0], ta: x[1], name: x[2] })) };
  try { J.forEach(x => { try { out.res = out.res.concat(pubmed_('"' + x[1] + '"[ta] AND hasabstract' + (x[0] === 'nejm' || x[0] === 'lancet' ? ' AND (surg*[ti] OR operat*[ti] OR resection[ti] OR appendic*[ti] OR hernia[ti] OR cancer[ti])' : ''), 3)); } catch (e) { console.log('news ' + x[0] + ': ' + e.message); } Utilities.sleep(350); });
    // newest first, but one journal at a time so the strip is varied
    const by = {}; out.res.sort((a, b) => b.d.localeCompare(a.d)).forEach(x => (by[x.j] = by[x.j] || []).push(x)); const mix = []; for (let i = 0; i < 3; i++) Object.keys(by).forEach(j => { if (by[j][i]) mix.push(by[j][i]); }); out.res = mix.map(x => Object.assign(x, { t: x.t.slice(0, 200) })); } catch (e) { console.log('news res: ' + e.message); }
  try { const jt = J.map(x => '"' + x[1] + '"[ta]').join(' OR ');
    out.inn = pubmed_('(' + jt + ') AND (robot*[ti] OR "artificial intelligence"[ti] OR "machine learning"[ti] OR "deep learning"[ti] OR novel[ti] OR innovat*[ti] OR "large language"[ti] OR "augmented reality"[ti])', 20); } catch (e) { console.log('news inn: ' + e.message); }
  try { const d = newsJson_('https://api.fda.gov/device/510k.json?search=advisory_committee:SU&sort=decision_date:desc&limit=100') || {};
    out.dev = (d.results || []).filter(x => { const t = (x.device_name || '') + ' ' + ((x.openfda || {}).device_name || ''); return DEV_OK_.test(t) && !DEV_NO_.test(t); }).slice(0, 12)
      .map(x => ({ k: x.k_number, d: String(x.decision_date || '').slice(0, 10), t: String(x.device_name || '').slice(0, 140), co: String(x.applicant || '').slice(0, 60), kind: String((x.openfda || {}).device_name || '').slice(0, 80), u: 'https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=' + x.k_number })); } catch (e) { console.log('news dev: ' + e.message); }
  while (JSON.stringify(out).length > 45000 && out.res.length > 20) { out.res.pop(); if (out.inn.length > 10) out.inn.pop(); }
  if (out.res.length || out.dev.length) set_('news', out, 'auto');
  return out;
}
function newsGet_() { return get_('news'); }
// each person's own journals: doctors by their link, managers by their code (kept on the profile when linked)
function newsWho_(key) { const k = String(key || ''); try { return 'p:' + personByToken_(k).id; } catch (e) { const u = me_(k); return u.pid ? 'p:' + u.pid : 'u:' + u.id; } }
function ops_newsMine(key, list) {
  const who = newsWho_(key), M = get_('njsel') || {}, L = (list || []).map(String).filter(k => NEWS_J_.some(x => x[0] === k)).slice(0, 16);
  if (L.length) M[who] = L; else delete M[who]; set_('njsel', M, 'chat'); return M[who] || null;
}
// the page asks for fresh news after it is drawn, so signing in never waits for PubMed
function ops_newsFresh(key) {
  const k = String(key || ''); try { personByToken_(k); } catch (e) { me_(k); }
  const n = get_('news'); if (n && Date.now() - new Date(n.at).getTime() < 6 * 3600e3) return n;
  const c = CacheService.getScriptCache(); if (c.get('newsbusy')) return n; c.put('newsbusy', '1', 120);
  try { return newsRefresh_(); } finally { c.remove('newsbusy'); }
}

/* ---------- WhatsApp distribution lists (the owner): a personal message to each one in turn, or one general link for the whole list.
   Nothing leaves by itself: every message opens ready in the owner's WhatsApp and he presses send ---------- */
// who has opened his personal app (and from which link): a device that opened it once is recognised by the general link
// every visit goes to the change log (at most once per half hour per person), for the owner's live activity monitor
function visitMark_(id, name, what) {
  if (!what || typeof CacheService === 'undefined') return; const c = CacheService.getScriptCache(), k = 'visit|' + id; if (c.get(k)) return; c.put(k, '1', 1800);
  try { log_(name, 'open', what); } catch (e) {}
}
function seenMark_(pid, via) {
  const M = get_('seen') || {}, x = M[pid] || {}, now = Date.now(), gen = via === 'gen';
  if (x.first) visitMark_('p:' + pid, ((get_('people') || []).find(p => p.id === pid) || {}).name || pid, 'פתח/ה את האפליקציה האישית');
  if (x.at && now - new Date(x.at).getTime() < 6 * 3600e3 && (!gen || x.gen)) return;
  M[pid] = { at: new Date().toISOString(), first: x.first || new Date().toISOString(), gen: !!(x.gen || gen), n: (x.n || 0) + 1 };
  set_('seen', M, 'chat');
  if (!x.first) { const nm = ((get_('people') || []).find(p => p.id === pid) || {}).name || pid; try { log_(nm, 'seen', 'כניסה ראשונה לאפליקציה האישית'); } catch (e) {} ownerPing_(nm, '👋 ' + nm + ' נכנס/ה לאפליקציה', 'כניסה ראשונה לאפליקציה האישית'); }
}
const DL_DEF_ = [{ id: 'sen', name: 'בכירים', roles: ['senior'] }, { id: 'res', name: 'מתמחים ורופאי בית', roles: ['resident', 'house'] }, { id: 'ext', name: 'תורני חוץ', roles: ['extern'] }, { id: 'all', name: 'כל הרופאים', roles: ['senior', 'resident', 'house', 'extern'] }];
function dlists_() { const L = get_('dlists'); return L && L.length ? L : DL_DEF_.map(x => Object.assign({ add: [], rm: [] }, x)); }
function ops_dlists(code) {
  const u = me_(code); if (u.role !== 'owner') throw new Error('רק לבעלים');
  return { lists: dlists_(), seen: get_('seen') || {}, runs: get_('druns') || {} };
}
function ops_dlistsSave(code, lists) {
  const u = me_(code); if (u.role !== 'owner') throw new Error('רק לבעלים');
  const R = ['senior', 'resident', 'house', 'extern', 'staff'], ids = new Set((get_('people') || []).map(p => p.id));
  const L = (lists || []).slice(0, 20).map(x => ({ id: String(x.id || 'l' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)).slice(0, 20), name: String(x.name || '').trim().slice(0, 40) || 'רשימה',
    roles: (x.roles || []).filter(r => R.indexOf(r) >= 0), add: (x.add || []).filter(i => ids.has(i)).slice(0, 80), rm: (x.rm || []).filter(i => ids.has(i)).slice(0, 80), wa: String(x.wa || '').slice(0, 60) }));
  set_('dlists', L, u.name); return ops_dlists(code);
}
// a personal round: who is in it and who already got it; kept so it can stop and continue later
// mails: the first one is the main one. A different mail is kept as an extra (newest first); the same one only confirms it
function mailSet_(p, v, by) {
  v = String(v || '').trim().toLowerCase(); if (!v) return;
  const cur = String(p.email || '').trim().toLowerCase(), ex = (p.emails || []).map(x => String(x).toLowerCase());
  if (!cur) { p.email = v; p.emails = ex.filter(x => x !== v); }
  else if (v !== cur && ex.indexOf(v) < 0) p.emails = [v].concat(ex).slice(0, 4);
  if (v === cur || !cur) p.mailOk = by === 'self' ? new Date().toISOString() : p.mailOk;
}
// the owner types everyone's phone (and mail) in one table
function ops_phonesSave(code, map) {
  const u = me_(code); if (u.role !== 'owner') throw new Error('רק לבעלים');
  const L = get_('people') || []; let n = 0;
  Object.keys(map || {}).forEach(id => { const p = L.find(x => x.id === id), v = map[id] || {}; if (!p) return;
    if (v.phone != null) { p.phone = String(v.phone).replace(/[^0-9+\- ]/g, '').trim().slice(0, 20); n++; }
    if (v.email != null) { const e = String(v.email).trim().slice(0, 80); if (!e) p.email = ''; else if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) { if (v.addMail) mailSet_(p, e, u.name); else p.email = e.toLowerCase(); } } });
  set_('people', L, u.name); return { people: safePeople_(u, L), n: n };
}
/** the owner sent an invitation or a reminder by WhatsApp: when, and how many times (owner only, never shown to doctors) */
function ops_sentMark(code, pid, kind) {
  const u = me_(code); const tp = (get_('people') || []).find(p => p.id === String(pid || '')); if (!tp || !linkOk_(u, tp)) throw new Error('אין הרשאה לשלוח לרופא/ה הזה/ו');
  pid = String(pid || ''); kind = /^rem(:\d{4}-\d{2})?$/.test(String(kind)) ? String(kind) : 'inv';
  if (!(get_('people') || []).some(p => p.id === pid)) throw new Error('הרופא/ה לא נמצא/ה');
  const L = get_('sentlog') || {}, o = L[pid] = L[pid] || {}, x = o[kind] || { n: 0 };
  o[kind] = { at: new Date().toISOString(), n: (x.n || 0) + 1 };
  set_('sentlog', L, 'chat'); return L;
}
function ops_drun(code, listId, act, data) {
  const u = me_(code); if (u.role !== 'owner') throw new Error('רק לבעלים');
  const R = get_('druns') || {}; let r = R[listId];
  if (act === 'start') { r = R[listId] = { at: new Date().toISOString(), tpl: String((data || {}).tpl || '').slice(0, 20), text: String((data || {}).text || '').slice(0, 1500), ids: ((data || {}).ids || []).map(String).slice(0, 80), done: {} };
    log_(u.name, 'dlist', 'סבב שליחה אישית: ' + r.ids.length + ' נמענים'); }
  else if (act === 'mark' && r) { const pid = String((data || {}).pid || ''); if (r.ids.indexOf(pid) < 0) throw new Error('לא ברשימה'); r.done[pid] = (data || {}).st === 'skip' ? 'skip' : { st: 'sent', at: new Date().toISOString() }; }
  else if (act === 'unmark' && r) delete r.done[String((data || {}).pid || '')];
  else if (act === 'end') { delete R[listId]; }
  else if (act === 'general') { const G = get_('dlsent') || []; G.unshift({ at: new Date().toISOString(), list: listId, text: String((data || {}).text || '').slice(0, 300) }); set_('dlsent', G.slice(0, 30), 'chat'); log_(u.name, 'dlist', 'הודעה לרשימת תפוצה: ' + listId); return ops_dlists(code); }
  set_('druns', R, 'chat'); return ops_dlists(code);
}
/** run once in the editor as the system account: approves mail and the scheduler, and starts the hourly check */
function opsAutoInstall() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'opsAutoTick').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('opsAutoTick').timeBased().everyHours(1).create();
  Logger.log('האוטומציות פעילות · מכסת מיילים להיום: ' + MailApp.getRemainingDailyQuota());
}

/** leave requests: the chief asks, the department head decides; an approved one goes straight into the person's leaves */
const okDate_ = d => /^\d{4}-\d\d-\d\d$/.test(String(d || ''));
function ops_leaveReq(code, r) {
  const u = me_(code); if (['owner', 'director', 'deputy', 'chief'].indexOf(u.role) < 0) throw new Error('אין הרשאה');
  r = r || {}; const P = (get_('people') || []).find(x => x.id === r.pid); if (!P) throw new Error('הרופא/ה לא נמצא/ה');
  if (!okDate_(r.f)) throw new Error('חסר תאריך');
  const t = okDate_(r.t) && r.t >= r.f ? r.t : r.f, L = get_('leavereq') || [];
  const x = { id: 'q' + Date.now().toString(36), pid: P.id, f: r.f, t: t, w: String(r.w || '').trim().slice(0, 40), by: u.name, byRole: u.role, at: new Date().toISOString(), st: 'wait' };
  L.unshift(x); set_('leavereq', L.slice(0, 200), u.name);
  try { const uids = users_().filter(y => y.role === 'director' || y.role === 'owner').map(y => y.id); pushSend_({ title: '🏖 בקשת חופשה · ' + P.name, body: x.f + (x.t !== x.f ? ' – ' + x.t : '') + (x.w ? ' · ' + x.w : '') + ' · ' + u.name, uids: uids }, u.id); } catch (e) { console.log('push: ' + e.message); }
  return L;
}
/** a doctor asks for leave from the personal link; it waits for the department head and blocks the boards meanwhile */
function ops_leaveReqMe(token, f, t, w) {
  const p = personByToken_(token); if (!okDate_(f)) throw new Error('חסר תאריך');
  t = okDate_(t) && t >= f ? t : f; const L = get_('leavereq') || [];
  const x = { id: 'q' + Date.now().toString(36), pid: p.id, f: f, t: t, w: String(w || '').trim().slice(0, 40), by: p.name, byRole: 'self', at: new Date().toISOString(), st: 'wait' };
  L.unshift(x); set_('leavereq', L.slice(0, 200), p.name);
  try { const U = users_(), uids = U.filter(y => y.role === 'director' || y.role === 'owner' || y.role === (p.role === 'senior' ? 'deputy' : 'chief')).map(y => y.id); pushSend_({ title: '🏖 בקשת חופשה · ' + p.name, body: f + (t !== f ? ' – ' + t : '') + (x.w ? ' · ' + x.w : ''), uids: uids }); } catch (e) { console.log('push: ' + e.message); }
  return (get_('leavereq') || []).filter(q => q.pid === p.id).slice(0, 20);
}
function ops_leaveReqDelMe(token, id) { const p = personByToken_(token); const L = get_('leavereq') || [], x = L.find(q => q.id === id && q.pid === p.id); if (!x || x.st !== 'wait') throw new Error('אפשר לבטל רק בקשה שעוד ממתינה'); set_('leavereq', L.filter(q => q.id !== id), p.name); return L.filter(q => q.id !== id && q.pid === p.id).slice(0, 20); }
function ops_noRemindMe(token, on) { const L = get_('people') || [], tok = String(token || ''), p = tok.length >= 12 ? L.find(x => x.token === tok) : null; if (!p) throw new Error('הקישור לא נמצא'); p.noRemind = !!on; set_('people', L, p.name); return { ok: true }; }
function ops_leaveDecide(code, id, ok, note) {
  const u = me_(code); if (['owner', 'director'].indexOf(u.role) < 0) throw new Error('רק מנהל המערך מאשר חופשות');
  const L = get_('leavereq') || [], x = L.find(y => y.id === id); if (!x) throw new Error('הבקשה לא נמצאה');
  x.st = ok ? 'ok' : 'no'; x.note = String(note || '').trim().slice(0, 200); x.dby = u.name; x.dat = new Date().toISOString();
  let people = null;
  if (ok) { const PL = get_('people') || [], p = PL.find(y => y.id === x.pid);
    if (p) { p.leaves = (p.leaves || []).filter(l => !(l.f === x.f && (l.t || l.f) === x.t)).concat([{ f: x.f, t: x.t, w: x.w || 'חופשה', by: u.name, rq: x.id }]).sort((a, b) => a.f.localeCompare(b.f)).slice(-40); set_('people', PL, u.name); people = PL; } }
  set_('leavereq', L, u.name);
  try { const asker = users_().filter(y => y.name === x.by || y.role === 'chief').map(y => y.id); const P = (people || get_('people') || []).find(y => y.id === x.pid) || {}; pushSend_({ title: (ok ? '✅ אושרה חופשה · ' : '❌ לא אושרה חופשה · ') + (P.name || ''), body: x.f + (x.t !== x.f ? ' – ' + x.t : '') + (x.note ? ' · ' + x.note : ''), uids: asker }, u.id); } catch (e) { console.log('push: ' + e.message); }
  return { req: L, people: people ? safePeople_(u, people) : null };
}
function ops_leaveReqs(code) { const u = me_(code); if (['owner', 'director', 'deputy', 'chief'].indexOf(u.role) < 0) return []; return get_('leavereq') || []; }
function ops_leaveReqDel(code, id) { const u = me_(code); const L = get_('leavereq') || [], x = L.find(y => y.id === id); if (!x) return L; if (x.st !== 'wait' || (x.by !== u.name && ['owner', 'director'].indexOf(u.role) < 0)) throw new Error('אפשר לבטל רק בקשה ממתינה שלך'); const N = L.filter(y => y.id !== id); set_('leavereq', N, u.name); return N; }
function ops_personDelete(code, id) {
  const u = me_(code); if (!canWrite_(u, 'people')) throw new Error('רק הבעלים עורך את הצוות');
  const L = (get_('people') || []).filter(y => y.id !== id);
  set_('people', L, u.name);
  const U = users_(); if (U.some(y => y.pid === id && y.role !== 'owner')) props_().setProperty('USERS', JSON.stringify(U.filter(y => !(y.pid === id && y.role !== 'owner'))));
  return { people: L, users: users_().map(userOut_) };
}
function ops_personNewLink(code, id) {
  const u = me_(code); if (!canWrite_(u, 'people')) throw new Error('רק הבעלים');
  const L = get_('people') || [], p = L.find(y => y.id === id); if (!p) throw new Error('לא נמצא');
  p.token = newToken_(); set_('people', L, u.name); return { people: L };
}
/** system access for a person on the team: role + own code, or none */
function ops_personAccess(code, pid, role, newCode) {
  const u = me_(code); if (u.role !== 'owner') throw new Error('רק לבעלים');
  const p = (get_('people') || []).find(y => y.id === pid); if (!p) throw new Error('לא נמצא');
  let U = users_(); const cur = U.find(y => y.pid === pid);
  if (cur && cur.role === 'owner') throw new Error('את הבעלים משנים בהגדרות');
  newCode = String(newCode || '').trim();
  if (!role) U = U.filter(y => y.pid !== pid);
  else {
    if (!ROLES[role] || role === 'owner') throw new Error('תפקיד לא תקין');
    if (newCode && newCode.length < 4) throw new Error('קוד של 4 תווים לפחות');
    if (newCode && U.some(y => y.code === newCode && y.pid !== pid)) throw new Error('הקוד הזה כבר בשימוש');
    if (!cur && !newCode) throw new Error('צריך קוד כניסה');
    if (cur) { cur.role = role; cur.name = p.full || p.name; if (newCode) cur.code = newCode; }
    else U.push({ id: 'u' + Utilities.getUuid().slice(0, 8), name: p.full || p.name, role: role, code: newCode, pid: pid });
  }
  props_().setProperty('USERS', JSON.stringify(U));
  return users_().map(userOut_);
}
/** profile photo: small square JPEG, kept apart from the people list */
function photoClean_(data) { data = String(data || ''); if (!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/.test(data) || data.length > 48000) throw new Error('התמונה לא תקינה או גדולה מדי'); return data; }
function photoPut_(pid, data, by) {
  const L = get_('people') || [], p = L.find(y => y.id === pid); if (!p) throw new Error('לא נמצא');
  if (data) set_('photo:' + pid, photoClean_(data), by); else set_('photo:' + pid, null, by);
  p.ph = data ? Date.now() : 0; set_('people', L, by); return { people: L };
}
function ops_photoSave(code, pid, data) { const u = me_(code); if (!canWrite_(u, 'people')) throw new Error('רק הבעלים'); return photoPut_(pid, data, u.name); }
/** a doctor fills in their own profile from the personal link: only these fields, short and clean */
const PROF_KEYS_ = { first: 30, last: 40, sub: 60, phone: 20, email: 80, spec: 60, interests: 160, langs: 80, bio: 400, bday: 5, edu: 160, year: 2 };
function ops_profileMe(token, data) {
  const L = get_('people') || [], tok = String(token || ''), p = tok.length >= 12 ? L.find(x => x.token === tok) : null;
  if (!p) throw new Error('הקישור לא נמצא. בקשו קישור חדש');
  data = data || {};
  Object.keys(PROF_KEYS_).forEach(k => { if (!(k in data)) return; let v = String(data[k] == null ? '' : data[k]).replace(/[<>]/g, '').trim().slice(0, PROF_KEYS_[k]);
    if (k === 'email' && v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) throw new Error('כתובת המייל לא תקינה');
    if (k === 'bday' && v && !/^\d{2}-\d{2}$/.test(v)) v = '';
    if (k === 'year' && (p.role !== 'resident' || (v && !/^[1-6]$/.test(v)))) return;
    if (k === 'email') { mailSet_(p, v, 'self'); return; }
    p[k] = v; });
  if (p.first || p.last) p.full = (p.role === 'staff' ? '' : 'ד״ר ') + [p.first, p.last].filter(Boolean).join(' ');
  p.profAt = new Date().toISOString(); set_('people', L, p.name);
  return { ok: true };
}
/** a manager changes the picture on his own profile (the one his code is linked to) */
function ops_photoMine(code, data) { const u = me_(code); if (!u.pid) throw new Error('המשתמש לא מקושר לפרופיל רופא'); const r = photoPut_(u.pid, data, u.name); return { people: safePeople_(u, r.people) }; }
/** the registration link: a doctor's personal link by mail, to complete the profile (the owner sends it) */
function inviteText_(p) { const link = OPS_WRAP_URL + '?p=' + p.token + tabMe_(p); return { subj: 'הפרופיל שלך במערך הכירורגי · Surgery X', body: inviteBody_(p, link) }; }
function ops_sendInvite(code, pid) {
  const u = me_(code); if (['owner', 'director'].indexOf(u.role) < 0) throw new Error('רק לבעלים');
  const p = (get_('people') || []).find(x => x.id === pid); if (!p) throw new Error('לא נמצא'); if (!p.email) throw new Error('אין מייל בפרופיל. אפשר לשלוח בוואטסאפ');
  const t = inviteText_(p); MailApp.sendEmail({ to: p.email, subject: t.subj, body: t.body, name: 'Surgery X', htmlBody: autoHtml_(t.subj, t.body) });
  try { log_(u.name, 'invite', 'קישור הרשמה במייל ל' + p.name); } catch (e) {} return { ok: true };
}
function ops_photoMe(token, data) { const p = personByToken_(token); photoPut_(p.id, data, p.name); return { ok: true, ph: Date.now() }; }
function userOut_(x) { return { id: x.id, name: x.name, role: x.role, code: x.code, pid: x.pid || '' }; }
/** preferences: everything the managers need for one month */
function ops_prefsAll(code, month) {
  me_(code);
  const o = {}, f = {}; keysWith_('pref:' + month + ':').forEach(r => { o[r.key.split(':')[2]] = r.val; });
  keysWith_('fixed:').forEach(r => { f[r.key.split(':')[1]] = r.val; });
  const last = addD_(month + '-28', 7).slice(0, 7) + '-01';
  return { prefs: o, fixed: f, open: get_('prefsopen:' + month), leaveReq: (get_('leavereq') || []).filter(q => q.st === 'wait' && q.f < last && q.t >= month + '-01') };
}

/** the chief places residents only: everything about seniors and all the free text must stay as it was */
const CHIEF_K_ = ['rn', 'rs', 'er', 'preop', 'study', 'abs'];
// the secretaries change operations, rooms (names, notes), texts and absences; who is placed where stays as it was
function secGuard_(oldW, newW) {
  const ids = w => { const out = {}; Object.keys((w && w.days) || {}).forEach(d => { const D = w.days[d] || {}, o = [];
    Object.keys(D).sort().forEach(k => { if (k === 'abs' || !Array.isArray(D[k])) return; if (k === 'or') D.or.forEach(r => (r.ids || []).forEach(x => o.push('or:' + x.id))); else D[k].forEach(x => o.push(k + ':' + x.id)); });
    if (o.length) out[d] = o.sort().join(','); }); return out; };
  const A = ids(oldW), B = ids(newW);
  if (Object.keys(A).concat(Object.keys(B)).some(d => (A[d] || '') !== (B[d] || ''))) throw new Error('המזכירות משנות ניתוחים, חדרים, טקסטים והיעדרויות. את הרופאים משבצים מנהל המערך והצ׳יף');
}
function weekGuard_(oldW, newW) {
  const roles = {}; (get_('people') || []).forEach(p => { roles[p.id] = p.role; });
  const strip = w => {
    const days = (w && w.days) || {}, out = {};
    Object.keys(days).sort().forEach(d => {
      const D = days[d] || {}, o = {};
      Object.keys(D).sort().forEach(k => {
        if (k === 'absNote') return;
        const v = D[k];
        // the chief places residents only, and only in his rows: wings (rounds north / south), ER, pre-op clinic, study meeting, absences.
        // everything else (operating rooms, consults, ER lead, day ward, clinics, texts) is the department head's
        if (k === 'or') { if ((v || []).length) o.or = (v || []).map(r => ({ n: r.n, note: r.note || '', proc: r.proc || [], ids: (r.ids || []).map(x => x.id + (x.c || '')) })); }
        else if (Array.isArray(v)) { const a = CHIEF_K_.indexOf(k) >= 0 ? v.filter(x => roles[x.id] === 'senior').map(x => x.id + (x.c || '')) : v.map(x => x.id + (x.c || '')); if (a.length) o[k] = a; }
        else o[k] = v;
      });
      if (JSON.stringify(o) !== '{}') out[d] = o;
    });
    return out;
  };
  if (!oldW) return;
  const A = strip(oldW), B = strip(newW), had = (oldW && oldW.days) || {};
  // a day the chief opens for the first time starts from the weekly defaults (texts, rooms): only placements count there
  const placed = o => Object.keys(o || {}).some(k => k === 'or' ? o.or.some(r => r.ids.length || r.proc.length) : Array.isArray(o[k]) && o[k].length);
  const bad = Object.keys(A).concat(Object.keys(B)).some(d => had[d] ? JSON.stringify(A[d] || {}) !== JSON.stringify(B[d] || {}) : placed(B[d]));
  if (bad) throw new Error('הצ׳יף משבץ מתמחים בצפון, בדרום, במיון, בטרום ניתוח ובישיבת הלימודים. שאר התוכנית בידי מנהל המערך');
}

/* ---------------- preference links (no login, a personal token) ---------------- */
function personByToken_(token) {
  token = String(token || ''); if (token.length < 12) throw new Error('הקישור לא תקין');
  const p = (get_('people') || []).find(x => x.token === token);
  if (!p) throw new Error('הקישור לא נמצא. בקשו קישור חדש');
  return p;
}
function ops_prefsMe(token, month) {
  const p = personByToken_(token);
  return { person: { id: p.id, name: p.name, full: p.full || p.name, role: p.role, noRemind: !!p.noRemind, leaves: p.leaves || [] }, maxBlock: ['resident', 'house'].indexOf(p.role) >= 0 ? 5 : 0, lreq: (get_('leavereq') || []).filter(q => q.pid === p.id).slice(0, 20), photo: p.ph ? get_('photo:' + p.id) : '', month: month, open: get_('prefsopen:' + month), mine: get_('pref:' + month + ':' + p.id), fixed: get_('fixed:' + p.id) };
}
/** notifications: published plans and boards, and messages from the managers. Shown in the dashboard bell and in every doctor's app */
const NOTIFY_ROLES_ = ['owner', 'director', 'chief', 'deputy', 'secretary'];
function notifFor_(role, pid) { return (get_('notif') || []).filter(x => (x.pids && pid && x.pids.indexOf(pid) >= 0) || x.aud === 'all' || (x.aud === 'residents' && ['resident', 'house', 'extern'].indexOf(role) >= 0) || (x.aud === 'seniors' && role === 'senior')); }
function ops_notify(code, n) {
  const u = me_(code); if (NOTIFY_ROLES_.indexOf(u.role) < 0) throw new Error('אין הרשאה לשלוח הודעות');
  n = n || {}; const title = String(n.title || '').trim().slice(0, 120); if (!title) throw new Error('חסרה כותרת');
  const L = get_('notif') || [];
  L.unshift({ id: 'n' + Date.now(), at: new Date().toISOString(), kind: String(n.kind || 'msg').slice(0, 10), title: title, body: String(n.body || '').slice(0, 600), aud: ['all', 'residents', 'seniors'].indexOf(n.aud) >= 0 ? n.aud : 'all', by: u.name });
  set_('notif', L.slice(0, 60), u.name);
  try { pushSend_(L[0], u.id); } catch (e) { console.log('push: ' + e.message); }
  return L.slice(0, 40);
}
function ops_notifDel(code, id) { const u = me_(code); if (NOTIFY_ROLES_.indexOf(u.role) < 0) throw new Error('אין הרשאה'); const L = (get_('notif') || []).filter(x => x.id !== id); set_('notif', L, u.name); return L.slice(0, 40); }
/** interns: a read-only snapshot that Surgery X writes every 30 minutes to a hidden tab in its own sheet */
const HUB_SHEET = 'DEMO_ID_3', HUB_SNAP = 'Surgery X · סיכום';
function hubRows_() { const sh = SpreadsheetApp.openById(HUB_SHEET).getSheetByName(HUB_SNAP); if (!sh || sh.getLastRow() < 1) return []; return sh.getRange(1, 1, sh.getLastRow(), 2).getValues(); }
function ops_internsRaw_() { const c = CacheService.getScriptCache(), hit = c.get('hubsnap'); if (hit) return JSON.parse(hit);
  const rows = hubRows_(), json = rows.filter(r => /^snap\|/.test(r[0])).sort((a, b) => +String(a[0]).split('|')[1] - +String(b[0]).split('|')[1]).map(r => r[1]).join('');
  if (!json) return { none: true };
  const snap = JSON.parse(json); snap.photos = rows.filter(r => /^photo\|/.test(r[0])).map(r => String(r[0]).slice(6));
  try { c.put('hubsnap', JSON.stringify(snap), 180); } catch (e) {}
  return snap; }
// the WhatsApp package carries the interns' personal links: only the owner gets it
function ops_interns(code) {
  const u = me_(code), S = ops_interns0_(); if (S && S.wa && u.role !== 'owner') { const o = Object.assign({}, S); delete o.wa; return o; }
  if (S && S.wa) S.wa.prepared = (get_('preWa') || {})[S.wa.month] || ''; return S;
}
function ops_preWaNow(code) { const u = me_(code); if (u.role !== 'owner') throw new Error('אין הרשאה'); return internsPreWa_(tz_(new Date()), 12, true); }
function ops_interns0_() {
  const c = CacheService.getScriptCache(), hit = c.get('hubsnap'); if (hit) return JSON.parse(hit);
  const rows = hubRows_(), json = rows.filter(r => /^snap\|/.test(r[0])).sort((a, b) => +String(a[0]).split('|')[1] - +String(b[0]).split('|')[1]).map(r => r[1]).join('');
  if (!json) return { none: true };
  const snap = JSON.parse(json); snap.photos = rows.filter(r => /^photo\|/.test(r[0])).map(r => String(r[0]).slice(6));
  try { c.put('hubsnap', JSON.stringify(snap), 180); } catch (e) {}
  return snap;
}
/** the same snapshot for a doctor's personal app: names, pictures, tracks, stations, nights and seminars. No phones, no reports, no reasons for absence */
function ops_meInterns(token) {
  personByToken_(token); const c = CacheService.getScriptCache(), hit = c.get('hubsnapD'); if (hit) return JSON.parse(hit);
  let S; try { S = ops_internsRaw_(); } catch (e) { return { none: true }; } if (!S || S.none) return { none: true };
  const out = { at: S.at, month: S.month, next: S.next, today: S.today, days: S.days, stations: S.stations, photos: S.photos || [],
    interns: (S.interns || []).map(i => ({ key: i.key, month: i.month, name: i.name, track: i.track, imonth: i.imonth, wing: i.wing, inst: i.inst })),
    assigns: S.assigns || [], absences: (S.absences || []).map(a => ({ d: a.d, k: a.k })), duties: S.duties || [], fmorn: S.fmorn || [], seminars: S.seminars || [], sessions: S.sessions || [] };
  try { c.put('hubsnapD', JSON.stringify(out), 600); } catch (e) {}
  return out;
}
function ops_meInternPhotos(token, keys) { personByToken_(token); const out = {}; keys = (keys || []).slice(0, 30); hubRows_().forEach(r => { const k = String(r[0]); if (k.indexOf('photo|') === 0 && keys.indexOf(k.slice(6)) >= 0) out[k.slice(6)] = r[1]; }); return out; }
function ops_internPhotos(code, keys) { me_(code); const out = {}; keys = keys || []; hubRows_().forEach(r => { const k = String(r[0]); if (k.indexOf('photo|') === 0 && keys.indexOf(k.slice(6)) >= 0) out[k.slice(6)] = r[1]; }); return out; }
/** remembered devices: the server keeps only a hash of each device key, pointing at the user. A changed code keeps working */
function devHash_(t) { return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 'ops|' + t)); }
function devList_() { try { return JSON.parse(props_().getProperty('DEV_TOKENS') || '[]'); } catch (e) { return []; } }
function ops_devToken(code, label) {
  const u = me_(code), t = (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '');
  const L = devList_().filter(x => x.uid); L.unshift({ h: devHash_(t), uid: u.id, label: String(label || '').slice(0, 60), at: new Date().toISOString() });
  props_().setProperty('DEV_TOKENS', JSON.stringify(L.slice(0, 60)));
  if (u.role !== 'owner') { try { log_(u.name, 'login', 'כניסה לפורטל ממכשיר ' + String(label || 'חדש').slice(0, 40)); } catch (e) {} ownerPing_(u.name, '🔐 ' + u.name + ' נכנס/ה לפורטל', 'כניסה ממכשיר ' + String(label || 'חדש').slice(0, 40)); }
  return t;
}
function ops_devLogin(t) {
  t = String(t || ''); if (t.length < 20) throw new Error('המכשיר לא מזוהה');
  const h = devHash_(t), L = devList_(), d = L.find(x => x.h === h); if (!d) throw new Error('המכשיר לא מזוהה. נכנסים עם הקוד');
  const u = users_().find(x => x.id === d.uid); if (!u) throw new Error('המשתמש הוסר');
  d.last = new Date().toISOString(); props_().setProperty('DEV_TOKENS', JSON.stringify(L));
  return { code: u.code, boot: ops_boot(u.code) };
}
function ops_devForget(t) { const h = devHash_(String(t || '')); props_().setProperty('DEV_TOKENS', JSON.stringify(devList_().filter(x => x.h !== h))); return true; }
function ops_devClear(code) { const u = me_(code); if (u.role !== 'owner') throw new Error('רק לבעלים'); const n = devList_().length; props_().setProperty('DEV_TOKENS', '[]'); return n; }
/** push notifications through Firebase Cloud Messaging (project surgery-x, owned by the system account).
 * The home-screen wrapper (surgeryx.example/ops) gets a device token and the app registers it here,
 * tied to a manager (dashboard) or to a doctor (personal link). Every new notification goes out as a push to its audience */
const FCM_PROJECT = 'surgery-x';
function pushList_() { return get_('push') || []; }
function ops_pushReg(code, ptoken, fcm, label) {
  fcm = String(fcm || ''); if (fcm.length < 40 || fcm.length > 500) throw new Error('המכשיר לא נרשם');
  let who;
  if (ptoken) { const p = personByToken_(ptoken); who = { k: 'me', pid: p.id, role: p.role }; }
  else { const u = me_(code); who = { k: 'mgr', uid: u.id, role: u.role }; }
  const L = pushList_(), old = L.find(x => x.t === fcm);
  if (old && old.k === who.k && (old.pid || '') === (who.pid || '') && (old.uid || '') === (who.uid || '') && String(old.at).slice(0, 10) === new Date().toISOString().slice(0, 10)) return true;
  const out = L.filter(x => x.t !== fcm); out.unshift(Object.assign({ t: fcm, label: String(label || '').slice(0, 60), at: new Date().toISOString() }, who));
  set_('push', out.slice(0, 250), 'push');
  return true;
}
function ops_pushOff(code, ptoken, fcm) {
  if (ptoken) personByToken_(ptoken); else me_(code);
  set_('push', pushList_().filter(x => x.t !== String(fcm || '')), 'push'); return true;
}
function ops_pushCount(code) { const u = me_(code); if (u.role !== 'owner') return 0; return pushList_().length; }
function pushFor_(n, exceptUid) {
  if (n.uids) return pushList_().filter(x => x.k === 'mgr' && n.uids.indexOf(x.uid) >= 0);
  if (n.pids) return pushList_().filter(x => x.k === 'me' && n.pids.indexOf(x.pid) >= 0);
  const docs = ['resident', 'house', 'extern'];
  return pushList_().filter(x => x.k === 'mgr' ? x.uid !== exceptUid
    : (n.aud === 'all' || (n.aud === 'residents' && docs.indexOf(x.role) >= 0) || (n.aud === 'seniors' && x.role === 'senior')));
}
// for now the owner hears about everything: every change by someone else and every first sign-in, in the log and as a push to his phone.
// At most one push per person and kind of change every 10 minutes. Off from the change log in the settings (settings.ownerPing = false)
const PING_KEYS_ = { week: '📅 התוכנית השבועית', duty: '🌙 לוח התורנויות', oncall: '📞 לוח הכוננויות', pref: '📝 בקשות לחודש', fixed: '📝 ימים קבועים', people: '👤 פרופיל וצוות', leavereq: '🏖 בקשת חופשה', photo: '📷 תמונה', notif: '🔔 הודעה', settings: '⚙️ הגדרות', curr: '🎓 תוכנית לימודים', stud: '🎓 סטודנטים', prefsopen: '🔓 פתיחת הבקשות', dlists: '📋 רשימות שליחה', meet: '🗓 ישיבות' };
function ownerPing_(by, title, body) {
  try {
    if ((get_('settings') || {}).ownerPing === false) return;
    const owners = users_().filter(u => u.role === 'owner'); if (!owners.length) return;
    const L = get_('people') || [], mine = owners.map(u => u.name).concat(owners.map(u => (L.find(p => p.id === u.pid) || {}).name)).filter(Boolean);
    if (by && mine.indexOf(String(by)) >= 0) return;
    const c = CacheService.getScriptCache(), k = 'ping:' + Utilities.base64EncodeWebSafe(String(by || '') + '|' + title).slice(0, 220); if (c.get(k)) return; c.put(k, '1', 600);
    pushSend_({ title: title, body: String(body || '').slice(0, 170), uids: owners.map(u => u.id), id: 'ping' });
  } catch (e) { console.log('ping: ' + e.message); }
}
function pushSend_(n, exceptUid) {
  const T = pushFor_(n, exceptUid); if (!T.length) return 0;
  const url = 'https://fcm.googleapis.com/v1/projects/' + FCM_PROJECT + '/messages:send', tok = ScriptApp.getOAuthToken();
  const body = String(n.body || '').replace(/\s+/g, ' ').slice(0, 180);
  const reqs = T.map(x => ({ url: url, method: 'post', contentType: 'application/json', muteHttpExceptions: true,
    headers: { Authorization: 'Bearer ' + tok, 'x-goog-user-project': FCM_PROJECT },
    payload: JSON.stringify({ message: { token: x.t, data: { title: String(n.title || 'Surgery X'), body: body, tag: String(n.id || '') }, webpush: { headers: { Urgency: 'high', TTL: '86400' } } } }) }));
  const res = UrlFetchApp.fetchAll(reqs), dead = {};
  let ok = 0;
  res.forEach((r, i) => { const c = r.getResponseCode(); if (c === 200) ok++; else { const t = r.getContentText(); if (c === 404 || /UNREGISTERED|registration-token-not-registered|INVALID_ARGUMENT/.test(t)) dead[T[i].t] = 1; else console.log('push ' + c + ': ' + t.slice(0, 300)); } });
  if (Object.keys(dead).length) set_('push', pushList_().filter(x => !dead[x.t]), 'push');
  return ok;
}
/** run once in the editor as the system account: approves the new permissions, then sends a test push to the owner's devices only */
function pushTest() {
  const owners = users_().filter(u => u.role === 'owner').map(u => u.id), all = pushList_(), mine = all.filter(x => x.k === 'mgr' && owners.indexOf(x.uid) >= 0);
  if (!mine.length) { Logger.log('ההרשאות אושרו. עדיין אין מכשיר רשום של הבעלים (' + all.length + ' מכשירים בסך הכול)'); return; }
  const keep = get_('push'); set_('push', mine, 'push');
  try { Logger.log(pushSend_({ aud: 'all', title: 'Surgery X', body: 'התראת בדיקה ✓', id: 'test' }, '-') + ' / ' + mine.length + ' devices'); }
  finally { const now = pushList_(), gone = mine.filter(x => !now.some(y => y.t === x.t)).map(x => x.t); set_('push', (keep || []).filter(x => gone.indexOf(x.t) < 0), 'push'); }
}
/** the owner's activity view: the latest changes in the store (who, what, when), signed-in devices and push devices. Reads only the key, time and author columns */
function ops_activity(code) {
  const u = me_(code); if (u.role !== 'owner') throw new Error('רק לבעלים');
  const sh = sheet_(), n = sh.getLastRow(), feed = [];
  if (n > 1) { const keys = sh.getRange(2, 1, n - 1, 1).getValues(), meta = sh.getRange(2, 3, n - 1, 2).getValues();
    keys.forEach((r, i) => { const k = String(r[0]); if (!k || k === 'push' || !meta[i][0]) return; feed.push({ k: k, at: new Date(meta[i][0]).toISOString(), by: String(meta[i][1] || '') }); }); }
  feed.sort((a, b) => b.at.localeCompare(a.at));
  const U = users_(), dev = devList_().map(d => { const x = U.find(y => y.id === d.uid) || {}; return { name: x.name || '?', role: x.role || '', label: d.label || '', last: d.last || d.at || '' }; }).sort((a, b) => String(b.last).localeCompare(String(a.last)));
  const P = pushList_();
  return { feed: feed.slice(0, 40), devices: dev.slice(0, 40), users: U.length, push: { all: P.length, mgr: P.filter(x => x.k === 'mgr').length, me: P.filter(x => x.k === 'me').length } };
}
function ops_devCount(code) { const u = me_(code); if (u.role !== 'owner') return 0; return devList_().length; }
/** test data: sample requests written as each doctor, and their removal. Owner only */
function ops_testPrefs(code, list) {
  const u = me_(code); if (u.role !== 'owner') throw new Error('רק לבעלים');
  const L = get_('people') || []; let n = 0;
  (list || []).slice(0, 40).forEach(x => { const p = L.find(y => y.id === x.id); if (!p) return;
    if (x.month) { set_('pref:' + x.month + ':' + p.id, { block: x.block || [], want: x.want || [], note: String(x.note || '').slice(0, 600), at: new Date().toISOString(), test: 1 }, p.name); n++; }
    if (x.fixed) { set_('fixed:' + p.id, { days: x.fixed.days || [], want: x.fixed.want || [], note: String(x.fixed.note || '').slice(0, 400), at: new Date().toISOString(), test: 1 }, p.name); n++; } });
  return n;
}
function ops_clearTestPrefs(code) {
  const u = me_(code); if (u.role !== 'owner') throw new Error('רק לבעלים');
  let n = 0; keysWith_('pref:').concat(keysWith_('fixed:')).forEach(r => { if (r.val && r.val.test) { set_(r.key, null, u.name); n++; } });
  return n;
}
/** personal app: everything one doctor sees, read-only. Same data the managers edit, so it is always in sync */
function ops_meApp(token, ws, via) {
  // a manager's preview of someone's app (👁) does not count as that doctor opening it
  const me = personByToken_(token); if (via !== 'pv') { try { seenMark_(me.id, via); } catch (e) { console.log('seen: ' + e.message); } }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(ws || ''))) throw new Error('תאריך לא תקין');
  const d0 = new Date(ws + 'T12:00:00'), iso = d => Utilities.formatDate(d, 'Asia/Jerusalem', 'yyyy-MM-dd');
  const at = n => { const d = new Date(d0); d.setDate(d.getDate() + n); return iso(d); };
  const months = {}; [-1, 0, 7, 13].forEach(n => { months[at(n).slice(0, 7)] = 1; });
  const pub = p => ({ id: p.id, name: p.name, full: p.full || '', role: p.role, title: p.title || '', spec: p.spec || '', sub: p.sub || '', year: p.year || '', phone: p.phone || '', email: p.email || '', emails: p.emails || [], interests: p.interests || '', langs: p.langs || '', bio: p.bio || '', bday: p.bday || '', edu: p.edu || '', units: p.units || [], rot: (p.rot || {}).on ? { on: 1, base: p.rot.base || '', from: p.rot.from || '', to: p.rot.to || '' } : null, ph: p.ph || 0, active: p.active !== false, pos: p.pos || [] });
  const st = get_('settings') || {}, out = { me: Object.assign(pub(me), { first: me.first || '', last: me.last || '', profAt: me.profAt || '', fixed: get_('fixed:' + me.id) || {} }), people: (get_('people') || []).filter(p => p.active !== false).map(pub), settings: { wings: st.wings, wingStart: st.wingStart }, weeks: {}, duty: {}, oncall: {} };
  [ws, at(7), at(-7)].forEach(w => { out.weeks[w] = get_('week:' + w); });
  out.notif = notifFor_(me.role, me.id).slice(0, 20);
  out.stud = {}; [ws, at(7)].forEach(w => { out.stud[w] = get_('stud:' + w); });
  Object.keys(months).forEach(m => { out.duty[m] = get_('duty:' + m); out.oncall[m] = get_('oncall:' + m); });
  const today = iso(new Date()), mo = today.slice(0, 7);
  try { out.stats = meStats_(me.id, mo, today); } catch (e) { console.log('stats: ' + e.message); out.stats = null; }
  out.curr = {}; [mo, addD_(mo + '-28', 7).slice(0, 7)].forEach(m => { const C = get_('curr:' + m); if (C && C.apDep && C.apChief) out.curr[m] = (C.items || []).map(x => ({ d: x.d, title: x.title || '', time: x.time || '', type: x.type || '', sen: x.sen || '', res: x.res || '' })); });
  out.me.leaves = (me.leaves || []).filter(x => x.t >= today).slice(0, 10);
  out.news = newsGet_(); out.nj = (get_('njsel') || {})['p:' + me.id] || null;
  const ci = get_('chatidx:' + me.id) || {}; out.chatU = Object.keys(ci).reduce((a, k) => a + (ci[k].u || 0), 0);
  return out;
}
// one doctor's month in numbers: nights, on-call, operating days and cases, clinics, rounds, the ER, teaching
function meStats_(id, mo, today) {
  const du = (get_('duty:' + mo) || {}).days || {}, ca = (get_('oncall:' + mo) || {}).days || {}, o = { m: mo, duty: { n: 0, done: 0, we: 0, k: {} }, call: { n: 0, done: 0, we: 0, k: {} }, or: 0, proc: 0, clinic: 0, rounds: 0, consult: 0, er: 0, day: 0, preop: 0, abs: 0, teach: 0, work: 0, plan: 0 };
  const we = d => { const g = new Date(d + 'T12:00:00').getDay(); return g === 5 || g === 6; };
  Object.keys(du).forEach(d => { if (d.slice(0, 7) !== mo) return; ['er1', 'er2', 'dept', 'minor', 'fm'].forEach(k => { if (du[d][k] === id) { o.duty.n++; o.duty.k[k] = (o.duty.k[k] || 0) + 1; if (d <= today) o.duty.done++; if (we(d) && k !== 'fm') o.duty.we++; } }); });
  Object.keys(ca).forEach(d => { if (d.slice(0, 7) !== mo) return; ['active', 'passive', 'half'].forEach(k => { if (ca[d][k] === id) { o.call.n++; o.call.k[k] = (o.call.k[k] || 0) + 1; if (d <= today) o.call.done++; if (we(d)) o.call.we++; } }); });
  const first = mo + '-01', last = addD_(addD_(mo + '-28', 7).slice(0, 7) + '-01', -1); let ws = addD_(first, -new Date(first + 'T12:00:00').getDay());
  const has = (a) => (a || []).some(x => x && x.id === id);
  for (; ws <= last; ws = addD_(ws, 7)) { const W = get_('week:' + ws); if (!W || !W.days) continue;
    Object.keys(W.days).forEach(d => { if (d.slice(0, 7) !== mo) return; const D = W.days[d] || {}; let any = false;
      (D.or || []).forEach(r => { if (has(r.ids)) { o.or++; o.proc += (r.proc || []).length; any = true; } });
      if (has(D.clinic)) { o.clinic++; any = true; } if (has(D.rn) || has(D.rs)) { o.rounds++; any = true; } if (has(D.consult)) { o.consult++; any = true; }
      if (has(D.er) || has(D.erlead)) { o.er++; any = true; } if (has(D.day)) { o.day++; any = true; } if (has(D.preop)) { o.preop++; any = true; } if (has(D.abs)) o.abs++;
      if (any) { o.plan++; if (d <= today) o.work++; } }); }
  const C = get_('curr:' + mo); if (C && C.apDep && C.apChief) o.teach = (C.items || []).filter(x => x.sen === id || x.res === id).length;
  return o;
}
/* ---------- messages between doctors, inside the app (and by mail when asked) ---------- */
const chatKey_ = (a, b) => 'chat:' + [a, b].sort().join('|');
function chatOut_(me, idx) { const P = get_('people') || []; return Object.keys(idx).map(k => Object.assign({ id: k }, idx[k])).filter(x => P.some(p => p.id === x.id && p.active !== false)).sort((a, b) => b.at.localeCompare(a.at)); }
function ops_chatThreads(token) { const me = personByToken_(token); return chatOut_(me, get_('chatidx:' + me.id) || {}); }
function ops_chatGet(token, other) {
  const me = personByToken_(token); other = String(other || ''); const idx = get_('chatidx:' + me.id) || {};
  if (idx[other] && idx[other].u) { idx[other].u = 0; set_('chatidx:' + me.id, idx, 'chat'); }
  return { msgs: get_(chatKey_(me.id, other)) || [], threads: chatOut_(me, idx) };
}
function ops_chatSend(token, other, text, byMail) {
  const me = personByToken_(token), P = get_('people') || [], o = P.find(p => p.id === String(other) && p.active !== false);
  if (!o || o.id === me.id) throw new Error('הנמען לא נמצא'); text = String(text || '').trim().slice(0, 1000); if (!text) throw new Error('הודעה ריקה');
  const k = chatKey_(me.id, o.id), at = new Date().toISOString(); let L = (get_(k) || []).concat({ f: me.id, t: text, at: at, m: byMail && o.email ? 1 : 0 }).slice(-200);
  while (L.length > 10 && JSON.stringify(L).length > 45000) L = L.slice(10);
  set_(k, L, 'chat');
  const short = text.replace(/\s+/g, ' ').slice(0, 90), mi = get_('chatidx:' + me.id) || {}, oi = get_('chatidx:' + o.id) || {};
  mi[o.id] = { at: at, last: short, f: me.id, u: 0 }; oi[me.id] = { at: at, last: short, f: me.id, u: ((oi[me.id] || {}).u || 0) + 1 };
  set_('chatidx:' + me.id, mi, 'chat'); set_('chatidx:' + o.id, oi, 'chat');
  try { pushSend_({ title: '💬 ' + (me.full || me.name), body: short, pids: [o.id], id: 'chat' }); } catch (e) { console.log('chat push: ' + e.message); }
  if (byMail && o.email) { try { const link = OPS_WRAP_URL + '?p=' + o.token + '&tab=team&chat=' + me.id, subj = 'הודעה מ' + (me.full || me.name) + ' · Surgery X', body = text + '\n\nלתשובה באפליקציה:\n' + link;
    const opt = { to: o.email, subject: subj, body: body, name: 'Surgery X', htmlBody: autoHtml_(subj, body) }; if (me.email) opt.replyTo = me.email; MailApp.sendEmail(opt); } catch (e) { console.log('chat mail: ' + e.message); } }
  return { msgs: L, threads: chatOut_(me, mi) };
}
function ops_mePhotos(token, ids) {
  personByToken_(token); const out = {};
  (ids || []).slice(0, 40).forEach(id => { if (/^p[0-9a-z]+$/.test(String(id))) out[id] = get_('photo:' + id); });
  return out;
}
/** standing preferences: weekdays that are never possible (a clinic outside, teaching), kept until changed */
function ops_fixedSave(token, data) {
  const p = personByToken_(token);
  const wd = a => (a || []).map(Number).filter(n => n >= 0 && n <= 6).slice(0, 7);
  const clean = { days: wd(data.days), want: wd(data.want).filter(n => wd(data.days).indexOf(n) < 0), note: String(data.note || '').slice(0, 400), at: new Date().toISOString() };
  set_('fixed:' + p.id, clean, p.name);
  return clean;
}
function ops_prefsSave(token, month, data) {
  const p = personByToken_(token);
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw new Error('חודש לא תקין');
  const open = get_('prefsopen:' + month);
  if (open && open.closed) throw new Error('ההגשה לחודש הזה נסגרה. פנו ישירות');
  if (['resident', 'house'].indexOf(p.role) >= 0 && (data.block || []).length > 5) throw new Error('עד 5 ימים חסומים בחודש. לחופשה מסמנים "בקשת חופשה"');
  const clean = { block: (data.block || []).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d)).slice(0, 31), want: (data.want || []).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d)).slice(0, 31), note: String(data.note || '').slice(0, 600), at: new Date().toISOString() };
  set_('pref:' + month + ':' + p.id, clean, p.name);
  return clean;
}

/* ---------------- seeds (editable in the app) ---------------- */
function tok_() { return Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '').slice(0, 8); }
/** students: the chief may only name residents in the slots that need one; everything else is the students coordinator's */
function studGuard_(key, oldV, newV) {
  if (key === 'stud:roster') throw new Error('את רשימת הסטודנטים מנהל אחראי הסטודנטים');
  const strip = v => JSON.stringify(((v && v.items) || []).map(x => Object.assign({}, x, x.need === 'resident' ? { who: '' } : {})));
  if (strip(oldV) !== strip(newV)) throw new Error('הצ׳יף משבץ מתמחים בלבד בתוכנית הסטודנטים');
}
/** one time: leadership titles and "ד״ר" before every full name (kept for data created before the seed had them) */
function migrate7_(people, settings) {
  if (settings.mig7) return false;
  people.forEach(p => { const f = String(p.full || '').trim(); p.full = !f ? 'ד״ר ' + p.name : /^(ד["״']?ר|פרופ)/.test(f) ? f : 'ד״ר ' + f; });
  settings.mig7 = true;
  return true;
}
function migrate8_(people, settings) { return false; }
/** the fictional department of Surgery X: המרכז הרפואי אופק. Every name here is invented */
const SEED_ = {
  senior: [['אלמוג', 'דניאל', 'מנהל המערך', 'פרופ׳'], ['שחר', 'מיכל', 'סגנית מנהל המערך'], ['גרינברג', 'עמרי', 'אחראי המתמחים'], ['רז', 'איתן', 'אחראי הסטאז׳רים · מנהל הפרויקט'], ['קדוש', 'אורי', 'אחראי הסטודנטים וההוראה'],
    ['וייס', 'תמר', 'ראש אגף צפון'], ['דיין', 'אסף', 'ראש אגף דרום'], ['לנדאו', 'רונית', 'ראש צוות HPB'], ['כספי', 'אבנר', 'ראש צוות קולורקטלי'], ['אשכנזי', 'יאיר', 'ראש צוות טראומה'], ['ברודסקי', 'אלכסנדר', 'ראש צוות בריאטרי'], ['פרידמן', 'שלומית', 'ראש צוות שד'],
    ['פרלמן', 'שירן', 'ראש צוות אנדוקריני'], ['אבוטבול', 'משה', ''], ['לביא', 'נעמה', ''], ['מזרחי', 'עמיר', ''], ['אלקיים', 'ליאת', ''], ['רוטמן', 'אלון', ''], ['גולן', 'ערן', ''], ['רבינוביץ', 'דפנה', ''], ['מלמד', 'אריאל', ''], ['שטרן', 'יואב', '']],
  resident: [['ברנע', 'עמית', 'צ׳יף המתמחים', '', 0, 'צפון'], ['נבון', 'רועי', '', '', 0, 'דרום'], ['סגל', 'עידן', '', '', 0, 'צפון'], ['ביטון', 'הילה', '', '', 0, 'דרום'], ['ספיר', 'עידו', '', '', 0, 'צפון'], ['קרסנוב', 'דנה', '', '', 0, 'דרום'], ['אדלר', 'מאיה', '', '', 0, 'צפון'], ['אברמוב', 'גלעד', '', '', 0, 'דרום'], ['שמש', 'גיל', '', '', 0, 'צפון'], ['בן דוד', 'נטע', '', '', 0, 'דרום'],
    ['פרץ', 'סתיו', '', '', 0, 'צפון'], ['הלפרין', 'תומר', '', '', 0, 'דרום'], ['גבאי', 'שני', '', '', 0, 'צפון'], ['וולך', 'רוני', '', '', 0, 'דרום'], ['אורבך', 'אלה', '', '', 0, 'צפון'], ['דהן', 'אלעד', '', '', 0, 'דרום'], ['רגב', 'נוגה', '', '', 0, 'צפון'], ['דביר', 'נדב', '', '', 0, 'דרום'], ['טל', 'יעל', '', '', 0, 'צפון'], ['שפירא', 'עמית', '', '', 0, 'דרום']],
  house: [['רוזנטל', 'מרינה'], ['אוחיון', 'רותם'], ['מור', 'יערה']],
  extern: [['ויצמן', 'איתי'], ['לוין', 'אביגיל'], ['גפן', 'מורן'], ['פולק', 'נועם', '', '', 1], ['יפה', 'אדם', '', '', 1], ['נחום', 'ליאור', '', '', 1], ['קורן', 'שגיא'], ['עמר', 'יובל', '', '', 1], ['בוזגלו', 'ליאן'], ['גרוס', 'מיכה'], ['אסולין', 'עדי', '', '', 1], ['זהבי', 'עוז'], ['ברגר', 'שירה'], ['כהן־צדק', 'אביב']],
  pa: [['אהרוני', 'אורית', 'עוזרת רופא · מיון כירורגי'], ['חסון', 'מוריה', 'עוזרת רופא · חדר ניתוח'], ['קליין', 'רננה', 'עוזרת רופא · אגף צפון'], ['פישר', 'דן', 'עוזר רופא · אגף דרום'], ['שלום', 'ליה', 'עוזרת רופא · מרפאות'], ['סויסה', 'ענבל', 'עוזרת רופא · טרום ניתוח']],
  staff: [['אזולאי', 'סיגל', 'מזכירת המערך'], ['חדד', 'מירב', 'מזכירת המתמחים']]
};
function seedPeople_() {
  const SR = SEED_.resident.map(r => r[0]), ER1 = ['לנדאו', 'אשכנזי', 'כספי', 'רז', 'מזרחי', 'גולן', 'מלמד'].concat(SR.slice(0, 9)), ER2 = SR.slice(4);
  const mk = (r, role) => {
    const name = r[0], pos = [];
    if (ER1.indexOf(name) >= 0) pos.push('er1');
    if (ER2.indexOf(name) >= 0) pos.push('er2');
    if (role === 'extern' || role === 'house') pos.push('dept', 'minor');
    if (role === 'resident') pos.push('fm');
    if (role === 'senior') pos.push('active', 'passive', 'half');
    const pre = role === 'pa' || role === 'staff' ? '' : (r[3] || 'ד״ר') + ' ';
    const p = { id: 'p' + Utilities.getUuid().slice(0, 8), name: name, first: r[1], last: name, full: pre + r[1] + ' ' + name, role: role, pos: pos, active: true, token: tok_() };
    if (r[2]) p.title = r[2];
    if (r[4]) p.cand = true; // an extern waiting for the admissions committee
    if (r[5]) p.wing = r[5];
    return p;
  };
  return [].concat(...Object.keys(SEED_).map(role => SEED_[role].map(r => mk(r, role))));
}
function seedSettings_() {
  return {
    wingStart: { date: '2026-10-01', wing: 'א' }, // א = דרום, ב = צפון. alternates daily from this date
    wings: { 'א': 'דרום', 'ב': 'צפון' },
    morning: { 0: '07:15 ישיבת בוקר', 1: '07:00 לימודים\n07:30 ישיבת בוקר', 2: '07:00 ישיבת צוות', 3: '07:00 לימודים\n07:30 ישיבת צוות', 4: '07:00 ישיבת צוות' },
    meetings: { 0: '09:00 ישיבת רנטגן\nHPB חד פעמי', 1: '09:45 ישיבת HPB\n13:45 Tumor Board', 3: '10:45 ישיבת רנטגן' },
    rooms: { 0: ['חדר 1', 'חדר 2'], 1: ['חדר 1', 'חדר ט.'], 2: ['חדר 1', 'חדר 2', 'חדר 3', 'א. יום'], 3: ['חדר 1', 'חדר ט.'], 4: ['חדר 1', 'חדר 2', 'חדר 3'] },
    clinics: { 1: '08:00 מרפאה\n11:30 מרפאה', 3: '08:00 מרפאה\n12:30 טרום', 2: '12:30 טרום' }
  };
}

/* editor only: show the sheet's link (no secrets) */
function opsInfo() { Logger.log('Data sheet: ' + SpreadsheetApp.openById(props_().getProperty('SHEET_ID') || sheet_().getParent().getId()).getUrl() + ' · users: ' + users_().length); }

/* ---------------- demo data: an invented October 2026 duty roster and the week of 18/10 ---------------- */
const DEMO_DUTY_ = 'א|לנדאו|ביטון|ויצמן;ב|אשכנזי|קרסנוב|לוין;א|כספי|ספיר|גפן;ב|טל|נבון|בוזגלו;א|ברנע|קרסנוב|ויצמן;ב|אשכנזי|סגל|ספיר;א|טל|נבון|גרוס;ב|אשכנזי|סגל|נחום;א|ברנע|ספיר|ברגר;ב|כספי|ביטון|בוזגלו;א|רז|ספיר|ויצמן;ב|קרסנוב|סגל|נחום;א|ברנע|נבון|בוזגלו;ב|אשכנזי|טל|ויצמן;א|רז|ביטון|ברגר;ב|לנדאו|סגל|נחום;א|כספי|קורן|לוין;ב|קרסנוב|נבון|בוזגלו;א|ברנע|טל|גרוס;ב|לנדאו|ביטון|ברגר;א|ברנע|סגל|נחום;ב|קרסנוב|ביטון|לוין;א|טל|נבון|גרוס;ב|כספי|סגל|ברגר;א|רז|ביטון|גפן;ב|לנדאו|קרסנוב|גרוס;א|ברנע|טל|ויצמן;ב|רז|נבון|נחום;א|קרסנוב|ביטון|לוין;ב|טל|סגל|גפן;א|ברנע|נבון|רוזנטל';
const DEMO_FM_ = { '2026-10-02': 'ספיר', '2026-10-09': 'ביטון', '2026-10-16': 'נבון', '2026-10-23': 'סגל', '2026-10-30': 'ברנע' };
const DEMO_CALL_ = { '2026-10-18': 'שחר|אשכנזי|גרינברג', '2026-10-19': 'אבוטבול|אלמוג|ברודסקי', '2026-10-20': 'פרידמן|אשכנזי|כספי', '2026-10-21': 'ברודסקי|גרינברג|אשכנזי', '2026-10-22': 'דיין|כספי|אבוטבול', '2026-10-23': 'קדוש|אשכנזי|', '2026-10-24': 'אשכנזי|קדוש|' };
function ops_importDemo(code) {
  const u = me_(code); if (u.role !== 'owner') throw new Error('רק לבעלים');
  let people = get_('people') || seedPeople_();
  const id = n => { const p = people.find(x => x.name === n); return p ? p.id : ''; };
  const L = (arr, c) => arr.filter(Boolean).map(n => ({ id: id(n), c: c ? c(n) : '' })).filter(x => x.id);
  const sen = n => { const p = people.find(x => x.name === n); return p && p.role === 'senior' ? '' : 'b'; };
  if (!get_('duty:2026-10')) {
    const days = {}; DEMO_DUTY_.split(';').forEach((r, i) => { const [w, a, b, c] = r.split('|'), d = '2026-10-' + String(i + 1).padStart(2, '0'); days[d] = { wing: w, er1: id(a), er2: id(b), dept: id(c) }; if (DEMO_FM_[d]) days[d].fm = id(DEMO_FM_[d]); });
    set_('duty:2026-10', { days: days }, u.name);
  }
  if (!get_('oncall:2026-10')) {
    const days = {}; Object.keys(DEMO_CALL_).forEach(d => { const [a, p, h] = DEMO_CALL_[d].split('|'); days[d] = { active: id(a), passive: id(p) }; if (h) days[d].half = id(h); });
    set_('oncall:2026-10', { days: days }, u.name);
  }
  if (!get_('week:2026-10-18')) {
    const st = get_('settings') || seedSettings_(), D = {};
    const mk = (i, o) => Object.assign({ morning: (st.morning || {})[i] || '', meet: (st.meetings || {})[i] || '', clinicTx: '', clinic: [], rn: [], rs: [], consult: [], erlead: [], day: [], abs: [], absNote: '', or: [] }, o);
    D['2026-10-18'] = mk(0, { rn: L(['גרינברג'], () => 'y'), rs: L(['קדוש'], () => 'y'), consult: L(['גרינברג'], () => 'g'), erlead: L(['קרסנוב']), or: [{ n: 'חדר 1', ids: L(['אלמוג', 'אשכנזי', 'ברנע'], sen), note: 'יחד עם אורולוגיה' }, { n: 'חדר 2', ids: L(['וייס', 'קדוש', 'נבון'], sen), note: '' }], abs: L(['לנדאו', 'ביטון', 'טל', 'כספי']) });
    D['2026-10-19'] = mk(1, { rn: L(['שחר'], () => 'y'), rs: L(['וייס'], () => 'y'), consult: L(['ברודסקי'], () => 'g'), erlead: L(['טל']), clinicTx: '08:00 מרפאה · החולים מסיימים ב-09:30!\n11:30 מרפאה', clinic: L(['ברודסקי', 'רז', 'אשכנזי', 'פרידמן', 'גרינברג', 'לנדאו', 'קדוש', 'לביא', 'כספי', 'אלמוג', 'שחר'], n => ['ברודסקי', 'גרינברג', 'כספי'].indexOf(n) >= 0 ? 'b' : ''), or: [{ n: 'חדר 1', ids: L(['פרידמן', 'אשכנזי'], sen), note: '' }, { n: 'חדר ט.', ids: L(['ברנע'], sen), note: 'בקע מפשעתי, שני כיסים' }], abs: L(['רוזנטל', 'רז']), absNote: 'כספי יוצא מוקדם 12:00' });
    D['2026-10-20'] = mk(2, { rn: L(['פרלמן'], () => 'y'), rs: L(['פרידמן'], () => 'y'), consult: L(['כספי'], () => 'g'), erlead: L(['ברודסקי']), clinicTx: '12:30 טרום', clinic: L(['דיין', 'קדוש', 'לנדאו', 'לביא']), or: [{ n: 'חדר 1', ids: L(['שחר', 'רז'], sen), note: 'שתל עור עם פלסטיקה' }, { n: 'חדר 2', ids: L(['לנדאו', 'אשכנזי', 'כספי', 'קרסנוב'], sen), note: '' }, { n: 'חדר 3', ids: L(['שטרן', 'ביטון'], sen), note: '' }, { n: 'א. יום', ids: [], note: '' }] });
    D['2026-10-21'] = mk(3, { rn: L(['אשכנזי'], () => 'y'), rs: L(['כספי'], () => 'y'), consult: L(['אשכנזי'], () => 'g'), erlead: L(['ברנע']), day: L(['ברודסקי', 'שטרן'], () => 'g'), clinicTx: '08:00 מרפאה\n12:30 טרום · כספי', clinic: L(['שחר', 'פרידמן', 'דיין', 'ברודסקי', 'גרינברג', 'קדוש', 'כספי', 'אשכנזי', 'לנדאו', 'וייס', 'רז']), or: [{ n: 'חדר 1', ids: [], note: '' }, { n: 'חדר ט.', ids: L(['טל'], sen), note: '' }], abs: L(['רוזנטל', 'לנדאו', 'פרידמן']), absNote: 'פרידמן: שלב ב׳' });
    D['2026-10-22'] = mk(4, { rn: L(['רז'], () => 'y'), rs: L(['דיין'], () => 'y'), consult: L(['אבוטבול'], () => 'g'), erlead: L(['ברודסקי']), day: [], clinicTx: 'שד X 3 · סטאז׳ר (אשפוז יום)', clinic: L(['לביא', 'דיין', 'קדוש']), or: [{ n: 'חדר 1', ids: L(['שחר', 'רז', 'קרסנוב'], sen), note: '' }, { n: 'חדר 2', ids: L(['כספי', 'אשכנזי', 'טל'], sen), note: '' }, { n: 'חדר 3', ids: L(['שטרן', 'ביטון'], sen), note: '' }] });
    D['2026-10-23'] = mk(5, {}); D['2026-10-24'] = mk(6, {});
    set_('week:2026-10-18', { days: D }, u.name);
  }
  return true;
}

/* ---------------- resident portfolio and surgery log ----------------
 * port:<pid>         the portfolio: start month, mentor, rotations, exams, courses, research, goals, half-year reviews
 * log:<pid>:<yyyy>   the year's cases as compact rows [id, date, code, role, approach, urgency, supervisor, status, note]
 *   role S = surgeon, T = surgeon with a senior scrubbed, A = first assistant · status 0 waiting, 1 approved, 2 returned
 * A case is a procedure, a date and the people: no patient detail is ever stored. */
WRITE.port = ['owner', 'director', 'chief'];
WRITE.log = ['owner', 'director', 'chief'];
// the department's targets (as surgeon, S + T) by the end of residency; t = tier of difficulty 1..4
const LOG_CAT_ = [
  { g: 'מרה', n: 60, p: [['lchol', 'כריתת כיס מרה לפרוסקופית', 'L', 2], ['ochol', 'כריתת כיס מרה פתוחה', 'O', 2]] },
  { g: 'תוספתן', n: 50, p: [['lapp', 'כריתת תוספתן לפרוסקופית', 'L', 1], ['oapp', 'כריתת תוספתן פתוחה', 'O', 1]] },
  { g: 'בקעים', n: 60, p: [['ing', 'בקע מפשעתי פתוח', 'O', 1], ['tapp', 'בקע מפשעתי לפרוסקופי (TAPP/TEP)', 'L', 2], ['umb', 'בקע טבורי', 'O', 1], ['vent', 'בקע גחוני / בקע בחתך', 'O', 2]] },
  { g: 'מעי וקולון', n: 35, p: [['rhc', 'המיקולקטומיה ימנית', 'L', 3], ['lhc', 'המיקולקטומיה שמאלית / סיגמואיד', 'L', 3], ['lar', 'כריתה קדמית נמוכה', 'L', 4], ['sbr', 'כריתת מעי דק', 'O', 2], ['stoma', 'סטומה / סגירת סטומה', 'O', 2], ['adh', 'שחרור הידבקויות', 'O', 2]] },
  { g: 'בטן חריפה', n: 30, p: [['explap', 'לפרוטומיה / לפרוסקופיה אבחנתית', 'O', 2], ['perf', 'תפירת כיב מנוקב', 'O', 2]] },
  { g: 'קיבה ובריאטריה', n: 20, p: [['slv', 'שרוול קיבה', 'L', 3], ['byp', 'מעקף קיבה', 'L', 3], ['gast', 'כריתת קיבה', 'O', 4]] },
  { g: 'כבד, לבלב ודרכי מרה', n: 10, p: [['whip', 'ניתוח ויפל', 'O', 4], ['liv', 'כריתת כבד', 'O', 4], ['panc', 'כריתת לבלב דיסטלית', 'L', 4]] },
  { g: 'שד', n: 25, p: [['lump', 'כריתה חלקית של השד', 'O', 2], ['mast', 'כריתת שד', 'O', 3], ['slnb', 'בלוטת זקיף', 'O', 2]] },
  { g: 'אנדוקריני', n: 10, p: [['thy', 'כריתת בלוטת התריס', 'O', 3], ['para', 'כריתת בלוטת יותרת התריס', 'O', 3]] },
  { g: 'פרוקטולוגיה', n: 25, p: [['hem', 'טחורים', 'O', 1], ['fist', 'פיסטולה / אבצס פריאנלי', 'O', 2], ['pilo', 'סינוס פילונידלי', 'O', 1]] },
  { g: 'רקמות רכות', n: 40, p: [['abs', 'ניקוז אבצס', 'O', 1], ['les', 'כריתת נגע עור / תת־עורי', 'O', 1], ['debr', 'דברידמנט', 'O', 1]] },
  { g: 'גישה ונתיב אוויר', n: 15, p: [['port', 'השתלת פורט', 'O', 1], ['trach', 'טרכאוסטומיה', 'O', 2]] },
  { g: 'אנדוסקופיה', n: 50, p: [['gsc', 'גסטרוסקופיה', 'E', 1], ['col', 'קולונוסקופיה', 'E', 1]] },
  { g: 'טראומה', n: 10, p: [['trlap', 'לפרוטומיה בטראומה', 'O', 3], ['chest', 'נקז חזה', 'O', 1]] }
];
// how common each procedure is in a general surgery department (relative)
const LOG_W_ = { lchol: 10, ochol: 1, lapp: 9, oapp: 1.5, ing: 6, tapp: 5, umb: 4, vent: 3, rhc: 2.2, lhc: 2.2, lar: 1, sbr: 1.6, stoma: 2, adh: 1.8, explap: 3.5, perf: 1, slv: 3, byp: 1.2, gast: .5, whip: .35, liv: .35, panc: .3, lump: 3, mast: 1.4, slnb: 2.6, thy: 1.2, para: .5, hem: 3, fist: 3, pilo: 3, abs: 6, les: 4, debr: 3, port: 2, trach: 1, gsc: 4, col: 3, trlap: .6, chest: 1.6 };
const LOG_URG_ = { lapp: .8, oapp: .9, explap: .9, perf: 1, abs: .7, trlap: 1, chest: .8, sbr: .5, adh: .6, ochol: .5, lchol: .3, stoma: .4, debr: .4 };
const PORT_ROT_ = [[12, 6, 'טיפול נמרץ כללי'], [24, 3, 'כירורגיית כלי דם'], [33, 3, 'כירורגיית חזה'], [40, 3, 'כירורגיית ילדים'], [47, 2, 'כירורגיה פלסטית'], [52, 6, 'שנת מחקר']];
const PORT_EXAMS_ = [[42, 'שלב א׳'], [70, 'שלב ב׳']];
const PORT_COURSES_ = [[2, 'ACLS'], [3, 'קורס כירורגיה בסיסית'], [6, 'ATLS'], [10, 'אולטרסאונד FAST'], [18, 'FLS · לפרוסקופיה בסיסית'], [30, 'קורס הוראה והנחיה'], [48, 'אונקולוגיה כירורגית']];
const logCode_ = c => { for (const g of LOG_CAT_) for (const x of g.p) if (x[0] === c) return x; return null; };
const monAdd_ = (ym, n) => { const y = +ym.slice(0, 4), m = +ym.slice(5, 7) - 1 + n; return (y + Math.floor(m / 12)) + '-' + String((m % 12 + 12) % 12 + 1).padStart(2, '0'); };
const monDiff_ = (a, b) => (+b.slice(0, 4) - +a.slice(0, 4)) * 12 + (+b.slice(5, 7) - +a.slice(5, 7));
function logYears_(port, today) { const y0 = +String((port && port.start) || today).slice(0, 4), y1 = +today.slice(0, 4), out = []; for (let y = y0; y <= y1; y++) out.push(y); return out; }
function logAll_(pid, port, today) { return [].concat(...logYears_(port, today).map(y => get_('log:' + pid + ':' + y) || [])); }
const todayIso_ = () => Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'yyyy-MM-dd');
// the demo department: portfolios and years of cases for every resident, made up once (a stable random per doctor)
const PORT_START_ = { 'ברנע': '2021-03', 'נבון': '2022-04', 'סגל': '2023-01', 'ביטון': '2023-10', 'ספיר': '2024-09', 'קרסנוב': '2025-04', 'טל': '2026-01' };
function portSeed_() {
  if (get_('portseed')) return;
  const P = (get_('people') || []).filter(p => p.active !== false), R = P.filter(p => p.role === 'resident'), S = P.filter(p => p.role === 'senior' && p.title !== 'מנהל המערך'), today = todayIso_(), now = today.slice(0, 7);
  if (!R.length || !S.length) return;
  const lead = S.filter(p => /ראש צוות|אחראי/.test(p.title || ''));
  R.forEach((r, ri) => {
    let seed = 7; for (const c of r.id) seed = (seed * 31 + c.charCodeAt(0)) % 2147483647;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, pick = a => a[Math.floor(rnd() * a.length)];
    const ALL = [].concat(...LOG_CAT_.map(g => g.p)), WT = ALL.map(x => LOG_W_[x[0]] || 1), WS = WT.reduce((a, b) => a + b, 0), wpick = () => { let v = rnd() * WS; for (let i = 0; i < ALL.length; i++) { v -= WT[i]; if (v <= 0) return ALL[i]; } return ALL[0]; };
    const start = monAdd_(now, -Math.round(R.length > 1 ? 67 - ri * 66 / (R.length - 1) : 12)), mi = monDiff_(start, now);
    const at = k => monAdd_(start, k), past = k => k <= mi;
    const port = { start: start, mentor: (lead[ri % Math.max(1, lead.length)] || S[0]).id, track: 'כירורגיה כללית',
      rot: PORT_ROT_.map(x => ({ from: at(x[0]), n: x[1], t: x[2] })),
      exams: PORT_EXAMS_.map(x => ({ t: x[1], m: at(x[0]), st: past(x[0]) ? 'עבר' : x[0] - mi <= 8 ? 'נרשם/ה' : '' })),
      courses: PORT_COURSES_.map(x => ({ t: x[1], m: at(x[0]), done: past(x[0]) })),
      research: mi > 20 ? [{ t: pick(['תוצאות כריתת כיס מרה דחופה בבני 80 ומעלה', 'זמן עד חדר ניתוח בדלקת תוספתן ושיעור הניקוב', 'ERAS בניתוחי מעי: שנה ראשונה במערך', 'בקע מפשעתי ביום אחד: שביעות רצון וחזרות']), st: mi > 40 ? 'הוגש לפרסום' : mi > 30 ? 'כתיבה' : 'איסוף נתונים' }].concat(mi > 48 ? [{ t: 'דליפה מאנסטומוזה: גורמי סיכון במערך 2019–2024', st: 'פורסם' }] : []) : [],
      goals: [{ t: mi < 12 ? 'כולציסטקטומיה לפרוסקופית כמנתח בהדרכה' : mi < 36 ? 'עשר כולציסטקטומיות כמנתח עצמאי' : 'המיקולקטומיה ימנית כמנתח בהדרכה', done: false }, { t: mi < 24 ? 'הצגת מקרה בישיבת בוקר' : 'הרצאה בתוכנית הלימודים', done: rnd() < .5 }, { t: 'השלמת לוג הניתוחים עד סוף החודש', done: false }],
      reviews: [] };
    for (let k = 6; k <= mi; k += 6) port.reviews.push({ m: at(k), by: port.mentor, s: Math.min(5, 3 + Math.round(rnd() * 1.4 + k / 40)), t: pick(['מתקדם/ת יפה, אחריות גבוהה בתורנויות', 'טכניקה טובה, לעבוד על קבלת החלטות במיון', 'עבודת צוות מצוינת, להרחיב קריאה מקצועית', 'בשל/ה להוביל ניתוחים מורכבים יותר']) });
    set_('port:' + r.id, port, 'seed');
    const years = {}, inRot = k => port.rot.some(x => k >= monDiff_(start, x.from) && k < monDiff_(start, x.from) + x.n);
    for (let k = 0; k <= mi; k++) {
      const ym = at(k), yr = k / 12, n = inRot(k) ? Math.round(rnd() * 2) : Math.round(8 + yr * 2.7 + rnd() * 5), maxT = 1 + Math.floor(yr / 1.4);
      for (let i = 0; i < n; i++) {
        const day = ym + '-' + String(1 + Math.floor(rnd() * 28)).padStart(2, '0'); if (day > today) continue;
        const pr = wpick(), surg = pr[3] <= maxT && rnd() < Math.min(.92, .3 + yr * .14);
        const role = surg ? (rnd() < Math.min(.8, yr * .16) ? 'S' : 'T') : 'A', urg = rnd() < (LOG_URG_[pr[0]] || .08) ? 'U' : 'E';
        const appr = pr[2] === 'L' && pr[3] >= 3 && rnd() < .2 ? 'R' : pr[2], age = (new Date(today) - new Date(day)) / 864e5;
        const st = age > 21 ? (rnd() < .03 ? 2 : 1) : rnd() < .35 ? 1 : 0;
        const id = day.slice(0, 4) + Utilities.getUuid().replace(/-/g, '').slice(0, 6);
        (years[day.slice(0, 4)] = years[day.slice(0, 4)] || []).push([id, day, pr[0], role, appr, urg, pick(S).id, st, '', st === 1 && role !== 'A' ? Math.max(1, Math.min(4, 1 + Math.floor(yr * .62 + rnd() * 1.7))) : '']);
      }
    }
    Object.keys(years).forEach(y => set_('log:' + r.id + ':' + y, years[y].sort((a, b) => a[1].localeCompare(b[1])), 'seed'));
  });
  set_('portseed', { at: new Date().toISOString() }, 'seed');
}
const PORT_SEE_ = ['owner', 'director', 'chief', 'deputy', 'viewer'];
function ops_portAll(code) {
  const u = me_(code); if (PORT_SEE_.indexOf(u.role) < 0) throw new Error('אין הרשאה');
  portSeed_();
  const today = todayIso_(), R = (get_('people') || []).filter(p => p.active !== false && p.role === 'resident');
  return { cat: LOG_CAT_, today: today, res: R.map(p => { const port = get_('port:' + p.id) || { start: today.slice(0, 7), rot: [], exams: [], courses: [], research: [], goals: [], reviews: [] }; return { id: p.id, port: port, log: logAll_(p.id, port, today) }; }) };
}
function ops_portSave(code, pid, port) {
  const u = me_(code); if (!canWrite_(u, 'port')) throw new Error('אין הרשאה לשמור כאן');
  if (!(get_('people') || []).some(p => p.id === pid && p.role === 'resident')) throw new Error('המתמחה לא נמצא');
  set_('port:' + pid, port, u.name); return { ok: true };
}
function logFind_(pid, id) { const k = 'log:' + pid + ':' + String(id).slice(0, 4), L = get_(k) || [], i = L.findIndex(r => r[0] === id); if (i < 0) throw new Error('הניתוח לא נמצא'); return { k: k, L: L, i: i }; }
function ops_logDecide(code, pid, id, st, z) {
  const u = me_(code); if (!canWrite_(u, 'log')) throw new Error('אין הרשאה לאשר');
  const f = logFind_(pid, id); f.L[f.i][7] = st === 2 ? 2 : 1; if (st !== 2 && [1, 2, 3, 4].indexOf(+z) >= 0) f.L[f.i][9] = +z; set_(f.k, f.L, u.name); return f.L[f.i];
}
// the personal app: a resident keeps his own log; a senior approves the cases he supervised
function ops_logMe(token) {
  const me = personByToken_(token); portSeed_();
  const today = todayIso_(), P = (get_('people') || []).filter(p => p.active !== false);
  const out = { cat: LOG_CAT_, today: today, role: me.role, seniors: P.filter(p => p.role === 'senior').map(p => ({ id: p.id, name: p.name, full: p.full || '' })) };
  if (me.role === 'resident' || me.role === 'house') { out.port = get_('port:' + me.id) || { start: today.slice(0, 7) }; out.log = logAll_(me.id, out.port, today); }
  if (me.role === 'senior') {
    out.pending = []; out.done = 0;
    P.filter(p => p.role === 'resident').forEach(r => { const port = get_('port:' + r.id); logAll_(r.id, port, today).forEach(x => { if (x[6] !== me.id) return; if (x[7] === 0) out.pending.push({ pid: r.id, name: r.full || r.name, row: x }); else if (x[7] === 1) out.done++; }); });
    out.pending.sort((a, b) => b.row[1].localeCompare(a.row[1]));
  }
  return out;
}
function ops_logAdd(token, row) {
  const me = personByToken_(token); if (me.role !== 'resident' && me.role !== 'house') throw new Error('הלוג מיועד למתמחים');
  const d = String(row.d || ''), today = todayIso_();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || d > today) throw new Error('תאריך לא תקין');
  if (!logCode_(row.code)) throw new Error('בחרו ניתוח מהרשימה');
  if (['S', 'T', 'A'].indexOf(row.role) < 0 || ['L', 'O', 'R', 'E'].indexOf(row.appr) < 0 || ['E', 'U'].indexOf(row.urg) < 0) throw new Error('חסרים פרטים');
  if (!(get_('people') || []).some(p => p.id === row.sup && p.role === 'senior')) throw new Error('בחרו בכיר/ה מאשר/ת');
  const r = [d.slice(0, 4) + Utilities.getUuid().replace(/-/g, '').slice(0, 6), d, row.code, row.role, row.appr, row.urg, row.sup, 0, String(row.note || '').slice(0, 140)];
  const k = 'log:' + me.id + ':' + d.slice(0, 4), L = get_(k) || []; L.push(r); L.sort((a, b) => a[1].localeCompare(b[1])); set_(k, L, me.full || me.name);
  return r;
}
function ops_logDel(token, id) {
  const me = personByToken_(token), f = logFind_(me.id, id);
  if (f.L[f.i][7] === 1) throw new Error('ניתוח שאושר נמחק רק דרך הבכיר/ה');
  f.L.splice(f.i, 1); set_(f.k, f.L, me.full || me.name); return { ok: true };
}
function ops_logApprove(token, pid, id, st, z) {
  const me = personByToken_(token), f = logFind_(pid, id);
  if (f.L[f.i][6] !== me.id) throw new Error('רק הבכיר/ה שבחר/ה המתמחה יכול/ה לאשר');
  f.L[f.i][7] = st === 2 ? 2 : 1; if (st !== 2 && [1, 2, 3, 4].indexOf(+z) >= 0) f.L[f.i][9] = +z; set_(f.k, f.L, me.full || me.name); return f.L[f.i];
}

// three groups of medical students in the department this month (invented names)
function studSeed_() {
  const t = todayIso_(), first = t.slice(0, 8) + '01', next = monAdd_(t.slice(0, 7), 1) + '-01', last = Utilities.formatDate(new Date(new Date(next + 'T12:00:00').getTime() - 864e5), 'Asia/Jerusalem', 'yyyy-MM-dd'), mid = t.slice(0, 8) + '15';
  return { groups: [
    { name: 'קבוצה א׳ · שנה ד׳', uni: 'הפקולטה לרפואה, אוניברסיטת המרכז', from: first, to: mid, students: ['נוי אלון', 'עומר חגי', 'תהל מור', 'יאיר שושני', 'רונה עוזרי', 'איתמר בר', 'גאיה לוטן', 'כרמל נוימן'].join('\n') },
    { name: 'קבוצה ב׳ · שנה ד׳', uni: 'הפקולטה לרפואה, אוניברסיטת המרכז', from: mid, to: last, students: ['אלון קינן', 'שלומית דגן', 'ענבר יפה', 'יונתן גל', 'רז מוזס', 'דור אקרמן', 'מעיין פז', 'ליאם אדרי'].join('\n') },
    { name: 'קבוצה ג׳ · שנה ו׳ (קלרקשיפ)', uni: 'בית הספר לרפואה ע״ש הגליל', from: first, to: last, students: ['אמיר שחם', 'נגה צור', 'בן ישראלי', 'ספיר חמו', 'אורי ענבר', 'הילה כץ'].join('\n') }
  ] };
}

/* ---------------- elective surgery bank ----------------
 * bank:<team>  the team's waiting list. A case: { id, n (patient, invented in the demo), age, sex, code, sur (surgeon), pri 1..4, add (date listed),
 *   diag, asa, ready { preop, consent, labs, anest, cardio, imaging } (null = not needed), st '' | 'sched' | 'done' | 'cancel', sch { d, room }, note }
 * Scheduling puts the operation into that day's room in the weekly plan (week:<sunday>), up to three cases a room. */
WRITE.bank = ['owner', 'director', 'deputy', 'secretary'];
const BANK_TEAMS_ = [
  { id: 'hpb', t: 'כבד, לבלב ודרכי מרה', p: [['lchol', 'כריתת כיס מרה', 'L', 60], ['whip', 'ויפל', 'O', 360], ['panc', 'כריתת זנב לבלב', 'L', 240], ['liv', 'כריתת כבד', 'O', 240], ['cbd', 'חקירת דרכי מרה', 'L', 150]] },
  { id: 'crc', t: 'קולורקטלי', p: [['rhc', 'כריתת קולון ימני', 'L', 180], ['sig', 'כריתת סיגמה', 'L', 180], ['lar', 'LAR', 'L', 240], ['apr', 'APR', 'O', 270], ['stc', 'סגירת סטומה', 'O', 120]] },
  { id: 'bar', t: 'בריאטריה וקיבה', p: [['slv', 'שרוול', 'L', 90], ['oagb', 'OAGB', 'L', 100], ['rygb', 'מעקף קיבה RYGB', 'L', 150], ['rev', 'ניתוח רוויזיה', 'L', 200], ['hh', 'תיקון בקע סרעפתי', 'L', 120]] },
  { id: 'brs', t: 'שד', p: [['lump', 'למפקטומי וזקיף', 'O', 90], ['mast', 'כריתת שד', 'O', 150], ['exc', 'כריתת גוש בשד', 'O', 45]] },
  { id: 'end', t: 'אנדוקריני', p: [['thy', 'תירואידקטומי', 'O', 120], ['hemi', 'המיתירואידקטומי', 'O', 90], ['para', 'כריתת יותרת התריס', 'O', 75]] },
  { id: 'hrn', t: 'דופן הבטן', p: [['tapp', 'בקע מפשעתי', 'L', 75], ['ing', 'בקע מפשעתי', 'O', 60], ['umb', 'בקע טבורי', 'O', 45], ['inc', 'בקע בצלקת', 'L', 140]] },
  { id: 'ano', t: 'אנו-רקטלי', p: [['hem', 'טחורים', 'O', 40], ['pilo', 'פילונידלי', 'O', 45], ['fist', 'פיסטולה', 'O', 40], ['fis', 'פיסורה', 'O', 30]] }
];
// the waiting-time target of each priority, in days
const BANK_WAIT_ = { 1: 14, 2: 30, 3: 90, 4: 180 };
const BANK_TEAM_LEAD_ = { hpb: ['לנדאו', 'גולן', 'רבינוביץ'], crc: ['כספי', 'מזרחי', 'שטרן'], bar: ['ברודסקי', 'אלקיים'], brs: ['פרידמן', 'לביא'], end: ['פרלמן', 'מלמד'], hrn: ['וייס', 'דיין', 'אבוטבול', 'רוטמן'], ano: ['אבוטבול', 'רוטמן', 'דיין'] };
const bankProc_ = (team, code) => { const T = BANK_TEAMS_.find(t => t.id === team); return T && T.p.find(x => x[0] === code); };
const sundayOf_ = d => { const x = new Date(d + 'T12:00:00'); x.setDate(x.getDate() - x.getDay()); return Utilities.formatDate(x, 'Asia/Jerusalem', 'yyyy-MM-dd'); };
// a room in the weekly plan: add or remove one operation (names as the plan keeps them, "name@L")
function weekRoom_(d, room, name, del, by) {
  const k = 'week:' + sundayOf_(d), W = get_(k); if (!W || !W.days || !W.days[d]) return false;
  const R = (W.days[d].or || []).find(r => r.n === room); if (!R) return false;
  R.proc = R.proc || [];
  if (del) { const i = R.proc.indexOf(name); if (i < 0) return false; R.proc.splice(i, 1); }
  else { if (R.proc.length >= 3) throw new Error('בחדר הזה כבר 3 ניתוחים ביום הזה'); R.proc.push(name); }
  set_(k, W, by); return true;
}
function bankSeed_() {
  if (get_('bankseed')) return;
  const P = (get_('people') || []).filter(p => p.active !== false && p.role === 'senior'); if (!P.length) return;
  const today = todayIso_(), id = n => (P.find(p => p.name === n) || P[0]).id;
  let seed = 4242; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, pick = a => a[Math.floor(rnd() * a.length)];
  const FM = ['משה', 'יוסף', 'אברהם', 'אליעזר', 'נתן', 'דוד', 'יצחק', 'מרדכי', 'ולדימיר', 'אלכסנדר', 'שמעון', 'עמוס', 'חיים', 'רונן', 'אילן', 'יגאל'], FF = ['שרה', 'רחל', 'מרים', 'ציונה', 'שולמית', 'אסתר', 'גלינה', 'רינה', 'נחמה', 'חנה', 'מלכה', 'אורנה', 'סימה', 'ליודמילה', 'דבורה', 'ענת'];
  const LN = ['כהן', 'לוי', 'מזרחי', 'פרץ', 'ביטון', 'דהן', 'גולדשטיין', 'אברהמי', 'בן שושן', 'פרידמן', 'שפירו', 'גרינשטיין', 'אוחנה', 'עמר', 'קוזלוב', 'איבנוב', 'שלו', 'פרנקל', 'בן חמו', 'אדרי', 'רביבו', 'זילברמן', 'קרמר', 'טננבאום', 'אלמליח'];
  const DIAG = { lchol: ['אבני מרה תסמיניות', 'דלקת כיס מרה חוזרת', 'פוליפ בכיס המרה 11 מ״מ'], whip: ['גידול בראש הלבלב', 'גידול באמפולה'], panc: ['ציסטה בזנב הלבלב (IPMN)', 'גידול נוירואנדוקריני'], liv: ['גרורה בכבד מסרטן המעי', 'אדנומה בכבד'], cbd: ['אבן בדרכי המרה'],
    rhc: ['גידול בקולון העולה', 'פוליפ שלא ניתן לכריתה אנדוסקופית'], sig: ['דיברטיקוליטיס חוזרת', 'גידול בסיגמה'], lar: ['גידול ברקטום אחרי טיפול משולב'], apr: ['גידול נמוך ברקטום'], stc: ['סטומה זמנית אחרי הרטמן'],
    slv: ['השמנת יתר, BMI 42', 'השמנת יתר עם סוכרת, BMI 38'], oagb: ['השמנת יתר, BMI 45'], rygb: ['השמנת יתר עם ריפלוקס, BMI 41'], rev: ['החזרת משקל אחרי שרוול', 'ריפלוקס קשה אחרי שרוול'], hh: ['בקע סרעפתי גדול עם ריפלוקס'],
    lump: ['קרצינומה פולשנית T1', 'DCIS'], mast: ['גידול רב־מוקדי', 'נשאות BRCA, כריתה מונעת'], exc: ['פיברואדנומה גדלה', 'נגע לא ברור בביופסיה'],
    thy: ['זפק רב־קשרי לוחץ', 'קרצינומה פפילרית'], hemi: ['קשרית חשודה, Bethesda IV'], para: ['היפרפרתירואידיזם ראשוני'],
    tapp: ['בקע מפשעתי דו־צדדי', 'בקע מפשעתי ימני'], ing: ['בקע מפשעתי שמאלי', 'בקע מפשעתי חוזר'], umb: ['בקע טבורי'], inc: ['בקע בצלקת אחרי לפרוטומיה'],
    hem: ['טחורים דרגה 3'], pilo: ['סינוס פילונידלי חוזר'], fist: ['פיסטולה פריאנלית'], fis: ['פיסורה כרונית'] };
  const add = (d, n) => { const x = new Date(d + 'T12:00:00'); x.setDate(x.getDate() + n); return Utilities.formatDate(x, 'Asia/Jerusalem', 'yyyy-MM-dd'); };
  const N = { hpb: 22, crc: 20, bar: 30, brs: 18, end: 14, hrn: 34, ano: 16 };
  BANK_TEAMS_.forEach(T => {
    const L = [];
    for (let i = 0; i < N[T.id]; i++) {
      const pr = pick(T.p), pri = T.id === 'brs' || ['whip', 'panc', 'liv', 'lar', 'apr', 'rhc'].indexOf(pr[0]) >= 0 && rnd() < .7 ? (rnd() < .6 ? 1 : 2) : pick([2, 3, 3, 3, 4, 4]);
      const age = T.id === 'bar' ? 22 + Math.floor(rnd() * 40) : 28 + Math.floor(rnd() * 55), fem = T.id === 'brs' || rnd() < .45;
      const waited = Math.floor(rnd() * BANK_WAIT_[pri] * 1.5), c = { id: T.id + Utilities.getUuid().replace(/-/g, '').slice(0, 7), n: (fem ? pick(FF) : pick(FM)) + ' ' + pick(LN), age: age, sex: fem ? 'נ' : 'ז', code: pr[0], sur: id(pick(BANK_TEAM_LEAD_[T.id])), pri: pri, add: add(today, -waited), diag: pick(DIAG[pr[0]] || ['']), asa: age > 70 ? pick([2, 3, 3]) : pick([1, 2, 2]), st: '', note: '' };
      const done = k => rnd() < k ? 1 : 0;
      c.ready = { preop: done(.88), consent: done(.8), labs: done(.88), anest: age > 60 || c.asa >= 3 ? done(.7) : done(.92), cardio: age > 65 || c.asa >= 3 ? done(.65) : null, imaging: ['whip', 'panc', 'liv', 'rhc', 'sig', 'lar', 'apr', 'thy', 'hemi', 'para', 'lump', 'mast', 'inc', 'hh'].indexOf(pr[0]) >= 0 ? done(.85) : null };
      if (i % 7 === 0 && waited > 20) { c.st = 'done'; c.sch = { d: add(today, -1 - Math.floor(rnd() * 25)), room: 'חדר 1' }; Object.keys(c.ready).forEach(k => { if (c.ready[k] !== null) c.ready[k] = 1; }); }
      L.push(c);
    }
    set_('bank:' + T.id, L, 'seed');
  });
  // the ready cases with the most urgent priority go into the open rooms of the next two weeks
  const all = [].concat(...BANK_TEAMS_.map(T => (get_('bank:' + T.id) || []).map(c => ({ T: T, c: c }))));
  const ready = all.filter(x => !x.c.st && Object.keys(x.c.ready).every(k => x.c.ready[k] !== 0)).sort((a, b) => a.c.pri - b.c.pri || a.c.add.localeCompare(b.c.add));
  let k = 0;
  for (let i = 1; i <= 14 && k < ready.length; i++) {
    const d = add(today, i), W = get_('week:' + sundayOf_(d)); if (!W || !W.days || !W.days[d]) continue;
    (W.days[d].or || []).forEach(R => { if (k >= ready.length || (R.proc || []).length >= 3) return; const x = ready[k++], pr = bankProc_(x.T.id, x.c.code); try { if (weekRoom_(d, R.n, pr[1] + '@' + pr[2], false, 'seed')) { x.c.st = 'sched'; x.c.sch = { d: d, room: R.n }; } } catch (e) {} });
  }
  BANK_TEAMS_.forEach(T => set_('bank:' + T.id, all.filter(x => x.T === T).map(x => x.c), 'seed'));
  set_('bankseed', { at: new Date().toISOString() }, 'seed');
}
const BANK_SEE_ = ['owner', 'director', 'deputy', 'secretary', 'chief', 'viewer'];
function ops_bankAll(code) {
  const u = me_(code); if (BANK_SEE_.indexOf(u.role) < 0) throw new Error('אין הרשאה');
  bankSeed_();
  return { today: todayIso_(), teams: BANK_TEAMS_, wait: BANK_WAIT_, lead: BANK_TEAM_LEAD_, cases: [].concat(...BANK_TEAMS_.map(T => (get_('bank:' + T.id) || []).map(c => Object.assign({ team: T.id }, c)))) };
}
function bankGet_(team, id) { const k = 'bank:' + team, L = get_(k) || [], i = L.findIndex(c => c.id === id); if (i < 0) throw new Error('המטופל/ת לא נמצא/ה ברשימה'); return { k: k, L: L, i: i, c: L[i] }; }
function ops_bankSave(code, c) {
  const u = me_(code); if (!canWrite_(u, 'bank')) throw new Error('אין הרשאה לשמור כאן');
  const pr = bankProc_(c.team, c.code); if (!pr) throw new Error('בחרו צוות וניתוח');
  if (!String(c.n || '').trim()) throw new Error('חסר שם');
  const clean = { n: String(c.n).trim().slice(0, 60), age: Math.max(0, Math.min(120, +c.age || 0)), sex: c.sex === 'נ' ? 'נ' : 'ז', code: c.code, sur: String(c.sur || ''), pri: [1, 2, 3, 4].indexOf(+c.pri) >= 0 ? +c.pri : 3, diag: String(c.diag || '').slice(0, 120), asa: [1, 2, 3, 4].indexOf(+c.asa) >= 0 ? +c.asa : 2, note: String(c.note || '').slice(0, 300), ready: c.ready || {} };
  const k = 'bank:' + c.team, L = get_(k) || [];
  if (c.id) { const f = bankGet_(c.team, c.id); Object.assign(f.c, clean); set_(k, f.L, u.name); return Object.assign({ team: c.team }, f.c); }
  const n = Object.assign({ id: c.team + Utilities.getUuid().replace(/-/g, '').slice(0, 7), add: todayIso_(), st: '' }, clean); L.push(n); set_(k, L, u.name); return Object.assign({ team: c.team }, n);
}
function ops_bankSchedule(code, team, id, d, room) {
  const u = me_(code); if (!canWrite_(u, 'bank')) throw new Error('אין הרשאה לשבץ');
  const f = bankGet_(team, id), pr = bankProc_(team, f.c.code), name = pr[1] + '@' + pr[2];
  if (f.c.sch && f.c.st === 'sched') { try { weekRoom_(f.c.sch.d, f.c.sch.room, name, true, u.name); } catch (e) {} }
  if (!d) { f.c.st = ''; delete f.c.sch; set_(f.k, f.L, u.name); return f.c; }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(d)) || d < todayIso_()) throw new Error('תאריך לא תקין');
  const inPlan = weekRoom_(d, String(room), name, false, u.name);
  f.c.st = 'sched'; f.c.sch = { d: d, room: String(room), plan: inPlan }; set_(f.k, f.L, u.name);
  try { if (lumenFromBank_(team, f.c, u.name)) f.c.lumen = 1; } catch (e) {}
  return f.c;
}
function ops_bankStatus(code, team, id, st) {
  const u = me_(code); if (!canWrite_(u, 'bank')) throw new Error('אין הרשאה');
  const f = bankGet_(team, id); if (['', 'done', 'cancel'].indexOf(st) < 0) throw new Error('סטטוס לא תקין');
  if (st === 'cancel' && f.c.st === 'sched' && f.c.sch) { const pr = bankProc_(team, f.c.code); try { weekRoom_(f.c.sch.d, f.c.sch.room, pr[1] + '@' + pr[2], true, u.name); } catch (e) {} delete f.c.sch; }
  f.c.st = st; if (st === 'done' && !f.c.sch) f.c.sch = { d: todayIso_(), room: '' }; set_(f.k, f.L, u.name);
  if (st === 'done') { try { if (pathFromBank_(team, f.c, u.name)) f.c.path = 1; } catch (e) {} }
  return f.c;
}

/* ---------------- outside doctors (externs) and the admissions committee ----------------
 * ext  one key: { rec: { <pid>: { home, track, from, to, quota, docs { lic, ins, orient, bls, contract, sign }, note } },
 *   apps: [{ id, pid (when already an extern here), n, school, lic (year), cur, want, add, stage 'new' | 'int' | 'cmte' | 'acc' | 'rej' | 'wait',
 *     ints: [{ by, d, s { clin, tech, team, mot } 1..5, t }], meet, dec { st, d, by, note }, note }],
 *   meets: [{ id, d, h, room, members [pid], apps [app id], done, notes }] }
 * Every hospital, school and name here is invented. */
WRITE.ext = ['owner', 'director', 'chief', 'secretary'];
WRITE.cmte = ['owner', 'director', 'chief', 'deputy'];
const EXT_SEE_ = ['owner', 'director', 'chief', 'deputy', 'secretary', 'viewer'];
const EXT_DOCS_ = [['lic', 'רישיון'], ['ins', 'ביטוח'], ['orient', 'הדרכת מחלקה'], ['bls', 'החייאה'], ['contract', 'חוזה'], ['sign', 'הרשאות מערכת']];
const EXT_STAGES_ = [['new', 'בקשה חדשה'], ['int', 'ראיונות'], ['cmte', 'לוועדה'], ['acc', 'התקבל/ה'], ['wait', 'רשימת המתנה'], ['rej', 'לא התקבל/ה']];
const extId_ = p => p + Utilities.getUuid().replace(/-/g, '').slice(0, 7);
function extSeed_() {
  if (get_('ext')) return get_('ext');
  const P = (get_('people') || []).filter(p => p.active !== false), X = P.filter(p => p.role === 'extern'), S = P.filter(p => p.role === 'senior'), today = todayIso_();
  let seed = 9091; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, pick = a => a[Math.floor(rnd() * a.length)];
  const add = (d, n) => { const x = new Date(d + 'T12:00:00'); x.setDate(x.getDate() + n); return Utilities.formatDate(x, 'Asia/Jerusalem', 'yyyy-MM-dd'); };
  const HOME = ['המרכז הרפואי נחלים', 'בית החולים גבעות', 'מרכז רפואי עמק השקד', 'בית החולים הדר', 'המרכז הרפואי חוף התכלת'], TRACK = ['אורולוגיה', 'אורתופדיה', 'כירורגיית כלי דם', 'כירורגיה פלסטית', 'כירורגיית ילדים', 'אף אוזן גרון', 'מתמחה לפני התמחות'];
  const SCHOOL = ['הפקולטה לרפואה, אוניברסיטת המרכז', 'בית הספר לרפואה ע״ש הגליל', 'הפקולטה לרפואה, אוניברסיטת הנגב המערבי', 'בית ספר לרפואה בחו״ל (רומניה)', 'בית ספר לרפואה בחו״ל (איטליה)'];
  const CUR = ['תורן/ית חוץ במערך', 'רופא/ה במחלקה פנימית', 'רופא/ה ברפואה דחופה', 'רופא/ה כללי/ת', 'מחקר במעבדה'];
  const sid = n => (S.find(p => p.name === n) || S[0] || {}).id;
  const out = { rec: {}, apps: [], meets: [] };
  X.forEach((p, i) => {
    const from = add(today, -Math.floor(30 + rnd() * 300)), to = p.cand ? add(today, 20 + Math.floor(rnd() * 60)) : add(today, i % 5 === 1 ? 12 + i : 60 + Math.floor(rnd() * 240));
    const docs = {}; EXT_DOCS_.forEach(d => { docs[d[0]] = rnd() < (p.cand ? .82 : .95) ? 1 : 0; });
    out.rec[p.id] = { home: p.cand ? 'המרכז הרפואי אופק' : pick(HOME), track: p.cand ? 'מועמד/ת להתמחות בכירורגיה כללית' : pick(TRACK), from: from, to: to, quota: p.cand ? 7 : pick([4, 5, 6, 6, 8]), docs: docs, note: '' };
  });
  const score = () => ({ clin: 3 + Math.round(rnd() * 2), tech: 2 + Math.round(rnd() * 3), team: 3 + Math.round(rnd() * 2), mot: 3 + Math.round(rnd() * 2) });
  const INT_T = ['ידע קליני טוב, מציג/ה מקרים בבהירות', 'ידיים טובות בסדנת התפירה', 'מוטיבציה גבוהה, ממליצים מהמחלקה', 'צריך/ה עוד חשיפה לחדר הניתוח', 'עבודת צוות מצוינת בתורנויות', 'שקט/ה ויסודי/ת, אמין/ה מאוד'];
  const ivs = ['גרינברג', 'לנדאו', 'כספי', 'אשכנזי', 'וייס', 'דיין'].map(sid).filter(Boolean);
  const mkInts = n => { const L = [], o = Math.floor(rnd() * 6), ot = Math.floor(rnd() * INT_T.length); for (let k = 0; k < n; k++) L.push({ by: ivs[(o + k) % ivs.length], d: add(today, -5 - Math.floor(rnd() * 40)), s: score(), t: INT_T[(ot + k) % INT_T.length] }); return L; };
  // the externs waiting for the committee, then applicants from outside
  X.filter(p => p.cand).forEach((p, i) => { out.apps.push({ id: extId_('a'), pid: p.id, n: p.full || p.name, school: pick(SCHOOL), lic: 2020 + Math.floor(rnd() * 5), cur: CUR[0], want: 'כירורגיה כללית', add: add(today, -40 - i * 9), stage: i < 3 ? 'cmte' : 'int', ints: mkInts(i < 3 ? 3 : 1 + (i % 2)), note: '' }); });
  [['ד״ר הדס אלגרבלי', 'new', 0], ['ד״ר יואב חלפון', 'new', 0], ['ד״ר אורן שמואלי', 'int', 2], ['ד״ר סיוון טוביאנה', 'int', 1], ['ד״ר מתן גרינשפן', 'cmte', 3], ['ד״ר קרן וולך', 'acc', 3], ['ד״ר אנטון גורדייב', 'wait', 3], ['ד״ר רון קלמן', 'rej', 2]].forEach((a, i) => {
    const o = { id: extId_('a'), pid: '', n: a[0], school: pick(SCHOOL), lic: 2019 + Math.floor(rnd() * 6), cur: pick(CUR.slice(1)), want: 'כירורגיה כללית', add: add(today, -8 - i * 11), stage: a[1], ints: mkInts(a[2]), note: '' };
    out.apps.push(o);
  });
  // a committee two months ago (decided), and the next one in ten days with everyone who is ready for it
  const mem = ['אלמוג', 'שחר', 'גרינברג', 'רז', 'וייס', 'דיין'].map(sid).filter((x, i, a) => x && a.indexOf(x) === i);
  const past = { id: extId_('m'), d: add(today, -54), h: '14:00', room: 'חדר הישיבות, קומה 4', members: mem, apps: out.apps.filter(a => ['acc', 'wait', 'rej'].indexOf(a.stage) >= 0).map(a => a.id), done: true, notes: 'שלושה מועמדים. קבלה אחת, אחד לרשימת ההמתנה ואחד לא התקבל.' };
  out.apps.forEach(a => { if (past.apps.indexOf(a.id) >= 0) { a.meet = past.id; a.dec = { st: a.stage, d: past.d, by: 'ועדת קבלה', note: a.stage === 'acc' ? 'התחלה בינואר' : a.stage === 'wait' ? 'לחזור בעוד חצי שנה' : '' }; } });
  const next = { id: extId_('m'), d: (() => { let d = add(today, 10); while (new Date(d + 'T12:00:00').getDay() > 4) d = add(d, 1); return d; })(), h: '14:00', room: 'חדר הישיבות, קומה 4', members: mem, apps: out.apps.filter(a => a.stage === 'cmte').map(a => a.id), done: false, notes: '' };
  out.apps.forEach(a => { if (next.apps.indexOf(a.id) >= 0) a.meet = next.id; });
  out.meets = [past, next];
  set_('ext', out, 'seed'); return out;
}
function extShifts_(ids, today) {
  const mo = today.slice(0, 7), y = +mo.slice(0, 4), m = +mo.slice(5, 7), M = [-1, 0, 1].map(k => { const mm = m + k, yy = y + Math.floor((mm - 1) / 12); return yy + '-' + String((mm - 1 + 12) % 12 + 1).padStart(2, '0'); });
  const out = {}; ids.forEach(id => { out[id] = { prev: 0, cur: 0, next: 0, done: 0, we: 0, last: '', nxt: '' }; });
  M.forEach((mo, j) => { const D = (get_('duty:' + mo) || {}).days || {}; Object.keys(D).forEach(d => { if (d.slice(0, 7) !== mo) return; ['er1', 'er2', 'dept', 'minor', 'fm'].forEach(k => { const o = out[D[d][k]]; if (!o) return; o[['prev', 'cur', 'next'][j]]++; if (j === 1 && d <= today) o.done++; if (j === 1) { const g = new Date(d + 'T12:00:00').getDay(); if (g >= 5) o.we++; } if (d <= today && d > o.last) o.last = d; if (d > today && (!o.nxt || d < o.nxt)) o.nxt = d; }); }); });
  return { months: M, by: out };
}
function ops_extAll(code) {
  const u = me_(code); if (EXT_SEE_.indexOf(u.role) < 0) throw new Error('אין הרשאה');
  const data = extSeed_(), today = todayIso_(), X = (get_('people') || []).filter(p => p.active !== false && p.role === 'extern');
  return { today: today, docs: EXT_DOCS_, stages: EXT_STAGES_, data: data, shifts: extShifts_(X.map(p => p.id), today), decide: ['owner', 'director'].indexOf(u.role) >= 0 };
}
function ops_extSave(code, pid, rec) {
  const u = me_(code); if (!canWrite_(u, 'ext')) throw new Error('אין הרשאה לשמור כאן');
  if (!(get_('people') || []).some(p => p.id === pid && p.role === 'extern')) throw new Error('תורן/ית החוץ לא נמצא/ה');
  const D = extSeed_(), docs = {}; EXT_DOCS_.forEach(d => { docs[d[0]] = rec.docs && rec.docs[d[0]] ? 1 : 0; });
  const ok = s => /^\d{4}-\d{2}-\d{2}$/.test(String(s || '')) ? s : '';
  D.rec[pid] = { home: String(rec.home || '').slice(0, 80), track: String(rec.track || '').slice(0, 80), from: ok(rec.from), to: ok(rec.to), quota: Math.max(0, Math.min(15, +rec.quota || 0)), docs: docs, note: String(rec.note || '').slice(0, 300) };
  set_('ext', D, u.name); return D.rec[pid];
}
function extApp_(D, id) { const a = D.apps.find(x => x.id === id); if (!a) throw new Error('המועמד/ת לא נמצא/ה'); return a; }
function ops_extApp(code, a) {
  const u = me_(code); if (!canWrite_(u, 'ext') && !canWrite_(u, 'cmte')) throw new Error('אין הרשאה לשמור כאן');
  if (!String(a.n || '').trim()) throw new Error('חסר שם');
  const D = extSeed_(), clean = { n: String(a.n).trim().slice(0, 60), school: String(a.school || '').slice(0, 80), lic: +a.lic || '', cur: String(a.cur || '').slice(0, 60), want: String(a.want || 'כירורגיה כללית').slice(0, 60), note: String(a.note || '').slice(0, 300) };
  if (a.stage && ['new', 'int', 'cmte'].indexOf(a.stage) >= 0) clean.stage = a.stage;
  if (a.id) { const x = extApp_(D, a.id); Object.assign(x, clean); set_('ext', D, u.name); return x; }
  const n = Object.assign({ id: extId_('a'), pid: '', add: todayIso_(), stage: 'new', ints: [] }, clean); D.apps.push(n); set_('ext', D, u.name); return n;
}
function ops_extScore(code, id, iv) {
  const u = me_(code); if (!canWrite_(u, 'cmte')) throw new Error('אין הרשאה');
  const D = extSeed_(), a = extApp_(D, id), s = {}; ['clin', 'tech', 'team', 'mot'].forEach(k => { s[k] = Math.max(1, Math.min(5, +(iv.s || {})[k] || 3)); });
  if (!(get_('people') || []).some(p => p.id === iv.by && p.role === 'senior')) throw new Error('בחרו את הבכיר/ה שראיין/ה');
  a.ints = a.ints || []; a.ints.push({ by: iv.by, d: todayIso_(), s: s, t: String(iv.t || '').slice(0, 200) });
  if (a.stage === 'new') a.stage = 'int';
  set_('ext', D, u.name); return a;
}
function ops_extMeet(code, m) {
  const u = me_(code); if (!canWrite_(u, 'cmte')) throw new Error('אין הרשאה');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(m.d || ''))) throw new Error('בחרו תאריך');
  const D = extSeed_(), apps = (m.apps || []).filter(id => D.apps.some(a => a.id === id));
  const clean = { d: m.d, h: String(m.h || '14:00').slice(0, 5), room: String(m.room || '').slice(0, 60), members: (m.members || []).slice(0, 12), apps: apps, done: !!m.done, notes: String(m.notes || '').slice(0, 600) };
  let x = m.id ? D.meets.find(q => q.id === m.id) : null;
  if (m.id && !x) throw new Error('הוועדה לא נמצאה');
  if (x) Object.assign(x, clean); else { x = Object.assign({ id: extId_('m') }, clean); D.meets.push(x); }
  D.apps.forEach(a => { if (apps.indexOf(a.id) >= 0) { a.meet = x.id; if (['new', 'int'].indexOf(a.stage) >= 0) a.stage = 'cmte'; } else if (a.meet === x.id && !a.dec) { delete a.meet; if (a.stage === 'cmte') a.stage = 'int'; } });
  D.meets.sort((p, q) => p.d.localeCompare(q.d)); set_('ext', D, u.name); return x;
}
// the committee's decision: only the department head and the owner. An accepted extern stops being a candidate
function ops_extDecide(code, id, st, note) {
  const u = me_(code); if (['owner', 'director'].indexOf(u.role) < 0) throw new Error('רק מנהל המערך מחליט/ה');
  if (['acc', 'rej', 'wait', ''].indexOf(st) < 0) throw new Error('החלטה לא תקינה');
  const D = extSeed_(), a = extApp_(D, id);
  if (!st) { delete a.dec; a.stage = a.meet ? 'cmte' : (a.ints || []).length ? 'int' : 'new'; }
  else { a.stage = st; a.dec = { st: st, d: todayIso_(), by: u.name, note: String(note || '').slice(0, 200) }; }
  if (a.pid) { const L = get_('people') || [], p = L.find(x => x.id === a.pid); if (p) { if (st === 'acc') delete p.cand; else p.cand = true; set_('people', L, u.name); } }
  set_('ext', D, u.name); return a;
}

/* ---------------- pathology follow-up ----------------
 * path:<yyyy-mm>  the specimens of the operations of that month: { id, n, age, sex, d (operation), code, team, sur, res, src 'bank' | 'demo' | 'hand', bank,
 *   st 'sent' | 'ready' | 'seen' | 'told' | 'closed', rd (result date), dx, mal 0 benign | 1 malignant | 2 unexpected, mdt (tumor board date), told { d, by }, note }
 * A result is expected within PATH_TAT_ days; a malignant or unexpected one is told to the patient within PATH_TELL_ days and goes to the tumor board (Wednesdays). */
WRITE.path = ['owner', 'director', 'deputy', 'chief', 'secretary'];
const PATH_SEE_ = ['owner', 'director', 'deputy', 'chief', 'secretary', 'viewer'];
const PATH_TAT_ = 14, PATH_TELL_ = 7;
// specimen, the chance it is malignant, a benign and a malignant result (all invented wording)
const PATH_SPEC_ = {
  lchol: ['כיס מרה', .015, 'דלקת כרונית של כיס המרה עם אבנים', 'אדנוקרצינומה של כיס המרה, pT1b, שוליים נקיים'], whip: ['ראש לבלב ותריסריון', .8, 'דלקת כרונית של הלבלב', 'אדנוקרצינומה דוקטלית, pT2N1, שוליים נקיים'],
  panc: ['זנב לבלב וטחול', .35, 'IPMN עם דיספלזיה בדרגה נמוכה', 'גידול נוירואנדוקריני G2, pT2N0'], liv: ['סגמנטים של הכבד', .7, 'אדנומה הפטוצלולרית', 'גרורה של אדנוקרצינומה מהמעי, שוליים 6 מ״מ'], cbd: ['דרכי מרה', .05, 'דלקת כרונית', 'כולנגיוקרצינומה'],
  rhc: ['קולון ימני', .6, 'אדנומה טובולווילוסית עם דיספלזיה בדרגה גבוהה', 'אדנוקרצינומה, pT3N0 (0/18), שוליים נקיים'], sig: ['סיגמה', .35, 'דיברטיקוליטיס כרונית', 'אדנוקרצינומה, pT2N0 (0/14)'],
  lar: ['רקטום', .9, 'תגובה מלאה לטיפול (ypT0N0)', 'אדנוקרצינומה, ypT2N1 (2/15), CRM נקי'], apr: ['רקטום ופי הטבעת', .95, 'תגובה מלאה לטיפול', 'אדנוקרצינומה, ypT3N0, CRM נקי'], stc: ['סטומה', 0, 'רקמת מעי תקינה', ''],
  slv: ['שרוול קיבה', .005, 'גסטריטיס כרונית קלה', 'GIST 1.2 ס״מ, שוליים נקיים'], oagb: ['', 0, '', ''], rygb: ['', 0, '', ''], rev: ['', 0, '', ''], hh: ['', 0, '', ''],
  lump: ['גוש שד ובלוטת זקיף', .85, 'פיברואדנומה', 'קרצינומה דוקטלית פולשנית 1.4 ס״מ, זקיף נקי, שוליים נקיים'], mast: ['שד', .8, 'שינויים פיברוציסטיים', 'קרצינומה לובולרית פולשנית רב־מוקדית, 1/3 בלוטות'], exc: ['גוש שד', .15, 'פיברואדנומה', 'DCIS בדרגה בינונית, שוליים צמודים'],
  thy: ['בלוטת התריס', .4, 'זפק רב־קשרי', 'קרצינומה פפילרית 1.8 ס״מ, בלי פלישה מחוץ לבלוטה'], hemi: ['אונת בלוטת התריס', .3, 'אדנומה פוליקולרית', 'קרצינומה פפילרית, וריאנט פוליקולרי, 1.1 ס״מ'], para: ['יותרת התריס', .01, 'אדנומה של יותרת התריס', ''],
  tapp: ['', 0, '', ''], ing: ['', 0, '', ''], umb: ['', 0, '', ''], inc: ['', 0, '', ''], hem: ['טחורים', .002, 'טחורים עם פקקת', ''], pilo: ['סינוס פילונידלי', 0, 'סינוס פילונידלי עם דלקת כרונית', ''], fist: ['פיסטולה', .005, 'דלקת כרונית', ''], fis: ['', 0, '', ''],
  app: ['תוספתן', .01, 'דלקת חריפה של התוספתן', 'גידול נוירואנדוקריני של התוספתן 0.8 ס״מ, שוליים נקיים'], echol: ['כיס מרה', .01, 'דלקת חריפה גנגרנוטית של כיס המרה', 'אדנוקרצינומה של כיס המרה, pT2'], sbr: ['מעי דק', .05, 'נמק איסכמי של המעי הדק', 'גידול נוירואנדוקריני של המעי הדק']
};
const PATH_EMERG_ = [['app', 'כריתת תוספתן', 'trauma'], ['echol', 'כריתת כיס מרה דחופה', 'trauma'], ['sbr', 'כריתת מעי דק', 'trauma']];
const pathName_ = (team, code) => { const e = PATH_EMERG_.find(x => x[0] === code); if (e) return e[1]; const p = bankProc_(team, code); return p ? p[1] : code; };
const pathMonths_ = (today, n) => { const out = []; for (let k = 0; k < n; k++) out.push(monAdd_(today.slice(0, 7), -k)); return out; };
function pathSeed_() {
  if (get_('pathseed')) return;
  const P = (get_('people') || []).filter(p => p.active !== false), S = P.filter(p => p.role === 'senior'), R = P.filter(p => p.role === 'resident'); if (!S.length) return;
  const today = todayIso_(), id = n => (S.find(p => p.name === n) || S[0]).id;
  let seed = 7171; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, pick = a => a[Math.floor(rnd() * a.length)];
  const add = (d, n) => { const x = new Date(d + 'T12:00:00'); x.setDate(x.getDate() + n); return Utilities.formatDate(x, 'Asia/Jerusalem', 'yyyy-MM-dd'); };
  const FM = ['משה', 'יוסי', 'אבי', 'חנוך', 'אהרון', 'דני', 'ניסים', 'בוריס', 'שלמה', 'מאיר', 'גיל', 'צבי'], FF = ['רבקה', 'לאה', 'נעמי', 'אסנת', 'ציפי', 'יפה', 'אולגה', 'טובה', 'ורד', 'הודיה', 'מרגלית', 'רותי'];
  const LN = ['אזולאי', 'חדד', 'גבאי', 'נאור', 'עוזרי', 'ברגר', 'ויסמן', 'פולונסקי', 'שמעוני', 'טל', 'עזרא', 'דרורי', 'מלמד', 'רוזן', 'בנימין', 'סויסה', 'קפלוני', 'מנחם'];
  const pool = [];
  BANK_TEAMS_.forEach(T => T.p.forEach(x => { const s = PATH_SPEC_[x[0]]; if (s && s[0]) pool.push({ team: T.id, code: x[0], w: T.id === 'crc' || T.id === 'hpb' ? 3 : T.id === 'brs' || T.id === 'end' ? 2 : 1 }); }));
  PATH_EMERG_.forEach(x => pool.push({ team: x[2], code: x[0], w: x[0] === 'app' ? 6 : x[0] === 'echol' ? 3 : 1 }));
  const WS = pool.reduce((a, b) => a + b.w, 0), wpick = () => { let v = rnd() * WS; for (const x of pool) { v -= x.w; if (v <= 0) return x; } return pool[0]; };
  const lead = t => t === 'trauma' ? ['אשכנזי', 'וייס', 'דיין', 'רוטמן'] : BANK_TEAM_LEAD_[t] || ['וייס'];
  const by = {};
  for (let i = 1; i <= 62; i++) {
    const d = add(today, -i); if (new Date(d + 'T12:00:00').getDay() === 6) continue;
    const n = new Date(d + 'T12:00:00').getDay() === 5 ? 1 : 2 + Math.floor(rnd() * 3);
    for (let k = 0; k < n; k++) {
      const x = wpick(), s = PATH_SPEC_[x.code], fem = x.team === 'brs' || rnd() < .5, age = 25 + Math.floor(rnd() * 60);
      const c = { id: 'h' + Utilities.getUuid().replace(/-/g, '').slice(0, 8), n: (fem ? pick(FF) : pick(FM)) + ' ' + pick(LN), age: age, sex: fem ? 'נ' : 'ז', d: d, code: x.code, team: x.team, sur: id(pick(lead(x.team))), res: R.length ? pick(R).id : '', src: 'demo', st: 'sent', rd: '', dx: '', mal: 0, mdt: '', note: '' };
      const tat = 5 + Math.floor(rnd() * 14), rd = add(d, tat);
      if (rd <= today) {
        const m = rnd() < s[1] ? (x.code === 'lchol' || x.code === 'app' || x.code === 'echol' || x.code === 'slv' ? 2 : 1) : 0;
        c.rd = rd; c.mal = m; c.dx = m && s[3] ? s[3] : s[2]; if (!c.dx) c.mal = 0;
        const age2 = (new Date(today) - new Date(rd)) / 864e5;
        c.st = age2 > 12 ? 'closed' : age2 > 6 ? 'told' : age2 > 2 ? (rnd() < .5 ? 'seen' : 'told') : rnd() < .6 ? 'ready' : 'seen';
        if (c.mal && age2 > 9 && rnd() < .06) c.st = 'seen';
        if (c.st === 'told' || c.st === 'closed') c.told = { d: add(rd, 1 + Math.floor(rnd() * 5)), by: 'seed' };
        if (c.told && c.told.d > today) c.told.d = today;
        if (c.mal && (c.st === 'told' || c.st === 'closed' || rnd() < .5)) { let w = add(rd, 3); while (new Date(w + 'T12:00:00').getDay() !== 3) w = add(w, 1); c.mdt = w; }
        // the recent malignant results wait for one of the next two boards
        if (c.mal && age2 <= 12) { let w = add(today, 1); while (new Date(w + 'T12:00:00').getDay() !== 3) w = add(w, 1); c.mdt = rnd() < .65 ? w : add(w, 7); if (c.st === 'closed') c.st = 'told'; }
        if (c.mal && c.st === 'closed' && c.mdt > today) c.st = 'told';
      }
      (by[d.slice(0, 7)] = by[d.slice(0, 7)] || []).push(c);
    }
  }
  Object.keys(by).forEach(mo => set_('path:' + mo, by[mo], 'seed'));
  set_('pathseed', { at: new Date().toISOString() }, 'seed');
}
// an operation marked done in the bank sends its specimen to pathology
function pathFromBank_(team, c, by) {
  const s = PATH_SPEC_[c.code]; if (!s || !s[0]) return null;
  const d = (c.sch && c.sch.d) || todayIso_(), k = 'path:' + d.slice(0, 7), L = get_(k) || [];
  if (L.some(x => x.bank === c.id)) return null;
  const x = { id: 'h' + Utilities.getUuid().replace(/-/g, '').slice(0, 8), n: c.n, age: c.age, sex: c.sex, d: d, code: c.code, team: team, sur: c.sur || '', res: '', src: 'bank', bank: c.id, st: 'sent', rd: '', dx: '', mal: 0, mdt: '', note: '' };
  L.push(x); set_(k, L, by); return x;
}
function ops_pathAll(code) {
  const u = me_(code); if (PATH_SEE_.indexOf(u.role) < 0) throw new Error('אין הרשאה');
  pathSeed_();
  const today = todayIso_(), spec = {}; Object.keys(PATH_SPEC_).forEach(k => { if (PATH_SPEC_[k][0]) spec[k] = PATH_SPEC_[k][0]; });
  const names = {}; BANK_TEAMS_.forEach(T => T.p.forEach(x => { names[x[0]] = x[1]; })); PATH_EMERG_.forEach(x => { names[x[0]] = x[1]; });
  const teams = BANK_TEAMS_.map(T => ({ id: T.id, t: T.t })).concat([{ id: 'trauma', t: 'טראומה ודחופים' }]);
  return { today: today, tat: PATH_TAT_, tell: PATH_TELL_, spec: spec, names: names, teams: teams, cases: [].concat(...pathMonths_(today, 4).map(mo => get_('path:' + mo) || [])) };
}
function ops_pathAct(code, d, id, act, val) {
  const u = me_(code); if (!canWrite_(u, 'path')) throw new Error('אין הרשאה');
  const k = 'path:' + String(d).slice(0, 7), L = get_(k) || [], x = L.find(c => c.id === id); if (!x) throw new Error('הדגימה לא נמצאה');
  const today = todayIso_();
  if (act === 'result') { const dx = String((val || {}).dx || '').trim(); if (!dx) throw new Error('חסרה תשובה'); x.dx = dx.slice(0, 200); x.mal = [0, 1, 2].indexOf(+(val || {}).mal) >= 0 ? +val.mal : 0; x.rd = today; x.st = 'ready'; }
  else if (act === 'seen') { if (!x.rd) throw new Error('עוד אין תשובה'); x.st = 'seen'; }
  else if (act === 'told') { if (!x.rd) throw new Error('עוד אין תשובה'); x.st = 'told'; x.told = { d: today, by: u.name }; }
  else if (act === 'mdt') { if (val && !/^\d{4}-\d{2}-\d{2}$/.test(String(val))) throw new Error('תאריך לא תקין'); x.mdt = val || ''; }
  else if (act === 'close') { if (!x.rd) throw new Error('עוד אין תשובה'); if (x.mal && !x.told) throw new Error('קודם לסמן שהמטופל/ת עודכן/ה'); x.st = 'closed'; }
  else if (act === 'reopen') { x.st = x.rd ? (x.told ? 'told' : 'seen') : 'sent'; }
  else if (act === 'note') { x.note = String(val || '').slice(0, 300); }
  else throw new Error('פעולה לא מוכרת');
  set_(k, L, u.name); return x;
}
// the personal app: a senior sees the results of the patients he operated on, marks them read and the patient told
function ops_pathMe(token) {
  const me = personByToken_(token); if (me.role !== 'senior') return { cases: [] };
  pathSeed_();
  const today = todayIso_(), names = {}; BANK_TEAMS_.forEach(T => T.p.forEach(x => { names[x[0]] = x[1]; })); PATH_EMERG_.forEach(x => { names[x[0]] = x[1]; });
  const L = [].concat(...pathMonths_(today, 4).map(mo => get_('path:' + mo) || [])).filter(c => c.sur === me.id && c.st !== 'sent' && c.st !== 'closed' && (c.st === 'ready' || !c.told));
  L.sort((a, b) => (b.mal ? 1 : 0) - (a.mal ? 1 : 0) || a.rd.localeCompare(b.rd));
  return { today: today, tell: PATH_TELL_, names: names, cases: L, wait: [].concat(...pathMonths_(today, 2).map(mo => get_('path:' + mo) || [])).filter(c => c.sur === me.id && c.st === 'sent').length };
}
function ops_pathMeAct(token, d, id, act) {
  const me = personByToken_(token), k = 'path:' + String(d).slice(0, 7), L = get_(k) || [], x = L.find(c => c.id === id);
  if (!x) throw new Error('הדגימה לא נמצאה'); if (x.sur !== me.id) throw new Error('רק המנתח/ת של המטופל/ת');
  if (!x.rd) throw new Error('עוד אין תשובה');
  if (act === 'seen') x.st = 'seen'; else if (act === 'told') { x.st = 'told'; x.told = { d: todayIso_(), by: me.full || me.name }; } else throw new Error('פעולה לא מוכרת');
  set_(k, L, me.full || me.name); return x;
}

/* ---------------- complications and the M&M conference ----------------
 * mm:<yyyy-mm>  the complications found that month: { id, n, age, sex, d (operation), ev (found), proc, team, sur, res, cd (Clavien-Dindo: 1, 2, 3a, 3b, 4a, 4b, 5),
 *   type, desc, ret (back to theatre), readm, mm (conference date), pres (presenting resident), st 'open' | 'review' | 'closed', lesson }
 * The conference is on Mondays at 07:30; grade IIIa and above is presented. */
WRITE.mm = ['owner', 'director', 'deputy', 'chief'];
const MM_SEE_ = ['owner', 'director', 'deputy', 'chief', 'viewer'];
const MM_CD_ = ['1', '2', '3a', '3b', '4a', '4b', '5'];
const MM_TYPES_ = ['זיהום פצע', 'דליפה מאנסטומוזה', 'מורסה תוך־בטנית', 'דימום', 'שיתוק מעיים ממושך', 'דלקת ריאות', 'תסחיף ריאתי', 'אי־ספיקת כליות', 'פגיעה בדרכי המרה', 'בקע בצלקת מוקדם', 'אירוע לבבי', 'אחר'];
function mmSeed_() {
  if (get_('mmseed')) return;
  const P = (get_('people') || []).filter(p => p.active !== false), S = P.filter(p => p.role === 'senior'), R = P.filter(p => p.role === 'resident'); if (!S.length || !R.length) return;
  const today = todayIso_(), id = n => (S.find(p => p.name === n) || S[0]).id;
  let seed = 3131; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, pick = a => a[Math.floor(rnd() * a.length)];
  const add = (d, n) => { const x = new Date(d + 'T12:00:00'); x.setDate(x.getDate() + n); return Utilities.formatDate(x, 'Asia/Jerusalem', 'yyyy-MM-dd'); };
  const mon = d => { let x = d; while (new Date(x + 'T12:00:00').getDay() !== 1) x = add(x, 1); return x; };
  const FM = ['יעקב', 'אליהו', 'חזי', 'ראובן', 'מיכאל', 'זאב', 'נפתלי', 'פאבל', 'שאול', 'אריה'], FF = ['פנינה', 'זהבה', 'סיוון', 'יוליה', 'מזל', 'אילנה', 'רינת', 'שושנה', 'גאולה', 'דליה'];
  const LN = ['בוזגלו', 'קרמר', 'עמרם', 'פישר', 'מלכה', 'גולדברג', 'שבתאי', 'חזן', 'יעקבי', 'לנדסמן', 'שרעבי', 'קורנפלד', 'אבוקסיס', 'ליברמן'];
  // procedure, team, typical complications (index into MM_TYPES_)
  const OPS = [['כריתת קולון ימני', 'crc', [1, 2, 4, 0, 5]], ['כריתת סיגמה', 'crc', [1, 2, 0, 4]], ['LAR', 'crc', [1, 2, 0, 7]], ['ויפל', 'hpb', [2, 3, 1, 4]], ['כריתת כבד', 'hpb', [3, 2, 5]], ['כריתת כיס מרה', 'hpb', [8, 3, 0, 2]], ['שרוול', 'bar', [1, 3, 6]],
    ['מעקף קיבה RYGB', 'bar', [1, 3, 4]], ['כריתת תוספתן', 'trauma', [0, 2, 4]], ['לפרוטומיה דחופה', 'trauma', [0, 2, 5, 9, 10, 7]], ['בקע בצלקת', 'hrn', [0, 4, 11]], ['תירואידקטומי', 'end', [3, 11]], ['כריתת שד', 'brs', [0, 3]]];
  const lead = t => t === 'trauma' ? ['אשכנזי', 'וייס', 'דיין', 'רוטמן'] : BANK_TEAM_LEAD_[t] || ['וייס'];
  const DESC = { 0: 'אודם והפרשה מהפצע ביום 5, נפתח ליד המיטה', 1: 'חום וכאבי בטן ביום 4, CT הדגים דליפה', 2: 'הצטברות 6 ס״מ בבטן, ניקוז מלעורי', 3: 'ירידת המוגלובין עם יציבות המודינמית', 4: 'הקאות וגזים מעטים עד יום 7, זונדה', 5: 'חום, שיעול ותסנין בצילום חזה', 6: 'קוצר נשימה פתאומי, CTA הדגים תסחיף', 7: 'עליית קריאטינין אחרי ניתוח ארוך', 8: 'דליפת מרה מגדם הציסטיקוס, ERCP וסטנט', 9: 'הפרדה של הפאשיה ביום 8', 10: 'טרופונין עולה ושינויים ב־ECG', 11: 'צרידות חולפת' };
  const by = {}, mons = [];
  for (let i = 0; i < 95; i++) {
    const o = pick(OPS), t = pick(o[2]), d = add(today, -3 - Math.floor(rnd() * 88)), ev = add(d, 1 + Math.floor(rnd() * 8)); if (ev > today) continue;
    const g = t === 0 ? pick(['1', '1', '2', '3a']) : t === 1 ? pick(['3a', '3b', '3b', '4a']) : t === 2 ? pick(['3a', '3a', '2']) : t === 3 ? pick(['2', '2', '3b']) : t === 4 ? pick(['1', '2', '2']) : t === 6 || t === 10 ? pick(['2', '4a', '5']) : t === 8 ? '3a' : pick(['1', '2', '2', '3a', '4a']);
    const fem = o[1] === 'brs' || rnd() < .5, c = { id: 'm' + Utilities.getUuid().replace(/-/g, '').slice(0, 8), n: (fem ? pick(FF) : pick(FM)) + ' ' + pick(LN), age: 30 + Math.floor(rnd() * 55), sex: fem ? 'נ' : 'ז', d: d, ev: ev, proc: o[0], team: o[1], sur: id(pick(lead(o[1]))), res: pick(R).id,
      cd: g, type: MM_TYPES_[t], desc: DESC[t] || '', ret: g === '3b' || (g === '4a' && rnd() < .5), readm: rnd() < .25, mm: '', pres: '', st: 'open', lesson: '' };
    if (g >= '3a') { const m = mon(add(ev, 3)); c.mm = m; c.pres = c.res; if (m < today) { c.st = 'closed'; c.lesson = pick(['לשקול ניקוז שגרתי בניתוחים מהסוג הזה', 'סף נמוך ל־CT ביום 3 כשיש חום', 'לבדוק את פרוטוקול האנטיביוטיקה המניעתית', 'הקפדה על מניעת פקקת בחולים מרותקים', 'ERAS: להתחיל הזנה מוקדם יותר', 'דיון בבחירת המטופל לפני הניתוח']); } else c.st = 'review'; }
    else if (ev < add(today, -14)) c.st = 'closed';
    (by[ev.slice(0, 7)] = by[ev.slice(0, 7)] || []).push(c);
  }
  Object.keys(by).forEach(mo => set_('mm:' + mo, by[mo].sort((a, b) => a.ev.localeCompare(b.ev)), 'seed'));
  set_('mmseed', { at: new Date().toISOString() }, 'seed');
}
function ops_mmAll(code) {
  const u = me_(code); if (MM_SEE_.indexOf(u.role) < 0) throw new Error('אין הרשאה');
  mmSeed_();
  const today = todayIso_(), teams = BANK_TEAMS_.map(T => ({ id: T.id, t: T.t })).concat([{ id: 'trauma', t: 'טראומה ודחופים' }]);
  return { today: today, cd: MM_CD_, types: MM_TYPES_, teams: teams, cases: [].concat(...pathMonths_(today, 4).map(mo => get_('mm:' + mo) || [])) };
}
function ops_mmSave(code, c) {
  const u = me_(code); if (!canWrite_(u, 'mm')) throw new Error('אין הרשאה לשמור כאן');
  const ok = s => /^\d{4}-\d{2}-\d{2}$/.test(String(s || ''));
  if (!String(c.n || '').trim()) throw new Error('חסר שם'); if (!ok(c.d) || !ok(c.ev) || c.ev < c.d) throw new Error('תאריכים לא תקינים'); if (MM_CD_.indexOf(String(c.cd)) < 0) throw new Error('בחרו דרגה');
  const P = get_('people') || [], isP = (pid, r) => !pid || P.some(p => p.id === pid && p.role === r);
  if (!isP(c.sur, 'senior') || !isP(c.res, 'resident') || !isP(c.pres, 'resident')) throw new Error('בחירת רופא לא תקינה');
  const clean = { n: String(c.n).trim().slice(0, 60), age: Math.max(0, Math.min(120, +c.age || 0)), sex: c.sex === 'נ' ? 'נ' : 'ז', d: c.d, ev: c.ev, proc: String(c.proc || '').slice(0, 60), team: String(c.team || ''), sur: c.sur || '', res: c.res || '', cd: String(c.cd), type: String(c.type || 'אחר').slice(0, 40), desc: String(c.desc || '').slice(0, 300), ret: !!c.ret, readm: !!c.readm, mm: ok(c.mm) ? c.mm : '', pres: c.pres || '', st: ['open', 'review', 'closed'].indexOf(c.st) >= 0 ? c.st : 'open', lesson: String(c.lesson || '').slice(0, 300) };
  if (c.id) {
    const k0 = 'mm:' + String(c.ev0 || c.ev).slice(0, 7), L0 = get_(k0) || [], i = L0.findIndex(x => x.id === c.id); if (i < 0) throw new Error('הסיבוך לא נמצא');
    if (k0 === 'mm:' + c.ev.slice(0, 7)) { Object.assign(L0[i], clean); set_(k0, L0, u.name); return L0[i]; }
    L0.splice(i, 1); set_(k0, L0, u.name);
  }
  const k = 'mm:' + c.ev.slice(0, 7), L = get_(k) || [], n = Object.assign({ id: c.id || 'm' + Utilities.getUuid().replace(/-/g, '').slice(0, 8) }, clean); L.push(n); set_(k, L, u.name); return n;
}

/* ---------------- Pulse: the department at a glance ----------------
 * One pass over every module: a health score for each (0..100) and the alerts that need someone today, most urgent first.
 * Each alert: { lvl 3 red | 2 amber | 1 info, mod, t (the headline), s (detail), v (the screen that handles it) } */
const ORBIT_SEE_ = ['owner', 'director', 'deputy', 'chief', 'viewer'];
function ops_orbit(code) {
  const u = me_(code); if (ORBIT_SEE_.indexOf(u.role) < 0) throw new Error('אין הרשאה');
  const today = todayIso_(), days = (a, b) => Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 864e5), A = [], M = {};
  const P = (get_('people') || []).filter(p => p.active !== false), nm = id => { const p = P.find(x => x.id === id); return p ? p.name : ''; };
  const al = (lvl, mod, t, s, v) => A.push({ lvl: lvl, mod: mod, t: t, s: s || '', v: v }), n1 = (n, one, many) => n === 1 ? one : n + ' ' + many;
  const add = (d, n) => { const x = new Date(d + 'T12:00:00'); x.setDate(x.getDate() + n); return Utilities.formatDate(x, 'Asia/Jerusalem', 'yyyy-MM-dd'); };
  // the elective bank
  try {
    bankSeed_();
    const C = [].concat(...BANK_TEAMS_.map(T => (get_('bank:' + T.id) || []).map(c => Object.assign({ team: T.id, tt: T.t }, c)))), open = C.filter(c => !c.st), w = c => days(c.add, today);
    const over = open.filter(c => w(c) > BANK_WAIT_[c.pri]), p1 = over.filter(c => c.pri === 1), ready = open.filter(c => Object.keys(c.ready || {}).every(k => c.ready[k] !== 0)), tom = C.filter(c => c.st === 'sched' && c.sch && c.sch.d === add(today, 1));
    M.bank = { score: open.length ? Math.round((open.length - over.length) / open.length * 100) : 100, k: [[open.length, 'ממתינים'], [over.length, 'מעבר ליעד']] };
    if (p1.length) al(3, 'bank', `${n1(p1.length, 'מטופל/ת אחד/ת בעדיפות P1 עבר/ה', 'מטופלים בעדיפות P1 עברו')} את יעד ה־14 יום`, p1.slice(0, 3).map(c => `${c.n} (${c.tt}, ${w(c)} יום)`).join(' · '), 'bank');
    const worst = BANK_TEAMS_.map(T => ({ t: T.t, n: over.filter(c => c.team === T.id).length })).sort((a, b) => b.n - a.n)[0];
    if (over.length) al(2, 'bank', `${over.length} ממתינים מעבר ליעד ההמתנה`, worst && worst.n ? `הכי הרבה ב${worst.t}: ${worst.n}` : '', 'bank');
    if (ready.length) al(1, 'bank', `${n1(ready.length, 'מטופל/ת אחד/ת מוכן/ה לניתוח ועוד לא שובץ/ה', 'מטופלים מוכנים לניתוח ועוד לא שובצו')}`, 'כל ההכנות הושלמו', 'bank');
    if (tom.length) al(1, 'bank', `מחר ${n1(tom.length, 'ניתוח אחד', 'ניתוחים')} מהבנק בתוכנית`, tom.slice(0, 4).map(c => `${c.sch.room}: ${c.n}`).join(' · '), 'bank');
  } catch (e) {}
  // pathology
  try {
    pathSeed_();
    const C = [].concat(...pathMonths_(today, 4).map(mo => get_('path:' + mo) || []));
    const tell = C.filter(c => c.mal && c.rd && !c.told && days(c.rd, today) > PATH_TELL_), unread = C.filter(c => c.st === 'ready' && days(c.rd, today) > 3), late = C.filter(c => c.st === 'sent' && days(c.d, today) > PATH_TAT_), noB = C.filter(c => c.mal && !c.mdt && c.st !== 'closed');
    const done = C.filter(c => c.mal && c.told), inT = done.filter(c => days(c.rd, c.told.d) <= PATH_TELL_);
    M.path = { score: done.length ? Math.round(inT.length / done.length * 100) : 100, k: [[C.filter(c => c.st === 'sent').length, 'ממתינות'], [tell.length, 'ממאיר בלי עדכון']] };
    if (tell.length) al(3, 'path', `${n1(tell.length, 'תשובה ממאירה אחת', 'תשובות ממאירות')} בלי עדכון למטופל/ת מעל ${PATH_TELL_} ימים`, tell.slice(0, 3).map(c => `${c.n} · ד״ר ${nm(c.sur)}`).join(' · '), 'path');
    if (noB.length) al(2, 'path', `${n1(noB.length, 'תשובה ממאירה אחת', 'תשובות ממאירות')} בלי מועד לישיבה רב־תחומית`, '', 'path');
    if (unread.length) al(2, 'path', `${n1(unread.length, 'תשובה אחת לא נקראה', 'תשובות לא נקראו')} יותר מ־3 ימים`, '', 'path');
    if (late.length) al(1, 'path', `${n1(late.length, 'דגימה אחת מחכה', 'דגימות מחכות')} לתשובה יותר מ־${PATH_TAT_} יום`, 'לבדוק מול המכון', 'path');
  } catch (e) {}
  // complications and M&M
  try {
    mmSeed_();
    const C = [].concat(...pathMonths_(today, 4).map(mo => get_('mm:' + mo) || [])), maj = C.filter(c => c.cd >= '3a'), noM = maj.filter(c => !c.mm && c.st !== 'closed');
    let mon = add(today, 1); while (new Date(mon + 'T12:00:00').getDay() !== 1) mon = add(mon, 1);
    const ag = C.filter(c => c.mm === mon), noP = ag.filter(c => !c.pres), m30 = C.filter(c => days(c.ev, today) <= 30), d30 = m30.filter(c => c.cd === '5');
    M.mm = { score: maj.length ? Math.round(maj.filter(c => c.mm).length / maj.length * 100) : 100, k: [[m30.length, 'סיבוכים ב־30 יום'], [m30.filter(c => c.cd >= '3a').length, 'IIIa ומעלה']] };
    if (d30.length) al(3, 'mm', `${n1(d30.length, 'מקרה תמותה אחד', 'מקרי תמותה')} בחודש האחרון`, d30.map(c => `${c.proc} · ${c.type}`).join(' · '), 'mm');
    if (noM.length) al(2, 'mm', `${n1(noM.length, 'סיבוך אחד', 'סיבוכים')} מדרגה IIIa ומעלה בלי מועד להצגה ב־M&M`, '', 'mm');
    if (ag.length) al(noP.length ? 2 : 1, 'mm', `M&M ביום שני ${+mon.slice(8)}/${+mon.slice(5, 7)}: ${ag.length} מקרים`, noP.length ? `${noP.length} עוד בלי מציג/ה` : ag.slice(0, 3).map(c => `${c.proc} (ד״ר ${nm(c.pres)})`).join(' · '), 'mm');
  } catch (e) {}
  // externs and the admissions committee
  try {
    const D = extSeed_(), X = P.filter(p => p.role === 'extern'), end = X.filter(p => { const r = D.rec[p.id]; return r && r.to && days(today, r.to) <= 14 && days(today, r.to) >= -7; }), miss = X.filter(p => { const r = D.rec[p.id]; return r && EXT_DOCS_.some(d => !r.docs[d[0]]); });
    const nx = D.meets.filter(x => !x.done && x.d >= today).sort((a, b) => a.d.localeCompare(b.d))[0], old = D.apps.filter(a => a.stage === 'new' && days(a.add, today) > 14);
    M.ext = { score: X.length ? Math.round((X.length - miss.length) / X.length * 100) : 100, k: [[X.length, 'תורני חוץ'], [miss.length, 'מסמכים חסרים']] };
    if (end.length) al(2, 'ext', `${n1(end.length, 'חוזה של תורן/ית חוץ מסתיים', 'חוזים של תורני חוץ מסתיימים')} בשבועיים הקרובים`, end.map(p => `ד״ר ${p.name} (${+D.rec[p.id].to.slice(8)}/${+D.rec[p.id].to.slice(5, 7)})`).join(' · '), 'ext');
    if (miss.length) al(1, 'ext', `${n1(miss.length, 'לתורן/ית חוץ אחד/ת', 'ל־' + miss.length + ' תורני חוץ').replace(/^\d+ /, '')} חסרים מסמכים`, 'רישיון, ביטוח, הדרכות או חוזה', 'ext');
    if (nx && days(today, nx.d) <= 14) al(1, 'ext', `ועדת קבלה ב־${+nx.d.slice(8)}/${+nx.d.slice(5, 7)} · ${nx.apps.length} מועמדים`, nx.apps.map(id => (D.apps.find(a => a.id === id) || {}).n).filter(Boolean).slice(0, 4).join(' · '), 'ext');
    if (old.length) al(1, 'ext', `${n1(old.length, 'בקשה אחת להתמחות מחכה', 'בקשות להתמחות מחכות')} לראיון יותר משבועיים`, '', 'ext');
  } catch (e) {}
  // residents: pace against the targets and the approvals still waiting
  try {
    portSeed_();
    const R = P.filter(p => p.role === 'resident'), tgt = LOG_CAT_.reduce((s, g) => s + g.n, 0); let slow = [], stale = 0;
    R.forEach(r => { const port = get_('port:' + r.id) || {}, L = logAll_(r.id, port, today), mi = Math.max(0, monDiff_(String(port.start || today).slice(0, 7), today.slice(0, 7))), exp = Math.round(tgt * Math.pow(Math.min(72, mi + 1) / 72, 1.35)), s = L.filter(x => x[7] !== 2 && x[3] !== 'A').length; if (exp && s / exp < .7) slow.push(r.name); stale += L.filter(x => x[7] === 0 && days(x[1], today) > 21).length; });
    M.port = { score: R.length ? Math.round((R.length - slow.length) / R.length * 100) : 100, k: [[R.length, 'מתמחים'], [slow.length, 'מתחת לקצב']] };
    if (slow.length) al(2, 'port', `${n1(slow.length, 'מתמחה אחד/ת', 'מתמחים')} מתחת ל־70% מקצב הניתוחים הצפוי`, slow.slice(0, 5).map(n => 'ד״ר ' + n).join(' · '), 'port');
    if (stale) al(1, 'port', `${n1(stale, 'ניתוח אחד בלוג מחכה', 'ניתוחים בלוג מחכים')} לאישור בכיר/ה יותר משלושה שבועות`, '', 'port');
  } catch (e) {}
  // mentoring: residents who have not met their mentor for too long
  try {
    mentorSeed_();
    const R = P.filter(p => p.role === 'resident'), Mt = (get_('mentor') || { meets: [] }).meets, last = id => Mt.filter(x => x.pid === id).reduce((a, x) => x.d > a ? x.d : a, ''), lateM = R.filter(r => { const l = last(r.id); return !l || days(l, today) > MENTOR_GAP_; });
    M.mentor = { score: R.length ? Math.round((R.length - lateM.length) / R.length * 100) : 100, k: [[R.length, 'חניכים'], [lateM.length, `בלי פגישה ${MENTOR_GAP_}+ יום`]] };
    if (lateM.length) al(2, 'mentor', `${n1(lateM.length, 'מתמחה אחד/ת לא נפגש/ה', 'מתמחים לא נפגשו')} עם החונך/ת יותר מ־${MENTOR_GAP_} יום`, lateM.slice(0, 5).map(r => 'ד״ר ' + r.name).join(' · '), 'mentor');
  } catch (e) {}
  // Nest: what the patients reported and asked, and what waits before they can see it
  try {
    lumenSeed_();
    const L = lumenIds_().map(id => get_('lumen:' + id)).filter(Boolean), inn = L.filter(p => p.st === 'in'), wq = [].concat(...L.filter(p => p.st !== 'out').map(p => p.qs.filter(q => !q.a))), pend = [].concat(...L.map(p => p.feed.filter(f => f.st === 'pending')));
    const hi = inn.filter(p => { const l = p.pain[p.pain.length - 1]; return l && l[1] >= 7 && l[0].slice(0, 10) >= add(today, -1); }), op = inn.length ? Math.round(inn.filter(p => p.opens.indexOf(today) >= 0).length / inn.length * 100) : 100;
    M.lumen = { score: op, k: [[inn.length, 'מאושפזים מחוברים'], [wq.length, 'שאלות מחכות']] };
    if (hi.length) al(3, 'lumen', `${n1(hi.length, 'מטופל/ת אחד/ת דיווח/ה', hi.length + ' מטופלים דיווחו').replace(/^\d+ (\d+)/, '$1')} ב־Nest על כאב 7 ומעלה`, hi.map(p => p.n + (p.room ? ' · ' + p.room : '')).join(' · '), 'lumen');
    if (wq.length) al(2, 'lumen', `${n1(wq.length, 'שאלה אחת של מטופל/ת מחכה', 'שאלות של מטופלים מחכות')} לתשובה`, '', 'lumen');
    if (pend.length) al(1, 'lumen', `${n1(pend.length, 'עדכון אחד מחכה', 'עדכונים מחכים')} לאישור בכיר/ה לפני שהמטופל/ת יראה`, '', 'lumen');
  } catch (e) {}
  // Ward: the tasks of the current shift that are still open, and handover notes
  try {
    const hr = +Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'H'), sh = hr >= 7 && hr < 15 ? 'm' : hr >= 15 && hr < 23 ? 'e' : 'n', W = ops_wardAll(code), done = W.st.t[sh] || {};
    const all = [].concat(...W.pts.map(p => p.tasks[sh].map(t => ({ p: p, t: t })))), open = all.filter(x => (done[x.p.id] || []).indexOf(x.t.id) < 0), urgent = open.filter(x => x.t.lvl === 2);
    const inn = W.pts.filter(p => p.st === 'in'), calm = inn.filter(p => !urgent.some(x => x.p.id === p.id));
    M.ward = { score: inn.length ? Math.round(calm.length / inn.length * 100) : 100, k: [[inn.length, 'במחלקה'], [urgent.length, 'מטלות דחופות פתוחות']] };
    if (urgent.length) al(2, 'ward', `${n1(urgent.length, 'מטלה דחופה אחת פתוחה', 'מטלות דחופות פתוחות')} בסיעוד במשמרת הזו`, urgent.slice(0, 3).map(x => x.p.n + (x.p.room ? ' · ' + x.p.room : '')).join(' · '), 'ward');
  } catch (e) {}
  A.forEach(a => { if (a.mod === 'lumen' && a.lvl === 3) a.v = 'ward'; });
  A.sort((a, b) => b.lvl - a.lvl);
  return { today: today, me: u.name, role: u.role, mods: M, alerts: A };
}

/* ---------------- mentoring and teaching ----------------
 * Each resident's mentor is port:<pid>.mentor. mentor (one key): { meets: [{ id, pid, by, d, kind, mood 1..5, notes, goals [text], next }] }
 * teachatt:<yyyy-mm>: { <curriculum item id>: { att: [pid], r: [1..5] } } who came to each session of the curriculum and how they rated it.
 * A mentor meets each mentee at least every MENTOR_GAP_ days. */
WRITE.mentor = ['owner', 'director', 'chief'];
WRITE.teachatt = ['owner', 'director', 'chief', 'deputy'];
const MENTOR_SEE_ = ['owner', 'director', 'chief', 'deputy', 'viewer'];
const MENTOR_GAP_ = 60, MENTOR_KINDS_ = ['שיחת חונכות', 'משוב חצי־שנתי', 'שיחת קריירה', 'שיחה אחרי אירוע'];
function mentorSeed_() {
  if (get_('mentorseed')) return;
  portSeed_();
  const P = (get_('people') || []).filter(p => p.active !== false), R = P.filter(p => p.role === 'resident'), S = P.filter(p => p.role === 'senior'); if (!R.length || !S.length) return;
  const today = todayIso_(); let seed = 5151; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, pick = a => a[Math.floor(rnd() * a.length)];
  const add = (d, n) => { const x = new Date(d + 'T12:00:00'); x.setDate(x.getDate() + n); return Utilities.formatDate(x, 'Asia/Jerusalem', 'yyyy-MM-dd'); };
  const NOTES = ['מרגיש/ה בטוח/ה יותר בתורנויות המיון', 'רוצה יותר זמן בחדר עם צוות HPB', 'עומס בבית, לשקול הקלה בתורנויות בחודש הבא', 'מתלבט/ת לגבי השתלמות עמיתים בחו״ל', 'התקדמות יפה בלפרוסקופיה', 'צריך/ה עזרה בכתיבת המאמר', 'מתכונן/ת לשלב א׳, ביקש/ה ימי לימוד', 'משוב טוב מהאחיות על העבודה במחלקה'];
  const GOALS = ['להציג מקרה בישיבת הבוקר', 'עשר כולציסטקטומיות כמנתח/ת', 'להגיש תקציר לכנס', 'להשלים קורס ATLS', 'להוביל את הצוות במיון בלילה', 'לסיים את איסוף הנתונים למחקר', 'קריאה שבועית של מאמר אחד'];
  const meets = [];
  R.forEach((r, i) => {
    const port = get_('port:' + r.id) || {}, by = port.mentor || S[i % S.length].id, gap = i % 6 === 5 ? 95 : 28 + Math.floor(rnd() * 40); let d = add(today, -(i % 6 === 5 ? 95 : Math.floor(rnd() * 50)));
    for (let k = 0; k < 4 && d > add(today, -400); k++) { meets.push({ id: 'g' + Utilities.getUuid().replace(/-/g, '').slice(0, 8), pid: r.id, by: by, d: d, kind: k % 3 === 2 ? MENTOR_KINDS_[1] : k === 3 ? MENTOR_KINDS_[2] : MENTOR_KINDS_[0], mood: 3 + Math.floor(rnd() * 3), notes: pick(NOTES), goals: [pick(GOALS), pick(GOALS)].filter((x, j, a) => a.indexOf(x) === j), next: k ? '' : add(d, 45) }); d = add(d, -gap - Math.floor(rnd() * 30)); }
  });
  set_('mentor', { meets: meets }, 'seed');
  // the curriculum of last, this and next month (when nobody built one yet), with attendance for the sessions that already happened
  const TOP = [['lec', 'ניהול דלקת תוספתן אצל הרה'], ['jc', 'ERAS בניתוחי מעי: מטא־אנליזה'], ['case', 'פנקראטיטיס נמקית'], ['mm', 'סיבוכי החודש'], ['sem', 'גישה לטראומה חודרת'], ['sim', 'אנסטומוזה במעי: סדנת סימולציה'], ['lec', 'בקע מפשעתי: TEP מול TAPP'], ['jc', 'ניהול שמרני של דיברטיקוליטיס'], ['case', 'חסימת מעי דק בבטן מנותחת'], ['lec', 'סרטן רקטום: טיפול טוטאלי ניאו־אדג׳ובנטי'], ['sem', 'אולטרסאונד ליד המיטה'], ['case', 'דימום ממערכת העיכול העליונה'], ['lec', 'בריאטריה: סיבוכים מאוחרים'], ['jc', 'כולציסטקטומיה מוקדמת בדלקת חריפה'], ['sim', 'פיום קנה וגישה לדרכי אוויר']];
  const lead = S.filter(p => p.title !== 'מנהל המערך');
  let t = 0;
  [-1, 0, 1].forEach(off => {
    const mo = monAdd_(today.slice(0, 7), off), k = 'curr:' + mo, C = get_(k); if (C && (C.items || []).length) return;
    const items = [], att = {};
    for (let dd = 1; dd <= 31; dd++) {
      const d = mo + '-' + String(dd).padStart(2, '0'), x = new Date(d + 'T12:00:00'); if (x.getMonth() + 1 !== +mo.slice(5)) break;
      if ([2, 4].indexOf(x.getDay()) < 0) continue;
      const tp = TOP[t++ % TOP.length], it = { id: 'c' + Utilities.getUuid().replace(/-/g, '').slice(0, 8), d: d, time: '07:00', type: tp[0], title: tp[1], sen: pick(lead).id, res: pick(R).id };
      items.push(it);
      if (d < today) { const a = R.filter(() => rnd() < .78).map(p => p.id); if (a.indexOf(it.res) < 0) a.push(it.res); att[it.id] = { att: a, r: a.slice(0, Math.max(3, Math.floor(a.length * .6))).map(() => 3 + Math.floor(rnd() * 2.6)) }; }
    }
    set_(k, { items: items, apDep: { by: 'סגנית מנהל המערך', at: new Date().toISOString() }, apChief: { by: 'צ׳יף המתמחים', at: new Date().toISOString() } }, 'seed');
    if (Object.keys(att).length) set_('teachatt:' + mo, att, 'seed');
  });
  set_('mentorseed', { at: new Date().toISOString() }, 'seed');
}
function ops_mentorAll(code) {
  const u = me_(code); if (MENTOR_SEE_.indexOf(u.role) < 0) throw new Error('אין הרשאה');
  mentorSeed_();
  const today = todayIso_(), R = (get_('people') || []).filter(p => p.active !== false && p.role === 'resident');
  const months = [-2, -1, 0].map(k => monAdd_(today.slice(0, 7), k)), teach = months.map(mo => { const C = get_('curr:' + mo) || {}; return { mo: mo, items: C.apDep && C.apChief ? C.items || [] : [], att: get_('teachatt:' + mo) || {} }; });
  return { today: today, gap: MENTOR_GAP_, kinds: MENTOR_KINDS_, pairs: R.map(p => ({ pid: p.id, by: (get_('port:' + p.id) || {}).mentor || '' })), meets: (get_('mentor') || { meets: [] }).meets, teach: teach };
}
function ops_mentorMeet(code, m) {
  const u = me_(code); if (!canWrite_(u, 'mentor')) throw new Error('אין הרשאה לשמור כאן');
  const P = get_('people') || []; if (!P.some(p => p.id === m.pid && p.role === 'resident')) throw new Error('המתמחה לא נמצא'); if (!P.some(p => p.id === m.by && p.role === 'senior')) throw new Error('בחרו חונך/ת');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(m.d || '')) || m.d > todayIso_()) throw new Error('תאריך לא תקין');
  const D = get_('mentor') || { meets: [] }, x = { id: m.id || 'g' + Utilities.getUuid().replace(/-/g, '').slice(0, 8), pid: m.pid, by: m.by, d: m.d, kind: MENTOR_KINDS_.indexOf(m.kind) >= 0 ? m.kind : MENTOR_KINDS_[0], mood: Math.max(1, Math.min(5, +m.mood || 3)), notes: String(m.notes || '').slice(0, 400), goals: (m.goals || []).map(g => String(g).slice(0, 120)).filter(Boolean).slice(0, 6), next: /^\d{4}-\d{2}-\d{2}$/.test(String(m.next || '')) ? m.next : '' };
  const i = D.meets.findIndex(q => q.id === x.id); if (i >= 0) D.meets[i] = x; else D.meets.push(x);
  set_('mentor', D, u.name); return x;
}
function ops_mentorSet(code, pid, by) {
  const u = me_(code); if (!canWrite_(u, 'mentor')) throw new Error('אין הרשאה');
  if (!(get_('people') || []).some(p => p.id === by && p.role === 'senior')) throw new Error('בחרו חונך/ת');
  const k = 'port:' + pid, port = get_(k); if (!port) throw new Error('למתמחה אין עדיין תיק'); port.mentor = by; set_(k, port, u.name); return { ok: true };
}
function ops_teachAtt(code, mo, id, att) {
  const u = me_(code); if (!canWrite_(u, 'teachatt')) throw new Error('אין הרשאה');
  if (!/^\d{4}-\d{2}$/.test(String(mo))) throw new Error('חודש לא תקין');
  const k = 'teachatt:' + mo, A = get_(k) || {}, ids = new Set((get_('people') || []).filter(p => p.role === 'resident').map(p => p.id));
  A[id] = { att: (att || []).filter(x => ids.has(x)), r: (A[id] || {}).r || [] }; set_(k, A, u.name); return A[id];
}
// Pulse in the personal app: what is waiting for this doctor today, from every module. Each item { ic, t, s, tab (a tab of the app), lvl }
function ops_orbitMe(token) {
  const me = personByToken_(token), today = todayIso_(), out = [], days = (a, b) => Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 864e5);
  const P = (get_('people') || []).filter(p => p.active !== false), nm = id => { const p = P.find(x => x.id === id); return p ? p.name : ''; };
  const it = (lvl, ic, t, s, tab) => out.push({ lvl: lvl, ic: ic, t: t, s: s || '', tab: tab || '' });
  const add = (d, n) => { const x = new Date(d + 'T12:00:00'); x.setDate(x.getDate() + n); return Utilities.formatDate(x, 'Asia/Jerusalem', 'yyyy-MM-dd'); };
  let mon = add(today, 1); while (new Date(mon + 'T12:00:00').getDay() !== 1) mon = add(mon, 1);
  const dmy = d => +d.slice(8) + '/' + +d.slice(5, 7), n1 = (n, one, many) => n === 1 ? one : n + ' ' + many;
  try {
    if (me.role === 'senior') {
      const ph = ops_pathMe(token), mal = ph.cases.filter(c => c.mal && !c.told);
      if (mal.length) it(3, '🧫', `${n1(mal.length, 'תשובה ממאירה מחכה', 'תשובות ממאירות מחכות')} שתעדכן/י את המטופל/ת`, mal.slice(0, 2).map(c => c.n).join(' · '), 'log');
      else if (ph.cases.length) it(2, '🧫', `${n1(ph.cases.length, 'תשובת פתולוגיה חדשה', 'תשובות פתולוגיה')} של המטופלים שלך`, '', 'log');
      const lg = ops_logMe(token); if ((lg.pending || []).length) it(2, '✍️', `${n1(lg.pending.length, 'ניתוח של מתמחה מחכה', 'ניתוחים של מתמחים מחכים')} לאישור שלך`, [...new Set(lg.pending.map(x => x.name))].slice(0, 3).join(' · '), 'log');
      mentorSeed_(); const Mt = (get_('mentor') || { meets: [] }).meets, mine = P.filter(r => r.role === 'resident' && ((get_('port:' + r.id) || {}).mentor === me.id));
      const lateM = mine.filter(r => { const l = Mt.filter(x => x.pid === r.id).reduce((a, x) => x.d > a ? x.d : a, ''); return !l || days(l, today) > MENTOR_GAP_; });
      if (lateM.length) it(2, '🤝', `לא נפגשת עם ${lateM.length === 1 ? 'החניך/ה' : lateM.length + ' חניכים'} יותר מחודשיים`, lateM.map(r => 'ד״ר ' + r.name).join(' · '), '');
      else if (mine.length) it(1, '🤝', `${mine.length} חניכים, כולם נפגשו איתך בחודשיים האחרונים`, '', '');
      mmSeed_(); const mm = [].concat(...pathMonths_(today, 2).map(mo => get_('mm:' + mo) || [])).filter(c => c.sur === me.id && c.mm === mon);
      if (mm.length) it(2, '📉', `ב־M&M ביום שני ${dmy(mon)} יוצג${mm.length > 1 ? 'ו ' + mm.length + ' מקרים' : ' מקרה'} שלך`, mm.map(c => `${c.proc} · ${c.type}`).join(' · '), '');
      lumenSeed_(); const lq = lumenIds_().map(id => get_('lumen:' + id)).filter(p => p && p.sur === me.id && p.st !== 'out'), lw = [].concat(...lq.map(p => p.qs.filter(q => !q.a).map(q => p.n)));
      if (lw.length) it(2, '💬', `${n1(lw.length, 'שאלה אחת מחכה', 'שאלות מחכות')} מהמטופלים שלך ב־Nest`, [...new Set(lw)].slice(0, 3).join(' · '), '');
      bankSeed_(); const bk = [].concat(...BANK_TEAMS_.map(T => (get_('bank:' + T.id) || []).map(c => Object.assign({ tp: T.p }, c)))).filter(c => c.sur === me.id), wk = bk.filter(c => c.st === 'sched' && c.sch && c.sch.d >= today && c.sch.d <= add(today, 7)), ov = bk.filter(c => !c.st && days(c.add, today) > BANK_WAIT_[c.pri]);
      if (wk.length) it(1, '🗓️', `השבוע ${n1(wk.length, 'ניתוח אחד שלך', 'ניתוחים שלך')} מהבנק`, wk.slice(0, 3).map(c => `${dmy(c.sch.d)} ${(c.tp.find(x => x[0] === c.code) || [])[1] || ''}`).join(' · '), 'week');
      if (ov.length) it(2, '⏳', `${n1(ov.length, 'מטופל/ת אחד/ת שלך', ov.length + ' מהמטופלים שלך').replace(/^\d+ (\d+)/, '$1')} בבנק ${ov.length === 1 ? 'עבר/ה' : 'עברו'} את יעד ההמתנה`, '', '');
    }
    if (me.role === 'resident' || me.role === 'house') {
      mmSeed_(); const mm = [].concat(...pathMonths_(today, 3).map(mo => get_('mm:' + mo) || [])).filter(c => c.pres === me.id && c.mm >= today).sort((a, b) => a.mm.localeCompare(b.mm));
      if (mm.length) it(3, '📉', `את/ה מציג/ה ב־M&M ביום שני ${dmy(mm[0].mm)}`, mm.map(c => `${c.proc} · ${c.type} (ד״ר ${nm(c.sur)})`).join(' · '), '');
      const C = [0, 1].map(k => get_('curr:' + monAdd_(today.slice(0, 7), k)) || {}), lec = [].concat(...C.map(c => c.apDep && c.apChief ? c.items || [] : [])).filter(x => x.res === me.id && x.d >= today).sort((a, b) => a.d.localeCompare(b.d))[0];
      if (lec) it(days(today, lec.d) <= 7 ? 2 : 1, '🎓', `את/ה מציג/ה בישיבת הלימודים ב־${dmy(lec.d)}`, `${lec.title} · עם ד״ר ${nm(lec.sen)}`, 'week');
      const lg = ops_logMe(token), pend = (lg.log || []).filter(x => x[7] === 0).length, back = (lg.log || []).filter(x => x[7] === 2 && days(x[1], today) <= 60).length;
      if (back) it(2, '↩️', `${n1(back, 'ניתוח אחד הוחזר', 'ניתוחים הוחזרו')} אליך מהבכיר/ה`, 'לתקן ולשלוח שוב', 'log');
      if (pend) it(1, '✍️', `${n1(pend, 'ניתוח אחד בלוג מחכה', 'ניתוחים בלוג מחכים')} לאישור בכיר/ה`, '', 'log');
      mentorSeed_(); const port = get_('port:' + me.id) || {}, Mt = (get_('mentor') || { meets: [] }).meets.filter(x => x.pid === me.id).sort((a, b) => b.d.localeCompare(a.d))[0];
      if (port.mentor) it(Mt && Mt.next && Mt.next <= add(today, 7) ? 2 : 1, '🤝', Mt && Mt.next && Mt.next >= today ? `פגישה עם החונך/ת ב־${dmy(Mt.next)}` : `החונך/ת שלך: ד״ר ${nm(port.mentor)}`, Mt ? `הפגישה האחרונה ${dmy(Mt.d)}${(Mt.goals || []).length ? ' · יעד: ' + Mt.goals[0] : ''}` : 'עוד לא נפגשתם', '');
      const ex = (port.exams || []).find(x => x.st === 'נרשם/ה'); if (ex) it(1, '📝', `נרשמת ל${ex.t}`, `${+ex.m.slice(5, 7)}/${ex.m.slice(0, 4)}`, '');
    }
    if (me.role === 'extern') {
      const D = extSeed_(), r = D.rec[me.id]; if (r) { const left = r.to ? days(today, r.to) : 999, miss = EXT_DOCS_.filter(d => !r.docs[d[0]]).map(d => d[1]);
        if (left <= 30 && left >= 0) it(2, '📄', `החוזה שלך מסתיים בעוד ${left} ימים`, `עד ${dmy(r.to)}`, '');
        if (miss.length) it(2, '📎', `חסרים מסמכים: ${miss.join(', ')}`, 'להעביר למזכירות', '');
        const a = D.apps.find(x => x.pid === me.id); if (a) { const mt = a.meet && D.meets.find(x => x.id === a.meet); it(1, '🎯', a.dec ? `החלטת ועדת הקבלה: ${(EXT_STAGES_.find(s => s[0] === a.dec.st) || [])[1]}` : mt ? `הבקשה שלך להתמחות בוועדה ב־${dmy(mt.d)}` : 'הבקשה שלך להתמחות בטיפול', '', ''); } }
    }
  } catch (e) {}
  out.sort((a, b) => b.lvl - a.lvl);
  return { items: out };
}

/* ---------------- Nest: the patient's companion through the admission ----------------
 * Every admitted patient (from the ER, for an operation, or before an elective operation from the bank) gets a personal link
 * to a simple, beautiful page: what they have, the plan, where they are on the way, updates from the ward round, a question
 * to the team, what helps recovery, going home. The team decides what is shared and when (LUMEN_SHARE_ and the policy).
 * lumen:<id> one patient's journey; lumenix: the list of ids; lumenpol: the department's sharing policy.
 * All the medical text here is general patient education, written for the demo. */
WRITE.lumen = ['owner', 'director', 'deputy', 'chief', 'secretary'];
WRITE.lumenpol = ['owner', 'director'];
const LUMEN_SEE_ = ['owner', 'director', 'deputy', 'chief', 'secretary', 'viewer'];
// what can be shared, and the default mode: auto (as soon as it is written), approve (a senior approves first),
// told (only after a doctor told the patient in person), off (never through the link)
const LUMEN_SHARE_ = [['dx', 'האבחנה והסבר עליה', 'auto'], ['plan', 'תוכנית הטיפול והאפשרויות', 'auto'], ['team', 'הצוות המטפל', 'auto'], ['round', 'סיכום הביקור', 'approve'], ['img', 'תוצאות הדמיה במילים פשוטות', 'approve'], ['labs', 'בדיקות דם', 'off'], ['path', 'תשובת פתולוגיה', 'told'], ['dc', 'השחרור, ההנחיות והמכתב', 'auto']];
const LUMEN_MODES_ = { auto: 'אוטומטי', approve: 'באישור בכיר', told: 'רק אחרי שיחה', off: 'לא משותף' };
const LUMEN_CHK_ = ['הליכה במסדרון, 3 פעמים ביום', 'תרגילי נשימה עם המנשף, 10 פעמים בשעה', 'לשבת בכיסא בזמן הארוחות', 'לשתות לפי ההנחיות של הצוות'];
const LUMEN_COND_ = {
  chole: { t: 'דלקת בכיס המרה', med: 'Acute cholecystitis', art: 'liver', path: ['קבלה במיון', 'בירור ואבחנה', 'ניתוח', 'התאוששות', 'הביתה'], stay: '2 עד 4 ימים',
    what: 'כיס המרה הוא שקיק קטן מתחת לכבד, שאוגר מרה. המרה עוזרת לגוף לעכל שומן. כשאבן חוסמת את היציאה מכיס המרה, הוא מתנפח ומודלק. זה מה שגורם לכאב בצד ימין למעלה, ולפעמים לחום ולבחילה.',
    why: 'רוב הדלקות נגרמות מאבני מרה. אבני מרה שכיחות מאוד, בעיקר אחרי גיל 40, ואינן נגרמות ממשהו שעשית לא נכון.',
    plan: ['נוזלים ואנטיביוטיקה דרך הווריד', 'טיפול בכאב לפי הצורך', 'בדרך כלל ניתוח לפרוסקופי, דרך חתכים קטנים, להוצאת כיס המרה'],
    opts: [['ניתוח באשפוז הזה', 'מונע התקף נוסף. רוב המטופלים חוזרים הביתה יום או יומיים אחרי הניתוח.'], ['אנטיביוטיקה עכשיו וניתוח מתוכנן בעוד כמה שבועות', 'מתאים כשהדלקת קשה, או כשיש סיבה לדחות את הניתוח.'], ['ניקוז דרך העור', 'למי שלא יכול לעבור ניתוח כרגע.']],
    home: ['ללכת ולחזור לפעילות קלה כבר מהיום הראשון', 'לא להרים משקל של יותר מ־5 ק״ג במשך שבועיים', 'אוכל רגיל. בשבוע הראשון עדיף פחות שומן', 'מקלחת מותרת אחרי יומיים'],
    red: ['חום מעל 38', 'כאב בטן שהולך ומחמיר', 'הצהבה של העור או של העיניים', 'אודם, נפיחות או הפרשה מהחתכים'],
    faq: [['אפשר לחיות בלי כיס מרה?', 'כן. הכבד ממשיך לייצר מרה, והיא זורמת ישר למעי. רוב האנשים לא מרגישים שום הבדל.'], ['למה אני בצום?', 'כדי שאם נחליט על ניתוח או בדיקה, הקיבה תהיה ריקה וההרדמה תהיה בטוחה.']] },
  appy: { t: 'דלקת התוספתן', med: 'Acute appendicitis', art: 'bowel', path: ['קבלה במיון', 'אבחנה', 'ניתוח', 'התאוששות', 'הביתה'], stay: '1 עד 3 ימים',
    what: 'התוספתן הוא שלוחה קטנה וצרה של המעי הגס, בצד ימין למטה של הבטן. כשהפתח שלו נחסם, הוא מתנפח ומודלק. הכאב מתחיל לעתים קרובות סביב הטבור ועובר לצד ימין למטה.',
    why: 'זו אחת הסיבות השכיחות ביותר לניתוח דחוף, בכל הגילים. ברוב המקרים לא ידוע מה גרם לחסימה.',
    plan: ['אנטיביוטיקה דרך הווריד', 'ניתוח לפרוסקופי להוצאת התוספתן, בדרך כלל באותו יום', 'הליכה ואכילה כבר מהיום שאחרי הניתוח'],
    opts: [['ניתוח לפרוסקופי', 'הטיפול המקובל. חתכים קטנים והחלמה מהירה.'], ['טיפול באנטיביוטיקה בלבד', 'אפשרי במקרים נבחרים. יש סיכוי שהדלקת תחזור.']],
    home: ['פעילות קלה כבר מהיום הראשון', 'בלי ספורט מאומץ והרמת משקל שבועיים', 'אוכל רגיל', 'את התפרים, אם יש, מוציאים אצל רופא המשפחה אחרי 10 ימים'],
    red: ['חום מעל 38', 'כאב שמחמיר במקום להשתפר', 'הקאות', 'אודם או הפרשה מהחתכים'],
    faq: [['צריך את התוספתן?', 'לא. אפשר לחיות בלי תוספתן בלי שום הבדל.'], ['מתי אפשר לחזור לעבודה?', 'בעבודה משרדית, בדרך כלל אחרי שבוע. בעבודה פיזית, אחרי שבועיים עד שלושה.']] },
  divert: { t: 'דלקת סעיפים במעי הגס', med: 'Diverticulitis', art: 'bowel', path: ['קבלה', 'בירור ואבחנה', 'טיפול', 'שיפור', 'הביתה'], stay: '3 עד 5 ימים',
    what: 'עם השנים נוצרים בדופן המעי הגס כיסים קטנים, שנקראים סעיפים. כשאחד מהם מודלק, מופיעים כאב בבטן, בדרך כלל בצד שמאל למטה, ולפעמים חום.',
    why: 'סעיפים שכיחים מאוד אחרי גיל 50. תזונה דלה בסיבים ועצירות מגבירים את הסיכון.',
    plan: ['אנטיביוטיקה', 'מנוחה למעי: בהתחלה נוזלים, ואחר כך מזון רך', 'מעקב אחרי הכאב והחום. רוב המטופלים משתפרים בלי ניתוח'],
    opts: [['טיפול תרופתי', 'מתאים לרוב המטופלים.'], ['ניקוז מורסה דרך העור', 'אם נוצרה מורסה קטנה.'], ['ניתוח', 'רק כשיש סיבוך, או אחרי דלקות חוזרות.']],
    home: ['להמשיך את האנטיביוטיקה עד הסוף', 'לחזור בהדרגה לתזונה עשירה בסיבים', 'לשתות הרבה', 'קולונוסקופיה בעוד 6 עד 8 שבועות, לפי ההפניה'],
    red: ['חום מעל 38', 'כאב שמחמיר', 'דם ביציאות', 'הקאות או חוסר יכולת לשתות'],
    faq: [['זה יחזור?', 'אצל רוב האנשים לא. תזונה עשירה בסיבים ושתייה מרובה מורידות את הסיכון.']] },
  sbo: { t: 'חסימה במעי הדק', med: 'Small bowel obstruction', art: 'bowel', path: ['קבלה', 'בירור', 'טיפול', 'שיפור', 'הביתה'], stay: '3 עד 6 ימים',
    what: 'המעי הדק הוא צינור ארוך שבו המזון מתעכל. כשיש בו חסימה, הנוזלים והגזים לא עוברים הלאה, ולכן הבטן נפוחה, כואבת ויש הקאות.',
    why: 'הסיבה השכיחה היא הידבקויות, רקמה שנוצרת אחרי ניתוחי בטן קודמים. לפעמים הסיבה היא בקע.',
    plan: ['צום ונוזלים דרך הווריד', 'זונדה, צינור דק מהאף לקיבה, כדי להוריד לחץ מהמעי', 'בדיקת חומר ניגוד שמראה אם החסימה נפתחת. רוב החסימות נפתחות בלי ניתוח'],
    opts: [['טיפול שמרני', 'מצליח ברוב המקרים תוך כמה ימים.'], ['ניתוח', 'אם החסימה לא נפתחת, או אם יש סימנים לפגיעה במעי.']],
    home: ['לחזור לאכילה בהדרגה, ארוחות קטנות', 'ללכת הרבה', 'לשים לב ליציאות ולגזים'],
    red: ['הקאות', 'בטן נפוחה', 'אין גזים או יציאות', 'כאב שמחמיר'],
    faq: [['למה צריך את הצינור באף?', 'הוא מוריד את הנוזלים שמצטברים מעל החסימה. זה מקל על הבחילה ונותן למעי לנוח.']] },
  panc: { t: 'דלקת חריפה של הלבלב', med: 'Acute pancreatitis', art: 'organs', path: ['קבלה', 'אבחנה', 'טיפול', 'שיפור', 'הביתה'], stay: '4 עד 7 ימים',
    what: 'הלבלב הוא בלוטה מאחורי הקיבה. הוא מייצר אנזימים לעיכול והורמונים כמו אינסולין. בדלקת שלו יש כאב חזק במרכז הבטן, שקורן לגב, ובחילה.',
    why: 'הסיבות השכיחות הן אבני מרה ושתיית אלכוהול. לפעמים לא נמצאת סיבה.',
    plan: ['הרבה נוזלים דרך הווריד', 'טיפול טוב בכאב', 'אכילה בהדרגה כשהכאב יורד', 'אם הסיבה היא אבני מרה: הוצאת כיס המרה, בדרך כלל באותו אשפוז או זמן קצר אחריו'],
    opts: [['טיפול תומך', 'ברוב המקרים הדלקת קלה ועוברת תוך כמה ימים.']],
    home: ['להימנע מאלכוהול', 'אוכל דל שומן בשבועות הראשונים', 'לחזור לביקורת לפי ההנחיות'],
    red: ['כאב חזק שחוזר', 'חום', 'הקאות', 'הצהבה'],
    faq: [['למה לא נותנים לי לאכול?', 'בימים הראשונים הלבלב צריך מנוחה. מתחילים לאכול כשהכאב יורד, וזה בדרך כלל מהר.']] },
  lapchole: { t: 'ניתוח מתוכנן להוצאת כיס המרה', med: 'Laparoscopic cholecystectomy', art: 'liver', elect: 1, path: ['לפני הניתוח', 'קבלה', 'הניתוח', 'התאוששות', 'הביתה'], stay: 'יום אחד, לפעמים שניים',
    what: 'בניתוח מוציאים את כיס המרה דרך 3 או 4 חתכים קטנים בבטן, בעזרת מצלמה. הניתוח נמשך כשעה, בהרדמה כללית.',
    why: 'עושים את הניתוח בגלל אבני מרה שגורמות לכאבים או לדלקות חוזרות. כך מונעים את ההתקף הבא.',
    plan: ['צום מחצות בלילה שלפני הניתוח', 'קבלה במחלקה בבוקר', 'הניתוח', 'אכילה והליכה כבר באותו ערב', 'ברוב המקרים חוזרים הביתה למחרת'],
    opts: [['ניתוח לפרוסקופי', 'הדרך המקובלת. כמעט תמיד מצליחים לסיים דרך החתכים הקטנים.']],
    pre: ['להביא את רשימת התרופות הקבועות', 'מדללי דם: להפסיק לפי ההנחיה של הרופא', 'צום מחצות: בלי אוכל. מים עד 6 בבוקר', 'מקלחת בבוקר הניתוח', 'להשאיר תכשיטים ודברי ערך בבית'],
    home: ['פעילות קלה מיד', 'בלי הרמה של יותר מ־5 ק״ג במשך שבועיים', 'אוכל רגיל', 'מקלחת אחרי יומיים'],
    red: ['חום מעל 38', 'כאב שמחמיר', 'הצהבה', 'הפרשה מהחתכים'],
    faq: [['כמה זמן נמשך הניתוח?', 'בערך שעה. עם ההכנה וההתעוררות, תחזור/י למחלקה אחרי כשלוש שעות.']] },
  hernia: { t: 'ניתוח לתיקון בקע מפשעתי', med: 'Inguinal hernia repair', art: 'torso', elect: 1, path: ['לפני הניתוח', 'קבלה', 'הניתוח', 'התאוששות', 'הביתה'], stay: 'בדרך כלל באותו יום',
    what: 'בקע הוא חולשה בדופן הבטן, שדרכה בולטים רקמה או מעי. בניתוח מחזירים את התוכן למקום ומחזקים את הדופן ברשת.',
    why: 'בקע לא נעלם מעצמו. הניתוח מונע כאב ומונע מצב שבו המעי נתקע בבקע.',
    plan: ['צום מחצות', 'ניתוח, לפרוסקופי או בחתך קטן', 'חזרה הביתה באותו יום או למחרת'],
    opts: [['ניתוח לפרוסקופי', 'שני הצדדים באותו ניתוח, וחזרה מהירה לפעילות.'], ['ניתוח פתוח', 'חתך קטן במפשעה. לפעמים בהרדמה אזורית.']],
    pre: ['צום מחצות', 'להביא את רשימת התרופות', 'ללוות אותך הביתה צריך מבוגר אחד'],
    home: ['הליכה כבר מהיום הראשון', 'בלי הרמה של משקל כבד במשך 4 שבועות', 'נהיגה כשאין כאב בבלימה'],
    red: ['חום', 'נפיחות גדולה במפשעה', 'קושי במתן שתן'],
    faq: [['הרשת נשארת לתמיד?', 'כן. היא נבנית לתוך הרקמה ומחזקת אותה. מרגישים אותה רק בשבועות הראשונים.']] },
  sleeve: { t: 'ניתוח שרוול', med: 'Laparoscopic sleeve gastrectomy', art: 'stomach', elect: 1, path: ['לפני הניתוח', 'קבלה', 'הניתוח', 'התאוששות', 'הביתה'], stay: '2 עד 3 ימים',
    what: 'בניתוח מקטינים את הקיבה לצורת צינור, שרוול. כך מרגישים שובע מהר יותר, וגם יש פחות רעב. הניתוח לפרוסקופי.',
    why: 'זה טיפול יעיל להשמנה ולמחלות שקשורות אליה, כמו סוכרת, יתר לחץ דם ודום נשימה בשינה.',
    plan: ['יום הניתוח: שתייה בלגימות קטנות', 'יום אחרי: נוזלים צלולים והליכה', 'הדרכה של הדיאטנית לפני השחרור'],
    opts: [['שרוול', 'הניתוח הבריאטרי השכיח בארץ.'], ['מעקף קיבה', 'אפשרות אחרת שמתאימה לחלק מהמטופלים, למשל כשיש ריפלוקס.']],
    pre: ['דיאטה דלת קלוריות שבועיים לפני הניתוח', 'צום מחצות', 'להביא את כל התרופות ואת המכשיר לדום נשימה, אם יש'],
    home: ['שבועיים של נוזלים, ואחר כך מזון טחון לפי הדיאטנית', 'ויטמינים כל החיים', 'ביקורת במרפאה בריאטרית אחרי חודש'],
    red: ['חום', 'כאב חזק', 'דופק מהיר', 'הקאות חוזרות'],
    faq: [['כמה זמן עד שאפשר לאכול רגיל?', 'בהדרגה, במשך כחודש וחצי. הדיאטנית מלווה אותך בכל שלב.']] },
  colec: { t: 'ניתוח לכריתת חלק מהמעי הגס', med: 'Laparoscopic colectomy', art: 'bowel', elect: 1, path: ['לפני הניתוח', 'קבלה', 'הניתוח', 'התאוששות', 'הביתה'], stay: '3 עד 5 ימים',
    what: 'בניתוח מוציאים את החלק במעי הגס שנמצא בו הממצא, ומחברים מחדש את שני הקצוות. הניתוח לפרוסקופי ונמשך כמה שעות.',
    why: 'הצוות שלך הסביר לך את הסיבה לניתוח. כאן תמצא/י את מה שחשוב לדעת על הדרך עצמה.',
    plan: ['תוכנית החלמה מהירה (ERAS): שתייה כבר באותו ערב', 'הליכה ביום שאחרי הניתוח', 'הצינורות מוצאים בהדרגה', 'חזרה הביתה כשיש יציאה, אוכלים טוב והכאב בשליטה'],
    opts: [['ניתוח לפרוסקופי', 'הדרך המקובלת. החלמה מהירה יותר.']],
    pre: ['משקה פחמימות לפי ההנחיה, עד שעתיים לפני הניתוח', 'צום מאוכל מחצות', 'להביא את רשימת התרופות'],
    home: ['הליכה כל יום', 'אוכל רגיל, ארוחות קטנות', 'בלי הרמה של משקל כבד במשך 6 שבועות', 'תור למרפאה עם התשובה הסופית מהמעבדה'],
    red: ['חום', 'כאב בטן שמחמיר', 'הקאות', 'אודם או הפרשה מהחתך'],
    faq: [['מתי תהיה תשובה מהמעבדה?', 'בדרך כלל אחרי 10 עד 14 ימים. המנתח/ת ידבר/תדבר איתך עליה, ורק אחר כך היא תופיע כאן.']] }
};
const LUMEN_NURSES_ = ['מיכל בן חיים', 'סער עופר', 'אולגה פרידמן', 'רונית אשל', 'משה זכאי', 'שירה לוי'];
const LUMEN_WELCOME_ = 'ברוכים הבאים למערך הכירורגי של המרכז הרפואי אופק. הצוות שלנו כאן בשבילך בכל שלב, והקישור הזה ילווה אותך עד שתחזור/י הביתה ואחרי. בכל שאלה, אפשר לכתוב לנו כאן או לפנות לאחות. מאחל לך החלמה מהירה, פרופ׳ דניאל אלמוג, מנהל המערך';
const lumenPol_ = () => Object.assign({}, ...LUMEN_SHARE_.map(c => ({ [c[0]]: c[2] })), get_('lumenpol') || {});
const lumenIds_ = () => get_('lumenix') || [];
const lumenGet_ = id => { const p = get_('lumen:' + id); if (!p) throw new Error('המטופל/ת לא נמצא/ה'); return p; };
const lumenPut_ = (p, by) => { set_('lumen:' + p.id, p, by); const ix = lumenIds_(); if (ix.indexOf(p.id) < 0) { ix.push(p.id); set_('lumenix', ix, by); } };
const lumenTok_ = () => 'L' + Utilities.getUuid().replace(/-/g, '').slice(0, 14);
// the mode of one kind of information for one patient: the patient's own override, or the department's policy
const lumenMode_ = (p, k) => (p.share && p.share[k]) || lumenPol_()[k] || 'off';
function lumenSeed_() {
  if (get_('lumenseed')) return;
  const P = (get_('people') || []).filter(x => x.active !== false), S = P.filter(x => x.role === 'senior'), R = P.filter(x => x.role === 'resident'); if (!S.length || !R.length) return;
  const today = todayIso_(); let seed = 6161; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, pick = a => a[Math.floor(rnd() * a.length)];
  const add = (d, n) => { const x = new Date(d + 'T12:00:00'); x.setDate(x.getDate() + n); return Utilities.formatDate(x, 'Asia/Jerusalem', 'yyyy-MM-dd'); };
  const sid = n => (S.find(x => x.name === n) || S[0]).id;
  const FM = ['אברהם', 'יצחק', 'מאיר', 'אנדריי', 'ניר', 'עוזי', 'חנן', 'רפאל', 'בני', 'עידן', 'שלמה', 'דב'], FF = ['ציפורה', 'נאוה', 'מרגריטה', 'יעל', 'הגר', 'סמדר', 'אלה', 'רבקה', 'טל', 'נטליה', 'עדנה', 'רוני'];
  const LN = ['גבריאלי', 'אבוחצירא', 'סמירנוב', 'כהנא', 'זכאי', 'סגל', 'ברזילי', 'אלון', 'שטרית', 'קוזלובה', 'עמרני', 'נעים', 'חפץ', 'וקנין'];
  const LEAD = { chole: ['לנדאו', 'גולן', 'רבינוביץ'], appy: ['אשכנזי', 'וייס', 'דיין'], divert: ['כספי', 'מזרחי'], sbo: ['וייס', 'דיין', 'רוטמן'], panc: ['לנדאו', 'רבינוביץ'], lapchole: ['לנדאו', 'גולן'], hernia: ['אבוטבול', 'רוטמן'], sleeve: ['ברודסקי', 'אלקיים'], colec: ['כספי', 'שטרן'] };
  const LANG = ['he', 'he', 'he', 'he', 'ar', 'ru', 'he', 'en'];
  const mix = [['chole', 4], ['appy', 3], ['divert', 3], ['sbo', 2], ['panc', 2], ['lapchole', 3], ['hernia', 2], ['sleeve', 3], ['colec', 3]];
  const ROUND = { 0: 'התקבלת למחלקה. הצוות בודק את התוצאות ומחליט על הטיפול. בינתיים חשוב לנוח ולהישאר בצום עד שנעדכן.', 1: 'הבדיקות הראו את האבחנה. התחלנו טיפול, ומחר בבוקר נחליט על הצעד הבא. הכאב צריך להשתפר בהדרגה.', 2: 'הטיפול מתקדם כמו שציפינו. חשוב ללכת במסדרון ולשתות. אם הכאב עולה, לקרוא לאחות.', 3: 'מצבך משתפר יפה. אם הלילה יעבור בשקט, מחר נדבר על חזרה הביתה.', 4: 'אפשר לחזור הביתה. ההנחיות, המכתב והתור לביקורת מחכים לך כאן.' };
  const ids = []; let n = 0;
  mix.forEach(([c, k]) => { for (let i = 0; i < k; i++) {
    const C = LUMEN_COND_[c], fem = rnd() < .5, el = !!C.elect, stage = el ? (i === 0 ? 0 : Math.min(4, 1 + Math.floor(rnd() * 3))) : Math.min(4, Math.floor(rnd() * 4)), admit = el && stage === 0 ? add(today, 1 + (n % 4)) : add(today, -stage - Math.floor(rnd() * 2));
    const sur = sid(pick(LEAD[c])), res = pick(R).id, opDay = el ? admit : add(admit, 1);
    const p = { id: 'lu' + Utilities.getUuid().replace(/-/g, '').slice(0, 8), tok: lumenTok_(), n: (fem ? pick(FF) : pick(FM)) + ' ' + pick(LN), sex: fem ? 'נ' : 'ז', age: 24 + Math.floor(rnd() * 60), lang: pick(LANG), phone: '05' + Math.floor(rnd() * 9) + '-•••-••' + String(10 + Math.floor(rnd() * 89)),
      cond: c, via: el ? 'ניתוח מתוכנן' : 'מיון', admit: admit, op: C.path.indexOf('ניתוח') >= 0 || C.path.indexOf('הניתוח') >= 0 ? opDay : '', stage: stage, st: stage === 0 && el ? 'pre' : 'in', dc: add(admit, el ? 2 : 4) > today ? add(admit, el ? 2 : 4) : add(today, stage >= 3 ? 1 : 2),
      room: 'חדר ' + (10 + Math.floor(rnd() * 14)) + ' · מיטה ' + (1 + Math.floor(rnd() * 3)), wing: rnd() < .5 ? 'צפון' : 'דרום', sur: sur, res: res, nurse: pick(LUMEN_NURSES_),
      share: {}, feed: [], qs: [], chk: {}, pain: [], opens: [], fam: [], fb: null };
    const at = (d, h) => d + 'T' + String(h).padStart(2, '0') + ':' + String(Math.floor(rnd() * 6) * 10).padStart(2, '0') + ':00';
    if (p.st !== 'pre') {
      p.feed.push({ id: 'f' + n + 'a', at: at(admit, 9), k: 'welcome', t: 'ברוכים הבאים', x: LUMEN_WELCOME_, by: 'פרופ׳ דניאל אלמוג', st: 'pub' });
      for (let s = 0; s <= Math.min(stage, 3); s++) { const d = add(admit, s); if (d > today) break; p.feed.push({ id: 'f' + n + 'r' + s, at: at(d, 10 + s % 2), k: 'round', t: 'סיכום הביקור', x: ROUND[s], by: 'ד״ר ' + (P.find(x => x.id === (s % 2 ? res : sur)) || {}).name, st: s === stage && rnd() < .5 ? 'pending' : 'pub' }); }
      if (['chole', 'appy', 'divert', 'sbo', 'panc'].indexOf(c) >= 0) p.feed.push({ id: 'f' + n + 'i', at: at(admit, 14), k: 'img', t: c === 'sbo' ? 'צילום עם חומר ניגוד' : c === 'chole' || c === 'panc' ? 'אולטרסאונד של הבטן' : 'סי־טי של הבטן', x: { chole: 'הבדיקה הראתה כיס מרה מודלק עם אבנים. דרכי המרה תקינות. זה מתאים לאבחנה, והטיפול שתוכנן מתאים.', appy: 'הבדיקה הראתה תוספתן מודלק, בלי סיבוך. ממשיכים לפי התוכנית.', divert: 'הבדיקה הראתה דלקת קלה בסעיפים, בלי מורסה. אפשר להמשיך בטיפול תרופתי.', sbo: 'חומר הניגוד הגיע למעי הגס. זה סימן טוב שהחסימה נפתחת.', panc: 'נראתה דלקת קלה של הלבלב ואבנים בכיס המרה.' }[c], by: 'ד״ר ' + (P.find(x => x.id === res) || {}).name, st: rnd() < .35 ? 'pending' : 'pub' });
      if (c === 'colec' && stage >= 3) p.feed.push({ id: 'f' + n + 'p', at: at(add(admit, 2), 12), k: 'path', t: 'תשובה מהמעבדה', x: 'התשובה הסופית מהמעבדה התקבלה. המנתח/ת יעבור/תעבור עליה איתך בשיחה אישית לפני שהיא תופיע כאן.', by: 'צוות המערך', st: 'held' });
      if (stage === 4) p.feed.push({ id: 'f' + n + 'd', at: at(add(admit, 4) > today ? today : add(admit, 4), 11), k: 'dc', t: 'מכתב השחרור מוכן', x: 'המכתב נשלח גם לרופא/ת המשפחה שלך. הוא כולל את מה שנעשה באשפוז, את התרופות ואת התור לביקורת.', by: 'המזכירות', st: 'pub' });
      const days = Math.max(0, Math.round((new Date(today) - new Date(admit)) / 864e5)); for (let s = 0; s <= days; s++) { if (rnd() < .85) p.opens.push(add(admit, s)); }
      for (let s = 0; s <= Math.min(days, 3); s++) p.pain.push([at(add(admit, s), 8), Math.max(0, 7 - s * 2 + Math.floor(rnd() * 2))]);
      p.chk[today] = [0, 1].filter(() => rnd() < .6);
      if (rnd() < .6) p.qs.push({ id: 'q' + n, at: at(today, 7 + Math.floor(rnd() * 3)), q: pick(['מתי אפשר לאכול?', 'האם מחר אני משתחרר/ת?', 'מותר לי להתקלח?', 'אשתי שואלת אם אפשר לבקר בערב', 'מתי אפשר לחזור לעבודה?', 'כמה זמן ייקח עד שהכאב יעבור?']), a: rnd() < .45 ? 'שאלה טובה. נעבור על זה איתך בביקור הצהריים, ובינתיים אפשר לשאול את האחות.' : '', aBy: '', aAt: '' });
      if (rnd() < .4) p.fam.push({ name: pick(['בתי', 'בעלי', 'אשתי', 'בני', 'אחותי']), at: add(admit, 1) });
    } else p.feed.push({ id: 'f' + n + 'w', at: at(add(today, -1), 12), k: 'welcome', t: 'נקבע לך ניתוח', x: 'שלום, נקבע לך ' + C.t + ' בתאריך ' + (+admit.slice(8)) + '/' + (+admit.slice(5, 7)) + '. כאן תמצא/י את כל ההכנות, ונהיה איתך לאורך כל הדרך.', by: 'המערך הכירורגי', st: 'pub' });
    lumenPut_(p, 'seed'); ids.push(p.id); n++;
  } });
  // patients who already went home, with their feedback
  for (let i = 0; i < 12; i++) {
    const c = pick(['chole', 'appy', 'hernia', 'lapchole', 'sleeve', 'divert']), C = LUMEN_COND_[c], fem = rnd() < .5, admit = add(today, -6 - Math.floor(rnd() * 24));
    const p = { id: 'lu' + Utilities.getUuid().replace(/-/g, '').slice(0, 8), tok: lumenTok_(), n: (fem ? pick(FF) : pick(FM)) + ' ' + pick(LN), sex: fem ? 'נ' : 'ז', age: 25 + Math.floor(rnd() * 55), lang: pick(LANG), phone: '05' + i + '-•••-••' + (20 + i), cond: c, via: C.elect ? 'ניתוח מתוכנן' : 'מיון', admit: admit, op: admit, stage: 4, st: 'out', dc: add(admit, 2), room: '', wing: '', sur: sid(pick(LEAD[c])), res: pick(R).id, nurse: pick(LUMEN_NURSES_), share: {}, feed: [{ id: 'fo' + i, at: admit + 'T09:00:00', k: 'welcome', t: 'ברוכים הבאים', x: LUMEN_WELCOME_, by: 'פרופ׳ דניאל אלמוג', st: 'pub' }], qs: [], chk: {}, pain: [], opens: [admit, add(admit, 1), add(admit, 2), add(admit, 5)], fam: [],
      fb: { nps: pick([10, 10, 9, 9, 9, 10, 8, 10, 7, 9]), stars: pick([5, 5, 5, 4, 5]), txt: pick(['הרגשתי שמסבירים לי כל שלב. תודה!', 'הקישור עזר לי ולמשפחה מאוד', 'הצוות היה מדהים, והיה נעים לדעת מה קורה', 'הייתי שמח לקבל את העדכונים מוקדם יותר בבוקר', 'התשובות לשאלות הגיעו מהר', '']), at: add(admit, 3) } };
    lumenPut_(p, 'seed'); ids.push(p.id);
  }
  set_('lumenseed', { at: new Date().toISOString() }, 'seed');
}
// a staff view of one patient: everything, plus what the patient actually sees
function lumenStaff_(p) { return Object.assign({}, p, { view: lumenView_(p, false) }); }
// what the patient (or the family) sees, after the sharing rules
function lumenView_(p, fam) {
  const C = LUMEN_COND_[p.cond] || {}, P = (get_('people') || []), nm = id => { const x = P.find(q => q.id === id); return x ? (x.full || x.name) : ''; }, on = k => lumenMode_(p, k) !== 'off';
  const feedOk = f => f.st === 'pub' && (f.k === 'welcome' || f.k === 'note' || (f.k === 'round' && on('round')) || (f.k === 'img' && on('img')) || (f.k === 'labs' && on('labs')) || (f.k === 'path' && on('path')) || (f.k === 'dc' && on('dc')));
  return { first: p.n.split(' ')[0], name: p.n, sex: p.sex, lang: p.lang, st: p.st, stage: p.stage, path: C.path || [], admit: p.admit, op: p.op, dc: on('dc') ? p.dc : '', room: p.room, fam: !!fam,
    cond: on('dx') ? { t: C.t, med: C.med, art: C.art, what: C.what, why: C.why, faq: C.faq, stay: C.stay } : null,
    plan: on('plan') ? { plan: C.plan, opts: C.opts, pre: C.pre || [] } : null,
    team: on('team') ? [{ r: 'המנתח/ת האחראי/ת', n: nm(p.sur) }, { r: 'הרופא/ה במחלקה', n: nm(p.res) }, { r: 'האח/ות שלך היום', n: p.nurse }] : null,
    home: on('dc') ? { home: C.home || [], red: C.red || [] } : null,
    feed: p.feed.filter(feedOk).sort((a, b) => b.at.localeCompare(a.at)), qs: fam ? [] : p.qs, chk: LUMEN_CHK_, done: (p.chk || {})[todayIso_()] || [], fb: p.fb, head: 'פרופ׳ דניאל אלמוג', dept: 'המערך הכירורגי · המרכז הרפואי אופק' };
}
function ops_lumenAll(code) {
  const u = me_(code); if (LUMEN_SEE_.indexOf(u.role) < 0) throw new Error('אין הרשאה');
  lumenSeed_();
  const cond = {}; Object.keys(LUMEN_COND_).forEach(k => { const C = LUMEN_COND_[k]; cond[k] = { t: C.t, med: C.med, art: C.art, elect: !!C.elect, path: C.path, stay: C.stay, what: C.what, plan: C.plan, home: C.home, red: C.red }; });
  return { today: todayIso_(), share: LUMEN_SHARE_, modes: LUMEN_MODES_, pol: lumenPol_(), cond: cond, chk: LUMEN_CHK_, pts: lumenIds_().map(id => get_('lumen:' + id)).filter(Boolean).map(lumenStaff_) };
}
function ops_lumenPolicy(code, pol) {
  const u = me_(code); if (!canWrite_(u, 'lumenpol')) throw new Error('רק מנהל המערך קובע את המדיניות');
  const clean = {}; LUMEN_SHARE_.forEach(c => { if (pol && LUMEN_MODES_[pol[c[0]]]) clean[c[0]] = pol[c[0]]; });
  set_('lumenpol', clean, u.name); return lumenPol_();
}
function ops_lumenSave(code, id, f) {
  const u = me_(code); if (!canWrite_(u, 'lumen')) throw new Error('אין הרשאה');
  const p = lumenGet_(id);
  if (f.share) { const s = {}; Object.keys(f.share).forEach(k => { if (LUMEN_MODES_[f.share[k]] && LUMEN_SHARE_.some(c => c[0] === k)) s[k] = f.share[k]; }); p.share = s; }
  if (f.stage !== undefined) { p.stage = Math.max(0, Math.min(4, +f.stage)); if (p.stage > 0 && p.st === 'pre') p.st = 'in'; }
  if (f.dc && /^\d{4}-\d{2}-\d{2}$/.test(f.dc)) p.dc = f.dc;
  if (f.st && ['pre', 'in', 'out'].indexOf(f.st) >= 0) p.st = f.st;
  lumenPut_(p, u.name); return lumenStaff_(p);
}
function ops_lumenPost(code, id, it) {
  const u = me_(code); if (!canWrite_(u, 'lumen')) throw new Error('אין הרשאה');
  const p = lumenGet_(id), k = ['round', 'img', 'labs', 'path', 'dc', 'note'].indexOf(it.k) >= 0 ? it.k : 'note', x = String(it.x || '').trim();
  if (!x) throw new Error('כתבו את העדכון'); if (k !== 'note' && lumenMode_(p, k) === 'off') throw new Error('המידע הזה לא משותף עם המטופל/ת לפי המדיניות');
  const mode = k === 'note' ? 'auto' : lumenMode_(p, k), st = mode === 'auto' || it.now ? 'pub' : mode === 'told' ? 'held' : 'pending';
  p.feed.push({ id: 'f' + Date.now(), at: new Date().toISOString().slice(0, 19), k: k, t: String(it.t || { round: 'סיכום הביקור', img: 'תוצאת בדיקה', labs: 'בדיקות דם', path: 'תשובה מהמעבדה', dc: 'השחרור', note: 'עדכון מהצוות' }[k]).slice(0, 60), x: x.slice(0, 800), by: u.name, st: st });
  lumenPut_(p, u.name); return lumenStaff_(p);
}
function ops_lumenDecide(code, id, fid, pub) {
  const u = me_(code); if (!canWrite_(u, 'lumen')) throw new Error('אין הרשאה');
  const p = lumenGet_(id), f = p.feed.find(x => x.id === fid); if (!f) throw new Error('העדכון לא נמצא');
  f.st = pub ? 'pub' : 'held'; f.ok = u.name; lumenPut_(p, u.name); return lumenStaff_(p);
}
function ops_lumenAnswer(code, id, qid, a) {
  const u = me_(code); if (!canWrite_(u, 'lumen')) throw new Error('אין הרשאה');
  const p = lumenGet_(id), q = p.qs.find(x => x.id === qid); if (!q) throw new Error('השאלה לא נמצאה'); if (!String(a || '').trim()) throw new Error('כתבו תשובה');
  q.a = String(a).slice(0, 600); q.aBy = u.name; q.aAt = new Date().toISOString().slice(0, 19); lumenPut_(p, u.name); return lumenStaff_(p);
}
function ops_lumenNew(code, f) {
  const u = me_(code); if (!canWrite_(u, 'lumen')) throw new Error('אין הרשאה');
  if (!String(f.n || '').trim()) throw new Error('חסר שם'); if (!LUMEN_COND_[f.cond]) throw new Error('בחרו אבחנה או ניתוח');
  const today = todayIso_(), C = LUMEN_COND_[f.cond], el = !!C.elect;
  const p = { id: 'lu' + Utilities.getUuid().replace(/-/g, '').slice(0, 8), tok: lumenTok_(), n: String(f.n).trim().slice(0, 60), sex: f.sex === 'נ' ? 'נ' : 'ז', age: +f.age || '', lang: ['he', 'ar', 'ru', 'en'].indexOf(f.lang) >= 0 ? f.lang : 'he', phone: String(f.phone || '').slice(0, 20), cond: f.cond, via: el ? 'ניתוח מתוכנן' : 'מיון', admit: f.admit || today, op: f.op || '', stage: 0, st: el && (f.admit || today) > today ? 'pre' : 'in', dc: '', room: String(f.room || ''), wing: '', sur: f.sur || '', res: f.res || '', nurse: pick_(LUMEN_NURSES_), share: {}, feed: [{ id: 'f' + Date.now(), at: new Date().toISOString().slice(0, 19), k: 'welcome', t: 'ברוכים הבאים', x: LUMEN_WELCOME_, by: 'פרופ׳ דניאל אלמוג', st: 'pub' }], qs: [], chk: {}, pain: [], opens: [], fam: [], fb: null };
  lumenPut_(p, u.name); return lumenStaff_(p);
}
const pick_ = a => a[Math.floor(Math.random() * a.length)];
// an elective operation scheduled from the bank: the patient gets the link with the preparation for the operation
const LUMEN_FROM_BANK_ = { lchol: 'lapchole', tapp: 'hernia', ing: 'hernia', slv: 'sleeve', rhc: 'colec', sig: 'colec', lar: 'colec' };
function lumenFromBank_(team, c, by) {
  const cond = LUMEN_FROM_BANK_[c.code]; if (!cond || !c.sch || !c.sch.d) return null;
  if (lumenIds_().some(id => { const p = get_('lumen:' + id); return p && p.bank === c.id; })) return null;
  const C = LUMEN_COND_[cond], p = { id: 'lu' + Utilities.getUuid().replace(/-/g, '').slice(0, 8), tok: lumenTok_(), bank: c.id, n: c.n, sex: c.sex, age: c.age, lang: 'he', phone: '', cond: cond, via: 'ניתוח מתוכנן', admit: c.sch.d, op: c.sch.d, stage: 0, st: 'pre', dc: '', room: '', wing: '', sur: c.sur || '', res: '', nurse: pick_(LUMEN_NURSES_), share: {}, qs: [], chk: {}, pain: [], opens: [], fam: [], fb: null,
    feed: [{ id: 'f' + Date.now(), at: new Date().toISOString().slice(0, 19), k: 'welcome', t: 'נקבע לך ניתוח', x: 'שלום, נקבע לך ' + C.t + ' בתאריך ' + (+c.sch.d.slice(8)) + '/' + (+c.sch.d.slice(5, 7)) + '. כאן תמצא/י את כל ההכנות, ונהיה איתך לאורך כל הדרך.', by: 'המערך הכירורגי', st: 'pub' }] };
  lumenPut_(p, by); return p;
}
// ---------- the patient's side: only the token in the link, and only what the rules allow ----------
function lumenByTok_(tok) { const t = String(tok || ''), fam = /^F/.test(t), real = fam ? 'L' + t.slice(1) : t; const id = lumenIds_().find(i => { const p = get_('lumen:' + i); return p && p.tok === real; }); if (!id) throw new Error('הקישור לא תקין או שפג תוקפו'); return { p: get_('lumen:' + id), fam: fam }; }
function ops_lumenMe(tok) {
  lumenSeed_(); const r = lumenByTok_(tok), p = r.p, d = todayIso_();
  if (!r.fam && p.opens[p.opens.length - 1] !== d) { p.opens.push(d); set_('lumen:' + p.id, p, ''); }
  return Object.assign(lumenView_(p, r.fam), { famTok: r.fam ? '' : 'F' + p.tok.slice(1) });
}
function ops_lumenAsk(tok, q) {
  const r = lumenByTok_(tok); if (r.fam) throw new Error('בני משפחה רואים את העדכונים בלבד'); q = String(q || '').trim(); if (!q) throw new Error('כתבו שאלה');
  r.p.qs.push({ id: 'q' + Date.now(), at: new Date().toISOString().slice(0, 19), q: q.slice(0, 400), a: '', aBy: '', aAt: '' }); set_('lumen:' + r.p.id, r.p, r.p.n); return ops_lumenMe(tok);
}
function ops_lumenCheck(tok, i) {
  const r = lumenByTok_(tok); if (r.fam) throw new Error('רק המטופל/ת מסמן/ת'); const d = todayIso_(), L = (r.p.chk[d] = r.p.chk[d] || []), k = +i; if (k < 0 || k >= LUMEN_CHK_.length) throw new Error('פעולה לא תקינה');
  const j = L.indexOf(k); if (j >= 0) L.splice(j, 1); else L.push(k); set_('lumen:' + r.p.id, r.p, r.p.n); return L;
}
function ops_lumenPain(tok, s) {
  const r = lumenByTok_(tok); if (r.fam) throw new Error('רק המטופל/ת מדווח/ת'); s = Math.max(0, Math.min(10, Math.round(+s)));
  r.p.pain.push([new Date().toISOString().slice(0, 19), s]); set_('lumen:' + r.p.id, r.p, r.p.n); return { ok: true, high: s >= 7 };
}
function ops_lumenFb(tok, f) {
  const r = lumenByTok_(tok); if (r.fam) throw new Error('המשוב מגיע מהמטופל/ת');
  r.p.fb = { nps: Math.max(0, Math.min(10, +f.nps || 0)), stars: Math.max(1, Math.min(5, +f.stars || 5)), txt: String(f.txt || '').slice(0, 600), at: todayIso_() }; set_('lumen:' + r.p.id, r.p, r.p.n); return r.p.fb;
}
function ops_lumenFam(tok, name) {
  const r = lumenByTok_(tok); if (r.fam) throw new Error('רק המטופל/ת משתף/ת'); r.p.fam.push({ name: String(name || 'בן/בת משפחה').slice(0, 40), at: todayIso_() }); set_('lumen:' + r.p.id, r.p, r.p.n); return { tok: 'F' + r.p.tok.slice(1) };
}

/* ---------------- Ward: the nursing staff on the same core ----------------
 * The patients in the ward are the Nest patients who are in (lumen:<id>, st 'in'), plus those coming in tomorrow (st 'pre').
 * ward:<yyyy-mm-dd> = { t: { <shift m|e|n>: { <pid>: [task ids done] } }, n: { <pid>: { <shift>: { s, b, a, r, by, at } } } }: the tasks ticked and the handover notes (SBAR), per day and shift.
 * The tasks of each patient for a shift are worked out here from the Nest record (wardTasks_), so a pain report or a question in Nest becomes a task for the nurse. */
WRITE.ward = ['owner', 'director', 'deputy', 'chief', 'secretary'];
const WARD_SEE_ = ['owner', 'director', 'deputy', 'chief', 'secretary', 'viewer'];
const WARD_SHIFTS_ = [['m', 'בוקר', '07:00–15:00'], ['e', 'ערב', '15:00–23:00'], ['n', 'לילה', '23:00–07:00']];
const wardDay_ = d => get_('ward:' + d) || { t: {}, n: {} };
function wardTasks_(p, sh, today, tom) {
  const C = LUMEN_COND_[p.cond] || {}, last = p.pain[p.pain.length - 1], hi = last && last[1] >= 7 && last[0].slice(0, 10) >= tom.prev, post = p.op && p.op < today, T = [];
  const t = (id, x, lvl) => T.push({ id: id, t: x, lvl: lvl || 0 });
  if (hi) t('pain7', 'דיווח על כאב ' + last[1] + ' ב־Nest: הערכה ועדכון הרופא/ה', 2);
  if (p.qs.some(q => !q.a)) t('q', 'שאלה של המטופל/ת ב־Nest מחכה לתשובה', 1);
  if (p.op === today && sh === 'm') t('orprep', 'הכנה לחדר הניתוח: הסכמה, סימון, צום, חלוק, הסרת תכשיטים', 2);
  if (p.op === tom.d && sh !== 'm') t('npo', 'ניתוח מחר: צום מחצות והכנות לפי ההנחיות' + ((C.pre || []).length ? ' (' + C.pre.slice(0, 2).join(', ') + ')' : ''), 1);
  t('vit', 'סימנים חיוניים');
  t('pain', 'הערכת כאב');
  if (post) t('wound', 'בדיקת החתך והנקזים');
  if (p.stage >= 2 && sh !== 'n') t('mob', 'ניוד: הליכה במסדרון וישיבה בכיסא');
  if (p.dc && (p.dc === today || p.dc === tom.d) && sh !== 'n') t('edu', 'הדרכת שחרור: ההנחיות לבית והסימנים שצריך לחזור בגללם');
  if (p.lang && p.lang !== 'he' && sh === 'm') t('lang', 'שפת המטופל/ת: ' + ({ ar: 'ערבית', ru: 'רוסית', en: 'אנגלית' }[p.lang] || p.lang) + '. Nest מוצג בשפה שלו/ה; לשיחה צריך מתורגמן/ית', 0);
  return T;
}
// the demo: last night's handover notes and the first rounds of this morning, once
function wardSeed_() {
  if (get_('wardseed')) return;
  const today = todayIso_(), y = new Date(today + 'T12:00:00'); y.setDate(y.getDate() - 1); const yd = Utilities.formatDate(y, 'Asia/Jerusalem', 'yyyy-MM-dd');
  const L = lumenIds_().map(id => get_('lumen:' + id)).filter(Boolean).filter(p => p.st === 'in'), W0 = wardDay_(yd), W1 = wardDay_(today);
  const S = ['יציב/ה, נח/ה בלילה', 'ער/ה חלק מהלילה בגלל כאב', 'יציב/ה, ישן/ה טוב'], A = ['סימנים חיוניים תקינים. כאב בשליטה עם משככים', 'חום 37.9 בלילה, ירד אחרי אקמול. סימנים חיוניים תקינים', 'סימנים חיוניים תקינים. שתייה טובה'], R = ['להמשיך ניוד ושתייה', 'לעקוב אחרי החום ולעדכן את הרופא/ה בביקור', 'לבדוק את הנקז בבוקר'];
  L.forEach((p, i) => { const C = LUMEN_COND_[p.cond] || {};
    (W0.n[p.id] = W0.n[p.id] || {}).n = { s: S[i % 3], b: (C.t || '') + ', יום ' + (p.stage + 1) + ' באשפוז', a: A[i % 3], r: R[i % 3], by: LUMEN_NURSES_[i % LUMEN_NURSES_.length], at: today + 'T06:40' };
    if (i % 3 !== 2) ((W1.t.m = W1.t.m || {})[p.id] = ['vit']); });
  set_('ward:' + yd, W0, 'seed'); set_('ward:' + today, W1, 'seed'); set_('wardseed', { at: new Date().toISOString() }, 'seed');
}
function ops_wardAll(code, d) {
  const u = me_(code); if (WARD_SEE_.indexOf(u.role) < 0) throw new Error('אין הרשאה');
  lumenSeed_(); wardSeed_();
  const today = todayIso_(), day = /^\d{4}-\d{2}-\d{2}$/.test(String(d || '')) ? d : today;
  const add = (x, n) => { const y = new Date(x + 'T12:00:00'); y.setDate(y.getDate() + n); return Utilities.formatDate(y, 'Asia/Jerusalem', 'yyyy-MM-dd'); };
  const tom = { d: add(day, 1), prev: add(day, -1) }, P = (get_('people') || []), nm = id => { const x = P.find(q => q.id === id); return x ? x.name : ''; };
  const L = lumenIds_().map(id => get_('lumen:' + id)).filter(Boolean).filter(p => p.st === 'in' || (p.st === 'pre' && p.admit <= tom.d));
  const pts = L.map(p => { const C = LUMEN_COND_[p.cond] || {}, last = p.pain[p.pain.length - 1];
    return { id: p.id, n: p.n, sex: p.sex, age: p.age, lang: p.lang, st: p.st, room: p.room || '', wing: p.wing || '', cond: C.t || '', med: C.med || '', path: C.path || [], stage: p.stage, admit: p.admit, op: p.op, dc: p.dc, sur: nm(p.sur), res: nm(p.res), nurse: p.nurse,
      pain: p.pain.slice(-6), last: last || null, qs: p.qs.filter(q => !q.a).map(q => ({ id: q.id, q: q.q, at: q.at })), fam: p.fam.length, red: C.red || [], home: C.home || [],
      tasks: { m: wardTasks_(p, 'm', day, tom), e: wardTasks_(p, 'e', day, tom), n: wardTasks_(p, 'n', day, tom) } }; });
  return { today: today, day: day, tom: tom.d, shifts: WARD_SHIFTS_, pts: pts, st: wardDay_(day), prev: wardDay_(tom.prev), can: canWrite_(u, 'ward'), me: u.name };
}
function ops_wardTick(code, d, sh, pid, tid) {
  const u = me_(code); if (!canWrite_(u, 'ward')) throw new Error('אין הרשאה');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(d)) || ['m', 'e', 'n'].indexOf(sh) < 0) throw new Error('יום או משמרת לא תקינים');
  const W = wardDay_(d), S = (W.t[sh] = W.t[sh] || {}), L = (S[pid] = S[pid] || []), k = String(tid).slice(0, 12), i = L.indexOf(k);
  if (i >= 0) L.splice(i, 1); else L.push(k);
  set_('ward:' + d, W, u.name); return W;
}
function ops_wardNote(code, d, sh, pid, f) {
  const u = me_(code); if (!canWrite_(u, 'ward')) throw new Error('אין הרשאה');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(d)) || ['m', 'e', 'n'].indexOf(sh) < 0) throw new Error('יום או משמרת לא תקינים');
  const W = wardDay_(d), N = (W.n[pid] = W.n[pid] || {}), c = x => String(x || '').trim().slice(0, 400);
  N[sh] = { s: c(f.s), b: c(f.b), a: c(f.a), r: c(f.r), by: u.name, at: new Date().toISOString().slice(0, 16) };
  set_('ward:' + d, W, u.name); return W;
}

/* ---------------- Lumen: the bridge to the community doctor ----------------
 * The same journey as Nest (lumen:<id>), seen from the patient's family doctor: p.gp (who), p.link { docs, tasks, notes }.
 * docs: [{ id, k 'admit' | 'op' | 'dc' | 'path' | 'img', t, x, at, st 'sent' | 'held' }]; tasks: [{ id, t, due, done, by }]; notes: [{ id, at, from 'h' | 'g', by, x, seen }]
 * linkgps: the community doctors (invented); linkrefs: referrals from the community into the department, accepted into the bank. */
WRITE.link = ['owner', 'director', 'deputy', 'chief', 'secretary'];
const LINK_GPS_SEED_ = [['רינה אבירם', 'מרפאת הגפן', 'רפואת משפחה'], ['גלעד סרוסי', 'מרפאת נווה ים', 'רפואת משפחה'], ['איגור לרנר', 'מרכז הבריאות השקמה', 'רפואה פנימית'], ['מיכל דגן', 'מרפאת עמק החורש', 'רפואת משפחה'], ['נדב אסף', 'מרפאת גבעת הזיתים', 'רפואת משפחה'], ['אורית שמואלי', 'מרכז רפואי הדקל', 'רפואת משפחה'], ['יונתן פז', 'מרפאת שדות', 'רפואת משפחה'], ['הילה מרגלית', 'מרפאת הכרמים', 'רפואת משפחה']];
function linkGps_() {
  let G = get_('linkgps'); if (G) return G;
  G = LINK_GPS_SEED_.map((g, i) => ({ id: 'g' + (i + 1), n: 'ד״ר ' + g[0], clinic: g[1], spec: g[2], tok: 'G' + Utilities.getUuid().replace(/-/g, '').slice(0, 14) }));
  set_('linkgps', G, 'seed'); return G;
}
function linkSeed_() {
  if (get_('linkseed')) return; lumenSeed_();
  const G = linkGps_(), today = todayIso_(), P = get_('people') || [], nm = id => { const x = P.find(q => q.id === id); return x ? (x.full || x.name) : 'הצוות'; };
  const add = (d, n) => { const x = new Date(d + 'T12:00:00'); x.setDate(x.getDate() + n); return Utilities.formatDate(x, 'Asia/Jerusalem', 'yyyy-MM-dd'); };
  let i = 0;
  lumenIds_().forEach(id => { const p = get_('lumen:' + id); if (!p) return; const C = LUMEN_COND_[p.cond] || {}; p.gp = G[i++ % G.length].id;
    const L = p.link = { docs: [], tasks: [], notes: [] }, at = (d, h) => d + 'T' + String(h).padStart(2, '0') + ':15:00';
    if (p.st === 'pre') L.docs.push({ id: 'd' + i + 'p', k: 'admit', t: 'נקבע ניתוח', x: `למטופל/ת שלך נקבע ${C.t} בתאריך ${+p.admit.slice(8)}/${+p.admit.slice(5, 7)}. אם יש מידע חשוב לפני הניתוח (מדללי דם, מחלות רקע), אפשר לכתוב לנו כאן.`, at: at(add(today, -1), 12), st: 'sent' });
    else { L.docs.push({ id: 'd' + i + 'a', k: 'admit', t: 'הודעה על אשפוז', x: `${p.n}, בן/בת ${p.age}, אושפז/ה במערך הכירורגי ב־${+p.admit.slice(8)}/${+p.admit.slice(5, 7)} עם ${C.t}. נעדכן כאן במהלך האשפוז ובשחרור.`, at: at(p.admit, 9), st: 'sent' });
      if (p.st === 'out' || p.stage === 4) { const dd = p.st === 'out' ? p.dc : today; L.docs.push({ id: 'd' + i + 'd', k: 'dc', t: 'מכתב שחרור', x: `אבחנה: ${C.t}.\nמהלך: ${C.plan ? C.plan.join('. ') : ''}.\nהמלצות: ${(C.home || []).join('. ')}.\nתרופות: משככי כאבים לפי הצורך${p.cond === 'divert' ? ', להשלים אנטיביוטיקה 7 ימים' : ''}.\nביקורת: מרפאה כירורגית בעוד 3 שבועות.`, at: at(dd, 13), st: 'sent' });
        L.tasks.push({ id: 't' + i + 'a', t: C.elect || p.op ? 'הוצאת תפרים או בדיקת החתכים, יום 10 אחרי הניתוח' : 'בדיקה במרפאה תוך שבוע', due: add(dd, 8), done: p.st === 'out' && Math.random() < .5, by: 'מערך כירורגי' }, { id: 't' + i + 'b', t: p.cond === 'divert' ? 'הפניה לקולונוסקופיה בעוד 6 עד 8 שבועות' : 'מעקב כאב והחזרה לפעילות', due: add(dd, 14), done: false, by: 'מערך כירורגי' }); }
      if (p.cond === 'colec' && p.stage >= 3) L.docs.push({ id: 'd' + i + 'x', k: 'path', t: 'תשובה מהמעבדה', x: 'התשובה הסופית התקבלה. היא תישלח אליך אחרי שהמנתח/ת ישוחח/תשוחח עם המטופל/ת.', at: at(today, 10), st: 'held' });
      if (i % 3 === 0) { L.notes.push({ id: 'n' + i + 'a', at: at(p.admit, 15), from: 'g', by: G[(i - 1) % G.length].n, x: p.age > 65 ? 'שלום, המטופל נוטל אליקוויס בגלל פרפור פרוזדורים. רציתי לוודא שראיתם.' : 'תודה על העדכון. המטופל/ת מוכר/ת לי היטב, אשמח לעדכון לפני השחרור.', seen: true }); L.notes.push({ id: 'n' + i + 'b', at: at(add(p.admit, 1), 9), from: 'h', by: nm(p.res), x: p.age > 65 ? 'תודה, ראינו. הפסקנו את התרופה לפני הניתוח ונחזיר אותה לפי ההנחיות במכתב השחרור.' : 'בשמחה. נשלח את המכתב כאן ביום השחרור.', seen: true }); }
      if (i % 5 === 1 && p.st !== 'out') L.notes.push({ id: 'n' + i + 'c', at: at(today, 8), from: 'g', by: G[(i - 1) % G.length].n, x: 'יש תוכנית לשחרור השבוע? המשפחה שאלה אותי.', seen: false });
    }
    set_('lumen:' + p.id, p, 'seed');
  });
  const R = [['שמואל ביטון', 71, 'ז', 'בקע מפשעתי ימני מתנפח, כואב במאמץ', 'hrn', 3], ['שושנה אברמוביץ', 46, 'נ', 'אבני מרה עם שלושה התקפי כאב בחודשיים', 'hpb', 3], ['ולדימיר גורדון', 58, 'ז', 'דם ביציאות, קולונוסקופיה הראתה גוש בסיגמה', 'crc', 1], ['אפרת קליין', 39, 'נ', 'גוש בשד שמאל, ממוגרפיה BIRADS 4', 'brs', 1], ['עומר אדלר', 33, 'ז', 'סינוס פילונידלי חוזר', 'ano', 4]];
  set_('linkrefs', R.map((r, k) => ({ id: 'rf' + k, gp: G[k % G.length].id, n: r[0], age: r[1], sex: r[2], why: r[3], team: r[4], pri: r[5], at: add(today, -k - 1) + 'T1' + k + ':00:00', st: k === 4 ? 'acc' : 'new', bank: '' })), 'seed');
  set_('linkseed', { at: new Date().toISOString() }, 'seed');
}
const linkView_ = (p, gp) => { const C = LUMEN_COND_[p.cond] || {}, P = get_('people') || [], nm = id => { const x = P.find(q => q.id === id); return x ? (x.full || x.name) : ''; }; const L = p.link || { docs: [], tasks: [], notes: [] };
  return { id: p.id, n: p.n, age: p.age, sex: p.sex, cond: C.t || '', st: p.st, stage: p.stage, path: C.path || [], admit: p.admit, dc: p.dc, op: p.op, sur: nm(p.sur), res: nm(p.res), room: p.room, docs: L.docs.filter(d => gp ? d.st === 'sent' : true).sort((a, b) => b.at.localeCompare(a.at)), tasks: L.tasks, notes: L.notes, unread: L.notes.filter(x => !x.seen && x.from === (gp ? 'h' : 'g')).length }; };
function ops_linkAll(code) {
  const u = me_(code); if (LUMEN_SEE_.indexOf(u.role) < 0) throw new Error('אין הרשאה');
  linkSeed_(); const G = linkGps_();
  return { today: todayIso_(), gps: G, eps: lumenIds_().map(id => get_('lumen:' + id)).filter(p => p && p.gp).map(p => Object.assign(linkView_(p, false), { gp: p.gp, tok: p.tok })), refs: get_('linkrefs') || [], teams: BANK_TEAMS_.map(T => ({ id: T.id, t: T.t })) };
}
function linkEp_(id) { const p = lumenGet_(id); p.link = p.link || { docs: [], tasks: [], notes: [] }; return p; }
function ops_linkPost(code, id, x) {
  const u = me_(code); if (!canWrite_(u, 'link')) throw new Error('אין הרשאה'); x = String(x || '').trim(); if (!x) throw new Error('כתבו הודעה');
  const p = linkEp_(id); p.link.notes.forEach(n => { if (n.from === 'g') n.seen = true; }); p.link.notes.push({ id: 'n' + Date.now(), at: new Date().toISOString().slice(0, 19), from: 'h', by: u.name, x: x.slice(0, 1000), seen: false });
  set_('lumen:' + p.id, p, u.name); return linkView_(p, false);
}
function ops_linkDoc(code, id, d) {
  const u = me_(code); if (!canWrite_(u, 'link')) throw new Error('אין הרשאה'); const p = linkEp_(id);
  if (d.id) { const x = p.link.docs.find(q => q.id === d.id); if (!x) throw new Error('המסמך לא נמצא'); x.st = 'sent'; x.at = new Date().toISOString().slice(0, 19); }
  else { if (!String(d.x || '').trim()) throw new Error('כתבו את התוכן'); p.link.docs.push({ id: 'd' + Date.now(), k: ['dc', 'img', 'path', 'op', 'admit'].indexOf(d.k) >= 0 ? d.k : 'img', t: String(d.t || 'עדכון').slice(0, 60), x: String(d.x).slice(0, 2000), at: new Date().toISOString().slice(0, 19), st: 'sent' }); }
  if (d.task) p.link.tasks.push({ id: 't' + Date.now(), t: String(d.task).slice(0, 120), due: d.due || '', done: false, by: u.name });
  set_('lumen:' + p.id, p, u.name); return linkView_(p, false);
}
// a referral from the community: accepted, it becomes a case on the team's waiting list in the bank
function ops_linkRef(code, rid, st, team) {
  const u = me_(code); if (!canWrite_(u, 'link')) throw new Error('אין הרשאה');
  const R = get_('linkrefs') || [], r = R.find(x => x.id === rid); if (!r) throw new Error('ההפניה לא נמצאה');
  if (st === 'acc') { bankSeed_(); const T = BANK_TEAMS_.find(t => t.id === (team || r.team)); if (!T) throw new Error('בחרו צוות');
    const k = 'bank:' + T.id, L = get_(k) || [], c = { id: T.id + Utilities.getUuid().replace(/-/g, '').slice(0, 7), n: r.n, age: r.age, sex: r.sex, code: T.p[0][0], sur: '', pri: r.pri || 3, add: todayIso_(), diag: r.why, asa: 2, st: '', note: 'הפניה מהקהילה · ' + ((linkGps_().find(g => g.id === r.gp) || {}).n || ''), ready: { preop: 0, consent: 0, labs: 0, anest: 0, cardio: null, imaging: null } };
    L.push(c); set_(k, L, u.name); r.bank = c.id; r.team = T.id; }
  r.st = st === 'acc' ? 'acc' : st === 'no' ? 'no' : 'new'; r.by = u.name; set_('linkrefs', R, u.name); return R;
}
// ---------- the community doctor's side (link.html?d=<token>) ----------
function linkGp_(tok) { linkSeed_(); const g = linkGps_().find(x => x.tok === String(tok || '')); if (!g) throw new Error('הקישור לא תקין'); return g; }
function ops_linkMe(tok) {
  const g = linkGp_(tok);
  return { today: todayIso_(), me: g, dept: 'המערך הכירורגי · המרכז הרפואי אופק', eps: lumenIds_().map(id => get_('lumen:' + id)).filter(p => p && p.gp === g.id).map(p => linkView_(p, true)), refs: (get_('linkrefs') || []).filter(r => r.gp === g.id), teams: BANK_TEAMS_.map(T => ({ id: T.id, t: T.t })) };
}
function ops_linkGpPost(tok, id, x) {
  const g = linkGp_(tok), p = linkEp_(id); if (p.gp !== g.id) throw new Error('אין גישה'); x = String(x || '').trim(); if (!x) throw new Error('כתבו הודעה');
  p.link.notes.forEach(n => { if (n.from === 'h') n.seen = true; }); p.link.notes.push({ id: 'n' + Date.now(), at: new Date().toISOString().slice(0, 19), from: 'g', by: g.n, x: x.slice(0, 1000), seen: false });
  set_('lumen:' + p.id, p, g.n); return linkView_(p, true);
}
function ops_linkTask(tok, id, tid) {
  const g = linkGp_(tok), p = linkEp_(id); if (p.gp !== g.id) throw new Error('אין גישה'); const t = p.link.tasks.find(x => x.id === tid); if (!t) throw new Error('המשימה לא נמצאה');
  t.done = !t.done; t.doneBy = g.n; set_('lumen:' + p.id, p, g.n); return linkView_(p, true);
}
function ops_linkRefer(tok, r) {
  const g = linkGp_(tok); if (!String(r.n || '').trim() || !String(r.why || '').trim()) throw new Error('חסרים שם וסיבה');
  const R = get_('linkrefs') || []; R.unshift({ id: 'rf' + Date.now(), gp: g.id, n: String(r.n).slice(0, 60), age: +r.age || '', sex: r.sex === 'נ' ? 'נ' : 'ז', why: String(r.why).slice(0, 400), team: BANK_TEAMS_.some(t => t.id === r.team) ? r.team : 'hrn', pri: [1, 2, 3, 4].indexOf(+r.pri) >= 0 ? +r.pri : 3, at: new Date().toISOString().slice(0, 19), st: 'new', bank: '' });
  set_('linkrefs', R, g.n); return R.filter(x => x.gp === g.id);
}
// a specimen entered by hand or read from its label by the scanner (Trace)
function ops_pathAdd(code, r) {
  const u = me_(code); if (!canWrite_(u, 'path')) throw new Error('אין הרשאה');
  pathSeed_(); const d = String(r.d || todayIso_()); if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) throw new Error('תאריך לא תקין');
  if (!String(r.n || '').trim()) throw new Error('חסר שם');
  const k = 'path:' + d.slice(0, 7), L = get_(k) || [];
  if (r.cno && L.some(x => x.cno === r.cno)) throw new Error('המדבקה הזאת כבר נקלטה');
  const x = { id: 'h' + Utilities.getUuid().replace(/-/g, '').slice(0, 8), n: String(r.n).trim().slice(0, 60), age: +r.age || '', sex: r.sex === 'נ' ? 'נ' : 'ז', d: d, code: PATH_SPEC_[r.code] ? r.code : 'lchol', team: String(r.team || ''), sur: String(r.sur || ''), res: '', src: r.scan ? 'scan' : 'hand', cno: String(r.cno || '').slice(0, 20), st: 'sent', rd: '', dx: '', mal: 0, mdt: '', note: '' };
  L.push(x); set_(k, L, u.name); return x;
}

// ---------- ORBIT: surgical planning. For each case the surgeon's inputs and the plan they approved; the engine itself runs in the browser (orbPlan in Index.html) ----------
WRITE.orb = ['owner', 'director', 'deputy', 'chief'];
const ORB_SEE_ = ['owner', 'director', 'deputy', 'chief', 'viewer'];
const ORB_CODES_ = { umb: 'umb', inc: 'inc', ing: 'ing', tapp: 'ing' };
/** a clinical profile for a demo case, the same every time for the same case (the real system reads it from the patient record) */
function orbProfile_(c) {
  let h = 0; String(c.id).split('').forEach(ch => { h = (h * 31 + ch.charCodeAt(0)) | 0; }); const r = () => { h = (h * 1103515245 + 12345) & 0x7fffffff; return h / 0x7fffffff; };
  if (c.code === 'ing' || c.code === 'tapp') {
    const fem = c.sex === 'נ', bi = c.code === 'tapp' ? r() < .4 : r() < .1, rec = r() < (c.code === 'tapp' ? .3 : .1) ? (r() < .6 ? 'ant' : 'post') : '', dmG = r() < .15;
    return { type: 'inguinal', side: bi ? 'bi' : r() < .55 ? 'R' : 'L', zone: fem && r() < .35 ? 'F' : r() < .6 ? 'L' : 'M', size: 1 + Math.floor(r() * 3), rec: rec, sym: r() < .18 ? 'min' : 'sym', scrot: !fem && r() < .1 ? 1 : 0, lowsurg: r() < .1 ? 1 : 0, noga: +c.asa >= 3 && r() < .5 ? 1 : 0,
      bmi: Math.round((22 + r() * 10) * 10) / 10, smoker: r() < .2 ? 1 : 0, dm: dmG ? 1 : 0, a1c: dmG ? Math.round((6.3 + r() * 2) * 10) / 10 : '', copd: r() < .1 ? 1 : 0, anticoag: r() < .14 ? 1 : 0, ster: 0, cdc: 1 };
  }
  const inc = c.code === 'inc', bmi = Math.round((23 + r() * (inc ? 17 : 12)) * 10) / 10, dm = r() < (inc ? .3 : .15);
  const loc = inc ? (r() < .82 ? ['M2', 'M3', 'M3', 'M4', 'M3'][Math.floor(r() * 5)] : ['L1', 'L2', 'L3'][Math.floor(r() * 3)]) : (r() < .75 ? 'M3' : 'M2');
  const w = inc ? Math.round((2.5 + r() * 12) * 2) / 2 : Math.round((0.8 + r() * 3.4) * 2) / 2, l = inc ? Math.round((w * (1 + r() * .9)) * 2) / 2 : Math.round((w * (1 + r() * .3)) * 2) / 2;
  return { type: inc ? 'incisional' : (loc === 'M2' ? 'epigastric' : 'umbilical'), loc: loc, w: w, l: l, defects: r() < .15 ? 2 : 1, rec: inc && r() < .25 ? 1 : 0, mesh0: inc && r() < .15 ? 1 : 0,
    cdc: inc && r() < .12 ? 2 : 1, lod: inc && w > 10 && r() < .5 ? Math.round(10 + r() * 20) : 0, bmi: bmi, smoker: r() < .22 ? 1 : 0, dm: dm ? 1 : 0, a1c: dm ? Math.round((6.4 + r() * 2.6) * 10) / 10 : '',
    copd: r() < .12 ? 1 : 0, ster: r() < .05 ? 1 : 0, anticoag: r() < .14 ? 1 : 0, ssi0: inc && r() < .2 ? 1 : 0, stoma: inc && r() < .08 ? 1 : 0, prior: inc ? ['לפרוטומיה אחרי ניקוב', 'כריתת סיגמואיד', 'ניתוח ויפל', 'כריתת כיס מרה פתוחה', 'לפרוטומיה אחרי טראומה'][Math.floor(r() * 5)] : '' };
}
function ops_orbAll(code) {
  const u = me_(code); if (ORB_SEE_.indexOf(u.role) < 0) throw new Error('אין הרשאה');
  bankSeed_(); portSeed_();
  const P = get_('people') || [], nm = id => { const x = P.find(q => q.id === id); return x ? (x.full || x.name) : ''; }, plans = get_('orbplans') || {}, today = todayIso_();
  const cases = [].concat(...BANK_TEAMS_.map(T => (get_('bank:' + T.id) || []).filter(c => ORB_CODES_[c.code] && c.st !== 'done' && c.st !== 'cancel').map(c => ({ id: c.id, n: c.n, age: c.age, sex: c.sex, code: c.code, diag: c.diag, asa: c.asa, pri: c.pri, add: c.add, sur: c.sur, surN: nm(c.sur), sch: c.sch || null, prof: orbProfile_(c), plan: plans[c.id] || null }))));
  cases.sort((a, b) => (b.plan ? 1 : 0) - (a.plan ? 1 : 0) || a.add.localeCompare(b.add));
  const res = P.filter(p => p.role === 'resident' && !p.cand).map(p => { const port = get_('port:' + p.id) || { start: today.slice(0, 7) }, A = logAll_(p.id, port, today), L = A.filter(x => x[2] === 'umb' || x[2] === 'vent'), S = L.filter(x => x[3] === 'S'), Z = S.filter(x => +x[9]).map(x => +x[9]), G = A.filter(x => (x[2] === 'ing' || x[2] === 'tapp') && x[3] === 'S');
    const mo = Math.max(1, (+today.slice(0, 4) - +port.start.slice(0, 4)) * 12 + (+today.slice(5, 7) - +port.start.slice(5, 7)));
    return { id: p.id, n: p.full || p.name, mo: mo, all: L.length, s: S.length, vent: S.filter(x => x[2] === 'vent').length, si: G.length, lap: G.filter(x => x[2] === 'tapp').length, z: Z.length ? Math.round(Z.reduce((a, b) => a + b, 0) / Z.length * 10) / 10 : 0, last: S.length ? S.map(x => x[1]).sort().pop() : '' }; });
  const sen = P.filter(p => p.role === 'senior').map(p => ({ id: p.id, n: p.full || p.name }));
  return { today: today, cases: cases, res: res, sen: sen, can: canWrite_(u, 'orb') };
}
function ops_orbSave(code, cid, inp, plan, st) {
  const u = me_(code); if (!canWrite_(u, 'orb')) throw new Error('אין הרשאה לשמור כאן');
  const plans = get_('orbplans') || {}, ok = ['draft', 'approved'].indexOf(st) >= 0 ? st : 'draft';
  const clean = JSON.parse(JSON.stringify(inp || {})), sum = String(plan && plan.sum || '').slice(0, 300), kit = (plan && plan.kit || []).slice(0, 30).map(x => String(x).slice(0, 120));
  plans[cid] = { inp: clean, sum: sum, kit: kit, st: ok, by: u.name, at: new Date().toISOString(), res: String(clean.res || ''), zt: +clean.zt || 0 };
  set_('orbplans', plans, u.name);
  // an approved plan travels with the case: the bank shows it, and the OR list gets the kit
  if (ok === 'approved') BANK_TEAMS_.forEach(T => { const L = get_('bank:' + T.id) || [], c = L.find(x => x.id === cid); if (c) { c.orb = { sum: sum, kit: kit, at: plans[cid].at }; set_('bank:' + T.id, L, u.name); } });
  return plans[cid];
}
