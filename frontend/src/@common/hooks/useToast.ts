import { useCallback, useEffect, useRef, useState } from 'react';

import type {
  ShowToastPayloadProps,
  ToastInfoProps,
} from '../components/Toast/Toast.types';

const DEFAULT_DURATION_MS = 3000;
const MAX_TOASTS = 5;
const EXIT_ANIMATION_DURATION = 350;

const useToast = () => {
  const [toast, setToast] = useState<ToastInfoProps[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());

  const scheduleRemoval = useCallback((id: string, duration: number) => {
    const existing = timersRef.current.get(id);

    if (existing) {
      window.clearTimeout(existing);
    }

    const timerId = window.setTimeout(() => {
      setToast((prev) =>
        prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
      );

      const cleanupId = window.setTimeout(() => {
        setToast((prev) => prev.filter((t) => t.id !== id));
        timersRef.current.delete(id);
        window.clearTimeout(cleanupId);
      }, EXIT_ANIMATION_DURATION);
    }, duration);

    timersRef.current.set(id, timerId);
  }, []);

  const showToast = useCallback(
    (payload: ShowToastPayloadProps) => {
      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const duration = payload.duration ?? DEFAULT_DURATION_MS;
      const next: ToastInfoProps = {
        id,
        message: payload.message,
        type: payload.type,
        duration,
        leaving: false,
      };

      setToast((prev) => {
        if (prev.length >= MAX_TOASTS) {
          const oldest = prev[0];
          const existingTimer = timersRef.current.get(oldest.id);

          if (existingTimer) {
            window.clearTimeout(existingTimer);
            timersRef.current.delete(oldest.id);
          }

          return [...prev.slice(1), next];
        }

        return [...prev, next];
      });

      scheduleRemoval(id, duration);
    },
    [scheduleRemoval],
  );

  useEffect(() => {
    const timersMap = timersRef.current;

    return () => {
      timersMap.forEach((timerId) => window.clearTimeout(timerId));
      timersMap.clear();
    };
  }, []);

  return { toast, showToast };
};

export { useToast };
