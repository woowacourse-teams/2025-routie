import { useCallback, useEffect } from 'react';

import { useToastContext } from '@/@common/contexts/useToastContext';
import { useAsyncLock } from '@/@common/hooks/useAsyncLock';
import {
  useAddPlaceQuery,
  useDeletePlaceQuery,
  useLikePlaceMutation,
  usePlaceListQuery,
  useUnlikePlaceMutation,
} from '@/domains/places/queries/usePlaceQuery';
import type { SearchedPlaceType } from '@/domains/places/types/place.types';
import { useGoogleEventTrigger } from '@/libs/googleAnalytics/hooks/useGoogleEventTrigger';

const usePlaceList = () => {
  const { data: placeList, error } = usePlaceListQuery();
  const { mutateAsync: addPlace, data: addedPlaceId } = useAddPlaceQuery();
  const { mutateAsync: deletePlace } = useDeletePlaceQuery();
  const { mutate: postLikePlace } = useLikePlaceMutation();
  const { mutate: deleteLikePlace } = useUnlikePlaceMutation();
  const { showToast } = useToastContext();
  const { runWithLock: runDeleteWithLock } = useAsyncLock();
  const { runWithLock: runAddWithLock } = useAsyncLock();
  const { triggerEvent } = useGoogleEventTrigger();

  const handleAddPlace = useCallback(
    async (addPlaceInfo: SearchedPlaceType) => {
      const result = await runAddWithLock(async () => {
        await addPlace(addPlaceInfo);
      });
      return result;
    },
    [addPlace],
  );

  const handleDeletePlace = useCallback(
    async (placeId: number) => {
      return runDeleteWithLock(async () => {
        await deletePlace(placeId);
        triggerEvent({
          action: 'click',
          category: 'place',
          label: '장소 삭제하기 버튼',
        });
      });
    },
    [deletePlace],
  );

  const handleLikePlace = useCallback(
    (placeId: number) => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        showToast({
          message: '로그인이 필요합니다.',
          type: 'error',
        });
        return;
      }

      postLikePlace({ placeId });
    },
    [postLikePlace, showToast],
  );

  const handleUnlikePlace = useCallback(
    (placeId: number) => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        showToast({
          message: '로그인이 필요합니다.',
          type: 'error',
        });
        return;
      }

      deleteLikePlace({ placeId });
    },
    [deleteLikePlace, showToast],
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
    placeList,
    handleAddPlace,
    addedPlaceId,
    handleDeletePlace,
    handleLikePlace,
    handleUnlikePlace,
  };
};

export { usePlaceList };
