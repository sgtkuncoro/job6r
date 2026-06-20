// ResumeDocument: maps parsed markdown blocks to a react-pdf document. The base
// typography mimics a Reactive/Standard resume (Poppins headings + Merriweather
// body, pure black, ~34pt margins). On top of that it now renders the full
// markdown surface markdowntopdf.com supports: h1-h6, ordered/unordered/nested/
// task lists, blockquotes, fenced + inline code, tables, images, strikethrough,
// and links. This module does NOT register fonts (so Node tests can register
// from paths). Inline code / code blocks use react-pdf's built-in Courier.

import {
  Document,
  Page,
  Text,
  View,
  Image,
  Link,
  StyleSheet,
  type Styles,
} from "@react-pdf/renderer";

type Style = Styles[string];
import {
  parseMarkdown,
  type Block,
  type ListItem,
  type Segment,
  type TableCell,
} from "./parse";

const HEAD = "Poppins"; // sans-serif: name, section headers, job titles
const BODY = "Merriweather"; // serif: contact, summary, meta, bullets
const MONO = "Courier"; // built-in monospace for code
const BLACK = "#000000";
const LINK = "#2563eb";

const LEAD = 1.42;
const styles = StyleSheet.create({
  page: {
    paddingVertical: 34,
    paddingHorizontal: 34,
    fontFamily: BODY,
    fontSize: 9,
    color: BLACK,
    lineHeight: LEAD,
  },
  h1: { fontFamily: HEAD, fontWeight: "semibold", fontSize: 22.5, lineHeight: 1.1, marginBottom: 5 },
  h2: {
    fontFamily: HEAD,
    fontWeight: "semibold",
    fontSize: 10.8,
    letterSpacing: 0.2,
    marginTop: 16,
    marginBottom: 6,
  },
  h3: { fontFamily: HEAD, fontWeight: "semibold", fontSize: 12.6, marginTop: 13, marginBottom: 1 },
  h4: { fontFamily: HEAD, fontWeight: "semibold", fontSize: 10.5, marginTop: 9, marginBottom: 1 },
  h5: { fontFamily: HEAD, fontWeight: "semibold", fontSize: 9.5, marginTop: 8, marginBottom: 1 },
  h6: {
    fontFamily: HEAD,
    fontWeight: "semibold",
    fontSize: 9,
    color: "#444444",
    marginTop: 8,
    marginBottom: 1,
  },
  subhead: { fontFamily: HEAD, fontWeight: "semibold", fontSize: 9.5, marginTop: 7, marginBottom: 1 },
  meta: {
    fontFamily: HEAD,
    fontWeight: "normal",
    fontSize: 9,
    color: BLACK,
    lineHeight: LEAD,
    marginTop: 3,
    marginBottom: 2,
  },
  para: { fontFamily: BODY, fontSize: 9, lineHeight: LEAD, marginBottom: 2 },
  bulletRow: { flexDirection: "row", marginBottom: 2 },
  bulletDot: { fontFamily: BODY, fontSize: 9, width: 12, lineHeight: LEAD },
  bulletText: { fontFamily: BODY, fontSize: 9, flex: 1, lineHeight: LEAD },
  blockquote: {
    borderLeftWidth: 2,
    borderLeftColor: "#cccccc",
    paddingLeft: 8,
    marginVertical: 3,
  },
  codeBlock: {
    backgroundColor: "#f4f4f5",
    borderRadius: 3,
    padding: 6,
    marginVertical: 4,
  },
  codeLine: { fontFamily: MONO, fontSize: 8.5, lineHeight: 1.4, color: "#1f2328" },
  table: { borderWidth: 0.5, borderColor: "#d0d0d0", marginVertical: 5 },
  tableRow: { flexDirection: "row" },
  tableHeadRow: { flexDirection: "row", backgroundColor: "#f4f4f5" },
  tableCell: {
    flex: 1,
    fontFamily: BODY,
    fontSize: 8.5,
    padding: 4,
    borderRightWidth: 0.5,
    borderRightColor: "#d0d0d0",
    borderBottomWidth: 0.5,
    borderBottomColor: "#d0d0d0",
  },
  image: { marginVertical: 6, maxWidth: 460 },
  hr: { borderBottomWidth: 0.5, borderBottomColor: "#cccccc", marginVertical: 5 },
  // Drawn checkbox for task lists (react-pdf has no <input>).
  checkbox: {
    width: 8.5,
    height: 8.5,
    borderWidth: 0.8,
    borderColor: BLACK,
    borderRadius: 1.5,
    marginTop: 1.8,
    alignItems: "center",
    justifyContent: "center",
  },
  // An L-shape (right + bottom border) rotated 45deg reads as a tick.
  checkmark: {
    width: 2.4,
    height: 4.8,
    borderColor: BLACK,
    borderRightWidth: 1.1,
    borderBottomWidth: 1.1,
    transform: "rotate(45deg)",
    marginTop: -1,
  },
});

const headingStyle: Record<number, Style> = {
  1: styles.h1,
  2: styles.h2,
  3: styles.h3,
  4: styles.h4,
  5: styles.h5,
  6: styles.h6,
};

// Poppins (the heading family) ships without an italic cut, so italic is only
// applied in body (Merriweather) contexts; pass `head` for Poppins-styled text.
function segStyle(s: Segment, head = false): Style {
  const style: Style = {};
  if (s.bold) style.fontWeight = "bold";
  if (s.italic && !head) style.fontStyle = "italic";
  if (s.code) {
    style.fontFamily = MONO;
    style.color = "#c7254e";
  }
  if (s.strike) style.textDecoration = "line-through";
  if (s.link) style.color = LINK;
  return style;
}

function Inline({ segments, head }: { segments: Segment[]; head?: boolean }) {
  return (
    <>
      {segments.map((s, i) =>
        s.link ? (
          <Link key={i} src={s.link} style={segStyle(s, head)}>
            {s.text}
          </Link>
        ) : (
          <Text key={i} style={segStyle(s, head)}>
            {s.text}
          </Text>
        ),
      )}
    </>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <View style={styles.checkbox}>{checked ? <View style={styles.checkmark} /> : null}</View>
  );
}

// A list item's first block becomes the bullet line; any extra blocks (nested
// lists, multi-paragraph items) render beneath it, indented. Task items draw a
// real checkbox instead of a text marker.
function ListItemRow({
  item,
  marker,
  markerWidth,
  depth,
}: {
  item: ListItem;
  marker: string;
  markerWidth: number;
  depth: number;
}) {
  const [first, ...rest] = item.blocks;
  const isTask = item.checked === true || item.checked === false;
  return (
    <View style={{ marginLeft: depth * 12 }}>
      <View style={styles.bulletRow}>
        {isTask ? (
          <View style={{ width: markerWidth, flexDirection: "row" }}>
            <Checkbox checked={item.checked === true} />
          </View>
        ) : (
          <Text style={{ ...styles.bulletDot, width: markerWidth }}>{marker}</Text>
        )}
        <View style={{ flex: 1 }}>{first ? renderBlock(first, 0, depth) : null}</View>
      </View>
      {rest.map((b, i) => (
        <View key={i} style={{ marginLeft: markerWidth }}>
          {renderBlock(b, i, depth + 1)}
        </View>
      ))}
    </View>
  );
}

function renderBlock(block: Block, key: number, depth = 0) {
  switch (block.type) {
    case "hr":
      return <View key={key} style={styles.hr} />;
    case "heading": {
      const style = headingStyle[block.level];
      // h1 is the resume name: flatten to plain text (no inline links/marks).
      if (block.level === 1) {
        return (
          <Text key={key} style={style}>
            {block.segments.map((s) => s.text).join("")}
          </Text>
        );
      }
      return (
        <Text key={key} style={style}>
          <Inline segments={block.segments} head />
        </Text>
      );
    }
    case "meta":
      return (
        <Text key={key} style={styles.meta}>
          <Inline segments={block.segments} head />
        </Text>
      );
    case "subhead":
      return (
        <Text key={key} style={styles.subhead}>
          <Inline segments={block.segments} head />
        </Text>
      );
    case "para":
      return (
        <Text key={key} style={depth > 0 ? { ...styles.para, marginBottom: 0 } : styles.para}>
          <Inline segments={block.segments} />
        </Text>
      );
    case "list":
      return (
        <View key={key}>
          {block.items.map((item, i) => {
            const isTask = item.checked === true || item.checked === false;
            const marker = isTask
              ? item.checked
                ? "[x]"
                : "[ ]"
              : block.ordered
                ? `${block.start + i}.`
                : depth > 0
                  ? "-"
                  : "•";
            // Wide enough that the marker never wraps below the label.
            const markerWidth = isTask ? 18 : block.ordered ? 16 : 12;
            return (
              <ListItemRow
                key={i}
                item={item}
                depth={depth}
                marker={marker}
                markerWidth={markerWidth}
              />
            );
          })}
        </View>
      );
    case "blockquote":
      return (
        <View key={key} style={styles.blockquote}>
          {block.blocks.map((b, i) => renderBlock(b, i, depth))}
        </View>
      );
    case "code":
      return (
        <View key={key} style={styles.codeBlock}>
          {block.text.split("\n").map((line, i) => (
            <Text key={i} style={styles.codeLine}>
              {line || " "}
            </Text>
          ))}
        </View>
      );
    case "table":
      return (
        <View key={key} style={styles.table}>
          <View style={styles.tableHeadRow}>
            {block.header.map((c, i) => (
              <TableCellView key={i} cell={c} head />
            ))}
          </View>
          {block.rows.map((row, ri) => (
            <View key={ri} style={styles.tableRow}>
              {row.map((c, ci) => (
                <TableCellView key={ci} cell={c} />
              ))}
            </View>
          ))}
        </View>
      );
    case "image":
      // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt
      return <Image key={key} src={block.src} style={styles.image} />;
    default:
      return null;
  }
}

function TableCellView({ cell, head }: { cell: TableCell; head?: boolean }) {
  return (
    <Text style={{ ...styles.tableCell, textAlign: cell.align, fontWeight: head ? "bold" : "normal" }}>
      <Inline segments={cell.segments} />
    </Text>
  );
}

export function ResumeDocument({ markdown }: { markdown: string }) {
  const blocks = parseMarkdown(markdown);
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {blocks.map((b, i) => renderBlock(b, i))}
      </Page>
    </Document>
  );
}
