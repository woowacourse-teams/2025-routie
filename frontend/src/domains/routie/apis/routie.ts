import { apiClient } from '@/apis';

import { Routie } from '../types/routie.types';

export const getRoutieId = async () => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const response = await apiClient.get(
    `/routie-spaces/${routieSpaceUuid}/routies`,
  );

  if (!response.ok) {
    throw new Error('전체 루티 조회 실패');
  }

  const data = await response.json();

  return data.routies[0].id;
};

export const getDetailRoutie = async () => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');
  const routieId = localStorage.getItem('routieId');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  if (!routieId) {
    throw new Error('루티 id가 없습니다.');
  }

  const response = await apiClient.get(`/routies/${routieId}`);

  if (!response.ok) {
    throw new Error('루티 상세 조회 실패');
  }

  const data = await response.json();

  return data;
};

export const editRoutieSequence = async (routiePlaces: Routie[]) => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');
  const routieId = localStorage.getItem('routieId');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  await apiClient.patch(`/routies/${routieId}`, {
    routieId,
    routiePlaces,
  });
};

export const getDetailPlace = async (id: number) => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const response = await apiClient.get(`/places/${id}`);

  if (!response.ok) {
    throw new Error('루티 상세 조회 실패');
  }

  const data = await response.json();

  return data;
};
