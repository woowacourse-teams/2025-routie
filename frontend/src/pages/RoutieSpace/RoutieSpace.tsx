import Flex from '@/@common/components/Flex/Flex';
import useMapView from '@/@common/hooks/useMapView';
import KakaoMap from '@/domains/maps/components/KakaoMap';
import { RoutieProvider } from '@/domains/routie/contexts/useRoutieContext';
import { RoutieValidateProvider } from '@/domains/routie/contexts/useRoutieValidateContext';
import MapWithSideSheet from '@/layouts/MapWithSideSheet/MapWithSideSheet';
import { PlaceListProvider } from '@/layouts/PlaceList/contexts/PlaceListProvider';
import SideSheet from '@/layouts/SideSheet/SideSheet';
import Sidebar from '@/layouts/Sidebar/Sidebar';

const RoutieSpace = () => {
  const { viewMode, handleViewModeChange } = useMapView();

  return (
    <RoutieValidateProvider>
      <RoutieProvider>
        <PlaceListProvider>
          <Flex justifyContent="flex-start" height="100vh">
            <Flex direction="column" justifyContent="flex-start" height="100%">
              <Sidebar handleViewModeChange={handleViewModeChange} />
            </Flex>
            <Flex direction="column" justifyContent="flex-start" height="100%">
              <MapWithSideSheet />
            </Flex>
          </Flex>
        </PlaceListProvider>
      </RoutieProvider>
    </RoutieValidateProvider>
  );
};

export default RoutieSpace;
