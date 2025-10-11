import { SearchedPlaceType } from './place.types';

interface SearchEmptyStateProps {
  keyword: string;
}

interface SearchListProps {
  searchResults: SearchedPlaceType[];
  onClose: () => void;
  searchedKeyword: string;
}

type AddressType = '도로명' | '지번';

interface SearchAddressProps {
  addressType: AddressType;
  address: string;
}

interface SearchPlaceProps extends SearchAddressProps {
  searchResult: SearchedPlaceType;
  onClose: () => void;
}

export type {
  SearchEmptyStateProps,
  SearchListProps,
  AddressType,
  SearchAddressProps,
  SearchPlaceProps,
};
