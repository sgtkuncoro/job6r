import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Pdf02Icon,
  SourceCodeIcon,
  Pdf01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { Group, Panel, Separator } from "react-resizable-panels";
import { markdownToHtml, SAMPLE_RESUME } from "@job6r/md2pdf";

// CodeMirror is client-only (it touches the DOM). Lazy-load it so it never
// enters the Cloudflare Workers SSR bundle.
const MarkdownEditor = lazy(() => import("../components/MarkdownEditor"));

// localStorage key for the persisted editor/preview split.
const PANES_STORAGE_KEY = "mdtopdf:panes-layout";

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
  // Mobile only: which pane the tab bar shows.
  const [tab, setTab] = useState<"editor" | "preview">("editor");
  // Which layout to render once mounted: tabs (small) or resizable (large).
  const [isMobile, setIsMobile] = useState(false);
  // Persisted split (panel id -> percentage). Read on the client only so SSR
  // and the first client paint stay deterministic (a 50/50 grid).
  const [layout, setLayout] = useState<Record<string, number> | undefined>(
    undefined,
  );
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(PANES_STORAGE_KEY);
      if (saved) setLayout(JSON.parse(saved) as Record<string, number>);
    } catch {
      // ignore unreadable / corrupt storage
    }
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

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

  const editorBody = (
    <>
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
    </>
  );

  const previewBody = (
    <>
      <div className="pane-label">
        <HugeiconsIcon icon={Pdf01Icon} size={15} strokeWidth={2} />
        Preview
      </div>
      <div
        className="preview"
        // Content is the user's own markdown rendered for preview only.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );

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

      {!mounted ? (
        // Server + first client paint: static 50/50 grid (hydration-safe).
        <section className="panes">
          <div className="pane">{editorBody}</div>
          <div className="pane">{previewBody}</div>
        </section>
      ) : isMobile ? (
        // Small screens: a tab bar switches the single visible pane.
        <>
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
            <div className="pane pane--editor">{editorBody}</div>
            <div className="pane pane--preview">{previewBody}</div>
          </section>
        </>
      ) : (
        // Large screens: draggable resizable split with persisted layout.
        <Group
          className="panes-rz"
          orientation="horizontal"
          defaultLayout={layout}
          onLayoutChanged={(next) => {
            try {
              localStorage.setItem(PANES_STORAGE_KEY, JSON.stringify(next));
            } catch {
              // ignore storage write failures (private mode / quota)
            }
          }}
        >
          <Panel id="editor" className="pane" defaultSize="50%" minSize="25%">
            {editorBody}
          </Panel>
          <Separator className="pane-separator" aria-label="Resize panels" />
          <Panel id="preview" className="pane" defaultSize="50%" minSize="25%">
            {previewBody}
          </Panel>
        </Group>
      )}
    </main>
  );
}
