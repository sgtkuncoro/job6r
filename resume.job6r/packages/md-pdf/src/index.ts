// SSR-safe entry. Does NOT import ./pdf (which pulls in @react-pdf/renderer);
// import the PDF renderer lazily from "@resume/md-pdf/pdf" on the client.
export { parseMarkdown, parseInline, stripAll } from "./parse";
export type { Block, Segment } from "./parse";
export { markdownToHtml } from "./markdownToHtml";
export { SAMPLE_RESUME } from "./sample";
