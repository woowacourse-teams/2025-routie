import { css } from '@emotion/react';

import Card from '@/@common/components/Card/Card';
import Flex from '@/@common/components/Flex/Flex';
import IconButton from '@/@common/components/IconButton/IconButton';
import Pill from '@/@common/components/Pill/Pill';
import Text from '@/@common/components/Text/Text';
import { useToastContext } from '@/@common/contexts/useToastContext';
import { useAsyncLock } from '@/@common/hooks/useAsyncLock';
import useModal from '@/@common/hooks/useModal';
import checkIcon from '@/assets/icons/check.svg';
import editIcon from '@/assets/icons/edit.svg';
import plusIcon from '@/assets/icons/plus.svg';
import disableTrashIcon from '@/assets/icons/trash-disable.svg';
import trashIcon from '@/assets/icons/trash.svg';
import { useRoutieContext } from '@/domains/routie/contexts/useRoutieContext';
import { usePlaceListContext } from '@/layouts/PlaceList/contexts/PlaceListContext';
import { useGoogleEventTrigger } from '@/libs/googleAnalytics/hooks/useGoogleEventTrigger';
import theme from '@/styles/theme';

import deletePlace from '../../apis/deletePlace';
import { PlaceBaseType } from '../../types/place.types';
import { getCheckedListExcept } from '../../utils/getCheckedListExcept';
import { getFormatedCloseAt } from '../../utils/getFormatedCloseAt';
import DatePreviewList from '../DatePreviewList/DatePreviewList';
import EditPlaceModal from '../EditPlaceModal/EditPlaceModal';

export interface PlaceCardProps extends PlaceBaseType {
  id: number;
  selected: boolean;
}

export const PlaceCard = ({ selected, ...props }: PlaceCardProps) => {
  const { refetchPlaceList } = usePlaceListContext();
  const { handleAddRoutie } = useRoutieContext();
  const { openModal, closeModal, modalOpen } = useModal();
  const { triggerEvent } = useGoogleEventTrigger();
  const { showToast } = useToastContext();
  const { runWithLock: runDeleteWithLock } = useAsyncLock();

  const handlePlaceSelect = async () => {
    if (selected) return;

    try {
      await handleAddRoutie(props.id);
      triggerEvent({
        action: 'click',
        category: 'routie',
        label: '루티에 장소 추가하기 버튼',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    return runDeleteWithLock(async () => {
      try {
        await deletePlace(props.id);
        await refetchPlaceList();
        triggerEvent({
          action: 'click',
          category: 'place',
          label: '장소 삭제하기 버튼',
        });
        showToast({
          message: '장소가 삭제되었습니다.',
          type: 'success',
        });
      } catch (error) {
        console.error(error);
        showToast({
          message: '장소 삭제를 실패하였습니다. 다시 시도해주세요.',
          type: 'error',
        });
      }
    });
  };

  const handleOpenEditModal = () => {
    openModal();
    triggerEvent({
      action: 'click',
      category: 'place',
      label: '장소 수정하기 버튼',
    });
  };

  return (
    <>
      <Card
        id={props.id.toString()}
        width="100%"
        variant={selected ? 'available' : 'default'}
      >
        <Flex
          direction="column"
          gap={1.5}
          justifyContent="flex-start"
          alignItems="flex-start"
          height="15rem"
        >
          <Flex
            justifyContent="space-between"
            width="100%"
            height="100%"
            gap={2}
          >
            <IconButton
              icon={selected ? checkIcon : plusIcon}
              variant={selected ? 'selected' : 'select'}
              onClick={handlePlaceSelect}
              css={css`
                width: 4rem;
                height: 100%;

                & img {
                  width: 2rem;
                  height: 2rem;
                }
              `}
            />
            <Flex
              direction="column"
              alignItems="flex-start"
              gap={1}
              css={css`
                flex: 1;
                min-width: 0;
              `}
            >
              <Text variant="subTitle" ellipsis>
                {props.name}
              </Text>
              <Text variant="caption" color={theme.colors.gray[200]} ellipsis>
                {props.roadAddressName || props.addressName}
              </Text>
              <Flex direction="row" gap={1}>
                <Text
                  variant="description"
                  ellipsis
                  css={css`
                    width: 5.5rem;
                  `}
                >
                  영업 시간
                </Text>
                <Pill type="time">
                  {props.openAt} -{' '}
                  {getFormatedCloseAt(props.openAt, props.closeAt)}
                </Pill>
              </Flex>
              {props.breakStartAt && (
                <Flex direction="row" gap={1}>
                  <Text
                    variant="description"
                    ellipsis
                    css={css`
                      width: 5.5rem;
                    `}
                  >
                    브레이크 타임
                  </Text>
                  <Pill type="time">
                    {props.breakStartAt} - {props.breakEndAt}
                  </Pill>
                </Flex>
              )}
              <DatePreviewList
                value={getCheckedListExcept(props.closedDayOfWeeks)}
              />
            </Flex>
            <Flex direction="column" gap={5} height="100%">
              <IconButton
                icon={editIcon}
                onClick={handleOpenEditModal}
                css={css`
                  & img {
                    width: 2rem;
                    height: 2rem;
                  }
                `}
              />
              <IconButton
                icon={selected ? disableTrashIcon : trashIcon}
                variant={selected ? 'disable' : 'delete'}
                onClick={selected ? undefined : handleDelete}
                css={css`
                  & img {
                    width: 2rem;
                    height: 2rem;
                  }
                `}
              />
            </Flex>
          </Flex>
        </Flex>
      </Card>
      <EditPlaceModal
        id={props.id}
        isOpen={modalOpen}
        onClose={closeModal}
        onPlaceChange={refetchPlaceList}
      />
    </>
  );
};
