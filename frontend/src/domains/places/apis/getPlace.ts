import { apiClient } from '@/apis';

const getPlace = async (placeId: number) => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const response = await apiClient.get(
    `/routie-spaces/${routieSpaceUuid}/places/${placeId}`,
  );
  if (!response.ok) {
    throw new Error(`${placeId}: 장소 조회에 실패하였습니다.`);
  }

  const data = await response.json();

  return data;
};

export default getPlace;
