"use client"
import * as React from "react"

import * as Toast from "./toast"

/*
 * The queue renderer. Mount it once, *inside* a `<Toast.Provider>`:
 *
 *   <Toast.Provider>
 *     <App />
 *     <Toaster />
 *   </Toast.Provider>
 *
 * The provider is deliberately not baked in the way it used to be. Under the old
 * shadcn reducer the queue lived in a module-level variable, so `<Toaster/>`
 * could own the provider and `toast()` could be imported from anywhere. Base UI
 * keeps the queue in React context, and `useToastManager()` only resolves
 * against a provider *above* the calling component -- so a Toaster that owned
 * the provider would put every consumer outside it and every `add()` would
 * throw. The provider has to be a real wrapper in the consumer's tree.
 *
 * Everything each toast displays now comes off its record rather than out of the
 * JSX: Title and Description read `toast.title` / `toast.description` and render
 * nothing when they are absent, and Action renders nothing unless the record
 * carries `actionProps`. That is what replaces the old `action` prop, which was
 * a whole ReactElement stashed in the reducer's state.
 *
 * The nesting below is the shape Base UI's stacking geometry expects, and it is
 * not interchangeable with the flatter arrangement this used to have:
 *
 *   Content is the padded row and has to hold everything that takes up height,
 *   because Toast.Root re-measures itself whenever Content's ResizeObserver
 *   fires and the whole stack is positioned off that measurement. Action moved
 *   inside it for that reason; Close stays outside because it is absolutely
 *   positioned and contributes none.
 *
 *   Title and Description need their own wrapper -- Content is a flex row, so
 *   left as direct children they would sit side by side instead of stacked.
 *   `min-w-0` lets a long description wrap rather than push the Close button
 *   out of the card.
 *
 * How many toasts are shown at once is `limit` on `<Toast.Provider>` (3 by
 * default); anything past it waits its turn rather than growing the stack.
 */
export function Toaster() {
  const { toasts } = Toast.useToastManager()

  return (
    <Toast.Portal>
      <Toast.Viewport>
        {toasts.map((toast) => (
          <Toast.Root
            key={toast.id}
            toast={toast}
            variant={toast.type as Toast.Variant | undefined}
          >
            <Toast.Content>
              <div className="grid min-w-0 flex-1 gap-1">
                <Toast.Title />
                <Toast.Description />
              </div>
              <Toast.Action />
            </Toast.Content>
            <Toast.Close />
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  )
}
