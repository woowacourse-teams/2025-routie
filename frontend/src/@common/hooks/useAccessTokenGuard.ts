import { useCallback } from 'react';

import { useToastContext } from '@/@common/contexts/useToastContext';
import { getAccessToken } from '@/@common/utils/getAccessToken';

const useAccessTokenGuard = () => {
  const { showToast } = useToastContext();

  return useCallback(() => {
    const accessToken = getAccessToken();

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

export { useAccessTokenGuard };
