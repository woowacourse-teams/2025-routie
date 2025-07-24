import { useEffect, useState } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import getPlaceList from '@/domains/places/apis/getplaceList';
import { PlaceCardProps } from '@/domains/places/components/PlaceCard/PlaceCard';
import PlaceList from '@/layouts/PlaceList/PlaceList';
import Sidebar from '@/layouts/Sidebar/Sidebar';

const RoutieSpace = () => {
  const [placeList, setPlaceList] = useState<PlaceCardProps[]>([]);

  const refetchPlaceList = async () => {
    try {
      const newPlaceList = await getPlaceList();
      setPlaceList(newPlaceList);
    } catch (error) {
      console.error('장소 목록을 불러오는데 실패했습니다.', error);
    }
  };

  const handleDelete = (id: number) => {
    setPlaceList((prev) => prev.filter((place) => place.id !== id));
  };

  useEffect(() => {
    refetchPlaceList();
  }, []);

  return (
    <>
      <Flex justifyContent="flex-start" height="100vh">
        <Flex direction="column" justifyContent="flex-start" height="100%">
          <Sidebar placeList={placeList} onPlaceChange={refetchPlaceList} />
        </Flex>
        <Flex direction="column" justifyContent="flex-start" height="100%">
          <PlaceList
            places={placeList}
            onDelete={handleDelete}
            onPlaceChange={refetchPlaceList}
          />
        </Flex>
      </Flex>
    </>
  );
};

export default RoutieSpace;
