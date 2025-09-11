import { css } from '@emotion/react';

import Button from '@/@common/components/Button/Button';
import EmptyMessage from '@/@common/components/EmptyMessage/EmptyMessage';
import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import useSearchPlace from '../../hooks/useSearchPlace';
import SearchList from '../SearchList/SearchList';
import { ListStyle } from '../SearchList/SearchList.styles';

interface SearchBoxProps {
  onClose: () => void;
}

const SearchBox = ({ onClose }: SearchBoxProps) => {
  const {
    keyword,
    searchResults,
    handleChangeKeyword,
    handleSearch,
    handleEnterSearch,
    submittedKeyword,
  } = useSearchPlace();

  return (
    <Flex gap={1} width="100%" direction="column">
      <Flex width="100%" justifyContent="space-between" gap={1}>
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
          <Flex width="100%">
            <Text color={theme.colors.white} variant="label">
              검색
            </Text>
          </Flex>
        </Button>
      </Flex>
      <Flex
        direction="column"
        width="100%"
        css={css`
          top: 100%;
          margin-top: 1rem;
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
            submittedKeyword={submittedKeyword}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default SearchBox;
