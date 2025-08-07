import { useCallback, useState } from 'react';

import { getRoutieValidation } from '../apis/routie';
import { validationErrorCodeType } from '../types/routie.types';

export interface UseRoutieValidateReturn {
  isValidateActive: boolean;
  routieTime: {
    startDateTime: string;
    endDateTime: string;
  };
  validationErrors: validationErrorCodeType | null;
  handleValidateToggle: () => void;
  handleTimeChange: (
    field: 'startDateTime' | 'endDateTime',
    value: string,
  ) => void;
  validateRoutie: (placeCount?: number) => Promise<void>;
}

const useRoutieValidate = (): UseRoutieValidateReturn => {
  const getInitialValidateActive = () => {
    const saved = sessionStorage.getItem('isValidateActive');
    return saved ? JSON.parse(saved) : true;
  };

  const [isValidateActive, setIsValidateActive] = useState(
    getInitialValidateActive,
  );
  const [routieTime, setRoutieTime] = useState({
    startDateTime: '',
    endDateTime: '',
  });
  const [validationErrors, setValidationErrors] =
    useState<validationErrorCodeType | null>(null);

  const canValidateRoutie = useCallback(
    (placeCount?: number) => {
      return (
        isValidateActive &&
        routieTime.startDateTime !== '' &&
        routieTime.endDateTime !== '' &&
        (placeCount !== undefined ? placeCount > 1 : false)
      );
    },
    [isValidateActive, routieTime],
  );

  const handleValidateToggle = useCallback(() => {
    const newIsValidateActive = !isValidateActive;
    sessionStorage.setItem(
      'isValidateActive',
      JSON.stringify(newIsValidateActive),
    );
    setIsValidateActive(newIsValidateActive);
  }, [isValidateActive]);

  const handleTimeChange = useCallback((field: string, value: string) => {
    setRoutieTime((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const validateRoutie = useCallback(
    async (placeCount?: number) => {
      if (!canValidateRoutie(placeCount)) {
        return;
      }

      try {
        const response = await getRoutieValidation(routieTime);
        const invalidResult = response.validationResultResponses.find(
          (result) => result.isValid === false,
        );

        if (invalidResult) {
          setValidationErrors(invalidResult.validationCode);
          return;
        }

        setValidationErrors(null);
      } catch (error) {
        console.error(error);
      }
    },
    [canValidateRoutie, routieTime],
  );

  return {
    isValidateActive,
    routieTime,
    validationErrors,
    handleValidateToggle,
    handleTimeChange,
    validateRoutie,
  };
};

export default useRoutieValidate;
