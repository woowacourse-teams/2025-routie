import { apiClient } from '@/apis';

export const getRoutieSpaceName = async () => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const response = await apiClient.get(`/routie-spaces/${routieSpaceUuid}`);

  const data = await response.json();

  return data.name;
};

export const editRoutieSpaceName = async (name: string) => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const response = await apiClient.patch(`/routie-spaces/${routieSpaceUuid}`, {
    name,
  });

  const data = await response.json();

  return data.name;
};
