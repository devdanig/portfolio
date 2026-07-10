# Context — Portfolio de Daniel Garcia Fonseca

> Documento vivo. Describe el diseño, decisiones y estado actual del portfolio para
> poder retomar el trabajo en cualquier momento. **Debe actualizarse con cada cambio
> de diseño o contenido** (ver "Cómo mantener este archivo" al final).

Última actualización: 2026-07-09

---

## Resumen

Portfolio de una sola página (one-pager) para Daniel Garcia Fonseca, presentándose
como **AI / Software Developer** junior, abierto a roles junior y trabajo freelance.
Estética oscura, técnica, tipo "Iron Man / Kaspersky", con una visualización animada
en canvas como pieza central del hero.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4 (solo `@import "tailwindcss"` + `@theme inline`; el estilo real es
  mayormente CSS inline en JSX y clases utilitarias propias en `globals.css`)
- Fuentes de `next/font/google`: **Hanken Grotesk** (sans, `--font-sans`) y
  **JetBrains Mono** (mono, `--font-mono`)

## Sistema de diseño

- **Fondo base:** `#08090c` (casi negro)
- **Color de acento:** `#4fd6e0` (cian). En canvas se usa como RGB `79,214,224`.
- **Texto:** títulos `#f2f3f5` / `#e8e9ec`; cuerpo `#9aa0aa`; mono tenue `#7f8794`.
- **Bordes:** `rgba(255,255,255,0.06–0.16)`.
- **Tipografía:** sans (Hanken) para titulares grandes y cuerpo; mono (JetBrains)
  para labels, nav, tags, kickers y detalles técnicos.
- **Radios:** botones y tags tipo pill (`999`); tarjetas `16`.
- **Convención:** los puntos finales de titulares llevan el acento cian
  (ej. `Fonseca.`).

## Estructura de la página (`app/page.tsx`)

Header fijo + 4 secciones + footer, todo dentro de un contenedor con `maxWidth: 1440`.

1. **Header (fixed):** logo `DGF.`, nav (Work / About / Contact), botón pill
   "Available ↗". Fondo translúcido con `backdrop-filter: blur`.
2. **Hero (`#top`):** grid 2 columnas (`1.08fr / 0.92fr`).
   - Izquierda: título "Daniel Garcia Fonseca." y debajo un subtítulo pequeño
     "Software AI Developer" (Hanken Grotesk, blanco `#f2f3f5`, `clamp(16px,1.4vw,20px)`,
     sin cursiva ni rotación — se probó una fuente script/firma y no gustó). Se
     eliminaron el kicker "AI / Software Developer", la línea decorativa cian sobre
     el título, el indicador de disponibilidad con punto pulsante ("Open to junior
     roles & freelance work") y el párrafo de descripción / botones "View work" /
     "Get in touch".
   - **Flecha de scroll:** SVG posicionado en `absolute` al fondo centrado de la
     sección `#top` (`left: 50%` + `translateX(-50%)`, `bottom: 34`), enlaza a
     `#work`. El centrado va en el `<a>` y la animación `floaty` en un `<span>`
     interno (para no pisar el `translateX`). Único CTA, minimalista.
   - Derecha: `#hero-canvas` con `<HeroCanvas heroViz="sphere" ... />`.
3. **Work (`#work`) — (01):** "Things I've built". Grid 2 columnas de 4 tarjetas
   de proyecto (`projects[]`). Cada tarjeta: placeholder 16:9, título, `↗`,
   descripción y tags mono.
4. **About (`#about`) — (02):** grid `0.85fr / 1.15fr`. Placeholder de retrato +
   bio en 2 párrafos + 3 stats (`11+ technologies`, `AI + backend focus`,
   `∞ curiosity`).
5. **Contact (`#contact`) — (03):** titular gigante "Let's build something.",
   email `mailto:danielgfdev@gmail.com`, y pills sociales (GitHub → enlaza a
   `https://github.com/devdanig`, LinkedIn → enlaza a
   `https://www.linkedin.com/in/daniel-garcia-fonseca-8313a61a9/`, ambas con
   `target="_blank"`; Résumé sigue pendiente con `href="#"`).
6. **Footer:** copyright + "Designed & built with care".

### Datos editables (arrays en `page.tsx`)

- `skills[]` — 11 tecnologías (Python, JavaScript, Node.js, FastAPI, AWS,
  Claude Code, Codex, React, Supabase, Vercel, GitHub). Se pasan al canvas.
- `projects[]` — 4 proyectos (`n`, `title`, `desc`, `tags`). Contenido de ejemplo.

## HeroCanvas (`app/HeroCanvas.tsx`)

Componente cliente (`"use client"`) con un motor de canvas 2D propio (`VizEngine`).
Portado desde un componente de Claude Design (`Portfolio.dc.html`).

- **Prop `heroViz`** (default `"sphere"`): elige la visualización. Modos disponibles:
  `atom`, `sphere`, `reactor`, `neural`, `constellation`, `orbital`.
  - **En uso actualmente: `sphere`** — esfera rotatoria de nodos (distribución
    Fibonacci) con labels de skills al hacer hover, haces (beams) animados con
    curvas bézier, flashes y "lente" que reacciona al ratón.
- **Otras props:** `mouseReactive` (default true), `nodeDensity` (default 1.8,
  rango 0.4–1.8), `skills[]`.
- Usa `--font-mono` del body para los tooltips. DPR limitado a 2. Se reconstruye
  al cambiar props relevantes; limpia listeners y RAF en unmount.

## Estilos globales (`app/globals.css`)

- Reset ligero, `scroll-behavior: smooth`, `::selection` cian.
- Keyframes: `pulse` (punto de disponibilidad) y `floaty` (flecha de scroll del hero).
- Clases hover ported del diseño: `.nav-link`, `.btn-avail`, `.btn-solid`,
  `.btn-ghost`, `.project-card`, `.contact-link`, `.social-link`, `.scroll-arrow`.
- **Responsive:** breakpoint único `@media (max-width: 880px)` — hero y grids `.col2`
  pasan a 1 columna, el canvas se mueve arriba (`order: -1`) y se oculta la nav.

## Metadata / SEO (`app/layout.tsx`)

- `title`: "Daniel Garcia Fonseca — AI / Software Developer"
- `description` + OpenGraph configurados. `lang="en"`.

## Estado actual y pendientes

- [x] Hero con canvas (sphere), secciones Work/About/Contact, responsive básico.
- [ ] Contenido de `projects[]` es de ejemplo — reemplazar por proyectos reales.
- [x] Enlaces de GitHub y LinkedIn conectados a las cuentas reales.
- [ ] Enlace de Résumé / CV apunta a `href="#"`, pendiente de enlazar.
- [ ] Imágenes reales (project shots + retrato) — hoy son placeholders rayados.
- [ ] Sin favicon/OG image personalizados aún.
- [ ] Deploy (Vercel) pendiente de confirmar.

## Cómo mantener este archivo

Al hacer cualquier cambio de diseño, contenido o estructura:

1. Actualiza la sección correspondiente arriba.
2. Cambia la fecha de "Última actualización".
3. Marca/añade items en "Estado actual y pendientes".
4. Registra el cambio en el historial de abajo (1 línea).

## Historial de cambios

- 2026-06-30 — Creación de `context.md` documentando el estado inicial (hero con
  canvas sphere, secciones Work/About/Contact, README simplificado).
- 2026-07-01 — Hero minimalista: eliminados el párrafo de descripción y los botones
  ("View work" / "Get in touch"); en su lugar una flecha hacia abajo (SVG animado
  con `floaty`, clase `.scroll-arrow`) que enlaza a `#work`. Reposicionada para
  quedar fija al fondo centrado del hero (`position: absolute`, `bottom`, centrada
  al 50% del viewport).
- 2026-07-01 — Cambiado el rol de "AI / Backend Developer" a "AI / Software Developer"
  (kicker del hero, `title` de metadata y resumen).
- 2026-07-01 — Conectados los botones sociales de GitHub y LinkedIn a las URLs
  reales (`github.com/devdanig` y perfil de LinkedIn), abriendo en pestaña nueva.
- 2026-07-09 — Hero aún más minimalista: eliminados el kicker "AI / Software
  Developer", la línea decorativa cian sobre el título y el indicador "Open to
  junior roles & freelance work" (punto pulsante). En su lugar, un subtítulo
  pequeño "Software AI Developer" debajo del nombre (Hanken Grotesk, blanco,
  ~16–20px). Se probó primero con una fuente script (Alex Brush, estilo firma,
  rotada) pero no gustó y se descartó — no quedó ninguna referencia a esa fuente
  en el código.
