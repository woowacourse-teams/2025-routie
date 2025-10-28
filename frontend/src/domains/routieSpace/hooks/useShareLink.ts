import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useToastContext } from '@/@common/contexts/useToastContext';
import { useRoutieSpaceQuery } from '@/domains/routieSpace/queries/useRoutieSpaceQuery';
import { getRoutieSpaceUuid } from '@/domains/utils/routieSpaceUuid';

const useShareLink = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToastContext();
  const routieSpaceIdentifier =
    searchParams.get('routieSpaceIdentifier') ?? getRoutieSpaceUuid();
  const { data: routieSpace } = useRoutieSpaceQuery({ enabled: false });

  const shareLink = useMemo(() => {
    if (!routieSpaceIdentifier) return '';

    const params = new URLSearchParams({
      routieSpaceIdentifier,
    });

    if (routieSpace?.name) {
      params.set('name', routieSpace.name);
    }

    return `${window.location.origin}/routie-spaces?${params.toString()}`;
  }, [routieSpaceIdentifier, routieSpace?.name]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      showToast({ type: 'info', message: '링크가 복사되었습니다.' });
    } catch (error) {
      showToast({ type: 'error', message: '링크 복사를 실패하였습니다.' });
    }
  }, [shareLink, showToast]);

  return { shareLink, handleCopyLink };
};

export { useShareLink };
