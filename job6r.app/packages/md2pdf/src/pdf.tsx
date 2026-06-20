// Client entry for PDF generation. Registers Merriweather (via ensureMerriweather)
// then renders the document. Imported lazily on the client only (keeps react-pdf
// out of the SSR path).
import { pdf } from "@react-pdf/renderer";
import { ResumeDocument } from "./document";
import { ensureFonts } from "./registerFonts";

export { ResumeDocument } from "./document";

// Generate the PDF as a Blob (client-side), ready to download.
export async function renderResumePdfBlob(markdown: string): Promise<Blob> {
  ensureFonts();
  return await pdf(<ResumeDocument markdown={markdown} />).toBlob();
}
