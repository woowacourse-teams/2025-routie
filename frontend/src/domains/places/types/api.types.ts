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
}

interface DeletePlaceRequestType {
  placeId: number;
}

export type {
  ApiPlaceBaseType,
  SearchPlaceRequestType,
  SearchPlaceResponseType,
  AddPlaceRequestType,
  FetchPlaceRequestType,
  FetchPlaceResponseType,
  FetchPlaceListResponseType,
  DeletePlaceRequestType,
};
