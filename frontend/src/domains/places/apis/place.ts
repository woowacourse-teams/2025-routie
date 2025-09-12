import { apiClient } from '@/apis';

import type {
  AddPlaceRequestType,
  SearchPlaceRequestType,
  FetchPlaceRequestType,
  FetchPlaceResponseType,
  DeletePlaceRequestType,
  FetchPlaceListResponseType,
  SearchPlaceResponseType,
} from '../types/api.types';

const addPlace = async (placeInfo: AddPlaceRequestType) => {
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

const deletePlace = async ({ placeId }: DeletePlaceRequestType) => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  await apiClient.delete(`/routie-spaces/${routieSpaceUuid}/places/${placeId}`);
};

const getPlace = async ({
  placeId,
}: FetchPlaceRequestType): Promise<FetchPlaceResponseType> => {
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

const getPlaceList = async (): Promise<FetchPlaceListResponseType[]> => {
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

const searchPlace = async ({
  query,
}: SearchPlaceRequestType): Promise<SearchPlaceResponseType[]> => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }
  const response = await apiClient.get(
    `/places/search?query=${encodeURIComponent(query)}`,
  );

  const data = await response.json();

  return data.searchedPlaces;
};

export { addPlace, deletePlace, getPlace, getPlaceList, searchPlace };
