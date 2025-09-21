interface ApiRoutiePlacesBaseType {
  sequence: number;
  placeId: number;
}

interface ApiRoutiePlaceType extends ApiRoutiePlacesBaseType {
  id: number;
}

interface ApiRouteDataType {
  fromSequence: number;
  toSequence: number;
  duration: number;
  distance: number;
}

interface FetchRoutieResponseType {
  routiePlaces: ApiRoutiePlaceType[];
  routes: ApiRouteDataType[];
}

interface EditRoutieRequestType {
  routiePlaces: ApiRoutiePlacesBaseType[];
}

interface AddRoutiePlaceRequestType {
  placeId: number;
}

type AddRoutiePlaceResponseType = ApiRoutiePlaceType;

interface DeleteRoutiePlaceRequestType {
  placeId: number;
}

export type {
  FetchRoutieResponseType,
  EditRoutieRequestType,
  AddRoutiePlaceRequestType,
  AddRoutiePlaceResponseType,
  DeleteRoutiePlaceRequestType,
};
