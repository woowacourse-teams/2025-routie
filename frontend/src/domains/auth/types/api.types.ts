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

interface UserNameResponseType {
  nickname: string;
}

export type {
  KakaoLoginUriResponseType,
  KakaoAccessTokenRequestType,
  KakaoAccessTokenResponseType,
  UserNameResponseType,
};
