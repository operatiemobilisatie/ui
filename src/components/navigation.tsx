'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Below this width the sidebar becomes an overlay and the bottom bar appears.
 * Must stay in sync with Tailwind's `lg` breakpoint (64rem), which the `max-lg:` /
 * `lg:` variants throughout this file rely on.
 */
const MOBILE_QUERY = '(max-width: 63.999rem)'

export type NavigationItem = {
  label: string
  /** Falls back to `label`. Only used as a React key. */
  id?: string
  icon?: React.ReactNode
  /** The element to render the item as, e.g. `<Link href="/cases" />`. */
  render?: React.ReactElement
  active?: boolean
}

type NavigationContextValue = {
  /** Desktop: whether the sidebar column is expanded. */
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  /** Mobile: whether the sidebar overlay is showing. */
  mobileOpen: boolean
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>
  isMobile: boolean
  /** Toggles whichever of the two states applies at the current viewport width. */
  toggle: () => void
  sidebarId: string
  layoutRef: React.RefObject<HTMLDivElement | null>
}

const NavigationContext = React.createContext<NavigationContextValue | null>(null)

export const useNavigation = () => {
  const context = React.useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a Navigation.Root')
  }
  return context
}

/**
 * Composes into the element passed as `render`, mirroring Base UI's composition convention.
 *
 * TODO: on moving to OM/UI v3, swap the body for `useRender` from `@base-ui/react/use-render`.
 * The signature is deliberately API-compatible, so no consumer code changes.
 */
const renderElement = (
  render: React.ReactElement | undefined,
  defaultTag: keyof React.JSX.IntrinsicElements,
  props: React.HTMLAttributes<HTMLElement> & Record<string, unknown>,
) => {
  if (!render) return React.createElement(defaultTag, props)

  const own = render.props as React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }
  return React.cloneElement(render as React.ReactElement<Record<string, unknown>>, {
    ...props,
    ...own,
    className: cn(props.className, own.className),
    children: props.children ?? own.children,
  })
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect

const subscribeToMobileQuery = (callback: () => void) => {
  const query = window.matchMedia(MOBILE_QUERY)
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

/**
 * Only drives behaviour (which state the toggle flips, scroll locking, `inert`) — never appearance.
 * Layout is decided by CSS breakpoints so both sizes render correctly on first paint.
 */
const useIsMobile = () =>
  React.useSyncExternalStore(
    subscribeToMobileQuery,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  )

/**
 * Locks page scrolling while the overlay is open.
 *
 * `overflow: hidden` on the body is not enough on its own — iOS Safari ignores it and keeps
 * touch-scrolling and rubber-banding the page. Pinning the body and offsetting it by the current
 * scroll position is what actually holds; the scroll position is restored on release.
 */
const useScrollLock = (enabled: boolean) => {
  useIsomorphicLayoutEffect(() => {
    if (!enabled) return

    const { body } = document
    const scrollY = window.scrollY
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    }

    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    body.style.overflow = 'hidden'

    return () => {
      Object.assign(body.style, previous)
      window.scrollTo(0, scrollY)
    }
  }, [enabled])
}

/** Closes the mobile overlay when a link inside the subtree is followed. */
const useCloseOnNavigate = (enabled: boolean) => {
  const { isMobile, setMobileOpen } = useNavigation()

  return (event: React.MouseEvent<HTMLElement>) => {
    if (!enabled || !isMobile) return
    if ((event.target as HTMLElement).closest('a[href]')) setMobileOpen(false)
  }
}

export const Root = ({
  children,
  className,
  defaultOpen = true,
  cookieName = 'sidebar:state',
  width = '300px',
  paddingX = '0.5rem',
}: {
  children: React.ReactNode
  className?: string
  /** Initial desktop state. Pass the persisted cookie value to avoid a flash on load. */
  defaultOpen?: boolean
  /** Set to null to disable persistence. */
  cookieName?: string | null
  width?: string
  paddingX?: string
}) => {
  const [open, setOpen] = React.useState(defaultOpen)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const isMobile = useIsMobile()
  const sidebarId = React.useId()
  const layoutRef = React.useRef<HTMLDivElement>(null)

  const toggle = React.useCallback(() => {
    if (window.matchMedia(MOBILE_QUERY).matches) {
      setMobileOpen((previous) => !previous)
      return
    }

    setOpen((previous) => {
      const next = !previous
      if (cookieName) {
        document.cookie = `${cookieName}=${next}; path=/; max-age=31536000; SameSite=Lax`
      }
      return next
    })
  }, [cookieName])

  // Don't leave the overlay state hanging around after resizing back up to desktop.
  React.useEffect(() => {
    if (!isMobile) setMobileOpen(false)
  }, [isMobile])

  useScrollLock(isMobile && mobileOpen)

  React.useEffect(() => {
    if (!isMobile || !mobileOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)

    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isMobile, mobileOpen])

  const value = React.useMemo(
    () => ({ open, setOpen, mobileOpen, setMobileOpen, isMobile, toggle, sidebarId, layoutRef }),
    [open, mobileOpen, isMobile, toggle, sidebarId],
  )

  return (
    <NavigationContext.Provider value={value}>
      <div
        ref={layoutRef}
        data-state={open ? 'expanded' : 'collapsed'}
        data-mobile={mobileOpen ? 'open' : 'closed'}
        style={
          {
            '--nav-width': width,
            '--nav-padding-x': paddingX,
            '--nav-bottom-bar-height': '0px',
          } as React.CSSProperties
        }
        className={cn(
          'group/nav grid min-h-[100dvh] grid-cols-[1fr]',
          'lg:grid-cols-[var(--nav-width)_1fr] lg:transition-[grid-template-columns] lg:duration-300 lg:ease-in-out',
          'lg:data-[state=collapsed]:grid-cols-[0_1fr] motion-reduce:transition-none',
          className,
        )}
      >
        {children}
      </div>
    </NavigationContext.Provider>
  )
}

export const Sidebar = ({
  children,
  className,
  label = 'Sidebar',
  edgeToggle = true,
  closeOnNavigate = true,
}: {
  children: React.ReactNode
  className?: string
  label?: string
  /** Renders the tab on the sidebar's right border that collapses/expands it. */
  edgeToggle?: boolean
  closeOnNavigate?: boolean
}) => {
  const { sidebarId } = useNavigation()
  const onClick = useCloseOnNavigate(closeOnNavigate)

  return (
    <aside
      id={sidebarId}
      aria-label={label}
      onClick={onClick}
      className={cn(
        // Mobile: an overlay stopping short of the bottom bar. No transition — it just appears.
        'fixed inset-x-0 top-0 bottom-[var(--nav-bottom-bar-height)] z-50 hidden bg-white',
        'group-data-[mobile=open]/nav:block',
        // Desktop: a sticky full-height column. overflow-visible so the edge toggle can escape it.
        'lg:sticky lg:inset-x-auto lg:bottom-auto lg:top-0 lg:block lg:h-[100dvh]',
        'lg:overflow-visible lg:border-r lg:border-gray-200',
        'lg:group-data-[state=collapsed]/nav:border-r-transparent',
        className,
      )}
    >
      {edgeToggle && <EdgeToggle />}
      {/* Clips the fixed-width content against the animating grid track. Without this the content
          spills over the main area for the whole animation and then pops out of existence. */}
      <div className="h-full w-full overflow-hidden">
        <div
          className={cn(
            // overscroll-contain stops a scroll that reaches the end of the overlay from chaining
            // out and moving the page behind it.
            'flex h-full w-full flex-col overflow-x-hidden overflow-y-auto overscroll-contain px-[var(--nav-padding-x)]',
            // Fixed width so the contents don't reflow while the column animates.
            'lg:w-[var(--nav-width)] lg:transition-[visibility] lg:duration-300 lg:ease-in-out',
            // Clipped content is still keyboard-focusable, so this is required, not cosmetic.
            'lg:group-data-[state=collapsed]/nav:invisible motion-reduce:transition-none',
          )}
        >
          {children}
        </div>
      </div>
    </aside>
  )
}

export const Content = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const { isMobile, mobileOpen } = useNavigation()

  // A div rather than <main>, because pages render their own <main> and they must not nest.
  return (
    <div
      inert={isMobile && mobileOpen ? true : undefined}
      className={cn(
        // Grid items default to min-width: auto, which lets wide tables widen the layout.
        'min-w-0 pb-[var(--nav-bottom-bar-height)]',
        className,
      )}
    >
      {children}
    </div>
  )
}

/**
 * Mobile-only bar pinned to the bottom of the viewport. Sits above the sidebar overlay and reports
 * its own height as `--nav-bottom-bar-height`, which insets both the overlay and the main content.
 */
export const BottomBar = ({
  children,
  className,
  closeOnNavigate = true,
}: {
  children: React.ReactNode
  className?: string
  closeOnNavigate?: boolean
}) => {
  const { layoutRef, isMobile } = useNavigation()
  const barRef = React.useRef<HTMLDivElement>(null)
  const onClick = useCloseOnNavigate(closeOnNavigate)

  // Re-runs on breakpoint change so the var re-measures (and zeroes on desktop) even where a
  // display:none element doesn't produce a resize observation.
  useIsomorphicLayoutEffect(() => {
    const bar = barRef.current
    const layout = layoutRef.current
    if (!bar || !layout) return

    const observer = new ResizeObserver(() => {
      layout.style.setProperty('--nav-bottom-bar-height', `${bar.getBoundingClientRect().height}px`)
    })
    observer.observe(bar)

    return () => {
      observer.disconnect()
      layout.style.setProperty('--nav-bottom-bar-height', '0px')
    }
  }, [layoutRef, isMobile])

  return (
    <div
      ref={barRef}
      onClick={onClick}
      // z-51 keeps it above the overlay, so it stays visible and tappable while the overlay is open.
      className={cn('fixed inset-x-0 bottom-0 z-51 flex bg-white lg:hidden', className)}
    >
      {children}
    </div>
  )
}

const menuListVariants = cva('m-0 flex list-none gap-1 p-0', {
  variants: {
    orientation: {
      vertical: 'flex-col py-4',
      horizontal: 'w-full flex-row',
    },
  },
  defaultVariants: { orientation: 'vertical' },
})

const menuItemVariants = cva(
  'flex items-center rounded-lg text-inherit no-underline hover:bg-gray-100 aria-[current=page]:font-semibold',
  {
    variants: {
      orientation: {
        vertical: 'gap-2 px-4 py-2 text-base',
        horizontal: 'flex-col gap-1 px-1 py-2 text-center',
      },
    },
    defaultVariants: { orientation: 'vertical' },
  },
)

type Orientation = NonNullable<VariantProps<typeof menuListVariants>['orientation']>

export const MenuItem = ({
  render,
  active,
  icon,
  orientation = 'vertical',
  className,
  children,
}: {
  render?: React.ReactElement
  active?: boolean
  icon?: React.ReactNode
  orientation?: Orientation
  className?: string
  children: React.ReactNode
}) =>
  renderElement(render, 'a', {
    className: cn(menuItemVariants({ orientation }), className),
    'aria-current': active ? 'page' : undefined,
    children: (
      <>
        {icon && (
          <span className={cn('inline-flex [&_svg]:size-5', active ? 'text-primary' : 'text-gray-600')}>
            {icon}
          </span>
        )}
        <span className={orientation === 'horizontal' ? 'text-xs' : undefined}>{children}</span>
      </>
    ),
  })

export const Menu = ({
  items,
  orientation = 'vertical',
  limit,
  className,
  label = 'Main navigation',
}: {
  items: NavigationItem[]
  orientation?: Orientation
  /** Show only the first N items, e.g. 4 in the bottom bar. */
  limit?: number
  className?: string
  label?: string
}) => {
  const shown = typeof limit === 'number' ? items.slice(0, limit) : items

  return (
    <nav aria-label={label} className={className}>
      <ul className={menuListVariants({ orientation })}>
        {shown.map((item) => (
          <li key={item.id ?? item.label} className={orientation === 'horizontal' ? 'flex-1' : undefined}>
            <MenuItem render={item.render} active={item.active} icon={item.icon} orientation={orientation}>
              {item.label}
            </MenuItem>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/**
 * The tab straddling the sidebar's right border. On mobile it re-anchors inside the
 * overlay and shows a close icon instead of a chevron.
 */
export const EdgeToggle = ({ className }: { className?: string }) => {
  const { open, mobileOpen, isMobile, toggle, sidebarId } = useNavigation()
  const expanded = isMobile ? mobileOpen : open

  return (
    <button
      type="button"
      onClick={toggle}
      aria-controls={sidebarId}
      aria-expanded={expanded}
      aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
      className={cn(
        'absolute top-4 right-4 z-1 flex size-8 cursor-pointer items-center justify-center',
        'rounded-lg border border-gray-200 bg-gray-200 text-gray-600 hover:bg-gray-100',
        'lg:top-0 lg:right-0 lg:translate-x-full lg:rounded-none lg:border-0 lg:border-l lg:border-l-transparent',
        className,
      )}
    >
      <ChevronRightIcon
        className={cn(
          'hidden text-base transition-transform duration-300 ease-in-out lg:block motion-reduce:transition-none',
          'group-data-[state=expanded]/nav:rotate-180',
        )}
      />
      <CloseIcon className="text-base lg:hidden" />
    </button>
  )
}

/** Generic trigger for arbitrary placement, e.g. alongside the items in the bottom bar. */
export const Toggle = ({
  open: openContent,
  closed: closedContent,
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> & {
  /** Rendered while the sidebar is open. */
  open?: React.ReactNode
  /** Rendered while the sidebar is closed. */
  closed?: React.ReactNode
}) => {
  const { open, mobileOpen, isMobile, toggle, sidebarId } = useNavigation()
  const expanded = isMobile ? mobileOpen : open

  return (
    <button
      type="button"
      onClick={toggle}
      aria-controls={sidebarId}
      aria-expanded={expanded}
      className={cn('cursor-pointer', className)}
      {...props}
    >
      {expanded ? openContent : closedContent}
    </button>
  )
}

/**
 * Local stand-ins for OM/UI v3's inline icons — same shape and 1em sizing, so they track font-size.
 * TODO: on moving to OM/UI v3, delete these and import from `./icons`.
 */
type IconProps = React.SVGProps<SVGSVGElement>

const iconProps = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const

const ChevronRightIcon = (props: IconProps) => (
  <svg {...iconProps} {...props}>
    <path d="m9 18 6-6-6-6" />
  </svg>
)

const CloseIcon = (props: IconProps) => (
  <svg {...iconProps} {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)
