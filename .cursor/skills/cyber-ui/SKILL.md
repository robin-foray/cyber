---
name: cyber-ui
description: Build or modify cyber-themed UI components, pages, and styling. Use for CyberShell pages, sidebar, branding, glitch effects, and cyber CSS classes.
---

# Cyber UI Workflow

## Components map

| Component | Path | Role |
|-----------|------|------|
| CyberShell | `components/cyber-shell.tsx` | Root layout, sidebar state |
| CyberSidebar | `components/cyber/sidebar.tsx` | Nav, dev-tools menu, identity card |
| CyberTopbar | `components/cyber/topbar.tsx` | Section label from URL; mobile auth = profile icon → `/profile`; logout = `Disconnect` → POST `/logout` |
| CyberExpandablePanel | `components/cyber/expandable-panel.tsx` | Collapsible cyber panels (welcome console / integrity) |
| CyberFooter | `components/cyber/footer.tsx` | Footer links |
| ForayBrand | `components/cyber/foray-brand.tsx` | Logo / brand mark |
| GlitchText | `components/cyber/glitch-text.tsx` | Animated glitch heading |
| LetterGlitchBackground | `components/cyber/letter-glitch-background.tsx` | Matrix-style bg |

## Design tokens

Defined in `resources/css/app.css` `@theme` block:
- Primary: `#ccff00` (neon green) — `text-primary`, `border-primary/15`
- Surfaces: `bg-surface`, `bg-surface-low`
- Fonts: `font-mono` (JetBrains Mono), `font-display` (Space Grotesk)

## Cyber CSS classes

| Class | Use |
|-------|-----|
| `.cyber-grid` | Main section container with grid bg |
| `.cyber-tool-button` | Action buttons in dev-tools |
| `.cyber-input` | Textareas and inputs |
| `.glow-text` | Neon glow on accent words |
| `.glitch-text` | Glitch animation |
| `.foray-brand` | Brand styling |
| `.dev-ticker` | Scrolling ticker text |

## Copy style

- Labels: `SCREAMING_SNAKE_CASE` (`DEV_TOOL_01`, `input_buffer`, `NODE_PROFILE`)
- Status values: `VALID`, `INVALID`, `IDLE`, `SYNC`
- User terminology: node, operator, neural, foray-core

## localStorage keys

- `foray.sidebar.open` — sidebar expanded state
- `foray.dev-tools.open` — legacy; prefer `foray.cool-stuff.open`
- `foray.cool-stuff.open` — COOL_STUFF menu open
- `foray.welcome.console.open` — Terminal console panel
- `foray.welcome.integrity.open` — Terminal integrity panel

Prefix new keys with `foray.`.

## Page structure template

```tsx
<CyberShell>
    <Head title="Page Title" />
    <section className="cyber-grid rounded-3xl border border-primary/15 bg-surface p-6 shadow-[0_0_22px_rgba(204,255,0,0.08)] md:p-8">
        <div className="mb-3 flex items-center gap-3 text-sm font-bold tracking-widest text-primary">
            <Icon size={18} />
            SECTION_LABEL // SUBLABEL
        </div>
        <h1 className="font-display text-4xl font-bold text-white uppercase">
            Title <span className="glow-text text-primary">Accent</span>
        </h1>
        {/* content */}
    </section>
</CyberShell>
```

## Mobile layout (dev-tools)

- Outer section: `min-w-0 overflow-hidden p-4 sm:p-6 md:p-8`
- Actions: `flex w-full flex-wrap gap-2 lg:w-auto` (never `grid-cols-2` for 3+ buttons)
- Status tiles: `grid-cols-2` on phone, `min-w-0` + `break-words`
- Editors: `min-h-[240px] sm:min-h-[360px] md:min-h-[430px]`, inputs `text-base` (iOS zoom)
- Wide grids: use `minmax(0, …)` columns

## When NOT to use cyber UI

Dashboard (`/dashboard`), settings (`/settings/*`) use shadcn `AppLayout` — keep admin UI consistent with Laravel starter kit patterns.

## Avatars

User avatars via DiceBear identicon API — see `User::getAvatarUrlAttribute()`. Brand colors in the URL params.
