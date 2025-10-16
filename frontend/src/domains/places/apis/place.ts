import { getAccessTokenOrThrow } from '@/@common/utils/getAccessTokenOrThrow';
import { apiClient } from '@/apis';
import {
  getPlaceAdapter,
  getPlaceListAdapter,
  likedPlacesAdapter,
  searchPlaceAdapter,
} from '@/domains/places/adapters/placeAdapter';
import type {
  AddPlaceRequestType,
  DeletePlaceRequestType,
  FetchPlaceRequestType,
  HashtagsResponseType,
  LikePlaceRequestType,
  SearchPlaceRequestType,
  UnlikePlaceRequestType,
  UpdatePlaceHashtagsRequestType,
} from '@/domains/places/types/api.types';
import type {
  LikedPlacesResponseAdapterType,
  PlaceAdapterType,
  PlaceListAdapterType,
  SearchPlaceAdapterType,
} from '@/domains/places/types/place.types';
import {
  ensureRoutieSpaceUuid,
  getRoutieSpaceUuid,
} from '@/domains/utils/routieSpaceUuid';

const addPlace = async (placeInfo: AddPlaceRequestType) => {
  const routieSpaceUuid = getRoutieSpaceUuid();
  ensureRoutieSpaceUuid(routieSpaceUuid);

  const response = await apiClient.post(
    `/v2/routie-spaces/${routieSpaceUuid}/places`,
    placeInfo,
  );

  const data = await response.json();

  return data;
};

const deletePlace = async ({ placeId }: DeletePlaceRequestType) => {
  const routieSpaceUuid = getRoutieSpaceUuid();
  ensureRoutieSpaceUuid(routieSpaceUuid);

  await apiClient.delete(
    `/v1/routie-spaces/${routieSpaceUuid}/places/${placeId}`,
  );
};

const getPlace = async ({
  placeId,
}: FetchPlaceRequestType): Promise<PlaceAdapterType> => {
  const routieSpaceUuid = getRoutieSpaceUuid();
  ensureRoutieSpaceUuid(routieSpaceUuid);

  const response = await apiClient.get(
    `/v1/routie-spaces/${routieSpaceUuid}/places/${placeId}`,
  );

  const data = await response.json();

  return getPlaceAdapter(data);
};

const getPlaceList = async (): Promise<PlaceListAdapterType> => {
  const routieSpaceUuid = getRoutieSpaceUuid();
  ensureRoutieSpaceUuid(routieSpaceUuid);

  const response = await apiClient.get(
    `/v2/routie-spaces/${routieSpaceUuid}/places`,
  );

  const data = await response.json();

  return getPlaceListAdapter(data.places);
};

const searchPlace = async ({
  query,
}: SearchPlaceRequestType): Promise<SearchPlaceAdapterType> => {
  const response = await apiClient.get(
    `/v1/places/search?query=${encodeURIComponent(query)}`,
  );

  const data = await response.json();

  return searchPlaceAdapter(data.searchedPlaces);
};

const postLikePlace = async ({ placeId }: LikePlaceRequestType) => {
  const routieSpaceUuid = getRoutieSpaceUuid();
  ensureRoutieSpaceUuid(routieSpaceUuid);

  const accessToken = getAccessTokenOrThrow();

  const response = await apiClient.post(
    `/v2/routie-spaces/${routieSpaceUuid}/places/${placeId}/likes`,
    null,
    {
      Authorization: `Bearer ${accessToken}`,
    },
  );

  if (!response.ok) {
    throw new Error('좋아요 요청 실패');
  }
};

const deleteLikePlace = async ({ placeId }: UnlikePlaceRequestType) => {
  const routieSpaceUuid = getRoutieSpaceUuid();
  ensureRoutieSpaceUuid(routieSpaceUuid);

  const accessToken = getAccessTokenOrThrow();

  const response = await apiClient.delete(
    `/v1/routie-spaces/${routieSpaceUuid}/places/${placeId}/likes`,
    null,
    {
      Authorization: `Bearer ${accessToken}`,
    },
  );

  if (!response.ok) {
    throw new Error('좋아요 취소 실패');
  }
};

const getLikedPlaces = async (): Promise<LikedPlacesResponseAdapterType> => {
  const routieSpaceUuid = getRoutieSpaceUuid();
  ensureRoutieSpaceUuid(routieSpaceUuid);

  const accessToken = getAccessTokenOrThrow();

  const response = await apiClient.get(
    `/v1/routie-spaces/${routieSpaceUuid}/places/likes`,
    undefined,
    {
      Authorization: `Bearer ${accessToken}`,
    },
  );

  const data = await response.json();

  return likedPlacesAdapter(data);
};

const updatePlaceHashtags = async ({
  placeId,
  hashtags,
}: UpdatePlaceHashtagsRequestType) => {
  const routieSpaceUuid = getRoutieSpaceUuid();
  ensureRoutieSpaceUuid(routieSpaceUuid);

  const response = await apiClient.put(
    `/v1/routie-spaces/${routieSpaceUuid}/places/${placeId}/hashtags`,
    { hashtags },
  );

  if (!response.ok) {
    throw new Error('해시태그 수정 실패');
  }

  return response.json();
};

const getHashtags = async (): Promise<HashtagsResponseType> => {
  const routieSpaceUuid = getRoutieSpaceUuid();
  ensureRoutieSpaceUuid(routieSpaceUuid);

  const response = await apiClient.get(
    `/v1/routie-spaces/${routieSpaceUuid}/hashtags`,
  );

  const data = await response.json();

  return data;
};

export {
  addPlace,
  deletePlace,
  getPlace,
  getPlaceList,
  searchPlace,
  postLikePlace,
  deleteLikePlace,
  getLikedPlaces,
  updatePlaceHashtags,
  getHashtags,
};
