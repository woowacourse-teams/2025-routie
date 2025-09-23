import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { useToastContext } from '@/@common/contexts/useToastContext';
import { useCreateRoutieSpaceQuery } from '@/domains/routieSpace/queries/useRoutieSpaceQuery';

const useRoutieSpaceNavigation = () => {
  const { mutateAsync: createRoutieSpace } = useCreateRoutieSpaceQuery();
  const navigate = useNavigate();
  const { showToast } = useToastContext();

  const handleCreateRoutieSpace = useCallback(async () => {
    const response = await createRoutieSpace();
    const queryParams = new URLSearchParams({
      routieSpaceIdentifier: response.routieSpaceUuid,
    });

    navigate(`/routie-spaces?${queryParams.toString()}`);
  }, [navigate]);

  const handleReturnToRoutieSpace = useCallback(() => {
    const existingUuid = localStorage.getItem('routieSpaceUuid');
    if (!existingUuid) return;

    navigate(`/routie-spaces?routieSpaceIdentifier=${existingUuid}`);
    showToast({
      message: '마지막으로 사용한 루티 스페이스를 불러왔습니다.',
      type: 'success',
    });
  }, [navigate]);

  return {
    handleCreateRoutieSpace,
    handleReturnToRoutieSpace,
  };
};

export { useRoutieSpaceNavigation };
