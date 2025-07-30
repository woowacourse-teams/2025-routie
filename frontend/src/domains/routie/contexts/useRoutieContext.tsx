import {
  createContext,
  useMemo,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { getRoutieId } from '../apis/routie';
import { Routes, Routie } from '../types/routie.types';

type RoutieContextType = {
  routiePlaces: Routie[];
  setRoutiePlaces: React.Dispatch<React.SetStateAction<Routie[]>>;
  routes: Routes[];
  refetchRoutieData: () => Promise<void>;
};

const RoutieContext = createContext<RoutieContextType>({
  routiePlaces: [],
  setRoutiePlaces: () => {},
  routes: [],
  refetchRoutieData: async () => {},
});

export const RoutieProvider = ({ children }: { children: React.ReactNode }) => {
  const [routiePlaces, setRoutiePlaces] = useState<Routie[] | []>([]);
  const [routes, setRoutes] = useState<Routes[] | []>([]);

  const refetchRoutieData = useCallback(async () => {
    try {
      const routies = await getRoutieId();
      setRoutiePlaces(routies.routiePlaces);
      setRoutes(routies.routes);
    } catch (error) {
      console.error('루티 정보를 불러오는데 실패했습니다.', error);
    }
  }, []);

  useEffect(() => {
    refetchRoutieData();
  }, []);

  const contextValue = useMemo(() => {
    return {
      routiePlaces,
      setRoutiePlaces,
      routes,
      refetchRoutieData,
    };
  }, [routiePlaces, setRoutiePlaces, routes, refetchRoutieData]);

  return (
    <RoutieContext.Provider value={contextValue}>
      {children}
    </RoutieContext.Provider>
  );
};

export const useRoutieContext = () => {
  const context = useContext(RoutieContext);

  if (!context) {
    throw new Error('useRoutieContext must be used within a RoutieProvider');
  }

  return context;
};
