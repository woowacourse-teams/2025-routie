import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useToastContext } from '@/@common/contexts/useToastContext';
import {
  AddRoutiePlaceRequestType,
  DeleteRoutiePlaceRequestType,
} from '@/domains/routie/types/api.types';
import { RoutieType } from '@/domains/routie/types/routie.types';

import {
  addRoutiePlace,
  deleteRoutiePlace,
  editRoutieSequence,
  getRoutie,
} from '../apis/routie';

import { routiesKeys } from './key';

const useRoutieQuery = () => {
  return useQuery({
    queryKey: routiesKeys.all,
    queryFn: getRoutie,
    initialData: {
      routes: [],
      routiePlaces: [],
    },
    select: (routie) => {
      const sortBySequence = (a: RoutieType, b: RoutieType) =>
        a.sequence - b.sequence;
      const sortedPlaces = [...routie.routiePlaces].sort(sortBySequence);

      return { ...routie, routiePlaces: sortedPlaces };
    },
  });
};

const useAddRoutieQuery = () => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (placeId: AddRoutiePlaceRequestType) => addRoutiePlace(placeId),
    onSuccess: () => {
      showToast({
        message: '동선에 장소가 추가되었습니다.',
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: routiesKeys.all });
    },
    onError: (error) => {
      showToast({
        message: error.message,
        type: 'error',
      });
    },
  });
};

const useChangeRoutieQuery = () => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (routiePlaces: RoutieType[]) =>
      editRoutieSequence({ routiePlaces }),

    onSuccess: () => {
      showToast({
        message: '동선이 수정되었습니다.',
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: routiesKeys.all });
    },
    onError: (error) => {
      showToast({
        message: error.message,
        type: 'error',
      });
    },
  });
};

const useDeleteRoutieQuery = () => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (placeId: DeleteRoutiePlaceRequestType) =>
      deleteRoutiePlace(placeId),
    onSuccess: () => {
      showToast({
        message: '동선에서 장소가 삭제되었습니다.',
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: routiesKeys.all });
    },
    onError: (error) => {
      showToast({
        message: error.message,
        type: 'error',
      });
    },
  });
};

export {
  useRoutieQuery,
  useAddRoutieQuery,
  useChangeRoutieQuery,
  useDeleteRoutieQuery,
};
