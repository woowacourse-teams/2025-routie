import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import {
  PlaceCard,
  PlaceCardProps,
} from '@/domains/places/components/PlaceCard/PlaceCard';
import { editRoutieSequence } from '@/domains/routie/apis/routie';
import { useRoutieValidateContext } from '@/domains/routie/contexts/useRoutieValidateContext';
import { Routie } from '@/domains/routie/types/routie.types';

const deleteRoutiePlace = (placeId: number, routiePlaces: Routie[]) => {
  const filteredRoutiePlaces = routiePlaces.filter(
    (routiePlace) => routiePlace.placeId !== placeId,
  );

  return filteredRoutiePlaces.map((routiePlace, index) => ({
    ...routiePlace,
    sequence: index + 1,
  }));
};

const addRoutiePlace = (placeId: number, routiePlaces: Routie[]) => {
  return [
    ...routiePlaces,
    { id: placeId, placeId, sequence: routiePlaces.length + 1 },
  ];
};

interface PlaceListProps {
  places: PlaceCardProps[];
  onDelete: (id: number) => void;
  onPlaceChange: () => Promise<void>;
  routiePlaces: Routie[];
  setRoutiePlaces: React.Dispatch<React.SetStateAction<Routie[] | undefined>>;
  onRoutieDataChange?: () => Promise<void>;
}

const PlaceList = ({
  places,
  onDelete,
  onPlaceChange,
  routiePlaces,
  setRoutiePlaces,
  onRoutieDataChange,
}: PlaceListProps) => {
  const { validateRoutie } = useRoutieValidateContext();
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
          {places.map((place) => {
            const selected = routiePlaces.some(
              (routiePlace) => routiePlace.placeId === place.id,
            );

            const handleSelect = async () => {
              let updatedRoutiePlaces: Routie[];

              if (selected) {
                updatedRoutiePlaces = deleteRoutiePlace(place.id, routiePlaces);
              } else {
                updatedRoutiePlaces = addRoutiePlace(place.id, routiePlaces);
              }

              try {
                await editRoutieSequence(updatedRoutiePlaces);
                setRoutiePlaces(updatedRoutiePlaces);

                // 루티 데이터 전체 리페치 (routes 정보 포함)
                if (onRoutieDataChange) {
                  await onRoutieDataChange();
                }

                // 루티 검증 API 호출
                if (updatedRoutiePlaces.length > 0) {
                  await validateRoutie();
                }
              } catch (error) {
                console.error('루티 업데이트 실패:', error);
              }
            };

            return (
              <PlaceCard
                key={place.id}
                {...place}
                onDelete={onDelete}
                onPlaceChange={onPlaceChange}
                onSelect={handleSelect}
                selected={selected}
              />
            );
          })}
        </div>
      </Flex>
    </>
  );
};

export default PlaceList;
