import { apiClient } from '@/apis';

import {
  getKakaoAccessTokenAdapter,
  getKakaoLoginUriAdapter,
} from '../adapters/authAdapter';

const getKakaoLoginUri = async () => {
  const response = await apiClient.get(
    '/v1/authentication/external/uri?provider=kakao',
  );
  const data = await response.json();

  return getKakaoLoginUriAdapter(data);
};

const getKakaoAccessToken = async (code: string) => {
  const response = await apiClient.post(`/v1/authentication/external`, {
    code,
    provider: 'kakao',
  });
  const data = await response.json();

  return getKakaoAccessTokenAdapter(data);
};

export { getKakaoLoginUri, getKakaoAccessToken };
