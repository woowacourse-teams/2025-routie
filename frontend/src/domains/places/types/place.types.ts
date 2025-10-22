interface PlaceBaseType {
  name: string;
  roadAddressName: string | null;
  addressName: string;
  latitude: number;
  longitude: number;
  hashtags?: string[];
}

interface SearchedPlaceType extends PlaceBaseType {
  searchedPlaceId: string;
}

interface PlaceDataType extends PlaceBaseType {
  id: number;
}

type PlaceAdapterType = PlaceBaseType;

interface PlaceWithLikeType extends PlaceDataType {
  likeCount: number;
}

type PlaceListAdapterType = PlaceWithLikeType[];

type SearchPlaceAdapterType = SearchedPlaceType[];

interface LikedPlacesResponseAdapterType {
  likedPlaceIds: number[];
}

interface HashtagsAdapterType {
  id: number;
  name: string;
  count: number;
}

interface HashtagsResponseAdapterType {
  hashtags: HashtagsAdapterType[];
}

export type {
  SearchedPlaceType,
  PlaceDataType,
  PlaceAdapterType,
  PlaceWithLikeType,
  PlaceListAdapterType,
  SearchPlaceAdapterType,
  LikedPlacesResponseAdapterType,
  HashtagsAdapterType,
  HashtagsResponseAdapterType,
};
