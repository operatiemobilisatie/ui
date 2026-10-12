'use client'

import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "../lib/utils"

/*
 * `Slider.Value` lives here, on its own, for a reason close to the one behind
 * `Dialog.Popup` and `Card.Root`. It calls no hook, but with `index` set it
 * hands Base UI's Value a render function it builds itself, and a function
 * cannot cross from a server component into a client one. Built in
 * `slider.tsx`, which is directive-free and evaluates on the server, a plain
 * `<Slider.Value index={0} />` in a server component would fail with
 * "Functions cannot be passed directly to Client Components" even though the
 * caller passed nothing but a number. Built here, the closure is created on
 * the client side of the boundary and `index` crosses as plain data.
 *
 * `slider.tsx` re-exports `Value` from here, so `export * as Slider` still
 * builds its namespace in a directive-free module. Deliberately not under
 * `src/components/`: the entry glob in tsdown.config.ts turns everything there
 * into a public subpath, and this is an implementation detail of `./slider`.
 */

/*
 * Styled for the position it is designed to occupy -- inside `Thumb`, hanging
 * below it -- which is where the old hard-coded label sat. `self-center` and the
 * `translate-y-5` only mean anything against the thumb's flex box; put a Value
 * anywhere else and it wants its own className.
 *
 * Renders an <output>, but it is a flex item here, so it is blockified and
 * boxes exactly like the <div> it replaces.
 *
 * `index` is for range sliders. Base UI's Value reads every value out of
 * context and, by default, prints them all joined with an en dash -- so a
 * Value inside each thumb of a two-thumb slider shows "20 – 80" under both
 * handles. With `index`, the Value is scoped to that one thumb: the default
 * text is that thumb's formatted value, and a render function receives
 * one-element arrays holding only that thumb's value, exactly as it would on a
 * single-thumb slider. That keeps a render function like
 * `(formatted) => \`${formatted}%\`` correct whether or not the slider is a
 * range. Leave `index` off for a single label covering the whole range.
 */
type ValueProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Value> & {
  index?: number
}

const Value = React.forwardRef<React.ComponentRef<typeof SliderPrimitive.Value>, ValueProps>(
  ({ className, index, children, ...props }, ref) => (
    <SliderPrimitive.Value
      ref={ref}
      className={cn("text-center translate-y-5 text-sm font-semibold self-center w-min", className)}
      {...props}
    >
      {index === undefined
        ? children
        : (formattedValues, values) => {
            const formatted = formattedValues.slice(index, index + 1)
            const raw = values.slice(index, index + 1)
            return typeof children === "function" ? children(formatted, raw) : formatted[0]
          }}
    </SliderPrimitive.Value>
  )
)

Value.displayName = "Slider.Value"

export { Value }
