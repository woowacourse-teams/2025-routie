import EmptyMessage from '@/@common/components/EmptyMessage/EmptyMessage';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import RoutieSection from '@/domains/routie/components/RoutieSection/RoutieSection';
import { useRoutieList } from '@/domains/routie/hooks/useRoutieList';
import theme from '@/styles/theme';

import {
  RouteViewContainerStyle,
  RoutieListContainerStyle,
} from './RouteView.styles';

const RouteView = () => {
  const { routiePlaces } = useRoutieList();

  return (
    <Flex direction="column" height="100%" css={RouteViewContainerStyle}>
      <Flex padding={1} justifyContent="flex-start">
        <Text variant="body" color={theme.colors.gray[200]}>
          순서를 바꿔가며 동선을 수정해보세요
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
        gap={2.4}
      >
        <RoutieSection />
      </Flex>
    </Flex>
  );
};

export default RouteView;
