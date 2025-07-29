import { useCallback, useEffect, useState } from 'react';

import { getRoutieValidation } from '../apis/routie';

const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

export const initialTime = {
  startDateTime: `${getTomorrowDate()}T10:00`,
  endDateTime: `${getTomorrowDate()}T11:00`,
};

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
  const [routieTime, setRoutieTime] = useState(initialTime);
  const [isValidateRoutie, setIsValidateRoutie] = useState(false);

  const handleValidateToggle = useCallback(() => {
    const newIsValidateActive = !isValidateActive;
    localStorage.setItem(
      'isValidateActive',
      JSON.stringify(newIsValidateActive),
    );
    setIsValidateActive(newIsValidateActive);
  }, []);

  const handleTimeChange = useCallback((field: string, value: string) => {
    setRoutieTime((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const validateRoutie = async () => {
    try {
      if (!isValidateActive) return;

      const response = await getRoutieValidation(routieTime);

      setIsValidateRoutie(response.isValid);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    validateRoutie();
  }, [isValidateActive, routieTime]);

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
