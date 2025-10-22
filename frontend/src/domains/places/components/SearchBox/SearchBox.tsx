import { useEffect, useRef, useState } from 'react';

import { css } from '@emotion/react';

import Button from '@/@common/components/Button/Button';
import EmptyMessage from '@/@common/components/EmptyMessage/EmptyMessage';
import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';
import Text from '@/@common/components/Text/Text';
import AddHashtagDropdown from '@/domains/places/components/AddHashtagDropdown/AddHashtagDropdown';
import SearchList from '@/domains/places/components/SearchList/SearchList';
import { usePlaceList } from '@/domains/places/hooks/usePlaceList';
import { useSearchPlace } from '@/domains/places/hooks/useSearchPlace';
import type { SearchedPlaceType } from '@/domains/places/types/place.types';
import theme from '@/styles/theme';

import {
  ContainerStyle,
  SearchBoxWrapperStyle,
  DropdownContainerStyle,
  ListStyle,
  SearchButtonStyle,
} from './SearchBox.styles';

const SearchBox = () => {
  const {
    keyword,
    searchResults,
    handleChangeKeyword,
    handleSearch,
    handleEnterSearch,
    searchedKeyword,
    isDropdownOpen,
    handleCloseDropdown,
    handleReset,
  } = useSearchPlace();

  const { handleAddPlace } = usePlaceList();

  const [selectedPlace, setSelectedPlace] = useState<SearchedPlaceType | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelectPlace = (place: SearchedPlaceType) => {
    setSelectedPlace(place);
  };

  const handleCancelHashtag = () => {
    setSelectedPlace(null);
  };

  const handleSubmitHashtag: (
    place: SearchedPlaceType,
  ) => Promise<void> = async (place) => {
    await handleAddPlace(place);
    setSelectedPlace(null);
    handleCloseDropdown();
    handleReset();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleCloseDropdown();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isDropdownOpen, handleCloseDropdown]);

  return (
    <section
      ref={containerRef}
      css={css`
        width: 100%;
        padding: 1rem 0;
      `}
    >
      <Flex gap={1} direction="column" css={ContainerStyle}>
        <Flex justifyContent="space-between" gap={1} padding="0 1rem">
          <Input
            id="search"
            value={keyword}
            icon="search"
            placeholder="장소를 검색하세요"
            onChange={handleChangeKeyword}
            onKeyDown={keyword ? handleEnterSearch : undefined}
            maxLength={15}
            autoFocus
          />
          <Button
            variant="primary"
            width="20%"
            radius="lg"
            type="button"
            onClick={handleSearch}
            disabled={!keyword}
            padding="0.8rem 0.8rem"
            css={SearchButtonStyle}
          >
            <Text color={theme.colors.white} variant="caption">
              검색
            </Text>
          </Button>
        </Flex>
        {isDropdownOpen && searchedKeyword && (
          <Flex direction="column" padding="0 1rem" css={SearchBoxWrapperStyle}>
            {selectedPlace ? (
              <Flex
                direction="column"
                gap={2}
                padding={2}
                css={DropdownContainerStyle}
              >
                <AddHashtagDropdown
                  place={selectedPlace}
                  addressType={
                    selectedPlace.roadAddressName ? '도로명' : '지번'
                  }
                  address={
                    selectedPlace.roadAddressName ?? selectedPlace.addressName
                  }
                  onCancel={handleCancelHashtag}
                  onSubmit={handleSubmitHashtag}
                />
              </Flex>
            ) : searchResults === null ? (
              <ul css={[DropdownContainerStyle, ListStyle]}>
                <EmptyMessage
                  messages={['검색된 장소가 없습니다.', '장소를 검색해주세요!']}
                />
              </ul>
            ) : (
              <SearchList
                searchResults={searchResults!}
                searchedKeyword={searchedKeyword}
                onSelectPlace={handleSelectPlace}
              />
            )}
          </Flex>
        )}
      </Flex>
    </section>
  );
};

export default SearchBox;
