import { useEffect, useState } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import {
  getDetailPlace,
  getDetailRoutie,
  getRoutieId,
} from '@/domains/routie/apis/routie';
import { RoutiePlace, RoutiePlaces } from '@/domains/routie/types/routie.types';
import PlaceList from '@/layouts/PlaceList/PlaceList';
import Sidebar from '@/layouts/Sidebar/Sidebar';

const RoutieSpace = () => {
  const [routiePlaces, setRoutiePlaces] = useState<RoutiePlaces>();
  const [routiePlaceList, setRoutiePlaceList] = useState<RoutiePlace[]>([]);
  const [refetch, setRefetch] = useState<boolean>(false);

  useEffect(() => {
    const fetchRoutieId = async () => {
      try {
        const routieId = await getRoutieId();
        localStorage.setItem('routieId', routieId);
        const routies = await getDetailRoutie();
        setRoutiePlaces(routies);
      } catch (error) {
        console.error('Failed to get routieId:', error);
      }
    };

    fetchRoutieId();
  }, [refetch]);

  useEffect(() => {
    if (routiePlaces) {
      const placesIds = routiePlaces.routiePlaces.map(
        (routiePlace) => routiePlace.id,
      );

      const fetchPlaces = async () => {
        const places = await Promise.all(
          placesIds.map(async (id: number) => {
            const place = await getDetailPlace(id);
            return { ...place, id };
          }),
        );

        setRoutiePlaceList(places);
      };

      fetchPlaces();
    }
  }, [routiePlaces]);

  return (
    <>
      <Flex justifyContent="flex-start" height="100vh">
        <Flex direction="column" justifyContent="flex-start" height="100%">
          {routiePlaceList && routiePlaces && (
            <Sidebar
              setRefetch={setRefetch}
              routiePlaces={routiePlaces}
              routiePlaceList={routiePlaceList}
              setRoutiePlaceList={setRoutiePlaceList}
              setRoutiePlaces={setRoutiePlaces}
            />
          )}
        </Flex>
        <Flex direction="column" justifyContent="flex-start" height="100%">
          <PlaceList />
        </Flex>
      </Flex>
    </>
  );
};

export default RoutieSpace;
