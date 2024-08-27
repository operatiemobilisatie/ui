import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { cn } from "../lib/utils"
import { cva } from "class-variance-authority"

const checkboxVariants = cva(
  "peer h-4 w-4 aspect-square relative shrink-0 border-4 border-gray-200 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary",
  {
    variants: {
      size: {
        sm: "h-4 w-4 rounded-sm border-[3px]",
        default: "h-5 w-5 border-[3px] rounded-sm",
        lg: "h-6 w-6 rounded-md",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {displaySize?: 'sm' | 'lg' | 'default'}
>(({ className, displaySize, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants({size: displaySize, className}))}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-white")}
    >
      <FontAwesomeIcon icon={faCheck} className="h-full" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
