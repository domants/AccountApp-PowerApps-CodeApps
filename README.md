# Stacks Used
- React
- TypeScript
- Vite
- tailwind css
- React Router
- shadcn/ui (for production ready components)
- TanStack Query (For Dataverse/API data fetching)
- Zustand (For State Management — Not in used from this build)


# Installing shadcn/ui in a Power Apps Code App

A Power Apps Code App is a Vite + React + TypeScript project, so you use shadcn's
**"Existing Project"** path. The only Power Apps–specific points are: keep the
`powerApps()` Vite plugin, and let that plugin handle the asset base path (don't
add `base: './'` manually).

> Run everything from your code app's project root.
>
> **About the `← add this` arrows below:** they mark the exact lines you need to
> add or change. They are annotations for *you* — do **not** type the arrows or
> their text into the actual files.

---

## Step 1 — Install Tailwind CSS (v4)

shadcn uses Tailwind v4, which is CSS-first — no `tailwind.config.js` or PostCSS needed.

```bash
npm install tailwindcss @tailwindcss/vite
```

Replace the entire contents of `src/index.css` with:

```css
@import "tailwindcss";
```

> Note: shadcn's `init` does **not** install Tailwind for you in an existing
> project — this step is what actually adds it. `init` (Step 4) only detects it
> and layers the theme variables on top.

---

## Step 2 — Configure the `@` path alias

Add the `@` path alias to **both** tsconfig files (no `baseUrl` required).

`tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "paths": {                       // ← add this
      "@/*": ["./src/*"]             // ← add this (relative ./ prefix, no baseUrl needed)
    }                                // ← add this
  }
}
```

`tsconfig.app.json` — add `paths` as a **direct** member of `compilerOptions`.
Do **not** nest it inside a second `compilerOptions` block (that's the bug to
avoid — TypeScript ignores a nested `compilerOptions`, so the alias silently
won't work):

```json
{
  "compilerOptions": {
    // ...your existing options (target, lib, module, etc.)...
    "paths": {                       // ← add this (directly inside compilerOptions)
      "@/*": ["./src/*"]             // ← add this
    }                                // ← add this
    // ...rest of your existing options...
  },
  "include": ["src"]
}
```

> **No `baseUrl` needed.** Older shadcn/Vite docs and many templates add
> `"baseUrl": "."` alongside `paths`. TypeScript 6.0 deprecated `baseUrl` (removed
> in 7.0), so if you add it you'll get: *"Option 'baseUrl' is deprecated and will
> stop functioning in TypeScript 7.0."* Since `paths` already uses the relative
> `./src/*` prefix, you don't need `baseUrl` at all — just leave it out. Don't
> reach for `"ignoreDeprecations": "6.0"`; that only mutes the warning and breaks
> at 7.0 anyway.

---

## Step 3 — Update `vite.config.ts` (merge, don't overwrite)

Install Node types so `path` and `__dirname` type-check:

```bash
npm install -D @types/node
```

Then add the Tailwind plugin and the `@` alias **into** the existing config,
keeping `react()` and `powerApps()`:

```ts
import path from 'path';                                  // ← add this
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { powerApps } from '@microsoft/power-apps-vite/plugin';
import tailwindcss from '@tailwindcss/vite';               // ← add this

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), powerApps(), tailwindcss()],          // ← add tailwindcss()
  server: {
    port: 3000,        // the Power Apps SDK requires port 3000
    strictPort: true,
  },
  resolve: {                                               // ← add this whole block
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

> Do **not** add `base: './'`. The `powerApps()` plugin sets the asset base path
> automatically. Adding it manually is only needed when you are *not* using that
> plugin.

---

## Step 4 — Run the shadcn init

```bash
npx shadcn@latest init
```

Answer the prompts:

- **Component library:** Radix (the default — most mature, every component available)
- **Preset:** Nova (Lucide icons + Geist font — the neutral default everything assumes)

This creates `components.json`, `src/lib/utils.ts` (the `cn` helper), and writes
the theme variables (`--background`, `--primary`, etc.) into `src/index.css`.

---

## Step 5 — Add components as you need them

You don't copy component source by hand — the CLI pulls it into your project:

```bash
npx shadcn@latest add button card input
```

Each component lands in `src/components/ui/`. Import via the alias:

```tsx
import { Button } from "@/components/ui/button";
```

The component docs (https://ui.shadcn.com/docs/components) show each component's
`add` command, import, props, and examples.

---

## Step 6 — Test in Local Play

```bash
npm run dev
```

Open the **Local Play URL** the `powerApps()` plugin prints in the terminal —
not the bare `localhost:3000`. The app must load inside the Power Apps harness,
in the same browser profile where you're signed in to Power Platform.

Drop a `<Button>Click me</Button>` into `App.tsx` and confirm it renders styled.
If it does, Tailwind, the theme, the path alias, and the Power Apps host are all
working together.

---

## Step 7 — Build and push

```bash
npm run build
pac code push          # or: npx power-apps push  (SDK v1.0.4+ CLI)
```

Quick verification after build: open `dist/index.html` and confirm the asset
paths are **relative** (`./assets/...`). That's proof the `powerApps()` plugin
set the base path correctly. Absolute paths (`/assets/...`) would give you a
blank screen on the managed host.

---

## Sanity checklist

- [ ] `tailwindcss` and `@tailwindcss/vite` are in `package.json`
- [ ] `src/index.css` starts with `@import "tailwindcss";` (plus the theme block init added)
- [ ] `@/*` alias (under `paths`) is a direct member of `compilerOptions` in both tsconfig files — no `baseUrl`
- [ ] `vite.config.ts` keeps `powerApps()` and has no manual `base`
- [ ] `components.json` and `src/lib/utils.ts` exist
- [ ] A shadcn component renders styled in the Local Play URL
