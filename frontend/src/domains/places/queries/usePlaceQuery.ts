import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useToastContext } from '@/@common/contexts/useToastContext';
import {
  addPlace,
  deleteLikePlace,
  deletePlace,
  getHashtags,
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
import { useGoogleEventTrigger } from '@/libs/googleAnalytics/hooks/useGoogleEventTrigger';

import { UsePlaceListQueryOptions } from '../types/usePlaceQuery.types';

import { placesKeys } from './key';

const usePlaceListQuery = ({
  enabled = true,
}: UsePlaceListQueryOptions = {}) => {
  return useQuery({
    queryKey: placesKeys.list(),
    queryFn: getPlaceList,
    enabled,
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
      queryClient.invalidateQueries({ queryKey: placesKeys.hashtags() });
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
  const { triggerEvent } = useGoogleEventTrigger();

  return useMutation({
    mutationFn: (placeId: number) => deletePlace({ placeId }),
    onSuccess: () => {
      triggerEvent({
        action: 'click',
        category: 'place',
        label: '장소 삭제하기 버튼',
      });
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
    mutationFn: ({ placeId }: LikePlaceRequestType) =>
      postLikePlace({ placeId }),
    onSuccess: () => {
      showToast({
        message: '좋아요가 추가되었습니다.',
        type: 'success',
      });
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
    mutationFn: ({ placeId }: UnlikePlaceRequestType) =>
      deleteLikePlace({ placeId }),
    onSuccess: () => {
      showToast({
        message: '좋아요가 취소되었습니다.',
        type: 'success',
      });
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
    mutationFn: ({ placeId, hashtags }: UpdatePlaceHashtagsRequestType) =>
      updatePlaceHashtags({ placeId, hashtags }),
    onSuccess: () => {
      showToast({
        message: '해시태그가 수정되었습니다.',
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: placesKeys.hashtags() });
    },
    onError: (error) => {
      showToast({
        message: error.message,
        type: 'error',
      });
    },
  });
};

const useHashtagsQuery = () => {
  return useQuery({
    queryKey: placesKeys.hashtags(),
    queryFn: getHashtags,
  });
};

export {
  useAddPlaceQuery,
  useDeleteLikePlaceMutation,
  useDeletePlaceQuery,
  useLikedPlacesQuery,
  useLikePlaceMutation,
  usePlaceDetailQuery,
  usePlaceListQuery,
  usePlaceSearchQuery,
  useUpdatePlaceHashtagsMutation,
  useHashtagsQuery,
};
