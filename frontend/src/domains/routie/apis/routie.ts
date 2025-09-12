import { apiClient } from '@/apis';

import type {
  AddRoutiePlaceRequestType,
  AddRoutiePlaceResponseType,
  DeleteRoutiePlaceRequestType,
  EditRoutieRequestType,
  FetchRoutieResponseType,
} from '../types/api.types';

const getRoutie = async (): Promise<FetchRoutieResponseType> => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const queryParams = new URLSearchParams();

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';

  const response = await apiClient.get(
    `/routie-spaces/${routieSpaceUuid}/routie${query}`,
  );

  const data = await response.json();

  return data;
};

const editRoutieSequence = async ({ routiePlaces }: EditRoutieRequestType) => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  await apiClient.patch(`/routie-spaces/${routieSpaceUuid}/routie`, {
    routiePlaces,
  });
};

const addRoutiePlace = async ({
  placeId,
}: AddRoutiePlaceRequestType): Promise<AddRoutiePlaceResponseType> => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const response = await apiClient.post(
    `/routie-spaces/${routieSpaceUuid}/routie/places`,
    {
      placeId,
    },
  );

  const data = await response.json();

  return data;
};

const deleteRoutiePlace = async ({ placeId }: DeleteRoutiePlaceRequestType) => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  return await apiClient.delete(
    `/routie-spaces/${routieSpaceUuid}/routie/places/${placeId}`,
  );
};

export { getRoutie, editRoutieSequence, addRoutiePlace, deleteRoutiePlace };
