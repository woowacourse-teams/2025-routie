import Card from '@/@common/components/Card/Card';
import Flex from '@/@common/components/Flex/Flex';
import IconButton from '@/@common/components/IconButton/IconButton';
import Pill from '@/@common/components/Pill/Pill';
import Text from '@/@common/components/Text/Text';
import useModal from '@/@common/hooks/useModal';
import checkIcon from '@/assets/icons/check.svg';
import editIcon from '@/assets/icons/edit.svg';
import plusIcon from '@/assets/icons/plus.svg';
import trashIcon from '@/assets/icons/trash.svg';
import { useRoutieContext } from '@/domains/routie/contexts/useRoutieContext';
import { usePlaceListContext } from '@/layouts/PlaceList/contexts/PlaceListContext';
import theme from '@/styles/theme';

import deletePlace from '../../apis/deletePlace';
import { PlaceBase } from '../../types/place.types';
import { getCheckedListExcept } from '../../utils/getCheckedListExcept';
import DatePreviewList from '../DatePreviewList/DatePreviewList';
import EditPlaceModal from '../EditPlaceModal/EditPlaceModal';

export interface PlaceCardProps extends PlaceBase {
  selected: boolean;
}

export const PlaceCard = ({ selected, ...props }: PlaceCardProps) => {
  const { refetchPlaceList } = usePlaceListContext();
  const { handleAddRoutie } = useRoutieContext();
  const { openModal, closeModal, modalOpen } = useModal();

  const handlePlaceSelect = () => {
    handleAddRoutie(props.id);
  };

  const handleDelete = async () => {
    try {
      await deletePlace(props.id);
      refetchPlaceList();
    } catch (error) {
      console.error(error);
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
              onClick={handlePlaceSelect}
            />
            <Flex gap={1}>
              <IconButton icon={editIcon} onClick={openModal} />
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
          <DatePreviewList
            value={getCheckedListExcept(props.closedDayOfWeeks)}
          />
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
