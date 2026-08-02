'use client'

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

const Viewport = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-100 flex max-h-screen w-full flex-col-reverse p-6 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-105",
      className
    )}
    {...props}
  />
))

/*
 * Seven classes are gone from the base string here:
 *
 *   data-[state=open]:animate-in            data-[state=closed]:animate-out
 *   data-[swipe=end]:animate-out            data-[state=closed]:fade-out-80
 *   data-[state=closed]:slide-out-to-right-full
 *   data-[state=open]:slide-in-from-top-full
 *   data-[state=open]:sm:slide-in-from-bottom-full
 *
 * None of them ever emitted anything. tailwindcss-animate was a dependency but
 * was never registered as a plugin and there is no tailwind.config to register
 * it in, so the toast has had no enter or exit animation for as long as this
 * file has existed. They are replaced with real transitions driven by Base UI's
 * `data-starting-style` / `data-ending-style`, keeping the direction the dead
 * classes described: in from the top on narrow screens, in from the bottom once
 * the viewport flips to the bottom-right corner at `sm`, out to the right.
 *
 * The swipe classes are gone for a different reason -- they are now redundant
 * rather than dead. Radix published `--radix-toast-swipe-move-x` and left you to
 * apply the translate; Base UI writes the in-flight transform inline on the root
 * and pins `transition: none` while a pointer is down, so
 * `data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x)` and
 * `data-[swipe=move]:transition-none` have nothing left to do. The equivalent
 * variable is `--toast-swipe-movement-x` (and `-y`), still published on the root
 * and still there if a consumer wants to fade or rotate with the drag.
 */
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-2xl border px-4 py-3 pr-8 shadow-lg transition-[opacity,transform] duration-200 ease-out data-starting-style:opacity-0 data-starting-style:-translate-y-full sm:data-starting-style:translate-y-full data-ending-style:opacity-0 data-ending-style:translate-x-full data-swiping:transition-none",
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
 * New part with no Radix counterpart. It emits the same <div> the old markup
 * spelled out inline as `<div className="grid gap-1">`, and additionally keeps
 * the toast's measured height in sync via a ResizeObserver, which is what lets
 * the viewport stack more than one toast.
 */
const Content = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Content
    ref={ref}
    className={cn("grid gap-1", className)}
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
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 hover:group-[.destructive]:border-destructive/30 hover:group-[.destructive]:bg-destructive hover:group-[.destructive]:text-destructive-foreground focus:group-[.destructive]:ring-destructive",
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
