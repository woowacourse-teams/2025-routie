import type { ValidationErrorCodeType } from './routie.types';

export type ValidationResultApiResponse = {
  validationCode: ValidationErrorCodeType;
  isValid: boolean;
  invalidRoutiePlaces: {
    routiePlaceId: number;
  }[];
};

export type ValidationApiResponse = {
  validationResultResponses: ValidationResultApiResponse[];
};
