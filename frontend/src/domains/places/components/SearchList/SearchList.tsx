import type { SearchListProps } from '@/domains/places/types/searchPlace.types';

import SearchPlace from '../SearchPlace/SearchPlace';

import SearchEmptyList from './SearchEmptyList';
import { ItemButtonStyle, ListStyle } from './SearchList.styles';

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
        <SearchEmptyList keyword={searchedKeyword} />
      )}
    </ul>
  );
};

export default SearchList;
