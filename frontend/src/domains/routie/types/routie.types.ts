import { VALIDATION_RESULT_CODE } from '../constants/routieValidation';

export type Routes = {
  fromSequence: number;
  toSequence: number;
  duration: number;
  distance: number;
};

export type Routie = {
  id: number;
  sequence: number;
  placeId: number;
  arriveDateTime?: string;
  departureDateTime?: string;
};

interface RoutieContextType {
  routiePlaces: RoutieType[];
  routes: RoutesType[];
  refetchRoutieData: () => Promise<void>;
  handleAddRoutie: (id: number) => Promise<void>;
  handleDeleteRoutie: (id: number) => Promise<void>;
  handleChangeRoutie: (sortedPlaces: RoutieType[]) => Promise<void>;
  routieIdList: number[];
  movingStrategy: MovingStrategyType;
  setMovingStrategy: (strategy: MovingStrategyType) => void;
  fetchedStrategy: MovingStrategyType;
}


export type ValidationStatus =
  | 'inactive'
  | 'waiting'
  | 'validating'
  | 'success'
  | 'error';

export type WaitingReason = 'no_date' | 'insufficient_places' | null;

export type InvalidRoutiePlace = {
  routiePlaceId: number;
};

export type ValidationResultType = {
  validationCode: validationErrorCodeType;
  isValid: boolean;
  invalidRoutiePlaces: InvalidRoutiePlace[];
};

export type RoutieValidationResponseType = {
  validationResultResponses: ValidationResultType[];
};
