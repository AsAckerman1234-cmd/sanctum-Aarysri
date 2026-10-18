import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { BookOpen, ChevronLeft, ChevronRight, LoaderCircle, X, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.min.mjs", import.meta.url).toString();

type SagaDocument = {
  title: string;
  url: string;
};

export function SagaPdfReader({ document }: { document: SagaDocument | null }) {
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [error, setError] = useState(false);
  const [shielded, setShielded] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const onClose = () => window.dispatchEvent(new CustomEvent("saga-reader-close"));

  useEffect(() => {
    if (!document) return;
    const previousOverflow = window.document.body.style.overflow;
    window.document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (event.key === "Escape") onClose();
      if (event.key === "PrintScreen" || ((event.ctrlKey || event.metaKey) && event.shiftKey && key === "s")) {
        event.preventDefault();
        setShielded(true);
        window.setTimeout(() => setShielded(false), 1800);
      }
      if ((event.ctrlKey || event.metaKey) && ["p", "s"].includes(key)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    const handleContextMenu = (event: MouseEvent) => event.preventDefault();
    window.addEventListener("keydown", handleKeyDown, true);
    window.document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown, true);
      window.document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [document]);

  useEffect(() => {
    if (!document || !viewportRef.current) return;
    const element = viewportRef.current;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [document]);


  if (!document) return null;

  const pageWidth = Math.max(220, Math.min(containerWidth - 48, 920) * scale);

  return createPortal(
    <div
      className="saga-reader-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${document.title} PDF preview`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <header className="saga-reader-header">
        <div className="flex min-w-0 items-center gap-3">
          <span className="saga-reader-seal" aria-hidden="true"><BookOpen /></span>
          <div className="min-w-0">
            <p className="saga-reader-eyebrow">THE KALPA SAGA · READING ROOM</p>
            <h2 className="saga-reader-title">{document.title}</h2>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="saga-reader-icon" aria-label="Close preview" onClick={onClose}>
          <X />
        </Button>
      </header>

      <div className="saga-reader-toolbar" aria-label="Document controls">
        <div className="saga-reader-toolgroup">
          <Button variant="ghost" size="icon" className="saga-reader-icon" aria-label="Previous page" disabled={pageNumber <= 1} onClick={() => setPageNumber((page) => Math.max(1, page - 1))}>
            <ChevronLeft />
          </Button>
          <span className="saga-reader-count" aria-live="polite">{pageCount ? `${pageNumber} / ${pageCount}` : "— / —"}</span>
          <Button variant="ghost" size="icon" className="saga-reader-icon" aria-label="Next page" disabled={!pageCount || pageNumber >= pageCount} onClick={() => setPageNumber((page) => Math.min(pageCount, page + 1))}>
            <ChevronRight />
          </Button>
        </div>
        <div className="saga-reader-toolgroup">
          <Button variant="ghost" size="icon" className="saga-reader-icon" aria-label="Zoom out" disabled={scale <= 0.75} onClick={() => setScale((value) => Math.max(0.75, Number((value - 0.15).toFixed(2))))}>
            <ZoomOut />
          </Button>
          <span className="saga-reader-count">{Math.round(scale * 100)}%</span>
          <Button variant="ghost" size="icon" className="saga-reader-icon" aria-label="Zoom in" disabled={scale >= 1.8} onClick={() => setScale((value) => Math.min(1.8, Number((value + 0.15).toFixed(2))))}>
            <ZoomIn />
          </Button>
        </div>
      </div>

      <div className="saga-reader-viewport" ref={viewportRef}>
        {error ? (
          <p className="saga-reader-message" role="alert">This preview could not be opened. Please close it and try again.</p>
        ) : (
          <Document
            key={document.url}
            file={document.url}
            onLoadSuccess={({ numPages }) => { setPageCount(numPages); setPageNumber(1); }}
            onLoadError={() => setError(true)}
            loading={<p className="saga-reader-message"><LoaderCircle className="size-5 animate-spin" /> Opening manuscript…</p>}
            error={<p className="saga-reader-message" role="alert">This preview could not be opened. Please close it and try again.</p>}
            className="saga-pdf-document"
          >
            {pageCount > 0 && containerWidth > 0 && (
              <Page pageNumber={pageNumber} width={pageWidth} devicePixelRatio={Math.min(window.devicePixelRatio || 1, 2)} renderTextLayer={false} renderAnnotationLayer={false} loading={<LoaderCircle className="size-5 animate-spin" />} />
            )}
          </Document>
        )}
      </div>
      {shielded && <div className="saga-reader-shield" role="status">Preview temporarily obscured</div>}
    </div>,
    window.document.body,
  );
}