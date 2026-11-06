/* ORBIT live case: laparoscopic appendectomy with James, an attending who operates with you, from the ER at night to the follow-up clinic.
   Clinical map: orbit/research/appendix-branching.md (5 cases, 14 decision points, 12 complication branches, refs 101-130).
   Everything is fictional. No patient data of any kind. Conventions without a verified source are marked "convention". */
(function () {
  'use strict';
  var O = window.ORBIT;

  Object.assign(O.refs = O.refs || {}, {
    101: { a: 'Di Saverio S', y: 2020, j: 'World J Emerg Surg', t: 'Diagnosis and treatment of acute appendicitis: 2020 update of the WSES Jerusalem guidelines', u: 'https://pubmed.ncbi.nlm.nih.gov/32295644/' },
    102: { a: 'Gorter RR', y: 2016, j: 'Surg Endosc', t: 'Diagnosis and management of acute appendicitis. EAES consensus development conference 2015', u: 'https://pubmed.ncbi.nlm.nih.gov/27660247/' },
    103: { a: 'Kumar SS', y: 2024, j: 'Surg Endosc', t: 'SAGES guideline for the diagnosis and treatment of appendicitis', u: 'https://pubmed.ncbi.nlm.nih.gov/38740595/' },
    104: { a: 'Kumar SS', y: 2024, j: 'Surg Endosc', t: 'SAGES guidelines for the use of laparoscopy during pregnancy', u: 'https://pubmed.ncbi.nlm.nih.gov/38700549/' },
    105: { a: 'CODA Collaborative', y: 2020, j: 'N Engl J Med', t: 'A Randomized Trial Comparing Antibiotics with Appendectomy for Appendicitis', u: 'https://pubmed.ncbi.nlm.nih.gov/33017106/' },
    106: { a: 'Salminen P', y: 2015, j: 'JAMA', t: 'Antibiotic Therapy vs Appendectomy for Treatment of Uncomplicated Acute Appendicitis: The APPAC Randomized Clinical Trial', u: 'https://pubmed.ncbi.nlm.nih.gov/26080338/' },
    107: { a: 'Salminen P', y: 2018, j: 'JAMA', t: 'Five-Year Follow-up of Antibiotic Therapy for Uncomplicated Acute Appendicitis in the APPAC Randomized Clinical Trial', u: 'https://pubmed.ncbi.nlm.nih.gov/30264120/' },
    108: { a: 'Sawyer RG', y: 2015, j: 'N Engl J Med', t: 'Trial of short-course antimicrobial therapy for intraabdominal infection', u: 'https://pubmed.ncbi.nlm.nih.gov/25992746/' },
    109: { a: 'de Wijkerslooth EML', y: 2023, j: 'Lancet', t: '2 days versus 5 days of postoperative antibiotics for complex appendicitis: a pragmatic, open-label, multicentre, non-inferiority randomised trial', u: 'https://pubmed.ncbi.nlm.nih.gov/36669519/' },
    110: { a: 'St Peter SD', y: 2012, j: 'Ann Surg', t: 'Irrigation versus suction alone during laparoscopic appendectomy for perforated appendicitis: a prospective randomized trial', u: 'https://pubmed.ncbi.nlm.nih.gov/22964730/' },
    111: { a: 'Jaschinski T', y: 2018, j: 'Cochrane Database Syst Rev', t: 'Laparoscopic versus open surgery for suspected appendicitis', u: 'https://pubmed.ncbi.nlm.nih.gov/30484855/' },
    112: { a: 'Li Z', y: 2021, j: 'Cochrane Database Syst Rev', t: 'Abdominal drainage to prevent intra-peritoneal abscess after appendectomy for complicated appendicitis', u: 'https://pubmed.ncbi.nlm.nih.gov/34402522/' },
    113: { a: 'Alvarado A', y: 1986, j: 'Ann Emerg Med', t: 'A practical score for the early diagnosis of acute appendicitis', u: 'https://pubmed.ncbi.nlm.nih.gov/3963537/' },
    114: { a: 'Andersson M', y: 2008, j: 'World J Surg', t: 'The appendicitis inflammatory response score: a tool for the diagnosis of acute appendicitis that outperforms the Alvarado score', u: 'https://pubmed.ncbi.nlm.nih.gov/18553045/' },
    115: { a: 'Sammalkorpi HE', y: 2014, j: 'BMC Gastroenterol', t: 'A new adult appendicitis score improves diagnostic accuracy of acute appendicitis--a prospective study', u: 'https://pubmed.ncbi.nlm.nih.gov/24970111/' },
    116: { a: 'RIFT Study Group', y: 2020, j: 'Br J Surg', t: 'Evaluation of appendicitis risk prediction models in adults with suspected appendicitis', u: 'https://pubmed.ncbi.nlm.nih.gov/31797357/' },
    117: { a: 'Bhangu A', y: 2015, j: 'Lancet', t: 'Acute appendicitis: modern understanding of pathogenesis, diagnosis, and management', u: 'https://pubmed.ncbi.nlm.nih.gov/26460662/' },
    118: { a: 'Carr NJ', y: 2016, j: 'Am J Surg Pathol', t: 'A Consensus for Classification and Pathologic Reporting of Pseudomyxoma Peritonei and Associated Appendiceal Neoplasia (PSOGI)', u: 'https://pubmed.ncbi.nlm.nih.gov/26492181/' },
    119: { a: 'Govaerts K', y: 2021, j: 'Eur J Surg Oncol', t: 'Appendiceal tumours and pseudomyxoma peritonei: Literature review with PSOGI/EURACAN clinical practice guidelines for diagnosis and treatment', u: 'https://pubmed.ncbi.nlm.nih.gov/32199769/' },
    120: { a: 'Pape UF', y: 2016, j: 'Neuroendocrinology', t: 'ENETS Consensus Guidelines for Neuroendocrine Neoplasms of the Appendix (Excluding Goblet Cell Carcinomas)', u: 'https://pubmed.ncbi.nlm.nih.gov/26730583/' },
    121: { a: 'Mällinen J', y: 2019, j: 'JAMA Surg', t: 'Risk of Appendiceal Neoplasm in Periappendicular Abscess in Patients Treated With Interval Appendectomy vs Follow-up With Magnetic Resonance Imaging (Peri-APPAC)', u: 'https://pubmed.ncbi.nlm.nih.gov/30484824/' },
    122: { a: 'Cheng Y', y: 2017, j: 'Cochrane Database Syst Rev', t: 'Early versus delayed appendicectomy for appendiceal phlegmon or abscess', u: 'https://pubmed.ncbi.nlm.nih.gov/28574593/' },
    123: { a: 'McGory ML', y: 2007, j: 'J Am Coll Surg', t: 'Negative appendectomy in pregnant women is associated with a substantial risk of fetal loss', u: 'https://pubmed.ncbi.nlm.nih.gov/17903726/' },
    124: { a: 'Enzerra MD', y: 2020, j: 'AJR Am J Roentgenol', t: 'Stump Appendicitis: Clinical and CT Findings', u: 'https://pubmed.ncbi.nlm.nih.gov/33021832/' },
    125: { a: 'Kumar A', y: 2024, j: 'Surgery', t: 'Comparison of polymeric clip and endoloop in laparoscopic appendectomy: A systematic review and meta-analysis', u: 'https://pubmed.ncbi.nlm.nih.gov/39181723/' },
    126: { a: 'Shaikh FM', y: 2015, j: 'J Laparoendosc Adv Surg Tech A', t: 'Management of appendiceal stump in laparoscopic appendectomy--clips or ligature: a systematic review and meta-analysis', u: 'https://pubmed.ncbi.nlm.nih.gov/25548964/' },
    127: { a: 'Yagnik VD', y: 2024, j: 'Clin Exp Gastroenterol', t: 'Should an Incidental Meckel Diverticulum Be Resected? A Systematic Review', u: 'https://pubmed.ncbi.nlm.nih.gov/38736719/' },
    128: { a: 'Sammalkorpi HE', y: 2017, j: 'World J Emerg Surg', t: 'Performance of imaging studies in patients with suspected appendicitis after stratification with adult appendicitis score', u: 'https://pubmed.ncbi.nlm.nih.gov/28163774/' },
    129: { a: 'Tamini N', y: 2020, j: 'Eur J Trauma Emerg Surg', t: 'Morbidity after negative appendectomy: a single-centre experience on 627 cases', u: 'https://pubmed.ncbi.nlm.nih.gov/31041486/' },
    130: { a: 'Albdah A', y: 2021, j: 'Int J Surg Case Rep', t: 'Benefits of conservative management of a retained appendicolith after laparoscopic appendectomy: A case series', u: 'https://pubmed.ncbi.nlm.nih.gov/33957399/' }
  });

  /* small helpers for routing */
  function cs(id) { return function (S) { return S.cs.id === id; }; }
  function has(f) { return function (S) { return !!S.f[f]; }; }
  function not(f) { return function (S) { return !S.f[f]; }; }
  function gr(S) { return S.v.grade || 0; }
  function dev(S) { return S.f.dev_stap ? 'stapler' : S.f.dev_clips ? 'clips' : 'loops'; }

  O.liveCase('appendectomy', {
    title: 'Laparoscopic appendectomy',
    proc: 'appendectomy',
    scene: 'appendix',
    ai: 'appendix',
    mentor: { name: 'James', init: 'J', role: 'Attending surgeon · your mentor' },
    hello: 'Hello, doctor. I’m James, and I’m on call with you tonight. We’ve got appendicitis waiting in the ER. Which case do you want to take?',
    base: { variant: 'pelvic', inflam: 1, omentum: false, exposed: false, meso: 0, base: null, cut: false, stump: 'ok', bleed: 0, pus: false, danger: false, taenia: false, female: false, meckel: false, labels: false, focus: null },
    cases: [
      { id: 'simple', he: 'Man, 23, migrating pain', story: 'Pain for 18 hours that started at the navel and moved to the right lower quadrant. Low-grade fever.', lvl: 'Basic', chart: { hx: ['18 hours of pain that started at the navel and moved to the right lower quadrant', 'Temperature 37.9, nausea and loss of appetite', 'Previously healthy'], labs: [['WBC', '14.0', 1], ['Neutrophils', '84%', 1], ['CRP', '48', 1]] }, st: { inflam: 1 }, v: { grade: 1 } },
      { id: 'perf', he: 'Man, 34, three days', story: 'Fever of 38.9 and an abdomen tender down to the pelvis. CT already done.', lvl: 'Advanced', chart: { hx: ['Three days of pain at home', 'Temperature 38.9, heart rate 104', 'Abdomen tender down to the pelvis'], labs: [['WBC', '18.6', 1], ['CRP', '240', 1], ['Lactate', '1.6']], img: 'CT: perforation, fecalith and a 2 cm pelvic collection' }, st: { inflam: 3, pus: true, omentum: true }, v: { grade: 3 }, f: ['fecalith', 'necbase'] },
      { id: 'retro', he: 'Man, 41, flank pain', story: 'BMI 34, pain in the right side and flank, a little blood in the urine.', lvl: 'Intermediate', chart: { hx: ['BMI 34', 'Pain in the right side and flank', 'No previous kidney stones'], labs: [['WBC', '13.2', 1], ['CRP', '85', 1], ['Urine red cells', '5-10', 1], ['Creatinine', '0.9']] }, st: { variant: 'retrocecal', inflam: 2 }, v: { grade: 2 }, f: ['retro'] },
      { id: 'woman', he: 'Woman, 27, right-sided pain', story: 'A full day of right lower quadrant pain and nausea. Last period uncertain.', lvl: 'Intermediate', chart: { hx: ['A full day of right lower quadrant pain and nausea', 'Last menstrual period uncertain'], labs: [['WBC', '11.8', 1], ['CRP', '30', 1], ['Urinalysis', 'Normal']] }, st: { female: true, inflam: 1 }, v: { grade: 1 }, f: ['female'] },
      { id: 'elder', he: 'Woman, 71, right lower mass', story: 'Nine days of pain and a tender mass in the right lower quadrant.', lvl: 'Advanced', chart: { hx: ['Nine days of pain', 'Tender mass in the right lower quadrant', 'Hypertension'], labs: [['WBC', '13.5', 1], ['CRP', '120', 1], ['Hemoglobin', '11.9', 1]] }, st: { female: true, inflam: 1 }, v: { grade: 1 }, f: ['female'] }
    ],
    start: 'er',

    safety: function (S) { return 100 - (S.v.risk || 0); },

    outcome: function (S) {
      var f = S.f;
      if (f.ureterinj || f.entmiss_late || f.relook || f.mucinspill || f.missedtor) return { he: 'The patient made it, but the hard way', tone: 'bad' };
      if (f.ev_bleed || f.ev_stump || f.ev_iaa || f.ev_ssi || f.ev_ent || f.ev_entlate || f.ev_burn || f.ev_hernia || f.ev_fec || f.ev_stumpapp || f.nomfail) return { he: 'A good ending, with a complication on the way', tone: 'warn' };
      if (f.nomok) return { he: 'Treated without surgery, and home', tone: 'ok' };
      if (f.conservative) return { he: 'Sound conservative treatment and follow-up', tone: 'ok' };
      return { he: 'A clean operation and a smooth recovery', tone: 'ok' };
    },

    closing: function (S, out) {
      if (out.tone === 'bad') return 'This is a case you remember. Not because of luck, because of decisions. Go back over the moments I stopped you. That’s where the lesson is.';
      if (out.tone === 'warn') return 'Complications happen to good surgeons too. What matters is that you recognized it quickly and treated it well. And ask yourself whether you took a risk you could have avoided.';
      if (S.f.nomok) return 'Not every appendicitis needs an operating room. A good conversation with the patient is surgery too.';
      return 'Very nice. A short, quiet operation, and that’s exactly what we wanted. Next time I’ll just hold the camera.';
    },

    nodes: {
      /* ================= ER and corridor ================= */
      er: {
        kind: 'info', view: 'mentor:corridor', btn: 'Let’s go',
        say: 'Hello, doctor. We’ve got appendicitis in the ER. Let’s go and see the patient together.',
        when: [
          { if: cs('perf'), to: 'p_er' },
          { if: cs('retro'), to: 'r_er' },
          { if: cs('woman'), to: 'w_er' },
          { if: cs('elder'), to: 'e_er' }
        ],
        to: 's_er'
      },

      /* ---- simple ---- */
      s_er: {
        view: 'mentor:corridor', dt: 10,
        say: 'Hello, doctor. We’ve got appendicitis in the ER. He’s twenty-three, with pain that moved from the navel down to the right lower quadrant. What’s the first thing you do?',
        tip: { res: 'A classic story isn’t a diagnosis. Examine, send labs, calculate a score, and only then decide on imaging.', stu: 'Pain that migrates from the navel to the right lower quadrant is a well-known sign. Think about why: visceral innervation first, then peritoneal irritation.', nurse: 'In the ER: nil by mouth, IV fluids, pain relief. Analgesia doesn’t mask the exam.', senior: 'Let them take the history on their own. Just listen.' },
        opts: [
          { t: 'Physical exam, blood count and CRP, then a score', g: 'g', to: 's_score', refs: [101], reply: 'Good. That’s how we start. Let’s see what comes out.', kw: ['exam', 'score', 'labs', 'count'] },
          { t: 'Straight to CT, so nothing gets missed', g: 'o', to: 's_score', fx: { rad: 2, risk: 3 }, refs: [101], why: 'In a young patient with a high score you can usually do without CT.', reply: 'You could, but hang on. He’s twenty-three. Let’s do a score first and decide whether he needs the radiation at all.' },
          { t: 'Book the OR, it’s obviously appendicitis', g: 'b', to: 's_score', fx: { neg: 15, risk: 8 }, refs: [101, 116], why: 'Without a score, and imaging when needed, the chance of removing a normal appendix goes up.', reply: 'Hold on. Take a breath. I’m sure it’s appendicitis too, and I’m wrong about once a month. Let’s examine him.' }
        ]
      },
      s_score: {
        view: 'chart', dt: 5,
        say: 'White count fourteen thousand, CRP up, tenderness and rebound in the right lower quadrant. Which score do you calculate?',
        tip: { res: 'AIR and AAS use CRP and neutrophils. Alvarado is good for ruling out, less so for ruling in.', stu: 'Remember the eight components of Alvarado, and think about what AIR adds.', senior: 'A good question for the room: why a score and not just gut feeling?' },
        refs: [101, 113, 114, 115],
        opts: [
          { t: 'AAS or AIR, and act on the risk group', g: 'g', to: 's_img', refs: [101, 114, 115], reply: 'Exactly. His AAS comes out at seventeen. That’s high risk.', kw: ['aas', 'air', 'risk'] },
          { t: 'Alvarado, to confirm it’s appendicitis', g: 'o', to: 's_img', fx: { neg: 5 }, refs: [101, 113], why: 'Alvarado is good for ruling out and less good for ruling in.', reply: 'Alvarado is fine for ruling out. For ruling in, it’s weaker. Let’s do an AAS. It comes out at seventeen.' },
          { t: 'No need for a score, his abdomen tells you everything', g: 'b', to: 's_img', fx: { neg: 10, risk: 4 }, refs: [101], why: 'A clinical score sorts patients by risk and decides who needs imaging.', reply: 'The abdomen tells you a lot, but not everything. A short story: once I was certain, and it turned out to be the kidney. His AAS is seventeen.' }
        ]
      },
      s_img: {
        view: 'chart', dt: 20,
        say: 'AAS seventeen, and he’s twenty-three. Does he need imaging before we go up?',
        tip: { res: 'WSES: at high risk under 40 you can skip CT. At low risk, a positive scan can mislead.', nurse: 'If we go for a low-dose CT, check kidney function and contrast allergy.' },
        refs: [101, 115, 128],
        opts: [
          { t: 'A quick ultrasound if available, no CT', g: 'g', to: 'nom', fx: { flag: 'us' }, refs: [101], reply: 'Good. Ultrasound shows a nine millimeter appendix, no fecalith and no free fluid. Uncomplicated appendicitis.', kw: ['ultrasound', 'us'] },
          { t: 'Low-dose CT with contrast', g: 'o', to: 'nom', fx: { rad: 1 }, refs: [101], why: 'At high risk under 40, CT rarely changes the decision.', reply: 'If it has to be CT, then low dose, yes. Nine millimeter appendix, no fecalith.' },
          { t: 'Standard CT, just to be safe', g: 'b', to: 'nom', fx: { rad: 2, risk: 3 }, dt: 40, refs: [101], why: 'Radiation and time with no benefit in a young high-risk patient.', reply: 'To be safe for whom? Him, or you? All right, we’ll do it. Nine millimeter appendix, no fecalith.' }
        ]
      },

      /* ---- perforated ---- */
      p_er: {
        view: 'chart', dt: 10,
        say: 'Hello, doctor. Thirty-four-year-old man, three days of pain at home, now thirty-eight point nine and tender all the way down to the pelvis. The CT is already up.',
        tip: { res: 'Three days and a high fever: think perforation before you even open the CT.', nurse: 'Fluids, blood cultures per protocol, and antibiotics now, not in the OR.' },
        kind: 'info', btn: 'Open the CT', to: 'p_ct'
      },
      p_ct: {
        view: 'img:ct', cap: 'CT: perforation, fecalith and a 2 cm pelvic collection', dt: 10,
        say: 'The CT shows a perforation, a fecalith and a small collection in the pelvis, two centimeters. What’s the plan?',
        refs: [101, 102, 105],
        tip: { res: 'A small collection with peritonitis isn’t an abscess for percutaneous drainage. It needs source control.', stu: 'What’s the difference between simple and complicated? Gangrene, perforation, abscess, free pus.' },
        opts: [
          { t: 'Broad-spectrum antibiotics now and the OR tonight', g: 'g', to: 'consent', refs: [101, 102], fx: { flag: 'abxpre' }, reply: 'Right. With peritonitis we don’t wait for the morning. I’ll call the OR.' },
          { t: 'Try antibiotics alone, he’s young', g: 'b', to: 'p_nomfail', refs: [105], fx: { risk: 12 }, why: 'A fecalith and complicated appendicitis are exactly the patients who fail antibiotics.', reply: 'With a fecalith and a perforation? In CODA those were exactly the ones who failed and got worse. All right, let’s see what the morning brings.' },
          { t: 'Percutaneous drainage of the collection, then wait', g: 'o', to: 'consent', refs: [101], fx: { t: 30, risk: 5, flag: 'abxpre' }, why: 'A two centimeter collection with peritonitis isn’t drained percutaneously.', reply: 'The collection is too small to drain, and his abdomen is peritonitic. Let’s not drag this out. OR tonight.' }
        ]
      },
      p_nomfail: {
        kind: 'info', view: 'mentor:ward', btn: 'To the OR', dt: 360,
        fx: { flag: 'nomfail', perfrisk: 20, risk: 5 },
        say: 'Six in the morning. Heart rate one eighteen, and the abdomen is harder. Antibiotics won’t close that hole. We go now.',
        tip: { res: 'Anyone who doesn’t improve on antibiotics, and certainly anyone who gets worse, goes to surgery without argument.' },
        to: 'consent'
      },

      /* ---- retrocecal ---- */
      r_er: {
        view: 'chart', dt: 10,
        say: 'Hello, doctor. Forty-one-year-old man, BMI thirty-four, right flank pain and a little blood in the urine. What do you think?',
        tip: { res: 'Blood in the urine doesn’t rule out appendicitis. A retrocecal appendix can irritate the ureter.', stu: 'Think of a differential for right flank pain. At least four.' },
        refs: [101],
        opts: [
          { t: 'Retrocecal appendicitis versus a kidney stone. Score and CT', g: 'g', to: 'r_ct', refs: [101], reply: 'Exactly. Forty-one with a high BMI, so a low-dose CT makes sense here.' },
          { t: 'Renal colic. Refer to urology', g: 'b', to: 'r_ct', fx: { risk: 8 }, why: 'A little blood in the urine also happens when an inflamed appendix touches the ureter.', reply: 'Wait. Before you hand him over to urology, remember that a retrocecal appendix sits right on the ureter. We’ll do a CT.' },
          { t: 'Ultrasound first', g: 'o', to: 'r_ct', fx: { t: 30 }, refs: [101], why: 'Ultrasound is limited with a high BMI and a retrocecal appendix.', reply: 'You could, but at a BMI of thirty-four it won’t see a thing. We tried, and there’s nothing to see. Off to CT.' }
        ]
      },
      r_ct: {
        kind: 'info', view: 'img:ct', cap: 'CT: 11 mm retrocecal appendix with inflamed fat around it', dt: 40, btn: 'Got it',
        say: 'CT: an eleven millimeter appendix behind the cecum, inflamed fat around it, no fecalith and no ureteric stone. So it’s ours.',
        tip: { res: 'Look on the CT for where the tip is. That tells you how much mobilization you’ll need in the OR.', nurse: 'A retrocecal case takes longer. Have an advanced energy device in the room.' },
        to: 'nom'
      },

      /* ---- woman ---- */
      w_er: {
        view: 'mentor:corridor', dt: 10,
        say: 'Hello, doctor. In the ER there’s a twenty-seven-year-old woman with a full day of right lower quadrant pain and nausea. Her last period isn’t clear. What comes first?',
        tip: { res: 'In young women the negative appendectomy rate is double. Pregnancy test, pelvic exam and ultrasound first.', stu: 'Three differentials in a young woman? And why do we test for pregnancy before anything else?', nurse: 'Urine or blood pregnancy test before any imaging and any drug.' },
        refs: [101, 116],
        opts: [
          { t: 'Pregnancy test, pelvic exam and ultrasound', g: 'g', to: 'w_hcg', refs: [101, 116], reply: 'Good. That’s it. A pregnancy test before anything else, always.', kw: ['pregnancy', 'pelvic', 'ultrasound'] },
          { t: 'Straight to CT, it’s the fastest', g: 'b', to: 'w_hcg', fx: { risk: 10, rad: 2 }, refs: [101], why: 'No CT in a woman of childbearing age without a pregnancy test.', reply: 'Wait. Stop. A CT before a pregnancy test? Never. The test comes first.' },
          { t: 'Book the OR, it looks like appendicitis', g: 'b', to: 'w_hcg', fx: { risk: 12, neg: 20 }, refs: [116], why: 'In young women, almost one appendectomy in four removed a normal appendix.', reply: 'Hold on. Take a breath. In RIFT almost a quarter of young women had a normal appendix removed. Pregnancy test first.' }
        ]
      },
      w_hcg: {
        view: 'chart', dt: 20,
        roll: [{ p: 0.2, to: 'w_preg', flag: 'preg', ev: 'Positive pregnancy test' }],
        say: 'The pregnancy test is negative. AAS ten, so intermediate risk. What now?',
        refs: [101, 115, 116, 128],
        tip: { res: 'At intermediate risk imaging helps. In women, AAS with a low threshold performed best in RIFT.' },
        opts: [
          { t: 'Abdominal and transvaginal ultrasound, and a low-dose CT if inconclusive', g: 'g', to: 'w_img', refs: [101, 116], reply: 'Right. The ultrasound isn’t conclusive, so a low-dose CT.' },
          { t: 'Diagnostic laparoscopy now', g: 'o', to: 'w_img', fx: { neg: 10 }, refs: [116], why: 'At intermediate risk it’s better to image before the OR.', reply: 'Sometimes that’s the right place for it, but imaging first. She’s stable. Ultrasound, then a low-dose CT.' },
          { t: 'Send her home with analgesia', g: 'b', to: 'w_img', fx: { risk: 8 }, why: 'Intermediate risk with local tenderness isn’t discharged without a workup.', reply: 'With right lower quadrant tenderness and an AAS of ten? No. She stays, and she gets imaged.' }
        ]
      },
      w_img: {
        kind: 'info', view: 'img:us', cap: 'Ultrasound: appendix not well seen, a little fluid in the pelvis', dt: 30, btn: 'Agreed, to the OR',
        say: 'On ultrasound the appendix isn’t well seen, and there’s a little fluid in the pelvis. The CT shows a borderline appendix and slightly inflamed fat. Let’s do a laparoscopy and see what’s there.',
        tip: { res: 'When imaging is borderline, the laparoscopy is also the diagnosis. But don’t start with the appendix, start with a survey.', nurse: 'Young woman with pelvic fluid: speak to the on-call gynecologist in advance.' },
        to: 'timing'
      },
      w_preg: {
        view: 'chart', dt: 10,
        say: 'The pregnancy test is positive. Fourteen weeks by dates. Take a breath. What now?',
        refs: [101, 104, 123],
        tip: { res: 'In pregnancy: ultrasound, then MRI if inconclusive. Surgery, not antibiotics. Laparoscopy when there’s experience.', nurse: 'Notify the delivery suite and the obstetric team. A wedge for left tilt.', stu: 'Why is removing even a normal appendix dangerous for the fetus?' },
        opts: [
          { t: 'Graded compression ultrasound, then MRI if inconclusive', g: 'g', to: 'w_preg_how', refs: [101], reply: 'Good. The ultrasound is inconclusive. MRI shows a nine millimeter appendix with inflammation around it.' },
          { t: 'CT, we need an answer fast', g: 'o', to: 'w_preg_how', fx: { rad: 2, risk: 4 }, refs: [101], why: 'In pregnancy CT isn’t the first choice (convention, in line with WSES).', reply: 'In a pinch, maybe, but not as a first choice. There’s an MRI slot free. MRI: a nine millimeter appendix with inflammation.' },
          { t: 'Antibiotics only, no surgery in pregnancy', g: 'b', to: 'w_preg_how', fx: { risk: 10, perfrisk: 20 }, refs: [101, 104], why: 'WSES and SAGES don’t recommend nonoperative treatment in pregnancy.', reply: 'Pregnancy is exactly when we don’t try antibiotics. A perforation is more dangerous to the baby than the operation. We did the MRI: appendicitis.' },
          { t: 'Operate now without imaging', g: 'b', to: 'w_preg_how', fx: { risk: 12, neg: 25 }, refs: [123], why: 'Removing a normal appendix in pregnancy is associated with fetal loss.', reply: 'Wait. Stop. A normal appendix in pregnancy isn’t free. The baby pays too. MRI first. It showed appendicitis.' }
        ]
      },
      w_preg_how: {
        dt: 10, view: 'mentor:corridor',
        say: 'Uncomplicated appendicitis at fourteen weeks. How do we operate?',
        refs: [101, 104],
        opts: [
          { t: 'Laparoscopy, with left tilt and low pressure', g: 'g', to: 'consent', refs: [101, 104], reply: 'Right. SAGES and WSES prefer laparoscopy when there’s experience. And we have it.' },
          { t: 'Open surgery, it’s safer for the fetus', g: 'o', to: 'consent', refs: [104], why: 'Current guidelines prefer laparoscopy when there’s experience.', reply: 'People used to think so, and there were old studies too. Today the guidelines prefer laparoscopy. We’ll do it laparoscopically.' }
        ]
      },

      /* ---- elder ---- */
      e_er: {
        view: 'mentor:corridor', dt: 10,
        say: 'Hello, doctor. Seventy-one-year-old woman, nine days of pain, and now a tender mass in the right lower quadrant. What comes first?',
        refs: [101, 121],
        tip: { res: 'Over 40 with a mass: think tumor too. CT with contrast.', stu: 'What is a phlegmon, and how is it different from an abscess?' },
        opts: [
          { t: 'CT with contrast', g: 'g', to: 'e_ct', refs: [101], reply: 'Good. At her age, with a mass, it’s a CT.' },
          { t: 'Ultrasound only', g: 'o', to: 'e_ct', fx: { t: 30 }, why: 'At this age, with a mass, you need the full picture a CT gives.', reply: 'Ultrasound will show you a mass but won’t tell you what it is. Let’s go to CT.' },
          { t: 'To the OR tonight', g: 'b', to: 'e_ct', fx: { risk: 8 }, refs: [102], why: 'Forcing your way into an inflammatory mass can end in a bowel resection.', reply: 'Hold on. Nine days and a mass. Before we go in, I want to know what’s in there. CT.' }
        ]
      },
      e_ct: {
        view: 'img:ct', cap: 'CT: 3 cm cystic appendix, thin wall, no inflammation around it', dt: 40,
        roll: [{ p: 0.55, to: 'e_mass', flag: 'phleg' }],
        say: 'On CT the appendix is dilated to three centimeters. It’s cystic, with a thin wall and no inflammation around it. What does that tell you?',
        refs: [118, 119],
        tip: { res: '“Mucocele” isn’t a diagnosis. Most of these lesions are mucinous neoplasms. Don’t rupture it.', stu: 'What is LAMN, and why don’t we say cystadenoma anymore?', nurse: 'Retrieval bag open before anyone touches the appendix, and a specimen pot for fluid.' },
        opts: [
          { t: 'Suspected mucinous neoplasm: remove it intact in a bag and survey the peritoneum', g: 'g', to: 'consent', fx: { flag: 'cyst', st: { inflam: 0 } }, refs: [118, 119], reply: 'Exactly. One goal: intact, with no rupture. I’ll let the OR know.' },
          { t: 'Percutaneous aspiration and drainage of the cyst', g: 'b', to: 'consent', fx: { flag: ['cyst', 'mucinspill'], risk: 18, st: { inflam: 0 } }, refs: [119], why: 'Opening a mucinous neoplasm spills mucin into the peritoneum.', reply: 'Wait. Stop. A needle in a mucinous cyst spreads it through the abdomen. Remember that. It’s already been done, so we move on to surgery.' },
          { t: 'It’s a simple mucocele, follow it up', g: 'o', to: 'consent', fx: { flag: 'cyst', st: { inflam: 0 }, risk: 4 }, refs: [118], why: 'Mucocele is a description, not a diagnosis. Most are neoplasms, and they come out.', reply: 'Mucocele is a description, not a diagnosis. It comes out, gently. We’ll book her for the morning.' }
        ]
      },
      e_mass: {
        view: 'img:ct', cap: 'CT: phlegmon and a 4 cm abscess next to the cecum', dt: 10,
        say: 'On CT there’s a phlegmon with a four centimeter abscess next to the cecum. She’s stable. Do we operate now?',
        refs: [101, 102, 122],
        tip: { res: 'Don’t take a phlegmon apart by force. Antibiotics and drainage, or laparoscopy in experienced hands with a low threshold to open.', nurse: 'If we go for drainage: arrange interventional radiology and a culture pot.' },
        opts: [
          { t: 'Antibiotics and percutaneous drainage of the abscess', g: 'g', to: 'e_drain', refs: [101, 102, 122], fx: { flag: 'conservative' }, reply: 'That’s exactly what I’d do. Radiology will drain it this morning.' },
          { t: 'Laparoscopy now, with you, and open if needed', g: 'o', to: 'e_force', refs: [101], fx: { t: 20 }, why: 'Possible in experienced hands, but with a very low threshold to stop.', reply: 'Possible, with experience and a low threshold to stop. All right, let’s try. But if it won’t move, we come out.' },
          { t: 'Operate and take the mass apart until we find the appendix', g: 'b', to: 'e_force', refs: [102], fx: { risk: 12, flag: 'forced' }, why: 'Forcing apart an inflammatory mass can mean a bowel resection.', reply: 'I’ll tell you how this ends: a cecal resection at three in the morning. Let’s see.' }
        ]
      },
      e_force: {
        view: 'scene', dt: 30, st: { inflam: 3, omentum: true, pus: true },
        say: 'Wait. Look. Everything’s stuck together, and the cecum is edematous and falls apart at every touch. What do we do?',
        refs: [101, 102],
        tip: { res: 'Converting or stopping is a safe decision when it’s made for the right reason.' },
        opts: [
          { t: 'Stop: suction, drain the abscess and continue antibiotics', g: 'g', to: 'e_drain', refs: [102], fx: { flag: 'conservative' }, reply: 'Good. That’s the decision of a mature surgeon. A drain, antibiotics, and we come back to her in a couple of months.' },
          { t: 'Keep dissecting down to the base', g: 'b', to: 'e_resect', refs: [102], fx: { risk: 15, flag: 'relook' }, why: 'Forcing apart an inflammatory mass leads to a bowel resection.', reply: 'Wait. Stop. The cecum has just torn in front of us. Now there’s no choice.' }
        ]
      },
      e_resect: {
        view: 'mentor:tense', kind: 'info', dt: 90, st: { bleed: 2 }, btn: 'Continue',
        fx: { flag: 'ev_ent', hemo: 1, grade: 1 },
        say: 'We opened. An ileocecal resection with an anastomosis. She’ll get through it, but that isn’t the operation she needed tonight.',
        tip: { res: 'The lesson: this mass needed drainage. Cochrane didn’t settle the question, but the risk is clear.' },
        refs: [102, 122],
        to: 'path'
      },
      e_drain: {
        kind: 'info', view: 'mentor:ward', dt: 60, btn: 'Six weeks later',
        say: 'We drained it, she’s on antibiotics, and after three days the fever settled. We discharge her with a clinic appointment.',
        tip: { res: 'After successful drainage, a short fixed course is enough.', stu: 'Why bring her back to clinic at all if she’s well?' },
        refs: [108],
        to: 'e_follow'
      },
      e_follow: {
        view: 'mentor:ward', dt: 0,
        say: 'Six weeks later. She feels great. She’s seventy-one. What next?',
        refs: [101, 103, 121],
        tip: { res: 'Over 40 after an abscess: colonoscopy and CT. In Peri-APPAC a tumor was found in one patient in five.', senior: 'This is a genuine disagreement between WSES and SAGES. Let them make their case.' },
        opts: [
          { t: 'Colonoscopy and a full CT, then discuss an interval appendectomy', g: 'g', to: 'e_neo', refs: [101, 121], reply: 'Right. And in Peri-APPAC one in five over forty had a tumor, so I’m in favor of talking to her about taking it out.' },
          { t: 'A planned interval appendectomy', g: 'g', to: 'e_neo', refs: [103, 121], reply: 'That’s legitimate too. SAGES suggests it, and Peri-APPAC supports it at her age. Colonoscopy first.' },
          { t: 'Nothing, she’s well', g: 'b', to: 'e_neo', fx: { risk: 10, flag: 'missedtumor' }, refs: [121], why: 'Over 40, after an abscess, there’s a real risk of a neoplasm.', reply: 'Wait. She’s seventy-one, with an abscess around the appendix. I’m not closing the file without a colonoscopy.' }
        ]
      },
      e_neo: {
        kind: 'info', view: 'mentor:ward', btn: 'To the summary',
        roll: [{ p: 0.2, to: 'e_neo_pos', flag: 'neo', ev: 'A neoplasm was found in the appendix' }],
        say: 'The colonoscopy is normal and the CT is clean. If the appendix comes out later, it’ll be done calmly, with no inflammation.',
        to: 'end'
      },
      e_neo_pos: {
        kind: 'info', view: 'mentor:ward', btn: 'To the summary',
        say: 'At the planned appendectomy, pathology found a small neoplasm in the appendix. That’s why we asked. She’s on her way to the multidisciplinary meeting.',
        refs: [121],
        to: 'end'
      },

      /* ================= antibiotics or surgery ================= */
      nom: {
        view: 'mentor:corridor', dt: 10,
        say: 'Uncomplicated appendicitis, no fecalith. He asks you: do I have to have an operation?',
        when: [{ if: function (S) { return S.f.fecalith || gr(S) >= 3; }, to: 'timing' }],
        refs: [101, 103, 105, 106, 107],
        tip: { res: 'WSES: offer antibiotics to selected patients without a fecalith. SAGES prefers surgery. Give him both sides.', stu: 'In CODA, how many patients on antibiotics had failed treatment within 90 days?', senior: 'Listen to how they talk to the patient. That’s part of the operation.' },
        opts: [
          { t: 'Explain both options, including the chance of recurrence', g: 'g', to: 'nom_ask', refs: [101, 105, 106, 107], reply: 'Nice. Exactly like that: about a third end up having the operation within a few years. He asks what you would do.' },
          { t: 'Yes, you must. There’s no other option', g: 'o', to: 'timing', refs: [103], why: 'There is another legitimate option. The patient should hear it.', reply: 'Surgery is an excellent choice, but it isn’t true that there’s no other option. Next time, tell him.' },
          { t: 'No, antibiotics and that’s the end of it', g: 'b', to: 'nom_course', fx: { risk: 4, flag: 'overpromise' }, refs: [105, 107], why: 'At five years almost 40% had come back. Never promise it’s over.', reply: 'Hold on. The end of it? Almost four in ten come back within five years. Be fair with him.' }
        ]
      },
      nom_ask: {
        view: 'mentor:corridor', dt: 5,
        say: 'He hears you out and says: I’m a student, I have exams, I don’t want this coming back. What do you recommend?',
        refs: [101, 103, 105],
        opts: [
          { t: 'For him surgery is better: it solves the problem in one go', g: 'g', to: 'timing', refs: [103], reply: 'Agreed. He told you what matters to him, and you answered accordingly. To the OR.' },
          { t: 'Antibiotics, with a clear plan if it comes back', g: 'g', to: 'nom_course', refs: [101, 105], reply: 'Also fine, as long as he understands the cost. We start antibiotics and follow him up.' }
        ]
      },
      nom_course: {
        kind: 'info', view: 'mentor:ward', dt: 0, btn: 'What next?',
        roll: [{ p: function (S) { return S.f.overpromise ? 0.35 : 0.29; }, to: 'nom_fail', flag: 'nomfail', ev: 'Antibiotic treatment failed' }],
        fx: { flag: 'nomok' },
        say: 'Two days of antibiotics. The pain has settled and he’s eating. We discharge him and explain when to come back.',
        tip: { res: 'In APPAC about half of the recurrences came in the first year. A patient going home needs to know what to watch for.' },
        refs: [106, 107],
        to: 'nom_ok'
      },
      nom_ok: {
        kind: 'info', view: 'mentor:ward', btn: 'To the summary',
        say: 'A month later, in clinic. He’s fine. Remember: this isn’t cured, it’s settled for now. That’s how you explain it to him.',
        refs: [105, 107],
        to: 'end'
      },
      nom_fail: {
        kind: 'info', view: 'mentor:ward', btn: 'To the OR', dt: 120,
        fx: { unflag: 'nomok' },
        say: 'Two weeks later he’s back with the same pain. That happens to about a third. No guilt. This time we operate.',
        refs: [105],
        to: 'timing'
      },

      /* ================= timing and consent ================= */
      timing: {
        view: 'mentor:corridor', dt: 10,
        say: 'It’s eleven at night and the emergency list is full. When do we operate?',
        when: [{ if: function (S) { return gr(S) >= 3; }, to: 'consent' }],
        refs: [101, 103],
        tip: { res: 'Within 24 hours of admission, after a dose of antibiotics. No need to rush in the middle of the night for simple appendicitis.', nurse: 'Antibiotic dose before incision per protocol. Record the time.' },
        opts: [
          { t: 'Antibiotics now and the next list, within 24 hours', g: 'g', to: 'consent', fx: { flag: 'abxpre' }, refs: [101, 103], reply: 'Good. He gets a dose and goes first in the morning. He’ll rest, he’ll sleep, and so will you.' },
          { t: 'Now, in the middle of the night', g: 'o', to: 'consent', fx: { flag: 'abxpre' }, refs: [103], why: 'Acceptable, but for simple appendicitis there’s no advantage to operating straight away.', reply: 'That’s fine too. SAGES accepts both. So we go. I’ll call the OR team.' },
          { t: 'Tomorrow afternoon, after the elective list', g: 'b', to: 'consent', fx: { perfrisk: 20, risk: 8, flag: 'late' }, refs: [101], why: 'WSES recommends not delaying beyond 24 hours.', reply: 'Hold on. That’s past twenty-four hours. We don’t push him back because of the list. He goes in the morning.' }
        ]
      },
      consent: {
        kind: 'check', view: 'consent', dt: 10,
        say: 'Before we go up. What needs to be in place? Tick everything.',
        items: [
          { t: 'Consent: including conversion to open, bleeding, abscess and a normal appendix', need: 1, miss: 'You forgot the consent. Without it, nobody touches him.' },
          { t: 'Antibiotic dose before incision', need: 1, miss: 'Antibiotics before the incision. One dose. It cuts infections.' },
          { t: 'Empty bladder: void beforehand or a catheter', need: 1, miss: 'The bladder. A suprapubic port with a full bladder is a bad story.' },
          { t: 'Pregnancy test in a woman of childbearing age' },
          { t: 'Bowel preparation', no: 1, miss: 'Bowel prep? Not for appendicitis. We skip it.' },
          { t: 'Hold analgesia until I’ve examined him', no: 1, miss: 'Analgesia doesn’t mask the exam. We don’t leave him in pain.' }
        ],
        ok: 'Excellent. Everything’s in place. Let’s go up.',
        fx: { b: { risk: 6 }, o: { risk: 2 } },
        refs: [101, 102],
        tip: { res: 'Consent is also the moment to tell the patient we might find a normal appendix.', stu: 'Why do we empty the bladder before lower abdominal laparoscopy?', nurse: 'Checklist: consent, antibiotics and time, bladder, pregnancy test, allergies.' },
        to: 'n_tray'
      },
      n_tray: {
        view: 'tray', kind: 'check', for: ['nurse'], skip: 'position', dt: 5,
        say: 'You’re scrubbed for this one. What do you lay out on the table for an appendectomy?',
        items: [
          { t: 'Open access set or Veress needle', need: 1, miss: 'The access set. Without it we don’t start.' },
          { t: 'A 10-12 umbilical trocar and two 5 mm trocars', need: 1, miss: 'The trocars. One big and two small.' },
          { t: '30 degree scope', need: 1, miss: 'A thirty degree scope. With a zero you can’t see behind the cecum.' },
          { t: 'Loops, polymer clips, and a stapler available in the room', need: 1, miss: 'The base closure. Loops, clips, and a stapler in the room even if we don’t open it.' },
          { t: 'Retrieval bag and suction connected', need: 1, miss: 'Bag and suction. I don’t take out an inflamed appendix without a bag.' },
          { t: 'Large abdominal retractor open on the table', no: 1, miss: 'A big retractor? In the room, but not opened. We don’t open everything we have.' }
        ],
        ok: 'Good. A tidy table makes a calm operation.',
        tip: { nurse: 'With a diseased base they’ll ask for a stapler and a spare cartridge. Keep them within reach.' },
        to: 'position'
      },
      position: {
        view: 'position', dt: 10,
        say: 'He’s on the table and asleep. How do we position him, and where does the screen go?',
        refs: [102],
        tip: { res: 'Left arm tucked, the screen in your line of sight on the patient’s right. Trendelenburg and tilt to the left (convention).', nurse: 'Straps and support before tilting. Left arm tucked and padded.', stu: 'Why tilt to the left? What does it do to the small bowel?' },
        opts: [
          { t: 'Supine, left arm tucked, screen on the right, head down and tilted left', g: 'g', to: 'entry', reply: 'Exactly. The small bowel drops to the left and clears the pelvis for us. That’s convention rather than evidence, but it works.' },
          { t: 'Supine, both arms out, screen above the head', g: 'o', to: 'entry', fx: { vis: -5 }, why: 'An outstretched left arm gets in the way of the surgeon and camera, who stand on the left.', reply: 'You’ll stand on the left and keep bumping into his arm. Let’s tuck it and move the screen to the right side.' },
          { t: 'I stand on the right, close to the appendix', g: 'b', to: 'entry', fx: { vis: -10, risk: 3 }, why: 'You stand opposite the pathology, on the far side, so you can triangulate.', reply: 'Hold on. On the right you’ll be working against the camera. Stand on the left and look to the right.' }
        ]
      },
      entry: {
        view: 'wall', dt: 8,
        say: 'We go in at the umbilicus. How?',
        when: [{ if: has('preg'), to: 'preg_table' }],
        refs: [102],
        tip: { res: 'Both methods are accepted. What matters is that you do the one you do well.', nurse: 'Starting insufflation pressure per the surgeon, usually 12.' },
        opts: [
          { t: 'Open (Hasson) entry at the umbilicus', g: 'g', to: 'ports', refs: [102], reply: 'Good. I can see the peritoneum. Open it. Gas on.', kw: ['hasson', 'open'] },
          { t: 'Veress needle at the umbilicus with pressure checks', g: 'g', to: 'ports', refs: [102], reply: 'Fine. Opening pressure of four, we’re in. Then the trocar.', kw: ['veress', 'needle'] },
          { t: 'Veress at McBurney’s point, close to the appendix', g: 'b', to: 'ports', fx: { risk: 8 }, why: 'Blind entry over an inflamed, adherent organ is dangerous. Go in at the umbilicus.', reply: 'Wait. Stop. A blind needle over inflamed bowel? We go in at the umbilicus.' }
        ]
      },
      preg_table: {
        view: 'position', kind: 'check', dt: 10,
        say: 'Fourteen weeks. What changes on the table?',
        items: [
          { t: 'Left tilt of the table', need: 1, miss: 'Left tilt. The uterus presses on the vena cava.' },
          { t: 'Low insufflation pressure', need: 1, miss: 'Low pressure. Just enough to see.' },
          { t: 'Open entry above the uterus', need: 1, miss: 'Open entry, and high. No blind needle over a uterus.' },
          { t: 'Fetal monitoring as the obstetric team decides', need: 1, miss: 'The obstetric team decides on monitoring. We talk to them.' },
          { t: 'Suprapubic port as usual', no: 1, miss: 'Above the pubis there’s a uterus. The ports move up.' }
        ],
        ok: 'Exactly. And all the ports move up according to the size of the uterus. That part is convention.',
        fx: { b: { risk: 8 } },
        refs: [104],
        tip: { res: 'Everything here is practical convention in line with SAGES. Uterine size is what decides.', nurse: 'Tilt wedge, fetal monitor if decided, and the phone number of the on-call obstetrician.' },
        to: 'ports_preg'
      },
      ports: {
        kind: 'place', view: 'wall', ports: 3, sizes: [12, 5, 5], tol: 42, dt: 10,
        say: 'Three ports. The camera goes in the umbilicus. Where do the other two go? Tap the abdomen.',
        layouts: [
          { id: 'tri', he: 'Umbilicus, suprapubic and left lower', pts: [{ lm: 'umb' }, { lm: 'pubis', dy: -52 }, { lm: 'asisL', dx: -26, dy: -16 }] },
          { id: 'left', he: 'Umbilicus and two on the left', pts: [{ lm: 'umb' }, { lm: 'asisL', dx: -26, dy: -16 }, { lm: 'umb', dx: 130, dy: -30 }] }
        ],
        danger: [
          { xy: [300, 628], r: 20, he: 'Bladder', say: 'Wait. Stop. That’s too low, it’s the bladder. Two finger-breadths above the pubic bone.', why: 'A port right on the pubis puts the bladder at risk.', fx: { risk: 4 } },
          { xy: [362, 545], r: 16, he: 'Inferior epigastric vessels', say: 'Hold on. The inferior epigastric runs there. Move lateral, outside the rectus.', why: 'A port in the line of the inferior epigastric vessels can bleed into the wall.', fx: { risk: 3 } },
          { xy: [238, 545], r: 16, he: 'Right inferior epigastric vessels', say: 'Hold on. There’s an epigastric on the right too. And besides, on the right you have no triangle.', why: 'A port in the line of the inferior epigastric vessels can bleed into the wall.', fx: { risk: 3 } },
          { lm: 'mcburney', r: 34, he: 'McBurney’s point', say: 'That’s too close to the appendix. Your instruments will clash with the camera. Move away, to the other side.', why: 'A port right over the target cancels out the triangle.', fx: { vis: -5 } }
        ],
        reply: {
          g: 'Good. A nice triangle, with both instruments aimed at the right lower quadrant.',
          o: 'That’ll work, but one of them is cramped. Next time, leave a hand’s breadth between the ports.',
          b: 'Like that, your instruments will be fighting each other. See where the green dots are. That’s where I’d put them.'
        },
        fx: { g: { vis: 10 }, o: { vis: 0 }, b: { vis: -15, risk: 4 } },
        why: 'Ports on the left and above the pubis form a triangle facing the right lower quadrant. WSES prefers three ports over a single incision.',
        refs: [101, 102],
        tip: { res: 'The left port lateral to the rectus, the lower port above the bladder. A hand’s breadth between them.', stu: 'Why do we place the ports on the side opposite the appendix?', nurse: 'Number 11 blade and trocars in order: 12 at the umbilicus and two 5s.' },
        to: 'survey'
      },
      ports_preg: {
        kind: 'place', view: 'wall', ports: 3, sizes: [12, 5, 5], tol: 46, dt: 12,
        say: 'Fourteen weeks. The uterus is above the pubis. Where do the three ports go now?',
        layouts: [
          { id: 'high', he: 'Above the umbilicus and two high on the left', pts: [{ lm: 'umb', dy: -60 }, { lm: 'umb', dx: 140, dy: -10 }, { lm: 'umb', dx: 110, dy: -120 }] }
        ],
        danger: [
          { xy: [300, 575], r: 60, he: 'Uterus', say: 'Wait. Stop. That’s the uterus. At fourteen weeks we go above it.', why: 'In pregnancy the ports move up according to uterine size (convention).', fx: { risk: 8, flag: 'fetalrisk' } }
        ],
        reply: {
          g: 'Excellent. High above the uterus, and still a triangle.',
          o: 'Almost. Go up a little more. The uterus is bigger than it looks from outside.',
          b: 'Too low. In pregnancy all the ports move up. Look at the green dots.'
        },
        fx: { g: { vis: 5 }, b: { vis: -10, risk: 6 } },
        why: 'In pregnancy the ports move up according to uterine size, with open entry above the uterus (convention, in line with SAGES).',
        refs: [104],
        to: 'survey'
      },

      /* ================= inside ================= */
      survey: {
        view: 'scene', dt: 3, st: { labels: false, focus: null },
        say: 'The camera’s in. Before we touch the appendix, what do we check?',
        refs: [101],
        tip: { res: 'A systematic survey: entry site, fluid and where it is, cecum and appendix, pelvis, and in a woman the ovaries too. With an unexplained finding, the small bowel as well (convention).', nurse: 'Suction connected and a culture pot ready.', stu: 'What are we looking for in the pelvis of a young woman?' },
        opts: [
          { t: 'A systematic survey: entry, fluid, cecum, pelvis and pelvic organs', g: 'g', to: 'stu_anat', reply: 'Good. That way you don’t miss anything. Tell me what you see.', kw: ['survey', 'pelvis', 'fluid'] },
          { t: 'Straight to the appendix, we know what’s there', g: 'b', to: 'stu_anat', fx: { flag: 'nosurvey', risk: 5 }, why: 'A systematic survey finds what we didn’t think of: an ovary, a Meckel’s, pus somewhere else.', reply: 'Hold on. We know what the CT said. The abdomen hasn’t read the CT. A survey, thirty seconds.' }
        ]
      },
      stu_anat: {
        view: 'scene', kind: 'spot', for: ['stu'], skip: 'xp', target: 'ileum', he: 'Terminal ileum',
        say: 'Before we carry on, show me the terminal ileum.',
        ok: 'Right. From there we follow it to the cecum, and from the cecum to the base.',
        bad: 'No. The terminal ileum enters the cecum on the right of the picture. Look again.',
        why: 'The terminal ileum enters the cecum at the ileocecal junction.',
        st: { labels: false },
        tip: { stu: 'Cecum, taeniae, terminal ileum, appendix and mesentery. Those are the five things to identify in the first view.' },
        refs: [102],
        to: 'xp'
      },
      xp: {
        view: 'scene', kind: 'info', btn: 'Continue',
        say: 'Let’s see what we’ve got here.',
        when: [
          { if: has('cyst'), to: 'xp_e' },
          { if: function (S) { return S.cs.id === 'woman' && !S.f.preg; }, to: 'xp_w' },
          { if: cs('perf'), to: 'xp_p' },
          { if: cs('retro'), to: 'xp_r' }
        ],
        to: 'xp_s'
      },
      xp_s: {
        view: 'scene', kind: 'info', btn: 'Carry on', dt: 2, st: { inflam: 1, labels: true },
        when: [{ if: has('nosurvey'), to: 'grade' }],
        roll: [{ p: 0.1, to: 'meckel', flag: 'meckel', ev: 'Meckel’s diverticulum on a loop of small bowel', fx: { st: { meckel: true } } }],
        say: 'The appendix is red and swollen, with no pus and no perforation. The pelvis is clean. Simple appendicitis.',
        tip: { res: 'WSES suggests grading the inflammation during the operation. It decides the antibiotics afterwards.' },
        to: 'grade'
      },
      xp_p: {
        view: 'scene', kind: 'info', btn: 'Carry on', dt: 3, st: { inflam: 3, pus: true, omentum: true, labels: true },
        say: 'Pus in the pelvis and the right gutter, omentum wrapped around it, and a perforation at the tip. Breathe. It always looks worse than it is.',
        tip: { res: 'Suction first so you can see, then free the omentum gently.', nurse: 'Culture pot for the pus. The suction will be busy.' },
        to: 'grade'
      },
      xp_r: {
        view: 'scene', kind: 'info', btn: 'Carry on', dt: 3, st: { variant: 'retrocecal', inflam: 2, labels: true },
        say: 'The cecum is clear at the front, and there’s no appendix. It’s hiding behind. Cloudy fluid in the gutter, so there’s probably some gangrene back there.',
        tip: { res: 'When you can’t see the appendix, don’t look for it. Look for the taeniae.' },
        to: 'grade'
      },
      xp_w: {
        view: 'scene', kind: 'info', btn: 'Carry on', dt: 3, st: { female: true, inflam: 1, labels: true },
        when: [{ if: has('nosurvey'), to: 'w_miss' }],
        roll: [
          { p: 0.2, to: 'gyn_tor', flag: 'tor', ev: 'Torsion of the right ovary', fx: { st: { inflam: 0 } } },
          { p: 0.15, to: 'gyn_pid', flag: 'pid', ev: 'Pelvic inflammatory disease (PID)', fx: { st: { inflam: 0, pus: true } } },
          { p: 0.15, to: 'gyn_cyst', flag: 'gcyst', ev: 'Ruptured ovarian cyst', fx: { st: { inflam: 0, bleed: 2 } } },
          { p: 0.15, to: 'normal_app', flag: 'normalapp', fx: { st: { inflam: 0 } } }
        ],
        say: 'The ovaries and tubes look normal. The appendix is red and swollen. So it is appendicitis after all.',
        to: 'grade'
      },
      w_miss: {
        view: 'scene', kind: 'info', btn: 'Got it', dt: 2, st: { female: true, labels: true },
        roll: [{ p: 0.25, to: 'gyn_tor', flag: 'tor', ev: 'Torsion of the right ovary', fx: { st: { inflam: 0 }, flag: 'missedtor_risk' } }],
        say: 'You skipped the pelvis, but I had a look. This time the ovaries are fine. Remember, in her, that’s the first thing you check.',
        to: 'grade'
      },
      xp_e: {
        view: 'scene', kind: 'info', btn: 'Carry on', dt: 3, st: { inflam: 0, labels: true },
        when: [{ if: has('mucinspill'), to: 'c_pmp' }],
        say: 'The appendix is tense and cystic, the peritoneum is clean, no mucin and no deposits. Excellent. Now, don’t touch it directly.',
        tip: { res: 'Survey and document the whole peritoneum before touching the appendix.', nurse: 'Bag open on the table.' },
        refs: [119],
        to: 'e_meso'
      },
      grade: {
        view: 'scene', dt: 1,
        say: 'What grade do you put in the operation note?',
        refs: [101, 102],
        tip: { res: 'WSES or AAST scale. The grade decides whether antibiotics continue afterwards.', stu: 'What counts as complicated appendicitis?' },
        opts: [
          { t: 'Simple appendicitis', g: 'g', when: function (S) { return gr(S) <= 1; }, to: 'find', fx: { flag: 'graded' }, reply: 'Right. Simple.' },
          { t: 'Simple appendicitis', g: 'b', when: function (S) { return gr(S) >= 2; }, to: 'find', fx: { flag: 'undergraded' }, why: 'Gangrene, perforation or pus make it complicated, and that changes the antibiotics afterwards.', reply: 'Hold on. With what we’re seeing here? This is complicated. Record it correctly, it changes what comes next.' },
          { t: 'Complicated appendicitis: gangrene, perforation or pus', g: 'g', when: function (S) { return gr(S) >= 2; }, to: 'find', fx: { flag: 'graded' }, reply: 'Right. Complicated. That means a short course of antibiotics afterwards.' },
          { t: 'Complicated appendicitis: gangrene, perforation or pus', g: 'o', when: function (S) { return gr(S) <= 1; }, to: 'find', fx: { flag: 'overgraded' }, why: 'Overgrading leads to unnecessary antibiotics.', reply: 'No. There’s no gangrene and no perforation here. Simple. Overgrading means antibiotics he doesn’t need.' }
        ]
      },

      /* ---- gynecology and normal appendix ---- */
      gyn_tor: {
        view: 'scene', dt: 5, st: { inflam: 0, female: true, focus: 'ovary', labels: true },
        say: 'Wait. Look in the pelvis. The right ovary is dark and twisted. The appendix is quiet. What do we do?',
        tip: { res: 'Detorse and preserve the ovary, even when it’s dark (convention). Call gynecology.', nurse: 'Call the on-call gynecologist and get atraumatic instruments.' },
        opts: [
          { t: 'Call gynecology, detorse and preserve the ovary', g: 'g', to: 'gyn_app', fx: { flag: 'help' }, reply: 'Good. Gynecology is on the way up. Look, now that it’s untwisted it’s already pinking up.' },
          { t: 'Remove the ovary, it’s dark', g: 'b', to: 'gyn_app', fx: { risk: 15, flag: 'ovaryloss' }, why: 'A dark ovary usually recovers after detorsion. Preserve it (convention).', reply: 'Wait. Stop. Dark doesn’t mean dead. She’s twenty-seven. We untwist it and wait. Gynecology is on the way.' },
          { t: 'Remove the appendix as planned', g: 'b', to: 'gyn_app', fx: { risk: 20, flag: 'missedtor' }, why: 'The problem is the ovary. An appendectomy won’t save it.', reply: 'Hold on. What did we come in for? The ovary is the story. Untwist it first.' }
        ]
      },
      gyn_pid: {
        view: 'scene', dt: 5, st: { inflam: 0, pus: true, female: true, focus: 'tube', labels: true },
        say: 'Pus in the pelvis, and the tubes are red and swollen. The appendix looks clean from the outside. What do you think?',
        tip: { res: 'Suspected PID: culture and a gynecology consult. The decision about the appendix depends on what you find.', nurse: 'Culture pots for the pelvis.' },
        opts: [
          { t: 'Culture, suction, gynecology consult', g: 'g', to: 'gyn_app', fx: { flag: 'help' }, reply: 'Right. This is PID. Antibiotics as gynecology advises, and testing for her partner.' },
          { t: 'It’s from the appendix, remove it and wash out', g: 'o', to: 'gyn_app', fx: { risk: 5 }, why: 'When the appendix is clean on the outside and the tubes are diseased, the source is in the pelvis.', reply: 'Look at the tubes. The pus is coming from the pelvis, not the appendix. Culture first.' }
        ]
      },
      gyn_cyst: {
        view: 'scene', dt: 5, st: { inflam: 0, bleed: 2, female: true, focus: 'ovary', labels: true },
        say: 'Blood in the pelvis, and the source is the ovary. A ruptured cyst. The appendix is normal. What do we do?',
        tip: { res: 'Suction, find the source, hemostasis. Most of these cysts stop on their own.' },
        opts: [
          { t: 'Suction, find the source and stop it gently', g: 'g', to: 'gyn_app', fx: { st: { bleed: 0 } }, reply: 'Good. It’s not bleeding anymore. Give the pelvis a good suction.' },
          { t: 'Plenty of diathermy on the ovary until it stops', g: 'b', to: 'gyn_app', fx: { risk: 8, st: { bleed: 0 } }, why: 'Extensive diathermy on the ovary damages its reserve.', reply: 'Slowly. That’s the ovary of a twenty-seven-year-old. Pinpoint, and the minimum of heat.' }
        ]
      },
      gyn_app: {
        view: 'scene', dt: 3, st: { focus: 'appendix' },
        say: 'We’ve found another explanation. The appendix is normal. Do we take it out or leave it?',
        refs: [101, 102],
        tip: { res: 'When there’s a clear alternative explanation for the symptoms, leaving a normal appendix is reasonable.' },
        opts: [
          { t: 'Leave it, the problem was found and treated', g: 'g', to: 'close', fx: { flag: 'noappy' }, refs: [101], reply: 'Agreed. The problem was the ovary. There’s no need to add another operation.' },
          { t: 'Take it out anyway, since we’re here', g: 'o', to: 'find', refs: [102, 129], why: 'Accepted, but removing a normal appendix has its own complications.', reply: 'Some people do. Just know that removing a normal appendix can go wrong too. All right, we’ll take it out.' }
        ]
      },
      normal_app: {
        view: 'scene', dt: 3, st: { inflam: 0, focus: 'appendix', labels: true },
        say: 'The appendix looks normal and the pelvis is clean. No other finding. What do we do?',
        refs: [101, 102, 129],
        tip: { res: 'Up to a quarter of appendices that look normal turn out abnormal on pathology. When there’s no other explanation, take it out.', stu: 'What else do we look for when everything looks normal?' },
        opts: [
          { t: 'Run the last 60 cm of small bowel, and remove it if there’s nothing', g: 'g', to: 'meckel_run', refs: [101, 102], reply: 'Exactly. Look first, then decide.' },
          { t: 'Leave it and close', g: 'b', to: 'close', fx: { risk: 10, flag: ['noappy', 'misseddx'] }, refs: [101, 102], why: 'With no other explanation the appendix comes out. And if you don’t run the small bowel, you miss a Meckel’s.', reply: 'Hold on. She’ll be back in a month with the same pain, and we’ll know nothing. At least run the small bowel.' },
          { t: 'Remove it now, without looking further', g: 'o', to: 'find', refs: [101, 129], why: 'It’s worth looking for another cause before you remove it.', reply: 'We’ll take it out, but before that I’d run the small bowel. Three minutes.' }
        ]
      },
      meckel_run: {
        view: 'scene', kind: 'info', btn: 'Continue', dt: 5,
        roll: [{ p: 0.3, to: 'meckel_hot', flag: 'meckelhot', ev: 'Inflamed Meckel’s diverticulum', fx: { st: { meckel: true } } }],
        say: 'We’ve run the small bowel. Clean. So the appendix comes out.',
        to: 'find'
      },
      meckel_hot: {
        view: 'scene', dt: 5, st: { meckel: true, focus: 'meckel', labels: true },
        say: 'There. A red, swollen Meckel’s, sixty centimeters from the ileocecal junction. That’s her story. What do we do?',
        refs: [127],
        tip: { res: 'An inflamed Meckel’s is resected: a wedge or a segment of bowel, depending on the base (convention). The appendix by the usual reasoning.' },
        opts: [
          { t: 'Resect the Meckel’s, then decide about the appendix', g: 'g', to: 'find', fx: { t: 25 }, reply: 'Right. Stapler across the base, nice. And we’ll take the appendix too, since we’ve come all this way.' },
          { t: 'Leave it, it’s not what we came for', g: 'b', to: 'find', fx: { risk: 15 }, why: 'An inflamed Meckel’s is the source of the symptoms and needs resection.', reply: 'Hold on. That’s exactly what we came for. That’s what’s hurting her. We resect it.' }
        ]
      },
      meckel: {
        view: 'scene', dt: 3, st: { meckel: true, focus: 'meckel', labels: true },
        say: 'Look what we’ve found. A quiet Meckel’s on the small bowel, and the appendix is inflamed. Do we resect it?',
        refs: [127],
        tip: { res: 'There’s no single answer. The evidence leans toward resection, but it depends on age, the look of the base and the patient’s condition. And document it.', senior: 'A great case for discussion. There’s no single right answer here.' },
        opts: [
          { t: 'Weigh age, base and condition, and document the decision', g: 'g', to: 'grade', refs: [127], reply: 'Nice. Twenty-three with a narrow base, I’d resect it. But what matters most is that you wrote down why.' },
          { t: 'Always resect', g: 'o', to: 'grade', fx: { t: 20 }, refs: [127], why: 'There’s no clear-cut guideline. Resection has complications too.', reply: 'You can. Just know that in the review the complication rate after resection was almost six percent.' },
          { t: 'Leave it and write nothing', g: 'b', to: 'grade', fx: { risk: 5 }, refs: [127], why: 'Even if you leave it, you must document it and tell the patient.', reply: 'Leaving it is allowed. Not writing it down isn’t. Whoever opens him in ten years’ time needs to know.' }
        ]
      },

      /* ---- finding the base ---- */
      find: {
        view: 'scene', kind: 'spot', target: 'base', he: 'Base of the appendix', r: 55, dt: 3,
        st: { taenia: true, labels: false, focus: null },
        say: 'Show me where the base is. A hint: the taeniae of the cecum know.',
        ok: 'Good. The three taeniae meet exactly there. That’s the base, and that never changes.',
        bad: 'No. Follow the anterior taenia down until it meets the other two.',
        why: 'The taeniae of the cecum converge on the base of the appendix, even when the tip is hidden.',
        fxBad: { flag: 'basemiss' },
        refs: [102],
        tip: { res: 'The base is always where the taeniae meet. That’s what prevents a long stump and stump appendicitis.', stu: 'How many taeniae does the cecum have, and what are they called?' },
        when: [],
        to: 'find2'
      },
      find2: {
        view: 'scene', kind: 'info', btn: 'Next', st: { taenia: false },
        say: 'Now that we know where the base is, we can get to work.',
        when: [
          { if: has('retro'), to: 'r_mob' },
          { if: cs('perf'), to: 'p_omen' }
        ],
        to: 'meso_gear'
      },

      /* ---- perforated: omentum and fecalith ---- */
      p_omen: {
        view: 'scene', dt: 8,
        say: 'The omentum is wrapped around the appendix and the small bowel is stuck to it. How do we free it?',
        refs: [101],
        tip: { res: 'Bluntly and gently, using the suction as an instrument. Don’t grab inflamed small bowel.', nurse: 'Suction irrigator connected and ready.' },
        opts: [
          { t: 'Bluntly, with the suction and atraumatic graspers', g: 'g', to: 'p_fec', fx: { st: { omentum: false } }, reply: 'Good. See how it comes apart by itself. That’s what I like about fresh inflammation.' },
          { t: 'Grab the small bowel and pull hard', g: 'b', to: 'c_ent_in', fx: { risk: 8, st: { omentum: false } }, why: 'Rough handling of inflamed bowel tears it.', reply: 'Wait. Stop. Inflamed bowel tears like wet paper.' }
        ]
      },
      c_ent_in: {
        view: 'scene', dt: 15, st: { focus: 'ileum' },
        fx: { flag: 'ev_ent' },
        say: 'There’s a small hole in the small bowel, where you grabbed it. Take a breath. What do we do?',
        tip: { res: 'An injury you recognize gets repaired straight away. A laparoscopic suture if you have the skill, otherwise through a small incision (convention).', nurse: 'Suture for a laparoscopic repair and a needle holder.' },
        opts: [
          { t: 'Repair it now with a suture and mark it to check at the end', g: 'g', to: 'p_fec', fx: { t: 15 }, reply: 'Good. Two stitches, watertight. An injury you recognize isn’t a disaster. An injury you miss is.' },
          { t: 'It’s small, it’ll close by itself', g: 'b', to: 'p_fec', fx: { risk: 25, flag: 'entmiss' }, why: 'An unrepaired bowel injury shows up as peritonitis a day or two later.', reply: 'Wait. Stop. A hole in the bowel doesn’t close by itself. But you’re the surgeon, and I’ve seen what you chose.' }
        ]
      },
      p_fec: {
        view: 'scene', kind: 'spot', target: 'fecalith', he: 'Fecalith', r: 60, dt: 4,
        st: { inflam: 3, labels: false },
        say: 'The CT showed a fecalith. The appendix is perforated. Show me where it is.',
        ok: 'Exactly. It came out through the perforation. It goes in the bag before anything else.',
        bad: 'Not there. Look next to the perforation, down in the pelvis. A fecalith that’s left behind comes back as an abscess.',
        why: 'A fecalith left in the abdomen causes recurrent abscesses.',
        fxOk: { flag: 'fecfound' },
        fxBad: { flag: 'fecleft', iaa: 15 },
        refs: [130],
        tip: { res: 'When the CT showed a stone and the appendix has ruptured: count, search and remove it in a bag (convention).', nurse: 'Bag ready. Record that a fecalith was removed.' },
        to: 'meso_gear'
      },

      /* ---- retrocecal ---- */
      r_mob: {
        view: 'scene', dt: 5,
        say: 'The base is here, but the body and the tip are behind the cecum. How do we go on?',
        refs: [102],
        tip: { res: 'Incise the peritoneum lateral to the cecum and mobilize it upward and medially. Or work from the base to the tip (convention).', nurse: 'Longer operating time. Advanced energy device ready.' },
        opts: [
          { t: 'Incise the peritoneum lateral to the cecum and mobilize it', g: 'g', to: 'r_toldt', reply: 'Good. Show me where you’re cutting.', kw: ['toldt', 'mobilize', 'peritoneum'] },
          { t: 'Work from base to tip: window, close and divide, then go up', g: 'g', to: 'r_retro', reply: 'Also right. A retrograde appendectomy. When the tip is stuck high up, that’s the safest way. That one’s convention.' },
          { t: 'Grab the tip and pull it out', g: 'b', to: 'c_tear', fx: { risk: 8 }, why: 'Pulling hard on an adherent tip tears the appendix.', reply: 'Hold on. You can’t see the tip, so what are you going to grab? All right, let’s try.' }
        ]
      },
      r_toldt: {
        view: 'scene', kind: 'tap', dt: 10, st: { danger: false, labels: false, focus: null },
        say: 'Show me where you cut the peritoneum.',
        hint: 'Tap where you incise the peritoneum to mobilize the cecum',
        zones: [
          { spot: 'toldt', r: 60, g: 'g', he: 'Peritoneum lateral to the cecum', reply: 'Exactly. On the white line, and not deep. The cecum is starting to move.', fx: { st: { exposed: true, danger: true }, t: 8 }, to: 'r_retro' },
          { spot: 'ureter', r: 45, g: 'b', he: 'Ureter', stop: 'Wait. Stop. That’s the ureter. It runs under the cecum, not on top of it.', reply: 'I told you that’s the ureter. All right, I’m moving you to the right line.', why: 'The right ureter runs under the cecum. Incise the lateral peritoneum, not deep.', fx: { risk: 10, ure: 20, st: { exposed: true, danger: true } }, to: 'r_retro' },
          { spot: 'eia', r: 45, g: 'b', he: 'Iliac artery', stop: 'Wait. Stop. That’s the iliac artery. We never cut there, ever.', reply: 'That’s the iliac artery. Let me take the scissors for a moment and show you.', why: 'The iliac vessels run under the cecum. Mobilize in the right plane.', fx: { risk: 15, ure: 15, st: { exposed: true, danger: true } }, to: 'r_retro' },
          { spot: 'cecum', r: 50, g: 'o', he: 'Cecal wall', reply: 'That’s the cecum itself. A little more lateral, on the white line. But yes, the direction is right.', why: 'Incise the peritoneum beside the cecum, not the cecal wall.', fx: { st: { exposed: true, danger: true } }, to: 'r_retro' }
        ],
        missSay: 'Not there. Look for the white line where the cecum is stuck to the side wall.',
        tip: { res: 'The white line of Toldt. Before you go deeper, identify the ureter and the iliac vessels (convention).', stu: 'What runs under the cecum?' },
        to: 'r_retro'
      },
      r_retro: {
        view: 'scene', dt: 8, st: { exposed: true, danger: true, labels: true },
        say: 'The cecum is moving. The tip is still stuck high up. Where do we carry on from?',
        tip: { res: 'Work from the base: make a window, close and divide, then go up along the mesentery. No blind deep dissection (convention).' },
        opts: [
          { t: 'Window at the base, close and divide, then up the mesentery', g: 'g', to: 'meso_gear', fx: { vis: 10, flag: 'retrograde' }, reply: 'Very nice. Now the tip will just come along with you.' },
          { t: 'Dissect deep laterally until the tip comes free', g: 'b', to: 'r_deep', fx: { ure: 25, risk: 8 }, why: 'Blind, deep lateral dissection puts the ureter and the iliac vessels at risk.', reply: 'You’re too deep. I don’t like this.' }
        ]
      },
      r_deep: {
        view: 'scene', kind: 'info', btn: 'Continue', dt: 10,
        roll: [{ p: function (S) { return Math.min(0.7, (S.v.ure || 0) / 100); }, to: 'c_ureter', flag: 'ureterev', ev: 'A tubular structure was injured deep down', luck: 'You dissected deep beside the ureter and got away with it. Next time, work from the base.' }],
        say: 'The tip is free. You were lucky. Next time, from the base.',
        to: 'meso_gear'
      },
      c_ureter: {
        view: 'scene', dt: 20, st: { danger: true, focus: 'ureter', labels: true },
        say: 'Wait. Stop. What’s that tube that’s contracting? I think we’ve touched the ureter.',
        tip: { res: 'Stop. No clips on a structure you haven’t identified. Call urology (convention).', nurse: 'Notify the on-call urologist. Ureteric stent set if they ask for it.' },
        opts: [
          { t: 'Stop everything and call urology', g: 'g', to: 'meso_gear', fx: { flag: ['help', 'ureterinj'], t: 40 }, reply: 'Right. Urology found a partial injury, repaired it and placed a stent. We caught it in time, and that makes all the difference.' },
          { t: 'Put a clip on it and carry on', g: 'b', to: 'meso_gear', fx: { flag: 'ureterinj', risk: 30 }, why: 'A clip on an injured ureter turns a partial injury into a complete obstruction.', reply: 'Wait. Stop. A clip on the ureter? That turns a small injury into a disaster. I’m calling urology.' }
        ]
      },
      c_tear: {
        view: 'scene', dt: 8, st: { inflam: 3, focus: 'fecalith', labels: true },
        fx: { flag: 'spill', iaa: 10 },
        say: 'Well. The appendix has torn and a fecalith has come out. That’s all right. Take a breath. What now?',
        tip: { res: 'Stop, find the stone and put it in a bag. Then work from the base.' },
        refs: [130],
        opts: [
          { t: 'Find the stone and bag it, then work from the base', g: 'g', to: 'r_retro', fx: { flag: 'fecfound' }, reply: 'Good. That’s what matters. A stone that stays behind comes back.' },
          { t: 'Carry on, we’ll wash out at the end', g: 'b', to: 'r_retro', fx: { flag: 'fecleft', iaa: 20, risk: 8 }, why: 'A fecalith left behind causes recurrent abscesses.', reply: 'Washing doesn’t find stones. All right, let’s carry on.' }
        ]
      },

      /* ---- elder cystic appendix ---- */
      e_meso: {
        view: 'scene', dt: 10, st: { exposed: true, labels: true },
        say: 'We suspect a neoplasm. How do we divide the mesentery?',
        refs: [102],
        tip: { res: 'With a suspected tumor, take the whole mesoappendix. Hold the mesentery, not the cyst.' },
        opts: [
          { t: 'The whole mesentery, down to the base, holding only the mesentery', g: 'g', to: 'meso_done', fx: { flag: 'fullmeso', st: { meso: 1 } }, refs: [102], reply: 'Exactly. And not a single instrument has touched the cyst.' },
          { t: 'Close to the appendix, as in ordinary appendicitis', g: 'o', to: 'meso_done', fx: { st: { meso: 1 } }, refs: [102], why: 'With a suspected tumor, EAES recommends taking the whole mesoappendix.', reply: 'In appendicitis, yes. Here we suspect a tumor, so we take all of it. Let me show you.' },
          { t: 'Grab the cyst and lift it', g: 'b', to: 'meso_done', fx: { risk: 20, flag: 'mucinspill', st: { meso: 1 } }, refs: [119], why: 'Grasping a mucinous cyst can rupture it and spill mucin.', reply: 'Wait. Stop. You touched the cyst. Look. There’s a little mucin. That’s exactly what we didn’t want.' }
        ]
      },

      /* ---- mesoappendix ---- */
      meso_gear: {
        view: 'scene', kind: 'gear', dt: 2, st: { exposed: true, labels: false, danger: false },
        pool: ['grasp', 'maryland', 'hook', 'clip', 'sealer', 'stapler', 'scis', 'bag'],
        need: 'maryland', alt: ['sealer', 'hook'],
        say: 'The appendix is up and the mesentery is spread out. What do you ask the scrub nurse for?',
        ok: 'Good. A Maryland with diathermy, in small bites. It’s the cheapest, and it works as well as anything else.',
        altReply: 'That’s good too. WSES says there’s no difference in outcomes, only in cost. Go ahead.',
        bad: 'Not with that. For the mesentery you need energy: a Maryland, a hook or an energy device.',
        why: 'Monopolar or bipolar diathermy is cheap, with no difference in outcomes. An advanced device at your discretion.',
        fxBad: { risk: 3 },
        refs: [101],
        tip: { res: 'In a thick, edematous mesentery an advanced device can save time.', nurse: 'Diathermy connected and tested. If they ask for LigaSure or Harmonic, have clips ready too.' },
        to: 'meso_tap'
      },
      meso_tap: {
        view: 'scene', kind: 'tap', dt: 8, st: { exposed: true, meso: 0, labels: false },
        say: 'Where do you start with the energy? Tap the spot.',
        hint: 'Tap where you start dividing the mesentery',
        zones: [
          { spot: 'meso', r: 60, g: 'g', he: 'Mesentery, close to the appendix', reply: 'Good. Right against the appendix, in small bites. That way the artery doesn’t get away from you.', fx: { st: { meso: 1 } }, refs: [101] },
          { spot: 'artery', r: 40, g: 'o', he: 'Appendicular artery', reply: 'Right on the artery? You can, but seal it well and don’t rush. One bite too many and it bleeds.', fx: { st: { meso: 1 }, bleedp: 0.15 }, why: 'Better to work in small bites close to the appendix and reach the artery under control.' },
          { spot: 'cecum', r: 45, g: 'b', he: 'Cecal wall', stop: 'Wait. Stop. That’s right up against the cecum. Heat there means a hole on day five.', reply: 'I told you. Heat on the cecum means a late perforation. Let’s move to the right line.', why: 'Prolonged diathermy right against the cecum causes a thermal injury and a late perforation.', fx: { flag: 'burn', therm: 30, risk: 10, st: { meso: 1 } } },
          { spot: 'ileum', r: 45, g: 'b', he: 'Small bowel', stop: 'Wait. Stop. That’s the small bowel. A hot hook next to bowel is not something to play with.', reply: 'That’s the small bowel. I’ll move it out of the way. Only burn what you can see.', why: 'Diathermy near the small bowel causes a thermal injury that shows up a few days later.', fx: { flag: 'burn', therm: 30, risk: 10, st: { meso: 1 } } },
          { spot: 'ureter', r: 40, g: 'b', he: 'Ureter', stop: 'Wait. Stop. That’s the ureter. We’re a long way from it here. Stay up high.', reply: 'That’s the ureter. With the appendix lifted, the ureter is far away. There’s no reason to be there.', why: 'The ureter runs under the cecum. In the mesentery, work close to the appendix.', fx: { ure: 20, risk: 10, st: { meso: 1 } } }
        ],
        missSay: 'Not there. Look for the fatty triangle between the appendix and the artery.',
        tip: { res: 'Start at the tip or from a window at the base, always close to the appendix. The artery comes last.', stu: 'Which artery does the appendicular artery come from?', senior: 'Let them make the mistake right next to the cecum, then stop them. That’s a lesson they won’t forget.' },
        to: 'meso_done'
      },
      meso_done: {
        view: 'scene', kind: 'info', btn: 'To the base', dt: 2, st: { meso: 1, exposed: true },
        roll: [{
          p: function (S) { return (S.cs.id === 'perf' ? 0.18 : S.cs.id === 'retro' ? 0.12 : 0.06) + (S.v.bleedp || 0) + (S.f.burn ? 0.08 : 0); },
          to: 'c_bleed', flag: 'ev_bleed', ev: 'Bleeding from the appendicular artery', fx: { st: { bleed: 1 }, bleed: 2 },
          luck: 'The mesentery could have bled, and it stayed quiet.'
        }],
        say: 'The mesentery is divided and the artery is sealed. Nice. Now the base.',
        to: 'stump_ok'
      },
      c_bleed: {
        view: 'scene', dt: 3, st: { bleed: 1, focus: 'bleed' },
        say: 'Wait. Stop. The artery has slipped and it’s bleeding. The pelvis is filling up. What’s the first thing you do?',
        refs: [101],
        tip: { res: 'No blind clipping. Grasp the mesentery above it, suction, identify, and only then close (convention).', nurse: 'Suction on full, clips and a loop open, and tell anesthesia.', senior: 'Don’t take the instruments away straight away. Give them ten seconds to do the right thing.' },
        opts: [
          { t: 'Grasp the mesentery above the point, suction and identify', g: 'g', to: 'c_bleed_tap', reply: 'Good. Breathe. Hold it firmly, suction. Now show me where it’s coming from.' },
          { t: 'Quick clips into the blood', g: 'b', to: 'c_bleed_tap', fx: { ure: 20, risk: 12, flag: 'blindclip' }, why: 'Blind clips injure the ureter, the iliac vessels and the cecum.', reply: 'Wait. Stop. You can’t see what you’re closing. Grasp and suction first.' },
          { t: 'Burn into the blood with the hook', g: 'b', to: 'c_bleed_tap', fx: { therm: 20, risk: 10, flag: 'burn' }, why: 'Blind diathermy doesn’t stop an artery, and it damages whatever lies underneath.', reply: 'No. Diathermy into a pool of blood doesn’t stop an artery. Grasp first.' }
        ]
      },
      c_bleed_tap: {
        view: 'scene', kind: 'tap', dt: 4, st: { bleed: 1, danger: true, labels: false },
        say: 'We’ve cleared it. Show me exactly where you’re closing.',
        hint: 'Tap the source of the bleeding',
        zones: [
          { spot: 'bleed', r: 55, g: 'g', he: 'Bleeding point on the artery', reply: 'Exactly. One clip, and another. Dry. See? Two minutes and it’s quiet.', fx: { st: { bleed: 0 }, bleed: -2 } },
          { spot: 'meso', r: 50, g: 'o', he: 'Mesentery', reply: 'Close. The end of the artery is a little higher. There, now. Dry.', fx: { st: { bleed: 0 }, bleed: -2, t: 4 } },
          { spot: 'ureter', r: 40, g: 'b', he: 'Ureter', stop: 'Wait. Stop. That’s the ureter, not the artery. Don’t close there.', reply: 'That’s the ureter. I’m taking the clip. The artery is up here.', why: 'The ureter runs under the cecum. Never close a structure you haven’t identified.', fx: { ure: 25, risk: 15, st: { bleed: 0 }, bleed: -2 } },
          { spot: 'eia', r: 40, g: 'b', he: 'Iliac artery', stop: 'Wait. Stop. That’s the iliac artery. Our bleeder is far smaller than that.', reply: 'The iliac artery. Don’t go near it. Here’s the source. Clip here.', why: 'The iliac vessels are under the cecum. Identify before you close.', fx: { risk: 15, st: { bleed: 0 }, bleed: -2 } }
        ],
        missSay: 'Not there. Follow the jet back to its source.',
        tip: { nurse: 'A loaded clip in hand. Count how many clips go in.' },
        to: 'c_bleed_roll'
      },
      c_bleed_roll: {
        view: 'scene', kind: 'info', btn: 'Continue',
        roll: [{ p: function (S) { return S.f.blindclip ? 0.4 : 0.08; }, to: 'c_bleed_more', flag: 'bleedmore', ev: 'The bleeding starts again', fx: { hemo: 1, st: { bleed: 2 } } }],
        say: 'Dry. Irrigate a little and look again. Okay. On to the base.',
        to: 'stump_ok'
      },
      c_bleed_more: {
        view: 'mentor:tense', dt: 10, st: { bleed: 2 },
        say: 'It’s bleeding again, and the blood pressure is dropping. I don’t like this. What do we do?',
        refs: [101],
        tip: { res: 'Uncontrolled bleeding and an unstable patient: get help and convert to open. That’s not a failure, it’s a decision (convention).', nurse: 'Open set, order blood, tell anesthesia.' },
        opts: [
          { t: 'Call for help, apply pressure, and open if it isn’t controlled', g: 'g', to: 'stump_ok', fx: { flag: ['help', 'convert'], t: 30, hemo: -1, bleed: -3, st: { bleed: 0 } }, refs: [101], reply: 'Right. We made a small incision and tied it under direct vision. Dry. A good decision, for the right reason.' },
          { t: 'Keep trying laparoscopically for another ten minutes', g: 'b', to: 'stump_ok', fx: { risk: 15, hemo: 1, t: 20, flag: 'convert' }, why: 'An unstable patient with uncontrolled bleeding doesn’t wait for another attempt.', reply: 'Hold on. The pressure is eighty. We’re opening now. Always make the call before anesthesia makes it for you.' }
        ]
      },

      /* ---- base ---- */
      stump_ok: {
        view: 'scene', dt: 4, st: { exposed: true, meso: 1, bleed: 0, danger: false, focus: 'base' },
        when: [{ if: has('necbase'), to: 'stump_nec' }],
        say: 'The base is clean and healthy. What do we close it with?',
        refs: [101, 125, 126],
        tip: { res: 'On a healthy base: loops, a tie or polymer clips. They’re all safe.', nurse: 'Three loops open or polymer clips, and a stapler available.', stu: 'Why don’t we close the base with diathermy?' },
        opts: [
          { t: 'Two loops on the side that stays and one on the appendix', g: 'g', to: 'stump_tap', fx: { flag: 'dev_loops' }, refs: [101, 126], reply: 'Good. Classic, cheap and safe.', kw: ['loop', 'endoloop', 'loops'] },
          { t: 'Polymer clips', g: 'g', to: 'stump_tap', fx: { flag: 'dev_clips', t: -2 }, refs: [101, 125, 126], reply: 'Excellent. Faster, and just as safe as loops.', kw: ['clip', 'hemolok', 'polymer'] },
          { t: 'Stapler', g: 'g', when: has('cyst'), to: 'stump_tap', fx: { flag: 'dev_stap' }, refs: [102], reply: 'For a cyst with a wide base, yes. A stapler, with healthy margins.' },
          { t: 'Stapler', g: 'o', when: not('cyst'), to: 'stump_tap', fx: { flag: 'dev_stap' }, refs: [101], why: 'On a healthy base a stapler has no advantage, only a higher cost.', reply: 'You can, but on a healthy base it has no advantage and it costs several times as much. We’ll do it.' },
          { t: 'Invert the stump with a suture', g: 'b', to: 'stump_tap', fx: { flag: 'dev_loops', t: 12, risk: 3 }, refs: [101], why: 'Inverting the stump adds nothing and lengthens the operation.', reply: 'That’s from the old textbooks. The same complications, more time and more ileus. A simple loop.' }
        ]
      },
      stump_nec: {
        view: 'scene', dt: 4, st: { exposed: true, meso: 1, bleed: 0, danger: false, focus: 'base', inflam: 3 },
        say: 'Look at the base. It’s black, and perforated on one side. What do we close it with?',
        refs: [101, 102],
        tip: { res: 'A gangrenous or perforated base: staple across the cecum with a margin of healthy tissue. A loop won’t hold here.', nurse: 'Stapler with a thick-tissue cartridge, and a spare cartridge.' },
        opts: [
          { t: 'Staple across the cecum, with a margin of healthy tissue', g: 'g', to: 'stump_tap', fx: { flag: 'dev_stap' }, refs: [101, 102], reply: 'Exactly. We close on healthy tissue, not on gangrene.', kw: ['stapler', 'margin'] },
          { t: 'Two loops as usual', g: 'b', to: 'stump_tap', fx: { flag: ['dev_loops', 'stumprisk'], risk: 15 }, refs: [102], why: 'A loop or a clip doesn’t safely close a gangrenous or perforated base.', reply: 'Hold on. A loop on gangrene is like tying a thread around wet paper. Are you sure? All right, it’s done.' },
          { t: 'Polymer clips', g: 'b', to: 'stump_tap', fx: { flag: ['dev_clips', 'stumprisk'], risk: 15 }, refs: [102], why: 'A clip on a gangrenous base can cut through the tissue and leak.', reply: 'A clip on dead tissue cuts straight through it. It’ll leak. But fine, we’ll see.' }
        ]
      },
      stump_tap: {
        view: 'scene', kind: 'tap', dt: 4,
        say: 'Show me exactly where the closure goes.',
        hint: 'Tap where the loop, clip or stapler goes',
        zones: [
          { spot: 'base', r: 50, g: 'g', he: 'Base, flush with the cecum', reply: 'Exactly. Flush with the cecum, a stump of half a centimeter. That way there’s no stump appendicitis.', fx: function (S) { return { st: { base: dev(S) } }; }, refs: [102] },
          { spot: 'appendix', r: 55, g: 'b', he: 'Middle of the appendix', reply: 'Too high. That leaves a two centimeter stump. And in a few years, well, that’s what you chose.', why: 'A long stump is prone to stump appendicitis. EAES: no more than half a centimeter.', fx: function (S) { return { flag: 'stumplong', risk: 8, st: { base: dev(S) } }; }, refs: [102, 124] },
          { spot: 'icj', r: 45, g: 'b', he: 'Ileocecal junction', stop: 'Wait. Stop. That’s the junction between the small and large bowel. Narrow it and we have an obstruction.', reply: 'That’s the ileocecal junction. I’m moving you to the base.', why: 'Closing too close to the ileocecal junction narrows it.', fx: function (S) { return { risk: 10, st: { base: dev(S) } }; } },
          { spot: 'cecum', r: 45, g: 'o', he: 'Deep in the cecum', reply: 'A little deep into the cecum. With a stapler that’s fine if you have a margin. Just don’t narrow it.', why: 'On a healthy base, close at the base itself and not inside the cecum.', fx: function (S) { return { st: { base: dev(S) } }; } }
        ],
        missSay: 'Not there. Where the taeniae meet, remember?',
        tip: { res: 'The base is where the taeniae meet. A short stump, but not inside the cecum.', nurse: 'A loaded loop or the stapler, depending on what was chosen.' },
        to: 'stump_cut'
      },
      stump_cut: {
        view: 'scene', kind: 'info', btn: 'Take it out', dt: 3, st: { cut: true, focus: 'stump', labels: true },
        say: 'Divide it. Look at the stump: closed, and no bleeding. Nice.',
        tip: { res: 'Don’t burn the stump mucosa. And don’t leave the appendix rolling around in the pelvis.' },
        to: 'extract'
      },

      /* ---- extraction ---- */
      extract: {
        view: 'wall', dt: 4,
        when: [{ if: has('cyst'), to: 'e_extract' }],
        say: 'The appendix is free. How do we get it out?',
        refs: [101, 102],
        tip: { res: 'In a bag through the umbilicus. An inflamed appendix that tears in the port means a wound infection (convention).', nurse: 'A bag of the right size. Check that nothing is left in the port.' },
        opts: [
          { t: 'In a bag, through the umbilical port', g: 'g', to: 'wash', fx: { flag: 'bag', st: { focus: null } }, reply: 'Good. Clean. Nothing touched the wall.', kw: ['pouch', 'bag'] },
          { t: 'No bag, through the trocar', g: 'o', to: 'wash', fx: function (S) { return { ssi: gr(S) >= 2 ? 12 : 4, risk: gr(S) >= 2 ? 6 : 2, st: { focus: null } }; }, why: 'An inflamed appendix pulled through the port can tear and contaminate the wound.', reply: 'Some people accept that for a simple one. With an inflamed one I don’t like it. It smears all over the wall.' },
          { t: 'Pull it through a 5 mm port', g: 'b', to: 'wash', fx: { ssi: 12, iaa: 5, risk: 8, st: { focus: null } }, why: 'An inflamed appendix won’t pass through a 5 mm port. It tears.', reply: 'Hold on. Through a five? It’s torn in the port, and half of it is still inside. We’ll get the rest out in a bag.' }
        ]
      },
      e_extract: {
        view: 'wall', dt: 6,
        say: 'The cystic appendix is free. How does it come out?',
        refs: [119],
        tip: { res: 'In a bag, without grasping the cyst and without opening it. Extend the incision if you need to.', nurse: 'A large, strong bag. A specimen pot for fluid.' },
        opts: [
          { t: 'In a bag, without touching the cyst, extending the incision if needed', g: 'g', to: 'wash', fx: { flag: 'bag' }, refs: [119], reply: 'Exactly. We extended it by a centimeter. Intact, no rupture. That’s the whole game here.' },
          { t: 'Empty the cyst with a needle so it fits through the port', g: 'b', to: 'c_pmp', fx: { flag: 'mucinspill', risk: 25 }, refs: [119], why: 'Opening a mucinous neoplasm spills mucin into the peritoneum.', reply: 'Wait. Stop. No. But it’s already happened. There’s mucin in the field.' },
          { t: 'Grab it and pull it through the port', g: 'b', to: 'c_pmp', fx: { flag: 'mucinspill', risk: 20 }, refs: [119], why: 'Grasping the cyst and pulling it through the port ruptures it.', reply: 'Hold on. It’s ruptured in the port. That’s exactly what we were trying to prevent.' }
        ]
      },
      c_pmp: {
        view: 'scene', dt: 10, st: { focus: null },
        say: 'There’s mucin in the field. What do we do now?',
        refs: [119],
        tip: { res: 'Don’t extend the operation. Document, take a sample and refer to a peritoneal malignancy center (convention, in line with PSOGI).', senior: 'What matters here is what you don’t do.' },
        opts: [
          { t: 'Document, take a sample and refer to a specialist center', g: 'g', to: 'wash', fx: { flag: 'bag' }, refs: [119], reply: 'Right. We don’t try to be heroes. The center will know what to do.' },
          { t: 'Try to clear all the mucin now', g: 'b', to: 'wash', fx: { risk: 10, t: 40 }, refs: [119], why: 'An unplanned operation makes the definitive treatment at the center harder.', reply: 'No. That’s an operation for a specialist center, not for three in the morning. We document and come out.' }
        ]
      },

      /* ---- suction, drain, closure ---- */
      wash: {
        view: 'scene', dt: 6,
        when: [{ if: function (S) { return !S.st.pus && gr(S) < 2; }, to: 'close' }],
        st: { pus: true, cut: true },
        say: 'There’s pus in the pelvis and the right gutter. What do we do about it?',
        refs: [101, 102, 110],
        tip: { res: 'Targeted suction of every collection: pelvis, gutter, under the liver and between the loops. Irrigation adds nothing.', nurse: 'Suction irrigator. Warm fluid if they ask for it.', stu: 'Where does fluid collect when the patient is head down?' },
        opts: [
          { t: 'Targeted suction: pelvis, gutter, under the liver and between the loops', g: 'g', to: 'drain', fx: { iaa: -10, st: { pus: false } }, refs: [101, 102], reply: 'Good. Don’t forget under the liver. Something always stays there. Clean.', kw: ['suction', 'suck'] },
          { t: 'Irrigate with several liters', g: 'o', to: 'drain', fx: { t: 10, iaa: 3, st: { pus: false } }, refs: [102, 110], why: 'Irrigation didn’t reduce abscesses compared with suction alone.', reply: 'It doesn’t do much harm, but it doesn’t help either. In the trial in children there was no difference. Just make sure you suck it all out afterwards.' },
          { t: 'Leave it, the body will absorb it', g: 'b', to: 'drain', fx: { iaa: 25, risk: 10 }, refs: [101], why: 'Fluid left in the gutter and the pelvis raises the risk of an abscess.', reply: 'Hold on. The body won’t absorb pus. It’ll build an abscess out of it. Suction.' }
        ]
      },
      drain: {
        view: 'scene', dt: 2,
        say: 'Do we leave a drain?',
        refs: [101, 103, 112],
        tip: { res: 'WSES: no drain in adults after appendectomy for complicated appendicitis. In the Cochrane review the drain didn’t prevent abscesses.', nurse: 'If they ask for a drain: the size, and a collection bag.' },
        opts: [
          { t: 'No drain', g: 'g', to: 'close', refs: [101, 103, 112], reply: 'Right. A drain doesn’t prevent an abscess. It just makes the stay longer.' },
          { t: 'A drain, just to be safe', g: 'b', when: function (S) { return !S.f.stumprisk; }, to: 'close', fx: { flag: 'drain', risk: 4 }, refs: [112], why: 'A routine drain didn’t prevent abscesses and was linked to a longer stay.', reply: 'To be safe for whom? In complicated appendicitis in adults we don’t place one. All right, we’ll take it out tomorrow.' },
          { t: 'A drain, because I’m not sure about the stump', g: 'o', when: has('stumprisk'), to: 'close', fx: { flag: 'drain' }, refs: [102], why: 'A drain doesn’t replace a good closure. If you’re unsure of the stump, close it better.', reply: 'The drain won’t hold the stump. But if it leaks, at least we’ll know early. We’ll put one in.' }
        ]
      },
      close: {
        view: 'wall', kind: 'check', dt: 8,
        say: 'Before we close. What do you do? Tick them.',
        items: [
          { t: 'A last look at the stump and the mesentery', need: 1, miss: 'A last look at the stump. Two seconds that save a reoperation.' },
          { t: 'Look for a dropped fecalith, if there was a tear', need: 1, miss: 'The fecalith. Even if you didn’t see one, look.' },
          { t: 'Remove the ports under vision', need: 1, miss: 'The ports come out under vision. That’s how you catch bleeding from the wall.' },
          { t: 'Close the fascia at the 10-12 port', need: 1, miss: 'The fascia at the umbilicus. Otherwise he’s back in a year with a hernia.' },
          { t: 'Close the fascia at every 5 mm port', no: 1, miss: 'A five millimeter port doesn’t need fascial closure. That’s convention.' }
        ],
        ok: 'Good. A dry stump, a clean pelvis, ports out under vision. We close.',
        fx: { b: { risk: 4, flag: 'porthernia' } },
        tip: { res: 'Most of what’s here is convention. But it’s good convention.', nurse: 'Final count, suture for the fascia, and record a fecalith if one was removed.' },
        to: 'n_count'
      },
      n_count: {
        view: 'tray', kind: 'check', for: ['nurse'], skip: 'sen_teach', dt: 3,
        say: 'Before we close the skin. What do you check?',
        items: [
          { t: 'Swab, needle and instrument count', need: 1, miss: 'The count. Nobody leaves the room without it.' },
          { t: 'Specimen in a labeled pot', need: 1, miss: 'The specimen. An appendix that never reaches pathology is an appendix nobody examined.' },
          { t: 'Pelvic culture, if one was taken', need: 1, miss: 'The culture. Don’t let it get forgotten on the table.' },
          { t: 'How many clips and loops went in', need: 1, miss: 'Record what’s been left in the abdomen. Clips and loops.' }
        ],
        ok: 'Excellent. The count is correct and the specimen is labeled.',
        to: 'sen_teach'
      },
      sen_teach: {
        view: 'mentor:or', kind: 'info', for: ['senior'], skip: 'path', btn: 'Next',
        say: 'As the teacher: where did you let them work on their own, and where did you take over? Think about it before you talk it through with them.',
        tip: { senior: 'Three moments to debrief: finding the base, controlling the artery, and the decision about the closure. Ask them what they would do differently.' },
        to: 'path'
      },

      /* ================= after ================= */
      path: {
        view: 'mentor:or', dt: 1,
        when: [{ if: has('noappy'), to: 'course' }],
        say: 'The specimen is on the table. Do we send it to pathology?',
        refs: [101, 102],
        tip: { res: 'Always. A neuroendocrine tumor is the most common finding, and you can’t see it by eye.', stu: 'What is the most common tumor of the appendix?' },
        opts: [
          { t: 'Always send it', g: 'g', to: 'abx', refs: [101], reply: 'Right. Every appendix goes to pathology, without exception.' },
          { t: 'Only if it looks suspicious', g: 'b', to: 'abx', fx: { flag: 'pathskip', risk: 8 }, refs: [101, 102], why: 'An unexpected finding can’t be seen by eye. WSES recommends routine histology.', reply: 'Hold on. An eight millimeter tumor can’t be seen by eye. We send it. This time I’ll send it for you.' }
        ]
      },
      abx: {
        view: 'mentor:ward', dt: 2,
        say: 'On the ward. Antibiotics after the operation: yes or no, and for how long?',
        refs: [101, 102, 108, 109],
        tip: { res: 'Simple: none. Complicated with source control: a short course, two to five days.', nurse: 'Check that the order includes a stop date.', stu: 'What does source control mean?' },
        opts: [
          { t: 'No antibiotics after the operation', g: 'g', when: function (S) { return gr(S) <= 1; }, to: 'course', refs: [101, 102], reply: 'Right. In simple appendicitis the dose before the operation is enough.' },
          { t: 'No antibiotics after the operation', g: 'b', when: function (S) { return gr(S) >= 2; }, to: 'course', fx: { iaa: 10, risk: 8 }, refs: [101], why: 'In complicated appendicitis a short course is given after the operation.', reply: 'Hold on. That was complicated. A short course, but a course.' },
          { t: 'A short course: two to five days', g: 'g', when: function (S) { return gr(S) >= 2; }, to: 'course', refs: [101, 108, 109], reply: 'Exactly. In APPIC, two days were no worse than five. We start and reassess.' },
          { t: 'A short course: two to five days', g: 'o', when: function (S) { return gr(S) <= 1; }, to: 'course', fx: { harm: 10 }, refs: [101], why: 'In simple appendicitis there’s no benefit from antibiotics after the operation.', reply: 'In simple appendicitis? There’s no need. Only side effects. We stop.' },
          { t: 'Ten days, just to be safe', g: 'b', to: 'course', fx: { harm: 25, risk: 6 }, refs: [108, 109], why: 'A long course added no benefit, only side effects and resistance.', reply: 'Ten days? In STOP-IT, four days were as good as eight. We shorten it.' }
        ]
      },
      course: {
        view: 'mentor:ward', dt: 0,
        roll: [
          { p: function (S) { return S.f.entmiss ? 0.9 : 0; }, to: 'c_ent', flag: 'ev_entlate', ev: 'Unrepaired bowel injury' },
          { p: function (S) { return S.f.stumprisk ? 0.4 : (S.f.necbase ? 0.03 : 0.01); }, to: 'c_stump', flag: 'ev_stump', ev: 'Stump leak', luck: 'The stump held, even though the closure wasn’t right for a gangrenous base.' },
          { p: function (S) { return S.f.burn ? 0.3 : 0; }, to: 'c_ent', flag: 'ev_burn', ev: 'Late perforation after a thermal injury', luck: 'The heat near the bowel didn’t cause a perforation, this time.' },
          { p: function (S) { return Math.min(0.6, (S.v.grade >= 3 ? 0.1 : S.v.grade === 2 ? 0.05 : 0.02) + Math.max(0, S.v.iaa || 0) / 100 + (S.f.fecleft ? 0.15 : 0)); }, to: 'c_iaa', flag: 'ev_iaa', ev: 'Pelvic abscess', luck: 'Pus or a stone was left in the abdomen, and no abscess formed.' },
          { p: function (S) { return Math.min(0.5, 0.03 + (S.v.ssi || 0) / 100 + (S.f.abxpre ? 0 : 0.06)); }, to: 'c_ssi', flag: 'ev_ssi', ev: 'Umbilical wound infection', luck: 'The appendix touched the wall, and the wound is still clean.' }
        ],
        say: 'The morning after. He’s eating and walking, with mild pain and no fever. What do we do?',
        tip: { res: 'Anyone who improves every day goes home. Anyone who doesn’t improve gets worked up (convention).', nurse: 'Discharge advice: fever, worsening pain, discharge from the wound.' },
        refs: [101],
        opts: [
          { t: 'Discharge today with advice', g: 'g', to: 'path_res', reply: 'Good. Home. And tell him when to come back.' },
          { t: 'Keep him three more days for observation', g: 'o', to: 'path_res', fx: { harm: 5 }, why: 'A patient who is improving doesn’t need a long stay.', reply: 'What for? He’s well. An unnecessary admission is a risk too.' }
        ]
      },
      c_stump: {
        dt: 30, view: 'img:ct', cap: 'CT: air and fluid next to the cecum',
        fx: { hemo: 1 },
        say: 'Day three. Sudden pain, a fever of thirty-nine, and the abdomen is rigid everywhere. The CT shows air and fluid next to the cecum. What do we do?',
        refs: [102],
        tip: { res: 'Generalized peritonitis or an unstable patient: reoperate. A contained collection in a stable patient: antibiotics and drainage (convention).', nurse: 'Fluid resuscitation, cultures, antibiotics, and tell the OR.' },
        opts: [
          { t: 'Resuscitate, antibiotics and reoperate: washout and re-closure with a stapler', g: 'g', to: 'c_stump_or', fx: { flag: 'relook' }, reply: 'Right. With an abdomen like that we don’t wait for radiology. To the OR.' },
          { t: 'Percutaneous drainage and antibiotics', g: 'o', to: 'c_stump_or', fx: { risk: 8, flag: 'relook', t: 120 }, why: 'Percutaneous drainage suits a contained collection in a stable patient. With generalized peritonitis, you operate.', reply: 'If it were a contained collection, yes. With an abdomen like this? We tried, and he got worse. To the OR.' },
          { t: 'Wait a day and see', g: 'b', to: 'c_stump_or', fx: { risk: 20, hemo: 1, flag: 'relook' }, why: 'A stump leak with peritonitis doesn’t get better on its own.', reply: 'Hold on. Wait for what? By the morning he’s septic. We go up now.' }
        ]
      },
      c_stump_or: {
        view: 'scene', kind: 'info', btn: 'Continue', dt: 90, st: { cut: true, stump: 'leak', base: 'loops', focus: 'leak', labels: true },
        say: 'There. The stump is open. Suction, then a stapler across healthy cecum. Next time, a gangrenous base gets a stapler the first time round.',
        refs: [101, 102],
        to: 'path_res'
      },
      c_iaa: {
        dt: 20, view: 'img:ct', cap: 'CT: 5 cm pelvic collection',
        say: 'Day five. Fever of thirty-eight point six, and the CRP is rising. The CT shows a five centimeter collection in the pelvis. What do we do?',
        refs: [102, 108, 111],
        tip: { res: 'Start with antibiotics. If there’s no improvement, percutaneous drainage. Then a short fixed course.', stu: 'Why does laparoscopy have slightly more abscesses and fewer wound infections?' },
        opts: [
          { t: 'Antibiotics and percutaneous drainage of the collection', g: 'g', to: 'c_iaa_abx', refs: [102], reply: 'Good. Five centimeters, so we drain it. Radiology is already on the way.' },
          { t: 'Laparotomy now', g: 'b', to: 'c_iaa_abx', fx: { risk: 15, flag: 'relook' }, refs: [102], why: 'A contained abscess is treated with antibiotics and drainage, not a reoperation.', reply: 'Hold on. For one contained collection? Radiology drains that in ten minutes.' },
          { t: 'Oral antibiotics and discharge', g: 'b', to: 'c_iaa_abx', fx: { risk: 12 }, why: 'A five centimeter collection with a rising fever isn’t sent home.', reply: 'With a five centimeter collection and a fever? He’ll be back in two days. We drain it.' }
        ]
      },
      c_iaa_abx: {
        dt: 5, view: 'mentor:ward',
        say: 'The drain worked and the fever is down. How long do we continue the antibiotics?',
        refs: [108],
        opts: [
          { t: 'A short fixed course, about four days', g: 'g', to: 'c_iaa_q', refs: [108], reply: 'Exactly. STOP-IT: four days after source control, as good as eight.' },
          { t: 'Three weeks, until the CRP is back to zero', g: 'b', to: 'c_iaa_q', fx: { harm: 25, risk: 5 }, refs: [108], why: 'After source control a short course is as good as a long one.', reply: 'The CRP doesn’t have to be zero. After drainage, a short course.' }
        ]
      },
      c_iaa_q: {
        kind: 'info', view: 'mentor:debrief', btn: 'Got it',
        say: 'And looking back, think: did you suction the whole pelvis? Did you get the stone out? An abscess starts in the OR.',
        refs: [101, 102, 130],
        to: 'path_res'
      },
      c_ssi: {
        dt: 10, view: 'wall',
        say: 'Day six, in clinic. The umbilicus is red, warm and discharging. What do we do?',
        refs: [102],
        tip: { res: 'Open and drain. Antibiotics only when there’s cellulitis around it or systemic signs (convention).', nurse: 'Dressing set, culture swab.' },
        opts: [
          { t: 'Open the wound, drain it and dress it', g: 'g', to: 'path_res', reply: 'Right. A little pus came out, and that’s it. He’ll feel better tomorrow.' },
          { t: 'Oral antibiotics alone', g: 'o', to: 'path_res', fx: { harm: 8 }, why: 'Pus in a wound needs draining. Antibiotics alone won’t be enough.', reply: 'Antibiotics don’t drain pus. We take out a couple of stitches.' },
          { t: 'That’s normal, come back in a week', g: 'b', to: 'path_res', fx: { risk: 8 }, why: 'A red, discharging wound is an infection until proven otherwise.', reply: 'Hold on. Red, warm and discharging isn’t normal. We open it now.' }
        ]
      },
      c_ent: {
        dt: 30, view: 'mentor:ward',
        fx: { hemo: 1 },
        say: 'Day two. Heart rate one twenty, pain out of proportion, and a distended abdomen. Something’s wrong. What do we do?',
        tip: { res: 'Tachycardia and a distended abdomen after surgery: a bowel injury until proven otherwise. CT and reoperation (convention). A thermal injury shows up later.', nurse: 'Hourly observations, and tell the attending.' },
        opts: [
          { t: 'Urgent CT, antibiotics and to the OR', g: 'g', to: 'c_ent_or', fx: { flag: 'relook' }, reply: 'Right. The CT shows free air and fluid. We go up.' },
          { t: 'It’s normal pain after surgery, give analgesia', g: 'b', to: 'c_ent_or', fx: { risk: 25, hemo: 1, flag: ['relook', 'entmiss_late'] }, why: 'Pain out of proportion with tachycardia is a complication until proven otherwise.', reply: 'Hold on. A heart rate of one twenty isn’t fixed with painkillers. By tonight he’s septic and we’re in the OR.' }
        ]
      },
      c_ent_or: {
        view: 'mentor:or', kind: 'info', btn: 'Continue', dt: 120,
        say: 'A hole in the small bowel, exactly where there was heat or a grasper. We sutured it and washed out. He’ll be fine, but it cost him a week.',
        tip: { res: 'Most of these injuries happen in a single moment of inattention. That’s why you get stopped early.' },
        to: 'path_res'
      },
      path_res: {
        kind: 'info', view: 'mentor:ward', btn: 'Next',
        when: [
          { if: has('noappy'), to: 'late' },
          { if: has('pathskip'), to: 'path_lost' },
          { if: function (S) { return S.f.cyst && S.f.mucinspill; }, to: 'c_pmp_res' },
          { if: has('cyst'), to: 'c_lamn' }
        ],
        roll: [
          { p: function (S) { return S.cs.id === 'elder' ? 0.15 : 0.02; }, to: 'c_net_s', flag: 'net', ev: 'Pathology: a small neuroendocrine tumor' },
          { p: function (S) { return S.cs.id === 'elder' ? 0.06 : 0.01; }, to: 'c_net_m', flag: 'net', ev: 'Pathology: a 1.5 cm neuroendocrine tumor' },
          { p: function (S) { return S.cs.id === 'elder' ? 0.05 : 0.005; }, to: 'c_net_l', flag: 'net', ev: 'Pathology: a 2.4 cm neuroendocrine tumor' }
        ],
        say: 'The pathology result is back. It matches what we saw, no surprises.',
        to: 'late'
      },
      path_lost: {
        kind: 'info', view: 'mentor:debrief', btn: 'Got it',
        say: 'We sent it in the end, but only because I insisted. Remember that your note said not sent.',
        refs: [101],
        to: 'path_res2'
      },
      path_res2: {
        kind: 'info', view: 'mentor:ward', btn: 'Next',
        roll: [{ p: 0.03, to: 'c_net_s', flag: 'net', ev: 'Pathology: a small neuroendocrine tumor' }],
        say: 'The result: acute appendicitis, and nothing else.',
        to: 'late'
      },
      c_net_s: {
        dt: 0, view: 'mentor:ward',
        say: 'Pathology: an eight millimeter neuroendocrine tumor at the tip, clear margins, no invasion. What do we do?',
        refs: [120],
        tip: { res: 'Under a centimeter, at the tip, with no risk factors: the appendectomy is usually enough.', stu: 'What is the most common tumor of the appendix?' },
        opts: [
          { t: 'The appendectomy is enough. Explain and document', g: 'g', to: 'late', refs: [120], reply: 'Right. He’s cured. Explaining that to the patient matters just as much.' },
          { t: 'Completion right hemicolectomy', g: 'b', to: 'late', fx: { risk: 12 }, refs: [120], why: 'For a tumor under a centimeter at the tip with no risk factors, a right hemicolectomy isn’t needed.', reply: 'Hold on. For eight millimeters at the tip with clear margins? That’s a big operation with no benefit.' }
        ]
      },
      c_net_m: {
        dt: 0, view: 'mentor:ward',
        say: 'Pathology: a one point five centimeter neuroendocrine tumor, close to the base. What do we do?',
        refs: [102, 120],
        tip: { res: 'Between 1 and 2 cm, decide by risk factors at a multidisciplinary meeting. EAES set a lower threshold than ENETS.', senior: 'A good example of guidelines not always agreeing.' },
        opts: [
          { t: 'Multidisciplinary meeting, based on the risk factors', g: 'g', to: 'late', refs: [120], reply: 'Good. This is exactly the kind of case the meeting is for.' },
          { t: 'Right hemicolectomy straight away', g: 'o', to: 'late', refs: [102, 120], why: 'Between 1 and 2 cm the decision depends on risk factors. EAES gives some grounds for it.', reply: 'You can defend that with EAES. But the meeting and the risk factors come first.' },
          { t: 'Nothing, it’s been removed', g: 'b', to: 'late', fx: { risk: 10 }, refs: [120], why: 'A tumor of this size close to the base needs assessment.', reply: 'Hold on. One point five, close to the base, isn’t just removed and done. A meeting, at the very least.' }
        ]
      },
      c_net_l: {
        dt: 0, view: 'mentor:ward',
        say: 'Pathology: a two point four centimeter neuroendocrine tumor. What do we do?',
        refs: [102, 120],
        tip: { res: 'Over 2 cm: completion right hemicolectomy.' },
        opts: [
          { t: 'Completion right hemicolectomy', g: 'g', to: 'late', refs: [102, 120], reply: 'Right. Over two centimeters, it’s no longer up for discussion.' },
          { t: 'Follow-up only', g: 'b', to: 'late', fx: { risk: 15 }, refs: [120], why: 'Over 2 cm, the risk of lymph node spread justifies a right hemicolectomy.', reply: 'Hold on. Over two centimeters? A right hemicolectomy.' }
        ]
      },
      c_lamn: {
        dt: 0, view: 'mentor:ward',
        say: 'Pathology: LAMN, a low-grade appendiceal mucinous neoplasm, with no rupture and clear margins. What next?',
        refs: [118, 119],
        tip: { res: 'Not a cystadenoma and not a mucocele. Refer to a center, with follow-up as the center decides.', stu: 'Why LAMN and not cystadenoma?' },
        opts: [
          { t: 'Refer to a peritoneal malignancy center and follow up', g: 'g', to: 'late', refs: [118, 119], reply: 'Exactly. And you took it out intact, so her outlook is excellent.' },
          { t: 'It’s a benign cystadenoma, no follow-up needed', g: 'b', to: 'late', fx: { risk: 10 }, refs: [118], why: 'According to PSOGI this is a neoplasm that needs follow-up. The term cystadenoma is no longer used.', reply: 'Hold on. That term doesn’t exist anymore, and the follow-up very much does. We refer her.' },
          { t: 'Completion right hemicolectomy', g: 'b', to: 'late', fx: { risk: 10 }, refs: [119], why: 'For an intact LAMN with clear margins, a right hemicolectomy adds nothing.', reply: 'There’s no need. It came out intact, with clear margins. We refer her and follow up.' }
        ]
      },
      c_pmp_res: {
        kind: 'info', view: 'mentor:ward', btn: 'Got it',
        say: 'Pathology: LAMN, with a rupture and mucin on the surface. She’s being referred to the center. Because of the rupture, her follow-up will be closer.',
        refs: [118, 119],
        to: 'late'
      },
      late: {
        kind: 'info', view: 'mentor:ward', btn: 'To the summary',
        roll: [
          { p: function (S) { return S.f.stumplong ? 0.5 : 0; }, to: 'c_stumpapp', flag: 'ev_stumpapp', ev: 'Stump appendicitis, years later', luck: 'You left a long stump and it hasn’t come back. Yet.' },
          { p: function (S) { return S.f.fecleft && !S.f.ev_iaa ? 0.6 : 0; }, to: 'c_fec', flag: 'ev_fec', ev: 'Recurrent abscess around a fecalith', luck: 'The fecalith that was left behind didn’t cause an abscess.' },
          { p: function (S) { return S.f.porthernia ? 0.3 : 0; }, to: 'c_hernia', flag: 'ev_hernia', ev: 'Umbilical port-site hernia' }
        ],
        say: 'Six weeks later, in clinic. The wounds look good and he’s back at work. That’s how it’s meant to end.',
        to: 'end'
      },
      c_stumpapp: {
        dt: 0, view: 'mentor:ward',
        say: 'Two years later. He’s in the ER with right lower quadrant pain and a fever, and he says: but they took my appendix out. What do you think?',
        refs: [102, 124],
        tip: { res: 'Stump appendicitis: think of it, get a CT, and remove the stump. It presents late, so it tends to be perforated.' },
        opts: [
          { t: 'Stump appendicitis. CT and removal of the stump', g: 'g', to: 'end', refs: [124, 102], reply: 'Right. The CT shows a two centimeter stump with a stone in it. That’s the stump we left back then.' },
          { t: 'It can’t be appendicitis', g: 'b', to: 'end', fx: { risk: 10 }, refs: [102], why: 'That exact thought is what leads to a late diagnosis and a perforation.', reply: 'Hold on. That’s exactly what everyone thinks, and that’s why they arrive perforated. A long stump, remember?' }
        ]
      },
      c_fec: {
        dt: 0, view: 'img:ct', cap: 'CT: pelvic collection with a calcification inside',
        say: 'Three months later. A second abscess in the pelvis, and the CT shows a calcification inside the collection. What is it, and what do we do?',
        refs: [130],
        tip: { res: 'A retained fecalith. Drainage and antibiotics, and if it comes back again, remove the stone (convention).' },
        opts: [
          { t: 'A retained stone. Drain it, and remove it if it comes back again', g: 'g', to: 'end', refs: [130], reply: 'Right. We drained it, and this time it’s quiet. But this story started in the OR.' },
          { t: 'Another round of antibiotics', g: 'b', to: 'end', fx: { risk: 8 }, refs: [130], why: 'An abscess around a foreign body doesn’t go away with antibiotics alone.', reply: 'Antibiotics won’t dissolve a stone. We drain it, and if it comes back, we take it out.' }
        ]
      },
      c_hernia: {
        kind: 'info', view: 'wall', btn: 'To the summary',
        say: 'A year later. A bulge at the umbilicus. A port-site hernia. Someone didn’t close the fascia. A small repair, but an unnecessary one.',
        to: 'end'
      },

      end: { end: true }
    }
  });
})();
