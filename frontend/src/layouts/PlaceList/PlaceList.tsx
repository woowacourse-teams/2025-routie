import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import {
  PlaceCard,
  PlaceCardProps,
} from '@/domains/places/components/PlaceCard/PlaceCard';

interface PlaceListProps {
  places: PlaceCardProps[];
  onDelete: (id: number) => void;
  onPlaceChange: () => Promise<void>;
}

const PlaceList = ({ places, onDelete, onPlaceChange }: PlaceListProps) => {
  return (
    <>
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5,1fr)',
            gap: '2rem',
          }}
        >
          {places.map((place) => (
            <PlaceCard
              key={place.id}
              {...place}
              onDelete={onDelete}
              onPlaceChange={onPlaceChange}
            />
          ))}
        </div>
      </Flex>
    </>
  );
};

export default PlaceList;
