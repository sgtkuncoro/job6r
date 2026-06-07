# resume.job6r

A small **Turborepo** monorepo: a **TanStack Start** web app that turns a
Markdown resume into an **ATS-friendly PDF** (real, selectable text via
`@react-pdf/renderer` — no rasterized images, no Chromium).

## Structure

```
resume.job6r/
├── apps/
│   └── web/                # TanStack Start app (Vite)
│       └── src/routes/
│           ├── __root.tsx  # HTML shell
│           └── index.tsx   # editor + live preview + Download PDF
└── packages/
    └── md-pdf/             # shared markdown -> PDF / HTML library
        └── src/
            ├── parse.ts          # line-based markdown -> typed blocks
            ├── pdf.tsx           # react-pdf Document + renderResumePdfBlob()
            ├── markdownToHtml.ts # marked-based preview renderer
            └── sample.ts         # default resume markdown
```

## Develop

```bash
pnpm install
pnpm dev            # turbo runs the web app on http://localhost:3000
```

Open the app, edit the Markdown on the left, watch the live preview on the right,
and click **Download PDF** to get a clean, ATS-readable resume PDF.

## Build

```bash
pnpm build          # turbo builds every package/app
pnpm typecheck      # type-check the workspace
```

## How the PDF stays ATS-friendly

`@react-pdf/renderer` emits real text with the built-in Helvetica family (so an
ATS extracts actual characters), in a single-column layout with standard
headings — the format parsers handle most reliably. Links like `[LinkedIn](url)`
are rendered as readable text so the target stays visible.

## The `md-pdf` package

- `parseMarkdown(md)` → typed blocks (h1/h2/h3, bullets, meta, paragraphs).
- `markdownToHtml(md)` → HTML string for the preview (SSR-safe).
- `renderResumePdfBlob(md)` (from `@resume/md-pdf/pdf`) → a `Blob` for download.
  Imported lazily on the client so react-pdf never runs during SSR.

> Convention: write each block (heading, bullet, paragraph) on a single line.
> The parser is line-based, so avoid hard-wrapping a bullet across lines.
