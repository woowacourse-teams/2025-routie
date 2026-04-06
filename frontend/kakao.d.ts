/**
 * 카카오 지도 SDK 타입 정의
 * @see https://apis.map.kakao.com/web/documentation/
 */

/**
 * 카카오 지도의 좌표를 나타내는 객체
 * @see https://apis.map.kakao.com/web/documentation/#LatLng
 */
interface KakaoLatLng {
  /** 위도를 반환 */
  getLat(): number;
  /** 경도를 반환 */
  getLng(): number;
  /** 두 좌표가 같은지 비교 */
  equals(latlng: KakaoLatLng): boolean;
  /** 문자열로 변환 */
  toString(): string;
}

/**
 * LatLng 생성자 타입
 */
interface KakaoLatLngConstructor {
  /**
   * 좌표 객체 생성
   * @param lat - 위도
   * @param lng - 경도
   */
  new (lat: number, lng: number): KakaoLatLng;
}

/**
 * 사각 영역을 나타내는 좌표 범위 객체
 * @see https://apis.map.kakao.com/web/documentation/#LatLngBounds
 */
interface KakaoLatLngBounds {
  /** 좌표를 포함하도록 영역 확장 */
  extend(latlng: KakaoLatLng): void;
  /** 주어진 좌표가 영역에 포함되는지 확인 */
  contain(latlng: KakaoLatLng): boolean;
  /** 영역이 비어있는지 확인 */
  isEmpty(): boolean;
  /** 남서쪽 좌표 반환 */
  getSouthWest(): KakaoLatLng;
  /** 북동쪽 좌표 반환 */
  getNorthEast(): KakaoLatLng;
  /** 문자열로 변환 */
  toString(): string;
}

/**
 * LatLngBounds 생성자 타입
 */
interface KakaoLatLngBoundsConstructor {
  /** 빈 영역 객체 생성 */
  new (): KakaoLatLngBounds;
  /**
   * 남서쪽, 북동쪽 좌표로 영역 객체 생성
   * @param sw - 남서쪽 좌표
   * @param ne - 북동쪽 좌표
   */
  new (sw: KakaoLatLng, ne: KakaoLatLng): KakaoLatLngBounds;
}

/**
 * 지도 생성 옵션
 * @see https://apis.map.kakao.com/web/documentation/#Map
 */
interface KakaoMapOptions {
  /** 지도 중심 좌표 */
  center: KakaoLatLng;
  /** 지도 확대 레벨 (1~14, 숫자가 작을수록 확대) @default 3 */
  level?: number;
  /** 지도 종류 */
  mapTypeId?: KakaoMapTypeId;
  /** 마우스 드래그로 지도 이동 가능 여부 @default true */
  draggable?: boolean;
  /** 마우스 스크롤로 확대/축소 가능 여부 @default true */
  scrollwheel?: boolean;
  /** 더블클릭으로 확대 가능 여부 @default true */
  disableDoubleClick?: boolean;
  /** 더블클릭 확대 가능 여부 @default true */
  disableDoubleClickZoom?: boolean;
  /** 지도 투영법 */
  projectionId?: string;
  /** 타일 애니메이션 사용 여부 @default true */
  tileAnimation?: boolean;
  /** 키보드로 지도 이동 가능 여부 @default false */
  keyboardShortcuts?: boolean | { speed: number };
}

/**
 * 카카오 지도 인스턴스
 * @see https://apis.map.kakao.com/web/documentation/#Map
 */
interface KakaoMap {
  /** 지도 중심 좌표 설정 */
  setCenter(latlng: KakaoLatLng): void;
  /** 지도 중심 좌표 반환 */
  getCenter(): KakaoLatLng;
  /** 지도 확대 레벨 설정 */
  setLevel(level: number, options?: { anchor?: KakaoLatLng; animate?: boolean | { duration?: number } }): void;
  /** 지도 확대 레벨 반환 */
  getLevel(): number;
  /** 지도 종류 설정 */
  setMapTypeId(mapTypeId: KakaoMapTypeId): void;
  /** 지도 종류 반환 */
  getMapTypeId(): KakaoMapTypeId;
  /** 주어진 좌표를 화면 중심으로 부드럽게 이동 */
  panTo(latlng: KakaoLatLng): void;
  /** 주어진 영역이 화면에 보이도록 지도 레벨과 중심 조정 */
  setBounds(bounds: KakaoLatLngBounds, paddingTop?: number, paddingRight?: number, paddingBottom?: number, paddingLeft?: number): void;
  /** 현재 지도 영역 반환 */
  getBounds(): KakaoLatLngBounds;
  /** 지도 컨테이너 크기 변경 시 호출 */
  relayout(): void;
  /** 드래그 가능 여부 설정 */
  setDraggable(draggable: boolean): void;
  /** 드래그 가능 여부 반환 */
  getDraggable(): boolean;
  /** 스크롤 확대/축소 가능 여부 설정 */
  setZoomable(zoomable: boolean): void;
  /** 스크롤 확대/축소 가능 여부 반환 */
  getZoomable(): boolean;
  /** 프로젝션 객체 반환 */
  getProjection(): KakaoMapProjection;
  /** 로드뷰 도로 오버레이 추가 */
  addOverlayMapTypeId(mapTypeId: KakaoMapTypeId): void;
  /** 로드뷰 도로 오버레이 제거 */
  removeOverlayMapTypeId(mapTypeId: KakaoMapTypeId): void;
  /** 키보드 단축키 사용 여부 설정 */
  setKeyboardShortcuts(shortcuts: boolean): void;
  /** 키보드 단축키 사용 여부 반환 */
  getKeyboardShortcuts(): boolean;
  /** 지도 컨테이너 Node 반환 */
  getNode(): HTMLElement;
}

/**
 * Map 생성자 타입
 */
interface KakaoMapConstructor {
  /**
   * 지도 객체 생성
   * @param container - 지도를 표시할 HTML 요소
   * @param options - 지도 옵션
   */
  new (container: HTMLElement, options: KakaoMapOptions): KakaoMap;
}

/**
 * 지도 투영 객체
 */
interface KakaoMapProjection {
  /** 좌표를 화면 좌표로 변환 */
  pointFromCoords(latlng: KakaoLatLng): KakaoPoint;
  /** 화면 좌표를 좌표로 변환 */
  coordsFromPoint(point: KakaoPoint): KakaoLatLng;
  /** 좌표를 컨테이너 좌표로 변환 */
  containerPointFromCoords(latlng: KakaoLatLng): KakaoPoint;
  /** 컨테이너 좌표를 좌표로 변환 */
  coordsFromContainerPoint(point: KakaoPoint): KakaoLatLng;
}

/**
 * 화면 좌표를 나타내는 객체
 */
interface KakaoPoint {
  x: number;
  y: number;
}

/**
 * 지도 종류 ID
 */
type KakaoMapTypeId = number;

/**
 * 마커 생성 옵션
 * @see https://apis.map.kakao.com/web/documentation/#Marker
 */
interface KakaoMarkerOptions {
  /** 마커가 표시될 지도 */
  map?: KakaoMap;
  /** 마커 위치 */
  position: KakaoLatLng;
  /** 마커 이미지 */
  image?: KakaoMarkerImage;
  /** 마커 제목 (툴팁) */
  title?: string;
  /** 드래그 가능 여부 @default false */
  draggable?: boolean;
  /** 클릭 가능 여부 @default true */
  clickable?: boolean;
  /** z-index */
  zIndex?: number;
  /** 투명도 (0~1) */
  opacity?: number;
  /** 고도 */
  altitude?: number;
  /** 범위 */
  range?: number;
}

/**
 * 카카오 마커 인스턴스
 * @see https://apis.map.kakao.com/web/documentation/#Marker
 */
interface KakaoMarker {
  /** 마커가 표시될 지도 설정 (null이면 제거) */
  setMap(map: KakaoMap | null): void;
  /** 마커가 표시된 지도 반환 */
  getMap(): KakaoMap | null;
  /** 마커 위치 설정 */
  setPosition(position: KakaoLatLng): void;
  /** 마커 위치 반환 */
  getPosition(): KakaoLatLng;
  /** 마커 이미지 설정 */
  setImage(image: KakaoMarkerImage): void;
  /** 마커 이미지 반환 */
  getImage(): KakaoMarkerImage;
  /** 마커 제목 설정 */
  setTitle(title: string): void;
  /** 마커 제목 반환 */
  getTitle(): string;
  /** 드래그 가능 여부 설정 */
  setDraggable(draggable: boolean): void;
  /** 드래그 가능 여부 반환 */
  getDraggable(): boolean;
  /** 클릭 가능 여부 설정 */
  setClickable(clickable: boolean): void;
  /** 클릭 가능 여부 반환 */
  getClickable(): boolean;
  /** z-index 설정 */
  setZIndex(zIndex: number): void;
  /** z-index 반환 */
  getZIndex(): number;
  /** 투명도 설정 */
  setOpacity(opacity: number): void;
  /** 투명도 반환 */
  getOpacity(): number;
  /** 고도 설정 */
  setAltitude(altitude: number): void;
  /** 고도 반환 */
  getAltitude(): number;
  /** 범위 설정 */
  setRange(range: number): void;
  /** 범위 반환 */
  getRange(): number;
}

/**
 * Marker 생성자 타입
 */
interface KakaoMarkerConstructor {
  /**
   * 마커 객체 생성
   * @param options - 마커 옵션
   */
  new (options: KakaoMarkerOptions): KakaoMarker;
}

/**
 * 마커 이미지
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface KakaoMarkerImage {}

/**
 * MarkerImage 생성자 타입
 */
interface KakaoMarkerImageConstructor {
  /**
   * 마커 이미지 객체 생성
   * @param src - 이미지 URL
   * @param size - 이미지 크기
   * @param options - 이미지 옵션
   */
  new (src: string, size: KakaoSize, options?: KakaoMarkerImageOptions): KakaoMarkerImage;
}

/**
 * 마커 이미지 옵션
 */
interface KakaoMarkerImageOptions {
  /** 마커 고정점 */
  offset?: KakaoPoint;
  /** 이미지 내 마커 영역 좌표 */
  coords?: string;
  /** 이미지 내 마커 영역 형태 */
  shape?: string;
  /** 스프라이트 이미지 사용 시 원본 이미지 크기 */
  spriteSize?: KakaoSize;
  /** 스프라이트 이미지 사용 시 이미지 내 마커 영역 좌표 */
  spriteOrigin?: KakaoPoint;
}

/**
 * 크기 객체
 */
interface KakaoSize {
  width: number;
  height: number;
}

/**
 * Size 생성자 타입
 */
interface KakaoSizeConstructor {
  /**
   * 크기 객체 생성
   * @param width - 너비
   * @param height - 높이
   */
  new (width: number, height: number): KakaoSize;
}

/**
 * 커스텀 오버레이 생성 옵션
 * @see https://apis.map.kakao.com/web/documentation/#CustomOverlay
 */
interface KakaoCustomOverlayOptions {
  /** 오버레이가 표시될 지도 */
  map?: KakaoMap;
  /** 오버레이 위치 */
  position: KakaoLatLng;
  /** 오버레이 내용 (HTML 문자열 또는 DOM 요소) */
  content: string | HTMLElement;
  /** 클릭 가능 여부 @default false */
  clickable?: boolean;
  /** x축 기준점 ('left' | 'center' | 'right') @default 'center' */
  xAnchor?: number;
  /** y축 기준점 ('top' | 'center' | 'bottom') @default 'bottom' */
  yAnchor?: number;
  /** z-index */
  zIndex?: number;
}

/**
 * 카카오 커스텀 오버레이 인스턴스
 * @see https://apis.map.kakao.com/web/documentation/#CustomOverlay
 */
interface KakaoCustomOverlay {
  /** 오버레이가 표시될 지도 설정 (null이면 제거) */
  setMap(map: KakaoMap | null): void;
  /** 오버레이가 표시된 지도 반환 */
  getMap(): KakaoMap | null;
  /** 오버레이 위치 설정 */
  setPosition(position: KakaoLatLng): void;
  /** 오버레이 위치 반환 */
  getPosition(): KakaoLatLng;
  /** 오버레이 내용 설정 */
  setContent(content: string | HTMLElement): void;
  /** 오버레이 내용 반환 */
  getContent(): string | HTMLElement;
  /** z-index 설정 */
  setZIndex(zIndex: number): void;
  /** z-index 반환 */
  getZIndex(): number;
  /** 고도 설정 */
  setAltitude(altitude: number): void;
  /** 고도 반환 */
  getAltitude(): number;
  /** 범위 설정 */
  setRange(range: number): void;
  /** 범위 반환 */
  getRange(): number;
}

/**
 * CustomOverlay 생성자 타입
 */
interface KakaoCustomOverlayConstructor {
  /**
   * 커스텀 오버레이 객체 생성
   * @param options - 오버레이 옵션
   */
  new (options: KakaoCustomOverlayOptions): KakaoCustomOverlay;
}

/**
 * 폴리라인 생성 옵션
 * @see https://apis.map.kakao.com/web/documentation/#Polyline
 */
interface KakaoPolylineOptions {
  /** 폴리라인이 표시될 지도 */
  map?: KakaoMap;
  /** 폴리라인 경로 좌표 배열 */
  path: KakaoLatLng[] | KakaoLatLng[][];
  /** 끝점 모양 ('butt' | 'round' | 'square') @default 'butt' */
  endArrow?: boolean;
  /** 선 색상 (CSS 색상 값) @default '#F10000' */
  strokeColor?: string;
  /** 선 굵기 (픽셀) @default 3 */
  strokeWeight?: number;
  /** 선 투명도 (0~1) @default 0.6 */
  strokeOpacity?: number;
  /** 선 스타일 ('solid' | 'shortdash' | 'shortdot' | 'shortdashdot' | 'shortdashdotdot' | 'dot' | 'dash' | 'dashdot' | 'longdash' | 'longdashdot' | 'longdashdotdot') @default 'solid' */
  strokeStyle?: string;
  /** z-index */
  zIndex?: number;
}

/**
 * 카카오 폴리라인 인스턴스
 * @see https://apis.map.kakao.com/web/documentation/#Polyline
 */
interface KakaoPolyline {
  /** 폴리라인이 표시될 지도 설정 (null이면 제거) */
  setMap(map: KakaoMap | null): void;
  /** 폴리라인이 표시된 지도 반환 */
  getMap(): KakaoMap | null;
  /** 폴리라인 경로 설정 */
  setPath(path: KakaoLatLng[]): void;
  /** 폴리라인 경로 반환 */
  getPath(): KakaoLatLng[];
  /** 폴리라인 길이 반환 (미터) */
  getLength(): number;
  /** 선 색상 설정 */
  setStrokeColor(color: string): void;
  /** 선 굵기 설정 */
  setStrokeWeight(weight: number): void;
  /** 선 투명도 설정 */
  setStrokeOpacity(opacity: number): void;
  /** 선 스타일 설정 */
  setStrokeStyle(style: string): void;
  /** z-index 설정 */
  setZIndex(zIndex: number): void;
}

/**
 * Polyline 생성자 타입
 */
interface KakaoPolylineConstructor {
  /**
   * 폴리라인 객체 생성
   * @param options - 폴리라인 옵션
   */
  new (options: KakaoPolylineOptions): KakaoPolyline;
}

/**
 * 정보창 생성 옵션
 * @see https://apis.map.kakao.com/web/documentation/#InfoWindow
 */
interface KakaoInfoWindowOptions {
  /** 정보창이 표시될 지도 */
  map?: KakaoMap;
  /** 정보창 위치 */
  position?: KakaoLatLng;
  /** 정보창 내용 (HTML 문자열 또는 DOM 요소) */
  content?: string | HTMLElement;
  /** 닫기 가능 여부 @default false */
  removable?: boolean;
  /** z-index */
  zIndex?: number;
  /** 고도 */
  altitude?: number;
  /** 범위 */
  range?: number;
}

/**
 * 카카오 정보창 인스턴스
 * @see https://apis.map.kakao.com/web/documentation/#InfoWindow
 */
interface KakaoInfoWindow {
  /** 지도 또는 마커에 정보창 표시 */
  open(map: KakaoMap, marker?: KakaoMarker): void;
  /** 정보창 닫기 */
  close(): void;
  /** 정보창 위치 설정 */
  setPosition(position: KakaoLatLng): void;
  /** 정보창 위치 반환 */
  getPosition(): KakaoLatLng;
  /** 정보창 내용 설정 */
  setContent(content: string | HTMLElement): void;
  /** 정보창 내용 반환 */
  getContent(): string | HTMLElement;
  /** z-index 설정 */
  setZIndex(zIndex: number): void;
  /** z-index 반환 */
  getZIndex(): number;
  /** 고도 설정 */
  setAltitude(altitude: number): void;
  /** 고도 반환 */
  getAltitude(): number;
  /** 범위 설정 */
  setRange(range: number): void;
  /** 범위 반환 */
  getRange(): number;
  /** 지도 반환 */
  getMap(): KakaoMap | null;
}

/**
 * InfoWindow 생성자 타입
 */
interface KakaoInfoWindowConstructor {
  /**
   * 정보창 객체 생성
   * @param options - 정보창 옵션
   */
  new (options: KakaoInfoWindowOptions): KakaoInfoWindow;
}

/**
 * 이벤트 리스너 함수 타입
 */
type KakaoEventListener = (...args: unknown[]) => void;

/**
 * 카카오 지도 이벤트 시스템
 * @see https://apis.map.kakao.com/web/documentation/#event
 */
interface KakaoEvent {
  /**
   * 이벤트 리스너 등록
   * @param target - 이벤트 대상 객체
   * @param type - 이벤트 타입
   * @param handler - 이벤트 핸들러
   */
  addListener(target: KakaoMap | KakaoMarker | KakaoPolyline | KakaoCustomOverlay, type: string, handler: KakaoEventListener): void;
  /**
   * 이벤트 리스너 제거
   * @param target - 이벤트 대상 객체
   * @param type - 이벤트 타입
   * @param handler - 이벤트 핸들러
   */
  removeListener(target: KakaoMap | KakaoMarker | KakaoPolyline | KakaoCustomOverlay, type: string, handler: KakaoEventListener): void;
  /**
   * 이벤트 발생
   * @param target - 이벤트 대상 객체
   * @param type - 이벤트 타입
   * @param data - 이벤트 데이터
   */
  trigger(target: KakaoMap | KakaoMarker | KakaoPolyline | KakaoCustomOverlay, type: string, data?: unknown): void;
  /**
   * 지도 클릭 시 좌표 반환용 래핑 함수
   * @param map - 지도 객체
   * @param handler - 좌표를 받는 핸들러
   */
  preventMap(): void;
}

/**
 * 경로 우선순위
 */
interface KakaoRoutePriority {
  /** 도보 경로 */
  WALKING: unknown;
}

/**
 * 서비스 상태
 */
interface KakaoServiceStatus {
  /** 성공 */
  OK: string;
  /** 에러 */
  ERROR: string;
  /** 결과 없음 */
  ZERO_RESULT: string;
}

/**
 * 경로 서비스 결과 콜백 파라미터
 */
interface KakaoDirectionResult {
  routes: Array<{
    sections: Array<{
      roads: Array<{
        vertexes: number[];
      }>;
    }>;
  }>;
}

/**
 * 경로 서비스
 */
interface KakaoDirectionService {
  /** 경로 검색 */
  route(
    options: {
      origin: KakaoLatLng;
      destination: KakaoLatLng;
      waypoints?: KakaoLatLng[];
      priority?: unknown;
    },
    callback: (result: KakaoDirectionResult, status: string) => void
  ): void;
}

/**
 * DirectionService 생성자 타입
 */
interface KakaoDirectionServiceConstructor {
  new (): KakaoDirectionService;
}

/**
 * 카카오 지도 서비스 네임스페이스
 */
interface KakaoServices {
  DirectionService: KakaoDirectionServiceConstructor;
  Status: KakaoServiceStatus;
}

/**
 * 카카오 지도 SDK 전체 네임스페이스
 * @see https://apis.map.kakao.com/web/documentation/
 */
interface KakaoMapsNamespace {
  /**
   * SDK 초기화 완료 후 콜백 실행
   * autoload=false 설정 시 필수
   * @param callback - 초기화 완료 후 실행할 콜백
   */
  load: (callback: () => void) => void;
  /** 좌표 클래스 */
  LatLng: KakaoLatLngConstructor;
  /** 좌표 범위 클래스 */
  LatLngBounds: KakaoLatLngBoundsConstructor;
  /** 지도 클래스 */
  Map: KakaoMapConstructor;
  /** 마커 클래스 */
  Marker: KakaoMarkerConstructor;
  /** 마커 이미지 클래스 */
  MarkerImage: KakaoMarkerImageConstructor;
  /** 커스텀 오버레이 클래스 */
  CustomOverlay: KakaoCustomOverlayConstructor;
  /** 폴리라인 클래스 */
  Polyline: KakaoPolylineConstructor;
  /** 정보창 클래스 */
  InfoWindow: KakaoInfoWindowConstructor;
  /** 크기 클래스 */
  Size: KakaoSizeConstructor;
  /** 이벤트 시스템 */
  event: KakaoEvent;
  /** 경로 우선순위 */
  RoutePriority: KakaoRoutePriority;
  /** 서비스 네임스페이스 */
  services: KakaoServices;
}

declare global {
  interface Window {
    kakao: {
      maps: KakaoMapsNamespace;
    };
  }
}

export type {
  KakaoLatLng,
  KakaoLatLngBounds,
  KakaoMap,
  KakaoMapOptions,
  KakaoMarker,
  KakaoMarkerOptions,
  KakaoMarkerImage,
  KakaoCustomOverlay,
  KakaoCustomOverlayOptions,
  KakaoPolyline,
  KakaoPolylineOptions,
  KakaoInfoWindow,
  KakaoInfoWindowOptions,
  KakaoEvent,
  KakaoEventListener,
  KakaoMapsNamespace,
  KakaoSize,
  KakaoPoint,
  KakaoMapProjection,
};
