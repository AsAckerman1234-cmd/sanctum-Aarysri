import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RealmShell } from "@/components/realm/RealmShell";
import { GlassCard, DivineButton } from "@/components/realm/GlassCard";
import { Slideshow } from "@/components/Slideshow";
import { Lightbox } from "@/components/Lightbox";
import { CopyrightNotice } from "@/components/CopyrightNotice";
import { Protected } from "@/components/Protected";
import { IMG } from "@/lib/assets";

export const Route = createFileRoute("/art-writing")({
  head: () => ({
    meta: [
      { title: "Art & Writing — Aryan Srivastava" },
      { name: "description", content: "Digital art, characters, and stories from the Kalpa Saga universe." },
      { property: "og:title", content: "Art & Writing — Aryan Srivastava" },
      { property: "og:image", content: IMG.Cover },
    ],
  }),
  component: ArtWriting,
});

const slides = [IMG.Aradhika, IMG.Cover, IMG.Valley, IMG.Marshal];
const gallery = [
  // Layout mirrors the B1 sketch: 8 left, 9 centre, 10 right, 11 left, 12 centre-bottom
  { src: IMG.Aradhika, label: "Aradhika", left: 3, top: 0, z: 50, rot: -1.5, delay: "0s" },
  { src: IMG.Tanya4, label: "Tanya · Release Form", left: 28, top: 15, z: 40, rot: 1, delay: "1.1s" },
  { src: IMG.Marshal, label: "Marshal", left: 51, top: 30, z: 30, rot: -1, delay: "2.2s" },
  { src: IMG.Valley, label: "Valley of Death", left: 5, top: 44, z: 35, rot: 1.5, delay: "0.6s" },
  { src: IMG.Cover, label: "The Kalpa Saga · Cover", left: 20, top: 63, z: 45, rot: -1, delay: "1.7s" },
];

function ArtWriting() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <Protected>
      <CopyrightNotice storageKey="cr-b1" />
      <RealmShell>
        <header className="text-center mb-12" data-reveal>
          <div className="r-eyebrow">B1 · The Vault</div>
          <h1 className="r-title gold-text">Art &amp; Writing</h1>
          <div className="r-orn" aria-hidden />
          <p className="r-lede">
            Two languages through which I explore ideas, emotions, and imagination — worlds given form, stories given breath.
          </p>
        </header>

        <div className="r-frame" data-reveal>
          <Slideshow images={slides} className="h-[60vh] min-h-[420px]" />
        </div>

        {/* Overlapping collage — same proportional layout on every screen */}
        <section
          className="w-full max-w-4xl mx-auto mt-6 sm:-mt-10" data-reveal
          style={{ position: "relative", height: 0, paddingBottom: "150%" }}
        >
          {gallery.map((g) => (
            <button
              key={g.src}
              onClick={() => setOpen(g.src)}
              className="glass glass-hover lit-frame float-soft overflow-hidden group absolute transition-all duration-700 hover:!z-[60]"
              style={{
                animationDelay: g.delay,
                position: "absolute",
                zIndex: g.z,
                rotate: `${g.rot}deg`,
                left: `${g.left}%`,
                top: `${g.top}%`,
                width: "46%",
              }}
            >
              <div className="relative">
                <img
                  src={g.src}
                  alt={g.label}
                  loading="lazy"
                  className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3 sm:bottom-4 sm:left-5 text-left">
                  <div className="r-eyebrow !text-[8px] sm:!text-[10px]">Illustration</div>
                  <div className="font-serif text-sm sm:text-lg leading-tight">{g.label}</div>
                </div>
              </div>
            </button>
          ))}
        </section>

        <Lightbox src={open} onClose={() => setOpen(null)} />

        <div className="divider-om mt-24 mb-14" data-reveal />

        <section className="grid md:grid-cols-2 gap-8">
          <GlassCard>
            <div className="r-eyebrow mb-3">Ongoing</div>
            <h2 className="mb-4">Novel</h2>
            <p className="opacity-85 leading-relaxed">
              The novel I am writing now is a philosophical fantasy that explores the delicate balance between destiny and free will, love and sacrifice, light and darkness. While it unfolds through mystery, adventure, and the supernatural, its true focus lies in the emotions, choices, and growth of its characters.
            </p>
            <p className="opacity-85 leading-relaxed mt-3">
              Rather than offering simple answers, this story invites you to ask questions, reflect, and experience a world where every action has meaning, and every journey leaves a mark.
            </p>
            <DivineButton to="/kalpa-saga" className="mt-6">Enter the Saga →</DivineButton>
          </GlassCard>

          <GlassCard>
            <div className="r-eyebrow mb-3">Untitled · In progress</div>
            <h2 className="mb-4">Books</h2>
            <p className="opacity-85 leading-relaxed">
              Currently working on an untitled book, twelve character driven chapters, one shared world, one quiet thread beneath them all. It doesn't explain big ideas like struggle, power, or peace; it makes you live them through people who have no choice but to face them. If it works, you'll close the book understanding a little more of your own.
            </p>
            <DivineButton to="/books" className="mt-6">Read more →</DivineButton>
          </GlassCard>
        </section>
      </RealmShell>
    </Protected>
  );
}