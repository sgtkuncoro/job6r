# Claude prompts for the job hunt

Copy-paste these into Claude (claude.ai, the API, or the runnable script in this
folder). They operationalize the tricks in `../JOB-HUNT-PLAYBOOK.md`.

---

## 1. Raw experience → Verb + Impact + How bullets
```
You are a resume coach. Rewrite each raw note below into a CV bullet using the
exact formula: [strong/boastful verb] + [quantified impact] + [how] + [tech stack].
Rules: lead with a strong verb (Increased/Led/Architected/Shipped — never
"helped/worked on"); quantify impact (%, counts, $, scale); name the tech so it's
keyword-searchable; one line each; do not invent numbers — if a metric is missing,
mark it [QUANTIFY: ...] so I can fill it in.

Raw notes:
- <e.g. built the payments feature at Gojek>
- <e.g. led the team that grew from 7 to 125>
```

## 2. Company context line for international recruiters
```
For each company below, write ONE context line a foreign recruiter would
understand: what it does + stage/funding + a credibility marker (top investor /
YC / scale). Keep under 15 words.

Companies: <Gojek>, <Traveloka>, <your company>
```

## 3. Cold message to a hiring manager (Head/Director of Engineering)
```
Write a short, warm LinkedIn message (<80 words) to a Head of Engineering at
<COMPANY>. I'm a <LEVEL> engineer (<KEY SKILLS>) targeting <ROLE>. Goal: a quick
intro chat / interview. Confident but not pushy, specific to their company, no
generic flattery. Give me 2 variants.
```

## 4. Behavioral story builder (STAR)
```
Interview me to build a STAR-structured behavioral story for the prompt:
"<Tell me about a time you ...>". Ask me one question at a time to extract
Situation, Task, Action, Result (with a metric). Then output the polished
60–90 second spoken answer.
```

## 5. System-design trade-off drill
```
Quiz me on system design for "<Design X>". Push me to (1) gather requirements
first, (2) sketch front-end → API → service → DB end to end, and (3) for every
component, name at least TWO options and their trade-offs. Point out where I
proposed only one solution.
```

## 6. Salary-target reply to a recruiter / head hunter
```
Draft a polite reply to a recruiter who reached out. Thank them, state my target
total comp is <$X>, and say that if the budget can't reach it we shouldn't both
waste time — but stay friendly and leave the door open. Under 70 words.
```

## 7. Recruiter-folder reactivation (when you start hunting)
```
Write a warm re-introduction email to a recruiter who contacted me ~<N> months
ago. Remind them we connected, say I'm now exploring opportunities, and ask if
they (or their current company) have relevant <ROLE> openings. Under 90 words.
```

## 8. Fix a whole CV (paste-into-Claude version of `cv_doctor.py`)
Attach your CV PDF to the chat (claude.ai supports PDF upload), then paste this.
The script `cv_doctor.py` automates the exact same thing.
```
You are an elite software-engineering resume coach. Analyze the attached CV PDF
and rewrite it into a ready-to-use CV following these rules, then document every
change.

Rules:
1. Order: contact block -> work experience FIRST -> education -> skills -> awards.
2. Contact block complete (name, location, phone, email, links). Flag gaps as [VERIFY: ...].
3. Titles communicate REAL seniority (higher-but-accurate); never fabricate a level.
4. Every company gets ONE context line: what it does + stage/funding + credibility
   marker. If you don't know, write [VERIFY: company context] — never invent facts.
5. Every experience bullet = [strong boastful verb] + [quantified impact] + [how] +
   [tech stack]. No weak verbs ("helped", "worked on", "responsible for").
6. Show duration for each role.
7. Add a keyword-rich skills section.
8. NEVER invent numbers or facts. Missing metric -> [QUANTIFY: ...]; missing fact -> [VERIFY: ...].

Output TWO things, clearly separated:
A) The corrected, ready-to-use CV in clean markdown.
B) A correction report with: an overview, a playbook-checklist table (rule | before |
   after | status), section-by-section fixes, a bullet before->after table, and a
   checklist of every [QUANTIFY:]/[VERIFY:] item I need to fill in.
```
