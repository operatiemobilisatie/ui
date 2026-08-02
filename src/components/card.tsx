import * as React from "react"

import { useRender } from "@base-ui/react/use-render"

import { cn } from "../lib/utils"

/*
 * Parts are namespaced, following Base UI:
 *
 *   import { Card } from "@operatiemobilisatie/ui";
 *   <Card.Root render={<Link href="/story" />}>...</Card.Root>
 *
 * `asChild` is replaced by `render`.
 */

const Root = React.forwardRef<HTMLDivElement, useRender.ComponentProps<'div'>>(
  ({ className, render, ...props }, ref) =>
    useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: {
        className: cn(
          "rounded-2xl border border-b-4 border-gray-200 bg-card text-black shadow-xs relative",
          className
        ),
        ...props,
      },
    })
)
Root.displayName = "Card.Root"

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
    className={cn("text-base group-[.image-fill]:text-white text-muted-foreground", className)}
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
