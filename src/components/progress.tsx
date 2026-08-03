"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "../lib/utils"
import { useCountUp, useInView } from "../lib/hooks"

/*
 * Base UI splits the bar into Root > Track > Indicator. We keep the Root and
 * Track, but paint the animated fill ourselves: the primitive Indicator derives
 * its width from Root's value, which would couple the visual animation to the
 * value exposed through `aria-valuenow`.
 *
 * The bar still animates from zero when it scrolls into view, with the
 * percentage counting up alongside it.
 *
 * Two separate numbers deliberately travel through this component:
 *
 *   `value` -- the real controlled value, passed to ProgressPrimitive.Root
 *   untouched. Base UI turns it into `aria-valuenow`; `null` remains its real
 *   indeterminate signal. The semantic value must never be animated, otherwise
 *   SSR and the first client paint announce indeterminate/0 for a determinate
 *   progress bar.
 *
 *   `paintedValue` -- local state used only for the fill width and label colour.
 *   It starts at 0 and becomes `value` once the bar is in view, so sighted users
 *   retain the scroll-in animation without changing the accessibility tree.
 *   Null stays null and leaves the fill width unset, preserving Base UI's
 *   full-width indeterminate presentation.
 *
 * The counter div has no visible label when the bar is out of view and resets
 * to 0 every time it leaves -- that is the `useInView(counterRef, { once: true })`
 * below. Without `once`, the bar would visibly reset every time it left the
 * viewport.
 */
const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>, "value"> & { value?: number | null }
>(({ className, value, ...props }, ref) => {
  const [paintedValue, setPaintedValue] = React.useState<number | null>(value == null ? null : 0);
  const counterRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(counterRef, { once: true });

  const {start, reset} = useCountUp({
    ref: counterRef,
    start: 0,
    end: value ?? 0,
    duration: 2,
    suffix: '%'
  });

  React.useEffect(() => {
    if (isInView) {
      setPaintedValue(value ?? null);
      start();
    } else {
      setPaintedValue(value == null ? null : 0);
      reset();
    }
  }, [isInView, value, start, reset]);

  return (
      <ProgressPrimitive.Root
        ref={ref}
        value={value ?? null}
        className={cn("relative h-6 w-full", className)}
        {...props}
      >
        <ProgressPrimitive.Track className="relative h-full w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-primary transition-all ease-in-out flex items-center"
            data-slot="progress-indicator"
            style={{
              width: paintedValue === null ? undefined : `${paintedValue}%`,
              transitionDuration: '1.5s',
            }}
          >
            <div className={`ml-auto text-sm px-2 transition-all ${((paintedValue ?? 0) < 50) ? 'translate-x-full text-black' : 'text-white translate-x-0'}`} ref={counterRef}></div>
          </div>
        </ProgressPrimitive.Track>
      </ProgressPrimitive.Root>
  )
})
Progress.displayName = "Progress"

export { Progress }
