// src/domains/places/hooks/usePlaceStream.ts
import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { getPlaceListAdapter } from '@/domains/places/adapters/placeAdapter';
import { placesKeys } from '@/domains/places/queries/key';
import type { FetchPlaceListResponseType } from '@/domains/places/types/api.types';
import {
  ensureRoutieSpaceUuid,
  getRoutieSpaceUuid,
} from '@/domains/utils/routieSpaceUuid';
import { useSse } from '@/libs/sse/hooks/useSse';

type PlaceHistoryEvent = {
  places: FetchPlaceListResponseType[];
};

export const usePlaceStream = () => {
  const queryClient = useQueryClient();
  const routieSpaceUuid = getRoutieSpaceUuid();

  const replaceLPlaceList = ({ places }: PlaceHistoryEvent) => {
    queryClient.setQueryData(placesKeys.list(), getPlaceListAdapter(places));
  };

  const sseUrl = `/sse/v1/routie-spaces/${routieSpaceUuid}`;

  useEffect(() => {
    ensureRoutieSpaceUuid(routieSpaceUuid);
  }, [routieSpaceUuid]);

  useSse<PlaceHistoryEvent>({
    url: sseUrl,
    eventName: 'PLACE_HISTORY',
    onMessage: ({ places }) => replaceLPlaceList({ places }),
  });

  useSse<PlaceHistoryEvent>({
    url: sseUrl,
    eventName: 'PLACE_CREATED',
    onMessage: ({ places }) => replaceLPlaceList({ places }),
  });

  useSse<PlaceHistoryEvent>({
    url: sseUrl,
    eventName: 'PLACE_UPDATED',
    onMessage: ({ places }) => replaceLPlaceList({ places }),
  });

  useSse<PlaceHistoryEvent>({
    url: sseUrl,
    eventName: 'PLACE_DELETED',
    onMessage: ({ places }) => replaceLPlaceList({ places }),
  });
};
