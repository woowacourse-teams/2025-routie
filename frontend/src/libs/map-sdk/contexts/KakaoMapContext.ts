import { createContext, useContext } from 'react';

import type { KakaoMap } from '../../../../kakao.d';

interface KakaoMapContextValue {
  map: KakaoMap | null;
}

const KakaoMapContext = createContext<KakaoMapContextValue | null>(null);

const useMap = (): KakaoMap | null => {
  const context = useContext(KakaoMapContext);
  return context?.map ?? null;
};

export default KakaoMapContext;
export { useMap };
export type { KakaoMapContextValue };
