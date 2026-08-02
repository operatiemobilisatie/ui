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
              <Toast.Title />
              <Toast.Description />
            </Toast.Content>
            <Toast.Action />
            <Toast.Close />
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  )
}
