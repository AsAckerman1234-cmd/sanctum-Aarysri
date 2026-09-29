import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { TextSlideshow } from "@/components/Slideshow";

export const Route = createFileRoute("/pov")({
  head: () => ({
    meta: [
      { title: "POV — Aryan Srivastava" },
      { name: "description", content: "Philosophy, science, and commentary — a point of view rendered as stories." },
    ],
  }),
  component: POV,
});

function POV() {
  return (
    <PageShell>
      <div className="text-center mb-16">
        <div className="text-xs uppercase tracking-[0.3em] opacity-70">B2 · The Lens</div>
        <h1 className="font-serif text-4xl sm:text-6xl mt-2 gold-text">Point of View</h1>
      </div>

      <section className="glass p-8 sm:p-12 mb-16">
        <div className="space-y-4 opacity-90 leading-relaxed max-w-3xl mx-auto">
          <p>My perspective is shaped by a constant curiosity about people, society, and the ideas that influence the way we think and live. I enjoy exploring subjects through philosophical reflection, psychological understanding, and logical reasoning, letting different perspectives come together rather than relying on a single viewpoint.</p>
          <p>I believe stories are one of the most powerful ways to communicate an idea. Instead of presenting opinions as isolated arguments, I express them through narratives that invite reflection and encourage deeper thought.</p>
          <p>You will find this philosophy reflected throughout my writing, where every story strives to entertain while also leaving behind a question, an insight, or a new way of looking at the world.</p>
        </div>
      </section>

      <TextSlideshow words={["Philosophies", "Science", "Commentaries", "Scriptures", "Reflection"]} />

      <div className="text-center mt-16">
        <p className="font-serif text-3xl gold-text tracking-widest">Soon…</p>
        <p className="opacity-60 mt-3 text-sm">This chamber is still being carved.</p>
      </div>
    </PageShell>
  );
}