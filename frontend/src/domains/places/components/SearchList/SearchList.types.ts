import type { SearchedPlaceType } from '../../types/place.types';

interface SearchEmptyStateProps {
  keyword: string;
}

interface SearchListProps {
  searchResults: SearchedPlaceType[];
  onClose: () => void;
  searchedKeyword: string;
}

export type { SearchEmptyStateProps, SearchListProps };
