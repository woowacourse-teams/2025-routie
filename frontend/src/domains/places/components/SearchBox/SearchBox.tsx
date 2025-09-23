import { css } from '@emotion/react';

import Button from '@/@common/components/Button/Button';
import EmptyMessage from '@/@common/components/EmptyMessage/EmptyMessage';
import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';
import Text from '@/@common/components/Text/Text';
import SearchList from '@/domains/places/components/SearchList/SearchList';
import { ListStyle } from '@/domains/places/components/SearchList/SearchList.styles';
import { useSearchPlace } from '@/domains/places/hooks/useSearchPlace';
import type { SearchBoxProps } from '@/domains/places/types/searchPlace.types';
import theme from '@/styles/theme';

const SearchBox = ({ onClose }: SearchBoxProps) => {
  const {
    keyword,
    searchResults,
    handleChangeKeyword,
    handleSearch,
    handleEnterSearch,
    searchedKeyword,
  } = useSearchPlace();

  return (
    <Flex gap={1} direction="column">
      <Flex justifyContent="space-between" gap={1}>
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
        >
          <Text color={theme.colors.white} variant="label">
            검색
          </Text>
        </Button>
      </Flex>
      <Flex
        direction="column"
        margin="1rem 0 0 0"
        css={css`
          top: 100%;
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
            onClose={onClose}
            searchedKeyword={searchedKeyword}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default SearchBox;
