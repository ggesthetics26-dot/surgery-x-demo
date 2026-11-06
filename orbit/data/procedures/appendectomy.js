/* ORBIT · Appendectomy (laparoscopic · open). Robotic marked not relevant.
   Facts checked against CST14 (Appendicitis: Diagnosis and Management) and Sabiston 22 ch. 94. Text is original and short. */
(function () {
  var O = window.ORBIT;

  /* ---------- anatomy base 1: ileocecal region, laparoscopic view from the umbilicus ---------- */
  O.base('ileocecal', 'Ileocecal region, laparoscopic view', function () {
    return '' +
      '<path data-k="retro" class="a-perit" d="M0 170 C80 160 180 170 260 196 C320 214 370 240 400 250 L400 300 L0 300 Z" opacity=".9"/>' +
      '<path data-k="iliac" class="a-art" d="M400 214 C340 232 300 254 262 300" style="stroke-width:10;opacity:.75"/>' +
      '<path data-k="iliacv" class="a-vein" d="M400 238 C350 256 316 276 296 300" style="stroke-width:10;opacity:.6"/>' +
      '<path data-k="gonad" class="a-vein" d="M300 170 C292 210 284 250 270 300" style="stroke-width:3;opacity:.7"/>' +
      '<path data-k="ureter" class="a-ureterO" d="M330 170 C326 210 312 250 292 300" style="stroke-width:7"/>' +
      '<path data-k="ureter" class="a-ureter" d="M330 170 C326 210 312 250 292 300" style="stroke-width:5"/>' +
      '<path data-k="toldt" class="a-dash" d="M44 0 C46 60 56 120 72 168" style="stroke:#C23B2B;opacity:.75"/>' +
      '<path data-k="colon" class="a-colon" d="M70 0 L170 0 C178 50 182 90 196 118 C214 150 206 196 168 206 C128 216 86 196 76 150 C68 110 64 50 70 0 Z"/>' +
      '<path data-k="taenia" class="a-line" d="M120 0 C122 60 132 130 160 192" style="stroke-width:3;opacity:.6"/>' +
      '<path data-k="ileum" class="a-bowel" d="M400 92 C340 88 280 96 236 112 C214 120 200 132 192 146 L206 168 C220 150 240 140 264 134 C306 124 350 122 400 124 Z"/>' +
      '<path data-k="meso" d="M168 204 C190 196 214 176 232 150 L262 132 C262 170 250 220 228 248 Z" fill="#F3E3A6" stroke="#3A4A58" stroke-width=".8" opacity=".95"/>' +
      '<path data-k="ica" class="a-art" d="M300 124 C282 128 266 132 254 140" style="stroke-width:4"/>' +
      '<path data-k="aa" class="a-art" d="M254 140 C246 170 238 200 226 236" style="stroke-width:2.6"/>' +
      '<path data-k="app" class="a-bowel" d="M160 196 C172 214 184 232 200 248 C210 258 222 262 228 254 C234 246 226 236 216 228 C200 214 186 200 176 188 Z" style="fill:#E0907A"/>' +
      '<circle data-k="base" cx="168" cy="196" r="9" fill="none" stroke="#0C8F80" stroke-width="2" stroke-dasharray="3 2"/>' +
      '<text class="lbl" x="104" y="104">Cecum</text>' +
      '<text class="lbl" x="318" y="112">Terminal ileum</text>' +
      '<text class="lbl" x="230" y="282" text-anchor="middle">Appendix</text>' +
      '<text class="lbl s" x="248" y="184">Mesoappendix</text>' +
      '<text class="lbl s" x="300" y="146">Ileocolic a.</text>' +
      '<text class="lbl s" x="128" y="30">Taenia</text>' +
      '<text class="lbl s" x="14" y="190">Toldt</text>' +
      '<text class="lbl s" x="336" y="196">R. ureter</text>' +
      '<text class="lbl s" x="348" y="276">Iliac vessels</text>';
  });

  /* ---------- anatomy base 2: positions of the appendix around the cecum ---------- */
  O.base('appendix-positions', 'Positions of the appendix around the cecum', function () {
    return '' +
      '<circle cx="200" cy="150" r="128" fill="none" stroke="#3A4A58" stroke-width=".8" stroke-dasharray="3 6" opacity=".5"/>' +
      '<path data-k="ileum" class="a-bowel" d="M400 112 C330 110 280 118 244 132 L252 154 C290 142 330 138 400 140 Z"/>' +
      '<path data-k="colon" class="a-colon" d="M150 0 L232 0 C236 50 246 90 252 130 C260 176 236 206 200 208 C164 210 142 184 140 140 C138 90 146 40 150 0 Z"/>' +
      '<path data-k="retrocecal" class="a-bowel" d="M176 150 C172 120 168 90 170 60" style="fill:none;stroke:#E0907A;stroke-width:12;stroke-linecap:round;stroke-dasharray:2 7;opacity:.9"/>' +
      '<path data-k="pelvic" class="a-bowel" d="M208 206 C232 236 264 256 296 262" style="fill:none;stroke:#E0907A;stroke-width:12;stroke-linecap:round"/>' +
      '<path data-k="subcecal" class="a-bowel" d="M196 208 C192 236 188 260 184 282" style="fill:none;stroke:#E0907A;stroke-width:12;stroke-linecap:round;opacity:.75"/>' +
      '<path data-k="preileal" class="a-bowel" d="M226 176 C254 168 278 158 300 120" style="fill:none;stroke:#E0907A;stroke-width:12;stroke-linecap:round;opacity:.6"/>' +
      '<path data-k="paracolic" class="a-bowel" d="M146 170 C120 150 104 120 98 84" style="fill:none;stroke:#E0907A;stroke-width:12;stroke-linecap:round;opacity:.6"/>' +
      '<circle data-k="mcb" cx="200" cy="200" r="5" fill="#C23B2B"/>' +
      '<text class="lbl" x="194" y="110" text-anchor="middle">Cecum</text>' +
      '<text class="lbl s" x="140" y="56">Retrocecal</text>' +
      '<text class="lbl s" x="300" y="282" text-anchor="middle">Pelvic</text>' +
      '<text class="lbl s" x="182" y="296" text-anchor="middle">Subcecal</text>' +
      '<text class="lbl s" x="312" y="104" text-anchor="middle">Pre/post-ileal</text>' +
      '<text class="lbl s" x="60" y="76">Paracolic</text>' +
      '<text class="lbl s" x="342" y="166">Ileum</text>' +
      '<text class="lbl s" x="214" y="222">Base (fixed)</text>';
  });

  /* ---------- cover ---------- */
  O.cover('appendectomy', function () {
    return '<path class="f-w2" d="M60 20 L130 20 C134 60 140 90 146 112 C156 146 140 168 110 170 C80 172 62 150 58 118 C54 86 56 50 60 20 Z"/>' +
      '<path class="f-w2" d="M300 70 C250 70 200 80 160 100 L166 118 C206 102 250 96 300 96 Z" opacity=".7"/>' +
      '<path class="s-g" d="M112 168 C126 186 144 196 168 188" stroke-width="10"/>' +
      '<path class="s-w" d="M100 168 L132 156" stroke-width="5" stroke-dasharray="2 3"/>' +
      '<circle cx="104" cy="164" r="10" class="s-t" stroke-width="2" stroke-dasharray="3 3"/>' +
      '<text x="196" y="182" class="c-w" style="font:700 15px Inter,sans-serif;letter-spacing:.06em">BASE</text>';
  });

  O.register({
    id: 'appendectomy',
    title: 'Appendectomy',
    title_en: 'Appendectomy (laparoscopic · open)',
    system: 'appendix', organ: 'Appendix', difficulty: 1, setting: 'Mostly emergency',
    tags: ['appendix', 'acute appendicitis', 'appendicitis', 'appendectomy', 'McBurney', 'Lanz', 'abscess', 'phlegmon', 'CODA', 'acute abdomen'],
    student: {
      summary: 'Removal of an inflamed appendix, usually laparoscopically. Find the cecum, follow the taeniae to the base of the appendix, divide its mesentery and close the base on healthy tissue.',
      points: ['The three taeniae of the colon meet at the base of the appendix.', 'The appendix can lie behind the cecum, in the pelvis or next to the ileum.', 'Close the base on healthy wall and leave a short stump.', 'In uncomplicated appendicitis no antibiotics are needed after surgery.', 'Antibiotics alone are an option in selected patients.']
    },
    overview: {
      facts: [{ v: '100–150', l: 'Cases per 100,000 per year (CST)' }, { v: '≤4 days', l: 'Postoperative antibiotics in complicated appendicitis' }, { v: '40+', l: 'Age for CT and colonoscopy after nonoperative treatment' }, { v: '0', l: 'Days of postoperative antibiotics in simple appendicitis' }],
      indications: ['Acute appendicitis, uncomplicated or complicated.', 'Perforation with generalized peritonitis: emergency surgery.', 'Interval appendectomy in selected patients after a treated abscess.', 'A mass or suspected appendiceal tumor.'],
      contraindications: ['A defined abscess or phlegmon in a stable patient: antibiotics and percutaneous drainage preferred.', 'Patient unfit for anesthesia: nonoperative treatment.', 'Relative: advanced pregnancy (laparoscopy possible with care).'],
      choice: ['Laparoscopy is the default, including in pregnancy and obesity.', 'Laparoscopy lets you survey the whole abdomen when the diagnosis is uncertain.', 'Open (McBurney or Lanz): when equipment or experience is lacking, or by preference.', 'Robotic: usually not justified. No proven advantage and higher cost.', 'Antibiotics alone: an alternative in uncomplicated appendicitis. With an appendicolith the risk of failure is higher.']
    },
    anatomy: {
      figures: [
        { base: 'ileocecal', hotspots: [
          { x: 140, y: 60, label: 'The taeniae as a map', text: 'The three taeniae of the cecum converge on the base of the appendix. When the appendix is hidden, follow the anterior taenia down to the base.' },
          { x: 150, y: 222, label: 'Base of the appendix', text: 'A fairly constant spot on the cecum. Close here on healthy wall and leave a short stump; otherwise the stump can become inflamed again.' },
          { x: 262, y: 206, label: 'Mesoappendix and appendiceal artery', text: 'The appendiceal artery is a branch of the ileocolic artery. It runs along the edge of the mesoappendix. Divide it with a stapler or an energy device.' },
          { x: 30, y: 120, label: 'White line of Toldt', text: 'Retrocecal appendix: divide the lateral attachment of the cecum along the white line to mobilize and expose it.' },
          { x: 318, y: 230, label: 'Ureter and iliac vessels', text: 'Retroperitoneal, below the cecum. With an abscess or severe inflammation, don’t go deep posteriorly without seeing.' },
          { x: 330, y: 140, label: 'Terminal ileum', text: 'If the appendix looks normal: run about 60 cm of ileum (Meckel’s), check the pelvis and, in women, the pelvic organs.' }
        ] },
        { base: 'appendix-positions', hotspots: [
          { x: 120, y: 120, label: 'Retrocecal (most common)', text: 'Sometimes the cecum must be mobilized. Pain may be in the flank rather than at McBurney’s point.' },
          { x: 270, y: 238, label: 'Pelvic', text: 'Can irritate the bladder or rectum. Signs on rectal or vaginal examination.' },
          { x: 270, y: 150, label: 'Pre-ileal or post-ileal', text: 'Close to the ileum and its mesentery. Take care during the dissection.' },
          { x: 222, y: 196, label: 'The base is fixed', text: 'The tip of the appendix wanders, but the base is always in the same place relative to the taeniae.' }
        ] }
      ],
      landmarks: [
        { name: 'Taeniae of the cecum', why: 'The map to the base of the appendix.' },
        { name: 'Base of the appendix', why: 'The point of closure. Healthy tissue and a short stump.' },
        { name: 'Ileocolic artery', why: 'Origin of the appendiceal artery. Bleeding here is never controlled blindly.' },
        { name: 'Right ureter and iliac vessels', why: 'Retroperitoneal at the floor of the field. Injured by deep dissection.' },
        { name: 'McBurney’s point', why: 'About one third of the way from the ASIS to the umbilicus. Center of the open incision.' }
      ]
    },
    preop: {
      workup: ['Clinical diagnosis, blood count and CRP. A risk score such as Alvarado or AIR.', 'Imaging: ultrasound in children, young adults and pregnancy. CT in adults as needed.', 'In pregnancy: ultrasound, then MRI if needed.', 'Pregnancy test for every woman of childbearing age.'],
      consent: ['Wound infection and intra-abdominal abscess.', 'Stump leak, bleeding and bowel injury.', 'Conversion to open.', 'A wider resection (cecum or right hemicolectomy) if there is a tumor or inflammation at the base.', 'The option of antibiotics alone: benefits and the risk of recurrence.'],
      antibiotics: ['One dose before incision, covering gram-negative and anaerobic bacteria. For example cefazolin with metronidazole, per protocol.', 'Uncomplicated appendicitis: no antibiotics after surgery.', 'Complicated appendicitis: up to 4 days after source control. Some data suggest two days are enough.'],
      vte: ['Mechanical prophylaxis for everyone.', 'Pharmacological prophylaxis by risk and length of stay.'],
      bowelPrep: ['Not required.'],
      special: ['Phlegmon or abscess in a stable patient: antibiotics and percutaneous drainage. Early surgery is possible in experienced hands (WSES 2020).', 'Age 40 and over after nonoperative treatment: repeat CT and colonoscopy to exclude a tumor.', 'Pregnancy: laparoscopy is safe. Port placement adjusted to the height of the uterus.', 'Empty the bladder before placing a suprapubic port.']
    },
    approaches: [
      {
        key: 'lap', kind: 'lap', label: 'Laparoscopic',
        setup: {
          position: { kind: 'supine', tilt: -15, roll: 'left', pressure: ['occiput', 'elbow', 'sacrum', 'heel'] },
          room: { arms: { R: 'out', L: 'tucked' }, legs: 'together', staff: [{ w: 'S', s: 'Lt2' }, { w: 'C', s: 'Lt1' }, { w: 'N', s: 'Rt3' }], monitors: ['RtFar3'] },
          notes: ['Supine, secured to the table.', 'Head down (Trendelenburg) and tilt to the patient’s left: the small bowel falls out of the field.', 'Empty bladder (void before surgery or a catheter).', 'Wide prep that allows conversion to an open incision.'],
          arms: ['Left arm tucked, so both surgeons can stand on the left.', 'Both arms can be tucked.'],
          team: ['Surgeon on the patient’s left, at the pelvis. Camera on the left, toward the head.', 'Monitor on the patient’s right, near the feet, facing the surgeon.', 'Scrub nurse on the right or at the feet.'],
          pressureExtra: ['Shoulders, if shoulder supports are used in head-down.']
        },
        access: {
          target: { x: 92, y: 250, rx: 34, ry: 24, label: 'Appendix' },
          ports: [
            { x: 150, y: 210, mm: 12, role: 'camera', label: 'Umbilical (Hasson). Camera, stapler and extraction', n: 1 },
            { x: 208, y: 254, mm: 5, role: 'work', label: 'Left lower quadrant, lateral to the epigastric vessels. Right hand', n: 2 },
            { x: 150, y: 322, mm: 5, role: 'work', label: 'Suprapubic, after emptying the bladder. Left hand', n: 3 }
          ],
          notes: ['Pneumoperitoneum at 12–15 mmHg.', 'An accepted alternative: second port in the right upper or left upper quadrant (CST).', 'The stapler usually goes through the umbilical port. The camera then moves to a 5 mm port.', 'Fascia at ports of 10 mm and above is closed.'],
          caption: 'Anterior view. The patient’s right is on the left of the drawing.'
        },
        steps: [
          { t: 'Entry and survey', d: 'Open entry at the umbilicus, two ports under vision and a survey of the whole abdomen.', tip: 'In pregnancy, move the ports up according to the height of the uterus.', danger: 'A suprapubic port with a full bladder.', nurse: 'Hasson port, 30° scope 5 or 10 mm, two 5 mm ports.', fig: { view: 'access' } },
          { t: 'Exposure and finding the base', d: 'Head down and left tilt. Move the omentum and small bowel and follow the taenia to the base of the appendix.', tip: 'Grasp the mesoappendix or the tip, not the inflamed wall.', danger: 'Strong traction on a gangrenous appendix: rupture and spillage.', nurse: 'Two atraumatic graspers.', fig: { base: 'ileocecal', hl: ['colon', 'taenia', 'app', 'base'], marks: [{ t: 'arrow', x1: 126, y1: 40, x2: 158, y2: 180, cx: 128, cy: 130, label: 'Along the taenia', lx: 70, ly: 70 }] } },
          { t: 'Mobilization for a retrocecal appendix', d: 'Divide the lateral attachment of the cecum along the white line of Toldt and roll the cecum medially.', tip: 'Mobilization exposes the whole appendix. Don’t tear it out of its bed.', danger: 'Dissection too deep: the ureter and the gonadal vessels.', nurse: 'Laparoscopic scissors with diathermy.', fig: { base: 'ileocecal', hl: ['colon', 'toldt', 'ureter'], marks: [{ t: 'cut', x1: 46, y1: 30, x2: 70, y2: 160 }, { t: 'arrow', x1: 110, y1: 120, x2: 170, y2: 112, label: 'Medially', lx: 150, ly: 96 }] } },
          { t: 'Window at the base', d: 'Open a small window in the mesoappendix close to the base, between the appendix and the artery.', tip: 'Maryland forceps with a gentle spreading motion, close to the appendix wall.', danger: 'Tearing the appendiceal artery in the window.', nurse: 'Maryland forceps.', fig: { base: 'ileocecal', hl: ['app', 'meso', 'base'], marks: [{ t: 'zone', x: 186, y: 206, rx: 14, ry: 10, tone: 'safe', label: 'Window', lx: 160, ly: 236 }] } },
          { t: 'Divide the mesoappendix', d: 'Divide the mesoappendix with an energy device or a stapler with a vascular load.', tip: 'In a thick, edematous mesentery a stapler is better. Clips on the artery are also an option.', danger: 'Bleeding that retracts into the mesentery. Control it immediately before moving on.', nurse: 'Energy device (LigaSure or Harmonic) or a stapler with a vascular load (white or gray).', fig: { base: 'ileocecal', hl: ['meso', 'aa', 'app'], marks: [{ t: 'staple', pts: ['192 214', '232 180'] }] } },
          { t: 'Close and divide the base', d: 'Close the base on healthy wall with a stapler or two endoloops. Then divide.', tip: 'Stapler: a medium-tissue load (blue or purple). Endoloops: two on the cecal side and one on the appendix side.', danger: 'A long stump or closure on gangrenous tissue: leak or stump appendicitis.', nurse: '45 or 60 mm stapler with a blue or purple load. Endoloops.', fig: { base: 'ileocecal', hl: ['app', 'base', 'colon'], marks: [{ t: 'staple', pts: ['156 190', '182 202'] }, { t: 'cut', x1: 160, y1: 204, x2: 186, y2: 214 }] } },
          { t: 'Extraction in a bag', d: 'Place the appendix in a bag and extract it through the umbilical port.', tip: 'Never pull an inflamed appendix through the port without a bag.', danger: 'Port-site infection and a spilled appendicolith.', nurse: 'Retrieval bag.', fig: { view: 'access', over: { target: { x: 150, y: 210, rx: 30, ry: 18, label: 'Extraction' } } } },
          { t: 'Clean up and finish', d: 'Suction of pus and turbid fluid, check the stump and the mesentery, remove the ports under vision and close.', tip: 'Targeted suction works as well as large-volume irrigation. Look for a dropped appendicolith.', danger: 'A routine drain does not reduce complications. Leave one only for an abscess cavity.', nurse: 'Suction and irrigation, drain available, 0 suture for fascia.', fig: { base: 'ileocecal', hl: ['colon', 'base', 'retro'], marks: [{ t: 'zone', x: 120, y: 250, rx: 70, ry: 30, tone: 'info', label: 'Suction pelvis and gutter' }] } }
        ],
        equipment: [
          { cat: 'Optics and access', items: ['30° scope, 10 or 5 mm.', '12 mm Hasson port and two 5 mm ports.'], alt: ['Veress needle', 'Optical port', 'Single-incision access'] },
          { cat: 'Dissection and energy', items: ['Two atraumatic graspers.', 'Maryland forceps.', 'Laparoscopic scissors with diathermy.', 'Energy device for the mesoappendix.'], alt: ['Clips on the appendiceal artery', 'L-hook diathermy'] },
          { cat: 'Closure of the base', items: ['45 or 60 mm laparoscopic stapler.', 'Vascular load (white or gray) for the mesoappendix.', 'Blue or purple load for the base.'], alt: ['Two endoloops plus one on the appendix side', 'Locking polymer clips for a thin base', 'Z-stitch or purse-string to bury the stump'] },
          { cat: 'Other', items: ['Retrieval bag.', 'Suction and irrigation.', 'Closed drain as needed.'], alt: ['Wound protector on conversion'] },
          { cat: 'Sutures', items: ['0 absorbable for fascia.', '4-0 absorbable for skin, or skin glue.'] }
        ],
        pitfalls: [
          { p: 'You can’t find the appendix', fix: 'Follow the taeniae until they meet. Mobilize the cecum when it is retrocecal.' },
          { p: 'Long stump', fix: 'Clear the mesoappendix down to the cecum and place the stapler flush with the base.' },
          { p: 'Inflammation reaching the base and the cecum', fix: 'Include a cuff of cecum in the staple line, or resect part of the cecum.' },
          { p: 'Normal appendix', fix: 'Run the ileum (Meckel’s), check the pelvis and, in women, the internal genital organs. Look for another source.' },
          { p: 'A mass or dilated appendix (mucocele)', fix: 'Don’t rupture it. Remove it intact in a bag. For a suspicious tumor, consider a wider resection after pathology.' }
        ]
      },
      {
        key: 'open', kind: 'open', label: 'Open (McBurney or Lanz)',
        setup: {
          position: { kind: 'supine', tilt: -5, roll: 'left', pressure: ['occiput', 'elbow', 'sacrum', 'heel'] },
          room: { arms: { R: 'out', L: 'out' }, legs: 'together', staff: [{ w: 'S', s: 'Rt2' }, { w: 'A', s: 'Lt2' }, { w: 'N', s: 'Rt3' }] },
          notes: ['Supine, slight left tilt.', 'Find the point of maximal tenderness and any mass on examination before the incision.'],
          arms: ['Both arms out to 90°.'],
          team: ['Surgeon on the patient’s right, assistant on the left.', 'Focused light on the right lower quadrant.']
        },
        access: {
          target: { x: 92, y: 250, rx: 34, ry: 24, label: 'Appendix' },
          incisions: [
            { id: 'mcburney', label: 'McBurney incision: oblique, perpendicular to the ASIS–umbilicus line, through the point at its outer third', lx: 70, ly: 214 },
            { id: 'lanz', label: 'Lanz incision: transverse in a skin crease, better cosmesis', alt: true, lx: 98, ly: 276 },
            { id: 'midline-lower', label: 'Lower midline: generalized peritonitis or an unclear diagnosis', alt: true, lx: 178, ly: 300 }
          ],
          notes: ['McBurney’s point: about one third of the distance from the ASIS to the umbilicus.', 'Can be extended laterally or medially as needed.']
        },
        steps: [
          { t: 'Incision and muscle split', d: 'Skin incision, open the external oblique aponeurosis along its fibers. Split the internal oblique and transversus at right angles (grid-iron).', tip: 'Split along the fibers rather than cutting: less pain and fewer hernias.', danger: 'The ilioinguinal and iliohypogastric nerves run between the layers.', fig: { view: 'access' } },
          { t: 'Open the peritoneum and deliver the cecum', d: 'Open the peritoneum, identify the cecum by its taeniae and gently deliver it into the wound.', tip: 'Delivering the cecum brings the appendix with it. If it is retrocecal, extend and mobilize.', danger: 'Strong traction on a gangrenous appendix through a small wound.', fig: { base: 'ileocecal', hl: ['colon', 'taenia', 'app'] } },
          { t: 'Ligate the mesoappendix', d: 'Divide the mesoappendix between clamps and ligate the appendiceal artery.', tip: 'Ligate in stages in a thick mesentery.', fig: { base: 'ileocecal', hl: ['meso', 'aa'], marks: [{ t: 'stitch', x1: 194, y1: 214, x2: 232, y2: 180, n: 4 }] } },
          { t: 'Ligate and divide the base', d: 'Crush and ligate the base, divide above the tie. Burying the stump with a purse-string is optional.', tip: 'Keep the stump short. Burying the stump has not been shown to be necessary.', danger: 'Ligating gangrenous tissue at the base: close the cecum itself instead.', fig: { base: 'ileocecal', hl: ['base', 'app'], marks: [{ t: 'stitch', x1: 156, y1: 190, x2: 182, y2: 202, n: 3 }, { t: 'cut', x1: 162, y1: 206, x2: 186, y2: 214 }] } },
          { t: 'Layered closure', d: 'Suction and return the cecum. Close the peritoneum and the muscles. Then the aponeurosis and skin.', tip: 'In a contaminated wound: delayed or partial skin closure.', fig: { view: 'access' } }
        ],
        equipment: [
          { cat: 'Opening', items: ['Small abdominal set.', 'Langenbeck and Roux retractors.'], alt: ['Small self-retaining retractor', 'Wound protector'] },
          { cat: 'Ligation and division', items: ['Kelly and Babcock clamps.', '2-0 absorbable ties.'], alt: ['Linear stapler for the base', '3-0 purse-string'] },
          { cat: 'Closure', items: ['Absorbable suture for the muscle layers and aponeurosis.', 'Skin suture or staples.'] }
        ]
      },
      {
        key: 'robotic', kind: 'robotic', label: 'Robotic', status: 'na',
        naReason: 'Robotic appendectomy is not routine. It has no proven advantage over laparoscopy, and cost and time are higher. It is sometimes done as part of another robotic operation or for training.'
      }
    ],
    compare: {
      rows: [
        { k: 'When to choose', v: { lap: 'Default, including pregnancy and obesity', open: 'Lack of equipment or experience, preference' }, best: 'lap' },
        { k: 'Diagnosis', v: { lap: 'Survey of the whole abdomen', open: 'Field limited to the right lower quadrant' }, best: 'lap' },
        { k: 'Wound infection', v: { lap: 'Lower', open: 'Higher' }, best: 'lap' },
        { k: 'Intra-abdominal abscess', v: { lap: 'Similar or slightly higher in complicated appendicitis', open: 'Similar' } },
        { k: 'Pain and return to activity', v: { lap: 'Faster', open: 'Slower' }, best: 'lap' },
        { k: 'Equipment cost', v: { lap: 'Higher', open: 'Low' }, best: 'open' }
      ],
      note: 'A qualitative comparison. The robotic approach is not shown because it is not routine for this operation.'
    },
    bailout: ['An extra port, steeper tilt and help from a senior.', 'Mobilize the cecum along the line of Toldt.', 'Retrograde appendectomy, from base to tip, when the tip is hidden.', 'Inflamed base: staple across the cecal wall or a partial cecectomy.', 'Abscess with friable tissue: drainage, antibiotics and interval appendectomy as needed.', 'Conversion to an open or midline incision.', 'Ileocecectomy when the cecum is gangrenous or there is a tumor.'],
    intraop: [
      { c: 'Appendiceal artery bleeding', do: 'Pressure with a grasper and suction. Then a clip or energy device on a vessel you can see.' },
      { c: 'Tear in the cecum or base', do: 'Staple across healthy tissue or suture. Check the closure.' },
      { c: 'Dropped appendicolith', do: 'Search for it and collect it into a bag. A retained stone causes an abscess.' },
      { c: 'Normal appendix and inflamed Meckel’s', do: 'Resect the diverticulum according to the findings.' },
      { c: 'Tumor at the base', do: 'Resection with adequate margins. For a large or suspicious tumor consider right hemicolectomy, now or after pathology.' }
    ],
    postop: {
      care: ['Uncomplicated appendicitis: discharge the same day or next day, no antibiotics.', 'Complicated appendicitis: antibiotics up to 4 days after source control.', 'Early feeding as tolerated.', 'Multimodal analgesia.', 'Follow up the pathology: tumors are found in a small minority.'],
      complications: [
        { c: 'Intra-abdominal abscess', d: 'Fever, pain and ileus after complicated appendicitis. CT, percutaneous drainage and antibiotics.' },
        { c: 'Wound infection', d: 'More common with the open approach. Open and drain.' },
        { c: 'Stump leak', d: 'Rare. Peritonitis or abscess. Drainage or reoperation.' },
        { c: 'Stump appendicitis', d: 'Recurrent pain in the same place months later. Prevention: a short stump.' },
        { c: 'Ileus', d: 'Common after perforation. Usually settles with supportive care.' }
      ]
    },
    quiz: [
      { q: 'How do you find the base of the appendix when you can’t see it?', a: ['Follow the ileum back from the cecum', 'Follow the taeniae of the cecum until they meet', 'Look for the ureter', 'Open the omentum'], c: 1, why: 'The three taeniae always converge on the base of the appendix.' },
      { q: 'A patient with uncomplicated appendicitis had a laparoscopic appendectomy. How long should antibiotics continue after surgery?', a: ['10 days', '7 days', 'Up to 4 days', 'Not needed'], c: 3, why: 'In uncomplicated appendicitis the preoperative dose is enough.' },
      { q: 'What is the most common position of the appendix?', a: ['Pelvic', 'Retrocecal', 'Pre-ileal', 'Below the liver'], c: 1, why: 'Retrocecal is the most common. Sometimes the cecum must be mobilized.' },
      { q: 'A stable patient has a 5 cm periappendiceal abscess. What is the accepted approach?', a: ['Immediate laparotomy', 'Antibiotics and percutaneous drainage', 'Discharge home without treatment', 'Urgent colonoscopy'], c: 1, why: 'A defined abscess in a stable patient is usually treated with antibiotics and drainage. Early surgery is possible in experienced hands.' },
      { q: 'What increases the risk that antibiotics alone will fail?', a: ['Young age', 'An appendicolith', 'Female sex', 'Low-grade fever'], c: 1, why: 'An appendicolith on imaging is linked to a higher risk of failure and complications.' }
    ],
    sources: [
      { b: 'CST14', ref: 'Current Surgical Therapy 14: Appendicitis: Diagnosis and Management, pp. 281–286.' },
      { b: 'SAB22', ref: 'Sabiston 22, chapter 94: The Appendix, pp. 1415–1428.' },
      { b: 'SAB22', ref: 'Sabiston 22, chapter 25: Surgical Site Infections (antibiotic prophylaxis and wound protection).' },
      { b: 'GL', ref: 'WSES guidelines for acute appendicitis (Jerusalem guidelines), 2020.' },
      { b: 'GL', ref: 'CODA (2020) and APPAC (2015) trials: antibiotics versus surgery in uncomplicated appendicitis.' }
    ],
    gaps: ['The robotic approach is marked not relevant and has no steps.', 'No detailed coverage of children or appendiceal tumors.']
  });
})();
