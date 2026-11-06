/* ORBIT live case · laparoscopic TAPP inguinal hernia repair, with James, an attending who operates with you.
   Clinical map: research/tapp-branching.md (5 cases, 15 decision points, 11 complication branches, refs 151-183).
   All cases are fictional. No patient data. Lines are short and spoken, so they can be recorded. */
(function () {
  'use strict';
  var O = window.ORBIT = window.ORBIT || {};

  Object.assign(O.refs = O.refs || {}, {
    151: { a: 'HerniaSurge Group', y: 2018, j: 'Hernia', t: 'International guidelines for groin hernia management', u: 'https://pubmed.ncbi.nlm.nih.gov/29330835/' },
    153: { a: 'Miserez M', y: 2007, j: 'Hernia', t: 'The European hernia society groin hernia classification: simple and easy to remember', u: 'https://pubmed.ncbi.nlm.nih.gov/17353992/' },
    154: { a: 'Daes J', y: 2017, j: 'Ann Surg', t: 'Critical View of the Myopectineal Orifice', u: 'https://pubmed.ncbi.nlm.nih.gov/27984213/' },
    155: { a: 'Bittner R', y: 2011, j: 'Surg Endosc', t: 'Guidelines for laparoscopic (TAPP) and endoscopic (TEP) treatment of inguinal hernia [International Endohernia Society (IEHS)]', u: 'https://pubmed.ncbi.nlm.nih.gov/21751060/' },
    157: { a: 'Fitzgibbons RJ Jr', y: 2006, j: 'JAMA', t: 'Watchful waiting vs repair of inguinal hernia in minimally symptomatic men: a randomized clinical trial', u: 'https://pubmed.ncbi.nlm.nih.gov/16418463/' },
    158: { a: 'Fitzgibbons RJ Jr', y: 2013, j: 'Ann Surg', t: 'Long-term results of a randomized controlled trial of a nonoperative strategy (watchful waiting) for men with minimally symptomatic inguinal hernias', u: 'https://pubmed.ncbi.nlm.nih.gov/24022443/' },
    159: { a: 'Neumayer L', y: 2004, j: 'N Engl J Med', t: 'Open mesh versus laparoscopic mesh repair of inguinal hernia', u: 'https://pubmed.ncbi.nlm.nih.gov/15107485/' },
    161: { a: 'Eklund A', y: 2006, j: 'Br J Surg', t: 'Short-term results of a randomized clinical trial comparing Lichtenstein open repair with totally extraperitoneal laparoscopic inguinal hernia repair', u: 'https://pubmed.ncbi.nlm.nih.gov/16862612/' },
    162: { a: 'McCormack K', y: 2003, j: 'Cochrane Database Syst Rev', t: 'Laparoscopic techniques versus open techniques for inguinal hernia repair', u: 'https://pubmed.ncbi.nlm.nih.gov/12535413/' },
    163: { a: 'Wake BL', y: 2005, j: 'Cochrane Database Syst Rev', t: 'Transabdominal pre-peritoneal (TAPP) vs totally extraperitoneal (TEP) laparoscopic techniques for inguinal hernia repair', u: 'https://pubmed.ncbi.nlm.nih.gov/15674961/' },
    164: { a: 'Bracale U', y: 2012, j: 'Surg Endosc', t: 'Which is the best laparoscopic approach for inguinal hernia repair: TEP or TAPP? A systematic review of the literature with a network meta-analysis', u: 'https://pubmed.ncbi.nlm.nih.gov/22707113/' },
    165: { a: 'Sajid MS', y: 2012, j: 'Int J Surg', t: 'A meta-analysis examining the use of tacker fixation versus no-fixation of mesh in laparoscopic inguinal hernia repair', u: 'https://pubmed.ncbi.nlm.nih.gov/22449832/' },
    166: { a: 'Totté E', y: 2005, j: 'Eur Surg Res', t: 'Surgical anatomy of the inguinal region: implications during inguinal laparoscopic herniorrhaphy', u: 'https://pubmed.ncbi.nlm.nih.gov/16088185/' },
    167: { a: 'Lowham AS', y: 1997, j: 'Ann Surg', t: 'Mechanisms of hernia recurrence after preperitoneal mesh repair. Traditional and laparoscopic', u: 'https://pubmed.ncbi.nlm.nih.gov/9114802/' },
    168: { a: 'Fränneby U', y: 2006, j: 'Ann Surg', t: 'Risk factors for long-term pain after hernia surgery', u: 'https://pubmed.ncbi.nlm.nih.gov/16858183/' },
    169: { a: 'Alfieri S', y: 2011, j: 'Hernia', t: 'International guidelines for prevention and management of post-operative chronic pain following inguinal hernia surgery', u: 'https://pubmed.ncbi.nlm.nih.gov/21365287/' },
    170: { a: 'Aasvang E', y: 2005, j: 'Br J Anaesth', t: 'Chronic postoperative pain: the case of inguinal herniorrhaphy', u: 'https://pubmed.ncbi.nlm.nih.gov/15531621/' },
    171: { a: 'Sivasankaran MV', y: 2014, j: 'Am J Surg', t: 'Incidence and risk factors for urinary retention following laparoscopic inguinal hernia repair', u: 'https://pubmed.ncbi.nlm.nih.gov/24200291/' },
    172: { a: 'Blair AB', y: 2017, j: 'Hernia', t: 'Postoperative urinary retention after inguinal hernia repair: a single institution experience', u: 'https://pubmed.ncbi.nlm.nih.gov/28871414/' },
    173: { a: 'Prabhu AS', y: 2020, j: 'JAMA Surg', t: 'Robotic Inguinal vs Transabdominal Laparoscopic Inguinal Hernia Repair: The RIVAL Randomized Clinical Trial', u: 'https://pubmed.ncbi.nlm.nih.gov/32186683/' },
    174: { a: 'Sanna B', y: 2018, j: 'Injury', t: 'The prevalence and morphology of the corona mortis (Crown of death): A meta-analysis with implications in abdominal wall and pelvic surgery', u: 'https://pubmed.ncbi.nlm.nih.gov/29241998/' },
    175: { a: 'Koch A', y: 2005, j: 'Br J Surg', t: 'Prospective evaluation of 6895 groin hernia repairs in women', u: 'https://pubmed.ncbi.nlm.nih.gov/16187268/' },
    176: { a: 'Furtado M', y: 2019, j: 'Arq Bras Cir Dig', t: 'Systemization of laparoscopic inguinal hernia repair (TAPP) based on a new anatomical concept: inverted Y and five triangles', u: 'https://pubmed.ncbi.nlm.nih.gov/30758474/' },
    177: { a: 'Claus C', y: 2020, j: 'Surg Endosc', t: 'Ten golden rules for a safe MIS inguinal hernia repair using a new anatomical concept as a guide', u: 'https://pubmed.ncbi.nlm.nih.gov/32076858/' },
    178: { a: 'Claus C', y: 2021, j: 'Arq Bras Cir Dig', t: 'Challenges to the 10 golden rules for a safe minimally invasive surgery (MIS) inguinal hernia repair: can we improve?', u: 'https://pubmed.ncbi.nlm.nih.gov/34669887/' },
    179: { a: 'Owens M', y: 2011, j: 'Surgeon', t: 'A systematic review of laparoscopic port site hernias in gastrointestinal surgery', u: 'https://pubmed.ncbi.nlm.nih.gov/21672662/' },
    180: { a: 'Felix EL', y: 1995, j: 'Surg Endosc', t: 'Laparoscopic repair of recurrent hernias', u: 'https://pubmed.ncbi.nlm.nih.gov/7597580/' },
    181: { a: 'Tzovaras G', y: 2012, j: 'Hernia', t: 'Long-term results after laparoscopic transabdominal preperitoneal (TAPP) inguinal hernia repair under spinal anesthesia', u: 'https://pubmed.ncbi.nlm.nih.gov/22729252/' },
    182: { a: 'Hollinsky C', y: 2008, j: 'Surg Endosc', t: 'Biomechanical properties of lightweight versus heavyweight meshes for laparoscopic inguinal hernia repair and their impact on recurrence rates', u: 'https://pubmed.ncbi.nlm.nih.gov/18443869/' },
    183: { a: 'Berney CR', y: 2021, j: 'Cureus', t: 'Why Spermatic Cord Lipomas Must be Treated as "True" Inguinal Hernias', u: 'https://pubmed.ncbi.nlm.nih.gov/34295591/' }
  });

  /* ---------- helpers ---------- */
  function is(id) { return function (S) { return S.cs.id === id; }; }
  function isnt(id) { return function (S) { return S.cs.id !== id; }; }
  function F(k) { return function (S) { return !!S.f[k]; }; }
  function always() { return true; }
  function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function addTack(name) { return function (S) { return { st: { tacks: (S.st.tacks || []).concat(name) } }; }; }

  var nodes = {

    /* ======== hidden variants: every case looks a bit different each time ======== */
    v1: { roll: [{ p: function (S) { return S.cs.id === 'fem' ? .15 : .35; }, flag: 'lipoma', to: 'v2' }, { p: 1, to: 'v2' }] },
    v2: { roll: [{ p: .49, flag: 'corona', to: 'v3' }, { p: 1, to: 'v3' }] },
    v3: { roll: [{ p: function (S) { return S.cs.id === 'prim' || S.cs.id === 'bilat' ? .25 : 0; }, flag: 'longsac', to: 'v4' }, { p: 1, to: 'v4' }] },
    v4: { roll: [{ p: function (S) { return S.cs.id === 'fem' ? 0 : .15; }, flag: 'adhesions', to: 'hall' }, { p: 1, to: 'hall' }] },
    hall: { when: [{ if: is('bilat'), to: 'hall_bilat' }, { if: is('recur'), to: 'hall_recur' }, { if: is('m3'), to: 'hall_m3' }, { if: is('fem'), to: 'hall_fem' }, { if: always, to: 'hall_prim' }] },

    /* ======== corridor: indication and approach ======== */
    hall_prim: {
      view: 'chart', say: 'Morning. This is Daniel, he’s fifty-two. A bulge on the right that aches by the end of a working day and goes back in on its own. Do we operate, or wait?',
      tip: { res: 'Symptomatic hernia: the guideline recommends repair.', stu: 'A bulge that goes back in by itself is a reducible hernia. It isn’t an emergency yet.', nurse: 'Day surgery. James will ask about anesthesia and voiding before the OR.', senior: 'Ask the resident what happens if we wait. That shows whether they understand informed consent.' },
      opts: [
        { t: 'We operate. He has symptoms', g: 'g', refs: [151], reply: 'Right. Symptomatic hernias get repaired. And it’s what he wants, too.', kw: ['operate', 'repair', 'symptoms'] },
        { t: 'We wait, it’s not urgent', g: 'o', refs: [151, 157], why: 'Symptomatic hernia: the guideline recommends repair. Watchful waiting suits minimal symptoms.', reply: 'He has pain, so we operate. Waiting is for a man with almost no symptoms.', kw: ['wait', 'waiting'] },
        { t: 'Operate fast, before it strangulates', g: 'o', refs: [157], why: 'The risk of incarceration in a man with a reducible hernia is low.', reply: 'Operate, yes. But the risk of incarceration is low. There’s no need to frighten him.', kw: ['fast', 'strangulate', 'strangulates'] }
      ], to: 'ww_q'
    },
    ww_q: {
      view: 'mentor:corridor', for: ['res', 'senior', 'stu'], skip: 'appr_prim',
      say: 'Exam question. If he had no symptoms at all, what would you tell him?',
      refs: [157, 158],
      tip: { res: 'In the randomized trial incarceration was rare, but most of the men who waited had surgery in the end.', stu: 'Watchful waiting is a valid decision, not neglect.', senior: 'Worth asking how many of those who wait end up having surgery. Most residents don’t know.' },
      opts: [
        { t: 'Waiting is safe, and tell him most end up having surgery', g: 'g', refs: [157, 158], reply: 'Exactly. Incarceration is rare, but about two thirds have surgery in the end. That’s informed consent.', kw: ['waiting', 'safe', 'most'] },
        { t: 'Wait, and don’t worry him', g: 'b', refs: [158], why: 'Without explaining that most who wait end up having surgery, this isn’t informed consent.', reply: 'Waiting is fine. But if you didn’t tell him most end up having surgery, he didn’t really choose.', kw: ['worry'] },
        { t: 'Always operate, every hernia', g: 'o', refs: [157], why: 'In a man with minimal symptoms watchful waiting is safe.', reply: 'Plenty of people think that. But in the randomized trial, waiting was safe for a man with almost no symptoms.', kw: ['always'] }
      ], to: 'appr_prim'
    },
    appr_prim: {
      view: 'mentor:corridor', say: 'Right. How do we repair it?',
      tip: { res: 'TAPP or TEP in experienced hands: faster recovery and less chronic pain.', stu: 'TAPP: we enter the abdomen, open the peritoneum and place a mesh behind the wall.', nurse: 'TAPP: laparoscopy tower, thirty-degree scope, one 12 mm port and two 5 mm ports.', senior: 'The learning curve is long. Tell the resident out loud that they’re not doing this alone.' },
      opts: [
        { t: 'TAPP, I operate with you beside me', g: 'g', refs: [151, 161, 162], reply: 'That’s the plan. Less pain and a quicker return to work, with someone experienced in the room.', kw: ['tapp', 'beside'] },
        { t: 'Lichtenstein, open repair', g: 'g', refs: [151], reply: 'An excellent, well-proven choice, especially under local. Today he’s fit for general, so TAPP.', kw: ['lichtenstein', 'open'] },
        { t: 'Robotic', g: 'o', refs: [173], why: 'The RIVAL trial found no clinical benefit for a simple hernia; the operation took longer and cost more.', reply: 'We have a robot, but for a simple hernia it showed no benefit. More time and more money. Laparoscopy.', kw: ['robot', 'robotic'] },
        { t: 'TAPP, on my own', g: 'b', refs: [151, 159], why: 'Early in the learning curve recurrence after laparoscopic repair is higher; supervision is needed.', reply: 'I like the confidence. But early on, recurrences double. Roughly a hundred cases with someone next to you.', kw: ['alone', 'own'] }
      ], to: 'preop'
    },
    hall_bilat: {
      view: 'chart', say: 'This is Mark, he’s sixty-three. A left hernia that bothers him. Enlarged prostate, gets up at night to pass urine. What’s the plan?',
      tip: { res: 'In TAPP the guideline recommends checking the other side.', stu: 'An enlarged prostate raises the risk of urinary retention after surgery.', nurse: 'Maybe a catheter in the OR. And maybe a repair on both sides: make sure it’s on the consent form.', senior: 'Check that the resident thought about consent for the other side before the OR.' },
      opts: [
        { t: 'TAPP, and we look at the right side too', g: 'g', refs: [151], reply: 'Exactly. In TAPP you see both sides for free. Sometimes there’s a surprise.', kw: ['tapp', 'right', 'both'] },
        { t: 'Lichtenstein on the left', g: 'o', refs: [151], why: 'With an open approach you can’t see the other side.', reply: 'Legitimate. But if there’s one on the right too, we won’t know until he comes back with a bulge.', kw: ['lichtenstein', 'open'] },
        { t: 'TEP', g: 'o', refs: [163, 164], why: 'TEP and TAPP are equivalent; in TAPP it’s easy to check the other side.', reply: 'Equivalent to TAPP. I just like seeing the whole abdomen when there’s doubt about the other side.', kw: ['tep'] }
      ], to: 'preop'
    },
    hall_recur: {
      view: 'chart', say: 'This is Tom, he’s sixty-seven. A recurrent hernia on the right. He had a Lichtenstein six years ago. Which way do we go in this time?',
      tip: { res: 'After an anterior repair go posterior, and after a posterior repair go anterior.', stu: 'A recurrent hernia is R in the European classification.', nurse: 'There may be old mesh in the field. Sharp scissors and suction ready.', senior: 'Let them explain why. Whoever understands virgin tissue understands the whole idea.' },
      opts: [
        { t: 'From behind, TAPP, through virgin tissue', g: 'g', refs: [151, 180], reply: 'Right. After anterior, go posterior. The old mesh stays in front and doesn’t bother us.', kw: ['behind', 'posterior', 'tapp'] },
        { t: 'Lichtenstein again, I know the area', g: 'b', refs: [151], why: 'After an anterior repair the guideline recommends a posterior approach.', reply: 'Back into the scar and the old mesh? That’s where the nerves are stuck in scar. From behind, it’s all clean.', kw: ['lichtenstein', 'again'] },
        { t: 'TEP', g: 'g', refs: [151], reply: 'Also posterior, yes. I prefer TAPP when there are scars. You see everything from inside the abdomen.', kw: ['tep'] }
      ], to: 'preop'
    },
    hall_m3: {
      view: 'chart', say: 'This is Peter, he’s seventy-one. A huge direct hernia that goes down into the scrotum. What’s already worrying you?',
      tip: { res: 'For a large medial hernia the guideline recommends fixing the mesh.', stu: 'Direct is M in the classification. Three means a defect bigger than 3 cm.', nurse: 'A bigger mesh and a tacker available.', senior: 'Ask the resident to think about the seroma now. That’s what the patient will remember.' },
      opts: [
        { t: 'Mesh size, fixation and a seroma afterwards', g: 'g', refs: [151, 182], reply: 'Good. A wide defect needs a big mesh and fixation. And tell him in advance there’ll be fluid there.', kw: ['mesh', 'fixation', 'seroma'] },
        { t: 'Nothing, a hernia is a hernia', g: 'b', refs: [182], why: 'In a large direct defect a light, unfixed mesh bulges into the defect.', reply: 'Not quite. A huge direct defect behaves differently. A light mesh that isn’t fixed falls into it.', kw: ['nothing'] },
        { t: 'Maybe Lichtenstein is better at his age', g: 'o', refs: [151], why: 'Lichtenstein is preferred mainly when general anesthesia isn’t suitable.', reply: 'Good thought, especially if anesthesia is a problem. He’s fit, so TAPP under general.', kw: ['lichtenstein', 'age'] }
      ], to: 'preop'
    },
    hall_fem: {
      view: 'chart', say: 'The emergency department called us. This is Susan, she’s fifty-eight. A painful lump below the inguinal ligament that won’t go back. She’s been vomiting since this morning. What do you think?',
      tip: { res: 'In a woman, always think femoral. It incarcerates and strangulates more often.', stu: 'A femoral hernia comes out below the inguinal ligament, medial to the femoral vein.', nurse: 'Urgent case: open set, mesh and a bowel resection set available.', senior: 'Make sure the resident isn’t tempted to force it back in the emergency department.' },
      opts: [
        { t: 'Incarcerated femoral hernia. To the OR today', g: 'g', refs: [151, 175], reply: 'Exactly. In a woman, always think femoral. It incarcerates and strangulates more than any other hernia.', kw: ['femoral', 'incarcerated', 'today'] },
        { t: 'Force it back and book a clinic visit', g: 'b', refs: [151], why: 'Incarcerated femoral hernia in a vomiting woman: risk of strangulation. Urgent surgery.', reply: 'Force back bowel that may already be in trouble? Then we won’t know what we pushed back. She’s going to the OR.', fx: { strang: 1 }, kw: ['force', 'reduce'] },
        { t: 'CT first, then decide', g: 'o', why: 'Imaging is fine when in doubt, but not at the cost of time when there is vomiting and a hard lump.', reply: 'If you’re in doubt, a CT is fine. But don’t delay. Vomiting and a hard lump are already an answer.', kw: ['ct', 'imaging', 'scan'] }
      ], to: 'fem_appr'
    },
    fem_appr: {
      view: 'mentor:corridor', say: 'Laparoscopic or open?',
      tip: { res: 'Laparoscopy shows you the bowel and every defect, on the other side too.', stu: 'In an unstable patient, choose the fastest and safest route.', nurse: 'Both trays ready. If we convert, nobody waits for you.' },
      opts: [
        { t: 'Laparoscopic. We see the bowel and the defects', g: 'g', refs: [151], reply: 'Good. We’ll see the bowel from inside, and open if we need to.', kw: ['laparoscopic', 'laparoscopy', 'camera'] },
        { t: 'Open, below the ligament', g: 'o', refs: [151], why: 'An open approach is legitimate; laparoscopy also shows the bowel and the other defects.', reply: 'Perfectly legitimate, especially if she’s unstable. She’s stable and we have the experience, so camera.', kw: ['open'] },
        { t: 'Wait until morning', g: 'b', why: 'An incarcerated hernia with vomiting doesn’t wait: every hour raises the risk of dead bowel.', reply: 'I understand, I’m tired too. But her bowel won’t wait for us.', fx: { strang: 1 }, kw: ['wait', 'morning'] }
      ], to: 'preop_fem'
    },

    /* ======== before the incision ======== */
    preop: {
      kind: 'check', view: 'mentor:scrub', say: 'Just before he goes to sleep. What have we already done?', refs: [151], dt: 2,
      tip: { res: 'An empty bladder keeps it out of the space of Retzius.', stu: 'For a planned laparoscopic repair there’s no routine antibiotic prophylaxis.', nurse: 'Ask the patient yourself when he last passed urine. And arms tucked before prepping.', senior: 'A short list, but every item prevents a real complication.' },
      items: [
        { t: 'Voided before coming into the OR', need: 1, miss: 'He didn’t pass urine? A full bladder rises into our field. Toilet first.' },
        { t: 'Arms tucked at his sides', need: 1, miss: 'Arms at his sides. Otherwise I’m standing crooked for the whole case.' },
        { t: 'Side marked on the skin', need: 1, miss: 'The side isn’t marked? We don’t start. An arrow on the skin, and he confirms it.' },
        { t: 'Table that allows Trendelenburg' },
        { t: 'Routine antibiotic prophylaxis', no: 1, miss: 'Routine antibiotics for a laparoscopic repair? The guideline doesn’t recommend it. Not needed.' }
      ],
      ok: 'Good. Empty bladder, side marked, arms tucked. We can start.',
      fx: { g: { bladder: -10, flag: 'voided' }, o: { flag: 'voided' }, b: { bladder: 15 } }, btn: 'That’s what we did', to: 'anaes'
    },
    anaes: {
      view: 'mentor:or', say: 'Anesthesia?', dt: 2,
      tip: { res: 'From age 65, the guideline prefers general over regional anesthesia.', stu: 'In TAPP we inflate the abdomen with gas. That needs general anesthesia and relaxed muscles.', nurse: 'Spinal anesthesia means more urinary retention. Think about a catheter.' },
      opts: [
        { t: 'General', g: 'g', refs: [151], reply: 'General. TAPP needs a relaxed abdomen and gas. And from sixty-five the guideline prefers general.', kw: ['general'] },
        { t: 'Spinal', g: 'o', refs: [181], why: 'In a series of TAPP under spinal anesthesia, a third had symptoms of urinary retention.', fx: { retention: 25, flag: 'spinal' }, reply: 'There are series like that. But in one, a third had trouble passing urine. And gas in the belly while he’s awake is no fun.', kw: ['spinal', 'regional'] },
        { t: 'Local', g: 'b', refs: [151], why: 'TAPP needs general anesthesia; local suits an open repair.', reply: 'Local is for Lichtenstein. With gas in his belly he’ll jump off the table.', kw: ['local'] }
      ], to: 'pre2'
    },
    pre2: { when: [{ if: is('bilat'), to: 'cath' }, { if: always, to: 'n_entry' }] },
    cath: {
      view: 'mentor:or', say: 'Sixty-three, a big prostate, and we may repair both sides. Catheter?', refs: [171, 172],
      tip: { res: 'Age, prostate and a bilateral repair raise the risk of retention.', nurse: 'Catheter ready. If we place one, it comes out at the end of the case.' },
      opts: [
        { t: 'Catheter in the OR, out at the end', g: 'g', refs: [172], fx: { retention: -15, bladder: -15, flag: 'catheter' }, reply: 'Reasonable for him. He’s at risk of retention, and the bladder stays empty the whole case.', kw: ['catheter', 'end'] },
        { t: 'Not needed, he voided', g: 'o', refs: [171], why: 'Age over 60 and an enlarged prostate raise the risk of retention.', reply: 'You can. Just remember that age and prostate raise the risk. We’ll check him afterwards.', kw: ['voided', 'not'] },
        { t: 'Catheter for three days, to be safe', g: 'b', why: 'A prolonged catheter without a reason raises infection and delays discharge (convention).', reply: 'Three days? What for. It’s day surgery. Catheter in the OR, and out at the end.', kw: ['three', 'days'] }
      ], to: 'n_entry'
    },
    preop_fem: {
      kind: 'check', view: 'mentor:scrub', say: 'She’s on her way to the OR. What do we need before she goes to sleep?', dt: 3,
      tip: { res: 'She’s vomiting: a nasogastric tube lowers the risk of aspiration at induction.', nurse: 'Catheter and urine output. Bowel resection set in the room.', senior: 'A normal lactate doesn’t rule out compromised bowel. Don’t let the resident relax over one number.' },
      items: [
        { t: 'Blood count, chemistry and lactate', need: 1, miss: 'Without labs we’re blind. Blood count, chemistry and lactate.' },
        { t: 'IV fluids', need: 1, miss: 'She’s been vomiting since this morning. Fluids before induction.' },
        { t: 'Urinary catheter', need: 1, miss: 'An urgent case, and the bladder is in the pelvis. Catheter.' },
        { t: 'Nasogastric tube' },
        { t: 'Wait for six hours of fasting', no: 1, miss: 'She’s vomiting. We don’t wait for fasting. Nasogastric tube, and in we go.' }
      ],
      ok: 'Good. Fluids, catheter and labs. She’s ready.',
      fx: { g: { flag: 'catheter', bladder: -15 }, o: { flag: 'catheter' }, b: { strang: 1 } }, btn: 'That’s what we did', to: 'n_entry'
    },
    n_entry: {
      kind: 'gear', view: 'tray', for: ['nurse'], skip: 'entry',
      say: 'We’re setting up the table. What do I ask for first, for the open entry at the umbilicus?',
      pool: ['trocar', 'veress', 'scope', 'grasp', 'scis', 'clip'], need: 'trocar', alt: ['scope'],
      ok: 'A twelve millimeter blunt-tip port for open entry. Then the scope.',
      altReply: 'The scope comes right after. Port first.',
      bad: 'No, it’s an open entry. A blunt twelve millimeter port. We’ll save the needle for another abdomen.',
      why: 'With open entry a blunt port goes in under vision (convention).',
      tip: { nurse: 'Thirty-degree scope white-balanced, gas connected, one 12 mm port and two 5 mm ports.' }, to: 'entry'
    },
    entry: { when: [{ if: F('adhesions'), to: 'entry_scar' }, { if: always, to: 'entry_std' }] },
    entry_std: {
      view: 'wall', say: 'We go in at the umbilicus. How?', dt: 5,
      tip: { res: 'Open entry: you see every layer and enter the peritoneum under vision.', stu: 'The umbilicus is the thinnest point of the abdominal wall.', nurse: 'Two small retractors and fascial sutures, so we can close at the end.', senior: 'Let the resident open it themselves. This is the place to learn quiet hands.' },
      opts: [
        { t: 'Open, below the umbilicus, seeing every layer', g: 'g', why: 'Open entry at the umbilicus is an accepted technique (convention).', reply: 'That’s how I like it. Slowly, see the peritoneum and go in. No surprises.', fx: { flag: 'hasson' }, kw: ['open'] },
        { t: 'Veress needle at the umbilicus, then the port', g: 'o', why: 'Closed entry is accepted by many (convention).', reply: 'Also accepted, lots of people do it. Just check the pressure before you push a port in.', kw: ['veress', 'needle'] },
        { t: 'Direct blind port entry', g: 'o', why: 'Direct entry suits someone who does it every day (convention).', reply: 'You can, if you do it every day. You’re not there yet.', kw: ['direct', 'blind'] }
      ], to: 'ports'
    },
    entry_scar: {
      view: 'wall', st: { scars: ['midline'] }, dt: 6,
      say: 'Hold on. He has a lower midline scar from an old operation. How do we get in?',
      tip: { res: 'A scar in the lower abdomen: bowel can be stuck right underneath.', stu: 'Palmer’s point: below the left costal margin, in the midclavicular line.', nurse: 'A long Veress needle for Palmer’s point, and a nasogastric tube before the puncture.' },
      opts: [
        { t: 'Open at the umbilicus, slowly and carefully', g: 'g', why: 'Open entry reduces injury to adherent bowel (convention).', reply: 'Good. Open, slowly, and a finger around before the port.', kw: ['open'] },
        { t: 'Veress needle at Palmer’s point', g: 'g', why: 'Palmer’s point is far from a lower abdominal scar (convention).', reply: 'Nice. Away from the scar. Then the camera, and we see where the adhesions are.', kw: ['palmer'] },
        { t: 'Veress needle at the umbilicus, as always', g: 'b', why: 'Blind entry near a scar raises the risk of injuring adherent bowel (convention).', fx: { bowel: 30 }, reply: 'Okay. With a midline scar the bowel can be stuck right underneath. Let’s hope.', to: 'entry_roll', kw: ['umbilicus', 'always'] }
      ], to: 'ports'
    },
    entry_roll: { roll: [{ p: function (S) { return cl((S.v.bowel || 0) / 100); }, flag: 'bowel_entry', ev: 'Bowel injury at entry', luck: 'You fired a needle in near a scar and the bowel wasn’t hit. Lucky.', to: 'c_bowel_entry' }, { p: 1, to: 'ports' }] },
    c_bowel_entry: {
      view: 'mentor:tense', say: 'Hold on. What’s that green on the screen? That’s bowel. We’re in the bowel.', fx: { flag: 'cx_bowel' }, dt: 15, refs: [163],
      tip: { res: 'Don’t pull the port out: it marks the hole.', nurse: 'Bowel suture and a laparoscopic needle holder. Let the attending in charge know.', senior: 'The resident is under pressure now. Talk slowly and let them take the right step.' },
      opts: [
        { t: 'Leave it in. Identify, repair, and rethink the mesh', g: 'g', refs: [163], fx: { flag: ['bowel_inj', 'contaminated'] }, reply: 'Right. Leave it in so we don’t lose it, add another port and repair it. And the mesh? We think again.', to: 'bowel_mesh', kw: ['identify', 'repair', 'leave'] },
        { t: 'Pull it out and go in somewhere else', g: 'b', why: 'A bowel injury that isn’t repaired shows up as peritonitis after surgery.', fx: { flag: 'bowel_missed' }, reply: 'Then the hole disappears and we don’t know where it is. That’s how you get peritonitis on day two.', kw: ['pull', 'out'] }
      ], to: 'ports'
    },
    bowel_mesh: {
      view: 'mentor:tense', say: 'We’ve repaired it. Now, a synthetic mesh after we’ve opened bowel?',
      tip: { res: 'Mesh in a contaminated field is the attending’s decision.', senior: 'A good moment to talk about what matters more: the patient or the plan.' },
      opts: [
        { t: 'Postpone the hernia repair to another operation', g: 'g', why: 'Convention: a planned hernia can be repaired later, in a clean field.', fx: { flag: 'aborted' }, reply: 'That’s what I would do. A planned hernia can be repaired in a few weeks, in a clean field.', to: 'finish', kw: ['postpone', 'later'] },
        { t: 'Carry on as usual with mesh', g: 'o', why: 'Convention: after a bowel injury, synthetic mesh raises the risk of infection. It’s the attending’s decision.', fx: { infect: 20 }, reply: 'Some carry on after a small injury. It’s an attending’s call. I like it less.', kw: ['carry', 'mesh'] }
      ], to: 'ports'
    },
    ports: {
      kind: 'place', view: 'wall', say: 'Place the ports. Camera at the umbilicus first, then two working ports.', dt: 3,
      ports: 3, sizes: [12, 5, 5], tol: 52,
      layouts: [
        { id: 'umb', he: 'At umbilicus level, on both sides', pts: [{ lm: 'umb' }, { lm: 'umb', dx: -125, dy: 12 }, { lm: 'umb', dx: 125, dy: 12 }] },
        { id: 'low', he: 'Just below the umbilicus', pts: [{ lm: 'umb' }, { lm: 'umb', dx: -112, dy: 48 }, { lm: 'umb', dx: 112, dy: 48 }] }
      ],
      danger: [
        { xy: [300, 606], r: 44, he: 'Above the pubis', say: 'Hold on. Stop. A port above the pubis? That’s the bladder. And from there you can’t reach anything.', why: 'A low midline port risks the bladder and gives no working angle.', fx: { bladder: 15 } },
        { xy: [232, 442], r: 16, he: 'Right epigastric vessels', say: 'Stop. The epigastric vessels run inside the muscle there. Move a little to the side.', why: 'A port through the epigastric vessels in the wall causes port-site bleeding.', fx: { vessel: 10 } },
        { xy: [368, 442], r: 16, he: 'Left epigastric vessels', say: 'Stop. The epigastric vessels run inside the muscle there. Move a little to the side.', why: 'A port through the epigastric vessels in the wall causes port-site bleeding.', fx: { vessel: 10 } }
      ],
      reply: { g: 'Good. Three in one line, camera in the middle. Comfortable for both sides.', o: 'It works, a bit crowded. We’ll manage.', b: 'The instruments will clash. We’ll be fighting with our hands the whole case.' },
      fx: { b: { exposure: -20 } },
      why: 'Ports at umbilicus level on both sides give a working angle to both sides (convention).',
      tip: { res: 'A port low and close to the groin: the instruments clash and you can’t work laterally.', stu: 'Camera in the middle and hands on either side: a triangle.', nurse: '12 mm at the umbilicus, two 5 mm at the sides. The mesh goes in rolled, through the 12.', senior: 'Let the resident place them alone, then ask why. Most mistakes here are ports placed too low.' },
      to: 'stu_cam'
    },
    stu_cam: {
      kind: 'info', view: 'move:camera30', for: ['stu'], skip: 'tri',
      say: 'You’re on the camera. It’s a thirty-degree scope: turn the light cable to look down towards the groin.',
      tip: { stu: 'The horizon stays level. Turn the light cable, not the camera.' }, btn: 'Got it', to: 'tri'
    },
    tri: {
      kind: 'info', view: 'move:triangle', for: ['res', 'senior'], skip: 'survey',
      say: 'A small reminder: the two instruments meet at the target at an angle, with the camera between them. That way you work without fighting.',
      tip: { res: 'If the instruments are parallel, they don’t meet. Aim for sixty to ninety degrees.', senior: 'A resident fighting the instruments has usually placed the ports too close together.' }, btn: 'Let’s go', to: 'survey'
    },

    /* ======== inside: survey ======== */
    survey: {
      view: 'scene', say: 'We’re in. Before you rush to the hernia, what do we do?', st: { labels: false, focus: null, zones: false }, dt: 2, refs: [151],
      tip: { res: 'Survey the abdomen and both internal rings before anything else.', stu: 'An occult hernia on the other side is a common finding at survey.', nurse: 'If there’s a hernia on the other side, we may need another mesh. Check we have one.', senior: 'Ask the resident what they see on the other side before they start.' },
      opts: [
        { t: 'Survey the whole abdomen and both sides', g: 'g', refs: [151], reply: 'Always. In TAPP it’s free. That’s how you find what you weren’t looking for.', to: 'look', kw: ['survey', 'both', 'sides'] },
        { t: 'Straight to the hernia, no time', g: 'b', refs: [151], why: 'In TAPP the guideline recommends checking the other side; occult hernias are found at survey.', fx: { flag: 'skip_survey' }, reply: 'There’s time for one minute. But fine, I can see you’re in a hurry.', to: 'skiplook', kw: ['straight', 'time'] }
      ]
    },
    look: { when: [{ if: is('fem'), to: 'fem_look' }, { if: is('bilat'), to: 'bil_found' }, { if: F('adhesions'), to: 'adh' }, { if: is('recur'), to: 'recur_look' }, { if: always, to: 'lm_intro' }] },
    skiplook: { when: [{ if: is('fem'), to: 'fem_look' }, { if: is('bilat'), to: 'bil_skip' }, { if: F('adhesions'), to: 'adh_blind' }, { if: always, to: 'lm_intro' }] },
    bil_skip: {
      view: 'scene', kind: 'info', say: 'Okay, straight to the left. On the screen it’s the same thing, just mirrored.', st: { defect: 'L', size: 2, focus: 'defect' },
      tip: { res: 'Without a survey you won’t know if there’s a hernia on the other side too.' }, btn: 'Carry on', to: 'lm_intro'
    },
    bil_found: {
      view: 'scene', say: 'Hold on. Look to the right. See the opening at the ring? There’s a hernia on the right too. What do we do?', st: { defect: 'L', size: 1, focus: 'ring' }, refs: [151],
      tip: { res: 'You ask for consent for the other side before surgery, exactly for this moment.', stu: 'A hernia with no symptoms, found only from inside, is called occult.', nurse: 'Another mesh for the other side. Check we have the right size.', senior: 'This is the moment to teach that a good plan includes the surprises.' },
      opts: [
        { t: 'Repair both sides, he consented in advance', g: 'g', refs: [151], fx: { flag: 'both', retention: 10 }, reply: 'Exactly. That’s why we consented him for the other side too. We’ll start on the right, here on the screen, then the left.', kw: ['both', 'sides', 'consented'] },
        { t: 'Just the left, and tell him afterwards', g: 'o', why: 'An unrepaired occult hernia may come back with symptoms and need another operation.', fx: { flag: 'missed_contra' }, reply: 'You can. But he’ll be back with a bulge on the right. We’ll work on the left, it’s the same thing mirrored.', kw: ['left', 'tell'] },
        { t: 'Repair the right even without consent', g: 'b', why: 'Repairing a side that wasn’t consented is an informed consent problem (convention).', fx: { flag: 'missed_contra' }, reply: 'He only signed for the left? Then no. From now on the form says: possibly the other side too. We’ll work on the left.', kw: ['without', 'consent'] }
      ], to: 'lm_intro'
    },
    adh: {
      view: 'scene', say: 'There’s omentum stuck to the wall under the scar. It’s hiding the groin. What do we do?',
      tip: { res: 'Adhesiolysis: sharp, close to the wall, no energy near bowel.', nurse: 'Sharp scissors. The hook stays aside for now.', senior: 'A burn you don’t see is the most dangerous complication here.' },
      opts: [
        { t: 'Sharp with scissors, close to the wall and away from bowel', g: 'g', why: 'Sharp release without energy near bowel (convention).', reply: 'Nice. Sharp, no energy near bowel. The omentum comes down and the field is clear.', to: 'lm_intro', kw: ['scissors', 'sharp'] },
        { t: 'Burn it with the hook, quickly', g: 'b', why: 'Energy near adherent bowel can cause a burn you don’t see (convention).', fx: { bowel: 25 }, reply: 'Energy near bowel is a burn that shows up on day three. Let’s switch to scissors.', to: 'adh_roll', kw: ['hook', 'burn'] },
        { t: 'Go around it and work past it', g: 'o', why: 'Working in half a field makes exposure harder.', fx: { exposure: -15 }, reply: 'You can, but we’ll work the whole case with half a field.', to: 'lm_intro', kw: ['around'] }
      ]
    },
    adh_roll: { roll: [{ p: function (S) { return cl((S.v.bowel || 0) / 100); }, flag: 'burn', ev: 'Bowel burn', luck: 'You used energy near bowel and didn’t touch it. Luck, not technique.', to: 'c_bowel_burn' }, { p: 1, to: 'lm_intro' }] },
    adh_blind: { roll: [{ p: .25, flag: 'burn', ev: 'A bowel burn you didn’t see', to: 'c_bowel_burn' }, { p: 1, to: 'lm_intro' }] },
    c_bowel_burn: {
      view: 'mentor:tense', say: 'Hold on. See the white spot on the bowel? That’s a burn. What do we do?', fx: { flag: 'cx_bowel' }, dt: 8,
      tip: { res: 'A burn left uncovered can perforate two days later.', nurse: 'A suture to oversew the bowel.' },
      opts: [
        { t: 'A stitch to bury the burn, and it goes in the op note', g: 'g', why: 'Burying a burn with a stitch prevents late perforation (convention).', fx: { flag: 'bowel_inj' }, reply: 'Right. A burn you don’t cover can perforate two days later. Stitch it, and write it in the note.', kw: ['stitch', 'bury', 'cover'] },
        { t: 'It’s small, carry on', g: 'b', why: 'An untreated bowel burn can perforate days after surgery.', fx: { flag: 'bowel_missed' }, reply: 'Small today, a perforation the day after tomorrow. I don’t like it.', kw: ['small', 'carry'] }
      ], to: 'lm_intro'
    },
    recur_look: {
      view: 'scene', kind: 'info', say: 'Look. The old mesh is in front, and back here everything is virgin. A direct defect, medial to the vessels.', st: { defect: 'M', size: 2, focus: 'defect' }, refs: [180],
      tip: { res: 'A recurrence after Lichtenstein is usually direct, or at the edge of the mesh.', stu: 'Medial to the epigastric vessels: direct.' }, btn: 'Carry on', to: 'lm_intro'
    },

    /* ======== femoral emergency ======== */
    fem_look: {
      view: 'scene', say: 'There. A loop of small bowel stuck in the femoral ring, below the iliopubic tract. Now what?', st: { defect: 'F', content: 'bowel', incarc: true, focus: 'defect' }, refs: [175],
      tip: { res: 'Incarcerated bowel isn’t pulled hard. Gentle traction and pressure from outside.', stu: 'The femoral ring: below the iliopubic tract and medial to the vein.', nurse: 'Warm swabs and warm irrigation ready to check viability.', senior: 'Now you’ll see whether the resident is patient. Sick bowel doesn’t tolerate strong hands.' },
      opts: [
        { t: 'Gentle traction and light pressure from outside, and if it won’t come, widen the ring', g: 'g', why: 'Incarcerated bowel is freed gently, widening the ring when needed (convention).', reply: 'Nice. We don’t pull hard on sick bowel. Let’s see if it comes, and if not, we widen.', to: 'fem_ring', kw: ['gentle', 'widen'] },
        { t: 'Pull hard until it comes out', g: 'b', why: 'Forceful traction on incarcerated bowel can tear it.', fx: { bowel: 40 }, reply: 'Wait. Gently. This bowel is already suffering. It tears like wet paper.', to: 'fem_pull', kw: ['hard', 'pull'] }
      ]
    },
    fem_pull: { roll: [{ p: .5, flag: 'fem_tear', ev: 'Tear in the incarcerated bowel', luck: 'You pulled hard and the bowel held. Lucky.', to: 'c_bowel_fem' }, { p: 1, to: 'fem_ring' }] },
    fem_ring: {
      view: 'scene', kind: 'tap', say: 'It won’t come. Where do you widen the ring?', hint: 'Tap the side of the femoral ring where you would cut', st: { focus: null, labels: false },
      tip: { res: 'Widen medially, towards the lacunar ligament. The femoral vein sits laterally.', stu: 'At the femoral ring: the vein is lateral, the ligament is medial.', senior: 'This is the only cut in the case where one side is safe and the other is life-threatening.' },
      zones: [
        { xy: [574, 452], r: 28, g: 'g', he: 'Medial to the ring', why: 'Widen medial to the ring, away from the femoral vein (anatomical convention).', reply: 'Right. Medially, towards the lacunar ligament. Nothing there bleeds.', to: 'fem_viab' },
        { xy: [538, 412], r: 24, g: 'o', he: 'Above the ring', why: 'The iliopubic tract runs above the ring; medial is safer (convention).', reply: 'Above is the tract. You can cut a little, but medial is safer.', to: 'fem_viab' },
        { xy: [502, 446], r: 28, g: 'b', he: 'Lateral to the ring', stop: 'Stop. Lateral is the femoral vein. We don’t cut there.', why: 'The femoral vein lies lateral to the femoral ring (anatomical convention).', fxWarn: { vessel: 10 }, fx: { vessel: 40 }, reply: 'You cut laterally. That’s dark blood, and fast.', to: 'b_iliac' }
      ],
      missSay: 'Not there. Look at the ring below the tract, and pick a side.'
    },
    c_bowel_fem: {
      view: 'mentor:tense', say: 'The bowel’s torn. There’s content in the field. Breathe. Now what?', fx: { flag: 'cx_bowel' }, dt: 15,
      tip: { res: 'Control the contamination first, then decide about resection and mesh.', nurse: 'Suction, irrigation, bowel sutures. Call for senior help.' },
      opts: [
        { t: 'Close the tear right away, suction and irrigate, and call for senior help', g: 'g', why: 'Immediate control of contamination (convention).', fx: { flag: ['bowel_inj', 'contaminated', 'help'] }, reply: 'Good. Control the contamination first. Then we decide about resection and mesh.', kw: ['close', 'suction'] },
        { t: 'Carry on and deal with it at the end', g: 'b', why: 'Bowel content spreading in the field raises the risk of mesh and abdominal infection.', fx: { flag: 'contaminated', bowel: 20 }, reply: 'At the end? Bowel content spreads over the whole field with every minute. We close it now.', kw: ['end'] }
      ], to: 'fem_viab'
    },
    fem_viab: {
      view: 'scene', say: 'It’s out. The loop is dark. Viable or not?', st: { content: null, incarc: false, focus: 'defect' }, fx: { flag: 'fem_out' }, refs: [175],
      tip: { res: 'Color, peristalsis and pulsation in the mesentery. And give it a few minutes.', stu: 'Viable bowel turns pink again and contracts when you touch it.', nurse: 'Warm swabs and a clock. James will ask to wait a few minutes.', senior: 'Patience here saves unnecessary resections. Let the resident hold the clock.' },
      opts: [
        { t: 'Warm swabs, wait, and check color, peristalsis and pulsation', g: 'g', refs: [175], why: 'Check viability before deciding on resection (convention).', reply: 'Good. Patience. A lot of dark bowel recovers when you give it time.', to: 'fem_wait', kw: ['warm', 'wait', 'color'] },
        { t: 'Put it back, it’ll sort itself out', g: 'b', why: 'Bowel that was incarcerated has to be checked before it goes back.', reply: 'Without looking? If it’s dead, we’ll find out from the peritonitis.', to: 'fem_back', kw: ['back'] },
        { t: 'Resect right away, to be safe', g: 'o', why: 'Resecting before the bowel has had time to recover may be unnecessary (convention).', reply: 'Maybe too early. An unnecessary resection is a complication too. But let’s see.', to: 'fem_dead', kw: ['resect'] }
      ], dt: 8
    },
    fem_wait: { roll: [{ p: .3, flag: 'nonviable', ev: 'The bowel didn’t recover', to: 'fem_dead' }, { p: 1, to: 'fem_alive' }] },
    fem_back: { roll: [{ p: .4, flag: 'bowel_missed', to: 'lm_intro' }, { p: 1, to: 'lm_intro' }] },
    fem_alive: {
      view: 'scene', kind: 'info', say: 'See? The color is coming back, there’s peristalsis and a pulse. The bowel is viable. Now we repair the hernia as usual.',
      tip: { stu: 'In a woman with a groin hernia, always check the femoral opening.' }, btn: 'Carry on', to: 'lm_intro'
    },
    fem_dead: {
      view: 'scene', say: 'It’s not coming back. Grey, no peristalsis. Now what?', fx: { flag: 'nonviable' }, refs: [175],
      tip: { res: 'In women having emergency surgery, bowel resection is more common.', nurse: 'Bowel resection set and stapler. Maybe a small extraction incision.' },
      opts: [
        { t: 'Resect, anastomose and call for senior help', g: 'g', refs: [175], fx: { flag: ['contaminated', 'help', 'resect'], t: 35 }, reply: 'Right. In women in an emergency it isn’t rare. Now the big question: mesh.', kw: ['resect', 'resection'] },
        { t: 'Put it back and hope', g: 'b', why: 'Dead bowel returned to the abdomen causes peritonitis.', fx: { flag: 'bowel_missed' }, reply: 'No. Dead bowel in the abdomen is peritonitis. We resect.', kw: ['hope'] }
      ], to: 'fem_mesh'
    },
    fem_mesh: {
      view: 'mentor:tense', say: 'We’ve opened bowel. A synthetic mesh in a field like this?',
      tip: { res: 'Mesh in a contaminated field is the attending’s decision. There’s no dedicated, verified source here.', senior: 'Worth talking about the fact that there’s no single answer. What would you do, and why.' },
      opts: [
        { t: 'Close the ring with sutures, no mesh, and the attending decides', g: 'g', why: 'Convention: the mesh decision in a contaminated field is the attending’s; no dedicated source was verified.', fx: { flag: 'nomesh' }, reply: 'I would close the ring with sutures today. Mesh can come later, in a clean field.', to: 'fem_suture', kw: ['sutures', 'suture', 'no'] },
        { t: 'Mesh as usual, like any hernia', g: 'o', why: 'Convention: synthetic mesh in a contaminated field raises the risk of infection.', fx: { infect: 20 }, reply: 'Some do it with mild contamination. I’d be careful. It’s an attending’s call.', to: 'lm_intro', kw: ['mesh', 'usual'] }
      ]
    },
    fem_suture: {
      view: 'scene', kind: 'info', say: 'We close the femoral ring to Cooper’s ligament with a few stitches. No mesh today.', st: { defect: 'none', focus: null }, fx: { t: 15 },
      tip: { nurse: 'Non-absorbable suture and a laparoscopic needle holder.' }, btn: 'Carry on', to: 'finish'
    },

    /* ======== landmarks: the map before the knife ======== */
    lm_intro: {
      view: 'scene', say: 'Before we cut. What are you looking for in the picture?', st: { labels: false, focus: null, zones: false }, refs: [176, 177],
      tip: { res: 'Five landmarks: the epigastric vessels, the vas, the testicular vessels, the medial umbilical ligament and the defect.', stu: 'An inverted Y: the epigastric vessels on top, the vas and the testicular vessels like two legs.', nurse: 'A quiet moment. The screen where everyone can see it.', senior: 'Ask the resident to point before they talk. That shows whether they really know.' },
      opts: [
        { t: 'Five landmarks and the two triangles', g: 'g', refs: [176, 177], fx: { anat: 35, vessel: -10, nerve: -10 }, reply: 'Good. Let’s see that you really see them.', kw: ['landmarks', 'triangles'] },
        { t: 'The defect, then start cutting', g: 'b', why: 'Without identifying the landmarks the risk to vessels and nerves rises.', fx: { anat: 5 }, reply: 'Wait. Stop. Map first, then the knife. Show me a few things.', kw: ['defect', 'cutting'] }
      ], to: 'lm_iev'
    },
    lm_iev: {
      view: 'scene', kind: 'spot', target: 'iev', he: 'The inferior epigastric vessels', say: 'Show me the inferior epigastric vessels.', refs: [176],
      ok: 'Right. That’s the border: lateral is indirect, medial is direct.',
      bad: 'No. Look for vessels running up from the pelvis to the rectus muscle, under the peritoneum.',
      why: 'The inferior epigastric vessels separate indirect from direct.', fxOk: { anat: 5 }, fxBad: { anat: -5 },
      tip: { stu: 'They run diagonally up from the pelvis towards the umbilicus.' }, to: 'lm_vas'
    },
    lm_vas: {
      view: 'scene', kind: 'spot', target: 'vas', he: 'The vas deferens', say: 'And now the vas deferens.', refs: [176, 177],
      ok: 'Nice. It runs medially, down into the pelvis. Don’t grab it with a grasper, just move it.',
      bad: 'That’s not it. The vas is white and thin, running down from the ring, medially towards the pelvis.',
      why: 'Confusing the vas with the testicular vessels puts both at risk.', fxBad: { vas: 15 },
      tip: { stu: 'White, round and a little firm. Like a strand of spaghetti.' }, to: 'lm_gon'
    },
    lm_gon: {
      view: 'scene', kind: 'spot', target: 'gon', he: 'The testicular vessels', say: 'And the testicular vessels?', refs: [176],
      ok: 'Yes. They come from above and from the side. And between the vas and these vessels there’s something you mustn’t touch.',
      bad: 'No. The testicular vessels come from the side and from above. If you mix them up with the vas, stop and identify again.',
      why: 'Confusing the vas with the testicular vessels puts both at risk.', fxBad: { vas: 10 }, to: 'lm_medul'
    },
    lm_medul: {
      view: 'scene', kind: 'spot', target: 'medul', he: 'The medial umbilical ligament', say: 'And our medial border?', refs: [176],
      ok: 'The medial umbilical ligament. Cut beyond it? Bladder.',
      bad: 'No. Look for the white fold coming down from the umbilicus. That’s the medial umbilical ligament.',
      why: 'The medial umbilical ligament is the medial limit of the incision; the bladder lies beyond it.', fxBad: { bladder: 5 }, to: 'lm_ring'
    },
    lm_ring: {
      view: 'scene', kind: 'spot', target: 'defect', he: 'The hernia', say: 'And finally, where’s the hernia?', refs: [153],
      ok: 'Good. Now you know where you are.',
      bad: 'Look at the defect again. Is it lateral to the vessels, or medial?',
      why: 'The hernia type is set by its position relative to the epigastric vessels and the iliopubic tract.', fxOk: { anat: 5 }, to: 'stu_dir'
    },
    stu_dir: {
      view: 'scene', for: ['stu'], skip: 'incise_gear', say: 'A question for you. How do you tell indirect, direct and femoral apart in the picture?', refs: [153],
      tip: { stu: 'In the European classification: L is indirect, M is direct, F is femoral, and a number for the size of the defect.' },
      opts: [
        { t: 'Indirect lateral to the vessels, direct medial, femoral below the tract', g: 'g', refs: [153], reply: 'Precise. And now you can read the European classification.', kw: ['lateral', 'medial', 'below'] },
        { t: 'By the size of the defect', g: 'b', refs: [153], why: 'Size is the number in the classification; the type is set by location.', reply: 'Size is the number in the classification. The type depends on where it is relative to the vessels.', kw: ['size'] },
        { t: 'Direct lateral to the vessels, indirect medial', g: 'b', refs: [153], why: 'Indirect comes out through the internal ring, lateral to the vessels; direct is medial to them.', reply: 'The other way round. Indirect comes out through the ring, lateral to the vessels. Direct pushes out the floor, medial to them.', kw: ['reverse', 'opposite'] }
      ], to: 'incise_gear'
    },

    /* ======== peritoneal flap ======== */
    incise_gear: {
      view: 'scene', kind: 'gear', say: 'We’re opening the peritoneum. What do you ask for?', st: { labels: false },
      pool: ['grasp', 'scis', 'hook', 'clip', 'stapler', 'suct', 'sealer'], need: 'scis', alt: ['hook', 'sealer'],
      ok: 'Scissors. And only use energy when you can see the tip.',
      altReply: 'That works too. Just don’t burn deep, there are vessels underneath.',
      bad: 'You don’t open peritoneum with that. Scissors, or the hook.',
      why: 'The peritoneum is opened with scissors or a hook (convention).',
      tip: { nurse: 'Laparoscopic scissors with an energy connection, and an atraumatic grasper for the other hand.', stu: 'The grasper pulls the peritoneum and the scissors cut.' }, to: 'incise'
    },
    incise: {
      view: 'scene', kind: 'tap', say: 'Where do we open? Show me where the incision goes.', hint: 'Tap where the peritoneal incision runs', dt: 3, refs: [176],
      tip: { res: 'A high, wide incision: from the anterior superior iliac spine to the medial umbilical ligament, a few centimeters above the ring.', stu: 'A wide incision gives a wide pocket, and a wide mesh needs a wide pocket.', senior: 'An incision right next to the ring is the most common beginner’s mistake.' },
      zones: [
        { xy: [200, 202], r: 110, g: 'g', he: 'High and wide, from the side', refs: [176], fx: { exposure: 20, st: { flap: 1 } }, reply: 'Nice. High, from the iliac spine to the medial ligament. A wide pocket, easy to close at the end.', to: 'flap_open' },
        { xy: [520, 182], r: 100, g: 'g', he: 'High and wide, above the ring', refs: [176], fx: { exposure: 20, st: { flap: 1 } }, reply: 'Nice. High above the ring, across to the medial ligament. A wide pocket, easy to close at the end.', to: 'flap_open' },
        { xy: [392, 296], r: 46, g: 'o', he: 'Right next to the ring', why: 'An incision close to the defect gives a narrow pocket that is hard to spread a mesh in and tears easily (convention).', fx: { tear: 1, exposure: -10, st: { flap: 1 } }, reply: 'Too close. The pocket will be narrow and it’ll tear. We’ll widen to the sides.', to: 'flap_open' },
        { xy: [482, 352], r: 30, g: 'b', he: 'Over the epigastric vessels', stop: 'Wait. Stop. The epigastric vessels run under this point. Go higher.', why: 'Cutting low over the epigastric vessels injures them.', fxWarn: { vessel: 5 }, fx: { vessel: 20, st: { flap: 1 } }, reply: 'You cut on them. See the blood?', to: 'b_epi' },
        { xy: [852, 214], r: 80, g: 'b', he: 'Medial to the ligament', stop: 'Wait. Stop. That’s beyond the medial ligament. The bladder sits there.', why: 'An incision medial to the medial umbilical ligament puts the bladder at risk.', fxWarn: { bladder: 10 }, fx: { bladder: 30, st: { flap: 1 } }, reply: 'Okay, medial. Let’s see what’s there.', to: 'bladder_roll' }
      ],
      missSay: 'Not there. Look for a line above the ring, from the side across to the medial ligament.'
    },
    bladder_roll: { roll: [{ p: function (S) { return cl((S.v.bladder || 0) / 100); }, flag: 'bladder_inj', ev: 'Urine in the field', luck: 'You cut too far medially and the bladder wasn’t injured. Lucky.', to: 'c_blad' }, { p: 1, to: 'flap_open' }] },
    flap_open: {
      view: 'scene', say: 'The peritoneum is open. We go into the loose layer. How do you know you’re in the right plane?', st: { flap: 2, labels: true, focus: null }, dt: 3,
      tip: { res: 'In the right plane the tissue separates like cobwebs and hardly bleeds.', stu: 'This is the preperitoneal space: between the peritoneum and the muscles.', nurse: 'Suction ready. Now it’s quiet, long work.' },
      opts: [
        { t: 'It separates like cobwebs, with no blood', g: 'g', why: 'Convention: the loose layer separates easily and without bleeding.', reply: 'Exactly. Cobwebs, and quiet. If there’s blood or muscle, you’re not in the plane.', kw: ['cobwebs', 'cobweb'] },
        { t: 'You see clean muscle', g: 'o', why: 'Too deep: the nerves run under the fat that lies over the muscle (convention).', fx: { nerve: 10 }, reply: 'Too deep. The nerves run under the fat on top of the muscle. Stay above it.', kw: ['muscle'] },
        { t: 'It doesn’t matter, just keep moving', g: 'b', why: 'Outside the right plane there is more bleeding and more nerve injury.', fx: { vessel: 10, nerve: 10 }, reply: 'It matters a lot. In the right plane it hardly bleeds. Outside it, everything gets complicated.', kw: ['moving', 'matter'] }
      ], to: 'retz'
    },

    /* ======== Retzius ======== */
    retz: {
      view: 'scene', say: 'Now medially, the space of Retzius. How far do we dissect?', st: { flap: 2, labels: true, focus: 'retzius' }, dt: 10, refs: [154, 177],
      tip: { res: 'To the pubic bone and Cooper’s ligament, and past the midline. That’s the medial part of the critical view.', stu: 'Cooper’s ligament runs along the pubic bone. It’s white and shiny.', nurse: 'Clips and suction ready. It can bleed near Cooper’s.', senior: 'Here you see who stops short of the bone. Ask whether they can see the femoral space.' },
      opts: [
        { t: 'To the pubic bone and Cooper’s, past the midline, seeing direct and femoral', g: 'g', refs: [154, 177], fx: { mpo: 1, flag: ['in_retz', 'femoral_seen'] }, reply: 'Nice. All the way to the bone. If you don’t see Cooper’s, the mesh won’t cover the femoral.', to: 'retz_g', kw: ['bone', 'cooper', 'midline'] },
        { t: 'A little medial to the defect, enough for the hernia', g: 'b', refs: [167, 175], why: 'Insufficient medial dissection leaves the direct and femoral openings outside the mesh.', fx: { recur: 20, flag: ['in_retz', 'short_medial'] }, reply: 'Enough for today’s hernia. Not for tomorrow’s. The femoral stays open.', to: 'retz_roll', kw: ['little', 'enough'] },
        { t: 'Quickly with the hook on Cooper’s, there’s nothing there', g: 'b', refs: [174], why: 'About half of hemipelves have a vascular connection over Cooper’s ligament (corona mortis).', fx: { vessel: 30, flag: ['in_retz', 'rough'] }, reply: 'Nothing there? In half of people a vessel runs there. Let’s see if you’re lucky.', to: 'retz_roll', kw: ['hook', 'quickly'] }
      ]
    },
    retz_g: { when: [{ if: F('corona'), to: 'corona_see' }, { if: always, to: 'retz_roll' }] },
    corona_see: {
      view: 'scene', say: 'Hold on. See the vessel running over Cooper’s? What is it?', st: { corona: true, focus: 'corona' }, refs: [174],
      tip: { res: 'Corona mortis: a connection between the obturator and the external iliac or epigastric vessels. Present in about half of people.', stu: 'In Latin it means the crown of death.', nurse: 'Two loaded clip appliers.' },
      opts: [
        { t: 'Corona mortis. Go around it gently, or clip both sides', g: 'g', refs: [174], fx: { vessel: -10, flag: 'corona_seen' }, reply: 'Exactly. The crown of death. If it’s cut without control, it retracts into the pelvis.', kw: ['corona', 'clip'] },
        { t: 'A small vein, burn it and move on', g: 'b', refs: [174], why: 'A divided corona mortis retracts into the obturator canal and is hard to control.', fx: { vessel: 30 }, reply: 'Small? If it’s cut, it retracts into the obturator canal, and then you’re searching for it in the dark.', to: 'corona_burn', kw: ['burn'] },
        { t: 'I don’t know what that is', g: 'o', refs: [174], why: 'Corona mortis is found in about half of hemipelves; look for it near Cooper’s ligament.', fx: { flag: 'corona_seen' }, reply: 'Corona mortis. It’s there in about half of people. From today, you look for it every time.', kw: ['know'] }
      ], to: 'retz_roll'
    },
    corona_burn: { roll: [{ p: .6, flag: 'bled_corona', ev: 'Bleeding from the corona mortis', luck: 'You burned the corona and it sealed. Lucky.', to: 'b_corona' }, { p: 1, to: 'retz_roll' }] },
    retz_roll: {
      roll: [
        { p: function (S) { return S.f.corona && !S.f.corona_seen ? (S.f.rough ? .7 : (S.v.vessel || 0) > 30 ? .3 : .05) : 0; }, flag: 'bled_corona', ev: 'Bleeding near Cooper’s ligament', luck: 'You worked fast near Cooper’s and didn’t bleed. Luck, not technique.', to: 'b_corona' },
        { p: function (S) { return (S.v.vessel || 0) > 25 ? .2 : .02; }, flag: 'bled_epi', ev: 'Bleeding from the epigastric vessels', to: 'b_epi' },
        { p: function (S) { return (S.v.bladder || 0) >= 25 ? (S.v.bladder || 0) / 150 : 0; }, flag: 'bladder_inj', ev: 'Urine in the field', to: 'c_blad' },
        { p: 1, to: 'retz_next' }
      ]
    },
    retz_next: { when: [{ if: is('m3'), to: 'm3_pseudo' }, { if: is('recur'), to: 'recur_scar' }, { if: always, to: 'bog' }] },
    m3_pseudo: {
      view: 'scene', say: 'See the white sac in the direct defect? That’s not peritoneum, it’s a pseudosac. What do we do with it?', st: { defect: 'M', size: 3, focus: 'defect' },
      tip: { res: 'The pseudosac is stretched transversalis fascia. Pulling it in and fixing it reduces dead space.', stu: 'In a direct hernia the posterior wall of the canal weakens and bulges.', nurse: 'Maybe a tack or a stitch to fix it to Cooper’s.' },
      opts: [
        { t: 'Pull it in and fix it to Cooper’s ligament', g: 'g', why: 'Convention: reducing dead space reduces seroma; no verified trial.', fx: { seroma: -15 }, reply: 'Nice. Less dead space, less seroma. A good convention, even without a trial behind it.', kw: ['pull', 'cooper'] },
        { t: 'Leave it, the mesh will cover it', g: 'o', why: 'A large dead space fills with fluid and gets mistaken for recurrence (convention).', fx: { seroma: 15 }, reply: 'The mesh will cover it, yes. But a big space is left behind and fills with fluid. He’ll think it came back.', kw: ['leave'] },
        { t: 'Dissect it deep, down to the scrotum', g: 'b', why: 'Deep dissection into the scrotum increases bleeding and cord injury (convention).', fx: { vas: 15, seroma: 5, bleed: 1 }, reply: 'Too deep. It bleeds down there, and you touch the cord. No need.', kw: ['deep'] }
      ], to: 'bog'
    },
    recur_scar: {
      view: 'scene', say: 'The direct sac is stuck to the old floor. How do we separate it?', st: { focus: 'defect' }, dt: 8, refs: [180],
      tip: { res: 'After an anterior repair, cover the whole floor of the canal and leave the old mesh alone.', nurse: 'Sharp scissors and suction.' },
      opts: [
        { t: 'Sharp, close to the sac, the old mesh stays, cover the whole floor', g: 'g', refs: [180], reply: 'Exactly. We don’t touch the old mesh. Cover wide, and recurrence almost disappears.', kw: ['sharp', 'floor'] },
        { t: 'Take out the old mesh, to keep it clean', g: 'b', why: 'Removing an anterior mesh from a posterior approach adds bleeding and nerve injury without benefit (convention).', fx: { vessel: 20, nerve: 15 }, reply: 'No. It’s on the other side of the wall and doesn’t bother us. Taking it out only adds blood and injured nerves.', kw: ['remove', 'old'] },
        { t: 'A short dissection, just around the hole', g: 'b', refs: [167], why: 'Insufficient dissection and a mesh that doesn’t cover the whole floor are causes of recurrence.', fx: { recur: 20 }, reply: 'After an anterior repair you need to cover the whole floor. One hole covered is another recurrence.', kw: ['short'] }
      ], to: 'bog'
    },

    /* ======== bleeding branches ======== */
    b_corona: {
      view: 'scene', say: 'Bleeding. Near Cooper’s. Breathe. What’s the first thing?', st: { bleed: 'corona', focus: 'bleed', corona: true }, fx: { bleed: 2, flag: 'cx_corona' }, refs: [174],
      tip: { res: 'Pressure first. See the ends, and only then clips.', nurse: 'Suction, a small laparoscopic swab and clips. Tell the anesthesiologist.', senior: 'Your voice sets the resident’s pulse. Talk slowly.' },
      opts: [
        { t: 'Pressure with a grasper or a small swab', g: 'g', refs: [174], reply: 'Right. Pressure. Now nobody panics. Suction and clips ready.', to: 'b_cor_gear', kw: ['pressure', 'swab'] },
        { t: 'Clips, fast, into the blood', g: 'b', why: 'Blind clips in a pool of blood can injure the iliac vessels.', fx: { bleed: 1, hemo: 1 }, reply: 'Not blind. Now it’s retracted into the pelvis. Pressure, quickly.', to: 'b_cor_deep', kw: ['clips'] },
        { t: 'Burn it with the hook', g: 'b', why: 'Energy on a bleeding vessel you can’t see spreads the blood and doesn’t seal (convention).', fx: { bleed: 1 }, reply: 'Energy on a vessel like that just spreads the blood. Pressure first.', to: 'b_cor_deep', kw: ['burn', 'hook'] }
      ]
    },
    b_cor_gear: {
      view: 'scene', kind: 'gear', say: 'What do you ask for now?', pool: ['suct', 'grasp', 'clip', 'hook', 'scis', 'sealer', 'bag'], need: 'suct', alt: ['clip'],
      ok: 'Suction. Clean gently and see where it’s coming from.',
      altReply: 'A clip, yes, but suction first, and see the ends.',
      bad: 'No. Suction first. If you can’t see, you do nothing.',
      why: 'With bleeding you suction first, find the source, and only then close (convention).',
      tip: { nurse: 'Suction already connected and open. Don’t wait to be asked twice.' }, to: 'b_cor_clip'
    },
    b_cor_clip: {
      view: 'scene', say: 'We can see both ends. How do we close?', refs: [174],
      opts: [
        { t: 'A clip on each side, seeing each end', g: 'g', refs: [174], fx: { bleed: -3, st: { bleed: 0 } }, reply: 'Nice. Quiet. Check again at low insufflation pressure.', kw: ['each', 'side'] },
        { t: 'One clip and that’s it', g: 'o', why: 'With a vascular connection the other side can bleed again when the pressure drops (convention).', fx: { bleed: -2, st: { bleed: 0 }, vessel: 5 }, reply: 'It stopped, but the other side can bleed again when the pressure drops. Another clip.', kw: ['one'] }
      ], to: 'resume'
    },
    b_cor_deep: {
      view: 'mentor:tense', say: 'It’s retracted towards the obturator canal. The heart rate is going up. Now what?', fx: { bleed: 1 },
      tip: { res: 'When the end disappears: sustained pressure and help. Don’t go searching with clips.', nurse: 'Tell the anesthesiologist, blood ordered, open set nearby.' },
      opts: [
        { t: 'Sustained pressure, tell anesthesia and call a second attending', g: 'g', why: 'Convention: sustained pressure and help before repeated attempts.', fx: { flag: 'help' }, reply: 'Right. Five minutes of real pressure. I’m here. Most of the time it settles.', kw: ['pressure', 'sustained', 'attending'] },
        { t: 'Keep searching with clips', g: 'b', why: 'Searching with clips in blood near the pelvis can catch the iliac vein.', fx: { hemo: 1, flag: 'blind_clip' }, reply: 'You could catch the iliac vein. Hands up, and pressure.', kw: ['clips'] }
      ], to: 'b_cor_gear'
    },
    b_epi: {
      view: 'scene', say: 'Bleeding from the epigastrics. Steady. What do we do?', st: { bleed: 'epigastric', focus: 'bleed' }, fx: { bleed: 1, flag: 'cx_epi' },
      tip: { res: 'Pressure, suction, find the end, then clips on both sides or bipolar.', nurse: 'Clips and suction.' },
      opts: [
        { t: 'Pressure and suction, identify, then clip above and below or bipolar', g: 'g', why: 'Convention: control the vessel after identifying both ends.', fx: { bleed: -3, st: { bleed: 0 } }, reply: 'Good. That’s it. Clip above, clip below. Done.', kw: ['clip', 'above', 'below'] },
        { t: 'Monopolar into the blood', g: 'o', why: 'Without seeing the end, the bleeding can come back as a hematoma under the mesh that lifts it.', refs: [167], fx: { bleed: -1, st: { bleed: 0 }, vessel: 5, flag: 'hematoma' }, reply: 'It stopped, this time. But without seeing the end it can come back as a hematoma under the mesh.', kw: ['monopolar', 'burn'] }
      ], to: 'resume'
    },
    b_iliac: {
      view: 'scene', say: 'Stop. Don’t move. That’s the iliac vein. Pressure, now.', st: { bleed: 'iliac', focus: 'bleed' }, fx: { bleed: 3, hemo: 1, flag: 'cx_iliac' },
      tip: { res: 'The one branch where you don’t try alone: pressure, anesthesia, blood, a vascular surgeon.', nurse: 'Open set, vascular set, blood ordered, phone the vascular surgeon.', senior: 'Take command out loud. The resident presses, you run the room.' },
      opts: [
        { t: 'Press and don’t let go, anesthesia, blood and a vascular surgeon', g: 'g', why: 'Convention: for iliac bleeding, press, call for help and sometimes convert to open.', fx: { flag: 'help' }, reply: 'Right. You press, and I talk. This is the one situation where we don’t argue.', kw: ['press', 'vascular', 'blood'] },
        { t: 'Clips into the blood', g: 'b', refs: [155, 177], why: 'The external iliac artery and vein run in the triangle of doom; blind clips can injure them.', fx: { hemo: 2, flag: 'iliac_inj' }, reply: 'No. Hands up. Pressure only. Now his heart rate is a hundred and thirty.', kw: ['clips'] },
        { t: 'Take the instrument out and see what happens', g: 'b', why: 'Releasing pressure on a large bleeding vessel makes it bleed more.', fx: { hemo: 1, bleed: 1 }, reply: 'Then it bleeds freely. Put the pressure back, right now.', kw: ['out', 'remove'] }
      ], to: 'b_iliac2'
    },
    b_iliac2: {
      view: 'mentor:calm', kind: 'info', say: 'The vascular surgeon opened and repaired the vein. Everything’s under control. We breathe, and we carry on.', st: { bleed: 0, focus: null }, fx: { bleed: -3, t: 40 },
      tip: { nurse: 'A full count after converting. Every swab that went in comes out.', res: 'A detailed op note and a talk with the family. That’s part of the care.' }, btn: 'Carry on', to: 'resume'
    },
    c_blad: {
      view: 'scene', say: 'Hold on. Clear fluid in the field, and the catheter bag is filling with gas. We’re in the bladder.', st: { focus: 'bladder' }, fx: { flag: 'cx_bladder' }, refs: [162],
      tip: { res: 'A full bladder, a medial incision or previous surgery in Retzius raise the risk.', nurse: 'A catheter if there isn’t one, suture for a two-layer repair, and phone the urologist.', senior: 'Recognizing it in time is the whole story. If the resident caught it, praise them for that.' },
      opts: [
        { t: 'Two-layer repair, a catheter for a few days, and urology', g: 'g', refs: [162], why: 'Convention: immediate repair of a recognized bladder injury and drainage with a catheter.', fx: { flag: 'help', t: 20 }, reply: 'Right. Recognize it in time, repair it and leave a catheter. That way it ends without drama.', kw: ['layers', 'urology', 'urologist'] },
        { t: 'It’s probably irrigation. Carry on', g: 'b', why: 'An unrecognized bladder injury shows up after surgery as blood in the urine and a rising creatinine.', fx: { flag: 'bladder_missed' }, reply: 'Irrigation doesn’t fill the bag with gas. I don’t like this at all.', kw: ['irrigation'] }
      ], to: 'resume'
    },
    resume: {
      when: [
        { if: function (S) { return (S.st.mesh || 0) >= 1; }, to: 'close_pre' },
        { if: F('in_retz'), to: 'retz_next' },
        { if: function (S) { return (S.st.flap || 0) >= 1; }, to: 'flap_open' },
        { if: function (S) { return S.cs.id === 'fem' && !S.f.fem_out; }, to: 'fem_viab' },
        { if: always, to: 'lm_intro' }
      ]
    },

    /* ======== Bogros and the triangles ======== */
    bog: {
      view: 'scene', say: 'And laterally. The space of Bogros. How far, and how?', st: { focus: 'bogros', labels: true }, dt: 6, refs: [154, 177],
      tip: { res: 'To the iliac spine, over the psoas, and the fat over the nerves stays.', stu: 'Laterally, the nerves to the thigh run under the fat.', nurse: 'Quiet work. No energy near the nerves.', senior: 'Whoever cleans off the fat for a pretty picture gives the patient pain.' },
      opts: [
        { t: 'To the iliac spine, over the psoas, leaving the fat over the nerves', g: 'g', refs: [154, 177], fx: { mpo: 1, flag: 'in_bog' }, reply: 'Good. The nerves are asleep under that fat. Let them sleep.', kw: ['iliac', 'fat', 'leaving'] },
        { t: 'Clean off all the fat, so it looks nice', g: 'b', refs: [177], why: 'Stripping the fat over the muscle exposes the nerves in the triangle of pain.', fx: { mpo: 1, nerve: 25, flag: ['in_bog', 'stripped'] }, reply: 'Nice for a photo, bad for the nerves. The nerves to the thigh run under that fat.', kw: ['clean'] },
        { t: 'A little lateral, that’s enough', g: 'b', refs: [167], why: 'A short lateral dissection makes the mesh fold at the side and lift.', fx: { recur: 15, flag: ['in_bog', 'short_lat'] }, reply: 'Too short. The mesh will fold at the side and lift. That’s how recurrences start.', kw: ['little'] }
      ], to: 'lm_doom'
    },
    lm_doom: {
      view: 'scene', kind: 'spot', target: 'doom', he: 'The triangle of doom', say: 'A quick check. Show me the triangle of doom.', st: { labels: false, focus: null }, refs: [155, 177],
      ok: 'Right. Between the vas and the testicular vessels. Underneath are the external iliac artery and vein. No energy and no tacks there.',
      bad: 'No. Look for the triangle between the vas and the testicular vessels. The apex is at the ring.',
      why: 'The triangle of doom lies over the external iliac vessels; no fixation and no energy there.', fxBad: { vessel: 10 },
      tip: { stu: 'The apex is at the internal ring, and the sides are the vas and the testicular vessels.' }, to: 'lm_pain'
    },
    lm_pain: {
      view: 'scene', kind: 'spot', target: 'pain', he: 'The triangle of pain', say: 'And the triangle of pain?', refs: [155, 177],
      ok: 'Good. Lateral to the testicular vessels and below the tract. That’s where the nerves to the thigh are.',
      bad: 'No. Lateral to the testicular vessels, below the iliopubic tract. That’s where the nerves run.',
      why: 'The cutaneous nerves of the thigh run through the triangle of pain; no fixation and no energy there.', fxBad: { nerve: 10 }, to: 'lm_cooper'
    },
    lm_cooper: {
      view: 'scene', kind: 'spot', target: 'cooper', he: 'Cooper’s ligament', say: 'And where would you put a tack, if you needed one?', refs: [155],
      ok: 'Cooper’s ligament. Bone, no nerves. The safest place to fix.',
      bad: 'Not there. The safest place is Cooper’s ligament, on the pubic bone.',
      why: 'If you fix the mesh, Cooper’s ligament is a safe place for fixation.', to: 'sac_r'
    },

    /* ======== the sac, the lipoma, parietalization ======== */
    sac_r: {
      when: [
        { if: function (S) { return S.st.defect === 'L' && S.f.longsac; }, to: 'sac_long' },
        { if: function (S) { return S.st.defect === 'L'; }, to: 'sac_L' },
        { if: function (S) { return S.st.defect === 'M'; }, to: 'sac_M' },
        { if: always, to: 'lip_r' }
      ]
    },
    sac_L: {
      view: 'scene', say: 'Now the indirect sac. How do we get it out?', st: { focus: 'sac', labels: true }, dt: 8,
      tip: { res: 'One hand pulls the sac, the other separates the vas and the testicular vessels from it.', stu: 'The indirect sac is a pocket of peritoneum that goes into the canal inside the cord.', nurse: 'Two atraumatic graspers.', senior: 'Watch the resident’s non-dominant hand. It does most of the work here.' },
      opts: [
        { t: 'Gentle traction, separating it from the vas and vessels until it’s in the abdomen', g: 'g', why: 'Convention: gentle separation of the sac from the cord in short and medium sacs.', fx: { mpo: 1 }, reply: 'Nice. One hand pulls, the other cleans the cord off the sac. Patiently.', kw: ['gentle', 'separating'] },
        { t: 'Grab the whole cord and pull it all together', g: 'b', why: 'Pulling the cord together with the sac injures the vas and the testicular vessels.', fx: { vas: 30 }, reply: 'Wait. Stop. Inside the cord are the vas and the testicular vessels. Only pull the sac.', kw: ['cord', 'together'] },
        { t: 'Leave the sac in the canal, the mesh will cover it', g: 'b', why: 'A sac left in the canal above the mesh can present as a recurrence.', fx: { recur: 20 }, reply: 'A sac left in the canal looks like a recurrence within a year. We take it out.', kw: ['leave'] }
      ], to: 'lip_r'
    },
    sac_long: {
      view: 'scene', say: 'The sac is long and goes all the way down to the scrotum. Do we keep pulling?', st: { focus: 'sac', labels: true }, dt: 8, refs: [178],
      tip: { res: 'With a long sac, divide it beyond the ring and close the near side.', nurse: 'An endoloop ready, or a suture to close the sac.', senior: 'This is where residents get stuck for half an hour. Teach them when to let go.' },
      opts: [
        { t: 'Divide it beyond the ring, close the near end and leave the far end', g: 'g', refs: [178], fx: { mpo: 1, seroma: 5 }, reply: 'Exactly. With a sac like this it’s safer than dissecting the whole cord. Maybe a little fluid afterwards.', kw: ['divide', 'leave'] },
        { t: 'Pull it all the way, leave nothing behind', g: 'b', refs: [178], why: 'With a long sac, over-dissecting the cord raises the risk to the vas and the testis.', fx: { vas: 30, flag: 'pulled' }, reply: 'You’re dissecting the whole cord for this. The testis will thank you in two days, with swelling.', kw: ['pull', 'nothing'] },
        { t: 'Leave all of it in the canal', g: 'b', why: 'A whole sac left in the canal above the mesh can present as a recurrence.', fx: { recur: 20 }, reply: 'Then it stays above the mesh. Divide it near the ring, don’t leave the whole thing.', kw: ['all', 'whole'] }
      ], to: 'lip_r'
    },
    sac_M: {
      view: 'scene', say: 'In a direct hernia, what do we reduce?', st: { focus: 'defect', labels: true }, dt: 6,
      tip: { res: 'In a direct hernia, reduce the peritoneum and fat from the defect until you see its edges.', stu: 'The direct defect is in Hesselbach’s triangle.' },
      opts: [
        { t: 'The sac and the fat inside it, gently, until the defect is empty', g: 'g', why: 'Convention: reduce the contents of the direct defect and see its edges.', fx: { mpo: 1 }, reply: 'Nice. The defect is empty and you can see the edges. Now you know how big it is.', kw: ['sac', 'fat'] },
        { t: 'Cut the floor to enlarge the defect', g: 'b', why: 'There’s no reason to enlarge a direct defect; the mesh covers it (convention).', fx: { bleed: 1, vessel: 10 }, reply: 'Why enlarge it? The mesh covers it. Just take out what’s inside.', kw: ['cut', 'enlarge'] }
      ], to: 'lip_r'
    },
    lip_r: { when: [{ if: F('lipoma'), to: 'lip_q' }, { if: always, to: 'pariet' }] },
    lip_q: {
      view: 'scene', say: 'Hold on, there’s something else here. A yellow lump of fat inside the cord, going into the canal. What is it, and what do we do?', st: { focus: 'ring' }, refs: [178, 183], dt: 4,
      tip: { res: 'Anything that passes through the internal ring behaves like a hernia.', stu: 'A cord lipoma is fat from the space behind the peritoneum that has slipped into the canal.', nurse: 'A small bag, or extraction through the port.' },
      opts: [
        { t: 'A cord lipoma. We pull it out of the canal', g: 'g', refs: [178, 183], fx: { mpo: 1 }, reply: 'Right. Fat that passes through the ring behaves like a hernia. Leave it, and you get a pseudo-recurrence.', kw: ['lipoma', 'out'] },
        { t: 'It’s just fat, leave it', g: 'b', refs: [183], why: 'A cord lipoma left behind presents as a bulge and pain that look like a recurrence.', fx: { flag: 'missed_lipoma' }, reply: 'Just fat? In three months he’ll come back with a bulge, and they’ll say the hernia came back.', kw: ['just', 'fat'] },
        { t: 'Burn it inside the cord', g: 'o', why: 'Energy near the vas puts it at risk; pull the lipoma out, then divide it (convention).', fx: { vas: 10, mpo: 1 }, reply: 'Take it out, yes. But don’t burn next to the vas. Pull it out, then divide it.', kw: ['burn'] }
      ], to: 'pariet'
    },
    pariet: {
      view: 'scene', say: 'Parietalization. How far do we dissect the vas and the testicular vessels?', st: { flap: 3, focus: 'vas', labels: true }, dt: 5, refs: [154, 177],
      tip: { res: 'Until the vas turns medially into the pelvis and nothing can slip under the mesh.', stu: 'Parietalization: laying the cord back against the wall so the mesh lies flat over it.', senior: 'Ask the resident to show where the vas turns into the pelvis. That’s the sign to stop.' },
      opts: [
        { t: 'Until the vas turns medially into the pelvis', g: 'g', refs: [154, 177], fx: { mpo: 1 }, reply: 'Good. The lower edge of the mesh will lie flat on the vessels.', kw: ['turns', 'pelvis'] },
        { t: 'A little, enough for the mesh to fit', g: 'b', refs: [167], why: 'Short parietalization lifts the lower edge of the mesh.', fx: { recur: 15, flag: 'short_par' }, reply: 'The mesh will lift from below. That’s where most recurrences start.', kw: ['little'] },
        { t: 'Until the vas is fully exposed', g: 'o', why: 'Dissecting more than needed puts the testicular vessels at risk (convention).', fx: { vas: 10, mpo: 1 }, reply: 'Until it turns into the pelvis is enough. Beyond that you’re only putting the testicular vessels at risk.', kw: ['exposed'] }
      ], to: 'n_mesh'
    },
    n_mesh: {
      view: 'tray', for: ['nurse'], skip: 'stu_mpo', say: 'In a moment I’ll ask for the mesh. What do we get ready?', refs: [151],
      tip: { nurse: 'Confirm the size and side out loud before opening. Record the lot number.' },
      opts: [
        { t: 'At least 10 × 15 cm, the correct side, rolled for the 12 mm port, and the lot number', g: 'g', refs: [151], reply: 'Perfect. And say the size and side out loud before you open it.', kw: ['15', 'lot'] },
        { t: 'The smallest there is, it goes in more easily', g: 'b', refs: [167], why: 'A mesh that is too small is a major cause of recurrence.', reply: 'Small is exactly what we don’t want. At least ten by fifteen.', kw: ['smallest', 'small'] },
        { t: 'Open several sizes in advance', g: 'o', why: 'A mesh that was opened and not used goes in the bin (convention).', reply: 'A mesh that’s opened and not used goes in the bin. Confirm the size, then open.', kw: ['several', 'sizes'] }
      ], to: 'stu_mpo'
    },
    stu_mpo: {
      kind: 'info', for: ['stu'], skip: 'mpo', view: 'scene',
      say: 'Just before the mesh we stop, like the critical view in a gallbladder. Here it’s the critical view of the myopectineal orifice.',
      tip: { stu: 'The myopectineal orifice is the whole area where a hernia can come out: indirect, direct and femoral.' }, btn: 'Got it', to: 'mpo'
    },
    mpo: {
      view: 'scene', kind: 'check', say: 'We stop. The critical view of the myopectineal orifice. What do we have now?', st: { labels: true, zones: true, focus: null }, dt: 1, refs: [154, 177, 178],
      tip: { res: 'Six points. Only when they’re all there does the mesh go in.', stu: 'Like the time-out in a gallbladder: a stop before the step you can’t take back.', nurse: 'This is the moment to open the mesh, once James says so.', senior: 'Don’t tick the boxes for the resident. Have them say each point out loud.' },
      items: [
        { t: 'Retzius open to the pubic bone and Cooper’s, past the midline', need: 1, miss: 'Retzius to the bone and past the midline. Without that, the femoral isn’t covered.' },
        { t: 'Bogros open to the iliac spine', need: 1, miss: 'Bogros to the iliac spine. Otherwise the mesh folds at the side.' },
        { t: 'Indirect, direct and femoral spaces all seen', need: 1, miss: 'All three openings. What you didn’t see, you didn’t cover.' },
        { t: 'Sac in the abdomen or divided, and no lipoma in the canal', need: 1, miss: 'The sac and the lipoma. Fat left in the ring will come back to us.' },
        { t: 'Cord parietalized', need: 1, miss: 'Parietalization. Otherwise the mesh lifts from below.' },
        { t: 'Room for a flat 10 × 15 cm mesh', need: 1, miss: 'Room for a flat mesh, at least ten by fifteen.' },
        { t: 'Fat over the nerves cleaned off', no: 1, miss: 'We don’t clean the fat off the nerves. It protects them.' },
        { t: 'Epigastric vessels divided to make room', no: 1, miss: 'We don’t divide the epigastrics to make room. They stay.' }
      ],
      ok: 'That’s the critical view. Now the mesh can go in.',
      fx: { g: { flag: 'mpo_done' }, o: { flag: 'mpo_done' }, b: { flag: 'mpo_partial', recur: 5 } }, btn: 'That’s my view', to: 'mpo_truth'
    },
    mpo_truth: { when: [{ if: function (S) { return !!(S.f.short_medial || S.f.short_lat || S.f.short_par || S.f.missed_lipoma); }, to: 'mpo_gap' }, { if: always, to: 'mesh' }] },
    mpo_gap: {
      view: 'scene', say: 'Hold on. Before the mesh, look again. Something from the critical view isn’t really there. Do we go back and fix it?', st: { zones: false }, refs: [154, 167],
      tip: { res: 'Ten minutes going back now saves a reoperation.', senior: 'An important lesson: going back isn’t failure.' },
      opts: [
        { t: 'Yes. We go back and complete it', g: 'g', refs: [154], fx: function (S) { return { unflag: ['short_medial', 'short_lat', 'short_par', 'missed_lipoma'], recur: -((S.f.short_medial ? 20 : 0) + (S.f.short_lat ? 15 : 0) + (S.f.short_par ? 15 : 0)), mpo: 1, flag: 'fixed_gap', t: 10 }; }, reply: 'Nice. Ten minutes now saves a reoperation. That’s how we work.', kw: ['back', 'complete'] },
        { t: 'It’s good enough, carry on', g: 'b', refs: [167], why: 'A mesh placed over an incomplete critical view is one of the main causes of recurrence.', reply: 'Okay. It’s your operation. I’m only saying I’d go back.', kw: ['enough', 'carry'] }
      ], to: 'mesh'
    },

    /* ======== mesh and fixation ======== */
    mesh: {
      view: 'tray', say: 'Which mesh, and what size?', st: { zones: false, labels: false, focus: null }, dt: 3, refs: [151, 155, 166],
      tip: { res: 'At least 10 × 15 cm, flat, with overlap beyond every opening.', stu: 'The mesh covers the whole area, not just today’s hole.', nurse: 'Confirm the size and side out loud. Anatomical mesh comes in right and left versions.', senior: 'Ask the resident what happens to a light, unfixed mesh in a four centimeter defect.' },
      opts: [
        { t: 'At least 10 × 15 cm, flat, covering all the openings', when: isnt('m3'), g: 'g', refs: [151, 155, 166], fx: { recur: -10 }, reply: 'Good. A mesh that size, lying right, covers everything.', kw: ['15', 'flat'] },
        { t: 'At least 10 × 15 cm, flat, covering all the openings', when: is('m3'), g: 'o', refs: [182], why: 'In a biomechanical model, a light unfixed mesh bulges into a large direct defect.', reply: 'Fine, but in a defect like this a light mesh that isn’t fixed can fall in. Let’s think about fixation.', kw: ['15', 'flat'] },
        { t: 'Larger and stiffer, and we fix it', when: is('m3'), g: 'g', refs: [151, 182], fx: { recur: -15 }, reply: 'Exactly. A big defect, a big mesh, and fixation.', kw: ['larger', 'stiffer'] },
        { t: 'A small mesh, 8 × 13 cm, so it goes in easily', g: 'b', refs: [167], why: 'A mesh that is too small and insufficient overlap are among the main causes of recurrence.', fx: { recur: 25 }, reply: 'Small is exactly how hernias come back. At least ten by fifteen.', kw: ['small'] },
        { t: 'The lightest there is, weight is what matters', g: 'o', refs: [151], why: 'The guideline doesn’t recommend choosing a mesh on weight alone.', reply: 'Weight isn’t the criterion. A light mesh has a small early advantage, but not in recurrence and not in pain.', kw: ['lightest', 'weight'] },
        { t: 'An anatomical mesh for the correct side', g: 'g', why: 'A preshaped anatomical mesh is an accepted option (convention; no verified comparison here).', fx: { recur: -5 }, reply: 'Also good. It sits on the curves. Just make sure it’s the right side.', kw: ['anatomical'] }
      ], to: 'mesh_lay'
    },
    mesh_lay: {
      view: 'scene', say: 'The mesh is in. How do we lay it out?', st: { mesh: 1 }, dt: 4, refs: [151, 155],
      tip: { res: 'Lower medial corner on Cooper’s, lower edge under the cord, no folds.', nurse: 'A second grasper for spreading it.', senior: 'Ask the resident to go corner by corner, out loud.' },
      opts: [
        { t: 'Flat, medial corner on Cooper’s, lower edge under the cord', g: 'g', refs: [151, 155], reply: 'Good. Check corner by corner. If there’s a fold, straighten it now.', kw: ['flat', 'cooper'] },
        { t: 'Quickly, a bit folded at the side, it’ll flatten out', g: 'b', refs: [167], why: 'A folded or twisted mesh is a known cause of recurrence.', fx: { flag: 'fold' }, reply: 'Mesh doesn’t flatten out by itself. A fold today is a recurrence next year.', kw: ['folded'] },
        { t: 'Lower edge over the cord, so it doesn’t press', g: 'b', refs: [167], why: 'After parietalization the lower edge must lie under the cord, on the vessels.', fx: { recur: 20 }, reply: 'That’s exactly where the hernia will come back. The lower edge goes underneath, on the vessels.', kw: ['over', 'cord'] }
      ], to: 'fix'
    },
    fix: {
      view: 'scene', say: 'Do we fix it?', refs: [151, 165],
      tip: { res: 'In a small hernia you can skip fixation. In a large direct hernia the guideline recommends fixing.', stu: 'A tack is a small pin that goes into the tissue and holds the mesh.', nurse: 'Tacker or glue, only if asked. Count how many tacks are fired.' },
      opts: [
        { t: 'No. The mesh is big and lies well', when: isnt('m3'), g: 'g', refs: [151, 165], fx: { flag: 'nofix' }, reply: 'Agreed. In the meta-analysis there was no difference in recurrence or pain. Fewer tacks, fewer nerves.', to: 'close_pre', kw: ['no', 'lies'] },
        { t: 'No. The mesh is big and lies well', when: is('m3'), g: 'b', refs: [151], why: 'For a large medial hernia in TAPP the guideline recommends fixation to reduce recurrence.', fx: { recur: 25, flag: 'nofix' }, reply: 'In a four centimeter defect? The mesh will fall in. Here the guideline says to fix it.', to: 'close_pre', kw: ['no', 'lies'] },
        { t: 'Yes, tacks. I’ll show you where', when: is('m3'), g: 'g', refs: [151, 155], reply: 'Right. In a large direct hernia we fix. Show me where the first one goes.', to: 'fix_tap', kw: ['tacks', 'yes'] },
        { t: 'Yes, tacks, to be safe', when: isnt('m3'), g: 'o', refs: [165], why: 'In a small hernia, fixation didn’t reduce recurrence in the meta-analysis.', reply: 'Not required for a hernia like this. But let’s see that you know where it’s allowed.', to: 'fix_tap', kw: ['tacks', 'yes'] },
        { t: 'Glue instead of tacks', g: 'g', why: 'Glue is an accepted alternative (convention; no comparison verified here).', fx: function (S) { return { flag: 'glue', st: { mesh: 2 }, recur: S.cs.id === 'm3' ? -10 : 0 }; }, reply: 'Also good. No tack, no trapped nerve. That’s convention, though. I don’t have a trial that clearly compares them.', to: 'close_pre', kw: ['glue'] }
      ]
    },
    fix_tap: {
      view: 'scene', kind: 'tap', say: 'Show me where the first tack goes.', hint: 'Tap where the first tack goes', st: { mesh: 2, zones: false, labels: false, focus: null }, dt: 2, refs: [155],
      tip: { res: 'Cooper’s, the rectus muscle above, and laterally only above the iliopubic tract.', nurse: 'Count out loud every tack that’s fired.', senior: 'Don’t stop the resident before they point. James stopping them is the lesson.' },
      zones: [
        { spot: 'cooper', r: 48, g: 'g', he: 'Cooper’s ligament', refs: [155], fx: addTack('cooper'), reply: 'Nice. Cooper’s, on the bone. As safe as it gets.', to: 'fix_tap2' },
        { xy: [756, 176], r: 44, g: 'g', he: 'Rectus muscle, above', refs: [155], fx: addTack('medial'), reply: 'Good. High, on the rectus. Far from any nerve.', to: 'fix_tap2' },
        { xy: [278, 192], r: 48, g: 'g', he: 'Lateral, above the tract', refs: [155], fx: addTack('lateral-high'), reply: 'Above the tract, yes. Just not any lower than that.', to: 'fix_tap2' },
        { spot: 'doom', r: 46, g: 'b', he: 'Triangle of doom', refs: [155, 177], stop: 'Wait. Stop. That’s the triangle of doom. The iliac vein is underneath.', why: 'A tack in the triangle of doom can injure the external iliac vessels.', fxWarn: { vessel: 10 }, fx: { vessel: 50, st: { badTack: 'doom' } }, reply: 'You fired one there. Now we hope.', to: 'doom_roll' },
        { spot: 'pain', r: 50, g: 'b', he: 'Triangle of pain', refs: [155, 177], stop: 'Stop. Below the tract, laterally? That’s where the nerves are. It’s the triangle of pain.', why: 'A tack below the iliopubic tract laterally can trap a nerve and cause chronic pain.', fxWarn: { nerve: 10 }, fx: { nerve: 45, flag: 'tack_pain', st: { badTack: 'pain' } }, reply: 'You fired one there. Let’s hope the nerve wasn’t in the way.', to: 'fix_tap2' }
      ],
      missSay: 'Not there. Pick a spot on the mesh: Cooper’s, up on the rectus, or laterally above the tract.'
    },
    doom_roll: { roll: [{ p: .5, flag: 'cx_iliac_tack', ev: 'Heavy bleeding from the tack', luck: 'You fired a tack into the triangle of doom and the vessel wasn’t hit. Very lucky.', to: 'b_iliac' }, { p: 1, to: 'fix_tap2' }] },
    fix_tap2: {
      view: 'scene', kind: 'tap', say: 'And one more. Where?', hint: 'Tap where the second tack goes', dt: 2, refs: [155],
      zones: [
        { spot: 'cooper', r: 48, g: 'g', he: 'Cooper’s ligament', refs: [155], fx: addTack('cooper'), reply: 'Good. That’s enough. No need to decorate the mesh with tacks.', to: 'close_pre' },
        { xy: [756, 176], r: 44, g: 'g', he: 'Rectus muscle, above', refs: [155], fx: addTack('medial'), reply: 'Good. That’s enough for us. Fewer tacks, less pain.', to: 'close_pre' },
        { xy: [278, 192], r: 48, g: 'g', he: 'Lateral, above the tract', refs: [155], fx: addTack('lateral-high'), reply: 'Above the tract, nice. We’re done fixing.', to: 'close_pre' },
        { spot: 'doom', r: 46, g: 'b', he: 'Triangle of doom', refs: [155, 177], stop: 'Wait. Stop. That’s the triangle of doom. The iliac vein is underneath.', why: 'A tack in the triangle of doom can injure the external iliac vessels.', fxWarn: { vessel: 10 }, fx: { vessel: 50, st: { badTack: 'doom' } }, reply: 'You fired one there. Now we hope.', to: 'doom_roll2' },
        { spot: 'pain', r: 50, g: 'b', he: 'Triangle of pain', refs: [155, 177], stop: 'Stop. Below the tract, laterally? That’s where the nerves are. It’s the triangle of pain.', why: 'A tack below the iliopubic tract laterally can trap a nerve and cause chronic pain.', fxWarn: { nerve: 10 }, fx: { nerve: 45, flag: 'tack_pain', st: { badTack: 'pain' } }, reply: 'You fired one there. Let’s hope the nerve wasn’t in the way.', to: 'close_pre' }
      ],
      missSay: 'Not there. Cooper’s, the rectus above, or laterally above the tract.'
    },
    doom_roll2: { roll: [{ p: .5, flag: 'cx_iliac_tack', ev: 'Heavy bleeding from the tack', luck: 'You fired a tack into the triangle of doom and the vessel wasn’t hit. Very lucky.', to: 'b_iliac' }, { p: 1, to: 'close_pre' }] },

    /* ======== closing the flap ======== */
    close_pre: { when: [{ if: function (S) { return (S.v.tear || 0) >= 1 && !S.f.tear_fixed; }, to: 'tear_now' }, { if: always, to: 'close' }] },
    tear_now: {
      view: 'scene', say: 'Hold on. The flap has torn near the edge. See the hole? What do we do?', st: { focus: 'flap' }, refs: [178],
      tip: { res: 'Close a peritoneal tear as soon as you see it, before it grows.', nurse: 'An endoloop ready, or a short suture.' },
      opts: [
        { t: 'Close it now, with a stitch or a loop', g: 'g', why: 'Convention: close a peritoneal tear as soon as it is seen.', fx: { flag: 'tear_fixed', tear: -1 }, reply: 'Exactly. A small hole now, a big hole when we close. We close it now.', kw: ['close', 'now'] },
        { t: 'We’ll close everything together at the end', g: 'o', why: 'A tear left for the end tends to grow and be forgotten (convention).', reply: 'You can, if you don’t forget. I’ve seen people forget.', kw: ['end'] },
        { t: 'A small hole, no big deal', g: 'b', refs: [178], why: 'A gap in the peritoneum exposes the mesh to bowel and lets bowel get stuck.', fx: { flag: 'gap' }, reply: 'A small hole is exactly where bowel gets in and gets stuck. We close it.', kw: ['small'] }
      ], to: 'close'
    },
    close: {
      view: 'scene', say: 'Closing the peritoneum. How?', st: { focus: null }, dt: 8, refs: [178],
      tip: { res: 'A running suture at low insufflation pressure, with no holes.', stu: 'The peritoneum covers the mesh and separates it from the bowel.', nurse: 'A barbed running suture, or a regular suture and a needle holder. And the insufflation pressure comes down.', senior: 'Closure is where tired residents get sloppy. Keep them sharp.' },
      opts: [
        { t: 'A running suture at low pressure, no holes', g: 'g', refs: [178], fx: { flag: 'tear_fixed', unflag: 'gap' }, reply: 'Good. Low pressure, and the flap reaches without tension. Check there’s no hole before you tie.', to: 'close_ok', kw: ['running', 'suture', 'low'] },
        { t: 'Clips or tacks along the flap', g: 'o', why: 'Closing with clips leaves gaps (convention).', reply: 'It works, but there are gaps between the clips. Check them well.', to: 'clip_roll', kw: ['clips'] },
        { t: 'At full pressure, no time to lower it', g: 'b', why: 'At high insufflation pressure the peritoneum is tight and tears during closure (convention).', fx: { tear: 1 }, reply: 'See? It tore. At this pressure the peritoneum is as tight as a drum. Lower the pressure.', to: 'close_tear', kw: ['full'] },
        { t: 'We don’t close, the mesh is covered enough', g: 'b', refs: [178], why: 'A gap in the peritoneum exposes the mesh to bowel.', fx: { flag: 'gap' }, reply: 'Exposed mesh, and bowel looking for a hole. Not on my watch. Choose again.', to: 'close', kw: ['covered'] }
      ]
    },
    clip_roll: { roll: [{ p: .25, flag: 'gap', to: 'close_ok' }, { p: 1, to: 'close_ok' }] },
    close_tear: {
      view: 'scene', say: 'It’s torn. Now what?', st: { focus: 'flap' },
      opts: [
        { t: 'Lower the pressure and stitch the tear too', g: 'g', why: 'Convention: low pressure and suture closure of the tear.', fx: { unflag: 'gap', flag: 'tear_fixed' }, reply: 'Good. Low pressure, and the flap relaxes. Now a running suture.', kw: ['lower', 'stitch'] },
        { t: 'Carry on, it’ll hold', g: 'b', refs: [178], why: 'An unclosed tear leaves a gap where bowel can get stuck.', fx: { flag: 'gap' }, reply: 'It won’t hold. But fine, we’ll see what happens.', kw: ['hold'] }
      ], to: 'close_ok'
    },
    close_ok: {
      view: 'scene', kind: 'info', say: 'Closed. The mesh is covered. Now the most important thing is not to get tired at the end.', st: { closed: true, focus: null, zones: false, labels: false }, btn: 'Carry on', to: 'bil_left'
    },
    bil_left: { when: [{ if: function (S) { return S.cs.id === 'bilat' && S.f.both; }, to: 'bil_left_n' }, { if: always, to: 'n_count' }] },
    bil_left_n: {
      view: 'mentor:or', kind: 'info', say: 'The right is done. Now the same story on the left, with the hernia that brought him in. Another half hour.', fx: { t: 30, retention: 10 },
      tip: { nurse: 'A second mesh for the left. Confirm the side out loud.', res: 'A bilateral repair raises the risk of urinary retention.' }, btn: 'Left side done', to: 'n_count'
    },
    n_count: {
      view: 'tray', kind: 'check', for: ['nurse'], skip: 'finish', say: 'Before we close the skin. What did we count, and what did we record?',
      tip: { nurse: 'The mesh is recorded by size, type, side and lot number.' },
      items: [
        { t: 'Needles and swabs', need: 1, miss: 'The needle and swab count. Without it, we don’t close skin.' },
        { t: 'Mesh size, side and lot number', need: 1, miss: 'A mesh without a lot number in the record is a problem if there’s ever a recall.' },
        { t: 'Findings: lipoma, hernia on the other side', need: 1, miss: 'Findings go in the note. Whoever operates on him in the future needs to know.' },
        { t: 'How many tacks were fired' },
        { t: 'Throw away the mesh sticker', no: 1, miss: 'We don’t throw away the mesh sticker. It goes in the chart.' }
      ],
      ok: 'Perfect. A correct count and a complete record.', btn: 'That’s what we did', to: 'finish'
    },
    finish: {
      view: 'wall', say: 'What do we close and check at the end?', dt: 4, refs: [179],
      tip: { res: 'Ports of 10 mm and above get fascial closure.', stu: 'A port-site hernia is a new hernia through a hole we made.', nurse: 'Fascial suture for the umbilicus, and the final count.' },
      opts: [
        { t: 'Ports out under vision, gas out, fascia closed at the 12 mm port', g: 'g', refs: [179], reply: 'Good. Ports of ten millimeters and above get a fascial stitch. That way we won’t see him back with a bulge at the umbilicus.', kw: ['fascia', 'vision'] },
        { t: 'Skin only, the fascia at the umbilicus is small', g: 'b', refs: [163, 179], why: 'Fascial closure is recommended for ports of 10 mm and above; more port-site hernias were reported after TAPP.', fx: { flag: 'fascia_open' }, reply: 'Small enough to catch a loop of bowel. One stitch, two minutes.', kw: ['skin'] },
        { t: 'Take everything out fast, without looking', g: 'o', why: 'A bleeding port is only found in recovery if you don’t look as you take it out (convention).', reply: 'A bleeding port shows up in recovery. Take them out slowly, and look at every hole.', kw: ['fast'] }
      ], to: 'void_r'
    },
    void_r: { when: [{ if: function (S) { return (S.v.retention || 0) >= 20; }, to: 'void_plan' }, { if: always, to: 'opnote' }] },
    void_plan: {
      view: 'mentor:or', say: 'He’s at risk of urinary retention. What do we tell recovery?', refs: [171, 172],
      tip: { res: 'Age, prostate, a bilateral repair and spinal anesthesia raise the risk.', nurse: 'Record when he voids. If he hasn’t within a few hours, a bladder ultrasound.' },
      opts: [
        { t: 'Moderate fluids, up early, and an ultrasound if he doesn’t void', g: 'g', refs: [171, 172], fx: { retention: -10 }, reply: 'Exactly. We don’t flood him with fluids, and we don’t wait ten hours.', kw: ['moderate', 'ultrasound'] },
        { t: 'Lots of fluids, to flush it through', g: 'b', why: 'Excess fluid increases urinary retention (convention).', fx: { retention: 15 }, reply: 'The opposite. The bladder fills fast and doesn’t empty. Moderate fluids.', kw: ['lots'] }
      ], to: 'opnote'
    },
    opnote: {
      view: 'mentor:debrief', say: 'What goes in the op note?', refs: [153],
      tip: { res: 'The hernia type in the European classification, the mesh, the fixation and the findings.', senior: 'A good op note is a gift to the next surgeon. Ask to see it before the resident signs.' },
      opts: [
        { t: 'Mesh and fixation, hernia type by classification, and what we found', g: 'g', refs: [153], reply: 'Good. Whoever operates on him in ten years will thank you.', kw: ['mesh', 'fixation', 'classification'] },
        { t: 'TAPP, no complications', g: 'b', why: 'A note without the mesh, the fixation and the findings doesn’t help whoever treats a recurrence.', reply: 'That’s not an op note, that’s a status update. Whoever sees him with a recurrence needs to know what’s in there.', kw: ['complications'] }
      ], to: 'postop'
    },

    /* ======== after the operation ======== */
    postop: {
      roll: [
        { p: function (S) { return S.f.bladder_missed ? 1 : 0; }, flag: 'cx_po_blad', ev: 'Next morning: blood in the urine', to: 'po_blad' },
        { p: function (S) { return S.f.bowel_missed ? .85 : 0; }, flag: 'cx_po_bowel', ev: 'Next day: tachycardia and pain', to: 'po_bowel' },
        { p: function (S) { return cl((S.v.retention || 0) / 100 - (S.f.catheter ? .05 : 0)); }, flag: 'cx_ret', ev: 'Not passing urine', to: 'po_ret' },
        { p: function (S) { return S.f.gap ? .35 : 0; }, flag: 'cx_obst', ev: 'Day two: bowel obstruction', luck: 'You left a hole in the peritoneum and the bowel didn’t go into it. Lucky.', to: 'po_obst' },
        { p: function (S) { return (S.v.vas || 0) >= 20 ? cl((S.v.vas || 0) / 120) : 0; }, flag: 'cx_testis', ev: 'Swollen testis', luck: 'You pulled hard on the cord and the testis didn’t react. Lucky.', to: 'po_testis' },
        { p: function (S) { return S.cs.id === 'fem' ? 1 : 0; }, to: 'po_fem' },
        { p: 1, to: 'po_ok' }
      ]
    },
    po_ok: {
      view: 'mentor:ward', say: 'Evening. Mild pain, passing urine, walking in the corridor. What now?', refs: [151],
      tip: { res: 'Day surgery, and back to activity when comfortable.', nurse: 'Explain pain relief, constipation, and when to come back to the emergency department.', stu: 'There’s no need for a six-week lifting ban.' },
      opts: [
        { t: 'Home today, back to activity when he’s comfortable', g: 'g', refs: [151], reply: 'Right. Day surgery. No need for six weeks of lifting nothing.', kw: ['home', 'today'] },
        { t: 'Keep him three days for observation', g: 'o', why: 'The guideline recommends day surgery when there is no other reason to stay.', reply: 'What for? At home he’ll walk more and sleep better.', kw: ['three', 'observation'] },
        { t: 'Six weeks without lifting anything', g: 'o', refs: [151], why: 'The guideline recommends returning to activity when comfortable.', reply: 'The guideline says back when comfortable. The old restrictions don’t reduce recurrence.', kw: ['six', 'lifting'] }
      ], to: 'fu6'
    },
    po_fem: {
      view: 'mentor:ward', say: 'Two days later. She’s eating a little, passing gas, no fever. What now?', refs: [175],
      tip: { res: 'After emergency surgery, give the bowel a day or two to show it’s working.', stu: 'In a woman with a groin hernia, always check the femoral opening.' },
      opts: [
        { t: 'Advance the diet, keep her walking, and discharge when she’s eating and feels well', g: 'g', why: 'Convention: discharge after emergency surgery once the bowel is working.', reply: 'Good. And tell her that in a woman we always check the femoral opening. That’s what saved her.', kw: ['diet', 'discharge'] },
        { t: 'Discharge right away, like a planned case', g: 'o', why: 'After emergency surgery for incarcerated bowel, make sure the bowel works before discharge (convention).', reply: 'After incarcerated bowel I want to see her eating. One more day.', kw: ['away', 'planned'] }
      ], to: 'fu6'
    },
    po_ret: {
      view: 'mentor:ward', say: 'Six hours later, he hasn’t passed urine. His lower abdomen is full and sore. What do we do?', refs: [171, 172],
      tip: { res: 'A bladder ultrasound and a catheter.', nurse: 'Bladder scanner and a catheter set.' },
      opts: [
        { t: 'Bladder ultrasound and a catheter', g: 'g', refs: [171, 172], reply: 'Right. Drain it, and usually he’ll pass urine himself once the catheter is out.', to: 'fu6', kw: ['ultrasound', 'catheter'] },
        { t: 'More fluids, and wait', g: 'b', why: 'An overdistended bladder makes retention worse; drain it with a catheter.', reply: 'Wait? His bladder already holds a liter. Every hour of stretching makes it harder for it to recover.', to: 'po_ret2', kw: ['wait'] }
      ]
    },
    po_ret2: {
      view: 'mentor:ward', say: 'Two hours later. He’s in a lot of pain, writhing in bed.',
      opts: [{ t: 'Catheter now', g: 'g', refs: [172], reply: 'Yes. A liter and a hundred came out. He’s already smiling.', kw: ['catheter'] }], to: 'fu6'
    },
    po_blad: {
      view: 'mentor:ward', say: 'Next morning. Blood in the urine, lower abdominal pain, and the creatinine has gone up. What are you thinking?',
      tip: { res: 'Unrecognized bladder injury: bladder imaging with contrast.', nurse: 'The catheter stays. Measure urine output.' },
      opts: [
        { t: 'An unrecognized bladder injury. Cystogram, catheter and urology', g: 'g', why: 'Convention: cystography, or CT with bladder contrast, when an injury is suspected.', reply: 'Yes. And it ties in with the clear fluid we saw in the OR. Next time, we stop and check.', kw: ['bladder', 'urology', 'cystogram'] },
        { t: 'It’s from the catheter, carry on', g: 'b', why: 'Blood in the urine and a rising creatinine after pelvic surgery need investigating.', reply: 'Blood and a rising creatinine aren’t the catheter. We need to look at the bladder.', kw: ['catheter'] }
      ], to: 'fu6'
    },
    po_bowel: {
      view: 'mentor:ward', say: 'The next day. Heart rate one hundred and eighteen, pain all over the abdomen, far more than expected. What do we do?', refs: [163],
      tip: { res: 'Disproportionate pain after laparoscopy is bowel until proven otherwise.', nurse: 'Vital signs every hour, and report immediately.' },
      opts: [
        { t: 'CT, and usually back to the OR', g: 'g', refs: [163], why: 'Convention: a suspected bowel injury after laparoscopy needs immediate workup.', reply: 'Right. Disproportionate pain after laparoscopy is bowel until proven otherwise.', to: 'po_bowel_or', kw: ['ct', 'back'] },
        { t: 'Pain relief, and we’ll see tomorrow', g: 'b', why: 'An unrecognized bowel injury shows up as disproportionate pain and tachycardia; delay is life-threatening.', reply: 'Tomorrow he’ll be in intensive care. CT now.', to: 'po_bowel2', kw: ['tomorrow'] }
      ]
    },
    po_bowel2: { kind: 'info', view: 'img:ct', cap: 'CT: free air in the abdomen', say: 'Overnight he became septic. Free air on the CT. To the OR, now.', fx: { hemo: 1 }, btn: 'To the OR', to: 'po_bowel_or' },
    po_bowel_or: {
      view: 'mentor:tense', kind: 'info', say: 'In the OR we find the perforation, repair it and wash out. The mesh? It will probably have to come out later.', st: { closed: false }, fx: { flag: ['contaminated', 'cx_bowel_late'] },
      tip: { senior: 'This is the time to talk about disclosure. Tell the family, honestly and simply.' }, btn: 'Carry on', to: 'fu6'
    },
    po_obst: {
      view: 'mentor:ward', say: 'Two days later. A distended abdomen, vomiting, no gas. What do we do?', refs: [178],
      tip: { res: 'A peritoneal gap after TAPP: bowel can slip between the mesh and the peritoneum.', nurse: 'Nasogastric tube, fluids, and prepare for the OR.' },
      opts: [
        { t: 'CT, then back in to free the bowel and close the hole', g: 'g', refs: [178], reply: 'Yes. Bowel that’s gone into a peritoneal hole doesn’t come out by itself. Free it, and close.', to: 'fu6', kw: ['ct', 'back'] },
        { t: 'Nasogastric tube and conservative treatment', g: 'b', why: 'Obstruction from bowel caught in a peritoneal gap usually needs surgery (convention).', reply: 'Obstruction after TAPP, with a hole in the peritoneum? That’s not an ileus. CT now.', to: 'po_obst2', kw: ['conservative', 'nasogastric'] }
      ]
    },
    po_obst2: { kind: 'info', view: 'img:ct', cap: 'CT: closed loop between the mesh and the peritoneum', say: 'Overnight the pain became constant. The CT shows a closed loop between the mesh and the peritoneum. We go to the OR, quickly.', fx: { hemo: 1 }, btn: 'To the OR', to: 'fu6' },
    po_testis: {
      view: 'mentor:ward', say: 'Two days later. The testis on that side is swollen and painful, with a low-grade fever. What do we do?', refs: [178, 181],
      tip: { res: 'Ischemic orchitis: Doppler, pain relief and follow-up.', stu: 'The venous drainage of the testis runs in the cord. Over-dissect the cord and you damage it.' },
      opts: [
        { t: 'Doppler, pain relief and follow-up', g: 'g', refs: [181], reply: 'Right. It’s usually venous congestion, and it settles. It happens when the cord is over-dissected.', kw: ['doppler'] },
        { t: 'Back to the OR to check', g: 'b', why: 'In orchitis after hernia repair, treatment is usually conservative, with Doppler and follow-up (convention).', reply: 'Without a Doppler? No. Most cases settle with conservative treatment.', kw: ['or', 'check'] },
        { t: 'It’s normal, home without follow-up', g: 'o', why: 'The possible end result is testicular atrophy; follow-up is needed.', reply: 'Most of the time it settles. But without follow-up we won’t know if the testis is atrophying.', kw: ['normal'] }
      ], to: 'fu6'
    },

    /* ======== follow-up: the price of decisions comes months later ======== */
    fu6: {
      roll: [
        { p: function (S) { return S.f.aborted || S.f.nomesh ? 0 : S.f.fascia_open ? .25 : .01; }, flag: 'cx_port', ev: 'Port-site hernia', luck: 'You didn’t close the fascia and no port-site hernia formed. Lucky.', to: 'fu_port' },
        { p: function (S) { return S.f.aborted || S.f.nomesh ? 0 : cl((S.v.seroma || 0) / 100); }, flag: 'cx_seroma', ev: 'Swelling in the groin', to: 'fu_seroma' },
        { p: function (S) { return S.f.contaminated && !S.f.nomesh && !S.f.aborted ? .2 + (S.v.infect || 0) / 100 : 0; }, flag: 'cx_infect', ev: 'Mesh infection', to: 'fu_infect' },
        { p: 1, to: 'fu12' }
      ]
    },
    fu_seroma: {
      view: 'mentor:ward', say: 'A week later. A soft, painless swelling in the groin. He’s sure it’s come back.',
      tip: { res: 'Most seromas resolve on their own. Ultrasound tells fluid from recurrence.', stu: 'A seroma is fluid that collects where the sac used to be.' },
      opts: [
        { t: 'Examine, ultrasound if in doubt, reassure, and don’t aspirate', g: 'g', why: 'Convention: follow-up and explanation, with no routine aspiration.', reply: 'Good. Most seromas resolve on their own. A needle brings bacteria into the mesh.', to: 'fu12', kw: ['ultrasound', 'reassure'] },
        { t: 'Aspirate it in clinic, so he feels better', g: 'b', why: 'Routine aspiration of a seroma risks infecting the mesh (convention).', reply: 'He’ll feel better for a week. And if you’ve put bacteria into the mesh, he’ll feel bad for six months.', to: 'fu_asp', kw: ['aspirate'] },
        { t: 'Straight to the OR, it’s come back', g: 'b', why: 'A swelling a week later is usually a seroma; ultrasound tells them apart.', reply: 'A recurrence after a week? It’s almost always fluid. Ultrasound tells them apart.', to: 'fu12', kw: ['or', 'straight'] }
      ]
    },
    fu_asp: { roll: [{ p: .15, flag: 'cx_infect', ev: 'Infection after aspiration', to: 'fu_infect' }, { p: 1, to: 'fu12' }] },
    fu_infect: {
      view: 'img:us', cap: 'Ultrasound: a collection around the mesh', say: 'Fever and redness in the groin. The ultrasound shows a collection around the mesh. What do we do?',
      tip: { res: 'Drainage and antibiotics, and if it doesn’t settle, mesh removal.' },
      opts: [
        { t: 'Drainage and antibiotics, and if it doesn’t settle, remove the mesh', g: 'g', why: 'Convention: try to save the mesh before removing it.', reply: 'Right. We try to save it. Sometimes there’s no choice, and it comes out.', kw: ['drainage', 'drain'] },
        { t: 'Oral antibiotics only', g: 'o', why: 'A collection around a mesh doesn’t resolve with antibiotics alone (convention).', reply: 'A collection doesn’t disappear with tablets. It needs drainage.', kw: ['oral', 'tablets'] }
      ], to: 'fu12'
    },
    fu_port: {
      view: 'wall', say: 'Six months later. A painful bulge at the umbilicus, and vomiting since this morning. What do we do?', refs: [179], st: { scars: [] },
      tip: { res: 'A port-site hernia with vomiting: a small opening tends to strangulate bowel.' },
      opts: [
        { t: 'CT and urgent surgery', g: 'g', refs: [179], reply: 'Exactly. The small openings are the most dangerous. And this is what happens when the fascia isn’t closed.', kw: ['ct', 'urgent'] },
        { t: 'Reduce it by hand and send him home', g: 'b', refs: [179], why: 'A port-site hernia with vomiting is incarcerated bowel until proven otherwise.', reply: 'With vomiting? That’s stuck bowel. We don’t reduce it and send him home.', kw: ['reduce', 'home'] }
      ], to: 'fu12'
    },
    fu12: {
      roll: [
        { p: function (S) { return S.f.missed_lipoma ? .8 : 0; }, flag: 'cx_lip', ev: 'A bulge and pain three months later', luck: 'You left the lipoma and it hasn’t bothered him yet. Not yet.', to: 'fu_lip' },
        { p: function (S) { return S.cs.id === 'bilat' && (S.f.missed_contra || S.f.skip_survey) ? .6 : 0; }, flag: 'cx_contra', ev: 'A bulge on the other side', to: 'fu_contra' },
        { p: function (S) { return S.f.tack_pain ? .7 : cl((S.v.nerve || 0) / 150); }, flag: 'cx_pain', ev: 'Burning pain in the thigh', luck: 'You fired a tack into the triangle of pain and the nerve was spared. Lucky.', to: 'fu_pain' },
        { p: function (S) { return S.f.aborted || S.f.nomesh ? .08 : cl((S.v.recur || 0) / 100 + (S.f.fold ? .3 : 0) + (S.f.hematoma ? .1 : 0)); }, flag: 'cx_recur', ev: 'The hernia came back', luck: 'You had reasons for a recurrence and it didn’t come. Yet.', to: 'fu_recur' },
        { p: 1, to: 'fu_ok' }
      ]
    },
    fu_lip: {
      view: 'img:us', cap: 'Ultrasound: a lump of fat in the canal, no sac', say: 'Three months later. A bulge and pain on the same side. The ultrasound shows a lump of fat in the canal, and no sac. What is it?', refs: [183],
      tip: { res: 'A missed lipoma behaves like a recurrence.' },
      opts: [
        { t: 'The lipoma we left. We take it out', g: 'g', refs: [183], reply: 'Yes. It’s not a recurrence, it’s the fat we left. It comes out, and the pain goes away.', kw: ['lipoma'] },
        { t: 'A recurrence. A new mesh from the front', g: 'o', refs: [183], why: 'There’s no sac: it’s the lipoma that was left, not a recurrence.', reply: 'It looks like a recurrence, but there’s no sac. It’s the fat from the canal.', kw: ['recurrence'] },
        { t: 'It’s nothing, pain relief', g: 'b', refs: [183], why: 'A cord lipoma left behind keeps causing symptoms until it is removed.', reply: 'He’s already been back twice. In the end someone will take out the fat, and the pain will go.', kw: ['nothing'] }
      ], to: 'end'
    },
    fu_contra: {
      view: 'mentor:ward', say: 'A year later. A bulge on the right, with symptoms. Was it already there at the operation?', refs: [151],
      opts: [
        { t: 'Probably, yes. We own it and repair it', g: 'g', refs: [151], reply: 'Right. And next time we look at the other side. It’s free.', kw: ['own', 'probably'] },
        { t: 'It’s a new hernia, unrelated', g: 'o', refs: [151], why: 'In TAPP you check the other side; an occult hernia is found at survey.', reply: 'Maybe. But whoever looked inside would have known. In TAPP we check both sides.', kw: ['new'] }
      ], to: 'end'
    },
    fu_pain: {
      view: 'mentor:ward', say: 'Three months later. A burning pain in the outer thigh, worse when he walks. What do we do?', refs: [151, 168, 169, 170],
      tip: { res: 'Significant chronic pain occurs in 10 to 12 percent, and decreases with time.', stu: 'Burning pain in the outer thigh fits the lateral femoral cutaneous nerve.', senior: 'Worth asking what his risk was before the operation: young age and previous pain.' },
      opts: [
        { t: 'We fired a tack in the triangle of pain. Consider removing it', when: F('tack_pain'), g: 'g', why: 'Convention: pain that fits a nerve, after a tack in a danger zone, justifies early removal.', reply: 'Right. When it fits a nerve and there’s a tack in the wrong place, we don’t wait a year.', kw: ['tack', 'removing'] },
        { t: 'Multidisciplinary care, medication and blocks, surgery only after a year', g: 'g', refs: [151, 169, 170], reply: 'Right. Most pain improves with time. Nerve surgery, not before a year.', kw: ['multidisciplinary', 'medication', 'blocks'] },
        { t: 'Neurectomy now', g: 'b', refs: [169], why: 'Surgery for chronic pain after hernia repair is recommended no earlier than a year, and after conservative treatment.', reply: 'Too early. First, a year of treatment. Surgery only when everything else has failed.', kw: ['neurectomy'] }
      ], to: 'end'
    },
    fu_recur: {
      view: 'mentor:ward', say: 'A year later. The bulge is back, on the same side. What do we do?', refs: [151, 167],
      tip: { res: 'Recurrence after a posterior repair: go anterior. And think about why: the mesh, a fold, the dissection.', senior: 'Go through the video of the operation with the resident, if there is one. That’s how you learn from a recurrence.' },
      opts: [
        { t: 'Anterior repair, Lichtenstein, in virgin tissue', g: 'g', refs: [151], reply: 'Right. After posterior, go anterior. And why did it come back? The mesh, a fold, the dissection. We’ll talk about it.', kw: ['anterior', 'lichtenstein'] },
        { t: 'TAPP again, it’ll work for me', g: 'b', refs: [151], why: 'After a posterior repair the guideline recommends an anterior approach.', reply: 'Through the same scar, from behind? Only for an expert. After posterior, we go in from the front.', kw: ['again', 'tapp'] }
      ], to: 'end'
    },
    fu_ok: { kind: 'info', view: 'mentor:ward', say: 'A year later. He jogs in for his follow-up. No pain, no bulge.', btn: 'To the debrief', to: 'end' },

    end: { end: true }
  };

  /* ---------- outcome and debrief ---------- */
  function outcome(S) {
    var f = S.f, bad = [], warn = [], ok = [];
    if (f.iliac_inj || (S.v.hemo || 0) >= 2) bad.push('Life-threatening bleeding in the OR');
    if (f.cx_po_bowel || f.cx_bowel_late) bad.push('Bowel injury found late');
    if (f.cx_po_blad) bad.push('Bladder injury found after the operation');
    if (f.cx_iliac && !f.iliac_inj) warn.push('Major vessel bleeding, controlled with help');
    if (f.cx_recur) warn.push('The hernia came back within a year');
    if (f.cx_lip) warn.push('A lipoma left behind that looked like a recurrence');
    if (f.cx_pain) warn.push('Chronic pain after the operation');
    if (f.cx_port) warn.push('Port-site hernia');
    if (f.cx_obst) warn.push('Bowel obstruction through a peritoneal gap');
    if (f.cx_infect) warn.push('Mesh infection');
    if (f.cx_contra) warn.push('A missed hernia on the other side');
    if (f.cx_testis) warn.push('Orchitis after the operation');
    if (f.cx_bladder && !f.cx_po_blad) warn.push('Bladder injury recognized and repaired');
    if (f.cx_bowel && !f.cx_po_bowel && !f.cx_bowel_late) warn.push('Bowel injury recognized and repaired');
    if (f.cx_ret) ok.push('Urinary retention, treated');
    if (f.cx_seroma) ok.push('A seroma that resolved');
    if (f.cx_corona || f.cx_epi) ok.push('Bleeding controlled');
    if (bad.length) return { he: bad.concat(warn).slice(0, 2).join(' · '), tone: 'bad' };
    if (warn.length) return { he: warn.slice(0, 2).join(' · '), tone: 'warn' };
    if (f.aborted) return { he: 'Repair postponed after a bowel injury, and the patient is safe', tone: 'ok' };
    return { he: ok.length ? 'A good operation · ' + ok.slice(0, 2).join(' · ') : 'A clean operation and a year without problems', tone: 'ok' };
  }
  function closing(S, out) {
    var f = S.f;
    if (f.iliac_inj) return 'I’m not angry. But in the triangle of doom there’s only one rule: pressure, and help. Next time your hands will do it on their own.';
    if (f.cx_po_bowel || f.cx_po_blad || f.cx_bowel_late) return 'The injury itself happens to everyone. What made the difference is that we didn’t stop to check in the OR. From now on, anything odd in the field stops you.';
    if (f.cx_recur || f.cx_lip) return 'The recurrence was born in the OR: the dissection, the mesh, or fat left behind. The critical view exists exactly for that. Next time, the mesh doesn’t go in until everything is there.';
    if (f.cx_pain && f.tack_pain) return 'One tack below the tract, and three months of pain. That’s the price. Above the tract, on Cooper’s, or no fixation at all.';
    if (f.mpo_partial) return 'The operation went well, but you missed items in the critical view. Learn the list by heart. It saves recurrences.';
    if (out.tone === 'warn') return 'Not everything is in our hands. But go through the decisions below, and see where the risk crept in.';
    return 'Nice work. Landmarks before the knife, the critical view before the mesh, and a big flat mesh. That’s how you do it, every time.';
  }
  function safety(S) {
    var v = S.v, f = S.f;
    var s = 100 - .22 * ((v.bladder || 0) + (v.vessel || 0) + (v.nerve || 0) + (v.vas || 0)) - .3 * (v.recur || 0) - (v.bleed || 0) * 8 - (v.hemo || 0) * 12;
    if (f.bowel_missed) s -= 25;
    if (f.bladder_missed) s -= 20;
    if (f.iliac_inj) s -= 25;
    if (f.gap) s -= 8;
    if (f.fold) s -= 8;
    if (f.missed_lipoma) s -= 6;
    if (f.mpo_partial) s -= 5;
    return s;
  }

  O.liveCase('inguinal-hernia', {
    title: 'Laparoscopic inguinal hernia repair (TAPP)', proc: 'inguinal-hernia', scene: 'groin',
    mentor: { name: 'James', init: 'J', role: 'Attending surgeon · your mentor' },
    hello: 'Hi, I’m James. We have an inguinal hernia today. Pick a case, and we’ll go and see the patient before the OR.',
    base: { defect: 'L', size: 2, content: null, incarc: false, flap: 0, mesh: 0, tacks: [], badTack: null, closed: false, bleed: 0, zones: false, labels: true, focus: null, corona: false, habitus: 'normal', scars: [] },
    cases: [
      { id: 'prim', he: 'Primary indirect hernia', story: 'Daniel, 52, a bulge on the right that aches at the end of a working day.', lvl: 'Basic', chart: { hx: ['Bulge on the right that aches at the end of a working day and goes back in by itself', 'Physical job', 'No previous abdominal surgery'], labs: [['Hemoglobin', '14.6'], ['Platelets', '240'], ['INR', '1.0']], img: 'No imaging needed: the diagnosis is clinical' }, st: { defect: 'L', size: 2 }, v: { recur: 4, retention: 5, seroma: 5 } },
      { id: 'bilat', he: 'Left, and maybe right too', story: 'Mark, 63, a left inguinal hernia and an enlarged prostate.', lvl: 'Intermediate', chart: { hx: ['Left inguinal hernia that bothers him', 'Enlarged prostate, gets up at night to pass urine'], labs: [['Hemoglobin', '14.1'], ['Creatinine', '1.0'], ['INR', '1.0']] }, st: { defect: 'none', size: 1 }, v: { recur: 4, retention: 25, seroma: 5 } },
      { id: 'recur', he: 'Recurrent after open repair', story: 'Tom, 67, a recurrent hernia on the right, six years after a Lichtenstein repair.', lvl: 'Intermediate', chart: { hx: ['Right Lichtenstein repair six years ago', 'Recurrent bulge on the same side'], labs: [['Hemoglobin', '13.8'], ['Creatinine', '1.1'], ['INR', '1.0']] }, st: { defect: 'M', size: 2 }, v: { recur: 8, retention: 12, seroma: 8 } },
      { id: 'm3', he: 'Giant direct hernia', story: 'Peter, 71, a large direct hernia that goes down into the scrotum.', lvl: 'Advanced', chart: { hx: ['Large direct hernia that goes down into the scrotum', 'Hypertension', 'Mild chronic obstructive pulmonary disease'], labs: [['Hemoglobin', '13.2'], ['Creatinine', '1.2'], ['INR', '1.0']] }, st: { defect: 'M', size: 3, content: 'omentum' }, v: { recur: 8, retention: 15, seroma: 30, bladder: 10 } },
      { id: 'fem', he: 'Incarcerated femoral hernia', story: 'Susan, 58, a painful groin lump that won’t go back in, and vomiting.', lvl: 'Urgent', chart: { hx: ['Painful lump below the inguinal ligament that won’t go back in', 'Vomiting since this morning'], labs: [['White cell count', '13.4', 1], ['Lactate', '2.4', 1], ['Sodium', '134', 1], ['Creatinine', '1.1']] }, st: { defect: 'F', size: 2, content: 'bowel', incarc: true }, v: { recur: 4, retention: 10, seroma: 5 } }
    ],
    start: 'v1',
    safety: safety, outcome: outcome, closing: closing,
    nodes: nodes
  });
})();
