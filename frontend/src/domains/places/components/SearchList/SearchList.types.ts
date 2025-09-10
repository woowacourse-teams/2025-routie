import type { PlaceAddType } from '../../types/place.types';

interface SearchEmptyStateProps {
  keyword: string;
}

interface SearchListProps {
  searchResults: PlaceAddType[];
  handleSelect: (item: PlaceAddType) => void;
}

export type { SearchEmptyStateProps, SearchListProps };
