"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "../lib/utils"
import { useCountUp, useInView } from "../lib/hooks"

/*
 * Base UI splits the bar into Root > Track > Indicator, and the Indicator sizes
 * itself from the Root's `value` (it sets width: N%). That replaces the old
 * translateX(-(100 - value)%) trick on a full-width indicator: same geometry,
 * but the width is now derived rather than hand-computed.
 *
 * The bar still animates from zero when it scrolls into view, with the
 * percentage counting up alongside it.
 *
 * Two separate numbers travel through this component:
 *
 *   `value` -- the controlled prop, passed to ProgressPrimitive.Root untouched
 *   (Base UI turns it into `aria-valuenow` and the Indicator's width). A `null`
 *   value is Base UI's real indeterminate signal: it renders the track without
 *   a width and without a numeric aria-valuenow. That only works if the root
 *   receives `null` itself, which is why the tracked state below is a
 *   `number | null` rather than a `value || 0` default -- collapsing null to 0
 *   made indeterminate mode unreachable.
 *
 *   `progress` -- local state tracking what the Root reports back. It starts at
 *   0 and becomes `value` (or null, for indeterminate) once the bar is in view;
 *   it is what the count-up counter and the label colour read, so the number
 *   travels with the width.
 *
 * The counter div has no visible label when the bar is out of view and resets
 * to 0 every time it leaves -- that is the `useInView(counterRef, { once: true })`
 * below. Without `once`, a screen reader would hear `aria-valuenow="0"` every
 * time the bar scrolled out of view and back, and the bar would visibly reset.
 */
const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>, "value"> & { value?: number | null }
>(({ className, value, ...props }, ref) => {
  const [progress, setProgress] = React.useState<number | null>(null);
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
      setProgress(value ?? null);
      start();
    } else {
      setProgress(0);
      reset();
    }
  }, [isInView, value, start, reset]);

  const percentage = progress ?? 0;

  return (
      <ProgressPrimitive.Root
        ref={ref}
        value={progress}
        className={cn("relative h-6 w-full", className)}
        {...props}
      >
        <ProgressPrimitive.Track className="relative h-full w-full overflow-hidden rounded-full bg-gray-200">
          <ProgressPrimitive.Indicator
            className="h-full bg-primary transition-all ease-in-out flex items-center"
            style={{ transitionDuration: '1.5s' }}
          >
            <div className={`ml-auto text-sm px-2 transition-all ${(percentage < 50) ? 'translate-x-full text-black' : 'text-white translate-x-0'}`} ref={counterRef}></div>
          </ProgressPrimitive.Indicator>
        </ProgressPrimitive.Track>
      </ProgressPrimitive.Root>
  )
})
Progress.displayName = "Progress"

export { Progress }
