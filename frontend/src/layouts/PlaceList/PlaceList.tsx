import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import { PlaceCard } from '@/domains/places/components/PlaceCard/PlaceCard';
import { Routie } from '@/domains/routie/types/routie.types';

import gridContainerStyle from './PlaceList.styles';
import { usePlaceListContext } from './contexts/PlaceListContext';
import { usePlaceList } from './hooks/usePlaceList';

interface PlaceListProps {
  routiePlaces: Routie[];
  setRoutiePlaces: React.Dispatch<React.SetStateAction<Routie[] | undefined>>;
  onRoutieDataChange?: () => Promise<void>;
}

const PlaceList = ({
  routiePlaces,
  setRoutiePlaces,
  onRoutieDataChange,
}: Omit<PlaceListProps, 'places'>) => {
  const { placeList, refetchPlaceList, handleDelete } = usePlaceListContext();

  const placeCardList = usePlaceList({
    places: placeList,
    onDelete: handleDelete,
    onPlaceChange: refetchPlaceList,
    routiePlaces,
    setRoutiePlaces,
    onRoutieDataChange,
  });


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
        {placeCardList.map(({ id, onSelect, selected, ...rest }) => (
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
