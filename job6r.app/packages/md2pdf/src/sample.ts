// Default resume markdown shown in the editor.
// Uses a generic placeholder (John Doe) so the public app exposes no real
// personal data. The real CV lives in resolved_cv/Profile.final.md and is used
// only by the local PDF tooling — it is intentionally NOT imported here.
import raw from "./sample.placeholder.md?raw";

// Kept generic: if a source ever hard-wraps a prose paragraph across physical
// lines, join the continuation lines back into one logical line. Structural
// markdown (headings, lists, tables, blockquotes, fenced code) is left intact so
// the full-markdown parser sees it unchanged. Harmless for unwrapped files.
function unwrap(md: string): string {
  const isNewBlock = (t: string) =>
    t === "" ||
    /^(?:-{3,}|\*{3,}|_{3,})$/.test(t) || // horizontal rules
    /^#{1,6}\s/.test(t) || // headings
    /^[-*+]\s/.test(t) || // unordered list
    /^\d+[.)]\s/.test(t) || // ordered list
    /^>/.test(t) || // blockquote
    /^\|/.test(t) || // table row
    t.startsWith("*") || // emphasis / subhead
    t.startsWith("_"); // meta line

  const out: string[] = [];
  let inFence = false;
  for (const line of md.split(/\r?\n/)) {
    const t = line.trim();
    if (/^(```|~~~)/.test(t)) inFence = !inFence;
    const prev = out.length ? out[out.length - 1].trim() : "";
    if (!inFence && out.length && !isNewBlock(t) && prev !== "" && !/^(```|~~~)/.test(prev)) {
      out[out.length - 1] += " " + t; // continuation -> join
    } else {
      out.push(line); // new block / fenced content (keep raw indent)
    }
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export const SAMPLE_RESUME = unwrap(raw);
