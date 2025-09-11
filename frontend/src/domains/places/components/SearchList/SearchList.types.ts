import type { PlaceAddType } from '../../types/place.types';

interface SearchEmptyStateProps {
  keyword: string;
}

interface SearchListProps {
  searchResults: PlaceAddType[];
  onClose: () => void;
  searchedKeyword: string;
}

export type { SearchEmptyStateProps, SearchListProps };
