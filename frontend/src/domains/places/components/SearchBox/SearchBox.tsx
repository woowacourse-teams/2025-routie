import { useEffect, useRef } from 'react';

import { css } from '@emotion/react';

import Button from '@/@common/components/Button/Button';
import EmptyMessage from '@/@common/components/EmptyMessage/EmptyMessage';
import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';
import Text from '@/@common/components/Text/Text';
import SearchList from '@/domains/places/components/SearchList/SearchList';
import { ListStyle } from '@/domains/places/components/SearchList/SearchList.styles';
import { useSearchPlace } from '@/domains/places/hooks/useSearchPlace';
import theme from '@/styles/theme';

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
  } = useSearchPlace();

  const containerRef = useRef<HTMLDivElement>(null);

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
    <div
      ref={containerRef}
      css={css`
        width: 100%;
        padding: 1rem 0;
      `}
    >
      <Flex
        gap={1}
        direction="column"
        css={css`
          position: relative;
        `}
      >
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
            type="button"
            onClick={handleSearch}
            disabled={keyword ? false : true}
            padding="0.8rem 0.8rem"
          >
            <Text color={theme.colors.white} variant="label">
              검색
            </Text>
          </Button>
        </Flex>
        {isDropdownOpen && searchedKeyword && (
          <Flex
            direction="column"
            css={css`
              position: absolute;
              z-index: 1000;
              top: 100%;
              right: 0;
              left: 0;

              margin-top: 0.5rem;
            `}
          >
            {searchResults === null ? (
              <ul css={ListStyle}>
                <EmptyMessage
                  messages={['검색된 장소가 없습니다.', '장소를 검색해주세요!']}
                />
              </ul>
            ) : (
              <SearchList
                searchResults={searchResults!}
                onClose={() => {
                  handleCloseDropdown();
                }}
                searchedKeyword={searchedKeyword}
              />
            )}
          </Flex>
        )}
      </Flex>
    </div>
  );
};

export default SearchBox;
