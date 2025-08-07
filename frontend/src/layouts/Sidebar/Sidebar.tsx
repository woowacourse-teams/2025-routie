import { useMemo, useState } from 'react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Header from '@/@common/components/Header/Header';
import Text from '@/@common/components/Text/Text';
import ToggleSwitch from '@/@common/components/ToggleSwitch/ToggleSwitch';
import AddPlaceModal from '@/domains/places/components/AddPlaceModal/AddPlaceModal';
import EmptyRoutieMessage from '@/domains/routie/components/EmptyRoutieMessage/EmptyRoutieMessage';
import RoutieSection from '@/domains/routie/components/RoutieSection/RoutieSection';
import RoutieValidationResultCard from '@/domains/routie/components/RoutieValidationResultCard/RoutieValidationResultCard';
import RoutieValidationUnavailableCard from '@/domains/routie/components/RoutieValidationUnavailableCard/RoutieValidationUnavailableCard';
import { useRoutieContext } from '@/domains/routie/contexts/useRoutieContext';
import { useRoutieValidateContext } from '@/domains/routie/contexts/useRoutieValidateContext';
import RoutieSpaceName from '@/domains/routieSpace/components/RoutieSpaceName/RoutieSpaceName';
import { useGoogleEventTrigger } from '@/libs/googleAnalytics/hooks/useGoogleEventTrigger';

import { usePlaceListContext } from '../PlaceList/contexts/PlaceListContext';

import TimeInput from './TimeInput';

interface SidebarProps {
  handleViewModeChange: () => void;
}

const Sidebar = ({ handleViewModeChange }: SidebarProps) => {
  const { routes, routiePlaces } = useRoutieContext();
  const { refetchPlaceList } = usePlaceListContext();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const {
    isValidateActive,
    routieTime,
    handleValidateToggle,
    handleTimeChange,
  } = useRoutieValidateContext();
  const { triggerEvent } = useGoogleEventTrigger();

  const totalMovingTime = useMemo(() => {
    return routes?.reduce((acc, cur) => acc + cur.duration, 0) ?? 0;
  }, [routes]);

  const openAddModal = () => {
    triggerEvent({
      action: 'click',
      category: 'place',
      label: '장소 추가하기 모달 열기 버튼',
    });
    setAddModalOpen((prev) => !prev);
  };

  const closeAddModal = () => {
    setAddModalOpen((prev) => !prev);
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
        <Header handleViewModeChange={handleViewModeChange} />
        <Flex
          direction="column"
          width="100%"
          gap={1.2}
          padding={1.6}
          justifyContent="flex-start"
        >
          <Flex direction="column" width="100%" gap={1.2}>
            <RoutieSpaceName />
            <Button variant="primary" onClick={openAddModal}>
              <Flex width="100%">
                <Text variant="subTitle" color="white">
                  + 장소 추가하기
                </Text>
              </Flex>
            </Button>
          </Flex>
          <Flex justifyContent="flex-end" width="100%" gap={1}>
            <Text variant="subTitle">일정 검증</Text>
            <ToggleSwitch
              active={isValidateActive}
              onToggle={handleValidateToggle}
            />
          </Flex>

          {isValidateActive ? (
            <RoutieValidationResultCard total_time={totalMovingTime} />
          ) : (
            <RoutieValidationUnavailableCard />
          )}
          <TimeInput time={routieTime} onChange={handleTimeChange} />
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
          <Text variant="subTitle">내 동선</Text>
          {routiePlaces.length === 0 && <EmptyRoutieMessage />}
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
      <AddPlaceModal
        isOpen={addModalOpen}
        onClose={closeAddModal}
        onPlaceAdded={refetchPlaceList}
      />
    </>
  );
};

export default Sidebar;
