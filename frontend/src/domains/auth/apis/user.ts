import { apiClient } from '@/apis';
import { getUserNameAdapter } from '@/domains/auth/adapters/getUserNameAdapter';

const getUserName = async () => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    throw new Error('Access token is missing');
  }

  const response = await apiClient.get('/v1/users/me', undefined, {
    Authorization: `Bearer ${token}`,
  });

  const data = await response.json();
  return getUserNameAdapter(data);
};

export { getUserName };
