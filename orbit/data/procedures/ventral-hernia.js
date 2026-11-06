/* ORBIT · Ventral / incisional hernia repair: open retromuscular (Rives-Stoppa), laparoscopic IPOM-plus, robotic retromuscular.
   Facts checked against CST14 (Incisional, Epigastric and Umbilical Hernias, pp. 671–678; Abdominal Wall Reconstruction; meshes)
   and Sabiston 22 ch. 79–80. Text is original and short. */
(function () {
  var O = window.ORBIT;

  /* ---------- base 1: abdominal wall cross-section with a midline defect ---------- */
  O.base('wall-xs', 'Abdominal wall cross-section and mesh planes', function () {
    var K = 1.65, Y = function (v) { return Math.round(v * K * 10) / 10; };
    var side = function (m) {
      var x = function (v) { return m ? 400 - v : v; };
      return '<path data-k="eo" class="a-muscle" d="M' + x(0) + ' ' + Y(62) + ' L' + x(100) + ' ' + Y(68) + ' L' + x(100) + ' ' + Y(76) + ' L' + x(0) + ' ' + Y(76) + ' Z" opacity=".85"/>' +
        '<path data-k="io" class="a-muscle" d="M' + x(0) + ' ' + Y(82) + ' L' + x(100) + ' ' + Y(84) + ' L' + x(100) + ' ' + Y(96) + ' L' + x(0) + ' ' + Y(98) + ' Z" opacity=".75"/>' +
        '<path data-k="ta" class="a-muscle" d="M' + x(0) + ' ' + Y(104) + ' L' + x(100) + ' ' + Y(108) + ' L' + x(100) + ' ' + Y(118) + ' L' + x(0) + ' ' + Y(120) + ' Z" opacity=".65"/>' +
        '<rect data-k="ars" class="a-fascia" x="' + (m ? 230 : 100) + '" y="' + Y(68) + '" width="70" height="' + Y(5) + '"/>' +
        '<ellipse data-k="rectus" class="a-muscle" cx="' + x(135) + '" cy="' + Y(96) + '" rx="36" ry="' + Y(20) + '"/>' +
        '<rect data-k="prs" class="a-fascia" x="' + (m ? 230 : 100) + '" y="' + Y(119) + '" width="70" height="' + Y(5) + '"/>' +
        '<g data-k="nvb"><circle cx="' + x(97) + '" cy="' + Y(101) + '" r="3.4" style="fill:var(--a-nerve);stroke:var(--a-stroke);stroke-width:.6"/><circle cx="' + x(104) + '" cy="' + Y(101) + '" r="2.8" class="a-artf"/></g>' +
        '<path data-k="semi" class="a-dash" d="M' + x(100) + ' ' + Y(56) + ' L' + x(100) + ' ' + Y(132) + '"/>';
    };
    return '' +
      '<rect data-k="fat" class="a-fat" x="0" y="0" width="400" height="' + Y(66) + '"/>' +
      '<rect class="a-fat" x="0" y="' + Y(124) + '" width="400" height="' + Y(10) + '" opacity=".7"/>' +
      '<path data-k="perit" class="a-line" d="M0 ' + Y(136) + ' L170 ' + Y(136) + ' M230 ' + Y(136) + ' L400 ' + Y(136) + '"/>' +
      '<g data-k="bowel"><ellipse class="a-bowel" cx="70" cy="262" rx="58" ry="20"/><ellipse class="a-bowel" cx="200" cy="276" rx="66" ry="22"/><ellipse class="a-bowel" cx="334" cy="262" rx="58" ry="20"/></g>' +
      side(false) + side(true) +
      '<path data-k="sac" class="a-perit" d="M170 ' + Y(136) + ' C166 ' + Y(70) + ' 234 ' + Y(70) + ' 230 ' + Y(136) + ' Z"/>' +
      '<ellipse data-k="sacbowel" class="a-bowel" cx="200" cy="' + Y(110) + '" rx="20" ry="' + Y(13) + '"/>' +
      '<text class="lbl s" x="200" y="22" text-anchor="middle">Skin + subcutaneous fat</text>' +
      '<text class="lbl s" x="135" y="' + Y(98) + '" text-anchor="middle">Rectus</text>' +
      '<text class="lbl s" x="265" y="' + Y(98) + '" text-anchor="middle">Rectus</text>' +
      '<text class="lbl s" x="8" y="' + Y(60) + '">EO</text><text class="lbl s" x="8" y="' + Y(93) + '">IO</text><text class="lbl s" x="8" y="' + Y(116) + '">TA</text>' +
      '<text class="lbl s" x="200" y="' + Y(66) + '" text-anchor="middle">Hernia sac</text>' +
      '<text class="lbl s" x="200" y="' + Y(146) + '" text-anchor="middle">Defect</text>' +
      '<text class="lbl s" x="12" y="' + Y(146) + '">Peritoneum</text>' +
      '<text class="lbl s" x="304" y="' + Y(50) + '">Linea semilunaris</text>';
  });

  /* ---------- base 2: frontal view, defect measurement and overlap ---------- */
  O.base('wall-front', 'Front view: defect size, mesh overlap and EHS zones', function () {
    return '' +
      '<rect data-k="wall" class="a-perit" x="0" y="0" width="400" height="300"/>' +
      '<path class="a-line" d="M200 8 Q140 30 70 60 M200 8 Q260 30 330 60" style="opacity:.6"/>' +
      '<rect data-k="rectus" class="a-muscle" x="128" y="16" width="62" height="276" rx="28" opacity=".45"/>' +
      '<rect data-k="rectus" class="a-muscle" x="210" y="16" width="62" height="276" rx="28" opacity=".45"/>' +
      '<path data-k="semi" class="a-dash" d="M126 30 L126 290 M274 30 L274 290"/>' +
      '<ellipse data-k="overlap" cx="200" cy="150" rx="88" ry="100" fill="rgba(20,184,166,.10)" stroke="rgba(20,184,166,.8)" stroke-dasharray="6 5"/>' +
      '<ellipse data-k="defect" class="a-bowel" cx="200" cy="150" rx="36" ry="48"/>' +
      '<circle class="a-line" cx="200" cy="176" r="4"/>' +
      '<path class="a-line" d="M162 150 L238 150" style="stroke-width:1.6"/><path class="a-line" d="M162 144 L162 156 M238 144 L238 156"/>' +
      '<text class="lbl" x="200" y="144" text-anchor="middle">W</text>' +
      '<text class="lbl s" x="200" y="226" text-anchor="middle">5 cm overlap</text>' +
      '<g data-k="ehs"><text class="lbl s" x="352" y="26">M1</text><text class="lbl s" x="352" y="80">M2</text><text class="lbl s" x="352" y="156">M3</text><text class="lbl s" x="352" y="226">M4</text><text class="lbl s" x="352" y="284">M5</text>' +
      '<path class="a-dash" d="M340 50 L392 50 M340 120 L392 120 M340 190 L392 190 M340 256 L392 256" style="opacity:.5"/></g>' +
      '<text class="lbl s" x="40" y="160">L zone</text>' +
      '<text class="lbl s" x="128" y="12">Rectus</text>';
  });

  O.cover('ventral-hernia', function () {
    return '<rect x="40" y="70" width="240" height="14" rx="3" class="f-w2"/>' +
      '<ellipse cx="90" cy="112" rx="40" ry="18" class="f-w2"/><ellipse cx="230" cy="112" rx="40" ry="18" class="f-w2"/>' +
      '<rect x="40" y="134" width="240" height="12" rx="3" class="f-w2"/>' +
      '<path d="M130 70 C126 20 194 20 190 70" class="f-t2"/>' +
      '<rect x="44" y="124" width="232" height="8" rx="2" fill="url(#o-mesh)" stroke="#3DD6A3" stroke-width="1.5"/>' +
      '<path class="s-g" d="M130 84 L190 84" stroke-width="3" stroke-dasharray="3 3"/>' +
      '<text x="28" y="182" class="c-w" style="font:700 14px Inter,sans-serif;letter-spacing:.06em">SUBLAY</text>';
  });

  O.register({
    id: 'ventral-hernia',
    title: 'Ventral and incisional hernia repair',
    title_en: 'Ventral & incisional hernia repair (Rives-Stoppa · IPOM-plus · robotic retromuscular)',
    system: 'hernia', organ: 'Abdominal wall', difficulty: 4, setting: 'Mostly elective',
    tags: ['ventral hernia', 'incisional hernia', 'incisional', 'ventral', 'Rives', 'Stoppa', 'retromuscular', 'sublay', 'IPOM', 'TAR', 'eTEP', 'mesh', 'mesh', 'small bites'],
    student: {
      summary: 'A hernia in the midline or in a surgical scar. Close the defect and reinforce it with a large mesh that overlaps the defect by about 5 cm in every direction. The preferred mesh position is behind the rectus muscle (sublay).',
      points: ['Measure the defect width (W): it sets the complexity of the repair.', 'Mesh behind the muscle: fewer infections and fewer recurrences than mesh on top of the fascia.', 'Protect the neurovascular bundles at the lateral edge of the rectus.', 'Closing the abdomen with small bites prevents incisional hernia.']
    },
    overview: {
      facts: [{ v: '3–5 cm', l: 'Minimum mesh overlap around the defect (5 is usual)' }, { v: '10–14 cm', l: 'Defect width that usually needs component separation' }, { v: '>16 cm', l: 'Defect that sometimes requires bridging' }, { v: '4:1', l: 'Suture length to wound length, small bites' }],
      indications: ['A hernia that is symptomatic or growing.', 'A hernia with a narrow neck and a risk of incarceration.', 'Incarceration or obstruction: emergency surgery.', 'Asymptomatic hernia: watchful waiting is possible and usually safe.'],
      contraindications: ['Active infection of the skin or of a previous mesh: treat the infection first.', 'Active smoking, uncontrolled diabetes and severe obesity: elective surgery is usually deferred for optimization.', 'Contaminated field: permanent synthetic mesh only with careful judgment.'],
      choice: ['Defect width, number of defects and fascial quality.', 'Previous operations and meshes, previous infection, fistula.', 'Skin condition: scars, ulceration or a need to excise excess skin favor an open approach.', 'Small midline hernia: laparoscopic or robotic, with defect closure.', 'Robotic: allows an extraperitoneal mesh through a minimally invasive approach. In this tool we chose robotic Rives with midline crossover, because it reproduces the principles of the open sublay. An accepted alternative: eTEP.']
    },
    anatomy: {
      figures: [
        { base: 'wall-xs', hotspots: [
          { x: 262, y: 92, label: 'Onlay', text: 'Mesh on the anterior sheath. Technically easy, but linked to more seromas and infections. Used sparingly.' },
          { x: 236, y: 234, label: 'Bridging (inlay)', text: 'Mesh that spans the defect edges without closing it. High recurrence rate. Only when there is no other choice.' },
          { x: 268, y: 206, label: 'Retromuscular sublay', text: 'Between the rectus muscle and the posterior sheath. The preferred position: fewer infections and fewer recurrences.' },
          { x: 352, y: 211, label: 'Preperitoneal', text: 'Between the posterior sheath and the peritoneum. Suits umbilical hernias and minimally invasive repair when the peritoneum is intact.' },
          { x: 352, y: 242, label: 'Intraperitoneal (IPOM)', text: 'Mesh with an anti-adhesion coating on the peritoneal surface. Overlap of 3–5 cm or more. Risk of adhesions and fistula.' },
          { x: 100, y: 146, label: 'Neurovascular bundles', text: 'Enter the rectus from behind and laterally, at the linea semilunaris. Cutting them denervates the muscle. Stop before them.' },
          { x: 70, y: 221, label: 'Transversus abdominis release (TAR)', text: 'When the posterior sheath won’t close without tension: dividing the transversus muscle medial to the linea semilunaris opens a large lateral space.' }
        ] },
        { base: 'wall-front', hotspots: [
          { x: 246, y: 128, label: 'Defect width (W)', text: 'The greatest transverse distance between the fascial edges, on CT or at surgery. It predicts the need for component separation.' },
          { x: 200, y: 246, label: 'Mesh overlap', text: 'Aim for 5 cm of overlap around the defect. With multiple defects, around the whole scar.' },
          { x: 372, y: 104, label: 'EHS zones', text: 'European classification: M1–M5 in the midline from subxiphoid to suprapubic. L zones are lateral. Subxiphoid and suprapubic hernias are more complex.' },
          { x: 104, y: 220, label: 'Linea semilunaris', text: 'The lateral limit of the retromuscular space. Beyond it you need component separation.' }
        ] }
      ],
      landmarks: [
        { name: 'Posterior rectus sheath', why: 'The floor of the mesh space. Closed before the mesh. Any tear is sutured.' },
        { name: 'Linea semilunaris and the neurovascular bundles', why: 'The lateral limit. Protecting them prevents muscle atrophy and lateral hernia.' },
        { name: 'Arcuate line', why: 'Below it there is no posterior sheath. The mesh lies on the transversalis fascia and peritoneum.' },
        { name: 'Linea alba', why: 'Closed over the mesh. If possible, keep it intact in the robotic approach.' }
      ]
    },
    preop: {
      workup: ['Abdominal CT: width and number of defects, hernia contents, ratio of hernia volume to abdominal cavity (loss of domain).', 'Workup of comorbidities: lungs, heart, diabetes.', 'Previous operations and meshes: operative notes if available.', 'Dedicated hernia risk calculators, if available.'],
      consent: ['Recurrence.', 'Seroma, wound infection and mesh infection.', 'Bowel injury and an unrecognized leak.', 'Pain from mesh fixation.', 'Pulmonary complications, especially with a large hernia and in a patient with COPD.', 'Need for component separation or an open operation.'],
      antibiotics: ['Cefazolin 2 g (3 g above 120 kg) within 60 minutes before incision. Redose in a long operation.', 'With bowel resection in the same operation: also cover enteric bacteria.'],
      vte: ['Mechanical and pharmacological prophylaxis by risk. In a large open operation the risk is moderate to high.'],
      bowelPrep: ['Not routinely required. Consider it when bowel surgery is planned or the risk of bowel injury is high.'],
      special: ['Stop smoking at least 4 weeks before elective surgery.', 'Glucose control: an accepted target is HbA1c below 8%.', 'Weight loss when BMI is high, without deferring a symptomatic hernia indefinitely.', 'Lung disease (COPD): pulmonary optimization. The risk of recurrence and respiratory failure is higher.', 'Hernia with loss of domain: consider botulinum toxin to the lateral muscles or preoperative pneumoperitoneum.']
    },
    approaches: [
      {
        key: 'open', kind: 'open', label: 'Open (Rives-Stoppa)',
        setup: {
          position: { kind: 'supine', tilt: 0, pressure: ['occiput', 'elbow', 'sacrum', 'heel'] },
          room: { arms: { R: 'out', L: 'out' }, legs: 'together', staff: [{ w: 'S', s: 'Rt2' }, { w: 'A', s: 'Lt2' }, { w: 'N', s: 'Rt3' }] },
          notes: ['Supine, head and trunk in a straight line.', 'Urinary catheter for a long operation.', 'Wide prep from the chest to the thighs and to the axillary lines.', 'Measure bladder pressure before and after closure in a large hernia.'],
          arms: ['Both arms out to 90°.'],
          team: ['Surgeon and assistant on either side of the table, switching sides for each rectus.', 'Each side can be dissected from the opposite side of the table.']
        },
        access: {
          target: { x: 150, y: 190, rx: 34, ry: 44, label: 'Defect' },
          incisions: [{ id: 'midline-peri', label: 'Midline incision through the previous scar, excising the scar and excess skin' }],
          notes: ['Excise the old scar and open the abdomen.', 'When the skin is damaged or very stretched: panniculectomy in the same operation.']
        },
        steps: [
          { t: 'Opening and adhesiolysis', d: 'Open in the midline, free the sac from the defect edges and take down all adhesions to the wall.', tip: 'Full adhesiolysis reveals additional defects (swiss cheese) and prevents surprises.', danger: 'An unrecognized bowel injury. Check every segment you worked on.', nurse: 'Laparotomy set, Metzenbaum scissors, moist packs.', fig: { base: 'wall-xs', hl: ['sac', 'sacbowel', 'bowel'], marks: [{ t: 'arrow', x1: 200, y1: 181.5, x2: 200, y2: 252, label: 'Reduce contents', lx: 270, ly: 238 }] } },
          { t: 'Open the posterior sheath', d: 'Incise along the posterior sheath, about half a centimeter to one centimeter from its medial edge. Enter the space behind the rectus.', tip: 'Start where the sheath is intact and safe, usually above or below the defect.', danger: 'Cutting too far from the medial edge leaves a narrow sheath that is hard to close.', nurse: 'Kocher clamps to lift the edge, diathermy.', fig: { base: 'wall-xs', hl: ['prs', 'rectus'], marks: [{ t: 'cut', x1: 168, y1: 201.3, x2: 144, y2: 201.3 }, { t: 'cut', x1: 232, y1: 201.3, x2: 256, y2: 201.3 }] } },
          { t: 'Develop the retromuscular space', d: 'Separate the muscle from the posterior sheath laterally to the linea semilunaris, along the full length of the planned mesh.', tip: 'Below the arcuate line continue in the preperitoneal plane down to the space of Retzius.', danger: 'The neurovascular bundles at the lateral edge. Stop when you see them.', nurse: 'Wide hand-held retractors, diathermy, clips for perforating vessels.', fig: { base: 'wall-xs', hl: ['rectus', 'prs', 'nvb', 'semi'], marks: [{ t: 'arrow', x1: 160, y1: 188.1, x2: 108, y2: 188.1 }, { t: 'arrow', x1: 240, y1: 188.1, x2: 292, y2: 188.1 }, { t: 'zone', x: 100, y: 168.3, rx: 14, ry: 12, tone: 'danger' }, { t: 'zone', x: 300, y: 168.3, rx: 14, ry: 12, tone: 'danger' }] } },
          { t: 'Component release as needed (TAR)', d: 'If the posterior sheath won’t close without tension: divide the transversus muscle medial to the linea semilunaris and develop the lateral space.', tip: 'A defect 10–14 cm wide usually needs component separation. Alternative: anterior release of the external oblique aponeurosis about 2 cm lateral to the line.', danger: 'Cutting lateral to the linea semilunaris injures the nerves and causes a lateral hernia.', nurse: 'Diathermy, retractors, long scissors.', fig: { base: 'wall-xs', hl: ['ta', 'prs', 'semi'], marks: [{ t: 'cut', x1: 110, y1: 171.6, x2: 110, y2: 204.6 }, { t: 'cut', x1: 290, y1: 171.6, x2: 290, y2: 204.6 }, { t: 'arrow', x1: 100, y1: 207.9, x2: 20, y2: 214.5 }] } },
          { t: 'Close the posterior sheath', d: 'Running closure of both posterior sheaths (and peritoneum) in the midline, so the bowel is separated from the mesh.', tip: 'Suture small holes in the sheath: bowel that enters a hole sticks to the mesh.', danger: 'Closure under tension tears the sheath.', nurse: 'Running 2-0 or 0 absorbable suture.', fig: { base: 'wall-xs', hl: ['prs', 'perit'], marks: [{ t: 'stitch', x1: 160, y1: 211.2, x2: 240, y2: 211.2, n: 8 }] } },
          { t: 'Place the mesh', d: 'A medium-weight macroporous polypropylene mesh in the retromuscular space, flat, overlapping the defect by at least 5 cm all around.', tip: 'Minimal or no fixation: abdominal pressure holds it in place.', danger: 'A wrinkled mesh or one narrower than the space: recurrence at the edges.', nurse: 'Mesh cut to size; change gloves before touching the mesh.', fig: { base: 'wall-xs', hl: ['rectus', 'prs', 'ars'], marks: [{ t: 'mesh', x: 104, y: 189, w: 192, h: 8 }, { t: 'label', x: 200, y: 283.8, text: 'sublay', tone: 'safe' }] } },
          { t: 'Close the linea alba', d: 'Close the anterior sheath over the mesh with a running small-bites suture. Drain the space as needed.', tip: 'Small bites: 5 mm from the edge and 5 mm between stitches, at a ratio of at least 4:1.', danger: 'Rising abdominal pressure after closing a large hernia: monitor bladder pressure and airway pressure.', nurse: '2-0 slowly absorbable (PDS) on a small needle, closed drains.', fig: { base: 'wall-xs', hl: ['ars', 'rectus'], marks: [{ t: 'mesh', x: 104, y: 189, w: 192, h: 8 }, { t: 'stitch', x1: 168, y1: 112.2, x2: 232, y2: 112.2, n: 8 }] } },
          { t: 'Skin and drains', d: 'Closed drains over the mesh after a wide dissection. Skin closure.', tip: 'Excising excess skin and fat reduces wound complications in a large hernia.', fig: { view: 'access' } }
        ],
        equipment: [
          { cat: 'Opening and dissection', items: ['Laparotomy set.', 'Wide hand-held retractors (Richardson, Deaver).', 'Diathermy with a long tip.'], alt: ['Ultrasonic device for wide dissection'] },
          { cat: 'Mesh', items: ['Medium-weight macroporous polypropylene mesh, sized to cover 5 cm around the defect.'], alt: ['Slowly absorbable biosynthetic mesh in a contaminated field', 'Biologic mesh (limited role, expensive)', 'Temporary absorbable mesh in a staged repair'] },
          { cat: 'Fixation', items: ['No fixation, or a few sutures to the fascia.'], alt: ['Transfascial sutures', 'Fibrin glue'] },
          { cat: 'Sutures', items: ['Running absorbable suture for the posterior sheath.', '2-0 slowly absorbable on a small needle for the anterior sheath (small bites).', 'Skin suture or staples.'], alt: ['Looped 0 suture for thick fascia'] },
          { cat: 'Other', items: ['Closed drains.', 'Abdominal binder.'], alt: ['Incisional negative pressure wound therapy (iNPWT) in high risk'] }
        ],
        pitfalls: [
          { p: 'Mesh too small', fix: 'Cover the whole scar, not only the largest defect.' },
          { p: 'Cutting the neurovascular bundles', fix: 'Stop at the linea semilunaris. If you need more room: TAR.' },
          { p: 'Torn posterior sheath', fix: 'Suture every hole, or use the hernia sac or other tissue to bridge the sheath.' },
          { p: 'Contaminated field and heavy synthetic mesh', fix: 'Medium-weight macroporous mesh outside the abdomen, or a biosynthetic mesh, or a staged repair.' }
        ]
      },
      {
        key: 'lap', kind: 'lap', label: 'Laparoscopic (IPOM-plus)',
        setup: {
          position: { kind: 'supine', tilt: 0, pressure: ['occiput', 'elbow', 'sacrum', 'heel'] },
          room: { arms: { R: 'out', L: 'tucked' }, legs: 'together', staff: [{ w: 'S', s: 'Lt2' }, { w: 'C', s: 'Lt1' }, { w: 'N', s: 'Rt3' }], monitors: ['RtFar2'] },
          notes: ['Supine. Tilt the table according to the defect position.', 'Secure the patient well for tilting.', 'Urinary catheter for a lower hernia.'],
          arms: ['Left arm tucked so the surgeon can stand close.'],
          team: ['Surgeon and camera on the port side (usually left), monitor opposite them.', 'For a lateral hernia, ports on the opposite side.']
        },
        access: {
          target: { x: 150, y: 196, rx: 32, ry: 40, label: 'Defect' },
          ports: [
            { x: 248, y: 196, mm: 12, role: 'camera', label: 'Left anterior axillary line, mid-abdomen. First entry, camera and mesh insertion', n: 1 },
            { x: 240, y: 120, mm: 5, role: 'work', label: 'Below the left costal margin', n: 2 },
            { x: 240, y: 276, mm: 5, role: 'work', label: 'Left lower abdomen', n: 3 }
          ],
          notes: ['Entry far from the defect and the scar: Palmer’s point or open entry in the flank.', 'Ports as far from the defect as possible, so there is room for a mesh with overlap.', '30° or 5 mm scope.']
        },
        steps: [
          { t: 'Safe entry and survey', d: 'Entry on the left, far from the scar, pneumoperitoneum and survey.', tip: 'In a previously operated abdomen: open entry or an optical port.', danger: 'Bowel injury on entry into an abdomen with adhesions.', nurse: 'Optical port, 30° scope.', fig: { view: 'access' } },
          { t: 'Adhesiolysis', d: 'Take down all adhesions to the anterior wall with cold scissors, no energy near the bowel.', tip: 'Stay close to the wall. Better to leave a little fascia on the bowel than to enter it.', danger: 'An unrecognized bowel injury is the dangerous complication of this approach.', nurse: 'Laparoscopic scissors, atraumatic graspers.', fig: { base: 'wall-xs', hl: ['bowel', 'perit', 'sac'], marks: [{ t: 'cut', x1: 120, y1: 231.0, x2: 160, y2: 231.0 }] } },
          { t: 'Define and measure the defect', d: 'Mark the defect edges and measure width and length at low pressure, using needles from outside.', tip: 'Measure from the inside, not by the skin. Look for further defects along the scar.', nurse: 'Spinal needles, ruler, marking pen.', fig: { base: 'wall-front', hl: ['defect', 'overlap'], marks: [{ t: 'arrow', x1: 164, y1: 168, x2: 236, y2: 168 }, { t: 'arrow', x1: 236, y1: 168, x2: 164, y2: 168 }] } },
          { t: 'Close the defect (“plus”)', d: 'Close the midline fascia before the mesh: a running barbed suture from inside or transfascial sutures.', tip: 'Lower the pressure to 8–10 mmHg before closing. Closure reduces seroma and recurrence.', danger: 'A defect too wide to close without tension: a different approach is better.', nurse: '0 slowly absorbable barbed suture, suture passer.', fig: { base: 'wall-xs', hl: ['ars', 'rectus', 'sac'], marks: [{ t: 'stitch', x1: 168, y1: 165.0, x2: 232, y2: 165.0, n: 6 }] } },
          { t: 'Insert and orient the mesh', d: 'A mesh with an anti-adhesion coating, marked at the center and on its axes, rolled and inserted through the large port. Coated side toward the bowel.', tip: 'Corner marking sutures pulled from outside straighten the mesh.', danger: 'Mesh upside down: the uncoated side facing the bowel.', nurse: 'Coated mesh in the measured size, marking sutures, suture passer.', fig: { base: 'wall-front', hl: ['overlap', 'defect'], marks: [{ t: 'mesh', x: 112, y: 50, w: 176, h: 200, r: 60 }] } },
          { t: 'Fixation', d: 'Fixation with two rings of absorbable tacks (double crown), sometimes with transfascial sutures at the corners.', tip: 'At least 5 cm of overlap around the defect.', danger: 'Tacks near the ribs or close to nerves cause pain. Never fix above the diaphragm.', nurse: 'Absorbable tacker, suture passer.', fig: { base: 'wall-front', hl: ['overlap'], marks: [{ t: 'mesh', x: 112, y: 50, w: 176, h: 200, r: 60 }, { t: 'path', d: 'M124 150 C124 70 276 70 276 150 C276 230 124 230 124 150', tone: 'solid' }] } },
          { t: 'Check and finish', d: 'Inspect the bowel throughout the area, make sure there is no bleeding from the tacks. Release the gas. Close the fascia at the 12 mm port.', tip: 'If you have any doubt about a bowel injury, look again now, not in two days.', nurse: '0 suture for fascia, suture passer.', fig: { view: 'access' } }
        ],
        equipment: [
          { cat: 'Access', items: ['12 mm optical port and two 5 mm ports.', '30° scope.'], alt: ['5 mm scope to change the camera position', 'Entry at Palmer’s point'] },
          { cat: 'Dissection', items: ['Laparoscopic scissors.', 'Atraumatic graspers.'], alt: ['Ultrasonic device only away from the bowel'] },
          { cat: 'Mesh', items: ['Intraperitoneal composite mesh with an anti-adhesion coating.'], alt: ['ePTFE mesh', 'Preperitoneal mesh in a non-IPOM approach'] },
          { cat: 'Fixation', items: ['Absorbable tacks in two rings.', 'Transfascial sutures and a suture passer.'], alt: ['Permanent tacks (less used)', 'Glue'] },
          { cat: 'Defect closure', items: ['0 slowly absorbable barbed suture.'], alt: ['Interrupted transfascial sutures'] }
        ],
        pitfalls: [
          { p: 'Unrecognized bowel injury', fix: 'Cold dissection, re-inspect the bowel at the end, low threshold to convert.' },
          { p: 'Mesh the size of the defect', fix: 'Add 5 cm of overlap in every direction after measuring from inside.' },
          { p: 'Defect left open', fix: 'Closure (plus) reduces bulging, seroma and recurrence.' },
          { p: 'Pain from tacks', fix: 'Use as few as possible, away from the ribs and nerves.' }
        ]
      },
      {
        key: 'robotic', kind: 'robotic', label: 'Robotic (Rives)',
        setup: {
          position: { kind: 'supine', tilt: 0, pressure: ['occiput', 'elbow', 'sacrum', 'heel', 'face'] },
          room: { arms: { R: 'tucked', L: 'tucked' }, legs: 'together', staff: [{ w: 'B', s: 'Rt2' }, { w: 'N', s: 'Rt3' }], monitors: ['RtFar1'], robot: { s: 'LtFar2' }, console: true },
          notes: ['Supine, sometimes a slight flex of the table.', 'Both arms tucked.', 'Dock once the table is in position.'],
          arms: ['Both arms tucked and padded.'],
          team: ['Robot cart from the port side or the opposite side, depending on the model.', 'Bedside assistant with an assistant port.', 'For a wide defect: ports on both sides and two dockings.']
        },
        access: {
          target: { x: 150, y: 196, rx: 32, ry: 40, label: 'Defect' },
          ports: [
            { x: 252, y: 196, mm: 8, role: 'camera', label: 'Left side, mid-abdomen. Camera', n: 1 },
            { x: 244, y: 118, mm: 8, role: 'robot', label: 'Below the left costal margin', n: 2 },
            { x: 244, y: 274, mm: 8, role: 'robot', label: 'Left lower abdomen', n: 3 },
            { x: 230, y: 236, mm: 12, role: 'assist', label: 'Assistant port (optional): mesh and sutures', n: 'A' }
          ],
          notes: ['Ports as lateral as possible, at least 8 cm apart.', 'The distance to the defect sets how far across to the other side you can work.'],
          docking: ['Target the robot on the defect.', 'Camera, then the two arms.', 'For a wide defect: a second docking from the opposite side.']
        },
        steps: [
          { t: 'Entry and adhesiolysis', d: 'Lateral entry, docking and adhesiolysis from the anterior wall.', tip: 'As in laparoscopy: cold dissection near the bowel.', danger: 'Bowel injury.', nurse: 'Monopolar scissors, bipolar forceps.', fig: { view: 'access' } },
          { t: 'Enter the space on the far side', d: 'Incise the posterior rectus sheath on the side opposite the ports, close to its medial edge. Develop the space behind the muscle.', tip: 'The arms reach the far side comfortably. Start there.', danger: 'Entering the muscle: bleeding from the inferior epigastric vessels.', fig: { base: 'wall-xs', hl: ['prs', 'rectus'], marks: [{ t: 'cut', x1: 168, y1: 201.3, x2: 150, y2: 201.3 }, { t: 'arrow', x1: 150, y1: 188.1, x2: 106, y2: 188.1 }] } },
          { t: 'Lateral dissection, protect the nerves', d: 'Separate the muscle from the sheath to the linea semilunaris. The neurovascular bundles are the limit.', tip: 'Need more room: robotic transversus abdominis release (TAR).', danger: 'Cutting the neurovascular bundles.', fig: { base: 'wall-xs', hl: ['nvb', 'semi', 'rectus'], marks: [{ t: 'zone', x: 100, y: 168.3, rx: 14, ry: 12, tone: 'danger', label: 'NVB', lx: 100, ly: 247.5 }] } },
          { t: 'Cross the midline (crossover)', d: 'Pass behind the linea alba to the other side and open the posterior sheath at its medial edge, so the linea alba stays intact.', tip: 'An intact linea alba gives a strong anchor for the anterior closure.', danger: 'Entering the hernia sac or the anterior fascia.', fig: { base: 'wall-xs', hl: ['prs', 'sac', 'ars'], marks: [{ t: 'arrow', x1: 150, y1: 211.2, x2: 250, y2: 211.2, cx: 200, cy: 247.5, label: 'Side to side', lx: 200, ly: 283.8 }] } },
          { t: 'Develop the near side', d: 'Develop the retrorectus space on the port side, to the linea semilunaris.', tip: 'The angle is harder on the near side. Without good access: dock from the other side.', fig: { base: 'wall-xs', hl: ['rectus', 'prs'], marks: [{ t: 'arrow', x1: 240, y1: 188.1, x2: 292, y2: 188.1 }] } },
          { t: 'Close the anterior defect', d: 'Close the defect in the anterior fascia and linea alba with a running barbed suture, at low gas pressure.', tip: 'Lower the pressure to 8 mmHg. Include any open diastasis in the closure.', danger: 'Closure under tension: consider TAR.', nurse: '0 slowly absorbable barbed suture.', fig: { base: 'wall-xs', hl: ['ars', 'sac'], marks: [{ t: 'stitch', x1: 168, y1: 115.5, x2: 232, y2: 115.5, n: 7 }] } },
          { t: 'Close the posterior sheath', d: 'Close both posterior sheaths in the midline and repair every hole, so the mesh is separated from the bowel.', tip: 'A barbed absorbable suture is faster.', danger: 'A hole left open: bowel incarcerates between the sheath and the mesh.', nurse: '2-0 or 3-0 barbed suture.', fig: { base: 'wall-xs', hl: ['prs', 'perit'], marks: [{ t: 'stitch', x1: 160, y1: 211.2, x2: 240, y2: 211.2, n: 8 }] } },
          { t: 'Retromuscular mesh', d: 'An uncoated mesh in the space, flat, with at least 5 cm of overlap. Usually no fixation.', tip: 'Release the gas under vision, to see that the mesh does not move.', danger: 'Mesh folded at the edges.', nurse: 'Polypropylene mesh cut to size.', fig: { base: 'wall-xs', hl: ['rectus', 'prs'], marks: [{ t: 'mesh', x: 104, y: 189, w: 192, h: 8 }] } }
        ],
        equipment: [
          { cat: 'Platform', items: ['Three 8 mm robotic ports.', 'Monopolar scissors and bipolar forceps.', 'Suture-cut needle driver.'], alt: ['12 mm assistant port', 'Two sides and two dockings for a wide defect'] },
          { cat: 'Mesh', items: ['Uncoated medium-weight polypropylene mesh.'], alt: ['Preperitoneal mesh for a small hernia', 'Coated mesh when there is no sheath to close'] },
          { cat: 'Sutures', items: ['0 barbed suture for the anterior fascia.', '2-0 or 3-0 barbed suture for the posterior sheath.'] },
          { cat: 'Fixation', items: ['Usually no fixation.'], alt: ['A single stitch or glue'] }
        ],
        pitfalls: [
          { p: 'The side near the ports is hard to develop', fix: 'Place the ports very laterally, or dock a second time from the opposite side.' },
          { p: 'A thin posterior sheath that tears', fix: 'Suture every hole. Where the sheath is missing: switch locally to the preperitoneal plane.' },
          { p: 'A large defect that won’t close', fix: 'Robotic TAR or an open approach.' }
        ]
      }
    ],
    compare: {
      rows: [
        { k: 'When to choose', v: { open: 'Large defect, need for skin excision, previous infection', lap: 'Small to medium defect, simple anatomy', robotic: 'Medium defect, extraperitoneal mesh through a minimally invasive approach' } },
        { k: 'Mesh position', v: { open: 'Retromuscular', lap: 'Intraperitoneal (coated)', robotic: 'Retromuscular or preperitoneal' }, best: 'open' },
        { k: 'Defect closure', v: { open: 'Yes, with component release as needed', lap: 'Yes (plus)', robotic: 'Yes' } },
        { k: 'Wound infections', v: { open: 'More', lap: 'Few', robotic: 'Few' } },
        { k: 'Mesh contact with bowel', v: { open: 'No', lap: 'Yes', robotic: 'No' } },
        { k: 'Fixation', v: { open: 'Minimal', lap: 'Tacks and sutures (pain)', robotic: 'Minimal' } },
        { k: 'Cost and time', v: { open: 'Longer stay', lap: 'Low', robotic: 'Higher time and cost' } }
      ],
      note: 'A qualitative comparison based on CST 14, Sabiston 22 and the EHS/AHS guidelines. The decision depends on the patient and the defect.'
    },
    bailout: ['Defect won’t close without tension: transversus abdominis release (TAR).', 'Still under tension: anterior component separation (usually not both types on the same side).', 'Still no closure: bridging with mesh, knowing recurrence is higher.', 'Bowel injury with contamination: repair the bowel, use an absorbable or biosynthetic mesh, or defer the repair.', 'Minimally invasive approach without safe progress: convert to open.'],
    intraop: [
      { c: 'Bowel injury', do: 'Immediate repair. With significant contamination, reconsider the mesh type and position. A bowel injury predicts failure of later mesh salvage.' },
      { c: 'Bleeding from the inferior epigastric vessels', do: 'Pressure, clips or ligation. Check at low pressure at the end.' },
      { c: 'Tear in the posterior sheath', do: 'Suture with absorbable material. A large hole: bridge with the hernia sac or other tissue.' },
      { c: 'High abdominal pressure after closure', do: 'Check bladder pressure and airway pressure. If they rise a lot: further release or bridging.' }
    ],
    postop: {
      care: ['Multimodal analgesia, nerve blocks or an epidural for a large open operation.', 'Early walking and breathing exercises.', 'Abdominal binder for comfort.', 'Drains: remove when the output falls.', 'Avoid heavy exertion for several weeks, as instructed.', 'Warning signs: fever, worsening pain, vomiting, odor or redness in the wound.'],
      complications: [
        { c: 'Seroma', d: 'Common. Observe; aspirate only if symptomatic or infected.' },
        { c: 'Wound infection', d: 'Open and drain, antibiotics. Negative pressure as needed.' },
        { c: 'Mesh infection', d: 'An extraperitoneal macroporous mesh can usually be salvaged: antibiotics, debridement and negative pressure therapy. A microporous or PTFE mesh usually has to come out.' },
        { c: 'Bowel injury recognized late', d: 'Pain out of proportion, fever and tachycardia. CT and a quick return to the OR.' },
        { c: 'Recurrence', d: 'Mostly at the mesh edges. Repair with a different approach and plane.' },
        { c: 'Enteric fistula', d: 'Initial conservative management. At surgery, remove the whole mesh.' }
      ]
    },
    quiz: [
      { q: 'Which mesh position has the lowest infection and recurrence rates in open repair?', a: ['Onlay', 'Bridging (inlay)', 'Retromuscular (sublay)', 'Intraperitoneal without coating'], c: 2, why: 'In meta-analyses, sublay beats onlay, inlay and underlay for infection and recurrence.' },
      { q: 'What is the lateral limit of the retromuscular dissection?', a: ['The linea alba', 'The linea semilunaris and the neurovascular bundles', 'The costal margin', 'The inguinal ligament'], c: 1, why: 'The neurovascular bundles enter the rectus at the linea semilunaris. Cutting them denervates the muscle.' },
      { q: 'What is the accepted mesh overlap around the defect?', a: ['1 cm', '3–5 cm (aim for 5)', 'No overlap', '15 cm'], c: 1, why: 'The accepted aim is 5 cm of overlap in every direction.' },
      { q: 'What is the small-bites principle in abdominal closure?', a: ['Stitches 2 cm apart', '5 mm bites and a suture-to-wound ratio of at least 4:1', 'Staples only', 'One interrupted stitch every 3 cm'], c: 1, why: 'Bites of about 5 mm from the edge and between stitches, at a 4:1 ratio, reduce incisional hernia (STITCH).' },
      { q: 'What does “plus” mean in IPOM-plus?', a: ['A double mesh', 'Closing the defect before placing the mesh', 'Fixation with sutures only', 'An extra drain'], c: 1, why: 'Closing the fascia before the mesh reduces seroma, bulging and recurrence.' }
    ],
    sources: [
      { b: 'CST14', ref: 'Current Surgical Therapy 14: Incisional, Epigastric, and Umbilical Hernias, pp. 671–678.' },
      { b: 'CST14', ref: 'Current Surgical Therapy 14: Abdominal Wall Reconstruction, pp. 693 onward.' },
      { b: 'CST14', ref: 'Current Surgical Therapy 14: Use of Various Meshes in Hernia Repair, pp. 708 onward.' },
      { b: 'SAB22', ref: 'Sabiston 22, chapter 80: Ventral Hernias, pp. 1063–1082 (mesh position, overlap, small bites).' },
      { b: 'SAB22', ref: 'Sabiston 22, chapter 79: Preoperative Management of the Hernia Patient, pp. 1054–1062.' },
      { b: 'GL', ref: 'European and Americas Hernia Society (EHS and AHS) guidelines for ventral hernia and laparoscopic repair.' },
      { b: 'GL', ref: 'STITCH trial (2015) and EHS 2015 guidelines on abdominal closure with small bites.' }
    ],
    gaps: ['Anterior component separation is described in words only, with no step cards.', 'eTEP is mentioned as an alternative and has no cards of its own.', 'Small umbilical hernia (primary repair or a small mesh) is not shown separately.']
  });
})();
