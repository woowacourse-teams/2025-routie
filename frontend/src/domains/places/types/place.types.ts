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

type PlaceAdapterType = PlaceBaseType;

type PlaceListAdapterType = PlaceDataType[];

type SearchPlaceAdapterType = SearchedPlaceType[];

export type {
  PlaceBaseType,
  SearchedPlaceType,
  PlaceDataType,
  PlaceListContextType,
  PlaceListProviderProps,
  PlaceAdapterType,
  PlaceListAdapterType,
  SearchPlaceAdapterType,
};
