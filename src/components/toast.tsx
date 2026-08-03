/*
 * No "use client" here. See the note on the directive policy in src/index.ts:
 * `export * as Toast` builds its namespace object in this module, and a namespace
 * object built inside a "use client" module reaches a server component as one
 * opaque client reference with no keys. Nothing below calls a hook, so nothing
 * below needs the boundary -- the Base UI parts each carry their own.
 */
import * as React from "react"
import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import { cva, type VariantProps } from "class-variance-authority"
import { CloseIcon } from "./icons"

import { cn } from "../lib/utils"

/*
 * Base UI's toast, adopted as-is. The shape of the whole feature changes, not
 * just the part names:
 *
 *   Radix rendered whatever JSX you handed it and let you drive `open` yourself,
 *   so a toast could be written literally in a template. Base UI has no `open`:
 *   every toast is a record in a queue owned by `Toast.Provider`, and
 *   `Toast.Root` takes that record as its required `toast` prop. Nothing renders
 *   until something calls `add()`.
 *
 *   That is why `src/lib/use-toast.ts` is gone. It was a 192-line shadcn reducer
 *   -- an in-memory toast array, a module-level listener list and a
 *   REMOVE_TOAST timer queue -- reimplementing exactly what
 *   `Toast.useToastManager()` now provides, with `add` / `close` / `update` and
 *   a `promise` helper on top.
 *
 *   Consumers wrap their app in `<Toast.Provider>`, mount `<Toaster/>` inside
 *   it, and call `Toast.useToastManager().add(...)` from any component under the
 *   provider. Outside React, `Toast.createToastManager()` gives a manager object
 *   to hand to `<Toast.Provider toastManager={...}>`, which is the closest thing
 *   to the old module-level `toast()` import.
 *
 * Prop-level differences worth knowing:
 *
 *   duration        ->  timeout, on the Provider (per toast: `timeout` in the
 *                       add() options). `Infinity` is now `0`.
 *   variant         ->  `type` on the toast record. Base UI documents `type` as
 *                       the hook for conditional styling, so `Toaster` maps it
 *                       onto the cva below; `Root` still takes `variant`
 *                       directly when composing by hand.
 *   ToastAction     ->  no `altText`. Radix required it for the screen-reader
 *                       announcement; Base UI announces the title and
 *                       description via the viewport's live region instead, and
 *                       an unknown `altText` prop would land on the <button> as
 *                       a stray attribute.
 *   action={<... />} ->  `actionProps` in the add() options. `<Toast.Action/>`
 *                       renders null unless it has children of its own or the
 *                       toast record supplies `actionProps.children`, so the
 *                       Toaster can render it unconditionally.
 *
 * Element types change slightly and are all preflight-neutral: Viewport is a
 * <div> where Radix used <ol>, Root a <div> where Radix used <li>, Title an <h2>
 * where Radix used a <div>, Description a <p>. Tailwind's preflight zeroes the
 * heading/paragraph margins and inherits their font-size and weight, so none of
 * them move a pixel.
 */

const Provider = ToastPrimitive.Provider
/*
 * Annotated rather than inferred: the inferred type of `Toast.Portal` names
 * `FloatingPortalLite.Props`, which lives under `@base-ui/react/utils/` and is
 * not reachable through the package's `exports` map, so `tsc` refuses to write
 * it into the declaration file (TS2883). The type query keeps the reference
 * inside the import we already have.
 */
const Portal: typeof ToastPrimitive.Portal = ToastPrimitive.Portal
const useToastManager = ToastPrimitive.useToastManager
const createToastManager = ToastPrimitive.createToastManager

/*
 * The viewport is now a zero-height anchor line in the bottom-right corner, not
 * a full-height flex column.
 *
 * `flex max-h-screen w-full flex-col-reverse p-6` was a straight carry-over from
 * the Radix template, and it is what made the toasts feel wrong: the viewport
 * covered the entire right-hand edge of the screen whether one toast was showing
 * or none, the toasts were laid out as flex items with no `gap` between them so
 * they touched, and nothing stacked -- three toasts meant three full-size cards
 * marching up the page.
 *
 * Base UI's model is different and is what the sizing below exists to serve:
 * every Toast.Root is `position: absolute` against this element and places
 * itself from `--toast-index` and `--toast-offset-y`, so the viewport only has
 * to say *where the corner is and how wide a toast may be*. Height comes from
 * the toasts themselves.
 *
 * It still needs to be a real hover target -- it is the element whose
 * mouseenter/focus flips the stack to `data-expanded` -- and it gets that from
 * its children rather than from its own (empty) box, which is why Toast.Root
 * carries an `::after` bridging the gap between cards.
 */
const Viewport = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-4 left-auto right-4 top-auto z-100 mx-auto w-[calc(100vw-2rem)] sm:bottom-8 sm:right-8 sm:w-105",
      className
    )}
    {...props}
  />
))

/*
 * Seven classes went from the base string here during the migration:
 *
 *   data-[state=open]:animate-in            data-[state=closed]:animate-out
 *   data-[swipe=end]:animate-out            data-[state=closed]:fade-out-80
 *   data-[state=closed]:slide-out-to-right-full
 *   data-[state=open]:slide-in-from-top-full
 *   data-[state=open]:sm:slide-in-from-bottom-full
 *
 * None of them ever emitted anything. tailwindcss-animate was a dependency but
 * was never registered as a plugin and there is no tailwind.config to register
 * it in, so the toast had no enter or exit animation for as long as this file
 * existed.
 *
 * What replaced them at first was a like-for-like translation: one transition,
 * slide in, slide out, and the toast still laid out as a flex item in a
 * full-height column. That kept Radix's *behaviour* and threw away the reason to
 * be on Base UI at all, because Base UI's toast is a stack, not a list. The
 * geometry below is Base UI's own, and each piece is load-bearing:
 *
 *   --toast-index      how many toasts are in front of this one. Drives the
 *                      z-order, the scale (10% smaller per step back) and the
 *                      12px of card that peeks out from behind the one in front.
 *   --toast-offset-y   the summed height of the toasts in front, published by
 *                      Base UI. Only used in the expanded state, where the stack
 *                      fans out into a real list -- hence --gap, which is the
 *                      spacing between cards that the old flex column, with no
 *                      `gap` of any kind, simply did not have.
 *   --toast-height     this toast's natural height, measured by Toast.Content's
 *                      ResizeObserver. --toast-frontmost-height is the frontmost
 *                      one's, published on the viewport; collapsed, every card
 *                      takes that height so the stack has square edges, and
 *                      expanded each takes its own.
 *
 * The `::after` is not decoration. Collapsed cards are `--gap` apart when the
 * stack expands, and the viewport -- which is what listens for the hover that
 * expands it -- is a zero-height element in the corner. Without a strip
 * bridging that gap, dragging the pointer from one card to the next leaves the
 * stack entirely and collapses it under the cursor.
 *
 * The swipe classes are gone for a different reason -- they are redundant rather
 * than dead. Radix published `--radix-toast-swipe-move-x` and left you to apply
 * the translate; Base UI writes the in-flight transform inline on the root and
 * pins `transition: none` while a pointer is down. `--toast-swipe-movement-x`
 * (and `-y`) still appear in the transforms below so that a drag composes with
 * the stack offset instead of fighting it, and the four `data-swipe-direction`
 * exits send a dismissed toast out the way it was thrown.
 *
 * `overflow-hidden` moved off the root and onto Toast.Content, where it cannot
 * clip that `::after` strip.
 */
const toastVariants = cva(
  [
    "[--gap:0.75rem] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]",
    "[--height:var(--toast-frontmost-height,var(--toast-height))]",
    "[--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]",
    "group pointer-events-auto absolute bottom-0 left-auto right-0 mr-0 w-full origin-bottom select-none",
    "z-[calc(1000-var(--toast-index))] h-[var(--height)] data-expanded:h-[var(--toast-height)]",
    "rounded-2xl border shadow-lg",
    "after:absolute after:left-0 after:top-full after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
    "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]",
    "data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--offset-y)))]",
    "data-starting-style:[transform:translateY(150%)]",
    "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]",
    "data-ending-style:opacity-0 data-limited:opacity-0",
    "data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
    "data-expanded:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
    "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
    "data-expanded:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
    "data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
    "data-expanded:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
    "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
    "data-expanded:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
    "[transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s,height_0.15s]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        success: "border-green-300 bg-success-background text-success-foreground",
        info: "border-blue-300 bg-info-background text-info-foreground",
        destructive: "destructive group border-primary-300 bg-destructive-background text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type Variant = NonNullable<VariantProps<typeof toastVariants>["variant"]>

const Root = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => (
  <ToastPrimitive.Root
    ref={ref}
    className={cn(toastVariants({ variant }), className)}
    {...props}
  />
))

/*
 * New part with no Radix counterpart, and it is now the toast's padded row
 * rather than the `grid gap-1` text stack it started as. Two reasons it has to
 * be the row:
 *
 *   It carries `data-behind`, which Base UI sets on every toast except the
 *   frontmost. Collapsed, the cards behind show only a 12px sliver at the top --
 *   the exact strip their title would otherwise be printed in -- so their
 *   contents fade out, and fade back in on `data-expanded` when the stack fans
 *   open. Anything left outside this element would keep showing through.
 *
 *   Its ResizeObserver is what keeps the toast's measured height current, and
 *   Toast.Root measures *itself* when that fires. Content therefore has to
 *   contain everything that contributes height, or the stack offsets are
 *   computed from the wrong number.
 *
 * `Toast.Close` is the deliberate exception: it is absolutely positioned, adds
 * no height, and stays a sibling so it is not clipped by the `overflow-hidden`
 * here. The title and description want their own `grid gap-1` wrapper inside
 * this row -- see `Toaster` for the shape.
 */
const Content = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Content
    ref={ref}
    className={cn(
      "flex h-full items-center gap-4 overflow-hidden px-4 py-3 pr-8 transition-opacity duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100",
      className
    )}
    {...props}
  />
))

const Action = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-gray-300 hover:group-[.destructive]:border-primary-700 hover:group-[.destructive]:bg-primary-800 hover:group-[.destructive]:text-white focus:group-[.destructive]:ring-primary-700",
      className
    )}
    {...props}
  />
))

/*
 * `disabled:` survives here where it would not on most Base UI parts: Close and
 * Action render a real <button> (`nativeButton` defaults to true), so the native
 * disabled attribute is set and the variant still matches.
 *
 * The stray `toast-close=""` attribute Radix's shadcn template put on this
 * button is gone. It was never referenced by a selector in this codebase.
 */
const Close = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, children, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-hidden focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 hover:group-[.destructive]:text-red-50 focus:group-[.destructive]:ring-red-400 focus:group-[.destructive]:ring-offset-red-600",
      className
    )}
    {...props}
  >
    {children ?? <CloseIcon className="h-4 w-4" />}
  </ToastPrimitive.Close>
))

/*
 * Title and Description read `toast.title` / `toast.description` off the record
 * when they are given no children, and return `null` when neither is present --
 * so `<Toaster/>` can render both unconditionally without leaving an empty row
 * in the `grid gap-1`.
 */
const Title = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))

const Description = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))

Viewport.displayName = "Toast.Viewport"
Root.displayName = "Toast.Root"
Content.displayName = "Toast.Content"
Action.displayName = "Toast.Action"
Close.displayName = "Toast.Close"
Title.displayName = "Toast.Title"
Description.displayName = "Toast.Description"

export {
  type Variant,
  Provider,
  Portal,
  Viewport,
  Root,
  Content,
  Title,
  Description,
  Close,
  Action,
  useToastManager,
  createToastManager,
}
