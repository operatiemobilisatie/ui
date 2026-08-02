'use client';

import * as React from 'react';

/**
 * True once the element has entered the viewport.
 *
 * Replaces `useInView` from `motion` (framer-motion), which was pulled in for
 * this one call. `once: false` keeps motion's default behaviour of toggling
 * back to false when the element leaves again.
 */
export function useInView(
  ref: React.RefObject<Element | null>,
  { once = false, margin, amount = 0 }: { once?: boolean; margin?: string; amount?: number } = {},
): boolean {
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Not available in jsdom or very old browsers: fail open rather than
    // leaving the element permanently hidden.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin: margin, threshold: amount },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, once, margin, amount]);

  return inView;
}

const easeOutQuad = (t: number) => t * (2 - t);

/**
 * Animates a number from `start` to `end` over `duration` seconds, writing the
 * result straight into `ref`'s textContent.
 *
 * Replaces `useCountUp` from `react-countup`. Writing to the DOM rather than
 * through state is deliberate and matches the previous behaviour: it avoids a
 * re-render on every animation frame.
 */
export function useCountUp({
  ref,
  start = 0,
  end,
  duration = 2,
  suffix = '',
  prefix = '',
  decimals = 0,
}: {
  ref: React.RefObject<HTMLElement | null>;
  start?: number;
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const frame = React.useRef<number | null>(null);
  const format = React.useCallback(
    (v: number) => `${prefix}${v.toFixed(decimals)}${suffix}`,
    [prefix, suffix, decimals],
  );

  const cancel = React.useCallback(() => {
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
  }, []);

  const startAnimation = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancel();

    const ms = duration * 1000;
    if (ms <= 0) {
      el.textContent = format(end);
      return;
    }

    let t0: number | null = null;
    const step = (now: number) => {
      if (t0 === null) t0 = now;
      const progress = Math.min((now - t0) / ms, 1);
      el.textContent = format(start + (end - start) * easeOutQuad(progress));
      if (progress < 1) {
        frame.current = requestAnimationFrame(step);
      } else {
        frame.current = null;
      }
    };
    frame.current = requestAnimationFrame(step);
  }, [ref, start, end, duration, format, cancel]);

  const reset = React.useCallback(() => {
    cancel();
    if (ref.current) ref.current.textContent = format(start);
  }, [ref, start, format, cancel]);

  React.useEffect(() => cancel, [cancel]);

  return { start: startAnimation, reset };
}
