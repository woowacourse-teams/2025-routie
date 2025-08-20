import { apiClient } from '@/apis';

export const createRoutieSpace = async () => {
  const response = await apiClient.post('/routie-spaces');

  const data = await response.json();
  const uuid = data.routieSpaceIdentifier;

  if (!uuid) {
    throw new Error('루티 스페이스 UUID가 응답에 없습니다.');
  }

  localStorage.setItem('routieSpaceUuid', uuid);
};
