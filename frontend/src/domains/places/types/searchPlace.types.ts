import { SearchedPlaceType } from './place.types';

interface SearchEmptyStateProps {
  keyword: string;
}

interface SearchListProps {
  searchResults: SearchedPlaceType[];
  searchedKeyword: string;
  onSelectPlace: (place: SearchedPlaceType) => void;
}

type AddressType = '도로명' | '지번';

interface SearchAddressProps {
  addressType: AddressType;
  address: string;
}

interface SearchPlaceProps extends SearchAddressProps {
  searchResult: SearchedPlaceType;
  onSelect?: () => void;
}

export type {
  SearchEmptyStateProps,
  SearchListProps,
  AddressType,
  SearchAddressProps,
  SearchPlaceProps,
};
