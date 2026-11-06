/* ORBIT · Adhesive small-bowel obstruction: adhesiolysis ± small-bowel resection (laparoscopic · open). Robotic not relevant.
   Facts checked against CST14 (Management of Small Bowel Obstruction) and Sabiston 22 ch. 91. Text is original and short. */
(function () {
  var O = window.ORBIT;

  /* ---------- anatomy base 1: adhesive band with transition point ---------- */
  O.base('sbo-band', 'Obstruction from an adhesive band: the transition point', function () {
    return '' +
      '<rect data-k="wall" x="0" y="0" width="400" height="34" class="a-perit"/>' +
      '<path data-k="scar" class="a-line" d="M150 6 L250 6" style="stroke-width:3;stroke-dasharray:6 4;opacity:.6"/>' +
      '<path data-k="dil" d="M-10 110 C60 60 150 80 140 140 C130 200 50 190 60 250 C70 290 170 280 200 240 C215 220 225 200 232 184" fill="none" stroke="var(--a-stroke)" stroke-width="40" stroke-linecap="round"/>' +
      '<path data-k="dil" d="M-10 110 C60 60 150 80 140 140 C130 200 50 190 60 250 C70 290 170 280 200 240 C215 220 225 200 232 184" fill="none" stroke="var(--a-bowel)" stroke-width="37" stroke-linecap="round"/>' +
      '<path data-k="coll" d="M240 180 C270 160 300 175 312 200 C324 225 352 232 372 214 C386 200 392 186 410 176" fill="none" stroke="var(--a-stroke)" stroke-width="15" stroke-linecap="round"/>' +
      '<path data-k="coll" d="M240 180 C270 160 300 175 312 200 C324 225 352 232 372 214 C386 200 392 186 410 176" fill="none" stroke="var(--a-bowel)" stroke-width="12.5" stroke-linecap="round"/>' +
      '<path data-k="band" d="M210 34 C214 90 222 140 234 178" fill="none" stroke="#F4F1E6" stroke-width="7" stroke-linecap="round"/>' +
      '<path data-k="band" d="M210 34 C214 90 222 140 234 178" fill="none" stroke="#3A4A58" stroke-width="1" stroke-dasharray="3 3"/>' +
      '<circle data-k="trans" cx="236" cy="182" r="17" fill="none" stroke="#C23B2B" stroke-width="2.2" stroke-dasharray="4 3"/>' +
      '<text class="lbl" x="16" y="58">Dilated (proximal)</text>' +
      '<text class="lbl" x="290" y="264">Collapsed (distal)</text>' +
      '<text class="lbl s" x="226" y="110">Band</text>' +
      '<text class="lbl s" x="254" y="152">Transition point</text>' +
      '<text class="lbl s" x="160" y="24">Old scar / abdominal wall</text>';
  });

  /* ---------- anatomy base 2: viability, mesenteric arcades and resection lines ---------- */
  O.base('bowel-viability', 'Viability, mesenteric arcades and resection lines', function () {
    return '' +
      '<path data-k="mes" class="a-fat" d="M30 120 C120 140 280 140 370 120 L300 280 L100 280 Z"/>' +
      '<path data-k="sma" class="a-art" d="M200 300 L200 238" style="stroke-width:7"/>' +
      '<path data-k="arc" class="a-art" d="M200 238 C150 226 110 200 80 150 M200 238 C250 226 290 200 320 150 M200 238 C190 200 170 170 150 140 M200 238 C210 200 230 170 250 140 M80 150 C110 136 130 136 150 140 M150 140 C180 134 220 134 250 140 M250 140 C280 136 300 136 320 150" style="stroke-width:2.6"/>' +
      '<path data-k="vr" class="a-art" d="M100 136 L96 112 M124 136 L122 112 M176 136 L176 112 M224 136 L224 112 M276 136 L278 112 M300 140 L304 112" style="stroke-width:1.6"/>' +
      '<path data-k="bowel" class="a-bowel" d="M10 70 C120 56 280 56 390 70 L390 118 C280 104 120 104 10 118 Z"/>' +
      '<path data-k="isch" d="M150 62 C180 58 220 58 250 62 L250 108 C220 104 180 104 150 108 Z" fill="#6E3B5C" stroke="#3A4A58" stroke-width="1"/>' +
      '<path data-k="edge" class="a-dash" d="M130 56 L130 124 M270 56 L270 124" style="stroke:#0C8F80;stroke-width:2"/>' +
      '<text class="lbl" x="200" y="50" text-anchor="middle">Ischemic segment</text>' +
      '<text class="lbl s" x="56" y="94">Viable bowel</text>' +
      '<text class="lbl s" x="314" y="94">Viable bowel</text>' +
      '<text class="lbl s" x="212" y="290">SMA branch</text>' +
      '<text class="lbl s" x="40" y="190">Arcades</text>' +
      '<text class="lbl s" x="300" y="210">Mesentery</text>';
  });

  /* ---------- cover ---------- */
  O.cover('adhesiolysis-sbo', function () {
    return '<path class="f-w2" d="M30 90 C50 50 110 50 126 84 C140 112 110 132 84 138 C60 144 44 170 66 186 C90 200 130 186 150 160" stroke-width="2"/>' +
      '<path class="s-w" d="M30 90 C50 50 110 50 126 84 C140 112 110 132 84 138 C60 144 44 170 66 186 C90 200 130 186 150 160" stroke-width="22" opacity=".18"/>' +
      '<path class="s-g" d="M160 30 C164 80 170 120 176 150" stroke-width="5"/>' +
      '<circle cx="178" cy="154" r="14" class="s-r" stroke-width="2.5" stroke-dasharray="4 3"/>' +
      '<path class="s-t" d="M190 160 C220 140 250 150 262 176 C272 196 292 200 306 186" stroke-width="8"/>' +
      '<g transform="translate(168 96)"><circle cx="-5" cy="-7" r="4" class="s-w" stroke-width="2"/><circle cx="5" cy="-7" r="4" class="s-w" stroke-width="2"/><path d="M-3 -3 L6 10 M3 -3 L-6 10" class="s-w" stroke-width="2"/></g>';
  });

  O.register({
    id: 'adhesiolysis-sbo',
    title: 'Small-bowel obstruction: adhesiolysis and bowel resection',
    title_en: 'Adhesive SBO: adhesiolysis ± small-bowel resection',
    system: 'smallbowel', organ: 'Small bowel', difficulty: 3, setting: 'Emergency',
    tags: ['bowel obstruction', 'SBO', 'adhesions', 'adhesiolysis', 'adhesive band', 'Gastrografin', 'closed loop', 'small-bowel resection', 'anastomosis', 'acute abdomen'],
    student: {
      summary: 'Most small-bowel obstructions are caused by adhesions after previous surgery. Most settle with conservative treatment. Operate when there are signs of strangulation, a closed-loop obstruction or failed conservative treatment. At surgery, release the obstruction, assess viability and resect only bowel that isn’t viable.',
      points: ['Resuscitation first, correct electrolytes and pass a nasogastric tube.', 'Fever, tachycardia, localized tenderness or acidosis suggest strangulation.', 'Water-soluble contrast reaching the colon within 24 hours predicts resolution without surgery.', 'At laparoscopy, grasp the collapsed bowel, not the dilated bowel.', 'Doubtful bowel: warm it, wait and look again before resecting.']
    },
    overview: {
      facts: [{ v: '2–4%', l: 'Of ED visits for abdominal pain (CST)' }, { v: '≤16%', l: 'Of surgical admissions' }, { v: '24 h', l: 'Contrast in the colon predicts resolution' }, { v: '15–20 min', l: 'Wait with warm packs before deciding on viability' }],
      indications: ['Signs of strangulation or peritonitis.', 'Closed-loop obstruction, volvulus or signs of ischemia on CT.', 'Clinical deterioration: persistent pain, fever, tachycardia, acidosis.', 'Failed conservative treatment after 2–3 days, or contrast that hasn’t reached the colon.', 'Obstruction in a virgin abdomen: look for a hernia, a tumor or another cause.'],
      contraindications: ['For laparoscopy: very dilated bowel with no working space, a heavily operated abdomen, instability.', 'Stable partial obstruction: start with conservative treatment.', 'Diffuse carcinomatosis: consider palliative care.'],
      choice: ['Laparoscopy: in a stable, suitable patient. Predictors of success: two or fewer laparotomies, appendectomy as the only previous operation, no previous midline incision and a single adhesive band (CST).', 'Open: very dilated bowel, dense adhesions, suspected extensive necrosis or instability.', 'Low threshold to convert: there’s no honor in pushing on with an unsafe laparoscopy.', 'Robotic: not standard for an emergency case like this.']
    },
    anatomy: {
      figures: [
        { base: 'sbo-band', hotspots: [
          { x: 236, y: 206, label: 'Transition point', text: 'Where dilated bowel becomes collapsed. This is where the band or the cause lies. Look for it on the CT beforehand.' },
          { x: 210, y: 80, label: 'Adhesive band', text: 'Usually a single band from an old scar to the wall or to bowel. Divide it with cold scissors close to the wall.' },
          { x: 62, y: 250, label: 'Dilated bowel', text: 'Thin, fragile wall. Don’t grasp it. Move it gently with the flat of the instrument only.' },
          { x: 340, y: 226, label: 'Collapsed bowel', text: 'The safe starting point: from the cecum, run back along the collapsed bowel to the transition point.' },
          { x: 120, y: 12, label: 'Previous scar', text: 'Adhesions cluster under scars. Enter the abdomen away from them.' }
        ] },
        { base: 'bowel-viability', hotspots: [
          { x: 200, y: 84, label: 'Signs of viability', text: 'Pink color, peristalsis, serosal sheen and mesenteric pulse. In doubt: warm and wait 15–20 minutes. ICG helps decide.' },
          { x: 130, y: 132, label: 'Resection line', text: 'At margins of healthy bowel that bleeds when cut. Don’t divide where the wall is dark.' },
          { x: 200, y: 168, label: 'Mesenteric arcades', text: 'Dividing the mesentery close to the bowel preserves supply to the margins. A straight vessel (vasa recta) reaches each segment.' },
          { x: 200, y: 262, label: 'Mesenteric defect closure', text: 'After the anastomosis, close the defect to prevent an internal hernia.' }
        ] }
      ],
      landmarks: [
        { name: 'Ligament of Treitz', why: 'The start of the small bowel. A full run goes from here to the cecum.' },
        { name: 'Cecum and terminal ileum', why: 'The starting point for running back along the collapsed bowel.' },
        { name: 'Transition point', why: 'The site of the cause. That’s where you work.' },
        { name: 'Hernia orifices', why: 'Groin, femoral, umbilical, scars and internal openings. Must be checked in a virgin abdomen.' },
        { name: 'Mesenteric vessels', why: 'Protect them during adhesiolysis and resection.' }
      ]
    },
    preop: {
      workup: ['Physical exam including hernia orifices and scars.', 'CBC, electrolytes, renal function, lactate and blood gas.', 'CT with IV contrast: transition point, closed loop, free fluid, non-enhancing wall.', 'Partial obstruction without strangulation: water-soluble contrast challenge (100 mL Gastrografin via the NG tube) and an X-ray at 24 hours.'],
      consent: ['Bowel resection and anastomosis. Sometimes a stoma.', 'Bowel injury during adhesiolysis (enterotomy).', 'Conversion to open surgery.', 'Anastomotic leak, infection and incisional hernia.', 'Recurrent adhesions and obstruction in the future.'],
      antibiotics: ['A dose before incision (for example cefazolin). When resection is planned, add anaerobic cover per protocol.', 'Necrosis or perforation: a full antibiotic course according to the findings.'],
      vte: ['Mechanical prophylaxis for everyone.', 'Pharmacologic prophylaxis by risk, usually already started on the ward.'],
      bowelPrep: ['Not relevant. Empty the stomach via the NG tube before induction (aspiration risk).'],
      special: ['Fluid resuscitation and potassium correction before surgery, without delaying an urgent operation.', 'Conservative treatment up to 72 hours without signs of strangulation (Bologna 2017).', 'After gastric bypass: suspected internal hernia means early surgery even when the CT is subtle.', 'Early postoperative obstruction (3–4 weeks): usually conservative, watching for strangulation.']
    },
    approaches: [
      {
        key: 'lap', kind: 'lap', label: 'Laparoscopic',
        setup: {
          position: { kind: 'supine', tilt: -10, roll: 'left', pressure: ['occiput', 'elbow', 'sacrum', 'heel'] },
          room: { arms: { R: 'tucked', L: 'tucked' }, legs: 'together', staff: [{ w: 'S', s: 'Lt2' }, { w: 'C', s: 'Lt1' }, { w: 'N', s: 'RtFoot' }], monitors: ['RtFar2', 'RtFar3'] },
          notes: ['Supine, well secured: the table will tilt in every direction.', 'Both arms tucked, so you can move around the table.', 'Nasogastric tube and urinary catheter.', 'Drape for a full midline laparotomy.'],
          arms: ['Both arms tucked and padded.'],
          team: ['Surgeon and camera on the side opposite the expected transition point, usually on the left.', 'Monitors move with the working area.', 'Laparotomy tray open and ready.']
        },
        access: {
          target: { x: 110, y: 250, rx: 46, ry: 30, label: 'Transition point' },
          incisions: [{ id: 'midline-full', label: 'Previous scar (stay away from it)', alt: true, lx: 176, ly: 150 }],
          ports: [
            { x: 236, y: 196, mm: 12, role: 'camera', label: 'Left side, open entry away from scars. Camera', n: 1 },
            { x: 226, y: 110, mm: 5, role: 'work', label: 'Left upper quadrant (near Palmer’s point)', n: 2 },
            { x: 218, y: 282, mm: 5, role: 'work', label: 'Left lower quadrant', n: 3 }
          ],
          notes: ['Open entry (Hasson) only, away from scars and dilated bowel.', 'Palmer’s point: below the left costal margin in the midclavicular line.', 'Low pneumoperitoneum pressure helps ventilation when the abdomen is distended.', 'Add ports according to where the obstruction is found.'],
          caption: 'Anterior view. The patient’s right is on the left of the figure. The dashed line marks a previous scar.'
        },
        steps: [
          { t: 'Safe entry and survey', d: 'Open entry on the flank, away from scars. Survey the fluid, bowel color and site of obstruction.', tip: 'Bloody or turbid fluid suggests strangulation. That lowers the threshold to convert.', danger: 'Blind entry into a distended abdomen: bowel injury.', nurse: 'Hasson port, 30° scope, atraumatic bowel graspers.', fig: { view: 'access' } },
          { t: 'Take down adhesions to the wall', d: 'Free omental and bowel adhesions from the abdominal wall to create working space.', tip: 'Sharp division with cold scissors close to the abdominal wall, not the bowel.', danger: 'Energy near the bowel: a thermal injury that shows up only days later.', nurse: 'Laparoscopic scissors without cautery.', fig: { base: 'sbo-band', hl: ['wall', 'scar', 'band'], marks: [{ t: 'cut', x1: 196, y1: 40, x2: 226, y2: 40 }] } },
          { t: 'From collapsed bowel to the transition point', d: 'Start at the cecum and run back along the collapsed bowel to the transition point.', tip: 'Grasp the collapsed bowel or its mesentery. Hand over hand in short segments.', danger: 'Grasping dilated bowel tears it.', nurse: 'Two atraumatic bowel graspers.', fig: { base: 'sbo-band', hl: ['coll', 'trans'], marks: [{ t: 'arrow', x1: 392, y1: 196, x2: 262, y2: 182, cx: 330, cy: 250, label: 'Back from cecum', lx: 330, ly: 290 }] } },
          { t: 'Divide the band', d: 'Divide the adhesive band sharply and free the bowel at the transition point.', tip: 'Before cutting, see both sides of the band and the bowel beneath it.', danger: 'A “band” that is really adherent bowel or a mesenteric vessel.', nurse: 'Cold scissors, clips available.', fig: { base: 'sbo-band', hl: ['band', 'trans', 'dil', 'coll'], marks: [{ t: 'cut', x1: 204, y1: 120, x2: 236, y2: 112 }] } },
          { t: 'Assess viability', d: 'Check the compressed bowel: color, peristalsis and pulse. In doubt: warm it, wait 15–20 minutes and look again.', tip: 'IV ICG helps tell viable from non-viable bowel.', danger: 'Needless resection of bowel that would have recovered, or leaving necrotic bowel behind.', nurse: 'Prepare ICG, warm packs if converting.', fig: { base: 'bowel-viability', hl: ['isch', 'bowel', 'arc'], marks: [{ t: 'zone', x: 200, y: 84, rx: 62, ry: 34, tone: 'danger', label: 'Recheck' }] } },
          { t: 'Run the whole bowel', d: 'Run the whole small bowel from the cecum to Treitz: another obstruction, wall injury or perforation.', tip: 'Count in 10 cm segments between two graspers.', danger: 'A small serosal injury left unrepaired. Repair every deep injury.', nurse: '3-0 suture for serosal repair.', fig: { base: 'sbo-band', hl: ['dil', 'coll'], marks: [{ t: 'dot', x: 110, y: 276 }, { t: 'dot', x: 140, y: 120 }, { t: 'dot', x: 312, y: 200 }] } },
          { t: 'Resection and anastomosis as needed', d: 'Non-viable bowel: deliver it through a small incision with a wound protector, resect and do a stapled side-to-side anastomosis.', tip: 'Divide the mesentery close to the bowel and close the mesenteric defect.', danger: 'Anastomosis on edematous or doubtful bowel. You can leave the bowel stapled closed and plan a second look.', nurse: 'Wound protector, 60–80 mm linear stapler, vascular load, 3-0 suture.', fig: { base: 'bowel-viability', hl: ['isch', 'mes', 'arc', 'edge'], marks: [{ t: 'staple', pts: ['130 56', '130 124'] }, { t: 'staple', pts: ['270 56', '270 124'] }] } },
          { t: 'Convert in time', d: 'Go open when there’s no working space, the adhesions are dense, a bowel injury can’t be controlled or a long resection is needed.', tip: 'Early conversion is a good decision, not a failure.', danger: 'A missed bowel injury greatly raises mortality.', nurse: 'Laparotomy tray open.', fig: { view: 'access', over: { incisions: [{ id: 'midline-full', label: 'Midline laparotomy', lx: 176, ly: 150 }] } } }
        ],
        equipment: [
          { cat: 'Optics and access', items: ['10 or 5 mm 30° scope.', '12 mm Hasson port and two 5 mm ports.'], alt: ['5 mm scope that moves between ports', 'Optical port entry at Palmer’s point'] },
          { cat: 'Grasping and dissection', items: ['Atraumatic bowel graspers (such as laparoscopic Johann or Babcock).', 'Cold laparoscopic scissors.'], alt: ['Energy device for the mesentery only', 'Maryland forceps for thin adhesions'] },
          { cat: 'Viability and resection', items: ['ICG dye and a compatible camera.', 'Wound protector for extraction.', '60 or 80 mm linear stapler.'], alt: ['Intracorporeal resection and anastomosis', 'Hand-sewn two-layer anastomosis'] },
          { cat: 'Sutures', items: ['3-0 absorbable suture for serosal repair and closing the stapler opening.', '0 suture for fascia.'] }
        ],
        pitfalls: [
          { p: 'Grasping dilated bowel', fix: 'Work from the collapsed bowel. Move dilated bowel with the side of the instrument only.' },
          { p: 'Cautery near the bowel', fix: 'Cold cutting. Energy only in the mesentery and away from the wall.' },
          { p: 'Stopping after the first band', fix: 'Run the whole bowel. There may be a second point of obstruction.' },
          { p: 'Insisting on laparoscopy', fix: 'Set your conversion criteria in advance and stick to them.' }
        ]
      },
      {
        key: 'open', kind: 'open', label: 'Open (laparotomy)',
        setup: {
          position: { kind: 'supine', tilt: 0, pressure: ['occiput', 'elbow', 'sacrum', 'heel'] },
          room: { arms: { R: 'out', L: 'out' }, legs: 'together', staff: [{ w: 'S', s: 'Rt2' }, { w: 'A', s: 'Lt2' }, { w: 'N', s: 'Rt3' }] },
          notes: ['Supine.', 'Nasogastric tube and urinary catheter.', 'Prep from chest to thighs.'],
          arms: ['Both arms out to 90°.'],
          team: ['Surgeon on the right, assistant on the left.', 'Self-retaining retractor ready before incision.']
        },
        access: {
          target: { x: 150, y: 240, rx: 70, ry: 44, label: 'Small bowel' },
          incisions: [
            { id: 'midline-full', label: 'Midline. Enter at the end of the scar, in unoperated territory, and extend from there', lx: 176, ly: 150 },
            { id: 'transverse-RUQ', label: 'Other previous incision: adapt the entry', alt: true, lx: 100, ly: 160 }
          ],
          notes: ['Enter the peritoneum above or below the old scar, where there are no adhesions to the wall.', 'Closure at the end: running slowly absorbable suture, small bites and a 4:1 suture-to-wound length ratio (Sabiston).']
        },
        steps: [
          { t: 'Enter the abdomen', d: 'A midline incision entering the peritoneum in unoperated territory, then careful division of adhesions to the wall.', tip: 'Lift the fascial edges with clamps and work sharply between the wall and the bowel.', danger: 'Injury to bowel stuck right under the scar.', fig: { view: 'access' } },
          { t: 'Adhesiolysis', d: 'Sharp division with scissors under gentle tension until all the bowel is free.', tip: 'Start where it’s easy and work toward where it’s hard. Don’t pull with force.', danger: 'Serosal tears and wall injury. Mark and repair every injury.', fig: { base: 'sbo-band', hl: ['wall', 'band', 'dil'], marks: [{ t: 'cut', x1: 196, y1: 40, x2: 226, y2: 40 }] } },
          { t: 'Release the obstruction and run the bowel', d: 'Find the transition point, release it and run the whole bowel from Treitz to the cecum.', tip: 'You can gently milk the dilated bowel back toward the stomach, into the NG tube.', danger: 'Aggressive milking tears edematous bowel.', fig: { base: 'sbo-band', hl: ['trans', 'dil', 'coll'], marks: [{ t: 'arrow', x1: 120, y1: 230, x2: 40, y2: 150, cx: 50, cy: 230, label: 'Toward stomach', lx: 60, ly: 290 }] } },
          { t: 'Viability', d: 'In doubt: warm packs for 15–20 minutes and recheck color, peristalsis and pulse. ICG if available.', tip: 'With many doubtful segments: minimal resection and a planned second look.', fig: { base: 'bowel-viability', hl: ['isch', 'arc'] } },
          { t: 'Resection and anastomosis', d: 'Resect to healthy margins and do a stapled or hand-sewn side-to-side anastomosis. Close the mesenteric defect.', tip: 'In an unstable patient: damage control, leave the ends closed and come back after stabilization.', danger: 'Anastomosis in a patient in shock or on doubtful bowel.', fig: { base: 'bowel-viability', hl: ['isch', 'edge', 'mes'], marks: [{ t: 'staple', pts: ['130 56', '130 124'] }, { t: 'staple', pts: ['270 56', '270 124'] }, { t: 'stitch', x1: 160, y1: 160, x2: 240, y2: 160, n: 6 }] } },
          { t: 'Closure', d: 'Close the fascia with a running small-bite suture. In a very tense abdomen, consider a temporary open abdomen.', tip: 'A 4:1 ratio of suture length to wound length.', danger: 'Closure under tension: abdominal compartment syndrome or wound dehiscence.', fig: { view: 'access' } }
        ],
        equipment: [
          { cat: 'Opening and exposure', items: ['Laparotomy set.', 'Self-retaining retractor (Bookwalter or Omni).', 'Warm moist packs.'], alt: ['Large wound protector'] },
          { cat: 'Dissection', items: ['Metzenbaum scissors.', 'DeBakey forceps.', 'Babcock clamps.'] },
          { cat: 'Resection and anastomosis', items: ['60 or 80 mm GIA stapler.', 'TA stapler to close the opening, or suture.', 'Soft bowel clamps (Doyen).'], alt: ['Hand-sewn one- or two-layer anastomosis', 'Energy device for the mesentery'] },
          { cat: 'Sutures', items: ['3-0 absorbable suture for serosa and anastomosis.', 'Looped slowly absorbable suture for fascial closure.'], alt: ['Temporary open abdomen dressing (VAC)'] }
        ]
      },
      {
        key: 'robotic', kind: 'robotic', label: 'Robotic', status: 'na',
        naReason: 'This is an emergency operation, sometimes in an unstable patient with a distended abdomen. Docking a robot lengthens the case and makes rapid conversion harder. The robotic approach has no proven advantage here.'
      }
    ],
    compare: {
      rows: [
        { k: 'When to choose', v: { lap: 'Stable patient, few previous operations, suspected single band', open: 'Very dilated bowel, dense adhesions, necrosis or instability' } },
        { k: 'Advantages', v: { lap: 'Fewer complications, fewer infections, shorter stay, fewer new adhesions', open: 'Palpation, control and speed in a hostile abdomen' } },
        { k: 'Risk of bowel injury', v: { lap: 'Higher with dense adhesions. An injury may be missed', open: 'Lower risk of missing one' }, best: 'open' },
        { k: 'Conversion', v: { lap: 'Common. Part of the plan', open: 'Not relevant' } },
        { k: 'Recovery', v: { lap: 'Fast', open: 'Slow' }, best: 'lap' }
      ],
      note: 'A qualitative comparison. The meta-analyses cited in CST are not randomized.'
    },
    bailout: ['Lower the pneumoperitoneum pressure and change position.', 'Add a port and move the camera to another port.', 'A small incision over the transition point (hand-assisted or extraction).', 'Convert to laparotomy.', 'Damage control: resection, closed ends, temporary open abdomen and return after stabilization.', 'A planned second look when viability is in doubt.'],
    intraop: [
      { c: 'Enterotomy', do: 'Mark it at once with a clip or stitch. Repair transversely in one or two layers. A large injury or several close together: resect.' },
      { c: 'Serosal injury', do: 'Deep injury down to muscle: Lembert sutures.' },
      { c: 'Limited necrosis', do: 'Resect to healthy margins and anastomose.' },
      { c: 'Extensive or doubtful necrosis', do: 'Minimal resection, leave bowel that may be viable and do a second look within 24–48 hours.' },
      { c: 'Mesenteric bleeding', do: 'Pressure and control of the visible vessel. Preserve the arcades.' }
    ],
    postop: {
      care: ['NG tube until function returns, guided by the clinical picture.', 'Gradual feeding once there is flatus and less NG output.', 'Correct fluids and electrolytes.', 'Early walking and VTE prophylaxis.', 'After resection: watch for signs of leak.'],
      complications: [
        { c: 'Prolonged ileus', d: 'Common. Supportive care and rule out a mechanical cause.' },
        { c: 'Missed bowel injury', d: 'Peritonitis or sepsis on days 2–4. CT and reoperation.' },
        { c: 'Anastomotic leak', d: 'Fever, pain, tachycardia. Drainage or surgery depending on the situation.' },
        { c: 'Wound infection and incisional hernia', d: 'Common after emergency laparotomy. Good closure reduces hernia.' },
        { c: 'Recurrent obstruction', d: 'Common over the years. Manage with the same algorithm.' }
      ]
    },
    quiz: [
      { q: 'Which finding is not suitable for conservative treatment of adhesive obstruction?', a: ['Partial obstruction without signs of strangulation', 'A closed loop on CT', 'Pain relief after NG decompression', 'Contrast that has reached the colon'], c: 1, why: 'A closed loop greatly raises the risk of strangulation and needs surgery.' },
      { q: 'What predicts resolution without surgery on a water-soluble contrast study?', a: ['Contrast in the stomach at 4 hours', 'Contrast in the colon within 24 hours', 'Vomiting the contrast', 'Contrast in the duodenum'], c: 1, why: 'Reaching the colon within 24 hours predicts that the obstruction will resolve.' },
      { q: 'At laparoscopy, where do you start running the bowel?', a: ['From the dilated bowel near Treitz', 'From the cecum, back along the collapsed bowel', 'From the stomach', 'Anywhere at random'], c: 1, why: 'Collapsed bowel is safe to grasp and leads straight to the transition point.' },
      { q: 'A segment of bowel is dark after releasing the obstruction. What is the first step?', a: ['Resect at once', 'Warm it, wait 15–20 minutes and look again', 'Close the abdomen', 'Oversew the segment'], c: 1, why: 'Some bowel recovers after release. ICG can help the decision.' },
      { q: 'What predicts a successful laparoscopic approach?', a: ['Four previous laparotomies', 'A single adhesive band and appendectomy as the only previous operation', 'Bowel dilated to 6 cm', 'Hemodynamic instability'], c: 1, why: 'Per CST, few previous operations and a single band predict success.' }
    ],
    sources: [
      { b: 'CST14', ref: 'Chapter in Current Surgical Therapy 14: Management of Small Bowel Obstruction, pp. 129–134.' },
      { b: 'SAB22', ref: 'Sabiston 22, chapter 91: Small Intestine, pp. 1320–1373 (obstruction, strangulation and viability on pp. 1332–1336).' },
      { b: 'SAB22', ref: 'Sabiston 22, chapter 80: Ventral Hernias (small-bite laparotomy closure).' },
      { b: 'GL', ref: 'WSES guidelines for adhesive small bowel obstruction (Bologna guidelines), 2017 update.' },
      { b: 'GL', ref: 'EAST guidelines for small bowel obstruction.' }
    ],
    gaps: ['The robotic approach is marked as not relevant.', 'No separate section on internal hernia after gastric bypass or on malignant obstruction.', 'Port placement varies widely with the scars. The map is an example.']
  });
})();
