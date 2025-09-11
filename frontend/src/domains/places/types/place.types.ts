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

// 임시 타입
interface PlaceSearchType {
  searchedPlaceId: string;
  latitude: number;
  longitude: number;
}

interface PlaceListContextType {
  placeList: PlaceDataType[];
  refetchPlaceList: () => Promise<void>;
  handleDelete: (id: number) => void;
  newlyAddedPlace: PlaceDataType | null;
  handlePlaceAdded: () => Promise<void>;
}

interface PlaceListProviderProps {
  children?: React.ReactNode;
}

export type {
  PlaceBaseType,
  SearchedPlaceType,
  PlaceDataType,
  PlaceSearchType,
  PlaceListContextType,
  PlaceListProviderProps,
};
