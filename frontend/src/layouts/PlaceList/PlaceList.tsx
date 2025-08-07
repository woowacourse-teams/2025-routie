import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import { PlaceCard } from '@/domains/places/components/PlaceCard/PlaceCard';
import { useRoutieContext } from '@/domains/routie/contexts/useRoutieContext';

import gridContainerStyle from './PlaceList.styles';
import { usePlaceListContext } from './contexts/PlaceListContext';

const PlaceList = () => {
  const { placeList } = usePlaceListContext();
  const { routieIdList } = useRoutieContext();

  return (
    <Flex
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      width="100%"
      height="100%"
      padding={3}
      gap={2}
    >
      <Text variant="title">장소 목록</Text>
      <div css={gridContainerStyle}>
        {placeList.map((place) => {
          const selected = routieIdList.some(
            (routiePlaceId) => routiePlaceId === place.id,
          );
          return <PlaceCard {...place} key={place.id} selected={selected} />;
        })}
      </div>
    </Flex>
  );
};

export default PlaceList;
