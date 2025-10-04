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
  nickName: string;
}

interface GuestLoginRequestType {
  nickname: string;
  password?: string;
  routieSpaceIdentifier: string;
}

interface GuestLoginResponseType {
  accessToken: string;
}

export type {
  KakaoLoginUriResponseType,
  KakaoAccessTokenRequestType,
  KakaoAccessTokenResponseType,
  UserNameResponseType,
  GuestLoginRequestType,
  GuestLoginResponseType,
};
