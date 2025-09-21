import type {
  CreateRoutieResponseType,
  EditRoutieSpaceNameResponseType,
  GetRoutieSpaceResponseType,
} from '../types/api.types';
import type {
  CreateRoutieSpaceAdapterType,
  RoutieSpaceAdapterType,
  RoutieSpaceNameType,
} from '../types/routieSpace.types';

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

export {
  createRoutieSpaceAdapter,
  routieSpaceAdapter,
  editRoutieSpaceNameAdapter,
};
