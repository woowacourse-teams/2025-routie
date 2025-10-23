import type {
  CreateRoutieResponseType,
  EditRoutieSpaceNameResponseType,
  GetRoutieSpaceListResponseType,
  GetRoutieSpaceResponseType,
} from '@/domains/routieSpace/types/api.types';
import type {
  CreateRoutieSpaceAdapterType,
  GetRoutieSpaceListAdapterType,
  RoutieSpaceAdapterType,
  RoutieSpaceNameType,
} from '@/domains/routieSpace/types/routieSpace.types';

const createRoutieSpaceAdapter = (
  data: CreateRoutieResponseType,
): CreateRoutieSpaceAdapterType => {
  return {
    routieSpaceUuid: data.routieSpaceIdentifier,
  };
};

const routieSpaceAdapter = (
  data: GetRoutieSpaceResponseType,
): RoutieSpaceAdapterType => {
  return {
    name: data.name,
  };
};

const editRoutieSpaceNameAdapter = (
  data: EditRoutieSpaceNameResponseType,
): { name: RoutieSpaceNameType } => {
  return {
    name: data.name,
  };
};

const getRoutieSpaceListAdapter = (
  data: GetRoutieSpaceListResponseType,
): GetRoutieSpaceListAdapterType[] => {
  return data.routieSpaces.map((item) => {
    return {
      routieSpaceUuid: item.identifier,
      name: item.name,
      date: new Date(item.createdTime),
    };
  });
};

export {
  createRoutieSpaceAdapter,
  routieSpaceAdapter,
  editRoutieSpaceNameAdapter,
  getRoutieSpaceListAdapter,
};
