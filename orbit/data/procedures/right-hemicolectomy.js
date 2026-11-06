/* ORBIT · Right hemicolectomy (laparoscopic medial-to-lateral · robotic · open).
   Facts checked against CST14 (Surgical Management of Colon Cancer; Preoperative Bowel Preparation) and Sabiston 22 ch. 95–96, ch. 22. Text is original and short. */
(function () {
  var O = window.ORBIT;

  /* ---------- anatomy base 1: right colon vessels, anterior view, transverse colon lifted ---------- */
  O.base('rhc-vessels', 'Right colon vessels, anterior view', function () {
    return '' +
      '<path data-k="meso" d="M70 70 L210 60 L222 270 L110 262 L70 230 Z" fill="rgba(243,227,166,.55)" stroke="none"/>' +
      '<path data-k="gonad" class="a-vein" d="M128 130 L118 296" style="stroke-width:3;opacity:.8"/>' +
      '<path data-k="ureter" class="a-ureterO" d="M140 128 C136 180 134 240 140 296" style="stroke-width:7"/>' +
      '<path data-k="ureter" class="a-ureter" d="M140 128 C136 180 134 240 140 296" style="stroke-width:5"/>' +
      '<path data-k="duod" class="a-bowel" d="M150 92 C128 110 126 168 150 196 C168 214 200 214 214 204 L214 186 C196 194 174 190 164 172 C150 150 154 116 168 100 Z"/>' +
      '<path data-k="panc" class="a-organ" d="M168 104 C188 98 208 104 214 118 L214 182 C200 188 182 184 172 168 C162 148 160 120 168 104 Z" opacity=".9"/>' +
      '<path data-k="colon" class="a-colon" d="M40 230 C30 180 34 120 50 80 C62 54 90 36 130 30 L392 26 L392 54 L132 58 C102 62 84 76 76 96 C66 126 64 176 72 226 Z"/>' +
      '<path data-k="cecum" class="a-colon" d="M36 222 C30 252 46 280 74 282 C100 284 112 262 108 238 C104 224 88 218 72 220 Z"/>' +
      '<path data-k="ileum" class="a-bowel" d="M104 250 C140 256 170 268 210 266 C240 264 270 272 300 290 L292 300 C262 286 238 280 210 282 C170 284 136 272 102 266 Z"/>' +
      '<path data-k="app" class="a-colon" d="M60 280 C58 292 64 298 70 296 C74 294 72 286 70 280 Z"/>' +
      '<path data-k="smv" class="a-vein" d="M224 300 L222 60" style="stroke-width:12"/>' +
      '<path data-k="sma" class="a-art" d="M250 300 L248 64" style="stroke-width:9"/>' +
      '<path data-k="henle" class="a-vein" d="M222 122 C206 112 196 100 186 86 M196 100 C176 98 156 94 140 74" style="stroke-width:4"/>' +
      '<path data-k="mca" class="a-art" d="M248 100 C238 90 226 76 216 60 M232 82 C200 74 160 64 132 58" style="stroke-width:4"/>' +
      '<path data-k="rca" class="a-art" d="M248 160 C220 158 150 150 78 146" style="stroke-width:3;stroke-dasharray:6 4"/>' +
      '<path data-k="ica" class="a-art" d="M248 232 C220 230 170 236 100 238" style="stroke-width:5"/>' +
      '<path data-k="icv" class="a-vein" d="M222 222 C196 222 160 226 104 230" style="stroke-width:5"/>' +
      '<circle data-k="node" class="a-lymph" cx="232" cy="230" r="6"/>' +
      '<text class="lbl" x="226" y="290" text-anchor="end">SMV</text><text class="lbl" x="256" y="290">SMA</text>' +
      '<text class="lbl s" x="168" y="226" text-anchor="middle">Ileocolic a./v.</text>' +
      '<text class="lbl s" x="150" y="140" text-anchor="middle">Right colic a. (variable)</text>' +
      '<text class="lbl s" x="262" y="92">Middle colic a.</text>' +
      '<text class="lbl s" x="176" y="80" text-anchor="end">Henle trunk</text>' +
      '<text class="lbl s" x="188" y="152" text-anchor="middle">Pancreas</text>' +
      '<text class="lbl s" x="128" y="204" text-anchor="end">Duodenum</text>' +
      '<text class="lbl s" x="134" y="292" text-anchor="end">Ureter</text>' +
      '<text class="lbl s" x="300" y="44">Transverse colon</text>' +
      '<text class="lbl s" x="58" y="160" text-anchor="middle" transform="rotate(-90 58 160)">Ascending</text>' +
      '<text class="lbl s" x="72" y="258" text-anchor="middle">Cecum</text>' +
      '<text class="lbl s" x="300" y="280" text-anchor="end">Terminal ileum</text>';
  });

  /* ---------- anatomy base 2: stapled ileocolic anastomosis ---------- */
  O.base('ileocolic-anast', 'Stapled ileocolic anastomosis (side-to-side, functional end-to-end)', function () {
    return '' +
      '<path data-k="mes" d="M30 60 L300 60 L300 30 L30 30 Z" fill="rgba(243,227,166,.6)"/>' +
      '<path data-k="mes" d="M30 250 L340 250 L340 280 L30 280 Z" fill="rgba(243,227,166,.6)"/>' +
      '<path data-k="ileum" class="a-bowel" d="M30 70 L290 70 C318 70 330 86 330 104 C330 122 318 136 290 136 L30 136 Z"/>' +
      '<path data-k="colon" class="a-colon" d="M30 152 L310 152 C342 152 360 172 360 196 C360 222 342 242 310 242 L30 242 Z"/>' +
      '<path class="a-line" d="M60 152 L60 242 M110 152 L110 242" style="opacity:.25"/>' +
      '<path data-k="ent" d="M314 108 C330 112 344 130 344 150" fill="none" stroke="#C23B2B" stroke-width="3" stroke-dasharray="4 3"/>' +
      '<text class="lbl" x="60" y="108">Ileum</text>' +
      '<text class="lbl" x="60" y="204">Transverse colon</text>' +
      '<text class="lbl s" x="392" y="276" text-anchor="end">Common enterotomy</text><path class="ln" d="M370 266 L340 150"/>';
  });

  O.cover('right-hemicolectomy', function () {
    return '<path class="s-w" d="M76 170 C64 120 70 72 104 56 L270 50" stroke-width="16" opacity=".35"/>' +
      '<path class="s-t" d="M76 170 C64 120 70 72 104 56 L170 54" stroke-width="16"/>' +
      '<path class="f-t2" d="M58 166 C52 186 66 196 84 194 C98 192 104 178 98 168 Z"/>' +
      '<path class="s-w" d="M206 190 L204 40" stroke-width="7"/>' +
      '<path class="s-r" d="M224 190 L222 44" stroke-width="5"/>' +
      '<path class="s-r" d="M222 150 C190 150 130 154 90 162" stroke-width="3.5"/>' +
      '<path class="s-r" d="M222 80 C200 72 170 62 150 56" stroke-width="3"/>' +
      '<g><rect x="186" y="142" width="5" height="16" rx="1.5" class="c-w"/><rect x="176" y="143" width="5" height="16" rx="1.5" class="c-w"/></g>' +
      '<text x="240" y="182" class="c-w" style="font:700 14px Inter,sans-serif;letter-spacing:.06em">CME</text>';
  });

  O.register({
    id: 'right-hemicolectomy',
    title: 'Right hemicolectomy',
    title_en: 'Right hemicolectomy (laparoscopic · robotic · open)',
    system: 'colorectal', organ: 'Right colon', difficulty: 3, setting: 'Elective, sometimes urgent',
    tags: ['hemicolectomy', 'colon resection', 'right hemicolectomy', 'colectomy', 'ileocolic', 'CME', 'Henle', 'colon cancer', 'cecum', 'colon'],
    student: {
      summary: 'Removal of the cecum, ascending colon and hepatic flexure together with their mesentery and feeding vessels. The small bowel is then joined to the transverse colon. In cancer, the goal is to remove the tumor with clear margins and the lymph nodes up to the root of the vessels.',
      points: ['The main vessel is the ileocolic artery, a branch of the SMA.', 'In the medial-to-lateral approach, the mesentery is lifted off the duodenum.', 'The SMV is the key landmark. Near the SMV, work slowly.', 'In cancer, pathology needs at least 12 lymph nodes.']
    },
    overview: {
      facts: [{ v: '≥12', l: 'Lymph nodes for reliable N staging' }, { v: '5–7 cm', l: 'Accepted proximal and distal margins' }, { v: 'ICA', l: 'High ligation of the ileocolic artery' }, { v: 'MIS', l: 'Recommended when expertise is available (CST 14)' }],
      indications: ['Cancer of the cecum, ascending colon and hepatic flexure.', 'Polyp that cannot be removed endoscopically, or a malignant polyp with high-risk features.', 'Crohn’s disease of the terminal ileum and cecum (ileocolic resection).', 'Appendiceal tumors that need a wider resection.', 'Urgent: cecal volvulus, perforation, uncontrolled bleeding, ischemia.'],
      contraindications: ['Unfit for general anesthesia.', 'Tumor invading adjacent organs: plan an en bloc resection, sometimes open.', 'Relative, for laparoscopy: obstruction with very dilated bowel, dense adhesions, hemodynamic instability.'],
      choice: ['Default: minimally invasive (laparoscopic or robotic) when expertise is available.', 'Robotic: makes intracorporeal anastomosis and central dissection near the SMV easier. Higher cost.', 'Open: large or invasive tumor, obstruction, unstable patient or dense adhesions.', 'The oncologic principles are the same in every approach.']
    },
    anatomy: {
      figures: [
        { base: 'rhc-vessels', hotspots: [
          { x: 184, y: 252, label: 'Ileocolic pedicle', text: 'Bowstrings when the cecum is pulled laterally. This is the entry point for the medial-to-lateral approach: incise the peritoneum just beneath it.' },
          { x: 210, y: 176, label: 'SMV', text: 'The key landmark. Ligate the vessels at their root, beside the SMV. In central ligation (CME/CVL) the right side of the SMV is exposed.' },
          { x: 196, y: 120, label: 'Gastrocolic trunk of Henle', text: 'Drains into the SMV below the pancreatic head. Strong traction on the hepatic flexure tears it and causes heavy bleeding.' },
          { x: 236, y: 72, label: 'Middle colic artery', text: 'In a standard right hemicolectomy, preserve the trunk and divide only the right branch. For a hepatic flexure tumor, consider an extended resection.' },
          { x: 142, y: 186, label: 'Duodenum', text: 'Lies beneath the mesentery. In medial-to-lateral mobilization, push the duodenum and pancreatic head down and back; don’t lift them with the colon.' },
          { x: 120, y: 272, label: 'Right ureter and gonadal vessels', text: 'Stay behind, in the retroperitoneal plane. If you see them on the mesentery, you’re too deep.' },
          { x: 96, y: 160, label: 'Right colic artery', text: 'Present in only some patients. If present, ligate it at its root.' }
        ] },
        { base: 'ileocolic-anast', hotspots: [
          { x: 200, y: 144, label: 'Linear staple line', text: 'A 60 mm stapler between ileum and colon, on the antimesenteric side. Creates a wide lumen.' },
          { x: 360, y: 128, label: 'Closing the common enterotomy', text: 'With another linear stapler or by suture. Make sure it doesn’t narrow the lumen.' },
          { x: 120, y: 268, label: 'Mesentery', text: 'Must be free of twist and tension. Closing the mesenteric defect is not mandatory in minimally invasive surgery.' }
        ] }
      ],
      landmarks: [
        { name: 'Ileocolic pedicle', why: 'The entry point of the operation and the first vessel ligated.' },
        { name: 'SMV', why: 'The medial border of the dissection. High ligation is done here.' },
        { name: 'Duodenum and pancreatic head', why: 'Beneath the mesentery. Protect them by staying in the right plane.' },
        { name: 'Trunk of Henle', why: 'Source of heavy bleeding when taking down the hepatic flexure.' },
        { name: 'Right ureter and gonadal vessels', why: 'Stay behind. Don’t lift them with the colon.' },
        { name: 'Toldt’s plane', why: 'Avascular plane between the mesentery and the retroperitoneum.' }
      ]
    },
    preop: {
      workup: ['Complete colonoscopy with biopsy, and tattoo of the lesion if it’s small.', 'CT of chest, abdomen and pelvis for staging.', 'Preoperative CEA.', 'Blood count and iron studies: anemia is common in right-sided tumors. Correct it before surgery.', 'Multidisciplinary tumor board for cancer.'],
      consent: ['Anastomotic leak, bleeding and infection.', 'Injury to the duodenum, ureter or major vessels.', 'Conversion to open surgery.', 'Temporary diarrhea after removal of the ileocecal valve.', 'Possible stoma in unusual situations.', 'Delayed return of bowel function (ileus).'],
      antibiotics: ['Cefazolin 2 g plus metronidazole 500 mg IV within 60 minutes before incision.', 'Alternatives per institution: cefoxitin, ertapenem.', 'Redose in a long case or with heavy blood loss.'],
      vte: ['Pneumatic compression devices during surgery.', 'Low molecular weight heparin after surgery.', 'In cancer: consider extended prophylaxis for about 4 weeks per institutional protocol.'],
      bowelPrep: ['Isosmotic mechanical prep together with oral antibiotics the day before surgery (neomycin with metronidazole or erythromycin).', 'Mechanical prep alone is not recommended.', 'Full prep is especially important for an intracorporeal anastomosis.'],
      special: ['ERAS protocol: carbohydrate loading, short fast, no routine nasogastric tube, early feeding.', 'Small tumor: tattoo it early, because there’s no palpation in laparoscopy.', 'Obstruction or perforation: urgent surgery, sometimes without anastomosis or with a stoma.', 'Consider marking a stoma site in a high-risk patient.']
    },
    approaches: [
      {
        key: 'lap', kind: 'lap', label: 'Laparoscopic (medial to lateral)',
        setup: {
          position: { kind: 'supine', tilt: -15, roll: 'left', pressure: ['occiput', 'elbow', 'sacrum', 'heel'] },
          room: { arms: { R: 'tucked', L: 'tucked' }, legs: 'together', staff: [{ w: 'S', s: 'Lt2' }, { w: 'C', s: 'Lt3' }, { w: 'A', s: 'Rt3' }, { w: 'N', s: 'RtFoot' }], monitors: ['RtFar2', 'RtHead'] },
          notes: ['Supine and well secured: the table tilts a lot.', 'Head down (Trendelenburg) and left side down for the ileocolic phase.', 'Head up for the hepatic flexure phase.', 'Urinary catheter.', 'Consider tucking both arms to make room for the surgeon and camera.'],
          arms: ['Both arms tucked and padded.', 'Some centers leave the right arm out.'],
          team: ['Surgeon and camera on the patient’s left.', 'Assistant on the right, or between the legs in split-leg position.', 'Main monitor on the patient’s right, facing the surgeon.'],
          pressureExtra: []
        },
        access: {
          target: { x: 88, y: 210, rx: 40, ry: 54, label: 'Right colon' },
          ports: [
            { x: 150, y: 210, mm: 12, role: 'camera', label: 'Umbilical. Camera. Extended for extraction at the end', n: 1 },
            { x: 214, y: 280, mm: 12, role: 'work', label: 'Left lower quadrant. Surgeon’s right hand, energy and stapler', n: 2 },
            { x: 216, y: 150, mm: 5, role: 'work', label: 'Left upper quadrant. Surgeon’s left hand', n: 3 },
            { x: 150, y: 320, mm: 5, role: 'assist', label: 'Suprapubic. Assistant: traction on the mesentery', n: 4 }
          ],
          incisions: [{ id: 'midline-peri', label: 'Extraction: periumbilical extension', lx: 172, ly: 176, alt: true }],
          notes: ['Pneumoperitoneum 12–15 mmHg.', 'All ports on the left, facing the target on the right.', 'Wound protector in the extraction incision.']
        },
        steps: [
          { t: 'Entry and survey', d: 'Enter at the umbilicus and survey the liver and peritoneum for metastases. Then place the left-sided ports.', tip: 'Find the tumor or the tattoo before anything else.', danger: 'Peritoneal or liver metastases change the plan. Document and discuss.', nurse: '30° scope, 12 and 5 mm ports, atraumatic bowel graspers.', fig: { view: 'access' } },
          { t: 'Exposure: small bowel aside', d: 'Head down and left side down. Move the omentum and transverse colon up and the small bowel to the left.', tip: 'Omentum over the liver and small bowel in the left pelvis give a clean field.', danger: 'Grasping small bowel with a sharp grasper or too much force tears the serosa.', nurse: 'Long atraumatic graspers.', fig: { base: 'rhc-vessels', hl: ['colon', 'cecum', 'ileum'], marks: [{ t: 'arrow', x1: 200, y1: 58, x2: 200, y2: 14, label: 'Omentum up', lx: 300, ly: 16 }, { t: 'arrow', x1: 250, y1: 270, x2: 330, y2: 250, label: 'Small bowel left', lx: 330, ly: 236 }] } },
          { t: 'Lifting the ileocolic pedicle', d: 'The assistant pulls the cecum laterally and down. The pedicle bowstrings. Open the peritoneum just beneath the pedicle.', tip: 'The bowstring shows best when you pull toward the right foot.', danger: 'Too high and you’re in the mesentery, which bleeds. Too deep and you’re in the retroperitoneum.', nurse: 'Scissors with diathermy or an energy device.', fig: { base: 'rhc-vessels', hl: ['ica', 'icv', 'cecum', 'meso'], marks: [{ t: 'arrow', x1: 72, y1: 252, x2: 30, y2: 286, label: 'Pull to right foot', lx: 90, ly: 296 }, { t: 'path', d: 'M110 250 C150 252 190 248 216 246' }] } },
          { t: 'Medial-to-lateral dissection', d: 'Advance in the avascular plane between the mesentery and the retroperitoneum. Push the duodenum and pancreatic head down and back.', tip: 'The right plane looks soft and pale. Advance laterally and up, under the hepatic flexure.', danger: 'The ureter and gonadal vessels must stay behind. If they come up with the mesentery, you’ve left the plane.', nurse: 'Suction ready, gentle grasper.', fig: { base: 'rhc-vessels', hl: ['duod', 'panc', 'ureter', 'gonad', 'meso'], marks: [{ t: 'zone', x: 120, y: 190, rx: 52, ry: 40, tone: 'safe', label: 'Toldt’s plane' }, { t: 'zone', x: 136, y: 270, rx: 22, ry: 18, tone: 'danger' }] } },
          { t: 'High ligation of the ileocolic vessels', d: 'Isolate the artery and vein at their root beside the SMV. Divide between clips or with an energy device.', tip: 'See the SMV before you ligate. In cancer, ligation at the root adds lymph nodes.', danger: 'Ligating too close to the SMV, or tearing the vein, causes bleeding that’s hard to control laparoscopically.', nurse: 'Locking clips (Hem-o-lok) or a vascular stapler, energy device.', fig: { base: 'rhc-vessels', hl: ['ica', 'icv', 'smv', 'sma', 'node'], marks: [{ t: 'clip', x: 212, y: 232, a: 0 }, { t: 'clip', x: 204, y: 232, a: 0 }, { t: 'clip', x: 184, y: 233, a: 0 }, { t: 'cut', x1: 194, y1: 218, x2: 194, y2: 248 }] } },
          { t: 'Right branch of the middle colic and the trunk of Henle', d: 'Continue up along the SMV. Ligate the right colic artery if present and the right branch of the middle colic.', tip: 'Identify the superior right colic vein entering the trunk of Henle and ligate it before pulling on the flexure.', danger: 'Pulling the flexure before you control the trunk of Henle tears it below the pancreas.', nurse: 'Medium clips, energy device.', fig: { base: 'rhc-vessels', hl: ['mca', 'henle', 'rca', 'smv', 'panc'], marks: [{ t: 'clip', x: 210, y: 76, a: 70 }, { t: 'clip', x: 200, y: 99, a: 50 }, { t: 'zone', x: 200, y: 106, rx: 26, ry: 18, tone: 'danger', label: 'Henle', ly: 136 }] } },
          { t: 'Lateral release and hepatic flexure', d: 'Head up. Separate the omentum from the transverse colon, enter the lesser sac and release the hepatic flexure and the white line along the ascending colon.', tip: 'When the medial dissection is complete, the lateral release is quick and safe.', danger: 'The duodenum and gallbladder are close while you release the flexure.', nurse: 'Energy device (Harmonic or LigaSure).', fig: { base: 'rhc-vessels', hl: ['colon', 'duod'], marks: [{ t: 'path', d: 'M40 220 C30 170 36 110 56 72', tone: 'solid' }, { t: 'arrow', x1: 70, y1: 120, x2: 120, y2: 120, label: 'Medial', lx: 104, ly: 110 }] } },
          { t: 'Extraction and anastomosis', d: 'Extend the periumbilical incision with a wound protector, deliver the bowel, divide the ileum and transverse colon with a stapler and make a side-to-side anastomosis.', tip: 'Check the blood supply of both ends before joining them. No tension and no twist in the mesentery.', danger: 'An anastomosis on bowel with marginal blood supply or under tension is the main cause of leak.', nurse: 'Wound protector, linear stapler 60–80 mm (blue load), 3-0 suture for reinforcing stitches.', fig: { base: 'ileocolic-anast', hl: ['ileum', 'colon', 'ent'], marks: [{ t: 'staple', pts: ['150 144', '300 144'] }, { t: 'staple', pts: ['334 92', '334 210'] }] } },
          { t: 'Check and close', d: 'Return the bowel, check hemostasis, check the orientation of the mesentery and close the fascia.', tip: 'For a large extraction incision, close with small bites.', danger: 'A twisted anastomosis, or small bowel caught under the mesentery.', nurse: 'Slowly absorbable suture for the fascia, skin closure.', fig: { view: 'access', over: { target: { x: 150, y: 205, rx: 26, ry: 32, label: 'Extraction' } } } }
        ],
        equipment: [
          { cat: 'Optics and access', items: ['10 mm 30° scope.', 'Two 12 mm ports and two 5 mm ports.', 'Wound protector for the extraction incision.'], alt: ['Hand-assist port in a difficult case', '5 mm scope'] },
          { cat: 'Energy and dissection', items: ['Advanced bipolar sealing or ultrasonic device.', 'Scissors with diathermy.', 'Atraumatic bowel graspers.'], alt: ['LigaSure', 'Harmonic', 'Thunderbeat'] },
          { cat: 'Vessels', items: ['Locking polymer clips for the pedicles.', 'Vascular stapler (white or gray load).'], alt: ['Intracorporeal tie', 'Metal clips on small vessels'] },
          { cat: 'Anastomosis', items: ['Linear stapler 60–80 mm, blue load for bowel.', 'A load for closing the common enterotomy.', 'Absorbable 3-0 suture for reinforcing stitches.'], alt: ['Two-layer hand-sewn anastomosis', 'Intracorporeal anastomosis with a laparoscopic stapler'] },
          { cat: 'Imaging', items: ['Optional ICG to check perfusion of the ends.'] },
          { cat: 'Closure', items: ['Slowly absorbable suture (PDS) 0 or 1 for the fascia.', '4-0 suture for skin.'] }
        ],
        pitfalls: [
          { p: 'Drifting out of the plane posteriorly', fix: 'If the ureter or gonadal vessels come up, go back anteriorly and restart just beneath the pedicle.' },
          { p: 'Lifting the duodenum with the mesentery', fix: 'Identify the duodenum early and push it back with blunt dissection.' },
          { p: 'Bleeding from the trunk of Henle', fix: 'Press with a small gauze inside the abdomen, suction, and work calmly. Convert early if you can’t control it.' },
          { p: 'Tumor not found', fix: 'Preoperative tattoo or intraoperative colonoscopy.' },
          { p: 'Anastomosis under tension or twisted', fix: 'Release the flexure further and check the mesentery before firing the stapler.' }
        ]
      },
      {
        key: 'robotic', kind: 'robotic', label: 'Robotic', inherit: 'lap',
        deltas: ['Ports in a diagonal line on the left abdomen, 6–8 cm apart.', 'Intracorporeal anastomosis with a robotic stapler and sutured closure of the common enterotomy.', 'Extraction through a Pfannenstiel incision with a wound protector: fewer hernias than a midline incision.', 'ICG imaging to check perfusion of the ends before division.', 'The third arm holds the mesentery under steady tension during the dissection near the SMV.', 'Intracorporeal anastomosis needs a good bowel prep and minimal spillage.'],
        setup: {
          position: { kind: 'supine', tilt: -12, roll: 'left', pressure: ['occiput', 'elbow', 'sacrum', 'heel', 'face'] },
          room: { arms: { R: 'tucked', L: 'tucked' }, legs: 'together', staff: [{ w: 'B', s: 'Lt3' }, { w: 'N', s: 'LtFoot' }], monitors: ['LtFar1'], robot: { s: 'RtFar2' }, console: true },
          notes: ['Supine, both arms tucked.', 'Head down and left side down before docking.', 'Don’t change position while the robot is docked, unless the table is integrated.'],
          arms: ['Both arms tucked and padded.'],
          team: ['Robot cart on the patient’s right.', 'Bedside assistant on the left, at the assistant port.', 'Surgeon at the console.']
        },
        access: {
          target: { x: 88, y: 210, rx: 40, ry: 54, label: 'Right colon' },
          ports: [
            { x: 214, y: 112, mm: 8, role: 'robot', label: 'Left upper. Arm 1', n: 1 },
            { x: 204, y: 168, mm: 8, role: 'camera', label: 'Left of umbilicus. Camera', n: 2 },
            { x: 196, y: 228, mm: 12, role: 'robot', label: 'Left lower. Arm 3 and robotic stapler', n: 3 },
            { x: 186, y: 290, mm: 8, role: 'robot', label: 'Left suprapubic. Arm 4', n: 4 },
            { x: 252, y: 196, mm: 12, role: 'assist', label: 'Left lateral. Assistant port', n: 'A' }
          ],
          incisions: [{ id: 'pfannenstiel', label: 'Extraction: Pfannenstiel', lx: 150, ly: 328 }],
          notes: ['The line is built facing the cecum and hepatic flexure.', 'About 15–20 cm from the target.'],
          docking: ['Target the SMV and the ileocolic pedicle.', 'Dock from the patient’s right side.', 'Check that no arm presses on the thighs or the face.']
        }
      },
      {
        key: 'open', kind: 'open', label: 'Open',
        setup: {
          position: { kind: 'supine', tilt: 0, pressure: ['occiput', 'elbow', 'sacrum', 'heel'] },
          room: { arms: { R: 'out', L: 'out' }, legs: 'together', staff: [{ w: 'S', s: 'Rt2' }, { w: 'A', s: 'Lt2' }, { w: 'N', s: 'RtFoot' }] },
          notes: ['Supine.', 'Self-retaining retractor set up before the incision.'],
          arms: ['Both arms out to 90°.'],
          team: ['Surgeon on the patient’s right, assistant on the left.']
        },
        access: {
          target: { x: 88, y: 210, rx: 40, ry: 54, label: 'Right colon' },
          incisions: [{ id: 'midline-peri', label: 'Periumbilical midline incision', lx: 172, ly: 140 }, { id: 'transverse-RUQ', label: 'Right transverse incision', alt: true, lx: 100, ly: 160 }],
          notes: ['A right transverse incision gives good exposure and less pain in some patients.', 'Obstruction or suspected metastases: midline.']
        },
        steps: [
          { t: 'Opening and survey', d: 'Open, survey the liver and peritoneum and set up a self-retaining retractor.', tip: 'Palpating the liver and the tumor sets the extent of the resection.', fig: { view: 'access' } },
          { t: 'Lateral release', d: 'Open the white line along the ascending colon and lift the colon and mesentery medially, off the duodenum.', tip: 'Lift in Toldt’s plane, with a hand under the mesentery.', danger: 'The ureter and duodenum must stay behind.', fig: { base: 'rhc-vessels', hl: ['colon', 'cecum', 'duod', 'ureter'], marks: [{ t: 'path', d: 'M36 230 C26 170 34 110 54 70', tone: 'solid' }, { t: 'arrow', x1: 60, y1: 160, x2: 120, y2: 160, label: 'Lift medially', lx: 104, ly: 150 }] } },
          { t: 'Vessel ligation', d: 'Double-ligate the ileocolic artery, the right colic and the right branch of the middle colic, close to their root.', tip: 'Feeling the SMA pulse helps you orient.', danger: 'The trunk of Henle while taking down the flexure.', fig: { base: 'rhc-vessels', hl: ['ica', 'mca', 'rca', 'smv'], marks: [{ t: 'clip', x: 206, y: 232 }, { t: 'clip', x: 212, y: 78, a: 70 }] } },
          { t: 'Anastomosis', d: 'Stapled side-to-side or hand-sewn ileocolic anastomosis.', tip: 'Check the color of the ends and the orientation of the mesentery before joining.', fig: { base: 'ileocolic-anast', hl: ['ileum', 'colon'], marks: [{ t: 'staple', pts: ['150 144', '300 144'] }, { t: 'staple', pts: ['334 92', '334 210'] }] } },
          { t: 'Closure', d: 'Irrigate as needed and close the fascia with small bites.', tip: 'Close the fascia with a suture length to wound length ratio of 4 to 1.', fig: { view: 'access' } }
        ],
        equipment: [
          { cat: 'Opening', items: ['Laparotomy set.', 'Self-retaining retractor (Bookwalter or Omni).', 'Wound protector.'] },
          { cat: 'Dissection and ligation', items: ['Diathermy, Metzenbaum scissors, right-angle forceps.', '2-0 and 3-0 ties.'], alt: ['Bipolar sealing device', 'Vascular stapler'] },
          { cat: 'Anastomosis', items: ['GIA linear stapler 60–80 mm and a TA stapler for closure.'], alt: ['Two-layer hand-sewn'] },
          { cat: 'Closure', items: ['Slowly absorbable suture for the fascia.'] }
        ]
      }
    ],
    compare: {
      rows: [
        { k: 'When to choose', v: { lap: 'Default when expertise is available', robotic: 'Intracorporeal anastomosis, obesity, central dissection', open: 'Invasive tumor, obstruction, unstable patient' }, best: 'lap' },
        { k: 'Pain and stay', v: { lap: 'Less pain, short stay', robotic: 'Similar to laparoscopy', open: 'More pain and a longer stay' } },
        { k: 'Oncologic outcome', v: { lap: 'Equivalent when principles are kept', robotic: 'Equivalent', open: 'Equivalent' } },
        { k: 'Anastomosis', v: { lap: 'Usually extracorporeal', robotic: 'Usually intracorporeal', open: 'Open, stapled or sutured' } },
        { k: 'Extraction incision', v: { lap: 'Periumbilical', robotic: 'Pfannenstiel', open: 'The incision itself' } },
        { k: 'Cost', v: { lap: 'Moderate', robotic: 'High', open: 'Low in the OR, high for the stay' } }
      ],
      note: 'This comparison is qualitative, not based on institutional data.'
    },
    bailout: ['Change position and traction, add a port and call a senior.', 'Switch to a lateral-to-medial approach when the medial plane is unclear.', 'Hand-assist through the extraction incision.', 'Convert to a small incision to finish the dissection and the vessels.', 'Full conversion for uncontrolled bleeding or an invasive tumor.', 'Anastomosis with a diverting ileostomy, or an end ileostomy without anastomosis in an unstable patient.'],
    intraop: [
      { c: 'Bleeding from the SMV or the trunk of Henle', do: 'Immediate pressure with a grasper or gauze, tell anesthesia, suction and add a port. No blind clips. Convert if you can’t control it.' },
      { c: 'Duodenal injury', do: 'Identify it, repair with sutures and sometimes cover with omentum. Repair a thermal injury even if it’s small.' },
      { c: 'Ureteric injury', do: 'Recognize it during the operation, call urology, repair and stent.' },
      { c: 'Tumor invading an adjacent organ', do: 'En bloc resection or conversion. Don’t separate the tumor from the organ.' },
      { c: 'Bowel end with poor blood supply', do: 'Resect further back to bleeding tissue or as guided by ICG.' }
    ],
    postop: {
      care: ['ERAS protocol: fluids on the day of surgery, early diet, early mobilization.', 'Multimodal analgesia with minimal opioids.', 'No routine nasogastric tube.', 'Early catheter removal.', 'Watch for signs of leak on days 3–7.'],
      complications: [
        { c: 'Anastomotic leak', d: 'Fever, tachycardia, increasing pain, rising CRP or failure to progress. Contrast CT. Drainage or reoperation as needed.' },
        { c: 'Ileus', d: 'Nausea and vomiting, distended abdomen. Nasogastric tube as needed, correct electrolytes.' },
        { c: 'Wound infection', d: 'Mainly in the extraction incision. Open and drain.' },
        { c: 'Bleeding', d: 'From the staple line (rectal bleeding) or into the abdomen. Usually settles. Intervene according to stability.' },
        { c: 'Diarrhea', d: 'After removal of the ileocecal valve. Usually improves with time.' }
      ]
    },
    quiz: [
      { q: 'What is the main vessel ligated in a right hemicolectomy?', a: ['Inferior mesenteric artery', 'Ileocolic artery', 'Gastroduodenal artery', 'Splenic artery'], c: 1, why: 'The ileocolic artery arises from the SMA and supplies the cecum. Ligate it at its root.' },
      { q: 'What is the medial landmark of the dissection in the medial-to-lateral approach?', a: ['Right ureter', 'Gallbladder', 'SMV', 'Stomach'], c: 2, why: 'The SMV is the medial border. High ligation is done beside it.' },
      { q: 'Which structure must stay behind while you lift the mesentery?', a: ['Duodenum', 'Transverse colon', 'Omentum', 'Liver'], c: 0, why: 'The duodenum and pancreatic head are pushed back. The ureter and gonadal vessels stay in the retroperitoneum.' },
      { q: 'What is the minimum number of lymph nodes for reliable N staging?', a: ['4', '8', '12', '20'], c: 2, why: 'The specimen should contain at least 12 nodes.' },
      { q: 'What is the dangerous source of bleeding while taking down the hepatic flexure?', a: ['Renal artery', 'Gastrocolic trunk of Henle', 'Splenic vein', 'Celiac artery'], c: 1, why: 'Strong traction on the flexure tears the trunk of Henle below the pancreatic head.' }
    ],
    sources: [
      { b: 'CST14', ref: 'Current Surgical Therapy 14, chapter: Surgical Management of Colon Cancer, pp. 251–255.' },
      { b: 'CST14', ref: 'Current Surgical Therapy 14, chapter: Preoperative Bowel Preparation: Is It Necessary?, pp. 177–180.' },
      { b: 'SAB22', ref: 'Sabiston 22, chapter 95: Colon and Rectum, from p. 1429.' },
      { b: 'SAB22', ref: 'Sabiston 22, chapter 96: Cancers of the Colon, Rectum, and Anus, from p. 1491.' },
      { b: 'SAB22', ref: 'Sabiston 22, chapter 22: Enhanced Recovery After Surgery (ERAS), from p. 74.' },
      { b: 'GL', ref: 'ASCRS guidelines for the management of colon cancer, 2022.' },
      { b: 'GL', ref: 'ERAS Society guidelines for elective colorectal surgery, 2018.' }
    ],
    gaps: ['No technical detail yet for an extended resection for hepatic flexure tumors.', 'Variations of the middle colic and the trunk of Henle are shown only briefly.', 'Intracorporeal anastomosis is described only as a difference, without separate step cards.']
  });
})();
