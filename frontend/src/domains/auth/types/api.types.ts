interface kakaoLoginUriResponseType {
  uri: string;
}

interface kakaoAccessTokenRequestType {
  code: string;
  provider: string;
}

interface kakaoAccessTokenResponseType {
  accessToken: string;
}

export type {
  kakaoLoginUriResponseType,
  kakaoAccessTokenRequestType,
  kakaoAccessTokenResponseType,
};
