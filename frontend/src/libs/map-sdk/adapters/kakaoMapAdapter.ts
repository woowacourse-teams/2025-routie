import type {
  LatLngInstanceType,
  MapAdapter,
  MapCreateOptions,
  MapInstanceType,
} from '../types/adapter.types';

/**
 * 카카오 지도 SDK Adapter
 *
 * @description
 * 카카오 지도 SDK를 MapAdapter 인터페이스로 추상화합니다.
 * 다른 지도 SDK로 교체 시 이 어댑터만 교체하면 됩니다.
 */
const kakaoMapAdapter: MapAdapter = {
  /**
   * SDK 로드 완료 여부 확인
   */
  isLoaded(): boolean {
    return !!(
      window.kakao?.maps?.Map && typeof window.kakao.maps.Map === 'function'
    );
  },

  /**
   * SDK 스크립트 로드
   * @param appkey - 카카오 지도 API 앱 키
   * @param libraries - 추가 라이브러리 배열
   */
  load(appkey: string, libraries: string[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      // 이미 로드된 경우
      if (this.isLoaded()) {
        resolve();
        return;
      }

      const script = document.createElement('script');

      const libraryParam =
        libraries.length > 0 ? `&libraries=${libraries.join(',')}` : '';
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appkey}&autoload=false${libraryParam}`;
      script.async = true;

      script.onload = () => {
        if (window.kakao?.maps?.load) {
          window.kakao.maps.load(() => {
            resolve();
          });
        } else {
          reject(new Error('카카오 지도 SDK 초기화에 실패했습니다.'));
        }
      };

      script.onerror = () => {
        reject(new Error('카카오 지도 SDK 스크립트 로드에 실패했습니다.'));
      };

      document.head.appendChild(script);
    });
  },

  /**
   * LatLng 객체 생성
   * @param lat - 위도
   * @param lng - 경도
   */
  createLatLng(lat: number, lng: number): LatLngInstanceType {
    return new window.kakao.maps.LatLng(lat, lng);
  },

  /**
   * 지도 인스턴스 생성
   * @param container - 지도 컨테이너 DOM 요소
   * @param options - 지도 생성 옵션
   */
  createMap(container: HTMLElement, options: MapCreateOptions): MapInstanceType {
    const kakaoOptions = {
      center: this.createLatLng(options.center.lat, options.center.lng),
      level: options.level,
      draggable: options.draggable ?? true,
      scrollwheel: options.scrollwheel ?? true,
    };

    return new window.kakao.maps.Map(container, kakaoOptions);
  },

  /**
   * 지도 relayout 호출
   * @param map - 지도 인스턴스
   */
  relayout(map: MapInstanceType): void {
    map.relayout();
  },
};

export { kakaoMapAdapter };
