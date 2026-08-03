import * as React from "react"
import { useId } from "react"
import { cn } from '../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

/*
 * The outline variant used `has-checked:` -- the checked-state spelling of a
 * custom element. The input here is a native radio, so it emits the native
 * `:checked` pseudo-class, and the peer chain (`.peer:checked ~ .radio-indicator`)
 * is the one that actually styles the dot. `has-checked` never matched anything.
 * Replaced with a real `peer-checked:` on the focusable input.
 */
const radioButtonVariants = cva(
  "inline-flex gap-x-2 cursor-pointer font-semibold items-center justify-center ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-white hover:border-gray-300 peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-ring",
      },
      size: {
        default: "h-10 px-3.5 py-2 rounded-xl",
        sm: "h-[34px] px-3 rounded-xl",
        lg: "h-11 px-4 rounded-2xl"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/*
 * All extra props are spread onto the inner <input type="radio">, so the type
 * has to admit them -- notably `name`, which is what groups radios together,
 * and `defaultChecked`/`checked`. It previously listed only id/className, so
 * every real-world usage was a type error.
 */
type RadioButtonProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & {
  hideIndicator?: boolean;
  className?: string;
  children: React.ReactNode;
  id?: string;
} & VariantProps<typeof radioButtonVariants>;

/*
 * `radio-indicator` was the only styling this element ever had, and no rule for
 * it exists -- not in src/css/style.css, not in the Storybook stylesheet, not in
 * anything the package ships. It rendered an empty unstyled 0x0 <div>, so the
 * dot was invisible in every variant and `hideIndicator` toggled nothing. The
 * class name is kept as a hook for consumers who want to restyle it; the
 * appearance now comes from the utilities alongside it.
 *
 * The state comes off the sibling <input> rather than off the label: `peer-*`
 * compiles to `.peer:checked ~ &`, and the input is `invisible` (not `hidden`)
 * precisely so it still participates as a real checked radio. Note this only
 * reaches direct siblings of the input, which is why the dot is an `::after` on
 * the indicator itself rather than a nested element -- a child would never match.
 *
 * A <span>, not a <div>: <label> takes phrasing content, and a <div> inside one
 * is invalid HTML. Both are flex items here, so nothing moves.
 *
 * The input is focusable and in the tab order (a `sr-only`-style visually
 * hidden input, not `invisible`): a native radio group is expected to take one
 * tab stop for the whole group and arrow-key between options, and
 * `visibility: hidden` removed the input from the tab order entirely -- the
 * old `tabIndex={0}` on the label papered over that by turning each option
 * into its own tab stop. The input keeps the peer chain working, and the
 * focus ring moved to the indicator via `peer-focus-visible:` so keyboard
 * focus is still visible.
 */
const RadioButton = React.forwardRef(({ className, id, variant, size, children, hideIndicator, ...props }:RadioButtonProps, ref:React.ForwardedRef<HTMLInputElement>) => {
  const generatedId = useId()
  const inputId = id ?? generatedId
  return (
    <label htmlFor={inputId} className={cn(radioButtonVariants({ variant, size, className }))}>
      <input
        type="radio"
        {...props}
        ref={ref}
        id={inputId}
        className="peer sr-only focus-visible:peer-focus-visible:ring-2 focus-visible:peer-focus-visible:ring-ring peer-focus-visible:ring-2 peer-focus-visible:ring-ring"
      />
      {!hideIndicator && (
        <span
          aria-hidden="true"
          className="radio-indicator relative h-4 w-4 shrink-0 rounded-full border-2 border-gray-600 bg-white transition-colors after:absolute after:left-1/2 after:top-1/2 after:h-2 after:w-2 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-primary after:opacity-0 after:transition-opacity after:content-[''] peer-checked:border-primary peer-checked:after:opacity-100 peer-disabled:opacity-50 peer-focus-visible:ring-2 peer-focus-visible:ring-ring"
        />
      )}
      {children}
    </label>
  )
});

export { RadioButton, radioButtonVariants };