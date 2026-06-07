import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Download04Icon,
  SourceCodeIcon,
  ViewIcon,
  SparklesIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { markdownToHtml, SAMPLE_RESUME } from "@resume/md-pdf";

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
      const { renderResumePdfBlob } = await import("@resume/md-pdf/pdf");
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
            resume.job6r
          </h1>
          <p className="sub">Markdown in, ATS-friendly PDF out.</p>
        </div>
        <button className="btn" onClick={downloadPdf} disabled={busy}>
          <HugeiconsIcon
            icon={busy ? Loading03Icon : Download04Icon}
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
