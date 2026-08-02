import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { Radio } from "@base-ui/react/radio"
import { cva } from "class-variance-authority"

import { cn } from "../lib/utils"

const radioControlVariants = cva(
  "w-5 h-5 aspect-square bg-gray-200 aria-checked:bg-primary-200 group rounded-full relative flex items-center justify-center duration-300 data-disabled:cursor-not-allowed data-disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        default: "h-5 w-5",
        lg: "h-6 w-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const radioIndicatorVariants = cva(
  "inline-block absolute w-2.5 h-2.5 aspect-square rounded-full",
  {
    variants: {
      size: {
        sm: "h-2 w-2",
        default: "h-2.5 w-2.5",
        lg: "h-3 w-3",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

// Base UI's RadioGroup *is* the root -- there is no RadioGroup.Root.
const Root = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
Root.displayName = "RadioGroup.Root"

const Item = React.forwardRef<
  React.ComponentRef<typeof Radio.Root>,
  React.ComponentPropsWithoutRef<typeof Radio.Root> & { size?: 'sm' | 'lg' | 'default' }
>(({ className, size, ...props }, ref) => {
  return (
    <Radio.Root
      ref={ref}
      className={cn(radioControlVariants({size, className}))}
      {...props}
    >
        <div className={cn(radioIndicatorVariants({size, className: 'bg-white'}))}></div>
        <div className={cn(radioIndicatorVariants({size, className: 'transition-transform bg-primary scale-0 group-aria-checked:scale-100'}))}></div>
    </Radio.Root>
  )
})
Item.displayName = "RadioGroup.Item"

export { Root, Item, radioControlVariants, radioIndicatorVariants }
