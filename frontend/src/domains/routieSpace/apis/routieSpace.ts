import { apiClient } from '@/apis';

import {
  createRoutieSpaceAdapter,
  editRoutieSpaceNameAdapter,
  routieSpaceAdapter,
} from '../adapters/routieSpaceAdapter';
import {
  CreateRoutieSpaceAdapterType,
  EditRoutieSpaceNameAdapterType,
  RoutieSpaceAdapterType,
} from '../types/routieSpace.types';

import type { EditRoutieSpaceNameRequestType } from '../types/api.types';

const createRoutieSpace = async (): Promise<CreateRoutieSpaceAdapterType> => {
  const response = await apiClient.post('/routie-spaces');

  const data = await response.json();

  if (!data) {
    throw new Error('루티 스페이스 생성에 실패했습니다.');
  }

  return createRoutieSpaceAdapter(data);
};

const getRoutieSpace = async (): Promise<RoutieSpaceAdapterType> => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const response = await apiClient.get(`/routie-spaces/${routieSpaceUuid}`);

  const data = await response.json();

  return routieSpaceAdapter(data);
};

const editRoutieSpaceName = async ({
  name,
}: EditRoutieSpaceNameRequestType): Promise<EditRoutieSpaceNameAdapterType> => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  const response = await apiClient.patch(`/routie-spaces/${routieSpaceUuid}`, {
    name,
  });

  const data = await response.json();

  return editRoutieSpaceNameAdapter(data);
};

export { createRoutieSpace, getRoutieSpace, editRoutieSpaceName };
