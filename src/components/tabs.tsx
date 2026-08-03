import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"

import { cn } from "../lib/utils"

const Root = TabsPrimitive.Root

/*
 * `indicator` opts the list into the sliding highlight. It is a prop rather than
 * something you compose by hand because two things have to happen together and
 * getting only one of them is worse than getting neither:
 *
 *   1. `relative isolate`. The Indicator sits at a negative z-index so it paints
 *      under the tab labels. Negative z-index children escape to the nearest
 *      ancestor *stacking context*, and a plain List is not one -- without
 *      `isolate` the pill would slide behind the list's own bg-gray-200 and be
 *      invisible. `relative` is what `--active-tab-left` is measured against.
 *   2. Neutralising the active tab's own background. Tab paints
 *      `data-active:bg-background` for the non-animated case; leaving it on would
 *      draw a second, identical pill that snaps to the new tab instantly while
 *      the real one is still travelling, which reads as no animation at all.
 *      The override is written as a descendant selector so it beats
 *      `data-active:bg-background` on specificity (0,3,0 vs 0,2,0) rather than
 *      on source order, which Tailwind's class sorting does not guarantee.
 */
const List = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    indicator?: boolean
  }
>(({ className, indicator, children, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-11 items-center justify-center rounded-full bg-gray-200 p-1 text-gray-500",
      indicator && "relative isolate [&_[role=tab][data-active]]:bg-transparent",
      className
    )}
    {...props}
  >
    {children}
    {indicator ? <Indicator /> : null}
  </TabsPrimitive.List>
))

/*
 * The travelling pill. Base UI measures the active tab and publishes
 * `--active-tab-left/top/width/height` on this element; everything below is a
 * plain CSS transition over those values.
 *
 * The offsets are `translate-*` rather than `left`/`top` on purpose: Tailwind v4
 * compiles translate utilities to the standalone `translate` property, so
 * `transition-[translate,width]` animates the slide on the compositor and the
 * two axes compose without a `transform` string to fight over.
 *
 * Exported for hand composition too, but then the two points in the `List`
 * comment above are the caller's problem.
 */
const Indicator = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Indicator
    ref={ref}
    className={cn(
      "absolute left-0 top-0 -z-10 h-[var(--active-tab-height)] w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)] translate-y-[var(--active-tab-top)] rounded-full bg-background transition-[translate,width] duration-200 ease-out",
      className
    )}
    {...props}
  />
))

const Tab = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Tab>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Tab>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Tab
    ref={ref}
    className={cn(
      "inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold ring-offset-background transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-disabled:pointer-events-none data-disabled:opacity-50 data-active:bg-background data-active:text-foreground",
      className
    )}
    {...props}
  />
))


const Panel = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Panel>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Panel>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Panel
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))


Root.displayName = "Tabs.Root"
List.displayName = "Tabs.List"
Indicator.displayName = "Tabs.Indicator"
Tab.displayName = "Tabs.Tab"
Panel.displayName = "Tabs.Panel"

export { Root, List, Indicator, Tab, Panel }
