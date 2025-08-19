import { useMemo } from 'react';

import EmptyMessage from '@/@common/components/EmptyMessage/EmptyMessage';
import Flex from '@/@common/components/Flex/Flex';
import Header from '@/@common/components/Header/Header';
import Text from '@/@common/components/Text/Text';
import ToggleSwitch from '@/@common/components/ToggleSwitch/ToggleSwitch';
import RoutieSection from '@/domains/routie/components/RoutieSection/RoutieSection';
import RoutieValidationLoadingCard from '@/domains/routie/components/RoutieValidationLoadingCard/RoutieValidationLoadingCard';
import RoutieValidationResultCard from '@/domains/routie/components/RoutieValidationResultCard/RoutieValidationResultCard';
import RoutieValidationUnavailableCard from '@/domains/routie/components/RoutieValidationUnavailableCard/RoutieValidationUnavailableCard';
import RoutieValidationWaitingCard from '@/domains/routie/components/RoutieValidationWaitingCard/RoutieValidationWaitingCard';
import SelectMovingStrategy from '@/domains/routie/components/SelectMovingStrategy/SelectMovingStrategy';
import { useRoutieContext } from '@/domains/routie/contexts/useRoutieContext';
import { useRoutieValidateContext } from '@/domains/routie/contexts/useRoutieValidateContext';
import RoutieSpaceName from '@/domains/routieSpace/components/RoutieSpaceName/RoutieSpaceName';

import DateInput from './DateInput';
import TimeInput from './TimeInput';

const Sidebar = () => {
  const { routes, routiePlaces } = useRoutieContext();
  const {
    isValidateActive,
    validationStatus,
    waitingReason,
    handleValidateToggle,
  } = useRoutieValidateContext();

  const totalMovingTime = useMemo(() => {
    return routes?.reduce((acc, cur) => acc + cur.duration, 0) ?? 0;
  }, [routes]);

  const renderValidationCard = () => {
    if (!isValidateActive) {
      return <RoutieValidationUnavailableCard />;
    }

    switch (validationStatus) {
      case 'waiting':
        return <RoutieValidationWaitingCard reason={waitingReason} />;
      case 'validating':
        return <RoutieValidationLoadingCard />;
      case 'success':
      case 'error':
        return <RoutieValidationResultCard total_time={totalMovingTime} />;
      case 'inactive':
      default:
        return <RoutieValidationUnavailableCard />;
    }
  };

  return (
    <>
      <Flex
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        width="50rem"
        height="100vh"
        gap={1}
        style={{
          overflow: 'hidden',
        }}
      >
        <Header />
        <Flex
          direction="column"
          width="100%"
          gap={1.2}
          padding={1.6}
          justifyContent="flex-start"
        >
          <Flex direction="column" width="100%" gap={1.2}>
            <RoutieSpaceName />
          </Flex>
          <Flex justifyContent="flex-end" width="100%" gap={1}>
            <Text variant="subTitle">일정 검증</Text>
            <ToggleSwitch
              active={isValidateActive}
              onToggle={handleValidateToggle}
            />
          </Flex>
          {renderValidationCard()}
          <SelectMovingStrategy />
          <DateInput />
          <TimeInput />
        </Flex>
        <Flex
          direction="column"
          alignItems="flex-start"
          width="100%"
          gap={1.2}
          padding={1.6}
          style={{
            overflow: 'hidden',
          }}
        >
          <Flex padding={0.5} justifyContent="space-between" width="100%">
            <Text variant="subTitle">내 동선</Text>
            <Text variant="caption" color="gray">
              {routiePlaces.length}개의 장소가 동선에 추가되었어요
            </Text>
          </Flex>
          {routiePlaces.length === 0 && (
            <EmptyMessage
              messages={[
                '아직 동선이 없습니다.',
                '장소 목록에서 2곳 이상을 선택하면 동선이 생성됩니다!',
              ]}
            />
          )}
          <Flex
            direction="column"
            justifyContent="flex-start"
            width="100%"
            padding={1.6}
            style={{
              overflowY: 'auto',
              boxSizing: 'border-box',
            }}
          >
            <RoutieSection />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Sidebar;
