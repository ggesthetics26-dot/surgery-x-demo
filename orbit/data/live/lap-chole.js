/* ORBIT live case: laparoscopic cholecystectomy with James, an attending who operates with you.
   Clinical map: research/chole-branching.md (5 cases, 10 decision points, complication branches, refs 54-74).
   Every line is one static string so it can be recorded. Fictional cases only, no patient data.
   Scene spots used (js/scenes/chole.js): hartmann, cduct, cart, chd, cbd, rha, duod, rouv, seg4, plate, node, aberr, liver.
   Wall landmarks used (js/scenes/wall.js): xiphoid, umb, costalAtMclR, costalAtMclL, costalAtAalR. */
(function () {
  'use strict';
  var O = window.ORBIT = window.ORBIT || {};

  Object.assign(O.refs = O.refs || {}, {
    54: { a: 'Yokoe M', y: 2018, j: 'J Hepatobiliary Pancreat Sci', t: 'Tokyo Guidelines 2018: diagnostic criteria and severity grading of acute cholecystitis (with videos)', u: 'https://pubmed.ncbi.nlm.nih.gov/29032636/' },
    55: { a: 'Okamoto K', y: 2018, j: 'J Hepatobiliary Pancreat Sci', t: 'Tokyo Guidelines 2018: flowchart for the management of acute cholecystitis', u: 'https://pubmed.ncbi.nlm.nih.gov/29045062/' },
    56: { a: 'Csendes A', y: 1989, j: 'Br J Surg', t: 'Mirizzi syndrome and cholecystobiliary fistula: a unifying classification', u: 'https://pubmed.ncbi.nlm.nih.gov/2597969/' },
    57: { a: 'Flum DR', y: 2003, j: 'JAMA', t: 'Intraoperative cholangiography and risk of common bile duct injury during cholecystectomy', u: 'https://pubmed.ncbi.nlm.nih.gov/12672731/' },
    58: { a: 'Törnqvist B', y: 2012, j: 'BMJ', t: 'Effect of intended intraoperative cholangiography and early detection of bile duct injury on survival after cholecystectomy: population based cohort study', u: 'https://pubmed.ncbi.nlm.nih.gov/23060654/' },
    59: { a: 'Dasari BVM', y: 2013, j: 'Cochrane Database Syst Rev', t: 'Surgical versus endoscopic treatment of bile duct stones', u: 'https://pubmed.ncbi.nlm.nih.gov/24338858/' },
    60: { a: 'Buxbaum JL', y: 2019, j: 'Gastrointest Endosc', t: 'ASGE guideline on the role of endoscopy in the evaluation and management of choledocholithiasis', u: 'https://pubmed.ncbi.nlm.nih.gov/30979521/' },
    61: { a: 'Williams E', y: 2017, j: 'Gut', t: 'Updated guideline on the management of common bile duct stones (CBDS)', u: 'https://pubmed.ncbi.nlm.nih.gov/28122906/' },
    62: { a: 'de\'Angelis N', y: 2021, j: 'World J Emerg Surg', t: '2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy', u: 'https://pubmed.ncbi.nlm.nih.gov/34112197/' },
    63: { a: 'Elshaer M', y: 2015, j: 'JAMA Surg', t: 'Subtotal cholecystectomy for "difficult gallbladders": systematic review and meta-analysis', u: 'https://pubmed.ncbi.nlm.nih.gov/25548894/' },
    64: { a: 'Gutt CN', y: 2013, j: 'Ann Surg', t: 'Acute cholecystitis: early versus delayed cholecystectomy, a multicenter randomized trial (ACDC study, NCT00447304)', u: 'https://pubmed.ncbi.nlm.nih.gov/24022431/' },
    65: { a: 'Neudecker J', y: 2002, j: 'Surg Endosc', t: 'The European Association for Endoscopic Surgery clinical practice guideline on the pneumoperitoneum for laparoscopic surgery', u: 'https://pubmed.ncbi.nlm.nih.gov/12015619/' },
    66: { a: 'Brockmann JG', y: 2002, j: 'Surg Endosc', t: 'Complications due to gallstones lost during laparoscopic cholecystectomy', u: 'https://pubmed.ncbi.nlm.nih.gov/11984670/' },
    67: { a: 'Strasberg SM', y: 2011, j: 'HPB (Oxford)', t: 'An analytical review of vasculobiliary injury in laparoscopic and open cholecystectomy', u: 'https://pubmed.ncbi.nlm.nih.gov/21159098/' },
    68: { a: 'Andall RG', y: 2016, j: 'Surg Radiol Anat', t: 'The clinical anatomy of cystic artery variations: a review of over 9800 cases', u: 'https://pubmed.ncbi.nlm.nih.gov/26698600/' },
    69: { a: 'Ahmad G', y: 2019, j: 'Cochrane Database Syst Rev', t: 'Laparoscopic entry techniques', u: 'https://pubmed.ncbi.nlm.nih.gov/30657163/' },
    70: { a: 'Schnelldorfer T', y: 2012, j: 'J Gastrointest Surg', t: 'What is the duct of Luschka? A systematic review', u: 'https://pubmed.ncbi.nlm.nih.gov/22215244/' },
    71: { a: 'Gurusamy KS', y: 2013, j: 'Cochrane Database Syst Rev', t: 'Routine abdominal drainage versus no abdominal drainage for uncomplicated laparoscopic cholecystectomy', u: 'https://pubmed.ncbi.nlm.nih.gov/24000011/' },
    72: { a: 'Rio-Tinto R', y: 2021, j: 'GE Port J Gastroenterol', t: 'Endoscopic Treatment of Post-Cholecystectomy Biliary Leaks', u: 'https://pubmed.ncbi.nlm.nih.gov/34386554/' },
    73: { a: 'van der Voort M', y: 2004, j: 'Br J Surg', t: 'Bowel injury as a complication of laparoscopy', u: 'https://pubmed.ncbi.nlm.nih.gov/15376204/' },
    74: { a: 'Wildey B', y: 2024, j: 'Arch Gynecol Obstet', t: 'Cardiovascular collapse during laparoscopy: a brief overview', u: 'https://pubmed.ncbi.nlm.nih.gov/38015208/' }
  });

  /* ---------- small helpers for the graph ---------- */
  function is() { var a = [].slice.call(arguments); return function (S) { return a.indexOf(S.cs.id) >= 0; }; }
  function not() { var a = [].slice.call(arguments); return function (S) { return a.indexOf(S.cs.id) < 0; }; }
  function has(f) { return function (S) { return !!S.f[f]; }; }
  function lacks(f) { return function (S) { return !S.f[f]; }; }
  function yes() { return true; }
  function v(S, k) { return S.v[k] || 0; }
  function pct(x) { return x < 0 ? 0 : x > .9 ? .9 : x; }

  /* trocar layouts on the wall scene (patient's right on the viewer's LEFT, 13 px per cm) */
  var US = { id: 'us', he: 'American layout', pts: [{ lm: 'umb' }, { lm: 'xiphoid', dx: -8, dy: 52 }, { lm: 'costalAtMclR', dy: 30 }, { lm: 'costalAtAalR', dy: 40 }] };
  var FR = { id: 'fr', he: 'French layout', pts: [{ lm: 'umb', dy: -20 }, { lm: 'xiphoid', dy: 52 }, { lm: 'costalAtMclL', dy: 34 }, { lm: 'costalAtAalR', dy: 26 }] };
  var DANGER = [
    { xy: [146, 535], r: 48, he: 'Close to the iliac crest', say: 'Too low. From there you can’t pull the fundus up over the liver. Come up, just below the ribs.', why: 'A lateral port placed too low can’t lift the fundus over the liver (convention).', fx: { exposure: -5 } },
    { xy: [300, 180], r: 20, he: 'On the xiphoid', say: 'On the bone? Come down two or three centimeters below the xiphoid.', why: 'A port on the xiphoid itself won’t go in and it hurts. Go just below it (convention).' }
  ];
  var SCAR = { xy: [300, 318], r: 44, he: 'On the midline scar', say: 'Hold on. That’s the scar. There may be bowel stuck underneath. We look from the inside first, then we place the trocar.', why: 'Under the scar of a previous operation there are often bowel adhesions. A trocar there only under vision from inside.', refs: [73], fx: { bowel: 3 } };

  O.liveCase('lap-chole', {
    title: 'Laparoscopic cholecystectomy', proc: 'lap-chole', scene: 'chole', ai: 'chole',
    mentor: { name: 'James', init: 'J', role: 'Attending surgeon · your mentor' },
    hello: 'Morning. You’re with me in OR three today. We’ve got a few gallbladders on the list. Which one would you like to take?',
    base: { variant: 'normal', inflam: 0, adhesions: false, retract: 'none', peel: 0, clips: false, cut: false, bed: 0, bleed: 0, bile: false, injury: null, stones: false, mode: 'lap', cbdStone: false, rouviere: false, labels: false, focus: null },
    cases: [
      { id: 'easy', he: 'Elective gallbladder', story: 'Laura, 46. Recurrent biliary colic, stones on ultrasound, a thin wall and normal liver enzymes.', lvl: 'Level 1 · Building the sequence', chart: { hx: ['Three attacks of biliary colic in the last six months', 'No previous abdominal surgery'], labs: [['WBC', '7.8'], ['Bilirubin', '0.6'], ['ALP', '82'], ['ALT', '24']], img: 'Ultrasound: gallstones, wall 2 mm, common bile duct 4 mm' }, st: { variant: 'normal', inflam: 0 }, v: {}, f: [] },
      { id: 'ac2', he: 'Acute cholecystitis, Tokyo grade 2', story: 'Daniel, 58. Four days of pain, fever, a white count of 19 thousand and a tender mass under the right ribs.', lvl: 'Level 3 · Inflammation and edema', chart: { hx: ['Four days of pain and a temperature of 38.6', 'Tender mass under the right costal margin'], labs: [['WBC', '19.2', 1], ['CRP', '210', 1], ['Bilirubin', '1.1'], ['ALT', '48']], img: 'Ultrasound: tense gallbladder, wall 6 mm, pericholecystic fluid and a stone in the neck' }, st: { variant: 'normal', inflam: 2, adhesions: true }, v: {}, f: ['tense', 'acute', 'adh'] },
      { id: 'mirizzi', he: 'Mirizzi syndrome', story: 'Susan, 67. Mild jaundice and a large stone impacted in the gallbladder neck, pressing on the common hepatic duct.', lvl: 'Level 4 · Knowing when to stop', chart: { hx: ['Mild jaundice for a week', 'Recurrent attacks of biliary colic over the last few years'], labs: [['Bilirubin', '3.4', 1], ['ALP', '310', 1], ['GGT', '280', 1], ['WBC', '12.1', 1]], img: 'MRCP: a large stone in the gallbladder neck compresses the common hepatic duct, with dilated ducts above it' }, st: { variant: 'mirizzi', inflam: 3, adhesions: true }, v: {}, f: ['frozen', 'acute', 'adh'] },
      { id: 'anat', he: 'Aberrant anatomy', story: 'Mark, 39. An elective case that looks simple. Inside, a surprise is waiting.', lvl: 'Level 3 · Don’t cut what you can’t identify', chart: { hx: ['Pain after fatty meals', 'Otherwise healthy'], labs: [['WBC', '6.9'], ['Bilirubin', '0.5'], ['ALP', '70']], img: 'Ultrasound: gallstones, thin wall, normal ducts' }, st: { variant: 'aberrant', inflam: 0 }, v: {}, f: ['aberrant', 'twoart', 'short'] },
      { id: 'cbd', he: 'Suspected duct stone', story: 'Elena, 52. Bilirubin 3, common bile duct 9 mm and an upper midline scar from ulcer surgery years ago.', lvl: 'Level 3 · Cholangiogram, clearance and a scar', chart: { hx: ['Pain and transient jaundice a week ago', 'Open ulcer surgery years ago, upper midline scar'], labs: [['Bilirubin', '3.0', 1], ['ALP', '240', 1], ['ALT', '160', 1], ['WBC', '9.1']], img: 'Ultrasound: gallstones and a common bile duct of 9 mm' }, st: { variant: 'normal', inflam: 1, cbdStone: true, scars: ['upper-midline'] }, v: {}, f: ['cbd', 'scar'] }
    ],
    start: 'hall',

    safety: function (S) {
      var x = 100 - Math.max(0, v(S, 'misid')) * .35 - Math.max(0, v(S, 'bdi')) * .5 - v(S, 'thermal') * .3 - v(S, 'bowel') * .5 - v(S, 'spill') * 5;
      if (S.f.bdi || S.f.bdiOccE || S.f.bdiOccC) x -= 35;
      if (S.f.bowelmissed || S.f.duodev) x -= 25;
      if (!S.f.timeout && (S.f.cvs3 || S.f.cvs2)) x -= 8;
      if (S.f.cvs2) x -= 10;
      return x;
    },
    outcome: function (S) {
      if (S.f.bdi) return { he: 'Bile duct injury recognized in the OR', tone: 'bad' };
      if (S.f.bdiOccE || S.f.bdiOccC) return { he: 'Bile duct injury found after the operation', tone: 'bad' };
      if (S.f.bowelmissed || (S.f.bowelinj && !S.f.bowelfix) || S.f.duodev) return { he: 'Bowel injury found after the operation', tone: 'bad' };
      if (S.f.hpb) return { he: 'Mirizzi with a fistula: you stopped in time and HPB repaired it', tone: 'warn' };
      if (S.f.leakev || S.f.thermev) return { he: 'Bile leak managed with ERCP', tone: 'warn' };
      if (S.f.cbdret) return { he: 'Retained duct stone', tone: 'warn' };
      if (S.f.ccy) return { he: 'Gallbladder drained, interval cholecystectomy planned', tone: 'ok' };
      if (S.f.stc) return { he: 'Safe subtotal cholecystectomy', tone: 'ok' };
      if (S.f.bleedev || S.f.bedbleed || S.f.absc || S.f.hern) return { he: 'Complete cholecystectomy with a controlled complication', tone: 'warn' };
      return { he: 'Clean, safe cholecystectomy', tone: 'ok' };
    },
    closing: function (S, out) {
      if (S.f.bdi || S.f.bdiOccE || S.f.bdiOccC) return 'I know that’s hard to hear. Most of these injuries are a misidentification, not a shaky hand. Next time: a full critical view, a pause, and if you’re not sure, a cholangiogram or a subtotal.';
      if (S.f.bowelmissed || S.f.duodev) return 'The gallbladder came out nicely, but the bowel taught us a lesson. A full look under the entry site, and keep the energy well away from the duodenum. And any patient who isn’t better every day gets worked up.';
      if (S.f.hpb) return 'That’s exactly what I want from you. You saw a hole in the duct, you stopped, and you didn’t try to be a hero. That’s how a duct gets saved.';
      if (S.f.stc) return 'A subtotal isn’t a failure. In a frozen abdomen it’s the most mature decision you can make. I’m proud of you.';
      if (S.f.leakev || S.f.thermev) return 'Leaks happen to good surgeons too. What matters is that you picked it up early and managed it well. Now think about where the risk came in.';
      if (out.tone === 'ok') return 'Lovely work. Critical view, a pause, the right plane. That’s what a safe gallbladder looks like, and one day you’ll be teaching it to someone else.';
      return 'It went fine in the end. Go through the points below. Each one of them is a gallbladder you’ll do in the future.';
    },

    nodes: {
      /* ================= corridor ================= */
      hall: { when: [{ if: is('easy'), to: 'h_easy' }, { if: is('ac2'), to: 'h_ac2' }, { if: is('mirizzi'), to: 'h_mir' }, { if: is('anat'), to: 'h_anat' }, { if: yes, to: 'h_cbd' }] },

      h_easy: {
        say: 'Morning. Laura, forty-six, recurrent biliary colic and stones. Liver enzymes are normal. Have you read the notes?', view: 'chart', dt: 0,
        tip: { stu: 'Notice what makes a case “easy”: a thin wall, a duct that isn’t dilated and normal liver tests.', nurse: 'Elective gallbladder: the standard set, a retrieval bag ready and a 30 degree scope.', senior: 'In an easy case you test the sequence, not the hands. Let the resident lead and ask why.' },
        opts: [
          { t: 'I have. Thin wall, duct not dilated, normal liver tests', g: 'g', to: 'chk', kw: ['read', 'yes', 'wall', 'normal'], reply: 'Good. Then today you operate and I assist. We’ll learn to do it properly even when it’s easy.' },
          { t: 'Roughly. Can you remind me?', g: 'o', to: 'chk', kw: ['roughly', 'remind', 'no'], reply: 'Next time, read before. The easy case is where it’s easiest to fall asleep on watch.' },
          { t: 'It’s just a gallbladder, we’ll go over it in the OR', g: 'b', to: 'chk', kw: ['just', 'in the or'], why: 'Even for a simple gallbladder you read the notes. Preparation is part of safety.', reply: 'Just a gallbladder? Something my own boss taught me: there’s no such thing. There’s only a gallbladder that hasn’t surprised you yet.' }
        ]
      },

      h_ac2: {
        say: 'Daniel, fifty-eight. Four days of pain, a fever and a white count of nineteen. A tender mass under the ribs. What Tokyo grade is that?', view: 'chart', refs: [54],
        tip: { stu: 'Tokyo grade 1 is mild, grade 2 is severe local inflammation, grade 3 has organ dysfunction.', nurse: 'Acute cholecystitis: a needle to decompress the gallbladder, the bag early and a drain in the room.', senior: 'Ask for the criteria, not just the number.' },
        opts: [
          { t: 'Grade 2: a tender mass, more than 72 hours and WBC above 18 thousand', g: 'g', to: 'h_ac2b', kw: ['two', '2', 'mass', 'hours'], refs: [54], reply: 'Exactly. And there’s no organ dysfunction, so it isn’t three. An experienced surgeon and a fit patient, so we operate.' },
          { t: 'Grade 1, mild cholecystitis', g: 'b', to: 'h_ac2b', kw: ['one', '1', 'mild'], refs: [54], why: 'A tender mass, more than 72 hours and WBC above 18 thousand are TG18 criteria for grade 2.', reply: 'No. Four days, a mass and a count of nineteen. That’s a two, and it changes what’s waiting for us inside.' },
          { t: 'Grade 3', g: 'o', to: 'h_ac2b', kw: ['three', '3'], refs: [54], why: 'Grade 3 is cholecystitis with organ dysfunction: blood pressure, breathing, kidneys, liver or clotting.', reply: 'Three means organ dysfunction. He’s stable, so it’s a two. But it’s good that you’re thinking about severity.' }
        ]
      },
      h_ac2b: {
        view: 'mentor:corridor', say: 'So what do we do? Operate now, or antibiotics and come back later?', refs: [55, 64],
        tip: { stu: 'In the ACDC trial, surgery within 24 hours of admission had fewer complications than delayed surgery.', senior: 'Ask when delay is the right call: an unfit patient, or no experienced surgeon available.' },
        opts: [
          { t: 'Now, with an experienced surgeon, because he’s fit for surgery', g: 'g', to: 'chk', kw: ['now', 'early', 'operate'], refs: [55, 64], reply: 'Yes. In the ACDC trial early surgery had fewer complications. And I’m right here with you.' },
          { t: 'Antibiotics and an interval operation in six weeks', g: 'o', to: 'chk', kw: ['delay', 'antibiotics', 'weeks'], refs: [64], why: 'Delay suits a patient who isn’t fit or a setting without an experienced surgeon. In the ACDC trial, early surgery: 11.8% complications versus 34.4% with delay.', reply: 'That’s an option, but he’s fit and we have the team. Delay means he comes back with another attack. So we go in.' },
          { t: 'Percutaneous drainage of the gallbladder', g: 'o', to: 'chk', kw: ['drain', 'percutaneous', 'cholecystostomy'], refs: [55], why: 'Drainage suits a patient who can’t have surgery, not a stable patient in an experienced center.', reply: 'We keep drainage for patients who can’t have an operation. He can. Let’s go to the OR.' }
        ]
      },

      h_mir: {
        say: 'Susan, sixty-seven. Mild jaundice. On MRCP there’s a large stone stuck in the gallbladder neck, pressing on the common hepatic duct. What are you thinking?', view: 'img:mri', cap: 'MRCP: a large stone in the gallbladder neck compresses the common hepatic duct', refs: [56],
        tip: { stu: 'In Mirizzi, a stone in the gallbladder neck compresses the common hepatic duct from outside and sometimes erodes into it as a fistula.', nurse: 'Mirizzi: sutures for an internal repair, a drain, an open set and the HPB surgeon’s phone number.', senior: 'This is the case where you teach stopping. Talk through the plan before the incision.' },
        opts: [
          { t: 'Mirizzi syndrome', g: 'g', to: 'h_mir2', kw: ['mirizzi', 'mirrizi'], refs: [56], reply: 'Right. So today we don’t win by force. If the triangle is frozen, we think about a subtotal.' },
          { t: 'A common bile duct stone, ERCP and that’s it', g: 'o', to: 'h_mir2', kw: ['ercp', 'duct', 'stone'], why: 'The jaundice here comes from a stone in the gallbladder neck pressing on the duct. ERCP may help before surgery, but it doesn’t deal with the gallbladder.', reply: 'ERCP might ease the jaundice, but the stone is in the gallbladder. This is Mirizzi.' },
          { t: 'Ordinary cholecystitis, it doesn’t change anything', g: 'b', to: 'h_mir2', kw: ['ordinary', 'change'], refs: [56], why: 'Mirizzi syndrome changes the plan: a high risk of duct injury and a chance of a fistula between the gallbladder and the duct.', reply: 'It changes everything. In this abdomen the hepatic duct is stuck to the gallbladder, sometimes actually open into it.' }
        ]
      },
      h_mir2: {
        view: 'mentor:corridor', say: 'So what’s your plan if everything inside is frozen?',
        tip: { senior: 'A plan made in advance takes away the pressure to push on by force halfway through.' },
        opts: [
          { t: 'An HPB surgeon available, and if there’s no critical view we convert to a subtotal', g: 'g', to: 'chk', kw: ['hpb', 'subtotal', 'cvs'], refs: [6, 62], reply: 'Nice. A plan before the incision is worth gold in the middle of the case.' },
          { t: 'Convert to open straight away', g: 'o', to: 'chk', kw: ['open', 'straight away'], refs: [5, 6], why: 'Converting doesn’t unfreeze a frozen triangle. In an abdomen like this a subtotal is usually better than deep dissection in the open.', reply: 'Open on its own doesn’t solve a frozen triangle. The duct is stuck in the open too. We’ll come back to it inside.' },
          { t: 'Dissect until we find the duct', g: 'b', to: 'chk', kw: ['dissect', 'find'], refs: [5, 56], why: 'Forceful dissection in a frozen triangle is the classic route to a duct injury, especially in Mirizzi.', reply: 'No. Today, whoever goes looking for the duct will find it. With the scissors.' }
        ]
      },

      h_anat: {
        say: 'Mark, thirty-nine, elective. Ultrasound normal apart from stones. Looks simple, doesn’t it? What’s the plan if the anatomy isn’t clear?', view: 'img:us', cap: 'Ultrasound: gallstones, thin wall, normal ducts', refs: [2, 3],
        tip: { stu: 'The cystic artery alone has many variations. More than 8% of people have two.', nurse: 'Ask whether a C-arm or ICG will be needed. Better to know before the incision.', senior: 'See whether the resident plans for what happens when something doesn’t fit.' },
        opts: [
          { t: 'Nothing gets cut until there’s a full critical view. And if it’s still unclear, a cholangiogram or ICG', g: 'g', to: 'chk', kw: ['cvs', 'cholangiogram', 'icg', 'cut'], refs: [2, 3], reply: 'Good. That’s the whole secret. Remember that sentence in half an hour.' },
          { t: 'I’ll find the cystic duct, it’s always there', g: 'b', to: 'chk', kw: ['find', 'always'], refs: [21], why: 'What looks like the cystic duct can be the common bile duct or an aberrant right duct. The decision rests on the critical view, not on confidence.', reply: 'Always there? Most injuries happen to surgeons who were sure they were looking at the cystic duct.' },
          { t: 'I’ll ask you to come and have a look', g: 'o', to: 'chk', kw: ['come', 'look', 'ask you'], reply: 'You always can, I’m here. But I want to hear how you decide on your own.' }
        ]
      },

      h_cbd: {
        say: 'Elena, fifty-two. Bilirubin of three and a common bile duct of nine millimeters. And she has a scar from ulcer surgery. What’s the plan for the duct?', view: 'chart', refs: [60, 61],
        tip: { stu: 'A raised bilirubin and a dilated duct put her at intermediate risk of a duct stone by ASGE criteria.', nurse: 'Ask whether an on-table cholangiogram is planned: C-arm, catheter and contrast.', senior: 'Ask the resident to sort the risk level before choosing.' },
        opts: [
          { t: 'More imaging first: MRCP or EUS', g: 'g', to: 'h_cbd2', kw: ['mrcp', 'eus', 'imaging'], refs: [60, 61], fx: { flag: 'p_mrcp' }, reply: 'Nice. We did an MRCP yesterday. There’s a six millimeter stone in the duct. So what now?' },
          { t: 'Intraoperative cholangiogram, and clear the duct if there’s a stone', g: 'g', to: 'chk', kw: ['cholangiogram', 'clear', 'intraoperative'], refs: [59, 61], fx: { flag: 'p_ioc' }, reply: 'Also a good route. Then we’ll get the C-arm and a duct clearance set ready.' },
          { t: 'ERCP before surgery', g: 'o', to: 'chk', kw: ['ercp', 'before'], refs: [60], fx: { flag: ['p_ercp', 'cleared'], st: { cbdStone: false } }, why: 'At intermediate risk you start with less invasive imaging. ERCP has complications of its own.', reply: 'We did, and they pulled out a stone. But at intermediate risk I’d have started with imaging. ERCP isn’t an innocent test.' },
          { t: 'Nothing needed, we’ll take the gallbladder out', g: 'b', to: 'chk', kw: ['nothing', 'not needed'], refs: [60], fx: { flag: 'p_none' }, why: 'A bilirubin of 3 and a dilated duct mean intermediate risk of a duct stone. Without a workup, the stone stays.', reply: 'And if there’s a stone in there? Tomorrow she’s back with jaundice or pancreatitis. We’ll think about it inside.' }
        ]
      },
      h_cbd2: {
        view: 'mentor:corridor', say: 'Now that we know there’s a stone in the duct, what’s the plan?', refs: [59, 60],
        tip: { senior: 'Both routes are legitimate. What decides it is the local experience and equipment.' },
        opts: [
          { t: 'ERCP before surgery, then the cholecystectomy', g: 'g', to: 'chk', kw: ['ercp', 'before'], refs: [59, 60], fx: { flag: 'cleared', st: { cbdStone: false } }, reply: 'Done. The ERCP took the stone out last night. Today we’re left with the gallbladder.' },
          { t: 'Surgery with a cholangiogram and duct clearance in the same operation', g: 'g', to: 'chk', kw: ['cholangiogram', 'clearance', 'single stage'], refs: [59], fx: { flag: 'p_ioc' }, reply: 'Nice. In the Cochrane review there was no difference in mortality or complications compared with ERCP first. We’ll get the set ready.' },
          { t: 'Small stones pass on their own, leave it alone', g: 'b', to: 'chk', kw: ['pass', 'on their own'], refs: [61], fx: { flag: 'p_none' }, why: 'A stone seen in the duct gets treated, before, during or after the operation.', reply: 'A stone we’ve seen in the duct doesn’t get left behind. We’ll do a cholangiogram inside.' }
        ]
      },

      /* ================= before we start ================= */
      chk: {
        kind: 'check', view: 'mentor:scrub', btn: 'That’s the plan',
        say: 'One moment before we go in. What should already be settled? Tick them off.',
        fx: function (S) { if (!S.st.adhesions && Math.random() < .3) return { st: { adhesions: true }, flag: 'adh' }; return null; },
        refs: [3, 71],
        tip: { stu: 'A checklist isn’t bureaucracy. It’s what catches the mistake nobody noticed.', nurse: 'You’re part of the time out. If something’s missing, you say so.', senior: 'See whether the resident ticks a drain and bowel prep out of habit.' },
        items: [
          { t: 'Informed consent that includes conversion to open and a subtotal', need: true, miss: 'Consent. We don’t start without it, and it covers conversion to open and a subtotal too.' },
          { t: 'I’ve looked at the imaging myself', need: true, miss: 'The imaging. Not just the report. You look at it yourself before you go in.' },
          { t: 'Antibiotics if indicated, within an hour before the incision', need: true, miss: 'Antibiotics. If they’re indicated, they go in within the hour before the incision.' },
          { t: 'Clot prophylaxis according to risk', need: true, miss: 'Clot prophylaxis. Anything from stockings to an injection, according to risk.' },
          { t: 'Time out with the whole team before the incision', need: true, miss: 'And the time out? Everybody stops. Name, procedure, allergies. We don’t skip it.' },
          { t: 'Routine drain ready', no: true, miss: 'A routine drain in an uncomplicated gallbladder? There’s no evidence for it. We decide about a drain at the end.' },
          { t: 'Bowel preparation', no: true, miss: 'Bowel prep? This is a gallbladder, not a colon.' }
        ],
        ok: 'Good. That’s everything we need. Let’s go to the OR.',
        to: 'snag'
      },

      snag: { when: [{ if: is('easy'), to: 'sn_easy' }, { if: is('ac2'), to: 'sn_ac2' }, { if: is('mirizzi'), to: 'sn_mir' }, { if: is('anat'), to: 'sn_anat' }, { if: has('cleared'), to: 'sn_cbd_clr' }, { if: yes, to: 'sn_cbd' }] },

      sn_easy: {
        view: 'consent', say: 'Hang on. The consent form doesn’t mention conversion to open. She’s already on the table but not yet asleep. What do we do?', dt: 3,
        tip: { nurse: 'If the consent is incomplete, this is the moment to stop. Before induction, not after.', senior: 'A good moment to teach that consent is a conversation, not a form.' },
        opts: [
          { t: 'We stop, explain it to her and complete the consent before induction', g: 'g', to: 'n_prep', kw: ['explain', 'complete', 'stop'], reply: 'Right. Two minutes now saves a very hard conversation later.' },
          { t: 'Everyone knows it’s part of the operation, carry on', g: 'b', to: 'n_prep', kw: ['carry on', 'knows'], why: 'Informed consent covers the risks and the expected changes to the plan, such as conversion to open.', reply: 'No. If we have to open, she needs to hear that from us now. Let’s go and talk to her.' },
          { t: 'Let the anesthetist decide', g: 'o', to: 'n_prep', kw: ['anesthetist', 'anesthesia'], reply: 'The anesthetist doesn’t consent for our operation. That’s on us. Come on, two minutes.' }
        ]
      },
      sn_ac2: {
        view: 'mentor:or', say: 'The anesthetist is asking about antibiotics. He’s been on treatment since yesterday and the last dose was seven hours ago. What do you say?', dt: 2,
        tip: { nurse: 'Document the time of the dose. It gets checked at the time out.', senior: 'There’s no single proven answer here. What matters is that the resident asks the question.' },
        opts: [
          { t: 'Give a dose now, so the level is good at the time of incision', g: 'g', to: 'n_prep', kw: ['dose', 'now', 'give'], reply: 'That’s what I do. The next dose is a long way off and we cut in fifteen minutes. It’s a convention, but a sensible one.' },
          { t: 'He’s already on antibiotics, no need', g: 'o', to: 'n_prep', kw: ['already', 'no need'], why: 'When the next dose is far off, it’s usual to give a dose within the hour before the incision (convention).', reply: 'Reasonable, but seven hours is a long time. I’d rather the level was high when we cut.' },
          { t: 'Add two more agents, just to be safe', g: 'b', to: 'n_prep', kw: ['more', 'agents'], why: 'Broadening without a reason adds no protection and encourages resistance.', reply: '“Just to be safe” isn’t a reason. Same treatment, at the right time.' }
        ]
      },
      sn_mir: {
        view: 'mentor:or', say: 'The HPB surgeon is in another OR until eleven. Do we start without him?', dt: 2, refs: [62],
        tip: { nurse: 'Write the HPB surgeon’s number on the board. If we need them, nobody goes looking halfway through.', senior: 'The team needs to hear the plan and the stopping point before the incision.' },
        opts: [
          { t: 'We start, but tell him now that we may need him', g: 'g', to: 'n_prep', kw: ['tell', 'start'], refs: [62], reply: 'Exactly. He knows, we start slowly, and if we need him he’s here in ten minutes.' },
          { t: 'We wait until he’s finished', g: 'o', to: 'n_prep', kw: ['wait'], reply: 'We could, but it’s a shame. We’ll start slowly and if we need him he’ll come.' },
          { t: 'We don’t need him, we’ll manage', g: 'b', to: 'n_prep', kw: ['manage', 'not need'], refs: [56, 62], why: 'In Mirizzi there’s a risk of fistula and duct injury. The HPB surgeon needs to know in advance.', reply: 'I’m not embarrassed to ask for help, and you shouldn’t be either. I’m calling him.' }
        ]
      },
      sn_anat: {
        view: 'mentor:or', say: 'Nobody booked the C-arm. If we need a cholangiogram, we wait an hour. What do we do?', dt: 2, refs: [3, 15],
        tip: { nurse: 'Booking radiology in advance saves an hour in the middle of a case. ICG needs a compatible camera.', senior: 'Teach the resident to prepare the escape route before it’s needed.' },
        opts: [
          { t: 'Call radiology now, just in case', g: 'g', to: 'n_prep', kw: ['radiology', 'call'], refs: [3], fx: { flag: 'kit' }, reply: 'Good. The radiographer will wait outside. Better not to need it than to need it and not have it.' },
          { t: 'We have ICG, let’s inject it now', g: 'g', to: 'n_prep', kw: ['icg', 'inject'], refs: [15, 16], fx: { flag: 'icgok' }, reply: 'Good idea. In a randomized trial ICG improved identification of structures before the critical view. Let’s inject.' },
          { t: 'We won’t need it, it’s an easy case', g: 'o', to: 'n_prep', kw: ['easy', 'won t need'], refs: [3], why: 'A cholangiogram or ICG helps when the anatomy is unclear, and you don’t know that in advance.', reply: 'An easy case, until it isn’t. Let’s see.' }
        ]
      },
      sn_cbd: {
        view: 'mentor:or', say: 'The choledochoscope is in another department. If the cholangiogram shows a stone, what’s the plan?', dt: 2, refs: [59],
        tip: { nurse: 'Duct clearance: choledochoscope, basket, balloon and contrast. Check in advance that it’s all here.', senior: 'The choice between clearance at surgery and ERCP is a decision for the system, not just the surgeon.' },
        opts: [
          { t: 'Bring it now, and if we can’t clear the duct, ERCP afterwards', g: 'g', to: 'n_prep', kw: ['bring', 'now'], refs: [59], fx: { flag: 'kit' }, reply: 'Fine. I’ve already sent the porter.' },
          { t: 'If there’s a stone, finish the cholecystectomy and ERCP after the operation', g: 'g', to: 'n_prep', kw: ['ercp', 'after'], refs: [59, 60], reply: 'That works too. Just make sure the gastroenterologists know in advance.' },
          { t: 'We’ll see inside', g: 'o', to: 'n_prep', kw: ['see', 'inside'], reply: 'Inside is too late to go looking for equipment. Next time we decide beforehand.' }
        ]
      },
      sn_cbd_clr: {
        view: 'chart', kind: 'info', btn: 'To the OR',
        say: 'The ERCP cleared the duct. Now it’s an ordinary gallbladder, just with an old scar in the upper abdomen. Think about that when we enter.',
        tip: { senior: 'After a recent ERCP there’s sometimes edema around the duct. Worth saying.' },
        to: 'n_prep'
      },

      n_prep: {
        view: 'tray', kind: 'check', for: ['nurse'], skip: 'entry', btn: 'Ready',
        say: 'You’re with us as the scrub nurse. What’s ready on the table before we go in?',
        items: [
          { t: 'An open entry set and a Veress needle', need: true, miss: 'Both entry sets. The surgeon can change their mind at the last moment.' },
          { t: 'CO2 connected and the pressure set', need: true, miss: 'The gas. Connected, full, and the pressure set before we go in.' },
          { t: 'A 30 degree scope, white balanced and warmed', need: true, miss: 'The scope. White balance and warm it, or it fogs up inside.' },
          { t: 'Instrument and swab count', need: true, miss: 'The first count. Without it there’s no final count.' },
          { t: 'An open bowel stapler', no: true, miss: 'A stapler? Not for a gallbladder. We only open what we need.' }
        ],
        ok: 'Excellent. That’s how I like a table.',
        to: 'entry'
      },

      /* ================= entry ================= */
      entry: { when: [{ if: has('scar'), to: 'entry_scar' }, { if: yes, to: 'entry_std' }] },

      entry_std: {
        say: 'Right. Let’s get in. How are you going to enter the abdomen?', view: 'wall', dt: 4, refs: [65, 69],
        tip: { stu: 'No entry technique has been shown to be safer. Complications are too rare to measure a difference.', nurse: 'Open: retractors, fascial stay sutures and a blunt trocar. Veress: a syringe with saline.', senior: 'What matters is that the resident uses the technique they know, checks included.' },
        opts: [
          { t: 'Open at the umbilicus, Hasson technique', g: 'g', to: 'press', kw: ['open', 'hasson'], refs: [69], fx: { bowel: 1 }, reply: 'Fine. Calm and safe. You see every layer.' },
          { t: 'Veress needle at the umbilicus, with a drop test and a low opening pressure', g: 'g', to: 'press', kw: ['veress', 'drop', 'needle'], refs: [65, 69], fx: { bowel: 2 }, reply: 'Good. As long as you do the checks, that’s perfectly fine.' },
          { t: 'Direct trocar entry without insufflation', g: 'o', to: 'press', kw: ['direct', 'trocar'], refs: [69], fx: { bowel: 3 }, why: 'Fewer failed entries than with Veress, but it takes experience. No technique has been shown to be safer.', reply: 'It works in experienced hands. For your first one, I’d rather you could see what you’re doing.' },
          { t: 'A quick Veress, no checks', g: 'b', to: 'press', kw: ['quick', 'no checks'], refs: [69, 73], fx: { bowel: 9 }, why: 'With a blind entry, the checks are what tell you the needle is in the wrong place.', reply: 'No checks? Not with me. Even if it works nine times, the tenth one hurts.' }
        ]
      },
      entry_scar: {
        say: 'Hold on. She has a midline scar above the umbilicus. Where and how do we get in?', view: 'wall', dt: 5, st: { palmer: true }, refs: [69, 73],
        tip: { stu: 'About 70% of bowel injuries in laparoscopy were in patients with adhesions or previous surgery.', nurse: 'Palmer’s point: a long Veress needle, and the stomach emptied with a nasogastric tube.', senior: 'Ask why Palmer’s point works: under the left costal margin there are almost never adhesions.' },
        opts: [
          { t: 'At Palmer’s point, under the left costal margin, after emptying the stomach', g: 'g', to: 'press', kw: ['palmer', 'left', 'ribs'], refs: [69, 73], fx: { bowel: 2 }, reply: 'Very nice. Well away from the scar, and we’ll put the umbilical port in later under vision.' },
          { t: 'Open entry, away from the scar', g: 'g', to: 'press', kw: ['open', 'away'], refs: [69], fx: { bowel: 2 }, reply: 'Also good. You see every layer and you’re away from any stuck bowel.' },
          { t: 'Open at the umbilicus, carefully', g: 'o', to: 'press', kw: ['umbilicus', 'carefully'], refs: [73], fx: { bowel: 6 }, why: 'The umbilicus is the end of the scar. Bowel can be stuck there even with an open entry.', reply: 'The umbilicus is the end of the scar. You can, but very slowly and with a finger before every cut.' },
          { t: 'Veress at the umbilicus, as usual', g: 'b', to: 'press', kw: ['as usual', 'veress'], refs: [73], fx: { bowel: 22 }, why: 'About 70% of bowel injuries in laparoscopy were in patients with adhesions or previous surgery.', reply: 'A blind needle under a scar? That’s exactly where the bowel is waiting for it. All right, I’m next to you.' }
        ]
      },
      press: {
        view: 'wall', say: 'We’re insufflating. To what pressure?', refs: [65], dt: 1,
        tip: { stu: 'High intra-abdominal pressure reduces venous return and makes ventilation harder.', nurse: 'The pressure is set on the insufflator. If the surgeon asks for more, check with the anesthetist.', senior: 'The EAES guideline: the lowest pressure that gives adequate exposure, not a fixed number.' },
        opts: [
          { t: '12, and we’ll ask for more if we need it', g: 'g', to: 'in', kw: ['12', 'twelve', 'low'], refs: [65], reply: 'Nice. The lowest that lets you see.' },
          { t: '15, to give us room', g: 'o', to: 'in', kw: ['15', 'fifteen'], refs: [65], fx: { co2: 1 }, why: 'The EAES guideline: the lowest pressure that gives adequate exposure. High pressure loads the heart and lungs.', reply: 'Let’s start lower. If we can’t see, we’ll go up. Don’t let the pressure do your work for you.' },
          { t: '20, as much room as possible', g: 'b', to: 'in', kw: ['20', 'twenty', 'most'], refs: [65, 74], fx: { co2: 2 }, why: 'Too high a pressure loads the heart and lungs and increases CO2 absorption without adding much exposure.', reply: 'Twenty? The anesthetist will kill us. And rightly so.' }
        ]
      },
      in: {
        roll: [
          { p: function (S) { return .02 + v(S, 'co2') * .11; }, flag: 'co2ev', to: 'c_co2', ev: 'Anesthetist: the blood pressure is dropping and the heart rate is falling.', luck: 'You insufflated to a high pressure and this time the blood pressure didn’t drop.' },
          { p: function (S) { return pct(v(S, 'bowel') / 100); }, flag: 'bowelinj', to: 'look', luck: 'The entry you chose carried a risk of bowel injury and this time nothing happened.' },
          { p: 1, to: 'look' }
        ]
      },
      c_co2: {
        view: 'mentor:tense', say: 'Wait. The pressure’s dropping and the heart rate’s falling. What comes first?', fx: { hemo: 1 }, refs: [74],
        tip: { stu: 'During insufflation: a vagal response, bleeding from a major vessel at entry and, rarely, gas embolism.', nurse: 'Open the valve when asked, and call for anesthetic help if needed.', senior: 'Check that the resident talks to the anesthetist and not just to the screen.' },
        opts: [
          { t: 'Let the gas out immediately and tell the anesthetist', g: 'g', to: 'co2_ok', kw: ['release', 'gas', 'anesthetist'], refs: [74], reply: 'Right. Gas out, talk to the anesthetist, then think: vagal, bleeding from the entry, or embolism.' },
          { t: 'Carry on, it’ll pass', g: 'b', to: 'co2_ok', kw: ['carry on', 'pass'], refs: [74], fx: { hemo: 1 }, why: 'Collapse during insufflation: release the gas and tell anesthesia. Think of a vagal response, bleeding from a major vessel and gas embolism.', reply: 'We don’t carry on. I’m opening the gas now. Look at the monitor with me.' },
          { t: 'Raise the pressure to see if there’s bleeding', g: 'b', to: 'co2_ok', kw: ['raise', 'pressure'], refs: [65, 74], fx: { hemo: 1 }, why: 'Raising the pressure during collapse makes the fall in venous return worse.', reply: 'The opposite. More pressure means less blood back to the heart. Let it out.' }
        ]
      },
      co2_ok: {
        view: 'mentor:calm', kind: 'info', btn: 'Carry on',
        say: 'The pressure’s back. We’ll insufflate again slowly, this time to ten or twelve. Anesthesia is with us.',
        fx: { set: { hemo: 0, co2: 0 } },
        to: 'look'
      },

      look: {
        say: 'The camera’s in. Before you rush to the gallbladder, what do we check?', view: 'move:camera30', dt: 1, refs: [73],
        tip: { stu: 'On the survey you look for an entry injury, bleeding and unexpected disease.', nurse: 'If the scope fogs, have warm water or anti-fog ready.', senior: 'The habit of a full look around is what catches an entry injury in time.' },
        opts: [
          { t: 'A survey of the whole abdomen, especially under the entry site', g: 'g', to: 'look2', kw: ['survey', 'whole abdomen', 'under'], refs: [73], fx: { flag: 'looked' }, reply: 'Yes. If you don’t look, you don’t find. A full look around, then the gallbladder.' },
          { t: 'Straight to the gallbladder, we know what’s there', g: 'b', to: 'look2', kw: ['straight', 'gallbladder'], refs: [73], why: 'Most bowel injuries are found when someone looks for them during the operation. Checking under the entry site is part of the entry.', reply: 'Straight to the gallbladder? All right, but that’s how things get missed. Next time, a full look first.' },
          { t: 'Just the liver and the gallbladder', g: 'o', to: 'look2', kw: ['liver', 'just'], refs: [73], why: 'The survey covers the whole abdomen, and especially the area under the entry site.', reply: 'Half a job. The most important place to check is right under your own trocar.' }
        ]
      },
      look2: { when: [{ if: function (S) { return S.f.bowelinj && S.f.looked; }, to: 'c_bowel' }, { if: yes, to: 'ports' }] },

      c_bowel: {
        say: 'Wait. Stop. Do you see that? A small hole in the small bowel, right under the entry site. What do we do?', view: 'mentor:tense', refs: [73], dt: 20,
        tip: { stu: 'In two thirds of cases the bowel injury was diagnosed during surgery or in the first 24 hours.', nurse: 'Sutures for the bowel, a laparoscopic needle holder and irrigation.', senior: 'Notice whether the resident leaves the trocar in place as a marker.' },
        opts: [
          { t: 'Leave the trocar in, mark it and repair, and call a senior if needed', g: 'g', to: 'bowel2', kw: ['repair', 'leave', 'trocar'], refs: [73], fx: { flag: 'bowelfix' }, reply: 'Right. The trocar marks the spot for us. I’ll suture, you hold. That’s how you learn.' },
          { t: 'Take it out and carry on, it’s small', g: 'b', to: 'bowel2', kw: ['small', 'carry on'], refs: [73], fx: { flag: 'bowelmissed' }, why: 'An unrepaired bowel injury shows up as an acute abdomen, usually on the first day. Mortality is a few percent.', reply: 'Small today, peritonitis tomorrow. All right, leave it. We’ll talk about it at the end.' },
          { t: 'Convert to open straight away', g: 'o', to: 'bowel2', kw: ['open'], refs: [73], fx: { flag: 'bowelfix', t: 20 }, why: 'Converting is legitimate, but a small injury that’s been recognized can usually be repaired laparoscopically in skilled hands.', reply: 'You could, but a small hole like this I’ll close from inside. Breathe. This isn’t the end.' }
        ]
      },
      bowel2: {
        view: 'mentor:tense', say: 'So the bowel’s been dealt with. Do we carry on with the gallbladder or stop for today?',
        tip: { senior: 'Both answers are legitimate. What decides it is contamination, the patient’s condition and how urgent the gallbladder is.' },
        opts: [
          { t: 'Carry on. There’s no significant spillage and the gallbladder was planned', g: 'g', to: 'ports', kw: ['carry on', 'continue'], reply: 'I agree. No spillage, so we carry on, and twice as carefully.' },
          { t: 'Stop and postpone the gallbladder', g: 'o', to: 'po_stop', kw: ['stop', 'postpone'], reply: 'A conservative and legitimate decision. I’d have carried on, but I won’t argue with you.' }
        ]
      },
      po_stop: {
        view: 'mentor:or', kind: 'info', btn: 'To the summary',
        say: 'We’ve closed. We’ll book the cholecystectomy in a few weeks. On the ward we watch the abdomen, and any patient who isn’t better every day gets worked up.',
        to: 'end'
      },

      /* ================= ports ================= */
      ports: { when: [{ if: has('scar'), to: 'ports_scar' }, { if: yes, to: 'ports_std' }] },

      ports_std: {
        kind: 'place', view: 'wall', ports: 4, sizes: [10, 10, 5, 5], layouts: [US, FR], tol: 55, target: [196, 332], danger: DANGER, dt: 5, refs: [9, 10],
        say: 'Four ports. The camera first, then the other three. Touch where you want them.',
        tip: { stu: 'The angle between the two working instruments should be about 60 degrees, with the camera in line with the target.', nurse: 'Two of 10 to 12, two of 5, and a number 11 blade.', senior: 'The French layout is legitimate too. What matters is the angle and the axis.' },
        reply: { g: 'Good. A nice working triangle and the camera in line with the gallbladder.', o: 'Reasonable. One port is a little off. You’ll feel it in the angle, but we can work.', b: 'That won’t work. The instruments will clash. Look at where the ideal points are.' },
        fx: { g: { exposure: 10 }, o: { exposure: 3 }, b: { exposure: -10, vis: -10 } },
        why: 'The American or French layout gives an angle of about 60 degrees between the instruments and a camera in line with the target (convention based on ergonomics).',
        to: 'n_ports'
      },
      ports_scar: {
        kind: 'place', view: 'wall', ports: 4, sizes: [10, 10, 5, 5], layouts: [US, FR], tol: 55, target: [196, 332], danger: DANGER.concat([SCAR]), dt: 8, refs: [9, 10, 73],
        say: 'We’re in safely. Now four ports, and mind the scar. The camera first.',
        tip: { stu: 'When there’s a scar, you look from inside before every additional trocar.', nurse: 'They may ask for an extra port to take down adhesions.', senior: 'Ask the resident what they see from inside before each trocar.' },
        reply: { g: 'Excellent. All the ports are away from the scar, with a good angle.', o: 'That works. One is a little out of place, we’ll manage.', b: 'We’ll be working hard like this. Look at the ideal points.' },
        fx: { g: { exposure: 10 }, o: { exposure: 3 }, b: { exposure: -10, vis: -10 } },
        why: 'Ports at an angle of about 60 degrees and away from the scar, placed under vision from inside (convention based on ergonomics).',
        to: 'n_ports'
      },
      n_ports: {
        view: 'tray', for: ['nurse'], skip: 'tilt',
        say: 'Trocars. What are you opening?',
        opts: [
          { t: 'Two of 10 to 12, two of 5 and a number 11 blade', g: 'g', to: 'tilt', kw: ['two', '10', '5'], reply: 'Exactly. And keep another five close by, in case we need an extra port.' },
          { t: 'Four of 5', g: 'b', to: 'tilt', kw: ['four', 'five'], why: 'The camera and the extraction port need 10 to 12 mm.', reply: 'We won’t get a ten millimeter camera through a five, or a gallbladder out of one.' },
          { t: 'Three of 12', g: 'o', to: 'tilt', kw: ['three', '12'], reply: 'It works, but that’s a big hole for no reason. Five is enough for the working instruments.' }
        ]
      },
      tilt: {
        view: 'position', say: 'Now the table. How do you want it?', dt: 1,
        tip: { stu: 'Gravity moves the bowel out of the field. It’s the cheapest retractor there is.', nurse: 'Make sure the patient is secured before tilting.', senior: 'It’s a simple convention, but it decides half the exposure.' },
        opts: [
          { t: 'Head up and tilted to the left, so the bowel falls out of the field', g: 'g', to: 'exp', kw: ['head up', 'left', 'tilt'], reply: 'Exactly. Let gravity work for you.' },
          { t: 'Head down', g: 'b', to: 'exp', kw: ['head down', 'trendelenburg'], fx: { exposure: -10 }, why: 'Head down brings the bowel into the field and hides the gallbladder (convention).', reply: 'Head down? All the bowel will come to us. The other way.' },
          { t: 'Flat, we’ll manage', g: 'o', to: 'exp', kw: ['flat'], fx: { exposure: -4 }, reply: 'We’ll manage, but why make it hard? A bit of head up and to the left.' }
        ]
      },

      /* ================= exposure ================= */
      exp: { when: [{ if: has('tense'), to: 'exp_tense' }, { if: function (S) { return !!S.st.adhesions; }, to: 'exp_adh' }, { if: yes, to: 'exp_main' }] },

      exp_tense: {
        view: 'scene', say: 'Look at that gallbladder. Tense and thick, and the grasper keeps slipping. What do we do?', dt: 4, refs: [5, 66],
        tip: { stu: 'A tense gallbladder is a sign of a difficult operation.', nurse: 'A decompression needle and suction, and a clip or an endoloop to close the hole.', senior: 'A decompressed gallbladder is one you can grasp. It changes the whole operation.' },
        opts: [
          { t: 'Decompress with a needle, aspirate, then grasp', g: 'g', to: 'exp_tr', kw: ['decompress', 'needle', 'aspirate'], refs: [5], fx: { flag: 'decomp' }, reply: 'Nice. A soft gallbladder can be grasped. And put a clip on the hole so it doesn’t leak.' },
          { t: 'Grasp harder with a toothed grasper', g: 'b', to: 'exp_tr', kw: ['harder', 'toothed'], refs: [66], fx: { perf: 3 }, why: 'Grasping a tense gallbladder without decompressing it tears it: bile and stones in the abdomen.', reply: 'That’s going to tear. But go on, let’s see.' },
          { t: 'Give up on the fundus and retract only the neck', g: 'o', to: 'exp_tr', kw: ['give up', 'neck'], fx: { exposure: -10 }, reply: 'That way the triangle won’t open well. Let’s try.' }
        ]
      },
      exp_tr: {
        roll: [
          { p: function (S) { return v(S, 'perf') >= 3 ? .55 : 0; }, flag: 'perfev', to: 'c_perf', ev: 'The gallbladder tore in the grasper. Bile and stones are out.', luck: 'You grasped a tense gallbladder without decompressing it and this time it didn’t tear.' },
          { p: function (S) { return S.st.adhesions && !S.f.adhdone ? 1 : 0; }, to: 'exp_adh' },
          { p: 1, to: 'exp_main' }
        ]
      },
      exp_adh: {
        view: 'scene', say: 'Omentum and duodenum are stuck to the gallbladder. How do you free them?', st: { adhesions: true }, dt: 6, refs: [25],
        tip: { stu: 'Work right on the gallbladder wall, because the gallbladder comes out and the duodenum stays.', nurse: 'A second atraumatic grasper and energy ready, but most of the work is blunt.', senior: 'Watch where the tip of the hook is when it’s near the duodenum.' },
        opts: [
          { t: 'Gently, right on the gallbladder wall, with traction and a little energy', g: 'g', to: 'exp_main', kw: ['gently', 'wall', 'traction'], fx: { exposure: 8, flag: 'adhdone', st: { adhesions: false } }, reply: 'Yes. We work on the gallbladder, not on the duodenum.' },
          { t: 'With the hook, quickly, even next to the duodenum', g: 'b', to: 'exp_main', kw: ['hook', 'quickly'], refs: [25], fx: { thermal: 10, flag: ['duod', 'adhdone'], st: { adhesions: false } }, why: 'Energy next to the duodenum can cause a thermal injury that only shows up a day or two later.', reply: 'Wait. Stop. That’s duodenum. Heat there you don’t see today, you see tomorrow.' },
          { t: 'Leave them and work around them', g: 'o', to: 'exp_main', kw: ['leave', 'around'], fx: { exposure: -10, flag: 'adhdone' }, reply: 'Then we won’t see the triangle. In the end we’ll have to free them.' }
        ]
      },
      exp_main: {
        view: 'scene', say: 'Now we open the triangle. Where do you retract the fundus, and where does Hartmann’s pouch go?', st: { retract: 'none', rouviere: false }, dt: 2, refs: [1, 2, 21],
        tip: { stu: 'With the right traction, the cystic duct and the common bile duct form an angle, not a straight line.', nurse: 'The assistant holds the fundus. That means not moving while the surgeon works.', senior: 'Ask the resident to explain what happens to the angle between the ducts.' },
        opts: [
          { t: 'Fundus to the right shoulder over the liver, Hartmann’s pouch laterally and down', g: 'g', to: 'gear1', kw: ['shoulder', 'lateral', 'down'], refs: [1, 2], fx: { exposure: 20, misid: -10, st: { retract: 'good' } }, reply: 'Good. See that? The triangle opens and the cystic duct moves away from the common duct.' },
          { t: 'Fundus up and Hartmann’s pouch up as well', g: 'b', to: 'gear1', kw: ['up', 'as well'], refs: [21], fx: { misid: 18, st: { retract: 'bad' } }, why: 'Pulling Hartmann’s pouch upward lines the cystic duct and the common bile duct up in one straight line. That’s the mechanism behind most major injuries.', reply: 'Wait. Look what happened. Everything is in one line and the common duct looks exactly like the cystic duct. Laterally and down.' },
          { t: 'Just the fundus, Hartmann’s pouch doesn’t need it', g: 'o', to: 'gear1', kw: ['just the fundus'], fx: { exposure: 5, misid: 8, st: { retract: 'good' } }, why: 'Without lateral traction on Hartmann’s pouch, the triangle stays partly closed.', reply: 'Half a triangle. Give Hartmann’s pouch some lateral traction and watch it open.' }
        ]
      },
      gear1: {
        kind: 'gear', view: 'move:hook', dt: 1,
        fx: function (S) { return S.st.retract === 'good' ? null : { st: { retract: 'good' } }; },
        say: 'We’re opening the peritoneum. What do you want in your right hand?',
        pool: ['grasp', 'maryland', 'scis', 'hook', 'clip', 'stapler'], need: 'hook', alt: ['maryland', 'scis'],
        ok: 'The hook. Short movements, and you see the tip the whole time.',
        altReply: 'That works too. Some people prefer a Maryland for opening. Just keep the tip in view.',
        bad: 'We’ll save that for later. Right now, something that opens tissue gently.',
        why: 'To open the peritoneum you use a hook at low power, a Maryland or scissors (convention).',
        tip: { nurse: 'Hook connected, pedal by the surgeon and the power as requested.', senior: 'Ask which current and why.' },
        to: 'rouv'
      },
      rouv: {
        view: 'scene', kind: 'spot', target: 'rouv', he: 'Rouvière’s sulcus', st: { rouviere: true }, refs: [17, 5],
        say: 'Before you cut anything, show me Rouvière’s sulcus.',
        ok: 'Yes. That’s the line. Above it we work, below it we don’t.',
        bad: 'No, that’s not it. Look for a cleft in the liver, to the right of and behind Hartmann’s pouch.',
        why: 'The dissection stays above the imaginary line between Rouvière’s sulcus and the base of segment 4.',
        fxOk: { misid: -5 }, fxBad: { misid: 5 },
        tip: { stu: 'Rouvière’s sulcus is present in about 80% of patients. It marks the level of the common bile duct.', senior: 'If the resident can’t find it, show them. It’s a landmark that stays with you for life.' },
        to: 'stu_duo'
      },
      stu_duo: {
        view: 'scene', kind: 'spot', for: ['stu'], skip: 'line', target: 'duod', he: 'The duodenum',
        say: 'A question for you, as a student. Where’s the duodenum?',
        ok: 'Right. And now you understand why we don’t use energy next to it.',
        bad: 'No. The duodenum is lower down, under the gallbladder neck. Try again next time.',
        why: 'The duodenum lies below the gallbladder neck and is sometimes stuck to it.',
        to: 'line'
      },
      line: {
        view: 'scene', say: 'So where’s your dissection in relation to Rouvière’s line?', refs: [17, 5],
        tip: { stu: 'The line runs from Rouvière’s sulcus to the base of segment 4. The common bile duct lies below it.', senior: 'The resident should picture this line at every moment of the dissection.' },
        opts: [
          { t: 'Above it, right on the gallbladder', g: 'g', to: 'n_dis', kw: ['above', 'on the gallbladder'], refs: [17, 5], reply: 'Right. Above the line, right on the gallbladder. That’s the safe place.' },
          { t: 'Below it, that’s where the ducts are', g: 'b', to: 'n_dis', kw: ['below'], refs: [17], fx: { misid: 15 }, why: 'The common bile duct runs below the line between Rouvière’s sulcus and segment 4. You work above it.', reply: 'The opposite. Below the line is the common bile duct. We’re not looking for it.' },
          { t: 'It doesn’t matter, as long as you can see', g: 'b', to: 'n_dis', kw: ['doesn t matter', 'not matter'], refs: [17], fx: { misid: 10 }, why: 'The landmark is there precisely for the moments when you can’t see well.', reply: 'It matters a great deal. When everything is edematous, this line is what you have left.' }
        ]
      },
      n_dis: {
        view: 'tray', for: ['nurse'], skip: 'dis',
        say: 'Before the dissection, what do you check on the instruments?', refs: [25],
        opts: [
          { t: 'That the hook’s insulation is intact, the suction works and a Maryland is ready', g: 'g', to: 'dis', kw: ['insulation', 'suction'], refs: [25], reply: 'Excellent. A small defect in the insulation can burn bowel outside the field of view.' },
          { t: 'Just that the hook is connected', g: 'o', to: 'dis', kw: ['connected'], why: 'An insulation defect passes current into tissue outside the field of view.', refs: [25], reply: 'Connected is a start. Check the insulation as well.' },
          { t: 'Nothing, it was all checked this morning', g: 'b', to: 'dis', kw: ['nothing'], why: 'Checking the instruments before use is part of energy safety.', refs: [25, 27], reply: 'This morning isn’t now. You check before you use it.' }
        ]
      },

      /* ================= dissection ================= */
      dis: { when: [{ if: is('anat'), to: 'dis_anat' }, { if: is('ac2', 'mirizzi'), to: 'dis_hard' }, { if: yes, to: 'dis_tap' }] },

      dis_tap: {
        view: 'scene', kind: 'tap', st: { peel: 1, retract: 'good', focus: null }, dt: 8, refs: [3, 5],
        say: 'Go on, then. Show me where you start opening.',
        hint: 'Touch the place where you open the peritoneum',
        tip: { stu: 'You open the peritoneum on both sides of the gallbladder neck, right on it.', nurse: 'Suction ready and smoke out of the room: open the valve when asked.', senior: 'Let the resident get it wrong once, and stop them. That’s how it sticks.' },
        zones: [
          { spot: 'hartmann', r: 55, g: 'g', he: 'The peritoneum over the gallbladder neck', refs: [3, 5], fx: { exposure: 5 }, reply: 'Nice. Right on the gallbladder and above the line. The front first, then we’ll flip it and open the back.', to: 'dis2' },
          { spot: 'cduct', r: 40, g: 'o', he: 'The cystic duct itself', reply: 'Straight onto the duct? Start higher, on the neck. That way the duct comes out to you by itself.', fx: { misid: 5 }, to: 'dis2' },
          { spot: 'cbd', r: 45, g: 'b', he: 'The common bile duct', stop: 'Wait. Stop. That’s the common bile duct. We don’t work there at all.', why: 'Dissecting close to the common bile duct raises the risk of injury. Work right on the gallbladder and above Rouvière’s line.', refs: [3, 21], fxWarn: { misid: 8 }, fx: { misid: 20, bdi: 15 }, reply: 'I said not there. From now on, only right on the gallbladder.', to: 'dis2' },
          { spot: 'chd', r: 40, g: 'b', he: 'The common hepatic duct', stop: 'Stop. That’s the common hepatic duct. You’re well below the line.', why: 'The common hepatic duct lies below Rouvière’s line.', refs: [17, 21], fxWarn: { misid: 8 }, fx: { misid: 20, bdi: 15 }, reply: 'No. We go back up to the gallbladder.', to: 'dis2' },
          { spot: 'duod', r: 55, g: 'b', he: 'The duodenum', stop: 'Stop. That’s the duodenum. A hook there is a hole you find tomorrow.', why: 'A thermal injury to the duodenum usually only shows up a day or two later.', refs: [25], fxWarn: {}, fx: { thermal: 15, flag: 'duod' }, reply: 'Not there. Up to the gallbladder neck.', to: 'dis2' },
          { spot: 'seg4', r: 45, g: 'o', he: 'The base of segment 4', reply: 'That’s the upper end of the line. Come down a little to the gallbladder neck and start there.', to: 'dis2' }
        ],
        missSay: 'Not there. Look for the fold of peritoneum over the gallbladder neck.',
        to: 'dis2'
      },
      dis2: {
        view: 'scene', kind: 'tap', st: { peel: 2, focus: null }, dt: 8, refs: [2, 67, 68],
        say: 'We’ve opened both sides. Now we clear the triangle. Where do you go next?',
        hint: 'Touch the place where you carry on clearing',
        tip: { stu: 'The cystic lymph node usually sits next to the cystic artery. It’s a good landmark.', nurse: 'A Maryland ready, and suction with irrigation.', senior: 'This is where you see whether the resident can tell the cystic artery from the right hepatic artery.' },
        zones: [
          { spot: 'node', r: 45, g: 'g', he: 'Next to the cystic node, on the gallbladder side', refs: [2], reply: 'Good. The node shows us where the artery is. We stay on the gallbladder side.', fx: { misid: -5 } },
          { spot: 'plate', r: 50, g: 'g', he: 'The lower third against the liver bed', refs: [2], reply: 'Good. We separate the lower third from the liver. Without that there’s no critical view.', fx: { misid: -5 } },
          { spot: 'cart', r: 35, g: 'o', he: 'The cystic artery', reply: 'That’s the artery. Clear around it gently, with no energy right up against it.', fx: { bleedrisk: 5 } },
          { spot: 'rha', r: 40, g: 'b', he: 'The right hepatic artery', stop: 'Wait. Stop. That’s an artery. And it isn’t the cystic artery, it carries on into the liver.', why: 'The right hepatic artery can run close to the gallbladder neck and look like the cystic artery.', refs: [67, 68], fxWarn: { misid: 5 }, fx: { bleedrisk: 25, misid: 10 }, reply: 'I told you that’s the hepatic artery. We leave it alone.' },
          { spot: 'cbd', r: 45, g: 'b', he: 'The common bile duct', stop: 'Stop. You’re on the common bile duct again. Back to the gallbladder.', why: 'You don’t need to expose the common bile duct to reach the critical view.', refs: [2, 21], fxWarn: { misid: 8 }, fx: { misid: 20, bdi: 15 } }
        ],
        missSay: 'Not there. Look at the triangle between the cystic duct, the liver and the gallbladder neck.',
        to: 'energy'
      },
      energy: {
        view: 'scene', say: 'While you’re at it, how are you working with the hook?', refs: [25, 26, 27],
        tip: { stu: 'A thermal injury isn’t visible during the operation. It shows up a few days later.', nurse: 'The power on the generator is what the surgeon asked for. If it looks high, ask.', senior: 'It’s a question of habit. Worth asking in every case.' },
        opts: [
          { t: 'Low power, short bursts, the whole tip in view and never next to a clip or a duct', g: 'g', to: 'stu_cvs', kw: ['low', 'short', 'tip'], refs: [25, 27], reply: 'Exactly. Something my own boss taught me: if you can’t see the tip, you don’t press the pedal.' },
          { t: 'Traction and blunt spreading, energy only when needed', g: 'g', to: 'stu_cvs', kw: ['blunt', 'spreading'], refs: [25], reply: 'Nice. Most of the triangle opens with your hands, not with energy.' },
          { t: 'High power and long contact, to make it quick', g: 'b', to: 'stu_cvs', kw: ['high', 'long', 'quick'], refs: [25, 26], fx: { thermal: 25 }, why: 'Heat spreads. A thermal injury to the duct only shows up a few days later, as a leak or a stricture.', reply: 'Quick now, a leak in a week. Turn the power down.' }
        ]
      },

      dis_anat: {
        view: 'scene', kind: 'tap', st: { peel: 1, retract: 'good', focus: null }, dt: 8, refs: [3, 5],
        say: 'Go on, then. Show me where you start opening.',
        hint: 'Touch the place where you open the peritoneum',
        tip: { stu: 'You open right on the gallbladder, on both sides.', senior: 'Here the anatomy will surprise the resident. Let them get there on their own.' },
        zones: [
          { spot: 'hartmann', r: 55, g: 'g', he: 'The peritoneum over the gallbladder neck', refs: [3, 5], reply: 'Nice. Right on the gallbladder. Now slowly, something here looks different to me.' },
          { spot: 'cduct', r: 40, g: 'o', he: 'The cystic duct itself', fx: { misid: 5 }, reply: 'Start higher, on the neck. And notice, this duct is short.' },
          { spot: 'cbd', r: 45, g: 'b', he: 'The common bile duct', stop: 'Wait. Stop. That’s the common bile duct. We don’t work there.', why: 'Dissecting close to the common bile duct raises the risk of injury.', refs: [3, 21], fxWarn: { misid: 8 }, fx: { misid: 20, bdi: 15 } },
          { spot: 'duod', r: 55, g: 'b', he: 'The duodenum', stop: 'Stop. That’s the duodenum.', why: 'A thermal injury to the duodenum usually only shows up a day or two later.', refs: [25], fx: { thermal: 15, flag: 'duod' } }
        ],
        missSay: 'Not there. Look for the fold of peritoneum over the gallbladder neck.',
        to: 'anat_q'
      },
      anat_q: {
        view: 'scene', say: 'See that? A second tubular structure joining the cystic duct from the liver side. What do you think it is?', st: { peel: 2, focus: 'aberr' }, dt: 4, refs: [1, 3],
        tip: { stu: 'An aberrant right posterior duct can drain straight into the cystic duct.', nurse: 'This is a moment when they’ll ask for a cholangiogram or ICG. Be ready.', senior: 'The key moment of this case. Don’t answer for the resident.' },
        opts: [
          { t: 'We don’t know yet. Nothing gets cut, we carry on to the critical view and think about a cholangiogram', g: 'g', to: 'energy', kw: ['don t know', 'nothing cut', 'cholangiogram'], refs: [1, 3], fx: { misid: -10, flag: 'abseen' }, reply: 'That’s the sentence I wanted to hear. If you can’t identify it, you don’t cut it.' },
          { t: 'A small branch of the artery. Clip and cut', g: 'b', to: 'c_bdi', kw: ['artery', 'clip'], refs: [1], fx: { bdi: 40, flag: ['bdi', 'bdiB'] }, why: 'An aberrant right duct closed with a clip is a Strasberg type B injury.', reply: 'Wait. Stop. That isn’t an artery, it’s a bile duct from the right lobe. And you’ve closed it.' },
          { t: 'A double cystic duct. Divide it with the hook', g: 'b', to: 'c_bdi', kw: ['double', 'divide', 'hook'], refs: [1], fx: { bdi: 40, flag: ['bdi', 'bdiC'], st: { bile: true } }, why: 'An aberrant right duct divided without closure is a type C injury. It leaks bile.', reply: 'Stop. That’s a right bile duct, not a cystic duct. And now it’s leaking.' },
          { t: 'Ask you to come and look', g: 'o', to: 'energy', kw: ['ask', 'look'], fx: { flag: 'abseen' }, reply: 'I’m here. And I don’t cut what I can’t identify either. Keep dissecting and we’ll check.' }
        ]
      },

      dis_hard: {
        view: 'scene', kind: 'tap', st: { peel: 0, retract: 'good', focus: null }, dt: 12, refs: [5],
        say: 'The triangle is frozen. Edema, everything stuck together. Show me where you start.',
        hint: 'Touch the place where you start',
        tip: { stu: 'Four signs of a difficult operation: a tense gallbladder, a thick wall, a triangle that won’t open and time passing without progress.', nurse: 'Suction with irrigation, a second grasper, and start thinking about sutures and a drain.', senior: 'This is where the clock starts. Watch the time, not just the tissue.' },
        zones: [
          { spot: 'hartmann', r: 60, g: 'g', he: 'The gallbladder neck, right on the wall', refs: [5], reply: 'Yes. Right on the gallbladder, using the sucker as a dissector. Slowly.' },
          { spot: 'gb', r: 60, g: 'o', he: 'The body of the gallbladder', reply: 'Too high, but safe. We’ll work slowly down toward the neck.' },
          { spot: 'cbd', r: 45, g: 'b', he: 'The common bile duct', stop: 'Wait. Stop. In this edema the common bile duct looks like everything else. Not there.', why: 'In severe inflammation the common bile duct is stuck to the gallbladder. Dissecting close to it is the big danger.', refs: [5, 21], fxWarn: { misid: 10 }, fx: { misid: 25, bdi: 20 } },
          { spot: 'duod', r: 55, g: 'b', he: 'The duodenum', stop: 'Stop. That’s the duodenum, stuck to the gallbladder. Hands only, no energy.', why: 'A thermal injury to the duodenum usually only shows up a day or two later.', refs: [25], fx: { thermal: 15, flag: 'duod' } }
        ],
        missSay: 'Not there. Look for the gallbladder neck, it’s under the swollen omentum.',
        to: 'hard1'
      },
      hard1: {
        view: 'mentor:tense', say: 'Twenty minutes have gone by. We’ve made very little progress. What now?', dt: 15, st: { peel: 1 }, refs: [3, 5],
        tip: { stu: 'Time without progress is clinical information, not a personal failure.', nurse: 'Suggest it quietly: call another senior? And get a drain and sutures ready.', senior: 'Teach the resident to set themselves a clock in advance.' },
        opts: [
          { t: 'Carry on slowly, right on the gallbladder and above the line, with the sucker as a retractor', g: 'g', to: 'hard_r', kw: ['slowly', 'on the gallbladder', 'above'], refs: [5], reply: 'All right. But I’m setting a clock. Another twenty minutes without a critical view and we have a different conversation.' },
          { t: 'Go at the gallbladder from above, fundus first', g: 'o', to: 'ff', kw: ['fundus', 'above'], refs: [5, 24], why: 'In severe inflammation a fundus-first approach can lead into the wrong plane and injure the duct and the artery.', reply: 'You can, but in edema like this it’s more dangerous than it looks. Let’s see.' },
          { t: 'Go deep into the triangle until we see the duct', g: 'b', to: 'hard_r', kw: ['deep', 'duct'], refs: [5, 21], fx: { misid: 25, bdi: 25 }, why: 'Deep dissection in an edematous triangle is the classic route to a duct injury.', reply: 'Looking for the duct is exactly what we don’t do. But go on, I’m watching.' }
        ]
      },
      hard_r: {
        roll: [
          { p: function (S) { return v(S, 'bdi') >= 25 ? pct((v(S, 'bdi') + v(S, 'misid')) / 140) : 0; }, flag: 'bdi', to: 'c_bdi', fx: function (S) { return { flag: S.cs.id === 'mirizzi' ? 'bdiD' : 'bdiE', st: { injury: 'cbdcut', bile: true } }; }, ev: 'Bile. A lot of bile. And the duct you thought was the cystic duct carries on downward.', luck: 'You went deep into an edematous triangle and the duct wasn’t injured. The risk was very high.' },
          { p: function (S) { return S.cs.id === 'ac2' && v(S, 'misid') < 25 ? .5 : 0; }, to: 'hard_ok' },
          { p: function (S) { return S.cs.id === 'ac2' ? .3 : 0; }, flag: 'unstable', to: 'unstab', ev: 'Anesthetist: blood pressure 85, he needs fluids and noradrenaline. How much longer?' },
          { p: 1, to: 'stuck' }
        ]
      },
      hard_ok: {
        view: 'scene', kind: 'info', btn: 'Carry on', st: { peel: 2 },
        say: 'See that? Little by little it opens. The patience paid off. Now we clear the triangle completely.',
        to: 'energy'
      },
      unstab: {
        view: 'mentor:tense', say: 'Did you hear the anesthetist? He’s unstable and we don’t have a critical view. That changes the plan. What do you think?', fx: { hemo: 1 }, refs: [55],
        tip: { stu: 'In an unstable patient, a long operation is a risk in itself.', nurse: 'Fluids and a pump for anesthesia, and a drain for the gallbladder on the table.', senior: 'This is where you learn that the patient decides the operation, not the gallbladder.' },
        opts: [
          { t: 'Cut it short: drain the gallbladder now and remove it once he’s stable', g: 'g', to: 'ccy', kw: ['drain', 'short'], refs: [55], fx: { flag: 'ccy' }, reply: 'Yes. A drain in the gallbladder, we get out and come back when he’s stronger. The Tokyo guidelines describe exactly that.' },
          { t: 'A quick subtotal cholecystectomy', g: 'g', to: 'stc_type', kw: ['subtotal'], refs: [6, 63], fx: { flag: 'stc', bdi: -40 }, reply: 'Also possible, if it’s quick. Open it, take the stones out, a drain.' },
          { t: 'Carry on as usual, anesthesia will cope', g: 'b', to: 'stuck', kw: ['as usual', 'cope'], refs: [55], fx: { hemo: 1 }, why: 'In an unstable patient you shorten the operation: drain the gallbladder or do a quick subtotal.', reply: 'Anesthesia won’t cope on their own. We’re one team.' }
        ]
      },
      stuck: {
        view: 'mentor:tense', say: 'Forty minutes and still no critical view. What do we do?', st: { peel: 1 }, refs: [3, 5],
        tip: { stu: 'When there’s no critical view after a reasonable time, there are structured bailout options. They’re part of the operation.', nurse: 'This is the time to suggest calling another senior and to prepare a drain, sutures and an open set.', senior: 'The moment when good surgeons stop. Let the resident say it themselves.' },
        opts: [
          { t: 'First of all, call another senior', g: 'g', to: 'n_bail', kw: ['senior', 'call', 'help'], refs: [3], fx: { flag: 'help' }, reply: 'Right. I’m calling Tom. Two pairs of eyes. And in the meantime, what are the options?' },
          { t: 'Keep dissecting, it’ll open in a moment', g: 'b', to: 'push_r', kw: ['keep', 'dissecting'], refs: [3, 5], fx: { bdi: 30, t: 15 }, why: 'After a reasonable time without a critical view you call for help and consider a bailout. Forceful dissection sharply raises the risk of injury.', reply: '“In a moment” is what everyone who injured a duct said. All right, I’m next to you.' },
          { t: 'Go straight to a bailout', g: 'o', to: 'n_bail', kw: ['bailout', 'bail out'], refs: [3], reply: 'Yes, but we call for help as well. I’m already on the phone.' }
        ]
      },
      n_bail: {
        view: 'tray', kind: 'check', for: ['nurse'], skip: 'bail2', btn: 'Ready',
        say: 'Change of plan. What are you getting ready?',
        items: [
          { t: 'Sutures for an internal repair and an endoloop', need: true, miss: 'Sutures and an endoloop. In a subtotal you suture from inside.' },
          { t: 'A drain', need: true, miss: 'A drain. After a subtotal we almost always leave one.' },
          { t: 'An open set in the room', need: true, miss: 'An open set. We don’t open it, but it’s in the room.' },
          { t: 'Tell the team and anesthesia about the change', need: true, miss: 'And tell everyone. A change of plan is something the whole team needs to hear.' },
          { t: 'Close up the retrieval bag because we’re finishing', no: true, miss: 'We’re not finishing yet. We’ll still need the bag.' }
        ],
        ok: 'Good. That’s how a team works.',
        to: 'bail2'
      },
      bail2: {
        view: 'mentor:tense', say: 'So what’s your way out?', dt: 3, refs: [5, 6, 63],
        tip: { stu: 'Subtotal cholecystectomy: fewer duct injuries, more leaks that usually settle.', nurse: 'Whatever is chosen decides the tray: sutures and a drain, or an open set.', senior: 'Ask what the resident will do if it’s frozen in the open as well.' },
        opts: [
          { t: 'Subtotal: open the gallbladder, remove the stones and leave the back wall', g: 'g', to: 'stc_type', kw: ['subtotal', 'partial'], refs: [6, 63], fx: { flag: 'stc', bdi: -40 }, reply: 'Yes. In a review of thirty studies, duct injury was very rare with a subtotal. Let’s do it.' },
          { t: 'Fundus down', g: 'o', to: 'ff', kw: ['fundus'], refs: [5, 24], why: 'In severe inflammation a fundus-first approach can lead into the wrong plane and injure the duct and the artery.', reply: 'Possible. But if it’s still unclear at the neck, we stop there.' },
          { t: 'Convert to open', g: 'o', to: 'open_q', kw: ['open', 'convert'], refs: [5, 6], fx: { flag: 'convert', t: 25 }, why: 'Converting to open doesn’t by itself unfreeze a frozen triangle.', reply: 'We’ll open. But remember, the triangle is frozen in the open too.' },
          { t: 'Keep dissecting by force', g: 'b', to: 'push_r', kw: ['force', 'keep'], refs: [5, 56], fx: { bdi: 30, t: 15 }, why: 'Forceful dissection in a frozen triangle sharply raises the risk of duct injury.', reply: 'I don’t like this. I’m watching every move.' },
          { t: 'Drain the gallbladder and finish', g: 'g', to: 'ccy', kw: ['drain', 'cholecystostomy'], refs: [55], when: function (S) { return v(S, 'hemo') >= 1 || S.f.unstable || S.f.co2ev; }, fx: { flag: 'ccy' }, reply: 'When he’s unstable, that’s the right decision. Drain it and get out.' }
        ]
      },
      ccy: {
        view: 'mentor:calm', kind: 'info', btn: 'Close',
        say: 'We’ve put a drain in the gallbladder and we’re done. Sometimes the bravest thing in the room is to stop.', refs: [55], dt: 10,
        to: 'close'
      },
      stc_type: {
        view: 'scene', say: 'Which kind of subtotal? Do we leave the remnant open or close it?', dt: 4, refs: [6, 63],
        tip: { stu: 'In a fenestrating subtotal the remnant is left open. In a reconstituting subtotal it’s closed into a small pouch.', senior: 'There’s personal preference here. What matters is that the resident knows the price of each.' },
        opts: [
          { t: 'Fenestrating: the remnant open, an internal stitch over the cystic duct opening if you can see it, and a drain', g: 'g', to: 'stc_r', kw: ['fenestrating', 'open'], refs: [6, 63], fx: { flag: 'stcF' }, reply: 'That’s what I do in most cases. More leaks, but most of them close on their own.' },
          { t: 'Reconstituting: close the remnant into a small pouch', g: 'g', to: 'stc_r', kw: ['reconstituting', 'close'], refs: [6], fx: { flag: 'stcR' }, reply: 'Also legitimate. Fewer leaks, but a remnant that can form stones again.' }
        ]
      },
      stc_r: { when: [{ if: is('mirizzi'), to: 'mir_fist' }, { if: yes, to: 'stc_do' }] },
      mir_fist: {
        view: 'scene', say: 'We’ve opened the gallbladder. See that? A hole in the wall of the duct, where the stone was pressing. What now?', st: { bile: true, focus: 'cbd' }, dt: 5, refs: [56, 62],
        tip: { stu: 'In the Csendes classification, from type 2 upward there’s a fistula between the gallbladder and the duct, with increasing destruction of the wall.', nurse: 'Call HPB now. Fine sutures and a T-tube within reach.', senior: 'The win here is stopping. Tell the resident so.' },
        opts: [
          { t: 'Stop, don’t repair it alone, and call HPB', g: 'g', to: 'mir_q', kw: ['stop', 'hpb', 'call'], refs: [56, 62], fx: { flag: ['help', 'hpb'] }, reply: 'Good. This is exactly the moment. We leave a cuff of gallbladder wall and the HPB surgeon decides how to repair it.' },
          { t: 'Suture the hole ourselves', g: 'b', to: 'mir_q', kw: ['suture', 'ourselves'], refs: [56, 62], fx: { flag: ['help', 'hpb'], bdi: 15 }, why: 'A fistula between the gallbladder and the duct needs an HPB surgeon. An inexperienced repair makes the injury worse.', reply: 'Wait. Breathe. That isn’t a resident’s repair, and it isn’t mine either. HPB is on the way.' },
          { t: 'Remove the rest of the gallbladder completely', g: 'b', to: 'mir_q', kw: ['remove', 'completely'], refs: [56], fx: { flag: ['help', 'hpb'], bdi: 30 }, why: 'Removing all of the gallbladder wall with a fistula enlarges the defect in the duct. You leave a cuff for the repair.', reply: 'No. That wall is what will close the duct. We stop.' }
        ]
      },
      mir_q: {
        view: 'mentor:or', say: 'A question while we wait. On the Csendes classification, what type of Mirizzi is this?', refs: [56],
        tip: { stu: 'Type 1 is external compression. Types 2 to 4 are a fistula, depending on how much of the wall is destroyed.', senior: 'The classification decides the repair. Ask what the difference in management is.' },
        opts: [
          { t: 'Type 1, external compression', g: 'b', to: 'mir_hpb', kw: ['one', '1', 'compression'], refs: [56], why: 'In type 1 there’s no opening in the duct. Here there’s a fistula.', reply: 'In type 1 there’s no hole. Here there is.' },
          { t: 'Type 2, a small fistula in the duct wall', g: 'g', to: 'mir_hpb', kw: ['two', '2', 'fistula'], refs: [56], reply: 'Right. A small hole, most of the wall intact. It can be repaired with a cuff of gallbladder.' },
          { t: 'Type 4, the whole wall destroyed', g: 'o', to: 'mir_hpb', kw: ['four', '4'], refs: [56], why: 'In type 4 the whole circumference of the duct is destroyed. Here most of the wall is intact.', reply: 'In type 4 there’s no duct left to repair. Here, thankfully, most of the wall is intact.' }
        ]
      },
      mir_hpb: {
        view: 'mentor:calm', kind: 'info', btn: 'Carry on', dt: 40,
        say: 'The HPB surgeon is here. He’s closing the opening with a cuff of gallbladder wall, over a drain. Well done for stopping.', refs: [62],
        to: 'gear_bag'
      },
      stc_do: {
        view: 'scene', say: 'We’ve opened the gallbladder and aspirated it. What do we do with the stones and the cystic duct opening?', st: { stones: false, bed: .5, peel: 1 }, dt: 15, refs: [6],
        tip: { stu: 'The stone impacted in the neck is the one that has to come out. A retained stone is a reason for coming back.', nurse: 'A bag for the stones, sutures and a drain.', senior: 'Make sure the resident doesn’t push a stone into the duct.' },
        opts: [
          { t: 'Remove all the stones, an internal stitch over the cystic duct opening if you can see it, and a drain', g: 'g', to: 'gear_bag', kw: ['stones', 'stitch', 'drain'], refs: [6], fx: { flag: 'drain' }, reply: 'Perfect. All the stones out, the opening closed and a drain to be safe.' },
          { t: 'Leave it open, no drain', g: 'o', to: 'gear_bag', kw: ['no drain'], refs: [6], fx: { flag: 'nodrain' }, why: 'After a fenestrating subtotal a drain is usual, because leaks are common.', reply: 'I’d leave a drain. A leak after a subtotal isn’t rare.' },
          { t: 'Push the stone from the neck further in, so it’s out of the way', g: 'b', to: 'gear_bag', kw: ['push'], fx: { flag: 'cbdret' }, why: 'A stone pushed into the duct becomes a common bile duct stone.', reply: 'Further in where? Into the common bile duct? That’s how you make a duct stone. Take it out.' }
        ]
      },
      ff: {
        view: 'scene', say: 'Fundus down, as far as the neck. And now?', st: { bed: .8, peel: 2 }, dt: 15, refs: [5, 24],
        tip: { stu: 'In a fundus-first approach the gallbladder comes off the liver first, and you only reach the neck at the end.', senior: 'The danger with this approach is carrying on in the same plane until you’re behind the duct.' },
        opts: [
          { t: 'If only two structures are entering the gallbladder, clips. If not, stop at a subtotal', g: 'g', to: 'ff_r', kw: ['two structures', 'stop', 'subtotal'], refs: [2, 6], reply: 'Exactly. Coming from above doesn’t excuse you from identifying.' },
          { t: 'Divide whatever reaches the neck', g: 'b', to: 'ff_r', kw: ['divide'], refs: [5, 67], fx: { bdi: 35 }, why: 'In a fundus-first approach in severe inflammation, what reaches the neck can be the common hepatic duct and the right hepatic artery.', reply: 'Whatever reaches the neck? The common duct reaches there too. But go on.' }
        ]
      },
      ff_r: {
        roll: [
          { p: function (S) { return pct(v(S, 'bdi') / 100); }, flag: 'bdi', to: 'c_bdi', fx: { flag: 'bdiE', st: { injury: 'cbdcut', bile: true } }, ev: 'Bile from below. What you divided at the neck was the common hepatic duct.', luck: 'You divided at the neck without identifying, and this time it really was the cystic duct.' },
          { p: function (S) { return S.st.inflam >= 3 ? 1 : 0; }, to: 'stc_type' },
          { p: 1, to: 'gear_clip' }
        ]
      },
      open_q: {
        view: 'mentor:tense', say: 'We’ve opened. And still, the triangle is frozen in the open too. What now?', dt: 10, refs: [5, 6, 63],
        tip: { stu: 'In the open you see in three dimensions, but the tissue is the same tissue.', nurse: 'Retractors, good light and wide-bore suction.', senior: 'This is the moment to teach that conversion isn’t the solution, just a change of approach.' },
        opts: [
          { t: 'An open subtotal cholecystectomy', g: 'g', to: 'stc_type', kw: ['subtotal'], refs: [6, 63], fx: { flag: 'stc', bdi: -30 }, reply: 'Right. That’s exactly what the Tokyo and SAGES guidance says.' },
          { t: 'Dissect deep until we see the duct', g: 'b', to: 'push_r', kw: ['deep', 'dissect'], refs: [5, 6], fx: { bdi: 35 }, why: 'In the open, the danger of dissecting a frozen triangle remains. A subtotal is usually better.', reply: 'We’ve opened the abdomen, not the triangle. But go on, slowly.' }
        ]
      },
      push_r: {
        roll: [
          { p: function (S) { return pct((v(S, 'bdi') + v(S, 'misid')) / 120 * (S.st.inflam >= 2 ? 1.3 : 1)); }, flag: 'bdi', to: 'c_bdi', fx: function (S) { return { flag: S.cs.id === 'mirizzi' ? 'bdiD' : 'bdiE', st: { injury: 'cbdcut', bile: true } }; }, ev: 'Bile everywhere. What you dissected wasn’t the cystic duct.', luck: 'You dissected by force in a frozen triangle and the duct wasn’t injured. Very lucky.' },
          { p: function (S) { return S.st.inflam >= 3 ? 1 : 0; }, to: 'stuck2' },
          { p: 1, to: 'stu_cvs' }
        ]
      },
      stuck2: {
        view: 'mentor:tense', say: 'Another twenty minutes. No progress, and the tissue is bleeding. Now?', dt: 3, refs: [6, 63],
        tip: { senior: 'This is a second chance. Most learners take it.' },
        opts: [
          { t: 'A subtotal, and call for help', g: 'g', to: 'stc_type', kw: ['subtotal', 'help'], refs: [6, 63], fx: { flag: ['stc', 'help'], bdi: -30 }, reply: 'At last. That’s the right decision, and there’s no shame in it.' },
          { t: 'A little longer', g: 'b', to: 'stc_type', kw: ['longer'], refs: [6], fx: { flag: 'stc' }, why: 'Beyond a certain point, every minute of forceful dissection is risk, not progress.', reply: 'No. I’m making the call: we do a subtotal.' }
        ]
      },

      /* ================= CVS ================= */
      stu_cvs: {
        view: 'ai', for: ['stu'], skip: 'n_cvs',
        say: 'A question for the student. What are the three components of the critical view of safety?', refs: [2],
        opts: [
          { t: 'A clear triangle, the lower third of the gallbladder separated from the liver, and only two structures entering the gallbladder', g: 'g', to: 'n_cvs', kw: ['triangle', 'third', 'two'], refs: [2], reply: 'Excellent. Three out of three. Remember that when you’re a senior too.' },
          { t: 'You see the common bile duct, the artery and the gallbladder', g: 'b', to: 'n_cvs', kw: ['common'], refs: [2], why: 'The critical view doesn’t require exposing the common bile duct. You only see two structures entering the gallbladder.', reply: 'We don’t go looking for the common duct. Just two structures entering the gallbladder.' },
          { t: 'Only two structures entering the gallbladder', g: 'o', to: 'n_cvs', kw: ['two structures'], refs: [2], why: 'That’s one component out of three. Missing: a clear triangle and the lower third separated from the liver.', reply: 'That’s one. There are two more: a clear triangle and the lower third separated.' }
        ]
      },
      n_cvs: {
        view: 'tray', kind: 'check', for: ['nurse'], skip: 'cvs', btn: 'Ready',
        say: 'The critical view is coming up. What are you getting ready now?', refs: [3, 19],
        items: [
          { t: 'Saving images of two views', need: true, miss: 'Images. Front and back. A record that stays.' },
          { t: 'A cholangiogram set, or ICG if available', need: true, miss: 'The cholangiogram set. If they ask for it, there’s no time to go looking.' },
          { t: 'A clip applier with the right size of clip', need: true, miss: 'Clips. Loaded, in a size that suits the duct.' },
          { t: 'Calling a time out before anything is divided', need: true, miss: 'And you can call the time out. Anyone in the room can.' },
          { t: 'A stapler for the duct', no: true, miss: 'A stapler on the cystic duct isn’t standard in most cases. Clips or an endoloop.' }
        ],
        ok: 'You’re reading the room. Well done.',
        to: 'cvs'
      },
      cvs: { when: [{ if: function (S) { return v(S, 'misid') >= 25; }, to: 'cvs_part' }, { if: yes, to: 'cvs_full' }] },

      cvs_full: {
        view: 'scene', kind: 'check', st: { peel: 3, focus: null, labels: false }, dt: 4, btn: 'This is what I see', refs: [2, 3, 19],
        say: 'Stop for a moment. Before any clip, what do you see? Tick only what’s really there.',
        tip: { stu: 'Three components, not two. And the time out is part of the operation.', nurse: 'This is a quiet moment in the room. Save the images.', senior: 'Ask the resident to show each component on camera, front and back.' },
        items: [
          { t: 'The triangle is cleared of fat and fibrous tissue', need: true, miss: 'The triangle. Cleared of fat and fibers, and you can see the liver through it.' },
          { t: 'The lower third of the gallbladder is separated from the liver bed', need: true, miss: 'The lower third separated from the liver, with the cystic plate in view. That’s the component everyone forgets.' },
          { t: 'Only two structures enter the gallbladder', need: true, miss: 'Two structures, and only two, entering the gallbladder.' },
          { t: 'The whole team pauses, a time out before dividing', need: true, miss: 'And a pause. The whole team, a few seconds, before you divide a tubular structure.' },
          { t: 'Photographs of two views, front and back', need: true, miss: 'And photograph it front and back. That’s documentation, and it also makes you really look.' },
          { t: 'The common bile duct is seen along its whole length', no: true, miss: 'You don’t need to expose the common duct. Exposing it only adds to the danger.' }
        ],
        ok: 'That’s a critical view. Three out of three, we paused and we photographed. Now you can clip.',
        fx: { g: { misid: -30, flag: ['cvs3', 'timeout'] }, o: { misid: -20, flag: ['cvs3', 'timeout'] }, b: { flag: 'cvsmiss' } },
        to: 'cvs_after'
      },
      cvs_part: {
        view: 'scene', kind: 'check', st: { peel: 2, focus: 'plate', labels: false }, dt: 3, btn: 'This is what I see', refs: [2, 3],
        say: 'Stop for a moment. What do you see now? Tick only what’s really in the picture.',
        tip: { stu: 'Look at the junction between the gallbladder and the liver. Is it still stuck?', senior: 'This tests honesty, not knowledge. A partial critical view ticked as complete is a recipe for injury.' },
        items: [
          { t: 'The triangle is cleared of fat and fibrous tissue', need: true, miss: 'You’ve already cleared the triangle. That’s true.' },
          { t: 'The lower third of the gallbladder is separated from the liver bed', no: true, miss: 'Look carefully. The lower third is still stuck to the liver. This isn’t a critical view yet.' },
          { t: 'Two structures can be seen entering the gallbladder', need: true, miss: 'You can see two structures. But without the lower third, you can’t be sure there isn’t a third.' },
          { t: 'Time for the time out and the clips', no: true, miss: 'Not yet. Without a full critical view, we don’t stop for clips.' }
        ],
        ok: 'Right, something’s still missing. The lower third is stuck. Good that you said so.',
        fx: { g: { flag: 'honest' }, o: { flag: 'cvsmiss', misid: 10 }, b: { flag: 'cvsmiss' } },
        to: 'cvs_after'
      },
      cvs_after: { when: [{ if: has('cvsmiss'), to: 'cvs_push' }, { if: has('honest'), to: 'cvs_more' }, { if: yes, to: 'ioc_r' }] },
      cvs_push: {
        view: 'scene', say: 'So you’re saying that’s enough? Let’s look again. What do you do?', refs: [2, 3, 21],
        tip: { stu: 'Most injuries happen when the surgeon is sure they’re looking at the cystic duct.', senior: 'A moment to teach without humiliating. Ask: what would convince you it isn’t the cystic duct?' },
        opts: [
          { t: 'Go back and dissect to a full critical view, then pause for a time out', g: 'g', to: 'ioc_r', kw: ['back', 'full', 'time out'], refs: [2, 3], fx: { set: { misid: 0 }, flag: ['cvs3', 'timeout'], st: { peel: 3 }, t: 8 }, reply: 'Good. Five more minutes of work and now you’re sure. That’s what it feels like.' },
          { t: 'A cholangiogram or ICG to confirm', g: 'g', to: 'ioc_q', kw: ['cholangiogram', 'icg'], refs: [3, 15], fx: { misid: -15 }, reply: 'Also right. When you’re not sure, you image.' },
          { t: 'Put a clip on, it’s the cystic duct', g: 'b', to: 'ioc_r', kw: ['clip', 'cystic duct'], refs: [2, 21], fx: { misid: 15, flag: 'cvs2' }, why: 'A clip without a full critical view leaves the risk of misidentification. Most injuries are errors of perception.', reply: 'I don’t feel good about this. But it’s your operation. I’m watching.' }
        ]
      },
      cvs_more: {
        view: 'scene', say: 'Good that you said so. So how do we move forward?', refs: [2],
        opts: [
          { t: 'Separate the lower third from the liver until the cystic plate is in view', g: 'g', to: 'cvs_ok', kw: ['third', 'separate', 'plate'], refs: [2], fx: { set: { misid: 0 }, t: 8 }, reply: 'Yes. A few more minutes and you’ll see everything become clear.' },
          { t: 'A cholangiogram or ICG', g: 'g', to: 'ioc_q', kw: ['cholangiogram', 'icg'], refs: [3, 15], fx: { misid: -15 }, reply: 'You can. But it’s better to complete the critical view as well.' },
          { t: 'That’s enough, clips', g: 'b', to: 'ioc_r', kw: ['enough', 'clips'], refs: [2], fx: { flag: 'cvs2', misid: 10 }, why: 'Two components out of three isn’t a critical view.', reply: 'You just told me something’s missing. So why close?' }
        ]
      },
      cvs_ok: {
        view: 'scene', kind: 'info', btn: 'Time out', st: { peel: 3 }, refs: [2, 3, 19],
        say: 'Now that’s a critical view. Everybody stops, time out. We photograph front and back.',
        fx: { flag: ['cvs3', 'timeout'] },
        to: 'ioc_r'
      },

      /* ================= imaging ================= */
      ioc_r: { when: [{ if: function (S) { return S.cs.id === 'cbd' && S.f.cleared; }, to: 'gear_clip' }, { if: is('anat', 'cbd'), to: 'ioc_q' }, { if: yes, to: 'gear_clip' }] },

      ioc_q: {
        view: 'mentor:or', say: 'We have a C-arm and ICG in the room. Do we use them?', dt: 2, refs: [3, 15, 57],
        tip: { stu: 'A cholangiogram shows the whole biliary tree and any stones. ICG shows the course of the ducts without radiation.', nurse: 'Cholangiogram: catheter, diluted contrast, C-arm and lead aprons for everyone.', senior: 'The 2020 guideline recommends liberal imaging when the anatomy is unclear, not necessarily routinely.' },
        opts: [
          { t: 'A cholangiogram through the cystic duct', g: 'g', to: 'ioc_v', kw: ['cholangiogram', 'ioc', 'catheter'], refs: [3, 57], fx: { flag: 'ioc', t: 12 }, reply: 'Go on, then. A clip on the gallbladder side, a small cut in the duct, the catheter, and we shoot.' },
          { t: 'ICG, to see the ducts by fluorescence', g: 'g', to: 'icg_v', kw: ['icg', 'fluorescence', 'green'], refs: [15, 16], fx: { flag: 'icg', t: 3 }, when: not('cbd'), reply: 'Switching to ICG mode. Look at what’s glowing.' },
          { t: 'ICG, to see the ducts by fluorescence', g: 'o', to: 'ioc_q2', kw: ['icg', 'fluorescence'], refs: [15, 16], when: is('cbd'), why: 'ICG shows the course of the ducts, but it doesn’t replace a cholangiogram when you’re looking for a duct stone.', reply: 'ICG will show ducts, not stones. We’re looking for a stone.' },
          { t: 'No need, we have a critical view', g: 'o', to: 'gear_clip', kw: ['no need'], refs: [3], when: not('cbd'), why: 'Image liberally when the anatomy is unclear. Here we saw a structure we hadn’t identified.', reply: 'Fine. But after what we saw, I’d have done a cholangiogram.' },
          { t: 'No need, let’s finish', g: 'b', to: 'gear_clip', kw: ['no need', 'finish'], refs: [60, 61], when: is('cbd'), fx: { flag: 'cbdMissed' }, why: 'A raised bilirubin and a dilated duct without a workup: a stone will be left in the duct.', reply: 'And if there’s a stone? We’ll see it tomorrow as jaundice. All right.' }
        ]
      },
      ioc_q2: {
        view: 'mentor:or', say: 'So, a cholangiogram?',
        opts: [
          { t: 'Yes, a cholangiogram through the cystic duct', g: 'g', to: 'ioc_v', kw: ['yes', 'cholangiogram'], refs: [3, 57], fx: { flag: 'ioc', t: 12 }, reply: 'Go on, then. Catheter and contrast.' },
          { t: 'No, let’s finish', g: 'b', to: 'gear_clip', kw: ['no'], refs: [60], fx: { flag: 'cbdMissed' }, why: 'A raised bilirubin and a dilated duct without a workup: a stone will be left in the duct.', reply: 'As you like. We’ll see what the labs say tomorrow.' }
        ]
      },
      ioc_v: { when: [{ if: is('anat'), to: 'ioc_anat' }, { if: function (S) { return S.cs.id === 'cbd' && S.st.cbdStone; }, to: 'ioc_cbd' }, { if: yes, to: 'ioc_clean' }] },
      ioc_anat: {
        view: 'scene', kind: 'info', btn: 'Carry on', st: { mode: 'ioc', labels: true }, refs: [1, 57],
        say: 'There it is. The right posterior duct drains straight into the cystic duct. If we’d divided it, that would have been an injury.',
        fx: { misid: -30, flag: 'abseen' },
        tip: { stu: 'A cholangiogram shows the whole biliary tree. A duct missing from the picture is a sign of injury.', senior: 'Show the resident what would have happened with a clip placed too low.' },
        to: 'ab_plan'
      },
      icg_v: { when: [{ if: is('anat'), to: 'icg_anat' }, { if: yes, to: 'icg_clean' }] },
      icg_anat: {
        view: 'scene', kind: 'info', btn: 'Carry on', st: { mode: 'icg', labels: true }, refs: [15, 16],
        say: 'With fluorescence you can see it: the right duct joins the cystic duct. Good thing we didn’t touch it.',
        fx: { misid: -25, flag: 'abseen' },
        to: 'ab_plan'
      },
      icg_clean: {
        view: 'scene', kind: 'info', btn: 'Carry on', st: { mode: 'icg', labels: true }, refs: [15],
        say: 'Glowing nicely. The cystic duct joins the common bile duct, exactly where we thought.',
        fx: { misid: -15 },
        to: 'gear_clip'
      },
      ab_plan: {
        view: 'scene', say: 'So where do the clips go on the cystic duct?', st: { mode: 'lap', labels: false, focus: 'aberr' }, refs: [1],
        tip: { stu: 'When a duct drains into the cystic duct, the clip has to be on the gallbladder side of the junction.', senior: 'Here the resident learns that even after we’ve identified it, an injury is still possible.' },
        opts: [
          { t: 'Right on the gallbladder, above where the right duct joins', g: 'g', to: 'gear_clip', kw: ['on the gallbladder', 'above'], refs: [1], reply: 'Exactly. That way the right duct keeps draining into the common bile duct.' },
          { t: 'On the cystic duct close to the common bile duct, as usual', g: 'b', to: 'gear_clip', kw: ['as usual', 'close'], refs: [1], fx: { misid: 10 }, why: 'A clip below the junction also closes the right posterior duct, a type B injury.', reply: 'Wait. Stop. That way you close the right duct as well. Go higher, right on the gallbladder.' }
        ]
      },
      ioc_cbd: {
        view: 'scene', kind: 'info', btn: 'What now', st: { mode: 'ioc', labels: true, cbdStone: true }, refs: [59],
        say: 'See that? A filling defect in the lower part of the duct. A stone. And the contrast isn’t flowing well into the duodenum.',
        to: 'c_cbd'
      },
      ioc_clean: {
        view: 'scene', kind: 'info', btn: 'Carry on', st: { mode: 'ioc', labels: true }, refs: [57],
        say: 'A nice cholangiogram. The ducts are where they should be and the contrast flows into the duodenum. No stone.',
        fx: { misid: -20 },
        to: 'gear_clip'
      },
      c_cbd: {
        view: 'scene', say: 'There’s a stone in the duct. What do we do?', dt: 2, refs: [59, 60],
        tip: { stu: 'Clearance at surgery versus ERCP: in the Cochrane review there was no difference in mortality or complications.', nurse: 'Transcystic clearance: guidewire, balloon or basket, and a choledochoscope if available.', senior: 'Local experience and equipment decide. Let the resident say what’s missing.' },
        opts: [
          { t: 'Transcystic clearance now, we have the set and the experience', g: 'g', to: 'lcbde', kw: ['clearance', 'transcystic', 'now'], refs: [59], when: has('kit'), fx: { t: 30 }, reply: 'Go on, then. Guidewire, balloon, and let’s see if it comes out.' },
          { t: 'Transcystic clearance now', g: 'o', to: 'gear_clip', kw: ['clearance', 'now'], refs: [59], when: lacks('kit'), fx: { flag: 'ercpPost' }, why: 'Without the equipment and experience in the room, better not to improvise. ERCP after surgery is a good alternative.', reply: 'We don’t have the set in the room. Next time we order it in advance. So, ERCP afterwards.' },
          { t: 'Finish the cholecystectomy and ERCP after the operation', g: 'g', to: 'gear_clip', kw: ['ercp', 'after'], refs: [59, 60], fx: { flag: 'ercpPost' }, reply: 'Legitimate. I’ll talk to the gastroenterologists now.' },
          { t: 'Leave it, small stones pass on their own', g: 'b', to: 'gear_clip', kw: ['leave', 'pass'], refs: [61], fx: { flag: 'cbdMissed' }, why: 'A stone seen in the duct gets treated. Otherwise it comes back with pain, jaundice or pancreatitis.', reply: 'We’ve seen it. We don’t leave a stone we’ve seen.' }
        ]
      },
      lcbde: {
        view: 'scene', kind: 'info', btn: 'Carry on', st: { cbdStone: false, mode: 'ioc' }, refs: [59],
        say: 'The balloon did the job. The repeat cholangiogram is clear and the contrast flows into the duodenum. Now we close the cystic duct.',
        to: 'gear_clip'
      },

      /* ================= clips and cut ================= */
      gear_clip: {
        kind: 'gear', view: 'move:clip', st: { mode: 'lap', labels: false, focus: null }, dt: 2,
        say: 'Now the clips. What do you ask the scrub nurse for?',
        pool: ['clip', 'hook', 'stapler', 'scis', 'grasp', 'sealer'], need: 'clip', alt: [],
        ok: 'A clip applier. Make sure the jaws cross the whole width, and see the tip behind.',
        bad: 'No. On the cystic duct you put a clip, not something that heats or cuts.',
        why: 'The cystic duct and the cystic artery are closed with clips, and a wide duct with an endoloop or a suture (convention).',
        tip: { nurse: 'A clip applier with clips sized for the duct. And count how many were fired.', senior: 'Check that the resident sees the tip of the clip behind the duct before squeezing.' },
        to: 'clip'
      },
      clip: { when: [{ if: function (S) { return S.st.inflam >= 2; }, to: 'clip_wide' }, { if: is('anat'), to: 'clip_short' }, { if: yes, to: 'clip_main' }] },

      clip_main: {
        view: 'scene', say: 'How many clips, and where?', st: { clips: false },
        tip: { stu: 'Two on the side that stays in the patient and one on the gallbladder side is an accepted convention.', nurse: 'Count how many clips were fired.', senior: 'Ask why you need a small stump beyond the clip.' },
        opts: [
          { t: 'Two on the side that stays and one on the gallbladder side, on a duct you can see completely', g: 'g', to: 'artery', kw: ['two', 'one'], fx: { flag: 'stumpok', st: { clips: true } }, reply: 'Classic. And leave a small stump beyond the clip, so it doesn’t slip.' },
          { t: 'One on each side', g: 'o', to: 'artery', kw: ['one on each'], fx: { st: { clips: true } }, why: 'It’s usual to leave two clips on the side that stays in the patient (convention).', reply: 'I like two on the side that stays. Belt and braces.' },
          { t: 'As many as possible, five or six', g: 'o', to: 'artery', kw: ['many', 'five'], fx: { st: { clips: true } }, why: 'Too many clips shorten the stump and make it harder to cut safely between them (convention).', reply: 'More clips isn’t more safety. It’s less room to cut.' }
        ]
      },
      clip_wide: {
        view: 'scene', say: 'The cystic duct is edematous and wide. The clip doesn’t close the whole width. What do we do?', st: { clips: false }, refs: [5],
        tip: { stu: 'A clip that doesn’t cross the whole width can slip on day two.', nurse: 'An endoloop ready and large clips.', senior: 'Check that the resident doesn’t fire a clip across half a duct and hope for the best.' },
        opts: [
          { t: 'An endoloop or a suture on the stump', g: 'g', to: 'artery', kw: ['endoloop', 'suture', 'loop'], fx: { flag: 'stumpok', st: { clips: true } }, reply: 'Good. An endoloop sits nicely on a thick duct.' },
          { t: 'A large clip, if it really crosses the whole width', g: 'g', to: 'artery', kw: ['large', 'xl'], fx: { flag: 'stumpok', st: { clips: true } }, reply: 'If it crosses the whole width, fine. Make sure you see the tip behind.' },
          { t: 'Squeeze hard, it’ll hold', g: 'b', to: 'artery', kw: ['squeeze', 'hold'], fx: { flag: 'stumpweak', st: { clips: true } }, why: 'A clip that doesn’t cross the whole width of the duct can slip and leak.', reply: 'That won’t hold. But all right, we’ll see tomorrow.' }
        ]
      },
      clip_short: {
        view: 'scene', say: 'The cystic duct is very short. The lower clip is almost on the common bile duct. What do we do?', st: { clips: false, focus: 'cduct' }, refs: [1],
        tip: { stu: 'When the cystic duct is short, the clip sits too close to the common bile duct and can narrow it.', senior: 'A situation that needs less traction, not more courage.' },
        opts: [
          { t: 'Clips close to the gallbladder, and if there’s no room, an endoloop or a suture', g: 'g', to: 'artery', kw: ['close to the gallbladder', 'endoloop', 'suture'], fx: { flag: 'stumpok', st: { clips: true } }, reply: 'Right. You give up the second clip before you give up the common bile duct.' },
          { t: 'A clip right against the common duct, as long as it holds', g: 'b', to: 'artery', kw: ['against', 'common'], refs: [1], fx: { bdi: 30, flag: 'tent', st: { clips: true } }, why: 'A clip right against the common bile duct when the cystic duct is short can narrow or close the common duct.', reply: 'Wait. That way the clip can catch a piece of the common duct. All right, go on, but it’s dangerous.' },
          { t: 'Pull the gallbladder hard upward to gain length', g: 'b', to: 'artery', kw: ['pull', 'length'], refs: [1, 21], fx: { bdi: 25, flag: 'tent', st: { clips: true } }, why: 'Pulling hard on a short duct pulls the common bile duct up too, and the clip catches it.', reply: 'Hard traction lifts the common duct as well. That’s how it ends up in the clip.' }
        ]
      },
      artery: {
        view: 'scene', say: 'And now the artery. What do you check before you close it?', st: { focus: 'cart' }, refs: [67, 68],
        tip: { stu: 'The cystic artery usually comes off the right hepatic artery, but more than 8% of people have two.', nurse: 'More clips ready.', senior: 'Ask what the right hepatic artery looks like when it loops close to the gallbladder.' },
        opts: [
          { t: 'That it goes into the gallbladder, and doesn’t rise and carry on to the liver like the right hepatic artery', g: 'g', to: 'art_r', kw: ['into the gallbladder', 'hepatic artery'], refs: [67, 68], fx: { flag: 'artok' }, reply: 'Exactly. An artery that enters the gallbladder, two clips on the side that stays, and divide.' },
          { t: 'Close the first one you see, that’s the artery', g: 'b', to: 'art_r', kw: ['first'], refs: [68], fx: { bleedrisk: 20 }, why: 'More than 8% of people have two cystic arteries, and the right hepatic artery can look like the cystic artery.', reply: 'The first one you see isn’t always the only one, and it isn’t always the right one. Look where it goes.' },
          { t: 'Burn it with the hook', g: 'b', to: 'art_r', kw: ['burn', 'hook'], fx: { bleedrisk: 30 }, why: 'The cystic artery is closed with clips. Energy alone can leave an artery that bleeds later (convention).', reply: 'An artery like that I close with clips. Energy is for small branches.' }
        ]
      },
      art_r: { when: [{ if: is('anat'), to: 'art2' }, { if: yes, to: 'cut_gear' }] },
      art2: {
        view: 'scene', say: 'Wait. Do you see another one? Behind, another small artery going into the gallbladder. What is it?', st: { focus: 'cart' }, refs: [68],
        tip: { stu: 'Two cystic arteries were found in more than 8% of cases, in a review of more than 9800 cases.', senior: 'This is exactly “the first artery isn’t always the only one”.' },
        opts: [
          { t: 'A second cystic artery. Clips on that one too', g: 'g', to: 'cut_gear', kw: ['second', 'clips'], refs: [68], reply: 'Nice. If you hadn’t seen it, it would have bled on us in the middle of the liver bed.' },
          { t: 'It’s nothing, carry on', g: 'b', to: 'cut_gear', kw: ['nothing', 'carry on'], refs: [68], fx: { bleedrisk: 40 }, why: 'An unrecognized second cystic artery bleeds while you take the gallbladder off the liver.', reply: 'Nothing that bleeds isn’t nothing. But go on.' }
        ]
      },
      cut_gear: {
        kind: 'gear', view: 'move:cut', dt: 2, refs: [25, 26],
        say: 'Time to divide. What do you want in your hand?',
        pool: ['scis', 'hook', 'sealer', 'clip', 'grasp'], need: 'scis', alt: [],
        ok: 'Scissors. No energy, between the clips, and leave a stump.',
        bad: 'Wait. Stop. Energy next to clips? The heat travels through the metal into the stump.',
        fxOk: { st: { cut: true } },
        fxBad: { thermal: 25, flag: 'stumpweak', st: { cut: true } },
        why: 'Dividing with energy next to a clip conducts heat through the metal and raises the risk of necrosis and a stump leak.',
        tip: { nurse: 'Laparoscopic scissors, not connected to the energy source.', senior: 'The resident should see both clips before cutting.' },
        to: 'clip_roll'
      },
      clip_roll: {
        roll: [
          { p: function (S) { return pct(.04 + v(S, 'bleedrisk') / 100); }, flag: 'bleedev', to: 'c_bleed', fx: { st: { bleed: 1 } }, ev: 'Suddenly, blood. A small pulsing arc from the triangle.', luck: 'You worked on the artery without checking it fully and this time it didn’t bleed.' },
          { p: function (S) { return v(S, 'misid') >= 30 || v(S, 'bdi') >= 25 ? pct((v(S, 'misid') + v(S, 'bdi')) / 160) : 0; }, flag: 'bdi', to: 'c_bdi', fx: { flag: 'bdiE', st: { injury: 'cbdclip' } }, ev: 'As the gallbladder lifts, something looks wrong. There’s a duct carrying on below the clips.', luck: 'You clipped and divided before the identification was certain, and this time it really was the cystic duct.' },
          { p: function (S) { return S.cs.id === 'anat' && S.f.cvs2 && !S.f.ioc && !S.f.icg ? .6 : 0; }, flag: 'bdiOccC', to: 'bed', luck: 'You closed without a full critical view and without a cholangiogram, in aberrant anatomy. This time the right duct wasn’t injured.' },
          { p: function (S) { return v(S, 'misid') >= 15 ? pct(v(S, 'misid') / 260) : 0; }, flag: 'bdiOccE', to: 'bed' },
          { p: 1, to: 'bed' }
        ]
      },

      /* ================= bleeding ================= */
      c_bleed: {
        view: 'scene', say: 'Wait. Blood. Breathe. What’s the first thing?', st: { bleed: 2 }, fx: { hemo: 1 }, refs: [67],
        tip: { stu: 'The classic mistake is firing clips blindly into blood.', nurse: 'Strong suction, loaded clips, a small swab and an open set close by.', senior: 'Your voice sets the resident’s pulse. Speak slowly.' },
        opts: [
          { t: 'Pressure with a grasper or a swab, suction, and a clip only once you can see the end', g: 'g', to: 'n_bleed', kw: ['pressure', 'suction', 'swab'], refs: [67], fx: { hemo: -1 }, reply: 'Exactly. Pressure buys time. Now suction, and show me the end of the vessel.' },
          { t: 'An extra port, suction and call for help', g: 'g', to: 'n_bleed', kw: ['port', 'help'], fx: { flag: 'help' }, reply: 'Right. More hands and good suction. And pressure until we’re ready.' },
          { t: 'Quick clips into the blood', g: 'b', to: 'n_bleed', kw: ['clips', 'quick'], refs: [67], fx: { bdi: 40, misid: 20, flag: 'blind' }, why: 'Blind clipping into blood is a known mechanism of combined duct and artery injury.', reply: 'No. Stop. A blind clip is how the common bile duct gets caught. Pressure first.' },
          { t: 'Burn it with the hook', g: 'b', to: 'n_bleed', kw: ['burn', 'hook'], refs: [25, 67], fx: { thermal: 20, bdi: 15, hemo: 1 }, why: 'Blind energy into blood in the triangle puts the duct at risk and doesn’t stop arterial bleeding.', reply: 'A hook into a pool of blood? You can’t see what you’re burning. Pressure.' }
        ]
      },
      n_bleed: {
        view: 'tray', kind: 'check', for: ['nurse'], skip: 'bleed_r', btn: 'Ready',
        say: 'There’s bleeding. What do you get ready without being asked?',
        items: [
          { t: 'Strong suction', need: true, miss: 'Suction. The first thing they’ll ask for.' },
          { t: 'Loaded clips', need: true, miss: 'Clips. Loaded and ready in hand.' },
          { t: 'A small laparoscopic swab', need: true, miss: 'A small swab. Pressure from inside.' },
          { t: 'An open set within reach', need: true, miss: 'An open set. If this doesn’t stop, we open.' },
          { t: 'Wait until they ask', no: true, miss: 'A good scrub nurse doesn’t wait. They get it ready.' }
        ],
        ok: 'Excellent. That’s how a bleed stays small.',
        to: 'bleed_r'
      },
      bleed_r: {
        roll: [
          { p: function (S) { return S.f.blind ? .5 : 0; }, flag: 'bdi', to: 'c_bdi', fx: { flag: 'bdiE', st: { injury: 'cbdclip', bleed: 0 } }, ev: 'The bleeding has stopped. But one of the clips is sitting on the common bile duct.', luck: 'You fired clips blindly into blood and this time they didn’t catch the duct.' },
          { p: function (S) { return v(S, 'hemo') >= 2 ? 1 : 0; }, to: 'crash' },
          { p: 1, to: 'bleed_ok' }
        ]
      },
      crash: {
        view: 'mentor:tense', say: 'Blood pressure eighty. The bleeding isn’t controlled. What now?', fx: { hemo: 1 }, refs: [3, 67],
        tip: { stu: 'Converting to open for uncontrolled bleeding is a safe decision, not a failure.', nurse: 'The open set gets opened, blood is ordered and someone calls the senior.', senior: 'This is where you take the wheel if you have to. And talk about it afterwards.' },
        opts: [
          { t: 'Pressure, tell anesthesia, order blood, call a senior and convert to open', g: 'g', to: 'bleed_ok', kw: ['pressure', 'open', 'blood', 'anesthesia'], refs: [3], fx: { flag: ['help', 'convert'], t: 25 }, reply: 'Yes. I’ll press, you open. No panic, one step at a time.' },
          { t: 'One more try laparoscopically', g: 'b', to: 'bleed_ok', kw: ['one more', 'try'], fx: { flag: 'convert', t: 30 }, why: 'Uncontrolled bleeding with falling blood pressure is a reason to convert to open and call for help.', reply: 'No. I’m taking this. We open now.' }
        ]
      },
      bleed_ok: {
        view: 'mentor:calm', kind: 'info', btn: 'Carry on', st: { bleed: 0 },
        say: 'Quiet now. The bleeding’s stopped. Breathe. Now we carry on, slowly.',
        fx: { set: { hemo: 0 } },
        to: 'back_r'
      },
      back_r: { when: [{ if: has('atbed'), to: 'bed_chk' }, { if: yes, to: 'bed' }] },

      /* ================= liver bed ================= */
      bed: {
        view: 'scene', say: 'We’re taking the gallbladder off the liver. In which plane?', st: { bed: .3, clips: true, cut: true, focus: null }, fx: { flag: 'atbed' }, dt: 10, refs: [66, 70],
        tip: { stu: 'Between the gallbladder and the liver there’s a loose layer above the cystic plate. That’s the plane.', nurse: 'Suction ready, a hemostatic agent within reach.', senior: 'Watch the color of the tissue. Loose and white is good, dark red liver is too deep.' },
        opts: [
          { t: 'In the loose tissue between the gallbladder and the cystic plate, low power and short movements', g: 'g', to: 'bed_r', kw: ['loose', 'plate', 'low'], reply: 'Good. That way the cystic plate stays intact and the liver doesn’t bleed.' },
          { t: 'Deep, under the cystic plate, to keep it clean', g: 'b', to: 'bed_r', kw: ['deep', 'under'], refs: [70], fx: { flag: 'deep' }, why: 'Under the cystic plate there’s liver bleeding, the middle hepatic vein and subvesical ducts.', reply: 'Too deep. Under the plate is liver, and in the liver there are veins and ducts.' },
          { t: 'Very close to the gallbladder, superficial', g: 'o', to: 'bed_r', kw: ['close', 'superficial'], refs: [66], fx: { flag: 'shallow' }, why: 'A plane that’s too superficial opens the gallbladder: bile and stones in the abdomen.', reply: 'Careful. Too superficial and we’re inside the gallbladder.' }
        ]
      },
      bed_r: {
        roll: [
          { p: function (S) { return S.f.deep ? .5 : 0; }, flag: 'bedbleed', to: 'c_bleed_bed', ev: 'Dark blood from deep in the bed.', luck: 'You worked under the cystic plate and it didn’t bleed. There are big veins there.' },
          { p: function (S) { return S.f.deep ? .3 : 0; }, flag: 'subves', to: 'bed_r2' },
          { p: 1, to: 'bed_r2' }
        ]
      },
      bed_r2: {
        roll: [
          { p: function (S) { return S.f.shallow ? .6 : S.st.inflam * .08 + (S.f.decomp ? 0 : S.f.tense ? .15 : 0); }, flag: 'perfev', to: 'c_perf', fx: { st: { bile: true, stones: true } }, ev: 'The gallbladder is open. Bile and stones on the liver.', luck: 'You worked very superficially and the gallbladder didn’t open. This time.' },
          { p: 1, to: 'bed_chk' }
        ]
      },
      c_bleed_bed: {
        view: 'scene', say: 'Bleeding from the bed. Dark, and from deep. What do we do?', st: { bleed: 1 }, dt: 8, refs: [70],
        tip: { stu: 'Heavy dark bleeding from deep in the bed raises the suspicion of the middle hepatic vein.', nurse: 'A hemostatic agent, a swab and suction.', senior: 'Sustained pressure, without peeking every ten seconds.' },
        opts: [
          { t: 'Sustained pressure, a hemostatic agent and the right power. If it’s a big vein, call for help', g: 'g', to: 'bed_ok', kw: ['pressure', 'hemostatic'], reply: 'Good. Something my own boss taught me: pressure, a clock, and no peeking every ten seconds.' },
          { t: 'Deep stitches, blind', g: 'b', to: 'bed_ok', kw: ['stitches', 'deep'], refs: [70], fx: { flag: 'subves' }, why: 'Deep stitches in the bed can injure the middle hepatic vein and subvesical ducts.', reply: 'Not blind. Pressure first, then we’ll see what’s there.' },
          { t: 'Burn hard and deep', g: 'b', to: 'bed_ok', kw: ['burn'], refs: [25], fx: { thermal: 10, flag: 'subves' }, why: 'Deep energy in the bed injures subvesical ducts and the liver.', reply: 'That’s a vein, not a spot. Pressure.' }
        ]
      },
      bed_ok: {
        view: 'mentor:calm', kind: 'info', btn: 'Carry on', st: { bleed: 0 },
        say: 'It’s stopped. Sustained pressure works wonders. We carry on in the right plane.',
        to: 'bed_chk'
      },
      c_perf: {
        view: 'scene', say: 'The gallbladder’s open. Bile and stones are out. What now?', st: { bile: true, stones: true }, fx: { spill: 1 }, dt: 6, refs: [66],
        tip: { stu: 'Stones left in the abdomen can cause an abscess even months later.', nurse: 'A bag for the stones, wide-bore suction and irrigation. And note it for the operation report.', senior: 'Check that the resident closes the hole before collecting.' },
        opts: [
          { t: 'Close the hole with a clip or an endoloop, suction, collect the stones into a bag and irrigate', g: 'g', to: 'perf_back', kw: ['close', 'collect', 'irrigate'], refs: [66], fx: { spill: -1, st: { stones: false, bile: false } }, reply: 'Right. First you turn off the tap, then you mop the floor.' },
          { t: 'Carry on, we’ll wash out at the end', g: 'b', to: 'perf_back', kw: ['carry on', 'end'], refs: [66], fx: { spill: 2 }, why: 'Retained stones can cause an abscess even months later. Close, collect and irrigate.', reply: 'By the end they’re all over the abdomen. All right, let’s carry on.' },
          { t: 'Lots of big stones that won’t come up: consider opening', g: 'o', to: 'perf_back', kw: ['open', 'big'], refs: [66], fx: { spill: -1, t: 20, st: { stones: false } }, reply: 'With a lot of big stones, that’s a fair consideration. Here we managed to collect them from inside.' }
        ]
      },
      perf_back: { when: [{ if: has('atext'), to: 'close' }, { if: has('atbed'), to: 'bed_chk' }, { if: function (S) { return S.st.adhesions && !S.f.adhdone; }, to: 'exp_adh' }, { if: yes, to: 'exp_main' }] },
      bed_chk: {
        view: 'scene', say: 'Before the last cut off the liver, what do we do?', st: { bed: .9, bleed: 0 }, dt: 2,
        tip: { stu: 'As long as the gallbladder is still attached, it holds the liver up and lets you see the bed.', nurse: 'Lower the pressure on the insufflator when asked.', senior: 'At low pressure, veins that were compressed start to bleed. That’s exactly what you want to see.' },
        opts: [
          { t: 'Lower the pressure and check the bed and the clips while the gallbladder is still holding the liver', g: 'g', to: 'bed_chk_r', kw: ['lower', 'check', 'pressure'], fx: { flag: 'inspected' }, reply: 'Yes. Now, while the gallbladder is still holding the liver, is when you see best.' },
          { t: 'Divide and take it out, we’ll check later', g: 'o', to: 'bed_chk_r', kw: ['divide', 'later'], why: 'Once the gallbladder is out, the liver drops onto the bed and it’s hard to see bleeding or a leak (convention).', reply: 'You can, but afterwards the liver drops and you can’t see a thing. Next time, check first.' }
        ]
      },
      bed_chk_r: { when: [{ if: function (S) { return S.f.inspected && S.f.bdiOccC; }, to: 'leak_in_c' }, { if: function (S) { return S.f.inspected && (S.f.subves || S.f.stumpweak); }, to: 'leak_in' }, { if: yes, to: 'gear_bag' }] },
      leak_in: {
        view: 'scene', say: 'See that? Bile in the bed. Not much, but it’s there. Where from?', st: { bile: true, bed: .9 }, dt: 6, refs: [70],
        tip: { stu: 'Subvesical ducts were found in about 4% of patients, most of them accessory ducts from the right lobe.', nurse: 'Small clips, a fine suture and a drain.', senior: 'Check that the resident looks at the stump as well, not just the bed.' },
        opts: [
          { t: 'Find the source: a small duct or the stump. A clip, a stitch or an endoloop, and leave a drain', g: 'g', to: 'gear_bag', kw: ['source', 'clip', 'drain'], refs: [70], fx: { flag: ['leakfixed', 'drain'], unflag: ['subves', 'stumpweak'], st: { bile: false } }, reply: 'Nice. We found it, closed it, and a drain to be safe.' },
          { t: 'Put a drain in and that’s it', g: 'o', to: 'gear_bag', kw: ['drain and that s it', 'just a drain'], fx: { flag: 'drain' }, why: 'A leak seen during the operation gets its source found and treated, not just drained.', reply: 'A drain will tell us if it carries on. But it’s better to close the source now.' },
          { t: 'Ignore it, it’ll settle', g: 'b', to: 'gear_bag', kw: ['ignore'], why: 'An untreated leak becomes a bile collection and a fever on day two.', reply: 'Bile doesn’t go away on its own. All right, we’ll see tomorrow.' }
        ]
      },
      leak_in_c: {
        view: 'scene', kind: 'info', btn: 'What do we do', st: { bile: true }, refs: [1],
        say: 'Wait. Bile from the right side of the triangle, next to the cystic duct. Something there has been divided. And it isn’t a small duct.',
        fx: { flag: ['bdi', 'bdiC'], unflag: 'bdiOccC' },
        to: 'c_bdi'
      },

      /* ================= extraction and closure ================= */
      gear_bag: {
        view: 'scene', kind: 'gear', fx: { flag: 'atext' }, st: { bed: 1 }, dt: 2, refs: [66],
        say: 'The gallbladder is free of the liver. How do we get it out?',
        pool: ['bag', 'grasp', 'stapler', 'clip', 'suct'], need: 'bag', alt: ['grasp'],
        ok: 'A retrieval bag. No surprises in the abdominal wall.',
        altReply: 'You can go without a bag if the gallbladder is intact and healthy. But with a bag there are no surprises.',
        bad: 'That’s not how a gallbladder comes out. A bag, or at least a grasper.',
        why: 'Extraction in a bag reduces spillage of bile and stones into the abdomen and the wall.',
        tip: { nurse: 'A bag of the right size, and stone forceps if needed.', senior: 'With an inflamed or perforated gallbladder, a bag isn’t optional.' },
        to: 'ext'
      },
      ext: {
        view: 'wall', say: 'The gallbladder is in the bag. And what if the stone is big and the gallbladder gets stuck in the port?', dt: 3, refs: [66],
        tip: { stu: 'Better to extend an incision by a few millimeters than to tear a gallbladder in the abdominal wall.', nurse: 'A number 11 blade and forceps for breaking stones.', senior: 'Watch whether the resident pulls by force. That’s the moment gallbladders tear.' },
        opts: [
          { t: 'Extend the incision and don’t pull by force', g: 'g', to: 'n_count', kw: ['extend', 'incision'], refs: [66], reply: 'Right. A few more millimeters of incision is nothing next to a gallbladder torn in the wall.' },
          { t: 'Break up the stones inside the bag and take them out in pieces', g: 'g', to: 'n_count', kw: ['break'], reply: 'That works too, as long as the bag stays intact.' },
          { t: 'Pull hard, it’ll come out', g: 'b', to: 'n_count', kw: ['pull', 'hard'], refs: [66], fx: { spill: 1, flag: 'woundspill' }, why: 'Pulling by force tears the bag or the gallbladder and leaves stones in the abdominal wall.', reply: 'It’s torn. Stones in the wall. Now we pick them out one by one.' }
        ]
      },
      n_count: {
        view: 'tray', kind: 'check', for: ['nurse'], skip: 'close', btn: 'Reported',
        say: 'Final count. What do you count and report?',
        items: [
          { t: 'Instruments, swabs and needles', need: true, miss: 'A full count. Instruments, swabs and needles.' },
          { t: 'The number of clips fired', need: true, miss: 'The clips. How many were fired, so it’s in the report.' },
          { t: 'Spilled stones or a source of leak, for the report', need: true, miss: 'And if stones were spilled, that goes in the report. Whoever sees an abscess in the future needs to know.' },
          { t: 'The bag stays inside until the end', no: true, miss: 'The bag comes out with the gallbladder. We don’t leave anything inside.' }
        ],
        ok: 'The count is correct. We can close.',
        to: 'close'
      },
      close: {
        view: 'wall', say: 'Nearly done. What do we check, and what do we close?', dt: 8, refs: [6, 71],
        tip: { stu: 'Trocars come out under direct vision, so you can see there’s no bleeding from the wall.', nurse: 'A suture for the fascia, and a drain only if asked for.', senior: 'A drain is a decision, not a habit. Ask why.' },
        opts: [
          { t: 'A last look at the bed and the clips, trocars out under vision, and close the fascia at the ten millimeter port', g: 'g', to: 'stu_po', kw: ['look', 'fascia', 'trocars'], reply: 'Good. That’s how you finish. No rushing.' },
          { t: 'A routine drain, to be safe', g: 'o', to: 'stu_po', kw: ['drain', 'routine'], refs: [71], when: function (S) { return !S.f.stcF && !S.f.drain; }, why: 'There’s no evidence that a routine drain helps in an uncomplicated cholecystectomy, and it lengthens the operation.', reply: 'A routine drain in a case like this doesn’t help. But we won’t fall out over it.' },
          { t: 'A drain, because there’s a reason: a subtotal or a leak', g: 'g', to: 'stu_po', kw: ['drain', 'subtotal', 'leak'], refs: [6], when: function (S) { return S.f.stcF || S.f.drain; }, reply: 'Right. Here a drain has a job to do.' },
          { t: 'Don’t close the fascia, just the skin', g: 'b', to: 'stu_po', kw: ['just the skin', 'don t close'], fx: { flag: 'nofascia' }, why: 'At ports of 10 mm and above it’s usual to close the fascia to prevent a hernia (convention).', reply: 'At a ten millimeter port we close the fascia. Otherwise I’ll see it in clinic as a hernia.' }
        ]
      },
      stu_po: {
        view: 'mentor:or', for: ['stu'], skip: 'po',
        say: 'A question for the student. What’s the most important rule after a cholecystectomy?',
        opts: [
          { t: 'Any patient who doesn’t feel better every day gets worked up', g: 'g', to: 'po', kw: ['every day', 'worked up'], reply: 'Exactly. A complication until proven otherwise.' },
          { t: 'Pain on day three is normal', g: 'b', to: 'po', kw: ['normal'], why: 'Pain that gets worse after a laparoscopic cholecystectomy is a sign of a complication until proven otherwise (convention).', reply: 'Pain that’s getting worse isn’t normal. It’s a sign.' },
          { t: 'Liver enzymes once a week', g: 'o', to: 'po', kw: ['enzymes'], reply: 'Not routinely. You check them when the patient isn’t progressing.' }
        ]
      },

      /* ================= post-op ================= */
      po: {
        when: [
          { if: function (S) { return S.f.bowelmissed || (S.f.bowelinj && !S.f.looked); }, to: 'po_bowel' },
          { if: has('bdiOccE'), to: 'po_jaund' },
          { if: has('bdiOccC'), to: 'po_leak' },
          { if: has('ccy'), to: 'po_ccy' },
          { if: function (S) { return S.f.cbdMissed || S.f.cbdret || (S.cs.id === 'cbd' && S.f.p_none && !S.f.ioc); }, to: 'po_cbd' }
        ],
        roll: [
          { p: function (S) { return S.f.duod ? .4 : 0; }, flag: 'duodev', to: 'po_bowel', luck: 'You used energy next to the duodenum and this time there was no delayed injury.' },
          { p: function (S) { return pct((S.f.stumpweak ? .5 : 0) + (S.f.subves && !S.f.leakfixed ? .45 : 0) + (S.f.stcF ? .18 : 0) + (S.f.nodrain ? .1 : 0)); }, flag: 'leakev', to: 'po_leak', luck: 'The stump or the bed was at risk of leaking and this time everything sealed.' },
          { p: function (S) { return pct(v(S, 'thermal') / 150); }, flag: 'thermev', to: 'po_thermal', luck: 'You used energy at a dangerous power or in a dangerous place and this time there was no delayed thermal injury.' },
          { p: 1, to: 'po_ok' }
        ]
      },
      po_ok: {
        say: 'The day after surgery. Mild pain, eating well, walking in the corridor and normal liver enzymes. What do we do?', view: 'mentor:ward',
        tip: { stu: 'Discharge with a clear explanation of when to come back: fever, jaundice or worsening pain.', nurse: 'Discharge teaching: wounds, showering, diet and warning signs.', senior: 'Ask what the resident tells the patient at discharge, in plain words.' },
        opts: [
          { t: 'Discharge, with an explanation of when to come back: fever, jaundice or worsening pain', g: 'g', to: 'late_r', kw: ['discharge', 'explain'], reply: 'Good. Home, and anyone who isn’t better every day comes back to us.' },
          { t: 'One more day for tests and a routine ultrasound', g: 'o', to: 'late_r', kw: ['one more day', 'ultrasound'], why: 'After an uncomplicated cholecystectomy with a normal course there’s no need for routine tests (convention).', reply: 'What for? Everything’s normal. A hospital bed isn’t a safer place to be.' },
          { t: 'Discharge without an explanation, it’s a simple operation', g: 'b', to: 'late_r', kw: ['without explanation'], why: 'A patient who doesn’t know when to come back comes back late.', reply: 'Simple for us. For the patient, it’s an operation. We explain when to come back.' }
        ]
      },
      late_r: {
        roll: [
          { p: function (S) { return v(S, 'spill') >= 2 || S.f.woundspill ? .4 : 0; }, flag: 'absc', to: 'po_abscess', luck: 'Stones were left in the abdomen and for now they haven’t caused any problems.' },
          { p: function (S) { return S.f.nofascia ? .2 : 0; }, flag: 'hern', to: 'po_hernia' },
          { p: 1, to: 'end' }
        ]
      },
      po_abscess: {
        view: 'img:ct', cap: 'CT: a right-sided abscess with a stone inside it', kind: 'info', btn: 'To the summary', refs: [66],
        say: 'Six months later. Pain, and an abscess on the right with a stone inside it, left over from the operation. Remember the stones we didn’t collect?',
        to: 'end'
      },
      po_hernia: {
        view: 'wall', kind: 'info', btn: 'To the summary',
        say: 'Three months later, in clinic. A bulge at the umbilicus, at the port where we didn’t close the fascia. A small hernia.',
        to: 'end'
      },
      po_leak: {
        say: 'Day two. Fever, pain under the right ribs and a collection on ultrasound. What are you thinking?', view: 'img:us', cap: 'Ultrasound: a collection under the liver, in the gallbladder bed', refs: [72],
        tip: { stu: 'Leaks after cholecystectomy have been reported in 0.3 to 2.7 percent.', nurse: 'Hourly observations, and if there’s a drain, record the color and volume.', senior: 'Check that the resident considers an injury to the main duct too, not just the stump.' },
        opts: [
          { t: 'A bile leak, from the stump or from a duct in the bed. Imaging and drainage', g: 'g', to: 'leak_tx', kw: ['leak', 'bile', 'stump'], refs: [72], reply: 'Yes. Now the question is how we treat it.' },
          { t: 'An ordinary hematoma, let’s wait', g: 'b', to: 'leak_tx', kw: ['hematoma', 'wait'], refs: [72], why: 'Fever, pain and a collection on day two after a cholecystectomy are a leak until proven otherwise.', reply: 'With a fever? I’m thinking bile. Let’s check.' }
        ]
      },
      po_thermal: {
        say: 'A week later, back in the emergency department. Fever and pain, and the scan shows a bile collection. In the operation everything looked fine. What happened?', view: 'mentor:ward', refs: [25, 26],
        tip: { stu: 'A thermal injury shows up days after the operation, when the burned tissue dies.', senior: 'The point to teach: what you didn’t see in the operation doesn’t mean it didn’t happen.' },
        opts: [
          { t: 'A delayed thermal injury, from energy next to the duct or the clip', g: 'g', to: 'leak_tx', kw: ['thermal', 'energy', 'heat'], refs: [25, 26], reply: 'Yes. The heat did its work slowly. Now we treat it.' },
          { t: 'An ordinary wound infection', g: 'b', to: 'leak_tx', kw: ['infection', 'wound'], refs: [26], why: 'A bile collection a week after surgery is a leak, usually a delayed thermal injury or a clip that slipped.', reply: 'A bile collection isn’t a wound. It’s what the hook left behind.' }
        ]
      },
      leak_tx: {
        view: 'mentor:ward', say: 'So how do we treat it?', refs: [60, 62, 72],
        tip: { stu: 'ERCP lowers the pressure in the duct and the leak closes on its own.', nurse: 'Preparing for ERCP: fasting, consent and clotting.', senior: 'The resident should think about a main duct injury before calling it a simple leak.' },
        opts: [
          { t: 'Drain the collection, and ERCP with a sphincterotomy and a stent', g: 'g', to: 'leak_r', kw: ['ercp', 'stent', 'drain'], refs: [72, 60], reply: 'Exactly. For most simple leaks that’s all you need.' },
          { t: 'MRCP first, to make sure it isn’t a main duct injury', g: 'g', to: 'leak_r', kw: ['mrcp', 'injury'], refs: [62], reply: 'Good thinking. First you know what’s there, then you treat it.' },
          { t: 'Straight back to the OR for a washout', g: 'o', to: 'leak_r', kw: ['back to the or', 'washout', 'reoperate'], refs: [72], why: 'A reoperation is kept for generalized peritonitis or an unstable patient.', reply: 'If unstable or peritonitic, yes. Here the patient is stable, so we start with something less invasive.' },
          { t: 'Antibiotics and wait', g: 'b', to: 'leak_r', kw: ['antibiotics', 'wait'], refs: [72], why: 'A bile collection doesn’t disappear with antibiotics. It needs drainage and ERCP.', reply: 'Antibiotics don’t drain bile. Drainage and ERCP.' }
        ]
      },
      leak_r: { when: [{ if: has('bdiOccC'), to: 'leak_c' }, { if: yes, to: 'leak_ok' }] },
      leak_ok: {
        view: 'mentor:ward', kind: 'info', btn: 'To the summary', refs: [1, 72],
        say: 'At ERCP: a leak from the cystic duct stump, Strasberg A. A stent, and two days later the drain is dry. We came out of that well.',
        to: 'end'
      },
      leak_c: {
        view: 'mentor:ward', kind: 'info', btn: 'Which type', refs: [1, 62],
        say: 'At ERCP the stump is closed. The bile is coming from an aberrant right duct that was divided, and it doesn’t show on the cholangiogram. This isn’t an A.',
        to: 'stras_c'
      },
      po_jaund: {
        say: 'Day three. Worsening jaundice and hardly any pain. What do you suspect?', view: 'mentor:ward', refs: [62],
        tip: { stu: 'Jaundice after a cholecystectomy is a duct injury until proven otherwise.', nurse: 'Blood tests, and record the color of the urine and stool.', senior: 'An injury found after the operation is managed in an experienced center. Ask who the resident calls.' },
        opts: [
          { t: 'A main duct closed with a clip. MRCP and referral to an HPB center', g: 'g', to: 'stras_e', kw: ['duct', 'mrcp', 'hpb'], refs: [62], reply: 'Yes. And this is the hardest moment in surgery. We talk to the family, honestly.' },
          { t: 'ERCP and see what’s there', g: 'o', to: 'stras_e', kw: ['ercp'], refs: [62], why: 'With a suspected complete injury you start with imaging, CT or MRCP, and a referral to an HPB center, not a blind ERCP.', reply: 'MRCP first. With a complete injury the ERCP won’t get through, and it only causes delay.' },
          { t: 'Hepatitis, let’s wait for the results', g: 'b', to: 'stras_e', kw: ['hepatitis', 'wait'], refs: [62], why: 'Worsening jaundice after a cholecystectomy is a closed duct until proven otherwise.', reply: 'No. Jaundice after a cholecystectomy is an injury until proven otherwise.' }
        ]
      },
      po_bowel: {
        say: 'The day after. Heart rate one eighteen, a distended abdomen and more pain than an operation like this should give. What are you thinking?', view: 'mentor:ward', refs: [73],
        tip: { stu: 'Tachycardia and disproportionate pain on day one are a bowel injury until proven otherwise.', nurse: 'Close observations and call a doctor at once.', senior: 'The resident needs to move quickly from “ordinary pain” to a CT.' },
        opts: [
          { t: 'A missed bowel injury. CT, and usually back to the OR', g: 'g', to: 'bowel_po', kw: ['bowel', 'ct', 'or'], refs: [73], reply: 'Yes. And don’t wait until morning.' },
          { t: 'Ordinary postoperative pain, analgesia', g: 'b', to: 'bowel_po', kw: ['ordinary', 'analgesia', 'painkillers'], refs: [73], why: 'Tachycardia, a distended abdomen and disproportionate pain after laparoscopy are a bowel injury until proven otherwise.', reply: 'A heart rate of one eighteen isn’t ordinary pain. I’m ordering a CT.' },
          { t: 'Antibiotics only', g: 'b', to: 'bowel_po', kw: ['antibiotics'], refs: [73], why: 'A hole in the bowel gets repaired. Antibiotics alone only cause delay.', reply: 'Antibiotics don’t close a hole.' }
        ]
      },
      bowel_po: {
        view: 'img:ct', cap: 'CT: free air and fluid in the abdomen', kind: 'info', btn: 'To the summary', refs: [73],
        say: 'On CT, free air and fluid. In the OR: a small hole in the bowel. Suture and washout. It’ll be all right in the end, but it could have gone very differently.',
        to: 'end'
      },
      po_cbd: {
        say: 'Day two. Pain, mild jaundice and rising liver tests. What happened?', view: 'mentor:ward', refs: [60, 61],
        tip: { stu: 'Common bile duct stones are found in 10 to 20 percent of people with symptomatic gallstones.', senior: 'The lesson is the link between what we didn’t check in the operation and what’s happening now.' },
        opts: [
          { t: 'A stone left in the duct. ERCP', g: 'g', to: 'cbd_po', kw: ['stone', 'ercp'], refs: [60, 61], fx: { flag: 'cbdret' }, reply: 'Right. ERCP today.' },
          { t: 'A leak from the stump', g: 'o', to: 'cbd_po', kw: ['leak'], fx: { flag: 'cbdret' }, why: 'Jaundice and rising liver tests without a collection fit a duct stone better.', reply: 'There’s no collection. This fits a stone better.' },
          { t: 'Let’s wait for it to pass', g: 'b', to: 'cbd_po', kw: ['wait'], refs: [61], fx: { flag: 'cbdret' }, why: 'A duct stone with jaundice can lead to cholangitis or pancreatitis.', reply: 'And wait for cholangitis? No.' }
        ]
      },
      cbd_po: {
        view: 'mentor:ward', kind: 'info', btn: 'To the summary', refs: [59, 60],
        say: 'At ERCP they took out a six millimeter stone. That’s exactly what a cholangiogram at surgery would have saved.',
        to: 'end'
      },
      po_ccy: {
        kind: 'info', btn: 'To the summary', refs: [55], view: 'mentor:ward',
        say: 'The drain in the gallbladder did the job. In a few weeks, once the inflammation settles, we’ll think about an interval cholecystectomy.',
        to: 'end'
      },

      /* ================= bile duct injury ================= */
      c_bdi: {
        view: 'mentor:tense', say: 'Wait. Stop. Hands up. We don’t cut or close anything else. We have a bile duct injury.', refs: [1, 21, 62],
        tip: { stu: 'Most injuries are errors of identification, not technical errors.', nurse: 'Calm, order and no rushing. A phone call to HPB.', senior: 'The most important moment to teach: what you do in the hour that follows.' },
        opts: [
          { t: 'Stop, call the most senior surgeon available and find out whether HPB is around', g: 'g', to: 'n_bdi', kw: ['stop', 'call', 'hpb'], refs: [62], fx: { flag: 'help' }, reply: 'Right. Breathe. We don’t fix this now on our own.' },
          { t: 'Repair it now, a stitch on the duct', g: 'b', to: 'n_bdi', kw: ['repair', 'stitch'], refs: [62], why: 'A repair by someone without HPB experience worsens the outcome. Stop and transfer.', reply: 'No. A poor first repair ruins the chances of the next one.' },
          { t: 'Another clip to stop the bile', g: 'b', to: 'n_bdi', kw: ['clip', 'stop the bile'], refs: [62, 67], why: 'Extra clips raise the level of the injury and can injure the right hepatic artery.', reply: 'Another clip is another injury. Hands up.' }
        ]
      },
      n_bdi: {
        view: 'tray', kind: 'check', for: ['nurse'], skip: 'bdi2', btn: 'Ready',
        say: 'What are you getting ready now?', refs: [62],
        items: [
          { t: 'A drain', need: true, miss: 'A drain. We almost always leave one next to the injury.' },
          { t: 'A phone call to the HPB surgeon', need: true, miss: 'HPB. Someone calls now.' },
          { t: 'A cholangiogram, if they want to define the injury', need: true, miss: 'A cholangiogram. Sometimes they want to define the injury before the transfer.' },
          { t: 'Hurry to close', no: true, miss: 'We don’t hurry. Calm and order.' }
        ],
        ok: 'Good. That’s how a room behaves in a hard moment.',
        to: 'bdi2'
      },
      bdi2: {
        view: 'mentor:tense', say: 'The HPB surgeon is at another hospital. There’s nobody here who can repair it. What do we do?', refs: [62, 67],
        tip: { stu: 'In the Swedish registry, recognizing the injury during the operation was linked with better survival.', senior: 'Check that the resident understands transfer isn’t failure, it’s the treatment.' },
        opts: [
          { t: 'A drain next to the injury, close and transfer to an experienced center', g: 'g', to: 'stras', kw: ['drain', 'transfer', 'center'], refs: [62], fx: { flag: 'transfer' }, reply: 'Right. A drain, an accurate operation note and a conversation with the center. They’ll decide on the timing.' },
          { t: 'Try to repair it ourselves', g: 'b', to: 'stras', kw: ['repair', 'ourselves'], refs: [62], why: 'Without HPB experience you don’t repair. A drain and transfer to an experienced center.', reply: 'No. I’m not touching it and neither are you. A drain, and we transfer.' },
          { t: 'Arterial imaging before the repair', g: 'o', to: 'stras', kw: ['arterial', 'imaging'], refs: [67], reply: 'Important, and the center that repairs it will do that. For now, a drain and transfer.' }
        ]
      },
      stras: { when: [{ if: has('bdiB'), to: 'stras_b' }, { if: has('bdiC'), to: 'stras_c' }, { if: has('bdiD'), to: 'stras_d' }, { if: yes, to: 'stras_e' }] },
      stras_b: {
        view: 'mentor:debrief', say: 'A question to wrap up. On the Strasberg classification, what type of injury is this?', refs: [1],
        opts: [
          { t: 'A: a leak from the cystic duct stump or a small duct in the bed', g: 'b', to: 'end', why: 'Type A is a leak from the cystic duct stump or a small duct in the bed. Here an aberrant right duct was closed.' },
          { t: 'B: an aberrant right duct that was closed', g: 'g', to: 'end', reply: 'Right. B. Sometimes it only shows up years later, when part of the liver atrophies.' },
          { t: 'C: an aberrant right duct divided without closure', g: 'o', to: 'end', why: 'C is division without closure, and it leaks. Here the duct was closed with a clip.' },
          { t: 'E: a complete injury to the main duct', g: 'b', to: 'end', why: 'E is a complete injury to the main duct. Here an aberrant right duct was injured.' }
        ]
      },
      stras_c: {
        view: 'mentor:debrief', say: 'A question to wrap up. On the Strasberg classification, what type of injury is this?', refs: [1],
        opts: [
          { t: 'A: a leak from the cystic duct stump or a small duct in the bed', g: 'o', to: 'end', why: 'In type A the leak is from the cystic duct stump or a small duct. Here an aberrant right duct was divided.' },
          { t: 'B: an aberrant right duct that was closed', g: 'o', to: 'end', why: 'B is an aberrant duct that was closed. Here it was divided and it leaks.' },
          { t: 'C: an aberrant right duct divided without closure', g: 'g', to: 'end', reply: 'Right. C. It leaks bile, and you don’t see it at ERCP because it’s cut off from the tree.' },
          { t: 'D: a lateral injury to the main duct', g: 'b', to: 'end', why: 'D is a lateral injury to the main duct. Here the main duct is intact.' }
        ]
      },
      stras_d: {
        view: 'mentor:debrief', say: 'A question to wrap up. On the Strasberg classification, what type of injury is this?', refs: [1],
        opts: [
          { t: 'A: a leak from the cystic duct stump', g: 'b', to: 'end', why: 'Here it’s the wall of the main duct that was injured, not the stump.' },
          { t: 'D: a lateral injury to the main duct', g: 'g', to: 'end', reply: 'Right. D. The duct is in continuity, but with a hole in the wall. The repair depends on the size.' },
          { t: 'E: a complete injury to the main duct', g: 'o', to: 'end', why: 'In E the duct is completely divided. Here it’s still in continuity.' }
        ]
      },
      stras_e: {
        view: 'mentor:debrief', say: 'A question to wrap up. On the Strasberg classification, what type of injury is this?', refs: [1],
        opts: [
          { t: 'A: a leak from the cystic duct stump', g: 'b', to: 'end', why: 'Here the main duct was closed or divided, not just the stump.' },
          { t: 'D: a lateral injury to the main duct', g: 'o', to: 'end', why: 'In D the duct is in continuity. Here the main duct was completely closed or divided.' },
          { t: 'E: a complete injury to the main duct', g: 'g', to: 'end', reply: 'Right. E, and the level decides the number after the E. That’s what the center will look at.' }
        ]
      },

      end: { end: true }
    }
  });
})();
