# j6rai — Software Engineer Job-Hunt System

A job-hunting playbook + AI helpers, extracted from two talks by Listiarso
Wastuargo ("Gogo") on how to get interviews and get hired as a software engineer.

## Contents

| File | What it is |
|---|---|
| [`JOB-HUNT-PLAYBOOK.md`](JOB-HUNT-PLAYBOOK.md) | **Start here.** The full step-by-step system: mental model, CV formula, LinkedIn/marketing, hiring-manager outreach, the interview pipeline, salary, checklists, and a tracker template. |
| [`ai-assist/prompts.md`](ai-assist/prompts.md) | Copy-paste Claude prompts for CV bullets, outreach, behavioral (STAR) prep, system-design drills, and recruiter replies. |
| [`ai-assist/generate_cv_bullets.py`](ai-assist/generate_cv_bullets.py) | Runnable script that turns raw experience notes into **Verb + Impact + How** CV bullets via Groq. |
| [`ai-assist/cv_doctor.py`](ai-assist/cv_doctor.py) | Runnable script that reads a **PDF CV**, rewrites it to the playbook, and writes two markdown files: a ready-to-use corrected CV + a detailed correction report. |
| [`issues_cv/`](issues_cv/) → [`resolved_cv/`](resolved_cv/) | Drop a CV PDF in `issues_cv/`; `cv_doctor.py` writes the fixed CV + report into `resolved_cv/`. |
| [`job6r.app/`](job6r.app/) | **Markdown to PDF web tool.** A Turborepo monorepo; its `apps/mdtopdf` TanStack Start app converts Markdown into an ATS-friendly PDF (real selectable text). Live: <https://mdtopdf-job6r.sigit-kunc.workers.dev>. See [its README](job6r.app/README.md). |
| [`init/`](init/) | Source transcripts (`video1.md`, `video2.md`). |

## The whole system in 10 tricks

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

## Using the AI helper

### Setup (once)

```bash
pip install -r requirements.txt      # installs the groq SDK + pypdf
cp .env.example .env                 # then put your real key in .env
```

The scripts are powered by **Groq** (fast, free tier). `.env` holds
`GROQ_API_KEY` (and an optional `MODEL`) — get a free key at
<https://console.groq.com/keys>. Both scripts auto-load `.env`, so you don't need
to `export` anything. `.env` is gitignored so your key is never committed. (You
can still `export GROQ_API_KEY=...` instead if you prefer; a real shell variable
wins over `.env`.)

```bash
# one raw note per line
python ai-assist/generate_cv_bullets.py notes.txt
# or pipe:
echo "built the payments feature at Gojek" | python ai-assist/generate_cv_bullets.py
```

### Fix a whole PDF CV

```bash
# (after the one-time setup above)
# reads the PDF, writes resolved_cv/Profile.corrected.md + resolved_cv/Profile.corrections.md
python ai-assist/cv_doctor.py issues_cv/Profile.pdf

# optional: add target role + real facts the PDF can't show (avoids invented numbers)
python ai-assist/cv_doctor.py issues_cv/Profile.pdf \
  --target "Senior Backend Engineer (remote, US)" \
  --notes "Gojek = Indonesia's largest super-app; I led GoPay settlement, cut reconciliation ~40%."
```

`cv_doctor.py` extracts the PDF text locally (via `pypdf`) and sends it to Groq
with the playbook as the system prompt, then writes two markdown files: the
**corrected, ready-to-use CV** and a **part-by-part correction report** (playbook
checklist, section-by-section fixes, bullet before→after, and a list of
`[QUANTIFY:]`/`[VERIFY:]` items for you to fill in). No API key? Use Prompt 8 in
[`ai-assist/prompts.md`](ai-assist/prompts.md) to do the same by pasting into any
chat LLM.

Default model is `llama-3.3-70b-versatile`. Set `MODEL=...` for a stronger or
different model (e.g. `MODEL=openai/gpt-oss-120b` or
`MODEL=moonshotai/kimi-k2-instruct`); see
<https://console.groq.com/docs/models>.

## Turn your Markdown CV into a PDF: [`job6r.app/`](job6r.app/)

**Live app: <https://mdtopdf-job6r.sigit-kunc.workers.dev>** (or run it locally below).

`cv_doctor.py` gives you a clean **Markdown** CV. [`job6r.app/`](job6r.app/)
is a **Turborepo** monorepo of small web apps under the `job6r.app` umbrella; its
first app, `apps/mdtopdf`, is the companion **Markdown to PDF** web tool that
turns that Markdown into an **ATS-friendly PDF**: real, selectable text via
`@react-pdf/renderer` (no rasterized images, no Chromium), single-column layout
with standard headings that ATS parsers read reliably.

The monorepo:

- **`apps/mdtopdf/`**: a **TanStack Start** app. Edit Markdown on the left, watch
  the live preview on the right, click **Download PDF**.
- **`packages/md2pdf/`** (`@job6r/md2pdf`): the shared library with
  `parseMarkdown()`, `markdownToHtml()` (preview), and `renderResumePdfBlob()`
  (PDF download).

Run it locally:

```bash
cd job6r.app
pnpm install
pnpm dev            # http://localhost:3000
```

Typical flow: run `cv_doctor.py` on your PDF → copy the corrected Markdown from
`resolved_cv/Profile.final.md` into the editor → tweak → **Download PDF**. Full
details (build, deploy, how the PDF stays ATS-friendly) are in
[`job6r.app/README.md`](job6r.app/README.md).
