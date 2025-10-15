import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useToastContext } from '@/@common/contexts/useToastContext';
import {
  addPlace,
  deleteLikePlace,
  deletePlace,
  getLikedPlaces,
  getPlace,
  getPlaceList,
  postLikePlace,
  searchPlace,
  updatePlaceHashtags,
} from '@/domains/places/apis/place';
import type {
  AddPlaceRequestType,
  LikePlaceRequestType,
  UnlikePlaceRequestType,
  UpdatePlaceHashtagsRequestType,
} from '@/domains/places/types/api.types';

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
    mutationFn: async (addPlaceInfo: AddPlaceRequestType) =>
      await addPlace(addPlaceInfo),
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
    mutationFn: async (placeId: number) => await deletePlace({ placeId }),
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

const useLikePlaceMutation = () => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ placeId }: LikePlaceRequestType) =>
      await postLikePlace({ placeId }),
    onSuccess: () => {
      showToast({
        message: '좋아요가 추가되었습니다.',
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: placesKeys.list() });
      queryClient.invalidateQueries({ queryKey: placesKeys.liked() });
    },
    onError: (error) => {
      showToast({
        message: error.message,
        type: 'error',
      });
    },
  });
};

const useDeleteLikePlaceMutation = () => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ placeId }: UnlikePlaceRequestType) =>
      await deleteLikePlace({ placeId }),
    onSuccess: () => {
      showToast({
        message: '좋아요가 취소되었습니다.',
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: placesKeys.list() });
      queryClient.invalidateQueries({ queryKey: placesKeys.liked() });
    },
    onError: (error) => {
      showToast({
        message: error.message,
        type: 'error',
      });
    },
  });
};

const useLikedPlacesQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: placesKeys.liked(),
    queryFn: getLikedPlaces,
    enabled,
  });
};

const useUpdatePlaceHashtagsMutation = () => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ placeId, hashtags }: UpdatePlaceHashtagsRequestType) =>
      await updatePlaceHashtags({ placeId, hashtags }),
    onSuccess: () => {
      showToast({
        message: '해시태그가 수정되었습니다.',
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
  useLikePlaceMutation,
  useDeleteLikePlaceMutation,
  useLikedPlacesQuery,
  useUpdatePlaceHashtagsMutation,
};
