import EmptyMessage from '@/@common/components/EmptyMessage/EmptyMessage';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import RoutieSection from '@/domains/routie/components/RoutieSection/RoutieSection';
import { useRoutieList } from '@/domains/routie/hooks/useRoutieList';

import {
  RoutieSectionScrollStyle,
  SidebarSectionStyle,
} from './Sidebar.styles';

const SidebarWhereSection = () => {
  const { routiePlaces } = useRoutieList();

  return (
    <Flex
      direction="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      width="90%"
      height="100%"
      gap={1.2}
      padding={1.6}
      css={SidebarSectionStyle(true)}
    >
      <Flex padding={0.5} justifyContent="space-between" width="100%">
        <Flex width="100%" justifyContent="flex-start" gap={1}>
          <Text variant="title2">내가 갈 곳</Text>
          <Text variant="label" color="gray">
            {routiePlaces.length}개의 장소
          </Text>
        </Flex>
      </Flex>

      {routiePlaces.length === 0 && (
        <Flex width="100%" height="100%">
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
        width="100%"
        padding={1.6}
        css={RoutieSectionScrollStyle}
      >
        <RoutieSection />
      </Flex>
    </Flex>
  );
};

export default SidebarWhereSection;
