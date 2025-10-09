import { useCallback } from 'react';

import { useToastContext } from '@/@common/contexts/useToastContext';
import {
  ACCESS_TOKEN_REQUIRED_MESSAGE,
  getAccessToken,
} from '@/@common/utils/getAccessTokenOrThrow';

const useAccessTokenGuard = () => {
  const { showToast } = useToastContext();

  return useCallback(() => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      showToast({
        message: ACCESS_TOKEN_REQUIRED_MESSAGE,
        type: 'error',
      });
      return null;
    }

    return accessToken;
  }, [showToast]);
};

export { useAccessTokenGuard };
