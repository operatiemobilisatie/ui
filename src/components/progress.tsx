"use client"

import * as React from "react"
import ReactDOM from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "../lib/utils"
import { useCountUp } from "react-countup"
import { useInView } from "motion/react"

const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  const [progress, setProgress] = React.useState(0);
  const counterRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(counterRef);

  const {start, reset} = useCountUp({
    // react-countup types `ref` as RefObject<HTMLElement> with a non-nullable
    // `current`, which React 19 no longer produces. Phase 4 replaces
    // react-countup with a local hook and this cast goes with it.
    ref: counterRef as React.RefObject<HTMLElement>,
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
        className={cn(
          "relative h-6 w-full overflow-hidden rounded-full bg-gray-200",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className="h-full w-full flex-1 bg-primary transition-all ease-in-out flex items-center"
          style={{ transform: `translateX(-${100 - (progress)}%)`, transitionDuration: '1.5s' }}
        >
          <div className={`ml-auto text-sm px-2 transition-all ${(progress < 50) ? 'translate-x-full text-black' : 'text-white translate-x-0'}`} ref={counterRef}></div>
        </ProgressPrimitive.Indicator>
      </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
