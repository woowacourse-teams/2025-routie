import { VALIDATION_RESULT_CODE } from '../constants/routieValidation';

export type Routes = {
  fromSequence: number;
  toSequence: number;
  movingStrategy: 'DRIVING';
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

export type validationErrorCodeType = keyof typeof VALIDATION_RESULT_CODE;

export type ValidationStatus =
  | 'inactive'
  | 'waiting'
  | 'validating'
  | 'success'
  | 'error';

export type WaitingReason = 'no_time' | 'insufficient_places' | null;

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
