import type {
  KakaoAccessTokenResponseType,
  KakaoLoginUriResponseType,
  GuestLoginResponseType,
} from '@/domains/auth/types/api.types';
import type {
  KakaoLoginUriType,
  AccessTokenType,
} from '@/domains/auth/types/auth.types';

const getKakaoLoginUriAdapter = (
  data: KakaoLoginUriResponseType,
): KakaoLoginUriType => {
  return {
    uri: data.uri,
  };
};

const getKakaoAccessTokenAdapter = (
  data: KakaoAccessTokenResponseType,
): AccessTokenType => {
  return {
    accessToken: data.accessToken,
  };
};

const getGuestLoginAdapter = (
  data: GuestLoginResponseType,
): AccessTokenType => {
  return {
    accessToken: data.accessToken,
  };
};

export {
  getKakaoAccessTokenAdapter,
  getKakaoLoginUriAdapter,
  getGuestLoginAdapter,
};
