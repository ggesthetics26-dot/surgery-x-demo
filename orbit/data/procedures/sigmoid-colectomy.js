/* ORBIT · Sigmoid colectomy / anterior resection (laparoscopic · robotic · open).
   Facts checked against CST14 (Colon Cancer; Diverticular Disease; Bowel Preparation; Rectal Cancer) and Sabiston 22 ch. 95–96, ch. 22. Text is original and short. */
(function () {
  var O = window.ORBIT;

  /* ---------- anatomy base 1: left colon vessels and retroperitoneum, anterior view ---------- */
  O.base('sig-vessels', 'Left colon vessels and the retroperitoneum', function () {
    return '' +
      '<path data-k="prom" class="a-bone" d="M120 300 C130 262 168 244 200 244 C232 244 270 262 280 300 Z"/>' +
      '<path data-k="sb" class="a-bowel" d="M196 6 C222 2 252 10 262 28 C252 38 232 38 214 30 C204 24 196 16 196 6 Z"/>' +
      '<path data-k="gonad" class="a-vein" d="M322 70 C318 140 306 210 290 296" style="stroke-width:3;opacity:.8"/>' +
      '<path data-k="ureter" class="a-ureterO" d="M300 60 C298 130 290 200 262 270 L248 300" style="stroke-width:7"/>' +
      '<path data-k="ureter" class="a-ureter" d="M300 60 C298 130 290 200 262 270 L248 300" style="stroke-width:5"/>' +
      '<path data-k="colon" class="a-colon" d="M330 6 L392 6 L392 30 C370 32 364 44 364 70 L364 186 C364 214 352 230 330 236 L330 206 C338 200 340 190 340 178 L340 60 C340 36 336 20 330 6 Z"/>' +
      '<path data-k="sigmoid" class="a-colon" d="M330 206 C300 200 262 206 250 224 C238 242 262 258 284 254 C306 250 312 270 296 284 C280 296 248 296 222 286 L218 300 L198 300 L200 280 C232 286 262 286 276 276 C290 266 280 262 266 266 C238 272 220 252 230 228 C244 196 290 184 330 180 Z"/>' +
      '<path data-k="aorta" class="a-artf" d="M188 10 L212 10 L212 220 L242 296 L226 300 L200 236 L174 300 L158 296 L188 220 Z" opacity=".95"/>' +
      '<path data-k="ivc" class="a-veinf" d="M150 10 L176 10 L176 222 L150 222 Z" opacity=".55"/>' +
      '<path data-k="ima" class="a-art" d="M210 120 C224 132 236 148 244 168" style="stroke-width:6"/>' +
      '<path data-k="lca" class="a-art" d="M232 144 C262 132 296 110 340 92" style="stroke-width:4"/>' +
      '<path data-k="sig" class="a-art" d="M244 168 C266 178 290 186 318 192 M250 184 C262 200 270 214 272 230" style="stroke-width:3"/>' +
      '<path data-k="sra" class="a-art" d="M244 168 C242 200 232 240 214 282" style="stroke-width:4.5"/>' +
      '<path data-k="imv" class="a-vein" d="M266 30 C268 80 270 130 266 176" style="stroke-width:5"/>' +
      '<path data-k="nerve" class="a-nerve" d="M196 150 C192 180 194 206 200 226 M206 150 C210 180 208 206 200 226 M200 226 C190 252 176 276 166 300 M200 226 C212 252 226 276 236 300" style="stroke-width:2.6"/>' +
      '<text class="lbl s" x="176" y="60" text-anchor="end">Aorta</text>' +
      '<text class="lbl s" x="232" y="120">IMA</text>' +
      '<text class="lbl s" x="296" y="102" text-anchor="end">Left colic a.</text>' +
      '<text class="lbl s" x="276" y="64">IMV</text>' +
      '<text class="lbl s" x="196" y="270" text-anchor="end">SRA</text>' +
      '<text class="lbl s" x="314" y="150" text-anchor="end">Ureter</text>' +
      '<text class="lbl s" x="160" y="250" text-anchor="end">Hypogastric n.</text>' +
      '<text class="lbl s" x="200" y="296" text-anchor="middle">Promontory</text>' +
      '<text class="lbl s" x="226" y="20" text-anchor="end">Treitz</text>' +
      '<text class="lbl s" x="384" y="20" text-anchor="end">Splenic flexure</text>' +
      '<text class="lbl s" x="372" y="130" text-anchor="middle" transform="rotate(90 372 130)">Descending</text>' +
      '<text class="lbl s" x="296" y="226" text-anchor="middle">Sigmoid</text>';
  });

  /* ---------- anatomy base 2: double-stapled colorectal anastomosis and the mesorectal envelope ---------- */
  O.base('cr-anast', 'Double-stapled colorectal anastomosis and the mesorectal envelope', function () {
    return '' +
      '<path data-k="sacrum" class="a-bone" d="M330 40 C360 100 362 180 330 250 C318 276 300 292 280 300 L300 300 C330 286 352 260 366 230 C392 170 390 90 356 30 Z"/>' +
      '<path data-k="meso" class="a-fat" d="M150 170 C150 156 178 150 200 150 C226 150 268 156 280 176 C292 210 288 262 250 296 L170 296 C150 270 146 210 150 170 Z"/>' +
      '<path data-k="fascia" class="a-dash" d="M146 168 C144 156 178 146 200 146 C226 146 272 152 284 176 C298 212 292 264 254 300" style="stroke-width:1.6"/>' +
      '<path data-k="rectum" class="a-colon" d="M178 300 L178 196 C178 186 186 182 200 182 C214 182 222 186 222 196 L222 300 Z"/>' +
      '<path data-k="colon" class="a-colon" d="M150 10 C160 40 176 70 178 98 L178 120 C178 130 186 134 200 134 C214 134 222 130 222 120 L222 98 C224 70 236 40 248 10 Z"/>' +
      '<path data-k="anvil" class="a-line" d="M176 132 L224 132 C224 142 214 148 200 148 C186 148 176 142 176 132 Z" style="fill:#9AA7B4"/>' +
      '<path data-k="stapler" d="M196 300 L196 192 L204 192 L204 300 Z" fill="#6E7F90" opacity=".75"/>' +
      '<path class="a-dash" d="M200 148 L200 190" style="opacity:.6"/>' +
      '<text class="lbl s" x="252" y="40">Descending colon</text>' +
      '<text class="lbl s" x="232" y="140">Anvil</text>' +
      '<text class="lbl s" x="230" y="236">Rectal stump</text>' +
      '<text class="lbl s" x="102" y="214">Mesorectal fascia</text>' +
      '<text class="lbl s" x="324" y="150" text-anchor="end">Sacrum</text>';
  });

  O.cover('sigmoid-colectomy', function () {
    return '<path class="s-w" d="M120 40 L250 40 C270 40 278 52 278 70 L278 120" stroke-width="15" opacity=".35"/>' +
      '<path class="s-t" d="M278 120 C278 150 250 150 220 150 C190 150 188 178 210 184 C230 190 222 206 200 206 L170 206 L170 196" stroke-width="15"/>' +
      '<path class="s-w" d="M150 186 L150 70" stroke-width="7"/>' +
      '<path class="s-r" d="M150 110 C168 124 182 140 190 158" stroke-width="4"/>' +
      '<path class="s-r" d="M175 135 C200 124 230 112 262 104" stroke-width="3"/>' +
      '<g><rect x="178" y="128" width="5" height="16" rx="1.5" class="c-w" transform="rotate(-30 180 136)"/><rect x="186" y="136" width="5" height="16" rx="1.5" class="c-w" transform="rotate(-30 188 144)"/></g>' +
      '<path class="s-w" d="M150 186 L194 186" stroke-width="3" stroke-dasharray="3 3"/>' +
      '<text x="28" y="182" class="c-w" style="font:700 14px Inter,sans-serif;letter-spacing:.06em">IMA</text>';
  });

  O.register({
    id: 'sigmoid-colectomy',
    title: 'Sigmoid colectomy / anterior resection',
    title_en: 'Sigmoid colectomy · anterior resection (laparoscopic · robotic · open)',
    system: 'colorectal', organ: 'Sigmoid and upper rectum', difficulty: 3, setting: 'Elective and urgent',
    tags: ['sigmoid colectomy', 'sigmoid', 'anterior resection', 'left colectomy', 'diverticular disease', 'diverticulitis', 'IMA', 'TME', 'LAR', 'Hartmann', 'colon cancer', 'anastomosis'],
    student: {
      summary: 'Removal of the sigmoid colon and joining the descending colon to the upper rectum. In cancer, the inferior mesenteric artery (IMA) is ligated close to its origin. In diverticulitis, the anastomosis must be on the rectum, not on retained sigmoid.',
      points: ['Identify the left ureter before dividing any vessel.', 'The hypogastric nerves run over the sacral promontory. Protect them.', 'The anastomosis must be tension-free: sometimes the splenic flexure has to be mobilized.', 'For a low rectal tumor, the whole mesorectum is removed (TME).']
    },
    overview: {
      facts: [{ v: '≥12', l: 'Lymph nodes in cancer' }, { v: '5 cm', l: 'Distal margin for an upper rectal tumor' }, { v: '1 cm', l: 'Enough for a low tumor if the whole mesorectum is removed' }, { v: '95% vs 72%', l: 'Stoma-free at one year: anastomosis vs Hartmann in perforation (LADIES)' }],
      indications: ['Cancer of the sigmoid and upper rectum.', 'Recurrent diverticulitis that affects quality of life, or disease with fistula or stricture.', 'Perforated diverticulitis with generalized peritonitis (urgent).', 'Sigmoid volvulus after endoscopic detorsion.', 'Polyp that cannot be removed endoscopically.'],
      contraindications: ['Unfit for general anesthesia.', 'Rectal tumor that needs neoadjuvant treatment: chemoradiation or total neoadjuvant therapy comes first. Surgery follows.', 'Relative, for laparoscopy: dilated bowel in obstruction, dense adhesions, instability.', 'Relative, for primary anastomosis: shock, fecal peritonitis, poor nutrition, high-dose steroids.'],
      choice: ['Default: minimally invasive when expertise is available.', 'Robotic: an advantage in a narrow pelvis and in low rectal tumors. Fewer conversions, but longer and more expensive.', 'Open: emergency with perforation, unstable patient, adhesions or an invasive tumor.', 'Urgent: primary anastomosis with or without a diverting ileostomy, or Hartmann in a high-risk patient.']
    },
    anatomy: {
      figures: [
        { base: 'sig-vessels', hotspots: [
          { x: 222, y: 108, label: 'IMA origin (high ligation)', text: 'Ligation near the origin adds lymph nodes and length for the anastomosis. Leave about 1–2 cm from the aorta to avoid the superior hypogastric plexus.' },
          { x: 254, y: 154, label: 'Low ligation', text: 'Below the origin of the left colic artery. Preserves blood flow to the descending colon. Suitable for diverticulitis.' },
          { x: 282, y: 40, label: 'IMV near Treitz', text: 'Dividing the vein at the lower border of the pancreas, near the ligament of Treitz, gives plenty of length for a low anastomosis.' },
          { x: 314, y: 190, label: 'Left ureter and gonadal vessels', text: 'Identify them before dividing vessels. The ureter crosses the iliac artery near its bifurcation.' },
          { x: 184, y: 214, label: 'Hypogastric nerves', text: 'Descend over the promontory into the pelvis. Injury to the superior plexus causes retrograde ejaculation. Injury deeper in the pelvis causes urinary and erectile dysfunction.' },
          { x: 366, y: 44, label: 'Splenic flexure', text: 'Mobilizing it lets the descending colon come down without tension. Often needed for a low anastomosis.' },
          { x: 272, y: 244, label: 'Upper rectum', text: 'Where the taeniae splay out. In diverticulitis the anastomosis must be here: an anastomosis on retained sigmoid raises the recurrence rate.' }
        ] },
        { base: 'cr-anast', hotspots: [
          { x: 246, y: 140, label: 'Anvil', text: 'Placed in the end of the descending colon and secured with a purse-string. It joins the circular stapler that comes up through the anus.' },
          { x: 200, y: 172, label: 'Rectal stump staple line', text: 'The circular stapler passes through it or right next to it. Two complete tissue rings (donuts) are a sign of a complete anastomosis.' },
          { x: 132, y: 236, label: 'Mesorectal fascia (TME)', text: 'For a rectal tumor, dissect in the plane outside the fascia so the mesorectum comes out intact. This lowers local recurrence and protects the nerves.' }
        ] }
      ],
      landmarks: [
        { name: 'Sacral promontory', why: 'The starting point of the medial approach. Open the peritoneum here.' },
        { name: 'IMA origin', why: 'Sets the type of ligation and the number of nodes.' },
        { name: 'Left ureter', why: 'Identify it before dividing anything. In severe inflammation, consider stents.' },
        { name: 'Superior hypogastric plexus', why: 'Protect it during ligation and on entering the pelvis.' },
        { name: 'IMV near Treitz', why: 'High division gives length.' },
        { name: 'Upper rectum', why: 'The right level for the distal transection in diverticulitis.' }
      ]
    },
    preop: {
      workup: ['Complete colonoscopy: in cancer with biopsy and tattoo; in diverticulitis to exclude a tumor.', 'CT of chest, abdomen and pelvis. For a rectal tumor, also pelvic MRI.', 'CEA in cancer.', 'In diverticulitis: CT to define abscess, fistula or stricture.', 'Multidisciplinary discussion for cancer.'],
      consent: ['Anastomotic leak, bleeding and infection.', 'Temporary or permanent stoma.', 'Injury to the ureter, arteries or bowel.', 'Urinary and sexual dysfunction.', 'Conversion to open surgery.', 'After a low resection: change in bowel habits (LARS).'],
      antibiotics: ['Cefazolin 2 g plus metronidazole 500 mg IV within 60 minutes before incision.', 'Alternatives per institution: cefoxitin, ertapenem.', 'Redose in a long case or with heavy blood loss.'],
      vte: ['Pneumatic compression devices during surgery.', 'Low molecular weight heparin after surgery.', 'In cancer: consider extended prophylaxis for about 4 weeks per institutional protocol.'],
      bowelPrep: ['Isosmotic mechanical prep together with oral antibiotics the day before surgery.', 'Mechanical prep alone is not recommended.', 'Full prep is especially important when a diverting ileostomy is planned.'],
      special: ['Stoma site marking by a stoma nurse before any left-sided resection.', 'ERAS protocol: carbohydrate loading, short fast, early feeding.', 'Severe inflammation or reoperation: consider ureteric stents.', 'Perforation with abscess: antibiotics and percutaneous drainage. Elective surgery later if needed.']
    },
    approaches: [
      {
        key: 'lap', kind: 'lap', label: 'Laparoscopic (medial to lateral)',
        setup: {
          position: { kind: 'lithotomy', tilt: -18, roll: 'right', pressure: ['occiput', 'sacrum', 'fibula', 'calf', 'heel'] },
          room: { arms: { R: 'tucked', L: 'tucked' }, legs: 'lithotomy', staff: [{ w: 'S', s: 'Rt3' }, { w: 'C', s: 'Rt2' }, { w: 'A', s: 'Lt2' }, { w: 'N', s: 'legs' }], monitors: ['LtFar3', 'LtFar1'] },
          notes: ['Modified lithotomy (Lloyd-Davies) to allow a transanal circular stapler.', 'Thighs nearly flat so they don’t block the instruments.', 'Steep head down (Trendelenburg) and right side down.', 'Secure well: anti-slip mattress and a chest strap.', 'Urinary catheter.'],
          arms: ['Both arms tucked and padded.'],
          team: ['Surgeon on the patient’s right, camera beside them toward the head.', 'Assistant on the left.', 'Main monitor on the left near the legs, facing the surgeon.', 'Access to the anus is needed for the circular stapler and the leak test.'],
          pressureExtra: ['Legs in boots: no pressure on the fibular head or the calf.']
        },
        access: {
          target: { x: 196, y: 306, rx: 40, ry: 24, label: 'Sigmoid' },
          ports: [
            { x: 150, y: 200, mm: 12, role: 'camera', label: 'Umbilical or just above. Camera', n: 1 },
            { x: 92, y: 284, mm: 12, role: 'work', label: 'Right lower quadrant. Surgeon’s right hand, linear stapler', n: 2 },
            { x: 92, y: 206, mm: 5, role: 'work', label: 'Right mid abdomen. Surgeon’s left hand', n: 3 },
            { x: 222, y: 218, mm: 5, role: 'assist', label: 'Left abdomen. Assistant: traction on the sigmoid', n: 4 }
          ],
          incisions: [{ id: 'pfannenstiel', label: 'Extraction: Pfannenstiel', lx: 150, ly: 326 }, { id: 'left-iliac', label: 'Or a left lower incision', alt: true, lx: 250, ly: 250 }],
          notes: ['Pneumoperitoneum 12–15 mmHg.', 'Port 2 low enough for the stapler to reach the rectum at the right angle.', 'For splenic flexure mobilization you can add a left upper quadrant port.']
        },
        steps: [
          { t: 'Entry and survey', d: 'Enter at the umbilicus, survey the liver and peritoneum and place the right-sided ports.', tip: 'Find the tumor or tattoo and the inflamed segment before you start dissecting.', danger: 'An abscess or a colovesical fistula changes the order of steps.', nurse: '30° scope, 12 and 5 mm ports.', fig: { view: 'access' } },
          { t: 'Exposing the promontory', d: 'Head down and right side down. Move the small bowel to the right upper quadrant and lift the sigmoid to the left.', tip: 'With the small bowel out of the pelvis, the IMA shows as a ridge under the peritoneum.', danger: 'Small bowel falling back into the field and getting hit by the energy device.', nurse: 'Long atraumatic graspers.', fig: { base: 'sig-vessels', hl: ['prom', 'sigmoid', 'sra', 'ima'], marks: [{ t: 'arrow', x1: 280, y1: 236, x2: 350, y2: 268, label: 'Sigmoid left', lx: 330, ly: 290 }, { t: 'arrow', x1: 220, y1: 40, x2: 150, y2: 10, label: 'Small bowel up', lx: 110, ly: 26 }] } },
          { t: 'Medial entry and the ureter', d: 'Open the peritoneum over the promontory beneath the SRA, enter the plane and lift the mesentery. Identify the left ureter and the gonadal vessels.', tip: 'The hypogastric nerves stay behind on the retroperitoneum. Lift the mesentery off them.', danger: 'Never divide a vessel before you’ve seen the ureter.', nurse: 'Scissors with diathermy or an energy device.', fig: { base: 'sig-vessels', hl: ['sra', 'ima', 'ureter', 'gonad', 'nerve'], marks: [{ t: 'path', d: 'M196 236 C206 210 220 190 236 180' }, { t: 'zone', x: 300, y: 170, rx: 26, ry: 34, tone: 'safe', label: 'Ureter' }, { t: 'zone', x: 200, y: 210, rx: 18, ry: 30, tone: 'danger' }] } },
          { t: 'Ligating the IMA', d: 'In cancer: high ligation a short distance from the aorta. In diverticulitis: low ligation below the left colic artery is acceptable.', tip: 'See the artery all around, and the ureter behind it, before the clip or stapler.', danger: 'Ligation flush with the aorta injures the superior hypogastric plexus.', nurse: 'Locking clips or a vascular stapler, energy device.', fig: { base: 'sig-vessels', hl: ['ima', 'aorta', 'nerve', 'lca'], marks: [{ t: 'clip', x: 220, y: 130, a: -40 }, { t: 'clip', x: 226, y: 136, a: -40 }, { t: 'clip', x: 236, y: 152, a: -40 }, { t: 'cut', x1: 220, y1: 152, x2: 240, y2: 132 }] } },
          { t: 'Dividing the IMV', d: 'Divide the IMV. When you need length for a low anastomosis, divide it high at the lower border of the pancreas, near Treitz.', tip: 'Beneath the IMV, continue in the plane above Gerota’s fascia toward the splenic flexure.', danger: 'Straying into the pancreas or behind Gerota’s fascia.', nurse: 'Clips or an energy device.', fig: { base: 'sig-vessels', hl: ['imv', 'sb', 'colon'], marks: [{ t: 'clip', x: 268, y: 46, a: 90 }, { t: 'clip', x: 268, y: 56, a: 90 }, { t: 'cut', x1: 256, y1: 51, x2: 282, y2: 51 }] } },
          { t: 'Lateral release and splenic flexure', d: 'Open the white line along the descending colon and sigmoid. Then mobilize the splenic flexure as needed.', tip: 'The test: the end of the colon reaches the promontory without tension.', danger: 'Traction on the flexure tears the splenic capsule.', nurse: 'Energy device.', fig: { base: 'sig-vessels', hl: ['colon', 'sigmoid'], marks: [{ t: 'path', d: 'M366 186 L366 60 C366 40 372 30 392 28', tone: 'solid' }, { t: 'arrow', x1: 352, y1: 120, x2: 300, y2: 120, label: 'Medial', lx: 316, ly: 110 }] } },
          { t: 'Distal transection on the rectum', d: 'Divide the mesentery down to the wall of the upper rectum, where the taeniae splay out. Transect there with a linear stapler.', tip: 'In cancer, respect the distal margin. In diverticulitis, transect on the rectum, not the sigmoid.', danger: 'More than two stapler firings on the rectum raises the leak risk.', nurse: 'Articulating laparoscopic linear stapler, 45 or 60 mm, load matched to tissue thickness.', fig: { base: 'sig-vessels', hl: ['sigmoid', 'sra'], marks: [{ t: 'staple', pts: ['196 290', '226 290'] }, { t: 'label', x: 120, y: 290, text: 'Distal line' }] } },
          { t: 'Extraction and anvil', d: 'Pfannenstiel or left lower incision with a wound protector. Divide proximally on well-perfused bowel and secure the anvil with a purse-string.', tip: 'Check perfusion of the end, by eye or with ICG, before placing the anvil.', danger: 'A dusky end, or no bleeding from the edges: resect more.', nurse: 'Wound protector, circular stapler 28–31 mm, 2-0 Prolene for the purse-string.', fig: { base: 'cr-anast', hl: ['colon', 'anvil'], marks: [{ t: 'stitch', x1: 178, y1: 120, x2: 222, y2: 120, n: 6 }] } },
          { t: 'Double-stapled anastomosis and leak test', d: 'The circular stapler comes up through the anus, joins the anvil and is fired. Check for two complete tissue rings and do an underwater air leak test.', tip: 'Before firing, check that the mesentery isn’t twisted and no other tissue is caught between the ends.', danger: 'Positive air test: repair and consider a diverting ileostomy. Very low anastomosis: consider an ileostomy upfront.', nurse: 'Circular stapler, syringe or rigid sigmoidoscope for the air test, fluid to fill the pelvis.', fig: { base: 'cr-anast', hl: ['colon', 'anvil', 'rectum', 'stapler'], marks: [{ t: 'staple', pts: ['178 186', '222 186'] }, { t: 'arrow', x1: 200, y1: 280, x2: 200, y2: 196, label: 'Circular stapler', lx: 140, ly: 270 }] } }
        ],
        equipment: [
          { cat: 'Optics and access', items: ['10 mm 30° scope.', 'Two 12 mm ports and two 5 mm ports.', 'Wound protector for the extraction incision.'], alt: ['Hand-assist', 'Extra port for the splenic flexure'] },
          { cat: 'Energy and dissection', items: ['Advanced bipolar sealing or ultrasonic device.', 'Scissors with diathermy.', 'Atraumatic bowel graspers.'], alt: ['LigaSure', 'Harmonic', 'Thunderbeat'] },
          { cat: 'Vessels', items: ['Locking polymer clips for the IMA and IMV.', 'Vascular stapler (white or gray load).'], alt: ['Intracorporeal tie'] },
          { cat: 'Transection and anastomosis', items: ['Articulating laparoscopic linear stapler 45–60 mm, load height matched to tissue thickness.', 'Circular stapler 28–31 mm (by bowel diameter).', '2-0 Prolene for the purse-string.'], alt: ['Side-to-end anastomosis', 'Colonic J-pouch for a low resection', 'Hand-sewn coloanal anastomosis'] },
          { cat: 'Checks', items: ['Rigid sigmoidoscope or syringe for the air test.', 'Optional ICG to check perfusion.', 'Ureteric stents as needed.'] },
          { cat: 'Closure', items: ['Slowly absorbable suture for the fascia.', 'Stoma appliances if one is planned.'] }
        ],
        pitfalls: [
          { p: 'Ureter not identified', fix: 'Don’t divide any vessel. Go back to the plane, try from the lateral side or consider a stent.' },
          { p: 'Anastomosis under tension', fix: 'Divide the IMV high and mobilize the splenic flexure before joining.' },
          { p: 'Anastomosis on sigmoid in diverticulitis', fix: 'The distal transection is always on the upper rectum.' },
          { p: 'Multiple stapler firings on the rectum', fix: 'Get a good stapler angle: a low port, perineal pressure, or an extraction incision that allows an open stapler.' },
          { p: 'Injury to the hypogastric nerves', fix: 'Lift the mesentery off them. Don’t ligate flush with the aorta.' }
        ]
      },
      {
        key: 'robotic', kind: 'robotic', label: 'Robotic', inherit: 'lap',
        deltas: ['Ports in a diagonal line from the right upper to the right lower abdomen, 6–8 cm apart.', 'An advantage in a narrow pelvis and in rectal tumors: 3D vision and wristed instruments.', 'The third arm holds the sigmoid under steady tension.', 'Splenic flexure mobilization is possible in the same docking in most cases.', 'Built-in ICG imaging to check perfusion of the end.', 'The circular stapler still goes up through the anus, in the assistant’s hands.'],
        setup: {
          position: { kind: 'lithotomy', tilt: -18, roll: 'right', pressure: ['occiput', 'sacrum', 'fibula', 'calf', 'heel', 'face'] },
          room: { arms: { R: 'tucked', L: 'tucked' }, legs: 'lithotomy', staff: [{ w: 'B', s: 'Rt3' }, { w: 'N', s: 'legs' }], monitors: ['RtFar1'], robot: { s: 'LtFar2' }, console: true },
          notes: ['Modified lithotomy, both arms tucked.', 'Head down and right side down before docking.', 'Don’t change position while the robot is docked, unless the table is integrated.'],
          arms: ['Both arms tucked and padded.'],
          team: ['Robot cart on the patient’s left.', 'Bedside assistant on the right, at the assistant port.', 'Surgeon at the console.']
        },
        access: {
          target: { x: 196, y: 306, rx: 40, ry: 24, label: 'Sigmoid' },
          ports: [
            { x: 96, y: 128, mm: 8, role: 'robot', label: 'Right upper. Arm 1', n: 1 },
            { x: 122, y: 184, mm: 8, role: 'camera', label: 'Right of umbilicus. Camera', n: 2 },
            { x: 150, y: 240, mm: 12, role: 'robot', label: 'Below the umbilicus. Arm 3 and robotic stapler', n: 3 },
            { x: 210, y: 270, mm: 8, role: 'robot', label: 'Left lower. Arm 4: traction on the sigmoid', n: 4 },
            { x: 74, y: 240, mm: 12, role: 'assist', label: 'Right lateral. Assistant port', n: 'A' }
          ],
          incisions: [{ id: 'pfannenstiel', label: 'Extraction: Pfannenstiel', lx: 150, ly: 326 }],
          notes: ['The line is aimed at the promontory.', 'About 15–20 cm from the target.'],
          docking: ['Target the promontory and the IMA.', 'Dock from the patient’s left side, between the leg and the abdomen.', 'Check that the arms don’t touch the legs in the boots.']
        }
      },
      {
        key: 'open', kind: 'open', label: 'Open',
        setup: {
          position: { kind: 'lithotomy', tilt: -10, pressure: ['occiput', 'sacrum', 'fibula', 'calf', 'heel'] },
          room: { arms: { R: 'out', L: 'out' }, legs: 'lithotomy', staff: [{ w: 'S', s: 'Lt2' }, { w: 'A', s: 'Rt2' }, { w: 'N', s: 'legs' }] },
          notes: ['Modified lithotomy for access to the anus.', 'Self-retaining retractor set up before the incision.', 'In an emergency, supine is also fine if no low anastomosis is planned.'],
          arms: ['Both arms out to 90°.'],
          team: ['Surgeon on the patient’s left, assistant on the right.', 'An extra nurse for transanal access during the anastomosis.']
        },
        access: {
          target: { x: 196, y: 306, rx: 40, ry: 24, label: 'Sigmoid' },
          incisions: [{ id: 'midline-lower', label: 'Lower midline incision, extended as needed', lx: 176, ly: 252 }],
          notes: ['Mobilizing the splenic flexure needs the incision extended upward.', 'In perforation: thorough washout and drainage.']
        },
        steps: [
          { t: 'Opening and survey', d: 'Midline laparotomy and survey. In perforation, clear the contamination and wash out.', tip: 'Small bowel in a bag or packs, out of the pelvis.', fig: { view: 'access' } },
          { t: 'Lateral release', d: 'Open the white line and lift the sigmoid and descending colon medially, in the plane above Gerota’s fascia.', tip: 'The ureter is identified where it crosses the iliac artery.', danger: 'In severe inflammation the ureter is pulled into the process. Consider stents.', fig: { base: 'sig-vessels', hl: ['colon', 'sigmoid', 'ureter'], marks: [{ t: 'arrow', x1: 352, y1: 150, x2: 300, y2: 150, label: 'Lift medially', lx: 316, ly: 140 }] } },
          { t: 'Vessel ligation', d: 'Ligate the IMA (high or low depending on the diagnosis) and the IMV.', tip: 'Feel the IMA and aortic pulse before ligating.', fig: { base: 'sig-vessels', hl: ['ima', 'imv', 'aorta'], marks: [{ t: 'clip', x: 224, y: 134, a: -40 }, { t: 'clip', x: 268, y: 52, a: 90 }] } },
          { t: 'Transection and anastomosis or Hartmann', d: 'Transect on the upper rectum. Double-stapled anastomosis with or without a diverting ileostomy, or close the stump and make a colostomy (Hartmann).', tip: 'Unstable patient or fecal peritonitis: Hartmann.', fig: { base: 'cr-anast', hl: ['colon', 'rectum', 'anvil', 'stapler'], marks: [{ t: 'staple', pts: ['178 186', '222 186'] }] } },
          { t: 'Closure', d: 'Check hemostasis, drain as needed, bring out the stoma and close the fascia.', tip: 'Close with small bites. Stoma at the site marked beforehand.', fig: { view: 'access' } }
        ],
        equipment: [
          { cat: 'Opening', items: ['Laparotomy set.', 'Self-retaining retractor.', 'Wound protector.'] },
          { cat: 'Dissection and ligation', items: ['Diathermy, Metzenbaum scissors, right-angle forceps.', '0 and 2-0 ties.'], alt: ['Bipolar sealing device'] },
          { cat: 'Transection and anastomosis', items: ['TA or GIA stapler for the rectum.', 'Circular stapler 28–31 mm.', '2-0 Prolene for the purse-string.'], alt: ['Hand-sewn anastomosis', 'Hartmann'] },
          { cat: 'Closure', items: ['Slowly absorbable suture for the fascia.', 'Closed drain as needed.'] }
        ]
      }
    ],
    compare: {
      rows: [
        { k: 'When to choose', v: { lap: 'Default for elective cases', robotic: 'Narrow pelvis, rectal tumor, obesity', open: 'Emergency, instability, adhesions' }, best: 'lap' },
        { k: 'Pain and stay', v: { lap: 'Less pain, short stay', robotic: 'Similar to laparoscopy', open: 'More pain and a longer stay' } },
        { k: 'Conversion', v: { lap: 'Possible in a narrow pelvis', robotic: 'Fewer conversions (CST 14)', open: 'Not applicable' }, best: 'robotic' },
        { k: 'Oncologic outcome', v: { lap: 'Equivalent', robotic: 'Equivalent', open: 'Equivalent' } },
        { k: 'Time and cost', v: { lap: 'Moderate', robotic: 'Longer and more expensive', open: 'Short in the OR, expensive for the stay' } },
        { k: 'Splenic flexure mobilization', v: { lap: 'Needs repositioning', robotic: 'Usually in the same docking', open: 'Needs a longer incision' } }
      ],
      note: 'This comparison is qualitative, not based on institutional data.'
    },
    bailout: ['Change position, add a port and call a senior.', 'Switch to a lateral-to-medial approach when inflammation blocks the medial plane.', 'Ureteric stents when the anatomy is unclear.', 'Hand-assist through the extraction incision.', 'Convert to open surgery.', 'Anastomosis with a diverting ileostomy instead of an anastomosis alone.', 'Hartmann procedure: close the stump and make a colostomy in an unstable patient or with poor tissue.'],
    intraop: [
      { c: 'Ureteric injury', do: 'Recognize it during the operation, call urology and repair over a stent.' },
      { c: 'Bleeding from the IMA or pelvic veins', do: 'Pressure and proximal control. For presacral veins: sustained pressure and a hemostatic agent, not deep diathermy.' },
      { c: 'Positive air leak test', do: 'Repair with sutures, or redo the anastomosis if the defect is large. Consider a diverting ileostomy.' },
      { c: 'Incomplete tissue rings', do: 'Inspect the anastomosis, repair or redo it.' },
      { c: 'Bowel end with poor blood supply', do: 'Resect further back to bleeding tissue, with further flexure mobilization if needed.' }
    ],
    postop: {
      care: ['ERAS protocol: fluids on the day of surgery, early diet, early mobilization.', 'Multimodal analgesia with minimal opioids.', 'Early catheter removal. After a low resection, check that the patient voids.', 'Stoma teaching if there is one. Watch fluid losses from an ileostomy.', 'Before ileostomy closure: contrast study or endoscopy to check the anastomosis.'],
      complications: [
        { c: 'Anastomotic leak', d: 'More common the lower the anastomosis. Fever, tachycardia, pain, rising CRP. CT. Stable patient with a collection: drain it. Unstable or free leak: reoperate, sometimes taking down the anastomosis and making a stoma.' },
        { c: 'Ileus', d: 'Correct electrolytes, nasogastric tube as needed.' },
        { c: 'Urinary retention', d: 'After pelvic dissection. Catheter and assessment.' },
        { c: 'Dehydration from the ileostomy', d: 'High output. Fluids, kidney function monitoring and antimotility drugs.' },
        { c: 'Wound or stoma infection', d: 'Open, drain and treat locally.' }
      ]
    },
    quiz: [
      { q: 'What do you identify before dividing the IMA?', a: ['The spleen', 'The left ureter', 'The gallbladder', 'The right renal artery'], c: 1, why: 'The left ureter and gonadal vessels must be seen before any vessel is divided.' },
      { q: 'In diverticulitis, where should the distal transection be?', a: ['Mid sigmoid', 'On the upper rectum', 'On the descending colon', 'It doesn’t matter'], c: 1, why: 'An anastomosis on retained sigmoid raises the recurrence rate. Transect where the taeniae splay out.' },
      { q: 'What adds length for a low anastomosis?', a: ['Dividing the IMV near Treitz and mobilizing the splenic flexure', 'Ligating the ileocolic artery', 'Leaving the sigmoid', 'Mechanical bowel prep'], c: 0, why: 'High division of the IMV and flexure mobilization bring the descending colon into the pelvis without tension.' },
      { q: 'Injury to the superior hypogastric plexus during IMA ligation mainly causes:', a: ['Diarrhea', 'Retrograde ejaculation', 'Jaundice', 'Hernia'], c: 1, why: 'The superior plexus runs over the aorta. That’s why you don’t ligate flush with it.' },
      { q: 'What distal margin is accepted for a low rectal tumor when the whole mesorectum is removed?', a: ['1 cm', '5 cm', '10 cm', 'No margin needed'], c: 0, why: 'For a low tumor, 1 cm is enough if a complete TME is done. For an upper rectal tumor, 5 cm is preferred.' }
    ],
    sources: [
      { b: 'CST14', ref: 'Current Surgical Therapy 14, chapter: Management of Diverticular Disease of the Colon, pp. 181–186.' },
      { b: 'CST14', ref: 'Current Surgical Therapy 14, chapter: Surgical Management of Colon Cancer, pp. 251–255.' },
      { b: 'CST14', ref: 'Current Surgical Therapy 14, chapter: Management of Rectal Cancer, pp. 340–346.' },
      { b: 'CST14', ref: 'Current Surgical Therapy 14, chapter: Preoperative Bowel Preparation: Is It Necessary?, pp. 177–180.' },
      { b: 'SAB22', ref: 'Sabiston 22, chapter 95: Colon and Rectum, from p. 1429.' },
      { b: 'SAB22', ref: 'Sabiston 22, chapter 96: Cancers of the Colon, Rectum, and Anus, from p. 1491.' },
      { b: 'GL', ref: 'ASCRS guidelines for left-sided colonic diverticulitis, 2020.' },
      { b: 'GL', ref: 'ASCRS guidelines for the management of colon cancer, 2022.' },
      { b: 'GL', ref: 'ERAS Society guidelines for elective colorectal surgery, 2018.' }
    ],
    gaps: ['Low anterior resection with full TME is mentioned only as a principle, without step cards for the pelvis.', 'The Hartmann procedure and its reversal are not detailed separately.', 'Medial-approach splenic flexure mobilization is not detailed.']
  });
})();
