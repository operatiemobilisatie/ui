# Changelog

All notable changes to `@operatiemobilisatie/ui` are documented here. The format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] — 2026-08-03

Every component moves from Radix UI to [Base UI](https://base-ui.com/), and the
public API moves with it: parts are namespaced and `asChild` is replaced by a
`render` prop. **This is a breaking release throughout** — see
[MIGRATION.md](./MIGRATION.md) for the export-by-export mapping.

Headline: **29 runtime dependencies → 5**. Zero `@radix-ui/*`, zero
`@fortawesome/*`, and `next` is no longer a peer dependency.

The rendering did not change. All 115 screenshot baselines were captured from
the v2 Radix output before the first component was touched, and not one of them
moved across the entire migration.

### Added

- **Self-hosted webfonts.** Lato 400/700 and Roboto Slab 500 ship as woff2, split
  into `latin` / `latin-ext` with `unicode-range` intact (79.5 KB total, fetched
  per subset). Exposed as `@operatiemobilisatie/ui/fonts` (CSS `@import` or JS
  import), `./fonts.css` as an extension-carrying alias, and `./fonts/*` for raw
  files. SIL OFL 1.1 and Apache 2.0 licence texts ship alongside. v2 declared
  `--font-lato` / `--font-roboto-slab` but shipped no files at all.
- **A working root entry with named exports.** `import { Button } from
  "@operatiemobilisatie/ui"` now works and is tree-shakeable. Per-component
  subpaths are unchanged.
- **Server-component support across the board.** All 13 namespace exports render
  from an RSC. `"use client"` is carried only by the five modules that call a
  hook themselves.
- **`Toast.useToastManager()`**, with `add`, `close`, `update` and a `promise`
  helper, plus `Toast.createToastManager()` for pushing from outside React.
  `update` and `promise` have no v2 equivalent.
- **New parts:** `Accordion.Header`, `Tooltip.Positioner`,
  `DropdownMenu.Positioner`, `Slider.Control` / `Slider.Value`,
  `Toast.Portal` / `Toast.Content`, and `AlertDialog.Close`, which the alert
  dialog did not expose in v2.
- **Inline icons** — `CheckIcon`, `ChevronDownIcon`, `ChevronRightIcon`,
  `CircleIcon`, `CloseIcon` and the `IconProps` type — replacing the three
  FontAwesome packages.
- **`useInView` and `useCountUp`** in `lib/hooks`, replacing `motion` and
  `react-countup`.
- **Real open/close transitions** on dialog, alert dialog, tooltip, dropdown menu
  and toast, driven by Base UI's `data-starting-style` / `data-ending-style`.
  These components had *no* animation in v2 — the `animate-in` / `fade-in-0` /
  `slide-in-from-*` classes on them emitted nothing, because
  `tailwindcss-animate` was a dependency but was never registered as a plugin and
  there is no `tailwind.config` to register it in.
- **`alertVariants`, `labelVariants`** are now exported.
- Test infrastructure: a Playwright screenshot suite (115 stories, Docker-pinned)
  and a behaviour suite (45 tests). Storybook coverage went from 17 to 28
  components.

### Changed

- **API shape.** `asChild` → `render={<X/>}`. Thirteen components export a
  namespace (`Dialog.Root`, `Dialog.Popup`, …) instead of flat `DialogContent`
  style names. There is no `Slot`.
- **Build** is [tsdown](https://tsdown.dev/) (rolldown) in `unbundle` mode,
  replacing the two-pass Rollup setup and its four plugins. The stylesheet and
  the fonts are copied byte-for-byte; the build runs no postcss at all.
- **Storybook** is Storybook 10 on `@storybook/react-vite`, replacing
  `@storybook/nextjs` and webpack.
- **The JS entry no longer imports CSS.** The side-effect
  `import "./globals.css"` in `src/index.ts` is gone — it was the main thing
  forcing consumers to have a CSS-capable bundler. Styling now requires
  `@import "@operatiemobilisatie/ui/css"` in a stylesheet, which was already the
  documented mechanism.
- **Peer dependencies** are `react` and `react-dom` only. `next` is dropped;
  nothing in the package ever imported it.
- **`Logo` is no longer an `async` component**, so it works outside an RSC. It and
  `Kicker`, `Spinner` and `Select` are named exports rather than defaults.
- **Accordion:** `type="single" | "multiple"` → `multiple?: boolean`;
  `value` / `defaultValue` / `onValueChange` are always `string[]` in both modes;
  `collapsible` is gone and is effectively always on; `Content` → `Panel`; the
  height animation is `--accordion-panel-height` rather than keyframes over
  `--radix-accordion-content-height`.
- **Toast:** `<Toast.Provider>` is now a mandatory wrapper in the consumer's
  tree. The queue moved from a module-level variable to React context, so
  `useToastManager()` only resolves against a provider above the caller. Option
  renames: `duration`/`Infinity` → `timeout`/`0`, `variant` → `type`,
  `action={<ToastAction/>}` → `actionProps`. Default swipe directions are `down`
  and `right` where Radix swiped right only.
- **Slider** is composed from `Root` > `Control` > `Track` > `Indicator` plus
  `Thumb` and `Value`. `thumbAlignment` defaults to `"edge"` to match Radix; note
  that this affects the pointer→value mapping, not just where the thumb is drawn.
- **Dialog and alert dialog:** `Overlay` → `Backdrop`, `Content` → `Popup`, and
  `Portal` + `Backdrop` are composed at the call site rather than baked into the
  content part.
- **`AlertDialogAction` / `AlertDialogCancel` are gone.** Cancel is
  `<AlertDialog.Close render={<Button/>}>`; the action is a plain `<Button
  onClick>` — **which no longer closes the dialog by itself.**
- **Dropdown menu:** `Content` splits into `Positioner` + `Popup`, `Sub*` becomes
  `Submenu*`, `SubContent` folds into `Popup`, and `Label` becomes `GroupLabel`,
  which throws unless nested in a `Group` or `RadioGroup`.
- **Tooltip:** `Content` splits into `Portal` > `Positioner` > `Popup`;
  `sideOffset` belongs to the `Positioner`; there is no `delayDuration` on
  `Root` — it is `delay`, on `Provider` or `Trigger`.
- **Tabs:** `Trigger` → `Tab`, `Content` → `Panel`.
- **`Label` is a plain styled `<label>`**, with `@radix-ui/react-label` dropped
  and not replaced.
- **Radio cluster:** the two colliding `radioVariants` exports are now
  `RadioGroup.radioControlVariants` and `radioButtonVariants`. Base UI's
  `RadioGroup` has no `orientation` prop; direction comes from the flex
  container.
- **`positionMethod="fixed"`** is set on every Positioner whose baseline came
  from a Radix Popper. Base UI defaults to `absolute` and Radix hard-coded
  `fixed`; the geometry is identical, but a fixed element is composited, which
  switches Chrome from subpixel to greyscale text antialiasing.
- **State attributes** follow Base UI: `data-open` / `data-closed`,
  `data-checked` / `data-unchecked`, `data-active`, `data-panel-open` on an
  accordion trigger, `data-popup-open` on a menu trigger, and
  `data-highlighted` where Radix used `focus:`.
- `sideEffects` is `["**/*.css"]` rather than `false`, so a bundler cannot
  tree-shake away the side-effect-only fonts import.
- `npm run build` now gates on `publint` (inside tsdown, fails the build) and on
  `attw --pack --profile esm-only`, excluding the three CSS entrypoints, which
  attw can only resolve as JS/TS and so reports as unresolvable despite working
  in both bundlers.
- `tailwind-merge` upgraded v2 → v3 (v2 does not know Tailwind v4 classes).
- `tsconfig` targets `es2022` with `jsx: "react-jsx"`; `engines.node` is `>=20`.

### Removed

- **17 `@radix-ui/*` packages**, including `@radix-ui/react-toggle` and
  `@radix-ui/react-toggle-group`, which were dependencies that nothing imported.
- **3 `@fortawesome/*` packages.**
- **`motion` and `react-countup`.**
- **`classnames`, `tailwindcss-animate`, `@tailwindcss/typography`,
  `prop-types`, `@types/minimatch`**, and the
  `optionalDependencies["@rollup/rollup-linux-x64-gnu"]` pin — all unused.
- **`next` as a peer dependency.**
- **`src/lib/use-toast.ts`** — 192 lines of shadcn reducer, replaced wholesale by
  `Toast.useToastManager()`. `useToast`, `toast` and `reducer` no longer exist.
- **`AlertDialogAction` and `AlertDialogCancel`.**
- **`accordion-down` / `accordion-up` keyframes** and their `--animate-*` theme
  entries, which only ever interpolated a Radix variable.
- Dead utility classes found along the way: `disabled:pointer-events-none`,
  `disabled:opacity-50` and `disabled:bg-green` on the slider thumb (a `<div>` is
  never `:disabled`), `absolute h-full` on the slider indicator (Base UI writes
  position and size inline, which beats a utility), the stray `toast-close=""`
  attribute, and the ~37 `animate-in` / `animate-out` / `slide-in-from-*` classes
  across five components that never emitted anything.
- The Rollup/postcss toolchain: `@rollup/*` (3), `rollup-plugin-*` (4),
  `postcss`, `postcss-loader`, `@tailwindcss/postcss`, and
  `@storybook/{nextjs,react-webpack5,addon-postcss,addon-webpack5-compiler-swc}`.

### Fixed

- **The toast never animated in or out.** It declared
  `transition-[opacity,transform]`, but Tailwind v4 compiles `translate-y-full` /
  `translate-x-full` to the individual `translate` property, not to `transform` —
  so the enter slide never ran and the exit jumped a full width sideways in one
  frame before fading. The transition now names `translate` explicitly. Invisible
  to screenshots by construction; caught by the behaviour suite on its first run
  (`a618825`).
- **`Kicker` and `Logo` failed a consumer's typecheck.** `className`,
  `attributes` and `as` on `Kicker`, and `width` / `height` on `Logo`, were
  declared required despite having runtime defaults, so `<Kicker>text</Kicker>`
  and `<Logo />` did not compile — a hard `next build` failure, since Next
  typechecks the app by default. All are optional now; nothing that compiled
  before stops compiling (`c4b2f8f`).
- **The dialog broke server rendering.** `Dialog.Popup` gained a `React.useRef`
  during the migration without a `"use client"` directive, so `next build` failed
  with `TypeError: e.useRef is not a function`. More broadly, `export * as X`
  from a `"use client"` module hands a server component one opaque reference with
  no keys — `Accordion`, `AlertDialog`, `Avatar`, `Slider` and `Toast` all
  rendered as `undefined` from an RSC. The directive policy is now "only a module
  that calls a hook itself", and `Popup` lives in its own client module
  (`4884207`).
- **`CardImage` accepted a `ref` and dropped it on the floor.** `Card.Image`
  applies it.
- **The slider's value label was frozen.** It printed `props.defaultValue`, so
  the number under the thumb never followed the handle. `Slider.Value` reads the
  live value from context.
- **`--font-lato: var(--font-lato)`** — a self-reference in `globals.css` that
  resolved to nothing unless the consumer happened to define the variable. The
  theme now names the families, and `./fonts` supplies the files.
- **The `"."` export condition pointed at `./dist/src/index.js`**, which the build
  never produced.
- **Stories emitted `<button>` inside `<button>`**, from triggers wrapping a
  `<Button>` without `asChild`.
- The dialog's initial focus **selects the contents of a focused text input**
  again. Radix's `FocusScope` did this (`focus(el, { select: true })`); Base UI
  focuses and stops, which visibly changed the share-link dialog. `Dialog.Popup`
  restores it by selecting on the first focus event to reach the popup after
  mount.

### Verification

- **115 screenshot baselines**, frozen from the pre-migration Radix rendering
  before any component was touched, and captured in a pinned
  `mcr.microsoft.com/playwright:v1.62.1-noble` container so they are portable
  between a laptop and CI. `maxDiffPixels: 0` — a deliberate `px-5` → `px-6`
  regression on Button moves only 78–189 pixels, which a ratio-based threshold
  waved through. **Not one baseline changed across the whole migration.**
- **45 Playwright behaviour tests** covering what screenshots structurally
  cannot: open/close transitions (screenshots settle first), keyboard
  navigation, pointer and swipe behaviour, focus return and scroll locking.
- Storybook coverage went from 17 to 28 components — 11 had no story at all, and
  those were written *before* the components were migrated.
- `typecheck` and `build` are clean, and the packed tarball was smoke-tested in a
  scratch Vite app and a scratch Next 16 App Router app, both with no `next` peer
  installed, confirming the fonts resolve, the `latin-ext` subset is not fetched
  for ASCII content, and all 13 namespaces render from a server component.

### Known issues, deliberately not fixed

- **Six `@theme` tokens are missing** (`--color-accent`,
  `--color-accent-foreground`, `--color-muted-foreground` among them) although
  components reference them, so those utilities emit nothing — dropdown menu
  items have no hover background, for instance. Left as-is so the baselines
  capture the real v2 rendering and the migration stays honest. Worth its own
  release with a baseline regeneration.
- **`tacking-wide`** (for `tracking-wide`) on the accordion trigger has always
  been a typo emitting nothing. Left verbatim for the same reason — fixing it
  moves pixels.
- `src/lib/ag-grid.ts` (`themeOM`) references AG Grid, which is not a dependency.
- `select.tsx` is still `react-select`. Replacing it with a Base UI Combobox is
  scoped for a later release.

---

## [2.0.9] and earlier

Not documented here. `2.x` is the Tailwind v4 + Radix UI line; `1.x` was
Tailwind v3.
