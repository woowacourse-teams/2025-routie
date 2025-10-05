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

type UserRole = 'USER' | 'GUEST';

interface UserResponseType {
  role: UserRole;
  nickname: string;
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
  UserResponseType,
  UserRole,
  GuestLoginRequestType,
  GuestLoginResponseType,
};
