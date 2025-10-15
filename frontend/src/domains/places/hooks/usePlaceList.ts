import { useCallback, useEffect } from 'react';

import { useToastContext } from '@/@common/contexts/useToastContext';
import { useAsyncLock } from '@/@common/hooks/useAsyncLock';
import {
  useAddPlaceQuery,
  useDeletePlaceQuery,
  usePlaceListQuery,
  useUpdatePlaceHashtagsMutation,
} from '@/domains/places/queries/usePlaceQuery';
import type { SearchedPlaceType } from '@/domains/places/types/place.types';
import { useGoogleEventTrigger } from '@/libs/googleAnalytics/hooks/useGoogleEventTrigger';

const usePlaceList = () => {
  const { data: placeList, error } = usePlaceListQuery();
  const { mutateAsync: addPlace, data: addedPlaceId } = useAddPlaceQuery();
  const { triggerEvent } = useGoogleEventTrigger();
  const { mutateAsync: deletePlace } = useDeletePlaceQuery(() => {
    triggerEvent({
      action: 'click',
      category: 'place',
      label: '장소 삭제하기 버튼',
    });
  });
  const { mutateAsync: updatePlaceHashtags } = useUpdatePlaceHashtagsMutation();
  const { showToast } = useToastContext();
  const { runWithLock: runDeleteWithLock } = useAsyncLock();
  const { runWithLock: runAddWithLock } = useAsyncLock();
  const { runWithLock: runUpdateWithLock } = useAsyncLock();

  const handleAddPlace = useCallback(
    async (addPlaceInfo: SearchedPlaceType) => {
      const result = await runAddWithLock(async () => {
        addPlace(addPlaceInfo);
      });
      return result;
    },
    [addPlace, runAddWithLock],
  );

  const handleDeletePlace = useCallback(
    async (placeId: number) => {
      return runDeleteWithLock(async () => {
        deletePlace(placeId);
      });
    },
    [deletePlace, runDeleteWithLock],
  );

  const handleUpdatePlaceHashtags = useCallback(
    async (placeId: number, hashtags: string[]) => {
      return runUpdateWithLock(async () => {
        updatePlaceHashtags({ placeId, hashtags });
      });
    },
    [updatePlaceHashtags, runUpdateWithLock],
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
    handleUpdatePlaceHashtags,
  };
};

export { usePlaceList };
