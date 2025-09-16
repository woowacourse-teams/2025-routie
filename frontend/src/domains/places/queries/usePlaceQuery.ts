import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useToastContext } from '@/@common/contexts/useToastContext';
import {
  addPlace,
  deletePlace,
  getPlace,
  getPlaceList,
  searchPlace,
} from '@/domains/places/apis/place';
import { AddPlaceRequestType } from '@/domains/places/types/api.types';

import { placesKeys } from './key';

const usePlaceListQuery = () => {
  return useQuery({
    queryKey: placesKeys.list(),
    queryFn: getPlaceList,
  });
};

const usePlaceDetailQuery = (placeId: number) => {
  return useQuery({
    queryKey: placesKeys.detail(placeId),
    queryFn: () => getPlace({ placeId }),
  });
};

const usePlaceSearchQuery = (query: string) => {
  return useQuery({
    queryKey: placesKeys.search(query),
    queryFn: () => {
      return searchPlace({ query });
    },
    initialData: null,
    enabled: !!query,
  });
};

const useAddPlaceQuery = () => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addPlaceInfo: AddPlaceRequestType) => addPlace(addPlaceInfo),
    onSuccess: (data) => {
      showToast({
        message: '장소가 추가되었습니다.',
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: placesKeys.list() });
      queryClient.setQueryData(['addedPlaceId'], data.id);
    },
    onError: (error) => {
      showToast({
        message: error.message,
        type: 'error',
      });
    },
  });
};

const useDeletePlaceQuery = () => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (placeId: number) => deletePlace({ placeId }),
    onSuccess: () => {
      showToast({
        message: '장소가 삭제되었습니다.',
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: placesKeys.list() });
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
  useAddPlaceQuery,
  useDeletePlaceQuery,
  usePlaceDetailQuery,
  usePlaceListQuery,
  usePlaceSearchQuery,
};
