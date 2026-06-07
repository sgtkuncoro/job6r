#!/usr/bin/env python3
"""Analyze a PDF CV and rewrite it into a ready-to-use CV, using the rules in
JOB-HUNT-PLAYBOOK.md. Powered by Groq (fast, low-cost LLMs).

Implements Part 2 of the playbook ("The CV that converts at 50%"): experience-
first ordering, accurate-but-higher titles, one context line per company, the
Verb + Impact + How (+ Tech) bullet formula, role durations, and a keyword-rich
skills section.

Groq models are text-only, so this extracts the PDF text locally with pypdf and
sends it to Groq together with the playbook as the system prompt. It writes TWO
markdown files:

    1. <name>.corrected.md   — the fixed, ready-to-use CV
    2. <name>.corrections.md — a detailed, part-by-part log of every change

Usage
-----
    # put GROQ_API_KEY=gsk_... in .env (see .env.example), then:
    pip install -r requirements.txt

    # analyze a CV, write both files into resolved_cv/ (the default):
    python ai-assist/cv_doctor.py issues_cv/Profile.pdf

    # choose an output directory:
    python ai-assist/cv_doctor.py issues_cv/Profile.pdf -o resolved_cv

    # add context the model can't see in the PDF (improves accuracy, avoids
    # invented numbers): target role, real seniority, company facts, metrics:
    python ai-assist/cv_doctor.py issues_cv/Profile.pdf \
        --target "Senior Backend Engineer (remote, US)" \
        --notes "Gojek = Indonesia's largest super-app. I led the GoPay \
                 settlement service; cut reconciliation time ~40%."

Notes
-----
- Default model is llama-3.3-70b-versatile. Set MODEL=... to override
  (e.g. MODEL=openai/gpt-oss-120b or MODEL=moonshotai/kimi-k2-instruct).
- The model is told NEVER to invent facts or numbers. Missing metrics come back
  as [QUANTIFY: ...] placeholders and missing facts as [VERIFY: ...].
- Get a free Groq API key at https://console.groq.com/keys
"""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _env import load_dotenv  # noqa: E402

load_dotenv()  # pull GROQ_API_KEY / MODEL from a .env file if present

MODEL = os.environ.get("MODEL", "llama-3.3-70b-versatile")

# Sentinels the model wraps each document in, so we can split one response into
# two files reliably.
CV_OPEN, CV_CLOSE = "<<<CORRECTED_CV>>>", "<<<END_CORRECTED_CV>>>"
SUM_OPEN, SUM_CLOSE = "<<<CORRECTIONS>>>", "<<<END_CORRECTIONS>>>"

# A distilled, self-contained rule set. The full playbook is also attached below
# so the model has the complete reasoning; this block makes the non-negotiables
# impossible to miss.
SYSTEM_RULES = f"""You are an elite software-engineering resume coach. You take a
candidate's existing CV (provided as extracted text) and rewrite it into a
polished, ready-to-use CV that follows the attached JOB-HUNT-PLAYBOOK exactly,
while documenting every change you make.

NON-NEGOTIABLE CV RULES (from the playbook):
1. ORDER: Contact block -> Work experience FIRST -> Education -> Skills ->
   Awards/extras. Never lead with education or projects.
2. CONTACT BLOCK must be complete: name, location, phone, email, and links
   (LinkedIn, GitHub/GitLab, blog/newsletter). Flag anything missing as
   [VERIFY: add your ...].
3. TITLES: use a title that communicates the candidate's REAL seniority
   (e.g. "Senior Software Engineer"). Higher-but-accurate. Never fabricate a
   level. If unsure of the true level, keep the original and note it.
4. COMPANY CONTEXT: give EVERY company one short context line a foreign recruiter
   understands -- what it does + stage/funding + a credibility marker (top
   investor / YC / scale). If you don't know the facts, insert
   [VERIFY: company context] rather than inventing them.
5. BULLETS: every experience bullet = [strong, boastful verb] + [quantified
   impact] + [how you did it] + [tech stack]. Strong verbs only (Increased, Led,
   Architected, Shipped, Drove, Grew, Reduced, Launched). NEVER weak verbs
   ("helped", "worked on", "responsible for", "collaborated").
6. DURATION: show how long the candidate was in each role (start - end, and total).
7. SKILLS SECTION: include a keyword-rich skills section so recruiters' keyword
   searches surface the candidate. Pull the tech from the experience.
8. HONESTY: DO NOT invent numbers, employers, dates, or achievements. If a bullet
   lacks a metric, insert a literal "[QUANTIFY: what to measure]" placeholder. If
   a fact is missing or unverifiable, insert "[VERIFY: ...]". Preserve all real
   facts from the original CV.
9. Keep it concise, scannable, and ATS-friendly (plain markdown, no tables for the
   CV body, standard section headings).

OUTPUT FORMAT -- output BOTH documents in ONE response, each wrapped in its
sentinels, with NOTHING outside the sentinels:

{CV_OPEN}
# <Candidate Name>
... the full corrected CV in clean markdown, ready to copy into a doc ...
{CV_CLOSE}

{SUM_OPEN}
# CV Correction Report
... see required structure below ...
{SUM_CLOSE}

The CORRECTIONS report MUST contain, in this order:
- "## Overview" — 2-4 sentences: overall verdict + the biggest wins.
- "## Playbook checklist" — a markdown table with columns
  | Playbook rule | Before | After | Status |
  one row per rule above (Order, Contact, Titles, Company context, Bullets,
  Duration, Skills, Honesty), Status = fixed / needs your input / already good.
- "## Section-by-section corrections" — for EACH CV section (Contact, each
  Experience entry, Education, Skills, etc.) a "### <section>" with bullet points
  of: what was wrong, what you changed, and quoting the before -> after for at
  least the most important bullets. Be specific and detailed.
- "## Open items for you" — a checklist of every [QUANTIFY: ...] and [VERIFY: ...]
  placeholder you inserted, so the candidate knows exactly what to fill in.
- "## Bullet rewrites" — a table | Original | Rewritten | of the experience
  bullets you changed, so the diff is obvious.

Be thorough and concrete. The corrected CV must be genuinely ready to use."""


def extract_pdf_text(pdf_path: Path) -> str:
    try:
        from pypdf import PdfReader
    except ImportError:
        print("Missing dependency. Run: pip install pypdf", file=sys.stderr)
        raise SystemExit(1)
    reader = PdfReader(str(pdf_path))
    parts = []
    for i, page in enumerate(reader.pages, 1):
        text = (page.extract_text() or "").strip()
        parts.append(f"===== PAGE {i} =====\n{text}")
    return "\n\n".join(parts).strip()


def build_user_message(cv_text: str, target: str | None, notes: str | None) -> str:
    blocks = [
        "Analyze the CV below (extracted from the candidate's PDF) and produce the "
        "two documents per your rules: the corrected ready-to-use CV, and the "
        "detailed correction report.",
    ]
    if target:
        blocks.append(f"TARGET ROLE / GOAL: {target}")
    if notes:
        blocks.append(
            "EXTRA CONTEXT FROM THE CANDIDATE (use these real facts; prefer them "
            "over guessing, but still mark anything still-missing as "
            f"[QUANTIFY]/[VERIFY]):\n{notes}"
        )
    blocks.append("----- BEGIN CV TEXT -----\n" + cv_text + "\n----- END CV TEXT -----")
    return "\n\n".join(blocks)


def split_response(text: str) -> tuple[str, str]:
    def between(open_tag: str, close_tag: str) -> str:
        start = text.find(open_tag)
        end = text.find(close_tag)
        if start == -1 or end == -1 or end < start:
            return ""
        return text[start + len(open_tag):end].strip()

    return between(CV_OPEN, CV_CLOSE), between(SUM_OPEN, SUM_CLOSE)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Analyze and fix a PDF CV using the job-hunt playbook (via Groq)."
    )
    parser.add_argument("pdf", help="Path to the CV PDF to analyze.")
    parser.add_argument(
        "-o", "--out-dir", default="resolved_cv",
        help="Directory to write the two markdown files (default: resolved_cv).",
    )
    parser.add_argument(
        "--target", default=None,
        help="Target role/goal, e.g. 'Senior Backend Engineer (remote, US)'.",
    )
    parser.add_argument(
        "--notes", default=None,
        help="Extra real facts the PDF lacks (metrics, company context, true level).",
    )
    args = parser.parse_args()

    pdf_path = Path(args.pdf)
    if not pdf_path.is_file():
        print(f"PDF not found: {pdf_path}", file=sys.stderr)
        return 1
    if not os.environ.get("GROQ_API_KEY"):
        print(
            "Set GROQ_API_KEY first (in .env or your shell). "
            "Get a free key at https://console.groq.com/keys",
            file=sys.stderr,
        )
        return 1

    try:
        from groq import Groq
    except ImportError:
        print("Missing dependency. Run: pip install groq", file=sys.stderr)
        return 1

    cv_text = extract_pdf_text(pdf_path)
    if not cv_text:
        print(
            f"No extractable text in {pdf_path.name}. Is it a scanned/image PDF? "
            "(This tool needs a text-based PDF.)",
            file=sys.stderr,
        )
        return 1

    # Attach the full playbook to the system prompt, alongside the distilled rules.
    playbook_path = Path(__file__).resolve().parent.parent / "JOB-HUNT-PLAYBOOK.md"
    system_prompt = SYSTEM_RULES
    if playbook_path.is_file():
        system_prompt += (
            "\n\nFULL PLAYBOOK FOR REFERENCE:\n\n"
            + playbook_path.read_text(encoding="utf-8")
        )

    client = Groq()
    print(f"Analyzing {pdf_path.name} with {MODEL} (Groq) ...", file=sys.stderr)
    try:
        resp = client.chat.completions.create(
            model=MODEL,
            max_tokens=8000,
            temperature=0.4,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": build_user_message(cv_text, args.target, args.notes)},
            ],
        )
    except Exception as exc:  # groq.APIError and friends
        msg = str(exc)
        if "invalid_api_key" in msg or "Invalid API Key" in msg or "401" in msg:
            print(
                "Groq API error: invalid API key. Check GROQ_API_KEY in .env "
                "(get one at https://console.groq.com/keys).",
                file=sys.stderr,
            )
        elif "model" in msg.lower() and ("decommission" in msg.lower() or "not found" in msg.lower()):
            print(
                f"Groq API error: model '{MODEL}' is unavailable. Pick another with "
                "MODEL=... (see https://console.groq.com/docs/models).",
                file=sys.stderr,
            )
        else:
            print(f"Groq API error: {msg}", file=sys.stderr)
        return 1

    full = (resp.choices[0].message.content or "").strip()
    corrected_cv, corrections = split_response(full)

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    if not corrected_cv or not corrections:
        # Fallback: the model didn't honor the sentinels — dump raw so nothing is lost.
        raw = out_dir / f"{pdf_path.stem}.raw.md"
        raw.write_text(full, encoding="utf-8")
        print(
            f"Could not split the two documents cleanly. Raw model output saved to "
            f"{raw}. Try a stronger model, e.g. MODEL=openai/gpt-oss-120b",
            file=sys.stderr,
        )
        return 2

    cv_file = out_dir / f"{pdf_path.stem}.corrected.md"
    sum_file = out_dir / f"{pdf_path.stem}.corrections.md"
    cv_file.write_text(corrected_cv + "\n", encoding="utf-8")
    sum_file.write_text(corrections + "\n", encoding="utf-8")

    usage = getattr(resp, "usage", None)
    if usage is not None:
        print(
            f"tokens: in={getattr(usage, 'prompt_tokens', '?')} "
            f"out={getattr(usage, 'completion_tokens', '?')}",
            file=sys.stderr,
        )
    print(f"✓ Corrected CV     -> {cv_file}")
    print(f"✓ Correction report -> {sum_file}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
