import { createFileRoute } from "@tanstack/react-router";
import { RealmShell } from "@/components/realm/RealmShell";
import { DivineButton } from "@/components/realm/GlassCard";
import { SacredGeometry } from "@/components/realm/SacredGeometry";

export const Route = createFileRoute("/books")({
  head: () => ({
    meta: [
      { title: "Books: Aryan Srivastava" },
      { name: "description", content: "An untitled book: twelve character driven chapters, one shared world." },
    ],
  }),
  component: Books,
});

function Books() {
  return (
    <RealmShell>
      <div className="text-center pt-10 sm:pt-16" data-reveal>
        <div className="mx-auto mb-8 w-28 sm:w-36 text-[color:var(--r-bright)] opacity-70">
          <SacredGeometry className="spin" />
        </div>
        <div className="r-eyebrow">B5 · The Untitled</div>
        <h1 className="r-title gold-text">Soon…</h1>
        <p className="r-lede">
          Twelve chapters, one world, one quiet thread beneath them all. It is being written slowly, honestly.
        </p>
        <div className="mt-10">
          <DivineButton to="/art-writing">← Return to the Vault</DivineButton>
        </div>
      </div>
    </RealmShell>
  );
}
