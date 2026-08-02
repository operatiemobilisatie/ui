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
 */
const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>, "value"> & { value?: number | null }
>(({ className, value, ...props }, ref) => {
  const [progress, setProgress] = React.useState(0);
  const counterRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(counterRef);

  const {start, reset} = useCountUp({
    ref: counterRef,
    start: 0,
    end: value || 0,
    duration: 2,
    suffix: '%'
  });

  React.useEffect(() => {
    if (isInView) {
      setProgress(value || 0);
      start();
    } else {
      setProgress(0);
      reset();
    }
  }, [isInView]);

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
            <div className={`ml-auto text-sm px-2 transition-all ${(progress < 50) ? 'translate-x-full text-black' : 'text-white translate-x-0'}`} ref={counterRef}></div>
          </ProgressPrimitive.Indicator>
        </ProgressPrimitive.Track>
      </ProgressPrimitive.Root>
  )
})
Progress.displayName = "Progress"

export { Progress }
