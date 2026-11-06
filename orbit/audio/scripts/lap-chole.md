# James · live case: lap-chole

Voice: James (ElevenLabs, Eleven v3). Calm, warm attending in the OR, talking to a resident next to him. Natural pace, short pauses at full stops. The tag in brackets is the delivery for that line.

446 lines · about 6181 words · about 41 minutes of audio.
Record: from Surgery X, `python3 tools/live-voice.py orbit/data/live/lap-chole.js`

| key | tone | line |
|---|---|---|
| `hello` | warm | Morning. You’re with me in OR three today. We’ve got a few gallbladders on the list. Which one would you like to take? |
| `gen-unclear` | casual | Sorry, I’m not sure I followed. Did you mean one of these? |
| `gen-again` | casual | Say it another way, or pick one of the options. |
| `gen-miss` | calm | Not there. Look again and pick a spot. |
| `h_easy` |  | Morning. Laura, forty-six, recurrent biliary colic and stones. Liver enzymes are normal. Have you read the notes? |
| `h_easy-o0` | warm | Good. Then today you operate and I assist. We’ll learn to do it properly even when it’s easy. |
| `h_easy-o1` |  | Next time, read before. The easy case is where it’s easiest to fall asleep on watch. |
| `h_easy-o2` | serious | Just a gallbladder? Something my own boss taught me: there’s no such thing. There’s only a gallbladder that hasn’t surprised you yet. |
| `h_ac2` |  | Daniel, fifty-eight. Four days of pain, a fever and a white count of nineteen. A tender mass under the ribs. What Tokyo grade is that? |
| `h_ac2-o0` | warm | Exactly. And there’s no organ dysfunction, so it isn’t three. An experienced surgeon and a fit patient, so we operate. |
| `h_ac2-o1` | serious | No. Four days, a mass and a count of nineteen. That’s a two, and it changes what’s waiting for us inside. |
| `h_ac2-o2` |  | Three means organ dysfunction. He’s stable, so it’s a two. But it’s good that you’re thinking about severity. |
| `h_ac2b` |  | So what do we do? Operate now, or antibiotics and come back later? |
| `h_ac2b-o0` | warm | Yes. In the ACDC trial early surgery had fewer complications. And I’m right here with you. |
| `h_ac2b-o1` |  | That’s an option, but he’s fit and we have the team. Delay means he comes back with another attack. So we go in. |
| `h_ac2b-o2` |  | We keep drainage for patients who can’t have an operation. He can. Let’s go to the OR. |
| `h_mir` |  | Susan, sixty-seven. Mild jaundice. On MRCP there’s a large stone stuck in the gallbladder neck, pressing on the common hepatic duct. What are you thinking? |
| `h_mir-o0` | warm | Right. So today we don’t win by force. If the triangle is frozen, we think about a subtotal. |
| `h_mir-o1` |  | ERCP might ease the jaundice, but the stone is in the gallbladder. This is Mirizzi. |
| `h_mir-o2` | serious | It changes everything. In this abdomen the hepatic duct is stuck to the gallbladder, sometimes actually open into it. |
| `h_mir2` |  | So what’s your plan if everything inside is frozen? |
| `h_mir2-o0` | warm | Nice. A plan before the incision is worth gold in the middle of the case. |
| `h_mir2-o1` |  | Open on its own doesn’t solve a frozen triangle. The duct is stuck in the open too. We’ll come back to it inside. |
| `h_mir2-o2` | serious | No. Today, whoever goes looking for the duct will find it. With the scissors. |
| `h_anat` |  | Mark, thirty-nine, elective. Ultrasound normal apart from stones. Looks simple, doesn’t it? What’s the plan if the anatomy isn’t clear? |
| `h_anat-o0` | warm | Good. That’s the whole secret. Remember that sentence in half an hour. |
| `h_anat-o1` | serious | Always there? Most injuries happen to surgeons who were sure they were looking at the cystic duct. |
| `h_anat-o2` |  | You always can, I’m here. But I want to hear how you decide on your own. |
| `h_cbd` |  | Elena, fifty-two. Bilirubin of three and a common bile duct of nine millimeters. And she has a scar from ulcer surgery. What’s the plan for the duct? |
| `h_cbd-o0` | warm | Nice. We did an MRCP yesterday. There’s a six millimeter stone in the duct. So what now? |
| `h_cbd-o1` | warm | Also a good route. Then we’ll get the C-arm and a duct clearance set ready. |
| `h_cbd-o2` |  | We did, and they pulled out a stone. But at intermediate risk I’d have started with imaging. ERCP isn’t an innocent test. |
| `h_cbd-o3` | serious | And if there’s a stone in there? Tomorrow she’s back with jaundice or pancreatitis. We’ll think about it inside. |
| `h_cbd2` |  | Now that we know there’s a stone in the duct, what’s the plan? |
| `h_cbd2-o0` | warm | Done. The ERCP took the stone out last night. Today we’re left with the gallbladder. |
| `h_cbd2-o1` | warm | Nice. In the Cochrane review there was no difference in mortality or complications compared with ERCP first. We’ll get the set ready. |
| `h_cbd2-o2` | serious | A stone we’ve seen in the duct doesn’t get left behind. We’ll do a cholangiogram inside. |
| `chk` |  | One moment before we go in. What should already be settled? Tick them off. |
| `chk-ok` | warm | Good. That’s everything we need. Let’s go to the OR. |
| `chk-m0` | serious | Consent. We don’t start without it, and it covers conversion to open and a subtotal too. |
| `chk-m1` | serious | The imaging. Not just the report. You look at it yourself before you go in. |
| `chk-m2` | serious | Antibiotics. If they’re indicated, they go in within the hour before the incision. |
| `chk-m3` | serious | Clot prophylaxis. Anything from stockings to an injection, according to risk. |
| `chk-m4` | serious | And the time out? Everybody stops. Name, procedure, allergies. We don’t skip it. |
| `chk-m5` | serious | A routine drain in an uncomplicated gallbladder? There’s no evidence for it. We decide about a drain at the end. |
| `chk-m6` | serious | Bowel prep? This is a gallbladder, not a colon. |
| `sn_easy` |  | Hang on. The consent form doesn’t mention conversion to open. She’s already on the table but not yet asleep. What do we do? |
| `sn_easy-o0` | warm | Right. Two minutes now saves a very hard conversation later. |
| `sn_easy-o1` | serious | No. If we have to open, she needs to hear that from us now. Let’s go and talk to her. |
| `sn_easy-o2` |  | The anesthetist doesn’t consent for our operation. That’s on us. Come on, two minutes. |
| `sn_ac2` |  | The anesthetist is asking about antibiotics. He’s been on treatment since yesterday and the last dose was seven hours ago. What do you say? |
| `sn_ac2-o0` | warm | That’s what I do. The next dose is a long way off and we cut in fifteen minutes. It’s a convention, but a sensible one. |
| `sn_ac2-o1` |  | Reasonable, but seven hours is a long time. I’d rather the level was high when we cut. |
| `sn_ac2-o2` | serious | “Just to be safe” isn’t a reason. Same treatment, at the right time. |
| `sn_mir` |  | The HPB surgeon is in another OR until eleven. Do we start without him? |
| `sn_mir-o0` | warm | Exactly. He knows, we start slowly, and if we need him he’s here in ten minutes. |
| `sn_mir-o1` |  | We could, but it’s a shame. We’ll start slowly and if we need him he’ll come. |
| `sn_mir-o2` | serious | I’m not embarrassed to ask for help, and you shouldn’t be either. I’m calling him. |
| `sn_anat` |  | Nobody booked the C-arm. If we need a cholangiogram, we wait an hour. What do we do? |
| `sn_anat-o0` | warm | Good. The radiographer will wait outside. Better not to need it than to need it and not have it. |
| `sn_anat-o1` | warm | Good idea. In a randomized trial ICG improved identification of structures before the critical view. Let’s inject. |
| `sn_anat-o2` |  | An easy case, until it isn’t. Let’s see. |
| `sn_cbd` |  | The choledochoscope is in another department. If the cholangiogram shows a stone, what’s the plan? |
| `sn_cbd-o0` | warm | Fine. I’ve already sent the porter. |
| `sn_cbd-o1` | warm | That works too. Just make sure the gastroenterologists know in advance. |
| `sn_cbd-o2` |  | Inside is too late to go looking for equipment. Next time we decide beforehand. |
| `sn_cbd_clr` |  | The ERCP cleared the duct. Now it’s an ordinary gallbladder, just with an old scar in the upper abdomen. Think about that when we enter. |
| `n_prep` |  | You’re with us as the scrub nurse. What’s ready on the table before we go in? |
| `n_prep-ok` | warm | Excellent. That’s how I like a table. |
| `n_prep-m0` | serious | Both entry sets. The surgeon can change their mind at the last moment. |
| `n_prep-m1` | serious | The gas. Connected, full, and the pressure set before we go in. |
| `n_prep-m2` | serious | The scope. White balance and warm it, or it fogs up inside. |
| `n_prep-m3` | serious | The first count. Without it there’s no final count. |
| `n_prep-m4` | serious | A stapler? Not for a gallbladder. We only open what we need. |
| `entry_std` |  | Right. Let’s get in. How are you going to enter the abdomen? |
| `entry_std-o0` | warm | Fine. Calm and safe. You see every layer. |
| `entry_std-o1` | warm | Good. As long as you do the checks, that’s perfectly fine. |
| `entry_std-o2` |  | It works in experienced hands. For your first one, I’d rather you could see what you’re doing. |
| `entry_std-o3` | serious | No checks? Not with me. Even if it works nine times, the tenth one hurts. |
| `entry_scar` |  | Hold on. She has a midline scar above the umbilicus. Where and how do we get in? |
| `entry_scar-o0` | warm | Very nice. Well away from the scar, and we’ll put the umbilical port in later under vision. |
| `entry_scar-o1` | warm | Also good. You see every layer and you’re away from any stuck bowel. |
| `entry_scar-o2` |  | The umbilicus is the end of the scar. You can, but very slowly and with a finger before every cut. |
| `entry_scar-o3` | serious | A blind needle under a scar? That’s exactly where the bowel is waiting for it. All right, I’m next to you. |
| `press` |  | We’re insufflating. To what pressure? |
| `press-o0` | warm | Nice. The lowest that lets you see. |
| `press-o1` |  | Let’s start lower. If we can’t see, we’ll go up. Don’t let the pressure do your work for you. |
| `press-o2` | serious | Twenty? The anesthetist will kill us. And rightly so. |
| `c_co2` |  | Wait. The pressure’s dropping and the heart rate’s falling. What comes first? |
| `c_co2-o0` | warm | Right. Gas out, talk to the anesthetist, then think: vagal, bleeding from the entry, or embolism. |
| `c_co2-o1` | serious | We don’t carry on. I’m opening the gas now. Look at the monitor with me. |
| `c_co2-o2` | serious | The opposite. More pressure means less blood back to the heart. Let it out. |
| `co2_ok` |  | The pressure’s back. We’ll insufflate again slowly, this time to ten or twelve. Anesthesia is with us. |
| `look` |  | The camera’s in. Before you rush to the gallbladder, what do we check? |
| `look-o0` | warm | Yes. If you don’t look, you don’t find. A full look around, then the gallbladder. |
| `look-o1` | serious | Straight to the gallbladder? All right, but that’s how things get missed. Next time, a full look first. |
| `look-o2` |  | Half a job. The most important place to check is right under your own trocar. |
| `c_bowel` |  | Wait. Stop. Do you see that? A small hole in the small bowel, right under the entry site. What do we do? |
| `c_bowel-o0` | warm | Right. The trocar marks the spot for us. I’ll suture, you hold. That’s how you learn. |
| `c_bowel-o1` | serious | Small today, peritonitis tomorrow. All right, leave it. We’ll talk about it at the end. |
| `c_bowel-o2` |  | You could, but a small hole like this I’ll close from inside. Breathe. This isn’t the end. |
| `bowel2` |  | So the bowel’s been dealt with. Do we carry on with the gallbladder or stop for today? |
| `bowel2-o0` | warm | I agree. No spillage, so we carry on, and twice as carefully. |
| `bowel2-o1` |  | A conservative and legitimate decision. I’d have carried on, but I won’t argue with you. |
| `po_stop` |  | We’ve closed. We’ll book the cholecystectomy in a few weeks. On the ward we watch the abdomen, and any patient who isn’t better every day gets worked up. |
| `ports_std` |  | Four ports. The camera first, then the other three. Touch where you want them. |
| `ports_std-g` | warm | Good. A nice working triangle and the camera in line with the gallbladder. |
| `ports_std-o` |  | Reasonable. One port is a little off. You’ll feel it in the angle, but we can work. |
| `ports_std-b` | serious | That won’t work. The instruments will clash. Look at where the ideal points are. |
| `ports_std-d0` | urgent | Too low. From there you can’t pull the fundus up over the liver. Come up, just below the ribs. |
| `ports_std-d1` | urgent | On the bone? Come down two or three centimeters below the xiphoid. |
| `ports_scar` |  | We’re in safely. Now four ports, and mind the scar. The camera first. |
| `ports_scar-g` | warm | Excellent. All the ports are away from the scar, with a good angle. |
| `ports_scar-o` |  | That works. One is a little out of place, we’ll manage. |
| `ports_scar-b` | serious | We’ll be working hard like this. Look at the ideal points. |
| `ports_scar-d0` | urgent | Too low. From there you can’t pull the fundus up over the liver. Come up, just below the ribs. |
| `ports_scar-d1` | urgent | On the bone? Come down two or three centimeters below the xiphoid. |
| `ports_scar-d2` | urgent | Hold on. That’s the scar. There may be bowel stuck underneath. We look from the inside first, then we place the trocar. |
| `n_ports` |  | Trocars. What are you opening? |
| `n_ports-o0` | warm | Exactly. And keep another five close by, in case we need an extra port. |
| `n_ports-o1` | serious | We won’t get a ten millimeter camera through a five, or a gallbladder out of one. |
| `n_ports-o2` |  | It works, but that’s a big hole for no reason. Five is enough for the working instruments. |
| `tilt` |  | Now the table. How do you want it? |
| `tilt-o0` | warm | Exactly. Let gravity work for you. |
| `tilt-o1` | serious | Head down? All the bowel will come to us. The other way. |
| `tilt-o2` |  | We’ll manage, but why make it hard? A bit of head up and to the left. |
| `exp_tense` |  | Look at that gallbladder. Tense and thick, and the grasper keeps slipping. What do we do? |
| `exp_tense-o0` | warm | Nice. A soft gallbladder can be grasped. And put a clip on the hole so it doesn’t leak. |
| `exp_tense-o1` | serious | That’s going to tear. But go on, let’s see. |
| `exp_tense-o2` |  | That way the triangle won’t open well. Let’s try. |
| `exp_adh` |  | Omentum and duodenum are stuck to the gallbladder. How do you free them? |
| `exp_adh-o0` | warm | Yes. We work on the gallbladder, not on the duodenum. |
| `exp_adh-o1` | serious | Wait. Stop. That’s duodenum. Heat there you don’t see today, you see tomorrow. |
| `exp_adh-o2` |  | Then we won’t see the triangle. In the end we’ll have to free them. |
| `exp_main` |  | Now we open the triangle. Where do you retract the fundus, and where does Hartmann’s pouch go? |
| `exp_main-o0` | warm | Good. See that? The triangle opens and the cystic duct moves away from the common duct. |
| `exp_main-o1` | serious | Wait. Look what happened. Everything is in one line and the common duct looks exactly like the cystic duct. Laterally and down. |
| `exp_main-o2` |  | Half a triangle. Give Hartmann’s pouch some lateral traction and watch it open. |
| `gear1` |  | We’re opening the peritoneum. What do you want in your right hand? |
| `gear1-ok` | warm | The hook. Short movements, and you see the tip the whole time. |
| `gear1-bad` | serious | We’ll save that for later. Right now, something that opens tissue gently. |
| `gear1-alt` |  | That works too. Some people prefer a Maryland for opening. Just keep the tip in view. |
| `rouv` |  | Before you cut anything, show me Rouvière’s sulcus. |
| `rouv-ok` | warm | Yes. That’s the line. Above it we work, below it we don’t. |
| `rouv-bad` | serious | No, that’s not it. Look for a cleft in the liver, to the right of and behind Hartmann’s pouch. |
| `stu_duo` |  | A question for you, as a student. Where’s the duodenum? |
| `stu_duo-ok` | warm | Right. And now you understand why we don’t use energy next to it. |
| `stu_duo-bad` | serious | No. The duodenum is lower down, under the gallbladder neck. Try again next time. |
| `line` |  | So where’s your dissection in relation to Rouvière’s line? |
| `line-o0` | warm | Right. Above the line, right on the gallbladder. That’s the safe place. |
| `line-o1` | serious | The opposite. Below the line is the common bile duct. We’re not looking for it. |
| `line-o2` | serious | It matters a great deal. When everything is edematous, this line is what you have left. |
| `n_dis` |  | Before the dissection, what do you check on the instruments? |
| `n_dis-o0` | warm | Excellent. A small defect in the insulation can burn bowel outside the field of view. |
| `n_dis-o1` |  | Connected is a start. Check the insulation as well. |
| `n_dis-o2` | serious | This morning isn’t now. You check before you use it. |
| `dis_tap` |  | Go on, then. Show me where you start opening. |
| `dis_tap-z0` |  | Nice. Right on the gallbladder and above the line. The front first, then we’ll flip it and open the back. |
| `dis_tap-z1` |  | Straight onto the duct? Start higher, on the neck. That way the duct comes out to you by itself. |
| `dis_tap-z2` | serious | I said not there. From now on, only right on the gallbladder. |
| `dis_tap-s2` | urgent | Wait. Stop. That’s the common bile duct. We don’t work there at all. |
| `dis_tap-z3` | serious | No. We go back up to the gallbladder. |
| `dis_tap-s3` | urgent | Stop. That’s the common hepatic duct. You’re well below the line. |
| `dis_tap-z4` | serious | Not there. Up to the gallbladder neck. |
| `dis_tap-s4` | urgent | Stop. That’s the duodenum. A hook there is a hole you find tomorrow. |
| `dis_tap-z5` |  | That’s the upper end of the line. Come down a little to the gallbladder neck and start there. |
| `dis_tap-ms` | calm | Not there. Look for the fold of peritoneum over the gallbladder neck. |
| `dis2` |  | We’ve opened both sides. Now we clear the triangle. Where do you go next? |
| `dis2-z0` |  | Good. The node shows us where the artery is. We stay on the gallbladder side. |
| `dis2-z1` |  | Good. We separate the lower third from the liver. Without that there’s no critical view. |
| `dis2-z2` |  | That’s the artery. Clear around it gently, with no energy right up against it. |
| `dis2-z3` | serious | I told you that’s the hepatic artery. We leave it alone. |
| `dis2-s3` | urgent | Wait. Stop. That’s an artery. And it isn’t the cystic artery, it carries on into the liver. |
| `dis2-s4` | urgent | Stop. You’re on the common bile duct again. Back to the gallbladder. |
| `dis2-ms` | calm | Not there. Look at the triangle between the cystic duct, the liver and the gallbladder neck. |
| `energy` |  | While you’re at it, how are you working with the hook? |
| `energy-o0` | warm | Exactly. Something my own boss taught me: if you can’t see the tip, you don’t press the pedal. |
| `energy-o1` | warm | Nice. Most of the triangle opens with your hands, not with energy. |
| `energy-o2` | serious | Quick now, a leak in a week. Turn the power down. |
| `dis_anat` |  | Go on, then. Show me where you start opening. |
| `dis_anat-z0` |  | Nice. Right on the gallbladder. Now slowly, something here looks different to me. |
| `dis_anat-z1` |  | Start higher, on the neck. And notice, this duct is short. |
| `dis_anat-s2` | urgent | Wait. Stop. That’s the common bile duct. We don’t work there. |
| `dis_anat-s3` | urgent | Stop. That’s the duodenum. |
| `dis_anat-ms` | calm | Not there. Look for the fold of peritoneum over the gallbladder neck. |
| `anat_q` |  | See that? A second tubular structure joining the cystic duct from the liver side. What do you think it is? |
| `anat_q-o0` | warm | That’s the sentence I wanted to hear. If you can’t identify it, you don’t cut it. |
| `anat_q-o1` | serious | Wait. Stop. That isn’t an artery, it’s a bile duct from the right lobe. And you’ve closed it. |
| `anat_q-o2` | serious | Stop. That’s a right bile duct, not a cystic duct. And now it’s leaking. |
| `anat_q-o3` |  | I’m here. And I don’t cut what I can’t identify either. Keep dissecting and we’ll check. |
| `dis_hard` |  | The triangle is frozen. Edema, everything stuck together. Show me where you start. |
| `dis_hard-z0` |  | Yes. Right on the gallbladder, using the sucker as a dissector. Slowly. |
| `dis_hard-z1` |  | Too high, but safe. We’ll work slowly down toward the neck. |
| `dis_hard-s2` | urgent | Wait. Stop. In this edema the common bile duct looks like everything else. Not there. |
| `dis_hard-s3` | urgent | Stop. That’s the duodenum, stuck to the gallbladder. Hands only, no energy. |
| `dis_hard-ms` | calm | Not there. Look for the gallbladder neck, it’s under the swollen omentum. |
| `hard1` |  | Twenty minutes have gone by. We’ve made very little progress. What now? |
| `hard1-o0` | warm | All right. But I’m setting a clock. Another twenty minutes without a critical view and we have a different conversation. |
| `hard1-o1` |  | You can, but in edema like this it’s more dangerous than it looks. Let’s see. |
| `hard1-o2` | serious | Looking for the duct is exactly what we don’t do. But go on, I’m watching. |
| `hard_ok` |  | See that? Little by little it opens. The patience paid off. Now we clear the triangle completely. |
| `unstab` |  | Did you hear the anesthetist? He’s unstable and we don’t have a critical view. That changes the plan. What do you think? |
| `unstab-o0` | warm | Yes. A drain in the gallbladder, we get out and come back when he’s stronger. The Tokyo guidelines describe exactly that. |
| `unstab-o1` | warm | Also possible, if it’s quick. Open it, take the stones out, a drain. |
| `unstab-o2` | serious | Anesthesia won’t cope on their own. We’re one team. |
| `stuck` |  | Forty minutes and still no critical view. What do we do? |
| `stuck-o0` | warm | Right. I’m calling Tom. Two pairs of eyes. And in the meantime, what are the options? |
| `stuck-o1` | serious | “In a moment” is what everyone who injured a duct said. All right, I’m next to you. |
| `stuck-o2` |  | Yes, but we call for help as well. I’m already on the phone. |
| `n_bail` |  | Change of plan. What are you getting ready? |
| `n_bail-ok` | warm | Good. That’s how a team works. |
| `n_bail-m0` | serious | Sutures and an endoloop. In a subtotal you suture from inside. |
| `n_bail-m1` | serious | A drain. After a subtotal we almost always leave one. |
| `n_bail-m2` | serious | An open set. We don’t open it, but it’s in the room. |
| `n_bail-m3` | serious | And tell everyone. A change of plan is something the whole team needs to hear. |
| `n_bail-m4` | serious | We’re not finishing yet. We’ll still need the bag. |
| `bail2` |  | So what’s your way out? |
| `bail2-o0` | warm | Yes. In a review of thirty studies, duct injury was very rare with a subtotal. Let’s do it. |
| `bail2-o1` |  | Possible. But if it’s still unclear at the neck, we stop there. |
| `bail2-o2` |  | We’ll open. But remember, the triangle is frozen in the open too. |
| `bail2-o3` | serious | I don’t like this. I’m watching every move. |
| `bail2-o4` | warm | When he’s unstable, that’s the right decision. Drain it and get out. |
| `ccy` |  | We’ve put a drain in the gallbladder and we’re done. Sometimes the bravest thing in the room is to stop. |
| `stc_type` |  | Which kind of subtotal? Do we leave the remnant open or close it? |
| `stc_type-o0` | warm | That’s what I do in most cases. More leaks, but most of them close on their own. |
| `stc_type-o1` | warm | Also legitimate. Fewer leaks, but a remnant that can form stones again. |
| `mir_fist` |  | We’ve opened the gallbladder. See that? A hole in the wall of the duct, where the stone was pressing. What now? |
| `mir_fist-o0` | warm | Good. This is exactly the moment. We leave a cuff of gallbladder wall and the HPB surgeon decides how to repair it. |
| `mir_fist-o1` | serious | Wait. Breathe. That isn’t a resident’s repair, and it isn’t mine either. HPB is on the way. |
| `mir_fist-o2` | serious | No. That wall is what will close the duct. We stop. |
| `mir_q` |  | A question while we wait. On the Csendes classification, what type of Mirizzi is this? |
| `mir_q-o0` | serious | In type 1 there’s no hole. Here there is. |
| `mir_q-o1` | warm | Right. A small hole, most of the wall intact. It can be repaired with a cuff of gallbladder. |
| `mir_q-o2` |  | In type 4 there’s no duct left to repair. Here, thankfully, most of the wall is intact. |
| `mir_hpb` |  | The HPB surgeon is here. He’s closing the opening with a cuff of gallbladder wall, over a drain. Well done for stopping. |
| `stc_do` |  | We’ve opened the gallbladder and aspirated it. What do we do with the stones and the cystic duct opening? |
| `stc_do-o0` | warm | Perfect. All the stones out, the opening closed and a drain to be safe. |
| `stc_do-o1` |  | I’d leave a drain. A leak after a subtotal isn’t rare. |
| `stc_do-o2` | serious | Further in where? Into the common bile duct? That’s how you make a duct stone. Take it out. |
| `ff` |  | Fundus down, as far as the neck. And now? |
| `ff-o0` | warm | Exactly. Coming from above doesn’t excuse you from identifying. |
| `ff-o1` | serious | Whatever reaches the neck? The common duct reaches there too. But go on. |
| `open_q` |  | We’ve opened. And still, the triangle is frozen in the open too. What now? |
| `open_q-o0` | warm | Right. That’s exactly what the Tokyo and SAGES guidance says. |
| `open_q-o1` | serious | We’ve opened the abdomen, not the triangle. But go on, slowly. |
| `stuck2` |  | Another twenty minutes. No progress, and the tissue is bleeding. Now? |
| `stuck2-o0` | warm | At last. That’s the right decision, and there’s no shame in it. |
| `stuck2-o1` | serious | No. I’m making the call: we do a subtotal. |
| `stu_cvs` |  | A question for the student. What are the three components of the critical view of safety? |
| `stu_cvs-o0` | warm | Excellent. Three out of three. Remember that when you’re a senior too. |
| `stu_cvs-o1` | serious | We don’t go looking for the common duct. Just two structures entering the gallbladder. |
| `stu_cvs-o2` |  | That’s one. There are two more: a clear triangle and the lower third separated. |
| `n_cvs` |  | The critical view is coming up. What are you getting ready now? |
| `n_cvs-ok` | warm | You’re reading the room. Well done. |
| `n_cvs-m0` | serious | Images. Front and back. A record that stays. |
| `n_cvs-m1` | serious | The cholangiogram set. If they ask for it, there’s no time to go looking. |
| `n_cvs-m2` | serious | Clips. Loaded, in a size that suits the duct. |
| `n_cvs-m3` | serious | And you can call the time out. Anyone in the room can. |
| `n_cvs-m4` | serious | A stapler on the cystic duct isn’t standard in most cases. Clips or an endoloop. |
| `cvs_full` |  | Stop for a moment. Before any clip, what do you see? Tick only what’s really there. |
| `cvs_full-ok` | warm | That’s a critical view. Three out of three, we paused and we photographed. Now you can clip. |
| `cvs_full-m0` | serious | The triangle. Cleared of fat and fibers, and you can see the liver through it. |
| `cvs_full-m1` | serious | The lower third separated from the liver, with the cystic plate in view. That’s the component everyone forgets. |
| `cvs_full-m2` | serious | Two structures, and only two, entering the gallbladder. |
| `cvs_full-m3` | serious | And a pause. The whole team, a few seconds, before you divide a tubular structure. |
| `cvs_full-m4` | serious | And photograph it front and back. That’s documentation, and it also makes you really look. |
| `cvs_full-m5` | serious | You don’t need to expose the common duct. Exposing it only adds to the danger. |
| `cvs_part` |  | Stop for a moment. What do you see now? Tick only what’s really in the picture. |
| `cvs_part-ok` | warm | Right, something’s still missing. The lower third is stuck. Good that you said so. |
| `cvs_part-m0` | serious | You’ve already cleared the triangle. That’s true. |
| `cvs_part-m1` | serious | Look carefully. The lower third is still stuck to the liver. This isn’t a critical view yet. |
| `cvs_part-m2` | serious | You can see two structures. But without the lower third, you can’t be sure there isn’t a third. |
| `cvs_part-m3` | serious | Not yet. Without a full critical view, we don’t stop for clips. |
| `cvs_push` |  | So you’re saying that’s enough? Let’s look again. What do you do? |
| `cvs_push-o0` | warm | Good. Five more minutes of work and now you’re sure. That’s what it feels like. |
| `cvs_push-o1` | warm | Also right. When you’re not sure, you image. |
| `cvs_push-o2` | serious | I don’t feel good about this. But it’s your operation. I’m watching. |
| `cvs_more` |  | Good that you said so. So how do we move forward? |
| `cvs_more-o0` | warm | Yes. A few more minutes and you’ll see everything become clear. |
| `cvs_more-o1` | warm | You can. But it’s better to complete the critical view as well. |
| `cvs_more-o2` | serious | You just told me something’s missing. So why close? |
| `cvs_ok` |  | Now that’s a critical view. Everybody stops, time out. We photograph front and back. |
| `ioc_q` |  | We have a C-arm and ICG in the room. Do we use them? |
| `ioc_q-o0` | warm | Go on, then. A clip on the gallbladder side, a small cut in the duct, the catheter, and we shoot. |
| `ioc_q-o1` | warm | Switching to ICG mode. Look at what’s glowing. |
| `ioc_q-o2` |  | ICG will show ducts, not stones. We’re looking for a stone. |
| `ioc_q-o3` |  | Fine. But after what we saw, I’d have done a cholangiogram. |
| `ioc_q-o4` | serious | And if there’s a stone? We’ll see it tomorrow as jaundice. All right. |
| `ioc_q2` |  | So, a cholangiogram? |
| `ioc_q2-o0` | warm | Go on, then. Catheter and contrast. |
| `ioc_q2-o1` | serious | As you like. We’ll see what the labs say tomorrow. |
| `ioc_anat` |  | There it is. The right posterior duct drains straight into the cystic duct. If we’d divided it, that would have been an injury. |
| `icg_anat` |  | With fluorescence you can see it: the right duct joins the cystic duct. Good thing we didn’t touch it. |
| `icg_clean` |  | Glowing nicely. The cystic duct joins the common bile duct, exactly where we thought. |
| `ab_plan` |  | So where do the clips go on the cystic duct? |
| `ab_plan-o0` | warm | Exactly. That way the right duct keeps draining into the common bile duct. |
| `ab_plan-o1` | serious | Wait. Stop. That way you close the right duct as well. Go higher, right on the gallbladder. |
| `ioc_cbd` |  | See that? A filling defect in the lower part of the duct. A stone. And the contrast isn’t flowing well into the duodenum. |
| `ioc_clean` |  | A nice cholangiogram. The ducts are where they should be and the contrast flows into the duodenum. No stone. |
| `c_cbd` |  | There’s a stone in the duct. What do we do? |
| `c_cbd-o0` | warm | Go on, then. Guidewire, balloon, and let’s see if it comes out. |
| `c_cbd-o1` |  | We don’t have the set in the room. Next time we order it in advance. So, ERCP afterwards. |
| `c_cbd-o2` | warm | Legitimate. I’ll talk to the gastroenterologists now. |
| `c_cbd-o3` | serious | We’ve seen it. We don’t leave a stone we’ve seen. |
| `lcbde` |  | The balloon did the job. The repeat cholangiogram is clear and the contrast flows into the duodenum. Now we close the cystic duct. |
| `gear_clip` |  | Now the clips. What do you ask the scrub nurse for? |
| `gear_clip-ok` | warm | A clip applier. Make sure the jaws cross the whole width, and see the tip behind. |
| `gear_clip-bad` | serious | No. On the cystic duct you put a clip, not something that heats or cuts. |
| `clip_main` |  | How many clips, and where? |
| `clip_main-o0` | warm | Classic. And leave a small stump beyond the clip, so it doesn’t slip. |
| `clip_main-o1` |  | I like two on the side that stays. Belt and braces. |
| `clip_main-o2` |  | More clips isn’t more safety. It’s less room to cut. |
| `clip_wide` |  | The cystic duct is edematous and wide. The clip doesn’t close the whole width. What do we do? |
| `clip_wide-o0` | warm | Good. An endoloop sits nicely on a thick duct. |
| `clip_wide-o1` | warm | If it crosses the whole width, fine. Make sure you see the tip behind. |
| `clip_wide-o2` | serious | That won’t hold. But all right, we’ll see tomorrow. |
| `clip_short` |  | The cystic duct is very short. The lower clip is almost on the common bile duct. What do we do? |
| `clip_short-o0` | warm | Right. You give up the second clip before you give up the common bile duct. |
| `clip_short-o1` | serious | Wait. That way the clip can catch a piece of the common duct. All right, go on, but it’s dangerous. |
| `clip_short-o2` | serious | Hard traction lifts the common duct as well. That’s how it ends up in the clip. |
| `artery` |  | And now the artery. What do you check before you close it? |
| `artery-o0` | warm | Exactly. An artery that enters the gallbladder, two clips on the side that stays, and divide. |
| `artery-o1` | serious | The first one you see isn’t always the only one, and it isn’t always the right one. Look where it goes. |
| `artery-o2` | serious | An artery like that I close with clips. Energy is for small branches. |
| `art2` |  | Wait. Do you see another one? Behind, another small artery going into the gallbladder. What is it? |
| `art2-o0` | warm | Nice. If you hadn’t seen it, it would have bled on us in the middle of the liver bed. |
| `art2-o1` | serious | Nothing that bleeds isn’t nothing. But go on. |
| `cut_gear` |  | Time to divide. What do you want in your hand? |
| `cut_gear-ok` | warm | Scissors. No energy, between the clips, and leave a stump. |
| `cut_gear-bad` | serious | Wait. Stop. Energy next to clips? The heat travels through the metal into the stump. |
| `c_bleed` |  | Wait. Blood. Breathe. What’s the first thing? |
| `c_bleed-o0` | warm | Exactly. Pressure buys time. Now suction, and show me the end of the vessel. |
| `c_bleed-o1` | warm | Right. More hands and good suction. And pressure until we’re ready. |
| `c_bleed-o2` | serious | No. Stop. A blind clip is how the common bile duct gets caught. Pressure first. |
| `c_bleed-o3` | serious | A hook into a pool of blood? You can’t see what you’re burning. Pressure. |
| `n_bleed` |  | There’s bleeding. What do you get ready without being asked? |
| `n_bleed-ok` | warm | Excellent. That’s how a bleed stays small. |
| `n_bleed-m0` | serious | Suction. The first thing they’ll ask for. |
| `n_bleed-m1` | serious | Clips. Loaded and ready in hand. |
| `n_bleed-m2` | serious | A small swab. Pressure from inside. |
| `n_bleed-m3` | serious | An open set. If this doesn’t stop, we open. |
| `n_bleed-m4` | serious | A good scrub nurse doesn’t wait. They get it ready. |
| `crash` |  | Blood pressure eighty. The bleeding isn’t controlled. What now? |
| `crash-o0` | warm | Yes. I’ll press, you open. No panic, one step at a time. |
| `crash-o1` | serious | No. I’m taking this. We open now. |
| `bleed_ok` |  | Quiet now. The bleeding’s stopped. Breathe. Now we carry on, slowly. |
| `bed` |  | We’re taking the gallbladder off the liver. In which plane? |
| `bed-o0` | warm | Good. That way the cystic plate stays intact and the liver doesn’t bleed. |
| `bed-o1` | serious | Too deep. Under the plate is liver, and in the liver there are veins and ducts. |
| `bed-o2` |  | Careful. Too superficial and we’re inside the gallbladder. |
| `c_bleed_bed` |  | Bleeding from the bed. Dark, and from deep. What do we do? |
| `c_bleed_bed-o0` | warm | Good. Something my own boss taught me: pressure, a clock, and no peeking every ten seconds. |
| `c_bleed_bed-o1` | serious | Not blind. Pressure first, then we’ll see what’s there. |
| `c_bleed_bed-o2` | serious | That’s a vein, not a spot. Pressure. |
| `bed_ok` |  | It’s stopped. Sustained pressure works wonders. We carry on in the right plane. |
| `c_perf` |  | The gallbladder’s open. Bile and stones are out. What now? |
| `c_perf-o0` | warm | Right. First you turn off the tap, then you mop the floor. |
| `c_perf-o1` | serious | By the end they’re all over the abdomen. All right, let’s carry on. |
| `c_perf-o2` |  | With a lot of big stones, that’s a fair consideration. Here we managed to collect them from inside. |
| `bed_chk` |  | Before the last cut off the liver, what do we do? |
| `bed_chk-o0` | warm | Yes. Now, while the gallbladder is still holding the liver, is when you see best. |
| `bed_chk-o1` |  | You can, but afterwards the liver drops and you can’t see a thing. Next time, check first. |
| `leak_in` |  | See that? Bile in the bed. Not much, but it’s there. Where from? |
| `leak_in-o0` | warm | Nice. We found it, closed it, and a drain to be safe. |
| `leak_in-o1` |  | A drain will tell us if it carries on. But it’s better to close the source now. |
| `leak_in-o2` | serious | Bile doesn’t go away on its own. All right, we’ll see tomorrow. |
| `leak_in_c` |  | Wait. Bile from the right side of the triangle, next to the cystic duct. Something there has been divided. And it isn’t a small duct. |
| `gear_bag` |  | The gallbladder is free of the liver. How do we get it out? |
| `gear_bag-ok` | warm | A retrieval bag. No surprises in the abdominal wall. |
| `gear_bag-bad` | serious | That’s not how a gallbladder comes out. A bag, or at least a grasper. |
| `gear_bag-alt` |  | You can go without a bag if the gallbladder is intact and healthy. But with a bag there are no surprises. |
| `ext` |  | The gallbladder is in the bag. And what if the stone is big and the gallbladder gets stuck in the port? |
| `ext-o0` | warm | Right. A few more millimeters of incision is nothing next to a gallbladder torn in the wall. |
| `ext-o1` | warm | That works too, as long as the bag stays intact. |
| `ext-o2` | serious | It’s torn. Stones in the wall. Now we pick them out one by one. |
| `n_count` |  | Final count. What do you count and report? |
| `n_count-ok` | warm | The count is correct. We can close. |
| `n_count-m0` | serious | A full count. Instruments, swabs and needles. |
| `n_count-m1` | serious | The clips. How many were fired, so it’s in the report. |
| `n_count-m2` | serious | And if stones were spilled, that goes in the report. Whoever sees an abscess in the future needs to know. |
| `n_count-m3` | serious | The bag comes out with the gallbladder. We don’t leave anything inside. |
| `close` |  | Nearly done. What do we check, and what do we close? |
| `close-o0` | warm | Good. That’s how you finish. No rushing. |
| `close-o1` |  | A routine drain in a case like this doesn’t help. But we won’t fall out over it. |
| `close-o2` | warm | Right. Here a drain has a job to do. |
| `close-o3` | serious | At a ten millimeter port we close the fascia. Otherwise I’ll see it in clinic as a hernia. |
| `stu_po` |  | A question for the student. What’s the most important rule after a cholecystectomy? |
| `stu_po-o0` | warm | Exactly. A complication until proven otherwise. |
| `stu_po-o1` | serious | Pain that’s getting worse isn’t normal. It’s a sign. |
| `stu_po-o2` |  | Not routinely. You check them when the patient isn’t progressing. |
| `po_ok` |  | The day after surgery. Mild pain, eating well, walking in the corridor and normal liver enzymes. What do we do? |
| `po_ok-o0` | warm | Good. Home, and anyone who isn’t better every day comes back to us. |
| `po_ok-o1` |  | What for? Everything’s normal. A hospital bed isn’t a safer place to be. |
| `po_ok-o2` | serious | Simple for us. For the patient, it’s an operation. We explain when to come back. |
| `po_abscess` |  | Six months later. Pain, and an abscess on the right with a stone inside it, left over from the operation. Remember the stones we didn’t collect? |
| `po_hernia` |  | Three months later, in clinic. A bulge at the umbilicus, at the port where we didn’t close the fascia. A small hernia. |
| `po_leak` |  | Day two. Fever, pain under the right ribs and a collection on ultrasound. What are you thinking? |
| `po_leak-o0` | warm | Yes. Now the question is how we treat it. |
| `po_leak-o1` | serious | With a fever? I’m thinking bile. Let’s check. |
| `po_thermal` |  | A week later, back in the emergency department. Fever and pain, and the scan shows a bile collection. In the operation everything looked fine. What happened? |
| `po_thermal-o0` | warm | Yes. The heat did its work slowly. Now we treat it. |
| `po_thermal-o1` | serious | A bile collection isn’t a wound. It’s what the hook left behind. |
| `leak_tx` |  | So how do we treat it? |
| `leak_tx-o0` | warm | Exactly. For most simple leaks that’s all you need. |
| `leak_tx-o1` | warm | Good thinking. First you know what’s there, then you treat it. |
| `leak_tx-o2` |  | If unstable or peritonitic, yes. Here the patient is stable, so we start with something less invasive. |
| `leak_tx-o3` | serious | Antibiotics don’t drain bile. Drainage and ERCP. |
| `leak_ok` |  | At ERCP: a leak from the cystic duct stump, Strasberg A. A stent, and two days later the drain is dry. We came out of that well. |
| `leak_c` |  | At ERCP the stump is closed. The bile is coming from an aberrant right duct that was divided, and it doesn’t show on the cholangiogram. This isn’t an A. |
| `po_jaund` |  | Day three. Worsening jaundice and hardly any pain. What do you suspect? |
| `po_jaund-o0` | warm | Yes. And this is the hardest moment in surgery. We talk to the family, honestly. |
| `po_jaund-o1` |  | MRCP first. With a complete injury the ERCP won’t get through, and it only causes delay. |
| `po_jaund-o2` | serious | No. Jaundice after a cholecystectomy is an injury until proven otherwise. |
| `po_bowel` |  | The day after. Heart rate one eighteen, a distended abdomen and more pain than an operation like this should give. What are you thinking? |
| `po_bowel-o0` | warm | Yes. And don’t wait until morning. |
| `po_bowel-o1` | serious | A heart rate of one eighteen isn’t ordinary pain. I’m ordering a CT. |
| `po_bowel-o2` | serious | Antibiotics don’t close a hole. |
| `bowel_po` |  | On CT, free air and fluid. In the OR: a small hole in the bowel. Suture and washout. It’ll be all right in the end, but it could have gone very differently. |
| `po_cbd` |  | Day two. Pain, mild jaundice and rising liver tests. What happened? |
| `po_cbd-o0` | warm | Right. ERCP today. |
| `po_cbd-o1` |  | There’s no collection. This fits a stone better. |
| `po_cbd-o2` | serious | And wait for cholangitis? No. |
| `cbd_po` |  | At ERCP they took out a six millimeter stone. That’s exactly what a cholangiogram at surgery would have saved. |
| `po_ccy` |  | The drain in the gallbladder did the job. In a few weeks, once the inflammation settles, we’ll think about an interval cholecystectomy. |
| `c_bdi` |  | Wait. Stop. Hands up. We don’t cut or close anything else. We have a bile duct injury. |
| `c_bdi-o0` | warm | Right. Breathe. We don’t fix this now on our own. |
| `c_bdi-o1` | serious | No. A poor first repair ruins the chances of the next one. |
| `c_bdi-o2` | serious | Another clip is another injury. Hands up. |
| `n_bdi` |  | What are you getting ready now? |
| `n_bdi-ok` | warm | Good. That’s how a room behaves in a hard moment. |
| `n_bdi-m0` | serious | A drain. We almost always leave one next to the injury. |
| `n_bdi-m1` | serious | HPB. Someone calls now. |
| `n_bdi-m2` | serious | A cholangiogram. Sometimes they want to define the injury before the transfer. |
| `n_bdi-m3` | serious | We don’t hurry. Calm and order. |
| `bdi2` |  | The HPB surgeon is at another hospital. There’s nobody here who can repair it. What do we do? |
| `bdi2-o0` | warm | Right. A drain, an accurate operation note and a conversation with the center. They’ll decide on the timing. |
| `bdi2-o1` | serious | No. I’m not touching it and neither are you. A drain, and we transfer. |
| `bdi2-o2` |  | Important, and the center that repairs it will do that. For now, a drain and transfer. |
| `stras_b` |  | A question to wrap up. On the Strasberg classification, what type of injury is this? |
| `stras_b-o1` | warm | Right. B. Sometimes it only shows up years later, when part of the liver atrophies. |
| `stras_c` |  | A question to wrap up. On the Strasberg classification, what type of injury is this? |
| `stras_c-o2` | warm | Right. C. It leaks bile, and you don’t see it at ERCP because it’s cut off from the tree. |
| `stras_d` |  | A question to wrap up. On the Strasberg classification, what type of injury is this? |
| `stras_d-o1` | warm | Right. D. The duct is in continuity, but with a hole in the wall. The repair depends on the size. |
| `stras_e` |  | A question to wrap up. On the Strasberg classification, what type of injury is this? |
| `stras_e-o2` | warm | Right. E, and the level decides the number after the E. That’s what the center will look at. |
