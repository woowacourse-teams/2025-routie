import { apiClient } from '@/apis';

import { PlaceFetchType } from '../types/place.types';

const getPlaceList = async (): Promise<PlaceFetchType[]> => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const response = await apiClient.get(
    `/routie-spaces/${routieSpaceUuid}/places`,
  );

  const data = await response.json();

  return data.places;
};

export default getPlaceList;
