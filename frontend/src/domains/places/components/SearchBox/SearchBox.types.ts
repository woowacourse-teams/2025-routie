import type { PlaceSearchType } from '../../types/place.types';

interface SearchBoxProps {
  onChange: (
    field: 'name' | 'roadAddressName' | 'addressName',
    value: string | null,
  ) => void;
  handleSearchPlaceMap: (searchInfo: PlaceSearchType) => void;
}

export type { SearchBoxProps };
