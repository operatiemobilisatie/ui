import * as React from "react"

import { cn } from "../lib/utils"
import { Root } from "../internal/card-root"

/*
 * Parts are namespaced, following Base UI:
 *
 *   import { Card } from "@operatiemobilisatie/ui";
 *   <Card.Root render={<Link href="/story" />}>...</Card.Root>
 *
 * `asChild` is replaced by `render`.
 *
 * `Root` lives in `../internal/card-root`. It is the only part that calls a
 * hook (`useRender`), so it needs "use client" -- and a module with that
 * directive cannot be where `export * as Card` builds its namespace object, or
 * the whole namespace would reach a server component as one opaque client
 * reference. This file stays directive-free; see the note in
 * `../internal/card-root` for the mechanism.
 */

const Image = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { image: React.ReactNode, fill?: boolean }
>(({ className, children, image, fill, ...props }, ref) => (
  // The ref was previously accepted and then dropped on the floor.
  <div
    ref={ref}
    {...props}
    className={cn(`overflow-clip relative ${!fill ? 'aspect-video rounded-t-2xl' : 'rounded-2xl'}`, className)}>
    {image}
    {children && <div className={`absolute inset-0 ${!fill ? 'bg-linear-to-t from-black/20 to-transparent' : 'bg-black/30'}`}></div>}
    <div className={`relative text-white h-full group flex flex-col ${!fill ? 'px-8 py-6' : 'image-fill'}`}>
      {children}
    </div>
  </div>
))
Image.displayName = "Card.Image"

const Header = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
Header.displayName = "Card.Header"

const Title = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-roboto-slab group-[.image-fill]:font-semibold font-bold leading-none tracking-wide group-[.image-fill]:tracking-wider",
      className
    )}
    {...props}
  />
))
Title.displayName = "Card.Title"

const Description = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-base group-[.image-fill]:text-white text-gray-500", className)}
    {...props}
  />
))
Description.displayName = "Card.Description"

const Content = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
Content.displayName = "Card.Content"

const Footer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
Footer.displayName = "Card.Footer"

export { Root, Image, Header, Title, Description, Content, Footer }
