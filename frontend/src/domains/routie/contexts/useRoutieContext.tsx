import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useToastContext } from '@/@common/contexts/useToastContext';
import { useAsyncLock } from '@/@common/hooks/useAsyncLock';
import { useDebounceAsync } from '@/@common/hooks/useDebounceAsync';

import {
  addRoutiePlace,
  deleteRoutiePlace,
  editRoutieSequence,
  getRoutie,
} from '../apis/routie';
import { useMovingStrategy } from '../hooks/useMovingStrategy';

import { useRoutieValidateContext } from './useRoutieValidateContext';

import type { MovingStrategyType } from '../components/SelectMovingStrategy/SelectMovingStrategy.types';
import type {
  RoutesType,
  RoutieContextType,
  RoutieType,
} from '../types/routie.types';

const RoutieContext = createContext<RoutieContextType>({
  routiePlaces: [],
  handleAddRoutie: async () => {},
  handleDeleteRoutie: async () => {},
  routes: [],
  handleChangeRoutie: async () => {},
  refetchRoutieData: async () => {},
  routieIdList: [],
  movingStrategy: 'DRIVING',
  setMovingStrategy: () => {},
  fetchedStrategy: 'DRIVING',
});

export const RoutieProvider = ({ children }: { children: React.ReactNode }) => {
  const [routiePlaces, setRoutiePlaces] = useState<RoutieType[]>([]);
  const [routes, setRoutes] = useState<RoutesType[]>([]);
  const routieIdList = routiePlaces.map((routie) => routie.placeId);
  const { isValidateActive, combineDateTime, validateRoutie } =
    useRoutieValidateContext();
  const { movingStrategy, setMovingStrategy } = useMovingStrategy();
  const [fetchedStrategy, setFetchedStrategy] =
    useState<MovingStrategyType>(movingStrategy);
  const { showToast } = useToastContext();

  const { runWithLock: runAddWithLock } = useAsyncLock();
  const { runWithLock: runDeleteWithLock } = useAsyncLock();

  const sortBySequence = (a: RoutieType, b: RoutieType) =>
    a.sequence - b.sequence;

  const refetchRoutieData = useCallback(async () => {
    try {
      const routies = await getRoutie(
        combineDateTime.startDateTime,
        movingStrategy,
      );
      const sortedPlaces = [...routies.routiePlaces].sort(sortBySequence);
      setRoutiePlaces(sortedPlaces);
      setRoutes(routies.routes);
      await validateRoutie(movingStrategy, routies.routiePlaces.length);
      setFetchedStrategy(movingStrategy);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        showToast({
          message: error.message,
          type: 'error',
        });
      }
    }
  }, [
    isValidateActive,
    combineDateTime.startDateTime,
    validateRoutie,
    movingStrategy,
    showToast,
  ]);

  const debouncedRefetchRoutieData = useDebounceAsync(refetchRoutieData, 300);

  const handleAddRoutie = useCallback(
    async (id: number) => {
      return runAddWithLock(async () => {
        try {
          await addRoutiePlace(id);
          await refetchRoutieData();
          showToast({
            message: '내 동선에 장소가 추가되었습니다.',
            type: 'success',
          });
        } catch (error) {
          console.error(error);
          if (error instanceof Error) {
            showToast({
              message: error.message,
              type: 'error',
            });
          }
        }
      });
    },
    [refetchRoutieData, runAddWithLock, showToast],
  );

  const handleDeleteRoutie = useCallback(
    async (id: number) => {
      return runDeleteWithLock(async () => {
        try {
          await deleteRoutiePlace(id);
          await refetchRoutieData();
          showToast({
            message: '내 동선에서 장소가 삭제되었습니다.',
            type: 'success',
          });
        } catch (error) {
          console.error(error);
          if (error instanceof Error) {
            showToast({
              message: error.message,
              type: 'error',
            });
          }
        }
      });
    },
    [refetchRoutieData, showToast, runDeleteWithLock],
  );

  const handleChangeRoutie = useCallback(
    async (places: RoutieType[]) => {
      const sortedList = places
        .map((place, index) => {
          return { ...place, sequence: index + 1 };
        })
        .sort((a, b) => a.sequence - b.sequence);
      try {
        await editRoutieSequence(sortedList);
        await refetchRoutieData();
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          showToast({
            message: error.message,
            type: 'error',
          });
        }
      }
    },
    [refetchRoutieData, showToast],
  );

  useEffect(() => {
    debouncedRefetchRoutieData();
  }, [
    isValidateActive,
    movingStrategy,
    combineDateTime.startDateTime,
    combineDateTime.endDateTime,
    debouncedRefetchRoutieData,
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
        movingStrategy,
        setMovingStrategy,
        fetchedStrategy,
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
