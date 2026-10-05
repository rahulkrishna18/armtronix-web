# Armtronix — Engineered Intelligence

The redesigned Armtronix website, built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger, Lenis and React Three Fiber.

The site tells one story: **physical infrastructure → engineering systems → power + connectivity → sensors + IIoT → data + automation → intelligent infrastructure**.

## Getting started

```bash
nvm use            # Node 20 (see .nvmrc; Next 16 needs >= 20.9)
npm install
npm run dev        # http://localhost:3000
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (Next core-web-vitals + TypeScript) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run generate:map` | Regenerate the Asia-Pacific dot map data (`src/content/map-dots.ts`) |

## Deploying to Vercel

Import the repository into Vercel. It detects Next.js automatically and needs no extra configuration.

Optional environment variable:

| Variable | Description |
| --- | --- |
| `CONTACT_WEBHOOK_URL` | Contact-form enquiries are POSTed here as JSON (CRM, Slack/Teams workflow, Zapier/Make hook…). If it isn't set, the API answers `503` and the form offers a pre-filled email to `sales@armtronix.one` instead, so no enquiry is silently lost. |

Legacy URLs from the previous site (`/integrated`, `/engineering_excellence`, `/power_transmission`, `/intelligence`) permanently redirect to the new division routes (see `next.config.ts`).

## Content

Every word of business copy lives in `src/content/` and comes from the previous armtronix.com:

- `site.ts`: company, contact details, offices, navigation
- `divisions.ts`: the four division pages (hero, problem, approach, deliverables, process)
- `home.ts`: ecosystem layers, industries, capability showcase, advantages
- `company.ts`: about, mission and vision, presence, leadership, FAQs

Editorial rules for this content:

- **Don't add claims you can't verify.** No invented clients, projects, certifications, metrics or specifications.
- **Some stats from the old site are left out.** It listed context-free improvement percentages ("42% increase", "35% cooler", "30% optimized", "60% faster"). Restore them only once there's a source and context.
- **The telemetry console is simulated.** All its values are synthetic and the UI labels them as a demonstration (`src/components/telemetry/useTelemetry.ts`). The hero's telemetry callouts are simulated too.
- **Australia and India appear only at country level.** The previous site gives no city for either entity, so the map marks the country.

## Architecture

```
src/
  app/                    routes, metadata, sitemap/robots, OG image, /api/contact
  content/                all copy and data (single source of truth)
  components/
    layout/               header, footer, smooth scroll, section rail, CTA band
    ui/                   circuit-trace buttons, technical labels, reveal, magnetic…
    three/                3D scenes + shared primitives
    telemetry/            simulated digital-twin console
    sections/home/        home-page story sections
    sections/division/    shared division-page template
  lib/                    hooks, GSAP registration, pointer, contact validation
```

### 3D

- **One loader for every scene.** `SceneCanvas` lazy-mounts each scene as it nears the viewport and pauses rendering when it's off-screen. It renders on demand under `prefers-reduced-motion` and falls back to a static poster without WebGL.
- **three.js loads on demand.** The WebGL canvas (`CanvasRoot`) and every scene are dynamically imported, so three.js isn't in any page's initial JavaScript.
- **Labels are plain DOM.** In-scene labels use a lightweight projector (`LabelAnchor` + `labelRegistry`) instead of drei's `<Html>`, which raced on unmount during route transitions in production builds.
- **Scenes are procedural.** They're built from primitives and line geometry, with no model or texture downloads.

### Motion and accessibility

- **One timing source.** GSAP ScrollTrigger drives the scroll stories, and Lenis smooth scrolling is synced to GSAP's ticker.
- **Reduced motion is fully supported.** Smooth scrolling is disabled, the scroll-pinned sections collapse to normal flow, and scenes render their final state.
- **Everything works from the keyboard.** That includes the telemetry floor plan, the tabs, the accordions and the flow selectors. Each 3D scene has an accessible text description.
