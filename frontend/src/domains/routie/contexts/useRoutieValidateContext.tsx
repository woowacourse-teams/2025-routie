import { createContext, useMemo, useContext } from 'react';

import useRoutieValidate, {
  UseRoutieValidateReturn,
} from '../hooks/useRoutieValidate';

const RoutieValidateContext = createContext<UseRoutieValidateReturn>({
  isValidateActive: false,
  routieTime: {
    startDateTime: '',
    endDateTime: '',
  },
  isValidRoutie: false,
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
    isValidRoutie,
    handleValidateToggle,
    handleTimeChange,
    validateRoutie,
  } = useRoutieValidate();

  const contextValue = useMemo(() => {
    return {
      isValidateActive,
      routieTime,
      isValidRoutie,
      handleValidateToggle,
      handleTimeChange,
      validateRoutie,
    };
  }, [
    isValidateActive,
    routieTime,
    isValidRoutie,
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
