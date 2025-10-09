import { useCallback, useEffect } from 'react';

import { useToastContext } from '@/@common/contexts/useToastContext';
import { useRequireAccessToken } from '@/@common/hooks/useRequireAccessToken';
import {
  useLikePlaceMutation,
  useLikedPlacesQuery,
  useUnlikePlaceMutation,
} from '@/domains/places/queries/usePlaceQuery';

const usePlaceLikes = () => {
  const { mutate: postLikePlace } = useLikePlaceMutation();
  const { mutate: deleteLikePlace } = useUnlikePlaceMutation();
  const { showToast } = useToastContext();

  const isAccessToken = Boolean(localStorage.getItem('accessToken'));
  const { data = { likedPlaceIds: [] }, error } =
    useLikedPlacesQuery(isAccessToken);

  const likedPlaceIds = data.likedPlaceIds;

  const requireAccessToken = useRequireAccessToken();

  const handleLikePlace = useCallback(
    (placeId: number) => {
      const accessToken = requireAccessToken();

      if (!accessToken) return;

      postLikePlace({ placeId });
    },
    [postLikePlace, requireAccessToken],
  );

  const handleDeleteLikePlace = useCallback(
    (placeId: number) => {
      const accessToken = requireAccessToken();

      if (!accessToken) return;

      deleteLikePlace({ placeId });
    },
    [deleteLikePlace, requireAccessToken],
  );

  useEffect(() => {
    if (error) {
      console.error(error);
      showToast({
        message: error.message,
        type: 'error',
      });
    }
  }, [error, showToast]);

  return {
    handleLikePlace,
    handleDeleteLikePlace,
    likedPlaceIds,
  };
};

export { usePlaceLikes };
