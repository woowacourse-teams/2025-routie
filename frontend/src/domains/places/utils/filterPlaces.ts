import type { FilterPlacesByHashtagsParams } from '@/domains/places/types/hashtag.types';
import type { PlaceWithLikeType } from '@/domains/places/types/place.types';

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
