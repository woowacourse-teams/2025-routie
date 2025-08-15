import { useCallback, useState } from 'react';

import { sessionStorageUtils } from '../utils/sessionStorage';

export const useSessionStorage = <T>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() =>
    sessionStorageUtils.get(key, defaultValue),
  );

  const setValue = useCallback(
    (value: T) => {
      setStoredValue(value);
      sessionStorageUtils.set(key, value);
    },
    [key],
  );

  return [storedValue, setValue];
};