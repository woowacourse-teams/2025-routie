import { apiClient } from '@/apis';

import { Routie, validationResultResponseType } from '../types/routie.types';

export const getRoutie = async () => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const response = await apiClient.get(
    `/routie-spaces/${routieSpaceUuid}/routie`,
  );

  if (!response.ok) {
    throw new Error('전체 루티 조회 실패');
  }

  const data = await response.json();

  return data;
};

export const editRoutieSequence = async (routiePlaces: Routie[]) => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  await apiClient.patch(`/routie-spaces/${routieSpaceUuid}/routie`, {
    routiePlaces,
  });
};

export const getDetailPlace = async (id: number) => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const response = await apiClient.get(
    `/routie-spaces/${routieSpaceUuid}/places/${id}`,
  );

  if (!response.ok) {
    throw new Error('루티 상세 조회 실패');
  }

  const data = await response.json();

  return data;
};

export const getRoutieValidation = async (time: {
  startDateTime: string;
  endDateTime: string;
}): Promise<validationResultResponseType> => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const response = await apiClient.get(
    `/routie-spaces/${routieSpaceUuid}/routie/validation?startDateTime=${time.startDateTime}&endDateTime=${time.endDateTime}`,
  );

  if (!response.ok) {
    throw new Error('일정 검증 실패');
  }

  const data = await response.json();

  return data;
};

export const addRoutiePlace = async (placeId: number) => {
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

  if (!response.ok) {
    throw new Error('루티에 장소 추가 실패');
  }

  const data = await response.json();

  return data;
};

export const deleteRoutiePlace = async (placeId: number) => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const response = await apiClient.delete(
    `/routie-spaces/${routieSpaceUuid}/routie/places/${placeId}`,
  );
  if (!response.ok) {
    throw new Error('루티에 장소 제거 실패');
  }
};
