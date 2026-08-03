/*
 * No "use client" here. See the note on the directive policy in src/index.ts:
 * `export * as Accordion` builds its namespace object in this module, and a namespace
 * object built inside a "use client" module reaches a server component as one
 * opaque client reference with no keys. Nothing below calls a hook, so nothing
 * below needs the boundary -- the Base UI parts each carry their own.
 */
import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDownIcon } from "./icons"

import { cn } from "../lib/utils"

/*
 * Base UI's accordion, adopted as-is rather than wrapped back into the Radix
 * shape. Every difference below is a breaking change for v3:
 *
 *   type="single" | "multiple"  ->  multiple?: boolean, default false.
 *
 *   value / defaultValue        ->  always an array, in *both* modes. Single mode
 *                                   holds an array of length 0 or 1, so it is
 *                                   `defaultValue={["item-1"]}`, never
 *                                   `defaultValue="item-1"`, and `onValueChange`
 *                                   hands back `string[]` rather than `string`.
 *                                   Passing a bare string silently opens nothing:
 *                                   Base UI compares `value[0]` to the item value,
 *                                   and `"item-1"[0]` is `"i"`.
 *
 *   collapsible                 ->  gone, and effectively always on. Radix's
 *                                   single mode refused to close the last open
 *                                   item unless you opted in; Base UI's toggles it
 *                                   shut unconditionally. There is no way back to
 *                                   the old behaviour short of controlling `value`.
 *
 *   Content                     ->  Panel.
 *
 *   Trigger                     ->  Header + Trigger, composed at the call site
 *                                   like every other part in this library since
 *                                   5.5. The DOM is unchanged: the old Trigger
 *                                   rendered its own <Header> internally, so
 *                                   <Header><Trigger/></Header> emits the same
 *                                   <h3 class="flex"><button/></h3>.
 */

const Root = AccordionPrimitive.Root

const Item = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("rounded-2xl border border-b-4", className)}
    {...props}
  />
))

const Header = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Header>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Header>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Header ref={ref} className={cn("flex", className)} {...props} />
))

/*
 * The chevron rotation hangs off `data-panel-open`, not `data-open`. Base UI maps
 * the open state to a different attribute on a *trigger* than on the parts it
 * controls -- Item, Header and Panel all get `data-open` / `data-closed`, the
 * Trigger gets `data-panel-open` and nothing else. `data-open:` on a trigger is
 * syntactically fine and never matches, so this fails silently.
 */
const Trigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & { hideChevron?: boolean }
>(({ className, hideChevron = false, children, ...props }, ref) => (
  <AccordionPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex flex-1 items-center justify-between text-lg font-roboto-slab tacking-wide font-medium py-4 px-6 transition-all hover:underline [&>svg]:text-primary [&[data-panel-open]>svg]:rotate-180",
      className
    )}
    {...props}
  >
    {children}
    {!hideChevron && <ChevronDownIcon className="h-4 w-4 shrink-0 transition-transform duration-200" />}
  </AccordionPrimitive.Trigger>
))

/*
 * The height animation is now entirely declarative. Base UI publishes the panel's
 * measured size as `--accordion-panel-height` while a transition is in flight and
 * sets it back to the literal `auto` once the panel has settled open, so
 * `h-[var(--accordion-panel-height)]` is a real pixel height exactly while it needs
 * to be one and `height: auto` the rest of the time. `data-starting-style` and
 * `data-ending-style` supply the 0 ends of the transition.
 *
 * That replaces three things that all went together:
 *   - the `@keyframes accordion-down` / `accordion-up` pair and their
 *     `--animate-accordion-*` @theme entries in css/style.css, which existed only
 *     to interpolate `--radix-accordion-content-height`;
 *   - the `data-[state=open]:animate-accordion-down` / `-up` classes;
 *   - the `onAnimationStart` / `onAnimationEnd` handlers that flipped
 *     `style.overflow` between hidden and visible around each keyframe run.
 *
 * Overflow is now simply always hidden. The handlers restored `visible` after an
 * open so that inline-rendered popups could escape the panel; Base UI portals
 * popups by default, so the case they covered is much rarer than it was, and a
 * permanently clipping panel is what every other collapsible in the library does.
 *
 * `data-closed` is deliberately not used for the exit: it does exist on the panel,
 * but only during the closing transition, because a settled-closed panel is not in
 * the DOM at all. `data-ending-style` is the attribute that spans the whole exit.
 */
const Panel = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Panel>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Panel>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Panel
    ref={ref}
    className="px-6 overflow-hidden h-[var(--accordion-panel-height)] transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Panel>
))

Item.displayName = "Accordion.Item"
Header.displayName = "Accordion.Header"
Trigger.displayName = "Accordion.Trigger"
Panel.displayName = "Accordion.Panel"

export { Root, Item, Header, Trigger, Panel }
