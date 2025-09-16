import { apiClient } from '@/apis';
import {
  getPlaceAdapter,
  getPlaceListAdapter,
  searchPlaceAdapter,
} from '@/domains/places/adapters/placeAdapter';
import type {
  AddPlaceRequestType,
  DeletePlaceRequestType,
  FetchPlaceRequestType,
  SearchPlaceRequestType,
} from '@/domains/places/types/api.types';
import type {
  PlaceAdapterType,
  PlaceListAdapterType,
  SearchPlaceAdapterType,
} from '@/domains/places/types/place.types';

export const getSpaceUuid = (): string | null =>
  typeof window !== 'undefined'
    ? localStorage.getItem('routieSpaceUuid')
    : null;

export const ensureSpaceUuid = (): string => {
  const uuid = getSpaceUuid();
  if (!uuid) throw new Error('루티 스페이스 uuid가 없습니다.');
  return uuid;
};

const addPlace = async (placeInfo: AddPlaceRequestType) => {
  const routieSpaceUuid = ensureSpaceUuid();

  const response = await apiClient.post(
    `/routie-spaces/${routieSpaceUuid}/places`,
    placeInfo,
  );

  const data = await response.json();

  return data;
};

const deletePlace = async ({ placeId }: DeletePlaceRequestType) => {
  const routieSpaceUuid = ensureSpaceUuid();

  await apiClient.delete(`/routie-spaces/${routieSpaceUuid}/places/${placeId}`);
};

const getPlace = async ({
  placeId,
}: FetchPlaceRequestType): Promise<PlaceAdapterType> => {
  const routieSpaceUuid = ensureSpaceUuid();

  const response = await apiClient.get(
    `/routie-spaces/${routieSpaceUuid}/places/${placeId}`,
  );

  const data = await response.json();

  return getPlaceAdapter(data);
};

const getPlaceList = async (): Promise<PlaceListAdapterType> => {
  const routieSpaceUuid = ensureSpaceUuid();

  const response = await apiClient.get(
    `/routie-spaces/${routieSpaceUuid}/places`,
  );

  const data = await response.json();

  return getPlaceListAdapter(data.places);
};

const searchPlace = async ({
  query,
}: SearchPlaceRequestType): Promise<SearchPlaceAdapterType> => {
  const response = await apiClient.get(
    `/places/search?query=${encodeURIComponent(query)}`,
  );

  const data = await response.json();

  return searchPlaceAdapter(data.searchedPlaces);
};

export { addPlace, deletePlace, getPlace, getPlaceList, searchPlace };
