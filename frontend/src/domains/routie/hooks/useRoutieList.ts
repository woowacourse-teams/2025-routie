import { useCallback, useEffect, useMemo } from 'react';

import { useToastContext } from '@/@common/contexts/useToastContext';
import { useAccessTokenGuard } from '@/@common/hooks/useAccessTokenGuard';
import { useAsyncLock } from '@/@common/hooks/useAsyncLock';
import {
  useAddRoutieQuery,
  useChangeRoutieQuery,
  useDeleteRoutieQuery,
  useRoutieQuery,
} from '@/domains/routie/queries/useRoutieQuery';
import { RoutieType } from '@/domains/routie/types/routie.types';
import { useGoogleEventTrigger } from '@/libs/googleAnalytics/hooks/useGoogleEventTrigger';

const useRoutieList = () => {
  const { data: routie, error } = useRoutieQuery({ enabled: false });
  const { mutateAsync: addRoutie } = useAddRoutieQuery();
  const { mutateAsync: deleteRoutie } = useDeleteRoutieQuery();
  const { mutateAsync: changeRoutie } = useChangeRoutieQuery();
  const { runWithLock: runAddWithLock } = useAsyncLock();
  const { runWithLock: runDeleteWithLock } = useAsyncLock();
  const { runWithLock: runChangeWithLock } = useAsyncLock();
  const { showToast } = useToastContext();
  const { triggerEvent } = useGoogleEventTrigger();
  const requireAccessToken = useAccessTokenGuard();
  const routieIdList = useMemo(
    () => routie.routiePlaces.map((routiePlace) => routiePlace.placeId),
    [routie.routiePlaces],
  );

  const handleAddRoutie = useCallback(
    async (placeId: number) => {
      return await runAddWithLock(async () => {
        const accessToken = requireAccessToken();

        if (!accessToken) return;

        await addRoutie({ placeId });
        triggerEvent({
          action: 'click',
          category: 'routie',
          label: '루티에 장소 추가하기 버튼',
        });
      });
    },
    [addRoutie],
  );

  const organizeRoutie = (routiePlaces: RoutieType[]) => {
    return routiePlaces
      .map((place, index) => {
        return { ...place, sequence: index + 1 };
      })
      .sort((a, b) => a.sequence - b.sequence);
  };

  const handleChangeRoutie = useCallback(
    async (routiePlaces: RoutieType[]) => {
      return await runChangeWithLock(async () => {
        const accessToken = requireAccessToken();

        if (!accessToken) return;

        await changeRoutie(organizeRoutie(routiePlaces));
      });
    },
    [changeRoutie],
  );

  const handleDeleteRoutie = useCallback(
    async (placeId: number) => {
      return await runDeleteWithLock(async () => {
        const accessToken = requireAccessToken();

        if (!accessToken) return;

        await deleteRoutie({ placeId });
        triggerEvent({
          action: 'click',
          category: 'place',
          label: '루티 삭제하기 버튼',
        });
      });
    },
    [deleteRoutie],
  );

  useEffect(() => {
    if (error) {
      console.error(error);
      showToast({
        message: error.message,
        type: 'error',
      });
    }
  }, [error]);

  return {
    routiePlaces: routie.routiePlaces,
    routieIdList,
    handleAddRoutie,
    handleChangeRoutie,
    handleDeleteRoutie,
  };
};

export { useRoutieList };
