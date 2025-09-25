interface KakaoLoginUriResponseType {
  uri: string;
}

interface KakaoAccessTokenRequestType {
  code: string;
  provider: string;
}

interface KakaoAccessTokenResponseType {
  accessToken: string;
}

export type {
  KakaoLoginUriResponseType,
  KakaoAccessTokenRequestType,
  KakaoAccessTokenResponseType,
};
