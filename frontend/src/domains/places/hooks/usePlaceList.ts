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
  const { mutateAsync: deletePlace } = useDeletePlaceQuery();
  const { mutateAsync: updatePlaceHashtags } = useUpdatePlaceHashtagsMutation();
  const { showToast } = useToastContext();
  const { runWithLock: runDeleteWithLock } = useAsyncLock();
  const { runWithLock: runAddWithLock } = useAsyncLock();
  const { runWithLock: runUpdateWithLock } = useAsyncLock();
  const { triggerEvent } = useGoogleEventTrigger();

  const handleAddPlace = useCallback(
    async (addPlaceInfo: SearchedPlaceType) => {
      const result = await runAddWithLock(async () => {
        try {
          await addPlace(addPlaceInfo);
        } catch {
          // onError에서 이미 에러를 처리했으므로 무시
        }
      });
      return result;
    },
    [addPlace, runAddWithLock],
  );

  const handleDeletePlace = useCallback(
    async (placeId: number) => {
      return runDeleteWithLock(async () => {
        try {
          await deletePlace(placeId);
          triggerEvent({
            action: 'click',
            category: 'place',
            label: '장소 삭제하기 버튼',
          });
        } catch {
          // onError에서 이미 에러를 처리했으므로 무시
        }
      });
    },
    [deletePlace, runDeleteWithLock, triggerEvent],
  );

  const handleUpdatePlaceHashtags = useCallback(
    async (placeId: number, hashtags: string[]) => {
      return runUpdateWithLock(async () => {
        try {
          await updatePlaceHashtags({ placeId, hashtags });
        } catch {
          // onError에서 이미 에러를 처리했으므로 무시
        }
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
