import { useEffect, useState } from 'react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Header from '@/@common/components/Header/Header';
import Pill from '@/@common/components/Pill/Pill';
import Text from '@/@common/components/Text/Text';
import ToggleSwitch from '@/@common/components/ToggleSwitch/ToggleSwitch';
import AddPlaceModal from '@/domains/places/components/AddPlaceModal/AddPlaceModal';
import { editRoutieSequence } from '@/domains/routie/apis/routie';
import RoutiePlaceCard from '@/domains/routie/components/RoutiePlaceCard/RoutiePlaceCard';
import RoutieValidationResultCard from '@/domains/routie/components/RoutieValidationResultCard/RoutieValidationResultCard';
import RoutieValidationUnavailableCard from '@/domains/routie/components/RoutieValidationUnavailableCard/RoutieValidationUnavailableCard';
import { useCardDrag } from '@/domains/routie/hooks/useCardDrag';
import { Routes, Routie } from '@/domains/routie/types/routie.types';
import RoutieSpaceName from '@/domains/routieSpace/components/RoutieSpaceName/RoutieSpaceName';
import theme from '@/styles/theme';

import TimeInput from './TimeInput';

const initialTime = {
  startAt: '09:00',
  endAt: '22:00',
};

interface SidebarProps {
  onPlaceChange: () => Promise<void>;
  setRoutiePlaces: React.Dispatch<React.SetStateAction<Routie[] | undefined>>;
  routiePlaces: Routie[];
  routes: Routes[] | undefined;
}

const Sidebar = ({
  onPlaceChange,
  routiePlaces,
  setRoutiePlaces,
  routes,
}: SidebarProps) => {
  const getDragProps = useCardDrag(routiePlaces, setRoutiePlaces);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isValidateActive, setIsValidateActive] = useState(false);
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (!routiePlaces) return;

    const updated = routiePlaces.map((item, index) => ({
      ...item,
      sequence: index + 1,
    }));

    const isSequenceChanged = routiePlaces.some(
      (item, index) => item.sequence !== index + 1,
    );
    if (isSequenceChanged) {
      const sortedPlaces = updated.sort((a, b) => a.sequence - b.sequence);

      setRoutiePlaces(sortedPlaces);
      editRoutieSequence(sortedPlaces);
    }
  }, [routiePlaces]);

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

  const handleDelete = (id: number) => {
    editRoutieSequence(routiePlaces.filter((item) => item.placeId !== id));
    setRoutiePlaces(routiePlaces.filter((item) => item.placeId !== id));
  };

  const MOVING_STRATEGY = {
    DRIVING: '운전',
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
            <ToggleSwitch active={isValidateActive} onToggle={() => {}} />
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
            height="calc(100dvh - 36rem)"
            style={{
              overflowY: 'auto',
              padding: '1.6rem 0 ',
              boxSizing: 'border-box',
            }}
          >
            {routiePlaces?.map((place, index) => {
              return (
                <>
                  <div key={place.placeId} {...getDragProps(index)}>
                    <RoutiePlaceCard
                      placeId={place.placeId}
                      handleDelete={() => handleDelete(place.placeId)}
                      onPlaceChange={onPlaceChange}
                    />
                  </div>

                  {routiePlaces.length - 1 !== index &&
                    routes &&
                    routes[index] && (
                      <Flex key={place.id + index} gap={1}>
                        <Text variant="description">
                          {MOVING_STRATEGY[routes[index].movingStrategy]}{' '}
                          {routes[index].duration}분
                        </Text>
                        <Pill type="distance">
                          <Text
                            variant="description"
                            color={theme.colors.purple[400]}
                          >
                            {(routes[index].distance / 1000).toFixed(1)}km
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
      <AddPlaceModal
        isOpen={addModalOpen}
        onClose={closeAddModal}
        onPlaceAdded={onPlaceChange}
      />
    </>
  );
};

export default Sidebar;
