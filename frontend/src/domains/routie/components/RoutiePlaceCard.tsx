import Card from '@/@common/components/Card/Card';
import Flex from '@/@common/components/Flex/Flex';
import IconButton from '@/@common/components/IconButton/IconButton';
import Pill from '@/@common/components/Pill/Pill';
import Text from '@/@common/components/Text/Text';
import dragIcon from '@/assets/icons/drag.svg'
import trashIcon from '@/assets/icons/trash.svg';
import theme from '@/styles/theme';

interface RoutiePlaceCardProps {
    id: string;
    name: string;
    address: string;
    stay_duration_minutes:number;
    open_at:string;
    close_at:string
}

const RoutiePlaceCard = ({...props}:RoutiePlaceCardProps) => {
  return (
    <Card id={props.id} width="45rem" variant="defaultStatic" >
      <Flex justifyContent="flex-start" gap={1.5}>
        <IconButton variant='drag' icon={dragIcon} onClick={()=>{}} />
        <Flex direction="column" alignItems="flex-start" gap={1.1} width="100%">
          <Flex width="100%" justifyContent="space-between">
            <Text variant="caption">{props.name}</Text>
            <Flex gap={0.4}>
              <Pill variant='filled' type="time">{props.stay_duration_minutes}분</Pill>
              <IconButton icon={trashIcon} variant="delete" onClick={() => {}} />
            </Flex>
          </Flex>
          <Text variant="label" color={theme.colors.gray[200]}>
            {props.address}
          </Text>
            <Pill type="time">{props.open_at.slice(0,5)}-{props.close_at.slice(0,5)}</Pill>
        </Flex>
      </Flex>
    </Card>
  );
};

export default RoutiePlaceCard;
