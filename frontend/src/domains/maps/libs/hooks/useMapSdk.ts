import type { UseKakaoMapSDKReturnType } from '@/domains/maps/types/api.types';
import { useKakaoMapSDK } from '@/domains/maps/hooks/useKakaoMapSDK';

const useMapSdk = (): UseKakaoMapSDKReturnType => useKakaoMapSDK();

export { useMapSdk };
