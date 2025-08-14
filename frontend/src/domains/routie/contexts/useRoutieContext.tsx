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
  getRoutie,
} from '../apis/routie';
import { Routes, Routie } from '../types/routie.types';

import { useRoutieValidateContext } from './useRoutieValidateContext';

type RoutieContextType = {
  routiePlaces: Routie[];
  routes: Routes[];
  refetchRoutieData: () => Promise<void>;
  handleAddRoutie: (id: number) => Promise<void>;
  handleDeleteRoutie: (id: number) => Promise<void>;
  handleChangeRoutie: (sortedPlaces: Routie[]) => Promise<void>;
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
  const { isValidateActive, combineDateTime, validateRoutie } =
    useRoutieValidateContext();

  const refetchRoutieData = useCallback(async () => {
    try {
      const routies = await getRoutie(
        isValidateActive,
        combineDateTime.startDateTime,
      );
      setRoutiePlaces(routies.routiePlaces);
      setRoutes(routies.routes);
      validateRoutie(routies.routiePlaces.length);
    } catch (error) {
      console.error('루티 정보를 불러오는데 실패했습니다.', error);
    }
  }, [isValidateActive, combineDateTime.startDateTime, validateRoutie]);

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
    async (places: Routie[]) => {
      const sortedList = places
        .map((place, index) => {
          return { ...place, sequence: index + 1 };
        })
        .sort((a, b) => a.sequence - b.sequence);
      try {
        await editRoutieSequence(sortedList);
        refetchRoutieData();
      } catch (error) {
        console.error(error);
      }
    },
    [validateRoutie],
  );

  useEffect(() => {
    refetchRoutieData();
  }, [
    isValidateActive,
    combineDateTime.startDateTime,
    combineDateTime.endDateTime,
  ]);

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
