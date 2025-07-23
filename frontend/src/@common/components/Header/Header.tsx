import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import headerStyle from './Header.style';

const Header = () => {
  return (
    <div css={headerStyle}>
      <Flex
        direction="row"
        gap={1}
        height="100%"
        justifyContent="flex-start"
        padding={1}
      >
        <Text variant="title" color={theme.colors.purple[400]}>
          Routie
        </Text>
      </Flex>
    </div>
  );
};

export default Header;
