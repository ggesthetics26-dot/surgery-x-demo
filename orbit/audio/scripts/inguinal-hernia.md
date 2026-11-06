# James · live case: inguinal-hernia

Voice: James (ElevenLabs, Eleven v3). Calm, warm attending in the OR, talking to a resident next to him. Natural pace, short pauses at full stops. The tag in brackets is the delivery for that line.

372 lines · about 5212 words · about 35 minutes of audio.
Record: from Surgery X, `python3 tools/live-voice.py orbit/data/live/tapp.js`

| key | tone | line |
|---|---|---|
| `hello` | warm | Hi, I’m James. We have an inguinal hernia today. Pick a case, and we’ll go and see the patient before the OR. |
| `gen-unclear` | casual | Sorry, I’m not sure I followed. Did you mean one of these? |
| `gen-again` | casual | Say it another way, or pick one of the options. |
| `gen-miss` | calm | Not there. Look again and pick a spot. |
| `hall_prim` |  | Morning. This is Daniel, he’s fifty-two. A bulge on the right that aches by the end of a working day and goes back in on its own. Do we operate, or wait? |
| `hall_prim-o0` | warm | Right. Symptomatic hernias get repaired. And it’s what he wants, too. |
| `hall_prim-o1` |  | He has pain, so we operate. Waiting is for a man with almost no symptoms. |
| `hall_prim-o2` |  | Operate, yes. But the risk of incarceration is low. There’s no need to frighten him. |
| `ww_q` |  | Exam question. If he had no symptoms at all, what would you tell him? |
| `ww_q-o0` | warm | Exactly. Incarceration is rare, but about two thirds have surgery in the end. That’s informed consent. |
| `ww_q-o1` | serious | Waiting is fine. But if you didn’t tell him most end up having surgery, he didn’t really choose. |
| `ww_q-o2` |  | Plenty of people think that. But in the randomized trial, waiting was safe for a man with almost no symptoms. |
| `appr_prim` |  | Right. How do we repair it? |
| `appr_prim-o0` | warm | That’s the plan. Less pain and a quicker return to work, with someone experienced in the room. |
| `appr_prim-o1` | warm | An excellent, well-proven choice, especially under local. Today he’s fit for general, so TAPP. |
| `appr_prim-o2` |  | We have a robot, but for a simple hernia it showed no benefit. More time and more money. Laparoscopy. |
| `appr_prim-o3` | serious | I like the confidence. But early on, recurrences double. Roughly a hundred cases with someone next to you. |
| `hall_bilat` |  | This is Mark, he’s sixty-three. A left hernia that bothers him. Enlarged prostate, gets up at night to pass urine. What’s the plan? |
| `hall_bilat-o0` | warm | Exactly. In TAPP you see both sides for free. Sometimes there’s a surprise. |
| `hall_bilat-o1` |  | Legitimate. But if there’s one on the right too, we won’t know until he comes back with a bulge. |
| `hall_bilat-o2` |  | Equivalent to TAPP. I just like seeing the whole abdomen when there’s doubt about the other side. |
| `hall_recur` |  | This is Tom, he’s sixty-seven. A recurrent hernia on the right. He had a Lichtenstein six years ago. Which way do we go in this time? |
| `hall_recur-o0` | warm | Right. After anterior, go posterior. The old mesh stays in front and doesn’t bother us. |
| `hall_recur-o1` | serious | Back into the scar and the old mesh? That’s where the nerves are stuck in scar. From behind, it’s all clean. |
| `hall_recur-o2` | warm | Also posterior, yes. I prefer TAPP when there are scars. You see everything from inside the abdomen. |
| `hall_m3` |  | This is Peter, he’s seventy-one. A huge direct hernia that goes down into the scrotum. What’s already worrying you? |
| `hall_m3-o0` | warm | Good. A wide defect needs a big mesh and fixation. And tell him in advance there’ll be fluid there. |
| `hall_m3-o1` | serious | Not quite. A huge direct defect behaves differently. A light mesh that isn’t fixed falls into it. |
| `hall_m3-o2` |  | Good thought, especially if anesthesia is a problem. He’s fit, so TAPP under general. |
| `hall_fem` |  | The emergency department called us. This is Susan, she’s fifty-eight. A painful lump below the inguinal ligament that won’t go back. She’s been vomiting since this morning. What do you think? |
| `hall_fem-o0` | warm | Exactly. In a woman, always think femoral. It incarcerates and strangulates more than any other hernia. |
| `hall_fem-o1` | serious | Force back bowel that may already be in trouble? Then we won’t know what we pushed back. She’s going to the OR. |
| `hall_fem-o2` |  | If you’re in doubt, a CT is fine. But don’t delay. Vomiting and a hard lump are already an answer. |
| `fem_appr` |  | Laparoscopic or open? |
| `fem_appr-o0` | warm | Good. We’ll see the bowel from inside, and open if we need to. |
| `fem_appr-o1` |  | Perfectly legitimate, especially if she’s unstable. She’s stable and we have the experience, so camera. |
| `fem_appr-o2` | serious | I understand, I’m tired too. But her bowel won’t wait for us. |
| `preop` |  | Just before he goes to sleep. What have we already done? |
| `preop-ok` | warm | Good. Empty bladder, side marked, arms tucked. We can start. |
| `preop-m0` | serious | He didn’t pass urine? A full bladder rises into our field. Toilet first. |
| `preop-m1` | serious | Arms at his sides. Otherwise I’m standing crooked for the whole case. |
| `preop-m2` | serious | The side isn’t marked? We don’t start. An arrow on the skin, and he confirms it. |
| `preop-m4` | serious | Routine antibiotics for a laparoscopic repair? The guideline doesn’t recommend it. Not needed. |
| `anaes` |  | Anesthesia? |
| `anaes-o0` | warm | General. TAPP needs a relaxed abdomen and gas. And from sixty-five the guideline prefers general. |
| `anaes-o1` |  | There are series like that. But in one, a third had trouble passing urine. And gas in the belly while he’s awake is no fun. |
| `anaes-o2` | serious | Local is for Lichtenstein. With gas in his belly he’ll jump off the table. |
| `cath` |  | Sixty-three, a big prostate, and we may repair both sides. Catheter? |
| `cath-o0` | warm | Reasonable for him. He’s at risk of retention, and the bladder stays empty the whole case. |
| `cath-o1` |  | You can. Just remember that age and prostate raise the risk. We’ll check him afterwards. |
| `cath-o2` | serious | Three days? What for. It’s day surgery. Catheter in the OR, and out at the end. |
| `preop_fem` |  | She’s on her way to the OR. What do we need before she goes to sleep? |
| `preop_fem-ok` | warm | Good. Fluids, catheter and labs. She’s ready. |
| `preop_fem-m0` | serious | Without labs we’re blind. Blood count, chemistry and lactate. |
| `preop_fem-m1` | serious | She’s been vomiting since this morning. Fluids before induction. |
| `preop_fem-m2` | serious | An urgent case, and the bladder is in the pelvis. Catheter. |
| `preop_fem-m4` | serious | She’s vomiting. We don’t wait for fasting. Nasogastric tube, and in we go. |
| `n_entry` |  | We’re setting up the table. What do I ask for first, for the open entry at the umbilicus? |
| `n_entry-ok` | warm | A twelve millimeter blunt-tip port for open entry. Then the scope. |
| `n_entry-bad` | serious | No, it’s an open entry. A blunt twelve millimeter port. We’ll save the needle for another abdomen. |
| `n_entry-alt` |  | The scope comes right after. Port first. |
| `entry_std` |  | We go in at the umbilicus. How? |
| `entry_std-o0` | warm | That’s how I like it. Slowly, see the peritoneum and go in. No surprises. |
| `entry_std-o1` |  | Also accepted, lots of people do it. Just check the pressure before you push a port in. |
| `entry_std-o2` |  | You can, if you do it every day. You’re not there yet. |
| `entry_scar` |  | Hold on. He has a lower midline scar from an old operation. How do we get in? |
| `entry_scar-o0` | warm | Good. Open, slowly, and a finger around before the port. |
| `entry_scar-o1` | warm | Nice. Away from the scar. Then the camera, and we see where the adhesions are. |
| `entry_scar-o2` | serious | Okay. With a midline scar the bowel can be stuck right underneath. Let’s hope. |
| `c_bowel_entry` |  | Hold on. What’s that green on the screen? That’s bowel. We’re in the bowel. |
| `c_bowel_entry-o0` | warm | Right. Leave it in so we don’t lose it, add another port and repair it. And the mesh? We think again. |
| `c_bowel_entry-o1` | serious | Then the hole disappears and we don’t know where it is. That’s how you get peritonitis on day two. |
| `bowel_mesh` |  | We’ve repaired it. Now, a synthetic mesh after we’ve opened bowel? |
| `bowel_mesh-o0` | warm | That’s what I would do. A planned hernia can be repaired in a few weeks, in a clean field. |
| `bowel_mesh-o1` |  | Some carry on after a small injury. It’s an attending’s call. I like it less. |
| `ports` |  | Place the ports. Camera at the umbilicus first, then two working ports. |
| `ports-g` | warm | Good. Three in one line, camera in the middle. Comfortable for both sides. |
| `ports-o` |  | It works, a bit crowded. We’ll manage. |
| `ports-b` | serious | The instruments will clash. We’ll be fighting with our hands the whole case. |
| `ports-d0` | urgent | Hold on. Stop. A port above the pubis? That’s the bladder. And from there you can’t reach anything. |
| `ports-d1` | urgent | Stop. The epigastric vessels run inside the muscle there. Move a little to the side. |
| `ports-d2` | urgent | Stop. The epigastric vessels run inside the muscle there. Move a little to the side. |
| `stu_cam` |  | You’re on the camera. It’s a thirty-degree scope: turn the light cable to look down towards the groin. |
| `tri` |  | A small reminder: the two instruments meet at the target at an angle, with the camera between them. That way you work without fighting. |
| `survey` |  | We’re in. Before you rush to the hernia, what do we do? |
| `survey-o0` | warm | Always. In TAPP it’s free. That’s how you find what you weren’t looking for. |
| `survey-o1` | serious | There’s time for one minute. But fine, I can see you’re in a hurry. |
| `bil_skip` |  | Okay, straight to the left. On the screen it’s the same thing, just mirrored. |
| `bil_found` |  | Hold on. Look to the right. See the opening at the ring? There’s a hernia on the right too. What do we do? |
| `bil_found-o0` | warm | Exactly. That’s why we consented him for the other side too. We’ll start on the right, here on the screen, then the left. |
| `bil_found-o1` |  | You can. But he’ll be back with a bulge on the right. We’ll work on the left, it’s the same thing mirrored. |
| `bil_found-o2` | serious | He only signed for the left? Then no. From now on the form says: possibly the other side too. We’ll work on the left. |
| `adh` |  | There’s omentum stuck to the wall under the scar. It’s hiding the groin. What do we do? |
| `adh-o0` | warm | Nice. Sharp, no energy near bowel. The omentum comes down and the field is clear. |
| `adh-o1` | serious | Energy near bowel is a burn that shows up on day three. Let’s switch to scissors. |
| `adh-o2` |  | You can, but we’ll work the whole case with half a field. |
| `c_bowel_burn` |  | Hold on. See the white spot on the bowel? That’s a burn. What do we do? |
| `c_bowel_burn-o0` | warm | Right. A burn you don’t cover can perforate two days later. Stitch it, and write it in the note. |
| `c_bowel_burn-o1` | serious | Small today, a perforation the day after tomorrow. I don’t like it. |
| `recur_look` |  | Look. The old mesh is in front, and back here everything is virgin. A direct defect, medial to the vessels. |
| `fem_look` |  | There. A loop of small bowel stuck in the femoral ring, below the iliopubic tract. Now what? |
| `fem_look-o0` | warm | Nice. We don’t pull hard on sick bowel. Let’s see if it comes, and if not, we widen. |
| `fem_look-o1` | serious | Wait. Gently. This bowel is already suffering. It tears like wet paper. |
| `fem_ring` |  | It won’t come. Where do you widen the ring? |
| `fem_ring-z0` |  | Right. Medially, towards the lacunar ligament. Nothing there bleeds. |
| `fem_ring-z1` |  | Above is the tract. You can cut a little, but medial is safer. |
| `fem_ring-z2` | serious | You cut laterally. That’s dark blood, and fast. |
| `fem_ring-s2` | urgent | Stop. Lateral is the femoral vein. We don’t cut there. |
| `fem_ring-ms` | calm | Not there. Look at the ring below the tract, and pick a side. |
| `c_bowel_fem` |  | The bowel’s torn. There’s content in the field. Breathe. Now what? |
| `c_bowel_fem-o0` | warm | Good. Control the contamination first. Then we decide about resection and mesh. |
| `c_bowel_fem-o1` | serious | At the end? Bowel content spreads over the whole field with every minute. We close it now. |
| `fem_viab` |  | It’s out. The loop is dark. Viable or not? |
| `fem_viab-o0` | warm | Good. Patience. A lot of dark bowel recovers when you give it time. |
| `fem_viab-o1` | serious | Without looking? If it’s dead, we’ll find out from the peritonitis. |
| `fem_viab-o2` |  | Maybe too early. An unnecessary resection is a complication too. But let’s see. |
| `fem_alive` |  | See? The color is coming back, there’s peristalsis and a pulse. The bowel is viable. Now we repair the hernia as usual. |
| `fem_dead` |  | It’s not coming back. Grey, no peristalsis. Now what? |
| `fem_dead-o0` | warm | Right. In women in an emergency it isn’t rare. Now the big question: mesh. |
| `fem_dead-o1` | serious | No. Dead bowel in the abdomen is peritonitis. We resect. |
| `fem_mesh` |  | We’ve opened bowel. A synthetic mesh in a field like this? |
| `fem_mesh-o0` | warm | I would close the ring with sutures today. Mesh can come later, in a clean field. |
| `fem_mesh-o1` |  | Some do it with mild contamination. I’d be careful. It’s an attending’s call. |
| `fem_suture` |  | We close the femoral ring to Cooper’s ligament with a few stitches. No mesh today. |
| `lm_intro` |  | Before we cut. What are you looking for in the picture? |
| `lm_intro-o0` | warm | Good. Let’s see that you really see them. |
| `lm_intro-o1` | serious | Wait. Stop. Map first, then the knife. Show me a few things. |
| `lm_iev` |  | Show me the inferior epigastric vessels. |
| `lm_iev-ok` | warm | Right. That’s the border: lateral is indirect, medial is direct. |
| `lm_iev-bad` | serious | No. Look for vessels running up from the pelvis to the rectus muscle, under the peritoneum. |
| `lm_vas` |  | And now the vas deferens. |
| `lm_vas-ok` | warm | Nice. It runs medially, down into the pelvis. Don’t grab it with a grasper, just move it. |
| `lm_vas-bad` | serious | That’s not it. The vas is white and thin, running down from the ring, medially towards the pelvis. |
| `lm_gon` |  | And the testicular vessels? |
| `lm_gon-ok` | warm | Yes. They come from above and from the side. And between the vas and these vessels there’s something you mustn’t touch. |
| `lm_gon-bad` | serious | No. The testicular vessels come from the side and from above. If you mix them up with the vas, stop and identify again. |
| `lm_medul` |  | And our medial border? |
| `lm_medul-ok` | warm | The medial umbilical ligament. Cut beyond it? Bladder. |
| `lm_medul-bad` | serious | No. Look for the white fold coming down from the umbilicus. That’s the medial umbilical ligament. |
| `lm_ring` |  | And finally, where’s the hernia? |
| `lm_ring-ok` | warm | Good. Now you know where you are. |
| `lm_ring-bad` | serious | Look at the defect again. Is it lateral to the vessels, or medial? |
| `stu_dir` |  | A question for you. How do you tell indirect, direct and femoral apart in the picture? |
| `stu_dir-o0` | warm | Precise. And now you can read the European classification. |
| `stu_dir-o1` | serious | Size is the number in the classification. The type depends on where it is relative to the vessels. |
| `stu_dir-o2` | serious | The other way round. Indirect comes out through the ring, lateral to the vessels. Direct pushes out the floor, medial to them. |
| `incise_gear` |  | We’re opening the peritoneum. What do you ask for? |
| `incise_gear-ok` | warm | Scissors. And only use energy when you can see the tip. |
| `incise_gear-bad` | serious | You don’t open peritoneum with that. Scissors, or the hook. |
| `incise_gear-alt` |  | That works too. Just don’t burn deep, there are vessels underneath. |
| `incise` |  | Where do we open? Show me where the incision goes. |
| `incise-z0` |  | Nice. High, from the iliac spine to the medial ligament. A wide pocket, easy to close at the end. |
| `incise-z1` |  | Nice. High above the ring, across to the medial ligament. A wide pocket, easy to close at the end. |
| `incise-z2` |  | Too close. The pocket will be narrow and it’ll tear. We’ll widen to the sides. |
| `incise-z3` | serious | You cut on them. See the blood? |
| `incise-s3` | urgent | Wait. Stop. The epigastric vessels run under this point. Go higher. |
| `incise-z4` | serious | Okay, medial. Let’s see what’s there. |
| `incise-s4` | urgent | Wait. Stop. That’s beyond the medial ligament. The bladder sits there. |
| `incise-ms` | calm | Not there. Look for a line above the ring, from the side across to the medial ligament. |
| `flap_open` |  | The peritoneum is open. We go into the loose layer. How do you know you’re in the right plane? |
| `flap_open-o0` | warm | Exactly. Cobwebs, and quiet. If there’s blood or muscle, you’re not in the plane. |
| `flap_open-o1` |  | Too deep. The nerves run under the fat on top of the muscle. Stay above it. |
| `flap_open-o2` | serious | It matters a lot. In the right plane it hardly bleeds. Outside it, everything gets complicated. |
| `retz` |  | Now medially, the space of Retzius. How far do we dissect? |
| `retz-o0` | warm | Nice. All the way to the bone. If you don’t see Cooper’s, the mesh won’t cover the femoral. |
| `retz-o1` | serious | Enough for today’s hernia. Not for tomorrow’s. The femoral stays open. |
| `retz-o2` | serious | Nothing there? In half of people a vessel runs there. Let’s see if you’re lucky. |
| `corona_see` |  | Hold on. See the vessel running over Cooper’s? What is it? |
| `corona_see-o0` | warm | Exactly. The crown of death. If it’s cut without control, it retracts into the pelvis. |
| `corona_see-o1` | serious | Small? If it’s cut, it retracts into the obturator canal, and then you’re searching for it in the dark. |
| `corona_see-o2` |  | Corona mortis. It’s there in about half of people. From today, you look for it every time. |
| `m3_pseudo` |  | See the white sac in the direct defect? That’s not peritoneum, it’s a pseudosac. What do we do with it? |
| `m3_pseudo-o0` | warm | Nice. Less dead space, less seroma. A good convention, even without a trial behind it. |
| `m3_pseudo-o1` |  | The mesh will cover it, yes. But a big space is left behind and fills with fluid. He’ll think it came back. |
| `m3_pseudo-o2` | serious | Too deep. It bleeds down there, and you touch the cord. No need. |
| `recur_scar` |  | The direct sac is stuck to the old floor. How do we separate it? |
| `recur_scar-o0` | warm | Exactly. We don’t touch the old mesh. Cover wide, and recurrence almost disappears. |
| `recur_scar-o1` | serious | No. It’s on the other side of the wall and doesn’t bother us. Taking it out only adds blood and injured nerves. |
| `recur_scar-o2` | serious | After an anterior repair you need to cover the whole floor. One hole covered is another recurrence. |
| `b_corona` |  | Bleeding. Near Cooper’s. Breathe. What’s the first thing? |
| `b_corona-o0` | warm | Right. Pressure. Now nobody panics. Suction and clips ready. |
| `b_corona-o1` | serious | Not blind. Now it’s retracted into the pelvis. Pressure, quickly. |
| `b_corona-o2` | serious | Energy on a vessel like that just spreads the blood. Pressure first. |
| `b_cor_gear` |  | What do you ask for now? |
| `b_cor_gear-ok` | warm | Suction. Clean gently and see where it’s coming from. |
| `b_cor_gear-bad` | serious | No. Suction first. If you can’t see, you do nothing. |
| `b_cor_gear-alt` |  | A clip, yes, but suction first, and see the ends. |
| `b_cor_clip` |  | We can see both ends. How do we close? |
| `b_cor_clip-o0` | warm | Nice. Quiet. Check again at low insufflation pressure. |
| `b_cor_clip-o1` |  | It stopped, but the other side can bleed again when the pressure drops. Another clip. |
| `b_cor_deep` |  | It’s retracted towards the obturator canal. The heart rate is going up. Now what? |
| `b_cor_deep-o0` | warm | Right. Five minutes of real pressure. I’m here. Most of the time it settles. |
| `b_cor_deep-o1` | serious | You could catch the iliac vein. Hands up, and pressure. |
| `b_epi` |  | Bleeding from the epigastrics. Steady. What do we do? |
| `b_epi-o0` | warm | Good. That’s it. Clip above, clip below. Done. |
| `b_epi-o1` |  | It stopped, this time. But without seeing the end it can come back as a hematoma under the mesh. |
| `b_iliac` |  | Stop. Don’t move. That’s the iliac vein. Pressure, now. |
| `b_iliac-o0` | warm | Right. You press, and I talk. This is the one situation where we don’t argue. |
| `b_iliac-o1` | serious | No. Hands up. Pressure only. Now his heart rate is a hundred and thirty. |
| `b_iliac-o2` | serious | Then it bleeds freely. Put the pressure back, right now. |
| `b_iliac2` |  | The vascular surgeon opened and repaired the vein. Everything’s under control. We breathe, and we carry on. |
| `c_blad` |  | Hold on. Clear fluid in the field, and the catheter bag is filling with gas. We’re in the bladder. |
| `c_blad-o0` | warm | Right. Recognize it in time, repair it and leave a catheter. That way it ends without drama. |
| `c_blad-o1` | serious | Irrigation doesn’t fill the bag with gas. I don’t like this at all. |
| `bog` |  | And laterally. The space of Bogros. How far, and how? |
| `bog-o0` | warm | Good. The nerves are asleep under that fat. Let them sleep. |
| `bog-o1` | serious | Nice for a photo, bad for the nerves. The nerves to the thigh run under that fat. |
| `bog-o2` | serious | Too short. The mesh will fold at the side and lift. That’s how recurrences start. |
| `lm_doom` |  | A quick check. Show me the triangle of doom. |
| `lm_doom-ok` | warm | Right. Between the vas and the testicular vessels. Underneath are the external iliac artery and vein. No energy and no tacks there. |
| `lm_doom-bad` | serious | No. Look for the triangle between the vas and the testicular vessels. The apex is at the ring. |
| `lm_pain` |  | And the triangle of pain? |
| `lm_pain-ok` | warm | Good. Lateral to the testicular vessels and below the tract. That’s where the nerves to the thigh are. |
| `lm_pain-bad` | serious | No. Lateral to the testicular vessels, below the iliopubic tract. That’s where the nerves run. |
| `lm_cooper` |  | And where would you put a tack, if you needed one? |
| `lm_cooper-ok` | warm | Cooper’s ligament. Bone, no nerves. The safest place to fix. |
| `lm_cooper-bad` | serious | Not there. The safest place is Cooper’s ligament, on the pubic bone. |
| `sac_L` |  | Now the indirect sac. How do we get it out? |
| `sac_L-o0` | warm | Nice. One hand pulls, the other cleans the cord off the sac. Patiently. |
| `sac_L-o1` | serious | Wait. Stop. Inside the cord are the vas and the testicular vessels. Only pull the sac. |
| `sac_L-o2` | serious | A sac left in the canal looks like a recurrence within a year. We take it out. |
| `sac_long` |  | The sac is long and goes all the way down to the scrotum. Do we keep pulling? |
| `sac_long-o0` | warm | Exactly. With a sac like this it’s safer than dissecting the whole cord. Maybe a little fluid afterwards. |
| `sac_long-o1` | serious | You’re dissecting the whole cord for this. The testis will thank you in two days, with swelling. |
| `sac_long-o2` | serious | Then it stays above the mesh. Divide it near the ring, don’t leave the whole thing. |
| `sac_M` |  | In a direct hernia, what do we reduce? |
| `sac_M-o0` | warm | Nice. The defect is empty and you can see the edges. Now you know how big it is. |
| `sac_M-o1` | serious | Why enlarge it? The mesh covers it. Just take out what’s inside. |
| `lip_q` |  | Hold on, there’s something else here. A yellow lump of fat inside the cord, going into the canal. What is it, and what do we do? |
| `lip_q-o0` | warm | Right. Fat that passes through the ring behaves like a hernia. Leave it, and you get a pseudo-recurrence. |
| `lip_q-o1` | serious | Just fat? In three months he’ll come back with a bulge, and they’ll say the hernia came back. |
| `lip_q-o2` |  | Take it out, yes. But don’t burn next to the vas. Pull it out, then divide it. |
| `pariet` |  | Parietalization. How far do we dissect the vas and the testicular vessels? |
| `pariet-o0` | warm | Good. The lower edge of the mesh will lie flat on the vessels. |
| `pariet-o1` | serious | The mesh will lift from below. That’s where most recurrences start. |
| `pariet-o2` |  | Until it turns into the pelvis is enough. Beyond that you’re only putting the testicular vessels at risk. |
| `n_mesh` |  | In a moment I’ll ask for the mesh. What do we get ready? |
| `n_mesh-o0` | warm | Perfect. And say the size and side out loud before you open it. |
| `n_mesh-o1` | serious | Small is exactly what we don’t want. At least ten by fifteen. |
| `n_mesh-o2` |  | A mesh that’s opened and not used goes in the bin. Confirm the size, then open. |
| `stu_mpo` |  | Just before the mesh we stop, like the critical view in a gallbladder. Here it’s the critical view of the myopectineal orifice. |
| `mpo` |  | We stop. The critical view of the myopectineal orifice. What do we have now? |
| `mpo-ok` | warm | That’s the critical view. Now the mesh can go in. |
| `mpo-m0` | serious | Retzius to the bone and past the midline. Without that, the femoral isn’t covered. |
| `mpo-m1` | serious | Bogros to the iliac spine. Otherwise the mesh folds at the side. |
| `mpo-m2` | serious | All three openings. What you didn’t see, you didn’t cover. |
| `mpo-m3` | serious | The sac and the lipoma. Fat left in the ring will come back to us. |
| `mpo-m4` | serious | Parietalization. Otherwise the mesh lifts from below. |
| `mpo-m5` | serious | Room for a flat mesh, at least ten by fifteen. |
| `mpo-m6` | serious | We don’t clean the fat off the nerves. It protects them. |
| `mpo-m7` | serious | We don’t divide the epigastrics to make room. They stay. |
| `mpo_gap` |  | Hold on. Before the mesh, look again. Something from the critical view isn’t really there. Do we go back and fix it? |
| `mpo_gap-o0` | warm | Nice. Ten minutes now saves a reoperation. That’s how we work. |
| `mpo_gap-o1` | serious | Okay. It’s your operation. I’m only saying I’d go back. |
| `mesh` |  | Which mesh, and what size? |
| `mesh-o0` | warm | Good. A mesh that size, lying right, covers everything. |
| `mesh-o1` |  | Fine, but in a defect like this a light mesh that isn’t fixed can fall in. Let’s think about fixation. |
| `mesh-o2` | warm | Exactly. A big defect, a big mesh, and fixation. |
| `mesh-o3` | serious | Small is exactly how hernias come back. At least ten by fifteen. |
| `mesh-o4` |  | Weight isn’t the criterion. A light mesh has a small early advantage, but not in recurrence and not in pain. |
| `mesh-o5` | warm | Also good. It sits on the curves. Just make sure it’s the right side. |
| `mesh_lay` |  | The mesh is in. How do we lay it out? |
| `mesh_lay-o0` | warm | Good. Check corner by corner. If there’s a fold, straighten it now. |
| `mesh_lay-o1` | serious | Mesh doesn’t flatten out by itself. A fold today is a recurrence next year. |
| `mesh_lay-o2` | serious | That’s exactly where the hernia will come back. The lower edge goes underneath, on the vessels. |
| `fix` |  | Do we fix it? |
| `fix-o0` | warm | Agreed. In the meta-analysis there was no difference in recurrence or pain. Fewer tacks, fewer nerves. |
| `fix-o1` | serious | In a four centimeter defect? The mesh will fall in. Here the guideline says to fix it. |
| `fix-o2` | warm | Right. In a large direct hernia we fix. Show me where the first one goes. |
| `fix-o3` |  | Not required for a hernia like this. But let’s see that you know where it’s allowed. |
| `fix-o4` | warm | Also good. No tack, no trapped nerve. That’s convention, though. I don’t have a trial that clearly compares them. |
| `fix_tap` |  | Show me where the first tack goes. |
| `fix_tap-z0` |  | Nice. Cooper’s, on the bone. As safe as it gets. |
| `fix_tap-z1` |  | Good. High, on the rectus. Far from any nerve. |
| `fix_tap-z2` |  | Above the tract, yes. Just not any lower than that. |
| `fix_tap-z3` | serious | You fired one there. Now we hope. |
| `fix_tap-s3` | urgent | Wait. Stop. That’s the triangle of doom. The iliac vein is underneath. |
| `fix_tap-z4` | serious | You fired one there. Let’s hope the nerve wasn’t in the way. |
| `fix_tap-s4` | urgent | Stop. Below the tract, laterally? That’s where the nerves are. It’s the triangle of pain. |
| `fix_tap-ms` | calm | Not there. Pick a spot on the mesh: Cooper’s, up on the rectus, or laterally above the tract. |
| `fix_tap2` |  | And one more. Where? |
| `fix_tap2-z0` |  | Good. That’s enough. No need to decorate the mesh with tacks. |
| `fix_tap2-z1` |  | Good. That’s enough for us. Fewer tacks, less pain. |
| `fix_tap2-z2` |  | Above the tract, nice. We’re done fixing. |
| `fix_tap2-z3` | serious | You fired one there. Now we hope. |
| `fix_tap2-s3` | urgent | Wait. Stop. That’s the triangle of doom. The iliac vein is underneath. |
| `fix_tap2-z4` | serious | You fired one there. Let’s hope the nerve wasn’t in the way. |
| `fix_tap2-s4` | urgent | Stop. Below the tract, laterally? That’s where the nerves are. It’s the triangle of pain. |
| `fix_tap2-ms` | calm | Not there. Cooper’s, the rectus above, or laterally above the tract. |
| `tear_now` |  | Hold on. The flap has torn near the edge. See the hole? What do we do? |
| `tear_now-o0` | warm | Exactly. A small hole now, a big hole when we close. We close it now. |
| `tear_now-o1` |  | You can, if you don’t forget. I’ve seen people forget. |
| `tear_now-o2` | serious | A small hole is exactly where bowel gets in and gets stuck. We close it. |
| `close` |  | Closing the peritoneum. How? |
| `close-o0` | warm | Good. Low pressure, and the flap reaches without tension. Check there’s no hole before you tie. |
| `close-o1` |  | It works, but there are gaps between the clips. Check them well. |
| `close-o2` | serious | See? It tore. At this pressure the peritoneum is as tight as a drum. Lower the pressure. |
| `close-o3` | serious | Exposed mesh, and bowel looking for a hole. Not on my watch. Choose again. |
| `close_tear` |  | It’s torn. Now what? |
| `close_tear-o0` | warm | Good. Low pressure, and the flap relaxes. Now a running suture. |
| `close_tear-o1` | serious | It won’t hold. But fine, we’ll see what happens. |
| `close_ok` |  | Closed. The mesh is covered. Now the most important thing is not to get tired at the end. |
| `bil_left_n` |  | The right is done. Now the same story on the left, with the hernia that brought him in. Another half hour. |
| `n_count` |  | Before we close the skin. What did we count, and what did we record? |
| `n_count-ok` | warm | Perfect. A correct count and a complete record. |
| `n_count-m0` | serious | The needle and swab count. Without it, we don’t close skin. |
| `n_count-m1` | serious | A mesh without a lot number in the record is a problem if there’s ever a recall. |
| `n_count-m2` | serious | Findings go in the note. Whoever operates on him in the future needs to know. |
| `n_count-m4` | serious | We don’t throw away the mesh sticker. It goes in the chart. |
| `finish` |  | What do we close and check at the end? |
| `finish-o0` | warm | Good. Ports of ten millimeters and above get a fascial stitch. That way we won’t see him back with a bulge at the umbilicus. |
| `finish-o1` | serious | Small enough to catch a loop of bowel. One stitch, two minutes. |
| `finish-o2` |  | A bleeding port shows up in recovery. Take them out slowly, and look at every hole. |
| `void_plan` |  | He’s at risk of urinary retention. What do we tell recovery? |
| `void_plan-o0` | warm | Exactly. We don’t flood him with fluids, and we don’t wait ten hours. |
| `void_plan-o1` | serious | The opposite. The bladder fills fast and doesn’t empty. Moderate fluids. |
| `opnote` |  | What goes in the op note? |
| `opnote-o0` | warm | Good. Whoever operates on him in ten years will thank you. |
| `opnote-o1` | serious | That’s not an op note, that’s a status update. Whoever sees him with a recurrence needs to know what’s in there. |
| `po_ok` |  | Evening. Mild pain, passing urine, walking in the corridor. What now? |
| `po_ok-o0` | warm | Right. Day surgery. No need for six weeks of lifting nothing. |
| `po_ok-o1` |  | What for? At home he’ll walk more and sleep better. |
| `po_ok-o2` |  | The guideline says back when comfortable. The old restrictions don’t reduce recurrence. |
| `po_fem` |  | Two days later. She’s eating a little, passing gas, no fever. What now? |
| `po_fem-o0` | warm | Good. And tell her that in a woman we always check the femoral opening. That’s what saved her. |
| `po_fem-o1` |  | After incarcerated bowel I want to see her eating. One more day. |
| `po_ret` |  | Six hours later, he hasn’t passed urine. His lower abdomen is full and sore. What do we do? |
| `po_ret-o0` | warm | Right. Drain it, and usually he’ll pass urine himself once the catheter is out. |
| `po_ret-o1` | serious | Wait? His bladder already holds a liter. Every hour of stretching makes it harder for it to recover. |
| `po_ret2` |  | Two hours later. He’s in a lot of pain, writhing in bed. |
| `po_ret2-o0` | warm | Yes. A liter and a hundred came out. He’s already smiling. |
| `po_blad` |  | Next morning. Blood in the urine, lower abdominal pain, and the creatinine has gone up. What are you thinking? |
| `po_blad-o0` | warm | Yes. And it ties in with the clear fluid we saw in the OR. Next time, we stop and check. |
| `po_blad-o1` | serious | Blood and a rising creatinine aren’t the catheter. We need to look at the bladder. |
| `po_bowel` |  | The next day. Heart rate one hundred and eighteen, pain all over the abdomen, far more than expected. What do we do? |
| `po_bowel-o0` | warm | Right. Disproportionate pain after laparoscopy is bowel until proven otherwise. |
| `po_bowel-o1` | serious | Tomorrow he’ll be in intensive care. CT now. |
| `po_bowel2` |  | Overnight he became septic. Free air on the CT. To the OR, now. |
| `po_bowel_or` |  | In the OR we find the perforation, repair it and wash out. The mesh? It will probably have to come out later. |
| `po_obst` |  | Two days later. A distended abdomen, vomiting, no gas. What do we do? |
| `po_obst-o0` | warm | Yes. Bowel that’s gone into a peritoneal hole doesn’t come out by itself. Free it, and close. |
| `po_obst-o1` | serious | Obstruction after TAPP, with a hole in the peritoneum? That’s not an ileus. CT now. |
| `po_obst2` |  | Overnight the pain became constant. The CT shows a closed loop between the mesh and the peritoneum. We go to the OR, quickly. |
| `po_testis` |  | Two days later. The testis on that side is swollen and painful, with a low-grade fever. What do we do? |
| `po_testis-o0` | warm | Right. It’s usually venous congestion, and it settles. It happens when the cord is over-dissected. |
| `po_testis-o1` | serious | Without a Doppler? No. Most cases settle with conservative treatment. |
| `po_testis-o2` |  | Most of the time it settles. But without follow-up we won’t know if the testis is atrophying. |
| `fu_seroma` |  | A week later. A soft, painless swelling in the groin. He’s sure it’s come back. |
| `fu_seroma-o0` | warm | Good. Most seromas resolve on their own. A needle brings bacteria into the mesh. |
| `fu_seroma-o1` | serious | He’ll feel better for a week. And if you’ve put bacteria into the mesh, he’ll feel bad for six months. |
| `fu_seroma-o2` | serious | A recurrence after a week? It’s almost always fluid. Ultrasound tells them apart. |
| `fu_infect` |  | Fever and redness in the groin. The ultrasound shows a collection around the mesh. What do we do? |
| `fu_infect-o0` | warm | Right. We try to save it. Sometimes there’s no choice, and it comes out. |
| `fu_infect-o1` |  | A collection doesn’t disappear with tablets. It needs drainage. |
| `fu_port` |  | Six months later. A painful bulge at the umbilicus, and vomiting since this morning. What do we do? |
| `fu_port-o0` | warm | Exactly. The small openings are the most dangerous. And this is what happens when the fascia isn’t closed. |
| `fu_port-o1` | serious | With vomiting? That’s stuck bowel. We don’t reduce it and send him home. |
| `fu_lip` |  | Three months later. A bulge and pain on the same side. The ultrasound shows a lump of fat in the canal, and no sac. What is it? |
| `fu_lip-o0` | warm | Yes. It’s not a recurrence, it’s the fat we left. It comes out, and the pain goes away. |
| `fu_lip-o1` |  | It looks like a recurrence, but there’s no sac. It’s the fat from the canal. |
| `fu_lip-o2` | serious | He’s already been back twice. In the end someone will take out the fat, and the pain will go. |
| `fu_contra` |  | A year later. A bulge on the right, with symptoms. Was it already there at the operation? |
| `fu_contra-o0` | warm | Right. And next time we look at the other side. It’s free. |
| `fu_contra-o1` |  | Maybe. But whoever looked inside would have known. In TAPP we check both sides. |
| `fu_pain` |  | Three months later. A burning pain in the outer thigh, worse when he walks. What do we do? |
| `fu_pain-o0` | warm | Right. When it fits a nerve and there’s a tack in the wrong place, we don’t wait a year. |
| `fu_pain-o1` | warm | Right. Most pain improves with time. Nerve surgery, not before a year. |
| `fu_pain-o2` | serious | Too early. First, a year of treatment. Surgery only when everything else has failed. |
| `fu_recur` |  | A year later. The bulge is back, on the same side. What do we do? |
| `fu_recur-o0` | warm | Right. After posterior, go anterior. And why did it come back? The mesh, a fold, the dissection. We’ll talk about it. |
| `fu_recur-o1` | serious | Through the same scar, from behind? Only for an expert. After posterior, we go in from the front. |
| `fu_ok` |  | A year later. He jogs in for his follow-up. No pain, no bulge. |
