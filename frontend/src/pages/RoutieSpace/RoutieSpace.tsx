import { useLayoutEffect } from 'react';
import { useSearchParams } from 'react-router';

import Flex from '@/@common/components/Flex/Flex';
import RoutieProvider from '@/domains/routie/contexts/RoutieProvider';
import MapWithSideSheet from '@/layouts/MapWithSideSheet/MapWithSideSheet';
import Sidebar from '@/layouts/Sidebar/Sidebar';

const RoutieSpace = () => {
  const [searchParams] = useSearchParams();
  const routieSpaceIdentifier = searchParams.get('routieSpaceIdentifier');

  useLayoutEffect(() => {
    if (routieSpaceIdentifier) {
      localStorage.setItem('routieSpaceUuid', routieSpaceIdentifier);
    }
  }, [routieSpaceIdentifier]);

  return (
    <RoutieProvider>
      <Flex justifyContent="flex-start" height="100vh">
        <Flex direction="column" justifyContent="flex-start" height="100%">
          <Sidebar />
        </Flex>
        <Flex direction="column" justifyContent="flex-start" height="100%">
          <MapWithSideSheet />
        </Flex>
      </Flex>
    </RoutieProvider>
  );
};

export default RoutieSpace;
