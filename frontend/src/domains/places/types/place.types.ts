interface PlaceBaseType {
  name: string;
  roadAddressName: string | null;
  addressName: string;
  latitude: number;
  longitude: number;
}

interface SearchedPlaceType extends PlaceBaseType {
  searchedPlaceId: string;
}

interface PlaceDataType extends PlaceBaseType {
  id: number;
}

type PlaceAdapterType = PlaceBaseType;

type PlaceWithLikeType = PlaceDataType & { likeCount: number };

type PlaceListAdapterType = PlaceWithLikeType[];

type SearchPlaceAdapterType = SearchedPlaceType[];

export type {
  SearchedPlaceType,
  PlaceDataType,
  PlaceAdapterType,
  PlaceWithLikeType,
  PlaceListAdapterType,
  SearchPlaceAdapterType,
};
