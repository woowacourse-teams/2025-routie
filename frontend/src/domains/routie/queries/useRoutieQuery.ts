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

  return useMutation({
    mutationFn: (placeId: AddRoutiePlaceRequestType) => addRoutiePlace(placeId),
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

  return useMutation({
    mutationFn: (routiePlaces: RoutieType[]) =>
      editRoutieSequence({ routiePlaces }),

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

  return useMutation({
    mutationFn: (placeId: DeleteRoutiePlaceRequestType) =>
      deleteRoutiePlace(placeId),
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
