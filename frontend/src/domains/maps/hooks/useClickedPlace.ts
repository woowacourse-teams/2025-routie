import { useCallback, useState } from 'react';

import type { PlaceDataType } from '@/domains/places/types/place.types';

interface UseClickedPlaceProps {
  openAt: (lat: number, lng: number) => void;
  close: () => void;
}

interface UseClickedPlaceReturn {
  clickedPlace: PlaceDataType | null;
  handleMapClick: () => void;
  handleMarkerClick: (place: PlaceDataType) => void;
}

const useClickedPlace = ({ openAt, close }: UseClickedPlaceProps): UseClickedPlaceReturn => {
  const [clickedPlace, setClickedPlace] = useState<PlaceDataType | null>(null);

  const handleMapClick = useCallback(() => {
    setClickedPlace(null);
    close();
  }, [close]);

  const handleMarkerClick = useCallback(
    (place: PlaceDataType) => {
      setClickedPlace(place);
      openAt(place.latitude, place.longitude);
    },
    [openAt],
  );

  return {
    clickedPlace,
    handleMapClick,
    handleMarkerClick,
  };
};

export { useClickedPlace };
export type { UseClickedPlaceProps, UseClickedPlaceReturn };