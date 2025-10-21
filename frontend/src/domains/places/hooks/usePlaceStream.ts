import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { useToastContext } from '@/@common/contexts/useToastContext';
import { getPlaceListAdapter } from '@/domains/places/adapters/placeAdapter';
import { placesKeys } from '@/domains/places/queries/key';
import type { FetchPlaceListResponseType } from '@/domains/places/types/api.types';
import { ensureRoutieSpaceUuid } from '@/domains/utils/routieSpaceUuid';
import { useSse } from '@/libs/sse/hooks/useSse';

type PlaceHistoryEvent = {
  places: FetchPlaceListResponseType[];
};

export const usePlaceStream = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const { showToast } = useToastContext();

  const routieSpaceUuid = searchParams.get('routieSpaceIdentifier');

  const sseUrl = useMemo(
    () => (routieSpaceUuid ? `/sse/v1/routie-spaces/${routieSpaceUuid}` : ''),
    [routieSpaceUuid],
  );

  const replaceLPlaceList = ({ places }: PlaceHistoryEvent) => {
    queryClient.setQueryData(placesKeys.list(), getPlaceListAdapter(places));
  };

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
    onMessage: ({ places }) => {
      replaceLPlaceList({ places });
      showToast({
        message: '장소가 추가되었습니다.',
        type: 'success',
      });
    },
  });

  useSse<PlaceHistoryEvent>({
    url: sseUrl,
    eventName: 'PLACE_UPDATED',
    onMessage: ({ places }) => replaceLPlaceList({ places }),
  });

  useSse<PlaceHistoryEvent>({
    url: sseUrl,
    eventName: 'PLACE_DELETED',
    onMessage: ({ places }) => {
      replaceLPlaceList({ places });
      showToast({
        message: '장소가 삭제되었습니다.',
        type: 'success',
      });
    },
  });
};
