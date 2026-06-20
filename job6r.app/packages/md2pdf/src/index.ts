// SSR-safe entry. Does NOT import ./pdf (which pulls in @react-pdf/renderer);
// import the PDF renderer lazily from "@job6r/md2pdf/pdf" on the client.
export { parseMarkdown, parseInline, stripAll } from "./parse";
export type { Block, Segment, ListItem, TableCell } from "./parse";
export { markdownToHtml } from "./markdownToHtml";
export { SAMPLE_RESUME } from "./sample";
