'use client'

import * as React from "react"
import { Slider as SliderPrimitive, type SliderRootProps } from "@base-ui/react/slider"

import { cn } from "../lib/utils"

/*
 * Base UI's slider, decomposed the way every other component has been since 5.5.
 * The plan never wrote this one up, so for the record:
 *
 *   Root                      ->  Root + Control. Radix's Root was both the
 *                                 wrapper *and* the interactive surface the
 *                                 thumbs were positioned inside. Base UI splits
 *                                 those: Root is a plain <div role="group"> and
 *                                 Control is what handles pointers and what the
 *                                 thumb's `position: absolute` resolves against.
 *                                 That split is why the padding stays on Root
 *                                 and `relative` moves onto Control -- Control
 *                                 sets no position of its own, so without it the
 *                                 thumb would centre on Root's 40px padding box
 *                                 instead of the 8px track and sit 8px low.
 *   Range                     ->  Indicator.
 *   Thumb asChild             ->  Thumb, which is already a <div> (plus a
 *                                 visually hidden <input type="range"> inside
 *                                 it), so the wrapper element the asChild was
 *                                 there to supply is now the part itself.
 *   -                         ->  Value, an <output> carrying the live value.
 *
 * The last one fixes a real bug. The old component printed `props.defaultValue`
 * under the thumb, so the number was frozen at whatever the slider started with
 * and never followed the handle. Value reads the current value out of context.
 */

/*
 * `thumbAlignment` defaults to "edge" rather than Base UI's "center" because
 * "edge" is what Radix did. Radix offset every thumb by
 * `getThumbInBoundsOffset()` so its outer edge stopped at the end of the track;
 * Base UI's default aligns the thumb's *centre* with the track end, which would
 * hang 10px of a 20px thumb off both ends of a design built around an 8px track.
 * At the midpoint the two are identical, which is why the one screenshot in the
 * suite cannot tell them apart -- this is a min/max-only difference and had to
 * be read off the geometry rather than the baseline.
 *
 * "edge" measures, so it emits a small prehydration script under SSR to place
 * the thumb before React takes over. Pass thumbAlignment="edge-client-only" to
 * drop the script and position after hydration instead, or "center" for Base
 * UI's unmeasured default.
 *
 * `aria-disabled:opacity-50` is now `data-disabled:opacity-50`. Base UI never
 * sets a native disabled attribute on non-<button> parts, and it exposes the
 * disabled state as data-disabled; the aria- variant would stay valid Tailwind
 * and quietly never match.
 */
function Root<Value extends number | readonly number[]>({
  className,
  thumbAlignment = "edge",
  ...props
}: SliderRootProps<Value> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <SliderPrimitive.Root
      thumbAlignment={thumbAlignment}
      className={cn("relative w-full pb-6 pt-2 group data-disabled:opacity-50", className)}
      {...props}
    />
  )
}

const Control = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Control>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Control>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Control
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  />
))

const Track = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Track>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Track>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Track
    ref={ref}
    className={cn("relative h-2 w-full grow overflow-hidden rounded-full bg-secondary", className)}
    {...props}
  />
))

/*
 * `absolute h-full` is gone from what used to be the Range. Base UI writes
 * `position: relative`, `height: inherit` and a percentage `width` inline on the
 * indicator, and an inline style beats a utility class, so those two classes
 * would be silently overridden rather than doing anything. The painted box is
 * the same either way: full track height, from the start edge to the value.
 */
const Indicator = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Indicator ref={ref} className={cn("bg-primary", className)} {...props} />
))

/*
 * The focus ring hangs off `has-[:focus-visible]` rather than `focus-visible`.
 * Under Radix the thumb element itself carried tabindex and took focus, so
 * `focus-visible:ring-2` matched it. Base UI's thumb is a presentational <div>
 * wrapping a visually hidden <input type="range">, and the input is what
 * focuses -- `focus-visible:` on the thumb stays valid Tailwind and never
 * matches again, which loses the ring silently.
 *
 * The three `disabled:` classes that were here (`pointer-events-none`,
 * `opacity-50`, `bg-green`) are gone rather than translated. They never applied:
 * asChild made this a <div>, and a <div> is never :disabled. Root's
 * `data-disabled:opacity-50` is what actually dims a disabled slider, and it
 * always was.
 */
const Thumb = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Thumb>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Thumb>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Thumb
    ref={ref}
    className={cn(
      "flex justify-center h-5 w-5 cursor-grab rounded-full border-[5px] border-primary-200 bg-primary ring-offset-background has-[:focus-visible]:outline-hidden has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2",
      className
    )}
    {...props}
  />
))

/*
 * Styled for the position it is designed to occupy -- inside `Thumb`, hanging
 * below it -- which is where the old hard-coded label sat. `self-center` and the
 * `translate-y-5` only mean anything against the thumb's flex box; put a Value
 * anywhere else and it wants its own className.
 *
 * Renders an <output>, but it is a flex item here, so it is blockified and
 * boxes exactly like the <div> it replaces.
 */
const Value = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Value>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Value>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Value
    ref={ref}
    className={cn("text-center translate-y-5 text-sm font-semibold self-center w-min", className)}
    {...props}
  />
))

Control.displayName = "Slider.Control"
Track.displayName = "Slider.Track"
Indicator.displayName = "Slider.Indicator"
Thumb.displayName = "Slider.Thumb"
Value.displayName = "Slider.Value"

export { Root, Control, Track, Indicator, Thumb, Value }
