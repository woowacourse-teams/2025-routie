import { createContext, useMemo, useContext } from 'react';

import useRoutieValidate, {
  UseRoutieValidateReturn,
} from '../hooks/useRoutieValidate';

const RoutieValidateContext = createContext<UseRoutieValidateReturn>({
  isValidateActive: true,
  routieTime: {
    startDateTime: '',
    endDateTime: '',
  },
  validationErrors: null,
  validationStatus: 'waiting',
  waitingReason: null,
  handleValidateToggle: () => {},
  handleTimeChange: () => {},
  validateRoutie: async () => {},
});

export const RoutieValidateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    isValidateActive,
    routieTime,
    validationErrors,
    validationStatus,
    waitingReason,
    handleValidateToggle,
    handleTimeChange,
    validateRoutie,
  } = useRoutieValidate();

  const contextValue = useMemo(() => {
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
  }, [
    isValidateActive,
    routieTime,
    validationErrors,
    validationStatus,
    waitingReason,
    handleValidateToggle,
    handleTimeChange,
    validateRoutie,
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
