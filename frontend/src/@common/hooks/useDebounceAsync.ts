import { useCallback, useEffect, useRef } from 'react';

export const useDebounceAsync = <T extends (...args: any[]) => Promise<any>>(
  asyncFn: T,
  delay: number,
) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const callbackRef = useRef<T>(asyncFn);
  useEffect(() => {
    callbackRef.current = asyncFn;
  }, [asyncFn]);

  const debouncedFn = useCallback(
    (...args: Parameters<T>): Promise<ReturnType<T>> => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      return new Promise<ReturnType<T>>((resolve, reject) => {
        timeoutRef.current = setTimeout(async () => {
          try {
            const result = await callbackRef.current(...args);
            resolve(result as ReturnType<T>);
          } catch (error) {
            reject(error);
          }
        }, delay);
      });
    },
    [delay],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return debouncedFn as T;
};
