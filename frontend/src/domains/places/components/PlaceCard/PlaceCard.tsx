import { useState } from 'react';

import Card from '@/@common/components/Card/Card';
import Flex from '@/@common/components/Flex/Flex';
import IconButton from '@/@common/components/IconButton/IconButton';
import Pill from '@/@common/components/Pill/Pill';
import Text from '@/@common/components/Text/Text';
import checkIcon from '@/assets/icons/check.svg';
import editIcon from '@/assets/icons/edit.svg';
import plusIcon from '@/assets/icons/plus.svg';
import trashIcon from '@/assets/icons/trash.svg';
import theme from '@/styles/theme';

import deletePlace from '../../apis/deletePlace';
import { getCheckedListExcept } from '../../utils/getCheckedListExcept';
import DatePreviewList from '../DatePreviewList/DatePreviewList';
import EditPlaceModal from '../EditPlaceModal/EditPlaceModal';

export interface PlaceCardProps {
  id: number;
  name: string;
  address: string;
  stayDurationMinutes: number;
  openAt: string;
  closeAt: string;
  breakStartAt: string;
  breakEndAt: string;
  closedDays: string[];
  onDelete: (id: number) => void;
  onPlaceChange: () => Promise<void>;
  selected: boolean;
  onSelect: () => Promise<void>;
}

export const PlaceCard = ({
  onDelete,
  onPlaceChange,
  selected,
  onSelect,
  ...props
}: PlaceCardProps) => {
  const [editModalOpen, setEditModalOpen] = useState(false);

  const openEditModal = () => {
    setEditModalOpen((prev) => !prev);
  };

  const closeEditModal = () => {
    setEditModalOpen((prev) => !prev);
  };

  const handleToggle = async () => {
    await onSelect();
  };

  const handleDelete = async () => {
    try {
      await deletePlace(props.id);
      onDelete(props.id);
    } catch (error) {
      console.error('장소 삭제를 실패했습니다.', error);
    }
  };

  return (
    <>
      <Card
        id={props.id.toString()}
        width="20rem"
        variant={selected ? 'available' : 'default'}
      >
        <Flex
          direction="column"
          gap={2}
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Flex justifyContent="space-between" width="100%" alignItems="center">
            <IconButton
              icon={selected ? checkIcon : plusIcon}
              variant={selected ? 'selected' : 'select'}
              onClick={handleToggle}
            />
            <Flex gap={1}>
              <IconButton icon={editIcon} onClick={openEditModal} />
              <IconButton
                icon={trashIcon}
                variant="delete"
                onClick={handleDelete}
              />
            </Flex>
          </Flex>

          <Text variant="subTitle">{props.name}</Text>
          <Text variant="caption" color={theme.colors.gray[200]}>
            {props.address}
          </Text>
          <Pill type="time">
            {props.openAt}-{props.closeAt}
          </Pill>
          <DatePreviewList value={getCheckedListExcept(props.closedDays)} />
        </Flex>
      </Card>
      <EditPlaceModal
        id={props.id}
        isOpen={editModalOpen}
        onClose={closeEditModal}
        onPlaceChange={onPlaceChange}
      />
    </>
  );
};
