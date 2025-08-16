import type { validationErrorCodeType } from './routie.types';

export type ValidationResultApiResponse = {
  validationCode: validationErrorCodeType;
  isValid: boolean;
  invalidRoutiePlaces: {
    routiePlaceId: number;
  }[];
};

export type ValidationApiResponse = {
  validationResultResponses: ValidationResultApiResponse[];
};
