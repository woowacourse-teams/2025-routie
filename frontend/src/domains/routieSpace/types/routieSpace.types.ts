import { ERROR_MESSAGE } from '../constants/routieSpace';

type ERROR_CASE = keyof typeof ERROR_MESSAGE;

interface UseRoutieSpaceReturn {
  name: string;
  isEditing: boolean;
  isLoading: boolean;
  errorCase: ERROR_CASE | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleClick: () => Promise<void>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type RoutieSpaceNameType = string;

interface RoutieSpaceAdapterType {
  name: RoutieSpaceNameType;
}

interface CreateRoutieSpaceAdapterType {
  routieSpaceUuid: string;
}

interface EditRoutieSpaceNameAdapterType {
  name: RoutieSpaceNameType;
}

interface GetRoutieSpaceListAdapterType {
  routieSpaceUuid: string;
  name: RoutieSpaceNameType;
  date: Date;
}

export type {
  ERROR_CASE,
  UseRoutieSpaceReturn,
  RoutieSpaceNameType,
  RoutieSpaceAdapterType,
  CreateRoutieSpaceAdapterType,
  EditRoutieSpaceNameAdapterType,
  GetRoutieSpaceListAdapterType,
};
