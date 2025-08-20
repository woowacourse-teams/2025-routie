import { useCallback, useEffect, useState } from 'react';

import { useToastContext } from '@/@common/contexts/useToastContext';
import getPlaceList from '@/domains/places/apis/getplaceList';
import { PlaceCardProps } from '@/domains/places/components/PlaceCard/PlaceCard';

import { PlaceListContext } from './PlaceListContext';

interface Props {
  children?: React.ReactNode;
}

export const PlaceListProvider = ({ children }: Props) => {
  const [placeList, setPlaceList] = useState<PlaceCardProps[]>([]);
  const { showToast } = useToastContext();

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

  useEffect(() => {
    refetchPlaceList();
  }, []);

  return (
    <PlaceListContext.Provider
      value={{ placeList, refetchPlaceList, handleDelete }}
    >
      {children}
    </PlaceListContext.Provider>
  );
};
