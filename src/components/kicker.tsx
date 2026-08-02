import React, { ReactNode } from "react";

/*
 * Every prop here except `children` is optional at runtime -- `className` and
 * `as` have defaults in the destructuring below and `attributes` is never read
 * at all -- but all four were declared required, so `<Kicker>text</Kicker>` did
 * not typecheck and a consumer had to pass `attributes={{}}` to satisfy it. That
 * is a hard `next build` failure, since Next typechecks the app by default.
 * Widening the type is not a breaking change: nothing that compiled before
 * stops compiling.
 */
export interface Kicker {
  className?: String,
  children: ReactNode
  attributes?: Object,
  as?: any,
}

const Kicker = ({
  children,
  className = '',
  as = 'span',
  ...props
}: Kicker) => {
  const KickerElement:Kicker["as"] = as;

  return (
    <KickerElement
      className={`uppercase text-lg tracking-wider ${className}`}
      {...props}
    >
      {children}
    </KickerElement>
  )
};

export { Kicker };