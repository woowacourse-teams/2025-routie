import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { useToastContext } from '@/@common/contexts/useToastContext';
import { placesKeys } from '@/domains/places/queries/key';
import type { PlaceListAdapterType } from '@/domains/places/types/place.types';
import { ensureRoutieSpaceUuid } from '@/domains/utils/routieSpaceUuid';
import { useSse } from '@/libs/sse/hooks/useSse';

import { routieAdapter } from '../adapters/routieAdapter';
import { routiesKeys } from '../queries/key';
import {
  RoutieCreatedEvent,
  RoutieDeletedEvent,
  RoutieHistoryEvent,
  RoutieUpdatedEvent,
} from '../types/routieStream.types';

export const useRoutieStream = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const { showToast } = useToastContext();
  const routieSpaceUuid = searchParams.get('routieSpaceIdentifier');

  const sseUrl = useMemo(
    () => (routieSpaceUuid ? `/sse/v1/routie-spaces/${routieSpaceUuid}` : ''),
    [routieSpaceUuid],
  );
  const replaceRoutie = (routie: RoutieHistoryEvent) => {
    queryClient.setQueryData(routiesKeys.all, routieAdapter(routie));
  };

  const findPlaceName = (placeId: number) => {
    const placeList =
      queryClient.getQueryData<PlaceListAdapterType>(placesKeys.list()) ?? [];

    return placeList.find((place) => place.id === placeId)?.name;
  };

  useEffect(() => {
    ensureRoutieSpaceUuid(routieSpaceUuid);
  }, [routieSpaceUuid]);

  useSse<RoutieHistoryEvent>({
    url: sseUrl,
    eventName: 'ROUTIE_HISTORY',
    onMessage: (routie) => replaceRoutie(routie),
  });

  useSse<RoutieCreatedEvent>({
    url: sseUrl,
    eventName: 'ROUTIE_PLACE_CREATED',
    onMessage: ({ createdRoutiePlaceId, ...routieData }) => {
      replaceRoutie(routieData);
      const placeName = findPlaceName(createdRoutiePlaceId);
      showToast({
        message: `동선에 "${placeName ?? '장소'}"이/가 추가되었습니다.`,
        type: 'success',
      });
    },
  });

  useSse<RoutieUpdatedEvent>({
    url: sseUrl,
    eventName: 'ROUTIE_UPDATED',
    onMessage: (routie) => {
      replaceRoutie(routie);
      showToast({
        message: '동선 순서가 변경되었습니다.',
        type: 'success',
      });
    },
  });

  useSse<RoutieDeletedEvent>({
    url: sseUrl,
    eventName: 'ROUTIE_PLACE_DELETED',
    onMessage: ({ deletedRoutiePlaceId, ...routieData }) => {
      replaceRoutie(routieData);
      const placeName = findPlaceName(deletedRoutiePlaceId);
      showToast({
        message: `"${placeName ?? '장소'}"이/가 동선에서 삭제되었습니다.`,
        type: 'success',
      });
    },
  });
};
