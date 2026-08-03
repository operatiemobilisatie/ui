'use client'

import * as React from "react"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "../lib/utils"

/*
 * `Card.Root` lives here, on its own, for the same reason `Dialog.Popup` does:
 * it is the only part of the card that calls a hook (`useRender`, which traces
 * through `useRenderElement` → `useMergedRefs`), and a module that calls a hook
 * needs "use client" -- while a module with "use client" cannot be where
 * `export * as Card` builds its namespace object. Rolldown's unbundle output
 * puts that object inside the client module, so from a server component the
 * whole namespace arrives as one opaque client reference and every part reads
 * back `undefined`.
 *
 * `card.tsx` stays directive-free and re-exports `Root` from here, the same
 * shape Base UI itself ships: a directive-free barrel re-exporting parts that
 * each carry their own boundary. Every other card part renders `div`s and
 * `h3`s only and evaluates fine on the server.
 *
 * Deliberately not under `src/components/`: the entry glob in tsdown.config.ts
 * turns everything there into a public subpath, and this is an implementation
 * detail of `./card`, not a component in its own right.
 */

const Root = React.forwardRef<HTMLDivElement, useRender.ComponentProps<'div'>>(
  ({ className, render, ...props }, ref) =>
    useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: {
        className: cn(
          "rounded-2xl border border-b-4 border-gray-200 bg-background text-black shadow-xs relative",
          className
        ),
        ...props,
      },
    })
)
Root.displayName = "Card.Root"

export { Root }
