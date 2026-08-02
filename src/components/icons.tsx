import * as React from 'react';

/*
 * The five icons this library uses internally, inlined.
 *
 * These replace @fortawesome/{fontawesome-svg-core,free-solid-svg-icons,
 * react-fontawesome} -- three packages consumers had to install to render a
 * tick and a chevron. Note that embedding FontAwesome's own paths would not
 * have helped: the Free icons are CC BY 4.0 and carry an attribution
 * requirement. These are Lucide geometry (ISC), which is also what spinner.tsx
 * already used, so the icon set is now visually consistent.
 *
 * Sizing: width/height default to 1em so the icon tracks font-size, and any
 * `h-4 w-4` class overrides it, since CSS beats the presentation attribute.
 */

export type IconProps = React.SVGProps<SVGSVGElement>;

const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const CheckIcon = ({ className, ...props }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true" {...props}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
CheckIcon.displayName = 'CheckIcon';

const ChevronDownIcon = ({ className, ...props }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true" {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
ChevronDownIcon.displayName = 'ChevronDownIcon';

const ChevronRightIcon = ({ className, ...props }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true" {...props}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);
ChevronRightIcon.displayName = 'ChevronRightIcon';

/* Filled, not stroked: its only job is the dot inside a selected radio item. */
const CircleIcon = ({ className, ...props }: IconProps) => (
  <svg {...base} className={className} fill="currentColor" stroke="none" aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="10" />
  </svg>
);
CircleIcon.displayName = 'CircleIcon';

const CloseIcon = ({ className, ...props }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true" {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
CloseIcon.displayName = 'CloseIcon';

export { CheckIcon, ChevronDownIcon, ChevronRightIcon, CircleIcon, CloseIcon };
