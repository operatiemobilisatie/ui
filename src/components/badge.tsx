import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border py-px uppercase font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-white hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive-background text-destructive-foreground hover:bg-destructive-background/60",
        success: "border-transparent bg-success-background text-success-foreground hover:bg-success-background/60",
        warning: "border-transparent bg-warning-background text-warning-foreground hover:bg-warning-background/60",
        info: "border-transparent bg-info-background text-info-foreground hover:bg-info-background/60",
        outline: "text-foreground",
      },
      size: {
        sm: "text-xs px-2",
        default: "text-sm px-2.5",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }
  
function Badge({ className, size, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
