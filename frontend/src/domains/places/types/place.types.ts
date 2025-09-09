export interface PlaceBaseType {
  name: string;
  roadAddressName: string | null;
  addressName: string;
  latitude: number;
  longitude: number;
}

export interface PlaceAddType extends PlaceBaseType {
  searchedPlaceId: string;
}

export interface PlaceFetchType extends PlaceBaseType {
  id: number;
}
