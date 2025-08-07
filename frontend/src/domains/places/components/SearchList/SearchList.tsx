import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import pinIcon from '@/assets/icons/pin.svg';

import { PlaceSearchType } from '../../types/place.types';

import { listStyle, itemButtonStyle } from './SearchList.styles';

interface SearchListProps {
  searchResults: PlaceSearchType[];
  onClick: (item: PlaceSearchType) => void;
}

const SearchList = ({ searchResults, onClick }: SearchListProps) => {
  return (
    <ul css={listStyle}>
      {searchResults.map((searchResult) => (
        <li key={searchResult.name}>
          <Button
            type="button"
            variant="secondary"
            width="100%"
            css={itemButtonStyle}
            onClick={() => onClick(searchResult)}
          >
            <Flex gap={1}>
              <img src={pinIcon} alt="pin" />
              <Flex
                direction="column"
                alignItems="flex-start"
                gap={0.5}
                width="100%"
              >
                <Text variant="caption">{searchResult.name}</Text>
                <Text variant="label">{searchResult.roadAddressName}</Text>
              </Flex>
            </Flex>
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default SearchList;
