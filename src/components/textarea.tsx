import * as React from "react"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    displaySize?: 'sm' | 'lg' | 'default'
  }

const inputVariants = cva(
  "peer flex w-full border border-input bg-background placeholder:text-muted-foreground duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed focus:border-primary disabled:opacity-50 hover:border-gray-300",
  {
    variants: {
      size: {
        default: "min-h-10 px-3.5 py-2 rounded-xl",
        sm: "min-h-[34px] px-3 rounded-xl",
        lg: "min-h-11 px-4 rounded-2xl"
      }
    },
    defaultVariants: {
      size: "default"
    },
  }
)

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, displaySize, ...props }, ref) => {
    return (
      <textarea
        className={cn(inputVariants({size: displaySize, className}))}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
