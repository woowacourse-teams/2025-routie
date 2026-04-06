import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import { useSuspenseUserQuery } from '@/domains/auth/queries/useAuthQuery';
import theme from '@/styles/theme';

import { BannerContainerStyle } from './ManageRoutieSpaceBanner.styles';

const ManageRoutieSpaceBanner = () => {
  const { data: user } = useSuspenseUserQuery();

  return (
    <div css={BannerContainerStyle}>
      <Flex
        height="100%"
        width="70%"
        maxWidth="1580px"
        margin="0 auto"
        padding="0 0 3rem"
        justifyContent="flex-start"
        alignItems="flex-end"
      >
        <Text variant="title" color={theme.colors.white}>
          {user.nickname}
        </Text>
      </Flex>
    </div>
  );
};

export default ManageRoutieSpaceBanner;
