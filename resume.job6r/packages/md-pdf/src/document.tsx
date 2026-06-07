// ResumeDocument: maps parsed markdown blocks to an ATS-friendly react-pdf
// document. Typography mimics issues_cv/Resume_Yugo.pdf (Reactive/Standard
// Resume style): a geometric SANS-SERIF (Poppins) for the name, section headers
// and job titles, paired with a SERIF (Merriweather) for body text — pure black,
// ~34pt margins, sizes: name 22 · job title 12.5 · section 11 · body 9.
// This module does NOT register fonts (so Node tests can register from paths).

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { parseMarkdown, type Block, type Segment } from "./parse";

const HEAD = "Poppins"; // sans-serif: name, section headers, job titles
const BODY = "Merriweather"; // serif: contact, summary, meta, bullets
const BLACK = "#000000";

// Metrics matched to issues_cv/Resume_Yugo.pdf:
// Letter page, ~34pt margins, body Merriweather 9pt with 12.8pt leading (~1.42x),
// headings Poppins semibold (name 22.5 / job title 12.6 / section 10.8),
// meta line Poppins regular 9pt black. All text pure black.
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
  h1: {
    fontFamily: HEAD,
    fontWeight: "semibold",
    fontSize: 22.5,
    lineHeight: 1.1,
    marginBottom: 5,
  },
  h2: {
    fontFamily: HEAD,
    fontWeight: "semibold",
    fontSize: 10.8,
    letterSpacing: 0.2,
    marginTop: 16,
    marginBottom: 6,
  },
  h3: {
    fontFamily: HEAD,
    fontWeight: "semibold",
    fontSize: 12.6,
    marginTop: 13,
    marginBottom: 1,
  },
  subhead: {
    fontFamily: HEAD,
    fontWeight: "semibold",
    fontSize: 9.5,
    marginTop: 7,
    marginBottom: 1,
  },
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
  bulletRowSub: { flexDirection: "row", marginBottom: 2, marginLeft: 12 },
  bulletDot: { fontFamily: BODY, fontSize: 9, width: 10, lineHeight: LEAD },
  bulletText: { fontFamily: BODY, fontSize: 9, flex: 1, lineHeight: LEAD },
  hr: { borderBottomWidth: 0.5, borderBottomColor: "#cccccc", marginVertical: 3 },
  bold: { fontFamily: BODY, fontWeight: "bold" },
});

function Inline({ segments }: { segments: Segment[] }) {
  return (
    <>
      {segments.map((s, i) => (
        <Text key={i} style={s.bold ? styles.bold : undefined}>
          {s.text}
        </Text>
      ))}
    </>
  );
}

function renderBlock(block: Block, key: number) {
  switch (block.type) {
    case "hr":
      // Dividers are omitted (section-header underline is the only rule).
      return null;
    case "h1":
      return (
        <Text key={key} style={styles.h1}>
          {block.segments.map((s) => s.text).join("")}
        </Text>
      );
    case "h2":
      return (
        <Text key={key} style={styles.h2}>
          {block.text}
        </Text>
      );
    case "h3":
      return (
        <Text key={key} style={styles.h3}>
          {block.text}
        </Text>
      );
    case "meta":
      return (
        <Text key={key} style={styles.meta}>
          <Inline segments={block.segments} />
        </Text>
      );
    case "subhead":
      return (
        <Text key={key} style={styles.subhead}>
          {block.segments.map((s) => s.text).join("")}
        </Text>
      );
    case "para":
      return (
        <Text key={key} style={styles.para}>
          <Inline segments={block.segments} />
        </Text>
      );
    case "bullet":
      return (
        <View
          key={key}
          style={block.sub ? styles.bulletRowSub : styles.bulletRow}
        >
          <Text style={styles.bulletDot}>{block.sub ? "-" : "•"}</Text>
          <Text style={styles.bulletText}>
            <Inline segments={block.segments} />
          </Text>
        </View>
      );
    default:
      return null;
  }
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
