import { apiClient } from '@/apis';
import { routieAdapter } from '@/domains/routie/adapters/routieAdapter';
import type {
  AddRoutiePlaceRequestType,
  AddRoutiePlaceResponseType,
  DeleteRoutiePlaceRequestType,
  EditRoutieRequestType,
} from '@/domains/routie/types/api.types';
import type { RoutieAdapterType } from '@/domains/routie/types/routie.types';
import {
  ensureRoutieSpaceUuid,
  getRoutieSpaceUuid,
} from '@/domains/utils/routieSpaceUuid';

const getRoutie = async (): Promise<RoutieAdapterType> => {
  const routieSpaceUuid = getRoutieSpaceUuid();

  ensureRoutieSpaceUuid(routieSpaceUuid);

  const queryParams = new URLSearchParams();

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';

  const response = await apiClient.get(
    `/v1/routie-spaces/${routieSpaceUuid}/routie${query}`,
  );

  const data = await response.json();

  return routieAdapter(data);
};

const editRoutieSequence = async ({ routiePlaces }: EditRoutieRequestType) => {
  const routieSpaceUuid = getRoutieSpaceUuid();

  ensureRoutieSpaceUuid(routieSpaceUuid);

  await apiClient.patch(`/v1/routie-spaces/${routieSpaceUuid}/routie`, {
    routiePlaces,
  });
};

const addRoutiePlace = async ({
  placeId,
}: AddRoutiePlaceRequestType): Promise<AddRoutiePlaceResponseType> => {
  const routieSpaceUuid = getRoutieSpaceUuid();

  ensureRoutieSpaceUuid(routieSpaceUuid);

  const response = await apiClient.post(
    `/v1/routie-spaces/${routieSpaceUuid}/routie/places`,
    {
      placeId,
    },
  );

  const data = await response.json();

  return data;
};

const deleteRoutiePlace = async ({ placeId }: DeleteRoutiePlaceRequestType) => {
  const routieSpaceUuid = getRoutieSpaceUuid();

  ensureRoutieSpaceUuid(routieSpaceUuid);

  return await apiClient.delete(
    `/v1/routie-spaces/${routieSpaceUuid}/routie/places/${placeId}`,
  );
};

export { getRoutie, editRoutieSequence, addRoutiePlace, deleteRoutiePlace };
