import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "../lib/utils"

/*
 * Radix's single `Content` is three parts in Base UI:
 *
 *   Portal      escapes overflow-hidden ancestors
 *   Positioner  anchors against the trigger -- owns side/align/sideOffset
 *   Popup       the styled box
 *
 * `sideOffset` therefore moves off the styled element and onto the Positioner,
 * whose Base UI default is 0 where Radix's Content defaulted to 4. The wrapper
 * below restores 4 so the popup sits where it always has.
 *
 * `positionMethod` defaults to "fixed" for the same reason: Radix's Popper hard
 * coded `strategy: "fixed"`, and Base UI defaults to "absolute". The coordinates
 * come out the same, but a fixed element is composited, which switches Chrome
 * from subpixel to greyscale text antialiasing -- a visible, if subtle, change to
 * every tooltip label. Fixed also keeps the popup out of the way of ancestors
 * that clip or transform.
 */

const Provider = TooltipPrimitive.Provider
const Root = TooltipPrimitive.Root
const Trigger = TooltipPrimitive.Trigger
const Portal = TooltipPrimitive.Portal

const Positioner = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Positioner>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Positioner>
>(({ className, sideOffset = 4, positionMethod = "fixed", ...props }, ref) => (
  <TooltipPrimitive.Positioner
    ref={ref}
    sideOffset={sideOffset}
    positionMethod={positionMethod}
    className={cn("z-50", className)}
    {...props}
  />
))

/*
 * The `animate-in fade-in-0 zoom-in-95 slide-in-from-*` classes that used to be
 * here emitted nothing: tailwindcss-animate was listed as a dependency but never
 * registered as a plugin, and there is no tailwind.config to register it in. The
 * tooltip has had no open animation for as long as this file has existed. These
 * two Base UI transition hooks are the real thing, in plain Tailwind.
 */
const Popup = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Popup>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Popup
    ref={ref}
    className={cn(
      "overflow-hidden rounded-xl font-normal border bg-gray-100 px-3 py-1.5 text-sm shadow-md transition-[opacity,scale] data-starting-style:opacity-0 data-starting-style:scale-95 data-ending-style:opacity-0 data-ending-style:scale-95",
      className
    )}
    {...props}
  />
))

Positioner.displayName = "Tooltip.Positioner"
Popup.displayName = "Tooltip.Popup"

export { Provider, Root, Trigger, Portal, Positioner, Popup }
