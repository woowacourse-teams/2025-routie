import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

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

const sortBySequence = (a: RoutieType, b: RoutieType) =>
  a.sequence - b.sequence;

const routieQueryOptions = queryOptions({
  queryKey: routiesKeys.all,
  queryFn: getRoutie,
  select: (routie) => {
    const sortedPlaces = [...routie.routiePlaces].sort(sortBySequence);

    return { ...routie, routiePlaces: sortedPlaces };
  },
});

const useRoutieQuery = ({ enabled = true }: UseRoutieQueryOptions = {}) => {
  return useQuery({
    ...routieQueryOptions,
    initialData: {
      routiePlaces: [],
    },
    enabled,
  });
};

const useSuspenseRoutieQuery = () => {
  return useSuspenseQuery(routieQueryOptions);
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
  routieQueryOptions,
  useRoutieQuery,
  useAddRoutieQuery,
  useChangeRoutieQuery,
  useDeleteRoutieQuery,
  useSuspenseRoutieQuery,
};
