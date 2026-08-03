/*
 * No "use client" here. See the note on the directive policy in src/index.ts:
 * `export * as AlertDialog` builds its namespace object in this module, and a namespace
 * object built inside a "use client" module reaches a server component as one
 * opaque client reference with no keys. Nothing below calls a hook, so nothing
 * below needs the boundary -- the Base UI parts each carry their own.
 */
import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"

import { cn } from "../lib/utils"

/*
 * Same rename as the dialog -- `Overlay` -> `Backdrop`, `Content` -> `Popup` --
 * on top of Base UI's alert-dialog, which is the dialog with `role="alertdialog"`
 * and no dismissal on outside press or Escape.
 *
 * `Action` and `Cancel` are gone. Base UI's alert-dialog re-exports `Close` and
 * nothing else, so the two roles are now spelled out at the call site:
 *
 *   cancel   <AlertDialog.Close render={<Button variant="outline-secondary" />}>
 *   action   <Button onClick={...}>   -- plus whatever closes the dialog
 *
 * That is a real change in behaviour for the action button: Radix's
 * `AlertDialogAction` closed the dialog for you on click, so an action that now
 * has to close it needs either a controlled `open` or its own `AlertDialog.Close`
 * wrapper.
 */

const Root = AlertDialogPrimitive.Root
const Trigger = AlertDialogPrimitive.Trigger
const Portal = AlertDialogPrimitive.Portal
const Close = AlertDialogPrimitive.Close

/*
 * The `animate-in` / `fade-out-0` / `zoom-in-95` / `slide-in-from-*` classes that
 * were on the overlay and the content emitted nothing -- tailwindcss-animate was
 * never registered as a plugin -- so this dialog has never animated. Replaced
 * with Base UI's starting/ending style hooks over a plain CSS transition.
 */
const Backdrop = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Backdrop>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Backdrop
    className={cn(
      "fixed inset-0 z-50 bg-black/80 transition-opacity duration-200 data-starting-style:opacity-0 data-ending-style:opacity-0",
      className
    )}
    {...props}
    ref={ref}
  />
))

const Popup = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Popup>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Popup
    ref={ref}
    className={cn(
      "fixed sm:rounded-2xl left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 transition-[opacity,scale] data-starting-style:opacity-0 data-starting-style:scale-95 data-ending-style:opacity-0 data-ending-style:scale-95",
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
      "flex flex-col space-y-2 text-center sm:text-left",
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
  React.ComponentRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))

const Description = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
))

Backdrop.displayName = "AlertDialog.Backdrop"
Popup.displayName = "AlertDialog.Popup"
Header.displayName = "AlertDialog.Header"
Footer.displayName = "AlertDialog.Footer"
Title.displayName = "AlertDialog.Title"
Description.displayName = "AlertDialog.Description"

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
