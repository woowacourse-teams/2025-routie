import { apiClient } from '@/apis';

const getPlace = async (placeId: number) => {
  const response = await apiClient.get(`/places/${placeId}`);

  if (!response.ok) {
    throw new Error(`${placeId}: 장소 조회에 실패하였습니다.`);
  }

  const data = await response.json();

  return data;
};

export default getPlace;
