import Text from '@/@common/components/Text/Text';

import { itemEmptyStyle, listStyle } from './SearchList.styles';

interface SearchEmptyStateProps {
  keyword: string;
}

const SearchEmptyState = ({ keyword }: SearchEmptyStateProps) => {
  return (
    <ul css={listStyle}>
      <li css={itemEmptyStyle}>
        <Text variant="label">
          {`"${keyword}"에 대한 검색 결과가 없습니다.`}
        </Text>
      </li>
    </ul>
  );
};
export default SearchEmptyState;
