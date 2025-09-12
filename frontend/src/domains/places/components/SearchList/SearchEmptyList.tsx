import EmptyMessage from '@/@common/components/EmptyMessage/EmptyMessage';
import type { SearchEmptyListProps } from '@/domains/places/types/searchPlace.types';

const SearchEmptyList = ({ keyword }: SearchEmptyListProps) => {
  return (
    <EmptyMessage
      messages={[
        `"${keyword}"에 대한 검색 결과가 없습니다.`,
        '장소를 다시 검색해주세요!',
      ]}
    />
  );
};

export default SearchEmptyList;
