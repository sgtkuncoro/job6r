// Block-based HTML for the live preview. Uses the SAME parseMarkdown() the PDF
// renderer uses, so the preview's structure matches the PDF exactly — then the
// .r-* CSS classes mirror the react-pdf style metrics (see document.tsx).
import { parseMarkdown, type Segment } from "./parse";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(segments: Segment[]): string {
  return segments
    .map((s) => (s.bold ? `<strong>${esc(s.text)}</strong>` : esc(s.text)))
    .join("");
}

export function markdownToHtml(md: string): string {
  const out: string[] = [];
  for (const b of parseMarkdown(md)) {
    switch (b.type) {
      case "hr":
        // Dividers omitted (section-header underline is the only rule).
        break;
      case "h1":
        out.push(`<div class="r-h1">${inline(b.segments)}</div>`);
        break;
      case "h2":
        out.push(`<div class="r-h2">${esc(b.text)}</div>`);
        break;
      case "h3":
        out.push(`<div class="r-h3">${esc(b.text)}</div>`);
        break;
      case "meta":
        out.push(`<div class="r-meta">${inline(b.segments)}</div>`);
        break;
      case "subhead":
        out.push(`<div class="r-subhead">${inline(b.segments)}</div>`);
        break;
      case "bullet":
        out.push(
          `<div class="r-bullet${b.sub ? " r-sub" : ""}">` +
            `<span class="r-dot">${b.sub ? "-" : "•"}</span>` +
            `<span class="r-bulletText">${inline(b.segments)}</span></div>`,
        );
        break;
      case "para":
        out.push(`<div class="r-para">${inline(b.segments)}</div>`);
        break;
    }
  }
  return out.join("\n");
}
