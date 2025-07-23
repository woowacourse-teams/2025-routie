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

import { getCheckedListExcept } from '../../utils/getCheckedListExcept';
import DatePreviewList from '../DatePreviewList/DatePreviewList';

interface PlaceCardProps {
  id: number;
  name: string;
  address: string;
  openAt: string;
  closeAt: string;
  closedDays: string[];
}

const PlaceCard = ({ ...props }: PlaceCardProps) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleToggle = () => {
    setIsClicked((prev) => !prev);
  };

  return (
    <Card
      id={props.id.toString()}
      width="20rem"
      variant={isClicked ? 'available' : 'default'}
    >
      <Flex
        direction="column"
        gap={2}
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Flex justifyContent="space-between" width="100%" alignItems="center">
          <IconButton
            icon={isClicked ? checkIcon : plusIcon}
            variant={isClicked ? 'selected' : 'select'}
            onClick={handleToggle}
          />
          <Flex gap={1}>
            <IconButton icon={editIcon} onClick={() => {}} />
            <IconButton icon={trashIcon} variant="delete" onClick={() => {}} />
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
  );
};
export default PlaceCard;
