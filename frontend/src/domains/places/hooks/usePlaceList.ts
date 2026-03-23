import { useCallback } from 'react';

import { useAsyncLock } from '@/@common/hooks/useAsyncLock';
import {
  useAddPlaceQuery,
  useDeletePlaceQuery,
  useSuspensePlaceListQuery,
  useUpdatePlaceHashtagsMutation,
} from '@/domains/places/queries/usePlaceQuery';
import type { SearchedPlaceType } from '@/domains/places/types/place.types';

const usePlaceList = () => {
  const { data: placeList } = useSuspensePlaceListQuery();
  const { mutate: addPlace, data: addedPlaceId } = useAddPlaceQuery();
  const { mutate: deletePlace } = useDeletePlaceQuery();
  const { mutate: updatePlaceHashtags } = useUpdatePlaceHashtagsMutation();
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

  return {
    placeList,
    handleAddPlace,
    addedPlaceId,
    handleDeletePlace,
    handleUpdatePlaceHashtags,
  };
};

export { usePlaceList };
