import * as React from "react"

import { cn } from "@/lib/utils"
import { Slot } from '@radix-ui/react-slot';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      ref={ref}
      {...props}
      className={cn(
        "rounded-2xl border border-b-4 bg-card text-black shadow-xs relative",
        className
      )}
    />
  )
})
Card.displayName = "Card"

const CardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { image: React.ReactNode, fill?: boolean }
>(({ className, children, image, fill, ...props }, ref) => (
  <div
    className={cn(`overflow-clip relative ${!fill ? 'aspect-video rounded-t-2xl' : 'rounded-2xl'}`, className)}>
    {image}
    {children && <div className={`absolute inset-0 ${!fill ? 'bg-linear-to-t from-black/20 to-transparent' : 'bg-black/30'}`}></div>}
    <div className={`relative text-white h-full group flex flex-col ${!fill ? 'px-8 py-6' : 'image-fill'}`}>
      {children}
    </div>
  </div>
))
CardImage.displayName = "CardImage"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-roboto group-[.image-fill]:font-semibold font-medium leading-none tracking-wide group-[.image-fill]:tracking-wider",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-base group-[.image-fill]:text-white text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardImage }
