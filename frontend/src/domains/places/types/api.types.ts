interface ApiPlaceBaseType {
  name: string;
  roadAddressName: string | null;
  addressName: string;
  longitude: number;
  latitude: number;
  hashtags?: string[];
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

interface FetchPlaceResponseType extends ApiPlaceBaseType {
  kakaoPlaceId?: string;
}

interface FetchPlaceListResponseType extends ApiPlaceBaseType {
  id: number;
  likeCount: number;
  kakaoPlaceId?: string;
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

interface LikedPlacesResponseType {
  likedPlaceIds: number[];
}

interface UpdatePlaceHashtagsRequestType {
  placeId: number;
  hashtags: string[];
}

interface HashtagsResponseType {
  hashtags: string[];
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
  UpdatePlaceHashtagsRequestType,
  HashtagsResponseType,
};
