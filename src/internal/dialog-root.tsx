'use client'

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

/*
 * `Dialog.Root` lives here for the same reason `Dialog.Popup` does: it calls
 * hooks, so it needs "use client", and `dialog.tsx` cannot carry that directive
 * without breaking `export * as Dialog` for server components. See the note at
 * the top of ./dialog-popup.tsx.
 *
 * Without an `id` this is Base UI's Root, untouched. With one, the dialog is
 * bound to the URL hash: `#id` opens it, opening it pushes `#id`, and closing it
 * takes the hash off again. The id has to go on Root rather than on Popup --
 * Root renders no element, but the Popup is not mounted while the dialog is
 * closed, so nothing else is around to read the hash.
 *
 * Opening pushes a history entry, so the browser's Back button closes the
 * dialog. `pushState` rather than `location.hash = ...`, because assigning the
 * hash also scrolls to any element on the page that happens to share the id.
 * Closing goes `history.back()` when the hash entry came from this session, so
 * the stack doesn't collect dead `#id` entries; when the page was *loaded* with
 * `#id` there is nothing to go back to, so the hash is replaced away instead.
 *
 * The hash is read in an effect, never during render, so the server and the
 * first client render agree and hydration stays clean. `history.state` is
 * passed through on every write: Next's app router keeps its own state there.
 */

type RootProps<Payload = unknown> = DialogPrimitive.Root.Props<Payload> & {
  /** Binds the dialog's open state to `#id` in the URL. */
  id?: string
}

const hashMatches = (id: string) => {
  try {
    return decodeURIComponent(window.location.hash.slice(1)) === id
  } catch {
    return false
  }
}

function Root<Payload>({ id, ...props }: RootProps<Payload>) {
  if (id === undefined) {
    return <DialogPrimitive.Root {...props} />
  }
  return <HashRoot id={id} {...props} />
}

function HashRoot<Payload>({
  id,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: RootProps<Payload> & { id: string }) {
  const [open, setOpen] = React.useState(defaultOpen)
  // Whether the current `#id` entry was added during this session, and so can
  // be left with `history.back()` instead of being replaced.
  const ownsEntry = React.useRef(false)

  React.useEffect(() => {
    const sync = (event?: Event) => {
      const matches = hashMatches(id)
      // A hash that arrives by navigation (a clicked `<a href="#id">`) pushed
      // its own entry, same as opening through the Trigger does.
      if (event && matches) ownsEntry.current = true
      if (!matches) ownsEntry.current = false
      setOpen(matches)
    }
    if (hashMatches(id)) setOpen(true)
    window.addEventListener("hashchange", sync)
    window.addEventListener("popstate", sync)
    return () => {
      window.removeEventListener("hashchange", sync)
      window.removeEventListener("popstate", sync)
    }
  }, [id])

  const handleOpenChange: NonNullable<typeof onOpenChange> = (
    next,
    eventDetails
  ) => {
    onOpenChange?.(next, eventDetails)
    if (eventDetails.isCanceled) return

    // Set state straight away rather than waiting on `popstate`, which is
    // async and would hold up the close transition by a tick.
    setOpen(next)

    if (next) {
      if (hashMatches(id)) return
      window.history.pushState(
        window.history.state,
        "",
        `#${encodeURIComponent(id)}`
      )
      ownsEntry.current = true
    } else if (hashMatches(id)) {
      if (ownsEntry.current) {
        ownsEntry.current = false
        window.history.back()
      } else {
        const { pathname, search } = window.location
        window.history.replaceState(window.history.state, "", pathname + search)
      }
    }
  }

  return (
    <DialogPrimitive.Root
      open={openProp ?? open}
      onOpenChange={handleOpenChange}
      {...props}
    />
  )
}

export { Root }
export type { RootProps }
