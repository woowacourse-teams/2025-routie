import Text from '@/@common/components/Text/Text';

import { itemEmptyStyle, listStyle } from '../SearchList/SearchList.styles';

interface SearchEmptyList {
  keyword: string;
}

const SearchEmptyList = ({ keyword }: SearchEmptyList) => {
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
export default SearchEmptyList;
