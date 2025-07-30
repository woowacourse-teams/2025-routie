import { createContext, useMemo, useContext } from 'react';

import useRoutieValidate, {
  UseRoutieValidateReturn,
  initialTime,
} from '../hooks/useRoutieValidate';

const RoutieValidateContext = createContext<UseRoutieValidateReturn>({
  isValidateActive: false,
  routieTime: initialTime,
  isValidateRoutie: false,
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
    isValidateRoutie,
    handleValidateToggle,
    handleTimeChange,
    validateRoutie,
  } = useRoutieValidate();

  const contextValue = useMemo(() => {
    return {
      isValidateActive,
      routieTime,
      isValidateRoutie,
      handleValidateToggle,
      handleTimeChange,
      validateRoutie,
    };
  }, [
    isValidateActive,
    routieTime,
    isValidateRoutie,
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
