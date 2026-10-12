"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "../lib/utils"

const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({
  className,
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  onKeyDown,
  onPointerDown,
  min = 0,
  max = 100,
  step = 1,
  minStepsBetweenThumbs = 0,
  ...props
}, ref) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? [min])
  const values = value ?? uncontrolledValue
  const thumbs = React.useRef<(HTMLElement | null)[]>([])
  // -1 until the first move shows which thumb is moving.
  const activeIndex = React.useRef(-1)
  const decimals = (String(step).split(".")[1] ?? "").length

  function moveThumb(index: number, to: number) {
    const gap = minStepsBetweenThumbs * step
    const lower = index > 0 ? values[index - 1] + gap : min
    const upper = index < values.length - 1 ? values[index + 1] - gap : max
    const next = [...values]
    next[index] = Number(Math.min(Math.max(to, lower), upper).toFixed(decimals))
    return next
  }

  function closestThumb(to: number) {
    let closest = 0
    values.forEach((v, i) => {
      const distance = Math.abs(v - to)
      const best = Math.abs(values[closest] - to)
      if (distance < best || (distance === best && to > v)) closest = i
    })
    return closest
  }

  function fromRadix(sorted: number[]) {
    const unmatched = [...values]
    const to = sorted.find((v) => {
      const i = unmatched.indexOf(v)
      if (i === -1) return true
      unmatched.splice(i, 1)
      return false
    })
    if (to === undefined) return values
    if (activeIndex.current === -1) activeIndex.current = closestThumb(to)
    return moveThumb(activeIndex.current, to)
  }

  function update(next: number[], { commit = false } = {}) {
    thumbs.current[activeIndex.current]?.focus()
    if (String(next) === String(values)) return
    if (value === undefined) setUncontrolledValue(next)
    onValueChange?.(next)
    if (commit) onValueCommit?.(next)
  }

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center pb-6 pt-2 group aria-disabled:opacity-50",
        className
      )}
      value={values}
      min={min}
      max={max}
      step={step}
      minStepsBetweenThumbs={minStepsBetweenThumbs}
      onValueChange={(sorted) => update(fromRadix(sorted))}
      onValueCommit={(sorted) => {
        const next = fromRadix(sorted)
        if (String(next) !== String(values) || String(sorted) === String(values)) onValueCommit?.(next)
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        const index = thumbs.current.findIndex((thumb) => thumb?.contains(event.target as Node))
        const stacked = values[index - 1] === values[index] || values[index + 1] === values[index]
        activeIndex.current = index === -1 || stacked ? -1 : index
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        const index = thumbs.current.indexOf(event.target as HTMLElement)
        if (event.defaultPrevented || index === -1 || props.disabled) return
        activeIndex.current = index
        if (event.key === "Home" || event.key === "End") {
          event.preventDefault()
          update(moveThumb(index, event.key === "Home" ? min : max), { commit: true })
        }
      }}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {values.map((value, index) => (
        <SliderPrimitive.Thumb
          key={index}
          ref={(thumb) => {
            thumbs.current[index] = thumb
          }}
          asChild
        >
          <div className="flex justify-center h-5 w-5 cursor-grab rounded-full border-[5px] border-primary-200 bg-primary ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:bg-green">
            <div className="text-center translate-y-5 text-sm font-semibold self-center w-min">{value}</div>
          </div>
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
