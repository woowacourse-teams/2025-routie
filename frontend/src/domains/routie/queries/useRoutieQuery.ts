import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useToastContext } from '@/@common/contexts/useToastContext';
import type {
  AddRoutiePlaceRequestType,
  DeleteRoutiePlaceRequestType,
} from '@/domains/routie/types/api.types';
import type { RoutieType } from '@/domains/routie/types/routie.types';

import {
  addRoutiePlace,
  deleteRoutiePlace,
  editRoutieSequence,
  getRoutie,
} from '../apis/routie';

import { routiesKeys } from './key';

import type { UseRoutieQueryOptions } from '../types/useRoutieQuery.types';

const useRoutieQuery = ({ enabled = true }: UseRoutieQueryOptions = {}) => {
  return useQuery({
    queryKey: routiesKeys.all,
    queryFn: getRoutie,
    initialData: {
      routiePlaces: [],
    },
    select: (routie) => {
      const sortBySequence = (a: RoutieType, b: RoutieType) =>
        a.sequence - b.sequence;
      const sortedPlaces = [...routie.routiePlaces].sort(sortBySequence);

      return { ...routie, routiePlaces: sortedPlaces };
    },
    enabled,
  });
};

const useAddRoutieQuery = () => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (placeId: AddRoutiePlaceRequestType) => addRoutiePlace(placeId),
    onSuccess: () => {
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
