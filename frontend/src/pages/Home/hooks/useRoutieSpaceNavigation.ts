import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { createRoutieSpace } from '@/domains/routieSpace/apis/createRoutieSpace';

export const useRoutieSpaceNavigation = () => {
  const navigate = useNavigate();

  const handleCreateRoutieSpace = useCallback(async () => {
    try {
      await createRoutieSpace();
      const newUuid = localStorage.getItem('routieSpaceUuid');
      if (!newUuid) return;

      navigate(`/routie-spaces?routieSpaceIdentifier=${newUuid}`);
    } catch (error) {
      console.error(error);
    }
  }, [navigate]);

  const handleReturnToRoutieSpace = useCallback(() => {
    const existingUuid = localStorage.getItem('routieSpaceUuid');
    if (!existingUuid) return;

    navigate(`/routie-spaces?routieSpaceIdentifier=${existingUuid}`);
  }, [navigate]);

  return {
    handleCreateRoutieSpace,
    handleReturnToRoutieSpace,
  };
};
