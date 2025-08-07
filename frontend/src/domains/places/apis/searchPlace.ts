import { apiClient } from '@/apis';

const searchPlace = async (keyword: string) => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }
  const response = await apiClient.get(`/places/search?query=${keyword}`);

  if (!response.ok) {
    throw new Error('장소 검색하기에 실패하였습니다.');
  }

  const data = await response.json();

  return data.searchPlaces;
};

export default searchPlace;
