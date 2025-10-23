import { useQueryClient } from '@tanstack/react-query';

import { placesKeys } from '@/domains/places/queries/key';
import type { PlaceListAdapterType } from '@/domains/places/types/place.types';

const useFindPlaceName = () => {
  const queryClient = useQueryClient();

  return (placeId: number) => {
    const placeList =
      queryClient.getQueryData<PlaceListAdapterType>(placesKeys.list()) ?? [];

    return placeList.find((place) => place.id === placeId)?.name;
  };
};

export { useFindPlaceName };
