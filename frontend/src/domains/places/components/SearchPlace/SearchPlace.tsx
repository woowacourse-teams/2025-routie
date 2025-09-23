import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import SearchAddress from '@/domains/places/components/SearchAddress/SearchAddress';
import { usePlaceList } from '@/domains/places/hooks/usePlaceList';
import type { SearchPlaceProps } from '@/domains/places/types/searchPlace.types';
import theme from '@/styles/theme';

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
    <Flex justifyContent="space-between">
      <Flex gap={1}>
        <Icon name="pin" />
        <Flex direction="column" alignItems="flex-start" gap={0.5}>
          <Text variant="caption">{searchResult.name}</Text>
          <SearchAddress addressType={addressType} address={address} />
        </Flex>
      </Flex>
      <Button onClick={() => handleSubmit()} variant="primary" width="20%">
        <Text variant="caption" color={theme.colors.white}>
          추가하기
        </Text>
      </Button>
    </Flex>
  );
};

export default SearchPlace;
