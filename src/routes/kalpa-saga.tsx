import { createFileRoute } from "@tanstack/react-router";
import { RealmShell } from "@/components/realm/RealmShell";
import { SacredGeometry } from "@/components/realm/SacredGeometry";
import { CopyrightNotice } from "@/components/CopyrightNotice";
import { Protected } from "@/components/Protected";
import { IMG } from "@/lib/assets";
import { lazy, Suspense, useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
// pdf.js needs browser APIs, so the reader is loaded on the client only, when first opened.
const SagaPdfReader = lazy(() =>
  import("@/components/SagaPdfReader").then((m) => ({ default: m.SagaPdfReader })),
);
import prefacePdf from "@/assets/Preface_KalpaSaga.pdf?url";
import prologuePdf from "@/assets/Prologue-3.pdf?url";
import samvadPdf from "@/assets/Samvad_The_Kalpa_Saga.pdf?url";
import destinyPdf from "@/assets/Ist The Beginning & The Dream_The Destiny.pdf?url";
import beginningPdf from "@/assets/The Beginning & The Dream_The Beginning.pdf?url";

export const Route = createFileRoute("/kalpa-saga")({
  head: () => ({
    meta: [
      { title: "The Kalpa Saga — Aryan Srivastava" },
      { name: "description", content: "The Kalpa Saga — a long form mythological, spiritual epic exploring karma across cycles of creation." },
      { property: "og:title", content: "The Kalpa Saga — Aryan Srivastava" },
      { property: "og:description", content: "Explore the mythic world of The Kalpa Saga and read three manuscript previews." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: IMG.Cover },
    ],
  }),
  component: Saga,
});

const previews = [
  {
    heading: "The Introduction to the SAGA",
    pdf: { title: "The Introduction to the Saga", url: prefacePdf },
    body: `Before the first name was spoken, before the first fire was lit, there was a rhythm, a cycle that breathed the universe in and out. This is the memory the Saga tries to hold, not a beginning, but a returning. Every character you will meet has walked these plains before under a different sky, carrying a different sorrow that resembles their own too closely to be coincidence.

The Kalpa Saga is not written to be read once. It is written to be recognised, the way a forgotten dream recognises you when you finally sit still enough to hear it.`,
  },
  {
    heading: "Prologue",
    pdf: { title: "Prologue", url: prologuePdf },
    body: `Every story has a beginning. Some begin with a moment. Others begin with a question. 
This one begins with a conversation where dreams, consciousness, destiny, and reality quietly begin to intertwine.
What seems like a simple exchange soon opens the door to questions far deeper than they appear.

And beyond the mist, something has already begun to unfold.

`,
  },
  {
    heading: "SAMVAD — Author's commentary",
    pdf: { title: "Samvad — Author's Commentary", url: samvadPdf },
    body: `[Optional reading] A conversation between two eternal forces of existence- one that remembers everything, one that forgets on purpose. The Samvad sits beside the Saga the way a shadow sits beside a lamp: not the source, not separate, just what the light cannot help but cast.

If the novel is the wound, the Samvad is the doctor pretending not to know the patient.`,
  },


{
    heading: "Chapter First",
    pdf: { title: "The Beginning & The Dream_The Destiny", url: destinyPdf },
    body: `A storm. A nightmare that feels too real to be one. A boy who wakes up carrying grief he doesn't understand. 
And a city that holds secrets bigger than anyone in it knows, waiting, like a held breath, for the day someone finally asks the right question.
`,
  },

{
    heading: "Chapter Second",
    pdf: { title: "The Beginning & The Dream_The Beginning", url: beginningPdf },
    body: `The journey moves forward, carrying questions that have no answers yet.
Somewhere beyond what the eyes can see, something has already begun to awaken.
The world remains unchanged, unaware of what is slowly approaching.
But Time knows… every beginning carries the shadow of an ending.
And this is only the beginning.
`,
  },





];

function Saga() {
  const [activeDocument, setActiveDocument] = useState<{ title: string; url: string } | null>(null);

  useEffect(() => {
    const closeReader = () => setActiveDocument(null);
    window.addEventListener("saga-reader-close", closeReader);
    return () => window.removeEventListener("saga-reader-close", closeReader);
  }, []);

  return (
    <Protected>
      <CopyrightNotice storageKey="cr-b4" />
      <RealmShell wide>
        <section className="grid md:grid-cols-[1fr_1.3fr] gap-10 items-center mb-16" data-reveal>
          <div className="glass glass-hover p-3">
            <img src={IMG.Cover} alt="The Kalpa Saga" className="w-full aspect-[2/3] object-cover rounded-2xl" />
          </div>
          <div>
            <div className="r-eyebrow">B4 · The Novel</div>
            <h1 className="r-title gold-text" style={{ fontSize: "clamp(2.6rem, 6.5vw, 5rem)" }}>The Kalpa Saga</h1>
            <p className="r-lede !mx-0 !mt-4">Chronicles of the Divine Cycle</p>
            <div className="mt-6 space-y-4 opacity-90 leading-relaxed">
              <p>A long-form mythological-spiritual epic — my long-term project — born from a single question: <em>what if karma isn't a metaphor, but a memory that refuses to die across cycles of creation?</em></p>
              <p>Blending mythology, philosophy, mystery, politics, ancient and psychological storytelling, the series explores a world where destiny, free will, sacrifice, and the nature of the self intertwine across generations.</p>
              <p>There are no heroes and no villains here — because this isn't just a story, it's a Saga. Every character walks their own path, shaped by their own past, their own choices, their own karma.</p>
            </div>
          </div>
        </section>

        <div className="divider-om my-16" data-reveal />

        <h2 className="text-center mb-10" data-reveal>Some Preview</h2>

        <div className="space-y-10">
          {previews.map((p) => (
            <article key={p.heading} className="glass r-card relative overflow-hidden sm:!p-10" data-reveal>
              <div className="r-seal"><SacredGeometry /></div>
              <div className="relative">
                <div className="r-eyebrow mb-2">Preview · view-only</div>
                <h3 className="mb-4">{p.heading}</h3>
                <div className="whitespace-pre-line opacity-90 leading-relaxed max-w-3xl">
                  {p.body}
                </div>
                <Button className="saga-preview-button mt-7" onClick={() => setActiveDocument(p.pdf)}>
                  <BookOpen aria-hidden="true" /> Read the Preview
                </Button>
              </div>
            </article>
          ))}
        </div>

        <p className="text-center text-xs opacity-50 mt-16 italic max-w-2xl mx-auto">
          Manuscript previews are rendered page by page for on-site reading. Browser-based viewing cannot prevent external screen capture.
        </p>
        {activeDocument && (
          <Suspense fallback={null}>
            <SagaPdfReader document={activeDocument} />
          </Suspense>
        )}
      </RealmShell>
    </Protected>
  );
}