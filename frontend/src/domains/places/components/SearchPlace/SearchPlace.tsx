import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import pinIcon from '@/assets/icons/pin.svg';
import type { SearchPlaceProps } from '@/domains/places/types/searchPlace.types';
import theme from '@/styles/theme';

import { usePlaceList } from '../../hooks/usePlaceList';
import SearchAddress from '../SearchAddress/SearchAddress';

const SearchPlace = ({
  searchResult,
  addressType,
  address,
  onClose,
}: SearchPlaceProps) => {
  const { handleAddPlace } = usePlaceList();

  const handleSubmit = async () => {
    await handleAddPlace(searchResult);

    onClose();
  };

  return (
    <Flex justifyContent="space-between" width="100%">
      <Flex gap={1}>
        <img src={pinIcon} alt="pin" />
        <Flex direction="column" alignItems="flex-start" gap={0.5} width="100%">
          <Text variant="caption">{searchResult.name}</Text>
          <SearchAddress addressType={addressType} address={address} />
        </Flex>
      </Flex>
      <Button onClick={() => handleSubmit()} variant="primary" width="20%">
        <Flex width="100%" justifyContent="center">
          <Text variant="caption" color={theme.colors.white}>
            추가하기
          </Text>
        </Flex>
      </Button>
    </Flex>
  );
};

export default SearchPlace;
