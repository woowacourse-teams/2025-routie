import { apiClient } from '@/apis';

import { PlaceCardProps } from '../components/PlaceCard/PlaceCard';

const getPlaceList = async () => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const response = await apiClient.get(
    `/routie-spaces/${routieSpaceUuid}/places`,
  );

  if (!response.ok) {
    throw new Error('장소 목록 조회 실패');
  }

  const data = await response.json();

  return data.places as PlaceCardProps[];
};

export default getPlaceList;
