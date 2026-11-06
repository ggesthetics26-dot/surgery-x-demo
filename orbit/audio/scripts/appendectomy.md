# James · live case: appendectomy

Voice: James (ElevenLabs, Eleven v3). Calm, warm attending in the OR, talking to a resident next to him. Natural pace, short pauses at full stops. The tag in brackets is the delivery for that line.

348 lines · about 5395 words · about 36 minutes of audio.
Record: from Surgery X, `python3 tools/live-voice.py orbit/data/live/appendectomy.js`

| key | tone | line |
|---|---|---|
| `hello` | warm | Hello, doctor. I’m James, and I’m on call with you tonight. We’ve got appendicitis waiting in the ER. Which case do you want to take? |
| `gen-unclear` | casual | Sorry, I’m not sure I followed. Did you mean one of these? |
| `gen-again` | casual | Say it another way, or pick one of the options. |
| `gen-miss` | calm | Not there. Look again and pick a spot. |
| `er` |  | Hello, doctor. We’ve got appendicitis in the ER. Let’s go and see the patient together. |
| `s_er` |  | Hello, doctor. We’ve got appendicitis in the ER. He’s twenty-three, with pain that moved from the navel down to the right lower quadrant. What’s the first thing you do? |
| `s_er-o0` | warm | Good. That’s how we start. Let’s see what comes out. |
| `s_er-o1` |  | You could, but hang on. He’s twenty-three. Let’s do a score first and decide whether he needs the radiation at all. |
| `s_er-o2` | serious | Hold on. Take a breath. I’m sure it’s appendicitis too, and I’m wrong about once a month. Let’s examine him. |
| `s_score` |  | White count fourteen thousand, CRP up, tenderness and rebound in the right lower quadrant. Which score do you calculate? |
| `s_score-o0` | warm | Exactly. His AAS comes out at seventeen. That’s high risk. |
| `s_score-o1` |  | Alvarado is fine for ruling out. For ruling in, it’s weaker. Let’s do an AAS. It comes out at seventeen. |
| `s_score-o2` | serious | The abdomen tells you a lot, but not everything. A short story: once I was certain, and it turned out to be the kidney. His AAS is seventeen. |
| `s_img` |  | AAS seventeen, and he’s twenty-three. Does he need imaging before we go up? |
| `s_img-o0` | warm | Good. Ultrasound shows a nine millimeter appendix, no fecalith and no free fluid. Uncomplicated appendicitis. |
| `s_img-o1` |  | If it has to be CT, then low dose, yes. Nine millimeter appendix, no fecalith. |
| `s_img-o2` | serious | To be safe for whom? Him, or you? All right, we’ll do it. Nine millimeter appendix, no fecalith. |
| `p_er` |  | Hello, doctor. Thirty-four-year-old man, three days of pain at home, now thirty-eight point nine and tender all the way down to the pelvis. The CT is already up. |
| `p_ct` |  | The CT shows a perforation, a fecalith and a small collection in the pelvis, two centimeters. What’s the plan? |
| `p_ct-o0` | warm | Right. With peritonitis we don’t wait for the morning. I’ll call the OR. |
| `p_ct-o1` | serious | With a fecalith and a perforation? In CODA those were exactly the ones who failed and got worse. All right, let’s see what the morning brings. |
| `p_ct-o2` |  | The collection is too small to drain, and his abdomen is peritonitic. Let’s not drag this out. OR tonight. |
| `p_nomfail` |  | Six in the morning. Heart rate one eighteen, and the abdomen is harder. Antibiotics won’t close that hole. We go now. |
| `r_er` |  | Hello, doctor. Forty-one-year-old man, BMI thirty-four, right flank pain and a little blood in the urine. What do you think? |
| `r_er-o0` | warm | Exactly. Forty-one with a high BMI, so a low-dose CT makes sense here. |
| `r_er-o1` | serious | Wait. Before you hand him over to urology, remember that a retrocecal appendix sits right on the ureter. We’ll do a CT. |
| `r_er-o2` |  | You could, but at a BMI of thirty-four it won’t see a thing. We tried, and there’s nothing to see. Off to CT. |
| `r_ct` |  | CT: an eleven millimeter appendix behind the cecum, inflamed fat around it, no fecalith and no ureteric stone. So it’s ours. |
| `w_er` |  | Hello, doctor. In the ER there’s a twenty-seven-year-old woman with a full day of right lower quadrant pain and nausea. Her last period isn’t clear. What comes first? |
| `w_er-o0` | warm | Good. That’s it. A pregnancy test before anything else, always. |
| `w_er-o1` | serious | Wait. Stop. A CT before a pregnancy test? Never. The test comes first. |
| `w_er-o2` | serious | Hold on. Take a breath. In RIFT almost a quarter of young women had a normal appendix removed. Pregnancy test first. |
| `w_hcg` |  | The pregnancy test is negative. AAS ten, so intermediate risk. What now? |
| `w_hcg-o0` | warm | Right. The ultrasound isn’t conclusive, so a low-dose CT. |
| `w_hcg-o1` |  | Sometimes that’s the right place for it, but imaging first. She’s stable. Ultrasound, then a low-dose CT. |
| `w_hcg-o2` | serious | With right lower quadrant tenderness and an AAS of ten? No. She stays, and she gets imaged. |
| `w_img` |  | On ultrasound the appendix isn’t well seen, and there’s a little fluid in the pelvis. The CT shows a borderline appendix and slightly inflamed fat. Let’s do a laparoscopy and see what’s there. |
| `w_preg` |  | The pregnancy test is positive. Fourteen weeks by dates. Take a breath. What now? |
| `w_preg-o0` | warm | Good. The ultrasound is inconclusive. MRI shows a nine millimeter appendix with inflammation around it. |
| `w_preg-o1` |  | In a pinch, maybe, but not as a first choice. There’s an MRI slot free. MRI: a nine millimeter appendix with inflammation. |
| `w_preg-o2` | serious | Pregnancy is exactly when we don’t try antibiotics. A perforation is more dangerous to the baby than the operation. We did the MRI: appendicitis. |
| `w_preg-o3` | serious | Wait. Stop. A normal appendix in pregnancy isn’t free. The baby pays too. MRI first. It showed appendicitis. |
| `w_preg_how` |  | Uncomplicated appendicitis at fourteen weeks. How do we operate? |
| `w_preg_how-o0` | warm | Right. SAGES and WSES prefer laparoscopy when there’s experience. And we have it. |
| `w_preg_how-o1` |  | People used to think so, and there were old studies too. Today the guidelines prefer laparoscopy. We’ll do it laparoscopically. |
| `e_er` |  | Hello, doctor. Seventy-one-year-old woman, nine days of pain, and now a tender mass in the right lower quadrant. What comes first? |
| `e_er-o0` | warm | Good. At her age, with a mass, it’s a CT. |
| `e_er-o1` |  | Ultrasound will show you a mass but won’t tell you what it is. Let’s go to CT. |
| `e_er-o2` | serious | Hold on. Nine days and a mass. Before we go in, I want to know what’s in there. CT. |
| `e_ct` |  | On CT the appendix is dilated to three centimeters. It’s cystic, with a thin wall and no inflammation around it. What does that tell you? |
| `e_ct-o0` | warm | Exactly. One goal: intact, with no rupture. I’ll let the OR know. |
| `e_ct-o1` | serious | Wait. Stop. A needle in a mucinous cyst spreads it through the abdomen. Remember that. It’s already been done, so we move on to surgery. |
| `e_ct-o2` |  | Mucocele is a description, not a diagnosis. It comes out, gently. We’ll book her for the morning. |
| `e_mass` |  | On CT there’s a phlegmon with a four centimeter abscess next to the cecum. She’s stable. Do we operate now? |
| `e_mass-o0` | warm | That’s exactly what I’d do. Radiology will drain it this morning. |
| `e_mass-o1` |  | Possible, with experience and a low threshold to stop. All right, let’s try. But if it won’t move, we come out. |
| `e_mass-o2` | serious | I’ll tell you how this ends: a cecal resection at three in the morning. Let’s see. |
| `e_force` |  | Wait. Look. Everything’s stuck together, and the cecum is edematous and falls apart at every touch. What do we do? |
| `e_force-o0` | warm | Good. That’s the decision of a mature surgeon. A drain, antibiotics, and we come back to her in a couple of months. |
| `e_force-o1` | serious | Wait. Stop. The cecum has just torn in front of us. Now there’s no choice. |
| `e_resect` |  | We opened. An ileocecal resection with an anastomosis. She’ll get through it, but that isn’t the operation she needed tonight. |
| `e_drain` |  | We drained it, she’s on antibiotics, and after three days the fever settled. We discharge her with a clinic appointment. |
| `e_follow` |  | Six weeks later. She feels great. She’s seventy-one. What next? |
| `e_follow-o0` | warm | Right. And in Peri-APPAC one in five over forty had a tumor, so I’m in favor of talking to her about taking it out. |
| `e_follow-o1` | warm | That’s legitimate too. SAGES suggests it, and Peri-APPAC supports it at her age. Colonoscopy first. |
| `e_follow-o2` | serious | Wait. She’s seventy-one, with an abscess around the appendix. I’m not closing the file without a colonoscopy. |
| `e_neo` |  | The colonoscopy is normal and the CT is clean. If the appendix comes out later, it’ll be done calmly, with no inflammation. |
| `e_neo_pos` |  | At the planned appendectomy, pathology found a small neoplasm in the appendix. That’s why we asked. She’s on her way to the multidisciplinary meeting. |
| `nom` |  | Uncomplicated appendicitis, no fecalith. He asks you: do I have to have an operation? |
| `nom-o0` | warm | Nice. Exactly like that: about a third end up having the operation within a few years. He asks what you would do. |
| `nom-o1` |  | Surgery is an excellent choice, but it isn’t true that there’s no other option. Next time, tell him. |
| `nom-o2` | serious | Hold on. The end of it? Almost four in ten come back within five years. Be fair with him. |
| `nom_ask` |  | He hears you out and says: I’m a student, I have exams, I don’t want this coming back. What do you recommend? |
| `nom_ask-o0` | warm | Agreed. He told you what matters to him, and you answered accordingly. To the OR. |
| `nom_ask-o1` | warm | Also fine, as long as he understands the cost. We start antibiotics and follow him up. |
| `nom_course` |  | Two days of antibiotics. The pain has settled and he’s eating. We discharge him and explain when to come back. |
| `nom_ok` |  | A month later, in clinic. He’s fine. Remember: this isn’t cured, it’s settled for now. That’s how you explain it to him. |
| `nom_fail` |  | Two weeks later he’s back with the same pain. That happens to about a third. No guilt. This time we operate. |
| `timing` |  | It’s eleven at night and the emergency list is full. When do we operate? |
| `timing-o0` | warm | Good. He gets a dose and goes first in the morning. He’ll rest, he’ll sleep, and so will you. |
| `timing-o1` |  | That’s fine too. SAGES accepts both. So we go. I’ll call the OR team. |
| `timing-o2` | serious | Hold on. That’s past twenty-four hours. We don’t push him back because of the list. He goes in the morning. |
| `consent` |  | Before we go up. What needs to be in place? Tick everything. |
| `consent-ok` | warm | Excellent. Everything’s in place. Let’s go up. |
| `consent-m0` | serious | You forgot the consent. Without it, nobody touches him. |
| `consent-m1` | serious | Antibiotics before the incision. One dose. It cuts infections. |
| `consent-m2` | serious | The bladder. A suprapubic port with a full bladder is a bad story. |
| `consent-m4` | serious | Bowel prep? Not for appendicitis. We skip it. |
| `consent-m5` | serious | Analgesia doesn’t mask the exam. We don’t leave him in pain. |
| `n_tray` |  | You’re scrubbed for this one. What do you lay out on the table for an appendectomy? |
| `n_tray-ok` | warm | Good. A tidy table makes a calm operation. |
| `n_tray-m0` | serious | The access set. Without it we don’t start. |
| `n_tray-m1` | serious | The trocars. One big and two small. |
| `n_tray-m2` | serious | A thirty degree scope. With a zero you can’t see behind the cecum. |
| `n_tray-m3` | serious | The base closure. Loops, clips, and a stapler in the room even if we don’t open it. |
| `n_tray-m4` | serious | Bag and suction. I don’t take out an inflamed appendix without a bag. |
| `n_tray-m5` | serious | A big retractor? In the room, but not opened. We don’t open everything we have. |
| `position` |  | He’s on the table and asleep. How do we position him, and where does the screen go? |
| `position-o0` | warm | Exactly. The small bowel drops to the left and clears the pelvis for us. That’s convention rather than evidence, but it works. |
| `position-o1` |  | You’ll stand on the left and keep bumping into his arm. Let’s tuck it and move the screen to the right side. |
| `position-o2` | serious | Hold on. On the right you’ll be working against the camera. Stand on the left and look to the right. |
| `entry` |  | We go in at the umbilicus. How? |
| `entry-o0` | warm | Good. I can see the peritoneum. Open it. Gas on. |
| `entry-o1` | warm | Fine. Opening pressure of four, we’re in. Then the trocar. |
| `entry-o2` | serious | Wait. Stop. A blind needle over inflamed bowel? We go in at the umbilicus. |
| `preg_table` |  | Fourteen weeks. What changes on the table? |
| `preg_table-ok` | warm | Exactly. And all the ports move up according to the size of the uterus. That part is convention. |
| `preg_table-m0` | serious | Left tilt. The uterus presses on the vena cava. |
| `preg_table-m1` | serious | Low pressure. Just enough to see. |
| `preg_table-m2` | serious | Open entry, and high. No blind needle over a uterus. |
| `preg_table-m3` | serious | The obstetric team decides on monitoring. We talk to them. |
| `preg_table-m4` | serious | Above the pubis there’s a uterus. The ports move up. |
| `ports` |  | Three ports. The camera goes in the umbilicus. Where do the other two go? Tap the abdomen. |
| `ports-g` | warm | Good. A nice triangle, with both instruments aimed at the right lower quadrant. |
| `ports-o` |  | That’ll work, but one of them is cramped. Next time, leave a hand’s breadth between the ports. |
| `ports-b` | serious | Like that, your instruments will be fighting each other. See where the green dots are. That’s where I’d put them. |
| `ports-d0` | urgent | Wait. Stop. That’s too low, it’s the bladder. Two finger-breadths above the pubic bone. |
| `ports-d1` | urgent | Hold on. The inferior epigastric runs there. Move lateral, outside the rectus. |
| `ports-d2` | urgent | Hold on. There’s an epigastric on the right too. And besides, on the right you have no triangle. |
| `ports-d3` | urgent | That’s too close to the appendix. Your instruments will clash with the camera. Move away, to the other side. |
| `ports_preg` |  | Fourteen weeks. The uterus is above the pubis. Where do the three ports go now? |
| `ports_preg-g` | warm | Excellent. High above the uterus, and still a triangle. |
| `ports_preg-o` |  | Almost. Go up a little more. The uterus is bigger than it looks from outside. |
| `ports_preg-b` | serious | Too low. In pregnancy all the ports move up. Look at the green dots. |
| `ports_preg-d0` | urgent | Wait. Stop. That’s the uterus. At fourteen weeks we go above it. |
| `survey` |  | The camera’s in. Before we touch the appendix, what do we check? |
| `survey-o0` | warm | Good. That way you don’t miss anything. Tell me what you see. |
| `survey-o1` | serious | Hold on. We know what the CT said. The abdomen hasn’t read the CT. A survey, thirty seconds. |
| `stu_anat` |  | Before we carry on, show me the terminal ileum. |
| `stu_anat-ok` | warm | Right. From there we follow it to the cecum, and from the cecum to the base. |
| `stu_anat-bad` | serious | No. The terminal ileum enters the cecum on the right of the picture. Look again. |
| `xp` |  | Let’s see what we’ve got here. |
| `xp_s` |  | The appendix is red and swollen, with no pus and no perforation. The pelvis is clean. Simple appendicitis. |
| `xp_p` |  | Pus in the pelvis and the right gutter, omentum wrapped around it, and a perforation at the tip. Breathe. It always looks worse than it is. |
| `xp_r` |  | The cecum is clear at the front, and there’s no appendix. It’s hiding behind. Cloudy fluid in the gutter, so there’s probably some gangrene back there. |
| `xp_w` |  | The ovaries and tubes look normal. The appendix is red and swollen. So it is appendicitis after all. |
| `w_miss` |  | You skipped the pelvis, but I had a look. This time the ovaries are fine. Remember, in her, that’s the first thing you check. |
| `xp_e` |  | The appendix is tense and cystic, the peritoneum is clean, no mucin and no deposits. Excellent. Now, don’t touch it directly. |
| `grade` |  | What grade do you put in the operation note? |
| `grade-o0` | warm | Right. Simple. |
| `grade-o1` | serious | Hold on. With what we’re seeing here? This is complicated. Record it correctly, it changes what comes next. |
| `grade-o2` | warm | Right. Complicated. That means a short course of antibiotics afterwards. |
| `grade-o3` |  | No. There’s no gangrene and no perforation here. Simple. Overgrading means antibiotics he doesn’t need. |
| `gyn_tor` |  | Wait. Look in the pelvis. The right ovary is dark and twisted. The appendix is quiet. What do we do? |
| `gyn_tor-o0` | warm | Good. Gynecology is on the way up. Look, now that it’s untwisted it’s already pinking up. |
| `gyn_tor-o1` | serious | Wait. Stop. Dark doesn’t mean dead. She’s twenty-seven. We untwist it and wait. Gynecology is on the way. |
| `gyn_tor-o2` | serious | Hold on. What did we come in for? The ovary is the story. Untwist it first. |
| `gyn_pid` |  | Pus in the pelvis, and the tubes are red and swollen. The appendix looks clean from the outside. What do you think? |
| `gyn_pid-o0` | warm | Right. This is PID. Antibiotics as gynecology advises, and testing for her partner. |
| `gyn_pid-o1` |  | Look at the tubes. The pus is coming from the pelvis, not the appendix. Culture first. |
| `gyn_cyst` |  | Blood in the pelvis, and the source is the ovary. A ruptured cyst. The appendix is normal. What do we do? |
| `gyn_cyst-o0` | warm | Good. It’s not bleeding anymore. Give the pelvis a good suction. |
| `gyn_cyst-o1` | serious | Slowly. That’s the ovary of a twenty-seven-year-old. Pinpoint, and the minimum of heat. |
| `gyn_app` |  | We’ve found another explanation. The appendix is normal. Do we take it out or leave it? |
| `gyn_app-o0` | warm | Agreed. The problem was the ovary. There’s no need to add another operation. |
| `gyn_app-o1` |  | Some people do. Just know that removing a normal appendix can go wrong too. All right, we’ll take it out. |
| `normal_app` |  | The appendix looks normal and the pelvis is clean. No other finding. What do we do? |
| `normal_app-o0` | warm | Exactly. Look first, then decide. |
| `normal_app-o1` | serious | Hold on. She’ll be back in a month with the same pain, and we’ll know nothing. At least run the small bowel. |
| `normal_app-o2` |  | We’ll take it out, but before that I’d run the small bowel. Three minutes. |
| `meckel_run` |  | We’ve run the small bowel. Clean. So the appendix comes out. |
| `meckel_hot` |  | There. A red, swollen Meckel’s, sixty centimeters from the ileocecal junction. That’s her story. What do we do? |
| `meckel_hot-o0` | warm | Right. Stapler across the base, nice. And we’ll take the appendix too, since we’ve come all this way. |
| `meckel_hot-o1` | serious | Hold on. That’s exactly what we came for. That’s what’s hurting her. We resect it. |
| `meckel` |  | Look what we’ve found. A quiet Meckel’s on the small bowel, and the appendix is inflamed. Do we resect it? |
| `meckel-o0` | warm | Nice. Twenty-three with a narrow base, I’d resect it. But what matters most is that you wrote down why. |
| `meckel-o1` |  | You can. Just know that in the review the complication rate after resection was almost six percent. |
| `meckel-o2` | serious | Leaving it is allowed. Not writing it down isn’t. Whoever opens him in ten years’ time needs to know. |
| `find` |  | Show me where the base is. A hint: the taeniae of the cecum know. |
| `find-ok` | warm | Good. The three taeniae meet exactly there. That’s the base, and that never changes. |
| `find-bad` | serious | No. Follow the anterior taenia down until it meets the other two. |
| `find2` |  | Now that we know where the base is, we can get to work. |
| `p_omen` |  | The omentum is wrapped around the appendix and the small bowel is stuck to it. How do we free it? |
| `p_omen-o0` | warm | Good. See how it comes apart by itself. That’s what I like about fresh inflammation. |
| `p_omen-o1` | serious | Wait. Stop. Inflamed bowel tears like wet paper. |
| `c_ent_in` |  | There’s a small hole in the small bowel, where you grabbed it. Take a breath. What do we do? |
| `c_ent_in-o0` | warm | Good. Two stitches, watertight. An injury you recognize isn’t a disaster. An injury you miss is. |
| `c_ent_in-o1` | serious | Wait. Stop. A hole in the bowel doesn’t close by itself. But you’re the surgeon, and I’ve seen what you chose. |
| `p_fec` |  | The CT showed a fecalith. The appendix is perforated. Show me where it is. |
| `p_fec-ok` | warm | Exactly. It came out through the perforation. It goes in the bag before anything else. |
| `p_fec-bad` | serious | Not there. Look next to the perforation, down in the pelvis. A fecalith that’s left behind comes back as an abscess. |
| `r_mob` |  | The base is here, but the body and the tip are behind the cecum. How do we go on? |
| `r_mob-o0` | warm | Good. Show me where you’re cutting. |
| `r_mob-o1` | warm | Also right. A retrograde appendectomy. When the tip is stuck high up, that’s the safest way. That one’s convention. |
| `r_mob-o2` | serious | Hold on. You can’t see the tip, so what are you going to grab? All right, let’s try. |
| `r_toldt` |  | Show me where you cut the peritoneum. |
| `r_toldt-z0` |  | Exactly. On the white line, and not deep. The cecum is starting to move. |
| `r_toldt-z1` | serious | I told you that’s the ureter. All right, I’m moving you to the right line. |
| `r_toldt-s1` | urgent | Wait. Stop. That’s the ureter. It runs under the cecum, not on top of it. |
| `r_toldt-z2` | serious | That’s the iliac artery. Let me take the scissors for a moment and show you. |
| `r_toldt-s2` | urgent | Wait. Stop. That’s the iliac artery. We never cut there, ever. |
| `r_toldt-z3` |  | That’s the cecum itself. A little more lateral, on the white line. But yes, the direction is right. |
| `r_toldt-ms` | calm | Not there. Look for the white line where the cecum is stuck to the side wall. |
| `r_retro` |  | The cecum is moving. The tip is still stuck high up. Where do we carry on from? |
| `r_retro-o0` | warm | Very nice. Now the tip will just come along with you. |
| `r_retro-o1` | serious | You’re too deep. I don’t like this. |
| `r_deep` |  | The tip is free. You were lucky. Next time, from the base. |
| `c_ureter` |  | Wait. Stop. What’s that tube that’s contracting? I think we’ve touched the ureter. |
| `c_ureter-o0` | warm | Right. Urology found a partial injury, repaired it and placed a stent. We caught it in time, and that makes all the difference. |
| `c_ureter-o1` | serious | Wait. Stop. A clip on the ureter? That turns a small injury into a disaster. I’m calling urology. |
| `c_tear` |  | Well. The appendix has torn and a fecalith has come out. That’s all right. Take a breath. What now? |
| `c_tear-o0` | warm | Good. That’s what matters. A stone that stays behind comes back. |
| `c_tear-o1` | serious | Washing doesn’t find stones. All right, let’s carry on. |
| `e_meso` |  | We suspect a neoplasm. How do we divide the mesentery? |
| `e_meso-o0` | warm | Exactly. And not a single instrument has touched the cyst. |
| `e_meso-o1` |  | In appendicitis, yes. Here we suspect a tumor, so we take all of it. Let me show you. |
| `e_meso-o2` | serious | Wait. Stop. You touched the cyst. Look. There’s a little mucin. That’s exactly what we didn’t want. |
| `meso_gear` |  | The appendix is up and the mesentery is spread out. What do you ask the scrub nurse for? |
| `meso_gear-ok` | warm | Good. A Maryland with diathermy, in small bites. It’s the cheapest, and it works as well as anything else. |
| `meso_gear-bad` | serious | Not with that. For the mesentery you need energy: a Maryland, a hook or an energy device. |
| `meso_gear-alt` |  | That’s good too. WSES says there’s no difference in outcomes, only in cost. Go ahead. |
| `meso_tap` |  | Where do you start with the energy? Tap the spot. |
| `meso_tap-z0` |  | Good. Right against the appendix, in small bites. That way the artery doesn’t get away from you. |
| `meso_tap-z1` |  | Right on the artery? You can, but seal it well and don’t rush. One bite too many and it bleeds. |
| `meso_tap-z2` | serious | I told you. Heat on the cecum means a late perforation. Let’s move to the right line. |
| `meso_tap-s2` | urgent | Wait. Stop. That’s right up against the cecum. Heat there means a hole on day five. |
| `meso_tap-z3` | serious | That’s the small bowel. I’ll move it out of the way. Only burn what you can see. |
| `meso_tap-s3` | urgent | Wait. Stop. That’s the small bowel. A hot hook next to bowel is not something to play with. |
| `meso_tap-z4` | serious | That’s the ureter. With the appendix lifted, the ureter is far away. There’s no reason to be there. |
| `meso_tap-s4` | urgent | Wait. Stop. That’s the ureter. We’re a long way from it here. Stay up high. |
| `meso_tap-ms` | calm | Not there. Look for the fatty triangle between the appendix and the artery. |
| `meso_done` |  | The mesentery is divided and the artery is sealed. Nice. Now the base. |
| `c_bleed` |  | Wait. Stop. The artery has slipped and it’s bleeding. The pelvis is filling up. What’s the first thing you do? |
| `c_bleed-o0` | warm | Good. Breathe. Hold it firmly, suction. Now show me where it’s coming from. |
| `c_bleed-o1` | serious | Wait. Stop. You can’t see what you’re closing. Grasp and suction first. |
| `c_bleed-o2` | serious | No. Diathermy into a pool of blood doesn’t stop an artery. Grasp first. |
| `c_bleed_tap` |  | We’ve cleared it. Show me exactly where you’re closing. |
| `c_bleed_tap-z0` |  | Exactly. One clip, and another. Dry. See? Two minutes and it’s quiet. |
| `c_bleed_tap-z1` |  | Close. The end of the artery is a little higher. There, now. Dry. |
| `c_bleed_tap-z2` | serious | That’s the ureter. I’m taking the clip. The artery is up here. |
| `c_bleed_tap-s2` | urgent | Wait. Stop. That’s the ureter, not the artery. Don’t close there. |
| `c_bleed_tap-z3` | serious | The iliac artery. Don’t go near it. Here’s the source. Clip here. |
| `c_bleed_tap-s3` | urgent | Wait. Stop. That’s the iliac artery. Our bleeder is far smaller than that. |
| `c_bleed_tap-ms` | calm | Not there. Follow the jet back to its source. |
| `c_bleed_roll` |  | Dry. Irrigate a little and look again. Okay. On to the base. |
| `c_bleed_more` |  | It’s bleeding again, and the blood pressure is dropping. I don’t like this. What do we do? |
| `c_bleed_more-o0` | warm | Right. We made a small incision and tied it under direct vision. Dry. A good decision, for the right reason. |
| `c_bleed_more-o1` | serious | Hold on. The pressure is eighty. We’re opening now. Always make the call before anesthesia makes it for you. |
| `stump_ok` |  | The base is clean and healthy. What do we close it with? |
| `stump_ok-o0` | warm | Good. Classic, cheap and safe. |
| `stump_ok-o1` | warm | Excellent. Faster, and just as safe as loops. |
| `stump_ok-o2` | warm | For a cyst with a wide base, yes. A stapler, with healthy margins. |
| `stump_ok-o3` |  | You can, but on a healthy base it has no advantage and it costs several times as much. We’ll do it. |
| `stump_ok-o4` | serious | That’s from the old textbooks. The same complications, more time and more ileus. A simple loop. |
| `stump_nec` |  | Look at the base. It’s black, and perforated on one side. What do we close it with? |
| `stump_nec-o0` | warm | Exactly. We close on healthy tissue, not on gangrene. |
| `stump_nec-o1` | serious | Hold on. A loop on gangrene is like tying a thread around wet paper. Are you sure? All right, it’s done. |
| `stump_nec-o2` | serious | A clip on dead tissue cuts straight through it. It’ll leak. But fine, we’ll see. |
| `stump_tap` |  | Show me exactly where the closure goes. |
| `stump_tap-z0` |  | Exactly. Flush with the cecum, a stump of half a centimeter. That way there’s no stump appendicitis. |
| `stump_tap-z1` | serious | Too high. That leaves a two centimeter stump. And in a few years, well, that’s what you chose. |
| `stump_tap-z2` | serious | That’s the ileocecal junction. I’m moving you to the base. |
| `stump_tap-s2` | urgent | Wait. Stop. That’s the junction between the small and large bowel. Narrow it and we have an obstruction. |
| `stump_tap-z3` |  | A little deep into the cecum. With a stapler that’s fine if you have a margin. Just don’t narrow it. |
| `stump_tap-ms` | calm | Not there. Where the taeniae meet, remember? |
| `stump_cut` |  | Divide it. Look at the stump: closed, and no bleeding. Nice. |
| `extract` |  | The appendix is free. How do we get it out? |
| `extract-o0` | warm | Good. Clean. Nothing touched the wall. |
| `extract-o1` |  | Some people accept that for a simple one. With an inflamed one I don’t like it. It smears all over the wall. |
| `extract-o2` | serious | Hold on. Through a five? It’s torn in the port, and half of it is still inside. We’ll get the rest out in a bag. |
| `e_extract` |  | The cystic appendix is free. How does it come out? |
| `e_extract-o0` | warm | Exactly. We extended it by a centimeter. Intact, no rupture. That’s the whole game here. |
| `e_extract-o1` | serious | Wait. Stop. No. But it’s already happened. There’s mucin in the field. |
| `e_extract-o2` | serious | Hold on. It’s ruptured in the port. That’s exactly what we were trying to prevent. |
| `c_pmp` |  | There’s mucin in the field. What do we do now? |
| `c_pmp-o0` | warm | Right. We don’t try to be heroes. The center will know what to do. |
| `c_pmp-o1` | serious | No. That’s an operation for a specialist center, not for three in the morning. We document and come out. |
| `wash` |  | There’s pus in the pelvis and the right gutter. What do we do about it? |
| `wash-o0` | warm | Good. Don’t forget under the liver. Something always stays there. Clean. |
| `wash-o1` |  | It doesn’t do much harm, but it doesn’t help either. In the trial in children there was no difference. Just make sure you suck it all out afterwards. |
| `wash-o2` | serious | Hold on. The body won’t absorb pus. It’ll build an abscess out of it. Suction. |
| `drain` |  | Do we leave a drain? |
| `drain-o0` | warm | Right. A drain doesn’t prevent an abscess. It just makes the stay longer. |
| `drain-o1` | serious | To be safe for whom? In complicated appendicitis in adults we don’t place one. All right, we’ll take it out tomorrow. |
| `drain-o2` |  | The drain won’t hold the stump. But if it leaks, at least we’ll know early. We’ll put one in. |
| `close` |  | Before we close. What do you do? Tick them. |
| `close-ok` | warm | Good. A dry stump, a clean pelvis, ports out under vision. We close. |
| `close-m0` | serious | A last look at the stump. Two seconds that save a reoperation. |
| `close-m1` | serious | The fecalith. Even if you didn’t see one, look. |
| `close-m2` | serious | The ports come out under vision. That’s how you catch bleeding from the wall. |
| `close-m3` | serious | The fascia at the umbilicus. Otherwise he’s back in a year with a hernia. |
| `close-m4` | serious | A five millimeter port doesn’t need fascial closure. That’s convention. |
| `n_count` |  | Before we close the skin. What do you check? |
| `n_count-ok` | warm | Excellent. The count is correct and the specimen is labeled. |
| `n_count-m0` | serious | The count. Nobody leaves the room without it. |
| `n_count-m1` | serious | The specimen. An appendix that never reaches pathology is an appendix nobody examined. |
| `n_count-m2` | serious | The culture. Don’t let it get forgotten on the table. |
| `n_count-m3` | serious | Record what’s been left in the abdomen. Clips and loops. |
| `sen_teach` |  | As the teacher: where did you let them work on their own, and where did you take over? Think about it before you talk it through with them. |
| `path` |  | The specimen is on the table. Do we send it to pathology? |
| `path-o0` | warm | Right. Every appendix goes to pathology, without exception. |
| `path-o1` | serious | Hold on. An eight millimeter tumor can’t be seen by eye. We send it. This time I’ll send it for you. |
| `abx` |  | On the ward. Antibiotics after the operation: yes or no, and for how long? |
| `abx-o0` | warm | Right. In simple appendicitis the dose before the operation is enough. |
| `abx-o1` | serious | Hold on. That was complicated. A short course, but a course. |
| `abx-o2` | warm | Exactly. In APPIC, two days were no worse than five. We start and reassess. |
| `abx-o3` |  | In simple appendicitis? There’s no need. Only side effects. We stop. |
| `abx-o4` | serious | Ten days? In STOP-IT, four days were as good as eight. We shorten it. |
| `course` |  | The morning after. He’s eating and walking, with mild pain and no fever. What do we do? |
| `course-o0` | warm | Good. Home. And tell him when to come back. |
| `course-o1` |  | What for? He’s well. An unnecessary admission is a risk too. |
| `c_stump` |  | Day three. Sudden pain, a fever of thirty-nine, and the abdomen is rigid everywhere. The CT shows air and fluid next to the cecum. What do we do? |
| `c_stump-o0` | warm | Right. With an abdomen like that we don’t wait for radiology. To the OR. |
| `c_stump-o1` |  | If it were a contained collection, yes. With an abdomen like this? We tried, and he got worse. To the OR. |
| `c_stump-o2` | serious | Hold on. Wait for what? By the morning he’s septic. We go up now. |
| `c_stump_or` |  | There. The stump is open. Suction, then a stapler across healthy cecum. Next time, a gangrenous base gets a stapler the first time round. |
| `c_iaa` |  | Day five. Fever of thirty-eight point six, and the CRP is rising. The CT shows a five centimeter collection in the pelvis. What do we do? |
| `c_iaa-o0` | warm | Good. Five centimeters, so we drain it. Radiology is already on the way. |
| `c_iaa-o1` | serious | Hold on. For one contained collection? Radiology drains that in ten minutes. |
| `c_iaa-o2` | serious | With a five centimeter collection and a fever? He’ll be back in two days. We drain it. |
| `c_iaa_abx` |  | The drain worked and the fever is down. How long do we continue the antibiotics? |
| `c_iaa_abx-o0` | warm | Exactly. STOP-IT: four days after source control, as good as eight. |
| `c_iaa_abx-o1` | serious | The CRP doesn’t have to be zero. After drainage, a short course. |
| `c_iaa_q` |  | And looking back, think: did you suction the whole pelvis? Did you get the stone out? An abscess starts in the OR. |
| `c_ssi` |  | Day six, in clinic. The umbilicus is red, warm and discharging. What do we do? |
| `c_ssi-o0` | warm | Right. A little pus came out, and that’s it. He’ll feel better tomorrow. |
| `c_ssi-o1` |  | Antibiotics don’t drain pus. We take out a couple of stitches. |
| `c_ssi-o2` | serious | Hold on. Red, warm and discharging isn’t normal. We open it now. |
| `c_ent` |  | Day two. Heart rate one twenty, pain out of proportion, and a distended abdomen. Something’s wrong. What do we do? |
| `c_ent-o0` | warm | Right. The CT shows free air and fluid. We go up. |
| `c_ent-o1` | serious | Hold on. A heart rate of one twenty isn’t fixed with painkillers. By tonight he’s septic and we’re in the OR. |
| `c_ent_or` |  | A hole in the small bowel, exactly where there was heat or a grasper. We sutured it and washed out. He’ll be fine, but it cost him a week. |
| `path_res` |  | The pathology result is back. It matches what we saw, no surprises. |
| `path_lost` |  | We sent it in the end, but only because I insisted. Remember that your note said not sent. |
| `path_res2` |  | The result: acute appendicitis, and nothing else. |
| `c_net_s` |  | Pathology: an eight millimeter neuroendocrine tumor at the tip, clear margins, no invasion. What do we do? |
| `c_net_s-o0` | warm | Right. He’s cured. Explaining that to the patient matters just as much. |
| `c_net_s-o1` | serious | Hold on. For eight millimeters at the tip with clear margins? That’s a big operation with no benefit. |
| `c_net_m` |  | Pathology: a one point five centimeter neuroendocrine tumor, close to the base. What do we do? |
| `c_net_m-o0` | warm | Good. This is exactly the kind of case the meeting is for. |
| `c_net_m-o1` |  | You can defend that with EAES. But the meeting and the risk factors come first. |
| `c_net_m-o2` | serious | Hold on. One point five, close to the base, isn’t just removed and done. A meeting, at the very least. |
| `c_net_l` |  | Pathology: a two point four centimeter neuroendocrine tumor. What do we do? |
| `c_net_l-o0` | warm | Right. Over two centimeters, it’s no longer up for discussion. |
| `c_net_l-o1` | serious | Hold on. Over two centimeters? A right hemicolectomy. |
| `c_lamn` |  | Pathology: LAMN, a low-grade appendiceal mucinous neoplasm, with no rupture and clear margins. What next? |
| `c_lamn-o0` | warm | Exactly. And you took it out intact, so her outlook is excellent. |
| `c_lamn-o1` | serious | Hold on. That term doesn’t exist anymore, and the follow-up very much does. We refer her. |
| `c_lamn-o2` | serious | There’s no need. It came out intact, with clear margins. We refer her and follow up. |
| `c_pmp_res` |  | Pathology: LAMN, with a rupture and mucin on the surface. She’s being referred to the center. Because of the rupture, her follow-up will be closer. |
| `late` |  | Six weeks later, in clinic. The wounds look good and he’s back at work. That’s how it’s meant to end. |
| `c_stumpapp` |  | Two years later. He’s in the ER with right lower quadrant pain and a fever, and he says: but they took my appendix out. What do you think? |
| `c_stumpapp-o0` | warm | Right. The CT shows a two centimeter stump with a stone in it. That’s the stump we left back then. |
| `c_stumpapp-o1` | serious | Hold on. That’s exactly what everyone thinks, and that’s why they arrive perforated. A long stump, remember? |
| `c_fec` |  | Three months later. A second abscess in the pelvis, and the CT shows a calcification inside the collection. What is it, and what do we do? |
| `c_fec-o0` | warm | Right. We drained it, and this time it’s quiet. But this story started in the OR. |
| `c_fec-o1` | serious | Antibiotics won’t dissolve a stone. We drain it, and if it comes back, we take it out. |
| `c_hernia` |  | A year later. A bulge at the umbilicus. A port-site hernia. Someone didn’t close the fascia. A small repair, but an unnecessary one. |
