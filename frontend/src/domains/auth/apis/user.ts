import { getAccessTokenOrThrow } from '@/@common/utils/getAccessTokenOrThrow';
import { apiClient } from '@/apis';
import { getUserAdapter } from '@/domains/auth/adapters/getUserAdapter';

const getUser = async () => {
  const accessToken = getAccessTokenOrThrow();

  const response = await apiClient.get('/v1/participants/me', undefined, {
    Authorization: `Bearer ${accessToken}`,
  });

  const data = await response.json();
  const adaptedUser = getUserAdapter(data);

  localStorage.setItem('role', adaptedUser.role);

  return adaptedUser;
};

export { getUser };
