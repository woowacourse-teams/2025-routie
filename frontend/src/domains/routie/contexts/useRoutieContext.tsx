import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import { editRoutieSequence, getRoutieId } from '../apis/routie';
import { Routes, Routie } from '../types/routie.types';

type RoutieContextType = {
  routiePlaces: Routie[];
  handleRoutieChange: (RoutieList: Routie[]) => void;
  routes: Routes[];
  refetchRoutieData: () => void;
  handleRoutieDelete: (id: number) => void;
  routieIdList: number[];
};

const RoutieContext = createContext<RoutieContextType>({
  routiePlaces: [],
  handleRoutieChange: () => {},
  handleRoutieDelete: () => {},
  routes: [],
  refetchRoutieData: async () => {},
  routieIdList: [],
});

export const RoutieProvider = ({ children }: { children: React.ReactNode }) => {
  const [routiePlaces, setRoutiePlaces] = useState<Routie[] | []>([]);
  const [routes, setRoutes] = useState<Routes[] | []>([]);
  const routieIdList = useMemo(
    () => routiePlaces.map((routie) => routie.placeId),
    [routiePlaces],
  );

  const refetchRoutieData = useCallback(async () => {
    try {
      const routies = await getRoutieId();
      setRoutiePlaces(routies.routiePlaces);
      setRoutes(routies.routes);
    } catch (error) {
      console.error('루티 정보를 불러오는데 실패했습니다.', error);
    }
  }, []);

  const handleRoutieChange = useCallback((RoutieList: Routie[]) => {
    setRoutiePlaces(RoutieList);
  }, []);

  const handleRoutieDelete = useCallback(
    (id: number) => {
      const next = routiePlaces.filter((item) => item.placeId !== id);
      editRoutieSequence(next);
      handleRoutieChange(next);
    },
    [routiePlaces],
  );

  useEffect(() => {
    refetchRoutieData();
  }, []);

  return (
    <RoutieContext.Provider
      value={{
        routiePlaces,
        routieIdList,
        routes,
        handleRoutieChange,
        refetchRoutieData,
        handleRoutieDelete,
      }}
    >
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
