import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { useToastContext } from '@/@common/contexts/useToastContext';
import { createRoutieSpace } from '@/domains/routieSpace/apis/createRoutieSpace';

export const useRoutieSpaceNavigation = () => {
  const navigate = useNavigate();
  const { showToast } = useToastContext();

  const handleCreateRoutieSpace = useCallback(async () => {
    try {
      const newUuid = await createRoutieSpace();
      const queryParams = new URLSearchParams({
        routieSpaceIdentifier: newUuid,
      });

      navigate(`/routie-spaces?${queryParams.toString()}`);

      showToast({
        message: '새 루티 스페이스가 생성되었습니다',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      showToast({
        message: '루티스페이스 생성에 실패하였습니다. 다시 시도해주세요',
        type: 'error',
      });
    }
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
