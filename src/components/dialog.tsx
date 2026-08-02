import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { CloseIcon } from "./icons"
import { Button } from "./button"

import { cn } from "../lib/utils"

/*
 * Radix's `Overlay` is Base UI's `Backdrop` and its `Content` is `Popup`. There
 * is no Positioner in the dialog family -- a modal is not anchored to anything --
 * so the popup keeps positioning itself with the same `fixed` + 50%/-50% classes
 * it always had, and none of the `positionMethod` antialiasing trouble from the
 * tooltip/menu phase applies.
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

/*
 * Radix's FocusScope focused the first tabbable element in the dialog *and
 * selected its contents* when that element was a text input
 * (`focus(el, { select: true })`). Base UI focuses the same element but never
 * selects, which is a visible difference for the common "here is a link, copy
 * it" dialog. The first focus event to reach the popup after it mounts is the
 * one Base UI moved there itself, so selecting on that one and no other
 * reproduces the old behaviour without hijacking later clicks.
 */
const isSelectableInput = (
  element: EventTarget | null
): element is HTMLInputElement =>
  element instanceof HTMLInputElement && "select" in element

const Popup = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Popup>
>(({ className, children, onFocus, ...props }, ref) => {
  const pendingInitialFocus = React.useRef(true)

  return (
    <DialogPrimitive.Popup
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 transition-[opacity,scale] data-starting-style:opacity-0 data-starting-style:scale-95 data-ending-style:opacity-0 data-ending-style:scale-95 sm:rounded-2xl",
        className
      )}
      onFocus={(event) => {
        if (pendingInitialFocus.current) {
          pendingInitialFocus.current = false
          if (isSelectableInput(event.target)) {
            event.target.select()
          }
        }
        onFocus?.(event)
      }}
      {...props}
    >
      {children}
      <Close
        className="absolute right-3 aspect-square top-3 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        render={<Button variant="outline-secondary" size="sm-icon" />}
      >
        <CloseIcon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Close>
    </DialogPrimitive.Popup>
  )
})

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
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))

Backdrop.displayName = "Dialog.Backdrop"
Popup.displayName = "Dialog.Popup"
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
