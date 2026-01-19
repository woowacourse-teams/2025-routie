import { useKakaoMapSDK } from '@/domains/maps/hooks/useKakaoMapSDK';
import type { UseKakaoMapSDKReturnType } from '@/domains/maps/types/api.types';

const useMapSdk = (): UseKakaoMapSDKReturnType => useKakaoMapSDK();

export { useMapSdk };
