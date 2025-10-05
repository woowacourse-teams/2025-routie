import { useCallback, useEffect } from 'react';

import { useToastContext } from '@/@common/contexts/useToastContext';
import { useAsyncLock } from '@/@common/hooks/useAsyncLock';
import { useRequireAccessToken } from '@/@common/hooks/useRequireAccessToken';
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
  const requireAccessToken = useRequireAccessToken();
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
      const accessToken = requireAccessToken();

      if (!accessToken) return;

      postLikePlace({ placeId });
    },
    [postLikePlace, requireAccessToken],
  );

  const handleUnlikePlace = useCallback(
    (placeId: number) => {
      const accessToken = requireAccessToken();

      if (!accessToken) return;

      deleteLikePlace({ placeId });
    },
    [deleteLikePlace, requireAccessToken],
  );

  useEffect(() => {
    if (error) {
      console.error(error);
      showToast({
        message: error.message,
        type: 'error',
      });
    }
  }, [error, showToast]);

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
