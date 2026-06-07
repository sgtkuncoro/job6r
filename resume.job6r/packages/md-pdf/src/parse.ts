// Line-based markdown parser tuned for resume documents.
// Produces a flat list of typed blocks that both the react-pdf renderer and any
// other consumer can map. Inline parsing keeps **bold** and resolves [text](url)
// links into readable text (so the output stays ATS-friendly).

export type Segment = { text: string; bold?: boolean };

export type Block =
  | { type: "h1"; segments: Segment[] }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "meta"; segments: Segment[] }
  | { type: "subhead"; segments: Segment[] }
  | { type: "bullet"; segments: Segment[]; sub: boolean }
  | { type: "para"; segments: Segment[] }
  | { type: "hr" };

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

function stripScheme(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

// [Label](url) -> "Label" if the label already looks like a domain, else
// "Label (domain)" so the link target stays visible to an ATS.
function delink(text: string): string {
  return text.replace(LINK, (_m, label: string, url: string) =>
    label.includes(".") ? label : `${label} (${stripScheme(url)})`,
  );
}

function stripEmphasis(text: string): string {
  return text
    .replace(/(?<!_)_([^_]+)_(?!_)/g, "$1")
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "$1");
}

export function stripAll(text: string): string {
  return stripEmphasis(delink(text).replace(/\*\*/g, ""));
}

// Split into bold / non-bold runs, keeping **bold** and dropping single-char
// emphasis markers.
export function parseInline(input: string): Segment[] {
  const s = delink(input);
  const segs: Segment[] = [];
  const re = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) segs.push({ text: s.slice(last, m.index) });
    segs.push({ text: m[1], bold: true });
    last = re.lastIndex;
  }
  if (last < s.length) segs.push({ text: s.slice(last) });
  return segs
    .map((seg) => ({ ...seg, text: stripEmphasis(seg.text) }))
    .filter((seg) => seg.text.length > 0);
}

export function parseMarkdown(md: string): Block[] {
  const out: Block[] = [];
  for (const raw of md.split(/\r?\n/)) {
    const line = raw.replace(/\s+$/, "");
    const stripped = line.trim();
    const indent = line.length - line.trimStart().length;

    if (!stripped) continue;
    if (stripped === "---") {
      out.push({ type: "hr" });
      continue;
    }
    if (stripped.startsWith("# ")) {
      out.push({ type: "h1", segments: parseInline(stripped.slice(2)) });
      continue;
    }
    if (stripped.startsWith("## ")) {
      out.push({ type: "h2", text: stripAll(stripped.slice(3)) });
      continue;
    }
    if (stripped.startsWith("### ")) {
      out.push({ type: "h3", text: stripAll(stripped.slice(4)) });
      continue;
    }
    if (stripped.startsWith("- ")) {
      out.push({
        type: "bullet",
        segments: parseInline(stripped.slice(2)),
        sub: indent >= 2,
      });
      continue;
    }
    const isWrappedItalic =
      (stripped.startsWith("_") && stripped.endsWith("_")) ||
      (stripped.startsWith("*") &&
        !stripped.startsWith("**") &&
        stripped.endsWith("*"));
    if (isWrappedItalic) {
      out.push({ type: "meta", segments: parseInline(stripped) });
      continue;
    }
    // A subhead is a line that is ONLY a bold label, optionally followed by an
    // italic suffix (e.g. "**Merchant Experience Team** _(dates)_"). A bold lead
    // followed by normal text (e.g. "**Universitas …**, B.Tech …") is a paragraph.
    if (/^\*\*[^*]+\*\*(\s*_[^_]+_)?\s*$/.test(stripped)) {
      out.push({ type: "subhead", segments: parseInline(stripped) });
      continue;
    }
    out.push({ type: "para", segments: parseInline(stripped) });
  }
  return out;
}
