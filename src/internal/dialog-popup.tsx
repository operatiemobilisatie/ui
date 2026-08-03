'use client'

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { CloseIcon } from "../components/icons"
import { Button } from "../components/button"

import { cn } from "../lib/utils"

/*
 * `Dialog.Popup` lives here, on its own, for one reason: it is the only part of
 * the dialog that calls a hook (`React.useRef`, for the select-on-first-focus
 * behaviour below). A module that calls a hook needs "use client", and a module
 * with "use client" cannot be where `export * as Dialog` builds its namespace
 * object -- rolldown's unbundle output puts that object inside the client
 * module, so from a server component the whole namespace arrives as one opaque
 * client reference and every part reads back `undefined`.
 *
 * Keeping the directive on this file and off `dialog.tsx` is the same shape
 * Base UI itself ships: a directive-free barrel re-exporting parts that each
 * carry their own boundary. `dialog.tsx` stays evaluable on the server, and
 * only `Popup` crosses as a client reference.
 *
 * Deliberately not under `src/components/`: the entry glob in tsdown.config.ts
 * turns everything there into a public subpath, and this is an implementation
 * detail of `./dialog`, not a component in its own right.
 *
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
      <DialogPrimitive.Close
        className="absolute right-3 aspect-square top-3 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        render={<Button variant="outline-secondary" size="sm-icon" />}
      >
        <CloseIcon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Popup>
  )
})

Popup.displayName = "Dialog.Popup"

export { Popup }
