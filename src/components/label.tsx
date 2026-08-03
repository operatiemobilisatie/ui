/*
 * No "use client" here: nothing in this file calls a hook, so it renders on the
 * server as-is. See the note on the directive policy in src/index.ts.
 */
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

/*
 * `peer-disabled:` only matches a native `disabled` attribute on the sibling
 * input -- which Checkbox, Switch and Radio never set, because Base UI marks
 * those roots `nativeButton = false` and uses `aria-disabled` instead. The
 * `peer-data-[disabled]:` companion below is what actually fires for those.
 * The `aria-disabled:` classes cover the case where the label itself carries
 * the state rather than a peer.
 */
const labelVariants = cva(
  "font-semibold text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 peer-data-[disabled]:cursor-not-allowed peer-data-[disabled]:opacity-70 aria-disabled:cursor-not-allowed aria-disabled:opacity-70 [&[for]]:cursor-pointer"
)

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <label ref={ref} className={cn(labelVariants(), className)} {...props} />
))
Label.displayName = "Label"

export { Label, labelVariants }
