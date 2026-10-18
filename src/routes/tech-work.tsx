import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { IMG } from "@/lib/assets";

export const Route = createFileRoute("/tech-work")({
  head: () => ({
    meta: [
      { title: "Tech Work · Aryaa- Aryan Srivastava" },
      { name: "description", content: "Aryaa: a privacy-first, fully offline autonomous AI brain built by Aryan Srivastava." },
      { property: "og:image", content: IMG.Aryaa },
    ],
  }),
  component: Tech,
});

function Tech() {
  return (
    <PageShell>
      <div className="text-center mb-14">
        <div className="text-xs uppercase tracking-[0.3em] opacity-70">B3 · The Forge</div>
        <h1 className="font-serif text-4xl sm:text-6xl mt-2 gold-text">Tech Work</h1>
      </div>

      <section className="grid md:grid-cols-[1fr_1.3fr] gap-10 items-start">
        <div className="glass glass-hover float-soft p-3 md:sticky md:top-32">
          <img
            src={IMG.Aryaa}
            alt="Aryaa - digital brain poster"
            className="w-full h-auto object-contain rounded-2xl"
          />
          <div className="text-center p-4">
            <div className="font-serif text-2xl gold-text">Aryaa</div>
            <div className="text-xs uppercase tracking-[0.3em] opacity-60 mt-1">Digital Brain</div>
          </div>
        </div>

        <div className="glass p-8">
          <h2 className="font-serif text-3xl mb-4">About Aryaa — My Digital Brain</h2>
          <p className="italic opacity-80">A privacy-first, fully offline autonomous AI brain model. No cloud. No compromise. Just a machine that thinks <em>with</em> me, not <em>about</em> me elsewhere.</p>
          <div className="space-y-4 mt-4 opacity-90 leading-relaxed">
            <p>Aryaa is my attempt at building a sovereign cognitive mirror, an AI that recognises you by face before it even speaks to you, remembers your evolving ideas without forgetting the old ones, tears apart your own arguments to make them stronger, and quietly runs your day in the background. All of it, 100% offline, on hardware most people would call "not enough."</p>
            <p>This isn't a product. It's personal — built strictly for my own use, shaped and reshaped around exactly how I think and work. Not for sale, not for scale. Just mine.</p>
            <p className="text-sm opacity-70"><span className="uppercase tracking-[0.25em] text-[color:var(--accent-c)]">Status:</span> No dedicated hardware yet, but the skills that will power Aryaa I'm already building — piece by piece — ready for the day the machine catches up to the vision. And Soon We Will Able To Use A Basic Aryaa On This Website. SOON...</p>
          </div>
        </div>
      </section>

      <div className="divider-om my-20" />

      <section>
        <h2 className="font-serif text-3xl mb-8 text-center">Experiences &amp; Projects</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass p-6">
            <div className="text-xs uppercase tracking-[0.3em] opacity-60 mb-2">Experience</div>
            <h3 className="font-serif text-xl mb-2">AI For Business Leaders Bootcamp</h3>
            <p className="opacity-80 text-sm">Certification completed via Growth School's Outskills.</p>
          </div>
          <div className="glass p-6">
            <div className="text-xs uppercase tracking-[0.3em] opacity-60 mb-2">Experience</div>
            <h3 className="font-serif text-xl mb-2">Python / AI Internship</h3>
            <p className="opacity-80 text-sm">Real-world experience at Growth School, in partnership with NSDC, Government of India. Certified.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {[
            { t: "Tanya", d: "Early stage precursor to Aryaa. Voice AI assistant on Android via Termux using the Gemini REST API. Wake word detection, inline command parsing, cross window browser commands." },
            { t: "Maths Brain Training Game", d: "Python/Tkinter, 843 lines. Spaced repetition, visual canvas drawings, Zeigarnik-effect mastery bars, squares, cube roots, Pythagorean triplets, fraction percent, Vedic multiplication." },
            { t: "AI Presentation Assistant", d: "Later will merge into Aryaa." },
            { t: "AI-Powered Offline Chatbot", d: "Later will merge into Aryaa." },
            { t: "AI-Integration System for Basic DBMS", d: "Designed to make any basic DBMS AI-powered (in progress). Later will merge into Aryaa." },
            { t: "Hospital Management System", d: "Built with Python/Tkinter, SQL." },
            { t: "Assorted Basic Games", d: "Early builds and experiments." },
          ].map((p) => (
            <div key={p.t} className="glass glass-hover p-6">
              <div className="text-xs uppercase tracking-[0.3em] opacity-60 mb-2">Project</div>
              <h3 className="font-serif text-xl mb-2">{p.t}</h3>
              <p className="opacity-80 text-sm leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}