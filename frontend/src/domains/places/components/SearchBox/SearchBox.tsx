import { useState } from 'react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import { PlaceLocationType, PlaceSearchType } from '../../types/place.types';
import SearchList from '../SearchList/SearchList';

import searchPlacesMockData from './searchPlacesMockData';

interface SearchBoxProps {
  onChange: (field: 'name' | 'address', value: string | number) => void;
  handleSearchPlaceMap: (searchInfo: PlaceLocationType) => void;
}

const SearchBox = ({ onChange, handleSearchPlaceMap }: SearchBoxProps) => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<PlaceSearchType[]>([]);

  const handleSearch = () => {
    if (!keyword) return setSearchResults([]);
    // api 호출
    setSearchResults(searchPlacesMockData);
  };

  const handleReset = () => {
    setKeyword('');
    setSearchResults([]);
  };

  const handleSelect = (searchPlace: PlaceSearchType) => {
    handleReset();
    onChange('name', searchPlace.placeName);
    onChange('address', searchPlace.roadAddressName);

    handleSearchPlaceMap({
      id: searchPlace.id,
      longitude: searchPlace.longitude,
      latitude: searchPlace.latitude,
    });
  };

  return (
    <>
      <Flex direction="row" gap={1} width="100%" css={{ position: 'relative' }}>
        <Input
          id="search"
          value={keyword}
          icon="search"
          placeholder="장소를 검색하세요"
          onChange={setKeyword}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
        <Button
          variant="primary"
          width="20%"
          type="button"
          onClick={() => handleSearch()}
        >
          <Flex justifyContent="center" width="100%">
            <Text color={theme.colors.white} variant="label">
              검색
            </Text>
          </Flex>
        </Button>
      </Flex>
      <Flex width="100%" css={{ position: 'relative' }}>
        {searchResults.length > 0 && (
          <SearchList searchResults={searchResults} onClick={handleSelect} />
        )}
      </Flex>
    </>
  );
};

export default SearchBox;
