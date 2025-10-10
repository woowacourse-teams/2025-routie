import type { UserNameResponseType } from '@/domains/auth/types/api.types';
import type { UserType } from '@/domains/auth/types/user.types';

export const getUserNameAdapter = (data: UserNameResponseType): UserType => {
  return { nickname: data.nickname };
};
