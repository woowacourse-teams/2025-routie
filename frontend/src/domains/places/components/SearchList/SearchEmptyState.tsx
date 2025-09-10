import EmptyMessage from '@/@common/components/EmptyMessage/EmptyMessage';

import { ListStyle } from './SearchList.styles';

interface SearchEmptyStateProps {
  keyword: string;
}

const SearchEmptyState = ({ keyword }: SearchEmptyStateProps) => {
  return (
    <ul css={ListStyle}>
      <EmptyMessage
        messages={[
          `"${keyword}"에 대한 검색 결과가 없습니다.`,
          '장소를 다시 검색해주세요!',
        ]}
      />
    </ul>
  );
};
export default SearchEmptyState;
