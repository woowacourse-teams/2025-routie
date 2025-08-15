import { css } from '@emotion/react';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

const EmptyRoutieMessage = () => (
  <Flex
    width="100%"
    direction="column"
    gap={1}
    css={css`
      padding: 8rem 0;
    `}
  >
    <Text variant="subTitle" color={theme.colors.gray[200]}>
      아직 동선이 없습니다.
    </Text>
    <Text variant="subTitle" color={theme.colors.gray[200]}>
      장소 목록에서 2곳 이상을 선택하면 동선이 생성됩니다!
    </Text>
  </Flex>
);

export default EmptyRoutieMessage;
