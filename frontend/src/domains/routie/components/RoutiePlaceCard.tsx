import Card from '@/@common/components/Card/Card';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import dragIcon from '@/assets/icons/drag.svg';

const RoutiePlaceCard = () => {
  return (
    <Card id={'1'} width="45rem" variant="default">
      <Flex justifyContent="flex-start" gap={1.5}>
        <img src={dragIcon} alt="input-icon" />
        <Flex direction="column" alignItems="flex-start" gap={1.1} width="100%">
          <Flex width="100%" justifyContent="space-between">
            <Text variant="caption">강남역</Text>
            <Flex gap={0.4}>
              <Text variant="caption">걸리는 시간</Text>
              <Text variant="caption">선택 취소</Text>
            </Flex>
          </Flex>
          <Text variant="label" color={theme.colors.gray[200]}>
            서울특별시 강남구 강남대로
          </Text>
          <Text variant="caption">시간</Text>
        </Flex>
      </Flex>
    </Card>
  );
};

export default RoutiePlaceCard;
