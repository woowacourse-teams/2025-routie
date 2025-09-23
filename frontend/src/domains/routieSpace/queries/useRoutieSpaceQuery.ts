import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useToastContext } from '@/@common/contexts/useToastContext';

import {
  createRoutieSpace,
  editRoutieSpaceName,
  getRoutieSpace,
} from '../apis/routieSpace';

import { routieSpaceKeys } from './key';

const useCreateRoutieSpaceQuery = () => {
  const { showToast } = useToastContext();

  return useMutation({
    mutationKey: routieSpaceKeys.all,
    mutationFn: createRoutieSpace,
    onSuccess: (data) => {
      showToast({
        message: '루티 스페이스가 생성되었습니다.',
        type: 'success',
      });
    },
    onError: (error) => {
      showToast({
        message: error.message,
        type: 'error',
      });
      console.error(error);
    },
  });
};

const useRoutieSpaceQuery = () => {
  return useQuery({
    queryKey: routieSpaceKeys.all,
    queryFn: getRoutieSpace,
  });
};

const useEditRoutieSpaceNameQuery = (name: string) => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: routieSpaceKeys.edit(name),
    mutationFn: () => editRoutieSpaceName({ name }),
    onSuccess: (data) => {
      showToast({
        message: '루티 스페이스 이름이 수정되었습니다.',
        type: 'success',
      });
      queryClient.setQueryData(routieSpaceKeys.all, data);
    },
    onError: (error) => {
      showToast({
        message: error.message,
        type: 'error',
      });
      console.error(error);
    },
  });
};

export {
  useRoutieSpaceQuery,
  useCreateRoutieSpaceQuery,
  useEditRoutieSpaceNameQuery,
};
