# Migrating from v2 to v3

Version 3 replaces Radix UI with [Base UI](https://base-ui.com/). It also changes
the package exports, composition model, multipart component names, toast API,
and styling setup. There is no compatibility layer, so an existing version 2
application must be updated before installing version 3.

Read [the global API changes](#global-api-changes) first: they account for most of the
edits in a typical codebase. Then work through the per-component tables. Rows
are renames you can apply mechanically; the prose blocks are **behaviour**
changes, where a mechanical rename compiles and then does the wrong thing.

## Quick upgrade checklist

Use this list for a first pass, then check the detailed section for every
component your application uses.

- [ ] Replace `asChild` with `render={<Element />}` and move children onto the
  component part.
- [ ] Replace flat multipart exports with namespace members such as
  `Dialog.Root`, `Dialog.Popup`, and `Accordion.Item`.
- [ ] Change default imports of `Kicker`, `Logo`, `Spinner`, and `Select` to
  named imports.
- [ ] Compose `Portal` and `Backdrop` around each `Dialog.Popup` and
  `AlertDialog.Popup`.
- [ ] Replace `AlertDialogAction` and `AlertDialogCancel`; actions no longer
  close automatically.
- [ ] Make every accordion `value` and `defaultValue` a `string[]`; replace
  `type="multiple"` with `multiple` and remove `collapsible`.
- [ ] Wrap the application in `Toast.Provider`, mount `Toaster` inside it, and
  replace `toast()` with `Toast.useToastManager().add()`.
- [ ] Put each `DropdownMenu.GroupLabel` inside a `Group` or `RadioGroup`.
- [ ] Split dropdown-menu and tooltip content into `Portal`, `Positioner`, and
  `Popup`, moving placement props to `Positioner`.
- [ ] Replace the single `<Slider />` with the new multipart slider structure.
- [ ] Add `@import "@operatiemobilisatie/ui/css"` and choose whether to import
  the bundled fonts.
- [ ] Update custom selectors from Radix state attributes to Base UI data
  attributes.
- [ ] Remove `next` as a peer required only by this package and delete any
  `@operatiemobilisatie/ui/tailwind.config` preset reference.

### At a glance

| Area | Version 2 | Version 3 |
|---|---|---|
| Composition | `asChild` | `render={<Element />}` |
| Multipart exports | flat names such as `DialogContent` | namespaces such as `Dialog.Popup` |
| Root import | default namespace object | named, tree-shakeable exports |
| Dialog structure | content included portal and overlay | compose `Portal`, `Backdrop`, and `Popup` |
| Accordion value | string in single mode | `string[]` in every mode |
| Toast queue | module-level `toast()` | `Toast.Provider` and `useToastManager()` |
| Popup placement | placement props on content | placement props on `Positioner` |
| Styling | JavaScript entry imported CSS | explicit `@operatiemobilisatie/ui/css` import |
| Fonts | supplied by the application | optional bundled Lato and Roboto Slab |
| Peers | React, React DOM, Next.js | React and React DOM |

## Important behavior changes

These changes can compile successfully while still behaving incorrectly:

1. **`AlertDialogAction` no longer closes the dialog.** → [Alert dialog](#alert-dialog)
2. **Accordion `defaultValue` must be an array**, in single mode too. → [Accordion](#accordion)
3. **`<Toast.Provider>` is now mandatory**, and `toast()` is gone. → [Toast](#toast)
4. **`DropdownMenu.GroupLabel` throws** outside a `Group`. → [Dropdown menu](#dropdown-menu)
5. **Slider `thumbAlignment` changes the value a drag produces**, not just the picture. → [Slider](#slider)

---

## Global API changes

### `asChild` → `render`

Base UI has no `Slot`. Composition is a `render` prop that takes the element to
render as, and merges the part's props onto it.

```diff
-<Dialog.Trigger asChild>
-  <Button variant="outline">Share</Button>
-</Dialog.Trigger>
+<Dialog.Trigger render={<Button variant="outline" />}>Share</Dialog.Trigger>
```

```diff
-<Button asChild><a href="/give">Give</a></Button>
+<Button render={<a href="/give" />}>Give</Button>
```

Children move out of the rendered element and onto the part. `render` also
accepts a function receiving the merged props, for the cases where you need to
place them yourself.

There is no `Slot` export. Replace any directly imported Radix `Slot` usage in
your own wrappers separately.

### Parts are namespaced

Flat `ComponentPart` exports are gone. Multi-part components export a namespace:

```diff
-import { Dialog, DialogContent, DialogTitle } from "@operatiemobilisatie/ui/dialog";
+import { Dialog } from "@operatiemobilisatie/ui";
...
-<Dialog><DialogContent><DialogTitle/></DialogContent></Dialog>
+<Dialog.Root><Dialog.Popup><Dialog.Title/></Dialog.Popup></Dialog.Root>
```

Thirteen components are namespaces: `Accordion`, `Alert`, `AlertDialog`,
`Avatar`, `Card`, `Dialog`, `DropdownMenu`, `RadioCards`, `RadioGroup`,
`Slider`, `Tabs`, `Toast`, `Tooltip`. Everything else stays flat.

### The root import works now

The version 2 root export was not usable as a normal named-export barrel.
Version 3 provides named bindings from the root entry:

```diff
-import UI from "@operatiemobilisatie/ui";       // broken
-import { Button } from "@operatiemobilisatie/ui/button";
+import { Button } from "@operatiemobilisatie/ui";
```

Per-component subpaths still work and are still the smallest graph.

### Default exports became named

| v2 | v3 |
|---|---|
| `import Kicker from ".../kicker"` | `import { Kicker } from ".../kicker"` |
| `import Logo from ".../logo"` | `import { Logo } from ".../logo"` |
| `import Spinner from ".../spinner"` | `import { Spinner } from ".../spinner"` |
| `import Select from ".../select"` | `import { Select } from ".../select"` |

### Data attributes

If you wrote your own Tailwind variants against the library's DOM, Base UI's
state attributes differ from Radix's. The ones that matter:

| Radix | Base UI |
|---|---|
| `data-[state=open]` | `data-open` (popup, backdrop, positioner) |
| `data-[state=closed]` | `data-closed` |
| `data-[state=open]` on a **menu trigger** | `data-popup-open` |
| `data-[state=open]` on an **accordion trigger** | `data-panel-open` |
| `data-[state=checked]` / `unchecked` | `data-checked` / `data-unchecked` |
| `data-[state=active]` | `data-active` (tabs) |
| `data-[motion=…]` | `data-starting-style` / `data-ending-style` |
| `focus:` on a menu item | `data-highlighted:` |
| `--radix-accordion-content-height` | `--accordion-panel-height` |
| `--radix-toast-swipe-move-x` | `--toast-swipe-movement-x` |

Tailwind v4 supports the bare `data-foo:` form for valueless attributes, so
none of these need brackets. Note that all of these fail *silently*:
`data-[state=open]:` stays valid Tailwind and simply never matches.

---

## Accordion

| v2 | v3 |
|---|---|
| `Accordion` | `Accordion.Root` |
| `AccordionItem` | `Accordion.Item` |
| `AccordionTrigger` | `Accordion.Header` + `Accordion.Trigger` |
| `AccordionContent` | `Accordion.Panel` |

`Header` is now its own part. The DOM is unchanged — Radix's `AccordionTrigger`
rendered its own `<Header>` internally, so `<Header><Trigger/></Header>` emits
the same `<h3 class="flex"><button/></h3>`.

### `type` → `multiple`

```diff
-<Accordion type="single" collapsible defaultValue="item-1">
+<Accordion.Root defaultValue={["item-1"]}>

-<Accordion type="multiple" defaultValue={["item-1", "item-2"]}>
+<Accordion.Root multiple defaultValue={["item-1", "item-2"]}>
```

### `value` is always `string[]`

**In both modes.** Single mode holds an array of length 0 or 1. `onValueChange`
hands back `string[]`, never `string`.

**A bare string fails silently.** Base UI compares `value[0]` against the item
value, and `"item-1"[0]` is `"i"`, so `defaultValue="item-1"` opens nothing, logs
nothing and throws nothing. This is the single most likely thing to slip through
a v2→v3 accordion edit.

### `collapsible` is gone, and is effectively always on

Radix's single mode refused to close the last open item unless you passed
`collapsible`. Base UI toggles it shut unconditionally. If your design depends
on always having exactly one panel open, you now have to control `value`
yourself and refuse the empty array.

### Overflow is permanently hidden

The v2 component flipped `style.overflow` to `visible` after an open animation
finished, so a non-portalled popup inside a panel could escape it. That hack is
gone with the keyframes it belonged to. Base UI portals popups by default, so
this is rare — but an inline-rendered overlay inside an accordion panel will now
clip.

---

## Alert

| v2 | v3 |
|---|---|
| `Alert` | `Alert.Root` |
| `AlertTitle` | `Alert.Title` |
| `AlertDescription` | `Alert.Description` |

`alertVariants` is now exported as `Alert.alertVariants`. No behaviour change —
this component never used Radix.

---

## Alert dialog

| v2 | v3 |
|---|---|
| `AlertDialog` | `AlertDialog.Root` |
| `AlertDialogTrigger` | `AlertDialog.Trigger` |
| `AlertDialogPortal` | `AlertDialog.Portal` |
| `AlertDialogOverlay` | `AlertDialog.Backdrop` |
| `AlertDialogContent` | `AlertDialog.Popup` |
| `AlertDialogHeader` | `AlertDialog.Header` |
| `AlertDialogFooter` | `AlertDialog.Footer` |
| `AlertDialogTitle` | `AlertDialog.Title` |
| `AlertDialogDescription` | `AlertDialog.Description` |
| `AlertDialogCancel` | **removed** — see below |
| `AlertDialogAction` | **removed** — see below |
| — | `AlertDialog.Close` (new) |

### ⚠ The action button no longer closes the dialog

This reads like a rename and is not one. Radix's `AlertDialogAction` closed the
dialog for you on click. Base UI's alert-dialog re-exports `Close` and nothing
else, so the two roles are spelled out at the call site:

```diff
 <AlertDialog.Footer>
-  <AlertDialogCancel>Cancel</AlertDialogCancel>
-  <AlertDialogAction onClick={deleteAccount}>Delete</AlertDialogAction>
+  <AlertDialog.Close render={<Button variant="outline-secondary" size="sm" />}>
+    Cancel
+  </AlertDialog.Close>
+  <Button variant="destructive" size="sm" onClick={deleteAccount}>Delete</Button>
 </AlertDialog.Footer>
```

Cancel is fine — `AlertDialog.Close` closes, exactly as `AlertDialogCancel` did.
**The action is not.** `<Button onClick={deleteAccount}>` runs the handler and
leaves the dialog open. **Every consumer that relied on the auto-close needs a
code change**, and nothing in the types or the console will tell them. Either
wrap the action in `AlertDialog.Close` too, or control `open` and close it when
the action resolves — the latter is usually what you want for an async action,
since it lets you keep the dialog up until the request succeeds.

### Portal and Backdrop are composed at the call site

`AlertDialogContent` rendered its own `Portal` and `Overlay` internally. The v3
`Popup` does not:

```diff
 <AlertDialog.Root>
   <AlertDialog.Trigger render={<Button variant="destructive" />}>Delete</AlertDialog.Trigger>
-  <AlertDialogContent>…</AlertDialogContent>
+  <AlertDialog.Portal>
+    <AlertDialog.Backdrop />
+    <AlertDialog.Popup>…</AlertDialog.Popup>
+  </AlertDialog.Portal>
 </AlertDialog.Root>
```

Forgetting the `Backdrop` is a silent visual regression — the dialog renders,
just without the dimmed page behind it.

### Escape still closes it

Escape continues to close the alert dialog. An outside press does not.

---

## Avatar

| v2 | v3 |
|---|---|
| `Avatar` | `Avatar.Root` |
| `AvatarImage` | `Avatar.Image` |
| `AvatarFallback` | `Avatar.Fallback` |

---

## Badge, Input, Textarea, Skeleton, Spinner, Checkbox, Switch, Progress

Export names are unchanged (except `Spinner`, which is no longer a default
export). Checkbox and Switch move from Radix to Base UI internally; the props
you pass are the same, but if you targeted `data-[state=checked]` in your own
CSS, that is now `data-checked`. Checkbox additionally gains
`data-indeterminate`.

`Progress` keeps its scroll-in fill animation and counting label without the
`motion` and `react-countup` dependencies. It also accepts `value={null}` for an
indeterminate progress bar.

---

## Button

`Button` and `buttonVariants` keep their names. `asChild` → `render`:

```diff
-<Button asChild><Link href="/give">Give</Link></Button>
+<Button render={<Link href="/give" />}>Give</Button>
```

The package no longer depends on Font Awesome. Continue to supply application
icons as children, or use the exported inline `CheckIcon`, `ChevronDownIcon`,
`ChevronRightIcon`, `CircleIcon`, and `CloseIcon` components.

---

## Card

| v2 | v3 |
|---|---|
| `Card` | `Card.Root` |
| `CardImage` | `Card.Image` |
| `CardHeader` | `Card.Header` |
| `CardTitle` | `Card.Title` |
| `CardDescription` | `Card.Description` |
| `CardContent` | `Card.Content` |
| `CardFooter` | `Card.Footer` |

`Card.Root` composes with `render`, so a whole-card link is
`<Card.Root render={<Link href="/story" />}>`.

`Card.Image` forwards its ref.

---

## Dialog

| v2 | v3 |
|---|---|
| `Dialog` | `Dialog.Root` |
| `DialogTrigger` | `Dialog.Trigger` |
| `DialogPortal` | `Dialog.Portal` |
| `DialogOverlay` | `Dialog.Backdrop` |
| `DialogContent` | `Dialog.Popup` |
| `DialogClose` | `Dialog.Close` |
| `DialogHeader` | `Dialog.Header` |
| `DialogFooter` | `Dialog.Footer` |
| `DialogTitle` | `Dialog.Title` |
| `DialogDescription` | `Dialog.Description` |

Same composition change as the alert dialog: `DialogContent` rendered its own
`Portal` and `Overlay`; `Dialog.Popup` does not.

```diff
 <Dialog.Root>
   <Dialog.Trigger render={<Button variant="outline" />}>Share</Dialog.Trigger>
-  <DialogContent>…</DialogContent>
+  <Dialog.Portal>
+    <Dialog.Backdrop />
+    <Dialog.Popup>…</Dialog.Popup>
+  </Dialog.Portal>
 </Dialog.Root>
```

The built-in close button stays inside `Dialog.Popup`, and is now a
`Dialog.Close render={<Button …/>}` internally rather than an `asChild`.

Scroll locking is Base UI's inline-style `useScrollLock` rather than
`react-remove-scroll`. Behaviour is equivalent; the difference is only visible
if you were reading the DOM to detect it.

---

## Dropdown menu

Fifteen flat exports become fifteen namespaced parts, but not one-for-one.

| v2 | v3 |
|---|---|
| `DropdownMenu` | `DropdownMenu.Root` |
| `DropdownMenuTrigger` | `DropdownMenu.Trigger` |
| `DropdownMenuPortal` | `DropdownMenu.Portal` |
| `DropdownMenuContent` | `DropdownMenu.Positioner` + `DropdownMenu.Popup` |
| `DropdownMenuItem` | `DropdownMenu.Item` |
| `DropdownMenuCheckboxItem` | `DropdownMenu.CheckboxItem` |
| `DropdownMenuRadioGroup` | `DropdownMenu.RadioGroup` |
| `DropdownMenuRadioItem` | `DropdownMenu.RadioItem` |
| `DropdownMenuGroup` | `DropdownMenu.Group` |
| `DropdownMenuLabel` | `DropdownMenu.GroupLabel` — **see below** |
| `DropdownMenuSeparator` | `DropdownMenu.Separator` |
| `DropdownMenuShortcut` | `DropdownMenu.Shortcut` |
| `DropdownMenuSub` | `DropdownMenu.SubmenuRoot` |
| `DropdownMenuSubTrigger` | `DropdownMenu.SubmenuTrigger` |
| `DropdownMenuSubContent` | **folded into `DropdownMenu.Popup`** |
| — | `DropdownMenu.Positioner` (new) |

### `Content` splits into `Positioner` + `Popup`

```diff
 <DropdownMenu.Root>
   <DropdownMenu.Trigger render={<Button variant="outline" />}>Open</DropdownMenu.Trigger>
-  <DropdownMenuContent align="end" sideOffset={4}>…</DropdownMenuContent>
+  <DropdownMenu.Portal>
+    <DropdownMenu.Positioner align="end" sideOffset={4}>
+      <DropdownMenu.Popup>…</DropdownMenu.Popup>
+    </DropdownMenu.Positioner>
+  </DropdownMenu.Portal>
 </DropdownMenu.Root>
```

`side`, `align`, `sideOffset` and `alignOffset` all belong to the `Positioner`
now. The wrapper restores Radix's defaults for you: `sideOffset={4}` and
`positionMethod="fixed"` (Base UI defaults to `0` and `"absolute"`; Radix's
Popper hard-coded a fixed strategy, and the difference is visible — a fixed
element is composited, which switches Chrome from subpixel to greyscale text
antialiasing).

### ⚠ `GroupLabel` throws outside a `Group`

`DropdownMenuLabel` could go anywhere. `DropdownMenu.GroupLabel` wires
`aria-labelledby` onto its group and **throws** if there is no `Group` or
`RadioGroup` above it. A standalone label needs a wrapper, which is a plain
block with no pixel effect:

```diff
-<DropdownMenuLabel>My account</DropdownMenuLabel>
-<DropdownMenuItem>Profile</DropdownMenuItem>
+<DropdownMenu.Group>
+  <DropdownMenu.GroupLabel>My account</DropdownMenu.GroupLabel>
+  <DropdownMenu.Item>Profile</DropdownMenu.Item>
+</DropdownMenu.Group>
```

### Submenus reuse `Popup`

There is no submenu-specific popup part. `SubContent` becomes an ordinary
`Popup` inside a `Positioner` inside the `SubmenuRoot`.

### Focus lives on the popup, not the item

Radix moved DOM focus onto the highlighted item, so `focus:bg-accent` styled it.
Base UI keeps focus on the popup and marks the active item with
`data-highlighted`. Any `focus:` variant you wrote against a menu item stays
valid Tailwind and stops matching. The library's own items now use
`data-highlighted:`.

The same applies to a submenu trigger while its submenu is open: it **loses**
`data-highlighted` at that moment, so `data-popup-open:bg-accent` is what keeps
it looking active, not a nicety.

### Submenus open on hover

Submenus open after the pointer rests on the trigger; pressing the trigger does
not toggle the submenu. The Right Arrow key opens it from the keyboard.

---

## Kicker and Logo

Both are named exports now (`import { Kicker }`, `import { Logo }`).

`className`, `attributes`, and `as` on `Kicker`, plus `width` and `height` on
`Logo`, are optional. Their runtime defaults therefore work without supplying
those props.

`Logo` is no longer an `async` component, so it works outside an RSC.

---

## Label

`Label` keeps its name, but it is now a plain styled `<label>`.
**`@radix-ui/react-label` is dropped with no replacement.** Base UI has no
standalone Label — labelling belongs to `Field.Label`, which is scoped to a
`Field`. The Radix package existed only to paper over old browsers not firing
click-through on labels wrapping custom controls, which has not been true for
years.

The styling contract is unchanged, and `labelVariants` is now exported. If you
relied on Radix's synthetic click forwarding for a non-native control, verify it
in a browser.

---

## Radio group, radio cards, radio button

| v2 | v3 |
|---|---|
| `RadioGroup` | `RadioGroup.Root` |
| `RadioGroupItem` | `RadioGroup.Item` |
| `RadioCards` | `RadioCards.Root` |
| `RadioCardsItem` | `RadioCards.Item` |
| `radioVariants` (from `radio-group`) | `RadioGroup.radioControlVariants` |
| `radioIndicatorVariants` | `RadioGroup.radioIndicatorVariants` |
| `radioVariants` (from `radio-button`) | `radioButtonVariants` |
| `RadioButton` | `RadioButton` (unchanged) |

`radioVariants` was exported under that name by **both** `radio-group` and
`radio-button` — two different cvas colliding in the barrel. They are
`radioControlVariants` and `radioButtonVariants` now.

### No `orientation` prop

Base UI's `RadioGroup` is the root primitive itself — there is no
`RadioGroup.Root` *in Base UI* — and it has no `orientation` prop. This
package's `RadioGroup.Root` / `RadioCards.Root` are thin wrappers over it, so
the namespaced `.Root` shape is unchanged for you, but:

```diff
-<RadioCards orientation="vertical">
+<RadioCards.Root className="flex-col">
```

`RadioCards.Root` is `flex gap-2` as it always was, so the horizontal default is
unchanged and `orientation="horizontal"` can simply be deleted. Only Radix's
roving-focus axis is lost; arrow keys now follow the DOM order. Layout direction
comes from the flex container, which is what actually laid these out in v2
anyway.

---

## Select

`Select` is a named export instead of a default. It continues to use
`react-select`, with the same `displaySize` prop and option shape.

---

## Slider

| v2 | v3 |
|---|---|
| `Slider` (one component, all internals baked in) | `Slider.Root` > `Slider.Control` > `Slider.Track` > `Slider.Indicator`, plus `Slider.Thumb` and `Slider.Value` |

```diff
-<Slider defaultValue={[75]} max={100} step={1} />
+<Slider.Root defaultValue={[75]} max={100} step={1}>
+  <Slider.Control>
+    <Slider.Track>
+      <Slider.Indicator />
+    </Slider.Track>
+    <Slider.Thumb>
+      <Slider.Value />
+    </Slider.Thumb>
+  </Slider.Control>
+</Slider.Root>
```

Radix's `Root` is Base UI's `Root` **plus** `Control`: `Root` is a plain
`<div role="group">` and `Control` is the interactive surface the thumb
positions against. `Range` is `Indicator`. The thumb needs no `asChild` any
more — it is already a `<div>` (wrapping a visually hidden
`<input type="range">`).

### ⚠ `thumbAlignment="edge"` changes the value a drag produces

This package sets `thumbAlignment="edge"` because that is what Radix did.
Base UI defaults to `"center"`. The difference is **not** just where the thumb
is drawn: `edge` insets the usable track by half a thumb width at each end, so
the pointer→value mapping is different. A drag that landed on 75 under Radix
reads **77** under `center`.

If you pass `thumbAlignment` yourself, know what you are choosing. At the exact
midpoint the two agree, which is why this had to be read off the geometry rather
than off a screenshot.

### `Slider.Value` is live

The version 2 value label stayed at `defaultValue`. `Slider.Value` reads the
current value from context and follows the handle.

### Two silent styling failures if you copied the v2 classes

- The thumb's focus ring must hang off `has-[:focus-visible]:`, not
  `focus-visible:` — the focusable element is the hidden input inside the thumb,
  not the thumb.
- `aria-disabled:opacity-50` must be `data-disabled:opacity-50` — Base UI does
  not set a native disabled attribute on non-`<button>` parts.

---

## Tabs

| v2 | v3 |
|---|---|
| `Tabs` | `Tabs.Root` |
| `TabsList` | `Tabs.List` |
| `TabsTrigger` | `Tabs.Tab` |
| `TabsContent` | `Tabs.Panel` |
| — | `Tabs.Indicator` (new — the travelling highlight) |

The active-state attribute is `data-active`, not `data-[state=active]` and not
`data-selected`.

By default the active tab paints its own white pill, exactly as in v2. Pass
`indicator` to `Tabs.List` and the pill becomes a single element that *slides*
between tabs instead:

```diff
-<Tabs.List>
+<Tabs.List indicator>
```

That one prop also takes the static background off the active tab — leaving both
on would draw a second pill that snaps into place while the real one is still
travelling. `Tabs.Indicator` is exported for hand composition, but then that is
yours to handle.

---

## Toast

The whole feature changes shape, not just the names. Radix rendered whatever JSX
you handed it and let you drive `open`. Base UI has no `open`: every toast is a
record in a queue owned by `Toast.Provider`, and `Toast.Root` takes that record
as its required `toast` prop.

**`src/lib/use-toast.ts` is deleted** — a 192-line shadcn reducer with a
module-level toast array, a listener list and a `REMOVE_TOAST` timer queue,
reimplementing exactly what `Toast.useToastManager()` provides.

### ⚠ `<Toast.Provider>` is now mandatory, and this is the real breaking change

The old queue was a module-level variable, so `<Toaster/>` could own the provider
and `toast()` could be imported from anywhere — including from outside a
component. Base UI keeps the queue in **React context**, and `useToastManager()`
only resolves against a provider *above the caller*. A `<Toaster/>` that owned
the provider would put every consumer outside it and every `add()` would throw.

So the provider has to be a real wrapper in your tree:

```diff
+<Toast.Provider>
   <App />
   <Toaster />
+</Toast.Provider>
```

and pushes come from a hook, in a component under it:

```diff
-import { toast } from "@operatiemobilisatie/ui/lib/use-toast";
-
-function SaveButton() {
-  return <Button onClick={() => toast({ title: "Saved" })}>Save</Button>;
-}
+import { Toast } from "@operatiemobilisatie/ui";
+
+function SaveButton() {
+  const { add } = Toast.useToastManager();
+  return <Button onClick={() => add({ title: "Saved" })}>Save</Button>;
+}
```

**To push from outside React** — an API client, an event handler on a global
object, a store subscription — create the manager yourself and hand it to the
provider. This is the closest thing to the old module-level import:

```tsx
// toast-manager.ts
import { Toast } from "@operatiemobilisatie/ui";
export const toastManager = Toast.createToastManager();

// anywhere, no React needed
toastManager.add({ title: "Upload finished" });

// app root
<Toast.Provider toastManager={toastManager}>…</Toast.Provider>
```

### Export and option renames

| v2 | v3 |
|---|---|
| `ToastProvider` | `Toast.Provider` |
| `ToastViewport` | `Toast.Viewport` |
| `Toast` | `Toast.Root` |
| `ToastTitle` | `Toast.Title` |
| `ToastDescription` | `Toast.Description` |
| `ToastClose` | `Toast.Close` |
| `ToastAction` | `Toast.Action` |
| `ToastProps` | `React.ComponentProps<typeof Toast.Root>` |
| `ToastActionElement` | removed — see `actionProps` below |
| `Toaster` | `Toaster` (mount inside `Toast.Provider`) |
| — | `Toast.Portal` (new) |
| — | `Toast.Content` (new — the padded row inside the toast, plus a ResizeObserver that lets the viewport stack toasts) |
| `useToast()` | `Toast.useToastManager()` |
| `toast({…})` | `useToastManager().add({…})` |
| `useToast().toasts` | `useToastManager().toasts` |
| `dismiss(id)` | `close(id)` |
| — | `update(id, {…})` (new) |
| — | `promise(p, { loading, success, error })` (new) |
| `reducer` (from `lib/use-toast`) | removed |

### Toasts stack rather than stacking up

Several toasts collapse behind one another — each one back is 12px higher, 10%
smaller and has its contents faded out — and fan into a spaced list on hover or
focus. `limit` on `Toast.Provider` caps how many are on screen (default 3). The
viewport is an anchor point in the bottom-right corner, not a full-height column
down the edge of the screen.

Nothing to do if you use `<Toaster/>`. If you compose the parts by hand, the
nesting is load-bearing: `Toast.Content` is the padded row and has to contain
everything that takes up height, because `Toast.Root` re-measures itself from
Content's ResizeObserver and the stack offsets come from that measurement.

```tsx
<Toast.Root toast={toast}>
  <Toast.Content>
    <div className="grid min-w-0 flex-1 gap-1">
      <Toast.Title />
      <Toast.Description />
    </div>
    <Toast.Action />
  </Toast.Content>
  {/* absolutely positioned, adds no height, so it stays outside */}
  <Toast.Close />
</Toast.Root>
```

Per-toast options:

| v2 | v3 |
|---|---|
| `duration: 5000` | `timeout: 5000` |
| `duration: Infinity` | `timeout: 0` |
| `variant: "destructive"` | `type: "destructive"` |
| `action={<ToastAction altText="Undo" onClick={undo}>Undo</ToastAction>}` | `actionProps: { children: "Undo", onClick: undo }` |
| `altText` | removed |

`altText` is gone because Base UI announces the title and description through
the viewport's live region instead; an unknown `altText` would land on the
`<button>` as a stray attribute.

`type` is Base UI's documented hook for conditional styling, so `<Toaster/>`
maps it onto the variant cva. `Toast.Root` still takes `variant` directly if you
compose the toast by hand.

### Swipe

Base UI's default `swipeDirection` is `['down', 'right']`; Radix swiped right
only. The in-flight transform is written inline on the root with
`transition: none` pinned while a pointer is down, so you no longer apply the
translate yourself — `data-[swipe=move]:translate-x-(…)` has nothing to do.
`--toast-swipe-movement-x` / `-y` are still published if you want to fade or
rotate with the drag.

### Element types

`Viewport` is a `<div>` where Radix used `<ol>`, `Root` a `<div>` where Radix
used `<li>`, `Title` an `<h2>` where Radix used a `<div>`, `Description` a `<p>`.
Tailwind's preflight zeroes the heading and paragraph margins and inherits their
font-size and weight, so none of them move a pixel — but a descendant selector
of the form `ol > li` in your own CSS will stop matching.

---

## Tooltip

| v2 | v3 |
|---|---|
| `TooltipProvider` | `Tooltip.Provider` |
| `Tooltip` | `Tooltip.Root` |
| `TooltipTrigger` | `Tooltip.Trigger` |
| `TooltipContent` | `Tooltip.Portal` > `Tooltip.Positioner` > `Tooltip.Popup` |

```diff
 <Tooltip.Root>
   <Tooltip.Trigger render={<Button variant="outline" />}>Hover</Tooltip.Trigger>
-  <TooltipContent side="top" sideOffset={4}>Add to library</TooltipContent>
+  <Tooltip.Portal>
+    <Tooltip.Positioner side="top" sideOffset={4}>
+      <Tooltip.Popup>Add to library</Tooltip.Popup>
+    </Tooltip.Positioner>
+  </Tooltip.Portal>
 </Tooltip.Root>
```

`side`, `align` and `sideOffset` move from the styled element to the
`Positioner`. The wrapper restores `sideOffset={4}` and `positionMethod="fixed"`
to match Radix's defaults.

### ⚠ `Tooltip.Root` has no `delayDuration`

The open delay is `delay`, on `Tooltip.Provider` or on an individual
`Tooltip.Trigger`.

```diff
-<Tooltip delayDuration={200}>
+<Tooltip.Provider delay={200}>
```

An unknown `delayDuration` on `Tooltip.Root` is a type error, so at least this
one fails loudly.

### Testing tooltips

`userEvent.hover` no longer opens a Base UI tooltip on the first attempt. Base
UI opens from a native `mouseenter` listener but gates on the pointer type
recorded by React's synthetic `onPointerEnter`, and user-event dispatches the
whole burst in one task, so the native listener wins the race. Hover → unhover →
hover, or prime with a `pointerover` and `await`. Real users are unaffected.

---

## Packaging, peers and styling

### `next` is no longer a peer dependency

Remove it from your reasoning about this package entirely. Nothing here imports
`next`; the library works identically in Vite, Next App Router, Remix and Astro.
Peers are `react` and `react-dom`, `^18 || ^19`.

### The JS entry no longer imports CSS

v2's `src/index.ts` did a side-effect `import "./globals.css"`, which forced
every consumer to have a CSS-capable bundler. It is gone. Stylesheets come in
explicitly, and **you must add the `@import` or nothing is styled**:

```css
@import "tailwindcss";
@import "@operatiemobilisatie/ui/css";
```

That import carries the `@theme` tokens *and* an `@source` directive scanning
`dist/components/`, `dist/internal/` and `dist/lib/`, which is what generates the
library's utility classes in your build. The `internal/` directory is the one
that used to be missed: the Dialog and AlertDialog close buttons and Card's
`Root` live there, and a glob stopping at `components/` silently dropped their
positioning classes from a consumer's Tailwind build.

### There is no `tailwind.config.js` preset

The v2 README claimed the package exported one. It has not since v2.0.0 — under
Tailwind v4 the tokens are in `@theme` inside the stylesheet. If you have a
`presets: [require("@operatiemobilisatie/ui/tailwind.config")]` line somewhere,
it has been resolving to nothing; delete it.

### Fonts now ship

Lato 400/700 and Roboto Slab 500 are bundled as self-hosted woff2. v2 declared
`--font-lato` and `--font-roboto-slab` but shipped no files — and in fact
declared them as `--font-lato: var(--font-lato)`, a self-reference that resolved
to nothing unless you happened to define it. If you were loading these families
yourself, you can drop that and add:

```css
@import "@operatiemobilisatie/ui/fonts";
```

or keep your own loader and skip that import. See the README for the `next/font`
opt-out and why it needs an indirection through your own variable names.

### Server components

All 13 namespace exports render from an RSC. A module in this package carries
`"use client"` only if it calls a React hook itself. If you write your own
wrapper that re-exports parts as a namespace, keep hooks out of that file — a
namespace object built inside a `"use client"` module crosses the RSC boundary
as one opaque reference, with `Object.keys()` returning `[]`.

Interactive parts establish their own client boundaries. Importing `Button`,
`Card.Root`, `Dialog.Popup`, or any namespace from a server component is
supported; the consuming server component does not need a `"use client"`
directive unless it uses client-side React features itself.

---
