import { apiClient } from '@/apis';

import { PlaceAddType } from '../types/place.types';

const searchPlace = async (keyword: string): Promise<PlaceAddType[]> => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }
  const response = await apiClient.get(
    `/places/search?query=${encodeURIComponent(keyword)}`,
  );

  const data = await response.json();

  return data.searchedPlaces;
};

export default searchPlace;
