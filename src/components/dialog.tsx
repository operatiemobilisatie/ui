import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { Popup } from "../internal/dialog-popup"

import { cn } from "../lib/utils"

/*
 * No "use client" here, on purpose. `export * as Dialog` in the root barrel
 * makes rolldown build the namespace object inside this module, and a namespace
 * object built inside a "use client" module reaches a server component as a
 * single opaque client reference -- `Object.keys(UI.Dialog)` comes back empty
 * and every part is `undefined`. Everything below is either a re-export of a
 * Base UI part (each of which carries its own directive) or a plain styled
 * wrapper with no hooks, so this module evaluates fine on the server. The one
 * part that does call a hook, `Popup`, lives in ../internal/dialog-popup and
 * crosses the boundary on its own.
 *
 * Radix's `Overlay` is Base UI's `Backdrop` and its `Content` is `Popup`. There
 * is no Positioner in the dialog family -- a modal is not anchored to anything --
 * so the popup keeps positioning itself with the same `fixed` + 50%/-50% classes
 * it always had, and none of the `positionMethod` antialiasing trouble from the
 * tooltip and menu positioning does not apply.
 *
 * Portal and Backdrop are separate parts here rather than being baked into the
 * popup the way `DialogContent` used to bake them in, matching how Base UI
 * composes everything else. The close button stays inside `Popup`, because it is
 * part of this library's dialog design rather than a Base UI concern.
 */

const Root = DialogPrimitive.Root
const Trigger = DialogPrimitive.Trigger
const Portal = DialogPrimitive.Portal
const Close = DialogPrimitive.Close

/*
 * The `data-[state=open]:animate-in data-[state=closed]:fade-out-0` pairs that
 * used to be on the overlay and the content emitted nothing: tailwindcss-animate
 * was a dependency but was never registered as a plugin, and there is no
 * tailwind.config to register it in, so the dialog has never had an open or
 * close animation. They are replaced here with Base UI's `data-starting-style` /
 * `data-ending-style` hooks driving plain CSS transitions.
 */
const Backdrop = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Backdrop>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Backdrop
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 transition-opacity duration-200 data-starting-style:opacity-0 data-ending-style:opacity-0",
      className
    )}
    {...props}
  />
))

const Header = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)

const Footer = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)

const Title = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))

const Description = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
))

Backdrop.displayName = "Dialog.Backdrop"
Header.displayName = "Dialog.Header"
Footer.displayName = "Dialog.Footer"
Title.displayName = "Dialog.Title"
Description.displayName = "Dialog.Description"

export {
  Root,
  Trigger,
  Portal,
  Close,
  Backdrop,
  Popup,
  Header,
  Footer,
  Title,
  Description,
}
