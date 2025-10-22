import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { routieSpaceKeys } from '@/domains/routieSpace/queries/key';
import type { RoutieSpaceAdapterType } from '@/domains/routieSpace/types/routieSpace.types';
import type {
  RoutieSpaceHistoryEvent,
  RoutieSpaceUpdatedEvent,
} from '@/domains/routieSpace/types/routieSpaceStream.types';
import { ensureRoutieSpaceUuid } from '@/domains/utils/routieSpaceUuid';
import { useSse } from '@/libs/sse/hooks/useSse';

const useRoutieSpaceStream = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const routieSpaceUuid = searchParams.get('routieSpaceIdentifier');

  const sseUrl = useMemo(
    () => (routieSpaceUuid ? `/sse/v1/routie-spaces/${routieSpaceUuid}` : ''),
    [routieSpaceUuid],
  );

  const replaceRoutieSpace = (routieSpaceName: RoutieSpaceHistoryEvent) => {
    queryClient.setQueryData<RoutieSpaceAdapterType>(
      routieSpaceKeys.all,
      routieSpaceName,
    );
  };

  useEffect(() => {
    ensureRoutieSpaceUuid(routieSpaceUuid);
  }, [routieSpaceUuid]);

  useSse<RoutieSpaceHistoryEvent>({
    url: sseUrl,
    eventName: 'ROUTIE_SPACE_HISTORY',
    onMessage: (routieSpaceName) => replaceRoutieSpace(routieSpaceName),
  });

  useSse<RoutieSpaceUpdatedEvent>({
    url: sseUrl,
    eventName: 'ROUTIE_SPACE_UPDATED',
    onMessage: (routieSpaceName) => {
      replaceRoutieSpace(routieSpaceName);
    },
  });
};

export { useRoutieSpaceStream };
