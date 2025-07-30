import { useCallback, useEffect, useState } from 'react';

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
    const saved = localStorage.getItem('isValidateActive');
    return saved ? JSON.parse(saved) : false;
  };

  const [isValidateActive, setIsValidateActive] = useState(
    getInitialValidateActive,
  );
  const [routieTime, setRoutieTime] = useState({
    startDateTime: '',
    endDateTime: '',
  });
  const [isValidateRoutie, setIsValidateRoutie] = useState(false);

  const handleValidateToggle = useCallback(() => {
    const newIsValidateActive = !isValidateActive;
    localStorage.setItem(
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
    try {
      if (!isValidateActive) return;

      const response = await getRoutieValidation(routieTime);

      setIsValidateRoutie(response.isValid);
    } catch (error) {
      console.error(error);
    }
  }, [isValidateActive, routieTime]);

  useEffect(() => {
    if (routieTime.startDateTime === '' || routieTime.endDateTime === '')
      return;

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
