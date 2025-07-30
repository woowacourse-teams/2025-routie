import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import { PlaceCard } from '@/domains/places/components/PlaceCard/PlaceCard';

import gridContainerStyle from './PlaceList.styles';
import { usePlaceListContext } from './contexts/PlaceListContext';

const PlaceList = () => {
  const { placeList, refetchPlaceList, handleDelete } = usePlaceListContext();

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
        {placeList.map(({ id, onSelect, selected, ...rest }) => (
          <PlaceCard
            id={id}
            key={id}
            {...rest}
            onDelete={handleDelete}
            onPlaceChange={refetchPlaceList}
            onSelect={onSelect}
            selected={selected}
          />
        ))}
      </div>
    </Flex>
  );
};

export default PlaceList;
