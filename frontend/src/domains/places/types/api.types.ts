interface ApiPlaceBaseType {
  name: string;
  roadAddressName: string | null;
  addressName: string;
  longitude: number;
  latitude: number;
}

interface SearchPlaceRequestType {
  query: string;
}

interface SearchPlaceResponseType extends ApiPlaceBaseType {
  searchedPlaceId: string;
}

interface AddPlaceRequestType extends ApiPlaceBaseType {
  searchedPlaceId: string;
}

interface FetchPlaceRequestType {
  placeId: number;
}

type FetchPlaceResponseType = ApiPlaceBaseType;

interface FetchPlaceListResponseType extends ApiPlaceBaseType {
  id: number;
  likeCount: number;
}

interface DeletePlaceRequestType {
  placeId: number;
}

interface LikePlaceRequestType {
  placeId: number;
}

interface UnlikePlaceRequestType {
  placeId: number;
}

interface LikedPlacesResponseType extends ApiPlaceBaseType {
  likedPlaceIds: number[];
}

export type {
  SearchPlaceRequestType,
  SearchPlaceResponseType,
  AddPlaceRequestType,
  FetchPlaceRequestType,
  FetchPlaceResponseType,
  FetchPlaceListResponseType,
  DeletePlaceRequestType,
  LikePlaceRequestType,
  UnlikePlaceRequestType,
  LikedPlacesResponseType,
};
