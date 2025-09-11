import SearchPlace from '../SearchPlace/SearchPlace';
import SearchEmptyState from './SearchEmptyState';
import { ItemButtonStyle, ListStyle } from './SearchList.styles';

import type { SearchListProps } from './SearchList.types';

const SearchList = ({
  searchResults,
  onClose,
  searchedKeyword,
}: SearchListProps) => {
  return (
    <ul css={ListStyle}>
      {searchResults.length > 0 ? (
        searchResults?.map((searchResult) => {
          const addressType = searchResult.roadAddressName ? '도로명' : '지번';
          const address =
            searchResult.roadAddressName ?? searchResult.addressName;

          return (
            <li key={searchResult.searchedPlaceId}>
              <div css={ItemButtonStyle}>
                <SearchPlace
                  searchResult={searchResult}
                  addressType={addressType}
                  address={address}
                  onClose={onClose}
                />
              </div>
            </li>
          );
        })
      ) : (
        <SearchEmptyState keyword={searchedKeyword} />
      )}
    </ul>
  );
};

export default SearchList;
