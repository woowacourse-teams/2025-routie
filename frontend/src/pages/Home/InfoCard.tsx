import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import { CardStyle, CircleStyle } from './InfoCard.styles';

interface InfoCardProps {
  circleColor: string;
  iconSrc: string;
  iconAlt: string;
  title: string;
  descriptions: string[];
  size?: string;
  iconSize?: string;
  textColor?: string;
}

const InfoCard = ({
  circleColor,
  iconSrc,
  iconAlt,
  title,
  descriptions,
  size = '30rem',
  iconSize = '40rem',
  textColor = `${theme.home.text}`,
}: InfoCardProps) => {
  return (
    <Flex width={size} height={size} alignItems="stretch" css={CardStyle}>
      <Flex direction="column" justifyContent="space-between" width="100%">
        <Flex width="6rem" height="6rem" css={CircleStyle(circleColor)}>
          <img src={iconSrc} alt={iconAlt} width={iconSize} height={iconSize} />
        </Flex>

        <Text variant="title" color={textColor}>
          {title}
        </Text>

        <Flex direction="column" gap={0.4}>
          {descriptions.map((line, i) => (
            <Text key={i} variant="subTitle" color={textColor}>
              {line}
            </Text>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default InfoCard;
