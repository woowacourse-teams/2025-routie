import SearchPlace from '@/domains/places/components/SearchPlace/SearchPlace';
import type { SearchListProps } from '@/domains/places/types/searchPlace.types';

import SearchEmptyState from './SearchEmptyState';
import { ListWrapperStyle, ListStyle, ListItemStyle } from './SearchList.styles';

const SearchList = ({
  searchResults,
  searchedKeyword,
  onSelectPlace,
}: SearchListProps) => {
  return (
    <div css={ListWrapperStyle}>
      <ul css={ListStyle}>
        {searchResults.length > 0 ? (
          searchResults?.map((searchResult) => {
            const addressType = searchResult.roadAddressName ? '도로명' : '지번';
            const address =
              searchResult.roadAddressName ?? searchResult.addressName;

            return (
              <li key={searchResult.searchedPlaceId}>
                <div css={ListItemStyle}>
                  <SearchPlace
                    searchResult={searchResult}
                    addressType={addressType}
                    address={address}
                    onSelect={() => onSelectPlace(searchResult)}
                  />
                </div>
              </li>
            );
          })
        ) : (
          <SearchEmptyState keyword={searchedKeyword} />
        )}
      </ul>
    </div>
  );
};

export default SearchList;
