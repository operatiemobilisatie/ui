# OM/UI

A collection of [React](https://react.dev/) components for OM websites and
applications, built on [Base UI](https://base-ui.com/) and
[Tailwind CSS v4](https://tailwindcss.com/), with full
[TypeScript](https://www.typescriptlang.org/) types.

Browse the components in Storybook:
<https://operatiemobilisatie.github.io/ui/>.

## Version 3

Version 3 moves the component internals from Radix UI to Base UI. Component
parts are namespaced and composition uses a `render` prop instead of `asChild`.
**Upgrading from version 2 requires code changes.** See
[MIGRATION.md](./MIGRATION.md) for the export-by-export mapping, and
[CHANGELOG.md](./CHANGELOG.md) for the release notes.

The headline is what a consumer installs:

| | v2 | v3 |
|---|---|---|
| Runtime dependencies | 29 | **5** |
| `@radix-ui/*` packages | 17 | **0** |
| `@fortawesome/*` packages | 3 | **0** |
| Peer dependencies | `react`, `react-dom`, **`next`** | `react`, `react-dom` |
| Webfonts | not shipped — wire up your own | Lato + Roboto Slab, bundled |

The five runtime dependencies are `@base-ui/react`,
`class-variance-authority`, `clsx`, `tailwind-merge`, and `react-select`.

**`next` is no longer a peer dependency, and nothing in the package imports it.**
The library works with Vite, Next.js App Router, Remix / React Router, Astro,
and other React frameworks. The JavaScript entry has no side-effect CSS import.

## Install

```bash
npm i @operatiemobilisatie/ui
```

Peers are `react` and `react-dom` only, `^18 || ^19`.

Upgrading an existing version 2 app? Start with the
[migration checklist](./MIGRATION.md#quick-upgrade-checklist).

## Setup

### Vite + React

```bash
npm i @operatiemobilisatie/ui react react-dom
npm i -D vite @vitejs/plugin-react tailwindcss @tailwindcss/vite
```

`vite.config.ts`:

```ts
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

`src/app.css` — this one file is the whole styling setup:

```css
@import "tailwindcss";
@import "@operatiemobilisatie/ui/css";
@import "@operatiemobilisatie/ui/fonts";   /* omit to use your own font loader */
```

### Next.js App Router

```bash
npm i @operatiemobilisatie/ui
npm i -D tailwindcss @tailwindcss/postcss
```

`postcss.config.mjs`:

```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

`app/globals.css`:

```css
@import "tailwindcss";
@import "@operatiemobilisatie/ui/css";
@import "@operatiemobilisatie/ui/fonts"; /* optional */
```

`app/layout.tsx` remains a server component:

```tsx
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Other frameworks

Remix / React Router v7, Astro, and TanStack Start can use the Vite setup above:
enable `@tailwindcss/vite` and add the CSS imports to an application stylesheet.

### The line that makes styling work

```css
@import "@operatiemobilisatie/ui/css";
```

**Without it the components render completely unstyled.** It is not just a
palette. That stylesheet carries the `@theme` tokens *and* an `@source`
directive pointing at `dist/components/`, `dist/internal/` and `dist/lib/`,
which is what makes your Tailwind build scan the library's compiled JSX and
generate the utility classes the components ask for. Tailwind v4 only emits
classes it can see used somewhere; without the `@source` it never sees them, so
every `rounded-2xl`, `bg-primary` and `data-checked:*` in this package compiles
to nothing.

The `@source` glob is `../{components,internal,lib}/**/*.js` — the `internal/`
directory matters: the Dialog close button and Card's Root live there, and a
glob that stops at `components/` would drop their positioning entirely. `lib/`
is scanned for exported helpers such as the AG Grid theme, which also contains
utility class names.

If styles are missing, check this import before anything else. It is the single
most common setup mistake.

### Dark mode is not supported

v3 has no dark mode. There is no `dark:` variant anywhere in the library, and
the `@custom-variant dark` that once made the option *look* available is gone.
If you flip your app to dark, the components stay light — there is no error and
no theme to opt into. Treat it as "not supported" rather than as a feature with
a missing toggle.

## Fonts

The package ships Lato (400, 700) and Roboto Slab (500) as self-hosted woff2,
split into `latin` and `latin-ext` subsets with `unicode-range` intact, so a
plain-ASCII page never downloads the `latin-ext` files. 79.5 KB total across all
six files. Licences (SIL OFL 1.1 and Apache 2.0) ship alongside them.

Pull them in either way:

```css
@import "@operatiemobilisatie/ui/fonts";
```

```tsx
import "@operatiemobilisatie/ui/fonts";
```

Prefer the CSS form. Under TypeScript 6 with `strict`, the extensionless JS
import `import "@operatiemobilisatie/ui/fonts"` trips **TS2882** (the resolved
file has no extension TypeScript recognises). If you want the import in JS, use
the `./fonts.css` alias, which resolves identically and needs no ambient
declaration:

```tsx
import "@operatiemobilisatie/ui/fonts.css";
```

Raw files are exposed too, for `next/font/local` or `<link rel="preload">`:

```
@operatiemobilisatie/ui/fonts/lato-latin-400.woff2
@operatiemobilisatie/ui/fonts/lato-latin-ext-400.woff2
@operatiemobilisatie/ui/fonts/lato-latin-700.woff2
@operatiemobilisatie/ui/fonts/lato-latin-ext-700.woff2
@operatiemobilisatie/ui/fonts/roboto-slab-latin-500.woff2
@operatiemobilisatie/ui/fonts/roboto-slab-latin-ext-500.woff2
```

Only 400/700 of Lato and 500 of Roboto Slab are bundled, because that is all the
components use. Lato has no 500 or 600 cut at all, so `font-medium` resolves to
400 and `font-semibold` to 700 exactly as it always has. If you need other
weights, load them yourself and override `--font-lato` / `--font-roboto-slab`.

### Opting out in favour of `next/font`

Drop the fonts import, keep `globals.css`, and load the families through
`next/font/google` under your own variable names:

```tsx
// app/layout.tsx
import { Lato, Roboto_Slab } from "next/font/google";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--nf-lato",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--nf-roboto-slab",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lato.variable} ${robotoSlab.variable}`}>
      <head>
        <style>{`:root{--font-lato:var(--nf-lato);--font-roboto-slab:var(--nf-roboto-slab);}`}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**Why the indirection.** `dist/css/style.css` already declares `--font-lato` and
`--font-roboto-slab` at `:root`. A `next/font` `variable` is emitted as a *class*
on `<html>` — the same specificity as `:root`, so which one wins depends purely
on the order the two stylesheets end up in, which is not something you control
reliably. Declaring your own `--nf-*` variables and mapping them at `:root`
sidesteps the tie: the mapping is a later `:root` rule, so it wins regardless of
where the library's stylesheet lands.

## Using the components

Import from the root barrel, which is tree-shakeable:

```tsx
import { Button, Dialog, Card } from "@operatiemobilisatie/ui";
```

or from a per-component subpath, which is the smallest possible graph:

```tsx
import { Button } from "@operatiemobilisatie/ui/button";
```

### Namespaced parts

Multi-part components are exported as a namespace and composed from their parts,
following Base UI. `DialogContent` is `Dialog.Popup`, `AccordionItem` is
`Accordion.Item`, and so on.

```tsx
import { Dialog, Button } from "@operatiemobilisatie/ui";

<Dialog.Root>
  <Dialog.Trigger render={<Button variant="outline" />}>Share</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop />
    <Dialog.Popup>
      <Dialog.Header>
        <Dialog.Title>Share link</Dialog.Title>
        <Dialog.Description>Anyone with this link can view it.</Dialog.Description>
      </Dialog.Header>
    </Dialog.Popup>
  </Dialog.Portal>
</Dialog.Root>
```

### `render` replaces `asChild`

Base UI has no `Slot`. To render a part as a different element, hand it that
element:

```tsx
<Dialog.Trigger render={<Button variant="outline" />}>Share</Dialog.Trigger>
<Card.Root render={<Link href="/story" />}>…</Card.Root>
<Button render={<a href="/give" />}>Give</Button>
```

Props are merged onto the element you pass, so it needs no props of its own.
`render` also accepts a function `(props, state) => ReactElement` for the cases
where you want to place the merged props yourself. Every `asChild` in a version
2 codebase becomes `render`; there is no compatibility shim.

### Server components

All namespace exports can be imported and rendered from a React Server
Component. Interactive parts establish their own client boundaries, so importing
the library does not require adding `"use client"` to the consuming server
component. Your own components still need `"use client"` when they use state,
effects, event handlers, or client-only hooks.

## Components

Namespaced components (`import { Accordion } from "@operatiemobilisatie/ui"`):

| Namespace | Parts |
|---|---|
| `Accordion` | `Root` `Item` `Header` `Trigger` `Panel` |
| `Alert` | `Root` `Title` `Description` · `alertVariants` |
| `AlertDialog` | `Root` `Trigger` `Portal` `Close` `Backdrop` `Popup` `Header` `Footer` `Title` `Description` |
| `Avatar` | `Root` `Image` `Fallback` |
| `Card` | `Root` `Image` `Header` `Title` `Description` `Content` `Footer` |
| `Dialog` | `Root` `Trigger` `Portal` `Close` `Backdrop` `Popup` `Header` `Footer` `Title` `Description` |
| `DropdownMenu` | `Root` `Trigger` `Portal` `Positioner` `Popup` `Group` `GroupLabel` `Item` `CheckboxItem` `RadioGroup` `RadioItem` `Separator` `Shortcut` `SubmenuRoot` `SubmenuTrigger` |
| `RadioCards` | `Root` `Item` · `radioCardVariants` |
| `RadioGroup` | `Root` `Item` · `radioControlVariants` `radioIndicatorVariants` |
| `Slider` | `Root` `Label` `Control` `Track` `Indicator` `Thumb` `Value` |
| `Tabs` | `Root` `List` `Indicator` `Tab` `Panel` |
| `Toast` | `Provider` `Portal` `Viewport` `Root` `Content` `Title` `Description` `Close` `Action` · `useToastManager` `createToastManager` · type `Variant` |
| `Tooltip` | `Provider` `Root` `Trigger` `Portal` `Positioner` `Popup` |

Single-element components, exported flat:

| Export | Notes |
|---|---|
| `Badge` | `badgeVariants`, `BadgeProps` |
| `Button` | `buttonVariants`, `ButtonProps`; composes via `render` |
| `Checkbox` | one part; `displaySize` for `sm` / `default` / `lg` |
| `Input` | `InputProps`, `displaySize` |
| `Kicker` | `as` to change the element |
| `Label` | plain styled `<label>`; `labelVariants` |
| `Logo` | inline SVG, `as` / `width` / `height` |
| `Progress` | animates and counts up when scrolled into view |
| `RadioButton` | `radioButtonVariants` |
| `Select` | still `react-select` under the hood |
| `Skeleton` | |
| `Spinner` | |
| `Switch` | |
| `Textarea` | `TextareaProps` |
| `Toaster` | renders the toast queue; mount inside `<Toast.Provider>` |

Icons (inline SVG, replacing FontAwesome): `CheckIcon`, `ChevronDownIcon`,
`ChevronRightIcon`, `CircleIcon`, `CloseIcon`, plus the `IconProps` type.

Utilities: `cn` (clsx + tailwind-merge), `useInView`, `useCountUp`, `themeOM`.

### Toasts

The provider is a real wrapper in your tree, and toasts are pushed from a hook:

```tsx
import { Toast, Toaster, Button } from "@operatiemobilisatie/ui";

function App() {
  return (
    <Toast.Provider>
      <Page />
      <Toaster />
    </Toast.Provider>
  );
}

function SaveButton() {
  const { add } = Toast.useToastManager();
  return (
    <Button onClick={() => add({ title: "Saved", description: "All good." })}>
      Save
    </Button>
  );
}
```

Anything that calls `useToastManager()` has to sit *below* the provider. To push
a toast from outside React, create the manager yourself with
`Toast.createToastManager()` and pass it as
`<Toast.Provider toastManager={…}>`.

## Versions

Major versions are not backwards compatible.

| Version | |
|---|---|
| `1.x` | Tailwind v3, Radix UI |
| `2.x` | Tailwind v4, Radix UI |
| `3.x` | Tailwind v4, Base UI, self-hosted fonts, no `next` peer |

```bash
npm i @operatiemobilisatie/ui@latest
```
