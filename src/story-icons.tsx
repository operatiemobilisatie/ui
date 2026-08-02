import * as React from 'react';
import type { IconProps } from './components/icons';

/*
 * Decorative icons used only by stories, to demonstrate things like an icon
 * button or an alert with a leading glyph.
 *
 * Deliberately NOT in src/components/: that directory is a build entry glob, so
 * anything here would be published as a subpath of the package. These are not
 * part of the public API -- the library ships exactly the five icons it uses
 * internally, in components/icons.tsx.
 *
 * Lucide geometry (ISC), matching the shipped set.
 */

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

export const PlusIcon = ({ className, ...props }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true" {...props}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export const CopyIcon = ({ className, ...props }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true" {...props}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

export const InfoIcon = ({ className, ...props }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

export const AlertCircleIcon = ({ className, ...props }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

export const CheckCircleIcon = ({ className, ...props }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
