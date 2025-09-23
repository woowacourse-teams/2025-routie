import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import { CardStyle, CircleStyle } from './InfoCard.styles';

import type { InfoCardProps } from './InfoCard.types';

const InfoCard = ({
  circleColor,
  iconName,
  iconAlt,
  title,
  descriptions,
  size = '30rem',
  textColor = `${theme.home.text}`,
}: InfoCardProps) => {
  return (
    <Flex width={size} height={size} alignItems="stretch" css={CardStyle}>
      <Flex direction="column" justifyContent="space-between">
        <Flex width="6rem" height="6rem" css={CircleStyle(circleColor)}>
          <Icon name={iconName} alt={iconAlt} size={40} />
        </Flex>

        <Text variant="title" color={textColor}>
          {title}
        </Text>

        <Flex direction="column" gap={0.4}>
          {descriptions.map((line, i) => (
            <Text key={i} variant="body" color={textColor}>
              {line}
            </Text>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default InfoCard;
