import { useCallback, useState } from 'react';

import type {
  UseClickedPlaceProps,
  UseClickedPlaceReturn,
} from '@/domains/maps/types/map.types';
import type { PlaceDataType } from '@/domains/places/types/place.types';

const useClickedPlace = ({
  openAt,
  close,
}: UseClickedPlaceProps): UseClickedPlaceReturn => {
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
