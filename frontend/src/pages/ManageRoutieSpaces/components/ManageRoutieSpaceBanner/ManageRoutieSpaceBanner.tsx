import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import { useUserQuery } from '@/domains/auth/queries/useAuthQuery';
import theme from '@/styles/theme';

import { BannerContainerStyle } from './ManageRoutieSpaceBanner.styles';

const ManageRoutieSpaceBanner = () => {
  const { data: user, isLoading } = useUserQuery();

  return (
    <div css={BannerContainerStyle}>
      <Flex
        height="100%"
        width="70%"
        margin="0 auto"
        padding="0 0 3rem"
        justifyContent="flex-start"
        alignItems="flex-end"
      >
        <Text variant="title" color={theme.colors.white}>
          {isLoading ? '닉네임 로딩중...' : user?.nickname}
        </Text>
      </Flex>
    </div>
  );
};

export default ManageRoutieSpaceBanner;
