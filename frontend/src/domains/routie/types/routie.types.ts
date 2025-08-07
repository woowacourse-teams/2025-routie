import { VALIDATION_RESULT_CODE } from '../constants/routieValidation';

export type RoutiePlaces = {
  routiePlaces: {
    id: number;
    sequence: number;
    placeId: number;
  }[];
  routes: {
    fromSequence: number;
    toSequence: number;
    movingStrategy: string;
    duration: number;
    distance: number;
  };
};

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

export type RoutiePlace = {
  id: number;
  name: string;
  address: string;
  stayDurationMinutes: number;
  openAt: string;
  closeAt: string;
  breakStartAt: string;
  breakEndAt: string;
  closedDayOfWeeks: string[];
};

export type validationErrorCodeType = keyof typeof VALIDATION_RESULT_CODE;

export type ValidationStatus =
  | 'inactive'
  | 'waiting'
  | 'validating'
  | 'success'
  | 'error';

export type WaitingReason = 'no_time' | 'insufficient_places' | null;

type InvalidRoutiePlace = {
  routiePlaceId: number;
};

type ValidationResultResponse = {
  validationCode: validationErrorCodeType;
  isValid: boolean;
  invalidRoutiePlaces: InvalidRoutiePlace[];
};

export type validationResultResponseType = {
  validationResultResponses: ValidationResultResponse[];
};
