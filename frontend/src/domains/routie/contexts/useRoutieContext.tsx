import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import {
  addRoutiePlace,
  deleteRoutiePlace,
  editRoutieSequence,
  getRoutieId,
} from '../apis/routie';
import { Routes, Routie } from '../types/routie.types';

type RoutieContextType = {
  routiePlaces: Routie[];
  routes: Routes[];
  refetchRoutieData: () => void;
  handleAddRoutie: (id: number) => void;
  handleDeleteRoutie: (id: number) => void;
  handleChangeRoutie: (sortedPlaces: Routie[]) => void;
  routieIdList: number[];
};

const RoutieContext = createContext<RoutieContextType>({
  routiePlaces: [],
  handleAddRoutie: async () => {},
  handleDeleteRoutie: async () => {},
  routes: [],
  handleChangeRoutie: async () => {},
  refetchRoutieData: async () => {},
  routieIdList: [],
});

export const RoutieProvider = ({ children }: { children: React.ReactNode }) => {
  const [routiePlaces, setRoutiePlaces] = useState<Routie[]>([]);
  const [routes, setRoutes] = useState<Routes[]>([]);
  const routieIdList = routiePlaces.map((routie) => routie.placeId);

  const refetchRoutieData = useCallback(async () => {
    try {
      const routies = await getRoutieId();
      setRoutiePlaces(routies.routiePlaces);
      setRoutes(routies.routes);
    } catch (error) {
      console.error('루티 정보를 불러오는데 실패했습니다.', error);
    }
  }, []);

  const handleAddRoutie = useCallback(
    async (id: number) => {
      try {
        await addRoutiePlace(id);
        await refetchRoutieData();
      } catch (error) {
        console.error(error);
      }
    },
    [refetchRoutieData],
  );

  const handleDeleteRoutie = useCallback(
    async (id: number) => {
      try {
        await deleteRoutiePlace(id);
        await refetchRoutieData();
      } catch (error) {
        console.error(error);
      }
    },
    [refetchRoutieData],
  );

  const handleChangeRoutie = useCallback(
    async (sortedPlaces: Routie[]) => {
      await editRoutieSequence(sortedPlaces);
      setRoutiePlaces(sortedPlaces);
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
        refetchRoutieData,
        handleAddRoutie,
        handleDeleteRoutie,
        handleChangeRoutie,
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
