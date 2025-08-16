import { ValidationApiResponse } from '../types/api.types';
import {
  validationErrorCodeType,
  RoutieValidationResponseType,
} from '../types/routie.types';

export const adaptValidationResponse = (
  apiResponse: ValidationApiResponse,
): RoutieValidationResponseType => {
  return {
    validationResultResponses: apiResponse.validationResultResponses.map(
      (response) => ({
        validationCode: response.validationCode as validationErrorCodeType,
        isValid: response.isValid,
        invalidRoutiePlaces: response.invalidRoutiePlaces.map((place) => ({
          routiePlaceId: place.routiePlaceId,
        })),
      }),
    ),
  };
};
