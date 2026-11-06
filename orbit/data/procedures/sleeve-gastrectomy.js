/* ORBIT · Sleeve gastrectomy (laparoscopic · robotic).
   Facts checked against CST14 (Management of Morbid Obesity, pp. 123–128) and Sabiston 22 ch. 99 (sleeve technical table).
   Text is original and short. */
(function () {
  var O = window.ORBIT;
  var BOWEL = 'fill:none;stroke:var(--a-stomach);stroke-linecap:round';

  /* ---------- anatomy base 1: stomach before sleeve, laparoscopic view (liver retracted) ---------- */
  O.base('sleeve-stomach', 'Stomach before the sleeve: landmarks for the staple line', function () {
    return '' +
      '<path data-k="crus" class="a-muscle" d="M150 0 L176 0 C172 22 170 40 176 58 L160 62 C150 40 148 20 150 0 Z M206 0 L236 0 C232 26 222 46 204 62 L196 56 C204 40 208 20 206 0 Z" opacity=".85"/>' +
      '<path data-k="spleen" class="a-organ" d="M372 30 C396 40 400 110 386 150 C376 170 352 160 352 130 C350 90 352 50 372 30 Z"/>' +
      '<path data-k="duod" class="a-bowel" d="M108 198 C84 190 52 192 40 212 C30 232 40 254 62 258 L70 242 C58 238 54 224 64 216 C78 208 96 214 108 228 Z"/>' +
      '<path data-k="eso" class="a-stomach" d="M176 0 L202 0 L198 56 L180 56 Z"/>' +
      '<path data-k="stom" class="a-stomach" d="M180 52 C200 30 236 18 268 26 C314 40 342 90 344 142 C346 198 312 246 256 262 C210 274 150 262 118 236 L106 224 L112 196 C134 204 154 196 162 178 C172 156 178 118 180 90 Z"/>' +
      '<path data-k="fundus" d="M200 40 C220 22 252 18 276 28 C300 38 318 58 326 80 L250 86 C236 66 220 52 200 40 Z" fill="rgba(255,255,255,.14)" stroke="none"/>' +
      '<ellipse data-k="pylorus" class="a-muscle" cx="110" cy="212" rx="7" ry="16" transform="rotate(20 110 212)"/>' +
      '<path data-k="gea" class="a-art" d="M352 120 C356 180 324 240 262 272 C220 286 170 280 132 262" style="stroke-width:2.6"/>' +
      '<path data-k="sg" class="a-art" d="M300 46 L360 46 M320 70 L356 74 M334 96 L354 100" style="stroke-width:2.4"/>' +
      '<path data-k="bougie" d="M189 0 L189 60 C186 120 176 168 152 192 L114 210" style="fill:none;stroke:#8A9AAA;stroke-width:10;stroke-linecap:round;opacity:.75;stroke-dasharray:14 4"/>' +
      '<path data-k="incis" class="a-dash" d="M150 180 L178 166"/>' +
      '<path data-k="five" class="a-dash" d="M112 238 C140 262 170 272 196 272"/>' +
      '<text class="lbl" x="200" y="18" text-anchor="start">Esophagus</text>' +
      '<text class="lbl s" x="214" y="52">Angle of His</text>' +
      '<text class="lbl" x="276" y="66" text-anchor="middle">Fundus</text>' +
      '<text class="lbl" x="276" y="168" text-anchor="middle">Greater curve</text>' +
      '<text class="lbl s" x="120" y="164">Incisura</text>' +
      '<text class="lbl s" x="40" y="186">Pylorus</text>' +
      '<text class="lbl s" x="150" y="292">4–6 cm</text>' +
      '<text class="lbl s" x="196" y="128">Bougie</text>' +
      '<text class="lbl s" x="362" y="186">Spleen</text>' +
      '<text class="lbl s" x="330" y="248">GEA arcade</text>' +
      '<text class="lbl s" x="148" y="10" text-anchor="end">Left crus</text>' +
      '<text class="lbl s" x="40" y="276">Duodenum</text>';
  });

  /* ---------- anatomy base 2: completed sleeve and the danger points ---------- */
  O.base('sleeve-tube', 'Completed sleeve: shape and danger points', function () {
    return '' +
      '<path data-k="remnant" d="M206 50 C232 28 300 32 330 80 C350 120 346 200 300 246 C276 268 240 276 206 272" fill="rgba(231,167,154,.28)" stroke="var(--a-stroke)" stroke-dasharray="5 5"/>' +
      '<path data-k="duod" class="a-bowel" d="M108 198 C84 190 52 192 40 212 C30 232 40 254 62 258 L70 242 C58 238 54 224 64 216 C78 208 96 214 108 228 Z"/>' +
      '<path data-k="eso" class="a-stomach" d="M176 0 L202 0 L198 56 L180 56 Z"/>' +
      '<path data-k="sleeve" class="a-stomach" d="M180 52 C192 44 202 42 210 50 C208 96 202 140 196 180 C192 210 194 240 206 272 C176 274 140 260 118 236 L106 224 L112 196 C134 204 154 196 162 178 C172 156 178 118 180 90 Z"/>' +
      '<path data-k="sl" d="M210 50 C208 96 202 140 196 180 C192 210 194 240 206 272" style="' + BOWEL.replace('var(--a-stomach)', '#2B3A48') + ';stroke-width:5;opacity:.85"/>' +
      '<path data-k="sl" d="M210 50 C208 96 202 140 196 180 C192 210 194 240 206 272" style="fill:none;stroke:#DCE4EB;stroke-width:2.4;stroke-dasharray:2.2 2.4"/>' +
      '<ellipse data-k="pylorus" class="a-muscle" cx="110" cy="212" rx="7" ry="16" transform="rotate(20 110 212)"/>' +
      '<text class="lbl" x="150" y="128" text-anchor="middle">Sleeve</text>' +
      '<text class="lbl s" x="270" y="160" text-anchor="middle">Resected stomach</text>' +
      '<text class="lbl s" x="40" y="186">Pylorus</text>' +
      '<text class="lbl s" x="218" y="44">GEJ / His</text>' +
      '<text class="lbl s" x="214" y="178">Incisura</text>' +
      '<text class="lbl s" x="214" y="282">Antrum</text>';
  });

  /* ---------- cover ---------- */
  O.cover('sleeve-gastrectomy', function () {
    return '<path class="f-w2" d="M130 40 C150 22 196 14 226 26 C268 42 292 90 292 128 C292 170 262 196 220 200 L150 196 C116 190 92 172 84 150 L92 132 C114 140 128 130 132 114 C138 90 132 62 130 40 Z" opacity=".55"/>' +
      '<path class="f-t2" d="M130 40 C142 30 152 28 160 34 C158 80 152 120 150 150 C148 172 152 186 164 196 L150 196 C116 190 92 172 84 150 L92 132 C114 140 128 130 132 114 C138 90 132 62 130 40 Z"/>' +
      '<path class="s-w" d="M160 34 C158 80 152 120 150 150 C148 172 152 186 164 196" stroke-width="4" stroke-dasharray="3 3"/>' +
      '<path class="s-g" d="M138 6 L136 40" stroke-width="10"/>' +
      '<text x="196" y="184" class="c-w" style="font:700 14px Inter,sans-serif;letter-spacing:.06em">36 Fr</text>';
  });

  O.register({
    id: 'sleeve-gastrectomy',
    title: 'Sleeve gastrectomy',
    title_en: 'Sleeve gastrectomy (laparoscopic · robotic)',
    system: 'bariatric', organ: 'Stomach', difficulty: 3, setting: 'Elective',
    tags: ['sleeve gastrectomy', 'sleeve', 'LSG', 'VSG', 'bariatric', 'obesity', 'bougie', 'calibration tube', 'stomach', 'His', 'leak', 'staple line leak'],
    student: {
      summary: 'Removal of about 75–80% of the stomach along the greater curve. What remains is a narrow, sleeve-shaped stomach along the lesser curve. The most common bariatric operation today.',
      points: ['The staple line starts 4–6 cm from the pylorus.', 'A 34–40 Fr bougie along the lesser curve sets the width.', 'Don’t narrow the sleeve at the incisura.', 'Stay about 1 cm from the gastroesophageal junction at the angle of His, where most leaks happen.', 'A fast pulse after surgery is an early sign of a leak.']
    },
    overview: {
      facts: [{ v: '~60%', l: 'Of bariatric operations in the US (CST)' }, { v: '34–40 Fr', l: 'Accepted bougie size' }, { v: '4–6 cm', l: 'From the pylorus to the first firing' }, { v: '≥35', l: 'BMI for the indication (ASMBS/IFSO 2022)' }],
      indications: ['BMI of 35 or more, with or without comorbidities (ASMBS/IFSO 2022).', 'BMI of 30–35 with metabolic disease, such as type 2 diabetes, after failed nonsurgical treatment.', 'First stage of a staged operation in a patient with a very high BMI.', 'Patients better off without a bypass: bowel disease, need for endoscopic access to the duodenum, many medications.'],
      contraindications: ['Severe reflux disease or Barrett’s esophagus (a bypass is better).', 'Uncontrolled psychiatric illness or active addiction.', 'Unable to commit to lifelong follow-up.', 'Prohibitive anesthetic risk.'],
      choice: ['The default is laparoscopy.', 'Robotic: depending on availability and experience, mainly for a very high BMI or a thick abdominal wall. Higher cost without a proven benefit in outcomes.', 'Severe reflux before surgery tips the choice toward gastric bypass.', 'A hiatal hernia found during surgery is repaired in the same operation.']
    },
    anatomy: {
      figures: [
        { base: 'sleeve-stomach', hotspots: [
          { x: 226, y: 34, label: 'Angle of His and the GE junction', text: 'The last firing exits here. Stay about 1 cm on the gastric side. This area has the weakest blood supply and most leaks happen here.' },
          { x: 168, y: 196, label: 'Incisura angularis', text: 'The narrowest point of the sleeve. A stricture here, or a spiraled staple line, causes functional obstruction.' },
          { x: 178, y: 270, label: 'Start of the staple line', text: 'On the greater curve, 4–6 cm from the pylorus. Closer raises the risk of stricture. Farther leaves a large antrum.' },
          { x: 189, y: 104, label: 'Bougie', text: 'A 34–40 Fr calibration tube along the lesser curve. Too small is linked to reflux. Too large is linked to weight regain over time.' },
          { x: 336, y: 60, label: 'Short gastric vessels', text: 'Join the stomach to the spleen. Divide them close to the stomach with an energy device. Bleeding from the spleen or a torn short gastric is a common intraoperative complication.' },
          { x: 162, y: 22, label: 'Left crus of the diaphragm', text: 'Full exposure of the left crus confirms that the whole fundus is free and lets you spot a hiatal hernia.' },
          { x: 300, y: 214, label: 'Gastroepiploic arcade', text: 'Divide its branches close to the stomach, not the arcade itself. That’s how you enter the lesser sac.' }
        ] },
        { base: 'sleeve-tube', hotspots: [
          { x: 218, y: 62, label: 'Leak at the angle of His', text: 'The classic leak site. Marginal blood supply and high pressure in a narrow sleeve. Usually shows as a fast pulse, fever and pain.' },
          { x: 190, y: 182, label: 'Stricture or twist', text: 'A firing that pulls the stomach unevenly creates a spiraled sleeve. A narrowing here causes vomiting and food intolerance.' },
          { x: 296, y: 116, label: 'Retained fundus', text: 'A posterior fundus that wasn’t freed is left as a pouch that dilates. Linked to weight regain and reflux.' },
          { x: 232, y: 262, label: 'Antrum', text: 'Keep a short antrum that empties the sleeve. The tissue here is the thickest, so use thick-tissue cartridges.' }
        ] }
      ],
      landmarks: [
        { name: 'Pylorus', why: 'The reference point for the start of the staple line: 4–6 cm from it.' },
        { name: 'Incisura', why: 'The dangerous narrowing point. Leave room from the bougie here.' },
        { name: 'Angle of His', why: 'The end point. Stay on the gastric side so you don’t cut esophagus.' },
        { name: 'Left crus', why: 'Sign of a fully freed fundus. The place to check for a hiatal hernia.' },
        { name: 'Spleen and short gastric vessels', why: 'The main source of bleeding during mobilization.' },
        { name: 'Posterior gastric adhesions', why: 'A stomach not freed posteriorly pulls the firing and creates a spiraled sleeve.' }
      ]
    },
    preop: {
      workup: ['Multidisciplinary assessment: surgeon, dietitian, psychologist or psychiatrist, and an internist or endocrinologist.', 'Blood tests: blood count, chemistry, liver function, HbA1c, minerals and vitamins (vitamin D, iron and B12).', 'Screening for obstructive sleep apnea (OSA) and CPAP fitting.', 'Gastroscopy or contrast study for questions of reflux, hiatal hernia or Barrett’s, and per institutional protocol.', 'Abdominal ultrasound as needed (gallstones, fatty liver).', 'Low-calorie diet for 2–4 weeks before surgery to shrink the liver.'],
      consent: ['Staple line leak.', 'Bleeding, stricture and twisting of the sleeve.', 'New or worsening reflux.', 'Deep vein thrombosis and pulmonary embolism.', 'Insufficient weight loss or weight regain.', 'Need for lifelong supplements and follow-up.', 'Conversion to open (rare) and drain placement.'],
      antibiotics: ['Weight-based cefazolin: 2 g (3 g above 120 kg) within 60 minutes before incision.', 'Redose if surgery lasts more than 4 hours or with heavy blood loss.'],
      vte: ['Pneumatic compression devices from arrival in the OR.', 'Low molecular weight heparin at a weight-adjusted dose, per institutional protocol.', 'Early mobilization the same day.', 'At very high risk: consider extended prophylaxis after discharge.'],
      bowelPrep: ['Not needed. Fasting per ERAS: clear fluids up to 2 hours before surgery.'],
      special: ['An operating table rated for the weight, leg extensions and a footboard.', 'Anesthesia: prepare for a difficult airway and use the ramp position.', 'Remove every tube from the stomach before each firing (gastric tube, temperature probe).', 'Hiatal hernia: repair it in the same operation.']
    },
    approaches: [
      {
        key: 'lap', kind: 'lap', label: 'Laparoscopic',
        setup: {
          position: { kind: 'split', tilt: 25, pressure: ['occiput', 'elbow', 'sacrum', 'heel', 'calf'] },
          room: { arms: { R: 'out', L: 'out' }, legs: 'split', staff: [{ w: 'S', s: 'legs' }, { w: 'A', s: 'Lt2' }, { w: 'C', s: 'Rt2' }, { w: 'N', s: 'RtFoot' }], monitors: ['RtHead', 'LtHead'] },
          notes: ['French position: legs apart on extensions, surgeon between the legs.', 'Reverse Trendelenburg of 25–30°.', 'Footboard and wide straps across the thighs and chest.', 'Test the full tilt before prepping.', 'Alternative: supine with the surgeon on the patient’s right.'],
          arms: ['Both arms out to 90°, padded.', 'Keep the shoulder from being stretched (brachial plexus).'],
          team: ['Surgeon between the legs.', 'Assistant on the patient’s left, holding traction on the stomach and omentum.', 'Camera on the patient’s right.', 'Two monitors near the shoulders.', 'Stapler and all cartridges ready on the table before division starts.'],
          pressureExtra: ['Extra padding in skin folds and the lower back.', 'Check that the footboard isn’t pressing.']
        },
        access: {
          target: { x: 196, y: 118, rx: 40, ry: 30, label: 'Stomach' },
          ports: [
            { x: 168, y: 150, mm: 12, role: 'camera', label: 'About 15 cm below the xiphoid, slightly left of midline. Camera', n: 1 },
            { x: 150, y: 72, mm: 5, role: 'assist', label: 'Subxiphoid. Liver retractor (Nathanson)', n: 2 },
            { x: 104, y: 136, mm: 12, role: 'work', label: 'Right upper. Right hand and stapler', n: 3 },
            { x: 214, y: 128, mm: 15, role: 'stapler', label: 'Left upper. Left hand and stapler', n: 4 },
            { x: 246, y: 170, mm: 5, role: 'assist', label: 'Left lateral. Assistant', n: 5 }
          ],
          notes: ['Pneumoperitoneum 15 mmHg.', 'Entry with an optical port in the left upper quadrant, or at Palmer’s point, which suits a thick wall.', 'With a thick wall, move the camera port closer to the target.', 'Long trocars in patients with a thick abdominal wall.'],
          caption: 'Anterior view. The patient’s right is on the left of the figure.'
        },
        steps: [
          { t: 'Entry and port placement', d: 'Optical port entry, pneumoperitoneum and survey. The ports sit in an arc facing the stomach.', tip: 'In a thick wall, insert the trocar perpendicular, not angled, so you don’t lose leverage.', danger: 'Blind entry in a thick wall: vascular or bowel injury.', nurse: 'Optical port, 10 mm 30° scope, long trocars.', fig: { view: 'access' } },
          { t: 'Lifting the liver and exposing the hiatus', d: 'A liver retractor lifts the left lobe. You see the angle of His, the left crus and the whole stomach.', tip: 'Large liver: the preoperative diet helps more than any instrument.', danger: 'A retractor pressed too hard injures the liver.', nurse: 'Nathanson retractor and table holder.', fig: { base: 'sleeve-stomach', hl: ['crus', 'eso', 'fundus'], marks: [{ t: 'arrow', x1: 262, y1: 64, x2: 262, y2: 18, label: 'Liver up', lx: 310, ly: 30 }] } },
          { t: 'Entering the lesser sac', d: 'About 5 cm from the pylorus, open a window in the omentum close to the stomach and enter the lesser sac.', tip: 'Start where the omentum is thin. You’ll see the back wall of the stomach.', danger: 'Dividing the gastroepiploic arcade itself instead of its branches.', nurse: 'Advanced energy device (ultrasonic or bipolar).', fig: { base: 'sleeve-stomach', hl: ['gea', 'stom'], marks: [{ t: 'zone', x: 236, y: 266, rx: 30, ry: 16, tone: 'safe', label: 'Window' }] } },
          { t: 'Freeing the greater curve up to His', d: 'Divide the branches along the greater curve and the short gastric vessels up to the angle of His, close to the stomach.', tip: 'The assistant pulls the omentum laterally, the surgeon pulls the stomach. Steady countertraction.', danger: 'Bleeding from the spleen or a short gastric near the upper pole.', nurse: 'Suction, a small gauze for the abdomen, clips for vessels.', fig: { base: 'sleeve-stomach', hl: ['sg', 'gea', 'spleen', 'fundus'], marks: [{ t: 'arrow', x1: 300, y1: 236, x2: 326, y2: 62, cx: 360, cy: 160, label: 'Along the curve', lx: 300, ly: 140 }] } },
          { t: 'Fundus, left crus and posterior adhesions', d: 'Free the fundus from the left crus and the posterior gastric adhesions until the stomach is completely free.', tip: 'If you see a hiatal hernia, close the crura in the same operation.', danger: 'A retained posterior fundus creates a pouch and a spiraled sleeve.', fig: { base: 'sleeve-stomach', hl: ['crus', 'fundus', 'eso'], marks: [{ t: 'zone', x: 222, y: 48, rx: 40, ry: 22, tone: 'info', label: 'Free to the crus' }] } },
          { t: 'Passing the bougie', d: 'Remove the gastric tube and the temperature probe. Anesthesia passes a 34–40 Fr bougie along the lesser curve down to the pylorus.', tip: 'The bougie goes in gently, guided by the surgeon who steers it under vision.', danger: 'A tube left in the stomach will end up in the staple line. Forcing it injures the esophagus.', nurse: 'Calibrated bougie and lubricant, coordinate with anesthesia.', fig: { base: 'sleeve-stomach', hl: ['bougie', 'eso', 'pylorus'], marks: [{ t: 'arrow', x1: 189, y1: 0, x2: 189, y2: 46, label: 'Bougie', lx: 222, ly: 30 }] } },
          { t: 'First firing in the antrum', d: 'The first firing is 4–6 cm from the pylorus, with a thick-tissue cartridge. The second passes the incisura and leaves room there.', tip: 'Before each firing, check the back wall and that there’s room from the bougie.', danger: 'Too close to the incisura: stricture.', nurse: '60 mm stapler, extra-thick tissue cartridges for the antrum.', fig: { base: 'sleeve-stomach', hl: ['stom', 'five', 'incis', 'bougie'], marks: [{ t: 'staple', pts: ['200 268', '190 230', '194 190'] }, { t: 'label', x: 250, y: 230, text: 'Thick tissue', tone: 'info' }] } },
          { t: 'Continuing along the bougie to His', d: 'Sequential firings parallel to the bougie up to the angle of His. With each firing, pull the front and back walls with the same tension.', tip: 'Aim the last firing about 1 cm onto the gastric side of the junction.', danger: 'Uneven traction creates a spiraled sleeve. A firing across the esophagus: leak.', nurse: 'Medium tissue cartridges for the body and fundus, staple line buttress as the surgeon prefers.', fig: { base: 'sleeve-stomach', hl: ['stom', 'bougie', 'eso'], marks: [{ t: 'staple', pts: ['200 268', '190 230', '194 190', '200 140', '204 96', '210 50'] }, { t: 'zone', x: 216, y: 42, rx: 18, ry: 12, tone: 'danger', label: '1 cm', lx: 252, ly: 32 }] } },
          { t: 'Staple line check, leak test and extraction', d: 'Check the whole line for bleeding, do a leak test per protocol, remove the stomach in a bag and close the fascia at the large port.', tip: 'Bleeding from the line: clip or suture. Oversew with a running suture if you prefer.', danger: 'A negative leak test doesn’t rule out a late leak.', nurse: 'Methylene blue or endoscope, retrieval bag, suture passer.', fig: { base: 'sleeve-tube', hl: ['sleeve', 'sl', 'eso'], marks: [{ t: 'dot', x: 206, y: 70 }, { t: 'dot', x: 198, y: 160 }, { t: 'dot', x: 200, y: 246 }, { t: 'label', x: 120, y: 30, text: 'Check the whole line', tone: 'safe' }] } }
        ],
        equipment: [
          { cat: 'Access and exposure', items: ['12 mm optical port.', 'Long 12, 15 and 5 mm trocars.', '10 mm 30° scope.', 'Liver retractor (Nathanson).'], alt: ['Veress needle at Palmer’s point', 'Inflatable or fan liver retractor'] },
          { cat: 'Energy and dissection', items: ['Ultrasonic or advanced bipolar device.', 'Long atraumatic graspers.'], alt: ['Bipolar sealing device (LigaSure)', 'Scissors with diathermy'] },
          { cat: 'Staplers', items: ['Articulating 60 mm linear stapler.', 'Extra-thick tissue cartridges for the antrum.', 'Medium tissue cartridges for the body and fundus.'], alt: ['Cartridge colors differ between manufacturers: choose by tissue thickness, not by color', 'Robotic stapler'] },
          { cat: 'Calibration and reinforcement', items: ['Bougie 34–40 Fr.', 'Staple line buttress as preferred.', 'Absorbable suture for oversewing.'], alt: ['No reinforcement', 'Running oversew', 'Another calibration device instead of a bougie'] },
          { cat: 'Leak test', items: ['Diluted methylene blue through a gastric tube.', 'Endoscope for an underwater air test.'], alt: ['Air test through a tube', 'No routine test, per protocol'] },
          { cat: 'Closure and other', items: ['Retrieval bag.', 'Suture passer and absorbable 0 suture for the fascia.', 'Table and supports rated for the weight.'], alt: ['Closed drain as needed'] }
        ],
        pitfalls: [
          { p: 'Tube or temperature probe in the stomach during a firing', fix: 'A fixed routine: before the first firing, ask anesthesia and remove everything except the bougie.' },
          { p: 'Stricture at the incisura', fix: 'Leave room from the bougie on the second firing and don’t pull the stomach laterally.' },
          { p: 'Spiraled sleeve', fix: 'Equal tension on the front and back walls. Check that the staple line stays on one side with each firing.' },
          { p: 'Retained posterior fundus', fix: 'Free it fully up to the left crus before the last firing.' },
          { p: 'Firing too close to the esophagus', fix: 'Last firing about 1 cm onto the gastric side, with a clear view of the crus.' }
        ]
      },
      {
        key: 'robotic', kind: 'robotic', label: 'Robotic', inherit: 'lap',
        deltas: ['Ports in a single transverse line above the umbilicus, mostly 8 mm, plus a 12 mm port for the stapler.', 'A third arm holds the stomach under steady tension. Useful with a very thick wall, because the robot removes the wall’s resistance.', 'Wristed robotic stapler with tissue-thickness feedback, or a laparoscopic stapler in the assistant’s hands.', 'Oversewing the staple line is easier.', 'Longer operating time and higher cost. No proven benefit in outcomes.'],
        setup: {
          position: { kind: 'supine', tilt: 25, pressure: ['occiput', 'elbow', 'sacrum', 'heel', 'face'] },
          room: { arms: { R: 'out', L: 'out' }, legs: 'together', staff: [{ w: 'B', s: 'Rt2' }, { w: 'N', s: 'RtFoot' }], monitors: ['RtFar1'], robot: { s: 'LtFar2' }, console: true },
          notes: ['Supine, head up 25–30° before docking.', 'Don’t change position while the robot is docked (unless the table is integrated).', 'Protect the face from the robot arms.'],
          arms: ['Both arms out or tucked depending on the model, padded.'],
          team: ['Robot cart on the patient’s left.', 'Bedside assistant on the right, at the assistant and stapler ports.', 'Surgeon at the console.']
        },
        access: {
          target: { x: 196, y: 118, rx: 40, ry: 30, label: 'Stomach' },
          ports: [
            { x: 160, y: 178, mm: 8, role: 'camera', label: 'Slightly left of and above the umbilicus. Camera', n: 1 },
            { x: 214, y: 176, mm: 12, role: 'robot', label: 'Left. Right hand and robotic stapler', n: 2 },
            { x: 108, y: 180, mm: 8, role: 'robot', label: 'Right. Left hand', n: 3 },
            { x: 254, y: 174, mm: 8, role: 'robot', label: 'Left lateral. Arm 4 for traction', n: 4 },
            { x: 74, y: 196, mm: 12, role: 'assist', label: 'Right lower. Assistant', n: 'A' },
            { x: 150, y: 72, mm: 5, role: 'assist', label: 'Subxiphoid. Liver retractor', n: 'L' }
          ],
          notes: ['About 6–8 cm between ports.', 'The line sits lower than in laparoscopy to give working distance from the hiatus.'],
          docking: ['Target the robot on the stomach.', 'Dock the camera first.', 'Check that no arm presses on the body or the thighs.']
        }
      },
      {
        key: 'open', kind: 'open', label: 'Open', status: 'na',
        naReason: 'Sleeve gastrectomy is done almost only minimally invasively. Open surgery in a patient with severe obesity means more wound infections and incisional hernias. Open surgery is kept for conversion when a complication occurs.'
      }
    ],
    compare: {
      cols: ['lap', 'robotic'],
      rows: [
        { k: 'When to choose', v: { lap: 'Default', robotic: 'By availability, very thick wall' }, best: 'lap' },
        { k: 'Operating time', v: { lap: 'Short', robotic: 'Longer (docking)' }, best: 'lap' },
        { k: 'Cost', v: { lap: 'Relatively low', robotic: 'High' }, best: 'lap' },
        { k: 'Ergonomics', v: { lap: 'Strain against a thick wall', robotic: 'Comfortable, no wall resistance' }, best: 'robotic' },
        { k: 'Suturing', v: { lap: 'Possible, needs skill', robotic: 'Easier' }, best: 'robotic' },
        { k: 'Outcomes', v: { lap: 'Well established', robotic: 'Similar, no proven benefit' } }
      ],
      note: 'This comparison is qualitative, not based on institutional data.'
    },
    bailout: ['Poor exposure from a large liver: another retractor, another port, or postpone surgery after more diet.', 'Bleeding from the spleen: pressure, a hemostatic agent and an extra port. Splenectomy only after that.', 'A firing that didn’t close or an incomplete line: oversew the line or add a firing on the gastric side.', 'Doubt about the integrity of the line: oversew, leak test and a drain.', 'Stricture found during surgery: take down part of the line and suture, or convert to a bypass in experienced hands.', 'Convert to open only when bleeding or a leak can’t be controlled.'],
    intraop: [
      { c: 'Bleeding from a short gastric or the spleen', do: 'Pressure with gauze, suction, energy or a clip. No blind clips near the spleen.' },
      { c: 'Staple line bleeding', do: 'Clip or suture. Check again at low pneumoperitoneum pressure and normal blood pressure.' },
      { c: 'A firing that didn’t form properly', do: 'Stop. Oversew the area or add a firing on the gastric side. Leak test.' },
      { c: 'Tube caught in the stapler', do: 'Don’t force it open. Identify it, remove the stapler carefully and repair. Sometimes the resection line must change.' },
      { c: 'Esophageal injury from the bougie', do: 'If suspected: endoscopy, suture and a drain. Report it and coordinate with anesthesia.' }
    ],
    postop: {
      care: ['ERAS pathway: mobilization the same day, multimodal analgesia and as few opioids as possible.', 'Clear fluids on the day of surgery or the next day, then a staged diet.', 'Nausea and vomiting prevention with several drugs.', 'Proton pump inhibitors for the first months.', 'Continue thromboprophylaxis according to risk.', 'Lifelong supplements: multivitamin, B12, iron, calcium and vitamin D.', 'Warning signs: pulse above 120, fever, left shoulder pain or shortness of breath. Investigate at once.'],
      complications: [
        { c: 'Leak', d: 'Usually near the angle of His. Early: drainage and sometimes reoperation. Late in a stable patient: drainage, nutrition and a stent or endoscopic treatment.' },
        { c: 'Bleeding', d: 'From the staple line or intraluminal. Falling hemoglobin, fast pulse. Usually conservative, sometimes surgery or endoscopy.' },
        { c: 'Stricture or twist', d: 'Vomiting and intolerance. Endoscopic dilation. Sometimes conversion to a bypass.' },
        { c: 'Reflux', d: 'New or worsening. Medical treatment. If severe, conversion to gastric bypass.' },
        { c: 'Venous thrombosis, including the portal vein', d: 'Unexplained abdominal pain: contrast imaging and anticoagulation.' },
        { c: 'Nutritional deficiencies', d: 'Vitamin D, iron, B12 and thiamine. Regular blood test follow-up.' }
      ]
    },
    quiz: [
      { q: 'Where does the first firing of a sleeve start?', a: ['Right at the pylorus', '4–6 cm from the pylorus on the greater curve', 'At the incisura', 'At the angle of His'], c: 1, why: 'Too close raises the risk of stricture. Too far leaves a large antrum.' },
      { q: 'What is the risk of a bougie that is too small?', a: ['Weight regain', 'Reflux and stricture', 'Hernia', 'Bleeding'], c: 1, why: 'A sleeve that’s too narrow raises the pressure inside it and is linked to reflux and stricture. A bougie that’s too large is linked to weight regain.' },
      { q: 'Where do most leaks after a sleeve occur?', a: ['In the antrum', 'At the angle of His near the GE junction', 'At the pylorus', 'In the spleen'], c: 1, why: 'The upper area has marginal blood supply and high pressure.' },
      { q: 'What must you do before the first firing?', a: ['Increase the pneumoperitoneum', 'Remove every tube and temperature probe from the stomach except the bougie', 'Close the crura', 'Divide the gastroepiploic arcade'], c: 1, why: 'A tube left in the stomach will be caught in the stapler.' },
      { q: 'A patient on day one after a sleeve has a pulse of 126 and a low-grade fever. What do you suspect first?', a: ['Anxiety', 'Staple line leak', 'Normal pain', 'Dehydration only'], c: 1, why: 'A fast pulse is often the first sign of a leak. Investigate at once.' }
    ],
    sources: [
      { b: 'CST14', ref: 'Current Surgical Therapy 14, chapter: Management of Morbid Obesity, pp. 123–128 (indications, sleeve technique: 40 Fr bougie and staple line starting 4–6 cm from the pylorus).' },
      { b: 'CST14', ref: 'Current Surgical Therapy 14, chapter: Metabolic Changes Following Bariatric Surgery, p. 879.' },
      { b: 'SAB22', ref: 'Sabiston 22, chapter 99: Morbid Obesity, pp. 1554–1578 (table of technical considerations in sleeve: 34–40 Fr bougie, 5 cm from the pylorus, optional reinforcement).' },
      { b: 'SAB22', ref: 'Sabiston 22, chapter 22: Enhanced Recovery After Surgery (ERAS).' },
      { b: 'GL', ref: 'ASMBS and IFSO guidelines on indications for metabolic and bariatric surgery, 2022.' },
      { b: 'GL', ref: 'ERAS Society guidelines for bariatric surgery (2021 update).' }
    ],
    gaps: ['Leak and stricture rates are not shown as numbers, because they vary between series.', 'Revisional sleeve or conversion surgery is not detailed.', 'Cartridge colors by manufacturer are deliberately not listed.']
  });
})();
