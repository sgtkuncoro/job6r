import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

// CodeMirror's default highlight style only gives markdown prose tags a weight
// or underline (no color), so headings/links/etc. look monochrome. This maps the
// markdown tags to explicit colors that match the app's blue accent palette.
const markdownHighlight = HighlightStyle.define([
  { tag: t.heading1, color: "#1d4ed8", fontWeight: "700" },
  { tag: t.heading2, color: "#2563eb", fontWeight: "700" },
  {
    tag: [t.heading3, t.heading4, t.heading5, t.heading6],
    color: "#2563eb",
    fontWeight: "600",
  },
  { tag: t.strong, color: "#b91c1c", fontWeight: "700" },
  { tag: t.emphasis, color: "#b45309", fontStyle: "italic" },
  { tag: t.strikethrough, color: "#6b7280", textDecoration: "line-through" },
  { tag: t.link, color: "#2563eb", textDecoration: "underline" },
  { tag: t.url, color: "#6b7280" },
  { tag: t.monospace, color: "#0f766e" },
  { tag: t.quote, color: "#6b7280", fontStyle: "italic" },
  { tag: [t.list, t.contentSeparator], color: "#7c3aed" },
  { tag: t.processingInstruction, color: "#9ca3af" },
]);

// CodeMirror touches the DOM, so this module is only ever loaded client-side
// (lazy-imported after mount). Keeping it in its own file keeps CodeMirror out
// of the Workers SSR bundle.
export default function MarkdownEditor({ value, onChange }: Props) {
  return (
    <CodeMirror
      className="editor-cm"
      value={value}
      onChange={onChange}
      theme="light"
      height="100%"
      basicSetup={{
        lineNumbers: true,
        foldGutter: false,
        highlightActiveLine: true,
        highlightActiveLineGutter: true,
        autocompletion: false,
      }}
      extensions={[
        markdown(),
        syntaxHighlighting(markdownHighlight),
        EditorView.lineWrapping,
      ]}
    />
  );
}
