import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils"

/*
 * Parts are named Root/Title/Description and consumed through a namespace:
 *
 *   import { Alert } from "@operatiemobilisatie/ui";
 *   // or: import * as Alert from "@operatiemobilisatie/ui/alert";
 *
 *   <Alert.Root variant="success">
 *     <Alert.Title>Saved</Alert.Title>
 *     <Alert.Description>All twelve records were written.</Alert.Description>
 *   </Alert.Root>
 *
 * This is Base UI's own convention, applied across the library in v3. The flat
 * names (Alert, AlertTitle, AlertDescription) are gone.
 */

const alertVariants = cva(
  "relative w-full rounded-xl p-4 [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-[17px] [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border border-input bg-white",
        destructive: "bg-destructive-background text-destructive-foreground [&>svg]:text-destructive-foreground",
        success: "bg-success-background text-success-foreground [&>svg]:text-success-foreground",
        info: "bg-info-background text-info-foreground [&>svg]:text-info-foreground",
        warning: "bg-warning-background text-warning-foreground [&>svg]:text-warning-foreground"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Root = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Root.displayName = "Alert.Root"

const Title = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 tracking-wide font-medium font-roboto-slab text-lg leading-none", className)}
    {...props}
  />
))
Title.displayName = "Alert.Title"

const Description = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
Description.displayName = "Alert.Description"

export { Root, Title, Description, alertVariants }
