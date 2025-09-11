import { createContext, useContext } from 'react';

import type { RoutieContextType } from '../types/routie.types';

const RoutieContext = createContext<RoutieContextType>({
  routiePlaces: [],
  handleAddRoutie: async () => {},
  handleDeleteRoutie: async () => {},
  routes: [],
  handleChangeRoutie: async () => {},
  refetchRoutieData: async () => {},
  routieIdList: [],
});

const useRoutieContext = () => {
  const context = useContext(RoutieContext);

  if (!context) {
    throw new Error('useRoutieContext must be used within a RoutieProvider');
  }

  return context;
};

export { useRoutieContext, RoutieContext };
