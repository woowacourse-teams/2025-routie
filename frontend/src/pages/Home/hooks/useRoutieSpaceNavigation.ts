import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { useCreateRoutieSpaceQuery } from '@/domains/routieSpace/queries/useRoutieSpaceQuery';

const useRoutieSpaceNavigation = () => {
  const { mutateAsync: createRoutieSpace } = useCreateRoutieSpaceQuery();
  const navigate = useNavigate();

  const handleCreateRoutieSpace = useCallback(async () => {
    const response = await createRoutieSpace();
    const queryParams = new URLSearchParams({
      routieSpaceIdentifier: response.routieSpaceUuid,
    });

    navigate(`/routie-spaces?${queryParams.toString()}`);
  }, [navigate]);

  const handleMoveToManageRoutieSpace = useCallback(() => {
    const existingUuid = localStorage.getItem('routieSpaceUuid');
    if (!existingUuid) return;

    navigate(`/manage-routie-spaces`);
  }, [navigate]);

  const handleMoveToRoutieSpace = useCallback(
    (routieSpaceUuid: string) => {
      const queryParams = new URLSearchParams({
        routieSpaceIdentifier: routieSpaceUuid,
      });
      navigate(`/routie-spaces?${queryParams.toString()}`);
    },
    [navigate],
  );

  return {
    handleCreateRoutieSpace,
    handleMoveToManageRoutieSpace,
    handleMoveToRoutieSpace,
  };
};

export { useRoutieSpaceNavigation };
