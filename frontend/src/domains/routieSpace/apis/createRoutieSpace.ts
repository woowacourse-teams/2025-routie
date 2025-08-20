import { apiClient } from '@/apis';

export const createRoutieSpace = async () => {
  const response = await apiClient.post('/routie-spaces');

  if (!response.ok) {
    throw new Error('루티 스페이스 생성 실패');
  }

  const data = await response.json();
  const uuid = data.routieSpaceIdentifier;

  if (!uuid) {
    throw new Error('루티 스페이스 UUID가 응답에 없습니다.');
  }

  return uuid;
};
