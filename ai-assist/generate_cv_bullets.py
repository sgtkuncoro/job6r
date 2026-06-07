#!/usr/bin/env python3
"""Generate Verb + Impact + How CV bullets from raw experience notes.

Implements the core CV trick from JOB-HUNT-PLAYBOOK.md (Part 2): every bullet is
[strong verb] + [quantified impact] + [how] + [tech stack].

Usage
-----
    # put GROQ_API_KEY=gsk_... in .env (see .env.example), then:
    pip install -r requirements.txt

    # from a file (one raw note per line):
    python generate_cv_bullets.py notes.txt

    # or pipe / type notes (Ctrl-D to end):
    python generate_cv_bullets.py

Notes
-----
- Powered by Groq. Default model is llama-3.3-70b-versatile; set MODEL=... to
  override (e.g. MODEL=openai/gpt-oss-120b).
- The model is told NOT to invent metrics; missing numbers come back as
  [QUANTIFY: ...] for you to fill in.
- Get a free Groq API key at https://console.groq.com/keys
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _env import load_dotenv  # noqa: E402

load_dotenv()  # pull GROQ_API_KEY / MODEL from a .env file if present

MODEL = os.environ.get("MODEL", "llama-3.3-70b-versatile")

SYSTEM_RULES = """You are an elite software-engineering resume coach.

Rewrite each raw note the user gives you into ONE CV bullet using this exact
formula:

    [strong, boastful verb] + [quantified impact] + [how you did it] + [tech stack]

Hard rules:
- Lead with a strong verb: Increased, Led, Architected, Shipped, Drove, Grew,
  Reduced, Launched. NEVER weak verbs like "helped", "worked on", "responsible
  for", "collaborated".
- Quantify the impact with %, counts, dollars, or scale.
- State HOW the impact was achieved.
- Name the concrete tech stack so the line is keyword-searchable by recruiters.
- One single line per bullet, starting with "- ".
- DO NOT invent numbers. If a note lacks a metric, insert a literal
  "[QUANTIFY: what to measure]" placeholder so the user can fill it in.
- Output ONLY the bullets, nothing else.

Example
  Raw:  built GoPay payments at Gojek
  Out:  - Increased Gojek revenue by [QUANTIFY: % or $] by architecting the GoPay
        payment settlement service in Golang
"""


def read_notes(argv: list[str]) -> list[str]:
    if len(argv) > 1:
        with open(argv[1], "r", encoding="utf-8") as fh:
            raw = fh.read()
    else:
        if sys.stdin.isatty():
            print("Enter raw experience notes (one per line). Ctrl-D when done:\n",
                  file=sys.stderr)
        raw = sys.stdin.read()
    return [line.strip(" -\t") for line in raw.splitlines() if line.strip()]


def main() -> int:
    notes = read_notes(sys.argv)
    if not notes:
        print("No notes provided.", file=sys.stderr)
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

    client = Groq()
    user_block = "Raw notes:\n" + "\n".join(f"- {n}" for n in notes)

    try:
        resp = client.chat.completions.create(
            model=MODEL,
            max_tokens=1024,
            temperature=0.4,
            messages=[
                {"role": "system", "content": SYSTEM_RULES},
                {"role": "user", "content": user_block},
            ],
        )
    except Exception as exc:
        print(f"Groq API error: {exc}", file=sys.stderr)
        return 1

    print((resp.choices[0].message.content or "").strip())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
