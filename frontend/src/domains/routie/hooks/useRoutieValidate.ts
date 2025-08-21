import { useCallback, useEffect, useMemo, useState } from 'react';

import { useToastContext } from '@/@common/contexts/useToastContext';
import { useSessionStorage } from '@/@common/hooks/useSessionStorage';
import { isTimeRangeInvalid } from '@/@common/utils/isTimeRangeInvalid ';

import { getRoutieValidation } from '../apis/routie';
import {
  InvalidRoutiePlace,
  validationErrorCodeType,
  ValidationResultType,
  ValidationStatus,
  WaitingReason,
} from '../types/routie.types';

import useRoutieTime from './useRoutieTime';

export interface UseRoutieValidateReturn {
  isValidateActive: boolean;
  routieTime: {
    date: string;
    startTime: string;
    endTime: string;
  };
  currentInvalidRoutiePlaces: InvalidRoutiePlace[];
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
  const { routieTime, handleTimeChange, combineDateTime, emptyDate } =
    useRoutieTime();
  const [invalidResult, setInvalidResult] =
    useState<ValidationResultType | null>(null);
  const [validationStatus, setValidationStatus] =
    useState<ValidationStatus>('inactive');
  const { showToast } = useToastContext();

  const getValidationConditions = useCallback(
    (placeCount?: number) => {
      if (!isValidateActive) {
        return { canValidate: false, waitingReason: null };
      }

      if (emptyDate) {
        return {
          canValidate: false,
          waitingReason: 'no_date' as WaitingReason,
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
    [isValidateActive, emptyDate],
  );

  const waitingReason = useMemo(
    () => getValidationConditions().waitingReason,
    [isValidateActive, emptyDate],
  );

  const validationErrors = useMemo(
    () => invalidResult?.validationCode ?? null,
    [invalidResult],
  );

  const currentInvalidRoutiePlaces = useMemo(
    () => invalidResult?.invalidRoutiePlaces ?? [],
    [invalidResult],
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

  const hasInvalidTimeRange = isTimeRangeInvalid(
    routieTime.startTime,
    routieTime.endTime,
  );

  const validateRoutie = useCallback(
    async (movingStrategy: string, placeCount?: number) => {
      const { canValidate } = getValidationConditions(placeCount);

      if (!canValidate) {
        updateValidationStatus(placeCount);
        return;
      }

      if (hasInvalidTimeRange) {
        setValidationStatus('error');
        showToast({
          message: '종료 시간이 시작 시간보다 빠를 수 없습니다.',
          type: 'error',
        });
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
          setInvalidResult(invalidResult);
          setValidationStatus('error');
          return;
        }

        setInvalidResult(null);
        setValidationStatus('success');
      } catch (error) {
        console.error(error);
        setValidationStatus('error');
        if (error instanceof Error) {
          showToast({
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    [
      isTimeRangeInvalid,
      getValidationConditions,
      updateValidationStatus,
      combineDateTime,
      showToast,
    ],
  );

  useEffect(() => {
    if (!isValidateActive) {
      setInvalidResult(null);
    }
  }, [isValidateActive]);

  return {
    isValidateActive,
    routieTime,
    currentInvalidRoutiePlaces,
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
