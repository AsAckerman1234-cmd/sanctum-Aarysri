import { useEffect, useState } from "react";

export function CopyrightNotice({ storageKey: _storageKey }: { storageKey?: string }) {
  // Show on every visit to the page (fires on each mount / navigation).
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);
  const close = () => setOpen(false);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-500">
      <div className="glass max-w-xl w-full p-6 sm:p-8 text-center animate-in zoom-in-95 duration-500">
        <div className="gold-text text-3xl font-serif mb-3">ॐ</div>
        <p className="italic text-sm sm:text-base leading-relaxed">
          <strong className="not-italic block mb-3 text-base sm:text-lg">
            © 2026 Aryan Srivastava | All Rights Reserved under the Indian Copyright Act, 1957.
          </strong>
          All content on this website, including novel chapters, characters, plots, digital illustrations, and posters, is the exclusive intellectual property of the author. Any unauthorized copying, modification, or distribution is a punishable offense under Indian law.
        </p>
        <button onClick={close} className="btn-mystic mt-6">Enter</button>
      </div>
    </div>
  );
}