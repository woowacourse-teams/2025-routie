import { kakaoMapAdapter } from '../adapters/kakaoMapAdapter';

import type {
  CustomOverlayInstanceType,
  LatLngLiteral,
  MapInstanceType,
  MarkerInstanceType,
} from '../types/adapter.types';

/**
 * 마커 데이터 타입
 */
interface MarkerData {
  id: string;
  position: LatLngLiteral;
  type: 'basic' | 'number';
  title?: string;
  sequence?: number;
  onClick?: () => void;
}

/**
 * 렌더링된 마커 정보
 */
interface RenderedMarker {
  data: MarkerData;
  instance: MarkerInstanceType | CustomOverlayInstanceType;
  content?: HTMLElement; // NumberMarker용
  clickHandler?: () => void;
}

/**
 * 마커 엔진
 *
 * @description
 * 마커 생명주기를 중앙에서 관리하는 엔진입니다.
 * - 컴포넌트는 등록/수정/해제 요청만 보냅니다.
 * - 엔진이 diff를 계산해서 변경분만 SDK에 반영합니다.
 * - requestAnimationFrame으로 배치 처리합니다.
 */
class MarkerEngine {
  private map: MapInstanceType | null = null;
  private registered = new Map<string, MarkerData>();
  private rendered = new Map<string, RenderedMarker>();
  private scheduled = false;

  /**
   * 지도 인스턴스 설정
   */
  setMap(map: MapInstanceType | null) {
    this.map = map;

    if (!map) {
      this.clear();
    }
  }

  /**
   * 지도 인스턴스 반환
   */
  getMap() {
    return this.map;
  }

  /**
   * 마커 등록 (컴포넌트 마운트 시)
   */
  register(data: MarkerData) {
    this.registered.set(data.id, data);
    this.scheduleUpdate();
  }

  /**
   * 마커 업데이트 (컴포넌트 props 변경 시)
   */
  update(data: MarkerData) {
    this.registered.set(data.id, data);
    this.scheduleUpdate();
  }

  /**
   * 마커 해제 (컴포넌트 언마운트 시)
   */
  unregister(id: string) {
    this.registered.delete(id);
    this.scheduleUpdate();
  }

  /**
   * 배치 업데이트 예약
   */
  private scheduleUpdate() {
    if (this.scheduled) return;
    this.scheduled = true;

    window.requestAnimationFrame(() => {
      this.flush();
      this.scheduled = false;
    });
  }

  /**
   * diff 계산 및 SDK 반영
   */
  private flush() {
    if (!this.map) return;

    const prevIds = new Set(this.rendered.keys());
    const nextIds = new Set(this.registered.keys());

    // 1. 삭제된 마커 제거
    for (const id of prevIds) {
      if (!nextIds.has(id)) {
        this.removeMarker(id);
      }
    }

    // 2. 추가/변경된 마커 처리
    for (const [id, data] of this.registered) {
      const existing = this.rendered.get(id);

      if (!existing) {
        // 새로 추가
        this.createMarker(data);
      } else if (this.hasChanged(existing.data, data)) {
        // 변경됨 → 위치만 업데이트 (타입이 바뀌면 재생성)
        if (existing.data.type !== data.type) {
          this.removeMarker(id);
          this.createMarker(data);
        } else {
          this.updateMarker(id, data);
        }
      }
      // unchanged → skip
    }
  }

  /**
   * 변경 여부 확인
   */
  private hasChanged(prev: MarkerData, next: MarkerData): boolean {
    return (
      prev.position.lat !== next.position.lat ||
      prev.position.lng !== next.position.lng ||
      prev.title !== next.title ||
      prev.sequence !== next.sequence ||
      prev.type !== next.type
    );
  }

  /**
   * 마커 생성
   */
  private createMarker(data: MarkerData) {
    if (!this.map) return;

    if (data.type === 'number' && data.sequence !== undefined) {
      this.createNumberMarker(data);
    } else {
      this.createBasicMarker(data);
    }
  }

  /**
   * 기본 마커 생성
   */
  private createBasicMarker(data: MarkerData) {
    if (!this.map) return;

    const marker = kakaoMapAdapter.createMarker(this.map, {
      position: data.position,
      title: data.title,
    });

    const clickHandler = () => data.onClick?.();
    kakaoMapAdapter.addMarkerListener(marker, 'click', clickHandler);

    this.rendered.set(data.id, {
      data,
      instance: marker,
      clickHandler,
    });
  }

  /**
   * 숫자 마커 생성
   */
  private createNumberMarker(data: MarkerData) {
    if (!this.map || data.sequence === undefined) return;

    const content = this.createNumberMarkerElement(data.sequence);

    const overlay = kakaoMapAdapter.createCustomOverlay(this.map, {
      position: data.position,
      content,
      xAnchor: 0.5,
      yAnchor: 0.5,
    });

    const clickHandler = () => data.onClick?.();
    content.addEventListener('click', clickHandler);

    this.rendered.set(data.id, {
      data,
      instance: overlay,
      content,
      clickHandler,
    });
  }

  /**
   * 숫자 마커 DOM 요소 생성
   */
  private createNumberMarkerElement(sequence: number): HTMLElement {
    const content = document.createElement('div');
    Object.assign(content.style, {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '3rem',
      height: '3rem',
      borderRadius: '50%',
      fontSize: '1.6rem',
      fontWeight: 'bold',
      color: 'white',
      background: '#2b6cb0',
    });
    content.innerText = String(sequence);
    return content;
  }

  /**
   * 마커 위치 업데이트
   */
  private updateMarker(id: string, data: MarkerData) {
    const existing = this.rendered.get(id);
    if (!existing) return;

    if (data.type === 'number') {
      kakaoMapAdapter.setCustomOverlayPosition(
        existing.instance as CustomOverlayInstanceType,
        data.position,
      );
    } else {
      kakaoMapAdapter.setMarkerPosition(
        existing.instance as MarkerInstanceType,
        data.position,
      );
    }

    // 데이터 업데이트 (onClick 참조 갱신)
    existing.data = data;
  }

  /**
   * 마커 제거
   */
  private removeMarker(id: string) {
    const existing = this.rendered.get(id);
    if (!existing) return;

    // 이벤트 리스너 제거
    if (existing.clickHandler) {
      if (existing.data.type === 'number' && existing.content) {
        existing.content.removeEventListener('click', existing.clickHandler);
      } else {
        kakaoMapAdapter.removeMarkerListener(
          existing.instance as MarkerInstanceType,
          'click',
          existing.clickHandler,
        );
      }
    }

    // SDK 마커 제거
    if (existing.data.type === 'number') {
      kakaoMapAdapter.removeCustomOverlay(
        existing.instance as CustomOverlayInstanceType,
      );
    } else {
      kakaoMapAdapter.removeMarker(existing.instance as MarkerInstanceType);
    }

    this.rendered.delete(id);
  }

  /**
   * 모든 마커 제거
   */
  clear() {
    for (const id of this.rendered.keys()) {
      this.removeMarker(id);
    }
    this.registered.clear();
  }

  /**
   * 디버그용: 현재 상태 반환
   */
  getState() {
    return {
      registered: this.registered.size,
      rendered: this.rendered.size,
      scheduled: this.scheduled,
      hasMap: this.map !== null,
    };
  }

  /**
   * 테스트용: 엔진 상태 완전 초기화
   */
  reset() {
    this.clear();
    this.map = null;
    this.scheduled = false;
  }
}

// 싱글톤 인스턴스
const markerEngine = new MarkerEngine();

export { markerEngine, MarkerEngine };
export type { MarkerData };
