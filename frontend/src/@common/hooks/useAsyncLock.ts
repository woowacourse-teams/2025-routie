import { useCallback, useRef, useState } from 'react';

export const useAsyncLock = () => {
  const isLockedRef = useRef(false);
  const [loading, setLoading] = useState(false);

  const runWithLock = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
      if (isLockedRef.current) return undefined;

      isLockedRef.current = true;
      setLoading(true);

      try {
        return await fn();
      } finally {
        isLockedRef.current = false;
        setLoading(false);
      }
    },
    [],
  );

  return { runWithLock, loading, isLockedRef };
}
