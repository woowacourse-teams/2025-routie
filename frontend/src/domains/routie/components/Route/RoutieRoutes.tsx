import Flex from '@/@common/components/Flex/Flex';
import Pill from '@/@common/components/Pill/Pill';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import { MOVING_EN_TO_KR } from '../../constants/translate';
import { Routes, Routie } from '../../types/routie.types';
import { convertMetersToKilometers } from '../../utils/format';

interface RoutieRoutesProps {
  place: Routie;
  routes: Routes;
}

const RoutieRoutes = ({ place, routes }: RoutieRoutesProps) => {
  return (
    <Flex key={place.id} margin={1} gap={1}>
      <Text variant="description">
        {MOVING_EN_TO_KR[routes.movingStrategy]} {routes.duration}분
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
