/** @jsxImportSource @emotion/react */
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import { TabButtonStyle } from './TabButton.styles';
import { TabButtonProps } from './TabButton.types';

const TabButton = ({
  name,
  icon,
  onClick,
  isActive,
  ...props
}: TabButtonProps) => {
  return (
    <button onClick={onClick} css={TabButtonStyle({ isActive })} {...props}>
      <Icon name={icon} size={30} />
      <Text
        variant="description"
        color={isActive ? theme.colors.white : theme.colors.blue[450]}
      >
        {name}
      </Text>
    </button>
  );
};

export default TabButton;
