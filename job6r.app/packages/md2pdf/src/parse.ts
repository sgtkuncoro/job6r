// Full-markdown parser built on top of marked's lexer. It turns CommonMark +
// GitHub-Flavored Markdown (headings h1-h6, ordered/unordered/nested/task lists,
// blockquotes, fenced + inline code, tables, images, strikethrough, links) into
// a recursive list of typed blocks that both the react-pdf renderer and the HTML
// preview map 1:1.
//
// Two resume-specific heuristics are preserved on top of standard markdown:
//   - a line that is ONLY italic            -> "meta"    (e.g. dates / location)
//   - a line that is ONLY a bold label      -> "subhead" (optionally + italic suffix)
// Everything else falls through to the standard block types.

import { marked, type Token, type Tokens } from "marked";

export type Segment = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
  code?: boolean;
  link?: string; // href, when this run is a link
};

export type TableCell = { segments: Segment[]; align: "left" | "center" | "right" };

export type ListItem = { blocks: Block[]; checked?: boolean | null };

export type Block =
  | { type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; segments: Segment[] }
  | { type: "meta"; segments: Segment[] }
  | { type: "subhead"; segments: Segment[] }
  | { type: "para"; segments: Segment[] }
  | { type: "list"; ordered: boolean; start: number; items: ListItem[] }
  | { type: "blockquote"; blocks: Block[] }
  | { type: "code"; text: string; lang?: string }
  | { type: "table"; header: TableCell[]; rows: TableCell[][] }
  | { type: "image"; src: string; alt: string }
  | { type: "hr" };

// marked HTML-escapes some inline text (codespans, stray < & >); segments hold
// decoded text and each renderer re-escapes as needed for its target.
function unescape(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(?:39|x27);/gi, "'");
}

function stripTags(s: string): string {
  return unescape(s.replace(/<[^>]*>/g, ""));
}

function pushText(out: Segment[], text: string, base: Partial<Segment>): void {
  if (!text) return;
  out.push({ ...base, text: unescape(text) });
}

// Flatten marked inline tokens to flag-carrying runs. Emphasis nests, so flags
// accumulate as we descend (strong > em > del, links carry an href).
function inlineToSegments(tokens: Token[] | undefined, base: Partial<Segment> = {}): Segment[] {
  if (!tokens) return [];
  const out: Segment[] = [];
  for (const t of tokens) {
    switch (t.type) {
      case "text": {
        const tok = t as Tokens.Text;
        if (tok.tokens) out.push(...inlineToSegments(tok.tokens, base));
        else pushText(out, tok.text, base);
        break;
      }
      case "escape":
        pushText(out, (t as Tokens.Escape).text, base);
        break;
      case "strong":
        out.push(...inlineToSegments((t as Tokens.Strong).tokens, { ...base, bold: true }));
        break;
      case "em":
        out.push(...inlineToSegments((t as Tokens.Em).tokens, { ...base, italic: true }));
        break;
      case "del":
        out.push(...inlineToSegments((t as Tokens.Del).tokens, { ...base, strike: true }));
        break;
      case "codespan":
        pushText(out, (t as Tokens.Codespan).text, { ...base, code: true });
        break;
      case "br":
        out.push({ ...base, text: "\n" });
        break;
      case "link": {
        const tok = t as Tokens.Link;
        out.push(...inlineToSegments(tok.tokens, { ...base, link: tok.href }));
        break;
      }
      case "image": {
        const tok = t as Tokens.Image;
        pushText(out, tok.text || tok.title || tok.href, base);
        break;
      }
      case "html":
        pushText(out, stripTags((t as Tokens.HTML).text), base);
        break;
      default:
        if ("text" in t && typeof (t as { text?: unknown }).text === "string") {
          pushText(out, (t as { text: string }).text, base);
        }
    }
  }
  return out.map((s) => ({ ...s, text: s.text })).filter((s) => s.text.length > 0);
}

const ONLY_ITALIC = /^(?:_[^_]+_|\*(?!\*)[^*]+\*)$/;
const ONLY_BOLD_LABEL = /^\*\*[^*]+\*\*(?:\s*_[^_]+_)?$/;

// A paragraph token may actually be a resume meta/subhead line or a standalone
// image; classify before falling back to a plain paragraph.
function paragraphBlock(text: string, tokens: Token[] | undefined): Block {
  const trimmed = text.trim();
  const inline = (tokens ?? []).filter(
    (t) => !(t.type === "text" && !(t as Tokens.Text).text.trim()),
  );
  if (inline.length === 1 && inline[0].type === "image") {
    const img = inline[0] as Tokens.Image;
    return { type: "image", src: img.href, alt: img.text || img.title || "" };
  }
  if (ONLY_ITALIC.test(trimmed)) {
    return { type: "meta", segments: inlineToSegments(tokens) };
  }
  if (ONLY_BOLD_LABEL.test(trimmed)) {
    return { type: "subhead", segments: inlineToSegments(tokens) };
  }
  return { type: "para", segments: inlineToSegments(tokens) };
}

type Align = "left" | "center" | "right" | null;

function cell(c: Tokens.TableCell, align: Align): TableCell {
  return { segments: inlineToSegments(c.tokens), align: align ?? "left" };
}

function tokensToBlocks(tokens: Token[]): Block[] {
  const out: Block[] = [];
  for (const t of tokens) {
    switch (t.type) {
      case "space":
      case "def":
        break;
      case "heading": {
        const tok = t as Tokens.Heading;
        const level = Math.min(Math.max(tok.depth, 1), 6) as 1 | 2 | 3 | 4 | 5 | 6;
        out.push({ type: "heading", level, segments: inlineToSegments(tok.tokens) });
        break;
      }
      case "paragraph": {
        const tok = t as Tokens.Paragraph;
        out.push(paragraphBlock(tok.text, tok.tokens));
        break;
      }
      case "text": {
        const tok = t as Tokens.Text;
        // Loose-list / nested text nodes: treat as a paragraph-grade line.
        out.push(paragraphBlock(tok.text, tok.tokens ?? undefined));
        break;
      }
      case "list": {
        const tok = t as Tokens.List;
        out.push({
          type: "list",
          ordered: tok.ordered,
          start: typeof tok.start === "number" ? tok.start : 1,
          items: tok.items.map((it) => ({
            blocks: tokensToBlocks(it.tokens),
            checked: it.task ? Boolean(it.checked) : null,
          })),
        });
        break;
      }
      case "blockquote": {
        const tok = t as Tokens.Blockquote;
        out.push({ type: "blockquote", blocks: tokensToBlocks(tok.tokens) });
        break;
      }
      case "code": {
        const tok = t as Tokens.Code;
        out.push({ type: "code", text: tok.text, lang: tok.lang || undefined });
        break;
      }
      case "table": {
        const tok = t as Tokens.Table;
        out.push({
          type: "table",
          header: tok.header.map((c, i) => cell(c, tok.align[i])),
          rows: tok.rows.map((row) => row.map((c, i) => cell(c, tok.align[i]))),
        });
        break;
      }
      case "hr":
        out.push({ type: "hr" });
        break;
      case "html": {
        const text = stripTags((t as Tokens.HTML).text).trim();
        if (text) out.push({ type: "para", segments: [{ text }] });
        break;
      }
      default: {
        const generic = t as Tokens.Generic;
        if (generic.tokens) out.push(paragraphBlock(generic.raw ?? "", generic.tokens));
        else if (typeof generic.text === "string" && generic.text.trim())
          out.push({ type: "para", segments: [{ text: unescape(generic.text) }] });
      }
    }
  }
  return out;
}

export function parseMarkdown(md: string): Block[] {
  return tokensToBlocks(marked.lexer(md));
}

// --- Backwards-compatible helpers (kept for the public package surface) ---

export function parseInline(input: string): Segment[] {
  const tokens = marked.lexer(input);
  const first = tokens.find(
    (t) => t.type === "paragraph" || t.type === "heading" || t.type === "text",
  ) as (Token & { tokens?: Token[] }) | undefined;
  return first?.tokens ? inlineToSegments(first.tokens) : input ? [{ text: input }] : [];
}

export function stripAll(text: string): string {
  return parseInline(text)
    .map((s) => s.text)
    .join("");
}
