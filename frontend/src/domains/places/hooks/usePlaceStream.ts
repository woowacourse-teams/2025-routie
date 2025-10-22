import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { useToastContext } from '@/@common/contexts/useToastContext';
import { getPlaceListAdapter } from '@/domains/places/adapters/placeAdapter';
import { placesKeys } from '@/domains/places/queries/key';
import type {
  PlaceCratedEvent,
  PlaceDeletedEvent,
  PlaceHistoryEvent,
  PlaceUpdatedEvent,
} from '@/domains/places/types/placeStream.types';
import { ensureRoutieSpaceUuid } from '@/domains/utils/routieSpaceUuid';
import { useSse } from '@/libs/sse/hooks/useSse';

const usePlaceStream = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const { showToast } = useToastContext();

  const routieSpaceUuid = searchParams.get('routieSpaceIdentifier');

  const sseUrl = useMemo(
    () => (routieSpaceUuid ? `/sse/v1/routie-spaces/${routieSpaceUuid}` : ''),
    [routieSpaceUuid],
  );

  const replacePlaceList = ({ places }: PlaceHistoryEvent) => {
    queryClient.setQueryData(placesKeys.list(), getPlaceListAdapter(places));
  };

  useEffect(() => {
    ensureRoutieSpaceUuid(routieSpaceUuid);
  }, [routieSpaceUuid]);

  useSse<PlaceHistoryEvent>({
    url: sseUrl,
    eventName: 'PLACE_HISTORY',
    onMessage: ({ places }) => replacePlaceList({ places }),
  });

  useSse<PlaceCratedEvent>({
    url: sseUrl,
    eventName: 'PLACE_CREATED',
    onMessage: ({ createdPlaceId, places }) => {
      const adaptedPlaces = getPlaceListAdapter(places);
      const createdPlace = adaptedPlaces.find(
        (place) => place.id === createdPlaceId,
      );

      replacePlaceList({ places });
      showToast({
        message: `"${createdPlace?.name ?? '장소'}" 추가되었습니다.`,
        type: 'success',
      });
    },
  });

  useSse<PlaceUpdatedEvent>({
    url: sseUrl,
    eventName: 'PLACE_UPDATED',
    onMessage: ({ updatedPlaceId, places }) => {
      const adaptedPlaces = getPlaceListAdapter(places);
      const updatedPlace = adaptedPlaces.find(
        (place) => place.id === updatedPlaceId,
      );
      replacePlaceList({ places });
      showToast({
        message: `"${updatedPlace?.name ?? '장소'}" 수정되었습니다.`,
        type: 'success',
      });
    },
  });

  useSse<PlaceDeletedEvent>({
    url: sseUrl,
    eventName: 'PLACE_DELETED',
    onMessage: ({ deletedPlaceId, places }) => {
      const adaptedPlaces = getPlaceListAdapter(places);
      const deletedPlace = adaptedPlaces.find(
        (place) => place.id === deletedPlaceId,
      );
      replacePlaceList({ places });
      showToast({
        message: `"${deletedPlace?.name ?? '장소'}" 삭제되었습니다.`,
        type: 'success',
      });
    },
  });
};

export { usePlaceStream };
