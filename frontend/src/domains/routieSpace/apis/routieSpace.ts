import { apiClient } from '@/apis';

import type {
  CreateRoutieResponseType,
  GetRoutieSpaceResponseType,
  EditRoutieSpaceNameRequestType,
  EditRoutieSpaceNameResponseType,
} from '../types/api.types';

const createRoutieSpace = async (): Promise<CreateRoutieResponseType> => {
  const response = await apiClient.post('/routie-spaces');

  const data = await response.json();

  if (!data) {
    throw new Error('루티 스페이스 생성에 실패했습니다.');
  }

  return data;
};

const getRoutieSpace = async (): Promise<GetRoutieSpaceResponseType> => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const response = await apiClient.get(`/routie-spaces/${routieSpaceUuid}`);

  const data = await response.json();

  return data;
};

const editRoutieSpaceName = async ({
  name,
}: EditRoutieSpaceNameRequestType): Promise<EditRoutieSpaceNameResponseType> => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const response = await apiClient.patch(`/routie-spaces/${routieSpaceUuid}`, {
    name,
  });

  const data = await response.json();

  return data;
};

export { createRoutieSpace, getRoutieSpace, editRoutieSpaceName };
