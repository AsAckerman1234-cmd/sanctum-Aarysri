import { useEffect } from "react";

export function Lightbox({ src, onClose }: { src: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!src) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [src, onClose]);
  if (!src) return null;
  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal>
      <img src={src} alt="" onClick={(e) => e.stopPropagation()} />
      <button onClick={onClose} className="absolute top-6 right-6 btn-mystic" aria-label="Close">
        ✕ Close
      </button>
    </div>
  );
}