import { useEffect, useState } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import { getDetailRoutie, getRoutieId } from '@/domains/routie/apis/routie';
import { Routes, Routie } from '@/domains/routie/types/routie.types';
import PlaceList from '@/layouts/PlaceList/PlaceList';
import Sidebar from '@/layouts/Sidebar/Sidebar';

const RoutieSpace = () => {
  const [routiePlaces, setRoutiePlaces] = useState<Routie[] | undefined>();
  const [routes, setRoutes] = useState<Routes[] | undefined>();

  useEffect(() => {
    const fetchRoutieId = async () => {
      try {
        const routieId = await getRoutieId();
        localStorage.setItem('routieId', routieId);
        const routies = await getDetailRoutie();
        setRoutiePlaces(routies.routiePlaces);
        setRoutes(routies.routes);
      } catch (error) {
        console.error('Failed to get routieId:', error);
      }
    };

    fetchRoutieId();
  }, []);

  return (
    <>
      <Flex justifyContent="flex-start" height="100vh">
        <Flex direction="column" justifyContent="flex-start" height="100%">
          {
            <Sidebar
              routiePlaces={routiePlaces ?? []}
              setRoutiePlaces={setRoutiePlaces}
              routes={routes}
            />
          }
        </Flex>
        <Flex direction="column" justifyContent="flex-start" height="100%">
          <PlaceList />
        </Flex>
      </Flex>
    </>
  );
};

export default RoutieSpace;
