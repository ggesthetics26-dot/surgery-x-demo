/* ORBIT · Inguinal hernia repair: Lichtenstein, TAPP, TEP, robotic TAPP.
   Facts checked against CST14 (Management of Inguinal Hernia, pp. 663–667) and Sabiston 22 ch. 82. Text is original and short. */
(function () {
  var O = window.ORBIT;

  /* ---------- base 1: right myopectineal orifice, laparoscopic (posterior) view. Lateral = screen left, medial = screen right ---------- */
  O.base('mpo-post', 'Right myopectineal orifice, laparoscopic posterior view', function () {
    return '' +
      '<rect data-k="wall" class="a-perit" x="0" y="0" width="400" height="300"/>' +
      '<path data-k="pain" d="M140 178 L108 300 L0 300 L0 176 Z" fill="rgba(232,218,98,.22)" stroke="rgba(190,170,40,.7)" stroke-dasharray="4 4"/>' +
      '<path data-k="psoas" class="a-muscle" d="M0 214 C50 204 92 214 120 236 L104 300 L0 300 Z" opacity=".55"/>' +
      '<path data-k="doom" d="M150 170 L110 300 L258 300 Z" fill="rgba(194,59,43,.13)" stroke="rgba(194,59,43,.6)" stroke-dasharray="4 4"/>' +
      '<path data-k="cooper" class="a-bone" d="M246 258 C290 250 340 252 392 262 L392 276 C340 268 292 268 248 272 Z"/>' +
      '<path data-k="mul" class="a-fascia" d="M292 0 L314 0 C320 80 344 168 376 226 L358 234 C328 178 304 86 292 0 Z"/>' +
      '<path data-k="ipt" class="a-fascia" d="M10 160 C110 168 200 182 300 198 L300 209 C200 193 110 179 10 171 Z"/>' +
      '<path data-k="eia" class="a-art" d="M178 300 C186 272 196 242 206 214" style="stroke-width:9"/>' +
      '<path data-k="eiv" class="a-vein" d="M198 300 C207 272 216 246 224 216" style="stroke-width:11"/>' +
      '<g data-k="iev"><path class="a-vein" d="M202 214 C206 160 214 100 226 14" style="stroke-width:2.6"/><path class="a-art" d="M212 214 C216 160 224 100 236 14" style="stroke-width:4"/><path class="a-vein" d="M222 216 C226 160 234 100 246 14" style="stroke-width:2.6"/></g>' +
      '<path data-k="corona" class="a-art" d="M222 236 C248 246 270 256 292 282" style="stroke-width:3"/>' +
      '<ellipse data-k="ring" cx="150" cy="150" rx="26" ry="19" fill="rgba(24,34,46,.55)"/>' +
      '<ellipse data-k="direct" cx="268" cy="148" rx="30" ry="25" fill="rgba(24,34,46,.18)" stroke="rgba(24,34,46,.45)" stroke-dasharray="4 3"/>' +
      '<ellipse data-k="femoral" cx="246" cy="234" rx="13" ry="9" fill="rgba(24,34,46,.4)"/>' +
      '<g data-k="gon"><path class="a-vein" d="M146 170 C136 220 124 260 110 300" style="stroke-width:2.6"/><path class="a-vein" d="M154 172 C146 220 134 262 122 300" style="stroke-width:2.6"/></g>' +
      '<g data-k="vas"><path class="a-ureterO" d="M152 168 C172 212 206 252 262 300" style="stroke-width:8"/><path class="a-ureter" d="M152 168 C172 212 206 252 262 300" style="stroke-width:5.5"/></g>' +
      '<g data-k="nerves"><path class="a-nerve" d="M40 182 C36 222 30 262 24 300" style="stroke-width:3"/><path class="a-nerve" d="M96 190 C92 232 86 262 80 300" style="stroke-width:3"/></g>' +
      '<text class="lbl s" x="248" y="44">Inf. epigastric</text>' +
      '<text class="lbl s" x="128" y="122">Int. ring</text>' +
      '<text class="lbl s" x="268" y="112" text-anchor="middle">Direct</text>' +
      '<text class="lbl s" x="40" y="156">Iliopubic tract</text>' +
      '<text class="lbl s" x="300" y="248">Cooper</text>' +
      '<text class="lbl s" x="234" y="290">Vas</text>' +
      '<text class="lbl s" x="96" y="282">Gonadal</text>' +
      '<text class="lbl s" x="190" y="232">EIA/EIV</text>' +
      '<text class="lbl s" x="330" y="120">MUL</text>' +
      '<text class="lbl s" x="8" y="244">LFCN</text>' +
      '<text class="lbl s" x="262" y="226">Femoral</text>';
  });

  /* ---------- base 2: right inguinal canal, anterior (open) view. Lateral = screen left, medial = screen right ---------- */
  O.base('canal-ant', 'Right inguinal canal, anterior view (open approach)', function () {
    return '' +
      '<rect class="a-fat" x="0" y="0" width="400" height="300"/>' +
      '<path data-k="eo" class="a-fascia" d="M0 0 L400 0 L400 38 C300 58 150 66 0 48 Z"/>' +
      '<path data-k="io" class="a-muscle" d="M0 48 C150 66 300 58 400 38 L400 146 C300 166 200 162 120 148 C70 140 30 140 0 150 Z"/>' +
      '<path data-k="floor" class="a-fascia" d="M120 148 C200 162 300 166 400 146 L400 214 C320 226 220 216 120 196 C100 192 96 170 120 148 Z" opacity=".8"/>' +
      '<path data-k="iev" class="a-art" d="M140 236 C138 196 134 152 130 108" style="stroke-width:3;stroke-dasharray:5 4;opacity:.7"/>' +
      '<path data-k="lig" class="a-fascia" d="M0 222 C120 232 250 246 400 262 L400 300 L0 300 Z"/>' +
      '<path data-k="shelf" class="a-line" d="M0 222 C120 232 250 246 400 262" style="stroke-width:3"/>' +
      '<g data-k="cord"><path d="M88 170 C160 176 260 192 322 224 C346 238 356 262 360 300" fill="none" stroke="var(--a-stroke)" stroke-width="32" stroke-linecap="round"/><path d="M88 170 C160 176 260 192 322 224 C346 238 356 262 360 300" fill="none" stroke="var(--a-perit)" stroke-width="29" stroke-linecap="round"/></g>' +
      '<g data-k="gf"><path class="a-vein" d="M96 182 C170 190 268 206 326 236 C340 246 348 262 350 300" style="stroke-width:3"/><path class="a-nerve" d="M98 186 C172 194 266 210 322 240" style="stroke-width:1.8"/></g>' +
      '<path data-k="ii" class="a-nerve" d="M40 150 C120 158 230 168 306 200 C332 214 344 240 346 300" style="stroke-width:3.5"/>' +
      '<circle data-k="tub" class="a-bone" cx="384" cy="258" r="12"/>' +
      '<path data-k="ih" class="a-nerve" d="M20 96 C140 108 260 114 384 112" style="stroke-width:3.5"/>' +
      '<text class="lbl s" x="12" y="26">Ext. oblique aponeurosis (cut)</text>' +
      '<text class="lbl s" x="12" y="76">Internal oblique</text>' +
      '<text class="lbl s" x="250" y="104">Iliohypogastric n.</text>' +
      '<text class="lbl s" x="150" y="150">Ilioinguinal n.</text>' +
      '<text class="lbl s" x="200" y="186">Spermatic cord</text>' +
      '<text class="lbl s" x="160" y="240">Genital br. + ext. spermatic v.</text>' +
      '<text class="lbl s" x="20" y="214">Shelving edge</text>' +
      '<text class="lbl s" x="392" y="290" text-anchor="end">Pubic tubercle</text>' +
      '<text class="lbl s" x="66" y="190">Int. ring</text>' +
      '<text class="lbl s" x="300" y="156">Floor (TF)</text>';
  });

  O.cover('inguinal-hernia', function () {
    return '<path class="f-t2" d="M40 150 C70 80 170 60 270 90 L270 170 L40 170 Z" opacity=".55"/>' +
      '<path class="s-w" d="M30 120 C120 128 200 140 290 156" stroke-width="5"/>' +
      '<path class="s-r" d="M176 190 C180 140 186 90 196 30" stroke-width="4"/>' +
      '<ellipse cx="128" cy="112" rx="22" ry="16" class="c-n" stroke="#fff" stroke-width="2"/>' +
      '<ellipse cx="236" cy="108" rx="24" ry="20" fill="none" stroke="#3DD6A3" stroke-width="2" stroke-dasharray="4 4"/>' +
      '<path class="s-g" d="M130 128 C146 160 170 180 210 196" stroke-width="5"/>' +
      '<path class="s-t" d="M24 62 L296 62 L296 186 L24 186 Z" stroke-width="2" stroke-dasharray="6 5"/>' +
      '<text x="30" y="52" class="c-w" style="font:700 14px Inter,sans-serif;letter-spacing:.06em">MPO</text>';
  });

  O.register({
    id: 'inguinal-hernia',
    title: 'Inguinal hernia repair',
    title_en: 'Inguinal hernia repair (Lichtenstein · TAPP · TEP · robotic)',
    system: 'hernia', organ: 'Groin', difficulty: 2, setting: 'Elective and emergency',
    tags: ['hernia', 'groin', 'inguinal', 'hernia', 'Lichtenstein', 'TAPP', 'TEP', 'mesh', 'mesh', 'MPO', 'triangle of doom', 'femoral'],
    student: {
      summary: 'Closing a weakness in the groin wall with mesh. You can approach from the front, through the inguinal canal (Lichtenstein), or from behind, in the preperitoneal space (TAPP, TEP or robotic). The goal is the same: a mesh that covers the whole myopectineal orifice without tension.',
      points: ['An indirect hernia exits lateral to the inferior epigastric vessels, a direct hernia medial to them.', 'Triangle of doom: the external iliac vessels, between the vas and the gonadal vessels. No energy and no fixation.', 'Triangle of pain: nerves below the iliopubic tract. No fixation.', 'Chronic pain is the most common complication. Protecting the nerves prevents it.']
    },
    overview: {
      facts: [{ v: '27–43%', l: 'Lifetime risk in men (Sabiston)' }, { v: '11–18%', l: 'Chronic pain beyond 3 months' }, { v: '≥10×15 cm', l: 'Usual mesh size, posterior approach' }, { v: '≥2 cm', l: 'Overlap beyond the pubic tubercle, open approach' }],
      indications: ['Symptomatic hernia.', 'In a man with minimal symptoms: watchful waiting is a reasonable option, but most will come to surgery.', 'In a woman: watchful waiting is not recommended, because of the high rate of femoral hernia.', 'Incarcerated or strangulated hernia: emergency surgery.'],
      contraindications: ['Unable to tolerate general anesthesia: an open approach under local anesthesia is preferred.', 'Relative, for a posterior approach: previous surgery in the space of Retzius (prostatectomy), pelvic radiation.', 'Relative, for an open approach: recurrence after an anterior repair.'],
      choice: ['The surgeon’s experience matters a lot. All mesh approaches give good results in experienced hands.', 'Posterior approach preferred: bilateral hernia, recurrence after an anterior repair, women (the femoral orifice is visible).', 'Open approach preferred: recurrence after a posterior repair, local anesthesia, a patient with high anesthetic risk.', 'Between TEP and TAPP: patient factors and surgical history. TAPP gives a view of the hernia contents and the other side.', 'Robotic: usually TAPP. Convenient for large hernias, recurrences and peritoneal closure. Higher cost.']
    },
    anatomy: {
      figures: [
        { base: 'mpo-post', hotspots: [
          { x: 182, y: 268, label: 'Triangle of doom', text: 'Between the vas medially and the gonadal vessels laterally. It contains the external iliac artery and vein. No diathermy, no fixation devices and no blind traction.' },
          { x: 58, y: 236, label: 'Triangle of pain', text: 'Below the iliopubic tract and lateral to the gonadal vessels. The lateral femoral cutaneous nerve and the femoral branch of the genitofemoral nerve run here. Leave the fat over the nerves and don’t fix here.' },
          { x: 282, y: 250, label: 'Corona mortis', text: 'A vessel connecting the inferior epigastric and obturator systems, crossing Cooper’s ligament. If torn, it bleeds into the pelvis. Identify it before fixing to the ligament.' },
          { x: 232, y: 74, label: 'Inferior epigastric vessels', text: 'The boundary between indirect (lateral) and direct (medial) hernias. Keep them up against the abdominal wall; don’t take them down.' },
          { x: 116, y: 150, label: 'Internal ring and indirect hernia', text: 'An indirect sac is separated from the cord structures and reduced until the vas and gonadal vessels lie flat (parietalization).' },
          { x: 300, y: 158, label: 'Direct space (Hesselbach)', text: 'In a direct hernia, reduce the sac and fat out of the defect. The thinned transversalis fascia (pseudo-sac) stays on the wall.' },
          { x: 352, y: 280, label: 'Cooper’s ligament and space of Retzius', text: 'Part of the critical view of the MPO: expose the pubic tubercle past the midline and Cooper’s ligament. Leave at least 2 cm between Cooper’s ligament and the bladder.' },
          { x: 246, y: 210, label: 'Femoral orifice', text: 'Medial to the external iliac vein and below the iliopubic tract. Check it in every posterior repair, especially in women.' }
        ] },
        { base: 'canal-ant', hotspots: [
          { x: 120, y: 160, label: 'Ilioinguinal nerve', text: 'Runs on the cord, under the external oblique aponeurosis. Identify it as soon as the aponeurosis is opened and protect it.' },
          { x: 230, y: 122, label: 'Iliohypogastric nerve', text: 'On the internal oblique muscle. At risk from the upper mesh sutures.' },
          { x: 282, y: 214, label: 'Genital branch of the genitofemoral nerve', text: 'Inside the cord, next to the external spermatic vein (the blue line). Injury is a source of chronic pain.' },
          { x: 380, y: 232, label: 'Pubic tubercle', text: 'The mesh overlaps it by at least 2 cm. Don’t suture into the periosteum, to avoid pain and osteitis.' },
          { x: 80, y: 236, label: 'Shelving edge', text: 'The lower edge of the mesh is sutured to it with a running suture, from the tubercle to beyond the internal ring.' },
          { x: 330, y: 180, label: 'The floor: transversalis fascia', text: 'The posterior wall of the canal. It bulges in a direct hernia. The mesh reinforces it from the front without tension.' }
        ] }
      ],
      landmarks: [
        { name: 'Inferior epigastric vessels', why: 'Distinguish indirect from direct. The first landmark in every posterior repair.' },
        { name: 'Triangle of doom and triangle of pain', why: 'No fixation and no energy. Major vessels and nerves.' },
        { name: 'Cooper’s ligament and the pubic tubercle', why: 'Medial anchor of the mesh. Needed for the critical view of the MPO.' },
        { name: 'Iliopubic tract', why: 'The lower limit for lateral fixation. The nerves lie below it.' },
        { name: 'The three nerves in the anterior approach', why: 'Ilioinguinal, iliohypogastric and the genital branch. Identifying and protecting them reduces chronic pain.' }
      ]
    },
    preop: {
      workup: ['Clinical diagnosis in most cases.', 'Ultrasound when the examination is unclear. A woman with groin pain may need MRI.', 'Examine the other side.', 'Anesthesia workup by age and comorbidities.'],
      consent: ['Chronic groin pain.', 'Recurrence.', 'Seroma or hematoma, mesh infection.', 'Injury to the cord and testis (atrophy is rare), injury to the bladder or bowel in a posterior approach.', 'Urinary retention.', 'Conversion to another approach.'],
      antibiotics: ['One dose before incision per local protocol (cefazolin 2 g, 3 g above 120 kg) when mesh is implanted.', 'Strangulated hernia with bowel resection: treat according to the infection.'],
      vte: ['Short operation and early mobilization: mechanical prophylaxis.', 'Pharmacological prophylaxis by risk (Caprini).'],
      bowelPrep: ['Not required.'],
      special: ['Void before surgery. Catheter only for a long operation.', 'Stop smoking and control glucose before elective surgery.', 'Anticoagulants: plan per local guidance. An open approach under local anesthesia is possible.', 'Incarcerated hernia: a posterior approach lets you see the bowel and assess viability.']
    },
    approaches: [
      {
        key: 'tapp', kind: 'lap', label: 'TAPP',
        setup: {
          position: { kind: 'supine', tilt: -15, pressure: ['occiput', 'elbow', 'sacrum', 'heel'] },
          room: { arms: { R: 'tucked', L: 'tucked' }, legs: 'together', staff: [{ w: 'S', s: 'Lt2' }, { w: 'C', s: 'Lt1' }, { w: 'N', s: 'RtFoot' }], monitors: ['foot'] },
          notes: ['Supine in 10–15° Trendelenburg.', 'Slight tilt away from the hernia side.', 'Empty bladder.', 'For a right hernia the surgeon stands on the left.'],
          arms: ['Both arms tucked and padded, so the surgeon and camera have room.'],
          team: ['Surgeon on the side opposite the hernia, camera beside them toward the head.', 'One monitor at the foot of the table.', 'For a bilateral hernia the surgeon changes sides, or works both sides from one position.']
        },
        access: {
          target: { x: 100, y: 300, rx: 40, ry: 26, label: 'Right groin' },
          ports: [
            { x: 150, y: 205, mm: 12, role: 'camera', label: 'Umbilical. 30° camera and mesh insertion', n: 1 },
            { x: 86, y: 216, mm: 5, role: 'work', label: 'Right, about 6 cm lateral and slightly below the umbilicus', n: 2 },
            { x: 214, y: 216, mm: 5, role: 'work', label: 'Left, mirror of port 2', n: 3 }
          ],
          notes: ['Pneumoperitoneum at 12–15 mmHg.', 'An existing umbilical hernia can be used for entry and closed in the same operation.', 'An angled scope makes work under the abdominal wall easier.']
        },
        steps: [
          { t: 'Entry and survey of both sides', d: 'Entry at the umbilicus, reduce the hernia contents if needed and survey both groins.', tip: 'Identify before cutting: inferior epigastric vessels, vas, gonadal vessels and the medial umbilical ligament.', danger: 'Incarcerated bowel: gentle traction only and assess viability before going on.', nurse: '30° scope, a 12 mm port and two 5 mm ports.', fig: { view: 'access' } },
          { t: 'Open the peritoneal flap', d: 'Incise the peritoneum at least 4 cm above the internal ring, from lateral to the ASIS to the medial umbilical ligament.', tip: 'A high, wide flap makes it easier to cover the mesh and close the peritoneum at the end.', danger: 'The inferior epigastric vessels lie close to the medial incision. Stay above them.', nurse: 'Laparoscopic scissors with diathermy, atraumatic grasper.', fig: { base: 'mpo-post', hl: ['wall', 'iev', 'mul'], marks: [{ t: 'cut', x1: 20, y1: 96, x2: 300, y2: 70 }, { t: 'label', x: 160, y: 66, text: 'At least 4 cm above the ring', tone: 'info' }] } },
          { t: 'Medial dissection: Retzius and Cooper', d: 'Develop the space in front of the bladder to the pubic tubercle past the midline and expose Cooper’s ligament.', tip: 'In a large direct hernia continue to the opposite Cooper’s ligament so the mesh overlaps.', danger: 'Tearing the corona mortis over Cooper’s ligament. Bladder injury when the dissection is too deep.', nurse: 'Suction available, clips for small vessels.', fig: { base: 'mpo-post', hl: ['cooper', 'corona', 'direct', 'mul'], marks: [{ t: 'zone', x: 330, y: 250, rx: 60, ry: 28, tone: 'safe', label: 'Retzius' }, { t: 'arrow', x1: 300, y1: 200, x2: 360, y2: 244 }] } },
          { t: 'Reduce a direct hernia', d: 'Pull the sac and fat out of the direct space. The thinned transversalis fascia stays on the wall.', tip: 'In a large direct defect you can tack the thinned fascia back (suture or loop) to reduce seroma.', danger: 'Pulling the fascia with the sac opens the space and creates a larger defect.', nurse: 'An extra grasper, endoloop or suture on request.', fig: { base: 'mpo-post', hl: ['direct', 'iev'], marks: [{ t: 'arrow', x1: 268, y1: 148, x2: 300, y2: 210, label: 'Sac out', lx: 334, ly: 210 }] } },
          { t: 'Lateral dissection', d: 'Develop the lateral space until you see the psoas muscle, below the iliopubic tract.', tip: 'The thin layer of fascia and fat over the nerves stays in place.', danger: 'Triangle of pain: diathermy or traction here injures the nerves.', nurse: 'Atraumatic grasper, no additional energy.', fig: { base: 'mpo-post', hl: ['pain', 'nerves', 'psoas', 'ipt'], marks: [{ t: 'zone', x: 54, y: 250, rx: 46, ry: 40, tone: 'danger', label: 'No diathermy' }] } },
          { t: 'Indirect hernia and cord structures', d: 'Separate the indirect sac from the vas and gonadal vessels and reduce it, until the structures lie flat on the wall (parietalization). Reduce any cord lipoma too.', tip: 'Sign of adequate dissection: pulling the peritoneum no longer moves the cord structures.', danger: 'Triangle of doom: work close to the sac, not between the vas and the gonadal vessels.', nurse: 'Two graspers, an endoloop for a long sac that is divided.', fig: { base: 'mpo-post', hl: ['ring', 'vas', 'gon', 'doom'], marks: [{ t: 'arrow', x1: 150, y1: 150, x2: 120, y2: 60, label: 'Sac up', lx: 86, ly: 56 }, { t: 'zone', x: 180, y: 262, rx: 40, ry: 26, tone: 'danger' }] } },
          { t: 'Critical view of the MPO', d: 'Before the mesh, check: pubic tubercle past the midline and Cooper’s ligament exposed, at least 2 cm between Cooper’s ligament and the bladder, femoral orifice checked, psoas and iliac vessels visible, cord structures flat.', tip: 'A fixed checklist before every mesh. Recurrences happen mostly medially and posteriorly.', danger: 'Inadequate inferior dissection: the mesh folds when the bladder fills.', nurse: 'Prepare the mesh in the size the surgeon asked for.', fig: { base: 'mpo-post', hl: ['cooper', 'femoral', 'vas', 'gon', 'psoas', 'ring', 'direct'], marks: [{ t: 'dot', x: 360, y: 266 }, { t: 'dot', x: 246, y: 234 }, { t: 'dot', x: 60, y: 260 }, { t: 'label', x: 200, y: 20, text: 'Whole MPO exposed before mesh', tone: 'safe' }] } },
          { t: 'Insert and position the mesh', d: 'A mesh of at least 10×15 cm covers the direct, indirect and femoral spaces. The lower edge lies flat under the peritoneum.', tip: 'A large enough mesh usually makes fixation unnecessary. Fixation by judgment: Cooper’s ligament medially, or above the iliopubic tract only, or glue.', danger: 'Fixation in the triangle of doom or the triangle of pain.', nurse: 'Rolled mesh, tacker or glue on request.', fig: { base: 'mpo-post', hl: ['cooper', 'iev', 'ring', 'direct', 'femoral'], marks: [{ t: 'mesh', x: 70, y: 70, w: 300, h: 170, a: 8 }, { t: 'x', x: 180, y: 262 }, { t: 'x', x: 56, y: 252 }] } },
          { t: 'Close the peritoneum and release the gas', d: 'Close the flap with a running suture (often barbed) at low pressure, with no gaps. Release the gas while the mesh stays in place.', tip: 'Lowering the pressure to 8–10 mmHg makes closure easier.', danger: 'A gap in the peritoneum: bowel can incarcerate in it or stick to the mesh.', nurse: '3-0 barbed suture or a needle holder, 0 suture for the umbilical fascia.', fig: { base: 'mpo-post', hl: ['wall'], marks: [{ t: 'stitch', x1: 24, y1: 96, x2: 296, y2: 72, n: 12 }] } }
        ],
        equipment: [
          { cat: 'Optics and access', items: ['30° scope, 10 mm.', 'A 12 mm port and two 5 mm ports.'], alt: ['5 mm scope', 'Entry through an umbilical hernia'] },
          { cat: 'Dissection', items: ['Laparoscopic scissors with diathermy.', 'Two atraumatic graspers.', 'Maryland forceps.'], alt: ['Bipolar device'] },
          { cat: 'Mesh', items: ['Macroporous polypropylene mesh, at least 10×15 cm.'], alt: ['Anatomically shaped (3D) mesh', 'Heavier mesh for a large direct hernia', 'Lightweight mesh when the defect is small'] },
          { cat: 'Fixation', items: ['No fixation in most cases.'], alt: ['Absorbable tacks', 'Cyanoacrylate or fibrin glue', 'Suture to Cooper’s ligament'] },
          { cat: 'Closure', items: ['3-0 barbed suture for the peritoneum.', '0 absorbable for the umbilical fascia.', '4-0 for skin.'], alt: ['Clips or tacks to close the peritoneum'] }
        ],
        pitfalls: [
          { p: 'Short medial and inferior dissection', fix: 'Complete the critical view. Most recurrences are medial.' },
          { p: 'A missed cord lipoma', fix: 'Look lateral to the cord and reduce it. Otherwise it later looks like a “recurrent hernia”.' },
          { p: 'Folded mesh', fix: 'Develop the space until the mesh lies flat. Close the peritoneum at low pressure.' },
          { p: 'Energy in the triangles', fix: 'Cold, gentle work close to the sac.' }
        ]
      },
      {
        key: 'tep', kind: 'lap', label: 'TEP', inherit: 'tapp',
        skipSteps: [0, 1, 8],
        preSteps: [
          { t: 'Enter the preperitoneal space', d: 'Small incision below the umbilicus, open the anterior rectus sheath and retract the muscle laterally. Reach the posterior sheath without opening the peritoneum.', tip: 'Develop the space with a balloon or the tip of the scope, toward the pubis and below the arcuate line.', danger: 'Peritoneal tear: gas enters the abdomen and the space collapses. Close it with a loop, vent with a Veress needle or convert to TAPP.', nurse: 'Dissecting balloon (if used), blunt 10–12 mm port, 30° scope.', fig: { view: 'access' } },
          { t: 'Additional midline ports', d: 'Two 5 mm ports in the midline below the camera port, under direct vision.', tip: 'Keep the lower port at least two fingerbreadths above the pubis, so there is room to work.', nurse: 'Two 5 mm ports, atraumatic graspers.', fig: { view: 'access' } }
        ],
        postSteps: [
          { t: 'Release the gas under vision', d: 'Release the gas slowly and watch that the lower edge of the mesh does not roll up and the sac does not slip under it.', tip: 'There is no peritoneal flap to close. Close the anterior sheath at ports of 10 mm and above.', danger: 'A mesh that folds at its lower edge is a cause of recurrence.', fig: { base: 'mpo-post', hl: [] } }
        ],
        deltas: ['No entry into the peritoneal cavity: you work in the preperitoneal space from the start.', 'Entry below the umbilicus, through the anterior rectus sheath and behind the muscle, onto the posterior sheath.', 'The space is developed with a balloon or the scope, below the arcuate line.', 'A peritoneal tear fills the abdomen with gas and narrows the space: close it, vent with a Veress needle or convert to TAPP.', 'No peritoneal flap to close.', 'Less suitable after lower abdominal surgery or prostatectomy.'],
        setup: {
          position: { kind: 'supine', tilt: -15, pressure: ['occiput', 'elbow', 'sacrum', 'heel'] },
          room: { arms: { R: 'tucked', L: 'tucked' }, legs: 'together', staff: [{ w: 'S', s: 'Lt2' }, { w: 'C', s: 'Lt1' }, { w: 'N', s: 'RtFoot' }], monitors: ['foot'] },
          notes: ['As in TAPP: Trendelenburg and an empty bladder.', 'Surgeon on the side opposite the hernia.'],
          arms: ['Both arms tucked.'],
          team: ['Monitor at the foot of the table.']
        },
        access: {
          target: { x: 100, y: 300, rx: 40, ry: 26, label: 'Right groin' },
          ports: [
            { x: 150, y: 222, mm: 10, role: 'camera', label: 'Below the umbilicus. Open the anterior sheath, insert balloon and camera', n: 1 },
            { x: 150, y: 270, mm: 5, role: 'work', label: 'Midline, halfway between umbilicus and pubis', n: 2 },
            { x: 150, y: 312, mm: 5, role: 'work', label: 'Midline, above the pubis', n: 3 }
          ],
          notes: ['Gas pressure of 12–15 mmHg in the space.', 'Ports can be moved laterally for a large bilateral hernia.']
        }
      },
      {
        key: 'rtapp', kind: 'robotic', label: 'Robotic (TAPP)', inherit: 'tapp',
        deltas: ['The same steps as TAPP, with wristed instruments and a 3D view.', 'Ports further out: 8–10 cm lateral to the midline. Camera above the umbilicus.', 'Common instruments: fenestrated bipolar forceps, monopolar scissors and a suture-cut needle driver.', 'Peritoneal closure is easier. Convenient for large hernias, recurrences and patients with obesity.', 'The preferred approach for those who work with the platform. Time and cost are higher.'],
        setup: {
          position: { kind: 'supine', tilt: -15, pressure: ['occiput', 'elbow', 'sacrum', 'heel', 'face'] },
          room: { arms: { R: 'tucked', L: 'tucked' }, legs: 'together', staff: [{ w: 'B', s: 'Lt2' }, { w: 'N', s: 'RtFoot' }], monitors: ['LtFar3'], robot: { s: 'foot' }, console: true },
          notes: ['A slight flex of the table gives the arms more room.', 'Trendelenburg before docking.'],
          arms: ['Both arms tucked and padded.'],
          team: ['Robot cart from the feet or the side, depending on the model.', 'Bedside assistant near the head.']
        },
        access: {
          target: { x: 100, y: 300, rx: 40, ry: 26, label: 'Right groin' },
          ports: [
            { x: 150, y: 188, mm: 8, role: 'camera', label: 'Above the umbilicus. Camera', n: 1 },
            { x: 62, y: 196, mm: 8, role: 'robot', label: 'Right, 8–10 cm from the midline', n: 2 },
            { x: 238, y: 196, mm: 8, role: 'robot', label: 'Left, mirror of port 2', n: 3 }
          ],
          notes: ['At least 8–10 cm between ports so the arms don’t collide.'],
          docking: ['Target the robot on the groin.', 'Dock the camera, then the two arms.', 'For a bilateral hernia: one docking for both sides.']
        }
      },
      {
        key: 'lichtenstein', kind: 'open', label: 'Lichtenstein',
        setup: {
          position: { kind: 'supine', tilt: 0, pressure: ['occiput', 'elbow', 'sacrum', 'heel'] },
          room: { arms: { R: 'out', L: 'out' }, legs: 'together', staff: [{ w: 'S', s: 'Rt3' }, { w: 'A', s: 'Lt3' }, { w: 'N', s: 'RtFoot' }] },
          notes: ['Supine.', 'Local anesthesia with sedation, regional or general.', 'Prep from the umbilicus to the thigh.'],
          arms: ['Arms out or at the sides, depending on the anesthesia.'],
          team: ['Surgeon on the hernia side, assistant opposite.', 'Focused light on the groin.']
        },
        access: {
          target: { x: 100, y: 304, rx: 32, ry: 20, label: 'Canal' },
          incisions: [{ id: 'inguinal-R', label: 'Incision from just medial to the ASIS to near the tubercle, 6–8 cm, parallel to the ligament' }],
          notes: ['Local anesthetic infiltration before the incision and at the end reduces pain.', 'Bupivacaine prolongs the block.']
        },
        steps: [
          { t: 'Incision and opening the aponeurosis', d: 'Incision parallel to the ligament and open the external oblique aponeurosis along its fibers, down to the superficial ring.', tip: 'Open carefully: the ilioinguinal nerve lies just underneath.', danger: 'Cutting the nerve on the first opening.', nurse: 'Hernia set, small retractors, local anesthetic.', fig: { base: 'canal-ant', hl: ['eo', 'ii'], marks: [{ t: 'cut', x1: 40, y1: 44, x2: 380, y2: 30 }] } },
          { t: 'Identify the nerves', d: 'Identify the ilioinguinal, iliohypogastric and genital branch. Protect them throughout the operation.', tip: 'When a nerve must be cut, divide it completely and ligate the proximal end rather than injuring it partially.', danger: 'A nerve caught in a suture is a common cause of chronic pain.', fig: { base: 'canal-ant', hl: ['ii', 'ih', 'gf'] } },
          { t: 'Mobilize the cord', d: 'Lift the cord off the floor with a Penrose drain, at the level of the tubercle.', tip: 'Lift it together with the genital branch and the external spermatic vein, or leave them on the floor, but don’t tear them apart.', danger: 'Injury to the vas or the testicular vessels.', nurse: 'Penrose drain, clamps.', fig: { base: 'canal-ant', hl: ['cord', 'tub'], marks: [{ t: 'arrow', x1: 240, y1: 196, x2: 250, y2: 140, label: 'Lift the cord', lx: 250, ly: 132 }] } },
          { t: 'Deal with the sac', d: 'Indirect sac: separate it from the cord up to the internal ring, then reduce or ligate it. Direct sac: push it back.', tip: 'Look for a cord lipoma and remove it.', danger: 'Bowel or bladder in a sliding sac: never ligate blindly.', nurse: 'Absorbable tie.', fig: { base: 'canal-ant', hl: ['cord', 'floor'], marks: [{ t: 'zone', x: 98, y: 176, rx: 24, ry: 16, tone: 'info', label: 'Indirect sac' }, { t: 'zone', x: 250, y: 200, rx: 36, ry: 14, tone: 'info', label: 'Direct' }] } },
          { t: 'Anchor the mesh medially', d: 'The mesh lies on the floor and overlaps the tubercle by at least 2 cm. The first stitch goes into tissue over the tubercle, not the periosteum.', tip: 'A rounded corner of the mesh sits over the tubercle.', danger: 'A stitch into the periosteum: pain and osteitis.', nurse: 'Flat mesh (about 7.5×15 cm), monofilament suture.', fig: { base: 'canal-ant', hl: ['tub', 'floor'], marks: [{ t: 'mesh', x: 80, y: 120, w: 300, h: 110, a: 8 }, { t: 'dot', x: 384, y: 258 }] } },
          { t: 'Inferior suture to the shelving edge', d: 'Running suture from the tubercle along the shelving edge to beyond the internal ring.', tip: 'Bites into the edge itself, not deep below it.', danger: 'A bite too deep injures the femoral vessels.', nurse: '2-0 polypropylene or a slowly absorbable suture, by preference.', fig: { base: 'canal-ant', hl: ['shelf', 'lig'], marks: [{ t: 'mesh', x: 80, y: 120, w: 300, h: 110, a: 8 }, { t: 'stitch', x1: 340, y1: 246, x2: 80, y2: 226, n: 9 }] } },
          { t: 'Split the mesh around the cord', d: 'Cut the mesh into two tails, pass the cord between them and cross them lateral to the internal ring.', tip: 'Suture the upper edge loosely to the internal oblique. Aim for a little laxity so the mesh is not stretched when the patient stands.', danger: 'Upper sutures that catch the iliohypogastric nerve.', fig: { base: 'canal-ant', hl: ['cord', 'ih', 'io'], marks: [{ t: 'mesh', x: 80, y: 120, w: 300, h: 110, a: 8 }, { t: 'zone', x: 92, y: 172, rx: 22, ry: 16, tone: 'safe', label: 'New ring' }, { t: 'x', x: 240, y: 108 }] } },
          { t: 'Closure and local anesthetic', d: 'Close the aponeurosis over the cord, infiltrate local anesthetic under the aponeurosis and close the skin.', tip: 'Close without narrowing the superficial ring.', fig: { base: 'canal-ant', hl: ['eo'], marks: [{ t: 'stitch', x1: 40, y1: 44, x2: 380, y2: 30, n: 12 }] } }
        ],
        equipment: [
          { cat: 'Opening', items: ['Hernia set with small retractors (Senn, Weitlaner).', 'Penrose drain to lift the cord.', 'Local anesthetic.'] },
          { cat: 'Mesh', items: ['Flat polypropylene mesh, about 7.5×15 cm, to trim.'], alt: ['Self-gripping mesh', 'Mesh plug for an indirect hernia', 'Tissue repair without mesh (Shouldice) in selected cases'] },
          { cat: 'Fixation', items: ['Running monofilament suture to the shelving edge.', 'Interrupted sutures for the upper edge.'], alt: ['Slowly absorbable suture', 'Cyanoacrylate glue'] },
          { cat: 'Closure', items: ['2-0 absorbable for the aponeurosis.', '4-0 for skin.'] }
        ],
        pitfalls: [
          { p: 'Mesh too small medially', fix: 'Overlap of at least 2 cm beyond the tubercle.' },
          { p: 'Mesh under tension', fix: 'Slight laxity at the upper edge. Mesh contracts over time.' },
          { p: 'Nerves caught in sutures', fix: 'Identify each nerve before every upper stitch.' }
        ]
      }
    ],
    compare: {
      cols: ['lichtenstein', 'tapp', 'tep', 'rtapp'],
      rows: [
        { k: 'When to choose', v: { lichtenstein: 'Local anesthesia, recurrence after posterior repair, anesthetic risk', tapp: 'Bilateral, recurrence after anterior repair, women, incarcerated hernia', tep: 'As for TAPP, without entering the abdomen', rtapp: 'Large or complex hernia, surgeons who work robotically' } },
        { k: 'Anesthesia', v: { lichtenstein: 'Local, regional or general', tapp: 'General', tep: 'General', rtapp: 'General' }, best: 'lichtenstein' },
        { k: 'Chronic pain', v: { lichtenstein: 'Slightly higher', tapp: 'Lower', tep: 'Lower', rtapp: 'Lower' } },
        { k: 'Return to activity', v: { lichtenstein: 'Good', tapp: 'Fast', tep: 'Fast', rtapp: 'Fast' } },
        { k: 'See the other side and femoral', v: { lichtenstein: 'No', tapp: 'Yes', tep: 'Yes', rtapp: 'Yes' } },
        { k: 'Specific risk', v: { lichtenstein: 'Nerve injury', tapp: 'Adhesions to a peritoneal gap, bowel injury', tep: 'Peritoneal tear, narrow space', rtapp: 'Time and cost' } },
        { k: 'Learning curve', v: { lichtenstein: 'Short', tapp: 'Moderate', tep: 'Long', rtapp: 'Moderate' }, best: 'lichtenstein' }
      ],
      note: 'A qualitative comparison based on Sabiston 22, CST 14 and HerniaSurge 2018.'
    },
    bailout: ['Structures hard to identify: go back to the fixed landmarks (inferior epigastric vessels, Cooper’s ligament, the vas).', 'TEP with a peritoneal tear and a narrow space: Veress needle to vent, or convert to TAPP.', 'A long indirect sac that won’t reduce: high ligation and division. Leave the distal part open.', 'Strangulated hernia with nonviable bowel: resect. In a contaminated field, consider repair without permanent mesh or a different mesh.', 'Uncontrolled bleeding or a space that can’t be developed: convert to an open approach.'],
    intraop: [
      { c: 'Bleeding from the corona mortis or inferior epigastric vessels', do: 'Pressure, exposure and clips. Never clip blindly near the iliac vessels.' },
      { c: 'External iliac vein or artery injury', do: 'Pressure, help from a vascular surgeon, sometimes open. This is the risk of the triangle of doom.' },
      { c: 'Bladder injury', do: 'Two-layer repair and a catheter for several days. Usually happens during retropubic dissection.' },
      { c: 'Bowel injury (TAPP or sliding hernia)', do: 'Repair. With real contamination, reconsider the mesh type or delay.' },
      { c: 'Peritoneal tear in TEP', do: 'Close with a clip or a loop. Vent the gas from the abdomen.' }
    ],
    postop: {
      care: ['Same-day discharge in most cases.', 'Multimodal analgesia and local cooling.', 'Walk immediately. Return to activity as comfort allows.', 'Confirm the patient has voided before discharge.', 'Warning signs: fever, rapidly increasing swelling, vomiting.'],
      complications: [
        { c: 'Seroma', d: 'Common, especially after a large direct hernia. Most resorb on their own. Not drained routinely.' },
        { c: 'Hematoma', d: 'In the groin and scrotum. Usually managed conservatively.' },
        { c: 'Urinary retention', d: 'Mainly in older men and after general anesthesia. Temporary catheter.' },
        { c: 'Chronic pain (beyond 3 months)', d: 'Workup, conservative treatment and nerve blocks. Surgery only in selected cases.' },
        { c: 'Recurrence', d: 'Repair through a different approach from the previous one (open after posterior and vice versa).' },
        { c: 'Mesh infection', d: 'Rare. Antibiotics and drainage. Sometimes mesh removal.' }
      ]
    },
    quiz: [
      { q: 'What is the boundary between an indirect and a direct hernia?', a: ['Cooper’s ligament', 'The inferior epigastric vessels', 'The vas deferens', 'The medial umbilical ligament'], c: 1, why: 'Indirect is lateral to the inferior epigastric vessels, direct is medial to them.' },
      { q: 'What runs through the triangle of doom?', a: ['The nerves of the thigh', 'The external iliac artery and vein', 'The bladder', 'The iliohypogastric nerve'], c: 1, why: 'The external iliac vessels run between the vas and the gonadal vessels. Hence no fixation and no diathermy.' },
      { q: 'What is the accepted mesh overlap beyond the pubic tubercle in a Lichtenstein repair?', a: ['No overlap', '0.5 cm', 'At least 2 cm', 'Only a stitch into the periosteum'], c: 2, why: 'About 2 cm of overlap beyond the tubercle, without suturing into the periosteum.' },
      { q: 'A woman has a symptomatic inguinal hernia. Which is correct?', a: ['Watchful waiting is the default', 'A posterior approach also lets you check the femoral orifice', 'Mesh is not needed', 'Laparoscopy is contraindicated'], c: 1, why: 'Watchful waiting is not recommended in women. A posterior approach also shows a femoral hernia.' },
      { q: 'What is the most common complication after mesh inguinal hernia repair?', a: ['Mesh infection', 'Chronic pain', 'Iliac vessel injury', 'Testicular atrophy'], c: 1, why: 'Chronic pain beyond 3 months is reported in 11–18% (CST 14).' }
    ],
    sources: [
      { b: 'CST14', ref: 'Current Surgical Therapy 14: Management of Inguinal Hernia, pp. 663–667.' },
      { b: 'CST14', ref: 'Current Surgical Therapy 14: Management of Recurrent Inguinal Hernia, pp. 668–671.' },
      { b: 'CST14', ref: 'Current Surgical Therapy 14: Use of Various Meshes in Hernia Repair, pp. 708 onward.' },
      { b: 'SAB22', ref: 'Sabiston 22, chapter 82: Inguinal Hernias, pp. 1091–1106 (anatomy, triangles, critical view of the MPO).' },
      { b: 'SAB22', ref: 'Sabiston 22, chapter 79: Preoperative Management of the Hernia Patient, p. 1054.' },
      { b: 'GL', ref: 'HerniaSurge international guidelines for groin hernia management, 2018.' }
    ],
    gaps: ['Tissue repair without mesh (Shouldice, Desarda) is mentioned only briefly.', 'Open femoral hernia repair is not shown in step cards.', 'TEP and robotic do not yet have full step sets of their own: only the differences from TAPP are shown.']
  });
})();
