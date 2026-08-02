'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

/*
 * Base UI has no standalone Label -- labelling belongs to Field.Label, which is
 * scoped to a Field. @radix-ui/react-label existed only to paper over old
 * browsers not firing click-through on labels wrapping custom controls, which
 * has not been true for years. So this is a plain <label>, and one dependency
 * fewer, with the same styling contract.
 */

const labelVariants = cva(
  "font-semibold text-sm leading-none peer-disabled:cursor-not-allowed [&[for]]:cursor-pointer peer-disabled:opacity-70 aria-disabled:cursor-not-allowed aria-disabled:opacity-70"
)

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <label ref={ref} className={cn(labelVariants(), className)} {...props} />
))
Label.displayName = "Label"

export { Label, labelVariants }
