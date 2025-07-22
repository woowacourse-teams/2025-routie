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

import DatePreviewList from '../DatePreviewList/DatePreviewList';

const PlaceCard = () => {
  const [isClicked, setIsClicked] = useState(false);

  const handleToggle = () => {
    setIsClicked((prev) => !prev);
  };

  return (
    <Card
      id="경복궁"
      width="20rem"
      height="20rem"
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

        <Text variant="subTitle">경복궁</Text>
        <Text variant="caption" color={theme.colors.gray[200]}>
          서울특별시 종로구 사직로 161
        </Text>
        <Pill type="time">09:00-18:00</Pill>
        <DatePreviewList value={[true, true, true, true, true, false, true]} />
      </Flex>
    </Card>
  );
};
export default PlaceCard;
