// Default resume markdown shown in the editor.
// Uses a generic placeholder (John Doe) so the public app exposes no real
// personal data. The real CV lives in resolved_cv/Profile.final.md and is used
// only by the local PDF tooling — it is intentionally NOT imported here.
import raw from "./sample.placeholder.md?raw";

// Kept generic: if a source ever uses hard-wrapped blocks (one block split
// across physical lines), join wrapped continuation lines back into one logical
// line per block (the PDF parser is line-based). Harmless for unwrapped files.
function unwrap(md: string): string {
  const isNewBlock = (t: string) =>
    t === "" ||
    t === "---" ||
    /^#{1,6}\s/.test(t) || // headings
    /^-\s/.test(t) || // bullets
    t.startsWith("*") || // emphasis / subhead
    t.startsWith("_"); // meta line

  const out: string[] = [];
  for (const line of md.split(/\r?\n/)) {
    const t = line.trim();
    if (out.length && !isNewBlock(t) && out[out.length - 1].trim() !== "") {
      out[out.length - 1] += " " + t; // continuation -> join
    } else {
      out.push(line); // new block (keep raw indent for sub-bullets)
    }
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export const SAMPLE_RESUME = unwrap(raw);
