import { apiClient } from '@/apis';

import { PlaceBaseType } from '../types/place.types';

const getPlace = async (placeId: number): Promise<PlaceBaseType> => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const response = await apiClient.get(
    `/routie-spaces/${routieSpaceUuid}/places/${placeId}`,
  );

  const data = await response.json();

  return data;
};

export default getPlace;
