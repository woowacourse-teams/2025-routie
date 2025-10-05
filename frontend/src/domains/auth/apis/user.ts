import { apiClient } from '@/apis';
import { getUserAdapter } from '@/domains/auth/adapters/getUserAdapter';

const getUser = async () => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    throw new Error('접근 권한이 없습니다. 로그인 후 이용해주세요.');
  }

  const response = await apiClient.get('/v1/participants/me', undefined, {
    Authorization: `Bearer ${token}`,
  });

  const data = await response.json();
  const adaptedUser = getUserAdapter(data);

  localStorage.setItem('role', adaptedUser.role);

  return adaptedUser;
};

export { getUser };
