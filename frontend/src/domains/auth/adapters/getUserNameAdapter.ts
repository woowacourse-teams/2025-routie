import { UserType } from '@/domains/auth/types/user.types';

export const getUserNameAdapter = (data: UserType): string => {
  return data.nickName;
};
