import { apiClient } from '@/apis';
import { getUserNameAdapter } from '@/domains/auth/adapters/getUserNameAdapter';

const getUserName = async () => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    throw new Error('접근 권한이 없습니다. 로그인 후 이용해주세요.');
  }

  const response = await apiClient.get('/v1/users/me', undefined, {
    Authorization: `Bearer ${token}`,
  });

  const data = await response.json();
  return getUserNameAdapter(data);
};

export { getUserName };
