import { apiClient } from '@/apis';
import {
  createRoutieSpaceAdapter,
  editRoutieSpaceNameAdapter,
  getRoutieSpaceListAdapter,
  routieSpaceAdapter,
} from '@/domains/routieSpace/adapters/routieSpaceAdapter';
import type {
  DeleteRoutieSpaceRequestType,
  EditRoutieSpaceNameRequestType,
} from '@/domains/routieSpace/types/api.types';
import type {
  CreateRoutieSpaceAdapterType,
  EditRoutieSpaceNameAdapterType,
  GetRoutieSpaceListAdapterType,
  RoutieSpaceAdapterType,
} from '@/domains/routieSpace/types/routieSpace.types';

const createRoutieSpace = async (): Promise<CreateRoutieSpaceAdapterType> => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    throw new Error('로그인이 필요합니다.');
  }

  const response = await apiClient.post('/v2/routie-spaces', null, {
    Authorization: `Bearer ${accessToken}`,
  });

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

  const response = await apiClient.get(`/v1/routie-spaces/${routieSpaceUuid}`);

  const data = await response.json();

  return routieSpaceAdapter(data);
};

const editRoutieSpaceName = async ({
  name,
}: EditRoutieSpaceNameRequestType): Promise<EditRoutieSpaceNameAdapterType> => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');
  const accessToken = localStorage.getItem('accessToken');

  if (!routieSpaceUuid) {
    throw new Error('루티 스페이스 uuid가 없습니다.');
  }

  if (!accessToken) {
    throw new Error('올바르게 로그인되지 않았습니다.');
  }

  const response = await apiClient.patch(
    `/v2/routie-spaces/${routieSpaceUuid}`,
    {
      name,
    },
    {
      Authorization: `Bearer ${accessToken}`,
    },
  );

  const data = await response.json();

  return editRoutieSpaceNameAdapter(data);
};

const getRoutieSpaceList = async (): Promise<
  GetRoutieSpaceListAdapterType[]
> => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    throw new Error('올바르게 로그인되지 않았습니다.');
  }

  const response = await apiClient.get('/v1/my-routie-spaces', undefined, {
    Authorization: `Bearer ${accessToken}`,
  });

  const data = await response.json();

  return getRoutieSpaceListAdapter(data);
};

const deleteRoutieSpace = async ({
  routieSpaceUuid,
}: DeleteRoutieSpaceRequestType): Promise<void> => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    throw new Error('올바르게 로그인되지 않았습니다.');
  }

  await apiClient.delete(`/v1/routie-spaces/${routieSpaceUuid}`, undefined, {
    Authorization: `Bearer ${accessToken}`,
  });
};

export {
  createRoutieSpace,
  deleteRoutieSpace,
  editRoutieSpaceName,
  getRoutieSpace,
  getRoutieSpaceList,
};
