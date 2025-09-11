import { apiClient } from '@/apis';

import { PlaceAddType } from '../types/place.types';

const addPlace = async (placeInfo: PlaceAddType) => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }
  const response = await apiClient.post(
    `/routie-spaces/${routieSpaceUuid}/places`,
    placeInfo,
  );

  const data = await response.json();

  return data;
};

export default addPlace;
