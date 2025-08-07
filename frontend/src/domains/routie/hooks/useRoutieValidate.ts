import { useCallback, useState, useEffect, useMemo } from 'react';

import { getRoutieValidation } from '../apis/routie';
import { validationErrorCodeType, ValidationStatus, WaitingReason } from '../types/routie.types';

export interface UseRoutieValidateReturn {
  isValidateActive: boolean;
  routieTime: {
    startDateTime: string;
    endDateTime: string;
  };
  validationErrors: validationErrorCodeType | null;
  validationStatus: ValidationStatus;
  waitingReason: WaitingReason;
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
  const [validationStatus, setValidationStatus] = 
    useState<ValidationStatus>('inactive');

  const getValidationConditions = useCallback(
    (placeCount?: number) => {
      if (!isValidateActive) {
        return { canValidate: false, waitingReason: null };
      }
      
      if (routieTime.startDateTime === '' || routieTime.endDateTime === '') {
        return { canValidate: false, waitingReason: 'no_time' as WaitingReason };
      }
      
      if (placeCount === undefined || placeCount < 2) {
        return { canValidate: false, waitingReason: 'insufficient_places' as WaitingReason };
      }
      
      return { canValidate: true, waitingReason: null };
    },
    [isValidateActive, routieTime],
  );

  const waitingReason = useMemo(
    () => getValidationConditions().waitingReason,
    [getValidationConditions]
  );

  const updateValidationStatus = useCallback(
    (placeCount?: number) => {
      const { canValidate, waitingReason } = getValidationConditions(placeCount);
      
      if (!isValidateActive) {
        setValidationStatus('inactive');
        return;
      }

      if (waitingReason) {
        setValidationStatus('waiting');
        return;
      }

      if (canValidate) {
        setValidationStatus(validationErrors === null ? 'success' : 'error');
      }
    },
    [getValidationConditions, isValidateActive, validationErrors],
  );

  const handleValidateToggle = useCallback(() => {
    const newIsValidateActive = !isValidateActive;
    sessionStorage.setItem(
      'isValidateActive',
      JSON.stringify(newIsValidateActive),
    );
    setIsValidateActive(newIsValidateActive);
  }, [isValidateActive]);

  useEffect(() => {
    updateValidationStatus();
  }, [isValidateActive, routieTime, updateValidationStatus]);

  const handleTimeChange = useCallback((field: string, value: string) => {
    setRoutieTime((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const validateRoutie = useCallback(
    async (placeCount?: number) => {
      const { canValidate } = getValidationConditions(placeCount);
      
      if (!canValidate) {
        updateValidationStatus(placeCount);
        return;
      }

      setValidationStatus('validating');

      try {
        const response = await getRoutieValidation(routieTime);
        const invalidResult = response.validationResultResponses.find(
          (result) => result.isValid === false,
        );

        if (invalidResult) {
          setValidationErrors(invalidResult.validationCode);
          setValidationStatus('error');
          return;
        }

        setValidationErrors(null);
        setValidationStatus('success');
      } catch (error) {
        console.error(error);
        setValidationStatus('error');
      }
    },
    [getValidationConditions, routieTime, updateValidationStatus],
  );

  return {
    isValidateActive,
    routieTime,
    validationErrors,
    validationStatus,
    waitingReason,
    handleValidateToggle,
    handleTimeChange,
    validateRoutie,
  };
};

export default useRoutieValidate;
