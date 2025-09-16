import { useEffect } from 'react';

import { useToastContext } from '@/@common/contexts/useToastContext';

const useToastOnError = (error: Error | null) => {
  const { showToast } = useToastContext();

  useEffect(() => {
    if (!error) return;

    if (error instanceof Error) {
      showToast({
        message: error.message,
        type: 'error',
      });
    }
    console.error(error);
  }, [error]);
};

export { useToastOnError };
