import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import useSearchPlace from '../../hooks/useSearchPlace';
import { PlaceLocationType, PlaceSearchType } from '../../types/place.types';
import SearchEmptyList from '../SearchList/SearchEmptyList';
import SearchList from '../SearchList/SearchList';

interface SearchBoxProps {
  onChange: (
    field: 'name' | 'roadAddressName' | 'addressName',
    value: string,
  ) => void;
  handleSearchPlaceMap: (searchInfo: PlaceLocationType) => void;
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

  const handleSelect = (searchPlace: PlaceSearchType) => {
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
    <Flex direction="row" gap={1} width="100%" css={{ position: 'relative' }}>
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
      >
        <Flex width="100%">
          <Text color={theme.colors.white} variant="label">
            검색
          </Text>
        </Flex>
      </Button>
      <Flex
        width="100%"
        css={{ position: 'absolute', top: '100%', marginTop: '1rem' }}
      >
        {searchResults && searchResults.length > 0 ? (
          <SearchList
            searchResults={searchResults}
            handleSelect={handleSelect}
          />
        ) : (
          searchResults?.length === 0 && <SearchEmptyList keyword={keyword} />
        )}
      </Flex>
    </Flex>
  );
};

export default SearchBox;
