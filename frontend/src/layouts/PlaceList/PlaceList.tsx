import { useEffect, useState } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import getPlaceList from '@/domains/places/apis/getplaceList';
import {
  PlaceCard,
  PlaceCardProps,
} from '@/domains/places/components/PlaceCard/PlaceCard';

const PlaceList = () => {
  const [places, setPlaces] = useState<PlaceCardProps[]>([]);

  const handleDelete = (id: number) => {
    setPlaces((prev) => prev.filter((place) => place.id !== id));
  };

  const refetchPlaceList = async () => {
    try {
      const newPlaceList = await getPlaceList();
      setPlaces(newPlaceList);
    } catch (error) {
      console.error('장소 목록을 불러오는데 실패했습니다.', error);
    }
  };

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await getPlaceList();
        setPlaces(data);
      } catch (error) {
        console.error('장소 목록을 불러오는데 실패했습니다.', error);
      }
    };

    fetchPlaces();
  }, []);

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
              onDelete={handleDelete}
              onPlaceChange={refetchPlaceList}
            />
          ))}
        </div>
      </Flex>
    </>
  );
};

export default PlaceList;
