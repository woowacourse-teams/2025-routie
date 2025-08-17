import { createContext, useMemo, useContext } from 'react';

import useRoutieValidate, {
  UseRoutieValidateReturn,
} from '../hooks/useRoutieValidate';

const RoutieValidateContext = createContext<UseRoutieValidateReturn>({
  isValidateActive: true,
  routieTime: {
    date: '',
    startTime: '',
    endTime: '',
  },
  invalidRoutiePlaces: [],
  validationErrors: null,
  validationStatus: 'waiting',
  waitingReason: null,
  handleValidateToggle: () => {},
  handleTimeChange: () => {},
  validateRoutie: async () => {},
  combineDateTime: {
    startDateTime: '',
    endDateTime: '',
  },
});

export const RoutieValidateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    isValidateActive,
    routieTime,
    invalidRoutiePlaces,
    validationErrors,
    validationStatus,
    waitingReason,
    handleValidateToggle,
    handleTimeChange,
    validateRoutie,
    combineDateTime,
  } = useRoutieValidate();

  const contextValue = useMemo(() => {
    return {
      isValidateActive,
      routieTime,
      invalidRoutiePlaces,
      validationErrors,
      validationStatus,
      waitingReason,
      handleValidateToggle,
      handleTimeChange,
      validateRoutie,
      combineDateTime,
    };
  }, [
    isValidateActive,
    routieTime,
    invalidRoutiePlaces,
    validationErrors,
    validationStatus,
    waitingReason,
    handleValidateToggle,
    handleTimeChange,
    validateRoutie,
    combineDateTime,
  ]);

  return (
    <RoutieValidateContext.Provider value={contextValue}>
      {children}
    </RoutieValidateContext.Provider>
  );
};

export const useRoutieValidateContext = () => {
  const context = useContext(RoutieValidateContext);

  if (!context) {
    throw new Error(
      'useRoutieValidateContext must be used within a RoutieValidateProvider',
    );
  }

  return context;
};
