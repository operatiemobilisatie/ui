import * as React from "react"
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

/*
  Fix focus select
*/

const radioVariants = cva(
  "inline-flex gap-x-2 cursor-pointer font-semibold items-center justify-center ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-white hover:border-gray-300 has-checked:border-primary has-checked:ring-2 has-checked:ring-ring focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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

type RadioButtonProps = {
  hideIndicator?: boolean;
  className?: string;
  children: React.ReactNode;
  id?: string;
} & VariantProps<typeof radioVariants>;

const RadioButton = React.forwardRef(({ className, id, variant, size, children, hideIndicator, ...props }:RadioButtonProps, ref:React.ForwardedRef<HTMLInputElement>) => {
  return (
    <label tabIndex={0} htmlFor={id} className={cn(radioVariants({ variant, size, className }))}>
      <input type="radio" {...props} ref={ref} id={id} className="absolute invisible peer" />
      {!hideIndicator && <div className="radio-indicator"></div>}
      {children}
    </label>
  )
});

export { RadioButton, radioVariants };