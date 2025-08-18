import Flex from '@/@common/components/Flex/Flex';
import Pill from '@/@common/components/Pill/Pill';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import { MOVING_EN_TO_KR } from '../../constants/translate';
import { useRoutieContext } from '../../contexts/useRoutieContext';
import { convertMetersToKilometers } from '../../utils/format';
import formatMinutesToHours from '../../utils/formatMinutesToHours';

interface RoutieRoutesProps {
  routie: Routie;
  routes: Routes;
}

const RoutieRoutes = ({ routie, routes }: RoutieRoutesProps) => {
  const { movingStrategy } = useRoutieContext();

  return (
    <Flex key={routie.id} margin={1} gap={1}>
      <Text variant="description">
        {MOVING_EN_TO_KR[movingStrategy]}{' '}
        {formatMinutesToHours(routes.duration)}
      </Text>
      <Pill type="distance">
        <Text variant="description" color={theme.colors.purple[400]}>
          {convertMetersToKilometers(routes.distance)}km
        </Text>
      </Pill>
    </Flex>
  );
};

export default RoutieRoutes;
