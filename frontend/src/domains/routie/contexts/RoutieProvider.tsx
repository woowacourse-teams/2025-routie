import { useCallback, useEffect, useState } from 'react';

import { useToastContext } from '@/@common/contexts/useToastContext';
import { useAsyncLock } from '@/@common/hooks/useAsyncLock';
import { useDebounceAsync } from '@/@common/hooks/useDebounceAsync';

import {
  addRoutiePlace,
  deleteRoutiePlace,
  editRoutieSequence,
  getRoutie,
} from '../apis/routie';

import { RoutieContext } from './useRoutieContext';

import type { RoutesType, RoutieType } from '../types/routie.types';

const RoutieProvider = ({ children }: { children: React.ReactNode }) => {
  const [routiePlaces, setRoutiePlaces] = useState<RoutieType[]>([]);
  const [routes, setRoutes] = useState<RoutesType[]>([]);
  const routieIdList = routiePlaces.map((routie) => routie.placeId);

  const { showToast } = useToastContext();

  const { runWithLock: runAddWithLock } = useAsyncLock();
  const { runWithLock: runDeleteWithLock } = useAsyncLock();

  const sortBySequence = (a: RoutieType, b: RoutieType) =>
    a.sequence - b.sequence;

  const refetchRoutieData = useCallback(async () => {
    try {
      const routies = await getRoutie();
      const sortedPlaces = [...routies.routiePlaces].sort(sortBySequence);
      setRoutiePlaces(sortedPlaces);
      setRoutes(routies.routes);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        showToast({
          message: error.message,
          type: 'error',
        });
      }
    }
  }, [showToast]);

  const debouncedRefetchRoutieData = useDebounceAsync(refetchRoutieData, 300);

  const handleAddRoutie = useCallback(
    async (id: number) => {
      return runAddWithLock(async () => {
        try {
          await addRoutiePlace({ placeId: id });
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
          await deleteRoutiePlace({ placeId: id });
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
        await editRoutieSequence({ routiePlaces: sortedList });
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
  }, [debouncedRefetchRoutieData]);

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

export default RoutieProvider;
