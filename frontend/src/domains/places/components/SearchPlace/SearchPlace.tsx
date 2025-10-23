import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import SearchAddress from '@/domains/places/components/SearchAddress/SearchAddress';
import type { SearchPlaceProps } from '@/domains/places/types/searchPlace.types';
import theme from '@/styles/theme';

const SearchPlace = ({
  searchResult,
  addressType,
  address,
  onSelect,
}: SearchPlaceProps) => {
  return (
    <Flex justifyContent="space-between">
      <Flex gap={1}>
        <Icon name="pin" />
        <Flex direction="column" alignItems="flex-start" gap={0.5}>
          <Text variant="body">{searchResult.name}</Text>
          <SearchAddress addressType={addressType} address={address} />
        </Flex>
      </Flex>
      <Button
        onClick={onSelect}
        variant="primary"
        width="20%"
        padding="0.6rem 0.8rem"
      >
        <Text variant="label" color={theme.colors.white}>
          선택하기
        </Text>
      </Button>
    </Flex>
  );
};

export default SearchPlace;
