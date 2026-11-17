import { useCallback, useEffect, useRef } from "react";

/**
 * useThrottledCallback Hook
 * Throttles execution of high-frequency events using requestAnimationFrame or a time threshold.
 * Prevents main thread saturation during rapid interactions like scrolling or resizing.
 */
export function useThrottledCallback<T extends (...args: any[]) => void>(
  callback: T,
  limitMs: number = 100
): (...args: Parameters<T>) => void {
  const lastRanRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef<T>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLast = now - lastRanRef.current;

      if (timeSinceLast >= limitMs) {
        lastRanRef.current = now;
        callbackRef.current(...args);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          lastRanRef.current = Date.now();
          callbackRef.current(...args);
        }, limitMs - timeSinceLast);
      }
    },
    [limitMs]
  );
}

/**
 * useRafCallback Hook
 * Executes callback synchronized with the browser's display refresh rate (requestAnimationFrame).
 */
export function useRafCallback<T extends (...args: any[]) => void>(
  callback: T
): (...args: Parameters<T>) => void {
  const rafIdRef = useRef<number | null>(null);
  const callbackRef = useRef<T>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(() => {
        callbackRef.current(...args);
        rafIdRef.current = null;
      });
    },
    []
  );
}
