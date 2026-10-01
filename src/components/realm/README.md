# The Realm theme (Art & Writing, Novel, Books)

A rich, atmospheric, mythic portal rather than a standard flat webpage. Scoped to the creative and
literary pages (`art-writing.tsx`, `books.tsx`, `kalpa-saga.tsx`) through `RealmShell`; the technical and POV
pages keep the cleaner classic layout.

## Two atmospheres
- **Golden Water — amphitheater / ghat system.** Sacred amphitheater tiers, classical temple shikharas and
  pillars, calm reflecting water, drifting ceremonial ribbons, floating lotus pads and sacred-geometry rings.
- **Golden Mist — sunset ghat system.** A warm, high-definition dusk over terraced stepped ghats, glowing mist
  curtains and atmospheric temple silhouettes.

## Immersive transitions and UX
- **Veil and mist curtains:** page entry and theme switching use a cinematic veil (`MistCurtain`, `.r-veil`) with
  a sacred-geometry seal (`.cv-core`, `.cv-seal`) that parts like clearing fog.
- **Persistence and responsiveness:** theme choice persists in `localStorage` and syncs across tabs;
  `prefers-reduced-motion` gets a static version of the same design; mobile gets a lighter scene.

## Files
- `lib/realm-theme.tsx` — theme provider, persistence, veil sequence
- `components/realm/RealmShell.tsx` — page shell (background, nav, cursor light, reveal, mist curtain)
- `components/realm/GlobalBackground.tsx` — Golden Water scene, particles, ribbons
- `components/realm/MistScene.tsx` — Golden Mist scene and shared temple/lotus art
- `components/realm/MistCurtain.tsx`, `ThemeSwitcher.tsx`, `FloatingNavbar.tsx`, `GlassCard.tsx`, `SacredGeometry.tsx`
- `realm.css` — all realm styling; textures live in `assets/realm/`
