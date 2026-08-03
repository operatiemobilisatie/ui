'use client'

/*
 * Button calls a hook (`useRender`), so it needs "use client": a module that
 * calls a hook cannot be evaluated on the server. `useRender` traces through
 * `useRenderElement` → `useMergedRefs`, and React treats the importing module
 * as a client reference across an RSC boundary.
 *
 * Button is flat-exported (not `export * as Button`), so the directive is
 * harmless here -- there is no namespace object to hollow out. Card's `Root`
 * is the namespaced equivalent and lives in `src/internal/card-root.tsx`.
 */

import * as React from "react"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils"

const buttonVariants = cva(
  "cursor-pointer font-sans inline-flex items-center justify-center whitespace-nowrap uppercase rounded-full font-semibold ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white border border-primary shimmer",
        secondary: "bg-gray-200 text-secondary-foreground shimmer-invert",
        outline: "border border-primary bg-background text-primary hover:bg-primary hover:text-white",
        "outline-secondary": "border border-input bg-background hover:bg-input hover:text-primary",
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

/**
 * `asChild` is gone. Base UI composes through a `render` prop instead of a Slot:
 *
 *   <Button render={<a href="/give" />}>Give</Button>
 *
 * `render` also accepts a function receiving the merged props, for the cases
 * where you need to place them on the element yourself.
 */
export interface ButtonProps
  extends useRender.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {}

// forwardRef rather than a React 19 ref-as-prop, because peerDependencies
// still allow React 18.
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, render, ...props }, ref) =>
    useRender({
      render,
      ref,
      defaultTagName: "button",
      props: {
        className: cn(buttonVariants({ variant, size, className })),
        ...props,
      },
    })
)
Button.displayName = "Button"

export { Button, buttonVariants }
