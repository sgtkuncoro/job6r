import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Pdf02Icon,
  SourceCodeIcon,
  Pdf01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { markdownToHtml, SAMPLE_RESUME } from "@job6r/md2pdf";

// CodeMirror is client-only (it touches the DOM). Lazy-load it so it never
// enters the Cloudflare Workers SSR bundle.
const MarkdownEditor = lazy(() => import("../components/MarkdownEditor"));

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [markdown, setMarkdown] = useState(SAMPLE_RESUME);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Render the plain textarea on the server and the first client paint (so
  // hydration matches), then swap in CodeMirror once mounted on the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Mobile only: which pane the tab bar shows. Ignored on large screens, where
  // both panes are always visible side by side.
  const [tab, setTab] = useState<"editor" | "preview">("editor");

  const html = useMemo(() => markdownToHtml(markdown), [markdown]);

  const fallbackEditor = (
    <textarea
      className="editor"
      value={markdown}
      spellCheck={false}
      onChange={(e) => setMarkdown(e.target.value)}
    />
  );

  async function downloadPdf() {
    setBusy(true);
    setError(null);
    try {
      // Import the react-pdf renderer lazily, client-side only.
      const { renderResumePdfBlob } = await import("@job6r/md2pdf/pdf");
      const blob = await renderResumePdfBlob(markdown);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate PDF");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="app">
      <header className="topbar">
        <div>
          <h1>mdtopdf.job6r</h1>
          <p className="sub">
            Free Markdown to PDF converter. Paste Markdown, download a clean,
            ATS-friendly PDF.
          </p>
        </div>
        <button className="btn" onClick={downloadPdf} disabled={busy}>
          <HugeiconsIcon
            icon={busy ? Loading03Icon : Pdf02Icon}
            size={18}
            strokeWidth={2}
            className={busy ? "spin" : undefined}
          />
          {busy ? "Generating…" : "Download PDF"}
        </button>
      </header>

      {error && <div className="error">{error}</div>}

      {/* Tab bar: only visible on small screens (CSS). Switches the single
          visible pane between the editor and the preview. */}
      <div className="tabs" role="tablist" aria-label="Editor or preview">
        <button
          type="button"
          role="tab"
          className="tab"
          aria-selected={tab === "editor"}
          onClick={() => setTab("editor")}
        >
          <HugeiconsIcon icon={SourceCodeIcon} size={15} strokeWidth={2} />
          Markdown
        </button>
        <button
          type="button"
          role="tab"
          className="tab"
          aria-selected={tab === "preview"}
          onClick={() => setTab("preview")}
        >
          <HugeiconsIcon icon={Pdf01Icon} size={15} strokeWidth={2} />
          Preview
        </button>
      </div>

      <section className="panes" data-tab={tab}>
        <div className="pane pane--editor">
          <div className="pane-label">
            <HugeiconsIcon icon={SourceCodeIcon} size={15} strokeWidth={2} />
            Markdown
          </div>
          {mounted ? (
            <Suspense fallback={fallbackEditor}>
              <MarkdownEditor value={markdown} onChange={setMarkdown} />
            </Suspense>
          ) : (
            fallbackEditor
          )}
        </div>
        <div className="pane pane--preview">
          <div className="pane-label">
            <HugeiconsIcon icon={Pdf01Icon} size={15} strokeWidth={2} />
            Preview
          </div>
          <div
            className="preview"
            // Content is the user's own markdown rendered for preview only.
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </section>
    </main>
  );
}
