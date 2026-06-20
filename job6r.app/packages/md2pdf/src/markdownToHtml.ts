// Block-based HTML for the live preview. Uses the SAME parseMarkdown() the PDF
// renderer uses, so the preview's structure matches the PDF — then the .r-* CSS
// classes mirror the react-pdf style metrics (see document.tsx and styles.css).
// Covers the full markdown surface: h1-h6, ordered/unordered/nested/task lists,
// blockquotes, fenced + inline code, tables, images, strikethrough, links.
import { parseMarkdown, type Block, type ListItem, type Segment } from "./parse";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(segments: Segment[]): string {
  return segments
    .map((s) => {
      let html = esc(s.text).replace(/\n/g, "<br />");
      if (s.code) html = `<code class="r-code">${html}</code>`;
      if (s.bold) html = `<strong>${html}</strong>`;
      if (s.italic) html = `<em>${html}</em>`;
      if (s.strike) html = `<del>${html}</del>`;
      if (s.link)
        html = `<a href="${esc(s.link)}" target="_blank" rel="noopener noreferrer">${html}</a>`;
      return html;
    })
    .join("");
}

function listItem(item: ListItem): string {
  const cls =
    item.checked === null || item.checked === undefined ? "" : ' class="r-task"';
  const box =
    item.checked === null || item.checked === undefined
      ? ""
      : `<input type="checkbox" disabled${item.checked ? " checked" : ""} /> `;
  return `<li${cls}>${box}${item.blocks.map(renderBlock).join("")}</li>`;
}

function renderBlock(b: Block): string {
  switch (b.type) {
    case "hr":
      return `<hr class="r-hr" />`;
    case "heading":
      return `<div class="r-h${b.level}">${inline(b.segments)}</div>`;
    case "meta":
      return `<div class="r-meta">${inline(b.segments)}</div>`;
    case "subhead":
      return `<div class="r-subhead">${inline(b.segments)}</div>`;
    case "para":
      return `<div class="r-para">${inline(b.segments)}</div>`;
    case "list": {
      const tag = b.ordered ? "ol" : "ul";
      const startAttr = b.ordered && b.start !== 1 ? ` start="${b.start}"` : "";
      return `<${tag} class="r-list"${startAttr}>${b.items.map(listItem).join("")}</${tag}>`;
    }
    case "blockquote":
      return `<blockquote class="r-quote">${b.blocks.map(renderBlock).join("")}</blockquote>`;
    case "code":
      return `<pre class="r-pre"><code>${esc(b.text)}</code></pre>`;
    case "table":
      return (
        `<table class="r-table"><thead><tr>` +
        b.header
          .map((c) => `<th style="text-align:${c.align}">${inline(c.segments)}</th>`)
          .join("") +
        `</tr></thead><tbody>` +
        b.rows
          .map(
            (row) =>
              `<tr>` +
              row
                .map((c) => `<td style="text-align:${c.align}">${inline(c.segments)}</td>`)
                .join("") +
              `</tr>`,
          )
          .join("") +
        `</tbody></table>`
      );
    case "image":
      return `<img class="r-img" src="${esc(b.src)}" alt="${esc(b.alt)}" />`;
    default:
      return "";
  }
}

export function markdownToHtml(md: string): string {
  return parseMarkdown(md).map(renderBlock).join("\n");
}
