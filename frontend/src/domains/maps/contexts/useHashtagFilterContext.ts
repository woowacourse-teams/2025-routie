import { createContext, useContext } from 'react';

import type { HashtagFilterContextType } from '@/domains/maps/types/map.types';

const HashtagFilterContext = createContext<
  HashtagFilterContextType | undefined
>(undefined);

const useHashtagFilterContext = () => {
  const context = useContext(HashtagFilterContext);
  if (!context) {
    throw new Error(
      'useHashtagFilterContext must be used within HashtagFilterProvider',
    );
  }
  return context;
};

export { HashtagFilterContext, useHashtagFilterContext };
