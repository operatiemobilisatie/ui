import React, { ReactNode } from "react";

export interface Kicker {
  className: String,
  children: ReactNode
  attributes: Object,
  as: any,
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

export default Kicker;