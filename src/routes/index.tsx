import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Slideshow } from "@/components/Slideshow";
import { IMG } from "@/lib/assets";

export const Route = createFileRoute("/")({
  component: Home,
});

const heroImages = [IMG.Cover, IMG.Aradhika, IMG.Tanya4, IMG.Marshal, IMG.Valley, IMG.Tanya3];

const gateways = [
  {
    to: "/art-writing",
    tag: "B1",
    title: "Art & Writing",
    body: "Two languages through which I explore ideas, emotions, and imagination, worlds given form, stories given breath.",
  },
  {
    to: "/pov",
    tag: "B2",
    title: "POV",
    body: "Curiosity about people, society, and the ideas beneath them. Philosophy told through stories, not arguments.",
  },
  {
    to: "/tech-work",
    tag: "B3",
    title: "Tech Work",
    body: "Solving problems with independence and purpose. Private-first tools, AI systems, and utilities I build for myself.",
  },
] as const;

function Home() {
  return (
    <PageShell>
      {/* Block 1 — Hero slideshow */}
      <section className="relative">
        <Slideshow
          images={heroImages}
          className="h-[clamp(460px,68vh,760px)] w-full"
        >
          <div className="absolute inset-0 grid place-items-center px-4 sm:px-6 text-center">
            <div className="max-w-3xl">
              <div className="mb-5 gold-text font-serif tracking-[0.4em] text-[10px] sm:text-xs uppercase">
                ॐ · A cosmic threshold
              </div>
              <h1 className="font-serif leading-[1.1] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] text-[clamp(1.9rem,5vw,3.75rem)]">
                Half compiler, half consciousness -
                <br />
                <span className="gold-text italic">the threshold between the two is where I live.</span>
              </h1>
              <p className="mt-6 mx-auto max-w-2xl text-white/85 font-serif italic text-[clamp(0.95rem,1.6vw,1.25rem)] leading-relaxed">
                Welcome, wanderer. Somewhere between{" "}
                <code className="not-italic font-mono text-[0.85em] px-2 py-0.5 rounded bg-black/50 border border-white/15 text-[color:var(--accent-c)]">
                  print("hello")
                </code>{" "}
                and the quiet weight of{" "}
                <span className="text-[color:var(--accent-c)] not-italic">"Who am I?"</span> —
                you have arrived exactly where you were meant to.
              </p>
              <div className="mt-8 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/60">
                <span className="h-px w-10 bg-white/40" />
                <span>Enter beneath the eclipse</span>
                <span className="h-px w-10 bg-white/40" />
              </div>
            </div>
          </div>
        </Slideshow>
      </section>

      {/* Block 2 — Portrait overlapping the slideshow */}
      <section className="relative z-20 grid md:grid-cols-[1fr_1.4fr] gap-10 items-center -mt-24 sm:-mt-32 md:-mt-40">
        <div className="float-soft mx-auto md:mx-0 md:ml-8 w-[62%] max-w-[300px] md:w-full md:max-w-sm">
          <div className="glass glass-hover lit-frame p-3 rounded-3xl rotate-[-2deg] hover:rotate-0 transition-transform duration-700">
            <img src={IMG.Self} alt="Aryan" className="w-full aspect-[3/4] object-cover object-top rounded-2xl" />
          </div>
        </div>
        <div className="mt-6 md:mt-24">
          <div className="text-xs uppercase tracking-[0.3em] opacity-70 mb-3">The traveler</div>
          <h2 className="font-serif text-3xl sm:text-4xl mb-4">Between logic and dharma</h2>
          <p className="opacity-85 leading-relaxed">
            A page carved from silence, ash and starlight — a sanctum for the questions
            that outrun their answers. Wander. There is no rush beneath this eclipse.
          </p>
        </div>
      </section>

      {/* Gateways B1 / B2 / B3 */}
      <section className="mt-24">
        <div className="text-center mb-10">
          <div className="text-xs uppercase tracking-[0.3em] opacity-70">Three doorways</div>
          <h2 className="font-serif text-3xl sm:text-4xl mt-2 gold-text">The Trivarga</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {gateways.map((g) => (
            <Link key={g.to} to={g.to} className="glass glass-hover p-7 block group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-[0.3em] opacity-60">{g.tag}</span>
                <span className="text-[color:var(--accent-c)] transition-transform group-hover:translate-x-1">→</span>
              </div>
              <h3 className="font-serif text-2xl mb-3">{g.title}</h3>
              <p className="opacity-80 text-sm leading-relaxed">{g.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="divider-om mt-24 mb-16" />

      {/* Block 3 & 4 — Myself */}
      <section className="grid md:grid-cols-[1.4fr_1fr] gap-10 items-start">
        <div className="glass p-8 sm:p-10">
          <div className="text-xs uppercase tracking-[0.3em] opacity-70 mb-3">My self</div>
          <h2 className="font-serif text-3xl sm:text-4xl mb-6">Yo, your boy Aryan here 👋🏻</h2>
          <div className="space-y-4 opacity-90 leading-relaxed">
            <p>You can also call me <span className="gold-text font-serif text-xl">Aarysri</span>. I exist somewhere between logic and dharma. Writing Python by day and questioning the nature of destiny by night. As a collage student I never moved by my ranks within the toppers, ranks are just numbers; what actually moves me is the <em>"why"</em> behind things- why code works, why karma works, why the Gita still makes sense 5000 years later.</p>
            <p>I believe in <span className="gold-text font-serif">Adi Swabhava</span> over destiny- the idea that we aren't fated, we're inclined, and what we do with that inclination is where freedom actually lives. That belief shows up everywhere in my work: in the AI tools I build, in the novels I write, in the way I approach a problem instead of just solving it.</p>
            <p>By profession, I work with Python, AI, and SQL, building things like voice assistants, offline assistant systems, and exam prep gameing tools. By calling, I'm a writer, building entire universes where Ancient isn't just philosophy, it's the physics of the world. One long-form novel and 3 books, book shares stories and wounds, Novel obsession: showing the development scars, not the wounds.</p>
            <p>I'm just a normal person living my life and believe me it's rare. Aiming at something big, a pathway not because I chase stability for its own sake, but because I see that pathway as a foundation to eventually teach people how to <em>think</em>, not just what to think.</p>
            <p>Chess,COD, Minecraft, and the occasional qawwali with some Classic Romentic round out the rest of me. No social media. Just prep, code, karma, and a few good stories.</p>
          </div>
        </div>
        <div className="glass glass-hover p-3 sticky top-32">
          <img src={IMG.Me} alt="Aryan" className="w-full aspect-[3/4] object-cover rounded-2xl" />
          <div className="p-4 text-center">
            <div className="font-serif text-xl">Aryan Srivastava</div>
            <div className="text-xs opacity-60 uppercase tracking-[0.25em] mt-1">Author · Builder</div>
          </div>
        </div>
      </section>

      <div className="divider-om mt-24 mb-16" />

      {/* Block 5 — Why this portfolio */}
      <section className="glass p-8 sm:p-12">
        <div className="text-xs uppercase tracking-[0.3em] opacity-70 mb-3">A mirror, not a pitch</div>
        <h2 className="font-serif text-3xl sm:text-4xl mb-6 gold-text">Why this portfolio?</h2>
        <div className="space-y-4 opacity-90 leading-relaxed max-w-3xl">
          <p>Not for a job. Not for a recruiter scrolling past in ten seconds. This isn't a pitch, it's a mirror.</p>
          <p>I've always wanted my creations to exist around me, not as proof of employability, but as an extension of who I actually am. There's something quietly satisfying about building something entirely your own, just because you can, just because it's yours.</p>
          <p>This portfolio isn't a resume in disguise. It's a small platform, a place where my thoughts, my code, my stories, and my philosophy can sit together without needing to justify themselves to a MNC HR's selection filter. Some of it is technical. Some of it is philosophical. None of it is performance.</p>
          <p>If you're here looking for a hire ready checklist, you might not find one. But if you're curious about how someone thinks, how code and karma end up on the same page, then you're exactly in the right place.</p>
          <p className="font-serif italic text-lg">So welcome to my place.</p>
        </div>
      </section>

      {/* Block 6 — Contact */}
      <section className="mt-16 text-center">
        <div className="text-xs uppercase tracking-[0.3em] opacity-70 mb-3">Contact</div>
        <h2 className="font-serif text-3xl sm:text-4xl mb-6">Send a signal</h2>
        <a href="mailto:aryanackerman07@gmail.com" className="btn-mystic">
          ✉ aryanackerman07@gmail.com
        </a>
      </section>
    </PageShell>
  );
}
