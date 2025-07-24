import { useState } from 'react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Header from '@/@common/components/Header/Header';
import Pill from '@/@common/components/Pill/Pill';
import Text from '@/@common/components/Text/Text';
import ToggleSwitch from '@/@common/components/ToggleSwitch/ToggleSwitch';
import AddPlaceModal from '@/domains/places/components/AddPlaceModal/AddPlaceModal';
import RoutiePlaceCard from '@/domains/routie/components/RoutiePlaceCard/RoutiePlaceCard';
import RoutieValidationResultCard from '@/domains/routie/components/RoutieValidationResultCard/RoutieValidationResultCard';
import RoutieValidationUnavailableCard from '@/domains/routie/components/RoutieValidationUnavailableCard/RoutieValidationUnavailableCard';
import { useCardDrag } from '@/domains/routie/hooks/useCardDrag';
import RoutieSpaceName from '@/domains/routieSpace/components/RoutieSpaceName/RoutieSpaceName';
import theme from '@/styles/theme';

import TimeInput from './TimeInput';

const initialTime = {
  startAt: '09:00',
  endAt: '22:00',
};

const places = [
  {
    id: 1,
    name: '카페 베네',
    address: '서울시 강남구 테헤란로 123',
    stayDurationMinutes: 60,
    openAt: '09:00',
    closeAt: '22:00',
    breakStartAt: '12:00',
    breakEndAt: '13:00',
    closedDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
  },
  {
    id: 2,
    name: '카페 베네',
    address: '서울시 강남구 테헤란로 123',
    stayDurationMinutes: 60,
    openAt: '09:00',
    closeAt: '22:00',
    breakStartAt: '12:00',
    breakEndAt: '13:00',
    closedDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
  },
  {
    id: 3,
    name: '카페 베네',
    address: '서울시 강남구 테헤란로 123',
    stayDurationMinutes: 60,
    openAt: '09:00',
    closeAt: '22:00',
    breakStartAt: '12:00',
    breakEndAt: '13:00',
    closedDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
  },
  {
    id: 4,
    name: '카페 베네',
    address: '서울시 강남구 테헤란로 123',
    stayDurationMinutes: 60,
    openAt: '09:00',
    closeAt: '22:00',
    breakStartAt: '12:00',
    breakEndAt: '13:00',
    closedDays: ['MON', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
  },
  {
    id: 5,
    name: '카페 베네',
    address: '서울시 강남구 테헤란로 123',
    stayDurationMinutes: 60,
    openAt: '09:00',
    closeAt: '22:00',
    breakStartAt: '12:00',
    breakEndAt: '13:00',
    closedDays: ['FRI', 'SAT', 'SUN'],
  },
  {
    id: 6,
    name: '카페 베네',
    address: '서울시 강남구 테헤란로 123',
    stayDurationMinutes: 60,
    openAt: '09:00',
    closeAt: '22:00',
    breakStartAt: '12:00',
    breakEndAt: '13:00',
    closedDays: ['MON', 'TUE', 'SAT', 'SUN'],
  },
];

const Sidebar = () => {
  const [routie, setRoutie] = useState(places);
  const getDragProps = useCardDrag(routie, setRoutie);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isValidateActive, setIsValidateActive] = useState(false);
  const [time, setTime] = useState(initialTime);

  const openAddModal = () => {
    setAddModalOpen((prev) => !prev);
  };

  const closeAddModal = () => {
    setAddModalOpen((prev) => !prev);
  };

  const handleValidateToggle = () => {
    setIsValidateActive((prev) => !prev);
  };

  const handleTimeChange = (field: string, value: string) => {
    setTime((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Flex
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        width="50rem"
        gap={1}
      >
        <Header />
        <Flex
          direction="column"
          width="100%"
          gap={1.2}
          padding={1.6}
          height="27.4rem"
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
          <Flex
            alignItems="flex-start"
            justifyContent="flex-end"
            width="100%"
            gap={1}
          >
            <Text variant="label">일정 검증 토글</Text>
            <ToggleSwitch
              active={isValidateActive}
              onToggle={handleValidateToggle}
            />
          </Flex>

          {isValidateActive ? (
            <>
              <RoutieValidationResultCard total_time="60" valid={false} />
              <TimeInput time={time} onChange={handleTimeChange} />
            </>
          ) : (
            <RoutieValidationUnavailableCard />
          )}
        </Flex>
        <Flex
          direction="column"
          alignItems="flex-start"
          width="100%"
          gap={1.2}
          style={{
            padding: '0 1.6rem',
          }}
        >
          <Text variant="subTitle">마이 루티</Text>
          <Flex
            direction="column"
            gap={1}
            justifyContent="flex-start"
            style={{
              overflowY: 'auto',
              height: '59rem',
              padding: '1.6rem 0 ',
              boxSizing: 'border-box',
            }}
          >
            {routie.map((place, index) => {
              return (
                <>
                  <div key={place.id} {...getDragProps(index)}>
                    <RoutiePlaceCard {...place} />
                  </div>
                  {index < places.length - 1 && (
                    <Flex gap={1}>
                      <Text variant="description">도보 15분</Text>
                      <Pill type="distance">
                        <Text
                          variant="description"
                          color={theme.colors.purple[400]}
                        >
                          2.0km
                        </Text>
                      </Pill>
                    </Flex>
                  )}
                </>
              );
            })}
          </Flex>
        </Flex>
      </Flex>
      <AddPlaceModal isOpen={addModalOpen} onClose={closeAddModal} />
    </>
  );
};

export default Sidebar;
