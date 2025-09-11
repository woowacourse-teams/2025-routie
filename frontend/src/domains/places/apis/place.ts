import { apiClient } from '@/apis';

import type { FormState } from '../components/PlaceFormSection/PlaceForm.types';
import type {
  PlaceAddType,
  PlaceBaseType,
  PlaceFetchType,
} from '../types/place.types';

const addPlace = async (placeInfo: FormState) => {
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

const deletePlace = async (id: number) => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  await apiClient.delete(`/routie-spaces/${routieSpaceUuid}/places/${id}`);
};

// 사용 안하고 있어서 삭제 고려 필요
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

export { addPlace, deletePlace, getPlace, getPlaceList, searchPlace };
