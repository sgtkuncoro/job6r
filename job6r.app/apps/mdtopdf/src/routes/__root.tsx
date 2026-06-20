import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import appCss from "../styles.css?url";

const SITE_URL = "https://mdtopdf-job6r.sigit-kunc.workers.dev";
const TITLE = "Markdown to PDF - Free Online Converter | mdtopdf.job6r";
const DESCRIPTION =
  "Convert Markdown to PDF online for free. Paste Markdown, preview live, and download a clean, ATS-friendly PDF with real selectable text - tables, code blocks, lists, and images included.";

const STRUCTURED_DATA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "mdtopdf.job6r",
  url: `${SITE_URL}/`,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any (web browser)",
  description: DESCRIPTION,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Markdown to PDF conversion",
    "Live Markdown preview",
    "ATS-friendly PDF with real selectable text",
    "Tables, code blocks, ordered, unordered and task lists, images",
  ],
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#0a0a0a" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "mdtopdf.job6r" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/` },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: `${SITE_URL}/` },
    ],
    scripts: [{ type: "application/ld+json", children: STRUCTURED_DATA }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
