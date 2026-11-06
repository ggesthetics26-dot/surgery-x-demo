/* ORBIT · Laparoscopic cholecystectomy — reference procedure (full polish).
   Facts checked against CST14 (Acute Cholecystitis; CBD stones) and Sabiston 22 ch. 88. Text is original and short. */
(function () {
  var O = window.ORBIT;

  /* ---------- anatomy base 1: hepatocystic triangle, laparoscopic view from the umbilicus ---------- */
  O.base('hc-triangle', 'Hepatocystic triangle, laparoscopic view', function () {
    return '' +
      '<path data-k="liver" class="a-liver" d="M0 0 H400 V86 C352 98 306 90 274 84 C242 78 214 92 186 95 C150 99 120 128 92 150 C62 172 32 202 0 216 Z"/>' +
      '<path data-k="sulcus" class="a-line" d="M14 192 Q46 172 84 170" style="stroke-width:4;opacity:.75"/>' +
      '<path data-k="r4u" class="a-dash" d="M84 170 L340 170" style="opacity:.55"/>' +
      '<path data-k="duod" class="a-bowel" d="M214 300 C224 268 290 250 400 256 L400 300 Z"/>' +
      '<path data-k="tri" d="M190 150 L262 206 L268 94 L196 98 Z" fill="rgba(20,184,166,.13)" stroke="rgba(20,184,166,.6)" stroke-dasharray="4 4"/>' +
      '<path data-k="plate" d="M136 104 L198 150 L188 166 L124 116 Z" fill="#E8C9B4" opacity=".75"/>' +
      '<path data-k="pha" class="a-art" d="M318 300 L312 150 L326 70" style="stroke-width:6"/>' +
      '<path data-k="rha" class="a-art" d="M312 150 C290 128 258 118 222 104 L196 96" style="stroke-width:5"/>' +
      '<path data-k="ca" class="a-art" d="M236 110 C222 124 206 136 190 146" style="stroke-width:3.5"/>' +
      '<path data-k="chd" class="a-duct" d="M270 50 L266 208" style="stroke-width:12"/>' +
      '<path data-k="cbd" class="a-duct" d="M266 208 L272 300" style="stroke-width:13"/>' +
      '<path data-k="cd" class="a-duct" d="M180 186 C206 200 236 206 264 208" style="stroke-width:8"/>' +
      '<path data-k="gb" class="a-gb" d="M70 50 C80 18 128 18 142 46 L200 158 C210 182 190 202 168 196 C152 192 142 180 134 166 L72 76 C66 66 66 58 70 50 Z"/>' +
      '<circle data-k="node" class="a-lymph" cx="203" cy="133" r="8"/>' +
      '<text class="lbl" x="104" y="52" text-anchor="middle">Fundus</text>' +
      '<text class="lbl" x="150" y="206" text-anchor="middle">Hartmann</text>' +
      '<text class="lbl" x="286" y="44">CHD</text>' +
      '<text class="lbl" x="282" y="262">CBD</text>' +
      '<text class="lbl" x="214" y="226">Cystic duct</text>' +
      '<text class="lbl s" x="226" y="134">Cystic a.</text>' +
      '<text class="lbl s" x="330" y="140">RHA</text>' +
      '<text class="lbl s" x="22" y="210">Rouvière</text>' +
      '<text class="lbl s" x="344" y="166">R4U line</text>' +
      '<text class="lbl s" x="340" y="286">Duodenum</text>' +
      '<text class="lbl s" x="40" y="30">Liver (seg. 5)</text>';
  });

  /* ---------- anatomy base 2: biliary tree and variants, anterior view ---------- */
  O.base('biliary-tree', 'Biliary tree, arteries and dangerous variants', function () {
    return '' +
      '<path data-k="liver" class="a-liver" d="M20 20 C120 0 300 0 390 30 C392 70 360 96 300 104 L210 112 C160 118 120 126 60 120 C30 110 14 70 20 20 Z"/>' +
      '<path data-k="stom" class="a-stomach" d="M330 110 C380 120 398 170 380 210 C362 240 330 238 318 214 C306 192 300 150 330 110 Z" opacity=".9"/>' +
      '<path data-k="duod" class="a-bowel" d="M226 214 C214 236 214 262 236 280 C262 296 300 290 316 270 L330 226 C320 206 310 206 304 214 C298 240 292 262 270 266 C252 266 244 252 246 230 Z"/>' +
      '<path data-k="panc" class="a-organ" d="M248 236 C262 226 300 222 330 230 C350 236 360 250 346 258 C320 266 284 266 262 260 C248 254 240 246 248 236 Z" opacity=".85"/>' +
      '<path data-k="pv" class="a-vein" d="M236 250 L228 120" style="stroke-width:13;opacity:.85"/>' +
      '<path data-k="ha" class="a-art" d="M300 214 C280 196 262 180 256 150 L254 120" style="stroke-width:5"/>' +
      '<path data-k="rha" class="a-art" d="M255 138 C230 132 200 128 172 118" style="stroke-width:4"/>' +
      '<path data-k="lha" class="a-art" d="M254 122 L276 98" style="stroke-width:4"/>' +
      '<path data-k="ca" class="a-art" d="M190 124 C176 134 162 142 148 146" style="stroke-width:3"/>' +
      '<path data-k="rhd" class="a-duct" d="M168 92 C190 104 204 110 214 116" style="stroke-width:6"/>' +
      '<path data-k="lhd" class="a-duct" d="M262 92 C246 104 230 110 218 116" style="stroke-width:6"/>' +
      '<path data-k="rpd" class="a-duct" d="M150 98 C176 124 196 150 206 176" style="stroke-width:4;stroke-dasharray:5 3"/>' +
      '<path data-k="chd" class="a-duct" d="M216 116 L212 172" style="stroke-width:9"/>' +
      '<path data-k="cbd" class="a-duct" d="M212 172 C214 210 226 236 250 252" style="stroke-width:10"/>' +
      '<path data-k="cd" class="a-duct" d="M150 176 C172 182 196 178 212 172" style="stroke-width:6"/>' +
      '<path data-k="gb" class="a-gb" d="M66 128 C70 108 110 104 126 120 L160 168 C170 186 154 200 138 194 L84 160 C66 150 62 140 66 128 Z"/>' +
      '<path data-k="luschka" class="a-duct" d="M108 118 L118 134" style="stroke-width:2.5;stroke-dasharray:3 2"/>' +
      '<text class="lbl" x="92" y="146" text-anchor="middle">GB</text>' +
      '<text class="lbl s" x="226" y="196">CBD</text><text class="lbl s" x="222" y="150">CHD</text>' +
      '<text class="lbl s" x="128" y="82">RHD</text><text class="lbl s" x="262" y="84">LHD</text>' +
      '<text class="lbl s" x="196" y="230">PV</text><text class="lbl s" x="300" y="190">PHA</text>' +
      '<text class="lbl s" x="276" y="292">Duodenum</text><text class="lbl s" x="334" y="252">Pancreas</text>' +
      '<text class="lbl s" x="40" y="60">Liver</text>';
  });

  /* ---------- cover ---------- */
  O.cover('lap-chole', function () {
    return '<path class="f-w2" d="M60 52 C70 26 112 26 124 50 L170 140 C178 160 160 176 142 170 C128 166 120 156 114 144 L62 74 C56 64 56 58 60 52 Z"/>' +
      '<path class="s-g" d="M160 160 C186 170 214 172 238 170" stroke-width="7"/>' +
      '<path class="s-g" d="M242 52 L238 190" stroke-width="10"/>' +
      '<path class="s-r" d="M236 72 C214 92 196 112 176 126" stroke-width="3.5"/>' +
      '<path class="s-t" d="M150 120 L238 170 L242 70 L160 72 Z" stroke-width="1.5" stroke-dasharray="4 4"/>' +
      '<g><rect x="196" y="156" width="5" height="16" rx="1.5" class="c-w" transform="rotate(14 198 164)"/><rect x="208" y="158" width="5" height="16" rx="1.5" class="c-w" transform="rotate(10 210 166)"/></g>' +
      '<text x="28" y="182" class="c-w" style="font:700 15px Inter,sans-serif;letter-spacing:.06em">CVS</text>';
  });

  O.register({
    id: 'lap-chole',
    title: 'Cholecystectomy',
    title_en: 'Cholecystectomy (laparoscopic · robotic · open)',
    system: 'biliary', organ: 'Gallbladder', difficulty: 2, setting: 'Elective and emergency',
    tags: ['gallbladder', 'chole', 'cholecystectomy', 'CVS', 'critical view of safety', 'Calot', 'gallstones', 'acute cholecystitis', 'cholecystitis', 'ICG', 'subtotal'],
    student: {
      summary: 'Removal of the gallbladder, in most cases laparoscopically. The whole operation is built around one goal: identify the cystic duct and the cystic artery with certainty before cutting anything, so the common bile duct is not injured.',
      points: ['The critical view of safety (CVS) is the condition for cutting: only two structures enter the gallbladder.', 'Fundus up and Hartmann’s pouch lateral open the triangle.', 'Stay above the line of Rouvière’s sulcus.', 'When safe identification is not possible, switch to a bailout option. Don’t push on.']
    },
    overview: {
      facts: [{ v: '0.1–0.5%', l: 'Mortality (Sabiston)' }, { v: '2–3%', l: 'Morbidity' }, { v: '~0.3–0.5%', l: 'Bile duct injury, laparoscopic approach' }, { v: '<10%', l: 'Unexpected stones on routine cholangiography' }],
      indications: ['Biliary colic with gallstones.', 'Acute cholecystitis: early surgery in the same admission (TG18).', 'After mild gallstone pancreatitis: in the same admission.', 'After clearance of common bile duct stones (ERCP).', 'Polyp larger than 1 cm or growing, porcelain gallbladder.', 'Gallbladder dyskinesia in selected patients.'],
      contraindications: ['Unable to tolerate general anesthesia.', 'Advanced cirrhosis with portal hypertension.', 'Uncorrected coagulopathy.', 'Relative: severe COPD, heart failure and pulmonary hypertension (pneumoperitoneum).'],
      choice: ['Laparoscopy is the default, including in acute cholecystitis.', 'Robotic: depending on availability and experience. Advantages in suturing, built-in ICG imaging and in patients with obesity. Higher cost.', 'Open: when safe progress is not possible, when instruments are lacking, or as part of another open operation.', 'Remember: limited open experience makes conversion less safe than it seems.']
    },
    anatomy: {
      figures: [
        { base: 'hc-triangle', hotspots: [
          { x: 228, y: 166, label: 'Critical view of safety (CVS)', text: 'Three criteria: the hepatocystic triangle is cleared of fat and tissue. The lower third of the gallbladder is separated from the cystic plate. Only two structures enter the gallbladder. Only then do you cut.' },
          { x: 186, y: 122, label: 'Calot’s node', text: 'Almost always sits on the cystic artery. Incise the peritoneum on the gallbladder side of the node, not below it.' },
          { x: 46, y: 160, label: 'Rouvière’s sulcus', text: 'A constant landmark on the right liver. Dissection stays above it, on the gallbladder side (R4U line). Below it lie the structures of the porta hepatis.' },
          { x: 292, y: 232, label: 'Common bile duct (CBD)', text: 'The classic injury: mistaking the CBD for the cystic duct. Excessive cephalad traction on the fundus straightens the CBD and makes it look like the cystic duct.' },
          { x: 252, y: 96, label: 'Right hepatic artery', text: 'May form a loop close to the gallbladder (caterpillar or Moynihan hump). Such a loop looks like a thick cystic artery. Don’t divide an artery until you see it end in the gallbladder wall.' },
          { x: 150, y: 126, label: 'Cystic plate', text: 'Separating the lower third of the gallbladder from the plate is part of the CVS. Stay outside the plate, or you enter the liver and the veins of the bed.' },
          { x: 150, y: 222, label: 'Lateral traction on Hartmann’s pouch', text: 'Traction lateral and down opens the triangle and creates an angle between the cystic duct and the CHD. Traction toward the liver closes the triangle.' }
        ] },
        { base: 'biliary-tree', hotspots: [
          { x: 168, y: 152, label: 'Low right posterior duct', text: 'In a small share of patients the right posterior duct drains low, sometimes into the cystic duct. It looks like a third structure in the triangle. A reason to stop and clarify.' },
          { x: 112, y: 112, label: 'Subvesical ducts (Luschka)', text: 'Small ducts in the cystic plate. A source of postoperative bile leak if the dissection is too deep.' },
          { x: 172, y: 196, label: 'Short cystic duct', text: 'A short or wide cystic duct lies very close to the CBD. Close it with an endoloop or a suture instead of a clip. Don’t pull hard; traction distorts the CBD.' },
          { x: 252, y: 168, label: 'Common hepatic artery and porta', text: 'Brisk bleeding here: pressure, suction and an extra port. Never clip blindly.' }
        ] }
      ],
      landmarks: [
        { name: 'Hepatocystic triangle', why: 'Cystic duct, CHD and the liver edge. This is where you work and where you achieve the CVS.' },
        { name: 'Rouvière’s sulcus and the R4U line', why: 'Define the safe lower limit of the dissection.' },
        { name: 'Calot’s node', why: 'Marks the cystic artery. Stay on its gallbladder side.' },
        { name: 'Duodenum and colon', why: 'Often adherent to the gallbladder. Thermal injury from the hook is not visible during the operation.' },
        { name: 'Cystic plate', why: 'The boundary of the gallbladder bed. Stay outside it to avoid bleeding and duct injury.' }
      ]
    },
    preop: {
      workup: ['Upper abdominal ultrasound.', 'Blood count, liver function tests, amylase or lipase depending on presentation.', 'Suspected duct stone: stratify the risk. Intermediate risk: MRCP or EUS. High risk: ERCP or intraoperative exploration.', 'Anesthesia workup by age and comorbidities.'],
      consent: ['Bile duct injury (rare but serious).', 'Bile leak, bleeding, infection and bowel injury.', 'Conversion to open or subtotal cholecystectomy.', 'Possible drain.', 'Retained duct stones, port-site hernia.'],
      antibiotics: ['Elective, low-risk case: no routine prophylaxis needed (ASHP 2013).', 'High risk (over 70, acute cholecystitis, jaundice or stent, pregnancy, immunosuppression): cefazolin 2 g within 60 minutes before incision (3 g above 120 kg).', 'In acute cholecystitis: therapeutic antibiotics continue according to severity.'],
      vte: ['Stockings or pneumatic compression boots for everyone.', 'Pharmacological prophylaxis by risk (Caprini) and local protocol.'],
      bowelPrep: ['Not required.'],
      special: ['Acute cholecystitis: early surgery in the same admission is better than delay (TG18).', 'Pregnancy: second trimester preferred. Left tilt and low pneumoperitoneum pressure.', 'Patient unfit for surgery: percutaneous cholecystostomy and interval surgery (6–12 weeks).', 'Time-out before incision; check availability of cholangiography (C-arm) or ICG.']
    },
    approaches: [
      {
        key: 'lap', kind: 'lap', label: 'Laparoscopic',
        setup: {
          position: { kind: 'supine', tilt: 15, roll: 'left', pressure: ['occiput', 'elbow', 'sacrum', 'heel'] },
          room: { arms: { R: 'out', L: 'tucked' }, legs: 'together', staff: [{ w: 'S', s: 'Lt2' }, { w: 'C', s: 'Lt3' }, { w: 'A', s: 'Rt2' }, { w: 'N', s: 'Rt3' }], monitors: ['RtHead', 'LtHead'] },
          notes: ['Supine, straps across the thighs and chest.', 'Reverse Trendelenburg 15–20° and tilt to the patient’s left.', 'Test the full table tilt before prepping.', 'Orogastric tube (OGT) to decompress the stomach.', 'Prep and drape to allow conversion to open.'],
          arms: ['Left arm tucked (allows imaging and room for the surgeon).', 'Right arm out to 90°, no more.', 'Some centers put both arms out.'],
          team: ['Surgeon on the patient’s left, camera beside them (toward the feet).', 'Assistant on the right: retracts the fundus.', 'Two monitors by the shoulders, the main one facing the surgeon.', 'Leave room for a C-arm if cholangiography is planned.'],
          pressureExtra: []
        },
        access: {
          target: { x: 92, y: 132, rx: 36, ry: 26, label: 'Gallbladder' },
          ports: [
            { x: 150, y: 210, mm: 12, role: 'camera', label: 'Umbilical (Hasson). Entry, camera and extraction', n: 1 },
            { x: 150, y: 80, mm: 10, role: 'work', label: 'Epigastric, right of the falciform ligament. Surgeon’s right hand (hook, clips)', n: 2 },
            { x: 100, y: 120, mm: 5, role: 'work', label: 'Subcostal, midclavicular line (MCL). Left hand: Hartmann’s traction', n: 3 },
            { x: 64, y: 170, mm: 5, role: 'assist', label: 'Anterior axillary line (AAL). Assistant: fundus toward the right shoulder', n: 4 }
          ],
          notes: ['Pneumoperitoneum at 12–15 mmHg.', 'Open entry (Hasson) or Veress needle, depending on experience.', 'Ports a hand’s breadth apart, triangulated toward the target.', 'Port 2 can be 5 mm with a 5 mm clip applier.', 'In a tall patient or with obesity, move the camera port above the umbilicus.']
        },
        steps: [
          { t: 'Entry and survey', d: 'Open entry at the umbilicus, pneumoperitoneum and a survey of the whole abdomen before inserting the other ports.', tip: 'Insert the additional ports under direct vision. If there are adhesions to the wall, take them down first.', danger: 'Blind entry after previous abdominal surgery: prefer Hasson or entry at Palmer’s point.', nurse: 'Hasson port with stay sutures, 30° scope, CO2 tubing connected.', fig: { view: 'access' } },
          { t: 'Exposure: fundus up, Hartmann’s lateral', moves: ['fundus', 'hartmann'], d: 'The assistant pushes the fundus over the liver toward the right shoulder. The surgeon pulls Hartmann’s pouch lateral and down to open the triangle.', tip: 'Lateral traction creates an angle between the cystic duct and the CHD. That is the difference between an open and a closed triangle.', danger: 'Strong cephalad traction on the fundus straightens the CBD and makes it look like the cystic duct.', nurse: 'Two atraumatic graspers, a locking grasper for the fundus.', fig: { base: 'hc-triangle', hl: ['gb', 'tri'], marks: [{ t: 'arrow', x1: 104, y1: 70, x2: 120, y2: 18, label: 'To right shoulder', lx: 160, ly: 22 }, { t: 'arrow', x1: 170, y1: 196, x2: 116, y2: 232, label: 'Lateral and down', lx: 88, ly: 250 }] } },
          { t: 'Open the peritoneum, posterior and anterior', moves: ['hook'], d: 'Open the peritoneum on both sides of Hartmann’s pouch, posterior first and then anterior, high on the gallbladder.', tip: 'Work on the gallbladder side of Calot’s node and above the R4U line.', danger: 'Dissection below Rouvière’s sulcus approaches the porta hepatis.', nurse: 'L-hook diathermy and Maryland forceps.', fig: { base: 'hc-triangle', hl: ['gb', 'node', 'sulcus', 'r4u'], marks: [{ t: 'path', d: 'M150 112 C170 140 182 160 186 182', tone: 'solid' }, { t: 'zone', x: 160, y: 250, rx: 120, ry: 32, tone: 'danger', label: 'No-go zone below R4U' }] } },
          { t: 'Clear the triangle and expose the plate', d: 'Clear fat and tissue from the triangle with gentle movements and separate the lower third of the gallbladder from the cystic plate.', tip: 'Blunt spreading parallel to the structures. Energy only on tissue you can see completely.', danger: 'Active hook near the duodenum or the CHD: a thermal injury you won’t see now.', nurse: 'Suction and irrigation ready.', fig: { base: 'hc-triangle', hl: ['tri', 'plate', 'cd', 'ca'], marks: [{ t: 'zone', x: 222, y: 150, rx: 34, ry: 26, tone: 'safe', label: 'Clear' }] } },
          { t: 'Critical view of safety (CVS)', d: 'Confirm three criteria: a cleared triangle, the lower third separated from the plate, and only two structures entering the gallbladder. Take a photo or pause to show a colleague.', tip: 'A short time-out: show the view from the front and from behind. No CVS, no cutting.', danger: 'A third structure in the triangle: right posterior duct or a hepatic artery. Stop and clarify.', nurse: 'Prepare ICG or the cholangiography set if the surgeon asks.', fig: { base: 'hc-triangle', hl: ['cd', 'ca', 'plate', 'tri'], marks: [{ t: 'dot', x: 196, y: 190 }, { t: 'dot', x: 196, y: 142 }, { t: 'label', x: 120, y: 280, text: 'Two structures only = CVS', tone: 'safe' }] } },
          { t: 'Clip and divide', moves: ['clip', 'cut'], d: 'Two clips on the patient side and one on the gallbladder side, on the duct and on the artery. Divide between them.', tip: 'Wide duct: endoloop or suture. See the clip tips cross the full width of the structure.', danger: 'A clip that catches part of the CHD, or energy on the duct.', nurse: 'Clip applier (10 mm or 5 mm), laparoscopic scissors, endoloop available.', fig: { base: 'hc-triangle', hl: ['cd', 'ca'], marks: [{ t: 'clip', x: 232, y: 207, a: 82 }, { t: 'clip', x: 244, y: 208, a: 84 }, { t: 'clip', x: 206, y: 199, a: 70 }, { t: 'cut', x1: 218, y1: 190, x2: 222, y2: 214 }, { t: 'clip', x: 220, y: 116, a: 40 }, { t: 'clip', x: 212, y: 122, a: 40 }, { t: 'clip', x: 196, y: 139, a: 40 }, { t: 'cut', x1: 196, y1: 124, x2: 212, y2: 138 }] } },
          { t: 'Cholangiography or ICG as needed', d: 'When the anatomy is unclear, a duct stone is suspected or after gallstone pancreatitis: intraoperative cholangiography or fluorescence imaging.', tip: 'ICG reaches the CBD about 15 minutes to two hours after intravenous injection. It adds to the CVS; it does not replace it.', danger: 'A cholangiogram showing only partial filling does not exclude an injury.', nurse: 'Cystic duct catheter, syringes with diluted contrast, radiation protection.', fig: { base: 'biliary-tree', hl: ['cd', 'chd', 'cbd', 'rhd', 'lhd', 'duod'], marks: [{ t: 'arrow', x1: 120, y1: 210, x2: 166, y2: 182, label: 'Catheter', lx: 104, ly: 226 }] } },
          { t: 'Separate the gallbladder from the bed', d: 'Separate the gallbladder from the liver in the plane between gallbladder and plate, with alternating traction. Before the final detachment, check the clips and the bed.', tip: 'The last check is done while the fundus is still retracted and gives good exposure.', danger: 'Entering the liver: bleeding from the veins of the bed. In some patients a large vein runs close by.', nurse: 'Suction and irrigation, hemostatic agent available.', fig: { base: 'hc-triangle', hl: ['gb', 'plate', 'liver'], marks: [{ t: 'path', d: 'M74 70 C100 100 130 130 170 170', tone: 'solid' }, { t: 'arrow', x1: 120, y1: 160, x2: 80, y2: 196, label: 'Alternating traction', lx: 70, ly: 214 }] } },
          { t: 'Extraction and closure', d: 'Gallbladder in a bag through the umbilicus. Look for and retrieve spilled stones. Close the fascia at ports of 10 mm and above.', tip: 'Enlarge the umbilical port as needed so the bag doesn’t tear.', danger: 'Stones left in the abdomen: late perihepatic abscesses.', nurse: 'Retrieval bag, 0 absorbable for fascia, 4-0 skin suture.', fig: { view: 'access', over: { target: { x: 150, y: 210, rx: 30, ry: 18, label: 'Extraction' } } } }
        ],
        equipment: [
          { cat: 'Optics and access', items: ['30° scope, 10 or 5 mm.', '12 mm Hasson port, a 10 mm port and two 5 mm ports.', 'Insufflator with warmed CO2.'], alt: ['Veress needle', 'Optical port', '0° scope in a thin patient'] },
          { cat: 'Dissection and energy', items: ['L-hook diathermy.', 'Maryland forceps.', 'Two atraumatic graspers, one locking.', 'Laparoscopic scissors.'], alt: ['Ultrasonic device (Harmonic) for an inflamed gallbladder', 'Bipolar device', 'Toothed (claw) grasper for a tense gallbladder'] },
          { cat: 'Duct and artery closure', items: ['Metal clip applier, medium-large.', 'Endoloop for a wide duct.'], alt: ['Locking polymer clips (Hem-o-lok)', 'Absorbable clips', 'Intracorporeal suture'] },
          { cat: 'Imaging', items: ['Cholangiography set and C-arm.', 'ICG option on a near-infrared camera.'], alt: ['Laparoscopic ultrasound'] },
          { cat: 'Other', items: ['Suction and irrigation.', 'Retrieval bag.', 'Needle to decompress a tense gallbladder.', 'Closed drain as needed.'], alt: ['Hemostatic agent (oxidized cellulose)'] },
          { cat: 'Sutures', items: ['0 absorbable for fascia (with a suture passer).', '4-0 absorbable for skin, or skin glue.'] }
        ],
        pitfalls: [
          { p: 'Mistaking the CBD for the cystic duct', fix: 'No cutting without the CVS. Name the structures out loud and document with a photo.' },
          { p: 'Cephalad traction on the fundus only', fix: 'Add lateral traction on Hartmann’s pouch and check the CBD is not stretched.' },
          { p: 'Dissection below the R4U line', fix: 'Bring the work back high on the gallbladder and on its side.' },
          { p: 'A cystic artery that is “too thick”', fix: 'Think of a right hepatic artery loop. Follow it until you see it enter the gallbladder wall.' },
          { p: 'Active hook near structures', fix: 'Apply energy only to lifted, fully visible tissue, in short bursts.' }
        ]
      },
      {
        key: 'robotic', kind: 'robotic', label: 'Robotic', inherit: 'lap',
        deltas: ['All ports in one transverse line near the umbilicus, mostly 8 mm. Plus a 12 mm assistant port.', 'A third hand (arm 4) holds the fundus, so the surgeon controls all the traction.', 'Built-in ICG imaging: easy to use routinely as an addition to the CVS.', 'No haptic feedback: traction is judged by eye. Beware of tearing an inflamed gallbladder.', 'Conversion requires undocking first; the team needs to rehearse it.'],
        setup: {
          position: { kind: 'supine', tilt: 15, roll: 'left', pressure: ['occiput', 'elbow', 'sacrum', 'heel', 'face'] },
          room: { arms: { R: 'tucked', L: 'tucked' }, legs: 'together', staff: [{ w: 'B', s: 'Lt3' }, { w: 'N', s: 'Rt3' }], monitors: ['LtFar2'], robot: { s: 'RtFar2' }, console: true },
          notes: ['Supine, head up and left tilt before docking.', 'Don’t change position while docked (unless the table is integrated).', 'Protect the face from the robot arms.'],
          arms: ['Both arms tucked and padded.'],
          team: ['Robot cart on the patient’s right or at the head, depending on the model.', 'Bedside assistant on the left, at the assistant port.', 'Surgeon at the console, with eye and voice contact with the team.']
        },
        access: {
          target: { x: 92, y: 132, rx: 36, ry: 26, label: 'Gallbladder' },
          ports: [
            { x: 150, y: 208, mm: 8, role: 'camera', label: 'Umbilical. Camera', n: 1 },
            { x: 206, y: 214, mm: 8, role: 'robot', label: 'Left of the umbilicus. Surgeon’s right hand', n: 2 },
            { x: 94, y: 214, mm: 8, role: 'robot', label: 'Right of the umbilicus. Left hand: Hartmann’s', n: 3 },
            { x: 58, y: 222, mm: 8, role: 'robot', label: 'Right lateral. Arm 4: fundus', n: 4 },
            { x: 236, y: 252, mm: 12, role: 'assist', label: 'Assistant port, left lower abdomen. Suction, clips, bag', n: 'A' }
          ],
          notes: ['About 15–20 cm from the target and 6–8 cm between ports.', 'Align the line so the target is at its center.'],
          docking: ['Target the robot on the gallbladder.', 'Dock the camera first, then the arms.', 'Check the arms do not press on the body or the face.']
        }
      },
      {
        key: 'open', kind: 'open', label: 'Open',
        setup: {
          position: { kind: 'supine', tilt: 10, pressure: ['occiput', 'elbow', 'sacrum', 'heel'] },
          room: { arms: { R: 'out', L: 'out' }, legs: 'together', staff: [{ w: 'S', s: 'Rt2' }, { w: 'A', s: 'Lt2' }, { w: 'N', s: 'Rt3' }] },
          notes: ['Supine, sometimes a small roll under the right ribs.', 'Self-retaining retractor system mounted before incision.'],
          arms: ['Both arms out to 90°.'],
          team: ['Surgeon on the patient’s right, assistant on the left.', 'Focused light on the right upper quadrant.']
        },
        access: {
          target: { x: 92, y: 132, rx: 36, ry: 26, label: 'Gallbladder' },
          incisions: [{ id: 'subcostal-R', label: 'Right subcostal (Kocher), two fingerbreadths below the costal margin', lx: 96, ly: 100 }, { id: 'midline-upper', label: 'Upper midline', alt: true, lx: 170, ly: 140 }],
          notes: ['A subcostal incision gives good exposure. Upper midline if the whole abdomen is needed.', 'When converting from laparoscopy, ports can be joined.']
        },
        steps: [
          { t: 'Opening and exposure', d: 'Subcostal incision, divide the wall muscles and open the peritoneum. A self-retaining retractor lifts the costal margin.', tip: 'Moist pack over the bowel and duodenum. Retractor lifts the liver.', danger: 'Dividing intercostal nerves at the end of the incision weakens the wall.', fig: { view: 'access' } },
          { t: 'Fundus first (dome-down)', d: 'Separate the gallbladder from the liver from the fundus downward, close to the gallbladder.', tip: 'In an inflamed gallbladder: work in the gallbladder wall or just under the plate. Move to a superficial plane before reaching the porta.', danger: 'Losing your way medially leads to a high CHD injury.', fig: { base: 'hc-triangle', hl: ['gb', 'plate', 'liver'], marks: [{ t: 'arrow', x1: 92, y1: 40, x2: 176, y2: 176, cx: 150, cy: 70, label: 'Fundus downward', lx: 200, ly: 60 }] } },
          { t: 'Identify the cystic structures', d: 'When the gallbladder hangs only on the duct and artery, confirm only two structures enter it.', tip: 'Without safe identification: subtotal cholecystectomy, not blind division.', danger: 'Arterial bleeding: pressure and control, not blind ligation.', fig: { base: 'hc-triangle', hl: ['cd', 'ca', 'gb'] } },
          { t: 'Ligate and divide', d: 'Double ligation of the artery and the duct close to the gallbladder, then divide.', tip: 'Ligature plus a transfixion suture around a wide duct.', fig: { base: 'hc-triangle', hl: ['cd', 'ca'], marks: [{ t: 'stitch', x1: 226, y1: 196, x2: 236, y2: 218, n: 3 }, { t: 'cut', x1: 212, y1: 190, x2: 216, y2: 214 }] } },
          { t: 'Hemostasis and closure', d: 'Check the bed, drain as needed and close in layers.', tip: 'Drain if the gallbladder was stuck to the liver, the duct stump is poor or a bailout was done.', fig: { view: 'access' } }
        ],
        equipment: [
          { cat: 'Opening and exposure', items: ['Laparotomy set.', 'Self-retaining retractor (Bookwalter or Omni).', 'Hand-held retractors (Deaver).'], alt: ['Thompson retractor'] },
          { cat: 'Dissection', items: ['Metzenbaum scissors.', 'Right-angle forceps.', 'Diathermy.'], alt: ['Ultrasonic device'] },
          { cat: 'Ligation', items: ['2-0 and 3-0 absorbable ties.', 'Clips.'] },
          { cat: 'Closure', items: ['Slowly absorbable suture for the fascia.', 'Closed drain.'] }
        ]
      }
    ],
    compare: {
      rows: [
        { k: 'When to choose', v: { lap: 'Default in most cases', robotic: 'Availability and experience, obesity, routine ICG', open: 'Bailout, lack of instruments, part of another operation' }, best: 'lap' },
        { k: 'Pain and stay', v: { lap: 'Little pain, usually same-day discharge', robotic: 'Similar to laparoscopy', open: 'More pain, a stay of several days' } },
        { k: 'Operating time', v: { lap: 'Short', robotic: 'Longer (docking)', open: 'Variable' } },
        { k: 'Cost', v: { lap: 'Low', robotic: 'High', open: 'Moderate (admission)' }, best: 'lap' },
        { k: 'Technical advantage', v: { lap: 'Haptic feedback, speed', robotic: 'Stability, third arm, suturing', open: 'Direct palpation' } },
        { k: 'Weak point', v: { lap: 'Depends on the assistant for traction', robotic: 'Slower conversion', open: 'Shrinking resident experience' } }
      ],
      note: 'The comparison is qualitative, not based on institutional data.'
    },
    bailout: ['Decompress a tense gallbladder with a needle.', 'An extra port, change the traction and call a senior.', 'Cholangiography or ICG to clarify the anatomy.', 'Fundus first (dome-down), carefully and close to the gallbladder.', 'Subtotal cholecystectomy: fenestrating or reconstituting, with a drain.', 'Cholecystostomy when progress is not possible.', 'Conversion to open, knowing it is not always safer.'],
    intraop: [
      { c: 'Cystic artery bleeding', do: 'Pressure with a grasper, suction, an extra port and identification. Never clip blindly.' },
      { c: 'Bleeding from the bed', do: 'Pressure, diathermy or a sealing device, hemostatic agent. Check again at low pneumoperitoneum pressure.' },
      { c: 'Suspected bile duct injury', do: 'Stop. Cholangiogram to define it. If you have no repair experience: wide drainage and transfer to an HPB center. Don’t repair under pressure.' },
      { c: 'Gallbladder perforation and spilled stones', do: 'Suction, collect stones into a bag and irrigate. Document in the operative note.' },
      { c: 'Bowel or duodenal injury', do: 'Immediate suture repair. Thermal injury: oversew it even if it looks small.' }
    ],
    postop: {
      care: ['Elective case: usually discharge the same day or the next day.', 'Normal diet when the patient wants.', 'Multimodal analgesia, minimal opioids.', 'Drain (if any): remove on day 1–2 if there is no bile.', 'Warning signs: fever, increasing pain, jaundice, vomiting. Any of these means early assessment.'],
      complications: [
        { c: 'Bile leak', d: 'From the cystic stump or Luschka ducts. Percutaneous drainage and ERCP with a stent.' },
        { c: 'Bile duct injury', d: 'Workup with imaging and treatment in a specialist center. Early or delayed repair depending on the situation.' },
        { c: 'Retained duct stone', d: 'Pain, jaundice or pancreatitis. ERCP.' },
        { c: 'Collection in the gallbladder bed', d: 'Stable patient without signs of infection: observe. Otherwise percutaneous drainage.' },
        { c: 'Port-site hernia', d: 'Usually at the umbilicus. Prevented by closing the fascia.' }
      ]
    },
    quiz: [
      { q: 'Which of these is not part of the critical view of safety (CVS)?', a: ['The hepatocystic triangle cleared of fat', 'The lower third of the gallbladder separated from the plate', 'Display of the CBD along its full length', 'Only two structures entering the gallbladder'], c: 2, why: 'The CVS does not require exposing the CBD. Trying to expose it even increases the risk.' },
      { q: 'Which traction opens the hepatocystic triangle?', a: ['Fundus down, Hartmann’s up', 'Fundus to the right shoulder, Hartmann’s lateral and down', 'Hartmann’s toward the liver', 'No traction, dissection only'], c: 1, why: 'Lateral traction on Hartmann’s pouch creates an angle between the cystic duct and the CHD.' },
      { q: 'Below which landmark should you not dissect?', a: ['The falciform ligament', 'Rouvière’s sulcus', 'The umbilicus', 'The stomach'], c: 1, why: 'Rouvière’s sulcus defines the R4U line. Dissection stays above it.' },
      { q: 'You cannot achieve the CVS in a severely inflamed gallbladder. What is the right step?', a: ['Divide the thickest structure', 'A bailout option, for example subtotal cholecystectomy with a drain', 'Stop the operation and do nothing', 'Clip all the structures'], c: 1, why: 'When identification is not safe, choose a bailout option rather than pushing on.' },
      { q: 'When is intraoperative cholangiography recommended?', a: ['In every case', 'Never', 'Selectively: unclear anatomy or a suspected duct stone', 'Only in robotic surgery'], c: 2, why: 'Routine cholangiography has not been shown to reduce injuries. Use it on indication.' }
    ],
    sources: [
      { b: 'SAB22', ref: 'Sabiston 22, chapter 88: Biliary System, pp. 1213–1248 (laparoscopic cholecystectomy, cholangiography, ICG and bailout options on pp. 1231–1234).' },
      { b: 'CST14', ref: 'Current Surgical Therapy 14: Management of Acute Cholecystitis, pp. 462–467.' },
      { b: 'CST14', ref: 'Current Surgical Therapy 14: Management of Common Bile Duct Stones, pp. 476–480.' },
      { b: 'SAB22', ref: 'Sabiston 22, chapter 25: Surgical Site Infections (antibiotic prophylaxis and skin preparation).' },
      { b: 'GL', ref: 'Tokyo Guidelines 2018 (TG18) for acute cholecystitis.' },
      { b: 'GL', ref: 'Multi-society guideline for the prevention of bile duct injury: SAGES, AHPBA, ISDS and WSES, 2020.' },
      { b: 'GL', ref: 'ASHP, IDSA, SIS and SHEA guidelines for surgical antibiotic prophylaxis, 2013.' }
    ],
    gaps: ['No video or photos from real operations yet (by design).', 'The Strasberg classification of bile duct injuries is not shown.']
  });
})();
