import { useCallback } from 'react';

import { useToastContext } from '@/@common/contexts/useToastContext';

const useRequireAccessToken = () => {
  const { showToast } = useToastContext();

  return useCallback(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      showToast({
        message: '로그인이 필요합니다.',
        type: 'error',
      });
      return null;
    }

    return accessToken;
  }, [showToast]);
};

export { useRequireAccessToken };
