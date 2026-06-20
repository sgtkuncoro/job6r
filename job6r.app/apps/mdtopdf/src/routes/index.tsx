import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Pdf02Icon,
  SourceCodeIcon,
  ViewIcon,
  SparklesIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { markdownToHtml, SAMPLE_RESUME } from "@job6r/md2pdf";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [markdown, setMarkdown] = useState(SAMPLE_RESUME);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const html = useMemo(() => markdownToHtml(markdown), [markdown]);

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
          <h1>
            <HugeiconsIcon icon={SparklesIcon} size={20} strokeWidth={2} />
            job6r.app
          </h1>
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

      <section className="panes">
        <div className="pane">
          <div className="pane-label">
            <HugeiconsIcon icon={SourceCodeIcon} size={15} strokeWidth={2} />
            Markdown
          </div>
          <textarea
            className="editor"
            value={markdown}
            spellCheck={false}
            onChange={(e) => setMarkdown(e.target.value)}
          />
        </div>
        <div className="pane">
          <div className="pane-label">
            <HugeiconsIcon icon={ViewIcon} size={15} strokeWidth={2} />
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
