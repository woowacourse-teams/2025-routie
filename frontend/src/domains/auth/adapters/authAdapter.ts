import type {
  KakaoAccessTokenResponseType,
  KakaoLoginUriResponseType,
} from '../types/api.types';
import type {
  KakaoAccessTokenType,
  KakaoLoginUriType,
} from '../types/auth.types';

const getKakaoLoginUriAdapter = (
  data: KakaoLoginUriResponseType,
): KakaoLoginUriType => {
  return {
    uri: data.uri,
  };
};

const getKakaoAccessTokenAdapter = (
  data: KakaoAccessTokenResponseType,
): KakaoAccessTokenType => {
  return {
    accessToken: data.accessToken,
  };
};

export { getKakaoAccessTokenAdapter, getKakaoLoginUriAdapter };
