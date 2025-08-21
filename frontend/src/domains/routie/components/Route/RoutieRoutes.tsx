import Flex from '@/@common/components/Flex/Flex';
import Pill from '@/@common/components/Pill/Pill';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import { MOVING_EN_TO_KR } from '../../constants/translate';
import { useRoutieContext } from '../../contexts/useRoutieContext';
import { Routes } from '../../types/routie.types';
import { convertMetersToKilometers } from '../../utils/format';
import formatMinutesToHours from '../../utils/formatMinutesToHours';

interface RoutieRoutesProps {
  routieId: number;
  routes: Routes;
}

const RoutieRoutes = ({ routieId, routes }: RoutieRoutesProps) => {
  const { movingStrategy, fetchedStrategy } = useRoutieContext();

  const isUpdating = movingStrategy !== fetchedStrategy;

  return isUpdating ? (
    <Flex key={routieId} margin={1} gap={1}>
      <Text variant="description">--- ---</Text>
      <Pill type="distance">
        <Text variant="description" color={theme.colors.purple[400]}>
          --- km
        </Text>
      </Pill>
    </Flex>
  ) : (
    <Flex key={routieId} margin={1} gap={1}>
      <Text variant="description">
        {MOVING_EN_TO_KR[fetchedStrategy]}{' '}
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
