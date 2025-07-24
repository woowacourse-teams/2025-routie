import Card from '@/@common/components/Card/Card';
import Flex from '@/@common/components/Flex/Flex';
import IconButton from '@/@common/components/IconButton/IconButton';
import Pill from '@/@common/components/Pill/Pill';
import Text from '@/@common/components/Text/Text';
import dragIcon from '@/assets/icons/drag.svg';
import trashIcon from '@/assets/icons/trash.svg';
import theme from '@/styles/theme';

import { RoutiePlace } from '../../types/routie.types';

const RoutiePlaceCard = ({ ...props }: RoutiePlace) => {
  return (
    <Card id={props.id.toString()} width="45rem" variant="defaultStatic">
      <Flex justifyContent="flex-start" gap={1.5}>
        <IconButton variant="drag" icon={dragIcon} onClick={() => {}} />
        <Flex direction="column" alignItems="flex-start" gap={1.1} width="100%">
          <Flex width="100%" justifyContent="space-between">
            <Text variant="caption">{props.name}</Text>
            <Flex gap={0.4}>
              <Pill variant="filled" type="time">
                {props.stayDurationMinutes}분
              </Pill>
              <IconButton
                icon={trashIcon}
                variant="delete"
                onClick={() => {}}
              />
            </Flex>
          </Flex>
          <Text variant="label" color={theme.colors.gray[200]}>
            {props.address}
          </Text>
          <Pill type="time">
            {props.openAt}-{props.closeAt}
          </Pill>
        </Flex>
      </Flex>
    </Card>
  );
};

export default RoutiePlaceCard;
