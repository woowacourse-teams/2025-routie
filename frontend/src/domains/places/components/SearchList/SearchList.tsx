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
      {searchResults?.map((searchResult) => {
        const isRoadAddress = Boolean(searchResult.roadAddressName);
        const addressType = isRoadAddress ? '도로명' : '지번';
        const address = isRoadAddress
          ? searchResult.roadAddressName
          : searchResult.addressName;

        return (
          <li key={searchResult.searchedPlaceId}>
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
                  <SearchAddress addressType={addressType} address={address} />
                </Flex>
              </Flex>
            </Button>
          </li>
        );
      })}
    </ul>
  );
};

export default SearchList;
