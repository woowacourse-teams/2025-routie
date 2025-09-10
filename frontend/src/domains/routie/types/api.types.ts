import type { ValidationErrorCodeType } from './routie.types';

interface ValidationResultApiResponse {
  validationCode: ValidationErrorCodeType;
  isValid: boolean;
  invalidRoutiePlaces: {
    routiePlaceId: number;
  }[];
}

interface ValidationApiResponse {
  validationResultResponses: ValidationResultApiResponse[];
}

export type { ValidationApiResponse };
