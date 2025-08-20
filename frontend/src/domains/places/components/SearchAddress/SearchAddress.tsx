import { css } from '@emotion/react';

import Flex from '@/@common/components/Flex/Flex';
import Pill from '@/@common/components/Pill/Pill';
import Text from '@/@common/components/Text/Text';

interface SearchAddressProps {
  addressType: '도로명' | '지번';
  address: string;
}

const SearchAddress = ({ addressType, address }: SearchAddressProps) => {
  return (
    <Flex width="100%" gap={0.5} justifyContent="flex-start">
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
