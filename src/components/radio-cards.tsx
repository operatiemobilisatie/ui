import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cva } from "class-variance-authority"
import { radioVariants, radioIndicatorVariants } from "./radio-group"

import { cn } from "@/lib/utils"

const radioCardVariants = cva(
  "border border-input hover:border-gray-400 aria-checked:border-primary aria-checked:ring-2 aria-checked:ring-ring group rounded-2xl relative flex grow items-center duration-150 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "p-2",
        default: "p-3",
        lg: "p-4",
      },
      indicator: {
        false: "justify-center",
        true: "justify-start"
      }
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const RadioCards = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, orientation = "horizontal", ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("flex gap-2", className)}
      {...props}
      orientation={orientation}
      ref={ref}
    />
  )
})
RadioCards.displayName = 'RadioCards'

const RadioCardsItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & { size?: 'sm' | 'lg' | 'default', indicator?: boolean }
>(({ className, size, indicator = false, children, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(radioCardVariants({size, indicator, className}))}
      {...props}
    >
      <>
        {indicator && (
          <div className={radioVariants({size, className: 'mr-2 group-aria-checked:bg-primary-200'})}>
            <div className={cn(radioIndicatorVariants({size, className: 'bg-white'}))}></div>
            <div className={cn(radioIndicatorVariants({size, className: 'transition-transform bg-primary scale-0 group-aria-checked:scale-100'}))}></div>
          </div>
        )}
        {children}
      </>
    </RadioGroupPrimitive.Item>
  )
})
RadioCardsItem.displayName = 'RadioCardsItem'

export { RadioCards, RadioCardsItem }
