import { ERROR_MESSAGE } from '../constants/routieSpace';

interface CreateRoutieResponseType {
  routieSpaceIdentifier: string;
}

interface GetRoutieSpaceResponseType {
  name: string;
}

interface EditRoutieSpaceNameResponseType {
  name: string;
}

type ERROR_CASE = keyof typeof ERROR_MESSAGE;

interface UseRoutieSpaceNameReturn {
  name: string;
  isEditing: boolean;
  isLoading: boolean;
  errorCase: ERROR_CASE | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleClick: () => Promise<void>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type {
  CreateRoutieResponseType,
  GetRoutieSpaceResponseType,
  EditRoutieSpaceNameResponseType,
  ERROR_CASE,
  UseRoutieSpaceNameReturn,
};
