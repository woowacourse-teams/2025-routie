interface ApiRoutiePlacesBaseType {
  sequence: number;
  placeId: number;
}

interface ApiRoutiePlaceType extends ApiRoutiePlacesBaseType {
  id: number;
}

interface FetchRoutieResponseType {
  routiePlaces: ApiRoutiePlaceType[];
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
