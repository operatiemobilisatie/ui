import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "./icons"

import { cn } from "../lib/utils"

/*
 * Base UI's Menu replaces Radix's DropdownMenu. Three structural changes:
 *
 *   Content        -> Portal > Positioner > Popup, with sideOffset and
 *                     positionMethod on the Positioner. Base UI defaults those to
 *                     0 and "absolute"; Radix's Popper used 4 and a hard coded
 *                     "fixed", so the wrapper below restores both.
 *   Sub/SubTrigger -> SubmenuRoot/SubmenuTrigger, and a submenu reuses the same
 *                     Popup rather than a separate SubContent part
 *   Label          -> GroupLabel, which must live inside a Group or RadioGroup;
 *                     it wires aria-labelledby onto that group and throws
 *                     outside one.
 *
 * And one behavioural change that is invisible in the API: Radix moves DOM focus
 * onto the active item, Base UI keeps focus on the popup and marks the active
 * item with `data-highlighted`. Every `focus:` variant on an item therefore has
 * to become `data-highlighted:` or it silently stops matching.
 */

const Root = MenuPrimitive.Root
const Trigger = MenuPrimitive.Trigger
const Portal = MenuPrimitive.Portal
const Group = MenuPrimitive.Group
const RadioGroup = MenuPrimitive.RadioGroup
const SubmenuRoot = MenuPrimitive.SubmenuRoot

const itemVariants =
  "relative flex cursor-default select-none items-center px-3 py-1.5 text-sm outline-hidden transition-colors data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50"

const indicatorItemVariants =
  "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-hidden transition-colors data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50"

const Positioner = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.Positioner>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Positioner>
>(({ className, sideOffset = 4, positionMethod = "fixed", ...props }, ref) => (
  <MenuPrimitive.Positioner
    ref={ref}
    sideOffset={sideOffset}
    positionMethod={positionMethod}
    className={cn("z-50", className)}
    {...props}
  />
))

/*
 * The `animate-in`/`animate-out`/`zoom-*`/`slide-in-from-*` classes previously on
 * both Content and SubContent emitted nothing -- tailwindcss-animate was never
 * registered as a plugin -- so the menu has never had an open animation. Replaced
 * with Base UI's starting/ending style hooks, which are plain CSS transitions.
 */
const Popup = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Popup>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Popup
    ref={ref}
    className={cn(
      "min-w-32 overflow-hidden rounded-2xl border border-input bg-popover text-popover-foreground shadow-md outline-hidden transition-[opacity,scale] data-starting-style:opacity-0 data-starting-style:scale-95 data-ending-style:opacity-0 data-ending-style:scale-95",
      className
    )}
    {...props}
  />
))

const SubmenuTrigger = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.SubmenuTrigger>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubmenuTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenuPrimitive.SubmenuTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden data-highlighted:bg-accent data-popup-open:bg-accent",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRightIcon className="ml-auto h-4 w-4" />
  </MenuPrimitive.SubmenuTrigger>
))

const Item = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenuPrimitive.Item
    ref={ref}
    className={cn(itemVariants, inset && "pl-8", className)}
    {...props}
  />
))

const CheckboxItem = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <MenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(indicatorItemVariants, className)}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenuPrimitive.CheckboxItemIndicator>
        <CheckIcon className="h-4 w-4" />
      </MenuPrimitive.CheckboxItemIndicator>
    </span>
    {children}
  </MenuPrimitive.CheckboxItem>
))

const RadioItem = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenuPrimitive.RadioItem
    ref={ref}
    className={cn(indicatorItemVariants, className)}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenuPrimitive.RadioItemIndicator>
        <CircleIcon className="h-2 w-2" />
      </MenuPrimitive.RadioItemIndicator>
    </span>
    {children}
  </MenuPrimitive.RadioItem>
))

const GroupLabel = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.GroupLabel> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenuPrimitive.GroupLabel
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
))

const Separator = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))

// No Base UI equivalent -- a plain styled span, as before.
const Shortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
    {...props}
  />
)

Positioner.displayName = "DropdownMenu.Positioner"
Popup.displayName = "DropdownMenu.Popup"
SubmenuTrigger.displayName = "DropdownMenu.SubmenuTrigger"
Item.displayName = "DropdownMenu.Item"
CheckboxItem.displayName = "DropdownMenu.CheckboxItem"
RadioItem.displayName = "DropdownMenu.RadioItem"
GroupLabel.displayName = "DropdownMenu.GroupLabel"
Separator.displayName = "DropdownMenu.Separator"
Shortcut.displayName = "DropdownMenu.Shortcut"

export {
  Root,
  Trigger,
  Portal,
  Positioner,
  Popup,
  Group,
  GroupLabel,
  Item,
  CheckboxItem,
  RadioGroup,
  RadioItem,
  Separator,
  Shortcut,
  SubmenuRoot,
  SubmenuTrigger,
}
