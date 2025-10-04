import { apiClient } from '@/apis';

import {
  getKakaoAccessTokenAdapter,
  getKakaoLoginUriAdapter,
  getGuestLoginAdapter,
} from '../adapters/authAdapter';

import type { GuestLoginRequestType } from '../types/api.types';
import type { AccessTokenType } from '../types/auth.types';

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

const postGuestLogin = async (
  payload: GuestLoginRequestType,
): Promise<AccessTokenType> => {
  const response = await apiClient.post('/v1/authentication/guest', payload);
  const data = await response.json();

  return getGuestLoginAdapter(data);
};

export { getKakaoLoginUri, getKakaoAccessToken, postGuestLogin };
