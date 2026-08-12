# Changelog

All notable changes to `@operatiemobilisatie/ui` are documented here. The format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] — 2026-08-12

Version 3 replaces Radix UI with [Base UI](https://base-ui.com/) and introduces
a new composition API. This is a breaking release. Follow the
[v2 to v3 migration guide](./MIGRATION.md) before upgrading an existing app.

### Highlights

- Component parts are namespaced: `DialogContent` becomes `Dialog.Popup`,
  `AccordionItem` becomes `Accordion.Item`, and so on.
- `asChild` is replaced by Base UI's `render` prop.
- The root package export now provides tree-shakeable named exports.
- Runtime dependencies are reduced from 29 to 5. Radix UI, Font Awesome,
  `motion`, `react-countup`, and the `next` peer dependency are removed.
- Lato 400/700 and Roboto Slab 500 are included as self-hosted webfonts.
- All component namespaces can be imported from React Server Components. Parts
  that require client-side behavior establish their own client boundary.
- Storybook covers every component, with visual and behavior regression suites.

### Added

- Namespaced APIs for `Accordion`, `Alert`, `AlertDialog`, `Avatar`, `Card`,
  `Dialog`, `DropdownMenu`, `RadioCards`, `RadioGroup`, `Slider`, `Tabs`, `Toast`,
  and `Tooltip`.
- A working root entry point, for example
  `import { Button, Dialog } from "@operatiemobilisatie/ui"`.
- Per-component ESM entry points and complete TypeScript declarations.
- `Tabs.Indicator` and the `indicator` option on `Tabs.List` for an animated
  active-tab highlight.
- `Slider.Label`, `Slider.Control`, and `Slider.Value`.
- `Accordion.Header`, `AlertDialog.Close`, `DropdownMenu.Positioner`,
  `Tooltip.Positioner`, `Toast.Portal`, and `Toast.Content`.
- `Toast.useToastManager()` and `Toast.createToastManager()`, including `add`,
  `close`, `update`, and promise-based toast handling.
- `CheckIcon`, `ChevronDownIcon`, `ChevronRightIcon`, `CircleIcon`, and
  `CloseIcon` as inline SVG components.
- `useInView` and `useCountUp` hooks.
- Exported `alertVariants` and `labelVariants`.
- Real CSS transitions for dialogs, alert dialogs, menus, tooltips, accordions,
  tabs, and toasts.
- Self-hosted font entry points:
  `@operatiemobilisatie/ui/fonts`, `@operatiemobilisatie/ui/fonts.css`, and raw
  files below `@operatiemobilisatie/ui/fonts/*`.

### Changed

- `asChild` becomes `render={<Element />}`.
- Flat part exports become namespace members. See the migration guide for the
  complete old-to-new export table.
- `Kicker`, `Logo`, `Select`, and `Spinner` use named exports instead of default
  exports.
- Styles are loaded explicitly with
  `@import "@operatiemobilisatie/ui/css"`; the JavaScript entry point no longer
  imports CSS as a side effect.
- The package supports React 18 and 19. `next` is no longer a peer dependency.
- Accordion values are always `string[]`; `multiple` replaces `type`; `Panel`
  replaces `Content`; and single accordions are always collapsible.
- Dialog and alert-dialog content is composed from `Portal`, `Backdrop`, and
  `Popup`.
- Dropdown-menu and tooltip placement props move to `Positioner`, while visual
  props remain on `Popup`.
- Dropdown submenu parts are renamed to `SubmenuRoot` and `SubmenuTrigger`; a
  submenu uses the regular `Popup` part.
- Menu labels are `DropdownMenu.GroupLabel` and must be inside `Group` or
  `RadioGroup`.
- Slider is composed from `Root`, `Control`, `Track`, `Indicator`, `Thumb`,
  `Label`, and `Value`.
- Tabs use `Tab` and `Panel` instead of `Trigger` and `Content`.
- Toasts are records managed by `Toast.Provider`; multiple toasts collapse into
  a stack and expand on hover or focus.
- Toast options use `timeout`, `type`, and `actionProps` instead of `duration`,
  `variant`, and a rendered action element.
- Base UI data attributes replace Radix state attributes, including
  `data-open`, `data-checked`, `data-active`, `data-panel-open`,
  `data-popup-open`, and `data-highlighted`.
- `Label` is a styled native `<label>`.
- `RadioGroup` layout is controlled with CSS instead of an `orientation` prop.
- The build uses tsdown in unbundled ESM mode and targets Node.js 20 or newer.

### Fixed

- Radio buttons display their indicator and support keyboard navigation.
- Select options show keyboard focus.
- `Progress` responds to live value changes and preserves the `null`
  indeterminate state.
- `Slider.Value` follows the current thumb value instead of the initial value.
- `RadioCards` applies its size variants correctly.
- Disabled Base UI controls correctly dim associated labels.
- Dialog initial focus selects the contents of a text input when appropriate.
- `Card.Image` forwards its ref.
- `Kicker` and `Logo` optional props match their runtime defaults.
- Missing Tailwind theme tokens, dead utility references, and the accordion
  `tracking-wide` typo are corrected.
- Tailwind source discovery includes compiled components, internal parts, and
  library helpers.
- Toast layout, stacking, entry/exit transitions, and swipe behavior are
  consistent with Base UI.
- The package root, CSS, fonts, component, and utility export paths resolve from
  the published tarball.

### Removed

- All `@radix-ui/*` and `@fortawesome/*` packages.
- `next` as a peer dependency.
- `motion`, `react-countup`, `classnames`, `tailwindcss-animate`,
  `@tailwindcss/typography`, and other unused packages.
- The Rollup/PostCSS packaging toolchain.
- The old `useToast`, `toast`, and reducer implementation from
  `lib/use-toast`.
- `AlertDialogAction` and `AlertDialogCancel`.
- The obsolete Tailwind configuration preset and unused animation keyframes.
- Dark-mode configuration. Version 3 currently provides a light theme only.

## [2.0.9] and earlier

Versions 2.x use Tailwind CSS 4 and Radix UI. Versions 1.x use Tailwind CSS 3.
Earlier releases predate this changelog; their history is available in Git.
