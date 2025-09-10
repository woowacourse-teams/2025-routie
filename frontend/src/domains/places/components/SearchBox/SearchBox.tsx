import { css } from '@emotion/react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import useSearchPlace from '../../hooks/useSearchPlace';
import { PlaceSearchType, PlaceAddType } from '../../types/place.types';
import SearchEmptyState from '../SearchList/SearchEmptyState';
import SearchList from '../SearchList/SearchList';

interface SearchBoxProps {
  onChange: (
    field: 'name' | 'roadAddressName' | 'addressName',
    value: string | null,
  ) => void;
  handleSearchPlaceMap: (searchInfo: PlaceSearchType) => void;
}

const SearchBox = ({ onChange, handleSearchPlaceMap }: SearchBoxProps) => {
  const {
    keyword,
    searchResults,
    handleChangeKeyword,
    handleSearch,
    handleReset,
    handleEnterSearch,
  } = useSearchPlace();
  const hasResults = searchResults && searchResults.length > 0;
  const isEmpty = searchResults && searchResults.length === 0;

  const handleSelect = (searchPlace: PlaceAddType) => {
    handleReset();
    onChange('name', searchPlace.name);
    onChange('roadAddressName', searchPlace.roadAddressName);
    onChange('addressName', searchPlace.addressName);

    handleSearchPlaceMap({
      searchedPlaceId: searchPlace.searchedPlaceId,
      longitude: searchPlace.longitude,
      latitude: searchPlace.latitude,
    });
  };

  return (
    <Flex
      gap={1}
      width="100%"
      css={css`
        position: relative;
      `}
    >
      <Input
        id="search"
        value={keyword}
        icon="search"
        placeholder="장소를 검색하세요"
        onChange={handleChangeKeyword}
        onKeyDown={handleEnterSearch}
        autoFocus
      />
      <Button
        variant="primary"
        width="20%"
        type="button"
        onClick={handleSearch}
        disabled={keyword ? false : true}
      >
        <Flex width="100%">
          <Text color={theme.colors.white} variant="label">
            검색
          </Text>
        </Flex>
      </Button>
      <Flex
        width="100%"
        css={css`
          position: absolute;
          top: 100%;
          margin-top: 1rem;
        `}
      >
        {hasResults ? (
          <SearchList
            searchResults={searchResults!}
            handleSelect={handleSelect}
          />
        ) : (
          isEmpty && <SearchEmptyState keyword={keyword} />
        )}
      </Flex>
    </Flex>
  );
};

export default SearchBox;
