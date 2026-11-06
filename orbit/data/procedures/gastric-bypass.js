/* ORBIT · Gastric bypass: Roux-en-Y (RYGB) and one-anastomosis (OAGB), laparoscopic and robotic.
   RYGB facts checked against CST14 (Management of Morbid Obesity, pp. 123–128) and Sabiston 22 ch. 99.
   OAGB is not detailed in CST14 or Sabiston 22; its section follows the IFSO position statement (named only). Text is original. */
(function () {
  var O = window.ORBIT;
  function tube(d, w) {
    return '<path d="' + d + '" style="fill:none;stroke:var(--a-stroke);stroke-width:' + (w + 2.5) + ';stroke-linecap:round;stroke-linejoin:round"/>' +
      '<path d="' + d + '" style="fill:none;stroke:var(--a-bowel);stroke-width:' + w + ';stroke-linecap:round;stroke-linejoin:round"/>';
  }
  function tubeK(k, d, w) { return '<g data-k="' + k + '">' + tube(d, w) + '</g>'; }

  /* ---------- anatomy base 1: RYGB configuration (anterior view) ---------- */
  O.base('rygb-config', 'Roux-en-Y bypass configuration', function () {
    return '' +
      '<path data-k="eso" class="a-stomach" d="M190 0 L210 0 L208 30 L192 30 Z"/>' +
      '<path data-k="remnant" class="a-stomach" d="M236 30 C266 16 324 26 352 66 C374 104 366 156 324 174 C296 186 264 180 248 168 L236 154 C250 130 252 98 244 66 Z" opacity=".75"/>' +
      tubeK('duod', 'M244 166 C214 172 198 196 206 220 C214 242 246 244 262 228', 12) +
      '<circle data-k="treitz" cx="264" cy="226" r="6" fill="var(--a-stroke)"/>' +
      '<path data-k="colon" class="a-colon" d="M20 186 C120 176 280 176 390 186 L390 210 C280 202 120 202 20 210 Z" opacity=".55"/>' +
      '<path data-k="pet" d="M120 178 L178 96 L196 178 Z" fill="rgba(194,59,43,.12)" stroke="rgba(194,59,43,.6)" stroke-dasharray="4 4"/>' +
      '<path data-k="jjdef" d="M150 268 L184 238 L196 278 Z" fill="rgba(194,59,43,.12)" stroke="rgba(194,59,43,.6)" stroke-dasharray="4 4"/>' +
      tubeK('bp', 'M264 228 C250 266 210 284 158 272', 12) +
      tubeK('roux', 'M140 268 C80 246 74 160 116 112 C142 84 172 72 196 64', 13) +
      tubeK('cc', 'M146 274 C120 292 74 294 24 288', 13) +
      '<ellipse data-k="pouch" class="a-stomach" cx="202" cy="46" rx="22" ry="18"/>' +
      '<circle data-k="gj" cx="198" cy="64" r="7" fill="none" stroke="#3E6FC2" stroke-width="2.4"/>' +
      '<circle data-k="jj" cx="146" cy="270" r="9" fill="none" stroke="#3E6FC2" stroke-width="2.6"/>' +
      '<path data-k="sl" d="M224 30 C232 44 232 58 222 70" style="fill:none;stroke:#2B3A48;stroke-width:4;opacity:.8"/>' +
      '<text class="lbl" x="150" y="40" text-anchor="end">Pouch 15–30 mL</text>' +
      '<text class="lbl s" x="160" y="76" text-anchor="end">GJ</text>' +
      '<text class="lbl" x="304" y="110" text-anchor="middle">Remnant</text>' +
      '<text class="lbl" x="58" y="140" text-anchor="middle">Roux</text>' +
      '<text class="lbl s" x="58" y="153" text-anchor="middle">100–150 cm</text>' +
      '<text class="lbl s" x="262" y="270">BP limb</text>' +
      '<text class="lbl s" x="276" y="226">Treitz</text>' +
      '<text class="lbl s" x="128" y="252" text-anchor="end">JJ</text>' +
      '<text class="lbl s" x="14" y="272">Common channel</text>' +
      '<text class="lbl s" x="360" y="200" text-anchor="end">Transverse colon</text>' +
      '<text class="lbl s" x="160" y="168" text-anchor="middle">Petersen</text>' +
      '<text class="lbl s" x="214" y="296" text-anchor="middle">JJ defect</text>' +
      '<text class="lbl s" x="222" y="196">Duodenum</text>';
  });

  /* ---------- anatomy base 2: OAGB configuration ---------- */
  O.base('oagb-config', 'One-anastomosis bypass (OAGB) configuration', function () {
    return '' +
      '<path data-k="eso" class="a-stomach" d="M190 0 L210 0 L208 30 L192 30 Z"/>' +
      '<path data-k="remnant" class="a-stomach" d="M232 34 C266 16 324 26 352 66 C374 104 366 156 324 174 C292 186 252 180 228 168 L214 154 C226 130 230 90 226 60 Z" opacity=".75"/>' +
      tubeK('duod', 'M222 166 C200 176 194 200 204 220 C214 240 246 244 262 228', 12) +
      '<circle data-k="treitz" cx="264" cy="226" r="6" fill="var(--a-stroke)"/>' +
      '<path data-k="pouch" class="a-stomach" d="M190 26 C200 22 212 22 218 30 C214 70 210 110 206 150 C204 160 196 166 188 162 C184 120 186 70 190 26 Z"/>' +
      '<path data-k="sl" d="M218 30 C214 70 210 110 206 150" style="fill:none;stroke:#2B3A48;stroke-width:4;opacity:.8"/>' +
      '<path data-k="crow" class="a-dash" d="M206 152 L236 156"/>' +
      '<path data-k="colon" class="a-colon" d="M20 196 C120 186 280 186 390 196 L390 218 C280 210 120 210 20 218 Z" opacity=".55"/>' +
      tubeK('bp', 'M264 228 C262 262 236 276 214 252 C196 230 194 200 196 172', 12) +
      tubeK('eff', 'M190 172 C170 220 140 262 100 276 C70 286 44 286 20 282', 13) +
      '<circle data-k="gj" cx="194" cy="166" r="8" fill="none" stroke="#3E6FC2" stroke-width="2.6"/>' +
      '<text class="lbl" x="178" y="96" text-anchor="end">Long pouch</text>' +
      '<text class="lbl s" x="178" y="110" text-anchor="end">~15 cm</text>' +
      '<text class="lbl" x="304" y="110" text-anchor="middle">Remnant</text>' +
      '<text class="lbl s" x="182" y="182" text-anchor="end">GJ (loop)</text>' +
      '<text class="lbl s" x="240" y="236" text-anchor="end">BP limb</text>' +
      '<text class="lbl s" x="226" y="290">150–200 cm</text>' +
      '<text class="lbl s" x="276" y="226">Treitz</text>' +
      '<text class="lbl s" x="40" y="270">Efferent / common</text>' +
      '<text class="lbl s" x="242" y="150">Crow&#39;s foot</text>' +
      '<text class="lbl s" x="360" y="208" text-anchor="end">Transverse colon</text>';
  });

  /* ---------- cover ---------- */
  O.cover('gastric-bypass', function () {
    return '<ellipse class="f-t2" cx="150" cy="44" rx="24" ry="18"/>' +
      '<path class="f-w2" d="M190 30 C224 14 280 26 296 66 C310 104 290 140 252 146 C226 150 204 140 196 128 C208 104 208 66 190 30 Z" opacity=".5"/>' +
      '<path class="s-g" d="M146 62 C104 84 90 140 120 176" stroke-width="10"/>' +
      '<path class="s-w" d="M210 150 C206 176 170 184 128 180" stroke-width="7"/>' +
      '<path class="s-g" d="M120 178 C96 190 60 192 30 188" stroke-width="10"/>' +
      '<circle cx="124" cy="178" r="7" class="c-w"/>' +
      '<text x="190" y="186" class="c-w" style="font:700 14px Inter,sans-serif;letter-spacing:.06em">Roux-en-Y</text>';
  });

  O.register({
    id: 'gastric-bypass',
    title: 'Gastric bypass',
    title_en: 'Gastric bypass (RYGB · OAGB, laparoscopic · robotic)',
    system: 'bariatric', organ: 'Stomach and small bowel', difficulty: 4, setting: 'Elective',
    tags: ['bypass', 'gastric bypass', 'RYGB', 'OAGB', 'MGB', 'mini gastric bypass', 'Roux-en-Y', 'bariatric', 'obesity', 'Petersen', 'internal hernia', 'marginal ulcer', 'ulcer'],
    student: {
      summary: 'A small gastric pouch is created and joined to a loop of small bowel, so food bypasses most of the stomach, the duodenum and the proximal jejunum. A Roux-en-Y bypass has two anastomoses. A one-anastomosis bypass (OAGB) has only one.',
      points: ['A small pouch (15–30 mL) means fewer marginal ulcers.', 'In Roux-en-Y: a short biliopancreatic limb and a Roux limb of 100–150 cm.', 'Close both mesenteric defects: at the JJ and Petersen’s space.', 'Colicky abdominal pain years after a bypass: think internal hernia.', 'Lifelong supplements and follow-up.']
    },
    overview: {
      facts: [{ v: '15–30 mL', l: 'Gastric pouch volume in RYGB' }, { v: '100–150 cm', l: 'Roux limb length by BMI (Sabiston)' }, { v: '<1%', l: 'Anastomotic leak in recent laparoscopic series' }, { v: '2–14%', l: 'Marginal ulcer' }],
      indications: ['BMI of 35 or more, or 30–35 with metabolic disease, after failed non-operative treatment (ASMBS/IFSO 2022).', 'Type 2 diabetes: bypass gives a strong metabolic improvement.', 'Severe reflux or Barrett’s esophagus in a patient with obesity.', 'Conversion from a sleeve for reflux or inadequate weight loss.'],
      contraindications: ['Uncontrolled psychiatric illness or active addiction.', 'Unable to commit to lifelong follow-up and supplements.', 'Need for regular NSAIDs (ulcer risk).', 'Active smoking: must stop before surgery.', 'Relative: inflammatory bowel disease, dense adhesions.'],
      choice: ['Laparoscopy is the default approach for bypass.', 'Roux-en-Y bypass: especially suited to reflux, Barrett’s and diabetes.', 'One-anastomosis bypass (OAGB): one anastomosis, shorter operation. Concern about bile reflux and nutritional deficiency with a long limb. Common in Israel.', 'Robotic: by availability and experience. Convenient for a hand-sewn anastomosis and for revisions.']
    },
    anatomy: {
      figures: [
        { base: 'rygb-config', hotspots: [
          { x: 176, y: 22, label: 'Gastric pouch', text: 'A small pouch along the lesser curvature, fully divided from the stomach. A larger pouch has more acid-secreting cells and more marginal ulcers.' },
          { x: 222, y: 84, label: 'Gastrojejunostomy (GJ)', text: 'The Roux limb is joined to the pouch with a linear stapler, a circular stapler or hand-sewn. No clear difference in outcomes between techniques.' },
          { x: 92, y: 210, label: 'Roux limb (food)', text: 'Brought up in front of the transverse colon (antecolic). About 100 cm, up to 150 cm at very high BMI.' },
          { x: 222, y: 260, label: 'Biliopancreatic limb', text: 'Carries bile and pancreatic juice from the duodenum. Starts at the ligament of Treitz and is divided about 40–75 cm from it.' },
          { x: 174, y: 258, label: 'JJ mesenteric defect', text: 'Close with non-absorbable suture. A defect left open is a site for internal hernia.' },
          { x: 160, y: 140, label: 'Petersen’s space', text: 'Between the Roux limb mesentery and the transverse mesocolon. Closing both defects cuts internal hernia by about 70%.' },
          { x: 96, y: 290, label: 'Common channel', text: 'Where food meets bile. Long enough to keep normal absorption.' }
        ] },
        { base: 'oagb-config', hotspots: [
          { x: 168, y: 60, label: 'Long narrow pouch', text: 'Starts near the incisura (crow’s foot) and runs up along a bougie to the angle of His. A length of about 15 cm keeps the anastomosis away from the esophagus.' },
          { x: 170, y: 156, label: 'Single loop anastomosis', text: 'A bowel loop is brought up antecolic and joined to the end of the pouch. No second anastomosis and no classic Petersen’s space.' },
          { x: 252, y: 266, label: 'Biliopancreatic limb', text: 'Usually 150–200 cm from Treitz. Too long a limb increases nutritional deficiency. Some surgeons measure the whole bowel and tailor it.' },
          { x: 120, y: 262, label: 'Bile reflux', text: 'Bile can reflux into the pouch. With severe reflux or Barrett’s, Roux-en-Y is preferred.' }
        ] }
      ],
      landmarks: [
        { name: 'Ligament of Treitz', why: 'The starting point for every bowel measurement.' },
        { name: 'Lesser curvature and its vessels', why: 'The pouch is made through a window close to the wall, preserving its blood supply.' },
        { name: 'Angle of His and left crus', why: 'The last firing of the pouch. The whole fundus must stay with the remnant.' },
        { name: 'Transverse colon and omentum', why: 'The Roux limb goes up in front of them. A thick omentum is sometimes split to reduce tension.' },
        { name: 'Petersen’s space and the JJ defect', why: 'The two internal hernia sites. Close both.' }
      ]
    },
    preop: {
      workup: ['Multidisciplinary assessment: surgeon, dietitian, psychologist and internist or endocrinologist.', 'Bloods: CBC, chemistry, liver function, HbA1c, iron, B12, folate and vitamin D.', 'Screen for obstructive sleep apnea (OSA) and set up CPAP.', 'Upper endoscopy before surgery per protocol, because after bypass the remnant is hard to reach.', 'Test for and treat Helicobacter.', 'Low-calorie diet before surgery to shrink the liver.'],
      consent: ['Anastomotic leak.', 'Bleeding, anastomotic stricture and marginal ulcer.', 'Internal hernia and bowel obstruction, even years later.', 'Nutritional deficiency and lifelong supplements.', 'Dumping syndrome and late hypoglycemia.', 'For OAGB: bile reflux and possible conversion to Roux-en-Y.', 'Deep vein thrombosis and pulmonary embolism.'],
      antibiotics: ['Weight-based cefazolin: 2 g (3 g above 120 kg) within 60 minutes before incision.', 'Redose if the case lasts more than 4 hours.'],
      vte: ['Pneumatic compression boots from arrival in the OR.', 'Low molecular weight heparin, weight-adjusted, per institutional protocol.', 'Early mobilization the same day.', 'High risk: consider extended prophylaxis after discharge.'],
      bowelPrep: ['Not needed. Fasting per ERAS.'],
      special: ['Stop smoking at least 6 weeks before surgery (marginal ulcer risk).', 'Stop NSAIDs.', 'Table and supports rated for the patient’s weight.', 'Anesthesia: difficult airway and ramped position.', 'Remove the orogastric tube and temperature probe before every gastric firing.']
    },
    approaches: [
      {
        key: 'rygb', kind: 'lap', label: 'RYGB',
        setup: {
          position: { kind: 'split', tilt: 20, pressure: ['occiput', 'elbow', 'sacrum', 'heel', 'calf'] },
          room: { arms: { R: 'out', L: 'out' }, legs: 'split', staff: [{ w: 'S', s: 'legs' }, { w: 'A', s: 'Lt2' }, { w: 'C', s: 'Rt2' }, { w: 'N', s: 'RtFoot' }], monitors: ['RtHead', 'LtHead', 'LtFar3'] },
          notes: ['French position: legs apart, surgeon between the legs for the gastric part.', 'Small bowel part: table flat or slightly head down. The surgeon moves to the patient’s right.', 'Reverse Trendelenburg of 20–30° for the pouch and the gastrojejunostomy.', 'Footboard and wide strapping.', 'Do a full tilt test before prepping.'],
          arms: ['Both arms out to 90°, padded.'],
          team: ['Gastric part: surgeon between the legs, assistant on the left, camera on the right.', 'Bowel part: surgeon and camera on the right, a third monitor by the legs on the left.', 'All cartridges and sutures ready in advance.'],
          pressureExtra: ['Extra padding in skin folds and the lower back.']
        },
        access: {
          target: { x: 196, y: 112, rx: 38, ry: 28, label: 'Stomach' },
          ports: [
            { x: 166, y: 150, mm: 12, role: 'camera', label: 'About 15 cm below the xiphoid, slightly left of midline. Camera', n: 1 },
            { x: 150, y: 72, mm: 5, role: 'assist', label: 'Subxiphoid. Liver retractor', n: 2 },
            { x: 104, y: 140, mm: 12, role: 'work', label: 'Right upper. Right hand and stapler', n: 3 },
            { x: 216, y: 130, mm: 12, role: 'stapler', label: 'Left upper. Left hand and stapler', n: 4 },
            { x: 246, y: 178, mm: 5, role: 'assist', label: 'Left lateral. Assistant', n: 5 },
            { x: 206, y: 210, mm: 12, role: 'stapler', label: 'Left lower. Stapler for the JJ (as needed)', n: 6 }
          ],
          notes: ['Pneumoperitoneum 15 mmHg.', 'Optical port entry in the left upper quadrant.', 'Long trocars for a thick wall.'],
          caption: 'Anterior view. The patient’s right is on the left of the figure.'
        },
        steps: [
          { t: 'Entry and survey', d: 'Optical port entry, pneumoperitoneum, ports in an arc facing the stomach, and the liver retractor.', tip: 'Check early whether the transverse colon and omentum will allow an antecolic limb.', danger: 'Blind entry through a thick wall.', nurse: 'Optical port, 30° scope, long trocars, Nathanson retractor.', fig: { view: 'access' } },
          { t: 'Find Treitz and divide the jejunum', d: 'Lift the transverse colon, identify the ligament of Treitz and count 40–75 cm. Divide the bowel and its mesentery.', tip: 'Mark the Roux end with a stitch or dye so the orientation is never in doubt.', danger: 'Mixing up the ends creates a reversed bypass (Roux-en-O).', nurse: '60 mm stapler with a bowel cartridge, energy device, graspers for measuring bowel.', fig: { base: 'rygb-config', hl: ['treitz', 'bp', 'duod'], marks: [{ t: 'cut', x1: 168, y1: 262, x2: 172, y2: 286 }, { t: 'label', x: 300, y: 252, text: '40–75 cm', tone: 'info' }] } },
          { t: 'Jejunojejunostomy', d: 'Measure 100–150 cm of Roux limb and make a side-to-side linear stapled anastomosis between the biliopancreatic and Roux limbs. Close the common enterotomy.', tip: 'Measure between two marked graspers. A longer limb when BMI is above 50.', danger: 'Narrowing when closing the enterotomy: close it transversely.', nurse: '60 mm stapler, bowel cartridges, running absorbable suture or another cartridge for closure.', fig: { base: 'rygb-config', hl: ['jj', 'bp', 'roux', 'cc'], marks: [{ t: 'staple', pts: ['132 262', '160 276'] }, { t: 'label', x: 52, y: 214, text: '100–150 cm', tone: 'info' }] } },
          { t: 'Close the JJ mesenteric defect', d: 'Close the mesenteric defect next to the JJ with a running non-absorbable suture.', tip: 'Close it fully to the base, without taking large vessels.', danger: 'A defect left open: internal hernia and obstruction with ischemia.', nurse: 'Non-absorbable suture (2-0 polypropylene) or barbed suture.', fig: { base: 'rygb-config', hl: ['jjdef', 'jj'], marks: [{ t: 'stitch', x1: 156, y1: 266, x2: 190, y2: 246, n: 5 }] } },
          { t: 'Create the gastric pouch', d: 'Open a window on the lesser curvature a few centimeters below the junction. One horizontal firing, then vertical firings along a bougie to the angle of His. Pouch volume 15–30 mL.', tip: 'The whole fundus stays with the remnant. The pouch must be small and fully divided.', danger: 'A large pouch or a gastro-gastric fistula: ulcers and weight regain.', nurse: '60 mm stapler, medium-tissue cartridges for stomach, bougie.', fig: { base: 'rygb-config', hl: ['pouch', 'remnant', 'eso'], marks: [{ t: 'staple', pts: ['218 66', '232 52', '226 30', '214 8'] }, { t: 'zone', x: 202, y: 46, rx: 26, ry: 22, tone: 'safe' }] } },
          { t: 'Bring up the Roux limb and do the GJ', d: 'Bring the Roux limb up in front of the colon and stomach. Join it to the pouch with a 2.5–3 cm linear staple line and close the opening over a bougie.', tip: 'Check there’s no tension and no twist in the limb mesentery. Thick omentum: split it.', danger: 'Tension on the anastomosis: leak. Twist: obstruction.', nurse: 'Linear or circular stapler, absorbable suture for closure, 30–36 Fr bougie.', fig: { base: 'rygb-config', hl: ['roux', 'pouch', 'gj', 'colon'], marks: [{ t: 'arrow', x1: 100, y1: 200, x2: 170, y2: 80, cx: 70, cy: 110, label: 'Antecolic', lx: 44, ly: 104 }] } },
          { t: 'Leak test', d: 'Clamp the limb below the anastomosis and test with air under water or methylene blue. Endoscopy also works.', tip: 'Endoscopy also shows bleeding at the anastomosis.', danger: 'A negative test doesn’t rule out a late leak.', nurse: 'Saline, dilute methylene blue, laparoscopic bowel clamp or endoscope.', fig: { base: 'rygb-config', hl: ['gj', 'pouch'], marks: [{ t: 'zone', x: 202, y: 58, rx: 34, ry: 26, tone: 'info', label: 'Air under water', lx: 260, ly: 20 }] } },
          { t: 'Close Petersen’s space', d: 'Close the space between the Roux limb mesentery and the transverse mesocolon, all the way to the colon.', tip: 'Lift the transverse colon to see the whole space from its base.', danger: 'A stitch that takes mesenteric vessels.', nurse: 'Non-absorbable suture.', fig: { base: 'rygb-config', hl: ['pet', 'roux', 'colon'], marks: [{ t: 'stitch', x1: 132, y1: 172, x2: 180, y2: 112, n: 6 }] } },
          { t: 'Final check and closure', d: 'Check every staple line for bleeding, the limb orientation and the defects. Close fascia at the large ports.', tip: 'One last run along all the limbs catches orientation errors.', danger: 'Bleeding from the remnant staple line won’t be seen on endoscopy later.', nurse: 'Suture passer, 0 absorbable suture.', fig: { view: 'access' } }
        ],
        equipment: [
          { cat: 'Access and exposure', items: ['12 mm optical port.', 'Long 12 and 5 mm trocars.', '10 mm 30° scope.', 'Liver retractor (Nathanson).'], alt: ['Veress needle at Palmer’s point', 'Inflatable liver retractor'] },
          { cat: 'Energy and dissection', items: ['Ultrasonic or advanced bipolar device.', 'Long atraumatic graspers with length markings.'], alt: ['Bipolar vessel sealer (LigaSure)'] },
          { cat: 'Staplers', items: ['60 mm linear stapler.', 'Medium-tissue cartridges for stomach.', 'Thin-tissue cartridges for bowel.', 'Vascular cartridges for mesentery.'], alt: ['21 or 25 mm circular stapler for the GJ', 'Hand-sewn anastomosis', 'Choose cartridges by tissue thickness, not by color'] },
          { cat: 'Calibration', items: ['30–36 Fr bougie for closing the GJ.', 'Bougie or tube to size the pouch.'], alt: ['Endoscope as calibration'] },
          { cat: 'Suturing', items: ['Running absorbable (or barbed) suture to close anastomotic openings.', '2-0 polypropylene for the mesentery and Petersen’s space.', 'Laparoscopic needle driver.'], alt: ['Non-absorbable barbed suture', 'Clips for the mesentery (less common)'] },
          { cat: 'Leak test and closure', items: ['Methylene blue and saline.', 'Laparoscopic bowel clamp.', 'Suture passer and 0 suture for fascia.'], alt: ['Endoscope in the room', 'Closed drain as needed'] }
        ],
        pitfalls: [
          { p: 'Mixing up the limbs', fix: 'Mark the Roux end as soon as you divide. At the end, run the limbs one last time.' },
          { p: 'Pouch too large', fix: 'Keep the horizontal firing low near the lesser curvature, with the firings above it tight on the bougie.' },
          { p: 'Fundus left attached to the pouch', fix: 'Take the last firing tight against the left crus until the pouch is fully divided.' },
          { p: 'Tension on the GJ', fix: 'Split the omentum, release the mesentery or go retrocolic.' },
          { p: 'Mesenteric defects left open', fix: 'Close both defects with non-absorbable suture in every bypass.' },
          { p: 'Tube in the stomach during a firing', fix: 'Remove every tube and probe before the first firing.' }
        ]
      },
      {
        key: 'oagb', kind: 'lap', label: 'OAGB',
        setup: {
          position: { kind: 'split', tilt: 20, pressure: ['occiput', 'elbow', 'sacrum', 'heel', 'calf'] },
          room: { arms: { R: 'out', L: 'out' }, legs: 'split', staff: [{ w: 'S', s: 'legs' }, { w: 'A', s: 'Lt2' }, { w: 'C', s: 'Rt2' }, { w: 'N', s: 'RtFoot' }], monitors: ['RtHead', 'LtHead'] },
          notes: ['French position, surgeon between the legs.', 'Reverse Trendelenburg of 20–30°.', 'For measuring the bowel: table flat.', 'Footboard and wide strapping.'],
          arms: ['Both arms out to 90°, padded.'],
          team: ['Surgeon between the legs, assistant on the left, camera on the right.', 'Two monitors by the shoulders.'],
          pressureExtra: ['Extra padding in skin folds and the lower back.']
        },
        access: {
          target: { x: 196, y: 112, rx: 38, ry: 28, label: 'Stomach' },
          ports: [
            { x: 166, y: 150, mm: 12, role: 'camera', label: 'About 15 cm below the xiphoid, slightly left of midline. Camera', n: 1 },
            { x: 150, y: 72, mm: 5, role: 'assist', label: 'Subxiphoid. Liver retractor', n: 2 },
            { x: 104, y: 140, mm: 12, role: 'work', label: 'Right upper. Right hand', n: 3 },
            { x: 216, y: 130, mm: 12, role: 'stapler', label: 'Left upper. Stapler', n: 4 },
            { x: 246, y: 178, mm: 5, role: 'assist', label: 'Left lateral. Assistant', n: 5 }
          ],
          notes: ['Pneumoperitoneum 15 mmHg.', 'Optical port entry in the left upper quadrant.'],
          caption: 'Anterior view. The patient’s right is on the left of the figure.'
        },
        deltas: ['This section follows the IFSO position statement on OAGB. The reference texts (CST 14 and Sabiston 22) give no technical detail of the operation.', 'A single anastomosis between a bowel loop and the end of a long narrow pouch.', 'Long biliopancreatic limb: usually 150–200 cm from Treitz.', 'No JJ and no mesenteric defect at such an anastomosis.', 'Concern about bile reflux: not suited to severe reflux or Barrett’s.'],
        steps: [
          { t: 'Entry and exposure', d: 'Optical port entry, ports in an arc facing the stomach, liver retractor, and identify the incisura.', tip: 'Find the crow’s foot on the lesser curvature early.', danger: 'Blind entry through a thick wall.', nurse: 'Optical port, 30° scope, Nathanson retractor.', fig: { view: 'access' } },
          { t: 'Horizontal firing at the incisura', d: 'Open a window on the lesser curvature at the level of the crow’s foot and take one horizontal firing into the stomach.', tip: 'Enter the lesser sac close to the wall to preserve the pouch vessels.', danger: 'A firing too low leaves antrum in the pouch.', nurse: '60 mm stapler and a thick-tissue cartridge.', fig: { base: 'oagb-config', hl: ['crow', 'pouch', 'remnant'], marks: [{ t: 'staple', pts: ['206 152', '236 156'] }] } },
          { t: 'Long pouch along a bougie', d: 'Vertical firings along a 36–40 Fr bougie up to the angle of His. This makes a narrow pouch about 15 cm long.', tip: 'Take the last firing tight against the left crus. The whole fundus stays with the remnant.', danger: 'A pouch too wide at the top: ulcers and reflux.', nurse: '36–40 Fr bougie, medium-tissue cartridges.', fig: { base: 'oagb-config', hl: ['pouch', 'sl', 'eso'], marks: [{ t: 'staple', pts: ['206 150', '210 110', '214 70', '218 30'] }] } },
          { t: 'Measure the limb', d: 'Count 150–200 cm from Treitz. Some surgeons measure the whole small bowel and tailor the length.', tip: 'A shorter limb in older patients, at relatively low BMI or with nutritional risk.', danger: 'A limb too long: protein and nutritional deficiency.', nurse: 'Graspers with length markings.', fig: { base: 'oagb-config', hl: ['treitz', 'bp', 'duod'], marks: [{ t: 'label', x: 320, y: 262, text: '150–200 cm', tone: 'info' }] } },
          { t: 'Gastrojejunostomy', d: 'Bring the loop up antecolic and join it side to side to the end of the pouch with a 3–4.5 cm linear staple line. Close the opening with suture.', tip: 'Biliopancreatic limb to the patient’s left, efferent limb to the right, no twist.', danger: 'Tension or twist: obstruction of the loop.', nurse: '60 mm stapler, bowel cartridge, running absorbable suture.', fig: { base: 'oagb-config', hl: ['gj', 'bp', 'eff', 'pouch'], marks: [{ t: 'staple', pts: ['186 158', '200 176'] }] } },
          { t: 'Leak test, anti-reflux stitch and closure', d: 'Leak test. Some surgeons add a stitch fixing the biliopancreatic limb to the pouch to reduce bile reflux.', tip: 'Check the limb mesentery isn’t under tension.', danger: 'A negative test doesn’t rule out a late leak.', nurse: 'Methylene blue, bowel clamp, suture passer.', fig: { base: 'oagb-config', hl: ['gj', 'pouch'], marks: [{ t: 'zone', x: 194, y: 166, rx: 30, ry: 22, tone: 'info', label: 'Test', lx: 140, ly: 150 }] } }
        ],
        equipment: [
          { cat: 'Access and exposure', items: ['12 mm optical port.', 'Long trocars.', '10 mm 30° scope.', 'Liver retractor (Nathanson).'], alt: ['Veress needle at Palmer’s point'] },
          { cat: 'Staplers', items: ['60 mm linear stapler.', 'Thick-tissue cartridges for the horizontal firing.', 'Medium-tissue cartridges for the pouch.', 'Thin-tissue cartridge for the anastomosis.'], alt: ['Choose by tissue thickness, not by color'] },
          { cat: 'Calibration and suturing', items: ['36–40 Fr bougie.', 'Running absorbable suture to close the opening.'], alt: ['Barbed suture'] },
          { cat: 'Leak test and closure', items: ['Methylene blue and saline.', 'Suture passer and 0 suture for fascia.'], alt: ['Endoscope in the room'] }
        ],
        pitfalls: [
          { p: 'Short pouch', fix: 'Horizontal firing at the incisura, not above it. A long pouch keeps bile away from the esophagus.' },
          { p: 'Limb too long', fix: 'Tailor the length to the patient. In some cases measure the whole bowel.' },
          { p: 'Unrecognized bile reflux risk', fix: 'Ask about reflux and do an endoscopy before surgery. Severe reflux: Roux-en-Y.' }
        ]
      },
      {
        key: 'rrygb', kind: 'robotic', label: 'Robotic RYGB', inherit: 'rygb',
        deltas: ['Ports in a transverse line above the umbilicus, mostly 8 mm, plus a 12 mm port for the stapler.', 'The GJ is easy to hand-sew in two layers, without a circular stapler.', 'A third arm holds the stomach or bowel under steady traction.', 'The small bowel part needs planning: some surgeons do it laparoscopically before docking.', 'An advantage in revisions and very thick walls. More time and cost.'],
        setup: {
          position: { kind: 'supine', tilt: 20, pressure: ['occiput', 'elbow', 'sacrum', 'heel', 'face'] },
          room: { arms: { R: 'out', L: 'out' }, legs: 'together', staff: [{ w: 'B', s: 'Rt2' }, { w: 'N', s: 'RtFoot' }], monitors: ['RtFar1'], robot: { s: 'LtFar2' }, console: true },
          notes: ['Supine, head up before docking.', 'Don’t change position while docked (unless the table is integrated).', 'Protect the face from the robot arms.'],
          arms: ['Both arms padded, out or tucked depending on the system.'],
          team: ['Patient cart on the patient’s left.', 'Bedside assistant on the right, in charge of the stapler and measurements.', 'Surgeon at the console.']
        },
        access: {
          target: { x: 196, y: 112, rx: 38, ry: 28, label: 'Stomach' },
          ports: [
            { x: 160, y: 178, mm: 8, role: 'camera', label: 'Slightly left of and above the umbilicus. Camera', n: 1 },
            { x: 214, y: 176, mm: 12, role: 'robot', label: 'Left. Right hand and stapler', n: 2 },
            { x: 108, y: 180, mm: 8, role: 'robot', label: 'Right. Left hand', n: 3 },
            { x: 254, y: 174, mm: 8, role: 'robot', label: 'Left lateral. Arm 4', n: 4 },
            { x: 74, y: 196, mm: 12, role: 'assist', label: 'Right lower. Assistant', n: 'A' },
            { x: 150, y: 72, mm: 5, role: 'assist', label: 'Subxiphoid. Liver retractor', n: 'L' }
          ],
          notes: ['About 6–8 cm between ports.'],
          docking: ['Target the robot on the stomach for the pouch.', 'For the bowel part you sometimes need to retarget.', 'Check the arms aren’t pressing on the body.']
        }
      },
      {
        key: 'open', kind: 'open', label: 'Open', status: 'na',
        naReason: 'Gastric bypass is done almost only by a minimally invasive approach. Open surgery in morbid obesity raises wound infection and incisional hernia. Opening is kept for conversion during a complication or a complex revision.'
      }
    ],
    compare: {
      cols: ['rygb', 'oagb', 'rrygb'],
      rows: [
        { k: 'Number of anastomoses', v: { rygb: 'Two (GJ and JJ)', oagb: 'One', rrygb: 'Two' }, best: 'oagb' },
        { k: 'Operative time', v: { rygb: 'Medium', oagb: 'Shorter', rrygb: 'Longer' }, best: 'oagb' },
        { k: 'Reflux', v: { rygb: 'Treats reflux', oagb: 'Concern about bile reflux', rrygb: 'Treats reflux' }, best: 'rygb' },
        { k: 'Internal hernia', v: { rygb: 'Two defects to close', oagb: 'Lower risk', rrygb: 'Two defects to close' } },
        { k: 'Nutritional deficiency', v: { rygb: 'Well known, regular follow-up', oagb: 'More with a long limb', rrygb: 'Same as laparoscopic' } },
        { k: 'Cost', v: { rygb: 'Medium', oagb: 'Relatively low', rrygb: 'High' } },
        { k: 'Basis in the reference texts', v: { rygb: 'Detailed in CST and Sabiston', oagb: 'Per IFSO, not detailed in the texts', rrygb: 'Partly detailed' } }
      ],
      note: 'This comparison is qualitative and not based on institutional data.'
    },
    bailout: ['Difficult exposure: another retractor, another port, or diet and postpone.', 'Short mesentery or tension on the anastomosis: split the omentum, go retrocolic, or convert to a sleeve as a first stage.', 'Doubt about anastomotic integrity: reinforcing stitch, repeat test and a drain.', 'Doubt about limb orientation: stop and run the bowel from Treitz.', 'Anastomotic bleeding: oversew from outside or check endoscopically.', 'Convert to open only when bleeding or a leak can’t be controlled.'],
    intraop: [
      { c: 'Staple line bleeding', do: 'Clip or suture. Check the remnant too: after surgery it can’t be reached endoscopically.' },
      { c: 'Leak on testing', do: 'Oversew the spot and test again. If the anastomosis isn’t sound, redo it.' },
      { c: 'Bowel injury while measuring', do: 'Repair at once. Atraumatic graspers only.' },
      { c: 'Tube caught in the stapler', do: 'Don’t force it open. Identify, remove and repair. Sometimes the staple line has to change.' },
      { c: 'Twisted limb', do: 'Fix it before finishing. Run the bowel systematically from Treitz to the end.' }
    ],
    postop: {
      care: ['ERAS pathway: mobilize the same day, multimodal analgesia and minimal opioids.', 'Clear fluids on the day of surgery or the next day, then a staged diet.', 'Proton pump inhibitors for the first months to reduce ulcers.', 'Continue VTE prophylaxis by risk.', 'Lifelong supplements: multivitamin, B12, iron, calcium citrate and vitamin D. Regular blood tests.', 'Avoid NSAIDs and smoking.', 'Warning signs: heart rate above 120, fever, severe pain or shortness of breath. Investigate at once.'],
      complications: [
        { c: 'Leak', d: 'Usually at the GJ. Early: reoperate to drain and repair. Late in a stable patient: percutaneous drainage and nutrition.' },
        { c: 'Bleeding', d: 'From the anastomoses or the remnant. Usually conservative. Sometimes endoscopy or surgery.' },
        { c: 'GJ stricture', d: 'Vomiting and intolerance of solids, usually in the first months. Endoscopic balloon dilation.' },
        { c: 'Marginal ulcer', d: 'Constant epigastric pain. Smoking, NSAIDs and a large pouch raise the risk. Treat with proton pump inhibitors.' },
        { c: 'Internal hernia', d: 'Colicky pain, sometimes years after surgery, with an equivocal CT. Low threshold for diagnostic laparoscopy.' },
        { c: 'Nutritional deficiency and dumping', d: 'Vitamin D, iron, B12, calcium and thiamine. In OAGB with a long limb, protein too. Adjust diet and supplements.' },
        { c: 'Bile reflux (OAGB)', d: 'Heartburn and bilious vomiting. Medical treatment. In severe cases, conversion to Roux-en-Y.' }
      ]
    },
    quiz: [
      { q: 'What is the usual gastric pouch volume in a Roux-en-Y bypass?', a: ['5 mL', '15–30 mL', '150 mL', '300 mL'], c: 1, why: 'A small pouch reduces marginal ulcers and is linked to better weight loss.' },
      { q: 'Which two defects are closed in a Roux-en-Y bypass to prevent internal hernia?', a: ['The pylorus and the incisura', 'The JJ mesenteric defect and Petersen’s space', 'The hiatus and the umbilicus', 'The port site and the umbilicus'], c: 1, why: 'Closing both defects cuts internal hernia by about 70%.' },
      { q: 'Two years after a bypass, a patient has recurrent colicky abdominal pain and an equivocal CT. What do you suspect?', a: ['Duodenal peptic ulcer', 'Internal hernia', 'Appendicitis alone', 'Functional pain'], c: 1, why: 'Internal hernia occurs even years after surgery. Imaging can be equivocal. The threshold for diagnostic surgery is low.' },
      { q: 'What is the main structural difference in OAGB?', a: ['There is no gastric pouch', 'A single anastomosis between a long limb and a long narrow pouch', 'An anastomosis to the duodenum', 'A longer Roux limb'], c: 1, why: 'OAGB has one anastomosis. The biliopancreatic limb is long, about 150–200 cm.' },
      { q: 'Which factor raises the risk of marginal ulcer after bypass?', a: ['Physical activity', 'Smoking and NSAIDs', 'Calcium supplements', 'A high-protein diet'], c: 1, why: 'Smoking, NSAIDs and a large pouch increase marginal ulcers.' }
    ],
    sources: [
      { b: 'CST14', ref: 'Chapter in Current Surgical Therapy 14: Management of Morbid Obesity, pp. 123–128 (indications and RYGB technique: biliopancreatic limb 40–75 cm, pouch about 20 mL, antecolic).' },
      { b: 'CST14', ref: 'Chapter in Current Surgical Therapy 14: Metabolic Changes Following Bariatric Surgery, p. 879.' },
      { b: 'SAB22', ref: 'Sabiston 22, chapter 99: Morbid Obesity, pp. 1554–1578 (table of RYGB technical considerations, Roux limb length by BMI, leak, internal hernia and marginal ulcer).' },
      { b: 'SAB22', ref: 'Sabiston 22, chapter 22: Enhanced Recovery After Surgery (ERAS).' },
      { b: 'GL', ref: 'ASMBS and IFSO guidelines on indications for metabolic and bariatric surgery, 2022.' },
      { b: 'GL', ref: 'IFSO position statement on one-anastomosis gastric bypass (OAGB).' },
      { b: 'GL', ref: 'ERAS Society guidelines for bariatric surgery (2021 update).' }
    ],
    gaps: ['The OAGB section is based on the IFSO statement, not the reference texts, so it is less detailed.', 'Revisions and conversions are not covered.', 'SADI-S and BPD/DS are not covered.', 'OAGB complication rates are not given as numbers.']
  });
})();
