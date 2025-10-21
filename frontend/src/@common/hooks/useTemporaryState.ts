import { useCallback, useEffect, useState } from 'react';

const useTemporaryState = (duration = 2000) => {
  const [isActive, setIsActive] = useState(false);

  const activate = useCallback(() => {
    setIsActive(true);
  }, []);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setIsActive(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isActive, duration]);

  return { isActive, activate };
};

export { useTemporaryState };
