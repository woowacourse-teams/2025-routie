interface PlaceBaseType {
  name: string;
  roadAddressName: string | null;
  addressName: string;
  latitude: number;
  longitude: number;
}

interface PlaceAddType extends PlaceBaseType {
  searchedPlaceId: string;
}

interface PlaceFetchType extends PlaceBaseType {
  id: number;
}

// 임시 타입
interface PlaceSearchType {
  searchedPlaceId: string;
  latitude: number;
  longitude: number;
}

export type { PlaceBaseType, PlaceAddType, PlaceFetchType, PlaceSearchType };
