import { apiClient } from '@/apis';

import {
  getPlaceAdapter,
  getPlaceListAdapter,
  searchPlaceAdapter,
} from '../adapters/placeAdapter';

import type {
  AddPlaceRequestType,
  DeletePlaceRequestType,
  FetchPlaceRequestType,
  SearchPlaceRequestType,
} from '../types/api.types';
import type {
  PlaceAdapterType,
  PlaceListAdapterType,
  SearchPlaceAdapterType,
} from '../types/place.types';

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
}: FetchPlaceRequestType): Promise<PlaceAdapterType> => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const response = await apiClient.get(
    `/routie-spaces/${routieSpaceUuid}/places/${placeId}`,
  );

  const data = await response.json();

  return getPlaceAdapter(data);
};

const getPlaceList = async (): Promise<PlaceListAdapterType> => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const response = await apiClient.get(
    `/routie-spaces/${routieSpaceUuid}/places`,
  );

  const data = await response.json();

  return getPlaceListAdapter(data.places);
};

const searchPlace = async ({
  query,
}: SearchPlaceRequestType): Promise<SearchPlaceAdapterType> => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }
  const response = await apiClient.get(
    `/places/search?query=${encodeURIComponent(query)}`,
  );

  const data = await response.json();

  return searchPlaceAdapter(data.searchedPlaces);
};

export { addPlace, deletePlace, getPlace, getPlaceList, searchPlace };
