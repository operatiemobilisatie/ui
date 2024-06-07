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
  attributes,
  as = 'span',
}: Kicker) => {
  const KickerElement:Kicker["as"] = as;

  return (
    <KickerElement
      className={`uppercase text-lg tracking-wider ${className}`}
      {...attributes}
    >
      {children}
    </KickerElement>
  )
};

export default Kicker;