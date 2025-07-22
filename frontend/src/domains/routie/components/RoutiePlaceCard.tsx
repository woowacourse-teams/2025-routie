
import Card from '@/@common/components/Card/Card';
import Flex from '@/@common/components/Flex/Flex';
import IconButton from '@/@common/components/IconButton/IconButton';
import Pill from '@/@common/components/Pill/Pill';
import Text from '@/@common/components/Text/Text';
import dragIcon from '@/assets/icons/drag.svg'
import trashIcon from '@/assets/icons/trash.svg';
import theme from '@/styles/theme';

interface RoutiePlaceCardProps {
  place: {
    id: string;
    name: string;
    address: string;
    stay_duration_minutes:number;
    open_at:string;
    close_at:string
  };
}

const RoutiePlaceCard = ({place}:RoutiePlaceCardProps) => {
  return (
    <Card id={place.id} width="45rem" variant="defaultStatic" >
      <Flex justifyContent="flex-start" gap={1.5}>
        <IconButton variant='drag' icon={dragIcon} onClick={()=>{}}></IconButton>
        <Flex direction="column" alignItems="flex-start" gap={1.1} width="100%">
          <Flex width="100%" justifyContent="space-between">
            <Text variant="caption">{place.name}</Text>
            <Flex gap={0.4}>
              <Pill variant='filled' type="time">{place.stay_duration_minutes}분</Pill>
              <IconButton icon={trashIcon} variant="delete" onClick={() => {}} />
            </Flex>
          </Flex>
          <Text variant="label" color={theme.colors.gray[200]}>
            {place.address}
          </Text>
            <Pill type="time">{place.open_at.slice(0,5)}-{place.close_at.slice(0,5)}</Pill>
        </Flex>
      </Flex>
    </Card>
  );
};

export default RoutiePlaceCard;
