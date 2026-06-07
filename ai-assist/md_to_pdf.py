#!/usr/bin/env python3
"""Render a resume Markdown file into an ATS-friendly PDF with real, selectable
text (embedded Unicode font + ToUnicode map).

Why this exists: a PDF "printed" from a design tool (Canva/Figma/Preview) often
flattens text into vector outlines, so an Applicant Tracking System extracts ZERO
characters from it. This converter produces a clean, single-column PDF whose text
any ATS can read, generated from your Markdown source of truth.

Usage
-----
    pip install fpdf2
    python ai-assist/md_to_pdf.py resolved_cv/Profile.final.md
    python ai-assist/md_to_pdf.py resolved_cv/Profile.final.md -o resolved_cv/Resume_SigitK_ATS.pdf

Notes
-----
- Single column, standard font (Arial, embedded), no tables/text-boxes/graphics —
  the layout ATS parsers handle most reliably.
- Supports: # name, ## section, ### entry, **bold**, _italic_ meta lines,
  - bullets and nested sub-bullets, [text](url) links, --- rules.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

try:
    from fpdf import FPDF
except ImportError:
    sys.exit("Missing dependency. Run: pip install fpdf2")

# Embeddable system fonts (macOS). Embedding gives a ToUnicode map => ATS-readable.
FONT_CANDIDATES = {
    "": [
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial.ttf",
    ],
    "B": [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/Library/Fonts/Arial Bold.ttf",
    ],
    "I": [
        "/System/Library/Fonts/Supplemental/Arial Italic.ttf",
        "/Library/Fonts/Arial Italic.ttf",
    ],
}

LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
EMPH_U = re.compile(r"(?<!_)_([^_]+)_(?!_)")   # _italic_  (single underscore)
EMPH_S = re.compile(r"(?<!\*)\*([^*]+)\*(?!\*)")  # *italic*  (single asterisk)


def strip_scheme(url: str) -> str:
    return re.sub(r"^https?://", "", url).rstrip("/")


def delink(text: str) -> str:
    """Turn [label](url) into readable text. If the label is a bare word (no dot),
    append the URL so the link is still visible to an ATS; if the label already
    looks like a domain, keep it as-is."""
    def repl(m: re.Match) -> str:
        label, url = m.group(1), m.group(2)
        return label if "." in label else f"{label} ({strip_scheme(url)})"
    return LINK_RE.sub(repl, text)


def clean_inline(text: str) -> str:
    """Resolve links and drop single-char emphasis markers, KEEPING **bold** so
    fpdf2's markdown renderer can bold it."""
    text = delink(text)
    text = EMPH_U.sub(r"\1", text)
    text = EMPH_S.sub(r"\1", text)
    return text


def strip_all_emphasis(text: str) -> str:
    text = delink(text)
    text = text.replace("**", "")
    text = EMPH_U.sub(r"\1", text)
    text = EMPH_S.sub(r"\1", text)
    return text


class Resume(FPDF):
    def __init__(self):
        super().__init__(format="Letter", unit="mm")
        self.set_auto_page_break(auto=True, margin=15)
        self.set_margins(16, 14, 16)
        self.family = "Helvetica"  # fallback to core font
        # Try to embed Arial for full Unicode + ToUnicode (ATS-friendly).
        try:
            paths = {style: next((p for p in cands if Path(p).is_file()), None)
                     for style, cands in FONT_CANDIDATES.items()}
            if paths[""] and paths["B"] and paths["I"]:
                self.add_font("Arial", "", paths[""])
                self.add_font("Arial", "B", paths["B"])
                self.add_font("Arial", "I", paths["I"])
                self.family = "Arial"
        except Exception:
            self.family = "Helvetica"

    @property
    def content_width(self) -> float:
        return self.w - self.l_margin - self.r_margin


def render(md_path: Path, out_path: Path) -> None:
    lines = md_path.read_text(encoding="utf-8").splitlines()
    pdf = Resume()
    pdf.add_page()
    fam = pdf.family

    for raw in lines:
        line = raw.rstrip()
        stripped = line.strip()
        indent = len(line) - len(line.lstrip(" "))

        # Blank line -> small vertical gap
        if not stripped:
            pdf.ln(2.2)
            continue

        # Horizontal rule -> thin divider
        if stripped == "---":
            y = pdf.get_y() + 1
            pdf.set_draw_color(200, 200, 200)
            pdf.line(pdf.l_margin, y, pdf.w - pdf.r_margin, y)
            pdf.ln(3)
            continue

        # H1 -> name (centered, large)
        if stripped.startswith("# "):
            pdf.set_font(fam, "B", 20)
            pdf.set_text_color(20, 20, 20)
            pdf.cell(0, 9, strip_all_emphasis(stripped[2:]), align="C",
                     new_x="LMARGIN", new_y="NEXT")
            continue

        # H2 -> section header (uppercase, underlined)
        if stripped.startswith("## "):
            pdf.ln(1.5)
            pdf.set_font(fam, "B", 12)
            pdf.set_text_color(30, 30, 30)
            pdf.cell(0, 6.5, strip_all_emphasis(stripped[3:]).upper(),
                     new_x="LMARGIN", new_y="NEXT")
            y = pdf.get_y()
            pdf.set_draw_color(120, 120, 120)
            pdf.line(pdf.l_margin, y, pdf.w - pdf.r_margin, y)
            pdf.ln(1.5)
            continue

        # H3 -> entry/job title
        if stripped.startswith("### "):
            pdf.ln(1)
            pdf.set_font(fam, "B", 11)
            pdf.set_text_color(20, 20, 20)
            pdf.multi_cell(pdf.content_width, 5.5, strip_all_emphasis(stripped[4:]),
                           new_x="LMARGIN", new_y="NEXT")
            continue

        # Bullets (top-level "- " and nested "  - ")
        if stripped.startswith("- "):
            text = clean_inline(stripped[2:])
            sub = indent >= 2
            bullet = "- " if sub else "- "
            left = pdf.l_margin + (7 if sub else 2)
            pdf.set_left_margin(left)
            pdf.set_x(left)
            pdf.set_font(fam, "", 10)
            pdf.set_text_color(35, 35, 35)
            pdf.multi_cell(pdf.w - pdf.r_margin - left, 4.8,
                           f"{bullet}{text}", markdown=True,
                           new_x="LMARGIN", new_y="NEXT")
            pdf.set_left_margin(pdf.l_margin)  # restore
            continue

        # Whole-line italic meta (e.g. dates/context) -> _..._ or *...*
        if (stripped.startswith("_") and stripped.endswith("_")) or \
           (stripped.startswith("*") and not stripped.startswith("**") and stripped.endswith("*")):
            pdf.set_font(fam, "I", 9.5)
            pdf.set_text_color(95, 95, 95)
            pdf.multi_cell(pdf.content_width, 4.6, strip_all_emphasis(stripped),
                           new_x="LMARGIN", new_y="NEXT")
            continue

        # Bold subheading line (e.g. **Merchant Experience Team** _(dates)_)
        if stripped.startswith("**"):
            pdf.set_font(fam, "", 10)
            pdf.set_text_color(30, 30, 30)
            pdf.multi_cell(pdf.content_width, 5, clean_inline(stripped),
                           markdown=True, new_x="LMARGIN", new_y="NEXT")
            continue

        # Default paragraph (e.g. summary, tagline)
        pdf.set_font(fam, "", 10)
        pdf.set_text_color(30, 30, 30)
        pdf.multi_cell(pdf.content_width, 5, clean_inline(stripped),
                       markdown=True, new_x="LMARGIN", new_y="NEXT")

    pdf.output(str(out_path))


def main() -> int:
    ap = argparse.ArgumentParser(description="Render resume Markdown -> ATS-friendly PDF.")
    ap.add_argument("markdown", help="Path to the resume .md file.")
    ap.add_argument("-o", "--out", default=None,
                    help="Output PDF path (default: alongside the .md, .pdf extension).")
    args = ap.parse_args()

    md_path = Path(args.markdown)
    if not md_path.is_file():
        print(f"Markdown not found: {md_path}", file=sys.stderr)
        return 1
    out_path = Path(args.out) if args.out else md_path.with_suffix(".pdf")
    out_path.parent.mkdir(parents=True, exist_ok=True)

    render(md_path, out_path)
    print(f"✓ ATS-friendly PDF -> {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
