import { useCallback, useState, useEffect, useMemo } from 'react';

import { useSessionStorage } from '@/@common/hooks/useSessionStorage';
import { getCombineDateTime } from '@/@common/utils/format';

import { getRoutieValidation } from '../apis/routie';
import {
  validationErrorCodeType,
  ValidationStatus,
  WaitingReason,
} from '../types/routie.types';

export interface UseRoutieValidateReturn {
  isValidateActive: boolean;
  routieTime: {
    date: string;
    startTime: string;
    endTime: string;
  };
  validationErrors: validationErrorCodeType | null;
  validationStatus: ValidationStatus;
  waitingReason: WaitingReason;
  handleValidateToggle: () => void;
  handleTimeChange: (
    field: 'date' | 'startTime' | 'endTime',
    value: string,
  ) => void;
  validateRoutie: (
    movingStrategy: string,
    placeCount?: number,
  ) => Promise<void>;
  combineDateTime: {
    startDateTime: string;
    endDateTime: string;
  };
}

const useRoutieValidate = (): UseRoutieValidateReturn => {
  const [isValidateActive, setIsValidateActive] = useSessionStorage(
    'isValidateActive',
    true,
  );
  const [routieTime, setRoutieTime] = useSessionStorage(
    'routieTime',
    {
      date: '',
      startTime: '',
      endTime: '',
    },
  );
  const [validationErrors, setValidationErrors] =
    useState<validationErrorCodeType | null>(null);
  const [validationStatus, setValidationStatus] =
    useState<ValidationStatus>('inactive');

  const getValidationConditions = useCallback(
    (placeCount?: number) => {
      if (!isValidateActive) {
        return { canValidate: false, waitingReason: null };
      }

      if (
        routieTime.date === '' ||
        routieTime.startTime === '' ||
        routieTime.endTime === ''
      ) {
        return {
          canValidate: false,
          waitingReason: 'no_time' as WaitingReason,
        };
      }

      if (placeCount === undefined || placeCount < 2) {
        return {
          canValidate: false,
          waitingReason: 'insufficient_places' as WaitingReason,
        };
      }

      return { canValidate: true, waitingReason: null };
    },
    [isValidateActive, routieTime],
  );

  const waitingReason = useMemo(
    () => getValidationConditions().waitingReason,
    [isValidateActive, routieTime],
  );

  const updateValidationStatus = useCallback(
    (placeCount?: number) => {
      const { canValidate, waitingReason } =
        getValidationConditions(placeCount);

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
    setIsValidateActive(!isValidateActive);
  }, [isValidateActive, setIsValidateActive]);

  const combineDateTime = useMemo(() => {
    return getCombineDateTime(routieTime);
  }, [routieTime]);

  useEffect(() => {
    updateValidationStatus();
  }, [isValidateActive, routieTime, updateValidationStatus]);

  const handleTimeChange = useCallback(
    (field: string, value: string) => {
      setRoutieTime({
        ...routieTime,
        [field]: value,
      });
    },
    [routieTime, setRoutieTime],
  );

  const validateRoutie = useCallback(
    async (movingStrategy: string, placeCount?: number) => {
      const { canValidate } = getValidationConditions(placeCount);

      if (!canValidate) {
        updateValidationStatus(placeCount);
        return;
      }

      setValidationStatus('validating');

      try {
        const response = await getRoutieValidation(
          combineDateTime,
          movingStrategy,
        );

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
    [getValidationConditions, updateValidationStatus, combineDateTime],
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
    combineDateTime,
  };
};

export default useRoutieValidate;
