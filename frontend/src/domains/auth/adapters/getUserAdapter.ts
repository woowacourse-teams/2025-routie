import type { UserResponseType } from '@/domains/auth/types/api.types';
import type { UserType } from '@/domains/auth/types/user.types';

const getUserAdapter = (data: UserResponseType): UserType => {
  return { nickName: data.nickname, role: data.role };
};

export { getUserAdapter };
