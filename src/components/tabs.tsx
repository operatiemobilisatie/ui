import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"

import { cn } from "../lib/utils"

const Root = TabsPrimitive.Root

const List = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-11 items-center justify-center rounded-full bg-gray-200 p-1 text-muted-foreground",
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
      "inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold ring-offset-background transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-disabled:pointer-events-none data-disabled:opacity-50 data-active:bg-background data-active:text-foreground",
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
Tab.displayName = "Tabs.Tab"
Panel.displayName = "Tabs.Panel"

export { Root, List, Tab, Panel }
