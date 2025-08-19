'use client'

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("rounded-2xl border border-b-4 shadow-xs", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & { hideChevron?: boolean }
>(({ className, hideChevron = false, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between text-lg font-roboto tacking-wide font-medium py-4 px-6 transition-all hover:underline [&>svg]:text-primary [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      {!hideChevron && <FontAwesomeIcon icon={faChevronDown} className="h-4 w-4 shrink-0 transition-transform duration-200" />}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    onAnimationEnd={(e) => {
      if(e.currentTarget.dataset.state === "open") {
        e.currentTarget.style.overflow = "visible"
      }
    }}
    onAnimationStart={(e) => e.currentTarget.style.overflow = "hidden"}
    style={{overflow: 'hidden'}}
    className="px-6 transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down data-[state=closed]:overflow-hidden data-[state=open]:overflow-visible
            data-[motion=from-start]:overflow-hidden
            data-[motion=to-end]:overflow-hidden"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
