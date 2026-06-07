// Registers the resume's two families with react-pdf using Vite asset URLs:
//   Poppins (sans)   -> name, section headers, job titles
//   Merriweather (serif) -> body text
// Exposed as an explicit function (called from renderResumePdfBlob) so the
// bundler can't tree-shake the registration or the woff assets.
import { Font } from "@react-pdf/renderer";
import mwRegular from "./fonts/Merriweather-Regular.woff?url";
import mwBold from "./fonts/Merriweather-Bold.woff?url";
import mwItalic from "./fonts/Merriweather-Italic.woff?url";
import mwBoldItalic from "./fonts/Merriweather-BoldItalic.woff?url";
import poppinsThin from "./fonts/Poppins-Thin.woff?url";
import poppinsLight from "./fonts/Poppins-Light.woff?url";
import poppinsRegular from "./fonts/Poppins-Regular.woff?url";
import poppinsSemiBold from "./fonts/Poppins-SemiBold.woff?url";
import poppinsBold from "./fonts/Poppins-Bold.woff?url";

let registered = false;

export function ensureFonts(): void {
  if (registered) return;
  registered = true;
  Font.register({
    family: "Merriweather",
    fonts: [
      { src: mwRegular, fontWeight: "normal", fontStyle: "normal" },
      { src: mwBold, fontWeight: "bold", fontStyle: "normal" },
      { src: mwItalic, fontWeight: "normal", fontStyle: "italic" },
      { src: mwBoldItalic, fontWeight: "bold", fontStyle: "italic" },
    ],
  });
  Font.register({
    family: "Poppins",
    fonts: [
      { src: poppinsThin, fontWeight: "thin" },
      { src: poppinsLight, fontWeight: "light" },
      { src: poppinsRegular, fontWeight: "normal" },
      { src: poppinsSemiBold, fontWeight: "semibold" },
      { src: poppinsBold, fontWeight: "bold" },
    ],
  });
  // Resume convention: no hyphenation / word-splitting.
  Font.registerHyphenationCallback((word) => [word]);
}
