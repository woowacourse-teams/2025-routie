import EmptyMessage from '@/@common/components/EmptyMessage/EmptyMessage';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import RoutieSection from '@/domains/routie/components/RoutieSection/RoutieSection';
import { useRoutieList } from '@/domains/routie/hooks/useRoutieList';

import {
  RouteViewContainerStyle,
  RoutieListContainerStyle,
} from './RouteView.styles';

const RouteView = () => {
  const { routiePlaces } = useRoutieList();

  return (
    <Flex direction="column" height="100%" css={RouteViewContainerStyle}>
      <Flex padding={0.5} justifyContent="flex-start" gap={1}>
        <Text variant="subTitle">내가 갈 곳</Text>
        <Text variant="label" color="gray">
          {routiePlaces.length}개의 장소
        </Text>
      </Flex>

      {routiePlaces.length === 0 && (
        <Flex height="100%">
          <EmptyMessage
            messages={[
              '아직 동선이 없습니다.',
              '장소 목록에서 2곳 이상을 선택하면 동선이 생성됩니다!',
            ]}
          />
        </Flex>
      )}
      <Flex
        direction="column"
        justifyContent="flex-start"
        padding={1}
        css={RoutieListContainerStyle}
        height="100%"
        gap={1}
      >
        <RoutieSection />
      </Flex>
    </Flex>
  );
};

export default RouteView;
