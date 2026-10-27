/**
 * Surgery X | שרת האפליקציה (גרסה 6)
 * קורא וכותב לאותו גיליון: תגובות הטופס, הערכת צוות, תוכן הפורטל ופניות.
 */
const WA = {
  SKILLS: ['כתיבת קבלות ושחרורים', 'כתיבת מעקב רפואי בביקור', 'לקיחת דמים והכנסת וונפלון', 'ביצוע ופענוח אק״ג', 'תפירה וקשירות', 'עזרה בחדר ניתוח'],
  SETTINGS: 'הגדרות ורשימות',
  FORM_URL: 'https://docs.google.com/forms/d/e/DEMO_ID_4/viewform',
  FORM_ID: 'DEMO_ID_5',
  NOTES: 'פניות סטאז׳רים',
  CONTENT: 'תוכן פורטל',
  ALL: 'כל החודשים'
};
const STAGE_WORDS = { start: ['פתיחת', 'פתיחה'], mid: ['אמצע'], end: ['סוף', 'סיום'] };

const APP_ICON = 'https://lh3.googleusercontent.com/d/DEMO_ID_6=s512?.png';
function doGet(e) {
  if (e && e.parameter && e.parameter.j) return joinPage_(String(e.parameter.j));
  const isIntern = e && e.parameter && e.parameter.t;
  const out = HtmlService.createHtmlOutputFromFile(isIntern ? 'Intern' : 'Index')
    .setTitle(isIntern ? 'Surgery X · סטאז׳רים | הסבב שלי' : 'Surgery X · סטאז׳רים | ניהול')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  try { out.setFaviconUrl(APP_ICON); } catch (err) { Logger.log('favicon: ' + err.message); }
  return out;
}

/* short registration link: ?j=2611 (November 2026) or ?j=2611s (selective) opens the form with the month and track already selected */
const JOIN_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
function joinUrl_(code) {
  const m = String(code || '').match(/^(\d{2})(\d{2})([st]?)$/);
  if (!m || +m[2] < 1 || +m[2] > 12) return WA.FORM_URL;
  return prefill_('', JOIN_MONTHS[+m[2] - 1] + ' 20' + m[1], 'פתיחה', m[3] === 's' ? 'סלקטיב' : m[3] === 't' ? 'רק תורנויות' : '') || WA.FORM_URL;
}
function joinPage_(code) {
  const url = joinUrl_(code).replace(/"/g, '&quot;');
  const html = '<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><base target="_top"><style>'
    + 'html,body{margin:0;height:100%;background:radial-gradient(120% 90% at 85% 0%,#1E5060 0%,#0C2A35 55%,#061A21 100%);color:#F5F2EA;font-family:Assistant,Arial,sans-serif}'
    + '.w{min-height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:24px;text-align:center;box-sizing:border-box}'
    + 'small{color:#36E0A0;font-weight:800;letter-spacing:1.6px;font-size:12px}h1{margin:0;font-size:28px}p{margin:0;color:#C9D4D6;font-size:16px;max-width:340px;line-height:1.5}'
    + 'a{display:inline-block;background:linear-gradient(135deg,#E2B66A,#B8863B);color:#0C2A35;font-weight:800;font-size:18px;text-decoration:none;border-radius:999px;padding:14px 34px;box-shadow:0 10px 24px rgba(0,0,0,.3)}'
    + '</style></head><body><div class="w"><small>SURGERY X</small><h1>הרשמה לסבב בכירורגיה</h1><p>טופס קצר של כ-5 דקות. מיד אחריו יגיע אליכם במייל קישור לאפליקציה האישית של הסבב.</p>'
    + '<a id="go" href="' + url + '" target="_top">למילוי טופס ההרשמה ←</a></div>'
    + '<script>try{window.top.location.href=document.getElementById("go").href;}catch(e){}</script></body></html>';
  return HtmlService.createHtmlOutput(html).setTitle('Surgery X · סטאז׳רים | הרשמה לסבב').addMetaTag('viewport', 'width=device-width, initial-scale=1').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/* ================= managers & access ================= */
function props_() { return PropertiesService.getScriptProperties(); }
function admins_() {
  const p = props_();
  let list = [];
  try { list = JSON.parse(p.getProperty('ADMINS') || '[]'); } catch (e) { list = []; }
  if (!list.length) {
    const old = p.getProperty('STAFF_PIN');
    if (old) { list = [{ name: 'ד״ר איתן רז', role: 'owner', code: old }]; p.setProperty('ADMINS', JSON.stringify(list)); }
  }
  // every manager gets a stable id (messages refer to it, so names and codes can change)
  if (list.some(a => !a.id)) { list.forEach(a => { if (!a.id) a.id = 'm' + Utilities.getUuid().slice(0, 8); }); p.setProperty('ADMINS', JSON.stringify(list)); }
  return list;
}
function isOwnerSession_() {
  try { const a = Session.getActiveUser().getEmail(); return !!a && a === Session.getEffectiveUser().getEmail(); } catch (e) { return false; }
}
function who_(code) {
  if (isOwnerSession_()) { const o = admins_().filter(a => a.role === 'owner')[0]; return o || { name: 'ד״ר איתן רז', role: 'owner' }; }
  code = String(code || '').trim();
  if (!code) return null;
  return admins_().filter(a => String(a.code) === code)[0] || null;
}
function need_(code) { const w = who_(code); if (!w) throw new Error('BADCODE'); return w; }
// device sign-in for the home-screen app: Safari wipes storage inside the Google frames when the app closes, so a phone keeps
// a long random key on the wrapper site instead. The server stores only its hash, mapped to a manager id, and hands back that
// manager's current code. Logout forgets the key; a changed code keeps working because the key points at the id
function devTokens_() { let o = {}; try { o = JSON.parse(props_().getProperty('DEV_TOKENS') || '{}'); } catch (e) {} return o || {}; }
function devHash_(t) { return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 'sx|' + String(t || ''))); }
function wa_devToken(code, label) {
  const a = meAdmin_(code), lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const t = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, ''), o = devTokens_();
    o[devHash_(t)] = { id: a.id, at: nowStr_(), label: String(label || '').slice(0, 60) };
    const ks = Object.keys(o); if (ks.length > 40) ks.slice(0, ks.length - 40).forEach(k => delete o[k]);
    props_().setProperty('DEV_TOKENS', JSON.stringify(o)); return t;
  } finally { lock.releaseLock(); }
}
function wa_devLogin(t) {
  if (!t || String(t).length < 40) return null;
  const r = devTokens_()[devHash_(t)]; if (!r) return null;
  const a = admins_().filter(x => x.id === r.id)[0]; return a && a.code ? String(a.code) : null;
}
function wa_devForget(t) {
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try { const o = devTokens_(); delete o[devHash_(t)]; props_().setProperty('DEV_TOKENS', JSON.stringify(o)); return true; } finally { lock.releaseLock(); }
}

function wa_boot(code) {
  const list = admins_();
  if (!list.length && !isOwnerSession_()) return { state: 'setup' };
  const w = who_(code);
  if (!w) return { state: 'login', bad: !!code };
  let data = dataCached_();
  if (canEdit_(w)) { try { if (syncTextReqs_(data, false)) data = dataCached_(); } catch (e) { Logger.log('text requests: ' + e.message); } }
  data.usage = usageAll_();
  return { state: 'ok', me: { name: w.name, role: w.role, p: profileOut_(w) }, admins: w.role === 'owner' ? list : list.map(a => ({ name: a.name, role: a.role })), data: data, auto: w.role === 'owner' ? autoStatus_() : null };
}
/* ================= managers' personal profiles ================= */
const STAFF_STATUS = ['מומחה', 'מומחית', 'מתמחה', 'מנהל המערך', 'מנהלת המערך', 'אחר'];
function profileOut_(a) {
  const p = Object.assign({}, (a && a.p) || {});
  if (a && a.role === 'owner' && !p.email) p.email = 'team@surgeryx.example';
  if (p.show === undefined) p.show = a && a.role !== 'director';
  p.photo = p.photoId ? photo_(p.photoId) : '';
  return p;
}
/* every role (also view-only) may edit its own profile, and only its own */
function wa_saveMyProfile(code, prof, photoDataUrl) {
  const w = need_(code), list = admins_();
  const i = list.findIndex(a => String(a.code) === String(w.code) || (!w.code && a.role === 'owner' && w.role === 'owner'));
  if (i < 0) throw new Error('המשתמש לא נמצא');
  const a = list[i], cur = a.p || {}, s = (v, n) => String(v == null ? '' : v).trim().slice(0, n);
  prof = prof || {};
  const p = prof.seenOnly ? Object.assign({}, cur, { seen: 1 }) : {
    prefix: ['ד״ר', 'פרופ׳', ''].indexOf(prof.prefix) >= 0 ? prof.prefix : 'ד״ר',
    first: s(prof.first, 30), last: s(prof.last, 40),
    status: STAFF_STATUS.indexOf(prof.status) >= 0 ? prof.status : '', role: s(prof.role, 60),
    phone: s(prof.phone, 20).replace(/[^\d+\- ]/g, ''), email: s(prof.email, 80).toLowerCase(),
    show: prof.show !== false, photoId: cur.photoId || '', seen: 1
  };
  if (p.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email)) throw new Error('כתובת המייל לא תקינה');
  if (photoDataUrl) p.photoId = savePhoto_('staff:' + (a.name || ''), photoDataUrl);
  if (prof.removePhoto) p.photoId = '';
  a.p = p;
  if (!prof.seenOnly && p.first) a.name = [p.prefix, p.first, p.last].filter(Boolean).join(' ').slice(0, 60);
  list[i] = a; props_().setProperty('ADMINS', JSON.stringify(list));
  return { name: a.name, role: a.role, p: profileOut_(a) };
}
/* what interns see in the "צוות" tab: no codes, only people who chose to be shown */
function staffPublic_() {
  const raw = props_().getProperty('ADMINS') || '', ck = 'staff2_' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, raw, Utilities.Charset.UTF_8));
  try { const hit = cacheGetBig_(ck); if (hit) return hit; } catch (e) {}
  const out = staffPublicRaw_(); cachePutBig_(ck, out, 3600); return out;
}
/* staff photos load after the page (they are the heaviest part); only ids of managers shown to interns are served */
// "what's new in surgery": the department portal (Surgery X) keeps the latest PubMed papers and FDA devices and copies them,
// once they change, to a hidden tab here. Any intern link or manager code may read it; nothing personal is in it
function wa_news(key) {
  try { keyFrom_(key); } catch (e) { need_(key); }
  const c = CacheService.getScriptCache(), hit = c.get('opsnews'); if (hit) return JSON.parse(hit);
  const sh = SpreadsheetApp.getActive().getSheetByName('Surgery X · חדשות'); if (!sh || sh.getLastRow() < 1) return null;
  const j = String(sh.getRange(1, 2).getValue() || ''); if (!j) return null;
  try { c.put('opsnews', j, 1800); } catch (e) {} return JSON.parse(j);
}
// events for the department portal (Surgery X): a hidden tab it reads every hour and turns into a push to the owner's phone.
// Names and request types only, never free text
function opsEvent_(title, body) {
  try { const ss = SpreadsheetApp.getActive(); let sh = ss.getSheetByName('Surgery X · אירועים'); if (!sh) { sh = ss.insertSheet('Surgery X · אירועים'); try { sh.hideSheet(); } catch (e) {} }
    sh.appendRow([new Date().toISOString(), String(title || '').slice(0, 80), String(body || '').slice(0, 160)]);
    if (sh.getLastRow() > 400) sh.deleteRows(1, sh.getLastRow() - 300); } catch (e) { Logger.log('ops event: ' + e.message); }
}
// errors from the screens of interns and managers (message and screen only), for the daily health check in Surgery X
function wa_clientErr(app, where, msg) {
  const c = CacheService.getScriptCache(), n = Number(c.get('cerrN') || 0); if (n > 30) return false; c.put('cerrN', String(n + 1), 600);
  try { const ss = SpreadsheetApp.getActive(); let sh = ss.getSheetByName('Surgery X · שגיאות'); if (!sh) { sh = ss.insertSheet('Surgery X · שגיאות'); try { sh.hideSheet(); } catch (e) {} }
    sh.appendRow([new Date().toISOString(), String(app || '').slice(0, 20), String(where || '').slice(0, 40), String(msg || '').slice(0, 300)]);
    if (sh.getLastRow() > 500) sh.deleteRows(1, sh.getLastRow() - 400); } catch (e) {}
  return true;
}
function wa_staffPhoto(token, pid) { keyFrom_(token); pid = String(pid || ''); if (!staffPublic_().some(s => s.pid === pid)) return ''; return photo_(pid); }
function staffPublicRaw_() {
  const order = { owner: 0, admin: 1, viewer: 2, director: 3 };
  return admins_().map(a => ({ a, p: profileOut_(a) })).filter(x => x.p.show).sort((x, y) => (order[x.a.role] || 9) - (order[y.a.role] || 9))
    .map(x => ({ name: x.a.name, status: x.p.status || '', role: x.p.role || '', phone: x.p.phone || '', email: x.p.email || '', pid: (x.a.p && x.a.p.photoId) || '' }));
}

/* ================= messages between managers ================= */
const MMH = ['מזהה', 'נשלח', 'מאת (מזהה)', 'מאת', 'אל', 'הודעה', 'נקרא ע״י'];
function mmSheet_() { return textSheet_('התכתבויות מנהלים', MMH); }
function meAdmin_(code) { const w = need_(code); const a = admins_().filter(x => (w.code && String(x.code) === String(w.code)) || (!w.code && x.role === 'owner' && w.role === 'owner'))[0]; if (!a) throw new Error('BADCODE'); return a; }
function mmPeople_() { return admins_().map(a => { const p = profileOut_(a); return { id: a.id, name: a.name, role: a.role, photo: p.photo || '', email: p.email || '' }; }); }
function mmList_(me) {
  return rowsOf_(mmSheet_(), MMH.length).filter(r => r[0]).map(r => ({ id: r[0], at: r[1], from: r[2], fromName: r[3], to: String(r[4] || 'all'), text: r[5], read: String(r[6] || '').split(',').filter(Boolean) }))
    .filter(m => m.to === 'all' || m.from === me.id || m.to.split(',').indexOf(me.id) >= 0).slice(-200)
    .map(m => ({ id: m.id, at: m.at, from: m.from, fromName: m.fromName, to: m.to, text: m.text, mine: m.from === me.id, unread: m.from !== me.id && m.read.indexOf(me.id) < 0 }));
}
/* every role (also view-only) can write to the other managers */
function wa_mgrMsgs(code) { const me = meAdmin_(code); return { me: me.id, people: mmPeople_().map(x => ({ id: x.id, name: x.name, role: x.role, photo: x.photo })), msgs: mmList_(me) }; }
function wa_mgrSend(code, to, text, byMail) {
  const me = meAdmin_(code), people = mmPeople_();
  text = String(text || '').trim().slice(0, 2000); if (!text) throw new Error('ההודעה ריקה');
  const ids = to === 'all' ? 'all' : (Array.isArray(to) ? to : [to]).filter(id => people.some(p => p.id === id) && id !== me.id);
  if (ids !== 'all' && !ids.length) throw new Error('צריך לבחור למי לשלוח');
  const toStr = ids === 'all' ? 'all' : ids.join(',');
  const sh = mmSheet_();
  sh.getRange(sh.getLastRow() + 1, 1, 1, MMH.length).setNumberFormat('@').setValues([['mm' + Date.now().toString(36), nowStr_(), me.id, me.name, toStr, text, me.id]]);
  if (byMail) { const rc = people.filter(p => p.id !== me.id && (toStr === 'all' || ids.indexOf(p.id) >= 0) && p.email);
    rc.forEach(p => { try { send_('הודעה בין מנהלים', 'mm|' + Date.now() + '|' + p.id, p.email, '💬 הודעה מ' + me.name + ' · Surgery X', mailHtml_('💬 הודעה מ' + esc_(me.name), [esc_(text).replace(/\n/g, '<br>'), 'אפשר לענות מהדשבורד, בכפתור ההודעות.'], dashUrl_() ? { label: 'לדשבורד', url: dashUrl_() } : null), null); } catch (e) {} }); }
  return wa_mgrMsgs(code);
}
function wa_mgrRead(code, ids) {
  const me = meAdmin_(code), want = new Set((ids || []).map(String)); if (!want.size) return true;
  const sh = mmSheet_(), n = sh.getLastRow(); if (n < 2) return true;
  const col = sh.getRange(2, 1, n - 1, MMH.length).getDisplayValues();
  col.forEach((r, k) => { if (!want.has(r[0])) return; const rd = String(r[6] || '').split(',').filter(Boolean); if (rd.indexOf(me.id) < 0) { rd.push(me.id); sh.getRange(k + 2, 7).setNumberFormat('@').setValue(rd.join(',')); } });
  return true;
}

/* first-time setup when no code exists yet: the first code entered becomes the owner's */
function wa_setup(code, name) {
  if (admins_().length) throw new Error('המערכת כבר מוגדרת');
  code = String(code || '').trim();
  if (!/^\d{4,8}$/.test(code)) throw new Error('הקוד צריך להיות 4 עד 8 ספרות');
  props_().setProperty('ADMINS', JSON.stringify([{ name: String(name || 'ד״ר איתן רז'), role: 'owner', code: code }]));
  return true;
}
function wa_saveAdmins(code, list) {
  const w = need_(code);
  if (w.role !== 'owner') throw new Error('רק בעל המערכת יכול לנהל משתמשים');
  bump_();
  const old = admins_();
  const clean = (list || []).map(a => ({ name: String(a.name || '').trim().slice(0, 60), role: ['owner', 'director', 'viewer'].indexOf(a.role) >= 0 ? a.role : 'admin', code: String(a.code || '').trim() }))
    .filter(a => a.name && /^\d{4,8}$/.test(a.code));
  // personal profiles (photo, phone, title) survive edits to the managers list
  clean.forEach(a => { const o = old.filter(x => String(x.code) === a.code)[0] || old.filter(x => x.name === a.name)[0]; if (o && o.p) a.p = o.p; a.id = (o && o.id) || 'm' + Utilities.getUuid().slice(0, 8); });
  if (!clean.some(a => a.role === 'owner')) throw new Error('חייב להישאר בעל מערכת אחד');
  const codes = clean.map(a => a.code);
  if (new Set(codes).size !== codes.length) throw new Error('לכל מנהל צריך קוד אחר');
  props_().setProperty('ADMINS', JSON.stringify(clean));
  return clean;
}

/* ================= helpers ================= */
function str_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
  return v === null || v === undefined ? '' : String(v).trim();
}
function dateKey_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return str_(v);
}
/* intern month as a number string 1–12, from answers like "4" or "חודש 4" */
function imonth_(v) { const m = String(v || '').match(/\d{1,2}/); const n = m ? +m[0] : 0; return n >= 1 && n <= 12 ? String(n) : ''; }
function num_(v) { const n = Number(v); return isFinite(n) && n > 0 ? n : null; }
function fileId_(url) { const m = String(url || '').match(/[-\w]{25,}/); return m ? m[0] : ''; }
function norm_(x) { return String(x).replace(/[?\s:]+$/, '').trim(); }

/* finds the 6 skill columns of a stage, whether the form uses a grid or separate questions */
function skillCols_(H, stage) {
  const words = STAGE_WORDS[stage];
  const gridPrefix = { start: 'דירוג עצמי בפתיחת הסבב', mid: 'דירוג עצמי באמצע הסבב', end: 'דירוג עצמי בסוף הסבב' }[stage];
  const grid = H.map((h, i) => h.startsWith(gridPrefix + ' [') ? i : -1).filter(i => i >= 0);
  return WA.SKILLS.map((s, k) => {
    // separate question per skill, e.g. "כתיבת קבלות ושחרורים · פתיחה"
    const sep = H.findIndex(h => h.indexOf(s) >= 0 && words.some(w => h.indexOf(w) >= 0) && h.indexOf('[') < 0);
    if (sep >= 0) return sep;
    // start-stage questions may carry the bare skill name (no stage word in the title)
    if (stage === 'start') { const other = STAGE_WORDS.mid.concat(STAGE_WORDS.end), bare = H.findIndex(h => h.indexOf(s) >= 0 && h.indexOf('[') < 0 && !other.some(w => h.indexOf(w) >= 0)); if (bare >= 0) return bare; }
    const ex = H.indexOf(gridPrefix + ' [' + s + ']');
    if (ex >= 0) return ex;
    return grid[k] !== undefined ? grid[k] : -1;
  });
}
function pick_(row, cols) { return cols.map(i => i >= 0 ? num_(row[i]) : null); }
function anyVal_(a) { return a && a.some(x => x); }

/* ================= main data ================= */
/* ================= fast loading: cached data for the read-only entry points (wa_boot, wa_intern) =================
   The cache key changes whenever the spreadsheet file changes (Drive "last updated": form answers, script writes, manual edits)
   or whenever a write function calls bump_(). Property-backed parts (settings, flags, stations, week state) are always read fresh. */
function bump_() { try { props_().setProperty('DATA_BUMP', String(Date.now())); } catch (e) {} }
function dataVer_() {
  let v = '';
  try { v = String(DriveApp.getFileById(SpreadsheetApp.getActive().getId()).getLastUpdated().getTime()); } catch (e) { return ''; }
  return v + '.' + (props_().getProperty('DATA_BUMP') || '0');
}
function cacheGetBig_(key) {
  const c = CacheService.getScriptCache(), n = Number(c.get(key + ':n') || 0); if (!n) return null;
  const ks = []; for (let k = 0; k < n; k++) ks.push(key + ':' + k);
  const got = c.getAll(ks); if (ks.some(k => got[k] == null)) return null;
  try { return JSON.parse(ks.map(k => got[k]).join('')); } catch (e) { return null; }
}
function cachePutBig_(key, obj, sec) {
  try { const s = JSON.stringify(obj), size = 90000, o = {}; let n = 0; for (let k = 0; k < s.length; k += size) o[key + ':' + n++] = s.slice(k, k + size);
    if (n > 20) return; o[key + ':n'] = String(n); CacheService.getScriptCache().putAll(o, sec || 600); } catch (e) {}
}
function dataCached_() {
  const ver = dataVer_();
  let d = ver ? cacheGetBig_('dv' + ver) : null;
  if (d) { Object.assign(ALT_MAP_, d.__alt || {}); }
  else { d = data_(); if (ver) cachePutBig_('dv' + ver, Object.assign({}, d, { __alt: ALT_MAP_ }), 900); }
  delete d.__alt;
  d.settings = settings_(); d.weekState = weekState_(); d.stations = stations_(); d.flags = flags_(); d.deckLive = deckLive_(); d.dutyPrefs = dutyPrefs_(); d.dutyPub = dutyPub_();
  return d;
}
function data_() {
  const ss = SpreadsheetApp.getActive();
  const set = ss.getSheetByName(WA.SETTINGS);
  const respName = str_(set.getRange('B3').getValue());
  const staffName = str_(set.getRange('B4').getValue());
  const months = set.getRange('A8:A40').getValues().map(r => str_(r[0])).filter(m => /^[\u0590-\u05FF]+ \d{4}$/.test(m));

  const rs = ss.getSheetByName(respName);
  const rv = rs ? rs.getDataRange().getValues() : [[]];
  const H = rv[0].map(str_);
  const c = (name, re) => { let i = H.findIndex(h => norm_(h) === norm_(name)); if (i < 0) i = H.findIndex(h => h.startsWith(norm_(name))); if (i < 0 && re) i = H.findIndex(h => re.test(h)); return i; };
  const C = {
    email: c('כתובת אימייל', /אימייל|Email/i), name: c('שם מלא'), month: c('חודש הסבב'), stage: c('באיזה שלב של הסבב את/ה?', /באיזה שלב/),
    phone: c('טלפון נייד', /טלפון/), inst: c('מוסד לימודים', /מוסד/), interest: c('עניין בכירורגיה', /מתענ|עניין/), expect: c('מה הציפיות שלך מהסבב?', /ציפיות/),
    photo: c('תמונה אישית', /תמונה/), midSat: c('איך הסבב עד עכשיו?', /עד עכשיו/), works: c('מה עובד טוב?', /עובד טוב/), improve: c('מה כדאי לשפר?', /לשפר/),
    sat: c('שביעות רצון כללית מהסבב', /שביעות רצון/), seminar: c('כמה הועיל לך סמינר הסטאז׳רים?', /סמינר/), recommend: c('האם תמליץ/י על הסבב לחברים?', /תמליץ/),
    consider: c('שוקל/ת התמחות בכירורגיה?', /שוקל/), free: c('משוב חופשי', /משוב חופשי/),
    start: skillCols_(H, 'start'), mid: skillCols_(H, 'mid'), end: skillCols_(H, 'end'),
    block: H.map((h, i) => /לא אוכל להיות תורן/.test(h) ? i : -1).filter(i => i >= 0),
    dutyNote: H.findIndex(h => /(הערות|בקשות).*תורנ/.test(h)),
    track: H.findIndex(h => /מסלול/.test(h)),
    extra: H.findIndex(h => /תורנויות נוספות/.test(h)),
    absPlan: H.findIndex(h => /היעדרויות מתוכננות/.test(h)),
    alt: H.findIndex(h => /ליצירת קשר/.test(h)),
    imonth: H.findIndex(h => /חודש.*בסטאז/.test(h)),
    hospital: H.findIndex(h => /^מאיזה בית חולים/.test(h)),
    thuFri: H.findIndex(h => /חמישי.*שישי/.test(h) && /מעדיף/.test(h))
  };
  const g = (row, i) => i >= 0 ? row[i] : '';

  const map = {};
  for (let r = 1; r < rv.length; r++) {
    const row = rv[r];
    const email = (str_(g(row, C.email)) || (C.alt >= 0 ? str_(row[C.alt]) : '')).toLowerCase().trim();
    if (!email) continue;
    const month = str_(g(row, C.month));
    const key = email + '|' + month;
    const it = map[key] || (map[key] = { key: key, email: email, month: month, name: '', phone: '', inst: '', interest: '', expect: '', photoId: '',
      start: null, mid: null, end: null, midSat: null, works: '', improve: '', sat: null, seminar: null, recommend: null, consider: '', free: '', staff: null });
    it.name = str_(g(row, C.name)) || it.name;
    const stage = str_(g(row, C.stage)) || 'פתיחה';
    if (stage === 'פתיחה') {
      it.phone = str_(g(row, C.phone)); it.inst = str_(g(row, C.inst)); it.interest = str_(g(row, C.interest)); if (C.imonth >= 0) it.imonth = imonth_(g(row, C.imonth)); if (C.hospital >= 0) it.hospital = str_(g(row, C.hospital)); if (C.thuFri >= 0) it.thuFri = /^כן/.test(str_(g(row, C.thuFri)));
      it.expect = str_(g(row, C.expect)); it.photoId = fileId_(g(row, C.photo)) || it.photoId;
      const v = pick_(row, C.start); if (anyVal_(v)) it.start = v;
      it.blocked = [].concat.apply([], C.block.map(i => { const v = row[i], k = dateKey_(v); if (/^\d{4}-\d{2}-\d{2}$/.test(k)) return [k]; const y = (String(it.month || '').match(/\d{4}/) || [''])[0]; return String(v || '').split(',').map(t => { const m = t.match(/(\d{1,2})\/(\d{1,2})/); return m && y ? y + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2) : ''; }); })).filter(x => /^\d{4}-\d{2}-\d{2}$/.test(x));
      it.dutyNote = C.dutyNote >= 0 ? str_(row[C.dutyNote]) : '';
      if (C.track >= 0) { const tv = str_(row[C.track]); it.track = /רק תורנויות/.test(tv) ? 'רק תורנויות' : /סלקטיב/.test(tv) ? 'סלקטיב' : /אלקטיב/.test(tv) ? 'אלקטיב' : 'רגיל'; }
      if (C.alt >= 0) { const ae = str_(row[C.alt]).toLowerCase(); if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(ae) && ae !== email) { it.altEmail = ae; ALT_MAP_[email] = ae; } }
      if (C.extra >= 0) it.extra = /^כן/.test(str_(row[C.extra])); it.absPlan = C.absPlan >= 0 ? str_(row[C.absPlan]) : '';
    } else if (stage === 'אמצע') {
      const v = pick_(row, C.mid); if (anyVal_(v)) it.mid = v;
      it.midSat = num_(g(row, C.midSat)); it.works = str_(g(row, C.works)); it.improve = str_(g(row, C.improve));
    } else if (stage === 'סיום') {
      const v = pick_(row, C.end); if (anyVal_(v)) it.end = v;
      it.sat = num_(g(row, C.sat)); it.seminar = num_(g(row, C.seminar)); it.recommend = num_(g(row, C.recommend));
      it.consider = str_(g(row, C.consider)); it.free = str_(g(row, C.free));
    }
    it.stages = it.stages || {};
    if (stage) it.stages[stage] = true;
  }

  try { stageFb_().forEach(f => { const it = map[f.key]; if (!it) return;
    if (f.stage === 'אמצע') { if (anyVal_(f.skills)) it.mid = f.skills; it.midSat = f.midSat; it.works = f.works; it.improve = f.improve; }
    else if (f.stage === 'סיום') { if (anyVal_(f.skills)) it.end = f.skills; it.sat = f.sat; it.seminar = f.seminar; it.recommend = f.recommend; it.consider = f.consider; it.free = f.free; }
    it.stages = it.stages || {}; it.stages[f.stage] = true; }); } catch (e) {}
  try { dayLogs_().filter(x => x.kind !== 'יומי').sort((a, b) => a.date.localeCompare(b.date)).forEach(x => { const it = map[x.key]; if (!it) return;
    it.stages = it.stages || {};
    if (x.kind === 'סיכום סבב') { if (x.skills) it.end = x.skills; if (x.sat) it.sat = x.sat; if (x.seminar) it.seminar = x.seminar; if (x.recommend) it.recommend = x.recommend; if (x.consider) it.consider = x.consider; if (x.free) it.free = x.free; it.stages['סיום'] = true; }
    else { if (x.skills) it.mid = x.skills; if (x.prog) it.midSat = x.prog; if (x.exposure || x.feel) it.works = [x.exposure, x.feel].filter(Boolean).join(' · '); if (x.improve) it.improve = x.improve; it.stages['אמצע'] = true; } }); } catch (e) {}
  const st = ss.getSheetByName(staffName);
  if (st && st.getLastRow() > 1) {
    const sv = st.getDataRange().getValues();
    const SH = sv[0].map(str_);
    const s = name => SH.indexOf(name);
    const sk = SH.map((h, i) => h.startsWith('הערכה:') ? i : -1).filter(i => i >= 0).slice(0, 6);
    for (let r = 1; r < sv.length; r++) {
      const row = sv[r];
      const email = str_(row[s('אימייל סטאז׳ר')]).toLowerCase();
      if (!email) continue;
      const key = email + '|' + str_(row[s('חודש הסבב')]);
      if (!map[key]) continue;
      map[key].staff = { skills: sk.map(i => num_(row[i])), prof: num_(row[s('מקצועיות ואחריות')]), cand: str_(row[s('מועמד/ת להתמחות')]),
        summary: str_(row[s('סיכום והמלצות')]), by: str_(row[s('הוזן ע״י')]), date: str_(row[s('תאריך')]) };
    }
  }

  let base = '';
  try { base = APP_URL || ScriptApp.getService().getUrl() || ''; } catch (e) {}
  const OV = overrides_(), deletedInterns = [];
  Object.keys(OV).forEach(k => { const o = OV[k]; if (o.manual && !map[k]) map[k] = Object.assign({ key: k, email: '', month: '', name: '', phone: '', inst: '', interest: '', expect: '', photoId: '', start: null, mid: null, end: null, midSat: null, works: '', improve: '', sat: null, seminar: null, recommend: null, consider: '', free: '', staff: null, stages: { 'פתיחה': true } }, { manual: true }); });
  Object.keys(map).forEach(k => { const o = OV[k]; if (!o) return; if (o.data) { Object.assign(map[k], o.data, { key: k }); if (!o.manual && Object.keys(o.data).some(f => f !== 'photoId' && !(o.data.selfIntake && ['start', 'inst', 'expect', 'extra', 'selfIntake'].indexOf(f) >= 0))) map[k].edited = true; } if (o.manual) map[k].manual = true; if (o.deleted) { map[k].deleted = true; deletedInterns.push({ key: k, name: map[k].name, month: map[k].month }); } });
  const interns = Object.keys(map).map(k => map[k]).filter(i => !i.deleted && (i.start || i.mid || i.end || (i.stages && i.stages['פתיחה'])));
  const R = roster_();
  interns.forEach(i => { i.link = base ? base + '?t=' + token_(i.key) : ''; i.wing = wingFor_(R, i); if (!i.track && rosterTrack_(R, i)) i.track = rosterTrack_(R, i); });

  const feedback = [];
  const ns = ss.getSheetByName(WA.NOTES);
  if (ns && ns.getLastRow() > 1) {
    const nh = ns.getRange(1, 1, 1, ns.getLastColumn()).getValues()[0].map(str_);
    const ni = n => nh.indexOf(n);
    ns.getRange(2, 1, ns.getLastRow() - 1, ns.getLastColumn()).getValues().forEach(r => feedback.push({
      date: str_(r[0]), month: str_(r[1]), name: str_(r[2]), text: str_(r[ni('פנייה')]), topic: str_(r[ni('נושא')]) || 'כללי', mood: num_(r[ni('מצב רוח (1-5)')]) }));
  }
  return { months: months, skills: WA.SKILLS, interns: interns, feedback: feedback.reverse(), content: content_(), deletedInterns: deletedInterns, roster: R, settings: settings_(), duties: duties_(), fmorn: fmorn_(), dutyDraft: (() => { try { return dutyDraft_(); } catch (e) { return []; } })(), daylogs: dayLogs_(), dlActs: DL_ACTS, dutyBlocks: dutyBlocks_(), requests: requests_(), portalFb: portalFb_(), assigns: assigns_(), assignsDraft: assignsDraft_(), weekState: weekState_(), absences: absences_(), stations: stations_(), flags: flags_(), talks: (() => { try { return talks_(); } catch (e) { return []; } })(), formUrl: WA.FORM_URL, sheetUrl: ss.getUrl() };
}

/* ================= portal content (sessions, messages, literature) ================= */
const CH = ['מזהה', 'סוג', 'חודש', 'נמען', 'כותרת', 'פירוט', 'יום', 'תאריך', 'שעה', 'קישור', 'תגית', 'נוצר ע״י', 'עודכן', 'מוצמד'];
function contentSheet_() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(WA.CONTENT);
  if (!sh) {
    sh = ss.insertSheet(WA.CONTENT);
    sh.setRightToLeft(true);
    sh.getRange(1, 1, 1, CH.length).setValues([CH]).setFontWeight('bold').setBackground('#0C2A35').setFontColor('#FFFFFF');
    sh.setFrozenRows(1);
    sh.getRange('H:I').setNumberFormat('@');
    const seed = [
      [0, '07:15', 'ישיבת בוקר', '', 'meet'],
      [1, '07:00–07:30', 'לימודי מתמחים', '', 'study'], [1, '07:30', 'ישיבת בוקר', '', 'meet'],
      [2, '07:00', 'ישיבה אקדמית לכל הצוות', 'ג׳ורנל קלאב, M&M', 'meet'], [2, '11:00', 'טרום ניתוח', 'אגף צפון', 'clinic'],
      [3, '07:00–07:30', 'לימודי מתמחים', 'שלב א', 'study'], [3, '07:30', 'ישיבת צוות', '', 'meet'], [3, '10:00', 'סמינר סטאז׳רים', 'רופא בכיר מלמד נושא מעשי', 'you'],
      [3, '10:45', 'ישיבת רנטגן', '', 'meet'], [3, '11:00', 'טרום ניתוח', 'אגף דרום', 'clinic'],
      [4, '07:00', 'ישיבת צוות', 'ומעבר על ניתוחי השבוע הבא', 'meet']
    ];
    const now = new Date();
    const rows = seed.map((x, k) => ['s' + (k + 1), 'מפגש', WA.ALL, 'all', x[2], x[3], x[0], '', x[1], '', x[4], 'מערכת', now, '']);
    rows.push(['l1', 'ספרות', WA.ALL, 'all', "Schwartz's Principles of Surgery", 'ספר הלימוד המרכזי בכירורגיה כללית', '', '', '', '', 'ספר', 'מערכת', now, '']);
    rows.push(['l2', 'ספרות', WA.ALL, 'all', 'Sabiston Textbook of Surgery', 'מקור מקיף להעמקה', '', '', '', '', 'ספר', 'מערכת', now, '']);
    sh.getRange(2, 1, rows.length, CH.length).setValues(rows);
  }
  return sh;
}
function content_() {
  const sh = contentSheet_();
  seedSeminars_(sh);
  seedLiterature_(sh);
  seedVideos_(sh);
  seedGuides_(sh);
  if (sh.getLastRow() < 2) return [];
  const H = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(str_);
  const ix = n => H.indexOf(n);
  const rng = sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn());
  const disp = rng.getDisplayValues();
  return rng.getValues().map((r, k) => { r.__d = disp[k]; return r; }).filter(r => str_(r[ix('מזהה')])).map(r => ({
    id: str_(r[ix('מזהה')]), type: str_(r[ix('סוג')]), month: str_(r[ix('חודש')]) || WA.ALL, target: str_(r[ix('נמען')]) || 'all',
    title: str_(r[ix('כותרת')]), body: str_(r[ix('פירוט')]), day: r[ix('יום')] === '' ? null : Number(r[ix('יום')]), date: dateKey_(r[ix('תאריך')]),
    time: timeStr_(r[ix('שעה')], r.__d[ix('שעה')]), link: str_(r[ix('קישור')]), tag: str_(r[ix('תגית')]), by: str_(r[ix('נוצר ע״י')]), updated: str_(r[ix('עודכן')]), pinned: str_(r[ix('מוצמד')]) === 'כן'
  }));
}
function timeStr_(v, d) {
  if (!(v instanceof Date)) return str_(v);
  const m = String(d || '').match(/(\d{1,2}):(\d{2})/);
  return m ? ('0' + m[1]).slice(-2) + ':' + m[2] : str_(d);
}
function wa_saveContent(code, it) {
  const w = needEdit_(code);
  it = it || {};
  const type = ['מפגש', 'הודעה', 'ספרות', 'סמינר', 'וידאו', 'מדריך'].indexOf(it.type) >= 0 ? it.type : 'הודעה';
  const title = String(it.title || '').trim().slice(0, 200);
  if (!title) throw new Error('חסרה כותרת');
  const link = String(it.link || '').trim();
  if (link && !/^https?:\/\//i.test(link)) throw new Error('הקישור צריך להתחיל ב-https');
  const sh = contentSheet_();
  sh.getRange('H:I').setNumberFormat('@');
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const id = it.id || (type === 'מפגש' ? 's' : type === 'הודעה' ? 'm' : type === 'הדרכה' ? 'tr' : 'l') + Utilities.getUuid().slice(0, 8);
    const row = [id, type, String(it.month || WA.ALL), String(it.target || 'all'), title, String(it.body || '').slice(0, 3000),
      (it.day === null || it.day === undefined || it.day === '') ? '' : Number(it.day), String(it.date || ''), String(it.time || '').slice(0, 30), link,
      String(it.tag || '').slice(0, 20), w.name, new Date(), it.pinned ? 'כן' : ''];
    const n = sh.getLastRow();
    let target = 0;
    if (it.id && n > 1) {
      const ids = sh.getRange(2, 1, n - 1, 1).getValues();
      for (let r = 0; r < ids.length; r++) if (str_(ids[r][0]) === it.id) { target = r + 2; break; }
    }
    if (target) sh.getRange(target, 1, 1, CH.length).setValues([row]); else sh.appendRow(row);
  } finally { lock.releaseLock(); }
  return content_();
}
function wa_deleteContent(code, id) {
  needEdit_(code);
  const sh = contentSheet_();
  const n = sh.getLastRow();
  if (n > 1) {
    const ids = sh.getRange(2, 1, n - 1, 1).getValues();
    for (let r = ids.length - 1; r >= 0; r--) if (str_(ids[r][0]) === String(id)) sh.deleteRow(r + 2);
  }
  return content_();
}

/* ================= photos ================= */
function photo_(id) {
  if (!id) return '';
  if (String(id).indexOf('sh-') === 0) return sheetPhoto_(id);
  const cache = CacheService.getScriptCache();
  const hit = cache.get('ph_' + id); if (hit) return hit;
  try {
    const f = DriveApp.getFileById(id);
    let blob = null;
    try { blob = f.getThumbnail(); } catch (e) {}
    if (!blob || blob.getBytes().length < 500) blob = f.getBlob();
    if (blob.getBytes().length > 4500000) return '';
    const out = 'data:' + (blob.getContentType() || 'image/jpeg') + ';base64,' + Utilities.base64Encode(blob.getBytes());
    if (out.length < 95000) cache.put('ph_' + id, out, 21600);
    return out;
  } catch (e) { return ''; }
}
function wa_photo(code, id) { need_(code); return photo_(id); }

/* ================= staff evaluation ================= */
function wa_saveEval(code, ev) {
  const w = needEdit_(code);
  const ss = SpreadsheetApp.getActive();
  const set = ss.getSheetByName(WA.SETTINGS);
  const st = ss.getSheetByName(str_(set.getRange('B4').getValue()));
  const H = st.getRange(1, 1, 1, st.getLastColumn()).getValues()[0].map(str_);
  const row = H.map(() => '');
  const put = (name, v) => { const i = H.indexOf(name); if (i >= 0) row[i] = v; };
  const clamp = v => Math.max(1, Math.min(5, Math.round(Number(v) || 0))) || '';
  const sk = H.map((h, i) => h.startsWith('הערכה:') ? i : -1).filter(i => i >= 0).slice(0, 6);
  put('מזהה', Utilities.getUuid().slice(0, 8));
  put('אימייל סטאז׳ר', String(ev.email || '').toLowerCase());
  put('שם סטאז׳ר', String(ev.name || ''));
  put('חודש הסבב', String(ev.month || ''));
  sk.forEach((i, k) => { row[i] = clamp(ev.skills[k]); });
  put('מקצועיות ואחריות', clamp(ev.prof));
  put('מועמד/ת להתמחות', ev.cand ? 'כן' : 'לא');
  put('סיכום והמלצות', String(ev.summary || '').slice(0, 3000));
  put('הוזן ע״י', w.name);
  put('תאריך', new Date());
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const n = st.getLastRow();
    const ie = H.indexOf('אימייל סטאז׳ר'), im = H.indexOf('חודש הסבב');
    let target = 0;
    if (n > 1) {
      const vals = st.getRange(2, 1, n - 1, H.length).getValues();
      for (let r = 0; r < vals.length; r++) if (str_(vals[r][ie]).toLowerCase() === row[ie] && str_(vals[r][im]) === row[im]) { target = r + 2; row[0] = vals[r][0] || row[0]; break; }
    }
    if (target) st.getRange(target, 1, 1, H.length).setValues([row]); else st.appendRow(row);
  } finally { lock.releaseLock(); }
  return data_();
}

/* ================= personal intern links ================= */
function secret_() {
  let s = props_().getProperty('LINK_SECRET');
  if (!s) { s = Utilities.getUuid() + Utilities.getUuid(); props_().setProperty('LINK_SECRET', s); }
  return s;
}
function b64u_(s) { return Utilities.base64EncodeWebSafe(s, Utilities.Charset.UTF_8).replace(/=+$/, ''); }
function unb64u_(s) { const pad = (4 - s.length % 4) % 4; return Utilities.newBlob(Utilities.base64DecodeWebSafe(s + '='.repeat(pad))).getDataAsString('UTF-8'); }
function sig_(key) { return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(key, secret_())).replace(/=+$/, '').slice(0, 22); }
function token_(key) { return b64u_(key) + '.' + sig_(key); }
function keyFrom_(token) {
  const t = String(token || '').replace(/[^\w.\-]/g, '');
  const dot = t.lastIndexOf('.');
  if (dot < 1) throw new Error('BADLINK');
  let key = '';
  try { key = unb64u_(t.slice(0, dot)); } catch (e) { throw new Error('BADLINK'); }
  if (sig_(key) !== t.slice(dot + 1)) throw new Error('BADLINK');
  return key;
}
function prefill_(name, month, stage, track) {
  try {
    const cache = CacheService.getScriptCache();
    const ck = 'pf_' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, name + '|' + month + '|' + stage + (track ? '|' + track : ''), Utilities.Charset.UTF_8));
    const hit = cache.get(ck); if (hit) return hit;
    const form = FormApp.openById(WA.FORM_ID);
    const items = form.getItems();
    const find = (t, re) => items.filter(x => x.getTitle() === t)[0] || (re ? items.filter(x => re.test(x.getTitle()))[0] : null);
    const r = form.createResponse();
    const n = find('שם מלא'); if (n && name) r.withItemResponse(n.asTextItem().createResponse(name));
    const m = find('חודש הסבב'); if (m && month) { try { r.withItemResponse(m.asListItem().createResponse(month)); } catch (e) {} }
    const s = find('באיזה שלב של הסבב את/ה?', /באיזה שלב/); if (s) r.withItemResponse(s.asMultipleChoiceItem().createResponse(stage));
    const t = track ? find('מסלול הסבב', /מסלול/) : null;
    if (t) { try { const mc = t.getType() === FormApp.ItemType.LIST ? t.asListItem() : t.asMultipleChoiceItem(); const c = mc.getChoices().map(x => x.getValue()).filter(v => v.indexOf(track) >= 0)[0]; if (c) r.withItemResponse(mc.createResponse(c)); } catch (e) {} }
    const url = r.toPrefilledUrl();
    cache.put(ck, url, 21600);
    return url;
  } catch (e) { return WA.FORM_URL; }
}

/* ================= intern page API ================= */
function forIntern_(content, it) {
  const okMonth = x => x.month === WA.ALL || x.month === it.month;
  const okTarget = x => x.target === 'all' || x.target === it.key || (!!it.wing && x.target === 'wing:' + it.wing);
  return {
    sessions: content.filter(x => x.type === 'מפגש' && okMonth(x) && okTarget(x)),
    messages: content.filter(x => x.type === 'הודעה' && okMonth(x) && okTarget(x)).map(x => Object.assign({}, x, { personal: x.target !== 'all' && x.target.indexOf('wing:') !== 0, toWing: x.target.indexOf('wing:') === 0 })),
    literature: content.filter(x => x.type === 'ספרות' && okMonth(x) && x.tag !== 'טיוטה').sort((a, b) => (/עיקרי/.test(b.tag) ? 1 : 0) - (/עיקרי/.test(a.tag) ? 1 : 0)),
    seminars: content.filter(x => x.type === 'סמינר').sort((a, b) => String(a.tag).localeCompare(String(b.tag))),
    videos: content.filter(x => x.type === 'וידאו'),
    guides: content.filter(x => x.type === 'מדריך' && x.tag !== 'מנהלים')
  };
}
function wa_intern(token) {
  try {
    const key = keyFrom_(token);
    // everything below comes from the cached snapshot (same sheets, read once), so the app opens fast
    const d = dataCached_();
    const i = d.interns.filter(x => x.key === key)[0];
    if (!i) return { ok: false };
    const stages = [!!i.start, !!i.mid, !!i.end];
    const next = stages.indexOf(false);
    const formUrl = next === 1 ? prefill_(i.name, i.month, 'אמצע') : next === 2 ? prefill_(i.name, i.month, 'סיום') : WA.FORM_URL;
    const c = forIntern_(d.content, i);
    return { ok: true, name: i.name, month: i.month, inst: i.inst, imonth: i.imonth || '', staff: (() => { try { return staffPublic_(); } catch (e) { return []; } })(), start: i.start, mid: i.mid, end: i.end, stages: stages,
      photo: photo_(i.photoId), daylog: d.daylogs.filter(x => x.key === i.key), today: todayStr_(), dlActs: DL_ACTS, wing: i.wing || '', skills: WA.SKILLS, assigns: d.assigns.filter(a => a.key === i.key), absences: d.absences.filter(a => a.key === i.key), stations: stations_(),
      team: (() => { const ks = new Set(d.interns.filter(x => x.month === i.month).map(x => x.key)); return { assigns: d.assigns.filter(a => ks.has(a.key)).map(a => ({ date: a.date, name: a.name, station: a.station, mine: a.key === i.key })), absences: d.absences.filter(a => ks.has(a.key)).map(a => ({ date: a.date, name: a.name, reason: a.key === i.key ? a.reason : 'לא זמין/ה', mine: a.key === i.key })) }; })(), fmorn: d.fmorn.filter(x => x.month === i.month).map(x => ({ date: x.date, name: x.name, mine: x.key === i.key })), duties: d.duties.filter(x => x.month === i.month).map(x => ({ date: x.date, name: x.name, mine: x.key === i.key, slot: x.slot })), requests: d.requests.filter(r => r.key === i.key).map(pubRq_), portalFb: d.portalFb.some(x => x.key === i.key), mates: d.interns.filter(x => x.month === i.month && x.key !== i.key).map(x => x.name), crew: crew_(d, i).map((x, k) => ({ id: k, name: x.name, inst: x.inst || '', wing: x.wing || '', track: x.track || 'רגיל', photo: !!x.photoId, me: x.key === i.key })), track: i.track || 'רגיל', extra: !!i.extra, dutyMax: i.dutyMax || '', formUrl: formUrl, sessions: c.sessions, messages: c.messages, literature: c.literature, seminars: c.seminars, videos: c.videos, guides: c.guides, deckLive: deckLive_(), pubs: pubsFor_(i) };
  } catch (e) { return { ok: false }; }
}
/* the intern's rotation group, in a fixed order. Photo ids are cached so the team gallery loads without rereading the sheet */
function crew_(d, i) {
  const L = d.interns.filter(x => x.month === i.month).sort((a, b) => String(a.name).localeCompare(String(b.name), 'he'));
  try { CacheService.getScriptCache().put('crew_' + Utilities.base64EncodeWebSafe(i.month), JSON.stringify(L.map(x => x.photoId || '')), 3600); } catch (e) {}
  return L;
}
function wa_teamPhoto(token, id) {
  const key = keyFrom_(token), month = key.split('|')[1] || '';
  let ids = null;
  try { ids = JSON.parse(CacheService.getScriptCache().get('crew_' + Utilities.base64EncodeWebSafe(month)) || 'null'); } catch (e) {}
  if (!ids) { const d = data_(), i = d.interns.filter(x => x.key === key)[0]; if (!i) return ''; ids = crew_(d, i).map(x => x.photoId || ''); }
  return photo_(ids[Number(id)] || '');
}
function wa_internFeedback(token, fb) {
  const key = keyFrom_(token); bump_();
  fb = fb || {};
  const text = String(fb.text || '').trim().slice(0, 2000);
  if (text.length < 2) throw new Error('EMPTY');
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(WA.NOTES);
  if (!sh) { sh = ss.insertSheet(WA.NOTES); sh.appendRow(['תאריך', 'חודש הסבב', 'מאת', 'פנייה', 'נושא', 'מצב רוח (1-5)']); sh.setRightToLeft(true); sh.setFrozenRows(1); }
  const month = key.split('|')[1] || '';
  let name = '';
  if (!fb.anon) { const d = data_(); const i = d.interns.filter(x => x.key === key)[0]; name = i ? i.name : ''; }
  const mood = Math.max(0, Math.min(5, Number(fb.mood) || 0)) || '';
  sh.appendRow([new Date(), month, fb.anon ? 'אנונימי' : name, text, String(fb.topic || 'כללי').slice(0, 40), mood]);
  if (!fb.anon) { try { bump_(); syncTextReqs_(null, true); } catch (e) { Logger.log('text requests: ' + e.message); } }
  // selective interns have no requests screen, so their message goes straight to the owner's inbox
  opsEvent_('💬 פנייה מסטאז׳ר', (fb.anon ? 'אנונימי' : name) + ' · ' + String(fb.topic || 'כללי').slice(0, 40));
  if (fb.topic === 'הודעה מסלקטיב' || fb.topic === 'הודעה מרק תורנויות') { try { send_('הודעה מסטאז׳ר תורנויות', 'sm|' + key + '|' + Date.now(), owner_(), '💬 הודעה מ״רק תורנויות״ · ' + (name || 'סטאז׳ר/ית'), mailHtml_('💬 הודעה מ״רק תורנויות״', [esc_(name || 'סטאז׳ר/ית') + ' (' + esc_(month) + ') כתב/ה:', '<b>' + esc_(text).replace(/\n/g, '<br>') + '</b>'], dashUrl_() ? { label: 'לדשבורד', url: dashUrl_() } : null), null); } catch (e) { Logger.log('sel msg mail: ' + e.message); } }
  return true;
}

/* ================= one-time: make the form phone-friendly ================= */
/* Converts each 1–5 grid in the form into six separate 1–5 questions (they display well in portrait),
   using the new skill names. Titles and descriptions you edited elsewhere stay untouched. */

/* ================= rotation roster, wings & settings ================= */
const RH = ['חודש', 'שם', 'טלפון', 'אימייל', 'אגף', 'הערות', 'עודכן', 'מסלול'];
const WINGS = ['צפון', 'דרום'];
function rosterSheet_() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName('רשימת סבב');
  if (!sh) {
    sh = ss.insertSheet('רשימת סבב');
    sh.setRightToLeft(true);
    sh.getRange('A:H').setNumberFormat('@');
    sh.getRange(1, 1, 1, RH.length).setValues([RH]).setFontWeight('bold').setBackground('#0C2A35').setFontColor('#FFFFFF');
    sh.setFrozenRows(1);
  } else if (sh.getRange(1, RH.length).getValue() !== RH[RH.length - 1]) {
    sh.getRange(1, RH.length).setValue(RH[RH.length - 1]).setFontWeight('bold').setBackground('#0C2A35').setFontColor('#FFFFFF');
  }
  return sh;
}
function phoneKey_(p) { const d = String(p || '').replace(/\D/g, ''); return d.length >= 9 ? d.slice(-9) : ''; }
function nowStr_() { return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm'); }
function roster_() {
  const sh = rosterSheet_();
  if (sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, RH.length).getDisplayValues().filter(r => r[1] || r[3] || r[2])
    .map(r => ({ month: r[0], name: r[1], phone: r[2], email: String(r[3]).toLowerCase().trim(), wing: r[4], note: r[5], track: ['סלקטיב', 'רק תורנויות'].indexOf(r[7]) >= 0 ? r[7] : '' }));
}
function rosterTrack_(roster, i) {
  const pk = phoneKey_(i.phone);
  const r = roster.filter(x => x.month === i.month && ((x.email && x.email === i.email) || (pk && phoneKey_(x.phone) === pk)))[0];
  return r ? r.track : '';
}
function wingFor_(roster, i) {
  const pk = phoneKey_(i.phone);
  const r = roster.filter(x => x.month === i.month && ((x.email && x.email === i.email) || (pk && phoneKey_(x.phone) === pk)))[0];
  return r ? r.wing : '';
}
function wa_saveRoster(code, month, rows) {
  needEdit_(code);
  month = String(month || '');
  const sh = rosterSheet_();
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const n = sh.getLastRow();
    const keep = n > 1 ? sh.getRange(2, 1, n - 1, RH.length).getDisplayValues().filter(r => r[0] !== month && (r[1] || r[2] || r[3])) : [];
    const now = nowStr_();
    const add = (rows || []).filter(r => r && (r.name || r.email || r.phone)).slice(0, 200).map(r => [month, String(r.name || '').trim().slice(0, 80),
      String(r.phone || '').trim().slice(0, 30), String(r.email || '').toLowerCase().trim().slice(0, 120), WINGS.indexOf(r.wing) >= 0 ? r.wing : '', String(r.note || '').slice(0, 200), now, ['סלקטיב', 'רק תורנויות'].indexOf(r.track) >= 0 ? r.track : '']);
    const all = keep.concat(add);
    if (n > 1) sh.getRange(2, 1, n - 1, RH.length).clearContent();
    sh.getRange('A:H').setNumberFormat('@');
    if (all.length) sh.getRange(2, 1, all.length, RH.length).setValues(all.map(r => r.concat(['', '', '', '', '', '', '', '']).slice(0, RH.length)));
  } finally { lock.releaseLock(); }
  return roster_();
}
function wa_setWing(code, it) {
  needEdit_(code);
  it = it || {};
  const wing = WINGS.indexOf(it.wing) >= 0 ? it.wing : '';
  const email = String(it.email || '').toLowerCase().trim(), month = String(it.month || ''), pk = phoneKey_(it.phone);
  const sh = rosterSheet_();
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const n = sh.getLastRow();
    let target = 0;
    if (n > 1) {
      const v = sh.getRange(2, 1, n - 1, RH.length).getDisplayValues();
      for (let r = 0; r < v.length; r++) {
        if (v[r][0] === month && ((email && String(v[r][3]).toLowerCase().trim() === email) || (pk && phoneKey_(v[r][2]) === pk))) { target = r + 2; break; }
      }
    }
    if (target) sh.getRange(target, 5, 1, 3).setValues([[wing, sh.getRange(target, 6).getDisplayValue(), nowStr_()]]);
    else { sh.getRange('A:H').setNumberFormat('@'); sh.appendRow([month, String(it.name || ''), String(it.phone || ''), email, wing, '', nowStr_(), '']); }
  } finally { lock.releaseLock(); }
  return roster_();
}
function settings_() {
  const all = props_().getProperties();
  const groups = {};
  Object.keys(all).forEach(k => { if (k.indexOf('GROUP_') === 0) groups[k.slice(6)] = all[k]; });
  return { template: all.OPEN_TPL || '', templateSel: all.OPEN_TPL_SEL || '', groups: groups };
}
function wa_saveSetting(code, key, value) {
  needEdit_(code);
  key = String(key || '');
  value = String(value || '').slice(0, 4000);
  if (key !== 'OPEN_TPL' && key !== 'OPEN_TPL_SEL' && key.indexOf('GROUP_') !== 0) throw new Error('הגדרה לא מוכרת');
  if (key.indexOf('GROUP_') === 0 && value && !/^https:\/\/chat\.whatsapp\.com\//.test(value)) throw new Error('קישור הקבוצה צריך להתחיל ב-https://chat.whatsapp.com');
  if (value) props_().setProperty(key, value); else props_().deleteProperty(key);
  return settings_();
}

/* ================= duty roster (תורנויות) ================= */
const DH = ['חודש', 'תאריך', 'מזהה סטאז׳ר', 'שם', 'נעול', 'עודכן ע״י', 'עודכן', 'עמדה'];
const BH = ['חודש', 'מזהה סטאז׳ר', 'תאריך', 'נוסף ע״י'];
function textSheet_(name, headers) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.setRightToLeft(true);
    sh.getRange(1, 1, sh.getMaxRows(), headers.length).setNumberFormat('@');
    sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#0C2A35').setFontColor('#FFFFFF');
    sh.setFrozenRows(1);
  }
  return sh;
}
function rowsOf_(sh, w) { return sh.getLastRow() < 2 ? [] : sh.getRange(2, 1, sh.getLastRow() - 1, w).getDisplayValues(); }
function replaceMonth_(sh, w, month, rows) {
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const keep = rowsOf_(sh, w).filter(r => r[0] && r[0] !== month);
    const all = keep.concat(rows);
    if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, w).clearContent();
    sh.getRange(2, 1, Math.max(all.length, 1) + 50, w).setNumberFormat('@');
    if (all.length) sh.getRange(2, 1, all.length, w).setValues(all);
  } finally { lock.releaseLock(); }
}
function dutyAll_() {
  return rowsOf_(textSheet_('תורנויות', DH), DH.length).filter(r => r[0] && r[1]).map(r => ({ month: r[0], date: r[1], key: r[2], name: r[3], locked: r[4] === 'כן', slot: r[7] || 'dept' }));
}
/* night duties (department + ER); Friday morning is kept apart so it never counts as a night or a post-call day */
function duties_() { return dutyAll_().filter(x => x.slot !== 'fm'); }
function fmorn_() { return dutyAll_().filter(x => x.slot === 'fm'); }
function dutyBlocks_() {
  return rowsOf_(textSheet_('חסימות תורנות', BH), BH.length).filter(r => r[0] && r[2]).map(r => ({ month: r[0], key: r[1], date: r[2] }));
}
function wa_saveDuties(code, month, list, opts) {
  const w = needEdit_(code);
  month = String(month || '');
  const now = nowStr_();
  const rows = (list || []).filter(x => x && /^\d{4}-\d{2}-\d{2}$/.test(x.date)).slice(0, 400)
    .map(x => [month, x.date, String(x.key || ''), String(x.name || '').slice(0, 80), x.locked ? 'כן' : '', w.name, now, ['dept', 'er', 'fm'].indexOf(x.slot) >= 0 ? x.slot : 'dept']);
  try { const sh = textSheet_('תורנויות', DH); if (sh.getRange(1, DH.length).getValue() !== 'עמדה') sh.getRange(1, 1, 1, DH.length).setValues([DH]); } catch (e) {}
  replaceMonth_(textSheet_('תורנויות', DH), DH.length, month, rows);
  // publishing makes the draft redundant: the board the interns see is now the latest one
  try { replaceMonth_(textSheet_('תורנויות - טיוטה', DH), DH.length, month, []); } catch (e) {}
  // an update without notice changes the board quietly: no new mark, so no "new" badge in the app
  try { opts = opts || {}; if (!dutyPub_()[month] || opts.notify) markDutyPub_(month, w.name, opts.keys || null); } catch (e) {}
  return duties_();
}
/* the duty board as work in progress: saved for the managers only, the interns keep seeing the published board. An empty list removes the draft */
function dutyDraft_() { return rowsOf_(textSheet_('תורנויות - טיוטה', DH), DH.length).filter(r => r[0] && r[1]).map(r => ({ month: r[0], date: r[1], key: r[2], name: r[3], locked: r[4] === 'כן', by: r[5], at: r[6], slot: r[7] || 'dept' })); }
function wa_saveDutyDraft(code, month, list) {
  const w = needEdit_(code);
  month = String(month || '');
  const now = nowStr_();
  const rows = (list || []).filter(x => x && /^\d{4}-\d{2}-\d{2}$/.test(x.date)).slice(0, 400)
    .map(x => [month, x.date, String(x.key || ''), String(x.name || '').slice(0, 80), x.locked ? 'כן' : '', w.name, now, ['dept', 'er', 'fm'].indexOf(x.slot) >= 0 ? x.slot : 'dept']);
  replaceMonth_(textSheet_('תורנויות - טיוטה', DH), DH.length, month, rows);
  return dutyDraft_();
}
function wa_saveBlocks(code, month, list) {
  const w = needEdit_(code);
  month = String(month || '');
  const rows = (list || []).filter(x => x && x.key && /^\d{4}-\d{2}-\d{2}$/.test(x.date)).slice(0, 600).map(x => [month, String(x.key), x.date, w.name]);
  replaceMonth_(textSheet_('חסימות תורנות', BH), BH.length, month, rows);
  return dutyBlocks_();
}

/* ================= automation: emails & reminders ================= */
const APP_URL = 'https://surgeryx.example/';
const HM = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
const HD = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
const AUTO_DEF = { daily: true, welcome: false, mid: false, midDay: 14, end: false, endDays: 3, duty: false, digest: false, digestTo: '', preStart: true, schedWeek: true, weekly: true, weeklyTo: '', monthly: true, monthlyTo: '' };
function autoCfg_() { let c = {}; try { c = JSON.parse(props_().getProperty('AUTO') || '{}'); } catch (e) {} return Object.assign({}, AUTO_DEF, c); }
function owner_() { try { return Session.getEffectiveUser().getEmail(); } catch (e) { return ''; } }
// every email to interns and managers leaves from the system account only. The web app runs as whoever last deployed it (clasp
// update-deployment), so a deploy from a personal account would send from that account: then nothing is sent and the dashboard warns
const SYSTEM_MAIL = 'team@surgeryx.example';
function sysOk_() { return String(owner_()).toLowerCase() === SYSTEM_MAIL; }
function logSheet_() { return textSheet_('יומן אוטומציה', ['תאריך', 'סוג', 'מפתח', 'נמען', 'נושא', 'סטטוס']); }
function sentKeys_() { const s = {}; rowsOf_(logSheet_(), 6).forEach(r => { if (r[5] === 'נשלח') s[r[2]] = 1; }); return s; }
function log_(type, key, to, subject, status) { logSheet_().appendRow([nowStr_(), type, key, to, subject, status]); }
function curMonth_(d) { d = d || new Date(); const tz = Session.getScriptTimeZone(); return HM[Number(Utilities.formatDate(d, tz, 'M')) - 1] + ' ' + Utilities.formatDate(d, tz, 'yyyy'); }
function linkFor_(i) { return (APP_URL || ScriptApp.getService().getUrl()) + '?t=' + token_(i.key); }
function bookletUrl_() { const b = content_().filter(x => x.type === 'ספרות' && /ספרון/.test(x.tag + ' ' + x.title) && x.link)[0]; return b ? b.link : ''; }
function esc_(s) { return String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function mailHtml_(title, lines, btn) {
  const b = btn ? `<p style="margin:26px 0 10px"><a href="${btn.url}" style="background:#B8863B;color:#fff;text-decoration:none;font-weight:700;padding:12px 26px;border-radius:999px;display:inline-block">${esc_(btn.label)}</a></p>` : '';
  return `<div dir="rtl" style="background:#ffffff;padding:6px 0;font-family:Arial,Helvetica,sans-serif"><div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #ECE6DA">
  <div style="background:#0C2A35;line-height:0;font-size:0"><img src="cid:kbanner" width="600" alt="Surgery X · המערך הכירורגי, המרכז הרפואי אופק" style="display:block;width:100%;max-width:600px;height:auto;border:0"></div><div style="background:#0C2A35;color:#F5F2EA;padding:12px 24px;font-size:19px;font-weight:700">${esc_(title)}</div>
  <div style="padding:22px 24px;color:#0C2A35;font-size:16px;line-height:1.6">${lines.map(l => `<p style="margin:0 0 12px">${l}</p>`).join('')}${b}</div>
  <div style="padding:12px 24px;background:#FAFAF8;color:#6B7B80;font-size:12px;border-top:1px solid #EEE9DF">Surgery X · הודעה אוטומטית</div></div></div>`;
}
let ALT_MAP_ = {};
function send_(type, key, to, subject, html, sent, dry) {
  if (!to) return false;
  if (!sysOk_()) { try { log_(type, key, to, subject, 'לא נשלח: המערכת רצה מהחשבון ' + owner_()); } catch (e) {} return false; }
  const alt = ALT_MAP_[String(to).toLowerCase().trim()]; if (alt) to = to + ',' + alt;
  if (!dry && sent && sent[key]) return false;
  try {
    MailApp.sendEmail(mailOpts_({ to: to, subject: subject, htmlBody: html, name: 'המערך הכירורגי – אופק' }));
    if (!dry) { log_(type, key, to, subject, 'נשלח'); if (sent) sent[key] = 1; }
    return true;
  } catch (e) { log_(type, key, to, subject, 'שגיאה: ' + e.message); return false; }
}
/* welcome email: personal link first, the rotation journal in two lines, then booklet, guide and group as small buttons */
function guideUrl_() { const g = content_().filter(x => x.type === 'מדריך' && x.tag !== 'מנהלים' && x.link)[0]; return g ? g.link : ''; }
function welcomeMail_(i) {
  const first = (i.name || '').split(' ')[0];
  const bk = bookletUrl_(), gd = guideUrl_(), g = (settings_().groups || {})[i.month];
  const steps = [];
  if (bk) steps.push(['📘 לקרוא את ספרון הסטאז׳רים', 'נהלים, תבניות קבלה ומה מצופה מכם. חובה לפני היום הראשון', bk, 'לפתיחת הספרון']);
  if (g) steps.push(['💬 להצטרף לקבוצת הוואטסאפ', 'עדכונים ותיאומים של הסבב', g, 'להצטרפות']);
  if (!i.photoId) steps.push(['📷 להעלות תמונת פרופיל', 'נכנסים לאפליקציה ולוחצים על המצלמה ליד התמונה. כך הצוות יכיר אתכם מהר', linkFor_(i), 'להעלאת תמונה']);
  steps.push(['📲 לשמור את האפליקציה במסך הבית', 'פותחים את הקישור בטלפון. באפליקציה עצמה יש הדרכה קצרה של 3 צעדים', '', '']);
  const stepHtml = steps.map((s, k) => `<span style="display:block;padding:10px 0;${k ? 'border-top:1px solid #EADFC6;' : ''}"><span style="display:inline-block;width:24px;height:24px;border-radius:12px;background:#B8863B;color:#fff;text-align:center;font-weight:700;font-size:14px;line-height:24px;margin-left:8px">${k + 1}</span><b>${s[0]}</b><br><span style="color:#3E5960;font-size:14px;padding-right:32px;display:inline-block">${s[1]}</span>${s[2] ? `<br><a href="${s[2]}" style="color:#187A5C;font-weight:700;text-decoration:none;padding-right:32px;display:inline-block">${s[3]} ←</a>` : ''}</span>`).join('');
  const lines = [`שלום ${esc_(first)},`, 'תודה שנרשמת! זה הקישור האישי שלך לאפליקציית הסבב: לו״ז, תורנויות, הודעות מהצוות וחומרי לימוד.',
    `<a href="${linkFor_(i)}" style="background:#B8863B;color:#fff;text-decoration:none;font-weight:700;padding:13px 28px;border-radius:999px;display:inline-block">לאפליקציה האישית שלי</a>`,
    `<span style="display:block;border:2px solid #B8863B;background:#FFF9EE;border-radius:12px;padding:12px 16px"><b style="font-size:18px">✅ לפני היום הראשון</b>${stepHtml}</span>`,
    '<span style="display:block;background:#0C2A35;color:#F5F2EA;border-radius:12px;padding:14px 16px;line-height:1.55"><b style="color:#E2B66A">📝 יומן הסבב</b><br>בסוף כל יום: סיכום של 30 שניות, הייתי? ומה עשיתי? בכל יום חמישי: סיכום שבועי קצר. כך אנחנו רואים אתכם ומשפרים את הסבב תוך כדי.</span>'];
  // duties-only interns: a short welcome, no daily journal block
  if (i.track === 'רק תורנויות') { lines.pop(); lines[1] = 'תודה שנרשמת! זה הקישור האישי שלך לאפליקציה: לוח התורנויות, הודעות מהצוות וחומרי לימוד.'; }
  if (gd) lines.push(`<span style="display:block;background:#EEF6F2;border-radius:12px;padding:12px 16px"><b>צריכים עזרה עם האפליקציה?</b> <a href="${gd}" style="color:#187A5C;font-weight:700">📗 המדריך לאפליקציה</a> מסביר הכול, צעד אחר צעד.</span>`);
  lines.push('<span style="color:#6B7B80;font-size:13px">הקישור אישי, אל תעבירו אותו הלאה.</span>');
  return mailHtml_('ברוכים הבאים לסבב ' + i.month, lines, null);
}

/* runs automatically every time the form is submitted */
function onIntakeSubmit(e) {
  bump_();
  const cfg = autoCfg_();
  if (!cfg.welcome) return;
  const nv = (e && e.namedValues) || {};
  const pick = re => { const ks = Object.keys(nv).filter(h => re.test(h)); for (const k of ks) { const v = String((nv[k] || [])[0] || '').trim(); if (v) return v; } return ''; };
  const email = (pick(/^כתובת אימייל$|^Email Address$/i) || pick(/אימייל|Email/i)).toLowerCase(), stage = pick(/באיזה שלב/), month = pick(/חודש הסבב/);
  Logger.log('intake ' + email + ' | ' + month);
  if ((stage && stage !== 'פתיחה') || !email) return;
  const ov = overrides_()[email + '|' + month];
  if (ov && ov.deleted) upsertOverride_(email + '|' + month, cur => ({ manual: cur.manual, deleted: false, data: null }), 'טופס פתיחה חדש');
  Utilities.sleep(1500);
  const i = data_().interns.filter(x => x.key === email + '|' + month)[0];
  if (!i) return;
  opsEvent_('📝 נרשם/ה לסבב', i.name + ' · ' + i.month);
  try { syncTextReqs_(null, true); } catch (err) { Logger.log('text requests: ' + err.message); }
  /* every new registration gets the link again, so someone who registers twice (lost the mail) still receives it */
  send_('קישור אישי', 'welcome|' + i.key + '|' + String(((e && e.values) || [])[0] || Date.now()), i.email, 'הקישור האישי שלך לאפליקציית הסבב · ' + i.month, welcomeMail_(i), sentKeys_());
}

/* runs every morning */
function dailyAutomation() {
  const cfg = autoCfg_(), tz = Session.getScriptTimeZone(), now = new Date();
  const d = data_(), month = curMonth_(now), sent = sentKeys_();
  const day = Number(Utilities.formatDate(now, tz, 'd'));
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const L = d.interns.filter(i => i.month === month);
  const out = [];
  try { dayMissMorning_(d, sent); } catch (e) {}
  if (cfg.mid && day >= Number(cfg.midDay || 14)) L.filter(i => i.start && !i.mid).forEach(i => {
    const f = (i.name || '').split(' ')[0];
    if (send_('תזכורת אמצע', 'mid|' + i.key, i.email, 'תזכורת: טופס אמצע הסבב (3 דקות)', mailHtml_('הגענו לאמצע הסבב', [`היי ${esc_(f)},`, 'נשמח לשמוע איך הולך עד עכשיו. משוב האמצע נמצא בעמוד האישי שלך ולוקח כ-3 דקות.'], { label: 'למשוב האמצע', url: linkFor_(i) }), sent)) out.push('אמצע: ' + i.name);
  });
  if (cfg.end && day >= last - Number(cfg.endDays || 3)) L.filter(i => i.start && !i.end).forEach(i => {
    const f = (i.name || '').split(' ')[0];
    if (send_('תזכורת סיום', 'end|' + i.key, i.email, 'תזכורת: טופס סיום הסבב', mailHtml_('הסבב מסתיים', [`היי ${esc_(f)},`, 'הסבב שלך מתקרב לסיום. נשמח מאוד למשוב הסיום, שנמצא בעמוד האישי שלך. זה עוזר לנו לשפר את הסבב לבאים אחריך.'], { label: 'למשוב הסיום', url: linkFor_(i) }), sent)) out.push('סיום: ' + i.name);
  });
  if (cfg.duty) {
    const t = new Date(now.getTime() + 864e5), tk = Utilities.formatDate(t, tz, 'yyyy-MM-dd');
    d.duties.filter(x => x.date === tk).forEach(x => {
      const i = d.interns.filter(y => y.key === x.key)[0]; if (!i) return;
      const f = (i.name || '').split(' ')[0];
      if (send_('תזכורת תורנות', 'duty|' + x.date + '|' + i.key, i.email, 'תזכורת: מחר את/ה בתורנות', mailHtml_('תורנות מחר', [`היי ${esc_(f)},`, `תזכורת: מחר, יום ${HD[t.getDay()]} ${tk.split('-').reverse().slice(0, 2).join('/')}, את/ה בתורנות. בהצלחה!`], { label: 'ללוח התורנויות שלי', url: linkFor_(i) }), sent)) out.push('תורנות: ' + i.name);
    });
  }
  try { if (cfg.preStart) preStart_(d, now, sent, false).forEach(x => out.push(x)); } catch (e) { out.push('לפני הסבב: ' + e.message); }
  try { if (cfg.monthly && day === 1) out.push(monthlyReport_(false) ? 'דוח חודשי נשלח' : 'דוח חודשי לא נשלח'); } catch (e) { out.push('דוח חודשי: ' + e.message); }
  if (cfg.digest && Utilities.formatDate(now, tz, 'u') === '7') out.push(weeklyDigest_(false) ? 'סיכום שבועי נשלח' : 'סיכום שבועי לא נשלח');
  return out;
}
function digestHtml_(d, month) {
  const L = d.interns.filter(i => i.month === month);
  const weekAgo = Date.now() - 7 * 864e5;
  const parseD = s => { const m = String(s).match(/(\d{2})\/(\d{2})\/(\d{4})/); return m ? new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1])).getTime() : 0; };
  const fb = d.feedback.filter(f => f.month === month && parseD(f.date) >= weekAgo);
  const roster = (d.roster || []).filter(r => r.month === month);
  const pk = p => String(p || '').replace(/\D/g, '').slice(-9);
  const pending = roster.filter(r => !L.some(i => (r.email && i.email === r.email) || (pk(r.phone) && pk(i.phone) === pk(r.phone))));
  const tz = Session.getScriptTimeZone(), today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd'), wk = Utilities.formatDate(new Date(Date.now() + 7 * 864e5), tz, 'yyyy-MM-dd');
  const duties = d.duties.filter(x => x.date >= today && x.date < wk).sort((a, b) => a.date.localeCompare(b.date));
  const row = (a, b) => `<tr><td style="padding:6px 0;border-bottom:1px solid #EEE9DF">${a}</td><td style="padding:6px 0;border-bottom:1px solid #EEE9DF;text-align:left;font-weight:700">${b}</td></tr>`;
  const list = (title, items) => items.length ? `<p style="margin:16px 0 6px;font-weight:700">${title}</p><ul style="margin:0;padding-right:18px">${items.map(x => `<li>${x}</li>`).join('')}</ul>` : '';
  const lines = [
    `<table style="width:100%;border-collapse:collapse;font-size:15px">${row('סטאז׳רים בסבב', L.length)}${row('מילאו טופס אמצע', L.filter(i => i.mid).length + ' / ' + L.length)}${row('מילאו טופס סיום', L.filter(i => i.end).length + ' / ' + L.length)}${row('הערכות צוות', L.filter(i => i.staff).length + ' / ' + L.length)}${row('משובים חדשים השבוע', fb.length)}</table>`,
    list('טרם מילאו טופס פתיחה', pending.map(r => esc_(r.name || r.phone))) +
    list('ממתינים להערכת צוות', L.filter(i => i.end && !i.staff).map(i => esc_(i.name))) +
    list('משובים חדשים', fb.map(f => `<b>${esc_(f.topic)}</b>: ${esc_(String(f.text).slice(0, 140))}`)) +
    list('תורנויות השבוע', duties.map(x => `${HD[new Date(x.date + 'T12:00:00').getDay()]} ${x.date.split('-').reverse().slice(0, 2).join('/')} – ${esc_(x.name)}`))
  ];
  return mailHtml_('סיכום שבועי · ' + month, lines, { label: 'לדשבורד', url: APP_URL });
}
function weeklyDigest_(dry) {
  const cfg = autoCfg_(), d = data_(), month = curMonth_();
  const to = [owner_()].concat(String(cfg.digestTo || '').split(/[\s,;]+/)).filter(x => /@/.test(x)).filter((x, k, a) => a.indexOf(x) === k).join(',');
  const key = 'digest|' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return send_('סיכום שבועי', key, to, 'סיכום שבועי · סבב ' + month, digestHtml_(d, month), dry ? null : sentKeys_(), dry);
}

/* ---- setup & dashboard API ---- */
/* editor tools below check isOwnerSession_(): every top-level function can also be called from the web page */
function setupAutomation() { if (!isOwnerSession_()) return; return setupAutomation_(); }
function setupAutomation_() {
  ScriptApp.getProjectTriggers().forEach(t => { if (['onIntakeSubmit', 'dailyAutomation', 'dailyReminder', 'eveningAutomation'].indexOf(t.getHandlerFunction()) >= 0) ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('onIntakeSubmit').forSpreadsheet(SpreadsheetApp.getActive()).onFormSubmit().create();
  ScriptApp.newTrigger('dailyAutomation').timeBased().everyDays(1).atHour(8).create();
  ScriptApp.newTrigger('dailyReminder').timeBased().everyDays(1).atHour(16).create();
  ScriptApp.newTrigger('eveningAutomation').timeBased().everyDays(1).atHour(19).create();
  logSheet_();
  Logger.log('האוטומציה הופעלה: מייל אחרי טופס פתיחה + בדיקה יומית ב-08:00');
  return autoStatus_();
}
function autoStatus_() {
  let triggers = [];
  try { triggers = ScriptApp.getProjectTriggers().map(t => t.getHandlerFunction()); } catch (e) { triggers = ['?']; }
  const log = rowsOf_(logSheet_(), 6).slice(-25).reverse().map(r => ({ date: r[0], type: r[1], to: r[3], subject: r[4], status: r[5] }));
  return { cfg: autoCfg_(), on: triggers.indexOf('onIntakeSubmit') >= 0 && triggers.indexOf('dailyAutomation') >= 0, triggers: triggers, owner: owner_(), sysOk: sysOk_(), sys: SYSTEM_MAIL, log: log };
}
function wa_saveAuto(code, cfg) {
  bump_();
  const w = need_(code);
  if (w.role !== 'owner') throw new Error('רק בעל המערכת יכול לשנות את האוטומציה');
  const c = Object.assign({}, AUTO_DEF);
  Object.keys(AUTO_DEF).forEach(k => { if (cfg && cfg[k] !== undefined) c[k] = typeof AUTO_DEF[k] === 'boolean' ? !!cfg[k] : (typeof AUTO_DEF[k] === 'number' ? Math.max(1, Math.min(28, Number(cfg[k]) || AUTO_DEF[k])) : String(cfg[k]).slice(0, 500)); });
  props_().setProperty('AUTO', JSON.stringify(c));
  return autoStatus_();
}
function wa_setupAutomation(code) { const w = need_(code); if (w.role !== 'owner') throw new Error('רק בעל המערכת'); return setupAutomation_(); }
function wa_testMail(code, kind) {
  const w = need_(code);
  if (w.role !== 'owner') throw new Error('רק בעל המערכת');
  const to = owner_(), d = data_();
  const i = d.interns.filter(x => x.month === curMonth_())[0] || d.interns[0] || { name: 'ישראל ישראלי', month: curMonth_(), key: 'test@example.com|' + curMonth_(), email: to };
  if (kind === 'digest' || kind === 'weekly') weeklyMgr_(true);
  else if (kind === 'monthly') monthlyReport_(true);
  else if (kind === 'sched') schedWeek_(true);
  else if (kind === 'pre') preStart_(d, new Date(), null, true);
  else send_('בדיקה', 'test', to, '[בדיקה] הקישור האישי שלך לפורטל הסבב', welcomeMail_(i), null, true);
  return 'נשלח מייל בדיקה אל ' + to;
}

/* ================= weekly placement (שיבוץ שבועי) ================= */
const STATIONS_DEF = [
  { id: 'north', name: 'מחלקה – אגף צפון', short: 'צפון', color: '#1F4E79', days: [0, 1, 2, 3, 4], min: 1, wing: 'צפון' },
  { id: 'south', name: 'מחלקה – אגף דרום', short: 'דרום', color: '#8E4F12', days: [0, 1, 2, 3, 4], min: 1, wing: 'דרום' },
  { id: 'or', name: 'חדר ניתוח', short: 'חדר ניתוח', color: '#187A5C', days: [0, 1, 2, 3, 4], min: 1, wing: '' },
  { id: 'preop', name: 'מרפאת טרום ניתוח', short: 'טרום ניתוח', color: '#8D6E3F', days: [2, 3], min: 1, wing: 'לפי יום', dw: ['', '', 'צפון', 'דרום', ''], addon: true },
  { id: 'er', name: 'מיון כירורגי', short: 'מיון', color: '#A3402E', days: [0, 1, 2, 3, 4], min: 1, wing: '' },
  // the trauma unit is separate from us. Its intern of the month (track "טראומה") is with the unit by day and does only nights with us;
  // on a day they are not there (after a night, absent) we owe the unit one of our interns, so the station opens only on those days
  { id: 'trauma', name: 'יחידת הטראומה', short: 'טראומה', color: '#2C6E6A', days: [0, 1, 2, 3, 4], min: 1, wing: '', trauma: true }
];
const AH = ['תאריך', 'מזהה סטאז׳ר', 'שם', 'עמדה', 'נעול', 'עודכן ע״י', 'עודכן'];
const XH = ['תאריך', 'מזהה סטאז׳ר', 'שם', 'סיבה', 'עודכן ע״י', 'עודכן'];
function stations_() {
  let s = null;
  try { s = JSON.parse(props_().getProperty('STATIONS') || 'null'); } catch (e) {}
  if (!(Array.isArray(s) && s.length)) return STATIONS_DEF;
  // saved station lists from before the trauma unit get it added
  if (!s.some(x => x.trauma || x.id === 'trauma')) s = s.concat(STATIONS_DEF.filter(x => x.trauma));
  return s;
}
function wa_saveStations(code, list) {
  needEdit_(code);
  const clean = (list || []).filter(x => x && x.id && x.name).slice(0, 12).map(x => ({ id: String(x.id).slice(0, 20), name: String(x.name).slice(0, 40), short: String(x.short || x.name).slice(0, 20),
    color: /^#[0-9A-Fa-f]{6}$/.test(x.color) ? x.color : '#3E5960', days: (x.days || []).map(Number).filter(d => d >= 0 && d <= 6), min: Math.max(0, Math.min(10, Number(x.min) || 0)), wing: WINGS.indexOf(x.wing) >= 0 || x.wing === 'לפי יום' ? x.wing : '', dw: (x.dw || []).slice(0, 7).map(w => WINGS.indexOf(w) >= 0 ? w : ''), addon: !!x.addon, trauma: !!x.trauma }));
  if (!clean.length) throw new Error('צריך לפחות עמדה אחת');
  props_().setProperty('STATIONS', JSON.stringify(clean));
  return clean;
}
function assigns_() { return rowsOf_(textSheet_('שיבוצים', AH), AH.length).filter(r => r[0] && r[1]).map(r => ({ date: r[0], key: r[1], name: r[2], station: r[3], locked: r[4] === 'כן' })); }
function absences_() { return rowsOf_(textSheet_('היעדרויות', XH), XH.length).filter(r => r[0] && r[1]).map(r => ({ date: r[0], key: r[1], name: r[2], reason: r[3] })); }
function replaceRange_(name, headers, from, to, rows) {
  const sh = textSheet_(name, headers), w = headers.length;
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const keep = rowsOf_(sh, w).filter(r => r[0] && (r[0] < from || r[0] > to));
    const all = keep.concat(rows).sort((a, b) => String(a[0]).localeCompare(String(b[0])));
    if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, w).clearContent();
    sh.getRange(2, 1, Math.max(all.length, 1) + 50, w).setNumberFormat('@');
    if (all.length) sh.getRange(2, 1, all.length, w).setValues(all);
  } finally { lock.releaseLock(); }
}
function wa_saveWeek(code, from, to, assigns, absences, publish, opts) {
  const w = needEdit_(code);
  const ok = s => /^\d{4}-\d{2}-\d{2}$/.test(s);
  if (!ok(from) || !ok(to)) throw new Error('טווח תאריכים לא תקין');
  const now = nowStr_(), pub = publish !== false;
  const rowsA = (assigns || []).filter(a => a && ok(a.date) && a.date >= from && a.date <= to && a.key && a.station).slice(0, 600)
    .map(a => [a.date, String(a.key), String(a.name || '').slice(0, 80), String(a.station).slice(0, 20), a.locked ? 'כן' : '', w.name, now]);
  replaceRange_('שיבוצים - טיוטה', AH, from, to, rowsA);
  if (pub) replaceRange_('שיבוצים', AH, from, to, rowsA);
  replaceRange_('היעדרויות', XH, from, to, (absences || []).filter(a => a && ok(a.date) && a.date >= from && a.date <= to && a.key && a.reason).slice(0, 600)
    .map(a => [a.date, String(a.key), String(a.name || '').slice(0, 80), String(a.reason).slice(0, 30), w.name, now]));
  setWeekState_(from, 'draft', w.name);
  // the first publish of a week marks everyone; a later one only when the editor asked to notify, and then only the interns whose week changed
  if (pub) { opts = opts || {}; const was = weekState_()[from] || {};
    if (!was.pubTs || opts.notify) { const o = setWeekState_(from, 'pub', w.name), cur = o[from];
      cur.pubFirst = was.pubTs ? (was.pubFirst || was.pubTs) : cur.pubTs; cur.pubKeys = was.pubTs && opts.keys ? opts.keys.map(String).slice(0, 60) : null;
      props_().setProperty('WEEK_STATE', JSON.stringify(o)); } }
  return { assigns: assigns_(), absences: absences_(), assignsDraft: assignsDraft_(), weekState: weekState_() };
}
/* weekly schedule: a draft (what the manager sees) separate from what is published to interns */
function assignsDraft_() { return rowsOf_(textSheet_('שיבוצים - טיוטה', AH), AH.length).filter(r => r[0] && r[1]).map(r => ({ date: r[0], key: r[1], name: r[2], station: r[3], locked: r[4] === 'כן' })); }
function weekState_() { let o = {}; try { o = JSON.parse(props_().getProperty('WEEK_STATE') || '{}'); } catch (e) {} return o || {}; }
function setWeekState_(from, k, who) {
  const o = weekState_(); const cur = o[from] || {};
  cur[k] = nowStr_(); cur[k + 'Ts'] = Date.now(); cur[k + 'By'] = who; o[from] = cur;
  const keys = Object.keys(o).sort(); while (keys.length > 60) delete o[keys.shift()];
  props_().setProperty('WEEK_STATE', JSON.stringify(o)); return o;
}

/* ================= manual intern management (edits layer over the form) ================= */
const OH = ['מזהה', 'נוסף ידנית', 'נמחק', 'נתונים', 'עודכן ע״י', 'עודכן'];
const EDIT_FIELDS = ['name', 'phone', 'email', 'inst', 'interest', 'month', 'expect', 'works', 'improve', 'free', 'photoId', 'imonth', 'hospital'];
function overrides_() {
  const out = {};
  rowsOf_(textSheet_('עריכות סטאז׳רים', OH), OH.length).forEach(r => {
    if (!r[0]) return;
    let d = null; try { d = r[3] ? JSON.parse(r[3]) : null; } catch (e) { d = null; }
    out[r[0]] = { manual: r[1] === 'כן', deleted: r[2] === 'כן', data: d };
  });
  return out;
}
function cleanIntern_(d) {
  const o = {};
  EDIT_FIELDS.forEach(f => { if (d && d[f] !== undefined) o[f] = String(d[f] || '').trim().slice(0, f === 'expect' || f === 'works' || f === 'improve' || f === 'free' ? 2000 : 120); });
  if (o.email) o.email = o.email.toLowerCase();
  if (o.imonth !== undefined) o.imonth = imonth_(o.imonth);
  if (d && ['רגיל', 'אלקטיב', 'סלקטיב', 'רק תורנויות', 'טראומה'].indexOf(d.track) >= 0) o.track = d.track;
  if (d && d.thuFri !== undefined) o.thuFri = !!d.thuFri;
  if (d && Array.isArray(d.prefDays)) o.prefDays = d.prefDays.map(Number).filter((x, k, s) => x >= 0 && x <= 6 && s.indexOf(x) === k).sort();
  if (d && Array.isArray(d.avoidDays)) o.avoidDays = d.avoidDays.map(Number).filter((x, k, s) => x >= 0 && x <= 6 && s.indexOf(x) === k).sort();
  if (d && d.dutyOk !== undefined) o.dutyOk = !!d.dutyOk;
  if (d && d.dutyMax !== undefined) o.dutyMax = [4, 5, 6].indexOf(Number(d.dutyMax)) >= 0 ? Number(d.dutyMax) : '';
  if (d && d.extra !== undefined) o.extra = !!d.extra;
  ['start', 'mid', 'end'].forEach(s => {
    if (!d || d[s] === undefined) return;
    const a = (d[s] || []).slice(0, 6).map(v => { const n = Number(v); return n >= 1 && n <= 5 ? Math.round(n) : null; });
    o[s] = a.some(x => x) ? a : null;
  });
  return o;
}
function upsertOverride_(key, fn, who) {
  const sh = textSheet_('עריכות סטאז׳רים', OH);
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const rows = rowsOf_(sh, OH.length);
    let idx = rows.findIndex(r => r[0] === key);
    const cur = idx >= 0 ? { manual: rows[idx][1] === 'כן', deleted: rows[idx][2] === 'כן', data: (() => { try { return JSON.parse(rows[idx][3] || 'null'); } catch (e) { return null; } })() } : { manual: false, deleted: false, data: null };
    const nx = fn(cur);
    const row = [key, nx.manual ? 'כן' : '', nx.deleted ? 'כן' : '', nx.data ? JSON.stringify(nx.data) : '', who, nowStr_()];
    if (idx >= 0) sh.getRange(idx + 2, 1, 1, OH.length).setValues([row]);
    else { sh.getRange(sh.getLastRow() + 1, 1, 1, OH.length).setNumberFormat('@').setValues([row]); }
  } finally { lock.releaseLock(); }
}
function wa_saveIntern(code, key, data) {
  const w = needEdit_(code);
  const d = cleanIntern_(data || {});
  if (!key) {
    if (!d.name) throw new Error('חסר שם');
    if (!d.month) throw new Error('חסר חודש סבב');
    key = (d.email || ('manual-' + Utilities.getUuid().slice(0, 8))) + '|' + d.month;
    const exists = data_().interns.some(i => i.key === key);
    if (exists) throw new Error('כבר קיים/ת סטאז׳ר/ית עם המייל הזה בחודש הזה');
    upsertOverride_(key, () => ({ manual: true, deleted: false, data: d }), w.name);
  } else {
    upsertOverride_(key, cur => ({ manual: cur.manual, deleted: false, data: Object.assign({}, cur.data || {}, d) }), w.name);
  }
  return { key: key, data: data_() };
}
/* internal manager flag ("needs improvement"). Kept in script properties and never sent to the intern app */
function flags_() { let o = {}; try { o = JSON.parse(props_().getProperty('FLAGS') || '{}'); } catch (e) {} return o || {}; }
function wa_setFlag(code, key, f) {
  const w = needEdit_(code);
  key = String(key || ''); if (!key) throw new Error('חסר מזהה');
  const o = flags_();
  if (f && f.warn) o[key] = { warn: true, note: String(f.note || '').trim().slice(0, 200), by: w.name, at: nowStr_() };
  else delete o[key];
  props_().setProperty('FLAGS', JSON.stringify(o));
  return o;
}
function wa_deleteIntern(code, key, restore) {
  const w = needEdit_(code);
  if (!key) throw new Error('חסר מזהה');
  upsertOverride_(String(key), cur => ({ manual: cur.manual, deleted: !restore, data: cur.data }), w.name);
  return data_();
}
function wa_resetIntern(code, key) {
  const w = needEdit_(code);
  upsertOverride_(String(key), cur => ({ manual: cur.manual, deleted: cur.deleted, data: cur.manual ? cur.data : null }), w.name);
  return data_();
}

/* ================= academy: the four rotation seminars ================= */
function seedSeminars_(sh) {
  const n = sh.getLastRow();
  const types = n > 1 ? sh.getRange(2, 2, n - 1, 1).getValues().map(r => String(r[0])) : [];
  if (props_().getProperty('SEEDED_SEM') || types.indexOf('סמינר') >= 0) { props_().setProperty('SEEDED_SEM', '1'); return; }
  props_().setProperty('SEEDED_SEM', '1');
  const now = new Date();
  [['sem1', 'המטופל הכירורגי הדחוף', 'גישה ראשונית, בטן חריפה, בדיקת בטן וספסיס', '1'],
   ['sem2', 'סדנת תפירה', 'מכשירים, להבים, חוטים וחתכים ותרגול התפרים הבסיסיים', '2'],
   ['sem3', 'אפנדיציטיס', 'מהתהליך הדלקתי לאבחנה, הדמיה וטיפול', '3'],
   ['sem4', 'שוק, נוזלים ואלקטרוליטים', 'מה באמת חשוב לדעת על החייאה ומשק המים והמלחים', '4']
  ].forEach(s => sh.appendRow([s[0], 'סמינר', WA.ALL, 'all', s[1], s[2], '', '', '', '', s[3], 'מערכת', now, '']));
}
function wa_sendWelcome(code, key) {
  needEdit_(code);
  const i = data_().interns.filter(x => x.key === key)[0];
  if (!i) throw new Error('הסטאז׳ר/ית לא נמצא/ה');
  if (!i.email || !/@/.test(i.email)) throw new Error('אין כתובת מייל');
  const ok = send_('קישור אישי (ידני)', 'manual|' + key + '|' + Date.now(), i.email, 'הקישור האישי שלך לפורטל הסבב · ' + i.month, welcomeMail_(i), null, false);
  if (!ok) throw new Error('השליחה נכשלה');
  return 'המייל נשלח אל ' + i.email;
}

/* literature: Sabiston as the main source, Schwartz and Current Surgical Therapy as additional sources (runs once) */
function seedLiterature_(sh) {
  const n = sh.getLastRow(); if (n < 2) return;
  const ids = sh.getRange(2, 1, n - 1, 1).getValues().map(r => String(r[0]));
  if (props_().getProperty('SEEDED_LIT') || ids.indexOf('l3') >= 0) { props_().setProperty('SEEDED_LIT', '1'); return; }
  props_().setProperty('SEEDED_LIT', '1');
  const now = new Date();
  const set = (id, title, body, tag) => { const r = ids.indexOf(id); if (r >= 0) { sh.getRange(r + 2, 5, 1, 2).setValues([[title, body]]); sh.getRange(r + 2, 11).setValue(tag); sh.getRange(r + 2, 13).setValue(now); } };
  set('l2', 'Sabiston Textbook of Surgery, 22nd ed.', 'מקור הלמידה העיקרי של הסבב. הסמינרים מבוססים עליו', 'מקור עיקרי');
  set('l1', "Schwartz's Principles of Surgery", 'ספר לימוד מקיף בכירורגיה כללית, להעמקה', 'מקור נוסף');
  sh.appendRow(['l3', 'ספרות', WA.ALL, 'all', 'Current Surgical Therapy, 14th ed. (2023)', 'Cameron & Cameron. גישה מעשית לטיפול, פרק לכל מחלה', '', '', '', '', 'מקור נוסף', 'מערכת', now, '']);
}

/* academy: keep only MEDtube in the videos (called once from seedVideos_) */
function removeVideos_() {
  const sh = contentSheet_();
  const n = sh.getLastRow(); if (n < 2) return;
  const ids = sh.getRange(2, 1, n - 1, 1).getValues().map(r => String(r[0]));
  const out = [];
  for (let r = ids.length - 1; r >= 0; r--) { if (ids[r] === 'v1' || ids[r] === 'v3') { sh.deleteRow(r + 2); out.push(ids[r]); } }
  props_().setProperty('SEEDED_VIDEOS', '1');
  Logger.log('נמחקו: ' + out.join(', '));
}
/* academy: operating-room video platforms (runs once) */
function seedVideos_(sh) {
  if (!props_().getProperty('CLEANED_VIDEOS')) { props_().setProperty('CLEANED_VIDEOS', '1'); removeVideos_(); return; }
  const n = sh.getLastRow(); if (n < 2) return;
  const ids = sh.getRange(2, 1, n - 1, 1).getValues().map(r => String(r[0]));
  if (props_().getProperty('SEEDED_VIDEOS') || ids.some(x => /^v\d/.test(x))) { props_().setProperty('SEEDED_VIDEOS', '1'); return; }
  props_().setProperty('SEEDED_VIDEOS', '1');
  const now = new Date();
  [['v1', 'WebSurg · IRCAD', 'האוניברסיטה המקוונת של IRCAD בשטרסבורג. אלפי סרטוני ניתוח מוסברים, בעיקר כירורגיה זעיר-פולשנית', 'https://www.websurg.com', 'הרשמה חינם'],
   ['v2', 'MEDtube', 'ספריית סרטונים רפואיים בכל התחומים: ניתוחים, אנימציות ומקרים', 'https://medtube.net', 'הרשמה חינם'],
   ['v3', 'Touch Surgery', 'סימולציות אינטראקטיביות של ניתוחים, צעד אחר צעד, בטלפון', 'https://www.touchsurgery.com', 'אפליקציה']
  ].forEach(v => sh.appendRow([v[0], 'וידאו', WA.ALL, 'all', v[1], v[2], '', '', '', v[3], v[4], 'מערכת', now, '']));
}

function qaHealth() { if (!isOwnerSession_()) return;
  const out = [], ok = (c, m) => out.push((c ? 'PASS ' : 'FAIL ') + m);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const names = ss.getSheets().map(x => x.getName());
    ['לוח בקרה','תגובות לטופס 1','הערכת צוות','הגדרות ורשימות','תוכן פורטל',WA.NOTES,'רשימת סבב','תורנויות','שיבוצים','היעדרויות','עריכות סטאז׳רים'].forEach(n => ok(names.indexOf(n) >= 0 || names.some(x => x.replace(/[׳']/g,'') === n.replace(/[׳']/g,'')), 'גיליון: ' + n));
  } catch (e) { ok(false, 'גיליונות: ' + e.message); }
  let d = null;
  try { d = data_(); ok(true, 'data_: ' + d.interns.length + ' סטאז׳רים, חודשים: ' + (d.months || []).join(', ')); } catch (e) { ok(false, 'data_: ' + e.message); }
  if (d) d.interns.forEach(i => {
    try {
      const m = String(i.link || '').match(/[?&]t=([^&]+)/);
      if (!m) { ok(false, 'קישור חסר: ' + i.name); return; }
      const r = wa_intern(decodeURIComponent(m[1]));
      ok(r && r.ok, 'פורטל אישי נטען: ' + i.name + ' (' + i.month + ')' + (r && r.ok ? ' · סמינרים ' + (r.seminars || []).length + ' · סרטונים ' + (r.videos || []).length + ' · עמדות ' + (r.stations || []).length : ''));
    } catch (e) { ok(false, 'פורטל אישי ' + i.name + ': ' + e.message); }
  });
  try { const c = content_(); const sem = c.filter(x => x.type === 'סמינר'); ok(sem.length === 4, 'סמינרים: ' + sem.length + ', עם קישור: ' + sem.filter(x => x.link).length); ok(true, 'ספרות: ' + c.filter(x => x.type === 'ספרות').map(x => x.title).join(' | ')); ok(true, 'סרטונים: ' + c.filter(x => x.type === 'וידאו').map(x => x.title).join(' | ')); } catch (e) { ok(false, 'תוכן: ' + e.message); }
  try { ok(stations_().length > 0, 'עמדות שיבוץ: ' + stations_().length); ok(true, 'שיבוצים: ' + assigns_().length + ', היעדרויות: ' + absences_().length); } catch (e) { ok(false, 'שיבוץ: ' + e.message); }
  try { const t = ScriptApp.getProjectTriggers().map(x => x.getHandlerFunction()); ok(t.indexOf('onIntakeSubmit') >= 0 && t.indexOf('dailyAutomation') >= 0, 'טריגרים פעילים: ' + t.join(', ')); } catch (e) { ok(false, 'טריגרים: ' + e.message); }
  try { const q = MailApp.getRemainingDailyQuota(); ok(q > 20, 'מכסת מיילים יומית שנותרה: ' + q); } catch (e) { ok(false, 'מיילים: ' + e.message); }
  try { const f = FormApp.openById(WA.FORM_ID); ok(f.isAcceptingResponses(), 'הטופס מקבל תגובות'); const cm = f.getConfirmationMessage(); ok(cm.indexOf('team@surgeryx.example') >= 0 && cm.indexOf('7586818') < 0, 'הודעת סיום הטופס עם המייל של המערך, בלי טלפון'); } catch (e) { ok(false, 'טופס: ' + e.message); }
  try { const a = admins_(); ok(a.some(x => x.role === 'owner'), 'מנהלים: ' + a.map(x => x.name + ' (' + x.role + ')').join(' | ')); ok(new Set(a.map(x => x.code)).size === a.length, 'כל הקודים שונים'); } catch (e) { ok(false, 'מנהלים: ' + e.message); }
  try { ok(Session.getEffectiveUser().getEmail() === 'team@surgeryx.example', 'הקוד רץ מהחשבון: ' + Session.getEffectiveUser().getEmail()); } catch (e) { ok(false, 'חשבון: ' + e.message); }
  Logger.log(out.join('\n'));
}

/* emblem of the surgical division, inlined into both pages by doGet */
const EMBLEM_B64 = '';
function wa_emblem() { return 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20256%20256%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%23D9C79E%22%2F%3E%3Cstop%20offset%3D%22.5%22%20stop-color%3D%22%232C5F6E%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%239A7B4F%22%2F%3E%3C%2FlinearGradient%3E%3ClinearGradient%20id%3D%22n%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%220%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%2313353F%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23071C24%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22256%22%20height%3D%22256%22%20rx%3D%2256%22%20fill%3D%22url%28%23n%29%22%2F%3E%3Ccircle%20cx%3D%22128%22%20cy%3D%22128%22%20r%3D%2292%22%20fill%3D%22none%22%20stroke%3D%22rgba%28143%2C216%2C255%2C.18%29%22%20stroke-width%3D%222%22%2F%3E%3Cpath%20d%3D%22M70%2062%20L128%20120%20L186%2062%20L194%2070%20L136%20128%20L194%20186%20L186%20194%20L128%20136%20L70%20194%20L62%20186%20L120%20128%20L62%2070%20Z%22%20fill%3D%22url%28%23g%29%22%2F%3E%3Ccircle%20cx%3D%22128%22%20cy%3D%22128%22%20r%3D%229%22%20fill%3D%22%23071C24%22%20stroke%3D%22%23D9C79E%22%20stroke-width%3D%223%22%2F%3E%3C%2Fsvg%3E'; }

/* user guides: one for interns (shown in the portal) and one for managers (dashboard). Links are pasted from the dashboard */
function seedGuides_(sh) {
  if (props_().getProperty('SEEDED_GUIDES')) return;
  props_().setProperty('SEEDED_GUIDES', '1');
  const now = new Date();
  sh.appendRow(['g1', 'מדריך', WA.ALL, 'all', 'מדריך לסטאז׳רים', 'איך משתמשים בפורטל: מסך הבית, לו״ז, תורנויות, סמינרים, טפסים ומשוב', '', '', '', '', 'סטאז׳רים', 'מערכת', now, '']);
  sh.appendRow(['g2', 'מדריך', WA.ALL, 'all', 'מדריך למנהלים', 'ניהול הסבב מהדשבורד: סטאז׳רים, שיבוץ, תורנויות, הודעות והגדרות', '', '', '', '', 'מנהלים', 'מערכת', now, '']);
}

/* ================= daily summary v2: attendance, task checklist, Thursday weekly, last-Thursday rotation summary ================= */
const DL_TASKS = [['morning','השתתפתי בישיבת הבוקר'],['teach','השתתפתי בישיבת לימודים'],['round','השתתפתי בביקור'],['pres','הצגתי מטופל בביקור'],['blood','לקחתי דמים'],['iv','הכנסתי וונפלונים'],['ecg','ביצעתי אק״ג'],['adm','כתבתי קבלה'],['dis','כתבתי מכתב שחרור'],['er','עבדתי במיון'],['preop','עבדתי בטרום ניתוח'],['or','הייתי בחדר ניתוח'],['proc','ביצעתי פעולה או תפירה'],['clinic','הייתי במרפאה או בייעוץ']];
const DL_ACTS = DL_TASKS;
const DL_REASONS = ['אחרי תורנות', 'מחלה', 'חופש', 'מילואים', 'אחר'];
const DLH2 = ['תאריך','מפתח','שם','חודש הסבב','סוג','נוכחות','סיבה','משימות','הערה','מה עוד עשיתי ונחשפתי','שיפור קליני','פרוצדורות','יחס הצוות','העשרת ידע','איך אני מרגיש/ה','מה לשפר','מיומנויות','שביעות רצון','סמינר','המלצה','שוקל/ת התמחות','משוב על הסבב','עודכן'];
function todayStr_() { return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'); }
function dayLogs_() {
  return rowsOf_(textSheet_('סיכומי יום', DLH2), DLH2.length).filter(r => r[0] && r[1]).map(r => {
    const tasks = String(r[7] || '').split(',').filter(Boolean);
    const acts = {}; DL_TASKS.forEach(t => { acts[t[0]] = tasks.indexOf(t[0]) >= 0 ? 1 : 0; });
    const sk = String(r[16] || '').split(',').map(x => +x || null);
    const present = r[5] !== 'לא';
    return { date: r[0], key: r[1], name: r[2], month: r[3], kind: r[4] || 'יומי', present: present, status: present ? 'עבדתי' : (r[6] || 'אחר'), reason: r[6], tasks: tasks, acts: acts, note: r[8],
      exposure: r[9], eff: +r[10] || 0, prog: +r[11] || 0, belong: +r[12] || 0, teach: +r[13] || 0, feel: r[14], improve: r[15], skills: sk.some(Boolean) ? sk : null,
      sat: +r[17] || 0, seminar: +r[18] || 0, recommend: +r[19] || 0, consider: r[20], free: r[21], at: r[22] };
  });
}
function wa_dayLog(token, e) {
  const key = keyFrom_(token); bump_();
  const i = data_().interns.filter(x => x.key === key)[0];
  if (!i) throw new Error('BADLINK');
  e = e || {};
  const today = todayStr_();
  const date = /^\d{4}-\d{2}-\d{2}$/.test(e.date || '') ? e.date : today;
  if (date > today) throw new Error('אי אפשר למלא יום עתידי');
  if (date < shiftDay_(today, -5)) throw new Error('אפשר להשלים עד 5 ימים אחורה');
  { const p = String(i.month || '').split(' '), mi = JOIN_MONTHS.indexOf(p[0]), y = Number(p[1]);
    if (mi >= 0 && y && (date < ymd_(new Date(y, mi, 1)) || date > ymd_(new Date(y, mi + 1, 0)))) throw new Error('התאריך מחוץ לחודש הסבב'); }
  const present = e.present !== false;
  const reason = present ? '' : (DL_REASONS.indexOf(e.reason) >= 0 ? e.reason : 'אחר');
  const tasks = present ? (e.tasks || []).filter(t => DL_TASKS.some(x => x[0] === t)).join(',') : '';
  const kind = ['יומי', 'שבועי', 'סיכום סבב'].indexOf(e.kind) >= 0 ? e.kind : 'יומי';
  const w = kind !== 'יומי', fin = kind === 'סיכום סבב';
  const s5 = v => { const x = parseInt(v, 10); return x >= 1 && x <= 5 ? String(x) : ''; };
  const tx = (v, m) => String(v || '').trim().slice(0, m);
  const sk = w ? WA.SKILLS.map((s, k) => s5((e.skills || [])[k])).join(',') : '';
  const row = [date, key, i.name, i.month, kind, present ? 'כן' : 'לא', reason, tasks, tx(e.note, 600),
    w ? tx(e.exposure, 1500) : '', w ? s5(e.eff) : '', w ? s5(e.prog) : '', w ? s5(e.belong) : '', w ? s5(e.teach) : '', w ? tx(e.feel, 1500) : '', w ? tx(e.improve, 1500) : '', sk,
    fin ? s5(e.sat) : '', fin ? s5(e.seminar) : '', fin ? s5(e.recommend) : '', fin && ['כן', 'אולי', 'לא'].indexOf(e.consider) >= 0 ? e.consider : '', fin ? tx(e.free, 2000) : '', nowStr_()];
  const sh = textSheet_('סיכומי יום', DLH2);
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const rows = rowsOf_(sh, DLH2.length);
    const idx = rows.findIndex(r => r[0] === date && r[1] === key);
    if (idx >= 0) sh.getRange(idx + 2, 1, 1, DLH2.length).setValues([row]); else sh.appendRow(row);
  } finally { lock.releaseLock(); }
  return { ok: true, daylog: dayLogs_().filter(x => x.key === key) };
}

/* ================= daily summary reminders v2: same day at 16:00, and again three days later ================= */
function shiftDay_(iso, k) { const p = iso.split('-'); const d = new Date(+p[0], +p[1] - 1, +p[2], 12); d.setDate(d.getDate() + k); return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd'); }
function isWork_(iso) { const p = iso.split('-'); return new Date(+p[0], +p[1] - 1, +p[2], 12).getDay() <= 4; }
function heDay_(iso) { const p = iso.split('-'); return ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'][new Date(+p[0], +p[1] - 1, +p[2], 12).getDay()]; }
// tracks that only do nights with us: duties-only, and the trauma unit's intern (with the unit by day)
function dutyOnly_(t) { return t === 'רק תורנויות' || t === 'טראומה'; }
function dayActive_(d) { const month = curMonth_(new Date()); return d.interns.filter(i => i.month === month && !dutyOnly_(i.track) && (i.start || (i.stages && i.stages['פתיחה'])) && i.email); }
function covered_(i, dt, logs, abs, duties) {
  return logs.some(x => x.key === i.key && x.date === dt) || abs.some(a => a.key === i.key && a.date === dt) || duties.some(x => x.key === i.key && x.date === shiftDay_(dt, -1));
}
function dailyReminder() {
  const cfg = autoCfg_(); if (!cfg.daily) return;
  const today = todayStr_(), d = data_(), sent = sentKeys_(), logs = dayLogs_(), abs = absences_(), duties = duties_();
  const m0 = today.slice(0, 8) + '01', d3 = shiftDay_(today, -3), thu = heDay_(today) === 'חמישי';
  dayActive_(d).forEach(i => {
    const miss = [];
    if (isWork_(today) && !covered_(i, today, logs, abs, duties)) miss.push(today);
    if (d3 >= m0 && isWork_(d3) && !covered_(i, d3, logs, abs, duties)) miss.push(d3);
    if (!miss.length) return;
    const f = (i.name || '').split(' ')[0];
    const lbl = dt => dt === today ? 'היום' : 'יום ' + heDay_(dt) + ' ' + (+dt.slice(8)) + '/' + (+dt.slice(5, 7));
    const onlyToday = miss.length === 1 && miss[0] === today;
    const line = onlyToday ? (thu ? 'היום יום חמישי: סיכום היום ואחריו סיכום שבועי קצר. כמה דקות וזה עוזר לנו מאוד לשפר את הסבב.' : 'עוד לא מילאת את סיכום היום. 30 שניות: איפה היית ומה עשית היום.') : 'חסרים לנו סיכומים: ' + miss.map(lbl).join(', ') + '. אפשר להשלים בדיעבד, עד 5 ימים אחורה.';
    send_('תזכורת סיכום יום', 'day|' + today + '|' + i.key, i.email, onlyToday ? 'סיכום היום שלך · 30 שניות' : 'חסרים לך סיכומי יום', mailHtml_('איך היה היום?', [`היי ${esc_(f)},`, line], { label: 'למילוי הסיכום', url: linkFor_(i) }), sent);
  });
}
/* kept for the morning hook; the second reminder now goes out at 16:00, three days later */
function dayMissMorning_(d, sent) { return; }

/* ================= mid / end feedback inside the app (replaces the form stages) ================= */
function sfHeaders_() { return ['תאריך', 'מפתח', 'שם', 'חודש הסבב', 'שלב'].concat(WA.SKILLS).concat(['איך הסבב עד עכשיו', 'מה עובד טוב', 'מה כדאי לשפר', 'שביעות רצון כללית', 'סמינר', 'המלצה לחברים', 'שוקל/ת התמחות', 'משוב חופשי']); }
function stageFb_() {
  const H = sfHeaders_(), n = WA.SKILLS.length;
  return rowsOf_(textSheet_('משובי סבב', H), H.length).filter(r => r[1] && r[4]).map(r => ({
    key: r[1], stage: r[4], skills: WA.SKILLS.map((s, k) => +r[5 + k] || null),
    midSat: +r[5 + n] || null, works: r[6 + n], improve: r[7 + n], sat: +r[8 + n] || null, seminar: +r[9 + n] || null, recommend: +r[10 + n] || null, consider: r[11 + n], free: r[12 + n] }));
}
function wa_stageFeedback(token, stage, f) {
  const key = keyFrom_(token); bump_();
  const i = data_().interns.filter(x => x.key === key)[0];
  if (!i) throw new Error('BADLINK');
  if (['אמצע', 'סיום'].indexOf(stage) < 0) throw new Error('שלב לא תקין');
  f = f || {};
  const s5 = v => { const x = parseInt(v, 10); return x >= 1 && x <= 5 ? String(x) : ''; };
  const tx = (v, m) => String(v || '').trim().slice(0, m);
  const H = sfHeaders_();
  const row = [nowStr_(), key, i.name, i.month, stage].concat(WA.SKILLS.map((s, k) => s5((f.skills || [])[k])))
    .concat([s5(f.midSat), tx(f.works, 1500), tx(f.improve, 1500), s5(f.sat), s5(f.seminar), s5(f.recommend), ['כן', 'אולי', 'לא'].indexOf(f.consider) >= 0 ? f.consider : '', tx(f.free, 2000)]);
  const sh = textSheet_('משובי סבב', H);
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const rows = rowsOf_(sh, H.length);
    const idx = rows.findIndex(r => r[1] === key && r[4] === stage);
    if (idx >= 0) sh.getRange(idx + 2, 1, 1, H.length).setValues([row]); else sh.appendRow(row);
  } finally { lock.releaseLock(); }
  return wa_intern(token);
}

/* add-to-home-screen illustrations, attached inline (cid) to the welcome email */
const A2HS_IOS_B64 = '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';
const A2HS_AND_B64 = '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';
function mailOpts_(o) {
  const h = String(o.htmlBody || ''), im = {};
  if (!o.body && h) o.body = mailText_(h);
  if (!o.replyTo) { try { o.replyTo = owner_(); } catch (e) {} }
  const bl = (s, t, n) => Utilities.newBlob(Utilities.base64Decode(s), t, n);
  if (h.indexOf('cid:a2hs_') >= 0) { im.a2hs_ios = bl(A2HS_IOS_B64, 'image/png', 'iphone.png'); im.a2hs_and = bl(A2HS_AND_B64, 'image/png', 'android.png'); }
  if (h.indexOf('cid:kbanner') >= 0) im.kbanner = bannerBlob_();
  if (h.indexOf('cid:sxots') >= 0) im.sxots = bl(MAIL_SHOTS_B64, 'image/jpeg', 'screens.jpg');
  if (h.indexOf('cid:kdeck') >= 0) { try { const f = deckFile_(); const t = f.getThumbnail(); if (t) im.kdeck = t.setName('deck.png'); o.attachments = [f.getBlob().setName('Surgery X - מצגת להנהלה.pdf')]; } catch (e) { Logger.log('deck: ' + e.message); } }
  if (Object.keys(im).length) o.inlineImages = im;
  return o;
}
/* plain-text twin of an html mail: spam filters trust multipart mails more, and links stay readable */
function mailText_(h) {
  return String(h).replace(/<head[\s\S]*?<\/head>/i, '').replace(/<img[^>]*>/gi, '').replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (m, u, t) => t.replace(/<[^>]+>/g, '').trim() + ': ' + u)
    .replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|span|tr|h\d)>/gi, '\n').replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .split('\n').map(l => l.trim()).filter((l, k, a) => l || (k && a[k - 1])).join('\n').trim();
}
function a2hsMail_() {
  const col = (cid, t, alt, cap) => `<td style="width:50%;vertical-align:top;padding:0 4px;text-align:center"><b style="font-size:14px">${t}</b><img src="cid:${cid}" width="250" alt="${alt}" style="width:100%;max-width:250px;height:auto;display:block;margin:6px auto 4px;border:1px solid #EADFC6;border-radius:8px;background:#fff"><span style="font-size:12px;color:#3E5960;line-height:1.4">${cap}</span></td>`;
  return '<span style="display:block;padding:8px 0 0"><table role="presentation" cellpadding="0" cellspacing="0" style="width:100%"><tr>'
    + col('a2hs_ios', '📱 אייפון · ספארי', 'אייפון: שיתוף, הוספה למסך הבית, הוסף', 'שיתוף ⬆️ ← ״הוספה למסך הבית״ ← ״הוסף״')
    + col('a2hs_and', '📱 אנדרואיד · כרום', 'אנדרואיד: שלוש נקודות, הוספה למסך הבית, הוספה', '⋮ למעלה ← ״הוספה למסך הבית״ ← ״הוספה״')
    + '</tr></table><span style="display:block;margin-top:8px;background:#FFF1D6;border-radius:8px;padding:7px 10px;font-size:12.5px;color:#8E6526;font-weight:700">💡 נפתח בתוך Gmail? קודם בוחרים ״פתיחה בדפדפן״ ורק אז מוסיפים.</span></span>';
}

/* email images: header banner (logos and emblem) and a strip of screens */
const MAIL_BANNER_B64 = '';
const MAIL_SHOTS_B64 = '';

/* email to management: designed summary of the project, with the banner and a strip of screens */
function bossMailHtml_() {
  const DECK = 'https://drive.google.com/file/d/DEMO_ID_7/view';
  const U = 'https://surgeryx.example/';
  const BK = 'https://drive.google.com/file/d/DEMO_ID_8/view', GM = 'https://drive.google.com/file/d/DEMO_ID_9/view', GI = 'https://drive.google.com/file/d/DEMO_ID_10/view';
  const lbl = t => `<div style="font-size:12px;color:#B8863B;font-weight:700;letter-spacing:.6px;margin:0 0 10px">${t}</div>`;
  const step = (n, c, t, s) => `<tr><td style="width:34px;vertical-align:top;padding:7px 0"><span style="display:inline-block;width:26px;height:26px;border-radius:13px;background:${c};color:#fff;text-align:center;line-height:26px;font-weight:700;font-size:14px">${n}</span></td><td style="padding:7px 0;border-bottom:1px solid #EEE9DF;font-size:15px;line-height:1.5"><b>${t}</b> ${s}</td></tr>`;
  const card = (ic, t, s, u) => `<td style="width:33%;padding:0 4px;vertical-align:top"><a href="${u}" style="display:block;text-decoration:none;background:#F5F2EA;border:1px solid #E2DCCF;border-radius:12px;padding:12px 10px;text-align:center;color:#0C2A35"><span style="font-size:24px">${ic}</span><br><b style="font-size:14px">${t}</b><br><span style="font-size:12px;color:#6B7B80">${s}</span></a></td>`;
  return `<div dir="rtl" style="background:#ffffff;padding:6px 0;font-family:Arial,Helvetica,sans-serif"><div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #ECE6DA">
  <div style="background:#0C2A35;line-height:0;font-size:0"><img src="cid:kbanner" width="600" alt="Surgery X · המערך הכירורגי, המרכז הרפואי אופק" style="display:block;width:100%;max-width:600px;height:auto;border:0"></div>
  <div style="background:#0C2A35;color:#F5F2EA;padding:12px 24px;font-size:17px;font-weight:700">המערכת החדשה לסבב הסטאז׳רים במערך</div>
  <div style="padding:22px 24px;color:#0C2A35;font-size:16px;line-height:1.65">
  <p style="margin:0 0 12px">פרופ׳ אלמוג שלום,</p>
  <p style="margin:0 0 12px">בעקבות הפיילוט הראשוני שראית ובהמשך לשיחותינו על הצורך הדחוף לשפר את סבב הסטאז׳רים, אני גאה להציג לך מערכת מתקדמת לניהול הסבב במערך. המערכת מוכנה לעבודה החל מהסבב הקרוב.</p>
  <p style="margin:0 0 12px">מייל זה מיועד לך באופן אישי: סקירה קצרה של מה שבניתי ושל אופן פעולת המערכת. בסופו תמצא את פרטי הכניסה האישיים שלך לדשבורד. המערכת פועלת על גבי כלי Google ללא עלות.</p>
  <p style="margin:0 0 20px">אשמח אם תקדיש כמה דקות לסקירה מעמיקה של הפונקציות השונות. זוהי מערכת מתוחכמת הנותנת מענה למגוון בעיות, בעיקר בתחומי הניהול והבקרה. לא ארחיב בפרטים הטכניים. את יתרונותיה תגלה תוך כדי שימוש.</p>
  ${lbl('מה בנינו, שלב אחר שלב')}
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-bottom:20px">
  ${step(1, '#B8863B', 'הרשמה וקישור אישי.', 'הסטאז׳ר ממלא טופס הרשמה קצר ותוך דקה מקבל במייל קישור לאפליקציה אישית.')}
  ${step(2, '#187A5C', 'אפליקציה לסטאז׳ר.', 'שיבוץ יומי, תורנויות, הודעות, סמינרים וספרון קליטה. הכול זמין בטלפון בלחיצה אחת.')}
  ${step(3, '#187A5C', 'דשבורד למנהלים.', 'תמונת מצב, שיבוץ שבועי אוטומטי, לוח תורנויות והודעות לסבב.')}
  ${step(4, '#187A5C', 'אקדמיה.', 'ארבעה סמינרים מבוססי Sabiston, ספרון קליטה ומדריכי שימוש לכל המשתמשים.')}
  ${step(5, '#0C2A35', 'יומן הסבב.', 'סיכום יומי של 30 שניות וסיכום שבועי בכל יום חמישי, בליווי תזכורות אוטומטיות.')}
  </table>
  ${lbl('איך זה נראה')}
  <img src="cid:sxots" width="552" alt="הדשבורד, סיכום היום ומסך הבית של הסטאז׳ר" style="display:block;width:100%;height:auto;border-radius:12px;border:1px solid #E2DCCF">
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:6px 0 20px;font-size:12px;color:#6B7B80;text-align:center"><tr><td style="width:24%">מסך הבית של הסטאז׳ר</td><td style="width:24%">סיכום היום</td><td style="width:52%">דשבורד המנהלים · יומן הסבב</td></tr></table>
  <div style="background:#0C2A35;color:#F5F2EA;border-radius:12px;padding:15px 18px;margin-bottom:20px;line-height:1.6"><b style="color:#E2B66A;font-size:16px">📝 יומן הסבב: הלב של המערכת</b><span style="display:block;margin-top:6px">בסוף כל יום ממלא כל סטאז׳ר סיכום של 30 שניות: האם נכח במחלקה, מה הסיבה אם נעדר ואילו פעולות ביצע בפועל (ביקור, לקיחת דמים, קבלות, חדר ניתוח, מיון).</span><span style="display:block;margin-top:8px">בכל יום חמישי מצטרף לכך סיכום שבועי קצר: שיפור קליני, יחס הצוות, איכות ההוראה והצעות לשיפור.</span><span style="display:block;margin-top:8px;color:#E8DCC2">לראשונה עומד לרשותנו <b style="color:#F5F2EA">כלי מעקב כמותי ואיכותי</b> בזמן אמת.</span><span style="display:block;margin-top:4px;color:#E8DCC2">כך ניתן לזהות קשיים כבר באמצע הסבב, לפני המשוב של סופו.</span></div>
  <div style="border:2px solid #B8863B;background:#FFF9EE;border-radius:12px;padding:14px 16px;margin-bottom:20px">
  <b style="font-size:17px">🔑 הכניסה שלך לדשבורד</b>
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-top:10px"><tr>
  <td style="width:44%;vertical-align:top;padding-left:12px"><a href="${U}" style="background:#B8863B;color:#ffffff;text-decoration:none;font-weight:700;padding:11px 20px;border-radius:999px;display:inline-block">לכניסה לדשבורד</a><div style="margin-top:12px;font-size:14px">הקוד האישי שלך:<br><b style="display:inline-block;margin-top:4px;font-size:20px;letter-spacing:3px;background:#ffffff;border:1px solid #E2DCCF;border-radius:8px;padding:2px 10px">887874</b></div></td>
  <td style="vertical-align:top;font-size:13.5px;color:#3E5960;line-height:1.55;border-right:1px solid #EADFC6;padding-right:12px">💻 <b style="color:#0C2A35">מהמחשב:</b> פותחים בכרום ושומרים כסימנייה ⭐<br><br>📱 <b style="color:#0C2A35">מהטלפון:</b> שומרים כאפליקציה במסך הבית לפי האיור שלמטה.<br><br>הקוד נשמר במכשיר אחרי הכניסה הראשונה.</td>
  </tr></table>${a2hsMail_()}</div>
  ${lbl('החומרים')}
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:10px"><tr>${card('📘', 'ספרון הסטאז׳רים', 'קליטה, נהלים ותבניות', BK)}${card('📙', 'מדריך למנהלים', 'הדשבורד צעד אחר צעד', GM)}${card('📗', 'מדריך לסטאז׳רים', 'האפליקציה צעד אחר צעד', GI)}</tr></table>
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 20px;border:1px solid #E2DCCF;border-radius:12px;background:#F5F2EA"><tr><td style="padding:14px 16px;vertical-align:middle"><div style="font-size:12px;color:#B8863B;font-weight:700;letter-spacing:.6px">📊 מצגת להנהלה</div><div style="font-size:16px;font-weight:700;margin:4px 0 6px;color:#0C2A35">Surgery X בקצרה</div><div style="font-size:13.5px;color:#3E5960;line-height:1.5;margin-bottom:12px">הבעיה, הפתרון המיידי, המערכת בפעולה ומדדי ההצלחה. המצגת מצורפת גם כקובץ PDF.</div><a href="${DECK}" style="background:#B8863B;color:#ffffff;text-decoration:none;font-weight:700;padding:9px 18px;border-radius:999px;display:inline-block;font-size:14px">לצפייה במצגת</a></td><td style="width:45%;padding:12px;vertical-align:middle"><a href="${DECK}"><img src="cid:kdeck" width="240" alt="שער המצגת להנהלה" style="display:block;width:100%;max-width:240px;height:auto;border-radius:8px;border:1px solid #E2DCCF"></a></td></tr></table>
  <div style="background:#EEF6F2;border-radius:12px;padding:13px 16px;margin-bottom:20px;font-size:15px"><b>הצעד הבא:</b> פיילוט בסבב הקרוב והשוואת המשוב לסבבים הקודמים. אשמח לפגישה של 15 דקות כדי להראות לך את המערכת בפועל.</div>
  <p style="margin:0">תודה,<br><b>איתן</b><br><span style="font-size:13px;color:#6B7B80">ד״ר איתן רז · המערך הכירורגי, אופק</span></p>
  </div>
  <div style="padding:11px 24px;background:#FAFAF8;color:#6B7B80;font-size:12px;border-top:1px solid #EEE9DF">Surgery X · המערך הכירורגי, המרכז הרפואי אופק</div></div></div>`;
}

/* header banner for the emails: taken from the sx-banner.jpg file in Drive (sharp, easy to replace); if missing, falls back to the built-in banner */
function bannerBlob_() {
  try { return DriveApp.getFileById('DEMO_ID_11').getBlob().setName('sx.jpg'); } catch (e) { Logger.log('banner by id: ' + e.message); }
  try {
    const it = DriveApp.getFilesByName('sx-banner.jpg');
    if (it.hasNext()) return it.next().getBlob().setName('sx.jpg');
  } catch (e) {}
  Logger.log('banner: using built-in fallback');
  return Utilities.newBlob(Utilities.base64Decode(MAIL_BANNER_B64), 'image/jpeg', 'sx.jpg');
}

/* the management presentation in Drive: cover image in the email and an automatic PDF attachment */
function deckFile_() { return DriveApp.getFileById('DEMO_ID_7'); }

/* profile photo for an intern added manually: saved in the system's Drive folder, read like photos from the form */
function photoFolder_() {
  let root; try { root = DriveApp.getFolderById('DEMO_ID_12'); } catch (e) { root = DriveApp.getRootFolder(); }
  const it = root.getFoldersByName('תמונות סטאז׳רים (ידני)');
  return it.hasNext() ? it.next() : root.createFolder('תמונות סטאז׳רים (ידני)');
}
function wa_uploadPhoto(code, b64, mime, name) {
  needEdit_(code);
  const b = String(b64 || '');
  if (!b) throw new Error('לא התקבלה תמונה');
  return { id: savePhoto_('manual:' + String(name || '').slice(0, 40), 'data:' + (mime || 'image/jpeg') + ';base64,' + b) };
}
/* photos uploaded from the app live in a sheet (one compressed JPEG per row), so no Drive write access is needed */
const PHH = ['מזהה', 'שייך ל', 'תמונה', 'עודכן'];
function photoSheet_() { return textSheet_('תמונות מהאפליקציה', PHH); }
function savePhoto_(owner, dataUrl) {
  dataUrl = String(dataUrl || '');
  if (!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/]+=*$/.test(dataUrl)) throw new Error('קובץ התמונה לא תקין');
  if (dataUrl.length > 49000) throw new Error('התמונה גדולה מדי');
  const id = 'sh-' + Utilities.getUuid().slice(0, 13);
  const sh = photoSheet_();
  sh.getRange(sh.getLastRow() + 1, 1, 1, PHH.length).setNumberFormat('@').setValues([[id, String(owner || ''), dataUrl, nowStr_()]]);
  try { CacheService.getScriptCache().put('ph_' + id, dataUrl, 21600); } catch (e) {}
  return id;
}
function sheetPhoto_(id) {
  const cache = CacheService.getScriptCache();
  const hit = cache.get('ph_' + id); if (hit) return hit;
  const r = rowsOf_(photoSheet_(), PHH.length).filter(x => x[0] === id)[0];
  if (r && r[2]) { try { cache.put('ph_' + id, r[2], 21600); } catch (e) {} return r[2]; }
  return '';
}
/* the intern uploads a profile photo from the app (replaces the photo question that used to be in the form) */
function wa_internPhoto(token, dataUrl) {
  const key = keyFrom_(token); bump_();
  const id = savePhoto_(key, dataUrl);
  upsertOverride_(key, cur => ({ manual: cur.manual, deleted: cur.deleted, data: Object.assign({}, cur.data || {}, { photoId: id }) }), 'סטאז׳ר/ית');
  try { CacheService.getScriptCache().remove('crew_' + Utilities.base64EncodeWebSafe(key.split('|')[1] || '')); } catch (e) {}
  return sheetPhoto_(id);
}

function testBoot2() { if (!isOwnerSession_()) return; const t = Date.now(); try { const r = wa_boot('499259'); Logger.log('boot ok ' + JSON.stringify(r).length + ' chars | ' + (Date.now() - t) + 'ms'); } catch (e) { Logger.log('boot ERR ' + e.message + ' | ' + e.stack); } }

/* ================= automation: weekly/monthly reports, weekly schedule, pre-rotation reminder ================= */
const ymd_ = dt => Utilities.formatDate(dt, Session.getScriptTimeZone(), 'yyyy-MM-dd');
const dm_ = s => String(s).split('-').reverse().slice(0, 2).join('/');
function dashUrl_() { try { return APP_URL || ScriptApp.getService().getUrl() || ''; } catch (e) { return ''; } }
function mgrTo_(extra) { return [owner_()].concat(String(extra || '').split(/[\s,;]+/)).filter(x => /@/.test(x)).filter((x, k, a) => a.indexOf(x) === k).join(','); }
function workDays_(from, to) { const out = [], b = new Date(to + 'T12:00:00'); for (let x = new Date(from + 'T12:00:00'); x <= b; x.setDate(x.getDate() + 1)) if (x.getDay() <= 4) out.push(ymd_(x)); return out; }
function internStats_(d, L, days) {
  const set = new Set(days);
  return L.map(i => {
    const logs = (d.daylogs || []).filter(l => l.key === i.key && set.has(l.date));
    const byDay = {}; logs.forEach(l => byDay[l.date] = l);
    const wk = logs.filter(l => l.kind !== 'יומי' && (l.eff || l.belong || l.teach));
    const avg = k => { const v = wk.map(l => l[k]).filter(Boolean); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0; };
    let streak = 0; for (let k = days.length - 1; k >= 0; k--) { if (byDay[days[k]]) break; streak++; }
    const acts = {}; logs.forEach(l => (l.tasks || []).forEach(t => acts[t] = (acts[t] || 0) + 1));
    return { name: i.name, key: i.key, exp: days.length, rep: Object.keys(byDay).length, pres: logs.filter(l => l.present).length, abs: logs.filter(l => !l.present).length,
      acts: logs.reduce((a, l) => a + (l.tasks || []).length, 0), actMap: acts, eff: avg('eff'), belong: avg('belong'), teach: avg('teach'), streak: streak };
  });
}
function kpiRow_(items) { return '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:6px 0 14px"><tr>' + items.map(x => '<td style="width:' + Math.floor(100 / items.length) + '%;padding:0 4px"><div style="background:' + (x[2] || '#F5F2EA') + ';border-radius:12px;padding:12px 6px;text-align:center"><div style="font-size:22px;font-weight:800;color:#0C2A35">' + x[1] + '</div><div style="font-size:12px;color:#6B7B80">' + x[0] + '</div></div></td>').join('') + '</tr></table>'; }
function flagsBox_(S) {
  const F = [];
  S.forEach(x => { if (x.streak >= 2) F.push(esc_(x.name) + ': לא דיווח/ה ' + x.streak + ' ימים ברצף'); if (x.abs >= 2) F.push(esc_(x.name) + ': ' + x.abs + ' ימי היעדרות'); if ([x.eff, x.belong, x.teach].some(v => v && v <= 2.5)) F.push(esc_(x.name) + ': ציון נמוך בסיכום השבועי'); });
  return F.length ? '<div style="background:#FBE5E1;border-radius:12px;padding:12px 14px;margin:6px 0 14px;line-height:1.7"><b style="color:#A3402E">🚩 דורש תשומת לב</b><br>' + F.join('<br>') + '</div>'
    : '<div style="background:#E3F2EC;border-radius:12px;padding:12px 14px;margin:6px 0 14px;color:#187A5C"><b>✓ אין דגלים</b>: כולם מדווחים ואין ציונים נמוכים</div>';
}
function statTable_(S) {
  const td = 'padding:7px 6px;border-bottom:1px solid #EEE9DF;text-align:center;font-size:13px', th = 'padding:7px 6px;background:#0C2A35;color:#F5F2EA;font-size:12px;text-align:center', f = x => x ? x.toFixed(1) : '—';
  return '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border:1px solid #E2DCCF"><tr><th style="' + th + ';text-align:right">סטאז׳ר/ית</th><th style="' + th + '">דיווחים</th><th style="' + th + '">נוכחות</th><th style="' + th + '">פעולות</th><th style="' + th + '">שיפור קליני</th><th style="' + th + '">יחס הצוות</th><th style="' + th + '">העשרת ידע</th></tr>'
    + S.map(x => '<tr><td style="' + td + ';text-align:right;font-weight:700">' + esc_(x.name) + '</td><td style="' + td + '">' + x.rep + '/' + x.exp + '</td><td style="' + td + '">' + x.pres + (x.abs ? ' <span style="color:#A3402E">(' + x.abs + ' לא)</span>' : '') + '</td><td style="' + td + '">' + x.acts + '</td><td style="' + td + '">' + f(x.eff) + '</td><td style="' + td + '">' + f(x.belong) + '</td><td style="' + td + '">' + f(x.teach) + '</td></tr>').join('') + '</table>';
}
const pct_ = (a, b) => b ? Math.round(a / b * 100) + '%' : '—';
function weeklyMgr_(dry) {
  const cfg = autoCfg_(), d = data_(), now = new Date(), month = curMonth_(now);
  const L = d.interns.filter(i => i.month === month && !dutyOnly_(i.track)); // duties-only interns do no daily reports
  const sun = new Date(now); sun.setDate(now.getDate() - now.getDay());
  const days = workDays_(ymd_(sun), ymd_(now)), S = internStats_(d, L, days);
  const exp = S.reduce((a, x) => a + x.exp, 0), rep = S.reduce((a, x) => a + x.rep, 0);
  const html = mailHtml_('סיכום שבועי · יומן הסבב', [
    'השבוע ' + (days.length ? dm_(days[0]) + '–' + dm_(days[days.length - 1]) : '') + ' · ' + esc_(month),
    kpiRow_([['סטאז׳רים', L.length], ['אחוז דיווח', pct_(rep, exp), '#EEF6F2'], ['ימי נוכחות', S.reduce((a, x) => a + x.pres, 0)], ['פעולות', S.reduce((a, x) => a + x.acts, 0)]]),
    flagsBox_(S), L.length ? statTable_(S) : 'אין סטאז׳רים בחודש הזה.'], dashUrl_() ? { label: 'לדשבורד', url: dashUrl_() } : null);
  const to = dry ? owner_() : mgrTo_(cfg.weeklyTo || cfg.digestTo);
  return send_('סיכום שבועי למנהלים', 'weekly|' + ymd_(now), to, (dry ? '[בדיקה] ' : '') + 'סיכום שבועי · יומן הסבב · ' + month, html, dry ? null : sentKeys_(), dry);
}
function monthlyReport_(dry) {
  const cfg = autoCfg_(), d = data_(), now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth() - (dry ? 0 : 1), 1), last = new Date(first.getFullYear(), first.getMonth() + 1, 0);
  const month = curMonth_(new Date(first.getFullYear(), first.getMonth(), 15));
  const L = d.interns.filter(i => i.month === month && !dutyOnly_(i.track)); // duties-only interns do no daily reports
  const days = workDays_(ymd_(first), ymd_(last < now ? last : now)), S = internStats_(d, L, days);
  const exp = S.reduce((a, x) => a + x.exp, 0), rep = S.reduce((a, x) => a + x.rep, 0), pres = S.reduce((a, x) => a + x.pres, 0);
  const avgAll = k => { const v = S.map(x => x[k]).filter(Boolean); return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : '—'; };
  const acts = {}; S.forEach(x => Object.keys(x.actMap).forEach(t => acts[t] = (acts[t] || 0) + x.actMap[t]));
  const lbl = {}; (typeof DL_TASKS !== 'undefined' ? DL_TASKS : []).forEach(t => lbl[t[0]] = t[1]);
  const top = Object.keys(acts).sort((a, b) => acts[b] - acts[a]).slice(0, 6), mx = top.length ? acts[top[0]] : 1;
  const bars = top.length ? '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:4px 0 14px">' + top.map(t => '<tr><td style="width:38%;font-size:13px;padding:4px 0">' + esc_(lbl[t] || t) + '</td><td style="padding:4px 6px"><div style="background:#E9E3D5;border-radius:6px;height:12px"><div style="background:#187A5C;border-radius:6px;height:12px;width:' + Math.max(6, Math.round(acts[t] / mx * 100)) + '%"></div></div></td><td style="width:34px;font-size:13px;font-weight:700;text-align:left">' + acts[t] + '</td></tr>').join('') + '</table>' : '';
  const html = mailHtml_('דוח חודשי · ' + esc_(month), [
    'לפניך תמונת המצב של סבב הסטאז׳רים בחודש ' + esc_(month) + ', כפי שעולה מיומן הסבב.',
    kpiRow_([['סטאז׳רים', L.length], ['אחוז דיווח', pct_(rep, exp), '#EEF6F2'], ['אחוז נוכחות', pct_(pres, rep), '#EEF6F2'], ['פעולות', S.reduce((a, x) => a + x.acts, 0)]]),
    '<b>הסיכום השבועי של הסטאז׳רים (ממוצע 1–5)</b>' + kpiRow_([['שיפור קליני', avgAll('eff'), '#FFF9EE'], ['יחס הצוות', avgAll('belong'), '#FFF9EE'], ['העשרת ידע', avgAll('teach'), '#FFF9EE']]),
    top.length ? '<b>הפעילויות הנפוצות בחודש</b>' + bars : '',
    flagsBox_(S), L.length ? statTable_(S) : 'אין סטאז׳רים בחודש הזה.'].filter(Boolean), dashUrl_() ? { label: 'לדשבורד המלא', url: dashUrl_() } : null);
  const to = dry ? owner_() : mgrTo_(cfg.monthlyTo);
  return send_('דוח חודשי', 'monthly|' + month, to, (dry ? '[בדיקה] ' : '') + 'דוח חודשי · סבב הסטאז׳רים · ' + month, html, dry ? null : sentKeys_(), dry);
}
/* 4 days before the rotation (catches up to the day before if a morning was missed): one clear email to the interns of the active tracks
   (not duties-only and not trauma): the booklet, the "work right" deck, how the weekly plan looks, the daily report and how to reach us */
const DECK_URL = APP_URL + 'academy/work.html';
function preStartHtml_(i, when, st) {
  const f = (i.name || '').split(' ')[0], bk = bookletUrl_(), link = i.preview ? APP_URL : linkFor_(i);
  const num = n => `<td width="40" valign="top" style="padding-top:2px"><div style="width:30px;height:30px;border-radius:15px;background:#0C2A35;color:#E2B66A;text-align:center;font-weight:700;font-size:15px;line-height:30px">${n}</div></td>`;
  const btn = (url, label, gold) => `<a href="${url}" style="display:inline-block;margin-top:10px;background:${gold ? '#B8863B' : '#fff'};color:${gold ? '#fff' : '#187A5C'};border:${gold ? '0' : '2px solid #187A5C'};text-decoration:none;font-weight:700;font-size:14px;padding:${gold ? '10px 22px' : '8px 20px'};border-radius:999px">${label}</a>`;
  const block = (n, title, body) => `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 14px;border:1px solid #E8E1D3;border-radius:14px;background:#FFFFFF"><tr><td style="padding:16px 16px 16px 12px"><table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr>${num(n)}<td valign="top"><div style="font-size:17px;font-weight:700;color:#0C2A35;margin-bottom:4px">${title}</div><div style="font-size:15px;color:#3E5960;line-height:1.6">${body}</div></td></tr></table></td></tr></table>`;
  // a sample week, in the station colors of the dashboard
  const pill = (t, c) => `<span style="display:inline-block;background:${c};color:#fff;border-radius:999px;padding:3px 10px;font-size:13px;font-weight:700;white-space:nowrap">${t}</span>`;
  const wk = [['א׳', pill('אגף צפון', '#1F4E79')], ['ב׳', pill('חדר ניתוח', '#187A5C')], ['ג׳', pill('אגף צפון', '#1F4E79') + ' ' + pill('+ טרום ניתוח', '#8D6E3F')], ['ד׳', pill('מיון', '#A3402E') + ' <span style="font-size:12px;color:#1F4E79;font-weight:700">🌙 תורנות</span>'], ['ה׳', '<span style="color:#6B7B80;font-size:13px;font-weight:700">אחרי תורנות · הביתה</span>']];
  const week = `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:10px;border-collapse:collapse;background:#FBFAF6;border:1px solid #E2DCCF;border-radius:10px">${wk.map((r, k) => `<tr><td width="36" style="padding:7px 10px;${k ? 'border-top:1px solid #EEE9DF;' : ''}font-weight:700;color:#0C2A35;font-size:14px">${r[0]}</td><td style="padding:7px 6px;${k ? 'border-top:1px solid #EEE9DF;' : ''}">${r[1]}</td></tr>`).join('')}</table><div style="font-size:12px;color:#8E9A9D;margin-top:4px">דוגמה בלבד</div>`;
  // the daily report as it looks in the app: one question, a few taps
  const chip = t => `<span style="display:inline-block;background:#EEF6F2;color:#187A5C;border:1px solid #B7D8C9;border-radius:999px;padding:3px 10px;font-size:13px;font-weight:700;margin:2px 0 2px 3px">${t}</span>`;
  const daily = `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:10px;background:#0C2A35;border-radius:14px"><tr><td style="padding:14px 16px;color:#F5F2EA">
    <div style="font-size:13px;color:#E2B66A;font-weight:700;margin-bottom:8px">📝 סיכום היום · 30 שניות</div>
    <div style="font-size:14px;margin-bottom:6px">הייתי היום במחלקה? <span style="display:inline-block;background:#187A5C;color:#fff;border-radius:999px;padding:2px 12px;font-weight:700;font-size:13px">✓ הייתי</span></div>
    <div style="font-size:14px;margin-bottom:4px">מה עשיתי?</div><div>${chip('🩺 ביקור')}${chip('📝 קבלה')}${chip('💉 עירוי')}${chip('🔪 חדר ניתוח')}</div>
    <div style="font-size:13px;color:#C9D6DA;margin-top:8px">ובחמישי: סיכום שבועי קצר, 4 דירוגים</div></td></tr></table>`;
  const why = `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:10px"><tr>${[['📈', 'רואים את ההתקדמות', 'מפת המיומנויות שלכם מתמלאת'], ['🎯', 'מקבלים מה שחסר', 'לא היית בחדר ניתוח? נדאג לזה'], ['🗂️', 'יוצאים עם תיעוד', 'כל מה שעשיתם בסבב, במקום אחד']].map(x => `<td width="33%" valign="top" style="padding:0 0 0 6px"><div style="background:#FFF9EE;border:1px solid #EADFC6;border-radius:10px;padding:10px 8px;text-align:center"><div style="font-size:20px">${x[0]}</div><div style="font-size:13px;font-weight:700;color:#0C2A35;margin-top:2px">${x[1]}</div><div style="font-size:12px;color:#6B7B80;margin-top:2px">${x[2]}</div></div></td>`).join('')}</tr></table>`;
  const contact = [['👥 לשונית ״צוות״', 'כל אחד מהצוות עם חיוג, וואטסאפ ומייל'], ['✉️ הודעה לצוות', 'שאלה או כל דבר שחשוב שנדע, באותה לשונית'], ['🔁 בקשות והחלפות', 'היעדרות או החלפת תורנות, בלשונית ״תורנויות״']].map(x => `<div style="margin-top:6px"><b style="color:#0C2A35">${x[0]}</b> · ${x[1]}</div>`).join('');
  let nn = 0; const nx = () => ++nn, gd = guideUrl_();
  const parts = [
    `<div style="font-size:16px;color:#0C2A35;line-height:1.6">היי ${esc_(f)},<br>הסבב שלך בכירורגיה כללית מתחיל ${when}. נפגשים כאן:</div>`,
    `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:12px 0 16px;background:#FFF9EE;border:2px solid #B8863B;border-radius:14px"><tr><td style="padding:14px 16px;color:#0C2A35;font-size:16px;line-height:1.75"><div>📅 <b>${st.day}</b></div><div>🕖 <b>בשעה ${st.time}</b>, ישיבת הבוקר</div><div>📍 <b>חדר הישיבות של המערך, קומה 4</b></div></td></tr></table><div style="font-size:16px;color:#0C2A35;margin-bottom:14px">כמה דברים קצרים לפני, כדי להגיע מוכנים:</div>`,
    bk ? block(nx(), '📘 ספרון הסטאז׳רים', 'נהלים, תבניות קבלה ומה מצופה מכם. למי שעוד לא קרא, זה הזמן.<br>' + btn(bk, 'לפתיחת הספרון ←')) : '',
    block(nx(), '🩺 עבודה נכונה במערך', 'מצגת קצרה של 10 שקפים: היגיינת ידיים, זיהוי מטופל, בטיחות, SBAR ועבודה עם הצוות. <b>חמש דקות. חובה לקרוא לפני היום הראשון.</b><br>' + btn(DECK_URL, 'לצפייה במצגת ←')),
    block(nx(), '🗓️ התוכנית השבועית', 'בכל שבוע מקבלים שיבוץ: איפה אתם בכל יום. בשבת בערב הוא מגיע אליכם במייל, ותמיד מחכה באפליקציה בלשונית ״תוכנית״. ככה זה נראה:' + week),
    block(nx(), '📝 הדיווח היומי: 30 שניות, בשבילכם', 'בסוף כל יום פותחים את האפליקציה ומסמנים מה עשיתם. כמה לחיצות וזהו.' + daily + why),
    gd ? block(nx(), '📗 המדריך לאפליקציה', 'קצר וברור, עם צילומי מסך: איך מדווחים, איפה רואים את התוכנית והתורנויות, איך פונים אלינו. חמש דקות קריאה.<br>' + btn(gd, 'לפתיחת המדריך ←')) : '',
    block(nx(), '💬 שאלה או בקשה?', 'הכול נמצא באפליקציה:' + contact),
    `<div style="text-align:center;margin:20px 0 6px">${btn(link, 'לאפליקציה האישית שלי', true)}</div><div style="text-align:center;font-size:15px;color:#0C2A35;margin-top:10px">מחכים לך!<br><span style="color:#6B7B80;font-size:13px">צוות המערך הכירורגי</span></div>`
  ].filter(Boolean);
  return `<!doctype html><html dir="rtl" lang="he"><head><meta charset="utf-8"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only"><style>:root{color-scheme:light only;supported-color-schemes:light only}</style></head><body style="margin:0;padding:0;background:#FFFFFF"><div dir="rtl" style="background:#FFFFFF;padding:12px 0;font-family:Arial,Helvetica,sans-serif"><div style="max-width:600px;margin:0 auto;background:#FFFFFF">
  <div style="background:#0C2A35;line-height:0;font-size:0;border-radius:16px 16px 0 0;overflow:hidden"><img src="cid:kbanner" width="600" alt="Surgery X · המערך הכירורגי, המרכז הרפואי אופק" style="display:block;width:100%;max-width:600px;height:auto;border:0"></div>
  <div style="background:#0C2A35;color:#F5F2EA;padding:16px 22px 18px;border-radius:0 0 16px 16px"><div style="font-size:13px;color:#E2B66A;font-weight:700">${esc_(i.month)}</div><div style="font-size:22px;font-weight:700;margin-top:2px">${when === 'מחר' ? 'מחר' : 'עוד ' + when.replace('בעוד ', '')} מתחיל הסבב בכירורגיה כללית</div></div>
  <div style="padding:18px 14px 8px">${parts.join('')}</div>
  <div style="padding:10px 22px 14px;color:#8E9A9D;font-size:12px;text-align:center">Surgery X · הודעה אוטומטית · הקישור לאפליקציה אישי, אל תעבירו אותו הלאה</div></div></div></body></html>`;
}
function preStart_(d, now, sent, dry, to) {
  const start = new Date(now.getFullYear(), now.getMonth() + 1, 1), today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const daysTo = Math.round((start - today) / 864e5), out = [];
  if (!dry && (daysTo < 1 || daysTo > 4)) return out;
  const month = curMonth_(new Date(start.getFullYear(), start.getMonth(), 15));
  let L = d.interns.filter(i => i.month === month && i.email && !dutyOnly_(i.track));
  if (dry) L = [L[0] || d.interns[0]].filter(Boolean).map(i => Object.assign({}, i, { email: to || owner_() }, to ? { name: 'איתן', preview: 1 } : {}));
  const n = dry ? 4 : daysTo, when = n === 1 ? 'מחר' : 'בעוד ' + n + ' ימים';
  const st = { day: 'יום ' + HD[start.getDay()] + ', ' + start.getDate() + '.' + (start.getMonth() + 1) + '.' + String(start.getFullYear()).slice(2), time: start.getDay() === 0 ? '7:15' : '7:00' };
  L.forEach(i => {
    if (send_('לפני הסבב', 'pre|' + i.key, i.email, (dry ? '[בדיקה] ' : '') + (n === 1 ? 'מחר' : 'עוד ' + n + ' ימים') + ' מתחיל הסבב בכירורגיה כללית · כמה דברים לפני', preStartHtml_(i, when, st), sent, dry)) out.push('לפני הסבב: ' + i.name);
  });
  return out;
}
// editor only: the pre-rotation email as a test to the owner's own inbox
function devPreMailTest() { if (!isOwnerSession_()) return; return preStart_(data_(), new Date(), null, true, 'owner@surgeryx.example'); }
function schedWeek_(dry) {
  const cfg = autoCfg_(), d = data_(), now = new Date(), out = [];
  const sun = new Date(now); sun.setDate(now.getDate() + (7 - now.getDay()) % 7 || (dry ? 0 : 7));
  if (dry) sun.setDate(now.getDate() - now.getDay() + (now.getDay() >= 5 ? 7 : 0));
  const from = ymd_(sun), days = workDays_(from, ymd_(new Date(sun.getFullYear(), sun.getMonth(), sun.getDate() + 4)));
  const st = weekState_()[from] || {};
  if (!dry && !st.pub) { send_('תזכורת פרסום שיבוץ', 'nopub|' + from, owner_(), 'השיבוץ לשבוע הבא עוד לא פורסם', mailHtml_('השיבוץ לשבוע הבא עוד לא פורסם', ['השבוע מתחיל מחר והשיבוץ השבועי עדיין לא פורסם לסטאז׳רים.', 'אפשר לפרסם מהדשבורד, במסך ״שיבוץ שבועי״, בכפתור ״📣 פרסום לסטאז׳רים״.'], dashUrl_() ? { label: 'לשיבוץ השבועי', url: dashUrl_() } : null), sentKeys_()); out.push('השיבוץ לא פורסם: נשלחה תזכורת אליך'); return out; }
  const ST = {}; stations_().forEach(x => ST[x.id] = x);
  const set = new Set(days), A = assigns_().filter(a => set.has(a.date)), X = absences_().filter(a => set.has(a.date));
  let L = d.interns.filter(i => A.some(a => a.key === i.key) && i.email && !dutyOnly_(i.track));
  if (dry) L = [L[0] || d.interns[0]].filter(Boolean).map(i => Object.assign({}, i, { email: owner_() }));
  const sent = dry ? null : sentKeys_();
  L.forEach(i => {
    const f = (i.name || '').split(' ')[0];
    const rows = days.map(dt => { const aa = A.filter(x => x.key === i.key && x.date === dt).map(x => ST[x.station]).filter(Boolean).sort((p, q) => (p.addon ? 1 : 0) - (q.addon ? 1 : 0)), ab = X.find(x => x.key === i.key && x.date === dt);
      const cell = ab ? '<span style="color:#A3402E;font-weight:700">' + esc_(ab.reason) + '</span>' : aa.length ? aa.map(s => '<span style="display:inline-block;background:' + s.color + ';color:#fff;border-radius:999px;padding:3px 12px;font-weight:700;margin:2px 0 2px 4px">' + (s.addon ? '+ ' : '') + esc_(s.name) + '</span>').join('') : '<span style="color:#9AA5A8">—</span>';
      return '<tr><td style="padding:8px 6px;border-bottom:1px solid #EEE9DF;font-weight:700;white-space:nowrap">יום ' + HD[new Date(dt + 'T12:00:00').getDay()] + ' <span style="color:#6B7B80;font-weight:400">' + dm_(dt) + '</span></td><td style="padding:8px 6px;border-bottom:1px solid #EEE9DF">' + cell + '</td></tr>'; }).join('');
    const html = mailHtml_('השיבוץ שלך לשבוע הקרוב', ['היי ' + esc_(f) + ',', 'זה השיבוץ שלך לשבוע שמתחיל ' + (dry ? 'ב-' : 'מחר, ') + dm_(from) + ':',
      '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #E2DCCF;border-radius:10px;border-collapse:collapse">' + rows + '</table>', 'שבוע טוב!'], { label: 'לאפליקציה האישית שלי', url: linkFor_(i) });
    if (send_('שיבוץ שבועי אישי', 'sched|' + from + '|' + i.key, i.email, (dry ? '[בדיקה] ' : '') + 'השיבוץ שלך לשבוע ' + dm_(from), html, sent, dry)) out.push('שיבוץ: ' + i.name);
  });
  return out;
}
/* runs every evening at 19:00: Thursday weekly summary for managers, Saturday night personal weekly schedule */
function eveningAutomation() {
  const cfg = autoCfg_(), u = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'u'), out = [];
  try { if (cfg.weekly && u === '4') out.push(weeklyMgr_(false) ? 'סיכום שבועי נשלח' : 'סיכום שבועי לא נשלח'); } catch (e) { out.push('סיכום שבועי: ' + e.message); }
  try { if (cfg.schedWeek && u === '6') schedWeek_(false).forEach(x => out.push(x)); } catch (e) { out.push('שיבוץ שבועי: ' + e.message); }
  Logger.log(out.join(' | ') || 'אין משימות הערב');
  return out;
}

/* ================= requests from interns: call-shift swap and absence ================= */
const RQH = ['מזהה', 'סוג', 'סטטוס', 'מזהה סטאז׳ר', 'שם', 'חודש', 'פרטים', 'נשלח', 'טופל ע״י', 'טופל', 'הערה'];
const RQ_REASONS = ['חופש', 'מחלה', 'כנס / קורס', 'מילואים', 'אחר'];
function rqSheet_() { return textSheet_('בקשות', RQH); }
function requests_() {
  return rowsOf_(rqSheet_(), RQH.length).filter(r => r[0]).map(r => { let p = {}; try { p = JSON.parse(r[6] || '{}'); } catch (e) {}
    return { id: String(r[0]), type: r[1], status: r[2], key: r[3], name: r[4], month: r[5], p: p, at: r[7], by: r[8], doneAt: r[9], note: r[10] }; });
}
function pubRq_(r) { return { id: r.id, type: r.type, status: r.status, p: r.p, at: r.at, note: r.note }; }
function rqText_(type, p) {
  const f = s => String(s || '').split('-').reverse().slice(0, 2).join('/');
  if (type === 'החלפת תורנות') return p.withDate ? 'החלפת תורנות: ' + f(p.date) + ' ↔ ' + f(p.withDate) + ' עם ' + esc_(p.withName) : 'מסירת התורנות ב-' + f(p.date) + ' אל ' + esc_(p.withName);
  const when = p.dates && p.dates.length ? p.dates.map(f).join(', ') : f(p.from) + (p.to && p.to !== p.from ? '–' + f(p.to) : '');
  return (type === 'אילוץ תורנות' ? 'בלי תורנות' : 'היעדרות') + ' (' + esc_(p.reason) + '): ' + when;
}
function wa_request(token, req) {
  const key = keyFrom_(token), d = data_(), i = d.interns.filter(x => x.key === key)[0]; bump_();
  if (!i) throw new Error('הקישור האישי לא תקין');
  const ok = s => /^\d{4}-\d{2}-\d{2}$/.test(s || '');
  let type, p;
  if (req && req.type === 'swap') {
    const D = duties_().filter(x => x.month === i.month);
    const mine = D.filter(x => x.key === key && x.date === req.date)[0];
    if (!mine) throw new Error('לא נמצאה תורנות שלך בתאריך הזה');
    const mate = d.interns.filter(x => x.month === i.month && x.name === req.withName && x.key !== key)[0];
    if (!mate) throw new Error('לא נמצא/ה הסטאז׳ר/ית שבחרת');
    let back = '';
    if (req.withDate) { const t = D.filter(x => x.key === mate.key && x.date === req.withDate)[0]; if (!t) throw new Error('לא נמצאה תורנות של ' + mate.name + ' בתאריך שבחרת'); back = t.date; }
    type = 'החלפת תורנות'; p = { date: mine.date, withKey: mate.key, withName: mate.name, withDate: back, note: String(req.note || '').slice(0, 300) };
  } else if (req && req.type === 'abs') {
    if (!ok(req.from)) throw new Error('תאריך לא תקין');
    const to = ok(req.to) && req.to >= req.from ? req.to : req.from;
    type = 'בקשת היעדרות'; p = { from: req.from, to: to, reason: RQ_REASONS.indexOf(req.reason) >= 0 ? req.reason : 'אחר', note: String(req.note || '').slice(0, 300) };
  } else throw new Error('בקשה לא מוכרת');
  const id = 'r' + Date.now().toString(36);
  rqSheet_().appendRow([id, type, 'ממתינה', key, i.name, i.month, JSON.stringify(p), nowStr_(), '', '', '']);
  opsEvent_('📨 ' + type, i.name);
  try { const u = dashUrl_(); send_('בקשה חדשה', 'rq|' + id, owner_(), '📨 ' + type + ' · ' + i.name, mailHtml_('📨 ' + type, [esc_(i.name) + ' שלח/ה בקשה מהאפליקציה:', '<b>' + rqText_(type, p) + '</b>', p.note ? 'הערה: ' + esc_(p.note) : '', 'אפשר לאשר או לדחות בלחיצה אחת, בדשבורד במסך ״📨 בקשות״.'].filter(Boolean), u ? { label: 'לטיפול בבקשה', url: u } : null), sentKeys_()); } catch (e) {}
  return { requests: requests_().filter(r => r.key === key).map(pubRq_) };
}
/* ================= requests found in free text (form notes and app messages) ================= */
/* dates in Hebrew free text, limited to the rotation month: 5/11, 5-7/11, 5.11, "5 בנובמבר", and phrases such as
   "ביומיים הראשונים", "ביום האחרון", "בשבוע הראשון" (working days Sunday–Thursday of the rotation) */
function textDates_(text, month) {
  const p = String(month || '').split(' '), mi = HM.indexOf(p[0]), y = Number(p[1]); if (mi < 0 || !y) return [];
  const last = new Date(y, mi + 1, 0).getDate(), out = {}, iso = d => y + '-' + String(mi + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
  const put = (a, b, m) => { if (m !== mi) return; a = Number(a); b = Number(b || a); if (b < a) { const t = a; a = b; b = t; } for (let d = Math.max(1, a); d <= Math.min(last, b, a + 20); d++) out[iso(d)] = 1; };
  let t = String(text || '');
  t = t.replace(/(\d{1,2})\s{0,2}[./]\s{0,2}(\d{1,2})\s{0,2}[-–]\s{0,2}(\d{1,2})\s{0,2}[./]\s{0,2}(\d{1,2})/g, (s, a, m1, b, m2) => { if (m1 === m2) put(a, b, Number(m1) - 1); else { put(a, 31, Number(m1) - 1); put(1, b, Number(m2) - 1); } return ' '; })
    .replace(/(\d{1,2})\s{0,2}[-–]\s{0,2}(\d{1,2})\s{0,2}[./]\s{0,2}(\d{1,2})/g, (s, a, b, m) => { put(a, b, Number(m) - 1); return ' '; })
    .replace(/(\d{1,2})\s{0,2}[./]\s{0,2}(\d{1,2})(?:\s{0,2}[./]\s{0,2}\d{2,4})?/g, (s, a, m) => { put(a, a, Number(m) - 1); return ' '; })
    .replace(new RegExp('(\\d{1,2})(?:\\s{0,2}[-–]\\s{0,2}(\\d{1,2}))?\\s{0,2}(?:ב-|ב|ל)?\\s{0,1}(' + HM.join('|') + ')', 'g'), (s, a, b, mn) => { put(a, b || a, HM.indexOf(mn)); return ' '; });
  const work = []; for (let d = 1; d <= last; d++) if (new Date(y, mi, d).getDay() <= 4) work.push(d);
  const N = { 'יום': 1, 'יומיים': 2, 'שני': 2, 'שלושה': 3, 'שלושת': 3, 'ארבעה': 4, 'ארבעת': 4, 'חמישה': 5, 'חמשת': 5 };
  t.replace(/(יומיים|יום|(\d|שני|שלושה|שלושת|ארבעה|ארבעת|חמישה|חמשת)\s{0,2}ה?ימים)\s{0,2}ה?(ראשונים|ראשון|אחרונים|אחרון)/g, (s, all, n) => {
    if (all === 'יום' && !/ה(ראשון|אחרון)/.test(s)) return s; // "יום ראשון" is Sunday, "היום הראשון" is the first day
    const k = all === 'יומיים' ? 2 : all === 'יום' ? 1 : (Number(n) || N[n] || 1), first = /ראשו/.test(s);
    (first ? work.slice(0, k) : work.slice(-k)).forEach(d => out[iso(d)] = 1); return ' '; });
  t.replace(/שבוע\s{0,2}ה?(ראשון|אחרון)/g, (s, w) => { const wk = []; if (w === 'ראשון') { for (const d of work) { if (wk.length && new Date(y, mi, d).getDay() === 0) break; wk.push(d); } } else { for (let k = work.length - 1; k >= 0; k--) { if (wk.length && new Date(y, mi, work[k]).getDay() === 4) break; wk.unshift(work[k]); if (new Date(y, mi, work[k]).getDay() === 0) break; } } wk.forEach(d => out[iso(d)] = 1); return ' '; });
  return Object.keys(out).sort();
}
/* is this text asking to be away (absence) or only to be off a duty night (constraint)? null = just a note */
function textReqKind_(text) {
  const t = String(text || '');
  if (/להיעדר|היעדר|נעדר|חופש|לא אגיע|לא אוכל להגיע|לא יכול(?:ה)? להגיע|לא אהיה|לא אוכל להיות (?:ב|פה|נוכח)|מילואים|חתונה|טיסה|בחו["״]ל|כנס|קורס|מבחן|בחינה|אירוע משפחתי|לוויה|שבעה|ניתוח שלי|טיפול רפואי|תור (?:ל|אצל)/.test(t)) return 'abs';
  if (/(לא|בלי|אין|אי אפשר|לא אוכל|לא יכול|לא יכולה|לא מתאים|לא מסתדר|לא מסתדרת)[^.\n]{0,30}תורנ|תורנ[^.\n]{0,30}(לא אוכל|לא יכול|בלי|אי אפשר|לא מתאים|לא מסתדר)/.test(t)) return 'duty';
  return null;
}
const hash_ = s => { let x = 5381; s = String(s || ''); for (let k = 0; k < s.length; k++) x = ((x << 5) + x + s.charCodeAt(k)) | 0; return (x >>> 0).toString(36); };
/* opens a pending request for every free-text source that asks for dates off. Each source is handled once (srcId) */
function syncTextReqs_(d, mail) {
  d = d || data_(); const today = ymd_(new Date()), have = {}, made = [];
  requests_().forEach(r => { if (r.p && r.p.srcId) have[r.p.srcId] = 1; });
  const live = m => { const p = String(m || '').split(' '), mi = HM.indexOf(p[0]), y = Number(p[1]); return mi >= 0 && y && ymd_(new Date(y, mi + 1, 0)) >= today; };
  const src = [];
  d.interns.filter(i => live(i.month)).forEach(i => {
    [['טופס ההרשמה', i.dutyNote], ['טופס ההרשמה', i.absPlan]].forEach(x => { if (String(x[1] || '').trim()) src.push({ i, from: x[0], text: String(x[1]).trim(), id: 'f|' + i.key + '|' + hash_(x[1]) }); });
    (d.feedback || []).filter(f => f.month === i.month && f.name && f.name === i.name).forEach(f => src.push({ i, from: 'הודעה באפליקציה', text: String(f.text || '').trim(), id: 'm|' + i.key + '|' + hash_(f.date + f.text) }));
  });
  const sh = rqSheet_();
  src.forEach(s => {
    if (have[s.id]) return; const kind = textReqKind_(s.text), ds = kind ? textDates_(s.text, s.i.month) : [];
    have[s.id] = 1; if (!kind || !ds.length) return;
    const type = kind === 'abs' ? 'בקשת היעדרות' : 'אילוץ תורנות';
    const p = { from: ds[0], to: ds[ds.length - 1], dates: ds, reason: s.from === 'טופס ההרשמה' ? 'מטופס ההרשמה' : 'מהודעה באפליקציה', note: s.text.slice(0, 300), src: s.from, srcId: s.id, auto: 1 };
    const id = 'r' + Date.now().toString(36) + made.length;
    sh.appendRow([id, type, 'ממתינה', s.i.key, s.i.name, s.i.month, JSON.stringify(p), nowStr_(), '', '', '']); made.push({ id, type, p, name: s.i.name });
  });
  if (made.length) { bump_(); if (mail) made.forEach(m => { try { const u = dashUrl_(); send_('בקשה חדשה', 'rq|' + m.id, owner_(), '📨 ' + m.type + ' (זוהתה אוטומטית) · ' + m.name, mailHtml_('📨 ' + m.type, [esc_(m.name) + ' כתב/ה ב' + (m.p.src === 'טופס ההרשמה' ? 'טופס ההרשמה' : 'הודעה באפליקציה') + ':', '<i>' + esc_(m.p.note) + '</i>', 'זיהיתי בקשה לתאריכים: <b>' + m.p.dates.map(x => x.split('-').reverse().slice(0, 2).join('/')).join(', ') + '</b>', 'אפשר לאשר, לדחות או לתקן את התאריכים בדשבורד במסך ״📨 בקשות״. עד שתחליט/י הימים מסומנים בלוח כ״ממתין״.'], u ? { label: 'לטיפול בבקשה', url: u } : null), sentKeys_()); } catch (e) {} }); }
  return made.length;
}
function applySwap_(month, p, keyA, nameA, who) {
  const sh = textSheet_('תורנויות', DH), vals = sh.getDataRange().getValues(), now = nowStr_();
  const fmt = v => v instanceof Date ? Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd') : String(v);
  // match the exact row of the person giving the duty away, not just the date (dept, er and fm share dates)
  const put = (date, fromKey, key, name) => { for (let k = 1; k < vals.length; k++) if (String(vals[k][0]) === String(month) && fmt(vals[k][1]) === date && String(vals[k][2]) === String(fromKey)) { sh.getRange(k + 1, 3, 1, 2).setValues([[key, name]]); sh.getRange(k + 1, 6, 1, 2).setValues([[who, now]]); return true; } return false; };
  if (!put(p.date, keyA, p.withKey, p.withName)) throw new Error('התורנות המקורית לא נמצאה בלוח');
  if (p.withDate && !put(p.withDate, p.withKey, keyA, nameA)) throw new Error('התורנות של ' + p.withName + ' לא נמצאה בלוח');
}
function reqDays_(p) { if (p.dates && p.dates.length) return p.dates.slice(0, 62); const out = []; for (let x = new Date(p.from + 'T12:00:00'), e = new Date((p.to || p.from) + 'T12:00:00'), n = 0; x <= e && n < 62; x.setDate(x.getDate() + 1), n++) out.push(ymd_(x)); return out; }
function applyBlock_(month, p, key, who) {
  const rows = reqDays_(p).map(dt => [month, key, dt, who]);
  if (rows.length) { const sh = textSheet_('חסימות תורנות', BH); sh.getRange(sh.getLastRow() + 1, 1, rows.length, BH.length).setValues(rows); }
}
function applyAbs_(p, key, name, who) {
  const sh = textSheet_('היעדרויות', XH), now = nowStr_(), rows = [];
  reqDays_(p).forEach(dt => rows.push([dt, key, name, String(p.reason || '').slice(0, 30), who, now]));
  if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, XH.length).setValues(rows);
}
function wa_decideRequest(code, id, approve, note, edit) {
  const w = needEdit_(code);
  if (w.role === 'director') throw new Error('אין הרשאה לאשר בקשות');
  const sh = rqSheet_(), vals = sh.getDataRange().getValues();
  let row = -1; for (let k = 1; k < vals.length; k++) if (String(vals[k][0]) === String(id)) { row = k; break; }
  if (row < 0) throw new Error('הבקשה לא נמצאה');
  if (String(vals[row][2]) !== 'ממתינה') throw new Error('הבקשה כבר טופלה');
  const r = vals[row]; let p = {}; try { p = JSON.parse(r[6] || '{}'); } catch (e) {}
  // the manager may correct the dates before deciding (free text is not always parsed right)
  const okd = s => /^\d{4}-\d{2}-\d{2}$/.test(s || '');
  if (edit && r[1] !== 'החלפת תורנות' && okd(edit.from)) { p.from = edit.from; p.to = okd(edit.to) && edit.to >= edit.from ? edit.to : edit.from; delete p.dates; sh.getRange(row + 1, 7).setValue(JSON.stringify(p)); }
  if (approve) { if (r[1] === 'החלפת תורנות') applySwap_(String(r[5]), p, String(r[3]), String(r[4]), w.name); else if (r[1] === 'אילוץ תורנות') applyBlock_(String(r[5]), p, String(r[3]), w.name); else applyAbs_(p, String(r[3]), String(r[4]), w.name); }
  sh.getRange(row + 1, 3).setValue(approve ? 'אושרה' : 'נדחתה');
  sh.getRange(row + 1, 9, 1, 3).setValues([[w.name, nowStr_(), String(note || '').slice(0, 300)]]);
  try { const it = data_().interns.filter(x => x.key === String(r[3]))[0]; if (it && it.email) send_('תשובה לבקשה', 'rqd|' + id, it.email, (approve ? '✓ הבקשה שלך אושרה' : 'הבקשה שלך לא אושרה') + ' · ' + r[1],
    mailHtml_(approve ? 'הבקשה אושרה ✓' : 'הבקשה לא אושרה', ['היי ' + esc_(String(it.name || '').split(' ')[0]) + ',', '<b>' + rqText_(String(r[1]), p) + '</b>', p.auto ? 'זה לגבי מה שכתבת ב' + (p.src === 'טופס ההרשמה' ? 'טופס ההרשמה' : 'הודעה באפליקציה') + '. ' + (approve ? 'הבקשה אושרה.' : 'הבקשה לא אושרה.') : approve ? 'הבקשה אושרה והשינוי כבר מופיע באפליקציה.' : 'הבקשה לא אושרה.', note ? 'הערה: ' + esc_(note) : ''].filter(Boolean), { label: 'לאפליקציה', url: linkFor_(it) }), sentKeys_()); } catch (e) {}
  bump_();
  return { requests: requests_(), duties: duties_(), fmorn: fmorn_(), absences: absences_(), dutyBlocks: dutyBlocks_() };
}

/* ================= end-of-rotation feedback on the portal itself ================= */
const PFH = ['נשלח', 'מפתח', 'שם', 'חודש', 'קל לשימוש', 'מידע ברור', 'עזר להתמצא', 'חסך זמן', 'לו״ז ושיבוץ', 'תורנויות', 'יומן הסבב', 'הודעות', 'אקדמיה וסמינרים', 'ספרון', 'בקשות', 'המלצה להמשיך', 'מה הכי עזר', 'מה לשפר'];
const PF_AREAS = ['sched', 'duty', 'log', 'msg', 'acad', 'book', 'req'];
const PF_REC = ['כן, בהחלט', 'כנראה שכן', 'לא בטוח/ה', 'לא'];
function pfSheet_() { return textSheet_('משוב על הפורטל', PFH); }
function portalFb_() {
  return rowsOf_(pfSheet_(), PFH.length).filter(r => r[1]).map(r => { const areas = {}; PF_AREAS.forEach((k, j) => areas[k] = +r[8 + j] || 0);
    return { at: r[0], key: r[1], name: r[2], month: r[3], ease: +r[4] || 0, clear: +r[5] || 0, orient: +r[6] || 0, time: +r[7] || 0, areas: areas, rec: r[15], best: r[16], improve: r[17] }; });
}
function wa_portalFb(token, f) {
  const key = keyFrom_(token), i = data_().interns.filter(x => x.key === key)[0]; bump_();
  if (!i) throw new Error('הקישור האישי לא תקין');
  f = f || {}; const n = x => { const v = Math.round(Number(x)); return v >= 1 && v <= 5 ? v : ''; }, a = f.areas || {};
  const row = [nowStr_(), key, i.name, i.month, n(f.ease), n(f.clear), n(f.orient), n(f.time)].concat(PF_AREAS.map(k => n(a[k])))
    .concat([PF_REC.indexOf(f.rec) >= 0 ? f.rec : '', String(f.best || '').slice(0, 1500), String(f.improve || '').slice(0, 1500)]);
  const sh = pfSheet_(), vals = sh.getDataRange().getValues();
  let r = -1; for (let k = 1; k < vals.length; k++) if (String(vals[k][1]) === key) { r = k; break; }
  if (r > 0) sh.getRange(r + 1, 1, 1, PFH.length).setValues([row]); else sh.appendRow(row);
  return { ok: true };
}
// special duty instructions per month, set by the managers: pairs on the same nights, preferred weekdays, exact number of Friday nights
function dutyPrefs_() { try { return JSON.parse(props_().getProperty('DUTY_PREFS') || '{}'); } catch (e) { return {}; } }
function wa_saveDutyPrefs(code, month, p) {
  needEdit_(code); month = String(month || ''); p = p || {};
  const all = dutyPrefs_(), c = { pairs: [], want: {}, fri: {} };
  (p.pairs || []).forEach(x => { if (Array.isArray(x) && x.length === 2 && x[0] && x[1] && x[0] !== x[1]) c.pairs.push([String(x[0]), String(x[1])]); });
  c.pairs = c.pairs.slice(0, 10);
  Object.keys(p.want || {}).slice(0, 40).forEach(k => { const v = [...new Set((p.want[k] || []).map(Number).filter(n => n >= 0 && n <= 6))].sort(); if (v.length) c.want[k] = v; });
  Object.keys(p.fri || {}).slice(0, 40).forEach(k => { const n = Number(p.fri[k]); if (n >= 0 && n <= 3) c.fri[k] = n; });
  if (!c.pairs.length && !Object.keys(c.want).length && !Object.keys(c.fri).length) delete all[month]; else all[month] = c;
  props_().setProperty('DUTY_PREFS', JSON.stringify(all));
  return all;
}



/* ================= app usage: how often each intern opens the app and what they look at (tabs, academy and other links).
   One script property per rotation month (USE|<month>), not the sheet, so a tab view never invalidates the data cache.
   Only the managers see it (wa_boot). The app skips tracking on a manager's device and in the dashboard preview ================= */
function usageOf_(month) { try { return JSON.parse(props_().getProperty('USE|' + month) || '{}'); } catch (e) { return {}; } }
function usageAll_() {
  const out = {};
  try { props_().getKeys().filter(k => k.indexOf('USE|') === 0).forEach(k => { out[k.slice(4)] = usageOf_(k.slice(4)); }); } catch (e) {}
  return out;
}
function wa_track(token, p) {
  let key; try { key = keyFrom_(token); } catch (e) { return false; }
  const month = key.split('|')[1] || ''; if (!month) return false;
  p = p || {};
  const lock = LockService.getScriptLock(); if (!lock.tryLock(5000)) return false;
  try {
    const all = usageOf_(month), u = all[key] || { o: 0, f: '', l: '', d: {}, t: {}, k: {} }, day = todayStr_();
    if (p.open) { u.o++; u.d[day] = (u.d[day] || 0) + 1; }
    Object.keys(p.tabs || {}).slice(0, 12).forEach(t => { if (/^[a-z]{2,10}$/.test(t)) u.t[t] = (u.t[t] || 0) + Math.min(50, Number(p.tabs[t]) || 0); });
    Object.keys(p.links || {}).slice(0, 12).forEach(l => {
      let k = String(l).replace(/\s+/g, ' ').trim().slice(0, 40); if (!k) return;
      if (!(k in u.k) && Object.keys(u.k).length >= 25) k = 'אחר';
      u.k[k] = (u.k[k] || 0) + Math.min(50, Number(p.links[l]) || 0);
    });
    if (!(p.open || Object.keys(p.tabs || {}).length || Object.keys(p.links || {}).length)) return false;
    u.l = nowStr_(); if (!u.f) u.f = u.l;
    const ds = Object.keys(u.d).sort(); if (ds.length > 60) ds.slice(0, ds.length - 60).forEach(x => delete u.d[x]);
    all[key] = u;
    let s = JSON.stringify(all);
    // a property holds about 9KB: trim the longest lists before giving up
    if (s.length > 8800) { Object.keys(all).forEach(k => { const x = all[k], ks = Object.keys(x.k).sort((a, b) => x.k[b] - x.k[a]); ks.slice(8).forEach(z => delete x.k[z]); const dd = Object.keys(x.d).sort(); dd.slice(0, Math.max(0, dd.length - 31)).forEach(z => delete x.d[z]); }); s = JSON.stringify(all); }
    if (s.length > 8800) return false;
    props_().setProperty('USE|' + month, s);
    return true;
  } finally { lock.releaseLock(); }
}

/* ================= publish notices. Publishing stays a separate, explicit step; afterwards the dashboard may ask to mail each intern
   their own part (wa_notifyPub). A mail problem never blocks a publish. The same content is mailed once per intern (key = content hash);
   a changed board or week mails again. DUTY_PUB keeps when each month's board was published, for the "new" badge in the app ================= */
function dutyPub_() { try { return JSON.parse(props_().getProperty('DUTY_PUB') || '{}'); } catch (e) { return {}; } }
// the first publish of a month marks everyone; an update marks only the interns whose nights changed (keys), and only when the editor asked to notify
function markDutyPub_(month, who, keys) {
  const o = dutyPub_(), prev = o[month], now = Date.now();
  o[month] = { at: nowStr_(), ts: now, by: who, first: prev ? (prev.first || prev.ts) : now, keys: prev && keys ? keys.map(String).slice(0, 60) : null };
  const ks = Object.keys(o); if (ks.length > 24) delete o[ks[0]]; props_().setProperty('DUTY_PUB', JSON.stringify(o));
}
// a mark for intern i: the latest one if it was for everyone or for them, otherwise the one before
const pubTsFor_ = (ts, first, keys, key) => keys && keys.indexOf(key) < 0 ? (first || 0) : (ts || 0);
function pubsFor_(i) {
  const ws = weekState_(), weeks = {}, upd = {};
  Object.keys(ws).forEach(f => { const w = ws[f]; if (!w || !w.pubTs) return; weeks[f] = pubTsFor_(w.pubTs, w.pubFirst, w.pubKeys, i.key); if (w.pubFirst && weeks[f] > w.pubFirst) upd[f] = 1; });
  const p = dutyPub_()[i.month] || {}, duty = pubTsFor_(p.ts, p.first, p.keys, i.key);
  return { duty: duty, dutyUpd: !!(p.first && duty > p.first), weeks: weeks, weeksUpd: upd };
}
function wa_notifyPub(code, kind, month, from, opts) {
  needEdit_(code); month = String(month || '');
  if (!sysOk_()) throw new Error('המיילים לא נשלחו: המערכת פורסמה מהחשבון ' + owner_() + ' ולא מ-' + SYSTEM_MAIL + '. צריך לפרסם מחדש מחשבון המערכת');
  opts = opts || {}; const only = opts.keys ? opts.keys.map(String) : null, upd = !!opts.update;
  const d = data_(), sent = sentKeys_(), all = d.interns.filter(i => i.month === month && (!only || only.indexOf(i.key) >= 0));
  const dm = s => s.split('-').reverse().slice(0, 2).join('/'), first = i => esc_(String(i.name || '').split(' ')[0]);
  const hash = s => Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, s)).slice(0, 10);
  const out = { sent: 0, same: 0, failed: 0, noMail: all.filter(i => !i.email).map(i => i.name) };
  const go = (ok, already) => { if (ok) out.sent++; else if (already) out.same++; else out.failed++; };
  if (kind === 'duty') {
    const rows = dutyAll_().filter(x => x.month === month), SL = { dept: 'תורנות מחלקה', er: 'תורנות מיון', fm: 'שישי בוקר 08:00–13:00' };
    const L = all.filter(i => i.email);
    if (MailApp.getRemainingDailyQuota() < L.length) throw new Error('נגמרה מכסת המיילים להיום. אפשר לשלוח מחר');
    L.forEach(i => {
      const mine = rows.filter(x => x.key === i.key).sort((a, b) => a.date.localeCompare(b.date));
      const key = 'pubduty|' + month + '|' + i.key + '|' + hash(mine.map(x => x.date + x.slot).join(','));
      const lines = [`היי ${first(i)},`, upd ? `עדכון בלוח התורנויות של ${esc_(month)}: התורנויות שלך השתנו.` : `לוח התורנויות של ${esc_(month)} פורסם באפליקציה.`,
        mine.length ? (upd ? '<b>התורנויות שלך עכשיו:</b><br>' : '<b>התורנויות שלך:</b><br>') + mine.map(x => `יום ${heDay_(x.date)} ${dm(x.date)} · ${SL[x.slot] || SL.dept}`).join('<br>') : 'בלוח הזה לא שובצת לתורנויות.',
        'את הלוח המלא רואים באפליקציה בלשונית ״תורנויות״. בקשת החלפה שולחים מתוך האפליקציה.'];
      go(send_(upd ? 'עדכון תורנויות' : 'פרסום תורנויות', key, i.email, upd ? `עדכון בלוח התורנויות של ${month} 🌙` : `לוח התורנויות של ${month} פורסם 🌙`, mailHtml_(upd ? 'לוח התורנויות עודכן' : 'לוח התורנויות פורסם', lines, { label: 'לתורנויות שלי', url: linkFor_(i) }), sent), !!sent[key]);
    });
  } else if (kind === 'week') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(from || ''))) throw new Error('שבוע לא תקין');
    const st = stations_(), stName = id => ((st.filter(s => s.id === id)[0] || {}).name || id);
    const days = [0, 1, 2, 3, 4].map(n => { const t = new Date(from + 'T12:00:00Z'); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); });
    const nights = d.duties.filter(x => x.month === month);
    const L = all.filter(i => i.email && !dutyOnly_(i.track));
    if (MailApp.getRemainingDailyQuota() < L.length) throw new Error('נגמרה מכסת המיילים להיום. אפשר לשלוח מחר');
    L.forEach(i => {
      const rows = days.map(dt => {
        const a = d.assigns.filter(x => x.key === i.key && x.date === dt).map(x => stName(x.station)).join(' + ');
        const ab = d.absences.filter(x => x.key === i.key && x.date === dt)[0];
        const night = nights.some(x => x.key === i.key && x.date === dt) ? ' · 🌙 תורנות בלילה' : '';
        const prev = (() => { const t = new Date(dt + 'T12:00:00Z'); t.setUTCDate(t.getUTCDate() - 1); return t.toISOString().slice(0, 10); })();
        const post = !a && !ab && nights.some(x => x.key === i.key && x.date === prev);
        return `יום ${heDay_(dt)} ${dm(dt)} · ${esc_(a || (ab ? ab.reason : post ? 'אחרי תורנות' : 'לא שובצת'))}${night}`;
      });
      const key = 'pubweek|' + from + '|' + i.key + '|' + hash(rows.join('|'));
      const lines = [`היי ${first(i)},`, upd ? `עדכון בשיבוץ לשבוע ${dm(days[0])}–${dm(days[4])}: השיבוץ שלך השתנה.` : `השיבוץ לשבוע ${dm(days[0])}–${dm(days[4])} פורסם באפליקציה.`, '<b>השיבוץ שלך:</b><br>' + rows.join('<br>'), 'את כל הצוות ואת הישיבות רואים באפליקציה בלשונית ״תוכנית״.'];
      go(send_(upd ? 'עדכון שיבוץ' : 'פרסום שיבוץ', key, i.email, upd ? `עדכון בשיבוץ לשבוע ${dm(days[0])} 🗓` : `השיבוץ לשבוע ${dm(days[0])} פורסם 🗓`, mailHtml_(upd ? 'השיבוץ השבועי עודכן' : 'השיבוץ השבועי פורסם', lines, { label: 'לתוכנית שלי', url: linkFor_(i) }), sent), !!sent[key]);
    });
    out.noMail = all.filter(i => !i.email && !dutyOnly_(i.track)).map(i => i.name);
  } else throw new Error('סוג לא מוכר');
  return out;
}

/* ================= "עבודה נכונה במערך": a short deck on the wrapper site (academy/work.html). Interns see it in the learning tab only after an editor publishes it (script property DECK_LIVE) ================= */
function deckLive_() { return props_().getProperty('DECK_LIVE') === '1'; }
function wa_setDeckLive(code, on) { needEdit_(code); if (on) props_().setProperty('DECK_LIVE', '1'); else props_().deleteProperty('DECK_LIVE'); bump_(); return deckLive_(); }

/* ================= talks: mid-rotation, summary and feedback talks, documented by any manager (viewers too). Internal: never sent to the intern app ================= */
const TKH = ['תאריך', 'מפתח', 'שם', 'חודש', 'סוג', 'נכתב ע״י', 'מה עלה בשיחה', 'מה סוכם', 'עודכן', 'מזהה', 'שאלון'];
const TALK_KINDS = ['שיחת אמצע', 'שיחת סיכום', 'שיחת משוב', 'שיחה אחרת'];
// the sheet from before the structured form gets its 11th header (the form answers, JSON)
function talkSheet_() { const sh = textSheet_('שיחות סטאז׳רים', TKH); try { if (sh.getRange(1, TKH.length).getValue() !== 'שאלון') sh.getRange(1, 1, 1, TKH.length).setValues([TKH]); } catch (e) {} return sh; }
function talks_() { return rowsOf_(talkSheet_(), TKH.length).filter(r => r[1] && r[9]).map(r => { let f = null; try { f = r[10] ? JSON.parse(r[10]) : null; } catch (e) {} return { date: r[0], key: r[1], name: r[2], month: r[3], kind: r[4], by: r[5], text: r[6], goals: r[7], at: r[8], id: r[9], form: f }; }); }
// structured answers of a mid/summary talk: short keys, ratings 1 to 5, short texts, a yes/maybe/no
function talkForm_(f) {
  if (!f || typeof f !== 'object') return null; const o = {};
  Object.keys(f).slice(0, 60).forEach(k => { if (!/^[a-z][a-z0-9]{0,9}$/.test(k)) return; const v = f[k];
    if (typeof v === 'number') { if (v >= 1 && v <= 5) o[k] = Math.round(v); }
    else if (['כן', 'אולי', 'לא'].indexOf(v) >= 0) o[k] = v;
    else if (typeof v === 'string' && v.trim()) o[k] = v.trim().slice(0, 1500); });
  return Object.keys(o).length ? o : null;
}
function wa_saveTalk(code, t) {
  const w = need_(code); t = t || {};
  const i = data_().interns.filter(x => x.key === String(t.key))[0];
  if (!i) throw new Error('הסטאז׳ר/ית לא נמצא/ה');
  const kind = TALK_KINDS.indexOf(t.kind) >= 0 ? t.kind : 'שיחה אחרת';
  const date = /^\d{4}-\d{2}-\d{2}$/.test(t.date || '') ? t.date : todayStr_();
  const text = String(t.text || '').trim().slice(0, 4000), form = talkForm_(t.form);
  if (text.length < 2 && !form) throw new Error('נא לכתוב מה עלה בשיחה או למלא את השאלון');
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh = talkSheet_(), n = sh.getLastRow();
    let r = 0, by = w.name;
    if (t.id && n > 1) { const v = sh.getRange(2, 1, n - 1, TKH.length).getDisplayValues(); for (let k = 0; k < v.length; k++) if (v[k][9] === String(t.id)) { r = k + 2; by = v[k][5]; break; } }
    if (r && by !== w.name && !canEdit_(w)) throw new Error('אפשר לערוך רק שיחה שתיעדת');
    const row = [date, i.key, i.name, i.month, kind, by, text, String(t.goals || '').trim().slice(0, 2000), nowStr_(), r ? String(t.id) : 'tk' + Utilities.getUuid().slice(0, 8), form ? JSON.stringify(form) : ''];
    if (r) sh.getRange(r, 1, 1, TKH.length).setValues([row]); else sh.appendRow(row);
  } finally { lock.releaseLock(); }
  bump_();
  return talks_();
}
function wa_deleteTalk(code, id) {
  const w = need_(code);
  const sh = talkSheet_(), n = sh.getLastRow(); if (n < 2) return talks_();
  const v = sh.getRange(2, 1, n - 1, TKH.length).getDisplayValues();
  for (let k = 0; k < v.length; k++) if (v[k][9] === String(id)) { if (v[k][5] !== w.name && !canEdit_(w)) throw new Error('אפשר למחוק רק שיחה שתיעדת'); sh.deleteRow(k + 2); break; }
  bump_();
  return talks_();
}

/* read-only check before opening a real rotation: what exists in the system right now */
function preLaunchCheck() { if (!isOwnerSession_()) return;
  const d = data_(), out = [];
  const byM = {}; d.interns.forEach(i => { (byM[i.month] = byM[i.month] || []).push(i.name + (i.email ? '' : ' (בלי מייל)')); });
  out.push('סטאז׳רים לפי חודש: ' + Object.keys(byM).map(m => m + ' → ' + byM[m].join(', ')).join(' | '));
  out.push('חודשים בהגדרות: ' + (d.months || []).join(', '));
  out.push('מנהלים: ' + admins_().map(a => a.name + ' (' + a.role + ')').join(', '));
  const st = d.settings || {}; out.push('קבוצות וואטסאפ: ' + Object.keys(st.groups || {}).map(k => k + (st.groups[k] ? ' ✓' : ' ✗')).join(', '));
  try { const f = FormApp.openById(WA.FORM_ID); out.push('טופס: ' + (f.isAcceptingResponses() ? 'פתוח לתשובות' : 'סגור') + ' · ' + f.getItems().length + ' שאלות'); } catch (e) { out.push('טופס: ' + e.message); }
  const c = autoCfg_(); out.push('אוטומציה: ' + Object.keys(c).filter(k => c[k] === true).join(', ') + ' | סיכום שבועי ל: ' + (c.weeklyTo || '—') + ' | דוח חודשי ל: ' + (c.monthlyTo || '—'));
  out.push('טריגרים: ' + ScriptApp.getProjectTriggers().map(t => t.getHandlerFunction()).join(', '));
  out.push('עמדות: ' + stations_().map(x => x.short + (x.addon ? '(נוספת)' : '')).join(', '));
  out.push('בקשות: ' + requests_().length + ' · יומן: ' + (d.daylogs || []).length + ' רשומות · משוב פורטל: ' + portalFb_().length + ' · תורנויות: ' + (d.duties || []).length + ' · שיבוצים: ' + (d.assigns || []).length);
  out.push('ספרון: ' + (bookletUrl_() ? '✓' : '✗') + ' · מדריכים: ' + content_().filter(x => x.type === 'מדריך' && x.link).length);
  out.push('באנר מיילים: ' + (bannerBlob_().getBytes().length > 50000 ? 'חד מה-Drive ✓' : 'גיבוי'));
  Logger.log(out.join('\n'));
}

/* registration form link with the rotation month already selected (used in the WhatsApp invitation) */
function wa_formLink(code, month, track) { const w = need_(code); if (canEdit_(w) && !track) { try { setDutyDatesMonth_(String(month || ''), false); } catch (e) { Logger.log('duty dates: ' + e.message); } } try { return prefill_('', String(month || ''), 'פתיחה', track === 'סלקטיב' ? 'סלקטיב' : '') || WA.FORM_URL; } catch (e) { return WA.FORM_URL; } }

/* call-shift constraints in the registration form: one checklist with the actual dates of the rotation month (instead of date pickers that open on the current month) */
const HMN_S = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
function setDutyDatesMonth_(month, force) {
  const p = String(month || '').split(' '), mi = HMN_S.indexOf(p[0]), y = Number(p[1]);
  if (mi < 0 || !y) return 'bad month';
  const now = new Date(); if (!force && new Date(y, mi + 1, 0) < new Date(now.getFullYear(), now.getMonth(), 1)) return 'past';
  const props = props_(); if (!force && props.getProperty('DUTY_FORM_MONTH') === month) return 'same';
  const DN = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'], labels = [];
  for (let d = new Date(y, mi, 1); d.getMonth() === mi; d.setDate(d.getDate() + 1)) labels.push(DN[d.getDay()] + ' ' + d.getDate() + '/' + (mi + 1));
  const form = FormApp.openById(WA.FORM_ID), items = form.getItems();
  const dated = items.filter(x => /לא אוכל להיות תורן/.test(x.getTitle()));
  items.filter(x => x.getType() === FormApp.ItemType.CHECKBOX && !String(x.getTitle() || '').trim()).forEach(x => form.deleteItem(x));
  const ex = dated.filter(x => x.getType() === FormApp.ItemType.CHECKBOX)[0];
  const at = dated.length ? dated[0].getIndex() : form.getItems().length;
  let cb;
  if (ex) cb = ex.asCheckboxItem(); else { cb = form.addCheckboxItem(); form.moveItem(cb.getIndex(), Math.min(at, form.getItems().length - 1)); }
  cb.setTitle('תאריכים שבהם לא אוכל להיות תורן/ית ב' + p[0]).setHelpText('אפשר לסמן עד 5 תאריכים. אם אין אילוץ, משאירים ריק.').setChoiceValues(labels).setRequired(false);
  try { cb.setValidation(FormApp.createCheckboxValidation().setHelpText('אפשר לסמן עד 5 תאריכים').requireSelectAtMost(5).build()); } catch (e) { Logger.log('validation: ' + e.message); }
  dated.filter(x => x.getType() === FormApp.ItemType.DATE).forEach(x => form.deleteItem(x));
  props.setProperty('DUTY_FORM_MONTH', month);
  return 'set ' + labels.length + ' dates';
}

/* permissions: view-only roles (staff viewer, department director) cannot change data */
function canEdit_(w) { return !!w && w.role !== 'viewer' && w.role !== 'director'; }
function needEdit_(code) { const w = need_(code); bump_(); if (!canEdit_(w)) throw new Error('החשבון שלך במצב צפייה בלבד. לשינויים אפשר לפנות לד״ר איתן רז.'); return w; }

/* dev: logs the registration form structure (read-only) */
function devInspectForm() { if (!isOwnerSession_()) return;
  const f = FormApp.openById(WA.FORM_ID);
  const out = f.getItems().map((it, k) => { const t = it.getType(); let ex = '';
    try { if (t === FormApp.ItemType.MULTIPLE_CHOICE) ex = it.asMultipleChoiceItem().getChoices().map(c => c.getValue() + (c.getPageNavigationType() ? '→' + c.getPageNavigationType() : '') + (c.getGotoPage() ? '@' + c.getGotoPage().getIndex() : '')).join(' / ');
      else if (t === FormApp.ItemType.LIST) ex = it.asListItem().getChoices().map(c => c.getValue()).join(' / ');
      else if (t === FormApp.ItemType.PAGE_BREAK) ex = 'NAV ' + it.asPageBreakItem().getPageNavigationType() + (it.asPageBreakItem().getGoToPage() ? '@' + it.asPageBreakItem().getGoToPage().getIndex() : '');
      else if (t === FormApp.ItemType.CHECKBOX) ex = it.asCheckboxItem().getChoices().length + ' choices'; } catch (e) { ex = 'ERR ' + e.message; }
    return k + ' [' + it.getIndex() + '] ' + t + ' | ' + it.getTitle() + (ex ? ' | ' + ex : ''); });
  Logger.log('DEST ' + f.getDestinationType() + ' ' + f.getDestinationId() + ' | collectEmail ' + f.collectsEmail() + ' | items ' + out.length + '\n' + out.join('\n'));
}

/* dev: shows the newest registration rows (read-only) to debug the welcome email */
function devLastResponses() { if (!isOwnerSession_()) return;
  const ss = SpreadsheetApp.getActive(), set = ss.getSheetByName(WA.SETTINGS), sh = ss.getSheetByName(str_(set.getRange('B3').getValue()));
  const v = sh.getDataRange().getDisplayValues(), H = v[0];
  const want = H.map((h, i) => /חותמת|Timestamp|אימייל|Email|שם מלא|חודש הסבב|מסלול/i.test(h) ? i : -1).filter(i => i >= 0);
  Logger.log('HEADERS: ' + want.map(i => i + ':' + H[i]).join(' | '));
  v.slice(-4).forEach(r => Logger.log(want.map(i => r[i]).join(' | ')));
  Logger.log('AUTO ' + JSON.stringify(autoCfg_()));
  Logger.log('SENT welcome keys: ' + Object.keys(sentKeys_()).filter(k => /^welcome/.test(k)).slice(-6).join(' , '));
}

/* dev: why are response rows in or out of data_ (read-only) */
function devInternsDiag() { if (!isOwnerSession_()) return;
  const ss = SpreadsheetApp.getActive(), set = ss.getSheetByName(WA.SETTINGS), sh = ss.getSheetByName(str_(set.getRange('B3').getValue()));
  const v = sh.getDataRange().getValues(), H = v[0].map(str_), OV = overrides_();
  Logger.log('rows: ' + (v.length - 1) + ' | start cols: ' + JSON.stringify(skillCols_(H, 'start')) + ' | headers with skills: ' + H.filter(h => WA.SKILLS.some(s => h.indexOf(s) >= 0)).join(' / '));
  const ei = H.findIndex(h => /^כתובת אימייל$|^Email Address$/i.test(h)), mi = H.findIndex(h => /חודש הסבב/.test(h)), ti = H.findIndex(h => /מסלול/.test(h)), ai = H.findIndex(h => /ליצירת קשר/.test(h));
  v.slice(1).forEach((r, k) => { const em = (str_(r[ei]) || (ai >= 0 ? str_(r[ai]) : '')).toLowerCase(), key = em + '|' + str_(r[mi]), o = OV[key];
    Logger.log((k + 2) + ': ' + em + ' | ' + str_(r[mi]) + ' | ' + (ti >= 0 ? str_(r[ti]) : '') + ' | start=' + JSON.stringify(pick_(r, skillCols_(H, 'start'))) + (o ? ' | override: deleted=' + !!o.deleted + ' manual=' + !!o.manual : '')); });
  const d = data_(); Logger.log('data_ interns: ' + d.interns.map(i => i.name + ' (' + i.month + ', ' + (i.track || 'רגיל') + ')').join(' | ') + ' | deleted: ' + (d.deletedInterns || []).map(x => x.name).join(', '));
}

/* dev: full saved invitation templates (read-only) */
function devInviteTplFull() { if (!isOwnerSession_()) return; const s = settings_(); Logger.log('=== REGULAR ===\n' + (s.template || '(none, default in use)')); Logger.log('=== SELECTIVE ===\n' + (s.templateSel || '(none, default in use)')); }

/* dev: where does the time go (read-only) */
function devPerf() { if (!isOwnerSession_()) return;
  const out = [], t = (label, f) => { const s = Date.now(); let r; try { r = f(); } catch (e) { r = 'ERR ' + e.message; } out.push(label + ': ' + (Date.now() - s) + 'ms'); return r; };
  const d = t('data_', () => data_());
  ['dayLogs_', 'assigns_', 'absences_', 'content_', 'roster_', 'overrides_', 'requests_', 'stations_', 'settings_', 'duties_', 'fmorn_', 'staffPublic_', 'stageFb_', 'admins_', 'assignsDraft_', 'weekState_', 'dutyBlocks_'].forEach(n => { try { t(n, () => this[n]()); } catch (e) { out.push(n + ': n/a'); } });
  const i = d && d.interns && d.interns[0];
  if (i) { const r = t('wa_intern', () => wa_intern(token_(i.key))); out.push('wa_intern size: ' + JSON.stringify(r).length); }
  const b = t('wa_boot(owner)', () => wa_boot('')); out.push('wa_boot size: ' + JSON.stringify(b).length);
  t('dataVer_', () => dataVer_());
  t('dataCached_ #1', () => dataCached_()); t('dataCached_ #2 (hit)', () => dataCached_());
  if (i) t('wa_intern (cached)', () => wa_intern(token_(i.key)));
  t('wa_boot (cached)', () => wa_boot(''));
  const v1 = dataVer_(); bump_(); const v2 = dataVer_(); out.push('bump changes key: ' + (v1 !== v2));
  const fresh = data_(), cached = dataCached_(); out.push('cached == fresh interns: ' + (JSON.stringify(fresh.interns) === JSON.stringify(cached.interns)));
  Logger.log(out.join('\n'));
}

/* dev: size of each part of the intern payload (read-only) */
function devInternSize() { if (!isOwnerSession_()) return;
  const d = dataCached_(), i = d.interns.filter(x => x.month === 'נובמבר 2026')[0] || d.interns[0];
  const r = wa_intern(token_(i.key)), out = [];
  Object.keys(r).forEach(k => out.push([k, JSON.stringify(r[k] === undefined ? null : r[k]).length]));
  out.sort((a, b) => b[1] - a[1]); Logger.log(out.slice(0, 15).map(x => x[0] + ': ' + x[1]).join('\n'));
  if (r.staff) Logger.log('staff photos: ' + r.staff.map(s => (s.photo || '').length).join(', '));
}

/* one-time (18/10/2026): selective is a regular intern. Its form path is the regular one (extra duties → opening → details),
   and the choice text no longer says "duties only" */

/* an intern whose registration skipped the opening page (selective, before 18/10/2026) completes it inside the app */
function wa_completeIntake(token, f) {
  const key = keyFrom_(token); bump_();
  const i = data_().interns.filter(x => x.key === key)[0]; if (!i) throw new Error('BADLINK');
  f = f || {};
  const start = (f.start || []).slice(0, 6).map(v => { const n = Number(v); return n >= 1 && n <= 5 ? Math.round(n) : null; });
  if (start.length < 6 || start.some(x => !x)) throw new Error('צריך לדרג את כל 6 המיומנויות');
  const data = { start: start, inst: String(f.inst || '').slice(0, 120), expect: String(f.expect || '').slice(0, 2000) };
  if (i.track !== 'אלקטיב') data.extra = !!f.extra;
  const clean = cleanIntern_(data); clean.selfIntake = 1;
  upsertOverride_(key, cur => ({ manual: cur.manual, deleted: cur.deleted, data: Object.assign({}, cur.data || {}, clean) }), 'סטאז׳ר/ית');
  // let the owner know, so the duty board and the weekly plan can move on
  opsEvent_('📝 שאלון פתיחה הושלם', i.name);
  try { send_('שאלון פתיחה הושלם', 'intake|' + key + '|' + Date.now(), owner_(), '📝 ' + i.name + ' השלים/ה את שאלון הפתיחה',
    mailHtml_('📝 שאלון פתיחה הושלם', [esc_(i.name) + (i.track && i.track !== 'רגיל' ? ' (' + esc_(i.track) + ')' : '') + ' מילא/ה עכשיו את שאלון הפתיחה באפליקציה.',
      'תורנויות נוספות: <b>' + (i.track === 'אלקטיב' ? 'לא רלוונטי (אלקטיב)' : data.extra ? 'כן, עד 6' : 'לא, 4') + '</b>', 'הדירוג העצמי והפרטים כבר בתיק האישי בדשבורד.'],
      dashUrl_() ? { label: 'לדשבורד', url: dashUrl_() } : null), null); } catch (e) { Logger.log('intake mail: ' + e.message); }
  return wa_intern(token);
}

/* one-time (18/10/2026): the form gets a 4th track "רק תורנויות". It skips the opening page, asks one question
   (Thursday/Friday preference) and goes straight to the details and duty constraints page */


/* read-only: what the free-text scan would open right now (nothing is written) */
function devTextReqs() { if (!isOwnerSession_()) return;
  const d = data_(), have = {}; requests_().forEach(r => { if (r.p && r.p.srcId) have[r.p.srcId] = r.status; });
  d.interns.forEach(i => [['טופס', i.dutyNote], ['טופס', i.absPlan]].concat((d.feedback || []).filter(f => f.month === i.month && f.name === i.name).map(f => ['הודעה', f.text])).forEach(x => {
    const t = String(x[1] || '').trim(); if (!t) return; const k = textReqKind_(t);
    Logger.log(i.name + ' (' + i.month + ') · ' + x[0] + ' · ' + (k || 'הערה בלבד') + ' · ' + (k ? textDates_(t, i.month).join(',') : '') + ' · «' + t.slice(0, 120) + '»'); }));
}

/* read-only: full check of one rotation before work starts (registrations vs roster, tracks, links, mails, requests) */
function devRotationCheck() { if (!isOwnerSession_()) return;
  const M = 'נובמבר 2026', d = data_(), out = [], sent = sentKeys_(), digits = s => String(s || '').replace(/\D/g, '').replace(/^972/, '0');
  const I = d.interns.filter(i => i.month === M), R = (d.roster || []).filter(r => r.month === M);
  out.push('== סטאז׳רים רשומים: ' + I.length + ' · ברשימת הסבב: ' + R.length);
  I.forEach(i => {
    const mail = Object.keys(sent).some(k => k.indexOf('welcome|' + i.key + '|') === 0), r = R.filter(x => (x.email && x.email === i.email) || (digits(x.phone) && digits(x.phone) === digits(i.phone)))[0];
    let link = 'OK'; try { if (keyFrom_(token_(i.key)) !== i.key) link = 'שבור'; } catch (e) { link = 'שבור: ' + e.message; }
    out.push('• ' + i.name + ' | ' + (i.track || 'רגיל') + (i.extra ? ' +אקסטרה' : '') + (i.thuFri ? ' +חמ/שי' : '') + ' | ' + (i.email || 'אין מייל') + ' | ' + (i.phone || 'אין טלפון') + ' | אגף: ' + (i.wing || '—') + ' | פתיחה: ' + (i.start ? 'יש' : 'אין') + ' | תמונה: ' + (i.photoId ? 'יש' : 'אין') + ' | מייל ברוכים הבאים: ' + (mail ? 'נשלח' : 'לא נמצא') + ' | קישור: ' + link + ' | ברשימה: ' + (r ? 'כן' + (r.track && r.track !== (i.track === 'רגיל' ? '' : i.track) ? ' (מסלול ברשימה: ' + r.track + ')' : '') : 'לא') + (i.manual ? ' | ידני' : '') + (i.dutyNote ? ' | הערה: «' + String(i.dutyNote).slice(0, 80) + '»' : '') + (i.absPlan ? ' | היעדרויות: «' + String(i.absPlan).slice(0, 80) + '»' : ''));
  });
  R.filter(r => !I.some(i => (r.email && r.email === i.email) || (digits(r.phone) && digits(r.phone) === digits(i.phone)))).forEach(r => out.push('⚠ ברשימה ולא נרשם/ה: ' + r.name + ' ' + (r.phone || '') + ' ' + (r.email || '')));
  const seen = {}; I.forEach(i => { const k = String(i.name).trim(); if (seen[k]) out.push('⚠ שם כפול: ' + k); seen[k] = 1; });
  const em = {}; I.forEach(i => { if (i.email && em[i.email]) out.push('⚠ מייל כפול: ' + i.email); em[i.email] = 1; });
  (d.deletedInterns || []).filter(x => String(x.key || '').indexOf(M) >= 0).forEach(x => out.push('מחוק/ה: ' + (x.name || x.key)));
  d.interns.filter(i => i.month !== M).forEach(i => out.push('חודש אחר: ' + i.name + ' · ' + i.month));
  (d.absences || []).filter(a => String(a.date).indexOf('2026-11') === 0).forEach(a => out.push('היעדרות בנובמבר: ' + a.date + ' · ' + a.name + ' · ' + a.reason + ' · ' + a.key));
  requests_().filter(r => r.month === M).forEach(r => out.push('בקשה: ' + r.id + ' · ' + r.name + ' · ' + r.key + ' · ' + r.type + ' · ' + r.status + ' · ' + JSON.stringify(r.p) + ' · ' + r.at));
  const RQ = requests_().filter(r => r.month === M); out.push('== בקשות נובמבר: ' + RQ.length + ' (' + RQ.map(r => r.name + ' · ' + r.type + ' · ' + r.status).join(' | ') + ')');
  out.push('== תורנויות נובמבר: ' + d.duties.filter(x => x.month === M).length + ' · חסימות: ' + (d.dutyBlocks || []).filter(x => x.month === M).length + ' · היעדרויות בנובמבר: ' + (d.absences || []).filter(a => String(a.date).indexOf('2026-11') === 0).length);
  const st = settings_(); out.push('== קבוצת וואטסאפ לנובמבר: ' + ((st.groups || {})[M] ? 'יש' : 'אין') + ' · ספרון: ' + (bookletUrl_() ? 'יש' : 'אין') + ' · נוסח רגיל שמור: ' + (st.template ? 'כן' : 'ברירת מחדל') + ' · נוסח רק תורנויות שמור: ' + (st.templateSel ? 'כן' : 'ברירת מחדל'));
  out.push('== טריגרים: ' + ScriptApp.getProjectTriggers().map(t => t.getHandlerFunction()).join(', ') + ' · אוטומציה: ' + JSON.stringify(autoCfg_()).slice(0, 300));
  out.push('== סריקת טקסט חופשי (מה ייפתח כבקשה):');
  I.forEach(i => [['טופס', i.dutyNote], ['טופס', i.absPlan]].concat((d.feedback || []).filter(f => f.month === M && f.name === i.name).map(f => ['הודעה', f.text])).forEach(x => { const t = String(x[1] || '').trim(); if (!t) return; const k = textReqKind_(t); out.push('  ' + i.name + ' · ' + x[0] + ' · ' + (k || 'הערה בלבד') + (k ? ' · ' + textDates_(t, M).join(',') : '') + ' · «' + t.slice(0, 140) + '»'); }));
  Logger.log(out.join('\n'));
}

/* one-time: opens the requests found in free text right away (same as opening the dashboard), without mail */
function runTextReqSync() { if (!isOwnerSession_()) return; Logger.log('נפתחו ' + syncTextReqs_(null, false) + ' בקשות חדשות'); }
