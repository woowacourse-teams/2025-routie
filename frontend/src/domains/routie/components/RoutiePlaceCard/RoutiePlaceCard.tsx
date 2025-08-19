import { useEffect, useState } from 'react';

import Card from '@/@common/components/Card/Card';
import Flex from '@/@common/components/Flex/Flex';
import IconButton from '@/@common/components/IconButton/IconButton';
import Icon from '@/@common/components/IconSvg/Icon';
import Pill from '@/@common/components/Pill/Pill';
import Text from '@/@common/components/Text/Text';
import Tooltip from '@/@common/components/Tooltip/Tooltip';
import closeRed from '@/assets/icons/close-red.svg';
import { PlaceBaseType } from '@/domains/places/types/place.types';
import { getCheckedDaysInKorean } from '@/domains/places/utils/getCheckedDaysInKorean';
import { getCheckedListExcept } from '@/domains/places/utils/getCheckedListExcept';
import { getFormatedCloseAt } from '@/domains/places/utils/getFormatedCloseAt';
import { useGoogleEventTrigger } from '@/libs/googleAnalytics/hooks/useGoogleEventTrigger';
import theme from '@/styles/theme';

import { getDetailPlace } from '../../apis/routie';
import { useRoutieContext } from '../../contexts/useRoutieContext';
import { useRoutieValidateContext } from '../../contexts/useRoutieValidateContext';
import { Routie } from '../../types/routie.types';
import formatMinutesToHours from '../../utils/formatMinutesToHours';
import DraggableWrapper from '../DraggableWrapper/DraggableWrapper';

import {
  dragIconStyle,
  PlaceInfoViewPillStyle,
} from './RoutiePlaceCard.styles';

const RoutiePlaceCard = ({ routie }: { routie: Routie }) => {
  const [place, setPlace] = useState<PlaceBaseType>({
    name: '',
    roadAddressName: '',
    addressName: '',
    stayDurationMinutes: 0,
    openAt: '',
    closeAt: '',
    breakStartAt: '',
    breakEndAt: '',
    closedDayOfWeeks: [],
    longitude: 0,
    latitude: 0,
  });

  const { handleDeleteRoutie } = useRoutieContext();
  const { triggerEvent } = useGoogleEventTrigger();

  useEffect(() => {
    const fetchDetailPlace = async () => {
      const detailPlace = await getDetailPlace(routie.placeId);
      setPlace(detailPlace);
    };
    fetchDetailPlace();
  }, [routie]);

  const handleDelete = () => {
    handleDeleteRoutie(routie.placeId);
    triggerEvent({
      action: 'click',
      category: 'routie',
      label: '루티에서 장소 삭제하기 버튼',
    });
  };

  const checkedListExcept = getCheckedListExcept(place.closedDayOfWeeks);
  const checkedDaysInKorean = getCheckedDaysInKorean(checkedListExcept);

  const { currentInvalidRoutiePlaces } = useRoutieValidateContext();

  const isUnavailable = currentInvalidRoutiePlaces.some(
    (invalid) => invalid.routiePlaceId === routie.placeId,
  );

  return (
    place && (
      <DraggableWrapper>
        <Card
          id={routie.placeId.toString()}
          variant={isUnavailable ? 'unavailable' : 'defaultStatic'}
        >
          <Flex justifyContent="flex-start" gap={1.5}>
            <Flex width="100%" justifyContent="space-between" gap={1.5}>
              <Flex padding={1}>
                <Text variant="title" color={theme.colors.purple[300]}>
                  {routie.sequence}
                </Text>
              </Flex>
              <Flex
                direction="column"
                alignItems="flex-start"
                gap={1.1}
                width="100%"
                padding={0.5}
              >
                <Flex width="100%" justifyContent="space-between">
                  <Text variant="caption">{place.name}</Text>
                  <Tooltip
                    content={
                      <div>
                        <Text variant="label">
                          오픈: {place.openAt} / 마감:{' '}
                          {getFormatedCloseAt(place.openAt, place.closeAt)}
                        </Text>

                        <Text variant="label">
                          브레이크:{' '}
                          {place.breakStartAt && place.breakEndAt
                            ? `${place.breakStartAt} ~ ${place.breakEndAt}`
                            : '없음'}
                        </Text>

                        <Text variant="label">
                          휴무일:{' '}
                          {place.closedDayOfWeeks.length > 0
                            ? checkedDaysInKorean.join(', ')
                            : '없음'}
                        </Text>
                      </div>
                    }
                  >
                    <Pill type="default" css={PlaceInfoViewPillStyle}>
                      <Text variant="label">정보보기</Text>
                    </Pill>
                  </Tooltip>
                </Flex>

                <Flex gap={0.4} alignItems="center">
                  <Icon name="pin" size={12} />
                  <Text variant="label" color={theme.colors.gray[300]}>
                    {place.roadAddressName}
                  </Text>
                </Flex>

                <Flex gap={0.4} alignItems="center">
                  <Pill type="default">
                    <Icon name="timepass" size={12} />
                    <Text variant="label">
                      {routie.arriveDateTime?.slice(-5)}-
                      {routie.departureDateTime?.slice(-5)}{' '}
                    </Text>
                  </Pill>
                  <Pill type="default" variant="filled">
                    <Icon name="durationTime" size={12} />
                    <Text variant="label">
                      {formatMinutesToHours(place.stayDurationMinutes)}
                    </Text>
                  </Pill>
                </Flex>
              </Flex>
              <Flex direction="column" gap={3}>
                <IconButton
                  icon={closeRed}
                  variant="delete"
                  onClick={handleDelete}
                />
                <Icon name="drag" size={24} css={dragIconStyle} />
              </Flex>
            </Flex>
          </Flex>
        </Card>
      </DraggableWrapper>
    )
  );
};

export default RoutiePlaceCard;
