import { useCallback, useEffect, useMemo, useState } from 'react';

import { getRoutieValidation } from '../apis/routie';

export interface UseRoutieValidateReturn {
  isValidateActive: boolean;
  routieTime: {
    startDateTime: string;
    endDateTime: string;
  };
  isValidateRoutie: boolean;
  handleValidateToggle: () => void;
  handleTimeChange: (
    field: 'startDateTime' | 'endDateTime',
    value: string,
  ) => void;
  validateRoutie: () => Promise<void>;
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
  const [isValidateRoutie, setIsValidateRoutie] = useState(false);

  const canValidateRoutie = useMemo(() => {
    return (
      isValidateActive &&
      routieTime.startDateTime !== '' &&
      routieTime.endDateTime !== ''
    );
  }, [isValidateActive, routieTime]);

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

  const validateRoutie = useCallback(async () => {
    if (!canValidateRoutie) {
      return;
    }

    try {
      const response = await getRoutieValidation(routieTime);

      setIsValidateRoutie(response.isValid);
    } catch (error) {
      console.error(error);
    }
  }, [isValidateActive, routieTime]);

  useEffect(() => {
    validateRoutie();
  }, [validateRoutie]);

  return {
    isValidateActive,
    routieTime,
    isValidateRoutie,
    handleValidateToggle,
    handleTimeChange,
    validateRoutie,
  };
};

export default useRoutieValidate;
