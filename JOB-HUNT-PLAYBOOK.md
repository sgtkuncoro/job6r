# The Software Engineer Job-Hunt Playbook

> A step-by-step system for getting interviews and getting hired as a software
> engineer — distilled from two talks by **Listiarso Wastuargo ("Gogo")**:
> VP of Engineering at an Indonesian Series-C e-grocery (grew the team 7 → 125),
> ex-Facebook engineer (Silicon Valley), professional interview coach with
> 1000+ interviews conducted and an **80% success rate** placing coached
> candidates into FAANG.
>
> Source: `init/video1.md` (the interview pipeline & what companies want) and
> `init/video2.md` ("Cara dapet interview kerja edisi 2023" — marketing yourself).

---

## How to use this playbook

The hard part of job hunting is **not passing the interview — it's getting the
interview in the first place.** Gogo's whole thesis: candidates obsess over
LeetCode while neglecting the funnel that actually decides whether anyone ever
looks at them.

So this playbook is ordered by **leverage**, not by chronology:

1. **The mental model** — what companies are actually buying.
2. **The funnel** — it's a numbers game; design for volume.
3. **The CV** — your "bullet" (single highest-leverage artifact).
4. **LinkedIn & marketing** — get discovered.
5. **Outreach** — go straight to the hiring manager.
6. **The interview pipeline** — stage by stage, with prep resources.
7. **Salary & negotiation** — don't waste anyone's time.
8. **AI assist (Claude)** — automate the grind.
9. **Checklists & tracker** — run the system.

Work top-to-bottom the first time. After that, the checklists in Part 9 are your
daily driver.

---

## Part 0 — The mental model: what companies actually test

Every interview, no matter the company, is probing for exactly **three things**:

| Skill | Plain-English question | How it's tested |
|---|---|---|
| **Micro-skill** | "Can you actually code the thing in front of you?" | Live coding, debugging, code review, take-home, algorithms & data structures |
| **Macro-skill** | "Can you *think* — break a big problem down and design a solution?" | System design ("design Twitter"), open-ended problem solving |
| **Soft-skill** | "Can you work with the team we already have?" | Behavioral questions, HR screen, the overall vibe |

Key insight from Gogo: **the more senior you get, the more it's about humans and
less about computers.** Soft skill is *not* a tie-breaker — at senior+ levels it
is often the deciding factor. Don't treat the HR/behavioral rounds as
formalities. (Gogo himself was *rejected at the HR stage* of a process because
the HR person didn't believe a VP of Engineering still codes — before he was ever
given a chance to prove it.)

**Implication:** an interview is the company trying to extract a signal about
these three skills. Your job at every stage is to make that signal *loud and
unambiguous.*

---

## Part 1 — The funnel: it's a numbers game

The single most important emotional reframe: **rejection is not a verdict on your
worth.** A typical resume converts at roughly **5%** — out of 100 applications,
maybe 5 recruiters actually read it and you get a handful of interviews, and from
those maybe one offer.

> Gogo's own CV converted at **>50% (10× better than typical)** — 18 interviews
> from 3 companies he sent it to. Part 3 shows exactly why.

Plan your volume accordingly:

```
        ~200 applications  (across all sources)
                 │  ~5% (typical) … ~50% (great CV)
                 ▼
           interviews
                 │
                 ▼
            offers (often just 1)
```

Rules of the numbers game:
- **Apply early and apply a lot.** You won't hear back from most. Volume is the
  point.
- A rejection might just mean "not a fit," or even "you emailed on a Friday."
  **Email on Monday or Tuesday** — Friday emails get buried over the weekend and
  never get seen.
- Pull from **many sources** in parallel (see Parts 4–5). Don't rely on one.
- **Don't get discouraged.** From 200 applications you might land one offer.
  Keep trying, keep applying, keep marketing yourself.

### Expected timeline (zero → offer): ~4–8 months

| Phase | Duration | What you do |
|---|---|---|
| Learn fundamentals | 3–6 months | Only if you don't yet know SE fundamentals (algorithms, data structures, how systems fit together) |
| Polish + start applying | 1–3 months | Build the CV, set up LinkedIn, start sending — overlap this with the next phase |
| Interview & screen loop | 1–3 months | Coding screens, system design, behavioral, until you're confident and land an offer |

Don't wait until you feel "ready" to apply — you may never get a reply anyway, so
start sending while you polish.

---

## Part 2 — The CV that converts at 50%

The CV is your "bullet" — the thing you spray everywhere so people can see your
profile. **Even if you have an inside referral, you still need a great CV.**

### Structure & order (top to bottom)

1. **Name + contact block** — name, location, phone, email, links (so people can
   actually reach you). Recruiters need a way to contact you; if it's missing,
   you're invisible.
2. **Work experience FIRST.** Always lead with experience. Do *not* lead with
   education or projects — those are not what gets you hired.
   - No experience yet? Go get *some* — internship, unpaid internship, anything.
     Experience is the most important thing; education "not so much."
3. **Education** — after experience.
4. **Awards / extras** — last.

### Links worth including
- LinkedIn profile
- GitHub / GitLab
- YouTube (if you make content)
- A newsletter or blog (Gogo's most relevant link when job hunting) — keep it
  substantive, not noise.

### The title trick (important)

Recruiters are the first humans to read your CV, and they skim for **seniority
signals.** At many companies *everyone* has the literal title "Software Engineer"
(Facebook: L3 → L10 are all "Software Engineer"). So **write the title that
communicates your real level**, e.g. "Senior Software Engineer," "Staff
Software Engineer." If the company actually gave you "Senior Engineer," use it.

> Rule: **higher (but accurate) is better.** This is how you signal "I've been
> promoted multiple times" without saying it. Don't fabricate a level you never
> reached — it gets caught in behavioral/reference checks.

### Company context (critical for international applications)

Outside Indonesia, nobody knows what Gojek or Traveloka is. **Give every company
one line of context** so a foreign recruiter can place you:

- What it does: *"Indonesia's largest e-grocery"*
- Stage / funding: *"Series C, $140M raised"*
- Credibility markers: *"YCombinator-backed,"* *"backed by Andreessen Horowitz / Sequoia"*

This lets the recruiter map your background to a known standard: "Oh, a16z
invested — so the bar there was high."

### The bullet formula: **Verb + Impact + How** (+ Tech)

This is *the* CV trick. Every experience bullet should be:

> **[Strong verb] + [quantified impact] + [how you did it] + [tech stack]**

Compare:

| Quality | Bullet |
|---|---|
| ❌ Weak | "Made GoPay." |
| 🟡 Okay | "Made GoPay using Golang." |
| ✅ Strong | "**Increased** Gojek revenue **by 10%** **by building** GoPay, **implemented in Golang**." |

Breakdown of the strong version:
- **Verb (and be *boastful*):** `Increased`, `Led`, `Architected`, `Implemented`,
  `Drove`, `Grew`, `Shipped`. Avoid limp verbs like "helped," "collaborated,"
  "managed" (alone), "worked on." As Gogo puts it — **be arrogant here.** This is
  culturally hard for many (he calls out the Indonesian/Javanese habit of being
  modest); do it anyway.
- **Impact (quantified):** `10% revenue`, `grew the team 7 → 125`, `cut latency
  40%`. Numbers > adjectives.
- **How:** what you actually did — `by building the payment settlement service`.
- **Tech stack:** include it when you can (`Golang`, `React`, `Java`). Recruiters
  **search by keyword** — "find me someone who's done Golang" — and the tech in
  your bullet is how your name surfaces.

Also remember to state **how long** you were at each role.

### The skills section (keyword search)

Add a skills section (and on LinkedIn, attach skills to each experience item).
Two reasons:
1. It looks better visually.
2. Recruiters literally search "React engineers" — the skills field is what makes
   you appear in those results.

### Fast way to start a resume
Open LinkedIn → your profile → **More → Build a resume.** It auto-populates from
your existing profile and gives you a downloadable starting point. (So: get
LinkedIn right first — Part 3 — and the resume partly writes itself.)

---

## Part 3 — LinkedIn & marketing yourself

> "No matter how good you are at coding, system design, or talking — it's useless
> if you can't sell yourself, because you won't get *discovered.*"

### Build a strong profile
- A great photo, headline, and summary.
- **Caveat:** Gogo's *own* profile is deliberately "messy/fun" because he's
  *hiring*, not job-hunting — he wants to attract like-minded, relaxed people.
  **If you're job hunting, keep yours more serious/professional.** Don't copy a
  hiring manager's playful profile.

### The location trick (for remote / higher pay)
Recruiters and search filters key heavily on location. So:
- **Set your location to the nearest big metropolis where the money is**, not your
  actual town. In Indonesia → **Jakarta**. Targeting Singapore → set Singapore.
  Targeting the US → set **San Francisco**.
- Then, once a recruiter contacts you, just say: *"By the way, I'd like to work
  remotely from [your city] — is that okay?"* If no, move on; if yes, you've
  unlocked metro-level (often US) pay while living elsewhere. Gogo landed a
  **US-paying remote job** this exact way (remote pay is often **5–10× local**).

### Skills section
Fill it out completely — it's how you show up in recruiter searches (see Part 2).

### "Open to Work"
Turn it on when hunting. Tip: set it to **"Recruiters only"** so the green
banner is visible only to recruiters, not your whole network — avoids drama with
your current employer and nosy contacts. (A current-company recruiter *might*
still see it and tell your manager, but that's unlikely.)

### Follow your target companies
If you follow a company you want to apply to, that company's recruiters are
**more likely to have your name surface** when they search. Follow first, then
apply/reach out.

### Posting & online presence (raise your "marketing value")
- Post occasionally on LinkedIn — **little and often**, not spammy. (Funny
  observation from Gogo: his *serious* posts get more likes than his joke posts.)
- Build a presence elsewhere: **Twitter/X, a YouTube channel, a newsletter.** When
  a recruiter has read your resume and wants to know "is this person legit / do
  they have thought leadership?", they'll look you up — give them good content to
  find.
- **Open source (OSS) contributions** raise your hire-ability a lot (proof you can
  contribute to a real codebase). *But* Gogo personally doesn't recommend it as a
  primary tactic: very high time investment, uncertain return.

---

## Part 4 — Outreach: go to the hiring manager, not the recruiter

The order of channels, **best to worst**:

### 1. ⭐ Message the Hiring Manager directly (highest leverage)
The hiring manager for an engineering role is usually the **Head of Engineering /
Engineering Director / VP of Engineering** — *not* an "Engineering Manager"
(EMs often lack the authority/power; talk to them and your resume just gets
forwarded). When you reach the actual decision-maker:
- They rarely get direct resumes, so they're often *happy* to hear from you.
- They can say "let's talk" on the spot — your direct shot at an interview.

**How:** LinkedIn search → e.g. `"Head of Engineering" at Grab` → Connect →
Message. Don't agonize over the message — you can even have **ChatGPT/Claude
draft it** (see Part 8). It's "very easy, very automatable."

### 2. Head hunters / recruiters (great, and free to you)
- A head hunter is **paid by the company** (typically **20–30% of your first-year
  salary**), *never* by you. So their incentive is aligned with getting you the
  **highest-paying** role possible.
- Be nice, but **negotiate up front**: "Thanks for reaching out — I'm looking for
  $X; if that doesn't work, let's not waste each other's time." Don't do a full
  interview loop for a number you'd never accept.

### 3. Referrals
Ask your network. Still pair it with a strong CV.

### 4. Job portals (lowest priority)
Company career pages (Google Careers, Gojek/careers), and remote-job boards.
Conversion is usually low and competition is huge — but for **remote** roles these
boards are where US-budget pay shows up, so still worth a batch of applications.

### Recruiter-email folder (the long game)
When recruiters cold-email you while you're *not* looking ("want to work at
Google/Gojek/some random company?"):
- **Don't delete.** Reply politely: *"Thank you — not looking right now, but I
  appreciate it."*
- **Label + archive** them in a dedicated folder.
- Later, when you *are* looking, reopen that folder and email them all. Even if
  they've moved companies, they're probably still recruiters and can say "I'm at
  Lyft now — want a role here?" A warm pipeline you built for free.

---

## Part 5 — The interview pipeline, stage by stage

Chronological order of a typical SE loop (exact composition varies by **level** —
intern vs junior vs senior vs staff vs manager all differ):

### Stage 1 — HR interview (do NOT underestimate)
A *real* interview, not a formality. They check:
1. **CV ↔ role match** (e.g. you do PHP, they want Golang — some are flexible on
   stack if fundamentals are strong, many are not).
2. **Salary expectations** — too high for the level → rejected; too low → you lose
   money. (Negotiation gets its own treatment in Part 7.)
3. **Visa** — if working abroad (esp. US right now), this is a real blocker.
4. **Culture fit** — do you actually want *this* company, or spray-and-pray?
5. **BS check** — did *you* build the project you claim, or are you retelling a
   teammate's work? HR has screened many people and has a finely-tuned "is this
   person real?" radar.
6. (Indonesia-specific oddity) **psikotes / psychometric test** — common locally,
   rare abroad; purpose unclear, but be ready for it.

**Be genuinely kind and serious with HR.** They are not "lower than" engineers.
Gogo failed an HR round himself — it matters.

### Stage 2 — Screening (usually automated)
Popular companies get thousands of applications/day; engineers can't interview
full-time, so an **automated test** filters. Typically HackerRank / Codility-style,
or even front-end tasks now (Gogo's recent example: *build a React stopwatch
component that passes provided unit tests*).
- Limitation: automation can't fully catch copy-pasting.
- **Don't copy-paste solutions** — you'll be re-tested live and exposed. Don't
  waste your time or the hiring manager's.

### Stage 3 — Coding (two kinds)
1. **Algorithms & data structures.** "But we never use this day-to-day!" — true,
   and here's *why companies still test it*:
   - **Fundamentals = the foundation of a house.** If the base is solid, you can
     swap the surface (frameworks, tools) easily. SE moves *fast* (AI, front-end
     churn); people anchored to one tool without fundamentals can't keep up — and
     that's exactly what companies fear.
   - This is why **bootcamp grads / pure autodidacts can struggle**: they often
     learn tools-first, skipping fundamentals. Fixable — just go learn them.
   - **Resources:**
     - **LeetCode** — the standard grind.
     - **[tlx.toki.id](https://tlx.toki.id)** — built by Indonesia's Olympiad in
       Informatics team; free, structured, beginner → advanced algorithms & data
       structures.
2. **Role-relevant coding.** Front-end → React, JavaScript closures/scoping, etc.
   Checks you've *actually* done the work. Usually more enjoyable because it maps
   to your day-to-day.

### Stage 4 — System design (e.g. "Design Twitter")
A **two-way discussion**, not a monologue. Expected flow:
1. **Gather requirements.** Which part of Twitter — news feed? composer?
   like/follow? sharing? display? Scope it together.
2. **Design end-to-end:** front-end → which APIs → which services → which database
   (in-memory? SQL? NoSQL?) → data schema. Trace the whole path.
3. **⭐ Trade-offs are the most important part.** Don't propose *one* solution —
   propose **multiple** and weigh them. For the DB, consider in-memory vs
   time-series vs SQL vs NoSQL and explain pros/cons. Experienced engineers know
   **every tool has trade-offs**; there's no universally "best" tool, only the
   right tool for a specific use case. Showing this judgment is the signal.

### Stage 5 — Behavioral
Hugely company-dependent — a "customer-obsessed" company asks different things
than one valuing "frugality," "integrity," or "growth." Two question types:
1. **Past experience:** "Tell me about a time you worked on a project with 3+
   people / had a conflict / shipped under deadline."
2. **Hypothetical:** "What would you do if your PM were being unreasonable about
   a deadline?"

Prepare stories for both. **Best resource Gogo recommends:** a specific YouTube
video/channel on *how to structure behavioral answers* — search for guidance on
answering behavioral questions well (STAR-style structuring), and practice
out loud.

---

## Part 6 — Salary & negotiation (the short version)

- **Know your number before you talk.** Tell head hunters/recruiters your target
  early; if they can't meet it, don't burn a full loop ("Let's stop talking" —
  politely).
- **Remote-from-cheaper-location + metro-pay** is the biggest lever (Part 3's
  location trick): US budget, local cost of living = 5–10× effective pay.
- The market context (per the videos): **tech recession / layoffs** mean supply is
  high and companies can pay less — yet a strong, well-marketed candidate still
  commands top offers (Gogo cites a **$500K–$700K total annual comp** US offer he
  received *during* the downturn). Don't let "the market is bad" stop you;
  let it sharpen your marketing.
- A dedicated negotiation deep-dive is its own topic — when in doubt, **counter,
  and never accept the first number without a counter.**

---

## Part 7 — The condensed action system

Put together, the whole system in one screen:

```
GET DISCOVERED                 GET THE INTERVIEW              PASS THE INTERVIEW
──────────────                 ─────────────────             ──────────────────
• 50%-CV (Verb+Impact+How)     • DM Hiring Manager (Head/    • HR: be real, kind,
• LinkedIn: title, skills,       Director of Eng) FIRST        know your number
  location-trick, Open-to-Work • Head hunters (free to you)  • Screen: no copy-paste
• Follow target companies      • Referrals                   • Coding: LeetCode +
• Online presence (posts,      • Recruiter-email folder        tlx.toki.id, + role
  newsletter, OSS-optional)      (warm pipeline)               tech (React/JS/…)
                               • Job portals (last, but      • System design:
  ↑ raise marketing value        best for remote $$)           TRADE-OFFS, multi-soln
                                                              • Behavioral: STAR
                               ~200 apps → ~5–50% → offers     stories, both types

                          IT'S A NUMBERS GAME — keep applying,
                          email Mon/Tue, don't take rejection personally.
```

---

## Part 8 — AI assist with Claude

The repetitive parts of this system — writing **Verb+Impact+How** bullets,
drafting **hiring-manager outreach**, and rehearsing **behavioral answers** — are
exactly what an LLM is good at. Below are copy-paste prompts plus a small
reference script (`ai-assist/`).

> Setup: `pip install anthropic` and set `ANTHROPIC_API_KEY`. The reference
> script uses the latest model (`claude-opus-4-8`) with **prompt caching** on the
> playbook context so repeated calls are cheap. Swap to `claude-sonnet-4-6` for
> faster/cheaper drafts.

### Prompt 1 — Turn raw experience into Verb+Impact+How bullets
```
You are a resume coach. Rewrite each raw note below into a CV bullet using the
exact formula: [strong/boastful verb] + [quantified impact] + [how] + [tech stack].
Rules: lead with a strong verb (Increased/Led/Architected/Shipped — never
"helped/worked on"); quantify impact (%, counts, $, scale); name the tech so it's
keyword-searchable; one line each; do not invent numbers — if a metric is missing,
mark it [QUANTIFY: ...] so I can fill it in.

Raw notes:
- <e.g. built the payments feature at Gojek>
- <e.g. led the team that grew>
```

### Prompt 2 — Add company context for international recruiters
```
For each company below, write ONE context line a foreign recruiter would
understand: what it does + stage/funding + a credibility marker (top investor /
YC / scale). Keep under 15 words.

Companies: <Gojek>, <Traveloka>, <your company>
```

### Prompt 3 — Cold message to a hiring manager
```
Write a short, warm LinkedIn message (<80 words) to a Head of Engineering at
<COMPANY>. I'm a <LEVEL> engineer (<KEY SKILLS>) targeting <ROLE>. Goal: a quick
intro chat / interview. Confident but not pushy, specific to their company, no
generic flattery. Give me 2 variants.
```

### Prompt 4 — Behavioral story builder (STAR)
```
Interview me to build a STAR-structured behavioral story for the prompt:
"<Tell me about a time you ...>". Ask me one question at a time to extract
Situation, Task, Action, Result (with a metric). Then output the polished
60–90 second spoken answer.
```

### Prompt 5 — System-design trade-off drill
```
Quiz me on system design for "<Design X>". Push me to (1) gather requirements
first, (2) sketch front-end → API → service → DB end to end, and (3) for every
component, name at least TWO options and their trade-offs. Point out where I
proposed only one solution.
```

See `ai-assist/prompts.md` for these prompts and
`ai-assist/generate_cv_bullets.py` for a runnable bullet-generator.

---

## Part 9 — Checklists & tracker

### CV checklist
- [ ] Contact block complete (name, location, phone, email, links)
- [ ] **Experience first**, then education, then awards
- [ ] Title reflects real seniority (higher-but-accurate)
- [ ] One **context line** per company (what / stage / investor)
- [ ] Every bullet = **Verb + Impact + How (+ Tech)**, boastful verbs, numbers
- [ ] Duration shown for each role
- [ ] **Skills section** filled (keyword-searchable)
- [ ] Pass-rate target: aim well above the 5% baseline

### LinkedIn checklist
- [ ] Professional photo + headline + summary (serious if hunting)
- [ ] Location set to nearest **metropolis with the money**
- [ ] Skills attached to each experience item
- [ ] **Open to Work** → "Recruiters only"
- [ ] Following all target companies
- [ ] Posting little-and-often; profile links to your content

### Outreach cadence (weekly)
- [ ] Identify 5–10 target companies; **follow** each
- [ ] For each: find the **Head/Director of Engineering**, send a DM (Part 8 P3)
- [ ] Reply to / mine the **recruiter-email folder**
- [ ] Batch-apply via portals (remote boards for US pay)
- [ ] **Send emails Mon/Tue**, never Friday
- [ ] Log everything (tracker below)

### Application tracker template (CSV)
Create `tracker.csv`:
```csv
date,company,context,role,channel,hiring_manager,stage,salary_target,status,next_action,notes
2026-06-04,Grab,"SEA super-app, public",Senior BE,HM-DM,"Jane Doe (Head of Eng)",applied,$X,waiting,follow up Mon,
```
- `channel`: HM-DM | head-hunter | referral | portal | recruiter-folder
- `stage`: applied → HR → screen → coding → sys-design → behavioral → offer
- Review weekly. Target ~200 rows over the hunt. Expect mostly rejections — the
  one offer is hiding in the volume.

---

## TL;DR — the 10 tricks

1. Companies buy **micro + macro + soft skill**; senior = mostly soft skill.
2. It's a **numbers game** — ~200 apps, email Mon/Tue, don't take "no" personally.
3. CV bullets = **Verb + Impact + How + Tech**, and be *boastful*.
4. **Experience first**, give every company a **context line**, inflate-but-accurate **titles**.
5. **Skills section** = recruiter keyword search = you get found.
6. **Location trick**: list the metropolis, negotiate remote after contact → metro pay.
7. **Open to Work (recruiters-only)** + **follow** target companies to surface in searches.
8. **DM the Head/Director of Engineering directly** — skip powerless EMs and slow portals.
9. **Head hunters are free to you** and motivated to maximize your salary.
10. Keep a **recruiter-email folder** as a warm pipeline for when you're ready.
