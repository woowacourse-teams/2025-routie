import { css } from '@emotion/react';

import Flex from '@/@common/components/Flex/Flex';
import Pill from '@/@common/components/Pill/Pill';
import Text from '@/@common/components/Text/Text';
import type { SearchAddressProps } from '@/domains/places/types/searchPlace.types';

const SearchAddress = ({ addressType, address }: SearchAddressProps) => {
  return (
    <Flex gap={0.5} justifyContent="flex-start">
      <Pill
        type="distance"
        css={css`
          padding: 0.3rem;
        `}
      >
        <Text variant="description">{addressType}</Text>
      </Pill>
      <Text variant="label">{address}</Text>
    </Flex>
  );
};

export default SearchAddress;
