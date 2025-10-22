import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { useToastContext } from '@/@common/contexts/useToastContext';
import { ensureRoutieSpaceUuid } from '@/domains/utils/routieSpaceUuid';
import { useSse } from '@/libs/sse/hooks/useSse';

import { routieAdapter } from '../adapters/routieAdapter';
import { routiesKeys } from '../queries/key';
import { FetchRoutieResponseType } from '../types/api.types';

export const useRoutieStream = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const { showToast } = useToastContext();
  const routieSpaceUuid = searchParams.get('routieSpaceIdentifier');

  const sseUrl = useMemo(
    () => (routieSpaceUuid ? `/sse/v1/routie-spaces/${routieSpaceUuid}` : ''),
    [routieSpaceUuid],
  );
  const replaceRoutie = (routie: FetchRoutieResponseType) => {
    queryClient.setQueryData(routiesKeys.all, routieAdapter(routie));
  };

  useEffect(() => {
    ensureRoutieSpaceUuid(routieSpaceUuid);
  }, [routieSpaceUuid]);

  useSse<FetchRoutieResponseType>({
    url: sseUrl,
    eventName: 'ROUTIE_HISTORY',
    onMessage: (routie) => replaceRoutie(routie),
  });

  useSse<FetchRoutieResponseType>({
    url: sseUrl,
    eventName: 'ROUTIE_UPDATED',
    onMessage: (routie) => {
      replaceRoutie(routie);
      showToast({
        message: '동선이 수정되었습니다.',
        type: 'success',
      });
    },
  });
};
