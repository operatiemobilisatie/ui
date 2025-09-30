import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "cursor-pointer font-sans inline-flex items-center justify-center whitespace-nowrap uppercase rounded-full font-semibold ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white border border-primary shimmer",
        secondary: "bg-gray-200 text-secondary-foreground shimmer-invert",
        outline: "border border-primary bg-background text-primary hover:bg-primary hover:text-white",
        "outline-secondary": "border border-input bg-background hover:bg-input hover:text-accent-foreground",
        green: "bg-green text-white border border-green shimmer",
        blue: "bg-blue text-white border border-blue shimmer",
        orange: "bg-orange text-white border border-orange shimmer",
        aqua: "bg-aqua text-white border border-aqua shimmer",
        ghost: "hover:bg-primary-100 hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
        destructive: "bg-destructive-background text-destructive-foreground border-destructive-background hover:bg-primary-300 hover:border-primary-300",
      },
      size: {
        default: "h-10 px-5 text-base",
        sm: "h-[34px] px-4 text-sm",
        lg: "h-11 px-6 text-base",
        icon: "h-10 w-10 text-base aspect-square",
        'sm-icon': "h-[34px] w-[34px] aspect-square",
        'lg-icon': "h-11 w-11 aspect-square",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
