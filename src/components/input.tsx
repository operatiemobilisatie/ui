import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    displaySize?: 'sm' | 'lg' | 'default'
  }

const inputVariants = cva(
  "peer flex w-full border border-input bg-background file:mr-4 file:hover:border-primary-400 file:cursor-pointer file:border-border file:border file:border-solid file:bg-transparent file:rounded-2xl file:h-[34px] file:px-4 file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed focus:border-primary disabled:opacity-50 hover:border-gray-300",
  {
    variants: {
      size: {
        default: "h-10 px-3.5 py-2 rounded-xl",
        sm: "h-[34px] px-3 rounded-xl",
        lg: "h-11 px-4 rounded-2xl"
      }
    },
    defaultVariants: {
      size: "default"
    },
  }
)

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, displaySize, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ size: displaySize, className: `${type === 'file' ? 'border-dashed cursor-pointer rounded-2xl h-auto py-4' : ''} ${className}` }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }