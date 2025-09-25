import type {
  kakaoAccessTokenResponseType,
  kakaoLoginUriResponseType,
} from '../types/api.types';
import type {
  kakaoAccessTokenType,
  kakaoLoginUriType,
} from '../types/auth.types';

const getKakaoLoginUriAdapter = (
  data: kakaoLoginUriResponseType,
): kakaoLoginUriType => {
  return {
    uri: data.uri,
  };
};

const getKakaoAccessTokenAdapter = (
  data: kakaoAccessTokenResponseType,
): kakaoAccessTokenType => {
  return {
    accessToken: data.accessToken,
  };
};

export { getKakaoAccessTokenAdapter, getKakaoLoginUriAdapter };
