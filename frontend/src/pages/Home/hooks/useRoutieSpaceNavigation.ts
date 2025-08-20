import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { useToastContext } from '@/@common/contexts/useToastContext';
import { createRoutieSpace } from '@/domains/routieSpace/apis/createRoutieSpace';

export const useRoutieSpaceNavigation = () => {
  const navigate = useNavigate();
  const { showToast } = useToastContext();

  const handleCreateRoutieSpace = useCallback(async () => {
    try {
      await createRoutieSpace();
      const newUuid = localStorage.getItem('routieSpaceUuid');
      if (!newUuid) return;
      navigate(`/routie-spaces?routieSpaceIdentifier=${newUuid}`);
      showToast({
        message: '새 루티 스페이스가 생성되었습니다',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        showToast({
          message: error.message,
          type: 'error',
        });
      }
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
