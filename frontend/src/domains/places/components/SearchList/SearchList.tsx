import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import pinIcon from '@/assets/icons/pin.svg';

import { PlaceSearchType } from '../../types/place.types';
import SearchAddress from '../SearchAddress/SearchAddress';

import { listStyle, itemButtonStyle } from './SearchList.styles';

interface SearchListProps {
  searchResults: PlaceSearchType[];
  handleSelect: (item: PlaceSearchType) => void;
}

const SearchList = ({ searchResults, handleSelect }: SearchListProps) => {
  return (
    <ul css={listStyle}>
      {searchResults?.map((searchResult) => (
        <li key={searchResult.name + searchResult.addressName}>
          <Button
            type="button"
            variant="secondary"
            css={itemButtonStyle}
            onClick={() => handleSelect(searchResult)}
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

                {searchResult.roadAddressName ? (
                  <SearchAddress
                    addressType="도로명"
                    address={searchResult.roadAddressName}
                  />
                ) : (
                  <SearchAddress
                    addressType="지번"
                    address={searchResult.addressName}
                  />
                )}
              </Flex>
            </Flex>
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default SearchList;
