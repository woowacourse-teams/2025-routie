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
import {
  SidebarSectionStyle,
  SidebarContainerStyle,
  RoutieSectionScrollStyle,
} from './Sidebar.styles';
import TimeInput from './TimeInput';

const Sidebar = () => {
  const { routiePlaces } = useRoutieContext();
  const {
    isValidateActive,
    validationStatus,
    waitingReason,
    handleValidateToggle,
  } = useRoutieValidateContext();

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
        return <RoutieValidationResultCard />;
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
        width="50rem"
        height="100dvh"
        gap={1.6}
        css={SidebarContainerStyle}
      >
        <Header isHome={false}>
          <RoutieSpaceName />
        </Header>
        <Flex
          direction="column"
          gap={2}
          padding={1.6}
          width="90%"
          justifyContent="flex-start"
          css={SidebarSectionStyle(false)}
        >
          <Flex width="100%" justifyContent="flex-start" gap={1}>
            <Text variant="title2">언제, 어떻게 떠날까요?</Text>
          </Flex>
          <Flex width="100%" gap={1.2}>
            <DateInput />
            <TimeInput />
          </Flex>
          <SelectMovingStrategy />
        </Flex>
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
            <Flex width="100%" justifyContent="flex-end" gap={1.5}>
              <Text variant="subTitle">일정 검증</Text>
              <ToggleSwitch
                active={isValidateActive}
                onToggle={handleValidateToggle}
              />
            </Flex>
          </Flex>
          {renderValidationCard()}

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
      </Flex>
    </>
  );
};

export default Sidebar;
