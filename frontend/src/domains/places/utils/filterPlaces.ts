import type { PlaceWithLikeType } from '@/domains/places/types/place.types';

interface FilterPlacesByHashtagsParams {
  places: PlaceWithLikeType[];
  selectedHashtags: string[];
  priorityPlaceIds?: number[];
}

const filterPlacesByHashtags = ({
  places,
  selectedHashtags,
  priorityPlaceIds = [],
}: FilterPlacesByHashtagsParams): PlaceWithLikeType[] => {
  return places.filter((place) => {
    if (priorityPlaceIds.includes(place.id)) return true;

    if (selectedHashtags.length === 0) return true;

    return place.hashtags?.some((hashtag) =>
      selectedHashtags.includes(hashtag),
    );
  });
};

export { filterPlacesByHashtags };
