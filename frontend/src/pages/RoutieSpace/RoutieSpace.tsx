import Flex from '@/@common/components/Flex/Flex';
import KakaoMap from '@/domains/maps/components/KakaoMap';
import { RoutieProvider } from '@/domains/routie/contexts/useRoutieContext';
import { RoutieValidateProvider } from '@/domains/routie/contexts/useRoutieValidateContext';
import PlaceList from '@/layouts/PlaceList/PlaceList';
import { PlaceListProvider } from '@/layouts/PlaceList/contexts/PlaceListProvider';
import Sidebar from '@/layouts/Sidebar/Sidebar';

const RoutieSpace = () => {
  const handleMapReady = ({ map }: { map: KakaoMap }) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      map.setCenter(new window.kakao.maps.LatLng(latitude, longitude));
    });
  };

  return (
    <RoutieValidateProvider>
      <RoutieProvider>
        <PlaceListProvider>
          <Flex justifyContent="flex-start" height="100vh">
            <Flex direction="column" justifyContent="flex-start" height="100%">
              <Sidebar />
            </Flex>
            <Flex direction="column" justifyContent="flex-start" height="100%">
              {/* <PlaceList /> */}
              <KakaoMap onMapReady={handleMapReady} />
            </Flex>
          </Flex>
        </PlaceListProvider>
      </RoutieProvider>
    </RoutieValidateProvider>
  );
};

export default RoutieSpace;
