import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import type { MedicalEvent } from "../types";

// The PDF.js worker must be configured in the same file that renders <Document>.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const FILE_URL = "/claim-file.pdf";

interface SourceViewerProps {
  event: MedicalEvent;
  onClose: () => void;
}

const squash = (text: string) => text.replace(/\s+/g, "");

export function findExcerptItems(items: object[], excerpt: string) {
  const target = squash(excerpt);
  for (let start = 0; start < items.length; start++) {
    let text = "";
    for (let end = start; end < items.length; end++) {
      const item = items[end];
      text += "str" in item ? squash(String(item.str)) : "";
      if (!target.startsWith(text)) break;
      if (text === target) {
        return new Set(
          Array.from({ length: end - start + 1 }, (_, i) => start + i),
        );
      }
    }
  }
  return new Set<number>();
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default function SourceViewer({ event, onClose }: SourceViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pageNumber, setPageNumber] = useState(event.sourcePage);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [highlighted, setHighlighted] = useState<Set<number>>(new Set());
  const onCitedPage = pageNumber === event.sourcePage;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  function goTo(page: number) {
    if (numPages === null) return;
    setPageNumber(Math.min(Math.max(page, 1), numPages));
  }

  // Highlight the cited excerpt's text on the cited page.
  const renderText = useCallback(
    ({ str, itemIndex }: { str: string; itemIndex: number }) =>
      highlighted.has(itemIndex)
        ? `<mark>${escapeHtml(str)}</mark>`
        : escapeHtml(str),
    [highlighted],
  );

  return (
    <dialog
      ref={dialogRef}
      className="viewer"
      aria-labelledby="viewer-title"
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") goTo(pageNumber + 1);
        if (e.key === "ArrowLeft") goTo(pageNumber - 1);
      }}
    >
      <header className="viewer__bar">
        <div>
          <h2 id="viewer-title" className="viewer__title">
            {event.document}
          </h2>
          <p className="viewer__sub">Cited for: {event.title}</p>
        </div>
        <button
          type="button"
          className="btn"
          aria-label="Close document"
          onClick={() => dialogRef.current?.close()}
        >
          ✕
        </button>
      </header>

      <nav className="viewer__nav" aria-label="Page navigation">
        <button
          type="button"
          className="btn"
          disabled={pageNumber <= 1}
          onClick={() => goTo(pageNumber - 1)}
        >
          ‹ Previous
        </button>
        <p className="viewer__page" aria-live="polite">
          Page {pageNumber}
          {numPages !== null && ` of ${numPages}`}
          {onCitedPage && <span className="badge badge--key">Cited page</span>}
        </p>
        <button
          type="button"
          className="btn"
          disabled={numPages === null || pageNumber >= numPages}
          onClick={() => goTo(pageNumber + 1)}
        >
          Next ›
        </button>
        {!onCitedPage && (
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => goTo(event.sourcePage)}
          >
            Back to cited page
          </button>
        )}
      </nav>

      <div className="viewer__body">
        <Document
          file={FILE_URL}
          suspense={false}
          loading={<p className="status-message">Loading document…</p>}
          error={<p className="status-message">Couldn't load the document.</p>}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          <Page
            pageNumber={pageNumber}
            width={Math.min(720, window.innerWidth - 64)}
            renderAnnotationLayer={false}
            customTextRenderer={renderText}
            onGetTextSuccess={({ items }) =>
              setHighlighted(
                onCitedPage
                  ? findExcerptItems(items, event.excerpt)
                  : new Set(),
              )
            }
            loading={<p className="status-message">Loading page…</p>}
          />
        </Document>
      </div>
    </dialog>
  );
}
