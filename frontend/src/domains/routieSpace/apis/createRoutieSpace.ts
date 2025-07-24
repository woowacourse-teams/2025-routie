import { apiClient } from '@/apis';

export const createRoutieSpace = async () => {
  const response = await apiClient.post('/routie-spaces');

  if (!response.ok) {
    throw new Error('루티 스페이스 생성 실패');
  }

  const uuid = response.headers.get('Location')?.split('/').pop();

  if (!uuid) return;

  localStorage.setItem('routieSpaceUuid', uuid);
};
