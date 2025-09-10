import { apiClient } from '@/apis';

import { adaptValidationResponse } from '../adapters/routieValidationAdapter';

import type { ValidationApiResponse } from '../types/api.types';
import type {
  RoutieType,
  RoutieValidationResponseType,
} from '../types/routie.types';

const getRoutie = async (routieTime: string, movingStrategy: string) => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const queryParams = new URLSearchParams();

  if (routieTime) {
    queryParams.append('startDateTime', routieTime);
  }

  if (movingStrategy) {
    queryParams.append('movingStrategy', movingStrategy);
  }

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';

  const response = await apiClient.get(
    `/routie-spaces/${routieSpaceUuid}/routie${query}`,
  );

  const data = await response.json();

  return data;
};

const editRoutieSequence = async (routiePlaces: RoutieType[]) => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  await apiClient.patch(`/routie-spaces/${routieSpaceUuid}/routie`, {
    routiePlaces,
  });
};

const getDetailPlace = async (id: number) => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const response = await apiClient.get(
    `/routie-spaces/${routieSpaceUuid}/places/${id}`,
  );

  const data = await response.json();

  return data;
};

const getRoutieValidation = async (
  time: {
    startDateTime: string;
    endDateTime: string;
  },
  movingStrategy: string,
): Promise<RoutieValidationResponseType> => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const response = await apiClient.get(
    `/routie-spaces/${routieSpaceUuid}/routie/validation?startDateTime=${time.startDateTime}&endDateTime=${time.endDateTime}&movingStrategy=${movingStrategy}`,
  );

  const data: ValidationApiResponse = await response.json();

  return adaptValidationResponse(data);
};

const addRoutiePlace = async (placeId: number) => {
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

const deleteRoutiePlace = async (placeId: number) => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  return await apiClient.delete(
    `/routie-spaces/${routieSpaceUuid}/routie/places/${placeId}`,
  );
};

export {
  getRoutie,
  editRoutieSequence,
  getDetailPlace,
  getRoutieValidation,
  addRoutiePlace,
  deleteRoutiePlace,
};
