import { useEffect, useState } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import { getRoutieId } from '@/domains/routie/apis/routie';
import { RoutieValidateProvider } from '@/domains/routie/contexts/useRoutieValidateContext';
import { Routes, Routie } from '@/domains/routie/types/routie.types';
import PlaceList from '@/layouts/PlaceList/PlaceList';
import { PlaceListProvider } from '@/layouts/PlaceList/contexts/PlaceListProvider';
import Sidebar from '@/layouts/Sidebar/Sidebar';

const RoutieSpace = () => {
  const [routiePlaces, setRoutiePlaces] = useState<Routie[] | undefined>();
  const [routes, setRoutes] = useState<Routes[] | undefined>();

  const refetchRoutieData = async () => {
    try {
      const routies = await getRoutieId();
      setRoutiePlaces(routies.routiePlaces);
      setRoutes(routies.routes);
    } catch (error) {
      console.error('루티 정보를 불러오는데 실패했습니다.', error);
    }
  };

  useEffect(() => {
    const fetchRoutieId = async () => {
      try {
        const routies = await getRoutieId();

        setRoutiePlaces(routies.routiePlaces);
        setRoutes(routies.routes);
      } catch (error) {
        console.error('Failed to get routieId:', error);
      }
    };

    fetchRoutieId();
  }, []);

  return (
    <RoutieValidateProvider>
      <PlaceListProvider>
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
            <PlaceList
              routiePlaces={routiePlaces ?? []}
              setRoutiePlaces={setRoutiePlaces}
              onRoutieDataChange={refetchRoutieData}
            />
          </Flex>
        </Flex>
      </PlaceListProvider>
    </RoutieValidateProvider>
  );
};

export default RoutieSpace;
