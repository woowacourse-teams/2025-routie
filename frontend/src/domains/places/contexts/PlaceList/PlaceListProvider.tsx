import { useCallback, useEffect, useState } from 'react';

import { useToastContext } from '@/@common/contexts/useToastContext';
import { getPlaceList } from '@/domains/places/apis/place';
import type {
  PlaceDataType,
  PlaceListProviderProps,
} from '@/domains/places/types/place.types';

import { PlaceListContext } from './PlaceListContext';

const PlaceListProvider = ({ children }: PlaceListProviderProps) => {
  const [placeList, setPlaceList] = useState<PlaceDataType[]>([]);
  const { showToast } = useToastContext();
  const [newlyAddedPlace, setNewlyAddedPlace] = useState<PlaceDataType | null>(
    null,
  );

  const refetchPlaceList = useCallback(async () => {
    try {
      const newPlaceList = await getPlaceList();
      setPlaceList(newPlaceList);
    } catch (error) {
      console.error('장소 목록을 불러오는데 실패했습니다.', error);
      if (error instanceof Error) {
        showToast({
          message: error.message,
          type: 'error',
        });
      }
    }
  }, []);

  const handleDelete = useCallback((id: number) => {
    setPlaceList((prev) => prev.filter((place) => place.id !== id));
  }, []);

  const handlePlaceAdded = useCallback(async () => {
    const previousPlaceIds = placeList.map((place) => place.id);

    try {
      const newPlaceList = await getPlaceList();
      setPlaceList(newPlaceList);

      const newPlace = newPlaceList.find(
        (place) => !previousPlaceIds.includes(place.id),
      );
      if (newPlace) {
        setNewlyAddedPlace(newPlace);
        setTimeout(() => setNewlyAddedPlace(null), 500);
      }
    } catch (error) {
      console.error('장소 목록을 불러오는데 실패했습니다.', error);
      if (error instanceof Error) {
        showToast({
          message: error.message,
          type: 'error',
        });
      }
    }
  }, [placeList]);

  useEffect(() => {
    refetchPlaceList();
  }, []);

  return (
    <PlaceListContext.Provider
      value={{
        placeList,
        refetchPlaceList,
        handleDelete,
        newlyAddedPlace,
        handlePlaceAdded,
      }}
    >
      {children}
    </PlaceListContext.Provider>
  );
};

export default PlaceListProvider;
