/* ORBIT · Hiatal / paraesophageal hernia repair with fundoplication.
   Facts checked against CST14 (Surgical Management of GERD; Management of Paraesophageal Hernia Repair)
   and Sabiston 22 ch. 83 (Benign Esophageal Disorders). Text is original and short. */
(function () {
  var O = window.ORBIT;

  /* ---------- anatomy base 1: the hiatus, laparoscopic view (liver retracted) ---------- */
  O.base('hiatus', 'The hiatus, laparoscopic view', function () {
    return '' +
      '<path data-k="diaph" class="a-muscle" d="M0 0 H400 V150 C330 120 270 112 200 112 C130 112 70 122 0 150 Z" opacity=".35"/>' +
      '<path data-k="ivc" class="a-vein" d="M96 40 L104 236" style="stroke-width:22;opacity:.8"/>' +
      '<path data-k="aorta" class="a-art" d="M200 196 L200 300" style="stroke-width:30;opacity:.85"/>' +
      '<path data-k="ghl" class="a-fat" d="M84 170 C120 160 160 166 182 186 L178 268 C140 276 104 270 84 256 Z" opacity=".8"/>' +
      '<path data-k="alha" class="a-art" d="M160 290 C140 250 116 214 92 172" style="stroke-width:3.5"/>' +
      '<ellipse data-k="medi" cx="200" cy="112" rx="40" ry="50" fill="#5A3A3A" opacity=".85"/>' +
      '<path data-k="pleura" d="M172 84 C180 98 182 116 176 132 M228 84 C220 98 218 116 224 132" fill="none" stroke="#EADAD2" stroke-width="2" stroke-dasharray="4 3"/>' +
      '<path data-k="rcrus" class="a-muscle" d="M138 40 C152 80 162 130 192 204 L176 206 C146 150 126 96 118 44 Z"/>' +
      '<path data-k="lcrus" class="a-muscle" d="M262 40 C248 80 238 130 208 204 L224 206 C254 150 274 96 282 44 Z"/>' +
      '<path data-k="stom" class="a-stomach" d="M214 168 C260 150 330 120 400 112 L400 300 L250 300 C230 260 214 220 214 168 Z"/>' +
      '<path data-k="eso" class="a-stomach" d="M186 58 L184 176 C188 190 212 190 216 176 L214 58 Z" style="fill:#EDBDB2"/>' +
      '<ellipse data-k="pel" cx="200" cy="150" rx="26" ry="9" fill="none" stroke="#F4F1EC" stroke-width="3" opacity=".9"/>' +
      '<path data-k="avag" class="a-nerve" d="M204 58 C206 100 204 140 208 196" style="stroke-width:3.5"/>' +
      '<path data-k="pvag" class="a-nerve" d="M188 60 C184 110 180 150 172 214" style="stroke-width:3.5;stroke-dasharray:6 4"/>' +
      '<path data-k="his" class="a-line" d="M216 170 Q226 158 240 156" style="stroke-width:2"/>' +
      '<ellipse data-k="spleen" class="a-organ" cx="388" cy="70" rx="26" ry="38"/>' +
      '<path data-k="sg" class="a-art" d="M330 128 L372 92 M352 122 L384 104 M310 134 L362 86" style="stroke-width:2.5"/>' +
      '<path data-k="liver" class="a-liver" d="M0 0 H300 V18 C230 34 150 44 0 70 Z"/>' +
      '<rect data-k="retr" x="120" y="22" width="90" height="7" rx="3" fill="#9AA7B4" stroke="#2B3A48"/>' +
      '<text class="lbl s" x="40" y="22">Liver (retracted)</text>' +
      '<text class="lbl s" x="118" y="70" text-anchor="end">R crus</text>' +
      '<text class="lbl s" x="282" y="70">L crus</text>' +
      '<text class="lbl s" x="200" y="50" text-anchor="middle">Esophagus</text>' +
      '<text class="lbl s" x="248" y="150">His</text>' +
      '<text class="lbl s" x="340" y="210">Stomach</text>' +
      '<text class="lbl s" x="372" y="128">SGV</text>' +
      '<text class="lbl s" x="64" y="250" text-anchor="end">IVC</text>' +
      '<text class="lbl s" x="222" y="290">Aorta</text>' +
      '<text class="lbl s" x="88" y="282">Pars flaccida</text>';
  });

  /* ---------- anatomy base 2: hernia types I–IV ---------- */
  O.base('hh-types', 'Hiatal hernia types I–IV', function () {
    function panel(ox, oy, k, title, gejY, fundusUp, colon) {
      var dia = '<path class="a-muscle" d="M' + (ox + 12) + ' ' + (oy + 78) + ' H' + (ox + 82) + ' V' + (oy + 86) + ' H' + (ox + 12) + ' Z M' + (ox + 118) + ' ' + (oy + 78) + ' H' + (ox + 188) + ' V' + (oy + 86) + ' H' + (ox + 118) + ' Z"/>';
      var eso = '<path class="a-stomach" style="fill:#EDBDB2" d="M' + (ox + 92) + ' ' + (oy + 14) + ' V' + gejY + ' H' + (ox + 108) + ' V' + (oy + 14) + ' Z"/>';
      var st = '<path class="a-stomach" d="M' + (ox + 90) + ' ' + gejY + ' C' + (ox + 70) + ' ' + (gejY + 20) + ' ' + (ox + 76) + ' ' + (oy + 140) + ' ' + (ox + 112) + ' ' + (oy + 140) +
        ' C' + (ox + 160) + ' ' + (oy + 140) + ' ' + (ox + 172) + ' ' + (oy + 104) + ' ' + (ox + 150) + ' ' + (oy + 96) + ' C' + (ox + 130) + ' ' + (oy + 90) + ' ' + (ox + 118) + ' ' + (gejY + 6) + ' ' + (ox + 110) + ' ' + gejY + ' Z"/>';
      var fu = fundusUp ? '<path class="a-stomach" d="M' + (ox + 110) + ' ' + (oy + 96) + ' C' + (ox + 104) + ' ' + (oy + 70) + ' ' + (ox + 110) + ' ' + (oy + 30) + ' ' + (ox + 134) + ' ' + (oy + 30) + ' C' + (ox + 152) + ' ' + (oy + 30) + ' ' + (ox + 150) + ' ' + (oy + 66) + ' ' + (ox + 118) + ' ' + (oy + 96) + ' Z"/>' : '';
      var co = colon ? '<path class="a-colon" d="M' + (ox + 60) + ' ' + (oy + 96) + ' C' + (ox + 50) + ' ' + (oy + 60) + ' ' + (ox + 60) + ' ' + (oy + 34) + ' ' + (ox + 80) + ' ' + (oy + 40) + ' C' + (ox + 92) + ' ' + (oy + 46) + ' ' + (ox + 88) + ' ' + (oy + 70) + ' ' + (ox + 84) + ' ' + (oy + 96) + ' Z"/>' : '';
      return '<g data-k="' + k + '">' + co + st + fu + eso + dia +
        '<circle cx="' + (ox + 100) + '" cy="' + gejY + '" r="4" fill="#0C8F80" stroke="#fff"/>' +
        '<text class="lbl" x="' + (ox + 100) + '" y="' + (oy + 10) + '" text-anchor="middle">' + title + '</text></g>';
    }
    return panel(0, 0, 't1', 'Type I · sliding', 44, false, false) +
      panel(200, 0, 't2', 'Type II · rolling', 92, true, false) +
      panel(0, 150, 't3', 'Type III · mixed', 194, true, false) +
      panel(200, 150, 't4', 'Type IV · + organ', 194, true, true) +
      '<path class="a-dash" d="M200 6 V294 M6 150 H394" style="opacity:.35"/>' +
      '<text class="lbl s" x="390" y="296" text-anchor="end">● GEJ</text>';
  });

  /* ---------- anatomy base 3: wrap types ---------- */
  O.base('wraps', 'Fundoplication types: cross-section and side view', function () {
    function xs(cx, k, title, arc) {
      return '<g data-k="' + k + '">' + arc +
        '<circle cx="' + cx + '" cy="92" r="22" style="fill:#EDBDB2" class="a-stomach"/><circle cx="' + cx + '" cy="92" r="7" fill="#7A4A44"/>' +
        '<circle cx="' + cx + '" cy="70" r="3.5" class="a-nerve" style="fill:#E8DA62"/><circle cx="' + cx + '" cy="114" r="3.5" style="fill:#E8DA62"/>' +
        '<text class="lbl" x="' + cx + '" y="160" text-anchor="middle">' + title + '</text></g>';
    }
    function arc(cx, a0, a1) {
      var r = 38, p = function (a) { var t = (a - 90) * Math.PI / 180; return [cx + r * Math.cos(t), 92 + r * Math.sin(t)]; };
      var s = p(a0), e = p(a1), large = ((a1 - a0 + 360) % 360) > 180 ? 1 : 0;
      return '<path class="a-stomach" d="M' + s[0].toFixed(1) + ' ' + s[1].toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + e[0].toFixed(1) + ' ' + e[1].toFixed(1) + '" style="fill:none;stroke:#E7A79A;stroke-width:20;stroke-linecap:round"/>';
    }
    return '<text class="lbl s" x="200" y="22" text-anchor="middle">anterior ↑</text>' +
      xs(70, 'nissen', 'Nissen 360°', '<circle cx="70" cy="92" r="38" style="fill:none;stroke:#E7A79A;stroke-width:20"/>') +
      xs(200, 'toupet', 'Toupet 270°', arc(200, 45, 315)) +
      xs(330, 'dor', 'Dor 180°', arc(330, 270, 90)) +
      '<g data-k="side">' +
      '<path class="a-stomach" style="fill:#EDBDB2" d="M188 176 V262 H212 V176 Z"/>' +
      '<path class="a-stomach" d="M188 262 C150 270 150 300 150 300 H290 C290 284 270 262 212 262 Z"/>' +
      '<rect x="158" y="214" width="84" height="34" rx="14" class="a-stomach"/>' +
      '<path d="M200 178 V296" stroke="#3E6FC2" stroke-width="3" stroke-dasharray="6 4" fill="none"/>' +
      '<path class="a-line" d="M252 214 V248 M248 214 H256 M248 248 H256"/>' +
      '<text class="lbl s" x="262" y="235">2–3 cm</text>' +
      '<text class="lbl s" x="140" y="196" text-anchor="end">bougie 52–56 Fr</text>' +
      '<path class="a-line" d="M144 192 L196 200" style="opacity:.6"/>' +
      '<text class="lbl s" x="324" y="290">stomach</text></g>';
  });

  /* ---------- cover ---------- */
  O.cover('hiatal-hernia', function () {
    return '<path class="s-w" d="M40 112 C90 92 130 90 150 92 M290 112 C240 92 200 90 180 92" stroke-width="7"/>' +
      '<path class="f-w2" d="M152 30 V140 H178 V30 Z"/>' +
      '<rect x="128" y="104" width="74" height="34" rx="14" class="f-t2"/>' +
      '<path class="f-w2" d="M152 140 C120 150 112 186 150 192 L220 192 C240 172 216 140 178 140 Z"/>' +
      '<path class="s-g" d="M165 26 V196" stroke-width="2.5" stroke-dasharray="6 5"/>' +
      '<path class="s-t" d="M136 98 L150 110 M194 98 L180 110" stroke-width="3"/>' +
      '<text x="28" y="182" class="c-w" style="font:700 15px Inter,sans-serif;letter-spacing:.06em">360°</text>';
  });

  O.register({
    id: 'hiatal-hernia',
    title: 'Hiatal hernia repair and fundoplication',
    title_en: 'Hiatal / paraesophageal hernia repair with fundoplication',
    system: 'foregut', organ: 'Esophagus and diaphragm', difficulty: 4, setting: 'Elective, sometimes urgent',
    tags: ['hiatal hernia', 'hiatus', 'paraesophageal', 'PEH', 'Nissen', 'Toupet', 'Dor', 'GERD', 'reflux', 'fundoplication', 'wrap', 'Collis', 'cruroplasty'],
    student: {
      summary: 'The stomach and the gastroesophageal junction are brought back into the abdomen, the hiatus is closed, and the lower esophagus is wrapped with fundus. This makes a one-way valve against reflux and keeps the hernia from coming back.',
      points: ['Three principles: intra-abdominal esophageal length (at least 3 cm without tension), hiatal closure and a valve.', 'Preserve both vagus nerves.', 'The wrap is chosen by manometry: Nissen 360° with normal motility, Toupet 270° with weak motility.', 'A short and floppy wrap prevents dysphagia.']
    },
    overview: {
      facts: [{ v: '≥3 cm', l: 'Intra-abdominal esophagus without tension' }, { v: '52–56 Fr', l: 'Bougie to calibrate a 360° wrap' }, { v: '2–3 cm', l: 'Wrap length' }, { v: 'I–IV', l: 'Hiatal hernia types' }],
      indications: ['Proven reflux disease (GERD) that isn’t controlled, or a patient who doesn’t want lifelong medication.', 'Complications of reflux: stricture, aspiration or Barrett’s esophagus (with surveillance).', 'Symptomatic paraesophageal hernia (type II–IV): pain, dysphagia, anemia, respiratory symptoms.', 'Urgent: gastric volvulus, obstruction or suspected ischemia.'],
      contraindications: ['Normal pH study with no other evidence of reflux (when operating for reflux alone).', 'Another diagnosis: achalasia, esophageal cancer, severe motility disorder.', 'Unfit for general anesthesia.', 'Relative: asymptomatic paraesophageal hernia in an elderly, frail patient (observe).'],
      choice: ['Laparoscopy is the default.', 'Robotic: an advantage for high mediastinal dissection and suturing in a giant hernia or a redo.', 'Open abdominal: mainly for a complex redo or an emergency. The transthoracic approach is outside this scope.', 'The wrap type depends on manometry, not on the approach.']
    },
    anatomy: {
      figures: [
        { base: 'hiatus', hotspots: [
          { x: 140, y: 120, label: 'Right crus', text: 'Dissection usually starts here after opening the pars flaccida. Keep the peritoneum covering the crus, because it holds the closure sutures.' },
          { x: 262, y: 120, label: 'Left crus', text: 'Exposed after dividing the short gastrics and retracting the fundus. The phrenogastric membrane joins it to the esophagus.' },
          { x: 222, y: 76, label: 'Anterior vagus', text: 'Tight on the front wall of the esophagus. Push tissue toward the esophagus, don’t peel it off. Outside or inside the wrap depending on technique, but always intact.' },
          { x: 158, y: 196, label: 'Posterior vagus', text: 'Further from the esophagus and easy to catch by mistake in the dissection window. Include both nerves with the esophagus inside the Penrose.' },
          { x: 200, y: 236, label: 'Aorta', text: 'Lies behind the crura at the base of the V. Take the posterior closure sutures in muscle only and at a depth you can see.' },
          { x: 252, y: 178, label: 'Angle of His and phrenoesophageal membrane', text: 'The membrane (the white ring around the esophagus) is opened to enter the mediastinum. The angle marks the GEJ that the wrap must sit on.' },
          { x: 340, y: 102, label: 'Short gastric vessels', text: 'Dividing them frees the fundus for a tension-free wrap. Close to the spleen: bleeding and capsular tear.' },
          { x: 120, y: 214, label: 'Replaced left hepatic artery', text: 'Runs in the gastrohepatic ligament in some patients. Check before a large division. Dividing it can cause left liver ischemia.' },
          { x: 200, y: 96, label: 'Mediastinum and pleura', text: 'The pleura is tight on the hernia sac. A tear causes capnothorax: falling blood pressure or rising airway pressure. Lower the CO2 pressure and tell anesthesia.' }
        ] },
        { base: 'hh-types', hotspots: [
          { x: 30, y: 44, label: 'Type I · sliding', text: 'The GEJ moves up into the chest. The most common type. Operate mainly when reflux justifies it.' },
          { x: 230, y: 44, label: 'Type II · rolling', text: 'The GEJ stays in place and the fundus rolls up beside it. Risk of volvulus.' },
          { x: 30, y: 194, label: 'Type III · mixed', text: 'Both the GEJ and the fundus are above the diaphragm. Most large paraesophageal hernias.' },
          { x: 230, y: 194, label: 'Type IV · another organ', text: 'Colon, spleen or omentum come up with the stomach. Longer sac dissection.' }
        ] },
        { base: 'wraps', hotspots: [
          { x: 70, y: 40, label: 'Nissen 360°', text: 'Complete posterior wrap. The most durable against reflux. Suits normal esophageal motility.' },
          { x: 200, y: 40, label: 'Toupet 270°', text: 'Partial posterior wrap. Less dysphagia and gas bloat. Suits weak motility (IEM).' },
          { x: 330, y: 40, label: 'Dor 180°', text: 'Anterior wrap. Mainly after a Heller myotomy.' },
          { x: 120, y: 236, label: 'Short and floppy', text: 'A 2–3 cm wrap on the esophagus, calibrated over a 52–56 Fr bougie. A long or tight wrap causes dysphagia.' }
        ] }
      ],
      landmarks: [
        { name: 'Crura (right and left)', why: 'The edges of the hiatus. Keep their peritoneum to strengthen the closure.' },
        { name: 'Vagus nerves', why: 'Injury causes delayed gastric emptying and diarrhea.' },
        { name: 'GEJ and angle of His', why: 'The wrap sits on the esophagus above the GEJ, not on the stomach.' },
        { name: 'Aorta and IVC', why: 'Behind and to the right of the crura. Sutures taken too deep are dangerous.' },
        { name: 'Pleura and pericardium', why: 'Tight on the sac in a large hernia. Dissecting in the right plane prevents a tear.' },
        { name: 'Replaced left hepatic artery', why: 'In the gastrohepatic ligament. Identify it before dividing.' }
      ]
    },
    preop: {
      workup: ['Upper endoscopy: esophagitis, Barrett’s, stricture, hernia size and exclude a tumor.', 'Manometry: rules out achalasia and guides the choice of wrap.', '24–48 hour pH monitoring off medication when the indication is reflux.', 'Barium swallow or CT: anatomy, hernia size and gastric axis.', 'Large paraesophageal hernia: gastric emptying study as needed.'],
      consent: ['Temporary dysphagia, sometimes prolonged.', 'Bloating and gas, difficulty belching or vomiting.', 'Hernia recurrence (high radiologic rate in large hernias).', 'Injury to the vagus, spleen, esophagus or stomach.', 'Capnothorax and pneumothorax.', 'Esophageal lengthening (Collis) if length is not enough.', 'Conversion to open surgery.'],
      antibiotics: ['Cefazolin 2 g within 60 minutes before incision (3 g above 120 kg).', 'Redose in a long case according to half-life.'],
      vte: ['Pneumatic compression boots: a long case in head-up position.', 'Pharmacologic prophylaxis by risk (Caprini) and institutional protocol.'],
      bowelPrep: ['Not needed. Clear fluids only the day before in a large hernia with retained food.'],
      special: ['Acute volvulus: decompress with a gastric tube, operate urgently if there are signs of ischemia.', 'Morbid obesity with reflux: consider gastric bypass instead of fundoplication.', 'Bougie and endoscope available in the room. Agree with anesthesia on passing the bougie.', 'SAGES guidelines on hiatal hernia (2013) and on reflux disease (2021).']
    },
    approaches: [
      {
        key: 'lap', kind: 'lap', label: 'Laparoscopic',
        setup: {
          position: { kind: 'split', tilt: 25, pressure: ['occiput', 'elbow', 'sacrum', 'knee', 'heel'] },
          room: { arms: { R: 'out', L: 'out' }, legs: 'split', staff: [{ w: 'S', s: 'legs' }, { w: 'A', s: 'Lt2' }, { w: 'C', s: 'Rt2' }, { w: 'N', s: 'LtFoot' }], monitors: ['RtHead', 'LtHead'] },
          notes: ['Legs apart (French position) with padded straps around the thighs.', 'Steep reverse Trendelenburg of 25–30°.', 'Footboard or fixation to prevent sliding. Do a full tilt test before prepping.', 'Gastric tube to decompress, removed before the bougie.'],
          arms: ['Both arms out to 90°, or tucked and padded.', 'No more than 90° because of the brachial plexus.'],
          team: ['Surgeon between the legs.', 'Assistant on the patient’s left: fundus, energy and retraction.', 'Camera holder on the patient’s right.', 'Monitors above the shoulders, facing the surgeon.'],
          pressureExtra: ['Back of the knee and peroneal nerve with the legs apart.']
        },
        access: {
          target: { x: 160, y: 96, rx: 30, ry: 22, label: 'Hiatus' },
          ports: [
            { x: 168, y: 172, mm: 10, role: 'camera', label: 'About 15 cm below the costal margin, 2 cm left of midline. 30° camera', n: 1 },
            { x: 210, y: 128, mm: 10, role: 'work', label: 'Left subcostal. Surgeon’s right hand (energy, suturing)', n: 2 },
            { x: 102, y: 124, mm: 5, role: 'work', label: 'Right subcostal. Surgeon’s left hand', n: 3 },
            { x: 150, y: 68, mm: 5, role: 'access', label: 'Subxiphoid. Liver retractor (Nathanson)', n: 4 },
            { x: 244, y: 168, mm: 5, role: 'assist', label: 'Left lateral. Assistant: retracts fundus and omentum', n: 5 }
          ],
          notes: ['Pneumoperitoneum of 12–15 mmHg. Lower it for capnothorax.', 'The ports are relatively high: the target is below the xiphoid.', 'Camera port higher in a tall patient, so you don’t lose the mediastinum.']
        },
        steps: [
          { t: 'Position, ports and liver retractor', d: 'Legs apart, steep head up and ports in an arc around the hiatus. The liver retractor lifts the left lobe.', tip: 'With the retractor under the left lobe and above the right crus, the whole hiatus is exposed.', danger: 'Prolonged retractor pressure injures the liver. Release it from time to time in a long case.', nurse: 'Nathanson retractor with a fixation arm, 30° scope.', fig: { view: 'access' } },
          { t: 'Open the pars flaccida', d: 'Open the thin part of the gastrohepatic ligament up to the right crus.', tip: 'A thick artery in the ligament may be a replaced left hepatic artery. Preserve it when you can.', danger: 'Dividing a large replaced left hepatic artery can injure the left liver.', nurse: 'Energy device (ultrasonic or bipolar).', fig: { base: 'hiatus', hl: ['ghl', 'alha', 'rcrus', 'liver', 'retr'], marks: [{ t: 'cut', x1: 100, y1: 180, x2: 170, y2: 190 }, { t: 'zone', x: 118, y: 236, rx: 30, ry: 22, tone: 'danger', label: 'LHA?' }] } },
          { t: 'Right crus dissection', d: 'Open the phrenoesophageal membrane over the right crus and enter the mediastinum, working from the crus toward the esophagus.', tip: 'Keep the peritoneum on the crus. It gives the sutures a good purchase.', danger: 'Working tight on the esophagus risks the posterior vagus and the esophageal wall.', nurse: 'Hook cautery, atraumatic graspers.', fig: { base: 'hiatus', hl: ['rcrus', 'pel', 'eso', 'pvag'], marks: [{ t: 'path', d: 'M150 70 C160 120 170 160 186 196', tone: 'solid' }, { t: 'arrow', x1: 150, y1: 140, x2: 176, y2: 132, label: 'Toward esophagus', lx: 60, ly: 150 }] } },
          { t: 'Short gastrics and left crus', d: 'Divide the short gastric vessels from the upper third of the stomach and free the fundus. Expose the left crus and open the membrane on the left side.', tip: 'The assistant pulls the stomach to the right and down. Divide at a distance from the spleen.', danger: 'Bleeding from the spleen or from a short gastric that retracts into the tissue.', nurse: 'Energy device, clips, small gauze.', fig: { base: 'hiatus', hl: ['sg', 'spleen', 'stom', 'lcrus'], marks: [{ t: 'cut', x1: 330, y1: 110, x2: 352, y2: 132 }, { t: 'arrow', x1: 300, y1: 200, x2: 250, y2: 240, label: 'Traction', lx: 296, ly: 252 }] } },
          { t: 'Reduce the hernia sac', d: 'In a paraesophageal hernia, pull the sac out of the mediastinum and separate it from the pleura and pericardium in the right plane. Then excise it, keeping both vagus nerves.', tip: 'Pull on the sac, not on the stomach. That avoids injuring the gastric wall.', danger: 'Pleural tear: capnothorax. Tell anesthesia and lower the CO2 pressure.', nurse: 'Penrose, energy device, suction.', fig: { base: 'hiatus', hl: ['medi', 'pleura', 'eso'], marks: [{ t: 'arrow', x1: 200, y1: 80, x2: 230, y2: 196, cx: 240, cy: 120, label: 'Sac out', lx: 290, ly: 186 }, { t: 'zone', x: 200, y: 100, rx: 34, ry: 22, tone: 'danger', label: 'Pleura' }] } },
          { t: 'Mediastinal esophageal mobilization', d: 'Encircle the esophagus and both nerves with a Penrose and keep mobilizing in the mediastinum until at least 3 cm of esophagus lies in the abdomen without tension.', tip: 'Check with the pressure down and traction released: the GEJ should stay below the hiatus.', danger: 'A short esophagus left under tension is the main cause of recurrence. If there’s no length: Collis lengthening.', nurse: 'Half-inch Penrose, linear stapler available for a Collis.', fig: { base: 'hiatus', hl: ['eso', 'avag', 'pvag', 'pel'], marks: [{ t: 'path', d: 'M180 170 C200 180 220 176 222 166', tone: 'solid' }, { t: 'arrow', x1: 236, y1: 120, x2: 236, y2: 176, label: 'At least 3 cm', lx: 300, ly: 140 }] } },
          { t: 'Posterior cruroplasty', d: 'Bring the crura together behind the esophagus with interrupted non-absorbable sutures, until the hiatus is snug around the esophagus but not tight.', tip: 'Check with the bougie in: a laparoscopic instrument passes easily between the esophagus and the crura. Add one anterior stitch if the esophagus is pushed too far forward.', danger: 'A deep stitch behind the crus gets close to the aorta.', nurse: '2-0 or 0 non-absorbable suture, pledgets on request, needle driver.', fig: { base: 'hiatus', hl: ['rcrus', 'lcrus', 'aorta', 'eso'], marks: [{ t: 'stitch', x1: 182, y1: 196, x2: 218, y2: 196, n: 4 }, { t: 'stitch', x1: 178, y1: 184, x2: 222, y2: 184, n: 4 }, { t: 'zone', x: 200, y: 262, rx: 30, ry: 18, tone: 'danger', label: 'Aorta' }] } },
          { t: 'Prepare the fundus and shoe-shine', d: 'Pass the posterior fundus behind the esophagus. Place a marking stitch about 3 cm from the angle of His and 2 cm from the greater curvature. Shoe-shine back and forth to check symmetry.', tip: 'The wrap should stay in place without being held. If it springs back, mobilization isn’t enough.', danger: 'Using the body of the stomach instead of the fundus makes a twisted wrap.', nurse: 'Atraumatic graspers, marking stitch.', fig: { base: 'wraps', hl: ['side', 'nissen'], marks: [{ t: 'arrow', x1: 120, y1: 230, x2: 158, y2: 230, label: 'shoe-shine', lx: 110, ly: 212 }, { t: 'arrow', x1: 300, y1: 270, x2: 244, y2: 244 }] } },
          { t: 'Nissen 360° wrap', d: 'A 52–56 Fr bougie in the esophagus. Two or three sutures join both sides of the fundus over the esophagus to make a 2–3 cm wrap. Lateral sutures fix the wrap to the crura.', tip: 'Take a partial-thickness bite of the esophageal wall too, so the wrap doesn’t slip. Keep the anterior nerve out of the stitch.', danger: 'A wrap on the stomach instead of the esophagus: slipped wrap and reflux.', nurse: '52–56 Fr bougie (coordinate with anesthesia), 2-0 non-absorbable suture.', fig: { base: 'wraps', hl: ['nissen', 'side'], marks: [{ t: 'stitch', x1: 200, y1: 216, x2: 200, y2: 246, n: 3 }] } },
          { t: 'Partial wrap, fixation and finish', d: 'With weak motility: a Toupet 270° wrap with sutures to the right and left sides of the esophagus. In a large hernia you can fix the stomach to the abdominal wall (gastropexy). Remove the bougie and check for bleeding.', tip: 'A partial wrap doesn’t need a bougie. Endoscopy at the end as needed.', danger: 'A bougie pushed with force: esophageal perforation. Advance slowly and under vision.', nurse: 'Non-absorbable suture, gastroscope available.', fig: { base: 'wraps', hl: ['toupet', 'dor'] } }
        ],
        equipment: [
          { cat: 'Optics and access', items: ['10 mm 30° scope.', 'Ports: two 10 mm and three 5 mm.', 'Liver retractor (Nathanson) with a fixation arm.'], alt: ['Folding liver retractor through a port', '45° scope for a giant hernia'] },
          { cat: 'Dissection and energy', items: ['Energy device for the short gastrics.', 'Hook cautery.', 'Atraumatic graspers and Maryland forceps.', 'Half-inch Penrose to encircle the esophagus.'], alt: ['Ultrasonic device', 'Advanced bipolar device'] },
          { cat: 'Calibration and wrap', items: ['52–56 Fr bougie (for a 360° wrap).', '2-0 non-absorbable suture for the wrap.', '0 or 2-0 non-absorbable suture for the crura.'], alt: ['Pledgets for thin crura', 'Hand tying or a knot device (Ti-Knot)', 'Silk or braided polyester'] },
          { cat: 'Hiatal reinforcement', items: ['Primary suture closure is the foundation.'], alt: ['Biologic or absorbable mesh in a large hernia (long-term benefit unclear)', 'Permanent mesh not recommended routinely because of erosion into the esophagus'] },
          { cat: 'Available in the room', items: ['Gastroscope.', 'Linear stapler for a Collis.', 'Chest drain kit.'] }
        ],
        pitfalls: [
          { p: 'Unrecognized short esophagus', fix: 'Measure intra-abdominal length without traction. Mobilize higher in the mediastinum. If still not enough: Collis.' },
          { p: 'Wrap on the stomach', fix: 'Identify the GEJ (angle of His, fat pad). The wrap goes above it.' },
          { p: 'Tight or long wrap', fix: '52–56 Fr bougie, shoe-shine and a length of only 2–3 cm.' },
          { p: 'Vagal injury', fix: 'Push tissue toward the esophagus. Both nerves inside the Penrose and outside the sutures.' },
          { p: 'Crura tearing with suturing', fix: 'Keep their peritoneum. Pledgets for thin crura.' }
        ]
      },
      {
        key: 'robotic', kind: 'robotic', label: 'Robotic', inherit: 'lap',
        deltas: ['Stable 3D view and wristed instruments: easier high mediastinal dissection and crural suturing.', 'A third arm holds the Penrose or the fundus instead of the assistant.', 'Advantage mainly in giant hernias and redos.', 'No haptic feedback: watch the force on the stomach and esophagus.', 'The liver retractor and bougie are still in the hands of the bedside team. Good coordination is needed.'],
        setup: {
          position: { kind: 'split', tilt: 25, pressure: ['occiput', 'elbow', 'sacrum', 'knee', 'heel', 'face'] },
          room: { arms: { R: 'tucked', L: 'tucked' }, legs: 'together', staff: [{ w: 'B', s: 'Lt2' }, { w: 'N', s: 'LtFoot' }], monitors: ['RtFar2'], robot: { s: 'head' }, console: true },
          notes: ['Steep head up before docking.', 'Don’t change position after docking (unless the table is integrated).', 'Protect the face from the robot arms.'],
          arms: ['Both arms tucked and padded.'],
          team: ['Patient cart from the head or the side, depending on the system.', 'Bedside assistant on the left: suction, clips and bougie.', 'Surgeon at the console.']
        },
        access: {
          target: { x: 160, y: 96, rx: 30, ry: 22, label: 'Hiatus' },
          ports: [
            { x: 150, y: 176, mm: 8, role: 'camera', label: 'Above the umbilicus, midline. Camera', n: 1 },
            { x: 210, y: 170, mm: 8, role: 'robot', label: 'Left. Surgeon’s right hand', n: 2 },
            { x: 92, y: 168, mm: 8, role: 'robot', label: 'Right. Surgeon’s left hand', n: 3 },
            { x: 258, y: 164, mm: 8, role: 'robot', label: 'Left lateral. Arm 4: retraction', n: 4 },
            { x: 150, y: 68, mm: 5, role: 'access', label: 'Liver retractor', n: 5 },
            { x: 194, y: 224, mm: 12, role: 'assist', label: 'Assistant port', n: 'A' }
          ],
          notes: ['A transverse line of ports about 15–20 cm from the hiatus.', '6–8 cm between ports.'],
          docking: ['Target the robot on the hiatus.', 'Dock the camera, then the arms.', 'Check the arms aren’t pressing on the chest or face.']
        }
      },
      {
        key: 'open', kind: 'open', label: 'Open', status: 'na',
        naReason: 'The open abdominal approach is now kept mainly for a complex redo or an emergency (volvulus with ischemia). The principles are the same: sac reduction, esophageal length, crural closure and a wrap. The transthoracic approach is outside the scope of ORBIT.'
      }
    ],
    compare: {
      rows: [
        { k: 'When to choose', v: { lap: 'Default', robotic: 'Giant hernia, redo, experience and availability' }, best: 'lap' },
        { k: 'Mediastinal dissection', v: { lap: 'Good, depends on experience', robotic: 'Easier high up' } },
        { k: 'Suturing', v: { lap: 'Needs skill', robotic: 'Easier' }, best: 'robotic' },
        { k: 'Time and cost', v: { lap: 'Shorter and cheaper', robotic: 'Longer and more expensive' }, best: 'lap' },
        { k: 'Haptic feedback', v: { lap: 'Present', robotic: 'Absent' } }
      ],
      note: 'The open approach is marked as not routine. This comparison is qualitative.'
    },
    bailout: ['Not enough esophageal length: mobilize higher in the mediastinum.', 'Still short: esophageal lengthening (Collis or wedge gastroplasty).', 'Crura that won’t close without tension: lower the CO2 pressure, pledgets, a relaxing incision or absorbable mesh reinforcement.', 'Unstable patient with a giant hernia: reduce the stomach, gastropexy or gastrostomy, and finish quickly.', 'Uncontrolled bleeding or injury: convert to open.'],
    intraop: [
      { c: 'Capnothorax', do: 'Tell anesthesia, lower the CO2 pressure and increase PEEP. Usually resolves on its own. Hypotension that doesn’t respond: chest drain.' },
      { c: 'Esophageal or gastric perforation', do: 'Air test or endoscopy, two-layer repair. The wrap can cover the repair.' },
      { c: 'Splenic bleeding', do: 'Pressure and a hemostatic agent. Splenectomy only as a last resort.' },
      { c: 'Vagal injury', do: 'Document it. If both nerves are injured, consider a pyloroplasty.' },
      { c: 'Liver injury from the retractor', do: 'Pressure and a hemostatic agent, reposition the retractor.' }
    ],
    postop: {
      care: ['Short stay, usually one night.', 'Contrast study on day one per surgeon routine: passage through the wrap and gastric emptying.', 'Liquid then soft diet for a few weeks. Small meals.', 'Crushed or liquid medication in the first weeks. Stop acid suppression.', 'Prevent nausea and vomiting: early vomiting puts the repair at risk.'],
      complications: [
        { c: 'Dysphagia', d: 'Common in the first weeks because of edema. Lasting beyond about 6 weeks: investigate and balloon dilate.' },
        { c: 'Bloating and gas', d: 'Difficulty belching. Usually improves with time. Less common with a partial wrap.' },
        { c: 'Hernia recurrence', d: 'High radiologic rate in large hernias, most without symptoms. Reoperate only when symptomatic.' },
        { c: 'Slipped or tight wrap', d: 'Dysphagia and reflux. Investigate with a swallow study and endoscopy.' },
        { c: 'Leak', d: 'Rare but dangerous: fever, tachycardia and chest pain. CT with oral contrast.' }
      ]
    },
    quiz: [
      { q: 'What intra-abdominal esophageal length do you want at the end of the dissection?', a: ['Less than 1 cm', 'At least 3 cm without tension', 'At least 10 cm', 'It doesn’t matter'], c: 1, why: 'A short esophagus under tension pulls the repair up and causes recurrence.' },
      { q: 'What decides between Nissen and Toupet?', a: ['Age', 'Hernia size', 'Manometry: normal or weak motility', 'Weight'], c: 2, why: 'With weak motility, a partial wrap reduces dysphagia.' },
      { q: 'Which hernia type includes an organ other than the stomach?', a: ['Type I', 'Type II', 'Type III', 'Type IV'], c: 3, why: 'In type IV, colon, spleen or omentum also come up.' },
      { q: 'During sac dissection, blood pressure falls and airway pressure rises. What is most likely?', a: ['Splenic bleeding', 'Capnothorax from a pleural tear', 'A reaction to the bougie', 'Vagal injury'], c: 1, why: 'A pleural tear lets CO2 into the chest. Lower the pressure and update anesthesia.' },
      { q: 'What defines a proper Nissen wrap?', a: ['Long and tight on the stomach', 'Short and floppy on the esophagus, 2–3 cm', 'Anterior only', 'Never dividing the short gastrics'], c: 1, why: 'A short, floppy wrap on the esophagus prevents reflux without dysphagia.' }
    ],
    sources: [
      { b: 'CST14', ref: 'Chapter in Current Surgical Therapy 14: Surgical Management of Gastroesophageal Reflux Disease, pp. 7–13.' },
      { b: 'CST14', ref: 'Chapter in Current Surgical Therapy 14: Management of Paraesophageal Hernia Repair, pp. 29–34.' },
      { b: 'SAB22', ref: 'Sabiston 22, chapter 83: Benign Esophageal Disorders, pp. 1108–1135 (fundoplication and hiatal hernia).' },
      { b: 'SAB22', ref: 'Sabiston 22, chapter 25: Surgical Site Infections (antibiotic prophylaxis).' },
      { b: 'GL', ref: 'SAGES guidelines for the management of hiatal hernia, 2013.' },
      { b: 'GL', ref: 'SAGES guidelines for the surgical treatment of reflux disease, 2021.' }
    ],
    gaps: ['Esophageal lengthening (Collis) is described in one sentence only, without step cards.', 'Open and transthoracic approaches are not detailed.', 'LINX and endoscopic techniques are not covered.']
  });
})();
