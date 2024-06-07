import * as React from "react"

import Link from "next/link"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardLink = ({ className, href, ...props }:{className?: string, href: string, children: React.ReactNode}) => (
  <Link
    href={href}
    className={cn(
      "rounded-2xl border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
)
CardLink.displayName = "CardLink"

const CardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { image: React.ReactNode, fill?: boolean }
>(({ className, children, image, fill, ...props }, ref) => (
  <div
    className={cn(`overflow-clip relative ${!fill ? 'aspect-video rounded-t-2xl' : 'rounded-2xl'}`, className)}>
    {image}
    {children && <div className={`absolute inset-0 ${!fill ? 'bg-gradient-to-t from-black/20 to-transparent' : 'bg-black/20'}`}></div>}
    <div className={`relative drop-shadow-sm text-white group ${!fill ? 'h-full flex items-end px-8 py-6' : 'image-fill'}`}>
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
      "text-2xl font-semibold leading-none tracking-tight font-lato",
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

export { Card, CardLink, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardImage }
