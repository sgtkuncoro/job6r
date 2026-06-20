# job6r.app

A **Turborepo** monorepo of small web apps under the `job6r.app` umbrella.
Shared libraries are published internally as `@job6r/<name>`.

The first app, `apps/mdtopdf`, is a free **Markdown to PDF** converter: a
**TanStack Start** web app that turns Markdown into a clean, **ATS-friendly PDF**
with real, selectable text via `@react-pdf/renderer` (no rasterized images, no
Chromium).

It supports the full CommonMark + GitHub-Flavored Markdown surface (the same set
[markdowntopdf.com](https://www.markdowntopdf.com/) renders): headings `#` to
`######`, **bold** / _italic_ / ~~strikethrough~~ / `inline code`, ordered,
unordered, nested and task lists, blockquotes, fenced code blocks, tables,
images, links, and horizontal rules. Parsing runs through `marked`, so anything
valid markdown renders consistently in both the live preview and the PDF.

**Live: <https://mdtopdf-job6r.sigit-kunc.workers.dev>** (Cloudflare Workers).

## Structure

```
job6r.app/
├── apps/
│   └── mdtopdf/            # TanStack Start app (Vite)
│       └── src/routes/
│           ├── __root.tsx  # HTML shell
│           └── index.tsx   # editor + live preview + Download PDF
└── packages/
    └── md2pdf/             # shared markdown -> PDF / HTML library (@job6r/md2pdf)
        └── src/
            ├── parse.ts          # marked lexer -> typed blocks (full markdown)
            ├── document.tsx      # blocks -> react-pdf Document
            ├── pdf.tsx           # renderResumePdfBlob() client entry
            ├── markdownToHtml.ts # blocks -> preview HTML (same blocks as PDF)
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
keep their label as visible, selectable text (and stay clickable), and code uses
the built-in Courier so everything in the PDF remains real extractable text.

## The `@job6r/md2pdf` package

- `parseMarkdown(md)` → a recursive list of typed blocks (headings, lists,
  tables, blockquotes, code, images, paragraphs) produced by the `marked` lexer.
- `markdownToHtml(md)` → HTML string for the preview (SSR-safe), built from the
  same blocks the PDF uses, so preview and PDF stay in sync.
- `renderResumePdfBlob(md)` (from `@job6r/md2pdf/pdf`) → a `Blob` for download.
  Imported lazily on the client so react-pdf never runs during SSR.

Two resume-friendly heuristics sit on top of standard markdown: a line that is
only italic becomes a tight "meta" line (dates / location), and a line that is
only a bold label becomes a "subhead". Standard markdown rules otherwise apply,
so separate stacked lines need a blank line between them.
