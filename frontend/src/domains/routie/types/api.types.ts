export type ValidationResultApiResponse = {
  validationCode: string;
  isValid: boolean;
  invalidRoutiePlaces: {
    routiePlaceId: number;
  }[];
};

export type ValidationApiResponse = {
  validationResultResponses: ValidationResultApiResponse[];
};